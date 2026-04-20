'use client';

import { tl } from '@/lib/utils/trilingual';
import { GRAHAS } from '@/lib/constants/grahas';
import type { CurrentPeriodReading, Rating } from '@/lib/kundali/domain-synthesis/types';

// ---------------------------------------------------------------------------
// Rating colour map — static, no dynamic Tailwind classes
// ---------------------------------------------------------------------------

const RATING_COLORS: Record<Rating, string> = {
  uttama: '#34d399',
  madhyama: '#d4a853',
  adhama: '#f59e0b',
  atyadhama: '#ef4444',
};

const RATING_DOT_CLASSES: Record<Rating, string> = {
  uttama: 'bg-emerald-400 shadow-emerald-400/40',
  madhyama: 'bg-gold-primary shadow-gold-primary/40',
  adhama: 'bg-amber-400 shadow-amber-400/40',
  atyadhama: 'bg-red-400 shadow-red-400/40',
};

const RATING_BADGE_CLASSES: Record<Rating, string> = {
  uttama: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
  madhyama: 'bg-gold-primary/10 border-gold-primary/25 text-gold-primary',
  adhama: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
  atyadhama: 'bg-red-500/10 border-red-500/25 text-red-400',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function planetName(id: number, locale: string): string {
  const g = GRAHAS.find((p) => p.id === id);
  return g ? tl(g.name, locale) : `Planet ${id}`;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CurrentPeriodCardProps {
  period: CurrentPeriodReading;
  locale: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CurrentPeriodCard({ period, locale }: CurrentPeriodCardProps) {
  const rating = period.periodRating.rating;
  const ratingColor = RATING_COLORS[rating];

  // Build dasha label from key transits (the period reading doesn't directly expose MD/AD lord IDs,
  // so we use the dashaSummary text)
  const dashaSummaryText = tl(period.dashaSummary, locale);

  // Transit pills — show nature-based coloring
  const transitNatureBadge: Record<string, string> = {
    benefic: RATING_BADGE_CLASSES.uttama,
    malefic: RATING_BADGE_CLASSES.atyadhama,
    neutral: RATING_BADGE_CLASSES.madhyama,
  };

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#1a1040]/60 via-[#111633]/70 to-[#0a0e27] border border-gold-primary/15 p-6 overflow-hidden">
      {/* Subtle top border accent */}
      <div
        className="absolute top-0 left-6 right-6 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${ratingColor}60, transparent)` }}
      />

      {/* Main layout: left info + right progress */}
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Left section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            {/* Pulsing dot */}
            <div className="relative flex-shrink-0 mt-1">
              <div
                className={`w-5 h-5 rounded-full ${RATING_DOT_CLASSES[rating]} shadow-lg`}
              />
              <div
                className={`absolute inset-0 w-5 h-5 rounded-full animate-pulse ${RATING_DOT_CLASSES[rating]} opacity-40`}
              />
            </div>

            <div className="min-w-0">
              {/* Dasha period name */}
              <h3 className="font-heading text-gold-light text-xl font-semibold leading-tight truncate">
                {dashaSummaryText}
              </h3>

              {/* Interaction theme / summary */}
              <p className="text-text-secondary text-sm mt-1.5 leading-relaxed line-clamp-3">
                {tl(period.summary, locale)}
              </p>
            </div>
          </div>
        </div>

        {/* Right section — period score visual */}
        <div className="flex-shrink-0 sm:w-48 flex flex-col items-end justify-center gap-2">
          {/* Score display */}
          <div className="text-right">
            <span className="text-text-secondary text-xs uppercase tracking-wider">Period Score</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold" style={{ color: ratingColor }}>
                {period.periodScore.toFixed(1)}
              </span>
              <span className="text-text-secondary text-xs">/10</span>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="w-full">
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (period.periodScore / 10) * 100)}%`,
                  backgroundColor: ratingColor,
                }}
              />
            </div>
            <p className="text-text-secondary text-xs mt-1 text-right">
              {tl(period.periodRating.label, locale)}
            </p>
          </div>
        </div>
      </div>

      {/* Key transits row */}
      {period.keyTransits.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gold-primary/8">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">Key Transits</p>
          <div className="flex flex-wrap gap-2">
            {period.keyTransits.map((transit, i) => (
              <span
                key={`${transit.planetId}-${i}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border ${transitNatureBadge[transit.nature] || transitNatureBadge.neutral}`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
                  style={{ backgroundColor: RATING_COLORS[transit.nature === 'benefic' ? 'uttama' : transit.nature === 'malefic' ? 'atyadhama' : 'madhyama'] }}
                />
                {planetName(transit.planetId, locale)}
                {transit.summary ? ` — ${tl(transit.summary, locale)}` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active and challenged domains */}
      {(period.activeDomainsNow.length > 0 || period.challengedDomainsNow.length > 0) && (
        <div className="mt-3 pt-3 border-t border-gold-primary/8 flex flex-wrap gap-2">
          {period.activeDomainsNow.map((domain) => (
            <span
              key={`active-${domain}`}
              className="rounded-full px-3 py-1 text-xs border bg-emerald-500/8 border-emerald-500/20 text-emerald-400"
            >
              {domain}
            </span>
          ))}
          {period.challengedDomainsNow.map((domain) => (
            <span
              key={`challenge-${domain}`}
              className="rounded-full px-3 py-1 text-xs border bg-red-500/8 border-red-500/20 text-red-400"
            >
              {domain}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
