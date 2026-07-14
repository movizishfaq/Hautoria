import React from 'react';
import { StarIcon } from 'lucide-react';
export function RatingStars({
  rating,
  count



}: {rating: number;count?: number;}) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="flex text-gold">
        {Array.from({
          length: 5
        }).map((_, index) =>
        <StarIcon
          key={index}
          className={`h-3.5 w-3.5 ${index < Math.round(rating) ? 'fill-current' : 'opacity-20'}`}
          strokeWidth={1.3} />

        )}
      </span>
      <span className="ml-1 text-charcoal/50 dark:text-ivory/50">
        {rating.toFixed(1)}
        {count ? ` (${count})` : ''}
      </span>
    </span>);

}