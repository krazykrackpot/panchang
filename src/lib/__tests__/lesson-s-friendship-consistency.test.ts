/**
 * Lesson-S consistency test — natural friendship (Naisargika Maitri)
 *
 * Two inline copies of the GRAHA_MAITRI matrix exist outside the canonical
 * PLANET_FRIENDSHIPS table:
 *
 *   - src/lib/matching/ashta-kuta.ts:183
 *   - src/lib/comparison/synastry-engine.ts:13
 *
 * Both are correct as of 2026-06-05 (audited row-by-row). This test enforces
 * the invariant going forward: any future edit to either inline matrix that
 * diverges from canonical PLANET_FRIENDSHIPS will fail CI.
 *
 * Per CLAUDE.md Lesson S — "Canonical BPHS tables defined once and
 * cross-checked everywhere. The majority reading is almost always right; a
 * single outlier is the bug." Tests like this codify that majority reading
 * so a future audit doesn't have to re-derive it.
 *
 * Audit angle 1, 2026-06-05.
 */

import { describe, it, expect } from 'vitest';
import { PLANET_FRIENDSHIPS } from '@/lib/constants/friendships';

// ────────────────────────────────────────────────────────────────────────────
// Derive expected GRAHA_MAITRI matrix from canonical PLANET_FRIENDSHIPS.
// Matrix convention: 0=enemy, 1=neutral, 2=friend.
// Self always = 2 (own sign treated as friend by Ashta Kuta convention).
// ────────────────────────────────────────────────────────────────────────────
function deriveExpectedMatrix(): Record<number, Record<number, number>> {
  const matrix: Record<number, Record<number, number>> = {};
  for (let p = 0; p <= 6; p++) {
    matrix[p] = {};
    const entry = PLANET_FRIENDSHIPS[p];
    if (!entry) continue;
    for (let q = 0; q <= 6; q++) {
      if (p === q) {
        matrix[p][q] = 2;
      } else if (entry.friends.includes(q)) {
        matrix[p][q] = 2;
      } else if (entry.enemies.includes(q)) {
        matrix[p][q] = 0;
      } else {
        matrix[p][q] = 1;
      }
    }
  }
  return matrix;
}

// ────────────────────────────────────────────────────────────────────────────
// 1 — ashta-kuta.ts inline matrix matches canonical
// ────────────────────────────────────────────────────────────────────────────
describe('Lesson-S — ashta-kuta GRAHA_MAITRI consistency', () => {
  it('every row+column agrees with PLANET_FRIENDSHIPS', async () => {
    const mod = await import('@/lib/matching/ashta-kuta');
    // GRAHA_MAITRI is a private const in ashta-kuta.ts. We exercise it
    // through the public computeAshtaKuta API: for each (p, q) graha
    // pair, build a contrived matching where boy & girl Moon rashis are
    // ruled by exactly those planets, and assert the Graha Maitri kuta
    // score matches the expected friendship-derived score.
    //
    // Rashi lord mapping (1-based rashi → planet ID):
    //   Aries=Mars(2), Taurus=Venus(5), Gemini=Mercury(3), Cancer=Moon(1),
    //   Leo=Sun(0), Virgo=Mercury(3), Libra=Venus(5), Scorpio=Mars(2),
    //   Sagittarius=Jupiter(4), Capricorn=Saturn(6), Aquarius=Saturn(6),
    //   Pisces=Jupiter(4)
    const PLANET_TO_RASHI: Record<number, number> = {
      0: 5,  // Sun → Leo
      1: 4,  // Moon → Cancer
      2: 1,  // Mars → Aries
      3: 3,  // Mercury → Gemini
      4: 9,  // Jupiter → Sagittarius
      5: 2,  // Venus → Taurus
      6: 10, // Saturn → Capricorn
    };
    const expected = deriveExpectedMatrix();

    // Expected Graha Maitri kuta score from friendship sum:
    //   bothFriend (4)=5, friend+neutral (3)=4, bothNeutral (2)=3,
    //   neutral+enemy (1)=1, bothEnemy (0)=0
    function expectedKuta(bl: number, gl: number): number {
      if (bl === gl) return 5;
      const sum = expected[bl][gl] + expected[gl][bl];
      if (sum >= 4) return 5;
      if (sum === 3) return 4;
      if (sum === 2) return 3;
      if (sum === 1) return 1;
      return 0;
    }

    for (let bl = 0; bl <= 6; bl++) {
      for (let gl = 0; gl <= 6; gl++) {
        const boyRashi = PLANET_TO_RASHI[bl];
        const girlRashi = PLANET_TO_RASHI[gl];
        const result = mod.computeAshtaKuta(
          { moonNakshatra: 1, moonRashi: boyRashi },
          { moonNakshatra: 1, moonRashi: girlRashi },
        );
        // Kuta `name` is a Trilingual object { en, hi, sa } — match on .en.
        const grahaMaitriKuta = result.kutas.find((k) => {
          const n = k.name as unknown as { en?: string } | string;
          return typeof n === 'string' ? n === 'Graha Maitri' : n?.en === 'Graha Maitri';
        });
        expect(grahaMaitriKuta, `Graha Maitri kuta missing for bl=${bl} gl=${gl}`).toBeDefined();
        expect(
          grahaMaitriKuta!.scored,
          `ashta-kuta divergence: Graha Maitri for ${bl}↔${gl} expected ${expectedKuta(bl, gl)} got ${grahaMaitriKuta!.scored}`,
        ).toBe(expectedKuta(bl, gl));
      }
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 2 — synastry-engine.ts inline matrix matches canonical
// ────────────────────────────────────────────────────────────────────────────
describe('Lesson-S — synastry-engine GRAHA_MAITRI consistency', () => {
  it('getFriendshipLabel level agrees with PLANET_FRIENDSHIPS for every pair', async () => {
    const mod = await import('@/lib/comparison/synastry-engine');
    const expected = deriveExpectedMatrix();

    // synastry-engine averages BOTH directions (per BPHS Panchadha Maitri),
    // same logic as ashta-kuta. Expected level:
    //   combined ≥ 3 → 2 (Friend)
    //   combined = 2 → 1 (Neutral)
    //   else        → 0 (Enemy)
    function expectedLevel(a: number, b: number): number {
      if (a === b) return 2;
      const sum = expected[a][b] + expected[b][a];
      if (sum >= 3) return 2;
      if (sum === 2) return 1;
      return 0;
    }

    for (let a = 0; a <= 6; a++) {
      for (let b = 0; b <= 6; b++) {
        const res = mod.getFriendshipLabel(a, b);
        expect(
          res.level,
          `synastry-engine divergence: friendship(${a}, ${b}) expected level ${expectedLevel(a, b)} got ${res.level}`,
        ).toBe(expectedLevel(a, b));
      }
    }
  });

  it('Rahu (7) and Ketu (8) collapse to Saturn (6) behaviour', async () => {
    const mod = await import('@/lib/comparison/synastry-engine');
    // Rahu vs anyone should equal Saturn vs that planet (per the module's
    // own collapse-to-Saturn convention, ashta-kuta.ts line 28-30).
    for (let p = 0; p <= 6; p++) {
      const rahuRes = mod.getFriendshipLabel(7, p);
      const ketuRes = mod.getFriendshipLabel(8, p);
      const satRes = mod.getFriendshipLabel(6, p);
      // Rahu === Saturn (per the synastry-engine collapse rule)
      expect(rahuRes.level, `Rahu(7)↔${p} should match Saturn(6)↔${p}`).toBe(satRes.level);
      // Ketu === Saturn (the same collapse — comment says "Rahu/Ketu use Saturn")
      expect(ketuRes.level, `Ketu(8)↔${p} should match Saturn(6)↔${p}`).toBe(satRes.level);
    }
  });
});

// ────────────────────────────────────────────────────────────────────────────
// 3 — Lesson-S canonical spot-checks (regression guards)
// ────────────────────────────────────────────────────────────────────────────
describe('Lesson-S — canonical spot-checks (regression guards)', () => {
  it('Moon friends = [Sun, Mercury], NOT Jupiter (Lesson S)', () => {
    expect(PLANET_FRIENDSHIPS[1].friends).toEqual([0, 3]);
    expect(PLANET_FRIENDSHIPS[1].friends).not.toContain(4); // Jupiter
  });

  it('Moon enemies = NONE (Lesson S, BPHS Ch.3)', () => {
    expect(PLANET_FRIENDSHIPS[1].enemies).toEqual([]);
  });

  it('Jupiter enemies = [Mercury, Venus]; Saturn is NEUTRAL (Lesson S)', () => {
    expect(PLANET_FRIENDSHIPS[4].enemies).toEqual([3, 5]);
    expect(PLANET_FRIENDSHIPS[4].enemies).not.toContain(6); // Saturn
    expect(PLANET_FRIENDSHIPS[4].neutral).toContain(6);     // Saturn IS neutral
  });

  it('Mercury friends = [Sun, Venus]; NOT Moon/Jupiter/Saturn (Lesson S)', () => {
    expect(PLANET_FRIENDSHIPS[3].friends).toEqual([0, 5]);
    expect(PLANET_FRIENDSHIPS[3].friends).not.toContain(1); // Moon
    expect(PLANET_FRIENDSHIPS[3].friends).not.toContain(4); // Jupiter
    expect(PLANET_FRIENDSHIPS[3].friends).not.toContain(6); // Saturn
  });

  it('Rahu(7) mirrors Saturn(6); Ketu(8) mirrors Mars(2)', () => {
    expect(PLANET_FRIENDSHIPS[7].friends).toEqual(PLANET_FRIENDSHIPS[6].friends);
    expect(PLANET_FRIENDSHIPS[7].enemies).toEqual(PLANET_FRIENDSHIPS[6].enemies);
    expect(PLANET_FRIENDSHIPS[8].friends).toEqual(PLANET_FRIENDSHIPS[2].friends);
    expect(PLANET_FRIENDSHIPS[8].enemies).toEqual(PLANET_FRIENDSHIPS[2].enemies);
  });

  it('all 7 graha rows are total (friends + enemies + neutral cover the other 6 planets)', () => {
    for (let p = 0; p <= 6; p++) {
      const entry = PLANET_FRIENDSHIPS[p];
      const total = new Set([...entry.friends, ...entry.enemies, ...entry.neutral]);
      // Must cover the other 6 planets (0..6 minus self)
      expect(total.size, `planet ${p} row leaves planets uncategorised`).toBe(6);
      expect(total.has(p), `planet ${p} should NOT classify itself`).toBe(false);
    }
  });
});
