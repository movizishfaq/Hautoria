import type { AppNotification, Order } from '../types/domain';
import { apiRequest, isApiEnabled, mockRequest } from './api';

function mapOrder(raw: Record<string, unknown>): Order {
  const events = (raw.events as Array<Record<string, unknown>> | undefined)?.map(
    (e) => ({
      status: e.status as Order['status'],
      label: String(e.label ?? ''),
      description: String(e.description ?? ''),
      date:
        e.date instanceof Date
          ? e.date.toISOString()
          : String(e.date ?? new Date().toISOString()),
      completed: Boolean(e.completed),
    })
  ) ?? [];

  return {
    id: String(raw.id ?? raw._id ?? ''),
    number: String(raw.number ?? ''),
    status: (raw.status as Order['status']) ?? 'pending',
    createdAt: String(
      raw.createdAt
        ? new Date(raw.createdAt as string).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10)
    ),
    total: Number(raw.total ?? 0),
    subtotal: Number(raw.subtotal ?? 0),
    tax: Number(raw.tax ?? 0),
    shipping: Number(raw.shipping ?? 0),
    discount: Number(raw.discount ?? 0),
    items: (raw.items as Order['items']) ?? [],
    shippingAddress: raw.shippingAddress as Order['shippingAddress'],
    paymentProvider: (raw.paymentProvider as Order['paymentProvider']) ?? 'cod',
    trackingNumber: raw.trackingNumber as string | undefined,
    events,
  };
}

export const userService = {
  getOrders: async (): Promise<Order[]> => {
    if (!isApiEnabled()) return mockRequest([]);
    const res = await apiRequest<{ orders: Array<Record<string, unknown>> }>(
      '/commerce/orders'
    );
    return res.orders.map(mapOrder);
  },

  getOrder: async (id: string): Promise<Order | null> => {
    if (!isApiEnabled()) return mockRequest(null);
    try {
      const res = await apiRequest<{ order: Record<string, unknown> }>(
        `/commerce/orders/${id}`
      );
      return mapOrder(res.order);
    } catch {
      return null;
    }
  },

  trackOrder: async (id: string) => {
    if (!isApiEnabled()) return mockRequest({ timeline: [] });
    return apiRequest(`/commerce/orders/${id}/track`);
  },

  getNotifications: async (): Promise<AppNotification[]> => {
    if (!isApiEnabled()) return mockRequest([]);
    const res = await apiRequest<{ notifications: Array<Record<string, unknown>> }>('/user');
    return res.notifications.map((n) => ({
      id: String(n.id ?? n._id ?? ''),
      title: String(n.title ?? ''),
      body: String(n.body ?? ''),
      read: Boolean(n.read),
      createdAt: n.createdAt
        ? new Date(n.createdAt as string).toLocaleDateString()
        : 'Today',
      kind: (n.kind as AppNotification['kind']) ?? 'system',
    }));
  },
};
