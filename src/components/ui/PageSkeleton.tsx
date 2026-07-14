import React from 'react';
export function PageSkeleton({ rows = 4 }: {rows?: number;}) {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-6 py-32">
      <div className="h-6 w-28 rounded bg-beige dark:bg-white/10" />
      <div className="mt-5 h-12 w-80 max-w-full rounded bg-beige dark:bg-white/10" />
      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        {Array.from({
          length: rows
        }).map((_, index) =>
        <div
          key={index}
          className="h-72 rounded-[2rem] bg-beige dark:bg-white/10" />

        )}
      </div>
    </div>);

}