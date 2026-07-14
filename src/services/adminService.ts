import type { AdminAnalytics, Order } from '../types/domain';
import { apiRequest, isApiEnabled, mockRequest } from './api';

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
};

export const adminService = {
  getDashboard: async () => {
    if (!isApiEnabled()) {
      return mockRequest({
        analytics: EMPTY_ANALYTICS,
        recentOrders: [] as Order[],
        lowStock: [] as Array<{ name: string; stock: number; slug: string }>,
      });
    }
    return apiRequest<{
      analytics: AdminAnalytics;
      recentOrders: Order[];
      lowStock: Array<{ name: string; stock: number; slug: string }>;
    }>('/admin/dashboard');
  },

  getOrders: async (status?: string) => {
    if (!isApiEnabled()) return mockRequest({ orders: [] as Order[] });
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiRequest<{ orders: Order[] }>(`/admin/orders${qs}`);
  },

  updateOrderStatus: async (orderId: string, status: string, note?: string) => {
    if (!isApiEnabled()) return mockRequest({ order: { id: orderId, status } });
    return apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  },

  getCustomers: async () => {
    if (!isApiEnabled()) return mockRequest({ customers: [] });
    return apiRequest('/admin/customers');
  },

  getCoupons: async () => {
    if (!isApiEnabled()) return mockRequest({ coupons: [] });
    return apiRequest<{ coupons: Array<{
      code: string;
      description?: string;
      amount: number;
      type: 'percent' | 'fixed';
      active: boolean;
    }> }>('/admin/coupons');
  },

  getLogs: async () => {
    if (!isApiEnabled()) return mockRequest({ logs: [] });
    return apiRequest('/admin/logs');
  },

  exportCsv: async (section: string) => {
    if (!isApiEnabled()) {
      return mockRequest(`section,exported\n${section},false`);
    }
    const data = await apiRequest<Record<string, unknown>>(`/admin/export/${encodeURIComponent(section)}`).catch(
      () => ({ csv: `section,exported\n${section},false` })
    );
    return String((data as { csv?: string }).csv ?? `section,exported\n${section},false`);
  },
};
