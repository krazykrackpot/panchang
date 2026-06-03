/**
 * Tests for the IndexNow prune URL enumerator. The list must:
 *   - Cover all 9 active locales
 *   - Stay inside the stale window (±15..±90 days from `now`)
 *   - NOT include any URL inside the indexable ±14d window
 *     (otherwise we'd ping URLs we want kept in the index)
 *   - Include festival pages for stale years only
 *   - Stay under IndexNow's 10,000-URL per-call cap with headroom
 */
import { describe, it, expect } from 'vitest';
import { buildIndexNowPrunePaths, INDEXNOW_PRUNE_LOCALES } from '../indexnow-prune';
import { STALENESS_DAYS, FESTIVAL_YEAR_OFFSET } from '../staleness';

const FIXED_NOW = new Date('2026-06-03T12:00:00Z');

describe('buildIndexNowPrunePaths — locale coverage', () => {
  it('emits paths for all 9 active locales', () => {
    const paths = buildIndexNowPrunePaths(FIXED_NOW);
    for (const locale of INDEXNOW_PRUNE_LOCALES) {
      const count = paths.filter(p => p.startsWith(`/${locale}/`)).length;
      expect(count, `expected paths for /${locale}/, found ${count}`).toBeGreaterThan(0);
    }
  });
});

describe('buildIndexNowPrunePaths — staleness window correctness', () => {
  it('does NOT include any date inside the ±14 indexable window', () => {
    const paths = buildIndexNowPrunePaths(FIXED_NOW);
    const dateRegex = /\/(panchang\/date|choghadiya|gauri-panchang|horoscope\/[a-z]+)\/(\d{4}-\d{2}-\d{2})/;
    const todayMs = Date.UTC(2026, 5, 3); // June 3, 2026

    let violations = 0;
    for (const p of paths) {
      const m = p.match(dateRegex);
      if (!m) continue;
      const dateMs = Date.parse(`${m[2]}T00:00:00Z`);
      const days = Math.abs(dateMs - todayMs) / 86_400_000;
      if (days <= STALENESS_DAYS) violations++;
    }
    expect(violations, `${violations} URLs are inside the indexable window`).toBe(0);
  });

  it('includes dates at exactly STALENESS_DAYS + 1 (first stale day)', () => {
    const paths = buildIndexNowPrunePaths(FIXED_NOW);
    const firstStalePast = '2026-05-19'; // 15 days before June 3
    const firstStaleFuture = '2026-06-18'; // 15 days after June 3
    expect(paths.some(p => p.endsWith(firstStalePast))).toBe(true);
    expect(paths.some(p => p.endsWith(firstStaleFuture))).toBe(true);
  });

  it('does NOT extend beyond 45 days in either direction', () => {
    // STALE_WINDOW_DAYS is 45 — tightened from the 90 explored in
    // the spec because URLs older than 45 days are likely already
    // dropped by Google's natural re-crawl, AND because submitting
    // 20k+ URLs in one call risks the IndexNow per-key rate limit
    // (we hit 429 at 472 URLs on 2026-06-01). See indexnow-prune.ts
    // header for the full reasoning.
    const paths = buildIndexNowPrunePaths(FIXED_NOW);
    const dateRegex = /(\d{4}-\d{2}-\d{2})$/;
    const todayMs = Date.UTC(2026, 5, 3);

    let beyond45 = 0;
    for (const p of paths) {
      const m = p.match(dateRegex);
      if (!m) continue;
      const dateMs = Date.parse(`${m[1]}T00:00:00Z`);
      const days = Math.abs(dateMs - todayMs) / 86_400_000;
      if (days > 45) beyond45++;
    }
    expect(beyond45, `${beyond45} URLs are beyond the ±45-day window`).toBe(0);
  });
});

describe('buildIndexNowPrunePaths — cluster coverage', () => {
  it('includes paths for all 4 date-keyed clusters', () => {
    const paths = buildIndexNowPrunePaths(FIXED_NOW);
    expect(paths.some(p => p.includes('/panchang/date/'))).toBe(true);
    expect(paths.some(p => p.includes('/choghadiya/'))).toBe(true);
    expect(paths.some(p => p.includes('/gauri-panchang/'))).toBe(true);
    expect(paths.some(p => /\/horoscope\/[a-z]+\/\d{4}/.test(p))).toBe(true);
  });

  it('fans /horoscope across all 12 rashis', () => {
    const paths = buildIndexNowPrunePaths(FIXED_NOW);
    const rashis = new Set<string>();
    for (const p of paths) {
      const m = p.match(/\/horoscope\/([a-z]+)\/\d{4}/);
      if (m) rashis.add(m[1]);
    }
    expect(rashis.size).toBe(12);
  });
});

describe('buildIndexNowPrunePaths — Rule 3 (festival years)', () => {
  it('includes festival URLs for years < currentYear - 1', () => {
    const paths = buildIndexNowPrunePaths(FIXED_NOW);
    const festivalRegex = /\/festivals\/[a-z-]+\/(\d{4})$/;

    const includedYears = new Set<number>();
    for (const p of paths) {
      const m = p.match(festivalRegex);
      if (m) includedYears.add(parseInt(m[1], 10));
    }

    // When now=2026, threshold = 2024. Festival year 2025 should NOT
    // be in the prune list (still indexable); 2024 and earlier should be.
    expect(includedYears.has(2026)).toBe(false);
    expect(includedYears.has(2025)).toBe(false);
    for (const year of includedYears) {
      expect(year, `${year} should be < 2025`).toBeLessThan(2026 - FESTIVAL_YEAR_OFFSET);
    }
  });
});

describe('buildIndexNowPrunePaths — IndexNow cap', () => {
  it('stays under the 10,000-URL per-call limit', () => {
    const paths = buildIndexNowPrunePaths(FIXED_NOW);
    expect(paths.length).toBeLessThan(10_000);
  });

  it('emits a non-trivial number of URLs (sanity)', () => {
    // ±45 stale window × 15 paths-per-date × 9 locales ≈ 8,400. If we
    // drop below ~5,000, something silently regressed the locale set
    // or the rashi fan-out.
    const paths = buildIndexNowPrunePaths(FIXED_NOW);
    expect(paths.length).toBeGreaterThan(5_000);
  });
});

describe('buildIndexNowPrunePaths — path shape', () => {
  it('every path starts with a slash and a locale', () => {
    const paths = buildIndexNowPrunePaths(FIXED_NOW);
    const bad = paths.filter(p => !/^\/(en|hi|mai|mr|bn|ta|te|gu|kn)\//.test(p));
    expect(bad.slice(0, 5), 'first 5 malformed').toEqual([]);
  });

  it('emits unique URLs (no duplicates)', () => {
    const paths = buildIndexNowPrunePaths(FIXED_NOW);
    const set = new Set(paths);
    expect(set.size, `${paths.length - set.size} duplicates`).toBe(paths.length);
  });
});
