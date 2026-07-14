import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, GiftIcon, TagIcon } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { catalogProducts } from '../lib/mockData';
import { EmptyState } from '../components/ui/EmptyState';
import { QuantitySelector } from '../components/ui/QuantitySelector';
import { Price } from '../components/ui/Price';
import { commerceService } from '../services/commerceService';
export function CartPage() {
  const { cart, updateQuantity, removeFromCart, notify } = useAppState();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const lines = cart.flatMap((line) => {
    const product = catalogProducts.find((item) => item.id === line.productId);
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
  const shipping = subtotal >= 150 ? 0 : 14;
  const total = subtotal * (1 - discount / 100) + shipping;
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-14">
      <p className="text-[.64rem] uppercase tracking-luxe text-gold">
        Your ritual edit
      </p>
      <h1 className="mt-3 font-serif text-5xl">Shopping bag</h1>
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
            className="flex gap-5 border-b border-charcoal/10 pb-5 dark:border-white/10">
            
                <div
              className={`h-32 w-28 shrink-0 rounded-2xl ${line.product.accent} p-3`}>
              
                  <img
                src={line.product.image}
                alt=""
                className="h-full w-full object-contain" />
              
                </div>
                <div className="flex-1">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link
                    to={`/products/${line.product.slug}`}
                    className="font-serif text-2xl">
                    
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
                <span>${subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Estimated delivery</span>
                <span>
                  {shipping ? `$${shipping.toFixed(2)}` : 'Complimentary'}
                </span>
              </p>
              {discount > 0 &&
            <p className="flex justify-between text-gold">
                  <span>Welcome ritual</span>
                  <span>−{discount}%</span>
                </p>
            }
              <div className="border-t border-charcoal/10 pt-4 dark:border-white/10">
                <p className="flex justify-between font-serif text-xl">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </p>
              </div>
            </div>
            <form
            onSubmit={async (event) => {
              event.preventDefault();
              const result = await commerceService.validateCoupon(coupon);
              if (result.valid) {
                setDiscount(result.discount);
                notify(result.label);
              } else notify(result.label, 'error');
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
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/70">
              <div
              className="h-full bg-gold"
              style={{
                width: `${Math.min(100, subtotal / 150 * 100)}%`
              }} />
            
            </div>
            <p className="mt-2 text-xs text-charcoal/55 dark:text-ivory/55">
              {subtotal >= 150 ?
            'You unlocked complimentary shipping.' :
            `$${(150 - subtotal).toFixed(2)} away from complimentary shipping.`}
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