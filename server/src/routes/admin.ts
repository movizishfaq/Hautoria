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
import { toAdminProduct, toClientOrder } from '../utils/serializers.js';

const router = Router();
router.use(authenticate, authorize('admin', 'manager', 'sales', 'support'));

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const productFieldsSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1),
  brand: z.string().optional(),
  concerns: z.array(z.string()).optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().optional(),
  stock: z.number().int().min(0),
  image: z.string().min(1),
  accent: z.string().optional(),
  badges: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
});

const createProductSchema = productFieldsSchema.extend({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
});

const couponSchema = z.object({
  code: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(['percent', 'fixed', 'free_shipping']),
  amount: z.number().min(0),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().optional(),
  usageLimit: z.number().int().positive().optional(),
  active: z.boolean().optional(),
});

function emptyRevenueSeries() {
  const series: Array<{ label: string; value: number }> = [];
  const now = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    series.push({ label: DAY_LABELS[day.getDay()], value: 0 });
  }
  return series;
}

const ORDER_LIST_SELECT =
  'number status createdAt total subtotal tax shipping discount paymentProvider paymentStatus trackingNumber courier guestEmail items shippingAddress notes events';

router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - 6);

    const [
      orderCount,
      revenueAgg,
      customers,
      products,
      recentOrders,
      lowStock,
      statusAgg,
      weekRevenue,
      todayOrders,
      todayRevenueAgg,
      pendingCount,
      completedCount,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
      Order.find()
        .select(ORDER_LIST_SELECT)
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Product.find({ stock: { $lte: 8 }, isActive: true })
        .select(
          'slug name tagline description category brand concerns price compareAtPrice rating reviewCount stock image gallery accent badges ingredients featured isActive sku variants lowStockThreshold createdAt updatedAt'
        )
        .limit(10)
        .lean(),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: weekStart } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
                timezone: 'Asia/Karachi',
              },
            },
            total: { $sum: '$total' },
          },
        },
      ]),
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments({
        status: { $in: ['pending', 'confirmed', 'payment_verified', 'processing'] },
      }),
      Order.countDocuments({
        status: { $in: ['delivered', 'completed'] },
      }),
    ]);

    const byDay = new Map(
      weekRevenue.map((row: { _id: string; total: number }) => [row._id, row.total])
    );
    const series = emptyRevenueSeries().map((bucket, index) => {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - (6 - index));
      const key = [
        day.getFullYear(),
        String(day.getMonth() + 1).padStart(2, '0'),
        String(day.getDate()).padStart(2, '0'),
      ].join('-');
      return { label: bucket.label, value: byDay.get(key) ?? 0 };
    });

    const pipeline = Object.fromEntries(
      statusAgg.map((row: { _id: string; count: number }) => [row._id, row.count])
    );

    const revenue = revenueAgg[0]?.total ?? 0;
    // Real conversion proxy: completed / total orders (not a fake constant).
    const conversion =
      orderCount > 0 ? Math.round((completedCount / orderCount) * 1000) / 10 : 0;

    res.json({
      analytics: {
        revenue,
        orders: orderCount,
        customers,
        products,
        conversion,
        todayOrders,
        todayRevenue: todayRevenueAgg[0]?.total ?? 0,
        pendingOrders: pendingCount,
        completedOrders: completedCount,
        series,
        pipeline,
      },
      recentOrders: recentOrders.map((o) => toClientOrder(o as never)),
      lowStock: lowStock.map((p) => toAdminProduct(p as never)),
    });
  })
);

router.get(
  '/orders',
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;
    const q = String(req.query.q ?? '').trim();
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 50)));
    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;
    if (q) {
      filter.$or = [
        { number: { $regex: q, $options: 'i' } },
        { guestEmail: { $regex: q, $options: 'i' } },
        { 'shippingAddress.firstName': { $regex: q, $options: 'i' } },
        { 'shippingAddress.lastName': { $regex: q, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: q, $options: 'i' } },
      ];
    }
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .select(ORDER_LIST_SELECT)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);
    res.json({
      orders: orders.map((o) => toClientOrder(o as never)),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    });
  })
);

router.get(
  '/orders/:id',
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError(404, 'Order not found');
    res.json({ order: toClientOrder(order) });
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
    res.json({ order: toClientOrder(updated) });
  })
);

router.delete(
  '/orders/:id',
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError(404, 'Order not found');
    if (!['cancelled', 'rejected', 'pending'].includes(order.status)) {
      throw new AppError(
        400,
        'Only pending, cancelled, or rejected orders can be deleted. Cancel the order first.'
      );
    }
    await order.deleteOne();
    res.json({ ok: true, id: req.params.id });
  })
);

router.get(
  '/products',
  asyncHandler(async (_req, res) => {
    const products = await Product.find()
      .select(
        'slug name tagline description category brand concerns price compareAtPrice rating reviewCount stock image gallery accent badges ingredients featured isActive sku variants lowStockThreshold createdAt updatedAt'
      )
      .sort({ createdAt: -1 })
      .lean();
    res.json({ products: products.map((p) => toAdminProduct(p as never)) });
  })
);

router.get(
  '/products/:slug',
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) throw new AppError(404, 'Product not found');
    res.json({ product: toAdminProduct(product) });
  })
);

router.post(
  '/products',
  asyncHandler(async (req, res) => {
    const body = createProductSchema.parse(req.body);
    const exists = await Product.findOne({ slug: body.slug });
    if (exists) throw new AppError(409, 'Product slug already exists');

    const sku = `HT-${body.slug.slice(0, 12).toUpperCase()}`;
    const product = await Product.create({
      ...body,
      gallery: [body.image],
      accent: body.accent ?? 'bg-beige',
      badges: body.badges ?? [],
      ingredients: body.ingredients ?? [],
      concerns: body.concerns ?? [],
      tags: body.concerns ?? [],
      featured: body.featured ?? false,
      isActive: body.isActive ?? true,
      sku,
      variants: [
        {
          id: `${body.slug}-default`,
          name: 'Standard',
          sku,
          price: body.price,
          compareAtPrice: body.compareAtPrice,
          stock: body.stock,
        },
      ],
    });

    res.status(201).json({ product: toAdminProduct(product) });
  })
);

router.patch(
  '/products/:slug',
  asyncHandler(async (req, res) => {
    const body = productFieldsSchema.partial().parse(req.body);
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) throw new AppError(404, 'Product not found');

    if (body.name !== undefined) product.name = body.name;
    if (body.tagline !== undefined) product.tagline = body.tagline;
    if (body.description !== undefined) product.description = body.description;
    if (body.category !== undefined) product.category = body.category;
    if (body.brand !== undefined) product.brand = body.brand;
    if (body.concerns !== undefined) {
      product.concerns = body.concerns;
      product.tags = body.concerns;
    }
    if (body.price !== undefined) product.price = body.price;
    if (body.compareAtPrice !== undefined) product.compareAtPrice = body.compareAtPrice;
    if (body.stock !== undefined) product.stock = body.stock;
    if (body.image !== undefined) {
      product.image = body.image;
      product.gallery = [body.image];
    }
    if (body.accent !== undefined) product.accent = body.accent;
    if (body.badges !== undefined) product.badges = body.badges;
    if (body.ingredients !== undefined) product.ingredients = body.ingredients;
    if (body.featured !== undefined) product.featured = body.featured;
    if (body.isActive !== undefined) product.isActive = body.isActive;
    if (body.rating !== undefined) product.rating = body.rating;
    if (body.reviewCount !== undefined) product.reviewCount = body.reviewCount;

    if (product.variants[0]) {
      if (body.price !== undefined) product.variants[0].price = body.price;
      if (body.compareAtPrice !== undefined) product.variants[0].compareAtPrice = body.compareAtPrice;
      if (body.stock !== undefined) product.variants[0].stock = body.stock;
    }

    await product.save();
    res.json({ product: toAdminProduct(product) });
  })
);

router.patch(
  '/products/:slug/stock',
  asyncHandler(async (req, res) => {
    const { stock } = z.object({ stock: z.number().int().min(0) }).parse(req.body);
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) throw new AppError(404, 'Product not found');
    product.stock = stock;
    if (product.variants[0]) product.variants[0].stock = stock;
    await product.save();
    res.json({ product: toAdminProduct(product) });
  })
);

router.delete(
  '/products/:slug',
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) throw new AppError(404, 'Product not found');
    product.isActive = false;
    await product.save();
    res.json({ product: toAdminProduct(product) });
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
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ coupons });
  })
);

router.post(
  '/coupons',
  asyncHandler(async (req, res) => {
    const body = couponSchema.parse(req.body);
    const coupon = await Coupon.create({
      ...body,
      code: body.code.toUpperCase(),
      active: body.active ?? true,
    });
    res.status(201).json({ coupon });
  })
);

router.patch(
  '/coupons/:code',
  asyncHandler(async (req, res) => {
    const code = String(req.params.code).toUpperCase();
    const body = couponSchema.partial().parse(req.body);
    const coupon = await Coupon.findOne({ code });
    if (!coupon) throw new AppError(404, 'Coupon not found');
    Object.assign(coupon, body);
    if (body.code) coupon.code = body.code.toUpperCase();
    await coupon.save();
    res.json({ coupon });
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
    const section = String(req.params.section);
    if (section === 'orders') {
      const orders = await Order.find().sort({ createdAt: -1 }).limit(500);
      const header = 'number,status,total,createdAt,customer';
      const rows = orders.map((o) =>
        [
          o.number,
          o.status,
          o.total,
          o.createdAt?.toISOString?.() ?? '',
          (o.shippingAddress as { firstName?: string })?.firstName ?? 'Guest',
        ].join(',')
      );
      res.json({ csv: [header, ...rows].join('\n') });
      return;
    }
    if (section === 'products') {
      const products = await Product.find().sort({ name: 1 });
      const header = 'slug,name,price,stock,isActive';
      const rows = products.map((p) =>
        [p.slug, `"${p.name.replace(/"/g, '""')}"`, p.price, p.stock, p.isActive].join(',')
      );
      res.json({ csv: [header, ...rows].join('\n') });
      return;
    }
    res.json({ csv: `section,exported\n${section},true` });
  })
);

export default router;
