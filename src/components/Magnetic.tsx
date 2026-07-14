import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
/**
 * Wraps children so they magnetically drift toward the cursor on hover.
 */
export function Magnetic({
  children,
  strength = 0.4,
  className = ''




}: {children: React.ReactNode;strength?: number;className?: string;}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({
    x: 0,
    y: 0
  });
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setPos({
      x: relX * strength,
      y: relY * strength
    });
  };
  const reset = () =>
  setPos({
    x: 0,
    y: 0
  });
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{
        x: pos.x,
        y: pos.y
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        mass: 0.4
      }}
      className={className}>
      
      {children}
    </motion.div>);

}