// Browser-safe integration contract. Populate VITE_* values in .env when connecting real adapters.
// This standalone preview does not guarantee that `import.meta.env` exists,
// so read the optional object defensively before accessing individual keys.
type RuntimeEnvironment = Record<string, string | undefined>;

const runtimeEnvironment =
typeof import.meta !== 'undefined' && import.meta.env ?
import.meta.env as RuntimeEnvironment :
{};

export const appConfig = {
  apiBaseUrl: runtimeEnvironment.VITE_API_BASE_URL ?? '',
  stripePublishableKey: runtimeEnvironment.VITE_STRIPE_PUBLISHABLE_KEY ?? '',
  paypalClientId: runtimeEnvironment.VITE_PAYPAL_CLIENT_ID ?? '',
  gaId: runtimeEnvironment.VITE_GA_ID ?? '',
  metaPixelId: runtimeEnvironment.VITE_META_PIXEL_ID ?? '',
  whatsappNumber: runtimeEnvironment.VITE_WHATSAPP_NUMBER ?? '',
  currency: 'USD'
} as const;

export const isIntegrationConfigured = (value: string) => Boolean(value.trim());