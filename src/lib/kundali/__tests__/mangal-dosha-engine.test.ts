import { describe, it, expect } from 'vitest';
import {
  analyzeMangalDosha,
  analyzeMangalDoshaForMatching,
  type MangalDoshaResult,
} from '../mangal-dosha-engine';
import type { PlanetPosition } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Helper: create a minimal PlanetPosition array with 9 planets (ids 0-8).
// Override per-planet with { id, sign, house, ... }
// ---------------------------------------------------------------------------

type PlanetOverride = {
  id: number;
  sign?: number;
  house?: number;
  isExalted?: boolean;
  isOwnSign?: boolean;
};

function makePlanets(overrides: PlanetOverride[] = []): PlanetPosition[] {
  const overrideMap = new Map<number, PlanetOverride>(overrides.map((o) => [o.id, o]));

  return Array.from({ length: 9 }, (_, id) => {
    const o = overrideMap.get(id) ?? {};
    return {
      planet: {
        id,
        name: { en: `Planet${id}`, hi: `P${id}`, sa: `P${id}` },
      },
      longitude: 0,
      latitude: 0,
      speed: 1,
      sign: o.sign ?? id + 1,       // default: planet id → sign id+1 (safe 1-12 range for ids 0-8)
      signName: { en: '', hi: '', sa: '' },
      house: o.house ?? id + 1,      // default: house id+1 (1-9)
      nakshatra: {} as any,
      pada: 1,
      degree: '0°0\'0"',
      isRetrograde: false,
      isCombust: false,
      isExalted: o.isExalted ?? false,
      isDebilitated: false,
      isOwnSign: o.isOwnSign ?? false,
    } as PlanetPosition;
  });
}

// ---------------------------------------------------------------------------
// Detection tests
// ---------------------------------------------------------------------------

describe('Mangal Dosha Detection', () => {
  it('Test 1: Mars in house 7 from Lagna → present=true, fromLagna=true, houseSeverity=severe', () => {
    // Lagna = Aries (sign 1). Mars in Libra (sign 7) → house 7 from Lagna.
    const planets = makePlanets([
      { id: 2, sign: 7, house: 7 }, // Mars in sign 7, house 7
    ]);
    const result = analyzeMangalDosha(planets, 1);

    expect(result.present).toBe(true);
    expect(result.fromLagna).toBe(true);
    expect(result.houseSeverity).toBe('severe');
  });

  it('Test 2: Mars not in any Mangal house from any ref → present=false', () => {
    // Lagna = Aries (sign 1). Mars in Taurus (sign 2) → house 2 from Lagna (mild).
    // But if Moon is at sign 2 too, Mars in house 1 from Moon (not Mangal).
    // Easiest: place Mars in house 3 from all refs.
    // Lagna=1, Moon.sign=1, Venus.sign=1, Mars.sign=3 → house 3 from all → NOT Mangal.
    const planets = makePlanets([
      { id: 1, sign: 1, house: 1 },  // Moon in sign 1
      { id: 2, sign: 3, house: 3 },  // Mars in sign 3
      { id: 5, sign: 1, house: 1 },  // Venus in sign 1
    ]);
    const result = analyzeMangalDosha(planets, 1); // ascSign=1

    expect(result.present).toBe(false);
  });

  it('Test 3: Mars in Mangal house from Moon but not Lagna → fromMoon=true, fromLagna=false', () => {
    // Lagna=Aries(1). Mars sign=4.
    // houseFrom(1,4)=4 — that IS a Mangal house! Let me use sign=3 for Lagna test.
    // houseFrom(1,3)=3 → NOT Mangal. Moon.sign=9, houseFrom(9,3)=7 → IS Mangal.
    // Venus.sign=3, houseFrom(3,3)=1 → IS Mangal. We need Venus to NOT trigger.
    // Let's use Moon.sign=9, Venus.sign=4 (houseFrom(4,3)=12 → IS Mangal too)
    // Adjust: Venus.sign=5, houseFrom(5,3)=11 → NOT Mangal.
    // Summary: Lagna=1, Moon.sign=9, Venus.sign=5, Mars.sign=3
    // houseFrom(1,3)=3 (not Mangal) ✓
    // houseFrom(9,3)=7 (Mangal) ✓
    // houseFrom(5,3)=11 (not Mangal) ✓
    const planets = makePlanets([
      { id: 1, sign: 9, house: 9 },  // Moon in Sag
      { id: 2, sign: 3, house: 3 },  // Mars in Gemini
      { id: 5, sign: 5, house: 5 },  // Venus in Leo
    ]);
    const result = analyzeMangalDosha(planets, 1); // ascSign=1

    expect(result.present).toBe(true);
    expect(result.fromLagna).toBe(false);
    expect(result.fromMoon).toBe(true);
  });

  it('Test 4: Mars in Mangal house from all 3 refs → scopeSeverity=severe', () => {
    // We need houseFrom(ascSign, marsSign), houseFrom(moonSign, marsSign),
    // houseFrom(venusSign, marsSign) all in MANGAL_HOUSES.
    // Use marsSign=7.
    // ascSign=1: houseFrom(1,7)=7 ✓
    // moonSign=7: houseFrom(7,7)=1 ✓
    // venusSign=3: houseFrom(3,7)=5 ✗
    // Let venusSign=8: houseFrom(8,7)=12 ✓ (all three triggered)
    const planets = makePlanets([
      { id: 1, sign: 7, house: 7 },  // Moon in Libra
      { id: 2, sign: 7, house: 7 },  // Mars in Libra
      { id: 5, sign: 8, house: 8 },  // Venus in Scorpio
    ]);
    const result = analyzeMangalDosha(planets, 1); // ascSign=1

    expect(result.fromLagna).toBe(true);
    expect(result.fromMoon).toBe(true);
    expect(result.fromVenus).toBe(true);
    expect(result.scopeSeverity).toBe('severe');
  });
});

// ---------------------------------------------------------------------------
// Cancellation tests
// ---------------------------------------------------------------------------

describe('Mangal Dosha Cancellations', () => {
  /** Set up a base chart with Mars in house 7 from Lagna — clear dosha present */
  function doshaBase(marsSign: number, marsHouse: number, extra: PlanetOverride[] = []) {
    // ascSign=1, Mars in house 7 → use marsSign=7 for clean lagna-dosha.
    // But we allow custom marsSign for cancellation tests.
    const planets = makePlanets([
      { id: 1, sign: 11, house: 11 }, // Moon far away (no extra dosha trigger needed)
      { id: 2, sign: marsSign, house: marsHouse },
      { id: 5, sign: 11, house: 11 }, // Venus far away
      ...extra,
    ]);
    return planets;
  }

  it('Test 5: C1 — Mars in Aries (sign 1), in a Mangal house → C1 cancellation', () => {
    // Mars in Aries(1), house 1 from Lagna(1) → Mangal house (1)
    const planets = doshaBase(1, 1);
    const result = analyzeMangalDosha(planets, 1);

    expect(result.present).toBe(true);
    expect(result.cancellations.some((c) => c.rule === 'C1')).toBe(true);
  });

  it('Test 6: C2 — Mars in Capricorn (sign 10) → C2 cancellation', () => {
    // ascSign=1, Mars in Capricorn(10) → houseFrom(1,10)=10 → NOT Mangal house.
    // ascSign=3: houseFrom(3,10)=8 → Mangal! Use ascSign=3.
    const planets = doshaBase(10, 8);
    const result = analyzeMangalDosha(planets, 3);

    expect(result.present).toBe(true);
    expect(result.cancellations.some((c) => c.rule === 'C2')).toBe(true);
  });

  it('Test 7: C3 — Jupiter 7th from Mars → C3 cancellation', () => {
    // Mars house=4. Jupiter's 7th aspect lands on house (4-1+6)%12+1 = 9+1=10.
    // That's not Mars house=4. We need Jupiter in position X such that
    // one of {X, (X-1+4)%12+1, (X-1+6)%12+1, (X-1+8)%12+1} = marsHouse.
    // Mars house=7. Jupiter house=1: aspects 1, 5, 7, 9 → includes 7 ✓
    const planets = doshaBase(7, 7, [
      { id: 4, sign: 1, house: 1 }, // Jupiter in house 1, aspects house 7
    ]);
    const result = analyzeMangalDosha(planets, 1);

    expect(result.present).toBe(true);
    expect(result.cancellations.some((c) => c.rule === 'C3')).toBe(true);
  });

  it('Test 8: C4 — Venus in house 7 → C4 cancellation', () => {
    // Mars in house 1 from ascSign=1 (sign=1, house=1 → Mangal). Venus in house 7.
    const planets = makePlanets([
      { id: 1, sign: 11, house: 11 }, // Moon
      { id: 2, sign: 1, house: 1 },   // Mars in sign=1, house=1 (Mangal from lagna=1)
      { id: 5, sign: 7, house: 7 },   // Venus in house 7
    ]);
    const result = analyzeMangalDosha(planets, 1);

    expect(result.present).toBe(true);
    expect(result.cancellations.some((c) => c.rule === 'C4')).toBe(true);
  });

  it('Test 9: C5 — Mars conjunct Jupiter (same house) → C5 cancellation', () => {
    // Mars and Jupiter both in house 7 (not covered by C3 conjunction path that creates C3).
    // C3 checks if Jupiter aspects Mars — conjunction (same house) IS covered by C3.
    // The spec says C5 should NOT duplicate if C3 already found conjunction.
    // So for C5 to fire independently, Jupiter must NOT aspect Mars but Venus conjuncts Mars.
    // Mars house=7. Jupiter house=3 (aspects 3,7,9,11) — house 7 IS in Jupiter aspects → C3 fires.
    // Let's use Venus conjunct Mars instead.
    // Mars house=8, Jupiter far away (house=2, aspects 2,6,8,10) → house 8 IS in Jupiter aspects.
    // Jupiter house=5, aspects 5,9,11,1 → Mars house=8 NOT in {5,9,11,1} ✓
    // Venus house=8 (conjunct Mars) → C5 fires.
    const planets = makePlanets([
      { id: 1, sign: 11, house: 11 }, // Moon
      { id: 2, sign: 8, house: 8 },   // Mars house=8 (Mangal from lagna=1)
      { id: 4, sign: 5, house: 5 },   // Jupiter house=5, aspects 5,9,11,1 — doesn't hit 8
      { id: 5, sign: 8, house: 8 },   // Venus house=8 (conjunct Mars)
    ]);
    const result = analyzeMangalDosha(planets, 1);

    expect(result.present).toBe(true);
    expect(result.cancellations.some((c) => c.rule === 'C5')).toBe(true);
  });

  it('Test 10: C6 — Mars in Gemini (sign 3) in 2nd house → C6 cancellation', () => {
    // ascSign=2: houseFrom(2,3)=2 → Mangal (house 2). Mars sign=3, house=2.
    const planets = doshaBase(3, 2);
    const result = analyzeMangalDosha(planets, 2);

    expect(result.present).toBe(true);
    expect(result.cancellations.some((c) => c.rule === 'C6')).toBe(true);
  });

  it('Test 11: No cancellations when none apply → empty array', () => {
    // Mars in Aquarius (sign 11), house 8 from lagna. No cancellation conditions met.
    // Jupiter far, Venus not house 7, Mars not own/exalted sign, not Gemini/Virgo+2nd.
    const planets = makePlanets([
      { id: 1, sign: 3, house: 3 },   // Moon
      { id: 2, sign: 11, house: 8 },  // Mars in Aquarius, house 8
      { id: 4, sign: 2, house: 2 },   // Jupiter house=2, aspects 2,6,8,10 — hits house 8! Let's move it.
      { id: 5, sign: 3, house: 3 },   // Venus not house 7
    ]);
    // Recalculate: Jupiter house=2, aspects {2, 6, 8, 10} — includes marsHouse=8!
    // That would trigger C3. Move Jupiter to house=3, aspects {3,7,9,11} — doesn't include 8.
    const planets2 = makePlanets([
      { id: 1, sign: 3, house: 3 },
      { id: 2, sign: 11, house: 8 },  // Mars in Aquarius, house 8
      { id: 4, sign: 3, house: 3 },   // Jupiter house=3, aspects {3,7,9,11} — not 8
      { id: 5, sign: 3, house: 3 },   // Venus house=3, not 7; not conjunct Mars
    ]);
    const result = analyzeMangalDosha(planets2, 4); // ascSign=4: houseFrom(4,11)=8 → Mangal

    expect(result.present).toBe(true);
    expect(result.cancellations).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Severity cascade
// ---------------------------------------------------------------------------

describe('Severity Cascade', () => {
  it('Test 12: severe + 1 cancellation → effectiveSeverity=moderate', () => {
    // Mars in house 7 from Lagna (severe). Mars in own sign Aries (sign=1) → C1.
    // But houseFrom(1,1)=1 (not 7). Need Mars sign=7, house=7 for severe + own sign?
    // Mars own signs: Aries(1) and Scorpio(8). Mars in Scorpio(8), house=8 → severe.
    // ascSign=1: houseFrom(1,8)=8 → Mangal(severe). Mars sign=8 → C1.
    const planets = makePlanets([
      { id: 1, sign: 3, house: 3 },  // Moon (houseFrom(3,8)=6, not Mangal)
      { id: 2, sign: 8, house: 8 },  // Mars in Scorpio, house 8
      { id: 4, sign: 3, house: 3 },  // Jupiter house 3, aspects {3,7,9,11} — not 8
      { id: 5, sign: 3, house: 3 },  // Venus not house 7
    ]);
    const result = analyzeMangalDosha(planets, 1);

    expect(result.present).toBe(true);
    expect(result.houseSeverity).toBe('severe');
    expect(result.cancellations.some((c) => c.rule === 'C1')).toBe(true);
    expect(result.effectiveSeverity).toBe('moderate');
  });

  it('Test 13: mild + 1 cancellation → effectiveSeverity=cancelled', () => {
    // Mars in house 2 (mild). Mars in Gemini(3) and house 2 → C6.
    // Use ascSign=2: houseFrom(2,3)=2 → mild.
    const planets = makePlanets([
      { id: 1, sign: 9, house: 9 },  // Moon: houseFrom(9,3)=7 → IS Mangal! Adjust.
      // Moon sign=6: houseFrom(6,3)=10 → not Mangal
      { id: 2, sign: 3, house: 2 },  // Mars in Gemini, house 2
      { id: 4, sign: 9, house: 9 },  // Jupiter house=9, aspects {9,1,3,5} — not 2
      { id: 5, sign: 9, house: 9 },  // Venus not house 7
    ]);
    // Redo Moon
    const planets2 = makePlanets([
      { id: 1, sign: 6, house: 6 },  // Moon: houseFrom(6,3)=10 → not Mangal ✓
      { id: 2, sign: 3, house: 2 },  // Mars in Gemini, house 2 → mild from lagna(2)
      { id: 4, sign: 9, house: 9 },  // Jupiter aspects {9,1,3,5}
      { id: 5, sign: 9, house: 9 },  // Venus house 9, not 7
    ]);
    // ascSign=2: houseFrom(2,3)=2 → mild Mangal. C6 fires (Gemini + house 2). 1 cancellation.
    // Check Venus: fromVenus: houseFrom(9,3)=7 → IS Mangal! move Venus.
    const planets3 = makePlanets([
      { id: 1, sign: 6, house: 6 },  // Moon: houseFrom(6,3)=10 ✓
      { id: 2, sign: 3, house: 2 },  // Mars
      { id: 4, sign: 9, house: 9 },  // Jupiter
      { id: 5, sign: 6, house: 6 },  // Venus: houseFrom(6,3)=10 ✓
    ]);
    const result = analyzeMangalDosha(planets3, 2); // ascSign=2

    // Verify from refs
    expect(result.fromLagna).toBe(true);    // houseFrom(2,3)=2 → Mangal
    expect(result.fromMoon).toBe(false);    // houseFrom(6,3)=10 → not Mangal
    expect(result.fromVenus).toBe(false);   // houseFrom(6,3)=10 → not Mangal
    expect(result.houseSeverity).toBe('mild');
    expect(result.cancellations.some((c) => c.rule === 'C6')).toBe(true);
    expect(result.effectiveSeverity).toBe('cancelled');
  });
});

// ---------------------------------------------------------------------------
// Bug fix verification
// ---------------------------------------------------------------------------

describe('Bug Fix Verification', () => {
  it('Test 14: Mercury (id=3) in house 7, Mars (id=2) NOT in Mangal house → present=false', () => {
    // Mars sign=3, ascSign=1 → houseFrom(1,3)=3 (not Mangal)
    // Moon sign=1: houseFrom(1,3)=3 (not Mangal)
    // Venus sign=1: houseFrom(1,3)=3 (not Mangal)
    // Mercury in house 7 (irrelevant to Mangal Dosha)
    const planets = makePlanets([
      { id: 1, sign: 1, house: 1 },  // Moon
      { id: 2, sign: 3, house: 3 },  // Mars in house 3 — NOT a Mangal house
      { id: 3, sign: 7, house: 7 },  // Mercury in house 7 (should be ignored)
      { id: 5, sign: 1, house: 1 },  // Venus
    ]);
    const result = analyzeMangalDosha(planets, 1);

    expect(result.present).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Matching context
// ---------------------------------------------------------------------------

describe('Matching Context — Mutual Manglik', () => {
  it('Test 15: Both charts have Mangal → mutualCancellation=true, C7 in cancellations', () => {
    // Chart 1: Mars house 7 from Lagna
    const chart1 = makePlanets([
      { id: 2, sign: 7, house: 7 },
      { id: 1, sign: 3, house: 3 },
      { id: 5, sign: 3, house: 3 },
      { id: 4, sign: 3, house: 3 }, // Jupiter: aspects {3,7,9,11} → includes house 7! → C3 fires
    ]);
    // Move Jupiter so C3 doesn't fire: Jupiter house=5, aspects {5,9,11,1} — not 7.
    const chart1Clean = makePlanets([
      { id: 2, sign: 7, house: 7 },
      { id: 1, sign: 3, house: 3 },
      { id: 5, sign: 3, house: 3 },
      { id: 4, sign: 5, house: 5 }, // Jupiter house=5, aspects {5,9,11,1}
    ]);

    // Chart 2: Mars house 8 from Lagna
    const chart2 = makePlanets([
      { id: 2, sign: 8, house: 8 },
      { id: 1, sign: 3, house: 3 },
      { id: 5, sign: 3, house: 3 },
      { id: 4, sign: 5, house: 5 }, // Jupiter house=5, aspects {5,9,11,1} — not 8
    ]);
    // ascSign=1 for both

    const { chart1: r1, chart2: r2, mutualCancellation } = analyzeMangalDoshaForMatching(
      chart1Clean, 1,
      chart2, 1,
    );

    expect(r1.present).toBe(true);
    expect(r2.present).toBe(true);
    expect(mutualCancellation).toBe(true);
    expect(r1.cancellations.some((c) => c.rule === 'C7')).toBe(true);
    expect(r2.cancellations.some((c) => c.rule === 'C7')).toBe(true);
  });

  it('Test 16: Only one chart has Mangal → mutualCancellation=false', () => {
    // Chart 1: Mars in Mangal house (7)
    const chart1 = makePlanets([
      { id: 2, sign: 7, house: 7 },
      { id: 1, sign: 3, house: 3 },
      { id: 5, sign: 3, house: 3 },
      { id: 4, sign: 5, house: 5 },
    ]);

    // Chart 2: Mars NOT in Mangal house
    const chart2 = makePlanets([
      { id: 2, sign: 3, house: 3 }, // Mars house 3 — not Mangal from lagna=1
      { id: 1, sign: 1, house: 1 }, // Moon sign=1: houseFrom(1,3)=3 → not Mangal
      { id: 5, sign: 1, house: 1 }, // Venus sign=1: houseFrom(1,3)=3 → not Mangal
    ]);

    const { mutualCancellation } = analyzeMangalDoshaForMatching(chart1, 1, chart2, 1);

    expect(mutualCancellation).toBe(false);
  });
});
