/**
 * Per-pair deep content for /matching/[pair] — 78 unique unordered
 * rashi pairs (12 × 12 with 1-2 ↔ 2-1 deduplicated).
 *
 * Background: the canonical rashi-compatibility.ts ships 6 fields per
 * pair (temperament / communication / romance / career / challenges /
 * remedies) that are TEMPLATED from 3 underlying dimensions (element,
 * lord-relationship, house-distance). All 78 pairs share the same
 * ~10-20 underlying templates with only the names swapped — the same
 * duplicate-template antipattern the 2026-06-09 thin-content audit
 * flagged for /baby-names (#619), /devotional/* (#620, #628), and
 * /learn/nakshatra-pada (the in-flight rescue).
 *
 * This file adds 4 PER-PAIR unique narrative fields, distinguishing
 * each pair's character from the other 77:
 *
 *  - mythologicalDynamic    — how the deities / archetypes of the two
 *    rashis interact in puranic narrative (~80-120 words).
 *  - deepCompatibilityNotes — classical kuta + nadi + gana
 *    analysis specific to this pair, beyond the templated element
 *    dynamic (~80-120 words).
 *  - careerBondInsight      — how they collaborate in professional /
 *    creative partnerships, citing the lordship combination
 *    (~60-100 words).
 *  - growthPath             — the karmic-growth arc this pair
 *    catalyses in each native (~60-100 words).
 *
 * Key shape: "<lowerRashiId>-<higherRashiId>", e.g. "1-5" for
 * Mesh (1) + Simha (5). Always normalised lower-first so that the
 * 78 unique unordered pairs each have a single canonical key.
 *
 * Source: scripts/generate-rashi-pair-deep-content-via-gemini.py
 * (Vertex AI Gemini 2.5 Flash). Other 8 locales arrive via overlay
 * layer in rashi-pair-deep-content-with-overlay.ts.
 */
import data from './rashi-pair-deep-content.json';

export interface RashiPairDeepContent {
  mythologicalDynamic: { en: string };
  deepCompatibilityNotes: { en: string };
  careerBondInsight: { en: string };
  growthPath: { en: string };
}

const PAIR_DEEP_CONTENT = data as Record<string, RashiPairDeepContent>;

/**
 * Look up the per-pair deep content. Always normalises (r1, r2) so
 * the caller can pass any ordering and get a hit if the canonical
 * key exists.
 */
export function getRashiPairDeepContent(
  r1: number, r2: number,
): RashiPairDeepContent | undefined {
  if (!Number.isInteger(r1) || r1 < 1 || r1 > 12) return undefined;
  if (!Number.isInteger(r2) || r2 < 1 || r2 > 12) return undefined;
  const lo = Math.min(r1, r2);
  const hi = Math.max(r1, r2);
  return PAIR_DEEP_CONTENT[`${lo}-${hi}`];
}
