import { create } from 'zustand';

export type TraditionPreference = 'north' | 'south' | 'all';

interface PreferenceState {
  tradition: TraditionPreference;
  /** True once `hydrate()` has read from localStorage. Consumers can gate
   *  tradition-dependent rendering on this flag to avoid SSR/CSR mismatch. */
  hydrated: boolean;
  setTradition: (t: TraditionPreference) => void;
  /** Read the persisted tradition from localStorage and set state.
   *  Call from a client `useEffect` once per mount — idempotent. */
  hydrate: () => void;
}

/**
 * Tradition (north / south / all) preference store.
 *
 * SSR/CSR hydration discipline (Gemini PR #473 MEDIUM):
 *
 * The factory MUST NOT read `localStorage` synchronously — if it did, the
 * server-rendered HTML would carry `tradition: 'all'` while the client's
 * first paint could carry `tradition: 'north'` (whatever the user
 * previously chose), producing a React 19 hydration mismatch that kills
 * subsequent client analytics beacons (Lesson ZD, 2026-05-28 incident).
 *
 * Pattern: same as learning-progress-store. Factory returns the default;
 * consumers call `hydrate()` from a client `useEffect`. The store carries
 * a `hydrated: boolean` flag so consumers can render-gate the
 * tradition-dependent UI until the persisted value is loaded.
 *
 * Safari private-mode + strict-storage-partitioned WebViews throw
 * `SecurityError` / `QuotaExceededError` on the first localStorage call.
 * Both `hydrate()` and `setTradition()` wrap in try/catch so a blocked
 * persistence layer never crashes the page. The in-memory state is
 * always updated so the user's choice is honoured for the session even
 * if persistence is blocked.
 */
export const usePreferenceStore = create<PreferenceState>((set) => ({
  tradition: 'all',
  hydrated: false,
  hydrate: () => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('panchang_tradition');
      if (saved === 'north' || saved === 'south' || saved === 'all') {
        set({ tradition: saved, hydrated: true });
        return;
      }
    } catch (err) {
      console.error('[preference-store] localStorage.getItem failed, using default tradition:', err);
    }
    set({ hydrated: true });
  },
  setTradition: (t) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('panchang_tradition', t);
      } catch (err) {
        console.error('[preference-store] localStorage.setItem failed, preference not persisted:', err);
      }
    }
    // Always update the in-memory state — the user's choice is honoured
    // for the session even if persistence failed.
    set({ tradition: t });
  },
}));
