'use client';

import { useState, useCallback, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRightLeft, RotateCcw, Moon, ChevronDown, ChevronUp, Sparkles, Shield, Calendar, TrendingUp } from 'lucide-react';
import { generateAnnualForecast } from '@/lib/forecast/annual-engine';
import type { AnnualForecast, RemedyRecommendation, KeyDate } from '@/lib/forecast/annual-engine';
import type { MonthlyTransitSnapshot, MonthlyPlanetTransit } from '@/lib/forecast/monthly-transit';
import type { YearRatingFactor } from '@/lib/forecast/year-rating';
import type { DashaNarrativeEntry } from '@/lib/forecast/dasha-narrative';
import BirthForm from '@/components/kundali/BirthForm';
import ChartNorth from '@/components/kundali/ChartNorth';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { authedFetch } from '@/lib/api/authed-fetch';
import type { KundaliData, BirthData, ChartStyle } from '@/types/kundali';
import type { VarshaphalData } from '@/types/varshaphal';
import type { Locale } from '@/types/panchang';

// ─── Labels ────────────────────────────────────────────────────────
const LABELS: Record<string, {
  title: string; subtitle: string; desc: string; generate: string; generating: string;
  yearOverview: string; solarReturnChart: string; overlayNatal: string; monthlyTimeline: string;
  transitSummary: string; dashaNarrative: string; keyDates: string; remedies: string;
  yearRating: string; overallScore: string; guidesThisYear: string; munthaIn: string;
  house: string; currentDasha: string; yearSummary: string; tajikaYogas: string;
  sahams: string; showAllSahams: string; favorable: string; unfavorable: string;
  current: string; outlook: string; avgSav: string; sign: string; signChange: string;
  retrograde: string; events: string; planet: string; bindus: string; changesOn: string;
  mahaDasha: string; antarDasha: string; mahaChanging: string; mahaChangingDesc: string;
  mahaChangingDescHi: string; upcomingTransitions: string; themes: string; dignity: string;
  gemstone: string; mantra: string; practice: string; selectYear: string; collapseForm: string;
}> = {
  en: {
    title: 'Annual Forecast',
    subtitle: 'Comprehensive Year-Ahead Vedic Forecast',
    desc: 'Combines your natal chart, solar return (Varshaphal), monthly transits, and dasha timeline into a single holistic prediction for any year.',
    generate: 'Generate Forecast',
    generating: 'Computing Annual Forecast...',
    yearOverview: 'Year Overview',
    solarReturnChart: 'Solar Return Chart',
    overlayNatal: 'Overlay natal planets',
    monthlyTimeline: 'Monthly Timeline',
    transitSummary: 'Transit Summary',
    dashaNarrative: 'Dasha Narrative',
    keyDates: 'Key Dates',
    remedies: 'Remedies & Guidance',
    yearRating: 'Year Rating',
    overallScore: 'Overall Score',
    guidesThisYear: 'guides this year',
    munthaIn: 'Muntha in',
    house: 'House',
    currentDasha: 'Current Dasha',
    yearSummary: 'Year Summary',
    tajikaYogas: 'Tajika Yogas',
    sahams: 'Tajika Sahams',
    showAllSahams: 'Show all',
    favorable: 'Favorable',
    unfavorable: 'Unfavorable',
    current: 'Current',
    outlook: 'Outlook',
    avgSav: 'Avg SAV',
    sign: 'Sign',
    signChange: 'Sign change',
    retrograde: 'Retrograde',
    events: 'Events',
    planet: 'Planet',
    bindus: 'Bindus',
    changesOn: 'Changes on',
    mahaDasha: 'Maha Dasha',
    antarDasha: 'Antar Dasha',
    mahaChanging: 'Major Dasha Transition This Year',
    mahaChangingDesc: 'A Maha Dasha change brings a fundamental shift in life themes. Prepare for new directions.',
    mahaChangingDescHi: 'महादशा परिवर्तन जीवन में मूलभूत बदलाव लाता है। नई दिशाओं के लिए तैयार रहें।',
    upcomingTransitions: 'Upcoming Transitions',
    themes: 'Themes',
    dignity: 'Dignity',
    gemstone: 'Gemstone',
    mantra: 'Mantra',
    practice: 'Practice',
    selectYear: 'Select Year',
    collapseForm: 'Change Input',
  },
  hi: {
    title: 'वार्षिक भविष्यफल',
    subtitle: 'समग्र वैदिक वर्ष-पूर्वानुमान',
    desc: 'आपकी जन्म कुण्डली, सूर्य प्रत्यावर्तन (वर्षफल), मासिक गोचर और दशा समयरेखा को एक समग्र भविष्यवाणी में जोड़ता है।',
    generate: 'भविष्यफल बनाएं',
    generating: 'वार्षिक भविष्यफल की गणना...',
    yearOverview: 'वर्ष अवलोकन',
    solarReturnChart: 'सूर्य प्रत्यावर्तन कुण्डली',
    overlayNatal: 'जन्म ग्रह दिखाएं',
    monthlyTimeline: 'मासिक समयरेखा',
    transitSummary: 'गोचर सारांश',
    dashaNarrative: 'दशा कथा',
    keyDates: 'मुख्य तिथियां',
    remedies: 'उपाय एवं मार्गदर्शन',
    yearRating: 'वर्ष मूल्यांकन',
    overallScore: 'समग्र अंक',
    guidesThisYear: 'इस वर्ष मार्गदर्शक',
    munthaIn: 'मुंथा',
    house: 'भाव',
    currentDasha: 'वर्तमान दशा',
    yearSummary: 'वर्ष सारांश',
    tajikaYogas: 'ताजिक योग',
    sahams: 'ताजिक सहम',
    showAllSahams: 'सभी दिखाएं',
    favorable: 'शुभ',
    unfavorable: 'अशुभ',
    current: 'वर्तमान',
    outlook: 'दृष्टिकोण',
    avgSav: 'औसत SAV',
    sign: 'राशि',
    signChange: 'राशि परिवर्तन',
    retrograde: 'वक्री',
    events: 'घटनाएं',
    planet: 'ग्रह',
    bindus: 'बिन्दु',
    changesOn: 'परिवर्तन',
    mahaDasha: 'महादशा',
    antarDasha: 'अन्तर्दशा',
    mahaChanging: 'इस वर्ष महादशा परिवर्तन',
    mahaChangingDesc: 'महादशा परिवर्तन जीवन में मूलभूत बदलाव लाता है। नई दिशाओं के लिए तैयार रहें।',
    mahaChangingDescHi: 'महादशा परिवर्तन जीवन में मूलभूत बदलाव लाता है। नई दिशाओं के लिए तैयार रहें।',
    upcomingTransitions: 'आगामी परिवर्तन',
    themes: 'विषय',
    dignity: 'गरिमा',
    gemstone: 'रत्न',
    mantra: 'मंत्र',
    practice: 'अभ्यास',
    selectYear: 'वर्ष चुनें',
    collapseForm: 'इनपुट बदलें',
  },
};

const DIGNITY_LABELS: Record<string, Record<string, string>> = {
  exalted: { en: 'Exalted', hi: 'उच्च' },
  debilitated: { en: 'Debilitated', hi: 'नीच' },
  own: { en: 'Own Sign', hi: 'स्वगृही' },
  neutral: { en: 'Neutral', hi: 'सामान्य' },
};

const OUTLOOK_COLORS: Record<string, string> = {
  favorable: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  mixed: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
  challenging: 'text-red-400 bg-red-500/15 border-red-500/30',
};

const OUTLOOK_LABELS: Record<string, Record<string, string>> = {
  favorable: { en: 'Favorable', hi: 'अनुकूल' },
  mixed: { en: 'Mixed', hi: 'मिश्रित' },
  challenging: { en: 'Challenging', hi: 'चुनौतीपूर्ण' },
};

const KEY_DATE_ICONS: Record<string, typeof Star> = {
  dasha_transition: Star,
  sign_change: ArrowRightLeft,
  retrograde: RotateCcw,
  eclipse: Moon,
};

const SECTION_ANIM = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

// ─── Component ─────────────────────────────────────────────────────
export default function AnnualForecastPage() {
  const locale = useLocale() as Locale;
  const t = LABELS[locale] || LABELS.en;
  const isDevanagari = locale !== 'en' && String(locale) !== 'ta';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  // ─── State ───
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<AnnualForecast | null>(null);
  const [formCollapsed, setFormCollapsed] = useState(false);
  const [overlayNatal, setOverlayNatal] = useState(false);
  const [showAllSahams, setShowAllSahams] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  const yearOptions = useMemo(() => {
    const opts: number[] = [];
    for (let y = currentYear - 2; y <= currentYear + 2; y++) opts.push(y);
    return opts;
  }, [currentYear]);

  // Set current month as default expanded when forecast loads
  const currentMonth = new Date().getMonth() + 1;

  // ─── Generate Forecast ───
  const handleGenerate = useCallback(async (birthData: BirthData) => {
    setLoading(true);
    setError(null);

    try {
      // Parallel fetch: natal kundali + varshaphal
      const [natalRes, varshaphalRes] = await Promise.all([
        authedFetch('/api/kundali', {
          method: 'POST',
          body: JSON.stringify(birthData),
        }),
        authedFetch('/api/varshaphal', {
          method: 'POST',
          body: JSON.stringify({ birthData, year }),
        }),
      ]);

      const natalData: KundaliData = await natalRes.json();
      const varshaphalData: VarshaphalData = await varshaphalRes.json();

      if ((natalData as unknown as { error?: string }).error) {
        throw new Error((natalData as unknown as { error: string }).error);
      }
      if ((varshaphalData as unknown as { error?: string }).error) {
        throw new Error((varshaphalData as unknown as { error: string }).error);
      }

      const result = generateAnnualForecast(natalData, varshaphalData, year);
      setForecast(result);
      setFormCollapsed(true);
      setExpandedMonth(currentMonth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate forecast');
    } finally {
      setLoading(false);
    }
  }, [year, currentMonth]);

  // ─── Render ───
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ─── Header ─── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t.title}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto" style={bodyFont}>{t.desc}</p>
      </motion.div>

      {/* ─── Input Section ─── */}
      <AnimatePresence mode="wait">
        {!formCollapsed ? (
          <motion.div
            key="form-open"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 sm:p-6 mb-8">
              {/* Year selector */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <label className="text-text-secondary text-sm uppercase tracking-wider" style={bodyFont}>{t.selectYear}</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-4 py-2 text-gold-light text-lg font-bold focus:border-gold-primary/50 focus:outline-none appearance-none cursor-pointer"
                  style={headingFont}
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y} className="bg-bg-primary text-text-primary">{y}</option>
                  ))}
                </select>
              </div>

              {/* BirthForm */}
              <BirthForm
                onSubmit={handleGenerate}
                loading={loading}
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-center mt-4 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form-collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mb-8"
          >
            <button
              onClick={() => setFormCollapsed(false)}
              className="px-6 py-2 bg-bg-secondary/60 border border-gold-primary/15 rounded-xl text-text-secondary text-sm hover:text-gold-light hover:border-gold-primary/30 transition-colors flex items-center gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              {t.collapseForm}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Forecast Sections ─── */}
      <AnimatePresence>
        {forecast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 md:space-y-8"
          >
            {/* ━━━ Section 1: Year Overview ━━━ */}
            <SectionCard delay={0}>
              <YearOverviewSection forecast={forecast} locale={locale} t={t} headingFont={headingFont} bodyFont={bodyFont} />
            </SectionCard>

            {/* ━━━ Section 2: Solar Return Chart ━━━ */}
            <SectionCard delay={0.08}>
              <SolarReturnSection
                forecast={forecast}
                locale={locale}
                t={t}
                headingFont={headingFont}
                bodyFont={bodyFont}
                overlayNatal={overlayNatal}
                setOverlayNatal={setOverlayNatal}
                showAllSahams={showAllSahams}
                setShowAllSahams={setShowAllSahams}
              />
            </SectionCard>

            {/* ━━━ Section 3: Monthly Timeline ━━━ */}
            <SectionCard delay={0.16}>
              <SectionHeader icon={Calendar} title={t.monthlyTimeline} headingFont={headingFont} />
              <MonthlyTimelineGrid
                months={forecast.monthlyTransits}
                currentMonth={currentMonth}
                expandedMonth={expandedMonth}
                setExpandedMonth={setExpandedMonth}
                locale={locale}
                t={t}
                bodyFont={bodyFont}
              />
            </SectionCard>

            {/* ━━━ Section 4: Transit Summary ━━━ */}
            <SectionCard delay={0.24}>
              <TransitSummarySection forecast={forecast} locale={locale} t={t} headingFont={headingFont} bodyFont={bodyFont} />
            </SectionCard>

            {/* ━━━ Section 5: Dasha Narrative ━━━ */}
            <SectionCard delay={0.32}>
              <DashaNarrativeSection forecast={forecast} locale={locale} t={t} headingFont={headingFont} bodyFont={bodyFont} />
            </SectionCard>

            {/* ━━━ Section 6: Key Dates ━━━ */}
            <SectionCard delay={0.4}>
              <KeyDatesSection forecast={forecast} locale={locale} t={t} headingFont={headingFont} bodyFont={bodyFont} />
            </SectionCard>

            {/* ━━━ Section 7: Remedies ━━━ */}
            <SectionCard delay={0.48}>
              <RemediesSection forecast={forecast} locale={locale} t={t} headingFont={headingFont} bodyFont={bodyFont} />
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Reusable Wrappers ─────────────────────────────────────────────

function SectionCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      {...SECTION_ANIM}
      transition={{ ...SECTION_ANIM.transition, delay }}
      className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 sm:p-6"
    >
      {children}
    </motion.section>
  );
}

function SectionHeader({ icon: Icon, title, headingFont }: { icon: typeof Star; title: string; headingFont: React.CSSProperties }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-gold-primary" />
      </div>
      <h2 className="text-gold-light text-xl font-bold" style={headingFont}>{title}</h2>
    </div>
  );
}

// Score dots (1-5)
function ScoreDots({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            i < score ? 'bg-gold-primary shadow-sm shadow-gold-primary/40' : 'bg-gold-primary/15 border border-gold-primary/20'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Section 1: Year Overview ──────────────────────────────────────

function YearOverviewSection({ forecast, locale, t, headingFont, bodyFont }: {
  forecast: AnnualForecast; locale: Locale; t: typeof LABELS.en; headingFont: React.CSSProperties; bodyFont: React.CSSProperties;
}) {
  const { yearRating, varshaphal, dashaNarrative } = forecast;
  const vp = varshaphal;

  return (
    <>
      <SectionHeader icon={Sparkles} title={t.yearOverview} headingFont={headingFont} />

      {/* Year + Overall Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Year + Name */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-4">
          <p className="text-6xl font-black text-gold-light" style={headingFont}>{forecast.year}</p>
          <p className="text-text-secondary text-sm mt-2" style={bodyFont}>
            {vp.varsheshvara?.planetName?.[locale] || vp.varsheshvara?.planetName?.en} {t.guidesThisYear}
          </p>
        </div>

        {/* Overall Score */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-4 border-y md:border-y-0 md:border-x border-gold-primary/10">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">{t.overallScore}</p>
          <p className="text-5xl font-black text-gold-light" style={headingFont}>
            {yearRating.overall.toFixed(1)}
          </p>
          <p className="text-text-secondary text-sm mt-1">/ 5.0</p>
        </div>

        {/* Varsheshvara + Muntha */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-4 space-y-3">
          <div className="flex items-center gap-3">
            <GrahaIconById id={vp.varsheshvara?.planetId ?? 0} size={32} />
            <div>
              <p className="text-gold-light font-bold text-sm" style={bodyFont}>{vp.varsheshvara?.planetName?.[locale] || '—'}</p>
              <p className="text-text-secondary text-xs">{t.guidesThisYear}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-text-secondary text-xs uppercase tracking-wider">{t.munthaIn}</p>
            <p className="text-gold-light text-sm font-medium" style={bodyFont}>
              {vp.muntha?.signName?.[locale] || '—'} — {t.house} {vp.muntha?.house || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Rating Factors */}
      <div className="space-y-3">
        <p className="text-gold-primary text-xs uppercase tracking-wider font-bold">{t.yearRating}</p>
        {yearRating.factors.map((factor: YearRatingFactor, i: number) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-gold-primary/5 last:border-0">
            <ScoreDots score={factor.score} />
            <div className="flex-1 min-w-0">
              <p className="text-gold-light text-sm font-medium" style={bodyFont}>{factor.name[locale]}</p>
              <p className="text-text-secondary text-xs truncate" style={bodyFont}>{factor.description[locale]}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Current Dasha + Year Summary */}
      <div className="mt-6 pt-5 border-t border-gold-primary/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{t.currentDasha}</p>
          <p className="text-gold-light text-sm font-medium" style={bodyFont}>
            {dashaNarrative.currentMaha.planetName[locale]}
            {dashaNarrative.currentAntar && ` / ${dashaNarrative.currentAntar.planetName[locale]}`}
          </p>
          <p className="text-text-secondary text-xs mt-0.5">
            {new Date(dashaNarrative.currentMaha.startDate).toLocaleDateString()} — {new Date(dashaNarrative.currentMaha.endDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{t.yearSummary}</p>
          <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>
            {vp.yearSummary?.[locale] || vp.yearSummary?.en || '—'}
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Section 2: Solar Return Chart ─────────────────────────────────

function SolarReturnSection({ forecast, locale, t, headingFont, bodyFont, overlayNatal, setOverlayNatal, showAllSahams, setShowAllSahams }: {
  forecast: AnnualForecast; locale: Locale; t: typeof LABELS.en; headingFont: React.CSSProperties; bodyFont: React.CSSProperties;
  overlayNatal: boolean; setOverlayNatal: (v: boolean) => void;
  showAllSahams: boolean; setShowAllSahams: (v: boolean) => void;
}) {
  const vp = forecast.varshaphal;
  const sahamsToShow = showAllSahams ? vp.sahams : vp.sahams.slice(0, 5);

  return (
    <>
      <SectionHeader icon={TrendingUp} title={t.solarReturnChart} headingFont={headingFont} />

      {/* Chart + Toggle */}
      <div className="flex flex-col items-center mb-6">
        <label className="flex items-center gap-2 mb-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={overlayNatal}
            onChange={(e) => setOverlayNatal(e.target.checked)}
            className="accent-gold-primary w-4 h-4"
          />
          <span className="text-text-secondary text-sm" style={bodyFont}>{t.overlayNatal}</span>
        </label>
        <ChartNorth
          data={vp.chart.chart}
          title={`${t.solarReturnChart} ${forecast.year}`}
          size={440}
          transitData={overlayNatal ? forecast.natal.chart : undefined}
        />
      </div>

      {/* Tajika Yogas */}
      {vp.tajikaYogas.length > 0 && (
        <div className="mb-6">
          <p className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-3">{t.tajikaYogas}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vp.tajikaYogas.map((yoga, i) => (
              <div
                key={i}
                className="rounded-xl border p-3 bg-bg-secondary/30"
                style={{ borderColor: yoga.favorable ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-gold-light text-sm font-bold" style={bodyFont}>{yoga.name[locale]}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${yoga.favorable ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' : 'text-red-400 bg-red-500/15 border-red-500/30'}`}>
                    {yoga.favorable ? t.favorable : t.unfavorable}
                  </span>
                </div>
                <p className="text-text-secondary text-xs" style={bodyFont}>
                  {yoga.planet1[locale]} — {yoga.planet2[locale]}
                </p>
                <p className="text-text-secondary text-xs mt-1 leading-relaxed" style={bodyFont}>
                  {yoga.description[locale]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sahams */}
      {vp.sahams.length > 0 && (
        <div>
          <p className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-3">{t.sahams}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-secondary border-b border-gold-primary/10">
                  <th className="text-left py-2 px-2" style={bodyFont}>Name</th>
                  <th className="text-left py-2 px-2">Degree</th>
                  <th className="text-left py-2 px-2" style={bodyFont}>{t.sign}</th>
                  <th className="text-left py-2 px-2">{t.house}</th>
                </tr>
              </thead>
              <tbody>
                {sahamsToShow.map((s, i) => (
                  <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                    <td className="py-2 px-2 text-gold-light font-medium" style={bodyFont}>{s.name[locale]}</td>
                    <td className="py-2 px-2 text-text-secondary font-mono text-xs">{s.degree.toFixed(2)}&deg;</td>
                    <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{s.signName[locale]}</td>
                    <td className="py-2 px-2 text-text-secondary">{s.house}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {vp.sahams.length > 5 && !showAllSahams && (
            <button
              onClick={() => setShowAllSahams(true)}
              className="mt-3 text-gold-primary text-xs hover:text-gold-light transition-colors"
            >
              {t.showAllSahams} ({vp.sahams.length})
            </button>
          )}
        </div>
      )}
    </>
  );
}

// ─── Section 3: Monthly Timeline ───────────────────────────────────

function MonthlyTimelineGrid({ months, currentMonth, expandedMonth, setExpandedMonth, locale, t, bodyFont }: {
  months: MonthlyTransitSnapshot[]; currentMonth: number; expandedMonth: number | null;
  setExpandedMonth: (m: number | null) => void; locale: Locale; t: typeof LABELS.en; bodyFont: React.CSSProperties;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {months.map((m) => {
        const isCurrent = m.month === currentMonth;
        const isExpanded = expandedMonth === m.month;
        const outlookClass = OUTLOOK_COLORS[m.outlook] || OUTLOOK_COLORS.mixed;
        const outlookLabel = OUTLOOK_LABELS[m.outlook]?.[locale] || m.outlook;

        return (
          <motion.div
            key={m.month}
            layout
            className={`rounded-xl border p-3 cursor-pointer transition-colors ${
              isCurrent ? 'border-gold-primary/40 bg-gold-primary/5' : 'border-gold-primary/8 bg-bg-secondary/20 hover:bg-bg-secondary/40'
            } ${isExpanded ? 'col-span-2 md:col-span-3 lg:col-span-4' : ''}`}
            onClick={() => setExpandedMonth(isExpanded ? null : m.month)}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gold-light text-sm font-bold">{m.monthName}</p>
              <div className="flex items-center gap-2">
                {isCurrent && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-primary/20 text-gold-primary border border-gold-primary/30 font-bold">
                    {t.current}
                  </span>
                )}
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-text-secondary" /> : <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${outlookClass}`}>
                {outlookLabel}
              </span>
              <span className="text-text-secondary text-[10px]">{t.avgSav}: {m.avgSav}</span>
            </div>

            {/* Expanded content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-gold-primary/10 overflow-hidden"
                >
                  {/* Planet positions */}
                  <div className="space-y-2 mb-3">
                    {m.planets.map((p: MonthlyPlanetTransit) => (
                      <div key={p.planetId} className="flex items-center gap-3">
                        <GrahaIconById id={p.planetId} size={20} />
                        <span className="text-gold-light text-xs font-medium w-16" style={bodyFont}>
                          {p.planetName[locale]}
                        </span>
                        <span className="text-text-secondary text-xs" style={bodyFont}>{p.signName[locale]}</span>
                        <span className="text-text-secondary text-xs">H{p.house}</span>
                        <span className="text-text-secondary text-[10px]">SAV {p.savBindu}</span>
                        {p.isRetrograde && (
                          <span className="text-amber-400 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                            {t.retrograde}
                          </span>
                        )}
                        {p.signChanged && (
                          <span className="text-blue-400 text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                            {t.signChange}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Events */}
                  {m.significantEvents.length > 0 && (
                    <div>
                      <p className="text-text-secondary text-[10px] uppercase tracking-wider mb-1">{t.events}</p>
                      <ul className="space-y-1">
                        {m.significantEvents.map((evt, i) => (
                          <li key={i} className="text-text-primary text-xs flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-gold-primary" />
                            {evt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Section 4: Transit Summary ────────────────────────────────────

function TransitSummarySection({ forecast, locale, t, headingFont, bodyFont }: {
  forecast: AnnualForecast; locale: Locale; t: typeof LABELS.en; headingFont: React.CSSProperties; bodyFont: React.CSSProperties;
}) {
  // Derive year-long positions from first month snapshot (slow planets barely move)
  const firstMonth = forecast.monthlyTransits[0];
  const lastMonth = forecast.monthlyTransits[11];
  if (!firstMonth || !lastMonth) return null;

  const slowPlanets = firstMonth.planets;

  return (
    <>
      <SectionHeader icon={TrendingUp} title={t.transitSummary} headingFont={headingFont} />
      <div className="space-y-3">
        {slowPlanets.map((p: MonthlyPlanetTransit) => {
          const endP = lastMonth.planets.find((lp: MonthlyPlanetTransit) => lp.planetId === p.planetId);
          const signChanged = endP && endP.sign !== p.sign;

          return (
            <div key={p.planetId} className="flex items-center gap-4 py-3 border-b border-gold-primary/5 last:border-0">
              <GrahaIconById id={p.planetId} size={28} />
              <div className="flex-1 min-w-0">
                <p className="text-gold-light text-sm font-bold" style={bodyFont}>{p.planetName[locale]}</p>
                <p className="text-text-secondary text-xs" style={bodyFont}>
                  {p.signName[locale]} — {t.house} {p.house} — {t.bindus}: {p.savBindu}
                </p>
              </div>
              {p.isRetrograde && (
                <span className="text-amber-400 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 shrink-0">
                  {t.retrograde}
                </span>
              )}
              {signChanged && endP && (
                <span className="text-blue-400 text-xs shrink-0" style={bodyFont}>
                  {t.changesOn}: {endP.signName[locale]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Section 5: Dasha Narrative ────────────────────────────────────

function DashaNarrativeSection({ forecast, locale, t, headingFont, bodyFont }: {
  forecast: AnnualForecast; locale: Locale; t: typeof LABELS.en; headingFont: React.CSSProperties; bodyFont: React.CSSProperties;
}) {
  const { dashaNarrative } = forecast;

  return (
    <>
      <SectionHeader icon={Star} title={t.dashaNarrative} headingFont={headingFont} />

      {/* Maha Dasha Change Alert */}
      {dashaNarrative.mahaChangesThisYear && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 rounded-xl border-2 border-amber-500/40 bg-amber-500/10 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <p className="text-amber-300 font-bold text-sm" style={headingFont}>{t.mahaChanging}</p>
          </div>
          <p className="text-text-secondary text-sm" style={bodyFont}>
            {locale === 'hi' ? t.mahaChangingDescHi : t.mahaChangingDesc}
          </p>
        </motion.div>
      )}

      {/* Current Maha */}
      <DashaPeriodCard entry={dashaNarrative.currentMaha} label={t.mahaDasha} locale={locale} t={t} bodyFont={bodyFont} headingFont={headingFont} />

      {/* Current Antar */}
      {dashaNarrative.currentAntar && (
        <div className="mt-4">
          <DashaPeriodCard entry={dashaNarrative.currentAntar} label={t.antarDasha} locale={locale} t={t} bodyFont={bodyFont} headingFont={headingFont} />
        </div>
      )}

      {/* Upcoming Transitions */}
      {dashaNarrative.upcomingTransitions.length > 0 && (
        <div className="mt-5">
          <p className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-3">{t.upcomingTransitions}</p>
          <div className="space-y-2">
            {dashaNarrative.upcomingTransitions.map((tr: DashaNarrativeEntry, i: number) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gold-primary/5 last:border-0">
                <GrahaIconById id={tr.planetId} size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-gold-light text-sm font-medium" style={bodyFont}>
                    {tr.planetName[locale]} {tr.level === 'maha' ? t.mahaDasha : t.antarDasha}
                  </p>
                  <p className="text-text-secondary text-xs">
                    {new Date(tr.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function DashaPeriodCard({ entry, label, locale, t, bodyFont, headingFont }: {
  entry: DashaNarrativeEntry; label: string; locale: Locale; t: typeof LABELS.en;
  bodyFont: React.CSSProperties; headingFont: React.CSSProperties;
}) {
  const dignityLabel = DIGNITY_LABELS[entry.dignity]?.[locale] || entry.dignity;

  return (
    <div className="rounded-xl border border-gold-primary/10 bg-bg-secondary/20 p-4">
      <div className="flex items-center gap-3 mb-3">
        <GrahaIconById id={entry.planetId} size={28} />
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wider">{label}</p>
          <p className="text-gold-light font-bold" style={headingFont}>{entry.planetName[locale]}</p>
        </div>
        <div className="ml-auto text-right">
          <span className="text-text-secondary text-[10px] uppercase tracking-wider">{t.dignity}</span>
          <p className="text-gold-primary text-xs font-medium">{dignityLabel}</p>
        </div>
      </div>
      <div className="mb-2">
        <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{t.house} {entry.house}</p>
        <p className="text-text-secondary text-xs">
          {new Date(entry.startDate).toLocaleDateString()} — {new Date(entry.endDate).toLocaleDateString()}
        </p>
      </div>
      <div>
        <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{t.themes}</p>
        <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>{entry.themes[locale]}</p>
      </div>
    </div>
  );
}

// ─── Section 6: Key Dates ──────────────────────────────────────────

function KeyDatesSection({ forecast, locale, t, headingFont, bodyFont }: {
  forecast: AnnualForecast; locale: Locale; t: typeof LABELS.en; headingFont: React.CSSProperties; bodyFont: React.CSSProperties;
}) {
  const quarters: Record<number, KeyDate[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const d of forecast.keyDates) {
    if (quarters[d.quarter]) quarters[d.quarter].push(d);
  }

  const quarterLabels = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];

  return (
    <>
      <SectionHeader icon={Calendar} title={t.keyDates} headingFont={headingFont} />

      {forecast.keyDates.length === 0 ? (
        <p className="text-text-secondary text-sm text-center py-4" style={bodyFont}>
          {locale === 'hi' ? 'इस वर्ष कोई प्रमुख तिथि नहीं मिली।' : 'No significant key dates found for this year.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([1, 2, 3, 4] as const).map((q) => (
            <div key={q} className="rounded-xl border border-gold-primary/8 bg-bg-secondary/15 p-3">
              <p className="text-gold-primary text-xs font-bold uppercase tracking-wider mb-3">{quarterLabels[q - 1]}</p>
              {quarters[q].length === 0 ? (
                <p className="text-text-secondary text-xs italic">—</p>
              ) : (
                <div className="space-y-2">
                  {quarters[q].map((d, i) => {
                    const IconComp = KEY_DATE_ICONS[d.type] || Star;
                    return (
                      <div key={i} className="flex items-start gap-2.5">
                        <IconComp className="w-4 h-4 text-gold-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-text-secondary text-[10px] font-mono">{d.date}</p>
                          <p className="text-text-primary text-xs" style={bodyFont}>{d.description[locale]}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Section 7: Remedies ───────────────────────────────────────────

function RemediesSection({ forecast, locale, t, headingFont, bodyFont }: {
  forecast: AnnualForecast; locale: Locale; t: typeof LABELS.en; headingFont: React.CSSProperties; bodyFont: React.CSSProperties;
}) {
  const typeLabels: Record<string, Record<string, string>> = {
    gemstone: { en: 'Gemstone', hi: 'रत्न' },
    mantra: { en: 'Mantra', hi: 'मंत्र' },
    practice: { en: 'Practice', hi: 'अभ्यास' },
  };

  const typeColors: Record<string, string> = {
    gemstone: 'border-purple-500/25 bg-purple-500/10',
    mantra: 'border-amber-500/25 bg-amber-500/10',
    practice: 'border-emerald-500/25 bg-emerald-500/10',
  };

  return (
    <>
      <SectionHeader icon={Shield} title={t.remedies} headingFont={headingFont} />

      {forecast.remedies.length === 0 ? (
        <p className="text-text-secondary text-sm text-center py-4" style={bodyFont}>
          {locale === 'hi' ? 'कोई विशेष उपाय आवश्यक नहीं।' : 'No specific remedies indicated.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {forecast.remedies.map((remedy: RemedyRecommendation, i: number) => {
            const typeLabel = typeLabels[remedy.type]?.[locale] || remedy.type;
            const colorClass = typeColors[remedy.type] || 'border-gold-primary/15 bg-bg-secondary/20';

            return (
              <div key={i} className={`rounded-xl border p-4 ${colorClass}`}>
                <div className="flex items-center gap-3 mb-3">
                  <GrahaIconById id={remedy.planetId} size={28} />
                  <div>
                    <p className="text-gold-light text-sm font-bold" style={bodyFont}>{remedy.planetName[locale]}</p>
                    <span className="text-text-secondary text-[10px] uppercase tracking-wider">{typeLabel}</span>
                  </div>
                </div>
                <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>
                  {remedy.recommendation[locale]}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
