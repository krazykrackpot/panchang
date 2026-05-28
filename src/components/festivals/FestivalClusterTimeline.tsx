/**
 * Festival cluster cross-link timeline (server component).
 *
 * Shows the multi-day cluster a festival belongs to (Diwali 5-day,
 * Holi 2-day, Navratri 9-day, Pitru Paksha 15-day, etc.) as a
 * horizontal scrolling list of day-cards.
 *
 * Real festival slugs link to their year-page; `comingSoon` slugs
 * render as non-clickable badges with a "coming soon" indicator
 * (per spec §4F + §11).
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §4F
 */

import { Link } from '@/lib/i18n/navigation';
import { ChevronRight } from 'lucide-react';
import { tl } from '@/lib/utils/trilingual';
import type { Locale } from '@/types/panchang';
import type { FestivalCluster } from '@/lib/festivals/types';

interface Props {
  cluster: FestivalCluster;
  /** Slug of the festival currently being viewed — highlighted in the timeline */
  currentSlug: string;
  /** Year for the linkable entries */
  year: number;
  locale: Locale;
}

export default function FestivalClusterTimeline({ cluster, currentSlug, year, locale }: Props) {
  const sectionTitle = locale === 'hi'
    ? `${tl(cluster.name, 'hi')} — पर्व क्रम`
    : `${cluster.name.en} — Festival Cluster`;

  return (
    <section className="mb-10" aria-labelledby="cluster-heading">
      <div className="mb-4">
        <h2
          id="cluster-heading"
          className="text-xl sm:text-2xl font-bold text-gold-light mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {sectionTitle}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">{tl(cluster.description, locale)}</p>
      </div>

      {/* Horizontal scroll on mobile, wrapped on desktop */}
      <ol className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory md:flex-wrap md:overflow-visible">
        {cluster.entries.map((entry, idx) => {
          const isCurrent = entry.slug === currentSlug;
          const dayLabel = entry.dayLabel ? tl(entry.dayLabel, locale) : null;
          const baseClass = `flex-shrink-0 w-44 sm:w-52 snap-start rounded-xl border p-3 transition-colors ${
            isCurrent
              ? 'bg-gold-primary/15 border-gold-primary/50'
              : 'bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border-gold-primary/12 hover:border-gold-primary/30'
          }`;

          const content = (
            <>
              <div className="text-[10px] text-gold-primary/70 mb-1 font-mono">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="text-text-primary text-sm font-semibold">
                {dayLabel ?? slugToReadable(entry.slug)}
              </div>
              {entry.comingSoon ? (
                <div className="text-[10px] text-text-secondary/60 mt-2 italic">
                  {locale === 'hi' ? 'शीघ्र आ रहा है' : 'Coming soon'}
                </div>
              ) : (
                <div className="text-[10px] text-gold-light/70 mt-2 flex items-center gap-1">
                  {locale === 'hi' ? 'देखें' : 'View'} <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </>
          );

          if (entry.comingSoon) {
            return (
              <li key={entry.slug} className={`${baseClass} opacity-70 cursor-default`}>
                {content}
              </li>
            );
          }
          return (
            <li key={entry.slug} className="list-none">
              <Link href={`/festivals/${entry.slug}/${year}`} className={`block ${baseClass}`}>
                {content}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function slugToReadable(slug: string): string {
  return slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
}
