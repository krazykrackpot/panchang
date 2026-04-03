'use client';

import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Calendar, ArrowRight, ChevronDown, ChevronUp, Telescope } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { dateToJD, normalizeDeg, toRad, toSidereal, lahiriAyanamsha, getNakshatraNumber, getRashiNumber } from '@/lib/ephem/astronomical';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import type { Locale } from '@/types/panchang';

// ── Table 47.A top terms ────────────────────────────────────────
const MOON_LR_TABLE: [number, number, number, number, number][] = [
  [0,0,1,0,6288774], [2,0,-1,0,1274027], [2,0,0,0,658314], [0,0,2,0,213618],
  [0,1,0,0,-185116], [0,0,0,2,-114332], [2,0,-2,0,58793], [2,-1,-1,0,57066],
  [2,0,1,0,53322], [2,-1,0,0,45758], [0,1,-1,0,-40923], [1,0,0,0,-34720],
  [0,1,1,0,-30383], [2,0,0,-2,15327], [0,0,1,2,-12528], [0,0,1,-2,10980],
  [4,0,-1,0,10675], [0,0,3,0,10034], [4,0,-2,0,8548], [2,1,-1,0,-7888],
  [2,1,0,0,-6766], [1,0,-1,0,-5163], [1,1,0,0,4987], [2,-1,1,0,4036],
  [2,0,2,0,3994], [4,0,0,0,3861], [2,0,-3,0,3665], [0,1,-2,0,-2689],
  [2,0,-1,2,-2602], [2,-1,-2,0,2390], [1,0,1,0,-2348], [2,-2,0,0,2236],
  [0,1,2,0,-2120], [0,2,0,0,-2069], [2,-2,-1,0,2048], [2,0,1,-2,-1773],
  [2,0,0,2,-1595], [4,-1,-1,0,1215], [0,0,2,2,-1110], [3,0,-1,0,-892],
  [2,1,1,0,-810], [4,-1,-2,0,759], [0,2,-1,0,-713], [2,2,-1,0,-700],
  [2,1,-2,0,691], [2,-1,0,-2,596], [4,0,1,0,549], [0,0,4,0,537],
  [4,-1,0,0,520], [1,0,-2,0,-487], [2,1,0,-2,-399], [0,0,2,-2,-381],
  [1,1,1,0,351], [3,0,-2,0,-340], [4,0,-3,0,330], [2,-1,2,0,327],
  [0,2,1,0,-323], [1,1,-1,0,299], [2,0,3,0,294], [2,0,-1,-2,0],
];

// ── Labels ──────────────────────────────────────────────────────
const LABELS = {
  title: { en: 'Trace Your Moon', hi: 'अपने चन्द्र का पथ खोजें', sa: 'स्वचन्द्रपथम् अन्विष्यत' },
  subtitle: { en: 'Step through the Meeus algorithm that computes the Moon\'s position from scratch', hi: 'मीयस एल्गोरिथम से चन्द्र की स्थिति की चरणबद्ध गणना देखें', sa: 'मीयस-सूत्रेण चन्द्रस्थितेः चरणशः गणनां पश्यत' },
  dateLabel: { en: 'Date & Time', hi: 'दिनांक एवं समय', sa: 'दिनाङ्कः समयश्च' },
  locationLabel: { en: 'Location', hi: 'स्थान', sa: 'स्थानम्' },
  compute: { en: 'Trace Moon Position', hi: 'चन्द्र स्थिति खोजें', sa: 'चन्द्रस्थितिम् अन्विष्यतु' },
  formula: { en: 'Formula', hi: 'सूत्र', sa: 'सूत्रम्' },
  result: { en: 'Result', hi: 'परिणाम', sa: 'परिणामः' },
  step: { en: 'Step', hi: 'चरण', sa: 'चरणम्' },
  steps: {
    jd: { en: 'Convert to Julian Day', hi: 'जूलियन दिवस में बदलें', sa: 'जूलियनदिवसे परिवर्तयतु' },
    centuries: { en: 'Julian Centuries (T)', hi: 'जूलियन शताब्दी (T)', sa: 'जूलियनशताब्दी (T)' },
    arguments: { en: 'Fundamental Arguments', hi: 'मूल कोणांक', sa: 'मूलकोणाङ्काः' },
    terms: { en: 'Top Sine Terms (Table 47.A)', hi: 'प्रमुख ज्या पद (सारणी 47.A)', sa: 'प्रमुखज्यापदानि (सारणी 47.A)' },
    sum: { en: 'Sum All 60 Terms', hi: 'सभी 60 पदों का योग', sa: 'सर्वेषां 60 पदानां योगः' },
    longitude: { en: 'Final Tropical Longitude', hi: 'अंतिम सायन देशान्तर', sa: 'अन्तिमसायनदेशान्तरम्' },
    sidereal: { en: 'Apply Ayanamsha', hi: 'अयनांश लागू करें', sa: 'अयनांशं योजयतु' },
    result: { en: 'Rashi & Nakshatra', hi: 'राशि एवं नक्षत्र', sa: 'राशिः नक्षत्रं च' },
  },
};

interface Location { name: string; lat: number; lng: number; timezone: string; }

interface StepData {
  id: string;
  title: { en: string; hi: string; sa: string };
  formula: string;
  intermediates: { label: string; value: string }[];
  resultLabel: string;
  resultValue: string;
  table?: { headers: string[]; rows: string[][] };
}

// ── Main Moon Trace Computation ─────────────────────────────────
function traceMoon(y: number, m: number, d: number, hour: number, minute: number, utcOffset: number, tz: string): StepData[] {
  const steps: StepData[] = [];
  const hourUT = hour + minute / 60 - utcOffset;

  // Step 1: JD
  const jd = dateToJD(y, m, d, hourUT);
  steps.push({
    id: 'jd',
    title: LABELS.steps.jd,
    formula: 'JD = 365.25 * (Y + 4716) + 30.6001 * (M + 1) + D + h/24 + B - 1524.5',
    intermediates: [
      { label: 'Input', value: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` },
      { label: 'UTC Offset', value: `${utcOffset >= 0 ? '+' : ''}${utcOffset.toFixed(1)}h (${tz})` },
      { label: 'Hour (UT)', value: `${hourUT.toFixed(4)}` },
    ],
    resultLabel: 'Julian Day',
    resultValue: jd.toFixed(6),
  });

  // Step 2: Julian Centuries T
  const t = (jd - 2451545.0) / 36525.0;
  steps.push({
    id: 'centuries',
    title: LABELS.steps.centuries,
    formula: 'T = (JD - 2451545.0) / 36525.0',
    intermediates: [
      { label: 'JD', value: jd.toFixed(6) },
      { label: 'J2000.0 epoch', value: '2451545.0' },
      { label: 'JD - J2000.0', value: (jd - 2451545.0).toFixed(6) },
      { label: 'Days per century', value: '36525.0' },
    ],
    resultLabel: 'T (Julian Centuries)',
    resultValue: t.toFixed(10),
  });

  // Step 3: Fundamental Arguments
  const Lp = normalizeDeg(218.3164477 + 481267.88123421 * t
    - 0.0015786 * t * t + t * t * t / 538841 - t * t * t * t / 65194000);
  const D = normalizeDeg(297.8501921 + 445267.1114034 * t
    - 0.0018819 * t * t + t * t * t / 545868 - t * t * t * t / 113065000);
  const M = normalizeDeg(357.5291092 + 35999.0502909 * t
    - 0.0001536 * t * t + t * t * t / 24490000);
  const Mp = normalizeDeg(134.9633964 + 477198.8675055 * t
    + 0.0087414 * t * t + t * t * t / 69699 - t * t * t * t / 14712000);
  const F = normalizeDeg(93.2720950 + 483202.0175233 * t
    - 0.0036539 * t * t - t * t * t / 3526000 + t * t * t * t / 863310000);

  steps.push({
    id: 'arguments',
    title: LABELS.steps.arguments,
    formula: "L' = 218.316 + 481267.881*T + ...\nD  = 297.850 + 445267.111*T + ...\nM  = 357.529 + 35999.050*T + ...\nM' = 134.963 + 477198.868*T + ...\nF  = 93.272 + 483202.018*T + ...",
    intermediates: [
      { label: "L' (Moon mean longitude)", value: `${Lp.toFixed(6)}\u00B0` },
      { label: 'D (Mean elongation)', value: `${D.toFixed(6)}\u00B0` },
      { label: 'M (Sun mean anomaly)', value: `${M.toFixed(6)}\u00B0` },
      { label: "M' (Moon mean anomaly)", value: `${Mp.toFixed(6)}\u00B0` },
      { label: 'F (Moon argument of latitude)', value: `${F.toFixed(6)}\u00B0` },
    ],
    resultLabel: '5 Fundamental Arguments',
    resultValue: `L'=${Lp.toFixed(2)}\u00B0, D=${D.toFixed(2)}\u00B0, M=${M.toFixed(2)}\u00B0, M'=${Mp.toFixed(2)}\u00B0, F=${F.toFixed(2)}\u00B0`,
  });

  // Step 4: Top 5 sine terms
  const E = 1 - 0.002516 * t - 0.0000074 * t * t;
  const E2 = E * E;
  const dr = toRad(D), mr = toRad(M), mpr = toRad(Mp), fr = toRad(F);

  // Compute all 60 terms and pick top 5 by |contribution|
  const termDetails: { dMult: number; mMult: number; mpMult: number; fMult: number; coeff: number; sinArg: number; contribution: number }[] = [];
  for (const [cd, cm, cmp, cf, sl] of MOON_LR_TABLE) {
    const arg = cd * dr + cm * mr + cmp * mpr + cf * fr;
    let coeff = sl;
    const absM = Math.abs(cm);
    if (absM === 1) coeff *= E;
    else if (absM === 2) coeff *= E2;
    const sinVal = Math.sin(arg);
    const contrib = coeff * sinVal;
    termDetails.push({ dMult: cd, mMult: cm, mpMult: cmp, fMult: cf, coeff, sinArg: sinVal, contribution: contrib });
  }

  const sortedTerms = [...termDetails].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  const top5 = sortedTerms.slice(0, 5);

  steps.push({
    id: 'terms',
    title: LABELS.steps.terms,
    formula: 'Each term: coeff * E^|M_mult| * sin(D*d + M*m + M\'*mp + F*f)\nCoefficients in units of 10^-6 degrees',
    intermediates: [
      { label: 'Eccentricity E', value: E.toFixed(8) },
      { label: 'Total terms in Table 47.A', value: '60' },
      { label: 'Showing', value: 'Top 5 by |contribution|' },
    ],
    resultLabel: 'Top 5 Sine Terms',
    resultValue: `Largest: ${(top5[0].contribution / 1e6).toFixed(6)}\u00B0`,
    table: {
      headers: ['D', 'M', "M'", 'F', 'Coeff', 'sin(arg)', 'Contribution'],
      rows: top5.map(t => [
        `${t.dMult}`,
        `${t.mMult}`,
        `${t.mpMult}`,
        `${t.fMult}`,
        `${t.coeff.toFixed(0)}`,
        `${t.sinArg.toFixed(6)}`,
        `${(t.contribution / 1e6).toFixed(6)}\u00B0`,
      ]),
    },
  });

  // Step 5: Sum all 60 terms
  let sumL = 0;
  for (const td of termDetails) {
    sumL += td.contribution;
  }

  // Additional corrections
  const A1 = toRad(normalizeDeg(119.75 + 131.849 * t));
  const A2 = toRad(normalizeDeg(53.09 + 479264.290 * t));

  const venusCorr = 3958 * Math.sin(A1);
  const flatCorr = 1962 * Math.sin(toRad(Lp) - fr);
  const jupCorr = 318 * Math.sin(A2);
  const totalCorr = sumL + venusCorr + flatCorr + jupCorr;

  steps.push({
    id: 'sum',
    title: LABELS.steps.sum,
    formula: 'sumL = sum of all 60 sine terms\n+ Venus correction (3958 * sin A1)\n+ Flattening correction (1962 * sin(L\' - F))\n+ Jupiter correction (318 * sin A2)',
    intermediates: [
      { label: 'Sum of 60 sine terms', value: `${sumL.toFixed(0)} (x 10^-6 deg)` },
      { label: 'Venus correction', value: `${venusCorr.toFixed(0)}` },
      { label: 'Flattening correction', value: `${flatCorr.toFixed(0)}` },
      { label: 'Jupiter correction', value: `${jupCorr.toFixed(0)}` },
      { label: 'Total correction', value: `${totalCorr.toFixed(0)} (x 10^-6 deg)` },
      { label: 'In degrees', value: `${(totalCorr / 1e6).toFixed(6)}\u00B0` },
    ],
    resultLabel: 'Total Longitude Correction',
    resultValue: `${(totalCorr / 1e6).toFixed(6)}\u00B0`,
  });

  // Step 6: Final tropical longitude
  const tropLong = normalizeDeg(Lp + totalCorr / 1e6);
  steps.push({
    id: 'longitude',
    title: LABELS.steps.longitude,
    formula: "Tropical Longitude = L' + sumL / 1000000",
    intermediates: [
      { label: "L' (mean longitude)", value: `${Lp.toFixed(6)}\u00B0` },
      { label: 'Correction', value: `${(totalCorr / 1e6).toFixed(6)}\u00B0` },
      { label: 'L\' + Correction', value: `${(Lp + totalCorr / 1e6).toFixed(6)}\u00B0` },
    ],
    resultLabel: 'Tropical Moon',
    resultValue: `${tropLong.toFixed(6)}\u00B0`,
  });

  // Step 7: Apply ayanamsha
  const ayan = lahiriAyanamsha(jd);
  const sidLong = toSidereal(tropLong, jd);
  steps.push({
    id: 'sidereal',
    title: LABELS.steps.sidereal,
    formula: 'Sidereal = Tropical - Ayanamsha (Lahiri)',
    intermediates: [
      { label: 'Tropical Longitude', value: `${tropLong.toFixed(6)}\u00B0` },
      { label: 'Lahiri Ayanamsha', value: `${ayan.toFixed(6)}\u00B0` },
      { label: 'Tropical - Ayanamsha', value: `${(tropLong - ayan).toFixed(6)}\u00B0` },
    ],
    resultLabel: 'Sidereal Moon',
    resultValue: `${sidLong.toFixed(6)}\u00B0`,
  });

  // Step 8: Rashi and Nakshatra
  const rashiNum = getRashiNumber(sidLong);
  const nakNum = getNakshatraNumber(sidLong);
  const rashiData = RASHIS[rashiNum - 1];
  const nakData = NAKSHATRAS[nakNum - 1];
  const degInSign = sidLong % 30;
  const nakSpan = 360 / 27;
  const posInNak = sidLong % nakSpan;
  const pada = Math.floor(posInNak / (nakSpan / 4)) + 1;

  steps.push({
    id: 'result',
    title: LABELS.steps.result,
    formula: 'Rashi = floor(sidereal / 30) + 1\nNakshatra = floor(sidereal / 13.333) + 1\nPada = floor((pos_in_nak) / 3.333) + 1',
    intermediates: [
      { label: 'Sidereal Longitude', value: `${sidLong.toFixed(4)}\u00B0` },
      { label: 'sidLong / 30', value: `${(sidLong / 30).toFixed(4)}` },
      { label: 'Rashi Number', value: `${rashiNum}` },
      { label: 'Degree in Sign', value: `${degInSign.toFixed(4)}\u00B0` },
      { label: 'sidLong / 13.333', value: `${(sidLong / nakSpan).toFixed(4)}` },
      { label: 'Nakshatra Number', value: `${nakNum}` },
      { label: 'Pada', value: `${pada} / 4` },
      { label: 'Nakshatra Ruler', value: nakData.ruler },
    ],
    resultLabel: `${rashiData.symbol} ${rashiData.name.en} / ${nakData.name.en} Pada ${pada}`,
    resultValue: `${sidLong.toFixed(4)}\u00B0 sidereal`,
  });

  return steps;
}

// ── Component ───────────────────────────────────────────────────
export default function MoonLabPage() {
  const locale = useLocale() as Locale;
  const L = (obj: { en: string; hi: string; sa: string }) => obj[locale] || obj.en;

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState(nowTime);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationName, setLocationName] = useState('');
  const [steps, setSteps] = useState<StepData[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [computing, setComputing] = useState(false);

  const compute = useCallback(() => {
    if (!date) return;
    setComputing(true);
    setSteps([]);

    const [y, mo, d] = date.split('-').map(Number);
    const [h, min] = time.split(':').map(Number);
    const tz = location?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcOffset = getUTCOffsetForDate(y, mo, d, tz);

    const result = traceMoon(y, mo, d, h, min, utcOffset, tz);

    // Stagger reveal
    result.forEach((step, i) => {
      setTimeout(() => {
        setSteps(prev => [...prev, step]);
        if (i === 0) setExpandedStep(0);
      }, i * 250);
    });

    setTimeout(() => setComputing(false), result.length * 250 + 100);
  }, [date, time, location]);

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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Moon className="w-6 h-6 text-indigo-300" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-200 via-purple-100 to-indigo-200 bg-clip-text text-transparent">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium text-indigo-300/80 mb-2">
              {locale === 'hi' ? 'दिनांक' : locale === 'sa' ? 'दिनाङ्कः' : 'Date'}
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-colors [color-scheme:dark]"
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-sm font-medium text-indigo-300/80 mb-2">
              {locale === 'hi' ? 'समय' : locale === 'sa' ? 'समयः' : 'Time'}
            </label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-colors [color-scheme:dark]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-indigo-300/80 mb-2">
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

        {location && (
          <div className="text-xs text-slate-500 mb-4">
            {location.timezone} ({location.lat.toFixed(2)}, {location.lng.toFixed(2)})
          </div>
        )}

        {/* Compute Button */}
        <button
          onClick={compute}
          disabled={computing}
          className="w-full py-3.5 rounded-xl font-semibold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30"
        >
          {computing ? (
            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Telescope className="w-5 h-5" />
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
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
                  {index + 1}
                </div>

                <div className="flex-1 text-left">
                  <span className="text-xs text-indigo-400/60 uppercase tracking-wider font-medium">
                    {L(LABELS.step)} {index + 1}
                  </span>
                  <h3 className="text-white font-semibold text-lg leading-tight">
                    {L(step.title)}
                  </h3>
                </div>

                <div className="hidden sm:block text-right mr-3">
                  <span className="text-indigo-200 font-bold text-sm">
                    {step.resultLabel}
                  </span>
                </div>

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
                        <span className="text-xs text-indigo-400/60 uppercase tracking-wider font-medium">
                          {L(LABELS.formula)}
                        </span>
                        <pre className="mt-1.5 px-4 py-3 rounded-lg bg-black/30 border border-white/5 text-indigo-200/80 font-mono text-sm whitespace-pre-wrap leading-relaxed">
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
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-4 py-2 rounded-lg bg-white/[0.02] border border-white/5"
                          >
                            <span className="text-slate-400 text-sm">{item.label}</span>
                            <span className="text-white font-mono text-sm font-medium">{item.value}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Table (for sine terms step) */}
                      {step.table && (
                        <div className="mb-4 overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/10">
                                {step.table.headers.map((h, i) => (
                                  <th key={i} className="px-3 py-2 text-left text-indigo-300/70 font-medium text-xs uppercase tracking-wider">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {step.table.rows.map((row, ri) => (
                                <motion.tr
                                  key={ri}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: ri * 0.08 }}
                                  className="border-b border-white/5 hover:bg-white/[0.02]"
                                >
                                  {row.map((cell, ci) => (
                                    <td key={ci} className="px-3 py-2 font-mono text-white/80">
                                      {cell}
                                    </td>
                                  ))}
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Final Result */}
                      <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                        <span className="text-xs text-indigo-400/60 uppercase tracking-wider font-medium">
                          {L(LABELS.result)}
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-indigo-100 font-bold text-xl">
                            {step.resultLabel}
                          </span>
                          <span className="text-indigo-300/80 font-mono text-sm">
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
          <Moon className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">
            {locale === 'hi' ? 'चन्द्र की गणना शुरू करने के लिए दिनांक और समय चुनें'
              : locale === 'sa' ? 'चन्द्रगणनां प्रारभितुं दिनाङ्कं समयं च चिनुत'
              : 'Pick a date and time, then press "Trace Moon Position" to begin'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
