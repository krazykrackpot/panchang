/**
 * Walks every SEO_INDEXABLE_CITY_SLUGS × visibleLocales cell and asserts the
 * (locale, slug) pair carries (a) a locale-native city name in the right
 * script, (b) a locale-native state/country name, and (c) a locale-native
 * descriptor of at least the content-floor length.
 *
 * If you add a new entry to SEO_INDEXABLE_CITY_SLUGS, this test will fail
 * until the overlay JSONs cover it — the failure message lists the missing
 * (locale, slug, kind) cells so the fix is a re-run of
 * scripts/translate-city-state-names-via-gemini.py (or a manual edit when
 * you trust your own transliteration over Gemini's).
 *
 * Origin: 2026-06-10 audit found ta/te/bn/kn/gu titles still using Latin
 * city names ("Mumbai இன்றைய பஞ்சாங்கம்") because expandIndian fell back
 * to en for those locales. This test pins the post-fix invariant in place.
 */
import { describe, it, expect } from 'vitest';
import {
  ALL_CITIES,
  SEO_INDEXABLE_CITY_SLUGS,
  getCityBySlugExtended,
} from '@/lib/constants/cities-extended';
import { getCityDescriptor } from '@/lib/constants/city-descriptors';
import { getStateLocale } from '@/lib/constants/state-name-locale';
import { hasLocaleNativeCityContent } from '@/lib/seo/city-content-floor';
import { visibleLocales } from '@/lib/i18n/config';

const SCRIPT_PATTERN: Record<string, RegExp> = {
  en:  /[A-Za-z]/,
  hi:  /[ऀ-ॿ]/,
  mai: /[ऀ-ॿ]/,
  mr:  /[ऀ-ॿ]/,
  ta:  /[஀-௿]/,
  te:  /[ఀ-౿]/,
  bn:  /[ঀ-৿]/,
  kn:  /[ಀ-೿]/,
  gu:  /[઀-૿]/,
};

const INDEXABLE_SLUGS = Array.from(SEO_INDEXABLE_CITY_SLUGS);

describe('city-locale coverage for SEO-indexable surface', () => {
  it('every indexable slug exists in ALL_CITIES', () => {
    const missing = INDEXABLE_SLUGS.filter(s => !ALL_CITIES.some(c => c.slug === s));
    expect(missing).toEqual([]);
  });

  it('every (locale, slug) pair has a city name in the expected script', () => {
    const failures: Array<{ locale: string; slug: string; got: string }> = [];
    for (const locale of visibleLocales) {
      const pattern = SCRIPT_PATTERN[locale];
      if (!pattern) continue;
      for (const slug of INDEXABLE_SLUGS) {
        const c = getCityBySlugExtended(slug);
        if (!c) continue;
        const name = (c.name as Record<string, string>)[locale];
        if (!name || !pattern.test(name)) {
          failures.push({ locale, slug, got: name ?? '' });
        }
      }
    }
    if (failures.length) {
      const sample = failures.slice(0, 10).map(f => `${f.locale}/${f.slug}: "${f.got}"`).join('\n  ');
      throw new Error(
        `${failures.length} (locale, slug) city-name cells fail the expected-script check:\n  ${sample}`
      );
    }
  });

  it('every (locale, slug) pair has a state name in the expected script', () => {
    const failures: Array<{ locale: string; slug: string; got: string }> = [];
    for (const locale of visibleLocales) {
      if (locale === 'en') continue;
      const pattern = SCRIPT_PATTERN[locale];
      if (!pattern) continue;
      for (const slug of INDEXABLE_SLUGS) {
        const c = getCityBySlugExtended(slug);
        if (!c) continue;
        const stateText = getStateLocale(c.state, locale);
        if (!stateText || !pattern.test(stateText)) {
          failures.push({ locale, slug, got: stateText });
        }
      }
    }
    if (failures.length) {
      const sample = failures.slice(0, 10).map(f => `${f.locale}/${f.slug}: "${f.got}"`).join('\n  ');
      throw new Error(
        `${failures.length} (locale, slug) state-name cells fail the expected-script check:\n  ${sample}`
      );
    }
  });

  it('every (locale, slug) pair has a descriptor of at least 200 chars in the expected script', () => {
    const failures: Array<{ locale: string; slug: string; reason: string }> = [];
    for (const locale of visibleLocales) {
      const pattern = SCRIPT_PATTERN[locale];
      for (const slug of INDEXABLE_SLUGS) {
        const d = getCityDescriptor(slug);
        const text = d?.descriptor[locale as keyof typeof d.descriptor];
        if (!text) {
          failures.push({ locale, slug, reason: 'missing' });
          continue;
        }
        if (text.length < 200) {
          failures.push({ locale, slug, reason: `too short (${text.length} chars)` });
          continue;
        }
        if (pattern && !pattern.test(text)) {
          failures.push({ locale, slug, reason: 'wrong script' });
        }
      }
    }
    if (failures.length) {
      const sample = failures.slice(0, 10).map(f => `${f.locale}/${f.slug}: ${f.reason}`).join('\n  ');
      throw new Error(
        `${failures.length} (locale, slug) descriptor cells fail the content-floor check:\n  ${sample}`
      );
    }
  });

  it('hasLocaleNativeCityContent returns true for every indexable (locale, slug) pair', () => {
    const failures: Array<{ locale: string; slug: string }> = [];
    for (const locale of visibleLocales) {
      for (const slug of INDEXABLE_SLUGS) {
        if (!hasLocaleNativeCityContent(slug, locale)) {
          failures.push({ locale, slug });
        }
      }
    }
    if (failures.length) {
      const sample = failures.slice(0, 10).map(f => `${f.locale}/${f.slug}`).join(', ');
      throw new Error(
        `${failures.length} (locale, slug) pairs would emit noindex: ${sample}`
      );
    }
  });

  it('hasLocaleNativeCityContent returns false for unknown slugs and missing descriptors', () => {
    expect(hasLocaleNativeCityContent('this-slug-does-not-exist', 'en')).toBe(false);
    // A known tier-2 slug that's NOT in the indexable keep-list and has no
    // descriptor — should fall through to false.
    const nonIndexable = ALL_CITIES.find(c => !SEO_INDEXABLE_CITY_SLUGS.has(c.slug) && c.tier === 2);
    if (nonIndexable) {
      expect(hasLocaleNativeCityContent(nonIndexable.slug, 'hi')).toBe(false);
    }
  });
});

import {
  CITIES_BY_LOCALE,
  isSeoIndexableCity,
  wasLegacyIndexableSlug,
  getIndexableLocalesForCity,
} from '@/lib/constants/cities-extended';
import { buildCityHreflangMap } from '@/lib/seo/city-hreflang';

describe('Phase 1 — locale-curated city sets', () => {
  it('every curated (locale, slug) pair has a content-floor-clean page', () => {
    const failures: Array<{ locale: string; slug: string }> = [];
    for (const [locale, set] of Object.entries(CITIES_BY_LOCALE)) {
      for (const slug of set) {
        if (!hasLocaleNativeCityContent(slug, locale)) {
          failures.push({ locale, slug });
        }
      }
    }
    if (failures.length) {
      const sample = failures.slice(0, 10).map(f => `${f.locale}/${f.slug}`).join(', ');
      throw new Error(
        `Curated set has ${failures.length} pair(s) the content floor rejects — would 410 in proxy AND noindex in meta, conflicting signals: ${sample}`
      );
    }
  });

  it('every curated slug is in ALL_CITIES (no orphan slugs in the curated map)', () => {
    const orphans: Array<{ locale: string; slug: string }> = [];
    for (const [locale, set] of Object.entries(CITIES_BY_LOCALE)) {
      for (const slug of set) {
        if (!ALL_CITIES.some(c => c.slug === slug)) {
          orphans.push({ locale, slug });
        }
      }
    }
    expect(orphans).toEqual([]);
  });

  it('every curated slug is in SEO_INDEXABLE_CITY_SLUGS (Phase 0 keep-list)', () => {
    // Phase 1 is a strict subset of Phase 0's surface — we only narrow,
    // never add new slugs without a content audit. Catches accidental
    // additions that would emit sitemap URLs without descriptors.
    const offSet: Array<{ locale: string; slug: string }> = [];
    for (const [locale, set] of Object.entries(CITIES_BY_LOCALE)) {
      for (const slug of set) {
        if (!SEO_INDEXABLE_CITY_SLUGS.has(slug)) {
          offSet.push({ locale, slug });
        }
      }
    }
    expect(offSet).toEqual([]);
  });

  it('isSeoIndexableCity(slug, locale) returns true only for curated pairs', () => {
    // Spot-check the matrix: a slug+locale that's curated → true; same
    // slug in a different locale where it's NOT curated → false.
    expect(isSeoIndexableCity('mumbai', 'en')).toBe(true);
    expect(isSeoIndexableCity('mumbai', 'mr')).toBe(true);
    expect(isSeoIndexableCity('mumbai', 'gu')).toBe(true);
    expect(isSeoIndexableCity('mumbai', 'ta')).toBe(false); // not curated
    expect(isSeoIndexableCity('mumbai', 'mai')).toBe(false); // not curated
    expect(isSeoIndexableCity('delhi', 'mai')).toBe(true); // pan-anchor
    expect(isSeoIndexableCity('delhi', 'ta')).toBe(false);
    expect(isSeoIndexableCity('mumbai', 'unknown-locale')).toBe(false);
    expect(isSeoIndexableCity('not-a-slug', 'en')).toBe(false);
  });

  it('wasLegacyIndexableSlug returns true exactly for the 44 Phase 0 slugs', () => {
    expect(wasLegacyIndexableSlug('mumbai')).toBe(true);
    expect(wasLegacyIndexableSlug('delhi')).toBe(true);
    // A tier-2 slug that's never been in the indexable set
    expect(wasLegacyIndexableSlug('navi-mumbai')).toBe(false);
    expect(wasLegacyIndexableSlug('not-a-slug')).toBe(false);
  });

  it('getIndexableLocalesForCity returns the union of curated locales for a slug', () => {
    // Mumbai is curated for en, hi, mr, gu — return all four (order
    // doesn't matter, so sort before compare)
    expect(getIndexableLocalesForCity('mumbai').slice().sort()).toEqual(
      ['en', 'gu', 'hi', 'mr']
    );
    // Bangalore is curated for en, ta, kn
    expect(getIndexableLocalesForCity('bangalore').slice().sort()).toEqual(
      ['en', 'kn', 'ta']
    );
    // A legacy slug not in any curated locale (kochi, guwahati) → empty
    expect(getIndexableLocalesForCity('kochi')).toEqual([]);
    expect(getIndexableLocalesForCity('guwahati')).toEqual([]);
    // An unknown slug → empty
    expect(getIndexableLocalesForCity('not-a-slug')).toEqual([]);
  });

  it('buildCityHreflangMap emits only curated alternates plus x-default', () => {
    const mumbai = buildCityHreflangMap('mumbai');
    // Curated locales for mumbai: en, hi, mr, gu (no ta/te/bn/kn/mai)
    expect(Object.keys(mumbai).slice().sort()).toEqual(
      ['en', 'gu', 'hi', 'mr', 'x-default']
    );
    // x-default points at en (defaultLocale, which is curated for mumbai)
    expect(mumbai['x-default']).toContain('/en/panchang/mumbai');
    expect(mumbai['en']).toContain('/en/panchang/mumbai');
    expect(mumbai['gu']).toContain('/gu/panchang/mumbai');
    expect(mumbai['mr']).toContain('/mr/panchang/mumbai');
    // ta is NOT in mumbai's curated set, so no Tamil alternate
    expect(mumbai['ta']).toBeUndefined();
  });

  it('buildCityHreflangMap returns empty for a slug curated nowhere', () => {
    expect(buildCityHreflangMap('kochi')).toEqual({});
    expect(buildCityHreflangMap('guwahati')).toEqual({});
    expect(buildCityHreflangMap('not-a-slug')).toEqual({});
  });

  it('curated set is ~50-60 (locale, slug) pairs — sanity bound', () => {
    let total = 0;
    for (const set of Object.values(CITIES_BY_LOCALE)) {
      total += set.size;
    }
    // Phase 1 design target: ~56 pairs. Hard-fail if someone widens
    // toward Phase 0's 396 grid without an audit.
    expect(total).toBeGreaterThanOrEqual(40);
    expect(total).toBeLessThanOrEqual(80);
  });
});
