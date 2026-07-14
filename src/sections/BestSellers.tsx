import React from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '../components/Reveal';
import { SHOWCASE, formatPrice } from '../lib/data';
/**
 * Infinite horizontal marquee of best-sellers. Pauses on hover.
 */
export function BestSellers() {
  const loop = [...SHOWCASE, ...SHOWCASE];
  return (
    <section className="relative w-full overflow-hidden bg-beige py-24 lg:py-32">
      <div className="mx-auto mb-14 max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col items-baseline justify-between gap-2 sm:flex-row">
            <h2 className="font-serif text-4xl font-light text-charcoal sm:text-5xl">
              Best Sellers
            </h2>
            <p className="text-[0.68rem] uppercase tracking-luxe text-charcoal/50">
              Loved by 40,000+ members
            </p>
          </div>
        </Reveal>
      </div>

      <div className="group relative flex overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-beige to-transparent lg:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-beige to-transparent lg:w-40" />

        <motion.div
          className="flex shrink-0 gap-8 pr-8 [animation-play-state:running] group-hover:[animation-play-state:paused]"
          animate={{
            x: ['0%', '-50%']
          }}
          transition={{
            duration: 38,
            repeat: Infinity,
            ease: 'linear'
          }}>
          
          {loop.map((p, i) =>
          <div
            key={`${p.id}-${i}`}
            className="group/card relative flex w-[260px] shrink-0 flex-col items-center rounded-[1.75rem] bg-ivory p-8 transition-shadow duration-500 hover:shadow-[0_25px_60px_rgba(200,169,106,0.2)]">
            
              <div className="flex h-56 items-center justify-center overflow-hidden">
                <img
                src={p.image}
                alt={`${p.name} — ${p.tagline}`}
                className="h-full w-auto object-contain transition-transform duration-700 ease-luxe group-hover/card:scale-110 group-hover/card:-rotate-2" />
              
              </div>
              <h3 className="mt-6 font-serif text-xl font-light text-charcoal">
                {p.name}
              </h3>
              <p className="mt-1 text-[0.62rem] uppercase tracking-luxe text-charcoal/45">
                {p.tagline}
              </p>
              <p className="mt-3 font-serif text-gold">{formatPrice(p.price)}</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>);

}