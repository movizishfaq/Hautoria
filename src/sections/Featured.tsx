import React, { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform } from
'framer-motion';
import { PlusIcon } from 'lucide-react';
import { Reveal, RevealWords } from '../components/Reveal';
import { PRODUCTS, type Product } from '../lib/data';
import { catalogProducts } from '../lib/mockData';
import { useAppState } from '../hooks/useAppState';
const LUXE = [0.22, 1, 0.36, 1] as const;
function FloatingCard({ product, index }: {product: Product;index: number;}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const { addToCart } = useAppState();
  const commerceProduct = catalogProducts.find((item) => item.id === product.id);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 18
  });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), {
    stiffness: 150,
    damping: 18
  });
  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 60
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: true,
        margin: '-80px'
      }}
      transition={{
        duration: 1,
        ease: LUXE,
        delay: index * 0.12
      }}
      className="flex flex-col items-center"
      style={{
        perspective: 1400
      }}>
      
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => {
          setHover(false);
          mx.set(0);
          my.set(0);
        }}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: 'preserve-3d'
        }}
        animate={{
          y: hover ? -14 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 18
        }}
        className={`group relative flex aspect-[3/4] w-full flex-col items-center justify-center rounded-[2rem] ${product.accent} p-8`}>
        
        {/* Glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            boxShadow:
            '0 30px 80px rgba(200,169,106,0.35), inset 0 0 60px rgba(255,255,255,0.4)'
          }} />
        

        <motion.img
          src={product.image}
          alt={`${product.name} — ${product.tagline}`}
          style={{
            translateZ: 60
          }}
          animate={{
            rotate: hover ? 4 : 0,
            y: hover ? -6 : 0
          }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 15
          }}
          className="relative z-10 h-[78%] w-auto object-contain drop-shadow-[0_25px_35px_rgba(43,43,43,0.15)]" />
        

        {/* Quick Add slides in */}
        <AnimatePresence>
          {hover &&
          <motion.button
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: 20
            }}
            transition={{
              duration: 0.4,
              ease: LUXE
            }}
            style={{
              translateZ: 80
            }}
            onClick={() => commerceProduct && addToCart(commerceProduct)}
            className="absolute bottom-6 z-20 flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-[0.66rem] font-medium uppercase tracking-luxe text-ivory">
            
              <PlusIcon className="h-3.5 w-3.5" strokeWidth={2} />
              Quick Add
            </motion.button>
          }
        </AnimatePresence>
      </motion.div>

      {/* Reflection underneath */}
      <div
        aria-hidden
        className="mt-1 aspect-[3/1] w-[85%] scale-y-[-1] rounded-b-[2rem] opacity-30 blur-[2px]"
        style={{
          background: `linear-gradient(to bottom, ${product.accent.includes('blush') ? '#F8DDE6' : product.accent.includes('sage') ? '#DCE8DD' : '#F3EDE4'}, transparent)`,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)'
        }} />
      

      {/* Info + animated price reveal */}
      <div className="mt-4 text-center">
        <h3 className="font-serif text-2xl font-light text-charcoal">
          {product.name}
        </h3>
        <p className="mt-1 text-[0.7rem] uppercase tracking-luxe text-charcoal/50">
          {product.tagline}
        </p>
        <div className="mt-3 h-6 overflow-hidden">
          <motion.p
            initial={{
              y: '110%'
            }}
            whileInView={{
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 0.8,
              ease: LUXE,
              delay: 0.3 + index * 0.12
            }}
            className="font-serif text-lg text-gold">
            
            ${product.price}
          </motion.p>
        </div>
      </div>
    </motion.div>);

}
export function Featured() {
  return (
    <section className="relative w-full bg-ivory py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-16 flex flex-col items-center text-center">
          <Reveal>
            <p className="mb-5 text-[0.68rem] font-medium uppercase tracking-luxe text-gold">
              The Icons
            </p>
          </Reveal>
          <h2 className="font-serif text-4xl font-light leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            <RevealWords text="Suspended In" />
            <br />
            <span className="italic">
              <RevealWords text="Pure Desire" delay={0.2} />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) =>
          <FloatingCard key={p.id} product={p} index={i} />
          )}
        </div>
      </div>
    </section>);

}