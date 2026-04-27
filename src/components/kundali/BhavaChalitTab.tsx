'use client';

import { useState, useMemo } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { computeBhavaChalit, type BhavaChalitResult } from '@/lib/kundali/bhava-chalit';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';

interface BhavaChalitTabProps {
  ascendant: number;  // sidereal degree 0-360
  planets: Array<{ id: number; longitude: number; name?: { en?: string; hi?: string } }>;
  locale: string;
}

// House signification keywords (1-indexed)
const HOUSE_KEYWORDS: Record<number, { en: string; hi: string }> = {
  1:  { en: 'Self', hi: 'आत्म' },
  2:  { en: 'Wealth', hi: 'धन' },
  3:  { en: 'Courage', hi: 'साहस' },
  4:  { en: 'Home', hi: 'गृह' },
  5:  { en: 'Children', hi: 'संतान' },
  6:  { en: 'Enemies', hi: 'शत्रु' },
  7:  { en: 'Marriage', hi: 'विवाह' },
  8:  { en: 'Longevity', hi: 'आयु' },
  9:  { en: 'Dharma', hi: 'धर्म' },
  10: { en: 'Career', hi: 'कर्म' },
  11: { en: 'Gains', hi: 'लाभ' },
  12: { en: 'Liberation', hi: 'मोक्ष' },
};

const LABELS = {
  title: { en: 'Bhava Chalit Chart', hi: 'भाव चलित कुंडली' },
  summaryMinor: { en: 'Minor impact — most planets stay in their rashi houses', hi: 'न्यून प्रभाव — अधिकांश ग्रह अपने राशि भाव में हैं' },
  summaryModerate: { en: 'Moderate impact — several planets express through different houses', hi: 'मध्यम प्रभाव — कई ग्रह भिन्न भावों से कार्य करते हैं' },
  summarySignificant: { en: 'Significant impact — house interpretations differ substantially from rashi chart', hi: 'महत्वपूर्ण प्रभाव — भाव फलादेश राशि कुंडली से काफ़ी भिन्न हैं' },
  shiftedTitle: { en: 'Shifted Planets', hi: 'स्थानांतरित ग्रह' },
  allPlanetsTitle: { en: 'All Planets', hi: 'सभी ग्रह' },
  bhavaBoundaries: { en: 'Bhava Boundaries', hi: 'भाव सीमाएँ' },
  planet: { en: 'Planet', hi: 'ग्रह' },
  longitude: { en: 'Longitude', hi: 'रेखांश' },
  rashiSign: { en: 'Rashi Sign', hi: 'राशि' },
  rashiHouse: { en: 'Rashi House', hi: 'राशि भाव' },
  bhavaHouse: { en: 'Bhava House', hi: 'भाव' },
  shifted: { en: 'Shifted', hi: 'स्थानांतरित' },
  yes: { en: 'Yes', hi: 'हाँ' },
  no: { en: 'No', hi: 'नहीं' },
  bhava: { en: 'Bhava', hi: 'भाव' },
  madhya: { en: 'Madhya (Midpoint)', hi: 'मध्य (केन्द्र बिन्दु)' },
  sandhi: { en: 'Sandhi (Boundary)', hi: 'संधि (सीमा)' },
  ofNine: { en: 'of 9 planets shifted houses in the Bhava Chalit chart', hi: 'में से 9 ग्रहों ने भाव चलित कुंडली में भाव बदला' },
  eduNote: {
    en: 'The Bhava Chalit chart shows where planets actually fall when using the ascendant-based house system instead of the whole-sign system. Planets near the cusp of a sign may shift to the adjacent house, changing which life area they influence most strongly.',
    hi: 'भाव चलित कुंडली दर्शाती है कि लग्न-आधारित भाव पद्धति में ग्रह वास्तव में किस भाव में पड़ते हैं। राशि की सीमा के निकट स्थित ग्रह निकटवर्ती भाव में स्थानांतरित हो सकते हैं, जिससे उनका जीवन-क्षेत्र पर प्रभाव बदल जाता है।',
  },
  learnMore: { en: 'Learn more about Kundali', hi: 'कुंडली के बारे में और जानें' },
};

function l(obj: { en: string; hi: string }, locale: string): string {
  return locale === 'hi' ? obj.hi : obj.en;
}

function formatDeg(deg: number): string {
  const d = ((deg % 360) + 360) % 360;
  const sign = Math.floor(d / 30);
  const inSign = d - sign * 30;
  const dd = Math.floor(inSign);
  const mm = Math.floor((inSign - dd) * 60);
  return `${dd}°${mm.toString().padStart(2, '0')}'`;
}

function formatFullDeg(deg: number): string {
  const d = ((deg % 360) + 360) % 360;
  return `${d.toFixed(2)}°`;
}

export default function BhavaChalitTab({ ascendant, planets, locale }: BhavaChalitTabProps) {
  const [showBoundaries, setShowBoundaries] = useState(false);

  const result: BhavaChalitResult = useMemo(
    () => computeBhavaChalit(ascendant, planets),
    [ascendant, planets],
  );

  const shiftedPlanets = result.planets.filter(p => p.shifted);

  // Impact level
  const impactLevel: 'minor' | 'moderate' | 'significant' =
    result.shiftCount <= 2 ? 'minor' : result.shiftCount <= 4 ? 'moderate' : 'significant';

  const impactColors = {
    minor: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    moderate: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
    significant: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400' },
  };
  const colors = impactColors[impactLevel];

  const getGrahaColor = (planetId: number): string => {
    const graha = GRAHAS.find(g => g.id === planetId);
    return graha?.color || '#d4a853';
  };

  const getGrahaName = (planetId: number): string => {
    const graha = GRAHAS.find(g => g.id === planetId);
    if (!graha) return `Planet ${planetId}`;
    return tl(graha.name, locale);
  };

  const getRashiName = (longitude: number): string => {
    const signIdx = Math.floor(((longitude % 360) + 360) % 360 / 30); // 0-11
    const rashi = RASHIS[signIdx];
    if (!rashi) return '';
    return tl(rashi.name, locale);
  };

  return (
    <div className="space-y-6">
      {/* 1. Summary Card */}
      <div className={`rounded-xl p-5 ${colors.bg} border ${colors.border}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className={`w-3 h-3 rounded-full ${colors.dot} shrink-0`} />
          <h3 className={`text-lg font-bold ${colors.text}`}>
            {result.shiftCount} {l(LABELS.ofNine, locale)}
          </h3>
        </div>
        <p className="text-text-secondary text-sm ml-6">
          {impactLevel === 'minor' && l(LABELS.summaryMinor, locale)}
          {impactLevel === 'moderate' && l(LABELS.summaryModerate, locale)}
          {impactLevel === 'significant' && l(LABELS.summarySignificant, locale)}
        </p>
      </div>

      {/* 2. Shifted Planets (only if any) */}
      {shiftedPlanets.length > 0 && (
        <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/15 p-5">
          <h3 className="text-gold-light font-bold text-base mb-4 flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-gold-primary" />
            {l(LABELS.shiftedTitle, locale)}
          </h3>
          <div className="space-y-4">
            {shiftedPlanets.map((p) => {
              const fromKw = HOUSE_KEYWORDS[p.rashiHouse] || { en: '', hi: '' };
              const toKw = HOUSE_KEYWORDS[p.bhavaHouse] || { en: '', hi: '' };
              return (
                <div
                  key={p.planetId}
                  className="rounded-lg bg-bg-secondary/60 border border-gold-primary/10 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: getGrahaColor(p.planetId) }}
                    />
                    <span className="text-text-primary font-semibold">
                      {getGrahaName(p.planetId)}
                    </span>
                    <span className="text-text-secondary text-sm flex items-center gap-1.5">
                      {locale === 'en' ? 'Rashi House' : 'राशि भाव'} {p.rashiHouse} ({l(fromKw, locale)})
                      <ArrowRight className="w-3.5 h-3.5 text-gold-primary" />
                      {locale === 'en' ? 'Bhava House' : 'भाव'} {p.bhavaHouse} ({l(toKw, locale)})
                    </span>
                  </div>
                  <p className="text-text-secondary/80 text-xs ml-5 leading-relaxed">
                    {locale === 'en'
                      ? `Energy of ${getGrahaName(p.planetId)} expresses through ${l(toKw, 'en')} themes (House ${p.bhavaHouse}) instead of ${l(fromKw, 'en')} themes (House ${p.rashiHouse})`
                      : `${getGrahaName(p.planetId)} की ऊर्जा ${l(fromKw, 'hi')} (भाव ${p.rashiHouse}) के बजाय ${l(toKw, 'hi')} (भाव ${p.bhavaHouse}) के विषयों से प्रकट होती है`
                    }
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. All Planets Table */}
      <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/15 overflow-hidden">
        <h3 className="text-gold-light font-bold text-base p-5 pb-3">
          {l(LABELS.allPlanetsTitle, locale)}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/10 text-text-secondary text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-2.5">{l(LABELS.planet, locale)}</th>
                <th className="text-right px-3 py-2.5">{l(LABELS.longitude, locale)}</th>
                <th className="text-left px-3 py-2.5">{l(LABELS.rashiSign, locale)}</th>
                <th className="text-center px-3 py-2.5">{l(LABELS.rashiHouse, locale)}</th>
                <th className="text-center px-3 py-2.5">{l(LABELS.bhavaHouse, locale)}</th>
                <th className="text-center px-3 py-2.5">{l(LABELS.shifted, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {result.planets.map((p) => (
                <tr
                  key={p.planetId}
                  className={`border-b border-gold-primary/5 transition-colors ${
                    p.shifted ? 'bg-amber-500/5' : 'hover:bg-bg-secondary/30'
                  }`}
                >
                  <td className="px-5 py-3 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getGrahaColor(p.planetId) }}
                    />
                    <span className="text-text-primary font-medium">{getGrahaName(p.planetId)}</span>
                  </td>
                  <td className="text-right px-3 py-3 text-text-secondary font-mono text-xs">
                    {formatDeg(p.longitude)}
                  </td>
                  <td className="px-3 py-3 text-text-secondary">
                    {getRashiName(p.longitude)}
                  </td>
                  <td className="text-center px-3 py-3 text-text-primary">
                    {p.rashiHouse}
                  </td>
                  <td className="text-center px-3 py-3 text-text-primary font-semibold">
                    {p.bhavaHouse}
                  </td>
                  <td className="text-center px-3 py-3">
                    {p.shifted ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {l(LABELS.yes, locale)}
                      </span>
                    ) : (
                      <span className="text-text-secondary/50 text-xs">{l(LABELS.no, locale)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Bhava Boundaries (collapsible) */}
      <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/15 overflow-hidden">
        <button
          onClick={() => setShowBoundaries(!showBoundaries)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-bg-secondary/30 transition-colors"
        >
          <h3 className="text-gold-light font-bold text-base">
            {l(LABELS.bhavaBoundaries, locale)}
          </h3>
          {showBoundaries
            ? <ChevronUp className="w-5 h-5 text-gold-primary" />
            : <ChevronDown className="w-5 h-5 text-gold-primary" />
          }
        </button>
        {showBoundaries && (
          <div className="overflow-x-auto border-t border-gold-primary/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/10 text-text-secondary text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-2.5">{l(LABELS.bhava, locale)}</th>
                  <th className="text-right px-3 py-2.5">{l(LABELS.madhya, locale)}</th>
                  <th className="text-right px-5 py-2.5">{l(LABELS.sandhi, locale)}</th>
                </tr>
              </thead>
              <tbody>
                {result.bhavaMadhya.map((madhya, i) => (
                  <tr key={i} className="border-b border-gold-primary/5 hover:bg-bg-secondary/30 transition-colors">
                    <td className="px-5 py-2.5 text-text-primary font-medium">
                      {l(LABELS.bhava, locale)} {i + 1}
                      <span className="text-text-secondary/50 text-xs ml-2">({l(HOUSE_KEYWORDS[i + 1] || { en: '', hi: '' }, locale)})</span>
                    </td>
                    <td className="text-right px-3 py-2.5 text-text-secondary font-mono text-xs">
                      {formatFullDeg(madhya)}
                    </td>
                    <td className="text-right px-5 py-2.5 text-text-secondary font-mono text-xs">
                      {formatFullDeg(result.bhavaSandhi[i])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Educational Note */}
      <div className="rounded-xl bg-bg-secondary/30 border border-gold-primary/10 p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-gold-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {l(LABELS.eduNote, locale)}
            </p>
            <Link
              href="/learn/kundali"
              className="inline-block mt-3 text-xs text-gold-primary hover:text-gold-light transition-colors underline underline-offset-2"
            >
              {l(LABELS.learnMore, locale)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
