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

// Canonical dignity constants  –  single source of truth (Lesson Q)
import {
  EXALTATION_SIGNS as CANONICAL_EXALTATION,
  EXALTATION_DEGREES,
  DEBILITATION_SIGNS as CANONICAL_DEBILITATION,
  OWN_SIGNS,
  MOOLATRIKONA,
  SIGN_LORDS,
} from '@/lib/constants/dignities';

/** Exaltation signs with exact degrees  –  derived from canonical dignities.ts */
export const EXALTATION_SIGNS: Record<number, DignityInfo> = Object.fromEntries(
  Object.entries(CANONICAL_EXALTATION)
    .filter(([id]) => Number(id) <= 6)
    .map(([id, sign]) => [Number(id), { sign, degree: EXALTATION_DEGREES[Number(id)] ?? 0 }])
);

/** Debilitation signs with exact degrees (opposite of exaltation)  –  derived from canonical dignities.ts */
export const DEBILITATION_SIGNS: Record<number, DignityInfo> = Object.fromEntries(
  Object.entries(CANONICAL_DEBILITATION)
    .filter(([id]) => Number(id) <= 6)
    .map(([id, sign]) => [Number(id), { sign, degree: EXALTATION_DEGREES[Number(id)] ?? 0 }])
);

export { OWN_SIGNS, MOOLATRIKONA };

/** Natural friendship table (BPHS Ch.3, Brihat Jataka).
 *  P2-33 / Lesson Q — re-exported from the canonical
 *  `@/lib/constants/friendships`. The local copy here only listed planets
 *  0–6 (guarded by `planet1Id > 6` at call sites) and used the `.neutrals`
 *  field name. The canonical table includes 7 (Rahu) and 8 (Ketu) too —
 *  the existing guard remains in place so adding them doesn't change
 *  consumer behaviour. Call sites already only use `.friends` + `.enemies`,
 *  so the singular `.neutral` field on the canonical type is unused here.
 */
export { NATURAL_FRIENDSHIP } from '@/lib/constants/friendships';
import { NATURAL_FRIENDSHIP } from '@/lib/constants/friendships';

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
  // SIGN_LORDS imported from @/lib/constants/dignities (Lesson Q  –  single source of truth)
  const signLord = SIGN_LORDS[signIndex];
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
