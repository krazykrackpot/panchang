'use client';

import { create } from 'zustand';
import { fetchApiGeo } from '@/lib/utils/geo-from-api';

const STORAGE_KEY = 'panchang_location';

interface StoredLocation {
  lat: number;
  lng: number;
  name: string;
  timezone: string | null;
  /** How this location was set: 'auto' (geolocation/IP) or 'manual' (user picked a city) */
  source?: 'auto' | 'manual';
}

interface LocationState {
  lat: number | null;
  lng: number | null;
  name: string;
  timezone: string | null;
  confirmed: boolean;
  detecting: boolean;
  /** How the current location was set */
  source: 'auto' | 'manual';
  /** True when an auto-detected location has a TZ mismatch with the browser — banner should show */
  stale: boolean;
  setLocation: (lat: number, lng: number, name: string, timezone?: string) => void;
  setLocationAuto: (lat: number, lng: number, name: string, timezone: string) => void;
  setTimezone: (tz: string) => void;
  setDetecting: (v: boolean) => void;
  /** Dismiss the stale banner — user confirmed the current location is correct */
  confirmCurrent: () => void;
  /** Dismiss the stale banner — user wants to re-detect */
  clearAndRedetect: () => void;
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

function saveToStorage(lat: number, lng: number, name: string, timezone: string | null, source: 'auto' | 'manual') {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lng, name, timezone, source }));
  } catch {
    // ignore storage errors
  }
}

/**
 * Reverse geocode lat/lng to a human-readable place name.
 * Returns a proper name ("Vevey, Switzerland") or empty string on failure.
 * NEVER returns coordinates as a name — that was the root cause of the
 * "46.47°, 6.83°" bug in the navbar.
 */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
    );
    const data = await res.json();
    const city = data.address?.city || data.address?.town || data.address?.village || '';
    const country = data.address?.country || '';
    return [city, country].filter(Boolean).join(', ');
  } catch (err) {
    console.error('[location] Reverse geocode failed:', err);
    return '';
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
  source: stored?.source ?? 'auto',
  stale: false,

  // Manual location selection (user picked a city from LocationSearch/city picker)
  // NEVER overridden by detect() — the user's deliberate choice is sacred.
  setLocation: (lat, lng, name, timezone?) => {
    const tz = timezone ?? (typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : null);
    saveToStorage(lat, lng, name, tz, 'manual');
    set({ lat, lng, name, timezone: tz, confirmed: true, detecting: false, source: 'manual', stale: false });
  },

  // Auto-detected location (geolocation API, IP lookup, Vercel geo headers)
  // CAN be overridden by detect() if browser TZ changes (user travelled).
  setLocationAuto: (lat, lng, name, timezone) => {
    saveToStorage(lat, lng, name, timezone, 'auto');
    set({ lat, lng, name, timezone, confirmed: true, detecting: false, source: 'auto', stale: false });
  },

  setTimezone: (tz) => {
    const state = get();
    if (state.lat !== null && state.lng !== null) {
      saveToStorage(state.lat, state.lng, state.name, tz, state.source);
    }
    set({ timezone: tz });
  },

  setDetecting: (v) => set({ detecting: v }),

  // User confirmed the stale location is still correct → promote to manual
  confirmCurrent: () => {
    const state = get();
    if (state.lat !== null && state.lng !== null) {
      saveToStorage(state.lat!, state.lng!, state.name, state.timezone, 'manual');
    }
    set({ stale: false, source: 'manual' });
  },

  // User wants to re-detect → clear everything and run fresh detection
  clearAndRedetect: () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    set({ confirmed: false, lat: null, lng: null, name: '', timezone: null, source: 'auto', stale: false, detecting: false });
    // Trigger detection after clearing
    setTimeout(() => get().detect(), 0);
  },

  detect: () => {
    if (get().detecting) return;

    const current = get();

    // ── Fix missing name on an existing confirmed location ──
    const nameIsMissing = !current.name || /^\d+\.\d+°?\s*,\s*\d+\.\d+°?$/.test(current.name.trim());
    if (current.confirmed && current.lat !== null && current.lng !== null && nameIsMissing) {
      (async () => {
        const name = await reverseGeocode(current.lat!, current.lng!);
        if (name) {
          saveToStorage(current.lat!, current.lng!, name, current.timezone, current.source);
          set({ name });
        }
      })();
      return;
    }

    // ── Manual selection: NEVER override ──
    // User deliberately picked this city. Only the user can change it via the city picker.
    if (current.confirmed && current.source === 'manual') {
      return;
    }

    // ── Auto-detected + confirmed: check if user may have moved ──
    if (current.confirmed && current.source === 'auto' && current.timezone) {
      const browserTz = typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;
      if (browserTz && browserTz !== current.timezone) {
        // Check if same UTC offset right now (handles aliases like Europe/Berlin ≈ Europe/Zurich)
        try {
          const now = new Date();
          const getOffset = (tz: string) =>
            new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
              .formatToParts(now)
              .find(p => p.type === 'timeZoneName')?.value;
          if (getOffset(browserTz) === getOffset(current.timezone!)) return; // Same offset — not a real mismatch
        } catch { /* proceed to flag as stale */ }

        // Genuine TZ mismatch — don't clear, just flag as stale.
        // TimezoneMismatchBanner will offer the user a choice.
        console.info(`[location] Auto-detected TZ ${current.timezone} ≠ browser ${browserTz} — flagging stale`);
        set({ stale: true });
        return;
      }
      // TZ matches — keep stored location
      return;
    }

    // ── Auto-detected, confirmed, no timezone stored ──
    if (current.confirmed) {
      return;
    }

    // ── Not confirmed — run full detection ──
    set({ detecting: true });

    const fromIP = async () => {
      try {
        const data = await fetchApiGeo();
        if (data && data.latitude !== null && data.longitude !== null) {
          const name = await reverseGeocode(data.latitude, data.longitude);
          const timezone = data.timezone || (typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : null);
          saveToStorage(data.latitude, data.longitude, name, timezone, 'auto');
          set({ lat: data.latitude, lng: data.longitude, name, timezone, confirmed: true, detecting: false, source: 'auto', stale: false });
        } else {
          set({ detecting: false });
        }
      } catch (err) {
        console.error('[location-store] geo lookup failed:', err);
        set({ detecting: false });
      }
    };

    if (!('geolocation' in navigator)) { fromIP(); return; }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const name = await reverseGeocode(latitude, longitude);
        // Resolve timezone from coordinates, NOT browser — browser TZ can differ from
        // physical location (VPN, travel, OS misconfiguration). Fallback to browser only
        // if coordinate-based resolution fails.
        let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        try {
          const { resolveCurrentLocationTimezone } = await import('@/lib/utils/timezone');
          timezone = await resolveCurrentLocationTimezone(latitude, longitude);
        } catch {
          // Coordinate-based resolution failed — keep browser fallback
        }
        saveToStorage(latitude, longitude, name, timezone, 'auto');
        set({ lat: latitude, lng: longitude, name, timezone, confirmed: true, detecting: false, source: 'auto', stale: false });
      },
      () => fromIP(),
      { timeout: 8000 },
    );
  },
}));
