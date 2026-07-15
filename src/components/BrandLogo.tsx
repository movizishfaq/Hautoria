import React from 'react';
import { Link } from 'react-router-dom';
import { appConfig } from '../lib/config';

type BrandLogoProps = {
  to?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  /**
   * Full logo file already includes mark + “Hautoria” + tagline.
   * Use this in the main nav so text is not duplicated beside the image.
   */
  fullLockup?: boolean;
  showName?: boolean;
  showTagline?: boolean;
};

const mark: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-14',
  xl: 'h-16',
};

/** Full artwork heights (mark + wordmark + tagline in one PNG). */
const lockup: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'h-10',
  md: 'h-12 sm:h-14',
  lg: 'h-14 sm:h-16',
  xl: 'h-16 sm:h-[4.5rem]',
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
  fullLockup = false,
  showName = true,
  showTagline = false,
}: BrandLogoProps) {
  const content = fullLockup ? (
    <img
      src={appConfig.logoUrl}
      alt={`${appConfig.brandName} — ${appConfig.brandTagline}`}
      width={640}
      height={240}
      className={`${lockup[size]} w-auto max-w-[min(52vw,16rem)] object-contain object-left dark:brightness-0 dark:invert sm:max-w-[18rem] lg:max-w-[20rem] ${className}`.trim()}
    />
  ) : (
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
              className={`mt-1.5 uppercase tracking-[0.22em] text-gold ${taglineSize[size]}`}
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
