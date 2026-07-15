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

const markBox: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-12 w-12 sm:h-14 sm:w-14',
  xl: 'h-16 w-16',
};

const wordmark: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'text-xl',
  md: 'text-2xl sm:text-[1.85rem]',
  lg: 'text-[1.85rem] sm:text-3xl',
  xl: 'text-4xl',
};

const taglineSize: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'text-[0.5rem]',
  md: 'text-[0.55rem] sm:text-[0.58rem]',
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
  // PNG is a tall lockup (art + name + tagline). Crop to the mark so HTML name stays readable.
  const content = (
    <span className="inline-flex items-center gap-3 sm:gap-3.5">
      <span className={`${markBox[size]} relative shrink-0 overflow-hidden rounded-sm`}>
        <img
          src={appConfig.logoUrl}
          alt=""
          width={320}
          height={320}
          className={`absolute inset-0 h-[220%] w-full object-cover object-top dark:brightness-0 dark:invert ${className}`.trim()}
        />
      </span>
      {showName && (
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
