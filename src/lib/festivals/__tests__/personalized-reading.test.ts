/**
 * Personalized-reading engine fixtures.
 *
 * Per spec §11 acceptance criteria — 12 rashis × 20 festivals = 240 cases
 * covering full grid, plus the variation invariant ("two random
 * (festival, rashi) outputs must be textually different") that guards
 * against template-collapse.
 *
 * Uses a single representative festival date per festival (the canonical
 * 2026 date) — the engine's transit math is deterministic given a date,
 * and the date itself is the caller's responsibility (Kala-Vyapti
 * pipeline) which has its own tests.
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §11
 */

import { describe, expect, it } from 'vitest';
import { computePersonalizedReading } from '../personalized-reading';
import { FESTIVAL_ASTRO_FOCUS } from '../festival-astro-focus';

// Hand-picked 2026 dates for each festival — accurate to ±1 day per
// regional tradition. These are good enough for unit tests; the
// production page receives the real Kala-Vyapti-resolved date.
const FESTIVAL_DATES_2026: Record<string, string> = {
  'makar-sankranti':  '2026-01-14',
  'vasant-panchami':  '2026-01-23',
  'maha-shivaratri':  '2026-02-15',
  'holika-dahan':     '2026-03-03',
  'holi':             '2026-03-04',
  'ram-navami':       '2026-03-26',
  'hanuman-jayanti':  '2026-04-11',
  'akshaya-tritiya':  '2026-04-19',
  'guru-purnima':     '2026-07-09',
  'hartalika-teej':   '2026-08-15',
  'raksha-bandhan':   '2026-08-28',
  'ganesh-chaturthi': '2026-09-14',
  'janmashtami':      '2026-09-04',
  'dussehra':         '2026-10-20',
  'chhath-puja':      '2026-11-14',
  'dhanteras':        '2026-11-07',
  'narak-chaturdashi':'2026-11-08',
  'diwali':           '2026-11-08',
  'govardhan-puja':   '2026-11-09',
  'bhai-dooj':        '2026-11-10',
};

const ALL_SLUGS = Object.keys(FESTIVAL_ASTRO_FOCUS).sort();
const ALL_RASHIS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// ─── Full grid: 20 × 12 = 240 cases ─────────────────────────────────────────

describe('computePersonalizedReading — full coverage (20 festivals × 12 rashis)', () => {
  for (const slug of ALL_SLUGS) {
    for (const rashi of ALL_RASHIS) {
      it(`${slug} × rashi ${rashi} produces a complete reading`, () => {
        const date = FESTIVAL_DATES_2026[slug];
        expect(date, `Missing test date for ${slug}`).toBeDefined();

        const reading = computePersonalizedReading(slug, 2026, rashi, date);

        expect(reading, `Null reading for ${slug}/${rashi}`).not.toBeNull();
        expect(reading!.festival).toBe(slug);
        expect(reading!.year).toBe(2026);
        expect(reading!.rashi).toBe(rashi);
        expect(reading!.summary.en, 'EN summary empty').toBeTruthy();
        expect(reading!.summary.hi, 'HI summary empty').toBeTruthy();
        expect(reading!.ritual.en, 'EN ritual empty').toBeTruthy();
        expect(reading!.ritual.hi, 'HI ritual empty').toBeTruthy();
        expect(reading!.relevantHouse).toBeGreaterThanOrEqual(1);
        expect(reading!.relevantHouse).toBeLessThanOrEqual(12);
        expect(reading!.templateId).toBeTruthy();
      });
    }
  }
});

// ─── Variation invariant ────────────────────────────────────────────────────

describe('computePersonalizedReading — variation', () => {
  it('two arbitrarily-picked (festival, rashi) outputs are textually different', () => {
    // Spec §6 risk mitigation: "Mix 3 transit templates per (festival,
    // rashi) pair so the language varies; explicit fixture test that
    // two random (festival, rashi) outputs are textually different."
    const a = computePersonalizedReading('diwali', 2026, 5, FESTIVAL_DATES_2026.diwali)!;
    const b = computePersonalizedReading('holi', 2026, 9, FESTIVAL_DATES_2026.holi)!;
    expect(a.summary.en).not.toBe(b.summary.en);
    expect(a.ritual.en).not.toBe(b.ritual.en);
  });

  it('across all 240 reads, at least 3 distinct templates fire', () => {
    const templateIds = new Set<string>();
    for (const slug of ALL_SLUGS) {
      const date = FESTIVAL_DATES_2026[slug];
      for (const rashi of ALL_RASHIS) {
        const r = computePersonalizedReading(slug, 2026, rashi, date);
        if (r) templateIds.add(r.templateId);
      }
    }
    expect(templateIds.size, `Only ${templateIds.size} template(s) fired across 240 reads — template-collapse risk`).toBeGreaterThanOrEqual(3);
  });

  it('the same (festival, rashi) always produces the same output (determinism)', () => {
    const a = computePersonalizedReading('diwali', 2026, 5, '2026-11-08')!;
    const b = computePersonalizedReading('diwali', 2026, 5, '2026-11-08')!;
    expect(a.summary.en).toBe(b.summary.en);
    expect(a.ritual.en).toBe(b.ritual.en);
    expect(a.templateId).toBe(b.templateId);
  });
});

// ─── Edge cases ─────────────────────────────────────────────────────────────

describe('computePersonalizedReading — guard rails', () => {
  it('returns null for an unknown festival slug', () => {
    expect(computePersonalizedReading('not-a-festival', 2026, 5, '2026-01-01')).toBeNull();
  });

  it('returns null for rashi out of 1-12', () => {
    expect(computePersonalizedReading('diwali', 2026, 0, '2026-11-08')).toBeNull();
    expect(computePersonalizedReading('diwali', 2026, 13, '2026-11-08')).toBeNull();
  });

  it('returns null for a malformed date string', () => {
    expect(computePersonalizedReading('diwali', 2026, 5, 'not-a-date')).toBeNull();
    expect(computePersonalizedReading('diwali', 2026, 5, '2026/11/08')).toBeNull();
  });
});
