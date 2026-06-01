import { describe, it, expect } from 'vitest';
import {
  isDevanagariLocale,
  getDateGenitive,
  isSuppressedSeoLocale,
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
