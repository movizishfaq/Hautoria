import React, { useMemo, useState } from 'react';
import { SearchIcon, SlidersHorizontalIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { LuxuryProductCard } from '../features/catalog/LuxuryProductCard';
import { EmptyState } from '../components/ui/EmptyState';
import { appConfig } from '../lib/config';
export function ShopPage() {
  const { products: catalogProducts, loading } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get('q') ?? '';
  const category = params.get('category') ?? 'all';
  const concern = params.get('concern') ?? 'all';
  const sort = params.get('sort') ?? 'featured';
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    value === 'all' || !value ? next.delete(key) : next.set(key, value);
    setParams(next);
  };
  const products = useMemo(
    () =>
    [...catalogProducts].
    filter(
      (product) =>
      (!query ||
      `${product.name} ${product.tagline} ${product.concerns.join(' ')}`.
      toLowerCase().
      includes(query.toLowerCase())) && (
      category === 'all' || product.category === category) && (
      concern === 'all' ||
      product.concerns.includes(
        concern as (typeof product.concerns)[number]
      ))
    ).
    sort((a, b) =>
    sort === 'price-low' ?
    a.price - b.price :
    sort === 'price-high' ?
    b.price - a.price :
    sort === 'rating' ?
    b.rating - a.rating :
    Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    ),
    [query, category, concern, sort]
  );
  const suggestion = query ?
  catalogProducts.find((product) =>
  product.concerns.some((entry) => query.toLowerCase().includes(entry))
  ) :
  undefined;
  return (
    <div className="min-h-screen bg-ivory pt-20 dark:bg-graphite">
      <section className="border-b border-charcoal/10 px-6 pb-12 pt-8 dark:border-white/10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[.64rem] uppercase tracking-luxe text-gold">
            {appConfig.brandTagline}
          </p>
          <h1 className="mt-3 font-serif text-5xl font-light sm:text-6xl">
            Curated for the <em className="text-gradient-gold">exceptional.</em>
          </h1>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-charcoal/15 bg-white/55 px-4 py-3 dark:border-white/15 dark:bg-white/5">
              <SearchIcon className="h-4 w-4 text-charcoal/45 dark:text-ivory/45" />
              <input
                value={query}
                onChange={(event) => update('q', event.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="Search products, concerns, ingredients" />
              
            </div>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-charcoal/15 px-5 text-[.66rem] uppercase tracking-luxe dark:border-white/15">
              
              <SlidersHorizontalIcon className="h-4 w-4" /> Filters
            </button>
          </div>
          {suggestion &&
          <p className="mt-3 text-sm text-charcoal/60 dark:text-ivory/60">
              <span className="font-medium text-gold">
                Local routine suggestion:
              </span>{' '}
              for {query}, begin with {suggestion.name}. This is an AI-inspired
              demo based on your search, not clinical advice.
            </p>
          }
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div
          className={`${filtersOpen ? 'grid' : 'hidden'} mb-8 grid-cols-1 gap-4 rounded-2xl bg-beige p-5 sm:grid-cols-4 dark:bg-white/5`}>
          
          <label className="text-xs uppercase tracking-luxe">
            Category
            <select
              value={category}
              onChange={(event) => update('category', event.target.value)}
              className="mt-2 w-full rounded-lg border border-charcoal/15 bg-ivory p-3 text-sm normal-case tracking-normal dark:border-white/15 dark:bg-[#202020]">
              
              <option value="all">All categories</option>
              {['serum', 'moisturizer', 'oil', 'treatment', 'cleanser'].map(
                (item) =>
                <option key={item}>{item}</option>

              )}
            </select>
          </label>
          <label className="text-xs uppercase tracking-luxe">
            Concern
            <select
              value={concern}
              onChange={(event) => update('concern', event.target.value)}
              className="mt-2 w-full rounded-lg border border-charcoal/15 bg-ivory p-3 text-sm normal-case tracking-normal dark:border-white/15 dark:bg-[#202020]">
              
              <option value="all">All concerns</option>
              {['hydration', 'aging', 'sensitivity', 'clarity', 'radiance'].map(
                (item) =>
                <option key={item}>{item}</option>

              )}
            </select>
          </label>
          <label className="text-xs uppercase tracking-luxe">
            Availability
            <select className="mt-2 w-full rounded-lg border border-charcoal/15 bg-ivory p-3 text-sm normal-case tracking-normal dark:border-white/15 dark:bg-[#202020]">
              <option>In stock</option>
              <option>All products</option>
            </select>
          </label>
          <label className="text-xs uppercase tracking-luxe">
            Sort
            <select
              value={sort}
              onChange={(event) => update('sort', event.target.value)}
              className="mt-2 w-full rounded-lg border border-charcoal/15 bg-ivory p-3 text-sm normal-case tracking-normal dark:border-white/15 dark:bg-[#202020]">
              
              <option value="featured">Featured</option>
              <option value="rating">Top rated</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>
        <p className="mb-7 text-sm text-charcoal/55 dark:text-ivory/55">
          {products.length} considered formulas
        </p>
        {products.length ?
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) =>
          <LuxuryProductCard key={product.id} product={product} />
          )}
          </div> :

        <EmptyState
          title="No ritual found"
          body="Try a concern such as hydration, clarity, or sensitivity."
          actionLabel="Clear filters"
          actionTo="/shop" />

        }
      </main>
    </div>);

}