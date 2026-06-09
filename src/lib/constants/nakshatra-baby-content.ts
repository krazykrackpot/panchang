/**
 * Per-nakshatra unique enrichment content for /baby-names/[nakshatra]
 * detail pages. Built to break the May 2026 "duplicate-template anti-
 * pattern" — all 27 nakshatra detail pages previously rendered the
 * same 284-word shell with only the nakshatra name substituted, which
 * Google's canonical-consolidation algorithm correctly identified as
 * near-duplicate content and folded into the single-canonical bucket.
 *
 * Each nakshatra now ships 6 unique narrative sections (~300-400 words
 * of original content per slug), distinguishing every page in the
 * eyes of search and AI ingest.
 *
 * Structure mirrors the yoga-expansions overlay scheme: EN authored,
 * regional locales attached via per-locale overlay JSONs at module
 * init by `nakshatra-baby-content-with-overlay.ts`.
 *
 * The data here is the source-of-truth EN copy; locale overlays only
 * carry translated values keyed by `<slug>.<field>(.<idx>)?`.
 */

import type { LocaleText } from '@/types/panchang';

export interface NakshatraBabyContent {
  /** 80-120 word story of the nakshatra's presiding deity (Yama for
   *  Bharani, Ashwini Kumaras for Ashwini, etc.) anchoring why the
   *  nakshatra carries the energy it does. */
  deityLegend: LocaleText;
  /** 50-80 words on what the nakshatra's symbol represents and what
   *  qualitative energy it confers on natives (horse head = speed/
   *  healing, vulva = creation/nourishment, mortar+pestle = grinding
   *  effort, etc.). */
  symbolMeaning: LocaleText;
  /** 4-5 short bullet points of common personality traits or
   *  tendencies observed in natives born under this nakshatra. */
  personalityTraits: LocaleText[];
  /** 40-60 words on what categories of name-meanings work well for
   *  this nakshatra's children, anchored in the nakshatra's nature
   *  + symbol + deity. */
  nameThemes: LocaleText;
  /** 30-40 words noting 1-3 famous people born under this nakshatra,
   *  drawn from public birth-data records. May be empty when no
   *  well-attested records exist. */
  famousBearers?: LocaleText;
  /** 40-60 words on naming traditions or recommendations specific to
   *  this nakshatra — gender preferences, sound qualities to favour,
   *  syllable-position observations. */
  namingTradition: LocaleText;
}

// EN-authored source. Regional locales attach at module-load by
// nakshatra-baby-content-with-overlay.ts using per-locale overlay
// JSON files. EN fields are required; HI defaults to EN inside the
// overlay layer so a missing HI overlay key gracefully renders EN.
//
// Generation: scripts/generate-nakshatra-baby-content-via-gemini.py
// invokes Vertex AI Gemini 2.5 Flash with each nakshatra's canonical
// record (name, deity, ruler, symbol, nature, degree range) as
// grounding context.
export const NAKSHATRA_BABY_CONTENT: Record<number, NakshatraBabyContent> = {};
