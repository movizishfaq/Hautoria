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
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-[3.25rem]',
  xl: 'h-16',
};

const wordmark: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'text-xl',
  md: 'text-[1.65rem] sm:text-[1.85rem]',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

const taglineSize: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'text-[0.48rem]',
  md: 'text-[0.52rem] sm:text-[0.55rem]',
  lg: 'text-[0.58rem]',
  xl: 'text-[0.62rem]',
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
        <span className="flex min-w-0 flex-col justify-center">
          <span
            className={`font-serif font-medium leading-none tracking-[-0.02em] text-charcoal dark:text-ivory ${wordmark[size]}`}
          >
            {appConfig.brandName}
          </span>
          {showTagline && (
            <span
              className={`mt-1.5 uppercase tracking-[0.22em] text-charcoal/45 dark:text-ivory/45 ${taglineSize[size]}`}
            >
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
