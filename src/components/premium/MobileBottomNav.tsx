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
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-charcoal/10 glass pb-safe lg:hidden dark:glass-dark">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {items.map((item) => {
          const active = item.to === location.pathname;
          const Icon = item.icon;
          const inner = (
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 ${
                active ? 'text-gold' : 'text-charcoal/55 dark:text-ivory/55'
              }`}>
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[0.5rem] uppercase tracking-luxe">{item.label}</span>
              {item.badge ? (
                <span className="absolute right-2 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[8px] text-charcoal">
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
