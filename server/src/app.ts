import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
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

const isServerless = Boolean(process.env.VERCEL);

function corsOrigin(
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void
) {
  if (!origin) {
    callback(null, true);
    return;
  }

  const allowed = new Set<string>([
    env.clientUrl,
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
  ]);

  if (process.env.VERCEL_URL) {
    allowed.add(`https://${process.env.VERCEL_URL}`);
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    allowed.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }

  try {
    const host = new URL(origin).hostname;
    if (allowed.has(origin) || host.endsWith('.vercel.app')) {
      callback(null, true);
      return;
    }
  } catch {
    /* ignore */
  }

  callback(null, false);
}

function mountApi(router: express.Router) {
  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      store: env.storeName,
      tagline: env.storeTagline,
      runtime: isServerless ? 'vercel-serverless' : 'node',
    });
  });

  router.use('/auth', authRoutes);
  router.use('/products', productRoutes);
  router.use('/commerce', commerceRoutes);
  router.use('/admin', adminRoutes);
  router.use('/user', userRoutes);
  router.use('/reviews', reviewRoutes);
  router.use('/support', supportRoutes);
  router.use('/payments', paymentRoutes);
  router.use('/seo', seoRoutes);
  router.use('/referral', referralRoutes);
}

export function createApp() {
  const app = express();
  const api = express.Router();

  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());

  // In-memory limits are ineffective across serverless isolates
  if (!isServerless) {
    app.use(
      '/api/',
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 300,
        standardHeaders: true,
        legacyHeaders: false,
      })
    );
    const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
    app.use('/api/auth/login', authLimiter);
    app.use('/api/auth/register', authLimiter);
  }

  mountApi(api);

  // Local Node + Vite proxy: /api/...
  app.use('/api', api);
  // Vercel rewrite /api/foo → /api may strip the /api prefix; also accept bare /foo
  if (isServerless) {
    app.use('/', api);
  }

  app.use(errorHandler);
  return app;
}

const app = createApp();
export default app;
