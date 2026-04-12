import { describe, it, expect } from 'vitest';
import { getLevel, BADGES, checkBadges } from '@/lib/learn/badges';
import { MODULE_SEQUENCE } from '@/lib/learn/module-sequence';
import type { ModuleProgress, StreakData } from '@/stores/learning-progress-store';

const DEFAULT_STREAK: StreakData = {
  streakDays: 0,
  lastActiveDate: '',
  longestStreak: 0,
  streakFreezeAvailable: true,
  lastFreezeUsed: null,
};

/**
 * Create mastered progress for the first N modules in MODULE_SEQUENCE.
 * This ensures countMastered() (which checks MODULE_SEQUENCE IDs) works correctly.
 */
function makeMasteredProgress(count: number): Record<string, ModuleProgress> {
  const progress: Record<string, ModuleProgress> = {};
  for (let i = 0; i < count && i < MODULE_SEQUENCE.length; i++) {
    const id = MODULE_SEQUENCE[i].id;
    progress[id] = {
      moduleId: id,
      status: 'mastered',
      quizScore: 4,
      quizPassedAt: new Date().toISOString(),
      lastPageRead: 1,
      lastAccessedAt: new Date().toISOString(),
    };
  }
  return progress;
}

describe('getLevel', () => {
  it('returns beginner for 0 modules', () => {
    expect(getLevel(0).level).toBe('beginner');
  });

  it('returns student for 11 modules', () => {
    expect(getLevel(11).level).toBe('student');
  });

  it('returns practitioner for 31 modules', () => {
    expect(getLevel(31).level).toBe('practitioner');
  });

  it('returns vidwan for 61 modules', () => {
    expect(getLevel(61).level).toBe('vidwan');
  });

  it('returns pandit for 91 modules', () => {
    expect(getLevel(91).level).toBe('pandit');
  });

  it('pandit has no next level', () => {
    expect(getLevel(100).nextLevel).toBeNull();
  });

  it('beginner shows modules needed for student', () => {
    const result = getLevel(5);
    expect(result.nextLevel).toBeDefined();
    expect(result.nextLevel!.modulesNeeded).toBe(6); // 11 - 5
  });

  it('boundary: 10 modules is still beginner', () => {
    expect(getLevel(10).level).toBe('beginner');
  });

  it('boundary: 30 modules is still student', () => {
    expect(getLevel(30).level).toBe('student');
  });

  it('all levels have bilingual labels', () => {
    for (const count of [0, 11, 31, 61, 91]) {
      const result = getLevel(count);
      expect(result.label.en).toBeTruthy();
      expect(result.label.hi).toBeTruthy();
    }
  });
});

describe('BADGES', () => {
  it('has 10 badges defined', () => {
    expect(BADGES.length).toBe(10);
  });

  it('all badges have unique IDs', () => {
    const ids = BADGES.map(b => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all badges have bilingual labels', () => {
    for (const badge of BADGES) {
      expect(badge.label.en).toBeTruthy();
      expect(badge.label.hi).toBeTruthy();
    }
  });

  it('first-step badge triggers at 1 mastered module', () => {
    const firstStep = BADGES.find(b => b.id === 'first-step')!;
    const progress = makeMasteredProgress(1);
    expect(firstStep.condition(progress, DEFAULT_STREAK)).toBe(true);
  });

  it('first-step badge does NOT trigger with 0 modules', () => {
    const firstStep = BADGES.find(b => b.id === 'first-step')!;
    expect(firstStep.condition({}, DEFAULT_STREAK)).toBe(false);
  });

  it('week-warrior badge triggers at 7-day streak', () => {
    const weekWarrior = BADGES.find(b => b.id === 'week-warrior')!;
    const streak7 = { ...DEFAULT_STREAK, streakDays: 7 };
    expect(weekWarrior.condition({}, streak7)).toBe(true);
  });

  it('week-warrior does NOT trigger at 6-day streak', () => {
    const weekWarrior = BADGES.find(b => b.id === 'week-warrior')!;
    const streak6 = { ...DEFAULT_STREAK, streakDays: 6 };
    expect(weekWarrior.condition({}, streak6)).toBe(false);
  });

  it('week-warrior triggers if longestStreak >= 7 even if current streak < 7', () => {
    const weekWarrior = BADGES.find(b => b.id === 'week-warrior')!;
    const streakPast = { ...DEFAULT_STREAK, streakDays: 2, longestStreak: 10 };
    expect(weekWarrior.condition({}, streakPast)).toBe(true);
  });

  it('fortnight-fire triggers at 14-day streak', () => {
    const ff = BADGES.find(b => b.id === 'fortnight-fire')!;
    const streak14 = { ...DEFAULT_STREAK, streakDays: 14 };
    expect(ff.condition({}, streak14)).toBe(true);
  });

  it('fortnight-fire does NOT trigger at 13-day streak', () => {
    const ff = BADGES.find(b => b.id === 'fortnight-fire')!;
    const streak13 = { ...DEFAULT_STREAK, streakDays: 13, longestStreak: 13 };
    expect(ff.condition({}, streak13)).toBe(false);
  });

  it('quiz-master triggers with perfect score of 5', () => {
    const quizMaster = BADGES.find(b => b.id === 'quiz-master')!;
    const progress: Record<string, ModuleProgress> = {
      '0-1': { moduleId: '0-1', status: 'mastered', quizScore: 5, quizPassedAt: new Date().toISOString(), lastPageRead: 1, lastAccessedAt: new Date().toISOString() },
    };
    expect(quizMaster.condition(progress, DEFAULT_STREAK)).toBe(true);
  });

  it('quiz-master does NOT trigger with score of 4', () => {
    const quizMaster = BADGES.find(b => b.id === 'quiz-master')!;
    const progress: Record<string, ModuleProgress> = {
      '0-1': { moduleId: '0-1', status: 'mastered', quizScore: 4, quizPassedAt: new Date().toISOString(), lastPageRead: 1, lastAccessedAt: new Date().toISOString() },
    };
    expect(quizMaster.condition(progress, DEFAULT_STREAK)).toBe(false);
  });

  it('eclipse-scholar triggers when module 13-4 is mastered', () => {
    const badge = BADGES.find(b => b.id === 'eclipse-scholar')!;
    const progress: Record<string, ModuleProgress> = {
      '13-4': { moduleId: '13-4', status: 'mastered', quizScore: 3, quizPassedAt: null, lastPageRead: 1, lastAccessedAt: new Date().toISOString() },
    };
    expect(badge.condition(progress, DEFAULT_STREAK)).toBe(true);
  });

  it('hora-expert triggers when module 7-4 is mastered', () => {
    const badge = BADGES.find(b => b.id === 'hora-expert')!;
    const progress: Record<string, ModuleProgress> = {
      '7-4': { moduleId: '7-4', status: 'mastered', quizScore: 3, quizPassedAt: null, lastPageRead: 1, lastAccessedAt: new Date().toISOString() },
    };
    expect(badge.condition(progress, DEFAULT_STREAK)).toBe(true);
  });

  it('pandit-badge triggers at 91+ mastered modules', () => {
    const badge = BADGES.find(b => b.id === 'pandit-badge')!;
    const progress = makeMasteredProgress(91);
    expect(badge.condition(progress, DEFAULT_STREAK)).toBe(true);
  });

  it('pandit-badge does NOT trigger at 90 mastered modules', () => {
    const badge = BADGES.find(b => b.id === 'pandit-badge')!;
    const progress = makeMasteredProgress(90);
    expect(badge.condition(progress, DEFAULT_STREAK)).toBe(false);
  });
});
