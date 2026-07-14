import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { Reveal, RevealWords } from '../components/Reveal';
import { FAQS } from '../lib/data';
const LUXE = [0.22, 1, 0.36, 1] as const;
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative w-full bg-ivory py-28 lg:py-40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <Reveal>
            <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-luxe text-gold">
              Questions
            </p>
          </Reveal>
          <h2 className="font-serif text-4xl font-light leading-tight text-charcoal sm:text-5xl">
            <RevealWords text="Everything" />
            <br />
            <span className="italic">
              <RevealWords text="you need." delay={0.2} />
            </span>
          </h2>
        </div>

        <div>
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 0.06}>
                <div className="border-b border-charcoal/10">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}>
                    
                    <span className="font-serif text-lg font-light text-charcoal sm:text-xl">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{
                        rotate: isOpen ? 45 : 0
                      }}
                      transition={{
                        duration: 0.4,
                        ease: LUXE
                      }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal">
                      
                      <PlusIcon className="h-4 w-4" strokeWidth={1.5} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen &&
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0
                      }}
                      animate={{
                        height: 'auto',
                        opacity: 1
                      }}
                      exit={{
                        height: 0,
                        opacity: 0
                      }}
                      transition={{
                        duration: 0.5,
                        ease: LUXE
                      }}
                      className="overflow-hidden">
                      
                        <p className="pb-6 pr-12 text-sm font-light leading-relaxed text-charcoal/60">
                          {item.a}
                        </p>
                      </motion.div>
                    }
                  </AnimatePresence>
                </div>
              </Reveal>);

          })}
        </div>
      </div>
    </section>);

}