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

const LORD_TO_ID: Record<string, number> = {
  'Sun': 0, 'Moon': 1, 'Mars': 2, 'Mercury': 3, 'Jupiter': 4, 'Venus': 5, 'Saturn': 6,
};

const PLANET_NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

const BENEFIC_IDS = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus
const MALEFIC_IDS = new Set([0, 2, 6, 7, 8]); // Sun, Mars, Saturn, Rahu, Ketu

function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

function getBhavaDigBala(house: number): number {
  if (house === 1 || house === 4 || house === 7 || house === 10) return 60;
  if (house === 2 || house === 5 || house === 8 || house === 11) return 30;
  return 15; // houses 3, 6, 9, 12
}

function getAspectedHouses(planetId: number, planetHouse: number): number[] {
  const houses: number[] = [];

  // All planets have full 7th aspect
  houses.push(((planetHouse - 1 + 6) % 12) + 1);

  // Special aspects
  if (planetId === 4) {
    // Jupiter aspects 5th and 9th
    houses.push(((planetHouse - 1 + 4) % 12) + 1);
    houses.push(((planetHouse - 1 + 8) % 12) + 1);
  } else if (planetId === 2) {
    // Mars aspects 4th and 8th
    houses.push(((planetHouse - 1 + 3) % 12) + 1);
    houses.push(((planetHouse - 1 + 7) % 12) + 1);
  } else if (planetId === 6) {
    // Saturn aspects 3rd and 10th
    houses.push(((planetHouse - 1 + 2) % 12) + 1);
    houses.push(((planetHouse - 1 + 9) % 12) + 1);
  }

  return houses;
}

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

    // Bhavadhipati Bala
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

  // Compute average and percentage
  const totalSum = results.reduce((acc, r) => acc + r.total, 0);
  const average = totalSum / 12;

  for (const r of results) {
    r.strengthPercent = average > 0 ? Math.round((r.total / average) * 100) : 100;
  }

  return results;
}
