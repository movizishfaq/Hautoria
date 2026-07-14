import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
/**
 * Soft floating champagne particles for the cinematic hero.
 */
export function Particles({ count = 22 }: {count?: number;}) {
  const dots = useMemo(
    () =>
    Array.from({
      length: count
    }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 5,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 6,
      drift: (Math.random() - 0.5) * 40
    })),
    [count]
  );
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden">
      
      {dots.map((d, i) =>
      <motion.span
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${d.left}%`,
          top: `${d.top}%`,
          width: d.size,
          height: d.size,
          background:
          'radial-gradient(circle, rgba(200,169,106,0.9), rgba(248,221,230,0.3))'
        }}
        animate={{
          y: [0, -60, 0],
          x: [0, d.drift, 0],
          opacity: [0, 0.9, 0]
        }}
        transition={{
          duration: d.duration,
          delay: d.delay,
          repeat: Infinity,
          ease: 'easeInOut'
        }} />

      )}
    </div>);

}