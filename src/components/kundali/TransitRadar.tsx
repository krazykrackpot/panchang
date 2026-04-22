'use client';

import { tl } from '@/lib/utils/trilingual';
import { useMemo } from 'react';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { computePersonalTransits, computeUpcomingTransitions } from '@/lib/transit/personal-transits';
import { analyzeDoubleTransit } from '@/lib/transit/gochara-engine';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface TransitRadarProps {
  ascendantSign: number;
  savTable: number[];
  locale: string;
  natalMoonSign?: number;
  reducedBav?: number[][];
}


const LABELS = {
  title: { en: "Transit Radar — What's Activating Your Chart", hi: "गोचर राडार — आपकी कुण्डली पर वर्तमान प्रभाव", sa: "गोचर राडार — आपकी कुण्डली पर वर्तमान प्रभाव" },
  subtitle: { en: 'Current slow-planet positions mapped to your Ashtakavarga strength', hi: 'धीमे ग्रहों की वर्तमान स्थिति और आपकी अष्टकवर्ग शक्ति', sa: 'धीमे ग्रहों की वर्तमान स्थिति और आपकी अष्टकवर्ग शक्ति' },
  upcoming: { en: 'Upcoming Sign Changes (Next 6 Months)', hi: 'आगामी परिवर्तन (अगले 6 माह)', sa: 'आगामी परिवर्तन (अगले 6 माह)' },
};

export default function TransitRadar({ ascendantSign, savTable, locale, natalMoonSign, reducedBav }: TransitRadarProps) {
  const isHi = isDevanagariLocale(locale);
  const transits = useMemo(
    () => computePersonalTransits(ascendantSign, savTable, natalMoonSign, reducedBav),
    [ascendantSign, savTable, natalMoonSign, reducedBav]
  );
  const upcoming = useMemo(() => computeUpcomingTransitions(), []);

  if (transits.length === 0) return null;

  const QUALITY_STYLES: Record<string, { bg: string; border: string; text: string }> = {
    strong: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    moderate: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    neutral: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    weak: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
    adverse: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
  };

  return (
    <section className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
      {/* Header */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
        <h3 className="text-xl text-gold-light font-bold">
          {tl(LABELS.title, locale)}
        </h3>
        <p className="text-text-secondary/60 text-xs mt-1">
          {tl(LABELS.subtitle, locale)}
        </p>
      </div>

      {/* Transit rows */}
      <div className="px-6 sm:px-8 pb-4 space-y-3">
        {transits.map(t => {
          // Blend SAV quality with Gochara quality — use the more favorable of the two.
          // Gochara alone is too harsh (most houses are "bad"), SAV alone ignores classical rules.
          // Ranking: strong > moderate/neutral > weak > adverse
          const QUALITY_RANK: Record<string, number> = { strong: 4, moderate: 3, neutral: 3, weak: 2, adverse: 1 };
          const savRank = QUALITY_RANK[t.quality] ?? 3;
          const gocharaRank = t.gocharaQuality ? (QUALITY_RANK[t.gocharaQuality] ?? 3) : savRank;
          const blendedRank = Math.max(savRank, gocharaRank);
          // If Gochara says favorable (good house + no vedha), boost to strong
          const effectiveQuality = t.isGoodHouse && !t.vedhaActive ? 'strong'
            : t.vedhaActive ? 'adverse'
            : blendedRank >= 4 ? 'strong'
            : blendedRank >= 3 ? 'neutral'
            : blendedRank >= 2 ? 'weak'
            : 'adverse';
          const style = QUALITY_STYLES[effectiveQuality] || QUALITY_STYLES.neutral;
          return (
            <div key={t.planetId} className={`flex items-center gap-3 p-3 rounded-xl ${style.bg} border ${style.border}`}>
              <div className="w-10 h-10 rounded-lg bg-bg-primary/50 border border-white/10 flex items-center justify-center shrink-0">
                <GrahaIconById id={t.planetId} size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm" style={{ color: t.planetColor }}>
                    {isHi ? t.planetName.hi : t.planetName.en}
                  </span>
                  <span className="text-text-secondary/60 text-xs">
                    → {isHi ? t.signName.hi : t.signName.en} (H{t.house})
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${style.text} ${style.bg} border ${style.border}`}>
                    {t.savBindu} bindu
                  </span>
                  {/* Gochara annotations */}
                  {t.houseFromMoon !== undefined && (
                    <span className="text-[10px] text-text-secondary ml-1">
                      H{t.houseFromMoon}<span className="text-text-secondary/40"> from Moon</span>
                    </span>
                  )}
                  {t.vedhaActive && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-red-500/15 text-red-400 border border-red-500/20">
                      {isHi ? 'वेध' : 'Vedha'}
                      {t.vedhaPlanetName ? ` (${t.vedhaPlanetName})` : ''}
                    </span>
                  )}
                  {t.isGoodHouse === true && !t.vedhaActive && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      {isHi ? 'शुभ' : 'Favorable'}
                    </span>
                  )}
                  {t.bavScore !== undefined && (
                    <span className="ml-1 text-[9px] text-text-secondary/60">
                      BAV:{t.bavScore}
                    </span>
                  )}
                </div>
                <p className="text-text-secondary/75 text-xs mt-0.5 truncate">
                  {isHi ? t.interpretation.hi : t.interpretation.en}
                  {t.isGoodHouse === true && !t.vedhaActive && (isHi ? ' — गोचर अनुकूल' : ' — Gochara favorable')}
                  {t.vedhaActive && (isHi ? ' — वेध से बाधित' : ' — obstructed by Vedha')}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Double Transit section */}
      {natalMoonSign !== undefined && (() => {
        const jupiterSign = transits.find(t => t.planetId === 4)?.currentSign;
        const saturnSign = transits.find(t => t.planetId === 6)?.currentSign;
        if (!jupiterSign || !saturnSign) return null;

        const doubleTransits = analyzeDoubleTransit(jupiterSign, saturnSign, natalMoonSign);
        const active = doubleTransits.filter(d => d.doubleTransitActive);
        if (active.length === 0) return null;

        const HOUSE_DOMAINS: Record<number, { en: string; hi: string }> = {
          1: { en: 'Self, health, new beginnings', hi: 'आत्मा, स्वास्थ्य, नई शुरुआत' },
          2: { en: 'Wealth, family, speech', hi: 'धन, परिवार, वाणी' },
          3: { en: 'Courage, siblings, short travels', hi: 'साहस, भाई-बहन, लघु यात्रा' },
          4: { en: 'Home, mother, property, comfort', hi: 'घर, माता, सम्पत्ति, सुख' },
          5: { en: 'Children, education, creativity', hi: 'संतान, शिक्षा, रचनात्मकता' },
          6: { en: 'Health challenges, enemies, service', hi: 'स्वास्थ्य चुनौती, शत्रु, सेवा' },
          7: { en: 'Marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार' },
          8: { en: 'Transformation, longevity, sudden events', hi: 'परिवर्तन, आयु, अचानक घटनाएं' },
          9: { en: 'Fortune, dharma, higher learning', hi: 'भाग्य, धर्म, उच्च शिक्षा' },
          10: { en: 'Career, reputation, authority', hi: 'करियर, प्रतिष्ठा, अधिकार' },
          11: { en: 'Gains, income, aspirations', hi: 'लाभ, आय, आकांक्षाएं' },
          12: { en: 'Expenses, moksha, foreign lands', hi: 'व्यय, मोक्ष, विदेश' },
        };

        return (
          <div className="mx-6 sm:mx-8 mb-4 pt-4 border-t border-gold-primary/10">
            <h4 className="text-gold-dark text-[10px] uppercase tracking-wider font-bold mb-2">
              {isHi ? 'द्वि-गोचर सक्रिय — गुरु + शनि' : 'Double Transit — Jupiter + Saturn'}
            </h4>
            <p className="text-text-secondary/60 text-[9px] mb-2">
              {isHi
                ? 'गुरु और शनि दोनों इन भावों को दृष्टि/स्थिति से सक्रिय कर रहे हैं — इन क्षेत्रों में घटनाएं प्रकट हो सकती हैं।'
                : 'Both Jupiter and Saturn activate these houses by aspect or placement — events in these life areas may manifest.'}
            </p>
            <div className="space-y-1.5">
              {active.map(d => {
                const domain = HOUSE_DOMAINS[d.house] || HOUSE_DOMAINS[1];
                return (
                  <div key={d.house} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/8 border border-purple-500/15">
                    <span className="text-purple-300 font-bold text-sm w-8">H{d.house}</span>
                    <span className="text-text-secondary text-xs">{isHi ? domain.hi : domain.en}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Upcoming transitions */}
      {upcoming.length > 0 && (
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <h4 className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">
            {tl(LABELS.upcoming, locale)}
          </h4>
          <div className="space-y-1.5">
            {upcoming.map((u, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-text-secondary/70">
                <GrahaIconById id={u.planetId} size={14} />
                <span className="font-medium text-text-secondary">
                  {isHi ? u.planetName.hi : u.planetName.en}
                </span>
                <span>→</span>
                <span className="text-gold-light">{isHi ? u.toSign.hi : u.toSign.en}</span>
                <span className="text-text-secondary/50 ml-auto">{u.approximateDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
