/**
 * Great Conjunction Tracker — Jupiter-Saturn conjunctions 1800-2100
 *
 * Method: Scan year-by-year, detect months where Jupiter and Saturn come
 * within 10° of each other (sidereal), then binary-search for the exact
 * conjunction date (minimum angular separation).
 *
 * Uses existing getPlanetaryPositions() and toSidereal() from astronomical.ts
 * Planet IDs: 4=Jupiter, 6=Saturn (tropical longitudes from getPlanetaryPositions)
 */

import {
  dateToJD,
  getPlanetaryPositions,
  toSidereal,
  lahiriAyanamsha,
  normalizeDeg,
} from '@/lib/ephem/astronomical';
import {
  getSignElement,
  SIGN_NAMES_EN,
  type ConjunctionElement,
} from './constants';

export interface GreatConjunction {
  date: string;           // ISO date 'YYYY-MM-DD'
  sign: number;           // sidereal rashi 1-12
  signName: string;       // English sign name
  element: ConjunctionElement;
  jupiterLng: number;     // sidereal longitude of Jupiter
  saturnLng: number;      // sidereal longitude of Saturn
  separation: number;     // degrees apart at conjunction
  interpretation: string; // brief historical/thematic note
  isHistorical?: boolean; // true if < today
}

/** Get sidereal longitude for Jupiter (id=4) and Saturn (id=6) at a given JD */
function getJupiterSaturn(jd: number): { jupLng: number; satLng: number } {
  const planets = getPlanetaryPositions(jd);
  const ayanamsha = lahiriAyanamsha(jd);

  const jup = planets.find((p) => p.id === 4);
  const sat = planets.find((p) => p.id === 6);

  // getPlanetaryPositions returns tropical longitudes
  const jupLng = jup ? toSidereal(normalizeDeg(jup.longitude), jd, ayanamsha) : 0;
  const satLng = sat ? toSidereal(normalizeDeg(sat.longitude), jd, ayanamsha) : 0;

  return { jupLng, satLng };
}

/** Angular separation (shortest arc, 0-180°) between two longitudes */
function angularSep(a: number, b: number): number {
  const diff = Math.abs(normalizeDeg(a - b));
  return diff > 180 ? 360 - diff : diff;
}

/** Get rashi number (1-12) from sidereal longitude */
function getRashi(lng: number): number {
  return Math.floor(normalizeDeg(lng) / 30) + 1;
}

/** Historical/thematic annotations keyed by approximate year */
const HISTORICAL_NOTES: Record<number, string> = {
  1821: 'Conjunction in Capricorn — era of industrial revolution and European conservatism',
  1842: 'Conjunction in Capricorn — peak of industrial expansion, British Empire consolidation',
  1861: 'Conjunction in Virgo — US Civil War era, dissolution of old orders',
  1881: 'Conjunction in Taurus — Gilded Age prosperity, colonial peak',
  1901: 'Conjunction in Sagittarius — dawn of the 20th century, colonial empires at zenith',
  1921: 'Conjunction in Virgo — post-WWI reconstruction, rise of fascism',
  1940: 'Conjunction in Taurus — WWII era, material world at war',
  1961: 'Conjunction in Capricorn — Cold War tension, space race, Capricorn industrialism',
  1980: 'Conjunction in Virgo — Thatcher-Reagan era, shift to market economies',
  2000: 'Conjunction in Taurus — dot-com era, material world going digital',
  2020: 'Conjunction in Capricorn/Aquarius — COVID-19 pandemic, digital transformation, start of Air era (first Air sign in 800 years)',
  2040: 'Conjunction in Libra — projected era of diplomacy, balance, and multilateral cooperation',
  2060: 'Conjunction in Gemini — information society peak, AI and communication era',
  2080: 'Conjunction in Aquarius — humanitarian values, technology governance era',
  2100: 'Conjunction in Libra — global balance, ecological restoration era',
};

function getAnnotation(year: number): string {
  // Find the closest annotated year within 10 years
  const years = Object.keys(HISTORICAL_NOTES).map(Number);
  const closest = years.reduce((prev, curr) =>
    Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
  , years[0]);

  if (Math.abs(closest - year) <= 10) {
    return HISTORICAL_NOTES[closest];
  }

  // Generic annotation by element
  return '';
}

/**
 * Find all Jupiter-Saturn conjunctions between startYear and endYear.
 * Scans month-by-month for proximity < 10°, then binary-searches for exact date.
 */
export function findGreatConjunctions(
  startYear: number,
  endYear: number,
): GreatConjunction[] {
  const conjunctions: GreatConjunction[] = [];

  // Jupiter-Saturn cycle is ~20 years; scan month-by-month
  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      const jd1 = dateToJD(year, month, 1);
      const jd2 = dateToJD(year, month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1);

      const { jupLng: jup1, satLng: sat1 } = getJupiterSaturn(jd1);
      const { jupLng: jup2, satLng: sat2 } = getJupiterSaturn(jd2);

      const sep1 = angularSep(jup1, sat1);
      const sep2 = angularSep(jup2, sat2);

      // Check if separation crosses a minimum (conjunction) during this month
      // — i.e., both endpoints are < 10° AND we detect they were even closer midway
      if (sep1 < 10 && sep2 < 10) {
        // Binary-search for the minimum separation day in this month
        let lo = jd1;
        let hi = jd2;

        for (let i = 0; i < 20; i++) {
          const mid1 = lo + (hi - lo) / 3;
          const mid2 = lo + (hi - lo) * 2 / 3;

          const { jupLng: jm1, satLng: sm1 } = getJupiterSaturn(mid1);
          const { jupLng: jm2, satLng: sm2 } = getJupiterSaturn(mid2);

          const s1 = angularSep(jm1, sm1);
          const s2 = angularSep(jm2, sm2);

          if (s1 < s2) {
            hi = mid2;
          } else {
            lo = mid1;
          }
        }

        const exactJd = (lo + hi) / 2;
        const { jupLng, satLng } = getJupiterSaturn(exactJd);
        const finalSep = angularSep(jupLng, satLng);

        // Only record actual conjunction (< 3°) — avoids near-miss multi-passes
        if (finalSep < 3) {
          // Convert JD to date
          const d = new Date(Date.UTC(2000, 0, 1) + (exactJd - 2451545.0) * 86400000);
          const conjYear = d.getUTCFullYear();
          const conjMonth = String(d.getUTCMonth() + 1).padStart(2, '0');
          const conjDay = String(d.getUTCDate()).padStart(2, '0');
          const dateStr = `${conjYear}-${conjMonth}-${conjDay}`;

          // Deduplicate — don't add if we already have a conjunction within 30 days of this
          const lastConj = conjunctions[conjunctions.length - 1];
          if (lastConj) {
            const lastJd = dateToJD(
              parseInt(lastConj.date.slice(0, 4), 10),
              parseInt(lastConj.date.slice(5, 7), 10),
              parseInt(lastConj.date.slice(8, 10), 10),
            );
            if (Math.abs(exactJd - lastJd) < 30) continue; // same conjunction, skip
          }

          const sign = getRashi(jupLng);
          const element = getSignElement(sign);
          const annotation = getAnnotation(conjYear);

          const elementDesc: Record<ConjunctionElement, string> = {
            fire: 'Fire sign — era of idealism, expansion, and religious/political movements',
            earth: 'Earth sign — era of materialism, practical consolidation, economic focus',
            air: 'Air sign — era of ideas, communication, social restructuring',
            water: 'Water sign — era of emotional transformation, hidden forces, spiritual currents',
          };

          const interpretation = annotation || elementDesc[element];

          conjunctions.push({
            date: dateStr,
            sign,
            signName: SIGN_NAMES_EN[sign] ?? `Sign ${sign}`,
            element,
            jupiterLng: jupLng,
            saturnLng: satLng,
            separation: Math.round(finalSep * 100) / 100,
            interpretation,
          });
        }
      }
    }
  }

  return conjunctions;
}

/** Cached result — computed once on first call */
let _cachedConjunctions: GreatConjunction[] | null = null;

/**
 * Get all conjunctions 1800-2100.
 * Results are cached in memory after first computation.
 */
export function getAllGreatConjunctions(): GreatConjunction[] {
  if (_cachedConjunctions) return _cachedConjunctions;
  _cachedConjunctions = findGreatConjunctions(1800, 2100);
  return _cachedConjunctions;
}

/**
 * Get the N conjunctions before and after today.
 */
export function getNearConjunctions(beforeCount = 5, afterCount = 5): {
  past: GreatConjunction[];
  future: GreatConjunction[];
  current: GreatConjunction | null;
} {
  const all = getAllGreatConjunctions();
  const todayISO = new Date().toISOString().slice(0, 10);

  const past: GreatConjunction[] = [];
  const future: GreatConjunction[] = [];
  let current: GreatConjunction | null = null;

  for (const conj of all) {
    const daysAgo = (Date.parse(todayISO) - Date.parse(conj.date)) / 86400000;
    if (daysAgo > 365) {
      past.push({ ...conj, isHistorical: true });
    } else if (daysAgo >= 0) {
      // Within the last year — "current" era
      current = { ...conj, isHistorical: true };
    } else {
      future.push({ ...conj, isHistorical: false });
    }
  }

  return {
    past: past.slice(-beforeCount),
    future: future.slice(0, afterCount),
    current,
  };
}
