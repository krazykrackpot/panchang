/**
 * D60 Shashtiamsha deity table — invariants + spot-checks against
 * Santhanam BPHS Ch.6 v.33-41 and Phaladeepika Sastri/Ojha.
 */

import { describe, it, expect } from 'vitest';
import {
  D60_DEITIES_ODD,
  KRURA_POSITIONS_SASTRI,
  KRURA_POSITIONS_OJHA,
  DEFAULT_KRURA_VARIANT,
  getD60Deity,
  isKruraD60,
} from '../d60-deities';

describe('D60_DEITIES_ODD — primary-source invariants', () => {
  it('contains exactly 60 entries indexed 1..60', () => {
    expect(D60_DEITIES_ODD).toHaveLength(60);
    for (let i = 0; i < 60; i++) {
      expect(D60_DEITIES_ODD[i]!.position).toBe(i + 1);
    }
  });

  it('every entry has non-empty EN, HI, SA names', () => {
    for (const d of D60_DEITIES_ODD) {
      expect(d.name.en.length).toBeGreaterThan(0);
      expect(d.name.hi.length).toBeGreaterThan(0);
      expect(d.name.sa.length).toBeGreaterThan(0);
    }
  });

  // Spot-checks against the Santhanam English transliteration. These
  // hard-code values lifted verbatim from BPHS Ch.6 v.33-41 (Santhanam) so
  // any future "cleanup" that rewrites the table will fail loudly.
  const SANTHANAM_SPOT_CHECKS: ReadonlyArray<{ position: number; en: string }> = [
    { position: 1,  en: 'Ghora' },
    { position: 4,  en: 'Kuber' },
    { position: 17, en: 'Amrit' },
    { position: 22, en: 'Brahma' },
    { position: 24, en: 'Maheshwara' },
    { position: 25, en: 'Deva' },          // critical — secondary sources had this wrong
    { position: 30, en: 'Gulik' },
    { position: 34, en: 'Ghora' },         // recurs
    { position: 39, en: 'PurnaCandr' },
    { position: 45, en: 'Saumya' },
    { position: 54, en: 'Saumya' },        // recurs
    { position: 57, en: 'Amrit' },         // recurs
    { position: 60, en: 'CandraRekha' },
  ];

  it.each(SANTHANAM_SPOT_CHECKS)(
    'position $position is "$en" per Santhanam BPHS Ch.6 v.33-41',
    ({ position, en }) => {
      expect(D60_DEITIES_ODD[position - 1]!.name.en).toBe(en);
    },
  );
});

describe('Krura position sets — Phaladeepika', () => {
  it('Sastri set has 24 positions in odd signs', () => {
    expect(KRURA_POSITIONS_SASTRI.size).toBe(24);
  });

  it('Ojha set has 24 positions in odd signs', () => {
    expect(KRURA_POSITIONS_OJHA.size).toBe(24);
  });

  it('Sastri and Ojha differ ONLY at positions 16 vs 18', () => {
    // Sastri-only: 18. Ojha-only: 16. Everything else identical.
    const sastriOnly = [...KRURA_POSITIONS_SASTRI].filter((p) => !KRURA_POSITIONS_OJHA.has(p));
    const ojhaOnly = [...KRURA_POSITIONS_OJHA].filter((p) => !KRURA_POSITIONS_SASTRI.has(p));
    expect(sastriOnly).toEqual([18]);
    expect(ojhaOnly).toEqual([16]);
  });

  it('default variant is Sastri', () => {
    expect(DEFAULT_KRURA_VARIANT).toBe('sastri');
  });

  it('Sastri set matches the full published list verbatim', () => {
    const expected = new Set([
      1, 2, 8, 9, 10, 11, 12, 15, 18, 30, 31, 32, 33, 34, 35,
      39, 40, 42, 43, 44, 48, 51, 52, 59,
    ]);
    expect(new Set(KRURA_POSITIONS_SASTRI)).toEqual(expected);
  });
});

describe('getD60Deity — even-sign reversal', () => {
  it('odd sign: position N returns the Nth entry', () => {
    expect(getD60Deity(1, true).name.en).toBe('Ghora');
    expect(getD60Deity(30, true).name.en).toBe('Gulik');
    expect(getD60Deity(60, true).name.en).toBe('CandraRekha');
  });

  it('even sign: position N returns the (60 - N + 1)th entry per Ch.6 v.41', () => {
    expect(getD60Deity(1, false).name.en).toBe('CandraRekha');
    expect(getD60Deity(60, false).name.en).toBe('Ghora');
    // Position 30 in even = position 31 in odd
    expect(getD60Deity(30, false).name.en).toBe(D60_DEITIES_ODD[30]!.name.en);
    // Position 31 in even = position 30 in odd
    expect(getD60Deity(31, false).name.en).toBe(D60_DEITIES_ODD[29]!.name.en);
  });

  it('reversal symmetry — applying twice returns to the original', () => {
    for (let pos = 1; pos <= 60; pos++) {
      const evenDeity = getD60Deity(pos, false);
      const reversedPosition = 60 - pos + 1;
      const oddDeityAtMirror = getD60Deity(reversedPosition, true);
      expect(evenDeity.name.en).toBe(oddDeityAtMirror.name.en);
    }
  });

  it('throws RangeError on invalid positions', () => {
    expect(() => getD60Deity(0, true)).toThrow(RangeError);
    expect(() => getD60Deity(61, true)).toThrow(RangeError);
    expect(() => getD60Deity(1.5, true)).toThrow(RangeError);
    expect(() => getD60Deity(NaN, true)).toThrow(RangeError);
  });
});

describe('isKruraD60 — odd/even swap + variant selection', () => {
  it('odd sign uses the variant\'s Krura set directly', () => {
    // Position 1 (Ghora) is Krura in both variants
    expect(isKruraD60(1, true, 'sastri')).toBe(true);
    expect(isKruraD60(1, true, 'ojha')).toBe(true);
    // Position 3 (Deva) is Saumya
    expect(isKruraD60(3, true, 'sastri')).toBe(false);
    expect(isKruraD60(3, true, 'ojha')).toBe(false);
  });

  it('Sastri vs Ojha split at the 16/18 boundary', () => {
    expect(isKruraD60(18, true, 'sastri')).toBe(true);
    expect(isKruraD60(18, true, 'ojha')).toBe(false);
    expect(isKruraD60(16, true, 'sastri')).toBe(false);
    expect(isKruraD60(16, true, 'ojha')).toBe(true);
  });

  it('even sign inverts odd-sign Krura → Saumya and vice versa', () => {
    // Position 1 is Krura in odd → Saumya in even
    expect(isKruraD60(1, false, 'sastri')).toBe(false);
    // Position 3 is Saumya in odd → Krura in even
    expect(isKruraD60(3, false, 'sastri')).toBe(true);
    // The 16/18 Sastri-vs-Ojha split inverts in even signs too
    expect(isKruraD60(18, false, 'sastri')).toBe(false);
    expect(isKruraD60(18, false, 'ojha')).toBe(true);
  });

  it('default variant resolves to Sastri when not specified', () => {
    expect(isKruraD60(18, true)).toBe(isKruraD60(18, true, 'sastri'));
  });

  it('throws RangeError on invalid positions', () => {
    expect(() => isKruraD60(0, true)).toThrow(RangeError);
    expect(() => isKruraD60(61, true)).toThrow(RangeError);
  });
});
