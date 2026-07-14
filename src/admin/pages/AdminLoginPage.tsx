import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../AdminAuthContext';
import { AdminButton, AdminInput } from '../components/ui';
import { appConfig } from '../../lib/config';

export function AdminLoginPage() {
  const { login, isAuthenticated } = useAdminAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--admin-bg)] px-6">
      <div className="w-full max-w-md">
        <p className="mb-2 text-center text-[10px] uppercase tracking-[0.35em] text-[var(--admin-muted)]">
          {appConfig.brandName}
        </p>
        <h1 className="mb-2 text-center text-3xl font-semibold text-[var(--admin-fg)]">
          Command Center
        </h1>
        <p className="mb-8 text-center text-sm text-[var(--admin-muted)]">
          Enterprise admin — separate from the customer storefront
        </p>
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-8"
        >
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[var(--admin-muted)]">
              Email
            </label>
            <AdminInput
              type="email"
              required
              className="mt-1"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[var(--admin-muted)]">
              Password
            </label>
            <AdminInput
              type="password"
              required
              className="mt-1"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <AdminButton type="submit" className="w-full" disabled={busy}>
            {busy ? 'Signing in...' : 'Enter admin'}
          </AdminButton>
        </form>
        <Link
          to="/"
          className="mt-6 block text-center text-xs text-[var(--admin-muted)] hover:text-[var(--admin-fg)]"
        >
          Back to store
        </Link>
      </div>
    </div>
  );
}
