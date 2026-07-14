import React from 'react';
import { motion } from 'framer-motion';
import { InstagramIcon } from 'lucide-react';
import { Reveal } from '../components/Reveal';
const POSTS = ["/c7323670-8f0c-4450-b162-ee3584c048ec.jpg", "/3ad9cf3d-8e35-4cc5-a030-941d0ed21018.jpg", "/79b4a1c7-c14f-43b6-a9a5-9976b9fda17a.jpg", "/ddc38907-ef78-4429-a323-9d10599d39e0.jpg"];





export function InstagramGallery() {
  return (
    <section className="relative w-full bg-beige py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-12 flex flex-col items-center text-center">
          <Reveal>
            <p className="mb-4 flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-luxe text-gold">
              <InstagramIcon className="h-4 w-4" /> @hautoria
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-4xl font-light leading-tight text-charcoal sm:text-5xl">
              Join the <span className="italic">ritual</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {POSTS.map((src, i) =>
          <Reveal key={src} delay={i * 0.08}>
              <a
              href="#"
              className="group relative block aspect-square overflow-hidden rounded-2xl">
              
                <motion.img
                src={src}
                alt="Hautoria on Instagram"
                className="h-full w-full object-cover"
                whileHover={{
                  scale: 1.08
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1]
                }} />
              
                <div className="absolute inset-0 flex items-center justify-center bg-charcoal/0 opacity-0 transition-all duration-500 group-hover:bg-charcoal/30 group-hover:opacity-100">
                  <InstagramIcon
                  className="h-7 w-7 text-ivory"
                  strokeWidth={1.5} />
                
                </div>
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}