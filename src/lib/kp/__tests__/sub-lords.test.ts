/**
 * KP Sub-Lord table — source-level invariants.
 *
 * Pins the engine's 4-level division of the zodiac against future drift.
 * Required by the KP roadmap spec (docs/specs/2026-06-04-kp-system-roadmap.md §2.1).
 *
 * Naming note (important):
 *   Canonical KP literature calls the 9-per-nakshatra division "Sub Lord".
 *   This engine stores that field under the name `starLord` in `SUB_LORD_TABLE`
 *   and `SubLordInfo`. The engine's `subLord` field is the next level deeper
 *   (the 81-per-nakshatra "Sub-Sub Lord"). The naming is idiosyncratic but
 *   stable; both fields are exercised below with explicit cross-references.
 */

import { describe, expect, it } from 'vitest';
import { SUB_LORD_TABLE, getSubLordForDegree } from '../sub-lords';

// ---------------------------------------------------------------------------
// Constants (mirrored from sub-lords.ts so the test pins them independently)
// ---------------------------------------------------------------------------

const NAKSHATRA_SPAN = 360 / 27; // 13°20′ = 13.3333…°
const VIMSHOTTARI_LORD_IDS = [8, 5, 0, 1, 2, 7, 4, 6, 3]; // Ke Ve Su Mo Ma Ra Ju Sa Me
const VIMSHOTTARI_YEARS   = [7, 20, 6, 10, 7, 18, 16, 19, 17];

// Tight float tolerance — every boundary in the engine is computed from
// rational arithmetic over NAKSHATRA_SPAN × (years/120), so adjacency must
// be exact to 1e-9 (well below any astronomically meaningful precision).
const FLOAT_EPS = 1e-9;

describe('SUB_LORD_TABLE — structural invariants', () => {
  it('contains 27 × 9 × 9 × 9 = 19,683 entries (4-level division)', () => {
    expect(SUB_LORD_TABLE.length).toBe(27 * 9 * 9 * 9);
  });

  it('covers the full zodiac [0°, 360°) contiguously', () => {
    expect(SUB_LORD_TABLE[0].start).toBeCloseTo(0, 9);
    expect(SUB_LORD_TABLE[SUB_LORD_TABLE.length - 1].end).toBeCloseTo(360, 9);
  });

  it('has zero gaps and zero overlaps between consecutive entries', () => {
    for (let i = 0; i < SUB_LORD_TABLE.length - 1; i++) {
      const diff = Math.abs(SUB_LORD_TABLE[i + 1].start - SUB_LORD_TABLE[i].end);
      if (diff > FLOAT_EPS) {
        throw new Error(
          `Gap/overlap at index ${i}: end=${SUB_LORD_TABLE[i].end}, ` +
            `next.start=${SUB_LORD_TABLE[i + 1].start}, diff=${diff}`,
        );
      }
    }
  });

  it('every entry has start < end (monotonic)', () => {
    for (let i = 0; i < SUB_LORD_TABLE.length; i++) {
      expect(SUB_LORD_TABLE[i].end).toBeGreaterThan(SUB_LORD_TABLE[i].start);
    }
  });

  it('every planet id in every field is in range [0, 8]', () => {
    for (const e of SUB_LORD_TABLE) {
      for (const id of [e.signLord, e.starLord, e.subLord, e.subSubLord]) {
        expect(id).toBeGreaterThanOrEqual(0);
        expect(id).toBeLessThanOrEqual(8);
      }
    }
  });
});

describe('Each nakshatra — per-nakshatra invariants', () => {
  // Group entries by nakshatra (0..26)
  function entriesForNak(nak: number) {
    return SUB_LORD_TABLE.filter(
      (e) => Math.floor(e.start / NAKSHATRA_SPAN + FLOAT_EPS) === nak,
    );
  }

  it('all 27 nakshatras span exactly NAKSHATRA_SPAN (13°20′)', () => {
    for (let nak = 0; nak < 27; nak++) {
      const entries = entriesForNak(nak);
      const sum = entries.reduce((s, e) => s + (e.end - e.start), 0);
      expect(Math.abs(sum - NAKSHATRA_SPAN)).toBeLessThan(FLOAT_EPS);
    }
  });

  it('each nakshatra has all 9 Vimshottari planets as distinct starLords (= canonical KP sub-lords)', () => {
    for (let nak = 0; nak < 27; nak++) {
      const entries = entriesForNak(nak);
      const starLords = new Set(entries.map((e) => e.starLord));
      expect(starLords.size).toBe(9);
      for (const id of VIMSHOTTARI_LORD_IDS) {
        expect(starLords.has(id)).toBe(true);
      }
    }
  });

  it('starLord sequence rotates through Vimshottari starting from nakshatra’s primary lord', () => {
    // Distinct starLord IDs in their order of appearance within the nakshatra
    for (let nak = 0; nak < 27; nak++) {
      const entries = entriesForNak(nak);
      const seq: number[] = [];
      let last = -1;
      for (const e of entries) {
        if (e.starLord !== last) {
          seq.push(e.starLord);
          last = e.starLord;
        }
      }
      // Expected rotation starts at NAKSHATRA_LORD_IDS[nak % 9]
      const offset = nak % 9;
      const expected = Array.from(
        { length: 9 },
        (_, i) => VIMSHOTTARI_LORD_IDS[(offset + i) % 9],
      );
      expect(seq).toEqual(expected);
    }
  });

  it('within each starLord (sub) portion, span is proportional to Vimshottari years', () => {
    // For Aswini (nak 0), Ketu's starLord span should be (7/120) × NAKSHATRA_SPAN
    const entries = entriesForNak(0);
    const ketuEntries = entries.filter((e) => e.starLord === 8); // Ketu = 8
    const ketuSpan = ketuEntries.reduce((s, e) => s + (e.end - e.start), 0);
    const expectedKetuSpan = (7 / 120) * NAKSHATRA_SPAN;
    expect(Math.abs(ketuSpan - expectedKetuSpan)).toBeLessThan(FLOAT_EPS);

    // Sun's starLord span should be (6/120) × NAKSHATRA_SPAN
    const sunEntries = entries.filter((e) => e.starLord === 0);
    const sunSpan = sunEntries.reduce((s, e) => s + (e.end - e.start), 0);
    const expectedSunSpan = (6 / 120) * NAKSHATRA_SPAN;
    expect(Math.abs(sunSpan - expectedSunSpan)).toBeLessThan(FLOAT_EPS);
  });
});

describe('249-row consolidation — canonical KP sub-lord table', () => {
  // Canonical KP literature publishes a "249 sub" table: 27 nakshatras × 9
  // sub-lord portions = 243 base rows, plus 6 additional split rows where a
  // sub-lord portion crosses a sign boundary (different sign lord on each side
  // of the boundary). Consolidating the engine's 19,683-entry table by
  // (nakshatra, starLord, signLord) — collapsing the deeper sub-sub levels —
  // should reproduce exactly 249 rows.
  //
  // Source: K.S. Krishnamurti, *Astrology and Athrishta* — original 249-sub table
  // is the structural backbone of every KP horary cast.

  it('consolidation by (nak, starLord, signLord) yields exactly 249 rows', () => {
    const rows: { nak: number; sub: number; sign: number; start: number; end: number }[] = [];
    for (const e of SUB_LORD_TABLE) {
      const nak = Math.floor(e.start / NAKSHATRA_SPAN + FLOAT_EPS);
      const last = rows[rows.length - 1];
      if (
        last &&
        last.nak === nak &&
        last.sub === e.starLord &&
        last.sign === e.signLord &&
        Math.abs(last.end - e.start) < FLOAT_EPS
      ) {
        last.end = e.end;
      } else {
        rows.push({ nak, sub: e.starLord, sign: e.signLord, start: e.start, end: e.end });
      }
    }
    expect(rows.length).toBe(249);
  });

  it('249 consolidated rows span exactly 360°', () => {
    const rows: { start: number; end: number }[] = [];
    let lastSig: string | null = null;
    for (const e of SUB_LORD_TABLE) {
      const nak = Math.floor(e.start / NAKSHATRA_SPAN + FLOAT_EPS);
      const sig = `${nak}-${e.starLord}-${e.signLord}`;
      const prev = rows[rows.length - 1];
      if (prev && sig === lastSig && Math.abs(prev.end - e.start) < FLOAT_EPS) {
        prev.end = e.end;
      } else {
        rows.push({ start: e.start, end: e.end });
        lastSig = sig;
      }
    }
    const total = rows.reduce((s, r) => s + (r.end - r.start), 0);
    expect(Math.abs(total - 360)).toBeLessThan(FLOAT_EPS);
  });
});

describe('getSubLordForDegree() — published Krishnamurti fixture', () => {
  // Krishnamurti's worked example in *Astrology and Athrishta* Reader I /
  // Reader VI: a position 9°47′ inside Aswini falls in the Saturn sub-lord.
  //
  // Why this works mathematically — sub-lord boundaries inside Aswini
  // (cumulative spans, computed in degrees):
  //
  //   Ketu     (7y):  0°00′ → 0°46′40″
  //   Venus    (20y): 0°46′40″ → 3°00′00″
  //   Sun      (6y):  3°00′00″ → 3°40′00″
  //   Moon     (10y): 3°40′00″ → 4°46′40″
  //   Mars     (7y):  4°46′40″ → 5°33′20″
  //   Rahu     (18y): 5°33′20″ → 7°33′20″
  //   Jupiter  (16y): 7°33′20″ → 9°20′00″
  //   Saturn   (19y): 9°20′00″ → 11°26′40″   ←  9°47′ falls here
  //   Mercury  (17y): 11°26′40″ → 13°20′00″
  //
  // In this engine, the canonical KP "Sub Lord" lives in the `starLord` field
  // (see file-level naming note). Saturn's planet id is 6.

  it('Aswini 9°47′ → sub-lord = Saturn (engine `starLord` field)', () => {
    const deg = 9 + 47 / 60;
    const info = getSubLordForDegree(deg);
    expect(info.starLord.id).toBe(6); // Saturn
  });

  it('Aswini 9°47′ — sign lord is Mars (Aries)', () => {
    const deg = 9 + 47 / 60;
    const info = getSubLordForDegree(deg);
    expect(info.signLord.id).toBe(2); // Mars (Aries lord)
  });
});

describe('getSubLordForDegree() — additional fixture points', () => {
  it('0° (start of Aswini) → starLord = Ketu', () => {
    expect(getSubLordForDegree(0).starLord.id).toBe(8);
  });

  it('exact span boundary 13°20′ (Aswini→Bharani) → Bharani-side start = Venus', () => {
    // First entry of Bharani starts the rotation at NAKSHATRA_LORD_IDS[1] = Venus(5)
    const justInsideBharani = NAKSHATRA_SPAN + 1e-6;
    expect(getSubLordForDegree(justInsideBharani).starLord.id).toBe(5);
  });

  it('120° (start of Magha, nak 9) → starLord = Ketu (cycle repeats every 9 nakshatras)', () => {
    // Magha's primary lord is Ketu — the Vimshottari cycle restarts.
    expect(getSubLordForDegree(120 + 1e-6).starLord.id).toBe(8);
  });

  it('normalises negative degrees', () => {
    // -10° ≡ 350° (Revati region, nak 26, starts at Mercury per cycle nak%9 = 8)
    const info = getSubLordForDegree(-10);
    expect(info.degree).toBeCloseTo(350, 9);
    expect(info.starLord.id).toBeGreaterThanOrEqual(0);
  });

  it('normalises degrees ≥ 360°', () => {
    const a = getSubLordForDegree(5);
    const b = getSubLordForDegree(365);
    expect(b.starLord.id).toBe(a.starLord.id);
    expect(b.subLord.id).toBe(a.subLord.id);
  });
});

describe('Sum of Vimshottari years', () => {
  it('totals exactly 120 (the canonical Vimshottari maha-dasha cycle)', () => {
    const total = VIMSHOTTARI_YEARS.reduce((s, y) => s + y, 0);
    expect(total).toBe(120);
  });
});
