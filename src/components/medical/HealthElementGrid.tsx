'use client';

// src/components/medical/HealthElementGrid.tsx
//
// D2 — Health Element Diagnosis section for /medical-astrology.
//
// Renders a grid of NatalElement cards (the Layer 1 natal baseline) grouped
// by category.  Each card shows: element name, rating badge, natalScore bar,
// and the top 2 contributing factors.
//
// An "Extended analysis" toggle button is exposed via onToggleExtended so
// the parent can re-fetch with extended:true to unlock the 3 hidden elements
// (allergies, cancer, longevity).

import { tl } from '@/lib/utils/trilingual';
import type { NatalElement } from '@/lib/kundali/health-diagnosis/types';
import type { Rating } from '@/lib/kundali/domain-synthesis/types';
import type { LocaleText } from '@/types/panchang';

// ─── Rating colour helpers (static — no dynamic Tailwind) ────────────────────

const RATING_BAR_COLOR: Record<Rating, string> = {
  uttama:    'bg-emerald-500',
  madhyama:  'bg-gold-primary',
  adhama:    'bg-amber-400',
  atyadhama: 'bg-red-500',
};

const RATING_BADGE: Record<Rating, string> = {
  uttama:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  madhyama:  'bg-gold-primary/15 text-gold-primary border-gold-primary/30',
  adhama:    'bg-amber-500/15 text-amber-400 border-amber-500/30',
  atyadhama: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const RATING_LABEL: Record<Rating, LocaleText> = {
  uttama:    { en: 'Resilient', hi: 'सशक्त', sa: 'उत्तम' },
  madhyama:  { en: 'Moderate', hi: 'मध्यम', sa: 'मध्यम' },
  adhama:    { en: 'Sensitive', hi: 'संवेदनशील', sa: 'अधम' },
  atyadhama: { en: 'Vulnerable', hi: 'असुरक्षित', sa: 'अत्यधम' },
};

const CATEGORY_LABEL: Record<string, LocaleText> = {
  physical:  { en: 'Physical Systems', hi: 'शारीरिक तंत्र', sa: 'शारीरिकतंत्राणि' },
  mental:    { en: 'Mental & Emotional', hi: 'मानसिक एवं भावनात्मक', sa: 'मानसिकम्' },
  systemic:  { en: 'Systemic Risk Factors', hi: 'प्रणालीगत जोखिम', sa: 'तंत्रजोखिमाः' },
  longevity: { en: 'Longevity & Chronic', hi: 'दीर्घायु एवं जीर्ण रोग', sa: 'दीर्घायुः' },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface HealthElementGridProps {
  natalElements: NatalElement[];
  locale: string;
  optedInToExtended: boolean;
  onToggleExtended: () => void;
  /** Whether the parent is re-fetching after toggling extended */
  extendedLoading?: boolean;
}

// ─── Single element card ──────────────────────────────────────────────────────

function ElementCard({ el, locale }: { el: NatalElement; locale: string }) {
  const barColor = RATING_BAR_COLOR[el.rating];
  const badgeClass = RATING_BADGE[el.rating];
  const ratingText = tl(RATING_LABEL[el.rating], locale);
  const topFactors = el.factors.slice(0, 2);

  return (
    <div className="p-4 bg-bg-primary/60 border border-white/5 rounded-xl space-y-3 flex flex-col">
      {/* Name + badge */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-text-primary text-sm font-semibold leading-snug">
          {tl(el.name, locale)}
        </span>
        <span className={`shrink-0 inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${badgeClass}`}>
          {ratingText}
        </span>
      </div>

      {/* Score bar */}
      <div className="space-y-1">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${el.natalScore}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-text-secondary/60">
          <span>Vulnerability</span>
          <span>{el.natalScore}/100</span>
        </div>
      </div>

      {/* Top factors */}
      {topFactors.length > 0 && (
        <ul className="space-y-0.5 mt-auto">
          {topFactors.map((f, i) => (
            <li key={i} className="text-[11px] text-text-secondary/70 leading-snug truncate" title={tl(f.label, locale)}>
              · {tl(f.label, locale)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HealthElementGrid({
  natalElements,
  locale,
  optedInToExtended,
  onToggleExtended,
  extendedLoading = false,
}: HealthElementGridProps) {
  // Group elements by category, preserving catalogue order within each group
  const categories: Array<'physical' | 'mental' | 'systemic' | 'longevity'> = [
    'physical', 'mental', 'systemic', 'longevity',
  ];

  const grouped = categories
    .map((cat) => ({
      cat,
      elements: natalElements.filter((el) => el.category === cat),
    }))
    .filter((g) => g.elements.length > 0);

  return (
    <div className="space-y-6">
      {grouped.map(({ cat, elements }) => (
        <div key={cat}>
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">
            {tl(CATEGORY_LABEL[cat], locale)}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {elements.map((el) => (
              <ElementCard key={el.id} el={el} locale={locale} />
            ))}
          </div>
        </div>
      ))}

      {/* Extended toggle */}
      <div className="pt-2 border-t border-gold-primary/10">
        <button
          type="button"
          disabled={extendedLoading}
          onClick={onToggleExtended}
          className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border transition-all ${
            optedInToExtended
              ? 'border-gold-primary/40 bg-gold-primary/10 text-gold-light'
              : 'border-gold-primary/20 bg-transparent text-gold-primary/70 hover:border-gold-primary/40 hover:text-gold-light'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {extendedLoading ? (
            <span className="animate-pulse">
              {locale === 'hi' ? 'लोड हो रहा है...' : 'Loading extended analysis…'}
            </span>
          ) : optedInToExtended ? (
            locale === 'hi' ? 'विस्तारित विश्लेषण सक्रिय' : 'Extended analysis active (22 elements)'
          ) : (
            locale === 'hi' ? 'विस्तारित विश्लेषण देखें' : 'Unlock extended analysis (22 elements)'
          )}
        </button>
        {!optedInToExtended && (
          <p className="text-[11px] text-text-secondary/50 mt-1.5">
            {locale === 'hi'
              ? 'एलर्जी, कैंसर प्रवृत्ति और दीर्घायु विश्लेषण सहित।'
              : 'Includes allergies, cancer tendency, and longevity analysis.'}
          </p>
        )}
      </div>
    </div>
  );
}
