import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Product } from '../types/domain';
import { catalogProducts } from '../lib/mockData';
import { catalogService } from '../services/catalogService';
import { isApiEnabled } from '../services/api';

type CatalogState = {
  products: Product[];
  loading: boolean;
  ready: boolean;
  getById: (id: string) => Product | undefined;
  getBySlug: (slug: string) => Product | undefined;
  refresh: () => Promise<void>;
};

const Context = createContext<CatalogState | undefined>(undefined);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(
    isApiEnabled() ? [] : catalogProducts
  );
  const [loading, setLoading] = useState(isApiEnabled());
  const [ready, setReady] = useState(!isApiEnabled());

  const refresh = useCallback(async () => {
    if (!isApiEnabled()) {
      setProducts(catalogProducts);
      setReady(true);
      return;
    }
    setLoading(true);
    try {
      const list = await catalogService.list({ limit: '48' });
      setProducts(list.length ? list : catalogProducts);
    } catch {
      setProducts(catalogProducts);
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, []);

  useEffect(() => {
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
