'use client';

import { useMemo, useState } from 'react';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import {
  computeEnhancedSynastry,
  computeSynastrySummary,
  getSignRelation,
} from '@/lib/comparison/synastry-engine';
import type { SynastryAspect } from '@/lib/comparison/synastry-engine';
import type { KundaliData, ChartData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ─── Labels ────────────────────────────────────────────────────────────── */

const L = {
  chartOverlay:    { en: 'Synastry Chart Overlay', hi: 'सिनेस्ट्री चार्ट ओवरले' },
  showBonA:        { en: 'Show B on A', hi: 'ब → अ' },
  showAonB:        { en: 'Show A on B', hi: 'अ → ब' },
  solidLegend:     { en: 'Solid = Base Chart', hi: 'ठोस = आधार कुण्डली' },
  outlinedLegend:  { en: 'Outlined = Overlay', hi: 'रेखाकृत = ओवरले' },
  conjunctions:    { en: 'Close Conjunctions', hi: 'निकट युति' },
  noConj:          { en: 'No close conjunctions (within same sign, <10 degree orb)', hi: 'कोई निकट युति नहीं (समान राशि में, <10 अंश)' },
  houseOverlay:    { en: 'House Overlay', hi: 'भाव ओवरले' },
  houseOverDesc:   { en: 'Where each of {name}\'s planets fall in {other}\'s houses', hi: '{name} के ग्रह {other} के भावों में कहां पड़ते हैं' },
  aspectGrid:      { en: 'Aspect Grid', hi: 'दृष्टि ग्रिड' },
  aspectDesc:      { en: '{nameA}\'s planets (rows) vs {nameB}\'s planets (columns)', hi: '{nameA} के ग्रह (पंक्तियां) बनाम {nameB} के ग्रह (स्तंभ)' },
  planet:          { en: 'Planet', hi: 'ग्रह' },
  inHouse:         { en: 'in House', hi: 'भाव में' },
  orb:             { en: 'orb', hi: 'कक्षा' },
  conjunct:        { en: 'conjunct', hi: 'युक्त' },
  harmonious:      { en: 'harmonious', hi: 'सामंजस्यपूर्ण' },
  tense:           { en: 'tense', hi: 'तनावपूर्ण' },
  supportive:      { en: 'Supportive', hi: 'सहायक' },
  challenging:     { en: 'Challenging', hi: 'चुनौतीपूर्ण' },
  neutral:         { en: 'Neutral', hi: 'तटस्थ' },
};

function t(obj: Record<string, string>, locale: string): string {
  return obj[locale] ?? obj.en;
}

/* ─── House Significance (brief) ────────────────────────────────────────── */

const HOUSE_SIGNIFICANCE: Record<number, { en: string; hi: string }> = {
  1:  { en: 'self, identity', hi: 'आत्म, पहचान' },
  2:  { en: 'wealth, family', hi: 'धन, परिवार' },
  3:  { en: 'courage, siblings', hi: 'साहस, भाई-बहन' },
  4:  { en: 'home, mother', hi: 'गृह, माता' },
  5:  { en: 'children, romance', hi: 'संतान, प्रेम' },
  6:  { en: 'health, service', hi: 'स्वास्थ्य, सेवा' },
  7:  { en: 'marriage, partnership', hi: 'विवाह, साझेदारी' },
  8:  { en: 'transformation', hi: 'रूपांतरण' },
  9:  { en: 'fortune, dharma', hi: 'भाग्य, धर्म' },
  10: { en: 'career, status', hi: 'कर्म, प्रतिष्ठा' },
  11: { en: 'gains, aspirations', hi: 'लाभ, आकांक्षा' },
  12: { en: 'loss, liberation', hi: 'व्यय, मोक्ष' },
};

// Houses considered supportive for synastry placement
const SUPPORTIVE_HOUSES = new Set([1, 4, 5, 7, 9, 10, 11]);
const CHALLENGING_HOUSES = new Set([6, 8, 12]);

/* ─── Aspect type colors & symbols ──────────────────────────────────────── */

const ASPECT_DOT_STYLES: Record<string, { color: string; symbol: string }> = {
  Conjunction: { color: 'bg-blue-400', symbol: '☌' },
  Opposition:  { color: 'bg-red-400', symbol: '☍' },
  Trine:       { color: 'bg-emerald-400', symbol: '△' },
  Square:      { color: 'bg-orange-400', symbol: '□' },
  Sextile:     { color: 'bg-cyan-400', symbol: '⚹' },
};

/* ─── Interfaces ────────────────────────────────────────────────────────── */

interface SynastryOverlayProps {
  chartA: KundaliData;  // Person A (primary)
  chartB: KundaliData;  // Person B (overlaid)
  nameA: string;
  nameB: string;
  locale: string;
  chartStyle: 'north' | 'south';
}

interface ConjunctionEntry {
  planetAId: number;
  planetBId: number;
  signId: number;
  degreeA: string;
  degreeB: string;
  longitudeA: number;
  longitudeB: number;
  orb: number;
}

interface HouseOverlayEntry {
  planetBId: number;
  houseInA: number;
  signOfPlanet: number;
  degree: string;
  quality: 'supportive' | 'challenging' | 'neutral';
}

/* ─── Computation helpers ───────────────────────────────────────────────── */

function computeConjunctions(a: KundaliData, b: KundaliData): ConjunctionEntry[] {
  const result: ConjunctionEntry[] = [];
  for (const pA of a.planets) {
    for (const pB of b.planets) {
      // Same sign check
      if (pA.sign !== pB.sign) continue;
      const diff = Math.abs(pA.longitude - pB.longitude);
      const orb = diff > 180 ? 360 - diff : diff;
      if (orb <= 10) {
        result.push({
          planetAId: pA.planet.id,
          planetBId: pB.planet.id,
          signId: pA.sign,
          degreeA: pA.degree,
          degreeB: pB.degree,
          longitudeA: pA.longitude,
          longitudeB: pB.longitude,
          orb: Math.round(orb * 10) / 10,
        });
      }
    }
  }
  return result.sort((a, b) => a.orb - b.orb);
}

function computeHouseOverlay(base: KundaliData, overlay: KundaliData): HouseOverlayEntry[] {
  // For each of overlay's planets, find which house of base it falls in
  const baseAscSign = base.ascendant.sign; // 1-based
  return overlay.planets.map(pB => {
    // House = ((planet sign - asc sign + 12) % 12) + 1
    const houseInA = ((pB.sign - baseAscSign + 12) % 12) + 1;
    let quality: 'supportive' | 'challenging' | 'neutral' = 'neutral';
    if (SUPPORTIVE_HOUSES.has(houseInA)) quality = 'supportive';
    if (CHALLENGING_HOUSES.has(houseInA)) quality = 'challenging';
    return {
      planetBId: pB.planet.id,
      houseInA,
      signOfPlanet: pB.sign,
      degree: pB.degree,
      quality,
    };
  });
}

/* ─── Main Component ────────────────────────────────────────────────────── */

export default function SynastryOverlay({ chartA, chartB, nameA, nameB, locale, chartStyle }: SynastryOverlayProps) {
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  const [swapped, setSwapped] = useState(false);

  // Base and overlay charts
  const base = swapped ? chartB : chartA;
  const overlay = swapped ? chartA : chartB;
  const baseName = swapped ? nameB : nameA;
  const overlayName = swapped ? nameA : nameB;

  // Conjunctions
  const conjunctions = useMemo(() => computeConjunctions(chartA, chartB), [chartA, chartB]);

  // House overlay: B's planets in A's houses (or swapped)
  const houseOverlay = useMemo(() => computeHouseOverlay(base, overlay), [base, overlay]);

  // Synastry aspects for the grid
  const synastry = useMemo(() => computeEnhancedSynastry(chartA, chartB), [chartA, chartB]);
  const summary = useMemo(() => computeSynastrySummary(synastry), [synastry]);

  // Aspect lookup for 9x9 grid
  const aspectLookup = useMemo(() => {
    const m = new Map<string, SynastryAspect>();
    for (const a of synastry) m.set(`${a.planetA}-${a.planetB}`, a);
    return m;
  }, [synastry]);

  const planetIds = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const ChartComponent = chartStyle === 'south' ? ChartSouth : ChartNorth;

  return (
    <div className="space-y-8">

      {/* ── Section 1: Chart Overlay ────────────────────────────────────── */}
      <section>
        <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
          {t(L.chartOverlay, locale)}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Chart */}
          <div className="flex flex-col items-center">
            {/* Swap toggle */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-gold-light text-sm font-semibold">{baseName}</span>
              <button
                onClick={() => setSwapped(!swapped)}
                className="px-3 py-1.5 rounded-lg border border-gold-primary/20 text-gold-primary text-xs hover:bg-gold-primary/10 transition-colors"
              >
                {swapped ? t(L.showBonA, locale) : t(L.showAonB, locale)}
              </button>
              <span className="text-blue-400 text-sm font-semibold">{overlayName}</span>
            </div>

            <ChartComponent
              data={base.chart}
              transitData={overlay.chart}
              title=""
              size={480}
            />

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-xs text-text-secondary mt-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-primary inline-block" />
                {t(L.solidLegend, locale)} ({baseName})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-blue-400 inline-block" />
                {t(L.outlinedLegend, locale)} ({overlayName})
              </span>
            </div>
          </div>

          {/* Right column: Conjunction table */}
          <div className="space-y-6">
            {/* Conjunctions */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
              <h4 className="text-gold-light text-sm font-bold mb-3" style={headingFont}>
                {t(L.conjunctions, locale)}
              </h4>
              {conjunctions.length > 0 ? (
                <div className="space-y-2">
                  {conjunctions.map((c, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/15">
                      <div className="flex items-center gap-2">
                        <GrahaIconById id={c.planetAId} size={18} className="opacity-80" />
                        <span className="text-gold-light text-xs font-medium">
                          {GRAHAS[c.planetAId]?.name[locale as Locale]}
                        </span>
                        <span className="text-blue-400 text-xs">☌</span>
                        <GrahaIconById id={c.planetBId} size={18} className="opacity-80" />
                        <span className="text-blue-400 text-xs font-medium">
                          {GRAHAS[c.planetBId]?.name[locale as Locale]}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-text-secondary text-xs">
                          {RASHIS[c.signId - 1]?.name[locale as Locale]}
                        </div>
                        <div className="text-text-tertiary text-[10px]">
                          {c.degreeA} / {c.degreeB} — {c.orb}° {t(L.orb, locale)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-tertiary text-xs text-center py-4">
                  {t(L.noConj, locale)}
                </p>
              )}
            </div>

            {/* Summary stats */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{summary.harmonious}</div>
                  <div className="text-xs text-text-secondary">{t(L.harmonious, locale)}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{summary.tense}</div>
                  <div className="text-xs text-text-secondary">{t(L.tense, locale)}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{conjunctions.length}</div>
                  <div className="text-xs text-text-secondary">{t(L.conjunctions, locale)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: House Overlay Table ──────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-2">
          <h3 className="text-gold-gradient text-lg font-bold" style={headingFont}>
            {t(L.houseOverlay, locale)}
          </h3>
          <p className="text-text-tertiary text-xs mt-1">
            {t(L.houseOverDesc, locale).replace('{name}', overlayName).replace('{other}', baseName)}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2.5 px-4 text-gold-primary font-semibold text-xs">
                  {overlayName} {t(L.planet, locale)}
                </th>
                <th className="text-left py-2.5 px-3 text-gold-primary font-semibold text-xs">
                  {locale === 'hi' ? 'राशि' : 'Sign'}
                </th>
                <th className="text-center py-2.5 px-3 text-gold-primary font-semibold text-xs">
                  {baseName} {locale === 'hi' ? 'भाव' : 'House'}
                </th>
                <th className="text-left py-2.5 px-3 text-gold-primary font-semibold text-xs">
                  {locale === 'hi' ? 'अर्थ' : 'Signification'}
                </th>
                <th className="text-center py-2.5 px-3 text-gold-primary font-semibold text-xs">
                  {locale === 'hi' ? 'प्रभाव' : 'Effect'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {houseOverlay.map((entry) => {
                const qualColor = entry.quality === 'supportive'
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : entry.quality === 'challenging'
                  ? 'text-red-400 bg-red-500/10'
                  : 'text-amber-400 bg-amber-500/10';
                const qualLabel = entry.quality === 'supportive'
                  ? t(L.supportive, locale)
                  : entry.quality === 'challenging'
                  ? t(L.challenging, locale)
                  : t(L.neutral, locale);

                return (
                  <tr key={entry.planetBId} className="hover:bg-gold-primary/3">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <GrahaIconById id={entry.planetBId} size={18} className="opacity-80" />
                        <span className="text-gold-light text-xs font-medium">
                          {GRAHAS[entry.planetBId]?.name[locale as Locale]}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-text-secondary text-xs">
                      {RASHIS[entry.signOfPlanet - 1]?.name[locale as Locale]} {entry.degree}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-gold-light font-bold text-sm">{entry.houseInA}</span>
                    </td>
                    <td className="py-2.5 px-3 text-text-tertiary text-xs">
                      {HOUSE_SIGNIFICANCE[entry.houseInA]?.[locale === 'hi' ? 'hi' : 'en'] ?? ''}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${qualColor}`}>
                        {qualLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 3: 9x9 Aspect Grid ─────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
        <h3 className="text-gold-gradient text-lg font-bold mb-1" style={headingFont}>
          {t(L.aspectGrid, locale)}
        </h3>
        <p className="text-text-tertiary text-xs mb-4">
          {t(L.aspectDesc, locale).replace('{nameA}', nameA).replace('{nameB}', nameB)}
        </p>

        {/* Legend for aspect types */}
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(ASPECT_DOT_STYLES).map(([type, style]) => (
            <span key={type} className="flex items-center gap-1.5 text-[10px] text-text-secondary">
              <span className={`w-2.5 h-2.5 rounded-full ${style.color} inline-block`} />
              {style.symbol} {type}
            </span>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:block overflow-x-auto">
          <table className="text-xs w-full">
            <thead>
              <tr>
                <th className="p-2 text-gold-primary font-semibold text-left">
                  {nameA} ↓ / {nameB} →
                </th>
                {planetIds.map(id => (
                  <th key={id} className="p-2 text-center text-blue-400/80 font-medium">
                    <div className="flex flex-col items-center gap-0.5">
                      <GrahaIconById id={id} size={14} className="opacity-60" />
                      <span>{GRAHAS[id]?.name[locale as Locale]?.slice(0, 3) ?? ''}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planetIds.map(rowId => (
                <tr key={rowId} className="border-t border-gold-primary/5">
                  <td className="p-2 text-gold-light font-medium whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <GrahaIconById id={rowId} size={14} className="opacity-60" />
                      {GRAHAS[rowId]?.name[locale as Locale]}
                    </div>
                  </td>
                  {planetIds.map(colId => {
                    const asp = aspectLookup.get(`${rowId}-${colId}`);
                    if (!asp) return (
                      <td key={colId} className="p-2 text-center text-text-tertiary/20">
                        <span className="text-[10px]">--</span>
                      </td>
                    );
                    const dotStyle = ASPECT_DOT_STYLES[asp.type];
                    return (
                      <td
                        key={colId}
                        className="p-2 text-center cursor-default group relative"
                        title={`${asp.type} (${asp.orb}°) — ${asp.isHarmonious ? 'harmonious' : 'tense'}`}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={`w-3 h-3 rounded-full ${dotStyle?.color ?? 'bg-gray-500'} inline-block`} />
                          <span className={`text-[9px] font-bold ${asp.isHarmonious ? 'text-emerald-400' : 'text-red-400'}`}>
                            {dotStyle?.symbol ?? '?'}
                          </span>
                          <span className="text-[8px] text-text-tertiary">{asp.orb}°</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Compact card list */}
        <div className="md:hidden space-y-2">
          {synastry.slice(0, 18).map((asp, i) => {
            const dotStyle = ASPECT_DOT_STYLES[asp.type];
            return (
              <div
                key={i}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                  asp.isHarmonious ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-red-500/15 bg-red-500/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${dotStyle?.color ?? 'bg-gray-500'} inline-block`} />
                  <span className="text-text-primary text-xs">
                    {GRAHAS[asp.planetA]?.name[locale as Locale]}
                    <span className="text-text-tertiary mx-1">{dotStyle?.symbol}</span>
                    {GRAHAS[asp.planetB]?.name[locale as Locale]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-tertiary text-[10px]">{asp.type}</span>
                  <span className="text-text-secondary text-[10px]">{asp.orb}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
