import { normalizeDeg } from '@/lib/ephem/astronomical';

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
  navamshaSign: number; // 1-12, sign in D9
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

function vargaDignityPoints(planetId: number, sign: number): number {
  if (EXALTATION_SIGN_SB[planetId] === sign) return 45;
  if (DEBILITATION_SIGN_SB[planetId] === sign) return 1.875;
  if (MOOLATRIKONA_SIGN_SB[planetId] === sign) return 45;
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
  const vargas = computeVargaSigns(p);
  return vargas.reduce((sum, sign) => sum + vargaDignityPoints(p.id, sign), 0);
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
  // Mercury always 60
  if (p.id === 3) return 60;
  // Day-strong: Sun(0), Jupiter(4), Venus(5)
  const dayStrong = [0, 4, 5];
  // Night-strong: Moon(1), Mars(2), Saturn(6)
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

function tribhagaBala(
  p: PlanetInput,
  birthHour: number,
  isDayBirth: boolean,
): number {
  // Jupiter always gets 60
  if (p.id === 4) return 60;

  // Determine which third of the day/night portion we are in
  // Day: 6-18 (12 hrs, each third = 4 hrs)
  // Night: 18-6 (12 hrs, each third = 4 hrs)
  let third: number;
  if (isDayBirth) {
    const dayElapsed = birthHour - 6;
    if (dayElapsed < 4) third = 1;
    else if (dayElapsed < 8) third = 2;
    else third = 3;
  } else {
    const nightHour = birthHour >= 18 ? birthHour - 18 : birthHour + 6;
    if (nightHour < 4) third = 1;
    else if (nightHour < 8) third = 2;
    else third = 3;
  }

  if (isDayBirth) {
    // Day: 1st=Mercury(3), 2nd=Sun(0), 3rd=Saturn(6)
    if (third === 1 && p.id === 3) return 60;
    if (third === 2 && p.id === 0) return 60;
    if (third === 3 && p.id === 6) return 60;
  } else {
    // Night: 1st=Moon(1), 2nd=Venus(5), 3rd=Mars(2)
    if (third === 1 && p.id === 1) return 60;
    if (third === 2 && p.id === 5) return 60;
    if (third === 3 && p.id === 2) return 60;
  }

  return 0;
}

function abdaBala(p: PlanetInput, julianDay: number): number {
  const yearLordIdx = Math.floor(julianDay / 365.25) % 7;
  return p.id === yearLordIdx ? 15 : 0;
}

function masaBala(p: PlanetInput, julianDay: number): number {
  const monthLordIdx = Math.floor(julianDay / 30.4375) % 7;
  return p.id === monthLordIdx ? 30 : 0;
}

function varaBala(p: PlanetInput, julianDay: number): number {
  const weekday = Math.floor(julianDay + 1.5) % 7; // 0=Sun … 6=Sat
  const lordId = WEEKDAY_LORD[weekday];
  return p.id === lordId ? 45 : 0;
}

function horaBala(p: PlanetInput, birthHour: number, julianDay: number): number {
  const weekday = Math.floor(julianDay + 1.5) % 7;
  const dayLord = WEEKDAY_LORD[weekday];

  // Find position of day lord in Chaldean order
  const dayLordPos = CHALDEAN.indexOf(dayLord);

  // Hour index from sunrise (~6 AM)
  let hourIndex = Math.floor(birthHour - 6);
  if (hourIndex < 0) hourIndex += 24;

  // Current hora lord = advance from day lord position by hourIndex steps
  const horaLordPos = (dayLordPos + hourIndex) % 7;
  const horaLord = CHALDEAN[horaLordPos];

  return p.id === horaLord ? 60 : 0;
}

function ayanaBala(p: PlanetInput): number {
  // Simplified declination from sidereal longitude
  const dec =
    Math.asin(Math.sin(OBLIQUITY * DEG2RAD) * Math.sin(p.longitude * DEG2RAD)) *
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
        // Planetary war — planet with higher longitude wins (simplified)
        const aLong = normalizeDeg(a.longitude);
        const bLong = normalizeDeg(b.longitude);
        if (aLong >= bLong) {
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
  const isDayBirth = birthHour >= 6 && birthHour < 18;

  const sunPlanet = planets.find((pl) => pl.id === 0);
  const moonPlanet = planets.find((pl) => pl.id === 1);
  const sunLong = sunPlanet ? sunPlanet.longitude : 0;
  const moonLong = moonPlanet ? moonPlanet.longitude : 0;

  const nn = natonnataBala(p, isDayBirth);
  const pk = pakshaBala(p, sunLong, moonLong);
  const tb = tribhagaBala(p, birthHour, isDayBirth);
  const ab = abdaBala(p, input.julianDay);
  const mb = masaBala(p, input.julianDay);
  const vb = varaBala(p, input.julianDay);
  const hb = horaBala(p, birthHour, input.julianDay);
  const ay = ayanaBala(p);
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

function computeCheshtaBala(p: PlanetInput, ay: number): number {
  // Sun & Moon: cheshtaBala = ayanaBala
  if (p.id === 0 || p.id === 1) return ay;

  if (p.isRetrograde) return 60;
  if (Math.abs(p.speed) < 0.001) return 30; // stationary

  const avg = AVG_SPEED[p.id];
  if (!avg) return 30;
  return Math.min(60, Math.abs(p.speed / avg) * 30);
}

// ---------------------------------------------------------------------------
// VI. Drik Bala
// ---------------------------------------------------------------------------

function computeDrikBala(p: PlanetInput, planets: PlanetInput[]): number {
  const beneficIds = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus
  let drikBala = 0;

  for (const other of planets) {
    if (other.id === p.id) continue;

    // Determine which houses this planet aspects
    const aspectedHouses: number[] = [];

    // All planets aspect 7th from their own house
    aspectedHouses.push(((other.house - 1 + 6) % 12) + 1);

    // Special aspects
    if (other.id === 4) {
      // Jupiter → 5th, 9th
      aspectedHouses.push(((other.house - 1 + 4) % 12) + 1);
      aspectedHouses.push(((other.house - 1 + 8) % 12) + 1);
    } else if (other.id === 2) {
      // Mars → 4th, 8th
      aspectedHouses.push(((other.house - 1 + 3) % 12) + 1);
      aspectedHouses.push(((other.house - 1 + 7) % 12) + 1);
    } else if (other.id === 6) {
      // Saturn → 3rd, 10th
      aspectedHouses.push(((other.house - 1 + 2) % 12) + 1);
      aspectedHouses.push(((other.house - 1 + 9) % 12) + 1);
    }

    if (aspectedHouses.includes(p.house)) {
      drikBala += beneficIds.has(other.id) ? 7.5 : -7.5;
    }
  }

  return Math.max(-60, Math.min(60, drikBala));
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

export function calculateFullShadbala(input: ShadBalaInput): ShadBalaComplete[] {
  // Filter to only planets 0-6 (exclude Rahu/Ketu)
  const planets = input.planets.filter((p) => p.id >= 0 && p.id <= 6);

  // Pre-compute yuddha bala for all planets
  const yuddhaBalaMap = yuddhaBala(planets);

  // Compute raw results (without rank)
  const rawResults: ShadBalaComplete[] = planets.map((p) => {
    const sthana = computeSthanaBala(p);
    const digBala = r2(computeDigBala(p, input.ascendantDeg));
    const kala = computeKalaBala(p, input, planets, yuddhaBalaMap);
    const ay = ayanaBala(p);
    const cheshtaBala = r2(computeCheshtaBala(p, ay));
    const naisargikaBala = NAISARGIKA[p.id];
    const drikBala = r2(computeDrikBala(p, planets));

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
