import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { PageHeader, Panel, Badge, EmptyState } from '../components/ui';

type Coupon = {
  code: string;
  description?: string;
  amount: number;
  type: 'percent' | 'fixed';
  active: boolean;
};

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await adminService.getCoupons();
        setCoupons(res.coupons ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader title="Coupons" subtitle="Promotions and discount codes from your database" />
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
                {c.type === 'percent' ? `${c.amount}% off` : `Rs. ${c.amount} off`}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No coupons yet"
          description="Run npm run seed or create coupons via POST /admin/coupons."
        />
      )}
      <Panel title="Create coupon">
        <p className="text-sm text-[var(--admin-muted)]">
          Use API POST /admin/coupons or the seed script to add promotion codes.
        </p>
      </Panel>
    </div>
  );
}
