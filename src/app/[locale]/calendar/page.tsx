'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, MapPin, Search, Loader2 } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { MasaIcon } from '@/components/icons/PanchangIcons';
import FestivalDetailModal from '@/components/calendar/FestivalDetailModal';
import { FESTIVAL_DETAILS, CATEGORY_DETAILS, EKADASHI_NAMES, getHinduMonth } from '@/lib/constants/festival-details';
import type { FestivalDetail, EkadashiDetail } from '@/lib/constants/festival-details';
import type { Locale, Trilingual } from '@/types/panchang';

interface FestivalEntry {
  name: Trilingual;
  date: string;
  tithi?: string;
  type: 'major' | 'vrat' | 'regional' | 'eclipse';
  category: string;
  description: Trilingual;
  slug?: string;
  // Parana
  paranaDate?: string;
  paranaStart?: string;
  paranaEnd?: string;
  paranaNote?: Trilingual;
  paranaSunrise?: string;
  paranaHariVasaraEnd?: string;
  paranaDwadashiEnd?: string;
  paranaEarlyEnd?: boolean;
  paranaMadhyahnaStart?: string;
  paranaMadhyahnaEnd?: string;
  // Eclipse
  eclipseType?: 'solar' | 'lunar';
  eclipseMagnitude?: string;
  eclipseMaxTime?: string;
  sutakStart?: string;
  sutakEnd?: string;
  sutakApplicable?: boolean;
  eclipsePhases?: { name: Trilingual; time: string }[];
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_NAMES_HI = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितम्बर','अक्टूबर','नवम्बर','दिसम्बर'];

type Filter = 'all' | 'major' | 'ekadashi' | 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham' | 'eclipse';

interface LocationData { lat: number; lng: number; name: string; tz: number; timezone: string; }

export default function CalendarPage() {
  const t = useTranslations('calendar');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [year, setYear] = useState(new Date().getFullYear());
  const [festivals, setFestivals] = useState<FestivalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Location — null until resolved (no hardcoded default)
  const [location, setLocation] = useState<LocationData | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(true);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [searchingLocation, setSearchingLocation] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState<FestivalEntry | null>(null);
  const [modalDetail, setModalDetail] = useState<FestivalDetail | null>(null);
  const [modalEkadashi, setModalEkadashi] = useState<EkadashiDetail | null>(null);

  // Auto-detect location on mount — NO hardcoded defaults. User MUST have a location.
  useEffect(() => {
    const browserTz = -new Date().getTimezoneOffset() / 60;
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    const tryIPLookup = () => {
      fetch('https://ipapi.co/json/')
        .then(r => r.json())
        .then(data => {
          if (data.latitude && data.longitude) {
            const ianaTz = data.timezone || browserTimezone;
            setLocation({ lat: data.latitude, lng: data.longitude, name: [data.city, data.country_name].filter(Boolean).join(', ') || 'Unknown', tz: browserTz, timezone: ianaTz });
          }
          // If IP lookup also fails → location stays null → user is prompted to enter manually
        })
        .catch(() => {}) // location stays null
        .finally(() => setDetectingLocation(false));
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
            const country = data.address?.country || '';
            const name = [city, country].filter(Boolean).join(', ') || `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
            setLocation({ lat: latitude, lng: longitude, name, tz: browserTz, timezone: browserTimezone });
          } catch {
            setLocation({ lat: latitude, lng: longitude, name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`, tz: browserTz, timezone: browserTimezone });
          }
          setDetectingLocation(false);
        },
        () => tryIPLookup(), // Geolocation denied — try IP
        { timeout: 5000 }
      );
    } else {
      tryIPLookup();
    }
  }, []);

  const handleLocationSearch = async () => {
    if (!locationInput.trim()) return;
    setSearchingLocation(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=1`);
      const data = await res.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const approxTz = -new Date().getTimezoneOffset() / 60;
        const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        setLocation({ lat, lng, name: data[0].display_name.split(',').slice(0, 3).join(', '), tz: approxTz, timezone: browserTimezone });
        setShowLocationSearch(false);
        setLocationInput('');
      }
    } catch { /* ignore */ }
    setSearchingLocation(false);
  };

  useEffect(() => {
    if (!location) return; // Don't fetch until location is resolved
    setLoading(true);
    fetch(`/api/calendar?year=${year}&lat=${location.lat}&lon=${location.lng}&timezone=${encodeURIComponent(location.timezone)}`)
      .then(res => res.json())
      .then(data => {
        setFestivals(data.festivals || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year, location]);

  const filteredFestivals = festivals.filter(f => {
    if (filter !== 'all') {
      if (filter === 'major' && f.type !== 'major') return false;
      if (filter !== 'major' && f.category !== filter) return false;
    }
    if (selectedMonth !== null) {
      const m = parseInt(f.date.split('-')[1]);
      if (m !== selectedMonth + 1) return false;
    }
    return true;
  });

  const handleFestivalClick = useCallback((festival: FestivalEntry) => {
    setSelectedFestival(festival);

    // Look up rich details
    let detail: FestivalDetail | null = null;
    let ekadashiDetail: EkadashiDetail | null = null;

    if (festival.slug) {
      // Check main festival details first
      if (FESTIVAL_DETAILS[festival.slug]) {
        detail = FESTIVAL_DETAILS[festival.slug];
      }
      // Check category details for vrats
      else if (CATEGORY_DETAILS[festival.slug]) {
        detail = CATEGORY_DETAILS[festival.slug];
      }
      // For ekadashi, also check category-level details
      else if (festival.slug === 'ekadashi') {
        detail = CATEGORY_DETAILS.ekadashi;
      }
      // Other category slugs
      else if (CATEGORY_DETAILS[festival.category]) {
        detail = CATEGORY_DETAILS[festival.category];
      }
    }

    // For Ekadashis, also look up the specific Ekadashi detail by name
    if (festival.category === 'ekadashi') {
      // Try matching by festival name against all Ekadashi names
      for (const month of Object.keys(EKADASHI_NAMES)) {
        const monthData = EKADASHI_NAMES[month];
        if (monthData.shukla.name.en === festival.name.en) {
          ekadashiDetail = monthData.shukla;
          break;
        }
        if (monthData.krishna.name.en === festival.name.en) {
          ekadashiDetail = monthData.krishna;
          break;
        }
      }
    }

    setModalDetail(detail);
    setModalEkadashi(ekadashiDetail);
    setModalOpen(true);
  }, []);

  const categoryColors: Record<string, string> = {
    festival: 'text-gold-light bg-gold-primary/10 border-gold-primary/20',
    ekadashi: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purnima: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    amavasya: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    chaturthi: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    pradosham: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    sankranti: 'text-red-400 bg-red-500/10 border-red-500/20',
    eclipse: 'text-red-300 bg-red-500/10 border-red-500/20',
  };

  const filterButtons: { key: Filter; label: string; labelHi: string }[] = [
    { key: 'all', label: 'All', labelHi: 'सभी' },
    { key: 'major', label: 'Major Festivals', labelHi: 'प्रमुख त्योहार' },
    { key: 'ekadashi', label: 'Ekadashi', labelHi: 'एकादशी' },
    { key: 'purnima', label: 'Purnima', labelHi: 'पूर्णिमा' },
    { key: 'amavasya', label: 'Amavasya', labelHi: 'अमावस्या' },
    { key: 'chaturthi', label: 'Chaturthi', labelHi: 'चतुर्थी' },
    { key: 'pradosham', label: 'Pradosham', labelHi: 'प्रदोष' },
    { key: 'eclipse', label: 'Eclipses', labelHi: 'ग्रहण' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="flex justify-center mb-6"><MasaIcon size={80} /></div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
      </motion.div>

      {/* Year selector */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronLeft className="w-5 h-5 text-gold-primary" />
        </button>
        <span className="text-4xl font-bold text-gold-gradient" style={headingFont}>{year}</span>
        <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronRight className="w-5 h-5 text-gold-primary" />
        </button>
      </div>

      {/* Location — REQUIRED. If null and not detecting, force user to enter. */}
      {detectingLocation ? (
        <div className="flex flex-col items-center gap-3 mb-8 py-8">
          <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
          <p className="text-text-secondary text-sm">{locale === 'en' ? 'Detecting your location…' : 'आपका स्थान पहचान रहे हैं…'}</p>
        </div>
      ) : !location ? (
        <div className="flex flex-col items-center gap-4 mb-8 py-8 glass-card rounded-2xl border-2 border-gold-primary/30 max-w-lg mx-auto px-6">
          <MapPin className="w-10 h-10 text-gold-primary" />
          <h3 className="text-gold-light font-bold text-lg" style={headingFont}>
            {locale === 'en' ? 'Location Required' : 'स्थान आवश्यक है'}
          </h3>
          <p className="text-text-secondary text-sm text-center">
            {locale === 'en'
              ? 'All festival dates, tithi timings, and parana windows depend on your location. Please enter your city to see accurate data.'
              : 'सभी त्यौहार तिथियाँ, तिथि समय और पारण समय आपके स्थान पर निर्भर हैं। सटीक डेटा के लिए अपना शहर दर्ज करें।'}
          </p>
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={locationInput}
              onChange={e => setLocationInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLocationSearch()}
              placeholder={locale === 'en' ? 'Enter your city…' : 'अपना शहर दर्ज करें…'}
              className="flex-1 px-4 py-3 rounded-lg bg-bg-tertiary border border-gold-primary/30 text-text-primary text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/60"
              autoFocus
            />
            <button
              onClick={handleLocationSearch}
              disabled={searchingLocation}
              className="px-4 py-3 rounded-lg bg-gold-primary/20 hover:bg-gold-primary/30 transition-all border border-gold-primary/30"
            >
              {searchingLocation ? <Loader2 className="w-5 h-5 text-gold-primary animate-spin" /> : <Search className="w-5 h-5 text-gold-primary" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 mb-6">
          <button
            onClick={() => setShowLocationSearch(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gold-primary/20 bg-bg-secondary/50 hover:bg-gold-primary/10 transition-all text-sm"
          >
            <MapPin className="w-4 h-4 text-gold-primary" />
            <span className="text-text-primary font-medium">{location.name}</span>
            <span className="text-text-secondary text-xs">UTC{location.tz >= 0 ? '+' : ''}{location.tz}</span>
            <ChevronDown className={`w-3 h-3 text-text-secondary transition-transform ${showLocationSearch ? 'rotate-180' : ''}`} />
          </button>
          {showLocationSearch && (
            <div className="flex items-center gap-2 w-full max-w-sm">
              <input
                type="text"
                value={locationInput}
                onChange={e => setLocationInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLocationSearch()}
                placeholder={locale === 'en' ? 'Enter city or location…' : 'शहर या स्थान दर्ज करें…'}
                className="flex-1 px-3 py-2 rounded-lg bg-bg-tertiary border border-gold-primary/20 text-text-primary text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50"
              />
              <button
                onClick={handleLocationSearch}
                disabled={searchingLocation}
                className="p-2 rounded-lg bg-gold-primary/20 hover:bg-gold-primary/30 transition-all"
              >
                {searchingLocation ? <Loader2 className="w-4 h-4 text-gold-primary animate-spin" /> : <Search className="w-4 h-4 text-gold-primary" />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Month tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={() => setSelectedMonth(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            selectedMonth === null ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
          }`}
        >
          {locale === 'en' ? 'All Months' : 'सभी महीने'}
        </button>
        {MONTH_NAMES.map((name, i) => (
          <button
            key={i}
            onClick={() => setSelectedMonth(selectedMonth === i ? null : i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMonth === i ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
            }`}
          >
            {locale === 'en' ? name.slice(0, 3) : MONTH_NAMES_HI[i].slice(0, 4)}
          </button>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {filterButtons.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === f.key ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
            }`}
          >
            {locale === 'en' ? f.label : f.labelHi}
          </button>
        ))}
      </div>

      <GoldDivider />

      {/* Festival list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-3 my-10">
          {filteredFestivals.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              {locale === 'en' ? 'No festivals found for this filter.' : 'इस फ़िल्टर के लिए कोई त्योहार नहीं मिला।'}
            </div>
          ) : filteredFestivals.map((f, i) => {
            const dateObj = new Date(f.date + 'T00:00:00');
            const dayStr = dateObj.getDate();
            const monthStr = locale === 'en' ? MONTH_NAMES[dateObj.getMonth()]?.slice(0, 3) : MONTH_NAMES_HI[dateObj.getMonth()]?.slice(0, 4);

            return (
              <motion.button
                key={`${f.date}-${f.name.en}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                onClick={() => handleFestivalClick(f)}
                className={`w-full text-left glass-card rounded-xl p-4 flex items-center gap-4 border cursor-pointer transition-all hover:scale-[1.01] hover:border-gold-primary/40 active:scale-[0.99] ${
                  f.type === 'major' ? 'border-gold-primary/20' : f.type === 'eclipse' ? 'border-red-500/20' : 'border-gold-primary/5'
                }`}
              >
                {/* Date badge */}
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-bg-tertiary/50 flex flex-col items-center justify-center">
                  <span className="text-gold-light text-xl font-bold leading-none">{dayStr}</span>
                  <span className="text-text-secondary text-[10px] uppercase">{monthStr}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-lg font-bold ${f.type === 'major' ? 'text-gold-light' : 'text-text-primary'}`}
                      style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {f.name[locale]}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${categoryColors[f.category] || 'text-text-secondary bg-bg-tertiary/50 border-gold-primary/10'}`}>
                      {f.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-text-secondary text-xs mt-1 line-clamp-1"
                    style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {f.description[locale]}
                  </div>
                </div>

                {/* Parana time indicator */}
                {f.paranaStart && (
                  <div className="hidden sm:block text-right flex-shrink-0">
                    <div className="text-text-secondary text-[10px] uppercase tracking-wider">{locale === 'en' ? 'Parana' : 'पारण'}</div>
                    <div className="text-emerald-400 text-xs font-mono">{f.paranaStart}</div>
                  </div>
                )}

                {/* Tithi */}
                {f.tithi && !f.paranaStart && (
                  <div className="hidden sm:block text-right flex-shrink-0">
                    <div className="text-text-secondary text-[10px] uppercase tracking-wider">{locale === 'en' ? 'Tithi' : 'तिथि'}</div>
                    <div className="text-gold-dark text-xs font-mono">{f.tithi}</div>
                  </div>
                )}

                {/* Click indicator */}
                <ChevronDown className="w-4 h-4 text-gold-primary/40 flex-shrink-0 -rotate-90" />
              </motion.button>
            );
          })}
          <div className="text-center text-text-secondary text-sm mt-6">
            {filteredFestivals.length} {locale === 'en' ? 'entries' : 'प्रविष्टियाँ'}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedFestival && (
        <FestivalDetailModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedFestival(null); }}
          locale={locale}
          festivalName={selectedFestival.name}
          festivalDate={selectedFestival.date}
          festivalCategory={selectedFestival.category}
          detail={modalDetail}
          ekadashiDetail={modalEkadashi}
          paranaDate={selectedFestival.paranaDate}
          paranaStart={selectedFestival.paranaStart}
          paranaEnd={selectedFestival.paranaEnd}
          paranaNote={selectedFestival.paranaNote}
          paranaSunrise={selectedFestival.paranaSunrise}
          paranaHariVasaraEnd={selectedFestival.paranaHariVasaraEnd}
          paranaDwadashiEnd={selectedFestival.paranaDwadashiEnd}
          paranaEarlyEnd={selectedFestival.paranaEarlyEnd}
          paranaMadhyahnaStart={selectedFestival.paranaMadhyahnaStart}
          paranaMadhyahnaEnd={selectedFestival.paranaMadhyahnaEnd}
          eclipseType={selectedFestival.eclipseType}
          eclipseMagnitude={selectedFestival.eclipseMagnitude}
          eclipseMaxTime={selectedFestival.eclipseMaxTime}
          sutakStart={selectedFestival.sutakStart}
          sutakEnd={selectedFestival.sutakEnd}
          sutakApplicable={selectedFestival.sutakApplicable}
          eclipsePhases={selectedFestival.eclipsePhases}
        />
      )}
    </div>
  );
}
