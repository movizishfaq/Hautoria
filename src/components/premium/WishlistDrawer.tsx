import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, HeartIcon } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { catalogProducts } from '../../lib/mockData';
import { Price } from '../ui/Price';

export function WishlistDrawer() {
  const { wishlistOpen, setWishlistOpen, wishlist, toggleWishlist, addToCart } =
    useAppState();

  useEffect(() => {
    document.body.style.overflow = wishlistOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [wishlistOpen]);

  const items = wishlist
    .map((w) => catalogProducts.find((p) => p.id === w.productId))
    .filter(Boolean);

  return (
    <AnimatePresence>
      {wishlistOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setWishlistOpen(false)}
            className="fixed inset-0 z-[85] bg-charcoal/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 right-0 z-[86] flex w-full max-w-md flex-col bg-ivory shadow-luxe-lg dark:bg-graphite">
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5 dark:border-white/10">
              <h2 className="font-serif text-2xl">Wishlist</h2>
              <button
                onClick={() => setWishlistOpen(false)}
                aria-label="Close"
                className="rounded-full p-2 hover:bg-beige dark:hover:bg-white/10">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {!items.length ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <HeartIcon className="mb-4 h-12 w-12 text-charcoal/20" />
                  <p className="font-serif text-xl">Nothing saved yet</p>
                  <p className="mt-2 text-sm text-charcoal/50">
                    Tap the heart on any product to save it here.
                  </p>
                  <Link
                    to="/shop"
                    onClick={() => setWishlistOpen(false)}
                    className="mt-6 text-[0.62rem] uppercase tracking-luxe text-gold">
                    Browse collection
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((product) => (
                    <div
                      key={product!.id}
                      className="flex gap-4 rounded-2xl bg-beige/50 p-4 dark:bg-white/5">
                      <div
                        className={`h-24 w-20 shrink-0 rounded-xl ${product!.accent} p-2`}>
                        <img
                          src={product!.image}
                          alt=""
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <Link
                          to={`/products/${product!.slug}`}
                          onClick={() => setWishlistOpen(false)}
                          className="font-serif text-lg leading-snug">
                          {product!.name}
                        </Link>
                        <Price value={product!.price} size="base" />
                        <div className="mt-auto flex gap-2 pt-3">
                          <button
                            onClick={() => addToCart(product!)}
                            className="flex-1 rounded-full bg-charcoal py-2 text-[0.58rem] uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal">
                            Add to cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(product!.id)}
                            className="rounded-full border border-charcoal/15 px-3 dark:border-white/15">
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
