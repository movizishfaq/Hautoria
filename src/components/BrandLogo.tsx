import React from 'react';
import { Link } from 'react-router-dom';
import { appConfig } from '../lib/config';

type BrandLogoProps = {
  to?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const heights: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'h-8',
  md: 'h-11',
  lg: 'h-14',
  xl: 'h-20',
};

export function BrandLogo({
  to = '/',
  size = 'md',
  className = '',
}: BrandLogoProps) {
  const image = (
    <img
      src={appConfig.logoUrl}
      alt={`${appConfig.brandName} — ${appConfig.brandTagline}`}
      width={320}
      height={120}
      className={`${heights[size]} w-auto object-contain dark:brightness-0 dark:invert ${className}`.trim()}
    />
  );

  if (!to) return image;

  return (
    <Link to={to} className="inline-flex shrink-0 transition-opacity hover:opacity-90">
      {image}
    </Link>
  );
}
