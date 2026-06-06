import { create } from 'zustand';

export type TraditionPreference = 'north' | 'south' | 'all';

interface PreferenceState {
  tradition: TraditionPreference;
  setTradition: (t: TraditionPreference) => void;
}

export const usePreferenceStore = create<PreferenceState>((set) => {
  // Load from localStorage on init.
  //
  // Safari private-mode (and some embedded WebViews under strict storage
  // partitioning) throw `SecurityError` / `QuotaExceededError` on the
  // first `getItem` / `setItem` call. Without the try/catch the store
  // factory threw at module load, which crashes EVERY page that imports
  // this store — not just the preference UI. Match the pattern used by
  // location-store and other persisted stores. Lesson E (CLAUDE.md):
  // document library/browser limits at the call site.
  let initial: TraditionPreference = 'all';
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('panchang_tradition');
      if (saved === 'north' || saved === 'south' || saved === 'all') {
        initial = saved;
      }
    } catch (err) {
      console.error('[preference-store] localStorage.getItem failed, using default tradition:', err);
    }
  }

  return {
    tradition: initial,
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
  };
});
