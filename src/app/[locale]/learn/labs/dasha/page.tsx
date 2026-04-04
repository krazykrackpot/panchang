'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { dateToJD, moonLongitude, toSidereal, getNakshatraNumber } from '@/lib/ephem/astronomical';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { GRAHAS } from '@/lib/constants/grahas';
import type { Locale } from '@/types/panchang';

// ── Labels ──────────────────────────────────────────────────────
const L = {
  title: { en: 'Lab: Your Dasha Timeline', hi: 'प्रयोगशाला: आपकी दशा समयरेखा', sa: 'प्रयोगशाला: भवतः दशासमयरेखा' },
  subtitle: { en: 'Compute your Vimshottari Maha Dasha sequence from birth data', hi: 'जन्म आँकड़ों से विंशोत्तरी महादशा क्रम की गणना करें', sa: 'जन्मदत्तांशेभ्यः विंशोत्तरीमहादशाक्रमस्य गणना' },
  birthDate: { en: 'Birth Date', hi: 'जन्म तिथि', sa: 'जन्मतिथिः' },
  birthTime: { en: 'Birth Time', hi: 'जन्म समय', sa: 'जन्मसमयः' },
  birthPlace: { en: 'Birth Place', hi: 'जन्म स्थान', sa: 'जन्मस्थानम्' },
  compute: { en: 'Compute Dashas', hi: 'दशा गणना करें', sa: 'दशागणनां कुरु' },
  step1: { en: 'Step 1: Moon Position', hi: 'चरण 1: चन्द्र स्थिति', sa: 'सोपानम् 1: चन्द्रस्थितिः' },
  step2: { en: 'Step 2: Nakshatra Lord', hi: 'चरण 2: नक्षत्र स्वामी', sa: 'सोपानम् 2: नक्षत्रस्वामी' },
  step3: { en: 'Step 3: Balance Calculation', hi: 'चरण 3: शेष गणना', sa: 'सोपानम् 3: शेषगणना' },
  step4: { en: 'Step 4: Full 120-Year Timeline', hi: 'चरण 4: पूर्ण 120 वर्ष समयरेखा', sa: 'सोपानम् 4: पूर्णं 120 वर्षसमयरेखा' },
  moonLong: { en: 'Moon Tropical Longitude', hi: 'चन्द्र सायन भोगांश', sa: 'चन्द्रसायनभोगांशः' },
  moonSid: { en: 'Moon Sidereal Longitude', hi: 'चन्द्र निरयन भोगांश', sa: 'चन्द्रनिरयनभोगांशः' },
  nakshatra: { en: 'Birth Nakshatra', hi: 'जन्म नक्षत्र', sa: 'जन्मनक्षत्रम्' },
  lord: { en: 'Nakshatra Lord (Starting Dasha)', hi: 'नक्षत्र स्वामी (प्रारम्भिक दशा)', sa: 'नक्षत्रस्वामी (प्रारम्भिकदशा)' },
  remaining: { en: 'Degree Remaining in Nakshatra', hi: 'नक्षत्र में शेष अंश', sa: 'नक्षत्रे शेषांशः' },
  balance: { en: 'Dasha Balance at Birth', hi: 'जन्म पर दशा शेष', sa: 'जन्मसमये दशाशेषः' },
  formula: { en: 'Formula', hi: 'सूत्र', sa: 'सूत्रम्' },
  years: { en: 'years', hi: 'वर्ष', sa: 'वर्षाणि' },
  months: { en: 'months', hi: 'माह', sa: 'मासाः' },
  days: { en: 'days', hi: 'दिन', sa: 'दिनानि' },
  current: { en: 'CURRENT', hi: 'वर्तमान', sa: 'वर्तमानम्' },
};

// ── Vimshottari constants ───────────────────────────────────────
const VIMSHOTTARI_ORDER = [
  { id: 8, years: 7 },   // Ketu
  { id: 5, years: 20 },  // Venus
  { id: 0, years: 6 },   // Sun
  { id: 1, years: 10 },  // Moon
  { id: 2, years: 7 },   // Mars
  { id: 7, years: 18 },  // Rahu
  { id: 4, years: 16 },  // Jupiter
  { id: 6, years: 19 },  // Saturn
  { id: 3, years: 17 },  // Mercury
];

const DASHA_COLORS: Record<number, string> = {
  0: '#e67e22', 1: '#ecf0f1', 2: '#e74c3c', 3: '#2ecc71',
  4: '#f39c12', 5: '#e8e6e3', 6: '#3498db', 7: '#8e44ad', 8: '#95a5a6',
};

const NAK_SPAN = 360 / 27; // 13.333...

// Ruler string to VIMSHOTTARI index lookup
const RULER_TO_VIMSHOTTARI_IDX: Record<string, number> = {
  Ketu: 0, Venus: 1, Sun: 2, Moon: 3, Mars: 4, Rahu: 5, Jupiter: 6, Saturn: 7, Mercury: 8,
};

interface LocationResult { name: string; lat: number; lng: number; timezone: string }

interface DashaSegment {
  planetId: number;
  startDate: Date;
  endDate: Date;
  durationYears: number;
}

function addYearsDecimal(base: Date, years: number): Date {
  const ms = years * 365.25 * 24 * 60 * 60 * 1000;
  return new Date(base.getTime() + ms);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDuration(years: number, locale: Locale): string {
  const y = Math.floor(years);
  const m = Math.floor((years - y) * 12);
  const d = Math.floor(((years - y) * 12 - m) * 30);
  const parts: string[] = [];
  if (y > 0) parts.push(`${y} ${L.years[locale]}`);
  if (m > 0) parts.push(`${m} ${L.months[locale]}`);
  if (d > 0) parts.push(`${d} ${L.days[locale]}`);
  return parts.join(', ') || `0 ${L.days[locale]}`;
}

export default function DashaLabPage() {
  const locale = useLocale() as Locale;
  const [birthDate, setBirthDate] = useState('1990-01-15');
  const [birthTime, setBirthTime] = useState('06:00');
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [locationName, setLocationName] = useState('');
  const [computed, setComputed] = useState(false);

  // Computation results
  const result = useMemo(() => {
    if (!computed || !location) return null;
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);
    const decimalHour = hour + minute / 60;
    const tzOffset = getUTCOffsetForDate(year, month, day, location.timezone);
    const utHour = decimalHour - tzOffset;
    const jd = dateToJD(year, month, day, utHour);

    const tropMoon = moonLongitude(jd);
    const sidMoon = toSidereal(tropMoon, jd);
    const nakNum = getNakshatraNumber(sidMoon);
    const nak = NAKSHATRAS[nakNum - 1];

    // Degree remaining in nakshatra
    const nakStart = (nakNum - 1) * NAK_SPAN;
    const posInNak = sidMoon - nakStart;
    const degRemaining = NAK_SPAN - posInNak;

    // Find Vimshottari index for this nakshatra lord
    const vIdx = RULER_TO_VIMSHOTTARI_IDX[nak.ruler];
    const startPlanet = VIMSHOTTARI_ORDER[vIdx];
    const balanceYears = (degRemaining / NAK_SPAN) * startPlanet.years;

    // Generate full timeline
    const birthDateObj = new Date(year, month - 1, day, hour, minute);
    const segments: DashaSegment[] = [];
    let cursor = new Date(birthDateObj);

    // First dasha (partial)
    const firstEnd = addYearsDecimal(cursor, balanceYears);
    segments.push({
      planetId: startPlanet.id,
      startDate: cursor,
      endDate: firstEnd,
      durationYears: balanceYears,
    });
    cursor = firstEnd;

    // Remaining dashas (cycle through from next index)
    let idx = (vIdx + 1) % 9;
    for (let cycle = 0; cycle < 9 * 2; cycle++) {
      // We generate up to ~240 years to fill the 120-year cycle fully
      const planet = VIMSHOTTARI_ORDER[idx];
      const end = addYearsDecimal(cursor, planet.years);
      segments.push({
        planetId: planet.id,
        startDate: cursor,
        endDate: end,
        durationYears: planet.years,
      });
      cursor = end;
      idx = (idx + 1) % 9;
      // Stop after we exceed 120 years from birth
      if ((cursor.getTime() - birthDateObj.getTime()) / (365.25 * 24 * 60 * 60 * 1000) > 130) break;
    }

    return {
      tropMoon,
      sidMoon,
      nakNum,
      nak,
      posInNak,
      degRemaining,
      vIdx,
      startPlanet,
      balanceYears,
      segments,
      birthDateObj,
    };
  }, [computed, birthDate, birthTime, location]);

  const today = new Date();

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-4">
            <Moon className="w-4 h-4" />
            <span>Lab 3</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent mb-3">
            {L.title[locale]}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">{L.subtitle[locale]}</p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm text-white/50 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />{L.birthDate[locale]}
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => { setBirthDate(e.target.value); setComputed(false); }}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />{L.birthTime[locale]}
              </label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => { setBirthTime(e.target.value); setComputed(false); }}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />{L.birthPlace[locale]}
              </label>
              <LocationSearch
                value={locationName}
                onSelect={(loc) => { setLocation(loc); setLocationName(loc.name); setComputed(false); }}
              />
            </div>
          </div>
          <button
            onClick={() => setComputed(true)}
            disabled={!location}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-black font-semibold hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {L.compute[locale]}
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Step 1: Moon Position */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                <h2 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm font-bold">1</span>
                  {L.step1[locale]}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-xs text-white/40 mb-1">{L.moonLong[locale]}</div>
                    <div className="text-2xl font-mono text-white">{result.tropMoon.toFixed(4)}&deg;</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-xs text-white/40 mb-1">{L.moonSid[locale]}</div>
                    <div className="text-2xl font-mono text-amber-300">{result.sidMoon.toFixed(4)}&deg;</div>
                  </div>
                </div>
                {/* Visual: position in nakshatra */}
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-xs text-white/40 mb-2">{L.nakshatra[locale]}: <span className="text-amber-300">{result.nak.name[locale]}</span> (#{result.nakNum})</div>
                  <div className="relative h-6 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-amber-500/60 to-amber-400/30"
                      style={{ width: `${(result.posInNak / NAK_SPAN) * 100}%` }}
                    />
                    <div
                      className="absolute top-0 h-full w-0.5 bg-amber-300"
                      style={{ left: `${(result.posInNak / NAK_SPAN) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/30 mt-1 font-mono">
                    <span>{((result.nakNum - 1) * NAK_SPAN).toFixed(1)}&deg;</span>
                    <span>{result.sidMoon.toFixed(2)}&deg;</span>
                    <span>{(result.nakNum * NAK_SPAN).toFixed(1)}&deg;</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Nakshatra Lord */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                <h2 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm font-bold">2</span>
                  {L.step2[locale]}
                </h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center min-w-[120px]">
                    <div className="text-xs text-white/40 mb-1">{L.nakshatra[locale]}</div>
                    <div className="text-lg font-semibold text-white">{result.nak.name[locale]}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30" />
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center min-w-[120px]">
                    <div className="text-xs text-white/40 mb-1">{L.lord[locale]}</div>
                    <div className="text-lg font-semibold" style={{ color: DASHA_COLORS[result.startPlanet.id] }}>
                      {GRAHAS[result.startPlanet.id].symbol} {GRAHAS[result.startPlanet.id].name[locale]}
                    </div>
                    <div className="text-xs text-white/40 mt-1">{result.startPlanet.years} {L.years[locale]}</div>
                  </div>
                </div>
                {/* Nakshatra-lord mapping table */}
                <div className="mt-4 grid grid-cols-9 gap-1 text-center text-xs">
                  {VIMSHOTTARI_ORDER.map((v, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg ${i === result.vIdx ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-white/5 border border-white/5'}`}
                    >
                      <div className="text-lg">{GRAHAS[v.id].symbol}</div>
                      <div className={i === result.vIdx ? 'text-amber-300 font-bold' : 'text-white/50'}>{v.years}yr</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Balance Calculation */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                <h2 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm font-bold">3</span>
                  {L.step3[locale]}
                </h2>
                <div className="p-4 rounded-xl bg-black/30 border border-white/10 font-mono text-sm mb-4">
                  <div className="text-white/40 mb-2">{L.formula[locale]}:</div>
                  <div className="text-amber-200">
                    balance = (degRemaining / nakSpan) &times; fullPeriod
                  </div>
                  <div className="text-white/60 mt-2">
                    = ({result.degRemaining.toFixed(4)} / {NAK_SPAN.toFixed(4)}) &times; {result.startPlanet.years}
                  </div>
                  <div className="text-white/60">
                    = {(result.degRemaining / NAK_SPAN).toFixed(6)} &times; {result.startPlanet.years}
                  </div>
                  <div className="text-amber-300 text-lg mt-2 font-bold">
                    = {result.balanceYears.toFixed(4)} {L.years[locale]}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-xs text-white/40 mb-1">{L.remaining[locale]}</div>
                    <div className="text-xl font-mono text-white">{result.degRemaining.toFixed(4)}&deg;</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-xs text-white/40 mb-1">{L.balance[locale]}</div>
                    <div className="text-xl font-mono text-amber-300">{formatDuration(result.balanceYears, locale)}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-xs text-white/40 mb-1">{GRAHAS[result.startPlanet.id].name[locale]} Dasha Ends</div>
                    <div className="text-xl font-mono text-white">{formatDate(result.segments[0].endDate)}</div>
                  </div>
                </div>
              </div>

              {/* Step 4: Full Timeline */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                <h2 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm font-bold">4</span>
                  {L.step4[locale]}
                </h2>

                {/* Horizontal bar chart */}
                <div className="mb-6">
                  <div className="flex rounded-xl overflow-hidden h-12 border border-white/10">
                    {result.segments.map((seg, i) => {
                      const totalSpan = result.segments[result.segments.length - 1].endDate.getTime() - result.birthDateObj.getTime();
                      const segSpan = seg.endDate.getTime() - seg.startDate.getTime();
                      const pct = (segSpan / totalSpan) * 100;
                      const isCurrent = today >= seg.startDate && today < seg.endDate;
                      return (
                        <div
                          key={i}
                          className="relative flex items-center justify-center text-xs font-bold overflow-hidden transition-all hover:brightness-125"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: DASHA_COLORS[seg.planetId] + (isCurrent ? 'cc' : '55'),
                            borderRight: i < result.segments.length - 1 ? '1px solid rgba(255,255,255,0.1)' : undefined,
                          }}
                          title={`${GRAHAS[seg.planetId].name.en}: ${formatDate(seg.startDate)} - ${formatDate(seg.endDate)}`}
                        >
                          {pct > 4 && (
                            <span className="text-black/70 drop-shadow-sm">
                              {GRAHAS[seg.planetId].symbol}
                            </span>
                          )}
                          {isCurrent && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Today marker */}
                  <div className="relative h-4 mt-1">
                    {(() => {
                      const totalSpan = result.segments[result.segments.length - 1].endDate.getTime() - result.birthDateObj.getTime();
                      const todayOffset = today.getTime() - result.birthDateObj.getTime();
                      const pct = Math.min(Math.max((todayOffset / totalSpan) * 100, 0), 100);
                      return (
                        <div className="absolute text-xs text-amber-300 font-mono whitespace-nowrap" style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}>
                          &darr; {locale === 'en' ? 'Today' : locale === 'hi' ? 'आज' : 'अद्य'}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Detailed table */}
                <div className="space-y-2">
                  {result.segments.map((seg, i) => {
                    const isCurrent = today >= seg.startDate && today < seg.endDate;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                          style={{ backgroundColor: DASHA_COLORS[seg.planetId] + '30' }}
                        >
                          {GRAHAS[seg.planetId].symbol}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white flex items-center gap-2">
                            {GRAHAS[seg.planetId].name[locale]}
                            {i === 0 && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">PARTIAL</span>}
                            {isCurrent && <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 animate-pulse">{L.current[locale]}</span>}
                          </div>
                          <div className="text-xs text-white/40">
                            {formatDate(seg.startDate)} &mdash; {formatDate(seg.endDate)}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-mono text-white/70">{formatDuration(seg.durationYears, locale)}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
