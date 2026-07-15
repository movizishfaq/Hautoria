import type { Address, CheckoutDraft, Order } from '../types/domain';
import { apiRequest, ApiError, isApiEnabled } from './api';
import { adminDataCache } from '../lib/adminDataCache';

type CheckoutItem = { productId: string; variantId: string; quantity: number };

function mapApiOrder(raw: Record<string, unknown>): Order {
  const events =
    (raw.events as Array<Record<string, unknown>> | undefined)?.map((e) => ({
      status: e.status as Order['status'],
      label: String(e.label ?? ''),
      description: String(e.description ?? ''),
      date: e.date ? String(e.date) : new Date().toISOString(),
      completed: Boolean(e.completed),
    })) ?? [];

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

/** Strip boolean/meta fields so checkout payload stays API-safe. */
function sanitizeAddress(address: Address | undefined) {
  if (!address) throw new ApiError(400, 'Delivery address is required');
  return {
    firstName: address.firstName?.trim() ?? '',
    lastName: address.lastName?.trim() ?? '',
    line1: address.line1?.trim() ?? '',
    line2: address.line2?.trim() || undefined,
    city: address.city?.trim() ?? '',
    state: address.state?.trim() || '',
    postalCode: address.postalCode?.trim() ?? '',
    country: address.country?.trim() || 'Pakistan',
    phone: address.phone?.trim() ?? '',
    label: address.label?.trim() || 'Home',
  };
}

export const commerceService = {
  validateCoupon: async (code: string, subtotal = 0) => {
    if (!isApiEnabled()) {
      throw new ApiError(503, 'Checkout API is not configured');
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

  createOrder: async (draft: CheckoutDraft, items: CheckoutItem[]): Promise<Order> => {
    if (!isApiEnabled()) {
      throw new ApiError(
        503,
        'Store API is unavailable. Start the server or check your deployment.'
      );
    }
    if (!items.length) {
      throw new ApiError(400, 'Your bag is empty');
    }

    const shippingAddress = sanitizeAddress(draft.address);
    if (
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.line1 ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      throw new ApiError(400, 'Complete all delivery details');
    }

    const res = await apiRequest<{ order: Record<string, unknown> }>(
      '/commerce/checkout',
      {
        method: 'POST',
        body: JSON.stringify({
          email: draft.email.trim(),
          items,
          shippingAddress,
          shippingMethod: draft.shippingMethod,
          paymentProvider: draft.paymentProvider,
          couponCode: draft.couponCode,
          guestCheckout: true,
        }),
      }
    );

    // New order must show up immediately in admin.
    adminDataCache.invalidate('orders');
    return mapApiOrder(res.order);
  },

  trackOrder: async (orderId: string) => {
    if (!isApiEnabled()) throw new ApiError(503, 'Store API is unavailable');
    return apiRequest(`/commerce/orders/${orderId}/track`);
  },

  downloadInvoice: async (orderId: string) => {
    if (!isApiEnabled()) throw new ApiError(503, 'Store API is unavailable');
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
    if (!isApiEnabled()) throw new ApiError(503, 'Store API is unavailable');
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
