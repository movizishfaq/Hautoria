import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, Wallet } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { adminService } from '../../services/adminService';
import { formatPKR, cn } from '../utils';
import { PageHeader, Panel, Badge, AdminButton, Skeleton, EmptyState } from '../components/ui';
import type { AdminAnalytics, Order } from '../../types/domain';

const PIPELINE = [
  { key: 'pending', label: 'Pending', tone: 'warning' as const },
  { key: 'processing', label: 'Processing', tone: 'neutral' as const },
  { key: 'shipped', label: 'Shipped', tone: 'info' as const },
  { key: 'delivered', label: 'Delivered', tone: 'success' as const },
  { key: 'cancelled', label: 'Cancelled', tone: 'danger' as const },
];

const EMPTY_STATS: AdminAnalytics = {
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

export function AdminDashboardPage() {
  const { products } = useCatalog();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminAnalytics>(EMPTY_STATS);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    void (async () => {
      try {
        const dash = await adminService.getDashboard();
        setStats(dash.analytics ?? EMPTY_STATS);
        setOrders(dash.recentOrders ?? []);
        setLowStockCount(dash.lowStock?.length ?? 0);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      </div>
    );
  }

  const catalogLowStock = products.filter((p) => p.stock <= 8).length;
  const lowStock = lowStockCount || catalogLowStock;
  const pipelineCounts = PIPELINE.map((p) => ({
    ...p,
    count: stats.pipeline?.[p.key] ?? orders.filter((o) => o.status === p.key).length,
  }));

  const heroes = [
    {
      label: 'Revenue',
      value: formatPKR(stats.revenue),
      meta: `${stats.orders} orders`,
      icon: Wallet,
      accent: true,
    },
    {
      label: 'Pending orders',
      value: pipelineCounts.find((p) => p.key === 'pending')?.count ?? 0,
      meta: 'Needs action',
      icon: ShoppingBag,
      to: '/admin/orders',
    },
    {
      label: 'Customers',
      value: stats.customers,
      meta: 'Registered shoppers',
      icon: Users,
      to: '/admin/customers',
    },
    {
      label: 'Catalog',
      value: products.length,
      meta: lowStock ? `${lowStock} low stock` : 'Stock healthy',
      icon: Package,
      to: '/admin/inventory',
    },
  ];

  const maxSeries = Math.max(...stats.series.map((s) => s.value), 1);
  const hasOrders = orders.length > 0;
  const hasRevenue = stats.series.some((s) => s.value > 0);

  return (
    <div className="max-w-[1400px] space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle={`${formatPKR(stats.revenue)} revenue · ${stats.conversion}% conversion`}
        actions={
          <Link to="/admin/orders">
            <AdminButton>Orders</AdminButton>
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {heroes.map((h) => {
          const Icon = h.icon;
          const inner = (
            <div
              className={cn(
                'group relative h-full overflow-hidden rounded-2xl border p-5 transition',
                h.accent
                  ? 'border-amber-700/25 bg-[var(--admin-elevated)]'
                  : 'border-[var(--admin-border)] bg-[var(--admin-card)] hover:border-amber-700/25 hover:bg-[var(--admin-hover)]'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-[var(--admin-muted)]">{h.label}</p>
                <span
                  className={cn(
                    'inline-flex h-9 w-9 items-center justify-center rounded-xl',
                    h.accent
                      ? 'bg-amber-700/15 text-amber-700'
                      : 'bg-[var(--admin-elevated)] text-[var(--admin-muted)]'
                  )}
                >
                  <Icon size={18} strokeWidth={1.6} />
                </span>
              </div>
              <p
                className={cn(
                  'mt-4 font-serif text-3xl tabular-nums tracking-tight',
                  h.accent ? 'text-amber-800' : 'text-[var(--admin-fg)]'
                )}
              >
                {h.value}
              </p>
              <p className="mt-1.5 text-sm text-[var(--admin-muted)]">{h.meta}</p>
            </div>
          );
          return h.to ? (
            <Link key={h.label} to={h.to} className="block">
              {inner}
            </Link>
          ) : (
            <div key={h.label}>{inner}</div>
          );
        })}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl text-[var(--admin-fg)]">Fulfillment</h2>
            <p className="text-sm text-[var(--admin-muted)]">Order pipeline at a glance</p>
          </div>
          <Link to="/admin/orders" className="text-sm text-amber-700 hover:underline">
            Manage orders
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {pipelineCounts.map((step) => (
            <Link
              key={step.key}
              to="/admin/orders"
              className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-4 transition hover:border-amber-700/30"
            >
              <p className="text-sm text-[var(--admin-muted)]">{step.label}</p>
              <p className="mt-2 font-serif text-3xl tabular-nums text-[var(--admin-fg)]">
                {step.count}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <Panel title="Revenue · last 7 days" className="xl:col-span-3">
          {hasRevenue ? (
            <div className="flex h-64 items-end gap-3">
              {stats.series.map((entry) => (
                <div key={entry.label} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-xl bg-amber-600/75"
                    style={{ height: `${(entry.value / maxSeries) * 200}px` }}
                  />
                  <span className="text-[10px] uppercase tracking-wider text-[var(--admin-muted)]">
                    {entry.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No revenue yet"
              description="Orders will populate this chart once customers start checking out."
            />
          )}
        </Panel>

        <Panel
          title="Latest orders"
          className="xl:col-span-2"
          action={
            <Link to="/admin/orders" className="text-xs text-amber-700 hover:underline">
              View all
            </Link>
          }
        >
          {hasOrders ? (
            <ul className="space-y-1">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id}>
                  <Link
                    to="/admin/orders"
                    className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition hover:bg-[var(--admin-hover)]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-[var(--admin-fg)]">{o.number}</p>
                      <p className="text-xs text-[var(--admin-muted)]">{o.createdAt}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium tabular-nums">{formatPKR(o.total)}</p>
                      <Badge tone={o.status === 'delivered' ? 'success' : 'info'}>{o.status}</Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No orders yet"
              description="New storefront orders will appear here in real time."
            />
          )}
        </Panel>
      </section>
    </div>
  );
}
