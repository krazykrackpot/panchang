'use client';

import { useState, useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import { GRAHAS } from '@/lib/constants/grahas';
import {
  generateGemstoneRecommendations,
  GEMSTONE_COLORS,
  type GemstoneRecommendation,
  type NeedLevel,
} from '@/lib/remedies/gemstone-engine';
import type { KundaliData } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';

interface RemediesTabProps {
  kundali: KundaliData;
  locale: string;
}

// ─── Module-level constants ─────────────────────────────────────────────────

const NEED_LEVEL_CONFIG: Record<NeedLevel, { label: string; labelHi: string; barColor: string; borderColor: string; bgColor: string; textColor: string }> = {
  critical: {
    label: 'Critical',
    labelHi: 'अत्यावश्यक',
    barColor: 'bg-gradient-to-r from-red-500 to-red-400',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/8',
    textColor: 'text-red-400',
  },
  recommended: {
    label: 'Recommended',
    labelHi: 'अनुशंसित',
    barColor: 'bg-gradient-to-r from-gold-dark to-gold-primary',
    borderColor: 'border-gold-primary/25',
    bgColor: 'bg-gold-primary/8',
    textColor: 'text-gold-light',
  },
  optional: {
    label: 'Optional',
    labelHi: 'वैकल्पिक',
    barColor: 'bg-gradient-to-r from-blue-600/60 to-blue-400/60',
    borderColor: 'border-blue-400/15',
    bgColor: 'bg-blue-500/5',
    textColor: 'text-blue-400/80',
  },
  not_needed: {
    label: 'Not Needed',
    labelHi: 'आवश्यक नहीं',
    barColor: 'bg-gradient-to-r from-text-secondary/30 to-text-secondary/20',
    borderColor: 'border-text-secondary/10',
    bgColor: 'bg-text-secondary/3',
    textColor: 'text-text-secondary/60',
  },
};

const NEED_ORDER: NeedLevel[] = ['critical', 'recommended', 'optional', 'not_needed'];

// ─── Component ──────────────────────────────────────────────────────────────

export default function RemediesTab({ kundali, locale }: RemediesTabProps) {
  const isTamil = locale === 'ta';
  const isEn = locale === 'en' || isTamil;

  const recommendations = useMemo(
    () => generateGemstoneRecommendations(kundali),
    [kundali],
  );

  // Group by need level
  const grouped = useMemo(() => {
    const map: Record<NeedLevel, GemstoneRecommendation[]> = {
      critical: [],
      recommended: [],
      optional: [],
      not_needed: [],
    };
    for (const rec of recommendations) {
      map[rec.needLevel].push(rec);
    }
    return map;
  }, [recommendations]);

  const [expandNotNeeded, setExpandNotNeeded] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gold-light mb-2">
          {isEn ? 'Gemstone & Mantra Remedies' : 'रत्न एवं मन्त्र उपाय'}
        </h2>
        <p className="text-text-secondary text-sm max-w-2xl mx-auto">
          {isEn
            ? 'Personalized recommendations based on planetary strength, dignity, and placement in your birth chart. Always consult a qualified jyotishi before wearing gemstones.'
            : 'आपकी जन्मकुण्डली में ग्रहों की स्थिति, बल और गरिमा के आधार पर व्यक्तिगत अनुशंसाएँ। रत्न धारण करने से पहले सदैव किसी योग्य ज्योतिषी से परामर्श करें।'}
        </p>
      </div>

      {/* Grouped sections */}
      {NEED_ORDER.map((level) => {
        const items = grouped[level];
        if (items.length === 0) return null;

        const config = NEED_LEVEL_CONFIG[level];
        const isCollapsed = level === 'not_needed' && !expandNotNeeded;

        return (
          <div key={level} className="space-y-4">
            {/* Section header */}
            <div className="flex items-center gap-3">
              <div className={`h-2.5 w-2.5 rounded-full ${config.textColor.replace('text-', 'bg-')}`} />
              <h3 className={`text-lg font-semibold ${config.textColor}`}>
                {isEn ? config.label : config.labelHi}
                <span className="text-text-secondary/50 text-sm font-normal ml-2">
                  ({items.length})
                </span>
              </h3>
              {level === 'not_needed' && (
                <button
                  onClick={() => setExpandNotNeeded(!expandNotNeeded)}
                  className="text-xs text-text-secondary/60 hover:text-gold-light transition-colors ml-auto"
                >
                  {isCollapsed
                    ? (isEn ? 'Show' : 'दिखाएँ')
                    : (isEn ? 'Hide' : 'छिपाएँ')}
                </button>
              )}
            </div>

            {/* Cards */}
            {!isCollapsed && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((rec) => (
                  <GemstoneCard
                    key={rec.planetId}
                    rec={rec}
                    locale={locale}
                    isEn={isEn}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── GemstoneCard ───────────────────────────────────────────────────────────

function GemstoneCard({
  rec,
  locale,
  isEn,
}: {
  rec: GemstoneRecommendation;
  locale: string;
  isEn: boolean;
}) {
  const [expanded, setExpanded] = useState(rec.needLevel === 'critical' || rec.needLevel === 'recommended');
  const config = NEED_LEVEL_CONFIG[rec.needLevel];
  const gemColor = GEMSTONE_COLORS[rec.planetId] ?? '#d4a853';
  const remedy = rec.remedy;
  const planetName = tl(rec.planetName, locale);

  return (
    <div
      className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border ${config.borderColor} rounded-2xl overflow-hidden transition-all`}
    >
      {/* Header bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        {/* Planet color dot */}
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: GRAHAS[rec.planetId]?.color ?? '#d4a853' }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-semibold text-text-primary truncate">{planetName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}>
              {isEn ? config.label : config.labelHi}
            </span>
          </div>
          {/* Score bar */}
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${config.barColor} transition-all`}
              style={{ width: `${rec.needScore}%` }}
            />
          </div>
          <div className="text-[10px] text-text-secondary/50 mt-0.5 text-right">
            {rec.needScore}/100
          </div>
        </div>
        {/* Expand icon */}
        <svg
          className={`w-4 h-4 text-text-secondary/40 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          {/* Reasons */}
          {rec.reasons.length > 0 && (
            <div>
              <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
                {isEn ? 'Analysis' : 'विश्लेषण'}
              </h4>
              <ul className="space-y-1">
                {rec.reasons.map((reason, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-gold-dark mt-1 shrink-0">--</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gemstone */}
          <div>
            <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
              {isEn ? 'Primary Gemstone' : 'प्राथमिक रत्न'}
            </h4>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-lg border border-white/10 shrink-0"
                style={{ backgroundColor: gemColor, opacity: 0.85 }}
              />
              <div>
                <span className="text-text-primary font-medium text-sm">
                  {tl(remedy.gemstone.name, locale)}
                </span>
                <div className="text-text-secondary/60 text-xs">
                  {remedy.gemstone.weight} | {tl(remedy.gemstone.metal, locale)}
                </div>
              </div>
            </div>
            {/* Alternatives */}
            {remedy.gemstone.alternates.length > 0 && (
              <p className="text-xs text-text-secondary/50">
                {isEn ? 'Alternatives: ' : 'विकल्प: '}
                {remedy.gemstone.alternates.map(a => tl(a, locale)).join(', ')}
              </p>
            )}
          </div>

          {/* Wearing rules */}
          <div>
            <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
              {isEn ? 'Wearing Rules' : 'धारण नियम'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/[0.02] rounded-lg px-3 py-2">
                <span className="text-text-secondary/50 block">{isEn ? 'Finger' : 'अँगुली'}</span>
                <span className="text-text-primary">{tl(remedy.gemstone.finger, locale)}</span>
              </div>
              <div className="bg-white/[0.02] rounded-lg px-3 py-2">
                <span className="text-text-secondary/50 block">{isEn ? 'Metal' : 'धातु'}</span>
                <span className="text-text-primary">{tl(remedy.gemstone.metal, locale)}</span>
              </div>
              <div className="bg-white/[0.02] rounded-lg px-3 py-2">
                <span className="text-text-secondary/50 block">{isEn ? 'Day' : 'दिन'}</span>
                <span className="text-text-primary">{tl(remedy.charity.day, locale)}</span>
              </div>
              <div className="bg-white/[0.02] rounded-lg px-3 py-2">
                <span className="text-text-secondary/50 block">{isEn ? 'Color' : 'रंग'}</span>
                <span className="text-text-primary">{tl(remedy.color, locale)}</span>
              </div>
            </div>
          </div>

          {/* Mantra */}
          <div>
            <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
              {isEn ? 'Beej Mantra' : 'बीज मन्त्र'}
            </h4>
            <div className="bg-gradient-to-r from-[#2d1b69]/30 to-[#1a1040]/30 border border-gold-primary/10 rounded-xl px-4 py-3">
              <p className="text-gold-light font-medium text-sm leading-relaxed">
                {tl(remedy.beejMantra, 'hi')}
              </p>
              {locale === 'en' && (
                <p className="text-text-secondary/60 text-xs mt-1">
                  {tl(remedy.beejMantra, 'en')}
                </p>
              )}
              <p className="text-text-secondary/40 text-xs mt-2">
                {isEn ? `Japa count: ${remedy.count.toLocaleString()}` : `जप संख्या: ${remedy.count.toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* Charity */}
          <div>
            <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-2">
              {isEn ? 'Charity & Fasting' : 'दान एवं व्रत'}
            </h4>
            <p className="text-sm text-text-secondary">{tl(remedy.charity.items, locale)}</p>
            <p className="text-xs text-text-secondary/60 mt-1">{tl(remedy.fasting, locale)}</p>
          </div>

          {/* Cautions */}
          {rec.cautions.length > 0 && (
            <div>
              {rec.cautions.map((c, i) => (
                <div
                  key={i}
                  className="bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl px-4 py-3 text-xs leading-relaxed mt-2"
                >
                  <span className="font-semibold mr-1">{isEn ? 'Caution:' : 'सावधानी:'}</span>
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
