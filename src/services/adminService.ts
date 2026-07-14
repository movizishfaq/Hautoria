import type { AdminAnalytics, Order, Product } from '../types/domain';
import { apiRequest, ApiError, isApiEnabled, mockRequest } from './api';
import {
  loadAdminCatalog,
  removeAdminProduct,
  updateAdminStock,
  upsertAdminProduct,
} from '../lib/adminCatalogStore';

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
  getDashboard: async () => {
    if (!isApiEnabled()) {
      const products = loadAdminCatalog();
      return mockRequest({
        analytics: {
          ...EMPTY_ANALYTICS,
          products: products.length,
        },
        recentOrders: [] as Order[],
        lowStock: products.filter((p) => p.stock <= 8),
      });
    }
    return apiRequest<{
      analytics: AdminAnalytics;
      recentOrders: Order[];
      lowStock: AdminProduct[];
    }>('/admin/dashboard');
  },

  getOrders: async (status?: string) => {
    if (!isApiEnabled()) return mockRequest({ orders: [] as Order[] });
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiRequest<{ orders: Order[] }>(`/admin/orders${qs}`);
  },

  getOrder: async (id: string) => {
    if (!isApiEnabled()) throw new ApiError(404, 'Order not found');
    return apiRequest<{ order: Order }>(`/admin/orders/${id}`);
  },

  updateOrderStatus: async (orderId: string, status: string, note?: string) => {
    if (!isApiEnabled()) return mockRequest({ order: { id: orderId, status } });
    return apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  },

  getProducts: async () => {
    if (!isApiEnabled()) {
      return mockRequest({
        products: loadAdminCatalog().map((p) => ({ ...p, isActive: true })),
      });
    }
    return apiRequest<{ products: AdminProduct[] }>('/admin/products');
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
      return mockRequest({ product });
    }
    return apiRequest<{ product: AdminProduct }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(input),
    });
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
      return mockRequest({ product: updated });
    }
    return apiRequest<{ product: AdminProduct }>(`/admin/products/${slug}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  updateStock: async (slug: string, stock: number) => {
    if (!isApiEnabled()) {
      const updated = updateAdminStock(slug, stock);
      if (!updated) throw new ApiError(404, 'Product not found');
      return mockRequest({ product: { ...updated, isActive: true } });
    }
    return apiRequest<{ product: AdminProduct }>(`/admin/products/${slug}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
  },

  deleteProduct: async (slug: string) => {
    if (!isApiEnabled()) {
      removeAdminProduct(slug);
      return mockRequest({ ok: true });
    }
    return apiRequest<{ product: AdminProduct }>(`/admin/products/${slug}`, {
      method: 'DELETE',
    });
  },

  getCustomers: async () => {
    if (!isApiEnabled()) return mockRequest({ customers: [] });
    return apiRequest('/admin/customers');
  },

  getCoupons: async () => {
    if (!isApiEnabled()) return mockRequest({ coupons: [] });
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
    return apiRequest('/admin/logs');
  },

  exportCsv: async (section: string) => {
    if (!isApiEnabled()) {
      if (section === 'products') {
        const rows = loadAdminCatalog().map((p) =>
          [p.slug, `"${p.name}"`, p.price, p.stock].join(',')
        );
        return mockRequest(`slug,name,price,stock\n${rows.join('\n')}`);
      }
      return mockRequest(`section,exported\n${section},false`);
    }
    const data = await apiRequest<{ csv: string }>(`/admin/export/${encodeURIComponent(section)}`);
    return data.csv;
  },

  makeSlug: slugify,
};
