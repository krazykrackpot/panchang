/**
 * Planet Transit Calendar
 *
 * Computes sign-change dates for all 9 planets throughout a year.
 * Uses sidereal longitudes (Lahiri ayanamsha).
 */

import { dateToJD, toSidereal, getRashiNumber, getPlanetaryPositions } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import type { LocaleText} from '@/types/panchang';

export interface TransitEvent {
  planetId: number;
  planetName: LocaleText;
  planetColor: string;
  fromSign: number;
  fromSignName: LocaleText;
  toSign: number;
  toSignName: LocaleText;
  date: string; // YYYY-MM-DD
  significance: 'major' | 'moderate' | 'minor';
}

/**
 * Generate transit events for a year.
 * Scans daily to detect sign changes for each planet.
 */
export function generateTransitCalendar(year: number): TransitEvent[] {
  const events: TransitEvent[] = [];

  // Track each planet's current sidereal sign
  const jdStart = dateToJD(year, 1, 1, 6);
  const startPositions = getPlanetaryPositions(jdStart);
  const currentSigns: number[] = startPositions.map(p => {
    const sid = toSidereal(p.longitude, jdStart);
    return getRashiNumber(sid);
  });

  // Scan day by day through the year
  const daysInYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;

  for (let dayOffset = 1; dayOffset <= daysInYear; dayOffset++) {
    const month = getMonthDay(year, dayOffset);
    if (!month) continue;
    const { m, d } = month;

    const jd = dateToJD(year, m, d, 6);
    const positions = getPlanetaryPositions(jd);

    for (let i = 0; i < positions.length; i++) {
      const sid = toSidereal(positions[i].longitude, jd);
      const newSign = getRashiNumber(sid);

      if (newSign !== currentSigns[i]) {
        const graha = GRAHAS[i];
        const fromRashi = RASHIS[(currentSigns[i] - 1)];
        const toRashi = RASHIS[(newSign - 1)];

        // Determine significance
        let significance: TransitEvent['significance'] = 'minor';
        if (i === 4 || i === 6) significance = 'major';     // Jupiter, Saturn
        else if (i === 7 || i === 8) significance = 'major'; // Rahu, Ketu
        else if (i === 2) significance = 'moderate';          // Mars

        events.push({
          planetId: i,
          planetName: graha.name,
          planetColor: graha.color,
          fromSign: currentSigns[i],
          fromSignName: fromRashi.name,
          toSign: newSign,
          toSignName: toRashi.name,
          date: `${year}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`,
          significance,
        });

        currentSigns[i] = newSign;
      }
    }
  }

  return events;
}

/** Convert day-of-year to month/day */
function getMonthDay(year: number, dayOfYear: number): { m: number; d: number } | null {
  const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthDays = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let remaining = dayOfYear;
  for (let m = 0; m < 12; m++) {
    if (remaining <= monthDays[m]) {
      return { m: m + 1, d: remaining };
    }
    remaining -= monthDays[m];
  }
  return null;
}
