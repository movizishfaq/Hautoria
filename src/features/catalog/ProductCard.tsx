import React from 'react';
import { HeartIcon, ScaleIcon, ShoppingBagIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/domain';
import { Price } from '../../components/ui/Price';
import { RatingStars } from '../../components/ui/RatingStars';
import { useAppState } from '../../hooks/useAppState';
export function ProductCard({ product }: {product: Product;}) {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    compare,
    toggleCompare,
    notify
  } = useAppState();
  const wished = wishlist.some((item) => item.productId === product.id);
  const comparing = compare.includes(product.id);
  return (
    <article className="group relative">
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-[1.75rem] ${product.accent} p-5`}>
        
        <Link
          to={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-10" />
        
        <div className="absolute left-4 top-4 z-20 flex gap-2">
          {product.badges.slice(0, 1).map((badge) =>
          <span
            key={badge}
            className="rounded-full bg-ivory/80 px-3 py-1 text-[0.58rem] uppercase tracking-luxe text-charcoal backdrop-blur">
            
              {badge}
            </span>
          )}
        </div>
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-2">
          <button
            aria-label="Toggle wishlist"
            onClick={() => {
              toggleWishlist(product.id);
              notify(wished ? 'Removed from wishlist' : 'Saved to wishlist');
            }}
            className="rounded-full bg-white/75 p-2.5 text-charcoal backdrop-blur">
            
            <HeartIcon
              className={`h-4 w-4 ${wished ? 'fill-gold text-gold' : ''}`} />
            
          </button>
          <button
            aria-label="Toggle comparison"
            onClick={() => {
              if (!comparing && compare.length >= 3)
              notify('Compare up to three products', 'info');else
              toggleCompare(product.id);
            }}
            className="rounded-full bg-white/75 p-2.5 text-charcoal backdrop-blur">
            
            <ScaleIcon className={`h-4 w-4 ${comparing ? 'text-gold' : ''}`} />
          </button>
        </div>
        <img
          src={product.image}
          alt=""
          className="pointer-events-none relative z-0 h-full w-full object-contain transition-transform duration-700 ease-luxe group-hover:scale-105 group-hover:-rotate-2" />
        
      </div>
      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/products/${product.slug}`}
              className="font-serif text-xl text-charcoal dark:text-ivory">
              
              {product.name}
            </Link>
            <p className="mt-1 text-[0.62rem] uppercase tracking-luxe text-charcoal/45 dark:text-ivory/45">
              {product.tagline}
            </p>
          </div>
          <button
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            className="rounded-full border border-charcoal/15 p-3 transition-colors hover:border-gold hover:text-gold dark:border-white/20">
            
            <ShoppingBagIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Price
            value={product.price}
            compareAtPrice={product.compareAtPrice} />
          
          <RatingStars rating={product.rating} />
        </div>
      </div>
    </article>);

}