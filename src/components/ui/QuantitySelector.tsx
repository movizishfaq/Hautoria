import React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
export function QuantitySelector({
  value,
  onChange,
  max = 99




}: {value: number;onChange: (value: number) => void;max?: number;}) {
  return (
    <div className="inline-flex items-center rounded-full border border-charcoal/15 dark:border-white/15">
      <button
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="p-3">
        
        <MinusIcon className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm">{value}</span>
      <button
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="p-3">
        
        <PlusIcon className="h-3.5 w-3.5" />
      </button>
    </div>);

}