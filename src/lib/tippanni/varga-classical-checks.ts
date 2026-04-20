/**
 * Classical Vedic Astrology Checks
 * Pushkara Navamsha/Bhaga, Gandanta, and Varga Visesha classification.
 */

import type {
  PushkaraCheck,
  GandantaCheck,
  VargaVisesha,
  DignityLevel,
} from './varga-tippanni-types-v2';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Pushkara Bhaga degrees per sign (1-indexed: Aries=1 ... Pisces=12). */
const PUSHKARA_BHAGA: Record<number, number> = {
  1: 21,  // Aries
  2: 14,  // Taurus
  3: 18,  // Gemini
  4: 8,   // Cancer
  5: 19,  // Leo
  6: 9,   // Virgo
  7: 24,  // Libra
  8: 11,  // Scorpio
  9: 23,  // Sagittarius
  10: 14, // Capricorn
  11: 19, // Aquarius
  12: 9,  // Pisces
};

/** Pushkara Navamsha signs (1-indexed): Taurus(2), Cancer(4), Sagittarius(9), Pisces(12). */
const PUSHKARA_NAVAMSHA_SIGNS = new Set([2, 4, 9, 12]);

/**
 * Navamsha starting sign by element of the rashi.
 * Fire signs (Aries, Leo, Sagittarius) → start from Aries(1)
 * Earth signs (Taurus, Virgo, Capricorn) → start from Capricorn(10)
 * Air signs (Gemini, Libra, Aquarius) → start from Libra(7)
 * Water signs (Cancer, Scorpio, Pisces) → start from Cancer(4)
 */
function navamshaStartSign(rashiId: number): number {
  const element = ((rashiId - 1) % 4);
  // Aries(1)=0=fire, Taurus(2)=1=earth, Gemini(3)=2=air, Cancer(4)=3=water
  switch (element) {
    case 0: return 1;  // Fire → Aries
    case 1: return 10; // Earth → Capricorn
    case 2: return 7;  // Air → Libra
    case 3: return 4;  // Water → Cancer
    default: return 1;
  }
}

/** Gandanta junction points (absolute degrees) — water→fire boundaries. */
const GANDANTA_JUNCTIONS = [
  { degree: 0,   label: 'Pisces\u2013Aries' },        // 360/0
  { degree: 120, label: 'Cancer\u2013Leo' },
  { degree: 240, label: 'Scorpio\u2013Sagittarius' },
];

const GANDANTA_MAX = 10 / 3; // 3°20' = 3.3333...°

// ---------------------------------------------------------------------------
// checkPushkara
// ---------------------------------------------------------------------------

export function checkPushkara(
  planetId: number,
  siderealLongitude: number,
): PushkaraCheck {
  const normLong = ((siderealLongitude % 360) + 360) % 360;
  const rashiId = Math.floor(normLong / 30) + 1; // 1-indexed
  const degreeInSign = normLong - (rashiId - 1) * 30;

  // --- Pushkara Bhaga ---
  const pushkaraDeg = PUSHKARA_BHAGA[rashiId];
  const isPushkaraBhaga = Math.abs(degreeInSign - pushkaraDeg) <= 1.0;

  // --- Pushkara Navamsha ---
  // Each sign has 9 navamsha padas of 3°20' each.
  const padaIndex = Math.floor(degreeInSign / (10 / 3)); // 0-8
  const startSign = navamshaStartSign(rashiId);
  // Navamsha sign = startSign + padaIndex, wrapped 1-12
  const navamshaSign = ((startSign - 1 + padaIndex) % 12) + 1;
  const isPushkaraNavamsha = PUSHKARA_NAVAMSHA_SIGNS.has(navamshaSign);

  return {
    planetId,
    isPushkaraNavamsha,
    isPushkaraBhaga,
    degree: degreeInSign,
  };
}

// ---------------------------------------------------------------------------
// checkGandanta
// ---------------------------------------------------------------------------

export function checkGandanta(
  planetId: number,
  siderealLongitude: number,
): GandantaCheck {
  const normLong = ((siderealLongitude % 360) + 360) % 360;

  let minDist = Infinity;
  let closestJunction = GANDANTA_JUNCTIONS[0];

  for (const junc of GANDANTA_JUNCTIONS) {
    // Distance considering the 0/360 wrap
    let dist: number;
    if (junc.degree === 0) {
      dist = Math.min(normLong, 360 - normLong);
    } else {
      dist = Math.abs(normLong - junc.degree);
    }
    if (dist < minDist) {
      minDist = dist;
      closestJunction = junc;
    }
  }

  const isGandanta = minDist <= GANDANTA_MAX;
  let severity: GandantaCheck['severity'];
  if (minDist <= 1) {
    severity = 'severe';
  } else if (minDist <= 2) {
    severity = 'moderate';
  } else if (minDist <= GANDANTA_MAX) {
    severity = 'mild';
  } else {
    severity = 'none';
  }

  return {
    planetId,
    isGandanta,
    severity,
    proximityDegrees: minDist,
    junction: isGandanta ? closestJunction.label : '',
  };
}

// ---------------------------------------------------------------------------
// classifyVargaVisesha
// ---------------------------------------------------------------------------

const STRONG_DIGNITIES: ReadonlySet<DignityLevel> = new Set(['exalted', 'own']);

export function classifyVargaVisesha(
  dignities: readonly DignityLevel[],
): VargaVisesha {
  const count = dignities.filter((d) => STRONG_DIGNITIES.has(d)).length;

  if (count >= 7) return 'devalokamsha';
  if (count === 6) return 'paravatamsha';
  if (count === 5) return 'simhasanamsha';
  if (count === 4) return 'gopuramsha';
  if (count === 3) return 'uttamamsha';
  if (count === 2) return 'parijatamsha';
  return 'none';
}
