import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2Icon,
  DownloadIcon,
  MailIcon,
  MessageCircleIcon,
  PackageCheckIcon,
} from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { commerceService } from '../services/commerceService';
import { userService } from '../services/userService';
import { isApiEnabled } from '../services/api';
import type { Order } from '../types/domain';
import { formatPrice } from '../lib/formatPrice';

export function OrderPage({ success = false }: { success?: boolean }) {
  const { orderId } = useParams();
  const { notify, addOrder } = useAppState();
  const [requested, setRequested] = useState(false);
  const [order, setOrder] = useState<Order | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      setLoading(true);
      try {
        if (isApiEnabled()) {
          const remote = await userService.getOrder(orderId);
          if (!active) return;
          if (remote) {
            setOrder(remote);
            addOrder(remote);
          } else {
            setOrder(undefined);
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [orderId, addOrder]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-28 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-28">
        <EmptyState
          title="Order not found"
          body="Use your confirmation email or account area to find your order."
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
      {success && (
        <div className="mb-10 rounded-[2rem] bg-sage p-7">
          <CheckCircle2Icon className="h-8 w-8 text-gold" />
          <p className="mt-4 text-[.62rem] uppercase tracking-luxe text-gold">
            Order confirmed
          </p>
          <h1 className="mt-2 font-serif text-4xl">Your ritual is reserved.</h1>
          <p className="mt-3 max-w-xl text-sm text-charcoal/65">
            Confirmation email and WhatsApp updates will follow each milestone of
            your delivery.
          </p>
        </div>
      )}
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
            {order.events.map((event) => (
              <li key={event.label} className="relative pb-8">
                <span
                  className={`absolute -left-[35px] top-1 h-4 w-4 rounded-full ${event.completed ? 'bg-gold' : 'border border-gold bg-ivory dark:bg-[#181818]'}`}
                />
                <p className="font-serif text-xl">{event.label}</p>
                <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
                  {event.description}
                </p>
                <p className="mt-1 text-xs uppercase tracking-luxe text-gold">
                  {event.date}
                </p>
              </li>
            ))}
          </ol>
        </section>
        <aside className="space-y-4">
          <div className="rounded-[2rem] bg-beige p-6 dark:bg-white/5">
            <h2 className="font-serif text-2xl">Summary</h2>
            <p className="mt-4 text-sm">
              Total <span className="float-right">{formatPrice(order.total)}</span>
            </p>
            <button
              onClick={async () => {
                await commerceService.sendInvoice(order.id);
                notify('Invoice download started');
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-charcoal/15 px-4 py-3 text-xs uppercase tracking-luxe dark:border-white/15"
            >
              <DownloadIcon className="h-4 w-4" /> Download invoice
            </button>
          </div>
          {!requested ? (
            <div className="rounded-[2rem] border border-charcoal/10 p-6 dark:border-white/10">
              <PackageCheckIcon className="h-6 w-6 text-gold" />
              <p className="mt-3 font-serif text-xl">Need help?</p>
              <p className="mt-2 text-sm text-charcoal/60 dark:text-ivory/60">
                Request a return, refund, or cancellation from your account team.
              </p>
              <button
                onClick={async () => {
                  await commerceService.requestSupportAction(
                    order.id,
                    'return',
                    'Customer requested return via order page'
                  );
                  setRequested(true);
                  notify('Return request submitted');
                }}
                className="mt-4 text-xs uppercase tracking-luxe text-gold underline"
              >
                Request return
              </button>
            </div>
          ) : (
            <p className="text-sm text-charcoal/60 dark:text-ivory/60">
              Your request is with our support team.
            </p>
          )}
          <Link
            to="/help"
            className="flex items-center gap-2 text-xs uppercase tracking-luxe text-charcoal/60 dark:text-ivory/60"
          >
            <MessageCircleIcon className="h-4 w-4" /> Contact support
          </Link>
          <a
            href={`mailto:support@hautoria.com?subject=Order%20${order.number}`}
            className="flex items-center gap-2 text-xs uppercase tracking-luxe text-charcoal/60 dark:text-ivory/60"
          >
            <MailIcon className="h-4 w-4" /> Email concierge
          </a>
        </aside>
      </div>
    </main>
  );
}
