'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useLocationStore } from '@/stores/location-store';
import LocationSearch from '@/components/ui/LocationSearch';
import TithiMonthGrid, { type TithiDayData } from '@/components/calendar/TithiMonthGrid';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/types/panchang';
import type { LocaleText } from '@/types/panchang';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_NAMES_HI = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितम्बर','अक्टूबर','नवम्बर','दिसम्बर'];

interface LocationData { lat: number; lng: number; name: string; timezone: string }

export default function TithiCalendarPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const isEn = !isHi;
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [tithiData, setTithiData] = useState<TithiDayData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [festivals, setFestivals] = useState<{ date: string; name: LocaleText; type: string; slug?: string }[]>([]);

  // Location
  const [location, setLocation] = useState<LocationData | null>(null);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const locStore = useLocationStore();

  // Auto-detect location
  useEffect(() => {
    if (locStore.lat && locStore.lng && locStore.timezone) {
      setLocation({ lat: locStore.lat, lng: locStore.lng, name: locStore.name || 'Your Location', timezone: locStore.timezone });
      return;
    }
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        if (data.latitude && data.longitude) {
          const tz = data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
          setLocation({ lat: data.latitude, lng: data.longitude, name: [data.city, data.country_name].filter(Boolean).join(', '), timezone: tz });
        }
      })
      .catch(() => {});
  }, [locStore.lat, locStore.lng, locStore.timezone, locStore.name]);

  // Fetch festivals
  useEffect(() => {
    if (!location) return;
    fetch(`/api/calendar?year=${year}&lat=${location.lat}&lon=${location.lng}&timezone=${encodeURIComponent(location.timezone)}`)
      .then(r => r.json())
      .then(data => {
        setFestivals((data.festivals || []).map((f: { date: string; name: LocaleText; type: string; slug?: string }) => ({
          date: f.date, name: f.name, type: f.type, slug: f.slug,
        })));
      })
      .catch(() => {});
  }, [year, location]);

  // Fetch tithi grid
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const todayStr = now.toISOString().split('T')[0];
  const fetchGrid = useCallback(() => {
    if (!location) return;
    setLoading(true);
    setTithiData(null);
    fetch(`/api/tithi-grid?year=${year}&month=${month + 1}&lat=${location.lat}&lon=${location.lng}&timezone=${encodeURIComponent(location.timezone)}`)
      .then(r => r.json())
      .then(data => {
        if (!data.days) { setLoading(false); return; }
        const enriched: TithiDayData[] = data.days.map((td: TithiDayData) => ({
          ...td,
          festivals: festivals.filter(f => f.date === td.date).map(f => ({ name: f.name, type: f.type, slug: f.slug })),
          isToday: td.date === todayStr,
        }));
        setTithiData(enriched);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [month, year, location, festivals, todayStr]);

  useEffect(() => { fetchGrid(); }, [fetchGrid]);

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };
  const goToToday = () => { setYear(now.getFullYear()); setMonth(now.getMonth()); };

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold-light via-gold-primary to-gold-light bg-clip-text text-transparent mb-2" style={headingFont}>
            {isEn ? 'Tithi Calendar' : 'तिथि पंचांग'}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto">
            {isEn
              ? 'Daily Tithi, Nakshatra, Moon Sign, Sunrise & Sunset — with moon phase icons and festival markers for every day of the month.'
              : 'प्रतिदिन की तिथि, नक्षत्र, चन्द्र राशि, सूर्योदय और सूर्यास्त — चन्द्र कला चिह्न और त्योहार संकेतकों के साथ।'}
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
          ) : (
            <div className="text-text-secondary text-sm">{isEn ? 'Detecting location...' : 'स्थान खोज रहे हैं...'}</div>
          )}
          {showLocationSearch && (
            <div className="w-full max-w-sm">
              <LocationSearch value="" onSelect={(loc) => { setLocation({ lat: loc.lat, lng: loc.lng, name: loc.name, timezone: loc.timezone || 'UTC' }); setShowLocationSearch(false); }}
                placeholder={isEn ? 'Search city...' : 'शहर खोजें...'} />
            </div>
          )}
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button onClick={prevMonth} className="p-2.5 rounded-xl border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-gold-light text-xl font-bold min-w-[200px] text-center" style={headingFont}>
            {(isHi ? MONTH_NAMES_HI : MONTH_NAMES)[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2.5 rounded-xl border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-center mb-5">
          <button onClick={goToToday} className="text-xs px-4 py-1.5 rounded-full border border-gold-primary/20 text-gold-primary hover:bg-gold-primary/10 transition-colors">
            {isEn ? 'Go to Today' : 'आज पर जाएं'}
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-5 justify-center text-xs text-text-secondary">
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-amber-400/80 shadow-sm shadow-amber-400/30" /><span>{isEn ? 'Purnima' : 'पूर्णिमा'}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-[#1a1040] border-2 border-violet-400/40" /><span>{isEn ? 'Amavasya' : 'अमावस्या'}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30" /><span>{isEn ? 'Ekadashi' : 'एकादशी'}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-3 rounded bg-gold-primary/20 border border-gold-primary/30" /><span>{isEn ? 'Festival' : 'त्योहार'}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-3 rounded bg-violet-500/15 border border-violet-500/25" /><span>{isEn ? 'Vrat' : 'व्रत'}</span></div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-primary border-t-transparent" />
          </div>
        ) : tithiData ? (
          <TithiMonthGrid year={year} month={month + 1} days={tithiData} locale={locale}
            onDayClick={(date) => { window.location.href = `/${locale}/panchang?date=${date}`; }} />
        ) : !location ? (
          <div className="text-center py-16 text-text-secondary">
            {isEn ? 'Set your location to view the Tithi Calendar' : 'तिथि कैलेंडर देखने के लिए अपना स्थान सेट करें'}
          </div>
        ) : null}
      </div>
    </main>
  );
}
