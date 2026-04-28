/**
 * Birth Time Rectification — Event Matcher (Phase 2)
 *
 * Scores each life event against a candidate birth chart by checking whether
 * the Vimshottari Dasha lord running at the event date is connected to the
 * classically relevant house(s) for that event type.
 *
 * Kept deliberately simple: we check dasha lord's house placement and lordship.
 * No complex aspect logic — that can be layered on later.
 */

import type { KundaliData, DashaEntry, PlanetPosition } from '@/types/kundali';
import type { LifeEvent, EventMatch } from './types';

// ---------------------------------------------------------------------------
// Planet name → ID mapping (0-based: 0=Sun … 8=Ketu)
// Must match the IDs used in kundali-calc planet positions.
// ---------------------------------------------------------------------------
const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

// Sign lordships: sign (1-12) → planet english name
// Defined ONCE here — canonical BPHS Ch.3 (see Lesson Q/S/Z)
const SIGN_LORD: Record<number, string> = {
  1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon',
  5: 'Sun', 6: 'Mercury', 7: 'Venus', 8: 'Mars',
  9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter',
};

// Natural significators for event types (used as bonus scoring)
const NATURAL_SIGNIFICATORS: Record<string, string[]> = {
  marriage: ['Venus', 'Jupiter'],
  child_birth: ['Jupiter'],
  career_change: ['Saturn', 'Sun'],
  illness: ['Mars', 'Saturn', 'Rahu', 'Ketu'],
  parent_death: ['Saturn'],
  relocation: ['Rahu', 'Ketu'],
  financial_gain: ['Jupiter', 'Venus'],
  financial_loss: ['Saturn', 'Rahu', 'Ketu'],
  education: ['Jupiter', 'Mercury'],
};

// Houses relevant to each event type (classical significations)
const EVENT_HOUSES: Record<string, number[]> = {
  marriage: [7],
  child_birth: [5],
  career_change: [10],
  illness: [6, 8],
  parent_death: [4, 9], // 4=mother, 9=father
  relocation: [4, 12],
  financial_gain: [2, 11],
  financial_loss: [12],
  education: [4, 5, 9],
};

// Malefic planets — used for illness/loss scoring
const MALEFICS = new Set(['Mars', 'Saturn', 'Rahu', 'Ketu']);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Find which Maha Dasha and Antar Dasha was running on a given date.
 * DashaEntry.startDate/endDate are ISO date strings ("YYYY-MM-DD" or ISO).
 */
function findDashaAtDate(
  dashas: DashaEntry[],
  dateStr: string
): { maha: DashaEntry | null; antar: DashaEntry | null } {
  const target = new Date(dateStr + 'T00:00:00Z').getTime();

  let maha: DashaEntry | null = null;
  let antar: DashaEntry | null = null;

  for (const d of dashas) {
    const start = new Date(d.startDate).getTime();
    const end = new Date(d.endDate).getTime();
    if (target >= start && target < end) {
      maha = d;
      // Search sub-periods for antar dasha
      if (d.subPeriods) {
        for (const sub of d.subPeriods) {
          const sStart = new Date(sub.startDate).getTime();
          const sEnd = new Date(sub.endDate).getTime();
          if (target >= sStart && target < sEnd) {
            antar = sub;
            break;
          }
        }
      }
      break;
    }
  }

  return { maha, antar };
}

/**
 * Get the house number (1-12) where a planet with the given english name sits.
 * Returns null if planet not found (e.g. if name doesn't match).
 */
function getPlanetHouse(planets: PlanetPosition[], planetName: string): number | null {
  const id = PLANET_NAME_TO_ID[planetName];
  if (id === undefined) return null;
  const p = planets.find((pp) => pp.planet.id === id);
  return p ? p.house : null;
}

/**
 * Get the sign number (1-12) of the planet.
 */
function getPlanetSign(planets: PlanetPosition[], planetName: string): number | null {
  const id = PLANET_NAME_TO_ID[planetName];
  if (id === undefined) return null;
  const p = planets.find((pp) => pp.planet.id === id);
  return p ? p.sign : null;
}

/**
 * Check if a planet (by english name) is the lord of any of the given houses.
 * "Lord of house N" = lord of the sign on the cusp of house N.
 * In whole-sign houses (used in Vedic), house N's sign = (ascSign + N - 2) % 12 + 1.
 */
function isLordOfHouses(
  ascSign: number,
  planetName: string,
  houses: number[]
): boolean {
  for (const h of houses) {
    // Whole-sign house: sign on house h = (ascSign - 1 + h - 1) % 12 + 1
    const houseSign = ((ascSign - 1 + h - 1) % 12) + 1;
    if (SIGN_LORD[houseSign] === planetName) return true;
  }
  return false;
}

/**
 * Check if a planet is placed in any of the given houses.
 */
function isPlacedInHouses(
  planets: PlanetPosition[],
  planetName: string,
  houses: number[]
): boolean {
  const h = getPlanetHouse(planets, planetName);
  return h !== null && houses.includes(h);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Score a single life event against a kundali chart.
 * Returns a score (0-10) and bilingual reason.
 */
export function scoreEvent(
  event: LifeEvent,
  kundali: KundaliData
): EventMatch {
  const { dashas, planets, ascendant } = kundali;
  const ascSign = ascendant.sign; // 1-12
  const relevantHouses = EVENT_HOUSES[event.type] ?? [];

  const { maha, antar } = findDashaAtDate(dashas, event.date);

  if (!maha) {
    // Event falls outside dasha timeline — can't score
    return {
      event,
      score: 0,
      reason: {
        en: 'Event date outside dasha timeline range',
        hi: 'घटना दशा समयसीमा से बाहर',
      },
    };
  }

  let score = 0;
  const reasonsEn: string[] = [];
  const reasonsHi: string[] = [];

  const mahaLord = maha.planet; // English name like "Venus"
  const antarLord = antar?.planet ?? null;

  // 1. Maha Dasha lord is lord of a relevant house (+3)
  if (isLordOfHouses(ascSign, mahaLord, relevantHouses)) {
    score += 3;
    const houseStr = relevantHouses.join('/');
    reasonsEn.push(`${mahaLord} Maha Dasha (lord of house ${houseStr})`);
    reasonsHi.push(`${mahaLord} महादशा (भाव ${houseStr} का स्वामी)`);
  }

  // 2. Maha Dasha lord placed in a relevant house (+2)
  if (isPlacedInHouses(planets, mahaLord, relevantHouses)) {
    score += 2;
    const h = getPlanetHouse(planets, mahaLord);
    reasonsEn.push(`${mahaLord} placed in house ${h}`);
    reasonsHi.push(`${mahaLord} भाव ${h} में स्थित`);
  }

  // 3. Antar Dasha lord is lord of a relevant house (+2)
  if (antarLord && isLordOfHouses(ascSign, antarLord, relevantHouses)) {
    score += 2;
    const houseStr = relevantHouses.join('/');
    reasonsEn.push(`${antarLord} Antar Dasha (lord of house ${houseStr})`);
    reasonsHi.push(`${antarLord} अंतर्दशा (भाव ${houseStr} का स्वामी)`);
  }

  // 4. Antar Dasha lord placed in a relevant house (+1)
  if (antarLord && isPlacedInHouses(planets, antarLord, relevantHouses)) {
    score += 1;
    const h = getPlanetHouse(planets, antarLord);
    reasonsEn.push(`${antarLord} Antar placed in house ${h}`);
    reasonsHi.push(`${antarLord} अंतर्दशा भाव ${h} में स्थित`);
  }

  // 5. Natural significator bonus: Maha or Antar lord is a natural significator (+1 each, max +2)
  const naturalSigs = NATURAL_SIGNIFICATORS[event.type] ?? [];
  if (naturalSigs.includes(mahaLord)) {
    score += 1;
    reasonsEn.push(`${mahaLord} is natural significator`);
    reasonsHi.push(`${mahaLord} नैसर्गिक कारक`);
  }
  if (antarLord && naturalSigs.includes(antarLord) && antarLord !== mahaLord) {
    score += 1;
    reasonsEn.push(`${antarLord} is natural significator`);
    reasonsHi.push(`${antarLord} नैसर्गिक कारक`);
  }

  // Cap at 10
  score = Math.min(10, score);

  // Build final reason string
  const reason = {
    en: reasonsEn.length > 0 ? reasonsEn.join('; ') : 'No clear dasha connection to relevant houses',
    hi: reasonsHi.length > 0 ? reasonsHi.join('; ') : 'प्रासंगिक भावों से दशा का कोई स्पष्ट संबंध नहीं',
  };

  return { event, score, reason };
}

/**
 * Score all events against a kundali chart. Returns array of EventMatch.
 */
export function scoreAllEvents(
  events: LifeEvent[],
  kundali: KundaliData
): EventMatch[] {
  return events.map((ev) => scoreEvent(ev, kundali));
}
