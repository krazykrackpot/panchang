/**
 * Gauri Panchang rotation + structure regression test.
 *
 * Why this test exists: the 8-period rotation in `gauri-panchang.ts` is
 * sourced from published Tamil Gowri Panchangam tables (Sri Vakratunda
 * style). If anyone edits the cycle order, the weekday start array, or
 * the nature classification, this test will fail and force a deliberate
 * review against the canonical source — preventing the kind of silent
 * constant drift documented in CLAUDE.md Lessons S & Z.
 *
 * The Choghadiya test suite catches the same class of bug for its
 * 7-period rotation; this file is the Gauri equivalent.
 */
import { describe, it, expect } from 'vitest';
import { computeGauriPanchang } from '@/lib/gauri/gauri-calculator';
import {
  GAURI_TYPES,
  GAURI_NATURE,
  GAURI_DAY_START_BY_WEEKDAY,
  GAURI_NIGHT_START_BY_WEEKDAY,
} from '@/lib/constants/gauri-panchang';

describe('Gauri Panchang constants', () => {
  it('has exactly 8 distinct period names in the canonical order', () => {
    expect(GAURI_TYPES).toHaveLength(8);
    const unique = new Set(GAURI_TYPES);
    expect(unique.size).toBe(8);
    // Canonical order from Tamil published Gowri Panchangam tables:
    expect(Array.from(GAURI_TYPES)).toEqual([
      'amritha', 'siddha', 'marana', 'rogam',
      'laabha', 'dhanam', 'sugam', 'sokam',
    ]);
  });

  it('classifies five periods auspicious and three inauspicious', () => {
    const auspicious = GAURI_TYPES.filter(t => GAURI_NATURE[t] === 'auspicious');
    const inauspicious = GAURI_TYPES.filter(t => GAURI_NATURE[t] === 'inauspicious');
    expect(auspicious).toHaveLength(5);
    expect(inauspicious).toHaveLength(3);
    // Specifically:
    expect(auspicious.sort()).toEqual(
      ['amritha', 'dhanam', 'laabha', 'siddha', 'sugam'].sort(),
    );
    expect(inauspicious.sort()).toEqual(['marana', 'rogam', 'sokam'].sort());
  });

  it('has a weekday-rotation table indexable by 0=Sun…6=Sat', () => {
    expect(GAURI_DAY_START_BY_WEEKDAY).toHaveLength(7);
    expect(GAURI_NIGHT_START_BY_WEEKDAY).toHaveLength(7);
    for (let w = 0; w < 7; w++) {
      expect(GAURI_DAY_START_BY_WEEKDAY[w]).toBeGreaterThanOrEqual(0);
      expect(GAURI_DAY_START_BY_WEEKDAY[w]).toBeLessThan(8);
      expect(GAURI_NIGHT_START_BY_WEEKDAY[w]).toBeGreaterThanOrEqual(0);
      expect(GAURI_NIGHT_START_BY_WEEKDAY[w]).toBeLessThan(8);
    }
  });

  it('places the night start exactly four positions ahead of the day start (mod 8)', () => {
    // Classical "opposite face" convention used in published Tamil
    // panchangs: night offset = (day offset + 4) mod 8. If this
    // invariant breaks, downstream UI components that assume night
    // continues the cycle will mis-label slots.
    for (let w = 0; w < 7; w++) {
      const expected = (GAURI_DAY_START_BY_WEEKDAY[w] + 4) % 8;
      expect(GAURI_NIGHT_START_BY_WEEKDAY[w]).toBe(expected);
    }
  });

  it('starts Monday-day with Amritha (Soma=Moon=nectar)', () => {
    // Classical association: the lord of Monday (Soma=Moon) corresponds
    // to Amritha (nectar). This is the most cited Gauri rotation anchor
    // and the easiest single check that the rotation table is right.
    expect(GAURI_TYPES[GAURI_DAY_START_BY_WEEKDAY[1]]).toBe('amritha');
  });
});

describe('computeGauriPanchang structure', () => {
  // Chennai 2026-05-27 Wednesday — sunrise ~05:43 IST, sunset ~18:36 IST.
  // Using these literal numeric values keeps the test free of any
  // astronomy-engine dependency — purely tests the slicing + labelling
  // logic over a known sunrise/sunset pair.
  const SUNRISE_UT = 0.2333;
  const SUNSET_UT = 13.1;
  const TZ_OFFSET = 5.5;

  it('returns 16 slots — 8 day + 8 night', () => {
    const slots = computeGauriPanchang(SUNRISE_UT, SUNSET_UT, /*weekday*/ 3, TZ_OFFSET);
    expect(slots).toHaveLength(16);
    expect(slots.filter(s => s.period === 'day')).toHaveLength(8);
    expect(slots.filter(s => s.period === 'night')).toHaveLength(8);
  });

  it('day slots advance through the cycle in order from the weekday start', () => {
    const weekday = 3; // Wednesday → day start = Laabha (index 4)
    const slots = computeGauriPanchang(SUNRISE_UT, SUNSET_UT, weekday, TZ_OFFSET);
    const dayTypes = slots.filter(s => s.period === 'day').map(s => s.type);
    const start = GAURI_DAY_START_BY_WEEKDAY[weekday];
    const expected = Array.from({ length: 8 }, (_, i) => GAURI_TYPES[(start + i) % 8]);
    expect(dayTypes).toEqual(expected);
  });

  it('night slots advance through the cycle from the night-start offset', () => {
    const weekday = 3;
    const slots = computeGauriPanchang(SUNRISE_UT, SUNSET_UT, weekday, TZ_OFFSET);
    const nightTypes = slots.filter(s => s.period === 'night').map(s => s.type);
    const start = GAURI_NIGHT_START_BY_WEEKDAY[weekday];
    const expected = Array.from({ length: 8 }, (_, i) => GAURI_TYPES[(start + i) % 8]);
    expect(nightTypes).toEqual(expected);
  });

  it('emits HH:MM time strings in 24-hour local time', () => {
    const slots = computeGauriPanchang(SUNRISE_UT, SUNSET_UT, 3, TZ_OFFSET);
    for (const s of slots) {
      expect(s.startTime).toMatch(/^\d{2}:\d{2}$/);
      expect(s.endTime).toMatch(/^\d{2}:\d{2}$/);
    }
    // First day slot begins at local sunrise (UT 0.2333 + 5.5 = 5.7333 → 05:43)
    const firstDay = slots.find(s => s.period === 'day')!;
    expect(firstDay.startTime).toBe('05:43');
    // First night slot begins at local sunset (UT 13.1 + 5.5 = 18.6 → 18:36)
    const firstNight = slots.find(s => s.period === 'night')!;
    expect(firstNight.startTime).toBe('18:36');
  });

  it('flags exactly one night slot as crossing local midnight', () => {
    // For any sunrise/sunset pair where the day duration is short
    // enough (i.e., night straddles midnight), exactly one of the 8
    // night slots wraps the 24h local clock. We assert "at most one"
    // rather than "exactly one" because in polar or extreme-latitude
    // cases the night might fit on one side of midnight — but for
    // any reasonable mid-latitude pair (like Chennai) it is exactly
    // one. CLAUDE.md Lesson R.
    const slots = computeGauriPanchang(SUNRISE_UT, SUNSET_UT, 3, TZ_OFFSET);
    const wraps = slots.filter(s => s.crossesMidnight);
    expect(wraps).toHaveLength(1);
    // And it must be a night slot — day Gauri can never cross midnight.
    expect(wraps[0].period).toBe('night');
    // The wrapping slot's displayed end-time should be numerically less
    // than its start-time (the visible "wrap" signature).
    const [sh, sm] = wraps[0].startTime.split(':').map(Number);
    const [eh, em] = wraps[0].endTime.split(':').map(Number);
    expect(eh * 60 + em).toBeLessThan(sh * 60 + sm);
  });

  it('every emitted slot has a nature matching the constants table', () => {
    const slots = computeGauriPanchang(SUNRISE_UT, SUNSET_UT, 3, TZ_OFFSET);
    for (const s of slots) {
      expect(s.nature).toBe(GAURI_NATURE[s.type]);
    }
  });
});
