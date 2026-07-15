import React from 'react';
import { Link } from 'react-router-dom';
import { appConfig } from '../lib/config';

type BrandLogoProps = {
  to?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  /** Show HTML “Hautoria” next to the mark. Default true. */
  showName?: boolean;
  showTagline?: boolean;
};

/** Heights for the logo PNG shown with object-contain (no crop). */
const imgHeight: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'h-10',
  md: 'h-12',
  lg: 'h-[3.75rem] sm:h-[4.25rem]',
  xl: 'h-20',
};

const wordmark: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-[1.85rem] sm:text-3xl',
  xl: 'text-4xl',
};

const taglineSize: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'text-[0.5rem]',
  md: 'text-[0.55rem]',
  lg: 'text-[0.58rem] sm:text-[0.62rem]',
  xl: 'text-[0.65rem]',
};

export function BrandLogo({
  to = '/',
  size = 'md',
  className = '',
  showName = true,
  showTagline = false,
}: BrandLogoProps) {
  const mark = (
    <img
      src={appConfig.logoUrl}
      alt={showName ? '' : `${appConfig.brandName} — ${appConfig.brandTagline}`}
      width={480}
      height={480}
      className={`${imgHeight[size]} w-auto max-w-none object-contain object-center invert dark:invert-0 ${className}`.trim()}
    />
  );

  const content = showName ? (
    <span className="inline-flex items-center gap-3 sm:gap-3.5">
      {mark}
      <span className="flex min-w-0 flex-col justify-center">
        <span
          className={`font-serif font-medium leading-none tracking-[-0.02em] text-charcoal dark:text-ivory ${wordmark[size]}`}
        >
          {appConfig.brandName}
        </span>
        {showTagline && (
          <span
            className={`mt-1.5 font-sans uppercase tracking-[0.18em] text-gold ${taglineSize[size]}`}
          >
            {appConfig.brandTagline}
          </span>
        )}
      </span>
    </span>
  ) : (
    mark
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
      className="inline-flex shrink-0 items-center transition-opacity hover:opacity-85"
    >
      {content}
    </Link>
  );
}
