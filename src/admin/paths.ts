/**
 * Admin routes are rooted at `/` because the Command Center
 * deploys as its own Vercel project (not under www.hautoria.com/admin).
 */
export const adminPath = {
  home: '/',
  login: '/login',
  orders: '/orders',
  products: '/products',
  inventory: '/inventory',
  customers: '/customers',
  coupons: '/coupons',
  activity: '/activity',
  settings: '/settings',
  analytics: '/analytics',
  systemHealth: '/system-health',
  categories: '/categories',
  brands: '/brands',
  support: '/support',
  payments: '/payments',
  team: '/team',
} as const;
