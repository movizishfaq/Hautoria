import { Router } from 'express';
import { z } from 'zod';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

function toClientProduct(p: InstanceType<typeof Product>) {
  return {
    id: p.slug,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    category: p.category,
    concerns: p.concerns,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    image: p.image,
    gallery: p.gallery?.length ? p.gallery : [p.image],
    accent: p.accent,
    badges: p.badges,
    ingredients: p.ingredients,
    featured: p.featured,
    brand: p.brand,
    variants: p.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      stock: v.stock,
      image: v.image,
    })),
  };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const {
      q,
      category,
      brand,
      minPrice,
      maxPrice,
      sort = 'featured',
      page = '1',
      limit = '24',
      featured,
      inStock,
    } = req.query;

    const filter: Record<string, unknown> = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    if (brand) filter.brand = brand;
    if (featured === 'true') filter.featured = true;
    if (inStock === 'true') filter.stock = { $gt: 0 };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }
    if (q && String(q).trim()) {
      filter.$text = { $search: String(q) };
    }

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      featured: { featured: -1, createdAt: -1 },
      'price-low': { price: 1 },
      'price-high': { price: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
    };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort(sortMap[String(sort)] ?? sortMap.featured)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      products: items.map(toClientProduct),
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  })
);

router.get(
  '/suggestions',
  asyncHandler(async (req, res) => {
    const q = String(req.query.q ?? '').trim();
    if (!q) return res.json({ products: [] });
    let items = await Product.find({
      isActive: true,
      $or: [
        { $text: { $search: q } },
        { name: { $regex: q, $options: 'i' } },
      ],
    }).limit(6);
    if (!items.length) {
      items = await Product.find({
        isActive: true,
        name: { $regex: q, $options: 'i' },
      }).limit(6);
    }
    res.json({ products: items.map(toClientProduct) });
  })
);

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: toClientProduct(product) });
  })
);

export default router;
