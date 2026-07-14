import React, { useEffect } from 'react';
import Lenis from 'lenis';
/**
 * Wraps the app in a Lenis-powered smooth-scroll context for silky,
 * luxury-easing scrolling. Respects reduced-motion preferences.
 */
export function SmoothScroll({ children }: {children: React.ReactNode;}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9
    });
    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}