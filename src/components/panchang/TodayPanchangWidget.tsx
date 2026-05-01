'use client';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import MSG from '@/messages/components/today-panchang.json';
const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);
import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Loader2, Search, X } from 'lucide-react';
import type { PanchangData, Locale } from '@/types/panchang';
import { TithiIcon, NakshatraIcon, YogaIcon, KaranaIcon, VaraIcon } from '@/components/icons/PanchangIcons';
import { useLocationStore } from '@/stores/location-store';
import { isDevanagariLocale, getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import { tl as _tl } from '@/lib/utils/trilingual';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';
import { TITHIS } from '@/lib/constants/tithis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';

/** Check if a panchang transition time has already passed (local time comparison) */
function isTimePassed(timeStr: string, dateStr?: string): boolean {
  const now = new Date();
  const [h, m] = timeStr.split(':').map(Number);
  if (dateStr) {
    const [y, mo, d] = dateStr.split('-').map(Number);
    const target = new Date(y, mo - 1, d, h, m);
    return now >= target;
  }
  const todayTarget = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  return now >= todayTarget;
}

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
    // Location store timezone takes priority over browser timezone
    const ianaTimezone = useLocationStore.getState().timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
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
              placeholder={msg('searchCityPlaceholder', locale)}
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
              {msg('detectingLocation', locale)}
            </span>
          ) : locationStore.confirmed || panchang ? (
            <>
              <MapPin className="w-4 h-4 text-gold-primary" />
              <span className="text-gold-light text-sm font-medium">{locationStore.name || serverLocation?.name || ''}</span>
              <button onClick={() => setShowSearch(true)}
                className="text-gold-primary/70 text-xs hover:text-gold-light ml-2 underline underline-offset-2">
                {msg('change', locale)}
              </button>
            </>
          ) : (
            <button onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gold-primary/20 hover:border-gold-primary/40 transition-colors">
              <MapPin className="w-4 h-4 text-gold-primary" />
              <span className="text-gold-light text-sm">
                {msg('setLocationToSeePanchang', locale)}
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
            {msg('locationRequired', locale)}
          </p>
          <p className="text-text-secondary/75 text-sm mb-6">
            {msg('panchangDependsOnLocation', locale)}
          </p>
          <button onClick={() => setShowSearch(true)}
            className="px-6 py-3 bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border border-gold-primary/30 rounded-xl text-gold-light font-bold hover:bg-gold-primary/30 transition-all">
            {msg('searchLocation', locale)}
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

  // Transition detection
  const tithiTr = panchang.tithiTransition;
  const nakTr = panchang.nakshatraTransition;
  const tithiPassed = tithiTr ? isTimePassed(tithiTr.endTime, tithiTr.endDate) : false;
  const nakPassed = nakTr ? isTimePassed(nakTr.endTime, nakTr.endDate) : false;
  const yogaPassed = panchang.yogaTransition ? isTimePassed(panchang.yogaTransition.endTime, panchang.yogaTransition.endDate) : false;
  const karanaPassed = panchang.karanaTransition ? isTimePassed(panchang.karanaTransition.endTime, panchang.karanaTransition.endDate) : false;

  const activeYoga = yogaPassed && panchang.yogaTransition ? YOGAS[panchang.yogaTransition.nextNumber - 1] : panchang.yoga;
  const activeKarana = karanaPassed && panchang.karanaTransition ? KARANAS[panchang.karanaTransition.nextNumber - 1] : panchang.karana;

  const nextTithiData = tithiTr ? TITHIS[tithiTr.nextNumber - 1] : null;
  const nextNakData = nakTr ? NAKSHATRAS[nakTr.nextNumber - 1] : null;

  const fmt = fmtDateTime;
  const onwards = msg('onwards', locale);
  const hf = getHeadingFont(locale);

  const cardClass = 'animate-fade-in-up rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center';

  return (
    <div>
      <LocationBar />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 stagger-children">
        {/* ── TITHI ── */}
        <div className={cardClass}>
          <div className="flex justify-center mb-3"><TithiIcon size={56} /></div>
          <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('tithi')}</div>
          <div className={`rounded-lg p-2.5 mb-2 border ${tithiPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
            <div className="text-gold-light text-lg font-bold leading-tight" style={hf}>{_tl(panchang.tithi.name, locale)}</div>
            <div className="text-text-secondary text-xs mt-0.5">{panchang.tithi.paksha === 'shukla' ? t('shukla') : t('krishna')}</div>
            {tithiTr && (
              <div className="mt-2 pt-2 border-t border-gold-primary/10">
                <div className="font-mono text-sm text-amber-300 font-bold">{fmt(tithiTr.startTime, tithiTr.startDate)} — {fmt(tithiTr.endTime, tithiTr.endDate)}</div>
              </div>
            )}
          </div>
          {nextTithiData && tithiTr && (
            <div className={`rounded-lg p-2.5 border ${tithiPassed ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10 opacity-60'}`}>
              <div className="text-gold-light text-lg font-bold leading-tight" style={hf}>{_tl(nextTithiData.name, locale)}</div>
              <div className="text-text-secondary text-xs mt-0.5">{nextTithiData.paksha === 'shukla' ? t('shukla') : t('krishna')}</div>
              <div className="font-mono text-sm text-amber-300 font-bold mt-1.5">{fmt(tithiTr.endTime, tithiTr.endDate)} {onwards}</div>
            </div>
          )}
          {/* Masa / Paksha — both systems */}
          <div className="mt-3 pt-3 border-t border-gold-primary/10 grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-text-secondary/60 uppercase tracking-wider text-[10px]">{locale === 'hi' ? 'अमान्त' : 'Amant'}</div>
              <div className="text-gold-light font-semibold mt-0.5" style={hf}>{_tl(panchang.amantMasa || panchang.masa, locale)}</div>
            </div>
            <div>
              <div className="text-text-secondary/60 uppercase tracking-wider text-[10px]">{locale === 'hi' ? 'पूर्णिमान्त' : 'Purnimant'}</div>
              <div className="text-gold-light font-semibold mt-0.5" style={hf}>{_tl(panchang.purnimantMasa || panchang.masa, locale)}</div>
            </div>
          </div>
        </div>

        {/* ── NAKSHATRA ── */}
        <div className={cardClass}>
          <div className="flex justify-center mb-3"><NakshatraIcon size={56} /></div>
          <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('nakshatra')}</div>
          <div className={`rounded-lg p-2.5 mb-2 border ${nakPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
            <div className="text-gold-light text-lg font-bold leading-tight" style={hf}>{_tl(panchang.nakshatra.name, locale)}</div>
            <div className="text-text-secondary text-xs mt-0.5">{_tl(panchang.nakshatra.deity, locale)}</div>
            {nakTr && (
              <div className="mt-2 pt-2 border-t border-gold-primary/10">
                <div className="font-mono text-sm text-amber-300 font-bold">{fmt(nakTr.startTime, nakTr.startDate)} — {fmt(nakTr.endTime, nakTr.endDate)}</div>
              </div>
            )}
          </div>
          {nextNakData && nakTr && (
            <div className={`rounded-lg p-2.5 border ${nakPassed ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10 opacity-60'}`}>
              <div className="text-gold-light text-lg font-bold leading-tight" style={hf}>{_tl(nextNakData.name, locale)}</div>
              <div className="text-text-secondary text-xs mt-0.5">{_tl(nextNakData.deity, locale)}</div>
              <div className="font-mono text-sm text-amber-300 font-bold mt-1.5">{fmt(nakTr.endTime, nakTr.endDate)} {onwards}</div>
            </div>
          )}
        </div>

        {/* ── YOGA ── */}
        <div className={cardClass}>
          <div className="flex justify-center mb-3"><YogaIcon size={56} /></div>
          <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('yoga')}</div>
          <div className={`rounded-lg p-2.5 mb-2 border ${yogaPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
            <div className="text-gold-light text-lg font-bold leading-tight" style={hf}>{_tl(panchang.yoga.name, locale)}</div>
            <div className="text-text-secondary text-xs mt-0.5">{_tl(panchang.yoga.meaning, locale)}</div>
            {panchang.yogaTransition && (
              <div className="mt-2 pt-2 border-t border-gold-primary/10">
                <div className="font-mono text-sm text-amber-300 font-bold">{fmt(panchang.yogaTransition.startTime, panchang.yogaTransition.startDate)} — {fmt(panchang.yogaTransition.endTime, panchang.yogaTransition.endDate)}</div>
              </div>
            )}
          </div>
          {panchang.yogaTransition && (
            <div className={`rounded-lg p-2.5 border ${yogaPassed ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10 opacity-60'}`}>
              <div className="text-gold-light text-lg font-bold leading-tight" style={hf}>{_tl(panchang.yogaTransition.nextName, locale)}</div>
              <div className="text-text-secondary text-xs mt-0.5">{_tl(YOGAS[panchang.yogaTransition.nextNumber - 1]?.meaning, locale)}</div>
              <div className="font-mono text-sm text-amber-300 font-bold mt-1.5">{fmt(panchang.yogaTransition.endTime, panchang.yogaTransition.endDate)} {onwards}</div>
            </div>
          )}
        </div>

        {/* ── KARANA ── */}
        <div className={cardClass}>
          <div className="flex justify-center mb-3"><KaranaIcon size={56} /></div>
          <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('karana')}</div>
          <div className={`rounded-lg p-2.5 mb-2 border ${karanaPassed ? 'border-gold-primary/10 opacity-60' : 'border-gold-primary/30 bg-gold-primary/5'}`}>
            <div className="text-gold-light text-lg font-bold leading-tight" style={hf}>{_tl(panchang.karana.name, locale)}</div>
            <div className="text-text-secondary text-xs mt-0.5">
              {panchang.karana.type === 'chara' ? msg('movable', locale) : panchang.karana.type === 'sthira' ? msg('fixed', locale) : msg('special', locale)}
            </div>
            {panchang.karanaTransition && (
              <div className="mt-2 pt-2 border-t border-gold-primary/10">
                <div className="font-mono text-sm text-amber-300 font-bold">{fmt(panchang.karanaTransition.startTime, panchang.karanaTransition.startDate)} — {fmt(panchang.karanaTransition.endTime, panchang.karanaTransition.endDate)}</div>
              </div>
            )}
          </div>
          {panchang.karanaTransition && (
            <div className={`rounded-lg p-2.5 border ${karanaPassed ? 'border-gold-primary/30 bg-gold-primary/5' : 'border-gold-primary/10 opacity-60'}`}>
              <div className="text-gold-light text-lg font-bold leading-tight" style={hf}>{_tl(panchang.karanaTransition.nextName, locale)}</div>
              <div className="text-text-secondary text-xs mt-0.5">
                {(() => { const nk = KARANAS[panchang.karanaTransition!.nextNumber - 1]; return nk?.type === 'chara' ? msg('movable', locale) : nk?.type === 'sthira' ? msg('fixed', locale) : msg('special', locale); })()}
              </div>
              <div className="font-mono text-sm text-amber-300 font-bold mt-1.5">{fmt(panchang.karanaTransition.endTime, panchang.karanaTransition.endDate)} {onwards}</div>
            </div>
          )}
        </div>

        {/* ── VARA ── */}
        <div className={cardClass}>
          <div className="flex justify-center mb-3"><VaraIcon size={56} /></div>
          <div className="text-gold-dark text-xs uppercase tracking-widest mb-3 font-semibold">{t('vara')}</div>
          <div className="text-gold-light text-2xl font-bold leading-tight" style={hf}>{_tl(panchang.vara.name, locale)}</div>
          <div className="text-text-secondary text-xs mt-2">{_tl(panchang.vara.ruler, locale)}</div>
        </div>
      </div>

      {/* ── SPECIAL AUSPICIOUS YOGAS (compact) ── */}
      {panchang.specialYogas && panchang.specialYogas.filter(y => y.isActive).length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-gold-primary text-xs font-semibold">✦</span>
          {panchang.specialYogas.filter(y => y.isActive).map((yoga, i) => (
            <span key={i} className="text-gold-light text-xs font-bold auspicious-glow px-2 py-0.5 rounded-full border border-gold-primary/20 bg-gold-primary/5" style={hf}>
              {_tl(yoga.name, locale)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
