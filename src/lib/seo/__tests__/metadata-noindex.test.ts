/**
 * Verifies `getPageMetadata` integrates with the thin-coverage policy
 * from `indexable-locales.ts`:
 *
 *   1. Fully-translated routes emit hreflang for all 9 locales + no robots tag.
 *   2. Thin-coverage routes (/learn/<slug>) emit hreflang only for en+hi,
 *      and emit `robots: { index: false, follow: true }` when served on
 *      a non-indexable locale URL.
 *
 * This is the integration point that closes the May 31 traffic-collapse
 * loop on the metadata side. The sitemap side is closed by sitemap.ts +
 * sitemap-budget.test.ts.
 */
import { describe, it, expect } from 'vitest';
import { getPageMetadata } from '../metadata';

describe('getPageMetadata — fully-translated route', () => {
  it('emits hreflang for all 9 locales + x-default on /panchang', () => {
    const meta = getPageMetadata('/panchang', 'en');
    const langs = (meta.alternates?.languages ?? {}) as Record<string, string>;
    const keys = Object.keys(langs).sort();
    expect(keys).toEqual(
      ['bn', 'en', 'gu', 'hi', 'kn', 'mai', 'mr', 'ta', 'te', 'x-default'],
    );
  });

  it('does NOT emit robots:noindex on /panchang for any locale', () => {
    for (const loc of ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr']) {
      const meta = getPageMetadata('/panchang', loc);
      expect(meta.robots, `expected /panchang on ${loc} to have no robots tag`).toBeUndefined();
    }
  });
});

describe('getPageMetadata — /learn slug (promoted to 9-locale parity PR #596)', () => {
  // /learn/* used to be EN+HI only with noindex on regional Indic
  // locales. PR #596 (2026-06-08) flipped the policy after all
  // /learn/*.json message files were translated to ≥86% per-locale.
  const FULL_9_HREFLANG = ['bn', 'en', 'gu', 'hi', 'kn', 'mai', 'mr', 'ta', 'te', 'x-default'];

  it('emits hreflang for all 9 locales + x-default on /learn/surya', () => {
    const meta = getPageMetadata('/learn/surya', 'en');
    const langs = (meta.alternates?.languages ?? {}) as Record<string, string>;
    const keys = Object.keys(langs).sort();
    expect(keys).toEqual(FULL_9_HREFLANG);
  });

  it('emits NO robots tag for any locale (all 9 are indexable)', () => {
    for (const loc of ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr']) {
      expect(getPageMetadata('/learn/surya', loc).robots).toBeUndefined();
    }
  });

  it('also applies to /learn/* sub-trees (modules, contributions, labs)', () => {
    for (const route of [
      '/learn/modules/0-1',
      '/learn/contributions/zero',
      '/learn/labs/panchang',
      '/learn/planet-in-house/sun-in-1st-house',
      '/learn/nakshatra-pada/ashwini-pada-1',
    ]) {
      const meta = getPageMetadata(route, 'ta');
      expect(meta.robots, `${route} ta should be indexable (no robots tag)`).toBeUndefined();
      const langs = (meta.alternates?.languages ?? {}) as Record<string, string>;
      expect(Object.keys(langs).sort()).toEqual(FULL_9_HREFLANG);
    }
  });

  it('canonical URL points at the served locale', () => {
    const meta = getPageMetadata('/learn/surya', 'mr');
    expect(meta.alternates?.canonical).toContain('/mr/learn/surya');
  });
});

describe('getPageMetadata — /learn hub stays full-coverage', () => {
  it.each(['/learn', '/learn/'])(
    'emits all 9 locales on %s + no robots tag (trailing slash safe; Gemini PR #383 HIGH)',
    (route) => {
      const meta = getPageMetadata(route, 'mr');
      const langs = (meta.alternates?.languages ?? {}) as Record<string, string>;
      expect(Object.keys(langs).sort()).toEqual(
        ['bn', 'en', 'gu', 'hi', 'kn', 'mai', 'mr', 'ta', 'te', 'x-default'],
      );
      expect(meta.robots).toBeUndefined();
    },
  );
});
