import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { catalogProducts } from '../../lib/mockData';
import { useAppState } from '../../hooks/useAppState';
import { formatPrice } from '../../lib/formatPrice';

export function RecentlyViewed() {
  const { recentlyViewed } = useAppState();
  const products = recentlyViewed
    .map((id) => catalogProducts.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 5);

  if (!products.length) return null;

  return (
    <section className="border-t border-charcoal/8 py-12 dark:border-white/8">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="mb-6 text-[0.62rem] uppercase tracking-luxe text-charcoal/45 dark:text-ivory/45">
          Recently viewed
        </p>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {products.map((product, i) => (
            <motion.div
              key={product!.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}>
              <Link
                to={`/products/${product!.slug}`}
                className="group flex w-36 shrink-0 flex-col items-center">
                <div
                  className={`flex h-32 w-full items-center justify-center rounded-2xl ${product!.accent} p-3 transition-shadow group-hover:shadow-luxe`}>
                  <img
                    src={product!.image}
                    alt=""
                    className="h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 line-clamp-2 text-center text-xs leading-snug">
                  {product!.name}
                </p>
                <p className="mt-1 text-xs text-gold">{formatPrice(product!.price)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
