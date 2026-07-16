import { metaDescription, pageTitle, seoConfig } from './seoConfig';

export type RouteSeo = {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  noindex?: boolean;
  ogType?: string;
};

const baseKeywords = seoConfig.defaultKeywords;

export function resolveRouteSeo(pathname: string): RouteSeo | null {
  const path = pathname.split('?')[0];

  if (path.startsWith('/products/')) return null;

  const routes: Record<string, RouteSeo | (() => RouteSeo)> = {
    '/': {
      title: pageTitle(['Premium Beauty & Skincare Pakistan']),
      description: metaDescription(
        'Discover Hautoria — authentic premium skincare & cosmetics in Pakistan. Crafted for Timeless Skin. Secure checkout, fast delivery & cash on delivery.'
      ),
      keywords: `${baseKeywords}, buy skincare online Pakistan`,
      canonicalPath: '/',
      ogType: 'website',
    },
    '/shop': {
      title: pageTitle(['Shop Skincare & Cosmetics']),
      description: metaDescription(
        'Browse Hautoria\'s curated collection of serums, moisturizers, cleansers & treatments. Authentic luxury beauty at competitive PKR prices.'
      ),
      keywords: `${baseKeywords}, shop skincare, serums, moisturizers`,
      canonicalPath: '/shop',
    },
    '/search': {
      title: pageTitle(['Search Products']),
      description: metaDescription(
        'Search Hautoria for premium skincare, cosmetics & beauty treatments. Find authentic products by concern, category, or ingredient.'
      ),
      keywords: `${baseKeywords}, search beauty products`,
      canonicalPath: '/shop',
    },
    '/cart': {
      title: pageTitle(['Shopping Bag']),
      description: metaDescription('Review items in your Hautoria shopping bag before checkout.'),
      keywords: baseKeywords,
      canonicalPath: '/cart',
      noindex: true,
    },
    '/checkout': {
      title: pageTitle(['Checkout']),
      description: metaDescription('Complete your Hautoria order with secure checkout and fast delivery across Pakistan.'),
      keywords: baseKeywords,
      canonicalPath: '/checkout',
      noindex: true,
    },
    '/auth': {
      title: pageTitle(['Sign In']),
      description: metaDescription(
        'Sign in or create your Hautoria account to save rituals, track orders, and earn rewards.'
      ),
      keywords: `${baseKeywords}, Hautoria account`,
      canonicalPath: '/auth',
      noindex: true,
    },
    '/help': {
      title: pageTitle(['Help & Support']),
      description: metaDescription(
        'Contact Hautoria concierge for order help, product advice, shipping questions & returns. We\'re here to care for your skin ritual.'
      ),
      keywords: `${baseKeywords}, customer support, contact Hautoria`,
      canonicalPath: '/help',
    },
    '/legal/privacy': {
      title: pageTitle(['Privacy Policy']),
      description: metaDescription(
        'Hautoria privacy policy — how we collect, use, and protect your personal data when you shop with us.'
      ),
      keywords: `${baseKeywords}, privacy policy`,
      canonicalPath: '/legal/privacy',
    },
    '/legal/terms': {
      title: pageTitle(['Terms of Service']),
      description: metaDescription(
        'Hautoria terms of service — the conditions governing your use of our website and purchase of products.'
      ),
      keywords: `${baseKeywords}, terms of service`,
      canonicalPath: '/legal/terms',
    },
    '/legal/shipping': {
      title: pageTitle(['Shipping & Returns']),
      description: metaDescription(
        'Hautoria shipping, delivery timelines, and return policy for orders across Pakistan.'
      ),
      keywords: `${baseKeywords}, shipping, returns policy`,
      canonicalPath: '/legal/shipping',
    },
  };

  if (routes[path]) {
    const entry = routes[path];
    return typeof entry === 'function' ? entry() : entry;
  }

  if (path.startsWith('/account')) {
    return {
      title: pageTitle(['My Account']),
      description: metaDescription('Manage your Hautoria profile, orders, wishlist, and addresses.'),
      keywords: baseKeywords,
      canonicalPath: path,
      noindex: true,
    };
  }

  if (path.startsWith('/orders/') || path.startsWith('/checkout/')) {
    return {
      title: pageTitle(['Order Details']),
      description: metaDescription('View your Hautoria order status and delivery details.'),
      keywords: baseKeywords,
      canonicalPath: path,
      noindex: true,
    };
  }

  if (path.startsWith('/admin')) {
    return {
      title: pageTitle(['Admin']),
      description: metaDescription('Hautoria admin panel.'),
      keywords: baseKeywords,
      canonicalPath: path,
      noindex: true,
    };
  }

  return null;
}
