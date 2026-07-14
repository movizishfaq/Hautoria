import { Router } from 'express';
import { z } from 'zod';
import { SupportTicket } from '../models/SupportTicket.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth.js';
import { sendEmail } from '../services/email.js';
import { env } from '../config/env.js';

const router = Router();

router.post(
  '/tickets',
  optionalAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = z
      .object({
        email: z.string().email(),
        subject: z.string().min(3).max(120),
        message: z.string().min(10).max(4000),
        orderId: z.string().optional(),
        channel: z.enum(['chat', 'email', 'whatsapp', 'ticket']).default('ticket'),
        attachments: z.array(z.string().url()).max(5).optional(),
      })
      .parse(req.body);

    const ticket = await SupportTicket.create({
      ...body,
      userId: req.userId,
      priority: body.orderId ? 'high' : 'normal',
    });

    await sendEmail(
      body.email,
      `Support ticket #${ticket._id.toString().slice(-6)}`,
      `<p>We received your request: <strong>${body.subject}</strong></p><p>${body.message}</p>`
    ).catch(() => {});

    res.status(201).json({ ticket: { id: ticket._id, status: ticket.status } });
  })
);

router.get(
  '/tickets',
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const tickets = await SupportTicket.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json({ tickets });
  })
);

router.get('/faqs', (_req, res) => {
  res.json({
    faqs: [
      {
        id: 'shipping',
        question: 'How long does delivery take?',
        answer: 'Standard delivery is 3–5 business days. Express is 1–2 days.',
      },
      {
        id: 'returns',
        question: 'What is your return policy?',
        answer: 'Unopened items may be returned within 14 days with proof of purchase.',
      },
      {
        id: 'authenticity',
        question: 'Are products authentic?',
        answer: 'Every Hautoria product is sourced from authorised distributors.',
      },
    ],
  });
});

router.get('/whatsapp', (_req, res) => {
  res.json({
    number: env.whatsapp.support,
    link: `https://wa.me/${env.whatsapp.support.replace(/\D/g, '')}`,
  });
});

export default router;
