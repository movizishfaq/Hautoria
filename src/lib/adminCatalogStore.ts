import type { Product } from '../types/domain';
import { catalogProducts } from './mockData';

const STORAGE_KEY = 'hautoria_admin_catalog';

function baseCatalog(): Product[] {
  return catalogProducts.map((p) => ({ ...p }));
}

function readStore(): Product[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Product[];
    // Empty / corrupt admin overrides must never wipe the storefront catalog.
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function loadAdminCatalog(): Product[] {
  return readStore() ?? baseCatalog();
}

export function saveAdminCatalog(products: Product[]) {
  if (!products.length) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
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
  const list = loadAdminCatalog().filter((p) => p.slug !== slug && p.id !== slug);
  saveAdminCatalog(list);
  return list;
}

export function updateAdminStock(slug: string, stock: number) {
  const list = loadAdminCatalog();
  const product = list.find((p) => p.slug === slug || p.id === slug);
  if (!product) return null;
  product.stock = stock;
  if (product.variants[0]) product.variants[0].stock = stock;
  saveAdminCatalog(list);
  return product;
}

/** Reset any bad local overrides back to the built-in catalog. */
export function resetAdminCatalog() {
  localStorage.removeItem(STORAGE_KEY);
  return baseCatalog();
}
