import React from 'react';
import { Link } from 'react-router-dom';
import { appConfig } from '../lib/config';

type BrandLogoProps = {
  to?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showName?: boolean;
  showTagline?: boolean;
};

const mark: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
  xl: 'h-16',
};

const wordmark: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'text-lg',
  md: 'text-[1.35rem]',
  lg: 'text-2xl',
  xl: 'text-3xl',
};

export function BrandLogo({
  to = '/',
  size = 'md',
  className = '',
  showName = true,
  showTagline = false,
}: BrandLogoProps) {
  const content = (
    <span className="inline-flex items-center gap-3 sm:gap-3.5">
      <img
        src={appConfig.logoUrl}
        alt=""
        width={320}
        height={120}
        className={`${mark[size]} w-auto shrink-0 object-contain object-center dark:brightness-0 dark:invert ${className}`.trim()}
      />
      {showName && (
        <span className="flex flex-col justify-center">
          <span
            className={`font-serif font-medium leading-none tracking-[-0.02em] text-charcoal dark:text-ivory ${wordmark[size]}`}
            style={{ transform: 'translateY(0.5px)' }}
          >
            {appConfig.brandName}
          </span>
          {showTagline && (
            <span className="mt-1 text-[0.5rem] uppercase tracking-[0.28em] text-charcoal/40 dark:text-ivory/40">
              {appConfig.brandTagline}
            </span>
          )}
        </span>
      )}
    </span>
  );

  if (!to) {
    return (
      <span
        role="img"
        aria-label={`${appConfig.brandName} — ${appConfig.brandTagline}`}
        className="inline-flex shrink-0"
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      to={to}
      aria-label={`${appConfig.brandName} — ${appConfig.brandTagline}`}
      className="inline-flex shrink-0 transition-opacity hover:opacity-85"
    >
      {content}
    </Link>
  );
}
