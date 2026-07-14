import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';
import { useAdminTheme } from '../AdminThemeProvider';
import { ADMIN_NAV_GROUPS } from '../nav';
import { cn } from '../utils';
import { AdminInput } from './ui';
import { appConfig } from '../../lib/config';

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const Cmp = (Icons as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[name] || Icons.Circle;
  return <Cmp size={size} strokeWidth={1.5} />;
}

export function AdminShell() {
  const { user, loading, logout, isAuthenticated } = useAdminAuth();
  const { isDark, toggle } = useAdminTheme();
  const [q, setQ] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return ADMIN_NAV_GROUPS;
    return ADMIN_NAV_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.label.toLowerCase().includes(term)),
    })).filter((g) => g.items.length);
  }, [q]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--admin-bg)] text-[var(--admin-muted)]">
        Loading Hautoria Command Center...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const sidebar = (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-[var(--admin-border)] bg-[var(--admin-sidebar)] transition-all',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-[var(--admin-border)] p-4">
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-serif text-2xl leading-none tracking-tight text-[var(--admin-fg)]">
              {appConfig.brandName}
            </p>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">Admin</p>
          </div>
        )}
        {collapsed && (
          <p className="mx-auto font-serif text-xl text-[var(--admin-fg)]">H</p>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="hidden shrink-0 rounded-lg p-2 text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] lg:inline-flex"
        >
          <Icons.PanelLeft size={16} />
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 pb-1 pt-3">
          <AdminInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." />
        </div>
      )}

      <nav className="admin-scroll flex-1 space-y-5 overflow-y-auto px-2 py-3">
        {filtered.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[11px] text-[var(--admin-muted)]">{group.label}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  title={item.label}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                      isActive
                        ? 'bg-[var(--admin-accent)] text-white shadow-sm'
                        : 'text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-fg)]'
                    )
                  }
                >
                  <Icon name={item.icon} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--admin-border)] p-3">
        {!collapsed && (
          <>
            <p className="truncate text-sm text-[var(--admin-fg)]">{user?.name}</p>
            <p className="truncate text-[11px] text-[var(--admin-muted)]">{user?.email}</p>
          </>
        )}
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-2 flex items-center gap-2 text-sm text-[var(--admin-muted)] hover:text-[var(--admin-fg)]"
        >
          <Icons.LogOut size={14} /> {!collapsed && 'Sign out'}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[var(--admin-bg)] text-[var(--admin-fg)]">
      <div className="sticky top-0 hidden h-screen lg:block">{sidebar}</div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="absolute bottom-0 left-0 top-0 w-[260px]"
            >
              {sidebar}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-bg)]/85 px-4 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-[var(--admin-hover)] lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Icons.Menu size={18} />
            </button>
            <p className="hidden text-sm text-[var(--admin-muted)] sm:block">Store command center</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="rounded-lg p-2 text-[var(--admin-muted)] hover:bg-[var(--admin-hover)]"
              title="Toggle theme"
            >
              {isDark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-3.5 py-2 text-sm font-medium transition hover:border-amber-700/40 hover:text-amber-800"
            >
              <Icons.ExternalLink size={14} /> Live site
            </Link>
          </div>
        </header>
        <main className="admin-scroll flex-1 overflow-auto p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
