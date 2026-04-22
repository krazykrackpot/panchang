/**
 * Classical Gochara (Transit) Engine
 *
 * Implements three Vedic transit analysis techniques:
 * 1. Vedha (obstruction) from Phaladeepika Ch.26
 * 2. Double Transit of Jupiter & Saturn
 * 3. BAV-based transit quality scoring
 *
 * All houses are 1-based, counted from natal Moon sign.
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
 */

export interface GocharaResult {
  planet: number;           // planet id 0-6
  transitSign: number;      // current sign 1-12
  houseFromMoon: number;    // house from natal Moon 1-12
  isGoodHouse: boolean;
  vedhaActive: boolean;
  vedhaPlanet?: number;     // planet id causing vedha
  vedhaHouse?: number;
  bavScore?: number;        // individual BAV score for this sign (0-8)
  quality: 'strong' | 'moderate' | 'weak' | 'adverse';
}

export interface DoubleTransitResult {
  house: number;             // 1-12
  jupiterActivates: boolean;
  saturnActivates: boolean;
  doubleTransitActive: boolean;
}

/**
 * Vedha table from Phaladeepika Ch.26.
 * Key: planet id. Value: map of goodHouse → vedhaHouse.
 * All houses counted from natal Moon.
 */
const VEDHA_TABLE: Record<number, Record<number, number>> = {
  0: { 3: 9, 6: 12, 10: 4, 11: 5 },                                // Sun
  1: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 },                   // Moon
  2: { 3: 12, 6: 9, 11: 5 },                                        // Mars
  3: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 8, 11: 12 },                   // Mercury
  4: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 },                         // Jupiter
  5: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 }, // Venus
  6: { 3: 12, 6: 9, 11: 5 },                                        // Saturn
};

/** Compute house from Moon: 1-based, house 1 = Moon's own sign */
function houseFromMoon(moonSign: number, transitSign: number): number {
  return ((transitSign - moonSign + 12) % 12) + 1;
}

/**
 * Check if Sun-Saturn vedha exemption applies.
 * Sun and Saturn do NOT cause vedha to each other (classical rule).
 */
function isSunSaturnExempt(planet: number, otherPlanet: number): boolean {
  return (planet === 0 && otherPlanet === 6) || (planet === 6 && otherPlanet === 0);
}

/**
 * Determine transit quality from goodHouse, vedha, and optional BAV score.
 */
function computeQuality(
  isGoodHouse: boolean,
  vedhaActive: boolean,
  bavScore?: number
): 'strong' | 'moderate' | 'weak' | 'adverse' {
  if (bavScore !== undefined) {
    if (isGoodHouse && !vedhaActive && bavScore >= 4) return 'strong';
    if (isGoodHouse && !vedhaActive && bavScore >= 2) return 'moderate';
    if (isGoodHouse && vedhaActive) return 'adverse';
    if (!isGoodHouse && bavScore >= 4) return 'moderate';
    return 'adverse';
  }
  // No BAV provided
  if (isGoodHouse && !vedhaActive) return 'moderate';
  if (isGoodHouse && vedhaActive) return 'adverse';
  return 'weak';
}

export interface TransitInput {
  id: number;   // planet id 0-6
  sign: number; // current sign 1-12
}

/**
 * Analyze Gochara (transit) for planets 0-6 from natal Moon sign.
 *
 * @param transits - Array of { id, sign } for planets 0-6
 * @param natalMoonSign - Natal Moon sign (1-12)
 * @param reducedBav - Optional 7x12 BAV matrix [planetIndex][signIndex-0based]
 * @returns GocharaResult for each planet
 */
export function analyzeGochara(
  transits: TransitInput[],
  natalMoonSign: number,
  reducedBav?: number[][]
): GocharaResult[] {
  // Pre-compute house from Moon for each planet
  const planetHouses = new Map<number, number>();
  for (const t of transits) {
    planetHouses.set(t.id, houseFromMoon(natalMoonSign, t.sign));
  }

  const results: GocharaResult[] = [];

  for (const t of transits) {
    const house = planetHouses.get(t.id)!;
    const vedhaMap = VEDHA_TABLE[t.id];
    const goodHouses = vedhaMap ? Object.keys(vedhaMap).map(Number) : [];
    const isGood = goodHouses.includes(house);

    let vedhaActive = false;
    let vedhaPlanet: number | undefined;
    let vedhaHouse: number | undefined;

    if (isGood && vedhaMap[house] !== undefined) {
      const targetVedhaHouse = vedhaMap[house];

      // Check if any OTHER planet occupies the vedha house
      for (const other of transits) {
        if (other.id === t.id) continue;
        const otherHouse = planetHouses.get(other.id)!;
        if (otherHouse === targetVedhaHouse) {
          // Sun-Saturn exemption
          if (isSunSaturnExempt(t.id, other.id)) continue;

          vedhaActive = true;
          vedhaPlanet = other.id;
          vedhaHouse = targetVedhaHouse;
          break; // First vedha-causing planet is enough
        }
      }
    }

    // BAV only covers planets 0-6 (Sun through Saturn). Rahu(7)/Ketu(8) have no BAV row.
    const bavScore = reducedBav && t.id >= 0 && t.id <= 6 ? reducedBav[t.id]?.[t.sign - 1] : undefined;
    const quality = computeQuality(isGood, vedhaActive, bavScore);

    const result: GocharaResult = {
      planet: t.id,
      transitSign: t.sign,
      houseFromMoon: house,
      isGoodHouse: isGood,
      vedhaActive,
      quality,
    };

    if (vedhaActive) {
      result.vedhaPlanet = vedhaPlanet;
      result.vedhaHouse = vedhaHouse;
    }
    if (bavScore !== undefined) {
      result.bavScore = bavScore;
    }

    results.push(result);
  }

  return results;
}

/**
 * Analyze Double Transit (Jupiter + Saturn activation) for all 12 houses.
 *
 * Jupiter aspects: 5th, 7th, 9th from its sign (plus its own sign).
 * Saturn aspects: 3rd, 7th, 10th from its sign (plus its own sign).
 * Houses are counted from natal Moon sign.
 *
 * @param jupiterSign - Jupiter's current sign (1-12)
 * @param saturnSign - Saturn's current sign (1-12)
 * @param natalMoonSign - Natal Moon sign (1-12)
 * @returns DoubleTransitResult for each house 1-12
 */
export function analyzeDoubleTransit(
  jupiterSign: number,
  saturnSign: number,
  natalMoonSign: number
): DoubleTransitResult[] {
  // Compute signs activated by Jupiter (own + 5th, 7th, 9th aspects)
  const jupiterSigns = new Set<number>([
    jupiterSign,
    ((jupiterSign - 1 + 4) % 12) + 1,  // 5th from Jupiter
    ((jupiterSign - 1 + 6) % 12) + 1,  // 7th from Jupiter
    ((jupiterSign - 1 + 8) % 12) + 1,  // 9th from Jupiter
  ]);

  // Compute signs activated by Saturn (own + 3rd, 7th, 10th aspects)
  const saturnSigns = new Set<number>([
    saturnSign,
    ((saturnSign - 1 + 2) % 12) + 1,   // 3rd from Saturn
    ((saturnSign - 1 + 6) % 12) + 1,   // 7th from Saturn
    ((saturnSign - 1 + 9) % 12) + 1,   // 10th from Saturn
  ]);

  // Convert activated signs to houses from Moon
  const jupiterHouses = new Set<number>();
  for (const s of jupiterSigns) {
    jupiterHouses.add(houseFromMoon(natalMoonSign, s));
  }

  const saturnHouses = new Set<number>();
  for (const s of saturnSigns) {
    saturnHouses.add(houseFromMoon(natalMoonSign, s));
  }

  const results: DoubleTransitResult[] = [];
  for (let house = 1; house <= 12; house++) {
    const jupiterActivates = jupiterHouses.has(house);
    const saturnActivates = saturnHouses.has(house);
    results.push({
      house,
      jupiterActivates,
      saturnActivates,
      doubleTransitActive: jupiterActivates && saturnActivates,
    });
  }

  return results;
}
