import React, { useEffect, useState } from 'react';
import type { AdminProduct, ProductInput } from '../../services/adminService';
import { AdminButton, AdminInput, AdminSelect, Panel } from './ui';

const CATEGORIES = ['serum', 'moisturizer', 'oil', 'cleanser', 'treatment'];

type Props = {
  product?: AdminProduct | null;
  onClose: () => void;
  onSave: (input: ProductInput & { slug?: string }) => Promise<void>;
  busy: boolean;
};

export function ProductEditor({ product, onClose, onSave, busy }: Props) {
  const isNew = !product;
  const [form, setForm] = useState<ProductInput & { slug: string }>({
    slug: product?.slug ?? '',
    name: product?.name ?? '',
    tagline: product?.tagline ?? '',
    description: product?.description ?? '',
    category: product?.category ?? 'serum',
    brand: product?.brand ?? '',
    price: product?.price ?? 0,
    compareAtPrice: product?.compareAtPrice,
    stock: product?.stock ?? 0,
    image: product?.image ?? '/catalog/fit-me-matte-tube-foundation-18ml.png',
    accent: product?.accent ?? 'bg-beige',
    featured: product?.featured ?? false,
    isActive: product?.isActive ?? true,
    rating: product?.rating ?? 4.5,
    reviewCount: product?.reviewCount ?? 0,
  });

  useEffect(() => {
    if (!product) return;
    setForm({
      slug: product.slug,
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      category: product.category,
      brand: product.brand ?? '',
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      stock: product.stock,
      image: product.image,
      accent: product.accent,
      featured: product.featured ?? false,
      isActive: product.isActive ?? true,
      rating: product.rating,
      reviewCount: product.reviewCount,
    });
  }, [product]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
      <Panel
        title={isNew ? 'Add product' : `Edit · ${product?.name}`}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto admin-scroll"
        action={
          <button type="button" onClick={onClose} className="text-sm text-[var(--admin-muted)]">
            Close
          </button>
        }
      >
        <form onSubmit={submit} className="space-y-4">
          {isNew && (
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Slug</label>
              <AdminInput
                required
                className="mt-1"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="product-slug"
              />
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Name</label>
              <AdminInput
                required
                className="mt-1"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Category</label>
              <AdminSelect
                className="mt-1 w-full"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </AdminSelect>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Brand</label>
              <AdminInput
                className="mt-1"
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Price (PKR)</label>
              <AdminInput
                type="number"
                required
                min={1}
                className="mt-1"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Compare at (PKR)</label>
              <AdminInput
                type="number"
                min={0}
                className="mt-1"
                value={form.compareAtPrice ?? ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    compareAtPrice: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Stock</label>
              <AdminInput
                type="number"
                min={0}
                required
                className="mt-1"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Image path</label>
              <AdminInput
                required
                className="mt-1"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-wider text-[var(--admin-muted)]">Description</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-elevated)] px-3 py-2 text-sm text-[var(--admin-fg)]"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Active on store
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <AdminButton type="button" variant="secondary" onClick={onClose}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" disabled={busy}>
              {busy ? 'Saving...' : isNew ? 'Create product' : 'Save changes'}
            </AdminButton>
          </div>
        </form>
      </Panel>
    </div>
  );
}
