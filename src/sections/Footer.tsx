import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  ArrowRightIcon,
  CheckIcon } from
'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal, RevealWords } from '../components/Reveal';
import { Magnetic } from '../components/Magnetic';
import { BrandLogo } from '../components/BrandLogo';
import { appConfig } from '../lib/config';
const LUXE = [0.22, 1, 0.36, 1] as const;
const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', to: '/shop' },
      { label: 'Serums', to: '/shop?category=serum' },
      { label: 'Moisturizers', to: '/shop?category=moisturizer' },
      { label: 'Cleansers', to: '/shop?category=cleanser' },
      { label: 'Treatments', to: '/shop?category=treatment' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Our Story', to: '/#story' },
      { label: 'Ingredients', to: '/shop' },
      { label: 'Journal', to: '/shop' },
      { label: 'Membership', to: '/#membership' },
    ],
  },
  {
    title: 'Care',
    links: [
      { label: 'Contact', to: '/help' },
      { label: 'Shipping', to: '/legal/shipping' },
      { label: 'Returns', to: '/legal/shipping' },
      { label: 'FAQ', to: '/#faq' },
      { label: 'Privacy', to: '/legal/privacy' },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setEmail('');
    }, 2600);
  };
  return (
    <footer className="relative w-full overflow-hidden bg-charcoal pt-24 text-ivory">
      {/* Newsletter */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 border-b border-ivory/10 pb-20 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl font-light leading-tight sm:text-5xl lg:text-6xl">
              <RevealWords text="Let's stay" />
              <br />
              <span className="italic text-gradient-gold">
                <RevealWords text="in touch." delay={0.2} />
              </span>
            </h2>
            <Reveal delay={0.3}>
              <p className="mt-5 max-w-sm text-sm font-light text-ivory/50">
                Join the list for early access, rituals, and 10% off your first
                order.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="flex items-end">
            <form onSubmit={submit} className="w-full">
              <label className="mb-3 block text-[0.62rem] uppercase tracking-luxe text-ivory/40">
                Email Address
              </label>
              <div className="group relative flex items-center border-b border-ivory/25 py-3 transition-colors focus-within:border-gold">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-lg font-light text-ivory placeholder:text-ivory/30 focus:outline-none" />
                
                <Magnetic strength={0.4}>
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gold text-charcoal transition-transform">
                    
                    <AnimatePresence mode="wait">
                      {sent ?
                      <motion.span
                        key="check"
                        initial={{
                          scale: 0
                        }}
                        animate={{
                          scale: 1
                        }}
                        exit={{
                          scale: 0
                        }}>
                        
                          <CheckIcon className="h-4 w-4" strokeWidth={2} />
                        </motion.span> :

                      <motion.span
                        key="arrow"
                        initial={{
                          scale: 0
                        }}
                        animate={{
                          scale: 1
                        }}
                        exit={{
                          scale: 0
                        }}>
                        
                          <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
                        </motion.span>
                      }
                    </AnimatePresence>
                  </button>
                </Magnetic>
              </div>
              <AnimatePresence>
                {sent &&
                <motion.p
                  initial={{
                    opacity: 0,
                    y: 6
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  exit={{
                    opacity: 0
                  }}
                  className="mt-3 text-xs text-gold">
                  
                    Welcome to Hautoria — check your inbox.
                  </motion.p>
                }
              </AnimatePresence>
            </form>
          </Reveal>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <BrandLogo to="/" size="lg" className="brightness-0 invert" />
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-ivory/50">
              Premium authentic skincare and cosmetics — curated for results that
              endure.
            </p>
            <div className="mt-6 flex gap-3">
              {[InstagramIcon, TwitterIcon, FacebookIcon].map((Icon, i) =>
              <Magnetic key={i} strength={0.4}>
                  <a
                  href="#"
                  aria-label="Social link"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:border-gold hover:text-gold">
                  
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                </Magnetic>
              )}
            </div>
          </div>

          {FOOTER_LINKS.map((col) =>
          <div key={col.title}>
              <h3 className="mb-5 text-[0.62rem] uppercase tracking-luxe text-ivory/40">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((l) =>
              <li key={l.label}>
                    <Link
                  to={l.to}
                  className="group relative inline-block text-sm font-light text-ivory/70 transition-colors hover:text-ivory">
                  
                      {l.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-500 ease-luxe group-hover:w-full" />
                    </Link>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Giant editorial wordmark */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40
        }}
        whileInView={{
          opacity: 1,
          y: 0
        }}
        viewport={{
          once: true
        }}
        transition={{
          duration: 1.2,
          ease: LUXE
        }}
        className="select-none px-4 text-center">
        
        <span className="block font-serif text-[19vw] font-light leading-none tracking-tight text-ivory/[0.06]">
          Hautoria
        </span>
      </motion.div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-ivory/10 px-6 py-8 text-[0.62rem] uppercase tracking-luxe text-ivory/40 sm:flex-row lg:px-10">
        <p>© {new Date().getFullYear()} {appConfig.brandName} · {appConfig.brandTagline}</p>
        <div className="flex gap-6">
          <Link to="/legal/privacy" className="transition-colors hover:text-ivory">
            Privacy
          </Link>
          <Link to="/legal/terms" className="transition-colors hover:text-ivory">
            Terms
          </Link>
        </div>
      </div>
    </footer>);

}