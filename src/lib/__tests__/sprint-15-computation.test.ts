/**
 * Sprint 15 — P2 computation cluster invariants.
 *
 * Locks in:
 *   - P2-31 Mahabhagya frequency (tightened from ~12% → ~6% per variant)
 *   - P2-32 Dhana Yoga tertiary removed from `present` gate
 *   - P2-33 Friendship table canonical + Rahu/Ketu rows fixed
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) =>
  readFileSync(join(process.cwd(), rel), 'utf8');

describe('Sprint 15 — P2-33 friendship table canonical + correct', () => {
  // The canonical file: it's the source of truth for all three consumers.
  // The Sprint-15 fix put the Rahu/Ketu rows right. We re-import the
  // module to verify the runtime values too.
  it('the canonical file defines PLANET_FRIENDSHIPS with the corrected Rahu/Ketu rows', async () => {
    const { PLANET_FRIENDSHIPS } = await import('@/lib/constants/friendships');

    // Rahu (7) mirrors Saturn (6) — friends [3, 5], enemies [0, 1, 2].
    // The panchavargeya bug had `friends: [3, 5, 6]` (added Saturn itself).
    expect(PLANET_FRIENDSHIPS[7]).toEqual({
      friends: [3, 5],
      enemies: [0, 1, 2],
      neutral: [4],
    });

    // Ketu (8) mirrors Mars (2) — friends [0, 1, 4] (Mars's friends).
    // The panchavargeya bug had `friends: [0, 1, 2]` (Mars itself by typo).
    expect(PLANET_FRIENDSHIPS[8]).toEqual({
      friends: [0, 1, 4],
      enemies: [3],
      neutral: [5, 6],
    });

    // Sanity: Sun/Saturn rows match BPHS canonical values.
    expect(PLANET_FRIENDSHIPS[0]).toEqual({
      friends: [1, 2, 4],
      enemies: [5, 6],
      neutral: [3],
    });
    expect(PLANET_FRIENDSHIPS[6]).toEqual({
      friends: [3, 5],
      enemies: [0, 1, 2],
      neutral: [4],
    });
  });

  // All three consumers must now import the canonical table, NOT carry
  // their own copy.

  it('src/lib/remedies/gemstone-data.ts imports from @/lib/constants/friendships', () => {
    const src = read('src/lib/remedies/gemstone-data.ts');
    expect(src).toMatch(/from\s+['"]@\/lib\/constants\/friendships['"]/);
    // Local literal table must be gone (one line per planet inside `const FRIENDSHIP...= {`)
    expect(src).not.toMatch(/0:\s*\{\s*friends:\s*\[1,\s*2,\s*4\][\s\S]*?6:\s*\{\s*friends:\s*\[3,\s*5\]/);
  });

  it('src/lib/tippanni/dignity.ts imports from @/lib/constants/friendships', () => {
    const src = read('src/lib/tippanni/dignity.ts');
    expect(src).toMatch(/from\s+['"]@\/lib\/constants\/friendships['"]/);
    // Local literal table (with `neutrals` field) must be gone.
    expect(src).not.toMatch(/0:\s*\{\s*friends:[^}]*neutrals:/);
  });

  it('src/lib/kundali/panchavargeya-bala.ts imports from @/lib/constants/friendships', () => {
    const src = read('src/lib/kundali/panchavargeya-bala.ts');
    expect(src).toMatch(/from\s+['"]@\/lib\/constants\/friendships['"]/);
    // Old buggy literals must be gone.
    expect(src).not.toMatch(/friends:\s*\[3,\s*5,\s*6\]/);   // Rahu bug
    expect(src).not.toMatch(/friends:\s*\[0,\s*1,\s*2\]\s*\}/); // Ketu bug
  });
});

describe('Sprint 15 — P2-31 Mahabhagya now gates on day/night birth', () => {
  const src = read('src/lib/kundali/yogas-complete.ts');

  it('detects BOTH male (odd + day) and female (even + night) variants', () => {
    expect(src).toMatch(/mbMalePresent\s*=\s*allOdd\s*&&\s*isDayBirth/);
    expect(src).toMatch(/mbFemalePresent\s*=\s*allEven\s*&&\s*isNightBirth/);
    expect(src).toMatch(/const mbPresent = mbMalePresent \|\| mbFemalePresent/);
  });

  it('uses Sun.house for the day/night gate (above-horizon = day, below = night)', () => {
    expect(src).toMatch(/isDayBirth\s*=\s*sun\.house\s*>=\s*7\s*&&\s*sun\.house\s*<=\s*12/);
    expect(src).toMatch(/isNightBirth\s*=\s*sun\.house\s*>=\s*1\s*&&\s*sun\.house\s*<=\s*6/);
  });

  it('the old shape (all-odd-only, no gate) is gone', () => {
    // The smoking-gun for the previous over-detection.
    expect(src).not.toMatch(/const mbPresent = oddSigns\.includes\(ascSign\)/);
  });
});

describe('Sprint 15 — P2-32 Dhana Yoga tertiary branch removed from present gate', () => {
  const src = read('src/lib/kundali/yogas-complete.ts');

  it('dhanaPresent only fires on lord-relationships (primary OR secondary)', () => {
    // The benefic-in-wealth-house branch must NOT be part of the present
    // gate any more. Old: `dhanaPresent = dhanaLordRelated || dhana59 || dhanaBeneficInWealth`.
    expect(src).toMatch(/const dhanaPresent = dhanaLordRelated \|\| dhana59;/);
    expect(src).not.toMatch(/dhanaPresent = dhanaLordRelated \|\| dhana59 \|\| dhanaBeneficInWealth/);
  });

  it('benefic-in-wealth-house is still computed and used only for strength boost', () => {
    // The signal still exists; it just no longer triggers detection on
    // its own. Renamed `dhanaBeneficInWealth` → `beneficInWealth`.
    expect(src).toMatch(/const beneficInWealth = \[2, 11\]\.includes\(jupiter\.house\)/);
    // Strength formula uses it (Gemini-simplified to a nested ternary
    // where dhanaPresent gates the strong/moderate choice):
    expect(src).toMatch(
      /dhanaPresent\s*\?\s*\(beneficInWealth\s*\?\s*'Strong'\s*:\s*'Moderate'\)\s*:\s*'Weak'/,
    );
  });
});
