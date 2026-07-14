import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowRightIcon,
  BadgePercentIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SparklesIcon,
  StarIcon,
  TruckIcon,
} from 'lucide-react';
import { Magnetic } from '../../components/Magnetic';
import { Particles } from '../../components/Particles';
import { FloatingBlobs } from '../../components/premium/FloatingBlobs';
import { MouseGlow } from '../../components/premium/MouseGlow';
import { RatingStars } from '../../components/ui/RatingStars';
import { discountPercent, formatPrice } from '../../lib/formatPrice';
import { appConfig } from '../../lib/config';
import { useCatalog } from '../../context/CatalogContext';
import { useAppState } from '../../hooks/useAppState';

const categories = [
  { label: 'Serums', href: '/shop?category=serum' },
  { label: 'Moisturizers', href: '/shop?category=moisturizer' },
  { label: 'Cleansers', href: '/shop?category=cleanser' },
  { label: 'Treatments', href: '/shop?category=treatment' },
];

export function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { products } = useCatalog();
  const { addToCart, notify } = useAppState();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const heroProduct =
    products.find((p) => p.id === 'fit-me-matte-tube-foundation-18ml') ?? products[0];
  const spotlight = products.filter((p) => p.featured).slice(0, 4);
  const orbitProducts = products.slice(1, 5);
  const discount = heroProduct ? discountPercent(heroProduct.price, heroProduct.compareAtPrice) : null;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 100, damping: 18 });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 100, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleAdd = () => {
    if (!heroProduct) return;
    addToCart(heroProduct);
    notify(`${heroProduct.name} added to your bag`);
  };

  if (!heroProduct) return null;

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative min-h-[100svh] overflow-hidden bg-ivory pt-24 dark:bg-graphite lg:pt-28">
      <FloatingBlobs />
      <MouseGlow />
      <Particles count={24} />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(200,169,106,0.14),transparent_50%),radial-gradient(ellipse_at_80%_60%,rgba(232,213,196,0.35),transparent_55%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(43,43,43,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(43,43,43,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <motion.div style={{ opacity, y }} className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 lg:px-8">
        {/* Promo strip */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-3 rounded-2xl border border-gold/25 bg-gradient-to-r from-gold/10 via-beige/60 to-sage/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 dark:border-gold/20 dark:from-gold/5 dark:via-white/5 dark:to-white/5">
          <div className="flex items-center gap-3 sm:min-w-0 sm:flex-1">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15">
              <BadgePercentIcon className="h-4 w-4 text-gold" />
            </span>
            <p className="min-w-0 text-left text-[0.65rem] uppercase leading-snug tracking-wide text-charcoal sm:text-[0.62rem] sm:tracking-luxe dark:text-ivory">
              <span className="whitespace-nowrap">Use code </span>
              <strong className="whitespace-nowrap text-gold">GLOW10</strong>
              <span className="hidden sm:inline"> — </span>
              <span className="block sm:inline">10% off your first ritual</span>
            </p>
          </div>
          <div className="flex items-center gap-3 border-t border-charcoal/8 pt-3 sm:shrink-0 sm:border-t-0 sm:pt-0 dark:border-white/10">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15">
              <TruckIcon className="h-4 w-4 text-gold" />
            </span>
            <p className="text-left text-[0.65rem] uppercase leading-snug tracking-wide text-charcoal/80 sm:text-[0.62rem] sm:tracking-luxe dark:text-ivory/80">
              Shipped in only 24 hours
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left — commerce copy + quick shop */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-charcoal/10 bg-white/70 px-4 py-2 text-[0.58rem] uppercase tracking-luxe dark:border-white/10 dark:bg-white/5">
              <SparklesIcon className="h-3.5 w-3.5 text-gold" />
              {appConfig.brandTagline}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl font-light leading-[1.05] text-charcoal sm:text-5xl lg:text-[3.4rem] dark:text-ivory">
              Your destination for
              <span className="block italic text-gradient-gold">timeless beauty.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 max-w-lg text-base leading-relaxed text-charcoal/65 dark:text-ivory/65">
              {products.length}+ authenticated skincare &amp; cosmetics. Real prices in PKR,
              fast delivery, secure checkout &amp; cash on delivery.
            </motion.p>

            {/* Category pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.href}
                  className="rounded-full border border-charcoal/12 bg-white/80 px-4 py-2 text-[0.62rem] uppercase tracking-luxe transition-colors hover:border-gold hover:text-gold dark:border-white/12 dark:bg-white/5">
                  {cat.label}
                </Link>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <button
                  onClick={() => navigate('/shop')}
                  className="flex items-center gap-2 rounded-full bg-charcoal px-8 py-4 text-[0.65rem] uppercase tracking-luxe text-ivory transition-colors hover:bg-gold hover:text-charcoal dark:bg-ivory dark:text-charcoal">
                  <ShoppingBagIcon className="h-4 w-4" />
                  Shop all products
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 rounded-full border border-charcoal/20 px-8 py-4 text-[0.65rem] uppercase tracking-luxe transition-colors hover:border-gold hover:text-gold dark:border-white/20">
                  Best sellers
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </Magnetic>
            </motion.div>

            {/* Trust grid */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: ShieldCheckIcon, label: '100% Authentic' },
                { icon: TruckIcon, label: 'Nationwide delivery' },
                { icon: CreditCardIcon, label: 'COD available' },
                { icon: StarIcon, label: '4.7★ rated' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-charcoal/8 bg-white/60 px-3 py-4 text-center dark:border-white/8 dark:bg-white/5">
                  <Icon className="h-5 w-5 text-gold" />
                  <span className="text-[0.58rem] uppercase tracking-luxe text-charcoal/70 dark:text-ivory/70">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Mini product rail */}
            {spotlight.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 hidden sm:block">
                <p className="mb-3 text-[0.58rem] uppercase tracking-luxe text-gold">Trending now</p>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {spotlight.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      className="group flex min-w-[140px] shrink-0 items-center gap-3 rounded-2xl border border-charcoal/10 bg-white/80 p-2.5 transition-shadow hover:shadow-luxe dark:border-white/10 dark:bg-white/5">
                      <div className={`h-14 w-14 shrink-0 rounded-xl ${product.accent} p-1.5`}>
                        <img src={product.image} alt="" className="h-full w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-serif text-sm leading-tight">{product.name.split(' ').slice(0, 3).join(' ')}</p>
                        <p className="text-sm font-medium text-gold">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — featured product commerce card */}
          <div className="relative flex items-center justify-center lg:col-span-6">
            {/* Orbit thumbnails */}
            {orbitProducts.map((product, i) => {
              const positions = [
                'left-0 top-8',
                'right-0 top-16',
                'left-4 bottom-24',
                'right-2 bottom-8',
              ];
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className={`absolute z-20 hidden lg:block ${positions[i]}`}>
                  <Link
                    to={`/products/${product.slug}`}
                    className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/90 px-3 py-2 shadow-luxe backdrop-blur-sm transition-transform hover:scale-105 dark:border-white/10 dark:bg-graphite/90">
                    <div className={`h-10 w-10 rounded-lg ${product.accent} p-1`}>
                      <img src={product.image} alt="" className="h-full object-contain" />
                    </div>
                    <span className="max-w-[90px] truncate text-[0.58rem] uppercase tracking-luxe">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="relative w-full max-w-[420px]">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-gold/20 via-blush/30 to-sage/20 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white/80 p-6 shadow-luxe-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex rounded-full bg-gold/15 px-3 py-1 text-[0.55rem] uppercase tracking-luxe text-gold">
                      Featured deal
                    </span>
                    <h2 className="mt-3 font-serif text-2xl leading-tight">{heroProduct.name}</h2>
                  </div>
                  {discount && (
                    <span className="shrink-0 rounded-full bg-charcoal px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-luxe text-ivory dark:bg-gold dark:text-charcoal">
                      −{discount}%
                    </span>
                  )}
                </div>

                <div className="relative mx-auto flex justify-center py-4">
                  <div className="absolute inset-x-8 top-1/2 h-32 -translate-y-1/2 rounded-full bg-gold/10 blur-2xl" />
                  <img
                    src={appConfig.heroImage}
                    alt={heroProduct.name}
                    width={400}
                    height={600}
                    decoding="async"
                    fetchPriority="high"
                    className="relative z-10 max-h-[320px] w-auto object-contain drop-shadow-[0_24px_48px_rgba(43,43,43,0.18)]"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-charcoal/8 pt-4 dark:border-white/8">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-3xl text-gold">{formatPrice(heroProduct.price)}</span>
                      {heroProduct.compareAtPrice && (
                        <span className="text-sm text-charcoal/40 line-through dark:text-ivory/40">
                          {formatPrice(heroProduct.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <RatingStars rating={heroProduct.rating} />
                      <span className="text-xs text-charcoal/50 dark:text-ivory/50">
                        ({heroProduct.reviewCount})
                      </span>
                    </div>
                  </div>
                  <p className="text-right text-[0.58rem] uppercase tracking-luxe text-charcoal/50 dark:text-ivory/50">
                    {heroProduct.stock} in stock
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAdd}
                    className="flex items-center justify-center gap-2 rounded-full bg-charcoal py-3.5 text-[0.62rem] uppercase tracking-luxe text-ivory transition-colors hover:bg-gold hover:text-charcoal dark:bg-ivory dark:text-charcoal">
                    <ShoppingBagIcon className="h-4 w-4" />
                    Add to bag
                  </button>
                  <button
                    onClick={() => navigate(`/products/${heroProduct.slug}`)}
                    className="rounded-full border border-charcoal/15 py-3.5 text-[0.62rem] uppercase tracking-luxe transition-colors hover:border-gold hover:text-gold dark:border-white/15">
                    Buy now
                  </button>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -right-2 -top-2 z-30 rounded-2xl border border-gold/30 bg-charcoal px-4 py-3 text-ivory shadow-luxe dark:bg-ivory dark:text-charcoal">
                <p className="text-[0.55rem] uppercase tracking-luxe text-gold">Live store</p>
                <p className="font-serif text-xl">{products.length}+</p>
                <p className="text-[0.55rem] uppercase tracking-luxe opacity-70">Products</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
