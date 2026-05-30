/**
 * Shared utility functions for yoga engine rule files.
 *
 * Centralises helpers that were previously duplicated across
 * chandra.ts, surya.ts, and dhana.ts (Lesson Q: constants/helpers in one place).
 */

import type { YogaContext } from './types';
// Canonical benefic IDs — single source of truth in
// src/lib/constants/benefic-malefic.ts (BPHS Ch.3). Re-exported below as
// NATURAL_BENEFIC_IDS for backward compatibility with downstream rule files
// that already import the array.
import { NATURAL_BENEFIC_IDS_UNCONDITIONAL } from '@/lib/constants/benefic-malefic';

/**
 * Get the house that is N houses from a reference house.
 * Uses 1-based forward counting: offset 1 = same house, offset 2 = next house, etc.
 */
export function houseFrom(refHouse: number, offset: number): number {
  return ((refHouse - 1 + offset - 1) % 12) + 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// House classification constants (shared across rule files — Lesson Q)
// ─────────────────────────────────────────────────────────────────────────────

export const KENDRA_HOUSES = [1, 4, 7, 10];
export const TRIKONA_HOUSES = [1, 5, 9];
export const DUSTHANA_HOUSES = [6, 8, 12];
export const UPACHAYA_HOUSES = [3, 6, 10, 11];

/** Natural benefic planet IDs: Moon(1), Mercury(3), Jupiter(4), Venus(5).
 *  Re-exported from the canonical benefic-malefic module to keep call sites
 *  in yoga-engine/rules/*.ts working unchanged while consolidating the
 *  underlying data. Materialised as an array because existing callers use
 *  Array.includes. */
export const NATURAL_BENEFIC_IDS: ReadonlyArray<number> = Array.from(NATURAL_BENEFIC_IDS_UNCONDITIONAL);

// ─────────────────────────────────────────────────────────────────────────────
// Eligible planet helpers for neighbourhood yogas (shared by chandra.ts & surya.ts)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Planet IDs eligible for Moon/Sun neighbourhood yogas.
 * Per Phaladeepika Ch.6: Mars (2), Mercury (3), Jupiter (4), Venus (5), Saturn (6).
 * Sun, Moon, Rahu, Ketu are excluded.
 */
export const ELIGIBLE_PLANET_IDS = [2, 3, 4, 5, 6];

/**
 * Get eligible planet IDs in a specific house.
 * Filters to ELIGIBLE_PLANET_IDS (excludes Sun, Moon, Rahu, Ketu).
 */
export function eligiblePlanetsInHouse(ctx: YogaContext, house: number): number[] {
  return ctx.planetsInHouse(house).filter(id => ELIGIBLE_PLANET_IDS.includes(id));
}
