import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CheckCircle2Icon,
  MessageCircleIcon,
  ShieldCheckIcon } from
'lucide-react';
import { marketingService } from '../services/marketingService';
import { appConfig } from '../lib/config';
export function SupportPage() {
  const location = useLocation();
  const legal = location.pathname.startsWith('/legal');
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const title = legal ?
  location.pathname.includes('privacy') ?
  'Privacy, with care.' :
  location.pathname.includes('terms') ?
  'The fine details.' :
  'Shipping & returns, considered.' :
  'How can we care for you?';
  if (legal)
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
        <p className="text-[.62rem] uppercase tracking-luxe text-gold">
          Hautoria policy
        </p>
        <h1 className="mt-3 font-serif text-5xl">{title}</h1>
        <div className="mt-10 space-y-7 text-sm leading-relaxed text-charcoal/70 dark:text-ivory/70">
          <p>
            These frontend policy pages establish content structure for your
            legal review. Replace this demo copy with counsel-approved terms
            before launch.
          </p>
          <h2 className="font-serif text-2xl text-charcoal dark:text-ivory">
            Our commitment
          </h2>
          <p>
            We collect only the information necessary to provide a considered
            shopping experience, fulfill orders, and offer requested support.
            Operational data, payment details, and consent workflows require
            backend implementation.
          </p>
          <h2 className="font-serif text-2xl text-charcoal dark:text-ivory">
            Delivery & returns
          </h2>
          <p>
            Orders are prepared with care. Local mock flows demonstrate
            tracking, cancellation, exchange, and return-request experiences,
            which should connect to your selected fulfillment partner.
          </p>
        </div>
      </main>);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
      <p className="text-[.62rem] uppercase tracking-luxe text-gold">
        Concierge
      </p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">{title}</h1>
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="rounded-[2rem] bg-beige p-7 dark:bg-white/5">
          <h2 className="font-serif text-3xl">Send a note</h2>
          {sent ?
          <div className="mt-7 rounded-2xl bg-sage p-5">
              <CheckCircle2Icon className="h-6 w-6" />
              <p className="mt-3 font-medium">Your concierge ticket is open.</p>
              <p className="mt-2 text-sm">
                A mock ticket was created for this frontend; connect the support
                adapter to route this message.
              </p>
            </div> :

          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await marketingService.createContactTicket(form);
              setSent(true);
            }}
            className="mt-6 space-y-4">
            
              {(['name', 'email'] as const).map((field) =>
            <input
              key={field}
              type={field === 'email' ? 'email' : 'text'}
              required
              placeholder={field === 'name' ? 'Your name' : 'Email address'}
              value={form[field]}
              onChange={(event) =>
              setForm({
                ...form,
                [field]: event.target.value
              })
              }
              className="w-full rounded-xl bg-ivory p-4 text-sm outline-none dark:bg-[#202020]" />

            )}
              <textarea
              required
              value={form.message}
              onChange={(event) =>
              setForm({
                ...form,
                message: event.target.value
              })
              }
              placeholder="Tell us how we can help"
              className="min-h-36 w-full rounded-xl bg-ivory p-4 text-sm outline-none dark:bg-[#202020]" />
            
              <button className="rounded-full bg-charcoal px-6 py-3 text-xs uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal">
                Open ticket
              </button>
            </form>
          }
        </section>
        <section className="space-y-4">
          <div className="rounded-[2rem] border border-charcoal/10 p-7 dark:border-white/10">
            <ShieldCheckIcon className="h-7 w-7 text-gold" />
            <h2 className="mt-4 font-serif text-3xl">Help center</h2>
            <p className="mt-3 text-sm text-charcoal/60 dark:text-ivory/60">
              Explore ingredients, shipping, returns, and order-care essentials.
            </p>
            <Link
              to="/#faq"
              className="mt-5 inline-block text-xs uppercase tracking-luxe text-gold underline">
              
              Read common answers
            </Link>
          </div>
          <button
            onClick={() => {
              if (appConfig.whatsappNumber)
              window.open(
                `https://wa.me/${appConfig.whatsappNumber}`,
                '_blank'
              );else

              alert(
                'Add VITE_WHATSAPP_NUMBER to enable your WhatsApp handoff.'
              );
            }}
            className="flex w-full items-center gap-4 rounded-[2rem] bg-charcoal p-7 text-left text-ivory">
            
            <MessageCircleIcon className="h-7 w-7 text-gold" />
            <span>
              <span className="block font-serif text-2xl">
                WhatsApp concierge
              </span>
              <span className="mt-1 block text-sm text-ivory/60">
                {appConfig.whatsappNumber ?
                'Open secure handoff' :
                'Configure VITE_WHATSAPP_NUMBER to connect'}
              </span>
            </span>
          </button>
        </section>
      </div>
    </main>);

}