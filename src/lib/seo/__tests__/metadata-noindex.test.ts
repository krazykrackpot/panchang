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

describe('getPageMetadata — thin /learn slug', () => {
  it('emits hreflang only for en+hi + x-default on /learn/surya', () => {
    const meta = getPageMetadata('/learn/surya', 'en');
    const langs = (meta.alternates?.languages ?? {}) as Record<string, string>;
    const keys = Object.keys(langs).sort();
    expect(keys).toEqual(['en', 'hi', 'x-default']);
  });

  it('emits NO robots tag for indexable locales (en, hi)', () => {
    expect(getPageMetadata('/learn/surya', 'en').robots).toBeUndefined();
    expect(getPageMetadata('/learn/surya', 'hi').robots).toBeUndefined();
  });

  it('emits robots:{index:false,follow:true} for non-indexable locales', () => {
    for (const loc of ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr']) {
      const meta = getPageMetadata('/learn/surya', loc);
      expect(meta.robots, `expected /learn/surya on ${loc} to be noindex`).toEqual({
        index: false,
        follow: true,
      });
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
      expect(meta.robots, `${route} ta should be noindex`).toEqual({
        index: false,
        follow: true,
      });
      const langs = (meta.alternates?.languages ?? {}) as Record<string, string>;
      expect(Object.keys(langs).sort()).toEqual(['en', 'hi', 'x-default']);
    }
  });

  it('keeps the canonical URL pointing at the served locale (even when noindex)', () => {
    // Google still uses canonical to choose the indexable representative.
    // Pointing canonical at /en/* would conflict with hreflang's x-default
    // semantics; the noindex tag is what tells Google to drop this URL.
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
