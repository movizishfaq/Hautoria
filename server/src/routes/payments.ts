import { Router } from 'express';
import { z } from 'zod';
import { Order } from '../models/Order.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { updateOrderStatus } from '../services/orderWorkflow.js';
import { env } from '../config/env.js';
import { logActivity } from '../services/activityLog.js';

const router = Router();

router.post(
  '/stripe/confirm',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = z
      .object({
        orderId: z.string(),
        paymentIntentId: z.string(),
      })
      .parse(req.body);

    if (!env.stripeSecret) {
      throw new AppError(503, 'Stripe is not configured', 'STRIPE_NOT_CONFIGURED');
    }

    const order = await Order.findById(body.orderId);
    if (!order || order.userId !== req.userId) {
      throw new AppError(404, 'Order not found');
    }

    order.paymentStatus = 'verified';
    order.paymentReference = body.paymentIntentId;
    await order.save();
    await updateOrderStatus(order, 'payment_verified', 'Card payment confirmed');
    await updateOrderStatus(order, 'confirmed', 'Order confirmed');

    await logActivity({
      userId: req.userId,
      action: 'payment_verified',
      entity: 'payment',
      entityId: body.paymentIntentId,
      metadata: { provider: 'stripe', orderId: order.number },
    });

    res.json({ verified: true, orderId: order._id });
  })
);

router.post(
  '/paypal/confirm',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = z
      .object({
        orderId: z.string(),
        paypalOrderId: z.string(),
      })
      .parse(req.body);

    const order = await Order.findById(body.orderId);
    if (!order || order.userId !== req.userId) {
      throw new AppError(404, 'Order not found');
    }

    order.paymentStatus = 'verified';
    order.paymentReference = body.paypalOrderId;
    await order.save();
    await updateOrderStatus(order, 'payment_verified', 'PayPal payment confirmed');
    await updateOrderStatus(order, 'confirmed', 'Order confirmed');

    res.json({ verified: true, orderId: order._id });
  })
);

router.post(
  '/cod/confirm',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const { orderId } = z.object({ orderId: z.string() }).parse(req.body);
    const order = await Order.findById(orderId);
    if (!order) throw new AppError(404, 'Order not found');
    order.paymentStatus = 'pending';
    await order.save();
    res.json({ accepted: true, message: 'COD order awaiting delivery payment' });
  })
);

export default router;
