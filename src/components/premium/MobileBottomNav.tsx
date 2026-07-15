import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, HeartIcon, ShoppingBagIcon, UserRoundIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';

export function MobileBottomNav() {
  const location = useLocation();
  const { cart, setCartOpen, setSearchOpen, setWishlistOpen } = useAppState();
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  const items = [
    { icon: HomeIcon, label: 'Home', to: '/' },
    { icon: SearchIcon, label: 'Search', action: () => setSearchOpen(true) },
    { icon: HeartIcon, label: 'Saved', action: () => setWishlistOpen(true) },
    { icon: ShoppingBagIcon, label: 'Bag', action: () => setCartOpen(true), badge: count },
    { icon: UserRoundIcon, label: 'Account', to: '/account' },
  ];

  if (location.pathname.startsWith('/checkout') || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-charcoal/10 glass pb-[env(safe-area-inset-bottom)] lg:hidden dark:glass-dark">
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-1.5">
        {items.map((item) => {
          const active = item.to === location.pathname;
          const Icon = item.icon;
          const inner = (
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 px-2 py-1.5 ${
                active ? 'text-gold' : 'text-charcoal/55 dark:text-ivory/55'
              }`}>
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[0.6rem] uppercase tracking-wide">{item.label}</span>
              {item.badge ? (
                <span className="absolute right-1 top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gold px-1 text-[8px] text-charcoal">
                  {item.badge}
                </span>
              ) : null}
            </motion.button>
          );

          return item.to ? (
            <Link key={item.label} to={item.to}>
              {inner}
            </Link>
          ) : (
            <div key={item.label} onClick={item.action}>
              {inner}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
