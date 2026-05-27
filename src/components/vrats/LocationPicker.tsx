'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { ALL_CITIES } from '@/lib/constants/cities-extended';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';

export interface SelectedLocation {
  city: string;
  lat: number;
  lng: number;
  tz: string;
}

interface Props {
  locale: string;
  current?: SelectedLocation | null;
  onSelect: (loc: SelectedLocation) => void;
}

const COPY = {
  en: {
    title: 'Pick your vrat location',
    subtitle:
      'Vrats are observed on the local sunrise of your city. Pick where you actually fast — not your birthplace.',
    useCurrent: 'Use my current location',
    detecting: 'Detecting…',
    searchPlaceholder: 'Search city',
    locationDenied: 'Location access denied. Pick a city manually.',
    locationError: 'Could not detect — pick a city manually.',
    selected: 'Selected',
  },
  hi: {
    title: 'अपना व्रत स्थान चुनें',
    subtitle:
      'व्रत आपके शहर के स्थानीय सूर्योदय के अनुसार किया जाता है। अपना वास्तविक स्थान चुनें — जन्म स्थान नहीं।',
    useCurrent: 'मेरा वर्तमान स्थान',
    detecting: 'पता लगा रहे हैं…',
    searchPlaceholder: 'शहर खोजें',
    locationDenied: 'स्थान अनुमति अस्वीकार। मैन्युअल चुनें।',
    locationError: 'पता नहीं चला — मैन्युअल चुनें।',
    selected: 'चयनित',
  },
};

// Find the nearest city in ALL_CITIES to a given lat/lng (great-circle).
function findNearestCity(lat: number, lng: number): { city: string; lat: number; lng: number; tz: string } | null {
  let best: typeof ALL_CITIES[0] | null = null;
  let bestDist = Infinity;
  for (const c of ALL_CITIES) {
    // Cheap squared-degrees distance — good enough to find nearest of ~800 cities.
    const dLat = c.lat - lat;
    const dLng = c.lng - lng;
    const d = dLat * dLat + dLng * dLng;
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best ? { city: best.name.en, lat: best.lat, lng: best.lng, tz: best.timezone } : null;
}

export function LocationPicker({ locale, current, onSelect }: Props) {
  const isHi = isDevanagariLocale(locale);
  const c = isHi ? COPY.hi : COPY.en;
  const [query, setQuery] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_CITIES.slice(0, 12); // popular default
    return ALL_CITIES.filter(
      (city) =>
        city.name.en.toLowerCase().includes(q) ||
        (city.name.hi || '').includes(q) ||
        (city.state ?? '').toLowerCase().includes(q),
    ).slice(0, 20);
  }, [query]);

  const detectCurrent = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError(c.locationError);
      return;
    }
    setDetecting(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = findNearestCity(pos.coords.latitude, pos.coords.longitude);
        setDetecting(false);
        if (nearest) onSelect(nearest);
        else setError(c.locationError);
      },
      (err) => {
        setDetecting(false);
        setError(err.code === 1 ? c.locationDenied : c.locationError);
      },
      { timeout: 8000, enableHighAccuracy: false },
    );
  };

  // Auto-focus the search box if there's no current location.
  useEffect(() => {
    if (!current && typeof window !== 'undefined') {
      const el = document.getElementById('vrat-loc-search');
      if (el) (el as HTMLInputElement).focus();
    }
  }, [current]);

  const titleFontStyle = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined;

  return (
    <div>
      <h3 className="text-base font-semibold text-text-primary mb-1" style={titleFontStyle}>
        {c.title}
      </h3>
      <p className="text-xs text-text-secondary mb-3">{c.subtitle}</p>

      {current && (
        <div className="mb-3 p-3 bg-gold-primary/10 border border-gold-primary/20 rounded-lg flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-gold-light shrink-0" />
          <span className="text-gold-light">
            <span className="text-text-secondary uppercase tracking-wider text-[10px] mr-1.5">{c.selected}</span>
            {current.city} <span className="text-text-secondary text-xs">({current.tz})</span>
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <button
          type="button"
          onClick={detectCurrent}
          disabled={detecting}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gold-primary/10 border border-gold-primary/30 text-gold-light rounded-lg hover:bg-gold-primary/20 transition text-sm disabled:opacity-50"
        >
          {detecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          {detecting ? c.detecting : c.useCurrent}
        </button>
        <input
          id="vrat-loc-search"
          type="text"
          placeholder={c.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#1a1040]/40 border border-white/10 rounded-lg text-text-primary text-sm focus:outline-none focus:border-gold-primary/40"
        />
      </div>

      {error && (
        <p className="text-xs text-amber-400 mb-3">{error}</p>
      )}

      <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
        {filtered.map((city) => (
          <button
            key={city.slug}
            type="button"
            onClick={() =>
              onSelect({ city: tl(city.name, locale), lat: city.lat, lng: city.lng, tz: city.timezone })
            }
            className="w-full text-left px-3 py-2 rounded-lg border border-white/5 hover:border-gold-primary/30 hover:bg-gold-primary/5 transition flex items-center justify-between"
          >
            <div>
              <span className="text-sm text-text-primary">{tl(city.name, locale)}</span>
              {city.state && (
                <span className="text-xs text-text-secondary ml-2">{city.state}</span>
              )}
            </div>
            <span className="text-[10px] text-text-secondary">{city.timezone.split('/').pop()}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-text-secondary text-center py-4">No matches.</p>
        )}
      </div>
    </div>
  );
}
