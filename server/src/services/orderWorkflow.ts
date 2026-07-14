import { v4 as uuid } from 'uuid';
import type { OrderStatus } from '../models/Order.js';
import { IOrder, Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { InventoryLog } from '../models/InventoryLog.js';
import { createNotification } from './notifications.js';
import { sendEmail, emailTemplates } from './email.js';
import { sendWhatsApp, orderWhatsAppMessage, notifyStoreOrderUpdate } from './whatsapp.js';
import { logActivity } from './activityLog.js';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Order Received',
  confirmed: 'Order Confirmed',
  payment_verified: 'Payment Verified',
  processing: 'Processing',
  packed: 'Packed',
  quality_checked: 'Quality Checked',
  ready_to_ship: 'Ready to Ship',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refund_requested: 'Refund Requested',
  refund_approved: 'Refund Approved',
  refund_completed: 'Refund Completed',
  returned: 'Returned',
  rejected: 'Rejected',
};

export function generateOrderNumber() {
  return `HT-${Date.now().toString().slice(-8)}`;
}

export function generateTrackingNumber() {
  return `TRK-${uuid().slice(0, 12).toUpperCase()}`;
}

export async function deductStock(items: IOrder['items']) {
  for (const line of items) {
    const product = await Product.findOne({ slug: line.productId }).catch(() =>
      Product.findById(line.productId)
    );
    if (!product) continue;
    const variant = product.variants.find((v) => v.id === line.variantId);
    if (variant) {
      const prev = variant.stock;
      variant.stock = Math.max(0, variant.stock - line.quantity);
      product.stock = product.variants.reduce((s, v) => s + v.stock, 0);
      await InventoryLog.create({
        productId: product.slug,
        sku: variant.sku,
        change: -line.quantity,
        reason: 'order_deduction',
        previousStock: prev,
        newStock: variant.stock,
        orderId: line.productId,
      });
    } else {
      const prev = product.stock;
      product.stock = Math.max(0, product.stock - line.quantity);
      await InventoryLog.create({
        productId: product.slug,
        sku: product.sku,
        change: -line.quantity,
        reason: 'order_deduction',
        previousStock: prev,
        newStock: product.stock,
      });
    }
    await product.save();
  }
}

export async function updateOrderStatus(
  order: IOrder,
  status: OrderStatus,
  description?: string
) {
  order.status = status;
  order.events.push({
    status,
    label: STATUS_LABELS[status],
    description: description ?? STATUS_LABELS[status],
    date: new Date(),
    completed: !['pending', 'processing', 'refund_requested'].includes(status),
  });
  await order.save();

  if (order.userId) {
    await createNotification({
      userId: order.userId,
      title: STATUS_LABELS[status],
      body: `Order ${order.number}: ${description ?? STATUS_LABELS[status]}`,
      kind: 'order',
      metadata: { orderId: order._id, status },
    });
  }

  const customerName =
    (order.shippingAddress?.firstName as string) ?? 'Customer';
  const phone = order.shippingAddress?.phone as string | undefined;
  const email = order.guestEmail;

  const waMsg = orderWhatsAppMessage({
    customerName,
    orderNumber: order.number,
    status: STATUS_LABELS[status],
    total: order.total,
    trackingNumber: order.trackingNumber,
  });

  if (phone) await sendWhatsApp(phone, waMsg).catch(() => {});
  await notifyStoreOrderUpdate(order, STATUS_LABELS[status], description).catch(() => {});
  if (email && ['confirmed', 'shipped', 'delivered'].includes(status)) {
    const tpl =
      status === 'shipped'
        ? emailTemplates.shipping(customerName, order.number, order.trackingNumber)
        : emailTemplates.orderConfirmation(customerName, order.number, order.total);
    await sendEmail(email, tpl.subject, tpl.html);
  }

  await logActivity({
    userId: order.userId,
    action: 'order_status_update',
    entity: 'order',
    entityId: order._id.toString(),
    metadata: { status, number: order.number },
  });

  return order;
}

export async function getOrderByNumberOrId(id: string) {
  if (id.startsWith('HT-')) return Order.findOne({ number: id });
  return Order.findById(id);
}
