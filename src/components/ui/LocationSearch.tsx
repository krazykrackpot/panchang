'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationResult {
  name: string;
  lat: number;
  lng: number;
  timezone: string;
}

interface LocationSearchProps {
  value: string;
  onSelect: (location: LocationResult) => void;
  placeholder?: string;
  className?: string;
}

// Resolve IANA timezone from lat/lng using timeapi.io (free, no API key)
// Falls back to longitude-based estimation if API fails
async function resolveTimezoneFromCoords(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lng}`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.timeZone) return data.timeZone; // IANA string e.g. "Asia/Kolkata"
    }
  } catch { /* API failed — use fallback */ }

  // Fallback: estimate from longitude (±1 hour accuracy, enough for most cases)
  // This is a last resort — the API should handle 99% of cases
  const offsetHours = Math.round(lng / 15);
  // Map common offsets to well-known IANA zones
  const OFFSET_TO_IANA: Record<number, string> = {
    '-12': 'Etc/GMT+12', '-11': 'Pacific/Midway', '-10': 'Pacific/Honolulu',
    '-9': 'America/Anchorage', '-8': 'America/Los_Angeles', '-7': 'America/Denver',
    '-6': 'America/Chicago', '-5': 'America/New_York', '-4': 'America/Halifax',
    '-3': 'America/Sao_Paulo', '-2': 'Atlantic/South_Georgia', '-1': 'Atlantic/Azores',
    '0': 'UTC', '1': 'Europe/Paris', '2': 'Europe/Helsinki',
    '3': 'Europe/Moscow', '4': 'Asia/Dubai', '5': 'Asia/Karachi',
    '6': 'Asia/Kolkata', '7': 'Asia/Bangkok', '8': 'Asia/Shanghai',
    '9': 'Asia/Tokyo', '10': 'Australia/Sydney', '11': 'Pacific/Noumea',
    '12': 'Pacific/Auckland',
  };
  return OFFSET_TO_IANA[String(offsetHours) as unknown as number] || 'UTC';
}

// Use OpenStreetMap Nominatim (free, no API key needed)
async function searchLocations(query: string): Promise<LocationResult[]> {
  if (query.length < 3) return [];

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } }
  );

  if (!response.ok) return [];
  const data = await response.json();

  // Resolve timezone for each result from its coordinates — NOT the browser
  const results = await Promise.all(
    data.map(async (item: { display_name: string; lat: string; lon: string }) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      const timezone = await resolveTimezoneFromCoords(lat, lng);
      return {
        name: item.display_name.split(',').slice(0, 3).join(','),
        lat,
        lng,
        timezone,
      };
    })
  );

  return results;
}

export default function LocationSearch({ value, onSelect, placeholder = 'Search city or place...', className = '' }: LocationSearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleChange(val: string) {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.length >= 3) {
      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        const locs = await searchLocations(val);
        setResults(locs);
        setIsOpen(locs.length > 0);
        setLoading(false);
      }, 400);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }

  function handleSelect(loc: LocationResult) {
    setQuery(loc.name);
    setIsOpen(false);
    onSelect(loc);
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary placeholder:text-text-secondary/70 focus:border-gold-primary/40 focus:outline-none text-sm"
          aria-label="Search location"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-primary animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-bg-primary/95 backdrop-blur-xl border border-gold-primary/20 rounded-xl shadow-2xl shadow-black/40 z-50 max-h-60 overflow-y-auto">
          {results.map((loc, i) => (
            <button
              key={i}
              onClick={() => handleSelect(loc)}
              className="flex items-start gap-2 w-full text-left px-4 py-3 text-sm text-text-secondary hover:text-gold-light hover:bg-gold-primary/10 transition-colors border-b border-gold-primary/5 last:border-b-0"
            >
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gold-dark" />
              <span>{loc.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
