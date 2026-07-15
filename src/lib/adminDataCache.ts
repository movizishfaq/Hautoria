/** Short-lived in-memory cache so admin pages don't re-hit the API on every navigation. */

const TTL_MS = 45_000;

type Entry<T> = { data: T; at: number };

let dashboard: Entry<unknown> | null = null;
let products: Entry<unknown> | null = null;
const ordersByStatus = new Map<string, Entry<unknown>>();

function fresh<T>(entry: Entry<T> | null | undefined): T | null {
  if (!entry) return null;
  if (Date.now() - entry.at > TTL_MS) return null;
  return entry.data;
}

export const adminDataCache = {
  getDashboard<T>(): T | null {
    return fresh(dashboard) as T | null;
  },
  setDashboard<T>(data: T) {
    dashboard = { data, at: Date.now() };
  },
  getProducts<T>(): T | null {
    return fresh(products) as T | null;
  },
  setProducts<T>(data: T) {
    products = { data, at: Date.now() };
  },
  getOrders<T>(statusKey: string): T | null {
    return fresh(ordersByStatus.get(statusKey)) as T | null;
  },
  setOrders<T>(statusKey: string, data: T) {
    ordersByStatus.set(statusKey, { data, at: Date.now() });
  },
  invalidate(scope: 'all' | 'products' | 'orders' | 'dashboard' = 'all') {
    if (scope === 'all' || scope === 'dashboard') dashboard = null;
    if (scope === 'all' || scope === 'products') products = null;
    if (scope === 'all' || scope === 'orders' || scope === 'dashboard') {
      ordersByStatus.clear();
      if (scope === 'orders') dashboard = null;
    }
  },
};
