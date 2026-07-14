import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, MinusIcon, GiftIcon } from 'lucide-react';
import { BlurReveal } from '../../components/premium/BlurReveal';
import { LuxuryProductCard } from '../../features/catalog/LuxuryProductCard';
import { catalogProducts } from '../../lib/mockData';
import { useAppState } from '../../hooks/useAppState';
import { formatPrice } from '../../lib/formatPrice';

const bundleProducts = catalogProducts.slice(0, 3);
const BUNDLE_DISCOUNT = 0.12;

export function BundleOffers() {
  const [selected, setSelected] = useState<string[]>(
    bundleProducts[0] ? [bundleProducts[0].id] : []
  );
  const { addToCart, notify } = useAppState();

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const items = bundleProducts.filter((p) => selected.includes(p.id));
  const subtotal = items.reduce((s, p) => s + p.price, 0);
  const total = Math.round(subtotal * (1 - BUNDLE_DISCOUNT));
  const savings = subtotal - total;

  const addBundle = () => {
    items.forEach((p) => addToCart(p));
    notify(`Bundle saved ${formatPrice(savings)}!`);
  };

  return (
    <section className="bg-beige py-28 dark:bg-[#1c1c1c] lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <BlurReveal className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-2 text-[0.58rem] uppercase tracking-luxe text-gold">
            <GiftIcon className="h-3.5 w-3.5" />
            Bundle & Save 12%
          </div>
          <h2 className="font-serif text-4xl font-light sm:text-5xl">
            Build your <em>ritual.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-charcoal/55 dark:text-ivory/55">
            Select products for your custom bundle and unlock exclusive savings.
          </p>
        </BlurReveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {bundleProducts.map((product) => {
              const active = selected.includes(product.id);
              return (
                <div
                  key={product.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggle(product.id)}
                  onKeyDown={(e) => e.key === 'Enter' && toggle(product.id)}
                  className={`relative cursor-pointer rounded-[1.75rem] transition-all ${
                    active ? 'ring-2 ring-gold' : 'opacity-70 hover:opacity-100'
                  }`}>
                  <LuxuryProductCard product={product} />
                  {active && (
                    <span className="absolute right-6 top-6 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-charcoal">
                      ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <motion.aside
            layout
            className="h-fit rounded-[2rem] glass p-8 shadow-luxe dark:glass-dark">
            <h3 className="font-serif text-2xl">Your bundle</h3>
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.p
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-sm text-charcoal/70 dark:text-ivory/70">
                  {item.name}
                </motion.p>
              ))}
            </AnimatePresence>
            <div className="mt-6 space-y-2 border-t border-charcoal/10 pt-6 dark:border-white/10">
              <p className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </p>
              <p className="flex justify-between text-sm text-gold">
                <span>Bundle savings</span>
                <span>−{formatPrice(savings)}</span>
              </p>
              <p className="flex justify-between font-serif text-2xl pt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </p>
            </div>
            <button
              onClick={addBundle}
              disabled={!items.length}
              className="mt-6 w-full rounded-full bg-charcoal py-4 text-[0.62rem] uppercase tracking-luxe text-ivory transition-colors hover:bg-gold hover:text-charcoal disabled:opacity-40 dark:bg-ivory dark:text-charcoal">
              Add bundle to cart
            </button>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
