import { Router } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { createNotification } from '../services/notifications.js';

const router = Router();

const TIER_THRESHOLDS = { Rose: 0, Gold: 1000, Celeste: 5000 };

router.get(
  '/dashboard',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const user = req.user!;
    const referrals = await User.countDocuments({ referredBy: user.referralCode });
    res.json({
      referralCode: user.referralCode,
      referrals,
      loyaltyPoints: user.loyaltyPoints,
      tier: user.tier,
      nextTier:
        user.tier === 'Rose'
          ? 'Gold'
          : user.tier === 'Gold'
            ? 'Celeste'
            : null,
      pointsToNext:
        user.tier === 'Rose'
          ? TIER_THRESHOLDS.Gold - user.loyaltyPoints
          : user.tier === 'Gold'
            ? TIER_THRESHOLDS.Celeste - user.loyaltyPoints
            : 0,
    });
  })
);

router.post(
  '/apply',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const { code } = z.object({ code: z.string().min(4) }).parse(req.body);
    const user = req.user!;
    if (user.referredBy) throw new AppError(400, 'Referral already applied');
    const referrer = await User.findOne({ referralCode: code.toUpperCase() });
    if (!referrer) throw new AppError(404, 'Invalid referral code');

    user.referredBy = referrer.referralCode;
    user.loyaltyPoints += 200;
    referrer.loyaltyPoints += 300;
    await user.save();
    await referrer.save();

    await createNotification({
      userId: referrer._id.toString(),
      title: 'Referral reward',
      body: `${user.name} joined with your code. +300 points.`,
      kind: 'reward',
    });

    res.json({ applied: true, bonusPoints: 200 });
  })
);

export default router;
