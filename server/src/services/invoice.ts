import PDFDocument from 'pdfkit';
import { env } from '../config/env.js';
import type { IOrder } from '../models/Order.js';

export async function generateInvoicePdf(order: IOrder): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(22).text(env.storeName, { align: 'left' });
    doc.fontSize(10).text(env.storeTagline);
    doc.moveDown();
    doc.fontSize(14).text(`Invoice — ${order.number}`);
    doc.fontSize(10).text(`Date: ${order.createdAt.toLocaleDateString()}`);
    doc.text(`Tracking: ${order.trackingNumber}`);
    doc.moveDown();

    order.items.forEach((item) => {
      doc.text(
        `${item.productName} (${item.variantName}) x${item.quantity} — Rs. ${(item.unitPrice * item.quantity).toLocaleString()}`
      );
    });

    doc.moveDown();
    doc.text(`Subtotal: Rs. ${order.subtotal.toLocaleString()}`);
    doc.text(`Shipping: Rs. ${order.shipping.toLocaleString()}`);
    doc.text(`Tax: Rs. ${order.tax.toLocaleString()}`);
    if (order.discount) doc.text(`Discount: -Rs. ${order.discount.toLocaleString()}`);
    doc.fontSize(12).text(`Grand Total: Rs. ${order.total.toLocaleString()}`, { underline: true });
    doc.end();
  });
}
