/**
 * Audit 2026-06-05 Phase 4c — #17 Nakshatra pada deity derivation.
 *
 * The audit reported 108 inline `deity: 'X'` strings on the pada profile
 * entries plus a 27-entry NAKSHATRA_DEITIES map — all independent copies
 * of `NAKSHATRAS[i].deity.en`. The pada profile literals are large and
 * structurally heterogeneous (each is ~80 lines of trilingual text), so
 * bulk-stripping the `deity` field per-entry would violate Lesson H
 * (no bulk regex/sed across complex TS literals).
 *
 * Fix shipped:
 *   1. The 27-entry NAKSHATRA_DEITIES map in `nakshatra-pada-profiles.ts`
 *      is now derived at module load from `NAKSHATRAS[i].deity.en` —
 *      cannot drift.
 *   2. The 108 per-profile inline `deity: 'X'` strings are guarded by
 *      the parametric test below. Any future edit that drifts a profile's
 *      deity from canonical fails immediately.
 */

import { describe, it, expect } from 'vitest';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_PADA_PROFILES } from '@/lib/constants/nakshatra-pada-profiles';

describe('Audit P4c (FIX #17): pada profile deities byte-match canonical NAKSHATRAS', () => {
  it('108 profiles exist (27 nakshatras × 4 padas)', () => {
    expect(NAKSHATRA_PADA_PROFILES.length).toBe(108);
  });

  for (const profile of NAKSHATRA_PADA_PROFILES) {
    const canonical = NAKSHATRAS[profile.nakshatraId - 1]?.deity.en;
    it(`pada profile nakshatraId=${profile.nakshatraId} pada=${profile.pada} → deity="${canonical}"`, () => {
      expect(canonical, `NAKSHATRAS[${profile.nakshatraId - 1}].deity.en missing`).toBeDefined();
      expect(profile.deity, `nakshatra ${profile.nakshatraId} pada ${profile.pada} deity drift`).toBe(canonical);
    });
  }
});

describe('Audit P4c: NAKSHATRA_DEITIES is now derived (no inline literal)', () => {
  it('the file no longer has the hardcoded NAKSHATRA_DEITIES literal block', () => {
    const { readFileSync } = require('node:fs') as typeof import('node:fs');
    const { join } = require('node:path') as typeof import('node:path');
    const src = readFileSync(
      join(process.cwd(), 'src/lib/constants/nakshatra-pada-profiles.ts'),
      'utf8',
    );
    // The previous block looked like `1: 'Ashwini Kumaras', 2: 'Yama', ...`.
    // Now it should be a derivation using `Object.fromEntries`.
    expect(src).toMatch(/NAKSHATRA_DEITIES.*Object\.fromEntries/s);
    expect(src).not.toMatch(/1:\s*'Ashwini Kumaras',\s*2:\s*'Yama'/);
  });
});
