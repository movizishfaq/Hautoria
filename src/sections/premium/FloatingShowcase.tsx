import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlurReveal } from '../../components/premium/BlurReveal';
import { LuxuryProductCard } from '../../features/catalog/LuxuryProductCard';
import { catalogProducts } from '../../lib/mockData';

const SHOWCASE_COUNT = 10;

export function FloatingShowcase() {
  const display = useMemo(() => {
    const featured = catalogProducts.filter((p) => p.featured);
    const rest = catalogProducts.filter((p) => !p.featured);
    const merged = [...featured, ...rest];
    return merged.slice(0, SHOWCASE_COUNT);
  }, []);

  return (
    <section id="showcase" className="relative overflow-hidden bg-fog py-20 dark:bg-graphite lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(248,221,230,0.4),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <BlurReveal className="mb-10 max-w-2xl">
          <p className="text-[0.62rem] uppercase tracking-luxe text-gold">Curated Selection</p>
          <h2 className="mt-3 font-serif text-3xl font-light leading-tight sm:text-4xl lg:text-5xl">
            The pieces worth <em className="text-gradient-gold">owning.</em>
          </h2>
          <p className="mt-4 text-sm font-light text-charcoal/55 dark:text-ivory/55 sm:text-base">
            Handpicked bestsellers with competitive pricing — authentic products,
            unmistakably premium.
          </p>
        </BlurReveal>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
          {display.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{
                duration: 0.5,
                delay: Math.min(i * 0.04, 0.4),
                ease: [0.22, 1, 0.36, 1],
              }}>
              <LuxuryProductCard product={product} compact />
            </motion.div>
          ))}
        </div>

        <BlurReveal delay={0.2} className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-6 py-3 text-[0.58rem] uppercase tracking-luxe transition-all hover:border-gold hover:bg-gold/5 hover:text-gold dark:border-white/15">
            View all {catalogProducts.length} products →
          </Link>
        </BlurReveal>
      </div>
    </section>
  );
}
