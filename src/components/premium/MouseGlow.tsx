import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function MouseGlow({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          left: sx,
          top: sy,
          background:
            'radial-gradient(circle, rgba(200,169,106,0.4) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
