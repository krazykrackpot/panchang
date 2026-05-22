/**
 * Shared types for the Brihaspati AI Astrologer.
 *
 * Source of truth for the contract between frontend, API routes,
 * classifier (Layer 2), narration (Layer 3), and validator (Layer 4).
 *
 * Keep this file free of runtime dependencies — it must remain importable
 * from both client and server contexts.
 */

/** Locales for which Brihaspati narration is authored at launch. */
export const BRIHASPATI_LAUNCH_LOCALES = ['en', 'hi', 'ta', 'bn'] as const;
export type BrihaspatiLaunchLocale = (typeof BRIHASPATI_LAUNCH_LOCALES)[number];

/**
 * Other supported locales render the panel UI in their language but the
 * answer prose falls back to EN (per spec). Listed here so the DB CHECK and
 * the runtime stay in sync.
 */
export const BRIHASPATI_FALLBACK_LOCALES = ['sa', 'te', 'kn', 'mr', 'gu', 'mai'] as const;
export type BrihaspatiFallbackLocale = (typeof BRIHASPATI_FALLBACK_LOCALES)[number];

export type BrihaspatiLocale = BrihaspatiLaunchLocale | BrihaspatiFallbackLocale;

/**
 * Twelve query categories from PLAN.md §3 — they map deterministically to
 * the engine set used to build the LLM context (Layer 2 routing).
 */
export const BRIHASPATI_CATEGORIES = [
  'career',
  'marriage',
  'health',
  'finance',
  'children',
  'education',
  'dasha',
  'remedies',
  'compatibility',
  'timing',
  'transit',
  'general',
] as const;
export type BrihaspatiCategory = (typeof BRIHASPATI_CATEGORIES)[number];

/** Pricing tiers offered at launch. */
export const BRIHASPATI_PRICING_TIERS = ['single', 'pack_5', 'monthly', 'annual'] as const;
export type BrihaspatiPricingTier = (typeof BRIHASPATI_PRICING_TIERS)[number];

/** Payment providers + non-payment grant sources. */
export const BRIHASPATI_PROVIDERS = ['razorpay', 'stripe', 'credit', 'subscription'] as const;
export type BrihaspatiProvider = (typeof BRIHASPATI_PROVIDERS)[number];

/** Inference-tier identifiers used in the DB and telemetry. */
export const BRIHASPATI_TIERS = {
  TEMPLATE: 0,
  SELF_HOSTED: 1,
  CLAUDE_API: 2,
} as const;
export type BrihaspatiTier = (typeof BRIHASPATI_TIERS)[keyof typeof BRIHASPATI_TIERS];

/** Lifecycle states for a question row. */
export const BRIHASPATI_STATUSES = ['pending', 'streaming', 'completed', 'failed'] as const;
export type BrihaspatiStatus = (typeof BRIHASPATI_STATUSES)[number];

/**
 * Result of Layer-2 classification.
 *
 * `confidence` is the normalised score (0..1) of the top category. Low
 * confidence answers should fall through to `general`.
 */
export interface BrihaspatiClassification {
  category: BrihaspatiCategory;
  confidence: number;
  matchedKeywords: string[];
}

/**
 * Layer-2 focus block — the houses, planets, and significators the
 * category cares about. Acts as an explicit anchor for the LLM
 * ("focus on these"), supplementing the filtered chart slice.
 */
export interface BrihaspatiFocus {
  houses: number[];
  planets: string[];
  significators: string[];
}

/**
 * Remedy item. Promoted from analysis.remedies (or wherever the engine
 * carried it) to a first-class field on BrihaspatiContext so the prompt
 * rule #4 ("end with one practical remedy from the JSON") can reference
 * an unambiguous location.
 */
export interface BrihaspatiRemedy {
  /** Free-text remedy description. */
  text: string;
  /** Optional category (gemstone, mantra, donation, fasting, puja, etc.). */
  kind?: string;
  /** Optional planet this remedy is for. */
  planet?: string;
}

/**
 * Structured context the engine passes to the LLM. Shape is deliberately
 * loose at the type level because each category contributes a different
 * subset, but the LLM must be told what's authoritative.
 *
 * Layer-2 filtering: the slices below are CATEGORY-SCOPED. For a marriage
 * question the chart slice is the 7th house + Venus + Jupiter, not the
 * full chart. See `src/lib/brihaspati/router/category-filters.ts`.
 *
 * This is the value persisted to brihaspati_questions.context_json for the
 * §11 training-data flywheel.
 */
export interface BrihaspatiContext {
  category: BrihaspatiCategory;
  locale: BrihaspatiLocale;
  question: string;
  /** Hash of the engine version that produced the analysis. */
  engineVersion: string;
  /** Layer-2 focus anchor for the LLM. */
  focus: BrihaspatiFocus;
  /** Chart slice — only the planets + houses relevant to the category. */
  chart: Record<string, unknown>;
  /** Active dasha and the upcoming sub-period transitions relevant to the question. */
  dashas: Record<string, unknown>;
  /** Detected yogas filtered to those relevant to the category. */
  yogas: Record<string, unknown>[];
  /** Detected doshas filtered to those relevant to the category. */
  doshas: Record<string, unknown>[];
  /** Transit windows touching the category's focus houses/planets. */
  transits: Record<string, unknown>[];
  /** Category-specific analysis (career, marriage, etc.). */
  analysis: Record<string, unknown>;
  /** Remedies the engine recommends; LLM picks one for prompt rule #4. */
  remedies: BrihaspatiRemedy[];
  /**
   * Whose chart this question is about. Used by prompt rules to switch
   * from "your chart shows…" framing to "your daughter Vaibhavi's chart
   * shows…". Defaults to `{ kind: 'self' }` for backward compatibility
   * with all rows created before family integration shipped.
   */
  subject: BrihaspatiSubject;
  /**
   * Set when the user asked about a relative whose chart we don't have,
   * and explicitly opted into a parent-Bhava-proxy reading instead of
   * adding the relative's chart. The narration prompt MUST open with an
   * honest disclaimer that the reading is partial and from the asker's
   * own chart's Nth house (the classical Bhava for that relative), and
   * encourage them to add the relative's chart for a deeper reading.
   * Absent / undefined when the question is about the asker themselves
   * or about a family member whose chart IS on file.
   */
  parentBhavaProxy?: {
    bhava: number;
    relative: string;
    label: { en: string; hi: string };
  };
}

/** Subject of the question — self or a named family member. */
export type BrihaspatiSubject =
  | { kind: 'self' }
  | { kind: 'family'; name: string };

/** The narration output before validation. */
export interface BrihaspatiNarration {
  text: string;
  modelUsed: string;
  inputTokens?: number;
  outputTokens?: number;
  systemPromptVersion: string;
}

/** Final result returned to the API route for streaming + persistence. */
export interface BrihaspatiAnswer {
  tier: BrihaspatiTier;
  narration: BrihaspatiNarration;
  /** Layer-4 result. `null` when validator is in log-only mode and didn't block. */
  validationPassed: boolean | null;
  /** When validation_passed is false, the list of mismatched claims. */
  validationFailures: BrihaspatiValidationFailure[];
  retryCount: number;
}

export interface BrihaspatiValidationFailure {
  claim: string;
  reason: 'planet_not_in_chart' | 'dasha_not_in_context' | 'yoga_not_detected' | 'date_out_of_range' | 'unknown_term';
  expected?: string;
}

/** Returned by GET /api/brihaspati/balance. */
export interface BrihaspatiBalance {
  credits: number;
  subscription: 'none' | 'monthly' | 'annual';
  subscriptionExpiresAt?: string;
}
