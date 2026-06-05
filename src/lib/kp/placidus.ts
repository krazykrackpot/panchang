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

import { normalizeDeg, getRashiNumber } from '@/lib/ephem/astronomical';
import { swissPlacidusCusps } from '@/lib/ephem/swiss-ephemeris';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import type { HouseCusp } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Sign-lord mapping (sign 1-12 -> planet id) — audit P4 #12.
// ---------------------------------------------------------------------------

import { SIGN_LORDS as SIGN_LORD_IDS } from '@/lib/constants/dignities';

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
// Placidus intermediate cusp by hour-angle target
//
// A cusp's hour angle is HA = haOffsetDeg + saCoef × SA, where
//   SA = 90 + ad(cusp) is the diurnal semi-arc (latitude- and declination-
//   dependent). Each of the eight intermediate cusps has a specific
//   (haOffsetDeg, saCoef) pair so the cusps land at distinct positions in
//   the four chart quadrants. The iteration finds the ecliptic point whose
//   own declination yields a self-consistent HA matching the target.
//
//   Cusp 11 (east, above): HA = -SA/3              → (0,   -1/3)
//   Cusp 12 (east, above): HA = -2 SA/3            → (0,   -2/3)
//   Cusp 9  (west, above): HA = +SA/3              → (0,   +1/3)
//   Cusp 8  (west, above): HA = +2 SA/3            → (0,   +2/3)
//   Cusp 2  (east, below): HA = -(2 SA/3 + 60)     → (-60, -2/3)
//   Cusp 3  (east, below): HA = -(SA/3   + 120)    → (-120,-1/3)
//   Cusp 5  (west, below): HA = +(SA/3   + 120)    → (+120,+1/3)
//   Cusp 6  (west, below): HA = +(2 SA/3 + 60)     → (+60, +2/3)
//
// (Standard derivation: nocturnal-semi-arc = 180 − SA; each below-horizon
// cusp at 1/3 or 2/3 of nocturnal-semi-arc past the cardinal point produces
// the (offset, coefficient) pairs above.)
// ---------------------------------------------------------------------------

function angleDiff(a: number, b: number): number {
  let d = a - b;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

function placidusCusp(
  ramc: number,
  eps: number,
  lat: number,
  haOffsetDeg: number,
  saCoef: number,
  fallbackOffsetDeg: number,
): number {
  // Initial guess: assume ad = 0 so SA = 90; iterate from the resulting RA.
  let cusp = mcLongitude(normalizeDeg(ramc - haOffsetDeg - saCoef * 90), eps);

  for (let i = 0; i < 50; i++) {
    const decl = asinD(sinD(eps) * sinD(cusp));
    const adArg = tanD(lat) * tanD(decl);
    // Circumpolar guard — |tan(lat)·tan(decl)| > 1 means the cusp's
    // declination is circumpolar at this latitude (the diurnal/nocturnal
    // semi-arc is undefined). Breaking lets the equal-house fallback
    // below run. The earlier `clamp(adArg, -1, 1)` masked this case and
    // pinned the iteration to a meaningless fixed point.
    if (Math.abs(adArg) > 1.0001) break;
    const ad = asinD(clamp(adArg, -1, 1));
    const sa = 90 + ad;
    const ha = haOffsetDeg + saCoef * sa;
    const ra = normalizeDeg(ramc - ha);
    const newCusp = mcLongitude(ra, eps);

    if (Math.abs(angleDiff(newCusp, cusp)) < 1e-6) return newCusp;
    cusp = newCusp;
  }

  // Polar latitudes (|lat| > ~66°) can prevent Placidus convergence.
  // Fall back to equal-house: 30° segments from the corrected ascendant,
  // with the offset spelled out by the caller (per-cusp, e.g. 300° for
  // cusp 11). Passing it as a parameter avoids a fragile string-keyed
  // lookup keyed on `saCoef.toFixed(3)`.
  console.warn(`[placidus] Cusp did not converge at lat ${lat}. Falling back to equal house.`);
  const ascDeg = ascendant(ramc, eps, lat);
  return normalizeDeg(ascDeg + fallbackOffsetDeg);
}

// ---------------------------------------------------------------------------
// Ascendant calculation
// ---------------------------------------------------------------------------

function ascendant(ramc: number, eps: number, lat: number): number {
  // Asc = atan2(-cos(RAMC), sin(RAMC)*cos(eps) + tan(lat)*sin(eps)) + 180°.
  //
  // The +180 disambiguates the two ecliptic intersections of the eastern
  // horizon: the formula's principal value lands on the Dsc point. The
  // main `calculateAscendant` in kundali-calc.ts (validated against Swiss
  // Ephemeris in kundali-validation.test.ts) uses the same +180 fix.
  // Without it, every KP chart's cusp 1 was Dsc and cusp 7 was Asc — the
  // chart was rotated 180° relative to the rest of the engine.
  const asc = atan2D(
    -cosD(ramc),
    sinD(ramc) * cosD(eps) + tanD(lat) * sinD(eps)
  );
  return normalizeDeg(asc + 180);
}

// ---------------------------------------------------------------------------
// Build HouseCusp object from tropical degree
// ---------------------------------------------------------------------------

function buildCusp(house: number, tropDeg: number, ayanamsha: number): HouseCusp {
  const sidDeg = normalizeDeg(tropDeg - ayanamsha);
  const signNum = getRashiNumber(sidDeg); // 1-12
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
  // Primary: Swiss Ephemeris in sidereal mode with the KP ayanamsha
  // (SEFLG_SIDEREAL + SE_SIDM_KRISHNAMURTI). Sweph computes the Placidus
  // cusps in the sidereal frame directly — no separate ayanamsha-subtract
  // step, matching what professional KP software does. Falls back to the
  // Meeus path below when sweph isn't loaded (server cold starts, dev
  // environments without native binding compiled, or polar input where
  // Placidus degenerates).
  const sweCusps = swissPlacidusCusps(jd, lat, lng, 'kp');
  if (sweCusps !== null) {
    // Cusps already sidereal — pass ayanamsha=0 to buildCusp so it doesn't
    // subtract a second time.
    return sweCusps.map((deg, i) => buildCusp(i + 1, deg, 0));
  }

  const eps = obliquity(jd);
  const ramc = localSiderealTime(jd, lng); // RAMC in degrees

  // MC (cusp 10) and IC (cusp 4)
  const mc = mcLongitude(ramc, eps);
  const ic = normalizeDeg(mc + 180);

  // Ascendant (cusp 1) and Descendant (cusp 7)
  const asc = ascendant(ramc, eps, lat);
  const dsc = normalizeDeg(asc + 180);

  // Intermediate cusps — each independently iterated to its HA target.
  // The earlier implementation derived cusps 5/6/8/9 as antipodes of the
  // computed 11/12/2/3 set; that antipodal-symmetric iteration collapsed
  // cusp 2≡5, 3≡6, 8≡11, 9≡12 (correct only at the equator), placing four
  // cusps in the wrong chart quadrant for every non-equator chart.
  //
  //
  // Last arg = polar-fallback offset (degrees past Asc CCW, equal-house
  // approximation) — used only when the iteration fails to converge near
  // the poles. Per-cusp values match the linear equal-house mapping:
  //   cusp 11 → Asc + 300°, 12 → 330°, 9 → 240°, 8 → 210°
  //   cusp 2  → Asc + 30°,  3 → 60°,   5 → 120°, 6 → 150°

  // Above horizon, east of meridian (between MC and Asc): cusps 11, 12.
  const cusp11 = placidusCusp(ramc, eps, lat,    0, -1 / 3, 300);
  const cusp12 = placidusCusp(ramc, eps, lat,    0, -2 / 3, 330);
  // Above horizon, west of meridian (between MC and Dsc): cusps 9, 8.
  const cusp9  = placidusCusp(ramc, eps, lat,    0, +1 / 3, 240);
  const cusp8  = placidusCusp(ramc, eps, lat,    0, +2 / 3, 210);
  // Below horizon, east of nadir (between Asc and IC): cusps 2, 3.
  const cusp2  = placidusCusp(ramc, eps, lat,  -60, -2 / 3,  30);
  const cusp3  = placidusCusp(ramc, eps, lat, -120, -1 / 3,  60);
  // Below horizon, west of nadir (between Dsc and IC): cusps 5, 6.
  const cusp5  = placidusCusp(ramc, eps, lat, +120, +1 / 3, 120);
  const cusp6  = placidusCusp(ramc, eps, lat,  +60, +2 / 3, 150);

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
