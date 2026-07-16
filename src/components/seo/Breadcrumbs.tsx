import { Link } from 'react-router-dom';
import type { BreadcrumbItem } from '../../lib/seoSchemas';

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-[.58rem] uppercase tracking-luxe text-charcoal/40 dark:text-ivory/40">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.path}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span aria-current="page" className="capitalize text-charcoal/60 dark:text-ivory/60">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="transition-colors hover:text-gold">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
