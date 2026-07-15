import React, { useCallback, useEffect, useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { adminService, type AdminProduct } from '../../services/adminService';
import { useAppState } from '../../hooks/useAppState';
import { PageHeader, Panel, Badge, AdminButton, AdminInput } from '../components/ui';

export function AdminInventoryPage() {
  const { refresh } = useCatalog();
  const { notify } = useAppState();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const threshold = 8;

  const load = useCallback(async () => {
    const res = await adminService.getProducts();
    setProducts(res.products ?? []);
    const next: Record<string, string> = {};
    for (const p of res.products ?? []) next[p.slug] = String(p.stock);
    setDrafts(next);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveStock = async (slug: string) => {
    const stock = Number(drafts[slug]);
    if (Number.isNaN(stock) || stock < 0) {
      notify('Enter a valid stock number', 'error');
      return;
    }
    setBusy(slug);
    try {
      await adminService.updateStock(slug, stock);
      notify('Stock updated');
      await Promise.all([load(), refresh()]);
    } catch {
      notify('Stock update failed', 'error');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader title="Inventory" subtitle="Update stock levels — saves to database and storefront" />
      <div className="grid gap-4 lg:grid-cols-2">
        {products.map((product) => {
          const low = product.stock <= threshold;
          const sku = product.variants[0]?.sku ?? product.slug;
          return (
            <div
              key={product.id}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className={`h-16 w-14 rounded-xl ${product.accent} p-2`}>
                  <img src={product.image} alt="" className="h-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-lg text-[var(--admin-fg)]">{product.name}</p>
                  <p className="text-xs text-[var(--admin-muted)]">{sku}</p>
                </div>
                <Badge tone={low ? 'warning' : 'success'}>{product.stock} in stock</Badge>
              </div>
              <div className="flex items-center gap-2">
                <AdminInput
                  type="number"
                  min={0}
                  className="w-24"
                  value={drafts[product.slug] ?? String(product.stock)}
                  onChange={(e) =>
                    setDrafts((d) => ({ ...d, [product.slug]: e.target.value }))
                  }
                />
                <AdminButton
                  variant="secondary"
                  disabled={busy === product.slug}
                  onClick={() => void saveStock(product.slug)}
                >
                  {busy === product.slug ? '...' : 'Save'}
                </AdminButton>
              </div>
            </div>
          );
        })}
      </div>
      <Panel title="Warehouse">
        <p className="text-sm text-[var(--admin-muted)]">
          Low-stock alert threshold: {threshold} units. Stock deducts automatically on checkout.
        </p>
      </Panel>
    </div>
  );
}
