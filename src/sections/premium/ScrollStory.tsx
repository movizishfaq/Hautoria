import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BlurReveal } from '../../components/premium/BlurReveal';
import { catalogProducts } from '../../lib/mockData';
import { formatPrice } from '../../lib/formatPrice';

export function ScrollStory() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const textX = useTransform(scrollYProgress, [0, 0.5], ['-5%', '0%']);

  const spotlight = catalogProducts.find((p) => p.name.includes('CeraVe')) ?? catalogProducts[10];

  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory py-20 sm:py-28 lg:py-32 dark:bg-[#141414]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:gap-16 sm:px-6 lg:grid-cols-2 lg:px-10">
        <motion.div style={{ x: textX }}>
          <BlurReveal>
            <p className="text-[0.62rem] uppercase tracking-luxe text-gold">The Hautoria Standard</p>
            <h2 className="mt-5 font-serif text-3xl font-light leading-tight sm:text-5xl lg:text-6xl">
              Authenticity is
              <br />
              <em className="text-gradient-gold">non-negotiable.</em>
            </h2>
            <p className="mt-6 max-w-md text-base font-light leading-relaxed text-charcoal/60 dark:text-ivory/60">
              Every product is sourced from verified suppliers. We price below
              market average so you get luxury without the markup — never
              compromising on what goes on your skin.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="mt-8 text-[0.62rem] uppercase tracking-luxe text-gold underline-offset-4 hover:underline">
              Shop with confidence →
            </button>
          </BlurReveal>
        </motion.div>

        <motion.div style={{ y: imageY }} className="relative">
          <div className={`aspect-square overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] ${spotlight.accent} p-6 shadow-luxe-lg sm:p-12`}>
            <img
              src={spotlight.image}
              alt={spotlight.name}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl glass px-4 py-3 shadow-luxe sm:-bottom-6 sm:-left-6 sm:right-auto sm:px-6 sm:py-4">
            <p className="truncate font-serif text-base sm:text-lg">{spotlight.name}</p>
            <p className="text-gold">{formatPrice(spotlight.price)}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
