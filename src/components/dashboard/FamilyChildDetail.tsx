'use client';

import type { RelationshipDynamics } from '@/lib/kundali/family-synthesis/types';
import { tl } from '@/lib/utils/trilingual';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import FamilyActionItems from './FamilyActionItems';

interface FamilyChildDetailProps {
  childName: string;
  dynamics: RelationshipDynamics;
  locale: string;
  onClose: () => void;
}

const LABELS = {
  bond:       { en: 'Parent-Child Bond', hi: 'माता-पिता-संतान बंधन' },
  synastry:   { en: 'Key Aspects', hi: 'मुख्य पहलू' },
  saptamsha:  { en: 'Saptamsha (D7)', hi: 'सप्तांश (D7)' },
  currentDyn: { en: 'Current Dynamics', hi: 'वर्तमान गतिशीलता' },
  actions:    { en: 'Parenting Guidance', hi: 'पालन-पोषण मार्गदर्शन' },
  forecast:   { en: 'Monthly Forecast', hi: 'मासिक पूर्वानुमान' },
  karmic:     { en: 'Karmic Connection', hi: 'कर्म संबंध' },
  close:      { en: 'Close', hi: 'बंद करें' },
};

function label(key: keyof typeof LABELS, locale: string): string {
  const obj = LABELS[key];
  return locale === 'hi' || locale === 'sa' ? obj.hi : obj.en;
}

export default function FamilyChildDetail({ childName, dynamics, locale, onClose }: FamilyChildDetailProps) {
  const headingStyle = getHeadingFont(locale);
  const bodyStyle = getBodyFont(locale);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-gold-light text-lg font-semibold" style={headingStyle}>
          {childName} — {label('bond', locale)}
        </h3>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary text-sm px-3 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
        >
          {label('close', locale)}
        </button>
      </div>

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

      {/* D7 Cross-Read */}
      <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/10 p-4">
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('saptamsha', locale)}
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
