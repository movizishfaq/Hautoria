import React from 'react';
import type { OrderStatus } from '../../types/domain';
const labels: Record<OrderStatus, string> = {
  processing: 'Processing',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'In transit',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded'
};
export function StatusBadge({ status }: {status: OrderStatus;}) {
  const tone =
  status === 'delivered' ?
  'bg-sage text-charcoal' :
  status === 'cancelled' || status === 'refunded' ?
  'bg-blush text-charcoal' :
  'bg-gold/15 text-charcoal';
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[0.62rem] font-medium uppercase tracking-luxe ${tone}`}>
      
      {labels[status]}
    </span>);

}