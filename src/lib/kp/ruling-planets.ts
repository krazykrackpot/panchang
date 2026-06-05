/**
 * KP Ruling Planets
 *
 * The seven ruling planets at the moment of judgement (or birth):
 *  1. Ascendant sign lord
 *  2. Ascendant nakshatra lord (star lord)
 *  3. Ascendant sub lord                                            (added 2026-06-05)
 *  4. Moon sign lord
 *  5. Moon nakshatra lord (star lord)
 *  6. Moon sub lord                                                 (added 2026-06-05)
 *  7. Weekday lord
 *
 * The original 5-RP set (1955 Krishnamurti Padhdhati) was extended
 * to 7 by Krishnamurti himself in his later writings — Reader VI of
 * "Astrology and Athrishta" (1971) documents the addition of Asc
 * Sub Lord and Moon Sub Lord to resolve horary cases where the
 * original 5 gave ties.
 *
 * TODO(impl): cite exact Reader VI page range in a follow-up commit
 * before requesting Gemini review (per spec §2 source-citation note).
 *
 * These ruling planets are a hallmark of KP astrology and are used
 * to fine-tune predictions and validate significators.
 */

import { GRAHAS } from '@/lib/constants/grahas';
import type { LocaleText} from '@/types/panchang';
import type { RulingPlanets } from '@/types/kp';
import { getSubLordForDegree } from './sub-lords';

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
 * Calculate the seven KP ruling planets.
 *
 * @param jd      Julian Day number (used for weekday calculation)
 * @param ascDeg  Sidereal ascendant degree
 * @param moonDeg Sidereal Moon longitude
 * @returns RulingPlanets object (7 fields)
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

  // Ascendant sub lord (7-RP extension — Reader VI)
  const ascSubLordId = getSubLordForDegree(ascDeg).subLord.id;

  // Moon sign lord
  const moonSign = signNumber(moonDeg);
  const moonSignLordId = SIGN_LORD_IDS[moonSign];

  // Moon nakshatra lord
  const moonNk = nakshatraNumber(moonDeg);
  const moonStarLordId = NAKSHATRA_LORDS_BY_ID[moonNk - 1];

  // Moon sub lord (7-RP extension — Reader VI)
  const moonSubLordId = getSubLordForDegree(moonDeg).subLord.id;

  // Weekday lord
  const weekday = Math.floor(jd + 1.5) % 7; // 0=Sun .. 6=Sat (Lesson O)
  const dayLordId = WEEKDAY_LORD_IDS[weekday];

  return {
    ascSignLord: grahaInfo(ascSignLordId),
    ascStarLord: grahaInfo(ascStarLordId),
    ascSubLord: grahaInfo(ascSubLordId),
    moonSignLord: grahaInfo(moonSignLordId),
    moonStarLord: grahaInfo(moonStarLordId),
    moonSubLord: grahaInfo(moonSubLordId),
    dayLord: grahaInfo(dayLordId),
  };
}
