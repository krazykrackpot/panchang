/**
 * Learning Badges & Levels system for the Jyotish curriculum.
 * No React dependencies — safe to import in stores and server utilities.
 */

import type { ModuleProgress, StreakData } from '@/stores/learning-progress-store';
import { MODULE_SEQUENCE, getPhaseModules, PHASE_INFO } from './module-sequence';

// ── Levels ──────────────────────────────────────────────────────────────────

export type JyotishLevel = 'beginner' | 'student' | 'practitioner' | 'vidwan' | 'pandit';

interface LevelDef {
  level: JyotishLevel;
  label: { en: string; hi: string };
  minModules: number;
  description: { en: string; hi: string };
}

const LEVEL_DEFS: LevelDef[] = [
  {
    level: 'beginner',
    label: { en: 'Beginner', hi: 'शिष्य' },
    minModules: 0,
    description: {
      en: "You're just starting — every journey begins with a single step",
      hi: 'आप अभी शुरू कर रहे हैं — हर यात्रा एक कदम से शुरू होती है',
    },
  },
  {
    level: 'student',
    label: { en: 'Student', hi: 'छात्र' },
    minModules: 11,
    description: {
      en: "You're building a solid foundation",
      hi: 'आप एक मजबूत नींव बना रहे हैं',
    },
  },
  {
    level: 'practitioner',
    label: { en: 'Practitioner', hi: 'साधक' },
    minModules: 31,
    description: {
      en: 'You can read a basic chart and understand daily panchang',
      hi: 'आप एक बुनियादी कुण्डली पढ़ सकते हैं और दैनिक पंचांग समझते हैं',
    },
  },
  {
    level: 'vidwan',
    label: { en: 'Vidwan', hi: 'विद्वान' },
    minModules: 61,
    description: {
      en: 'Advanced understanding — you can analyze dashas and transits',
      hi: 'उन्नत समझ — आप दशा और गोचर का विश्लेषण कर सकते हैं',
    },
  },
  {
    level: 'pandit',
    label: { en: 'Pandit', hi: 'पण्डित' },
    minModules: 91,
    description: {
      en: 'Master level — you understand the full depth of Jyotish',
      hi: 'मास्टर स्तर — आप ज्योतिष की पूर्ण गहराई समझते हैं',
    },
  },
];

export function getLevel(masteredCount: number): {
  level: JyotishLevel;
  label: { en: string; hi: string };
  description: { en: string; hi: string };
  minModules: number;
  nextLevel: { label: { en: string; hi: string }; modulesNeeded: number } | null;
} {
  let currentIdx = 0;
  for (let i = LEVEL_DEFS.length - 1; i >= 0; i--) {
    if (masteredCount >= LEVEL_DEFS[i].minModules) {
      currentIdx = i;
      break;
    }
  }

  const current = LEVEL_DEFS[currentIdx];
  const next = currentIdx < LEVEL_DEFS.length - 1 ? LEVEL_DEFS[currentIdx + 1] : null;

  return {
    level: current.level,
    label: current.label,
    description: current.description,
    minModules: current.minModules,
    nextLevel: next
      ? { label: next.label, modulesNeeded: next.minModules - masteredCount }
      : null,
  };
}

// ── Badges ──────────────────────────────────────────────────────────────────

export interface Badge {
  id: string;
  icon: string;
  label: { en: string; hi: string };
  description: { en: string; hi: string };
  condition: (progress: Record<string, ModuleProgress>, streak: StreakData) => boolean;
}

/** Check if ALL modules in a specific phase are mastered */
function isPhaseComplete(progress: Record<string, ModuleProgress>, phase: number): boolean {
  const modules = getPhaseModules(phase);
  return modules.length > 0 && modules.every(m => progress[m.id]?.status === 'mastered');
}

/** Count mastered modules */
function countMastered(progress: Record<string, ModuleProgress>): number {
  return MODULE_SEQUENCE.filter(m => progress[m.id]?.status === 'mastered').length;
}

/** Check if any module has a perfect quiz score of 5 */
function hasPerfectQuiz(progress: Record<string, ModuleProgress>): boolean {
  return Object.values(progress).some(p => p.quizScore !== null && p.quizScore >= 5);
}

export const BADGES: Badge[] = [
  {
    id: 'first-step',
    icon: '\u{1F31F}', // star
    label: { en: 'First Step', hi: 'पहला कदम' },
    description: { en: 'Complete 1 module', hi: '1 मॉड्यूल पूर्ण करें' },
    condition: (progress) => countMastered(progress) >= 1,
  },
  {
    id: 'phase-0-complete',
    icon: '\u{1F4DA}', // books
    label: { en: 'Phase 0 Complete', hi: 'चरण 0 पूर्ण' },
    description: { en: 'All Pre-Foundation modules mastered', hi: 'सभी पूर्व-आधार मॉड्यूल पूर्ण' },
    condition: (progress) => isPhaseComplete(progress, 0),
  },
  {
    id: 'week-warrior',
    icon: '\u{1F525}', // fire
    label: { en: 'Week Warrior', hi: 'सप्ताह योद्धा' },
    description: { en: '7-day learning streak', hi: '7 दिन की शिक्षा लय' },
    condition: (_, streak) => streak.streakDays >= 7 || streak.longestStreak >= 7,
  },
  {
    id: 'fortnight-fire',
    icon: '\u{1F525}\u{1F525}', // fire fire
    label: { en: 'Fortnight Fire', hi: 'पखवाड़ा अग्नि' },
    description: { en: '14-day learning streak', hi: '14 दिन की शिक्षा लय' },
    condition: (_, streak) => streak.streakDays >= 14 || streak.longestStreak >= 14,
  },
  {
    id: 'quiz-master',
    icon: '\u{26A1}', // lightning
    label: { en: 'Quiz Master', hi: 'परीक्षा गुरु' },
    description: { en: 'Score 5/5 on any quiz', hi: 'किसी भी परीक्षा में 5/5 स्कोर करें' },
    condition: (progress) => hasPerfectQuiz(progress),
  },
  {
    id: 'math-explorer',
    icon: '\u{1F9EE}', // abacus
    label: { en: 'Math Explorer', hi: 'गणित अन्वेषक' },
    description: { en: 'Complete any India contributions module', hi: 'भारत के योगदान का कोई भी मॉड्यूल पूर्ण करें' },
    condition: (progress) =>
      MODULE_SEQUENCE
        .filter(m => m.id.startsWith('25-') || m.id.startsWith('26-'))
        .some(m => progress[m.id]?.status === 'mastered'),
  },
  {
    id: 'eclipse-scholar',
    icon: '\u{1F319}', // crescent moon
    label: { en: 'Eclipse Scholar', hi: 'ग्रहण विद्वान' },
    description: { en: 'Complete the Eclipses module (13-4)', hi: 'ग्रहण मॉड्यूल (13-4) पूर्ण करें' },
    condition: (progress) => progress['13-4']?.status === 'mastered',
  },
  {
    id: 'hora-expert',
    icon: '\u{2600}\u{FE0F}', // sun
    label: { en: 'Hora Expert', hi: 'होरा विशेषज्ञ' },
    description: { en: 'Complete the Hora/Chaldean module (7-4)', hi: 'होरा/कैल्डियन मॉड्यूल (7-4) पूर्ण करें' },
    condition: (progress) => progress['7-4']?.status === 'mastered',
  },
  {
    id: 'perfect-phase',
    icon: '\u{1F3AF}', // target
    label: { en: 'Perfect Phase', hi: 'पूर्ण चरण' },
    description: { en: 'Master ALL modules in any single phase', hi: 'किसी भी एक चरण के सभी मॉड्यूल पूर्ण करें' },
    condition: (progress) =>
      PHASE_INFO.some(p => isPhaseComplete(progress, p.phase)),
  },
  {
    id: 'pandit-badge',
    icon: '\u{1F451}', // crown
    label: { en: 'Pandit', hi: 'पण्डित' },
    description: { en: 'Reach Pandit level (91+ modules)', hi: 'पण्डित स्तर तक पहुँचें (91+ मॉड्यूल)' },
    condition: (progress) => countMastered(progress) >= 91,
  },
];

// ── Earned badge utilities ──────────────────────────────────────────────────

const BADGES_STORAGE_KEY = 'dekho-panchang-badges';

/** Read earned badge IDs from localStorage */
export function getEarnedBadgeIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(BADGES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Write earned badge IDs to localStorage */
function writeEarnedBadgeIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage quota exceeded
  }
}

/**
 * Check all badges against current progress and streak.
 * Returns { earned: Badge[], newlyEarned: Badge[] }.
 * newlyEarned contains badges that were just earned for the first time
 * (not yet in localStorage). Also persists newly earned badges.
 */
export function checkBadges(
  progress: Record<string, ModuleProgress>,
  streak: StreakData,
): { earned: Badge[]; newlyEarned: Badge[] } {
  const previouslyEarned = new Set(getEarnedBadgeIds());

  const earned: Badge[] = [];
  const newlyEarned: Badge[] = [];

  for (const badge of BADGES) {
    if (badge.condition(progress, streak)) {
      earned.push(badge);
      if (!previouslyEarned.has(badge.id)) {
        newlyEarned.push(badge);
      }
    }
  }

  // Persist newly earned
  if (newlyEarned.length > 0) {
    const allIds = [...previouslyEarned, ...newlyEarned.map(b => b.id)];
    writeEarnedBadgeIds(allIds);
  }

  return { earned, newlyEarned };
}
