import { Router } from 'express';
import { z } from 'zod';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Coupon } from '../models/Coupon.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { updateOrderStatus } from '../services/orderWorkflow.js';
import type { OrderStatus } from '../models/Order.js';

const router = Router();
router.use(authenticate, authorize('admin', 'manager', 'sales', 'support'));

router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    const [orders, revenue, customers, products] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);
    const lowStock = await Product.find({ stock: { $lte: 8 }, isActive: true }).limit(10);

    res.json({
      analytics: {
        revenue: revenue[0]?.total ?? 0,
        orders,
        customers,
        products,
        conversion: 4.2,
        series: recentOrders.map((o) => ({ label: o.number, value: o.total })),
      },
      recentOrders,
      lowStock,
    });
  })
);

router.get(
  '/orders',
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ orders });
  })
);

router.patch(
  '/orders/:id/status',
  asyncHandler(async (req: AuthRequest, res) => {
    const { status, note } = z
      .object({ status: z.string(), note: z.string().optional() })
      .parse(req.body);
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError(404, 'Order not found');
    const updated = await updateOrderStatus(order, status as OrderStatus, note);
    res.json({ order: updated });
  })
);

router.get(
  '/products',
  asyncHandler(async (_req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  })
);

router.get(
  '/customers',
  asyncHandler(async (_req, res) => {
    const customers = await User.find({ role: 'customer' }).select('-passwordHash');
    res.json({ customers });
  })
);

router.get(
  '/coupons',
  asyncHandler(async (_req, res) => {
    const coupons = await Coupon.find();
    res.json({ coupons });
  })
);

router.post(
  '/coupons',
  asyncHandler(async (req, res) => {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ coupon });
  })
);

router.get(
  '/logs',
  asyncHandler(async (_req, res) => {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(200);
    res.json({ logs });
  })
);

router.get(
  '/export/:section',
  asyncHandler(async (req, res) => {
    const section = req.params.section;
    res.json({ csv: `section,exported\n${section},true` });
  })
);

export default router;
