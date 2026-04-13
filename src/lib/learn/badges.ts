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
  label: Record<string, string>;
  minModules: number;
  description: Record<string, string>;
}

const LEVEL_DEFS: LevelDef[] = [
  {
    level: 'beginner',
    label: { en: 'Beginner', hi: 'शिष्य', sa: 'शिष्य', mai: 'शिष्य', mr: 'शिष्य', ta: 'Beginner', te: 'Beginner', bn: 'Beginner', kn: 'Beginner', gu: 'Beginner' },
    minModules: 0,
    description: {
      en: "You're just starting — every journey begins with a single step",
      hi: 'आप अभी शुरू कर रहे हैं — हर यात्रा एक कदम से शुरू होती है',
      sa: 'आप अभी शुरू कर रहे हैं — हर यात्रा एक कदम से शुरू होती है',
      mai: 'आप अभी शुरू कर रहे हैं — हर यात्रा एक कदम से शुरू होती है',
      mr: 'आप अभी शुरू कर रहे हैं — हर यात्रा एक कदम से शुरू होती है',
      ta: "You're just starting — every journey begins with a single step",
      te: "You're just starting — every journey begins with a single step",
      bn: "You're just starting — every journey begins with a single step",
      kn: "You're just starting — every journey begins with a single step",
      gu: "You're just starting — every journey begins with a single step",
    },
  },
  {
    level: 'student',
    label: { en: 'Student', hi: 'छात्र', sa: 'छात्र', mai: 'छात्र', mr: 'छात्र', ta: 'Student', te: 'Student', bn: 'Student', kn: 'Student', gu: 'Student' },
    minModules: 11,
    description: {
      en: "You're building a solid foundation",
      hi: 'आप एक मजबूत नींव बना रहे हैं',
      sa: 'आप एक मजबूत नींव बना रहे हैं',
      mai: 'आप एक मजबूत नींव बना रहे हैं',
      mr: 'आप एक मजबूत नींव बना रहे हैं',
      ta: "You're building a solid foundation",
      te: "You're building a solid foundation",
      bn: "You're building a solid foundation",
      kn: "You're building a solid foundation",
      gu: "You're building a solid foundation",
    },
  },
  {
    level: 'practitioner',
    label: { en: 'Practitioner', hi: 'साधक', sa: 'साधक', mai: 'साधक', mr: 'साधक', ta: 'Practitioner', te: 'Practitioner', bn: 'Practitioner', kn: 'Practitioner', gu: 'Practitioner' },
    minModules: 31,
    description: {
      en: 'You can read a basic chart and understand daily panchang',
      hi: 'आप एक बुनियादी कुण्डली पढ़ सकते हैं और दैनिक पंचांग समझते हैं',
      sa: 'आप एक बुनियादी कुण्डली पढ़ सकते हैं और दैनिक पंचांग समझते हैं',
      mai: 'आप एक बुनियादी कुण्डली पढ़ सकते हैं और दैनिक पंचांग समझते हैं',
      mr: 'आप एक बुनियादी कुण्डली पढ़ सकते हैं और दैनिक पंचांग समझते हैं',
      ta: 'You can read a basic chart and understand daily panchang',
      te: 'You can read a basic chart and understand daily panchang',
      bn: 'You can read a basic chart and understand daily panchang',
      kn: 'You can read a basic chart and understand daily panchang',
      gu: 'You can read a basic chart and understand daily panchang',
    },
  },
  {
    level: 'vidwan',
    label: { en: 'Vidwan', hi: 'विद्वान', sa: 'विद्वान', mai: 'विद्वान', mr: 'विद्वान', ta: 'Vidwan', te: 'Vidwan', bn: 'Vidwan', kn: 'Vidwan', gu: 'Vidwan' },
    minModules: 61,
    description: {
      en: 'Advanced understanding — you can analyze dashas and transits',
      hi: 'उन्नत समझ — आप दशा और गोचर का विश्लेषण कर सकते हैं',
      sa: 'उन्नत समझ — आप दशा और गोचर का विश्लेषण कर सकते हैं',
      mai: 'उन्नत समझ — आप दशा और गोचर का विश्लेषण कर सकते हैं',
      mr: 'उन्नत समझ — आप दशा और गोचर का विश्लेषण कर सकते हैं',
      ta: 'Advanced understanding — you can analyze dashas and transits',
      te: 'Advanced understanding — you can analyze dashas and transits',
      bn: 'Advanced understanding — you can analyze dashas and transits',
      kn: 'Advanced understanding — you can analyze dashas and transits',
      gu: 'Advanced understanding — you can analyze dashas and transits',
    },
  },
  {
    level: 'pandit',
    label: { en: 'Pandit', hi: 'पण्डित', sa: 'पण्डित', mai: 'पण्डित', mr: 'पण्डित', ta: 'Pandit', te: 'Pandit', bn: 'Pandit', kn: 'Pandit', gu: 'Pandit' },
    minModules: 91,
    description: {
      en: 'Master level — you understand the full depth of Jyotish',
      hi: 'मास्टर स्तर — आप ज्योतिष की पूर्ण गहराई समझते हैं',
      sa: 'मास्टर स्तर — आप ज्योतिष की पूर्ण गहराई समझते हैं',
      mai: 'मास्टर स्तर — आप ज्योतिष की पूर्ण गहराई समझते हैं',
      mr: 'मास्टर स्तर — आप ज्योतिष की पूर्ण गहराई समझते हैं',
      ta: 'Master level — you understand the full depth of Jyotish',
      te: 'Master level — you understand the full depth of Jyotish',
      bn: 'Master level — you understand the full depth of Jyotish',
      kn: 'Master level — you understand the full depth of Jyotish',
      gu: 'Master level — you understand the full depth of Jyotish',
    },
  },
];

export function getLevel(masteredCount: number): {
  level: JyotishLevel;
  label: Record<string, string>;
  description: Record<string, string>;
  minModules: number;
  nextLevel: { label: Record<string, string>; modulesNeeded: number } | null;
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
  label: Record<string, string>;
  description: Record<string, string>;
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
    label: { en: 'First Step', hi: 'पहला कदम', sa: 'पहला कदम', mai: 'पहला कदम', mr: 'पहला कदम', ta: 'First Step', te: 'First Step', bn: 'First Step', kn: 'First Step', gu: 'First Step' },
    description: { en: 'Complete 1 module', hi: '1 मॉड्यूल पूर्ण करें', sa: '1 मॉड्यूल पूर्ण करें', mai: '1 मॉड्यूल पूर्ण करें', mr: '1 मॉड्यूल पूर्ण करें', ta: 'Complete 1 module', te: 'Complete 1 module', bn: 'Complete 1 module', kn: 'Complete 1 module', gu: 'Complete 1 module' },
    condition: (progress) => countMastered(progress) >= 1,
  },
  {
    id: 'phase-0-complete',
    icon: '\u{1F4DA}', // books
    label: { en: 'Phase 0 Complete', hi: 'चरण 0 पूर्ण', sa: 'चरण 0 पूर्ण', mai: 'चरण 0 पूर्ण', mr: 'चरण 0 पूर्ण', ta: 'Phase 0 Complete', te: 'Phase 0 Complete', bn: 'Phase 0 Complete', kn: 'Phase 0 Complete', gu: 'Phase 0 Complete' },
    description: { en: 'All Pre-Foundation modules mastered', hi: 'सभी पूर्व-आधार मॉड्यूल पूर्ण', sa: 'सभी पूर्व-आधार मॉड्यूल पूर्ण', mai: 'सभी पूर्व-आधार मॉड्यूल पूर्ण', mr: 'सभी पूर्व-आधार मॉड्यूल पूर्ण', ta: 'All Pre-Foundation modules mastered', te: 'All Pre-Foundation modules mastered', bn: 'All Pre-Foundation modules mastered', kn: 'All Pre-Foundation modules mastered', gu: 'All Pre-Foundation modules mastered' },
    condition: (progress) => isPhaseComplete(progress, 0),
  },
  {
    id: 'week-warrior',
    icon: '\u{1F525}', // fire
    label: { en: 'Week Warrior', hi: 'सप्ताह योद्धा', sa: 'सप्ताह योद्धा', mai: 'सप्ताह योद्धा', mr: 'सप्ताह योद्धा', ta: 'Week Warrior', te: 'Week Warrior', bn: 'Week Warrior', kn: 'Week Warrior', gu: 'Week Warrior' },
    description: { en: '7-day learning streak', hi: '7 दिन की शिक्षा लय', sa: '7 दिन की शिक्षा लय', mai: '7 दिन की शिक्षा लय', mr: '7 दिन की शिक्षा लय', ta: '7-day learning streak', te: '7-day learning streak', bn: '7-day learning streak', kn: '7-day learning streak', gu: '7-day learning streak' },
    condition: (_, streak) => streak.streakDays >= 7 || streak.longestStreak >= 7,
  },
  {
    id: 'fortnight-fire',
    icon: '\u{1F525}\u{1F525}', // fire fire
    label: { en: 'Fortnight Fire', hi: 'पखवाड़ा अग्नि', sa: 'पखवाड़ा अग्नि', mai: 'पखवाड़ा अग्नि', mr: 'पखवाड़ा अग्नि', ta: 'Fortnight Fire', te: 'Fortnight Fire', bn: 'Fortnight Fire', kn: 'Fortnight Fire', gu: 'Fortnight Fire' },
    description: { en: '14-day learning streak', hi: '14 दिन की शिक्षा लय', sa: '14 दिन की शिक्षा लय', mai: '14 दिन की शिक्षा लय', mr: '14 दिन की शिक्षा लय', ta: '14-day learning streak', te: '14-day learning streak', bn: '14-day learning streak', kn: '14-day learning streak', gu: '14-day learning streak' },
    condition: (_, streak) => streak.streakDays >= 14 || streak.longestStreak >= 14,
  },
  {
    id: 'quiz-master',
    icon: '\u{26A1}', // lightning
    label: { en: 'Quiz Master', hi: 'परीक्षा गुरु', sa: 'परीक्षा गुरु', mai: 'परीक्षा गुरु', mr: 'परीक्षा गुरु', ta: 'Quiz Master', te: 'Quiz Master', bn: 'Quiz Master', kn: 'Quiz Master', gu: 'Quiz Master' },
    description: { en: 'Score 5/5 on any quiz', hi: 'किसी भी परीक्षा में 5/5 स्कोर करें', sa: 'किसी भी परीक्षा में 5/5 स्कोर करें', mai: 'किसी भी परीक्षा में 5/5 स्कोर करें', mr: 'किसी भी परीक्षा में 5/5 स्कोर करें', ta: 'Score 5/5 on any quiz', te: 'Score 5/5 on any quiz', bn: 'Score 5/5 on any quiz', kn: 'Score 5/5 on any quiz', gu: 'Score 5/5 on any quiz' },
    condition: (progress) => hasPerfectQuiz(progress),
  },
  {
    id: 'math-explorer',
    icon: '\u{1F9EE}', // abacus
    label: { en: 'Math Explorer', hi: 'गणित अन्वेषक', sa: 'गणित अन्वेषक', mai: 'गणित अन्वेषक', mr: 'गणित अन्वेषक', ta: 'Math Explorer', te: 'Math Explorer', bn: 'Math Explorer', kn: 'Math Explorer', gu: 'Math Explorer' },
    description: { en: 'Complete any India contributions module', hi: 'भारत के योगदान का कोई भी मॉड्यूल पूर्ण करें', sa: 'भारत के योगदान का कोई भी मॉड्यूल पूर्ण करें', mai: 'भारत के योगदान का कोई भी मॉड्यूल पूर्ण करें', mr: 'भारत के योगदान का कोई भी मॉड्यूल पूर्ण करें', ta: 'Complete any India contributions module', te: 'Complete any India contributions module', bn: 'Complete any India contributions module', kn: 'Complete any India contributions module', gu: 'Complete any India contributions module' },
    condition: (progress) =>
      MODULE_SEQUENCE
        .filter(m => m.id.startsWith('25-') || m.id.startsWith('26-'))
        .some(m => progress[m.id]?.status === 'mastered'),
  },
  {
    id: 'eclipse-scholar',
    icon: '\u{1F319}', // crescent moon
    label: { en: 'Eclipse Scholar', hi: 'ग्रहण विद्वान', sa: 'ग्रहण विद्वान', mai: 'ग्रहण विद्वान', mr: 'ग्रहण विद्वान', ta: 'Eclipse Scholar', te: 'Eclipse Scholar', bn: 'Eclipse Scholar', kn: 'Eclipse Scholar', gu: 'Eclipse Scholar' },
    description: { en: 'Complete the Eclipses module (13-4)', hi: 'ग्रहण मॉड्यूल (13-4) पूर्ण करें', sa: 'ग्रहण मॉड्यूल (13-4) पूर्ण करें', mai: 'ग्रहण मॉड्यूल (13-4) पूर्ण करें', mr: 'ग्रहण मॉड्यूल (13-4) पूर्ण करें', ta: 'Complete the Eclipses module (13-4)', te: 'Complete the Eclipses module (13-4)', bn: 'Complete the Eclipses module (13-4)', kn: 'Complete the Eclipses module (13-4)', gu: 'Complete the Eclipses module (13-4)' },
    condition: (progress) => progress['13-4']?.status === 'mastered',
  },
  {
    id: 'hora-expert',
    icon: '\u{2600}\u{FE0F}', // sun
    label: { en: 'Hora Expert', hi: 'होरा विशेषज्ञ', sa: 'होरा विशेषज्ञ', mai: 'होरा विशेषज्ञ', mr: 'होरा विशेषज्ञ', ta: 'Hora Expert', te: 'Hora Expert', bn: 'Hora Expert', kn: 'Hora Expert', gu: 'Hora Expert' },
    description: { en: 'Complete the Hora/Chaldean module (7-4)', hi: 'होरा/कैल्डियन मॉड्यूल (7-4) पूर्ण करें', sa: 'होरा/कैल्डियन मॉड्यूल (7-4) पूर्ण करें', mai: 'होरा/कैल्डियन मॉड्यूल (7-4) पूर्ण करें', mr: 'होरा/कैल्डियन मॉड्यूल (7-4) पूर्ण करें', ta: 'Complete the Hora/Chaldean module (7-4)', te: 'Complete the Hora/Chaldean module (7-4)', bn: 'Complete the Hora/Chaldean module (7-4)', kn: 'Complete the Hora/Chaldean module (7-4)', gu: 'Complete the Hora/Chaldean module (7-4)' },
    condition: (progress) => progress['7-4']?.status === 'mastered',
  },
  {
    id: 'perfect-phase',
    icon: '\u{1F3AF}', // target
    label: { en: 'Perfect Phase', hi: 'पूर्ण चरण', sa: 'पूर्ण चरण', mai: 'पूर्ण चरण', mr: 'पूर्ण चरण', ta: 'Perfect Phase', te: 'Perfect Phase', bn: 'Perfect Phase', kn: 'Perfect Phase', gu: 'Perfect Phase' },
    description: { en: 'Master ALL modules in any single phase', hi: 'किसी भी एक चरण के सभी मॉड्यूल पूर्ण करें', sa: 'किसी भी एक चरण के सभी मॉड्यूल पूर्ण करें', mai: 'किसी भी एक चरण के सभी मॉड्यूल पूर्ण करें', mr: 'किसी भी एक चरण के सभी मॉड्यूल पूर्ण करें', ta: 'Master ALL modules in any single phase', te: 'Master ALL modules in any single phase', bn: 'Master ALL modules in any single phase', kn: 'Master ALL modules in any single phase', gu: 'Master ALL modules in any single phase' },
    condition: (progress) =>
      PHASE_INFO.some(p => isPhaseComplete(progress, p.phase)),
  },
  {
    id: 'pandit-badge',
    icon: '\u{1F451}', // crown
    label: { en: 'Pandit', hi: 'पण्डित', sa: 'पण्डित', mai: 'पण्डित', mr: 'पण्डित', ta: 'Pandit', te: 'Pandit', bn: 'Pandit', kn: 'Pandit', gu: 'Pandit' },
    description: { en: 'Reach Pandit level (91+ modules)', hi: 'पण्डित स्तर तक पहुँचें (91+ मॉड्यूल)', sa: 'पण्डित स्तर तक पहुँचें (91+ मॉड्यूल)', mai: 'पण्डित स्तर तक पहुँचें (91+ मॉड्यूल)', mr: 'पण्डित स्तर तक पहुँचें (91+ मॉड्यूल)', ta: 'Reach Pandit level (91+ modules)', te: 'Reach Pandit level (91+ modules)', bn: 'Reach Pandit level (91+ modules)', kn: 'Reach Pandit level (91+ modules)', gu: 'Reach Pandit level (91+ modules)' },
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
