import React from 'react';
/**
 * Soft moving aurora / liquid-gradient backdrop built from blurred solid
 * color blobs. Purely decorative — hidden from assistive tech.
 */
export function Aurora({ className = '' }: {className?: string;}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      
      <div className="absolute -left-1/4 top-0 h-[55vw] w-[55vw] rounded-full bg-blush/60 blur-3xl animate-aurora" />
      <div
        className="absolute right-0 top-1/4 h-[45vw] w-[45vw] rounded-full bg-sage/50 blur-3xl animate-aurora"
        style={{
          animationDelay: '-6s'
        }} />
      
      <div
        className="absolute bottom-0 left-1/3 h-[40vw] w-[40vw] rounded-full bg-gold/20 blur-3xl animate-aurora"
        style={{
          animationDelay: '-12s'
        }} />
      
    </div>);

}