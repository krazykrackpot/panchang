'use client';

import { tl } from '@/lib/utils/trilingual';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Loader2, Search, X } from 'lucide-react';
import type { PanchangData, Locale } from '@/types/panchang';
import { TithiIcon, NakshatraIcon, YogaIcon, KaranaIcon, VaraIcon } from '@/components/icons/PanchangIcons';
import { useLocationStore } from '@/stores/location-store';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';

interface Props {
  serverPanchang?: PanchangData;
  serverLocation?: { lat: number; lng: number; name: string };
}

// Check if two locations are close enough to skip re-fetch (~10km)
function locationsMatch(a: { lat: number; lng: number }, b: { lat: number; lng: number }): boolean {
  return Math.abs(a.lat - b.lat) < 0.1 && Math.abs(a.lng - b.lng) < 0.1;
}

export default function TodayPanchangWidget({ serverPanchang, serverLocation }: Props) {
  const [panchang, setPanchang] = useState<PanchangData | null>(serverPanchang ?? null);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [searching, setSearching] = useState(false);
  const usedServerData = useRef(!!serverPanchang);
  const locale = useLocale() as Locale;
  const t = useTranslations('panchang');

  const locationStore = useLocationStore();

  // Fetch panchang when location is confirmed
  const fetchPanchang = useCallback((lat: number, lng: number, name: string) => {
    // If we already have server data for a nearby location, skip the fetch
    if (usedServerData.current && serverLocation && locationsMatch({ lat, lng }, serverLocation)) {
      // Update location name to match user's stored name (more specific than geo-IP city)
      usedServerData.current = false;
      return;
    }
    usedServerData.current = false;
    setLoading(true);
    const now = new Date();
    const ianaTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    fetch(`/api/panchang?year=${now.getFullYear()}&month=${now.getMonth() + 1}&day=${now.getDate()}&lat=${lat}&lng=${lng}&timezone=${encodeURIComponent(ianaTimezone)}&location=${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => { setPanchang(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [serverLocation]);

  // React to location store changes
  useEffect(() => {
    if (locationStore.confirmed && locationStore.lat !== null && locationStore.lng !== null) {
      fetchPanchang(locationStore.lat, locationStore.lng, locationStore.name);
    }
  }, [locationStore.confirmed, locationStore.lat, locationStore.lng, locationStore.name, fetchPanchang]);

  // If we have server panchang but no stored location, auto-set from server geo
  useEffect(() => {
    if (serverPanchang && serverLocation && !locationStore.confirmed && !locationStore.detecting) {
      locationStore.setLocation(serverLocation.lat, serverLocation.lng, serverLocation.name);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Search locations via Nominatim
  useEffect(() => {
    if (!showSearch || searchQuery.length < 3) return;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
        const data = await res.json();
        setSearchResults(data.map((item: { display_name: string; lat: string; lon: string }) => ({
          name: item.display_name.split(',').slice(0, 3).join(',').trim(),
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        })));
      } catch { setSearchResults([]); }
      setSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, showSearch]);

  // Select a search result — update global store
  const selectLocation = (result: { name: string; lat: number; lng: number }) => {
    locationStore.setLocation(result.lat, result.lng, result.name);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Format transition times
  const MONTHS = isDevanagariLocale(locale)
    ? ['जन.','फर.','मार्च','अप्रै.','मई','जून','जुला.','अग.','सित.','अक्टू.','नव.','दिस.']
    : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtDateTime = (time: string, date?: string) => {
    if (!date) return time;
    const [, m, d] = date.split('-').map(Number);
    return `${time}, ${d} ${MONTHS[m - 1]}`;
  };
  const timingStr = (tr?: { startTime: string; startDate?: string; endTime: string; endDate?: string }) => {
    if (!tr) return null;
    const start = fmtDateTime(tr.startTime, tr.startDate);
    const end = fmtDateTime(tr.endTime, tr.endDate);
    return { start, end };
  };

  // ─── Location Bar (below heading, for override) ────────────────
  const LocationBar = () => (
    <div className="mb-6">
      {showSearch ? (
        <div className="relative max-w-md mx-auto">
          <div className="flex items-center gap-2 bg-bg-primary/60 border border-gold-primary/25 rounded-xl px-4 py-3">
            <Search className="w-4 h-4 text-gold-primary shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tl({ en: 'Search city or place...', hi: 'शहर या स्थान खोजें...', sa: 'शहर या स्थान खोजें...' }, locale)}
              className="flex-1 bg-transparent text-text-primary text-sm placeholder:text-text-secondary/70 focus:outline-none"
              autoFocus
            />
            {searching && <Loader2 className="w-4 h-4 text-gold-primary animate-spin" />}
            <button onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }} className="text-text-secondary hover:text-gold-light">
              <X className="w-4 h-4" />
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-bg-primary/95 backdrop-blur-xl border border-gold-primary/20 rounded-xl shadow-2xl shadow-black/40 z-50 max-h-60 overflow-y-auto">
              {searchResults.map((r, i) => (
                <button key={i} onClick={() => selectLocation(r)}
                  className="flex items-start gap-2 w-full text-left px-4 py-3 text-sm text-text-secondary hover:text-gold-light hover:bg-gold-primary/10 transition-colors border-b border-gold-primary/5 last:border-b-0">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gold-dark" />
                  <span>{r.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          {locationStore.detecting ? (
            <span className="flex items-center gap-2 text-text-secondary text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-gold-primary" />
              {tl({ en: 'Detecting your location...', hi: 'आपका स्थान खोज रहे हैं...', sa: 'आपका स्थान खोज रहे हैं...' }, locale)}
            </span>
          ) : locationStore.confirmed || panchang ? (
            <>
              <MapPin className="w-4 h-4 text-gold-primary" />
              <span className="text-gold-light text-sm font-medium">{locationStore.name || serverLocation?.name || ''}</span>
              <button onClick={() => setShowSearch(true)}
                className="text-gold-primary/70 text-xs hover:text-gold-light ml-2 underline underline-offset-2">
                {tl({ en: 'Change', hi: 'बदलें', sa: 'बदलें' }, locale)}
              </button>
            </>
          ) : (
            <button onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold-primary/20 hover:border-gold-primary/40 transition-colors">
              <MapPin className="w-4 h-4 text-gold-primary" />
              <span className="text-gold-light text-sm">
                {tl({ en: 'Set your location to see Panchang', hi: 'पंचांग देखने के लिए स्थान चुनें', sa: 'पंचांग देखने के लिए स्थान चुनें' }, locale)}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );

  // ─── No location and no server data ────────────────────────────
  if (!panchang && !locationStore.detecting && !locationStore.confirmed) {
    return (
      <div>
        <LocationBar />
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 sm:p-8 md:p-12 text-center">
          <MapPin className="w-12 h-12 text-gold-primary/40 mx-auto mb-4" />
          <p className="text-text-secondary text-lg mb-2" style={getBodyFont(locale)}>
            {tl({ en: 'Location required for accurate Panchang', hi: 'सटीक पंचांग के लिए स्थान आवश्यक', sa: 'सटीक पंचांग के लिए स्थान आवश्यक' }, locale)}
          </p>
          <p className="text-text-secondary/75 text-sm mb-6">
            {tl({ en: 'Panchang calculations depend on sunrise/sunset at your location', hi: 'पंचांग गणना आपके स्थान के सूर्योदय/सूर्यास्त पर निर्भर है', sa: 'पंचांग गणना आपके स्थान के सूर्योदय/सूर्यास्त पर निर्भर है' }, locale)}
          </p>
          <button onClick={() => setShowSearch(true)}
            className="px-6 py-3 bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border border-gold-primary/30 rounded-xl text-gold-light font-bold hover:bg-gold-primary/30 transition-all">
            {tl({ en: 'Search Location', hi: 'स्थान खोजें', sa: 'स्थान खोजें' }, locale)}
          </button>
        </div>
      </div>
    );
  }

  // ─── Detecting / Loading ───────────────────────────────────────
  if (!panchang && (locationStore.detecting || loading)) {
    return (
      <div>
        <LocationBar />
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!panchang) return <LocationBar />;

  const elements = [
    { label: t('tithi'), value: panchang.tithi.name[locale], sub: panchang.tithi.paksha === 'shukla' ? t('shukla') : t('krishna'), timing: timingStr(panchang.tithiTransition), Icon: TithiIcon },
    { label: t('nakshatra'), value: panchang.nakshatra.name[locale], sub: panchang.nakshatra.deity[locale], timing: timingStr(panchang.nakshatraTransition), Icon: NakshatraIcon },
    { label: t('yoga'), value: panchang.yoga.name[locale], sub: panchang.yoga.meaning[locale], timing: timingStr(panchang.yogaTransition), Icon: YogaIcon },
    { label: t('karana'), value: panchang.karana.name[locale], sub: '', timing: timingStr(panchang.karanaTransition), Icon: KaranaIcon },
    { label: t('vara'), value: panchang.vara.name[locale], sub: panchang.vara.ruler[locale], timing: null, Icon: VaraIcon },
  ];

  return (
    <div>
      <LocationBar />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 stagger-children">
        {elements.map((el) => (
          <div
            key={el.label}
            className="animate-fade-in-up rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 md:p-8 text-center min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center"
          >
            <div className="flex justify-center mb-4"><el.Icon size={64} /></div>
            <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{el.label}</div>
            <div className="text-gold-light text-xl sm:text-2xl font-bold" style={getHeadingFont(locale)}>
              {el.value}
            </div>
            {el.sub && (
              <div className="text-text-secondary text-sm mt-2" style={getBodyFont(locale)}>{el.sub}</div>
            )}
            {el.timing && (
              <div className="mt-3 pt-3 border-t border-gold-primary/10 w-full">
                <div className="flex items-center justify-center gap-3">
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-wider text-text-secondary/65 mb-0.5">{tl({ en: 'Starts', hi: 'आरम्भ', sa: 'आरम्भ' }, locale)}</div>
                    <div className="font-mono text-sm font-bold text-amber-300">{el.timing.start}</div>
                  </div>
                  <span className="text-text-secondary/50 text-lg">&rarr;</span>
                  <div className="text-center">
                    <div className="text-xs uppercase tracking-wider text-text-secondary/65 mb-0.5">{tl({ en: 'Ends', hi: 'समाप्ति', sa: 'समाप्ति' }, locale)}</div>
                    <div className="font-mono text-sm font-bold text-rose-300">{el.timing.end}</div>
                  </div>
                </div>
                <div className="text-xs text-text-secondary/55 text-center mt-1">24h</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
