/**
 * Audit 2026-06-05 Phase 5g — Choghadiya per-slot helper (#29).
 *
 * The chog-type rotation `CHOGHADIYA_TYPES[(START[weekday] + slotIdx) % 7]`
 * was hand-rolled in two places:
 *
 *   - src/lib/ephem/panchang-calc.ts (computeChoghadiya full-day loop)
 *   - src/lib/muhurta/engine/rules/kaala.ts (single-slot lookup at
 *     activity midpoint)
 *
 * Phase 5g extracts canonical helpers `chogTypeAtDaySlot` and
 * `chogTypeAtNightSlot` to src/lib/constants/choghadiya.ts. Both
 * call sites now route through them. The rotation can no longer
 * silently diverge (Lessons Q + S + Z).
 *
 * #30 (KP-specific dasha duplication) was already resolved in Phase
 * 4b — src/lib/kp/sub-lords.ts imports VIMSHOTTARI_YEARS from
 * @/lib/constants/nakshatras. No local copy remains. Drift-guard test
 * below locks that in.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CHOGHADIYA_TYPES,
  DAY_CHOGHADIYA_START,
  NIGHT_CHOGHADIYA_START,
  chogTypeAtDaySlot,
  chogTypeAtNightSlot,
} from '@/lib/constants/choghadiya';

const repoFile = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

// ───────────────────────────────────────────────────────────────────────────
// 1 — helper contract: matches the canonical rotation byte-for-byte
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5g.1 (#29): chogTypeAtDaySlot contract', () => {
  it('returns the same value the hand-rolled expression did', () => {
    // For every weekday × slot combination, the helper must produce
    // exactly `CHOGHADIYA_TYPES[(DAY_START[weekday] + slot) % 7]`.
    for (let weekday = 0; weekday < 7; weekday++) {
      for (let slot = 0; slot < 8; slot++) {
        const expected = CHOGHADIYA_TYPES[(DAY_CHOGHADIYA_START[weekday] + slot) % 7];
        expect(chogTypeAtDaySlot(weekday, slot)).toBe(expected);
      }
    }
  });

  // Classical canonical cross-checks (Muhurta Chintamani §2):
  // Sunday day starts with Udveg, Monday day starts with Amrit, etc.
  it("Sunday day slot 0 = 'udveg' (Muhurta Chintamani §2)", () => {
    expect(chogTypeAtDaySlot(0, 0)).toBe('udveg');
  });
  it("Monday day slot 0 = 'amrit'", () => {
    expect(chogTypeAtDaySlot(1, 0)).toBe('amrit');
  });
  it("Friday day slot 0 = 'char'", () => {
    expect(chogTypeAtDaySlot(5, 0)).toBe('char');
  });
});

describe('Audit P5g.2 (#29): chogTypeAtNightSlot contract', () => {
  it('returns the same value the hand-rolled expression did', () => {
    for (let weekday = 0; weekday < 7; weekday++) {
      for (let slot = 0; slot < 8; slot++) {
        const expected = CHOGHADIYA_TYPES[(NIGHT_CHOGHADIYA_START[weekday] + slot) % 7];
        expect(chogTypeAtNightSlot(weekday, slot)).toBe(expected);
      }
    }
  });

  it("Sunday night slot 0 = 'shubh'", () => {
    expect(chogTypeAtNightSlot(0, 0)).toBe('shubh');
  });
  it("Saturday night slot 0 = 'char'", () => {
    expect(chogTypeAtNightSlot(6, 0)).toBe('char');
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 2 — drift guards: both call sites route through the helpers
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5g.3 (#29): computeChoghadiya routes through helpers', () => {
  const src = repoFile('src/lib/ephem/panchang-calc.ts');

  it('imports chogTypeAtDaySlot + chogTypeAtNightSlot, not the raw arrays', () => {
    expect(src).toMatch(/chogTypeAtDaySlot[\s\S]*from\s+['"]@\/lib\/constants\/choghadiya['"]/);
    expect(src).toMatch(/chogTypeAtNightSlot/);
    // Raw constants no longer imported here.
    expect(src).not.toMatch(/import\s+\{[^}]*DAY_CHOGHADIYA_START[^}]*\}\s+from\s+['"]@\/lib\/constants\/choghadiya['"]/);
    expect(src).not.toMatch(/import\s+\{[^}]*NIGHT_CHOGHADIYA_START[^}]*\}\s+from\s+['"]@\/lib\/constants\/choghadiya['"]/);
  });

  it('no inline `CHOGHADIYA_TYPES[(...START[weekday] + ...) % 7]` lookup remains', () => {
    expect(src).not.toMatch(/CHOGHADIYA_TYPES\[\(.*DAY_CHOGHADIYA_START.*\+.*\)\s*%\s*7\]/);
    expect(src).not.toMatch(/CHOGHADIYA_TYPES\[\(.*NIGHT_CHOGHADIYA_START.*\+.*\)\s*%\s*7\]/);
  });
});

describe('Audit P5g.4 (#29): kaala.ts rule routes through helper', () => {
  const src = repoFile('src/lib/muhurta/engine/rules/kaala.ts');

  it('imports chogTypeAtDaySlot, not the raw constants', () => {
    expect(src).toMatch(/chogTypeAtDaySlot[\s\S]*from\s+['"]@\/lib\/constants\/choghadiya['"]/);
    expect(src).not.toMatch(/DAY_CHOGHADIYA_START as CHOGHADIYA_DAY_START/);
    expect(src).not.toMatch(/import\s+\{[^}]*CHOGHADIYA_TYPES[^}]*\}\s+from\s+['"]@\/lib\/constants\/choghadiya['"]/);
  });

  it('no inline lookup expression remains', () => {
    expect(src).not.toMatch(/CHOGHADIYA_TYPES\[\(\s*startIdx\s*\+\s*slotIdx\s*\)\s*%\s*7\]/);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 3 — #30 KP dasha — already resolved by Phase 4b (#442)
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5g.5 (#30): KP sub-lords already imports canonical', () => {
  const src = repoFile('src/lib/kp/sub-lords.ts');

  it('imports VIMSHOTTARI_YEARS + DASHA_ORDER_IDS from canonical', () => {
    expect(src).toMatch(/VIMSHOTTARI_YEARS[\s\S]*from\s+['"]@\/lib\/constants\/nakshatras['"]/);
    expect(src).toMatch(/DASHA_ORDER_IDS[\s\S]*from\s+['"]@\/lib\/constants\/nakshatras['"]/);
  });

  it('no local [7, 20, 6, 10, 7, 18, 16, 19, 17] constant remains', () => {
    // The exact 9-element Vimshottari years cycle must not be redeclared
    // as a local const anywhere in this file.
    expect(src).not.toMatch(/const\s+[A-Z_]+\s*=\s*\[\s*7\s*,\s*20\s*,\s*6\s*,\s*10\s*,\s*7\s*,\s*18\s*,\s*16\s*,\s*19\s*,\s*17\s*\]/);
  });
});
