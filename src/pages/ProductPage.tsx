import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckIcon,
  HeartIcon,
  PlayIcon,
  ScaleIcon,
  Share2Icon,
  TruckIcon,
  ZoomInIcon } from
'lucide-react';
import { catalogProducts, demoReviews } from '../lib/mockData';
import { useAppState } from '../hooks/useAppState';
import { EmptyState } from '../components/ui/EmptyState';
import { Price } from '../components/ui/Price';
import { QuantitySelector } from '../components/ui/QuantitySelector';
import { RatingStars } from '../components/ui/RatingStars';
import { ProductCard } from '../features/catalog/ProductCard';
export function ProductPage() {
  const { slug } = useParams();
  const product = catalogProducts.find((item) => item.slug === slug);
  const {
    addToCart,
    toggleWishlist,
    wishlist,
    toggleCompare,
    compare,
    viewProduct,
    notify
  } = useAppState();
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [question, setQuestion] = useState('');
  useEffect(() => {
    if (product) viewProduct(product.id);
  }, [product?.id]);
  if (!product)
  return (
    <main className="mx-auto max-w-5xl px-6 py-28">
        <EmptyState
        title="That ritual is elsewhere"
        body="The product may have been retired or moved." />
      
      </main>);

  const wished = wishlist.some((item) => item.productId === product.id);
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="mb-8 text-[.64rem] uppercase tracking-luxe text-charcoal/45 dark:text-ivory/45">
        <Link to="/shop">Shop</Link> / {product.category} / {product.name}
      </p>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <div
            className={`relative aspect-square overflow-hidden rounded-[2rem] ${product.accent}`}>
            
            <img
              src={product.gallery[image]}
              alt={product.name}
              className="h-full w-full object-contain p-10" />
            
            <button
              onClick={() => setZoom(true)}
              className="absolute bottom-5 right-5 rounded-full bg-white/80 p-3 text-charcoal">
              
              <ZoomInIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 flex gap-3">
            {product.gallery.slice(0, 4).map((source, index) =>
            <button
              onClick={() => setImage(index)}
              key={`${source}-${index}`}
              className={`h-20 w-20 rounded-xl p-2 ${image === index ? 'ring-1 ring-gold' : 'bg-beige dark:bg-white/5'}`}>
              
                <img
                src={source}
                alt=""
                className="h-full w-full object-contain" />
              
              </button>
            )}
            <button
              className="flex h-20 w-20 items-center justify-center rounded-xl bg-charcoal text-ivory"
              aria-label="Play product film">
              
              <PlayIcon className="h-5 w-5 fill-current" />
            </button>
          </div>
        </div>
        <section>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[.64rem] uppercase tracking-luxe text-gold">
                {product.tagline}
              </p>
              <h1 className="mt-2 font-serif text-5xl">{product.name}</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  notify(wished ? 'Removed from wishlist' : 'Saved to wishlist');
                }}
                aria-label="Save product"
                className="rounded-full border border-charcoal/15 p-3 dark:border-white/15">
                
                <HeartIcon className={wished ? 'fill-gold text-gold' : ''} />
              </button>
              <button
                onClick={() => {
                  toggleCompare(product.id);
                  notify('Comparison list updated');
                }}
                aria-label="Compare product"
                className="rounded-full border border-charcoal/15 p-3 dark:border-white/15">
                
                <ScaleIcon
                  className={compare.includes(product.id) ? 'text-gold' : ''} />
                
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  notify('Product link copied');
                }}
                aria-label="Share product"
                className="rounded-full border border-charcoal/15 p-3 dark:border-white/15">
                
                <Share2Icon />
              </button>
            </div>
          </div>
          <div className="mt-4">
            <RatingStars rating={product.rating} count={product.reviewCount} />
          </div>
          <div className="mt-5">
            <Price
              value={product.price}
              compareAtPrice={product.compareAtPrice}
              size="lg" />
            
          </div>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-charcoal/65 dark:text-ivory/65">
            {product.description}
          </p>
          <p
            className={`mt-5 text-sm ${product.stock <= 8 ? 'text-gold' : 'text-charcoal/65 dark:text-ivory/65'}`}>
            
            {product.stock <= 8 ?
            `Only ${product.stock} rituals remaining` :
            'In stock · prepared within 24 hours'}
          </p>
          <div className="mt-6 flex gap-3">
            {product.variants.map((variant) =>
            <span
              key={variant.id}
              className="rounded-full border border-gold bg-gold/10 px-4 py-2 text-xs">
              
                {variant.name}
              </span>
            )}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantitySelector
              value={quantity}
              max={product.stock}
              onChange={setQuantity} />
            
            <button
              onClick={() =>
              addToCart(product, product.variants[0].id, quantity)
              }
              className="flex-1 rounded-full bg-charcoal px-8 py-4 text-[.68rem] uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal">
              
              Add to bag · ${(product.price * quantity).toFixed(2)}
            </button>
          </div>
          <div className="mt-7 grid grid-cols-1 gap-3 rounded-2xl bg-beige p-5 text-sm dark:bg-white/5">
            <p className="flex gap-3">
              <TruckIcon className="h-5 w-5 text-gold" /> Complimentary delivery
              over $150 · Estimated Jul 16–18
            </p>
            <p className="flex gap-3">
              <CheckIcon className="h-5 w-5 text-gold" /> 30-day ritual
              guarantee · Authentic formula promise
            </p>
          </div>
        </section>
      </div>
      <section className="mt-20 grid grid-cols-1 gap-10 border-t border-charcoal/10 pt-14 lg:grid-cols-2 dark:border-white/10">
        <div>
          <h2 className="font-serif text-3xl">Ingredient transparency</h2>
          <div className="mt-6 space-y-3">
            {product.ingredients.map((ingredient) =>
            <div
              key={ingredient}
              className="rounded-xl border border-charcoal/10 p-4 dark:border-white/10">
              
                <p className="font-serif text-lg">{ingredient}</p>
                <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
                  Chosen for clinically considered efficacy and a comfortable
                  sensory finish.
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="font-serif text-3xl">Reviews & questions</h2>
          <div className="mt-5 space-y-4">
            {demoReviews.map((review) =>
            <article
              key={review.id}
              className="rounded-2xl bg-beige p-5 dark:bg-white/5">
              
                <div className="flex justify-between">
                  <p className="font-medium">
                    {review.author}{' '}
                    {review.verified &&
                  <span className="ml-2 text-[.58rem] uppercase tracking-luxe text-gold">
                        Verified buyer
                      </span>
                  }
                  </p>
                  <RatingStars rating={review.rating} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/65 dark:text-ivory/65">
                  {review.text}
                </p>
              </article>
            )}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (question.trim()) {
                notify('Question submitted for our formula team');
                setQuestion('');
              }
            }}
            className="mt-5 rounded-2xl border border-charcoal/10 p-4 dark:border-white/10">
            
            <label className="text-xs uppercase tracking-luxe">
              Ask the formula team
            </label>
            <div className="mt-3 flex gap-3">
              <input
                required
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                className="min-w-0 flex-1 bg-transparent outline-none"
                placeholder="What would you like to know?" />
              
              <button className="text-xs uppercase tracking-luxe text-gold">
                Send
              </button>
            </div>
          </form>
        </div>
      </section>
      <section className="mt-20">
        <h2 className="font-serif text-4xl">Frequently paired</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {catalogProducts.
          filter((item) => item.id !== product.id).
          slice(0, 3).
          map((item) =>
          <ProductCard key={item.id} product={item} />
          )}
        </div>
      </section>
      {zoom &&
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/85 p-6"
        onClick={() => setZoom(false)}>
        
          <img
          src={product.gallery[image]}
          alt={`${product.name} enlarged`}
          className="max-h-full max-w-full object-contain" />
        
        </div>
      }
    </main>);

}