import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import { adminService, type AdminProduct, type ProductInput } from '../../services/adminService';
import { useAppState } from '../../hooks/useAppState';
import { formatPKR } from '../utils';
import { PageHeader, Panel, AdminInput, Badge, EmptyState, AdminButton } from '../components/ui';
import { ProductEditor } from '../components/ProductEditor';

export function AdminProductsPage() {
  const { refresh } = useCatalog();
  const { notify } = useAppState();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState<AdminProduct | null | undefined>(undefined);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getProducts();
      setProducts(res.products ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = products.filter(
    (p) =>
      !q.trim() ||
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.slug.includes(q.toLowerCase())
  );

  const handleSave = async (input: ProductInput & { slug?: string }) => {
    setBusy(true);
    try {
      if (editor === null) {
        const slug = input.slug || adminService.makeSlug(input.name);
        await adminService.createProduct({ ...input, slug });
        notify('Product created');
      } else if (editor) {
        await adminService.updateProduct(editor.slug, input);
        notify('Product updated');
      }
      setEditor(undefined);
      await Promise.all([adminService.getProducts({ force: true }).then((r) => setProducts(r.products ?? [])), refresh()]);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  const deactivate = async (product: AdminProduct) => {
    if (!confirm(`Deactivate ${product.name}?`)) return;
    setBusy(true);
    try {
      await adminService.deleteProduct(product.slug);
      notify('Product deactivated');
      await Promise.all([adminService.getProducts({ force: true }).then((r) => setProducts(r.products ?? [])), refresh()]);
    } catch {
      notify('Could not deactivate', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-[1400px] space-y-6">
      <PageHeader
        title="Products"
        subtitle={`${products.length} SKUs · edit prices, stock, and visibility`}
        actions={
          <AdminButton onClick={() => setEditor(null)} disabled={busy}>
            Add product
          </AdminButton>
        }
      />
      <AdminInput
        placeholder="Search products..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-sm"
      />
      <Panel flush>
        {loading ? (
          <p className="p-6 text-sm text-[var(--admin-muted)]">Loading products...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-[var(--admin-border)] text-xs uppercase tracking-wider text-[var(--admin-muted)]">
                <tr>
                  <th className="p-4">Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.slug} className="border-b border-[var(--admin-border)]">
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
                      <Badge tone={p.isActive === false ? 'neutral' : p.stock > 0 ? 'success' : 'danger'}>
                        {p.isActive === false ? 'Hidden' : p.stock > 0 ? 'Active' : 'Out'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <AdminButton variant="ghost" onClick={() => setEditor(p)} disabled={busy}>
                          Edit
                        </AdminButton>
                        <AdminButton variant="ghost" onClick={() => void deactivate(p)} disabled={busy}>
                          Hide
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <EmptyState title="No products found" />}
          </div>
        )}
      </Panel>
      <p className="text-sm text-[var(--admin-muted)]">
        Changes sync to the storefront after save.{' '}
        <Link to="/shop" className="text-amber-700 hover:underline">
          View shop
        </Link>
      </p>
      {editor !== undefined && (
        <ProductEditor
          product={editor}
          onClose={() => setEditor(undefined)}
          onSave={handleSave}
          busy={busy}
        />
      )}
    </div>
  );
}
