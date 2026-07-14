import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
export function LivePurchaseNotice() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <aside
      aria-live="polite"
      className="fixed bottom-5 left-5 z-40 hidden max-w-xs rounded-2xl border border-charcoal/10 bg-ivory/95 p-4 shadow-xl backdrop-blur md:block dark:border-white/10 dark:bg-[#222]/95">
      
      <button
        onClick={() => setOpen(false)}
        aria-label="Dismiss purchase notice"
        className="absolute right-3 top-3">
        
        <XIcon className="h-3.5 w-3.5" />
      </button>
      <p className="text-[.58rem] uppercase tracking-luxe text-gold">
        Demo social proof
      </p>
      <p className="mt-2 pr-4 text-sm">
        A Hautoria member in London just chose{' '}
        <span className="font-medium">Lumière Céleste</span>.
      </p>
    </aside>);

}