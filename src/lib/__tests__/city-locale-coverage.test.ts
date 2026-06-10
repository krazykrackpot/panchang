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
