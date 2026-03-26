/**
 * Retrograde & Combustion Calendar Engine
 * Scans a full year to detect retrograde periods and combustion windows
 */

import { dateToJD, getPlanetaryPositions, toSidereal, lahiriAyanamsha, normalizeDeg } from '@/lib/ephem/astronomical';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';
import type { Trilingual } from '@/types/panchang';

export interface RetroEvent {
  planetId: number;
  planetName: Trilingual;
  type: 'retrograde_start' | 'retrograde_end';
  date: string;         // YYYY-MM-DD
  sign: number;         // rashi at event
  signName: Trilingual;
}

export interface RetroPeriod {
  planetId: number;
  planetName: Trilingual;
  planetColor: string;
  startDate: string;
  endDate: string;
  startSign: number;
  startSignName: Trilingual;
  endSign: number;
  endSignName: Trilingual;
  durationDays: number;
}

export interface CombustEvent {
  planetId: number;
  planetName: Trilingual;
  planetColor: string;
  startDate: string;
  endDate: string;
  durationDays: number;
}

// Combustion orbs (degrees from Sun)
const COMBUSTION_ORBS: Record<number, number> = {
  1: 12,  // Moon
  2: 17,  // Mars
  3: 14,  // Mercury (12 if retro, but simplified)
  4: 11,  // Jupiter
  5: 10,  // Venus (8 if retro, but simplified)
  6: 15,  // Saturn
};

/**
 * Compute true daily speed by position difference
 */
function getDailySpeed(planetId: number, jd: number): number {
  const pos1 = getPlanetaryPositions(jd);
  const pos2 = getPlanetaryPositions(jd + 1);
  const p1 = pos1[planetId].longitude;
  const p2 = pos2[planetId].longitude;
  let diff = p2 - p1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff;
}

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

export function generateRetrogradeCalendar(year: number): RetroPeriod[] {
  const periods: RetroPeriod[] = [];
  // Planets that can retrograde: Mars(2), Mercury(3), Jupiter(4), Venus(5), Saturn(6)
  const retroPlanets = [2, 3, 4, 5, 6];

  const startJD = dateToJD(year, 1, 1, 12);
  const endJD = dateToJD(year, 12, 31, 12);

  for (const pid of retroPlanets) {
    let wasRetro = false;
    let retroStartJD = 0;
    let retroStartSign = 1;

    for (let jd = startJD; jd <= endJD; jd += 1) {
      const speed = getDailySpeed(pid, jd);
      const isRetro = speed < 0;
      const ayan = lahiriAyanamsha(jd);

      if (isRetro && !wasRetro) {
        // Retrograde start
        retroStartJD = jd;
        const pos = getPlanetaryPositions(jd);
        const sidLong = normalizeDeg(pos[pid].longitude - ayan);
        retroStartSign = Math.floor(sidLong / 30) + 1;
      } else if (!isRetro && wasRetro) {
        // Retrograde end
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

export function generateCombustionCalendar(year: number): CombustEvent[] {
  const events: CombustEvent[] = [];
  const combustPlanets = [1, 2, 3, 4, 5, 6]; // Moon-Saturn (not Rahu/Ketu)

  const startJD = dateToJD(year, 1, 1, 12);
  const endJD = dateToJD(year, 12, 31, 12);

  for (const pid of combustPlanets) {
    const orb = COMBUSTION_ORBS[pid];
    if (!orb) continue;

    let wasCombust = false;
    let combustStartJD = 0;

    for (let jd = startJD; jd <= endJD; jd += 1) {
      const positions = getPlanetaryPositions(jd);
      const sunLong = positions[0].longitude;
      const planetLong = positions[pid].longitude;
      let sep = Math.abs(planetLong - sunLong);
      if (sep > 180) sep = 360 - sep;
      const isCombust = sep < orb;

      if (isCombust && !wasCombust) {
        combustStartJD = jd;
      } else if (!isCombust && wasCombust) {
        // Skip Moon combustion events (too frequent, short)
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
