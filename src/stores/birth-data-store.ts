'use client';

import { create } from 'zustand';

/**
 * Persists user's birth nakshatra and rashi to localStorage
 * so the panchang page can auto-populate Chandrabalam/Tarabalam
 * without asking every time.
 */

interface BirthDataState {
  birthNakshatra: number;  // 1-27, 0 = not set
  birthRashi: number;      // 1-12, 0 = not set
  birthName: string;
  isSet: boolean;
  setBirthData: (nakshatra: number, rashi: number, name?: string) => void;
  clearBirthData: () => void;
  loadFromStorage: () => void;
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
}));
