import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, TruckIcon, AwardIcon, LockIcon } from 'lucide-react';

const badges = [
  { icon: ShieldCheckIcon, label: '100% Authentic' },
  { icon: TruckIcon, label: 'Free Shipping 5K+' },
  { icon: AwardIcon, label: 'Premium Curated' },
  { icon: LockIcon, label: 'Secure Checkout' },
];

export function TrustMarquee() {
  const loop = [...badges, ...badges, ...badges];

  return (
    <section className="overflow-hidden border-y border-charcoal/8 py-6 dark:border-white/8">
      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex w-max gap-16">
        {loop.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <div
              key={`${badge.label}-${i}`}
              className="flex shrink-0 items-center gap-3 text-charcoal/50 dark:text-ivory/50">
              <Icon className="h-4 w-4 text-gold" strokeWidth={1.5} />
              <span className="text-[0.62rem] uppercase tracking-luxe whitespace-nowrap">
                {badge.label}
              </span>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
