import { Router } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ notifications });
  })
);

router.patch(
  '/:id/read',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { read: true }
    );
    res.json({ success: true });
  })
);

router.get(
  '/wishlist',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const user = await User.findById(req.userId);
    res.json({ wishlist: user?.wishlist ?? [] });
  })
);

router.post(
  '/wishlist/:productId',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const id = req.params.productId;
    if (user.wishlist.includes(id)) {
      user.wishlist = user.wishlist.filter((w) => w !== id);
    } else {
      user.wishlist.push(id);
    }
    await user.save();
    res.json({ wishlist: user.wishlist });
  })
);

router.post(
  '/recently-viewed/:productId',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const id = req.params.productId;
    user.recentlyViewed = [id, ...user.recentlyViewed.filter((r) => r !== id)].slice(0, 12);
    await user.save();
    res.json({ recentlyViewed: user.recentlyViewed });
  })
);

router.patch(
  '/addresses',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const addresses = z.array(z.record(z.string())).parse(req.body.addresses);
    const user = await User.findByIdAndUpdate(
      req.userId,
      { addresses },
      { new: true }
    );
    res.json({ addresses: user?.addresses });
  })
);

export default router;
