/**
 * Canonical benefic / malefic classification for the 9 grahas — BPHS Ch.3.
 *
 * Single source of truth replacing three duplicate definitions that existed
 * across the codebase:
 *   - src/lib/kundali/avasthas.ts (NATURAL_MALEFIC_IDS + Mercury conditional)
 *   - src/lib/kundali/yogas-complete.ts (BENEFICS + MALEFICS arrays)
 *   - src/lib/kundali/yoga-engine/utils.ts (NATURAL_BENEFIC_IDS array)
 *
 * BPHS Ch.3:
 *   - Always benefic: Moon (1), Jupiter (4), Venus (5)
 *   - Always malefic: Sun (0), Mars (2), Saturn (6), Rahu (7), Ketu (8)
 *   - Mercury (3) is conditional — benefic by default; malefic when conjunct
 *     (same rashi as) any natural malefic. Use isMercuryBenefic / the
 *     context-aware helpers below to apply the conditional; the unconditional
 *     legacy sets are kept for the many yoga-rule call sites that need the
 *     simpler classification.
 *
 * Spec: docs/superpowers/specs/2026-05-30-jyotish-classical-alignment.md §5
 * (the consolidation follow-up from PR #291).
 */

/** Planets that are unconditionally natural malefics. */
export const NATURAL_MALEFIC_IDS: ReadonlySet<number> = new Set([0, 2, 6, 7, 8]);

/** Planets that are unconditionally natural benefics. Excludes Mercury. */
export const NATURAL_BENEFIC_BASE_IDS: ReadonlySet<number> = new Set([1, 4, 5]);

/** Legacy unconditional benefic set treating Mercury as always benefic.
 *  Use for yoga rules that pre-date the conditional logic and need
 *  byte-identical behaviour; prefer isNaturalBenefic(id, ctx) for new code. */
export const NATURAL_BENEFIC_IDS_UNCONDITIONAL: ReadonlySet<number> = new Set([1, 3, 4, 5]);

/** Minimal chart context for the Mercury-conditional check. Keyed by house
 *  number (1-12) → set of planet IDs in that house. Pass to the
 *  context-aware helpers below. */
export interface BeneficMaleficContext {
  housePlanets: ReadonlyMap<number, ReadonlySet<number>>;
}

/** Build a context from any list of planets with `{ planet: { id }, house }` shape. */
export function buildBeneficMaleficContext(
  planets: ReadonlyArray<{ planet: { id: number }; house: number }>,
): BeneficMaleficContext {
  const housePlanets = new Map<number, Set<number>>();
  for (const p of planets) {
    let set = housePlanets.get(p.house);
    if (!set) {
      set = new Set();
      housePlanets.set(p.house, set);
    }
    set.add(p.planet.id);
  }
  return { housePlanets };
}

/** Per BPHS Ch.3: Mercury is benefic UNLESS conjunct (same house) any natural
 *  malefic (Sun/Mars/Saturn/Rahu/Ketu). Returns true when Mercury stays benefic. */
export function isMercuryBenefic(ctx: BeneficMaleficContext): boolean {
  for (const [, ids] of ctx.housePlanets) {
    if (!ids.has(3)) continue;
    for (const other of ids) {
      if (other !== 3 && NATURAL_MALEFIC_IDS.has(other)) return false;
    }
    return true;
  }
  return true; // defensive — every chart has Mercury but never throw
}

/** Is the planet a natural benefic? With `ctx` Mercury is conditionally
 *  classified; without `ctx` Mercury is treated as always benefic. */
export function isNaturalBenefic(planetId: number, ctx?: BeneficMaleficContext): boolean {
  if (NATURAL_BENEFIC_BASE_IDS.has(planetId)) return true;
  if (planetId === 3) return ctx ? isMercuryBenefic(ctx) : true;
  return false;
}

/** Is the planet a natural malefic? With `ctx` Mercury is conditionally
 *  classified; without `ctx` Mercury is treated as always benefic
 *  (so this returns false for Mercury). */
export function isNaturalMalefic(planetId: number, ctx?: BeneficMaleficContext): boolean {
  if (NATURAL_MALEFIC_IDS.has(planetId)) return true;
  if (planetId === 3) return ctx ? !isMercuryBenefic(ctx) : false;
  return false;
}
