import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { useAppState } from '../../hooks/useAppState';
import { PageHeader, Panel, Badge, EmptyState, AdminButton, AdminInput, AdminSelect } from '../components/ui';

type Coupon = {
  code: string;
  description?: string;
  amount: number;
  type: 'percent' | 'fixed' | 'free_shipping';
  active: boolean;
};

export function AdminCouponsPage() {
  const { notify } = useAppState();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    code: '',
    description: '',
    type: 'percent' as Coupon['type'],
    amount: 10,
    minPurchase: 0,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCoupons();
      setCoupons(res.coupons ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminService.createCoupon(form);
      notify(`Coupon ${form.code.toUpperCase()} created`);
      setForm({ code: '', description: '', type: 'percent', amount: 10, minPurchase: 0 });
      await load();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Create failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader title="Coupons" subtitle="Create and manage promotion codes" />
      {loading ? (
        <p className="text-sm text-[var(--admin-muted)]">Loading coupons...</p>
      ) : coupons.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-serif text-2xl text-[var(--admin-fg)]">{c.code}</p>
                <Badge tone={c.active ? 'success' : 'neutral'}>{c.active ? 'Active' : 'Off'}</Badge>
              </div>
              <p className="mt-2 text-sm text-[var(--admin-muted)]">{c.description ?? 'No description'}</p>
              <p className="mt-3 text-sm text-[var(--admin-fg)]">
                {c.type === 'percent'
                  ? `${c.amount}% off`
                  : c.type === 'free_shipping'
                    ? 'Free shipping'
                    : `Rs. ${c.amount} off`}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No coupons yet"
          description="Create your first coupon below or run npm run seed."
        />
      )}
      <Panel title="Create coupon">
        <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Code</label>
            <AdminInput
              required
              className="mt-1"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="SUMMER20"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Type</label>
            <AdminSelect
              className="mt-1 w-full"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Coupon['type'] }))}
            >
              <option value="percent">Percent off</option>
              <option value="fixed">Fixed amount</option>
              <option value="free_shipping">Free shipping</option>
            </AdminSelect>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Amount</label>
            <AdminInput
              type="number"
              min={0}
              className="mt-1"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Min purchase</label>
            <AdminInput
              type="number"
              min={0}
              className="mt-1"
              value={form.minPurchase}
              onChange={(e) => setForm((f) => ({ ...f, minPurchase: Number(e.target.value) }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Description</label>
            <AdminInput
              className="mt-1"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <AdminButton type="submit" disabled={busy}>
              {busy ? 'Creating...' : 'Create coupon'}
            </AdminButton>
          </div>
        </form>
      </Panel>
    </div>
  );
}
