import { describe, it, expect } from 'vitest';
import {
  buildIndexNowPaths,
  INDEXNOW_GROUP_PRIMARY,
  INDEXNOW_GROUP_DEVANAGARI_BN,
  INDEXNOW_GROUP_DRAVIDIAN_GU,
} from '../indexnow-urls';
import { locales } from '@/lib/i18n/config';

describe('IndexNow URL group definitions', () => {
  it('together the three groups cover every active locale exactly once', () => {
    const covered = [
      ...INDEXNOW_GROUP_PRIMARY,
      ...INDEXNOW_GROUP_DEVANAGARI_BN,
      ...INDEXNOW_GROUP_DRAVIDIAN_GU,
    ];
    expect(covered.length).toBe(locales.length);
    expect(new Set(covered).size).toBe(covered.length); // no overlap
    expect(new Set(covered)).toEqual(new Set(locales));
  });

  it('primary group is en + hi (highest traffic, established slot)', () => {
    expect(INDEXNOW_GROUP_PRIMARY).toEqual(['en', 'hi']);
  });

  it('devanagari group includes Maithili (#1 traffic driver per memory)', () => {
    expect(INDEXNOW_GROUP_DEVANAGARI_BN).toContain('mai');
  });
});

describe('buildIndexNowPaths', () => {
  const TODAY = '2026-06-15';

  it('produces a non-empty path list for each non-empty locale group', () => {
    expect(buildIndexNowPaths(INDEXNOW_GROUP_PRIMARY, TODAY).length).toBeGreaterThan(0);
    expect(buildIndexNowPaths(INDEXNOW_GROUP_DEVANAGARI_BN, TODAY).length).toBeGreaterThan(0);
    expect(buildIndexNowPaths(INDEXNOW_GROUP_DRAVIDIAN_GU, TODAY).length).toBeGreaterThan(0);
  });

  it('every emitted path starts with /{locale}/', () => {
    const paths = buildIndexNowPaths(['ta'], TODAY);
    for (const p of paths) {
      expect(p.startsWith('/ta')).toBe(true);
    }
  });

  it('emits the daily-changing URLs for the requested locale', () => {
    const paths = buildIndexNowPaths(['mai'], TODAY);
    expect(paths).toContain('/mai/panchang');
    expect(paths).toContain('/mai/rahu-kaal');
    expect(paths).toContain('/mai/horoscope');
    expect(paths).toContain('/mai');
    // Per-rashi (12) × { hub, dated } = 24 horoscope URLs per locale
    expect(paths.filter((p) => p.startsWith('/mai/horoscope/mesh')).length).toBe(2);
    expect(paths).toContain(`/mai/horoscope/mesh/${TODAY}`);
  });

  it('emits each regional calendar slug under the requested locale', () => {
    const paths = buildIndexNowPaths(['bn'], TODAY);
    expect(paths).toContain('/bn/calendar/regional/bengali');
    expect(paths).toContain('/bn/calendar/regional/mithila');
    expect(paths).toContain('/bn/calendar/regional/gujarati');
  });

  it('emits festival × current+next-year combinations only for valid years', () => {
    // Today 2026-06-15 → current=2026, next=2027. festival-defs covers
    // 2025-2030, so both should land.
    const paths = buildIndexNowPaths(['en'], TODAY);
    const matches = paths.filter((p) => /^\/en\/festivals\/[^/]+\/(2026|2027)$/.test(p));
    expect(matches.length).toBeGreaterThan(0);
  });

  it('derives the festival year window from `today`, not Date.now', () => {
    // Stress: pass a today far outside the valid year window. The
    // builder should emit zero festival URLs instead of throwing.
    const farFuture = '2050-01-01';
    const paths = buildIndexNowPaths(['en'], farFuture);
    const festivalPaths = paths.filter((p) => /^\/en\/festivals\//.test(p));
    expect(festivalPaths.length).toBe(0);
    // ... but the non-festival URLs still come through.
    expect(paths).toContain('/en/panchang');
  });

  it('scales linearly with the number of locales', () => {
    const onePath = buildIndexNowPaths(['en'], TODAY).length;
    const twoPath = buildIndexNowPaths(['en', 'hi'], TODAY).length;
    expect(twoPath).toBe(onePath * 2);
  });

  it('uses the passed `today` for date-specific URLs (no Date.now race)', () => {
    const paths = buildIndexNowPaths(['hi'], '2027-01-15');
    expect(paths).toContain('/hi/horoscope/mesh/2027-01-15');
    // None of the date-specific URLs should use any other date.
    const datedPaths = paths.filter((p) => /\/\d{4}-\d{2}-\d{2}$/.test(p));
    for (const p of datedPaths) {
      expect(p.endsWith('2027-01-15')).toBe(true);
    }
  });

  it('emits no overlapping URLs across the three groups for the same day', () => {
    // The split by locale guarantees this — but assert it as a sanity
    // contract so a future refactor that mixes the buckets can't
    // accidentally re-submit a URL on two cron runs.
    const a = new Set(buildIndexNowPaths(INDEXNOW_GROUP_PRIMARY, TODAY));
    const b = new Set(buildIndexNowPaths(INDEXNOW_GROUP_DEVANAGARI_BN, TODAY));
    const c = new Set(buildIndexNowPaths(INDEXNOW_GROUP_DRAVIDIAN_GU, TODAY));
    for (const url of a) expect(b.has(url)).toBe(false);
    for (const url of a) expect(c.has(url)).toBe(false);
    for (const url of b) expect(c.has(url)).toBe(false);
  });
});
