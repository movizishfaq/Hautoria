import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, InfoIcon, XIcon } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
export function ToastRegion() {
  const { toasts, dismissToast } = useAppState();
  return (
    <div
      aria-live="polite"
      className="fixed right-4 top-20 z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2">
      
      <AnimatePresence>
        {toasts.map((toast) =>
        <motion.div
          key={toast.id}
          initial={{
            opacity: 0,
            y: -12
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            x: 20
          }}
          className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-ivory p-4 shadow-xl dark:border-white/10 dark:bg-[#242424]">
          
            <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toast.tone === 'error' ? 'bg-red-100 text-red-700' : 'bg-sage text-charcoal'}`}>
            
              {toast.tone === 'info' ?
            <InfoIcon className="h-4 w-4" /> :

            <CheckIcon className="h-4 w-4" />
            }
            </span>
            <p className="flex-1 text-sm text-charcoal dark:text-ivory">
              {toast.message}
            </p>
            <button
            aria-label="Dismiss notice"
            onClick={() => dismissToast(toast.id)}
            className="text-charcoal/45 dark:text-ivory/45">
            
              <XIcon className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>);

}