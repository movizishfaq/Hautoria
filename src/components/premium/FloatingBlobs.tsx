import React from 'react';
import { motion } from 'framer-motion';

export function FloatingBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-blush/40 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -50, 30, 0], y: [0, 40, -20, 0], scale: [1, 0.9, 1.05, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-gold/15 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 25, -35, 0], y: [0, -20, 35, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-sage/30 blur-3xl"
      />
    </div>
  );
}
