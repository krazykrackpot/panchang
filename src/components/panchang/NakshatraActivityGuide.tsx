'use client';

import { useEffect, useState } from 'react';
import { getNakshatraActivity } from '@/lib/constants/nakshatra-activities';
import { computePersonalMuhurta, type PersonalMuhurta } from '@/lib/personalization/personal-muhurta';
import { useBirthDataStore } from '@/stores/birth-data-store';

// ---------------------------------------------------------------------------
// Recommendation color helpers (hoisted to module level)
// ---------------------------------------------------------------------------

const REC_STYLES: Record<string, { dot: string; text: string; bg: string; label: string; labelHi: string }> = {
  excellent: { dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Excellent', labelHi: 'उत्कृष्ट' },
  good: { dot: 'bg-gold-primary', text: 'text-gold-primary', bg: 'bg-gold-primary/10', label: 'Good', labelHi: 'शुभ' },
  neutral: { dot: 'bg-text-secondary', text: 'text-text-secondary', bg: 'bg-white/5', label: 'Neutral', labelHi: 'सामान्य' },
  avoid: { dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10', label: 'Avoid', labelHi: 'अशुभ' },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface NakshatraActivityGuideProps {
  nakshatraId: number;      // 1-27 — today's nakshatra
  moonSignId: number;       // 1-12 — today's Moon rashi
  locale: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NakshatraActivityGuide({ nakshatraId, moonSignId, locale }: NakshatraActivityGuideProps) {
  const activity = getNakshatraActivity(nakshatraId);
  const { birthNakshatra, birthRashi, isSet, loadFromStorage } = useBirthDataStore();
  const [personalRecs, setPersonalRecs] = useState<PersonalMuhurta[] | null>(null);

  // Load birth data from localStorage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Compute personal recommendations when birth data is available
  useEffect(() => {
    if (isSet && birthNakshatra > 0 && birthRashi > 0 && nakshatraId > 0 && moonSignId > 0) {
      const recs = computePersonalMuhurta(birthNakshatra, birthRashi, nakshatraId, moonSignId);
      setPersonalRecs(recs);
    } else {
      setPersonalRecs(null);
    }
  }, [isSet, birthNakshatra, birthRashi, nakshatraId, moonSignId]);

  if (!activity) return null;

  const isHi = locale === 'hi';

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-violet-500/20 p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" />
          </svg>
        </div>
        <div>
          <h3 className="text-violet-300 text-sm font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? 'नक्षत्र मार्गदर्शन' : 'Nakshatra Activity Guide'}
          </h3>
          <p className="text-gold-light text-lg font-bold leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? activity.theme.hi : activity.theme.en}
          </p>
        </div>
      </div>

      {/* Good For / Avoid pills */}
      <div className="space-y-3 mb-4">
        {activity.goodFor.length > 0 && (
          <div>
            <p className="text-violet-400/70 text-xs uppercase tracking-wider font-semibold mb-2">{isHi ? 'शुभ कार्य' : 'Favorable For'}</p>
            <div className="flex flex-wrap gap-2">
              {activity.goodFor.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20"
                >
                  {isHi ? item.hi : item.en}
                </span>
              ))}
            </div>
          </div>
        )}

        {activity.avoidFor.length > 0 && (
          <div>
            <p className="text-violet-400/70 text-xs uppercase tracking-wider font-semibold mb-2">{isHi ? 'अशुभ कार्य' : 'Better to Avoid'}</p>
            <div className="flex flex-wrap gap-2">
              {activity.avoidFor.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-red-300 bg-red-500/10 border border-red-500/20"
                >
                  {isHi ? item.hi : item.en}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Personalized Activity Grid */}
      {personalRecs && (
        <div className="border-t border-violet-500/15 pt-4">
          <p className="text-violet-300 text-xs font-bold uppercase tracking-wider mb-3">
            {isHi ? 'आपके जन्म नक्षत्र अनुसार' : 'Personalized for Your Birth Chart'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {personalRecs.map((rec) => {
              const style = REC_STYLES[rec.recommendation] || REC_STYLES.neutral;
              return (
                <div
                  key={rec.activityKey}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-violet-500/10 ${style.bg}`}
                  title={isHi ? rec.reason.hi : rec.reason.en}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${style.dot}`} />
                  <span className="text-text-primary text-xs truncate">
                    {isHi ? (rec.activity.hi || rec.activity.en) : rec.activity.en}
                  </span>
                  <span className={`ml-auto text-[10px] font-bold shrink-0 ${style.text}`}>
                    {isHi ? style.labelHi : style.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
