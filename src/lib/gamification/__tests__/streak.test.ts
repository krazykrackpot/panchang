import { describe, it, expect } from 'vitest';
import { computeStreakAfterVisit } from '@/lib/gamification/streak';

describe('streak math (computeStreakAfterVisit)', () => {
  it('first ever visit sets streak to 1', () => {
    const r = computeStreakAfterVisit({
      streakDays: 0, lastVisit: null, freezeUsedAt: null, today: '2026-05-22',
    });
    expect(r).toEqual({ streakDays: 1, lastVisit: '2026-05-22', freezeUsedAt: null, levelChanged: false });
  });

  it('same-day revisit is no-op', () => {
    const r = computeStreakAfterVisit({
      streakDays: 5, lastVisit: '2026-05-22', freezeUsedAt: null, today: '2026-05-22',
    });
    expect(r).toEqual({ streakDays: 5, lastVisit: '2026-05-22', freezeUsedAt: null, levelChanged: false });
  });

  it('next-day visit advances streak', () => {
    const r = computeStreakAfterVisit({
      streakDays: 5, lastVisit: '2026-05-22', freezeUsedAt: null, today: '2026-05-23',
    });
    expect(r).toEqual({ streakDays: 6, lastVisit: '2026-05-23', freezeUsedAt: null, levelChanged: false });
  });

  it('two-day gap (not Tue) resets streak', () => {
    const r = computeStreakAfterVisit({
      streakDays: 5, lastVisit: '2026-05-22', freezeUsedAt: null, today: '2026-05-24',
    });
    expect(r.streakDays).toBe(1);
    expect(r.lastVisit).toBe('2026-05-24');
    expect(r.freezeUsedAt).toBeNull();
  });

  it('missed Monday → Tuesday visit consumes freeze and preserves streak', () => {
    const r = computeStreakAfterVisit({
      streakDays: 6, lastVisit: '2026-05-17', freezeUsedAt: null, today: '2026-05-19',
    });
    expect(r.streakDays).toBe(7);
    expect(r.lastVisit).toBe('2026-05-19');
    expect(r.freezeUsedAt).toBe('2026-05-18');
  });

  it('Wednesday after missing Mon+Tue → freeze cannot save, resets', () => {
    const r = computeStreakAfterVisit({
      streakDays: 6, lastVisit: '2026-05-17', freezeUsedAt: null, today: '2026-05-20',
    });
    expect(r.streakDays).toBe(1);
    expect(r.lastVisit).toBe('2026-05-20');
    expect(r.freezeUsedAt).toBeNull();
  });

  it('freeze already used this Monday cannot be reused', () => {
    const r = computeStreakAfterVisit({
      streakDays: 7, lastVisit: '2026-05-19', freezeUsedAt: '2026-05-18', today: '2026-05-21',
    });
    expect(r.streakDays).toBe(1);
  });
});
