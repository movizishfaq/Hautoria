import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { formatPKR } from '../utils';
import { PageHeader, Panel, AdminButton, AdminInput, AdminSelect, Badge, EmptyState } from '../components/ui';
import { useAppState } from '../../hooks/useAppState';
import type { Order, OrderStatus } from '../../types/domain';

const STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'payment_verified',
  'processing',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
  'completed',
  'cancelled',
  'refund_requested',
  'returned',
];

export function AdminOrdersPage() {
  const { notify, orders: localOrders } = useAppState();
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiOrders, setApiOrders] = useState<Order[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const res = await adminService.getOrders(status === 'all' ? undefined : status);
        if (!cancelled) setApiOrders(res.orders ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  useEffect(() => {
    const byId = new Map<string, Order>();
    for (const o of [...apiOrders, ...localOrders]) {
      if (!o?.id && !o?.number) continue;
      byId.set(o.id || o.number, o);
    }
    let merged = Array.from(byId.values());
    if (status !== 'all') merged = merged.filter((o) => o.status === status);
    merged.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    setOrders(merged);
  }, [apiOrders, localOrders, status]);

  const filtered = orders.filter(
    (o) =>
      !q.trim() ||
      o.number.toLowerCase().includes(q.toLowerCase()) ||
      o.shippingAddress?.firstName?.toLowerCase().includes(q.toLowerCase())
  );

  const updateStatus = async (order: Order, next: string) => {
    if (!order.id) {
      notify('Invalid order id', 'error');
      return;
    }
    setBusy(true);
    try {
      await adminService.updateOrderStatus(order.id, next);
      setOrders((list) =>
        list.map((o) => (o.id === order.id ? { ...o, status: next as OrderStatus } : o))
      );
      setSelected((s) => (s?.id === order.id ? { ...s, status: next as OrderStatus } : s));
      notify(`Order ${order.number} → ${next}`);
    } catch {
      notify('Could not update order', 'error');
    } finally {
      setBusy(false);
    }
  };

  const exportCsv = async () => {
    try {
      const csv = await adminService.exportCsv('orders');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hautoria-orders.csv';
      a.click();
      URL.revokeObjectURL(url);
      notify('Orders exported');
    } catch {
      notify('Export failed', 'error');
    }
  };

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader
        title="Orders"
        subtitle="Manage fulfillment, payments, and customer updates"
        actions={<AdminButton variant="secondary" onClick={() => void exportCsv()}>Export CSV</AdminButton>}
      />

      <div className="flex flex-wrap gap-3">
        <AdminInput
          placeholder="Search order or customer..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <AdminSelect value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </AdminSelect>
      </div>

      <Panel flush>
        {loading ? (
          <p className="p-6 text-sm text-[var(--admin-muted)]">Loading orders...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[var(--admin-border)] text-xs uppercase tracking-wider text-[var(--admin-muted)]">
                <tr>
                  <th className="p-4">Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id ?? order.number} className="border-b border-[var(--admin-border)]">
                    <td className="p-4 font-medium">{order.number}</td>
                    <td>{order.shippingAddress?.firstName ?? 'Guest'}</td>
                    <td className="tabular-nums">{formatPKR(order.total)}</td>
                    <td>
                      <Badge tone={order.status === 'delivered' ? 'success' : 'info'}>
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td>
                      <AdminButton variant="ghost" onClick={() => setSelected(order)}>
                        View
                      </AdminButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <EmptyState title="No orders yet" description="Orders from checkout will appear here." />
            )}
          </div>
        )}
      </Panel>

      {selected && (
        <Panel title={`Order ${selected.number}`}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-[var(--admin-muted)]">Customer</p>
              <p className="text-[var(--admin-fg)]">
                {selected.shippingAddress?.firstName} {selected.shippingAddress?.lastName}
              </p>
              <p className="text-sm text-[var(--admin-muted)]">{selected.shippingAddress?.phone}</p>
              <p className="text-sm text-[var(--admin-muted)]">{selected.shippingAddress?.city}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--admin-muted)]">Total</p>
              <p className="font-serif text-2xl">{formatPKR(selected.total)}</p>
              <p className="mt-1 text-sm text-[var(--admin-muted)]">
                Payment: {selected.paymentProvider}
              </p>
            </div>
          </div>
          {selected.items?.length > 0 && (
            <ul className="mt-4 space-y-2 border-t border-[var(--admin-border)] pt-4">
              {selected.items.map((item, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="tabular-nums">{formatPKR(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <AdminSelect
              defaultValue={selected.status}
              onChange={(e) => void updateStatus(selected, e.target.value)}
              disabled={busy}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </AdminSelect>
            <AdminButton variant="secondary" onClick={() => setSelected(null)}>
              Close
            </AdminButton>
          </div>
        </Panel>
      )}
    </div>
  );
}
