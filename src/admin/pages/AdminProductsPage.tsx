import React from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import { formatPKR } from '../utils';
import { PageHeader, Panel, AdminInput, Badge, EmptyState } from '../components/ui';

export function AdminProductsPage() {
  const { products } = useCatalog();
  const [q, setQ] = React.useState('');

  const filtered = products.filter(
    (p) =>
      !q.trim() ||
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.slug.includes(q.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader
        title="Products"
        subtitle={`${products.length} SKUs in catalog`}
      />
      <AdminInput
        placeholder="Search products..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-sm"
      />
      <Panel flush>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-[var(--admin-border)] text-xs uppercase tracking-wider text-[var(--admin-muted)]">
              <tr>
                <th className="p-4">Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-[var(--admin-border)]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-lg ${p.accent} p-1`}>
                        <img src={p.image} alt="" className="h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--admin-fg)]">{p.name}</p>
                        <p className="text-xs text-[var(--admin-muted)]">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="capitalize">{p.category}</td>
                  <td className="tabular-nums">{formatPKR(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <Badge tone={p.stock > 0 ? 'success' : 'danger'}>
                      {p.stock > 0 ? 'Active' : 'Out'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <EmptyState title="No products found" />}
        </div>
      </Panel>
      <p className="text-sm text-[var(--admin-muted)]">
        View on store:{' '}
        <Link to="/shop" className="text-amber-700 hover:underline">
          Open shop
        </Link>
      </p>
    </div>
  );
}
