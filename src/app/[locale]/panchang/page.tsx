'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { MapPin, Loader2, Search, Clock, Sun, Moon, ChevronDown, ChevronUp, Compass, Calendar, Star, Bell } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import ShareButton from '@/components/ui/ShareButton';
import { Download } from 'lucide-react';
import { TithiIcon, NakshatraIcon, YogaIcon, KaranaIcon, VaraIcon, MuhurtaIcon, GrahanIcon, RashiIcon, MasaIcon, SamvatsaraIcon, SunriseIcon, SunsetIcon, MoonriseIcon, RituIcon, AyanaIcon } from '@/components/icons/PanchangIcons';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { GRAHAS } from '@/lib/constants/grahas';
import { RashiIconById } from '@/components/icons/RashiIcons';
import type { PanchangData, Locale, Muhurta, TransitionInfo, BalamResult } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { TITHIS } from '@/lib/constants/tithis';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { MUHURTA_DATA } from '@/lib/constants/muhurtas';
import { computeBalam } from '@/lib/panchang/balam';
import { useBirthDataStore } from '@/stores/birth-data-store';

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
const MONTH_SHORT_HI = ['जन','फर','मार','अप्रै','मई','जून','जुल','अग','सित','अक्टू','नव','दिस'];
function formatTransitionTime(time: string, date: string | undefined, _selectedDate: string, locale: string): string {
  if (!date) return time;
  const [, m, d] = date.split('-').map(Number);
  const monthNames = locale === 'en' ? MONTH_SHORT : MONTH_SHORT_HI;
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
  const isDevanagari = locale !== 'en';

  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationData>({ lat: 28.6139, lng: 77.209, name: 'New Delhi, India', tz: 5.5 });
  const [locationInput, setLocationInput] = useState('');
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const [showAllMuhurtas, setShowAllMuhurtas] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMuhurtaIdx, setCurrentMuhurtaIdx] = useState(-1);
  const [birthNakshatra, setBirthNakshatra] = useState(0);
  const [birthRashi, setBirthRashi] = useState(0);
  const [balamResult, setBalamResult] = useState<BalamResult | null>(null);
  const [birthAutoDetected, setBirthAutoDetected] = useState(false);
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
        () => {
          fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
              if (data.latitude && data.longitude) {
                setLocation({ lat: data.latitude, lng: data.longitude, name: [data.city, data.country_name].filter(Boolean).join(', ') || 'Unknown', tz: data.utc_offset ? parseFloat(data.utc_offset) / 100 : 5.5 });
              }
            })
            .catch(() => {})
            .finally(() => setDetectingLocation(false));
        },
        { timeout: 5000 }
      );
    }
  }, []);

  const fetchPanchang = useCallback(() => {
    if (!selectedDate) return;
    setLoading(true);
    const [year, month, day] = selectedDate.split('-').map(Number);
    fetch(`/api/panchang?year=${year}&month=${month}&day=${day}&lat=${location.lat}&lng=${location.lng}&tz=${location.tz}&location=${encodeURIComponent(location.name)}`)
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
        // Approximate timezone from longitude (round to nearest 0.5h)
        const approxTz = Math.round(lng / 15 * 2) / 2;
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
    if (nature === 'auspicious') return locale === 'en' ? 'Auspicious' : 'शुभ';
    if (nature === 'inauspicious') return locale === 'en' ? 'Inauspicious' : 'अशुभ';
    return locale === 'en' ? 'Neutral' : 'सम';
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
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
      </motion.div>

      {/* Date & Location */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="glass-card rounded-xl p-4 inline-flex items-center gap-4">
          <label className="text-gold-dark text-sm">{t('selectDate')}</label>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-bg-tertiary border border-gold-primary/20 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-gold-primary/50" />
        </div>
        <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold-primary" />
            <span className="text-text-primary text-sm font-medium">
              {detectingLocation ? (
                <span className="flex items-center gap-2 text-text-secondary"><Loader2 className="w-3 h-3 animate-spin" />{locale === 'en' ? 'Detecting...' : 'खोज...'}</span>
              ) : location.name}
            </span>
          </div>
          <button onClick={() => setShowLocationSearch(!showLocationSearch)}
            className="text-gold-primary hover:text-gold-light text-xs border border-gold-primary/20 px-3 py-1.5 rounded-lg hover:bg-gold-primary/10 transition-all">
            {locale === 'en' ? 'Change' : 'बदलें'}
          </button>
        </div>
        {showLocationSearch && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-4 flex gap-2 w-full max-w-md">
            <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
              placeholder={locale === 'en' ? 'Search city...' : 'शहर खोजें...'}
              className="flex-1 bg-bg-tertiary/50 border border-gold-primary/20 rounded-lg px-4 py-2 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50" />
            <button onClick={handleLocationSearch} disabled={searchingLocation}
              className="px-4 py-2 bg-gold-primary/20 border border-gold-primary/30 rounded-lg text-gold-light hover:bg-gold-primary/30 transition-all disabled:opacity-50">
              {searchingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </motion.div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : panchang ? (
        <>
          {/* Location banner */}
          <div className="text-center mb-10">
            <p className="text-text-secondary text-sm">
              <MapPin className="w-3.5 h-3.5 inline mr-1" />
              {locale === 'en' ? 'Panchang for' : 'पंचांग —'}{' '}
              <span className="text-gold-light font-medium">{panchang.location.name}</span>
              {' · '}{panchang.date}
            </p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                onClick={async () => {
                  const { exportPanchangPDF } = await import('@/lib/export/pdf-panchang');
                  exportPanchangPDF(panchang, locale as Locale);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
                aria-label="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
                PDF
              </button>
              <ShareButton
                title={`Panchang — ${panchang.date}`}
                text={`Today's Vedic Panchang from Jyotish Panchang`}
                className="!px-3 !py-1.5 !text-xs"
              />
              <button
                onClick={async () => {
                  const { requestNotificationPermission, generatePanchangAlerts, scheduleAlerts } = await import('@/lib/notifications/panchang-alerts');
                  const granted = await requestNotificationPermission();
                  if (granted) {
                    const alerts = generatePanchangAlerts(panchang, locale);
                    scheduleAlerts(alerts);
                    alert(locale === 'en' ? `${alerts.length} alert(s) scheduled for today` : `आज के लिए ${alerts.length} अलर्ट निर्धारित`);
                  } else {
                    alert(locale === 'en' ? 'Please allow notifications in browser settings' : 'कृपया ब्राउज़र सेटिंग्स में सूचनाएं अनुमति दें');
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-gold-primary/30 text-gold-light hover:bg-gold-primary/10 hover:border-gold-primary/60 transition-all duration-300"
                aria-label="Set alerts"
              >
                <Bell className="w-3.5 h-3.5" />
                {locale === 'en' ? 'Alerts' : 'अलर्ट'}
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              SECTION 1: FIVE ELEMENTS (Pancha Anga)
          ═══════════════════════════════════════════════════ */}
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

            const upto = locale === 'en' ? 'upto' : 'तक';
            const onwards = locale === 'en' ? 'onwards' : 'से आगे';

            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mb-14">
                {/* ── TITHI CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="glass-card rounded-2xl p-6 text-center hover:border-gold-primary/40 transition-all cursor-default"
                >
                  <div className="flex justify-center mb-3"><TithiIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('tithi')}</div>
                  {/* First tithi (at sunrise) */}
                  <div className={`rounded-lg p-2.5 mb-2 border ${tithiPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
                    <div className="text-gold-light text-lg font-bold leading-tight" style={headingFont}>
                      {panchang.tithi.name[locale]}
                    </div>
                    <div className="text-text-secondary text-[10px] mt-0.5">
                      {panchang.tithi.paksha === 'shukla' ? t('shukla') : t('krishna')}
                    </div>
                    {tithiTr && (
                      <>
                        <div className="font-mono text-[10px] text-text-secondary/60 mt-1">
                          {fmt(tithiTr.startTime, tithiTr.startDate)} —
                        </div>
                        <div className="font-mono text-xs text-gold-primary">
                          {fmt(tithiTr.endTime, tithiTr.endDate)}
                        </div>
                      </>
                    )}
                  </div>
                  {/* Second tithi (after transition) */}
                  {nextTithiData && tithiTr && (
                    <div className={`rounded-lg p-2.5 border ${tithiPassed ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10 opacity-60'}`}>
                      <div className="text-gold-light text-lg font-bold leading-tight" style={headingFont}>
                        {nextTithiData.name[locale]}
                      </div>
                      <div className="text-text-secondary text-[10px] mt-0.5">
                        {nextTithiData.paksha === 'shukla' ? t('shukla') : t('krishna')}
                      </div>
                      <div className="font-mono text-xs text-gold-primary mt-1.5">
                        {fmt(tithiTr.endTime, tithiTr.endDate)} {onwards}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* ── NAKSHATRA CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="glass-card rounded-2xl p-6 text-center hover:border-gold-primary/40 transition-all cursor-default"
                >
                  <div className="flex justify-center mb-3"><NakshatraIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('nakshatra')}</div>
                  {/* First nakshatra (at sunrise) */}
                  <div className={`rounded-lg p-2.5 mb-2 border ${nakPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
                    <div className="text-gold-light text-lg font-bold leading-tight" style={headingFont}>
                      {panchang.nakshatra.name[locale]}
                    </div>
                    <div className="text-text-secondary text-[10px] mt-0.5">
                      {panchang.nakshatra.deity[locale]}
                      {panchang.nakshatra.pada ? ` · ${locale === 'en' ? 'Pada' : 'पाद'} ${panchang.nakshatra.pada}` : ''}
                    </div>
                    {nakTr && (
                      <>
                        <div className="font-mono text-[10px] text-text-secondary/60 mt-1">
                          {fmt(nakTr.startTime, nakTr.startDate)} —
                        </div>
                        <div className="font-mono text-xs text-gold-primary">
                          {fmt(nakTr.endTime, nakTr.endDate)}
                        </div>
                      </>
                    )}
                  </div>
                  {/* Second nakshatra (after transition) */}
                  {nextNakData && nakTr && (
                    <div className={`rounded-lg p-2.5 border ${nakPassed ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10 opacity-60'}`}>
                      <div className="text-gold-light text-lg font-bold leading-tight" style={headingFont}>
                        {nextNakData.name[locale]}
                      </div>
                      <div className="text-text-secondary text-[10px] mt-0.5">
                        {nextNakData.deity[locale]}
                      </div>
                      <div className="font-mono text-xs text-gold-primary mt-1.5">
                        {fmt(nakTr.endTime, nakTr.endDate)} {onwards}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* ── YOGA CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="glass-card rounded-2xl p-6 text-center hover:border-gold-primary/40 transition-all cursor-default"
                >
                  <div className="flex justify-center mb-3"><YogaIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('yoga')}</div>
                  <div className="text-gold-light text-2xl font-bold leading-tight" style={headingFont}>{activeYoga.name[locale]}</div>
                  <div className="text-text-secondary text-xs mt-2">{activeYoga.meaning[locale]}</div>
                  {panchang.yogaTransition && (
                    <div className="mt-3 pt-2 border-t border-gold-primary/10">
                      <div className="font-mono text-[10px] text-text-secondary/60">{fmt(panchang.yogaTransition.startTime, panchang.yogaTransition.startDate)} —</div>
                      <div className="font-mono text-xs text-gold-primary">{fmt(panchang.yogaTransition.endTime, panchang.yogaTransition.endDate)}</div>
                      {!yogaPassed && (
                        <div className="text-[10px] text-text-secondary mt-1">
                          {t('then')} <span className="text-gold-light font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{panchang.yogaTransition.nextName[locale]}</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* ── KARANA CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="glass-card rounded-2xl p-6 text-center hover:border-gold-primary/40 transition-all cursor-default"
                >
                  <div className="flex justify-center mb-3"><KaranaIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('karana')}</div>
                  <div className="text-gold-light text-2xl font-bold leading-tight" style={headingFont}>{activeKarana.name[locale]}</div>
                  <div className="text-text-secondary text-xs mt-2">
                    {activeKarana.type === 'chara' ? (locale === 'en' ? 'Movable' : 'चर') : activeKarana.type === 'sthira' ? (locale === 'en' ? 'Fixed' : 'स्थिर') : (locale === 'en' ? 'Special' : 'विशेष')}
                  </div>
                  {panchang.karanaTransition && (
                    <div className="mt-3 pt-2 border-t border-gold-primary/10">
                      <div className="font-mono text-[10px] text-text-secondary/60">{fmt(panchang.karanaTransition.startTime, panchang.karanaTransition.startDate)} —</div>
                      <div className="font-mono text-xs text-gold-primary">{fmt(panchang.karanaTransition.endTime, panchang.karanaTransition.endDate)}</div>
                      {!karanaPassed && (
                        <div className="text-[10px] text-text-secondary mt-1">
                          {t('then')} <span className="text-gold-light font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{panchang.karanaTransition.nextName[locale]}</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* ── VARA CARD ── */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className="glass-card rounded-2xl p-6 text-center hover:border-gold-primary/40 transition-all cursor-default"
                >
                  <div className="flex justify-center mb-3"><VaraIcon size={56} /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('vara')}</div>
                  <div className="text-gold-light text-2xl font-bold leading-tight" style={headingFont}>{panchang.vara.name[locale]}</div>
                  <div className="text-text-secondary text-xs mt-2">{panchang.vara.ruler[locale]}</div>
                </motion.div>
              </div>
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
                className="glass-card rounded-xl p-5 flex items-center gap-4"
              >
                <item.Icon size={48} />
                <div>
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-semibold">{item.label}</div>
                  <div className="text-text-primary font-mono text-2xl font-bold">{item.value}</div>
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
              title={locale === 'en' ? 'Auspicious Timings' : 'शुभ मुहूर्त'}
              subtitle={locale === 'en'
                ? 'Sacred windows of time blessed by planetary harmony — begin new ventures, ceremonies, and important work during these periods.'
                : 'ग्रहों की अनुकूल स्थिति में शुभ काल — इन अवधियों में नए कार्य, समारोह और महत्वपूर्ण कार्य प्रारम्भ करें।'}
              accentClass="text-emerald-400"
            />

            {/* Sarvartha Siddhi full-width banner */}
            {panchang.sarvarthaSiddhi && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6">
                <div className="glass-card rounded-2xl p-6 border-2 border-gold-primary/40 bg-gradient-to-r from-gold-primary/10 via-emerald-500/5 to-gold-primary/10 text-center">
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

            {/* Ravi Yoga badge */}
            {panchang.raviYoga && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-center">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-400/40 bg-amber-500/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-amber-300 text-sm font-bold uppercase tracking-wider">
                    {locale === 'en' ? 'Ravi Yoga Active' : 'रवि योग सक्रिय'}
                  </span>
                  <span className="text-amber-400/70 text-xs">{locale === 'en' ? '· Highly Auspicious' : '· अत्यंत शुभ'}</span>
                </div>
              </motion.div>
            )}

            {/* Auspicious timings grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Brahma Muhurta */}
              {panchang.brahmaMuhurta && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                  className="glass-card rounded-xl p-5 text-center border border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-transparent">
                  <div className="text-indigo-400 text-xs uppercase tracking-wider font-bold mb-2">{t('brahmaMuhurta')}</div>
                  <div className="font-mono text-xl font-bold text-indigo-300">{panchang.brahmaMuhurta.start} — {panchang.brahmaMuhurta.end}</div>
                  <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">{t('brahmaMuhurtaDesc')}</div>
                </motion.div>
              )}

              {/* Abhijit Muhurta */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                className="glass-card rounded-xl p-5 text-center border-2 border-gold-primary/40 bg-gradient-to-br from-gold-primary/10 to-transparent">
                <div className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-2">
                  {locale === 'en' ? 'Abhijit Muhurta' : 'अभिजित् मुहूर्त'}
                </div>
                <div className="font-mono text-xl font-bold text-gold-light">{panchang.abhijitMuhurta.start} — {panchang.abhijitMuhurta.end}</div>
                <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">
                  {locale === 'en' ? 'Most auspicious — victory assured' : 'सर्वश्रेष्ठ — विजय निश्चित'}
                </div>
              </motion.div>

              {/* Vijaya Muhurta */}
              {panchang.vijayaMuhurta && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}
                  className="glass-card rounded-xl p-5 text-center border border-amber-400/30 bg-gradient-to-br from-amber-500/5 to-transparent">
                  <div className="text-amber-400 text-xs uppercase tracking-wider font-bold mb-2">
                    {locale === 'en' ? 'Vijaya Muhurta' : 'विजय मुहूर्त'}
                  </div>
                  <div className="font-mono text-xl font-bold text-amber-300">{panchang.vijayaMuhurta.start} — {panchang.vijayaMuhurta.end}</div>
                  <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">
                    {locale === 'en' ? '10th muhurta — victory assured' : '१०वाँ मुहूर्त — विजय निश्चित'}
                  </div>
                </motion.div>
              )}

              {/* Amrit Kalam */}
              {panchang.amritKalam && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                  className="glass-card rounded-xl p-5 text-center border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent">
                  <div className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-2">{t('amritKalam')}</div>
                  <div className="font-mono text-xl font-bold text-emerald-300">{panchang.amritKalam.start} — {panchang.amritKalam.end}</div>
                  <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">{t('amritKalamDesc')}</div>
                </motion.div>
              )}

              {/* Godhuli Muhurta */}
              {panchang.godhuli && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}
                  className="glass-card rounded-xl p-5 text-center border border-amber-600/30 bg-gradient-to-br from-amber-600/5 to-transparent">
                  <div className="text-amber-500 text-xs uppercase tracking-wider font-bold mb-2">{t('godhuli')}</div>
                  <div className="font-mono text-xl font-bold text-amber-400">{panchang.godhuli.start} — {panchang.godhuli.end}</div>
                  <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">{t('godhuliDesc')}</div>
                </motion.div>
              )}

              {/* Morning Sandhya */}
              {panchang.sandhyaKaal && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}
                  className="glass-card rounded-xl p-5 text-center border border-orange-400/30 bg-gradient-to-br from-orange-500/5 to-transparent">
                  <div className="text-orange-400 text-xs uppercase tracking-wider font-bold mb-2">
                    {locale === 'en' ? 'Morning Sandhya' : 'प्रातः संध्या'}
                  </div>
                  <div className="font-mono text-xl font-bold text-orange-300">{panchang.sandhyaKaal.morning.start} — {panchang.sandhyaKaal.morning.end}</div>
                  <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">
                    {locale === 'en' ? 'Pratah Sandhya — morning prayers' : 'प्रातः संध्या — प्रातःकालीन पूजा'}
                  </div>
                </motion.div>
              )}

              {/* Evening Sandhya */}
              {panchang.sandhyaKaal && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.23 }}
                  className="glass-card rounded-xl p-5 text-center border border-purple-400/30 bg-gradient-to-br from-purple-500/5 to-transparent">
                  <div className="text-purple-400 text-xs uppercase tracking-wider font-bold mb-2">
                    {locale === 'en' ? 'Evening Sandhya' : 'सायं संध्या'}
                  </div>
                  <div className="font-mono text-xl font-bold text-purple-300">{panchang.sandhyaKaal.evening.start} — {panchang.sandhyaKaal.evening.end}</div>
                  <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">
                    {locale === 'en' ? 'Sayahna Sandhya — evening prayers' : 'सायंकाल संध्या — सन्ध्याकालीन पूजा'}
                  </div>
                </motion.div>
              )}

              {/* Nishita Kaal */}
              {panchang.nishitaKaal && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
                  className="glass-card rounded-xl p-5 text-center border border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-transparent">
                  <div className="text-blue-400 text-xs uppercase tracking-wider font-bold mb-2">{t('nishitaKaal')}</div>
                  <div className="font-mono text-xl font-bold text-blue-300">{panchang.nishitaKaal.start} — {panchang.nishitaKaal.end}</div>
                  <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">{t('nishitaKaalDesc')}</div>
                </motion.div>
              )}

              {/* Anandadi Yoga — auspicious variant */}
              {panchang.anandadiYoga && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29 }}
                  className={`glass-card rounded-xl p-5 text-center border ${
                    panchang.anandadiYoga.nature === 'auspicious'
                      ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent'
                      : 'border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent'
                  }`}>
                  <div className={`text-xs uppercase tracking-wider font-bold mb-2 ${panchang.anandadiYoga.nature === 'auspicious' ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {locale === 'en' ? 'Anandadi Yoga' : 'आनन्दादि योग'}
                  </div>
                  <div className={`font-bold text-lg ${panchang.anandadiYoga.nature === 'auspicious' ? 'text-emerald-300' : 'text-orange-300'}`}
                    style={headingFont}>
                    {panchang.anandadiYoga.name[locale]}
                  </div>
                  <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">
                    {panchang.anandadiYoga.nature === 'auspicious'
                      ? (locale === 'en' ? 'Auspicious yoga — favourable energy' : 'शुभ योग — अनुकूल ऊर्जा')
                      : (locale === 'en' ? 'Mixed energy — act with caution' : 'मिश्रित ऊर्जा — सावधानी से कार्य करें')}
                  </div>
                </motion.div>
              )}

              {/* Tamil Yoga */}
              {panchang.tamilYoga && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }}
                  className={`glass-card rounded-xl p-5 border ${panchang.tamilYoga.nature === 'auspicious' ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                  <div className={`text-xs uppercase tracking-wider font-bold mb-2 ${panchang.tamilYoga.nature === 'auspicious' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {locale === 'en' ? 'Tamil Yoga' : 'तमिल योग'}
                  </div>
                  <div className={`font-bold text-lg ${panchang.tamilYoga.nature === 'auspicious' ? 'text-emerald-300' : 'text-red-300'}`} style={headingFont}>
                    {panchang.tamilYoga.name[locale]}
                  </div>
                  <div className="text-text-secondary text-[10px] mt-2">
                    {panchang.tamilYoga.nature === 'auspicious'
                      ? (locale === 'en' ? 'Auspicious — good for important activities' : 'शुभ — महत्वपूर्ण कार्यों के लिए उत्तम')
                      : (locale === 'en' ? 'Inauspicious — avoid new ventures' : 'अशुभ — नए कार्यों से बचें')}
                  </div>
                </motion.div>
              )}

              {/* Homahuti */}
              {panchang.homahuti && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                  className="glass-card rounded-xl p-5 border border-orange-500/20">
                  <div className="text-orange-400 text-xs uppercase tracking-wider font-bold mb-2">
                    {locale === 'en' ? 'Homahuti Direction' : 'होमाहुति दिशा'}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Compass className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-gold-light font-bold text-lg" style={headingFont}>{panchang.homahuti.direction[locale]}</div>
                      <div className="text-text-secondary text-xs">{locale === 'en' ? 'Face this direction for Homa' : 'होम के लिए इस दिशा में मुख करें'}</div>
                    </div>
                  </div>
                  <div className="text-text-tertiary text-[10px] mt-2">
                    {locale === 'en' ? `Presiding deity: ${panchang.homahuti.deity.en}` : `अधिष्ठाता: ${panchang.homahuti.deity.hi}`}
                  </div>
                </motion.div>
              )}

              {/* Mantri Mandala */}
              {panchang.mantriMandala && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }}
                  className="glass-card rounded-xl p-5 border border-gold-primary/20">
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">
                    {locale === 'en' ? 'Mantri Mandala' : 'मंत्री मण्डल'}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary text-xs">{panchang.mantriMandala.king.role[locale]}</span>
                      <span className="text-gold-light font-bold text-sm">{GRAHAS[panchang.mantriMandala.king.planet]?.name[locale]}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary text-xs">{panchang.mantriMandala.minister.role[locale]}</span>
                      <span className="text-gold-light font-bold text-sm">{GRAHAS[panchang.mantriMandala.minister.planet]?.name[locale]}</span>
                    </div>
                  </div>
                  <div className="text-text-tertiary text-[10px] mt-2">
                    {locale === 'en' ? 'Day lord governs as King, sunrise Hora lord serves as Minister' : 'दिन स्वामी राजा, सूर्योदय होरा स्वामी मंत्री'}
                  </div>
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
              title={locale === 'en' ? 'Inauspicious Timings' : 'अशुभ काल'}
              subtitle={locale === 'en'
                ? 'Avoid initiating new activities, journeys, or important decisions during these planetary affliction periods.'
                : 'इन ग्रह पीड़ा काल में नए कार्य, यात्रा या महत्वपूर्ण निर्णय लेने से बचें।'}
              accentClass="text-red-400"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {/* Rahu Kalam */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
                className="glass-card rounded-xl p-6 text-center border border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent">
                <div className="text-red-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('rahuKaal')}</div>
                <div className="font-mono text-2xl font-bold text-red-300">{panchang.rahuKaal.start} — {panchang.rahuKaal.end}</div>
                <div className="text-text-secondary text-xs mt-2">{locale === 'en' ? 'Rahu\'s period — avoid new work' : 'राहु काल — नए कार्य टालें'}</div>
              </motion.div>

              {/* Yamaganda */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 }}
                className="glass-card rounded-xl p-6 text-center border border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent">
                <div className="text-orange-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('yamaganda')}</div>
                <div className="font-mono text-2xl font-bold text-orange-300">{panchang.yamaganda.start} — {panchang.yamaganda.end}</div>
                <div className="text-text-secondary text-xs mt-2">{locale === 'en' ? 'Yama\'s period — inauspicious' : 'यम का काल — अशुभ'}</div>
              </motion.div>

              {/* Gulika Kaal */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.11 }}
                className="glass-card rounded-xl p-6 text-center border border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent">
                <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('gulikaKaal')}</div>
                <div className="font-mono text-2xl font-bold text-yellow-300">{panchang.gulikaKaal.start} — {panchang.gulikaKaal.end}</div>
                <div className="text-text-secondary text-xs mt-2">{locale === 'en' ? 'Gulika\'s period — avoid travel' : 'गुलिक काल — यात्रा टालें'}</div>
              </motion.div>

              {/* Dur Muhurtam */}
              {panchang.durMuhurtam && panchang.durMuhurtam.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.14 }}
                  className="glass-card rounded-xl p-6 text-center border border-red-600/30 bg-gradient-to-br from-red-600/5 to-transparent">
                  <div className="text-red-500 text-xs uppercase tracking-widest mb-2 font-bold">
                    {locale === 'en' ? 'Dur Muhurtam' : 'दुर्मुहूर्त'}
                  </div>
                  {panchang.durMuhurtam.map((w, i) => (
                    <div key={i} className="font-mono text-lg font-bold text-red-400 leading-tight">{w.start} — {w.end}</div>
                  ))}
                  <div className="text-text-secondary text-xs mt-2">{locale === 'en' ? 'Inauspicious — avoid all new work' : 'अशुभ — सभी नए कार्य टालें'}</div>
                </motion.div>
              )}

              {/* Varjyam */}
              {panchang.varjyam && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.17 }}
                  className="glass-card rounded-xl p-6 text-center border border-red-400/25 bg-gradient-to-br from-red-400/5 to-transparent">
                  <div className="text-red-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('varjyam')}</div>
                  <div className="font-mono text-2xl font-bold text-red-300">{panchang.varjyam.start} — {panchang.varjyam.end}</div>
                  <div className="text-text-secondary text-xs mt-2">{t('varjyamDesc')}</div>
                </motion.div>
              )}

              {/* Ganda Moola — pulsing red warning */}
              {panchang.gandaMoola?.active && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.20 }}
                  className="glass-card rounded-xl p-6 text-center border-2 border-red-500/50 bg-gradient-to-br from-red-500/10 to-transparent">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <div className="text-red-400 text-xs uppercase tracking-widest font-bold">
                      {locale === 'en' ? 'Ganda Moola' : 'गण्डमूल'}
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  {panchang.gandaMoola.nakshatra && (
                    <div className="text-red-300 font-bold text-base" style={headingFont}>
                      {panchang.gandaMoola.nakshatra[locale]}
                    </div>
                  )}
                  <div className="text-text-secondary text-xs mt-2">
                    {locale === 'en' ? 'Inauspicious nakshatra junction — exercise caution' : 'अशुभ नक्षत्र संधि — सावधानी बरतें'}
                  </div>
                </motion.div>
              )}

              {/* Panchaka — pulsing purple warning */}
              {panchang.panchaka?.active && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.23 }}
                  className="glass-card rounded-xl p-6 text-center border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    <div className="text-purple-400 text-xs uppercase tracking-widest font-bold">
                      {locale === 'en' ? 'Panchaka' : 'पंचक'}
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                  </div>
                  {panchang.panchaka.type && (
                    <div className="text-purple-300 font-bold text-base" style={headingFont}>
                      {panchang.panchaka.type[locale]}
                    </div>
                  )}
                  <div className="text-text-secondary text-xs mt-2">
                    {locale === 'en' ? 'Five-fold affliction — avoid fire, construction, travel' : 'पंचगुना पीड़ा — अग्नि, निर्माण, यात्रा टालें'}
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
              title={locale === 'en' ? 'Nivas & Shool' : 'निवास एवं शूल'}
              subtitle={locale === 'en'
                ? 'Where cosmic forces reside today — directional afflictions, divine abodes, and their remedies.'
                : 'आज ब्रह्मांडीय शक्तियाँ कहाँ निवास करती हैं — दिशा शूल, दिव्य निवास और उनके उपाय।'}
              accentClass="text-indigo-400"
            />

            <div className="text-center mb-6">
              <Link href="/nivas-shool" className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                {locale === 'en' ? 'Learn about all Nivas & Shool concepts' : 'सभी निवास एवं शूल अवधारणाओं के बारे में जानें'} →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Disha Shool */}
              {panchang.dishaShool && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-xl p-6 border border-orange-500/25 bg-gradient-to-br from-orange-500/5 to-transparent lg:col-span-1">
                  <div className="text-orange-400 text-xs uppercase tracking-widest font-bold mb-3">{t('dishaShool')}</div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-400 text-xl font-bold">
                        {panchang.dishaShool.direction[locale].charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-text-primary font-bold text-lg" style={headingFont}>{panchang.dishaShool.direction[locale]}</div>
                      <div className="text-text-secondary text-xs">{t('dishaShoolDesc')}</div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-orange-500/10">
                    <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold mb-1">{t('remedy')}</div>
                    <div className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{panchang.dishaShool.remedy[locale]}</div>
                  </div>
                </motion.div>
              )}

              {/* Shiva Vaas */}
              {panchang.shivaVaas && (() => {
                const shivaName = panchang.shivaVaas.name?.en || (panchang.shivaVaas as unknown as { en: string }).en || '';
                const nature = panchang.shivaVaas.nature || 'neutral';
                const tithiList = panchang.shivaVaas.tithis || [];
                const shivaDesc: Record<string, { nColor: string; border: string; bg: string; desc: { en: string; hi: string }; activities: { en: string; hi: string } }> = {
                  'Kailash (Mountain)': {
                    nColor: 'text-emerald-300', border: 'border-emerald-500/25', bg: 'from-emerald-500/5',
                    desc: { en: 'Shiva resides in his divine abode atop Kailash with Parvati. He is serene, benevolent, and easily pleased. Best time for Shiva puja, abhishek, and auspicious activities.', hi: 'शिव कैलाश पर पार्वती के साथ हैं। वे शांत, दयालु और प्रसन्न हैं। शिव पूजा, अभिषेक और शुभ कार्यों का सर्वोत्तम समय।' },
                    activities: { en: 'Shiva puja, abhishek, marriage, business launch', hi: 'शिव पूजा, अभिषेक, विवाह, व्यापार आरंभ' },
                  },
                  'Shamshan (Cremation Ground)': {
                    nColor: 'text-red-400', border: 'border-red-500/25', bg: 'from-red-500/5',
                    desc: { en: 'Shiva dwells in the cremation ground in his fierce Rudra/Bhairava form. Auspicious activities should be avoided; Tantric rites may be performed by adepts.', hi: 'शिव श्मशान में रुद्र/भैरव रूप में हैं। शुभ कार्यों से बचें; तांत्रिक अनुष्ठान साधक कर सकते हैं।' },
                    activities: { en: 'Avoid auspicious events; Rudra worship, ancestral rites', hi: 'शुभ कार्य वर्जित; रुद्र पूजा, पित्र कार्य' },
                  },
                  "Gori's Abode (Auspicious)": {
                    nColor: 'text-pink-300', border: 'border-pink-500/25', bg: 'from-pink-500/5',
                    desc: { en: "Shiva visits Parvati's home — domestic bliss and harmony. Good for marriage, family, home, and matters of Venus.", hi: 'शिव पार्वती के घर में हैं — गृहस्थ आनंद। विवाह, परिवार, घर संबंधी कार्यों के लिए शुभ।' },
                    activities: { en: 'Marriage, family rituals, home purchase, Gauri puja', hi: 'विवाह, पारिवारिक अनुष्ठान, गृह क्रय, गौरी पूजा' },
                  },
                  'Sports & Play': {
                    nColor: 'text-amber-300', border: 'border-amber-500/25', bg: 'from-amber-500/5',
                    desc: { en: "Shiva is at cosmic play (Leela) — dancing the Tandava. His attention is divided; mixed results. Arts, music, and dance are well-supported.", hi: 'शिव लीला में हैं — तांडव नृत्य कर रहे हैं। मिश्रित फल। कला, संगीत, नृत्य उत्तम।' },
                    activities: { en: 'Arts, music, dance; avoid critical ventures', hi: 'कला, संगीत, नृत्य; महत्वपूर्ण कार्यों से बचें' },
                  },
                  'Deep Meditation (Samadhi)': {
                    nColor: 'text-violet-300', border: 'border-violet-500/25', bg: 'from-violet-500/5',
                    desc: { en: 'Shiva is in deep Samadhi — beyond the phenomenal world. Sacred for meditation and spiritual practice, but mundane activities may not receive divine support.', hi: 'शिव गहरी समाधि में हैं। ध्यान और आध्यात्मिक साधना के लिए पवित्र, लेकिन सांसारिक कार्यों में कम सहायता।' },
                    activities: { en: 'Meditation, japa, fasting. Avoid worldly ventures.', hi: 'ध्यान, जप, उपवास। सांसारिक कार्यों से बचें।' },
                  },
                };
                const d = shivaDesc[shivaName] || shivaDesc['Kailash (Mountain)'];
                const natureLabel = { auspicious: 'Auspicious', inauspicious: 'Inauspicious', neutral: 'Neutral', mixed: 'Mixed' }[nature] || 'Neutral';
                const natureLabelHi = { auspicious: 'शुभ', inauspicious: 'अशुभ', neutral: 'तटस्थ', mixed: 'मिश्रित' }[nature] || 'तटस्थ';
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                    className={`glass-card rounded-xl p-6 border ${d.border} bg-gradient-to-br ${d.bg} to-transparent`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-indigo-400 text-xs uppercase tracking-widest font-bold">
                        {locale === 'en' ? 'Shiva Vaas' : 'शिव वास'}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.nColor} bg-black/20 border ${d.border}`}>{locale === 'hi' ? natureLabelHi : natureLabel}</span>
                    </div>
                    <div className="text-gold-light font-bold text-xl mb-2" style={headingFont}>{panchang.shivaVaas.name?.[locale] || shivaName}</div>
                    {tithiList.length > 0 && (
                      <div className="text-text-tertiary text-[10px] mb-2">{locale === 'hi' ? 'तिथियाँ' : 'Tithis'}: {tithiList.join(', ')}</div>
                    )}
                    <div className="text-text-secondary text-xs leading-relaxed mb-3">{locale === 'hi' ? d.desc.hi : d.desc.en}</div>
                    <div className={`p-2.5 rounded-lg bg-black/20 border ${d.border}`}>
                      <div className="text-text-tertiary text-[10px] uppercase tracking-wider mb-0.5">{locale === 'hi' ? 'गतिविधियाँ' : 'Activities'}</div>
                      <div className={`text-xs font-medium ${d.nColor}`}>{locale === 'hi' ? d.activities.hi : d.activities.en}</div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Agni Vaas */}
              {panchang.agniVaas && (() => {
                const agniName = panchang.agniVaas.name?.en || (panchang.agniVaas as unknown as { en: string }).en || '';
                const nature = panchang.agniVaas.nature || 'neutral';
                const validUntil = panchang.agniVaas.validUntil;
                const agniDesc: Record<string, { nColor: string; border: string; bg: string; desc: { en: string; hi: string }; ritualNote: { en: string; hi: string } }> = {
                  'Sky (Akasha)': {
                    nColor: 'text-sky-300', border: 'border-sky-500/25', bg: 'from-sky-500/5',
                    desc: { en: 'Agni resides in the celestial sky. Fire rituals are carried directly to the devatas.', hi: 'अग्नि आकाश में हैं। अग्नि अनुष्ठान सीधे देवताओं तक पहुँचते हैं।' },
                    ritualNote: { en: 'Homa & Yajna highly effective — offerings rise unimpeded', hi: 'होम और यज्ञ अत्यंत प्रभावी — आहुतियाँ बाधारहित ऊर्ध्वगामी' },
                  },
                  'Earth (Bhumi)': {
                    nColor: 'text-emerald-300', border: 'border-emerald-500/25', bg: 'from-emerald-500/5',
                    desc: { en: 'Agni is grounded in the earth plane. Fire rituals nourish the land and people.', hi: 'अग्नि पृथ्वी पर हैं। अग्नि अनुष्ठान भूमि और लोगों को पोषित करते हैं।' },
                    ritualNote: { en: 'Agriculture blessings, prosperity rituals, Griha Pravesh powerful', hi: 'कृषि, समृद्धि, गृह प्रवेश अग्नि कार्य विशेष प्रभावी' },
                  },
                  'Patala': {
                    nColor: 'text-red-400', border: 'border-red-500/25', bg: 'from-red-500/5',
                    desc: { en: 'Agni descends to the netherworld. Fire rituals may have reversed or weakened effects.', hi: 'अग्नि पाताल में हैं। अग्नि अनुष्ठानों के उलटे या कमजोर प्रभाव।' },
                    ritualNote: { en: 'Major Yajnas should be postponed. Simple Deepa worship permitted.', hi: 'बड़े यज्ञ स्थगित करें। साधारण दीप पूजा कर सकते हैं।' },
                  },
                  'Water (Jal)': {
                    nColor: 'text-blue-300', border: 'border-blue-500/25', bg: 'from-blue-500/5',
                    desc: { en: 'Agni is submerged in water — the Vadavagni (submarine fire of Hindu cosmology).', hi: 'अग्नि जल में हैं — वडवाग्नि (हिंदू ब्रह्माण्ड की समुद्री अग्नि)।' },
                    ritualNote: { en: 'Rituals combining fire + water (abhishek after homa) uniquely powerful', hi: 'अग्नि + जल संयुक्त अनुष्ठान (होम बाद अभिषेक) विशेष शक्तिशाली' },
                  },
                };
                const d = agniDesc[agniName] || agniDesc['Sky (Akasha)'];
                const natureLabel = { auspicious: 'Auspicious', inauspicious: 'Inauspicious', neutral: 'Neutral', mixed: 'Mixed' }[nature] || 'Neutral';
                const natureLabelHi = { auspicious: 'शुभ', inauspicious: 'अशुभ', neutral: 'तटस्थ', mixed: 'मिश्रित' }[nature] || 'तटस्थ';
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                    className={`glass-card rounded-xl p-6 border ${d.border} bg-gradient-to-br ${d.bg} to-transparent`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-red-400 text-xs uppercase tracking-widest font-bold">
                        {locale === 'en' ? 'Agni Vaas' : 'अग्नि वास'}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.nColor} bg-black/20 border ${d.border}`}>{locale === 'hi' ? natureLabelHi : natureLabel}</span>
                    </div>
                    <div className="text-gold-light font-bold text-xl mb-1" style={headingFont}>{panchang.agniVaas.name?.[locale] || agniName}</div>
                    {validUntil && (
                      <div className={`text-xs font-medium ${d.nColor} mb-2`}>
                        {locale === 'hi' ? `${validUntil} तक` : `Until ${validUntil}`}
                      </div>
                    )}
                    <div className="text-text-secondary text-xs leading-relaxed mb-3">{locale === 'hi' ? d.desc.hi : d.desc.en}</div>
                    <div className={`p-2.5 rounded-lg bg-black/20 border ${d.border}`}>
                      <div className="text-text-tertiary text-[10px] uppercase tracking-wider mb-0.5">{locale === 'hi' ? 'अग्नि कर्म प्रभाव' : 'Fire Ritual Impact'}</div>
                      <div className={`text-xs font-medium ${d.nColor}`}>{locale === 'hi' ? d.ritualNote.hi : d.ritualNote.en}</div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Chandra Vaas */}
              {panchang.chandraVaas && (() => {
                const chandraName = panchang.chandraVaas.name?.en || (panchang.chandraVaas as unknown as { en: string }).en || '';
                const direction = panchang.chandraVaas.direction;
                const nature = panchang.chandraVaas.nature || 'neutral';
                const chandraDesc: Record<string, { nColor: string; border: string; bg: string; desc: { en: string; hi: string }; activities: { en: string; hi: string } }> = {
                  "Brahma's Abode": {
                    nColor: 'text-gold-light', border: 'border-gold-primary/25', bg: 'from-gold-primary/5',
                    desc: { en: 'Moon faces East in Deva (celestial) abode. Divine energy flows freely — prayers answered with ease. Most auspicious pada for sacred activities.', hi: 'चंद्रमा पूर्व दिशा में देव निवास में हैं। दिव्य ऊर्जा स्वतंत्र प्रवाहित। प्रार्थनाएं सुनी जाती हैं — सर्वोत्तम शुभ पाद।' },
                    activities: { en: 'All auspicious work, puja, sacred ceremonies', hi: 'सभी शुभ कार्य, पूजा, पवित्र समारोह' },
                  },
                  "Indra's Abode": {
                    nColor: 'text-blue-300', border: 'border-blue-500/25', bg: 'from-blue-500/5',
                    desc: { en: 'Moon faces South in Nara (human) abode — ordinary activity plane. Results are as expected, neither elevated nor hindered.', hi: 'चंद्रमा दक्षिण दिशा में मानव निवास में हैं। परिणाम सामान्य — न उन्नत, न बाधित।' },
                    activities: { en: 'Daily work, business, social activities', hi: 'दैनिक कार्य, व्यापार, सामाजिक गतिविधियाँ' },
                  },
                  "Yama's Abode": {
                    nColor: 'text-amber-400', border: 'border-amber-500/25', bg: 'from-amber-500/5',
                    desc: { en: 'Moon faces West in Pashava (animal) abode — instinctual, reactive energy. Actions driven by impulse. Avoid important decisions.', hi: 'चंद्रमा पश्चिम दिशा में पशव निवास में हैं — सहज, प्रतिक्रियाशील ऊर्जा। महत्वपूर्ण निर्णयों से बचें।' },
                    activities: { en: 'Physical labor, farming; avoid important decisions', hi: 'शारीरिक श्रम, खेती; महत्वपूर्ण निर्णयों से बचें' },
                  },
                  "Soma's Abode": {
                    nColor: 'text-red-400', border: 'border-red-500/25', bg: 'from-red-500/5',
                    desc: { en: 'Moon faces North in Rakshasa (demonic) abode — turbulent, obstructive energy. Activities face opposition or hidden obstacles.', hi: 'चंद्रमा उत्तर दिशा में राक्षस निवास में हैं — अशांत, अवरोधक ऊर्जा। विरोध या छिपी बाधाएं।' },
                    activities: { en: 'Avoid sacred activities; protective rites permitted', hi: 'पवित्र गतिविधियों से बचें; सुरक्षात्मक अनुष्ठान संभव' },
                  },
                };
                const d = chandraDesc[chandraName] || chandraDesc["Brahma's Abode"];
                const natureLabel = { auspicious: 'Auspicious', inauspicious: 'Inauspicious', neutral: 'Neutral', mixed: 'Mixed' }[nature] || 'Neutral';
                const natureLabelHi = { auspicious: 'शुभ', inauspicious: 'अशुभ', neutral: 'तटस्थ', mixed: 'मिश्रित' }[nature] || 'तटस्थ';
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
                    className={`glass-card rounded-xl p-6 border ${d.border} bg-gradient-to-br ${d.bg} to-transparent`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-blue-400 text-xs uppercase tracking-widest font-bold">
                        {locale === 'en' ? 'Chandra Vaas' : 'चन्द्र वास'}
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.nColor} bg-black/20 border ${d.border}`}>{locale === 'hi' ? natureLabelHi : natureLabel}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-gold-light font-bold text-xl" style={headingFont}>{panchang.chandraVaas.name?.[locale] || chandraName}</div>
                      {direction && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/20 border border-blue-500/20">
                          <Compass className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-300 text-xs font-bold">{direction[locale]}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-text-secondary text-xs leading-relaxed mb-3">{locale === 'hi' ? d.desc.hi : d.desc.en}</div>
                    <div className={`p-2.5 rounded-lg bg-black/20 border ${d.border}`}>
                      <div className="text-text-tertiary text-[10px] uppercase tracking-wider mb-0.5">{locale === 'hi' ? 'गतिविधियाँ' : 'Activities'}</div>
                      <div className={`text-xs font-medium ${d.nColor}`}>{locale === 'hi' ? d.activities.hi : d.activities.en}</div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Rahu Vaas */}
              {panchang.rahuVaas && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="glass-card rounded-xl p-6 border border-purple-500/25 bg-gradient-to-br from-purple-500/5 to-transparent">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-purple-400 text-xs uppercase tracking-widest font-bold">
                      {locale === 'en' ? 'Rahu Vaas' : 'राहु वास'}
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full text-red-400 bg-black/20 border border-red-500/25">{locale === 'hi' ? 'अशुभ दिशा' : 'Avoid'}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Compass className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-gold-light font-bold text-xl" style={headingFont}>{panchang.rahuVaas.direction[locale]}</div>
                      <div className="text-text-tertiary text-xs">{locale === 'hi' ? 'राहु मुख दिशा' : "Rahu's facing direction"}</div>
                    </div>
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed mb-3">
                    {locale === 'hi'
                      ? 'राहु (छाया ग्रह) आज इस दिशा की ओर मुख किए हुए है। इस दिशा में भूमि खरीद, नींव खुदाई और दीर्घकालिक निर्माण कार्य से बचें। यात्रा में भी सावधानी बरतें।'
                      : "Rahu (shadow planet) faces this direction today. Avoid land purchase, foundation laying, and long-term construction in this direction. Exercise caution for travel as well."}
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/20 border border-purple-500/20">
                    <div className="text-text-tertiary text-[10px] uppercase tracking-wider mb-0.5">{locale === 'hi' ? 'सुझाव' : 'Guidance'}</div>
                    <div className="text-xs font-medium text-purple-300">
                      {locale === 'hi'
                        ? 'इस दिशा में नया कार्य आरंभ न करें। रक्षात्मक मंत्र और हनुमान स्मरण लाभदायक।'
                        : 'Do not initiate new ventures in this direction. Protective mantras and Hanuman invocation are beneficial.'}
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
              title={locale === 'en' ? 'Calendars & Epoch' : 'पंचांग एवं युग'}
              subtitle={locale === 'en'
                ? 'The Hindu calendar system — lunar months, seasons, cosmic cycles, and our position in deep time.'
                : 'हिन्दू पञ्चाङ्ग प्रणाली — चंद्र मास, ऋतु, ब्रह्मांडीय चक्र और काल में हमारी स्थिति।'}
            />

            {/* Hindu Calendar subsection */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
                <MasaIcon size={28} />
                <span>{locale === 'en' ? 'Hindu Calendar' : 'हिन्दू पञ्चाङ्ग'}</span>
              </h3>
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-gold-primary/10">
                  {([
                    { label: locale === 'en' ? 'Vikram Samvat' : 'विक्रम संवत्', value: panchang.vikramSamvat?.toString() || '—', iconKey: null },
                    { label: locale === 'en' ? 'Shaka Samvat' : 'शक संवत्', value: panchang.shakaSamvat?.toString() || '—', iconKey: null },
                    { label: t('samvatsara'), value: panchang.samvatsara[locale], iconKey: 'samvatsara' as const },
                    { label: locale === 'en' ? 'Masa (Purnimant)' : 'मास (पूर्णिमान्त)', value: (panchang.purnimantMasa || panchang.masa)[locale], iconKey: 'masa' as const },
                    { label: locale === 'en' ? 'Masa (Amant)' : 'मास (अमान्त)', value: (panchang.amantMasa || panchang.masa)[locale], iconKey: 'masa' as const },
                    { label: locale === 'en' ? 'Paksha' : 'पक्ष', value: panchang.tithi.paksha === 'shukla' ? (locale === 'en' ? 'Shukla Paksha' : 'शुक्ल पक्ष') : (locale === 'en' ? 'Krishna Paksha' : 'कृष्ण पक्ष'), iconKey: null },
                    { label: t('ritu'), value: panchang.ritu[locale], iconKey: 'ritu' as const },
                    { label: t('ayana'), value: panchang.ayana[locale], iconKey: 'ayana' as const },
                    { label: locale === 'en' ? 'Ayanamsha (Lahiri)' : 'अयनांश (लाहिरी)', value: panchang.ayanamsha ? `${panchang.ayanamsha.toFixed(4)}°` : '—', iconKey: null },
                    { label: locale === 'en' ? 'Day Duration' : 'दिनमान', value: panchang.dinamana || '—', iconKey: null },
                    { label: locale === 'en' ? 'Night Duration' : 'रात्रिमान', value: panchang.ratrimana || '—', iconKey: null },
                    { label: locale === 'en' ? 'Madhyahna' : 'मध्याह्न', value: panchang.madhyahna || '—', iconKey: null },
                  ] as { label: string; value: string; iconKey: 'masa' | 'samvatsara' | 'ritu' | 'ayana' | null }[]).map((item, i) => {
                    const IconMap = { masa: MasaIcon, samvatsara: SamvatsaraIcon, ritu: RituIcon, ayana: AyanaIcon };
                    const IconComp = item.iconKey ? IconMap[item.iconKey] : null;
                    return (
                      <motion.div key={item.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.04 }}
                        className="p-5 text-center">
                        {IconComp && <div className="flex justify-center mb-2"><IconComp size={32} /></div>}
                        <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold">{item.label}</div>
                        <div className="text-gold-light font-bold text-base mt-1" style={headingFont}>{item.value}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Epoch & Cosmic Time subsection */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
                <Star className="w-6 h-6 text-gold-primary" />
                <span>{locale === 'en' ? 'Epoch & Cosmic Time' : 'युगीय काल'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Kali Ahargana — big number */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="glass-card rounded-xl p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
                  <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-1">
                    {locale === 'en' ? 'Kali Ahargana' : 'कलि अहर्गण'}
                  </div>
                  <div className="text-gold-light font-bold text-3xl font-mono mt-1">
                    {panchang.kaliAhargana?.toLocaleString() || '—'}
                  </div>
                  <div className="text-text-secondary text-xs mt-2">
                    {locale === 'en' ? 'Days elapsed since Kali Yuga began (Feb 18, 3102 BCE)' : 'कलियुग आरम्भ (18 फरवरी 3102 ईसापूर्व) से बीते दिन'}
                  </div>
                </motion.div>

                {/* Kaliyuga Year */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                  className="glass-card rounded-xl p-6 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
                  <div className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-1">
                    {locale === 'en' ? 'Kaliyuga Year' : 'कलियुग वर्ष'}
                  </div>
                  <div className="text-amber-300 font-bold text-3xl font-mono mt-1">
                    {panchang.kaliyugaYear?.toLocaleString() || '—'}
                  </div>
                  <div className="text-text-secondary text-xs mt-2">
                    {locale === 'en' ? 'Current year in the Kali Yuga cycle (432,000 years total)' : 'कलियुग चक्र में वर्तमान वर्ष (कुल 4,32,000 वर्ष)'}
                  </div>
                </motion.div>

                {/* Julian Day */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                  className="glass-card rounded-xl p-6 border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent">
                  <div className="text-indigo-400 text-xs uppercase tracking-widest font-bold mb-1">
                    {locale === 'en' ? 'Julian Day Number' : 'जूलियन दिन संख्या'}
                  </div>
                  <div className="text-indigo-300 font-bold text-3xl font-mono mt-1">
                    {panchang.julianDay?.toLocaleString() || '—'}
                  </div>
                  <div className="text-text-secondary text-xs mt-2">
                    {locale === 'en' ? 'Astronomical day count from Jan 1, 4713 BCE noon' : 'खगोलशास्त्रीय दिन गणना — 4713 ईसापूर्व 1 जनवरी मध्याह्न से'}
                  </div>
                </motion.div>
              </div>

              {/* Current Yuga info card */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                className="mt-5 glass-card rounded-xl p-6 border border-gold-primary/15 bg-gradient-to-r from-gold-primary/5 via-indigo-500/3 to-gold-primary/5">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="text-gold-primary text-xs uppercase tracking-widest font-bold mb-2">
                      {locale === 'en' ? 'Current Yuga: Kali Yuga' : 'वर्तमान युग: कलि युग'}
                    </div>
                    <div className="text-text-secondary text-sm leading-relaxed">
                      {locale === 'en'
                        ? 'We are in the 4th and final Yuga of the current Mahayuga cycle. Kali Yuga began 3102 BCE (Feb 18) and spans 432,000 years. We are approximately 5,126 years in — only 1.2% complete.'
                        : 'हम वर्तमान महायुग चक्र के चौथे और अंतिम युग में हैं। कलियुग 3102 ईसापूर्व (18 फरवरी) से प्रारम्भ हुआ और 4,32,000 वर्ष तक चलेगा। लगभग 5,126 वर्ष बीत चुके हैं — केवल 1.2% पूर्ण।'}
                    </div>
                  </div>
                  <div className="flex-1">
                    {/* Yuga progress bar */}
                    <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold mb-3">
                      {locale === 'en' ? 'Kali Yuga Progress' : 'कलियुग प्रगति'}
                    </div>
                    <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden border border-gold-primary/10 mb-2">
                      <div className="h-full bg-gradient-to-r from-gold-primary/60 to-amber-400/60 rounded-full"
                        style={{ width: `${(5126 / 432000) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-text-secondary font-mono">
                      <span>{locale === 'en' ? '3102 BCE' : '3102 ईसापूर्व'}</span>
                      <span className="text-gold-primary">~1.2%</span>
                      <span>{locale === 'en' ? '+426,874 yrs' : '+4,26,874 वर्ष'}</span>
                    </div>
                  </div>
                </div>

                {/* Yuga timeline row */}
                <div className="mt-5 pt-5 border-t border-gold-primary/10">
                  <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold mb-3">
                    {locale === 'en' ? 'Mahayuga Timeline (4,320,000 years)' : 'महायुग समयरेखा (43,20,000 वर्ष)'}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {[
                      { name: locale === 'en' ? 'Satya Yuga' : 'सत्य युग', years: '1,728,000y', pct: 40, color: 'bg-emerald-500/40 border-emerald-500/30 text-emerald-300' },
                      { name: locale === 'en' ? 'Treta Yuga' : 'त्रेता युग', years: '1,296,000y', pct: 30, color: 'bg-gold-primary/30 border-gold-primary/40 text-gold-light' },
                      { name: locale === 'en' ? 'Dvapara Yuga' : 'द्वापर युग', years: '864,000y', pct: 20, color: 'bg-blue-500/30 border-blue-500/30 text-blue-300' },
                      { name: locale === 'en' ? 'Kali Yuga' : 'कलि युग', years: '432,000y', pct: 10, color: 'bg-red-500/30 border-red-500/40 text-red-300 ring-1 ring-red-400/50' },
                    ].map((y) => (
                      <div key={y.name} className={`rounded-lg px-3 py-2 border text-center flex-1 min-w-[120px] ${y.color}`}>
                        <div className="font-bold text-xs" style={headingFont}>{y.name}</div>
                        <div className="text-[10px] opacity-70 font-mono">{y.years}</div>
                        <div className="text-[10px] opacity-50">{y.pct}% of Mahayuga</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-text-secondary/50 text-[10px] mt-2 text-center font-mono">
                    {locale === 'en' ? 'Kalpa = 1,000 Mahayugas = 4.32 billion years (one Day of Brahma)' : 'कल्प = 1,000 महायुग = 4.32 अरब वर्ष (ब्रह्मा का एक दिन)'}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <GoldDivider />

          {/* ═══ CHOGHADIYA ═══ */}
          {panchang.choghadiya && panchang.choghadiya.length > 0 && (
            <div className="my-14">
              <h2 className="text-3xl font-bold text-gold-gradient mb-2 text-center" style={headingFont}>
                {t('choghadiya')}
              </h2>
              <p className="text-text-secondary text-sm text-center mb-8">{t('choghadiyaDesc')}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Day Choghadiya */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sun className="w-5 h-5 text-gold-primary" />
                    <h3 className="text-lg font-bold text-gold-light" style={headingFont}>{t('dayChoghadiya')}</h3>
                  </div>
                  <div className="space-y-2">
                    {panchang.choghadiya.filter(s => s.period === 'day').map((slot, i) => (
                      <motion.div
                        key={`day-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`rounded-lg p-3 border flex items-center justify-between ${
                          slot.nature === 'auspicious' ? 'bg-emerald-500/5 border-emerald-500/20' :
                          slot.nature === 'inauspicious' ? 'bg-red-500/5 border-red-500/20' :
                          'bg-amber-500/5 border-amber-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${
                            slot.nature === 'auspicious' ? 'bg-emerald-400' :
                            slot.nature === 'inauspicious' ? 'bg-red-400' : 'bg-amber-400'
                          }`} />
                          <span className="text-gold-light font-bold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                            {slot.name[locale]}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-text-secondary">{slot.startTime} — {slot.endTime}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Night Choghadiya */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Moon className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-indigo-300/80" style={headingFont}>{t('nightChoghadiya')}</h3>
                  </div>
                  <div className="space-y-2">
                    {panchang.choghadiya.filter(s => s.period === 'night').map((slot, i) => (
                      <motion.div
                        key={`night-${i}`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`rounded-lg p-3 border flex items-center justify-between ${
                          slot.nature === 'auspicious' ? 'bg-emerald-500/5 border-emerald-500/20' :
                          slot.nature === 'inauspicious' ? 'bg-red-500/5 border-red-500/20' :
                          'bg-amber-500/5 border-amber-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${
                            slot.nature === 'auspicious' ? 'bg-emerald-400' :
                            slot.nature === 'inauspicious' ? 'bg-red-400' : 'bg-amber-400'
                          }`} />
                          <span className="text-gold-light font-bold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                            {slot.name[locale]}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-text-secondary">{slot.startTime} — {slot.endTime}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <GoldDivider />

          {/* ═══ HORA (PLANETARY HOURS) ═══ */}
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
                      {slot.planet[locale]}
                    </div>
                    <div className="font-mono text-[10px] text-text-secondary mt-1">{slot.startTime}—{slot.endTime}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <GoldDivider />

          {/* ═══ DAILY MUHURTA TIMELINE ═══ */}
          <div className="my-14">
            <h2 className="text-3xl font-bold text-gold-gradient mb-3 text-center" style={headingFont}>
              {locale === 'en' ? "Today's Muhurtas" : 'आज के मुहूर्त'}
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
                  {locale === 'en' ? 'Daytime Muhurtas' : 'दिवा मुहूर्त'}
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
                              {m.name[locale]}
                            </span>
                            {isAbhijit && <span className="ml-2 px-2 py-0.5 bg-gold-primary/30 text-gold-light text-[10px] rounded-full font-bold uppercase">Abhijit</span>}
                            {isCurrent && <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full font-bold animate-pulse">{locale === 'en' ? 'NOW' : 'अभी'}</span>}
                            {info && <span className="ml-2 text-text-secondary/50 text-xs">{info.deity[locale]}</span>}
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
                          <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{info.significance[locale]}</p>
                          <p className="text-gold-primary/60 text-xs mt-1.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                            <span className="font-semibold">{locale === 'en' ? 'Best for:' : 'सर्वोत्तम:'}</span> {info.bestFor[locale]}
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
                  {locale === 'en' ? 'Nighttime Muhurtas' : 'रात्रि मुहूर्त'}
                </h3>
                <span className="text-text-secondary text-xs">({panchang.sunset} — {locale === 'en' ? 'next sunrise' : 'अगला सूर्योदय'})</span>
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
                                <span className="text-gold-light font-bold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{m.name[locale]}</span>
                                {isBrahma && <span className="ml-2 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] rounded-full font-bold">{locale === 'en' ? 'BRAHMA MUHURTA' : 'ब्राह्म मुहूर्त'}</span>}
                                {info && <span className="ml-2 text-text-secondary/50 text-xs">{info.deity[locale]}</span>}
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
                              <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{info.significance[locale]}</p>
                              <p className="text-gold-primary/60 text-xs mt-1.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                <span className="font-semibold">{locale === 'en' ? 'Best for:' : 'सर्वोत्तम:'}</span> {info.bestFor[locale]}
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
                  className="glass-card rounded-xl p-5 text-center border border-amber-500/15">
                  <div className="flex justify-center mb-2"><RashiIconById id={panchang.sunSign?.rashi || sunPlanet?.rashi || 1} size={48} /></div>
                  <div className="text-amber-400 text-xs uppercase tracking-wider font-bold">{locale === 'en' ? 'Sun Sign' : 'सूर्य राशि'}</div>
                  <div className="text-gold-light font-bold text-lg mt-1" style={headingFont}>{sunRashiData?.name[locale]}</div>
                  <div className="text-text-secondary text-[10px] mt-1">{sunNakData?.name[locale]}</div>
                </motion.div>

                {/* Moon Sign */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                  className="glass-card rounded-xl p-5 text-center border border-indigo-500/15">
                  <div className="flex justify-center mb-2"><RashiIconById id={panchang.moonSign?.rashi || moonPlanet?.rashi || 1} size={48} /></div>
                  <div className="text-indigo-400 text-xs uppercase tracking-wider font-bold">{locale === 'en' ? 'Moon Sign' : 'चन्द्र राशि'}</div>
                  <div className="text-gold-light font-bold text-lg mt-1" style={headingFont}>{moonRashiData?.name[locale]}</div>
                  <div className="text-text-secondary text-[10px] mt-1">
                    {moonNakData?.name[locale]}
                    {panchang.moonSign?.pada ? ` · ${locale === 'en' ? 'Pada' : 'पाद'} ${panchang.moonSign.pada}` : ''}
                  </div>
                </motion.div>

                {/* Dinamana / Ratrimana */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
                  className="glass-card rounded-xl p-5 text-center">
                  <div className="flex justify-center mb-2"><Sun className="w-10 h-10 text-gold-primary" /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{locale === 'en' ? 'Day Duration' : 'दिनमान'}</div>
                  <div className="text-gold-light font-bold text-lg font-mono mt-1">{panchang.dinamana || '—'}</div>
                  <div className="text-text-secondary text-[10px] mt-1.5 uppercase tracking-wider">{locale === 'en' ? 'Night' : 'रात्रिमान'}: <span className="font-mono text-text-primary">{panchang.ratrimana || '—'}</span></div>
                </motion.div>

                {/* Madhyahna */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
                  className="glass-card rounded-xl p-5 text-center">
                  <div className="flex justify-center mb-2"><Clock className="w-10 h-10 text-gold-primary" /></div>
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{locale === 'en' ? 'Madhyahna' : 'मध्याह्न'}</div>
                  <div className="text-gold-light font-bold text-2xl font-mono mt-1">{panchang.madhyahna || '—'}</div>
                  <div className="text-text-secondary text-[10px] mt-1">{locale === 'en' ? 'Local Midday' : 'स्थानीय दोपहर'}</div>
                </motion.div>
              </div>
            );
          })()}

          {/* ═══ UDAYA LAGNA ═══ */}
          {panchang.udayaLagna && panchang.udayaLagna.length > 0 && (
            <div className="my-10">
              <h3 className="text-lg font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
                <Star className="w-5 h-5 text-gold-primary" />
                <span>{locale === 'en' ? 'Udaya Lagna — Rising Signs' : 'उदय लग्न — उदित राशियाँ'}</span>
              </h3>
              <p className="text-text-secondary text-xs mb-4 max-w-2xl">
                {locale === 'en'
                  ? 'The zodiac sign rising on the eastern horizon changes approximately every 2 hours. Each rising window carries the energy of that sign for muhurta selection.'
                  : 'पूर्वी क्षितिज पर उदित राशि लगभग हर 2 घंटे में बदलती है। प्रत्येक उदय खिड़की मुहूर्त चयन के लिए उस राशि की ऊर्जा वहन करती है।'}
              </p>
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 divide-x divide-y divide-gold-primary/10">
                  {panchang.udayaLagna.map((lagna, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.02 * i }}
                      className="p-3 text-center hover:bg-gold-primary/5 transition-colors">
                      <div className="flex justify-center mb-1.5">
                        <RashiIconById id={lagna.rashi} size={28} />
                      </div>
                      <div className="text-gold-light text-sm font-bold" style={headingFont}>{lagna.name[locale]}</div>
                      <div className="text-text-secondary text-xs font-mono mt-1">{lagna.start} – {lagna.end}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <GoldDivider />

          {/* ═══ CHANDRABALAM & TARABALAM ═══ */}
          <div className="my-14">
            <h2 className="text-3xl font-bold text-gold-gradient mb-2 text-center" style={headingFont}>
              {locale === 'en' ? 'Chandrabalam & Tarabalam' : 'चन्द्रबल एवं ताराबल'}
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
            <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6">
              {birthAutoDetected && (
                <div className="flex items-center justify-center gap-2 mb-4 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 text-xs font-medium">
                    {locale === 'en' ? 'Birth data loaded from your Kundali' : 'कुण्डली से जन्म डेटा लोड हुआ'}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">
                    {locale === 'en' ? 'Birth Nakshatra' : 'जन्म नक्षत्र'}
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
                    <option value={0}>{locale === 'en' ? 'Select...' : 'चुनें...'}</option>
                    {NAKSHATRAS.map((n) => (
                      <option key={n.id} value={n.id}>{n.name[locale]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">
                    {locale === 'en' ? 'Birth Rashi (Moon)' : 'जन्म राशि (चन्द्र)'}
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
                    <option value={0}>{locale === 'en' ? 'Select...' : 'चुनें...'}</option>
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
                        {locale === 'en' ? 'Chandrabalam' : 'चन्द्रबल'}
                      </div>
                      <div className={`text-2xl font-bold ${
                        balamResult.chandrabalam.favorable ? 'text-emerald-300' : 'text-red-300'
                      }`}>
                        {balamResult.chandrabalam.favorable
                          ? (locale === 'en' ? 'Strong' : 'बलवान्')
                          : (locale === 'en' ? 'Weak' : 'दुर्बल')}
                      </div>
                      <div className="text-text-secondary text-[10px] mt-2">
                        {locale === 'en' ? `Moon in ${balamResult.chandrabalam.house}${['st','nd','rd'][balamResult.chandrabalam.house-1] || 'th'} house` : `चन्द्र ${balamResult.chandrabalam.house}वें भाव में`}
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
                        {locale === 'en' ? 'Tarabalam' : 'ताराबल'}
                      </div>
                      <div className={`text-2xl font-bold ${
                        balamResult.tarabalam.favorable ? 'text-emerald-300' : 'text-red-300'
                      }`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                        {balamResult.tarabalam.taraName[locale]}
                      </div>
                      <div className="text-text-secondary text-[10px] mt-2">
                        {locale === 'en' ? `Tara #${balamResult.tarabalam.tara}` : `तारा #${balamResult.tarabalam.tara}`}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <GoldDivider />

          {/* ═══ PLANETARY POSITIONS ═══ */}
          <div className="my-14">
            <h2 className="text-3xl font-bold text-gold-gradient mb-8 text-center" style={headingFont}>
              {t('planetaryPositions')}
            </h2>
            <div className="glass-card rounded-2xl overflow-hidden">
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
                            {planet.isRetrograde ? <span className="text-red-400 font-bold text-lg">R</span> : <span className="text-text-secondary/30">—</span>}
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

      {/* ═══ DEEP DIVE LINKS — BIG ICONS ═══ */}
      <div className="my-14">
        <h2 className="text-3xl font-bold text-gold-gradient mb-10 text-center" style={headingFont}>
          {locale === 'en' ? 'Explore the Elements' : locale === 'hi' ? 'तत्वों का अन्वेषण करें' : 'तत्त्वानाम् अन्वेषणम्'}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
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
                className="glass-card rounded-2xl p-5 text-center hover:border-gold-primary/50 transition-all group block"
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
    </div>
  );
}
