/**
 * Policy tests for `getIndexableLocales` — the single source of truth
 * for which routes ship which indexable locales.
 *
 * If you're tempted to change the assertions below, also change the
 * INDEXABLE_BY_PREFIX policy in indexable-locales.ts AND rebuild the
 * sitemap budget expectations in sitemap-budget.test.ts.
 *
 * Coverage:
 *   - Prefix policy: thin-coverage prefixes restrict to en+hi (or
 *     en+hi+ta+te+kn for /gauri-panchang/)
 *   - Hub protection: every prefix's parent hub stays fully indexable
 *     (Gemini PR #407 cycle-1)
 *   - Longest-match resolution: order-independent prefix lookup
 *     (Gemini PR #407 cycle-1)
 *   - Trailing-slash normalisation on override lookup (Gemini PR
 *     #407 cycle-2)
 *   - Full coverage outside thin-coverage prefixes
 *
 * Spec: docs/specs/2026-06-04-noindex-thin-translation-locales.md
 */
import { describe, it, expect } from 'vitest';
import {
  INDEXABLE_EN_HI,
  getIndexableLocales,
  isLocaleIndexable,
} from '../indexable-locales';

const ALL_LOCALES = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mr', 'mai'] as const;
const REGIONAL_INDIC = ['ta', 'te', 'bn', 'gu', 'kn', 'mr', 'mai'] as const;
const GAURI_PANCHANG_INDEXABLE = ['en', 'hi', 'ta', 'te', 'kn'] as const;

describe('INDEXABLE_EN_HI constant', () => {
  it('contains exactly en and hi', () => {
    expect([...INDEXABLE_EN_HI]).toEqual(['en', 'hi']);
  });
});

describe('thin-coverage prefix policy — en+hi only', () => {
  it.each([
    '/learn/surya',
    '/learn/chandra',
    '/learn/modules',
    '/learn/modules/0-1',
    '/learn/planet-in-house/sun-in-1st-house',
    '/matching/aries-and-leo',
    '/matching/vrishchik-and-dhanu',
    '/devotional/aarti/santoshi-maa-aarti',
    '/devotional/stotram/hanuman-bahuk',
    '/devotional/chalisa/shani-chalisa',
    '/baby-names/punarvasu',
    '/baby-names/revati',
    '/horoscope/mesh',
    '/horoscope/aries',
    '/horoscope/aries/2026-06-04',
    '/horoscope/aries/weekly',
    '/horoscope/aries/monthly',
  ])('returns en+hi for %s', (route) => {
    expect(getIndexableLocales(route)).toEqual(INDEXABLE_EN_HI);
  });

  it('noindexes regional Indic locales on thin-coverage prefixes', () => {
    for (const route of [
      '/matching/aries-and-leo',
      '/devotional/aarti/santoshi-maa-aarti',
      '/baby-names/punarvasu',
      '/horoscope/aries/2026-06-04',
    ]) {
      for (const loc of REGIONAL_INDIC) {
        expect(isLocaleIndexable(route, loc)).toBe(false);
      }
    }
  });
});

describe('option A — /learn/yoga/ promoted to en+hi+mai+ta+te+bn+gu+kn+mr', () => {
  // All 103 yoga slugs got authoritative Maithili (PR #412) + Tamil
  // (this PR) translations via yoga-{mai,ta}-overlay.json. The
  // /learn/yoga/ prefix policy was promoted accordingly. Longest-match
  // resolution beats the broader /learn/ entry above.
  // te/bn/gu/kn/mr arrive in PR-2 as their overlays complete. Spec
  // §3 state 3 promotion.
  it.each([
    '/learn/yoga/gajakesari',
    '/learn/yoga/vasumati',
    '/learn/yoga/mangala_dosha',
    '/learn/yoga/kala_sarpa',
    '/learn/yoga/adhi',
  ])('returns en+hi+mai+ta+te+bn+gu+kn+mr for %s', (route) => {
    expect(getIndexableLocales(route)).toEqual(['en', 'hi', 'mai', 'ta', 'te', 'bn', 'gu', 'kn', 'mr']);
  });

  it('all 7 regional Indic locales are indexable for every yoga slug', () => {
    for (const route of ['/learn/yoga/gajakesari', '/learn/yoga/vasumati', '/learn/yoga/adhi']) {
      for (const loc of ['mai', 'ta', 'te', 'bn', 'gu', 'kn', 'mr']) {
        expect(isLocaleIndexable(route, loc)).toBe(true);
      }
    }
  });

  it('every regional Indic locale is now indexable on /learn/yoga/', () => {
    const route = '/learn/yoga/gajakesari';
    for (const loc of ['ta', 'te', 'bn', 'gu', 'kn', 'mr', 'mai']) {
      expect(isLocaleIndexable(route, loc)).toBe(true);
    }
  });

  it('sibling /learn/* paths stay en+hi only (longest-match wins)', () => {
    // /learn/surya hits the broader /learn/ entry, not /learn/yoga/.
    expect(getIndexableLocales('/learn/surya')).toEqual(['en', 'hi']);
    expect(getIndexableLocales('/learn/modules/0-1')).toEqual(['en', 'hi']);
  });
});

describe('partial-coverage policy — /gauri-panchang/ (en+hi+ta+te+kn)', () => {
  it.each([
    '/gauri-panchang/2026-06-04',
    '/gauri-panchang/2026-07-04',
    '/gauri-panchang/2026-07-24',
  ])('returns en+hi+ta+te+kn for %s', (route) => {
    const result = getIndexableLocales(route);
    expect(result).not.toBeUndefined();
    expect([...result!]).toEqual([...GAURI_PANCHANG_INDEXABLE]);
  });

  it('keeps ta+te+kn indexable on /gauri-panchang dates', () => {
    const route = '/gauri-panchang/2026-07-04';
    for (const loc of GAURI_PANCHANG_INDEXABLE) {
      expect(isLocaleIndexable(route, loc)).toBe(true);
    }
    for (const loc of ['bn', 'gu', 'mr', 'mai']) {
      expect(isLocaleIndexable(route, loc)).toBe(false);
    }
  });
});

describe('hub-page protection (Gemini PR #407 cycle-1)', () => {
  // Hubs are the PARENT routes of thin-coverage prefixes (e.g. /learn,
  // /matching). Their own page content is PAGE_META-driven and stays
  // fully indexable. Without protection, a trailing-slash visit would
  // match the prefix and incorrectly noindex the hub.
  const HUBS = [
    '/learn',
    '/matching',
    '/devotional',
    '/baby-names',
    '/horoscope',
    '/gauri-panchang',
  ];

  it.each(HUBS)('returns undefined for hub %s (no trailing slash)', (hub) => {
    expect(getIndexableLocales(hub)).toBeUndefined();
  });

  it.each(HUBS)('returns undefined for hub %s/ (with trailing slash)', (hub) => {
    expect(getIndexableLocales(`${hub}/`)).toBeUndefined();
  });

  it('every hub is indexable in all 9 locales', () => {
    for (const hub of HUBS) {
      for (const loc of ALL_LOCALES) {
        expect(isLocaleIndexable(hub, loc)).toBe(true);
        expect(isLocaleIndexable(`${hub}/`, loc)).toBe(true);
      }
    }
  });
});

describe('fully-translated routes (default full coverage)', () => {
  it.each([
    '/',
    '/panchang',
    '/panchang/tithi',
    '/panchang/mumbai',
    '/panchang/date/2026-06-04',
    '/kundali',
    '/festivals/diwali/2026',
    '/calendar',
    '/calendar/diwali',
    '/choghadiya/2026-06-04',
    '/puja/diwali',
    '/muhurta/marriage',
  ])('returns undefined for %s', (route) => {
    expect(getIndexableLocales(route)).toBeUndefined();
  });

  it('every locale is indexable on fully-translated routes', () => {
    for (const loc of ALL_LOCALES) {
      expect(isLocaleIndexable('/panchang', loc)).toBe(true);
      expect(isLocaleIndexable('/festivals/diwali/2026', loc)).toBe(true);
    }
  });
});

describe('PER_ROUTE_INDEXABLE — transitional staging shape', () => {
  // PER_ROUTE_INDEXABLE is empty after option A pilot promoted
  // /learn/yoga/ to prefix-level en+hi+mai. These tests document the
  // lookup shape using a prefix where overrides could exist (the
  // empty map at first means nothing flips).
  it('returns just the prefix set when no override exists', () => {
    // /matching/ is en+hi only with no per-route overrides.
    expect(getIndexableLocales('/matching/aries-and-leo')).toEqual(['en', 'hi']);
  });

  it('trailing slash in the looked-up route is handled defensively', () => {
    // Gemini PR #407 cycle-2 — guards against future callers passing
    // a stray trailing slash on the override lookup.
    const withSlash = getIndexableLocales('/matching/aries-and-leo/');
    const without = getIndexableLocales('/matching/aries-and-leo');
    expect(withSlash).toEqual(without);
  });
});

describe('regression: route equality / boundary semantics', () => {
  it('routes that look prefix-y but are not children stay full coverage', () => {
    // `/horoscope-archive` is NOT under `/horoscope/`; full coverage.
    expect(getIndexableLocales('/horoscope-archive')).toBeUndefined();
    // Same for any plausible neighbour route
    expect(getIndexableLocales('/learning-resources')).toBeUndefined();
    expect(getIndexableLocales('/matchings')).toBeUndefined();
  });

  it('routes inside a thin-prefix get the prefix policy', () => {
    expect(isLocaleIndexable('/horoscope/aries', 'mai')).toBe(false);
    expect(isLocaleIndexable('/devotional/aarti/foo', 'gu')).toBe(false);
  });
});
