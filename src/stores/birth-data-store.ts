'use client';

import { create } from 'zustand';

/**
 * Persists user's OWN birth nakshatra and rashi to localStorage
 * so the panchang page can auto-populate Chandrabalam/Tarabalam
 * and the horoscope page can default to the user's sign.
 *
 * Only stores data for the "self" chart  –  generating charts for
 * family members does NOT overwrite this.
 */

interface BirthDataState {
  birthNakshatra: number;  // 1-27, 0 = not set
  birthRashi: number;      // 1-12, 0 = not set
  birthName: string;
  isSet: boolean;
  /** Only updates when relationship is 'self'. */
  setBirthData: (nakshatra: number, rashi: number, name?: string) => void;
  clearBirthData: () => void;
  loadFromStorage: () => void;
  /** In-memory wipe called from auth-store.signOut. Distinct from
   *  clearBirthData() in that the localStorage key is NOT touched here —
   *  auth-store owns the disk-wipe list. Round 2 audit found the
   *  in-memory state was lingering after signOut while localStorage was
   *  already cleared, so a stale rashi was readable until next reload. */
  reset: () => void;
}

const STORAGE_KEY = 'panchang_birth_data';

export const useBirthDataStore = create<BirthDataState>((set) => ({
  birthNakshatra: 0,
  birthRashi: 0,
  birthName: '',
  isSet: false,

  setBirthData: (nakshatra, rashi, name = '') => {
    set({ birthNakshatra: nakshatra, birthRashi: rashi, birthName: name, isSet: nakshatra > 0 && rashi > 0 });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nakshatra, rashi, name }));
    } catch { /* SSR or private browsing */ }
  },

  clearBirthData: () => {
    set({ birthNakshatra: 0, birthRashi: 0, birthName: '', isSet: false });
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  },

  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.nakshatra && data.rashi) {
          set({
            birthNakshatra: data.nakshatra,
            birthRashi: data.rashi,
            birthName: data.name || '',
            isSet: true,
          });
        }
      }
    } catch { /* ignore */ }
  },

  reset: () => {
    set({ birthNakshatra: 0, birthRashi: 0, birthName: '', isSet: false });
  },
}));
