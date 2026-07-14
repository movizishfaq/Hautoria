import React from 'react';
import { ShoppingBagIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/domain';
import { Price } from '../../components/ui/Price';
import { discountPercent } from '../../lib/formatPrice';
import { useAppState } from '../../hooks/useAppState';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, notify } = useAppState();
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <article className="group relative flex flex-col">
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-[1.75rem] ${product.accent} p-5`}>
        <Link
          to={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-10"
        />
        {discount && (
          <div className="absolute left-4 top-4 z-20">
            <span className="rounded-full bg-gold px-3 py-1 text-[0.58rem] font-medium uppercase tracking-luxe text-charcoal">
              {discount}% Off
            </span>
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="pointer-events-none relative z-0 h-full w-full object-contain transition-transform duration-700 ease-luxe group-hover:scale-105 group-hover:-rotate-2"
        />
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <Link
          to={`/products/${product.slug}`}
          className="font-serif text-xl leading-snug text-charcoal dark:text-ivory">
          {product.name}
        </Link>

        <div className="mt-3">
          <Price value={product.price} compareAtPrice={product.compareAtPrice} />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              addToCart(product);
              notify('Added to cart');
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-charcoal/15 px-4 py-3 text-[0.62rem] uppercase tracking-luxe transition-colors hover:border-gold hover:text-gold dark:border-white/20">
            <ShoppingBagIcon className="h-4 w-4" />
            Add to Cart
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="flex flex-1 items-center justify-center rounded-full bg-charcoal px-4 py-3 text-center text-[0.62rem] uppercase tracking-luxe text-ivory transition-colors hover:bg-gold hover:text-charcoal dark:bg-ivory dark:text-charcoal">
            Buy Now
          </Link>
        </div>
      </div>
    </article>
  );
}
