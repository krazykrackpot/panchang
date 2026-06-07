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
  ])('returns en+hi for %s', (route) => {
    expect(getIndexableLocales(route)).toEqual(INDEXABLE_EN_HI);
  });

  it('noindexes regional Indic locales on thin-coverage prefixes', () => {
    // /learn/ is the only remaining thin-coverage prefix where
    // regional Indic locales should be noindexed. /baby-names/,
    // /matching/, /devotional/, /horoscope/, /gauri-panchang/ have
    // all been promoted to full 9-locale parity (PRs #481, #493,
    // #496, #502, #506, plus the baby-names promotion).
    for (const route of [
      '/learn/surya',
      '/learn/modules/0-1',
    ]) {
      for (const loc of REGIONAL_INDIC) {
        expect(isLocaleIndexable(route, loc)).toBe(false);
      }
    }
  });
});

describe('option F — /baby-names/ promoted to full 9-locale parity', () => {
  // Page chrome + 2 educational paragraphs translated to 6 missing
  // locales via Gemini 2.5 Flash (scripts/translate-baby-names-via-
  // gemini.py). NAKSHATRA_SYLLABLES already carried all 10 locale
  // fields; the [nakshatra] page METADATA dispatch + chrome LABELS
  // close the rest.
  const FULL_9 = ['en', 'hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'];

  it.each([
    '/baby-names/punarvasu',
    '/baby-names/revati',
    '/baby-names/ashwini',
  ])('returns all 9 locales for %s', (route) => {
    expect(getIndexableLocales(route)).toEqual(FULL_9);
  });

  it('every locale is indexable for /baby-names/ nakshatra URLs', () => {
    const route = '/baby-names/punarvasu';
    for (const loc of FULL_9) {
      expect(isLocaleIndexable(route, loc)).toBe(true);
    }
  });
});

describe('option E — /devotional/ promoted to full 9-locale parity', () => {
  // src/lib/content/devotional-locale-overlay.ts attaches Gemini-
  // translated overlays for all 55 devotional items × 7 regional Indic
  // locales (mai/mr/ta/te/kn/gu/bn) at module load. Sacred Devanagari
  // mantras + transliterations stay AS-IS for every locale; only
  // title/meaning/significance + page chrome are localised.
  const FULL_9 = ['en', 'hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'];

  it.each([
    '/devotional/aarti/santoshi-maa-aarti',
    '/devotional/stotram/hanuman-bahuk',
    '/devotional/chalisa/shani-chalisa',
    '/devotional/mantra/gayatri',
  ])('returns all 9 locales for %s', (route) => {
    expect(getIndexableLocales(route)).toEqual(FULL_9);
  });

  it('every locale is indexable for /devotional/ slug URLs', () => {
    const route = '/devotional/aarti/santoshi-maa-aarti';
    for (const loc of FULL_9) {
      expect(isLocaleIndexable(route, loc)).toBe(true);
    }
  });
});

describe('option B — /matching/ promoted to full 9-locale parity', () => {
  // rashi-compatibility.ts attaches per-locale overlays for all 7
  // regional Indic locales (mai/mr/ta/te/kn/gu/bn) at module-load
  // via attachLocaleOverlay(). The /matching/ prefix policy was
  // promoted accordingly so every /matching/[pair] URL renders
  // localized body content into the sitemap + hreflang fan-out.
  const FULL_9 = ['en', 'hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'];

  it.each([
    '/matching/aries-and-leo',
    '/matching/vrishchik-and-dhanu',
    '/matching/cancer-and-pisces',
  ])('returns all 9 locales for %s', (route) => {
    expect(getIndexableLocales(route)).toEqual(FULL_9);
  });

  it('every locale is indexable for /matching/ pair URLs', () => {
    const route = '/matching/aries-and-leo';
    for (const loc of FULL_9) {
      expect(isLocaleIndexable(route, loc)).toBe(true);
    }
  });
});

describe('option C — /horoscope/ promoted to full 9-locale parity', () => {
  // horoscope templates + rashi-editorial attach Gemini-generated
  // locale overlays at module load for all 7 regional Indic locales
  // via src/lib/horoscope/locale-overlay.ts. Page chrome covers all
  // 9 locales via LABELS[locale] in [rashi]/page.tsx.
  const FULL_9 = ['en', 'hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'];

  it.each([
    '/horoscope/aries',
    '/horoscope/mesh',
    '/horoscope/aries/2026-06-04',
    '/horoscope/aries/weekly',
    '/horoscope/aries/monthly',
  ])('returns all 9 locales for %s', (route) => {
    expect(getIndexableLocales(route)).toEqual(FULL_9);
  });

  it('every locale is indexable for /horoscope/ pages', () => {
    const route = '/horoscope/aries';
    for (const loc of FULL_9) {
      expect(isLocaleIndexable(route, loc)).toBe(true);
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

describe('option D — /gauri-panchang/ promoted to full 9-locale parity', () => {
  // GAURI_NAMES (src/lib/constants/gauri-panchang.ts) gained mai/mr/gu/bn
  // alongside the existing en/hi/sa/ta/te/kn/ml. [date]/page.tsx now
  // dispatches all chrome via a 9-locale LABELS dict; Client.tsx LABELS
  // extended with the same 6 missing locales via Gemini 2.5 Flash on
  // Vertex AI.
  const FULL_9 = ['en', 'hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'];

  it.each([
    '/gauri-panchang/2026-06-04',
    '/gauri-panchang/2026-07-04',
    '/gauri-panchang/2026-07-24',
  ])('returns all 9 locales for %s', (route) => {
    const result = getIndexableLocales(route);
    expect(result).not.toBeUndefined();
    expect([...result!]).toEqual(FULL_9);
  });

  it('every locale is indexable on /gauri-panchang dates', () => {
    const route = '/gauri-panchang/2026-07-04';
    for (const loc of FULL_9) {
      expect(isLocaleIndexable(route, loc)).toBe(true);
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
    // /learn/ stays en+hi with no per-route overrides (other than the
    // /learn/yoga/ promotion). /baby-names/ and /devotional/ used to
    // be examples here but were both promoted to all 9 locales.
    expect(getIndexableLocales('/learn/surya')).toEqual(['en', 'hi']);
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
    // /learn/ remains the only thin-coverage cluster after the
    // /baby-names/ promotion.
    expect(isLocaleIndexable('/learn/surya', 'ta')).toBe(false);
    expect(isLocaleIndexable('/learn/modules/0-1', 'gu')).toBe(false);
  });
});
