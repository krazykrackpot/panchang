'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { MapPin, Loader2, Clock, Sun, Moon, ChevronDown, ChevronUp, Compass, Calendar, Star, Bell, Sparkles, BookOpen } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import ShareButton from '@/components/ui/ShareButton';
import PrintButton from '@/components/ui/PrintButton';
import MonthlyPDFButton from '@/components/panchang/MonthlyPDFButton';
import { Download } from 'lucide-react';
import { TithiIcon, NakshatraIcon, YogaIcon, KaranaIcon, VaraIcon, MuhurtaIcon, GrahanIcon, RashiIcon, MasaIcon, SamvatsaraIcon, SunriseIcon, SunsetIcon, MoonriseIcon, RituIcon, AyanaIcon } from '@/components/icons/PanchangIcons';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { GRAHAS, VARA_QUALITY } from '@/lib/constants/grahas';
import { RashiIconById } from '@/components/icons/RashiIcons';
import type { PanchangData, Locale, Muhurta, TransitionInfo, BalamResult, LocaleText } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { TITHIS } from '@/lib/constants/tithis';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { MUHURTA_DATA } from '@/lib/constants/muhurtas';
import { computeBalam } from '@/lib/panchang/balam';
import { calculatePanchaPakshi } from '@/lib/prashna/pancha-pakshi';
import { computeHinduMonths, computePurnimantMonths, formatMonthDate } from '@/lib/calendar/hindu-months';
import { useBirthDataStore } from '@/stores/birth-data-store';
import { getUTCOffsetForDate, resolveTimezoneFromCoords } from '@/lib/utils/timezone';
import LocationSearch from '@/components/ui/LocationSearch';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { CITIES } from '@/lib/constants/cities';
import { computePersonalizedDay } from '@/lib/personalization/personal-panchang';
import { getRashiNumber } from '@/lib/ephem/astronomical';
import type { PersonalizedDay, UserSnapshot } from '@/lib/personalization/types';
import AdUnit from '@/components/ads/AdUnit';
import NakshatraActivityGuide from '@/components/panchang/NakshatraActivityGuide';
import DayTimeline from '@/components/panchang/DayTimeline';
import TarotCard from '@/components/ui/TarotCard';
import LearnLink from '@/components/ui/LearnLink';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl as _tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import PMSG from '@/messages/pages/panchang-inline.json';
import { usePreferenceStore, type TraditionPreference } from '@/stores/preference-store';
import { HORA_PLANET_ACTIVITIES, computeHoraTable } from '@/lib/panchang/hora-engine';
import { getVaraRemedies } from '@/lib/remedies/prescription-engine';
import type { VaraRemedy } from '@/lib/remedies/prescription-engine';
import { generateDailyVibe } from '@/lib/shareable/daily-vibe';

// Round SVG coordinates to 2dp to prevent hydration mismatch
const r2 = (n: number) => Math.round(n * 100) / 100;
import {
  getTithiInsight,
  getNakshatraInsight,
  getYogaInsight,
  getKaranaInsight,
  getVaraInsight,
  type PanchangInsight,
} from '@/lib/constants/panchang-insights';
import dynamic from 'next/dynamic';

const DailyVibeCard = dynamic(() => import('@/components/shareable/DailyVibeCard'), { ssr: false });

// Module-level msg helper — resolves inline locale labels from JSON
const msg = (key: string, locale: string): string =>
  lt((PMSG as unknown as Record<string, LocaleText>)[key], locale);


// ──────────────────────────────────────────────────────────────
// Check if a transition endTime has already passed
// ──────────────────────────────────────────────────────────────
function hasTransitionPassed(
  endTime: string,
  endDate: string | undefined,
  now: Date,
  selectedDate: string,
  tz: number
): boolean {
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  if (selectedDate !== todayStr) return false;

  // If end is on a future date, it hasn't passed
  if (endDate && endDate > todayStr) return false;

  const [hh, mm] = endTime.split(':').map(Number);
  const endMinutes = hh * 60 + mm;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= endMinutes;
}

// Format transition time — ALWAYS includes date
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_SHORT_HI = ['जन.','फर.','मार्च','अप्रै.','मई','जून','जुला.','अग.','सित.','अक्टू.','नव.','दिस.'];
function formatTransitionTime(time: string, date: string | undefined, _selectedDate: string, locale: string): string {
  if (!date) return time;
  const [, m, d] = date.split('-').map(Number);
  const monthNames = isDevanagariLocale(locale) ? MONTH_SHORT_HI : MONTH_SHORT; // TODO: add locale-specific month names
  return `${time}, ${d} ${monthNames[m - 1]}`;
}

interface LocationData {
  lat: number;
  lng: number;
  name: string;
  tz: number;
  /** IANA timezone resolved from coordinates — NEVER use browser timezone for panchang calculations */
  ianaTimezone: string;
}

// ──────────────────────────────────────────────────────────────
// Section heading component
// ──────────────────────────────────────────────────────────────
function SectionHeading({
  icon,
  title,
  subtitle,
  accentClass = 'text-gold-gradient',
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  accentClass?: string;
}) {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-3">{icon}</div>
      <h2 className={`text-3xl font-bold mb-2 ${accentClass}`}>{title}</h2>
      {subtitle && <p className="text-text-secondary text-sm max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Collapsible "What does this mean?" insight block
// ──────────────────────────────────────────────────────────────
function InsightBlock({ insight }: { insight: PanchangInsight | undefined }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!insight) return null;

  return (
    <div className="mt-2">
      {/* Always-visible headline preview */}
      <p className="text-gold-light/85 text-[11px] sm:text-[11px] text-center mb-1 leading-snug">{insight.headline}</p>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-text-secondary text-xs hover:text-gold-light transition-colors flex items-center gap-1.5 mx-auto py-2 px-3"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        {isOpen ? 'Hide details' : 'What does this mean?'}
      </button>
      {isOpen && (
        <div className="mt-2 p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/10 text-sm text-left">
          <p className="text-text-primary text-xs leading-relaxed mb-2">{insight.explanation}</p>
          {insight.bestFor.length > 0 && (
            <p className="text-text-secondary text-xs">
              <span className="text-gold-primary/70">Best for:</span> {insight.bestFor.join(', ')}
            </p>
          )}
          {insight.avoid.length > 0 && (
            <p className="text-text-secondary text-xs mt-1">
              <span className="text-gold-primary/70">Avoid:</span> {insight.avoid.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Daily Video Card — lite YouTube embed (thumbnail first, iframe on click)
// ---------------------------------------------------------------------------
function DailyVideoCard({ videoId, title, thumbnail, isDevanagari }: { videoId: string; title: string; thumbnail: string; isDevanagari: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-br from-red-900/20 via-[#1a1040]/40 to-[#0a0e27] border border-red-500/15 overflow-hidden">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="text-gold-dark text-xs uppercase tracking-widest font-bold">
          {isDevanagari ? 'आज का वीडियो पंचांग' : 'Daily Video Forecast'}
        </div>
        <a
          href="https://www.youtube.com/@DekhoPanchang?sub_confirmation=1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-semibold hover:bg-red-500 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" /></svg>
          Subscribe
        </a>
      </div>
      <div className="relative w-full aspect-video">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label={`Play: ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnail} alt={title} className="w-full h-full object-cover" loading="lazy" />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current ml-1"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
          </button>
        )}
      </div>
      <div className="px-5 py-2.5 text-xs text-text-secondary truncate">{title}</div>
    </div>
  );
}

interface PanchangClientProps {
  /** Server-computed panchang from Vercel geo headers — eliminates LCP waterfall */
  serverPanchang?: PanchangData | null;
  /** Server-resolved location from Vercel geo headers */
  serverLocation?: { lat: number; lng: number; name: string; timezone: string } | null;
  /** Latest YouTube video from RSS feed (server-fetched, cached 1h) */
  latestVideo?: { videoId: string; title: string; thumbnail: string; published: string } | null;
}

export default function PanchangClient({ serverPanchang, serverLocation, latestVideo }: PanchangClientProps) {
  const t = useTranslations('panchang');
  const tNav = useTranslations('nav');
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  // Safe multilingual accessor — falls back to 'en' when locale key missing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tl = (obj: any): string => _tl(obj, locale);

  const { tradition, setTradition } = usePreferenceStore();

  // Initialize from server data when available — renders panchang on first paint (no loading spinner)
  const [panchang, setPanchang] = useState<PanchangData | null>(serverPanchang ?? null);
  const [loading, setLoading] = useState(!serverPanchang);
  const [location, setLocation] = useState<LocationData>(() => {
    if (serverLocation) {
      return { lat: serverLocation.lat, lng: serverLocation.lng, name: serverLocation.name, tz: 0, ianaTimezone: serverLocation.timezone };
    }
    return { lat: 0, lng: 0, name: '', tz: 0, ianaTimezone: '' };
  });
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const panchangContentRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [birthNakshatra, setBirthNakshatra] = useState(0);
  const [birthRashi, setBirthRashi] = useState(0);
  const [balamResult, setBalamResult] = useState<BalamResult | null>(null);
  const [birthAutoDetected, setBirthAutoDetected] = useState(false);

  // Personal overlay state
  const authUser = useAuthStore(s => s.user);
  const [personalDay, setPersonalDay] = useState<PersonalizedDay | null>(null);

  // Hindu months computation removed — now on /panchang/masa subpage
  const [now, setNow] = useState<Date>(new Date());
  const [showCalcDetails, setShowCalcDetails] = useState(false);
  const [showVibeCard, setShowVibeCard] = useState(false);

  // Auto-load birth nakshatra/rashi from store (persisted from kundali page)
  useEffect(() => {
    const store = useBirthDataStore.getState();
    store.loadFromStorage();
    const { birthNakshatra: storedNak, birthRashi: storedRashi, isSet } = useBirthDataStore.getState();
    if (isSet && storedNak > 0 && storedRashi > 0) {
      setBirthNakshatra(storedNak);
      setBirthRashi(storedRashi);
      setBirthAutoDetected(true);
    }
  }, []);

  // Tick current time every 60s so transition checks stay fresh
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  // Initialize date on client only to avoid hydration mismatch
  useEffect(() => {
    const d = new Date();
    setSelectedDate(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`);
  }, []);

  // Helper: resolve IANA timezone + numeric offset from coordinates
  // CRITICAL: panchang calculations MUST use the location's timezone, NEVER the browser's
  async function resolveLocationTimezone(lat: number, lng: number): Promise<{ ianaTimezone: string; tz: number }> {
    const ianaTimezone = await resolveTimezoneFromCoords(lat, lng);
    const now = new Date();
    const tz = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), ianaTimezone);
    return { ianaTimezone, tz };
  }

  // Location detection: URL params take priority over geolocation (Lesson C).
  // When a link passes ?lat=...&lng=...&name=..., use those coordinates.
  // Only fall back to browser geolocation / IP when no URL params are present.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLat = params.get('lat');
    const urlLng = params.get('lng');
    const urlName = params.get('name');

    if (urlLat && urlLng) {
      // URL params provided — use them, resolve timezone from coordinates
      const lat = parseFloat(urlLat);
      const lng = parseFloat(urlLng);
      if (!isNaN(lat) && !isNaN(lng)) {
        setDetectingLocation(true);
        resolveLocationTimezone(lat, lng).then(({ ianaTimezone, tz }) => {
          setLocation({ lat, lng, name: urlName || `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`, tz, ianaTimezone });
          setDetectingLocation(false);
        });
        return; // skip geolocation
      }
    }

    // No URL params — detect from browser geolocation / IP
    if ('geolocation' in navigator) {
      setDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const { ianaTimezone, tz } = await resolveLocationTimezone(latitude, longitude);
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
            const country = data.address?.country || '';
            const name = [city, country].filter(Boolean).join(', ') || `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
            setLocation({ lat: latitude, lng: longitude, name, tz, ianaTimezone });
          } catch {
            setLocation({ lat: latitude, lng: longitude, name: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`, tz, ianaTimezone });
          }
          setDetectingLocation(false);
        },
        async () => {
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.latitude && data.longitude) {
              const { ianaTimezone, tz } = await resolveLocationTimezone(data.latitude, data.longitude);
              let name = `${data.latitude.toFixed(2)}°, ${data.longitude.toFixed(2)}°`;
              try {
                const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}&zoom=10`);
                const geoData = await geo.json();
                const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || '';
                const country = geoData.address?.country || '';
                name = [city, country].filter(Boolean).join(', ') || name;
              } catch { /* use coordinate fallback */ }
              setLocation({ lat: data.latitude, lng: data.longitude, name, tz, ianaTimezone });
            }
          } catch (err) {
            console.error('[panchang] IP geolocation fallback failed:', err);
          }
          setDetectingLocation(false);
        },
        { timeout: 5000 }
      );
    }
  }, []);

  const fetchPanchang = useCallback(() => {
    if (!selectedDate) return;
    if (location.lat === 0 && location.lng === 0) return;
    if (!location.ianaTimezone) return; // wait for timezone resolution
    setLoading(true);
    const [year, month, day] = selectedDate.split('-').map(Number);
    // CRITICAL: use the LOCATION's timezone, not the browser's (Lesson L, feedback_timezone_rule)
    fetch(`/api/panchang?year=${year}&month=${month}&day=${day}&lat=${location.lat}&lng=${location.lng}&timezone=${encodeURIComponent(location.ianaTimezone)}&location=${encodeURIComponent(location.name)}`)
      .then(res => res.json())
      .then(data => { setPanchang(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedDate, location]);

  useEffect(() => { fetchPanchang(); }, [fetchPanchang]);

  const deepDiveLinks = [
    { key: 'tithi', Icon: TithiIcon },
    { key: 'nakshatra', Icon: NakshatraIcon },
    { key: 'yoga', Icon: YogaIcon },
    { key: 'karana', Icon: KaranaIcon },
    { key: 'muhurta', Icon: MuhurtaIcon },
    { key: 'grahan', Icon: GrahanIcon },
    { key: 'rashi', Icon: RashiIcon },
    { key: 'masa', Icon: MasaIcon },
    { key: 'samvatsara', Icon: SamvatsaraIcon },
  ];

  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const getNatureColor = (nature: string) => {
    if (nature === 'auspicious') return 'text-emerald-400';
    if (nature === 'inauspicious') return 'text-red-400';
    return 'text-amber-400';
  };

  const getNatureBg = (nature: string) => {
    if (nature === 'auspicious') return 'bg-emerald-500/10 border-emerald-500/20';
    if (nature === 'inauspicious') return 'bg-red-500/10 border-red-500/20';
    return 'bg-amber-500/10 border-amber-500/20';
  };

  const getNatureLabel = (nature: string) => {
    if (nature === 'auspicious') return msg('auspicious', locale);
    if (nature === 'inauspicious') return msg('inauspicious', locale);
    return msg('neutral', locale);
  };

  // Muhurta index tracking removed — now on /panchang/muhurta subpage

  // Personal overlay — fetch snapshot and compute personalized day
  useEffect(() => {
    if (!authUser || !panchang) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.from('kundali_snapshots')
      .select('moon_sign, moon_nakshatra, moon_nakshatra_pada, ascendant_sign, dasha_timeline, sade_sati')
      .eq('user_id', authUser.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const todayNak = panchang.nakshatra?.id || 1;
        const moonPlanet = panchang.planets?.find((p: { id: number }) => p.id === 1);
        const todayMoonSign = moonPlanet?.rashi || 1;
        const pd = computePersonalizedDay({
          moonSign: data.moon_sign,
          moonNakshatra: data.moon_nakshatra,
          moonNakshatraPada: data.moon_nakshatra_pada,
          sunSign: 1,
          ascendantSign: data.ascendant_sign,
          planetPositions: [],
          dashaTimeline: data.dasha_timeline || [],
          sadeSati: data.sade_sati || {},
        }, todayNak, todayMoonSign);
        setPersonalDay(pd);
      });
  }, [authUser, panchang]);

  // Compute balam when birth data changes — also persist manual selections
  useEffect(() => {
    if (birthNakshatra && birthRashi && panchang) {
      const todayNakshatra = panchang.nakshatra.id;
      const moonPlanet = panchang.planets.find(p => p.id === 1);
      const todayMoonRashi = moonPlanet?.rashi || 1;
      setBalamResult(computeBalam(birthNakshatra, birthRashi, todayNakshatra, todayMoonRashi));
      // Persist to store so it remembers next visit
      if (!birthAutoDetected) {
        useBirthDataStore.getState().setBirthData(birthNakshatra, birthRashi);
      }
    } else {
      setBalamResult(null);
    }
  }, [birthNakshatra, birthRashi, panchang, birthAutoDetected]);

  // ── Locale-aware card reordering for mega grid ──
  // Tamil/Telugu: elevate Activity Guide (nakshatra-based), Muhurtas, Hora
  // Hindi/Gujarati: Choghadiya first, then Muhurtas, Sacred Timings
  const cardPriority: Record<string, string[]> = {
    ta: ['/panchang/activity-guide', '/panchang/muhurta', '/hora'],
    te: ['/panchang/activity-guide', '/panchang/muhurta', '/hora'],
    hi: ['/choghadiya', '/panchang/muhurta', '/panchang/auspicious'],
    gu: ['/choghadiya', '/panchang/muhurta', '/panchang/auspicious'],
  };
  function reorderCards<T extends { href: string }>(cards: T[]): T[] {
    const prio = cardPriority[locale];
    if (!prio) return cards;
    const prioritized = prio.map(h => cards.find(c => c.href === h)).filter(Boolean) as T[];
    const rest = cards.filter(c => !prio.includes(c.href));
    return [...prioritized, ...rest];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
      </motion.div>

      <AdUnit placement="leaderboard" className="max-w-4xl mx-auto" />

      {/* Date & Location — compact single row */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Date */}
          <div className="flex items-center gap-2 rounded-lg border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] px-3 py-2">
            <label className="text-gold-dark text-xs whitespace-nowrap">{t('selectDate')}</label>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border border-gold-primary/15 rounded-md px-2 py-1 text-text-primary text-sm focus:outline-none focus:border-gold-primary/40 [color-scheme:dark]" />
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 rounded-lg border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] px-3 py-2">
            <MapPin className="w-3.5 h-3.5 text-gold-primary shrink-0" />
            <span className="text-text-primary text-sm font-medium max-w-[180px] truncate">
              {detectingLocation ? (
                <span className="flex items-center gap-1 text-text-secondary text-xs"><Loader2 className="w-3 h-3 animate-spin" />{msg('detecting', locale)}</span>
              ) : location.name}
            </span>
            <button onClick={() => setShowLocationSearch(!showLocationSearch)}
              className="text-gold-primary hover:text-gold-light text-xs border border-gold-primary/15 px-3 py-1.5 sm:px-2 sm:py-0.5 rounded hover:bg-gold-primary/10 transition-all whitespace-nowrap">
              {msg('change', locale)}
            </button>
          </div>
        </div>

        {/* Location search with autocomplete — uses shared LocationSearch component */}
        {showLocationSearch && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mt-3">
            <LocationSearch
              value=""
              placeholder={msg('searchCity', locale)}
              className="w-full max-w-sm"
              onSelect={(loc) => {
                const now = new Date();
                const tz = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), loc.timezone);
                setLocation({ lat: loc.lat, lng: loc.lng, name: loc.name, tz, ianaTimezone: loc.timezone });
                setShowLocationSearch(false);
              }}
            />
          </motion.div>
        )}
      </div>

      <div ref={panchangContentRef}>
      {loading ? (
        <div className="min-h-[600px] flex flex-col items-center justify-center gap-4 py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
          {/* Skeleton grid matching the 5 panchang cards to prevent CLS */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-8 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/5 animate-pulse" />
            ))}
          </div>
        </div>
      ) : panchang ? (
        <>
          {/* Actions — compact row */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8">
            <div className="flex items-center gap-1.5">
              <button
                onClick={async () => {
                  const { exportPanchangPDF } = await import('@/lib/export/pdf-panchang');
                  exportPanchangPDF(panchang, locale as Locale);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-1 text-xs font-medium rounded-md border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all"
                aria-label="Download PDF"
              >
                <Download className="w-3 h-3" />
                PDF
              </button>
              <PrintButton
                contentRef={panchangContentRef}
                title={`Panchang — ${panchang.date}`}
                label={msg('print', locale)}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-1 text-xs font-medium rounded-md border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all"
              />
              <MonthlyPDFButton
                year={selectedDate ? parseInt(selectedDate.split('-')[0]) : new Date().getFullYear()}
                month={selectedDate ? parseInt(selectedDate.split('-')[1]) : (new Date().getMonth() + 1)}
                lat={location.lat}
                lng={location.lng}
                timezone={location.ianaTimezone}
                locationName={location.name}
              />
              <ShareButton
                title={`Panchang — ${panchang.date}`}
                text={`Today's Panchang — ${panchang.tithi?.name?.[locale] || panchang.tithi?.name?.en || ''}, ${panchang.nakshatra?.name?.[locale] || panchang.nakshatra?.name?.en || ''}, ${panchang.yoga?.name?.[locale] || panchang.yoga?.name?.en || ''} | dekhopanchang.com`}
                url={`https://dekhopanchang.com/${locale}/panchang`}
                locale={locale}
              />
              <button
                onClick={async () => {
                  const { requestNotificationPermission, generatePanchangAlerts, scheduleAlerts } = await import('@/lib/notifications/panchang-alerts');
                  const granted = await requestNotificationPermission();
                  if (granted) {
                    const alerts = generatePanchangAlerts(panchang, locale);
                    scheduleAlerts(alerts);
                    alert(`${alerts.length} ${msg('alertsScheduled', locale)}`);
                  } else {
                    alert(msg('allowNotifications', locale));
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-1 text-xs font-medium rounded-md border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all"
                aria-label="Set alerts"
              >
                <Bell className="w-3 h-3" />
                {msg('alerts', locale)}
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              FESTIVALS & VRATS FOR TODAY
          ═══════════════════════════════════════════════════ */}
          {panchang.festivals && panchang.festivals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-10"
            >
              {panchang.festivals.map((fest, idx) => {
                const isMajor = fest.type === 'major';
                const isEkadashi = fest.category === 'ekadashi';
                return (
                  <motion.div
                    key={`${fest.slug}-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + idx * 0.08 }}
                    className={`rounded-2xl p-3 sm:p-4 md:p-6 mb-4 border-2 ${
                      isMajor
                        ? 'border-gold-primary/50 bg-gradient-to-r from-gold-primary/15 via-amber-500/5 to-gold-primary/15'
                        : isEkadashi
                        ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10'
                        : 'border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-purple-500/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        isMajor ? 'bg-gold-primary/20' : isEkadashi ? 'bg-emerald-500/20' : 'bg-purple-500/20'
                      }`}>
                        {isMajor ? (
                          <Sparkles className={`w-6 h-6 ${isMajor ? 'text-gold-primary' : 'text-purple-400'}`} />
                        ) : (
                          <BookOpen className={`w-6 h-6 ${isEkadashi ? 'text-emerald-400' : 'text-purple-400'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className={`text-xl font-bold ${
                            isMajor ? 'text-gold-light' : isEkadashi ? 'text-emerald-300' : 'text-purple-300'
                          }`} style={headingFont}>
                            {tl(fest.name)}
                          </h3>
                          <span className={`text-xs uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full ${
                            isMajor
                              ? 'bg-gold-primary/20 text-gold-primary'
                              : isEkadashi
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {isMajor
                              ? msg('festival', locale)
                              : isEkadashi
                              ? msg('ekadashi', locale)
                              : msg('vrat', locale)}
                          </span>
                        </div>
                        {tl(fest.description) && (
                          <p className="text-text-secondary text-sm mt-1.5 leading-relaxed line-clamp-2">
                            {tl(fest.description)}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          {fest.pujaMuhurat && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gold-primary" />
                              <span className="text-xs text-text-secondary">
                                {fest.pujaMuhurat.name}:
                              </span>
                              <span className={`font-mono text-xs font-bold ${isMajor ? 'text-gold-light' : 'text-emerald-300'}`}>
                                {fest.pujaMuhurat.start} — {fest.pujaMuhurat.end}
                              </span>
                            </div>
                          )}
                          {fest.paranaStart && (
                            <div className="flex items-center gap-1.5">
                              <Sun className="w-3.5 h-3.5 text-gold-primary" />
                              <span className="text-xs text-text-secondary">
                                {msg('parana', locale)}
                              </span>
                              <span className={`font-mono text-xs font-bold ${isEkadashi ? 'text-emerald-300' : 'text-purple-300'}`}>
                                {fest.paranaStart} — {fest.paranaEnd}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════
              SECTION 1: FIVE ELEMENTS (Pancha Anga)
          ═══════════════════════════════════════════════════ */}
          <InfoBlock
            id="panchang-five-elements"
            title={
              msg('fiveElementsTitle', locale)
            }
            defaultOpen={true}
          >
            {isDevanagari ? (
              <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
                <p>पंचांग पाँच खगोलीय तत्वों से बना है जो दिन की शुभता और गुणवत्ता बताते हैं:</p>
                <ul className="space-y-2 pl-2">
                  <li><span className="text-gold-light font-semibold">तिथि</span> — चंद्र दिन। चंद्रमा की कला (घटती-बढ़ती) पर आधारित, जो त्योहारों और व्रतों का निर्धारण करती है।</li>
                  <li><span className="text-gold-light font-semibold">नक्षत्र</span> — चंद्र मंज़िल। आकाश के 27 तारा-समूहों में से एक जिसमें चंद्रमा वर्तमान में है। नामकरण और कुंडली मिलान में उपयोगी।</li>
                  <li><span className="text-gold-light font-semibold">योग</span> — सूर्य-चंद्र संयोग। (व्यायाम योग नहीं!) सूर्य और चंद्रमा की देशांतर स्थितियों के योग से बनता है। 27 प्रकार होते हैं — शुभ या अशुभ।</li>
                  <li><span className="text-gold-light font-semibold">करण</span> — आधा चंद्र दिन। तिथि का आधा भाग, 11 प्रकार के। विभिन्न कार्यों के लिए उपयुक्तता बताता है।</li>
                  <li><span className="text-gold-light font-semibold">वार</span> — सप्ताह का दिन। प्रत्येक दिन एक ग्रह के स्वामित्व में होता है।</li>
                </ul>
                <p className="pt-1 text-gold-primary/80 font-medium">ये पाँचों तत्व मिलकर किसी भी कार्य के लिए सबसे शुभ समय निर्धारित करते हैं।</p>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
                <p>Panchang is made of five celestial elements that reveal the quality and auspiciousness of a day:</p>
                <ul className="space-y-2 pl-2">
                  <li><span className="text-gold-light font-semibold">Tithi</span> — Lunar Day. Based on the Moon&apos;s phase (waxing or waning), it determines festivals and fasting days.</li>
                  <li><span className="text-gold-light font-semibold">Nakshatra</span> — Lunar Mansion. One of 27 star-groups that the Moon passes through. Used for naming ceremonies and compatibility matching.</li>
                  <li><span className="text-gold-light font-semibold">Yoga</span> — Sun-Moon Combination. (Not the exercise kind!) Formed by adding the longitudes of the Sun and Moon. There are 27 types — each considered favorable or unfavorable.</li>
                  <li><span className="text-gold-light font-semibold">Karana</span> — Half Lunar Day. Half of a Tithi, with 11 types. Each is suited to specific kinds of work or activity.</li>
                  <li><span className="text-gold-light font-semibold">Vara</span> — Weekday. Each day of the week is ruled by a planet that influences its overall energy.</li>
                </ul>
                <p className="pt-1 text-gold-primary/80 font-medium">Together, these five elements determine the most auspicious time for any activity.</p>
              </div>
            )}
          </InfoBlock>

          {/* Learn links for the five panchang elements */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mb-4">
            <LearnLink href="/learn/tithis" label={isDevanagari ? 'तिथि के बारे में जानें' : 'Learn about Tithis'} />
            <LearnLink href="/learn/nakshatras" label={isDevanagari ? 'नक्षत्र के बारे में जानें' : 'Learn about Nakshatras'} />
            <LearnLink href="/learn/yogas" label={isDevanagari ? 'योग के बारे में जानें' : 'Learn about Yogas'} />
            <LearnLink href="/learn/karanas" label={isDevanagari ? 'करण के बारे में जानें' : 'Learn about Karanas'} />
          </div>

          {/* Cross-link to Lunar Calendar view */}
          <div className="flex justify-center mb-6">
            <Link
              href="/lunar-calendar"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold-primary/25 text-gold-primary hover:bg-gold-primary/10 hover:text-gold-light transition-all text-xs font-medium"
            >
              <Moon className="w-3.5 h-3.5" />
              {isDevanagari ? 'चंद्र कैलेंडर देखें' : 'See Lunar View'}
            </Link>
          </div>

          {/* Today's Energy Weather — always visible */}
          {panchang && (() => {
            const vibeData = generateDailyVibe(panchang, locale);
            return (
              <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-gold-dark text-xs uppercase tracking-widest font-bold">
                    {isDevanagari ? 'आज की ऊर्जा' : "Today's Energy Weather"}
                  </div>
                  <button
                    onClick={() => setShowVibeCard(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-all"
                  >
                    <Star className="w-3 h-3" />
                    {isDevanagari ? 'शेयर करें' : 'Share'}
                  </button>
                </div>
                <div className="text-gold-light text-2xl font-bold mb-2" style={headingFont}>
                  {isDevanagari ? vibeData.vibeTitle.hi : vibeData.vibeTitle.en}
                </div>
                <div className="text-text-secondary text-sm mb-1">{vibeData.keyTransit}</div>
                {vibeData.secondaryInfluence && (
                  <div className="text-text-secondary/70 text-xs mb-3">{vibeData.secondaryInfluence}</div>
                )}
                <div className="flex flex-wrap gap-4 mb-3">
                  {vibeData.bestFor.length > 0 && (
                    <div>
                      <div className="text-emerald-400 text-[11px] sm:text-[10px] uppercase tracking-wider font-bold mb-1">{isDevanagari ? 'अनुकूल' : 'Best For'}</div>
                      <div className="text-text-secondary text-xs">{vibeData.bestFor.join(' · ')}</div>
                    </div>
                  )}
                  {vibeData.avoid.length > 0 && (
                    <div>
                      <div className="text-red-400 text-[11px] sm:text-[10px] uppercase tracking-wider font-bold mb-1">{isDevanagari ? 'बचें' : 'Avoid'}</div>
                      <div className="text-text-secondary text-xs">{vibeData.avoid.join(' · ')}</div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-text-secondary text-xs">{isDevanagari ? 'ऊर्जा' : 'Energy'}</div>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${vibeData.energyScore >= 70 ? 'bg-emerald-500' : vibeData.energyScore >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${vibeData.energyScore}%` }}
                    />
                  </div>
                  <div className="text-text-secondary text-xs font-mono">{vibeData.energyScore}%</div>
                </div>
              </div>
            );
          })()}

          {/* Daily Vibe Card Modal */}
          <AnimatePresence>
            {showVibeCard && panchang && (() => {
              const vibeData = generateDailyVibe(panchang, locale);
              return (
                <motion.div
                  key="vibe-modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                  onClick={() => setShowVibeCard(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative max-w-lg w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DailyVibeCard data={vibeData} format="square" locale={locale} />
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <button
                        onClick={() => {
                          const text = `${vibeData.vibeTitle.en} — Today's Energy Weather\n${vibeData.keyTransit}\nBest for: ${vibeData.bestFor.join(', ')}\nEnergy: ${vibeData.energyScore}%\n\nhttps://dekhopanchang.com/${locale}/panchang`;
                          if (navigator.share) {
                            navigator.share({ title: 'Today\'s Energy Weather', text }).catch(() => {
                              // User cancelled share — safe to ignore
                            });
                          } else {
                            navigator.clipboard.writeText(text).then(() => {
                              alert(isDevanagari ? 'कॉपी हो गया!' : 'Copied to clipboard!');
                            }).catch((err) => {
                              console.error('[DailyVibe] clipboard write failed:', err);
                            });
                          }
                        }}
                        className="px-5 py-2.5 text-sm font-semibold rounded-full bg-gold-primary/20 text-gold-light border border-gold-primary/30 hover:bg-gold-primary/30 transition-all"
                      >
                        {isDevanagari ? 'शेयर करें' : 'Share'}
                      </button>
                      <button
                        onClick={() => setShowVibeCard(false)}
                        className="px-5 py-2.5 text-sm font-medium rounded-full bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10 transition-all"
                      >
                        {isDevanagari ? 'बन्द करें' : 'Close'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {(() => {
            const tp = (tr?: TransitionInfo) => tr ? hasTransitionPassed(tr.endTime, tr.endDate, now, selectedDate, location.tz) : false;
            const fmt = (time: string, date?: string) => formatTransitionTime(time, date, panchang.date, locale);

            // Tithi: always show both (sunrise tithi + next tithi)
            const tithiTr = panchang.tithiTransition;
            const nextTithiData = tithiTr ? TITHIS[tithiTr.nextNumber - 1] : null;
            const tithiPassed = tp(tithiTr);

            // Nakshatra: always show both
            const nakTr = panchang.nakshatraTransition;
            const nextNakData = nakTr ? NAKSHATRAS[nakTr.nextNumber - 1] : null;
            const nakPassed = tp(nakTr);

            // Yoga / Karana — keep simple active-switching
            const yogaPassed = tp(panchang.yogaTransition);
            const activeYoga = yogaPassed && panchang.yogaTransition ? YOGAS[panchang.yogaTransition.nextNumber - 1] : panchang.yoga;
            const karanaPassed = tp(panchang.karanaTransition);
            const activeKarana = karanaPassed && panchang.karanaTransition ? KARANAS[panchang.karanaTransition.nextNumber - 1] : panchang.karana;

            const upto = msg('upto', locale);
            const onwards = msg('onwards', locale);

            return (
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-5 mb-14">
                {/* ── TITHI CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="relative rounded-2xl bg-gradient-to-br from-amber-900/15 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/20 p-3 sm:p-4 md:p-6 text-center hover:border-amber-500/40 transition-all cursor-default"
                >
                  {/* Auspiciousness badge */}
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] sm:text-[9px] font-bold border ${getNatureBg(panchang.tithi.paksha === 'shukla' ? 'auspicious' : 'neutral')} ${getNatureColor(panchang.tithi.paksha === 'shukla' ? 'auspicious' : 'neutral')}`}>
                    {getNatureLabel(panchang.tithi.paksha === 'shukla' ? 'auspicious' : 'neutral')}
                  </div>
                  <div className="flex justify-center mb-3"><TithiIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('tithi')}</div>
                  {/* First tithi (at sunrise) */}
                  <div className={`rounded-lg p-2.5 mb-2 border ${tithiPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
                    <div className="text-gold-light text-xl sm:text-2xl font-black leading-tight" style={headingFont}>
                      {tl(panchang.tithi.name)}
                    </div>
                    <div className="text-text-secondary text-xs mt-0.5">
                      {panchang.tithi.paksha === 'shukla' ? t('shukla') : t('krishna')}
                    </div>
                    {tithiTr && (
                      <>
                        <div className="mt-2 pt-2 border-t border-gold-primary/10">
                          <div className="font-mono text-sm text-amber-300 font-bold">
                            {fmt(tithiTr.startTime, tithiTr.startDate)} — {fmt(tithiTr.endTime, tithiTr.endDate)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Second tithi (after transition) */}
                  {nextTithiData && tithiTr && (
                    <div className={`rounded-lg p-2.5 border ${tithiPassed ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10 opacity-60'}`}>
                      <div className="text-gold-light text-xl sm:text-2xl font-black leading-tight" style={headingFont}>
                        {tl(nextTithiData.name)}
                      </div>
                      <div className="text-text-secondary text-xs mt-0.5">
                        {nextTithiData.paksha === 'shukla' ? t('shukla') : t('krishna')}
                      </div>
                      <div className="font-mono text-sm text-amber-300 font-bold mt-1.5">
                        {fmt(tithiTr.endTime, tithiTr.endDate)} {onwards}
                      </div>
                    </div>
                  )}
                  {/* Kshaya tithi badge */}
                  {panchang.kshayaTithi && (
                    <div className="mt-2 px-2.5 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs">
                      <span className="text-amber-400 font-semibold">
                        {locale === 'hi' ? 'क्षय तिथि' : locale === 'ta' ? 'க்ஷய திதி' : locale === 'bn' ? 'ক্ষয় তিথি' : 'Kshaya Tithi'}
                      </span>
                      <span className="text-text-secondary ml-1">
                        — {tl(panchang.kshayaTithi.tithi.name)} ({panchang.kshayaTithi.start}–{panchang.kshayaTithi.end})
                      </span>
                    </div>
                  )}
                  {/* Vriddhi tithi badge */}
                  {panchang.vriddhiTithi && (
                    <div className="mt-2 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs">
                      <span className="text-emerald-400 font-semibold">
                        {locale === 'hi' ? 'वृद्धि तिथि' : locale === 'ta' ? 'விருத்தி திதி' : locale === 'bn' ? 'বৃদ্ধি তিথি' : 'Vriddhi Tithi'}
                      </span>
                      <span className="text-text-secondary ml-1">
                        — {tl(panchang.tithi.name)} {locale === 'hi' ? 'दो सूर्योदय तक' : locale === 'ta' ? 'இரண்டு சூரிய உதயம் வரை' : locale === 'bn' ? 'দুই সূর্যোদয় জুড়ে' : 'spans two sunrises'}
                      </span>
                    </div>
                  )}
                  {/* Tithi contextual tip */}
                  <div className="text-text-secondary/70 text-xs mt-1.5 leading-snug">
                    {panchang.tithi.paksha === 'shukla'
                      ? msg('shukla', locale)
                      : msg('krishna', locale)
                    }{' — '}{msg('deity', locale)}{' '}{tl(panchang.tithi.deity)}
                  </div>
                  {/* Tithi insight */}
                  <InsightBlock insight={getTithiInsight(panchang.tithi.number, panchang.tithi.paksha as 'shukla' | 'krishna')} />
                  {/* Masa / Paksha — both systems */}
                  <div className="mt-3 pt-3 border-t border-gold-primary/10 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-text-secondary/60 uppercase tracking-wider text-[10px]">{msg('amant', locale)}</div>
                      <div className="text-gold-light font-semibold mt-0.5" style={headingFont}>{tl(panchang.amantMasa || panchang.masa)}</div>
                    </div>
                    <div>
                      <div className="text-text-secondary/60 uppercase tracking-wider text-[10px]">{msg('purnimant', locale)}</div>
                      <div className="text-gold-light font-semibold mt-0.5" style={headingFont}>{tl(panchang.purnimantMasa || panchang.masa)}</div>
                    </div>
                  </div>
                  {/* Festival indicator on tithi card */}
                  {panchang.festivals && panchang.festivals.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gold-primary/10 space-y-1.5">
                      {panchang.festivals.slice(0, 2).map((fest, fi) => (
                        <div
                          key={fi}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs ${
                            fest.type === 'major'
                              ? 'bg-gold-primary/15 border border-gold-primary/25'
                              : 'bg-violet-500/10 border border-violet-500/15'
                          }`}
                        >
                          <span className={`text-sm ${fest.type === 'major' ? '' : 'opacity-70'}`}>
                            {fest.type === 'major' ? '✦' : '◇'}
                          </span>
                          <span className={`font-bold truncate ${fest.type === 'major' ? 'text-gold-light' : 'text-violet-300/80'}`}>
                            {tl(fest.name)}
                          </span>
                        </div>
                      ))}
                      {panchang.festivals.length > 2 && (
                        <div className="text-text-secondary/40 text-[10px] text-center">
                          +{panchang.festivals.length - 2} {locale === 'hi' ? 'और' : 'more'}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* ── NAKSHATRA CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="relative rounded-2xl bg-gradient-to-br from-indigo-900/20 via-[#1a1040]/50 to-[#0a0e27] border border-indigo-400/20 p-3 sm:p-4 md:p-6 text-center hover:border-indigo-400/40 transition-all cursor-default"
                >
                  {/* Auspiciousness badge — nakshatra.nature is a descriptive LocaleText (e.g. "Soft, Tender", "Sharp, Fierce").
                      Map to auspicious/inauspicious/neutral using classical gana categories. */}
                  {(() => {
                    const natEn = (panchang.nakshatra.nature?.en || '').toLowerCase();
                    const naksNature = natEn.includes('soft') || natEn.includes('tender') || natEn.includes('movable') || natEn.includes('light') || natEn.includes('swift')
                      ? 'auspicious'
                      : natEn.includes('fierce') || natEn.includes('sharp') || natEn.includes('severe')
                        ? 'inauspicious'
                        : 'neutral';
                    return (
                      <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] sm:text-[9px] font-bold border ${getNatureBg(naksNature)} ${getNatureColor(naksNature)}`}>
                        {getNatureLabel(naksNature)}
                      </div>
                    );
                  })()}
                  <div className="flex justify-center mb-3"><NakshatraIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('nakshatra')}</div>
                  {/* First nakshatra (at sunrise) */}
                  <div className={`rounded-lg p-2.5 mb-2 border ${nakPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
                    <div className="text-gold-light text-xl sm:text-2xl font-black leading-tight" style={headingFont}>
                      {tl(panchang.nakshatra.name)}
                    </div>
                    <div className="text-text-secondary text-xs mt-0.5">
                      {tl(panchang.nakshatra.deity)}
                      {panchang.nakshatra.pada ? ` · ${msg('pada', locale)} ${panchang.nakshatra.pada}` : ''}
                    </div>
                    {nakTr && (
                      <div className="mt-2 pt-2 border-t border-gold-primary/10">
                        <div className="font-mono text-sm text-amber-300 font-bold">
                          {fmt(nakTr.startTime, nakTr.startDate)} — {fmt(nakTr.endTime, nakTr.endDate)}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Second nakshatra (after transition) */}
                  {nextNakData && nakTr && (
                    <div className={`rounded-lg p-2.5 border ${nakPassed ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10 opacity-60'}`}>
                      <div className="text-gold-light text-xl sm:text-2xl font-black leading-tight" style={headingFont}>
                        {tl(nextNakData.name)}
                      </div>
                      <div className="text-text-secondary text-xs mt-0.5">
                        {tl(nextNakData.deity)}
                      </div>
                      <div className="font-mono text-sm text-amber-300 font-bold mt-1.5">
                        {fmt(nakTr.endTime, nakTr.endDate)} {onwards}
                      </div>
                    </div>
                  )}
                  {/* Nakshatra contextual tip */}
                  <div className="text-text-secondary/70 text-xs mt-1.5 leading-snug">
                    {msg('nature', locale)}{' '}{tl(panchang.nakshatra.nature)}{' — '}{msg('ruler', locale)}{' '}{tl(panchang.nakshatra.rulerName)}
                  </div>
                  {/* Nakshatra insight */}
                  <InsightBlock insight={getNakshatraInsight(panchang.nakshatra.id)} />
                </motion.div>

                {/* ── YOGA CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="relative rounded-2xl bg-gradient-to-br from-purple-900/20 via-[#1a1040]/50 to-[#0a0e27] border border-purple-400/20 p-3 sm:p-4 md:p-6 text-center hover:border-purple-400/40 transition-all cursor-default"
                >
                  {/* Auspiciousness badge */}
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] sm:text-[9px] font-bold border ${getNatureBg(activeYoga.nature)} ${getNatureColor(activeYoga.nature)}`}>
                    {getNatureLabel(activeYoga.nature)}
                  </div>
                  <div className="flex justify-center mb-3"><YogaIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('yoga')}</div>
                  {/* First yoga (at sunrise) */}
                  <div className={`rounded-lg p-2.5 mb-2 border ${yogaPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
                    <div className="text-gold-light text-xl sm:text-2xl font-black leading-tight" style={headingFont}>{tl(panchang.yoga.name)}</div>
                    <div className="text-text-secondary text-xs mt-0.5">{tl(panchang.yoga.meaning)}</div>
                    {panchang.yogaTransition && (
                      <div className="mt-2 pt-2 border-t border-gold-primary/10">
                        <div className="font-mono text-sm text-amber-300 font-bold">
                          {fmt(panchang.yogaTransition.startTime, panchang.yogaTransition.startDate)} — {fmt(panchang.yogaTransition.endTime, panchang.yogaTransition.endDate)}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Second yoga (after transition) */}
                  {panchang.yogaTransition && (
                    <div className={`rounded-lg p-2.5 border ${yogaPassed ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10 opacity-60'}`}>
                      <div className="text-gold-light text-xl sm:text-2xl font-black leading-tight" style={headingFont}>{tl(panchang.yogaTransition.nextName)}</div>
                      <div className="text-text-secondary text-xs mt-0.5">{tl(YOGAS[panchang.yogaTransition.nextNumber - 1]?.meaning)}</div>
                      <div className="font-mono text-sm text-amber-300 font-bold mt-1.5">
                        {fmt(panchang.yogaTransition.endTime, panchang.yogaTransition.endDate)} {onwards}
                      </div>
                    </div>
                  )}
                  {/* Yoga contextual tip */}
                  <div className="text-text-secondary/70 text-xs mt-1.5 leading-snug">
                    {activeYoga.nature === 'auspicious'
                      ? msg('yogaFavorable', locale)
                      : activeYoga.nature === 'inauspicious'
                        ? msg('yogaUnfavorable', locale)
                        : msg('yogaNeutral', locale)
                    }
                  </div>
                  {/* Yoga insight */}
                  <InsightBlock insight={getYogaInsight(panchang.yoga.number)} />
                </motion.div>

                {/* ── KARANA CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="relative rounded-2xl bg-gradient-to-br from-teal-900/15 via-[#1a1040]/50 to-[#0a0e27] border border-teal-400/15 p-3 sm:p-4 md:p-6 text-center hover:border-teal-400/35 transition-all cursor-default"
                >
                  {/* Auspiciousness badge — derived from karana type: chara=auspicious, sthira=inauspicious, special=neutral */}
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] sm:text-[9px] font-bold border ${getNatureBg(activeKarana.type === 'chara' ? 'auspicious' : activeKarana.type === 'sthira' ? 'inauspicious' : 'neutral')} ${getNatureColor(activeKarana.type === 'chara' ? 'auspicious' : activeKarana.type === 'sthira' ? 'inauspicious' : 'neutral')}`}>
                    {getNatureLabel(activeKarana.type === 'chara' ? 'auspicious' : activeKarana.type === 'sthira' ? 'inauspicious' : 'neutral')}
                  </div>
                  <div className="flex justify-center mb-3"><KaranaIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('karana')}</div>
                  {/* First karana (at sunrise) */}
                  <div className={`rounded-lg p-2.5 mb-2 border ${karanaPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
                    <div className="text-gold-light text-xl sm:text-2xl font-black leading-tight" style={headingFont}>{tl(panchang.karana.name)}</div>
                    <div className="text-text-secondary text-xs mt-0.5">
                      {panchang.karana.type === 'chara' ? msg('movable', locale) : panchang.karana.type === 'sthira' ? msg('fixed', locale) : msg('special', locale)}
                    </div>
                    {panchang.karanaTransition && (
                      <div className="mt-2 pt-2 border-t border-gold-primary/10">
                        <div className="font-mono text-sm text-amber-300 font-bold">
                          {fmt(panchang.karanaTransition.startTime, panchang.karanaTransition.startDate)} — {fmt(panchang.karanaTransition.endTime, panchang.karanaTransition.endDate)}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Second karana (after transition) */}
                  {panchang.karanaTransition && (
                    <div className={`rounded-lg p-2.5 border ${karanaPassed ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10 opacity-60'}`}>
                      <div className="text-gold-light text-xl sm:text-2xl font-black leading-tight" style={headingFont}>{tl(panchang.karanaTransition.nextName)}</div>
                      <div className="text-text-secondary text-xs mt-0.5">
                        {(() => { const nk = KARANAS[panchang.karanaTransition!.nextNumber - 1]; return nk?.type === 'chara' ? msg('movable', locale) : nk?.type === 'sthira' ? msg('fixed', locale) : msg('special', locale); })()}
                      </div>
                      <div className="font-mono text-sm text-amber-300 font-bold mt-1.5">
                        {fmt(panchang.karanaTransition.endTime, panchang.karanaTransition.endDate)} {onwards}
                      </div>
                    </div>
                  )}
                  {/* Karana contextual tip */}
                  <div className="text-text-secondary/70 text-xs mt-1.5 leading-snug">
                    {activeKarana.type === 'chara'
                      ? msg('karanaChara', locale)
                      : activeKarana.type === 'sthira'
                        ? msg('karanaSthira', locale)
                        : msg('karanaSpecial', locale)
                    }
                  </div>
                  {/* Karana insight */}
                  <InsightBlock insight={getKaranaInsight(activeKarana.name?.en || '')} />
                </motion.div>

                {/* ── VARA CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="relative rounded-2xl bg-gradient-to-br from-orange-900/15 via-[#1a1040]/50 to-[#0a0e27] border border-orange-400/15 p-3 sm:p-4 md:p-6 text-center hover:border-orange-400/35 transition-all cursor-default"
                >
                  {/* Auspiciousness badge — derived from weekday lord: Sun/Mon/Thu/Fri=auspicious, Tue/Sat=inauspicious, Wed=neutral */}
                  {(() => {
                    const varaNature = [0, 1, 4, 5].includes(panchang.vara.day) ? 'auspicious' : [2, 6].includes(panchang.vara.day) ? 'inauspicious' : 'neutral';
                    return (
                      <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[11px] sm:text-[9px] font-bold border ${getNatureBg(varaNature)} ${getNatureColor(varaNature)}`}>
                        {getNatureLabel(varaNature)}
                      </div>
                    );
                  })()}
                  <div className="flex justify-center mb-3"><VaraIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('vara')}</div>
                  <div className="text-gold-light text-xl sm:text-2xl font-black leading-tight" style={headingFont}>{tl(panchang.vara.name)}</div>
                  <div className="text-text-secondary text-xs mt-2">{tl(panchang.vara.ruler)}</div>
                  {/* Vara quality badge + activities */}
                  {(() => {
                    const vq = VARA_QUALITY[panchang.vara.day];
                    if (!vq) return null;
                    const isShubh = vq.score >= 70;
                    const badgeColor = vq.score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : isShubh ? 'bg-emerald-500/12 text-emerald-400/80 border-emerald-500/20' : vq.score >= 50 ? 'bg-gold-primary/12 text-gold-primary border-gold-primary/20' : 'bg-amber-500/12 text-amber-400 border-amber-500/20';
                    return (
                      <div className="mt-2 space-y-1.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                          {tl(vq.quality)}
                        </span>
                        <div className="text-emerald-400/70 text-[10px] leading-snug">
                          ✓ {tl(vq.bestFor)}
                        </div>
                        <div className="text-amber-400/50 text-[10px] leading-snug">
                          ✗ {tl(vq.avoidFor)}
                        </div>
                      </div>
                    );
                  })()}
                  {/* Vara contextual tip */}
                  <div className="text-text-secondary/70 text-xs mt-1.5 leading-snug">
                    {msg('ruledBy', locale)}{' '}{tl(panchang.vara.ruler)}{' — '}{
                      panchang.vara.day === 0 ? msg('varaSun', locale)
                      : panchang.vara.day === 1 ? msg('varaMon', locale)
                      : panchang.vara.day === 2 ? msg('varaTue', locale)
                      : panchang.vara.day === 3 ? msg('varaWed', locale)
                      : panchang.vara.day === 4 ? msg('varaThu', locale)
                      : panchang.vara.day === 5 ? msg('varaFri', locale)
                      : msg('varaSat', locale)
                    }
                  </div>
                  {/* Vara insight */}
                  <InsightBlock insight={getVaraInsight(panchang.vara.day)} />
                </motion.div>
              </div>
            );
          })()}

          {/* ── Calculation Transparency Toggle ── */}
          <div className="-mt-10 mb-6">
            <button
              onClick={() => setShowCalcDetails(!showCalcDetails)}
              className="flex items-center gap-2 text-xs text-text-secondary hover:text-gold-primary transition-colors"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCalcDetails ? 'rotate-180' : ''}`} />
              {showCalcDetails ? 'Hide calculation details' : 'Show calculation details'}
            </button>

            <AnimatePresence>
              {showCalcDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' as const }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 bg-bg-secondary border border-gold-primary/10 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      {/* Tithi Calculation */}
                      <div className="space-y-1.5">
                        <div className="text-gold-primary font-medium">Tithi Derivation</div>
                        <div className="text-text-secondary">
                          {'Moon Elongation: '}<span className="text-text-primary font-mono">{panchang.moonElongation?.toFixed(2) ?? '\u2014'}{'\u00B0'}</span>
                        </div>
                        <div className="text-text-secondary">
                          {'Tithi = floor(elongation / 12) + 1 = '}<span className="text-text-primary font-mono">{panchang.tithi?.number}</span>
                        </div>
                        <div className="text-text-secondary">
                          {'Window: '}<span className="text-text-primary font-mono">{panchang.tithiTransition?.startTime ?? '\u2014'}{' \u2013 '}{panchang.tithiTransition?.endTime ?? '\u2014'}</span>
                        </div>
                      </div>

                      {/* Nakshatra Calculation */}
                      <div className="space-y-1.5">
                        <div className="text-gold-primary font-medium">Nakshatra Derivation</div>
                        <div className="text-text-secondary">
                          {'Moon Longitude: '}<span className="text-text-primary font-mono">{panchang.moonLongitude?.toFixed(4) ?? '\u2014'}{'\u00B0'}</span>
                        </div>
                        <div className="text-text-secondary">
                          {'Nakshatra = floor(lon / 13.333) + 1 = '}<span className="text-text-primary font-mono">{panchang.nakshatra?.id}</span>
                        </div>
                        <div className="text-text-secondary">
                          {'Window: '}<span className="text-text-primary font-mono">{panchang.nakshatraTransition?.startTime ?? '\u2014'}{' \u2013 '}{panchang.nakshatraTransition?.endTime ?? '\u2014'}</span>
                        </div>
                      </div>

                      {/* Yoga Calculation */}
                      <div className="space-y-1.5">
                        <div className="text-gold-primary font-medium">Yoga Derivation</div>
                        <div className="text-text-secondary">
                          {'Sun + Moon: '}<span className="text-text-primary font-mono">{panchang.sunLongitude != null && panchang.moonLongitude != null ? ((panchang.sunLongitude + panchang.moonLongitude) % 360).toFixed(2) : '\u2014'}{'\u00B0'}</span>
                        </div>
                        <div className="text-text-secondary">
                          {'Yoga = floor(sum / 13.333) + 1 = '}<span className="text-text-primary font-mono">{panchang.yoga?.number}</span>
                        </div>
                        <div className="text-text-secondary">
                          {'Window: '}<span className="text-text-primary font-mono">{panchang.yogaTransition?.startTime ?? '\u2014'}{' \u2013 '}{panchang.yogaTransition?.endTime ?? '\u2014'}</span>
                        </div>
                      </div>

                      {/* Karana Calculation */}
                      <div className="space-y-1.5">
                        <div className="text-gold-primary font-medium">Karana Derivation</div>
                        <div className="text-text-secondary">
                          {'Half-tithi = floor(elongation / 6) = '}<span className="text-text-primary font-mono">{panchang.moonElongation != null ? Math.floor(panchang.moonElongation / 6) : '\u2014'}</span>
                        </div>
                        <div className="text-text-secondary">
                          {'Window: '}<span className="text-text-primary font-mono">{panchang.karanaTransition?.startTime ?? '\u2014'}{' \u2013 '}{panchang.karanaTransition?.endTime ?? '\u2014'}</span>
                        </div>
                      </div>

                      {/* Astronomical Constants */}
                      <div className="space-y-1.5">
                        <div className="text-gold-primary font-medium">Reference Data</div>
                        <div className="text-text-secondary">
                          {'Julian Day: '}<span className="text-text-primary font-mono">{panchang.julianDay?.toFixed(4) ?? '\u2014'}</span>
                        </div>
                        <div className="text-text-secondary">
                          {'Ayanamsha: '}<span className="text-text-primary font-mono">{typeof panchang.ayanamsha === 'number' ? panchang.ayanamsha.toFixed(4) : '\u2014'}{'\u00B0'}</span>
                        </div>
                        <div className="text-text-secondary">
                          {'Sun (sid.): '}<span className="text-text-primary font-mono">{typeof panchang.sunLongitude === 'number' ? panchang.sunLongitude.toFixed(4) : '\u2014'}{'\u00B0'}</span>
                        </div>
                        <div className="text-text-secondary">
                          {'Moon (sid.): '}<span className="text-text-primary font-mono">{typeof panchang.moonLongitude === 'number' ? panchang.moonLongitude.toFixed(4) : '\u2014'}{'\u00B0'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-text-secondary/50 pt-2 border-t border-white/[0.04]">
                      All longitudes are sidereal (Lahiri ayanamsha). Transition times computed via binary search on the ephemeris.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ═══ TIMES — BOLD ═══ */}
          <GoldDivider />
          <p className="text-text-secondary/60 text-xs text-center mt-4 -mb-2 max-w-lg mx-auto">
            {isDevanagari
              ? 'सूर्योदय और सूर्यास्त वैदिक दिन (अहोरात्र) को परिभाषित करते हैं। सभी मुहूर्त, होरा और चौघड़िया इन्हीं क्षणों से गणित होते हैं।'
              : 'Sunrise and sunset define the Vedic day (ahoratra). All muhurta timings, hora divisions, and choghadiya periods are calculated from these exact moments.'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-8">
            {[
              { label: t('sunrise'), value: panchang.sunrise, Icon: SunriseIcon },
              { label: t('sunset'), value: panchang.sunset, Icon: SunsetIcon },
              { label: t('moonrise'), value: panchang.moonrise, Icon: MoonriseIcon },
              { label: t('moonset'), value: panchang.moonset, Icon: SunsetIcon },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: i < 2 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 flex items-center gap-4"
              >
                <item.Icon size={48} />
                <div>
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-semibold">{item.label}</div>
                  <div className="text-amber-300 font-mono text-2xl font-bold">{item.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <GoldDivider />

          {/* ═══ SUN & MOON SIGN + DAY INFO ═══ */}
          {(() => {
            const sunPlanet = panchang.planets.find(p => p.id === 0);
            const moonPlanet = panchang.planets.find(p => p.id === 1);
            const sunRashiData = RASHIS[(panchang.sunSign?.rashi || sunPlanet?.rashi || 1) - 1];
            const moonRashiData = RASHIS[(panchang.moonSign?.rashi || moonPlanet?.rashi || 1) - 1];
            const sunNakData = NAKSHATRAS[(panchang.sunSign?.nakshatra || sunPlanet?.nakshatra || 1) - 1];
            const moonNakData = NAKSHATRAS[(panchang.moonSign?.nakshatra || 1) - 1];

            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-8">
                {/* Sun Sign */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border border-amber-500/15">
                  <div className="flex justify-center mb-2"><RashiIconById id={panchang.sunSign?.rashi || sunPlanet?.rashi || 1} size={48} /></div>
                  <div className="text-amber-400 text-xs uppercase tracking-wider font-bold">{msg('sunSign', locale)}</div>
                  <div className="text-gold-light font-bold text-lg mt-1" style={headingFont}>{(sunRashiData?.name[locale] || sunRashiData?.name?.en || '')}</div>
                  <div className="text-text-secondary text-xs mt-1">{(sunNakData?.name[locale] || sunNakData?.name?.en || '')}</div>
                </motion.div>

                {/* Moon Sign */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border border-indigo-500/15">
                  <div className="flex justify-center mb-2"><RashiIconById id={panchang.moonSign?.rashi || moonPlanet?.rashi || 1} size={48} /></div>
                  <div className="text-indigo-400 text-xs uppercase tracking-wider font-bold">{msg('moonSign', locale)}</div>
                  <div className="text-gold-light font-bold text-lg mt-1" style={headingFont}>{(moonRashiData?.name[locale] || moonRashiData?.name?.en || '')}</div>
                  <div className="text-text-secondary text-xs mt-1">
                    {(moonNakData?.name[locale] || moonNakData?.name?.en || '')}
                    {panchang.moonSign?.pada ? ` · ${msg('pada', locale)} ${panchang.moonSign.pada}` : ''}
                  </div>
                </motion.div>

                {/* Dinamana / Ratrimana */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center">
                  <div className="flex justify-center mb-2"><Sun className="w-10 h-10 text-gold-primary" /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{msg('dayDuration', locale)}{locale === 'en' ? ' (दिनमान)' : ''}</div>
                  <div className="text-gold-light font-bold text-lg font-mono mt-1">{panchang.dinamana || '—'}</div>
                  <div className="text-text-secondary text-xs mt-1.5 uppercase tracking-wider">{msg('nightLabel', locale)}{locale === 'en' ? ' (रात्रिमान)' : ''}: <span className="font-mono text-text-primary">{panchang.ratrimana || '—'}</span></div>
                </motion.div>

                {/* Madhyahna */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center">
                  <div className="flex justify-center mb-2"><Clock className="w-10 h-10 text-gold-primary" /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{msg('madhyahna', locale)}</div>
                  <div className="text-gold-light font-bold text-2xl font-mono mt-1">{panchang.madhyahna || '—'}</div>
                  <div className="text-text-secondary text-xs mt-1">{msg('localMidday', locale)}</div>
                </motion.div>
              </div>
            );
          })()}

          {/* ═══ RITU · AYANA · CHANDRABALAM compact row ═══ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Ritu (Season) */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 text-center">
              <div className="flex justify-center mb-1.5"><RituIcon size={36} /></div>
              <div className="text-gold-dark text-[11px] sm:text-[10px] uppercase tracking-wider font-bold">{isDevanagari ? 'ऋतु' : 'Ritu'}</div>
              <div className="text-gold-light font-bold text-sm mt-0.5" style={headingFont}>{_tl(panchang.ritu, locale) || '\u2014'}</div>
            </div>
            {/* Ayana */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 text-center">
              <div className="flex justify-center mb-1.5"><AyanaIcon size={36} /></div>
              <div className="text-gold-dark text-[11px] sm:text-[10px] uppercase tracking-wider font-bold">{isDevanagari ? 'अयन' : 'Ayana'}</div>
              <div className="text-gold-light font-bold text-sm mt-0.5" style={headingFont}>{_tl(panchang.ayana, locale) || '\u2014'}</div>
            </div>
            {/* Chandrabalam — personalized if birth data available */}
            <Link href="/chandrabalam"
              className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border p-4 text-center hover:border-gold-primary/40 transition-all group block ${balamResult ? (balamResult.chandrabalam.favorable ? 'border-emerald-500/25' : 'border-red-500/25') : 'border-gold-primary/12'}`}>
              <div className="flex justify-center mb-1.5"><Moon className="w-8 h-8 text-gold-primary group-hover:scale-110 transition-transform" /></div>
              <div className="text-gold-dark text-[11px] sm:text-[10px] uppercase tracking-wider font-bold">{isDevanagari ? 'चन्द्रबल' : 'Chandrabalam'}</div>
              {balamResult && birthRashi > 0 ? (() => {
                const rashiName = RASHIS[birthRashi - 1] ? tl(RASHIS[birthRashi - 1].name) : '';
                return (
                  <div className={`text-sm font-bold mt-1 ${balamResult.chandrabalam.favorable ? 'text-emerald-400' : 'text-red-400'}`}>
                    {balamResult.chandrabalam.favorable
                      ? (isDevanagari ? `✓ शुभ (${rashiName})` : `✓ Favorable (${rashiName})`)
                      : (isDevanagari ? `✗ अशुभ (${rashiName})` : `✗ Unfavorable (${rashiName})`)}
                  </div>
                );
              })() : null}
              <div className="text-text-secondary text-[10px] mt-0.5">
                {isDevanagari ? 'सभी 12 राशियाँ \u2192' : 'All 12 signs \u2192'}
              </div>
            </Link>
            {/* Tarabalam — personalized if birth data available */}
            <Link href="/tarabalam"
              className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border p-4 text-center hover:border-gold-primary/40 transition-all group block ${balamResult ? (balamResult.tarabalam.favorable ? 'border-emerald-500/25' : 'border-red-500/25') : 'border-gold-primary/12'}`}>
              <div className="flex justify-center mb-1.5"><Sparkles className="w-8 h-8 text-gold-primary group-hover:scale-110 transition-transform" /></div>
              <div className="text-gold-dark text-[11px] sm:text-[10px] uppercase tracking-wider font-bold">{isDevanagari ? 'ताराबल' : 'Tarabalam'}</div>
              {balamResult && birthNakshatra > 0 ? (() => {
                const nakName = NAKSHATRAS[birthNakshatra - 1] ? tl(NAKSHATRAS[birthNakshatra - 1].name) : '';
                return (
                  <>
                    <div className={`text-sm font-bold mt-1 ${balamResult.tarabalam.favorable ? 'text-emerald-400' : 'text-red-400'}`}>
                      {balamResult.tarabalam.favorable
                        ? (isDevanagari ? `✓ शुभ (${nakName})` : `✓ Favorable (${nakName})`)
                        : (isDevanagari ? `✗ अशुभ (${nakName})` : `✗ Unfavorable (${nakName})`)}
                    </div>
                    <div className="text-text-secondary/60 text-[9px] mt-0.5">
                      {tl(balamResult.tarabalam.taraName)}
                    </div>
                  </>
                );
              })() : null}
              <div className="text-text-secondary text-[10px] mt-0.5">
                {isDevanagari ? 'सभी 27 नक्षत्र \u2192' : 'All 27 nakshatras \u2192'}
              </div>
            </Link>
          </div>

          {/* ═══ REGIONAL QUICK-ACCESS — locale-aware featured tools ═══ */}
          {(() => {
            // Regional specialization: surface the most-used tools for each locale.
            // Tamil: Pancha-Pakshi + Gowri Panchangam are the primary daily systems.
            // Hindi/North India: Choghadiya + Vrat calendar dominate daily practice.
            // Bengali: Tithi + Rashi are the primary reference points.
            // Others: default panchang tools.
            type QuickLink = { href: string; label: string; desc: string };
            const regionalLinks: QuickLink[] =
              locale === 'ta' ? [
                { href: '/pancha-pakshi', label: 'பஞ்ச பக்ஷி', desc: 'Today\'s ruling bird & activity' },
                { href: '/panchang/auspicious', label: 'கௌரி பஞ்சாங்கம்', desc: 'Gowri timings for today' },
                { href: '/hora', label: 'ஹோரை', desc: 'Current planetary hour' },
              ] : locale === 'te' ? [
                { href: '/pancha-pakshi', label: 'పంచ పక్షి', desc: 'Today\'s ruling bird' },
                { href: '/panchang/auspicious', label: 'శుభ సమయాలు', desc: 'Auspicious windows' },
                { href: '/hora', label: 'హోర', desc: 'Planetary hours' },
              ] : locale === 'bn' ? [
                { href: '/panchang/tithi', label: 'তিথি বিশদ', desc: 'Today\'s tithi analysis' },
                { href: '/panchang/auspicious', label: 'শুভ সময়', desc: 'Auspicious timings' },
                { href: '/calendar', label: 'পঞ্জিকা', desc: 'Festival calendar' },
              ] : (locale === 'hi' || locale === 'gu') ? [
                { href: '/choghadiya', label: isDevanagari ? 'चौघड़िया' : 'Choghadiya', desc: isDevanagari ? 'आज के शुभ-अशुभ चौघड़िया' : 'Today\'s auspicious periods' },
                { href: '/panchang/auspicious', label: isDevanagari ? 'व्रत एवं शुभ काल' : 'Vrat & Timings', desc: isDevanagari ? 'अमृत काल · राहु काल · वर्ज्यम' : 'Amrit Kalam · Rahu Kaal · Varjyam' },
                { href: '/hora', label: isDevanagari ? 'होरा' : 'Hora', desc: isDevanagari ? 'वर्तमान ग्रहीय होरा' : 'Current planetary hour' },
              ] : []; // English/default: no regional banner, mega grid is sufficient

            if (regionalLinks.length === 0) return null;
            return (
              <div className="mb-6">
                <p className="text-text-secondary/60 text-xs uppercase tracking-widest font-bold mb-3 text-center">
                  {locale === 'ta' ? 'இன்றைக்கு' : locale === 'te' ? 'ఈ రోజు' : locale === 'bn' ? 'আজকের জন্য' : isDevanagari ? 'आज आपके लिए' : 'For You Today'}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {regionalLinks.map(link => (
                    <a key={link.href} href={`/${locale}${link.href}`}
                      className="rounded-xl border border-gold-primary/15 bg-gradient-to-br from-gold-primary/5 to-transparent px-4 py-3 text-center hover:border-gold-primary/40 hover:bg-gold-primary/8 transition-all group">
                      <div className="text-gold-light text-sm font-bold group-hover:text-gold-primary transition-colors"
                        style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {link.label}
                      </div>
                      <div className="text-text-secondary/60 text-xs mt-0.5">{link.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ═══ MEGA CARD GRID — tarot-style cards linking to subpages ═══ */}
          {/* Row 1: 5 cards — reordered by locale */}
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 my-14 auto-rows-fr">
            {reorderCards([
              {
                href: '/panchang/auspicious',
                title: isDevanagari ? 'शुभ-अशुभ काल' : 'Sacred Timings',
                subtitle: isDevanagari ? 'मुहूर्त एवं निषिद्ध काल' : 'Auspicious & Inauspicious',
                preview: isDevanagari ? 'अभिजित · अमृत काल · राहु काल · वर्ज्यम' : 'Abhijit · Amrit Kalam · Rahu Kaal · Varjyam',
                color: 'emerald',
                glowColor: '#34d399',
                // Tarot: Dramatic sun/hourglass hybrid — cosmic clock
                svg: <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true"><defs><radialGradient id="tc1r" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#34d399" stopOpacity="0.3"/><stop offset="100%" stopColor="#34d399" stopOpacity="0"/></radialGradient><linearGradient id="tc1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="50%" stopColor="#d4a853"/><stop offset="100%" stopColor="#8a6d2b"/></linearGradient></defs><circle cx="32" cy="32" r="28" fill="url(#tc1r)"/><circle cx="32" cy="32" r="14" fill="url(#tc1)" opacity="0.15" stroke="url(#tc1)" strokeWidth="2.5"/><circle cx="32" cy="32" r="7" fill="url(#tc1)" opacity="0.35"/><circle cx="32" cy="32" r="3" fill="#f0d48a" opacity="0.7"/>{Array.from({length:12},(_,i)=>{const a=Math.PI*2*i/12;const inner=i%2===0?17:18;const outer=i%2===0?28:24;return <line key={i} x1={r2(32+inner*Math.cos(a))} y1={r2(32+inner*Math.sin(a))} x2={r2(32+outer*Math.cos(a))} y2={r2(32+outer*Math.sin(a))} stroke="url(#tc1)" strokeWidth={i%2===0?"2.5":"1.5"} strokeLinecap="round" opacity={i%2===0?0.9:0.5}/>})}<path d="M29,18 L32,32 L35,18 Z" fill="url(#tc1)" opacity="0.25"/><path d="M29,46 L32,32 L35,46 Z" fill="url(#tc1)" opacity="0.25"/><circle cx="32" cy="18" r="1.5" fill="#f0d48a" opacity="0.6"/><circle cx="32" cy="46" r="1.5" fill="#f0d48a" opacity="0.6"/></svg>,
              },
              {
                href: '/choghadiya',
                title: isDevanagari ? 'चौघड़िया' : 'Choghadiya',
                subtitle: isDevanagari ? 'आठ-पहर पद्धति' : '8-fold Day & Night',
                preview: isDevanagari ? 'शुभ · लाभ · अमृत' : 'Shubh · Labh · Amrit',
                color: 'amber',
                glowColor: '#d4a853',
                // Tarot: Bold 8-segment dharma wheel
                svg: <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true"><defs><radialGradient id="tc2r" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.25"/><stop offset="100%" stopColor="#d4a853" stopOpacity="0"/></radialGradient><linearGradient id="tc2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="50%" stopColor="#d4a853"/><stop offset="100%" stopColor="#8a6d2b"/></linearGradient></defs><circle cx="32" cy="32" r="28" fill="url(#tc2r)"/><polygon points={Array.from({length:8},(_,i)=>`${r2(32+27*Math.cos(Math.PI*2*i/8-Math.PI/8))},${r2(32+27*Math.sin(Math.PI*2*i/8-Math.PI/8))}`).join(' ')} fill="url(#tc2)" opacity="0.08" stroke="url(#tc2)" strokeWidth="2.5"/><polygon points={Array.from({length:8},(_,i)=>`${r2(32+18*Math.cos(Math.PI*2*i/8))},${r2(32+18*Math.sin(Math.PI*2*i/8))}`).join(' ')} fill="url(#tc2)" opacity="0.12" stroke="url(#tc2)" strokeWidth="1.5"/>{Array.from({length:8},(_,i)=>{const a=Math.PI*2*i/8;return <line key={i} x1={r2(32+6*Math.cos(a))} y1={r2(32+6*Math.sin(a))} x2={r2(32+27*Math.cos(a))} y2={r2(32+27*Math.sin(a))} stroke="url(#tc2)" strokeWidth="1.2" opacity="0.35"/>})}<circle cx="32" cy="32" r="6" fill="url(#tc2)" opacity="0.2" stroke="url(#tc2)" strokeWidth="2"/><circle cx="32" cy="32" r="2.5" fill="#f0d48a" opacity="0.7"/>{Array.from({length:8},(_,i)=>{const a=Math.PI*2*i/8;return <circle key={`d${i}`} cx={r2(32+22*Math.cos(a))} cy={r2(32+22*Math.sin(a))} r="1.5" fill="#f0d48a" opacity="0.5"/>})}</svg>,
              },
              {
                href: '/hora',
                title: isDevanagari ? 'होरा' : 'Hora',
                subtitle: isDevanagari ? 'ग्रहीय प्रहर' : 'Planetary Hours',
                preview: isDevanagari ? '24 होरा चक्र' : '24-Hour Cycle',
                color: 'gold',
                glowColor: '#8b5cf6',
                // Tarot: Dramatic planetary clock with 7 symbols
                svg: <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true"><defs><radialGradient id="tc3r" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25"/><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/></radialGradient><linearGradient id="tc3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="50%" stopColor="#d4a853"/><stop offset="100%" stopColor="#8a6d2b"/></linearGradient></defs><circle cx="32" cy="32" r="28" fill="url(#tc3r)"/><circle cx="32" cy="32" r="26" fill="none" stroke="url(#tc3)" strokeWidth="2.5" opacity="0.7"/><circle cx="32" cy="32" r="22" fill="none" stroke="url(#tc3)" strokeWidth="1" opacity="0.3"/><circle cx="32" cy="32" r="15" fill="url(#tc3)" opacity="0.06"/>{(['☉','☽','♂','☿','♃','♀','♄'] as const).map((sym,i)=>{const a=Math.PI*2*i/7-Math.PI/2;return <text key={i} x={r2(32+22*Math.cos(a))} y={r2(32+22*Math.sin(a)+1.5)} textAnchor="middle" fill="#f0d48a" fontSize="5" opacity="0.75">{sym}</text>})}<line x1="32" y1="32" x2="32" y2="12" stroke="url(#tc3)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/><line x1="32" y1="32" x2="46" y2="28" stroke="url(#tc3)" strokeWidth="2" strokeLinecap="round" opacity="0.65"/><circle cx="32" cy="32" r="4" fill="url(#tc3)" opacity="0.3" stroke="url(#tc3)" strokeWidth="1.5"/><circle cx="32" cy="32" r="1.5" fill="#f0d48a" opacity="0.8"/>{Array.from({length:12},(_,i)=>{const a=Math.PI*2*i/12;return <circle key={`t${i}`} cx={r2(32+26*Math.cos(a))} cy={r2(32+26*Math.sin(a))} r={i%3===0?"1.2":"0.6"} fill="#f0d48a" opacity={i%3===0?0.6:0.3}/>})}</svg>,
              },
              {
                href: '/panchang/muhurta',
                title: isDevanagari ? 'मुहूर्त' : 'Muhurtas',
                subtitle: isDevanagari ? 'दैनिक 30 मुहूर्त' : '30 Daily Periods',
                preview: isDevanagari ? 'अभिजित · विजय · ब्रह्म' : 'Abhijit · Vijaya · Brahma',
                color: 'violet',
                glowColor: '#d4a853',
                // Tarot: Bold crescent moon cradling a star
                svg: <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true"><defs><radialGradient id="tc4r" cx="40%" cy="40%" r="55%"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.2"/><stop offset="100%" stopColor="#d4a853" stopOpacity="0"/></radialGradient><linearGradient id="tc4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="50%" stopColor="#d4a853"/><stop offset="100%" stopColor="#8a6d2b"/></linearGradient></defs><circle cx="32" cy="32" r="28" fill="url(#tc4r)"/><path d="M 36 6 A 24 24 0 1 0 36 58 A 18 18 0 1 1 36 6" fill="url(#tc4)" opacity="0.15" stroke="url(#tc4)" strokeWidth="2.5"/><polygon points="48,22 50.5,28.5 57,29.5 52,34 53.5,40.5 48,37 42.5,40.5 44,34 39,29.5 45.5,28.5" fill="url(#tc4)" opacity="0.35" stroke="url(#tc4)" strokeWidth="1.5"/><circle cx="52" cy="14" r="1.2" fill="#f0d48a" opacity="0.6"/><circle cx="56" cy="24" r="0.8" fill="#f0d48a" opacity="0.4"/><circle cx="54" cy="46" r="1" fill="#f0d48a" opacity="0.5"/><circle cx="44" cy="50" r="0.7" fill="#f0d48a" opacity="0.35"/><circle cx="58" cy="36" r="0.6" fill="#f0d48a" opacity="0.3"/><circle cx="50" cy="10" r="0.5" fill="#f0d48a" opacity="0.25"/></svg>,
              },
              {
                href: '/panchang/nivas',
                title: isDevanagari ? 'निवास एवं शूल' : 'Nivas & Shool',
                subtitle: isDevanagari ? 'दिशा एवं देव निवास' : 'Directions & Abodes',
                preview: `${isDevanagari ? 'शूल' : 'Shool'}: ${panchang.dishaShool?.direction?.[locale] || panchang.dishaShool?.direction?.en || '—'}`,
                color: 'indigo',
                glowColor: '#f43f5e',
                // Tarot: Bold compass rose with decorative cardinal points
                svg: <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true"><defs><radialGradient id="tc5r" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2"/><stop offset="100%" stopColor="#f43f5e" stopOpacity="0"/></radialGradient><linearGradient id="tc5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="50%" stopColor="#d4a853"/><stop offset="100%" stopColor="#8a6d2b"/></linearGradient></defs><circle cx="32" cy="32" r="28" fill="url(#tc5r)"/><circle cx="32" cy="32" r="27" fill="none" stroke="url(#tc5)" strokeWidth="1.5" opacity="0.3"/><circle cx="32" cy="32" r="20" fill="none" stroke="url(#tc5)" strokeWidth="1" opacity="0.2"/><polygon points="32,4 35,26 32,30 29,26" fill="url(#tc5)" opacity="0.7" stroke="url(#tc5)" strokeWidth="1.5"/><polygon points="60,32 38,35 34,32 38,29" fill="url(#tc5)" opacity="0.4" stroke="url(#tc5)" strokeWidth="1"/><polygon points="32,60 29,38 32,34 35,38" fill="url(#tc5)" opacity="0.4" stroke="url(#tc5)" strokeWidth="1"/><polygon points="4,32 26,29 30,32 26,35" fill="url(#tc5)" opacity="0.4" stroke="url(#tc5)" strokeWidth="1"/>{Array.from({length:4},(_,i)=>{const a=Math.PI*2*i/4+Math.PI/4;return <line key={i} x1={r2(32+8*Math.cos(a))} y1={r2(32+8*Math.sin(a))} x2={r2(32+18*Math.cos(a))} y2={r2(32+18*Math.sin(a))} stroke="url(#tc5)" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>})}<circle cx="32" cy="32" r="5" fill="url(#tc5)" opacity="0.2" stroke="url(#tc5)" strokeWidth="2"/><circle cx="32" cy="32" r="2" fill="#f0d48a" opacity="0.7"/></svg>,
              },
            ] as { href: string; title: string; subtitle: string; preview: string; color: string; glowColor: string; svg: React.ReactNode }[]).map((card) => (
              <TarotCard
                key={card.href}
                size="full"
                href={card.href}
                subtitle={card.subtitle}
                icon={card.svg}
                title={card.title}
                description={card.preview}
                glowColor={card.glowColor}
              />
            ))}
          </div>

          {/* Row 2: 5 cards — reordered by locale */}
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 -mt-8 mb-14 auto-rows-fr">
            {reorderCards([
              {
                href: '/panchang/planets',
                title: isDevanagari ? 'नवग्रह' : 'Navagraha',
                subtitle: isDevanagari ? 'ग्रह स्थिति' : 'Planetary Positions',
                preview: isDevanagari ? 'नवग्रह देशांतर' : '9 Planet Longitudes',
                color: 'sky',
                glowColor: '#38bdf8',
                // Tarot: 9 planetary orbs with orbital ellipses
                svg: <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true"><defs><radialGradient id="tc6r" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25"/><stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/></radialGradient><linearGradient id="tc6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="50%" stopColor="#d4a853"/><stop offset="100%" stopColor="#8a6d2b"/></linearGradient></defs><circle cx="32" cy="32" r="28" fill="url(#tc6r)"/><ellipse cx="32" cy="32" rx="26" ry="12" fill="none" stroke="url(#tc6)" strokeWidth="0.8" opacity="0.2" transform="rotate(-15 32 32)"/><ellipse cx="32" cy="32" rx="20" ry="10" fill="none" stroke="url(#tc6)" strokeWidth="0.8" opacity="0.15" transform="rotate(25 32 32)"/><ellipse cx="32" cy="32" rx="14" ry="8" fill="none" stroke="url(#tc6)" strokeWidth="0.6" opacity="0.15" transform="rotate(-40 32 32)"/><circle cx="32" cy="32" r="6" fill="url(#tc6)" opacity="0.3" stroke="url(#tc6)" strokeWidth="2"/><circle cx="32" cy="32" r="2.5" fill="#f0d48a" opacity="0.8"/>{[[16,20,3.5],[48,24,3],[22,46,2.8],[44,44,2.5],[12,32,2.2],[52,36,2],[26,14,2.3],[38,50,1.8]].map(([cx,cy,rr],i)=><circle key={i} cx={cx} cy={cy} r={rr} fill="url(#tc6)" opacity={0.25+i*0.04} stroke="url(#tc6)" strokeWidth="1.2"/>)}</svg>,
              },
              {
                href: '/panchang/remedies',
                title: isDevanagari ? 'उपाय' : 'Remedies',
                subtitle: isDevanagari ? 'आज के उपचार' : "Today's Prescriptions",
                preview: `${tl(panchang.vara?.name) || ''} · ${['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'][panchang.vara?.day ?? 0] || ''}`,
                color: 'amber',
                glowColor: '#f59e0b',
                // Tarot: Glowing gemstone with prismatic facets and light rays
                svg: <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true"><defs><radialGradient id="tc7r" cx="50%" cy="40%" r="55%"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3"/><stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/></radialGradient><linearGradient id="tc7" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="50%" stopColor="#d4a853"/><stop offset="100%" stopColor="#8a6d2b"/></linearGradient><linearGradient id="tc7b" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f0d48a" stopOpacity="0.4"/><stop offset="100%" stopColor="#8a6d2b" stopOpacity="0.1"/></linearGradient></defs><circle cx="32" cy="32" r="28" fill="url(#tc7r)"/>{[[32,6,2],[26,3,1.2],[38,4,0.8],[22,8,0.6],[42,7,0.7]].map(([cx,cy,rr],i)=><line key={`r${i}`} x1={32} y1={14} x2={cx} y2={cy} stroke="#f0d48a" strokeWidth={rr} strokeLinecap="round" opacity={0.3-i*0.04}/>)}<polygon points="32,8 48,24 44,52 20,52 16,24" fill="url(#tc7b)" stroke="url(#tc7)" strokeWidth="2.5" strokeLinejoin="round"/><line x1="32" y1="8" x2="44" y2="52" stroke="url(#tc7)" strokeWidth="1" opacity="0.3"/><line x1="32" y1="8" x2="20" y2="52" stroke="url(#tc7)" strokeWidth="1" opacity="0.3"/><line x1="16" y1="24" x2="48" y2="24" stroke="url(#tc7)" strokeWidth="1.2" opacity="0.35"/><polygon points="32,8 48,24 16,24" fill="url(#tc7)" opacity="0.2"/><polygon points="16,24 20,52 32,38" fill="url(#tc7)" opacity="0.08"/><polygon points="48,24 44,52 32,38" fill="url(#tc7)" opacity="0.14"/><circle cx="32" cy="14" r="2" fill="#f0d48a" opacity="0.5"/></svg>,
              },
              {
                href: '/panchang/masa',
                title: isDevanagari ? 'हिन्दू मास' : 'Hindu Months',
                subtitle: isDevanagari ? 'मास पंचांग' : 'Lunar Calendar',
                preview: `${tl(panchang.amantMasa || panchang.masa)}`,
                color: 'gold',
                glowColor: '#d4a853',
                // Tarot: Moon phase arc — 5 phases from new to full
                svg: <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true"><defs><radialGradient id="tc8r" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.2"/><stop offset="100%" stopColor="#d4a853" stopOpacity="0"/></radialGradient><linearGradient id="tc8" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="50%" stopColor="#d4a853"/><stop offset="100%" stopColor="#8a6d2b"/></linearGradient></defs><circle cx="32" cy="32" r="28" fill="url(#tc8r)"/><path d="M 6,40 Q 16,20 32,16 Q 48,20 58,40" fill="none" stroke="url(#tc8)" strokeWidth="1" opacity="0.25"/><circle cx="10" cy="36" r="5" fill="none" stroke="url(#tc8)" strokeWidth="1.5" opacity="0.4"/><circle cx="10" cy="36" r="5" fill="url(#tc8)" opacity="0.05"/><circle cx="22" cy="26" r="6" fill="none" stroke="url(#tc8)" strokeWidth="1.8" opacity="0.55"/><path d="M 22,20 A 6,6 0 0,1 22,32 A 3,6 0 0,0 22,20" fill="url(#tc8)" opacity="0.25"/><circle cx="34" cy="22" r="7" fill="none" stroke="url(#tc8)" strokeWidth="2" opacity="0.7"/><path d="M 34,15 A 7,7 0 0,1 34,29 A 2,7 0 0,0 34,15" fill="url(#tc8)" opacity="0.3"/><circle cx="46" cy="28" r="6" fill="none" stroke="url(#tc8)" strokeWidth="1.8" opacity="0.6"/><path d="M 46,22 A 6,6 0 0,1 46,34 A 1,6 0 0,0 46,22" fill="url(#tc8)" opacity="0.35"/><circle cx="56" cy="36" r="5" fill="url(#tc8)" opacity="0.35" stroke="url(#tc8)" strokeWidth="2"/><circle cx="56" cy="36" r="2" fill="#f0d48a" opacity="0.5"/>{[[14,48,0.6],[28,44,0.8],[42,46,0.7],[52,48,0.5],[8,46,0.4]].map(([cx,cy,rr],i)=><circle key={i} cx={cx} cy={cy} r={rr} fill="#f0d48a" opacity={0.2+i*0.04}/>)}</svg>,
              },
              {
                href: '/sky',
                title: isDevanagari ? 'आकाश' : 'Live Sky',
                subtitle: isDevanagari ? 'नक्षत्र मानचित्र' : 'Sky Map',
                preview: isDevanagari ? 'वास्तविक समय आकाश' : 'Real-time Positions',
                color: 'sky',
                glowColor: '#38bdf8',
                // Tarot: Dramatic constellation with bright stars and connecting lines
                svg: <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true"><defs><radialGradient id="tc9r" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2"/><stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/></radialGradient><linearGradient id="tc9" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="50%" stopColor="#d4a853"/><stop offset="100%" stopColor="#8a6d2b"/></linearGradient></defs><circle cx="32" cy="32" r="28" fill="url(#tc9r)"/>{[[8,12],[14,28],[18,48],[30,16],[32,38],[46,12],[50,30],[54,48],[38,54]].map(([cx,cy],i)=><circle key={`bg${i}`} cx={cx} cy={cy} r="5" fill="url(#tc9)" opacity="0.04"/>)}<line x1="30" y1="16" x2="46" y2="12" stroke="url(#tc9)" strokeWidth="1.2" opacity="0.4"/><line x1="30" y1="16" x2="14" y2="28" stroke="url(#tc9)" strokeWidth="1.2" opacity="0.35"/><line x1="14" y1="28" x2="18" y2="48" stroke="url(#tc9)" strokeWidth="1" opacity="0.3"/><line x1="46" y1="12" x2="50" y2="30" stroke="url(#tc9)" strokeWidth="1.2" opacity="0.4"/><line x1="50" y1="30" x2="54" y2="48" stroke="url(#tc9)" strokeWidth="1" opacity="0.3"/><line x1="50" y1="30" x2="32" y2="38" stroke="url(#tc9)" strokeWidth="1" opacity="0.35"/><line x1="32" y1="38" x2="14" y2="28" stroke="url(#tc9)" strokeWidth="1" opacity="0.3"/><line x1="32" y1="38" x2="38" y2="54" stroke="url(#tc9)" strokeWidth="0.8" opacity="0.25"/><line x1="18" y1="48" x2="38" y2="54" stroke="url(#tc9)" strokeWidth="0.8" opacity="0.2"/><circle cx="30" cy="16" r="3.5" fill="url(#tc9)" opacity="0.5" stroke="url(#tc9)" strokeWidth="1.5"/><circle cx="46" cy="12" r="3" fill="url(#tc9)" opacity="0.45" stroke="url(#tc9)" strokeWidth="1.5"/><circle cx="14" cy="28" r="2.8" fill="url(#tc9)" opacity="0.4" stroke="url(#tc9)" strokeWidth="1.2"/><circle cx="50" cy="30" r="3.2" fill="url(#tc9)" opacity="0.45" stroke="url(#tc9)" strokeWidth="1.5"/><circle cx="32" cy="38" r="3.8" fill="url(#tc9)" opacity="0.55" stroke="url(#tc9)" strokeWidth="1.8"/><circle cx="18" cy="48" r="2.5" fill="url(#tc9)" opacity="0.35" stroke="url(#tc9)" strokeWidth="1"/><circle cx="54" cy="48" r="2.2" fill="url(#tc9)" opacity="0.3" stroke="url(#tc9)" strokeWidth="1"/><circle cx="38" cy="54" r="2" fill="url(#tc9)" opacity="0.3" stroke="url(#tc9)" strokeWidth="0.8"/><circle cx="8" cy="12" r="1.5" fill="url(#tc9)" opacity="0.2"/>{[[5,42,0.5],[56,8,0.7],[24,58,0.4],[48,56,0.6],[6,56,0.5],[58,20,0.8],[40,6,0.6],[20,8,0.4]].map(([cx,cy,rr],i)=><circle key={`s${i}`} cx={cx} cy={cy} r={rr} fill="#f0d48a" opacity={0.15+i*0.02}/>)}</svg>,
              },
              {
                href: '/panchang/activity-guide',
                title: isDevanagari ? 'नक्षत्र मार्गदर्शन' : 'Activity Guide',
                subtitle: isDevanagari ? 'नक्षत्र गतिविधि' : 'Nakshatra Activities',
                preview: `${tl(panchang.nakshatra?.name) || '—'} — ${isDevanagari ? 'अनुकूल कार्य' : 'Favorable actions'}`,
                color: 'gold',
                glowColor: '#d4a853',
                // Tarot: Large bold pentagram/guiding star with layered depth
                svg: <svg viewBox="0 0 64 64" width={128} height={128} aria-hidden="true"><defs><radialGradient id="tc10r" cx="50%" cy="45%" r="50%"><stop offset="0%" stopColor="#d4a853" stopOpacity="0.25"/><stop offset="100%" stopColor="#d4a853" stopOpacity="0"/></radialGradient><linearGradient id="tc10" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="50%" stopColor="#d4a853"/><stop offset="100%" stopColor="#8a6d2b"/></linearGradient></defs><circle cx="32" cy="34" r="28" fill="url(#tc10r)"/><polygon points="32,4 38,22 56,22 42,34 47,52 32,42 17,52 22,34 8,22 26,22" fill="url(#tc10)" opacity="0.12" stroke="url(#tc10)" strokeWidth="2.5" strokeLinejoin="round"/><polygon points="32,12 36,24 48,24 38,32 42,44 32,36 22,44 26,32 16,24 28,24" fill="url(#tc10)" opacity="0.15" stroke="url(#tc10)" strokeWidth="1"/><circle cx="32" cy="30" r="7" fill="url(#tc10)" opacity="0.15" stroke="url(#tc10)" strokeWidth="1.5"/><circle cx="32" cy="30" r="3" fill="#f0d48a" opacity="0.5"/>{[[32,4],[56,22],[47,52],[17,52],[8,22]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="1.5" fill="#f0d48a" opacity="0.45"/>)}{Array.from({length:5},(_,i)=>{const a=Math.PI*2*i/5-Math.PI/2;const cx=r2(32+28*Math.cos(a));const cy=r2(34+28*Math.sin(a));return <line key={`ray${i}`} x1={r2(32+20*Math.cos(a))} y1={r2(34+20*Math.sin(a))} x2={cx} y2={cy} stroke="url(#tc10)" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/>})}</svg>,
              },
            ] as { href: string; title: string; subtitle: string; preview: string; color: string; glowColor: string; svg: React.ReactNode }[]).map((card) => (
              <TarotCard
                key={card.href}
                size="full"
                href={card.href}
                subtitle={card.subtitle}
                icon={card.svg}
                title={card.title}
                description={card.preview}
                glowColor={card.glowColor}
              />
            ))}
          </div>

          {/* ═══ COMPACT DAY TIMELINE — Sacred Timings preview ═══ */}
          <div className="mb-10 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 hover:border-gold-primary/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gold-light text-base font-bold" style={headingFont}>
                {isDevanagari ? 'आज का शुभ-अशुभ काल' : "Today's Sacred Timings"}
              </h3>
              <Link href="/panchang/auspicious" className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors">
                {isDevanagari ? 'सभी देखें →' : 'See all →'}
              </Link>
            </div>
            <DayTimeline
              panchang={panchang}
              sunrise={panchang.sunrise}
              sunset={panchang.sunset}
              compact={true}
              locale={locale}
            />
          </div>

          {/* ═══ SPECIAL AUSPICIOUS YOGAS — highlight when active ═══ */}
          {panchang.specialYogas && panchang.specialYogas.filter(y => y.isActive).length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gold-gradient mb-4 text-center" style={headingFont}>
                {isDevanagari ? '✦ विशेष शुभ योग ✦' : '✦ Special Auspicious Yogas ✦'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {panchang.specialYogas.filter(y => y.isActive).map((yoga, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/25 rounded-xl p-4 auspicious-glow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gold-light text-lg">✦</span>
                      <span className="text-gold-light font-bold text-sm" style={headingFont}>
                        {tl(yoga.name)}
                      </span>
                    </div>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {tl(yoga.description)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ PANCHAK & HOLASHTAK WARNINGS ═══ */}
          {(panchang.panchakInfo?.isActive || panchang.holashtak?.isActive) && (
            <div className="space-y-4 mb-10">
              {panchang.panchakInfo?.isActive && (
                <div className="rounded-xl bg-red-500/8 border border-red-500/20 p-4 caution-glow">
                  <h4 className="text-red-400 font-bold text-sm mb-1" style={headingFont}>
                    {isDevanagari ? '⚠ पंचक सक्रिय' : '⚠ Panchak Active'}
                  </h4>
                  <p className="text-text-secondary text-xs">
                    {panchang.panchakInfo.description[isDevanagari ? 'hi' : 'en']}
                  </p>
                  <div className="mt-2 space-y-1">
                    {panchang.panchakInfo.avoidActivities.map((act, i) => (
                      <p key={i} className="text-red-300/60 text-xs">
                        ✗ {act[isDevanagari ? 'hi' : 'en']}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {panchang.holashtak?.isActive && (
                <div className="rounded-xl bg-red-500/8 border border-red-500/20 p-4 caution-glow">
                  <h4 className="text-red-400 font-bold text-sm mb-1" style={headingFont}>
                    {isDevanagari ? `⚠ होलाष्टक — दिवस ${panchang.holashtak.dayNumber}/8` : `⚠ Holashtak — Day ${panchang.holashtak.dayNumber}/8`}
                  </h4>
                  <p className="text-text-secondary text-xs">
                    {panchang.holashtak.description[isDevanagari ? 'hi' : 'en']}
                  </p>
                </div>
              )}
            </div>
          )}

          <GoldDivider />
          {/* Sections removed — now live on subpages. Mega card grid above links to them. */}
        </>
      ) : null}

      {/* ═══ PERSONAL OVERLAY ═══ */}
      {personalDay && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mb-8 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4"
        >
          <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">
            {msg('yourDay', locale)}
          </div>
          <div className="flex items-center gap-4">
            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
              personalDay.dayQuality === 'excellent' ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' :
              personalDay.dayQuality === 'good' ? 'bg-gold-primary/20 text-gold-light ring-1 ring-gold-primary/30' :
              personalDay.dayQuality === 'neutral' ? 'bg-slate-400/15 text-text-secondary ring-1 ring-slate-400/20' :
              personalDay.dayQuality === 'caution' ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30' :
              'bg-red-500/20 text-red-400 ring-1 ring-red-500/30'
            }`}>
              {personalDay.dayQuality === 'excellent' ? (msg('gradeAPlus', locale)) :
               personalDay.dayQuality === 'good' ? (msg('gradeA', locale)) :
               personalDay.dayQuality === 'neutral' ? (msg('gradeB', locale)) :
               personalDay.dayQuality === 'caution' ? (msg('gradeC', locale)) :
               (msg('gradeD', locale))}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-gold-light text-sm font-bold">
                {msg('tara', locale)}: {personalDay.taraBala.taraName[locale] || personalDay.taraBala.taraName.en}
                <span className={`ml-2 text-xs ${personalDay.taraBala.isFavorable ? 'text-emerald-400' : 'text-red-400'}`}>
                  {personalDay.taraBala.isFavorable
                    ? (msg('favorableLabel', locale))
                    : (msg('cautionLabel', locale))}
                </span>
              </p>
              <p className="text-text-secondary text-xs truncate">{personalDay.taraBala.description[locale] || personalDay.taraBala.description.en}</p>
            </div>
          </div>
        </motion.div>
      )}

      </div>{/* end panchangContentRef */}

      <AdUnit placement="rectangle" className="max-w-xl mx-auto" />

      {/* ═══ CALCULATION PROOF — TRANSPARENT AUDIT TRAIL ═══ */}
      {panchang && location && (
        <div className="my-8 max-w-2xl mx-auto">
          <details className="group rounded-2xl border border-gold-primary/10 bg-bg-secondary/30">
            <summary className="flex items-center gap-3 cursor-pointer px-6 py-4 text-gold-primary text-sm font-medium hover:text-gold-light transition-colors">
              <span className="w-4 h-4 text-gold-primary group-open:rotate-90 transition-transform inline-block">&#9656;</span>
              {isDevanagari ? 'गणना प्रमाण — यह डेटा कैसे गणना किया गया' : 'Calculation Proof — How This Data Was Computed'}
            </summary>
            <div className="px-6 pb-5 space-y-4 text-sm text-text-secondary">
              <p className="text-text-secondary/70">
                {isDevanagari
                  ? 'सभी मान आपके स्थान के सटीक निर्देशांकों से गणना किए गए हैं। कोई सन्निकटन या डिफ़ॉल्ट नहीं।'
                  : 'All values computed for your exact coordinates using Swiss Ephemeris precision. No approximations or defaults.'}
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-bg-primary/50 rounded-xl p-4 border border-white/5 font-mono text-xs">
                <div className="text-text-secondary/50">{isDevanagari ? 'अक्षांश' : 'Latitude'}</div>
                <div className="text-text-primary">{location.lat?.toFixed(4) || '—'}°</div>
                <div className="text-text-secondary/50">{isDevanagari ? 'देशांतर' : 'Longitude'}</div>
                <div className="text-text-primary">{location.lng?.toFixed(4) || '—'}°</div>
                <div className="text-text-secondary/50">{isDevanagari ? 'समय क्षेत्र' : 'Timezone'}</div>
                <div className="text-text-primary">{location.tz ? `UTC${location.tz >= 0 ? '+' : ''}${location.tz}` : '—'}</div>
                <div className="text-text-secondary/50">{isDevanagari ? 'अयनांश' : 'Ayanamsha'}</div>
                <div className="text-text-primary">Lahiri (Chitrapaksha)</div>
                <div className="text-text-secondary/50">{isDevanagari ? 'सूर्य अवनति' : 'Sun Depression'}</div>
                <div className="text-text-primary">-0.8333° (USNO standard refraction)</div>
                <div className="text-text-secondary/50">{isDevanagari ? 'तिथि सूत्र' : 'Tithi Formula'}</div>
                <div className="text-text-primary">⌊(Moon° − Sun°) / 12⌋ + 1</div>
                <div className="text-text-secondary/50">{isDevanagari ? 'संक्रमण शुद्धता' : 'Transition Precision'}</div>
                <div className="text-text-primary">{isDevanagari ? '30-पुनरावृत्ति द्विभाजन (~1 सेकंड)' : '30-iteration binary search (~1 second)'}</div>
                <div className="text-text-secondary/50">{isDevanagari ? 'राहुकाल सूत्र' : 'Rahu Kaal'}</div>
                <div className="text-text-primary">{isDevanagari ? 'दिन का 1/8 भाग, वार-अनुसार' : '1/8th of daytime, weekday-indexed segment'}</div>
              </div>
              <p className="text-text-secondary/50 text-xs">
                {isDevanagari
                  ? 'ग्रह स्थिति Swiss Ephemeris (DE441) से, सूर्योदय मीउस एल्गोरिदम (2-पास) + वायुमण्डलीय अपवर्तन से।'
                  : 'Planetary positions via Swiss Ephemeris (DE441 ephemeris). Sunrise/sunset via 2-pass Meeus algorithm with atmospheric refraction. Verified against professional Hindu almanacs within ±2 minutes.'}
              </p>
            </div>
          </details>
        </div>
      )}

      {/* ═══ DEEP DIVE LINKS — BIG ICONS ═══ */}
      <div className="my-14">
        <h2 className="text-3xl font-bold text-gold-gradient mb-10 text-center" style={headingFont}>
          {msg('exploreElements', locale)}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {deepDiveLinks.map((link, i) => (
            <motion.div
              key={link.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.1, y: -8 }}
            >
              <Link
                href={`/panchang/${link.key}`}
                className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center hover:border-gold-primary/50 transition-all group block"
              >
                <div className="flex justify-center mb-3 group-hover:scale-125 transition-transform duration-300"><link.Icon size={48} /></div>
                <div className="text-gold-light text-xs font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tNav(link.key)}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ PANCHANG BY CITY ═══ */}
      <div className="my-14">
        <h2 className="text-3xl font-bold text-gold-gradient mb-3 text-center" style={headingFont}>
          {msg('panchangByCity', locale)}
        </h2>
        <p className="text-text-secondary text-sm text-center mb-8 max-w-xl mx-auto">
          {msg('panchangByCityDesc', locale)}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {CITIES.map(city => (
            <Link
              key={city.slug}
              href={`/panchang/${city.slug}`}
              className="rounded-xl border border-gold-primary/8 bg-gradient-to-br from-[#2d1b69]/15 via-[#1a1040]/20 to-[#0a0e27] px-3 py-2.5 text-center hover:border-gold-primary/35 hover:bg-gold-primary/5 transition-all group block"
            >
              <div className="text-gold-light text-xs font-medium group-hover:text-gold-primary transition-colors" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {_tl(city.name, locale)}
              </div>
              <div className="text-text-secondary/40 text-[10px]">{city.state}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══ EDITORIAL — crawlable content for SEO ═══ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-8 border-t border-gold-primary/8">
        <h2 className="text-lg font-semibold text-gold-dark/80 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {_tl({ en: 'Understanding the Five Elements of Panchang', hi: 'पंचांग के पाँच तत्त्वों को समझें', sa: 'पञ्चाङ्गस्य पञ्चतत्त्वानि' }, locale)}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-3" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {_tl({ en: 'Tithi is the lunar day, determined by the angular distance between the Sun and Moon. There are 30 tithis in a lunar month — 15 in the waxing phase (Shukla Paksha) and 15 in the waning phase (Krishna Paksha). Each tithi has a presiding deity and specific qualities that make certain activities favourable or unfavourable. Ekadashi (the 11th tithi) is considered sacred for fasting, while Purnima (full moon) and Amavasya (new moon) are significant for rituals and ancestor worship.', hi: 'तिथि चन्द्र दिवस है, जो सूर्य और चन्द्रमा के बीच कोणीय दूरी से निर्धारित होती है। एक चन्द्र मास में 30 तिथियाँ होती हैं — शुक्ल पक्ष में 15 और कृष्ण पक्ष में 15। प्रत्येक तिथि का एक अधिष्ठाता देवता और विशिष्ट गुण होते हैं। एकादशी उपवास के लिए पवित्र मानी जाती है, जबकि पूर्णिमा और अमावस्या अनुष्ठानों के लिए महत्त्वपूर्ण हैं।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {_tl({ en: 'Nakshatra is the lunar mansion — one of 27 constellations that the Moon transits through approximately every day. Each nakshatra spans 13°20\' of the zodiac and has a ruling planet, deity, and nature (Dhruva/fixed, Chara/movable, Ugra/fierce, Mridu/gentle, etc.) that colours the quality of the day. The nakshatra at the time of your birth determines your Vimshottari Dasha sequence — the planetary period system that is the backbone of Vedic predictive astrology.', hi: 'नक्षत्र चन्द्र भवन है — 27 तारामण्डलों में से एक जिनसे चन्द्रमा प्रतिदिन लगभग गुजरता है। प्रत्येक नक्षत्र राशि चक्र के 13°20\' में फैला है और इसका एक शासक ग्रह, देवता और स्वभाव (ध्रुव, चर, उग्र, मृदु आदि) होता है जो दिन की गुणवत्ता को रंगता है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {_tl({ en: 'Yoga is the luni-solar combination formed by adding the longitudes of the Sun and Moon and dividing by 13°20\'. There are 27 yogas, each with distinct qualities — from the highly auspicious Siddhi (accomplishment) and Shubha (auspicious) to the challenging Vishkambha (obstruction) and Vaidhriti (destruction). Karana is the half-tithi — there are 11 karanas that repeat in a cycle, with Vishti (Bhadra) being the most inauspicious. Vara is simply the weekday, each ruled by a planet: Sunday by Sun, Monday by Moon, through Saturday by Saturn.', hi: 'योग सूर्य और चन्द्रमा के देशान्तर जोड़कर 13°20\' से भाग देने से बनने वाला सूर्य-चन्द्र संयोजन है। 27 योग हैं, प्रत्येक विशिष्ट गुणों के साथ। करण अर्ध-तिथि है — 11 करण एक चक्र में दोहराते हैं, विष्टि (भद्रा) सबसे अशुभ। वार सप्ताह का दिन है, प्रत्येक एक ग्रह शासित।' }, locale)}
        </p>
      </div>

    </div>
  );
}
