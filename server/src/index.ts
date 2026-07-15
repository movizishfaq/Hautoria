import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import commerceRoutes from './routes/commerce.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import reviewRoutes from './routes/reviews.js';
import supportRoutes from './routes/support.js';
import paymentRoutes from './routes/payments.js';
import seoRoutes from './routes/seo.js';
import referralRoutes from './routes/referral.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', store: env.storeName, tagline: env.storeTagline });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/commerce', commerceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/referral', referralRoutes);

app.use(errorHandler);

const connected = await connectDb();
if (!connected) {
  console.warn(
    'Warning: MongoDB is offline. API is up for health checks; order/product writes need Atlas or use the storefront local fallback.'
  );
}

app.listen(env.port, () => {
  console.log(`Hautoria API running on http://localhost:${env.port}`);
});
