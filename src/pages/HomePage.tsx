import React, { lazy, Suspense } from 'react';
import { CinematicHero } from '../sections/premium/CinematicHero';
import { TrustMarquee } from '../sections/premium/TrustMarquee';
import { FloatingShowcase } from '../sections/premium/FloatingShowcase';
import { LuxuryStats } from '../sections/premium/LuxuryStats';
import { CategoryRails } from '../sections/premium/CategoryRails';
import { ScrollStory } from '../sections/premium/ScrollStory';
import { BundleOffers } from '../sections/premium/BundleOffers';
import { RecentlyViewed } from '../components/premium/RecentlyViewed';
import { FAQ } from '../sections/FAQ';
import { Testimonials } from '../sections/Testimonials';
import { SkinQuiz } from '../sections/SkinQuiz';

const Membership = lazy(() =>
  import('../sections/Membership').then((m) => ({ default: m.Membership }))
);

function SectionLoader() {
  return <div className="h-32 animate-pulse bg-beige/30" />;
}

export function HomePage() {
  return (
    <>
      <CinematicHero />
      <TrustMarquee />
      <FloatingShowcase />
      <LuxuryStats />
      <CategoryRails />
      <ScrollStory />
      <BundleOffers />
      <SkinQuiz />
      <Testimonials />
      <Suspense fallback={<SectionLoader />}>
        <Membership />
      </Suspense>
      <FAQ />
      <RecentlyViewed />
    </>
  );
}
