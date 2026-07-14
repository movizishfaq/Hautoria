import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { HeartIcon, PlusIcon, ShoppingBagIcon, StarIcon } from 'lucide-react';
import type { Product } from '../../types/domain';
import { discountPercent, formatPrice } from '../../lib/formatPrice';
import { useAppState } from '../../hooks/useAppState';
import { RatingStars } from '../../components/ui/RatingStars';

export function LuxuryProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { addToCart, toggleWishlist, wishlist, notify } = useAppState();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], compact ? [3, -3] : [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], compact ? [-4, 4] : [-8, 8]), { stiffness: 200, damping: 20 });

  const wished = wishlist.some((w) => w.productId === product.id);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const lowStock = product.stock <= 8;

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        mx.set(0);
        my.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1200 }}
      className="group relative flex flex-col"
      whileHover={{ y: compact ? -4 : -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
      <div
        className={`relative overflow-hidden premium-shadow transition-shadow duration-500 group-hover:shadow-luxe-gold ${
          compact
            ? 'aspect-[4/5] rounded-2xl'
            : 'aspect-[3/4] rounded-[1.75rem]'
        } ${product.accent}`}>
        <Link
          to={`/products/${product.slug}`}
          aria-label={product.name}
          className="absolute inset-0 z-10"
        />

        {discount && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`absolute z-20 rounded-full bg-charcoal font-medium uppercase tracking-luxe text-ivory ${
              compact ? 'left-2.5 top-2.5 px-2 py-0.5 text-[0.48rem]' : 'left-4 top-4 px-3 py-1 text-[0.55rem]'
            }`}>
            −{discount}%
          </motion.span>
        )}

        {lowStock && (
          <span
            className={`absolute z-20 rounded-full bg-gold/90 uppercase tracking-luxe text-charcoal ${
              compact
                ? 'right-2.5 top-2.5 px-2 py-0.5 text-[0.48rem]'
                : 'right-4 top-4 px-3 py-1 text-[0.55rem]'
            }`}>
            Only {product.stock} left
          </span>
        )}

        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          animate={{
            scale: hovered ? 1.08 : 1,
            filter: hovered ? 'brightness(1.05)' : 'brightness(1)',
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`pointer-events-none relative z-0 h-full w-full object-contain ${
            compact ? 'p-3' : 'p-6'
          }`}
        />

        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-charcoal/20 via-transparent to-transparent"
        />

        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 16 }}
          className={`absolute z-20 flex gap-2 ${
            compact ? 'inset-x-2 bottom-2' : 'inset-x-4 bottom-4'
          }`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className={`pointer-events-auto flex flex-1 items-center justify-center gap-1.5 rounded-full glass uppercase tracking-luxe text-charcoal backdrop-blur-xl transition-colors hover:bg-charcoal hover:text-ivory ${
              compact ? 'py-2 text-[0.48rem]' : 'py-3 text-[0.58rem]'
            }`}>
            <PlusIcon className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            {compact ? 'Add' : 'Quick Add'}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
              notify(wished ? 'Removed from wishlist' : 'Saved to wishlist');
            }}
            aria-label="Wishlist"
            className={`pointer-events-auto rounded-full glass backdrop-blur-xl ${
              compact ? 'p-2' : 'p-3'
            }`}>
            <HeartIcon
              className={`${wished ? 'fill-gold text-gold' : ''} ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`}
            />
          </button>
        </motion.div>
      </div>

      <div className={compact ? 'px-0.5 pt-3' : 'px-1 pt-5'}>
        <div className="flex items-start justify-between gap-1.5">
          <Link
            to={`/products/${product.slug}`}
            className={`font-serif leading-snug text-charcoal dark:text-ivory ${
              compact ? 'line-clamp-2 text-sm' : 'text-lg'
            }`}>
            {product.name}
          </Link>
          {!compact && <RatingStars rating={product.rating} />}
        </div>

        <div className={compact ? 'mt-2 h-5' : 'mt-3 h-7 overflow-hidden'}>
          <motion.p
            initial={compact ? false : { y: '100%' }}
            whileInView={compact ? undefined : { y: 0 }}
            viewport={{ once: true }}
            className={`font-serif text-charcoal dark:text-ivory ${
              compact ? 'text-base' : 'text-xl'
            }`}>
            {formatPrice(product.price)}
            {product.compareAtPrice && (
              <span
                className={`ml-1.5 text-charcoal/35 line-through dark:text-ivory/35 ${
                  compact ? 'text-xs' : 'text-sm'
                }`}>
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </motion.p>
        </div>

        {!compact && (
          <div className="mt-2 flex items-center gap-1 text-[0.55rem] text-charcoal/45 dark:text-ivory/45">
            <StarIcon className="h-3 w-3 fill-gold text-gold" />
            {product.rating} · {product.reviewCount} reviews
          </div>
        )}
      </div>
    </motion.article>
  );
}
