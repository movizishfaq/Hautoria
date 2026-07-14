import React from 'react';
import { motion } from 'framer-motion';
import { QuoteIcon, StarIcon } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { REVIEWS } from '../lib/data';
/**
 * Auto-moving floating glassmorphism review cards.
 */
export function Testimonials() {
  const loop = [...REVIEWS, ...REVIEWS];
  return (
    <section className="relative w-full overflow-hidden bg-ivory py-28 lg:py-40">
      <div className="mx-auto mb-16 max-w-7xl px-6 text-center lg:px-10">
        <Reveal>
          <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-luxe text-gold">
            The Devotees
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif text-4xl font-light leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            Adored, <span className="italic">worldwide</span>
          </h2>
        </Reveal>
      </div>

      <div className="group relative flex overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-ivory to-transparent lg:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ivory to-transparent lg:w-40" />

        <motion.div
          className="flex shrink-0 gap-6 px-3"
          animate={{
            x: ['0%', '-50%']
          }}
          transition={{
            duration: 44,
            repeat: Infinity,
            ease: 'linear'
          }}>
          
          {loop.map((r, i) =>
          <motion.div
            key={`${r.name}-${i}`}
            whileHover={{
              y: -10
            }}
            className="glass flex w-[320px] shrink-0 flex-col rounded-[1.75rem] p-8 transition-shadow duration-500 hover:shadow-[0_25px_60px_rgba(200,169,106,0.18)]">
            
              <QuoteIcon className="h-8 w-8 text-gold/40" strokeWidth={1} />
              <p className="mt-4 flex-1 font-serif text-lg font-light italic leading-relaxed text-charcoal/80">
                “{r.text}”
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-charcoal/10 pt-5">
                <div>
                  <p className="text-sm font-medium text-charcoal">{r.name}</p>
                  <p className="text-[0.62rem] uppercase tracking-luxe text-charcoal/45">
                    {r.location}
                  </p>
                </div>
                <div className="flex gap-0.5 text-gold">
                  {Array.from({
                  length: 5
                }).map((_, s) =>
                <StarIcon
                  key={s}
                  className={`h-3.5 w-3.5 ${s < Math.round(r.rating) ? 'fill-current' : 'opacity-20'}`}
                  strokeWidth={0} />

                )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>);

}