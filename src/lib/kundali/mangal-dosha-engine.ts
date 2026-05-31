/**
 * Mangal Dosha Engine
 *
 * Detects and analyzes Mangal (Kuja) Dosha.
 *
 * Classical rule: Mars in {1, 2, 4, 7, 8, 12} from the LAGNA only.
 * This is the position established by Phaladeepika (Mantreshwara, Ch.6),
 * Mansagari, Brihat Jataka (Varahamihira), and Muhurta Chintamani — all
 * primary classical sources. None of these texts include "from Moon"
 * or "from Venus" as a primary trigger.
 *
 * Moon and Venus reference points are still computed and surfaced as
 * SECONDARY information (used for severity / matchmaking nuance), but
 * they no longer gate `present`. The previous OR-of-three-references
 * rule caused this dosha to fire on ~87% of all charts (verified via
 * the yoga frequency calibration test), an artefact of how independent
 * P=0.5 events compound under OR rather than a classical claim.
 *
 * Classical sources for the {1,2,4,7,8,12} house-set:
 *   - Phaladeepika Ch.6 v.4-7 (Mantreshwara)
 *   - Mansagari Kalathra-bhava section
 *   - Brihat Jataka Ch.18 (Varahamihira)
 *   - Muhurta Chintamani Vivaha-prakarana
 * Note: Muhurta Chintamani excludes the 2nd house; the other three
 * sources include it. We follow the majority reading.
 *
 * Planet IDs: Mars=2, Moon=1, Venus=5, Jupiter=4
 */

import type { PlanetPosition } from '@/types/kundali';

export interface MangalDoshaResult {
  present: boolean;
  fromLagna: boolean;
  fromMoon: boolean;
  fromVenus: boolean;
  marsHouse: number;
  marsSign: number;
  houseSeverity: 'none' | 'mild' | 'moderate' | 'severe';
  scopeSeverity: 'none' | 'mild' | 'moderate' | 'severe';
  effectiveSeverity: 'none' | 'mild' | 'moderate' | 'severe' | 'cancelled';
  cancellations: { rule: string; description: string }[];
  affectedHouses: number[];
}

const MANGAL_HOUSES = new Set([1, 2, 4, 7, 8, 12]);

/** Compute 1-based house number from a reference sign to a target sign (both 1-12) */
function houseFrom(refSign: number, targetSign: number): number {
  return ((targetSign - refSign + 12) % 12) + 1;
}

/** Map house to house-based severity */
function getHouseSeverity(house: number): 'none' | 'mild' | 'moderate' | 'severe' {
  if (house === 7 || house === 8) return 'severe';
  if (house === 1 || house === 4) return 'moderate';
  if (house === 2 || house === 12) return 'mild';
  return 'none';
}

/** Map triggered reference count to scope severity */
function getScopeSeverity(count: number): 'none' | 'mild' | 'moderate' | 'severe' {
  if (count >= 3) return 'severe';
  if (count === 2) return 'moderate';
  if (count === 1) return 'mild';
  return 'none';
}

const SEVERITY_RANK: Record<string, number> = {
  none: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
};

const SEVERITY_BY_RANK: Array<'none' | 'mild' | 'moderate' | 'severe'> = [
  'none',
  'mild',
  'moderate',
  'severe',
];

function maxSeverity(
  a: 'none' | 'mild' | 'moderate' | 'severe',
  b: 'none' | 'mild' | 'moderate' | 'severe',
): 'none' | 'mild' | 'moderate' | 'severe' {
  return SEVERITY_RANK[a] >= SEVERITY_RANK[b] ? a : b;
}

/** Drop severity by `steps` levels; if base drops below 0 → 'cancelled' */
function dropSeverity(
  base: 'none' | 'mild' | 'moderate' | 'severe',
  steps: number,
): 'none' | 'mild' | 'moderate' | 'severe' | 'cancelled' {
  const rank = SEVERITY_RANK[base] - steps;
  if (rank <= 0) return 'cancelled';
  return SEVERITY_BY_RANK[rank];
}

export function analyzeMangalDosha(
  planets: PlanetPosition[],
  ascSign: number,
  birthDate?: string,
): MangalDoshaResult {
  // Extract Mars, Moon, Venus, Jupiter positions
  const mars = planets.find((p) => p.planet.id === 2);
  const moon = planets.find((p) => p.planet.id === 1);
  const venus = planets.find((p) => p.planet.id === 5);
  const jupiter = planets.find((p) => p.planet.id === 4);

  if (!mars) {
    // Cannot compute without Mars  –  return no-dosha
    return {
      present: false,
      fromLagna: false,
      fromMoon: false,
      fromVenus: false,
      marsHouse: 0,
      marsSign: 0,
      houseSeverity: 'none',
      scopeSeverity: 'none',
      effectiveSeverity: 'none',
      cancellations: [],
      affectedHouses: [],
    };
  }

  const marsSign = mars.sign;
  const marsHouse = mars.house;

  // --- Detection ---
  const fromLagna = MANGAL_HOUSES.has(houseFrom(ascSign, marsSign));
  const fromMoon = moon ? MANGAL_HOUSES.has(houseFrom(moon.sign, marsSign)) : false;
  const fromVenus = venus ? MANGAL_HOUSES.has(houseFrom(venus.sign, marsSign)) : false;

  // Classical rule: Mars from Lagna gates `present`. Moon and Venus references
  // are kept on the result object so consumers can surface them, but they do
  // NOT make `present` true on their own. See file-level docstring for the
  // primary-source citations.
  const present = fromLagna;

  // Collect affected houses (from each triggered reference). Lagna will only
  // appear here when `present` is true; Moon/Venus appear independently for
  // informational purposes only.
  const affectedHouses: number[] = [];
  if (fromLagna) affectedHouses.push(houseFrom(ascSign, marsSign));
  if (fromMoon && moon) affectedHouses.push(houseFrom(moon.sign, marsSign));
  if (fromVenus && venus) affectedHouses.push(houseFrom(venus.sign, marsSign));

  if (!present) {
    return {
      present: false,
      fromLagna,
      fromMoon,
      fromVenus,
      marsHouse,
      marsSign,
      houseSeverity: 'none',
      scopeSeverity: 'none',
      effectiveSeverity: 'none',
      cancellations: [],
      affectedHouses: [],
    };
  }

  // --- Severity ---
  // House severity based on Mars's lagna house (primary reference)
  const houseSeverity = getHouseSeverity(marsHouse);

  const triggeredCount = [fromLagna, fromMoon, fromVenus].filter(Boolean).length;
  const scopeSeverity = getScopeSeverity(triggeredCount);

  const baseSeverity = maxSeverity(houseSeverity, scopeSeverity);

  // --- Cancellations (only evaluated when dosha is present) ---
  const cancellations: { rule: string; description: string }[] = [];

  // C1: Mars in own sign  –  Aries (1) or Scorpio (8)
  if (marsSign === 1 || marsSign === 8) {
    cancellations.push({
      rule: 'C1',
      description: 'Mars is in its own sign (Aries or Scorpio), reducing malefic influence',
    });
  }

  // C2: Mars exalted  –  Capricorn (10)
  if (marsSign === 10) {
    cancellations.push({
      rule: 'C2',
      description: 'Mars is exalted in Capricorn, significantly reducing Mangal Dosha',
    });
  }

  // C3: Jupiter aspects Mars  –  Jupiter in same house OR 5th/7th/9th from Mars
  if (jupiter) {
    const jupHouse = jupiter.house;
    // Jupiter's special aspects: 5th, 7th, 9th from its own position
    // i.e., Jupiter in house X aspects houses X+4, X+6, X+8 (mod 12) from itself
    // We need to check if Mars's house falls within Jupiter's aspect
    // Jupiter aspects: its own house (conjunction), and houses at +4, +6, +8 offset from Jupiter
    const jupAspectedHouses = new Set([
      jupHouse,
      ((jupHouse - 1 + 4) % 12) + 1,  // 5th from Jupiter
      ((jupHouse - 1 + 6) % 12) + 1,  // 7th from Jupiter
      ((jupHouse - 1 + 8) % 12) + 1,  // 9th from Jupiter
    ]);
    if (jupAspectedHouses.has(marsHouse)) {
      cancellations.push({
        rule: 'C3',
        description: 'Jupiter aspects Mars (conjunction or 5th/7th/9th aspect), providing protection',
      });
    }
  }

  // C4: Venus in 7th house
  if (venus && venus.house === 7) {
    cancellations.push({
      rule: 'C4',
      description: 'Venus in the 7th house mitigates Mangal Dosha for marital matters',
    });
  }

  // C5: Mars conjunct benefic (Jupiter or Venus in same house)
  // Don't duplicate if C3 already caught the conjunction
  const c3WasConjunction =
    cancellations.some((c) => c.rule === 'C3') && jupiter && jupiter.house === marsHouse;
  if (!c3WasConjunction) {
    const conjunctBenefic =
      (jupiter && jupiter.house === marsHouse) ||
      (venus && venus.house === marsHouse);
    if (conjunctBenefic) {
      cancellations.push({
        rule: 'C5',
        description: 'Mars is conjunct a benefic planet (Jupiter or Venus), reducing malefic strength',
      });
    }
  }

  // C6: Mars in Mercury sign (Gemini=3 or Virgo=6) AND in 2nd house
  if ((marsSign === 3 || marsSign === 6) && marsHouse === 2) {
    cancellations.push({
      rule: 'C6',
      description:
        'Mars in Mercury-ruled sign (Gemini/Virgo) in 2nd house  –  Mercury neutralizes Mangal in the 2nd',
    });
  }

  // C8: Age-based reduction  –  Mars matures after age 28
  if (birthDate) {
    const birthYear = parseInt(birthDate.split('-')[0], 10);
    // Round 3 R3-TZ-8 — getUTCFullYear so the age-28 matured-Mars
    // cancellation doesn't flip at Dec 31 across server/client tz.
    const currentYear = new Date().getUTCFullYear();
    const age = currentYear - birthYear;
    if (age >= 28) {
      cancellations.push({
        rule: 'C8',
        description: 'Age 28+  –  Mars has matured, Mangal Dosha effect is significantly reduced',
      });
    }
  }

  // Effective severity = base dropped by number of cancellations
  const effectiveSeverity: 'none' | 'mild' | 'moderate' | 'severe' | 'cancelled' =
    cancellations.length > 0 ? dropSeverity(baseSeverity, cancellations.length) : baseSeverity;

  return {
    present,
    fromLagna,
    fromMoon,
    fromVenus,
    marsHouse,
    marsSign,
    houseSeverity,
    scopeSeverity,
    effectiveSeverity,
    cancellations,
    affectedHouses,
  };
}

export function analyzeMangalDoshaForMatching(
  chart1Planets: PlanetPosition[],
  chart1AscSign: number,
  chart2Planets: PlanetPosition[],
  chart2AscSign: number,
  birthDate1?: string,
  birthDate2?: string,
): { chart1: MangalDoshaResult; chart2: MangalDoshaResult; mutualCancellation: boolean } {
  const chart1 = analyzeMangalDosha(chart1Planets, chart1AscSign, birthDate1);
  const chart2 = analyzeMangalDosha(chart2Planets, chart2AscSign, birthDate2);

  const mutualCancellation = chart1.present && chart2.present;

  // Apply C7 (Mutual Manglik) cancellation to both charts if applicable
  if (mutualCancellation) {
    const c7 = { rule: 'C7', description: 'Both partners have Mangal Dosha  –  mutual cancellation applies' };

    if (!chart1.cancellations.some((c) => c.rule === 'C7')) {
      chart1.cancellations.push(c7);
      chart1.effectiveSeverity = dropSeverity(
        chart1.effectiveSeverity === 'cancelled' ? 'none' : (chart1.effectiveSeverity as 'none' | 'mild' | 'moderate' | 'severe'),
        1,
      );
    }

    if (!chart2.cancellations.some((c) => c.rule === 'C7')) {
      chart2.cancellations.push(c7);
      chart2.effectiveSeverity = dropSeverity(
        chart2.effectiveSeverity === 'cancelled' ? 'none' : (chart2.effectiveSeverity as 'none' | 'mild' | 'moderate' | 'severe'),
        1,
      );
    }
  }

  return { chart1, chart2, mutualCancellation };
}
