import React, { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform } from
'framer-motion';
import { PlusIcon, DropletIcon } from 'lucide-react';
import { Reveal, RevealWords } from '../components/Reveal';
import { INGREDIENT_IMG, INGREDIENTS } from '../lib/data';
const LUXE = [0.22, 1, 0.36, 1] as const;
export function Ingredients() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const imgX = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), {
    stiffness: 80,
    damping: 20
  });
  const imgY = useSpring(useTransform(my, [-0.5, 0.5], [-16, 16]), {
    stiffness: 80,
    damping: 20
  });
  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  return (
    <section
      id="ingredients"
      className="relative w-full overflow-hidden bg-ivory py-28 lg:py-40">
      
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        {/* Left: copy */}
        <div className="order-2 lg:order-1">
          <Reveal>
            <p className="mb-5 text-[0.68rem] font-medium uppercase tracking-luxe text-gold">
              Rare Botanicals
            </p>
          </Reveal>
          <h2 className="font-serif text-4xl font-light leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            <RevealWords text="Nature," />
            <br />
            <span className="italic text-gradient-gold">
              <RevealWords text="Perfected." delay={0.2} />
            </span>
          </h2>
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-md text-base font-light leading-relaxed text-charcoal/60">
              Every drop is a symphony of cold-pressed oils, adaptogenic
              botanicals, and skin-identical lipids — sourced responsibly and
              proven to perform.
            </p>
          </Reveal>

          <div className="mt-10 space-y-1">
            {INGREDIENTS.map((ing, i) =>
            <Reveal key={ing.name} delay={0.1 * i}>
                <button
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group flex w-full items-center justify-between border-b border-charcoal/10 py-4 text-left">
                
                  <span className="font-serif text-xl font-light text-charcoal transition-colors group-hover:text-gold">
                    {ing.name}
                  </span>
                  <PlusIcon className="h-4 w-4 text-charcoal/40 transition-transform duration-500 ease-luxe group-hover:rotate-90 group-hover:text-gold" />
                </button>
              </Reveal>
            )}
          </div>
        </div>

        {/* Right: floating illustration + droplets + hotspots */}
        <div
          ref={ref}
          onMouseMove={onMove}
          className="relative order-1 flex items-center justify-center lg:order-2">
          
          <motion.div
            animate={{
              y: [0, -18, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              x: imgX,
              y: imgY
            }}
            className="relative">
            
            <div className="absolute inset-0 rounded-full bg-sage/50 blur-3xl" />
            <img
              src={INGREDIENT_IMG}
              alt="Fresh botanical skincare ingredients — green tea, rosehip, and water droplets"
              className="relative z-10 aspect-square w-full max-w-md rounded-[2.5rem] object-cover shadow-[0_40px_80px_rgba(43,43,43,0.12)]" />
            

            {/* Hotspots */}
            {INGREDIENTS.map((ing, i) =>
            <div
              key={ing.name}
              className="absolute z-20"
              style={{
                left: ing.x,
                top: ing.y
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}>
              
                <motion.span
                animate={{
                  scale: active === i ? 1.4 : 1
                }}
                className="relative flex h-5 w-5 items-center justify-center">
                
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/50" />
                  <span className="relative inline-flex h-3 w-3 rounded-full border border-white bg-gold" />
                </motion.span>

                <AnimatePresence>
                  {active === i &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                    scale: 0.9
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.9
                  }}
                  transition={{
                    duration: 0.35,
                    ease: LUXE
                  }}
                  className="glass absolute left-6 top-0 w-56 rounded-2xl p-4">
                  
                      <p className="font-serif text-base text-charcoal">
                        {ing.name}
                      </p>
                      <p className="mt-1 text-xs font-light leading-relaxed text-charcoal/60">
                        {ing.desc}
                      </p>
                    </motion.div>
                }
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Floating droplets */}
          {[
          {
            l: '-4%',
            t: '10%',
            d: 6
          },
          {
            l: '92%',
            t: '30%',
            d: 8
          },
          {
            l: '8%',
            t: '88%',
            d: 7
          }].
          map((dp, i) =>
          <motion.div
            key={i}
            aria-hidden
            className="absolute text-gold/50"
            style={{
              left: dp.l,
              top: dp.t
            }}
            animate={{
              y: [0, -14, 0],
              opacity: [0.4, 0.9, 0.4]
            }}
            transition={{
              duration: dp.d,
              repeat: Infinity,
              ease: 'easeInOut'
            }}>
            
              <DropletIcon className="h-6 w-6" strokeWidth={1} />
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}