'use client';

import React, { useState, useMemo } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { calculateNadiAmsha } from '@/lib/kundali/nadi-amsha';
import type { NadiAmshaPosition } from '@/lib/kundali/nadi-amsha';
import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';

const PLANET_COLORS: Record<number, string> = {
  0: 'text-amber-400', 1: 'text-slate-300', 2: 'text-red-400', 3: 'text-emerald-400',
  4: 'text-yellow-300', 5: 'text-pink-300', 6: 'text-blue-400', 7: 'text-purple-400', 8: 'text-gray-400',
  [-1]: 'text-gold-light',
};

interface Props {
  kundali: KundaliData;
  locale: Locale;
}

export default function NadiAmshaTab({ kundali, locale }: Props) {
  const isTamil = String(locale) === 'ta';
  const isLatin = locale === 'en' || isTamil;
  const [expandedPlanet, setExpandedPlanet] = useState<number | null>(null);

  const nadiChart = useMemo(() => calculateNadiAmsha(kundali), [kundali]);

  const allPositions: NadiAmshaPosition[] = useMemo(
    () => [nadiChart.ascendantNadi, ...nadiChart.positions],
    [nadiChart]
  );

  const toggle = (pid: number) => {
    setExpandedPlanet(prev => prev === pid ? null : pid);
  };

  const getD1SignName = (signId: number): string => {
    const r = RASHIS.find(rs => rs.id === signId);
    return r ? tl(r.name, locale) : '?';
  };

  return (
    <div className="space-y-6">
      {/* What is Nadi Amsha */}
      <div className="bg-white/[0.02] border border-gold-primary/10 rounded-xl p-5 space-y-3">
        <h3 className="text-gold-light font-semibold text-sm">
          {isLatin ? 'What is Nadi Amsha (D-150)?' : 'नाडी अंश (D-150) क्या है?'}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {isLatin
            ? 'Nadi Amsha is the 150th divisional chart (D-150) — the finest subdivision in Vedic astrology. Each zodiac sign (30°) is divided into 150 equal parts of 0.2° (12 arc-minutes) each. At this microscopic level, even twins born minutes apart can have different Nadi positions, revealing unique karmic signatures invisible in coarser charts like D-1 (Rashi) or D-9 (Navamsha).'
            : 'नाडी अंश 150वां विभागीय चार्ट (D-150) है — वैदिक ज्योतिष में सबसे सूक्ष्म विभाजन। प्रत्येक राशि (30°) को 0.2° (12 कला-मिनट) के 150 समान भागों में विभाजित किया जाता है। इस सूक्ष्म स्तर पर, मिनटों के अन्तर से जन्मे जुड़वाँ बच्चों की भी अलग-अलग नाडी स्थितियाँ हो सकती हैं।'}
        </p>
        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
            <p className="text-gold-light font-medium mb-1">{isLatin ? 'Nadi Number (1-150)' : 'नाडी संख्या (1-150)'}</p>
            <p className="text-text-secondary">{isLatin ? 'Which of the 150 micro-divisions the planet occupies within its D-1 sign. Lower numbers = early in the sign, higher = late.' : 'ग्रह अपनी D-1 राशि के 150 सूक्ष्म भागों में से किसमें है।'}</p>
          </div>
          <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
            <p className="text-gold-light font-medium mb-1">{isLatin ? 'D-150 Sign' : 'D-150 राशि'}</p>
            <p className="text-text-secondary">{isLatin ? 'The zodiac sign this Nadi division maps to. It reveals the subtle karmic coloring of the planet beyond what the birth chart shows.' : 'यह नाडी विभाजन किस राशि से मेल खाता है, जो ग्रह का सूक्ष्म कार्मिक रंग दर्शाता है।'}</p>
          </div>
          <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
            <p className="text-gold-light font-medium mb-1">{isLatin ? 'Karmic Theme' : 'कर्म विषय'}</p>
            <p className="text-text-secondary">{isLatin ? 'The deep karmic pattern revealed by this placement — past-life tendencies, soul-level lessons, and latent gifts that unfold over a lifetime.' : 'इस स्थिति द्वारा प्रकट गहन कार्मिक प्रतिरूप — पूर्वजन्म प्रवृत्तियाँ और आत्मा-स्तरीय शिक्षाएँ।'}</p>
          </div>
        </div>
      </div>

      {/* Birth time sensitivity warning */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-300/90">
          {isLatin
            ? 'D-150 (Nadi Amsha) requires highly accurate birth time. A difference of \u00b12 minutes can change positions. Treat these results as indicative if birth time is approximate.'
            : 'D-150 (नाडी अंश) में अत्यन्त सटीक जन्म समय आवश्यक है। \u00b12 मिनट का अन्तर स्थिति बदल सकता है। यदि जन्म समय अनुमानित है तो इन परिणामों को संकेतात्मक मानें।'}
        </p>
      </div>

      {/* Summary table */}
      <div className="overflow-x-auto rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold-primary/20">
              <th className="text-left px-4 py-3 text-gold-light font-semibold">
                {isLatin ? 'Planet' : 'ग्रह'}
              </th>
              <th className="text-center px-4 py-3 text-gold-light font-semibold">
                {isLatin ? 'D1 Sign' : 'D1 राशि'}
              </th>
              <th className="text-center px-4 py-3 text-gold-light font-semibold">
                {isLatin ? 'Nadi #' : 'नाडी #'}
              </th>
              <th className="text-center px-4 py-3 text-gold-light font-semibold">
                {isLatin ? 'D-150 Sign' : 'D-150 राशि'}
              </th>
              <th className="text-left px-4 py-3 text-gold-light font-semibold hidden sm:table-cell">
                {isLatin ? 'Karmic Theme' : 'कर्म विषय'}
              </th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((pos) => (
              <tr
                key={pos.planetId}
                className="border-b border-gold-primary/10 hover:bg-gold-primary/5 transition-colors cursor-pointer"
                onClick={() => toggle(pos.planetId)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {pos.planetId >= 0 && (
                      <GrahaIconById id={pos.planetId} className="w-5 h-5" />
                    )}
                    <span className={`font-medium ${PLANET_COLORS[pos.planetId] ?? 'text-text-primary'}`}>
                      {tl(pos.planetName, locale)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-text-primary">
                  {getD1SignName(pos.d1Sign)}
                </td>
                <td className="px-4 py-3 text-center font-mono text-gold-primary">
                  {pos.nadiAmshaNumber}
                </td>
                <td className="px-4 py-3 text-center text-text-primary">
                  {tl(pos.nadiSignName, locale)}
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs hidden sm:table-cell max-w-xs truncate">
                  {pos.karmicTheme}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail cards */}
      <div className="space-y-3">
        <h3 className="text-gold-light font-semibold text-base">
          {isLatin ? 'Detailed Karmic Insights' : 'विस्तृत कर्म अन्तर्दृष्टि'}
        </h3>
        {allPositions.map((pos) => {
          const isExpanded = expandedPlanet === pos.planetId;
          return (
            <div
              key={pos.planetId}
              className="rounded-xl border border-gold-primary/15 bg-bg-secondary/40 overflow-hidden"
            >
              <button
                onClick={() => toggle(pos.planetId)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold-primary/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {pos.planetId >= 0 && (
                    <GrahaIconById id={pos.planetId} className="w-6 h-6" />
                  )}
                  <div className="text-left">
                    <span className={`font-semibold ${PLANET_COLORS[pos.planetId] ?? 'text-text-primary'}`}>
                      {tl(pos.planetName, locale)}
                    </span>
                    <span className="text-text-secondary text-xs ml-2">
                      {isLatin ? 'Nadi' : 'नाडी'} {pos.nadiAmshaNumber} {isLatin ? 'of' : '—'} {getD1SignName(pos.d1Sign)} → {tl(pos.nadiSignName, locale)}
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gold-primary/60" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gold-primary/60" />
                )}
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-gold-primary/10">
                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                    <div>
                      <span className="text-text-secondary">{isLatin ? 'Longitude' : 'रेखांश'}:</span>
                      <span className="text-text-primary ml-1">{pos.longitude.toFixed(4)}°</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">{isLatin ? 'D1 Sign' : 'D1 राशि'}:</span>
                      <span className="text-text-primary ml-1">{getD1SignName(pos.d1Sign)}</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">{isLatin ? 'Nadi Amsha' : 'नाडी अंश'}:</span>
                      <span className="text-gold-primary ml-1 font-mono">{pos.nadiAmshaNumber}/150</span>
                    </div>
                    <div>
                      <span className="text-text-secondary">{isLatin ? 'D-150 Sign' : 'D-150 राशि'}:</span>
                      <span className="text-text-primary ml-1">{tl(pos.nadiSignName, locale)}</span>
                    </div>
                  </div>
                  <div className="bg-gold-primary/5 rounded-lg p-3 border border-gold-primary/10">
                    <p className="text-sm text-text-primary leading-relaxed">
                      {pos.karmicTheme}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
