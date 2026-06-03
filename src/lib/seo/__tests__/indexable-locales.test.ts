/**
 * Policy tests for `getIndexableLocales` — the single source of truth
 * for which routes ship en+hi-only content vs full 9-locale coverage.
 *
 * If you're tempted to change the assertions below, also change the
 * EN_HI_ONLY_PREFIXES list in indexable-locales.ts AND rebuild the
 * sitemap budget expectations in sitemap-budget.test.ts.
 */
import { describe, it, expect } from 'vitest';
import {
  INDEXABLE_EN_HI,
  getIndexableLocales,
  isLocaleIndexable,
} from '../indexable-locales';

describe('INDEXABLE_EN_HI', () => {
  it('contains exactly en and hi', () => {
    expect([...INDEXABLE_EN_HI]).toEqual(['en', 'hi']);
  });
});

describe('getIndexableLocales — /learn coverage policy', () => {
  it('returns undefined for the /learn hub (it has full PAGE_META translations)', () => {
    expect(getIndexableLocales('/learn')).toBeUndefined();
  });

  it('returns undefined for /learn with a trailing slash (Gemini PR #383 HIGH)', () => {
    // If `/learn/` falls through to the `route.startsWith('/learn/')`
    // branch, the hub gets misclassified as thin and emits noindex on
    // non-en/hi locales of the canonical /xx/learn URL. The trailing-
    // slash normalisation in getIndexableLocales closes that.
    expect(getIndexableLocales('/learn/')).toBeUndefined();
  });

  it.each([
    '/learn/surya',
    '/learn/chandra',
    '/learn/grahas',
    '/learn/nakshatras',
    '/learn/dashas',
    '/learn/kundali',
    '/learn/modules',
    '/learn/modules/0-1',
    '/learn/track/cosmology',
    '/learn/planet-in-house/sun-in-1st-house',
    '/learn/nakshatra-pada/ashwini-pada-1',
    '/learn/contributions/zero',
    '/learn/labs/panchang',
  ])('returns en+hi for thin /learn slug %s', (route) => {
    expect(getIndexableLocales(route)).toEqual(INDEXABLE_EN_HI);
  });
});

describe('getIndexableLocales — fully-translated routes (default)', () => {
  it.each([
    '/',
    '/panchang',
    '/panchang/tithi',
    '/panchang/mumbai',
    '/kundali',
    '/matching',
    '/festivals/diwali/2026',
    '/horoscope/mesh',
    '/calendar',
    '/devotional/aarti/hanuman-chalisa',
    '/puja/diwali',
  ])('returns undefined for %s (full 9-locale fan-out)', (route) => {
    expect(getIndexableLocales(route)).toBeUndefined();
  });
});

describe('isLocaleIndexable', () => {
  it('returns true for any locale on a fully-translated route', () => {
    for (const loc of ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr']) {
      expect(isLocaleIndexable('/panchang', loc)).toBe(true);
    }
  });

  it('returns true for en + hi on a thin /learn slug', () => {
    expect(isLocaleIndexable('/learn/surya', 'en')).toBe(true);
    expect(isLocaleIndexable('/learn/surya', 'hi')).toBe(true);
  });

  it('returns false for non-en/hi locales on a thin /learn slug', () => {
    for (const loc of ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr']) {
      expect(isLocaleIndexable('/learn/surya', loc)).toBe(false);
    }
  });
});
