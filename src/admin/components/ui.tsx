import React from 'react';
import { cn } from '../utils';

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl tracking-tight text-[var(--admin-fg)]">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--admin-muted)]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
  flush,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <div className={cn('rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)]', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-[var(--admin-border)] px-5 py-3.5">
          {title && <h2 className="font-serif text-lg text-[var(--admin-fg)]">{title}</h2>}
          {action}
        </div>
      )}
      <div className={flush ? '' : 'p-5'}>{children}</div>
    </div>
  );
}

export function AdminButton({
  children,
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}) {
  const styles = {
    primary: 'bg-[var(--admin-accent)] text-white hover:opacity-90',
    secondary:
      'border border-[var(--admin-border)] bg-[var(--admin-elevated)] text-[var(--admin-fg)] hover:bg-[var(--admin-hover)]',
    ghost: 'text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-fg)]',
    danger: 'bg-red-600 text-white hover:bg-red-500',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition disabled:opacity-50',
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-elevated)] px-3 py-2 text-sm text-[var(--admin-fg)] outline-none focus:border-[var(--admin-accent)]',
        props.className
      )}
    />
  );
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'rounded-xl border border-[var(--admin-border)] bg-[var(--admin-elevated)] px-3 py-2 text-sm text-[var(--admin-fg)] outline-none',
        props.className
      )}
    />
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
}) {
  const tones = {
    neutral: 'bg-[var(--admin-elevated)] text-[var(--admin-muted)]',
    success: 'bg-emerald-500/15 text-emerald-600',
    warning: 'bg-amber-500/15 text-amber-600',
    danger: 'bg-red-500/15 text-red-600',
    info: 'bg-sky-500/15 text-sky-600',
  };
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider',
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="py-16 text-center">
      <p className="font-medium text-[var(--admin-fg)]">{title}</p>
      {description && <p className="mt-1 text-sm text-[var(--admin-muted)]">{description}</p>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-[var(--admin-elevated)]', className)} />;
}
