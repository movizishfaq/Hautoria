import React from 'react';
import { Hero } from '../sections/Hero';
import { Featured } from '../sections/Featured';
import { BestSellers } from '../sections/BestSellers';
import { SkinQuiz } from '../sections/SkinQuiz';
import { Ingredients } from '../sections/Ingredients';
import { Carousel } from '../sections/Carousel';
import { BeforeAfter } from '../sections/BeforeAfter';
import { Testimonials } from '../sections/Testimonials';
import { Membership } from '../sections/Membership';
import { Collections } from '../sections/Collections';
import { InstagramGallery } from '../sections/InstagramGallery';
import { FAQ } from '../sections/FAQ';
import {
  ShieldCheckIcon,
  StethoscopeIcon,
  FlaskConicalIcon } from
'lucide-react';
export function HomePage() {
  return (
    <>
      <Hero />
      <Featured />
      <section className="bg-charcoal px-6 py-7 text-ivory">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 text-center sm:grid-cols-3">
          <p className="flex items-center justify-center gap-2 text-[.63rem] uppercase tracking-luxe">
            <ShieldCheckIcon className="h-4 w-4 text-gold" /> 100% authentic
            formulas
          </p>
          <p className="flex items-center justify-center gap-2 text-[.63rem] uppercase tracking-luxe">
            <StethoscopeIcon className="h-4 w-4 text-gold" /> Dermatologist
            reviewed
          </p>
          <p className="flex items-center justify-center gap-2 text-[.63rem] uppercase tracking-luxe">
            <FlaskConicalIcon className="h-4 w-4 text-gold" /> Clinically tested
            actives
          </p>
        </div>
      </section>
      <BestSellers />
      <SkinQuiz />
      <Ingredients />
      <Carousel />
      <BeforeAfter />
      <Testimonials />
      <Membership />
      <Collections />
      <InstagramGallery />
      <FAQ />
    </>);

}