import React from 'react';
import { Link } from 'react-router-dom';
import { appConfig } from '../lib/config';

type BrandLogoProps = {
  to?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showName?: boolean;
  showTagline?: boolean;
  /** Stack logo above name (brand bar). Default: side-by-side. */
  stacked?: boolean;
};

const heights: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'h-8',
  md: 'h-11',
  lg: 'h-14',
  xl: 'h-[4.5rem]',
};

const nameSizes: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

export function BrandLogo({
  to = '/',
  size = 'md',
  className = '',
  showName = true,
  showTagline = false,
  stacked = false,
}: BrandLogoProps) {
  const content = stacked ? (
    <span className="inline-flex flex-col items-center gap-2 text-center">
      <img
        src={appConfig.logoUrl}
        alt=""
        width={320}
        height={120}
        className={`${heights[size]} w-auto object-contain object-center dark:brightness-0 dark:invert ${className}`.trim()}
      />
      {showName && (
        <span className="flex flex-col items-center">
          <span
            className={`font-serif font-medium leading-none tracking-tight text-charcoal dark:text-ivory ${nameSizes[size]}`}
          >
            {appConfig.brandName}
          </span>
          {showTagline && (
            <span className="mt-1.5 text-[0.55rem] uppercase tracking-luxe text-charcoal/45 dark:text-ivory/45">
              {appConfig.brandTagline}
            </span>
          )}
        </span>
      )}
    </span>
  ) : (
    <span className="inline-flex items-center gap-4 sm:gap-5">
      <img
        src={appConfig.logoUrl}
        alt=""
        width={320}
        height={120}
        className={`${heights[size]} w-auto shrink-0 object-contain object-center dark:brightness-0 dark:invert ${className}`.trim()}
      />
      {showName && (
        <span
          className={`flex ${heights[size]} flex-col justify-center leading-none`}
        >
          <span
            className={`font-serif font-medium leading-none tracking-tight text-charcoal dark:text-ivory ${nameSizes[size]}`}
          >
            {appConfig.brandName}
          </span>
          {showTagline && (
            <span className="mt-1.5 text-[0.52rem] uppercase tracking-luxe text-charcoal/45 dark:text-ivory/45">
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
