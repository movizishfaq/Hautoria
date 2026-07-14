import { Router } from 'express';
import { z } from 'zod';
import { Review } from '../models/Review.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get(
  '/product/:productId',
  asyncHandler(async (req, res) => {
    const reviews = await Review.find({
      productId: req.params.productId,
      reported: false,
    })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({
      reviews: reviews.map((r) => ({
        id: r._id.toString(),
        productId: r.productId,
        author: r.author,
        rating: r.rating,
        text: r.text,
        images: r.images,
        videos: r.videos,
        helpfulVotes: r.helpfulVotes,
        verified: r.verified,
        date: r.createdAt.toISOString().slice(0, 10),
      })),
    });
  })
);

router.post(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = z
      .object({
        productId: z.string(),
        rating: z.number().min(1).max(5),
        text: z.string().min(10).max(2000),
        images: z.array(z.string().url()).max(5).optional(),
        videos: z.array(z.string().url()).max(2).optional(),
      })
      .parse(req.body);

    const delivered = await Order.findOne({
      userId: req.userId,
      status: { $in: ['delivered', 'completed'] },
      'items.productId': body.productId,
    });
    if (!delivered) {
      throw new AppError(403, 'Only verified buyers can review this product', 'NOT_VERIFIED');
    }

    const existing = await Review.findOne({
      userId: req.userId,
      productId: body.productId,
    });
    if (existing) throw new AppError(409, 'You already reviewed this product');

    const review = await Review.create({
      ...body,
      userId: req.userId!,
      author: req.user!.name,
      verified: true,
    });

    const count = await Review.countDocuments({ productId: body.productId });
    const avg = await Review.aggregate([
      { $match: { productId: body.productId } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);
    await Product.updateOne(
      { slug: body.productId },
      {
        reviewCount: count,
        rating: Math.round((avg[0]?.avg ?? body.rating) * 10) / 10,
      }
    );

    res.status(201).json({ review });
  })
);

router.post(
  '/:id/helpful',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulVotes: 1 } },
      { new: true }
    );
    if (!review) throw new AppError(404, 'Review not found');
    res.json({ helpfulVotes: review.helpfulVotes });
  })
);

router.post(
  '/:id/report',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    await Review.findByIdAndUpdate(req.params.id, { reported: true });
    res.json({ reported: true });
  })
);

export default router;
