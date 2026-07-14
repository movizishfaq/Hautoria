import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  className = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = value / (duration / 16);
    const timer = window.setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        window.clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => window.clearInterval(timer);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
