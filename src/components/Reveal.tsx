import React from 'react';
import { motion } from 'framer-motion';
const LUXE_EASE = [0.22, 1, 0.36, 1] as const;
/**
 * Reveal-on-scroll wrapper with luxury easing. Directional + staggerable.
 */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className = '',
  once = true






}: {children: React.ReactNode;delay?: number;y?: number;className?: string;once?: boolean;}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once,
        margin: '-80px'
      }}
      transition={{
        duration: 1,
        ease: LUXE_EASE,
        delay
      }}
      className={className}>
      
      {children}
    </motion.div>);

}
/**
 * Splits a heading into words that rise into place, one after another.
 */
export function RevealWords({
  text,
  className = '',
  delay = 0




}: {text: string;className?: string;delay?: number;}) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) =>
      <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
          className="inline-block"
          initial={{
            y: '110%'
          }}
          whileInView={{
            y: 0
          }}
          viewport={{
            once: true,
            margin: '-60px'
          }}
          transition={{
            duration: 0.9,
            ease: LUXE_EASE,
            delay: delay + i * 0.08
          }}>
          
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      )}
    </span>);

}