import { describe, it, expect } from 'vitest';
import {
  CANONICAL_RASHI_SLUGS,
  CANONICAL_FESTIVAL_SLUGS,
  CANONICAL_CITY_SLUGS,
} from '../proxy-allowlists';
import { RASHIS } from '@/lib/constants/rashis';
import { ALL_FESTIVAL_DEFS } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';
import { ALL_CITIES } from '@/lib/constants/cities-extended';

describe('proxy-allowlists drift guards', () => {
  it('rashi: matches RASHIS slugs', () => {
    const expected = new Set(RASHIS.map((r) => r.slug));
    expect([...CANONICAL_RASHI_SLUGS].sort()).toEqual([...expected].sort());
  });

  it('festival: matches ALL_FESTIVAL_DEFS ∩ FESTIVAL_DETAILS', () => {
    // /festivals/[slug]/[year]/page.tsx validates the slug via
    // ALL_FESTIVAL_DEFS (umbrella of every festival array including
    // SOLAR_FESTIVALS — makar-sankranti lives there, not in
    // MAJOR_FESTIVALS). MAJOR_FESTIVALS alone would 404 the indexed
    // makar-sankranti URLs across 9 locales × multiple years.
    const expected = new Set(
      ALL_FESTIVAL_DEFS.map((f) => f.slug).filter((s) => FESTIVAL_DETAILS[s]),
    );
    const missingFromAllow = [...expected].filter((s) => !CANONICAL_FESTIVAL_SLUGS.has(s));
    const missingFromData = [...CANONICAL_FESTIVAL_SLUGS].filter((s) => !expected.has(s));
    expect({ missingFromAllow, missingFromData }).toEqual({
      missingFromAllow: [],
      missingFromData: [],
    });
  });

  it('city: matches ALL_CITIES', () => {
    const expected = new Set(ALL_CITIES.map((c) => c.slug));
    const missingFromAllow = [...expected].filter((s) => !CANONICAL_CITY_SLUGS.has(s));
    const missingFromData = [...CANONICAL_CITY_SLUGS].filter((s) => !expected.has(s));
    expect({ missingFromAllow, missingFromData }).toEqual({
      missingFromAllow: [],
      missingFromData: [],
    });
  });

  it('size sanity', () => {
    // Documented sizes in the file's doc-comment — guards against a
    // future "I'll just remove one" change going unnoticed.
    expect(CANONICAL_RASHI_SLUGS.size).toBe(12);
    expect(CANONICAL_FESTIVAL_SLUGS.size).toBeGreaterThanOrEqual(40);
    expect(CANONICAL_CITY_SLUGS.size).toBeGreaterThanOrEqual(320);
  });

  it('GSC-safety: known ranking URL slugs must be in their allowlists', () => {
    // Concrete URLs from GSC top-200 ranking pages (last 7d, captured
    // 2026-06-07). Any allowlist edit that drops these is an SEO
    // regression — block at CI.
    expect(CANONICAL_CITY_SLUGS.has('ujjain')).toBe(true); // /hi/panchang/ujjain — #2 ranking line, 15 clicks/wk
    expect(CANONICAL_CITY_SLUGS.has('delhi')).toBe(true);
    expect(CANONICAL_CITY_SLUGS.has('mumbai')).toBe(true);
    expect(CANONICAL_CITY_SLUGS.has('darbhanga')).toBe(true); // Maithili #1-traffic city
    expect(CANONICAL_RASHI_SLUGS.has('tula')).toBe(true); // /mai/horoscope/tula/2026-06-01 — 6 clicks/wk
  });
});
