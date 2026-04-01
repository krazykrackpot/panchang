'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { Locale } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import {
  analyzeSadeSati,
  getCurrentSaturnSign,
  type SadeSatiAnalysis,
  type SadeSatiInput,
} from '@/lib/kundali/sade-sati-analysis';

// ---------------------------------------------------------------------------
// Trilingual labels
// ---------------------------------------------------------------------------

const L = (en: string, hi: string, sa?: string) => ({ en, hi, sa: sa ?? hi });

const LABELS = {
  title: L('Sade Sati', 'साढ़े साती', 'साढेसाती'),
  subtitle: L(
    "Saturn's 7.5-year transit over your Moon sign — the most transformative period in Vedic astrology",
    'शनि का आपकी चन्द्र राशि पर 7.5 वर्ष का गोचर — वैदिक ज्योतिष का सर्वाधिक परिवर्तनकारी काल',
    'शनेः चन्द्रराशौ सार्धसप्तवर्षीयं गोचरम् — वैदिकज्योतिषस्य परमपरिवर्तनकालः',
  ),
  saturnIn: L('Saturn is currently in', 'शनि वर्तमान में', 'शनिः सम्प्रति'),
  quickTab: L('Quick Check', 'त्वरित जाँच', 'शीघ्रपरीक्षा'),
  fullTab: L('Full Analysis', 'विस्तृत विश्लेषण', 'सम्पूर्णविश्लेषणम्'),
  selectMoon: L('Select Your Moon Sign', 'अपनी चन्द्र राशि चुनें', 'स्वचन्द्रराशिं चिनुत'),
  date: L('Date of Birth', 'जन्म तिथि', 'जन्मतिथिः'),
  time: L('Time of Birth', 'जन्म समय', 'जन्मसमयः'),
  place: L('Birth Place', 'जन्म स्थान', 'जन्मस्थानम्'),
  lat: L('Latitude', 'अक्षांश', 'अक्षांशः'),
  lng: L('Longitude', 'देशान्तर', 'देशान्तरः'),
  tz: L('Timezone (hrs)', 'समयक्षेत्र (घंटे)', 'समयक्षेत्रम्'),
  analyze: L('Analyze', 'विश्लेषण करें', 'विश्लेषयतु'),
  loading: L('Generating kundali...', 'कुण्डली बना रहे हैं...', 'कुण्डलीं रचयति...'),
  active: L('SADE SATI ACTIVE', 'साढ़े साती सक्रिय', 'साढेसाती सक्रिया'),
  notActive: L('NOT IN SADE SATI', 'साढ़े साती नहीं', 'साढेसाती नास्ति'),
  nextCycle: L('Next cycle begins around', 'अगला चक्र लगभग', 'अग्रिमचक्रं प्रायः'),
  intensity: L('Intensity', 'तीव्रता', 'तीव्रता'),
  timeline: L('Timeline', 'समयरेखा', 'समयरेखा'),
  remedies: L('Remedies', 'उपाय', 'उपायाः'),
  phase: {
    rising: L('Rising Phase (12th from Moon)', 'आरम्भ चरण (चन्द्र से 12वाँ)', 'उत्थानचरणः'),
    peak: L('Peak Phase (Over Moon Sign)', 'चरम चरण (चन्द्र राशि पर)', 'चरमचरणः'),
    setting: L('Setting Phase (2nd from Moon)', 'अवसान चरण (चन्द्र से 2रा)', 'अवसानचरणः'),
  },
  sections: {
    summary: L('Summary', 'सारांश', 'सारांशः'),
    phaseEffect: L('Phase Effect', 'चरण प्रभाव', 'चरणप्रभावः'),
    saturnNature: L("Saturn's Nature for Your Ascendant", 'आपके लग्न के लिए शनि का स्वभाव', 'लग्नार्थं शनिस्वभावः'),
    moonStrength: L('Moon Strength Analysis', 'चन्द्र बल विश्लेषण', 'चन्द्रबलविश्लेषणम्'),
    dashaInterplay: L('Dasha Interplay', 'दशा अन्तर्क्रिया', 'दशान्तर्क्रिया'),
    ashtakavargaInsight: L('Ashtakavarga Insight', 'अष्टकवर्ग विश्लेषण', 'अष्टकवर्गविश्लेषणम्'),
    nakshatraTransit: L('Nakshatra Transit Detail', 'नक्षत्र गोचर विवरण', 'नक्षत्रगोचरविवरणम्'),
    houseEffect: L('House Effects', 'भाव प्रभाव', 'भावप्रभावः'),
  },
  essential: L('Essential', 'अनिवार्य', 'अनिवार्यम्'),
  recommended: L('Recommended', 'अनुशंसित', 'अनुशंसितम्'),
  optional: L('Optional', 'वैकल्पिक', 'वैकल्पिकम्'),
  years: L('years', 'वर्ष', 'वर्षाणि'),
  current: L('CURRENT', 'वर्तमान', 'वर्तमानम्'),
  mild: L('Mild', 'सौम्य', 'सौम्यम्'),
  moderate: L('Moderate', 'मध्यम', 'मध्यमम्'),
  challenging: L('Challenging', 'चुनौतीपूर्ण', 'दुष्करम्'),
  intense: L('Intense', 'तीव्र', 'तीव्रम्'),
};

type Tri = { en: string; hi: string; sa?: string };
const t = (label: Tri, locale: Locale): string => {
  const k = locale === 'sa' ? 'hi' : locale;
  return (label as Record<string, string>)[k] ?? label.en;
};

// ---------------------------------------------------------------------------
// Generic remedies for quick mode
// ---------------------------------------------------------------------------

const GENERIC_REMEDIES: { title: Tri; description: Tri; priority: 'essential' | 'recommended' | 'optional' }[] = [
  { title: L('Hanuman Chalisa', 'हनुमान चालीसा'), description: L('Recite Hanuman Chalisa daily, especially on Saturdays', 'प्रतिदिन हनुमान चालीसा पढ़ें, विशेषकर शनिवार को'), priority: 'essential' },
  { title: L('Saturday Donations', 'शनिवार दान'), description: L('Donate black items — sesame, iron, mustard oil — on Saturdays', 'शनिवार को काली वस्तुएं — तिल, लोहा, सरसों का तेल — दान करें'), priority: 'essential' },
  { title: L('Peepal Tree Lamp', 'पीपल दीपक'), description: L('Light mustard oil lamp under a Peepal tree every Saturday evening', 'प्रत्येक शनिवार संध्या को पीपल वृक्ष के नीचे सरसों के तेल का दीपक जलाएं'), priority: 'recommended' },
  { title: L('Shani Mantra', 'शनि मंत्र'), description: L('Chant "Om Sham Shanaishcharaya Namah" 108 times daily', '"ॐ शं शनैश्चराय नमः" 108 बार प्रतिदिन जाप करें'), priority: 'recommended' },
];

// ---------------------------------------------------------------------------
// Intensity helpers
// ---------------------------------------------------------------------------

function intensityColor(score: number): string {
  if (score <= 3) return 'text-emerald-400';
  if (score <= 5) return 'text-gold-light';
  if (score <= 7) return 'text-orange-400';
  return 'text-red-400';
}

function intensityBg(score: number): string {
  if (score <= 3) return 'bg-emerald-400';
  if (score <= 5) return 'bg-gold-primary';
  if (score <= 7) return 'bg-orange-400';
  return 'bg-red-400';
}

function intensityLabel(score: number, locale: Locale): string {
  if (score <= 3) return t(LABELS.mild, locale);
  if (score <= 5) return t(LABELS.moderate, locale);
  if (score <= 7) return t(LABELS.challenging, locale);
  return t(LABELS.intense, locale);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SadeSatiPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;
  const lk = locale === 'sa' ? 'hi' : locale;

  const [tab, setTab] = useState<'quick' | 'full'>('quick');
  const [moonRashi, setMoonRashi] = useState(0);
  const [analysis, setAnalysis] = useState<SadeSatiAnalysis | null>(null);
  const [isFullMode, setIsFullMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string>('summary');

  // Full mode form state
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [tz, setTz] = useState(() => String(-(new Date().getTimezoneOffset() / 60)));

  const saturnNow = useMemo(() => getCurrentSaturnSign(), []);
  const saturnSignName = RASHIS.find(r => r.id === saturnNow.sign)?.name;

  // Quick mode analysis
  const handleQuickSelect = (rashiId: number) => {
    setMoonRashi(rashiId);
    const result = analyzeSadeSati({ moonSign: rashiId });
    setAnalysis(result);
    setIsFullMode(false);
  };

  // Full mode analysis
  const handleFullAnalysis = async () => {
    if (!birthDate || !birthTime || !lat || !lng) return;
    setLoading(true);
    try {
      const res = await fetch('/api/kundali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          date: birthDate,
          time: birthTime,
          place: birthPlace,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          timezone: `Etc/GMT${parseFloat(tz) >= 0 ? '-' : '+'}${Math.abs(parseFloat(tz))}`,
          ayanamsha: 'lahiri',
        }),
      });
      if (!res.ok) throw new Error('API error');
      const kundali = await res.json();

      const moon = kundali.planets?.[1];
      const saturn = kundali.planets?.[6];
      const ascSign = kundali.ascendant?.sign;
      const bavRow = kundali.ashtakavarga?.bpiTable?.[6];

      // Find current maha dasha
      const now = new Date().toISOString();
      const currentMaha = kundali.dashas?.find((d: { startDate: string; endDate: string }) => d.startDate <= now && d.endDate >= now);
      const currentAntar = currentMaha?.subPeriods?.find((d: { startDate: string; endDate: string }) => d.startDate <= now && d.endDate >= now);

      const input: SadeSatiInput = {
        moonSign: moon?.sign ?? 1,
        moonNakshatra: moon?.nakshatra?.id,
        moonDegree: moon?.longitude != null ? (moon.longitude % 30) : undefined,
        ascendantSign: ascSign,
        saturnSign: saturn?.sign,
        saturnHouse: saturn?.house,
        saturnRetrograde: saturn?.isRetrograde,
        ashtakavargaSaturnBindus: bavRow,
        currentDasha: currentMaha ? { planet: currentMaha.planet, startDate: currentMaha.startDate, endDate: currentMaha.endDate } : undefined,
        currentAntar: currentAntar ? { planet: currentAntar.planet, startDate: currentAntar.startDate, endDate: currentAntar.endDate } : undefined,
      };

      setMoonRashi(moon?.sign ?? 1);
      const result = analyzeSadeSati(input);
      setAnalysis(result);
      setIsFullMode(true);
    } catch {
      // Silently handle — could add error state
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const interpretationKeys = ['summary', 'phaseEffect', 'saturnNature', 'moonStrength', 'dashaInterplay', 'ashtakavargaInsight', 'nakshatraTransit', 'houseEffect'] as const;

  const priorityBadge = (p: 'essential' | 'recommended' | 'optional') => {
    const cls = p === 'essential' ? 'bg-red-500/20 text-red-400 border-red-500/30'
      : p === 'recommended' ? 'bg-gold-primary/20 text-gold-light border-gold-primary/30'
      : 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    const label = p === 'essential' ? LABELS.essential : p === 'recommended' ? LABELS.recommended : LABELS.optional;
    return <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${cls}`} style={bodyFont}>{t(label, locale)}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div {...fadeUp} className="text-center mb-12">
        <div className="flex justify-center mb-6"><GrahaIconById id={6} size={80} /></div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t(LABELS.title, locale)}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>{t(LABELS.subtitle, locale)}</p>
        {saturnSignName && (
          <p className="text-gold-dark text-sm mt-4 font-semibold" style={bodyFont}>
            {t(LABELS.saturnIn, locale)}{' '}
            <span className="text-gold-light">{saturnSignName[lk as keyof typeof saturnSignName]} ({saturnNow.degree.toFixed(1)}°)</span>
          </p>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-10">
        {(['quick', 'full'] as const).map(tb => (
          <button
            key={tb}
            onClick={() => { setTab(tb); setAnalysis(null); setMoonRashi(0); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
              tab === tb
                ? 'bg-gold-primary/20 border-gold-primary/40 text-gold-light'
                : 'bg-bg-tertiary/30 border-gold-primary/10 text-text-secondary hover:border-gold-primary/30'
            }`}
            style={bodyFont}
          >
            {t(tb === 'quick' ? LABELS.quickTab : LABELS.fullTab, locale)}
          </button>
        ))}
      </div>

      {/* Quick Mode — Moon Sign Grid */}
      {tab === 'quick' && (
        <motion.div {...fadeUp} className="max-w-lg mx-auto mb-12">
          <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3 text-center" style={bodyFont}>
            {t(LABELS.selectMoon, locale)}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {RASHIS.map((r) => (
              <button
                key={r.id}
                onClick={() => handleQuickSelect(r.id)}
                className={`rounded-xl p-3 text-center border transition-all ${
                  moonRashi === r.id
                    ? 'bg-gold-primary/20 border-gold-primary/40'
                    : 'bg-bg-tertiary/30 border-gold-primary/10 hover:border-gold-primary/30'
                }`}
              >
                <div className="flex justify-center mb-1"><RashiIconById id={r.id} size={28} /></div>
                <div className="text-gold-light text-[10px] font-bold" style={bodyFont}>{r.name[lk as keyof typeof r.name]}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Full Mode — Birth Details Form */}
      {tab === 'full' && (
        <motion.div {...fadeUp} className="max-w-lg mx-auto mb-12 glass-card rounded-2xl p-6 border border-gold-primary/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: LABELS.date, value: birthDate, set: setBirthDate, type: 'date' },
              { label: LABELS.time, value: birthTime, set: setBirthTime, type: 'time' },
              { label: LABELS.place, value: birthPlace, set: setBirthPlace, type: 'text' },
              { label: LABELS.tz, value: tz, set: setTz, type: 'number' },
              { label: LABELS.lat, value: lat, set: setLat, type: 'number' },
              { label: LABELS.lng, value: lng, set: setLng, type: 'number' },
            ].map((f) => (
              <div key={f.label.en}>
                <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-1" style={bodyFont}>{t(f.label, locale)}</label>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  className="w-full bg-bg-tertiary/40 border border-gold-primary/10 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/40 outline-none transition"
                  step={f.type === 'number' ? 'any' : undefined}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleFullAnalysis}
            disabled={loading || !birthDate || !birthTime || !lat || !lng}
            className="mt-6 w-full py-3 rounded-xl font-bold text-sm bg-gold-primary/20 border border-gold-primary/40 text-gold-light hover:bg-gold-primary/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={bodyFont}
          >
            {loading ? t(LABELS.loading, locale) : t(LABELS.analyze, locale)}
          </button>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div {...fadeUp} exit={{ opacity: 0 }}>
            <GoldDivider />

            {/* 1. Status Banner */}
            {analysis.isActive ? (
              <div className="my-10 glass-card rounded-2xl p-8 border-2 border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent text-center">
                <div className="text-red-400 text-xs uppercase tracking-[0.3em] font-bold mb-2">{t(LABELS.active, locale)}</div>
                <div className="text-red-300 text-2xl font-bold mb-1" style={headingFont}>{analysis.cycleStart} — {analysis.cycleEnd}</div>
                {analysis.currentPhase && (
                  <div className="text-text-secondary text-sm mb-4" style={bodyFont}>{t(LABELS.phase[analysis.currentPhase], locale)}</div>
                )}
                {/* Phase progress bar */}
                <div className="max-w-xs mx-auto">
                  <div className="h-2 rounded-full bg-bg-tertiary/40 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(analysis.phaseProgress * 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' as const }}
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
                    />
                  </div>
                  <div className="text-text-secondary text-[10px] mt-1">{Math.round(analysis.phaseProgress * 100)}%</div>
                </div>
              </div>
            ) : (
              <div className="my-10 glass-card rounded-2xl p-8 border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent text-center">
                <div className="text-emerald-400 text-xs uppercase tracking-[0.3em] font-bold mb-2">{t(LABELS.notActive, locale)}</div>
                {analysis.allCycles.length > 0 && (() => {
                  const currentYear = new Date().getFullYear();
                  const next = analysis.allCycles.find(c => c.startYear > currentYear);
                  return next ? (
                    <div className="text-emerald-300 text-lg font-bold" style={headingFont}>
                      {t(LABELS.nextCycle, locale)} {next.startYear}
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* 2. Intensity Meter (full mode only) */}
            {isFullMode && (
              <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="my-10">
                <h2 className="text-3xl font-bold text-gold-gradient mb-6 text-center" style={headingFont}>{t(LABELS.intensity, locale)}</h2>
                <div className="glass-card rounded-2xl p-6 border border-gold-primary/10">
                  {/* Circular-style gauge */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative w-32 h-32">
                      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-bg-tertiary/40" />
                        <circle
                          cx="60" cy="60" r="52" fill="none" strokeWidth="8"
                          stroke="currentColor"
                          className={intensityColor(analysis.overallIntensity)}
                          strokeDasharray={`${(analysis.overallIntensity / 10) * 327} 327`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold font-mono ${intensityColor(analysis.overallIntensity)}`}>
                          {analysis.overallIntensity.toFixed(1)}
                        </span>
                        <span className="text-text-secondary text-[10px]">/10</span>
                      </div>
                    </div>
                    <span className={`mt-2 text-sm font-bold ${intensityColor(analysis.overallIntensity)}`} style={bodyFont}>
                      {intensityLabel(analysis.overallIntensity, locale)}
                    </span>
                  </div>

                  {/* Factor bars */}
                  <div className="space-y-3">
                    {analysis.intensityFactors.map((f, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-secondary" style={bodyFont}>{f.description[lk as keyof typeof f.description] ?? f.description.en}</span>
                          <span className={`font-mono font-bold ${intensityColor(f.score)}`}>{f.score.toFixed(1)}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-bg-tertiary/40 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(f.score / 10) * 100}%` }}
                            transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease: 'easeOut' as const }}
                            className={`h-full rounded-full ${intensityBg(f.score)}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. Personalized Interpretation (full mode only) */}
            {isFullMode && (
              <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="my-10">
                <div className="space-y-3">
                  {interpretationKeys.map((key) => {
                    const content = analysis.interpretation[key];
                    const text = content[lk as keyof typeof content] ?? content.en;
                    if (!text) return null;
                    const isOpen = expandedSection === key || key === 'summary';
                    return (
                      <div key={key} className="glass-card rounded-xl border border-gold-primary/10 overflow-hidden">
                        <button
                          onClick={() => setExpandedSection(isOpen && key !== 'summary' ? '' : key)}
                          className="w-full flex items-center justify-between p-4 text-left"
                        >
                          <span className="text-gold-dark text-sm font-bold uppercase tracking-wider" style={bodyFont}>
                            {t(LABELS.sections[key], locale)}
                          </span>
                          {key !== 'summary' && (
                            <span className={`text-gold-primary/40 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>&#9660;</span>
                          )}
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 text-text-secondary text-sm leading-relaxed" style={bodyFont}>{text}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 4. Timeline */}
            <GoldDivider />
            <h2 className="text-3xl font-bold text-gold-gradient my-8 text-center" style={headingFont}>{t(LABELS.timeline, locale)}</h2>
            <div className="relative mb-10">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gold-primary/20" />
              <div className="space-y-4 ml-14">
                {analysis.allCycles.map((cycle, i) => (
                  <motion.div
                    key={cycle.startYear}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`glass-card rounded-xl p-5 border relative ${
                      cycle.isActive ? 'border-red-500/30 bg-red-500/5' : 'border-gold-primary/10'
                    }`}
                  >
                    <div className={`absolute -left-[2.4rem] top-6 w-3 h-3 rounded-full ${
                      cycle.isActive ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gold-primary/40'
                    }`} />
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className={`font-mono text-lg font-bold ${cycle.isActive ? 'text-red-300' : 'text-gold-light'}`}>
                          {cycle.startYear} — {cycle.endYear}
                        </span>
                        {cycle.isActive && (
                          <span className="ml-3 text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full font-bold animate-pulse">
                            {t(LABELS.current, locale)}
                          </span>
                        )}
                      </div>
                      <span className="text-text-secondary text-xs">~7.5 {t(LABELS.years, locale)}</span>
                    </div>
                    {/* Phase sub-sections for active or detailed view */}
                    {cycle.phases && cycle.phases.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {cycle.phases.map((ph) => (
                          <div key={ph.phase} className={`text-xs flex justify-between ${
                            cycle.isActive && analysis.currentPhase === ph.phase ? 'text-red-300 font-bold' : 'text-text-secondary/60'
                          }`} style={bodyFont}>
                            <span>{t(LABELS.phase[ph.phase], locale)}</span>
                            <span className="font-mono">{ph.startYear}–{ph.endYear}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 5. Remedies */}
            <GoldDivider />
            <h2 className="text-3xl font-bold text-gold-gradient my-8 text-center" style={headingFont}>{t(LABELS.remedies, locale)}</h2>

            {isFullMode && analysis.remedies.length > 0 ? (
              <div className="space-y-8 mb-10">
                {(['essential', 'recommended', 'optional'] as const).map(priority => {
                  const items = analysis.remedies.filter(r => r.priority === priority);
                  if (items.length === 0) return null;
                  return (
                    <div key={priority}>
                      <div className="flex items-center gap-2 mb-3">{priorityBadge(priority)}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((r, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                            className="glass-card rounded-xl p-4 border border-gold-primary/10"
                          >
                            <div className="text-gold-light text-sm font-bold mb-1" style={bodyFont}>{r.title[lk as keyof typeof r.title] ?? r.title.en}</div>
                            <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{r.description[lk as keyof typeof r.description] ?? r.description.en}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {GENERIC_REMEDIES.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="glass-card rounded-xl p-4 border border-gold-primary/10"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-gold-primary text-lg font-bold">{i + 1}</span>
                      <div>
                        <div className="text-gold-light text-sm font-bold mb-0.5" style={bodyFont}>{t(r.title, locale)}</div>
                        <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{t(r.description, locale)}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
