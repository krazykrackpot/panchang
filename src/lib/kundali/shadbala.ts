import { normalizeDeg, getAyanamsha, sunLongitude, toSidereal, dateToJD } from '@/lib/ephem/astronomical';
import { getSunTimes } from '@/lib/astronomy/sunrise';
import {
  MOOLATRIKONA,
  EXALTATION_SIGNS,
  DEBILITATION_SIGNS,
  OWN_SIGNS,
  SIGN_LORDS_ARRAY,
} from '@/lib/constants/dignities';
import { PLANET_FRIENDSHIPS } from '@/lib/constants/friendships';

// ---------------------------------------------------------------------------
// Input types (local  –  not imported)
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
  eclipticLatitude?: number; // degrees  –  used for Graha Yuddha winner determination
}

interface ShadBalaInput {
  planets: PlanetInput[];
  ascendantDeg: number;
  julianDay: number;
  birthDateObj: Date;  // for weekday, hour calculations
  latitude: number;    // birth latitude for sunrise calc
  longitude: number;   // birth longitude
  timezone: number;    // timezone offset in hours
  ayanamshaValue?: number; // pre-computed ayanamsha; falls back to Lahiri if omitted
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
    /** Sum of 6-fold Shadvarga dignity (D1+D2+D3+D9+D12+D30). Renamed from
     *  `saptavargaja` in the 2026-05-31 audit response (item C) — the
     *  function returns 6 vargas, not 7. */
    shadvargaja: number;
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
  0: 10,   // Sun  –  Aries 10°
  1: 33,   // Moon  –  Taurus 3°
  2: 298,  // Mars  –  Capricorn 28°
  3: 165,  // Mercury  –  Virgo 15°
  4: 95,   // Jupiter  –  Cancer 5°
  5: 357,  // Venus  –  Pisces 27°
  6: 200,  // Saturn  –  Libra 20°
};

/** Naisargika Bala (natural strength)  –  fixed values */
const NAISARGIKA: Record<number, number> = {
  0: 60.00,
  1: 51.43,
  2: 17.14,
  3: 25.71,
  4: 34.29,
  5: 42.86,
  6: 8.57,
};

/** Minimum required Rupas for each planet (BPHS Ch.27 Sl.31) */
const MIN_REQUIRED: Record<number, number> = {
  0: 6.5,  // Sun: 390 virupas = 6.5 rupas (BPHS Ch.27 Sl.31)
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

// ── Shadvargaja Bala  –  proper 6-fold varga dignity ──────────────────────────
// Computes dignity across the 6 vargas of the Shadvarga set (BPHS Ch.27):
//   D1 (Rashi), D2 (Hora), D3 (Drekkana), D9 (Navamsha), D12 (Dwadashamsha),
//   D30 (Trimshamsha).
//
// Previously this used D27 (Saptavimshamsha) in place of D30. That was a
// classical-fidelity error: D27 belongs to higher-order strength sets, not
// the Shadvarga used for Shadbala. D30 carries the "inner-strength /
// affliction" signal that BPHS prescribes for this computation. Fixed in
// the 2026-05-31 Gemini implementation-audit response (item C). Spec:
// docs/superpowers/specs/2026-05-31-gemini-implementation-audit-response.md.
//
// The function was also previously named `saptavargajaBala` ("seven-fold")
// which is misleading — it returns 6 vargas, not 7. Renamed to
// `shadvargajaBala` ("six-fold"). A deprecated re-export kept for one
// release to avoid breaking downstream imports.
//
// (D60 requires a 720-entry lookup table per source and is excluded.)
// Each varga contributes dignity points per BPHS:
//   Uccha/Moolatrikona=45, Own=30, Friend=15, Neutral=7.5, Enemy=3.75, Neecha=1.875

// Dignity constants imported from @/lib/constants/dignities (Lesson Q  –  single source of truth)
// Aliases for backward compatibility with _SB suffixed references below
const SIGN_LORDS_SB = SIGN_LORDS_ARRAY;
const EXALTATION_SIGN_SB = EXALTATION_SIGNS;
const DEBILITATION_SIGN_SB = DEBILITATION_SIGNS;
const OWN_SIGNS_SB = OWN_SIGNS;

// Natural friendships + enemies sourced from canonical PLANET_FRIENDSHIPS
// — previously two inline copies that had to be kept in sync with
// shadbala/matching/dignity by hand (Lesson Z violation). Shadbala only
// scores planets 0-6 (Rahu/Ketu have no shadbala in classical BPHS).
const NAT_FRIENDS_SB: Record<number, number[]> = Object.fromEntries(
  [0, 1, 2, 3, 4, 5, 6].map((id) => [id, PLANET_FRIENDSHIPS[id].friends]),
);
const NAT_ENEMIES_SB: Record<number, number[]> = Object.fromEntries(
  [0, 1, 2, 3, 4, 5, 6].map((id) => [id, PLANET_FRIENDSHIPS[id].enemies]),
);

/**
 * Compound friendship (Pancha-dha Sambandha) per BPHS Ch.3 v.55-58 and Ch.27.
 *
 * Combines NATURAL friendship (fixed per planet) with TEMPORAL friendship
 * (chart-dependent — based on relative house positions). The compound
 * relationship determines the dignity grade used in shadvargaja:
 *
 *   Natural × Temporal → Compound → Dignity points
 *   ───────────────────────────────────────────────
 *   Friend  + Friend = Great Friend  (Adhimitra)  → 22.5
 *   Friend  + Enemy  = Neutral       (Sama)       →  7.5
 *   Neutral + Friend = Friend        (Mitra)      → 15.0
 *   Neutral + Enemy  = Enemy         (Shatru)     →  3.75
 *   Enemy   + Friend = Neutral       (Sama)       →  7.5
 *   Enemy   + Enemy  = Great Enemy   (Adhishatru) →  1.875
 *
 * Temporal friendship is computed from the planets' DUNS (D1) positions:
 *   - If lord L is in houses 2, 3, 4, 10, 11, 12 from target T → temporal friend
 *   - Else (houses 1, 5, 6, 7, 8, 9) → temporal enemy
 *
 * Standard BPHS reading; matches JHora, AstroSage, Parashara's Light.
 *
 * Implemented 2026-05-31 per "Option B" canonical convergence (variable hora
 * + compound friendship together). Previous code used pure natural friendship
 * (5-grade scale) which is simpler but non-canonical for shadvargaja.
 */
function getTemporalRelation(targetSign: number, lordSign: number): 'friend' | 'enemy' {
  const houseDistance = ((lordSign - targetSign + 12) % 12) + 1;
  const temporalFriendHouses = [2, 3, 4, 10, 11, 12];
  return temporalFriendHouses.includes(houseDistance) ? 'friend' : 'enemy';
}

function getNaturalRelation(targetId: number, lordId: number): 'friend' | 'enemy' | 'neutral' {
  if (NAT_FRIENDS_SB[targetId]?.includes(lordId)) return 'friend';
  if (NAT_ENEMIES_SB[targetId]?.includes(lordId)) return 'enemy';
  return 'neutral';
}

function compoundDignity(
  natural: 'friend' | 'enemy' | 'neutral',
  temporal: 'friend' | 'enemy',
): number {
  if (natural === 'friend')  return temporal === 'friend' ? 22.5 : 7.5;
  if (natural === 'enemy')   return temporal === 'friend' ? 7.5  : 1.875;
  // neutral
  return temporal === 'friend' ? 15.0 : 3.75;
}

/**
 * Returns dignity points for a planet in a given sign.
 * @param planetId    0-6
 * @param sign        1-12 (the varga sign — what sign the planet occupies in
 *                    the relevant divisional chart)
 * @param allPlanets  All planet positions (D1 / natal) — required to compute
 *                    temporal friendship between target and sign's lord
 * @param degInSign   Degree within sign (0-30), supplied only for D1 to enable
 *                    precise Moolatrikona range checks. Other vargas pass undefined.
 */
function vargaDignityPoints(
  planetId: number,
  sign: number,
  allPlanets: PlanetInput[],
  degInSign?: number,
): number {
  // NOTE: Exaltation is intentionally NOT a separate dignity grade here.
  // BPHS Ch.27 v.3 (Santhanam) lists 7 grades for shadvargaja:
  //   Moolatrikona 45 / Own 30 / Great Friend 22.5 / Friend 15 /
  //   Neutral 7.5 / Enemy 3.75 / Great Enemy 1.875
  // Exaltation is captured separately by Ucchabala (computed as
  // (180 - arc from exact exaltation point) / 3). Granting an additional
  // 45 here would double-count the exaltation bonus. A planet in its
  // exaltation sign falls through and is scored by friendship with the
  // sign's lord — matching JHora, AstroSage, Raman "Graha and Bhava Balas".
  // Fixed 2026-05-31: previous code `if (EXALTATION_SIGN_SB[planetId] ===
  // sign) return 45` was inflating Sun (D9 Aries + D30 Aries each fired
  // 45 instead of 15) by 60 virupas = 1.0 rupa.
  if (DEBILITATION_SIGN_SB[planetId] === sign) return 1.875;

  // Moolatrikona is a DEGREE-based dignity in BPHS Ch.27 v.3 (Santhanam) and
  // Raman "Graha and Bhava Balas" Ch.3. It applies only when the planet is in
  // both the moolatrikona SIGN and the moolatrikona DEGREE range (e.g. Sun's
  // MT = Leo 0-20°). For non-D1 vargas the planet doesn't have a degree
  // position in the varga sign (it just occupies that sign by the varga's
  // assignment rule). The conservative canonical reading is to fall through
  // to the "own sign" check (30 virupas) when the varga sign matches the MT
  // sign in non-D1 vargas — moolatrikona 45 is reserved for D1 with verified
  // degree.
  //
  // Previously this code granted 45 at sign-level in all vargas which
  // matches JHora's looser convention but inflated Sun shadvargaja by 30
  // virupas in charts where Sun's MT sign Leo appeared in D2/D3 vargas
  // (e.g. Bill Clinton: Sun at Leo 2°54' triggered MT in D2 hora and D3
  // drekkana). Fixed 2026-05-31 per shadvargaja audit.
  const mt = MOOLATRIKONA[planetId];
  if (mt?.sign === sign && degInSign !== undefined) {
    // D1 only: verify the actual degree falls in the MT range.
    if (degInSign >= mt.startDeg && degInSign < mt.endDeg) return 45;
  }
  // Non-D1 vargas where the varga sign matches the MT sign fall through to
  // the own-sign check below, which returns 30 (own sign) for MT signs
  // (since the planet always owns its own MT sign).

  if (OWN_SIGNS_SB[planetId]?.includes(sign)) return 30;

  // Pancha-dha Sambandha (compound friendship): combine natural friendship
  // between target and sign's lord with temporal friendship based on the lord's
  // house position from target in the D1 chart. See header comment for the
  // 6-cell compound matrix.
  const lord = SIGN_LORDS_SB[sign - 1];
  const targetP = allPlanets.find((pp) => pp.id === planetId);
  const lordP = allPlanets.find((pp) => pp.id === lord);
  if (!targetP || !lordP) {
    // Defensive fallback — pure natural friendship if positions unavailable
    const natural = getNaturalRelation(planetId, lord);
    if (natural === 'friend')  return 15;
    if (natural === 'enemy')   return 3.75;
    return 7.5;
  }
  const natural = getNaturalRelation(planetId, lord);
  const temporal = getTemporalRelation(targetP.sign, lordP.sign);
  return compoundDignity(natural, temporal);
}

function computeVargaSigns(p: PlanetInput): number[] {
  const sign = p.sign;
  const degInSign = p.longitude % 30;

  // D1  –  Rashi (natal sign)
  const d1 = sign;

  // D2  –  Hora: odd signs 0-15→Leo(5), 15-30→Cancer(4); even signs reversed
  const isOddSign_ = sign % 2 === 1;
  const d2 = degInSign < 15 ? (isOddSign_ ? 5 : 4) : (isOddSign_ ? 4 : 5);

  // D3  –  Drekkana: 0-10°=own, 10-20°=5th, 20-30°=9th
  const d3Offset = degInSign < 10 ? 0 : degInSign < 20 ? 4 : 8;
  const d3 = ((sign - 1 + d3Offset) % 12) + 1;

  // D9  –  Navamsha (pre-computed in PlanetInput)
  const d9 = p.navamshaSign;

  // D12  –  Dwadashamsha: 12 equal parts, starting from own sign
  const d12 = ((sign - 1 + Math.floor(degInSign * 12 / 30)) % 12) + 1;

  // D30 — Trimshamsha (BPHS Ch.6 v.31-32). The unequal-parts table DIFFERS
  // between odd and even signs:
  //   Odd signs: 5°/5°/8°/7°/5° → Mars, Saturn, Jupiter, Mercury, Venus
  //     cumulative bounds: [5, 10, 18, 25, 30]
  //   Even signs: 5°/7°/8°/5°/5° → Venus, Mercury, Jupiter, Saturn, Mars
  //     cumulative bounds: [5, 12, 20, 25, 30]
  //
  // Sign mapping per BPHS is the same set of 5 sign-IDs (one per non-luminary
  // planet) but in reversed order for even signs. The d30OddSigns/d30EvenSigns
  // arrays below already encode this reversal correctly.
  //
  // Bounds bug found by Gemini review on PR #317 (2026-06-01): both shadbala.ts
  // and kundali-calc.ts `getDivisionalSign case 30` were applying odd-sign
  // bounds to even signs, mis-assigning planets at deg ∈ [10, 12) and [18, 20).
  // For example a planet at 11° in an even sign should fall in the 2nd part
  // (Mercury) but was incorrectly placed in the 3rd part (Jupiter).
  const isOddSign_d30 = sign % 2 === 1;
  const d30Bounds = isOddSign_d30 ? [5, 10, 18, 25, 30] : [5, 12, 20, 25, 30];
  // Fallback to the LAST bucket (not first) for the rare case where degInSign
  // is exactly 30.0 due to FP rounding.
  let d30PartIdx = d30Bounds.length - 1;
  for (let b = 0; b < d30Bounds.length; b++) {
    if (degInSign < d30Bounds[b]) { d30PartIdx = b; break; }
  }
  const d30OddSigns  = [1, 11, 9, 3, 7];   // Aries, Aquarius, Sagittarius, Gemini, Libra
  const d30EvenSigns = [7, 3, 9, 11, 1];   // mirror (Libra → ... → Aries)
  const d30 = isOddSign_d30 ? d30OddSigns[d30PartIdx] : d30EvenSigns[d30PartIdx];

  return [d1, d2, d3, d9, d12, d30];
}

function shadvargajaBala(p: PlanetInput, allPlanets: PlanetInput[]): number {
  const vargas = computeVargaSigns(p); // [d1, d2, d3, d9, d12, d30]
  const degInSign = p.longitude % 30;  // D1 degree within sign
  return vargas.reduce((sum, sign, idx) =>
    // Pass degInSign only for D1 (idx=0) to enable precise Moolatrikona range check.
    // allPlanets is required for compound friendship (Pancha-dha Sambandha).
    sum + vargaDignityPoints(p.id, sign, allPlanets, idx === 0 ? degInSign : undefined),
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

function computeSthanaBala(p: PlanetInput, allPlanets: PlanetInput[]) {
  const ub = ucchaBala(p);
  const sv = shadvargajaBala(p, allPlanets);
  const ojr = ojhayugmaRashiBala(p);
  const ojn = ojhayugmaNavamshaBala(p);
  const kb = kendradiBala(p);
  const db = drekkanaBala(p);

  return {
    total: r2(ub + sv + ojr + ojn + kb + db),
    breakdown: {
      ucchaBala: r2(ub),
      shadvargaja: r2(sv),
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

/**
 * Natonnata Bala  –  diurnal/nocturnal strength (BPHS Ch.27 v.6-9).
 *
 * Two bugs were corrected here on 2026-05-31:
 *
 * 1. **Planet classification was swapped for Venus and Saturn.** The previous
 *    code had Saturn day-strong and Venus night-strong. Per BPHS Ch.27 v.6-7
 *    (Santhanam): "Moon, Mars and Saturn are strong at night. The Sun,
 *    Jupiter and Venus are strong by day. Mercury is always strong." This
 *    is consistent across Brihat Jataka, Saravali, Phaladeepika, Raman,
 *    Sanjay Rath, AstroSage, and JHora desktop.
 *
 * 2. **Formula used `60·sin(π·fraction)` capped at 0 for the "wrong" half**
 *    of day/night. Per BPHS Ch.27 v.8-9 the formula is LINEAR and uses a
 *    MIDNIGHT reference (not sunrise/sunset), and is COMPLEMENTARY: Nata Bala
 *    + Unnata Bala = 60 virupas for every paired planet at every birth time.
 *    The zero-cap for opposite-half was non-canonical and breaks the
 *    complementary invariant — confirmed wrong against every published
 *    reference (Santhanam, Raman, AstroSage, Prokerala, JHora).
 *
 * Formula (BPHS Ch.27 v.8-9):
 *   - Unnata = ghatis from nearest midnight (0 at midnight, 30 at noon).
 *     1 ghati = 24 min, so unnataGhatis = hoursFromMidnight × 2.5.
 *   - Nata = 30 - Unnata.
 *   - Nocturnal planets (Moon, Mars, Saturn): Nata × 2 virupas → 60 at
 *     midnight, 0 at noon.
 *   - Diurnal planets (Sun, Jupiter, Venus): Unnata × 2 = 60 - Nata × 2.
 *   - Mercury (Mishra): always 60.
 *
 * Bill Clinton 1946-08-19 08:51 verification:
 *   Nocturnal: Nata = 30 - 8.85×2.5 = 7.875 → ×2 = 15.75 virupas
 *   Diurnal:   60 - 15.75 = 44.25 virupas
 *   AstroSage values: nocturnal 17.25, diurnal 42.75 (sum = 60 ✓ invariant)
 *   Our values:       nocturnal 15.75, diurnal 44.25 (sum = 60 ✓ invariant)
 *   Δ ≈ 1.5 virupas — small second-order difference (likely AstroSage uses
 *   local apparent midnight rather than civil midnight, or sunrise-anchored
 *   day-ghatis instead of fixed civil ghatis).
 */
function natonnataBala(
  p: PlanetInput,
  birthHour: number, // local wall-clock hour 0-24
): number {
  // Mercury (Budha) is Mishra — always fully strong regardless of birth time.
  if (p.id === 3) return 60;

  // Defensive: birthHour may arrive outside [0, 24) when getUTCHours() +
  // tzOffset wraps a day boundary in upstream computation. Without
  // normalization, Math.min(birthHour, 24 - birthHour) produces negative
  // values or values greater than 12, breaking the ghati formula.
  // Per Gemini review on PR #317 (2026-05-31).
  const normHour = ((birthHour % 24) + 24) % 24;
  // Reflect time-of-day around midnight: distance from nearest midnight,
  // capped at 12 (so noon = 12, both 6 AM and 6 PM = 6, etc.).
  const hoursFromMidnight = Math.min(normHour, 24 - normHour);
  // 1 ghati = 24 minutes = 0.4 hours → 1 hour = 2.5 ghatis.
  const unnataGhatis = hoursFromMidnight * 2.5; // 0 at midnight, 30 at noon
  const nataGhatis = 30 - unnataGhatis;          // 30 at midnight, 0 at noon
  const nataBala = 2 * nataGhatis;               // 0-60 virupas

  // Nocturnal: Moon, Mars, Saturn. Diurnal: Sun, Jupiter, Venus.
  // Verified against BPHS Ch.27 v.6-7 (Santhanam); see header comment.
  const nocturnal = [1, 2, 6];
  const bala = nocturnal.includes(p.id) ? nataBala : 60 - nataBala;
  return Math.round(bala * 100) / 100;
}

function pakshaBala(p: PlanetInput, sunLong: number, moonLong: number): number {
  const elongation = normalizeDeg(moonLong - sunLong);
  const isShukla = elongation <= 180;
  const benefics = [1, 3, 4, 5]; // Moon, Mercury, Jupiter, Venus

  let value: number;
  if (isShukla) {
    value = benefics.includes(p.id) ? elongation / 3 : (180 - elongation) / 3;
  } else {
    const krishnaElongation = 360 - elongation;
    value = benefics.includes(p.id)
      ? krishnaElongation / 3
      : (180 - krishnaElongation) / 3;
  }

  // Moon's Paksha Bala is doubled. This is the SANTHANAM / RAMAN / AstroSage /
  // JHora majority convention, NOT in Parashara's literal verse.
  //
  // The Sanskrit verse (BPHS Ch.27 v.10-11) is silent on doubling — Santhanam
  // and Raman added it in their commentaries; Sharma's translation does not.
  //
  // Two internally-consistent readings of BPHS Shadbala for the Moon:
  //
  // Reading A (majority — Santhanam, Raman, AstroSage, JHora desktop):
  //   - Moon Paksha (in Kala) = 2× elongation-derived value
  //   - Moon Cheshta = 0 (Moon's motional strength IS its Paksha;
  //     a separate Cheshta entry would triple-count)
  //
  // Reading B (strict-verse — Sharma BPHS, Ernst Wilhelm Kala):
  //   - Moon Paksha (in Kala) = elongation/3 like other benefics
  //   - Moon Cheshta = separate motional formula (not 0)
  //
  // We use Reading A: this `*= 2` works together with the `if (p.id === 1)
  // return 0` early-out in computeCheshtaBala. DO NOT change one without
  // changing the other — the two readings are coupled, and mixing them
  // produces either double-counting (Paksha doubled + Cheshta computed) or
  // under-counting (Paksha NOT doubled + Cheshta = 0).
  //
  // Cross-confirmed 2026-05-31 against AstroSage Bill Clinton breakdown
  // (Moon Paksha 63.81 = 2 × 31.91 for elongation 95.66° Krishna).
  if (p.id === 1) value *= 2;
  return value;
}

/**
 * Tribhaga Bala  –  the "three-thirds" strength.
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
  // Year lord = lord of the weekday of Mesha Sankranti (Sun enters sidereal Aries)
  // Binary search for the JD when sidereal Sun longitude crosses 0° in the birth year.
  // Search window: March 1 to May 1 (Mesha Sankranti always falls ~April 13-15).
  const year = birthDateObj.getUTCFullYear();
  let lo = dateToJD(year, 3, 1);   // March 1
  let hi = dateToJD(year, 5, 1);   // May 1

  // Binary search: find JD where sidereal Sun longitude crosses from ~359° to ~0°
  // We look for the point where sidereal Sun is closest to 0° (entering Aries)
  for (let i = 0; i < 30; i++) { // 30 iterations gives sub-second precision
    const mid = (lo + hi) / 2;
    const sidSun = toSidereal(sunLongitude(mid), mid);
    // If sidSun > 180°, Sun hasn't reached 0° yet (it's still in late Pisces ~350-359°)
    // If sidSun < 180°, Sun has already passed 0° (it's in early Aries ~0-10°)
    if (sidSun > 180) {
      lo = mid; // Sun still in Pisces, move forward
    } else {
      hi = mid; // Sun already in Aries, move backward
    }
  }

  const meshaSankrantiJD = (lo + hi) / 2;
  // Weekday: 0=Sun, 1=Mon, ..., 6=Sat (Lesson O)
  const weekday = Math.floor(meshaSankrantiJD + 1.5) % 7;
  const yearLordIdx = WEEKDAY_LORD[weekday];
  return p.id === yearLordIdx ? 15 : 0;
}

function masaBala(p: PlanetInput, birthDateObj: Date, planets: PlanetInput[], julianDay: number): number {
  // Month lord = lord of the weekday of the most recent New Moon (Amanta lunar month start).
  // Approximate the tithi number from Moon-Sun elongation, then go back to Pratipada (tithi 1).
  // Moon-Sun elongation: each tithi = 12° of elongation.
  const sunPlanet = planets.find((pl) => pl.id === 0);
  const moonPlanet = planets.find((pl) => pl.id === 1);

  if (sunPlanet && moonPlanet) {
    const elongation = normalizeDeg(moonPlanet.longitude - sunPlanet.longitude);
    // Current tithi number (1-30): each tithi = 12°
    const tithiIndex = Math.floor(elongation / 12); // 0-29
    // Days since New Moon ≈ tithiIndex (each tithi ≈ 1 day on average)
    // Go back to approximate New Moon date
    const newMoonJD = julianDay - tithiIndex;
    // Weekday of the New Moon: 0=Sun, 1=Mon, ..., 6=Sat (Lesson O)
    const weekday = Math.floor(newMoonJD + 1.5) % 7;
    const monthLordIdx = WEEKDAY_LORD[weekday];
    return p.id === monthLordIdx ? 30 : 0;
  }

  // Fallback: use birth date's own weekday
  const weekday = Math.floor(julianDay + 1.5) % 7; // 0=Sun (Lesson O)
  const monthLordIdx = WEEKDAY_LORD[weekday];
  return p.id === monthLordIdx ? 30 : 0;
}

function varaBala(p: PlanetInput, julianDay: number): number {
  const weekday = Math.floor(julianDay + 1.5) % 7; // 0=Sun … 6=Sat
  const lordId = WEEKDAY_LORD[weekday];
  return p.id === lordId ? 45 : 0;
}

/**
 * Hora Bala — planet receives 60 virupas if it's the lord of the current hora
 * (planetary hour) at birth.
 *
 * Uses VARIABLE-LENGTH horas (day/12 and night/12) per the BPHS convention
 * adopted by JHora desktop, AstroSage, Prokerala, and Parashara's Light.
 * Day-horas span (sunset − sunrise) / 12 minutes each; night-horas span the
 * complementary night arc / 12. Total of 24 horas per day-night cycle.
 *
 * Previously this used fixed 60-min horas (a minority convention). Switched
 * to variable horas 2026-05-31 per multi-source canonical audit: hand-calcs
 * from three independent reviewers and all four reference software
 * implementations (JHora/AstroSage/Prokerala/Parashara's Light) use variable
 * horas; only our engine used fixed.
 *
 * Hora sequence within a day:
 *   Hour 1 (sunrise to +1 day-hora):  day lord
 *   Hour 2: Chaldean order from day lord (slowest → fastest):
 *           Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon (cycles)
 *   Hour 13 (sunset to +1 night-hora): continues Chaldean from hour 12's next
 *   etc. through hour 24 (last night-hora ends at next sunrise).
 *
 * @param p             Planet being evaluated for Hora ownership
 * @param birthHour     Local wall-clock hour 0-24
 * @param julianDay     For weekday determination (0=Sun, 1=Mon, ..., 6=Sat)
 * @param sunriseHour   Local sunrise (decimal hours)
 * @param sunsetHour    Local sunset (decimal hours)
 */
function horaBala(
  p: PlanetInput,
  birthHour: number,
  julianDay: number,
  sunriseHour: number,
  sunsetHour: number,
): number {
  const weekday = Math.floor(julianDay + 1.5) % 7; // 0=Sun, 1=Mon, ..., 6=Sat (Lesson O)
  const dayLord = WEEKDAY_LORD[weekday];
  const dayLordPos = CHALDEAN.indexOf(dayLord);

  // Day length and night length in hours. Day = sunrise → sunset.
  const dayLength = sunsetHour - sunriseHour;
  const nightLength = 24 - dayLength;
  if (dayLength <= 0 || nightLength <= 0) {
    // Edge case (polar regions or invalid sun times) — fall back to fixed hora
    let hourIndex = Math.floor(birthHour - sunriseHour);
    if (hourIndex < 0) hourIndex += 24;
    const horaLordPos = (dayLordPos + hourIndex) % 7;
    return p.id === CHALDEAN[horaLordPos] ? 60 : 0;
  }

  const dayHoraLen = dayLength / 12;
  const nightHoraLen = nightLength / 12;

  let hourIndex: number;
  if (birthHour >= sunriseHour && birthHour < sunsetHour) {
    // Day birth: hourIndex 0..11
    hourIndex = Math.floor((birthHour - sunriseHour) / dayHoraLen);
  } else if (birthHour >= sunsetHour) {
    // Night birth, after sunset: hourIndex 12..23
    hourIndex = 12 + Math.floor((birthHour - sunsetHour) / nightHoraLen);
  } else {
    // Pre-sunrise (before sunrise on the same day): treat as previous night's
    // continuation — birthHour conceptually adds 24 - sunset hours before
    // wrapping into morning. Pragmatic mapping into 12..23 range.
    const elapsedAfterPrevSunset = birthHour + (24 - sunsetHour);
    hourIndex = 12 + Math.floor(elapsedAfterPrevSunset / nightHoraLen);
  }
  // Clamp defensively to 0..23
  hourIndex = Math.max(0, Math.min(23, hourIndex));

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
    // Sun, Mars, Jupiter  –  strong in northern declination
    value = ((24 + dec) * 60) / 48;
  } else if (p.id === 1 || p.id === 5 || p.id === 6) {
    // Moon, Venus, Saturn  –  strong in southern declination
    value = ((24 - dec) * 60) / 48;
  } else {
    // Mercury  –  always benefits from declination magnitude
    value = ((24 + Math.abs(dec)) * 60) / 48;
  }

  // Sun's Ayana Bala is doubled per BPHS Ch.27 v.18 + Santhanam translator's
  // note (Ch.27 v.15-17 Ayana Bala section): "Surya's Ayana Bala is again
  // multiplied by 2 whereas for others the product arrived in Virupas is
  // considered, as it is."
  //
  // Structural rationale: BPHS 27.18 states "Sun's Cheshta Bala will
  // correspond to his Ayana Bala." Sun has no independent Cheshta Bala (Sama
  // motion — near-constant rate). This is the same structural rule as Moon's
  // Paksha doubling (Moon's Cheshta = Paksha Bala). The cleanest implementation
  // (per AstroSage, JHora, Parashara's Light): double Ayana in place and keep
  // Cheshta = 0 for the luminary. Multi-source cross-check 2026-06-01: Bill
  // Clinton Sun Ayana = 92.60 in AstroSage = 2 × our 46.06 (smoking-gun match).
  //
  // Coupling note: this `*= 2` and the `if (p.id === 0) return 0` early-out in
  // computeCheshtaBala() are HALVES of the same Reading A. DO NOT change one
  // without the other — mixing readings either triple-counts Ayana into Sun's
  // totalShadbala or under-counts it. Mirror of pakshaBala() for Moon.
  if (p.id === 0) value *= 2;

  // Cap at 60 (single-instance bound). Sun's doubled value may exceed 60 in
  // strong-northern-declination charts; per Santhanam the cap applies to the
  // raw formula output, then the ×2 is the published total which can reach 120.
  // We bound to [0, 120] for Sun explicitly and [0, 60] for all others.
  return Math.max(0, Math.min(p.id === 0 ? 120 : 60, value));
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
        // Planetary war (Graha Yuddha)  –  winner determined by lower absolute
        // ecliptic latitude.  Source: BPHS Ch.28 ("that planet whose latitude
        // is less wins the war").  This is also the rule used in graha-yuddha.ts.
        //
        // HISTORICAL BUG (now fixed): the code used ecliptic LONGITUDE to pick
        // the winner (higher longitude wins).  Longitude has nothing to do with
        // the classical rule and gave wrong results for every planetary war.
        //
        // Fallback: if eclipticLatitude was not supplied (older call sites), fall
        // back to the longitude comparison to avoid a breaking change  –  but this
        // path should not occur in normal usage since kundali-calc now passes it.
        const aLat = a.eclipticLatitude;
        const bLat = b.eclipticLatitude;
        let aWins: boolean;
        if (aLat !== undefined && bLat !== undefined) {
          // Higher NORTHERN (positive) latitude wins per BPHS Ch.3 / Lesson Y
          // NOT lower absolute value — that gives wrong result when both are positive
          aWins = aLat >= bLat;
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
  // Normalize birthHour to [0, 24). When local time + tz crosses a UT date
  // boundary (e.g. 06:30 Tokyo JST = UT 21:30 of previous day), the raw sum
  // (getUTCHours + getUTCMinutes/60 + tz) can land outside [0, 24) — for
  // Tokyo Aug 15 06:30 JST: 21 + 0.5 + 9 = 30.5h. Without normalization,
  // horaBala and tribhagaBala interpret this as a "night birth past sunset"
  // and assign the wrong planetary hour. Discovered 2026-06-01 during
  // Saturn-high systematic-bias investigation (Test5-Tokyo: Saturn incorrectly
  // got hora=60 because hourIndex got clamped to 23 from out-of-range input;
  // correct Moon hora at 06:30 Wed UT was being clobbered).
  const rawBirthHour =
    input.birthDateObj.getUTCHours() +
    input.birthDateObj.getUTCMinutes() / 60 +
    input.timezone;
  const birthHour = ((rawBirthHour % 24) + 24) % 24;

  // Compute actual sunrise for this birth location/date
  const sunTimes = getSunTimes(
    input.birthDateObj.getUTCFullYear(),
    input.birthDateObj.getUTCMonth() + 1,
    input.birthDateObj.getUTCDate(),
    input.latitude,
    input.longitude,
    input.timezone,
  );
  // Round 2 TZ-1 — use tz-safe minutes contract. The deprecated
  // sunTimes.sunrise/sunset Date fields call .getHours()/.getMinutes() in
  // the SERVER's timezone, not the observer's wall clock. On Vercel UTC
  // this happens to coincide; on a non-UTC host the dignity computation
  // flipped day↔night and cascaded into wrong natonnata/tribhaga/hora-bala
  // values for every chart.
  const sunriseHour = sunTimes.sunriseMinutes / 60;
  const sunsetHour = sunTimes.sunsetMinutes / 60;
  const isDayBirth = birthHour >= sunriseHour && birthHour < sunsetHour;

  const sunPlanet = planets.find((pl) => pl.id === 0);
  const moonPlanet = planets.find((pl) => pl.id === 1);
  const sunLong = sunPlanet ? sunPlanet.longitude : 0;
  const moonLong = moonPlanet ? moonPlanet.longitude : 0;

  const nn = natonnataBala(p, birthHour);
  const pk = pakshaBala(p, sunLong, moonLong);
  const tb = tribhagaBala(p, birthHour, isDayBirth, sunriseHour, sunsetHour);
  const ab = abdaBala(p, input.birthDateObj);
  const mb = masaBala(p, input.birthDateObj, planets, input.julianDay);
  const vb = varaBala(p, input.julianDay);
  const hb = horaBala(p, birthHour, input.julianDay, sunriseHour, sunsetHour);
  const ayanamsha = input.ayanamshaValue ?? getAyanamsha(input.julianDay);
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
 * Cheshta Bala — planetary motional strength (BPHS Ch.27 v.19-23).
 *
 * ========================================================================
 * THE 8-STATE CANONICAL METHOD
 * ========================================================================
 *
 * BPHS Ch.27 v.19-23 (Santhanam translation, cross-confirmed in Sharma and
 * Raman "Graha and Bhava Balas" Ch.3) prescribes that Cheshta Bala for the
 * 5 non-luminary planets (Mars, Mercury, Jupiter, Venus, Saturn) is assigned
 * by classifying the planet's instantaneous motion into one of 8 named
 * states, then looking up the canonical virupa value for that state.
 *
 * This replaces a non-canonical modern interpolation that was previously in
 * use here: `min(60, |speed / mean_speed| × 30)` for direct motion plus a
 * blanket `60` for any retrograde planet. That formula was a smooth
 * speed-ratio approximation; the classical method is a step function
 * grounded in identifiable motion states.
 *
 * Audit history (2026-05-31): three independent expert reviews (Claude,
 * ChatGPT, Gemini) all flagged the speed-ratio formula as non-canonical
 * and recommended the 8-state classical method. They disagreed on exact
 * virupa values for some states; the values below are the 2/3-majority
 * consensus (ChatGPT + Gemini, both citing BPHS Ch.27 v.19-23). One
 * dissent (Claude) gave alternative values for Manda/Mandatara/Sama/
 * Atichara — we did not adopt the dissent because the majority cited
 * primary sources (Santhanam, Sharma, Saravali) more directly.
 *
 * The 8 motion states and their canonical virupa values:
 *
 *   State        Sanskrit       Speed condition              Virupas
 *   --------------------------------------------------------------------
 *   Vakra        वक्र            Retrograde                    60
 *   Anuvakra     अनुवक्र         Just turning retrograde/      30
 *                                  resuming direct motion
 *   Vikala       विकल            Stationary (near-zero speed)  15
 *   Mandatara    मन्दतर          Very slow direct (< 50% mean) 15
 *   Manda        मन्द            Slow direct (50% - 100% mean) 30
 *   Sama         सम              Near-mean direct (100-125%)    7.5
 *   Chara        चर              Fast direct (125% - 150%)     45
 *   Atichara     अतिचर           Very fast direct (> 150%)     30
 *
 * Note the non-monotonic curve: Cheshta peaks at retrograde (Vakra = 60),
 * has a secondary peak at "fast" direct (Chara = 45), and a deep trough at
 * mean speed (Sama = 7.5). The Vedic interpretation: motional strength is
 * about how "energetic" a planet's apparent motion is, and a planet moving
 * exactly at its mean speed shows no notable "energy".
 *
 * Speed-ratio thresholds (per Claude's threshold breakdown — the only
 * reviewer who gave explicit numeric thresholds):
 *   Vikala        |speed| < 0.001 (effectively zero)
 *   Mandatara     direct, ratio < 0.5
 *   Manda         direct, 0.5 ≤ ratio < 1.0
 *   Sama          direct, 1.0 ≤ ratio < 1.25
 *   Chara         direct, 1.25 ≤ ratio < 1.5
 *   Atichara      direct, ratio ≥ 1.5
 *
 * Anuvakra (transitional retrograde) is hard to detect without acceleration
 * data and we don't have a reliable signal for it from current PlanetInput.
 * We fold it into Vakra (60): a retrograde planet, whether deep-retrograde
 * or just-turning-retrograde, gets full Cheshta. The difference (Vakra 60
 * vs Anuvakra 30) is a 30-virupa swing that affects only the narrow window
 * near stationary points; for the vast majority of charts, isRetrograde is
 * either true (Vakra) or false (one of the direct states).
 *
 * ========================================================================
 * SUN AND MOON RETURN 0 (Reading A coupling — DO NOT change without also
 * changing pakshaBala for Moon AND ayanaBala for Sun)
 * ========================================================================
 *
 * Cheshta Bala for the luminaries is captured in Kala Bala instead, per BPHS
 * Ch.27 v.13-14 + v.18:
 *   Sun:   "Sun's Cheshta Bala will correspond to his Ayana Bala" (v.18) —
 *          implemented as Ayana Bala DOUBLED in computeKalaBala/ayanaBala.
 *   Moon:  "Moon's Cheshta = Paksha Bala" — implemented as Paksha Bala DOUBLED
 *          in pakshaBala.
 *
 * Returning a separate non-zero Cheshta value here for Sun or Moon would
 * triple-count those quantities (since the doubled Ayana/Paksha is already
 * summed into kalaBala.total).
 *
 * This is "Reading A" (Santhanam / Raman / AstroSage / JHora majority). All
 * three pieces are coupled — do NOT change one without the others:
 *   1. `if (p.id === 0 || p.id === 1) return 0` HERE (Cheshta = 0 for luminaries)
 *   2. `if (p.id === 1) value *= 2` in pakshaBala (Moon Paksha doubled)
 *   3. `if (p.id === 0) value *= 2` in ayanaBala (Sun Ayana doubled)
 * Mixing partial implementations either triple-counts or under-counts.
 *
 * ========================================================================
 * THE `mode` PARAMETER IS KEPT FOR API COMPATIBILITY but no longer affects
 * output. Both 'bphs_strict' and 'graduated' now produce the same 8-state
 * result. The 'graduated' interpolated retrograde formula was a non-canonical
 * modern variant; it's not part of either accepted classical reading.
 */
function computeCheshtaBala(
  p: PlanetInput,
  _ay: number,
  _planets: PlanetInput[],
  _mode: 'bphs_strict' | 'graduated' = 'bphs_strict',
): number {
  // Sun and Moon: motional strength captured in Ayana/Paksha (see header).
  if (p.id === 0 || p.id === 1) return 0;

  const avg = AVG_SPEED[p.id];
  if (!avg) return 30; // Defensive: missing mean speed → return Anuvakra/half-strength

  // Vikala — effectively stationary. Catches the narrow window around
  // retrograde/direct stations where instantaneous speed crosses zero.
  if (Math.abs(p.speed) < 0.001) return 15;

  // Vakra (or Anuvakra, folded in): any retrograde motion → 60.
  if (p.isRetrograde) return 60;

  // Direct motion: classify by speed ratio against mean daily motion.
  const ratio = Math.abs(p.speed) / avg;
  if (ratio < 0.5)  return 15;  // Mandatara (very slow)
  if (ratio < 1.0)  return 30;  // Manda (slow but reaching mean)
  if (ratio < 1.25) return 7.5; // Sama (around mean = mediocre motional strength)
  if (ratio < 1.5)  return 45;  // Chara (fast)
  return 30;                    // Atichara (very fast — > 150% mean)
}

// ---------------------------------------------------------------------------
// VI. Drik Bala
// ---------------------------------------------------------------------------

/**
 * Sphuta Drishti (graha-drishti, BPHS Ch.26 v.4-7) — continuous degree-based
 * planetary aspect strength in virupas (0-60).
 *
 * Replaced the old quartile rashi-drishti getAspectStrength() 2026-05-31.
 * The previous implementation used house-quartile fractions (0.25/0.5/0.75/
 * 1.0) which is the JAIMINI rashi-drishti convention — wrong system for
 * Parashari Shadbala. Parashari Drik Bala (BPHS Ch.27 v.18-20) explicitly
 * uses graha-drishti / sphuta drishti, which is a continuous function of
 * the longitudinal angular distance between the aspecting planet and its
 * target (not a discrete house lookup).
 *
 * Curve is symmetric around D=180° (7th aspect = peak, 60 virupas) with
 * classical Parashari cusp values:
 *   D=  0°  →   0  (same sign)
 *   D= 30°  →   0  (2nd house — no aspect)
 *   D= 60°  →  15  (3rd house — 1/4 strength)
 *   D= 90°  →  45  (4th house — 3/4 strength)
 *   D=120°  →  30  (5th house — 1/2 strength)
 *   D=150°  →   0  (6th house — no aspect)
 *   D=180°  →  60  (7th house — FULL strength)
 *   D=210°-360°  →  mirror of D=150°-0°
 *
 * Linear interpolation between cusps. Returns 0 outside the [60°, 300°]
 * aspect range.
 *
 * @param D  Angular distance from aspecting planet to target (0-360°)
 */
function sphutaDrishti(D: number): number {
  const d = ((D % 360) + 360) % 360;
  // Fold around 180°: for d > 180, use mirror (360 - d) for symmetric curve
  const x = d <= 180 ? d : 360 - d;
  if (x < 30) return 0;
  if (x < 60) return (x - 30) * 0.5;             // 0 → 15
  if (x < 90) return 15 + (x - 60) * 1.0;        // 15 → 45
  if (x < 120) return 45 + (x - 90) * (-0.5);    // 45 → 30
  if (x < 150) return 30 + (x - 120) * (-1.0);   // 30 → 0
  if (x <= 180) return (x - 150) * 2.0;          // 0 → 60 (peak at 7th)
  return 0;
}

/**
 * Tapered special-aspect bonus for Mars (4th/8th), Jupiter (5th/9th), Saturn
 * (3rd/10th) per BPHS Ch.26 and Raman "Graha and Bhava Balas" Ch.5.
 *
 * BPHS prescribes that these planets get FULL 60-virupa aspect strength at
 * their special-aspect angles, vs. the ordinary 15/30/45 partial-aspect
 * values. The bonus tapers linearly across each side of the special angle,
 * dropping to zero at the boundary of the surrounding rasi (±15° from the
 * exact special distance). This is the canonical "interpolated peak"
 * approach — neither the modern flat-60-with-±5°-orb cap (non-canonical
 * orb gate) nor the dropping-special-aspects-entirely approach.
 *
 * Peak bonus = 60 − sphutaDrishti(specialAngle) so that total at exact
 * special angle = 60 virupas (the canonical full aspect).
 *
 * Restored 2026-05-31 per Gemini review on PR #317 — the earlier "drop
 * ±5° override" commit threw out the canonical special-aspect upgrade
 * along with the non-canonical orb gate.
 */
function specialAspectBonus(aspecterId: number, D: number): number {
  const d = ((D % 360) + 360) % 360;
  // Special-aspect angles per planet
  const specials =
    aspecterId === 2 ? [90, 210] :   // Mars 4th and 8th
    aspecterId === 4 ? [120, 240] :  // Jupiter 5th and 9th
    aspecterId === 6 ? [60, 270] :   // Saturn 3rd and 10th
    null;
  if (!specials) return 0;
  let bonus = 0;
  for (const angle of specials) {
    // Shortest angular distance from d to the special angle (mod 360)
    let diff = d - angle;
    diff = ((diff + 180) % 360 + 360) % 360 - 180;
    const offset = Math.abs(diff);
    if (offset >= 15) continue;        // outside rasi taper width
    const peakBonus = 60 - sphutaDrishti(angle);
    bonus += peakBonus * (1 - offset / 15);  // linear taper, peak at angle
  }
  return bonus;
}

/**
 * Drik Bala (BPHS Ch.27 v.18-20) — planetary aspect strength contribution.
 *
 * Per Santhanam translation of BPHS Ch.27 v.18-20: "Reduce one fourth of the
 * Drishti Pinda if a Graha receives malefic Drishtis and add a fourth if it
 * receives a Drishti from a benefic. The entire drishti of Budha and Guru
 * should be super-added."
 *
 * Algorithm: for each planet OTHER than p,
 *   1. Compute sphuta drishti from the aspecting planet to p's longitude.
 *   2. Apply special-aspect upgrades (Mars/Jupiter/Saturn).
 *   3. Multiply by sign: +1 if aspecting planet is benefic, -1 if malefic.
 *   4. Multiply by weight: 1.0 if aspecting planet is Mercury or Jupiter
 *      ("entire drishti super-added"), else 0.25 ("one fourth").
 *   5. Sum all contributions.
 *
 * Benefic = Moon, Mercury, Jupiter, Venus (natural).
 * Malefic = Sun, Mars, Saturn, Rahu, Ketu.
 * Rahu/Ketu (shadow planets) contribute as malefics; conservative reading
 * here gives them only the 7th-axis aspect (no special-aspect upgrades).
 *
 * Replaces the previous house-based rashi-drishti formula (Jaimini system)
 * that was mistakenly used here. See sphutaDrishti() header for rationale.
 *
 * @param p          The planet being assessed
 * @param allPlanets All 9 planets (0-8) with longitudes in degrees
 */
function computeDrikBala(p: PlanetInput, allPlanets: PlanetInput[]): number {
  const beneficIds = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus
  let drikBala = 0;

  for (const other of allPlanets) {
    if (other.id === p.id) continue;

    // Angular distance FROM the aspecting planet TO target p.
    const D = ((p.longitude - other.longitude) % 360 + 360) % 360;

    // Rahu (7) and Ketu (8): 7th-axis aspect only (within ±5° of D=180°).
    // Conservative reading consistent with the yoga engine's node aspect model.
    // For Mars/Jupiter/Saturn: base sphuta drishti + tapered special-aspect
    // bonus (Mars 4/8, Jupiter 5/9, Saturn 3/10) per BPHS Ch.26 + Raman
    // Ch.5. Bonus peaks at the exact special angle (giving total = 60) and
    // tapers linearly to 0 at ±15° from the special angle — canonical
    // interpolated peak, NOT the modern ±5° orb gate that was removed
    // earlier in this PR. Restored per Gemini review 2026-05-31.
    let strength: number;
    if (other.id === 7 || other.id === 8) {
      const offset = Math.abs(D - 180);
      strength = offset <= 5 ? 60 : 0;
    } else {
      strength = sphutaDrishti(D) + specialAspectBonus(other.id, D);
      // Cap at 60 to be safe (peak design = exactly 60, but FP rounding)
      strength = Math.min(60, strength);
    }

    if (strength === 0) continue;

    const signMul = beneficIds.has(other.id) ? 1 : -1;
    // Mercury (3) and Jupiter (4) contribute full drishti per BPHS Ch.27 v.20;
    // all other planets contribute 1/4 of their drishti.
    const weight = (other.id === 3 || other.id === 4) ? 1.0 : 0.25;
    drikBala += signMul * weight * strength;
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
    const sthana = computeSthanaBala(p, planets);
    const digBala = r2(computeDigBala(p, input.ascendantDeg));
    const kala = computeKalaBala(p, input, planets, yuddhaBalaMap);
    const ayanamsha = input.ayanamshaValue ?? getAyanamsha(input.julianDay);
    const ay = ayanaBala(p, ayanamsha);
    const cheshtaBala = r2(computeCheshtaBala(p, ay, planets, options?.cheshtaBalaMode || 'bphs_strict'));
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
