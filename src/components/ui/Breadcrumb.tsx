import { Link } from '@/lib/i18n/navigation';
import { ChevronRight } from 'lucide-react';

/**
 * Shared visible breadcrumb. Renders the trail above-the-fold on deep
 * routes (learn modules, festival/year, puja/slug, panchang/nakshatra/[id],
 * horoscope/[rashi]/[date]) so users landing from search have orientation
 * back to the section index.
 *
 * Pair this with a BreadcrumbList JSON-LD blob in the route's layout for
 * Google rich-result eligibility. The two are independent — JSON-LD is for
 * crawlers, this component is for humans. Per audit 2026-05-25 §B.
 */

export interface BreadcrumbItem {
  /** Path WITHOUT locale prefix, e.g. `/learn` or `/learn/modules/0-1`.
   *  The shared `Link` (next-intl `createNavigation`) auto-prefixes with the
   *  active locale; passing `/en/learn` here produces `/en/en/learn`. */
  href?: string;
  /** Human-readable label in the active locale. */
  label: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Adds horizontal padding when the trail sits inside a section without
   *  its own container. Defaults to no padding. */
  inset?: boolean;
  className?: string;
}

export function Breadcrumb({ items, inset = false, className = '' }: BreadcrumbProps) {
  if (items.length === 0) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-xs text-text-secondary ${inset ? 'px-4 sm:px-6' : ''} ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.href ?? 'curr'}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="w-3 h-3 text-gold-primary/40 shrink-0" aria-hidden="true" />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-gold-light transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'text-gold-light/80' : ''}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
