/**
 * Lajjitadi Avastha — classical aspect + Mercury conditional regression
 *
 * Covers the 2026-05-30 alignment fix (spec:
 * docs/superpowers/specs/2026-05-30-jyotish-classical-alignment.md).
 *
 *   1. Saturn's 3rd/10th, Mars's 4th/8th, Jupiter's 5th/9th special aspects
 *      now flow through Lajjitadi's malefic/benefic aspect checks.
 *   2. Mercury is reclassified as malefic when conjunct any of
 *      {Sun, Mars, Saturn, Rahu, Ketu} per BPHS Ch.3.
 *
 * Test design: every scenario specifies ALL 9 planets. "Inert" planets are
 * parked at houses that, by Parashari aspect geometry, neither conjunct nor
 * aspect the test target. Choosing safe houses for a given target:
 *   target h5: safe houses are 4, 6, 7, 12
 *   target h8: safe houses are 3, 7, 9, 10
 *   target h1: safe houses are 2, 5, 6, 11
 */

import { describe, it, expect } from 'vitest';
import { calculateAvasthas } from '../avasthas';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { GRAHAS } from '@/lib/constants/grahas';
import type { PlanetPosition } from '@/types/kundali';

function p(opts: {
  id: number;
  house: number;
  sign: number;
  isCombust?: boolean;
  isExalted?: boolean;
  isOwnSign?: boolean;
  isDebilitated?: boolean;
}): PlanetPosition {
  return {
    planet: GRAHAS[opts.id]!,
    longitude: (opts.sign - 1) * 30 + 15,
    latitude: 0,
    speed: 1,
    sign: opts.sign,
    signName: { en: '', hi: '', sa: '' },
    house: opts.house,
    nakshatra: NAKSHATRAS[0]!,
    pada: 1,
    degree: '15°00\'00"',
    isRetrograde: false,
    isCombust: opts.isCombust ?? false,
    isExalted: opts.isExalted ?? false,
    isDebilitated: opts.isDebilitated ?? false,
    isOwnSign: opts.isOwnSign ?? false,
  };
}

function lajjitadiOf(planets: PlanetPosition[], planetId: number): string {
  const found = calculateAvasthas(planets).find((r) => r.planetId === planetId);
  if (!found) throw new Error(`No avastha for planet ${planetId}`);
  return found.lajjitadi.state;
}

describe('Lajjitadi — canonical Parashari aspects', () => {
  it('counts Saturn 3rd-house aspect as malefic aspect on Moon in water sign', () => {
    // Target: Moon at h5 in Cancer (water). Saturn at h3 → offset to h5 = 3
    // → Saturn's special 3rd aspect fires. No benefic aspects to h5.
    // Expect: Trushita (water + malefic aspect + no benefic aspect).
    const planets = [
      p({ id: 0, house: 6, sign: 6 }),   // Sun
      p({ id: 1, house: 5, sign: 4 }),   // Moon — TARGET (Cancer, water)
      p({ id: 2, house: 12, sign: 12 }), // Mars — h12 to h5 offset 6, no aspect
      p({ id: 3, house: 6, sign: 6 }),   // Mercury
      p({ id: 4, house: 4, sign: 4 }),   // Jupiter — h4 to h5 offset 2, no aspect
      p({ id: 5, house: 6, sign: 6 }),   // Venus
      p({ id: 6, house: 3, sign: 3 }),   // Saturn — h3 to h5 offset 3 = Saturn special ✓
      p({ id: 7, house: 12, sign: 12 }), // Rahu
      p({ id: 8, house: 6, sign: 6 }),   // Ketu
    ];
    expect(lajjitadiOf(planets, 1)).toBe('trushita');
  });

  it('Jupiter 5th-house aspect provides benefic relief — no Trushita', () => {
    // Same setup, but add Jupiter at h1 → offset to h5 = 5 → Jupiter special
    // 5th aspect fires. Moon in water + malefic aspect (Saturn 3rd) +
    // benefic aspect (Jupiter 5th) → Trushita gate fails → fallthrough to
    // Mudita.
    const planets = [
      p({ id: 0, house: 6, sign: 6 }),
      p({ id: 1, house: 5, sign: 4 }),   // Moon TARGET
      p({ id: 2, house: 12, sign: 12 }),
      p({ id: 3, house: 6, sign: 6 }),
      p({ id: 4, house: 1, sign: 1 }),   // Jupiter — h1 to h5 offset 5 = special ✓
      p({ id: 5, house: 6, sign: 6 }),
      p({ id: 6, house: 3, sign: 3 }),   // Saturn 3rd-aspect ✓
      p({ id: 7, house: 12, sign: 12 }),
      p({ id: 8, house: 6, sign: 6 }),
    ];
    expect(lajjitadiOf(planets, 1)).toBe('mudita');
  });

  it('Mars 8th-house aspect on Moon in Scorpio counts as malefic aspect', () => {
    // Target: Moon at h8 in Scorpio (water sign 8). Mars at h1 → offset to
    // h8 = 8 → Mars special 8th aspect fires. No benefic aspect on h8.
    // Expect: Trushita.
    const planets = [
      p({ id: 0, house: 3, sign: 3 }),   // Sun
      p({ id: 1, house: 8, sign: 8 }),   // Moon TARGET (Scorpio, water)
      p({ id: 2, house: 1, sign: 1 }),   // Mars — h1 to h8 offset 8 = Mars special ✓
      p({ id: 3, house: 9, sign: 9 }),   // Mercury — h9 to h8 offset 12, no aspect
      p({ id: 4, house: 3, sign: 3 }),   // Jupiter — h3 to h8 offset 6, no aspect
      p({ id: 5, house: 9, sign: 9 }),   // Venus — h9 to h8 offset 12, no aspect
      p({ id: 6, house: 10, sign: 10 }), // Saturn — h10 to h8 offset 11, no aspect
      p({ id: 7, house: 3, sign: 3 }),   // Rahu
      p({ id: 8, house: 9, sign: 9 }),   // Ketu
    ];
    expect(lajjitadiOf(planets, 1)).toBe('trushita');
  });
});

describe('Lajjitadi — Mercury conditional benefic (BPHS Ch.3)', () => {
  // Setup we'll mutate: Moon at h5 in Cancer (water sign). Vary Mercury's
  // company to test the conditional. Saturn at h3 supplies the malefic
  // aspect (Saturn 3rd). Without a benefic aspect on h5 → Trushita; with
  // a benefic aspect → Mudita.

  it('Mercury isolated (no malefic co-resident) provides benefic 7th aspect → Mudita', () => {
    // Mercury at h11 → offset to h5 = 7 (universal aspect). Mercury alone at
    // h11. Saturn 3rd-aspects h5. Mercury benefic 7-aspects h5 → Mudita.
    const planets = [
      p({ id: 0, house: 12, sign: 12 }), // Sun far from Mercury
      p({ id: 1, house: 5, sign: 4 }),   // Moon TARGET
      p({ id: 2, house: 12, sign: 12 }), // Mars far from Mercury
      p({ id: 3, house: 11, sign: 11 }), // Mercury alone at h11 → 7-aspects h5
      p({ id: 4, house: 4, sign: 4 }),   // Jupiter — h4 to h5 offset 2, no aspect
      p({ id: 5, house: 6, sign: 6 }),   // Venus — h6 to h5 offset 12, no aspect
      p({ id: 6, house: 3, sign: 3 }),   // Saturn 3rd-aspects h5 (malefic)
      p({ id: 7, house: 12, sign: 12 }), // Rahu far from Mercury
      p({ id: 8, house: 6, sign: 6 }),   // Ketu far from Mercury
    ];
    expect(lajjitadiOf(planets, 1)).toBe('mudita');
  });

  it('Mercury conjunct Sun → demoted to malefic → no benefic aspect → Trushita', () => {
    // Sun moved to h11 (Mercury's house). Mercury becomes malefic per BPHS.
    // Now no benefic 7-aspect on h5 — only Saturn's malefic 3rd remains.
    // Mercury's 7-aspect is now COUNTED as malefic, not benefic.
    // Result: Trushita.
    const planets = [
      p({ id: 0, house: 11, sign: 11 }), // Sun CONJUNCT Mercury at h11
      p({ id: 1, house: 5, sign: 4 }),   // Moon TARGET
      p({ id: 2, house: 12, sign: 12 }),
      p({ id: 3, house: 11, sign: 11 }), // Mercury at h11 → demoted to malefic
      p({ id: 4, house: 4, sign: 4 }),
      p({ id: 5, house: 6, sign: 6 }),
      p({ id: 6, house: 3, sign: 3 }),   // Saturn 3rd-aspects h5
      p({ id: 7, house: 12, sign: 12 }),
      p({ id: 8, house: 6, sign: 6 }),
    ];
    expect(lajjitadiOf(planets, 1)).toBe('trushita');
  });

  it('benefic CONJUNCTION (same house) provides relief — Jupiter conjunct Moon overrides Saturn 3-aspect', () => {
    // Regression for Gemini PR #291: same-house benefic was being dropped by
    // checkAspect (offset 1 isn't an aspect). With the fix, conjunction counts.
    //
    // Moon at h5 in Cancer (water). Jupiter co-resident at h5. Saturn at h3
    // 3rd-aspects h5 (malefic). Without conjunction-counts-as-aspect: no
    // benefic aspect → Trushita. With conjunction-counts-as-aspect: Jupiter
    // conjunct Moon = benefic influence → Trushita gate fails → Mudita.
    //
    // Lajjita rule check: h5 needs Saturn/Rahu/Ketu co-resident with the
    // target. Jupiter (4) is not in that set, so Lajjita does not fire.
    const planets = [
      p({ id: 0, house: 12, sign: 12 }),
      p({ id: 1, house: 5, sign: 4 }),   // Moon TARGET (Cancer, water)
      p({ id: 2, house: 12, sign: 12 }),
      p({ id: 3, house: 6, sign: 6 }),
      p({ id: 4, house: 5, sign: 4 }),   // Jupiter CONJUNCT Moon at h5
      p({ id: 5, house: 6, sign: 6 }),
      p({ id: 6, house: 3, sign: 3 }),   // Saturn 3rd-aspects h5 (malefic)
      p({ id: 7, house: 12, sign: 12 }),
      p({ id: 8, house: 6, sign: 6 }),
    ];
    expect(lajjitadiOf(planets, 1)).toBe('mudita');
  });

  it('malefic CONJUNCTION alone triggers Kshobhita (Gemini #291 regression)', () => {
    // The Kshobhita rule reads "conjunct malefic AND aspected by malefic".
    // With the original `diff === 1` branch, the conjunct malefic satisfied
    // both clauses by itself. The checkAspect-only version dropped that.
    //
    // Moon at h2 in Taurus (sidesteps the h5 Lajjita rule and the water-sign
    // Trushita branch). Saturn co-resident at h2 — Mercury here is also
    // demoted to malefic per the new conditional logic, but Mercury isn't
    // at h2 so that's irrelevant.
    //
    // Safe houses for target h2 (no Parashari aspect on h2): 5, 6, 7, 11.
    // (h11 to h2 offset 4 fires Mars's 4th, so Mars goes at h5 instead.)
    const planets = [
      p({ id: 0, house: 11, sign: 11 }),
      p({ id: 1, house: 2, sign: 2 }),   // Moon TARGET (Taurus)
      p({ id: 2, house: 5, sign: 5 }),   // Mars — h5 to h2 offset 10, no Mars aspect
      p({ id: 3, house: 6, sign: 6 }),   // Mercury — h6 to h2 offset 9, no aspect
      p({ id: 4, house: 11, sign: 11 }), // Jupiter — h11 to h2 offset 4, no Jup special
      p({ id: 5, house: 6, sign: 6 }),
      p({ id: 6, house: 2, sign: 2 }),   // Saturn CONJUNCT Moon at h2 ✓
      p({ id: 7, house: 5, sign: 5 }),   // Rahu — h5 to h2 offset 10, no aspect
      p({ id: 8, house: 11, sign: 11 }), // Ketu — h11 to h2 offset 4, no aspect
    ];
    expect(lajjitadiOf(planets, 1)).toBe('kshobhita');
  });

  it('Mercury conjunct Jupiter (benefic) → stays benefic → Mudita', () => {
    // Jupiter co-resident with Mercury at h11. Mercury stays benefic.
    // Jupiter 7-aspects h5 (benefic) AND Mercury 7-aspects h5 (benefic).
    // Saturn 3rd-aspects h5 (malefic) — but benefic aspect satisfied →
    // Mudita.
    const planets = [
      p({ id: 0, house: 12, sign: 12 }),
      p({ id: 1, house: 5, sign: 4 }),   // Moon TARGET
      p({ id: 2, house: 12, sign: 12 }),
      p({ id: 3, house: 11, sign: 11 }), // Mercury at h11
      p({ id: 4, house: 11, sign: 11 }), // Jupiter CONJUNCT Mercury at h11
      p({ id: 5, house: 6, sign: 6 }),
      p({ id: 6, house: 3, sign: 3 }),   // Saturn 3rd-aspects h5
      p({ id: 7, house: 12, sign: 12 }),
      p({ id: 8, house: 6, sign: 6 }),
    ];
    expect(lajjitadiOf(planets, 1)).toBe('mudita');
  });
});
