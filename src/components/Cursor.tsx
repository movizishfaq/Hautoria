import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
/**
 * A soft champagne-glow custom cursor with a trailing ring.
 * Disabled on touch / coarse pointer devices.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, {
    stiffness: 250,
    damping: 28,
    mass: 0.6
  });
  const ringY = useSpring(y, {
    stiffness: 250,
    damping: 28,
    mass: 0.6
  });
  const dotX = useSpring(x, {
    stiffness: 900,
    damping: 40
  });
  const dotY = useSpring(y, {
    stiffness: 900,
    damping: 40
  });
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement;
      setHovering(
        !!target.closest(
          'a, button, [data-cursor="hover"], input, [role="button"]'
        )
      );
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);
  if (!enabled) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Soft glow */}
      <motion.div
        style={{
          x: ringX,
          y: ringY
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2">
        
        <motion.div
          animate={{
            scale: hovering ? 2.6 : 1,
            opacity: hovering ? 0.28 : 0.16
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20
          }}
          className="h-16 w-16 rounded-full"
          style={{
            background:
            'radial-gradient(circle, rgba(200,169,106,0.9) 0%, rgba(248,221,230,0.4) 45%, transparent 70%)'
          }} />
        
      </motion.div>

      {/* Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2">
        
        <motion.div
          animate={{
            scale: hovering ? 1.8 : 1
          }}
          transition={{
            type: 'spring',
            stiffness: 250,
            damping: 22
          }}
          className="h-8 w-8 rounded-full border border-gold/70" />
        
      </motion.div>

      {/* Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2">
        
        <div className="h-1.5 w-1.5 rounded-full bg-charcoal" />
      </motion.div>
    </div>);

}