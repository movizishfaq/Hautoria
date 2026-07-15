import type { CheckoutDraft, Order } from '../types/domain';
import { apiRequest, isApiEnabled, mockRequest } from './api';

type CheckoutItem = { productId: string; variantId: string; quantity: number };

function mapApiOrder(raw: Record<string, unknown>): Order {
  const events = (raw.events as Array<Record<string, unknown>> | undefined)?.map(
    (e) => ({
      status: e.status as Order['status'],
      label: String(e.label ?? ''),
      description: String(e.description ?? ''),
      date: e.date ? String(e.date) : new Date().toISOString(),
      completed: Boolean(e.completed),
    })
  ) ?? [];

  return {
    id: String(raw.id ?? raw._id ?? ''),
    number: String(raw.number ?? ''),
    status: (raw.status as Order['status']) ?? 'pending',
    createdAt: raw.createdAt
      ? new Date(raw.createdAt as string).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
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

export const commerceService = {
  validateCoupon: async (code: string, subtotal = 0) => {
    if (!isApiEnabled()) {
      return mockRequest(
        code.trim().toUpperCase() === 'GLOW10'
          ? { valid: true, discount: 10, label: '10% welcome ritual' }
          : { valid: false, discount: 0, label: 'Code not recognised' }
      );
    }
    return apiRequest<{
      valid: boolean;
      discount: number;
      label: string;
      freeShipping?: boolean;
    }>('/commerce/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  },

  createOrder: async (
    draft: CheckoutDraft,
    items: CheckoutItem[],
    fallbackOrder: Order
  ): Promise<Order> => {
    if (!isApiEnabled()) return mockRequest(fallbackOrder, 650);

    try {
      const res = await apiRequest<{ order: Record<string, unknown> }>(
        '/commerce/checkout',
        {
          method: 'POST',
          body: JSON.stringify({
            email: draft.email,
            items,
            shippingAddress: draft.address,
            shippingMethod: draft.shippingMethod,
            paymentProvider: draft.paymentProvider,
            couponCode: draft.couponCode,
            guestCheckout: true,
          }),
        }
      );
      return mapApiOrder(res.order);
    } catch {
      // API down — keep checkout working with local order
      return mockRequest(fallbackOrder, 400);
    }
  },

  trackOrder: async (orderId: string) => {
    if (!isApiEnabled()) return mockRequest({ timeline: [] });
    return apiRequest(`/commerce/orders/${orderId}/track`);
  },

  downloadInvoice: async (orderId: string) => {
    if (!isApiEnabled()) return mockRequest({ queued: true });
    const { apiConfig } = await import('./api');
    const base = apiConfig.baseUrl.replace(/\/$/, '');
    window.open(`${base}/commerce/orders/${orderId}/invoice`, '_blank');
    return { downloaded: true };
  },

  requestSupportAction: async (
    orderId: string,
    type: 'return' | 'refund' | 'cancel' | 'exchange',
    reason: string
  ) => {
    if (!isApiEnabled()) return mockRequest({ accepted: true, type });
    return apiRequest(`/commerce/orders/${orderId}/return`, {
      method: 'POST',
      body: JSON.stringify({
        type: type === 'exchange' ? 'return' : type,
        reason,
      }),
    });
  },

  sendInvoice: async (orderId: string) => commerceService.downloadInvoice(orderId),
};
