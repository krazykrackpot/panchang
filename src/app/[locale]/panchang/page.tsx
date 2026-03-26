'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { MapPin, Loader2, Search, Clock, Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { TithiIcon, NakshatraIcon, YogaIcon, KaranaIcon, VaraIcon, MuhurtaIcon, GrahanIcon, RashiIcon, MasaIcon, SamvatsaraIcon, SunriseIcon, SunsetIcon, MoonriseIcon, RituIcon, AyanaIcon } from '@/components/icons/PanchangIcons';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import type { PanchangData, Locale, Muhurta, TransitionInfo, BalamResult } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { TITHIS } from '@/lib/constants/tithis';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { MUHURTA_DATA } from '@/lib/constants/muhurtas';
import { computeBalam } from '@/lib/panchang/balam';

// ──────────────────────────────────────────────────────────────
// Check if a transition endTime (HH:MM) has already passed today
// ──────────────────────────────────────────────────────────────
function hasTransitionPassed(
  endTime: string,
  now: Date,
  selectedDate: string,
  tz: number
): boolean {
  // Only apply real-time adjustment for today's date
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  if (selectedDate !== todayStr) return false;

  const [hh, mm] = endTime.split(':').map(Number);
  const endMinutes = hh * 60 + mm;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= endMinutes;
}

interface LocationData {
  lat: number;
  lng: number;
  name: string;
  tz: number;
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
  const [expandedMuhurta, setExpandedMuhurta] = useState<number | null>(null);
  const [showAllMuhurtas, setShowAllMuhurtas] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMuhurtaIdx, setCurrentMuhurtaIdx] = useState(-1);
  const [birthNakshatra, setBirthNakshatra] = useState(0);
  const [birthRashi, setBirthRashi] = useState(0);
  const [balamResult, setBalamResult] = useState<BalamResult | null>(null);
  const [now, setNow] = useState<Date>(new Date());

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

  // Compute balam when birth data changes
  useEffect(() => {
    if (birthNakshatra && birthRashi && panchang) {
      const todayNakshatra = panchang.nakshatra.id;
      // Get today's Moon rashi from planets array (Moon = id 1)
      const moonPlanet = panchang.planets.find(p => p.id === 1);
      const todayMoonRashi = moonPlanet?.rashi || 1;
      setBalamResult(computeBalam(birthNakshatra, birthRashi, todayNakshatra, todayMoonRashi));
    } else {
      setBalamResult(null);
    }
  }, [birthNakshatra, birthRashi, panchang]);

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
          </div>

          {/* ═══ FIVE ELEMENTS — BIG & BOLD ═══ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 mb-14">
            {(() => {
              // Resolve currently-active values by checking if transitions have passed
              const tp = (tr?: TransitionInfo) => tr ? hasTransitionPassed(tr.endTime, now, selectedDate, location.tz) : false;

              const tithiPassed = tp(panchang.tithiTransition);
              const nextTithi = tithiPassed && panchang.tithiTransition ? TITHIS[panchang.tithiTransition.nextNumber - 1] : null;

              const nakPassed = tp(panchang.nakshatraTransition);
              const nextNak = nakPassed && panchang.nakshatraTransition ? NAKSHATRAS[panchang.nakshatraTransition.nextNumber - 1] : null;

              const yogaPassed = tp(panchang.yogaTransition);
              const nextYoga = yogaPassed && panchang.yogaTransition ? YOGAS[panchang.yogaTransition.nextNumber - 1] : null;

              const karanaPassed = tp(panchang.karanaTransition);
              const nextKarana = karanaPassed && panchang.karanaTransition ? KARANAS[panchang.karanaTransition.nextNumber - 1] : null;

              return [
                { label: t('tithi'), value: nextTithi ? nextTithi.name[locale] : panchang.tithi.name[locale], sub: nextTithi ? (nextTithi.paksha === 'shukla' ? t('shukla') : t('krishna')) : (panchang.tithi.paksha === 'shukla' ? t('shukla') : t('krishna')), Icon: TithiIcon, transition: tithiPassed ? undefined : panchang.tithiTransition },
                { label: t('nakshatra'), value: nextNak ? nextNak.name[locale] : panchang.nakshatra.name[locale], sub: nextNak ? nextNak.deity[locale] : panchang.nakshatra.deity[locale], Icon: NakshatraIcon, transition: nakPassed ? undefined : panchang.nakshatraTransition },
                { label: t('yoga'), value: nextYoga ? nextYoga.name[locale] : panchang.yoga.name[locale], sub: nextYoga ? nextYoga.meaning[locale] : panchang.yoga.meaning[locale], Icon: YogaIcon, transition: yogaPassed ? undefined : panchang.yogaTransition },
                { label: t('karana'), value: nextKarana ? nextKarana.name[locale] : panchang.karana.name[locale], sub: nextKarana ? nextKarana.type : panchang.karana.type, Icon: KaranaIcon, transition: karanaPassed ? undefined : panchang.karanaTransition },
                { label: t('vara'), value: panchang.vara.name[locale], sub: panchang.vara.ruler[locale], Icon: VaraIcon, transition: undefined as TransitionInfo | undefined },
              ];
            })().map((el, i) => (
              <motion.div
                key={el.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -6 }}
                className="glass-card rounded-2xl p-7 text-center hover:border-gold-primary/40 transition-all cursor-default"
              >
                <div className="flex justify-center mb-4"><el.Icon size={64} /></div>
                <div className="text-gold-dark text-xs uppercase tracking-widest mb-2 font-semibold">{el.label}</div>
                <div className="text-gold-light text-2xl font-bold leading-tight" style={headingFont}>{el.value}</div>
                <div className="text-text-secondary text-xs mt-3 leading-relaxed">{el.sub}</div>
                {el.transition && (
                  <div className="mt-4 pt-3 border-t border-gold-primary/10">
                    <div className="text-[10px] text-text-secondary uppercase tracking-wider">{t('upto')}</div>
                    <div className="text-gold-primary font-mono text-sm font-bold mt-0.5">{el.transition.endTime}</div>
                    <div className="text-[10px] text-text-secondary mt-1">
                      {t('then')} <span className="text-gold-light font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{el.transition.nextName[locale]}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

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

          {/* ═══ INAUSPICIOUS TIMES ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {[
              { label: t('rahuKaal'), start: panchang.rahuKaal.start, end: panchang.rahuKaal.end, color: 'text-red-400', bg: 'border-red-500/20' },
              { label: t('yamaganda'), start: panchang.yamaganda.start, end: panchang.yamaganda.end, color: 'text-orange-400', bg: 'border-orange-500/20' },
              { label: t('gulikaKaal'), start: panchang.gulikaKaal.start, end: panchang.gulikaKaal.end, color: 'text-yellow-400', bg: 'border-yellow-500/20' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className={`glass-card rounded-xl p-6 text-center border ${item.bg}`}
              >
                <div className="text-gold-dark text-xs uppercase tracking-widest mb-2 font-bold">{item.label}</div>
                <div className={`font-mono text-2xl font-bold ${item.color}`}>
                  {item.start} — {item.end}
                </div>
                <div className="text-text-secondary text-xs mt-2">{locale === 'en' ? 'Avoid new activities' : 'नए कार्य टालें'}</div>
              </motion.div>
            ))}
          </div>

          {/* ═══ SARVARTHA SIDDHI YOGA BANNER ═══ */}
          {panchang.sarvarthaSiddhi && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-10 mt-4"
            >
              <div className="glass-card rounded-2xl p-6 border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-gold-primary/5 to-emerald-500/10 text-center">
                <div className="text-emerald-400 text-xs uppercase tracking-[0.3em] font-bold mb-2">{t('sarvarthaSiddhi')}</div>
                <div className="text-emerald-300 text-lg font-bold" style={headingFont}>{t('sarvarthaSiddhiActive')}</div>
                <div className="text-text-secondary text-xs mt-2">{t('sarvarthaSiddhiDesc')}</div>
              </div>
            </motion.div>
          )}

          {/* ═══ SPECIAL TIMINGS — Amrit Kalam, Varjyam ═══ */}
          {(panchang.amritKalam || panchang.varjyam) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 mt-4">
                {panchang.amritKalam && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-xl p-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent"
                  >
                    <div className="text-emerald-400 text-xs uppercase tracking-widest mb-1 font-bold">{t('amritKalam')}</div>
                    <div className="font-mono text-2xl font-bold text-emerald-300">{panchang.amritKalam.start} — {panchang.amritKalam.end}</div>
                    <div className="text-text-secondary text-xs mt-2">{t('amritKalamDesc')}</div>
                  </motion.div>
                )}
                {panchang.varjyam && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-xl p-6 border border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent"
                  >
                    <div className="text-red-400 text-xs uppercase tracking-widest mb-1 font-bold">{t('varjyam')}</div>
                    <div className="font-mono text-2xl font-bold text-red-300">{panchang.varjyam.start} — {panchang.varjyam.end}</div>
                    <div className="text-text-secondary text-xs mt-2">{t('varjyamDesc')}</div>
                  </motion.div>
                )}
              </div>
            </>
          )}

          {/* ═══ NAMED MUHURTAS ═══ */}
          <div className="mb-14">
            <h2 className="text-3xl font-bold text-gold-gradient mb-6 text-center" style={headingFont}>
              {t('namedMuhurtas')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {panchang.brahmaMuhurta && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="glass-card rounded-xl p-5 text-center border border-indigo-500/20">
                  <div className="text-indigo-400 text-xs uppercase tracking-wider font-bold mb-1">{t('brahmaMuhurta')}</div>
                  <div className="font-mono text-lg font-bold text-indigo-300">{panchang.brahmaMuhurta.start} — {panchang.brahmaMuhurta.end}</div>
                  <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">{t('brahmaMuhurtaDesc')}</div>
                </motion.div>
              )}
              {panchang.sandhyaKaal && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="glass-card rounded-xl p-5 text-center border border-amber-500/20">
                  <div className="text-amber-400 text-xs uppercase tracking-wider font-bold mb-1">{t('sandhyaKaal')}</div>
                  <div className="text-text-primary text-xs mt-1">{t('morningSandhya')}: <span className="font-mono text-amber-300">{panchang.sandhyaKaal.morning.start}—{panchang.sandhyaKaal.morning.end}</span></div>
                  <div className="text-text-primary text-xs mt-1">{t('eveningSandhya')}: <span className="font-mono text-amber-300">{panchang.sandhyaKaal.evening.start}—{panchang.sandhyaKaal.evening.end}</span></div>
                  <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">{t('sandhyaKaalDesc')}</div>
                </motion.div>
              )}
              {panchang.godhuli && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="glass-card rounded-xl p-5 text-center border border-gold-primary/20">
                  <div className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-1">{t('godhuli')}</div>
                  <div className="font-mono text-lg font-bold text-gold-light">{panchang.godhuli.start} — {panchang.godhuli.end}</div>
                  <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">{t('godhuliDesc')}</div>
                </motion.div>
              )}
              {panchang.nishitaKaal && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="glass-card rounded-xl p-5 text-center border border-purple-500/20">
                  <div className="text-purple-400 text-xs uppercase tracking-wider font-bold mb-1">{t('nishitaKaal')}</div>
                  <div className="font-mono text-lg font-bold text-purple-300">{panchang.nishitaKaal.start} — {panchang.nishitaKaal.end}</div>
                  <div className="text-text-secondary text-[10px] mt-2 leading-relaxed">{t('nishitaKaalDesc')}</div>
                </motion.div>
              )}
            </div>
          </div>

          {/* ═══ DISHA SHOOL ═══ */}
          {panchang.dishaShool && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-6 border border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-transparent mb-14"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <span className="text-orange-400 text-2xl font-bold">
                    {panchang.dishaShool.direction[locale].charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-orange-400 text-xs uppercase tracking-widest font-bold mb-1">{t('dishaShool')}</div>
                  <div className="text-text-primary font-bold text-lg" style={headingFont}>{panchang.dishaShool.direction[locale]}</div>
                  <div className="text-text-secondary text-xs mt-1">{t('dishaShoolDesc')}</div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{t('remedy')}</div>
                  <div className="text-text-secondary text-sm mt-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{panchang.dishaShool.remedy[locale]}</div>
                </div>
              </div>
            </motion.div>
          )}

          <GoldDivider />

          {/* ═══ ABHIJIT MUHURTA HIGHLIGHT ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-14"
          >
            <div className="glass-card rounded-2xl p-8 border-2 border-gold-primary/30 bg-gradient-to-br from-gold-primary/5 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-primary/5 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0"><MuhurtaIcon size={80} /></div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>
                    {locale === 'en' ? 'Abhijit Muhurta' : 'अभिजित् मुहूर्त'}
                  </h2>
                  <p className="text-text-secondary text-sm mb-3 max-w-xl">
                    {locale === 'en'
                      ? 'The most auspicious time of the day — around local midday. Victory is assured in activities begun during Abhijit Muhurta. Named after the star Vega (Abhijit Nakshatra).'
                      : 'दिन का सबसे शुभ समय — स्थानीय मध्याह्न के आसपास। अभिजित् मुहूर्त में आरम्भ किए कार्यों में विजय निश्चित है। वेगा तारे (अभिजित् नक्षत्र) के नाम पर।'}
                  </p>
                  <div className="flex items-center gap-4 justify-center md:justify-start">
                    <Clock className="w-5 h-5 text-gold-primary" />
                    <span className="font-mono text-3xl font-bold text-gold-light">
                      {panchang.abhijitMuhurta.start} — {panchang.abhijitMuhurta.end}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-gold-dark text-xs uppercase tracking-wider">{locale === 'en' ? 'Best for' : 'सर्वोत्तम'}</div>
                  <div className="text-text-secondary text-sm mt-1">{locale === 'en' ? 'All activities' : 'सभी कार्य'}</div>
                  <div className="text-text-secondary text-sm">{locale === 'en' ? 'Marriages' : 'विवाह'}</div>
                  <div className="text-text-secondary text-sm">{locale === 'en' ? 'Major decisions' : 'महत्वपूर्ण निर्णय'}</div>
                </div>
              </div>
            </div>
          </motion.div>

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
              <div className="space-y-2">
                {panchang.muhurtas.slice(0, 15).map((m, i) => {
                  const info = MUHURTA_DATA[i];
                  const isExpanded = expandedMuhurta === m.number;
                  const isCurrent = currentMuhurtaIdx === i;
                  const isAbhijit = m.number === 8;
                  return (
                    <motion.div
                      key={m.number}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <button
                        onClick={() => setExpandedMuhurta(isExpanded ? null : m.number)}
                        className={`w-full text-left rounded-xl p-4 border transition-all ${
                          isAbhijit ? 'bg-gold-primary/10 border-gold-primary/40' :
                          isCurrent ? 'bg-gold-primary/5 border-gold-primary/30' :
                          getNatureBg(m.nature)
                        } hover:border-gold-primary/50`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className={`text-2xl font-bold w-8 ${getNatureColor(m.nature)}`}>{m.number}</span>
                            <div>
                              <span className="text-gold-light font-bold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                                {m.name[locale]}
                              </span>
                              {isAbhijit && <span className="ml-2 px-2 py-0.5 bg-gold-primary/30 text-gold-light text-[10px] rounded-full font-bold uppercase">Abhijit</span>}
                              {isCurrent && <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full font-bold animate-pulse">{locale === 'en' ? 'NOW' : 'अभी'}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-sm text-text-secondary">{m.startTime} — {m.endTime}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getNatureColor(m.nature)} ${m.nature === 'auspicious' ? 'bg-emerald-500/10' : m.nature === 'inauspicious' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                              {getNatureLabel(m.nature)}
                            </span>
                          </div>
                        </div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && info && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 mx-2 rounded-b-xl bg-bg-secondary/50 border border-t-0 border-gold-primary/10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="text-gold-dark text-xs uppercase tracking-wider mb-1 font-bold">{locale === 'en' ? 'Deity' : 'देवता'}</div>
                                  <div className="text-text-primary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{info.deity[locale]}</div>
                                </div>
                                <div>
                                  <div className="text-gold-dark text-xs uppercase tracking-wider mb-1 font-bold">{locale === 'en' ? 'Best For' : 'सर्वोत्तम'}</div>
                                  <div className="text-text-primary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{info.bestFor[locale]}</div>
                                </div>
                              </div>
                              <div className="mt-3">
                                <div className="text-gold-dark text-xs uppercase tracking-wider mb-1 font-bold">{locale === 'en' ? 'Significance' : 'महत्व'}</div>
                                <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{info.significance[locale]}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                      const isExpanded = expandedMuhurta === m.number;
                      const isBrahma = m.number >= 26 && m.number <= 27;
                      return (
                        <motion.div key={m.number} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                          <button
                            onClick={() => setExpandedMuhurta(isExpanded ? null : m.number)}
                            className={`w-full text-left rounded-xl p-4 border transition-all ${
                              isBrahma ? 'bg-indigo-500/10 border-indigo-500/20' : getNatureBg(m.nature)
                            } hover:border-gold-primary/50`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <span className={`text-2xl font-bold w-8 ${getNatureColor(m.nature)}`}>{m.number}</span>
                                <div>
                                  <span className="text-gold-light font-bold text-lg" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{m.name[locale]}</span>
                                  {isBrahma && <span className="ml-2 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] rounded-full font-bold">{locale === 'en' ? 'BRAHMA MUHURTA' : 'ब्राह्म मुहूर्त'}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-mono text-sm text-text-secondary">{m.startTime} — {m.endTime}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getNatureColor(m.nature)} ${m.nature === 'auspicious' ? 'bg-emerald-500/10' : m.nature === 'inauspicious' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                                  {getNatureLabel(m.nature)}
                                </span>
                              </div>
                            </div>
                          </button>
                          <AnimatePresence>
                            {isExpanded && info && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="p-5 mx-2 rounded-b-xl bg-bg-secondary/50 border border-t-0 border-gold-primary/10">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <div className="text-gold-dark text-xs uppercase tracking-wider mb-1 font-bold">{locale === 'en' ? 'Deity' : 'देवता'}</div>
                                      <div className="text-text-primary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{info.deity[locale]}</div>
                                    </div>
                                    <div>
                                      <div className="text-gold-dark text-xs uppercase tracking-wider mb-1 font-bold">{locale === 'en' ? 'Best For' : 'सर्वोत्तम'}</div>
                                      <div className="text-text-primary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{info.bestFor[locale]}</div>
                                    </div>
                                  </div>
                                  <div className="mt-3">
                                    <div className="text-gold-dark text-xs uppercase tracking-wider mb-1 font-bold">{locale === 'en' ? 'Significance' : 'महत्व'}</div>
                                    <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{info.significance[locale]}</p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <GoldDivider />

          {/* ═══ ADDITIONAL INFO ═══ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-14">
            {[
              { label: t('masa'), value: panchang.masa[locale], Icon: MasaIcon },
              { label: t('samvatsara'), value: panchang.samvatsara[locale], Icon: SamvatsaraIcon },
              { label: t('ritu'), value: panchang.ritu[locale], Icon: RituIcon },
              { label: t('ayana'), value: panchang.ayana[locale], Icon: AyanaIcon },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.08 }}
                className="glass-card rounded-xl p-5 text-center">
                <div className="flex justify-center mb-2"><item.Icon size={48} /></div>
                <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{item.label}</div>
                <div className="text-gold-light font-bold text-lg mt-1" style={headingFont}>{item.value}</div>
              </motion.div>
            ))}
          </div>

          <GoldDivider />

          {/* ═══ CHANDRABALAM & TARABALAM ═══ */}
          <div className="my-14">
            <h2 className="text-3xl font-bold text-gold-gradient mb-2 text-center" style={headingFont}>
              {locale === 'en' ? 'Chandrabalam & Tarabalam' : 'चन्द्रबल एवं ताराबल'}
            </h2>
            <p className="text-text-secondary text-sm text-center mb-8">
              {locale === 'en'
                ? 'Select your birth Nakshatra and Rashi to see today\'s Moon strength and star strength for you.'
                : 'आज का चन्द्रबल और ताराबल जानने के लिए अपना जन्म नक्षत्र और राशि चुनें।'}
            </p>
            <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2">
                    {locale === 'en' ? 'Birth Nakshatra' : 'जन्म नक्षत्र'}
                  </label>
                  <select
                    value={birthNakshatra}
                    onChange={(e) => setBirthNakshatra(Number(e.target.value))}
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
                    onChange={(e) => setBirthRashi(Number(e.target.value))}
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
