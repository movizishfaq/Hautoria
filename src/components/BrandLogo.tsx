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

const heights: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'h-8',
  md: 'h-11',
  lg: 'h-14',
  xl: 'h-20',
};

const nameSizes: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'text-base',
  md: 'text-xl',
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
    <span className="inline-flex items-center gap-3.5 sm:gap-4 lg:gap-5">
      <img
        src={appConfig.logoUrl}
        alt=""
        width={320}
        height={120}
        className={`${heights[size]} w-auto shrink-0 object-contain dark:brightness-0 dark:invert ${className}`.trim()}
      />
      {showName && (
        <span className="flex min-w-0 flex-col justify-center leading-none">
          <span
            className={`block font-serif font-medium tracking-tight text-charcoal dark:text-ivory ${nameSizes[size]}`}
          >
            {appConfig.brandName}
          </span>
          {showTagline && (
            <span className="mt-1 hidden text-[0.52rem] uppercase tracking-luxe text-charcoal/45 dark:text-ivory/45 sm:block">
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
        className="inline-flex shrink-0 items-center"
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      to={to}
      aria-label={`${appConfig.brandName} — ${appConfig.brandTagline}`}
      className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90"
    >
      {content}
    </Link>
  );
}
