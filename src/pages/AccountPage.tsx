import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BellIcon,
  CreditCardIcon,
  GiftIcon,
  HeartIcon,
  MapPinIcon,
  PackageIcon,
  SettingsIcon,
  UserRoundIcon } from
'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { catalogProducts } from '../lib/mockData';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/ui/StatusBadge';
const nav = [
['/account', 'Overview', UserRoundIcon],
['/account/orders', 'Orders', PackageIcon],
['/account/wishlist', 'Wishlist', HeartIcon],
['/account/addresses', 'Addresses', MapPinIcon],
['/account/payment-methods', 'Payment', CreditCardIcon],
['/account/loyalty', 'Loyalty', GiftIcon],
['/account/notifications', 'Notifications', BellIcon],
['/account/settings', 'Settings', SettingsIcon]];

export function AccountLayout() {
  const { user } = useAppState();
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
      <p className="text-[.62rem] uppercase tracking-luxe text-gold">
        My Hautoria
      </p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
        Hello, {user?.name.split(' ')[0] ?? 'there'}.
      </h1>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:mt-10 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit -mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
          <nav className="flex gap-2 lg:flex-col">
            {nav.map(([to, label, Icon]) =>
            <NavLink
              end={to === '/account'}
              key={to}
              to={to}
              className={({ isActive }) =>
              `flex min-h-[44px] shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm ${isActive ? 'bg-charcoal text-ivory dark:bg-ivory dark:text-charcoal' : 'hover:bg-beige dark:hover:bg-white/5'}`
              }>
              
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            )}
          </nav>
        </aside>
        <Outlet />
      </div>
    </main>);

}
export function AccountOverview() {
  const { user, orders, notifications } = useAppState();
  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-sage p-5">
          <p className="text-xs uppercase tracking-luxe">Loyalty points</p>
          <p className="mt-3 font-serif text-4xl">
            {user?.loyaltyPoints.toLocaleString()}
          </p>
          <Link to="/account/loyalty" className="mt-4 block text-xs underline">
            View rewards
          </Link>
        </div>
        <div className="rounded-2xl bg-blush p-5">
          <p className="text-xs uppercase tracking-luxe">Current tier</p>
          <p className="mt-3 font-serif text-4xl">{user?.tier}</p>
          <p className="mt-4 text-xs">$82 to Celeste</p>
        </div>
        <div className="rounded-2xl bg-beige p-5 dark:bg-white/5">
          <p className="text-xs uppercase tracking-luxe">Unread notes</p>
          <p className="mt-3 font-serif text-4xl">
            {notifications.filter((item) => !item.read).length}
          </p>
          <Link
            to="/account/notifications"
            className="mt-4 block text-xs underline">
            
            Read updates
          </Link>
        </div>
      </div>
      <h2 className="mt-10 font-serif text-3xl">Recent orders</h2>
      <div className="mt-5 space-y-3">
        {orders.slice(0, 3).map((order) =>
        <Link
          to={`/orders/${order.id}`}
          key={order.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-charcoal/10 p-5 dark:border-white/10">
          
            <div>
              <p className="font-serif text-xl">{order.number}</p>
              <p className="mt-1 text-sm text-charcoal/55 dark:text-ivory/55">
                {order.createdAt} · ${order.total.toFixed(2)}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </Link>
        )}
      </div>
    </section>);

}
export function AccountSection() {
  const { pathname } = useLocation();
  const { wishlist, cart, user, setUser, orders, notifications, notify } =
  useAppState();
  const [newAddress, setNewAddress] = useState(false);
  const label = pathname.split('/').pop() ?? '';
  if (label === 'wishlist') {
    const products = catalogProducts.filter((product) =>
    wishlist.some((item) => item.productId === product.id)
    );
    return (
      <section>
        <h2 className="font-serif text-3xl">Saved rituals</h2>
        {products.length ?
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {products.map((product) =>
          <Link
            to={`/products/${product.slug}`}
            key={product.id}
            className="flex gap-4 rounded-2xl bg-beige p-4 dark:bg-white/5">
            
                <img
              src={product.image}
              alt=""
              className="h-20 w-16 object-contain" />
            
                <div>
                  <p className="font-serif text-xl">{product.name}</p>
                  <p className="mt-2 text-sm">${product.price}</p>
                </div>
              </Link>
          )}
          </div> :

        <div className="mt-6">
            <EmptyState
            title="Nothing saved yet"
            body="Save formulas you would like to revisit." />
          
          </div>
        }
      </section>);

  }
  if (label === 'orders')
  return (
    <section>
        <h2 className="font-serif text-3xl">Order history</h2>
        <div className="mt-6 space-y-3">
          {orders.map((order) =>
        <Link
          to={`/orders/${order.id}`}
          key={order.id}
          className="flex items-center justify-between rounded-2xl border border-charcoal/10 p-5 dark:border-white/10">
          
              <div>
                <p className="font-serif text-xl">{order.number}</p>
                <p className="text-sm text-charcoal/55 dark:text-ivory/55">
                  {order.createdAt} · {order.items.length} items · $
                  {order.total.toFixed(2)}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </Link>
        )}
        </div>
      </section>);

  if (label === 'addresses')
  return (
    <section>
        <div className="flex justify-between">
          <h2 className="font-serif text-3xl">Saved addresses</h2>
          <button
          onClick={() => setNewAddress(!newAddress)}
          className="text-xs uppercase tracking-luxe text-gold">
          
            {newAddress ? 'Close' : 'Add address'}
          </button>
        </div>
        {newAddress &&
      <form
        onSubmit={(event) => {
          event.preventDefault();
          notify('Address saved locally');
          setNewAddress(false);
        }}
        className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-beige p-5 sm:grid-cols-2 dark:bg-white/5">
        
            {['Label', 'Address', 'City', 'Postal code'].map((entry) =>
        <input
          key={entry}
          required
          placeholder={entry}
          className="rounded-xl bg-ivory p-3 text-sm outline-none dark:bg-[#202020]" />

        )}
            <button className="rounded-full bg-charcoal px-5 py-3 text-xs uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal">
              Save address
            </button>
          </form>
      }
        <div className="mt-6 space-y-3">
          {user?.addresses.map((address) =>
        <div
          key={address.id}
          className="rounded-2xl border border-charcoal/10 p-5 dark:border-white/10">
          
              <p className="font-medium">
                {address.label}{' '}
                {address.isDefault &&
            <span className="ml-2 text-xs text-gold">Default</span>
            }
              </p>
              <p className="mt-2 text-sm text-charcoal/60 dark:text-ivory/60">
                {address.line1}, {address.city}, {address.postalCode}
                <br />
                {address.country}
              </p>
            </div>
        )}
        </div>
      </section>);

  if (label === 'payment-methods')
  return (
    <section>
        <h2 className="font-serif text-3xl">Payment methods</h2>
        <div className="mt-6 rounded-2xl border border-charcoal/10 p-5 dark:border-white/10">
          <p className="text-sm text-charcoal/60 dark:text-ivory/60">
            Saved cards are not required. Checkout supports bank transfer, JazzCash, and cash on delivery.
          </p>
        </div>
      </section>);

  if (label === 'loyalty')
  return (
    <section>
        <h2 className="font-serif text-3xl">Loyalty & birthday</h2>
        <div className="mt-6 rounded-[2rem] bg-sage p-7">
          <p className="text-xs uppercase tracking-luxe">{user?.tier} member</p>
          <p className="mt-3 font-serif text-5xl">
            {user?.loyaltyPoints.toLocaleString()} points
          </p>
          <p className="mt-4 max-w-md text-sm text-charcoal/65">
            Redeem 1,200 points for $12 off your next ritual. Add your birthday
            to unlock an annual gift.
          </p>
          <button
          onClick={() => notify('Birthday reward preference saved')}
          className="mt-6 rounded-full bg-charcoal px-5 py-3 text-xs uppercase tracking-luxe text-ivory">
          
            Set birthday reward
          </button>
        </div>
      </section>);

  if (label === 'notifications')
  return (
    <section>
        <h2 className="font-serif text-3xl">Notifications</h2>
        <div className="mt-6 space-y-3">
          {notifications.map((note) =>
        <article
          key={note.id}
          className="rounded-2xl border border-charcoal/10 p-5 dark:border-white/10">
          
              <p className="font-medium">{note.title}</p>
              <p className="mt-1 text-sm text-charcoal/60 dark:text-ivory/60">
                {note.body}
              </p>
              <p className="mt-3 text-xs text-gold">{note.createdAt}</p>
            </article>
        )}
        </div>
      </section>);

  if (label === 'settings')
  return (
    <section>
        <h2 className="font-serif text-3xl">Account settings</h2>
        <form
        onSubmit={(event) => {
          event.preventDefault();
          notify('Preferences saved locally');
        }}
        className="mt-6 space-y-5 rounded-2xl bg-beige p-6 dark:bg-white/5">
        
          <label className="block text-xs uppercase tracking-luxe">
            Email
            <input
            defaultValue={user?.email}
            className="mt-2 w-full border-b border-charcoal/20 bg-transparent py-3 text-base normal-case tracking-normal outline-none dark:border-white/20" />
          
          </label>
          <label className="flex gap-3 text-sm">
            <input type="checkbox" defaultChecked /> Email me ritual updates
          </label>
          <label className="flex gap-3 text-sm">
            <input type="checkbox" defaultChecked /> Product back-in-stock
            notices
          </label>
          <button className="rounded-full bg-charcoal px-5 py-3 text-xs uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal">
            Save preferences
          </button>
        </form>
      </section>);

  return (
    <section>
      <h2 className="font-serif text-3xl">Profile</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          notify('Profile saved locally');
        }}
        className="mt-6 rounded-2xl bg-beige p-6 dark:bg-white/5">
        
        <label className="block text-xs uppercase tracking-luxe">
          Name
          <input
            defaultValue={user?.name}
            className="mt-2 w-full border-b border-charcoal/20 bg-transparent py-3 text-base normal-case tracking-normal outline-none dark:border-white/20" />
          
        </label>
        <label className="mt-5 block text-xs uppercase tracking-luxe">
          Phone
          <input
            defaultValue={user?.phone}
            className="mt-2 w-full border-b border-charcoal/20 bg-transparent py-3 text-base normal-case tracking-normal outline-none dark:border-white/20" />
          
        </label>
        <button className="mt-6 rounded-full bg-charcoal px-5 py-3 text-xs uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal">
          Save profile
        </button>
      </form>
    </section>);

}