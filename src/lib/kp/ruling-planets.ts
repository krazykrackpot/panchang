/**
 * KP Ruling Planets
 *
 * The five ruling planets at the moment of judgement (or birth):
 *  1. Ascendant sign lord
 *  2. Ascendant nakshatra lord
 *  3. Moon sign lord
 *  4. Moon nakshatra lord
 *  5. Weekday lord
 *
 * These ruling planets are a hallmark of KP astrology and are used
 * to fine-tune predictions and validate significators.
 */

import { GRAHAS } from '@/lib/constants/grahas';
import type { LocaleText} from '@/types/panchang';
import type { RulingPlanets } from '@/types/kp';

// ---------------------------------------------------------------------------
// Sign lord mapping: sign (1-12) -> planet id
// ---------------------------------------------------------------------------

const SIGN_LORD_IDS: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

// ---------------------------------------------------------------------------
// Nakshatra lord mapping: nakshatra (1-27) -> planet id
// ---------------------------------------------------------------------------

const NAKSHATRA_LORDS_BY_ID: number[] = [
  8, 5, 0, 1, 2, 7, 4, 6, 3,
  8, 5, 0, 1, 2, 7, 4, 6, 3,
  8, 5, 0, 1, 2, 7, 4, 6, 3,
];

// ---------------------------------------------------------------------------
// Weekday lord: JD weekday -> planet id
//   JD weekday: (floor(jd + 1.5) % 7)
//   0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
//   Planet mapping: Sun->Sun(0), Mon->Moon(1), Tue->Mars(2), Wed->Mercury(3),
//                   Thu->Jupiter(4), Fri->Venus(5), Sat->Saturn(6)
// ---------------------------------------------------------------------------

const WEEKDAY_LORD_IDS: number[] = [0, 1, 2, 3, 4, 5, 6];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function signNumber(deg: number): number {
  return Math.floor(((deg % 360 + 360) % 360) / 30) + 1;
}

function nakshatraNumber(deg: number): number {
  return Math.floor(((deg % 360 + 360) % 360) / (360 / 27)) + 1;
}

function grahaInfo(id: number): { id: number; name: LocaleText } {
  const g = GRAHAS[id];
  return { id, name: g?.name ?? { en: '', hi: '', sa: '' } };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Calculate the five KP ruling planets.
 *
 * @param jd      Julian Day number (used for weekday calculation)
 * @param ascDeg  Sidereal ascendant degree
 * @param moonDeg Sidereal Moon longitude
 * @returns RulingPlanets object
 */
export function getRulingPlanets(
  jd: number,
  ascDeg: number,
  moonDeg: number
): RulingPlanets {
  // Ascendant sign lord
  const ascSign = signNumber(ascDeg);
  const ascSignLordId = SIGN_LORD_IDS[ascSign];

  // Ascendant nakshatra lord
  const ascNk = nakshatraNumber(ascDeg);
  const ascStarLordId = NAKSHATRA_LORDS_BY_ID[ascNk - 1];

  // Moon sign lord
  const moonSign = signNumber(moonDeg);
  const moonSignLordId = SIGN_LORD_IDS[moonSign];

  // Moon nakshatra lord
  const moonNk = nakshatraNumber(moonDeg);
  const moonStarLordId = NAKSHATRA_LORDS_BY_ID[moonNk - 1];

  // Weekday lord
  const weekday = Math.floor(jd + 1.5) % 7; // 0=Mon .. 6=Sun
  const dayLordId = WEEKDAY_LORD_IDS[weekday];

  return {
    ascSignLord: grahaInfo(ascSignLordId),
    ascStarLord: grahaInfo(ascStarLordId),
    moonSignLord: grahaInfo(moonSignLordId),
    moonStarLord: grahaInfo(moonStarLordId),
    dayLord: grahaInfo(dayLordId),
  };
}
