import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDownIcon, SparklesIcon } from 'lucide-react';
import { RevealWords } from '../../components/Reveal';
import { Magnetic } from '../../components/Magnetic';
import { Particles } from '../../components/Particles';
import { FloatingBlobs } from '../../components/premium/FloatingBlobs';
import { MouseGlow } from '../../components/premium/MouseGlow';
import { formatPrice } from '../../lib/formatPrice';
import { appConfig } from '../../lib/config';
import { catalogProducts } from '../../lib/mockData';

export function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const heroProduct = catalogProducts.find((p) => p.id === 'fit-me-matte-tube-foundation-18ml') ?? catalogProducts[0];
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 100, damping: 18 });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 100, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-ivory dark:bg-graphite">
      <FloatingBlobs />
      <MouseGlow />
      <Particles count={32} />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,169,106,0.12),transparent_60%)]" />

      <motion.div style={{ opacity, scale, y }} className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-28 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-[0.58rem] uppercase tracking-luxe text-charcoal dark:text-ivory">
              <SparklesIcon className="h-3.5 w-3.5 text-gold" />
              {appConfig.brandTagline}
            </motion.div>

            <h1 className="font-serif text-[11vw] font-light leading-[0.92] tracking-tight text-charcoal sm:text-6xl lg:text-[5.5rem] dark:text-ivory">
              <RevealWords text="Beauty," />
              <br />
              <span className="italic text-gradient-gold">
                <RevealWords text="elevated." delay={0.15} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 max-w-md text-lg font-light leading-relaxed text-charcoal/60 dark:text-ivory/60">
              Premium skincare and cosmetics — curated, authenticated, and priced
              to outperform the market.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-10 flex flex-wrap gap-4">
              <Magnetic>
                <button
                  onClick={() => navigate('/shop')}
                  className="group relative overflow-hidden rounded-full bg-charcoal px-10 py-4 text-[0.65rem] uppercase tracking-luxe text-ivory transition-colors hover:bg-gold hover:text-charcoal dark:bg-ivory dark:text-charcoal">
                  <span className="relative z-10">Explore Collection</span>
                  <motion.span
                    className="absolute inset-0 bg-gold"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full border border-charcoal/20 px-10 py-4 text-[0.65rem] uppercase tracking-luxe transition-colors hover:border-gold hover:text-gold dark:border-white/20">
                  View Showcase
                </button>
              </Magnetic>
            </motion.div>
          </div>

          <div className="relative flex items-center justify-center" style={{ perspective: 1400 }}>
            <motion.div
              style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative">
              <div className="absolute inset-0 scale-90 rounded-full bg-gradient-to-b from-gold/25 via-blush/20 to-transparent blur-3xl" />
              <img
                src={appConfig.heroImage}
                alt={heroProduct.name}
                width={1208}
                height={1852}
                decoding="async"
                fetchPriority="high"
                className="relative z-10 w-[68vw] max-w-[400px] object-contain drop-shadow-[0_40px_80px_rgba(43,43,43,0.22)] [image-rendering:high-quality]"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full glass px-6 py-3 text-center shadow-luxe">
                <p className="font-serif text-lg">{heroProduct.name}</p>
                <p className="text-sm text-gold">{formatPrice(heroProduct.price)}</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div style={{ opacity }} className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-charcoal/40">
        <span className="text-[0.58rem] uppercase tracking-luxe">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ArrowDownIcon className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
