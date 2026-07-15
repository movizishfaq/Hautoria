// Browser-safe integration contract. Populate VITE_* values in .env when connecting real adapters.
// This standalone preview does not guarantee that `import.meta.env` exists,
// so read the optional object defensively before accessing individual keys.
type RuntimeEnvironment = Record<string, string | undefined>;

const runtimeEnvironment =
typeof import.meta !== 'undefined' && import.meta.env ?
import.meta.env as RuntimeEnvironment :
{};

export const appConfig = {
  brandName: 'Hautoria',
  brandTagline: 'Crafted for Timeless Skin.',
  logoUrl: '/hautoria-logo.png',
  heroImage: '/hero-fit-me-real-hd.png',
  // Same-origin /api on Vercel (and Vite proxy in local dev). Override with VITE_API_BASE_URL if needed.
  apiBaseUrl:
    runtimeEnvironment.VITE_API_BASE_URL ??
    (runtimeEnvironment.PROD || runtimeEnvironment.MODE === 'production' ? '/api' : '/api'),
  /** Customer storefront URL (used by standalone admin “Live site”). */
  storeUrl: (runtimeEnvironment.VITE_STORE_URL ?? 'https://hautoria.vercel.app').replace(/\/$/, ''),
  /** Standalone admin panel URL (storefront redirects /admin here). */
  adminUrl: (runtimeEnvironment.VITE_ADMIN_URL ?? '').replace(/\/$/, ''),
  stripePublishableKey: runtimeEnvironment.VITE_STRIPE_PUBLISHABLE_KEY ?? '',
  paypalClientId: runtimeEnvironment.VITE_PAYPAL_CLIENT_ID ?? '',
  gaId: runtimeEnvironment.VITE_GA_ID ?? '',
  metaPixelId: runtimeEnvironment.VITE_META_PIXEL_ID ?? '',
  whatsappNumber: runtimeEnvironment.VITE_WHATSAPP_NUMBER ?? '',
  currency: 'PKR'
} as const;

export const isIntegrationConfigured = (value: string) => Boolean(value.trim());