import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ShoppingBagIcon, XIcon } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { catalogProducts } from '../../lib/mockData';
import { QuantitySelector } from '../../components/ui/QuantitySelector';
import { Price } from '../../components/ui/Price';
import { EmptyState } from '../../components/ui/EmptyState';
export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, updateQuantity, removeFromCart } =
  useAppState();
  const lines = cart.flatMap((item) => {
    const product = catalogProducts.find((entry) => entry.id === item.productId);
    const variant = product?.variants.find(
      (entry) => entry.id === item.variantId
    );
    return product && variant ?
    [
    {
      ...item,
      product,
      variant
    }] :

    [];
  });
  const total = lines.reduce(
    (sum, line) => sum + line.variant.price * line.quantity,
    0
  );
  return (
    <AnimatePresence>
      {cartOpen &&
      <>
          <motion.button
          aria-label="Close cart"
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 z-[80] bg-charcoal/25"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }} />
        
          <motion.aside
          aria-label="Shopping bag"
          className="fixed right-0 top-0 z-[81] flex h-dvh w-full max-w-md flex-col bg-ivory p-6 shadow-2xl dark:bg-[#1f1f1f]"
          initial={{
            x: '100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '100%'
          }}
          transition={{
            duration: 0.28,
            ease: [0.32, 0.72, 0, 1]
          }}>
          
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBagIcon className="h-5 w-5 text-gold" />
                <h2 className="font-serif text-2xl">Your bag</h2>
              </div>
              <button
              onClick={() => setCartOpen(false)}
              aria-label="Close cart">
              
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            {!lines.length ?
          <div className="my-auto">
                <EmptyState
              title="Your bag is waiting"
              body="Add a ritual to begin your Hautoria experience." />
            
              </div> :

          <>
                <div className="flex-1 space-y-5 overflow-y-auto py-6">
                  {lines.map((line) =>
              <div
                key={`${line.productId}-${line.variantId}`}
                className="flex gap-4">
                
                      <div
                  className={`h-24 w-20 shrink-0 rounded-2xl ${line.product.accent} p-2`}>
                  
                        <img
                    src={line.product.image}
                    alt=""
                    className="h-full w-full object-contain" />
                  
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-serif text-lg">
                              {line.product.name}
                            </p>
                            <p className="text-xs text-charcoal/50 dark:text-ivory/50">
                              {line.variant.name}
                            </p>
                          </div>
                          <button
                      onClick={() =>
                      removeFromCart(line.productId, line.variantId)
                      }
                      className="text-xs uppercase tracking-luxe text-charcoal/50 underline dark:text-ivory/50">
                      
                            Remove
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <QuantitySelector
                      value={line.quantity}
                      max={line.product.stock}
                      onChange={(quantity) =>
                      updateQuantity(
                        line.productId,
                        line.variantId,
                        quantity
                      )
                      } />
                    
                          <Price value={line.variant.price * line.quantity} />
                        </div>
                      </div>
                    </div>
              )}
                </div>
                <div className="border-t border-charcoal/10 pt-5 dark:border-white/10">
                  <div className="flex justify-between font-serif text-xl">
                    <span>Subtotal</span>
                    <Price value={total} />
                  </div>
                  <p className="mt-2 text-xs text-charcoal/55 dark:text-ivory/55">
                    Taxes and delivery are calculated at checkout.
                  </p>
                  <Link
                onClick={() => setCartOpen(false)}
                to="/checkout"
                className="mt-5 flex items-center justify-center gap-3 rounded-full bg-charcoal px-6 py-4 text-[0.68rem] uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal">
                
                    Secure checkout <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <Link
                onClick={() => setCartOpen(false)}
                to="/cart"
                className="mt-3 block text-center text-xs uppercase tracking-luxe underline">
                
                    View bag
                  </Link>
                </div>
              </>
          }
          </motion.aside>
        </>
      }
    </AnimatePresence>);

}