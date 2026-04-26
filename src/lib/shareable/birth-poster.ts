import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';
import type { KundaliData } from '@/types/kundali';

/* ════════════════════════════════════════════════════════════════
   Birth Poster Data — assembles all fields for the shareable card
   from a KundaliData object. Pure computation, no React.
   ════════════════════════════════════════════════════════════════ */

export interface BirthPosterData {
  name: string;
  date: string;          // "15 August 1990"
  time: string;          // "14:30"
  place: string;         // "Corseaux, Switzerland"
  risingSign: string;    // "Aries"
  moonSign: string;      // "Scorpio"
  moonNakshatra: string; // "Jyeshtha"
  sunSign: string;       // "Cancer"
  elementDist: {
    fire: number;
    earth: number;
    air: number;
    water: number;
    dominant: string;
    archetype: { en: string; hi: string };
    percentage: number;
  };
  currentDasha: string;  // "Saturn Mahadasha"
  standoutYoga: string;  // "Gajakesari Yoga" or strongest planet note
  /** 12 element indices (0=fire, 1=earth, 2=air, 3=water) for geometric pattern */
  houseLordElements: number[];
  /** Which houses contain at least one planet (1-indexed, stored as 0-indexed booleans) */
  occupiedHouses: boolean[];
}

/* ── Element mapping ── */
const ELEMENT_EN_TO_INDEX: Record<string, number> = {
  Fire: 0,
  Earth: 1,
  Air: 2,
  Water: 3,
};

const ELEMENT_NAMES = ['fire', 'earth', 'air', 'water'] as const;

const ARCHETYPE_MAP: Record<string, { en: string; hi: string }> = {
  fire:  { en: 'The Catalyst',  hi: 'अग्नि प्रेरक' },
  earth: { en: 'The Builder',   hi: 'भूमि निर्माता' },
  air:   { en: 'The Connector', hi: 'वायु संयोजक' },
  water: { en: 'The Intuitive', hi: 'जल अन्तर्ज्ञानी' },
  tie:   { en: 'The Balanced',  hi: 'संतुलित' },
};

/**
 * Resolve the element index (0-3) for a given rashi id (1-12).
 * Falls back to 0 (fire) if rashi not found — should not happen with valid data.
 */
function rashiElementIndex(rashiId: number): number {
  const rashi = RASHIS.find(r => r.id === rashiId);
  if (!rashi) return 0;
  return ELEMENT_EN_TO_INDEX[rashi.element.en] ?? 0;
}

/**
 * Get the sign occupied by each house's lord.
 * House i (0-based) has sign = ascendant + i (mod 12, 1-based).
 * The lord of that sign is the ruler of the rashi. We find where that ruler
 * sits and return its sign's element.
 */
function computeHouseLordElements(kundali: KundaliData): number[] {
  const result: number[] = [];
  for (let i = 0; i < 12; i++) {
    // In whole-sign houses, house i has rashi = (ascendant.sign - 1 + i) % 12 + 1
    const houseRashiId = ((kundali.ascendant.sign - 1 + i) % 12) + 1;
    const rashi = RASHIS.find(r => r.id === houseRashiId);
    if (!rashi) {
      result.push(0);
      continue;
    }
    // Find where the ruler planet sits — its sign's element
    const rulerName = rashi.ruler; // e.g. "Mars", "Venus", etc.
    const planet = kundali.planets.find(p => p.planet.name.en === rulerName);
    if (planet) {
      result.push(rashiElementIndex(planet.sign));
    } else {
      // Fallback: use the house's own sign element
      result.push(ELEMENT_EN_TO_INDEX[rashi.element.en] ?? 0);
    }
  }
  return result;
}

/**
 * Count planets 0-6 (Sun through Saturn) by their sign's element.
 */
function computeElementDistribution(kundali: KundaliData) {
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  // Planets 0-6: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn
  for (const p of kundali.planets) {
    if (p.planet.id > 6) continue; // skip Rahu, Ketu
    const idx = rashiElementIndex(p.sign);
    const key = ELEMENT_NAMES[idx];
    counts[key]++;
  }

  const total = counts.fire + counts.earth + counts.air + counts.water;
  const max = Math.max(counts.fire, counts.earth, counts.air, counts.water);
  // Find dominant — check for ties
  const dominants = ELEMENT_NAMES.filter(e => counts[e] === max);
  const dominant = dominants.length === 1 ? dominants[0] : 'tie';
  const percentage = total > 0 ? Math.round((max / total) * 100) : 0;

  return {
    ...counts,
    dominant,
    archetype: ARCHETYPE_MAP[dominant] || ARCHETYPE_MAP.tie,
    percentage,
  };
}

/**
 * Find the current running mahadasha label.
 */
function getCurrentDashaLabel(kundali: KundaliData, locale: string): string {
  const now = new Date();
  const current = kundali.dashas.find(d => {
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    return now >= start && now <= end;
  });
  if (!current) return '';
  const planetName = tl(current.planetName, locale);
  return locale === 'en'
    ? `${planetName} Mahadasha`
    : `${planetName} महादशा`;
}

/**
 * Find the most notable yoga — prefer strong auspicious ones.
 */
function getStandoutYoga(kundali: KundaliData, locale: string): string {
  if (!kundali.yogasComplete) return '';
  const present = kundali.yogasComplete
    .filter(y => y.present && y.isAuspicious)
    .sort((a, b) => {
      const order: Record<string, number> = { Strong: 0, Moderate: 1, Weak: 2 };
      return (order[a.strength] ?? 2) - (order[b.strength] ?? 2);
    });
  if (present.length === 0) return '';
  return tl(present[0].name, locale);
}

/**
 * Format the birth date as a readable string.
 * Input: ISO date "1990-08-15" -> "15 August 1990"
 */
function formatBirthDate(isoDate: string): string {
  try {
    const [year, month, day] = isoDate.split('-').map(Number);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${day} ${months[month - 1]} ${year}`;
  } catch {
    // Fallback: return as-is if parsing fails
    return isoDate;
  }
}

/**
 * Determine which houses (0-indexed) contain at least one planet.
 */
function computeOccupiedHouses(kundali: KundaliData): boolean[] {
  const occupied = Array(12).fill(false) as boolean[];
  for (const p of kundali.planets) {
    if (p.house >= 1 && p.house <= 12) {
      occupied[p.house - 1] = true;
    }
  }
  return occupied;
}

/* ════════════════════════════════════════════════════════════════
   Main assembly function
   ════════════════════════════════════════════════════════════════ */

export function assembleBirthPosterData(
  kundali: KundaliData,
  locale: string,
): BirthPosterData {
  const moonPlanet = kundali.planets.find(p => p.planet.id === 1);
  const sunPlanet = kundali.planets.find(p => p.planet.id === 0);

  return {
    name: kundali.birthData.name || '',
    date: formatBirthDate(kundali.birthData.date),
    time: kundali.birthData.time,
    place: kundali.birthData.place || '',
    risingSign: tl(kundali.ascendant.signName, locale),
    moonSign: moonPlanet ? tl(moonPlanet.signName, locale) : '',
    moonNakshatra: moonPlanet?.nakshatra ? tl(moonPlanet.nakshatra.name, locale) : '',
    sunSign: sunPlanet ? tl(sunPlanet.signName, locale) : '',
    elementDist: computeElementDistribution(kundali),
    currentDasha: getCurrentDashaLabel(kundali, locale),
    standoutYoga: getStandoutYoga(kundali, locale),
    houseLordElements: computeHouseLordElements(kundali),
    occupiedHouses: computeOccupiedHouses(kundali),
  };
}
