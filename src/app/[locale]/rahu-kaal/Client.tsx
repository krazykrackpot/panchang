'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, MapPin, ArrowLeft, Shield, ShieldAlert, ShieldOff } from 'lucide-react';
import { nowMinutesInTimezone, todayInTimezone } from '@/lib/utils/now-in-timezone';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import {
  calculateRahuKaal,
  calculateYamaganda,
  calculateGulikaKaal,
  formatTime,
} from '@/lib/ephem/astronomical';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { getDefaultCityForLocale } from '@/lib/constants/rashi-slugs';
import { useLocationStore } from '@/stores/location-store';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

// ─── City selector list ────────────────────────────────────────
const CITY_SLUGS = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'varanasi'] as const;
const SELECTOR_CITIES = CITY_SLUGS.map(s => CITIES.find(c => c.slug === s)!).filter(Boolean);

// ─── Labels ────────────────────────────────────────────────────
/**
 * LABELS are now resolved via the shared `pickRahuLabel(key, locale)`
 * helper which sources canonical en/hi/sa from baby-names-labels.ts
 * and falls back to the Gemini-translated overlay for the 6 regional
 * Indic locales (mai/mr/te/kn/gu/bn).
 *
 * The `L` proxy keeps the existing `L.whatIs` / `L.whatIsText` /
 * `L.avoidItems` call sites working with minimal diff.
 */
import { pickRahuLabel } from '@/lib/content/rahu-kaal-labels';

// ─── Animation variants ────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

// ─── Helpers ───────────────────────────────────────────────────
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export default function RahuKaalClient() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  // Proxy so existing `L.whatIsText` / `L.avoidItems` / etc. call sites
  // (24 of them, scattered through this 500-line file) read via the
  // unified pickRahuLabel(key, locale) helper without a sweep.
  const L = new Proxy({} as Record<string, string>, {
    get: (_t, key: string) => pickRahuLabel(key, locale),
  });

  // Default to user's current location if available, otherwise fall back to locale-based city
  const locationStore = useLocationStore();
  const initialCity = (): CityData => {
    if (locationStore.lat !== null && locationStore.lng !== null) {
      return {
        slug: 'current',
        name: { en: locationStore.name || 'Current Location', hi: locationStore.name || 'वर्तमान स्थान', sa: locationStore.name || 'वर्तमानस्थानम्' },
        lat: locationStore.lat,
        lng: locationStore.lng,
        timezone: locationStore.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      };
    }
    return getDefaultCityForLocale(locale) || SELECTOR_CITIES[0];
  };
  const [selectedCity, setSelectedCity] = useState<CityData>(initialCity);

  // Track current time in the LOCATION's timezone for NOW highlighting
  const [nowMin, setNowMin] = useState(() => nowMinutesInTimezone(selectedCity.timezone));
  useEffect(() => {
    setNowMin(nowMinutesInTimezone(selectedCity.timezone));
    const iv = setInterval(() => setNowMin(nowMinutesInTimezone(selectedCity.timezone)), 60_000);
    return () => clearInterval(iv);
  }, [selectedCity.timezone]);

  // Round 2 TZ-7 — read "today" in the selected city's timezone, not the
  // browser's. A user in Geneva at 23:30 viewing Delhi panchang would
  // otherwise see the previous Geneva day's panchang for Delhi (which is
  // already next-day in Delhi). The helper already exists for this exact
  // case. (Gemini #162 — single-line destructure for consistency with
  // panchak/chandra-darshan.)
  const [year, month, day] = todayInTimezone(selectedCity.timezone).split('-').map(Number);

  // Sunrise/sunset via /api/sunrise — same server-Swiss path as the
  // gauri-panchang, choghadiya, and hora consumers. Avoids the
  // in-browser Meeus fallback that drifts ~30s from server output
  // and would otherwise misalign with any SEO copy server-rendered
  // for this surface. `null` is the polar non-rise signal — surface a
  // banner via sunError; never fabricate a fallback.
  type SunData = { sunriseUT: number; sunsetUT: number } | null;
  const [sunData, setSunData] = useState<SunData>(null);
  const [sunError, setSunError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const url =
      `/api/sunrise?date=${date}` +
      `&lat=${selectedCity.lat}&lng=${selectedCity.lng}` +
      `&timezone=${encodeURIComponent(selectedCity.timezone)}`;
    setSunError(null);
    fetch(url)
      .then(r => r.json())
      .then(body => {
        if (cancelled) return;
        if (typeof body.sunriseUT !== 'number' || typeof body.sunsetUT !== 'number') {
          setSunData(null);
          setSunError('Sunrise/sunset unavailable for this location and date.');
          return;
        }
        // East-of-UTC cities (Delhi etc.) have sunriseUT on the previous
        // UT day (~23.88) and sunsetUT on the current UT day (~13.77).
        // Unwrap so dayDuration = sunsetUT - sunriseUT stays positive,
        // mirroring the in-engine fix at panchang-calc.ts:1129.
        const sunriseUT = body.sunriseUT;
        let sunsetUT = body.sunsetUT;
        if (sunsetUT < sunriseUT) sunsetUT += 24;
        setSunData({ sunriseUT, sunsetUT });
      })
      .catch((err: unknown) => {
        console.error('[rahu-kaal] /api/sunrise failed:', err);
        if (!cancelled) setSunError('Could not fetch sunrise/sunset.');
      });
    return () => { cancelled = true; };
  }, [year, month, day, selectedCity.lat, selectedCity.lng, selectedCity.timezone]);

  // Derive the data the UI consumes — sunrise / sunset display strings
  // and the three inauspicious 1/8-day periods — from the API response.
  // While sunData is null (first paint / cold fetch / fetch error) we
  // hand back a stable empty-string skeleton so the time-axis math
  // below short-circuits to zero-width segments and the page paints
  // without throwing.
  const panchang = useMemo(() => {
    const empty = {
      sunrise: '',
      sunset: '',
      rahuKaal: { start: '', end: '' },
      yamaganda: { start: '', end: '' },
      gulikaKaal: { start: '', end: '' },
    };
    if (!sunData) return empty;
    const tzOffset = getUTCOffsetForDate(year, month, day, selectedCity.timezone);
    // Weekday in JD convention (0=Sun..6=Sat) — see CLAUDE.md Lesson O.
    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    const rk = calculateRahuKaal(sunData.sunriseUT, sunData.sunsetUT, weekday);
    const ym = calculateYamaganda(sunData.sunriseUT, sunData.sunsetUT, weekday);
    const gk = calculateGulikaKaal(sunData.sunriseUT, sunData.sunsetUT, weekday);
    return {
      sunrise: formatTime(sunData.sunriseUT, tzOffset),
      sunset: formatTime(sunData.sunsetUT, tzOffset),
      rahuKaal: { start: formatTime(rk.start, tzOffset), end: formatTime(rk.end, tzOffset) },
      yamaganda: { start: formatTime(ym.start, tzOffset), end: formatTime(ym.end, tzOffset) },
      gulikaKaal: { start: formatTime(gk.start, tzOffset), end: formatTime(gk.end, tzOffset) },
    };
  }, [sunData, year, month, day, selectedCity.timezone]);

  // Date formatting
  const dateStr = useMemo(() => {
    const d = new Date(year, month - 1, day);
    const LOCALE_MAP: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', sa: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', kn: 'kn-IN', gu: 'gu-IN', mai: 'hi-IN', mr: 'mr-IN' };
    const loc = LOCALE_MAP[locale] || 'en-IN';
    return d.toLocaleDateString(loc, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [year, month, day, locale]);

  // Timeline calculation
  const sunriseMin = timeToMinutes(panchang.sunrise);
  const sunsetMin = timeToMinutes(panchang.sunset);
  const dayDuration = sunsetMin - sunriseMin;

  const timeCards = [
    {
      label: L.rahuKaal,
      start: panchang.rahuKaal.start,
      end: panchang.rahuKaal.end,
      icon: ShieldOff,
      colorClass: 'bg-red-500/10 border-red-500/30',
      textColor: 'text-red-400',
      badgeColor: 'bg-red-500/20 text-red-300',
      badgeText: L.inauspicious,
    },
    {
      label: L.yamaganda,
      start: panchang.yamaganda.start,
      end: panchang.yamaganda.end,
      icon: ShieldAlert,
      colorClass: 'bg-amber-500/10 border-amber-500/30',
      textColor: 'text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      badgeText: L.caution,
    },
    {
      label: L.gulika,
      start: panchang.gulikaKaal.start,
      end: panchang.gulikaKaal.end,
      icon: Shield,
      colorClass: 'bg-orange-500/10 border-orange-500/30',
      textColor: 'text-orange-400',
      badgeColor: 'bg-orange-500/20 text-orange-300',
      badgeText: L.caution,
    },
  ];

  // Timeline segments for Rahu Kaal, Yamaganda, Gulika
  const segments = [
    { start: panchang.rahuKaal.start, end: panchang.rahuKaal.end, color: 'bg-red-500/60', label: L.rahuKaal },
    { start: panchang.yamaganda.start, end: panchang.yamaganda.end, color: 'bg-amber-500/50', label: L.yamaganda },
    { start: panchang.gulikaKaal.start, end: panchang.gulikaKaal.end, color: 'bg-orange-500/50', label: L.gulika },
  ];

  const avoidItems = L.avoidItems.split('|');

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD('/rahu-kaal', locale)) }}
        />

        {/* Back link */}
        <Link
          href="/panchang"
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          {L.back}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h1
            className="text-3xl sm:text-4xl font-bold text-gold-light mb-2"
            style={headingFont}
          >
            {L.title}
          </h1>
          <p className="text-text-secondary text-lg">{dateStr}</p>
          <p className="text-text-secondary flex items-center gap-1.5 mt-1" suppressHydrationWarning>
            <MapPin size={14} className="text-gold-primary" />
            {tl(selectedCity.name, locale)}
          </p>
        </motion.div>

        {/* City selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' as const }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {SELECTOR_CITIES.map((city) => (
            <button
              key={city.slug}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedCity.slug === city.slug
                  ? 'bg-gold-primary/20 border border-gold-primary text-gold-light'
                  : 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-secondary hover:border-gold-primary/40 hover:text-text-primary'
              }`}
            >
              {tl(city.name, locale)}
            </button>
          ))}
        </motion.div>

        {/* Time cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {timeCards.map((card, i) => {
            const Icon = card.icon;
            const startMin = timeToMinutes(card.start);
            const endMin = timeToMinutes(card.end);
            // Midnight-wrapping comparison (Lesson R)
            const isActive = endMin < startMin
              ? nowMin >= startMin || nowMin < endMin
              : nowMin >= startMin && nowMin < endMin;
            return (
              <motion.div
                key={card.label}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className={`rounded-xl border p-5 ${card.colorClass} ${isActive ? 'ring-2 ring-gold-primary/60' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon size={20} className={card.textColor} />
                    <h2 className={`font-semibold ${card.textColor}`} style={headingFont}>
                      {card.label}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/30 text-gold-light font-bold animate-pulse" suppressHydrationWarning>
                        NOW
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                      {card.badgeText}
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-text-primary tracking-wide">
                  {card.start}  –  {card.end}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Visual timeline */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-xl border border-white/10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 mb-8"
        >
          <h2 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2">
            <Clock size={14} className="text-gold-primary" />
            {L.timeline} &mdash; {panchang.sunrise} ({L.sunrise}) &rarr; {panchang.sunset} ({L.sunset})
          </h2>
          <div className="relative h-8 rounded-full bg-white/5 overflow-hidden">
            {segments.map((seg) => {
              const startMin = timeToMinutes(seg.start);
              const endMin = timeToMinutes(seg.end);
              const leftPct = ((startMin - sunriseMin) / dayDuration) * 100;
              const widthPct = ((endMin - startMin) / dayDuration) * 100;
              return (
                <div
                  key={seg.label}
                  className={`absolute top-0 h-full ${seg.color} rounded-sm`}
                  style={{ left: `${Math.max(0, leftPct)}%`, width: `${Math.min(widthPct, 100 - leftPct)}%` }}
                  title={`${seg.label}: ${seg.start}  –  ${seg.end}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-secondary">
            <span>{panchang.sunrise}</span>
            <span>{panchang.sunset}</span>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-3">
            {segments.map((seg) => (
              <div key={seg.label} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className={`inline-block w-3 h-3 rounded-sm ${seg.color}`} />
                {seg.label}
              </div>
            ))}
          </div>
        </motion.div>

        <GoldDivider />

        {/* Educational section */}
        <motion.section
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="space-y-8 mt-4"
        >
          {/* What is Rahu Kaal */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              {L.whatIs}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.whatIsText}</p>
          </div>

          {/* How calculated */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              {L.howCalc}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.howCalcText}</p>
          </div>

          {/* Activities to avoid */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              <AlertTriangle size={18} className="inline-block mr-2 text-red-400 -mt-0.5" />
              {L.avoid}
            </h2>
            <ul className="space-y-2 ml-1">
              {avoidItems.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-text-primary">
                  <span className="text-red-400 mt-1.5 flex-shrink-0">&#8226;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        <GoldDivider className="mt-8" />

        {/* See Also */}
        <motion.section
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-4 mb-12"
        >
          <h2 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
            {L.seeAlso}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/choghadiya"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              Choghadiya
            </Link>
            <Link
              href="/panchang"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              {L.back}
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
