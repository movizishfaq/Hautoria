import type { Product } from '../types/domain';
import { mockRequest } from './api';
import { catalogProducts } from '../lib/mockData';

export const catalogService = {
  list: async (): Promise<Product[]> => mockRequest(catalogProducts),
  bySlug: async (slug: string): Promise<Product | undefined> =>
  mockRequest(catalogProducts.find((product) => product.slug === slug)),
  suggestions: async (query: string): Promise<Product[]> =>
  mockRequest(
    catalogProducts.
    filter(
      (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.concerns.some((concern) =>
      concern.includes(query.toLowerCase())
      )
    ).
    slice(0, 4),
    180
  )
};
// TODO: Connect catalog search/filter/indexing endpoint and product recommendation service.