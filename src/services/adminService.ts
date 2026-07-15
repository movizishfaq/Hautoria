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

function filterOrders(orders: Order[], status?: string) {
  if (!status || status === 'all') return orders;
  return orders.filter((o) => o.status === status);
}

function localDashboard() {
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
  getDashboard: async () => {
    if (!isApiEnabled()) {
      return mockRequest(localDashboard());
    }
    try {
      const dash = await apiRequest<{
        analytics: AdminAnalytics;
        recentOrders: Order[];
        lowStock: AdminProduct[];
      }>('/admin/dashboard');
      if ((dash.recentOrders?.length ?? 0) === 0 && loadLocalOrders().length) {
        const local = localDashboard();
        return {
          ...dash,
          analytics: {
            ...dash.analytics,
            revenue: dash.analytics.revenue || local.analytics.revenue,
            orders: dash.analytics.orders || local.analytics.orders,
            pipeline: Object.keys(dash.analytics.pipeline ?? {}).length
              ? dash.analytics.pipeline
              : local.analytics.pipeline,
            series: dash.analytics.series.some((s) => s.value > 0)
              ? dash.analytics.series
              : local.analytics.series,
          },
          recentOrders: local.recentOrders,
        };
      }
      return dash;
    } catch {
      return localDashboard();
    }
  },

  getOrders: async (status?: string) => {
    if (!isApiEnabled()) {
      return mockRequest({ orders: filterOrders(loadLocalOrders(), status) });
    }
    try {
      const qs = status ? `?status=${encodeURIComponent(status)}` : '';
      const res = await apiRequest<{ orders: Order[] }>(`/admin/orders${qs}`);
      if ((res.orders?.length ?? 0) > 0) return res;
      return { orders: filterOrders(loadLocalOrders(), status) };
    } catch {
      return { orders: filterOrders(loadLocalOrders(), status) };
    }
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
      return mockRequest({ order: updated });
    }
    try {
      return await apiRequest(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      });
    } catch {
      const updated = updateLocalOrderStatus(orderId, status as OrderStatus);
      if (!updated) throw new ApiError(404, 'Order not found');
      return { order: updated };
    }
  },

  getProducts: async () => {
    if (!isApiEnabled()) {
      return mockRequest({
        products: loadAdminCatalog().map((p) => ({ ...p, isActive: true })),
      });
    }
    try {
      return await apiRequest<{ products: AdminProduct[] }>('/admin/products');
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
