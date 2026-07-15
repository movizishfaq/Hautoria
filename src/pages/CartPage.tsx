import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, GiftIcon, TagIcon } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { useCatalog } from '../context/CatalogContext';
import { EmptyState } from '../components/ui/EmptyState';
import { QuantitySelector } from '../components/ui/QuantitySelector';
import { Price } from '../components/ui/Price';
import { formatPrice } from '../lib/formatPrice';
import { commerceService } from '../services/commerceService';
export function CartPage() {
  const { cart, updateQuantity, removeFromCart, notify } = useAppState();
  const { products } = useCatalog();
  const [coupon, setCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountLabel, setDiscountLabel] = useState('');
  const lines = cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    const variant = product?.variants.find((item) => item.id === line.variantId);
    return product && variant ?
    [
    {
      ...line,
      product,
      variant
    }] :

    [];
  });
  const subtotal = lines.reduce(
    (sum, line) => sum + line.variant.price * line.quantity,
    0
  );
  const shipping = 250;
  const total = Math.max(0, subtotal + shipping - discountAmount);
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 pb-10 pt-32 sm:px-6 sm:pt-36">
      <p className="text-[.64rem] uppercase tracking-luxe text-gold">
        Your ritual edit
      </p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Shopping bag</h1>
      {!lines.length ?
      <div className="mt-10">
          <EmptyState
          title="Your bag is waiting"
          body="Curate a ritual that meets your skin where it is today." />
        
        </div> :

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <section className="space-y-5">
            {lines.map((line) =>
          <article
            key={`${line.productId}-${line.variantId}`}
            className="flex flex-col gap-4 border-b border-charcoal/10 pb-5 sm:flex-row sm:gap-5 dark:border-white/10">
            
                <div
              className={`mx-auto h-36 w-full max-w-[9rem] shrink-0 rounded-2xl sm:mx-0 sm:h-32 sm:w-28 ${line.product.accent} p-3`}>
              
                  <img
                src={line.product.image}
                alt=""
                className="h-full w-full object-contain" />
              
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:gap-3">
                    <div className="min-w-0">
                      <Link
                    to={`/products/${line.product.slug}`}
                    className="font-serif text-xl sm:text-2xl">
                    
                        {line.product.name}
                      </Link>
                      <p className="text-sm text-charcoal/55 dark:text-ivory/55">
                        {line.variant.name}
                      </p>
                    </div>
                    <Price value={line.variant.price * line.quantity} />
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <QuantitySelector
                  value={line.quantity}
                  max={line.product.stock}
                  onChange={(quantity) =>
                  updateQuantity(line.productId, line.variantId, quantity)
                  } />
                
                    <button
                  onClick={() =>
                  removeFromCart(line.productId, line.variantId)
                  }
                  className="text-xs uppercase tracking-luxe underline text-charcoal/55 dark:text-ivory/55">
                  
                      Remove
                    </button>
                  </div>
                </div>
              </article>
          )}
          </section>
          <aside className="h-fit rounded-[2rem] bg-beige p-6 dark:bg-white/5">
            <h2 className="font-serif text-2xl">Order summary</h2>
            <div className="mt-6 space-y-3 text-sm">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </p>
              <p className="flex justify-between">
                <span>Estimated delivery</span>
                <span>
                  {shipping ? formatPrice(shipping) : 'Complimentary'}
                </span>
              </p>
              {discountAmount > 0 && (
                <p className="flex justify-between text-gold">
                  <span>{discountLabel || 'Discount'}</span>
                  <span>−{formatPrice(discountAmount)}</span>
                </p>
              )}
              <div className="border-t border-charcoal/10 pt-4 dark:border-white/10">
                <p className="flex justify-between font-serif text-xl">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </p>
              </div>
            </div>
            <form
            onSubmit={async (event) => {
              event.preventDefault();
              const result = await commerceService.validateCoupon(coupon, subtotal);
              if (result.valid) {
                setDiscountAmount(result.discount);
                setDiscountLabel(result.label);
                notify(result.label);
              } else {
                setDiscountAmount(0);
                setDiscountLabel('');
                notify(result.label, 'error');
              }
            }}
            className="mt-6 flex rounded-xl border border-charcoal/15 dark:border-white/15">
            
              <input
              value={coupon}
              onChange={(event) => setCoupon(event.target.value)}
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
              placeholder="Promotion code" />
            
              <button className="px-3 text-gold">
                <TagIcon className="h-4 w-4" />
              </button>
            </form>
            <button
            onClick={() =>
            notify(
              'Gift card field will be available at secure checkout',
              'info'
            )
            }
            className="mt-3 flex items-center gap-2 text-xs uppercase tracking-luxe text-charcoal/60 dark:text-ivory/60">
            
              <GiftIcon className="h-4 w-4" /> Apply gift card
            </button>
            <p className="mt-5 text-xs text-charcoal/55 dark:text-ivory/55">
              Flat delivery fee {formatPrice(250)} · shipped in 24 hours
            </p>
            <Link
            to="/checkout"
            className="mt-7 flex items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-4 text-[.65rem] uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal">
            
              Checkout securely <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      }
    </main>);

}