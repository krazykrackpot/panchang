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
import { SIGN_LORD } from '@/lib/medical/constants';

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

/** Full output of collectStrengthInputs. */
export interface StrengthInputs {
  planets: Record<number, PlanetStrength>;  // keyed 0–8
  houses: Record<number, HouseStrength>;    // keyed 1–12
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
export function houseLordId(kundali: KundaliData, houseNum: number): number {
  const lagnaSign = kundali.ascendant.sign; // 1-12
  const houseSign = ((lagnaSign - 1 + houseNum - 1) % 12) + 1;
  return SIGN_LORD[houseSign] ?? 0; // 0=Sun is a safe fallback; should never hit
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
    const baladiStrength = baladiMap.get(pid) ?? 50; // 50 = neutral when absent
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
    // If the lord planet wasn't found (shouldn't happen in a valid kundali),
    // default to 50 (neutral).
    const ownerStrength = planetStrengths[lordId]?.overall ?? 50;

    houseStrengths[h] = {
      bhavabala: bhavabalaScore,
      occupants: occupantsMap.get(h) ?? [],
      ownerStrength,
    };
  }

  return { planets: planetStrengths, houses: houseStrengths };
}
