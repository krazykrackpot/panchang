/**
 * Yoga (planetary combination) detection
 * Detects notable yogas in a birth chart
 */

import type { GrahaPosition, HouseData, YogaDetection, GrahaId } from './types';

const KENDRA_HOUSES = [1, 4, 7, 10];
const TRIKONA_HOUSES = [1, 5, 9];
const DUSTHANA_HOUSES = [6, 8, 12];

function findGraha(grahas: GrahaPosition[], id: GrahaId): GrahaPosition | undefined {
  return grahas.find(g => g.id === id);
}

function getHouseOf(grahas: GrahaPosition[], id: GrahaId): number {
  return findGraha(grahas, id)?.house ?? 0;
}

function isInHouses(house: number, houses: number[]): boolean {
  return houses.includes(house);
}

export function detectYogas(
  grahas: GrahaPosition[],
  houses: HouseData[],
  ascSignIndex: number
): YogaDetection[] {
  const yogas: YogaDetection[] = [];

  const jupiter = findGraha(grahas, 'jupiter')!;
  const moon = findGraha(grahas, 'moon')!;
  const sun = findGraha(grahas, 'sun')!;
  const venus = findGraha(grahas, 'venus')!;
  const mars = findGraha(grahas, 'mars')!;
  const saturn = findGraha(grahas, 'saturn')!;
  const mercury = findGraha(grahas, 'mercury')!;
  const rahu = findGraha(grahas, 'rahu')!;
  const ketu = findGraha(grahas, 'ketu')!;

  // --- Gajakesari Yoga ---
  // Jupiter in Kendra from Moon
  const jupFromMoon = ((jupiter.house - moon.house + 12) % 12) + 1;
  if (KENDRA_HOUSES.includes(jupFromMoon)) {
    yogas.push({
      name: 'Gajakesari Yoga',
      type: 'Other',
      description: 'Jupiter in a Kendra from Moon. Bestows wisdom, fame, wealth, and a respected position in society. The native will be intelligent and virtuous.',
      strength: jupiter.isRetrograde ? 'Moderate' : 'Strong',
    });
  }

  // --- Pancha Mahapurusha Yogas ---
  // These occur when Mars, Mercury, Jupiter, Venus, or Saturn are in their own sign or exalted, and in a Kendra
  const ownSigns: Record<string, number[]> = {
    mars: [0, 7],        // Aries, Scorpio
    mercury: [2, 5],     // Gemini, Virgo
    jupiter: [8, 11],    // Sagittarius, Pisces
    venus: [1, 6],       // Taurus, Libra
    saturn: [9, 10],     // Capricorn, Aquarius
  };
  const exaltedSigns: Record<string, number> = {
    mars: 9,       // Capricorn
    mercury: 5,    // Virgo
    jupiter: 3,    // Cancer
    venus: 11,     // Pisces
    saturn: 6,     // Libra
  };
  const mahapurushaNames: Record<string, string> = {
    mars: 'Ruchaka',
    mercury: 'Bhadra',
    jupiter: 'Hamsa',
    venus: 'Malavya',
    saturn: 'Shasha',
  };
  const mahapurushaDesc: Record<string, string> = {
    mars: 'Ruchaka Yoga: Mars in own sign or exalted in a Kendra. Grants courage, military leadership, physical strength, and commanding presence.',
    mercury: 'Bhadra Yoga: Mercury in own sign or exalted in a Kendra. Grants eloquence, intelligence, business acumen, and scholarly abilities.',
    jupiter: 'Hamsa Yoga: Jupiter in own sign or exalted in a Kendra. Grants wisdom, spirituality, good fortune, and noble character.',
    venus: 'Malavya Yoga: Venus in own sign or exalted in a Kendra. Grants beauty, luxury, artistic talent, and material comforts.',
    saturn: 'Shasha Yoga: Saturn in own sign or exalted in a Kendra. Grants authority, discipline, organizational skills, and longevity.',
  };

  for (const planet of [mars, mercury, jupiter, venus, saturn]) {
    const id = planet.id as string;
    const isOwn = ownSigns[id]?.includes(planet.signIndex);
    const isExalted = exaltedSigns[id] === planet.signIndex;
    if ((isOwn || isExalted) && isInHouses(planet.house, KENDRA_HOUSES)) {
      yogas.push({
        name: `${mahapurushaNames[id]} Yoga`,
        type: 'Pancha Mahapurusha',
        description: mahapurushaDesc[id],
        strength: isExalted ? 'Strong' : 'Moderate',
      });
    }
  }

  // --- Raja Yoga ---
  // Lord of Kendra + Lord of Trikona in conjunction or mutual aspect
  // Simplified: Check if benefics are in both Kendra and Trikona houses
  const beneficsInKendra = grahas.filter(g =>
    ['jupiter', 'venus', 'mercury'].includes(g.id) && isInHouses(g.house, KENDRA_HOUSES)
  );
  const beneficsInTrikona = grahas.filter(g =>
    ['jupiter', 'venus', 'mercury'].includes(g.id) && isInHouses(g.house, TRIKONA_HOUSES)
  );
  if (beneficsInKendra.length > 0 && beneficsInTrikona.length > 0) {
    yogas.push({
      name: 'Raja Yoga',
      type: 'Raja',
      description: 'Benefic planets placed in both Kendra and Trikona houses. Indicates power, authority, success, and social elevation. The native may attain high position.',
      strength: 'Moderate',
    });
  }

  // --- Dhana Yoga ---
  // Lord of 2nd or 11th house with benefic influence
  const secondHousePlanets = houses[1]?.planets || [];
  const eleventhHousePlanets = houses[10]?.planets || [];
  const wealthPlanets = [...secondHousePlanets, ...eleventhHousePlanets];
  if (wealthPlanets.some(p => ['jupiter', 'venus'].includes(p))) {
    yogas.push({
      name: 'Dhana Yoga',
      type: 'Dhana',
      description: 'Benefic planets in houses of wealth (2nd or 11th). Indicates financial prosperity, material abundance, and good fortune in earning.',
      strength: 'Moderate',
    });
  }

  // --- Budhaditya Yoga ---
  // Sun and Mercury in the same house
  if (sun.house === mercury.house) {
    yogas.push({
      name: 'Budhaditya Yoga',
      type: 'Other',
      description: 'Sun and Mercury conjunct. Grants sharp intellect, analytical mind, good communication skills, and success in education.',
      strength: Math.abs(sun.longitude - mercury.longitude) < 10 ? 'Strong' : 'Moderate',
    });
  }

  // --- Chandra-Mangala Yoga ---
  if (moon.house === mars.house) {
    yogas.push({
      name: 'Chandra-Mangala Yoga',
      type: 'Dhana',
      description: 'Moon and Mars in conjunction. Indicates earning through self-effort, business acumen, and enterprise. Can bring wealth through courage.',
      strength: 'Moderate',
    });
  }

  // --- Kemadruma Yoga (inauspicious) ---
  const moonHouse = moon.house;
  const housesBesideMoon = [(moonHouse % 12) + 1, ((moonHouse - 2 + 12) % 12) + 1];
  const planetsNearMoon = grahas.filter(g =>
    g.id !== 'moon' && g.id !== 'rahu' && g.id !== 'ketu' && housesBesideMoon.includes(g.house)
  );
  if (planetsNearMoon.length === 0 && !isInHouses(moonHouse, KENDRA_HOUSES)) {
    yogas.push({
      name: 'Kemadruma Yoga',
      type: 'Arishta',
      description: 'No planets in houses adjacent to Moon, and Moon not in Kendra. May indicate periods of loneliness, financial difficulty, or emotional challenges. Often cancelled by other factors.',
      strength: 'Weak',
    });
  }

  // --- Viparita Raja Yoga ---
  // Lords of dusthana in dusthana
  const dusthanaPlanets = grahas.filter(g =>
    isInHouses(g.house, DUSTHANA_HOUSES) && !['rahu', 'ketu'].includes(g.id)
  );
  if (dusthanaPlanets.length >= 2) {
    yogas.push({
      name: 'Viparita Raja Yoga',
      type: 'Raja',
      description: 'Multiple planets in dusthana houses (6, 8, 12). Paradoxically indicates rise through adversity, unexpected gains, and triumph over enemies.',
      strength: 'Weak',
    });
  }

  // --- Adhi Yoga ---
  // Benefics in 6th, 7th, 8th from Moon
  const moonH = moon.house;
  const adhiHouses = [((moonH + 4) % 12) + 1, ((moonH + 5) % 12) + 1, ((moonH + 6) % 12) + 1];
  const adhiPlanets = grahas.filter(g =>
    ['jupiter', 'venus', 'mercury'].includes(g.id) && adhiHouses.includes(g.house)
  );
  if (adhiPlanets.length >= 2) {
    yogas.push({
      name: 'Adhi Yoga',
      type: 'Raja',
      description: 'Benefic planets in 6th, 7th, and 8th from Moon. Indicates a polite, trustworthy person who will enjoy prosperity, fame, and victory over adversaries.',
      strength: adhiPlanets.length >= 3 ? 'Strong' : 'Moderate',
    });
  }

  return yogas;
}
