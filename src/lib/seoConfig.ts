import { appConfig } from './config';

type RuntimeEnvironment = Record<string, string | undefined>;

const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env as RuntimeEnvironment)
    : {};

/** Central SEO + local business configuration. Update placeholders before launch. */
export const seoConfig = {
  siteName: appConfig.brandName,
  tagline: appConfig.brandTagline,
  siteUrl: appConfig.siteUrl,
  defaultTitle: `${appConfig.brandName} — Premium Beauty & Skincare`,
  defaultDescription:
    'Hautoria — Crafted for Timeless Skin. Shop authentic premium skincare & cosmetics in Pakistan with secure checkout, fast delivery & COD.',
  defaultKeywords:
    'Hautoria, Hautoria Pakistan, premium skincare, luxury cosmetics, authentic beauty products, skincare shop Pakistan, beauty store Lahore',
  locale: 'en_PK',
  language: 'en',
  twitterHandle: '@hautoria',
  ogImagePath: '/hero-fit-me-real-hd.png',
  logoPath: appConfig.logoUrl,
  themeColor: '#FAF7F2',

  /** Google Search Console — paste verification content value */
  googleSiteVerification: env.VITE_GSC_VERIFICATION ?? '',
  /** Bing Webmaster Tools — paste MSVALIDATE.01 content value */
  bingSiteVerification: env.VITE_BING_VERIFICATION ?? '',
  /** Google Analytics 4 measurement ID (G-XXXXXXXX) */
  gaMeasurementId: appConfig.gaId || env.VITE_GA_ID || '',
  /** Google Tag Manager container ID (GTM-XXXXXXX) */
  gtmContainerId: env.VITE_GTM_ID ?? '',

  localBusiness: {
    name: appConfig.brandName,
    legalName: 'Hautoria Beauty Pvt. Ltd.',
    description:
      'Premium authentic skincare and cosmetics retailer serving customers across Pakistan.',
    telephone: env.VITE_BUSINESS_PHONE ?? '+92-300-1234567',
    email: env.VITE_BUSINESS_EMAIL ?? 'hello@hautoria.com',
    address: {
      streetAddress: env.VITE_BUSINESS_STREET ?? '123 Main Boulevard, Gulberg',
      addressLocality: env.VITE_BUSINESS_CITY ?? 'Lahore',
      addressRegion: env.VITE_BUSINESS_REGION ?? 'Punjab',
      postalCode: env.VITE_BUSINESS_POSTAL ?? '54000',
      addressCountry: 'PK',
    },
    geo: {
      latitude: Number(env.VITE_BUSINESS_LAT ?? '31.5204'),
      longitude: Number(env.VITE_BUSINESS_LNG ?? '74.3587'),
    },
    openingHours: ['Mo-Sa 10:00-20:00', 'Su 12:00-18:00'],
    priceRange: '$$',
    areaServed: 'Pakistan',
    sameAs: [
      'https://www.instagram.com/hautoria',
      'https://www.facebook.com/hautoria',
      'https://twitter.com/hautoria',
    ],
  },
} as const;

export function absoluteUrl(path = ''): string {
  const base = seoConfig.siteUrl.replace(/\/$/, '');
  if (!path || path === '/') return `${base}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function absoluteAsset(path: string): string {
  if (path.startsWith('http')) return path;
  return absoluteUrl(path);
}

/** Trim description to ~155 characters for meta tags. */
export function metaDescription(text: string, max = 160): string {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (trimmed.length <= max) return trimmed;
  const slice = trimmed.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  return `${slice.slice(0, lastSpace > 80 ? lastSpace : max - 1).trim()}…`;
}

export function pageTitle(parts: string[]): string {
  const unique = parts.filter(Boolean);
  if (unique.length === 0) return seoConfig.defaultTitle;
  if (unique[unique.length - 1] === seoConfig.siteName) return unique.join(' — ');
  return `${unique.join(' — ')} — ${seoConfig.siteName}`;
}
