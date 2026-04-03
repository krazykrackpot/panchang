'use client';

import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Calendar, Sun, Moon, ArrowRight, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { dateToJD, sunLongitude, moonLongitude, toSidereal, lahiriAyanamsha, calculateTithi, calculateYoga, calculateKarana, getNakshatraNumber, getRashiNumber, normalizeDeg } from '@/lib/ephem/astronomical';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { RASHIS } from '@/lib/constants/rashis';
import { VARA_DATA } from '@/lib/constants/grahas';
import type { Locale } from '@/types/panchang';

// ── Labels ──────────────────────────────────────────────────────
const LABELS = {
  title: { en: 'Compute Your Panchang', hi: 'अपना पञ्चाङ्ग गणना करें', sa: 'स्वपञ्चाङ्गं गणयत' },
  subtitle: { en: 'Watch the engine calculate each element step by step', hi: 'प्रत्येक तत्व की गणना चरणबद्ध देखें', sa: 'प्रत्येकतत्त्वस्य गणनां चरणशः पश्यत' },
  dateLabel: { en: 'Date', hi: 'तिथि', sa: 'दिनाङ्कः' },
  locationLabel: { en: 'Location', hi: 'स्थान', sa: 'स्थानम्' },
  compute: { en: 'Compute Panchang', hi: 'पञ्चाङ्ग गणना करें', sa: 'पञ्चाङ्गं गणयतु' },
  formula: { en: 'Formula', hi: 'सूत्र', sa: 'सूत्रम्' },
  result: { en: 'Result', hi: 'परिणाम', sa: 'परिणामः' },
  timezone: { en: 'Timezone', hi: 'समय क्षेत्र', sa: 'समयक्षेत्रम्' },
  step: { en: 'Step', hi: 'चरण', sa: 'चरणम्' },
  steps: {
    jd: { en: 'Julian Day Conversion', hi: 'जूलियन दिवस रूपान्तरण', sa: 'जूलियनदिवसरूपान्तरणम्' },
    sun: { en: 'Sun Position', hi: 'सूर्य स्थिति', sa: 'सूर्यस्थितिः' },
    moon: { en: 'Moon Position', hi: 'चन्द्र स्थिति', sa: 'चन्द्रस्थितिः' },
    tithi: { en: 'Tithi (Lunar Day)', hi: 'तिथि (चान्द्र दिन)', sa: 'तिथिः (चान्द्रदिनम्)' },
    nakshatra: { en: 'Nakshatra (Lunar Mansion)', hi: 'नक्षत्र (चन्द्र गृह)', sa: 'नक्षत्रम् (चन्द्रगृहम्)' },
    yoga: { en: 'Yoga (Luni-Solar Combination)', hi: 'योग (सूर्य-चन्द्र संयोग)', sa: 'योगः (सूर्यचन्द्रसंयोगः)' },
    karana: { en: 'Karana (Half-Tithi)', hi: 'करण (अर्ध-तिथि)', sa: 'करणम् (अर्धतिथिः)' },
    vara: { en: 'Vara (Weekday)', hi: 'वार (सप्ताह दिन)', sa: 'वारः (सप्ताहदिनम्)' },
  },
};

interface Location {
  name: string;
  lat: number;
  lng: number;
  timezone: string;
}

interface StepData {
  id: string;
  title: { en: string; hi: string; sa: string };
  icon: React.ReactNode;
  formula: string;
  intermediates: { label: string; value: string }[];
  resultLabel: string;
  resultValue: string;
}

// ── Component ───────────────────────────────────────────────────
export default function PanchangLabPage() {
  const locale = useLocale() as Locale;
  const L = (obj: { en: string; hi: string; sa: string }) => obj[locale] || obj.en;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [date, setDate] = useState(todayStr);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationName, setLocationName] = useState('');
  const [steps, setSteps] = useState<StepData[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [computing, setComputing] = useState(false);

  const compute = useCallback(() => {
    if (!date) return;
    setComputing(true);
    setSteps([]);

    // Parse date
    const [y, m, d] = date.split('-').map(Number);

    // Timezone
    const tz = location?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcOffset = getUTCOffsetForDate(y, m, d, tz);

    // Use noon local time for calculation
    const hourUT = 12 - utcOffset;

    const newSteps: StepData[] = [];

    // Step 1: Julian Day
    const jd = dateToJD(y, m, d, hourUT);
    newSteps.push({
      id: 'jd',
      title: LABELS.steps.jd,
      icon: <Calendar className="w-5 h-5" />,
      formula: 'JD = 365.25 * (Y + 4716) + 30.6001 * (M + 1) + D + h/24 + B - 1524.5',
      intermediates: [
        { label: 'Input Date', value: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` },
        { label: 'Noon Local Time (UT)', value: `${hourUT.toFixed(2)} hours` },
        { label: 'UTC Offset', value: `${utcOffset >= 0 ? '+' : ''}${utcOffset.toFixed(1)}h (${tz})` },
      ],
      resultLabel: 'Julian Day Number',
      resultValue: jd.toFixed(5),
    });

    // Step 2: Sun Position
    const sunTrop = sunLongitude(jd);
    const ayan = lahiriAyanamsha(jd);
    const sunSid = toSidereal(sunTrop, jd);
    const sunRashi = getRashiNumber(sunSid);
    const sunRashiData = RASHIS[sunRashi - 1];
    newSteps.push({
      id: 'sun',
      title: LABELS.steps.sun,
      icon: <Sun className="w-5 h-5" />,
      formula: 'Sidereal = Tropical - Ayanamsha (Lahiri)',
      intermediates: [
        { label: 'Tropical Sun Longitude', value: `${sunTrop.toFixed(4)}\u00B0` },
        { label: 'Lahiri Ayanamsha', value: `${ayan.toFixed(4)}\u00B0` },
        { label: 'Sidereal Sun Longitude', value: `${sunSid.toFixed(4)}\u00B0` },
        { label: 'Rashi', value: `${L(sunRashiData.name)} (${sunRashiData.symbol})` },
        { label: 'Degree in Sign', value: `${(sunSid % 30).toFixed(2)}\u00B0` },
      ],
      resultLabel: `Sun in ${L(sunRashiData.name)}`,
      resultValue: `${sunSid.toFixed(4)}\u00B0 sidereal`,
    });

    // Step 3: Moon Position
    const moonTrop = moonLongitude(jd);
    const moonSid = toSidereal(moonTrop, jd);
    const moonRashi = getRashiNumber(moonSid);
    const moonRashiData = RASHIS[moonRashi - 1];
    newSteps.push({
      id: 'moon',
      title: LABELS.steps.moon,
      icon: <Moon className="w-5 h-5" />,
      formula: 'Sidereal = Tropical - Ayanamsha (Lahiri)',
      intermediates: [
        { label: 'Tropical Moon Longitude', value: `${moonTrop.toFixed(4)}\u00B0` },
        { label: 'Lahiri Ayanamsha', value: `${ayan.toFixed(4)}\u00B0` },
        { label: 'Sidereal Moon Longitude', value: `${moonSid.toFixed(4)}\u00B0` },
        { label: 'Rashi', value: `${L(moonRashiData.name)} (${moonRashiData.symbol})` },
        { label: 'Degree in Sign', value: `${(moonSid % 30).toFixed(2)}\u00B0` },
      ],
      resultLabel: `Moon in ${L(moonRashiData.name)}`,
      resultValue: `${moonSid.toFixed(4)}\u00B0 sidereal`,
    });

    // Step 4: Tithi
    const tithiResult = calculateTithi(jd);
    const tithiData = TITHIS[tithiResult.number - 1];
    const elongation = tithiResult.degree;
    const pakshaLabel = tithiData.paksha === 'shukla'
      ? { en: 'Shukla (Bright)', hi: 'शुक्ल (उज्ज्वल)', sa: 'शुक्लः (उज्ज्वलः)' }
      : { en: 'Krishna (Dark)', hi: 'कृष्ण (अन्धकार)', sa: 'कृष्णः (अन्धकारः)' };
    newSteps.push({
      id: 'tithi',
      title: LABELS.steps.tithi,
      icon: <Sparkles className="w-5 h-5" />,
      formula: 'Elongation = Moon_sid - Sun_sid (mod 360)\nTithi = floor(Elongation / 12) + 1',
      intermediates: [
        { label: 'Moon Sidereal', value: `${moonSid.toFixed(4)}\u00B0` },
        { label: 'Sun Sidereal', value: `${sunSid.toFixed(4)}\u00B0` },
        { label: 'Elongation (Moon - Sun)', value: `${elongation.toFixed(4)}\u00B0` },
        { label: 'Elongation / 12', value: `${(elongation / 12).toFixed(4)}` },
        { label: 'Tithi Number', value: `${tithiResult.number}` },
        { label: 'Paksha', value: L(pakshaLabel) },
      ],
      resultLabel: L(tithiData.name),
      resultValue: `Tithi ${tithiResult.number} / 30 -- ${L(pakshaLabel)}`,
    });

    // Step 5: Nakshatra
    const nakNum = getNakshatraNumber(moonSid);
    const nakData = NAKSHATRAS[nakNum - 1];
    const nakSpan = 360 / 27;
    const posInNak = moonSid % nakSpan;
    const pada = Math.floor(posInNak / (nakSpan / 4)) + 1;
    newSteps.push({
      id: 'nakshatra',
      title: LABELS.steps.nakshatra,
      icon: <Sparkles className="w-5 h-5" />,
      formula: 'Nakshatra = floor(Moon_sidereal / 13.3333) + 1\nPada = floor((Moon % 13.333) / 3.333) + 1',
      intermediates: [
        { label: 'Moon Sidereal', value: `${moonSid.toFixed(4)}\u00B0` },
        { label: 'Each Nakshatra Span', value: `${nakSpan.toFixed(4)}\u00B0 (360 / 27)` },
        { label: 'Moon / 13.333', value: `${(moonSid / nakSpan).toFixed(4)}` },
        { label: 'Nakshatra Number', value: `${nakNum}` },
        { label: 'Position in Nakshatra', value: `${posInNak.toFixed(4)}\u00B0` },
        { label: 'Pada', value: `${pada} / 4` },
        { label: 'Ruler', value: `${L(nakData.rulerName)}` },
      ],
      resultLabel: `${L(nakData.name)} Pada ${pada}`,
      resultValue: `Nakshatra ${nakNum} / 27 -- Ruled by ${L(nakData.rulerName)}`,
    });

    // Step 6: Yoga
    const yogaNum = calculateYoga(jd);
    const yogaData = YOGAS[yogaNum - 1];
    const yogaSum = normalizeDeg(sunSid + moonSid);
    newSteps.push({
      id: 'yoga',
      title: LABELS.steps.yoga,
      icon: <Sparkles className="w-5 h-5" />,
      formula: 'Sum = (Sun_sid + Moon_sid) mod 360\nYoga = floor(Sum / 13.3333) + 1',
      intermediates: [
        { label: 'Sun Sidereal', value: `${sunSid.toFixed(4)}\u00B0` },
        { label: 'Moon Sidereal', value: `${moonSid.toFixed(4)}\u00B0` },
        { label: 'Sum (mod 360)', value: `${yogaSum.toFixed(4)}\u00B0` },
        { label: 'Sum / 13.333', value: `${(yogaSum / (360 / 27)).toFixed(4)}` },
        { label: 'Yoga Number', value: `${yogaNum}` },
        { label: 'Nature', value: yogaData.nature },
      ],
      resultLabel: L(yogaData.name),
      resultValue: `Yoga ${yogaNum} / 27 -- ${L(yogaData.meaning)}`,
    });

    // Step 7: Karana
    const karanaNum = calculateKarana(jd);
    const karanaData = KARANAS[karanaNum - 1];
    const karanaIndex = Math.floor(elongation / 6);
    newSteps.push({
      id: 'karana',
      title: LABELS.steps.karana,
      icon: <Sparkles className="w-5 h-5" />,
      formula: 'Karana Index = floor(Elongation / 6)\nMapped to 11 karanas (7 chara + 4 sthira)',
      intermediates: [
        { label: 'Elongation', value: `${elongation.toFixed(4)}\u00B0` },
        { label: 'Elongation / 6', value: `${(elongation / 6).toFixed(4)}` },
        { label: 'Karana Index (raw)', value: `${karanaIndex}` },
        { label: 'Mapped Karana', value: `${karanaNum}` },
        { label: 'Type', value: karanaData.type === 'chara' ? 'Chara (Movable)' : 'Sthira (Fixed)' },
      ],
      resultLabel: L(karanaData.name),
      resultValue: `Karana ${karanaNum} / 11 -- ${karanaData.type}`,
    });

    // Step 8: Vara (Weekday)
    const weekday = Math.floor(jd + 1.5) % 7; // 0=Sun, 1=Mon, ..., 6=Sat
    const varaData = VARA_DATA[weekday];
    newSteps.push({
      id: 'vara',
      title: LABELS.steps.vara,
      icon: <Calendar className="w-5 h-5" />,
      formula: 'Weekday = floor(JD + 1.5) mod 7\n0 = Sunday, 1 = Monday, ... 6 = Saturday',
      intermediates: [
        { label: 'JD', value: jd.toFixed(5) },
        { label: 'JD + 1.5', value: (jd + 1.5).toFixed(5) },
        { label: 'floor(JD + 1.5)', value: `${Math.floor(jd + 1.5)}` },
        { label: 'mod 7', value: `${weekday}` },
        { label: 'Ruling Planet', value: L(varaData.ruler) },
      ],
      resultLabel: L(varaData.name),
      resultValue: `Day ${weekday} -- Ruled by ${L(varaData.ruler)}`,
    });

    // Stagger reveal
    setSteps([]);
    newSteps.forEach((step, i) => {
      setTimeout(() => {
        setSteps(prev => [...prev, step]);
        if (i === 0) setExpandedStep(0);
      }, i * 200);
    });

    setTimeout(() => setComputing(false), newSteps.length * 200 + 100);
  }, [date, location, locale]);

  const toggleStep = (index: number) => {
    setExpandedStep(prev => prev === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
            {L(LABELS.title)}
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-lg max-w-2xl mx-auto"
        >
          {L(LABELS.subtitle)}
        </motion.p>
      </div>

      {/* Input Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto mb-12 p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-amber-300/80 mb-2">
              {L(LABELS.dateLabel)}
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-colors [color-scheme:dark]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-amber-300/80 mb-2">
              {L(LABELS.locationLabel)}
            </label>
            <LocationSearch
              value={locationName}
              onSelect={(loc) => {
                setLocation(loc);
                setLocationName(loc.name);
              }}
              placeholder={locale === 'hi' ? 'शहर खोजें...' : locale === 'sa' ? 'नगरं अन्विष्यतु...' : 'Search city...'}
              className="w-full"
            />
          </div>
        </div>

        {/* Timezone display */}
        {location && (
          <div className="text-xs text-slate-500 mb-4">
            {L(LABELS.timezone)}: {location.timezone} ({location.lat.toFixed(2)}, {location.lng.toFixed(2)})
          </div>
        )}

        {/* Compute Button */}
        <button
          onClick={compute}
          disabled={computing}
          className="w-full py-3.5 rounded-xl font-semibold text-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30"
        >
          {computing ? (
            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
          {L(LABELS.compute)}
        </button>
      </motion.div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto space-y-4">
        <AnimatePresence mode="popLayout">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: 'easeOut' as const }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden"
            >
              {/* Step Header */}
              <button
                onClick={() => toggleStep(index)}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Step Number Badge */}
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="text-amber-400/70">
                  {step.icon}
                </div>

                {/* Title */}
                <div className="flex-1 text-left">
                  <span className="text-xs text-amber-500/60 uppercase tracking-wider font-medium">
                    {L(LABELS.step)} {index + 1}
                  </span>
                  <h3 className="text-white font-semibold text-lg leading-tight">
                    {L(step.title)}
                  </h3>
                </div>

                {/* Result Preview */}
                <div className="hidden sm:block text-right mr-3">
                  <span className="text-amber-300 font-bold text-sm">
                    {step.resultLabel}
                  </span>
                </div>

                {/* Expand/Collapse */}
                {expandedStep === index
                  ? <ChevronUp className="w-5 h-5 text-slate-500" />
                  : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedStep === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-1 border-t border-white/5">
                      {/* Formula */}
                      <div className="mb-4">
                        <span className="text-xs text-amber-500/60 uppercase tracking-wider font-medium">
                          {L(LABELS.formula)}
                        </span>
                        <pre className="mt-1.5 px-4 py-3 rounded-lg bg-black/30 border border-white/5 text-amber-200/80 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                          {step.formula}
                        </pre>
                      </div>

                      {/* Intermediate Values */}
                      <div className="space-y-2 mb-4">
                        {step.intermediates.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-center justify-between px-4 py-2 rounded-lg bg-white/[0.02] border border-white/5"
                          >
                            <span className="text-slate-400 text-sm">{item.label}</span>
                            <span className="text-white font-mono text-sm font-medium">{item.value}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Final Result */}
                      <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                        <span className="text-xs text-amber-500/60 uppercase tracking-wider font-medium">
                          {L(LABELS.result)}
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-amber-200 font-bold text-xl">
                            {step.resultLabel}
                          </span>
                          <span className="text-amber-400/80 font-mono text-sm">
                            {step.resultValue}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {steps.length === 0 && !computing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-slate-500"
        >
          <Calculator className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">
            {locale === 'hi' ? 'गणना शुरू करने के लिए तिथि चुनें और "पञ्चाङ्ग गणना करें" दबाएँ'
              : locale === 'sa' ? 'गणनां प्रारभितुं दिनाङ्कं चित्वा "पञ्चाङ्गं गणयतु" नुदत'
              : 'Pick a date and press "Compute Panchang" to begin'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
