/**
 * Bhavabala (House Strength) Calculator
 *
 * Computes the composite strength of each of the 12 bhavas (houses) in a
 * horoscope. Bhavabala is defined in BPHS Chapter 34 (Bhava Bala Adhyaya)
 * and quantifies how well each house can deliver its significations.
 *
 * The four strength components computed here are:
 *
 *   1. Bhavadhipati Bala — Strength of the house lord, derived from its
 *      Shadbala score (BPHS Ch.27). A strong lord empowers the house.
 *
 *   2. Bhava Dig Bala — Positional/directional strength based on the
 *      house's angular classification. Kendras (1,4,7,10) receive full
 *      strength (60), panaparas (2,5,8,11) moderate (30), and apoklimas
 *      (3,6,9,12) receive minimal (15). Ref: BPHS Ch.34, Shloka 3-4.
 *
 *   3. Bhava Drishti Bala — Net strength from planetary aspects (graha
 *      drishti) cast onto the house. Benefic aspects add +10 per aspect,
 *      malefic aspects subtract -10. Occupation is NOT counted here
 *      (separated into component 4). Ref: BPHS Ch.34, Shloka 5-8.
 *
 *   4. Bhava Graha Sambandha — Occupation strength: benefic planets
 *      residing in the house add +15 each, malefic planets subtract -15.
 *      This is distinct from Drishti Bala (aspect). Ref: BPHS Ch.34.
 *
 * The total for each house = sum of the four components.
 * strengthPercent is normalised against the 12-house average.
 *
 * Note: This is a simplified Bhavabala model. Full classical Bhavabala
 * also considers Bhava Madhya (mid-cusp) proximity and Bhava Sandhi
 * (junction) effects, which are not implemented here.
 */

import { normalizeDeg } from '@/lib/ephem/astronomical';

interface BhavaBalaInput {
  houses: { house: number; degree: number; sign: number; lord: string }[];
  planets: { id: number; longitude: number; house: number; sign: number; speed: number }[];
  shadbalaRupas: Record<number, number>;
  ascendantDeg: number;
}

export interface BhavaBalaResult {
  bhava: number;
  lordId: number;
  lordName: string;
  bhavadhipatiBala: number;
  bhavaDigBala: number;
  bhavaDrishtiBala: number;  // aspects only (not occupation)
  bhavaGrahaSambandha: number; // occupation: benefic +15, malefic -15
  total: number;
  strengthPercent: number;
}

/** Map planet English names to numeric IDs (0-based: 0=Sun through 6=Saturn).
 *  Rahu (7) and Ketu (8) are excluded because they do not own houses. */
const LORD_TO_ID: Record<string, number> = {
  'Sun': 0, 'Moon': 1, 'Mars': 2, 'Mercury': 3, 'Jupiter': 4, 'Venus': 5, 'Saturn': 6,
};

const PLANET_NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

/** Natural benefics per BPHS Ch.3: Moon, Mercury, Jupiter, Venus.
 *  Mercury is treated as unconditionally benefic here (simplified). */
const BENEFIC_IDS = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus
/** Natural malefics per BPHS Ch.3: Sun, Mars, Saturn, Rahu, Ketu. */
const MALEFIC_IDS = new Set([0, 2, 6, 7, 8]); // Sun, Mars, Saturn, Rahu, Ketu

/** Round to 2 decimal places for display precision. */
function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

/**
 * Bhava Dig Bala — directional strength assigned by house classification.
 *
 * Per BPHS Ch.34 Shloka 3-4:
 *   - Kendras (angular houses 1,4,7,10): 60 units — strongest positions
 *   - Panaparas (succedent houses 2,5,8,11): 30 units — moderate
 *   - Apoklimas (cadent houses 3,6,9,12): 15 units — weakest
 *
 * This mirrors the classical principle that angular houses have the
 * greatest capacity to manifest their significations.
 */
function getBhavaDigBala(house: number): number {
  if (house === 1 || house === 4 || house === 7 || house === 10) return 60;
  if (house === 2 || house === 5 || house === 8 || house === 11) return 30;
  return 15; // houses 3, 6, 9, 12
}

/**
 * Returns the list of houses aspected by a planet from its current house.
 *
 * Graha Drishti (planetary aspect) rules per BPHS Ch.26:
 *   - ALL planets have a full (100%) 7th-house aspect (opposition).
 *   - Jupiter (id=4) additionally aspects the 5th and 9th houses from itself.
 *   - Mars (id=2) additionally aspects the 4th and 8th houses from itself.
 *   - Saturn (id=6) additionally aspects the 3rd and 10th houses from itself.
 *
 * Note: Rahu and Ketu aspect rules vary by tradition; here they receive
 * only the universal 7th aspect. Rashi Drishti (sign-based aspect) per
 * Jaimini is NOT used here — this is strictly Parashara's graha drishti.
 *
 * The formula `((planetHouse - 1 + offset) % 12) + 1` converts a
 * 1-indexed house + offset to a 1-indexed aspected house (wrapping at 12).
 */
function getAspectedHouses(planetId: number, planetHouse: number): number[] {
  const houses: number[] = [];

  // All planets have full 7th aspect (opposition aspect — BPHS Ch.26 Shloka 2)
  houses.push(((planetHouse - 1 + 6) % 12) + 1);

  // Special aspects (BPHS Ch.26 Shloka 3-5)
  if (planetId === 4) {
    // Jupiter: 5th and 9th house aspects (trikona aspects)
    houses.push(((planetHouse - 1 + 4) % 12) + 1);
    houses.push(((planetHouse - 1 + 8) % 12) + 1);
  } else if (planetId === 2) {
    // Mars: 4th and 8th house aspects (kendra/dusthana aspects)
    houses.push(((planetHouse - 1 + 3) % 12) + 1);
    houses.push(((planetHouse - 1 + 7) % 12) + 1);
  } else if (planetId === 6) {
    // Saturn: 3rd and 10th house aspects (upachaya/kendra aspects)
    houses.push(((planetHouse - 1 + 2) % 12) + 1);
    houses.push(((planetHouse - 1 + 9) % 12) + 1);
  }

  return houses;
}

/**
 * Main Bhavabala computation. Iterates all 12 houses and computes:
 *   1. Bhavadhipati Bala — from the lord's Shadbala rupas (scaled to virupas by ×60)
 *   2. Bhava Dig Bala — from the house's angular classification
 *   3. Bhava Drishti Bala — net aspect influence (benefic +10, malefic -10 per aspect)
 *   4. Bhava Graha Sambandha — net occupation influence (benefic +15, malefic -15 per tenant)
 *
 * After computing all 12 houses, strengthPercent is set as the percentage
 * of each house's total relative to the 12-house average (100% = average).
 *
 * @param input - Houses with lord info, planet positions, and Shadbala rupas
 * @returns Array of 12 BhavaBalaResult entries
 */
export function calculateBhavabala(input: BhavaBalaInput): BhavaBalaResult[] {
  const { houses, planets, shadbalaRupas } = input;

  // Pre-compute aspect map: house → net drishti bala (aspects only, NOT occupation)
  const drishtiBalaMap: Record<number, number> = {};
  // Occupation: benefic tenants strengthen (+15), malefic tenants weaken (-15)
  const grahaSambandhaMap: Record<number, number> = {};
  for (let h = 1; h <= 12; h++) {
    drishtiBalaMap[h] = 0;
    grahaSambandhaMap[h] = 0;
  }

  for (const planet of planets) {
    const isBenefic = BENEFIC_IDS.has(planet.id);

    // Occupation (Bhava Graha Sambandha) — separate from Drishti
    grahaSambandhaMap[planet.house] += isBenefic ? 15 : -15;

    // Planetary aspects (Drishti Bala only)
    const aspected = getAspectedHouses(planet.id, planet.house);
    for (const h of aspected) {
      drishtiBalaMap[h] += isBenefic ? 10 : -10;
    }
  }

  const results: BhavaBalaResult[] = [];

  for (const h of houses) {
    const lordName = h.lord;
    const lordId = LORD_TO_ID[lordName] ?? -1;

    // Bhavadhipati Bala: house lord's Shadbala rupas converted to virupas (×60).
    // Per BPHS Ch.34, the lord's total Shadbala directly contributes to house strength.
    // For houses lorded by Rahu/Ketu (not in standard lordship), a default of 300
    // virupas is assigned as a neutral fallback.
    let bhavadhipatiBala: number;
    if (lordId >= 0 && shadbalaRupas[lordId] !== undefined) {
      bhavadhipatiBala = shadbalaRupas[lordId] * 60;
    } else {
      bhavadhipatiBala = 300; // default for Rahu/Ketu or missing
    }

    const bhavaDigBala = getBhavaDigBala(h.house);
    const bhavaDrishtiBala = drishtiBalaMap[h.house] ?? 0;
    const bhavaGrahaSambandha = grahaSambandhaMap[h.house] ?? 0;

    const total = bhavadhipatiBala + bhavaDigBala + bhavaDrishtiBala + bhavaGrahaSambandha;

    results.push({
      bhava: h.house,
      lordId: lordId >= 0 ? lordId : -1,
      lordName,
      bhavadhipatiBala: round2(bhavadhipatiBala),
      bhavaDigBala: round2(bhavaDigBala),
      bhavaDrishtiBala: round2(bhavaDrishtiBala),
      bhavaGrahaSambandha: round2(bhavaGrahaSambandha),
      total: round2(total),
      strengthPercent: 0, // computed after all houses
    });
  }

  // Compute the 12-house average and express each house as a percentage
  // of that average. 100% = exactly average strength; >100% = above average.
  const totalSum = results.reduce((acc, r) => acc + r.total, 0);
  const average = totalSum / 12;

  for (const r of results) {
    r.strengthPercent = average > 0 ? Math.round((r.total / average) * 100) : 100;
  }

  return results;
}
