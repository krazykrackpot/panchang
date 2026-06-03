import { describe, it, expect } from 'vitest';
import { FESTIVAL_DETAILS } from '../festival-details';

/**
 * The top 24 canonical festivals MUST each carry a 9-locale `name`
 * field in FESTIVAL_DETAILS — anything less reintroduces the bug PR
 * #389 fixed (where /embed/festivals and /embed/panchang collapsed
 * mr/mai/ta/te/bn/gu/kn to English even though the data was already
 * available).
 *
 * The widget no longer collapses, but the data side has to stay
 * complete. This test pins the coverage so a partial new entry, or
 * a refactor that drops locale keys, fails CI before shipping.
 *
 * Per the persona-spec / locale-bridge philosophy: never serve a
 * Hindi-or-English fallback when a real translation exists. The
 * source of truth for these 24 festival names is FESTIVAL_DETAILS,
 * and these tests guard that source.
 */

const TOP_24_CANONICAL_FESTIVALS = [
  // Pan-Indic
  'diwali',
  'janmashtami',
  'maha-shivaratri',
  'ram-navami',
  'ganesh-chaturthi',
  'dussehra',
  'holi',
  'raksha-bandhan',
  'dhanteras',
  'narak-chaturdashi',
  'govardhan-puja',
  'bhai-dooj',
  'hanuman-jayanti',
  'akshaya-tritiya',
  'guru-purnima',
  'vasant-panchami',
  'holika-dahan',
  'hartalika-teej',
  'chhath-puja',
  'makar-sankranti',
  'navaratri',
  // Regional
  'onam',
  'pongal',
  'ugadi',
] as const;

const REQUIRED_LOCALES = ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'gu', 'mr', 'mai'] as const;

describe('FESTIVAL_DETAILS — 9-locale name coverage for the top 24 festivals', () => {
  it.each(TOP_24_CANONICAL_FESTIVALS)(
    '"%s" has a non-empty name in every required locale',
    (slug) => {
      const entry = FESTIVAL_DETAILS[slug];
      expect(entry, `${slug} missing from FESTIVAL_DETAILS`).toBeDefined();
      if (!entry) return;

      for (const loc of REQUIRED_LOCALES) {
        const value = (entry.name as Record<string, string | undefined>)[loc];
        expect(value, `${slug}.name.${loc} is empty/missing`).toBeTruthy();
        expect(value && value.length).toBeGreaterThan(0);
      }
    },
  );

  it('produces an exact count — 24/24 complete', () => {
    const complete = TOP_24_CANONICAL_FESTIVALS.filter((slug) => {
      const entry = FESTIVAL_DETAILS[slug];
      if (!entry) return false;
      return REQUIRED_LOCALES.every(
        (loc) => !!(entry.name as Record<string, string | undefined>)[loc],
      );
    });
    expect(complete.length).toBe(TOP_24_CANONICAL_FESTIVALS.length);
  });
});
