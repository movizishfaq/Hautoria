import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

/** Strip quotes/whitespace that break Atlas URIs when pasted into Vercel. */
export function cleanMongoUri(raw: string | undefined) {
  if (!raw) return 'mongodb://127.0.0.1:27017/hautoria';
  let value = raw
    .replace(/^\uFEFF/, '') // BOM
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width chars
    .trim();

  // Straight + smart + backtick wrappers
  value = value.replace(/^["'`“”‘’]+/, '').replace(/["'`“”‘’]+$/, '').trim();

  // Accidental `MONGODB_URI=mongodb+srv://...` paste
  if (/^mongodb_uri\s*=/i.test(value)) {
    value = value.replace(/^mongodb_uri\s*=/i, '').trim();
    value = value.replace(/^["'`“”‘’]+/, '').replace(/["'`“”‘’]+$/, '').trim();
  }

  return value;
}

/** Safe prefix for health diagnostics (never includes password). */
export function mongoUriDebug(raw: string | undefined) {
  const cleaned = cleanMongoUri(raw);
  const redacted = cleaned.replace(/:\/\/([^:/@]+):([^@]+)@/, '://$1:***@');
  return {
    startsOk: cleaned.startsWith('mongodb://') || cleaned.startsWith('mongodb+srv://'),
    prefix: redacted.slice(0, 48),
    length: cleaned.length,
  };
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongoUri: cleanMongoUri(process.env.MONGODB_URI),
  clientUrl: (
    process.env.CLIENT_URL ??
    process.env.VITE_SITE_URL ??
    (process.env.NODE_ENV === 'production' ? 'https://www.hautoria.com' : 'http://localhost:5173')
  )
    .trim()
    .replace(/\/$/, ''),
  adminUrl: (process.env.ADMIN_URL ?? 'http://localhost:5174').trim().replace(/\/$/, ''),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET ?? 'dev-refresh-secret',
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '30d',
  storeName: process.env.STORE_NAME ?? 'Hautoria',
  storeTagline: process.env.STORE_TAGLINE ?? 'Crafted for Timeless Skin.',
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM ?? 'Hautoria <noreply@hautoria.com>',
  },
  whatsapp: {
    provider: process.env.WHATSAPP_PROVIDER as
      | 'meta'
      | 'callmebot'
      | 'webhook'
      | undefined,
    apiUrl: process.env.WHATSAPP_API_URL,
    token: process.env.WHATSAPP_API_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    callmebotApiKey: process.env.WHATSAPP_CALLMEBOT_APIKEY,
    storeNumber: process.env.WHATSAPP_STORE_NUMBER ?? process.env.WHATSAPP_SUPPORT_NUMBER,
    support: process.env.WHATSAPP_SUPPORT_NUMBER ?? '+923001234567',
  },
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
};
