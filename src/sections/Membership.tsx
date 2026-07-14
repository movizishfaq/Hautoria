import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, CrownIcon } from 'lucide-react';
import { Aurora } from '../components/Aurora';
import { Reveal, RevealWords } from '../components/Reveal';
import { LuxeButton } from '../components/LuxeButton';
const PERKS = [
'15% off every order, forever',
'Complimentary express shipping',
'Early access to limited editions',
'A free ritual gift each season',
'Personal skin concierge'];

export function Membership() {
  const navigate = useNavigate();
  return (
    <section
      id="membership"
      className="relative w-full overflow-hidden bg-charcoal py-28 text-ivory lg:py-40">
      
      <Aurora className="opacity-25" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-10">
        {/* Animated golden border card */}
        <div className="group relative rounded-[2.5rem] p-[1.5px]">
          <div
            aria-hidden
            className="absolute inset-0 rounded-[2.5rem] bg-[linear-gradient(90deg,#C8A96A,#e8d4a3,#C8A96A,#8a6f3a,#C8A96A)] bg-[length:300%_100%] animate-shimmer opacity-90" />
          
          <div className="relative rounded-[2.4rem] bg-charcoal px-8 py-14 text-center sm:px-16">
            <Reveal>
              <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 text-gold">
                <CrownIcon className="h-7 w-7" strokeWidth={1.3} />
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mb-4 text-[0.68rem] font-medium uppercase tracking-luxe text-gold">
                The VIP Club
              </p>
            </Reveal>
            <h2 className="font-serif text-4xl font-light leading-tight sm:text-6xl">
              <RevealWords text="Enter The" />{' '}
              <span className="italic text-gradient-gold">
                <RevealWords text="Inner Circle" delay={0.2} />
              </span>
            </h2>
            <Reveal delay={0.3}>
              <p className="mx-auto mt-6 max-w-lg text-base font-light leading-relaxed text-ivory/60">
                An exclusive skincare subscription for those who refuse the
                ordinary. Members-only rituals, delivered on your schedule.
              </p>
            </Reveal>

            <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 text-left">
              {PERKS.map((perk, i) =>
              <Reveal key={perk} delay={0.1 * i}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                      <CheckIcon className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    <span className="text-sm font-light text-ivory/80">
                      {perk}
                    </span>
                  </div>
                </Reveal>
              )}
            </div>

            <div className="mt-12 flex flex-col items-center gap-3">
              <LuxeButton onClick={() => navigate('/auth?mode=signup')}>
                <span className="text-gradient-gold">Join · $59 / month</span>
              </LuxeButton>
              <p className="text-[0.6rem] uppercase tracking-luxe text-ivory/40">
                Cancel anytime · No commitment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>);

}