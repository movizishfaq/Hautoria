import React from 'react';
import { formatPrice } from '../../lib/formatPrice';

export function Price({
  value,
  compareAtPrice,
  size = 'base'
}: {
  value: number;
  compareAtPrice?: number;
  size?: 'base' | 'lg';
}) {
  return (
    <span
      className={
        size === 'lg'
          ? 'font-serif text-3xl text-charcoal dark:text-ivory'
          : 'font-serif text-lg text-charcoal dark:text-ivory'
      }>
      {formatPrice(value)}
      {compareAtPrice && compareAtPrice > value && (
        <del className="ml-2 text-sm text-charcoal/35 dark:text-ivory/35">
          {formatPrice(compareAtPrice)}
        </del>
      )}
    </span>
  );
}
