/**
 * Placidus House System
 *
 * Calculates the 12 house cusps using the Placidus method, which is the
 * standard house system used in Krishnamurti Paddhati (KP) astrology.
 *
 * Algorithm:
 *  1. Compute RAMC (Right Ascension of the Midheaven) from Local Sidereal Time.
 *  2. MC = RAMC, IC = RAMC + 180.
 *  3. Intermediate cusps (11, 12, 2, 3) via semi-arc trisection.
 *  4. Opposing cusps derived by adding 180 degrees.
 *  5. All longitudes converted to sidereal by subtracting ayanamsha.
 */

import { normalizeDeg } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import type { HouseCusp } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Sign-lord mapping (sign 1-12 -> planet id)
// ---------------------------------------------------------------------------

const SIGN_LORD_IDS: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

// ---------------------------------------------------------------------------
// Trigonometric helpers (degrees)
// ---------------------------------------------------------------------------

const DEG = Math.PI / 180;

function sinD(d: number): number { return Math.sin(d * DEG); }
function cosD(d: number): number { return Math.cos(d * DEG); }
function tanD(d: number): number { return Math.tan(d * DEG); }
function asinD(x: number): number { return Math.asin(clamp(x, -1, 1)) / DEG; }
function atan2D(y: number, x: number): number { return Math.atan2(y, x) / DEG; }

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

// ---------------------------------------------------------------------------
// Obliquity of the ecliptic
// ---------------------------------------------------------------------------

function obliquity(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  // IAU formula (Meeus Ch. 22)
  return 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T + 5.036e-7 * T * T * T;
}

// ---------------------------------------------------------------------------
// Local Sidereal Time -> RAMC
// ---------------------------------------------------------------------------

function localSiderealTime(jd: number, lng: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  // Greenwich Mean Sidereal Time in degrees (Meeus Ch. 12)
  let gmst = 280.46061837
    + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T
    - T * T * T / 38710000.0;
  gmst = normalizeDeg(gmst);
  // Local ST = GMST + observer longitude
  return normalizeDeg(gmst + lng);
}

// ---------------------------------------------------------------------------
// Ecliptic longitude from RAMC (Midheaven / MC)
// ---------------------------------------------------------------------------

function mcLongitude(ramc: number, eps: number): number {
  // MC ecliptic longitude: atan(tan(RAMC) / cos(eps))
  // Quadrant-aware
  const mc = atan2D(sinD(ramc), cosD(ramc) * cosD(eps));
  return normalizeDeg(mc);
}

// ---------------------------------------------------------------------------
// Placidus intermediate cusp via iterative semi-arc trisection
// ---------------------------------------------------------------------------

function placidusIntermediate(
  ramc: number,
  eps: number,
  lat: number,
  houseOffset: number, // fraction of semi-arc: 1/3 or 2/3
  isAboveHorizon: boolean
): number {
  // Iterative approach to solve Placidus cusps
  // For houses above the horizon (10-12 & 1): use diurnal semi-arc
  // For houses below (4-6 & 7): use nocturnal semi-arc

  let cusp = normalizeDeg(ramc + houseOffset * 90);
  let converged = false;

  for (let i = 0; i < 50; i++) {
    const decl = asinD(sinD(eps) * sinD(cusp));
    const ad = asinD(tanD(lat) * tanD(decl)); // ascensional difference

    let sa: number;
    if (isAboveHorizon) {
      sa = 90 + ad; // diurnal semi-arc
    } else {
      sa = 90 - ad; // nocturnal semi-arc
    }

    const ra = normalizeDeg(ramc + houseOffset * sa);
    const newCusp = mcLongitude(ra, eps);

    if (Math.abs(newCusp - cusp) < 0.001) {
      converged = true;
      return normalizeDeg(newCusp);
    }
    cusp = newCusp;
  }

  if (!converged) {
    // Polar latitudes (|lat| > ~66°) can prevent Placidus convergence.
    // Fall back to equal house: divide the semicircle into equal 30° segments from the ascendant.
    console.warn(`[placidus] Cusp did not converge at lat ${lat}. Falling back to equal house.`);
    const ascDeg = ascendant(ramc, eps, lat);
    // houseOffset 1/3 above → cusp 11 (Asc + 300°), 2/3 above → cusp 12 (Asc + 330°)
    // houseOffset 1/3 below → cusp 2 (Asc + 30°),  2/3 below → cusp 3 (Asc + 60°)
    if (isAboveHorizon) {
      cusp = normalizeDeg(ascDeg + (houseOffset < 0.5 ? 300 : 330));
    } else {
      cusp = normalizeDeg(ascDeg + (houseOffset < 0.5 ? 30 : 60));
    }
  }

  return normalizeDeg(cusp);
}

// ---------------------------------------------------------------------------
// Ascendant calculation
// ---------------------------------------------------------------------------

function ascendant(ramc: number, eps: number, lat: number): number {
  // Asc = atan2(-cos(RAMC), sin(RAMC)*cos(eps) + tan(lat)*sin(eps))
  const asc = atan2D(
    -cosD(ramc),
    sinD(ramc) * cosD(eps) + tanD(lat) * sinD(eps)
  );
  return normalizeDeg(asc);
}

// ---------------------------------------------------------------------------
// Build HouseCusp object from tropical degree
// ---------------------------------------------------------------------------

function buildCusp(house: number, tropDeg: number, ayanamsha: number): HouseCusp {
  const sidDeg = normalizeDeg(tropDeg - ayanamsha);
  const signNum = Math.floor(sidDeg / 30) + 1; // 1-12
  const rashi = RASHIS[signNum - 1];
  const lordId = SIGN_LORD_IDS[signNum];
  const lord = GRAHAS[lordId];

  return {
    house,
    degree: sidDeg,
    sign: signNum,
    signName: rashi?.name ?? { en: '', hi: '', sa: '' },
    lord: lord?.name.en ?? '',
    lordName: lord?.name ?? { en: '', hi: '', sa: '' },
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Calculate the 12 Placidus house cusps.
 *
 * @param jd        Julian Day number
 * @param lat       Geographic latitude (degrees, north positive)
 * @param lng       Geographic longitude (degrees, east positive)
 * @param ayanamsha Ayanamsha value to subtract for sidereal conversion
 * @returns Array of 12 HouseCusp objects (house 1-12)
 */
export function calculatePlacidusCusps(
  jd: number,
  lat: number,
  lng: number,
  ayanamsha: number
): HouseCusp[] {
  const eps = obliquity(jd);
  const ramc = localSiderealTime(jd, lng); // RAMC in degrees

  // MC (cusp 10) and IC (cusp 4)
  const mc = mcLongitude(ramc, eps);
  const ic = normalizeDeg(mc + 180);

  // Ascendant (cusp 1) and Descendant (cusp 7)
  const asc = ascendant(ramc, eps, lat);
  const dsc = normalizeDeg(asc + 180);

  // Intermediate cusps via semi-arc trisection
  // Above horizon (MC -> Asc): cusps 11, 12
  const cusp11 = placidusIntermediate(ramc, eps, lat, 1 / 3, true);
  const cusp12 = placidusIntermediate(ramc, eps, lat, 2 / 3, true);

  // Below horizon (IC -> Dsc): cusps 2, 3
  const cusp2 = placidusIntermediate(ramc + 180, eps, lat, 1 / 3, false);
  const cusp3 = placidusIntermediate(ramc + 180, eps, lat, 2 / 3, false);

  // Opposing cusps
  const cusp5 = normalizeDeg(cusp11 + 180);
  const cusp6 = normalizeDeg(cusp12 + 180);
  const cusp8 = normalizeDeg(cusp2 + 180);
  const cusp9 = normalizeDeg(cusp3 + 180);

  // Tropical longitudes in house order (1-12)
  const tropCusps = [
    asc,     // 1
    cusp2,   // 2
    cusp3,   // 3
    ic,      // 4
    cusp5,   // 5
    cusp6,   // 6
    dsc,     // 7
    cusp8,   // 8
    cusp9,   // 9
    mc,      // 10
    cusp11,  // 11
    cusp12,  // 12
  ];

  return tropCusps.map((deg, i) => buildCusp(i + 1, deg, ayanamsha));
}
