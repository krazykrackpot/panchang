'use client';

import type { RelationshipDynamics } from '@/lib/kundali/family-synthesis/types';
import { tl } from '@/lib/utils/trilingual';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import FamilyActionItems from './FamilyActionItems';

interface FamilyMarriageDetailProps {
  dynamics: RelationshipDynamics;
  locale: string;
  onClose: () => void;
}

const LABELS = {
  title:        { en: 'Marriage Dynamics', hi: 'वैवाहिक गतिशीलता' },
  compatibility:{ en: 'Compatibility', hi: 'अनुकूलता' },
  gunaLabel:    { en: 'Guna Milan', hi: 'गुण मिलान' },
  synastry:     { en: 'Key Aspects', hi: 'मुख्य पहलू' },
  navamsha:     { en: 'Navamsha (D9)', hi: 'नवांश (D9)' },
  currentDyn:   { en: 'Current Dynamics', hi: 'वर्तमान गतिशीलता' },
  actions:      { en: 'Guidance', hi: 'मार्गदर्शन' },
  forecast:     { en: 'Monthly Forecast', hi: 'मासिक पूर्वानुमान' },
  karmic:       { en: 'Karmic Bonds', hi: 'कर्म बंधन' },
  close:        { en: 'Close', hi: 'बंद करें' },
};

function label(key: keyof typeof LABELS, locale: string): string {
  return tl(LABELS[key], locale);
}

export default function FamilyMarriageDetail({ dynamics, locale, onClose }: FamilyMarriageDetailProps) {
  const headingStyle = getHeadingFont(locale);
  const bodyStyle = getBodyFont(locale);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-gold-light text-lg font-semibold" style={headingStyle}>
          {label('title', locale)}
        </h3>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-text-secondary hover:text-text-primary text-sm px-3 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
        >
          {label('close', locale)}
        </button>
      </div>

      {/* Guna Milan */}
      {dynamics.gunaScore !== undefined && (
        <div className="rounded-xl bg-gold-primary/5 border border-gold-primary/15 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gold-light text-sm font-medium" style={headingStyle}>
              {label('gunaLabel', locale)}
            </span>
            <span className="text-gold-light font-mono text-lg font-bold">
              {dynamics.gunaScore}/36
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gold-primary transition-all"
              style={{ width: `${(dynamics.gunaScore / 36) * 100}%` }}
            />
          </div>
          {dynamics.gunaBreakdown && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {Object.entries(dynamics.gunaBreakdown).map(([kuta, score]) => (
                <div key={kuta} className="text-center">
                  <div className="text-text-secondary text-[10px] capitalize">{kuta}</div>
                  <div className="text-text-primary text-xs font-mono">{String(score)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top Synastry Aspects */}
      {dynamics.synastryHighlights.length > 0 && (
        <div>
          <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
            {label('synastry', locale)}
          </h4>
          <div className="space-y-2">
            {dynamics.synastryHighlights.slice(0, 5).map((asp, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  asp.nature === 'harmonious' ? 'bg-emerald-400' :
                  asp.nature === 'challenging' ? 'bg-red-400' : 'bg-amber-400'
                }`} />
                <span className="text-text-primary" style={bodyStyle}>
                  {asp.yourPlanet} {asp.aspect} {asp.theirPlanet}
                </span>
                <span className="text-text-secondary text-xs ml-auto">
                  {asp.orb}&deg;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navamsha Cross-Read */}
      <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/10 p-4">
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('navamsha', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyStyle}>
          {tl(dynamics.vargaCrossRead.narrative, locale)}
        </p>
      </div>

      {/* Current Dynamics */}
      <div>
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('currentDyn', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyStyle}>
          {tl(dynamics.currentDynamic, locale)}
        </p>
      </div>

      {/* Karmic Indicators */}
      {dynamics.karmicIndicators.length > 0 && (
        <div>
          <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
            {label('karmic', locale)}
          </h4>
          <div className="space-y-2">
            {dynamics.karmicIndicators.map((ki, i) => (
              <p key={i} className="text-text-secondary text-sm leading-relaxed" style={bodyStyle}>
                {tl(ki.description, locale)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      <div>
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('actions', locale)}
        </h4>
        <FamilyActionItems items={dynamics.actionItems} locale={locale} />
      </div>

      {/* Monthly Forecast */}
      <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/10 p-4">
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('forecast', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyStyle}>
          {tl(dynamics.monthlyForecast, locale)}
        </p>
      </div>
    </div>
  );
}
