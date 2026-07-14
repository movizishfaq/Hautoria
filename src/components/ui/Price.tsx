import React from 'react';
export function Price({
  value,
  compareAtPrice,
  size = 'base'




}: {value: number;compareAtPrice?: number;size?: 'base' | 'lg';}) {
  return (
    <span
      className={
      size === 'lg' ?
      'font-serif text-3xl text-charcoal dark:text-ivory' :
      'font-serif text-lg text-charcoal dark:text-ivory'
      }>
      
      ${value.toFixed(2)}
      {compareAtPrice &&
      <del className="ml-2 text-sm text-charcoal/35 dark:text-ivory/35">
          ${compareAtPrice.toFixed(2)}
        </del>
      }
    </span>);

}