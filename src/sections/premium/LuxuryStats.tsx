import React from 'react';
import { motion } from 'framer-motion';
import { BlurReveal } from '../../components/premium/BlurReveal';
import { AnimatedCounter } from '../../components/premium/AnimatedCounter';

const stats = [
  { value: 47, suffix: '+', label: 'Premium products' },
  { value: 12000, suffix: '+', label: 'Happy customers' },
  { value: 100, suffix: '%', label: 'Authentic guarantee' },
  { value: 5, suffix: '★', label: 'Average rating' },
];

export function LuxuryStats() {
  return (
    <section className="border-y border-charcoal/8 bg-charcoal py-20 text-ivory dark:border-white/8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 lg:grid-cols-4 lg:px-10">
        {stats.map((stat, i) => (
          <BlurReveal key={stat.label} delay={i * 0.1} className="text-center">
            <p className="font-serif text-4xl font-light text-gold sm:text-5xl">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                duration={1800}
              />
            </p>
            <p className="mt-3 text-[0.62rem] uppercase tracking-luxe text-ivory/50">
              {stat.label}
            </p>
          </BlurReveal>
        ))}
      </div>
    </section>
  );
}
