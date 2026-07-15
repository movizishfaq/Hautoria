import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { User } from '../models/User.js';
import { OtpToken } from '../models/OtpToken.js';
import { env } from '../config/env.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { logActivity } from '../services/activityLog.js';
import { sendEmail, emailTemplates } from '../services/email.js';

const router = Router();

function signTokens(user: { _id: { toString(): string }; role: string; email: string; name: string }) {
  const sub = user._id.toString();
  // Embed role so admin/API auth can skip a User.findById on every request.
  const accessToken = jwt.sign(
    { sub, role: user.role, email: user.email, name: user.name, isActive: true },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  );
  const refreshToken = jwt.sign({ sub }, env.refreshSecret, {
    expiresIn: env.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
  return { accessToken, refreshToken };
}

function setAuthCookies(res: import('express').Response, tokens: { accessToken: string; refreshToken: string }) {
  const secure = env.nodeEnv === 'production';
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

function sanitizeUser(user: InstanceType<typeof User>) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profilePhoto: user.profilePhoto,
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    loyaltyPoints: user.loyaltyPoints,
    tier: user.tier,
    addresses: user.addresses,
    wishlist: user.wishlist,
    recentlyViewed: user.recentlyViewed,
    notificationPrefs: user.notificationPrefs,
    referralCode: user.referralCode,
  };
}

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  phone: z.string().optional(),
});

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: body.email.toLowerCase() });
    if (exists) throw new AppError(409, 'Email already registered', 'EMAIL_EXISTS');

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      phone: body.phone,
      passwordHash,
      referralCode: uuid().slice(0, 8).toUpperCase(),
      loyaltyPoints: 250,
      tier: 'Rose',
      addresses: [],
    });

    const tokens = signTokens(user);
    setAuthCookies(res, tokens);
    await logActivity({ userId: user._id.toString(), action: 'register', entity: 'user' });
    const welcome = emailTemplates.welcome(user.name);
    await sendEmail(user.email, welcome.subject, welcome.html);

    res.status(201).json({ user: sanitizeUser(user), accessToken: tokens.accessToken });
  })
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);
    const user = await User.findOne({ email: body.email.toLowerCase() }).select('+passwordHash');
    if (!user || !user.isActive) throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');

    user.lastLoginAt = new Date();
    await user.save();

    const tokens = signTokens(user);
    setAuthCookies(res, tokens);
    await logActivity({ userId: user._id.toString(), action: 'login', entity: 'user', ip: req.ip });

    res.json({ user: sanitizeUser(user), accessToken: tokens.accessToken });
  })
);

router.post(
  '/logout',
  asyncHandler(async (_req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ success: true });
  })
);

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    // Always hydrate from DB so profile fields stay fresh (auth itself may use JWT claims).
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid session', 'INVALID_SESSION');
    }
    res.json({ user: sanitizeUser(user) });
  })
);

router.post(
  '/forgot-password',
  asyncHandler(async (req, res) => {
    const email = z.string().email().parse(req.body.email);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      await OtpToken.create({
        email: user.email,
        code,
        purpose: 'reset_password',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });
      const tpl = emailTemplates.resetPassword(code);
      await sendEmail(user.email, tpl.subject, tpl.html);
    }
    res.json({ accepted: true, message: 'If the email exists, a reset code was sent.' });
  })
);

router.post(
  '/reset-password',
  asyncHandler(async (req, res) => {
    const body = z
      .object({
        email: z.string().email(),
        code: z.string().length(6),
        password: z.string().min(8),
      })
      .parse(req.body);

    const otp = await OtpToken.findOne({
      email: body.email.toLowerCase(),
      code: body.code,
      purpose: 'reset_password',
      used: false,
      expiresAt: { $gt: new Date() },
    });
    if (!otp) throw new AppError(400, 'Invalid or expired code', 'INVALID_OTP');

    const user = await User.findOne({ email: body.email.toLowerCase() });
    if (!user) throw new AppError(404, 'User not found');

    user.passwordHash = await bcrypt.hash(body.password, 12);
    await user.save();
    otp.used = true;
    await otp.save();

    res.json({ success: true });
  })
);

router.post(
  '/verify-otp',
  asyncHandler(async (req, res) => {
    const body = z
      .object({
        email: z.string().email().optional(),
        phone: z.string().optional(),
        code: z.string().length(6),
        purpose: z.enum(['verify_email', 'verify_phone', 'reset_password']),
      })
      .parse(req.body);

    const otp = await OtpToken.findOne({
      ...(body.email ? { email: body.email.toLowerCase() } : {}),
      ...(body.phone ? { phone: body.phone } : {}),
      code: body.code,
      purpose: body.purpose,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    if (!otp) throw new AppError(400, 'Invalid or expired OTP', 'INVALID_OTP');

    otp.used = true;
    await otp.save();

    if (body.purpose === 'verify_email' && body.email) {
      await User.updateOne({ email: body.email.toLowerCase() }, { emailVerified: true });
    }
    if (body.purpose === 'verify_phone' && body.phone) {
      await User.updateOne({ phone: body.phone }, { phoneVerified: true });
    }

    res.json({ verified: true });
  })
);

router.post(
  '/send-verification',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const user = req.user!;
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await OtpToken.create({
      email: user.email,
      code,
      purpose: 'verify_email',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });
    await sendEmail(user.email, 'Verify your email', `<p>Code: <strong>${code}</strong></p>`);
    res.json({ sent: true });
  })
);

router.patch(
  '/profile',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = z
      .object({
        name: z.string().min(2).optional(),
        phone: z.string().optional(),
        profilePhoto: z.string().url().optional(),
        notificationPrefs: z
          .object({
            email: z.boolean(),
            sms: z.boolean(),
            whatsapp: z.boolean(),
            push: z.boolean(),
          })
          .partial()
          .optional(),
      })
      .parse(req.body);

    const user = await User.findByIdAndUpdate(req.userId, body, { new: true });
    res.json({ user: sanitizeUser(user!) });
  })
);

router.patch(
  '/change-password',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = z
      .object({ currentPassword: z.string(), newPassword: z.string().min(8) })
      .parse(req.body);
    const user = await User.findById(req.userId).select('+passwordHash');
    if (!user) throw new AppError(404, 'User not found');
    const valid = await bcrypt.compare(body.currentPassword, user.passwordHash);
    if (!valid) throw new AppError(400, 'Current password is incorrect');
    user.passwordHash = await bcrypt.hash(body.newPassword, 12);
    await user.save();
    res.json({ success: true });
  })
);

router.delete(
  '/account',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    await User.findByIdAndUpdate(req.userId, { isActive: false });
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ deleted: true });
  })
);

export default router;
