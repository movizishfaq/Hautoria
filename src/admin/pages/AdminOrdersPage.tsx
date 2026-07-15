import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { commerceService } from '../../services/commerceService';
import { formatPKR } from '../utils';
import { PageHeader, Panel, AdminButton, AdminInput, AdminSelect, Badge, EmptyState } from '../components/ui';
import { adminPath } from '../paths';
import { useAppState } from '../../hooks/useAppState';
import { useAdminAuth } from '../AdminAuthContext';
import { ApiError } from '../../services/api';
import type { Order, OrderStatus } from '../../types/domain';

const STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'payment_verified',
  'processing',
  'packed',
  'quality_checked',
  'ready_to_ship',
  'shipped',
  'out_for_delivery',
  'delivered',
  'completed',
  'cancelled',
  'refund_requested',
  'refund_approved',
  'refund_completed',
  'returned',
  'rejected',
];

const FILTER_PRESETS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'payment_verified', label: 'Paid / verified' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function AdminOrdersPage() {
  const { notify } = useAppState();
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getOrders(status === 'all' ? undefined : status, {
        force: true,
        q: search || undefined,
        page,
        limit: 50,
      });
      setOrders(res.orders ?? []);
      setPages(res.pagination?.pages ?? 1);
      setTotal(res.pagination?.total ?? res.orders?.length ?? 0);
    } catch (err) {
      setOrders([]);
      setTotal(0);
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        setError('Admin session expired. Please log in again.');
        await logout();
        navigate(adminPath.login, { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : 'Could not load orders');
    } finally {
      setLoading(false);
    }
  }, [status, search, page, logout, navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  const openOrder = async (order: Order) => {
    setSelected(order);
    if (!order.id) return;
    try {
      const res = await adminService.getOrder(order.id);
      setSelected(res.order);
    } catch {
      /* keep list snapshot */
    }
  };

  const updateStatus = async (order: Order, next: string) => {
    if (!order.id) {
      notify('Invalid order id', 'error');
      return;
    }
    setBusy(true);
    try {
      const res = await adminService.updateOrderStatus(order.id, next);
      const updated = (res as { order?: Order }).order ?? {
        ...order,
        status: next as OrderStatus,
      };
      setOrders((list) => list.map((o) => (o.id === order.id ? updated : o)));
      setSelected(updated);
      notify(`Order ${order.number} → ${next}`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not update order', 'error');
    } finally {
      setBusy(false);
    }
  };

  const removeOrder = async (order: Order) => {
    if (!order.id) return;
    if (!confirm(`Delete order ${order.number}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await adminService.deleteOrder(order.id);
      setSelected(null);
      notify(`Order ${order.number} deleted`);
      await load();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not delete order', 'error');
    } finally {
      setBusy(false);
    }
  };

  const printInvoice = async (order: Order) => {
    if (!order.id) return;
    try {
      await commerceService.downloadInvoice(order.id);
    } catch {
      notify('Could not open invoice', 'error');
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

  const addr = selected?.shippingAddress;

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader
        title="Orders"
        subtitle={`${total} order${total === 1 ? '' : 's'} in database · newest first`}
        actions={
          <div className="flex gap-2">
            <AdminButton variant="secondary" onClick={() => void load()}>
              Refresh
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => void exportCsv()}>
              Export CSV
            </AdminButton>
          </div>
        }
      />

      <div className="flex flex-wrap gap-3">
        <AdminInput
          placeholder="Search order #, name, phone, email..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPage(1);
              setSearch(q.trim());
            }
          }}
          className="max-w-sm"
        />
        <AdminButton
          variant="secondary"
          onClick={() => {
            setPage(1);
            setSearch(q.trim());
          }}
        >
          Search
        </AdminButton>
        <AdminSelect
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          {FILTER_PRESETS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </AdminSelect>
      </div>

      <Panel flush>
        {loading ? (
          <p className="p-6 text-sm text-[var(--admin-muted)]">Loading orders...</p>
        ) : error ? (
          <EmptyState title="Could not load orders" description={error} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-[var(--admin-border)] text-xs uppercase tracking-wider text-[var(--admin-muted)]">
                <tr>
                  <th className="p-4">Order</th>
                  <th>Customer</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id ?? order.number} className="border-b border-[var(--admin-border)]">
                    <td className="p-4">
                      <p className="font-medium">{order.number}</p>
                      <p className="text-xs text-[var(--admin-muted)]">
                        {String(order.createdAt).slice(0, 10)}
                      </p>
                    </td>
                    <td>
                      {order.shippingAddress?.firstName ?? 'Guest'}{' '}
                      {order.shippingAddress?.lastName ?? ''}
                      <p className="text-xs text-[var(--admin-muted)]">{order.guestEmail}</p>
                    </td>
                    <td className="capitalize">
                      {order.paymentProvider?.replace(/_/g, ' ')}
                      <p className="text-xs text-[var(--admin-muted)]">{order.paymentStatus ?? '—'}</p>
                    </td>
                    <td className="tabular-nums">{formatPKR(order.total)}</td>
                    <td>
                      <Badge tone={order.status === 'delivered' || order.status === 'completed' ? 'success' : 'info'}>
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td>
                      <AdminButton variant="ghost" onClick={() => void openOrder(order)}>
                        View
                      </AdminButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders.length && (
              <EmptyState
                title="No orders in MongoDB yet"
                description="Only real checkouts that save to the database appear here. Place a new order on the live site, then click Refresh. Older failed/local checkouts will not show."
              />
            )}
          </div>
        )}
      </Panel>

      {pages > 1 && (
        <div className="flex items-center gap-3">
          <AdminButton
            variant="secondary"
            disabled={page <= 1 || busy}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </AdminButton>
          <span className="text-sm text-[var(--admin-muted)]">
            Page {page} of {pages}
          </span>
          <AdminButton
            variant="secondary"
            disabled={page >= pages || busy}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </AdminButton>
        </div>
      )}

      {selected && (
        <Panel title={`Order ${selected.number}`}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-[var(--admin-muted)]">Customer</p>
              <p className="text-[var(--admin-fg)]">
                {addr?.firstName} {addr?.lastName}
              </p>
              <p className="text-sm text-[var(--admin-muted)]">{selected.guestEmail}</p>
              <p className="text-sm text-[var(--admin-muted)]">{addr?.phone}</p>
              <p className="mt-2 text-sm text-[var(--admin-muted)]">
                {[addr?.line1, addr?.city, addr?.postalCode, addr?.country].filter(Boolean).join(', ')}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--admin-muted)]">Totals</p>
              <p className="text-sm">Subtotal {formatPKR(selected.subtotal ?? 0)}</p>
              <p className="text-sm">Shipping {formatPKR(selected.shipping ?? 0)}</p>
              <p className="text-sm">Tax {formatPKR(selected.tax ?? 0)}</p>
              {!!selected.discount && (
                <p className="text-sm">Discount −{formatPKR(selected.discount)}</p>
              )}
              <p className="mt-2 font-serif text-2xl">{formatPKR(selected.total)}</p>
              <p className="mt-1 text-sm text-[var(--admin-muted)]">
                {selected.paymentProvider} · {selected.paymentStatus ?? 'pending'}
              </p>
              {selected.trackingNumber && (
                <p className="text-sm text-[var(--admin-muted)]">Tracking {selected.trackingNumber}</p>
              )}
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

          {!!selected.events?.length && (
            <div className="mt-4 border-t border-[var(--admin-border)] pt-4">
              <p className="mb-2 text-sm text-[var(--admin-muted)]">Timeline</p>
              <ul className="space-y-2">
                {selected.events.map((event, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{event.label}</span>
                    <span className="text-[var(--admin-muted)]"> · {String(event.date).slice(0, 16)}</span>
                    {event.description && (
                      <p className="text-xs text-[var(--admin-muted)]">{event.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <AdminSelect
              value={selected.status}
              onChange={(e) => void updateStatus(selected, e.target.value)}
              disabled={busy}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </AdminSelect>
            <AdminButton variant="secondary" onClick={() => void printInvoice(selected)} disabled={busy}>
              Invoice
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => void removeOrder(selected)} disabled={busy}>
              Delete
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => setSelected(null)}>
              Close
            </AdminButton>
          </div>
        </Panel>
      )}
    </div>
  );
}
