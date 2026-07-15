import type { AdminAnalytics, Order, OrderStatus, Product } from '../types/domain';
import { apiRequest, ApiError, isApiEnabled, mockRequest } from './api';
import {
  loadAdminCatalog,
  removeAdminProduct,
  updateAdminStock,
  upsertAdminProduct,
} from '../lib/adminCatalogStore';
import {
  buildLocalAnalytics,
  loadLocalOrders,
  updateLocalOrderStatus,
} from '../lib/adminOrdersStore';
import { adminDataCache } from '../lib/adminDataCache';

export type AdminProduct = Product & {
  isActive?: boolean;
  sku?: string;
  brand?: string;
  lowStockThreshold?: number;
};

export type ProductInput = {
  slug?: string;
  name: string;
  tagline?: string;
  description?: string;
  category: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image: string;
  accent?: string;
  featured?: boolean;
  isActive?: boolean;
  rating?: number;
  reviewCount?: number;
};

type DashboardPayload = {
  analytics: AdminAnalytics;
  recentOrders: Order[];
  lowStock: AdminProduct[];
};

const EMPTY_ANALYTICS: AdminAnalytics = {
  revenue: 0,
  orders: 0,
  customers: 0,
  conversion: 0,
  series: [
    { label: 'Mon', value: 0 },
    { label: 'Tue', value: 0 },
    { label: 'Wed', value: 0 },
    { label: 'Thu', value: 0 },
    { label: 'Fri', value: 0 },
    { label: 'Sat', value: 0 },
    { label: 'Sun', value: 0 },
  ],
  pipeline: {},
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function filterOrders(orders: Order[], status?: string) {
  if (!status || status === 'all') return orders;
  return orders.filter((o) => o.status === status);
}

function localDashboard(): DashboardPayload {
  const products = loadAdminCatalog();
  const orders = loadLocalOrders();
  const analytics = buildLocalAnalytics(orders);
  return {
    analytics: {
      ...EMPTY_ANALYTICS,
      ...analytics,
      products: products.length,
    },
    recentOrders: orders.slice(0, 10),
    lowStock: products.filter((p) => p.stock <= 8),
  };
}

export const adminService = {
  getDashboard: async (opts?: { force?: boolean }) => {
    if (!opts?.force) {
      const cached = adminDataCache.getDashboard<DashboardPayload>();
      if (cached) return cached;
    }
    if (!isApiEnabled()) {
      const local = localDashboard();
      adminDataCache.setDashboard(local);
      return local;
    }
    const dash = await apiRequest<DashboardPayload>('/admin/dashboard');
    adminDataCache.setDashboard(dash);
    return dash;
  },

  getOrders: async (status?: string, opts?: { force?: boolean }) => {
    const key = status ?? 'all';
    if (!opts?.force) {
      const cached = adminDataCache.getOrders<{ orders: Order[] }>(key);
      if (cached) return cached;
    }
    if (!isApiEnabled()) {
      return { orders: filterOrders(loadLocalOrders(), status) };
    }
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await apiRequest<{ orders: Order[] }>(`/admin/orders${qs}`);
    adminDataCache.setOrders(key, res);
    return res;
  },

  getOrder: async (id: string) => {
    if (!isApiEnabled()) {
      const order = loadLocalOrders().find((o) => o.id === id || o.number === id);
      if (!order) throw new ApiError(404, 'Order not found');
      return mockRequest({ order });
    }
    try {
      return await apiRequest<{ order: Order }>(`/admin/orders/${id}`);
    } catch {
      const order = loadLocalOrders().find((o) => o.id === id || o.number === id);
      if (!order) throw new ApiError(404, 'Order not found');
      return { order };
    }
  },

  updateOrderStatus: async (orderId: string, status: string, note?: string) => {
    if (!isApiEnabled()) {
      const updated = updateLocalOrderStatus(orderId, status as OrderStatus);
      if (!updated) throw new ApiError(404, 'Order not found');
      adminDataCache.invalidate('orders');
      return mockRequest({ order: updated });
    }
    try {
      const res = await apiRequest(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      });
      adminDataCache.invalidate('orders');
      return res;
    } catch {
      const updated = updateLocalOrderStatus(orderId, status as OrderStatus);
      if (!updated) throw new ApiError(404, 'Order not found');
      adminDataCache.invalidate('orders');
      return { order: updated };
    }
  },

  getProducts: async (opts?: { force?: boolean }) => {
    if (!opts?.force) {
      const cached = adminDataCache.getProducts<{ products: AdminProduct[] }>();
      if (cached) return cached;
    }
    if (!isApiEnabled()) {
      return {
        products: loadAdminCatalog().map((p) => ({ ...p, isActive: true })),
      };
    }
    try {
      const res = await apiRequest<{ products: AdminProduct[] }>('/admin/products');
      if ((res.products?.length ?? 0) > 0) {
        adminDataCache.setProducts(res);
        return res;
      }
      const fallback = {
        products: loadAdminCatalog().map((p) => ({ ...p, isActive: true })),
      };
      return fallback;
    } catch {
      return {
        products: loadAdminCatalog().map((p) => ({ ...p, isActive: true })),
      };
    }
  },

  createProduct: async (input: ProductInput & { slug: string }) => {
    if (!isApiEnabled()) {
      const product: AdminProduct = {
        id: input.slug,
        slug: input.slug,
        name: input.name,
        tagline: input.tagline ?? input.name.split(' ').slice(0, 2).join(' '),
        description: input.description ?? '',
        category: input.category as Product['category'],
        concerns: [],
        price: input.price,
        compareAtPrice: input.compareAtPrice,
        rating: input.rating ?? 4.5,
        reviewCount: input.reviewCount ?? 0,
        stock: input.stock,
        image: input.image,
        gallery: [input.image],
        accent: input.accent ?? 'bg-beige',
        badges: [],
        ingredients: [],
        variants: [
          {
            id: `${input.slug}-default`,
            name: 'Standard',
            sku: `HT-${input.slug.slice(0, 12).toUpperCase()}`,
            price: input.price,
            compareAtPrice: input.compareAtPrice,
            stock: input.stock,
          },
        ],
        featured: input.featured ?? false,
        isActive: input.isActive ?? true,
      };
      upsertAdminProduct(product);
      adminDataCache.invalidate('products');
      return mockRequest({ product });
    }
    const res = await apiRequest<{ product: AdminProduct }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    adminDataCache.invalidate('products');
    return res;
  },

  updateProduct: async (slug: string, input: Partial<ProductInput>) => {
    if (!isApiEnabled()) {
      const existing = loadAdminCatalog().find((p) => p.slug === slug);
      if (!existing) throw new ApiError(404, 'Product not found');
      const updated: AdminProduct = {
        ...existing,
        ...input,
        category: (input.category as Product['category']) ?? existing.category,
        variants: existing.variants.map((v, i) =>
          i === 0
            ? {
                ...v,
                price: input.price ?? v.price,
                compareAtPrice: input.compareAtPrice ?? v.compareAtPrice,
                stock: input.stock ?? v.stock,
              }
            : v
        ),
        isActive: input.isActive ?? true,
      };
      upsertAdminProduct(updated);
      adminDataCache.invalidate('products');
      return mockRequest({ product: updated });
    }
    const res = await apiRequest<{ product: AdminProduct }>(`/admin/products/${slug}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    adminDataCache.invalidate('products');
    return res;
  },

  updateStock: async (slug: string, stock: number) => {
    if (!isApiEnabled()) {
      const updated = updateAdminStock(slug, stock);
      if (!updated) throw new ApiError(404, 'Product not found');
      adminDataCache.invalidate('products');
      return mockRequest({ product: { ...updated, isActive: true } });
    }
    const res = await apiRequest<{ product: AdminProduct }>(`/admin/products/${slug}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
    adminDataCache.invalidate('products');
    return res;
  },

  deleteProduct: async (slug: string) => {
    if (!isApiEnabled()) {
      removeAdminProduct(slug);
      adminDataCache.invalidate('products');
      return mockRequest({ ok: true });
    }
    const res = await apiRequest<{ product: AdminProduct }>(`/admin/products/${slug}`, {
      method: 'DELETE',
    });
    adminDataCache.invalidate('products');
    return res;
  },

  getCustomers: async () => {
    if (!isApiEnabled()) {
      const customers = loadLocalOrders().map((o, i) => ({
        id: `local_${i}`,
        name:
          `${o.shippingAddress?.firstName ?? ''} ${o.shippingAddress?.lastName ?? ''}`.trim() ||
          'Guest',
        email: 'guest@order.local',
        phone: o.shippingAddress?.phone,
        tier: 'Rose',
        loyaltyPoints: 0,
      }));
      return mockRequest({ customers });
    }
    try {
      return await apiRequest('/admin/customers');
    } catch {
      return { customers: [] };
    }
  },

  getCoupons: async () => {
    if (!isApiEnabled()) return mockRequest({ coupons: [] });
    try {
      return await apiRequest<{
        coupons: Array<{
          code: string;
          description?: string;
          amount: number;
          type: 'percent' | 'fixed' | 'free_shipping';
          active: boolean;
        }>;
      }>('/admin/coupons');
    } catch {
      return { coupons: [] };
    }
  },

  createCoupon: async (input: {
    code: string;
    description?: string;
    type: 'percent' | 'fixed' | 'free_shipping';
    amount: number;
    minPurchase?: number;
    active?: boolean;
  }) => {
    if (!isApiEnabled()) {
      return mockRequest({
        coupon: { ...input, code: input.code.toUpperCase(), active: input.active ?? true },
      });
    }
    return apiRequest('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  getLogs: async () => {
    if (!isApiEnabled()) return mockRequest({ logs: [] });
    try {
      return await apiRequest('/admin/logs');
    } catch {
      return { logs: [] };
    }
  },

  exportCsv: async (section: string) => {
    const localOrdersCsv = () => {
      const rows = loadLocalOrders().map((o) =>
        [
          o.number,
          o.status,
          o.total,
          o.createdAt,
          o.shippingAddress?.firstName ?? 'Guest',
        ].join(',')
      );
      return `number,status,total,createdAt,customer\n${rows.join('\n')}`;
    };

    if (!isApiEnabled()) {
      if (section === 'orders') return mockRequest(localOrdersCsv());
      if (section === 'products') {
        const rows = loadAdminCatalog().map((p) =>
          [p.slug, `"${p.name}"`, p.price, p.stock].join(',')
        );
        return mockRequest(`slug,name,price,stock\n${rows.join('\n')}`);
      }
      return mockRequest(`section,exported\n${section},false`);
    }

    try {
      const data = await apiRequest<{ csv: string }>(
        `/admin/export/${encodeURIComponent(section)}`
      );
      if (section === 'orders' && data.csv.split('\n').length <= 1 && loadLocalOrders().length) {
        return localOrdersCsv();
      }
      return data.csv;
    } catch {
      if (section === 'orders') return localOrdersCsv();
      return `section,exported\n${section},false`;
    }
  },

  makeSlug: slugify,
};
