import React from 'react';
import type { OrderStatus } from '../../types/domain';

const labels: Partial<Record<OrderStatus, string>> = {
  pending: 'Pending',
  processing: 'Processing',
  confirmed: 'Confirmed',
  payment_verified: 'Payment verified',
  packed: 'Packed',
  quality_checked: 'Quality checked',
  ready_to_ship: 'Ready to ship',
  shipped: 'In transit',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refund_requested: 'Refund requested',
  refund_approved: 'Refund approved',
  refund_completed: 'Refund completed',
  returned: 'Returned',
  rejected: 'Rejected',
  refunded: 'Refunded',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const tone =
    status === 'delivered' || status === 'completed'
      ? 'bg-sage text-charcoal'
      : status === 'cancelled' ||
          status === 'refunded' ||
          status === 'rejected' ||
          status === 'returned'
        ? 'bg-blush text-charcoal'
        : 'bg-gold/15 text-charcoal';
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[0.62rem] font-medium uppercase tracking-luxe ${tone}`}
    >
      {labels[status] ?? status.replace(/_/g, ' ')}
    </span>
  );
}
