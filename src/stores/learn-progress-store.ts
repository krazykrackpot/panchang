'use client';

import { create } from 'zustand';

/**
 * Learn Jyotish Progress Tracking
 * Persists to localStorage — tracks completed lessons, XP, and achievements.
 */

export interface Achievement {
  id: string;
  name: { en: string; hi: string };
  description: { en: string; hi: string };
  icon: string;
  unlockedAt?: string; // ISO date
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_lesson', name: { en: 'First Step', hi: 'प्रथम पग' }, description: { en: 'Complete your first lesson', hi: 'पहला पाठ पूरा करें' }, icon: '🌱' },
  { id: 'sky_complete', name: { en: 'Stargazer', hi: 'तारादर्शी' }, description: { en: 'Complete Phase 1: The Sky', hi: 'चरण 1 पूर्ण: आकाश' }, icon: '⭐' },
  { id: 'panchang_complete', name: { en: 'Panchangi', hi: 'पंचांगी' }, description: { en: 'Complete Phase 2: Pancha Anga', hi: 'चरण 2 पूर्ण: पंच अंग' }, icon: '🌙' },
  { id: 'chart_complete', name: { en: 'Chart Reader', hi: 'कुंडली पाठक' }, description: { en: 'Complete Phase 3: The Chart', hi: 'चरण 3 पूर्ण: कुण्डली' }, icon: '📊' },
  { id: 'applied_complete', name: { en: 'Practitioner', hi: 'अभ्यासकर्ता' }, description: { en: 'Complete Phase 4: Applied Jyotish', hi: 'चरण 4 पूर्ण: प्रयुक्त ज्योतिष' }, icon: '🔮' },
  { id: 'classical_complete', name: { en: 'Vidwan', hi: 'विद्वान' }, description: { en: 'Complete Phase 5: Classical Knowledge', hi: 'चरण 5 पूर्ण: शास्त्रीय ज्ञान' }, icon: '📚' },
  { id: 'all_complete', name: { en: 'Jyotish Acharya', hi: 'ज्योतिष आचार्य' }, description: { en: 'Complete all lessons — Master of Vedic Astrology', hi: 'सभी पाठ पूर्ण — वैदिक ज्योतिष गुरु' }, icon: '👑' },
  { id: 'five_streak', name: { en: 'Dedicated', hi: 'समर्पित' }, description: { en: 'Complete 5 lessons', hi: '5 पाठ पूर्ण करें' }, icon: '🔥' },
  { id: 'ten_streak', name: { en: 'Scholar', hi: 'विद्वान' }, description: { en: 'Complete 10 lessons', hi: '10 पाठ पूर्ण करें' }, icon: '🎓' },
  { id: 'fifteen_streak', name: { en: 'Guru', hi: 'गुरु' }, description: { en: 'Complete 15 lessons', hi: '15 पाठ पूर्ण करें' }, icon: '🧘' },
];

// Phase → page paths mapping
export const PHASE_PAGES: Record<string, string[]> = {
  '1': ['/learn', '/learn/grahas', '/learn/rashis', '/learn/ayanamsha'],
  '2': ['/learn/tithis', '/learn/nakshatras', '/learn/yogas', '/learn/karanas', '/learn/vara'],
  '2.5': ['/learn/muhurtas'],
  '3': ['/learn/kundali', '/learn/bhavas', '/learn/vargas', '/learn/dashas', '/learn/gochar'],
  '4': ['/learn/matching', '/learn/doshas', '/learn/calculations', '/learn/advanced'],
  '5': ['/learn/classical-texts'],
};

export const ALL_PAGES = Object.values(PHASE_PAGES).flat();
export const TOTAL_LESSONS = ALL_PAGES.length;

// XP per lesson
const XP_PER_LESSON = 50;
const XP_PER_PHASE = 200; // bonus for completing a phase

interface LearnProgressState {
  completedPages: string[];
  xp: number;
  unlockedAchievements: string[];
  loaded: boolean;

  markComplete: (pagePath: string) => void;
  isCompleted: (pagePath: string) => boolean;
  getPhaseProgress: (phaseKey: string) => { completed: number; total: number; percent: number };
  getOverallProgress: () => { completed: number; total: number; percent: number };
  getCurrentPhase: () => string;
  resetProgress: () => void;
  loadFromStorage: () => void;
}

const STORAGE_KEY = 'panchang_learn_progress';

function checkAchievements(completedPages: string[]): string[] {
  const unlocked: string[] = [];
  const count = completedPages.length;

  if (count >= 1) unlocked.push('first_lesson');
  if (count >= 5) unlocked.push('five_streak');
  if (count >= 10) unlocked.push('ten_streak');
  if (count >= 15) unlocked.push('fifteen_streak');

  // Phase completions
  const phaseChecks: [string, string][] = [
    ['1', 'sky_complete'], ['2', 'panchang_complete'], ['3', 'chart_complete'],
    ['4', 'applied_complete'], ['5', 'classical_complete'],
  ];
  for (const [phaseKey, achId] of phaseChecks) {
    const pages = PHASE_PAGES[phaseKey];
    if (pages && pages.every(p => completedPages.includes(p))) {
      unlocked.push(achId);
    }
  }

  // All complete
  if (ALL_PAGES.every(p => completedPages.includes(p))) {
    unlocked.push('all_complete');
  }

  return unlocked;
}

export const useLearnProgressStore = create<LearnProgressState>((set, get) => ({
  completedPages: [],
  xp: 0,
  unlockedAchievements: [],
  loaded: false,

  markComplete: (pagePath: string) => {
    const state = get();
    if (state.completedPages.includes(pagePath)) return;

    const newCompleted = [...state.completedPages, pagePath];
    let newXp = state.xp + XP_PER_LESSON;

    // Check if this completes a phase → bonus XP
    for (const [, pages] of Object.entries(PHASE_PAGES)) {
      const allDone = pages.every(p => newCompleted.includes(p));
      const wasDone = pages.every(p => state.completedPages.includes(p));
      if (allDone && !wasDone) newXp += XP_PER_PHASE;
    }

    const newAchievements = checkAchievements(newCompleted);

    set({
      completedPages: newCompleted,
      xp: newXp,
      unlockedAchievements: newAchievements,
    });

    // Persist
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        completedPages: newCompleted,
        xp: newXp,
        unlockedAchievements: newAchievements,
      }));
    } catch { /* SSR */ }
  },

  isCompleted: (pagePath: string) => get().completedPages.includes(pagePath),

  getPhaseProgress: (phaseKey: string) => {
    const pages = PHASE_PAGES[phaseKey] || [];
    const completed = pages.filter(p => get().completedPages.includes(p)).length;
    return { completed, total: pages.length, percent: pages.length > 0 ? Math.round((completed / pages.length) * 100) : 0 };
  },

  getOverallProgress: () => {
    const completed = get().completedPages.length;
    return { completed, total: TOTAL_LESSONS, percent: Math.round((completed / TOTAL_LESSONS) * 100) };
  },

  getCurrentPhase: () => {
    const completed = get().completedPages;
    for (const [key, pages] of Object.entries(PHASE_PAGES)) {
      if (!pages.every(p => completed.includes(p))) return key;
    }
    return '5'; // all done
  },

  resetProgress: () => {
    set({ completedPages: [], xp: 0, unlockedAchievements: [], loaded: true });
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  },

  loadFromStorage: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set({
          completedPages: data.completedPages || [],
          xp: data.xp || 0,
          unlockedAchievements: data.unlockedAchievements || [],
          loaded: true,
        });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },
}));
