'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, MapPin, Search, Loader2, Download, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { scoreFestivalRelevance } from '@/lib/personalization/festival-relevance';
import PersonalRelevanceBadge, { computeRelevance, type PersonalRelevanceData, type RelevanceMatch } from '@/components/calendar/PersonalRelevanceBadge';
import { useBirthDataStore } from '@/stores/birth-data-store';
import GoldDivider from '@/components/ui/GoldDivider';
import { ShareRow } from '@/components/ui/ShareButton';
import { PUJA_VIDHIS } from '@/lib/constants/puja-vidhi';

const PUJA_SLUG_MAP: Record<string, string> = {
  'vat-savitri-vrat': 'vat-savitri',
  'amavasya': 'amavasya-tarpan',
  'pradosham-shukla': 'pradosham',
  'pradosham-krishna': 'pradosham',
  'sankashti-chaturthi-shukla': 'sankashti-chaturthi',
};
function hasPujaVidhi(slug?: string): boolean {
  if (!slug) return false;
  return !!(PUJA_VIDHIS[slug] || PUJA_VIDHIS[PUJA_SLUG_MAP[slug] || '']);
}
import { MasaIcon } from '@/components/icons/PanchangIcons';
import FestivalDetailModal from '@/components/calendar/FestivalDetailModal';
import { FESTIVAL_DETAILS, CATEGORY_DETAILS, EKADASHI_NAMES, getHinduMonth } from '@/lib/constants/festival-details';
import type { FestivalDetail, EkadashiDetail } from '@/lib/constants/festival-details';
import type { Locale, Trilingual } from '@/types/panchang';

interface FestivalEntry {
  name: Trilingual;
  date: string;
  tithi?: string;
  masa?: { amanta: string; purnimanta: string; isAdhika: boolean };
  paksha?: 'shukla' | 'krishna';
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

const HINDU_MONTHS = [
  { en: 'Chaitra', hi: 'चैत्र' }, { en: 'Vaishakha', hi: 'वैशाख' },
  { en: 'Jyeshtha', hi: 'ज्येष्ठ' }, { en: 'Ashadha', hi: 'आषाढ़' },
  { en: 'Shravana', hi: 'श्रावण' }, { en: 'Bhadrapada', hi: 'भाद्रपद' },
  { en: 'Ashwina', hi: 'आश्विन' }, { en: 'Kartika', hi: 'कार्तिक' },
  { en: 'Margashirsha', hi: 'मार्गशीर्ष' }, { en: 'Pausha', hi: 'पौष' },
  { en: 'Magha', hi: 'माघ' }, { en: 'Phalguna', hi: 'फाल्गुन' },
];

type Filter = 'all' | 'major' | 'ekadashi' | 'purnima' | 'amavasya' | 'chaturthi' | 'pradosham' | 'vrat' | 'eclipse';
type ViewMode = 'western' | 'lunar';

interface LocationData { lat: number; lng: number; name: string; tz: number; timezone: string; }

export default function CalendarPage() {
  const t = useTranslations('calendar');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [year, setYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<ViewMode>('western');
  const [festivals, setFestivals] = useState<FestivalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Personalized festival recommendations
  const calUser = useAuthStore(s => s.user);
  const [recommendedSlugs, setRecommendedSlugs] = useState<Set<string>>(new Set());

  // Personal relevance data from birth-data-store + snapshot
  const birthDataStore = useBirthDataStore();
  const [personalRelevance, setPersonalRelevance] = useState<PersonalRelevanceData | null>(null);

  useEffect(() => {
    if (!calUser || festivals.length === 0) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.from('kundali_snapshots')
      .select('moon_sign, moon_nakshatra, ascendant_sign, dasha_timeline, sade_sati')
      .eq('user_id', calUser.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const snapshot = {
          moonSign: data.moon_sign, moonNakshatra: data.moon_nakshatra,
          moonNakshatraPada: 1, sunSign: 1, ascendantSign: data.ascendant_sign,
          planetPositions: [], dashaTimeline: data.dasha_timeline || [], sadeSati: data.sade_sati || {},
        };
        const slugs = new Set<string>();
        festivals.forEach(f => {
          if (f.slug) {
            const result = scoreFestivalRelevance(f.slug, f.category, snapshot);
            if (result.isRecommended) slugs.add(f.slug);
          }
        });
        setRecommendedSlugs(slugs);

        // Build personal relevance data for badges
        let currentDashaPlanet: string | undefined;
        const timeline = data.dasha_timeline as Array<{ planet: string; startDate: string; endDate: string; subPeriods?: Array<{ planet: string; startDate: string; endDate: string }> }> | undefined;
        if (timeline) {
          const now = Date.now();
          for (const maha of timeline) {
            const mStart = new Date(maha.startDate).getTime();
            const mEnd = new Date(maha.endDate).getTime();
            if (now >= mStart && now <= mEnd) {
              currentDashaPlanet = maha.planet;
              break;
            }
          }
        }
        setPersonalRelevance({
          birthNakshatra: data.moon_nakshatra || birthDataStore.birthNakshatra,
          birthRashi: data.moon_sign || birthDataStore.birthRashi,
          currentDashaPlanet,
        });
      });
  }, [calUser, festivals, birthDataStore.birthNakshatra, birthDataStore.birthRashi]);

  // For non-logged-in users, use birth-data-store
  useEffect(() => {
    birthDataStore.loadFromStorage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!calUser && birthDataStore.isSet && !personalRelevance) {
      setPersonalRelevance({
        birthNakshatra: birthDataStore.birthNakshatra,
        birthRashi: birthDataStore.birthRashi,
      });
    }
  }, [calUser, birthDataStore.isSet, birthDataStore.birthNakshatra, birthDataStore.birthRashi, personalRelevance]);

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
    // Category filter
    if (filter !== 'all') {
      if (filter === 'major' && f.type !== 'major') return false;
      if (filter !== 'major' && f.category !== filter) return false;
    }
    // Month filter
    if (selectedMonth !== null) {
      if (viewMode === 'western') {
        const m = parseInt(f.date.split('-')[1]);
        if (m !== selectedMonth + 1) return false;
      } else {
        // Lunar month filter — match against Purnimant month name
        const hinduMonth = HINDU_MONTHS[selectedMonth]?.en.toLowerCase();
        const festivalMasa = (f as { masa?: { purnimanta?: string } }).masa?.purnimanta;
        if (!festivalMasa || festivalMasa !== hinduMonth) return false;
      }
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
    { key: 'major', label: 'Festivals', labelHi: 'त्योहार' },
    { key: 'ekadashi', label: 'Ekadashi', labelHi: 'एकादशी' },
    { key: 'purnima', label: 'Purnima', labelHi: 'पूर्णिमा' },
    { key: 'amavasya', label: 'Amavasya', labelHi: 'अमावस्या' },
    { key: 'chaturthi', label: 'Chaturthi', labelHi: 'चतुर्थी' },
    { key: 'pradosham', label: 'Pradosham', labelHi: 'प्रदोष' },
    { key: 'vrat', label: 'Other Vrats', labelHi: 'अन्य व्रत' },
    { key: 'eclipse', label: 'Eclipses', labelHi: 'ग्रहण' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="flex justify-center mb-6"><MasaIcon size={80} /></div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t('title')}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        <div className="flex justify-center mt-4">
          <ShareRow
            pageTitle={locale === 'en' || String(locale) === 'ta' ? 'Hindu Festival Calendar' : 'हिन्दू त्योहार पंचांग'}
            shareText={locale === 'en'
              ? 'Hindu Festival Calendar with Ekadashi, Purnima & Vrat details — Dekho Panchang'
              : 'हिन्दू त्योहार पंचांग — एकादशी, पूर्णिमा और व्रत विवरण सहित — Dekho Panchang'}
            locale={locale}
          />
        </div>
      </motion.div>

      {/* Year selector */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-8">
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
          <p className="text-text-secondary text-sm">{locale === 'en' || String(locale) === 'ta' ? 'Detecting your location…' : 'आपका स्थान पहचान रहे हैं…'}</p>
        </div>
      ) : !location ? (
        <div className="flex flex-col items-center gap-4 mb-8 py-8 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border-2 border-gold-primary/30 rounded-2xl max-w-lg mx-auto px-3 sm:px-4 md:px-6">
          <MapPin className="w-10 h-10 text-gold-primary" />
          <h3 className="text-gold-light font-bold text-lg" style={headingFont}>
            {locale === 'en' || String(locale) === 'ta' ? 'Location Required' : 'स्थान आवश्यक है'}
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
              placeholder={locale === 'en' || String(locale) === 'ta' ? 'Enter your city…' : 'अपना शहर दर्ज करें…'}
              className="flex-1 px-4 py-3 rounded-lg bg-bg-tertiary border border-gold-primary/30 text-text-primary text-sm placeholder:text-text-secondary/70 focus:outline-none focus:border-gold-primary/60"
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
                placeholder={locale === 'en' || String(locale) === 'ta' ? 'Enter city or location…' : 'शहर या स्थान दर्ज करें…'}
                className="flex-1 px-3 py-2 rounded-lg bg-bg-tertiary border border-gold-primary/20 text-text-primary text-sm placeholder:text-text-secondary/70 focus:outline-none focus:border-gold-primary/50"
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

      {/* View mode toggle: Western / Hindu Lunar */}
      <div className="flex justify-center gap-1 mb-4">
        <button
          onClick={() => { setViewMode('western'); setSelectedMonth(null); }}
          className={`px-4 py-2 rounded-l-xl text-xs font-bold transition-all border ${
            viewMode === 'western'
              ? 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border-gold-primary/35 shadow-lg shadow-gold-primary/5'
              : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-gold-light'
          }`}
        >
          {locale === 'en' || String(locale) === 'ta' ? 'Western Months' : 'अंग्रेज़ी महीने'}
        </button>
        <button
          onClick={() => { setViewMode('lunar'); setSelectedMonth(null); }}
          className={`px-4 py-2 rounded-r-xl text-xs font-bold transition-all border ${
            viewMode === 'lunar'
              ? 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border-gold-primary/35 shadow-lg shadow-gold-primary/5'
              : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-gold-light'
          }`}
        >
          {locale === 'en' || String(locale) === 'ta' ? 'Hindu Lunar Months' : 'हिन्दू चान्द्र मास'}
        </button>
      </div>

      {/* Month tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={() => setSelectedMonth(null)}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
            selectedMonth === null
              ? 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border-gold-primary/35 shadow-lg shadow-gold-primary/5'
              : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-gold-light'
          }`}
        >
          {locale === 'en' || String(locale) === 'ta' ? 'All' : 'सभी'}
        </button>
        {viewMode === 'western' ? (
          MONTH_NAMES.map((name, i) => (
            <button
              key={i}
              onClick={() => setSelectedMonth(selectedMonth === i ? null : i)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedMonth === i
                  ? 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border-gold-primary/35 shadow-lg shadow-gold-primary/5'
                  : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-gold-light'
              }`}
            >
              {locale === 'en' || String(locale) === 'ta' ? name.slice(0, 3) : MONTH_NAMES_HI[i].slice(0, 4)}
            </button>
          ))
        ) : (
          HINDU_MONTHS.map((hm, i) => (
            <button
              key={i}
              onClick={() => setSelectedMonth(selectedMonth === i ? null : i)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedMonth === i
                  ? 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border-gold-primary/35 shadow-lg shadow-gold-primary/5'
                  : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-gold-light'
              }`}
            >
              {locale === 'en' || String(locale) === 'ta' ? hm.en : hm.hi}
            </button>
          ))
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {filterButtons.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              filter === f.key
                ? 'bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] text-gold-light border-gold-primary/35 shadow-lg shadow-gold-primary/5'
                : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] text-text-secondary border-gold-primary/10 hover:border-gold-primary/25 hover:text-gold-light'
            }`}
          >
            {locale === 'en' || String(locale) === 'ta' ? f.label : f.labelHi}
          </button>
        ))}
      </div>

      {/* Calendar Export */}
      {location && (
        <div className="flex flex-wrap gap-2 justify-center mt-4 pt-4 border-t border-gold-primary/10">
          <span className="text-text-secondary text-xs mr-2 self-center">{locale === 'en' || String(locale) === 'ta' ? 'Subscribe:' : 'सदस्यता:'}</span>
          {([
            { cat: 'all', label: { en: 'All Events', hi: 'सभी' } },
            { cat: 'major', label: { en: 'Festivals', hi: 'त्योहार' } },
            { cat: 'ekadashi', label: { en: 'Ekadashi', hi: 'एकादशी' } },
            { cat: 'purnima', label: { en: 'Purnima', hi: 'पूर्णिमा' } },
            { cat: 'amavasya', label: { en: 'Amavasya', hi: 'अमावस्या' } },
          ] as const).map(e => (
            <a
              key={e.cat}
              href={`/api/calendar/export?year=${year}&category=${e.cat}&lat=${location.lat}&lon=${location.lng}&timezone=${encodeURIComponent(location.timezone)}&locale=${locale}`}
              download
              className="text-xs px-2.5 py-1 rounded-full border border-gold-primary/15 text-gold-dark hover:text-gold-light hover:border-gold-primary/30 transition-all flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              {e.label[(locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const]}
            </a>
          ))}
        </div>
      )}

      <GoldDivider />

      {/* Festival & Vrat lists — separated */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : (() => {
        const festivalItems = filteredFestivals.filter(f => f.type === 'major' || f.type === 'eclipse');
        const vratItems = filteredFestivals.filter(f => f.type === 'vrat');
        const showFestivals = filter === 'all' || filter === 'major' || filter === 'eclipse';
        const showVrats = filter === 'all' || !['major', 'eclipse'].includes(filter);

        const renderCard = (f: FestivalEntry, i: number) => {
            const dateObj = new Date(f.date + 'T00:00:00');
            const dayStr = dateObj.getDate();
            const monthStr = locale === 'en' || String(locale) === 'ta' ? MONTH_NAMES[dateObj.getMonth()]?.slice(0, 3) : MONTH_NAMES_HI[dateObj.getMonth()]?.slice(0, 4);

            const detailSlug = f.slug || f.category;
            const dateParam = f.slug?.includes('ekadashi') || f.category === 'ekadashi' ? `?date=${f.date}` : '';
            return (
              <motion.a
                key={`${f.date}-${f.name.en}-${i}`}
                href={`/${locale}/calendar/${detailSlug}${dateParam}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.5) }}
                className={`w-full text-left bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 flex items-center gap-4 border cursor-pointer transition-all hover:scale-[1.01] hover:border-gold-primary/40 active:scale-[0.99] ${
                  f.type === 'major' ? 'border-gold-primary/20' : f.type === 'eclipse' ? 'border-red-500/20' : 'border-gold-primary/5'
                }`}
              >
                {/* Date badge */}
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-bg-tertiary/50 flex flex-col items-center justify-center">
                  <span className="text-gold-light text-xl font-bold leading-none">{dayStr}</span>
                  <span className="text-text-secondary text-xs uppercase">{monthStr}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-lg font-bold ${f.type === 'major' ? 'text-gold-light' : 'text-text-primary'}`}
                      style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {f.name[locale]}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${categoryColors[f.category] || 'text-text-secondary bg-bg-tertiary/50 border-gold-primary/10'}`}>
                      {f.category.toUpperCase()}
                    </span>
                    {f.masa && (
                      <span className="text-xs px-2 py-0.5 rounded-full border border-gold-primary/10 text-gold-dark/60">
                        {f.masa.purnimanta} {f.paksha || ''}
                      </span>
                    )}
                    {/* Personal relevance badge */}
                    {personalRelevance && (() => {
                      const matches = computeRelevance(f.slug, f.category, undefined, personalRelevance);
                      return matches.length > 0 ? <PersonalRelevanceBadge matches={matches} locale={locale} /> : null;
                    })()}
                  </div>
                  <div className="text-text-secondary text-xs mt-1 line-clamp-1"
                    style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {f.description[locale]}
                  </div>
                  {/* Parana info for ekadashis */}
                  {f.paranaStart && f.paranaDate && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-bold text-amber-400">
                        {locale === 'en' || String(locale) === 'ta' ? 'Parana' : 'पारण'}:
                      </span>
                      <span className="font-mono text-xs font-bold text-gold-light">
                        {f.paranaStart} — {f.paranaEnd}
                      </span>
                      <span className="text-xs font-bold text-gold-primary">
                        {(() => {
                          const [y, m, d] = f.paranaDate.split('-').map(Number);
                          const date = new Date(y, m - 1, d);
                          const months = locale === 'en'
                            ? ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                            : ['जन.','फर.','मार्च','अप्रै.','मई','जून','जुला.','अग.','सित.','अक्टू.','नव.','दिस.'];
                          return `${d} ${months[m - 1]}`;
                        })()}
                      </span>
                      <span className="text-xs text-text-secondary/55">24h</span>
                    </div>
                  )}
                </div>

                {/* Recommended for you */}
                {f.slug && recommendedSlugs.has(f.slug) && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold shrink-0">
                    <Sparkles className="w-3 h-3" />
                    {locale === 'en' || String(locale) === 'ta' ? 'For You' : 'आपके लिए'}
                  </span>
                )}

                {/* Puja Vidhi indicator */}
                {hasPujaVidhi(f.slug) && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold shrink-0">
                    {locale === 'en' || String(locale) === 'ta' ? 'Puja Vidhi' : 'पूजा विधि'}
                  </span>
                )}

                {/* Parana time indicator */}
                {f.paranaStart && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-text-secondary text-xs uppercase tracking-wider">{locale === 'en' || String(locale) === 'ta' ? 'Parana' : 'पारण'}</div>
                    <div className="text-emerald-400 text-xs font-mono">{f.paranaStart} – {f.paranaEnd}</div>
                    {f.paranaDate && <div className="text-text-secondary/65 text-xs">{f.paranaDate}</div>}
                  </div>
                )}

                {/* Tithi */}
                {f.tithi && !f.paranaStart && (
                  <div className="hidden sm:block text-right flex-shrink-0">
                    <div className="text-text-secondary text-xs uppercase tracking-wider">{locale === 'en' || String(locale) === 'ta' ? 'Tithi' : 'तिथि'}</div>
                    <div className="text-gold-dark text-xs font-mono">{f.tithi}</div>
                  </div>
                )}

                {/* Click indicator */}
                <ChevronDown className="w-4 h-4 text-gold-primary/40 flex-shrink-0 -rotate-90" />
              </motion.a>
            );
          };

        return (
          <div className="my-10 space-y-10">
            {filteredFestivals.length === 0 ? (
              <div className="text-center py-12 text-text-secondary">
                {locale === 'en' || String(locale) === 'ta' ? 'No festivals found for this filter.' : 'इस फ़िल्टर के लिए कोई त्योहार नहीं मिला।'}
              </div>
            ) : (
              <>
                {/* ── Festivals Section ── */}
                {showFestivals && festivalItems.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gold-gradient mb-4" style={headingFont}>
                      {locale === 'en' || String(locale) === 'ta' ? `Festivals (${festivalItems.length})` : `त्योहार (${festivalItems.length})`}
                    </h3>
                    <div className="space-y-3">
                      {festivalItems.map((f, i) => renderCard(f, i))}
                    </div>
                  </div>
                )}

                {/* ── Vrats Section ── */}
                {showVrats && vratItems.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gold-gradient mb-4" style={headingFont}>
                      {locale === 'en' || String(locale) === 'ta' ? `Vrats & Observances (${vratItems.length})` : `व्रत एवं अनुष्ठान (${vratItems.length})`}
                    </h3>
                    <div className="space-y-3">
                      {vratItems.map((f, i) => renderCard(f, i))}
                    </div>
                  </div>
                )}

                <div className="text-center text-text-secondary text-sm mt-6">
                  {filteredFestivals.length} {locale === 'en' || String(locale) === 'ta' ? 'entries' : 'प्रविष्टियाँ'}
                </div>
              </>
            )}
          </div>
        );
      })()}

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
          festivalSlug={selectedFestival.slug}
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
