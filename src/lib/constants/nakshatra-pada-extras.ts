/**
 * Two additional per-pada prose fields — spiritualPractice and decisions —
 * each ~30-40 words in en + hi for all 108 nakshatra-padas (27 × 4).
 * Rendered as supplementary cards on /learn/nakshatra-pada/<slug>, on
 * top of the four legacy fields (personality / career / relationships /
 * health) already on `NAKSHATRA_PADA_PROFILES`.
 *
 * Background: the legacy profiles totalled ~100-120 body words per page
 * (4 fields × ~25-30 words). Bordered on thin SEO content; adding these
 * two fields lands each page in the safe ~160-200 word range. See
 * `docs/specs/2026-06-08-seo-audit-followups.md` item #3.
 *
 * Source: `scripts/generate-nakshatra-pada-extras.py` (Gemini 2.5 Flash on
 * Vertex AI). The /learn/nakshatra-pada/* prefix is en+hi indexable per
 * `INDEXABLE_BY_PREFIX['/learn/']` — no need to translate the other 7.
 *
 * Key shape: "<nakshatraId>-<pada>", e.g. "1-1" through "27-4".
 */
import data from './nakshatra-pada-extras.json';

export interface NakshatraPadaExtras {
  spiritualPractice: { en: string; hi: string };
  decisions: { en: string; hi: string };
}

const PADA_EXTRAS = data as Record<string, NakshatraPadaExtras>;

export function getNakshatraPadaExtras(
  nakshatraId: number,
  pada: number,
): NakshatraPadaExtras | undefined {
  if (!Number.isInteger(nakshatraId) || nakshatraId < 1 || nakshatraId > 27) return undefined;
  if (!Number.isInteger(pada) || pada < 1 || pada > 4) return undefined;
  return PADA_EXTRAS[`${nakshatraId}-${pada}`];
}
