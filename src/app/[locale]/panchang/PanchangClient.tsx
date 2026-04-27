'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { MapPin, Loader2, Search, Clock, Sun, Moon, ChevronDown, ChevronUp, Compass, Calendar, Star, Bell, Sparkles, BookOpen } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import ShareButton from '@/components/ui/ShareButton';
import PrintButton from '@/components/ui/PrintButton';
import { Download } from 'lucide-react';
import { TithiIcon, NakshatraIcon, YogaIcon, KaranaIcon, VaraIcon, MuhurtaIcon, GrahanIcon, RashiIcon, MasaIcon, SamvatsaraIcon, SunriseIcon, SunsetIcon, MoonriseIcon, RituIcon, AyanaIcon } from '@/components/icons/PanchangIcons';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { GRAHAS } from '@/lib/constants/grahas';
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
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { CITIES } from '@/lib/constants/cities';
import { computePersonalizedDay } from '@/lib/personalization/personal-panchang';
import { getRashiNumber } from '@/lib/ephem/astronomical';
import type { PersonalizedDay, UserSnapshot } from '@/lib/personalization/types';
import AdUnit from '@/components/ads/AdUnit';
import NakshatraActivityGuide from '@/components/panchang/NakshatraActivityGuide';
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-text-secondary text-xs hover:text-gold-light transition-colors flex items-center gap-1 mx-auto"
      >
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        What does this mean?
      </button>
      {isOpen && (
        <div className="mt-2 p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/10 text-sm text-left">
          <p className="font-medium text-gold-light mb-1 text-xs">{insight.headline}</p>
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

export default function PanchangClient() {
  const t = useTranslations('panchang');
  const tNav = useTranslations('nav');
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  // Safe multilingual accessor — falls back to 'en' when locale key missing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tl = (obj: any): string => _tl(obj, locale);

  const { tradition, setTradition } = usePreferenceStore();

  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationData>({ lat: 0, lng: 0, name: '', tz: 0 });
  const [locationInput, setLocationInput] = useState('');
  const [searchingLocation, setSearchingLocation] = useState(false);
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

  useEffect(() => {
    if ('geolocation' in navigator) {
      setDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
            const country = data.address?.country || '';
            const name = [city, country].filter(Boolean).join(', ') || `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
            setLocation({ lat: latitude, lng: longitude, name, tz: -new Date().getTimezoneOffset() / 60 });
          } catch {
            setLocation({ lat: latitude, lng: longitude, name: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`, tz: -new Date().getTimezoneOffset() / 60 });
          }
          setDetectingLocation(false);
        },
        async () => {
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.latitude && data.longitude) {
              // Reverse-geocode the actual coordinates — data.city from ipapi often mismatches
              // the lat/lng because ISP routing points can be far from the user's city
              let name = `${data.latitude.toFixed(2)}°, ${data.longitude.toFixed(2)}°`;
              try {
                const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}&zoom=10`);
                const geoData = await geo.json();
                const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || '';
                const country = geoData.address?.country || '';
                name = [city, country].filter(Boolean).join(', ') || name;
              } catch { /* use coordinate fallback */ }
              // Parse utc_offset in HHMM format (e.g. "+0530" → 5.5, not 5.3)
              let tz = -(new Date().getTimezoneOffset() / 60);
              if (data.utc_offset) {
                const sign = data.utc_offset[0] === '-' ? -1 : 1;
                const hh = parseInt(data.utc_offset.slice(1, 3), 10);
                const mm = parseInt(data.utc_offset.slice(3, 5), 10);
                tz = sign * (hh + mm / 60);
              }
              setLocation({ lat: data.latitude, lng: data.longitude, name, tz });
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
    // Don't fetch until we have a real location (avoid erroneous data at lat=0,lng=0)
    if (location.lat === 0 && location.lng === 0) return;
    setLoading(true);
    const [year, month, day] = selectedDate.split('-').map(Number);
    const ianaTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    fetch(`/api/panchang?year=${year}&month=${month}&day=${day}&lat=${location.lat}&lng=${location.lng}&timezone=${encodeURIComponent(ianaTimezone)}&location=${encodeURIComponent(location.name)}`)
      .then(res => res.json())
      .then(data => { setPanchang(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedDate, location]);

  useEffect(() => { fetchPanchang(); }, [fetchPanchang]);

  const handleLocationSearch = async () => {
    if (!locationInput.trim()) return;
    setSearchingLocation(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        const lng = parseFloat(data[0].lon);
        const ianaTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date();
        const approxTz = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), ianaTimezone);
        setLocation({ lat: parseFloat(data[0].lat), lng, name: data[0].display_name.split(',').slice(0, 3).join(', '), tz: approxTz });
        setShowLocationSearch(false);
        setLocationInput('');
      }
    } catch (err) {
      console.error('[PanchangClient] location search failed:', err);
      // Show inline feedback so the user knows the search didn't silently fail
      alert('Location search failed. Please check your connection and try again.');
    }
    setSearchingLocation(false);
  };

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
              className="text-gold-primary hover:text-gold-light text-xs border border-gold-primary/15 px-2 py-0.5 rounded hover:bg-gold-primary/10 transition-all whitespace-nowrap">
              {msg('change', locale)}
            </button>
          </div>
        </div>

        {/* Location search expand */}
        {showLocationSearch && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mt-3">
            <div className="rounded-lg border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-2 flex gap-2 w-full max-w-sm">
              <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                placeholder={msg('searchCity', locale)}
                className="flex-1 bg-transparent border border-gold-primary/15 rounded-md px-3 py-2 sm:py-1.5 text-text-primary text-sm focus:outline-none focus:border-gold-primary/40" />
              <button onClick={handleLocationSearch} disabled={searchingLocation}
                className="px-3 py-2 sm:py-1.5 bg-gold-primary/15 border border-gold-primary/20 rounded-md text-gold-light hover:bg-gold-primary/25 transition-all disabled:opacity-50">
                {searchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <div ref={panchangContentRef}>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
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
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all"
                aria-label="Download PDF"
              >
                <Download className="w-3 h-3" />
                PDF
              </button>
              <PrintButton
                contentRef={panchangContentRef}
                title={`Panchang — ${panchang.date}`}
                label={msg('print', locale)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all"
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
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-gold-primary/15 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 transition-all"
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
                      <div className="text-emerald-400 text-[10px] uppercase tracking-wider font-bold mb-1">{isDevanagari ? 'अनुकूल' : 'Best For'}</div>
                      <div className="text-text-secondary text-xs">{vibeData.bestFor.join(' · ')}</div>
                    </div>
                  )}
                  {vibeData.avoid.length > 0 && (
                    <div>
                      <div className="text-red-400 text-[10px] uppercase tracking-wider font-bold mb-1">{isDevanagari ? 'बचें' : 'Avoid'}</div>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mb-14">
                {/* ── TITHI CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center hover:border-gold-primary/40 transition-all cursor-default"
                >
                  <div className="flex justify-center mb-3"><TithiIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('tithi')}</div>
                  {/* First tithi (at sunrise) */}
                  <div className={`rounded-lg p-2.5 mb-2 border ${tithiPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
                    <div className="text-gold-light text-lg font-bold leading-tight" style={headingFont}>
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
                      <div className="text-gold-light text-lg font-bold leading-tight" style={headingFont}>
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
                </motion.div>

                {/* ── NAKSHATRA CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center hover:border-gold-primary/40 transition-all cursor-default"
                >
                  <div className="flex justify-center mb-3"><NakshatraIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('nakshatra')}</div>
                  {/* First nakshatra (at sunrise) */}
                  <div className={`rounded-lg p-2.5 mb-2 border ${nakPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
                    <div className="text-gold-light text-lg font-bold leading-tight" style={headingFont}>
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
                      <div className="text-gold-light text-lg font-bold leading-tight" style={headingFont}>
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
                  className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center hover:border-gold-primary/40 transition-all cursor-default"
                >
                  <div className="flex justify-center mb-3"><YogaIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('yoga')}</div>
                  {/* First yoga (at sunrise) */}
                  <div className={`rounded-lg p-2.5 mb-2 border ${yogaPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
                    <div className="text-gold-light text-lg font-bold leading-tight" style={headingFont}>{tl(panchang.yoga.name)}</div>
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
                      <div className="text-gold-light text-lg font-bold leading-tight" style={headingFont}>{tl(panchang.yogaTransition.nextName)}</div>
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
                  className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center hover:border-gold-primary/40 transition-all cursor-default"
                >
                  <div className="flex justify-center mb-3"><KaranaIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('karana')}</div>
                  {/* First karana (at sunrise) */}
                  <div className={`rounded-lg p-2.5 mb-2 border ${karanaPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
                    <div className="text-gold-light text-lg font-bold leading-tight" style={headingFont}>{tl(panchang.karana.name)}</div>
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
                      <div className="text-gold-light text-lg font-bold leading-tight" style={headingFont}>{tl(panchang.karanaTransition.nextName)}</div>
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
                  className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center hover:border-gold-primary/40 transition-all cursor-default"
                >
                  <div className="flex justify-center mb-3"><VaraIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('vara')}</div>
                  <div className="text-gold-light text-2xl font-bold leading-tight" style={headingFont}>{tl(panchang.vara.name)}</div>
                  <div className="text-text-secondary text-xs mt-2">{tl(panchang.vara.ruler)}</div>
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

          {/* Current Hora — Best Activity Now */}
          {panchang.hora && panchang.hora.length > 0 && (() => {
            const now = new Date();
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            const currentHora = panchang.hora.find((h: { startTime: string; endTime: string; planetId: number }) => {
              const [sh, sm] = h.startTime.split(':').map(Number);
              const [eh, em] = h.endTime.split(':').map(Number);
              const start = sh * 60 + sm, end = eh * 60 + em;
              // Handle midnight-crossing slots (e.g., 23:30 to 01:15)
              return end < start ? (nowMinutes >= start || nowMinutes < end) : (nowMinutes >= start && nowMinutes < end);
            });
            const HORA_ACTIVITIES: Record<number, LocaleText> = {
              0: { en: 'Government work, authority matters, health', hi: 'सरकारी कार्य, अधिकार, स्वास्थ्य', sa: 'राजकार्यम्, अधिकारः, आरोग्यम्', ta: 'அரசு பணி, அதிகாரம், ஆரோக்கியம்', te: 'ప్రభుత్వ పని, అధికారం, ఆరోగ్యం', bn: 'সরকারি কাজ, কর্তৃত্ব, স্বাস্থ্য', kn: 'ಸರ್ಕಾರಿ ಕೆಲಸ, ಅಧಿಕಾರ, ಆರೋಗ್ಯ', mr: 'सरकारी काम, अधिकार, आरोग्य', gu: 'સરકારી કામ, સત્તા, આરોગ્ય', mai: 'सरकारी काज, अधिकार, स्वास्थ्य' },
              1: { en: 'Travel, liquids, public relations', hi: 'यात्रा, तरल पदार्थ, जनसंपर्क', sa: 'यात्रा, द्रवपदार्थाः, जनसम्पर्कः', ta: 'பயணம், திரவங்கள், மக்கள் தொடர்பு', te: 'ప్రయాణం, ద్రవ పదార్థాలు, ప్రజా సంబంధాలు', bn: 'ভ্রমণ, তরল পদার্থ, জনসংযোগ', kn: 'ಪ್ರಯಾಣ, ದ್ರವ ಪದಾರ್ಥಗಳು, ಜನಸಂಪರ್ಕ', mr: 'प्रवास, द्रव पदार्थ, जनसंपर्क', gu: 'મુસાફરી, પ્રવાહી પદાર્થો, જનસંપર્ક', mai: 'यात्रा, तरल पदार्थ, जनसंपर्क' },
              2: { en: 'Property, machinery, legal battles', hi: 'संपत्ति, मशीनरी, कानूनी कार्य', sa: 'सम्पत्तिः, यन्त्राणि, विधिवादः', ta: 'சொத்து, இயந்திரம், சட்டப் போராட்டம்', te: 'ఆస్తి, యంత్రాలు, న్యాయ పోరాటాలు', bn: 'সম্পত্তি, যন্ত্রপাতি, আইনি লড়াই', kn: 'ಆಸ್ತಿ, ಯಂತ್ರೋಪಕರಣ, ಕಾನೂನು ಹೋರಾಟ', mr: 'मालमत्ता, यंत्रसामग्री, कायदेशीर लढाई', gu: 'મિલકત, યંત્રો, કાનૂની લડાઈ', mai: 'संपत्ति, मशीन, कानूनी काज' },
              3: { en: 'Communication, trade, learning', hi: 'संचार, व्यापार, शिक्षा', sa: 'सञ्चारः, वाणिज्यम्, शिक्षा', ta: 'தொடர்பு, வணிகம், கல்வி', te: 'సంభాషణ, వ్యాపారం, విద్య', bn: 'যোগাযোগ, ব্যবসা, শিক্ষা', kn: 'ಸಂವಹನ, ವ್ಯಾಪಾರ, ಕಲಿಕೆ', mr: 'संवाद, व्यापार, शिक्षण', gu: 'સંદેશાવ્યવહાર, વેપાર, શિક્ષણ', mai: 'संचार, व्यापार, शिक्षा' },
              4: { en: 'Education, finance, spiritual practice', hi: 'शिक्षा, वित्त, आध्यात्मिक साधना', sa: 'शिक्षा, वित्तम्, आध्यात्मिकसाधना', ta: 'கல்வி, நிதி, ஆன்மீக பயிற்சி', te: 'విద్య, ఆర్థికం, ఆధ్యాత్మిక సాధన', bn: 'শিক্ষা, অর্থ, আধ্যাত্মিক সাধনা', kn: 'ಶಿಕ್ಷಣ, ಹಣಕಾಸು, ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆ', mr: 'शिक्षण, वित्त, आध्यात्मिक साधना', gu: 'શિક્ષણ, નાણાં, આધ્યાત્મિક સાધના', mai: 'शिक्षा, वित्त, आध्यात्मिक साधना' },
              5: { en: 'Romance, arts, luxury purchases', hi: 'प्रेम, कला, विलासिता', sa: 'प्रेमः, कलाः, विलासवस्तूनि', ta: 'காதல், கலை, ஆடம்பரம்', te: 'ప్రేమ, కళలు, విలాసాలు', bn: 'প্রেম, শিল্প, বিলাসিতা', kn: 'ಪ್ರೇಮ, ಕಲೆ, ವಿಲಾಸ', mr: 'प्रेम, कला, विलासिता', gu: 'પ્રેમ, કલા, વૈભવી ખરીદી', mai: 'प्रेम, कला, विलासिता' },
              6: { en: 'Labor, iron work, mining, discipline', hi: 'श्रम, लोहा, खनन, अनुशासन', sa: 'श्रमः, लोहकार्यम्, खननम्, अनुशासनम्', ta: 'உழைப்பு, இரும்புப் பணி, சுரங்கம், ஒழுக்கம்', te: 'శ్రమ, ఇనుప పని, గనులు, క్రమశిక్షణ', bn: 'শ্রম, লোহার কাজ, খনন, শৃঙ্খলা', kn: 'ಶ್ರಮ, ಕಬ್ಬಿಣ ಕೆಲಸ, ಗಣಿಗಾರಿಕೆ, ಶಿಸ್ತು', mr: 'श्रम, लोखंडी काम, खाणकाम, शिस्त', gu: 'શ્રમ, લોખંડ કામ, ખાણકામ, શિસ્ત', mai: 'श्रम, लोहा काज, खनन, अनुशासन' },
            };
            if (!currentHora) return null;
            const activity = HORA_ACTIVITIES[currentHora.planetId] || HORA_ACTIVITIES[0];
            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 p-5 text-center mb-10">
                <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
                  {msg('currentHoraBest', locale)}
                </div>
                <div className="text-amber-300 font-bold text-xl font-mono">
                  {currentHora.startTime} – {currentHora.endTime}
                </div>
                <div className="text-text-secondary text-sm mt-1.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {_tl(activity, locale)}
                </div>
              </motion.div>
            );
          })()}

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
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{msg('dayDuration', locale)}</div>
                  <div className="text-gold-light font-bold text-lg font-mono mt-1">{panchang.dinamana || '—'}</div>
                  <div className="text-text-secondary text-xs mt-1.5 uppercase tracking-wider">{msg('nightLabel', locale)}: <span className="font-mono text-text-primary">{panchang.ratrimana || '—'}</span></div>
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

          {/* ═══ MEGA CARD GRID — tarot-style cards linking to subpages ═══ */}
          {/* Row 1: 5 cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 my-14">
            {([
              {
                href: '/panchang/auspicious',
                title: isDevanagari ? 'शुभ-अशुभ काल' : 'Sacred Timings',
                subtitle: isDevanagari ? 'मुहूर्त एवं निषिद्ध काल' : 'Auspicious & Inauspicious',
                preview: isDevanagari ? 'अभिजित · अमृत काल · राहु काल · वर्ज्यम' : 'Abhijit · Amrit Kalam · Rahu Kaal · Varjyam',
                color: 'emerald',
                // Tarot: Radiant sun with rays (auspicious light)
                svg: <svg viewBox="0 0 64 64" className="w-14 h-14"><defs><linearGradient id="tc1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="100%" stopColor="#d4a853"/></linearGradient></defs><circle cx="32" cy="32" r="12" fill="none" stroke="url(#tc1)" strokeWidth="1.5"/><circle cx="32" cy="32" r="6" fill="url(#tc1)" opacity="0.3"/>{Array.from({length:12},(_,i)=>{const a=Math.PI*2*i/12;return <line key={i} x1={r2(32+16*Math.cos(a))} y1={r2(32+16*Math.sin(a))} x2={r2(32+24*Math.cos(a))} y2={r2(32+24*Math.sin(a))} stroke="url(#tc1)" strokeWidth={i%2===0?"1.5":"0.8"} opacity={i%2===0?0.9:0.4}/>})}</svg>,
              },
              {
                href: '/choghadiya',
                title: isDevanagari ? 'चौघड़िया' : 'Choghadiya',
                subtitle: isDevanagari ? 'आठ-पहर पद्धति' : '8-fold Day & Night',
                preview: isDevanagari ? 'शुभ · लाभ · अमृत' : 'Shubh · Labh · Amrit',
                color: 'amber',
                // Tarot: Octagon (8 divisions)
                svg: <svg viewBox="0 0 64 64" className="w-14 h-14"><defs><linearGradient id="tc2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="100%" stopColor="#8a6d2b"/></linearGradient></defs><polygon points={Array.from({length:8},(_,i)=>`${r2(32+22*Math.cos(Math.PI*2*i/8-Math.PI/8))},${r2(32+22*Math.sin(Math.PI*2*i/8-Math.PI/8))}`).join(' ')} fill="none" stroke="url(#tc2)" strokeWidth="1.2"/><polygon points={Array.from({length:8},(_,i)=>`${r2(32+12*Math.cos(Math.PI*2*i/8))},${r2(32+12*Math.sin(Math.PI*2*i/8))}`).join(' ')} fill="url(#tc2)" opacity="0.15"/><circle cx="32" cy="32" r="4" fill="url(#tc2)" opacity="0.4"/></svg>,
              },
              {
                href: '/hora',
                title: isDevanagari ? 'होरा' : 'Hora',
                subtitle: isDevanagari ? 'ग्रहीय प्रहर' : 'Planetary Hours',
                preview: isDevanagari ? '24 होरा चक्र' : '24-Hour Cycle',
                color: 'gold',
                // Tarot: Clock face with 7 segments
                svg: <svg viewBox="0 0 64 64" className="w-14 h-14"><defs><linearGradient id="tc3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="100%" stopColor="#d4a853"/></linearGradient></defs><circle cx="32" cy="32" r="22" fill="none" stroke="url(#tc3)" strokeWidth="1"/>{Array.from({length:7},(_,i)=>{const a=Math.PI*2*i/7-Math.PI/2;return <line key={i} x1="32" y1="32" x2={r2(32+22*Math.cos(a))} y2={r2(32+22*Math.sin(a))} stroke="url(#tc3)" strokeWidth="0.6" opacity="0.4"/>})}<circle cx="32" cy="32" r="3" fill="url(#tc3)" opacity="0.5"/><line x1="32" y1="32" x2="32" y2="14" stroke="url(#tc3)" strokeWidth="1.5" strokeLinecap="round"/><line x1="32" y1="32" x2="44" y2="32" stroke="url(#tc3)" strokeWidth="1" strokeLinecap="round"/></svg>,
              },
              {
                href: '/panchang/muhurta',
                title: isDevanagari ? 'मुहूर्त' : 'Muhurtas',
                subtitle: isDevanagari ? 'दैनिक 30 मुहूर्त' : '30 Daily Periods',
                preview: isDevanagari ? 'अभिजित · विजय · ब्रह्म' : 'Abhijit · Vijaya · Brahma',
                color: 'violet',
                // Tarot: Crescent moon with stars
                svg: <svg viewBox="0 0 64 64" className="w-14 h-14"><defs><linearGradient id="tc4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c084fc"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs><path d="M 38 12 A 20 20 0 1 0 38 52 A 16 16 0 1 1 38 12" fill="none" stroke="url(#tc4)" strokeWidth="1.2"/><circle cx="46" cy="18" r="1.5" fill="url(#tc4)" opacity="0.8"/><circle cx="50" cy="28" r="1" fill="url(#tc4)" opacity="0.6"/><circle cx="48" cy="40" r="1.2" fill="url(#tc4)" opacity="0.7"/></svg>,
              },
              {
                href: '/panchang/nivas',
                title: isDevanagari ? 'निवास एवं शूल' : 'Nivas & Shool',
                subtitle: isDevanagari ? 'दिशा एवं देव निवास' : 'Directions & Abodes',
                preview: `${isDevanagari ? 'शूल' : 'Shool'}: ${panchang.dishaShool?.direction?.[locale] || panchang.dishaShool?.direction?.en || '—'}`,
                color: 'indigo',
                // Tarot: Compass rose
                svg: <svg viewBox="0 0 64 64" className="w-14 h-14"><defs><linearGradient id="tc5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a5b4fc"/><stop offset="100%" stopColor="#6366f1"/></linearGradient></defs><circle cx="32" cy="32" r="22" fill="none" stroke="url(#tc5)" strokeWidth="0.8"/><polygon points="32,10 36,28 32,32 28,28" fill="url(#tc5)" opacity="0.6"/><polygon points="54,32 36,36 32,32 36,28" fill="url(#tc5)" opacity="0.3"/><polygon points="32,54 28,36 32,32 36,36" fill="url(#tc5)" opacity="0.3"/><polygon points="10,32 28,28 32,32 28,36" fill="url(#tc5)" opacity="0.3"/><circle cx="32" cy="32" r="3" fill="url(#tc5)" opacity="0.5"/></svg>,
              },
            ] as const).map((card, i) => (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.06, type: 'spring' as const, stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -6 }}
              >
                <Link href={card.href}
                  className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center hover:border-gold-primary/40 transition-all cursor-pointer block h-full">
                  <div className="flex justify-center mb-3">{card.svg}</div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-1 font-semibold">{card.subtitle}</div>
                  <div className="text-gold-light text-lg font-bold leading-tight mb-2" style={headingFont}>{card.title}</div>
                  <div className="text-text-secondary text-xs mt-1">{card.preview}</div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Row 2: 5 cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 -mt-8 mb-14">
            {([
              {
                href: '/panchang/planets',
                title: isDevanagari ? 'नवग्रह' : 'Navagraha',
                subtitle: isDevanagari ? 'ग्रह स्थिति' : 'Planetary Positions',
                preview: isDevanagari ? 'नवग्रह देशांतर' : '9 Planet Longitudes',
                color: 'sky',
                // Tarot: Ringed planet (Saturn-like)
                svg: <svg viewBox="0 0 64 64" className="w-14 h-14"><defs><linearGradient id="tc6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7dd3fc"/><stop offset="100%" stopColor="#0ea5e9"/></linearGradient></defs><circle cx="32" cy="32" r="10" fill="none" stroke="url(#tc6)" strokeWidth="1.2"/><ellipse cx="32" cy="32" rx="22" ry="8" fill="none" stroke="url(#tc6)" strokeWidth="0.8" transform="rotate(-20 32 32)"/><circle cx="32" cy="32" r="4" fill="url(#tc6)" opacity="0.2"/></svg>,
              },
              {
                href: '/panchang/remedies',
                title: isDevanagari ? 'उपाय' : 'Remedies',
                subtitle: isDevanagari ? 'आज के उपचार' : "Today's Prescriptions",
                preview: `${tl(panchang.vara?.name) || ''} · ${['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'][panchang.vara?.day ?? 0] || ''}`,
                color: 'amber',
                // Tarot: Gemstone
                svg: <svg viewBox="0 0 64 64" className="w-14 h-14"><defs><linearGradient id="tc7" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="100%" stopColor="#d4a853"/></linearGradient></defs><polygon points="32,10 48,25 44,50 20,50 16,25" fill="none" stroke="url(#tc7)" strokeWidth="1.2" strokeLinejoin="round"/><line x1="32" y1="10" x2="32" y2="50" stroke="url(#tc7)" strokeWidth="0.6" opacity="0.3"/><line x1="16" y1="25" x2="48" y2="25" stroke="url(#tc7)" strokeWidth="0.6" opacity="0.3"/><polygon points="32,10 48,25 44,50 20,50 16,25" fill="url(#tc7)" opacity="0.08"/></svg>,
              },
              {
                href: '/panchang/masa',
                title: isDevanagari ? 'हिन्दू मास' : 'Hindu Months',
                subtitle: isDevanagari ? 'मास पंचांग' : 'Lunar Calendar',
                preview: `${tl(panchang.amantMasa || panchang.masa)}`,
                color: 'gold',
                // Tarot: Waxing/waning moon cycle
                svg: <svg viewBox="0 0 64 64" className="w-14 h-14"><defs><linearGradient id="tc8" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="100%" stopColor="#8a6d2b"/></linearGradient></defs><circle cx="20" cy="32" r="8" fill="none" stroke="url(#tc8)" strokeWidth="0.8" opacity="0.4"/><circle cx="32" cy="32" r="10" fill="none" stroke="url(#tc8)" strokeWidth="1.2"/><circle cx="32" cy="32" r="10" fill="url(#tc8)" opacity="0.15"/><circle cx="44" cy="32" r="8" fill="none" stroke="url(#tc8)" strokeWidth="0.8" opacity="0.4"/></svg>,
              },
              {
                href: '/sky',
                title: isDevanagari ? 'आकाश' : 'Live Sky',
                subtitle: isDevanagari ? 'नक्षत्र मानचित्र' : 'Sky Map',
                preview: isDevanagari ? 'वास्तविक समय आकाश' : 'Real-time Positions',
                color: 'sky',
                // Tarot: Stars constellation
                svg: <svg viewBox="0 0 64 64" className="w-14 h-14"><defs><linearGradient id="tc9" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7dd3fc"/><stop offset="100%" stopColor="#38bdf8"/></linearGradient></defs><circle cx="20" cy="20" r="2" fill="url(#tc9)"/><circle cx="44" cy="16" r="1.5" fill="url(#tc9)" opacity="0.7"/><circle cx="32" cy="32" r="2.5" fill="url(#tc9)"/><circle cx="18" cy="44" r="1.5" fill="url(#tc9)" opacity="0.6"/><circle cx="46" cy="42" r="2" fill="url(#tc9)" opacity="0.8"/><line x1="20" y1="20" x2="32" y2="32" stroke="url(#tc9)" strokeWidth="0.5" opacity="0.3"/><line x1="44" y1="16" x2="32" y2="32" stroke="url(#tc9)" strokeWidth="0.5" opacity="0.3"/><line x1="32" y1="32" x2="46" y2="42" stroke="url(#tc9)" strokeWidth="0.5" opacity="0.3"/><line x1="32" y1="32" x2="18" y2="44" stroke="url(#tc9)" strokeWidth="0.5" opacity="0.3"/></svg>,
              },
              {
                href: '/panchang/activity-guide',
                title: isDevanagari ? 'नक्षत्र मार्गदर्शन' : 'Activity Guide',
                subtitle: isDevanagari ? 'नक्षत्र गतिविधि' : 'Nakshatra Activities',
                preview: `${tl(panchang.nakshatra?.name) || '—'} — ${isDevanagari ? 'अनुकूल कार्य' : 'Favorable actions'}`,
                color: 'gold',
                // Tarot: Star with activity rays
                svg: <svg viewBox="0 0 64 64" className="w-14 h-14"><defs><linearGradient id="tc10" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0d48a"/><stop offset="100%" stopColor="#d4a853"/></linearGradient></defs><polygon points="32,8 36,24 52,24 39,34 43,50 32,40 21,50 25,34 12,24 28,24" fill="none" stroke="url(#tc10)" strokeWidth="1.2"/><polygon points="32,8 36,24 52,24 39,34 43,50 32,40 21,50 25,34 12,24 28,24" fill="url(#tc10)" opacity="0.1"/><circle cx="32" cy="30" r="6" fill="none" stroke="url(#tc10)" strokeWidth="0.8" opacity="0.5"/></svg>,
              },
            ] as const).map((card, i) => (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.06, type: 'spring' as const, stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -6 }}
              >
                <Link href={card.href}
                  className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center hover:border-gold-primary/40 transition-all cursor-pointer block h-full">
                  <div className="flex justify-center mb-3">{card.svg}</div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-1 font-semibold">{card.subtitle}</div>
                  <div className="text-gold-light text-lg font-bold leading-tight mb-2" style={headingFont}>{card.title}</div>
                  <div className="text-text-secondary text-xs mt-1">{card.preview}</div>
                </Link>
              </motion.div>
            ))}
          </div>

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
    </div>
  );
}
