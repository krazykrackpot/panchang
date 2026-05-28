// src/lib/kundali/health-diagnosis/elements/pinda-ayurdaya.ts
//
// Pinda Ayurdaya computation per BPHS Ch. Ayur.
//
// Each planet (Sun through Saturn, IDs 0-6) contributes a number of
// "life-years" based on its base allocation, dignity, retrograde status,
// combustion status, and house placement.
//
// Classical method (BPHS-Ayur):
//   contribution = base_years
//                × dignity_factor
//                × retrograde_factor   (×2 if retrograde)
//                × combust_factor      (×0.5 if combust, except Sun itself)
//                × dusthana_factor     (×0.5 if in house 6, 8, or 12)
//
// Pinda Ayurdaya = Σ contributions for planets 0-6.
// Rahu (7) and Ketu (8) are excluded — they have no Pinda Ayurdaya allocation
// in classical BPHS (they are shadow planets, not grahas with base years).
//
// The final years value is rounded to the nearest integer.  Typical range
// for a functional chart: 25-150 years, with most charts falling in 40-100.
// The theoretical maximum (all planets retrograde + exalted) is ~254 years.
//
// Longevity classification per BPHS-Ayur:
//   Alpa  (short):  < 32 years
//   Madhya (middle): 32-70 years
//   Purna  (long):  >= 70 years

import type { KundaliData } from '@/types/kundali';
import type { StrengthInputs } from '../strength-inputs';
import { PLANET_IDS } from '@/lib/constants/grahas';

// ─── Base years per planet (BPHS Ch. Ayur table) ─────────────────────────────
// Applies to Sun(0) through Saturn(6).  Rahu(7) and Ketu(8) have no base years.
const PLANET_BASE_YEARS: Record<number, number> = {
  0: 19, // Sun    — Surya, Naisargika Ayur karaka
  1: 25, // Moon   — Chandra
  2: 15, // Mars   — Mangala
  3: 12, // Mercury — Budha
  4: 15, // Jupiter — Guru
  5: 21, // Venus  — Shukra
  6: 20, // Saturn — Shani, Ayur karaka
};

// Dusthana houses: 6 (disease), 8 (longevity/death), 12 (loss/liberation)
const DUSTHANA = new Set([6, 8, 12]);

// ─── Dignity factor ───────────────────────────────────────────────────────────

/**
 * Maps a dignity tier to the Pinda Ayurdaya scaling factor per BPHS:
 *   Exalted / Own sign / Moolatrikona → full years (×1.0)
 *   Friend's sign                      → ×0.75
 *   Neutral sign                        → ×0.5
 *   Enemy's sign                        → ×0.5
 *   Debilitated                         → ×0.25
 *   Unknown / default                   → neutral (×0.5)
 */
function dignityFactor(dignity: StrengthInputs['planets'][number]['dignity']): number {
  switch (dignity) {
    case 'exalted':      return 1.0;
    case 'moolatrikona': return 1.0;
    case 'own':          return 1.0;
    case 'friend':       return 0.75;
    case 'neutral':      return 0.5;
    case 'enemy':        return 0.5;
    case 'debilitated':  return 0.25;
    default:             return 0.5;  // unknown — treat as neutral
  }
}

// ─── Public types ─────────────────────────────────────────────────────────────

/** Longevity classification per BPHS-Ayur. */
export type LongevityClassification = 'alpa' | 'madhya' | 'purna';

// ─── Core computation ─────────────────────────────────────────────────────────

/**
 * Computes Pinda Ayurdaya in years per BPHS Ch. Ayur.
 *
 * Iterates over planets 0-6 (Sun through Saturn).  Rahu and Ketu are excluded
 * as they have no Pinda Ayurdaya base allocation in classical Jyotish.
 *
 * Modification factors applied in order:
 *   1. Dignity factor          [0.25, 1.0]    from StrengthInputs.planets[id].dignity
 *   2. Retrograde multiplier   ×2.0 if retrograde (BPHS Ch. Ayur: retrograde planet
 *                               doubles its life-grant because it is "closer" to Earth)
 *   3. Combust multiplier      ×0.5 if combust and not Sun (vikala avastha reduces
 *                               the planet's capacity to grant years)
 *   4. Dusthana multiplier     ×0.5 if in house 6, 8, or 12 (malefic placement
 *                               reduces the longevity grant)
 *
 * Returns the sum, rounded to the nearest integer.
 * Typical range: 25-150.  Theoretical ceiling: ~254 (all exalted + retrograde).
 *
 * @param kundali  The fully computed KundaliData.
 * @param strength Pre-built StrengthInputs from collectStrengthInputs().
 * @returns        Pinda Ayurdaya in years (positive integer).
 */
export function computePindaAyurdaya(kundali: KundaliData, strength: StrengthInputs): number {
  let total = 0;

  for (let pid = 0; pid <= 6; pid++) {
    const base = PLANET_BASE_YEARS[pid];
    const ps = strength.planets[pid];
    if (!ps) continue; // planet absent from strength inputs — skip safely

    // Find the planet's house from KundaliData for dusthana check
    const planetPos = kundali.planets.find(x => x.planet.id === pid);
    if (!planetPos) continue;

    let years = base * dignityFactor(ps.dignity);

    // Retrograde: planet doubles its life-grant (BPHS Ch. Ayur — closer to Earth,
    // stronger benefic influence on longevity).
    if (ps.isRetrograde) years *= 2.0;

    // Combust: planet is consumed by the Sun and loses its capacity to grant years.
    // Sun itself cannot be combust (it IS the burning agent), so Sun is skipped.
    if (ps.isCombust && pid !== PLANET_IDS.SUN) years *= 0.5;

    // Dusthana placement: houses 6/8/12 reduce the longevity grant by half.
    if (DUSTHANA.has(planetPos.house)) years *= 0.5;

    total += years;
  }

  return Math.round(total);
}

/**
 * Maps a Pinda Ayurdaya years value to the BPHS longevity classification.
 *
 * Thresholds per BPHS-Ayur:
 *   Alpa  (short life):   < 32 years
 *   Madhya (middle life): 32-69 years
 *   Purna  (full life):  >= 70 years
 */
export function classifyLongevity(years: number): LongevityClassification {
  if (years < 32) return 'alpa';
  if (years < 70) return 'madhya';
  return 'purna';
}
