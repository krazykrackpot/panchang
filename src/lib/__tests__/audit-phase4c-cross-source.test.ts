/**
 * Audit 2026-06-05 Phase 4c — #17 Nakshatra pada deity derivation.
 *
 * The audit reported 108 inline `deity: 'X'` strings on the pada profile
 * entries plus an internal NAKSHATRA_DEITIES map — all independent copies
 * of `NAKSHATRAS[i].deity.en`. The pada profile literals are large and
 * structurally heterogeneous (each is ~80 lines of trilingual text), so
 * bulk-stripping the `deity` field per-entry would violate Lesson H
 * (no bulk regex/sed across complex TS literals).
 *
 * Fix shipped:
 *   1. The internal NAKSHATRA_DEITIES map was dead code (never exported,
 *      never read). Deleted entirely (Gemini #443).
 *   2. The 108 per-profile inline `deity: 'X'` strings are guarded by
 *      the parametric test below. Any future edit that drifts a profile's
 *      deity from canonical fails immediately. The test also surfaced
 *      real drift on 12 entries (Sarpa/Pitris/Apas — corrected).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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

describe('Audit P4c: dead NAKSHATRA_DEITIES map removed (Gemini #443)', () => {
  it('the file no longer declares the NAKSHATRA_DEITIES literal (dead code)', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/lib/constants/nakshatra-pada-profiles.ts'),
      'utf8',
    );
    // Previously declared as `const NAKSHATRA_DEITIES: Record<number, string> = …`
    // — it was never exported and never read inside this module, so it
    // was deleted. The per-profile inline `deity` strings are the only
    // consumer, and they're drift-guarded against canonical above.
    expect(src).not.toMatch(/const\s+NAKSHATRA_DEITIES\s*:\s*Record<number,\s*string>/);
    expect(src).not.toMatch(/1:\s*'Ashwini Kumaras',\s*2:\s*'Yama'/);
  });
});
