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
 * Structured context the engine passes to the LLM. Shape is deliberately
 * loose at the type level because each category contributes a different
 * subset, but the LLM must be told what's authoritative.
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
  /** Chart summary (positions, lagna, moon sign, etc.). */
  chart: Record<string, unknown>;
  /** Active dasha and the upcoming sub-period transitions relevant to the question. */
  dashas: Record<string, unknown>;
  /** Detected yogas in the chart (Gajakesari, Mangal Dosha, etc.). */
  yogas: Record<string, unknown>[];
  /** Detected doshas (Manglik, Kaal Sarpa, Pitru, etc.). */
  doshas: Record<string, unknown>[];
  /** Transit windows relevant to the question's time-horizon. */
  transits: Record<string, unknown>[];
  /** Domain-specific analysis (career, marriage, etc.). */
  analysis: Record<string, unknown>;
}

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
