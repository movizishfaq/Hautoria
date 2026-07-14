import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { BlurReveal } from '../../components/premium/BlurReveal';

const categories = [
  { name: 'Serums', desc: 'Targeted actives for visible results', to: '/shop?category=serum', accent: 'bg-blush' },
  { name: 'Moisturizers', desc: 'Barrier repair & deep hydration', to: '/shop?category=moisturizer', accent: 'bg-beige' },
  { name: 'Cleansers', desc: 'Gentle formulas, powerful clean', to: '/shop?category=cleanser', accent: 'bg-sage' },
  { name: 'Treatments', desc: 'SPF, primers & complexion', to: '/shop?category=treatment', accent: 'bg-platinum' },
];

export function CategoryRails() {
  return (
    <section id="collections" className="py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <BlurReveal className="mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[0.62rem] uppercase tracking-luxe text-gold">Shop by category</p>
            <h2 className="mt-3 font-serif text-4xl font-light sm:text-5xl">
              Find your <em>ritual.</em>
            </h2>
          </div>
          <Link to="/shop" className="text-[0.62rem] uppercase tracking-luxe text-charcoal/50 hover:text-gold">
            All categories →
          </Link>
        </BlurReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}>
              <Link
                to={cat.to}
                className={`group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[1.75rem] ${cat.accent} p-8 transition-shadow hover:shadow-luxe`}>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <h3 className="relative font-serif text-2xl">{cat.name}</h3>
                <p className="relative mt-2 text-sm text-charcoal/55">{cat.desc}</p>
                <ArrowRightIcon className="relative mt-4 h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
