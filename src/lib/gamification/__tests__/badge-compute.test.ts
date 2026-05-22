import { describe, it, expect } from 'vitest';
import { computeEarnedBadges, type BadgeInputs } from '@/lib/gamification/badge-compute';

const empty: BadgeInputs = {
  profileComplete: false,
  chartsSaved: 0,
  modulesDone: 0,
  nakshatraModulesDone: 0,
  toolsUsedCount: 0,
  streakDays: 0,
  visitedOnBirthday: false,
  visitedBeforeSixAmIst: false,
  visitedOnFestival: false,
};

describe('computeEarnedBadges', () => {
  it('returns empty set for fresh signup', () => {
    expect(computeEarnedBadges(empty)).toEqual(new Set());
  });
  it('grants lit-the-lamp + star-identified on profile complete', () => {
    const s = computeEarnedBadges({ ...empty, profileComplete: true });
    expect(s.has('lit-the-lamp')).toBe(true);
    expect(s.has('star-identified')).toBe(true);
  });
  it('grants chart badges at 1, 5, 10', () => {
    expect(computeEarnedBadges({ ...empty, profileComplete: true, chartsSaved: 1 }).has('family-constellation')).toBe(true);
    expect(computeEarnedBadges({ ...empty, profileComplete: true, chartsSaved: 5 }).has('five-star-family')).toBe(true);
    expect(computeEarnedBadges({ ...empty, profileComplete: true, chartsSaved: 10 }).has('constellation-keeper')).toBe(true);
  });
  it('grants learning badges at 1, 5, 20, and 27-nakshatras threshold', () => {
    expect(computeEarnedBadges({ ...empty, modulesDone: 1 }).has('first-page')).toBe(true);
    expect(computeEarnedBadges({ ...empty, modulesDone: 5 }).has('scholar')).toBe(true);
    expect(computeEarnedBadges({ ...empty, modulesDone: 20 }).has('curriculum-master')).toBe(true);
    expect(computeEarnedBadges({ ...empty, nakshatraModulesDone: 27 }).has('twenty-seven-nakshatras')).toBe(true);
  });
  it('grants tool badges at 3, 5, 10', () => {
    expect(computeEarnedBadges({ ...empty, toolsUsedCount: 3 }).has('tool-explorer')).toBe(true);
    expect(computeEarnedBadges({ ...empty, toolsUsedCount: 5 }).has('pentavalent')).toBe(true);
    expect(computeEarnedBadges({ ...empty, toolsUsedCount: 10 }).has('all-around')).toBe(true);
  });
  it('grants streak badges at 7, 15, 30', () => {
    expect(computeEarnedBadges({ ...empty, streakDays: 7 }).has('first-cycle')).toBe(true);
    expect(computeEarnedBadges({ ...empty, streakDays: 15 }).has('lunar-cycle')).toBe(true);
    expect(computeEarnedBadges({ ...empty, streakDays: 30 }).has('full-moon')).toBe(true);
  });
  it('grants special badges on flags', () => {
    expect(computeEarnedBadges({ ...empty, visitedOnBirthday: true }).has('solar-return')).toBe(true);
    expect(computeEarnedBadges({ ...empty, visitedBeforeSixAmIst: true }).has('early-bird')).toBe(true);
    expect(computeEarnedBadges({ ...empty, visitedOnFestival: true }).has('festival-witness')).toBe(true);
  });
});
