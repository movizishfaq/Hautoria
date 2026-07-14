import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRightIcon } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { COLLECTIONS } from '../lib/data';
const LUXE = [0.22, 1, 0.36, 1] as const;
export function Collections() {
  return (
    <section
      id="collections"
      className="relative w-full bg-ivory py-28 lg:py-40">
      
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 flex flex-col items-baseline justify-between gap-4 sm:flex-row">
          <Reveal>
            <h2 className="font-serif text-4xl font-light leading-tight text-charcoal sm:text-5xl lg:text-6xl">
              Curated <span className="italic">collections</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-sm font-light text-charcoal/50">
              A ritual for every skin, every moment, every mood.
            </p>
          </Reveal>
        </div>

        <div className="border-t border-charcoal/10">
          {COLLECTIONS.map((c, i) =>
          <motion.a
            key={c}
            href="#"
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true,
              margin: '-40px'
            }}
            transition={{
              duration: 0.7,
              ease: LUXE,
              delay: i * 0.05
            }}
            className="group relative flex items-center justify-between overflow-hidden border-b border-charcoal/10 py-7">
            
              {/* Sliding fill */}
              <span className="absolute inset-0 origin-left scale-x-0 bg-charcoal transition-transform duration-600 ease-luxe group-hover:scale-x-100" />
              <span className="relative z-10 flex items-baseline gap-5">
                <span className="font-serif text-xs text-charcoal/30 transition-colors duration-500 group-hover:text-gold">
                  0{i + 1}
                </span>
                <span className="font-serif text-2xl font-light text-charcoal transition-colors duration-500 group-hover:text-ivory sm:text-4xl">
                  {c}
                </span>
              </span>
              <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/15 text-charcoal transition-all duration-500 group-hover:border-gold group-hover:text-gold">
                <ArrowUpRightIcon
                className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5} />
              
              </span>
            </motion.a>
          )}
        </div>
      </div>
    </section>);

}