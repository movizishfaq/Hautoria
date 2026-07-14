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
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-glass dark:glass-dark'
            : 'bg-transparent'
        }`}>
        <div className="relative mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between gap-4 px-5 lg:h-[4.25rem] lg:px-10">
          <BrandLogo
            to="/"
            size="md"
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 !h-14 sm:!h-16 lg:static lg:translate-x-0 lg:translate-y-0 lg:!h-11"
          />

          <nav className="hidden items-center gap-8 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}>
              <button className="flex items-center gap-1 text-[0.65rem] uppercase tracking-luxe text-charcoal/70 transition-colors hover:text-charcoal dark:text-ivory/70 dark:hover:text-ivory">
                Shop <ChevronDownIcon className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    className="absolute left-1/2 top-full z-50 mt-4 w-[520px] -translate-x-1/2 rounded-2xl glass p-8 shadow-luxe dark:glass-dark">
                    <div className="grid grid-cols-3 gap-8">
                      {megaMenu.map((col) => (
                        <div key={col.title}>
                          <p className="mb-4 text-[0.58rem] uppercase tracking-luxe text-gold">
                            {col.title}
                          </p>
                          <ul className="space-y-2">
                            {col.links.map((link) => (
                              <li key={link.to}>
                                <NavLink
                                  to={link.to}
                                  className="text-sm text-charcoal/75 transition-colors hover:text-gold dark:text-ivory/75">
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
                      className="mt-6 block text-center text-[0.62rem] uppercase tracking-luxe text-gold">
                      View all products →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {[
              { label: 'Collections', to: '/#collections' },
              { label: 'Ritual Quiz', to: '/#quiz' },
              { label: 'About', to: '/help' },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-[0.65rem] uppercase tracking-luxe text-charcoal/70 transition-colors hover:text-charcoal dark:text-ivory/70 dark:hover:text-ivory">
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="relative z-20 ml-auto flex items-center gap-1">
            <Magnetic strength={0.25}>
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="rounded-full p-2.5 transition-colors hover:bg-beige/80 dark:hover:bg-white/10">
                <SearchIcon className="h-4 w-4" />
              </button>
            </Magnetic>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden rounded-full p-2.5 transition-colors hover:bg-beige/80 dark:hover:bg-white/10 sm:block">
              {theme === 'light' ? (
                <MoonIcon className="h-4 w-4" />
              ) : (
                <SunIcon className="h-4 w-4" />
              )}
            </button>
            <Link
              to="/account"
              aria-label="Account"
              className="hidden rounded-full p-2.5 transition-colors hover:bg-beige/80 dark:hover:bg-white/10 sm:block">
              <UserRoundIcon className="h-4 w-4" />
            </Link>
            <Magnetic strength={0.25}>
              <button
                onClick={() => setWishlistOpen(true)}
                aria-label="Wishlist"
                className="relative hidden rounded-full p-2.5 transition-colors hover:bg-beige/80 dark:hover:bg-white/10 sm:block">
                <HeartIcon className="h-4 w-4" />
                {wishlist.length > 0 && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold" />
                )}
              </button>
            </Magnetic>
            <Magnetic strength={0.3}>
              <button
                onClick={() => setCartOpen(true)}
                aria-label="Cart"
                className="relative rounded-full p-2.5 transition-colors hover:bg-beige/80 dark:hover:bg-white/10">
                <ShoppingBagIcon className="h-4 w-4" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-charcoal">
                    {itemCount}
                  </motion.span>
                )}
              </button>
            </Magnetic>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
              className="rounded-full p-2.5 lg:hidden">
              <MenuIcon className="h-5 w-5" />
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
            className="fixed inset-0 z-[80] glass-dark lg:hidden">
            <div className="flex h-full flex-col p-6 text-ivory">
              <div className="flex justify-between">
                <BrandLogo to="/" size="md" className="brightness-0 invert" />
                <button onClick={() => setMenuOpen(false)} aria-label="Close">
                  <XIcon />
                </button>
              </div>
              <nav className="mt-12 flex flex-1 flex-col gap-1">
                {[
                  { label: 'Shop All', to: '/shop' },
                  { label: 'Serums', to: '/shop?category=serum' },
                  { label: 'Wishlist', action: () => setWishlistOpen(true) },
                  { label: 'Account', to: '/account' },
                ].map((item) =>
                  item.to ? (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.to!);
                        setMenuOpen(false);
                      }}
                      className="border-b border-white/10 py-5 text-left font-serif text-3xl">
                      {item.label}
                    </button>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action?.();
                        setMenuOpen(false);
                      }}
                      className="border-b border-white/10 py-5 text-left font-serif text-3xl">
                      {item.label}
                    </button>
                  )
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
