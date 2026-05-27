/**
 * strength-inputs.ts
 *
 * Collects and normalises all planetary and house strength inputs for the
 * Health Diagnosis Engine (Layer 1 — natal baseline).
 *
 * Every health element in the matrix (§4 of the spec) consults the same set
 * of strength axes. This module pre-computes them once per kundali so that
 * the per-element scoring functions can simply weight the pre-built objects
 * rather than re-reading KundaliData independently.
 *
 * Per-element weight vectors are NOT applied here — this is a pure collector.
 *
 * Output shape:
 *   { planets: Record<planetId, PlanetStrength>, houses: Record<1-12, HouseStrength> }
 *
 * Safe-default policy (project rule "no silent swallows"):
 *   Every optional field on KundaliData is accessed via `?.` / `?? default`.
 *   TODO comments mark fields that require upstream plumbing to fill in
 *   with real values.
 */

import type { KundaliData } from '@/types/kundali';
import { SIGN_LORDS as SIGN_LORD } from '@/lib/constants/dignities';

// ─── Public types ────────────────────────────────────────────────────────────

/** Dignity tier string — mirrors standard Jyotish vocabulary. */
export type DignityTier =
  | 'exalted'
  | 'own'
  | 'moolatrikona'
  | 'friend'
  | 'neutral'
  | 'enemy'
  | 'debilitated'
  | 'unknown';

/**
 * All strength axes for one planet, normalised to 0–100 wherever meaningful.
 *
 * Axes:
 *  - overall          : composite 0–100, derived primarily from shadbalaRatio
 *  - shadbalaRatio    : ShadBalaComplete.strengthRatio (ratio against minimum required)
 *  - dignity          : Tier label; positive tiers boost overall, negative reduce it
 *  - baladiStrength   : Avasthas Baladi (0–100 per BPHS: Bala=20, Kumara=40, Yuva=100,
 *                       Vriddha=50, Mrita=5)
 *  - isCombust        : PlanetPosition.isCombust (retrograde-adjusted orb applied upstream)
 *  - isRetrograde     : PlanetPosition.isRetrograde
 *  - vargottama       : PlanetPosition.isVargottama (same sign D1 and D9)
 *  - vimsopaka        : VimshopakaBala.total normalised to 0–100 (raw scale 0–20)
 *  - ashtakavargaBindus: Raw bindus in the planet's natal house (0–8)
 *                        Source: AshtakavargaData.bpiTable[planetIdx][houseIdx]
 *  - grahaYuddhaWinner: true = winner, false = loser, null = not in war
 */
export interface PlanetStrength {
  overall: number;          // 0–100
  shadbalaRatio: number;    // 0+ (1.0 = meets minimum, >1.0 = strong)
  dignity: DignityTier;
  baladiStrength: number;   // 0–100
  isCombust: boolean;
  isRetrograde: boolean;
  vargottama: boolean;
  vimsopaka: number;        // 0–100 (normalised from 0–20 raw)
  ashtakavargaBindus: number; // 0–8
  grahaYuddhaWinner: boolean | null;
}

/**
 * All strength axes for one house, normalised to 0–100 wherever meaningful.
 *
 *  - bhavabala      : BhavaBalaResult.strengthPercent (already 0–100 from engine)
 *  - occupants      : Planet IDs sitting in this house (derived from planets[].house)
 *  - ownerStrength  : overall strength (0–100) of the sign-lord of this house
 *                     Uses SIGN_LORD[houseSign] → planetId → planets[id].overall
 *                     (No houseLords map on KundaliData — derived here each call)
 */
export interface HouseStrength {
  bhavabala: number;      // 0–100
  occupants: number[];    // planet IDs
  ownerStrength: number;  // 0–100
}

/**
 * Derived health signals that are not per-planet and not per-house, but are
 * referenced by multiple element weight vectors (B2-B22).
 *
 * Fields are stubbed with safe defaults when the upstream data needed to
 * compute real values is absent (Phase A-D testing).  Every stub is marked
 * with a TODO so Phase E implementers know exactly what to wire.
 *
 * Axes in weights.ts that map to this struct:
 *   rahuPlacement    → rahuPlacementScore
 *   ketuPlacement    → ketuPlacementScore
 *   aspectsOnMoon    → aspectsOnMoon.malefic / benefic
 *   moonPakshaBala   → moonPakshaBala
 */
export interface DerivedHealthSignals {
  /** Rahu's house (1-12) or undefined if Rahu not found in the planet list. */
  rahuHouse: number | undefined;
  /** Ketu's house (1-12) or undefined if Ketu not found in the planet list. */
  ketuHouse: number | undefined;

  /**
   * Placement score for Rahu (0-100).  Used by elements 4.6/4.8/4.14/4.15/4.17/4.18/4.20/4.21.
   * Scoring rationale (classical Jyotish dusthana/kendra convention):
   *   100 — house 1 (lagna): strongest influence on the body
   *    80 — dusthana (6/8/12): malefic gains in harmful houses → high risk
   *    40 — kendra (4/7/10): prominent but moderate impact
   *    50 — all other houses: baseline
   */
  rahuPlacementScore: number;

  /** Same placement scoring scale as rahuPlacementScore, applied to Ketu. */
  ketuPlacementScore: number;

  /**
   * Count of malefic and benefic drishti (aspect) lines landing on Moon's house.
   *
   * Standard drishti rules applied:
   *   All planets: 7th house aspect (180°)
   *   Mars:        4th (90°) and 8th (210°) special aspects
   *   Jupiter:     5th (120°) and 9th (240°) special aspects
   *   Saturn:      3rd (60°) and 10th (270°) special aspects
   *   Rahu/Ketu:   5th (120°), 7th (180°), 9th (240°) (Parashari convention)
   *
   * Malefics (per BPHS natural malefics): Sun (0), Mars (3), Saturn (6), Rahu (7), Ketu (8)
   * Benefics: Moon (1), Mercury (2), Jupiter (4), Venus (5)
   *
   * NOTE: The Moon's own sign placement already contributes to moonShadbala;
   * this counts only exogenous aspects from other planets.
   */
  aspectsOnMoon: {
    malefic: number;
    benefic: number;
  };

  /**
   * Moon Paksha Bala normalised to 0-100.
   *
   * BPHS formula: paksha_bala_rupas = elongation / 3  (0° elong → 0 rupas, 180° → 60 rupas)
   * Normalise: paksha_bala / 60 * 100
   * So: New Moon (0°) → 0, Full Moon (180°) → 100.
   *
   * Waning Moon (elongation > 180°): symmetrically decreases back toward 0
   * at the next New Moon.  Formula: abs_elongation = min(elong, 360 - elong)
   * then apply the same 0-60-rupas → 0-100 mapping.
   *
   * TODO (Phase E): wire real Sun/Moon longitudes from KundaliData to compute
   * elongation precisely.  Stub returns 50 (neutral / half-lit Moon) so that
   * moonPakshaBala-weighted elements are not artificially penalised during
   * Phase A-D testing.
   */
  moonPakshaBala: number;
}

/** Full output of collectStrengthInputs. */
export interface StrengthInputs {
  planets: Record<number, PlanetStrength>;  // keyed 0–8
  houses: Record<number, HouseStrength>;    // keyed 1–12
  derived: DerivedHealthSignals;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Derives the sign-lord planet ID for a given house number (1-12) using the
 * whole-sign house system.
 *
 * Algorithm:
 *   houseSign = (lagnaSign - 1 + houseNum - 1) % 12 + 1   (1-based, wraps at 12)
 *   lord      = SIGN_LORD[houseSign]
 *
 * KundaliData does NOT carry a houseLords map — we derive from lagna + offset.
 * Rahu (7) and Ketu (8) have no sign lordship in classical Jyotish and will
 * never be returned by this function.
 */
export function houseLordId(kundali: KundaliData, houseNum: number): number | undefined {
  const lagnaSign = kundali.ascendant.sign; // 1-12
  const houseSign = ((lagnaSign - 1 + houseNum - 1) % 12) + 1;
  return SIGN_LORD[houseSign]; // undefined when SIGN_LORD has no entry (e.g. corrupted sign value)
}

/** Map a dignity tier to a scalar multiplier for `overall` computation. */
function dignityMultiplier(tier: DignityTier): number {
  switch (tier) {
    case 'exalted':      return 1.40;
    case 'moolatrikona': return 1.25;
    case 'own':          return 1.20;
    case 'friend':       return 1.05;
    case 'neutral':      return 1.00;
    case 'enemy':        return 0.85;
    case 'debilitated':  return 0.65;
    default:             return 1.00; // unknown — neutral
  }
}

/** Derive DignityTier from PlanetPosition boolean flags. */
function deriveDignity(p: KundaliData['planets'][number]): DignityTier {
  if (p.isExalted)      return 'exalted';
  if (p.isOwnSign)      return 'own';
  if (p.isDebilitated)  return 'debilitated';
  // friend / moolatrikona / enemy — flags not directly on PlanetPosition type.
  // TODO: wire moolatrikona + friend/enemy flags when PlanetPosition type adds them.
  return 'neutral';
}

/**
 * Normalise a Shadbala strengthRatio to a 0–100 overall score, applying
 * dignity and Baladi modifiers so that downstream elements can simply weight
 * this single number rather than re-computing.
 *
 * Formula:
 *   base   = clamp(ratio * 50, 0, 80)   // ratio 0→0, 1.0→50, 2.0→80 (log-ish curve)
 *   base  *= dignityMultiplier          // ×0.65 (debil) … ×1.40 (exalted)
 *   base  += baladiBonus                // baladiStrength / 100 * 20  (max +20)
 *   base  -= combustPenalty             // –15 if combust (Vikala avastha, BPHS)
 *   overall = clamp(base, 0, 100)
 */
function normaliseShadbalaToOverall(
  shadbalaRatio: number,
  dignity: DignityTier,
  baladiStrength: number,
  isCombust: boolean,
): number {
  let base = Math.min(shadbalaRatio * 50, 80);
  base *= dignityMultiplier(dignity);
  base += (baladiStrength / 100) * 20;
  if (isCombust) base -= 15;
  return Math.round(Math.max(0, Math.min(100, base)));
}

// ─── Main collector ───────────────────────────────────────────────────────

/**
 * Collects and normalises all strength inputs from a KundaliData object.
 *
 * All optional KundaliData fields are accessed safely; missing data falls
 * back to neutral/zero defaults so downstream scorers never receive
 * undefined. Every fallback is accompanied by a TODO comment indicating
 * the upstream plumbing needed.
 */
export function collectStrengthInputs(kundali: KundaliData): StrengthInputs {
  const { planets, ascendant, fullShadbala, avasthas, bhavabala, vimshopakaBala, ashtakavarga, grahaYuddha } = kundali;

  // ── Index upstream data by planetId for O(1) lookup ──────────────────────

  // fullShadbala is optional on KundaliData; use strengthRatio when present.
  // TODO: wire kundali.fullShadbala when the calling route passes calculateFullShadbala().
  const shadMap = new Map<number, number>(); // planetId → strengthRatio
  for (const sb of fullShadbala ?? []) {
    shadMap.set(sb.planetId, sb.strengthRatio ?? 0);
  }

  // avasthas — Baladi strength (0–100 per state).
  // TODO: wire kundali.avasthas when the calling route passes calculateAvasthas().
  const baladiMap = new Map<number, number>(); // planetId → baladiStrength
  for (const av of avasthas ?? []) {
    baladiMap.set(av.planetId, av.baladi.strength ?? 0);
  }

  // bhavabala — house strength percent.
  // TODO: wire kundali.bhavabala when the calling route passes calculateBhavaBala().
  const bhavaMap = new Map<number, number>(); // houseNum → strengthPercent
  for (const b of bhavabala ?? []) {
    bhavaMap.set(b.bhava, b.strengthPercent ?? 0);
  }

  // vimshopakaBala — total on 0-20 scale, normalise to 0-100.
  // TODO: wire kundali.vimshopakaBala when the calling route passes calculateVimshopakaBala().
  const vimsoMap = new Map<number, number>(); // planetId → 0-100
  for (const v of vimshopakaBala ?? []) {
    vimsoMap.set(v.planetId, Math.round((v.total / 20) * 100));
  }

  // grahaYuddha — winners and losers.
  // TODO: wire kundali.grahaYuddha when the calling route passes calculateGrahaYuddha().
  const yuddhaMap = new Map<number, boolean>(); // planetId → true=winner, false=loser
  for (const gy of grahaYuddha ?? []) {
    yuddhaMap.set(gy.winnerId, true);
    yuddhaMap.set(gy.loserId, false);
  }

  // ashtakavarga bpiTable — raw 7×12 (planet index 0-6 × house 0-11).
  // Rahu (7) and Ketu (8) do not contribute bindus in Bhinnashtakavarga.
  // Planet index in bpiTable follows the engine's order: 0=Sun…6=Saturn.
  // TODO: confirm bpiTable planet index order matches 0=Sun..6=Saturn in
  //       src/lib/kundali/ashtakavarga-*.ts when wiring full ashtakavarga.
  const bpiTable = ashtakavarga?.bpiTable ?? [];

  // ── Build per-planet strength objects ────────────────────────────────────

  const planetStrengths: Record<number, PlanetStrength> = {};

  for (const p of planets) {
    const pid = p.planet.id; // 0-8

    const shadbalaRatio = shadMap.get(pid) ?? 0;
    const dignity = deriveDignity(p);
    const baladiStrength = baladiMap.get(pid) ?? 50;
    // 50 = neutral Yuva mid-point when avasthas not yet wired.
    // NOTE: contributes +10 to base via normaliseShadbalaToOverall.
    // Stub charts therefore show slight planet inflation — acceptable for
    // Phase A-D testing; revisit before Phase E go-live to verify all
    // `kundali.avasthas` populations are non-empty in production paths.
    const isCombust = p.isCombust;
    const isRetrograde = p.isRetrograde;

    // isVargottama is optional on PlanetPosition (added in a later engine pass).
    // TODO: wire PlanetPosition.isVargottama when sphutas pass sets it.
    const vargottama = p.isVargottama ?? false;

    const vimsopaka = vimsoMap.get(pid) ?? 0;
    // TODO: wire ashtakavargaBindus per-planet once bpiTable planet-index order is confirmed.
    // bpiTable[pid][houseIdx] gives raw bindus; pid only valid 0-6 (Sun-Saturn).
    const houseIdx = (p.house - 1); // 0-based
    const ashtakavargaBindus: number =
      pid <= 6 && bpiTable[pid] != null
        ? (bpiTable[pid][houseIdx] ?? 0)
        : 0;

    // grahaYuddhaWinner: true=winner, false=loser, null=not in war.
    const yuddha = yuddhaMap.get(pid);
    const grahaYuddhaWinner: boolean | null = yuddha !== undefined ? yuddha : null;

    const overall = normaliseShadbalaToOverall(shadbalaRatio, dignity, baladiStrength, isCombust);

    planetStrengths[pid] = {
      overall,
      shadbalaRatio,
      dignity,
      baladiStrength,
      isCombust,
      isRetrograde,
      vargottama,
      vimsopaka,
      ashtakavargaBindus,
      grahaYuddhaWinner,
    };
  }

  // ── Build per-house strength objects ─────────────────────────────────────

  // Build occupants map: houseNum → [planetIds]
  const occupantsMap = new Map<number, number[]>();
  for (let h = 1; h <= 12; h++) occupantsMap.set(h, []);
  for (const p of planets) {
    const list = occupantsMap.get(p.house);
    if (list) list.push(p.planet.id);
  }

  const houseStrengths: Record<number, HouseStrength> = {};

  for (let h = 1; h <= 12; h++) {
    // BhavaBalaResult.strengthPercent is normalised against the 12-house average,
    // so values >100 are valid (above-average house). Clamp to [0, 100] for the
    // uniform 0-100 range the spec requires for all strength axes.
    const rawBhavabala = bhavaMap.get(h) ?? 0;
    const bhavabalaScore = Math.min(100, Math.max(0, rawBhavabala));

    const lordId = houseLordId(kundali, h);
    // ownerStrength: look up the lord's overall score we just built.
    // lordId is undefined when SIGN_LORD lookup fails (e.g. corrupted lagna sign) —
    // treat as 0 rather than 50 so that broken input is visibly weak, not neutral.
    const ownerStrength = lordId !== undefined ? (planetStrengths[lordId]?.overall ?? 0) : 0;

    houseStrengths[h] = {
      bhavabala: bhavabalaScore,
      occupants: occupantsMap.get(h) ?? [],
      ownerStrength,
    };
  }

  // ── Build derived health signals ─────────────────────────────────────────
  // Planet IDs: Rahu=7, Ketu=8 (0-based, per KundaliData convention).
  const RAHU_ID = 7;
  const KETU_ID = 8;

  const rahuPlanet = planets.find(p => p.planet.id === RAHU_ID);
  const ketuPlanet = planets.find(p => p.planet.id === KETU_ID);

  const rahuHouse: number | undefined = rahuPlanet?.house;
  const ketuHouse: number | undefined = ketuPlanet?.house;

  /**
   * Placement score helper.
   * 100 — lagna (house 1): strongest bodily influence
   *  80 — dusthana (6/8/12): malefic gains in harmful houses → elevated risk
   *  40 — kendra (4/7/10): prominent but moderate
   *  50 — all other houses: neutral baseline
   *
   * NOTE: house 1 is both kendra AND lagna; lagna case is checked first.
   */
  function placementScore(house: number | undefined): number {
    if (house === undefined) return 0;
    if (house === 1)                       return 100;
    if ([6, 8, 12].includes(house))        return 80;
    if ([4, 7, 10].includes(house))        return 40;
    return 50;
  }

  const rahuPlacementScore = placementScore(rahuHouse);
  const ketuPlacementScore = placementScore(ketuHouse);

  /**
   * Aspects-on-Moon computation.
   *
   * For each planet (excluding Moon itself), compute which houses it casts
   * drishti on using Parashari rules, then check if Moon's house is in that
   * set.  Split results by natural malefic (Sun/Mars/Saturn/Rahu/Ketu) vs
   * benefic (Mercury/Jupiter/Venus; Moon excluded as self-aspect).
   *
   * Standard aspects:
   *   All planets: 7th from their position (180°)
   *   Mars:        also 4th (90°) and 8th (210°)
   *   Jupiter:     also 5th (120°) and 9th (240°)
   *   Saturn:      also 3rd (60°) and 10th (270°)
   *   Rahu/Ketu:   also 5th, 9th (Parashari convention)
   *
   * House arithmetic: target = (source - 1 + offset - 1) % 12 + 1  (1-based)
   */
  const MOON_ID = 1;
  const moonHouse: number | undefined = planets.find(p => p.planet.id === MOON_ID)?.house;

  // Natural malefics (BPHS Ch.3): Sun, Mars, Saturn, Rahu, Ketu
  const NATURAL_MALEFICS = new Set([0, 3, 6, 7, 8]);

  let maleficAspectsOnMoon = 0;
  let beneficAspectsOnMoon = 0;

  if (moonHouse !== undefined) {
    for (const p of planets) {
      const pid = p.planet.id;
      if (pid === MOON_ID) continue; // skip Moon itself

      // Build set of houses this planet aspects (1-based).
      const sourceHouse = p.house;
      // Helper: nth-house offset from sourceHouse (1-based, wraps 1-12)
      const nthHouse = (n: number) => ((sourceHouse - 1 + n - 1) % 12) + 1;

      const aspectedHouses = new Set<number>();
      aspectedHouses.add(nthHouse(7)); // universal 7th aspect

      if (pid === 3) { // Mars
        aspectedHouses.add(nthHouse(4));
        aspectedHouses.add(nthHouse(8));
      } else if (pid === 4) { // Jupiter
        aspectedHouses.add(nthHouse(5));
        aspectedHouses.add(nthHouse(9));
      } else if (pid === 6) { // Saturn
        aspectedHouses.add(nthHouse(3));
        aspectedHouses.add(nthHouse(10));
      } else if (pid === RAHU_ID || pid === KETU_ID) { // Rahu / Ketu
        aspectedHouses.add(nthHouse(5));
        aspectedHouses.add(nthHouse(9));
      }

      if (aspectedHouses.has(moonHouse)) {
        if (NATURAL_MALEFICS.has(pid)) {
          maleficAspectsOnMoon++;
        } else {
          beneficAspectsOnMoon++;
        }
      }
    }
  }
  // If moonHouse is undefined (corrupted chart), both counts stay 0 — safe default.

  /**
   * Moon Paksha Bala (0-100).
   *
   * BPHS formula: paksha_bala_rupas = elongation_degrees / 3
   * (0° New Moon → 0 rupas, 180° Full Moon → 60 rupas)
   * Normalised: rupas / 60 * 100 → 0-100 scale.
   *
   * Elongation = Moon longitude − Sun longitude (mod 360°).
   * Values 0°-180° = waxing (paksha bala 0→100).
   * Values 180°-360° = waning (paksha bala 100→0, symmetrically).
   * Absolute elongation = min(elong, 360 - elong), range 0-180°.
   *
   * TODO (Phase E): KundaliData currently does not expose raw Sun/Moon
   * ecliptic longitudes at a stable path.  When the engine adds
   * `kundali.sunLongitude` and `kundali.moonLongitude` (or similar), replace
   * the stub with:
   *   const elong = ((moonLng - sunLng) % 360 + 360) % 360;
   *   const absElong = Math.min(elong, 360 - elong);
   *   moonPakshaBala = Math.round((absElong / 180) * 100);
   *
   * Stub: 50 (half-lit Moon, neutral) — avoids artificially penalising
   * moonPakshaBala-weighted elements (4.2 mental, 4.19 sleep) during
   * Phase A-D testing.
   */
  // TODO (Phase E): replace stub with real elongation computation (see above).
  const moonPakshaBala = 50;

  const derived: DerivedHealthSignals = {
    rahuHouse,
    ketuHouse,
    rahuPlacementScore,
    ketuPlacementScore,
    aspectsOnMoon: { malefic: maleficAspectsOnMoon, benefic: beneficAspectsOnMoon },
    moonPakshaBala,
  };

  return { planets: planetStrengths, houses: houseStrengths, derived };
}
