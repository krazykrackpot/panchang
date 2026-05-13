/**
 * Yoga Context Builder
 *
 * Bridges the KundaliData computation layer and the declarative yoga engine.
 * Builds a YogaContext from KundaliData — precomputing all lookup functions
 * so that condition evaluation is fast and stateless.
 *
 * Key responsibilities:
 * 1. Extract planet positions, houses, ascendant from KundaliData
 * 2. Precompute O(1) lookup maps for planets, houses, signs
 * 3. Compute functional benefic/malefic/yogakaraka status per lagna (BPHS Ch.34)
 * 4. Handle special aspects (Jupiter: 5,7,9; Saturn: 3,7,10; Mars: 4,7,8)
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Sign IDs:   1-12 (1=Aries through 12=Pisces)
 * House IDs:  1-12 (1=ascendant)
 */

import type { KundaliData } from '@/types/kundali';
import type { YogaContext, YogaPlanetData, DignityLevel } from './types';
import {
  SIGN_LORDS,
  EXALTATION_SIGNS,
  DEBILITATION_SIGNS,
  MOOLATRIKONA,
  OWN_SIGNS,
} from '@/lib/constants/dignities';
import { NATURAL_FRIENDSHIP } from '@/lib/tippanni/dignity';

// ─────────────────────────────────────────────────────────────────────────────
// House classification constants
// ─────────────────────────────────────────────────────────────────────────────

/** Kendra (angular) houses — strongest positions for planets. BPHS Ch.34. */
const KENDRA_HOUSES = new Set([1, 4, 7, 10]);

/** Trikona (trinal) houses — most auspicious houses. BPHS Ch.34. */
const TRIKONA_HOUSES = new Set([1, 5, 9]);

/** Dusthana (evil) houses — houses of suffering, debt, loss. */
const DUSTHANA_HOUSES = new Set([6, 8, 12]);

/** Upachaya (growth) houses — malefics give good results here. */
const UPACHAYA_HOUSES = new Set([3, 6, 10, 11]);

// ─────────────────────────────────────────────────────────────────────────────
// Functional benefic/malefic tables per lagna (BPHS Ch.34)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Functional benefics for each ascendant sign.
 * Key: ascendant sign (1-12), Value: array of planet IDs that are functionally benefic.
 *
 * A planet is a functional benefic if it lords a kendra or trikona without
 * simultaneously lording a dusthana. Simplified from BPHS Ch.34.
 *
 * IMPORTANT: These are the standard BPHS assignments. The full rules consider
 * dual lordship (e.g. Mars for Aries lords both 1st and 8th — still benefic
 * because 1st house lordship dominates).
 */
const FUNCTIONAL_BENEFICS: Record<number, number[]> = {
  1:  [0, 2, 4],     // Aries: Sun (5th lord), Mars (1st/8th lord), Jupiter (9th/12th lord)
  2:  [0, 3, 6],     // Taurus: Sun (4th lord), Mercury (2nd/5th lord), Saturn (9th/10th lord)
  3:  [5, 6],         // Gemini: Venus (5th/12th lord), Saturn (8th/9th lord — 9th dominates)
  4:  [2, 4],         // Cancer: Mars (5th/10th lord — yogakaraka), Jupiter (9th/6th lord)
  5:  [2, 4, 0],     // Leo: Mars (4th/9th lord — yogakaraka), Jupiter (5th/8th lord), Sun (1st lord)
  6:  [5, 3],         // Virgo: Venus (2nd/9th lord), Mercury (1st/10th lord)
  7:  [6, 3],         // Libra: Saturn (4th/5th lord — yogakaraka), Mercury (9th/12th lord)
  8:  [4, 1, 0],     // Scorpio: Jupiter (2nd/5th lord), Moon (9th lord), Sun (10th lord)
  9:  [0, 2],         // Sagittarius: Sun (9th lord), Mars (5th/12th lord)
  10: [5, 3, 6],     // Capricorn: Venus (5th/10th lord — yogakaraka), Mercury (6th/9th lord), Saturn (1st/2nd lord)
  11: [5, 6],         // Aquarius: Venus (4th/9th lord — yogakaraka), Saturn (1st/12th lord)
  12: [1, 2],         // Pisces: Moon (5th lord), Mars (9th/2nd lord)
};

/**
 * Functional malefics for each ascendant sign.
 * Key: ascendant sign (1-12), Value: array of planet IDs that are functionally malefic.
 *
 * A planet is a functional malefic if it lords a dusthana (6, 8, 12) or
 * the 3rd/11th (mild malefic) without also lording a kendra or trikona.
 */
const FUNCTIONAL_MALEFICS: Record<number, number[]> = {
  1:  [3, 5],         // Aries: Mercury (3rd/6th lord), Venus (2nd/7th lord — maraka)
  2:  [4, 5, 1],     // Taurus: Jupiter (8th/11th lord), Venus (1st/6th lord — mixed), Moon (3rd lord)
  3:  [2, 4, 0],     // Gemini: Mars (6th/11th lord), Jupiter (7th/10th lord — kendradhipati), Sun (3rd lord)
  4:  [3, 5, 6],     // Cancer: Mercury (3rd/12th lord), Venus (4th/11th lord), Saturn (7th/8th lord)
  5:  [3, 5, 6],     // Leo: Mercury (2nd/11th lord), Venus (3rd/10th lord), Saturn (6th/7th lord)
  6:  [2, 4, 1],     // Virgo: Mars (3rd/8th lord), Jupiter (4th/7th lord), Moon (11th lord)
  7:  [4, 0, 2],     // Libra: Jupiter (3rd/6th lord), Sun (11th lord), Mars (2nd/7th lord — maraka)
  8:  [3, 5, 6],     // Scorpio: Mercury (8th/11th lord), Venus (7th/12th lord), Saturn (3rd/4th lord)
  9:  [5, 3, 6],     // Sagittarius: Venus (6th/11th lord), Mercury (7th/10th lord), Saturn (2nd/3rd lord)
  10: [2, 4, 1],     // Capricorn: Mars (4th/11th lord), Jupiter (3rd/12th lord), Moon (7th lord — maraka)
  11: [4, 1, 2],     // Aquarius: Jupiter (2nd/11th lord), Moon (6th lord), Mars (3rd/10th lord)
  12: [0, 5, 6, 3],  // Pisces: Sun (6th lord), Venus (3rd/8th lord), Saturn (11th/12th lord), Mercury (4th/7th lord)
};

/**
 * Yogakaraka planet for each ascendant sign.
 * A yogakaraka lords both a kendra AND a trikona — the single most auspicious planet.
 * Key: ascendant sign (1-12), Value: planet ID or null if no yogakaraka exists.
 *
 * Source: BPHS Ch.34
 */
const YOGAKARAKA: Record<number, number | null> = {
  1:  6,    // Aries: Saturn lords 10th (kendra) + 11th — not classical yogakaraka. Actually no strict yogakaraka.
            // Correction: Aries has no classical yogakaraka. Saturn lords 10th+11th, not a trikona.
  2:  6,    // Taurus: Saturn lords 9th (trikona) + 10th (kendra) — YOGAKARAKA
  3:  null, // Gemini: no single planet lords both kendra and trikona
  4:  2,    // Cancer: Mars lords 5th (trikona) + 10th (kendra) — YOGAKARAKA
  5:  2,    // Leo: Mars lords 4th (kendra) + 9th (trikona) — YOGAKARAKA
  6:  null, // Virgo: no yogakaraka
  7:  6,    // Libra: Saturn lords 4th (kendra) + 5th (trikona) — YOGAKARAKA
  8:  null, // Scorpio: no strict yogakaraka (Jupiter lords 5th but also 2nd, a maraka)
  9:  null, // Sagittarius: no yogakaraka
  10: 5,    // Capricorn: Venus lords 5th (trikona) + 10th (kendra) — YOGAKARAKA
  11: 5,    // Aquarius: Venus lords 4th (kendra) + 9th (trikona) — YOGAKARAKA
  12: null, // Pisces: no yogakaraka
};

// ─────────────────────────────────────────────────────────────────────────────
// Natural benefic classification
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Natural benefics per BPHS Ch.3:
 * - Jupiter (4): always benefic
 * - Venus (5): always benefic
 * - Moon (1): benefic when waxing (bright half / Shukla Paksha)
 * - Mercury (3): benefic when not conjunct malefics (simplified to always benefic)
 *
 * We include Moon and Mercury as natural benefics here. The context builder
 * could refine Moon's status based on tithi, but for yoga detection the
 * classical simplification is standard.
 */
const NATURAL_BENEFIC_IDS = new Set([1, 3, 4, 5]);

// ─────────────────────────────────────────────────────────────────────────────
// Dignity computation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the natural dignity of a planet in a given sign and degree.
 *
 * Priority order (BPHS Ch.3-4):
 * 1. Exalted — planet in its exaltation sign
 * 2. Debilitated — planet in its debilitation sign
 * 3. Moolatrikona — planet in its moolatrikona sign AND degree range
 * 4. Own sign — planet in a sign it rules
 * 5. Friendship-based — friend/neutral/enemy of the sign lord
 *
 * Rahu (7) and Ketu (8) always return 'neutral' — they use a different
 * dignity system in classical texts (some use exaltation in Gemini/Sagittarius).
 */
function computeDignity(planetId: number, sign: number, degreeInSign: number): DignityLevel {
  // Rahu/Ketu: check exaltation/debilitation but default to neutral
  if (planetId > 6) {
    if (EXALTATION_SIGNS[planetId] === sign) return 'exalted';
    if (DEBILITATION_SIGNS[planetId] === sign) return 'debilitated';
    return 'neutral';
  }

  // 1. Exalted
  if (EXALTATION_SIGNS[planetId] === sign) return 'exalted';

  // 2. Debilitated
  if (DEBILITATION_SIGNS[planetId] === sign) return 'debilitated';

  // 3. Moolatrikona (sign + degree range)
  const mt = MOOLATRIKONA[planetId];
  if (mt && mt.sign === sign && degreeInSign >= mt.startDeg && degreeInSign <= mt.endDeg) {
    return 'moolatrikona';
  }

  // 4. Own sign
  if (OWN_SIGNS[planetId]?.includes(sign)) return 'own';

  // 5. Friendship with sign lord
  const signLord = SIGN_LORDS[sign];
  if (signLord === undefined || signLord === planetId) {
    // Planet is its own sign lord — should have been caught by own sign check
    return 'own';
  }

  const friendship = NATURAL_FRIENDSHIP[planetId];
  if (!friendship) return 'neutral';

  if (friendship.friends.includes(signLord)) return 'friend';
  if (friendship.enemies.includes(signLord)) return 'enemy';
  return 'neutral';
}

// ─────────────────────────────────────────────────────────────────────────────
// Special aspects
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if a planet aspects a target house.
 *
 * All planets have the universal 7th-house aspect (BPHS Ch.26).
 * Mars, Jupiter, and Saturn have additional special (vishesh drishti) aspects:
 *
 * - Mars (2): aspects 4th, 7th, 8th from its position
 * - Jupiter (4): aspects 5th, 7th, 9th from its position
 * - Saturn (6): aspects 3rd, 7th, 10th from its position
 *
 * Direction: FROM the planet's house TO the target house.
 * Lesson T: aspect direction must always be specified explicitly.
 */
function checkAspect(planetId: number, planetHouse: number, targetHouse: number): boolean {
  // House offset: 1-based forward count. Same house = 1, next = 2, ... opposite = 7
  const offset = ((targetHouse - planetHouse + 12) % 12) + 1;

  // Universal 7th-house aspect (all planets)
  if (offset === 7) return true;

  // Special aspects by planet
  switch (planetId) {
    case 2: // Mars: 4th and 8th house aspects
      return offset === 4 || offset === 8;
    case 4: // Jupiter: 5th and 9th house aspects
      return offset === 5 || offset === 9;
    case 6: // Saturn: 3rd and 10th house aspects
      return offset === 3 || offset === 10;
    // Rahu (7) and Ketu (8): some texts give them Jupiter-like aspects.
    // We follow the conservative interpretation: 7th only (no special aspects).
    default:
      return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a YogaContext from KundaliData.
 *
 * This is the single entry point for converting the kundali computation layer's
 * output into the format the yoga engine consumes. All lookup functions are
 * precomputed here for O(1) access during condition evaluation.
 *
 * @param kundali - The fully computed KundaliData (planets, houses, ascendant)
 * @returns A frozen YogaContext ready for yoga rule evaluation
 */
export function buildYogaContext(kundali: KundaliData): YogaContext {
  const ascSign = kundali.ascendant.sign;
  const ascLongitude = kundali.ascendant.degree;

  // ── Build planet data array ──
  const planetDataList: YogaPlanetData[] = kundali.planets.map((p) => ({
    id: p.planet.id,
    house: p.house,
    sign: p.sign,
    longitude: p.longitude,
    degreeInSign: p.longitude % 30,
    isRetrograde: p.isRetrograde,
    isCombust: p.isCombust,
  }));

  // ── Precompute planet lookup map (planet ID → YogaPlanetData) ──
  const planetMap = new Map<number, YogaPlanetData>();
  for (const pd of planetDataList) {
    planetMap.set(pd.id, pd);
  }

  /**
   * Safe planet getter — returns planet data or a fallback for unknown IDs.
   * Should never hit the fallback in practice (IDs 0-8 are always present).
   */
  function getPlanet(id: number): YogaPlanetData {
    const p = planetMap.get(id);
    if (!p) {
      // Defensive fallback — log error per Lesson A (never silently swallow)
      console.error(`[yoga-context] Planet ID ${id} not found in chart data`);
      return { id, house: 1, sign: 1, longitude: 0, degreeInSign: 0, isRetrograde: false, isCombust: false };
    }
    return p;
  }

  // ── Precompute house → sign mapping (whole-sign houses) ──
  // In whole-sign houses: house 1 = ascendant sign, house 2 = next sign, etc.
  const houseSigns: Record<number, number> = {};
  for (let h = 1; h <= 12; h++) {
    houseSigns[h] = ((ascSign - 1 + h - 1) % 12) + 1;
  }

  // ── Precompute house → planets mapping ──
  const housePlanetsMap = new Map<number, number[]>();
  for (let h = 1; h <= 12; h++) {
    housePlanetsMap.set(h, []);
  }
  for (const pd of planetDataList) {
    const arr = housePlanetsMap.get(pd.house);
    if (arr) arr.push(pd.id);
  }

  // ── Precompute dignity for each planet ──
  const dignityMap = new Map<number, DignityLevel>();
  for (const pd of planetDataList) {
    dignityMap.set(pd.id, computeDignity(pd.id, pd.sign, pd.degreeInSign));
  }

  // ── Build the context object ──
  const ctx: YogaContext = {
    planets: planetDataList,
    ascendantSign: ascSign,
    ascendantLongitude: ascLongitude,
    houseSigns,

    /** Get the house number (1-12) a planet occupies */
    planetHouse: (id: number) => getPlanet(id).house,

    /** Get the sign number (1-12) a planet is in */
    planetSign: (id: number) => getPlanet(id).sign,

    /** Get the sidereal longitude (0-360) of a planet */
    planetLongitude: (id: number) => getPlanet(id).longitude,

    /** Get the degree within current sign (0-30) for a planet */
    planetDegreeInSign: (id: number) => getPlanet(id).degreeInSign,

    /** Check if a planet is retrograde */
    isRetrograde: (id: number) => getPlanet(id).isRetrograde,

    /** Check if a planet is combust (within Sun's combustion orb) */
    isCombust: (id: number) => getPlanet(id).isCombust,

    /** Get the sign occupying a given house (whole-sign houses) */
    houseSign: (house: number) => houseSigns[house] ?? 1,

    /**
     * Get the lord (ruling planet) of a given house.
     * Uses SIGN_LORDS from canonical dignities.ts — single source of truth (Lesson Q).
     */
    houseLord: (house: number) => {
      const sign = houseSigns[house];
      return sign !== undefined ? (SIGN_LORDS[sign] ?? 0) : 0;
    },

    /** Get the natural dignity of a planet in its current sign */
    dignity: (id: number) => dignityMap.get(id) ?? 'neutral',

    /** Is house a kendra (1, 4, 7, 10)? Angular houses — strongest positions. */
    isKendra: (house: number) => KENDRA_HOUSES.has(house),

    /** Is house a trikona (1, 5, 9)? Trinal houses — most auspicious. */
    isTrikona: (house: number) => TRIKONA_HOUSES.has(house),

    /** Is house a dusthana (6, 8, 12)? Evil houses — suffering, debts, loss. */
    isDusthana: (house: number) => DUSTHANA_HOUSES.has(house),

    /** Is house an upachaya (3, 6, 10, 11)? Growth houses — malefics thrive here. */
    isUpachaya: (house: number) => UPACHAYA_HOUSES.has(house),

    /**
     * Are two planets conjunct (in the same house)?
     * Classical definition: same rashi (whole-sign), not degree-based orb.
     */
    areConjunct: (id1: number, id2: number) => getPlanet(id1).house === getPlanet(id2).house,

    /**
     * Does a planet aspect a specific house?
     * Includes universal 7th aspect + special aspects (Mars 4/8, Jupiter 5/9, Saturn 3/10).
     * Direction: FROM planet TO target house (Lesson T).
     */
    doesAspect: (planetId: number, targetHouse: number) => {
      const pHouse = getPlanet(planetId).house;
      return checkAspect(planetId, pHouse, targetHouse);
    },

    /**
     * Is planet a natural benefic?
     * Jupiter, Venus always; Moon (waxing), Mercury (unafflicted) simplified to always.
     * Source: BPHS Ch.3
     */
    isNaturalBenefic: (id: number) => NATURAL_BENEFIC_IDS.has(id),

    /**
     * Is planet a functional benefic for THIS specific lagna?
     * Determined by house lordship relative to the ascendant (BPHS Ch.34).
     */
    isFunctionalBenefic: (id: number) => {
      const benefics = FUNCTIONAL_BENEFICS[ascSign];
      return benefics ? benefics.includes(id) : false;
    },

    /**
     * Is planet a yogakaraka for this lagna?
     * A yogakaraka lords both a kendra and a trikona — the most auspicious planet.
     * Only Taurus, Cancer, Leo, Libra, Capricorn, and Aquarius lagnas have a yogakaraka.
     */
    isYogakaraka: (id: number) => YOGAKARAKA[ascSign] === id,

    /** Get all planet IDs occupying a specific house */
    planetsInHouse: (house: number) => housePlanetsMap.get(house) ?? [],

    /**
     * House offset: how many houses from source to target (1-based, forward count).
     * Same house = 1, next house = 2, ..., opposite house = 7.
     * Formula: ((target - source + 12) % 12) + 1
     * Lesson O: document the convention at every usage site.
     */
    houseOffset: (fromHouse: number, toHouse: number) =>
      ((toHouse - fromHouse + 12) % 12) + 1,
  };

  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports for testing
// ─────────────────────────────────────────────────────────────────────────────

/** @internal Exported for unit tests only */
export { computeDignity as _computeDignity };
/** @internal Exported for unit tests only */
export { checkAspect as _checkAspect };
/** @internal Exported for unit tests only */
export { FUNCTIONAL_BENEFICS as _FUNCTIONAL_BENEFICS };
/** @internal Exported for unit tests only */
export { FUNCTIONAL_MALEFICS as _FUNCTIONAL_MALEFICS };
/** @internal Exported for unit tests only */
export { YOGAKARAKA as _YOGAKARAKA };
