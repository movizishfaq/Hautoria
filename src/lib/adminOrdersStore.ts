import type { Order, OrderStatus } from '../types/domain';

const ORDERS_KEY = 'hautoria_orders';

export function loadLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function upsertLocalOrder(order: Order) {
  const list = loadLocalOrders().filter((o) => o.id !== order.id && o.number !== order.number);
  list.unshift(order);
  saveLocalOrders(list);
  return list;
}

export function updateLocalOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const list = loadLocalOrders();
  const idx = list.findIndex((o) => o.id === orderId || o.number === orderId);
  if (idx < 0) return null;
  const updated: Order = {
    ...list[idx],
    status,
    events: [
      ...(list[idx].events ?? []),
      {
        status,
        label: status.replace(/_/g, ' '),
        description: `Status updated to ${status.replace(/_/g, ' ')}`,
        date: new Date().toISOString(),
        completed: true,
      },
    ],
  };
  list[idx] = updated;
  saveLocalOrders(list);
  return updated;
}

export function buildLocalAnalytics(orders: Order[]) {
  const revenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const pipeline: Record<string, number> = {};
  for (const o of orders) {
    pipeline[o.status] = (pipeline[o.status] ?? 0) + 1;
  }
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const series = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const value = orders
      .filter((o) => {
        const created = new Date(o.createdAt);
        return created >= d && created < next;
      })
      .reduce((sum, o) => sum + o.total, 0);
    return { label: dayLabels[d.getDay()], value };
  });

  return {
    revenue,
    orders: orders.length,
    customers: new Set(
      orders.map((o) => o.shippingAddress?.phone || o.shippingAddress?.firstName || o.id)
    ).size,
    conversion: orders.length ? 4.2 : 0,
    series,
    pipeline,
  };
}
