import type { Product } from '../types/domain';
import { apiRequest, isApiEnabled, mockRequest } from './api';
import { catalogProducts } from '../lib/mockData';

export const catalogService = {
  list: async (params?: Record<string, string>): Promise<Product[]> => {
    if (!isApiEnabled()) return mockRequest(catalogProducts);
    const qs = params ? `?${new URLSearchParams(params)}` : '';
    const res = await apiRequest<{ products: Product[] }>(`/products${qs}`);
    return res.products;
  },

  bySlug: async (slug: string): Promise<Product | undefined> => {
    if (!isApiEnabled()) {
      return mockRequest(catalogProducts.find((p) => p.slug === slug));
    }
    try {
      const res = await apiRequest<{ product: Product }>(`/products/${slug}`);
      return res.product;
    } catch {
      return undefined;
    }
  },

  suggestions: async (query: string): Promise<Product[]> => {
    if (!isApiEnabled()) {
      return mockRequest(
        catalogProducts
          .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 6)
      );
    }
    const res = await apiRequest<{ products: Product[] }>(
      `/products/suggestions?q=${encodeURIComponent(query)}`
    );
    return res.products;
  },
};
