'use client';

import type { Rating } from '@/lib/kundali/domain-synthesis/types';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';
import type { LocaleText } from '@/types/panchang';
import DomainRings from '../DomainRings';

// ── Localised header for the top-3 strip ──────────────────────────────────────
// Covers all 9 visible locales; falls back to English for any not listed.
const WEAKEST_LABEL: Record<string, string> = {
  en:  'Weakest Elements',
  hi:  'कमज़ोर तत्व',
  sa:  'दुर्बलतत्त्वानि',
  ta:  'Weakest Elements',
  te:  'Weakest Elements',
  bn:  'Weakest Elements',
  gu:  'Weakest Elements',
  kn:  'Weakest Elements',
  mai: 'कमज़ोर तत्व',
  mr:  'Weakest Elements',
};

function weakestLabel(locale: string): string {
  return WEAKEST_LABEL[locale] ?? WEAKEST_LABEL.en;
}

// ── Rating colour (mirrors SummaryDomainCard) ─────────────────────────────────
const RATING_COLOUR: Record<Rating, string> = {
  uttama:    'text-emerald-400',
  madhyama:  'text-gold-light',
  adhama:    'text-orange-400',
  atyadhama: 'text-red-400',
};

/** Shape of each element entry passed from the parent.
 *  Deliberately minimal — DomainRingsCard does NOT import the full HealthDiagnosis type. */
export interface TopElement {
  name: LocaleText;
  rating: Rating;
  score: number;
}

interface Props {
  domain: string;
  natalRating: Rating;
  dashaScore: number;
  nowScore: number;
  ratingLabel: string;
  locale: string;
  onViewRemedies?: () => void;
  /** Top-3 most vulnerable elements from the health diagnosis (health domain only). */
  topVulnerableElements?: TopElement[];
}

/** Human-friendly rating labels for the legend */
/** Outer ring colour per rating — must match DomainRings.tsx */
const RATING_HEX: Record<Rating, string> = {
  uttama: '#22c55e',
  madhyama: '#60a5fa',
  adhama: '#f59e0b',
  atyadhama: '#ef4444',
};

export default function DomainRingsCard({
  domain, natalRating, dashaScore, nowScore, ratingLabel, locale, onViewRemedies,
  topVulnerableElements,
}: Props) {
  const isHi = isDevanagariLocale(locale);
  const needsHelp = natalRating === 'adhama' || natalRating === 'atyadhama';

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4">
      <div className="flex items-center gap-4">
        {/* Unified DomainRings — same component as Expert mode */}
        <DomainRings
          natalRating={natalRating}
          dashaScore={dashaScore}
          nowScore={nowScore}
          size={80}
          ariaLabel={isHi
            ? `${domain}: ${ratingLabel}, जीवन चरण ${Math.round(dashaScore * 10)}%, अभी ${Math.round(nowScore * 10)}%`
            : `${domain}: ${ratingLabel}, Life Phase ${Math.round(dashaScore * 10)}%, Right Now ${Math.round(nowScore * 10)}%`}
        />

        <div className="flex-1 min-w-0">
          <h4 className="text-gold-light font-semibold text-sm">{domain}</h4>
          <p className="text-xs font-medium mt-0.5" style={{ color: RATING_HEX[natalRating] }}>
            {ratingLabel}
          </p>

          {/* Ring legend */}
          <div className="mt-2 space-y-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: RATING_HEX[natalRating] }} />
              <span className="text-text-secondary">{isHi ? 'आपकी कुण्डली' : 'Your Chart'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-text-secondary">{isHi ? 'जीवन चरण' : 'Life Phase'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-text-secondary">{isHi ? 'अभी' : 'Right Now'}</span>
            </div>
          </div>

          {/* Nudge to remedies when domain needs attention */}
          {needsHelp && onViewRemedies && (
            <button
              onClick={onViewRemedies}
              className="mt-2.5 text-[11px] text-gold-primary hover:text-gold-light transition-colors flex items-center gap-1"
            >
              {isHi ? 'उपाय देखें →' : 'View remedies →'}
            </button>
          )}
        </div>
      </div>

      {/* ── Top-3 weakest elements strip (health domain only) ── */}
      {topVulnerableElements && topVulnerableElements.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gold-primary/10">
          <h5 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            {weakestLabel(locale)}
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {topVulnerableElements.map((el) => (
              <span
                key={el.name.en}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold-dark/30 bg-gold-primary/10 px-2.5 py-0.5 text-[11px]"
              >
                <span className={`font-semibold ${RATING_COLOUR[el.rating]}`}>
                  {tl(el.name, locale)}
                </span>
                <span className="text-text-secondary">
                  {Math.round(el.score)}%
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
