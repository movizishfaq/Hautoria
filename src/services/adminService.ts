import type { AdminAnalytics, Order } from '../types/domain';
import { apiRequest, isApiEnabled, mockRequest } from './api';
import { adminAnalytics, demoOrders } from '../lib/mockData';

export const adminService = {
  getDashboard: async () => {
    if (!isApiEnabled()) {
      return mockRequest({
        analytics: adminAnalytics,
        recentOrders: demoOrders,
        lowStock: [],
      });
    }
    return apiRequest<{
      analytics: AdminAnalytics;
      recentOrders: Order[];
      lowStock: Array<{ name: string; stock: number; slug: string }>;
    }>('/admin/dashboard');
  },

  getOrders: async (status?: string) => {
    if (!isApiEnabled()) return mockRequest({ orders: demoOrders });
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

  getLogs: async () => {
    if (!isApiEnabled()) return mockRequest({ logs: [] });
    return apiRequest('/admin/logs');
  },
  exportCsv: async (section: string) => {
    if (!isApiEnabled()) {
      return mockRequest(`section,exported\n${section},true`);
    }
    const data = await apiRequest<Record<string, unknown>>(`/admin/export/${encodeURIComponent(section)}`).catch(
      () => ({ csv: `section,exported\n${section},true` })
    );
    return String((data as { csv?: string }).csv ?? `section,exported\n${section},true`);
  },
};
