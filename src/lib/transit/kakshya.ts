/**
 * Kakshya Sub-Transit Timing
 *
 * Per BPHS Ch.70, each sign is divided into 8 kakshyas (sub-divisions)
 * owned by planets in a fixed order. When a planet transits a sign,
 * the specific kakshya it occupies determines WHICH planet's BAV score applies.
 *
 * Kakshya owner sequence (same for all signs):
 *   Saturn(6), Jupiter(4), Mars(2), Sun(0), Venus(5), Mercury(3), Moon(1), Lagna(99)
 * Each kakshya spans 3°45' (30°/8 = 3.75°).
 */

export interface KakshyaPosition {
  sign: number;           // 1-12
  kakshyaIndex: number;   // 0-7
  kakshyaLord: number;    // planet id of kakshya owner (0-6, or 99 for Lagna)
  kakshyaLordName: string;
  degreeRange: { start: number; end: number }; // degree within sign
}

/**
 * Kakshya lord sequence — BPHS Ch.70.
 * Saturn(6), Jupiter(4), Mars(2), Sun(0), Venus(5), Mercury(3), Moon(1), Lagna(99)
 */
const KAKSHYA_LORDS = [6, 4, 2, 0, 5, 3, 1, 99] as const;

const KAKSHYA_LORD_NAMES: Record<number, string> = {
  0: 'Sun',
  1: 'Moon',
  2: 'Mars',
  3: 'Mercury',
  4: 'Jupiter',
  5: 'Venus',
  6: 'Saturn',
  99: 'Lagna',
};

/** Width of one kakshya in degrees */
const KAKSHYA_SPAN = 3.75; // 30 / 8

/**
 * Determine which kakshya a planet occupies given its sidereal longitude (0-360).
 */
export function getKakshyaPosition(longitude: number): KakshyaPosition {
  // Normalize longitude to 0-360
  const normLon = ((longitude % 360) + 360) % 360;

  // Sign is 1-based: Aries=1 .. Pisces=12
  const sign = Math.floor(normLon / 30) + 1;

  // Degree within the sign (0-30)
  const degInSign = normLon % 30;

  // Kakshya index (0-7)
  const kakshyaIndex = Math.min(Math.floor(degInSign / KAKSHYA_SPAN), 7);

  const kakshyaLord = KAKSHYA_LORDS[kakshyaIndex];
  const kakshyaLordName = KAKSHYA_LORD_NAMES[kakshyaLord] ?? 'Unknown';

  const start = kakshyaIndex * KAKSHYA_SPAN;
  const end = start + KAKSHYA_SPAN;

  return {
    sign,
    kakshyaIndex,
    kakshyaLord,
    kakshyaLordName,
    degreeRange: { start, end },
  };
}

/**
 * Get the BAV score relevant for a planet's current kakshya.
 *
 * If planet P is in sign S at kakshya owned by planet K,
 * the effective BAV score = bpiTable[K][S-1] (K's bindu contribution to sign S).
 * If kakshya lord is Lagna (99), use the SAV score for that sign.
 *
 * @param longitude   - sidereal longitude of the transiting planet (0-360)
 * @param bpiTable    - 7×12 Bhinnashtakavarga table (rows: planets 0-6, cols: signs 0-11)
 * @param savTable    - 12-element Sarvashtakavarga (one score per sign, index 0-11)
 */
export function getKakshyaBavScore(
  longitude: number,
  bpiTable: number[][],
  savTable: number[],
): { kakshya: KakshyaPosition; bavScore: number } {
  const kakshya = getKakshyaPosition(longitude);
  const signIndex = kakshya.sign - 1; // 0-based

  let bavScore: number;
  if (kakshya.kakshyaLord === 99) {
    // Lagna kakshya — use SAV score for this sign
    bavScore = savTable[signIndex] ?? 0;
  } else {
    // Planet kakshya — use that planet's BAV row for this sign
    const planetRow = bpiTable[kakshya.kakshyaLord];
    bavScore = planetRow ? (planetRow[signIndex] ?? 0) : 0;
  }

  return { kakshya, bavScore };
}
