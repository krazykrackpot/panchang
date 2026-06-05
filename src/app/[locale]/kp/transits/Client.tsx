'use client';

/**
 * /kp/transits client — displays the 7 RPs for a location, with a
 * location picker and a 60s refresh interval.
 *
 * Lesson ZD compliance:
 *   - Server pre-renders RPs at SSR moment + visitor's IP-resolved location.
 *   - Client mounts with that exact server snapshot as initial state (NO
 *     useState initializer that reads `new Date()` — Lesson ZD §3).
 *   - useEffect installs a setInterval(60_000) that calls getCurrentRPsAction.
 *   - Switching location triggers immediate refresh.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §4
 */

import { useState, useEffect, useCallback, useTransition } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, MapPin } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { tl } from '@/lib/utils/trilingual';
import KpNavStrip from '@/components/kp/KpNavStrip';
import { getCurrentRPsAction, type ClientRulingNowResult } from './actions';

const REFRESH_INTERVAL_MS = 60_000;

const T: Record<string, {
  title: string;
  subtitle: string;
  location: string;
  refresh: string;
  refreshing: string;
  computedAt: string;
  rulingPlanets: string;
  ascSign: string;
  ascStar: string;
  ascSub: string;
  moonSign: string;
  moonStar: string;
  moonSub: string;
  day: string;
  loadFailed: string;
  whatIsThis: string;
  whatIsThisBody: string;
}> = {
  en: {
    title: 'KP Transits',
    subtitle: 'Live 7 ruling planets for the current moment at your location. Refreshes every minute.',
    location: 'Location',
    refresh: 'Refresh now',
    refreshing: 'Refreshing…',
    computedAt: 'Computed at',
    rulingPlanets: 'Ruling Planets right now',
    ascSign: 'Asc Sign',
    ascStar: 'Asc Star',
    ascSub: 'Asc Sub',
    moonSign: 'Moon Sign',
    moonStar: 'Moon Star',
    moonSub: 'Moon Sub',
    day: 'Day',
    loadFailed: 'Failed to load ruling planets',
    whatIsThis: 'About KP Ruling Planets',
    whatIsThisBody: 'The 7 KP ruling planets describe the cosmic energies governing any given moment at a location. KP practitioners check the RPs throughout the day to fine-tune timing for important decisions: which dasha is currently active, which sub-lord rules the ascendant, what day-lord presides. When the RPs at a chosen moment harmonize with the natal RPs of an event, success is favoured.',
  },
  hi: {
    title: 'केपी गोचर',
    subtitle: 'अभी, आपके स्थान पर, ७ शासक ग्रहों की लाइव गणना। हर मिनट ताज़ा।',
    location: 'स्थान',
    refresh: 'अभी ताज़ा करें',
    refreshing: 'ताज़ा हो रहा है…',
    computedAt: 'गणना समय',
    rulingPlanets: 'अभी के शासक ग्रह',
    ascSign: 'लग्न राशि',
    ascStar: 'लग्न नक्षत्र',
    ascSub: 'लग्न उप',
    moonSign: 'चन्द्र राशि',
    moonStar: 'चन्द्र नक्षत्र',
    moonSub: 'चन्द्र उप',
    day: 'वार',
    loadFailed: 'शासक ग्रह लोड करने में त्रुटि',
    whatIsThis: 'केपी शासक ग्रह क्या हैं?',
    whatIsThisBody: '७ केपी शासक ग्रह किसी क्षण में स्थान पर शासन करने वाली ब्रह्मांडीय शक्तियों का वर्णन करते हैं।',
  },
};

function getT(locale: string) {
  return T[locale] ?? T.en;
}

interface InitialLocation {
  name: string;
  lat: number;
  lng: number;
  timezone: string;
}

export default function TransitsClient({
  locale,
  initialSnapshot,
  initialLocation,
}: {
  locale: string;
  initialSnapshot: ClientRulingNowResult | null;
  initialLocation: InitialLocation;
}) {
  const t = getT(locale);
  const [location, setLocation] = useState<InitialLocation>(initialLocation);
  const [snapshot, setSnapshot] = useState<ClientRulingNowResult | null>(initialSnapshot);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // useCallback gives a stable identity per (lat, lng, t.loadFailed)
  // tuple — exactly what useEffect needs to depend on. No more
  // eslint-disable shenanigans.
  const refresh = useCallback(
    (overrideLocation?: InitialLocation) => {
      const target = overrideLocation ?? location;
      setError(null);
      startTransition(async () => {
        try {
          const r = await getCurrentRPsAction({ lat: target.lat, lng: target.lng });
          setSnapshot(r);
        } catch (err) {
          console.error('[kp/transits] refresh failed:', err);
          setError(err instanceof Error ? err.message : t.loadFailed);
        }
      });
    },
    [location, t.loadFailed],
  );

  // 60s refresh — Lesson ZD compliant (no clock read in render body).
  // Re-runs only when the refresh callback's identity changes (i.e. when
  // location changes), which is the same gate we want for the interval.
  useEffect(() => {
    const id = setInterval(() => refresh(), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  const handleLocationChange = (l: InitialLocation) => {
    setLocation(l);
    refresh(l);
  };

  const rps = snapshot
    ? [
        { label: t.ascSign,  planet: snapshot.rulingPlanets.ascSignLord },
        { label: t.ascStar,  planet: snapshot.rulingPlanets.ascStarLord },
        { label: t.ascSub,   planet: snapshot.rulingPlanets.ascSubLord },
        { label: t.moonSign, planet: snapshot.rulingPlanets.moonSignLord },
        { label: t.moonStar, planet: snapshot.rulingPlanets.moonStarLord },
        { label: t.moonSub,  planet: snapshot.rulingPlanets.moonSubLord },
        { label: t.day,      planet: snapshot.rulingPlanets.dayLord },
      ]
    : [];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-light mb-3">{t.title}</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">{t.subtitle}</p>
        </header>

        <KpNavStrip current="transits" locale={locale} />

        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-text-secondary text-sm mb-2 flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {t.location}
            </label>
            <LocationSearch
              value={location.name}
              onSelect={(l) => handleLocationChange({
                name: l.name,
                lat: l.lat,
                lng: l.lng,
                timezone: l.timezone,
              })}
              placeholder={locale === 'hi' ? 'नगर खोजें…' : 'Search city or place…'}
            />
            <p className="text-text-secondary/70 text-xs mt-1.5">
              {location.name} · {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => refresh()}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/15 hover:bg-gold-primary/25 disabled:opacity-50 border border-gold-primary/30 text-gold-light font-medium transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
            {isPending ? t.refreshing : t.refresh}
          </button>
        </div>

        {error && (
          <div role="alert" className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {snapshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={snapshot.computedAtUtc.toISOString()}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gold-light">{t.rulingPlanets}</h2>
              <p className="text-text-secondary/70 text-xs">
                {t.computedAt}: {snapshot.computedAtUtc.toISOString().slice(11, 19)} UTC
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {rps.map((rp) => (
                <div
                  key={rp.label}
                  className="rounded-xl p-3 bg-gold-primary/5 border border-gold-primary/15 text-center"
                >
                  <GrahaIconById id={rp.planet.id} size={30} />
                  <p className="text-gold-light font-bold text-sm mt-2">
                    {tl(rp.planet.name, locale)}
                  </p>
                  <p className="text-text-secondary text-xs mt-0.5">{rp.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gold-light mb-3">{t.whatIsThis}</h2>
          <p className="text-text-secondary text-sm leading-relaxed">{t.whatIsThisBody}</p>
        </div>
      </div>
    </div>
  );
}
