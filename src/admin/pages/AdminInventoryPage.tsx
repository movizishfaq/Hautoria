import React from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { inventory } from '../../lib/mockData';
import { PageHeader, Panel, Badge } from '../components/ui';

export function AdminInventoryPage() {
  const { products } = useCatalog();

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader title="Inventory" subtitle="Live stock levels and low-stock alerts" />
      <div className="grid gap-4 lg:grid-cols-2">
        {inventory.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          const low = item.stock <= item.threshold;
          return (
            <div
              key={item.sku}
              className="flex items-center gap-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5"
            >
              <div className={`h-16 w-14 rounded-xl ${product?.accent ?? 'bg-beige'} p-2`}>
                {product && <img src={product.image} alt="" className="h-full object-contain" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-lg text-[var(--admin-fg)]">{product?.name}</p>
                <p className="text-xs text-[var(--admin-muted)]">
                  {item.sku} · Updated {item.updatedAt}
                </p>
              </div>
              <Badge tone={low ? 'warning' : 'success'}>{item.stock} in stock</Badge>
            </div>
          );
        })}
      </div>
      <Panel title="Warehouse">
        <p className="text-sm text-[var(--admin-muted)]">
          Main warehouse · Auto stock deduction on checkout · Reserved stock supported via API
        </p>
      </Panel>
    </div>
  );
}
