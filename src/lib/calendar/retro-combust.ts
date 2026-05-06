/**
 * Retrograde & Combustion Calendar Engine
 *
 * Scans a full year day-by-day to detect:
 *   1. Retrograde periods — when a planet's geocentric daily motion becomes negative
 *   2. Combustion (Asta) windows — when a planet is within its combustion orb of the Sun
 *
 * Detection approach: iterate forward one day at a time over the year,
 * computing positions at each step. When the state changes (direct→retrograde
 * or visible→combust), record the transition date. This "day-scanning" method
 * has ±1 day resolution — sufficient for calendar display but not for
 * precise station timing (which would require bisection refinement).
 *
 * Retrograde in Vedic astrology: a retrograde (vakri) planet is considered
 * strengthened in some respects (it scores "Cheshta Bala" in Shadbala) but
 * may cause delays or reversals in the significations of its house/sign.
 *
 * Combustion (Asta) per BPHS Ch. 3: when a planet is too close to the Sun,
 * its significations are weakened ("burnt"). The orb differs per planet
 * and is further reduced when Mercury or Venus is retrograde (Lesson X).
 *
 * References:
 *   - BPHS Ch. 3 (combustion orbs)
 *   - Surya Siddhanta Ch. 2 (planetary motion and retrograde)
 */

import { dateToJD, getPlanetaryPositions, toSidereal, lahiriAyanamsha, normalizeDeg } from '@/lib/ephem/astronomical';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import type { LocaleText} from '@/types/panchang';

export interface RetroEvent {
  planetId: number;
  planetName: LocaleText;
  type: 'retrograde_start' | 'retrograde_end';
  date: string;         // YYYY-MM-DD
  sign: number;         // rashi at event
  signName: LocaleText;
}

export interface RetroPeriod {
  planetId: number;
  planetName: LocaleText;
  planetColor: string;
  startDate: string;
  endDate: string;
  startSign: number;
  startSignName: LocaleText;
  endSign: number;
  endSignName: LocaleText;
  durationDays: number;
}

export interface CombustEvent {
  planetId: number;
  planetName: LocaleText;
  planetColor: string;
  startDate: string;
  endDate: string;
  durationDays: number;
}

// Combustion orbs in degrees from the Sun (BPHS Ch. 3, Shloka 5-7).
// When a planet's angular separation from the Sun is less than this orb,
// the planet is considered combust (asta) and loses strength.
//
// Lesson X: Mercury and Venus have REDUCED orbs when retrograde:
//   Mercury: 14° direct → 12° retrograde
//   Venus:   10° direct → 8° retrograde
// The reduced orbs are applied dynamically in generateCombustionCalendar().
//
// Note: Rahu/Ketu (7/8) are shadow planets and cannot be combust.
// Moon combustion (Amavasya proximity) is detected but short events (<3 days)
// are filtered out since they occur every month and would clutter the calendar.
const COMBUSTION_ORBS: Record<number, number> = {
  1: 12,  // Moon (Chandra) — within 12° of Sun
  2: 17,  // Mars (Mangal) — widest orb due to slower motion
  3: 14,  // Mercury (Budha) — 12° when retrograde (applied dynamically below)
  4: 11,  // Jupiter (Guru)
  5: 10,  // Venus (Shukra) — 8° when retrograde (applied dynamically below)
  6: 15,  // Saturn (Shani)
};

/**
 * Compute a planet's daily speed (degrees/day) via finite difference.
 *
 * Speed = position(jd+1) - position(jd), normalised to [-180°, +180°] to
 * handle the 0°/360° wrap. A negative speed indicates retrograde motion.
 *
 * This is a 1-day forward difference — adequate for detecting retrograde
 * state changes but not for pinpointing the exact station moment (which
 * would need sub-day interpolation or bisection).
 */
function getDailySpeed(planetId: number, jd: number): number {
  const pos1 = getPlanetaryPositions(jd);
  const pos2 = getPlanetaryPositions(jd + 1);
  const p1 = pos1[planetId].longitude;
  const p2 = pos2[planetId].longitude;
  // Normalise to [-180, +180] to handle the 360°→0° boundary
  let diff = p2 - p1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

/**
 * Convert a Julian Day number to a "YYYY-MM-DD" date string.
 *
 * Uses the algorithm from Meeus Ch. 7 (based on Fliegel & Van Flandern, 1968).
 * This is a pure integer arithmetic conversion — no Date object or timezone
 * involved, so the result is always in UT (Lesson L: avoid local-time Date
 * constructors in computation code).
 */
function jdToDateStr(jd: number): string {
  const J = Math.floor(jd + 0.5);
  let l = J + 68569;
  const n = Math.floor(4 * l / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor(4000 * (l + 1) / 1461001);
  l = l - Math.floor(1461 * i / 4) + 31;
  const j = Math.floor(80 * l / 2447);
  const day = l - Math.floor(2447 * j / 80);
  l = Math.floor(j / 11);
  const month = j + 2 - 12 * l;
  const year = 100 * (n - 49) + i + l;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Generate retrograde periods for all applicable planets across a full year.
 *
 * Algorithm: for each planet, iterate day-by-day from Jan 1 to Dec 31.
 * On each day, compute the daily speed (position difference). When speed
 * changes sign from positive (direct) to negative (retrograde), record the
 * start. When it flips back, record the end and emit a RetroPeriod.
 *
 * Only the five true planets can retrograde:
 *   - Mercury: ~3 times/year, ~21 days each
 *   - Venus:   ~once every 18 months, ~42 days
 *   - Mars:    ~once every 2 years, ~72 days
 *   - Jupiter: ~once/year, ~121 days
 *   - Saturn:  ~once/year, ~138 days
 *
 * Sun and Moon never retrograde. Rahu/Ketu are always retrograde by definition.
 *
 * Edge case: if a planet is still retrograde on Dec 31, the period is closed
 * at year-end with an endDate of Dec 31.
 */
export function generateRetrogradeCalendar(year: number): RetroPeriod[] {
  const periods: RetroPeriod[] = [];
  // Planet IDs from GRAHAS: Mars=2, Mercury=3, Jupiter=4, Venus=5, Saturn=6
  const retroPlanets = [2, 3, 4, 5, 6];

  // Scan from Jan 1 noon UT to Dec 31 noon UT, one day at a time
  const startJD = dateToJD(year, 1, 1, 12);
  const endJD = dateToJD(year, 12, 31, 12);

  for (const pid of retroPlanets) {
    let wasRetro = false;        // State tracker: was planet retrograde yesterday?
    let retroStartJD = 0;        // JD when current retrograde period began
    let retroStartSign = 1;      // Sidereal rashi at start of retrograde

    for (let jd = startJD; jd <= endJD; jd += 1) {
      // Retrograde detection: negative daily speed = apparent westward motion
      const speed = getDailySpeed(pid, jd);
      const isRetro = speed < 0;
      // Compute sidereal longitude for rashi determination
      const ayan = lahiriAyanamsha(jd);

      if (isRetro && !wasRetro) {
        // State transition: direct → retrograde (station retrograde)
        retroStartJD = jd;
        const pos = getPlanetaryPositions(jd);
        const sidLong = normalizeDeg(pos[pid].longitude - ayan);
        retroStartSign = Math.floor(sidLong / 30) + 1;  // 1-based rashi ID
      } else if (!isRetro && wasRetro) {
        // State transition: retrograde → direct (station direct)
        const pos = getPlanetaryPositions(jd);
        const sidLong = normalizeDeg(pos[pid].longitude - ayan);
        const endSign = Math.floor(sidLong / 30) + 1;

        periods.push({
          planetId: pid,
          planetName: GRAHAS[pid].name,
          planetColor: GRAHAS[pid].color,
          startDate: jdToDateStr(retroStartJD),
          endDate: jdToDateStr(jd),
          startSign: retroStartSign,
          startSignName: RASHIS[retroStartSign - 1].name,
          endSign,
          endSignName: RASHIS[endSign - 1].name,
          durationDays: Math.round(jd - retroStartJD),
        });
      }
      wasRetro = isRetro;
    }

    // If still retrograde at year end, close the period
    if (wasRetro) {
      const ayan = lahiriAyanamsha(endJD);
      const pos = getPlanetaryPositions(endJD);
      const sidLong = normalizeDeg(pos[pid].longitude - ayan);
      const endSign = Math.floor(sidLong / 30) + 1;

      periods.push({
        planetId: pid,
        planetName: GRAHAS[pid].name,
        planetColor: GRAHAS[pid].color,
        startDate: jdToDateStr(retroStartJD),
        endDate: jdToDateStr(endJD),
        startSign: retroStartSign,
        startSignName: RASHIS[retroStartSign - 1].name,
        endSign,
        endSignName: RASHIS[endSign - 1].name,
        durationDays: Math.round(endJD - retroStartJD),
      });
    }
  }

  // Sort by start date
  periods.sort((a, b) => a.startDate.localeCompare(b.startDate));
  return periods;
}

/**
 * Generate combustion (asta) periods for all applicable planets across a full year.
 *
 * Algorithm: for each planet, iterate day-by-day and compute the angular
 * separation from the Sun. When the separation falls below the planet's
 * combustion orb (BPHS Ch. 3), the planet enters combustion. When it rises
 * above the orb, the combustion period ends.
 *
 * Combustion orbs differ per planet (see COMBUSTION_ORBS above) and are
 * further reduced for retrograde Mercury/Venus (Lesson X, BPHS):
 *   Mercury: 14° direct → 12° retrograde
 *   Venus:   10° direct → 8° retrograde
 *
 * Moon combustion (proximity to Amavasya) is detected but events shorter
 * than 3 days are filtered out since they occur every lunar month and
 * would clutter the calendar display.
 *
 * Rahu and Ketu are shadow planets (chaya grahas) and cannot be combust.
 */
export function generateCombustionCalendar(year: number): CombustEvent[] {
  const events: CombustEvent[] = [];
  // Planet IDs: Moon=1, Mars=2, Mercury=3, Jupiter=4, Venus=5, Saturn=6
  // Sun (0) is excluded (a planet cannot be combust by itself).
  // Rahu (7) and Ketu (8) are excluded (shadow planets, no physical body).
  const combustPlanets = [1, 2, 3, 4, 5, 6];

  const startJD = dateToJD(year, 1, 1, 12);
  const endJD = dateToJD(year, 12, 31, 12);

  for (const pid of combustPlanets) {
    const orb = COMBUSTION_ORBS[pid];
    if (!orb) continue;

    let wasCombust = false;
    let combustStartJD = 0;

    for (let jd = startJD; jd <= endJD; jd += 1) {
      const positions = getPlanetaryPositions(jd);
      const sunLong = positions[0].longitude;     // Sun is always planet ID 0
      const planetLong = positions[pid].longitude;
      // Angular separation on the ecliptic (shortest arc between two points)
      let sep = Math.abs(planetLong - sunLong);
      if (sep > 180) sep = 360 - sep;
      // Lesson X (BPHS Ch. 3): retrograde Mercury and Venus have reduced
      // combustion orbs because their apparent brightness increases when
      // retrograde (closer to Earth), making them visible despite proximity to Sun.
      const isRetro = positions[pid].speed < 0;
      const effectiveOrb = (isRetro && pid === 3) ? 12 : (isRetro && pid === 5) ? 8 : orb;
      const isCombust = sep < effectiveOrb;

      if (isCombust && !wasCombust) {
        // State transition: visible → combust
        combustStartJD = jd;
      } else if (!isCombust && wasCombust) {
        // State transition: combust → visible
        // Filter Moon: skip combustion events shorter than 3 days (too frequent)
        if (pid === 1 && (jd - combustStartJD) < 3) {
          wasCombust = false;
          continue;
        }
        events.push({
          planetId: pid,
          planetName: GRAHAS[pid].name,
          planetColor: GRAHAS[pid].color,
          startDate: jdToDateStr(combustStartJD),
          endDate: jdToDateStr(jd),
          durationDays: Math.round(jd - combustStartJD),
        });
      }
      wasCombust = isCombust;
    }

    if (wasCombust) {
      events.push({
        planetId: pid,
        planetName: GRAHAS[pid].name,
        planetColor: GRAHAS[pid].color,
        startDate: jdToDateStr(combustStartJD),
        endDate: jdToDateStr(endJD),
        durationDays: Math.round(endJD - combustStartJD),
      });
    }
  }

  events.sort((a, b) => a.startDate.localeCompare(b.startDate));
  return events;
}
