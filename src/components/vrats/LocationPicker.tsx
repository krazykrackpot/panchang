'use client';

/**
 * Thin shell around the canonical LocationSearch component (Nominatim
 * global geocoder + tz-from-coords). Adds a "use my current location"
 * button that reverse-geocodes via Nominatim — same pattern used in
 * panchang/nivas/remedies/planets/auspicious.
 *
 * DO NOT inline a custom city list here — Lesson B (single source of
 * truth). Earlier revision used a static 800-city dataset, which
 * silently lost every village (Corseaux, etc.) and snapped Swiss
 * geolocation to London. Always go through Nominatim like BirthForm.
 */
import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { resolveCurrentLocationTimezone } from '@/lib/utils/timezone';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

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
    searchPlaceholder: 'Search city, town, or village',
    locationDenied: 'Location access denied. Search for your city instead.',
    locationError: 'Could not detect — search for your city instead.',
    selected: 'Selected',
  },
  hi: {
    title: 'अपना व्रत स्थान चुनें',
    subtitle:
      'व्रत आपके शहर के स्थानीय सूर्योदय के अनुसार किया जाता है। अपना वास्तविक स्थान चुनें — जन्म स्थान नहीं।',
    useCurrent: 'मेरा वर्तमान स्थान',
    detecting: 'पता लगा रहे हैं…',
    searchPlaceholder: 'शहर, क़स्बा या गाँव खोजें',
    locationDenied: 'स्थान अनुमति अस्वीकार। शहर खोजें।',
    locationError: 'पता नहीं चला — शहर खोजें।',
    selected: 'चयनित',
  },
};

export function LocationPicker({ locale, current, onSelect }: Props) {
  const isHi = isDevanagariLocale(locale);
  const c = isHi ? COPY.hi : COPY.en;
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectCurrent = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError(c.locationError);
      return;
    }
    setDetecting(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          // Reverse geocode via Nominatim — same call pattern as
          // panchang/nivas/page.tsx. Knows villages globally.
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12`,
            { headers: { 'Accept-Language': 'en' } },
          );
          if (!res.ok) throw new Error(`reverse geocode ${res.status}`);
          const data: { address?: Record<string, string>; display_name?: string } = await res.json();
          const addr = data.address ?? {};
          const place =
            addr.village ||
            addr.town ||
            addr.city ||
            addr.municipality ||
            addr.county ||
            (data.display_name?.split(',')[0] ?? '');
          const country = addr.country ?? '';
          const city = [place, country].filter(Boolean).join(', ') || `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
          // Resolve IANA tz from coords — NEVER browser tz.
          const tz = await resolveCurrentLocationTimezone(lat, lng);
          onSelect({ city, lat, lng, tz });
        } catch (err) {
          console.error('[vrat-location] reverse geocode failed:', err);
          setError(c.locationError);
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        setDetecting(false);
        setError(err.code === 1 ? c.locationDenied : c.locationError);
      },
      { timeout: 10_000, enableHighAccuracy: false },
    );
  };

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

      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <button
          type="button"
          onClick={detectCurrent}
          disabled={detecting}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gold-primary/10 border border-gold-primary/30 text-gold-light rounded-lg hover:bg-gold-primary/20 transition text-sm disabled:opacity-50 shrink-0"
        >
          {detecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
          {detecting ? c.detecting : c.useCurrent}
        </button>
        <div className="flex-1 min-w-0">
          <LocationSearch
            value=""
            placeholder={c.searchPlaceholder}
            onSelect={async (loc) => {
              // LocationSearch already resolves tz from coords via
              // resolveCurrentLocationTimezone — trust it.
              onSelect({ city: loc.name, lat: loc.lat, lng: loc.lng, tz: loc.timezone });
            }}
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-amber-400">{error}</p>
      )}
    </div>
  );
}
