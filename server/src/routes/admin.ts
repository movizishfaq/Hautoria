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

function buildRevenueSeries() {
  const series: Array<{ label: string; value: number }> = [];
  const now = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    series.push({
      label: DAY_LABELS[day.getDay()],
      value: 0,
      _start: day,
      _end: next,
    } as { label: string; value: number; _start: Date; _end: Date });
  }
  return series;
}

router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    const [orderCount, revenueAgg, customers, products, recentOrders, lowStock, statusAgg, recentWeekOrders] =
      await Promise.all([
        Order.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
        User.countDocuments({ role: 'customer' }),
        Product.countDocuments({ isActive: true }),
        Order.find().sort({ createdAt: -1 }).limit(10),
        Product.find({ stock: { $lte: 8 }, isActive: true }).limit(10),
        Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Order.find({
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        }),
      ]);

    const series = buildRevenueSeries();
    for (const order of recentWeekOrders) {
      const created = new Date(order.createdAt);
      for (const bucket of series as Array<{ label: string; value: number; _start: Date; _end: Date }>) {
        if (created >= bucket._start && created < bucket._end) {
          bucket.value += order.total;
          break;
        }
      }
    }

    const pipeline = Object.fromEntries(
      statusAgg.map((row: { _id: string; count: number }) => [row._id, row.count])
    );

    res.json({
      analytics: {
        revenue: revenueAgg[0]?.total ?? 0,
        orders: orderCount,
        customers,
        products,
        conversion: orderCount > 0 ? 4.2 : 0,
        series: series.map(({ label, value }) => ({ label, value })),
        pipeline,
      },
      recentOrders: recentOrders.map(toClientOrder),
      lowStock: lowStock.map(toAdminProduct),
    });
  })
);

router.get(
  '/orders',
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ orders: orders.map(toClientOrder) });
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

router.get(
  '/products',
  asyncHandler(async (_req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products: products.map(toAdminProduct) });
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
