import React from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { PageHeader, Panel, Badge } from '../components/ui';

export function AdminInventoryPage() {
  const { products } = useCatalog();
  const threshold = 8;

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader title="Inventory" subtitle="Live stock levels from your catalog" />
      <div className="grid gap-4 lg:grid-cols-2">
        {products.map((product) => {
          const low = product.stock <= threshold;
          const sku = product.variants[0]?.sku ?? product.id;
          return (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5"
            >
              <div className={`h-16 w-14 rounded-xl ${product.accent} p-2`}>
                <img src={product.image} alt="" className="h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-lg text-[var(--admin-fg)]">{product.name}</p>
                <p className="text-xs text-[var(--admin-muted)]">
                  {sku} · {product.stock} units available
                </p>
              </div>
              <Badge tone={low ? 'warning' : 'success'}>{product.stock} in stock</Badge>
            </div>
          );
        })}
      </div>
      <Panel title="Warehouse">
        <p className="text-sm text-[var(--admin-muted)]">
          Stock syncs from your live catalog. Low-stock alert threshold: {threshold} units.
        </p>
      </Panel>
    </div>
  );
}
