'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useLocationStore } from '@/stores/location-store';
import LocationSearch from '@/components/ui/LocationSearch';
import TithiMonthGrid, { type TithiDayData } from '@/components/calendar/TithiMonthGrid';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';
import MSG from '@/messages/pages/tithi.json';
import MonthlyContextStrip from '@/components/calendar/MonthlyContextStrip';
import { makeNatalContext, type MonthlyContext } from '@/types/tithi-calendar';
import TodayPanchangHeader from '@/components/calendar/TodayPanchangHeader';
import DayDetailPanel from '@/components/calendar/DayDetailPanel';
import TithiMonthList from '@/components/calendar/TithiMonthList';
import { FestivalIconDefs } from '@/components/icons/FestivalIcons';
import ExportCalendarButton from '@/components/calendar/ExportCalendarButton';
import { useFreshSnapshot } from '@/lib/supabase/get-fresh-snapshot-client';
import { fetchApiGeo } from '@/lib/utils/geo-from-api';
import type { Locale } from '@/types/panchang';
import type { LocaleText } from '@/types/panchang';

interface LocationData { lat: number; lng: number; name: string; timezone: string }

// YYYY-MM-DD anchored on local civil date (not UTC). Drives midnight-aware
// "today" handling.
function formatLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

// Native localised month-year heading via Intl. CLDR covers all 8 active
// locales (en/hi/ta/te/bn/gu/kn/mai) plus sa/mr fallbacks; missing data
// falls back to English silently rather than crashing.
function localMonthYear(year: number, monthIdx: number, locale: string): string {
  try {
    const d = new Date(year, monthIdx, 1);
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(d);
  } catch {
    const d = new Date(year, monthIdx, 1);
    return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(d);
  }
}

export default function TithiCalendarPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  // todayKey is the local civil date as YYYY-MM-DD. It ticks once per day so
  // `goToToday`, `isToday` matching, and the "viewing current month" check
  // stay accurate across midnight without requiring a manual page refresh.
  //
  // Initial value is an empty string so the first server render and the
  // first client render agree (avoids the hydration mismatch you'd get from
  // `new Date()` running at SSR time on UTC and at hydration time in the
  // user's tz). A client-only effect then fills in the real value.
  const [todayKey, setTodayKey] = useState<string>('');
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth()); // 0-indexed
  // Masa convention toggle: Amanta (new-moon-to-new-moon, South/West India,
  // global default) vs Purnimanta (full-moon-to-full-moon, North India).
  // The two diverge during Krishna Paksha — Purnimanta is one month ahead.
  const [masaConvention, setMasaConvention] = useState<'amanta' | 'purnimanta'>('amanta');
  const [todayYear, todayMonthRaw] = todayKey ? todayKey.split('-').map(Number) : [0, 0];
  const todayMonthIdx = todayMonthRaw; // 1-12 (not 0-indexed)
  // fetchGrid reads `todayStr` via this ref so changing `todayKey` (which
  // ticks once a day) doesn't invalidate the useCallback dependency array
  // and trigger an unnecessary re-fetch.
  const todayStrRef = useRef<string>('');
  todayStrRef.current = todayKey;
  // Seed todayKey on mount (client-only) and refresh whenever local midnight
  // ticks past. Same 60s cadence as the TodayPanchangHeader live "now" pill.
  useEffect(() => {
    setTodayKey(formatLocalDateKey(new Date()));
    const id = setInterval(() => {
      const next = formatLocalDateKey(new Date());
      setTodayKey((prev) => (prev === next ? prev : next));
    }, 60_000);
    return () => clearInterval(id);
  }, []);
  const [tithiData, setTithiData] = useState<TithiDayData[] | null>(null);
  const [meta, setMeta] = useState<MonthlyContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<TithiDayData | null>(null);
  // Surface fetch failures to the user instead of silent blank states
  // (review findings B1, B2). null means no error.
  const [gridError, setGridError] = useState<string | null>(null);
  const [festivalsError, setFestivalsError] = useState<string | null>(null);
  // True when IP-geolocation fails so we can prompt the user to pick a city
  // (review finding B3). User-set locations bypass this flag.
  const [geoDetectFailed, setGeoDetectFailed] = useState(false);
  const [festivals, setFestivals] = useState<{ date: string; name: LocaleText; type: string; slug?: string; category?: string }[]>([]);

  // Location
  const [location, setLocation] = useState<LocationData | null>(null);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const locStore = useLocationStore();

  // Personalisation — natal Moon nakshatra + sign from user's kundali (if any).
  // makeNatalContext rejects 0/NaN/out-of-range silently and returns
  // `{ kind: 'none' }`; the calendar gracefully renders the non-personalised
  // view in that case. Tagged union enforces "either both or neither" so
  // the 5 consumer sites don't each re-check.
  const { snapshot } = useFreshSnapshot();
  const natal = makeNatalContext(
    typeof snapshot?.moon_nakshatra === 'number' ? snapshot.moon_nakshatra : undefined,
    typeof snapshot?.moon_sign === 'number' ? snapshot.moon_sign : undefined,
  );

  // Auto-detect location via /api/geo (reads Vercel edge headers
  // server-side). On Vercel the response is rich; on localhost / non-Vercel
  // environments every field is null and we surface the picker so the user
  // can recover (review finding B3, universal rule 3 "guard external
  // library limits"). Previously called ipapi.co/json/ directly but that
  // started CORS-failing in May 2026.
  useEffect(() => {
    if (locStore.lat && locStore.lng && locStore.timezone) {
      setLocation({ lat: locStore.lat, lng: locStore.lng, name: locStore.name || 'Your Location', timezone: locStore.timezone });
      setGeoDetectFailed(false);
      return;
    }
    fetchApiGeo()
      .then((data) => {
        if (data && data.latitude !== null && data.longitude !== null) {
          const tz = data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
          // Fall back to 'Your Location' if both city+country are absent,
          // matching the locStore-cached branch above. Without this an empty
          // string would render in the page header.
          const name = [data.city, data.country].filter(Boolean).join(', ') || 'Your Location';
          setLocation({ lat: data.latitude, lng: data.longitude, name, timezone: tz });
          setGeoDetectFailed(false);
        } else {
          throw new Error('No edge geo headers (local dev or non-Vercel)');
        }
      })
      .catch((err) => {
        console.error('[tithi-calendar] geo lookup failed:', err);
        setGeoDetectFailed(true);
        setShowLocationSearch(true); // surface the picker so the user can recover
      });
  }, [locStore.lat, locStore.lng, locStore.timezone, locStore.name]);

  // Fetch festivals. On failure we surface an amber banner above the grid
  // instead of rendering a calendar with no festival markers as if it were
  // complete (review finding B2).
  useEffect(() => {
    if (!location) return;
    setFestivalsError(null);
    fetch(`/api/calendar?year=${year}&lat=${location.lat}&lon=${location.lng}&timezone=${encodeURIComponent(location.timezone)}`)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.text().catch(() => '');
          throw new Error(`calendar ${r.status}: ${body.slice(0, 160)}`);
        }
        return r.json();
      })
      .then(data => {
        if (!Array.isArray(data?.festivals)) {
          throw new Error('festival response missing `festivals` array');
        }
        setFestivals(data.festivals.map((f: { date: string; name: LocaleText; type: string; slug?: string; category?: string }) => ({
          date: f.date, name: f.name, type: f.type, slug: f.slug, category: f.category,
        })));
      })
      .catch((err) => {
        console.error('[tithi-calendar] festival fetch failed:', err);
        setFestivalsError(tl(MSG.errorFestivalsFailed, locale));
      });
  }, [year, location, locale]);

  // Fetch tithi grid. A 5xx from the route used to fall through silently and
  // leave the calendar blank with no signal — now we surface a banner with
  // a retry button (review finding B1, CLAUDE.md Lesson AA).
  const fetchGrid = useCallback(() => {
    if (!location) return;
    setLoading(true);
    setTithiData(null);
    setMeta(null);
    setGridError(null);
    fetch(`/api/tithi-grid?year=${year}&month=${month + 1}&lat=${location.lat}&lon=${location.lng}&timezone=${encodeURIComponent(location.timezone)}`)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.text().catch(() => '');
          throw new Error(`tithi-grid ${r.status}: ${body.slice(0, 160)}`);
        }
        return r.json();
      })
      .then(data => {
        if (!Array.isArray(data?.days)) {
          throw new Error('tithi-grid response missing `days` array');
        }
        const today = todayStrRef.current;
        const enriched: TithiDayData[] = data.days.map((td: TithiDayData) => ({
          ...td,
          festivals: festivals.filter(f => f.date === td.date).map(f => ({ name: f.name, type: f.type, slug: f.slug, category: f.category })),
          isToday: td.date === today,
        }));
        setTithiData(enriched);
        if (data.meta) setMeta(data.meta as MonthlyContext);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[tithi-calendar] grid fetch failed:', err);
        setGridError(tl(MSG.errorGridFailed, locale));
        setLoading(false);
      });
  }, [month, year, location, festivals, locale]);

  useEffect(() => { fetchGrid(); }, [fetchGrid]);

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };
  // goToToday recomputes from a fresh Date so a user opening the page at
  // 23:58 and clicking after midnight lands on the new day's month, not the
  // captured-at-render-time stale day (review finding M2).
  const goToToday = () => {
    const fresh = new Date();
    setYear(fresh.getFullYear());
    setMonth(fresh.getMonth());
    setTodayKey(formatLocalDateKey(fresh));
  };

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold-light via-gold-primary to-gold-light bg-clip-text text-transparent mb-2" style={headingFont}>
            {tl(MSG.pageTitle, locale)}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto">
            {tl(MSG.subtitle, locale)}
          </p>
        </div>

        {/* Location */}
        <div className="flex flex-col items-center gap-2 mb-6">
          {location ? (
            <button onClick={() => setShowLocationSearch(!showLocationSearch)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 hover:border-gold-primary/40 transition-colors">
              <MapPin className="w-4 h-4 text-gold-primary" />
              <span className="text-text-primary text-sm font-medium">{location.name}</span>
            </button>
          ) : geoDetectFailed ? (
            <div role="alert" className="text-amber-200/95 text-sm text-center px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-400/40">
              {tl(MSG.locationDetectFailed, locale)}
            </div>
          ) : (
            <div className="text-text-secondary text-sm">{tl(MSG.detectingLocation, locale)}</div>
          )}
          {showLocationSearch && (
            <div className="w-full max-w-sm">
              <LocationSearch value="" onSelect={(loc) => { setLocation({ lat: loc.lat, lng: loc.lng, name: loc.name, timezone: loc.timezone || 'UTC' }); useLocationStore.getState().setLocation(loc.lat, loc.lng, loc.name, loc.timezone || 'UTC'); setShowLocationSearch(false); setGeoDetectFailed(false); }}
                placeholder={tl(MSG.searchCity, locale)} />
            </div>
          )}
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button onClick={prevMonth} aria-label={tl(MSG.prevMonth, locale)} className="p-2.5 rounded-xl border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          {/* Intl.DateTimeFormat(locale='mai', ...) can return different
              output server-side (Node ICU may lack Maithili CLDR) vs
              client-side (Chromium has it). suppressHydrationWarning is the
              documented React escape hatch for intentional locale-driven
              divergence, since the client wins after hydration anyway. */}
          <h2 className="text-gold-light text-xl font-bold min-w-[200px] text-center" style={headingFont} suppressHydrationWarning>
            {localMonthYear(year, month, locale)}
          </h2>
          <button onClick={nextMonth} aria-label={tl(MSG.nextMonth, locale)} className="p-2.5 rounded-xl border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-center mb-3">
          <button onClick={goToToday} className="text-xs px-4 py-1.5 rounded-full border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors">
            {tl(MSG.goToToday, locale)}
          </button>
        </div>

        {/* Masa convention toggle — Amanta vs Purnimanta.
            Amanta (new-moon-to-new-moon, default) is the South/West Indian
            convention and matches mainstream reference panchangs. Purnimanta
            (full-moon-to-full-moon) is the North Indian convention; during
            Krishna Paksha the Purnimanta month is one ahead. */}
        <div className="flex justify-center mb-5">
          <div
            role="radiogroup"
            aria-label="Masa convention"
            className="inline-flex items-center gap-1 p-1 rounded-xl border border-gold-primary/25 bg-bg-secondary/40 backdrop-blur-sm"
          >
            <button
              role="radio"
              aria-checked={masaConvention === 'amanta'}
              onClick={() => setMasaConvention('amanta')}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                masaConvention === 'amanta'
                  ? 'bg-gold-primary/30 text-gold-light border border-gold-primary/60 shadow-[inset_0_0_8px_rgba(212,168,83,0.25)]'
                  : 'text-text-secondary hover:text-gold-light border border-transparent'
              }`}
            >
              Amanta
            </button>
            <button
              role="radio"
              aria-checked={masaConvention === 'purnimanta'}
              onClick={() => setMasaConvention('purnimanta')}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                masaConvention === 'purnimanta'
                  ? 'bg-gold-primary/30 text-gold-light border border-gold-primary/60 shadow-[inset_0_0_8px_rgba(212,168,83,0.25)]'
                  : 'text-text-secondary hover:text-gold-light border border-transparent'
              }`}
            >
              Purnimanta
            </button>
          </div>
        </div>

        {/* Save-this-month export button. Sits on its own row so it doesn't
            crowd the month-nav strip. Only renders when we have data + a
            location — otherwise it'd produce a blank capture. */}
        {tithiData && location && (
          <div className="flex justify-center mb-5">
            <ExportCalendarButton
              year={year}
              month={month + 1}
              days={tithiData}
              meta={meta}
              locale={locale}
              locationName={location.name}
              masaConvention={masaConvention}
              monthHeading={localMonthYear(year, month, locale)}
              generatedAt={new Date().toISOString().slice(0, 10)}
              festivals={tithiData
                .filter((d) => d.festivals && d.festivals.length > 0)
                .flatMap((d) =>
                  d.festivals!.map((f) => ({ date: d.date, name: tl(f.name, locale) })),
                )}
              freshKey={`${year}-${month}-${masaConvention}`}
            />
          </div>
        )}

        {/* Today panchang header — only when viewing the current month */}
        {tithiData && year === todayYear && month === todayMonthIdx - 1 && (
          <TodayPanchangHeader
            today={tithiData.find((d) => d.isToday) ?? null}
            locale={locale}
            natal={natal}
          />
        )}

        {/* Monthly context strip */}
        {meta && <MonthlyContextStrip meta={meta} locale={locale} />}

        {/* Festival-fetch error banner — soft warning, calendar still loads
            but festival markers are missing. (Review finding B2.) */}
        {festivalsError && (
          <div role="alert" className="mb-3 flex items-center justify-center gap-3 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-100 text-sm">
            <span>⚠</span>
            <span>{festivalsError}</span>
          </div>
        )}

        {/* Grid-fetch error banner — calendar can't load. Includes a retry
            button so the user can recover. (Review finding B1.) */}
        {gridError && (
          <div role="alert" className="mb-5 flex flex-col sm:flex-row items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500/15 border border-red-400/45 text-red-50">
            <span className="text-sm">{gridError}</span>
            <button
              onClick={fetchGrid}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/30 border border-red-400/60 hover:bg-red-500/45 transition-colors uppercase tracking-wider"
            >
              {tl(MSG.errorRetry, locale)}
            </button>
          </div>
        )}

        {/* Legend — two rows. Top: highlight categories (Purnima / Amavasya /
            Ekadashi / Festival / Vrat) that drive cell colouring + iconography.
            Bottom: the per-cell panchang icons (Sunrise / Sunset / Rahu Kaal /
            Nakshatra / Moon Sign / Yoga + Karana) — these were previously
            unlabelled, leaving users to guess what each tiny icon meant. The
            SVGs here mirror exactly what TithiMonthGrid renders in each cell
            so the visual link is obvious. */}
        <div className="flex flex-wrap items-center gap-4 mb-2 justify-center text-xs text-text-secondary">
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-amber-400/80 shadow-sm shadow-amber-400/30" /><span>{tl(MSG.legendPurnima, locale)}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-[#1a1040] border-2 border-violet-400/40" /><span>{tl(MSG.legendAmavasya, locale)}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30" /><span>{tl(MSG.legendEkadashi, locale)}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-3 rounded bg-gold-primary/20 border border-gold-primary/30" /><span>{tl(MSG.legendFestival, locale)}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-3 rounded bg-violet-500/15 border border-violet-500/25" /><span>{tl(MSG.legendVrat, locale)}</span></div>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5 justify-center text-[10px] sm:text-xs text-text-secondary border-t border-gold-primary/10 pt-2">
          {/* Sunrise — mirrors SunriseIcon at TithiMonthGrid.tsx:122 */}
          {/* No `title=` attribute on these — the visible <span> label already
              names each item, and a duplicate `title` causes screen readers
              to announce the same text twice ("Sunrise Sunrise"). The SVGs
              carry aria-hidden="true" so they're skipped, leaving the label
              as the single accessible name. Gemini PR #674 MED. */}
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 16 16" className="shrink-0" aria-hidden="true">
              <circle cx="8" cy="10" r="3" fill="none" stroke="#d4a853" strokeWidth="1.2" />
              <line x1="8" y1="4" x2="8" y2="6" stroke="#d4a853" strokeWidth="0.8" strokeLinecap="round" />
              <line x1="4" y1="6.5" x2="5.2" y2="7.7" stroke="#d4a853" strokeWidth="0.7" strokeLinecap="round" />
              <line x1="12" y1="6.5" x2="10.8" y2="7.7" stroke="#d4a853" strokeWidth="0.7" strokeLinecap="round" />
              <line x1="2" y1="13" x2="14" y2="13" stroke="#d4a853" strokeWidth="0.6" opacity="0.3" />
            </svg>
            <span>{tl(MSG.cellSunrise, locale)}</span>
          </div>
          {/* Sunset — mirrors SunsetIcon at TithiMonthGrid.tsx:134 */}
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 16 16" className="shrink-0" aria-hidden="true">
              <circle cx="8" cy="10" r="3" fill="none" stroke="#8a6d2b" strokeWidth="1.2" />
              <line x1="8" y1="6" x2="8" y2="4" stroke="#8a6d2b" strokeWidth="0.8" strokeLinecap="round" />
              <line x1="2" y1="13" x2="14" y2="13" stroke="#8a6d2b" strokeWidth="0.6" opacity="0.3" />
            </svg>
            <span>{tl(MSG.cellSunset, locale)}</span>
          </div>
          {/* Rahu Kaal — mirrors the red-dot marker at TithiMonthGrid.tsx:880 */}
          <div className="flex items-center gap-1.5 text-red-300/90">
            <span className="inline-block w-2 h-2 rounded-full bg-red-400/90 shadow-[0_0_3px_rgba(239,68,68,0.6)]" aria-hidden="true" />
            <span>{tl(MSG.rahuKaal, locale)}</span>
          </div>
          {/* Nakshatra — mirrors the cyan-star SVG at TithiMonthGrid.tsx:889 */}
          <div className="flex items-center gap-1.5 text-cyan-200/95">
            <svg width="12" height="12" viewBox="0 0 16 16" className="shrink-0" aria-hidden="true">
              <polygon points="8,1 10,6 15,6.5 11,10 12.5,15 8,12 3.5,15 5,10 1,6.5 6,6" fill="#67e8f9" opacity="0.9" />
            </svg>
            <span>{tl(MSG.cellNakshatra, locale)}</span>
          </div>
          {/* Moon Sign / Rashi — mirrors the half-shaded crescent at TithiMonthGrid.tsx:901 */}
          <div className="flex items-center gap-1.5 text-slate-200/95">
            <svg width="12" height="12" viewBox="0 0 16 16" className="shrink-0" aria-hidden="true">
              <circle cx="8" cy="8" r="5.5" fill="none" stroke="#cbd5e1" strokeWidth="1" />
              <path d="M9.5 4 A4.5 4.5 0 0 0 9.5 12 A5.5 5.5 0 0 1 9.5 4Z" fill="#cbd5e1" opacity="0.75" />
            </svg>
            <span>{tl(MSG.cellMoonSign, locale)}</span>
          </div>
          {/* Yoga + Karana — mirrors the fuchsia knot SVG at TithiMonthGrid.tsx:916 */}
          <div className="flex items-center gap-1.5 text-fuchsia-200/95">
            <svg width="12" height="12" viewBox="0 0 16 16" className="shrink-0" aria-hidden="true">
              <path d="M5 4 Q8 7 11 4 Q14 8 11 12 Q8 9 5 12 Q2 8 5 4Z" fill="none" stroke="#e879f9" strokeWidth="1.1" opacity="0.85" />
            </svg>
            <span>{tl(MSG.cellYoga, locale)} / <span className="text-gold-light/80">{tl(MSG.cellKarana, locale)}</span></span>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-primary border-t-transparent" />
          </div>
        ) : tithiData ? (
          <>
            {/* Festival icon defs mounted once for both grid + list + panel */}
            <FestivalIconDefs />
            {/* Mobile: vertical list. Desktop ≥sm: grid. */}
            <div className="sm:hidden">
              <TithiMonthList
                year={year}
                month={month + 1}
                days={tithiData}
                locale={locale}
                natal={natal}
                masaConvention={masaConvention}
                onDayClick={(date) => {
                  const dayData = tithiData.find((d) => d.date === date);
                  if (dayData) setSelectedDay(dayData);
                }}
              />
            </div>
            <div className="hidden sm:block">
              <TithiMonthGrid
                year={year}
                month={month + 1}
                days={tithiData}
                locale={locale}
                natal={natal}
                masaConvention={masaConvention}
                onDayClick={(date) => {
                  const dayData = tithiData.find((d) => d.date === date);
                  if (dayData) setSelectedDay(dayData);
                }}
              />
            </div>
          </>
        ) : !location ? (
          <div className="text-center py-16 text-text-secondary">
            {tl(MSG.locationPrompt, locale)}
          </div>
        ) : null}
      </div>

      <DayDetailPanel
        day={selectedDay}
        locale={locale}
        natal={natal}
        onClose={() => setSelectedDay(null)}
        onNavigateFull={(date) => { window.location.href = `/${locale}/panchang?date=${date}`; }}
      />
    </main>
  );
}
