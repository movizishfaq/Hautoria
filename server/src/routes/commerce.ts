import { Router } from 'express';
import { z } from 'zod';
import { Coupon } from '../models/Coupon.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth.js';
import {
  deductStock,
  generateOrderNumber,
  generateTrackingNumber,
  updateOrderStatus,
  getOrderByNumberOrId,
} from '../services/orderWorkflow.js';
import { generateInvoicePdf } from '../services/invoice.js';
import { sendEmail, emailTemplates } from '../services/email.js';
import { sendWhatsApp, orderWhatsAppMessage, notifyStoreNewOrder } from '../services/whatsapp.js';
import { createNotification } from '../services/notifications.js';

const router = Router();

router.post(
  '/coupons/validate',
  asyncHandler(async (req, res) => {
    const { code, subtotal } = z
      .object({ code: z.string(), subtotal: z.number().min(0) })
      .parse(req.body);

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      active: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    });

    if (!coupon || coupon.usedCount >= coupon.usageLimit) {
      return res.json({ valid: false, discount: 0, label: 'Code not recognised' });
    }
    if (subtotal < coupon.minPurchase) {
      return res.json({
        valid: false,
        discount: 0,
        label: `Minimum purchase Rs. ${coupon.minPurchase}`,
      });
    }

    let discount = 0;
    if (coupon.type === 'percent') discount = Math.round(subtotal * (coupon.amount / 100));
    if (coupon.type === 'fixed') discount = coupon.amount;
    if (coupon.type === 'free_shipping') discount = 0;

    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

    res.json({
      valid: true,
      discount,
      freeShipping: coupon.type === 'free_shipping',
      label: coupon.description,
      code: coupon.code,
    });
  })
);

const checkoutSchema = z.object({
  email: z.string().email(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1),
  shippingAddress: z.record(z.string()),
  billingAddress: z.record(z.string()).optional(),
  shippingMethod: z.enum(['standard', 'express']).default('standard'),
  paymentProvider: z.string(),
  couponCode: z.string().optional(),
  guestCheckout: z.boolean().optional(),
});

router.post(
  '/checkout',
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = checkoutSchema.parse(req.body);
    const lines = [];
    let subtotal = 0;

    for (const item of body.items) {
      const isObjectId = /^[a-f\d]{24}$/i.test(item.productId);
      const product = await Product.findOne({
        isActive: true,
        ...(isObjectId
          ? { $or: [{ slug: item.productId }, { _id: item.productId }] }
          : { slug: item.productId }),
      });
      if (!product) throw new AppError(400, `Product not found: ${item.productId}`);

      const variant =
        product.variants.find((v) => v.id === item.variantId) ?? product.variants[0];
      if (!variant || variant.stock < item.quantity) {
        throw new AppError(400, `${product.name} is out of stock`, 'OUT_OF_STOCK');
      }

      const unitPrice = variant.price ?? product.price;
      subtotal += unitPrice * item.quantity;
      lines.push({
        productId: product.slug,
        productName: product.name,
        image: product.image,
        variantName: variant.name,
        variantId: variant.id,
        sku: variant.sku,
        quantity: item.quantity,
        unitPrice,
      });
    }

    let discount = 0;
    let freeShipping = false;
    if (body.couponCode) {
      const coupon = await Coupon.findOne({
        code: body.couponCode.toUpperCase(),
        active: true,
      });
      if (coupon && subtotal >= coupon.minPurchase) {
        if (coupon.type === 'percent') discount = Math.round(subtotal * (coupon.amount / 100));
        if (coupon.type === 'fixed') discount = coupon.amount;
        if (coupon.type === 'free_shipping') freeShipping = true;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const shipping = freeShipping ? 0 : 250;
    const tax = Math.round(subtotal * 0.05);
    const total = Math.max(0, subtotal + shipping + tax - discount);

    const paymentVerified =
      body.paymentProvider === 'cod' ||
      body.paymentProvider === 'bank_transfer' ||
      body.paymentProvider === 'jazzcash';

    const order = await Order.create({
      number: generateOrderNumber(),
      userId: req.userId,
      guestEmail: req.userId ? undefined : body.email,
      status: paymentVerified ? 'payment_verified' : 'pending',
      trackingNumber: generateTrackingNumber(),
      items: lines,
      shippingAddress: body.shippingAddress,
      billingAddress: body.billingAddress,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      couponCode: body.couponCode,
      paymentProvider: body.paymentProvider,
      paymentStatus: paymentVerified ? 'verified' : 'pending',
      events: [
        {
          status: 'pending',
          label: 'Order Received',
          description: 'Your order has been received.',
          date: new Date(),
          completed: true,
        },
      ],
    });

    if (paymentVerified) {
      await updateOrderStatus(order, 'confirmed', 'Order confirmed — payment on delivery');
    }

    await deductStock(lines);
    await order.save();
    const fresh = await Order.findById(order._id);

    const customerName = (body.shippingAddress.firstName as string) ?? 'Customer';
    const phone = body.shippingAddress.phone as string | undefined;

    const tpl = emailTemplates.orderConfirmation(customerName, order.number, total);
    await sendEmail(body.email, tpl.subject, tpl.html).catch(() => {});

    if (phone) {
      await sendWhatsApp(
        phone,
        orderWhatsAppMessage({
          customerName,
          orderNumber: order.number,
          status: 'Order Placed',
          total: order.total,
          trackingNumber: order.trackingNumber,
        })
      ).catch(() => {});
    }

    await notifyStoreNewOrder(fresh ?? order, {
      customerName,
      email: body.email,
      phone,
    }).catch(() => {});

    if (req.userId) {
      await createNotification({
        userId: req.userId,
        title: 'Order placed',
        body: `Order ${order.number} confirmed. Total Rs. ${total.toLocaleString()}`,
        kind: 'order',
      });
    }

    const out = fresh ?? order;
    res.status(201).json({
      order: {
        id: out._id.toString(),
        number: out.number,
        status: out.status,
        trackingNumber: out.trackingNumber,
        total: out.total,
        subtotal: out.subtotal,
        tax: out.tax,
        shipping: out.shipping,
        discount: out.discount,
        items: out.items,
        shippingAddress: out.shippingAddress,
        paymentProvider: out.paymentProvider,
        events: out.events,
        createdAt: out.createdAt,
      },
    });
  })
);

router.get(
  '/orders',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  })
);

router.get(
  '/orders/:id',
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const order = await getOrderByNumberOrId(String(req.params.id));
    if (!order) throw new AppError(404, 'Order not found');
    if (order.userId && order.userId !== req.userId && req.user?.role !== 'admin') {
      throw new AppError(403, 'Access denied');
    }
    res.json({ order });
  })
);

router.get(
  '/orders/:id/track',
  asyncHandler(async (req, res) => {
    const order = await getOrderByNumberOrId(String(req.params.id));
    if (!order) throw new AppError(404, 'Order not found');
    res.json({
      number: order.number,
      trackingNumber: order.trackingNumber,
      status: order.status,
      courier: order.courier,
      estimatedDelivery: order.estimatedDelivery,
      timeline: order.events,
    });
  })
);

router.get(
  '/orders/:id/invoice',
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const order = await getOrderByNumberOrId(String(req.params.id));
    if (!order) throw new AppError(404, 'Order not found');
    const pdf = await generateInvoicePdf(order);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${order.number}-invoice.pdf"`);
    res.send(pdf);
  })
);

router.post(
  '/orders/:id/return',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = z.object({ reason: z.string().min(10), type: z.enum(['return', 'refund', 'cancel']) }).parse(req.body);
    const order = await getOrderByNumberOrId(String(req.params.id));
    if (!order || order.userId !== req.userId) throw new AppError(404, 'Order not found');
    await updateOrderStatus(order, 'refund_requested', body.reason);
    res.json({ accepted: true, type: body.type });
  })
);

export default router;
