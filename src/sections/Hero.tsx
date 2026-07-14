import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring } from
'framer-motion';
import { LeafIcon, ArrowDownIcon } from 'lucide-react';
import { Aurora } from '../components/Aurora';
import { Particles } from '../components/Particles';
import { LuxeButton } from '../components/LuxeButton';
import { RevealWords } from '../components/Reveal';
import { HERO_BOTTLE } from '../lib/data';
const LUXE = [0.22, 1, 0.36, 1] as const;
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });
  const bottleY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const bottleScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  // Cursor parallax for floating leaves + bottle tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 120,
    damping: 20
  });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 20
  });
  const leafX = useSpring(useTransform(mx, [-0.5, 0.5], [-30, 30]), {
    stiffness: 60,
    damping: 20
  });
  const leafY = useSpring(useTransform(my, [-0.5, 0.5], [-20, 20]), {
    stiffness: 60,
    damping: 20
  });
  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={handleMouse}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-ivory pt-24">
      
      <Aurora />
      <Particles count={26} />

      {/* Luxury light rays */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[120%] w-[60%] -translate-x-1/2 opacity-60"
        style={{
          background:
          'conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(255,255,255,0.7) 20deg, transparent 40deg, rgba(200,169,106,0.15) 60deg, transparent 80deg)',
          filter: 'blur(20px)'
        }} />
      

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-2 lg:px-10">
        {/* Left copy */}
        <motion.div
          style={{
            y: textY,
            opacity: fade
          }}
          className="order-2 lg:order-1">
          
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 1,
              ease: LUXE,
              delay: 0.2
            }}
            className="mb-6 flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-luxe text-gold">
            
            <span className="h-px w-10 bg-gold" />
            Ultra·Luxe Botanique
          </motion.p>

          <h1 className="font-serif text-[13vw] font-light leading-[0.95] tracking-tight text-charcoal sm:text-6xl lg:text-[4.6rem]">
            <RevealWords text="Reveal The Skin" />
            <br />
            <span className="italic text-gradient-gold">
              <RevealWords text="You Were Born" delay={0.3} />
            </span>
            <br />
            <RevealWords text="To Love." delay={0.6} />
          </h1>

          <motion.p
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              duration: 1.2,
              delay: 1
            }}
            className="mt-8 max-w-md text-base font-light leading-relaxed text-charcoal/60">
            
            Rare botanicals, cinematic textures, and quiet science — crafted for
            the ritual of becoming your most luminous self.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 1,
              ease: LUXE,
              delay: 1.2
            }}
            className="mt-10 flex flex-wrap items-center gap-4">
            
            <LuxeButton onClick={() => navigate('/shop')}>
              Shop Collection
            </LuxeButton>
            <LuxeButton
              variant="outline"
              onClick={() =>
              document.getElementById('quiz')?.scrollIntoView({
                behavior: 'smooth'
              })
              }>
              
              Discover Your Routine
            </LuxeButton>
          </motion.div>
        </motion.div>

        {/* Right — rotating glowing bottle */}
        <motion.div
          style={{
            y: bottleY,
            scale: bottleScale
          }}
          className="relative order-1 flex items-center justify-center lg:order-2">
          
          {/* Glow halo */}
          <motion.div
            aria-hidden
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute h-[70%] w-[70%] rounded-full bg-blush/70 blur-3xl" />
          

          {/* Floating botanical leaves */}
          <motion.div
            style={{
              x: leafX,
              y: leafY
            }}
            className="absolute inset-0"
            aria-hidden>
            
            <motion.div
              animate={{
                y: [0, -18, 0],
                rotate: [0, 8, 0]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute left-[6%] top-[18%] text-sage">
              
              <LeafIcon className="h-14 w-14" strokeWidth={1} />
            </motion.div>
            <motion.div
              animate={{
                y: [0, 16, 0],
                rotate: [0, -10, 0]
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute bottom-[14%] right-[4%] text-gold/70">
              
              <LeafIcon className="h-20 w-20" strokeWidth={0.8} />
            </motion.div>
          </motion.div>

          {/* The bottle with slow 3D rotation + cursor tilt */}
          <div
            style={{
              perspective: 1200
            }}
            className="relative">
            
            <motion.div
              style={{
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: 'preserve-3d'
              }}>
              
              <motion.img
                src={HERO_BOTTLE}
                alt="Hautoria Lumière Céleste Résurrection Sérum, a frosted glass luxury serum bottle"
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -14, 0]
                }}
                transition={{
                  opacity: {
                    duration: 1.4,
                    ease: LUXE,
                    delay: 0.3
                  },
                  scale: {
                    duration: 1.4,
                    ease: LUXE,
                    delay: 0.3
                  },
                  y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }
                }}
                className="relative z-10 mx-auto w-[64vw] max-w-[380px] drop-shadow-[0_40px_60px_rgba(200,169,106,0.25)] sm:w-[380px]" />
              
              {/* Silky glass reflection underneath */}
              <div
                aria-hidden
                className="absolute -bottom-6 left-1/2 h-16 w-2/3 -translate-x-1/2 rounded-[50%] bg-gold/20 blur-2xl" />
              
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{
          opacity: fade
        }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-charcoal/50">
        
        <span className="text-[0.6rem] uppercase tracking-luxe">Scroll</span>
        <motion.div
          animate={{
            y: [0, 8, 0]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}>
          
          <ArrowDownIcon className="h-4 w-4" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>);

}