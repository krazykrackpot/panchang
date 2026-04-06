'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, HelpCircle, ArrowRight, CheckCircle, AlertTriangle,
  XCircle, TrendingUp, Shield, Sparkles,
} from 'lucide-react';
import ChartNorth from '@/components/kundali/ChartNorth';
import ChartSouth from '@/components/kundali/ChartSouth';
import GoldDivider from '@/components/ui/GoldDivider';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { useLocationStore } from '@/stores/location-store';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { analyzePrashna, PRASHNA_CATEGORIES } from '@/lib/prashna/horary-analysis';
import type { PrashnaCategory, PrashnaAnalysis, PrashnaInsight } from '@/lib/prashna/horary-analysis';
import type { Locale } from '@/types/panchang';
import type { KundaliData, ChartStyle } from '@/types/kundali';

// ── Trilingual labels ──
const L = {
  title: { en: 'Prashna Kundali', hi: 'प्रश्न कुण्डली', sa: 'प्रश्नकुण्डली' },
  subtitle: {
    en: 'Vedic Horary Astrology — answers from the stars at this very moment',
    hi: 'वैदिक होरारी ज्योतिष — इस क्षण सितारों से उत्तर',
    sa: 'वैदिकहोराज्योतिषम् — अस्मिन् क्षणे नक्षत्रेभ्यः उत्तरम्',
  },
  whatIs: { en: 'What is Prashna?', hi: 'प्रश्न कुण्डली क्या है?', sa: 'प्रश्नकुण्डली किम्?' },
  whatIsDesc: {
    en: 'Prashna (Horary) is the ancient Vedic art of answering questions through a chart cast for the exact moment the question arises in your mind. Unlike natal astrology, it requires no birth data — only the sincerity of your question and the current cosmic alignment.',
    hi: 'प्रश्न कुण्डली प्राचीन वैदिक विधा है जो प्रश्न के मन में उत्पन्न होने के ठीक क्षण की कुण्डली से उत्तर देती है। जन्म कुण्डली के विपरीत, इसमें जन्म विवरण की आवश्यकता नहीं — केवल आपके प्रश्न की निष्ठा और वर्तमान ग्रह स्थिति।',
    sa: 'प्रश्नकुण्डली प्राचीना वैदिकविद्या यया प्रश्नोत्पत्तिक्षणस्य कुण्डल्या उत्तरं दीयते। जन्मकुण्डलीतो भिन्ना — केवलं प्रश्ननिष्ठा वर्तमानग्रहस्थितिश्च आवश्यके।',
  },
  howTo: { en: 'How It Works', hi: 'यह कैसे काम करता है', sa: 'कथं कार्यं करोति' },
  step1: { en: 'Focus on your question with sincerity', hi: 'अपने प्रश्न पर निष्ठापूर्वक ध्यान केन्द्रित करें', sa: 'स्वप्रश्ने निष्ठापूर्वकं ध्यानं कुर्यात्' },
  step2: { en: 'Select a category that matches your query', hi: 'अपने प्रश्न से मेल खाती श्रेणी चुनें', sa: 'प्रश्नानुरूपं वर्गं चिनुयात्' },
  step3: { en: 'Cast the chart — receive your answer', hi: 'कुण्डली बनाएं — उत्तर प्राप्त करें', sa: 'कुण्डलीं रचयेत् — उत्तरं लभेत' },
  bestTime: { en: 'Best Times to Ask', hi: 'प्रश्न पूछने का सर्वोत्तम समय', sa: 'प्रश्नार्थम् उत्तमसमयः' },
  bestTimeDesc: {
    en: 'Ask during Brahma Muhurta (before sunrise), Abhijit Muhurta (midday), or when the urge first arises naturally.',
    hi: 'ब्रह्म मुहूर्त (सूर्योदय से पहले), अभिजित मुहूर्त (दोपहर), या जब स्वाभाविक इच्छा उत्पन्न हो तब पूछें।',
    sa: 'ब्रह्ममुहूर्ते अभिजिन्मुहूर्ते वा स्वाभाविकेच्छोत्पत्तौ पृच्छेत्।',
  },
  question: { en: 'Your Question', hi: 'आपका प्रश्न', sa: 'भवतः प्रश्नः' },
  questionPlaceholder: {
    en: 'What question is on your mind? (e.g., "Will I get the promotion?")',
    hi: 'आपके मन में क्या प्रश्न है? (जैसे, "क्या मुझे पदोन्नति मिलेगी?")',
    sa: 'भवतः मनसि कः प्रश्नः?',
  },
  selectCategory: { en: 'Select Category', hi: 'श्रेणी चुनें', sa: 'वर्गं चिनुयात्' },
  castBtn: { en: 'Cast Prashna Chart', hi: 'प्रश्न कुण्डली बनाएं', sa: 'प्रश्नकुण्डलीं रचयेत्' },
  casting: { en: 'Casting Chart...', hi: 'कुण्डली बन रही है...', sa: 'कुण्डली रच्यते...' },
  castAt: { en: 'Chart cast at', hi: 'कुण्डली बनाई गई', sa: 'कुण्डली रचिता' },
  verdict: { en: 'Verdict', hi: 'निर्णय', sa: 'निर्णयः' },
  keyIndicators: { en: 'Key Indicators', hi: 'प्रमुख सूचक', sa: 'प्रमुखसूचकाः' },
  chart: { en: 'Prashna Chart', hi: 'प्रश्न कुण्डली', sa: 'प्रश्नकुण्डली' },
  north: { en: 'North Indian', hi: 'उत्तर भारतीय', sa: 'उत्तरभारतीयम्' },
  south: { en: 'South Indian', hi: 'दक्षिण भारतीय', sa: 'दक्षिणभारतीयम्' },
  factors: { en: 'Detailed Analysis', hi: 'विस्तृत विश्लेषण', sa: 'विस्तृतविश्लेषणम्' },
  planets: { en: 'Planetary Positions & Roles', hi: 'ग्रह स्थिति एवं भूमिका', sa: 'ग्रहस्थितयः भूमिकाश्च' },
  timing: { en: 'Timing & Dasha', hi: 'समय एवं दशा', sa: 'समयः दशा च' },
  guidance: { en: 'Guidance', hi: 'मार्गदर्शन', sa: 'मार्गदर्शनम्' },
  remedies: { en: 'Remedies', hi: 'उपाय', sa: 'उपायाः' },
  vf: { en: 'Very Favorable', hi: 'अत्यन्त शुभ', sa: 'अतिशुभम्' },
  fav: { en: 'Favorable', hi: 'शुभ', sa: 'शुभम्' },
  mix: { en: 'Mixed Outlook', hi: 'मिश्रित', sa: 'मिश्रम्' },
  chal: { en: 'Challenging', hi: 'चुनौतीपूर्ण', sa: 'आव्हानात्मकम्' },
  diff: { en: 'Difficult', hi: 'कठिन', sa: 'कठिनम्' },
  newChart: { en: 'Ask Another Question', hi: 'दूसरा प्रश्न पूछें', sa: 'अन्यं प्रश्नं पृच्छेत्' },
};

const VERDICT_CONFIG = {
  very_favorable: { label: L.vf, color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/40 text-emerald-300', icon: CheckCircle, iconColor: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  favorable: { label: L.fav, color: 'from-green-500/15 to-green-600/5 border-green-500/30 text-green-300', icon: TrendingUp, iconColor: 'text-green-400', bg: 'bg-green-500/10' },
  mixed: { label: L.mix, color: 'from-amber-500/15 to-amber-600/5 border-amber-500/30 text-amber-300', icon: AlertTriangle, iconColor: 'text-amber-400', bg: 'bg-amber-500/10' },
  challenging: { label: L.chal, color: 'from-orange-500/15 to-orange-600/5 border-orange-500/30 text-orange-300', icon: AlertTriangle, iconColor: 'text-orange-400', bg: 'bg-orange-500/10' },
  difficult: { label: L.diff, color: 'from-red-500/15 to-red-600/5 border-red-500/30 text-red-300', icon: XCircle, iconColor: 'text-red-400', bg: 'bg-red-500/10' },
};

const CATEGORY_ICONS: Record<PrashnaCategory, string> = {
  general: 'HelpCircle', career: 'Briefcase', marriage: 'Heart',
  health: 'Activity', finance: 'Wallet', travel: 'Compass',
  education: 'BookOpen', legal: 'Scale',
};

export default function PrashnaPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const locationStore = useLocationStore();

  useEffect(() => { locationStore.detect(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<PrashnaCategory>('general');
  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [analysis, setAnalysis] = useState<PrashnaAnalysis | null>(null);
  const [chartStyle, setChartStyle] = useState<ChartStyle>('north');
  const [loading, setLoading] = useState(false);
  const [castTime, setCastTime] = useState('');

  const castPrashna = useCallback(async () => {
    if (locationStore.lat === null || locationStore.lng === null) return;
    setLoading(true);
    const now = new Date();
    setCastTime(now.toLocaleString(locale === 'en' ? 'en-IN' : 'hi-IN'));
    const ianaTimezone = locationStore.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tz = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), ianaTimezone);

    try {
      const res = await fetch('/api/kundali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: locale === 'en' ? 'Prashna Chart' : 'प्रश्न कुण्डली',
          date: now.toISOString().split('T')[0],
          time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
          place: locationStore.name || 'Current Location',
          lat: locationStore.lat,
          lng: locationStore.lng,
          timezone: String(tz),
          ianaTimezone,
          ayanamsha: 'lahiri' as const,
        }),
      });
      const data = await res.json();
      setKundali(data);
      setAnalysis(analyzePrashna(data, category));
    } catch (e) {
      console.error('Prashna generation failed:', e);
    }
    setLoading(false);
  }, [locale, category, locationStore.lat, locationStore.lng, locationStore.name]);

  const reset = () => {
    setKundali(null);
    setAnalysis(null);
    setQuestion('');
    setCastTime('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={hf}>
          <span className="text-gold-gradient">{L.title[locale]}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bf}>{L.subtitle[locale]}</p>
      </motion.div>

      {/* ── Pre-cast: Introduction + Input ── */}
      {!analysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          {/* What is Prashna */}
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-bold text-gold-light mb-4" style={hf}>{L.whatIs[locale]}</h2>
            <p className="text-text-primary/85 leading-relaxed mb-6" style={bf}>{L.whatIsDesc[locale]}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Steps */}
              {[
                { num: '1', label: L.step1[locale], icon: <HelpCircle className="w-5 h-5 text-gold-primary" /> },
                { num: '2', label: L.step2[locale], icon: <Clock className="w-5 h-5 text-gold-primary" /> },
                { num: '3', label: L.step3[locale], icon: <Sparkles className="w-5 h-5 text-gold-primary" /> },
              ].map(s => (
                <div key={s.num} className="rounded-xl bg-bg-tertiary/30 p-4 flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 flex items-center justify-center text-gold-primary font-bold text-sm">
                    {s.num}
                  </div>
                  <p className="text-sm text-text-primary/80 flex-1" style={bf}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-gold-primary/5 border border-gold-primary/10 p-4">
              <p className="text-xs text-gold-dark" style={bf}>
                <span className="font-bold text-gold-primary">{L.bestTime[locale]}:</span>{' '}
                {L.bestTimeDesc[locale]}
              </p>
            </div>
          </div>

          <GoldDivider />

          {/* Question Input */}
          <div className="my-8">
            <label className="block text-gold-light text-sm font-bold mb-3 uppercase tracking-wider" style={hf}>
              {L.question[locale]}
            </label>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder={L.questionPlaceholder[locale]}
              rows={3}
              className="w-full rounded-xl bg-bg-tertiary/50 border border-gold-primary/15 px-5 py-4 text-text-primary placeholder-text-secondary/40 focus:border-gold-primary/40 focus:outline-none focus:ring-1 focus:ring-gold-primary/20 transition-all resize-none"
              style={bf}
            />
          </div>

          {/* Category Selector */}
          <div className="mb-8">
            <label className="block text-gold-light text-sm font-bold mb-3 uppercase tracking-wider" style={hf}>
              {L.selectCategory[locale]}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(PRASHNA_CATEGORIES) as PrashnaCategory[]).map(key => {
                const cat = PRASHNA_CATEGORIES[key];
                const isActive = category === key;
                return (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    className={`rounded-xl p-4 text-center border transition-all ${
                      isActive
                        ? 'bg-gold-primary/15 border-gold-primary/40 text-gold-light'
                        : 'bg-bg-tertiary/20 border-gold-primary/8 text-text-secondary hover:bg-gold-primary/8 hover:border-gold-primary/20'
                    }`}
                  >
                    <div className="text-sm font-bold" style={hf}>{cat.label[locale]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cast Button */}
          <div className="text-center">
            <motion.button
              onClick={castPrashna}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-5 bg-gradient-to-r from-gold-primary/25 to-gold-primary/10 border-2 border-gold-primary/40 rounded-2xl text-gold-light text-xl font-bold transition-all hover:bg-gold-primary/30 disabled:opacity-50"
              style={hf}
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-gold-primary border-t-transparent" />
                  {L.casting[locale]}
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  {L.castBtn[locale]} <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ── Results ── */}
      <AnimatePresence>
        {analysis && kundali && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Question recap */}
            {question && (
              <div className="text-center">
                <p className="text-text-secondary text-sm italic" style={bf}>
                  &ldquo;{question}&rdquo;
                </p>
                <p className="text-text-secondary/70 text-xs mt-1">{L.castAt[locale]}: {castTime}</p>
              </div>
            )}

            {/* ── Verdict Banner ── */}
            <VerdictBanner analysis={analysis} locale={locale} hf={hf} bf={bf} />

            {/* ── 3 Key Insight Cards ── */}
            <div>
              <h2 className="text-lg font-bold text-gold-light mb-4 uppercase tracking-wider" style={hf}>
                {L.keyIndicators[locale]}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <InsightCard insight={analysis.lagnaInsight} locale={locale} hf={hf} bf={bf} />
                <InsightCard insight={analysis.moonInsight} locale={locale} hf={hf} bf={bf} />
                <InsightCard insight={analysis.relevantHouseInsight} locale={locale} hf={hf} bf={bf} />
              </div>
            </div>

            <GoldDivider />

            {/* ── Chart ── */}
            <div>
              <h2 className="text-lg font-bold text-gold-light mb-4 uppercase tracking-wider text-center" style={hf}>
                {L.chart[locale]}
              </h2>
              <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setChartStyle('north')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${chartStyle === 'north' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:bg-gold-primary/10'}`}>
                  {L.north[locale]}
                </button>
                <button onClick={() => setChartStyle('south')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${chartStyle === 'south' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:bg-gold-primary/10'}`}>
                  {L.south[locale]}
                </button>
              </div>
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 inline-block">
                  <div className="flex items-center justify-center gap-2 mb-2 text-xs text-text-secondary">
                    <RashiIconById id={kundali.ascendant.sign} size={20} />
                    <span style={bf}>
                      {locale === 'en' ? 'Ascendant' : 'लग्न'}: {kundali.ascendant.signName[locale]} ({kundali.ascendant.degree.toFixed(1)}&deg;)
                    </span>
                  </div>
                  {chartStyle === 'north' ? (
                    <ChartNorth data={kundali.chart} title={L.chart[locale]} size={400} />
                  ) : (
                    <ChartSouth data={kundali.chart} title={L.chart[locale]} size={400} />
                  )}
                </div>
              </div>
            </div>

            <GoldDivider />

            {/* ── Key Factors ── */}
            {analysis.keyFactors.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gold-light mb-4 uppercase tracking-wider" style={hf}>
                  {L.factors[locale]}
                </h2>
                <div className="space-y-3">
                  {analysis.keyFactors.map((f, i) => (
                    <InsightCard key={i} insight={f} locale={locale} hf={hf} bf={bf} compact />
                  ))}
                </div>
              </div>
            )}

            {/* ── Planet Digest ── */}
            <div>
              <h2 className="text-lg font-bold text-gold-light mb-4 uppercase tracking-wider" style={hf}>
                {L.planets[locale]}
              </h2>
              <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gold-primary/10 bg-bg-tertiary/30">
                        <th className="text-left px-4 py-3 text-text-secondary font-bold text-xs uppercase">{locale === 'en' ? 'Planet' : 'ग्रह'}</th>
                        <th className="text-left px-4 py-3 text-text-secondary font-bold text-xs uppercase">{locale === 'en' ? 'Sign' : 'राशि'}</th>
                        <th className="text-center px-4 py-3 text-text-secondary font-bold text-xs uppercase">{locale === 'en' ? 'House' : 'भाव'}</th>
                        <th className="text-left px-4 py-3 text-text-secondary font-bold text-xs uppercase">{locale === 'en' ? 'Status' : 'स्थिति'}</th>
                        <th className="text-left px-4 py-3 text-text-secondary font-bold text-xs uppercase">{locale === 'en' ? 'Role' : 'भूमिका'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.planetDigest.map(p => (
                        <tr key={p.planetId} className="border-b border-gold-primary/5 hover:bg-gold-primary/3 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <GrahaIconById id={p.planetId} size={22} />
                              <span className="font-bold" style={{ color: p.planetColor, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}>
                                {p.planetName[locale]}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <RashiIconById id={p.sign} size={16} />
                              <span className="text-text-primary" style={bf}>{p.signName[locale]}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-gold-light font-mono font-bold">{p.house}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              {p.dignity && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                  p.dignity === 'Exalted' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' :
                                  p.dignity === 'Own Sign' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20' :
                                  p.dignity === 'Debilitated' ? 'bg-red-500/15 text-red-300 border border-red-500/20' :
                                  'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                                }`}>
                                  {p.dignity}
                                </span>
                              )}
                              {p.retrograde && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20 font-bold">Retro</span>}
                              <span className={`w-2 h-2 rounded-full ${
                                p.strength === 'strong' ? 'bg-emerald-400' : p.strength === 'moderate' ? 'bg-amber-400' : 'bg-red-400'
                              }`} title={p.strength} />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-text-secondary text-xs" style={bf}>
                            {p.role[locale]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <GoldDivider />

            {/* ── Timing ── */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-gold-primary" />
                <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={hf}>{L.timing[locale]}</h3>
              </div>
              <p className="text-text-primary/85 text-sm leading-relaxed" style={bf}>{analysis.timing[locale]}</p>
            </div>

            {/* ── Guidance ── */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 border border-gold-primary/15 bg-gradient-to-br from-gold-primary/5 to-transparent">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-gold-primary" />
                <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={hf}>{L.guidance[locale]}</h3>
              </div>
              <p className="text-text-primary/85 text-sm leading-relaxed" style={bf}>{analysis.guidance[locale]}</p>
            </div>

            {/* ── Remedies ── */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-gold-primary" />
                <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={hf}>{L.remedies[locale]}</h3>
              </div>
              <div className="space-y-3">
                {analysis.remedies.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-primary text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-text-primary/80 leading-relaxed flex-1" style={bf}>{r[locale]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── New Question ── */}
            <div className="text-center pt-4">
              <button
                onClick={reset}
                className="px-8 py-3 rounded-xl border border-gold-primary/20 text-gold-light text-sm font-bold hover:bg-gold-primary/10 transition-all"
                style={hf}
              >
                {L.newChart[locale]}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────

function VerdictBanner({ analysis, locale, hf, bf }: {
  analysis: PrashnaAnalysis; locale: Locale;
  hf: React.CSSProperties; bf: React.CSSProperties;
}) {
  const cfg = VERDICT_CONFIG[analysis.verdict.outcome];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-2xl border bg-gradient-to-b p-6 sm:p-8 ${cfg.color}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl ${cfg.bg} flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${cfg.iconColor}`} />
        </div>
        <div>
          <div className="text-xs text-text-secondary uppercase tracking-widest font-bold">{L.verdict[locale]}</div>
          <h2 className="text-2xl sm:text-3xl font-bold" style={hf}>
            {cfg.label[locale]}
          </h2>
        </div>
        <div className="ml-auto text-right">
          <div className="text-3xl font-bold font-mono">
            {analysis.verdict.score > 0 ? '+' : ''}{analysis.verdict.score}
          </div>
          <div className="text-xs text-text-secondary uppercase">{locale === 'en' ? 'Score' : 'अंक'}</div>
        </div>
      </div>
      <p className="text-sm leading-relaxed opacity-90" style={bf}>
        {analysis.verdict.summary[locale]}
      </p>
    </div>
  );
}

function InsightCard({ insight, locale, hf, bf, compact = false }: {
  insight: PrashnaInsight; locale: Locale;
  hf: React.CSSProperties; bf: React.CSSProperties;
  compact?: boolean;
}) {
  const borderColor = insight.nature === 'positive' ? 'border-emerald-500/20' : insight.nature === 'negative' ? 'border-red-500/20' : 'border-amber-500/20';
  const dotColor = insight.nature === 'positive' ? 'bg-emerald-400' : insight.nature === 'negative' ? 'bg-red-400' : 'bg-amber-400';
  const labelColor = insight.nature === 'positive' ? 'text-emerald-300' : insight.nature === 'negative' ? 'text-red-300' : 'text-amber-300';

  return (
    <div className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl border ${borderColor} ${compact ? 'p-4' : 'p-5'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor} flex-shrink-0`} />
        <h3 className={`text-xs font-bold uppercase tracking-wider ${labelColor}`} style={hf}>
          {insight.label[locale]}
        </h3>
        <span className="ml-auto text-xs font-mono text-text-secondary">
          {insight.score > 0 ? '+' : ''}{insight.score}
        </span>
      </div>
      <p className="text-text-primary/80 text-xs leading-relaxed" style={bf}>
        {insight.finding[locale]}
      </p>
    </div>
  );
}
