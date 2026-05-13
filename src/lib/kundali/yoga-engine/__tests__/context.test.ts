/**
 * Yoga Context Builder Tests
 *
 * Tests the buildYogaContext() function which converts KundaliData into
 * the precomputed YogaContext used by the condition evaluator.
 *
 * Two real charts tested:
 * - Arjun Jha:    2016-09-09 19:45 Luxembourg (Aquarius lagna, sign 11)
 * - Vaibhavi Jha: 2008-06-21 12:08 Delhi      (Virgo lagna, sign 6)
 *
 * All planet positions verified against engine output (May 2026).
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Sign IDs:   1=Aries through 12=Pisces (1-based)
 * House IDs:  1-12 (1=ascendant)
 */

import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { buildYogaContext } from '@/lib/kundali/yoga-engine/context';
import type { BirthData } from '@/types/kundali';
import type { YogaContext } from '@/lib/kundali/yoga-engine/types';

// ---------------------------------------------------------------------------
// Test chart definitions
// ---------------------------------------------------------------------------

const ARJUN: BirthData = {
  name: 'Arjun Jha',
  date: '2016-09-09',
  time: '19:45',
  place: 'Luxembourg',
  lat: 49.6117,
  lng: 6.1319,
  timezone: 'Europe/Luxembourg',
  ayanamsha: 'lahiri',
};

const VAIBHAVI: BirthData = {
  name: 'Vaibhavi Jha',
  date: '2008-06-21',
  time: '12:08',
  place: 'Delhi',
  lat: 28.6139,
  lng: 77.2090,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri',
};

// Generate charts once and build contexts
const arjunKundali = generateKundali(ARJUN);
const vaibhaviKundali = generateKundali(VAIBHAVI);
const arjunCtx = buildYogaContext(arjunKundali);
const vaibhaviCtx = buildYogaContext(vaibhaviKundali);

// ==========================================================================
// ARJUN'S CONTEXT (Aquarius lagna, sign 11)
// ==========================================================================

describe("Yoga Context — Arjun's chart (Aquarius lagna)", () => {
  // ── Ascendant ──

  it('ascendantSign is 11 (Aquarius)', () => {
    expect(arjunCtx.ascendantSign).toBe(11);
  });

  // ── House lords ──
  // Aquarius (11) → 1st house lord = Saturn (6)
  // Leo (5) → 7th house from Aquarius = Sun (0)

  it('houseLord(1) is 6 (Saturn lords Aquarius)', () => {
    expect(arjunCtx.houseLord(1)).toBe(6);
  });

  it('houseLord(7) is 0 (Sun lords Leo, 7th from Aquarius)', () => {
    // House 7 from Aquarius (11) → sign = ((11-1+7-1)%12)+1 = 5 (Leo)
    // Leo lord = Sun (0)
    expect(arjunCtx.houseLord(7)).toBe(0);
  });

  // ── House classification ──

  it('isKendra: house 1 true, house 4 true, house 3 false', () => {
    expect(arjunCtx.isKendra(1)).toBe(true);
    expect(arjunCtx.isKendra(4)).toBe(true);
    expect(arjunCtx.isKendra(7)).toBe(true);
    expect(arjunCtx.isKendra(10)).toBe(true);
    expect(arjunCtx.isKendra(3)).toBe(false);
  });

  it('isTrikona: house 5 true, house 9 true, house 6 false', () => {
    expect(arjunCtx.isTrikona(1)).toBe(true);
    expect(arjunCtx.isTrikona(5)).toBe(true);
    expect(arjunCtx.isTrikona(9)).toBe(true);
    expect(arjunCtx.isTrikona(6)).toBe(false);
  });

  it('isDusthana: house 6 true, house 8 true, house 12 true, house 5 false', () => {
    expect(arjunCtx.isDusthana(6)).toBe(true);
    expect(arjunCtx.isDusthana(8)).toBe(true);
    expect(arjunCtx.isDusthana(12)).toBe(true);
    expect(arjunCtx.isDusthana(5)).toBe(false);
  });

  it('isUpachaya: house 3 true, house 6 true, house 10 true, house 11 true, house 1 false', () => {
    expect(arjunCtx.isUpachaya(3)).toBe(true);
    expect(arjunCtx.isUpachaya(6)).toBe(true);
    expect(arjunCtx.isUpachaya(10)).toBe(true);
    expect(arjunCtx.isUpachaya(11)).toBe(true);
    expect(arjunCtx.isUpachaya(1)).toBe(false);
  });

  // ── Planet positions ──
  // Arjun's planets:
  //   Sun(0) → sign 5, house 7
  //   Moon(1) → sign 8, house 10
  //   Mars(2) → sign 8, house 10
  //   Mercury(3) → sign 5, house 7
  //   Jupiter(4) → sign 6, house 8
  //   Venus(5) → sign 6, house 8
  //   Saturn(6) → sign 8, house 10
  //   Rahu(7) → sign 5, house 7
  //   Ketu(8) → sign 11, house 1

  it('planetHouse and planetSign return correct values', () => {
    expect(arjunCtx.planetHouse(0)).toBe(7);   // Sun in house 7
    expect(arjunCtx.planetSign(0)).toBe(5);     // Sun in Leo
    expect(arjunCtx.planetHouse(1)).toBe(10);   // Moon in house 10
    expect(arjunCtx.planetSign(1)).toBe(8);     // Moon in Scorpio
    expect(arjunCtx.planetHouse(2)).toBe(10);   // Mars in house 10
    expect(arjunCtx.planetSign(2)).toBe(8);     // Mars in Scorpio
    expect(arjunCtx.planetHouse(4)).toBe(8);    // Jupiter in house 8
    expect(arjunCtx.planetSign(4)).toBe(6);     // Jupiter in Virgo
    expect(arjunCtx.planetHouse(8)).toBe(1);    // Ketu in house 1
    expect(arjunCtx.planetSign(8)).toBe(11);    // Ketu in Aquarius
  });

  // ── Dignity ──
  // Mars(2) in Scorpio (sign 8) → own sign (Mars lords Scorpio)

  it('dignity(2) for Mars in Scorpio is own', () => {
    expect(arjunCtx.dignity(2)).toBe('own');
  });

  it('dignity(4) for Jupiter in Virgo is enemy (Virgo lord Mercury is enemy of Jupiter)', () => {
    expect(arjunCtx.dignity(4)).toBe('enemy');
  });

  // ── Natural benefic/malefic ──

  it('isNaturalBenefic(4) is true (Jupiter)', () => {
    expect(arjunCtx.isNaturalBenefic(4)).toBe(true);
  });

  it('isNaturalBenefic(5) is true (Venus)', () => {
    expect(arjunCtx.isNaturalBenefic(5)).toBe(true);
  });

  it('isNaturalBenefic(6) is false (Saturn is natural malefic)', () => {
    expect(arjunCtx.isNaturalBenefic(6)).toBe(false);
  });

  it('isNaturalBenefic(0) is false (Sun is natural malefic)', () => {
    expect(arjunCtx.isNaturalBenefic(0)).toBe(false);
  });

  it('isNaturalBenefic(1) is true (Moon — simplified to always benefic)', () => {
    expect(arjunCtx.isNaturalBenefic(1)).toBe(true);
  });

  // ── Aspects ──
  // Jupiter(4) is in house 8. Jupiter aspects houses 5th, 7th, 9th from itself.
  // From house 8: 5th = house 12, 7th = house 2, 9th = house 4

  it('Jupiter aspects 5th, 7th, 9th from its position', () => {
    const jupHouse = arjunCtx.planetHouse(4); // house 8
    expect(jupHouse).toBe(8);
    expect(arjunCtx.doesAspect(4, 12)).toBe(true);  // 5th from 8
    expect(arjunCtx.doesAspect(4, 2)).toBe(true);   // 7th from 8
    expect(arjunCtx.doesAspect(4, 4)).toBe(true);   // 9th from 8
    expect(arjunCtx.doesAspect(4, 3)).toBe(false);  // not an aspect target
  });

  // Mars(2) is in house 10. Mars aspects 4th, 7th, 8th from itself.
  // From house 10: 4th = house 1, 7th = house 4, 8th = house 5

  it('Mars aspects 4th, 7th, 8th from its position', () => {
    expect(arjunCtx.doesAspect(2, 1)).toBe(true);   // 4th from 10
    expect(arjunCtx.doesAspect(2, 4)).toBe(true);   // 7th from 10
    expect(arjunCtx.doesAspect(2, 5)).toBe(true);   // 8th from 10
    expect(arjunCtx.doesAspect(2, 6)).toBe(false);  // not an aspect target
  });

  // ── Conjunction ──
  // Moon(1) and Mars(2) are both in house 10

  it('areConjunct(1, 2) — Moon and Mars in house 10', () => {
    expect(arjunCtx.areConjunct(1, 2)).toBe(true);
  });

  it('areConjunct(1, 6) — Moon and Saturn in house 10', () => {
    expect(arjunCtx.areConjunct(1, 6)).toBe(true);
  });

  it('areConjunct(0, 7) — Sun and Rahu in house 7', () => {
    expect(arjunCtx.areConjunct(0, 7)).toBe(true);
  });

  it('areConjunct(0, 4) — Sun(h7) and Jupiter(h8) not conjunct', () => {
    expect(arjunCtx.areConjunct(0, 4)).toBe(false);
  });

  // ── Functional benefic (Aquarius lagna) ──
  // For Aquarius (sign 11): functional benefics = Venus(5), Saturn(6)

  it('isFunctionalBenefic(5) is true (Venus for Aquarius)', () => {
    expect(arjunCtx.isFunctionalBenefic(5)).toBe(true);
  });

  it('isFunctionalBenefic(6) is true (Saturn for Aquarius)', () => {
    expect(arjunCtx.isFunctionalBenefic(6)).toBe(true);
  });

  it('isFunctionalBenefic(2) is false (Mars not functional benefic for Aquarius)', () => {
    expect(arjunCtx.isFunctionalBenefic(2)).toBe(false);
  });

  // ── Yogakaraka ──
  // Aquarius yogakaraka = Venus(5)

  it('isYogakaraka(5) is true (Venus is yogakaraka for Aquarius)', () => {
    expect(arjunCtx.isYogakaraka(5)).toBe(true);
  });

  it('isYogakaraka(6) is false (Saturn is not yogakaraka for Aquarius)', () => {
    expect(arjunCtx.isYogakaraka(6)).toBe(false);
  });

  // ── planetsInHouse ──

  it('planetsInHouse(10) returns Moon, Mars, Saturn', () => {
    const planets = arjunCtx.planetsInHouse(10);
    expect(planets).toContain(1); // Moon
    expect(planets).toContain(2); // Mars
    expect(planets).toContain(6); // Saturn
    expect(planets.length).toBe(3);
  });

  it('planetsInHouse(7) returns Sun, Mercury, Rahu', () => {
    const planets = arjunCtx.planetsInHouse(7);
    expect(planets).toContain(0); // Sun
    expect(planets).toContain(3); // Mercury
    expect(planets).toContain(7); // Rahu
    expect(planets.length).toBe(3);
  });

  // ── houseOffset ──

  it('houseOffset(1, 1) is 1 (same house)', () => {
    expect(arjunCtx.houseOffset(1, 1)).toBe(1);
  });

  it('houseOffset(1, 7) is 7 (opposite house)', () => {
    expect(arjunCtx.houseOffset(1, 7)).toBe(7);
  });

  it('houseOffset(10, 1) is 4 (4 houses forward)', () => {
    expect(arjunCtx.houseOffset(10, 1)).toBe(4);
  });

  // ── Retrograde / combust ──

  it('Mercury(3) is retrograde and combust', () => {
    expect(arjunCtx.isRetrograde(3)).toBe(true);
    expect(arjunCtx.isCombust(3)).toBe(true);
  });

  it('Mars(2) is not retrograde and not combust', () => {
    expect(arjunCtx.isRetrograde(2)).toBe(false);
    expect(arjunCtx.isCombust(2)).toBe(false);
  });

  it('Rahu(7) is retrograde', () => {
    expect(arjunCtx.isRetrograde(7)).toBe(true);
  });
});

// ==========================================================================
// VAIBHAVI'S CONTEXT (Virgo lagna, sign 6)
// ==========================================================================

describe("Yoga Context — Vaibhavi's chart (Virgo lagna)", () => {
  // ── Ascendant ──

  it('ascendantSign is 6 (Virgo)', () => {
    expect(vaibhaviCtx.ascendantSign).toBe(6);
  });

  // ── House lords ──
  // House 4 from Virgo (6) → sign = ((6-1+4-1)%12)+1 = 9 (Sagittarius)
  // Sagittarius lord = Jupiter (4)

  it('houseLord(4) is 4 (Jupiter lords Sagittarius, 4th from Virgo)', () => {
    expect(vaibhaviCtx.houseLord(4)).toBe(4);
  });

  // House 1 from Virgo (6) → sign 6 (Virgo), lord = Mercury (3)

  it('houseLord(1) is 3 (Mercury lords Virgo)', () => {
    expect(vaibhaviCtx.houseLord(1)).toBe(3);
  });

  // ── Planet positions ──
  // Vaibhavi's planets:
  //   Sun(0) → sign 3, house 10
  //   Moon(1) → sign 10, house 5
  //   Mars(2) → sign 4, house 11
  //   Mercury(3) → sign 2, house 9
  //   Jupiter(4) → sign 9, house 4
  //   Venus(5) → sign 3, house 10
  //   Saturn(6) → sign 5, house 12
  //   Rahu(7) → sign 10, house 5
  //   Ketu(8) → sign 4, house 11

  it('Jupiter(4) is in house 4 and sign 9 (Sagittarius)', () => {
    expect(vaibhaviCtx.planetHouse(4)).toBe(4);
    expect(vaibhaviCtx.planetSign(4)).toBe(9);
  });

  it('Mercury(3) is in house 9 and sign 2 (Taurus)', () => {
    expect(vaibhaviCtx.planetHouse(3)).toBe(9);
    expect(vaibhaviCtx.planetSign(3)).toBe(2);
  });

  // ── Dignity ──
  // Jupiter(4) in Sagittarius (sign 9) → own sign (Jupiter lords Sagittarius)

  it('dignity(4) for Jupiter in Sagittarius is own', () => {
    expect(vaibhaviCtx.dignity(4)).toBe('own');
  });

  // Mars(2) in Cancer (sign 4) → debilitated (Mars debilitation sign = Cancer)

  it('dignity(2) for Mars in Cancer is debilitated', () => {
    expect(vaibhaviCtx.dignity(2)).toBe('debilitated');
  });

  // ── Functional benefic (Virgo lagna) ──
  // Virgo: functional benefics = Venus(5), Mercury(3)

  it('isFunctionalBenefic(5) is true (Venus for Virgo)', () => {
    expect(vaibhaviCtx.isFunctionalBenefic(5)).toBe(true);
  });

  it('isFunctionalBenefic(3) is true (Mercury for Virgo)', () => {
    expect(vaibhaviCtx.isFunctionalBenefic(3)).toBe(true);
  });

  // ── No yogakaraka for Virgo ──

  it('no yogakaraka for Virgo lagna', () => {
    // Virgo has no yogakaraka — none of the 7 planets qualify
    for (let pid = 0; pid <= 8; pid++) {
      expect(vaibhaviCtx.isYogakaraka(pid)).toBe(false);
    }
  });

  // ── Conjunction ──
  // Moon(1) and Rahu(7) are both in house 5

  it('areConjunct(1, 7) — Moon and Rahu in house 5', () => {
    expect(vaibhaviCtx.areConjunct(1, 7)).toBe(true);
  });

  // Mars(2) and Ketu(8) are both in house 11

  it('areConjunct(2, 8) — Mars and Ketu in house 11', () => {
    expect(vaibhaviCtx.areConjunct(2, 8)).toBe(true);
  });

  // Sun(0) and Venus(5) are both in house 10

  it('areConjunct(0, 5) — Sun and Venus in house 10', () => {
    expect(vaibhaviCtx.areConjunct(0, 5)).toBe(true);
  });

  // ── Saturn aspects for Vaibhavi ──
  // Saturn(6) in house 12. Saturn aspects 3rd, 7th, 10th from itself.
  // From house 12: 3rd = house 2, 7th = house 6, 10th = house 9

  it('Saturn aspects 3rd, 7th, 10th from its position', () => {
    expect(vaibhaviCtx.doesAspect(6, 2)).toBe(true);  // 3rd from 12
    expect(vaibhaviCtx.doesAspect(6, 6)).toBe(true);  // 7th from 12
    expect(vaibhaviCtx.doesAspect(6, 9)).toBe(true);  // 10th from 12
    expect(vaibhaviCtx.doesAspect(6, 5)).toBe(false); // not an aspect target
  });

  // ── House sign mapping ──
  // Virgo lagna: house 1 = Virgo (6), house 2 = Libra (7), ..., house 4 = Sagittarius (9)

  it('houseSign maps correctly for Virgo lagna', () => {
    expect(vaibhaviCtx.houseSign(1)).toBe(6);  // Virgo
    expect(vaibhaviCtx.houseSign(2)).toBe(7);  // Libra
    expect(vaibhaviCtx.houseSign(4)).toBe(9);  // Sagittarius
    expect(vaibhaviCtx.houseSign(10)).toBe(3); // Gemini
    expect(vaibhaviCtx.houseSign(12)).toBe(5); // Leo
  });

  // ── Jupiter retrograde ──

  it('Jupiter(4) is retrograde in Vaibhavi chart', () => {
    expect(vaibhaviCtx.isRetrograde(4)).toBe(true);
  });

  // ── Venus combust ──

  it('Venus(5) is combust in Vaibhavi chart', () => {
    expect(vaibhaviCtx.isCombust(5)).toBe(true);
  });
});

// ==========================================================================
// HOUSE SIGN MAPPING — edge cases
// ==========================================================================

describe('Yoga Context — House/sign edge cases', () => {
  it('house 12 wraps correctly for Aquarius lagna', () => {
    // Aquarius (11) + 11 houses = sign ((11-1+12-1)%12)+1 = 10 (Capricorn)
    expect(arjunCtx.houseSign(12)).toBe(10);
  });

  it('houseOffset wraps around correctly', () => {
    expect(arjunCtx.houseOffset(11, 2)).toBe(4);  // 11→12→1→2 = 4 houses
    expect(arjunCtx.houseOffset(1, 12)).toBe(12);
  });

  it('all 9 planets have valid data in both contexts', () => {
    for (let pid = 0; pid <= 8; pid++) {
      const house = arjunCtx.planetHouse(pid);
      const sign = arjunCtx.planetSign(pid);
      expect(house).toBeGreaterThanOrEqual(1);
      expect(house).toBeLessThanOrEqual(12);
      expect(sign).toBeGreaterThanOrEqual(1);
      expect(sign).toBeLessThanOrEqual(12);

      const house2 = vaibhaviCtx.planetHouse(pid);
      const sign2 = vaibhaviCtx.planetSign(pid);
      expect(house2).toBeGreaterThanOrEqual(1);
      expect(house2).toBeLessThanOrEqual(12);
      expect(sign2).toBeGreaterThanOrEqual(1);
      expect(sign2).toBeLessThanOrEqual(12);
    }
  });

  it('planetLongitude is in range [0, 360) for all planets', () => {
    for (let pid = 0; pid <= 8; pid++) {
      const lon = arjunCtx.planetLongitude(pid);
      expect(lon).toBeGreaterThanOrEqual(0);
      expect(lon).toBeLessThan(360);
    }
  });

  it('planetDegreeInSign is in range [0, 30) for all planets', () => {
    for (let pid = 0; pid <= 8; pid++) {
      const deg = arjunCtx.planetDegreeInSign(pid);
      expect(deg).toBeGreaterThanOrEqual(0);
      expect(deg).toBeLessThan(30);
    }
  });
});
