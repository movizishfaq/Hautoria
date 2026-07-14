import React, { useState, createElement } from 'react';
import {
  DownloadIcon,
  PackageIcon,
  ShieldCheckIcon,
  UsersIcon } from
'lucide-react';
import {
  adminAnalytics,
  catalogProducts,
  inventory,
  demoOrders } from
'../lib/mockData';
import { adminService } from '../services/adminService';
import { useAppState } from '../hooks/useAppState';
import { StatusBadge } from '../components/ui/StatusBadge';
const sections = [
'Dashboard',
'Orders',
'Customers',
'Inventory',
'Coupons & gift cards',
'Reviews',
'Returns & refunds',
'Content & media',
'SEO',
'Roles & permissions'];

export function AdminPage() {
  const [section, setSection] = useState('Dashboard');
  const { notify } = useAppState();
  const download = async () => {
    const csv = await adminService.exportCsv(section);
    const blob = new Blob([csv], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hautoria-${section.toLowerCase().replaceAll(' ', '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify(`${section} CSV exported`);
  };
  return (
    <main className="min-h-screen bg-[#f4f1ec] dark:bg-[#151515]">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-charcoal/10 bg-charcoal p-6 text-ivory lg:min-h-screen lg:border-b-0 lg:border-r lg:border-white/10">
          <p className="font-serif text-2xl">
            Hautoria <span className="text-gold">/ Admin</span>
          </p>
          <p className="mt-2 text-xs text-ivory/45">
            Frontend workspace · mock data
          </p>
          <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col">
            {sections.map((item) =>
            <button
              key={item}
              onClick={() => setSection(item)}
              className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm ${section === item ? 'bg-white/10 text-gold' : 'text-ivory/65 hover:bg-white/5'}`}>
              
                {item}
              </button>
            )}
          </nav>
        </aside>
        <section className="p-6 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[.62rem] uppercase tracking-luxe text-gold">
                Operations
              </p>
              <h1 className="mt-2 font-serif text-4xl">{section}</h1>
            </div>
            <button
              onClick={download}
              className="flex items-center gap-2 rounded-full border border-charcoal/20 px-4 py-3 text-xs uppercase tracking-luxe dark:border-white/20">
              
              <DownloadIcon className="h-4 w-4" /> Export CSV
            </button>
          </div>
          {section === 'Dashboard' &&
          <>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
              [
              'Revenue',
              `$${adminAnalytics.revenue.toLocaleString()}`,
              '+14.2%'],

              ['Orders', adminAnalytics.orders, '+8.6%'],
              ['Customers', adminAnalytics.customers, '+11.4%'],
              ['Conversion', `${adminAnalytics.conversion}%`, '+0.7%']].
              map(([label, value, trend]) =>
              <div
                key={String(label)}
                className="rounded-2xl bg-ivory p-5 shadow-sm dark:bg-white/5">
                
                    <p className="text-xs uppercase tracking-luxe text-charcoal/45 dark:text-ivory/45">
                      {label}
                    </p>
                    <p className="mt-3 font-serif text-4xl">{value}</p>
                    <p className="mt-3 text-xs text-gold">
                      {trend} vs prior week
                    </p>
                  </div>
              )}
              </div>
              <div className="mt-6 rounded-[2rem] bg-ivory p-6 dark:bg-white/5">
                <h2 className="font-serif text-2xl">Seven-day revenue</h2>
                <div className="mt-8 flex h-52 items-end gap-3">
                  {adminAnalytics.series.map((entry) =>
                <div
                  key={entry.label}
                  className="flex flex-1 flex-col items-center gap-2">
                  
                      <div
                    className="w-full rounded-t-xl bg-gold/75"
                    style={{
                      height: `${entry.value / 160}px`
                    }} />
                  
                      <span className="text-[.62rem] uppercase tracking-luxe text-charcoal/50 dark:text-ivory/50">
                        {entry.label}
                      </span>
                    </div>
                )}
                </div>
              </div>
            </>
          }
          {section === 'Orders' &&
          <div className="mt-8 overflow-x-auto rounded-2xl bg-ivory dark:bg-white/5">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="border-b border-charcoal/10 text-xs uppercase tracking-luxe text-charcoal/45 dark:border-white/10 dark:text-ivory/45">
                  <tr>
                    <th className="p-5">Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {demoOrders.map((order) =>
                <tr
                  key={order.id}
                  className="border-b border-charcoal/10 dark:border-white/10">
                  
                      <td className="p-5 font-medium">{order.number}</td>
                      <td>Camille Laurent</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td>
                        <button
                      onClick={() =>
                      notify(`Opened ${order.number} detail drawer`)
                      }
                      className="text-gold">
                      
                          View
                        </button>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          }
          {section === 'Inventory' &&
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {inventory.map((item) => {
              const product = catalogProducts.find(
                (entry) => entry.id === item.productId
              );
              return (
                <div
                  key={item.sku}
                  className="flex items-center gap-4 rounded-2xl bg-ivory p-5 dark:bg-white/5">
                  
                    <img
                    src={product?.image}
                    alt=""
                    className="h-16 w-14 object-contain" />
                  
                    <div className="flex-1">
                      <p className="font-serif text-xl">{product?.name}</p>
                      <p className="text-xs text-charcoal/50 dark:text-ivory/50">
                        {item.sku} · Updated {item.updatedAt}
                      </p>
                    </div>
                    <span
                    className={`rounded-full px-3 py-1 text-xs ${item.stock <= item.threshold ? 'bg-blush' : 'bg-sage'}`}>
                    
                      {item.stock} in stock
                    </span>
                  </div>);

            })}
            </div>
          }
          {!['Dashboard', 'Orders', 'Inventory'].includes(section) &&
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <article className="rounded-[2rem] bg-ivory p-7 dark:bg-white/5">
                <ShieldCheckIcon className="h-7 w-7 text-gold" />
                <h2 className="mt-5 font-serif text-3xl">{section}</h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/60 dark:text-ivory/60">
                  A complete frontend management surface is prepared with typed
                  mock service contracts. Connect role-gated APIs before
                  publishing operational data.
                </p>
                <button
                onClick={() =>
                notify(`${section} mock editor opened`, 'info')
                }
                className="mt-6 rounded-full bg-charcoal px-5 py-3 text-xs uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal">
                
                  Open workspace
                </button>
              </article>
              <article className="rounded-[2rem] bg-beige p-7 dark:bg-white/5">
                <UsersIcon className="h-7 w-7 text-gold" />
                <h2 className="mt-5 font-serif text-3xl">
                  Integration handoff
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/60 dark:text-ivory/60">
                  Service adapters document the endpoint seams for this view,
                  exports, updates, and moderation actions.
                </p>
                <button
                onClick={download}
                className="mt-6 text-xs uppercase tracking-luxe text-gold underline">
                
                  Export sample data
                </button>
              </article>
            </div>
          }
        </section>
      </div>
    </main>);

}