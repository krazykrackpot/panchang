'use client';

import { create } from 'zustand';

const STORAGE_KEY = 'panchang_location';

interface StoredLocation {
  lat: number;
  lng: number;
  name: string;
  timezone: string | null;
}

interface LocationState {
  lat: number | null;
  lng: number | null;
  name: string;
  timezone: string | null;
  confirmed: boolean;
  detecting: boolean;
  setLocation: (lat: number, lng: number, name: string, timezone?: string) => void;
  setTimezone: (tz: string) => void;
  setDetecting: (v: boolean) => void;
  detect: () => void;
}

function loadFromStorage(): StoredLocation | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
      return parsed as StoredLocation;
    }
  } catch {
    // ignore corrupted data
  }
  return null;
}

function saveToStorage(lat: number, lng: number, name: string, timezone: string | null) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lng, name, timezone }));
  } catch {
    // ignore storage errors
  }
}

const stored = loadFromStorage();

export const useLocationStore = create<LocationState>((set, get) => ({
  lat: stored?.lat ?? null,
  lng: stored?.lng ?? null,
  name: stored?.name ?? '',
  timezone: stored?.timezone ?? null,
  confirmed: stored !== null,
  detecting: false,

  setLocation: (lat, lng, name, timezone?) => {
    const tz = timezone ?? (typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : null);
    saveToStorage(lat, lng, name, tz);
    set({ lat, lng, name, timezone: tz, confirmed: true, detecting: false });
  },

  setTimezone: (tz) => {
    const state = get();
    if (state.lat !== null && state.lng !== null) {
      saveToStorage(state.lat, state.lng, state.name, tz);
    }
    set({ timezone: tz });
  },

  setDetecting: (v) => set({ detecting: v }),

  detect: () => {
    if (get().confirmed || get().detecting) return;
    set({ detecting: true });

    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.village || '';
        const country = data.address?.country || '';
        return [city, country].filter(Boolean).join(', ') || `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
      } catch {
        return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
      }
    };

    const fromIP = () => {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data.latitude && data.longitude) {
            const name = [data.city, data.country_name].filter(Boolean).join(', ');
            const timezone = data.timezone || null;
            saveToStorage(data.latitude, data.longitude, name, timezone);
            set({ lat: data.latitude, lng: data.longitude, name, timezone, confirmed: true, detecting: false });
          } else {
            set({ detecting: false });
          }
        })
        .catch(() => set({ detecting: false }));
    };

    if (!('geolocation' in navigator)) { fromIP(); return; }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const name = await reverseGeocode(latitude, longitude);
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        saveToStorage(latitude, longitude, name, timezone);
        set({ lat: latitude, lng: longitude, name, timezone, confirmed: true, detecting: false });
      },
      () => fromIP(),
      { timeout: 8000 }
    );
  },
}));
