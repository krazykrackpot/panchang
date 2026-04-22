'use client';

import { useState } from 'react';
import type { VedicProfile as VedicProfileType } from '@/lib/kundali/vedic-profile';
import { UI_LABELS, bt } from '@/lib/kundali/vedic-profile-templates';

interface VedicProfileProps {
  profile: VedicProfileType;
  locale: string;
}

export default function VedicProfile({ profile, locale }: VedicProfileProps) {
  const [expanded, setExpanded] = useState(false);

  const l = (label: { en: string; hi: string }) => bt(label, locale);

  return (
    <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-xl font-semibold text-gold-light tracking-wide">
          {l(UI_LABELS.profileTitle)}: {profile.personName}
        </h2>
      </div>

      {/* Always visible: Hook + Core Identity + Standout */}
      <div className="px-6 pb-4 space-y-4">
        {/* Hook — only render if non-empty to avoid a styled empty container */}
        {profile.hook && (
          <p className="text-text-primary leading-relaxed text-[15px] italic border-l-2 border-gold-primary/30 pl-4">
            {profile.hook}
          </p>
        )}

        {/* Core Identity */}
        <div>
          <h3 className="text-sm font-medium text-gold-primary/70 uppercase tracking-wider mb-2">
            {l(UI_LABELS.coreIdentity)}
          </h3>
          <div className="space-y-3 text-text-primary leading-relaxed text-[15px]">
            <p dangerouslySetInnerHTML={{ __html: markdownBold(profile.coreIdentity.lagna) }} />
            <p dangerouslySetInnerHTML={{ __html: markdownBold(profile.coreIdentity.moon) }} />
          </div>
        </div>

        {/* Standout Observation */}
        {profile.standout && (
          <p className="text-text-primary leading-relaxed text-[15px]">
            {profile.standout}
          </p>
        )}
      </div>

      {/* Expandable sections */}
      <div
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{ maxHeight: expanded ? '5000px' : '0px', opacity: expanded ? 1 : 0 }}
      >
        <div className="px-6 pb-6 space-y-6">
          {/* Gold divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />

          {/* Key Planetary Observations */}
          {profile.planetaryObservations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gold-primary/70 uppercase tracking-wider mb-2">
                {l(UI_LABELS.keyObservations)}
              </h3>
              <div className="space-y-3 text-text-primary leading-relaxed text-[15px]">
                {profile.planetaryObservations.map((obs, i) => (
                  <p key={i}>{obs}</p>
                ))}
              </div>
            </div>
          )}

          {/* Nakshatra Insight */}
          {profile.nakshatraInsight && (
            <div>
              <h3 className="text-sm font-medium text-gold-primary/70 uppercase tracking-wider mb-2">
                {l(UI_LABELS.nakshatraInsight)}
              </h3>
              <p className="text-text-primary leading-relaxed text-[15px]">
                {profile.nakshatraInsight}
              </p>
            </div>
          )}

          {/* Dasha Context */}
          {profile.dashaContext && (
            <div>
              <h3 className="text-sm font-medium text-gold-primary/70 uppercase tracking-wider mb-2">
                {l(UI_LABELS.dashaContext)}
              </h3>
              <p className="text-text-primary leading-relaxed text-[15px]">
                {profile.dashaContext}
              </p>
            </div>
          )}

          {/* Active Doshas */}
          {profile.doshaSection && (
            <div>
              <h3 className="text-sm font-medium text-gold-primary/70 uppercase tracking-wider mb-2">
                {l(UI_LABELS.activeDoshas)}
              </h3>
              <div className="space-y-2 text-text-primary leading-relaxed text-[15px]">
                {profile.doshaSection.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          )}

          {/* Strength Table */}
          {profile.strengthTable.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gold-primary/70 uppercase tracking-wider mb-2">
                {l(UI_LABELS.strengthSnapshot)}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold-primary/10">
                      <th className="text-left py-2 pr-4 text-text-secondary font-medium">{l(UI_LABELS.planet)}</th>
                      <th className="text-left py-2 pr-4 text-text-secondary font-medium">{l(UI_LABELS.dignity)}</th>
                      <th className="text-left py-2 pr-4 text-text-secondary font-medium">{l(UI_LABELS.house)}</th>
                      <th className="text-left py-2 text-text-secondary font-medium">{l(UI_LABELS.impact)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.strengthTable.map((row, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-2 pr-4 text-gold-light font-medium">{row.planet}</td>
                        <td className="py-2 pr-4 text-text-primary">{row.dignity}</td>
                        <td className="py-2 pr-4 text-text-secondary">{row.house}H</td>
                        <td className="py-2 text-text-secondary text-xs">{row.impact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expand/Collapse button */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 text-center text-sm text-gold-primary hover:text-gold-light transition-colors border-t border-gold-primary/10 cursor-pointer"
      >
        {expanded ? l(UI_LABELS.readLess) : l(UI_LABELS.readMore)}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 inline-block ml-1 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

/** Convert **bold** markdown to <strong> tags for inline rendering */
function markdownBold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-light">$1</strong>');
}
