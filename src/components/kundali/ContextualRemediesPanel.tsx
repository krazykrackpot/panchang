'use client';

import { useState, useMemo } from 'react';
import {
  generateRemedyReport,
  type ContextualRemedy,
  type RemedyAction,
  type RemedyReport,
} from '@/lib/remedies/contextual-remedies';
import GrahaShanti from './GrahaShanti';
import {
  AlertTriangle,
  ChevronDown,
  CheckCircle,
  BookOpen,
  Gem,
  Heart,
  Flame,
  Sparkles,
  Compass,
  Shield,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface ContextualRemediesPanelProps {
  planets: Array<{
    id: number;
    longitude: number;
    sign: number;
    house: number;
    isRetrograde: boolean;
    isDebilitated: boolean;
    isCombust: boolean;
  }>;
  ascendantSign: number;
  yogas?: Array<{ name: string; present: boolean; type?: string }>;
  dashas?: Array<{ planet: string; startDate: string; endDate: string }>;
  sadeSatiPhase?: string | null;
  locale: string;
}

// ─── Module-level constants ─────────────────────────────────────────────────

const SEVERITY_CONFIG = {
  severe: {
    label: { en: 'Severe', hi: 'गंभीर' },
    bgColor: 'bg-red-500/8',
    borderColor: 'border-red-500/25',
    badgeBg: 'bg-red-500/20',
    badgeText: 'text-red-400',
    dotColor: 'bg-red-400',
  },
  moderate: {
    label: { en: 'Moderate', hi: 'मध्यम' },
    bgColor: 'bg-orange-500/8',
    borderColor: 'border-orange-500/25',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-400',
    dotColor: 'bg-orange-400',
  },
  mild: {
    label: { en: 'Mild', hi: 'हल्का' },
    bgColor: 'bg-amber-500/8',
    borderColor: 'border-amber-500/20',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-400',
    dotColor: 'bg-amber-400',
  },
} as const;

const REMEDY_TYPE_ICON: Record<RemedyAction['type'], typeof BookOpen> = {
  mantra: BookOpen,
  gemstone: Gem,
  charity: Heart,
  fasting: Flame,
  puja: Sparkles,
  lifestyle: Compass,
  yantra: Shield,
};

const REMEDY_TYPE_LABEL: Record<RemedyAction['type'], { en: string; hi: string }> = {
  mantra: { en: 'Mantra', hi: 'मंत्र' },
  gemstone: { en: 'Gemstone', hi: 'रत्न' },
  charity: { en: 'Charity', hi: 'दान' },
  fasting: { en: 'Fasting', hi: 'व्रत' },
  puja: { en: 'Puja', hi: 'पूजा' },
  lifestyle: { en: 'Lifestyle', hi: 'जीवनशैली' },
  yantra: { en: 'Yantra', hi: 'यंत्र' },
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function ContextualRemediesPanel({
  planets,
  ascendantSign,
  yogas,
  dashas,
  sadeSatiPhase,
  locale,
}: ContextualRemediesPanelProps) {
  const isEn = locale === 'en' || locale === 'ta';

  const report: RemedyReport = useMemo(
    () =>
      generateRemedyReport({
        planets,
        ascendantSign,
        yogas,
        dashas,
        sadeSatiPhase,
      }),
    [planets, ascendantSign, yogas, dashas, sadeSatiPhase],
  );

  // No afflictions — show positive message
  if (report.afflictions.length === 0) {
    return (
      <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-6 text-center">
        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-emerald-300 font-semibold text-lg mb-2">
          {isEn ? 'No Significant Afflictions' : 'कोई महत्वपूर्ण दोष नहीं'}
        </h3>
        <p className="text-text-secondary text-sm max-w-lg mx-auto">
          {isEn ? report.summary.en : report.summary.hi}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-[#2d1b69]/30 to-[#1a1040]/20 border border-gold-primary/15 rounded-2xl p-5">
        <h3 className="text-gold-light font-semibold text-lg mb-2">
          {isEn ? 'Chart Afflictions & Contextual Remedies' : 'कुंडली दोष एवं प्रासंगिक उपाय'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isEn ? report.summary.en : report.summary.hi}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {report.afflictions.map((a) => {
            const cfg = SEVERITY_CONFIG[a.severity];
            return (
              <span key={a.affliction} className={`text-xs px-2.5 py-1 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}>
                {isEn ? a.afflictionName.en : a.afflictionName.hi}
              </span>
            );
          })}
        </div>
      </div>

      {/* Affliction cards */}
      {report.afflictions.map((affliction) => (
        <AfflictionCard
          key={affliction.affliction}
          affliction={affliction}
          locale={locale}
          isEn={isEn}
        />
      ))}
    </div>
  );
}

// ─── AfflictionCard ─────────────────────────────────────────────────────────

function AfflictionCard({
  affliction,
  locale,
  isEn,
}: {
  affliction: ContextualRemedy;
  locale: string;
  isEn: boolean;
}) {
  const [expanded, setExpanded] = useState(affliction.severity === 'severe');
  const [expandedShanti, setExpandedShanti] = useState<number | null>(null);
  const cfg = SEVERITY_CONFIG[affliction.severity];

  // Collect unique planetIds from remedies that have type 'puja' for Graha Shanti expansion
  const pujaRemedyPlanetIds = useMemo(() => {
    const ids = new Set<number>();
    for (const r of affliction.remedies) {
      if (r.type === 'puja' && r.planetId !== undefined) {
        ids.add(r.planetId);
      }
    }
    return Array.from(ids);
  }, [affliction.remedies]);

  return (
    <div className={`${cfg.bgColor} border ${cfg.borderColor} rounded-2xl overflow-hidden transition-all`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className={`w-2.5 h-2.5 rounded-full ${cfg.dotColor} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-text-primary text-sm">
              {isEn ? affliction.afflictionName.en : affliction.afflictionName.hi}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}>
              {isEn ? cfg.label.en : cfg.label.hi}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-text-secondary/40 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-white/5 pt-4">
          {/* Explanation */}
          <div className="bg-gradient-to-r from-[#2d1b69]/20 to-transparent rounded-xl px-4 py-3 border-l-2 border-gold-primary/30">
            <p className="text-text-secondary text-sm leading-relaxed">
              {isEn ? affliction.explanation.en : affliction.explanation.hi}
            </p>
          </div>

          {/* Remedies list */}
          <div>
            <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-3">
              {isEn ? 'Recommended Remedies' : 'अनुशंसित उपाय'}
            </h4>
            <div className="space-y-3">
              {affliction.remedies.map((remedy, i) => {
                const Icon = REMEDY_TYPE_ICON[remedy.type] ?? BookOpen;
                const typeLabel = REMEDY_TYPE_LABEL[remedy.type] ?? { en: remedy.type, hi: remedy.type };
                return (
                  <div
                    key={i}
                    className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-gold-primary/10 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-gold-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-text-primary font-medium text-sm">
                            {isEn ? remedy.title.en : remedy.title.hi}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded bg-gold-primary/10 text-gold-dark">
                            {isEn ? typeLabel.en : typeLabel.hi}
                          </span>
                          {remedy.frequency && (
                            <span className="text-xs text-text-secondary/50">
                              {remedy.frequency}
                            </span>
                          )}
                        </div>
                        <p className="text-text-secondary text-xs leading-relaxed">
                          {isEn ? remedy.description.en : remedy.description.hi}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Graha Shanti expandable for puja remedies */}
          {pujaRemedyPlanetIds.length > 0 && (
            <div>
              <h4 className="text-gold-light font-semibold text-xs uppercase tracking-wider mb-3">
                {isEn ? 'Graha Shanti Puja Details' : 'ग्रह शान्ति पूजा विवरण'}
              </h4>
              <div className="space-y-2">
                {pujaRemedyPlanetIds.map((pid) => (
                  <div key={pid} className="border border-white/5 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedShanti(expandedShanti === pid ? null : pid)}
                      className="w-full px-4 py-2.5 flex items-center gap-2 text-left hover:bg-white/[0.02] transition-colors text-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-gold-primary shrink-0" />
                      <span className="text-text-primary flex-1">
                        {isEn ? 'View Full Shanti Vidhi' : 'पूर्ण शान्ति विधि देखें'}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-text-secondary/40 transition-transform ${expandedShanti === pid ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedShanti === pid && (
                      <div className="px-4 pb-4 border-t border-white/5 pt-3">
                        <GrahaShanti planetId={pid} locale={locale} inline />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
