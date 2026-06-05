/**
 * Audit 2026-06-05 Phase 5a — surgical cleanups.
 *
 *   - #20 Naive birthdate parse in tippanni-engine.ts:1441. Was
 *     `new Date(date + 'T00:00:00')` (local TZ); now
 *     `new Date(date + 'T00:00:00Z')` (UTC). Lesson L.
 *   - #24 Tatkalika friend houses inline in tippanni/dignity.ts. Now
 *     imported from src/lib/constants/friendships.ts as
 *     TATKALIKA_FRIEND_HOUSES.
 *   - #25 Rashi-element inline 13-entry array in matching/detailed-
 *     report.ts. Replaced with modular derivation
 *     `RASHI_ELEMENT_CYCLE[(s - 1) % 4]`.
 *   - #28 Empty browser-storage catches in birth-data-store.ts and
 *     PersonalEclipseInsight.tsx now log via `console.warn`.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TATKALIKA_FRIEND_HOUSES } from '@/lib/constants/friendships';

const repoFile = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

// ───────────────────────────────────────────────────────────────────────────
// 1 — #24: canonical Tatkalika friend houses
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5a.1 (#24): Tatkalika friend houses canonical', () => {
  it('TATKALIKA_FRIEND_HOUSES === [2, 3, 4, 10, 11, 12] per BPHS Ch.3', () => {
    expect([...TATKALIKA_FRIEND_HOUSES]).toEqual([2, 3, 4, 10, 11, 12]);
  });

  it('dignity.ts imports + uses the canonical constant (no inline array)', () => {
    const src = repoFile('src/lib/tippanni/dignity.ts');
    // `[\s\S]*` (not `.*`) so Prettier line-wrapping the import doesn't
    // break this check — Gemini P5a comment.
    expect(src).toMatch(/TATKALIKA_FRIEND_HOUSES[\s\S]*friendships/);
    expect(src).toMatch(/TATKALIKA_FRIEND_HOUSES\.includes\(dist\)/);
    expect(src).not.toMatch(/const tempFriendHouses = \[2,\s*3,\s*4,\s*10,\s*11,\s*12\]/);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 2 — #25: matching detailed-report element derivation
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5a.2 (#25): rashi-element modular derivation', () => {
  const src = repoFile('src/lib/matching/detailed-report.ts');

  it('no longer has the 13-entry inline element array', () => {
    expect(src).not.toMatch(/const elements = \[''\s*,\s*'fire'\s*,\s*'earth'/);
  });

  it('uses the 4-element cycle + modular derivation', () => {
    expect(src).toMatch(/RASHI_ELEMENT_CYCLE\s*=\s*\['fire',\s*'earth',\s*'air',\s*'water'\]/);
    expect(src).toMatch(/RASHI_ELEMENT_CYCLE\[\(s\s*-\s*1\)\s*%\s*4\]/);
  });

  it('NaN-safe guard present (`!s` covers NaN/null/undefined/0)', () => {
    // NaN < 1 === false, NaN > 12 === false — bounds check alone leaks NaN
    // through, producing undefined → two undefined elements compare equal
    // and falsely report compatibility. Guard now uses `!s` first.
    expect(src).toMatch(/if\s*\(\s*!s\s*\|\|\s*s\s*<\s*1\s*\|\|\s*s\s*>\s*12\s*\)\s*return\s*''/);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 3 — #20: birthdate parsed as UTC, not naive-local
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5a.3 (#20): tippanni-engine birthdate parse uses Z suffix', () => {
  const src = repoFile('src/lib/kundali/tippanni-engine.ts');

  it('appends Z (UTC midnight) — Lesson L', () => {
    expect(src).toMatch(/new Date\(kundali\.birthData\.date \+ ['"]T00:00:00Z['"]\)/);
    expect(src).not.toMatch(/new Date\(kundali\.birthData\.date \+ ['"]T00:00:00['"]\)/);
  });

  it('life-stage downstream uses .getTime() (TZ-agnostic) — no UTC-method bug', () => {
    // Gemini P5a flagged: if the consumer used getFullYear/getMonth/getDate,
    // UTC-midnight birthdates would shift back a day on UTC-negative servers.
    // `getLifeStageContext` only uses getTime() deltas, so it's safe. This
    // test locks in that property — if someone adds calendar-component
    // logic later, they must pick the UTC variants.
    const ls = repoFile('src/lib/kundali/life-stage.ts');
    expect(ls).toMatch(/birthDate\.getTime\(\)/);
    expect(ls).not.toMatch(/birthDate\.getFullYear\(\)/);
    expect(ls).not.toMatch(/birthDate\.getMonth\(\)/);
    expect(ls).not.toMatch(/birthDate\.getDate\(\)/);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 4 — #28: storage-guard catches now log via console.warn
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5a.4 (#28): browser-storage empty catches now log', () => {
  it('birth-data-store.ts clearBirthData logs storage failure', () => {
    const src = repoFile('src/stores/birth-data-store.ts');
    expect(src).not.toMatch(/localStorage\.removeItem\(STORAGE_KEY\);\s*\}\s*catch\s*\{\}/);
    expect(src).toMatch(/\[birth-data-store\] localStorage\.removeItem failed:/);
  });

  it('PersonalEclipseInsight.tsx sessionStorage logs failure', () => {
    const src = repoFile('src/components/eclipses/PersonalEclipseInsight.tsx');
    expect(src).not.toMatch(/sessionStorage\.setItem\([^)]+\);\s*\}\s*catch\s*\{\}/);
    expect(src).toMatch(/\[PersonalEclipseInsight\] sessionStorage cache failed:/);
  });
});
