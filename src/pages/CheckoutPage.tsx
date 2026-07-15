import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckIcon, ChevronRightIcon, LockKeyholeIcon } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { useCatalog } from '../context/CatalogContext';
import { formatPrice } from '../lib/formatPrice';
import { commerceService } from '../services/commerceService';
import type {
  Address,
  CheckoutDraft,
  PaymentProvider } from
'../types/domain';

const DELIVERY_FEE = 250;

const emptyAddress: Address = {
  id: '',
  label: 'Home',
  firstName: '',
  lastName: '',
  line1: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Pakistan',
  phone: '',
  isDefault: true,
};

const payments: Array<{
  id: PaymentProvider;
  label: string;
}> = [
  { id: 'bank_transfer', label: 'Bank account' },
  { id: 'cod', label: 'Cash on delivery' },
  { id: 'jazzcash', label: 'JazzCash' },
];

const deliveryFields: Array<keyof Address> = [
  'firstName',
  'lastName',
  'line1',
  'city',
  'postalCode',
  'country',
  'phone',
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, user, addOrder, clearCart, notify } = useAppState();
  const { products } = useCatalog();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<CheckoutDraft>({
    email: '',
    address: emptyAddress,
    shippingMethod: 'standard',
    paymentProvider: 'cod',
    usePoints: false,
  });
  const [processing, setProcessing] = useState(false);

  const lines = cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    const variant = product?.variants.find((item) => item.id === line.variantId);
    return product && variant
      ? [{ ...line, product, variant }]
      : [];
  });

  const subtotal = lines.reduce(
    (sum, line) => sum + line.variant.price * line.quantity,
    0
  );
  const shipping = DELIVERY_FEE;
  const tax = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal + shipping + tax);

  const updateAddress = (field: keyof Address, value: string) =>
    setDraft((current) => ({
      ...current,
      address: {
        ...(current.address ?? emptyAddress),
        [field]: value,
      },
    }));

  const place = async () => {
    const addr = draft.address;
    const missing =
      !draft.email.includes('@') ||
      !addr?.firstName?.trim() ||
      !addr?.lastName?.trim() ||
      !addr?.line1?.trim() ||
      !addr?.city?.trim() ||
      !addr?.postalCode?.trim() ||
      !addr?.phone?.trim();
    if (missing) {
      notify('Complete contact and delivery details', 'error');
      setStep(0);
      return;
    }
    if (!lines.length) {
      notify('Your bag is empty or products failed to load. Refresh and try again.', 'error');
      return;
    }
    setProcessing(true);
    try {
      const created = await commerceService.createOrder(
        draft,
        lines.map((line) => ({
          productId: line.product.id,
          variantId: line.variant.id,
          quantity: line.quantity,
        }))
      );
      addOrder(created);
      clearCart();
      notify(`Order ${created.number} placed`, 'success');
      navigate(`/checkout/success/${created.id}`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Checkout failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (!lines.length) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-28 text-center">
        <h1 className="font-serif text-4xl">Your bag is empty.</h1>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-full bg-charcoal px-6 py-3 text-xs uppercase tracking-luxe text-ivory"
        >
          Return to shop
        </Link>
      </main>
    );
  }

  const steps = ['Contact', 'Delivery', 'Payment', 'Review'];
  const paymentLabel =
    payments.find((entry) => entry.id === draft.paymentProvider)?.label ?? '';

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
          <LockKeyholeIcon className="h-4 w-4 text-gold" /> Secure checkout
        </p>
      </div>

      <div className="mb-10 flex overflow-x-auto border-b border-charcoal/10 dark:border-white/10">
        {steps.map((label, index) => (
          <button
            key={label}
            onClick={() => index < step && setStep(index)}
            className={`flex shrink-0 items-center gap-2 px-4 py-4 text-[.62rem] uppercase tracking-luxe ${
              index === step
                ? 'border-b-2 border-gold text-charcoal dark:text-ivory'
                : 'text-charcoal/40 dark:text-ivory/40'
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full ${
                index < step
                  ? 'bg-gold'
                  : index === step
                    ? 'border border-gold'
                    : ''
              }`}
            >
              {index < step ? <CheckIcon className="h-3 w-3" /> : index + 1}
            </span>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_330px]">
        <section className="rounded-[2rem] border border-charcoal/10 bg-white/35 p-6 sm:p-8 dark:border-white/10 dark:bg-white/5">
          {step === 0 && (
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
                      email: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-charcoal/15 bg-transparent p-3 text-base normal-case tracking-normal outline-none focus:border-gold dark:border-white/15"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
              {user?.email &&
                !user.email.includes('example.com') &&
                !user.email.includes('hautoria.demo') &&
                user.id !== 'usr_demo' && (
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, email: user.email })}
                  className="mt-3 text-xs text-gold underline"
                >
                  Use my account email ({user.email})
                </button>
              )}
              <label className="mt-5 flex gap-3 text-sm">
                <input type="checkbox" defaultChecked /> Send me order updates
              </label>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-serif text-3xl">Delivery</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {deliveryFields.map((field) => (
                  <label
                    key={field}
                    className={`text-xs uppercase tracking-luxe ${
                      field === 'line1' ? 'sm:col-span-2' : ''
                    }`}
                  >
                    {field
                      .replace('line1', 'Address')
                      .replace('postalCode', 'Postal code')
                      .replace(/([A-Z])/g, ' $1')}
                    <input
                      value={String(draft.address?.[field] ?? '')}
                      onChange={(event) =>
                        updateAddress(field, event.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-charcoal/15 bg-transparent p-3 text-sm normal-case tracking-normal outline-none focus:border-gold dark:border-white/15"
                      autoComplete="off"
                    />
                  </label>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-charcoal/15 p-4 dark:border-white/15">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Delivery</p>
                    <p className="mt-1 text-xs text-charcoal/55 dark:text-ivory/55">
                      Shipped in 24 hours nationwide
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice(DELIVERY_FEE)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-serif text-3xl">Payment</h2>
              <p className="mt-3 text-sm text-charcoal/60 dark:text-ivory/60">
                Choose how you want to pay for this order.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {payments.map((payment) => (
                  <label
                    key={payment.id}
                    className={`rounded-xl border p-4 text-sm ${
                      draft.paymentProvider === payment.id
                        ? 'border-gold bg-gold/5'
                        : 'border-charcoal/15 dark:border-white/15'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={draft.paymentProvider === payment.id}
                      onChange={() =>
                        setDraft({
                          ...draft,
                          paymentProvider: payment.id,
                        })
                      }
                      className="mr-2"
                    />
                    {payment.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-serif text-3xl">Review your order</h2>
              <div className="mt-6 rounded-2xl bg-beige p-5 text-sm dark:bg-white/5">
                <p className="font-medium">{draft.email}</p>
                <p className="mt-2 text-charcoal/60 dark:text-ivory/60">
                  {draft.address?.line1}, {draft.address?.city} · Delivery{' '}
                  {formatPrice(DELIVERY_FEE)}
                </p>
                <p className="mt-3 text-gold">{paymentLabel}</p>
              </div>
              <label className="mt-5 block text-xs uppercase tracking-luxe">
                Gift note
                <textarea
                  value={draft.giftNote ?? ''}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      giftNote: event.target.value,
                    })
                  }
                  className="mt-2 min-h-24 w-full rounded-xl border border-charcoal/15 bg-transparent p-3 text-sm normal-case tracking-normal outline-none dark:border-white/15"
                  placeholder="A quiet note for someone you love."
                />
              </label>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => (step ? setStep(step - 1) : navigate('/cart'))}
              className="text-xs uppercase tracking-luxe underline"
            >
              Back
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-xs uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal"
              >
                Continue <ChevronRightIcon className="h-4 w-4" />
              </button>
            ) : (
              <button
                disabled={processing}
                onClick={place}
                className="rounded-full bg-charcoal px-6 py-3 text-xs uppercase tracking-luxe text-ivory disabled:opacity-50 dark:bg-ivory dark:text-charcoal"
              >
                {processing
                  ? 'Preparing order…'
                  : `Place order · ${formatPrice(total)}`}
              </button>
            )}
          </div>
        </section>

        <aside className="h-fit rounded-[2rem] bg-beige p-6 dark:bg-white/5">
          <h2 className="font-serif text-2xl">Order summary</h2>
          <div className="mt-5 space-y-4">
            {lines.map((line) => (
              <div key={line.productId} className="flex gap-3">
                <div className={`h-14 w-12 rounded-lg ${line.product.accent} p-1`}>
                  <img
                    src={line.product.image}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="flex-1 text-sm">
                  {line.product.name} × {line.quantity}
                </p>
                <span className="text-sm">
                  {formatPrice(line.variant.price * line.quantity)}
                </span>
              </div>
            ))}
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
            <p className="flex justify-between">
              <span>Tax (5%)</span>
              <span>{formatPrice(tax)}</span>
            </p>
            <p className="flex justify-between pt-3 font-serif text-xl">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
