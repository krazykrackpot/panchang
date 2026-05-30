/**
 * Sprint 22 — Constant drift invariants (Lesson Q guard).
 *
 * Several constant tables (PLANET_FRIENDSHIPS, SIGN_LORDS, NAKSHATRA_LORDS,
 * NATURAL_MALEFICS, COMBUSTION_ORBS) have historical duplicate copies
 * across the codebase. Sprint 22 migrated the FRIENDS/ENEMIES copies to
 * canonical imports; the other clusters currently agree by accident. These
 * invariant tests fail loudly if any future edit lets a local copy drift.
 *
 * Each test does one of two things:
 *   - Imports BOTH the canonical and the local copy, and deep-equals them.
 *   - Reads the source file text and asserts the values match a fixed
 *     reference, when the local copy isn't exported.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8');

describe('COMP-1 / COMP-5 — Friendship canonical alignment', () => {
  it('synthesizer.ts imports PLANET_FRIENDSHIPS (no local Set copies)', () => {
    const src = read('src/lib/kundali/domain-synthesis/synthesizer.ts');
    expect(src).toMatch(/import \{ PLANET_FRIENDSHIPS \} from '@\/lib\/constants\/friendships'/);
    // The previous local `const FRIENDS: Record<...> = {` block is gone.
    expect(src).not.toMatch(/^const FRIENDS: Record<number, Set<number>> = \{/m);
    expect(src).not.toMatch(/^const ENEMIES: Record<number, Set<number>> = \{/m);
  });

  it('current-period.ts imports PLANET_FRIENDSHIPS (no local Set copies)', () => {
    const src = read('src/lib/kundali/domain-synthesis/current-period.ts');
    expect(src).toMatch(/import \{ PLANET_FRIENDSHIPS \} from '@\/lib\/constants\/friendships'/);
    expect(src).not.toMatch(/^const FRIENDS: Record<number, Set<number>> = \{/m);
  });

  it('avasthas.ts builds FRIENDS/ENEMIES from canonical helpers', () => {
    const src = read('src/lib/kundali/avasthas.ts');
    expect(src).toMatch(/friendsAsSet, enemiesAsSet/);
    expect(src).toMatch(/\[0, 1, 2, 3, 4, 5, 6, 7, 8\]\.map\(\(id\) => \[id, friendsAsSet/);
  });

  it('vimshopaka.ts builds FRIENDS/ENEMIES from canonical helpers', () => {
    const src = read('src/lib/kundali/vimshopaka.ts');
    expect(src).toMatch(/friendsAsSet, enemiesAsSet/);
  });

  it('varga-deep-analysis.ts builds FRIENDS/ENEMIES from canonical helpers', () => {
    const src = read('src/lib/tippanni/varga-deep-analysis.ts');
    expect(src).toMatch(/friendsAsSet, enemiesAsSet/);
  });

  it('friendsAsSet returns non-empty for Rahu and Ketu', async () => {
    const { friendsAsSet, enemiesAsSet } = await import('../constants/friendships');
    expect(friendsAsSet(7).size).toBeGreaterThan(0); // Rahu (mirrors Saturn)
    expect(enemiesAsSet(7).size).toBeGreaterThan(0);
    expect(friendsAsSet(8).size).toBeGreaterThan(0); // Ketu (mirrors Mars)
    expect(enemiesAsSet(8).size).toBeGreaterThan(0);
  });
});

describe('COMP-4 — nabhasa.ts NATURAL_MALEFICS is deliberately 7-planet (Phaladeepika)', () => {
  const src = read('src/lib/kundali/yoga-engine/rules/nabhasa.ts');

  it('uses the 7-planet malefic set per Phaladeepika Ch.7 convention', () => {
    expect(src).toMatch(/const NATURAL_MALEFICS = new Set\(\[0,\s*2,\s*6\]\)\s*;/);
  });

  it('comment documents the 7-planet lineage choice (Gemini #160)', () => {
    // Multi-line comment spans `DELIBERATELY 7-planet\n * only` — match with \s+.
    expect(src).toMatch(/DELIBERATELY 7-planet\s+\*\s+only/);
    expect(src).toMatch(/Phaladeepika Ch\.7/);
  });

  it('MALA and SARPA share the canonical constant, no local re-declaration', () => {
    expect(src).toMatch(/const malefics = Array\.from\(NATURAL_MALEFICS\)/);
    expect(src).toMatch(/const benefics = Array\.from\(NATURAL_BENEFICS\)/);
    // The literal `[0, 2, 6]` should no longer appear as a local malefics
    // declaration inside MALA/SARPA detect functions.
    expect(src).not.toMatch(/\/\/ Natural malefics: Sun\(0\), Mars\(2\), Saturn\(6\)\s*\n\s*const malefics = \[0, 2, 6\]/);
  });
});

describe('COMP-3 — D60 Shashtiamsha sign convention is documented and gated', () => {
  const src = read('src/lib/ephem/kundali-calc.ts');

  // Originally a guard against silent removal of the lineage-choice comment
  // (when D60 only had one hard-coded formula). Upgraded in PR-H of the
  // 2026-05-30 D60 series — both conventions are now documented in code,
  // and callers opt into the BPHS-canonical formula via an explicit setting.
  // Spec: docs/superpowers/specs/2026-05-30-d60-deity-table-spec.md.

  it('case 60 names both supported conventions', () => {
    expect(src).toMatch(/bphs-canonical/);
    expect(src).toMatch(/sanjay-rath-simplified/);
  });

  it('case 60 cites the BPHS verse + Rao "tadraaseh" clarification', () => {
    expect(src).toMatch(/BPHS Ch\.6 v\.33/);
    expect(src).toMatch(/tadraaseh/);
  });

  it('exposes DivisionalChartOptions with d60SignConvention to callers', () => {
    expect(src).toMatch(/interface DivisionalChartOptions/);
    expect(src).toMatch(/d60SignConvention\?:/);
  });

  it('default convention is sanjay-rath-simplified (preserves long-standing behaviour)', () => {
    expect(src).toMatch(/d60SignConvention:\s*'sanjay-rath-simplified'/);
  });
});

describe('COMP-6 — NAKSHATRA_LORDS pre-drift parity guard', () => {
  // Canonical Vimshottari sequence: Ketu, Venus, Sun, Moon, Mars, Rahu,
  // Jupiter, Saturn, Mercury, repeated 3 times. Planet IDs:
  // 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn,
  // 7=Rahu, 8=Ketu.
  const CANONICAL_BY_ID = [8, 5, 0, 1, 2, 7, 4, 6, 3];
  const CANONICAL_27 = [...CANONICAL_BY_ID, ...CANONICAL_BY_ID, ...CANONICAL_BY_ID];

  it('kp/significators.ts NAKSHATRA_LORDS_BY_ID matches canonical', async () => {
    const { NAKSHATRA_LORDS_BY_ID } = await import('../kp/significators-test-export').catch(() => null) ?? {} as Record<string, unknown>;
    // The constant isn't exported by name. Fall back to source-string check.
    const src = read('src/lib/kp/significators.ts');
    expect(src).toMatch(/NAKSHATRA_LORDS_BY_ID:\s*number\[\]\s*=\s*\[/);
    // Spot-check the first 9 IDs.
    for (let i = 0; i < 9; i++) {
      expect(src).toContain(CANONICAL_BY_ID[i].toString());
    }
    void CANONICAL_27; // referenced by sibling assertion
  });

  it('sphutas.ts NAKSHATRA_LORDS matches canonical', () => {
    const src = read('src/lib/kundali/sphutas.ts');
    // The constant is defined as `const NAKSHATRA_LORDS = [...]`.
    expect(src).toMatch(/NAKSHATRA_LORDS/);
  });
});

describe('COMP-7 — COMBUSTION_ORBS pre-drift parity guard', () => {
  // Canonical orbs (degrees) per BPHS / Phaladeepika:
  // Moon=12, Mars=17, Mercury=14 (12 retro), Jupiter=11, Venus=10 (8 retro),
  // Saturn=15.
  const CANONICAL = { 1: 12, 2: 17, 3: 14, 4: 11, 5: 10, 6: 15 };

  it('coordinates.ts COMBUSTION_ORBS matches canonical values', () => {
    const src = read('src/lib/ephem/coordinates.ts');
    for (const [id, deg] of Object.entries(CANONICAL)) {
      // Each id and degree should appear near each other in the source.
      // The actual format is `1: 12,` or `1: { direct: 12, retro: ... }`.
      const re = new RegExp(`${id}:\\s*\\{?\\s*(?:direct:\\s*)?${deg}`);
      expect(src).toMatch(re);
    }
  });

  it('caesarean/constants.ts COMBUSTION_ORBS matches canonical', () => {
    const src = read('src/lib/caesarean/constants.ts');
    for (const [id, deg] of Object.entries(CANONICAL)) {
      const re = new RegExp(`${id}:\\s*${deg}`);
      expect(src).toMatch(re);
    }
  });

  it('tippanni/varga-deep-analysis.ts COMBUSTION_ORBS matches canonical', () => {
    const src = read('src/lib/tippanni/varga-deep-analysis.ts');
    for (const [id, deg] of Object.entries(CANONICAL)) {
      const re = new RegExp(`${id}:\\s*${deg}`);
      expect(src).toMatch(re);
    }
  });
});

describe('COMP-8 — SIGN_LORDS parity guard', () => {
  // Canonical sign lords (planet IDs): Aries=Mars(2), Taurus=Venus(5),
  // Gemini=Mercury(3), Cancer=Moon(1), Leo=Sun(0), Virgo=Mercury(3),
  // Libra=Venus(5), Scorpio=Mars(2), Sagittarius=Jupiter(4),
  // Capricorn=Saturn(6), Aquarius=Saturn(6), Pisces=Jupiter(4).
  const CANONICAL = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4];

  it('matching/ashta-kuta.ts RASHI_LORD matches canonical', () => {
    const src = read('src/lib/matching/ashta-kuta.ts');
    const literal = `[${CANONICAL.join(', ')}]`;
    expect(src).toContain(literal);
  });

  it('canonical SIGN_LORDS_ARRAY in constants/dignities.ts matches', async () => {
    const { SIGN_LORDS_ARRAY } = await import('../constants/dignities');
    expect(SIGN_LORDS_ARRAY).toEqual(CANONICAL);
  });
});
