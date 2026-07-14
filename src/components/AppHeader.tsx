import React, { useState, Component } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  ShoppingBagIcon,
  SunIcon,
  UserRoundIcon,
  XIcon } from
'lucide-react';
import { useAppState } from '../hooks/useAppState';
const links = [
{
  label: 'Shop',
  to: '/shop'
},
{
  label: 'Ritual finder',
  to: '/shop?concern=hydration'
},
{
  label: 'Ingredients',
  to: '/#ingredients'
},
{
  label: 'VIP Club',
  to: '/#membership'
}];

export function AppHeader() {
  const { cart, wishlist, setCartOpen, theme, toggleTheme } = useAppState();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-ivory/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#181818]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-10">
        <Link to="/" className="font-serif text-2xl tracking-tight">
          Hautoria
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) =>
          <NavLink
            key={link.to}
            to={link.to}
            className="text-[.65rem] uppercase tracking-luxe text-charcoal/70 transition-colors hover:text-charcoal dark:text-ivory/70 dark:hover:text-ivory">
            
              {link.label}
            </NavLink>
          )}
        </nav>
        <form
          onSubmit={submit}
          className="hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-charcoal/10 px-4 py-2 lg:flex dark:border-white/15">
          
          <SearchIcon className="h-4 w-4 text-charcoal/45 dark:text-ivory/45" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search Hautoria"
            placeholder="Search products"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-charcoal/35 dark:placeholder:text-ivory/35" />
          
        </form>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="hidden rounded-full p-2.5 hover:bg-beige dark:hover:bg-white/10 sm:block">
            
            {theme === 'light' ?
            <MoonIcon className="h-4 w-4" /> :

            <SunIcon className="h-4 w-4" />
            }
          </button>
          <Link
            to="/account"
            aria-label="Account"
            className="hidden rounded-full p-2.5 hover:bg-beige dark:hover:bg-white/10 sm:block">
            
            <UserRoundIcon className="h-4 w-4" />
          </Link>
          <Link
            to="/account/wishlist"
            aria-label="Wishlist"
            className="hidden rounded-full p-2.5 hover:bg-beige dark:hover:bg-white/10 sm:block">
            
            <HeartIcon className="h-4 w-4" />
            <span className="sr-only">{wishlist.length} saved products</span>
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open shopping bag"
            className="relative rounded-full p-2.5 hover:bg-beige dark:hover:bg-white/10">
            
            <ShoppingBagIcon className="h-4 w-4" />
            {itemCount > 0 &&
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] text-charcoal">
                {itemCount}
              </span>
            }
          </button>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-full p-2.5 lg:hidden">
            
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open &&
      <div className="fixed inset-0 z-[70] bg-ivory p-6 dark:bg-[#181818] lg:hidden">
          <div className="flex justify-between">
            <Link
            to="/"
            onClick={() => setOpen(false)}
            className="font-serif text-2xl">
            
              Hautoria
            </Link>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <XIcon />
            </button>
          </div>
          <form
          onSubmit={(event) => {
            submit(event);
            setOpen(false);
          }}
          className="mt-10 flex border-b border-charcoal/15 py-3 dark:border-white/15">
          
            <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full bg-transparent text-lg outline-none"
            placeholder="Search" />
          
            <SearchIcon />
          </form>
          <nav className="mt-8 space-y-2">
            {[
          ...links,
          {
            label: 'My account',
            to: '/account'
          },
          {
            label: 'Wishlist',
            to: '/account/wishlist'
          }].
          map((link) =>
          <NavLink
            key={link.to}
            onClick={() => setOpen(false)}
            to={link.to}
            className="block border-b border-charcoal/10 py-5 font-serif text-3xl dark:border-white/10">
            
                {link.label}
              </NavLink>
          )}
          </nav>
        </div>
      }
    </header>);

}