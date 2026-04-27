'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { authedFetch } from '@/lib/api/authed-fetch';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import BirthForm from '@/components/kundali/BirthForm';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { resolveTimezoneFromCoords } from '@/lib/utils/timezone';
import {
  computeEnhancedSynastry,
  computeSynastrySummary,
  computeDashaAlignment,
  compareHouseLords,
  analyzeRelationshipKarakas,
  getSignRelation,
} from '@/lib/comparison/synastry-engine';
import type { SynastryAspect } from '@/lib/comparison/synastry-engine';
import { compareDashas } from '@/lib/matching/dasha-comparison';
import DashaComparisonTimeline from '@/components/kundali/DashaComparisonTimeline';
import SynastryOverlay from '@/components/kundali/SynastryOverlay';
import type { KundaliData, BirthData, ChartStyle } from '@/types/kundali';
import type { Locale , LocaleText} from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ─── Labels ──────────────────────────────────────────────────────────────── */

const L = {
  title:      { en: 'Chart Comparison', hi: 'कुण्डली तुलना', sa: 'कुण्डली तुलनम्' },
  subtitle:   { en: 'Compare two birth charts — synastry aspects, dasha alignment, and compatibility', hi: 'दो जन्म कुण्डलियों की तुलना — सिनेस्ट्री, दशा सामंजस्य एवं अनुकूलता', sa: '' },
  chartA:     { en: 'Chart A', hi: 'कुण्डली अ', sa: 'कुण्डली अ' },
  chartB:     { en: 'Chart B', hi: 'कुण्डली ब', sa: 'कुण्डली ब' },
  back:       { en: '← Back to Kundali', hi: '← कुण्डली पर वापस', sa: '' },
  generate:   { en: 'Generate & Compare', hi: 'तुलना करें', sa: '' },
  reset:      { en: 'Compare Different Charts', hi: 'अलग कुण्डलियों की तुलना करें', sa: '' },
  tab1:       { en: 'Chart Overlay', hi: 'चार्ट ओवरले', sa: '' },
  tab2:       { en: 'Planets & Aspects', hi: 'ग्रह एवं दृष्टि', sa: '' },
  tab3:       { en: 'Dasha Alignment', hi: 'दशा सामंजस्य', sa: '' },
  tab4:       { en: 'Compatibility', hi: 'अनुकूलता', sa: '' },
  showAonB:   { en: 'Show A on B', hi: 'अ → ब', sa: '' },
  showBonA:   { en: 'Show B on A', hi: 'ब → अ', sa: '' },
  solidA:     { en: '● Solid = Chart A', hi: '● ठोस = कुण्डली अ', sa: '' },
  outlinedB:  { en: '○ Outlined = Chart B', hi: '○ रेखाकृत = कुण्डली ब', sa: '' },
  planet:     { en: 'Planet', hi: 'ग्रह', sa: 'ग्रहः' },
  sign:       { en: 'Sign', hi: 'राशि', sa: 'राशिः' },
  degree:     { en: 'Degree', hi: 'अंश', sa: '' },
  nakshatra:  { en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्' },
  house:      { en: 'House', hi: 'भाव', sa: 'भावः' },
  dignity:    { en: 'Dignity', hi: 'गरिमा', sa: '' },
  synaspects: { en: 'Synastry Aspects', hi: 'सिनेस्ट्री दृष्टि', sa: '' },
  harmonious: { en: 'harmonious', hi: 'सामंजस्यपूर्ण', sa: '' },
  tense:      { en: 'tense', hi: 'तनावपूर्ण', sa: '' },
  period:     { en: 'Period', hi: 'अवधि', sa: '' },
  friendship: { en: 'Friendship', hi: 'मैत्री', sa: '' },
  houseLords: { en: 'House Lord Comparison', hi: 'भावेश तुलना', sa: '' },
  venusAnalysis: { en: 'Venus & 7th Lord Analysis', hi: 'शुक्र एवं सप्तमेश विश्लेषण', sa: '' },
  navLagna:   { en: 'Navamsha Lagna Match', hi: 'नवांश लग्न मिलान', sa: '' },
  mangalDosha:{ en: 'Mangal Dosha', hi: 'मंगल दोष', sa: '' },
  keyInsight: { en: 'Key Insight', hi: 'मुख्य अंतर्दृष्टि', sa: '' },
  noAspects:  { en: 'No significant aspects found', hi: 'कोई महत्वपूर्ण दृष्टि नहीं', sa: '' },
  enterBoth:  { en: 'Enter birth details for both charts, then compare', hi: 'दोनों कुण्डलियों के जन्म विवरण दर्ज करें, फिर तुलना करें', sa: '' },
};

function t(obj: Record<string, string>, locale: string) {
  return (obj as Record<string, string>)[locale] ?? obj.en;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const TABS = ['overlay', 'planets', 'dasha', 'compatibility'] as const;
type Tab = (typeof TABS)[number];

const ASPECT_SYMBOLS: Record<string, string> = {
  Conjunction: '☌', Opposition: '☍', Trine: '△', Square: '□', Sextile: '⚹',
};

const DIGNITY_LABELS: Record<string, LocaleText> = {
  exalted:      { en: 'Exalted', hi: 'उच्च' },
  debilitated:  { en: 'Debilitated', hi: 'नीच' },
  own:          { en: 'Own Sign', hi: 'स्वगृह' },
  neutral:      { en: '—', hi: '—' },
};

function relationColor(rel: string): string {
  if (rel === 'same') return 'bg-emerald-500/10 border-emerald-500/20';
  if (rel === 'trine') return 'bg-blue-500/10 border-blue-500/20';
  if (rel === 'difficult') return 'bg-red-500/10 border-red-500/20';
  return 'bg-amber-500/10 border-amber-500/20';
}

function friendshipBadge(level: number) {
  if (level === 2) return { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: '✓' };
  if (level === 1) return { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: '~' };
  return { bg: 'bg-red-500/15 text-red-400 border-red-500/30', icon: '✗' };
}

/* ─── 9x9 Aspect Grid (Desktop) ──────────────────────────────────────────── */

function AspectGrid({ aspects, locale }: { aspects: SynastryAspect[]; locale: string }) {
  const planetIds = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const lookup = useMemo(() => {
    const m = new Map<string, SynastryAspect>();
    for (const a of aspects) m.set(`${a.planetA}-${a.planetB}`, a);
    return m;
  }, [aspects]);

  return (
    <div className="overflow-x-auto">
      <table className="text-xs w-full">
        <thead>
          <tr>
            <th className="p-1.5 text-gold-primary font-semibold text-left">A ↓ / B →</th>
            {planetIds.map(id => (
              <th key={id} className="p-1.5 text-center text-gold-primary/80 font-medium">
                {GRAHAS[id]?.name[locale as Locale]?.slice(0, 3) ?? ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {planetIds.map(rowId => (
            <tr key={rowId} className="border-t border-gold-primary/5">
              <td className="p-1.5 text-gold-light font-medium whitespace-nowrap">
                {GRAHAS[rowId]?.name[locale as Locale] ?? ''}
              </td>
              {planetIds.map(colId => {
                const asp = lookup.get(`${rowId}-${colId}`);
                if (!asp) return <td key={colId} className="p-1.5 text-center text-text-tertiary/30">·</td>;
                const color = asp.isHarmonious ? 'text-emerald-400' : 'text-red-400';
                return (
                  <td key={colId} className={`p-1.5 text-center ${color} font-bold cursor-default`} title={`${asp.type} (${asp.orb}°)`}>
                    {asp.symbol}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Aspect List (Mobile) ────────────────────────────────────────────────── */

function AspectList({ aspects, locale }: { aspects: SynastryAspect[]; locale: string }) {
  return (
    <div className="space-y-2">
      {aspects.slice(0, 15).map((asp, i) => (
        <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${asp.isHarmonious ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg ${asp.isHarmonious ? 'text-emerald-400' : 'text-red-400'}`}>{asp.symbol}</span>
            <span className="text-text-primary text-sm">
              {GRAHAS[asp.planetA]?.name[locale as Locale]} — {GRAHAS[asp.planetB]?.name[locale as Locale]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-tertiary text-xs">{asp.type}</span>
            <span className="text-text-secondary text-xs">{asp.orb}°</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Main Component                                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function ComparePage() {
  const locale = useLocale();
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  /* ── State ────────────────────────────────────────────────────────────── */
  const [chartA, setChartA] = useState<KundaliData | null>(null);
  const [chartB, setChartB] = useState<KundaliData | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [errorA, setErrorA] = useState('');
  const [errorB, setErrorB] = useState('');
  const [formsCollapsed, setFormsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('overlay');
  // overlaySwapped state moved to SynastryOverlay component

  const user = useAuthStore(s => s.user);
  const [savedCharts, setSavedCharts] = useState<Array<{ id: string; label: string; birth_data: { name?: string; date: string; time: string; place: string; lat: number; lng: number; relationship?: string } }>>([]);

  // Fetch saved charts when logged in
  useEffect(() => {
    if (!user) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.from('saved_charts').select('id, label, birth_data').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('[compare] saved charts fetch failed:', error); return; }
        setSavedCharts(data || []);
      });
  }, [user]);

  const loadSavedChart = async (chart: (typeof savedCharts)[number], target: 'A' | 'B') => {
    const tz = await resolveTimezoneFromCoords(chart.birth_data.lat, chart.birth_data.lng);
    generateChart({
      name: chart.birth_data.name || chart.label,
      date: chart.birth_data.date,
      time: chart.birth_data.time,
      place: chart.birth_data.place,
      lat: chart.birth_data.lat,
      lng: chart.birth_data.lng,
      timezone: tz || 'UTC',
      ayanamsha: 'lahiri',
    }, 'north', target);
  };

  const bothReady = chartA !== null && chartB !== null;

  /* ── Generate chart ───────────────────────────────────────────────────── */
  const generateChart = async (birthData: BirthData, _style: ChartStyle, target: 'A' | 'B') => {
    const setLoading = target === 'A' ? setLoadingA : setLoadingB;
    const setChart = target === 'A' ? setChartA : setChartB;
    const setError = target === 'A' ? setErrorA : setErrorB;
    setLoading(true);
    setError('');
    try {
      const res = await authedFetch('/api/kundali', {
        method: 'POST',
        body: JSON.stringify(birthData),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setChart(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate chart');
    }
    setLoading(false);
  };

  /* ── Computed analysis ────────────────────────────────────────────────── */
  const synastry = useMemo(() => bothReady ? computeEnhancedSynastry(chartA, chartB) : [], [chartA, chartB, bothReady]);
  const summary = useMemo(() => computeSynastrySummary(synastry), [synastry]);
  const dashaAlignment = useMemo(() => bothReady ? computeDashaAlignment(chartA, chartB) : [], [chartA, chartB, bothReady]);
  const houseLords = useMemo(() => bothReady ? compareHouseLords(chartA, chartB) : [], [chartA, chartB, bothReady]);
  const karakas = useMemo(() => bothReady ? analyzeRelationshipKarakas(chartA, chartB) : null, [chartA, chartB, bothReady]);

  // Dasha comparison timeline — 15-year window from current year
  const dashaComparison = useMemo(() => {
    if (!bothReady) return null;
    const now = new Date();
    const startYear = now.getFullYear();
    const endYear = startYear + 15;
    return compareDashas(
      chartA.dashas,
      chartB.dashas,
      chartA.ascendant.sign,
      chartB.ascendant.sign,
      startYear,
      endYear,
    );
  }, [chartA, chartB, bothReady]);

  // Auto-collapse forms when both charts are ready
  if (bothReady && !formsCollapsed) {
    setFormsCollapsed(true);
  }

  /* ── Name helpers ─────────────────────────────────────────────────────── */
  const nameA = chartA?.birthData.name || chartA?.birthData.place || t(L.chartA, locale);
  const nameB = chartB?.birthData.name || chartB?.birthData.place || t(L.chartB, locale);

  /* ═══════════════════════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]" />
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-gradient mb-3" style={headingFont}>
            {t(L.title, locale)}
          </h1>
          <p className="text-text-secondary text-sm max-w-xl mx-auto">{t(L.subtitle, locale)}</p>
          <div className="mt-4">
            <Link href="/kundali" className="text-sm text-gold-primary/60 hover:text-gold-primary transition-colors">
              {t(L.back, locale)}
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* ── Input Area: Two side-by-side BirthForms ─────────────────── */}
        {!formsCollapsed ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <p className="text-center text-text-secondary text-sm mb-6">{t(L.enterBoth, locale)}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart A */}
              <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
                <h2 className="text-gold-light text-lg font-bold mb-4 text-center" style={headingFont}>
                  {t(L.chartA, locale)}
                  {chartA && <span className="ml-2 text-emerald-400 text-sm">✓</span>}
                </h2>
                {savedCharts.length > 0 && (
                  <div className="mb-4">
                    <select
                      onChange={(e) => { const c = savedCharts.find(s => s.id === e.target.value); if (c) loadSavedChart(c, 'A'); }}
                      defaultValue=""
                      className="w-full bg-bg-secondary border border-gold-primary/15 rounded-lg px-3 py-2 text-sm text-gold-light focus:outline-none focus:border-gold-primary/40 cursor-pointer"
                    >
                      <option value="" disabled>{locale === 'hi' ? 'सहेजी कुण्डली चुनें...' : 'Pick a saved chart...'}</option>
                      {savedCharts.map(c => (
                        <option key={c.id} value={c.id}>{c.birth_data.name || c.label} — {c.birth_data.date}</option>
                      ))}
                    </select>
                    <p className="text-text-secondary/50 text-xs text-center mt-1.5">{locale === 'hi' ? 'या नीचे नए विवरण भरें' : 'or enter new details below'}</p>
                  </div>
                )}
                {errorA && <p className="text-red-400 text-xs text-center mb-3">{errorA}</p>}
                <BirthForm onSubmit={(bd, style) => generateChart(bd, style, 'A')} loading={loadingA} />
              </div>
              {/* Chart B */}
              <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
                <h2 className="text-gold-light text-lg font-bold mb-4 text-center" style={headingFont}>
                  {t(L.chartB, locale)}
                  {chartB && <span className="ml-2 text-emerald-400 text-sm">✓</span>}
                </h2>
                {savedCharts.length > 0 && (
                  <div className="mb-4">
                    <select
                      onChange={(e) => { const c = savedCharts.find(s => s.id === e.target.value); if (c) loadSavedChart(c, 'B'); }}
                      defaultValue=""
                      className="w-full bg-bg-secondary border border-gold-primary/15 rounded-lg px-3 py-2 text-sm text-gold-light focus:outline-none focus:border-gold-primary/40 cursor-pointer"
                    >
                      <option value="" disabled>{locale === 'hi' ? 'सहेजी कुण्डली चुनें...' : 'Pick a saved chart...'}</option>
                      {savedCharts.map(c => (
                        <option key={c.id} value={c.id}>{c.birth_data.name || c.label} — {c.birth_data.date}</option>
                      ))}
                    </select>
                    <p className="text-text-secondary/50 text-xs text-center mt-1.5">{locale === 'hi' ? 'या नीचे नए विवरण भरें' : 'or enter new details below'}</p>
                  </div>
                )}
                {errorB && <p className="text-red-400 text-xs text-center mb-3">{errorB}</p>}
                <BirthForm onSubmit={(bd, style) => generateChart(bd, style, 'B')} loading={loadingB} />
              </div>
            </div>
          </motion.div>
        ) : (
          /* Collapsed form header — click to re-expand */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-8 bg-gradient-to-r from-[#2d1b69]/30 to-[#1a1040]/30 border border-gold-primary/12 rounded-xl px-5 py-3">
            <div className="flex items-center gap-4">
              <div className="text-sm"><span className="text-gold-light font-semibold">{t(L.chartA, locale)}:</span> <span className="text-text-secondary">{nameA}</span></div>
              <span className="text-gold-primary/30">|</span>
              <div className="text-sm"><span className="text-gold-light font-semibold">{t(L.chartB, locale)}:</span> <span className="text-text-secondary">{nameB}</span></div>
            </div>
            <button onClick={() => { setFormsCollapsed(false); }}
              className="text-xs text-gold-primary/60 hover:text-gold-primary transition-colors underline underline-offset-2">
              Edit
            </button>
          </motion.div>
        )}

        {/* ── Tabs + Content ──────────────────────────────────────────── */}
        {bothReady && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-bg-secondary/60 rounded-xl mb-8 overflow-x-auto">
              {TABS.map((tab, idx) => {
                const label = [L.tab1, L.tab2, L.tab3, L.tab4][idx];
                const isActive = activeTab === tab;
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`relative flex-1 min-w-[120px] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-gold-light' : 'text-text-secondary hover:text-text-primary'}`}>
                    {isActive && (
                      <motion.div layoutId="tab-pill" className="absolute inset-0 bg-gradient-to-br from-[#2d1b69]/60 to-[#1a1040]/60 border border-gold-primary/20 rounded-lg" />
                    )}
                    <span className="relative z-10">{t(label, locale)}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>

                {/* ═══ TAB 1: Synastry Overlay ═══ */}
                {activeTab === 'overlay' && (
                  <SynastryOverlay
                    chartA={chartA}
                    chartB={chartB}
                    nameA={nameA}
                    nameB={nameB}
                    locale={locale}
                    chartStyle="north"
                  />
                )}

                {/* ═══ TAB 2: Planets & Aspects ═══ */}
                {activeTab === 'planets' && (
                  <div className="space-y-10">
                    {/* Planet comparison table */}
                    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gold-primary/15">
                              <th className="text-left py-3 px-3 text-gold-primary font-semibold">{t(L.planet, locale)}</th>
                              <th className="text-left py-3 px-2 text-gold-primary font-semibold" colSpan={2}>{t(L.chartA, locale)}</th>
                              <th className="text-left py-3 px-2 text-gold-primary font-semibold" colSpan={2}>{t(L.chartB, locale)}</th>
                              <th className="text-center py-3 px-2 text-gold-primary font-semibold">Rel.</th>
                            </tr>
                            <tr className="border-b border-gold-primary/8 text-xs text-text-tertiary">
                              <th />
                              <th className="text-left py-1 px-2">{t(L.sign, locale)} / {t(L.degree, locale)}</th>
                              <th className="text-left py-1 px-2">{t(L.nakshatra, locale)} / H</th>
                              <th className="text-left py-1 px-2">{t(L.sign, locale)} / {t(L.degree, locale)}</th>
                              <th className="text-left py-1 px-2">{t(L.nakshatra, locale)} / H</th>
                              <th />
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gold-primary/5">
                            {chartA.planets.map((pA) => {
                              const pB = chartB.planets.find(p => p.planet.id === pA.planet.id);
                              if (!pB) return null;
                              const rel = getSignRelation(pA.sign, pB.sign);
                              const rowBg = relationColor(rel.relation);
                              return (
                                <tr key={pA.planet.id} className={`${rowBg} border border-transparent`}>
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-2">
                                      <GrahaIconById id={pA.planet.id} size={20} className="opacity-80" />
                                      <span className="text-gold-light font-medium" style={headingFont}>
                                        {pA.planet.name[locale as Locale]}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-2 text-text-secondary text-xs">
                                    {RASHIS[pA.sign - 1]?.name[locale as Locale]} {pA.degree}
                                  </td>
                                  <td className="py-2.5 px-2 text-text-secondary text-xs">
                                    {pA.nakshatra?.name?.[locale as Locale] ?? '—'} / H{pA.house}
                                  </td>
                                  <td className="py-2.5 px-2 text-text-secondary text-xs">
                                    {RASHIS[pB.sign - 1]?.name[locale as Locale]} {pB.degree}
                                  </td>
                                  <td className="py-2.5 px-2 text-text-secondary text-xs">
                                    {pB.nakshatra?.name?.[locale as Locale] ?? '—'} / H{pB.house}
                                  </td>
                                  <td className="py-2.5 px-2 text-center">
                                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${rel.color === 'emerald' ? 'text-emerald-400' : rel.color === 'red' ? 'text-red-400' : rel.color === 'blue' ? 'text-blue-400' : 'text-amber-400'}`}>
                                      {rel.label[locale as Locale]}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Synastry aspects */}
                    <div>
                      <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
                        {t(L.synaspects, locale)}
                      </h3>

                      {synastry.length > 0 ? (
                        <>
                          {/* Summary stats */}
                          <div className="flex items-center justify-center gap-6 mb-6 text-sm">
                            <span className="text-emerald-400 font-semibold">{summary.harmonious} {t(L.harmonious, locale)}</span>
                            <span className="text-text-tertiary">|</span>
                            <span className="text-red-400 font-semibold">{summary.tense} {t(L.tense, locale)}</span>
                            <span className="text-text-tertiary">—</span>
                            <span className="text-text-secondary italic">{summary.dominantPattern[locale as Locale]}</span>
                          </div>

                          {/* Desktop: 9x9 grid */}
                          <div className="hidden lg:block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4">
                            <AspectGrid aspects={synastry} locale={locale} />
                          </div>

                          {/* Mobile: sorted list */}
                          <div className="lg:hidden">
                            <AspectList aspects={synastry} locale={locale} />
                          </div>
                        </>
                      ) : (
                        <p className="text-center text-text-tertiary text-sm py-8">{t(L.noAspects, locale)}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* ═══ TAB 3: Dasha Alignment ═══ */}
                {activeTab === 'dasha' && (
                  <div className="space-y-6">
                    {/* Key insight */}
                    {dashaAlignment.length > 0 && (() => {
                      const current = dashaAlignment[0];
                      const fr = current.friendship;
                      const badge = friendshipBadge(fr.level);
                      return (
                        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
                          <h4 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>{t(L.keyInsight, locale)}</h4>
                          <p className="text-text-secondary text-sm">
                            {locale === 'en'
                              ? `Currently, ${nameA} is running ${current.chartAMaha.planetName.en} Maha Dasha while ${nameB} runs ${current.chartBMaha.planetName.en}. These dasha lords are ${fr.label.en.toLowerCase()} to each other.`
                              : `अभी ${nameA} ${current.chartAMaha.planetName.hi} महादशा में हैं और ${nameB} ${current.chartBMaha.planetName.hi} में। ये दशा स्वामी परस्पर ${fr.label.hi} हैं।`
                            }
                          </p>
                          <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
                            {badge.icon} {fr.label[locale as Locale]}
                          </span>
                        </div>
                      );
                    })()}

                    {/* Dasha table */}
                    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gold-primary/15">
                              <th className="text-left py-3 px-4 text-gold-primary font-semibold">{t(L.period, locale)}</th>
                              <th className="text-left py-3 px-4 text-gold-primary font-semibold">{t(L.chartA, locale)} ({nameA})</th>
                              <th className="text-left py-3 px-4 text-gold-primary font-semibold">{t(L.chartB, locale)} ({nameB})</th>
                              <th className="text-center py-3 px-4 text-gold-primary font-semibold">{t(L.friendship, locale)}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gold-primary/5">
                            {dashaAlignment.map((row, i) => {
                              const badge = friendshipBadge(row.friendship.level);
                              return (
                                <tr key={i} className="hover:bg-gold-primary/3">
                                  <td className="py-3 px-4 text-text-secondary text-xs">
                                    {i === 0 ? (locale === 'en' ? 'Current' : 'वर्तमान') : `+${i * 10}y`}
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <GrahaIconById id={GRAHAS.findIndex(g => g.name.en === row.chartAMaha.planet) >= 0 ? GRAHAS.findIndex(g => g.name.en === row.chartAMaha.planet) : 0} size={18} className="opacity-70" />
                                      <div>
                                        <span className="text-gold-light text-sm font-medium">{row.chartAMaha.planetName[locale as Locale]}</span>
                                        {row.chartAAntar && (
                                          <span className="text-text-tertiary text-xs ml-1">/ {row.chartAAntar.planetName[locale as Locale]}</span>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <GrahaIconById id={GRAHAS.findIndex(g => g.name.en === row.chartBMaha.planet) >= 0 ? GRAHAS.findIndex(g => g.name.en === row.chartBMaha.planet) : 0} size={18} className="opacity-70" />
                                      <div>
                                        <span className="text-gold-light text-sm font-medium">{row.chartBMaha.planetName[locale as Locale]}</span>
                                        {row.chartBAntar && (
                                          <span className="text-text-tertiary text-xs ml-1">/ {row.chartBAntar.planetName[locale as Locale]}</span>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
                                      {badge.icon} {row.friendship.label[locale as Locale]}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Dasha Comparison Timeline */}
                    {dashaComparison && dashaComparison.entries.length > 0 && (
                      <div>
                        <h4 className="text-gold-light text-sm font-bold mb-3" style={headingFont}>
                          {locale === 'en' ? 'Dasha Timeline Overlay' : 'दशा समयरेखा ओवरले'}
                        </h4>
                        <DashaComparisonTimeline result={dashaComparison} locale={locale} />
                      </div>
                    )}

                    {dashaAlignment.length === 0 && (
                      <p className="text-center text-text-tertiary text-sm py-8">
                        {locale === 'en' ? 'Dasha data not available for comparison' : 'दशा डेटा उपलब्ध नहीं'}
                      </p>
                    )}
                  </div>
                )}

                {/* ═══ TAB 4: Compatibility Deep Dive ═══ */}
                {activeTab === 'compatibility' && (
                  <div className="space-y-8">
                    {/* House Lord Comparison */}
                    <div>
                      <h3 className="text-gold-gradient text-lg font-bold mb-4" style={headingFont}>{t(L.houseLords, locale)}</h3>
                      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gold-primary/15">
                                <th className="text-left py-3 px-4 text-gold-primary font-semibold">{t(L.house, locale)}</th>
                                <th className="text-left py-3 px-4 text-gold-primary font-semibold">{nameA}</th>
                                <th className="text-left py-3 px-4 text-gold-primary font-semibold">{nameB}</th>
                                <th className="text-center py-3 px-4 text-gold-primary font-semibold">Rel.</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gold-primary/5">
                              {houseLords.map((hl) => {
                                const rel = getSignRelation(hl.chartALord.sign, hl.chartBLord.sign);
                                const rowBg = relationColor(hl.relationship);
                                return (
                                  <tr key={hl.house} className={`${rowBg} border border-transparent`}>
                                    <td className="py-2.5 px-4 text-gold-light font-medium" style={headingFont}>
                                      {hl.houseName[locale as Locale]}
                                    </td>
                                    <td className="py-2.5 px-4 text-text-secondary text-xs">
                                      <div className="flex items-center gap-1.5">
                                        <GrahaIconById id={hl.chartALord.planetId} size={16} className="opacity-70" />
                                        <span>{GRAHAS[hl.chartALord.planetId]?.name[locale as Locale]}</span>
                                        <span className="text-text-tertiary">in {RASHIS[hl.chartALord.sign - 1]?.name[locale as Locale]}</span>
                                        <span className="text-text-tertiary italic">({DIGNITY_LABELS[hl.chartALord.dignity]?.[locale === 'en' ? 'en' : 'hi'] ?? '—'})</span>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-text-secondary text-xs">
                                      <div className="flex items-center gap-1.5">
                                        <GrahaIconById id={hl.chartBLord.planetId} size={16} className="opacity-70" />
                                        <span>{GRAHAS[hl.chartBLord.planetId]?.name[locale as Locale]}</span>
                                        <span className="text-text-tertiary">in {RASHIS[hl.chartBLord.sign - 1]?.name[locale as Locale]}</span>
                                        <span className="text-text-tertiary italic">({DIGNITY_LABELS[hl.chartBLord.dignity]?.[locale === 'en' ? 'en' : 'hi'] ?? '—'})</span>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                      <span className={`text-xs font-medium ${rel.color === 'emerald' ? 'text-emerald-400' : rel.color === 'red' ? 'text-red-400' : rel.color === 'blue' ? 'text-blue-400' : 'text-amber-400'}`}>
                                        {rel.label[locale as Locale]}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Venus & 7th Lord Analysis */}
                    {karakas && (
                      <div>
                        <h3 className="text-gold-gradient text-lg font-bold mb-4" style={headingFont}>{t(L.venusAnalysis, locale)}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Venus card */}
                          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <GrahaIconById id={5} size={24} className="opacity-80" />
                              <h4 className="text-gold-light font-semibold text-sm" style={headingFont}>
                                {GRAHAS[5]?.name[locale as Locale]} ({locale === 'en' ? 'Venus' : 'शुक्र'})
                              </h4>
                            </div>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-text-tertiary">{nameA}:</span>
                                <span className="text-text-secondary">
                                  {RASHIS[karakas.chartAVenus.sign - 1]?.name[locale as Locale]} H{karakas.chartAVenus.house}
                                  {karakas.chartAVenus.isRetrograde && <span className="text-amber-400 ml-1">(R)</span>}
                                  <span className="text-text-tertiary ml-1 italic">({DIGNITY_LABELS[karakas.chartAVenus.dignity]?.[locale === 'en' ? 'en' : 'hi']})</span>
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-tertiary">{nameB}:</span>
                                <span className="text-text-secondary">
                                  {RASHIS[karakas.chartBVenus.sign - 1]?.name[locale as Locale]} H{karakas.chartBVenus.house}
                                  {karakas.chartBVenus.isRetrograde && <span className="text-amber-400 ml-1">(R)</span>}
                                  <span className="text-text-tertiary ml-1 italic">({DIGNITY_LABELS[karakas.chartBVenus.dignity]?.[locale === 'en' ? 'en' : 'hi']})</span>
                                </span>
                              </div>
                              <div className="pt-2 border-t border-gold-primary/10 flex justify-between">
                                <span className="text-text-tertiary">{locale === 'en' ? 'Relationship:' : 'सम्बन्ध:'}</span>
                                <span className={`font-semibold ${karakas.venusRelation === 'same' || karakas.venusRelation === 'trine' ? 'text-emerald-400' : karakas.venusRelation === 'difficult' ? 'text-red-400' : 'text-amber-400'}`}>
                                  {getSignRelation(karakas.chartAVenus.sign, karakas.chartBVenus.sign).label[locale as Locale]}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 7th Lord card */}
                          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
                            <h4 className="text-gold-light font-semibold text-sm mb-3" style={headingFont}>
                              {locale === 'en' ? '7th House Lord' : 'सप्तमेश'}
                            </h4>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-text-tertiary">{nameA}:</span>
                                <span className="text-text-secondary">
                                  <span className="flex items-center gap-1">
                                    <GrahaIconById id={karakas.chartA7thLord.planetId} size={14} className="opacity-70 inline-block" />
                                    {GRAHAS[karakas.chartA7thLord.planetId]?.name[locale as Locale]} in {RASHIS[karakas.chartA7thLord.sign - 1]?.name[locale as Locale]} H{karakas.chartA7thLord.house}
                                  </span>
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-tertiary">{nameB}:</span>
                                <span className="text-text-secondary">
                                  <span className="flex items-center gap-1">
                                    <GrahaIconById id={karakas.chartB7thLord.planetId} size={14} className="opacity-70 inline-block" />
                                    {GRAHAS[karakas.chartB7thLord.planetId]?.name[locale as Locale]} in {RASHIS[karakas.chartB7thLord.sign - 1]?.name[locale as Locale]} H{karakas.chartB7thLord.house}
                                  </span>
                                </span>
                              </div>
                              <div className="pt-2 border-t border-gold-primary/10 flex justify-between">
                                <span className="text-text-tertiary">{locale === 'en' ? 'Relationship:' : 'सम्बन्ध:'}</span>
                                <span className={`font-semibold ${karakas.seventhLordRelation === 'same' || karakas.seventhLordRelation === 'trine' ? 'text-emerald-400' : karakas.seventhLordRelation === 'difficult' ? 'text-red-400' : 'text-amber-400'}`}>
                                  {getSignRelation(karakas.chartA7thLord.sign, karakas.chartB7thLord.sign).label[locale as Locale]}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navamsha Lagna Match */}
                    {karakas && (
                      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
                        <h4 className="text-gold-light font-semibold text-sm mb-3" style={headingFont}>{t(L.navLagna, locale)}</h4>
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl ${karakas.navamshaLagnaMatch ? 'text-emerald-400' : 'text-text-tertiary'}`}>
                            {karakas.navamshaLagnaMatch ? '✓' : '✗'}
                          </span>
                          <div>
                            <p className="text-sm text-text-primary">
                              {karakas.navamshaLagnaMatch
                                ? (locale === 'en' ? 'Navamsha Lagnas match — strong soul-level compatibility indicator' : 'नवांश लग्न मिलते हैं — आत्म-स्तर पर अनुकूलता का सूचक')
                                : (locale === 'en' ? 'Navamsha Lagnas differ — other factors carry more weight' : 'नवांश लग्न भिन्न हैं — अन्य कारक अधिक महत्वपूर्ण')
                              }
                            </p>
                            <p className="text-xs text-text-tertiary mt-1">
                              {nameA}: {RASHIS[(chartA.navamshaChart?.ascendantSign || 1) - 1]?.name[locale as Locale] ?? '—'}
                              {' | '}
                              {nameB}: {RASHIS[(chartB.navamshaChart?.ascendantSign || 1) - 1]?.name[locale as Locale] ?? '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mangal Dosha */}
                    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
                      <h4 className="text-gold-light font-semibold text-sm mb-3" style={headingFont}>{t(L.mangalDosha, locale)}</h4>
                      {(() => {
                        // Check Mars house placement for Mangal Dosha (houses 1, 2, 4, 7, 8, 12)
                        const marsA = chartA.planets.find(p => p.planet.id === 2);
                        const marsB = chartB.planets.find(p => p.planet.id === 2);
                        const DOSHA_HOUSES = [1, 2, 4, 7, 8, 12];
                        const hasA = marsA ? DOSHA_HOUSES.includes(marsA.house) : false;
                        const hasB = marsB ? DOSHA_HOUSES.includes(marsB.house) : false;

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${hasA ? 'border-red-500/20 bg-red-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                              <span className={`text-lg ${hasA ? 'text-red-400' : 'text-emerald-400'}`}>{hasA ? '⚠' : '✓'}</span>
                              <div>
                                <p className="text-sm text-text-primary font-medium">{nameA}</p>
                                <p className="text-xs text-text-secondary">
                                  {hasA
                                    ? (locale === 'en' ? `Mars in House ${marsA?.house} — Mangal Dosha present` : `मंगल ${marsA?.house}वें भाव में — मंगल दोष है`)
                                    : (locale === 'en' ? `Mars in House ${marsA?.house} — No Mangal Dosha` : `मंगल ${marsA?.house}वें भाव में — मंगल दोष नहीं`)
                                  }
                                </p>
                              </div>
                            </div>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${hasB ? 'border-red-500/20 bg-red-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                              <span className={`text-lg ${hasB ? 'text-red-400' : 'text-emerald-400'}`}>{hasB ? '⚠' : '✓'}</span>
                              <div>
                                <p className="text-sm text-text-primary font-medium">{nameB}</p>
                                <p className="text-xs text-text-secondary">
                                  {hasB
                                    ? (locale === 'en' ? `Mars in House ${marsB?.house} — Mangal Dosha present` : `मंगल ${marsB?.house}वें भाव में — मंगल दोष है`)
                                    : (locale === 'en' ? `Mars in House ${marsB?.house} — No Mangal Dosha` : `मंगल ${marsB?.house}वें भाव में — मंगल दोष नहीं`)
                                  }
                                </p>
                              </div>
                            </div>
                            {hasA !== hasB && (
                              <div className="sm:col-span-2 text-xs text-amber-400/80 bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2">
                                {locale === 'en'
                                  ? 'One chart has Mangal Dosha while the other does not. Traditional texts recommend both charts have matching dosha status, though exceptions exist.'
                                  : 'एक कुण्डली में मंगल दोष है और दूसरे में नहीं। परंपरागत ग्रंथ दोनों कुण्डलियों में समान दोष स्थिति की सलाह देते हैं।'
                                }
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Reset button */}
            <div className="text-center mt-10">
              <button onClick={() => { setChartA(null); setChartB(null); setFormsCollapsed(false); setActiveTab('overlay'); }}
                className="px-6 py-2.5 rounded-xl border border-gold-primary/20 text-gold-primary text-sm hover:bg-gold-primary/10 transition-colors">
                {t(L.reset, locale)}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
