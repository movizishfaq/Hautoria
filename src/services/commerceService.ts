import type { CheckoutDraft, Order } from '../types/domain';
import { mockRequest } from './api';

export const commerceService = {
  validateCoupon: async (code: string) =>
  mockRequest(
    code.trim().toUpperCase() === 'GLOW10' ?
    { valid: true, discount: 10, label: '10% welcome ritual' } :
    { valid: false, discount: 0, label: 'Code not recognised' }
  ),
  createOrder: async (_draft: CheckoutDraft, order: Order): Promise<Order> =>
  mockRequest(order, 650),
  requestSupportAction: async (
  _orderId: string,
  type: 'return' | 'refund' | 'cancel' | 'exchange',
  _reason: string) =>
  mockRequest({ accepted: true, type }),
  sendInvoice: async (_orderId: string) => mockRequest({ queued: true })
};
// TODO: Connect payment intent/session creation, tax/shipping rates, orders, invoices, refunds and return endpoints. No provider transaction occurs in this frontend.