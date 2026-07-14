import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4
  });
  return (
    <motion.div
      style={{
        scaleX
      }}
      className="fixed left-0 top-0 z-[70] h-0.5 w-full origin-left bg-gold"
      aria-hidden />);


}