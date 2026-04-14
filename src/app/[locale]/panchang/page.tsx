'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { computeHinduMonths, formatMonthDate } from '@/lib/calendar/hindu-months';
import { useBirthDataStore } from '@/stores/birth-data-store';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { CITIES } from '@/lib/constants/cities';
import { computePersonalizedDay } from '@/lib/personalization/personal-panchang';
import { getRashiNumber } from '@/lib/ephem/astronomical';
import type { PersonalizedDay, UserSnapshot } from '@/lib/personalization/types';
import AdUnit from '@/components/ads/AdUnit';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl as _tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import PMSG from '@/messages/pages/panchang-inline.json';

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

export default function PanchangPage() {
  const t = useTranslations('panchang');
  const tNav = useTranslations('nav');
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  // Safe multilingual accessor — falls back to 'en' when locale key missing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tl = (obj: any): string => _tl(obj, locale);

  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationData>({ lat: 0, lng: 0, name: '', tz: 0 });
  const [locationInput, setLocationInput] = useState('');
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const panchangContentRef = useRef<HTMLDivElement>(null);
  const [showAllMuhurtas, setShowAllMuhurtas] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [masaSystem, setMasaSystem] = useState<'amant' | 'purnimant'>('amant');

  // Load saved masa preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('panchang_masa_system');
      if (saved === 'purnimant') setMasaSystem('purnimant');
    } catch { /* ignore */ }
  }, []);
  const [currentMuhurtaIdx, setCurrentMuhurtaIdx] = useState(-1);
  const [birthNakshatra, setBirthNakshatra] = useState(0);
  const [birthRashi, setBirthRashi] = useState(0);
  const [balamResult, setBalamResult] = useState<BalamResult | null>(null);
  const [birthAutoDetected, setBirthAutoDetected] = useState(false);

  // Personal overlay state
  const authUser = useAuthStore(s => s.user);
  const [personalDay, setPersonalDay] = useState<PersonalizedDay | null>(null);

  // Compute Hindu months for current year (expensive, memoized)
  const computeHinduMonthsMemo = useMemo(() => computeHinduMonths(new Date().getFullYear()), []);
  const [now, setNow] = useState<Date>(new Date());

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
          } catch { /* silently fail */ }
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
    } catch {}
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

  // Update current muhurta index on client only
  useEffect(() => {
    if (!panchang?.muhurtas) return;
    const update = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      for (let i = 0; i < panchang.muhurtas.length; i++) {
        if (currentTime >= panchang.muhurtas[i].startTime && currentTime < panchang.muhurtas[i].endTime) {
          setCurrentMuhurtaIdx(i);
          return;
        }
      }
      setCurrentMuhurtaIdx(-1);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [panchang?.muhurtas]);

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
                          <div className="text-xs text-text-secondary/55 mt-0.5">24h</div>
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
                  {/* Tithi contextual tip */}
                  <div className="text-text-secondary/70 text-xs mt-1.5 leading-snug">
                    {panchang.tithi.paksha === 'shukla'
                      ? msg('shukla', locale)
                      : msg('krishna', locale)
                    }{' — '}{msg('deity', locale)}{' '}{panchang.tithi.deity[locale]}
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
                        <div className="text-xs text-text-secondary/55 mt-0.5">24h</div>
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
                    {msg('nature', locale)}{' '}{panchang.nakshatra.nature[locale]}{' — '}{msg('ruler', locale)}{' '}{panchang.nakshatra.rulerName[locale]}
                  </div>
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
                  <div className="text-gold-light text-2xl font-bold leading-tight" style={headingFont}>{tl(activeYoga.name)}</div>
                  <div className="text-text-secondary text-xs mt-2">{tl(activeYoga.meaning)}</div>
                  {panchang.yogaTransition && (
                    <div className="mt-3 pt-2 border-t border-gold-primary/10">
                      <div className="font-mono text-sm text-amber-300 font-bold">{fmt(panchang.yogaTransition.startTime, panchang.yogaTransition.startDate)} — {fmt(panchang.yogaTransition.endTime, panchang.yogaTransition.endDate)}</div>
                      <div className="text-xs text-text-secondary/55">24h</div>
                      {!yogaPassed && (
                        <div className="text-xs text-text-secondary mt-1">
                          {t('then')} <span className="text-gold-light font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{panchang.yogaTransition.nextName[locale]}</span>
                        </div>
                      )}
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
                  <div className="text-gold-light text-2xl font-bold leading-tight" style={headingFont}>{tl(activeKarana.name)}</div>
                  <div className="text-text-secondary text-xs mt-2">
                    {activeKarana.type === 'chara' ? msg('movable', locale) : activeKarana.type === 'sthira' ? msg('fixed', locale) : msg('special', locale)}
                  </div>
                  {panchang.karanaTransition && (
                    <div className="mt-3 pt-2 border-t border-gold-primary/10">
                      <div className="font-mono text-sm text-amber-300 font-bold">{fmt(panchang.karanaTransition.startTime, panchang.karanaTransition.startDate)} — {fmt(panchang.karanaTransition.endTime, panchang.karanaTransition.endDate)}</div>
                      <div className="text-xs text-text-secondary/55">24h</div>
                      {!karanaPassed && (
                        <div className="text-xs text-text-secondary mt-1">
                          {t('then')} <span className="text-gold-light font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{panchang.karanaTransition.nextName[locale]}</span>
                        </div>
                      )}
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
                </motion.div>
              </div>
            );
          })()}

          {/* Current Hora — Best Activity Now */}
          {panchang.hora && panchang.hora.length > 0 && (() => {
            const now = new Date();
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            const currentHora = panchang.hora.find((h: { startTime: string; endTime: string; planetId: number }) => {
              const [sh, sm] = h.startTime.split(':').map(Number);
              const [eh, em] = h.endTime.split(':').map(Number);
              return nowMinutes >= sh * 60 + sm && nowMinutes < eh * 60 + em;
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

          <GoldDivider />

          {/* ═══ TIMES — BOLD ═══ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-14">
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

          {/* ═══════════════════════════════════════════════════
              SECTION 2: AUSPICIOUS TIMINGS
          ═══════════════════════════════════════════════════ */}
          <div className="my-14">
            <SectionHeading
              icon={<MuhurtaIcon size={56} />}
              title={msg('auspiciousTimings', locale)}
              subtitle={msg('auspiciousTimingsDesc', locale)}
              accentClass="text-emerald-400"
            />

            {/* Sarvartha Siddhi full-width banner */}
            {panchang.sarvarthaSiddhi && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6">
                <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border-2 border-gold-primary/40 bg-gradient-to-r from-gold-primary/10 via-emerald-500/5 to-gold-primary/10 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold-primary animate-pulse" />
                    <div className="text-gold-primary text-xs uppercase tracking-[0.3em] font-bold">{t('sarvarthaSiddhi')}</div>
                    <span className="w-2.5 h-2.5 rounded-full bg-gold-primary animate-pulse" />
                  </div>
                  <div className="text-gold-light text-xl font-bold" style={headingFont}>{t('sarvarthaSiddhiActive')}</div>
                  <div className="text-text-secondary text-sm mt-2">{t('sarvarthaSiddhiDesc')}</div>
                </div>
              </motion.div>
            )}

            {/* Ravi Yoga badge with time window */}
            {panchang.raviYogaWindow?.active && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-center">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-400/40 bg-amber-500/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-amber-300 text-sm font-bold uppercase tracking-wider">
                    {msg('raviYoga', locale)}
                  </span>
                  <span className="text-amber-400/70 text-xs font-mono">
                    {panchang.raviYogaWindow.start} — {panchang.raviYogaWindow.end}{panchang.raviYogaWindow.endDate ? `, ${panchang.raviYogaWindow.endDate.split('-').slice(1).join('/')}` : ''}
                  </span>
                  <span className="text-amber-400/70 text-xs">{'· ' + msg('highlyAuspicious', locale)}</span>
                </div>
              </motion.div>
            )}

            {/* Amrit Siddhi Yoga banner */}
            {panchang.amritSiddhiYoga && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-gold-primary/5 to-emerald-500/10 p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-xs uppercase tracking-[0.3em] font-bold">
                      {msg('amritSiddhiYoga', locale)}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-emerald-300 text-base font-bold">
                    {msg('supremelyAuspiciousDay', locale)}
                  </div>
                  <div className="text-text-secondary text-xs mt-1">
                    {msg('amritSiddhiDesc', locale)}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Dagdha Tithi warning */}
            {panchang.dagdhaTithi && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-center">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-rose-500/40 bg-rose-500/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-rose-400 text-sm font-bold uppercase tracking-wider">
                    {msg('dagdhaTithi', locale)}
                  </span>
                  <span className="text-rose-400/70 text-xs">
                    {'· ' + msg('avoidNewBeginnings', locale)}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Auspicious timings grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Brahma Muhurta */}
              {panchang.brahmaMuhurta && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center">
                  <div className="text-indigo-400 text-xs uppercase tracking-wider font-bold mb-2">{t('brahmaMuhurta')}</div>
                  <div className="font-mono text-xl font-bold text-amber-300">{panchang.brahmaMuhurta.start} — {panchang.brahmaMuhurta.end}</div>
                  <div className="text-text-secondary text-xs mt-2 leading-relaxed">{t('brahmaMuhurtaDesc')}</div>
                </motion.div>
              )}

              {/* Abhijit Muhurta */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border-2 border-gold-primary/40 bg-gradient-to-br from-gold-primary/10 to-transparent">
                <div className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-2">
                  {msg('abhijitMuhurta', locale)}
                </div>
                <div className="font-mono text-xl font-bold text-amber-300">{panchang.abhijitMuhurta.start} — {panchang.abhijitMuhurta.end}</div>
                <div className="text-text-secondary text-xs mt-2 leading-relaxed">
                  {msg('mostAuspiciousVictory', locale)}
                </div>
              </motion.div>

              {/* Vijaya Muhurta */}
              {panchang.vijayaMuhurta && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border border-amber-400/30 bg-gradient-to-br from-amber-500/5 to-transparent">
                  <div className="text-amber-400 text-xs uppercase tracking-wider font-bold mb-2">
                    {msg('vijayaMuhurta', locale)}
                  </div>
                  <div className="font-mono text-xl font-bold text-amber-300">{panchang.vijayaMuhurta.start} — {panchang.vijayaMuhurta.end}</div>
                  <div className="text-text-secondary text-xs mt-2 leading-relaxed">
                    {msg('tenthMuhurtaVictory', locale)}
                  </div>
                </motion.div>
              )}

              {/* Amrit Kalam — show all windows */}
              {((panchang as any).amritKalamAll?.length > 0 || panchang.amritKalam) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                  className="rounded-xl p-5 text-center border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <div className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-2">{t('amritKalam')}</div>
                  {((panchang as any).amritKalamAll || [panchang.amritKalam]).map((a: { start: string; end: string }, i: number) => (
                    <div key={i} className="font-mono text-xl font-bold text-amber-300">{a.start} — {a.end}</div>
                  ))}
                  <div className="text-text-secondary text-xs mt-2 leading-relaxed">{t('amritKalamDesc')}</div>
                </motion.div>
              )}

              {/* Godhuli Muhurta */}
              {panchang.godhuli && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border border-amber-600/30 bg-gradient-to-br from-amber-600/5 to-transparent">
                  <div className="text-amber-500 text-xs uppercase tracking-wider font-bold mb-2">{t('godhuli')}</div>
                  <div className="font-mono text-xl font-bold text-amber-300">{panchang.godhuli.start} — {panchang.godhuli.end}</div>
                  <div className="text-text-secondary text-xs mt-2 leading-relaxed">{t('godhuliDesc')}</div>
                </motion.div>
              )}

              {/* Morning Sandhya */}
              {panchang.sandhyaKaal && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border border-orange-400/30 bg-gradient-to-br from-orange-500/5 to-transparent">
                  <div className="text-orange-400 text-xs uppercase tracking-wider font-bold mb-2">
                    {msg('morningSandhya', locale)}
                  </div>
                  <div className="font-mono text-xl font-bold text-orange-300">{panchang.sandhyaKaal.morning.start} — {panchang.sandhyaKaal.morning.end}</div>
                  <div className="text-text-secondary text-xs mt-2 leading-relaxed">
                    {msg('morningSandhyaDesc', locale)}
                  </div>
                </motion.div>
              )}

              {/* Evening Sandhya */}
              {panchang.sandhyaKaal && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.23 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border border-purple-400/30 bg-gradient-to-br from-purple-500/5 to-transparent">
                  <div className="text-purple-400 text-xs uppercase tracking-wider font-bold mb-2">
                    {msg('eveningSandhya', locale)}
                  </div>
                  <div className="font-mono text-xl font-bold text-purple-300">{panchang.sandhyaKaal.evening.start} — {panchang.sandhyaKaal.evening.end}</div>
                  <div className="text-text-secondary text-xs mt-2 leading-relaxed">
                    {msg('eveningSandhyaDesc', locale)}
                  </div>
                </motion.div>
              )}

              {/* Nishita Kaal */}
              {panchang.nishitaKaal && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center">
                  <div className="text-blue-400 text-xs uppercase tracking-wider font-bold mb-2">{t('nishitaKaal')}</div>
                  <div className="font-mono text-xl font-bold text-blue-300">{panchang.nishitaKaal.start} — {panchang.nishitaKaal.end}</div>
                  <div className="text-text-secondary text-xs mt-2 leading-relaxed">{t('nishitaKaalDesc')}</div>
                </motion.div>
              )}

              {/* Anandadi Yoga — auspicious variant */}
              {panchang.anandadiYoga && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29 }}
                  className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border ${
                    panchang.anandadiYoga.nature === 'auspicious'
                      ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent'
                      : 'border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent'
                  }`}>
                  <div className={`text-xs uppercase tracking-wider font-bold mb-2 ${panchang.anandadiYoga.nature === 'auspicious' ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {msg('anandadiYoga', locale)}
                  </div>
                  <div className={`font-bold text-lg ${panchang.anandadiYoga.nature === 'auspicious' ? 'text-emerald-300' : 'text-orange-300'}`}
                    style={headingFont}>
                    {tl(panchang.anandadiYoga.name)}
                  </div>
                  <div className="text-text-secondary text-xs mt-2 leading-relaxed">
                    {panchang.anandadiYoga.nature === 'auspicious'
                      ? msg('auspiciousYogaEnergy', locale)
                      : msg('mixedEnergyCaution', locale)}
                  </div>
                </motion.div>
              )}

              {/* Tamil Yoga */}
              {panchang.tamilYoga && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }}
                  className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border ${panchang.tamilYoga.nature === 'auspicious' ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                  <div className={`text-xs uppercase tracking-wider font-bold mb-2 ${panchang.tamilYoga.nature === 'auspicious' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {msg('tamilYoga', locale)}
                  </div>
                  <div className={`font-bold text-lg ${panchang.tamilYoga.nature === 'auspicious' ? 'text-emerald-300' : 'text-red-300'}`} style={headingFont}>
                    {tl(panchang.tamilYoga.name)}
                  </div>
                  <div className="text-text-secondary text-xs mt-2">
                    {panchang.tamilYoga.nature === 'auspicious'
                      ? msg('auspiciousGoodForImportant', locale)
                      : msg('inauspiciousAvoidNewVentures', locale)}
                  </div>
                </motion.div>
              )}

              {/* Homahuti */}
              {panchang.homahuti && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border border-orange-500/20">
                  <div className="text-orange-400 text-xs uppercase tracking-wider font-bold mb-2">
                    {msg('homahutiDirection', locale)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Compass className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-gold-light font-bold text-lg" style={headingFont}>{tl(panchang.homahuti.direction)}</div>
                      <div className="text-text-secondary text-xs">{msg('faceDirectionHoma', locale)}</div>
                    </div>
                  </div>
                  <div className="text-text-tertiary text-xs mt-2">
                    {`${msg('presidingDeity', locale)} ${_tl(panchang.homahuti.deity, locale)}`}
                  </div>
                </motion.div>
              )}

              {/* Mantri Mandala + Hora Table */}
              {panchang.mantriMandala && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-3">
                    {msg('mantriMandalaHora', locale)}
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary text-xs">{msg('dayLordKing', locale)}</span>
                      <span className="text-gold-light font-bold text-sm">{(GRAHAS[panchang.mantriMandala.king.planet]?.name[locale] || GRAHAS[panchang.mantriMandala.king.planet]?.name.en || '')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary text-xs">{msg('middayHoraLord', locale)}</span>
                      <span className="text-gold-light font-bold text-sm">{(GRAHAS[panchang.mantriMandala.minister.planet]?.name[locale] || GRAHAS[panchang.mantriMandala.minister.planet]?.name.en || '')}</span>
                    </div>
                  </div>
                  <div className="text-text-tertiary text-xs mb-3">
                    {msg('dayLordRules', locale)}
                  </div>
                  {/* Hora timetable with conflict detection */}
                  {panchang.mantriMandala.horas && (() => {
                    const toM = (t: string) => { const [hh, mm] = t.split(':').map(Number); return hh * 60 + mm; };
                    const nm = now.getHours() * 60 + now.getMinutes();
                    const ov = (aS: string, aE: string, bS: string, bE: string) => toM(aS) < toM(bE) && toM(bS) < toM(aE);
                    // Benefic hora planets: Jupiter(4), Venus(5), Mercury(3), Moon(1)
                    const beneficIds = new Set([1, 3, 4, 5]);
                    const badW: { start: string; end: string; label: string; labelHi: string }[] = [];
                    if (panchang.varjyam) badW.push({ ...panchang.varjyam, label: 'Varjyam', labelHi: 'वर्ज्यम्' });
                    if ((panchang as any).varjyamAll?.length > 1) {
                      for (let vi = 1; vi < (panchang as any).varjyamAll.length; vi++) badW.push({ ...(panchang as any).varjyamAll[vi], label: 'Varjyam', labelHi: 'वर्ज्यम्' });
                    }
                    badW.push({ start: panchang.rahuKaal.start, end: panchang.rahuKaal.end, label: 'Rahu Kaal', labelHi: 'राहु काल' });
                    badW.push({ start: panchang.yamaganda.start, end: panchang.yamaganda.end, label: 'Yamaganda', labelHi: 'यमगण्ड' });

                    const renderHora = (h: { planet: number; start: string; end: string }, i: number) => {
                      const hNow = nm >= toM(h.start) && nm < toM(h.end);
                      const isBenefic = beneficIds.has(h.planet);
                      const conflicts = isBenefic ? badW.filter(w => ov(h.start, h.end, w.start, w.end)) : [];
                      const hasConflict = conflicts.length > 0;
                      return (
                        <div key={i} className={`flex flex-col py-0.5 border-b border-gold-primary/5 ${hNow ? 'bg-gold-primary/10 rounded px-1 -mx-1 font-bold' : ''}`}>
                          <div className="flex justify-between">
                            <span className={hNow ? 'text-gold-light' : 'text-text-secondary'}>{h.start}–{h.end}{hNow ? ' ◂' : ''}</span>
                            <span className={`font-semibold ${hasConflict ? 'text-amber-400' : hNow ? 'text-gold-primary' : 'text-gold-light'}`}>
                              {(GRAHAS[h.planet]?.name[locale] || GRAHAS[h.planet]?.name.en || '')}
                              {hasConflict && ' ⚠'}
                            </span>
                          </div>
                          {hasConflict && (
                            <span className="text-amber-400/80 text-[9px] leading-tight">
                              {isDevanagariLocale(locale) ? conflicts.map(c => c.labelHi).join(', ') : conflicts.map(c => c.label).join(', ')}
                            </span>
                          )}
                        </div>
                      );
                    };

                    return (
                    <details className="group">
                      <summary className="text-gold-primary/70 text-xs cursor-pointer hover:text-gold-light transition-colors">
                        {'▸ ' + msg('viewAll24Horas', locale)}
                      </summary>
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                        <div>
                          <div className="text-gold-dark font-bold text-[10px] uppercase tracking-wider mb-1">{msg('dayHoras', locale)}</div>
                          {panchang.mantriMandala.horas.filter((h: { isDay: boolean }) => h.isDay).map((h: { planet: number; start: string; end: string }, i: number) => renderHora(h, i))}
                        </div>
                        <div>
                          <div className="text-gold-dark font-bold text-[10px] uppercase tracking-wider mb-1">{msg('nightHoras', locale)}</div>
                          {panchang.mantriMandala.horas.filter((h: { isDay: boolean }) => !h.isDay).map((h: { planet: number; start: string; end: string }, i: number) => renderHora(h, i))}
                        </div>
                      </div>
                    </details>
                    );
                  })()}
                </motion.div>
              )}
            </div>
          </div>

          <GoldDivider />

          {/* ═══════════════════════════════════════════════════
              SECTION 3: INAUSPICIOUS TIMINGS
          ═══════════════════════════════════════════════════ */}
          <div className="my-14">
            <SectionHeading
              icon={
                <svg width={56} height={56} viewBox="0 0 64 64" fill="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fca5a5" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                  <circle cx="32" cy="32" r="26" stroke="url(#red-grad)" strokeWidth="2" fill="none" opacity="0.4" />
                  <path d="M32 12v24M32 42v4" stroke="url(#red-grad)" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="32" cy="50" r="3" fill="#ef4444" />
                </svg>
              }
              title={msg('inauspiciousTimings', locale)}
              subtitle={msg('inauspiciousTimingsDesc', locale)}
              accentClass="text-red-400"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {/* Rahu Kalam */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center border border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent">
                <div className="text-red-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('rahuKaal')}</div>
                <div className="font-mono text-2xl font-bold text-red-300">{panchang.rahuKaal.start} — {panchang.rahuKaal.end}</div>
                <div className="text-text-secondary text-xs mt-2">{msg('rahuKaalDesc', locale)}</div>
              </motion.div>

              {/* Yamaganda */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center border border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent">
                <div className="text-orange-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('yamaganda')}</div>
                <div className="font-mono text-2xl font-bold text-orange-300">{panchang.yamaganda.start} — {panchang.yamaganda.end}</div>
                <div className="text-text-secondary text-xs mt-2">{msg('yamagandaDesc', locale)}</div>
              </motion.div>

              {/* Gulika Kaal */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.11 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center border border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent">
                <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('gulikaKaal')}</div>
                <div className="font-mono text-2xl font-bold text-yellow-300">{panchang.gulikaKaal.start} — {panchang.gulikaKaal.end}</div>
                <div className="text-text-secondary text-xs mt-2">{msg('gulikaKaalDesc', locale)}</div>
              </motion.div>

              {/* Dur Muhurtam — two classical traditions */}
              {panchang.durMuhurtam && panchang.durMuhurtam.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.14 }}
                  className="rounded-xl border border-red-600/30 bg-gradient-to-br from-red-600/5 to-transparent p-3 sm:p-4 md:p-6 text-center">
                  <div className="text-red-500 text-xs uppercase tracking-widest mb-2 font-bold">
                    {msg('durMuhurtam', locale)}
                  </div>
                  <div className="text-text-secondary/50 text-[10px] mb-2">
                    {msg('kaalaPrakashika', locale)}
                  </div>
                  {panchang.durMuhurtam.map((w, i) => (
                    <div key={i} className="font-mono text-lg font-bold text-red-400 leading-tight">{w.start} — {w.end}</div>
                  ))}
                  {panchang.durMuhurtamAlt && panchang.durMuhurtamAlt.length > 0 && (
                    <details className="mt-3 text-left">
                      <summary className="text-text-tertiary/50 text-[10px] cursor-pointer hover:text-text-secondary transition-colors text-center">
                        {'▸ ' + msg('nirnayaSindhu', locale)}
                      </summary>
                      <div className="mt-2 text-center">
                        {panchang.durMuhurtamAlt.map((w: { start: string; end: string }, i: number) => (
                          <div key={i} className="font-mono text-sm text-red-400/60 leading-tight">{w.start} — {w.end}</div>
                        ))}
                      </div>
                    </details>
                  )}
                  <div className="text-text-secondary text-xs mt-2">{msg('inauspiciousAvoidAll', locale)}</div>
                </motion.div>
              )}

              {/* Visha Ghatika — 25th Ghatika poison period */}
              {panchang.vishaGhatika && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-700/30 p-3 sm:p-4 md:p-6 text-center bg-gradient-to-br from-red-700/5 to-transparent">
                  <div className="text-red-500 text-xs uppercase tracking-widest mb-2 font-bold">
                    {msg('vishaGhatika', locale)}
                  </div>
                  <div className="font-mono text-lg font-bold text-red-400">{panchang.vishaGhatika.start} — {panchang.vishaGhatika.end}</div>
                  <div className="text-text-secondary text-xs mt-2">
                    {msg('vishaGhatikaDesc', locale)}
                  </div>
                </motion.div>
              )}

              {/* Varjyam — show all windows */}
              {((panchang as any).varjyamAll?.length > 0 || panchang.varjyam) && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.17 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center border border-red-400/25 bg-gradient-to-br from-red-400/5 to-transparent">
                  <div className="text-red-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('varjyam')}</div>
                  {((panchang as any).varjyamAll || [panchang.varjyam]).map((v: { start: string; end: string }, i: number) => (
                    <div key={i} className="font-mono text-xl font-bold text-red-300">{v.start} — {v.end}</div>
                  ))}
                  <div className="text-text-secondary text-xs mt-2">{t('varjyamDesc')}</div>
                </motion.div>
              )}

              {/* Bhadra (Vishti Karana) */}
              {panchang.bhadra && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 }}
                  className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/8 to-transparent p-3 sm:p-4 md:p-6 text-center">
                  <div className="text-orange-400 text-xs uppercase tracking-widest mb-2 font-bold">
                    {msg('bhadraVishti', locale)}
                  </div>
                  {((panchang as any).bhadraAll || [panchang.bhadra]).map((b: { start: string; end: string; endDate?: string }, i: number) => (
                    <div key={i} className="font-mono text-xl font-bold text-orange-300">
                      {b.start} — {b.end}{b.endDate ? `, ${b.endDate.split('-').reverse().join('/')}` : ''}
                    </div>
                  ))}
                  <div className="text-text-secondary text-xs mt-2">
                    {msg('inauspiciousKarana', locale)}
                  </div>
                </motion.div>
              )}

              {/* Ganda Moola — with time window */}
              {panchang.gandaMoola?.active && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.20 }}
                  className="rounded-xl p-3 sm:p-4 md:p-6 text-center border-2 border-red-500/50 bg-gradient-to-br from-red-500/10 to-transparent">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <div className="text-red-400 text-xs uppercase tracking-widest font-bold">
                      {msg('gandaMoola', locale)}
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  {panchang.gandaMoola.nakshatra && (
                    <div className="text-red-300 font-bold text-base" style={headingFont}>
                      {((panchang.gandaMoola as any).nakshatra?.[locale] || (panchang.gandaMoola as any).nakshatra?.en || '')}
                    </div>
                  )}
                  {(panchang.gandaMoola as any).start && (
                    <div className="font-mono text-lg font-bold text-red-300 mt-1">
                      {(panchang.gandaMoola as any).start} — {(panchang.gandaMoola as any).end}{(panchang.gandaMoola as any).endDate ? `, ${(panchang.gandaMoola as any).endDate.split('-').slice(1).join('/')}` : ''}
                    </div>
                  )}
                  <div className="text-text-secondary text-xs mt-2">
                    {msg('inauspiciousNakshatraJunction', locale)}
                  </div>
                </motion.div>
              )}

              {/* Aadal Yoga */}
              {panchang.aadalYoga && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.21 }}
                  className="rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/5 to-transparent p-3 sm:p-4 md:p-6 text-center">
                  <div className="text-amber-400 text-xs uppercase tracking-widest mb-2 font-bold">
                    {msg('aadalYoga', locale)}
                  </div>
                  <div className="font-mono text-xl font-bold text-amber-300">
                    {panchang.aadalYoga.start} — {panchang.aadalYoga.end}{panchang.aadalYoga.endDate ? `, ${panchang.aadalYoga.endDate.split('-').slice(1).join('/')}` : ''}
                  </div>
                  <div className="text-text-secondary text-xs mt-2">
                    {msg('aadalYogaDesc', locale)}
                  </div>
                </motion.div>
              )}

              {/* Vidaal Yoga */}
              {panchang.vidaalYoga && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.22 }}
                  className="rounded-xl border border-rose-500/25 bg-gradient-to-br from-rose-500/5 to-transparent p-3 sm:p-4 md:p-6 text-center">
                  <div className="text-rose-400 text-xs uppercase tracking-widest mb-2 font-bold">
                    {msg('vidaalYoga', locale)}
                  </div>
                  <div className="font-mono text-xl font-bold text-rose-300">
                    {panchang.vidaalYoga.start} — {panchang.vidaalYoga.end}{panchang.vidaalYoga.endDate ? `, ${panchang.vidaalYoga.endDate.split('-').slice(1).join('/')}` : ''}
                  </div>
                  <div className="text-text-secondary text-xs mt-2">
                    {msg('vidaalYogaDesc', locale)}
                  </div>
                </motion.div>
              )}

              {/* Panchaka — pulsing purple warning */}
              {panchang.panchaka?.active && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.23 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    <div className="text-purple-400 text-xs uppercase tracking-widest font-bold">
                      {msg('panchaka', locale)}
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                  </div>
                  {panchang.panchaka.type && (
                    <div className="text-purple-300 font-bold text-base" style={headingFont}>
                      {tl(panchang.panchaka.type)}
                    </div>
                  )}
                  <div className="text-text-secondary text-xs mt-2">
                    {msg('panchakaDesc', locale)}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <GoldDivider />

          {/* ═══════════════════════════════════════════════════
              SECTION 4: NIVAS & SHOOL
          ═══════════════════════════════════════════════════ */}
          <div className="my-14">
            <SectionHeading
              icon={<Compass className="w-14 h-14 text-indigo-400" />}
              title={msg('nivasShool', locale)}
              subtitle={msg('nivasShoolDesc', locale)}
              accentClass="text-indigo-400"
            />

            <div className="text-center mb-6">
              <Link href="/nivas-shool" className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                {msg('learnNivasShool', locale)} →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Disha Shool */}
              {panchang.dishaShool && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border border-orange-500/25 bg-gradient-to-br from-orange-500/5 to-transparent lg:col-span-1">
                  <div className="text-orange-400 text-xs uppercase tracking-widest font-bold mb-3">{t('dishaShool')}</div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-400 text-xl font-bold">
                        {(tl(panchang.dishaShool.direction) || panchang.dishaShool.direction?.en || 'N').charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-text-primary font-bold text-lg" style={headingFont}>{tl(panchang.dishaShool.direction) || panchang.dishaShool.direction.en}</div>
                      <div className="text-text-secondary text-xs">{t('dishaShoolDesc')}</div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-orange-500/10">
                    <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1">{t('remedy')}</div>
                    <div className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(panchang.dishaShool.remedy)}</div>
                  </div>
                </motion.div>
              )}

              {/* Shiva Vaas */}
              {panchang.shivaVaas && (() => {
                const shivaName = panchang.shivaVaas.name?.en || (panchang.shivaVaas as unknown as { en: string }).en || '';
                const nature = panchang.shivaVaas.nature || 'neutral';
                const tithiList = panchang.shivaVaas.tithis || [];
                const shivaDesc: Record<string, { nColor: string; border: string; bg: string; desc: LocaleText; activities: LocaleText }> = {
                  'Kailash (Mountain)': {
                    nColor: 'text-emerald-300', border: 'border-emerald-500/25', bg: 'from-emerald-500/5',
                    desc: { en: 'Shiva resides in his divine abode atop Kailash with Parvati. He is serene, benevolent, and easily pleased. Best time for Shiva puja, abhishek, and auspicious activities.', hi: 'शिव कैलाश पर पार्वती के साथ हैं। वे शांत, दयालु और प्रसन्न हैं। शिव पूजा, अभिषेक और शुभ कार्यों का सर्वोत्तम समय।', sa: 'शिव कैलाश पर पार्वती के साथ हैं। वे शांत, दयालु और प्रसन्न हैं। शिव पूजा, अभिषेक और शुभ कार्यों का सर्वोत्तम समय।', mai: 'शिव कैलाश पर पार्वती के साथ हैं। वे शांत, दयालु और प्रसन्न हैं। शिव पूजा, अभिषेक और शुभ कार्यों का सर्वोत्तम समय।', mr: 'शिव कैलाश पर पार्वती के साथ हैं। वे शांत, दयालु और प्रसन्न हैं। शिव पूजा, अभिषेक और शुभ कार्यों का सर्वोत्तम समय।', ta: 'சிவன் பார்வதியுடன் கயிலாயத்தின் மீது தனது தெய்வீக இருப்பிடத்தில் வசிக்கிறார். அவர் அமைதியான, கருணையுள்ள, எளிதில் மகிழ்விக்கக்கூடியவர். சிவ பூஜை, அபிஷேகம் மற்றும் சுப நிகழ்வுகளுக்கு சிறந்த நேரம்.', te: 'శివుడు పార్వతితో కైలాసం శిఖరంపై తన దివ్య నివాసంలో ఉన్నాడు. ఆయన ప్రశాంతుడు, దయాపరుడు, సులభంగా ప్రసన్నమయ్యేవాడు. శివ పూజ, అభిషేకం మరియు శుభ కార్యక్రమాలకు ఉత్తమ సమయం.', bn: 'শিব পার্বতীর সাথে কৈলাসের চূড়ায় তাঁর দিব্য নিবাসে বিরাজ করেন। তিনি শান্ত, দয়ালু এবং সহজে প্রসন্ন হন। শিব পূজা, অভিষেক ও শুভ কাজের জন্য সেরা সময়।', kn: 'ಶಿವ ಪಾರ್ವತಿಯೊಂದಿಗೆ ಕೈಲಾಸದ ಮೇಲೆ ತಮ್ಮ ದಿವ್ಯ ನಿವಾಸದಲ್ಲಿ ವಾಸಿಸುತ್ತಾರೆ. ಅವರು ಶಾಂತ, ದಯಾಳು ಮತ್ತು ಸುಲಭವಾಗಿ ಪ್ರಸನ್ನರಾಗುತ್ತಾರೆ. ಶಿವ ಪೂಜೆ, ಅಭಿಷೇಕ ಮತ್ತು ಶುಭ ಚಟುವಟಿಕೆಗಳಿಗೆ ಅತ್ಯುತ್ತಮ ಸಮಯ.', gu: 'શિવ પાર્વતી સાથે કૈલાસની ટોચ પર તેમના દિવ્ય નિવાસમાં બિરાજે છે. તેઓ શાંત, દયાળુ અને સહેલાઈથી પ્રસન્ન થાય છે. શિવ પૂજા, અભિષેક અને શુભ પ્રવૃત્તિઓ માટે શ્રેષ્ઠ સમય.' },
                    activities: { en: 'Shiva puja, abhishek, marriage, business launch', hi: 'शिव पूजा, अभिषेक, विवाह, व्यापार आरंभ', sa: 'शिव पूजा, अभिषेक, विवाह, व्यापार आरंभ', mai: 'शिव पूजा, अभिषेक, विवाह, व्यापार आरंभ', mr: 'शिव पूजा, अभिषेक, विवाह, व्यापार आरंभ', ta: 'சிவ பூஜை, அபிஷேகம், திருமணம், வணிக தொடக்கம்', te: 'శివ పూజ, అభిషేకం, వివాహం, వ్యాపార ప్రారంభం', bn: 'শিব পূজা, অভিষেক, বিবাহ, ব্যবসা শুরু', kn: 'ಶಿವ ಪೂಜೆ, ಅಭಿಷೇಕ, ವಿವಾಹ, ವ್ಯಾಪಾರ ಆರಂಭ', gu: 'શિવ પૂજા, અભિષેક, લગ્ન, વ્યાપાર શરૂઆત' },
                  },
                  'Shamshan (Cremation Ground)': {
                    nColor: 'text-red-400', border: 'border-red-500/25', bg: 'from-red-500/5',
                    desc: { en: 'Shiva dwells in the cremation ground in his fierce Rudra/Bhairava form. Auspicious activities should be avoided; Tantric rites may be performed by adepts.', hi: 'शिव श्मशान में रुद्र/भैरव रूप में हैं। शुभ कार्यों से बचें; तांत्रिक अनुष्ठान साधक कर सकते हैं।', sa: 'शिव श्मशान में रुद्र/भैरव रूप में हैं। शुभ कार्यों से बचें; तांत्रिक अनुष्ठान साधक कर सकते हैं।', mai: 'शिव श्मशान में रुद्र/भैरव रूप में हैं। शुभ कार्यों से बचें; तांत्रिक अनुष्ठान साधक कर सकते हैं।', mr: 'शिव श्मशान में रुद्र/भैरव रूप में हैं। शुभ कार्यों से बचें; तांत्रिक अनुष्ठान साधक कर सकते हैं।', ta: 'சிவன் தனது உக்கிரமான ருத்ர/பைரவ வடிவத்தில் சுடுகாட்டில் வசிக்கிறார். சுப நிகழ்வுகளைத் தவிர்க்க வேண்டும்; தாந்திரீக சடங்குகளை நிபுணர்கள் செய்யலாம்.', te: 'శివుడు తన భయంకరమైన రుద్ర/భైరవ రూపంలో శ్మశానంలో నివసిస్తాడు. శుభ కార్యక్రమాలు నివారించాలి; తాంత్రిక అనుష్ఠానాలు నిపుణులు చేయవచ్చు.', bn: 'শিব তাঁর ভয়ংকর রুদ্র/ভৈরব রূপে শ্মশানে বাস করেন। শুভ কাজ এড়ানো উচিত; তান্ত্রিক অনুষ্ঠান বিশেষজ্ঞরা করতে পারেন।', kn: 'ಶಿವ ತಮ್ಮ ಭಯಂಕರ ರುದ್ರ/ಭೈರವ ರೂಪದಲ್ಲಿ ಸ್ಮಶಾನದಲ್ಲಿ ವಾಸಿಸುತ್ತಾರೆ. ಶುಭ ಚಟುವಟಿಕೆಗಳನ್ನು ತಪ್ಪಿಸಬೇಕು; ತಾಂತ್ರಿಕ ವಿಧಿಗಳನ್ನು ಪರಿಣಿತರು ಮಾಡಬಹುದು.', gu: 'શિવ તેમના ઉગ્ર રુદ્ર/ભૈરવ રૂપમાં સ્મશાનમાં વસે છે. શુભ પ્રવૃત્તિઓ ટાળવી જોઈએ; તાંત્રિક વિધિ નિષ્ણાતો કરી શકે.' },
                    activities: { en: 'Avoid auspicious events; Rudra worship, ancestral rites', hi: 'शुभ कार्य वर्जित; रुद्र पूजा, पित्र कार्य', sa: 'शुभ कार्य वर्जित; रुद्र पूजा, पित्र कार्य', mai: 'शुभ कार्य वर्जित; रुद्र पूजा, पित्र कार्य', mr: 'शुभ कार्य वर्जित; रुद्र पूजा, पित्र कार्य', ta: 'சுப நிகழ்வுகளைத் தவிர்க்கவும்; ருத்ர வழிபாடு, முன்னோர் சடங்குகள்', te: 'శుభ సంఘటనలు నివారించండి; రుద్ర పూజ, పూర్వీకుల తర్పణం', bn: 'শুভ অনুষ্ঠান এড়িয়ে চলুন; রুদ্র পূজা, পূর্বপুরুষ শ্রাদ্ধ', kn: 'ಶುಭ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ತಪ್ಪಿಸಿ; ರುದ್ರ ಪೂಜೆ, ಪೂರ್ವಜ ಆಚರಣೆ', gu: 'શુભ પ્રસંગો ટાળો; રુદ્ર પૂજા, પૂર્વજ ક્રિયા' },
                  },
                  "Gori's Abode (Auspicious)": {
                    nColor: 'text-pink-300', border: 'border-pink-500/25', bg: 'from-pink-500/5',
                    desc: { en: "Shiva visits Parvati's home — domestic bliss and harmony. Good for marriage, family, home, and matters of Venus.", hi: 'शिव पार्वती के घर में हैं — गृहस्थ आनंद। विवाह, परिवार, घर संबंधी कार्यों के लिए शुभ।', sa: 'शिव पार्वती के घर में हैं — गृहस्थ आनंद। विवाह, परिवार, घर संबंधी कार्यों के लिए शुभ।', mai: 'शिव पार्वती के घर में हैं — गृहस्थ आनंद। विवाह, परिवार, घर संबंधी कार्यों के लिए शुभ।', mr: 'शिव पार्वती के घर में हैं — गृहस्थ आनंद। विवाह, परिवार, घर संबंधी कार्यों के लिए शुभ।', ta: "Shiva visits Parvati's home — domestic bliss and harmony. Good for marriage, family, home, and matters of Venus.", te: "Shiva visits Parvati's home — domestic bliss and harmony. Good for marriage, family, home, and matters of Venus.", bn: "Shiva visits Parvati's home — domestic bliss and harmony. Good for marriage, family, home, and matters of Venus.", kn: "Shiva visits Parvati's home — domestic bliss and harmony. Good for marriage, family, home, and matters of Venus.", gu: "Shiva visits Parvati's home — domestic bliss and harmony. Good for marriage, family, home, and matters of Venus." },
                    activities: { en: 'Marriage, family rituals, home purchase, Gauri puja', hi: 'विवाह, पारिवारिक अनुष्ठान, गृह क्रय, गौरी पूजा', sa: 'विवाह, पारिवारिक अनुष्ठान, गृह क्रय, गौरी पूजा', mai: 'विवाह, पारिवारिक अनुष्ठान, गृह क्रय, गौरी पूजा', mr: 'विवाह, पारिवारिक अनुष्ठान, गृह क्रय, गौरी पूजा', ta: 'திருமணம், குடும்ப சடங்குகள், வீடு வாங்குதல், கௌரி பூஜை', te: 'వివాహం, కుటుంబ ఆచారాలు, ఇల్లు కొనుగోలు, గౌరీ పూజ', bn: 'বিবাহ, পারিবারিক অনুষ্ঠান, গৃহ ক্রয়, গৌরী পূজা', kn: 'ವಿವಾಹ, ಕುಟುಂಬ ಆಚರಣೆ, ಮನೆ ಖರೀದಿ, ಗೌರಿ ಪೂಜೆ', gu: 'લગ્ન, કુટુંબ વિધિ, ઘર ખરીદી, ગૌરી પૂજા' },
                  },
                  'Sports & Play': {
                    nColor: 'text-amber-300', border: 'border-amber-500/25', bg: 'from-amber-500/5',
                    desc: { en: "Shiva is at cosmic play (Leela) — dancing the Tandava. His attention is divided; mixed results. Arts, music, and dance are well-supported.", hi: 'शिव लीला में हैं — तांडव नृत्य कर रहे हैं। मिश्रित फल। कला, संगीत, नृत्य उत्तम।', sa: 'शिव लीला में हैं — तांडव नृत्य कर रहे हैं। मिश्रित फल। कला, संगीत, नृत्य उत्तम।', mai: 'शिव लीला में हैं — तांडव नृत्य कर रहे हैं। मिश्रित फल। कला, संगीत, नृत्य उत्तम।', mr: 'शिव लीला में हैं — तांडव नृत्य कर रहे हैं। मिश्रित फल। कला, संगीत, नृत्य उत्तम।', ta: "Shiva is at cosmic play (Leela) — dancing the Tandava. His attention is divided; mixed results. Arts, music, and dance are well-supported.", te: "Shiva is at cosmic play (Leela) — dancing the Tandava. His attention is divided; mixed results. Arts, music, and dance are well-supported.", bn: "Shiva is at cosmic play (Leela) — dancing the Tandava. His attention is divided; mixed results. Arts, music, and dance are well-supported.", kn: "Shiva is at cosmic play (Leela) — dancing the Tandava. His attention is divided; mixed results. Arts, music, and dance are well-supported.", gu: "Shiva is at cosmic play (Leela) — dancing the Tandava. His attention is divided; mixed results. Arts, music, and dance are well-supported." },
                    activities: { en: 'Arts, music, dance; avoid critical ventures', hi: 'कला, संगीत, नृत्य; महत्वपूर्ण कार्यों से बचें', sa: 'कला, संगीत, नृत्य; महत्वपूर्ण कार्यों से बचें', mai: 'कला, संगीत, नृत्य; महत्वपूर्ण कार्यों से बचें', mr: 'कला, संगीत, नृत्य; महत्वपूर्ण कार्यों से बचें', ta: 'கலைகள், இசை, நடனம்; முக்கியமான முயற்சிகளைத் தவிர்க்கவும்', te: 'కళలు, సంగీతం, నృత్యం; క్లిష్టమైన కార్యక్రమాలు నివారించండి', bn: 'কলা, সংগীত, নৃত্য; গুরুত্বপূর্ণ উদ্যোগ এড়িয়ে চলুন', kn: 'ಕಲೆಗಳು, ಸಂಗೀತ, ನೃತ್ಯ; ಮಹತ್ವದ ಉದ್ಯಮ ತಪ್ಪಿಸಿ', gu: 'કળાઓ, સંગીત, નૃત્ય; મહત્ત્વના ઉપક્રમો ટાળો' },
                  },
                  'Deep Meditation (Samadhi)': {
                    nColor: 'text-violet-300', border: 'border-violet-500/25', bg: 'from-violet-500/5',
                    desc: { en: 'Shiva is in deep Samadhi — beyond the phenomenal world. Sacred for meditation and spiritual practice, but mundane activities may not receive divine support.', hi: 'शिव गहरी समाधि में हैं। ध्यान और आध्यात्मिक साधना के लिए पवित्र, लेकिन सांसारिक कार्यों में कम सहायता।', sa: 'शिव गहरी समाधि में हैं। ध्यान और आध्यात्मिक साधना के लिए पवित्र, लेकिन सांसारिक कार्यों में कम सहायता।', mai: 'शिव गहरी समाधि में हैं। ध्यान और आध्यात्मिक साधना के लिए पवित्र, लेकिन सांसारिक कार्यों में कम सहायता।', mr: 'शिव गहरी समाधि में हैं। ध्यान और आध्यात्मिक साधना के लिए पवित्र, लेकिन सांसारिक कार्यों में कम सहायता।', ta: 'சிவன் ஆழ்ந்த சமாதியில் உள்ளார் — புலன் உலகத்திற்கு அப்பாற்பட்டது. தியானம் மற்றும் ஆன்மிக பயிற்சிக்கு புனிதமானது, ஆனால் உலகியல் நடவடிக்கைகள் தெய்வீக ஆதரவைப் பெறாமல் போகலாம்.', te: 'శివుడు లోతైన సమాధిలో ఉన్నాడు — భౌతిక ప్రపంచానికి అతీతం. ధ్యానం మరియు ఆధ్యాత్మిక సాధనకు పవిత్రం, కానీ లౌకిక కార్యక్రమాలు దైవ మద్దతు పొందకపోవచ్చు.', bn: 'শিব গভীর সমাধিতে — জাগতিক জগতের ঊর্ধ্বে। ধ্যান ও আধ্যাত্মিক সাধনার জন্য পবিত্র, কিন্তু জাগতিক কাজ দৈব সমর্থন নাও পেতে পারে।', kn: 'ಶಿವ ಆಳವಾದ ಸಮಾಧಿಯಲ್ಲಿ — ಭೌತಿಕ ಜಗತ್ತಿನಾಚೆ. ಧ್ಯಾನ ಮತ್ತು ಅಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆಗೆ ಪವಿತ್ರ, ಆದರೆ ಲೌಕಿಕ ಚಟುವಟಿಕೆಗಳು ದೈವಿಕ ಬೆಂಬಲ ಪಡೆಯದಿರಬಹುದು.', gu: 'શિવ ઊંડી સમાધિમાં છે — ભૌતિક જગતની પાર. ધ્યાન અને આધ્યાત્મિક સાધના માટે પવિત્ર, પણ સાંસારિક પ્રવૃત્તિઓ દૈવી ટેકો ન પામે.' },
                    activities: { en: 'Meditation, japa, fasting. Avoid worldly ventures.', hi: 'ध्यान, जप, उपवास। सांसारिक कार्यों से बचें।', sa: 'ध्यान, जप, उपवास। सांसारिक कार्यों से बचें।', mai: 'ध्यान, जप, उपवास। सांसारिक कार्यों से बचें।', mr: 'ध्यान, जप, उपवास। सांसारिक कार्यों से बचें।', ta: 'தியானம், ஜபம், விரதம். உலகியல் முயற்சிகளைத் தவிர்க்கவும்.', te: 'ధ్యానం, జపం, ఉపవాసం. లౌకిక కార్యక్రమాలు నివారించండి.', bn: 'ধ্যান, জপ, উপবাস। জাগতিক উদ্যোগ এড়িয়ে চলুন।', kn: 'ಧ್ಯಾನ, ಜಪ, ಉಪವಾಸ. ಲೌಕಿಕ ಉದ್ಯಮ ತಪ್ಪಿಸಿ.', gu: 'ધ્યાન, જાપ, ઉપવાસ. સાંસારિક ઉપક્રમો ટાળો.' },
                  },
                };
                const d = shivaDesc[shivaName] || shivaDesc['Kailash (Mountain)'];
                const natureLabel = { auspicious: 'Auspicious', inauspicious: 'Inauspicious', neutral: 'Neutral', mixed: 'Mixed' }[nature] || 'Neutral';
                const natureLabelHi = { auspicious: 'शुभ', inauspicious: 'अशुभ', neutral: 'तटस्थ', mixed: 'मिश्रित' }[nature] || 'तटस्थ';
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                    className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border ${d.border} bg-gradient-to-br ${d.bg} to-transparent`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-indigo-400 text-xs uppercase tracking-widest font-bold">
                        {msg('shivaVaas', locale)}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.nColor} bg-black/20 border ${d.border}`}>{_tl({en: natureLabel, hi: natureLabelHi} as LocaleText, locale)}</span>
                    </div>
                    <div className="text-gold-light font-bold text-xl mb-2" style={headingFont}>{panchang.shivaVaas.name?.[locale] || shivaName}</div>
                    {tithiList.length > 0 && (
                      <div className="text-text-tertiary text-xs mb-2">{msg('tithisLabel', locale)}: {tithiList.join(', ')}</div>
                    )}
                    <div className="text-text-secondary text-xs leading-relaxed mb-3">{_tl(d.desc, locale)}</div>
                    <div className={`p-2.5 rounded-lg bg-black/20 border ${d.border}`}>
                      <div className="text-text-tertiary text-xs uppercase tracking-wider mb-0.5">{msg('activities', locale)}</div>
                      <div className={`text-xs font-medium ${d.nColor}`}>{_tl(d.activities, locale)}</div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Agni Vaas */}
              {panchang.agniVaas && (() => {
                const agniName = panchang.agniVaas.name?.en || (panchang.agniVaas as unknown as { en: string }).en || '';
                const nature = panchang.agniVaas.nature || 'neutral';
                const validUntil = panchang.agniVaas.validUntil;
                const agniDesc: Record<string, { nColor: string; border: string; bg: string; desc: LocaleText; ritualNote: LocaleText }> = {
                  'Sky (Akasha)': {
                    nColor: 'text-sky-300', border: 'border-sky-500/25', bg: 'from-sky-500/5',
                    desc: { en: 'Agni resides in the celestial sky. Fire rituals are carried directly to the devatas.', hi: 'अग्नि आकाश में हैं। अग्नि अनुष्ठान सीधे देवताओं तक पहुँचते हैं।', sa: 'अग्निः आकाशे वसति। अग्निकार्याणि साक्षात् देवान् प्रति गच्छन्ति।', mai: 'अग्नि आकाश मे छथि। अग्नि अनुष्ठान सोझे देवता लग पहुँचैत अछि।', mr: 'अग्नी आकाशात वास करतो। अग्नी अनुष्ठान थेट देवतांपर्यंत पोहोचतात.', ta: 'அக்னி வான வெளியில் வசிக்கிறார். அக்னி சடங்குகள் நேரடியாக தேவர்களை அடைகின்றன.', te: 'అగ్ని ఆకాశంలో నివసిస్తున్నాడు. అగ్ని కర్మలు నేరుగా దేవతలకు చేరుతాయి.', bn: 'অগ্নি আকাশে অবস্থান করেন। অগ্নি অনুষ্ঠান সরাসরি দেবতাদের কাছে পৌঁছায়।', kn: 'ಅಗ್ನಿ ಆಕಾಶದಲ್ಲಿ ನೆಲೆಸಿದ್ದಾನೆ. ಅಗ್ನಿ ಆಚರಣೆಗಳು ನೇರವಾಗಿ ದೇವತೆಗಳನ್ನು ತಲುಪುತ್ತವೆ.', gu: 'અગ્નિ આકાશમાં વસે છે. અગ્નિ અનુષ્ઠાન સીધા દેવતાઓ સુધી પહોંચે છે.' },
                    ritualNote: { en: 'Homa & Yajna highly effective — offerings rise unimpeded', hi: 'होम और यज्ञ अत्यंत प्रभावी — आहुतियाँ बाधारहित ऊर्ध्वगामी', sa: 'होमयज्ञौ अत्यन्तं प्रभावशालिनौ — आहुतयः निर्बाधम् ऊर्ध्वगामिन्यः', mai: 'होम आ यज्ञ अत्यंत प्रभावी — आहुति बाधारहित ऊर्ध्वगामी', mr: 'होम आणि यज्ञ अत्यंत प्रभावी — आहुती अडथळ्याशिवाय ऊर्ध्वगामी', ta: 'ஹோமம் & யக்ஞம் மிகவும் பயனுள்ளது — படையல்கள் தடையின்றி மேலெழும்', te: 'హోమం & యజ్ఞం అత్యంత ప్రభావవంతం — ఆహుతులు అడ్డంకి లేకుండా పైకి లేస్తాయి', bn: 'হোম ও যজ্ঞ অত্যন্ত ফলপ্রসূ — আহুতি বাধাহীনভাবে ঊর্ধ্বগামী', kn: 'ಹೋಮ ಮತ್ತು ಯಜ್ಞ ಅತ್ಯಂತ ಪರಿಣಾಮಕಾರಿ — ಆಹುತಿಗಳು ನಿರ್ಬಾಧವಾಗಿ ಮೇಲೇರುತ್ತವೆ', gu: 'હોમ અને યજ્ઞ અત્યંત પ્રભાવી — આહુતિ અવરોધ વિના ઊર્ધ્વગામી' },
                  },
                  'Earth (Bhumi)': {
                    nColor: 'text-emerald-300', border: 'border-emerald-500/25', bg: 'from-emerald-500/5',
                    desc: { en: 'Agni is grounded in the earth plane. Fire rituals nourish the land and people.', hi: 'अग्नि पृथ्वी पर हैं। अग्नि अनुष्ठान भूमि और लोगों को पोषित करते हैं।', sa: 'अग्निः भूमौ स्थितः। अग्निकार्याणि भूमिं जनांश्च पोषयन्ति।', mai: 'अग्नि पृथ्वी पर छथि। अग्नि अनुष्ठान भूमि आ लोक केँ पोषित करैत अछि।', mr: 'अग्नी पृथ्वीवर स्थित आहे. अग्नी अनुष्ठान भूमी आणि लोकांचे पोषण करतात.', ta: 'அக்னி பூமியில் நிலைகொண்டுள்ளார். அக்னி சடங்குகள் நிலத்தையும் மக்களையும் வளர்க்கின்றன.', te: 'అగ్ని భూమిలో స్థిరంగా ఉన్నాడు. అగ్ని కర్మలు భూమిని, ప్రజలను పోషిస్తాయి.', bn: 'অগ্নি পৃথিবীতে অবস্থান করেন। অগ্নি অনুষ্ঠান ভূমি ও মানুষকে পুষ্ট করে।', kn: 'ಅಗ್ನಿ ಭೂಮಿಯಲ್ಲಿ ನೆಲೆಸಿದ್ದಾನೆ. ಅಗ್ನಿ ಆಚರಣೆಗಳು ಭೂಮಿ ಮತ್ತು ಜನರನ್ನು ಪೋಷಿಸುತ್ತವೆ.', gu: 'અગ્નિ પૃથ્વી પર સ્થિત છે. અગ્નિ અનુષ્ઠાન ભૂમિ અને લોકોનું પોષણ કરે છે.' },
                    ritualNote: { en: 'Agriculture blessings, prosperity rituals, Griha Pravesh powerful', hi: 'कृषि, समृद्धि, गृह प्रवेश अग्नि कार्य विशेष प्रभावी', sa: 'कृषिः, समृद्धिः, गृहप्रवेशः — अग्निकार्याणि विशेषं प्रभावशालिनि', mai: 'कृषि, समृद्धि, गृह प्रवेश अग्नि कार्य विशेष प्रभावी', mr: 'शेती, समृद्धी, गृहप्रवेश अग्नी कार्य विशेष प्रभावी', ta: 'விவசாய ஆசீர்வாதம், செழிப்பு சடங்குகள், கிருஹ பிரவேசம் சக்திவாய்ந்தது', te: 'వ్యవసాయ ఆశీర్వాదాలు, సంపద కర్మలు, గృహ ప్రవేశం శక్తివంతం', bn: 'কৃষি আশীর্বাদ, সমৃদ্ধি অনুষ্ঠান, গৃহপ্রবেশ শক্তিশালী', kn: 'ಕೃಷಿ ಆಶೀರ್ವಾದ, ಸಮೃದ್ಧಿ ಆಚರಣೆ, ಗೃಹಪ್ರವೇಶ ಪ್ರಬಲ', gu: 'કૃષિ આશીર્વાદ, સમૃદ્ધિ અનુષ્ઠાન, ગૃહ પ્રવેશ શક્તિશાળી' },
                  },
                  'Patala': {
                    nColor: 'text-red-400', border: 'border-red-500/25', bg: 'from-red-500/5',
                    desc: { en: 'Agni descends to the netherworld. Fire rituals may have reversed or weakened effects.', hi: 'अग्नि पाताल में हैं। अग्नि अनुष्ठानों के उलटे या कमजोर प्रभाव।', sa: 'अग्निः पातालं गतः। अग्निकार्याणां विपरीतं दुर्बलं वा फलं भवेत्।', mai: 'अग्नि पाताल मे छथि। अग्नि अनुष्ठानक उलटा या कमजोर प्रभाव भऽ सकैत अछि।', mr: 'अग्नी पाताळात उतरला आहे. अग्नी अनुष्ठानांचे उलटे किंवा कमकुवत परिणाम होतात.', ta: 'அக்னி பாதாளத்தில் இறங்குகிறார். அக்னி சடங்குகள் எதிர்மாறான அல்லது பலவீனமான பலன்களைத் தரலாம்.', te: 'అగ్ని పాతాళానికి దిగాడు. అగ్ని కర్మలు విపరీత లేదా బలహీన ఫలితాలు ఇవ్వవచ్చు.', bn: 'অগ্নি পাতালে অবতরণ করেছেন। অগ্নি অনুষ্ঠানের বিপরীত বা দুর্বল ফল হতে পারে।', kn: 'ಅಗ್ನಿ ಪಾತಾಳಕ್ಕೆ ಇಳಿದಿದ್ದಾನೆ. ಅಗ್ನಿ ಆಚರಣೆಗಳ ವಿಪರೀತ ಅಥವಾ ದುರ್ಬಲ ಫಲ ಬರಬಹುದು.', gu: 'અગ્નિ પાતાળમાં ઊતર્યા છે. અગ્નિ અનુષ્ઠાનના વિપરીત કે નબળા પરિણામ આવી શકે છે.' },
                    ritualNote: { en: 'Major Yajnas should be postponed. Simple Deepa worship permitted.', hi: 'बड़े यज्ञ स्थगित करें। साधारण दीप पूजा कर सकते हैं।', sa: 'बृहत्यज्ञाः स्थगयितव्याः। सरलं दीपार्चनम् अनुमतम्।', mai: 'पैग यज्ञ स्थगित करू। साधारण दीप पूजा कऽ सकैत छी।', mr: 'मोठे यज्ञ स्थगित करा. साध्या दीप पूजेला परवानगी.', ta: 'பெரிய யக்ஞங்களை ஒத்திவையுங்கள். எளிய தீப வழிபாடு அனுமதிக்கப்படுகிறது.', te: 'పెద్ద యజ్ఞాలు వాయిదా వేయండి. సాధారణ దీప పూజ అనుమతించబడుతుంది.', bn: 'বড় যজ্ঞ স্থগিত করুন। সাধারণ দীপ পূজা অনুমোদিত।', kn: 'ದೊಡ್ಡ ಯಜ್ಞಗಳನ್ನು ಮುಂದೂಡಿ. ಸರಳ ದೀಪ ಪೂಜೆ ಅನುಮತಿಸಲಾಗಿದೆ.', gu: 'મોટા યજ્ઞ મુલતવી રાખો. સાદી દીપ પૂજાની મંજૂરી છે.' },
                  },
                  'Water (Jal)': {
                    nColor: 'text-blue-300', border: 'border-blue-500/25', bg: 'from-blue-500/5',
                    desc: { en: 'Agni is submerged in water — the Vadavagni (submarine fire of Hindu cosmology).', hi: 'अग्नि जल में हैं — वडवाग्नि (हिंदू ब्रह्माण्ड की समुद्री अग्नि)।', sa: 'अग्निः जले निमग्नः — वडवाग्निः (हिन्दूब्रह्माण्डस्य सामुद्रिकाग्निः)।', mai: 'अग्नि जल मे छथि — वडवाग्नि (हिंदू ब्रह्माण्डक समुद्री अग्नि)।', mr: 'अग्नी जलात बुडाला आहे — वडवाग्नी (हिंदू ब्रह्मांडातील सागरी अग्नी).', ta: 'அக்னி நீரில் மூழ்கியுள்ளார் — வடவாக்னி (இந்து அண்டவியலின் கடலடி நெருப்பு).', te: 'అగ్ని నీటిలో మునిగి ఉన్నాడు — వడవాగ్ని (హిందూ విశ్వశాస్త్రంలో సముద్ర అగ్ని).', bn: 'অগ্নি জলে নিমজ্জিত — বড়বাগ্নি (হিন্দু সৃষ্টিতত্ত্বের সমুদ্র অগ্নি)।', kn: 'ಅಗ್ನಿ ನೀರಿನಲ್ಲಿ ಮುಳುಗಿದ್ದಾನೆ — ವಡವಾಗ್ನಿ (ಹಿಂದೂ ವಿಶ್ವಶಾಸ್ತ್ರದ ಸಮುದ್ರ ಅಗ್ನಿ).', gu: 'અગ્નિ જળમાં ડૂબેલા છે — વડવાગ્નિ (હિંદુ બ્રહ્માંડવિદ્યાની સમુદ્રી અગ્નિ).' },
                    ritualNote: { en: 'Rituals combining fire + water (abhishek after homa) uniquely powerful', hi: 'अग्नि + जल संयुक्त अनुष्ठान (होम बाद अभिषेक) विशेष शक्तिशाली', sa: 'अग्निजलसंयुक्तानि कार्याणि (होमानन्तरम् अभिषेकः) विशेषं शक्तिमन्ति', mai: 'अग्नि + जल संयुक्त अनुष्ठान (होमक बाद अभिषेक) विशेष शक्तिशाली', mr: 'अग्नी + जल एकत्रित अनुष्ठान (होमानंतर अभिषेक) विशेष शक्तिशाली', ta: 'நெருப்பு + நீர் இணைந்த சடங்குகள் (ஹோமத்திற்குப் பின் அபிஷேகம்) தனித்துவமாக சக்தி வாய்ந்தது', te: 'అగ్ని + నీటి సంయుక్త కర్మలు (హోమం తర్వాత అభిషేకం) విశేష శక్తివంతం', bn: 'অগ্নি + জল সংযুক্ত অনুষ্ঠান (হোমের পর অভিষেক) বিশেষ শক্তিশালী', kn: 'ಅಗ್ನಿ + ನೀರು ಸಂಯುಕ್ತ ಆಚರಣೆ (ಹೋಮದ ನಂತರ ಅಭಿಷೇಕ) ವಿಶಿಷ್ಟ ಶಕ್ತಿಯುತ', gu: 'અગ્નિ + જળ સંયુક્ત અનુષ્ઠાન (હોમ પછી અભિષેક) વિશેષ શક્તિશાળી' },
                  },
                };
                const d = agniDesc[agniName] || agniDesc['Sky (Akasha)'];
                const natureLabel = { auspicious: 'Auspicious', inauspicious: 'Inauspicious', neutral: 'Neutral', mixed: 'Mixed' }[nature] || 'Neutral';
                const natureLabelHi = { auspicious: 'शुभ', inauspicious: 'अशुभ', neutral: 'तटस्थ', mixed: 'मिश्रित' }[nature] || 'तटस्थ';
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                    className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border ${d.border} bg-gradient-to-br ${d.bg} to-transparent`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-red-400 text-xs uppercase tracking-widest font-bold">
                        {msg('agniVaas', locale)}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.nColor} bg-black/20 border ${d.border}`}>{_tl({en: natureLabel, hi: natureLabelHi} as LocaleText, locale)}</span>
                    </div>
                    <div className="text-gold-light font-bold text-xl mb-1" style={headingFont}>{panchang.agniVaas.name?.[locale] || agniName}</div>
                    {validUntil && (
                      <div className={`text-xs font-medium ${d.nColor} mb-2`}>
                        {_tl({ en: `Until ${validUntil}`, hi: `${validUntil} तक`, sa: `${validUntil} तक`, ta: `Until ${validUntil}`, te: `Until ${validUntil}`, bn: `Until ${validUntil}`, kn: `Until ${validUntil}`, gu: `Until ${validUntil}`, mai: `${validUntil} तक`, mr: `${validUntil} तक` }, locale)}
                      </div>
                    )}
                    <div className="text-text-secondary text-xs leading-relaxed mb-3">{_tl(d.desc, locale)}</div>
                    <div className={`p-2.5 rounded-lg bg-black/20 border ${d.border}`}>
                      <div className="text-text-tertiary text-xs uppercase tracking-wider mb-0.5">{msg('fireRitualImpact', locale)}</div>
                      <div className={`text-xs font-medium ${d.nColor}`}>{_tl(d.ritualNote, locale)}</div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Chandra Vaas */}
              {panchang.chandraVaas && (() => {
                const chandraName = panchang.chandraVaas.name?.en || (panchang.chandraVaas as unknown as { en: string }).en || '';
                const direction = panchang.chandraVaas.direction;
                const nature = panchang.chandraVaas.nature || 'neutral';
                const chandraDesc: Record<string, { nColor: string; border: string; bg: string; desc: LocaleText; activities: LocaleText }> = {
                  "Brahma's Abode": {
                    nColor: 'text-gold-light', border: 'border-gold-primary/25', bg: 'from-gold-primary/5',
                    desc: { en: 'Moon faces East in Deva (celestial) abode. Divine energy flows freely — prayers answered with ease. Most auspicious pada for sacred activities.', hi: 'चंद्रमा पूर्व दिशा में देव निवास में हैं। दिव्य ऊर्जा स्वतंत्र प्रवाहित। प्रार्थनाएं सुनी जाती हैं — सर्वोत्तम शुभ पाद।', sa: 'चन्द्रः पूर्वदिशि देवनिवासे वर्तते। दिव्यशक्तिः स्वतन्त्रं प्रवहति — प्रार्थनाः सुखेन श्रूयन्ते। पवित्रकार्येभ्यः सर्वोत्तमं शुभपदम्।', mai: 'चंद्रमा पूर्व दिशा मे देव निवास मे छथि। दिव्य ऊर्जा स्वतंत्र प्रवाहित। प्रार्थना सुनल जाइत अछि — सर्वोत्तम शुभ पाद।', mr: 'चंद्र पूर्व दिशेला देव निवासात आहे. दिव्य ऊर्जा मुक्तपणे वाहते — प्रार्थना सहज ऐकल्या जातात. पवित्र कार्यांसाठी सर्वोत्तम शुभ पद.', ta: 'சந்திரன் கிழக்கு நோக்கி தேவ (தெய்வீக) வசிப்பிடத்தில் உள்ளார். தெய்வீக ஆற்றல் சுதந்திரமாகப் பாய்கிறது — பிரார்த்தனைகள் எளிதில் ஏற்கப்படுகின்றன. புனித செயல்களுக்கு மிகவும் சுப பாதம்.', te: 'చంద్రుడు తూర్పు దిశలో దేవ (దివ్య) నివాసంలో ఉన్నాడు. దివ్యశక్తి స్వేచ్ఛగా ప్రవహిస్తుంది — ప్రార్థనలు సులభంగా వినబడతాయి. పవిత్ర కార్యాలకు అత్యంత శుభ పదం.', bn: 'চন্দ্র পূর্ব দিকে দেব (স্বর্গীয়) আবাসে রয়েছেন। দিব্যশক্তি স্বাধীনভাবে প্রবাহিত — প্রার্থনা সহজে শোনা হয়। পবিত্র কর্মের জন্য সর্বোত্তম শুভ পদ।', kn: 'ಚಂದ್ರ ಪೂರ್ವ ದಿಕ್ಕಿನಲ್ಲಿ ದೇವ (ದಿವ್ಯ) ನಿವಾಸದಲ್ಲಿದ್ದಾನೆ. ದಿವ್ಯಶಕ್ತಿ ಮುಕ್ತವಾಗಿ ಹರಿಯುತ್ತದೆ — ಪ್ರಾರ್ಥನೆಗಳು ಸುಲಭವಾಗಿ ಕೇಳಿಸುತ್ತವೆ. ಪವಿತ್ರ ಕಾರ್ಯಗಳಿಗೆ ಅತ್ಯಂತ ಶುಭ ಪಾದ.', gu: 'ચંદ્ર પૂર્વ દિશામાં દેવ (દિવ્ય) નિવાસમાં છે. દિવ્ય ઊર્જા મુક્તપણે વહે છે — પ્રાર્થનાઓ સહેલાઈથી સાંભળાય છે. પવિત્ર કાર્યો માટે સર્વોત્તમ શુભ પદ.' },
                    activities: { en: 'All auspicious work, puja, sacred ceremonies', hi: 'सभी शुभ कार्य, पूजा, पवित्र समारोह', sa: 'सर्वाणि शुभकार्याणि, पूजा, पवित्रसमारोहाः', mai: 'सब शुभ कार्य, पूजा, पवित्र समारोह', mr: 'सर्व शुभ कार्य, पूजा, पवित्र समारंभ', ta: 'அனைத்து சுப பணிகள், பூஜை, புனித விழாக்கள்', te: 'అన్ని శుభ కార్యాలు, పూజ, పవిత్ర వేడుకలు', bn: 'সমস্ত শুভ কর্ম, পূজা, পবিত্র অনুষ্ঠান', kn: 'ಎಲ್ಲಾ ಶುಭ ಕಾರ್ಯ, ಪೂಜೆ, ಪವಿತ್ರ ಸಮಾರಂಭ', gu: 'બધા શુભ કાર્ય, પૂજા, પવિત્ર સમારોહ' },
                  },
                  "Indra's Abode": {
                    nColor: 'text-blue-300', border: 'border-blue-500/25', bg: 'from-blue-500/5',
                    desc: { en: 'Moon faces South in Nara (human) abode — ordinary activity plane. Results are as expected, neither elevated nor hindered.', hi: 'चंद्रमा दक्षिण दिशा में मानव निवास में हैं। परिणाम सामान्य — न उन्नत, न बाधित।', sa: 'चन्द्रः दक्षिणदिशि नर (मानव) निवासे वर्तते — सामान्यकर्मभूमिः। फलानि यथापेक्षितम् — न उन्नतानि न बाधितानि।', mai: 'चंद्रमा दक्षिण दिशा मे मानव निवास मे छथि। परिणाम सामान्य — न उन्नत, न बाधित।', mr: 'चंद्र दक्षिण दिशेला नर (मानव) निवासात आहे — सामान्य कर्मभूमी. परिणाम अपेक्षेप्रमाणे — उन्नतही नाही, बाधितही नाही.', ta: 'சந்திரன் தெற்கு நோக்கி நர (மனித) வசிப்பிடத்தில் — சாதாரண செயல்பாட்டுத் தளம். பலன்கள் எதிர்பார்த்தபடி — உயர்வும் இல்லை, தடையும் இல்லை.', te: 'చంద్రుడు దక్షిణ దిశలో నర (మానవ) నివాసంలో — సాధారణ కార్యక్షేత్రం. ఫలితాలు ఆశించినట్లు — ఉన్నతమూ కాదు, అడ్డంకీ కాదు.', bn: 'চন্দ্র দক্ষিণ দিকে নর (মানব) আবাসে — সাধারণ কর্মক্ষেত্র। ফলাফল প্রত্যাশিত — উন্নতও নয়, বাধাগ্রস্তও নয়।', kn: 'ಚಂದ್ರ ದಕ್ಷಿಣ ದಿಕ್ಕಿನಲ್ಲಿ ನರ (ಮಾನವ) ನಿವಾಸದಲ್ಲಿ — ಸಾಮಾನ್ಯ ಕರ್ಮಭೂಮಿ. ಫಲಿತಾಂಶ ನಿರೀಕ್ಷಿತ — ಉನ್ನತವೂ ಅಲ್ಲ, ಅಡಚಣೆಯೂ ಅಲ್ಲ.', gu: 'ચંદ્ર દક્ષિણ દિશામાં નર (માનવ) નિવાસમાં — સામાન્ય કર્મભૂમિ. પરિણામ અપેક્ષા મુજબ — ઉન્નત પણ નહીં, બાધિત પણ નહીં.' },
                    activities: { en: 'Daily work, business, social activities', hi: 'दैनिक कार्य, व्यापार, सामाजिक गतिविधियाँ', sa: 'दैनिककार्याणि, वाणिज्यम्, सामाजिकक्रियाः', mai: 'दैनिक कार्य, व्यापार, सामाजिक गतिविधि', mr: 'दैनिक कार्य, व्यापार, सामाजिक उपक्रम', ta: 'தினசரி பணி, வணிகம், சமூக நடவடிக்கைகள்', te: 'దైనందిన పని, వ్యాపారం, సామాజిక కార్యకలాపాలు', bn: 'দৈনিক কাজ, ব্যবসা, সামাজিক কার্যকলাপ', kn: 'ದೈನಂದಿನ ಕೆಲಸ, ವ್ಯಾಪಾರ, ಸಾಮಾಜಿಕ ಚಟುವಟಿಕೆಗಳು', gu: 'દૈનિક કાર્ય, વ્યાપાર, સામાજિક પ્રવૃત્તિઓ' },
                  },
                  "Yama's Abode": {
                    nColor: 'text-amber-400', border: 'border-amber-500/25', bg: 'from-amber-500/5',
                    desc: { en: 'Moon faces West in Pashava (animal) abode — instinctual, reactive energy. Actions driven by impulse. Avoid important decisions.', hi: 'चंद्रमा पश्चिम दिशा में पशव निवास में हैं — सहज, प्रतिक्रियाशील ऊर्जा। महत्वपूर्ण निर्णयों से बचें।', sa: 'चन्द्रः पश्चिमदिशि पशव (पशु) निवासे — सहजा प्रतिक्रियाशीला च शक्तिः। आवेगप्रेरिताः क्रियाः। महत्त्वपूर्णनिर्णयान् वर्जयत।', mai: 'चंद्रमा पश्चिम दिशा मे पशव निवास मे छथि — सहज, प्रतिक्रियाशील ऊर्जा। महत्वपूर्ण निर्णय सँ बचू।', mr: 'चंद्र पश्चिम दिशेला पशव (प्राणी) निवासात — सहज, प्रतिक्रियाशील ऊर्जा. आवेगाने चालवलेल्या क्रिया. महत्त्वाचे निर्णय टाळा.', ta: 'சந்திரன் மேற்கு நோக்கி பசவ (விலங்கு) வசிப்பிடத்தில் — உள்ளுணர்வு, எதிர்வினை ஆற்றல். தூண்டுதலால் இயக்கப்படும் செயல்கள். முக்கிய முடிவுகளைத் தவிர்க்கவும்.', te: 'చంద్రుడు పశ్చిమ దిశలో పశవ (జంతు) నివాసంలో — సహజ, ప్రతిస్పందన శక్తి. ఆవేశంతో నడిచే చర్యలు. ముఖ్యమైన నిర్ణయాలు మానండి.', bn: 'চন্দ্র পশ্চিম দিকে পশব (পশু) আবাসে — সহজাত, প্রতিক্রিয়াশীল শক্তি। আবেগ দ্বারা চালিত কর্ম। গুরুত্বপূর্ণ সিদ্ধান্ত এড়িয়ে চলুন।', kn: 'ಚಂದ್ರ ಪಶ್ಚಿಮ ದಿಕ್ಕಿನಲ್ಲಿ ಪಶವ (ಪ್ರಾಣಿ) ನಿವಾಸದಲ್ಲಿ — ಸಹಜ, ಪ್ರತಿಕ್ರಿಯಾಶೀಲ ಶಕ್ತಿ. ಆವೇಗದಿಂದ ನಡೆಸುವ ಕ್ರಿಯೆಗಳು. ಮಹತ್ವದ ನಿರ್ಧಾರಗಳನ್ನು ತಪ್ಪಿಸಿ.', gu: 'ચંદ્ર પશ્ચિમ દિશામાં પશવ (પ્રાણી) નિવાસમાં — સહજ, પ્રતિક્રિયાશીલ ઊર્જા. આવેગથી ચાલતી ક્રિયાઓ. મહત્વપૂર્ણ નિર્ણયો ટાળો.' },
                    activities: { en: 'Physical labor, farming; avoid important decisions', hi: 'शारीरिक श्रम, खेती; महत्वपूर्ण निर्णयों से बचें', sa: 'शारीरिकश्रमः, कृषिः; महत्त्वपूर्णनिर्णयान् वर्जयत', mai: 'शारीरिक श्रम, खेती; महत्वपूर्ण निर्णय सँ बचू', mr: 'शारीरिक श्रम, शेती; महत्त्वाचे निर्णय टाळा', ta: 'உடல் உழைப்பு, விவசாயம்; முக்கிய முடிவுகளைத் தவிர்க்கவும்', te: 'శారీరక శ్రమ, వ్యవసాయం; ముఖ్యమైన నిర్ణయాలు మానండి', bn: 'শারীরিক শ্রম, কৃষি; গুরুত্বপূর্ণ সিদ্ধান্ত এড়িয়ে চলুন', kn: 'ದೈಹಿಕ ಶ್ರಮ, ಕೃಷಿ; ಮಹತ್ವದ ನಿರ್ಧಾರಗಳನ್ನು ತಪ್ಪಿಸಿ', gu: 'શારીરિક શ્રમ, ખેતી; મહત્વપૂર્ણ નિર્ણયો ટાળો' },
                  },
                  "Soma's Abode": {
                    nColor: 'text-red-400', border: 'border-red-500/25', bg: 'from-red-500/5',
                    desc: { en: 'Moon faces North in Rakshasa (demonic) abode — turbulent, obstructive energy. Activities face opposition or hidden obstacles.', hi: 'चंद्रमा उत्तर दिशा में राक्षस निवास में हैं — अशांत, अवरोधक ऊर्जा। विरोध या छिपी बाधाएं।', sa: 'चन्द्रः उत्तरदिशि राक्षसनिवासे — अशान्ता अवरोधकी च शक्तिः। कार्याणि विरोधम् अथवा गुप्तबाधाः अनुभवन्ति।', mai: 'चंद्रमा उत्तर दिशा मे राक्षस निवास मे छथि — अशांत, अवरोधक ऊर्जा। विरोध या छिपल बाधा।', mr: 'चंद्र उत्तर दिशेला राक्षस निवासात — अशांत, अवरोधक ऊर्जा. कार्यांना विरोध किंवा छुप्या अडथळ्यांचा सामना.', ta: 'சந்திரன் வடக்கு நோக்கி ராக்ஷச (அரக்க) வசிப்பிடத்தில் — கொந்தளிப்பான, தடையான ஆற்றல். செயல்களுக்கு எதிர்ப்பு அல்லது மறைந்த தடைகள்.', te: 'చంద్రుడు ఉత్తర దిశలో రాక్షస నివాసంలో — అశాంత, అవరోధక శక్తి. కార్యకలాపాలకు వ్యతిరేకత లేదా దాగి ఉన్న అడ్డంకులు.', bn: 'চন্দ্র উত্তর দিকে রাক্ষস আবাসে — অশান্ত, প্রতিরোধী শক্তি। কর্মকাণ্ডে বিরোধিতা বা লুকানো বাধা।', kn: 'ಚಂದ್ರ ಉತ್ತರ ದಿಕ್ಕಿನಲ್ಲಿ ರಾಕ್ಷಸ ನಿವಾಸದಲ್ಲಿ — ಅಶಾಂತ, ಅಡಚಣೆಯ ಶಕ್ತಿ. ಚಟುವಟಿಕೆಗಳಿಗೆ ವಿರೋಧ ಅಥವಾ ಗುಪ್ತ ಅಡಚಣೆಗಳು.', gu: 'ચંદ્ર ઉત્તર દિશામાં રાક્ષસ નિવાસમાં — અશાંત, અવરોધક ઊર્જા. કાર્યોમાં વિરોધ કે છુપા અવરોધ.' },
                    activities: { en: 'Avoid sacred activities; protective rites permitted', hi: 'पवित्र गतिविधियों से बचें; सुरक्षात्मक अनुष्ठान संभव', sa: 'पवित्रकार्याणि वर्जयत; रक्षात्मकाः विधयः अनुमताः', mai: 'पवित्र गतिविधि सँ बचू; सुरक्षात्मक अनुष्ठान संभव', mr: 'पवित्र कार्ये टाळा; संरक्षक विधी अनुज्ञेय', ta: 'புனித செயல்களைத் தவிர்க்கவும்; பாதுகாப்பு சடங்குகள் அனுமதிக்கப்படும்', te: 'పవిత్ర కార్యాలను మానండి; రక్షణ కర్మలు అనుమతించబడతాయి', bn: 'পবিত্র কর্ম এড়িয়ে চলুন; সুরক্ষামূলক অনুষ্ঠান অনুমোদিত', kn: 'ಪವಿತ್ರ ಕಾರ್ಯಗಳನ್ನು ತಪ್ಪಿಸಿ; ರಕ್ಷಣಾತ್ಮಕ ವಿಧಿಗಳಿಗೆ ಅನುಮತಿ', gu: 'પવિત્ર કાર્ય ટાળો; રક્ષાત્મક વિધિ અનુમત' },
                  },
                };
                const d = chandraDesc[chandraName] || chandraDesc["Brahma's Abode"];
                const natureLabel = { auspicious: 'Auspicious', inauspicious: 'Inauspicious', neutral: 'Neutral', mixed: 'Mixed' }[nature] || 'Neutral';
                const natureLabelHi = { auspicious: 'शुभ', inauspicious: 'अशुभ', neutral: 'तटस्थ', mixed: 'मिश्रित' }[nature] || 'तटस्थ';
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
                    className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border ${d.border} bg-gradient-to-br ${d.bg} to-transparent`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-blue-400 text-xs uppercase tracking-widest font-bold">
                        {msg('chandraVaas', locale)}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.nColor} bg-black/20 border ${d.border}`}>{_tl({en: natureLabel, hi: natureLabelHi} as LocaleText, locale)}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-gold-light font-bold text-xl" style={headingFont}>{panchang.chandraVaas.name?.[locale] || chandraName}</div>
                      {direction && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/20 border border-blue-500/20">
                          <Compass className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-300 text-xs font-bold">{(direction[locale] || direction.en || '')}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-text-secondary text-xs leading-relaxed mb-3">{_tl(d.desc, locale)}</div>
                    <div className={`p-2.5 rounded-lg bg-black/20 border ${d.border}`}>
                      <div className="text-text-tertiary text-xs uppercase tracking-wider mb-0.5">{msg('activities', locale)}</div>
                      <div className={`text-xs font-medium ${d.nColor}`}>{_tl(d.activities, locale)}</div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Rahu Vaas */}
              {panchang.rahuVaas && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border border-purple-500/25 bg-gradient-to-br from-purple-500/5 to-transparent">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-purple-400 text-xs uppercase tracking-widest font-bold">
                      {msg('rahuVaas', locale)}
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full text-red-400 bg-black/20 border border-red-500/25">{msg('avoid', locale)}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Compass className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-gold-light font-bold text-xl" style={headingFont}>{tl(panchang.rahuVaas.direction)}</div>
                      <div className="text-text-tertiary text-xs">{msg('rahuFacing', locale)}</div>
                    </div>
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed mb-3">
                    {msg('rahuVaasDesc', locale)}
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/20 border border-purple-500/20">
                    <div className="text-text-tertiary text-xs uppercase tracking-wider mb-0.5">{msg('rahuGuidance', locale)}</div>
                    <div className="text-xs font-medium text-purple-300">
                      {msg('rahuGuidanceDesc', locale)}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <GoldDivider />

          {/* ═══════════════════════════════════════════════════
              SECTION 5: CALENDARS & EPOCH
          ═══════════════════════════════════════════════════ */}
          <div className="my-14">
            <SectionHeading
              icon={<Calendar className="w-14 h-14 text-gold-primary" />}
              title={msg('calendarsEpoch', locale)}
              subtitle={msg('calendarsEpochDesc', locale)}
            />

            {/* Hindu Calendar subsection */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
                <MasaIcon size={28} />
                <span>{msg('hinduCalendar', locale)}</span>
              </h3>
              <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-gold-primary/10">
                  {([
                    { label: msg('vikramSamvat', locale), value: panchang.vikramSamvat?.toString() || '—', iconKey: null },
                    { label: msg('shakaSamvat', locale), value: panchang.shakaSamvat?.toString() || '—', iconKey: null },
                    { label: t('samvatsara'), value: panchang.samvatsara[locale], iconKey: 'samvatsara' as const },
                    { label: `${msg('masa', locale)} (${masaSystem === 'purnimant' ? msg('purnimant', locale) : msg('amant', locale)})`, value: masaSystem === 'purnimant' ? (panchang.purnimantMasa || panchang.masa)[locale] : (panchang.amantMasa || panchang.masa)[locale], iconKey: 'masa' as const },
                    { label: msg('paksha', locale), value: panchang.tithi.paksha === 'shukla' ? msg('shuklaPaksha', locale) : msg('krishnaPaksha', locale), iconKey: null },
                    { label: t('ritu'), value: panchang.ritu[locale], iconKey: 'ritu' as const },
                    { label: t('ayana'), value: panchang.ayana[locale], iconKey: 'ayana' as const },
                    { label: msg('ayanamsha', locale), value: panchang.ayanamsha ? `${panchang.ayanamsha.toFixed(4)}°` : '—', iconKey: null },
                    { label: msg('dayDuration', locale), value: panchang.dinamana || '—', iconKey: null },
                    { label: msg('nightDuration', locale), value: panchang.ratrimana || '—', iconKey: null },
                    { label: msg('madhyahna', locale), value: panchang.madhyahna || '—', iconKey: null },
                  ] as { label: string; value: string; iconKey: 'masa' | 'samvatsara' | 'ritu' | 'ayana' | null }[]).map((item, i) => {
                    const IconMap = { masa: MasaIcon, samvatsara: SamvatsaraIcon, ritu: RituIcon, ayana: AyanaIcon };
                    const IconComp = item.iconKey ? IconMap[item.iconKey] : null;
                    return (
                      <motion.div key={item.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.04 }}
                        className="p-4 sm:p-5 text-center flex flex-col items-center justify-center">
                        {IconComp && <div className="mb-1.5"><IconComp size={28} /></div>}
                        <div className="text-gold-dark text-[10px] sm:text-xs uppercase tracking-wider font-bold">{item.label}</div>
                        <div className="text-gold-light font-bold text-sm sm:text-base mt-0.5" style={headingFont}>{item.value}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Hindu Months Reference — computed for current year */}
            {(() => {
              const displayYear = new Date().getFullYear();
              const hinduMonths = computeHinduMonthsMemo;
              const currentMasa = _tl(panchang.purnimantMasa || panchang.masa, locale);
              const todayStr = panchang.date;

              return (
                <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gold-light font-bold text-sm flex items-center gap-2" style={headingFont}>
                      <MasaIcon size={22} />
                      {`${msg('hinduMonth', locale)} ${displayYear}`}
                    </h4>
                    {/* Amant / Purnimant toggle */}
                    <div className="inline-flex rounded-lg border border-gold-primary/15 overflow-hidden text-xs">
                      <button
                        onClick={() => { setMasaSystem('amant'); try { localStorage.setItem('panchang_masa_system', 'amant'); } catch {} }}
                        className={`px-3 py-2 sm:py-1.5 font-medium transition-all ${masaSystem === 'amant' ? 'bg-gold-primary/20 text-gold-light' : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5'}`}
                      >
                        {msg('amant', locale)}
                      </button>
                      <button
                        onClick={() => { setMasaSystem('purnimant'); try { localStorage.setItem('panchang_masa_system', 'purnimant'); } catch {} }}
                        className={`px-3 py-2 sm:py-1.5 font-medium transition-all border-l border-gold-primary/15 ${masaSystem === 'purnimant' ? 'bg-gold-primary/20 text-gold-light' : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5'}`}
                      >
                        {msg('purnimant', locale)}
                      </button>
                    </div>
                  </div>
                  <p className="text-text-secondary text-xs mb-3">
                    {masaSystem === 'amant'
                      ? (locale === 'en'
                        ? `Amant system: Each month begins on Amavasya (New Moon) and ends on the next Amavasya. Used in South & West India.`
                        : `अमान्त पद्धति: प्रत्येक मास अमावस्या पर आरम्भ, अगली अमावस्या पर समाप्त। दक्षिण व पश्चिम भारत में प्रचलित।`)
                      : (locale === 'en'
                        ? `Purnimant system: Each month begins on Purnima (Full Moon) and ends on the next Purnima. Used in North & East India.`
                        : `पूर्णिमान्त पद्धति: प्रत्येक मास पूर्णिमा पर आरम्भ, अगली पूर्णिमा पर समाप्त। उत्तर व पूर्व भारत में प्रचलित।`)}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gold-primary/15">
                          <th className="text-left py-2 px-2 text-gold-dark">#</th>
                          <th className="text-left py-2 px-2 text-gold-dark">{msg('hinduMonth', locale)}</th>
                          <th className="text-left py-2 px-2 text-gold-dark">{msg('sanskrit', locale)}</th>
                          <th className="text-left py-2 px-2 text-gold-dark">{msg('start', locale)}</th>
                          <th className="text-left py-2 px-2 text-gold-dark">{msg('end', locale)}</th>
                          <th className="text-left py-2 px-2 text-gold-dark">{msg('ritu', locale)}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold-primary/5">
                        {hinduMonths.map((m) => {
                          // Compute effective dates based on selected masa system
                          let effectiveStart = m.startDate;
                          let effectiveEnd = m.endDate;
                          if (masaSystem === 'purnimant') {
                            const shiftDate = (ds: string, days: number) => {
                              const [y2, mo2, d2] = ds.split('-').map(Number);
                              const dt = new Date(y2, mo2 - 1, d2);
                              dt.setDate(dt.getDate() + days);
                              return `${dt.getFullYear()}-${(dt.getMonth()+1).toString().padStart(2,'0')}-${dt.getDate().toString().padStart(2,'0')}`;
                            };
                            effectiveStart = shiftDate(m.startDate, -15);
                            effectiveEnd = shiftDate(m.endDate, -15);
                          }
                          const isHighlighted = todayStr >= effectiveStart && todayStr < effectiveEnd;
                          return (
                            <tr key={`${m.n}-${m.startDate}`} className={`hover:bg-gold-primary/3 ${isHighlighted ? 'bg-gold-primary/8' : ''} ${m.isAdhika ? 'italic' : ''}`}>
                              <td className="py-1.5 px-2 text-text-tertiary">{m.n}</td>
                              <td className="py-1.5 px-2 font-medium" style={headingFont}>
                                <span className={`${m.isAdhika ? 'text-violet-400' : 'text-gold-light'}`}>{isDevanagariLocale(locale) ? m.hi : m.en}</span>
                                {isHighlighted && <span className="ml-1.5 text-xs px-1 py-0.5 rounded bg-gold-primary/20 text-gold-primary not-italic">{msg('now', locale)}</span>}
                                {m.isAdhika && <span className="ml-1.5 text-xs px-1 py-0.5 rounded bg-violet-500/20 text-violet-300 not-italic">{msg('intercalary', locale)}</span>}
                              </td>
                              <td className="py-1.5 px-2 text-text-tertiary" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{m.sa}</td>
                              <td className="py-1.5 px-2 text-text-secondary font-mono">{formatMonthDate(effectiveStart, locale)}</td>
                              <td className="py-1.5 px-2 text-text-secondary font-mono">{formatMonthDate(effectiveEnd, locale)}</td>
                              <td className="py-1.5 px-2 text-text-secondary">{isDevanagariLocale(locale) ? m.ritu.hi : m.ritu.en}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-text-tertiary text-xs mt-2">
                    {masaSystem === 'amant'
                      ? (locale === 'en'
                        ? `Amant dates computed from actual New Moon positions for ${displayYear}. Each month starts on Amavasya. Adhika Masa (intercalary, purple) occurs when two New Moons fall in the same solar month.`
                        : `${displayYear} के अमावस्या स्थितियों से अमान्त तिथियाँ। प्रत्येक मास अमावस्या पर आरम्भ। अधिक मास (बैंगनी) एक ही सौर मास में दो अमावस्याओं पर।`)
                      : (locale === 'en'
                        ? `Purnimant dates computed from Full Moon positions for ${displayYear}. Each month starts on Purnima. This system is predominant in North India (UP, Bihar, MP, Rajasthan).`
                        : `${displayYear} के पूर्णिमा स्थितियों ��े पूर्णिमान्त तिथियाँ। प्रत्येक मास पूर्णिमा पर आरम्भ। उत्तर भारत (उ.प्र., बिहार, म.प्र., राजस्थान) में प्रचलित।`)}
                  </p>
                </div>
              );
            })()}

            {/* Epoch & Cosmic Time subsection */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
                <Star className="w-6 h-6 text-gold-primary" />
                <span>{msg('epochCosmicTime', locale)}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Kali Ahargana — big number */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
                  <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-1">
                    {msg('kaliAhargana', locale)}
                  </div>
                  <div className="text-gold-light font-bold text-3xl font-mono mt-1">
                    {panchang.kaliAhargana?.toLocaleString() || '—'}
                  </div>
                  <div className="text-text-secondary text-xs mt-2">
                    {msg('kaliAharganaDesc', locale)}
                  </div>
                </motion.div>

                {/* Kaliyuga Year */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
                  <div className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-1">
                    {msg('kaliyugaYear', locale)}
                  </div>
                  <div className="text-amber-300 font-bold text-3xl font-mono mt-1">
                    {panchang.kaliyugaYear?.toLocaleString() || '—'}
                  </div>
                  <div className="text-text-secondary text-xs mt-2">
                    {msg('kaliyugaYearDesc', locale)}
                  </div>
                </motion.div>

                {/* Julian Day */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6">
                  <div className="text-indigo-400 text-xs uppercase tracking-widest font-bold mb-1">
                    {msg('julianDayNumber', locale)}
                  </div>
                  <div className="text-indigo-300 font-bold text-3xl font-mono mt-1">
                    {panchang.julianDay?.toLocaleString() || '—'}
                  </div>
                  <div className="text-text-secondary text-xs mt-2">
                    {msg('julianDayDesc', locale)}
                  </div>
                </motion.div>
              </div>

              {/* Current Yuga info card */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                className="mt-5 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 bg-gradient-to-r from-gold-primary/5 via-indigo-500/3 to-gold-primary/5">
                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6">
                  <div className="flex-1">
                    <div className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
                      {msg('currentYugaKali', locale)}
                    </div>
                    <div className="text-text-secondary text-sm leading-relaxed">
                      {locale === 'en'
                        ? 'We are in the 4th and final Yuga of the current Mahayuga cycle. Kali Yuga began 3102 BCE (Feb 18) and spans 432,000 years. We are approximately 5,126 years in — only 1.2% complete.'
                        : 'हम वर्तमान महायुग चक्र के चौथे और अंतिम युग में हैं। कलियुग 3102 ईसापूर्व (18 फरवरी) से प्रारम्भ हुआ और 4,32,000 वर्ष तक चलेगा। लगभग 5,126 वर्ष बीत चुके हैं — केवल 1.2% पूर्ण।'}
                    </div>
                  </div>
                  <div className="flex-1">
                    {/* Yuga progress bar */}
                    <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-3">
                      {msg('kaliYugaProgress', locale)}
                    </div>
                    <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden border border-gold-primary/10 mb-2">
                      <div className="h-full bg-gradient-to-r from-gold-primary/60 to-amber-400/60 rounded-full"
                        style={{ width: `${(5126 / 432000) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-text-secondary font-mono">
                      <span>{msg('kaliYugaStartDate', locale)}</span>
                      <span className="text-gold-primary">~1.2%</span>
                      <span>{msg('kaliYugaRemainder', locale)}</span>
                    </div>
                  </div>
                </div>

                {/* Yuga timeline row */}
                <div className="mt-5 pt-5 border-t border-gold-primary/10">
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-3">
                    {msg('mahayugaTimeline', locale)}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {[
                      { name: msg('satyaYuga', locale), years: '1,728,000y', pct: 40, color: 'bg-emerald-500/40 border-emerald-500/30 text-emerald-300' },
                      { name: msg('tretaYuga', locale), years: '1,296,000y', pct: 30, color: 'bg-gold-primary/30 border-gold-primary/40 text-gold-light' },
                      { name: msg('dvaparaYuga', locale), years: '864,000y', pct: 20, color: 'bg-blue-500/30 border-blue-500/30 text-blue-300' },
                      { name: msg('kaliYugaName', locale), years: '432,000y', pct: 10, color: 'bg-red-500/30 border-red-500/40 text-red-300 ring-1 ring-red-400/50' },
                    ].map((y) => (
                      <div key={y.name} className={`rounded-lg px-3 py-2 border text-center flex-1 min-w-0 sm:min-w-[120px] ${y.color}`}>
                        <div className="font-bold text-xs" style={headingFont}>{y.name}</div>
                        <div className="text-xs opacity-70 font-mono">{y.years}</div>
                        <div className="text-xs opacity-50">{y.pct}% of Mahayuga</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-text-secondary/70 text-xs mt-2 text-center font-mono">
                    {msg('kalpa', locale)}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <GoldDivider />

          {/* ═══ CHOGHADIYA ═══ */}
          <InfoBlock
            id="panchang-choghadiya"
            title={msg('choghadiyaTitle', locale)}
            defaultOpen={false}
          >
            {msg('choghadiyaDesc', locale)}
          </InfoBlock>
          {panchang.choghadiya && panchang.choghadiya.length > 0 && (
            <div className="my-14">
              <h2 className="text-3xl font-bold text-gold-gradient mb-2 text-center" style={headingFont}>
                {t('choghadiya')}
              </h2>
              <p className="text-text-secondary text-sm text-center mb-8">{t('choghadiyaDesc')}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {/* Choghadiya conflict detection + "NOW" indicator */}
                {(() => {
                  const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
                  const nowMin = now.getHours() * 60 + now.getMinutes();
                  const isNow = (s: string, e: string) => { const s0 = toMin(s), e0 = toMin(e); return nowMin >= s0 && nowMin < e0; };
                  const overlaps = (aS: string, aE: string, bS: string, bE: string) => {
                    const a0 = toMin(aS), a1 = toMin(aE), b0 = toMin(bS), b1 = toMin(bE);
                    return a0 < b1 && b0 < a1;
                  };
                  // Collect all inauspicious windows
                  const badWindows: { start: string; end: string; label: string; labelHi: string }[] = [];
                  if (panchang.varjyam) badWindows.push({ ...panchang.varjyam, label: 'Varjyam', labelHi: 'वर्ज्यम्' });
                  if ((panchang as any).varjyamAll?.length > 1) {
                    for (let vi = 1; vi < (panchang as any).varjyamAll.length; vi++) {
                      badWindows.push({ ...(panchang as any).varjyamAll[vi], label: 'Varjyam', labelHi: 'वर्ज्यम्' });
                    }
                  }
                  badWindows.push({ start: panchang.rahuKaal.start, end: panchang.rahuKaal.end, label: 'Rahu Kaal', labelHi: 'राहु काल' });
                  badWindows.push({ start: panchang.yamaganda.start, end: panchang.yamaganda.end, label: 'Yamaganda', labelHi: 'यमगण्ड' });

                  const getConflicts = (slotStart: string, slotEnd: string) => {
                    return badWindows.filter(w => overlaps(slotStart, slotEnd, w.start, w.end));
                  };

                  const renderSlot = (slot: any, i: number, prefix: string, animX: number) => {
                    const conflicts = slot.nature === 'auspicious' ? getConflicts(slot.startTime, slot.endTime) : [];
                    const hasConflict = conflicts.length > 0;
                    const active = isNow(slot.startTime, slot.endTime);
                    return (
                      <motion.div
                        key={`${prefix}-${i}`}
                        initial={{ opacity: 0, x: animX }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`rounded-lg p-3 border ${
                          active ? 'ring-1 ring-gold-primary/50 shadow-[0_0_12px_rgba(212,168,83,0.15)]' : ''
                        } ${
                          hasConflict ? 'bg-amber-500/8 border-amber-500/25' :
                          slot.nature === 'auspicious' ? 'bg-emerald-500/5 border-emerald-500/20' :
                          slot.nature === 'inauspicious' ? 'bg-red-500/5 border-red-500/20' :
                          'bg-amber-500/5 border-amber-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${
                              active ? 'animate-pulse' : ''
                            } ${
                              hasConflict ? 'bg-amber-400' :
                              slot.nature === 'auspicious' ? 'bg-emerald-400' :
                              slot.nature === 'inauspicious' ? 'bg-red-400' : 'bg-amber-400'
                            }`} />
                            <span className="text-gold-light font-bold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                              {(slot.name[locale] || slot.name.en || '')}
                            </span>
                            {active && (
                              <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-gold-primary/20 text-gold-light">
                                {msg('now', locale)}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs text-text-secondary">{slot.startTime} — {slot.endTime}</span>
                        </div>
                        {hasConflict && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-amber-400 text-[10px]">
                            <span>⚠</span>
                            <span>{locale === 'en'
                              ? `Overlaps with ${conflicts.map(c => c.label).join(' & ')} — avoid new ventures`
                              : `${conflicts.map(c => c.labelHi).join(' और ')} से ओवरलैप — नए कार्य टालें`}</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  };

                  return (
                    <>
                      {/* Day Choghadiya */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Sun className="w-5 h-5 text-gold-primary" />
                          <h3 className="text-lg font-bold text-gold-light" style={headingFont}>{t('dayChoghadiya')}</h3>
                        </div>
                        <div className="space-y-2">
                          {panchang.choghadiya.filter(s => s.period === 'day').map((slot, i) => renderSlot(slot, i, 'day', -10))}
                        </div>
                      </div>

                      {/* Night Choghadiya */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Moon className="w-5 h-5 text-indigo-400" />
                          <h3 className="text-lg font-bold text-indigo-300/80" style={headingFont}>{t('nightChoghadiya')}</h3>
                        </div>
                        <div className="space-y-2">
                          {panchang.choghadiya.filter(s => s.period === 'night').map((slot, i) => renderSlot(slot, i, 'night', 10))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          <GoldDivider />

          {/* ═══ HORA (PLANETARY HOURS) ═══ */}
          <InfoBlock
            id="panchang-hora"
            title={msg('horaTitle', locale)}
            defaultOpen={false}
          >
            {msg('horaDesc', locale)}
          </InfoBlock>
          {panchang.hora && panchang.hora.length > 0 && (
            <div className="my-14">
              <h2 className="text-3xl font-bold text-gold-gradient mb-2 text-center" style={headingFont}>
                {t('hora')}
              </h2>
              <p className="text-text-secondary text-sm text-center mb-8">{t('horaDesc')}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {panchang.hora.map((slot, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={`rounded-lg p-3 border text-center ${
                      slot.nature === 'auspicious' ? 'bg-emerald-500/5 border-emerald-500/15' :
                      slot.nature === 'inauspicious' ? 'bg-red-500/5 border-red-500/15' :
                      'bg-amber-500/5 border-amber-500/15'
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      <GrahaIconById id={slot.planetId} size={24} />
                    </div>
                    <div className="text-gold-light text-xs font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {(slot.planet[locale] || slot.planet.en || '')}
                    </div>
                    <div className="font-mono text-xs text-text-secondary mt-1">{slot.startTime}—{slot.endTime}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <GoldDivider />

          {/* ═══ DAILY MUHURTA TIMELINE ═══ */}
          <InfoBlock
            id="panchang-muhurta"
            title={msg('muhurtaTitle', locale)}
            defaultOpen={false}
          >
            {msg('muhurtaDesc', locale)}
          </InfoBlock>
          <div className="my-14">
            <h2 className="text-3xl font-bold text-gold-gradient mb-3 text-center" style={headingFont}>
              {msg('todaysMuhurtas', locale)}
            </h2>
            <p className="text-text-secondary text-sm text-center mb-8 max-w-2xl mx-auto">
              {locale === 'en'
                ? 'The day is divided into 30 Muhurtas (~48 min each). Each is presided by a deity and carries specific energy. Click any muhurta to see its significance and best uses.'
                : 'दिन को 30 मुहूर्तों (~48 मिनट प्रत्येक) में विभाजित किया गया है। प्रत्येक एक देवता द्वारा अधिष्ठित है। महत्व और सर्वोत्तम उपयोग देखने के लिए किसी भी मुहूर्त पर क्लिक करें।'}
            </p>

            {/* Daytime muhurtas */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Sun className="w-6 h-6 text-gold-primary" />
                <h3 className="text-xl font-bold text-gold-light" style={headingFont}>
                  {msg('daytimeMuhurtas', locale)}
                </h3>
                <span className="text-text-secondary text-xs">({panchang.sunrise} — {panchang.sunset})</span>
              </div>
              <div className="space-y-3">
                {panchang.muhurtas.slice(0, 15).map((m, i) => {
                  const info = MUHURTA_DATA[i];
                  const isCurrent = currentMuhurtaIdx === i;
                  const isAbhijit = m.number === 8;
                  return (
                    <motion.div
                      key={m.number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`rounded-xl p-4 border transition-all ${
                        isAbhijit ? 'bg-gold-primary/10 border-gold-primary/40' :
                        isCurrent ? 'bg-gold-primary/5 border-gold-primary/30' :
                        getNatureBg(m.nature)
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl font-bold w-8 ${getNatureColor(m.nature)}`}>{m.number}</span>
                          <div>
                            <span className="text-gold-light font-bold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                              {(m.name[locale] || m.name.en || '')}
                            </span>
                            {isAbhijit && <span className="ml-2 px-2 py-0.5 bg-gold-primary/30 text-gold-light text-xs rounded-full font-bold uppercase">Abhijit</span>}
                            {isCurrent && <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-bold animate-pulse">{msg('now', locale)}</span>}
                            {info && <span className="ml-2 text-text-secondary/70 text-xs">{(info.deity[locale] || info.deity.en || '')}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="font-mono text-sm text-text-secondary">{m.startTime} — {m.endTime}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getNatureColor(m.nature)} ${m.nature === 'auspicious' ? 'bg-emerald-500/10' : m.nature === 'inauspicious' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                            {getNatureLabel(m.nature)}
                          </span>
                        </div>
                      </div>
                      {info && (
                        <div className="ml-11">
                          <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{(info.significance[locale] || info.significance.en || '')}</p>
                          <p className="text-gold-primary/60 text-xs mt-1.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                            <span className="font-semibold">{msg('bestFor', locale)}</span> {info.bestFor[locale]}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Night muhurtas (collapsible) */}
            <div>
              <button
                onClick={() => setShowAllMuhurtas(!showAllMuhurtas)}
                className="flex items-center gap-3 mb-4 group"
              >
                <Moon className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-bold text-indigo-300/80" style={headingFont}>
                  {msg('nighttimeMuhurtas', locale)}
                </h3>
                <span className="text-text-secondary text-xs">({panchang.sunset} — {msg('nextSunrise', locale)})</span>
                {showAllMuhurtas ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
              </button>
              <AnimatePresence>
                {showAllMuhurtas && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    {panchang.muhurtas.slice(15).map((m, i) => {
                      const info = MUHURTA_DATA[i + 15];
                      const isBrahma = m.number >= 26 && m.number <= 27;
                      return (
                        <motion.div
                          key={m.number}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`rounded-xl p-4 border ${
                            isBrahma ? 'bg-indigo-500/10 border-indigo-500/20' : getNatureBg(m.nature)
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className={`text-2xl font-bold w-8 ${getNatureColor(m.nature)}`}>{m.number}</span>
                              <div>
                                <span className="text-gold-light font-bold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{(m.name[locale] || m.name.en || '')}</span>
                                {isBrahma && <span className="ml-2 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full font-bold">{msg('brahmaMuhurtaLabel', locale)}</span>}
                                {info && <span className="ml-2 text-text-secondary/70 text-xs">{(info.deity[locale] || info.deity.en || '')}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="font-mono text-sm text-text-secondary">{m.startTime} — {m.endTime}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getNatureColor(m.nature)} ${m.nature === 'auspicious' ? 'bg-emerald-500/10' : m.nature === 'inauspicious' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                                {getNatureLabel(m.nature)}
                              </span>
                            </div>
                          </div>
                          {info && (
                            <div className="ml-11">
                              <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{(info.significance[locale] || info.significance.en || '')}</p>
                              <p className="text-gold-primary/60 text-xs mt-1.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                <span className="font-semibold">{msg('bestFor', locale)}</span> {info.bestFor[locale]}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-14">
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

          {/* ═══ UDAYA LAGNA ═══ */}
          {panchang.udayaLagna && panchang.udayaLagna.length > 0 && (
            <div className="my-10">
              <h3 className="text-lg font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
                <Star className="w-5 h-5 text-gold-primary" />
                <span>{msg('udayaLagna', locale)}</span>
              </h3>
              <p className="text-text-secondary text-xs mb-4 max-w-2xl">
                {locale === 'en'
                  ? 'The zodiac sign rising on the eastern horizon changes approximately every 2 hours. Each rising window carries the energy of that sign for muhurta selection.'
                  : 'पूर्वी क्षितिज पर उदित राशि लगभग हर 2 घंटे में बदलती है। प्रत्येक उदय खिड़की मुहूर्त चयन के लिए उस राशि की ऊर्जा वहन करती है।'}
              </p>
              <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 divide-x divide-y divide-gold-primary/10">
                  {panchang.udayaLagna.map((lagna, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.02 * i }}
                      className="p-3 text-center hover:bg-gold-primary/5 transition-colors">
                      <div className="flex justify-center mb-1.5">
                        <RashiIconById id={lagna.rashi} size={28} />
                      </div>
                      <div className="text-gold-light text-sm font-bold" style={headingFont}>{(lagna.name[locale] || lagna.name.en || '')}</div>
                      <div className="text-text-secondary text-xs font-mono mt-1">{lagna.start} – {lagna.end}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <GoldDivider />

          {/* ═══ CHANDRABALAM & TARABALAM ═══ */}
          <InfoBlock
            id="panchang-balam"
            title={msg('balamTitle', locale)}
            defaultOpen={false}
          >
            {msg('balamPersonalDesc', locale)}
          </InfoBlock>
          <div className="my-14">
            <h2 className="text-3xl font-bold text-gold-gradient mb-2 text-center" style={headingFont}>
              {msg('chandrabalam', locale)}
            </h2>
            <p className="text-text-secondary text-sm text-center mb-8">
              {birthAutoDetected
                ? (locale === 'en'
                  ? `Auto-detected from your birth chart${useBirthDataStore.getState().birthName ? ` (${useBirthDataStore.getState().birthName})` : ''}. You can change below if needed.`
                  : `आपकी जन्म कुण्डली${useBirthDataStore.getState().birthName ? ` (${useBirthDataStore.getState().birthName})` : ''} से स्वतः प्राप्त। आवश्यकतानुसार नीचे बदलें।`)
                : (locale === 'en'
                  ? 'Select your birth Nakshatra and Rashi, or generate a Kundali first to auto-detect.'
                  : 'अपना जन्म नक्षत्र और राशि चुनें, या स्वतः पता लगाने के लिए पहले कुण्डली बनाएं।')}
            </p>
            <div className="max-w-2xl mx-auto rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6">
              {birthAutoDetected && (
                <div className="flex items-center justify-center gap-2 mb-4 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 text-xs font-medium">
                    {msg('birthDataLoaded', locale)}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">
                    {msg('birthNakshatra', locale)}
                  </label>
                  <select
                    value={birthNakshatra}
                    onChange={(e) => {
                      setBirthNakshatra(Number(e.target.value));
                      setBirthAutoDetected(false);
                    }}
                    className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50"
                    style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                  >
                    <option value={0}>{msg('select', locale)}</option>
                    {NAKSHATRAS.map((n) => (
                      <option key={n.id} value={n.id}>{(n.name[locale] || n.name.en || '')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">
                    {msg('birthRashi', locale)}
                  </label>
                  <select
                    value={birthRashi}
                    onChange={(e) => {
                      setBirthRashi(Number(e.target.value));
                      setBirthAutoDetected(false);
                    }}
                    className="w-full bg-bg-tertiary border border-gold-primary/20 rounded-lg px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50"
                    style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                  >
                    <option value={0}>{msg('select', locale)}</option>
                    {RASHIS.map((r) => (
                      <option key={r.id} value={r.id}>{r.name[locale]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <AnimatePresence>
                {balamResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className={`rounded-xl p-4 border text-center ${
                      balamResult.chandrabalam.favorable
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                    }`}>
                      <div className={`text-xs uppercase tracking-wider font-bold mb-1 ${
                        balamResult.chandrabalam.favorable ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {msg('chandrabalamLabel', locale)}
                      </div>
                      <div className={`text-2xl font-bold ${
                        balamResult.chandrabalam.favorable ? 'text-emerald-300' : 'text-red-300'
                      }`}>
                        {balamResult.chandrabalam.favorable
                          ? (msg('strongLabel', locale))
                          : (msg('weakLabel', locale))}
                      </div>
                      <div className="text-text-secondary text-xs mt-2">
                        {_tl({ en: `Moon in ${balamResult.chandrabalam.house}${['st','nd','rd'][balamResult.chandrabalam.house-1] || 'th'} house`, hi: `चन्द्र ${balamResult.chandrabalam.house}वें भाव में`, sa: `चन्द्र ${balamResult.chandrabalam.house}वें भाव में`, ta: `Moon in ${balamResult.chandrabalam.house}${['st','nd','rd'][balamResult.chandrabalam.house-1] || 'th'} house`, te: `Moon in ${balamResult.chandrabalam.house}${['st','nd','rd'][balamResult.chandrabalam.house-1] || 'th'} house`, bn: `Moon in ${balamResult.chandrabalam.house}${['st','nd','rd'][balamResult.chandrabalam.house-1] || 'th'} house`, kn: `Moon in ${balamResult.chandrabalam.house}${['st','nd','rd'][balamResult.chandrabalam.house-1] || 'th'} house`, gu: `Moon in ${balamResult.chandrabalam.house}${['st','nd','rd'][balamResult.chandrabalam.house-1] || 'th'} house`, mai: `चन्द्र ${balamResult.chandrabalam.house}वें भाव में`, mr: `चन्द्र ${balamResult.chandrabalam.house}वें भाव में` }, locale)}
                      </div>
                    </div>
                    <div className={`rounded-xl p-4 border text-center ${
                      balamResult.tarabalam.favorable
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                    }`}>
                      <div className={`text-xs uppercase tracking-wider font-bold mb-1 ${
                        balamResult.tarabalam.favorable ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {msg('tarabalamLabel', locale)}
                      </div>
                      <div className={`text-2xl font-bold ${
                        balamResult.tarabalam.favorable ? 'text-emerald-300' : 'text-red-300'
                      }`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                        {balamResult.tarabalam.taraName[locale]}
                      </div>
                      <div className="text-text-secondary text-xs mt-2">
                        {_tl({ en: `Tara #${balamResult.tarabalam.tara}`, hi: `तारा #${balamResult.tarabalam.tara}`, sa: `तारा #${balamResult.tarabalam.tara}`, ta: `Tara #${balamResult.tarabalam.tara}`, te: `Tara #${balamResult.tarabalam.tara}`, bn: `Tara #${balamResult.tarabalam.tara}`, kn: `Tara #${balamResult.tarabalam.tara}`, gu: `Tara #${balamResult.tarabalam.tara}`, mai: `तारा #${balamResult.tarabalam.tara}`, mr: `तारा #${balamResult.tarabalam.tara}` }, locale)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <GoldDivider />

          {/* ═══ PANCHA PAKSHI SHASTRA ═══ */}
          {panchang && birthNakshatra > 0 && (() => {
            // Parse sunrise / sunset into today's Date objects
            const today = selectedDate || new Date().toISOString().split('T')[0];
            const [ty, tm, td] = today.split('-').map(Number);
            function parseTimeToMs(timeStr: string): number {
              const [h, m] = timeStr.split(':').map(Number);
              return new Date(ty, tm - 1, td, h, m, 0, 0).getTime();
            }
            const sunriseMs = parseTimeToMs(panchang.sunrise);
            const sunsetMs  = parseTimeToMs(panchang.sunset);
            const now = new Date();
            const pp = calculatePanchaPakshi(now, sunriseMs, sunsetMs, birthNakshatra);
            const AUSPICIOUS_COLOR: Record<string, string> = {
              excellent: 'border-emerald-500/30 bg-emerald-500/8',
              good:      'border-gold-primary/25 bg-gold-primary/5',
              neutral:   'border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]',
              avoid:     'border-red-500/25 bg-red-500/8',
            };
            const AUSPICIOUS_BADGE: Record<string, string> = {
              excellent: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
              good:      'bg-gold-primary/20 text-gold-light border-gold-primary/30',
              neutral:   'bg-bg-secondary text-text-secondary/75 border-gold-primary/10',
              avoid:     'bg-red-500/15 text-red-400 border-red-500/25',
            };
            return (
              <div className="my-14">
                <h2 className="text-3xl font-bold text-gold-gradient mb-2 text-center" style={headingFont}>
                  {msg('panchaPakshiShastra', locale)}
                </h2>
                <p className="text-text-secondary/75 text-sm text-center mb-6 max-w-2xl mx-auto" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {locale === 'en'
                    ? `Kerala tradition — your ruling bird is ${pp.birthBirdName.en}. Five periods divide the ${pp.isDay ? 'day' : 'night'}; your bird's current activity determines auspiciousness.`
                    : `केरल परम्परा — आपका राशि पक्षी ${pp.birthBirdName.hi} है। ${pp.isDay ? 'दिन' : 'रात्रि'} के पाँच काल; पक्षी की वर्तमान क्रिया शुभाशुभ निर्धारित करती है।`}
                </p>

                {/* Current period — hero */}
                <div className={`rounded-2xl border p-6 text-center mb-6 ${AUSPICIOUS_COLOR[pp.currentPeriod.auspicious]}`}>
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold mb-4 ${AUSPICIOUS_BADGE[pp.currentPeriod.auspicious]}`}>
                    {_tl(pp.currentPeriod.activityName, locale)}
                    {pp.currentPeriod.auspicious === 'excellent' && ' ✦'}
                    {pp.currentPeriod.auspicious === 'avoid' && ' ✗'}
                  </div>
                  <div className="text-gold-light font-bold text-xl mb-1" style={headingFont}>
                    {_tl(pp.birthBirdName, locale)} — {pp.currentPeriod.periodStart}–{pp.currentPeriod.periodEnd}
                  </div>
                  <p className="text-text-secondary/80 text-sm max-w-xl mx-auto leading-relaxed mt-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {_tl(pp.currentPeriod.interpretation, locale)}
                  </p>
                </div>

                {/* All 5 periods timeline */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {pp.allPeriods.map((period, i) => (
                    <div key={i} className={`rounded-xl border p-2.5 text-center ${i === pp.periodIndex ? AUSPICIOUS_COLOR[period.auspicious] + ' ring-1 ring-gold-primary/30' : 'border-gold-primary/8 bg-bg-secondary/20 opacity-60'}`}>
                      <div className={`text-[10px] font-bold mb-1 ${
                        period.auspicious === 'excellent' ? 'text-emerald-400' :
                        period.auspicious === 'good'      ? 'text-gold-primary' :
                        period.auspicious === 'avoid'     ? 'text-red-400' : 'text-text-secondary/70'
                      }`}>
                        {_tl(period.activityName, locale)}
                      </div>
                      <div className="text-[9px] text-text-secondary/70 font-mono">{period.periodStart}</div>
                      <div className="text-[9px] text-text-secondary/65 font-mono">—{period.periodEnd}</div>
                      {i === pp.periodIndex && <div className="text-[9px] text-gold-primary font-bold mt-0.5">▶ Now</div>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <GoldDivider />

          {/* ═══ PLANETARY POSITIONS ═══ */}
          <div className="my-14">
            <h2 className="text-3xl font-bold text-gold-gradient mb-8 text-center" style={headingFont}>
              {t('planetaryPositions')}
            </h2>
            <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold-primary/10">
                      <th className="text-left px-5 py-4 text-gold-dark uppercase text-xs tracking-wider font-bold">{t('planet')}</th>
                      <th className="text-left px-5 py-4 text-gold-dark uppercase text-xs tracking-wider font-bold">{t('sign')}</th>
                      <th className="text-left px-5 py-4 text-gold-dark uppercase text-xs tracking-wider font-bold">{t('longitude')}</th>
                      <th className="text-left px-5 py-4 text-gold-dark uppercase text-xs tracking-wider font-bold">{t('nakshatraCol')}</th>
                      <th className="text-center px-5 py-4 text-gold-dark uppercase text-xs tracking-wider font-bold">{t('retrograde')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {panchang.planets.map((planet) => {
                      const rashi = RASHIS[(planet.rashi || 1) - 1];
                      const nak = NAKSHATRAS[(planet.nakshatra || 1) - 1];
                      return (
                        <tr key={planet.id} className="border-b border-gold-primary/5 hover:bg-bg-tertiary/30 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <GrahaIconById id={planet.id} size={32} />
                              <span className="text-text-primary font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                {planet.name[locale]}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <RashiIconById id={planet.rashi || 1} size={24} />
                              <span className="text-text-primary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                {rashi?.name[locale]}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-mono text-text-secondary">{planet.longitude !== undefined ? `${planet.longitude.toFixed(2)}°` : '—'}</td>
                          <td className="px-5 py-4">
                            <span className="text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{nak?.name[locale]}</span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            {planet.isRetrograde ? <span className="text-red-400 font-bold text-lg">R</span> : <span className="text-text-secondary/55">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <GoldDivider />
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
