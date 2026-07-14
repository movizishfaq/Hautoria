import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckIcon, ChevronRightIcon, LockKeyholeIcon } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { useCatalog } from '../context/CatalogContext';
import { demoAddress } from '../lib/mockData';
import { formatPrice } from '../lib/formatPrice';
import { commerceService } from '../services/commerceService';
import type {
  Address,
  CheckoutDraft,
  Order,
  PaymentProvider } from
'../types/domain';
const payments: Array<{
  id: PaymentProvider;
  label: string;
}> = [
{
  id: 'stripe',
  label: 'Card · Stripe mock'
},
{
  id: 'paypal',
  label: 'PayPal mock'
},
{
  id: 'apple_pay',
  label: 'Apple Pay'
},
{
  id: 'google_pay',
  label: 'Google Pay'
},
{
  id: 'cod',
  label: 'Cash on delivery'
},
{
  id: 'bank_transfer',
  label: 'Bank transfer'
},
{
  id: 'easypaisa',
  label: 'EasyPaisa'
},
{
  id: 'jazzcash',
  label: 'JazzCash'
},
{
  id: 'nayapay',
  label: 'Nayapay'
},
{
  id: 'sadapay',
  label: 'SadaPay'
}];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, user, addOrder, notify } = useAppState();
  const { products } = useCatalog();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<CheckoutDraft>({
    email: user?.email ?? '',
    address: user?.addresses[0] ?? demoAddress,
    shippingMethod: 'standard',
    paymentProvider: 'stripe',
    usePoints: false
  });
  const [processing, setProcessing] = useState(false);
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
  const shipping =
  draft.shippingMethod === 'express' ? 499 : subtotal >= 5000 ? 0 : 299;
  const pointsDiscount = draft.usePoints ? 500 : 0;
  const total = Math.max(0, subtotal + shipping - pointsDiscount);
  const updateAddress = (field: keyof Address, value: string) =>
  setDraft((current) => ({
    ...current,
    address: {
      ...(current.address ?? demoAddress),
      [field]: value
    }
  }));
  const place = async () => {
    if (!draft.email.includes('@') || !draft.address?.line1) {
      notify('Complete contact and delivery details', 'error');
      setStep(0);
      return;
    }
    setProcessing(true);
    const order: Order = {
      id: `ord_${Date.now()}`,
      number: `HT-${String(Date.now()).slice(-5)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString().slice(0, 10),
      total,
      subtotal,
      tax: 0,
      shipping,
      discount: pointsDiscount,
      paymentProvider: draft.paymentProvider,
      shippingAddress: draft.address,
      items: lines.map((line) => ({
        productId: line.product.id,
        productName: line.product.name,
        image: line.product.image,
        variantName: line.variant.name,
        quantity: line.quantity,
        unitPrice: line.variant.price
      })),
      events: [
      {
        status: 'confirmed',
        label: 'Order confirmed',
        description: 'Your ritual has been reserved.',
        date: 'Just now',
        completed: true
      },
      {
        status: 'packed',
        label: 'Prepared with care',
        description: 'Our atelier will begin shortly.',
        date: 'Next',
        completed: false
      },
      {
        status: 'shipped',
        label: 'On its way',
        description: 'Tracking will appear here.',
        date: 'Next',
        completed: false
      },
      {
        status: 'delivered',
        label: 'Delivered',
        description: 'Enjoy your ritual.',
        date: 'Next',
        completed: false
      }]

    };
    try {
      const created = await commerceService.createOrder(
        draft,
        lines.map((line) => ({
          productId: line.product.id,
          variantId: line.variant.id,
          quantity: line.quantity,
        })),
        order
      );
      addOrder(created);
      navigate(`/checkout/success/${created.id}`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Checkout failed', 'error');
    } finally {
      setProcessing(false);
    }
  };
  if (!lines.length)
  return (
    <main className="mx-auto max-w-4xl px-6 py-28 text-center">
        <h1 className="font-serif text-4xl">Your bag is empty.</h1>
        <Link
        to="/shop"
        className="mt-6 inline-block rounded-full bg-charcoal px-6 py-3 text-xs uppercase tracking-luxe text-ivory">
        
          Return to shop
        </Link>
      </main>);

  const steps = ['Contact', 'Delivery', 'Payment', 'Review'];
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="text-[.62rem] uppercase tracking-luxe text-gold">
            Secure checkout
          </p>
          <h1 className="mt-2 font-serif text-4xl">A ritual, almost yours.</h1>
        </div>
        <p className="hidden items-center gap-2 text-xs text-charcoal/55 sm:flex dark:text-ivory/55">
          <LockKeyholeIcon className="h-4 w-4 text-gold" /> Demo checkout · no
          payment is processed
        </p>
      </div>
      <div className="mb-10 flex overflow-x-auto border-b border-charcoal/10 dark:border-white/10">
        {steps.map((label, index) =>
        <button
          key={label}
          onClick={() => index < step && setStep(index)}
          className={`flex shrink-0 items-center gap-2 px-4 py-4 text-[.62rem] uppercase tracking-luxe ${index === step ? 'border-b-2 border-gold text-charcoal dark:text-ivory' : 'text-charcoal/40 dark:text-ivory/40'}`}>
          
            <span
            className={`flex h-5 w-5 items-center justify-center rounded-full ${index < step ? 'bg-gold' : index === step ? 'border border-gold' : ''}`}>
            
              {index < step ? <CheckIcon className="h-3 w-3" /> : index + 1}
            </span>
            {label}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_330px]">
        <section className="rounded-[2rem] border border-charcoal/10 bg-white/35 p-6 sm:p-8 dark:border-white/10 dark:bg-white/5">
          {step === 0 &&
          <div>
              <h2 className="font-serif text-3xl">Contact</h2>
              <label className="mt-7 block text-xs uppercase tracking-luxe">
                Email
                <input
                type="email"
                required
                value={draft.email}
                onChange={(event) =>
                setDraft({
                  ...draft,
                  email: event.target.value
                })
                }
                className="mt-2 w-full rounded-xl border border-charcoal/15 bg-transparent p-3 text-base normal-case tracking-normal outline-none focus:border-gold dark:border-white/15"
                placeholder="you@example.com" />
              
              </label>
              <label className="mt-5 flex gap-3 text-sm">
                <input type="checkbox" defaultChecked /> Send me ritual notes
                and order updates
              </label>
            </div>
          }
          {step === 1 &&
          <div>
              <h2 className="font-serif text-3xl">Delivery</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(
              [
              'firstName',
              'lastName',
              'line1',
              'city',
              'state',
              'postalCode',
              'country',
              'phone'] as
              Array<keyof Address>).
              map((field) =>
              <label
                key={field}
                className={`text-xs uppercase tracking-luxe ${field === 'line1' ? 'sm:col-span-2' : ''}`}>
                
                    {field.
                replace('line1', 'Address').
                replace(/([A-Z])/g, ' $1')}
                    <input
                  value={String(draft.address?.[field] ?? '')}
                  onChange={(event) =>
                  updateAddress(field, event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-charcoal/15 bg-transparent p-3 text-sm normal-case tracking-normal outline-none focus:border-gold dark:border-white/15" />
                
                  </label>
              )}
              </div>
              <div className="mt-6 space-y-3">
                {[
              ['standard', 'Standard · 3–5 days', shipping],
              ['express', 'Express · 1–2 days', 499]].
              map(([id, label, cost]) =>
              <label
                key={String(id)}
                className="flex items-center justify-between rounded-xl border border-charcoal/15 p-4 dark:border-white/15">
                
                    <span>
                      <input
                    type="radio"
                    checked={draft.shippingMethod === id}
                    onChange={() =>
                    setDraft({
                      ...draft,
                      shippingMethod: id as 'standard' | 'express'
                    })
                    }
                    className="mr-3" />
                  
                      {label}
                    </span>
                    <span>{formatPrice(Number(cost))}</span>
                  </label>
              )}
              </div>
            </div>
          }
          {step === 2 &&
          <div>
              <h2 className="font-serif text-3xl">Payment</h2>
              <p className="mt-3 text-sm text-charcoal/60 dark:text-ivory/60">
                Choose a mock payment experience. No credentials or transaction
                are used in this build.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {payments.map((payment) =>
              <label
                key={payment.id}
                className={`rounded-xl border p-4 text-sm ${draft.paymentProvider === payment.id ? 'border-gold bg-gold/5' : 'border-charcoal/15 dark:border-white/15'}`}>
                
                    <input
                  type="radio"
                  checked={draft.paymentProvider === payment.id}
                  onChange={() =>
                  setDraft({
                    ...draft,
                    paymentProvider: payment.id
                  })
                  }
                  className="mr-2" />
                
                    {payment.label}
                  </label>
              )}
              </div>
              {draft.paymentProvider === 'stripe' &&
            <div className="mt-5 rounded-xl bg-beige p-4 text-sm dark:bg-white/5">
                  Card details placeholder — connect Stripe Elements using{' '}
                  <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in the future
                  adapter.
                </div>
            }
            </div>
          }
          {step === 3 &&
          <div>
              <h2 className="font-serif text-3xl">Review your ritual</h2>
              <div className="mt-6 rounded-2xl bg-beige p-5 text-sm dark:bg-white/5">
                <p className="font-medium">{draft.email}</p>
                <p className="mt-2 text-charcoal/60 dark:text-ivory/60">
                  {draft.address?.line1}, {draft.address?.city} ·{' '}
                  {draft.shippingMethod} delivery
                </p>
                <p className="mt-3 text-gold">
                  {
                payments.find((entry) => entry.id === draft.paymentProvider)?.
                label
                }
                </p>
              </div>
              <label className="mt-6 flex gap-3 rounded-xl border border-charcoal/15 p-4 text-sm dark:border-white/15">
                <input
                type="checkbox"
                checked={draft.usePoints}
                onChange={(event) =>
                setDraft({
                  ...draft,
                  usePoints: event.target.checked
                })
                } />
              {' '}
                Use 1,200 loyalty points (−$12.00)
              </label>
              <label className="mt-5 block text-xs uppercase tracking-luxe">
                Gift note
                <textarea
                value={draft.giftNote ?? ''}
                onChange={(event) =>
                setDraft({
                  ...draft,
                  giftNote: event.target.value
                })
                }
                className="mt-2 min-h-24 w-full rounded-xl border border-charcoal/15 bg-transparent p-3 text-sm normal-case tracking-normal outline-none dark:border-white/15"
                placeholder="A quiet note for someone you love." />
              
              </label>
            </div>
          }
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => step ? setStep(step - 1) : navigate('/cart')}
              className="text-xs uppercase tracking-luxe underline">
              
              Back
            </button>
            {step < 3 ?
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-xs uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal">
              
                Continue <ChevronRightIcon className="h-4 w-4" />
              </button> :

            <button
              disabled={processing}
              onClick={place}
              className="rounded-full bg-charcoal px-6 py-3 text-xs uppercase tracking-luxe text-ivory disabled:opacity-50 dark:bg-ivory dark:text-charcoal">
              
                {processing ?
              'Preparing order…' :
              `Place demo order · ${formatPrice(total)}`}
              </button>
            }
          </div>
        </section>
        <aside className="h-fit rounded-[2rem] bg-beige p-6 dark:bg-white/5">
          <h2 className="font-serif text-2xl">Order summary</h2>
          <div className="mt-5 space-y-4">
            {lines.map((line) =>
            <div key={line.productId} className="flex gap-3">
                <div
                className={`h-14 w-12 rounded-lg ${line.product.accent} p-1`}>
                
                  <img
                  src={line.product.image}
                  alt=""
                  className="h-full w-full object-contain" />
                
                </div>
                <p className="flex-1 text-sm">
                  {line.product.name} × {line.quantity}
                </p>
                <span className="text-sm">
                  {formatPrice(line.variant.price * line.quantity)}
                </span>
              </div>
            )}
          </div>
          <div className="mt-6 space-y-2 border-t border-charcoal/10 pt-5 text-sm dark:border-white/10">
            <p className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </p>
            <p className="flex justify-between">
              <span>Delivery</span>
              <span>{formatPrice(shipping)}</span>
            </p>
            {pointsDiscount > 0 &&
            <p className="flex justify-between text-gold">
                <span>Points</span>
                <span>−{formatPrice(pointsDiscount)}</span>
              </p>
            }
            <p className="flex justify-between pt-3 font-serif text-xl">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </p>
          </div>
        </aside>
      </div>
    </main>);

}