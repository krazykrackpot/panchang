'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { RASHIS } from '@/lib/constants/rashis';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { authedFetch } from '@/lib/api/authed-fetch';
import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PersonalizedHoroscopeProps {
  locale: string;
  lat?: number;
  lng?: number;
  timezone?: string;
}

interface ChartSnapshot {
  ascendantSign: number;
  moonSign: number;
  mahaDasha: string | null;
  antarDasha: string | null;
  savTable: number[];
  keyYogas: string[];
  keyDoshas: string[];
}

interface ForecastData {
  forecast: string;
  transitScores: { planetId: number; sign: number; sav: number }[];
  moonHouse: number;
}

// Slow planets for transit quality dots: Jupiter(4), Saturn(5), Rahu(7), Ketu(8)
const SLOW_PLANETS = [
  { id: 4, label: 'Ju' },
  { id: 5, label: 'Sa' },
  { id: 7, label: 'Ra' },
  { id: 8, label: 'Ke' },
];

const LABELS = {
  en: {
    heading: 'Your Daily Reading',
    dasha: 'Dasha',
    moonIn: 'Moon in',
    house: 'house',
    transits: 'Transit Quality',
    loading: 'Reading your stars...',
    noChart: 'Generate your birth chart to unlock personalized daily readings.',
    ctaGenerate: 'Create Kundali',
    fallback: 'Align with the rhythm of the cosmos today. Observe the transits and trust the flow of your current dasha period.',
  },
  hi: {
    heading: 'आपका दैनिक पठन',
    dasha: 'दशा',
    moonIn: 'चन्द्र',
    house: 'भाव',
    transits: 'गोचर गुणवत्ता',
    loading: 'आपके नक्षत्र पढ़ रहे हैं...',
    noChart: 'व्यक्तिगत दैनिक पठन के लिए अपनी कुण्डली बनाएं।',
    ctaGenerate: 'कुण्डली बनाएं',
    fallback: 'आज ब्रह्माण्ड की लय के साथ चलें। गोचर देखें और अपनी दशा अवधि के प्रवाह पर विश्वास रखें।',
  },
  sa: {
    heading: 'भवतः दैनिकं पठनम्',
    dasha: 'दशा',
    moonIn: 'चन्द्रः',
    house: 'भावः',
    transits: 'गोचरगुणः',
    loading: 'भवतः नक्षत्राणि पठ्यन्ते...',
    noChart: 'व्यक्तिगतदैनिकपठनाय स्वकुण्डलीं रचयतु।',
    ctaGenerate: 'कुण्डली रचयतु',
    fallback: 'अद्य विश्वस्य लयेन सह चलतु। गोचरान् पश्यतु दशाकालस्य प्रवाहे विश्वसतु।',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function extractSnapshot(kundali: KundaliData): ChartSnapshot {
  const now = new Date();
  const moonPlanet = kundali.planets.find((p) => p.planet.id === 1);

  // Find current maha and antar dasha
  let mahaDasha: string | null = null;
  let antarDasha: string | null = null;
  for (const d of kundali.dashas) {
    if (d.level === 'maha' && new Date(d.startDate) <= now && now <= new Date(d.endDate)) {
      mahaDasha = d.planetName.en;
      if (d.subPeriods) {
        for (const sub of d.subPeriods) {
          if (new Date(sub.startDate) <= now && now <= new Date(sub.endDate)) {
            antarDasha = sub.planetName.en;
            break;
          }
        }
      }
      break;
    }
  }

  // Key yogas (first 3 present)
  const keyYogas: string[] = [];
  if (kundali.yogasComplete) {
    for (const y of kundali.yogasComplete) {
      if ((y as { present?: boolean }).present && keyYogas.length < 3) {
        keyYogas.push((y as { name?: { en?: string } }).name?.en || 'Yoga');
      }
    }
  }

  // Key doshas
  const keyDoshas: string[] = [];
  if ('mangalDosha' in kundali && kundali.mangalDosha) keyDoshas.push('Mangal Dosha');
  if ('kalaSarpa' in kundali && kundali.kalaSarpa) keyDoshas.push('Kala Sarpa');

  return {
    ascendantSign: kundali.ascendant.sign,
    moonSign: moonPlanet?.sign || 1,
    mahaDasha,
    antarDasha,
    savTable: kundali.ashtakavarga?.savTable || new Array(12).fill(25),
    keyYogas,
    keyDoshas,
  };
}

function savColor(sav: number): string {
  if (sav >= 28) return 'bg-emerald-400';
  if (sav >= 22) return 'bg-amber-400';
  return 'bg-red-400';
}

function savLabel(sav: number): string {
  if (sav >= 28) return 'Strong';
  if (sav >= 22) return 'Mixed';
  return 'Challenging';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PersonalizedHoroscope({
  locale,
  lat,
  lng,
  timezone,
}: PersonalizedHoroscopeProps) {
  const loc = (locale || 'en') as Locale;
  const L = (LABELS as Record<string, typeof LABELS.en>)[loc] || LABELS.en;

  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load kundali from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('kundali-data');
      if (raw) {
        setKundali(JSON.parse(raw) as KundaliData);
      }
    } catch {
      // sessionStorage unavailable or corrupt — no kundali
    }
    setLoading(false);
  }, []);

  // Fetch personalized forecast
  const fetchForecast = useCallback(async (k: KundaliData) => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = extractSnapshot(k);
      const res = await authedFetch('/api/horoscope/personalized', {
        method: 'POST',
        body: JSON.stringify({
          chart: snapshot,
          lat,
          lng,
          timezone,
          locale: loc,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as ForecastData;
        setForecast(data);
      } else {
        // Use fallback forecast
        const snapshot2 = extractSnapshot(k);
        setForecast({
          forecast: L.fallback,
          transitScores: SLOW_PLANETS.map((p) => ({
            planetId: p.id,
            sign: snapshot2.ascendantSign,
            sav: snapshot2.savTable[(snapshot2.ascendantSign - 1) % 12] ?? 25,
          })),
          moonHouse: 1,
        });
      }
    } catch {
      setError('Could not load forecast');
      setForecast({
        forecast: L.fallback,
        transitScores: [],
        moonHouse: 1,
      });
    } finally {
      setLoading(false);
    }
  }, [lat, lng, timezone, loc, L.fallback]);

  useEffect(() => {
    if (kundali) {
      fetchForecast(kundali);
    }
  }, [kundali, fetchForecast]);

  const snapshot = kundali ? extractSnapshot(kundali) : null;
  const rashiName = (sign: number) => RASHIS[(sign - 1) % 12]?.name?.[loc] || RASHIS[(sign - 1) % 12]?.name?.en || '';

  // --- No kundali CTA ---
  if (!loading && !kundali) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 via-bg-secondary to-bg-secondary p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-gold-light">{L.heading}</h3>
        </div>
        <p className="text-text-secondary text-sm mb-4">{L.noChart}</p>
        <Link
          href={`/${loc}/kundali`}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600/30 border border-purple-500/30 px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-600/50 transition-colors"
        >
          {L.ctaGenerate}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    );
  }

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 via-bg-secondary to-bg-secondary p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 rounded bg-purple-500/20" />
          <div className="h-5 w-36 rounded bg-purple-500/15" />
        </div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-28 rounded-full bg-purple-500/10" />
          <div className="h-6 w-24 rounded-full bg-purple-500/10" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full rounded bg-purple-500/10" />
          <div className="h-4 w-5/6 rounded bg-purple-500/10" />
          <div className="h-4 w-4/6 rounded bg-purple-500/10" />
        </div>
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 w-3 rounded-full bg-purple-500/10" />
          ))}
        </div>
      </div>
    );
  }

  // --- Main forecast card ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 via-bg-secondary to-bg-secondary p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-gold-light">{L.heading}</h3>
      </div>

      {/* Badges: Dasha + Moon transit */}
      <div className="flex flex-wrap gap-2 mb-4">
        {snapshot?.mahaDasha && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-600/20 border border-purple-500/25 px-3 py-1 text-xs font-medium text-purple-300">
            {L.dasha}: {snapshot.mahaDasha}
            {snapshot.antarDasha ? ` / ${snapshot.antarDasha}` : ''}
          </span>
        )}
        {forecast?.moonHouse && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/25 px-3 py-1 text-xs font-medium text-indigo-300">
            {L.moonIn} {rashiName(snapshot?.moonSign || 1)} &middot; {forecast.moonHouse}{' '}
            {L.house}
          </span>
        )}
      </div>

      {/* Forecast text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={forecast?.forecast?.slice(0, 20) || 'empty'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-text-primary text-sm leading-relaxed mb-5"
        >
          {forecast?.forecast || L.fallback}
        </motion.p>
      </AnimatePresence>

      {/* Transit quality indicators */}
      {forecast?.transitScores && forecast.transitScores.length > 0 && (
        <div>
          <p className="text-text-secondary text-xs mb-2 uppercase tracking-wider">
            {L.transits}
          </p>
          <div className="flex items-center gap-4">
            {forecast.transitScores.map((t) => {
              const planet = SLOW_PLANETS.find((p) => p.id === t.planetId);
              return (
                <div key={t.planetId} className="flex items-center gap-1.5" title={savLabel(t.sav)}>
                  <GrahaIconById id={t.planetId} size={16} className="opacity-70" />
                  <span className={`h-2.5 w-2.5 rounded-full ${savColor(t.sav)}`} />
                  <span className="text-text-secondary text-[10px]">
                    {planet?.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error notice (subtle) */}
      {error && (
        <p className="text-red-400/70 text-xs mt-3">{error}</p>
      )}
    </motion.div>
  );
}
