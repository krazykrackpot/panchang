'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Calendar, Clock, MapPin, Trophy, Crown } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { GRAHAS } from '@/lib/constants/grahas';
import type { Locale } from '@/types/panchang';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';

// ── Labels ──────────────────────────────────────────────────────
const L = {
  title: { en: 'Lab: Shadbala Breakdown', hi: 'प्रयोगशाला: षड्बल विश्लेषण', sa: 'प्रयोगशाला: षड्बलविश्लेषणम्' },
  subtitle: { en: 'Six sources of planetary strength — computed for your birth chart', hi: 'ग्रह बल के छह स्रोत — आपकी जन्म कुण्डली के लिए गणित', sa: 'ग्रहबलस्य षट् स्रोतांसि — भवतः जन्मकुण्डल्यै गणितानि' },
  birthDate: { en: 'Birth Date', hi: 'जन्म तिथि', sa: 'जन्मतिथिः' },
  birthTime: { en: 'Birth Time', hi: 'जन्म समय', sa: 'जन्मसमयः' },
  birthPlace: { en: 'Birth Place', hi: 'जन्म स्थान', sa: 'जन्मस्थानम्' },
  compute: { en: 'Compute Shadbala', hi: 'षड्बल गणना करें', sa: 'षड्बलगणनां कुरु' },
  sthana: { en: 'Sthana Bala', hi: 'स्थान बल', sa: 'स्थानबलम्' },
  dig: { en: 'Dig Bala', hi: 'दिग् बल', sa: 'दिग्बलम्' },
  kala: { en: 'Kala Bala', hi: 'काल बल', sa: 'कालबलम्' },
  cheshta: { en: 'Cheshta Bala', hi: 'चेष्टा बल', sa: 'चेष्टाबलम्' },
  naisargika: { en: 'Naisargika Bala', hi: 'नैसर्गिक बल', sa: 'नैसर्गिकबलम्' },
  drik: { en: 'Drik Bala', hi: 'दृक् बल', sa: 'दृक्बलम्' },
  total: { en: 'Total (Rupas)', hi: 'कुल (रूप)', sa: 'कुलम् (रूपाणि)' },
  ranking: { en: 'Planet Ranking by Shadbala', hi: 'षड्बल द्वारा ग्रह क्रम', sa: 'षड्बलेन ग्रहक्रमः' },
  captain: { en: 'Chart Captain', hi: 'कुण्डली कप्तान', sa: 'कुण्डलीनायकः' },
  captainDesc: { en: 'Strongest planet — dominates the chart', hi: 'सबसे शक्तिशाली ग्रह — कुण्डली पर प्रभुत्व', sa: 'बलिष्ठः ग्रहः — कुण्डलीम् अधिशास्ति' },
  minRequired: { en: 'Min Required', hi: 'न्यूनतम आवश्यक', sa: 'न्यूनतमम् आवश्यकम्' },
  rupas: { en: 'rupas', hi: 'रूप', sa: 'रूपाणि' },
  strength: { en: 'Strength Ratio', hi: 'बल अनुपात', sa: 'बलानुपातम्' },
  sixBala: { en: 'Six Strength Sources', hi: 'बल के छह स्रोत', sa: 'बलस्य षट् स्रोतांसि' },
  sthanaDesc: { en: 'Positional: exaltation, own sign, etc.', hi: 'स्थितिजन्य: उच्च, स्वगृह आदि', sa: 'स्थानजम्: उच्चं, स्वगृहम् इत्यादि' },
  digDesc: { en: 'Directional: placement in kendras', hi: 'दिशाजन्य: केन्द्र में स्थिति', sa: 'दिग्जम्: केन्द्रेषु स्थितिः' },
  kalaDesc: { en: 'Temporal: day/night, paksha, hora', hi: 'कालजन्य: दिन/रात्रि, पक्ष, होरा', sa: 'कालजम्: दिनरात्रिः, पक्षः, होरा' },
  cheshtaDesc: { en: 'Motional: speed, retrograde', hi: 'गतिजन्य: गति, वक्री', sa: 'चेष्टाजम्: गतिः, वक्रगतिः' },
  naisargikaDesc: { en: 'Natural: inherent strength', hi: 'स्वाभाविक: सहज बल', sa: 'नैसर्गिकम्: सहजबलम्' },
  drikDesc: { en: 'Aspectual: aspects received', hi: 'दृष्टिजन्य: प्राप्त दृष्टियाँ', sa: 'दृक्जम्: प्राप्तदृष्टयः' },
};

const BALA_KEYS: { key: keyof Pick<ShadBalaComplete, 'sthanaBala' | 'digBala' | 'kalaBala' | 'cheshtaBala' | 'naisargikaBala' | 'drikBala'>; label: keyof typeof L; desc: keyof typeof L; color: string }[] = [
  { key: 'sthanaBala', label: 'sthana', desc: 'sthanaDesc', color: '#e67e22' },
  { key: 'digBala', label: 'dig', desc: 'digDesc', color: '#3498db' },
  { key: 'kalaBala', label: 'kala', desc: 'kalaDesc', color: '#9b59b6' },
  { key: 'cheshtaBala', label: 'cheshta', desc: 'cheshtaDesc', color: '#e74c3c' },
  { key: 'naisargikaBala', label: 'naisargika', desc: 'naisargikaDesc', color: '#2ecc71' },
  { key: 'drikBala', label: 'drik', desc: 'drikDesc', color: '#f39c12' },
];

interface LocationResult { name: string; lat: number; lng: number; timezone: string }

function getBarColor(rupas: number): string {
  if (rupas >= 1.0) return '#22c55e';
  if (rupas >= 0.7) return '#eab308';
  return '#ef4444';
}

export default function ShadbalaLabPage() {
  const locale = useLocale() as Locale;
  const [birthDate, setBirthDate] = useState('1990-01-15');
  const [birthTime, setBirthTime] = useState('06:00');
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [locationName, setLocationName] = useState('');
  const [computed, setComputed] = useState(false);

  const result = useMemo(() => {
    if (!computed || !location) return null;
    const [year, month, day] = birthDate.split('-').map(Number);
    const tzOffset = getUTCOffsetForDate(year, month, day, location.timezone);

    const kundali = generateKundali({
      name: 'Lab User',
      date: birthDate,
      time: birthTime,
      place: location.name,
      lat: location.lat,
      lng: location.lng,
      timezone: location.timezone,
      ayanamsha: 'lahiri',
    });

    const shadbala = kundali.fullShadbala;
    if (!shadbala || shadbala.length === 0) return null;

    // Sort by rupas for ranking
    const ranked = [...shadbala].sort((a, b) => b.rupas - a.rupas);
    const captain = ranked[0];

    // Find max value for scaling bars
    const maxBala = Math.max(...shadbala.flatMap(s => [s.sthanaBala, s.digBala, s.kalaBala, s.cheshtaBala, s.naisargikaBala, Math.abs(s.drikBala)]));

    return { shadbala, ranked, captain, maxBala };
  }, [computed, birthDate, birthTime, location]);

  return (
    <main className="min-h-screen bg-[#0a0e27] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm mb-4">
            <Gauge className="w-4 h-4" />
            <span>Lab 4</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-200 via-green-100 to-emerald-200 bg-clip-text text-transparent mb-3">
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
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500/50 focus:outline-none"
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
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500/50 focus:outline-none"
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
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-black font-semibold hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
              {/* Chart Captain */}
              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-md p-6 flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Crown className="w-8 h-8 text-amber-300" />
                </div>
                <div>
                  <div className="text-sm text-amber-300/70 mb-0.5">{L.captain[locale]}</div>
                  <div className="text-2xl font-bold text-amber-200 flex items-center gap-2">
                    <span className="text-3xl">{GRAHAS[result.captain.planetId].symbol}</span>
                    {GRAHAS[result.captain.planetId].name[locale]}
                    <span className="text-lg font-mono text-amber-300/60 ml-2">{result.captain.rupas.toFixed(2)} {L.rupas[locale]}</span>
                  </div>
                  <div className="text-xs text-white/40 mt-1">{L.captainDesc[locale]}</div>
                </div>
              </div>

              {/* Six-Bala Legend */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                <h2 className="text-lg font-bold text-emerald-300 mb-4">{L.sixBala[locale]}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {BALA_KEYS.map((b) => (
                    <div key={b.key} className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                      <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: b.color }} />
                      <div className="text-sm font-semibold text-white">{L[b.label][locale]}</div>
                      <div className="text-[10px] text-white/40 mt-1">{L[b.desc][locale]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-planet breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {result.shadbala.map((sb, idx) => {
                  const graha = GRAHAS[sb.planetId];
                  const barMax = result.maxBala * 1.1;
                  const totalColor = getBarColor(sb.rupas);
                  return (
                    <motion.div
                      key={sb.planetId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5"
                    >
                      {/* Planet header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{graha.symbol}</span>
                          <div>
                            <div className="font-bold text-white">{graha.name[locale]}</div>
                            <div className="text-xs text-white/40">Rank #{sb.rank}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-mono font-bold" style={{ color: totalColor }}>
                            {sb.rupas.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-white/30">{L.minRequired[locale]}: {sb.minRequired.toFixed(2)}</div>
                        </div>
                      </div>

                      {/* 6 bars */}
                      <div className="space-y-2">
                        {BALA_KEYS.map((b) => {
                          const val = sb[b.key];
                          const absVal = Math.abs(val);
                          const pct = Math.min((absVal / barMax) * 100, 100);
                          return (
                            <div key={b.key} className="flex items-center gap-2">
                              <div className="w-16 text-[10px] text-white/40 shrink-0 text-right">{L[b.label][locale]}</div>
                              <div className="flex-1 relative h-4 rounded-full bg-white/5 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ delay: idx * 0.06 + 0.2, duration: 0.5, ease: 'easeOut' as const }}
                                  className="absolute left-0 top-0 h-full rounded-full"
                                  style={{ backgroundColor: b.color + 'aa' }}
                                />
                                {/* Min threshold line */}
                                <div
                                  className="absolute top-0 h-full w-px bg-white/20"
                                  style={{ left: `${Math.min((sb.minRequired / 7 / barMax) * 100, 100)}%` }}
                                />
                              </div>
                              <div className="w-12 text-xs font-mono text-white/50 text-right">{val.toFixed(1)}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Total bar */}
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 text-[10px] text-white/60 shrink-0 text-right font-bold">{L.total[locale]}</div>
                          <div className="flex-1 relative h-5 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((sb.rupas / 3) * 100, 100)}%` }}
                              transition={{ delay: idx * 0.06 + 0.4, duration: 0.6, ease: 'easeOut' as const }}
                              className="absolute left-0 top-0 h-full rounded-full"
                              style={{ backgroundColor: totalColor + 'cc' }}
                            />
                            {/* Min required threshold */}
                            <div
                              className="absolute top-0 h-full w-0.5 bg-red-400/50"
                              style={{ left: `${Math.min((sb.minRequired / 3) * 100, 100)}%` }}
                            />
                          </div>
                          <div className="w-12 text-xs font-mono font-bold text-right" style={{ color: totalColor }}>{sb.rupas.toFixed(2)}</div>
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-white/20">
                          <span>{L.strength[locale]}: {sb.strengthRatio.toFixed(2)}x</span>
                          <span className={sb.rupas >= sb.minRequired ? 'text-emerald-400/50' : 'text-red-400/50'}>
                            {sb.rupas >= sb.minRequired ? 'ABOVE' : 'BELOW'} min
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Ranking Table */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                <h2 className="text-lg font-bold text-emerald-300 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  {L.ranking[locale]}
                </h2>
                <div className="space-y-2">
                  {result.ranked.map((sb, i) => {
                    const graha = GRAHAS[sb.planetId];
                    const pct = (sb.rupas / result.ranked[0].rupas) * 100;
                    const color = getBarColor(sb.rupas);
                    return (
                      <motion.div
                        key={sb.planetId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${
                          i === 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/[0.02] border-white/5'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-bold text-white/50">
                          #{i + 1}
                        </div>
                        <span className="text-xl">{graha.symbol}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-white">{graha.name[locale]}</div>
                          <div className="relative h-2 rounded-full bg-white/5 overflow-hidden mt-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: i * 0.05 + 0.3, duration: 0.5 }}
                              className="absolute left-0 top-0 h-full rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-lg font-mono font-bold" style={{ color }}>{sb.rupas.toFixed(2)}</div>
                          <div className="text-[10px] text-white/30">{sb.strengthRatio.toFixed(2)}x</div>
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
