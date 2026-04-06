/**
 * KP Significator Calculation
 *
 * For each house (1-12) the significators are graded into four levels:
 *
 *  Level 1 (strongest): Planets posited in the star (nakshatra) of planets
 *                       that OCCUPY the house.
 *  Level 2:             Planets that OCCUPY the house.
 *  Level 3:             Planets posited in the star of the HOUSE LORD.
 *  Level 4 (weakest):   The house lord itself.
 *
 * The `combined` array merges all four levels (unique, preserving order).
 */

import type { KPPlanet, KPCusp, SignificatorEntry, CuspalSubLordAnalysis } from '@/types/kp';

// ---------------------------------------------------------------------------
// Nakshatra lord mapping: nakshatra number (1-27) -> planet id
// ---------------------------------------------------------------------------

const NAKSHATRA_LORDS_BY_ID: number[] = [
  // nk 1-9
  8, 5, 0, 1, 2, 7, 4, 6, 3,
  // nk 10-18
  8, 5, 0, 1, 2, 7, 4, 6, 3,
  // nk 19-27
  8, 5, 0, 1, 2, 7, 4, 6, 3,
];

// ---------------------------------------------------------------------------
// Sign lord mapping: sign (1-12) -> planet id
// ---------------------------------------------------------------------------

const SIGN_LORD_IDS: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get the nakshatra number (1-27) from sidereal longitude */
function nakshatraNum(deg: number): number {
  return Math.floor(((deg % 360 + 360) % 360) / (360 / 27)) + 1;
}

/** Determine which house a planet occupies based on cusp boundaries */
function findHouseForDegree(deg: number, cusps: KPCusp[]): number {
  const sorted = [...cusps].sort((a, b) => a.house - b.house);

  for (let i = 0; i < 12; i++) {
    const cuspStart = sorted[i].degree;
    const cuspEnd = sorted[(i + 1) % 12].degree;
    const normDeg = ((deg % 360) + 360) % 360;

    if (cuspEnd > cuspStart) {
      // Normal case (no zodiac wrap)
      if (normDeg >= cuspStart && normDeg < cuspEnd) {
        return sorted[i].house;
      }
    } else {
      // Wraps around 0 degrees
      if (normDeg >= cuspStart || normDeg < cuspEnd) {
        return sorted[i].house;
      }
    }
  }

  // Fallback: closest cusp
  return 1;
}

/** Get the lord (planet id) of a given house cusp */
function houseLordId(house: number, cusps: KPCusp[]): number {
  const cusp = cusps.find((c) => c.house === house);
  if (!cusp) return 0;
  return SIGN_LORD_IDS[cusp.sign] ?? 0;
}

/** Unique values preserving insertion order */
function unique(arr: number[]): number[] {
  return [...new Set(arr)];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Calculate KP significators for all 12 houses.
 *
 * @param planets Array of KPPlanet objects (with longitude, nakshatra etc.)
 * @param cusps   Array of 12 KPCusp objects
 * @returns Array of 12 SignificatorEntry objects (one per house)
 */
export function calculateSignificators(
  planets: KPPlanet[],
  cusps: KPCusp[]
): SignificatorEntry[] {
  // Pre-compute: which house each planet occupies
  const planetHouse: Record<number, number> = {};
  for (const p of planets) {
    planetHouse[p.planet.id] = findHouseForDegree(p.longitude, cusps);
  }

  // Pre-compute: nakshatra lord of each planet
  const planetStarLord: Record<number, number> = {};
  for (const p of planets) {
    const nk = nakshatraNum(p.longitude);
    planetStarLord[p.planet.id] = NAKSHATRA_LORDS_BY_ID[nk - 1];
  }

  const entries: SignificatorEntry[] = [];

  for (let house = 1; house <= 12; house++) {
    // L2: Planets occupying this house
    const occupants = planets
      .filter((p) => planetHouse[p.planet.id] === house)
      .map((p) => p.planet.id);

    // L1: Planets in the star of occupants
    const level1: number[] = [];
    for (const occId of occupants) {
      for (const p of planets) {
        if (planetStarLord[p.planet.id] === occId) {
          level1.push(p.planet.id);
        }
      }
    }

    // L4: House lord
    const lordId = houseLordId(house, cusps);
    const level4 = [lordId];

    // L3: Planets in the star of the house lord
    const level3: number[] = [];
    for (const p of planets) {
      if (planetStarLord[p.planet.id] === lordId) {
        level3.push(p.planet.id);
      }
    }

    entries.push({
      house,
      level1: unique(level1),
      level2: unique(occupants),
      level3: unique(level3),
      level4: unique(level4),
      combined: unique([...level1, ...occupants, ...level3, ...level4]),
    });
  }

  return entries;
}

// ---------------------------------------------------------------------------
// P2-05: Cuspal Sub-lord Signification Analysis
// ---------------------------------------------------------------------------

/** Classical KP: which houses must the sub-lord of each cusp signify for results to materialise */
const CUSP_REQUIRED_HOUSES: Record<number, number[]> = {
  1:  [1, 3, 6, 10, 11],        // Health / longevity: 1 (self), 6 (recovery), 3/10/11 (support)
  2:  [2, 6, 10, 11],            // Finances/family: 2,11 (gains), 6 (competition overcome), 10 (career)
  3:  [1, 3, 9, 11],             // Siblings/short travel: 3,11 success, 9 long journey
  4:  [1, 2, 4, 11],             // Home/mother: 4 (property), 2 (family), 11 (fulfilment)
  5:  [1, 2, 5, 11],             // Children/intellect: 5,11, 2 (growth)
  6:  [1, 6, 8, 12],             // Debts/illness/enemies: 6 (litigation), 8,12 (hidden)
  7:  [2, 7, 11],                // Marriage: 7,11 (partner), 2 (family union)
  8:  [1, 4, 8, 12],             // Longevity/death: 8 (transformation), 4 (end of life), 12 (liberation)
  9:  [3, 9, 12],                // Higher learning/father: 9 (fortune, guru), 12 (foreign)
  10: [1, 6, 10, 11],            // Career: 10 (profession), 11 (gains), 6 (service), 1 (self-effort)
  11: [2, 6, 10, 11],            // Gains: 11 (incoming), 2 (accumulate), 10,6 (earning)
  12: [4, 8, 12],                // Expenses/liberation: 12 (loss/moksha), 8 (death), 4 (isolation)
};

/** Malefic houses (trik + dushthana) */
const MALEFIC_HOUSES = new Set([6, 8, 12]);

/**
 * Classical KP cuspal sub-lord signification.
 * For each cusp, check if its sub-lord signifies the required houses for
 * that cusp's matter to materialise.
 */
export function calculateCuspalAnalysis(
  cusps: KPCusp[],
  significators: SignificatorEntry[]
): CuspalSubLordAnalysis[] {
  // Build reverse map: planet id -> houses it signifies
  const planetSignifies: Record<number, number[]> = {};
  for (const sig of significators) {
    for (const id of sig.combined) {
      if (!planetSignifies[id]) planetSignifies[id] = [];
      if (!planetSignifies[id].includes(sig.house)) planetSignifies[id].push(sig.house);
    }
  }

  const HOUSE_MATTERS: Record<number, { en: string; hi: string; sa: string }> = {
    1:  { en: 'Self & Health', hi: 'स्वास्थ्य और व्यक्तित्व', sa: 'स्वास्थ्यं व्यक्तित्वञ्च' },
    2:  { en: 'Wealth & Family', hi: 'धन और परिवार', sa: 'धनं परिवारश्च' },
    3:  { en: 'Siblings & Courage', hi: 'भाई-बहन और साहस', sa: 'भ्रातृः साहसञ्च' },
    4:  { en: 'Home & Mother', hi: 'घर और माता', sa: 'गृहं मातृश्च' },
    5:  { en: 'Children & Intelligence', hi: 'संतान और बुद्धि', sa: 'संतानं बुद्धिश्च' },
    6:  { en: 'Debts, Enemies & Disease', hi: 'ऋण, शत्रु और रोग', sa: 'ऋणं शत्रुः रोगश्च' },
    7:  { en: 'Marriage & Partnership', hi: 'विवाह और साझेदारी', sa: 'विवाहः सहभागिता च' },
    8:  { en: 'Longevity & Transformation', hi: 'दीर्घायु और परिवर्तन', sa: 'दीर्घायुः परिवर्तनञ्च' },
    9:  { en: 'Fortune & Higher Learning', hi: 'भाग्य और उच्च शिक्षा', sa: 'भाग्यं उच्चविद्या च' },
    10: { en: 'Career & Status', hi: 'कार्य और प्रतिष्ठा', sa: 'कार्यं प्रतिष्ठा च' },
    11: { en: 'Gains & Fulfillment', hi: 'लाभ और सफलता', sa: 'लाभः सफलता च' },
    12: { en: 'Expenditure & Liberation', hi: 'व्यय और मोक्ष', sa: 'व्ययः मोक्षश्च' },
  };

  return cusps.map(cusp => {
    const subLordId = cusp.subLordInfo.subLord.id;
    const subSubLordId = cusp.subLordInfo.subSubLord.id;
    const signified = planetSignifies[subLordId] ?? [];
    const required = CUSP_REQUIRED_HOUSES[cusp.house] ?? [];

    // Favorable if sub-lord signifies at least one required house AND no strong malefic interference
    const matchCount = required.filter(h => signified.includes(h)).length;
    const hasMaleficOnly = signified.length > 0 && signified.every(h => MALEFIC_HOUSES.has(h));
    const favorable = matchCount >= 1 && !hasMaleficOnly;

    const matter = HOUSE_MATTERS[cusp.house] ?? { en: '', hi: '', sa: '' };
    const signifiedStr = signified.length > 0 ? signified.join(', ') : '—';
    const requiredStr = required.join(', ');

    const subName = cusp.subLordInfo.subLord.name;
    const sssName = cusp.subLordInfo.subSubLord.name;

    const interpretation = favorable
      ? {
          en: `${subName.en} (sub-lord of H${cusp.house}) signifies houses ${signifiedStr} — ${matter.en} matters will materialise.`,
          hi: `${subName.hi} (भाव ${cusp.house} के उप-स्वामी) भावों ${signifiedStr} का सूचन करते हैं — ${matter.hi} के विषय फलदायी होंगे।`,
          sa: `${subName.sa} (भाव ${cusp.house} उपस्वामी) भावान् ${signifiedStr} सूचयति — ${matter.sa} फलितं भवति।`,
        }
      : {
          en: `${subName.en} (sub-lord of H${cusp.house}) signifies houses ${signifiedStr || '—'} — required ${requiredStr}. ${matter.en} matters are denied or delayed.`,
          hi: `${subName.hi} (भाव ${cusp.house} के उप-स्वामी) भावों ${signifiedStr || '—'} का सूचन करते हैं — आवश्यक ${requiredStr}। ${matter.hi} के विषय में विलंब या अभाव।`,
          sa: `${subName.sa} (भाव ${cusp.house} उपस्वामी) भावान् ${signifiedStr || '—'} सूचयति — आवश्यकाः ${requiredStr}। ${matter.sa} विलम्बः अभावो वा।`,
        };

    return {
      house: cusp.house,
      subLordName: subName,
      subSubLordName: sssName,
      signifiedHouses: signified,
      favorable,
      interpretation,
    };
  });
}
