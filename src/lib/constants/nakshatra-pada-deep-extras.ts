/**
 * Four additional per-pada prose fields — mythologicalContext,
 * strengthsWeaknesses, partnerCompatibility, classicalReference —
 * for all 108 nakshatra-padas (27 × 4).
 *
 * Background: even after PR #555 promoted /learn/nakshatra-pada/ to
 * 9-locale indexability and the original `nakshatra-pada-extras` data
 * (spiritualPractice + decisions) landed, the per-page visible word
 * count was still ~260w (templated shell + 6 short fields). The
 * 2026-06-09 thin-content audit flagged the cluster as a duplicate-
 * template antipattern risk — same shell repeated across 108 pages
 * with only the nakshatra/pada name swapped.
 *
 * This PR adds 4 deeper narrative fields per pada (~80-120 words each
 * EN), distinguishing every page's content from its siblings:
 *
 *  - mythologicalContext   — puranic / vedic backstory of the deity
 *    + nakshatra + pada combination (e.g. Ashwini Pada 1's Aries-
 *    Navamsha Mars-ruled tempo + the Ashwini Kumaras' horse-racing
 *    healing motif).
 *  - strengthsWeaknesses   — flowing prose pairing 3-4 strengths with
 *    3-4 corresponding shadows / weaknesses. NOT a list — a paragraph.
 *  - partnerCompatibility  — what nakshatra/pada combinations make
 *    natural partners for this one, grounded in the navamsha-rashi +
 *    element + pada-ruler dynamics.
 *  - classicalReference    — a short paraphrase of what BPHS,
 *    Brihat Samhita, or Phaladeepika say about this nakshatra
 *    (sometimes the pada specifically), with the source named.
 *
 * Source: `scripts/generate-nakshatra-pada-deep-extras-via-gemini.py`
 * (Vertex AI Gemini 2.5 Flash) for en. The other 8 locales (hi + 7
 * regional Indic) arrive via overlay layer in
 * `nakshatra-pada-deep-extras-with-overlay.ts`. Consumers MUST import
 * from the overlay file — the bare file ships en only.
 *
 * Key shape: "<nakshatraId>-<pada>", e.g. "1-1" through "27-4".
 */
import data from './nakshatra-pada-deep-extras.json';

export interface NakshatraPadaDeepExtras {
  mythologicalContext: { en: string };
  strengthsWeaknesses: { en: string };
  partnerCompatibility: { en: string };
  classicalReference: { en: string };
}

const PADA_DEEP_EXTRAS = data as Record<string, NakshatraPadaDeepExtras>;

export function getNakshatraPadaDeepExtras(
  nakshatraId: number,
  pada: number,
): NakshatraPadaDeepExtras | undefined {
  if (!Number.isInteger(nakshatraId) || nakshatraId < 1 || nakshatraId > 27) return undefined;
  if (!Number.isInteger(pada) || pada < 1 || pada > 4) return undefined;
  return PADA_DEEP_EXTRAS[`${nakshatraId}-${pada}`];
}
