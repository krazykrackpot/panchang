import { create } from 'zustand';

export type TraditionPreference = 'north' | 'south' | 'all';

interface PreferenceState {
  tradition: TraditionPreference;
  setTradition: (t: TraditionPreference) => void;
}

export const usePreferenceStore = create<PreferenceState>((set) => {
  // Load from localStorage on init
  let initial: TraditionPreference = 'all';
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('panchang_tradition');
    if (saved === 'north' || saved === 'south' || saved === 'all') {
      initial = saved;
    }
  }

  return {
    tradition: initial,
    setTradition: (t) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('panchang_tradition', t);
      }
      set({ tradition: t });
    },
  };
});
