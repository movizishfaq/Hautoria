import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  ShoppingBagIcon,
  SunIcon,
  UserRoundIcon,
  XIcon,
  ChevronDownIcon,
} from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { Magnetic } from '../Magnetic';
import { BrandLogo } from '../BrandLogo';

const megaMenu = [
  {
    title: 'Skincare',
    links: [
      { label: 'Serums', to: '/shop?category=serum' },
      { label: 'Moisturizers', to: '/shop?category=moisturizer' },
      { label: 'Cleansers', to: '/shop?category=cleanser' },
      { label: 'Treatments', to: '/shop?category=treatment' },
    ],
  },
  {
    title: 'Brands',
    links: [
      { label: 'The Ordinary', to: '/shop?q=ordinary' },
      { label: 'CeraVe', to: '/shop?q=cerave' },
      { label: 'COSRX', to: '/shop?q=cosrx' },
      { label: 'La Roche-Posay', to: '/shop?q=roche' },
      { label: 'MAC', to: '/shop?q=mac' },
      { label: 'Maybelline', to: '/shop?q=maybelline' },
      { label: 'Giorgio Armani', to: '/shop?q=giorgio' },
      { label: 'Dior', to: '/shop?q=dior' },
      { label: 'Chanel', to: '/shop?q=chanel' },
      { label: 'Axis-Y', to: '/shop?q=axis' },
      { label: 'Anua', to: '/shop?q=anua' },
    ],
  },
  {
    title: 'Makeup',
    links: [
      { label: 'Foundations', to: '/shop?q=foundation' },
      { label: 'Mascara', to: '/shop?q=mascara' },
      { label: 'Primers', to: '/shop?q=primer' },
    ],
  },
];

const links = [
  { label: 'Collections', to: '/#collections' },
  { label: 'Ritual Quiz', to: '/#quiz' },
  { label: 'About', to: '/help' },
];

export function PremiumNav() {
  const {
    cart,
    wishlist,
    setCartOpen,
    setWishlistOpen,
    setSearchOpen,
    theme,
    toggleTheme,
  } = useAppState();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const navigate = useNavigate();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-500 ${
          scrolled
            ? 'border-b border-charcoal/8 bg-ivory/90 shadow-[0_8px_40px_-24px_rgba(43,43,43,0.25)] backdrop-blur-xl dark:border-white/8 dark:bg-graphite/90'
            : 'border-b border-transparent bg-gradient-to-b from-ivory/70 to-transparent dark:from-graphite/50'
        }`}
      >
        <div className="mx-auto grid h-[4.75rem] max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 sm:h-[5.25rem] sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
          {/* Brand — left */}
          <div className="min-w-0 justify-self-start">
            <BrandLogo
              to="/"
              size="md"
              showName
              showTagline
              className="!h-10 sm:!h-11"
            />
          </div>

          {/* Links — center (desktop) */}
          <nav className="hidden items-center gap-7 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-[0.62rem] uppercase tracking-[0.22em] text-charcoal/65 transition-colors hover:text-charcoal dark:text-ivory/65 dark:hover:text-ivory"
              >
                Shop <ChevronDownIcon className="h-3 w-3 opacity-70" />
              </button>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22 }}
                    className="absolute left-1/2 top-full z-50 mt-5 w-[34rem] -translate-x-1/2 rounded-2xl border border-charcoal/8 bg-ivory/95 p-8 shadow-luxe backdrop-blur-xl dark:border-white/10 dark:bg-graphite/95"
                  >
                    <div className="grid grid-cols-3 gap-8">
                      {megaMenu.map((col) => (
                        <div key={col.title}>
                          <p className="mb-3 text-[0.55rem] uppercase tracking-[0.22em] text-gold">
                            {col.title}
                          </p>
                          <ul className="space-y-2">
                            {col.links.map((link) => (
                              <li key={link.to}>
                                <NavLink
                                  to={link.to}
                                  className="text-sm text-charcoal/70 transition-colors hover:text-gold dark:text-ivory/70"
                                >
                                  {link.label}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/shop"
                      className="mt-6 block text-center text-[0.58rem] uppercase tracking-[0.22em] text-gold"
                    >
                      View all products →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-[0.62rem] uppercase tracking-[0.22em] text-charcoal/65 transition-colors hover:text-charcoal dark:text-ivory/65 dark:hover:text-ivory"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions — right */}
          <div className="flex items-center justify-end gap-0.5 justify-self-end sm:gap-1">
            <Magnetic strength={0.22}>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal/75 transition-colors hover:bg-charcoal/[0.04] dark:text-ivory/75 dark:hover:bg-white/8"
              >
                <SearchIcon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.5} />
              </button>
            </Magnetic>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden h-11 w-11 items-center justify-center rounded-full text-charcoal/75 transition-colors hover:bg-charcoal/[0.04] sm:flex dark:text-ivory/75 dark:hover:bg-white/8"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.5} />
              ) : (
                <SunIcon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.5} />
              )}
            </button>
            <Link
              to="/account"
              aria-label="Account"
              className="hidden h-11 w-11 items-center justify-center rounded-full text-charcoal/75 transition-colors hover:bg-charcoal/[0.04] sm:flex dark:text-ivory/75 dark:hover:bg-white/8"
            >
              <UserRoundIcon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.5} />
            </Link>
            <Magnetic strength={0.22}>
              <button
                type="button"
                onClick={() => setWishlistOpen(true)}
                aria-label="Wishlist"
                className="relative hidden h-11 w-11 items-center justify-center rounded-full text-charcoal/75 transition-colors hover:bg-charcoal/[0.04] sm:flex dark:text-ivory/75 dark:hover:bg-white/8"
              >
                <HeartIcon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-gold" />
                )}
              </button>
            </Magnetic>
            <Magnetic strength={0.28}>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label="Cart"
                className="relative flex h-11 w-11 items-center justify-center rounded-full text-charcoal/75 transition-colors hover:bg-charcoal/[0.04] dark:text-ivory/75 dark:hover:bg-white/8"
              >
                <ShoppingBagIcon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-medium text-charcoal"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>
            </Magnetic>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal/80 lg:hidden dark:text-ivory/80"
            >
              <MenuIcon className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-charcoal/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col px-6 pb-10 pt-6 text-ivory">
              <div className="flex items-center justify-between">
                <BrandLogo
                  to="/"
                  size="md"
                  showName
                  showTagline
                  className="brightness-0 invert"
                />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close"
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                >
                  <XIcon strokeWidth={1.5} />
                </button>
              </div>
              <nav className="mt-14 flex flex-1 flex-col">
                {[
                  { label: 'Shop All', to: '/shop' },
                  { label: 'Serums', to: '/shop?category=serum' },
                  { label: 'Collections', to: '/#collections' },
                  { label: 'Account', to: '/account' },
                  { label: 'Wishlist', action: () => setWishlistOpen(true) },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (item.to) navigate(item.to);
                      else item.action?.();
                      setMenuOpen(false);
                    }}
                    className="border-b border-white/10 py-5 text-left font-serif text-[2rem] font-light tracking-tight"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <p className="text-[0.58rem] uppercase tracking-[0.28em] text-ivory/35">
                Crafted for Timeless Skin.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
