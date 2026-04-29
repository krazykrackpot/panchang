/**
 * KP Chart Generator (Orchestrator)
 *
 * Brings together Placidus cusps, sub-lord lookup, significator
 * calculation, and ruling planets to produce a complete KPChartData
 * object from raw birth data.
 */

import {
  dateToJD,
  getPlanetaryPositions,
  normalizeDeg,
  getRashiNumber,
  getNakshatraNumber,
  formatDegrees,
} from '@/lib/ephem/astronomical';
import { getAyanamsa } from '@/lib/astronomy/ayanamsa';
import { computeCombust } from '@/lib/ephem/coordinates';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { GRAHAS } from '@/lib/constants/grahas';
import {
  EXALTATION_SIGNS as EXALTATION,
  DEBILITATION_SIGNS as DEBILITATION,
  OWN_SIGNS,
} from '@/lib/constants/dignities';

import type { BirthData, ChartData } from '@/types/kundali';
import type { KPChartData, KPCusp, KPPlanet } from '@/types/kp';

import { calculatePlacidusCusps } from './placidus';
import { getSubLordForDegree } from './sub-lords';
import { calculateSignificators, calculateCuspalAnalysis } from './significators';
import { getRulingPlanets } from './ruling-planets';

// ---------------------------------------------------------------------------
// KP-specific ayanamsha — uses the Krishnamurti variant which differs
// from Lahiri by ~6 arcminutes. This matters for sub-lord boundaries.
// ---------------------------------------------------------------------------

function kpAyanamsha(jd: number): number {
  return getAyanamsa(jd, 'krishnamurti');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse BirthData.date (ISO "YYYY-MM-DD") + time ("HH:mm") into a JD */
function birthDataToJD(bd: BirthData): number {
  const [yearStr, monthStr, dayStr] = bd.date.split('-');
  const [hourStr, minStr] = bd.time.split(':');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10) + parseInt(minStr, 10) / 60;

  // Convert local time to UT using the timezone string.
  // For simplicity we parse common Indian timezone offset (+05:30).
  const utHour = hour - tzOffsetHours(bd.timezone, year, month, day);

  return dateToJD(year, month, day, utHour);
}

/** Resolve timezone string to numeric offset in hours (DST-aware when date is provided) */
function tzOffsetHours(tz: string, year?: number, month?: number, day?: number): number {
  // Try as numeric first
  const num = parseFloat(tz);
  if (!isNaN(num) && tz.match(/^-?\d+\.?\d*$/)) return num;

  // Try parsing "+HH:MM" / "-HH:MM" style
  const m = tz.match(/^([+-])(\d{1,2}):(\d{2})$/);
  if (m) {
    const sign = m[1] === '-' ? -1 : 1;
    return sign * (parseInt(m[2], 10) + parseInt(m[3], 10) / 60);
  }

  // Try as IANA timezone string using Intl API (DST-aware)
  if (year && month && day) {
    try {
      const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'shortOffset',
      });
      const parts = formatter.formatToParts(date);
      const tzPart = parts.find(p => p.type === 'timeZoneName');
      if (tzPart) {
        const match = tzPart.value.match(/GMT([+-]?)(\d{1,2})(?::(\d{2}))?/);
        if (match) {
          const sign = match[1] === '-' ? -1 : 1;
          const hours = parseInt(match[2], 10);
          const minutes = match[3] ? parseInt(match[3], 10) : 0;
          return sign * (hours + minutes / 60);
        }
      }
    } catch {
      // Invalid timezone, fall through
    }
  }

  // Last resort: try common names without DST (for backward compat)
  const staticMap: Record<string, number> = {
    'Asia/Kolkata': 5.5,
    'Asia/Calcutta': 5.5,
    IST: 5.5,
    UTC: 0,
    GMT: 0,
  };
  if (staticMap[tz] !== undefined) return staticMap[tz];

  return 0; // Default to UTC, not IST
}

/** Get nakshatra pada (1-4) from sidereal longitude */
function getPada(sidLong: number): number {
  const nkSpan = 360 / 27;
  const posInNk = ((sidLong % 360 + 360) % 360) % nkSpan;
  return Math.floor(posInNk / (nkSpan / 4)) + 1;
}

// ---------------------------------------------------------------------------
// Planet dignities (simplified)
// ---------------------------------------------------------------------------

// Dignity constants imported from @/lib/constants/dignities (see import block above)

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a complete KP chart from birth data.
 */
export function generateKPChart(birthData: BirthData): KPChartData {
  // 1. Compute Julian Day
  const jd = birthDataToJD(birthData);

  // 2. Ayanamsha
  const ayanamshaVal = kpAyanamsha(jd);

  // 3. Placidus cusps (returns HouseCusp[])
  const rawCusps = calculatePlacidusCusps(jd, birthData.lat, birthData.lng, ayanamshaVal);

  // 4. Enrich cusps with sub-lord info -> KPCusp[]
  const cusps: KPCusp[] = rawCusps.map((c) => ({
    ...c,
    subLordInfo: getSubLordForDegree(c.degree),
  }));

  // 5. Planetary positions (tropical) -> convert to sidereal -> KPPlanet[]
  const rawPlanets = getPlanetaryPositions(jd);

  const planets: KPPlanet[] = rawPlanets.map((rp) => {
    const sidLong = normalizeDeg(rp.longitude - ayanamshaVal);
    const signNum = getRashiNumber(sidLong);
    const nkNum = getNakshatraNumber(sidLong);
    const rashi = RASHIS[signNum - 1];
    const nk = NAKSHATRAS[nkNum - 1];
    const graha = GRAHAS[rp.id];
    const pada = getPada(sidLong);

    // Determine house
    const house = findHouseForDegree(sidLong, cusps);

    // Dignities
    const isExalted = EXALTATION[rp.id] === signNum;
    const isDebilitated = DEBILITATION[rp.id] === signNum;
    const isOwnSign = (OWN_SIGNS[rp.id] ?? []).includes(signNum);

    // Combustion — uses planet-specific orbs from coordinates.ts computeCombust().
    //
    // Classical BPHS orbs: Moon=12°, Mars=17°, Mercury=14°(direct)/12°(retro),
    // Jupiter=11°, Venus=10°(direct)/8°(retro), Saturn=15°.
    //
    // HISTORICAL BUG (now fixed): a uniform 6° orb was used for all planets,
    // which is only close to Mercury's combust orb.  Consequences:
    //   • Moon (12°) and Saturn (15°) combustion almost never triggered
    //   • Mars (17°) combustion barely triggered
    //   • Correct combust status for Jupiter/Venus was a coin flip
    // Now delegates to computeCombust() which implements the full classical table.
    const sunSid = normalizeDeg(rawPlanets[0].longitude - ayanamshaVal);
    const isCombust = computeCombust(rp.id, sidLong, sunSid, rp.isRetrograde);

    const kpPlanet: KPPlanet = {
      planet: graha,
      longitude: sidLong,
      latitude: 0,
      speed: rp.speed,
      sign: signNum,
      signName: rashi?.name ?? { en: '', hi: '', sa: '' },
      house,
      nakshatra: nk,
      pada,
      degree: formatDegrees(sidLong % 30),
      isRetrograde: rp.isRetrograde,
      isCombust,
      isExalted,
      isDebilitated,
      isOwnSign,
      subLordInfo: getSubLordForDegree(sidLong),
    };

    return kpPlanet;
  });

  // 6. Significators
  const significators = calculateSignificators(planets, cusps);

  // 6b. Cuspal sub-lord analysis (P2-05)
  const cuspalAnalysis = calculateCuspalAnalysis(cusps, significators);

  // 7. Ruling planets
  const ascDeg = cusps[0]?.degree ?? 0;
  const moonPlanet = planets.find((p) => p.planet.id === 1);
  const moonDeg = moonPlanet?.longitude ?? 0;
  const rulingPlanets = getRulingPlanets(jd, ascDeg, moonDeg);

  // 8. Build chart data (houses array: which planet ids in which house)
  const housesArr: number[][] = Array.from({ length: 12 }, () => []);
  for (const p of planets) {
    if (p.house >= 1 && p.house <= 12) {
      housesArr[p.house - 1].push(p.planet.id);
    }
  }

  const chart: ChartData = {
    houses: housesArr,
    ascendantDeg: ascDeg,
    ascendantSign: cusps[0]?.sign ?? 1,
  };

  // 9. Return KPChartData
  return {
    birthData,
    cusps,
    planets,
    significators,
    cuspalAnalysis,
    rulingPlanets,
    chart,
    ayanamshaValue: ayanamshaVal,
    julianDay: jd,
  };
}

// ---------------------------------------------------------------------------
// Internal: determine house for a sidereal degree using cusp boundaries
// ---------------------------------------------------------------------------

function findHouseForDegree(deg: number, cusps: KPCusp[]): number {
  const sorted = [...cusps].sort((a, b) => a.house - b.house);
  const normDeg = ((deg % 360) + 360) % 360;

  for (let i = 0; i < 12; i++) {
    const cuspStart = sorted[i].degree;
    const cuspEnd = sorted[(i + 1) % 12].degree;

    if (cuspEnd > cuspStart) {
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

  return 1;
}
