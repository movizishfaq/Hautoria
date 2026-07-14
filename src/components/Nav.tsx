import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuIcon, XIcon, ShoppingBagIcon } from 'lucide-react';
import { Magnetic } from './Magnetic';
const LINKS = [
{
  label: 'Collections',
  href: '#collections'
},
{
  label: 'Ingredients',
  href: '#ingredients'
},
{
  label: 'Skin Quiz',
  href: '#quiz'
},
{
  label: 'VIP Club',
  href: '#membership'
}];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <>
      <motion.header
        initial={{
          y: -80,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.3
        }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe ${scrolled ? 'glass py-3 shadow-[0_8px_40px_rgba(43,43,43,0.06)]' : 'py-6'}`}>
        
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
          <a
            href="#top"
            className="font-serif text-2xl font-medium tracking-tight text-charcoal">
            
            Hautoria
          </a>

          <ul className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) =>
            <li key={l.href}>
                <a
                href={l.href}
                className="group relative text-[0.7rem] font-medium uppercase tracking-luxe text-charcoal/70 transition-colors hover:text-charcoal">
                
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 ease-luxe group-hover:w-full" />
                </a>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-4">
            <Magnetic strength={0.3} className="hidden md:block">
              <button
                aria-label="Shopping bag"
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/15 text-charcoal transition-colors hover:border-gold">
                
                <ShoppingBagIcon className="h-4 w-4" strokeWidth={1.5} />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[0.55rem] text-white">
                  2
                </span>
              </button>
            </Magnetic>
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/15 text-charcoal md:hidden">
              
              <MenuIcon className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 z-[60] bg-ivory md:hidden">
          
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-serif text-2xl">Hautoria</span>
              <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/15">
              
                <XIcon className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <ul className="mt-10 flex flex-col gap-2 px-6">
              {LINKS.map((l, i) =>
            <motion.li
              key={l.href}
              initial={{
                opacity: 0,
                x: -20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                delay: 0.1 + i * 0.08
              }}>
              
                  <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-charcoal/10 py-5 font-serif text-3xl">
                
                    {l.label}
                  </a>
                </motion.li>
            )}
            </ul>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}