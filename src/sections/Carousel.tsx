import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SHOWCASE } from '../lib/data';
const LUXE = [0.22, 1, 0.36, 1] as const;
/**
 * Interactive curved carousel. Center product is largest; side products
 * recede, blur, and dim along an arc. Mouse-wheel + drag + arrows rotate.
 */
export function Carousel() {
  const [index, setIndex] = useState(0);
  const total = SHOWCASE.length;
  const ref = useRef<HTMLDivElement>(null);
  const wheelLock = useRef(false);
  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);
  // Mouse-wheel rotation (only while pointer is over the carousel)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 8) return;
      e.preventDefault();
      if (wheelLock.current) return;
      wheelLock.current = true;
      go(e.deltaY > 0 ? 1 : -1);
      setTimeout(() => wheelLock.current = false, 380);
    };
    el.addEventListener('wheel', onWheel, {
      passive: false
    });
    return () => el.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);
  return (
    <section className="relative w-full overflow-hidden bg-charcoal py-28 text-ivory lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-4 text-center">
          <Reveal>
            <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-luxe text-gold">
              The Collection
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-4xl font-light leading-tight sm:text-5xl lg:text-6xl">
              An <span className="italic text-gradient-gold">immersive</span>{' '}
              showcase
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-[0.62rem] uppercase tracking-luxe text-ivory/40">
              Scroll · Drag · Explore
            </p>
          </Reveal>
        </div>
      </div>

      <div
        ref={ref}
        className="relative mt-10 flex h-[420px] items-center justify-center [perspective:1600px] sm:h-[480px]">
        
        {/* soft ambient glow */}
        <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-gold/20 blur-3xl" />

        <motion.div
          className="relative h-full w-full"
          drag="x"
          dragConstraints={{
            left: 0,
            right: 0
          }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1);else
            if (info.offset.x > 60) go(-1);
          }}>
          
          {SHOWCASE.map((p, i) => {
            let offset = i - index;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
            const abs = Math.abs(offset);
            const isCenter = offset === 0;
            return (
              <motion.div
                key={p.id}
                className="absolute left-1/2 top-1/2 w-[240px] cursor-grab active:cursor-grabbing sm:w-[280px]"
                animate={{
                  x: `calc(-50% + ${offset * 46}%)`,
                  y: `calc(-50% + ${abs * 26}px)`,
                  z: -abs * 260,
                  rotateY: offset * -22,
                  scale: isCenter ? 1 : 0.82 - abs * 0.04,
                  opacity: abs > 2.4 ? 0 : 1 - abs * 0.16,
                  filter: `blur(${isCenter ? 0 : abs * 2.5}px)`
                }}
                transition={{
                  duration: 0.7,
                  ease: LUXE
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  zIndex: total - abs
                }}
                onClick={() => !isCenter && setIndex(i)}>
                
                <div className="relative flex flex-col items-center rounded-[1.75rem] bg-gradient-to-b from-white/10 to-white/[0.02] p-8 backdrop-blur-sm">
                  <img
                    src={p.image}
                    alt={`${p.name} — ${p.tagline}`}
                    className="h-64 w-auto object-contain sm:h-72"
                    draggable={false} />
                  
                  {/* Glass reflection */}
                  <div
                    aria-hidden
                    className="mt-2 h-16 w-2/3 scale-y-[-1] opacity-20 blur-[2px]"
                    style={{
                      maskImage:
                      'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)'
                    }}>
                    
                    <img
                      src={p.image}
                      alt=""
                      aria-hidden
                      className="h-full w-full object-contain" />
                    
                  </div>
                </div>
              </motion.div>);

          })}
        </motion.div>
      </div>

      {/* Center product label */}
      <div className="relative mt-6 flex flex-col items-center">
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            y: 14
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.6,
            ease: LUXE
          }}
          className="text-center">
          
          <h3 className="font-serif text-3xl font-light">
            {SHOWCASE[index].name}
          </h3>
          <p className="mt-1 text-[0.66rem] uppercase tracking-luxe text-ivory/50">
            {SHOWCASE[index].tagline} · ${SHOWCASE[index].price}
          </p>
        </motion.div>

        <div className="mt-8 flex items-center gap-6">
          <button
            aria-label="Previous product"
            onClick={() => go(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:border-gold hover:text-gold">
            
            <ChevronLeftIcon className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div className="flex gap-2">
            {SHOWCASE.map((_, i) =>
            <button
              key={i}
              aria-label={`Go to product ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ease-luxe ${i === index ? 'w-8 bg-gold' : 'w-1.5 bg-ivory/30'}`} />

            )}
          </div>
          <button
            aria-label="Next product"
            onClick={() => go(1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:border-gold hover:text-gold">
            
            <ChevronRightIcon className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>);

}