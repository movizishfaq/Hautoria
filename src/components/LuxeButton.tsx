import React from 'react';
import { motion } from 'framer-motion';
import { Magnetic } from './Magnetic';
type Props = {
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
  onClick?: () => void;
  className?: string;
};
/**
 * Magnetic luxury CTA button with a sweeping champagne shine on hover.
 */
export function LuxeButton({
  children,
  variant = 'solid',
  onClick,
  className = ''
}: Props) {
  const base =
  'group relative overflow-hidden rounded-full px-9 py-4 text-[0.72rem] font-medium uppercase tracking-luxe transition-colors duration-500 ease-luxe';
  const solid = 'bg-charcoal text-ivory';
  const outline = 'border border-charcoal/30 text-charcoal hover:border-gold';
  return (
    <Magnetic strength={0.35}>
      <motion.button
        onClick={onClick}
        whileTap={{
          scale: 0.96
        }}
        className={`${base} ${variant === 'solid' ? solid : outline} ${className}`}>
        
        <span className="relative z-10">{children}</span>
        {variant === 'solid' &&
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold/60 to-transparent transition-transform duration-700 ease-luxe group-hover:translate-x-full" />
        }
        {variant === 'outline' &&
        <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gold/10 transition-transform duration-500 ease-luxe group-hover:scale-x-100" />
        }
      </motion.button>
    </Magnetic>);

}