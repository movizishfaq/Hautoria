import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, RotateCcwIcon } from 'lucide-react';
import { Aurora } from '../components/Aurora';
import { Reveal } from '../components/Reveal';
import { LuxeButton } from '../components/LuxeButton';
import { QUIZ } from '../lib/data';
const LUXE = [0.22, 1, 0.36, 1] as const;
const RESULTS = [
{
  title: 'The Dew Ritual',
  desc: 'Your skin craves deep, cushioned hydration. Layer the Résurrection Sérum beneath Velours Nuit for a luminous, quenched glow.'
},
{
  title: 'The Renewal Ritual',
  desc: 'Firming is your focus. Bakuchiol-rich Velours Nuit paired with Élixir Botanique visibly smooths and lifts overnight.'
},
{
  title: 'The Clarity Ritual',
  desc: 'Even tone and radiance await. Aube Dorée Vitamin C by day, Pureté Claire by night, restores a clear, balanced complexion.'
}];

export function SkinQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const total = QUIZ.length;
  const done = step >= total;
  const progress = done ? 100 : step / total * 100;
  const result = RESULTS[(answers[0] ?? 0) % RESULTS.length];
  const answer = (idx: number) => {
    setAnswers((a) => [...a, idx]);
    setStep((s) => s + 1);
  };
  const reset = () => {
    setStep(0);
    setAnswers([]);
  };
  return (
    <section
      id="quiz"
      className="relative w-full overflow-hidden bg-sage/40 py-28 lg:py-40">
      
      <Aurora className="opacity-60" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-10">
        <div className="mb-12 text-center">
          <Reveal>
            <p className="mb-4 flex items-center justify-center gap-2 text-[0.68rem] font-medium uppercase tracking-luxe text-gold">
              <SparklesIcon className="h-3.5 w-3.5" /> AI Skin Finder
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-4xl font-light leading-tight text-charcoal sm:text-5xl">
              Discover your <span className="italic">perfect ritual</span>
            </h2>
          </Reveal>
        </div>

        {/* Progress bar */}
        <div className="mb-10 h-[3px] w-full overflow-hidden rounded-full bg-white/50">
          <motion.div
            className="h-full rounded-full bg-gold"
            animate={{
              width: `${progress}%`
            }}
            transition={{
              duration: 0.8,
              ease: LUXE
            }} />
          
        </div>

        <div className="glass relative min-h-[380px] overflow-hidden rounded-[2rem] p-8 sm:p-12">
          <AnimatePresence mode="wait">
            {!done ?
            <motion.div
              key={step}
              initial={{
                opacity: 0,
                y: 30
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -30
              }}
              transition={{
                duration: 0.6,
                ease: LUXE
              }}>
              
                <p className="mb-2 text-[0.66rem] uppercase tracking-luxe text-charcoal/40">
                  Question {step + 1} / {total}
                </p>
                <h3 className="mb-8 font-serif text-2xl font-light text-charcoal sm:text-3xl">
                  {QUIZ[step].q}
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {QUIZ[step].options.map((opt, i) =>
                <motion.button
                  key={opt}
                  initial={{
                    opacity: 0,
                    y: 16
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    ease: LUXE
                  }}
                  onClick={() => answer(i)}
                  className="group rounded-2xl border border-white/70 bg-white/50 px-6 py-5 text-left text-charcoal/80 transition-all duration-400 ease-luxe hover:border-gold hover:bg-white hover:text-charcoal">
                  
                      <span className="text-sm font-light">{opt}</span>
                      <span className="mt-2 block h-px w-0 bg-gold transition-all duration-500 ease-luxe group-hover:w-full" />
                    </motion.button>
                )}
                </div>
              </motion.div> :

            <motion.div
              key="result"
              initial={{
                opacity: 0,
                scale: 0.94
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                duration: 0.8,
                ease: LUXE
              }}
              className="flex flex-col items-center text-center">
              
                <motion.div
                initial={{
                  scale: 0,
                  rotate: -30
                }}
                animate={{
                  scale: 1,
                  rotate: 0
                }}
                transition={{
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 160
                }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold">
                
                  <SparklesIcon className="h-7 w-7" strokeWidth={1.5} />
                </motion.div>
                <p className="mb-3 text-[0.66rem] uppercase tracking-luxe text-gold">
                  Your Ritual
                </p>
                <h3 className="font-serif text-4xl font-light text-charcoal">
                  {result.title}
                </h3>
                <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-charcoal/60">
                  {result.desc}
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <LuxeButton
                  onClick={() => navigate('/shop?concern=hydration')}>
                  
                    Shop This Ritual
                  </LuxeButton>
                  <button
                  onClick={reset}
                  className="flex items-center gap-2 text-[0.66rem] uppercase tracking-luxe text-charcoal/50 transition-colors hover:text-charcoal">
                  
                    <RotateCcwIcon className="h-3.5 w-3.5" /> Retake
                  </button>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </section>);

}