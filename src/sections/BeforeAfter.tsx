import React, { useCallback, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MoveHorizontalIcon } from 'lucide-react';
import { Reveal, RevealWords } from '../components/Reveal';
import { SKIN_IMG } from '../lib/data';
export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const update = useCallback((clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = (clientX - rect.left) / rect.width * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);
  const onDown = () => dragging.current = true;
  const onUp = () => dragging.current = false;
  const onMove = (e: React.MouseEvent) => {
    if (dragging.current) update(e.clientX);
  };
  const onTouch = (e: React.TouchEvent) => update(e.touches[0].clientX);
  return (
    <section className="relative w-full bg-beige py-28 lg:py-40">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-luxe text-gold">
              Proven Radiance
            </p>
          </Reveal>
          <h2 className="font-serif text-4xl font-light leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            <RevealWords text="See The" />{' '}
            <span className="italic">
              <RevealWords text="Transformation" delay={0.2} />
            </span>
          </h2>
        </div>

        <Reveal>
          <div className="rounded-[2rem] bg-white/60 p-3 shadow-[0_40px_90px_rgba(43,43,43,0.1)] backdrop-blur-sm">
            <div
              ref={ref}
              onMouseMove={onMove}
              onMouseUp={onUp}
              onMouseLeave={onUp}
              onTouchMove={onTouch}
              className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-[1.5rem] sm:aspect-[16/10]">
              
              {/* After (full) */}
              <img
                src={SKIN_IMG}
                alt="Radiant, glowing skin after using Hautoria"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false} />
              
              <span className="absolute bottom-5 right-5 rounded-full bg-white/80 px-4 py-1.5 text-[0.6rem] uppercase tracking-luxe text-charcoal backdrop-blur">
                After · 6 weeks
              </span>

              {/* Before (clipped, desaturated) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  width: `${pos}%`
                }}>
                
                <img
                  src={SKIN_IMG}
                  alt="Skin before using Hautoria"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    width: ref.current?.offsetWidth ?? '100%',
                    filter: 'grayscale(0.55) brightness(0.82) contrast(0.95)'
                  }}
                  draggable={false} />
                
                <span className="absolute bottom-5 left-5 rounded-full bg-charcoal/70 px-4 py-1.5 text-[0.6rem] uppercase tracking-luxe text-ivory backdrop-blur">
                  Before
                </span>
              </div>

              {/* Handle */}
              <div
                className="absolute inset-y-0 z-10 -ml-px w-0.5 bg-white/90"
                style={{
                  left: `${pos}%`
                }}>
                
                <motion.button
                  onMouseDown={onDown}
                  onTouchStart={onDown}
                  aria-label="Drag to compare before and after"
                  whileHover={{
                    scale: 1.1
                  }}
                  whileTap={{
                    scale: 0.95
                  }}
                  className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-charcoal shadow-lg">
                  
                  <MoveHorizontalIcon className="h-5 w-5" strokeWidth={1.5} />
                </motion.button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>);

}