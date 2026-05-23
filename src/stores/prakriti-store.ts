import { create } from 'zustand';
import type { Dosha, DoshaProfile } from '@/lib/dinacharya/prakriti-quiz';

interface PrakritiState {
  profile: DoshaProfile | null;
  answers: Record<string, Dosha>;
  setAnswers: (answers: Record<string, Dosha>) => void;
  setProfile: (profile: DoshaProfile) => void;
  clear: () => void;
  /** Alias for `clear()` so this store fits the canonical reset()
   *  contract called from auth-store.signOut. */
  reset: () => void;
}

export const usePrakritiStore = create<PrakritiState>((set) => {
  let initial: { profile: DoshaProfile | null; answers: Record<string, Dosha> } = { profile: null, answers: {} };
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('panchang_prakriti');
      if (saved) initial = JSON.parse(saved) as typeof initial;
    } catch {
      // Ignore parse errors  –  corrupted localStorage data is non-fatal; start fresh
      console.error('[prakriti-store] Failed to parse localStorage data, starting fresh');
    }
  }

  return {
    ...initial,
    setAnswers: (answers) => {
      set({ answers });
      if (typeof window !== 'undefined') {
        const state = usePrakritiStore.getState();
        localStorage.setItem('panchang_prakriti', JSON.stringify({ profile: state.profile, answers }));
      }
    },
    setProfile: (profile) => {
      set({ profile });
      if (typeof window !== 'undefined') {
        const state = usePrakritiStore.getState();
        localStorage.setItem('panchang_prakriti', JSON.stringify({ profile, answers: state.answers }));
      }
    },
    clear: () => {
      set({ profile: null, answers: {} });
      if (typeof window !== 'undefined') localStorage.removeItem('panchang_prakriti');
    },
    reset: () => {
      set({ profile: null, answers: {} });
      // Don't remove the localStorage key here — auth-store.signOut
      // handles the disk wipe so all per-user storage keys live in
      // one place (single source of truth for the cleanup list).
    },
  };
});
