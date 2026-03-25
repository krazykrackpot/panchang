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
import type { PanchangData, Locale, Muhurta } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { MUHURTA_DATA } from '@/lib/constants/muhurtas';

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
        setLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name.split(',').slice(0, 3).join(', '), tz: -new Date().getTimezoneOffset() / 60 });
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
            {[
              { label: t('tithi'), value: panchang.tithi.name[locale], sub: panchang.tithi.paksha === 'shukla' ? t('shukla') : t('krishna'), Icon: TithiIcon },
              { label: t('nakshatra'), value: panchang.nakshatra.name[locale], sub: `${panchang.nakshatra.deity[locale]}`, Icon: NakshatraIcon },
              { label: t('yoga'), value: panchang.yoga.name[locale], sub: panchang.yoga.meaning[locale], Icon: YogaIcon },
              { label: t('karana'), value: panchang.karana.name[locale], sub: panchang.karana.type, Icon: KaranaIcon },
              { label: t('vara'), value: panchang.vara.name[locale], sub: panchang.vara.ruler[locale], Icon: VaraIcon },
            ].map((el, i) => (
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
