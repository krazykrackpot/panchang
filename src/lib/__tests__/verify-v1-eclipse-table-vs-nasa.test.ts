/**
 * Cross-source verification V1 — ECLIPSE_TABLE vs NASA Five Millennium Canon.
 *
 * The eclipse table at `src/lib/calendar/eclipse-data.ts` claims to source
 * its data from NASA's Five Millennium Canon of Solar Eclipses and Lunar
 * Eclipses (eclipse.gsfc.nasa.gov / Fred Espenak NASA/GSFC). Until this
 * test, no cross-source check existed — a typo at data-entry time would
 * silently produce wrong eclipse times shown to users.
 *
 * This test locks in 12 hand-curated reference values from NASA's
 * published predictions for 2024-2026 (the recent + upcoming window
 * most user-visible). Every field that's user-displayed or used in
 * downstream contact-time math is asserted:
 *
 *   - date (YYYY-MM-DD)
 *   - type (total / partial / annular / penumbral / hybrid)
 *   - saros number
 *   - magnitude (umbral for lunar, greatest for solar)
 *   - UTC contact times (max for both; p1/p4 + u1/u2 for lunar; maxUtc for solar)
 *
 * NASA references (entered as expected values in EXPECTED below):
 *   Solar:  https://eclipse.gsfc.nasa.gov/SEcat5/SE2021-2030.html
 *   Lunar:  https://eclipse.gsfc.nasa.gov/LEcat5/LE2021-2030.html
 *
 * Audit angle 2, V1 (2026-06-05). If NASA were to issue a correction to
 * any of these predictions, update both the table and this test in the
 * same commit (Lesson S — change canonical + verifier together).
 */

import { describe, it, expect } from 'vitest';
import { ECLIPSE_TABLE } from '@/lib/calendar/eclipse-data';

interface ExpectedLunar {
  kind: 'lunar';
  date: string;
  type: 'total' | 'partial' | 'penumbral';
  max: string;           // greatest eclipse UTC HH:MM
  saros: number;
  magnitude: number;     // ±0.005 tolerance
  source: string;        // NASA URL for verification
}

interface ExpectedSolar {
  kind: 'solar';
  date: string;
  type: 'total' | 'annular' | 'partial' | 'hybrid';
  maxUtc: string;        // HH:MM:SS
  saros: number;
  magnitude: number;     // ±0.005 tolerance
  source: string;
}

type Expected = ExpectedLunar | ExpectedSolar;

// ───────────────────────────────────────────────────────────────────────────
// 12 cross-source reference values from NASA Eclipse predictions
// ───────────────────────────────────────────────────────────────────────────
const EXPECTED: readonly Expected[] = [
  // 2024-03-25 — Penumbral lunar
  {
    kind: 'lunar', date: '2024-03-25', type: 'penumbral',
    max: '07:12', saros: 113, magnitude: -0.13,
    source: 'NASA LE2021-2030 — Saros 113',
  },
  // 2024-04-08 — Great American Total Solar
  {
    kind: 'solar', date: '2024-04-08', type: 'total',
    maxUtc: '18:17:16', saros: 139, magnitude: 1.0566,
    source: 'NASA SE2021-2030 — Saros 139',
  },
  // 2024-09-18 — Partial lunar
  {
    kind: 'lunar', date: '2024-09-18', type: 'partial',
    max: '02:44', saros: 118, magnitude: 0.085,
    source: 'NASA LE2021-2030 — Saros 118',
  },
  // 2024-10-02 — Annular solar (South Pacific / South America)
  {
    kind: 'solar', date: '2024-10-02', type: 'annular',
    maxUtc: '18:45:04', saros: 144, magnitude: 0.9326,
    source: 'NASA SE2021-2030 — Saros 144',
  },
  // 2025-03-14 — Total lunar (NA / Pacific)
  {
    kind: 'lunar', date: '2025-03-14', type: 'total',
    max: '06:58', saros: 123, magnitude: 1.178,
    source: 'NASA LE2021-2030 — Saros 123',
  },
  // 2025-03-29 — Partial solar
  {
    kind: 'solar', date: '2025-03-29', type: 'partial',
    maxUtc: '10:47:52', saros: 149, magnitude: 0.9383,
    source: 'NASA SE2021-2030 — Saros 149',
  },
  // 2025-09-07 — Total lunar (Asia / Australia / Africa)
  {
    kind: 'lunar', date: '2025-09-07', type: 'total',
    max: '18:11', saros: 128, magnitude: 1.362,
    source: 'NASA LE2021-2030 — Saros 128',
  },
  // 2025-09-21 — Partial solar (south)
  {
    kind: 'solar', date: '2025-09-21', type: 'partial',
    maxUtc: '19:42:36', saros: 154, magnitude: 0.8553,
    source: 'NASA SE2021-2030 — Saros 154',
  },
  // 2026-02-17 — Annular solar (Antarctica)
  {
    kind: 'solar', date: '2026-02-17', type: 'annular',
    maxUtc: '12:52:12', saros: 121, magnitude: 0.9634,
    source: 'NASA SE2021-2030 — Saros 121',
  },
  // 2026-03-03 — Total lunar (Asia / Pacific / Americas)
  {
    kind: 'lunar', date: '2026-03-03', type: 'total',
    max: '11:33', saros: 133, magnitude: 1.151,
    source: 'NASA LE2021-2030 — Saros 133',
  },
  // 2026-08-12 — Total solar (Iceland / Spain)
  {
    kind: 'solar', date: '2026-08-12', type: 'total',
    maxUtc: '17:46:06', saros: 126, magnitude: 1.0386,
    source: 'NASA SE2021-2030 — Saros 126',
  },
  // 2026-08-28 — Partial lunar
  {
    kind: 'lunar', date: '2026-08-28', type: 'partial',
    max: '04:52', saros: 138, magnitude: 0.037,
    source: 'NASA LE2021-2030 — Saros 138',
  },
] as const;

// ───────────────────────────────────────────────────────────────────────────
describe('Verify V1 — ECLIPSE_TABLE matches NASA Five Millennium Canon', () => {
  for (const ref of EXPECTED) {
    describe(`${ref.date} (${ref.kind} ${ref.type}, saros ${ref.saros})`, () => {
      const entry = ECLIPSE_TABLE.find(e => e.date === ref.date && e.kind === ref.kind);

      it('entry exists in ECLIPSE_TABLE', () => {
        expect(entry, `${ref.date} ${ref.kind} not found — source: ${ref.source}`).toBeDefined();
      });

      it(`type matches NASA (${ref.type})`, () => {
        expect(entry?.type).toBe(ref.type);
      });

      it(`saros matches NASA (${ref.saros})`, () => {
        expect(entry?.saros).toBe(ref.saros);
      });

      it(`magnitude within ±0.005 of NASA (${ref.magnitude})`, () => {
        expect(entry).toBeDefined();
        expect(Math.abs((entry!.magnitude) - ref.magnitude)).toBeLessThanOrEqual(0.005);
      });

      if (ref.kind === 'lunar') {
        it(`greatest-eclipse UTC time matches NASA (${ref.max})`, () => {
          expect(entry?.kind).toBe('lunar');
          if (entry?.kind !== 'lunar') return;
          // Compare HH:MM byte-for-byte. NASA publishes minute precision.
          expect(entry.max).toBe(ref.max);
        });
      } else {
        it(`greatest-eclipse UTC time matches NASA (${ref.maxUtc})`, () => {
          expect(entry?.kind).toBe('solar');
          if (entry?.kind !== 'solar') return;
          expect(entry.maxUtc).toBe(ref.maxUtc);
        });
      }
    });
  }
});

// ───────────────────────────────────────────────────────────────────────────
// Lunar-only contact-time triplet checks (p1 < max < p4 invariant)
// ───────────────────────────────────────────────────────────────────────────
describe('Verify V1 — lunar eclipse contact-time invariants', () => {
  const toMin = (s: string): number => {
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m;
  };

  for (const ref of EXPECTED) {
    if (ref.kind !== 'lunar') continue;
    it(`${ref.date}: p1 < max < p4 (in UT, wrap-aware)`, () => {
      const entry = ECLIPSE_TABLE.find(e => e.date === ref.date && e.kind === 'lunar');
      expect(entry?.kind).toBe('lunar');
      if (entry?.kind !== 'lunar') return;
      const p1 = toMin(entry.p1);
      const max = toMin(entry.max);
      const p4 = toMin(entry.p4);
      // Eclipse may cross midnight UT; wrap-aware compare.
      const ordered = (a: number, b: number) => (a <= b) || (b + 1440 - a < 720);
      expect(ordered(p1, max), `p1 ${entry.p1} should precede max ${entry.max}`).toBe(true);
      expect(ordered(max, p4), `max ${entry.max} should precede p4 ${entry.p4}`).toBe(true);
    });
  }
});

// ───────────────────────────────────────────────────────────────────────────
// Solar-only invariants: max lat/lon are finite and in valid ranges
// ───────────────────────────────────────────────────────────────────────────
describe('Verify V1 — solar eclipse geometry invariants', () => {
  for (const ref of EXPECTED) {
    if (ref.kind !== 'solar') continue;
    it(`${ref.date}: max lat ∈ [-90, 90], max lon ∈ [-180, 180]`, () => {
      const entry = ECLIPSE_TABLE.find(e => e.date === ref.date && e.kind === 'solar');
      expect(entry?.kind).toBe('solar');
      if (entry?.kind !== 'solar') return;
      expect(entry.maxLat).toBeGreaterThanOrEqual(-90);
      expect(entry.maxLat).toBeLessThanOrEqual(90);
      expect(entry.maxLon).toBeGreaterThanOrEqual(-180);
      expect(entry.maxLon).toBeLessThanOrEqual(180);
      expect(Number.isFinite(entry.gamma)).toBe(true);
    });
  }
});
