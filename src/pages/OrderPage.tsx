import React, { useState, createElement } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2Icon,
  DownloadIcon,
  MailIcon,
  MessageCircleIcon,
  PackageCheckIcon } from
'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { commerceService } from '../services/commerceService';
export function OrderPage({ success = false }: {success?: boolean;}) {
  const { orderId } = useParams();
  const { orders, notify } = useAppState();
  const [requested, setRequested] = useState(false);
  const order = orders.find((item) => item.id === orderId) || orders[0];
  if (!order)
  return (
    <main className="mx-auto max-w-5xl px-6 py-28">
        <EmptyState
        title="Order not found"
        body="Use your confirmation email or account area to find your order." />
      
      </main>);

  const download = () => {
    const blob = new Blob(
      [`Hautoria receipt\n${order.number}\nTotal: $${order.total.toFixed(2)}`],
      {
        type: 'text/plain'
      }
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${order.number}-receipt.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    notify('Receipt downloaded');
  };
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {success &&
      <div className="mb-10 rounded-[2rem] bg-sage p-7">
          <CheckCircle2Icon className="h-8 w-8 text-gold" />
          <p className="mt-4 text-[.62rem] uppercase tracking-luxe text-gold">
            Order confirmed
          </p>
          <h1 className="mt-2 font-serif text-4xl">Your ritual is reserved.</h1>
          <p className="mt-3 max-w-xl text-sm text-charcoal/65">
            A mock confirmation has been created locally. In production, the
            order adapter would trigger email, SMS, WhatsApp, and
            payment-confirmation workflows.
          </p>
        </div>
      }
      <div className="flex flex-col justify-between gap-6 border-b border-charcoal/10 pb-8 sm:flex-row dark:border-white/10">
        <div>
          <p className="text-[.62rem] uppercase tracking-luxe text-gold">
            Order {order.number}
          </p>
          <h1 className="mt-2 font-serif text-4xl">Track your delivery</h1>
          <p className="mt-2 text-sm text-charcoal/60 dark:text-ivory/60">
            Placed {order.createdAt} ·{' '}
            {order.trackingNumber ?? 'Tracking pending'}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <section>
          <ol className="border-l border-gold/50 pl-7">
            {order.events.map((event) =>
            <li key={event.label} className="relative pb-8">
                <span
                className={`absolute -left-[35px] top-1 h-4 w-4 rounded-full ${event.completed ? 'bg-gold' : 'border border-gold bg-ivory dark:bg-[#181818]'}`} />
              
                <p className="font-serif text-xl">{event.label}</p>
                <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
                  {event.description}
                </p>
                <p className="mt-1 text-xs text-charcoal/45 dark:text-ivory/45">
                  {event.date}
                </p>
              </li>
            )}
          </ol>
          <h2 className="mt-6 font-serif text-3xl">Your order</h2>
          <div className="mt-5 space-y-4">
            {order.items.map((item) =>
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-2xl bg-beige p-4 dark:bg-white/5">
              
                <img
                src={item.image}
                alt=""
                className="h-16 w-14 object-contain" />
              
                <p className="flex-1 text-sm">
                  {item.productName}
                  <span className="block text-charcoal/50 dark:text-ivory/50">
                    {item.variantName} · × {item.quantity}
                  </span>
                </p>
                <p>${(item.unitPrice * item.quantity).toFixed(2)}</p>
              </div>
            )}
          </div>
        </section>
        <aside className="h-fit rounded-[2rem] bg-beige p-6 dark:bg-white/5">
          <h2 className="font-serif text-2xl">Aftercare</h2>
          <div className="mt-5 space-y-3">
            <button
              onClick={download}
              className="flex w-full items-center gap-3 rounded-xl bg-ivory p-3 text-sm dark:bg-[#202020]">
              
              <DownloadIcon className="h-4 w-4 text-gold" /> Download receipt
            </button>
            <button
              onClick={async () => {
                await commerceService.sendInvoice(order.id);
                notify('Invoice email queued in demo');
              }}
              className="flex w-full items-center gap-3 rounded-xl bg-ivory p-3 text-sm dark:bg-[#202020]">
              
              <MailIcon className="h-4 w-4 text-gold" /> Email invoice
            </button>
            <button
              onClick={() =>
              notify('WhatsApp confirmation preview opened', 'info')
              }
              className="flex w-full items-center gap-3 rounded-xl bg-ivory p-3 text-sm dark:bg-[#202020]">
              
              <MessageCircleIcon className="h-4 w-4 text-gold" /> WhatsApp
              preview
            </button>
          </div>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setRequested(true);
              await commerceService.requestSupportAction(
                order.id,
                'return',
                'Requested in demo'
              );
            }}
            className="mt-6 border-t border-charcoal/10 pt-5 dark:border-white/10">
            
            <p className="text-xs uppercase tracking-luxe">Need help?</p>
            <select className="mt-3 w-full rounded-xl bg-ivory p-3 text-sm dark:bg-[#202020]">
              <option>Return request</option>
              <option>Refund request</option>
              <option>Cancellation request</option>
              <option>Exchange request</option>
            </select>
            <button className="mt-3 rounded-full border border-charcoal/20 px-4 py-2 text-xs uppercase tracking-luxe dark:border-white/20">
              Submit request
            </button>
            {requested &&
            <p className="mt-3 text-xs text-gold">
                Request received — our concierge will review it.
              </p>
            }
          </form>
          <Link
            to="/help"
            className="mt-6 flex items-center gap-2 text-xs uppercase tracking-luxe text-gold">
            
            <PackageCheckIcon className="h-4 w-4" /> Visit help center
          </Link>
        </aside>
      </div>
    </main>);

}