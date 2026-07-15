import type { AdminAnalytics, Order, Product } from '../types/domain';
import { apiRequest, ApiError, isApiEnabled, mockRequest } from './api';
import {
  loadAdminCatalog,
  removeAdminProduct,
  updateAdminStock,
  upsertAdminProduct,
} from '../lib/adminCatalogStore';
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

export const adminService = {
  getDashboard: async (opts?: { force?: boolean }) => {
    if (!opts?.force) {
      const cached = adminDataCache.getDashboard<DashboardPayload>();
      if (cached) return cached;
    }
    if (!isApiEnabled()) {
      throw new ApiError(503, 'Admin API is unavailable');
    }
    const dash = await apiRequest<DashboardPayload>('/admin/dashboard');
    adminDataCache.setDashboard(dash);
    return dash;
  },

  getOrder: async (id: string) => {
    if (!isApiEnabled()) {
      throw new ApiError(503, 'Admin API is unavailable');
    }
    return apiRequest<{ order: Order }>(`/admin/orders/${id}`);
  },

  updateOrderStatus: async (orderId: string, status: string, note?: string) => {
    if (!isApiEnabled()) {
      throw new ApiError(503, 'Admin API is unavailable');
    }
    const res = await apiRequest<{ order: Order }>(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
    adminDataCache.invalidate('orders');
    return res;
  },

  deleteOrder: async (orderId: string) => {
    if (!isApiEnabled()) {
      throw new ApiError(503, 'Admin API is unavailable');
    }
    const res = await apiRequest<{ ok: boolean }>(`/admin/orders/${orderId}`, {
      method: 'DELETE',
    });
    adminDataCache.invalidate('orders');
    return res;
  },

  getOrders: async (
    status?: string,
    opts?: { force?: boolean; q?: string; page?: number; limit?: number }
  ) => {
    const key = `${status ?? 'all'}:${opts?.q ?? ''}:${opts?.page ?? 1}`;
    if (!opts?.force) {
      const cached = adminDataCache.getOrders<{
        orders: Order[];
        pagination?: { page: number; limit: number; total: number; pages: number };
      }>(key);
      if (cached) return cached;
    }
    if (!isApiEnabled()) {
      throw new ApiError(503, 'Admin API is unavailable');
    }
    const params = new URLSearchParams();
    if (status && status !== 'all') params.set('status', status);
    if (opts?.q) params.set('q', opts.q);
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.limit) params.set('limit', String(opts.limit));
    const qs = params.toString() ? `?${params}` : '';
    const res = await apiRequest<{
      orders: Order[];
      pagination?: { page: number; limit: number; total: number; pages: number };
    }>(`/admin/orders${qs}`);
    adminDataCache.setOrders(key, res);
    return res;
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
      throw new ApiError(503, 'Admin API is unavailable');
    }
    return apiRequest('/admin/customers');
  },

  getCoupons: async () => {
    if (!isApiEnabled()) {
      throw new ApiError(503, 'Admin API is unavailable');
    }
    return apiRequest<{
      coupons: Array<{
        code: string;
        description?: string;
        amount: number;
        type: 'percent' | 'fixed' | 'free_shipping';
        active: boolean;
      }>;
    }>('/admin/coupons');
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
      throw new ApiError(503, 'Admin API is unavailable');
    }
    return apiRequest('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  getLogs: async () => {
    if (!isApiEnabled()) {
      throw new ApiError(503, 'Admin API is unavailable');
    }
    return apiRequest('/admin/logs');
  },

  exportCsv: async (section: string) => {
    if (!isApiEnabled()) {
      throw new ApiError(503, 'Admin API is unavailable');
    }
    const data = await apiRequest<{ csv: string }>(
      `/admin/export/${encodeURIComponent(section)}`
    );
    return data.csv;
  },

  makeSlug: slugify,
};
