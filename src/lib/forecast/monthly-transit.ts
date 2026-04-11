/**
 * Monthly Transit Computation
 * Computes slow-planet positions for each month of a given year,
 * mapped against a natal chart's ascendant and SAV table.
 */

import { getPlanetaryPositions, toSidereal, dateToJD } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import type { Trilingual } from '@/types/panchang';

export interface MonthlyPlanetTransit {
  planetId: number;
  planetName: Trilingual;
  sign: number;
  signName: Trilingual;
  house: number;          // from natal ascendant
  savBindu: number;
  isRetrograde: boolean;
  signChanged: boolean;   // changed sign vs previous month
}

export interface MonthlyTransitSnapshot {
  month: number;          // 1-12
  monthName: string;      // "Jan 2026"
  planets: MonthlyPlanetTransit[];
  avgSav: number;         // average SAV across slow planets this month
  outlook: 'favorable' | 'mixed' | 'challenging';
  significantEvents: string[]; // e.g., "Saturn enters Pisces", "Jupiter retrograde begins"
}

const SLOW_PLANET_IDS = [6, 4, 7, 8]; // Saturn, Jupiter, Rahu, Ketu

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function computeMonthlyTransits(
  ascendantSign: number,
  savTable: number[],
  year: number,
): MonthlyTransitSnapshot[] {
  const snapshots: MonthlyTransitSnapshot[] = [];
  let prevSigns: Record<number, number> = {};

  for (let m = 1; m <= 12; m++) {
    // Mid-month position (15th at noon UT)
    const jd = dateToJD(year, m, 15, 12);
    const positions = getPlanetaryPositions(jd);
    const planets: MonthlyPlanetTransit[] = [];
    const events: string[] = [];

    for (const pid of SLOW_PLANET_IDS) {
      const pos = positions.find(p => p.id === pid);
      if (!pos) continue;

      const sidLon = toSidereal(pos.longitude, jd);
      const sign = Math.floor(sidLon / 30) + 1;
      const house = ((sign - ascendantSign + 12) % 12) + 1;
      const savBindu = savTable[sign - 1] || 0;
      const isRetrograde = pos.speed < 0;
      const signChanged = prevSigns[pid] !== undefined && prevSigns[pid] !== sign;

      if (signChanged) {
        const graha = GRAHAS[pid];
        const rashi = RASHIS[sign - 1];
        events.push(`${graha?.name?.en || 'Planet'} enters ${rashi?.name?.en || 'sign'}`);
      }

      // Check retrograde start (was direct last month, retrograde now)
      // Simplified: just note if retrograde
      if (isRetrograde && pid !== 7 && pid !== 8) {
        events.push(`${GRAHAS[pid]?.name?.en || 'Planet'} retrograde`);
      }

      planets.push({
        planetId: pid,
        planetName: GRAHAS[pid]?.name || { en: 'Planet', hi: 'ग्रह', sa: 'ग्रहः' },
        sign,
        signName: RASHIS[sign - 1]?.name || { en: '?', hi: '?', sa: '?' },
        house,
        savBindu,
        isRetrograde,
        signChanged,
      });

      prevSigns[pid] = sign;
    }

    const avgSav = planets.length > 0
      ? Math.round(planets.reduce((sum, p) => sum + p.savBindu, 0) / planets.length)
      : 25;

    const outlook: MonthlyTransitSnapshot['outlook'] =
      avgSav >= 28 ? 'favorable' : avgSav < 22 ? 'challenging' : 'mixed';

    snapshots.push({
      month: m,
      monthName: `${MONTH_NAMES[m - 1]} ${year}`,
      planets,
      avgSav,
      outlook,
      significantEvents: events,
    });
  }

  return snapshots;
}
