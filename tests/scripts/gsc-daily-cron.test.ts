import { describe, it, expect } from 'vitest';
import {
  buildPool,
  pickTargets,
  isoDateUtc,
  recordSubmission,
  LOCALES_BY_WEIGHT,
  type PoolEntry,
} from '../../scripts/gsc-daily-cron';

/**
 * Pure-logic tests for the GSC cron — pool generator, target selector,
 * date math, state recorder. The Playwright submission path is not
 * tested here; the integration verification lives in the actual run
 * (which writes outcomes to scripts/gsc-daily-cron.log).
 */

const FIXED_NOW = new Date('2026-06-15T06:00:00Z');

describe('isoDateUtc', () => {
  it('formats offset=0 as today (UTC)', () => {
    expect(isoDateUtc(0, FIXED_NOW)).toBe('2026-06-15');
  });
  it('formats offset=+2 as today plus 2 days', () => {
    expect(isoDateUtc(2, FIXED_NOW)).toBe('2026-06-17');
  });
  it('rolls month boundaries correctly', () => {
    expect(isoDateUtc(1, new Date('2026-06-30T23:00:00Z'))).toBe('2026-07-01');
  });
  it('uses UTC, not local timezone', () => {
    // Even if the runner is in CEST, a 23:00 UTC base + offset=0 stays
    // on that UTC day. This matches what GSC needs — URL templates
    // bake in the UTC date stamp.
    expect(isoDateUtc(0, new Date('2026-06-15T23:30:00Z'))).toBe('2026-06-15');
  });
});

describe('buildPool', () => {
  const pool = buildPool(FIXED_NOW);

  it('produces 40 URLs (4 locales × (3 dates × 2 routes + 4 evergreen))', () => {
    expect(pool.length).toBe(40);
  });

  it('produces unique URLs — no within-run duplicates', () => {
    const set = new Set(pool.map((p) => p.url));
    expect(set.size).toBe(pool.length);
  });

  it('every URL is HTTPS dekhopanchang.com', () => {
    for (const p of pool) {
      expect(p.url.startsWith('https://dekhopanchang.com/')).toBe(true);
    }
  });

  it('covers every weighted locale', () => {
    const locales = new Set(pool.map((p) => p.locale));
    for (const { code } of LOCALES_BY_WEIGHT) {
      expect(locales.has(code)).toBe(true);
    }
  });

  it('per-locale share is balanced — each locale gets the same number of slots', () => {
    const byLocale = new Map<string, number>();
    for (const p of pool) byLocale.set(p.locale, (byLocale.get(p.locale) ?? 0) + 1);
    // Each locale gets: 3 dates × 2 date-routes + 4 evergreen = 10
    for (const { code } of LOCALES_BY_WEIGHT) {
      expect(byLocale.get(code)).toBe(10);
    }
  });

  it('mixes date-rolling + evergreen categories', () => {
    const dates = pool.filter((p) => p.category === 'date');
    const evergreens = pool.filter((p) => p.category === 'evergreen');
    expect(dates.length).toBe(24); // 4 locales × 3 dates × 2 routes
    expect(evergreens.length).toBe(16); // 4 locales × 4 routes
  });

  it('uses today + today+1 + today+2 — not stale historical dates', () => {
    const dateUrls = pool.filter((p) => p.category === 'date');
    const expectedDates = ['2026-06-15', '2026-06-16', '2026-06-17'];
    for (const expectedDate of expectedDates) {
      expect(dateUrls.some((p) => p.url.includes(`/${expectedDate}`))).toBe(true);
    }
    // Yesterday must NOT appear — would waste a slot on stale content
    expect(dateUrls.some((p) => p.url.includes('/2026-06-14'))).toBe(false);
  });

  it('includes the four canonical evergreens for each locale', () => {
    for (const { code } of LOCALES_BY_WEIGHT) {
      for (const route of ['panchang', 'kundali', 'horoscope', 'matching']) {
        expect(pool.some((p) => p.url === `https://dekhopanchang.com/${code}/${route}`)).toBe(true);
      }
    }
  });
});

describe('pickTargets — rotation algorithm', () => {
  const pool: PoolEntry[] = [
    { url: 'https://dekhopanchang.com/mr/x', locale: 'mr', weight: 40, category: 'evergreen' },
    { url: 'https://dekhopanchang.com/mai/x', locale: 'mai', weight: 30, category: 'evergreen' },
    { url: 'https://dekhopanchang.com/hi/x', locale: 'hi', weight: 20, category: 'evergreen' },
    { url: 'https://dekhopanchang.com/en/x', locale: 'en', weight: 10, category: 'evergreen' },
  ];

  it('returns at most `quota` URLs', () => {
    expect(pickTargets(pool, {}, 2).length).toBe(2);
    expect(pickTargets(pool, {}, 10).length).toBe(4); // capped by pool size
  });

  it('never-submitted URLs come before any submitted URL — fresh content prioritised', () => {
    const history = {
      'https://dekhopanchang.com/mr/x': ['2026-06-15T06:00:00Z'], // submitted today
      // mai/hi/en never submitted
    };
    const picks = pickTargets(pool, history, 3);
    // mr should NOT be in the first 3 — never-submitted wins
    expect(picks.find((p) => p.url.includes('/mr/'))).toBeUndefined();
  });

  it('within never-submitted, higher weight wins — Marathi beats English', () => {
    const picks = pickTargets(pool, {}, 4);
    expect(picks[0].locale).toBe('mr'); // weight 40
    expect(picks[1].locale).toBe('mai'); // weight 30
    expect(picks[2].locale).toBe('hi'); // weight 20
    expect(picks[3].locale).toBe('en'); // weight 10
  });

  it('within submitted URLs, oldest submission wins', () => {
    const history = {
      'https://dekhopanchang.com/mr/x': ['2026-06-10T00:00:00Z'], // 5 days ago
      'https://dekhopanchang.com/mai/x': ['2026-06-14T00:00:00Z'], // 1 day ago
      'https://dekhopanchang.com/hi/x': ['2026-06-12T00:00:00Z'], // 3 days ago
      'https://dekhopanchang.com/en/x': ['2026-06-13T00:00:00Z'], // 2 days ago
    };
    const picks = pickTargets(pool, history, 4);
    // Order should be by lastSubmittedAt ascending — mr (10), hi (12), en (13), mai (14)
    expect(picks.map((p) => p.locale)).toEqual(['mr', 'hi', 'en', 'mai']);
  });

  it('only the most-recent submission timestamp counts — older retries are ignored', () => {
    const history = {
      // mr: submitted yesterday AND a week ago — most recent is yesterday
      'https://dekhopanchang.com/mr/x': ['2026-06-08T00:00:00Z', '2026-06-14T00:00:00Z'],
      // mai: only submitted a week ago
      'https://dekhopanchang.com/mai/x': ['2026-06-08T00:00:00Z'],
    };
    const picks = pickTargets(
      pool.filter((p) => p.locale === 'mr' || p.locale === 'mai'),
      history,
      2,
    );
    // mai should come first — its most-recent submission is older
    expect(picks[0].locale).toBe('mai');
    expect(picks[1].locale).toBe('mr');
  });

  it('returns empty array for empty pool', () => {
    expect(pickTargets([], {}, 5)).toEqual([]);
  });

  it('returns empty array for zero quota', () => {
    expect(pickTargets(pool, {}, 0)).toEqual([]);
  });
});

describe('recordSubmission', () => {
  it('appends to existing history list', () => {
    const state = { history: { 'https://x.com/a': ['2026-06-01T00:00:00Z'] } };
    recordSubmission(state, 'https://x.com/a', '2026-06-15T00:00:00Z');
    expect(state.history['https://x.com/a']).toEqual([
      '2026-06-01T00:00:00Z',
      '2026-06-15T00:00:00Z',
    ]);
  });

  it('creates a new entry for never-submitted URL', () => {
    const state = { history: {} };
    recordSubmission(state, 'https://x.com/new', '2026-06-15T00:00:00Z');
    expect(state.history['https://x.com/new']).toEqual(['2026-06-15T00:00:00Z']);
  });

  it('preserves history of other URLs', () => {
    const state = { history: { 'https://x.com/a': ['2026-06-01T00:00:00Z'] } };
    recordSubmission(state, 'https://x.com/b', '2026-06-15T00:00:00Z');
    expect(state.history['https://x.com/a']).toEqual(['2026-06-01T00:00:00Z']);
  });
});

describe('end-to-end rotation behaviour', () => {
  // Simulate 5 daily runs with a 4-locale pool of 40 URLs and quota 8.
  // After 5 runs, 40 submissions should be spread evenly — each URL
  // submitted exactly once. Confirms the rotation actually cycles.
  it('5 daily runs cover the full pool of 40 URLs exactly once', () => {
    const pool = buildPool(FIXED_NOW);
    const state = { history: {} as Record<string, string[]> };
    for (let day = 0; day < 5; day++) {
      const targets = pickTargets(pool, state.history, 8);
      for (const t of targets) {
        recordSubmission(state, t.url, `2026-06-${15 + day}T08:00:00Z`);
      }
    }
    const submittedUrls = new Set(Object.keys(state.history));
    expect(submittedUrls.size).toBe(40);
    for (const url of submittedUrls) {
      expect(state.history[url].length).toBe(1); // exactly once
    }
  });

  it('on day 6, rotation cycles back — re-submits the day-1 URLs first', () => {
    const pool = buildPool(FIXED_NOW);
    const state = { history: {} as Record<string, string[]> };
    for (let day = 0; day < 5; day++) {
      const targets = pickTargets(pool, state.history, 8);
      for (const t of targets) {
        recordSubmission(state, t.url, `2026-06-${15 + day}T08:00:00Z`);
      }
    }
    // Day 6: every URL has been submitted once; the 8 oldest (day-1
    // submissions, 2026-06-15) should come back.
    const day6 = pickTargets(pool, state.history, 8);
    for (const t of day6) {
      const lastAt = state.history[t.url][state.history[t.url].length - 1];
      // The 8 picked must all have last-at of 2026-06-15 (day 1)
      expect(lastAt).toBe('2026-06-15T08:00:00Z');
    }
  });
});
