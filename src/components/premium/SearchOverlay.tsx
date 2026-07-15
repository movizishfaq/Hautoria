import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, XIcon, ArrowRightIcon } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { catalogProducts } from '../../lib/mockData';

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useAppState();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  const results = query.trim()
    ? catalogProducts
        .filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : catalogProducts.filter((p) => p.featured).slice(0, 4);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex flex-col bg-charcoal/95 backdrop-blur-xl">
          <div className="mx-auto w-full max-w-3xl px-6 pt-24">
            <div className="flex items-center gap-4 border-b border-white/15 pb-6">
              <SearchIcon className="h-6 w-6 text-ivory/50" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="flex-1 bg-transparent text-xl font-light text-ivory outline-none placeholder:text-ivory/30 sm:text-2xl"
              />
              <button
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full p-2 text-ivory/60 hover:text-ivory">
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8">
              <p className="mb-4 text-[0.62rem] uppercase tracking-luxe text-gold">
                {query ? 'Results' : 'Trending'}
              </p>
              <div className="space-y-2">
                {results.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <Link
                      to={`/products/${product.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5">
                      <div
                        className={`h-16 w-14 shrink-0 rounded-lg ${product.accent} p-2`}>
                        <img
                          src={product.image}
                          alt=""
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif text-lg text-ivory group-hover:text-gold">
                          {product.name}
                        </p>
                        <p className="text-sm text-ivory/45 capitalize">
                          {product.category}
                        </p>
                      </div>
                      <ArrowRightIcon className="h-4 w-4 text-ivory/30 group-hover:text-gold" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
