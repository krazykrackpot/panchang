/**
 * Regression tests for the exhaustive locale dispatch on date-based SEO.
 * If any two locales produce byte-identical titles or descriptions
 * (modulo the per-locale `humanDate`), Google's duplicate-content
 * algorithm will dedupe and de-rank — exactly what crashed Marathi +
 * Maithili clicks on 2026-05-31 14:00 UTC. These tests are the
 * structural guard that the next "we added a locale and forgot the
 * SEO copy" bug fails CI rather than ranking.
 *
 * 2026-06-02: extended to also require `cityName` and assert that the
 * passed cityName actually appears in title + description for every
 * locale. This is the structural guard against the second-order bug:
 * the helper requires cityName at the type level, but a future edit
 * could drop the `${cityName}` substitution from one or more locale
 * cases (regressing to the byte-identical-Delhi-everywhere pattern
 * that triggered the 2026-05-29 Core Update demotion).
 */

import { describe, it, expect } from 'vitest';
import { panchangDateSeo, choghadiyaDateSeo, gauriPanchangDateSeo, horoscopeDateSeo } from '../date-page-seo';
import { locales } from '@/lib/i18n/config';

// Use a stable canonical date that maps the same way across locales.
// formatSeoDate would produce locale-specific renderings — for these
// tests we pass a literal `humanDate` so the only thing changing
// between locales is the locale-specific copy itself.
const HUMAN_DATE = '1 June 2026';
const RASHI_NAME = 'Aries';
// Locale-specific city tokens that mirror what `tl(city.name, locale)`
// would return for a real call. Each token contains characters that
// uniquely identify the locale's script (Tamil ம்/ம, Bengali ম, etc.),
// so the "city appears in output" assertion below also incidentally
// confirms substitution happened in the correct script.
const CITY_BY_LOCALE: Record<string, string> = {
  en: 'TestCity',
  hi: 'टेस्टसिटी',
  mr: 'टेस्टसिटी',
  mai: 'टेस्टसिटी',
  bn: 'টেস্টসিটি',
  te: 'టెస్ట్‌సిటి',
  gu: 'ટેસ્ટસિટિ',
  kn: 'ಟೆಸ್ಟ್‌ಸಿಟಿ',
  ta: 'டெஸ்ட்சிட்டி',
};

function cityFor(locale: string): string {
  return CITY_BY_LOCALE[locale] ?? CITY_BY_LOCALE.en;
}

describe('panchangDateSeo — exhaustive locale dispatch', () => {
  it('returns a defined output for every active locale', () => {
    for (const locale of locales) {
      const out = panchangDateSeo({ locale, humanDate: HUMAN_DATE, cityName: cityFor(locale) });
      expect(out.title).toBeTruthy();
      expect(out.description).toBeTruthy();
      expect(out.keywords.length).toBeGreaterThan(0);
    }
  });

  it('every pair of locales produces distinct titles', () => {
    const titles = new Map<string, string>();
    for (const locale of locales) {
      const t = panchangDateSeo({ locale, humanDate: HUMAN_DATE, cityName: cityFor(locale) }).title;
      const prior = [...titles.entries()].find(([, v]) => v === t);
      expect(prior, `locale "${locale}" produced same title as "${prior?.[0]}": ${t}`).toBeUndefined();
      titles.set(locale, t);
    }
  });

  it('every pair of locales produces distinct descriptions', () => {
    const descs = new Map<string, string>();
    for (const locale of locales) {
      const d = panchangDateSeo({ locale, humanDate: HUMAN_DATE, cityName: cityFor(locale) }).description;
      const prior = [...descs.entries()].find(([, v]) => v === d);
      expect(prior, `locale "${locale}" produced same description as "${prior?.[0]}": ${d}`).toBeUndefined();
      descs.set(locale, d);
    }
  });

  it('cityName actually appears in title for every locale', () => {
    // Structural guard against silent regression — if a future edit
    // drops `${cityName}` from a case, this catches it before the
    // duplicate-content signal returns.
    for (const locale of locales) {
      const city = cityFor(locale);
      const t = panchangDateSeo({ locale, humanDate: HUMAN_DATE, cityName: city }).title;
      expect(t, `panchang title for ${locale} must contain cityName "${city}"`).toContain(city);
    }
  });

  it('cityName actually appears in description for every locale', () => {
    for (const locale of locales) {
      const city = cityFor(locale);
      const d = panchangDateSeo({ locale, humanDate: HUMAN_DATE, cityName: city }).description;
      expect(d, `panchang description for ${locale} must contain cityName "${city}"`).toContain(city);
    }
  });

  it('Marathi title contains Marathi-specific markers (नक्षत्र, चे, राहू काळ)', () => {
    // Smoke test that the 2026-06-01 hotfix's Marathi-specific spellings
    // remain in place — काळ (not काल), राहू (not राहु), चे (not का).
    const t = panchangDateSeo({ locale: 'mr', humanDate: HUMAN_DATE, cityName: cityFor('mr') }).title;
    expect(t).toContain('चे');
    expect(t).toContain('राहू');
    expect(t).toContain('काळ');
    expect(t).not.toContain('राहु काल');  // Hindi spelling — Marathi must NOT match
  });

  it('Maithili title contains Maithili-specific connector (क, not का)', () => {
    const t = panchangDateSeo({ locale: 'mai', humanDate: HUMAN_DATE, cityName: cityFor('mai') }).title;
    expect(t).toMatch(/ क /); // Maithili connector with spaces (not part of another word)
    expect(t).not.toContain(' का ');
  });
});

describe('choghadiyaDateSeo — exhaustive locale dispatch', () => {
  it('returns a defined output for every active locale', () => {
    for (const locale of locales) {
      const out = choghadiyaDateSeo({ locale, humanDate: HUMAN_DATE, cityName: cityFor(locale) });
      expect(out.title).toBeTruthy();
      expect(out.description).toBeTruthy();
      expect(out.keywords.length).toBeGreaterThan(0);
    }
  });

  it('every pair of locales produces distinct titles', () => {
    const seen = new Map<string, string>();
    for (const locale of locales) {
      const t = choghadiyaDateSeo({ locale, humanDate: HUMAN_DATE, cityName: cityFor(locale) }).title;
      const prior = [...seen.entries()].find(([, v]) => v === t);
      expect(prior, `locale "${locale}" duplicates "${prior?.[0]}": ${t}`).toBeUndefined();
      seen.set(locale, t);
    }
  });

  it('every pair of locales produces distinct descriptions', () => {
    const seen = new Map<string, string>();
    for (const locale of locales) {
      const d = choghadiyaDateSeo({ locale, humanDate: HUMAN_DATE, cityName: cityFor(locale) }).description;
      const prior = [...seen.entries()].find(([, v]) => v === d);
      expect(prior, `locale "${locale}" duplicates "${prior?.[0]}"`).toBeUndefined();
      seen.set(locale, d);
    }
  });

  it('cityName actually appears in title for every locale', () => {
    for (const locale of locales) {
      const city = cityFor(locale);
      const t = choghadiyaDateSeo({ locale, humanDate: HUMAN_DATE, cityName: city }).title;
      expect(t, `choghadiya title for ${locale} must contain cityName "${city}"`).toContain(city);
    }
  });

  it('cityName actually appears in description for every locale', () => {
    for (const locale of locales) {
      const city = cityFor(locale);
      const d = choghadiyaDateSeo({ locale, humanDate: HUMAN_DATE, cityName: city }).description;
      expect(d, `choghadiya description for ${locale} must contain cityName "${city}"`).toContain(city);
    }
  });

  it('Marathi description preserves Gemini PR #329 cycle-8/9 oblique-form grammar', () => {
    // सूर्योदय-सूर्यास्तावर (oblique form for "वर" preposition) was a
    // Gemini-reviewed MEDIUM. The दिल्लीचे no-space possessive was the
    // OTHER Gemini MEDIUM, but is now substituted with `${cityName}चे`
    // because the helper no longer hardcodes Delhi.
    const d = choghadiyaDateSeo({ locale: 'mr', humanDate: HUMAN_DATE, cityName: cityFor('mr') }).description;
    expect(d).toContain('सूर्योदय-सूर्यास्तावर');
    // No-space possessive: cityName + चे (e.g. "टेस्टसिटीचे")
    expect(d).toContain(`${cityFor('mr')}चे`);
  });
});

describe('gauriPanchangDateSeo — exhaustive locale dispatch', () => {
  it('returns a defined output for every active locale', () => {
    for (const locale of locales) {
      const out = gauriPanchangDateSeo({ locale, humanDate: HUMAN_DATE, cityName: cityFor(locale) });
      expect(out.title).toBeTruthy();
      expect(out.description).toBeTruthy();
      expect(out.keywords.length).toBeGreaterThan(0);
    }
  });

  it('every pair of locales produces distinct titles', () => {
    const seen = new Map<string, string>();
    for (const locale of locales) {
      const t = gauriPanchangDateSeo({ locale, humanDate: HUMAN_DATE, cityName: cityFor(locale) }).title;
      const prior = [...seen.entries()].find(([, v]) => v === t);
      expect(prior, `locale "${locale}" duplicates "${prior?.[0]}": ${t}`).toBeUndefined();
      seen.set(locale, t);
    }
  });

  it('every pair of locales produces distinct descriptions', () => {
    const seen = new Map<string, string>();
    for (const locale of locales) {
      const d = gauriPanchangDateSeo({ locale, humanDate: HUMAN_DATE, cityName: cityFor(locale) }).description;
      const prior = [...seen.entries()].find(([, v]) => v === d);
      expect(prior, `locale "${locale}" duplicates "${prior?.[0]}"`).toBeUndefined();
      seen.set(locale, d);
    }
  });

  it('cityName actually appears in title for every locale', () => {
    for (const locale of locales) {
      const city = cityFor(locale);
      const t = gauriPanchangDateSeo({ locale, humanDate: HUMAN_DATE, cityName: city }).title;
      expect(t, `gauri title for ${locale} must contain cityName "${city}"`).toContain(city);
    }
  });

  it('cityName actually appears in description for every locale', () => {
    for (const locale of locales) {
      const city = cityFor(locale);
      const d = gauriPanchangDateSeo({ locale, humanDate: HUMAN_DATE, cityName: city }).description;
      expect(d, `gauri description for ${locale} must contain cityName "${city}"`).toContain(city);
    }
  });

  it('Tamil title preserves கௌரி பஞ்சாங்கம் token', () => {
    expect(gauriPanchangDateSeo({ locale: 'ta', humanDate: HUMAN_DATE, cityName: cityFor('ta') }).title).toContain('கௌரி பஞ்சாங்கம்');
  });
});

describe('horoscopeDateSeo — exhaustive locale dispatch', () => {
  it('returns a defined output for every active locale', () => {
    for (const locale of locales) {
      const out = horoscopeDateSeo({ locale, humanDate: HUMAN_DATE, rashiName: RASHI_NAME });
      expect(out.title).toBeTruthy();
      expect(out.description).toBeTruthy();
      expect(out.keywords.length).toBeGreaterThan(0);
    }
  });

  it('every pair of locales produces distinct titles for the same rashi+date', () => {
    const seen = new Map<string, string>();
    for (const locale of locales) {
      const t = horoscopeDateSeo({ locale, humanDate: HUMAN_DATE, rashiName: RASHI_NAME }).title;
      const prior = [...seen.entries()].find(([, v]) => v === t);
      expect(prior, `locale "${locale}" duplicates "${prior?.[0]}": ${t}`).toBeUndefined();
      seen.set(locale, t);
    }
  });
});
