import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Product } from '../types/domain';
import { catalogService } from '../services/catalogService';
import { isApiEnabled } from '../services/api';
import { loadAdminCatalog, resetAdminCatalog } from '../lib/adminCatalogStore';
import { catalogProducts } from '../lib/mockData';

type CatalogState = {
  products: Product[];
  loading: boolean;
  ready: boolean;
  getById: (id: string) => Product | undefined;
  getBySlug: (slug: string) => Product | undefined;
  refresh: () => Promise<void>;
};

const Context = createContext<CatalogState | undefined>(undefined);

function fallbackCatalog(): Product[] {
  const local = loadAdminCatalog();
  return local.length ? local : catalogProducts.map((p) => ({ ...p }));
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => fallbackCatalog());
  // Never block the storefront on API — start ready with local/fallback catalog.
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(true);

  const refresh = useCallback(async () => {
    if (!isApiEnabled()) {
      setProducts(fallbackCatalog());
      setReady(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await catalogService.list({ limit: '100' });
      if (list.length > 0) {
        setProducts(list);
      } else {
        setProducts(fallbackCatalog());
      }
    } catch {
      setProducts(fallbackCatalog());
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    // One-time repair: wipe empty/corrupt local catalog overrides.
    try {
      const raw = localStorage.getItem('hautoria_admin_catalog');
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed) || parsed.length === 0) {
          resetAdminCatalog();
          setProducts(fallbackCatalog());
        }
      }
    } catch {
      resetAdminCatalog();
    }
    void refresh();
  }, [refresh]);

  const value = useMemo<CatalogState>(
    () => ({
      products,
      loading,
      ready,
      getById: (id) => products.find((p) => p.id === id || p.slug === id),
      getBySlug: (slug) => products.find((p) => p.slug === slug),
      refresh,
    }),
    [products, loading, ready, refresh]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCatalog() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider');
  return ctx;
}
