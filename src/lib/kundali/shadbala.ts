import { normalizeDeg, lahiriAyanamsha } from '@/lib/ephem/astronomical';
import { getSunTimes } from '@/lib/astronomy/sunrise';

// ---------------------------------------------------------------------------
// Input types (local — not imported)
// ---------------------------------------------------------------------------

interface PlanetInput {
  id: number;        // 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
  longitude: number; // sidereal longitude 0-360
  speed: number;     // degrees/day
  house: number;     // 1-12
  sign: number;      // 1-12
  isRetrograde: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
  isOwnSign: boolean;
  navamshaSign: number;     // 1-12, sign in D9
  eclipticLatitude?: number; // degrees — used for Graha Yuddha winner determination
}

interface ShadBalaInput {
  planets: PlanetInput[];
  ascendantDeg: number;
  julianDay: number;
  birthDateObj: Date;  // for weekday, hour calculations
  latitude: number;    // birth latitude for sunrise calc
  longitude: number;   // birth longitude
  timezone: number;    // timezone offset in hours
}

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

export interface ShadBalaComplete {
  planet: string;
  planetId: number;
  sthanaBala: number;
  digBala: number;
  kalaBala: number;
  cheshtaBala: number;
  naisargikaBala: number;
  drikBala: number;
  totalPinda: number;
  rupas: number;
  minRequired: number;
  strengthRatio: number;
  rank: number;
  ishtaPhala: number;
  kashtaPhala: number;
  sthanaBreakdown: {
    ucchaBala: number;
    saptavargaja: number;
    ojhayugmaRashi: number;
    ojhayugmaNavamsha: number;
    kendradiBala: number;
    drekkanaBala: number;
  };
  kalaBreakdown: {
    natonnataBala: number;
    pakshaBala: number;
    tribhagaBala: number;
    abdaBala: number;
    masaBala: number;
    varaBala: number;
    horaBala: number;
    ayanaBala: number;
    yuddhaBala: number;
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PLANET_NAMES = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

/** Sidereal longitude of exaltation point for each planet (id 0-6) */
const EXALTATION_DEG: Record<number, number> = {
  0: 10,   // Sun — Aries 10°
  1: 33,   // Moon — Taurus 3°
  2: 298,  // Mars — Capricorn 28°
  3: 165,  // Mercury — Virgo 15°
  4: 95,   // Jupiter — Cancer 5°
  5: 357,  // Venus — Pisces 27°
  6: 200,  // Saturn — Libra 20°
};

/** Naisargika Bala (natural strength) — fixed values */
const NAISARGIKA: Record<number, number> = {
  0: 60.00,
  1: 51.43,
  2: 17.14,
  3: 25.71,
  4: 34.29,
  5: 42.86,
  6: 8.57,
};

/** Minimum required Rupas for each planet */
const MIN_REQUIRED: Record<number, number> = {
  0: 5.0,
  1: 6.0,
  2: 5.0,
  3: 7.0,
  4: 6.5,
  5: 5.5,
  6: 5.0,
};

/** Average daily motion (°/day) for Mars–Saturn */
const AVG_SPEED: Record<number, number> = {
  2: 0.524,
  3: 1.383,
  4: 0.083,
  5: 1.2,
  6: 0.034,
};

/** Strongest house for Dig Bala */
const STRONG_HOUSE: Record<number, number> = {
  0: 10, 1: 4, 2: 10, 3: 1, 4: 1, 5: 4, 6: 7,
};

/** Chaldean order (slowest → fastest for hora cycling) */
const CHALDEAN = [6, 4, 2, 0, 5, 3, 1]; // Sat, Jup, Mar, Sun, Ven, Mer, Moon

/** Weekday → planet id mapping (0=Sunday→Sun … 6=Saturday→Saturn) */
const WEEKDAY_LORD = [0, 1, 2, 3, 4, 5, 6];

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const OBLIQUITY = 23.4393; // mean obliquity (degrees, approx)

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

function r2(v: number): number {
  return Math.round(v * 100) / 100;
}

function arcDiff(a: number, b: number): number {
  const d = Math.abs(normalizeDeg(a) - normalizeDeg(b));
  return Math.min(d, 360 - d);
}

function isOddSign(sign: number): boolean {
  return sign % 2 === 1;
}

// ---------------------------------------------------------------------------
// I. Sthana Bala
// ---------------------------------------------------------------------------

function ucchaBala(p: PlanetInput): number {
  const exDeg = EXALTATION_DEG[p.id];
  const diff = arcDiff(p.longitude, exDeg);
  return (180 - diff) / 3; // 0–60
}

// ── Saptavargaja Bala — proper multi-varga dignity ───────────────────────────
// Computes dignity across 6 vargas: D1, D2, D3, D9, D12, D27
// (D60 requires a 720-entry lookup table per source and is excluded)
// Each varga contributes dignity points per BPHS:
//   Uccha/Moolatrikona=45, Own=30, Friend=15, Neutral=7.5, Enemy=3.75, Neecha=1.875

const SIGN_LORDS_SB: number[] = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4]; // 0=Aries lord

const EXALTATION_SIGN_SB: Record<number, number> = {
  0: 1, 1: 2, 2: 10, 3: 6, 4: 4, 5: 12, 6: 7,
};

const DEBILITATION_SIGN_SB: Record<number, number> = {
  0: 7, 1: 8, 2: 4, 3: 12, 4: 10, 5: 6, 6: 1,
};

const MOOLATRIKONA_SIGN_SB: Record<number, number> = {
  0: 5, 1: 2, 2: 1, 3: 6, 4: 9, 5: 7, 6: 11,
};

/**
 * Classical Moolatrikona degree ranges per BPHS / Laghu Parashari.
 * Outside these ranges within the sign the planet is treated as own-sign only.
 *   Sun   : Leo  0°-20°
 *   Moon  : Taurus 4°-20° (BPHS Ch.4)
 *   Mars  : Aries 0°-12°
 *   Mercury: Virgo 16°-20° (BPHS Ch.4)
 *   Jupiter: Sagittarius 0°-10°
 *   Venus  : Libra 0°-5° (BPHS Ch.4)
 *   Saturn : Aquarius 0°-20°
 */
// Canonical BPHS Ch.4 Moolatrikona ranges — aligned with dignity.ts
const MOOLATRIKONA_RANGES: Record<number, { sign: number; minDeg: number; maxDeg: number }> = {
  0: { sign: 5,  minDeg: 0,  maxDeg: 20 }, // Sun: Leo 0°-20°
  1: { sign: 2,  minDeg: 4,  maxDeg: 20 }, // Moon: Taurus 4°-20° (NOT 0-3.33)
  2: { sign: 1,  minDeg: 0,  maxDeg: 12 }, // Mars: Aries 0°-12°
  3: { sign: 6,  minDeg: 16, maxDeg: 20 }, // Mercury: Virgo 16°-20° (NOT 15-20)
  4: { sign: 9,  minDeg: 0,  maxDeg: 10 }, // Jupiter: Sagittarius 0°-10°
  5: { sign: 7,  minDeg: 0,  maxDeg: 5  }, // Venus: Libra 0°-5° (NOT 0-10)
  6: { sign: 11, minDeg: 0,  maxDeg: 20 }, // Saturn: Aquarius 0°-20°
};

const OWN_SIGNS_SB: Record<number, number[]> = {
  0: [5], 1: [4], 2: [1, 8], 3: [3, 6], 4: [9, 12], 5: [2, 7], 6: [10, 11],
};

// Natural friendships (BPHS standard)
const NAT_FRIENDS_SB: Record<number, number[]> = {
  0: [1, 2, 4], 1: [0, 3], 2: [0, 1, 4], 3: [0, 5], 4: [0, 1, 2], 5: [3, 6], 6: [3, 5],
};

const NAT_ENEMIES_SB: Record<number, number[]> = {
  0: [5, 6], 1: [], 2: [3], 3: [1], 4: [3, 5], 5: [0, 1], 6: [0, 1, 2],
};

/**
 * Returns dignity points for a planet in a given sign.
 * @param planetId  0-6
 * @param sign      1-12
 * @param degInSign degree within sign (0-30), supplied only for D1 to enable
 *                  precise Moolatrikona range checks. Other vargas pass undefined
 *                  and fall back to sign-level Moolatrikona treatment per BPHS.
 */
function vargaDignityPoints(planetId: number, sign: number, degInSign?: number): number {
  if (EXALTATION_SIGN_SB[planetId] === sign) return 45;
  if (DEBILITATION_SIGN_SB[planetId] === sign) return 1.875;

  // Moolatrikona: for D1 use exact degree bounds; for other vargas use sign-level
  const mt = MOOLATRIKONA_RANGES[planetId];
  if (mt?.sign === sign) {
    if (degInSign !== undefined) {
      // D1: check actual degree — outside range falls through to own-sign check
      if (degInSign >= mt.minDeg && degInSign < mt.maxDeg) return 45;
    } else {
      // Non-D1 vargas: grant Moolatrikona at sign level (no degree info available)
      return 45;
    }
  }

  if (OWN_SIGNS_SB[planetId]?.includes(sign)) return 30;
  const lord = SIGN_LORDS_SB[sign - 1];
  if (NAT_FRIENDS_SB[planetId]?.includes(lord)) return 15;
  if (NAT_ENEMIES_SB[planetId]?.includes(lord)) return 3.75;
  return 7.5; // neutral
}

function computeVargaSigns(p: PlanetInput): number[] {
  const sign = p.sign;
  const degInSign = p.longitude % 30;

  // D1 — Rashi (natal sign)
  const d1 = sign;

  // D2 — Hora: odd signs 0-15→Leo(5), 15-30→Cancer(4); even signs reversed
  const isOddSign_ = sign % 2 === 1;
  const d2 = degInSign < 15 ? (isOddSign_ ? 5 : 4) : (isOddSign_ ? 4 : 5);

  // D3 — Drekkana: 0-10°=own, 10-20°=5th, 20-30°=9th
  const d3Offset = degInSign < 10 ? 0 : degInSign < 20 ? 4 : 8;
  const d3 = ((sign - 1 + d3Offset) % 12) + 1;

  // D9 — Navamsha (pre-computed in PlanetInput)
  const d9 = p.navamshaSign;

  // D12 — Dwadashamsha: 12 equal parts, starting from own sign
  const d12 = ((sign - 1 + Math.floor(degInSign * 12 / 30)) % 12) + 1;

  // D27 — Saptavimshamsha: 27 parts; start from Aries(fire), Cancer(earth), Libra(air), Capricorn(water)
  const d27PartIdx = Math.floor(degInSign * 27 / 30);
  const d27Start = [1, 5, 9].includes(sign) ? 1
    : [2, 6, 10].includes(sign) ? 4
    : [3, 7, 11].includes(sign) ? 7
    : 10;
  const d27 = ((d27Start - 1 + d27PartIdx) % 12) + 1;

  return [d1, d2, d3, d9, d12, d27];
}

function saptavargajaBala(p: PlanetInput): number {
  const vargas = computeVargaSigns(p); // [d1, d2, d3, d9, d12, d27]
  const degInSign = p.longitude % 30;  // D1 degree within sign
  return vargas.reduce((sum, sign, idx) =>
    // Pass degInSign only for D1 (idx=0) to enable precise Moolatrikona range check
    sum + vargaDignityPoints(p.id, sign, idx === 0 ? degInSign : undefined),
  0);
}

function ojhayugmaRashiBala(p: PlanetInput): number {
  const odd = isOddSign(p.sign);
  // Moon & Venus gain in even signs; others gain in odd signs
  if (p.id === 1 || p.id === 5) return odd ? 0 : 15;
  return odd ? 15 : 0;
}

function ojhayugmaNavamshaBala(p: PlanetInput): number {
  const odd = isOddSign(p.navamshaSign);
  if (p.id === 1 || p.id === 5) return odd ? 0 : 15;
  return odd ? 15 : 0;
}

function kendradiBala(p: PlanetInput): number {
  const h = p.house;
  if (h === 1 || h === 4 || h === 7 || h === 10) return 60;
  if (h === 2 || h === 5 || h === 8 || h === 11) return 30;
  return 15;
}

function drekkanaBala(p: PlanetInput): number {
  const degInSign = p.longitude % 30;
  let decanate: number;
  if (degInSign < 10) decanate = 1;
  else if (degInSign < 20) decanate = 2;
  else decanate = 3;

  // Male planets (Sun=0, Mars=2, Jupiter=4) → 1st decanate
  if ((p.id === 0 || p.id === 2 || p.id === 4) && decanate === 1) return 15;
  // Neutral planets (Mercury=3, Saturn=6) → 2nd decanate
  if ((p.id === 3 || p.id === 6) && decanate === 2) return 15;
  // Female planets (Moon=1, Venus=5) → 3rd decanate
  if ((p.id === 1 || p.id === 5) && decanate === 3) return 15;

  return 0;
}

function computeSthanaBala(p: PlanetInput) {
  const ub = ucchaBala(p);
  const sv = saptavargajaBala(p);
  const ojr = ojhayugmaRashiBala(p);
  const ojn = ojhayugmaNavamshaBala(p);
  const kb = kendradiBala(p);
  const db = drekkanaBala(p);

  return {
    total: r2(ub + sv + ojr + ojn + kb + db),
    breakdown: {
      ucchaBala: r2(ub),
      saptavargaja: r2(sv),
      ojhayugmaRashi: r2(ojr),
      ojhayugmaNavamsha: r2(ojn),
      kendradiBala: r2(kb),
      drekkanaBala: r2(db),
    },
  };
}

// ---------------------------------------------------------------------------
// II. Dig Bala
// ---------------------------------------------------------------------------

function computeDigBala(p: PlanetInput, ascendantDeg: number): number {
  const strongHouse = STRONG_HOUSE[p.id];
  const digPointDeg = normalizeDeg(ascendantDeg + (strongHouse - 1) * 30);
  const arc = arcDiff(p.longitude, digPointDeg);
  return Math.max(0, (180 - arc) / 3); // 0–60
}

// ---------------------------------------------------------------------------
// III. Kala Bala
// ---------------------------------------------------------------------------

function natonnataBala(p: PlanetInput, isDayBirth: boolean): number {
  // Mercury is always fully strong (60 Shashtiamsas) regardless of birth time.
  // Classical source: BPHS Ch.27 — "Budha is Mishra (both day and night strong)."
  if (p.id === 3) return 60;

  // Diurnal (day-strong) planets: Sun(0), Jupiter(4), Saturn(6).
  // They receive full 60 Shashtiamsas at day births, 0 at night.
  //
  // Nocturnal (night-strong) planets: Moon(1), Mars(2), Venus(5).
  // They receive full 60 Shashtiamsas at night births, 0 at day.
  //
  // HISTORICAL BUG (now fixed): the list was [0,4,5] — Venus(5) was in the
  // day-strong group and Saturn(6) was missing entirely.  Venus is nocturnal
  // (BPHS Ch.27: "Shukra is Ratri-bali"), and Saturn is diurnal ("Shani is
  // Diva-bali").  This inflated Venus's kalaBala for day births and deflated
  // Saturn's, distorting the total Shadbala ranking.
  const dayStrong = [0, 4, 6]; // Sun, Jupiter, Saturn
  if (isDayBirth) return dayStrong.includes(p.id) ? 60 : 0;
  return dayStrong.includes(p.id) ? 0 : 60;
}

function pakshaBala(p: PlanetInput, sunLong: number, moonLong: number): number {
  const elongation = normalizeDeg(moonLong - sunLong);
  const isShukla = elongation <= 180;
  const benefics = [1, 3, 4, 5]; // Moon, Mercury, Jupiter, Venus

  if (isShukla) {
    return benefics.includes(p.id) ? elongation / 3 : (180 - elongation) / 3;
  }
  const krishnaElongation = 360 - elongation;
  return benefics.includes(p.id)
    ? krishnaElongation / 3
    : (180 - krishnaElongation) / 3;
}

/**
 * Tribhaga Bala — the "three-thirds" strength.
 * Divides the actual day (sunrise→sunset) and night (sunset→sunrise) each into 3
 * equal portions based on computed sunrise/sunset (not hardcoded 6 AM).
 * BPHS rule:
 *   Day:   1st third = Mercury (3), 2nd = Sun (0), 3rd = Saturn (6)
 *   Night: 1st third = Moon (1), 2nd = Venus (5), 3rd = Mars (2)
 *   Jupiter (4) always earns 60 regardless.
 */
function tribhagaBala(
  p: PlanetInput,
  birthHour: number,
  isDayBirth: boolean,
  sunriseHour: number,
  sunsetHour: number,
): number {
  if (p.id === 4) return 60; // Jupiter always 60

  let third = 1; // default to 1st third (safe fallback)

  if (isDayBirth) {
    const dayDuration = sunsetHour - sunriseHour;
    const thirdDur = dayDuration / 3;
    const elapsed = birthHour - sunriseHour;
    if (elapsed < thirdDur)       third = 1;
    else if (elapsed < 2 * thirdDur) third = 2;
    else                          third = 3;

    if (third === 1 && p.id === 3) return 60; // Mercury in 1st day third
    if (third === 2 && p.id === 0) return 60; // Sun in 2nd day third
    if (third === 3 && p.id === 6) return 60; // Saturn in 3rd day third
  } else {
    // Night: sunset → (sunset + night_duration); normalize birth hour past midnight
    const nightDuration = 24 - (sunsetHour - sunriseHour);
    const thirdDur = nightDuration / 3;
    const nightElapsed = birthHour >= sunsetHour
      ? birthHour - sunsetHour
      : birthHour + (24 - sunsetHour); // handle past-midnight hours
    if (nightElapsed < thirdDur)       third = 1;
    else if (nightElapsed < 2 * thirdDur) third = 2;
    else                               third = 3;

    if (third === 1 && p.id === 1) return 60; // Moon in 1st night third
    if (third === 2 && p.id === 5) return 60; // Venus in 2nd night third
    if (third === 3 && p.id === 2) return 60; // Mars in 3rd night third
  }

  return 0;
}

function abdaBala(p: PlanetInput, birthDateObj: Date): number {
  // Year lord = lord of the weekday of Jan 1 of the birth year (Gregorian approx of Mesha Sankranti)
  const jan1 = new Date(Date.UTC(birthDateObj.getUTCFullYear(), 0, 1));
  const yearLordIdx = WEEKDAY_LORD[jan1.getUTCDay()];
  return p.id === yearLordIdx ? 15 : 0;
}

function masaBala(p: PlanetInput, birthDateObj: Date): number {
  // Month lord = lord of weekday of 1st day of birth Gregorian month (approx of Vedic lunar month start)
  const monthStart = new Date(Date.UTC(birthDateObj.getUTCFullYear(), birthDateObj.getUTCMonth(), 1));
  const monthLordIdx = WEEKDAY_LORD[monthStart.getUTCDay()];
  return p.id === monthLordIdx ? 30 : 0;
}

function varaBala(p: PlanetInput, julianDay: number): number {
  const weekday = Math.floor(julianDay + 1.5) % 7; // 0=Sun … 6=Sat
  const lordId = WEEKDAY_LORD[weekday];
  return p.id === lordId ? 45 : 0;
}

function horaBala(p: PlanetInput, birthHour: number, julianDay: number, sunriseHour: number): number {
  const weekday = Math.floor(julianDay + 1.5) % 7;
  const dayLord = WEEKDAY_LORD[weekday];

  // Find position of day lord in Chaldean order
  const dayLordPos = CHALDEAN.indexOf(dayLord);

  // Hour index from actual sunrise
  let hourIndex = Math.floor(birthHour - sunriseHour);
  if (hourIndex < 0) hourIndex += 24;

  // Current hora lord = advance from day lord position by hourIndex steps
  const horaLordPos = (dayLordPos + hourIndex) % 7;
  const horaLord = CHALDEAN[horaLordPos];

  return p.id === horaLord ? 60 : 0;
}

function ayanaBala(p: PlanetInput, ayanamsha: number): number {
  // Declination must use tropical longitude (sidereal + ayanamsha)
  const tropicalLong = normalizeDeg(p.longitude + ayanamsha);
  const dec =
    Math.asin(Math.sin(OBLIQUITY * DEG2RAD) * Math.sin(tropicalLong * DEG2RAD)) *
    RAD2DEG;

  let value: number;
  if (p.id === 0 || p.id === 2 || p.id === 4) {
    // Sun, Mars, Jupiter — strong in northern declination
    value = ((24 + dec) * 60) / 48;
  } else if (p.id === 1 || p.id === 5 || p.id === 6) {
    // Moon, Venus, Saturn — strong in southern declination
    value = ((24 - dec) * 60) / 48;
  } else {
    // Mercury — always benefits from declination magnitude
    value = ((24 + Math.abs(dec)) * 60) / 48;
  }

  return Math.max(0, Math.min(60, value));
}

function yuddhaBala(planets: PlanetInput[]): Record<number, number> {
  const result: Record<number, number> = {};
  for (const p of planets) result[p.id] = 0;

  // Only consider Mars(2), Mercury(3), Jupiter(4), Venus(5), Saturn(6)
  const eligible = planets.filter((p) => p.id >= 2 && p.id <= 6);

  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      const a = eligible[i];
      const b = eligible[j];
      const diff = arcDiff(a.longitude, b.longitude);
      if (diff <= 1) {
        // Planetary war (Graha Yuddha) — winner determined by lower absolute
        // ecliptic latitude.  Source: BPHS Ch.28 ("that planet whose latitude
        // is less wins the war").  This is also the rule used in graha-yuddha.ts.
        //
        // HISTORICAL BUG (now fixed): the code used ecliptic LONGITUDE to pick
        // the winner (higher longitude wins).  Longitude has nothing to do with
        // the classical rule and gave wrong results for every planetary war.
        //
        // Fallback: if eclipticLatitude was not supplied (older call sites), fall
        // back to the longitude comparison to avoid a breaking change — but this
        // path should not occur in normal usage since kundali-calc now passes it.
        const aLat = a.eclipticLatitude;
        const bLat = b.eclipticLatitude;
        let aWins: boolean;
        if (aLat !== undefined && bLat !== undefined) {
          // Lower absolute latitude = more northerly (less deviated) = wins
          aWins = Math.abs(aLat) <= Math.abs(bLat);
        } else {
          // Legacy fallback: higher longitude (graceful degradation only)
          aWins = normalizeDeg(a.longitude) >= normalizeDeg(b.longitude);
        }
        if (aWins) {
          result[a.id] += 5;
          result[b.id] -= 5;
        } else {
          result[b.id] += 5;
          result[a.id] -= 5;
        }
      }
    }
  }

  return result;
}

function computeKalaBala(
  p: PlanetInput,
  input: ShadBalaInput,
  planets: PlanetInput[],
  yuddhaBalaMap: Record<number, number>,
): { total: number; breakdown: ShadBalaComplete['kalaBreakdown'] } {
  const birthHour =
    input.birthDateObj.getUTCHours() +
    input.birthDateObj.getUTCMinutes() / 60 +
    input.timezone;

  // Compute actual sunrise for this birth location/date
  const sunTimes = getSunTimes(
    input.birthDateObj.getUTCFullYear(),
    input.birthDateObj.getUTCMonth() + 1,
    input.birthDateObj.getUTCDate(),
    input.latitude,
    input.longitude,
    input.timezone,
  );
  // Convert sunrise/sunset Date to local decimal hours
  const sunriseHour = sunTimes.sunrise.getHours() + sunTimes.sunrise.getMinutes() / 60;
  const sunsetHour = sunTimes.sunset.getHours() + sunTimes.sunset.getMinutes() / 60;
  const isDayBirth = birthHour >= sunriseHour && birthHour < sunsetHour;

  const sunPlanet = planets.find((pl) => pl.id === 0);
  const moonPlanet = planets.find((pl) => pl.id === 1);
  const sunLong = sunPlanet ? sunPlanet.longitude : 0;
  const moonLong = moonPlanet ? moonPlanet.longitude : 0;

  const nn = natonnataBala(p, isDayBirth);
  const pk = pakshaBala(p, sunLong, moonLong);
  const tb = tribhagaBala(p, birthHour, isDayBirth, sunriseHour, sunsetHour);
  const ab = abdaBala(p, input.birthDateObj);
  const mb = masaBala(p, input.birthDateObj);
  const vb = varaBala(p, input.julianDay);
  const hb = horaBala(p, birthHour, input.julianDay, sunriseHour);
  const ayanamsha = lahiriAyanamsha(input.julianDay);
  const ay = ayanaBala(p, ayanamsha);
  const yb = yuddhaBalaMap[p.id] ?? 0;

  const total = nn + pk + tb + ab + mb + vb + hb + ay + yb;

  return {
    total: r2(total),
    breakdown: {
      natonnataBala: r2(nn),
      pakshaBala: r2(pk),
      tribhagaBala: r2(tb),
      abdaBala: r2(ab),
      masaBala: r2(mb),
      varaBala: r2(vb),
      horaBala: r2(hb),
      ayanaBala: r2(ay),
      yuddhaBala: r2(yb),
    },
  };
}

// ---------------------------------------------------------------------------
// IV. Chesta Bala
// ---------------------------------------------------------------------------

/**
 * Cheshta Bala — strength from planetary motion (BPHS Ch.27).
 *
 * Two modes:
 * - 'bphs_strict' (default): Retrograde = 60 virupas (maximum).
 *   This follows BPHS Ch.27 literally: a retrograde planet gets full Cheshta Bala.
 * - 'graduated': Speed-based scoring even for retrograde planets.
 *   Formula: 60 * (1 - |speed| / mean_speed) when retrograde.
 *   A planet that just turned retrograde (slow) scores near 60;
 *   one at peak retrograde speed scores lower (~45-50).
 *   This follows the graduated approach used by some modern professional panchangs.
 *
 * Stationary (speed ≈ 0): 30 virupas in both modes (BPHS: stationary = half strength).
 * Direct: speed/avg_speed * 30, capped at 60 (faster = stronger in direct motion).
 */
function computeCheshtaBala(p: PlanetInput, ay: number, mode: 'bphs_strict' | 'graduated' = 'bphs_strict'): number {
  // Sun & Moon: cheshtaBala = ayanaBala (no planetary motion component)
  if (p.id === 0 || p.id === 1) return ay;

  // Stationary: near-zero speed (turning retrograde or direct)
  if (Math.abs(p.speed) < 0.001) return 30;

  const avg = AVG_SPEED[p.id];
  if (!avg) return 30;

  if (p.isRetrograde) {
    if (mode === 'graduated') {
      // Graduated: slower retrograde = stronger (closer to Earth).
      // Peak retrograde speed ≈ mean speed, so ratio 0→1 maps to 60→30.
      const ratio = Math.min(1, Math.abs(p.speed) / avg);
      return 60 - ratio * 30; // 60 at station, ~30-45 at peak retrograde speed
    }
    return 60; // BPHS strict: retrograde always gets maximum
  }

  // Direct motion: faster = stronger
  return Math.min(60, Math.abs(p.speed / avg) * 30);
}

// ---------------------------------------------------------------------------
// VI. Drik Bala
// ---------------------------------------------------------------------------

/**
 * Fractional aspect strength per BPHS Ch.26.
 * All planets have full (1.0) 7th-house aspect. The 3rd/10th, 4th/8th, and
 * 5th/9th aspects are partial for most planets, with exceptions:
 *   - Mars gets full strength from 4th and 8th
 *   - Jupiter gets full strength from 5th and 9th
 *   - Saturn gets full strength from 3rd and 10th
 *
 * @param aspectingPlanetId  The planet casting the aspect (0-8)
 * @param houseDistance       Houses from aspecting planet to target (1-12)
 * @returns Fractional strength 0.0-1.0
 */
function getAspectStrength(aspectingPlanetId: number, houseDistance: number): number {
  // 7th house: always full for all planets
  if (houseDistance === 7) return 1.0;
  // Special full aspects per planet
  if (aspectingPlanetId === 2 && (houseDistance === 4 || houseDistance === 8)) return 1.0; // Mars
  if (aspectingPlanetId === 4 && (houseDistance === 5 || houseDistance === 9)) return 1.0; // Jupiter
  if (aspectingPlanetId === 6 && (houseDistance === 3 || houseDistance === 10)) return 1.0; // Saturn
  // Partial aspects
  if (houseDistance === 3 || houseDistance === 10) return 0.25;
  if (houseDistance === 4 || houseDistance === 8) return 0.75;
  if (houseDistance === 5 || houseDistance === 9) return 0.5;
  return 0; // no aspect from other distances
}

/**
 * Computes Drik Bala (aspect strength) for planet p.
 * Uses fractional aspect strengths per BPHS Ch.26 instead of treating all
 * aspects as full strength.
 *
 * @param p          The planet being assessed
 * @param allPlanets All 9 planets (0-8) including Rahu/Ketu — they contribute
 *                   aspects as malefics per BPHS: Rahu/Ketu aspect 5th, 7th, 9th
 *                   from their position (same as Jupiter but as malefics).
 */
function computeDrikBala(p: PlanetInput, allPlanets: PlanetInput[]): number {
  const beneficIds = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus (natural)
  // Rahu (7) and Ketu (8) are shadow-planet malefics — not in beneficIds
  const BASE_SCORE = 7.5;
  let drikBala = 0;

  for (const other of allPlanets) {
    if (other.id === p.id) continue;

    // House distance from other planet to target planet p (1-based, 1-12)
    const houseDistance = ((p.house - other.house + 12) % 12) || 12;

    // Get the fractional aspect strength for this planet at this distance
    // Rahu/Ketu use Jupiter-style aspects (5th, 7th, 9th) but as malefics
    const effectiveId = (other.id === 7 || other.id === 8) ? 4 : other.id;
    const strength = getAspectStrength(effectiveId, houseDistance);

    if (strength > 0) {
      const contribution = BASE_SCORE * strength;
      drikBala += beneficIds.has(other.id) ? contribution : -contribution;
    }
  }

  return Math.max(-60, Math.min(60, drikBala));
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

export interface ShadBalaOptions {
  /** Cheshta Bala calculation mode for retrograde planets.
   * 'bphs_strict' (default): retrograde = 60 virupas (BPHS Ch.27 literal).
   * 'graduated': speed-based scoring even for retrograde (modern graduated approach). */
  cheshtaBalaMode?: 'bphs_strict' | 'graduated';
}

export function calculateFullShadbala(input: ShadBalaInput, options?: ShadBalaOptions): ShadBalaComplete[] {
  // Filter to only planets 0-6 (exclude Rahu/Ketu)
  const planets = input.planets.filter((p) => p.id >= 0 && p.id <= 6);

  // Pre-compute yuddha bala for all planets
  const yuddhaBalaMap = yuddhaBala(planets);

  // Compute raw results (without rank)
  const rawResults: ShadBalaComplete[] = planets.map((p) => {
    const sthana = computeSthanaBala(p);
    const digBala = r2(computeDigBala(p, input.ascendantDeg));
    const kala = computeKalaBala(p, input, planets, yuddhaBalaMap);
    const ayanamsha = lahiriAyanamsha(input.julianDay);
    const ay = ayanaBala(p, ayanamsha);
    const cheshtaBala = r2(computeCheshtaBala(p, ay, options?.cheshtaBalaMode || 'bphs_strict'));
    const naisargikaBala = NAISARGIKA[p.id];
    // Pass all 9 planets so Rahu/Ketu contribute their aspects as malefics
    const drikBala = r2(computeDrikBala(p, input.planets));

    const totalPinda = r2(
      sthana.total + digBala + kala.total + cheshtaBala + naisargikaBala + drikBala,
    );
    const rupas = r2(totalPinda / 60);
    const minReq = MIN_REQUIRED[p.id];

    const ub = sthana.breakdown.ucchaBala;
    const ishtaPhala = r2(Math.sqrt(Math.max(0, ub) * Math.max(0, cheshtaBala)));
    const kashtaPhala = r2(
      Math.sqrt(Math.max(0, 60 - ub) * Math.max(0, 60 - cheshtaBala)),
    );

    return {
      planet: PLANET_NAMES[p.id],
      planetId: p.id,
      sthanaBala: sthana.total,
      digBala,
      kalaBala: kala.total,
      cheshtaBala,
      naisargikaBala,
      drikBala,
      totalPinda,
      rupas,
      minRequired: minReq,
      strengthRatio: r2(rupas / minReq),
      rank: 0, // filled below
      ishtaPhala,
      kashtaPhala,
      sthanaBreakdown: sthana.breakdown,
      kalaBreakdown: kala.breakdown,
    };
  });

  // Assign ranks by descending totalPinda
  const sorted = [...rawResults].sort((a, b) => b.totalPinda - a.totalPinda);
  sorted.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  return rawResults;
}
