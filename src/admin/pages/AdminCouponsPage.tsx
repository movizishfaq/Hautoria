import React from 'react';
import { demoCoupons as coupons } from '../../lib/mockData';
import { PageHeader, Panel, Badge } from '../components/ui';

export function AdminCouponsPage() {
  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader title="Coupons" subtitle="Promotions and discount codes" />
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
            <p className="mt-2 text-sm text-[var(--admin-muted)]">{c.description}</p>
            <p className="mt-3 text-sm text-[var(--admin-fg)]">
              {c.type === 'percent' ? `${c.amount}% off` : `Rs. ${c.amount} off`}
            </p>
          </div>
        ))}
        <div className="rounded-2xl border border-dashed border-[var(--admin-border)] p-5 text-sm text-[var(--admin-muted)]">
          GLOW10 · VIP15 · FREESHIP seeded in MongoDB
        </div>
      </div>
      <Panel title="Create coupon">
        <p className="text-sm text-[var(--admin-muted)]">
          Use API POST /admin/coupons or seed script for new codes.
        </p>
      </Panel>
    </div>
  );
}
