'use client';

import type { Rating } from '@/lib/kundali/domain-synthesis/types';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import DomainRings from '../DomainRings';

interface Props {
  domain: string;
  natalRating: Rating;
  dashaScore: number;
  transitCount: number;
  ratingLabel: string;
  locale: string;
  onViewRemedies?: () => void;
}

/** Human-friendly rating labels for the legend */
const RATING_WORD: Record<Rating, { en: string; hi: string }> = {
  uttama: { en: 'Strong', hi: 'प्रबल' },
  madhyama: { en: 'Moderate', hi: 'मध्यम' },
  adhama: { en: 'Needs attention', hi: 'ध्यान आवश्यक' },
  atyadhama: { en: 'Challenging', hi: 'चुनौतीपूर्ण' },
};

/** Outer ring colour per rating — must match DomainRings.tsx */
const RATING_HEX: Record<Rating, string> = {
  uttama: '#22c55e',
  madhyama: '#60a5fa',
  adhama: '#f59e0b',
  atyadhama: '#ef4444',
};

export default function DomainRingsCard({
  domain, natalRating, dashaScore, transitCount, ratingLabel, locale, onViewRemedies,
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
          transitCount={transitCount}
          size={80}
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
              <span className="text-text-secondary">{isHi ? 'कुण्डली' : 'Your Chart'}</span>
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
    </div>
  );
}
