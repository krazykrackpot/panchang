import { describe, it, expect } from 'vitest';
import { computeLevel, type LevelInputs } from '@/lib/gamification/level-compute';

const base: LevelInputs = {
  profileComplete: false,
  hasFirstAction: false,
  streakDays: 0,
  modulesDone: 0,
  toolsUsedCount: 0,
  acharyaUnlocked: false,
  chartsSaved: 0,
};

describe('computeLevel', () => {
  it('returns 1 (Shishya) for a fresh signup', () => {
    expect(computeLevel(base)).toBe(1);
  });
  it('returns 2 (Sadhaka) when profile complete', () => {
    expect(computeLevel({ ...base, profileComplete: true })).toBe(2);
  });
  it('returns 3 (Jignasu) after first action', () => {
    expect(computeLevel({ ...base, profileComplete: true, hasFirstAction: true })).toBe(3);
  });
  it('returns 4 (Vidvan) on 7-day streak', () => {
    expect(computeLevel({ ...base, profileComplete: true, hasFirstAction: true, streakDays: 7 })).toBe(4);
  });
  it('returns 4 (Vidvan) on 5 modules', () => {
    expect(computeLevel({ ...base, profileComplete: true, hasFirstAction: true, modulesDone: 5 })).toBe(4);
  });
  it('returns 5 (Jyotishi) on 5 tools', () => {
    expect(computeLevel({ ...base, profileComplete: true, hasFirstAction: true, modulesDone: 5, toolsUsedCount: 5 })).toBe(5);
  });
  it('returns 6 (Acharya) when acharyaUnlocked', () => {
    expect(computeLevel({ ...base, profileComplete: true, hasFirstAction: true, modulesDone: 5, toolsUsedCount: 5, acharyaUnlocked: true })).toBe(6);
  });
  it('returns 7 (Rishi) with 30d streak + 10 charts + 10 modules', () => {
    expect(computeLevel({
      ...base, profileComplete: true, hasFirstAction: true,
      modulesDone: 10, toolsUsedCount: 5, acharyaUnlocked: true,
      streakDays: 30, chartsSaved: 10,
    })).toBe(7);
  });
  it('regression: 4 modules done returns Jignasu (3)', () => {
    expect(computeLevel({ ...base, profileComplete: true, hasFirstAction: true, modulesDone: 4 })).toBe(3);
  });
});
