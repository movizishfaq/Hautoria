import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { PageHeader, Panel, AdminInput, EmptyState } from '../components/ui';

type Customer = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  loyaltyPoints?: number;
  tier?: string;
};

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    void (async () => {
      const res = await adminService.getCustomers();
      setCustomers((res as { customers?: Customer[] }).customers ?? []);
    })();
  }, []);

  const filtered = customers.filter(
    (c) =>
      !q.trim() ||
      c.name?.toLowerCase().includes(q.toLowerCase()) ||
      c.email?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader title="Customers" subtitle="CRM list and loyalty overview" />
      <AdminInput
        placeholder="Search name or email..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-sm"
      />
      <Panel flush>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-[var(--admin-border)] text-xs uppercase tracking-wider text-[var(--admin-muted)]">
              <tr>
                <th className="p-4">Name</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id ?? c.id ?? c.email} className="border-b border-[var(--admin-border)]">
                  <td className="p-4 font-medium">{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.tier ?? 'Rose'}</td>
                  <td>{c.loyaltyPoints ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <EmptyState
              title="No customers yet"
              description="Register via storefront or seed MongoDB."
            />
          )}
        </div>
      </Panel>
    </div>
  );
}
