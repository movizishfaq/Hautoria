import type { Product } from '../types/domain';
import { catalogProducts } from './mockData';

const STORAGE_KEY = 'hautoria_admin_catalog';

function readStore(): Product[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Product[];
  } catch {
    return null;
  }
}

export function loadAdminCatalog(): Product[] {
  return readStore() ?? catalogProducts.map((p) => ({ ...p }));
}

export function saveAdminCatalog(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function upsertAdminProduct(product: Product) {
  const list = loadAdminCatalog();
  const idx = list.findIndex((p) => p.slug === product.slug || p.id === product.id);
  if (idx >= 0) list[idx] = product;
  else list.unshift(product);
  saveAdminCatalog(list);
  return list;
}

export function removeAdminProduct(slug: string) {
  const list = loadAdminCatalog().map((p) =>
    p.slug === slug ? { ...p, stock: 0 } : p
  );
  saveAdminCatalog(list.filter((p) => p.slug !== slug));
  return list;
}

export function updateAdminStock(slug: string, stock: number) {
  const list = loadAdminCatalog().map((p) => {
    if (p.slug !== slug) return p;
    return {
      ...p,
      stock,
      variants: p.variants.map((v, i) => (i === 0 ? { ...v, stock } : v)),
    };
  });
  saveAdminCatalog(list);
  return list.find((p) => p.slug === slug) ?? null;
}
