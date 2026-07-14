import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { demoOrders } from '../../lib/mockData';
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
  'cancelled',
];

export function AdminOrdersPage() {
  const { notify } = useAppState();
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await adminService.getOrders(status === 'all' ? undefined : status);
      setOrders(res.orders ?? demoOrders);
    })();
  }, [status]);

  const filtered = orders.filter(
    (o) =>
      !q.trim() ||
      o.number.toLowerCase().includes(q.toLowerCase()) ||
      o.shippingAddress?.firstName?.toLowerCase().includes(q.toLowerCase())
  );

  const updateStatus = async (order: Order, next: string) => {
    setBusy(true);
    try {
      await adminService.updateOrderStatus(order.id, next);
      setOrders((list) =>
        list.map((o) => (o.id === order.id ? { ...o, status: next as OrderStatus } : o))
      );
      notify(`Order ${order.number} → ${next}`);
    } catch {
      notify('Could not update order', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader
        title="Orders"
        subtitle="Manage fulfillment, payments, and customer updates"
        actions={<AdminButton variant="secondary">Export CSV</AdminButton>}
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
                <tr key={order.id} className="border-b border-[var(--admin-border)]">
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
          {!filtered.length && <EmptyState title="No orders" description="Try another filter." />}
        </div>
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
            </div>
            <div>
              <p className="text-sm text-[var(--admin-muted)]">Total</p>
              <p className="font-serif text-2xl">{formatPKR(selected.total)}</p>
            </div>
          </div>
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
