/**
 * Regression tests for the exhaustive locale dispatch on date-based SEO.
 * If any two locales produce byte-identical titles or descriptions
 * (modulo the per-locale `humanDate`), Google's duplicate-content
 * algorithm will dedupe and de-rank — exactly what crashed Marathi +
 * Maithili clicks on 2026-05-31 14:00 UTC. These tests are the
 * structural guard that the next "we added a locale and forgot the
 * SEO copy" bug fails CI rather than ranking.
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

describe('panchangDateSeo — exhaustive locale dispatch', () => {
  it('returns a defined output for every active locale', () => {
    for (const locale of locales) {
      const out = panchangDateSeo({ locale, humanDate: HUMAN_DATE });
      expect(out.title).toBeTruthy();
      expect(out.description).toBeTruthy();
      expect(out.keywords.length).toBeGreaterThan(0);
    }
  });

  it('every pair of locales produces distinct titles', () => {
    const titles = new Map<string, string>();
    for (const locale of locales) {
      const t = panchangDateSeo({ locale, humanDate: HUMAN_DATE }).title;
      const prior = [...titles.entries()].find(([, v]) => v === t);
      expect(prior, `locale "${locale}" produced same title as "${prior?.[0]}": ${t}`).toBeUndefined();
      titles.set(locale, t);
    }
  });

  it('every pair of locales produces distinct descriptions', () => {
    const descs = new Map<string, string>();
    for (const locale of locales) {
      const d = panchangDateSeo({ locale, humanDate: HUMAN_DATE }).description;
      const prior = [...descs.entries()].find(([, v]) => v === d);
      expect(prior, `locale "${locale}" produced same description as "${prior?.[0]}": ${d}`).toBeUndefined();
      descs.set(locale, d);
    }
  });

  it('Marathi title contains Marathi-specific markers (नक्षत्र, चे, राहू काळ)', () => {
    // Smoke test that the 2026-06-01 hotfix's Marathi-specific spellings
    // remain in place — काळ (not काल), राहू (not राहु), चे (not का).
    const t = panchangDateSeo({ locale: 'mr', humanDate: HUMAN_DATE }).title;
    expect(t).toContain('चे');
    expect(t).toContain('राहू');
    expect(t).toContain('काळ');
    expect(t).not.toContain('राहु काल');  // Hindi spelling — Marathi must NOT match
  });

  it('Maithili title contains Maithili-specific connector (क, not का)', () => {
    const t = panchangDateSeo({ locale: 'mai', humanDate: HUMAN_DATE }).title;
    expect(t).toMatch(/ क /); // Maithili connector with spaces (not part of another word)
    expect(t).not.toContain(' का ');
  });
});

describe('choghadiyaDateSeo — exhaustive locale dispatch', () => {
  it('returns a defined output for every active locale', () => {
    for (const locale of locales) {
      const out = choghadiyaDateSeo({ locale, humanDate: HUMAN_DATE });
      expect(out.title).toBeTruthy();
      expect(out.description).toBeTruthy();
      expect(out.keywords.length).toBeGreaterThan(0);
    }
  });

  it('every pair of locales produces distinct titles', () => {
    const seen = new Map<string, string>();
    for (const locale of locales) {
      const t = choghadiyaDateSeo({ locale, humanDate: HUMAN_DATE }).title;
      const prior = [...seen.entries()].find(([, v]) => v === t);
      expect(prior, `locale "${locale}" duplicates "${prior?.[0]}": ${t}`).toBeUndefined();
      seen.set(locale, t);
    }
  });

  it('every pair of locales produces distinct descriptions', () => {
    const seen = new Map<string, string>();
    for (const locale of locales) {
      const d = choghadiyaDateSeo({ locale, humanDate: HUMAN_DATE }).description;
      const prior = [...seen.entries()].find(([, v]) => v === d);
      expect(prior, `locale "${locale}" duplicates "${prior?.[0]}"`).toBeUndefined();
      seen.set(locale, d);
    }
  });

  it('Marathi description preserves Gemini PR #329 cycle-8/9 grammar', () => {
    // सूर्योदय-सूर्यास्तावर (oblique form for "वर" preposition) and
    // दिल्लीचे (no-space possessive) — both Gemini-reviewed MEDIUMs.
    const d = choghadiyaDateSeo({ locale: 'mr', humanDate: HUMAN_DATE }).description;
    expect(d).toContain('सूर्योदय-सूर्यास्तावर');
    expect(d).toContain('दिल्लीचे');
  });
});

describe('gauriPanchangDateSeo — exhaustive locale dispatch', () => {
  it('returns a defined output for every active locale', () => {
    for (const locale of locales) {
      const out = gauriPanchangDateSeo({ locale, humanDate: HUMAN_DATE });
      expect(out.title).toBeTruthy();
      expect(out.description).toBeTruthy();
      expect(out.keywords.length).toBeGreaterThan(0);
    }
  });

  it('every pair of locales produces distinct titles', () => {
    const seen = new Map<string, string>();
    for (const locale of locales) {
      const t = gauriPanchangDateSeo({ locale, humanDate: HUMAN_DATE }).title;
      const prior = [...seen.entries()].find(([, v]) => v === t);
      expect(prior, `locale "${locale}" duplicates "${prior?.[0]}": ${t}`).toBeUndefined();
      seen.set(locale, t);
    }
  });

  it('every pair of locales produces distinct descriptions', () => {
    const seen = new Map<string, string>();
    for (const locale of locales) {
      const d = gauriPanchangDateSeo({ locale, humanDate: HUMAN_DATE }).description;
      const prior = [...seen.entries()].find(([, v]) => v === d);
      expect(prior, `locale "${locale}" duplicates "${prior?.[0]}"`).toBeUndefined();
      seen.set(locale, d);
    }
  });

  it('Tamil title preserves கௌரி பஞ்சாங்கம் token', () => {
    expect(gauriPanchangDateSeo({ locale: 'ta', humanDate: HUMAN_DATE }).title).toContain('கௌரி பஞ்சாங்கம்');
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
