import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon } from 'lucide-react';
export function EmptyState({
  title,
  body,
  actionLabel = 'Explore the collection',
  actionTo = '/shop'





}: {title: string;body: string;actionLabel?: string;actionTo?: string;}) {
  return (
    <div className="rounded-[2rem] border border-charcoal/10 bg-white/45 px-6 py-16 text-center dark:border-white/10 dark:bg-white/5">
      <SparklesIcon className="mx-auto h-8 w-8 text-gold" strokeWidth={1.3} />
      <h2 className="mt-5 font-serif text-3xl text-charcoal dark:text-ivory">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-charcoal/60 dark:text-ivory/60">
        {body}
      </p>
      <Link
        to={actionTo}
        className="mt-7 inline-flex rounded-full bg-charcoal px-6 py-3 text-[0.65rem] uppercase tracking-luxe text-ivory dark:bg-ivory dark:text-charcoal">
        
        {actionLabel}
      </Link>
    </div>);

}