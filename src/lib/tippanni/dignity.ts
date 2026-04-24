/**
 * Planetary Dignity System
 * Based on BPHS Ch.3-4, Brihat Jataka Ch.1-2, Uttara Kalamrita Ch.3
 *
 * Determines a planet's strength based on its sign placement:
 * Exalted > Moolatrikona > Own Sign > Friendly > Neutral > Enemy > Debilitated
 */

export type DignityState =
  | 'exalted'
  | 'moolatrikona'
  | 'own'
  | 'friendly'
  | 'neutral'
  | 'enemy'
  | 'debilitated';

export type RelationshipLevel =
  | 'best-friend'
  | 'friend'
  | 'neutral'
  | 'enemy'
  | 'bitter-enemy';

export interface DignityInfo {
  sign: number; // 1-based sign index
  degree: number;
}

export interface MoolatrikonaInfo {
  sign: number;
  startDeg: number;
  endDeg: number;
}

// Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn

/** Exaltation signs and exact degrees (BPHS Ch.3) */
export const EXALTATION_SIGNS: Record<number, DignityInfo> = {
  0: { sign: 1, degree: 10 },   // Sun exalted in Aries at 10deg
  1: { sign: 2, degree: 3 },    // Moon exalted in Taurus at 3deg
  2: { sign: 10, degree: 28 },  // Mars exalted in Capricorn at 28deg
  3: { sign: 6, degree: 15 },   // Mercury exalted in Virgo at 15deg
  4: { sign: 4, degree: 5 },    // Jupiter exalted in Cancer at 5deg
  5: { sign: 12, degree: 27 },  // Venus exalted in Pisces at 27deg
  6: { sign: 7, degree: 20 },   // Saturn exalted in Libra at 20deg
};

/** Debilitation signs (exactly opposite to exaltation) */
export const DEBILITATION_SIGNS: Record<number, DignityInfo> = {
  0: { sign: 7, degree: 10 },   // Sun debilitated in Libra at 10deg
  1: { sign: 8, degree: 3 },    // Moon debilitated in Scorpio at 3deg
  2: { sign: 4, degree: 28 },   // Mars debilitated in Cancer at 28deg
  3: { sign: 12, degree: 15 },  // Mercury debilitated in Pisces at 15deg
  4: { sign: 10, degree: 5 },   // Jupiter debilitated in Capricorn at 5deg
  5: { sign: 6, degree: 27 },   // Venus debilitated in Virgo at 27deg
  6: { sign: 1, degree: 20 },   // Saturn debilitated in Aries at 20deg
};

/** Own signs for each planet (1-based sign indices) */
export const OWN_SIGNS: Record<number, number[]> = {
  0: [5],        // Sun: Leo
  1: [4],        // Moon: Cancer
  2: [1, 8],     // Mars: Aries, Scorpio
  3: [3, 6],     // Mercury: Gemini, Virgo
  4: [9, 12],    // Jupiter: Sagittarius, Pisces
  5: [2, 7],     // Venus: Taurus, Libra
  6: [10, 11],   // Saturn: Capricorn, Aquarius
};

/** Moolatrikona signs and degree ranges (BPHS Ch.4 — canonical values) */
export const MOOLATRIKONA: Record<number, MoolatrikonaInfo> = {
  0: { sign: 5, startDeg: 0, endDeg: 20 },    // Sun: Leo 0-20°
  1: { sign: 2, startDeg: 4, endDeg: 20 },     // Moon: Taurus 4-20° (NOT 3-30)
  2: { sign: 1, startDeg: 0, endDeg: 12 },     // Mars: Aries 0-12°
  3: { sign: 6, startDeg: 16, endDeg: 20 },    // Mercury: Virgo 16-20°
  4: { sign: 9, startDeg: 0, endDeg: 10 },     // Jupiter: Sagittarius 0-10°
  5: { sign: 7, startDeg: 0, endDeg: 5 },      // Venus: Libra 0-5° (NOT 0-15)
  6: { sign: 11, startDeg: 0, endDeg: 20 },    // Saturn: Aquarius 0-20°
};

/** Natural friendship table (BPHS Ch.3, Brihat Jataka)
 *  Each planet has natural friends, neutrals, and enemies */
export const NATURAL_FRIENDSHIP: Record<number, { friends: number[]; neutrals: number[]; enemies: number[] }> = {
  // Sun
  0: { friends: [1, 2, 4], neutrals: [3], enemies: [5, 6] },
  // Moon
  1: { friends: [0, 3], neutrals: [2, 4, 5, 6], enemies: [] },
  // Mars
  2: { friends: [0, 1, 4], neutrals: [5, 6], enemies: [3] },
  // Mercury
  3: { friends: [0, 5], neutrals: [2, 4, 6], enemies: [1] },
  // Jupiter
  4: { friends: [0, 1, 2], neutrals: [6], enemies: [3, 5] },
  // Venus
  5: { friends: [3, 6], neutrals: [2, 4], enemies: [0, 1] },
  // Saturn
  6: { friends: [3, 5], neutrals: [4], enemies: [0, 1, 2] },
};

/**
 * Get planetary dignity for a planet in a given sign and degree
 * Priority: Exalted > Debilitated > Moolatrikona > Own > friendship-based
 */
export function getPlanetDignity(
  planetId: number,
  signIndex: number, // 1-based
  degree: number
): DignityState {
  if (planetId > 6) return 'neutral'; // Rahu/Ketu use different system

  // Check exaltation
  const exalt = EXALTATION_SIGNS[planetId];
  if (exalt && exalt.sign === signIndex) return 'exalted';

  // Check debilitation
  const debil = DEBILITATION_SIGNS[planetId];
  if (debil && debil.sign === signIndex) return 'debilitated';

  // Check moolatrikona
  const mt = MOOLATRIKONA[planetId];
  if (mt && mt.sign === signIndex && degree >= mt.startDeg && degree <= mt.endDeg) {
    return 'moolatrikona';
  }

  // Check own sign
  const own = OWN_SIGNS[planetId];
  if (own && own.includes(signIndex)) return 'own';

  // Determine through natural friendship with sign lord
  const signLords: Record<number, number> = {
    1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
    7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
  };
  const signLord = signLords[signIndex];
  if (signLord === undefined) return 'neutral';

  const friendship = NATURAL_FRIENDSHIP[planetId];
  if (!friendship) return 'neutral';

  if (friendship.friends.includes(signLord)) return 'friendly';
  if (friendship.enemies.includes(signLord)) return 'enemy';
  return 'neutral';
}

/**
 * Calculate compound (Pancha-dha) relationship between two planets
 * Combines natural friendship + temporary friendship (based on house positions)
 * BPHS Ch.3, Uttara Kalamrita Ch.3
 */
export function getCompoundRelationship(
  planet1Id: number,
  planet2Id: number,
  planet1House: number,
  planet2House: number
): RelationshipLevel {
  if (planet1Id > 6 || planet2Id > 6) return 'neutral';

  // Natural relationship
  const natural = NATURAL_FRIENDSHIP[planet1Id];
  let naturalScore = 0;
  if (natural.friends.includes(planet2Id)) naturalScore = 1;
  else if (natural.enemies.includes(planet2Id)) naturalScore = -1;

  // Temporary relationship: planets in 2,3,4,10,11,12 from each other are temporary friends
  // planets in 1,5,6,7,8,9 are temporary enemies
  const dist = ((planet2House - planet1House + 12) % 12) + 1;
  const tempFriendHouses = [2, 3, 4, 10, 11, 12];
  const temporaryScore = tempFriendHouses.includes(dist) ? 1 : -1;

  const total = naturalScore + temporaryScore;
  if (total >= 2) return 'best-friend';
  if (total === 1) return 'friend';
  if (total === 0) return 'neutral';
  if (total === -1) return 'enemy';
  return 'bitter-enemy';
}
