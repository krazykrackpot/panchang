'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS, GRAHA_ABBREVIATIONS } from '@/lib/constants/grahas';
import { tl } from '@/lib/utils/trilingual';
import { buildDeepVargaAnalysis } from '@/lib/tippanni/varga-deep-analysis';
import type { KundaliData, ChartData, DivisionalChart } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import type { DeepVargaResult, VargaVisesha } from '@/lib/tippanni/varga-tippanni-types-v2';

// Lazy-load chart components -- heavy SVG rendering
const ChartNorth = dynamic(() => import('@/components/kundali/ChartNorth'), { ssr: false });

/* ──────────────────────────────────────────────────────────────────
 * Varga metadata -- hoisted to module level (never recreated per render)
 * ────────────────────────────────────────────────────────────────── */
interface VargaMeta {
  name: string;
  nameHi: string;
  meaning: string;
  meaningHi: string;
  keyHouse: number;
  keyHouseLabel: string;
  keyHouseLabelHi: string;
}

const VARGA_INFO: Record<string, VargaMeta> = {
  D1:  { name: 'Rashi', nameHi: 'राशि', meaning: 'Overall Life', meaningHi: 'सम्पूर्ण जीवन', keyHouse: 1, keyHouseLabel: 'Self house', keyHouseLabelHi: 'लग्न भाव' },
  D2:  { name: 'Hora', nameHi: 'होरा', meaning: 'Wealth', meaningHi: 'धन', keyHouse: 2, keyHouseLabel: 'Wealth house', keyHouseLabelHi: 'धन भाव' },
  D3:  { name: 'Drekkana', nameHi: 'द्रेक्काण', meaning: 'Siblings & Courage', meaningHi: 'भ्रातृ एवं साहस', keyHouse: 3, keyHouseLabel: 'Siblings house', keyHouseLabelHi: 'सहोदर भाव' },
  D4:  { name: 'Chaturthamsha', nameHi: 'चतुर्थांश', meaning: 'Property & Fortune', meaningHi: 'संपत्ति एवं भाग्य', keyHouse: 4, keyHouseLabel: 'Property house', keyHouseLabelHi: 'संपत्ति भाव' },
  D5:  { name: 'Panchamsha', nameHi: 'पञ्चमांश', meaning: 'Spiritual Merit', meaningHi: 'पुण्य', keyHouse: 5, keyHouseLabel: 'Purva Punya house', keyHouseLabelHi: 'पूर्वपुण्य भाव' },
  D6:  { name: 'Shashthamsha', nameHi: 'षष्ठांश', meaning: 'Health & Enemies', meaningHi: 'स्वास्थ्य एवं शत्रु', keyHouse: 6, keyHouseLabel: 'Enemies house', keyHouseLabelHi: 'शत्रु भाव' },
  D7:  { name: 'Saptamsha', nameHi: 'सप्तांश', meaning: 'Children', meaningHi: 'संतान', keyHouse: 5, keyHouseLabel: 'Children house', keyHouseLabelHi: 'संतान भाव' },
  D8:  { name: 'Ashtamsha', nameHi: 'अष्टांश', meaning: 'Unexpected Troubles', meaningHi: 'अप्रत्याशित कष्ट', keyHouse: 8, keyHouseLabel: 'Mystery house', keyHouseLabelHi: 'रहस्य भाव' },
  D9:  { name: 'Navamsha', nameHi: 'नवांश', meaning: 'Marriage & Dharma', meaningHi: 'विवाह एवं धर्म', keyHouse: 7, keyHouseLabel: 'Marriage house', keyHouseLabelHi: 'विवाह भाव' },
  D10: { name: 'Dasamsha', nameHi: 'दशांश', meaning: 'Career & Status', meaningHi: 'करियर एवं पद', keyHouse: 10, keyHouseLabel: 'Career house', keyHouseLabelHi: 'कर्म भाव' },
  D12: { name: 'Dwadasamsha', nameHi: 'द्वादशांश', meaning: 'Parents', meaningHi: 'माता-पिता', keyHouse: 4, keyHouseLabel: 'Mother house', keyHouseLabelHi: 'मातृ भाव' },
  D16: { name: 'Shodasamsha', nameHi: 'षोडशांश', meaning: 'Vehicles & Comfort', meaningHi: 'वाहन एवं सुख', keyHouse: 4, keyHouseLabel: 'Comforts house', keyHouseLabelHi: 'सुख भाव' },
  D20: { name: 'Vimshamsha', nameHi: 'विंशांश', meaning: 'Spiritual Progress', meaningHi: 'आध्यात्मिक प्रगति', keyHouse: 9, keyHouseLabel: 'Dharma house', keyHouseLabelHi: 'धर्म भाव' },
  D24: { name: 'Chaturvimshamsha', nameHi: 'चतुर्विंशांश', meaning: 'Education', meaningHi: 'शिक्षा', keyHouse: 4, keyHouseLabel: 'Education house', keyHouseLabelHi: 'विद्या भाव' },
  D27: { name: 'Nakshatramsha', nameHi: 'नक्षत्रांश', meaning: 'Strengths', meaningHi: 'शक्ति', keyHouse: 1, keyHouseLabel: 'Self house', keyHouseLabelHi: 'लग्न भाव' },
  D30: { name: 'Trimshamsha', nameHi: 'त्रिंशांश', meaning: 'Misfortunes', meaningHi: 'अरिष्ट', keyHouse: 6, keyHouseLabel: 'Difficulties house', keyHouseLabelHi: 'कष्ट भाव' },
  D40: { name: 'Khavedamsha', nameHi: 'खवेदांश', meaning: 'Maternal Effects', meaningHi: 'मातृ प्रभाव', keyHouse: 4, keyHouseLabel: 'Mother house', keyHouseLabelHi: 'मातृ भाव' },
  D45: { name: 'Akshavedamsha', nameHi: 'अक्षवेदांश', meaning: 'Paternal Effects', meaningHi: 'पितृ प्रभाव', keyHouse: 9, keyHouseLabel: 'Father house', keyHouseLabelHi: 'पितृ भाव' },
  D60: { name: 'Shashtiamsha', nameHi: 'षष्ट्यंश', meaning: 'Past Life Karma', meaningHi: 'पूर्वजन्म कर्म', keyHouse: 12, keyHouseLabel: 'Karma house', keyHouseLabelHi: 'कर्म भाव' },
};

const VARGA_ORDER = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'];

// Tier classification for pill-tab hierarchy
const TIER1 = new Set(['D9', 'D10']);
const TIER2 = new Set(['D7', 'D2', 'D4']);
const TIER3 = new Set(['D3', 'D12', 'D30', 'D60']);
// Everything else goes into "More" overflow

// Domain labels for deep analysis
const DOMAIN_LABELS: Record<string, { en: string; hi: string }> = {
  marriage: { en: 'Marriage & Dharma', hi: 'विवाह एवं धर्म' },
  career: { en: 'Career & Status', hi: 'करियर एवं पद' },
  children: { en: 'Children & Progeny', hi: 'संतान एवं वंश' },
  wealth: { en: 'Wealth & Assets', hi: 'धन एवं संपत्ति' },
  spiritual: { en: 'Spiritual Progress', hi: 'आध्यात्मिक प्रगति' },
  health: { en: 'Health & Challenges', hi: 'स्वास्थ्य एवं चुनौतियां' },
  family: { en: 'Family & Home', hi: 'परिवार एवं गृह' },
  education: { en: 'Education & Learning', hi: 'शिक्षा एवं ज्ञान' },
};

// Planet name lookup (module-level)
const PLANET_NAMES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sun', hi: 'सूर्य' },
  1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' },
  3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'गुरु' },
  5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' },
  7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

// Varga Visesha display labels
const VISESHA_LABELS: Record<VargaVisesha, { en: string; hi: string } | null> = {
  devalokamsha: { en: 'Devalokamsha', hi: 'देवलोकांश' },
  paravatamsha: { en: 'Paravatamsha', hi: 'परावतांश' },
  simhasanamsha: { en: 'Simhasanamsha', hi: 'सिंहासनांश' },
  gopuramsha: { en: 'Gopuramsha', hi: 'गोपुरांश' },
  uttamamsha: { en: 'Uttamamsha', hi: 'उत्तमांश' },
  parijatamsha: { en: 'Parijatamsha', hi: 'पारिजातांश' },
  none: null,
};

// Exaltation / debilitation / own sign lookups for dignity checks
const EXALTATION_SIGNS: Record<number, number> = { 0: 1, 1: 2, 2: 10, 3: 6, 4: 4, 5: 12, 6: 7 };
const DEBILITATION_SIGNS: Record<number, number> = { 0: 7, 1: 8, 2: 4, 3: 12, 4: 10, 5: 6, 6: 1 };
const OWN_SIGNS: Record<number, number[]> = { 0: [5], 1: [4], 2: [1, 8], 3: [3, 6], 4: [9, 12], 5: [2, 7], 6: [10, 11] };

interface VargasTabProps {
  kundali: KundaliData;
  locale: Locale;
  headingFont: React.CSSProperties;
}

export default function VargasTab({ kundali, locale, headingFont }: VargasTabProps) {
  const [selectedDiv, setSelectedDiv] = useState('D9');
  const [showMore, setShowMore] = useState(false);
  const [expandedPlanet, setExpandedPlanet] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const isHi = locale !== 'en' && locale !== 'ta';

  const toggleSection = useCallback((key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Resolve chart data for the selected division
  const chartData: ChartData | null = useMemo(() => {
    if (selectedDiv === 'D1') return kundali.chart;
    if (selectedDiv === 'D9') return kundali.navamshaChart;
    return kundali.divisionalCharts?.[selectedDiv] ?? null;
  }, [selectedDiv, kundali]);

  // Available divisions -- only show pills for charts that actually exist
  const availableDivisions = useMemo(() => {
    return VARGA_ORDER.filter(d => {
      if (d === 'D1') return true;
      if (d === 'D9') return !!kundali.navamshaChart;
      return !!kundali.divisionalCharts?.[d];
    });
  }, [kundali]);

  // Classify available charts into tiers for pill display
  const { tier1Charts, tier2Charts, tier3Charts, overflowCharts } = useMemo(() => {
    const t1: string[] = [];
    const t2: string[] = [];
    const t3: string[] = [];
    const overflow: string[] = [];
    for (const d of availableDivisions) {
      if (d === 'D1') { overflow.push(d); continue; }
      if (TIER1.has(d)) t1.push(d);
      else if (TIER2.has(d)) t2.push(d);
      else if (TIER3.has(d)) t3.push(d);
      else overflow.push(d);
    }
    return { tier1Charts: t1, tier2Charts: t2, tier3Charts: t3, overflowCharts: overflow };
  }, [availableDivisions]);

  // Deep analysis -- lazy computed per selected chart
  const deepAnalysis: DeepVargaResult | null = useMemo(() => {
    if (selectedDiv === 'D1') return null;

    // For D9, wrap navamshaChart as a DivisionalChart for the engine
    if (selectedDiv === 'D9' && kundali.navamshaChart) {
      // Temporarily inject D9 into divisionalCharts if missing
      const hasDivD9 = !!kundali.divisionalCharts?.['D9'];
      if (!hasDivD9) {
        const syntheticD9: DivisionalChart = {
          ...kundali.navamshaChart,
          division: 'D9',
          label: { en: 'D9 Navamsha', hi: 'D9 नवांश', sa: 'D9 नवांशः' },
        };
        // Build a temporary kundali with D9 in divisionalCharts
        const tempKundali: KundaliData = {
          ...kundali,
          divisionalCharts: {
            ...kundali.divisionalCharts,
            D9: syntheticD9,
          },
        };
        return buildDeepVargaAnalysis(tempKundali, 'D9');
      }
    }

    return buildDeepVargaAnalysis(kundali, selectedDiv);
  }, [selectedDiv, kundali]);

  // Planet placement info for the selected chart
  const planetPlacements = useMemo(() => {
    if (!chartData) return [];
    const ascSign = chartData.ascendantSign;
    return kundali.planets.map(p => {
      let houseIdx = -1;
      for (let h = 0; h < 12; h++) {
        if (chartData.houses[h]?.includes(p.planet.id)) {
          houseIdx = h;
          break;
        }
      }
      const houseNum = houseIdx >= 0 ? houseIdx + 1 : 0;
      const signInDiv = houseIdx >= 0 ? ((ascSign - 1 + houseIdx) % 12) + 1 : 0;
      const isVargottama = signInDiv > 0 && signInDiv === p.sign;
      const pid = p.planet.id;
      let dignity: string | null = null;
      if (isVargottama) dignity = 'vargottama';
      else if (EXALTATION_SIGNS[pid] === signInDiv) dignity = 'exalted';
      else if (DEBILITATION_SIGNS[pid] === signInDiv) dignity = 'debilitated';
      else if (OWN_SIGNS[pid]?.includes(signInDiv)) dignity = 'own';

      return {
        planet: p,
        houseNum,
        signInDiv,
        signName: signInDiv > 0 ? RASHIS[(signInDiv - 1) % 12]?.name : null,
        isVargottama,
        dignity,
      };
    });
  }, [chartData, kundali.planets]);

  const meta = VARGA_INFO[selectedDiv];
  const ascSign = chartData?.ascendantSign ?? 0;
  const ascSignName = ascSign > 0 ? RASHIS[(ascSign - 1) % 12]?.name : null;

  // Key house analysis
  const keyHousePlanets = useMemo(() => {
    if (!meta || !chartData) return [];
    const hIdx = meta.keyHouse - 1;
    const pIds = chartData.houses[hIdx] ?? [];
    return pIds.map(id => GRAHAS.find(g => g.id === id)).filter(Boolean);
  }, [meta, chartData]);

  const keyHouseSign = useMemo(() => {
    if (!meta || !chartData) return null;
    const sign = ((ascSign - 1 + (meta.keyHouse - 1)) % 12) + 1;
    return RASHIS[(sign - 1) % 12] ?? null;
  }, [meta, chartData, ascSign]);

  // Vimshopaka Bala Summary
  const vimshopakaNotes = useMemo(() => {
    if (!kundali.vimshopakaBala) return [];
    return kundali.vimshopakaBala.map(vb => ({
      planetName: vb.planetName,
      score: vb.total,
    }));
  }, [kundali.vimshopakaBala]);

  const chartTitle = useMemo(() => {
    if (!meta) return selectedDiv;
    return `${selectedDiv} ${isHi ? meta.nameHi : meta.name}`;
  }, [selectedDiv, meta, isHi]);

  // Helper: render a tier pill
  const renderPill = (d: string, tier: number) => {
    const m = VARGA_INFO[d];
    const isActive = d === selectedDiv;
    const stars = tier === 1 ? '\u2605\u2605\u2605' : tier === 2 ? '\u2605\u2605' : '\u2605';
    const sizeClass = tier === 1 ? 'px-3 py-2 min-w-[64px]' : tier === 2 ? 'px-2.5 py-1.5 min-w-[56px]' : 'px-2 py-1.5 min-w-[48px]';

    return (
      <button
        key={d}
        onClick={() => { setSelectedDiv(d); setExpandedPlanet(null); setExpandedSections({}); }}
        className={`rounded-lg text-xs font-medium transition-all flex flex-col items-center ${sizeClass} ${
          isActive
            ? 'bg-gold-primary/20 text-gold-light border-2 border-gold-primary/60 shadow-[0_0_12px_rgba(212,168,83,0.15)]'
            : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10 hover:text-text-primary'
        }`}
      >
        <span className="font-bold">{d}</span>
        {m && (
          <span className="text-text-secondary/60 text-[10px] leading-tight mt-0.5">
            {isHi ? m.meaningHi : m.meaning}
          </span>
        )}
        <span className="text-gold-dark text-[9px] mt-0.5">{stars}</span>
      </button>
    );
  };

  // Helper: get sign name from sign ID
  const signNameStr = (signId: number): string => {
    if (signId <= 0 || signId > 12) return '?';
    const r = RASHIS[(signId - 1) % 12];
    return r ? tl(r.name, locale) : `${signId}`;
  };

  // Render promise/delivery gauge
  const renderPromiseDeliveryGauge = (analysis: DeepVargaResult) => {
    const { d1Promise, dxxDelivery, verdict } = analysis.promiseDelivery;
    const verdictText = isHi ? verdict.hi : verdict.en;
    return (
      <div className="mt-3">
        <div className="flex items-center gap-3 text-xs mb-1.5">
          <span className="text-text-secondary">{isHi ? 'वचन' : 'Promise'}: <span className="text-gold-light font-bold">{d1Promise}</span></span>
          <span className="text-text-secondary">{isHi ? 'फलन' : 'Delivery'}: <span className="text-emerald-400 font-bold">{dxxDelivery}</span></span>
        </div>
        <div className="h-2.5 rounded-full bg-bg-secondary/80 overflow-hidden flex border border-gold-primary/10">
          <div
            className="h-full bg-gradient-to-r from-gold-primary/60 to-gold-light/60 transition-all"
            style={{ width: `${d1Promise}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-emerald-500/50 to-emerald-400/50 transition-all"
            style={{ width: `${Math.max(0, dxxDelivery - d1Promise)}%`, marginLeft: d1Promise > dxxDelivery ? `-${d1Promise - dxxDelivery}%` : '0' }}
          />
        </div>
        {/* Simpler split bar: promise on left, delivery on right */}
        <div className="flex mt-1.5 gap-1">
          <div className="flex-1">
            <div className="h-1.5 rounded-full bg-gold-primary/15 overflow-hidden">
              <div className="h-full bg-gold-primary/50 rounded-full" style={{ width: `${d1Promise}%` }} />
            </div>
            <span className="text-[10px] text-gold-dark">{isHi ? 'D1 वचन' : 'D1 Promise'}</span>
          </div>
          <div className="flex-1">
            <div className="h-1.5 rounded-full bg-emerald-500/15 overflow-hidden">
              <div className="h-full bg-emerald-500/50 rounded-full" style={{ width: `${dxxDelivery}%` }} />
            </div>
            <span className="text-[10px] text-emerald-500/60">{selectedDiv} {isHi ? 'फलन' : 'Delivery'}</span>
          </div>
        </div>
        <p className="text-text-secondary text-xs mt-2 leading-relaxed italic">{verdictText}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Tiered Pill-Tab Chart Selector ── */}
      <div>
        <h3 className="text-gold-light text-lg font-bold mb-3 text-center" style={headingFont}>
          {isHi ? 'वर्ग चार्ट चुनें' : 'Select Divisional Chart'}
        </h3>

        {/* Tier 1: Prominent */}
        {tier1Charts.length > 0 && (
          <div className="flex justify-center gap-2 mb-2">
            {tier1Charts.map(d => renderPill(d, 1))}
          </div>
        )}

        {/* Tier 2: Medium */}
        {tier2Charts.length > 0 && (
          <div className="flex justify-center gap-1.5 mb-2">
            {tier2Charts.map(d => renderPill(d, 2))}
          </div>
        )}

        {/* Tier 3: Smaller */}
        {tier3Charts.length > 0 && (
          <div className="flex justify-center gap-1.5 mb-2">
            {tier3Charts.map(d => renderPill(d, 3))}
          </div>
        )}

        {/* Overflow: More toggle */}
        {overflowCharts.length > 0 && (
          <div className="text-center">
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-xs text-text-secondary hover:text-gold-light transition-colors px-3 py-1 border border-gold-primary/10 rounded-lg hover:bg-gold-primary/5"
            >
              {showMore
                ? (isHi ? 'कम दिखाएं' : 'Show Less')
                : (isHi ? `अधिक ▾ (${overflowCharts.length})` : `More \u25BE (${overflowCharts.length})`)}
            </button>
            {showMore && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {overflowCharts.map(d => {
                  const m = VARGA_INFO[d];
                  const isActive = d === selectedDiv;
                  return (
                    <button
                      key={d}
                      onClick={() => { setSelectedDiv(d); setExpandedPlanet(null); setExpandedSections({}); }}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all flex flex-col items-center min-w-[48px] ${
                        isActive
                          ? 'bg-gold-primary/20 text-gold-light border-2 border-gold-primary/60'
                          : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10 hover:text-text-primary'
                      }`}
                    >
                      <span className="font-bold">{d}</span>
                      {m && <span className="text-text-secondary/60 text-[10px] leading-tight mt-0.5">{isHi ? m.meaningHi : m.meaning}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Header: Division name + meaning ── */}
      {meta && (
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15">
          <h2 className="text-gold-gradient text-xl font-bold" style={headingFont}>
            {selectedDiv} — {isHi ? meta.nameHi : meta.name}
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            {isHi ? meta.meaningHi : meta.meaning}
          </p>
          {ascSignName && (
            <p className="text-gold-primary/70 text-xs mt-2">
              {isHi ? 'लग्न: ' : 'Ascendant: '}
              {tl(ascSignName, locale)}
            </p>
          )}
        </div>
      )}

      {/* ── Chart + Overview Panel (side-by-side on desktop) ── */}
      {chartData ? (
        <div className={`${deepAnalysis ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : ''}`}>
          {/* Chart Visualization */}
          <div className="flex justify-center">
            <div className="w-full max-w-[500px]">
              <ChartNorth data={chartData} title={chartTitle} size={500} />
            </div>
          </div>

          {/* Overview Panel (when deep analysis is available) */}
          {deepAnalysis && (
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] border border-gold-primary/12 p-5 flex flex-col justify-center">
              {/* Domain */}
              <div className="mb-3">
                <span className="text-[10px] uppercase tracking-widest text-text-secondary/50">
                  {isHi ? 'क्षेत्र' : 'Domain'}
                </span>
                <h3 className="text-gold-light text-lg font-bold" style={headingFont}>
                  {isHi
                    ? (DOMAIN_LABELS[deepAnalysis.domain]?.hi ?? deepAnalysis.domain)
                    : (DOMAIN_LABELS[deepAnalysis.domain]?.en ?? deepAnalysis.domain)}
                </h3>
              </div>

              {/* Rising Sign */}
              {ascSignName && (
                <div className="mb-2 text-sm">
                  <span className="text-text-secondary">{isHi ? 'उदय राशि: ' : 'Rising: '}</span>
                  <span className="text-gold-light font-semibold">{tl(ascSignName, locale)}</span>
                </div>
              )}

              {/* Key House Lord */}
              {deepAnalysis.crossCorrelation.keyHouseLords.length > 0 && (() => {
                const khl = deepAnalysis.crossCorrelation.keyHouseLords[0];
                const pName = isHi ? PLANET_NAMES[khl.lordId]?.hi : PLANET_NAMES[khl.lordId]?.en;
                return (
                  <div className="mb-2 text-sm">
                    <span className="text-text-secondary">
                      {isHi ? `${khl.house}वें भाव का स्वामी: ` : `${khl.house}H Lord: `}
                    </span>
                    <span className="text-gold-light font-semibold">{pName}</span>
                    <span className="text-text-secondary/60 text-xs ml-1">
                      ({khl.lordDignity})
                    </span>
                  </div>
                );
              })()}

              {/* Dispositor Chain */}
              {deepAnalysis.crossCorrelation.dispositorChain.finalDispositor !== null && (
                <div className="mb-2 text-sm">
                  <span className="text-text-secondary">{isHi ? 'अंतिम अधिपति: ' : 'Final Dispositor: '}</span>
                  <span className="text-gold-light font-semibold">
                    {isHi
                      ? PLANET_NAMES[deepAnalysis.crossCorrelation.dispositorChain.finalDispositor]?.hi
                      : PLANET_NAMES[deepAnalysis.crossCorrelation.dispositorChain.finalDispositor]?.en}
                  </span>
                </div>
              )}

              {/* Promise/Delivery Gauge */}
              {renderPromiseDeliveryGauge(deepAnalysis)}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary/60 text-sm">
          {isHi ? 'इस वर्ग के लिए चार्ट डेटा उपलब्ध नहीं है।' : 'Divisional chart data not available for this chart.'}
        </div>
      )}

      {/* ── Analysis Sections (only when deep analysis is available) ── */}
      {chartData && meta && (
        <div className="space-y-4">

          {/* ── B. Enhanced Planet Table ── */}
          {deepAnalysis ? (
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] border border-gold-primary/12 p-5">
              <h4 className="text-gold-light text-sm font-bold uppercase tracking-wider mb-3" style={headingFont}>
                {isHi ? 'ग्रह स्थितियां (D1 → ' + selectedDiv + ')' : 'Planet Placements (D1 \u2192 ' + selectedDiv + ')'}
              </h4>

              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[80px_120px_90px_110px_1fr] gap-1 mb-2 px-2 text-[10px] text-text-secondary/50 uppercase tracking-wider">
                <span>{isHi ? 'ग्रह' : 'Planet'}</span>
                <span>{isHi ? 'D1→' + selectedDiv : 'D1\u2192' + selectedDiv}</span>
                <span>{isHi ? 'बल' : 'Dignity'}</span>
                <span>{isHi ? 'चिह्न' : 'Badges'}</span>
                <span>{isHi ? 'संक्षेप' : 'Brief'}</span>
              </div>

              <div className="space-y-1">
                {deepAnalysis.crossCorrelation.dignityShifts.map(ds => {
                  const pid = ds.planetId;
                  const abbr = GRAHA_ABBREVIATIONS[pid] ?? '';
                  const pName = isHi ? ds.planetName.hi : ds.planetName.en;
                  const d1SignStr = signNameStr(ds.d1Sign);
                  const dxxSignStr = signNameStr(ds.dxxSign);

                  // Shift arrow
                  const shiftIcon = ds.isVargottama ? '\u2605' : ds.shift === 'improved' ? '\u2191' : ds.shift === 'declined' ? '\u2193' : '\u2194';
                  const shiftClass = ds.isVargottama
                    ? 'text-gold-light'
                    : ds.shift === 'improved'
                      ? 'text-emerald-400'
                      : ds.shift === 'declined'
                        ? 'text-red-400'
                        : 'text-text-secondary/60';

                  // Badges
                  const badges: { label: string; cls: string }[] = [];
                  if (ds.isVargottama) badges.push({ label: '\u2605', cls: 'bg-gold-primary/20 text-gold-light' });

                  // Pushkara
                  const pushk = deepAnalysis.crossCorrelation.pushkaraChecks.find(p => p.planetId === pid);
                  if (pushk && (pushk.isPushkaraNavamsha || pushk.isPushkaraBhaga)) {
                    badges.push({ label: 'P', cls: 'bg-emerald-500/20 text-emerald-300' });
                  }

                  // Gandanta
                  const gand = deepAnalysis.crossCorrelation.gandantaChecks.find(g => g.planetId === pid);
                  if (gand && gand.isGandanta) {
                    badges.push({ label: 'G', cls: 'bg-red-500/20 text-red-300' });
                  }

                  // Varga Visesha (YogaKaraka-like)
                  const vv = deepAnalysis.crossCorrelation.vargaVisesha.find(v => v.planetId === pid);
                  if (vv && vv.classification !== 'none') {
                    if (['simhasanamsha', 'paravatamsha', 'devalokamsha'].includes(vv.classification)) {
                      badges.push({ label: 'YK', cls: 'bg-gold-primary/20 text-gold-light' });
                    }
                  }

                  // Final Dispositor
                  if (deepAnalysis.crossCorrelation.dispositorChain.finalDispositor === pid) {
                    badges.push({ label: 'FD', cls: 'bg-purple-500/20 text-purple-300' });
                  }

                  // Retro/Combust from natal
                  const natal = kundali.planets.find(p => p.planet.id === pid);
                  if (natal?.isRetrograde) badges.push({ label: 'R', cls: 'bg-amber-500/20 text-amber-300' });
                  if (natal?.isCombust) badges.push({ label: 'C', cls: 'bg-orange-500/20 text-orange-300' });

                  // Brief narrative
                  const briefText = isHi ? ds.narrative.hi : ds.narrative.en;
                  const isExpanded = expandedPlanet === pid;

                  // Dignity display
                  const dignityLabel = ds.isVargottama
                    ? (isHi ? 'वर्गोत्तम' : 'Vargottama')
                    : ds.dxxDignity === 'exalted'
                      ? (isHi ? 'उच्च' : 'Exalted')
                      : ds.dxxDignity === 'debilitated'
                        ? (isHi ? 'नीच' : 'Debil.')
                        : ds.dxxDignity === 'own'
                          ? (isHi ? 'स्वगृह' : 'Own')
                          : ds.dxxDignity === 'friend'
                            ? (isHi ? 'मित्र' : 'Friend')
                            : ds.dxxDignity === 'enemy'
                              ? (isHi ? 'शत्रु' : 'Enemy')
                              : (isHi ? 'सम' : 'Neutral');

                  const dignityBorderClass = ds.dxxDignity === 'exalted' || ds.isVargottama
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : ds.dxxDignity === 'debilitated'
                      ? 'border-red-500/20 bg-red-500/5'
                      : ds.dxxDignity === 'own'
                        ? 'border-sky-500/20 bg-sky-500/5'
                        : 'border-gold-primary/8 bg-gold-primary/3';

                  return (
                    <div key={pid}>
                      <button
                        onClick={() => setExpandedPlanet(isExpanded ? null : pid)}
                        className={`w-full text-left rounded-lg border p-2.5 transition-all hover:bg-gold-primary/5 ${dignityBorderClass} ${isExpanded ? 'ring-1 ring-gold-primary/30' : ''}`}
                      >
                        {/* Desktop: grid row */}
                        <div className="hidden sm:grid grid-cols-[80px_120px_90px_110px_1fr] gap-1 items-center">
                          <div className="flex items-center gap-1.5">
                            <span className="text-gold-light font-semibold text-xs">{abbr}</span>
                            <span className="text-text-primary text-xs">{pName}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-text-secondary/70">{d1SignStr}</span>
                            <span className={`mx-1 font-bold ${shiftClass}`}>{shiftIcon}</span>
                            <span className="text-text-primary">{dxxSignStr}</span>
                          </div>
                          <div className="text-xs text-text-secondary">{dignityLabel}</div>
                          <div className="flex flex-wrap gap-0.5">
                            {badges.map((b, i) => (
                              <span key={i} className={`text-[10px] font-bold px-1 py-0.5 rounded ${b.cls}`}>{b.label}</span>
                            ))}
                          </div>
                          <div className="text-text-secondary/70 text-[11px] truncate">
                            {ds.shift === 'improved'
                              ? (isHi ? 'बल में सुधार' : 'Strength improved')
                              : ds.shift === 'declined'
                                ? (isHi ? 'बल में गिरावट' : 'Strength declined')
                                : ds.isVargottama
                                  ? (isHi ? 'एकीकृत अभिव्यक्ति' : 'Unified expression')
                                  : (isHi ? 'स्थिर' : 'Stable')}
                          </div>
                        </div>

                        {/* Mobile: stacked */}
                        <div className="sm:hidden">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-gold-light font-semibold text-xs">{abbr}</span>
                            <span className="text-text-primary text-xs">{pName}</span>
                            <span className="text-text-secondary/70 text-[10px]">{d1SignStr}</span>
                            <span className={`font-bold text-xs ${shiftClass}`}>{shiftIcon}</span>
                            <span className="text-text-primary text-[10px]">{dxxSignStr}</span>
                            <span className="text-text-secondary/60 text-[10px]">{dignityLabel}</span>
                            {badges.map((b, i) => (
                              <span key={i} className={`text-[10px] font-bold px-1 py-0.5 rounded ${b.cls}`}>{b.label}</span>
                            ))}
                          </div>
                        </div>
                      </button>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="ml-3 mt-1 mb-2 p-3 rounded-lg bg-bg-secondary/50 border border-gold-primary/8 text-xs text-text-secondary leading-relaxed">
                          <p>{briefText}</p>
                          {pushk && (pushk.isPushkaraNavamsha || pushk.isPushkaraBhaga) && (
                            <p className="mt-1 text-emerald-400/80">
                              {isHi
                                ? 'पुष्कर स्थिति — छिपा हुआ आशीर्वाद, शुभ फल में वृद्धि।'
                                : 'Pushkara placement -- hidden blessing, amplified beneficence.'}
                            </p>
                          )}
                          {gand && gand.isGandanta && (
                            <p className="mt-1 text-red-400/80">
                              {isHi
                                ? `गण्डान्त (${gand.junction}, ${gand.severity}) — कार्मिक ग्रन्थि।`
                                : `Gandanta (${gand.junction}, ${gand.severity}) -- karmic knot in this domain.`}
                            </p>
                          )}
                          {vv && vv.classification !== 'none' && (
                            <p className="mt-1 text-gold-primary/80">
                              {isHi
                                ? `वर्ग विशेष: ${VISESHA_LABELS[vv.classification]?.hi ?? vv.classification}`
                                : `Varga Visesha: ${VISESHA_LABELS[vv.classification]?.en ?? vv.classification}`}
                            </p>
                          )}
                          {natal?.isRetrograde && (
                            <p className="mt-1 text-amber-400/80">
                              {isHi
                                ? 'वक्री — गैर-पारम्परिक, पुनर्विचार और परिशोधन से सफलता।'
                                : 'Retrograde -- unconventional path, success through review and refinement.'}
                            </p>
                          )}
                          {natal?.isCombust && (
                            <p className="mt-1 text-orange-400/80">
                              {isHi
                                ? 'अस्त — सूर्य की निकटता से इस क्षेत्र में ग्रह का प्रभाव छिपा है।'
                                : 'Combust -- planet\'s influence in this domain overshadowed by Sun proximity.'}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Badge legend */}
              <div className="mt-3 text-[10px] text-text-secondary/40 flex flex-wrap gap-x-3 gap-y-1">
                <span><span className="text-gold-light">{'\u2605'}</span>=Vargottama</span>
                <span><span className="text-emerald-300">P</span>=Pushkara</span>
                <span><span className="text-red-300">G</span>=Gandanta</span>
                <span><span className="text-gold-light">YK</span>=VargaVisesha</span>
                <span><span className="text-purple-300">FD</span>=FinalDispositor</span>
                <span><span className="text-amber-300">R</span>=Retro</span>
                <span><span className="text-orange-300">C</span>=Combust</span>
              </div>
            </div>
          ) : (
            /* Fallback: old flat planet placements when no deep analysis */
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] border border-gold-primary/12 p-5">
              <h4 className="text-gold-light text-sm font-bold uppercase tracking-wider mb-3" style={headingFont}>
                {isHi ? 'ग्रह स्थितियां' : 'Planet Placements'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {planetPlacements.map((pp, i) => {
                  if (!pp.signName || pp.houseNum === 0) return null;
                  const abbr = GRAHA_ABBREVIATIONS[pp.planet.planet.id] ?? '';
                  const dignityClass = pp.dignity === 'exalted' || pp.dignity === 'vargottama'
                    ? 'border-emerald-500/20 bg-emerald-500/5'
                    : pp.dignity === 'debilitated'
                      ? 'border-red-500/20 bg-red-500/5'
                      : pp.dignity === 'own'
                        ? 'border-sky-500/20 bg-sky-500/5'
                        : 'border-gold-primary/8 bg-gold-primary/3';
                  const dignityLabel = pp.dignity === 'vargottama' ? 'Vgm'
                    : pp.dignity === 'exalted' ? (isHi ? 'उच्च' : 'Exalted')
                    : pp.dignity === 'debilitated' ? (isHi ? 'नीच' : 'Debil.')
                    : pp.dignity === 'own' ? (isHi ? 'स्वगृह' : 'Own')
                    : null;
                  const dignityBadgeClass = pp.dignity === 'exalted' ? 'bg-emerald-500/20 text-emerald-300'
                    : pp.dignity === 'vargottama' ? 'bg-gold-primary/20 text-gold-light'
                    : pp.dignity === 'debilitated' ? 'bg-red-500/20 text-red-300'
                    : pp.dignity === 'own' ? 'bg-sky-500/20 text-sky-300'
                    : '';

                  return (
                    <div key={i} className={`rounded-lg p-2.5 border ${dignityClass}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gold-light font-semibold text-xs">{abbr}</span>
                        <span className="text-text-primary text-xs">{tl(pp.planet.planet.name, locale)}</span>
                        <span className="text-text-secondary/50 text-[10px]">
                          H{pp.houseNum} · {tl(pp.signName, locale)}
                        </span>
                        {dignityLabel && (
                          <span className={`text-[10px] font-bold px-1 py-0.5 rounded ${dignityBadgeClass}`}>
                            {dignityLabel}
                          </span>
                        )}
                      </div>
                      {pp.isVargottama && (
                        <p className="text-emerald-400/70 text-[10px] mt-1 italic">
                          {isHi
                            ? 'वर्गोत्तम — D1 और इस वर्ग में एक ही राशि। बल दोगुना।'
                            : 'Vargottama -- same sign in D1 and this division. Strength doubled.'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── C. Yogas in This Chart ── */}
          {deepAnalysis && deepAnalysis.crossCorrelation.yogasInChart.length > 0 && (
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] border border-gold-primary/12 p-5">
              <h4 className="text-gold-light text-sm font-bold uppercase tracking-wider mb-3" style={headingFont}>
                {isHi ? `इस चार्ट में योग (${selectedDiv})` : `Yogas in ${selectedDiv}`}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {deepAnalysis.crossCorrelation.yogasInChart.map((yoga, i) => (
                  <div key={i} className="rounded-lg border border-gold-primary/15 bg-gold-primary/5 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gold-light font-bold text-sm">{yoga.name}</span>
                      <span className="text-text-secondary/50 text-[10px]">
                        {yoga.planets.map(pid => isHi ? PLANET_NAMES[pid]?.hi : PLANET_NAMES[pid]?.en).join(', ')}
                      </span>
                    </div>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {isHi ? yoga.significance.hi : yoga.significance.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── D. Deep Analysis (Expandable Sections) ── */}
          {deepAnalysis && (
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] border border-gold-primary/12 p-5">
              <h4 className="text-gold-light text-sm font-bold uppercase tracking-wider mb-3" style={headingFont}>
                {isHi ? 'गहन विश्लेषण' : 'Deep Analysis'}
              </h4>

              <div className="space-y-1">
                {/* Key House Lordship Trace */}
                {deepAnalysis.crossCorrelation.keyHouseLords.length > 0 && (
                  <ExpandableSection
                    title={isHi ? 'मुख्य भाव स्वामित्व' : 'Key House Lordship Trace'}
                    sectionKey="keyHouseLords"
                    expandedSections={expandedSections}
                    toggle={toggleSection}
                  >
                    <div className="space-y-2">
                      {deepAnalysis.crossCorrelation.keyHouseLords.map((khl, i) => (
                        <div key={i} className="text-xs text-text-secondary leading-relaxed">
                          <span className="text-gold-light font-semibold">
                            {isHi ? `${khl.house}वाँ भाव` : `House ${khl.house}`}:
                          </span>{' '}
                          {isHi ? khl.narrative.hi : khl.narrative.en}
                        </div>
                      ))}
                    </div>
                  </ExpandableSection>
                )}

                {/* Argala on Key Houses */}
                {deepAnalysis.crossCorrelation.argalaOnKeyHouses.length > 0 && (
                  <ExpandableSection
                    title={isHi ? 'मुख्य भावों पर अर्गला' : 'Argala on Key Houses'}
                    sectionKey="argala"
                    expandedSections={expandedSections}
                    toggle={toggleSection}
                  >
                    <div className="space-y-2">
                      {deepAnalysis.crossCorrelation.argalaOnKeyHouses.map((arg, i) => (
                        <div key={i} className="text-xs text-text-secondary">
                          <span className="text-gold-light font-semibold">
                            {isHi ? `भाव ${arg.house}` : `House ${arg.house}`}:
                          </span>{' '}
                          {arg.supporting.length > 0 && (
                            <span className="text-emerald-400/80">
                              {isHi ? 'सहायक: ' : 'Supporting: '}
                              {arg.supporting.map(pid => isHi ? PLANET_NAMES[pid]?.hi : PLANET_NAMES[pid]?.en).join(', ')}
                            </span>
                          )}
                          {arg.supporting.length > 0 && arg.obstructing.length > 0 && ' | '}
                          {arg.obstructing.length > 0 && (
                            <span className="text-red-400/80">
                              {isHi ? 'अवरोधक: ' : 'Obstructing: '}
                              {arg.obstructing.map(pid => isHi ? PLANET_NAMES[pid]?.hi : PLANET_NAMES[pid]?.en).join(', ')}
                            </span>
                          )}
                          {arg.supporting.length === 0 && arg.obstructing.length === 0 && (
                            <span className="text-text-secondary/50 italic">
                              {isHi ? 'कोई अर्गला नहीं' : 'No argala'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </ExpandableSection>
                )}

                {/* Jaimini Karakas */}
                {deepAnalysis.crossCorrelation.jaiminiKarakas.length > 0 && (
                  <ExpandableSection
                    title={isHi ? 'जैमिनी कारक' : 'Jaimini Karakas'}
                    sectionKey="jaimini"
                    expandedSections={expandedSections}
                    toggle={toggleSection}
                  >
                    <div className="space-y-2">
                      {deepAnalysis.crossCorrelation.jaiminiKarakas.map((jk, i) => (
                        <div key={i} className="text-xs text-text-secondary">
                          <span className="text-gold-light font-semibold">{jk.karaka}</span>
                          {' '}({isHi ? PLANET_NAMES[jk.planetId]?.hi : PLANET_NAMES[jk.planetId]?.en}):{' '}
                          {isHi ? jk.narrative.hi : jk.narrative.en}
                        </div>
                      ))}
                    </div>
                  </ExpandableSection>
                )}

                {/* Parivartana */}
                {deepAnalysis.crossCorrelation.parivartanas.length > 0 && (
                  <ExpandableSection
                    title={isHi ? 'परिवर्तन (राशि विनिमय)' : 'Parivartana (Sign Exchanges)'}
                    sectionKey="parivartana"
                    expandedSections={expandedSections}
                    toggle={toggleSection}
                  >
                    <div className="space-y-2">
                      {deepAnalysis.crossCorrelation.parivartanas.map((pv, i) => (
                        <div key={i} className="text-xs text-text-secondary">
                          <span className="text-gold-light font-semibold">
                            {isHi ? PLANET_NAMES[pv.planet1Id]?.hi : PLANET_NAMES[pv.planet1Id]?.en}
                            {' \u2194 '}
                            {isHi ? PLANET_NAMES[pv.planet2Id]?.hi : PLANET_NAMES[pv.planet2Id]?.en}
                          </span>:{' '}
                          {isHi ? pv.significance.hi : pv.significance.en}
                        </div>
                      ))}
                    </div>
                  </ExpandableSection>
                )}

                {/* Dispositor Chain */}
                <ExpandableSection
                  title={isHi ? 'अधिपति श्रृंखला' : 'Dispositor Chain'}
                  sectionKey="dispositor"
                  expandedSections={expandedSections}
                  toggle={toggleSection}
                >
                  <div className="text-xs text-text-secondary">
                    <div className="flex flex-wrap gap-1 items-center mb-2">
                      {deepAnalysis.crossCorrelation.dispositorChain.chain.map((node, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {i > 0 && <span className="text-gold-dark">{'\u2192'}</span>}
                          <span className="text-gold-light font-semibold">
                            {isHi ? PLANET_NAMES[node.planetId]?.hi : PLANET_NAMES[node.planetId]?.en}
                          </span>
                          <span className="text-text-secondary/40">({signNameStr(node.sign)})</span>
                        </span>
                      ))}
                    </div>
                    <p className="leading-relaxed">
                      {isHi
                        ? deepAnalysis.crossCorrelation.dispositorChain.narrative.hi
                        : deepAnalysis.crossCorrelation.dispositorChain.narrative.en}
                    </p>
                  </div>
                </ExpandableSection>

                {/* Aspects on Key Houses */}
                {deepAnalysis.crossCorrelation.aspectsOnKeyHouses.some(a => a.aspectingPlanets.length > 0) && (
                  <ExpandableSection
                    title={isHi ? 'मुख्य भावों पर दृष्टि' : 'Aspects on Key Houses'}
                    sectionKey="aspects"
                    expandedSections={expandedSections}
                    toggle={toggleSection}
                  >
                    <div className="space-y-2">
                      {deepAnalysis.crossCorrelation.aspectsOnKeyHouses.map((asp, i) => {
                        if (asp.aspectingPlanets.length === 0) return null;
                        return (
                          <div key={i} className="text-xs text-text-secondary">
                            <span className="text-gold-light font-semibold">
                              {isHi ? `भाव ${asp.house}` : `House ${asp.house}`}:
                            </span>{' '}
                            {asp.aspectingPlanets.map((ap, j) => (
                              <span key={j}>
                                {j > 0 && ', '}
                                <span className={ap.type === 'benefic' ? 'text-emerald-400/80' : 'text-red-400/80'}>
                                  {isHi ? PLANET_NAMES[ap.id]?.hi : PLANET_NAMES[ap.id]?.en}
                                </span>
                              </span>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </ExpandableSection>
                )}

                {/* SAV Overlay */}
                {deepAnalysis.crossCorrelation.savOverlay.length > 0 && (
                  <ExpandableSection
                    title={isHi ? 'सर्वाष्टकवर्ग (SAV)' : 'SAV Overlay'}
                    sectionKey="sav"
                    expandedSections={expandedSections}
                    toggle={toggleSection}
                  >
                    <div className="flex flex-wrap gap-2">
                      {deepAnalysis.crossCorrelation.savOverlay.map((sav, i) => {
                        const colorClass = sav.quality === 'strong'
                          ? 'text-emerald-400 border-emerald-500/20'
                          : sav.quality === 'weak'
                            ? 'text-red-400 border-red-500/20'
                            : 'text-amber-400 border-amber-500/20';
                        return (
                          <div key={i} className={`text-xs border rounded px-2 py-1 ${colorClass}`}>
                            {signNameStr(sav.sign)}: <span className="font-bold">{sav.bindus}</span>
                          </div>
                        );
                      })}
                    </div>
                  </ExpandableSection>
                )}

                {/* Dasha Lord Placement */}
                {deepAnalysis.crossCorrelation.dashaLordPlacement && (
                  <ExpandableSection
                    title={isHi ? 'दशा स्वामी स्थिति' : 'Dasha Lord in ' + selectedDiv}
                    sectionKey="dasha"
                    expandedSections={expandedSections}
                    toggle={toggleSection}
                  >
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {isHi
                        ? deepAnalysis.crossCorrelation.dashaLordPlacement.narrative.hi
                        : deepAnalysis.crossCorrelation.dashaLordPlacement.narrative.en}
                    </p>
                  </ExpandableSection>
                )}
              </div>
            </div>
          )}

          {/* ── E. Synthesized Prognosis ── */}
          {deepAnalysis && (
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 p-5">
              <h4 className="text-gold-light text-sm font-bold uppercase tracking-wider mb-3" style={headingFont}>
                {isHi ? 'संश्लेषित मूल्यांकन' : 'Synthesized Prognosis'}
              </h4>
              <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                {isHi ? deepAnalysis.narrative.hi : deepAnalysis.narrative.en}
              </div>
            </div>
          )}

          {/* ── Key House Analysis (always shown) ── */}
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] border border-gold-primary/12 p-5">
            <h4 className="text-gold-light text-sm font-bold uppercase tracking-wider mb-3" style={headingFont}>
              {isHi ? `${meta.keyHouseLabelHi} (भाव ${meta.keyHouse})` : `${meta.keyHouseLabel} (House ${meta.keyHouse})`}
            </h4>
            <div className="space-y-2">
              {keyHouseSign && (
                <p className="text-text-secondary text-xs">
                  <span className="text-gold-primary font-medium">
                    {isHi ? 'राशि: ' : 'Sign: '}
                  </span>
                  {tl(keyHouseSign.name, locale)}
                  {keyHouseSign.rulerName && (
                    <span className="text-text-secondary/60">
                      {' '}({isHi ? 'स्वामी: ' : 'Lord: '}{tl(keyHouseSign.rulerName, locale)})
                    </span>
                  )}
                </p>
              )}
              {keyHousePlanets.length > 0 ? (
                <p className="text-text-secondary text-xs">
                  <span className="text-gold-primary font-medium">
                    {isHi ? 'ग्रह: ' : 'Planets: '}
                  </span>
                  {keyHousePlanets.map(g => g ? tl(g.name, locale) : '').join(', ')}
                </p>
              ) : (
                <p className="text-text-secondary/50 text-xs italic">
                  {isHi ? 'इस भाव में कोई ग्रह नहीं' : 'No planets in this house'}
                </p>
              )}
            </div>
          </div>

          {/* ── Vimshopaka Bala Summary ── */}
          {vimshopakaNotes.length > 0 && (
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] border border-gold-primary/12 p-5">
              <h4 className="text-gold-light text-sm font-bold uppercase tracking-wider mb-3" style={headingFont}>
                {isHi ? 'विंशोपक बल (सभी वर्ग)' : 'Vimshopaka Bala (All Vargas)'}
              </h4>
              <p className="text-text-secondary/60 text-xs mb-3">
                {isHi
                  ? 'विंशोपक बल 20-सूत्रीय पद्धति है जो सभी 16 वर्गों में ग्रह की स्थिति को मिलाकर एक समग्र शक्ति अंक देती है।'
                  : 'Vimshopaka Bala is a 20-point system that combines a planet\'s dignity across all 16 divisional charts into one composite strength score.'}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                {vimshopakaNotes.map((v, i) => {
                  const pct = (v.score / 20) * 100;
                  const color = pct >= 60 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                    : pct >= 35 ? 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                    : 'text-red-400 border-red-500/20 bg-red-500/5';
                  return (
                    <div key={i} className={`rounded-lg p-2 text-center border ${color}`}>
                      <div className="text-xs font-bold">{v.planetName}</div>
                      <div className="text-sm font-bold mt-0.5">{v.score.toFixed(1)}</div>
                      <div className="text-text-secondary/40 text-[10px]">/20</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * ExpandableSection — collapsible detail section
 * ────────────────────────────────────────────────────────────────── */
interface ExpandableSectionProps {
  title: string;
  sectionKey: string;
  expandedSections: Record<string, boolean>;
  toggle: (key: string) => void;
  children: React.ReactNode;
}

function ExpandableSection({ title, sectionKey, expandedSections, toggle, children }: ExpandableSectionProps) {
  const isOpen = !!expandedSections[sectionKey];
  return (
    <div className="border border-gold-primary/8 rounded-lg overflow-hidden">
      <button
        onClick={() => toggle(sectionKey)}
        className="w-full text-left flex items-center justify-between px-3 py-2 hover:bg-gold-primary/5 transition-colors"
      >
        <span className="text-xs text-text-secondary font-medium">{title}</span>
        <span className="text-text-secondary/40 text-xs">
          {isOpen ? '\u25B2' : '\u25BC'}
        </span>
      </button>
      {isOpen && (
        <div className="px-3 pb-3 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}
