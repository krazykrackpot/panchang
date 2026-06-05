/**
 * Audit 2026-06-05 Phase 4b — #13 Nakshatra → ruler consolidation.
 *
 * The audit listed 7 files with mixed-encoding inline copies of the
 * Vimshottari Mahadasha cycle (Ke / Ve / Su / Mo / Ma / Ra / Ju / Sa / Me).
 * Three different shapes were duplicated:
 *
 *   - 9-element string cycle      (`DASHA_ORDER`)
 *   - 9-element numeric-id cycle  (`DASHA_ORDER_IDS`)
 *   - 27-element nakshatra→lord   (`NAKSHATRA_LORDS`, `NAKSHATRA_LORD_IDS`)
 *
 * All four are now exported from `src/lib/constants/nakshatras.ts`,
 * derived from `VIMSHOTTARI_ORDER` (the single source of truth for the
 * 9 lord + years tuples) and from `NAKSHATRAS[i].ruler` (the per-entry
 * ruler string).
 *
 * This test locks in:
 *   1. The 9 lords + years match BPHS Ch.46 verbatim
 *   2. The 27-entry arrays match `OLD_INLINE × 3`
 *   3. Drik Panchang Delhi panchang remains byte-identical for the
 *      same 5 cases Phase 4a verified (cross-source guard)
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  VIMSHOTTARI_ORDER,
  DASHA_ORDER,
  DASHA_ORDER_IDS,
  VIMSHOTTARI_YEARS,
  NAKSHATRA_LORDS,
  NAKSHATRA_LORD_IDS,
} from '@/lib/constants/nakshatras';
import { computePanchang } from '@/lib/ephem/panchang-calc';

const DELHI = { lat: 28.6139, lng: 77.2090, tzOffset: 5.5, timezone: 'Asia/Kolkata' };

// ───────────────────────────────────────────────────────────────────────────
// 1 — VIMSHOTTARI_ORDER matches BPHS Ch.46
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P4b.1: VIMSHOTTARI_ORDER matches BPHS Ch.46 verbatim', () => {
  // The Vimshottari cycle per BPHS Ch.46 — 9 lords totalling 120 years.
  const BPHS: Array<{ name: string; id: number; years: number }> = [
    { name: 'Ketu',    id: 8, years: 7  },
    { name: 'Venus',   id: 5, years: 20 },
    { name: 'Sun',     id: 0, years: 6  },
    { name: 'Moon',    id: 1, years: 10 },
    { name: 'Mars',    id: 2, years: 7  },
    { name: 'Rahu',    id: 7, years: 18 },
    { name: 'Jupiter', id: 4, years: 16 },
    { name: 'Saturn',  id: 6, years: 19 },
    { name: 'Mercury', id: 3, years: 17 },
  ];

  it('VIMSHOTTARI_ORDER has 9 entries', () => {
    expect(VIMSHOTTARI_ORDER.length).toBe(9);
  });

  it('total dasha years = 120 (Vimshottari classical)', () => {
    expect(VIMSHOTTARI_ORDER.reduce((acc, v) => acc + v.years, 0)).toBe(120);
  });

  for (let i = 0; i < 9; i++) {
    it(`slot ${i + 1} = ${BPHS[i].name} (id ${BPHS[i].id}, ${BPHS[i].years}y)`, () => {
      expect(VIMSHOTTARI_ORDER[i].name).toBe(BPHS[i].name);
      expect(VIMSHOTTARI_ORDER[i].id).toBe(BPHS[i].id);
      expect(VIMSHOTTARI_ORDER[i].years).toBe(BPHS[i].years);
    });
  }
});

// ───────────────────────────────────────────────────────────────────────────
// 2 — Derived arrays match the prior inline copies
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P4b.2: derived arrays match every inline copy they replace', () => {
  const OLD_STRING_CYCLE = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  const OLD_ID_CYCLE = [8, 5, 0, 1, 2, 7, 4, 6, 3];
  const OLD_YEARS_CYCLE = [7, 20, 6, 10, 7, 18, 16, 19, 17];

  it('DASHA_ORDER (9 strings) byte-matches every inline copy', () => {
    expect([...DASHA_ORDER]).toEqual(OLD_STRING_CYCLE);
  });

  it('DASHA_ORDER_IDS (9 ints) byte-matches every inline copy', () => {
    expect([...DASHA_ORDER_IDS]).toEqual(OLD_ID_CYCLE);
  });

  it('VIMSHOTTARI_YEARS (9 ints) byte-matches every inline copy', () => {
    expect([...VIMSHOTTARI_YEARS]).toEqual(OLD_YEARS_CYCLE);
  });

  it('NAKSHATRA_LORDS (27 strings) = OLD_STRING_CYCLE × 3', () => {
    const expected = [...OLD_STRING_CYCLE, ...OLD_STRING_CYCLE, ...OLD_STRING_CYCLE];
    expect([...NAKSHATRA_LORDS]).toEqual(expected);
  });

  it('NAKSHATRA_LORD_IDS (27 ints) = OLD_ID_CYCLE × 3', () => {
    const expected = [...OLD_ID_CYCLE, ...OLD_ID_CYCLE, ...OLD_ID_CYCLE];
    expect([...NAKSHATRA_LORD_IDS]).toEqual(expected);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 3 — No production file outside `src/lib/constants/nakshatras.ts` still
//     declares the 9-element Vimshottari cycle inline.
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P4b.3: no production duplicates left', () => {
  it('no source file outside __tests__ still inlines the Vimshottari cycle', () => {
    // Match the verbatim 9-element string cycle pattern that lived in
    // the 7 files Phase 4b consolidated. The canonical file declares it
    // as the VIMSHOTTARI_ORDER object array (different shape — the pattern
    // below won't match the canonical declaration).
    const inlinePattern = /'Ketu'\s*,\s*'Venus'\s*,\s*'Sun'\s*,\s*'Moon'\s*,\s*'Mars'\s*,\s*'Rahu'\s*,\s*'Jupiter'\s*,\s*'Saturn'\s*,\s*'Mercury'/;

    function walk(dir: string): string[] {
      const out: string[] = [];
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) out.push(...walk(full));
        else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) out.push(full);
      }
      return out;
    }

    const allowed = ['src/lib/constants/nakshatras.ts'];
    const offenders: string[] = [];
    for (const f of walk(join(process.cwd(), 'src'))) {
      if (f.includes('__tests__')) continue;
      const rel = f.replace(process.cwd() + '/', '');
      if (allowed.includes(rel)) continue;
      const text = readFileSync(f, 'utf8');
      if (inlinePattern.test(text)) offenders.push(rel);
    }
    expect(offenders, `inline Vimshottari cycle still present: ${offenders.join(', ')}`).toEqual([]);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 4 — Drik Panchang Delhi unchanged after Phase 4b edits
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P4b.4 (cross-source): Drik Panchang Delhi unchanged', () => {
  const cases: Array<{ date: string; tithi: number; amanta: string; purnimanta: string }> = [
    { date: '2026-02-17', tithi: 30, amanta: 'Magha',           purnimanta: 'Phalguna' },
    { date: '2026-06-05', tithi: 20, amanta: 'Adhika Jyeshtha', purnimanta: 'Adhika Jyeshtha' },
    { date: '2026-07-14', tithi: 30, amanta: 'Jyeshtha',        purnimanta: 'Ashadha' },
    { date: '2026-10-10', tithi: 30, amanta: 'Bhadrapada',      purnimanta: 'Ashwina' },
    { date: '2026-12-08', tithi: 30, amanta: 'Kartika',         purnimanta: 'Margashirsha' },
  ];

  for (const c of cases) {
    it(`${c.date}: tithi=${c.tithi}, amanta=${c.amanta}, purnimanta=${c.purnimanta}`, () => {
      const [y, mo, d] = c.date.split('-').map(Number);
      const p = computePanchang({ year: y, month: mo, day: d, ...DELHI });
      expect(p.tithi.number, `${c.date} tithi`).toBe(c.tithi);
      expect(p.amantMasa?.en, `${c.date} amanta`).toBe(c.amanta);
      expect(p.purnimantMasa?.en, `${c.date} purnimanta`).toBe(c.purnimanta);
    });
  }
});
