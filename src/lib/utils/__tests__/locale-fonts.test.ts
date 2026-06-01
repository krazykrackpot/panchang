import { describe, it, expect } from 'vitest';
import {
  isDevanagariLocale,
  getDateGenitive,
  isSuppressedSeoLocale,
  formatSeoDate,
} from '../locale-fonts';

/**
 * Tests anchoring the 2026-06-01 SEO hotfix invariants.
 *
 * The Marathi traffic drop (-76% clicks in 24h) was caused by every
 * Devanagari locale being treated as Hindi for date-based SEO titles,
 * producing byte-identical content under `/hi/` and `/mr/` and
 * triggering Google duplicate-content de-rank.
 *
 * These tests pin down the contract that prevents that regression:
 *   - Each Devanagari locale has its OWN genitive postposition.
 *   - Sanskrit (retired) is opaque to indexing.
 *   - The Devanagari classifier still covers exactly the four locales.
 */

describe('isDevanagariLocale', () => {
  it.each([['hi'], ['sa'], ['mr'], ['mai']])('returns true for %s', (l) => {
    expect(isDevanagariLocale(l)).toBe(true);
  });
  it.each([['en'], ['ta'], ['te'], ['bn'], ['gu'], ['kn']])('returns false for %s', (l) => {
    expect(isDevanagariLocale(l)).toBe(false);
  });
});

describe('getDateGenitive — each Devanagari locale gets its own connector', () => {
  it('hi → का (Hindi masculine genitive)', () => {
    expect(getDateGenitive('hi')).toBe('का');
  });
  it('mai → क (Maithili masculine singular genitive)', () => {
    expect(getDateGenitive('mai')).toBe('क');
  });
  it('mr → चे (Marathi neuter genitive — was Hindi का before the hotfix)', () => {
    expect(getDateGenitive('mr')).toBe('चे');
  });
  it('sa → स्य (Sanskrit; provided for completeness even though /sa/ is noindex)', () => {
    expect(getDateGenitive('sa')).toBe('स्य');
  });
  it('en and other Latin/Indic-non-Devanagari locales return empty string', () => {
    for (const l of ['en', 'ta', 'te', 'bn', 'gu', 'kn']) {
      expect(getDateGenitive(l)).toBe('');
    }
  });

  it('regression: hi and mr must differ — prevents the duplicate-content bug from coming back', () => {
    expect(getDateGenitive('hi')).not.toBe(getDateGenitive('mr'));
  });
});

describe('isSuppressedSeoLocale — locales whose pages emit noindex', () => {
  it('sa is suppressed (retired locale, was indexing as Hindi-duplicate)', () => {
    expect(isSuppressedSeoLocale('sa')).toBe(true);
  });
  it.each([['en'], ['hi'], ['mai'], ['mr'], ['ta'], ['te'], ['bn'], ['gu'], ['kn']])(
    'active locale %s is NOT suppressed',
    (l) => {
      expect(isSuppressedSeoLocale(l)).toBe(false);
    },
  );
});

describe('formatSeoDate — locale-aware month spellings', () => {
  // 1 June 2026 is the test fixture — it's the date that surfaced the
  // original duplicate bug and the date in the live-URL repro.
  const Y = 2026;
  const M = 6;
  const D = 1;

  it('mr uses ICU Marathi month names (मे, जानेवारी, ऑगस्ट) with Latin numerals', () => {
    expect(formatSeoDate(Y, M, D, 'mr')).toMatch(/जून|June/); // June is जून in both Hindi & Marathi; just confirm digits stay Latin
    expect(formatSeoDate(Y, M, D, 'mr')).toMatch(/^1\b/); // Latin digit
    expect(formatSeoDate(Y, M, D, 'mr')).toMatch(/\b2026\b/);
    // The hard case: May. Hindi मई / Marathi मे.
    expect(formatSeoDate(2026, 5, 1, 'mr')).toMatch(/मे/);
    expect(formatSeoDate(2026, 5, 1, 'mr')).not.toMatch(/मई/); // Marathi must NOT use Hindi 'मई'
    // January: Hindi जनवरी / Marathi जानेवारी
    expect(formatSeoDate(2026, 1, 1, 'mr')).toMatch(/जानेवारी/);
    expect(formatSeoDate(2026, 1, 1, 'mr')).not.toMatch(/जनवरी/);
  });

  it('hi uses tuned MONTHS_HI rendering — "1 जून 2026"', () => {
    expect(formatSeoDate(Y, M, D, 'hi')).toBe('1 जून 2026');
    expect(formatSeoDate(2026, 5, 1, 'hi')).toBe('1 मई 2026'); // Hindi मई is correct here
    expect(formatSeoDate(2026, 1, 1, 'hi')).toBe('1 जनवरी 2026');
  });

  it('mai uses Hindi MONTHS_HI (no Maithili ICU data; pre-hotfix behaviour preserved)', () => {
    expect(formatSeoDate(Y, M, D, 'mai')).toBe('1 जून 2026');
  });

  it('sa uses Hindi MONTHS_HI (noindexed anyway)', () => {
    expect(formatSeoDate(Y, M, D, 'sa')).toBe('1 जून 2026');
  });

  it('en falls back to ICU en-IN — "1 June 2026"', () => {
    expect(formatSeoDate(Y, M, D, 'en')).toMatch(/^1\s+June\s+2026$/);
  });

  it('hi and mr render differently for May (the canonical duplicate-bug repro)', () => {
    // The single most important invariant: if these two ever start
    // matching for May, the duplicate-content bug is back.
    expect(formatSeoDate(2026, 5, 1, 'hi')).not.toBe(formatSeoDate(2026, 5, 1, 'mr'));
  });

  describe('defensive guards (Gemini PR #329 cycle-7 MEDIUM)', () => {
    it('returns empty string on NaN-producing year', () => {
      expect(formatSeoDate(NaN, 6, 1, 'hi')).toBe('');
      expect(formatSeoDate(NaN, 6, 1, 'mr')).toBe('');
      expect(formatSeoDate(NaN, 6, 1, 'en')).toBe('');
    });

    it('out-of-range month does not produce "1 undefined 2026" in Devanagari paths', () => {
      const out = formatSeoDate(2026, 13, 1, 'hi');
      // Either an empty month slot (graceful) or some best-effort fallback,
      // but NEVER the literal string "undefined".
      expect(out).not.toMatch(/undefined/);
    });

    it('month=0 is also handled gracefully (off-by-one bug from caller)', () => {
      const out = formatSeoDate(2026, 0, 1, 'hi');
      expect(out).not.toMatch(/undefined/);
    });
  });
});
