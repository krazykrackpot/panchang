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
    <div className="rounded-xl border border-gold-primary/15 bg-bg-secondary p-4 sm:p-5">
      {/* Header */}
      <h3 className="text-gold-light text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
        {isHi ? 'नक्षत्र मार्गदर्शन' : 'Nakshatra Activity Guide'}
      </h3>

      {/* Theme */}
      <p className="text-text-primary text-base font-medium mb-3">
        {isHi ? activity.theme.hi : activity.theme.en}
      </p>

      {/* Good For / Avoid pills */}
      <div className="space-y-2 mb-4">
        {activity.goodFor.length > 0 && (
          <div>
            <p className="text-text-secondary text-xs mb-1.5">{isHi ? 'शुभ कार्य' : 'Favorable For'}</p>
            <div className="flex flex-wrap gap-1.5">
              {activity.goodFor.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                >
                  {isHi ? item.hi : item.en}
                </span>
              ))}
            </div>
          </div>
        )}

        {activity.avoidFor.length > 0 && (
          <div>
            <p className="text-text-secondary text-xs mb-1.5">{isHi ? 'अशुभ कार्य' : 'Better to Avoid'}</p>
            <div className="flex flex-wrap gap-1.5">
              {activity.avoidFor.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20"
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
        <div className="border-t border-gold-primary/10 pt-3">
          <p className="text-gold-primary text-xs font-medium mb-2">
            {isHi ? 'आपके जन्म नक्षत्र अनुसार' : 'Personalized for Your Birth Chart'}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {personalRecs.map((rec) => {
              const style = REC_STYLES[rec.recommendation] || REC_STYLES.neutral;
              return (
                <div
                  key={rec.activityKey}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${style.bg}`}
                  title={isHi ? rec.reason.hi : rec.reason.en}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                  <span className="text-text-primary text-xs truncate">
                    {isHi ? (rec.activity.hi || rec.activity.en) : rec.activity.en}
                  </span>
                  <span className={`ml-auto text-[10px] font-medium shrink-0 ${style.text}`}>
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
