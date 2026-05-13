/**
 * AI Pandit Module — Type Definitions
 *
 * All types for the AI consultation engine. This file is the single source
 * of truth for the module's type surface. Internal modules import from here;
 * external consumers import via the public index.ts.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Rashi IDs:  1-based (1=Aries … 12=Pisces)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Query
// ─────────────────────────────────────────────────────────────────────────────

export type QueryCategory =
  | 'career' | 'relationship' | 'health' | 'wealth'
  | 'children' | 'education' | 'spiritual' | 'general';

export type QueryComplexity =
  | 'factual' | 'interpretive' | 'predictive' | 'remedial' | 'comparative';

export interface PanditQuery {
  /** User's natural language question. */
  text: string;
  /** Locale code: 'en' | 'hi' | 'ta' | 'bn'. */
  locale: string;
  /** Override auto-classification if the caller already knows the category. */
  category?: QueryCategory;
}

/** Internal classification result produced by the query classifier. */
export interface ClassifiedQuery {
  originalText: string;
  locale: string;
  category: QueryCategory;
  complexity: QueryComplexity;
  /** Routing tier: 0=template, 1=self-hosted, 2=API. */
  tier: 0 | 1 | 2;
  /** Normalised cache key for dedup. */
  cacheKey: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Structured Astrological Context (SAC) — the ground truth
// ─────────────────────────────────────────────────────────────────────────────

export interface SACPlanet {
  id: number;                          // 0=Sun .. 8=Ketu
  name: string;                        // English name (e.g. "Saturn")
  sign: number;                        // 1-12
  signName: string;                    // English sign name (e.g. "Libra")
  house: number;                       // 1-12
  degree: string;                      // Formatted DD°MM'SS"
  nakshatra: string;                   // English nakshatra name
  pada: number;                        // 1-4
  dignity: string;                     // exalted | own | moolatrikona | friend | neutral | enemy | debilitated
  isRetrograde: boolean;
  isCombust: boolean;
  speed: number;
}

export interface SACDasha {
  mahadasha: { lordId: number; lordName: string; start: string; end: string };
  antardasha: { lordId: number; lordName: string; start: string; end: string };
  pratyantardasha?: { lordId: number; lordName: string; start: string; end: string };
}

export interface SACYoga {
  name: string;
  /** Planet IDs involved (from EvaluatedYoga.involvedPlanets). Empty if unavailable. */
  planets: number[];
  strength: 'strong' | 'moderate' | 'weak';
  category: string;
  /** Whether yoga is auspicious. */
  isAuspicious: boolean;
  /** Classical reference (e.g. "BPHS Ch.36"). Empty string if unavailable. */
  classicalRef: string;
}

export interface SACDosha {
  name: string;
  severity: 'severe' | 'moderate' | 'mild' | 'cancelled';
}

export interface SACTransit {
  planetId: number;
  planetName: string;
  sign: number;
  houseFromMoon: number;
  houseFromLagna: number;
  isRetrograde: boolean;
  /** Sarvashtakavarga bindus for the transit house. 0 if unavailable. */
  savBindus: number;
}

export type Verdict = 'FAVOURABLE' | 'MIXED' | 'CAUTION' | 'CHALLENGING';

export interface VerdictFactor {
  type: 'dasha' | 'transit' | 'yoga' | 'dosha' | 'dignity' | 'ashtakavarga' | 'special';
  detail: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  weight: number;                      // 0.0 - 1.0
}

export interface StructuredAstrologicalContext {
  birth: {
    date: string;
    time: string;
    place: string;
    coordinates: [number, number];
    timezone: string;
  };
  ascendant: {
    sign: number;
    signName: string;
    degree: string;
    nakshatra: string;
    pada: number;
  };
  planets: SACPlanet[];
  dasha: SACDasha;
  yogas: SACYoga[];
  doshas: SACDosha[];
  transits: SACTransit[];
  sadeSati: { active: boolean; phase: 'rising' | 'peak' | 'setting' | null };
  kaalSarpa: { active: boolean; type: string | null };
  shadbala: Record<number, { total: number; required: number; ratio: number }>;
  ashtakavarga: { houseScores: number[] } | null;

  /** Pre-computed by domain synthesis scorer. Maps query category to verdict. */
  domainVerdicts: Partial<Record<QueryCategory, {
    verdict: Verdict;
    score: number;
    factors: VerdictFactor[];
  }>>;

  /** Overall verdict for the primary query category. */
  primaryVerdict: Verdict;
  primaryFactors: VerdictFactor[];
}

// ─────────────────────────────────────────────────────────────────────────────
// LLM Output (what the model returns)
// ─────────────────────────────────────────────────────────────────────────────

export type LLMClaimType =
  | 'planet_house' | 'planet_sign' | 'planet_dignity' | 'planet_retrograde'
  | 'dasha_reference' | 'yoga_mentioned' | 'dosha_mentioned'
  | 'transit_position' | 'sade_sati' | 'verdict_tone';

export interface LLMClaim {
  type: LLMClaimType;
  /** Structured payload — shape depends on type. */
  data: Record<string, unknown>;
}

export interface LLMOutput {
  narrative: string;
  claims: LLMClaim[];
  remedies: { type: string; name: string; instructions: string }[];
  classicalCitations: { text: string; claim: string }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

export type ValidationLayer =
  | 'verdict_alignment'
  | 'claim_verification'
  | 'narrative_scan'
  | 'tradition_guardrails';

export interface ValidationFailure {
  layer: ValidationLayer;
  message: string;
  /** The specific claim or phrase that failed. */
  evidence: string;
  /** Whether this can be fixed by string replacement (vs needing regeneration). */
  fixable: boolean;
  /** Suggested fix if fixable. */
  fix?: { find: string; replace: string };
  /** True for Hinglish warnings that don't block delivery. */
  isWarning?: boolean;
}

export interface ValidationResult {
  passed: boolean;
  failures: ValidationFailure[];
  /** Hinglish warnings (don't block, used for fine-tuning signal). */
  warnings: ValidationFailure[];
  /** Time spent in validation (ms). */
  durationMs: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export interface LLMProviderRequest {
  system: string;
  user: string;
  maxTokens: number;
  temperature?: number;
  jsonMode?: boolean;
}

export interface LLMProviderResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
}

export interface LLMProvider {
  name: string;
  complete(params: LLMProviderRequest): Promise<LLMProviderResponse>;
  isAvailable(): boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Response (returned to caller)
// ─────────────────────────────────────────────────────────────────────────────

export interface PanditResponse {
  /** The narrative text shown to the user. */
  narrative: string;
  /** Disclaimer text (standard + any contextual additions). */
  disclaimer: string;
  /** Which tier handled this query. */
  tier: 0 | 1 | 2;
  /** Which model generated the narrative (or 'template' for tier 0). */
  model: string;
  /** Whether the response came from cache. */
  cached: boolean;
  /** Validation metadata (for debugging / training data collection). */
  validation: {
    passed: boolean;
    layersChecked: ValidationLayer[];
    regenerationCount: number;
    warnings: ValidationFailure[];
  };
  /** Classical text citations, if any. */
  citations: { text: string; claim: string }[];
  /** Remedies, if applicable. */
  remedies: { type: string; name: string; instructions: string }[];
  /** Estimated cost for this call in USD (0 for cached/template). */
  estimatedCostUsd: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

export interface PanditConfig {
  /** Jyotish tradition for the reading. Default: 'parashari'. */
  tradition: 'parashari' | 'jaimini' | 'kp';
  /** Max regeneration attempts before template fallback. Default: 2. */
  maxRetries: number;
  /** Force a specific tier (bypass auto-classification). */
  forceTier?: 0 | 1 | 2;
  /** Force a specific provider (bypass router). */
  forceProvider?: 'self-hosted' | 'anthropic' | 'mock';
  /** Disable cache lookup (for testing). */
  skipCache?: boolean;
  /** Inject a mock provider for testing. Used when forceProvider='mock'. */
  _mockProvider?: LLMProvider;
  /** Hook for training data collection. Called after validation passes. */
  onValidatedResponse?: (data: {
    sac: StructuredAstrologicalContext;
    query: ClassifiedQuery;
    response: LLMOutput;
    model: string;
    validationResult: ValidationResult;
  }) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers (used across modules within ai-pandit)
// ─────────────────────────────────────────────────────────────────────────────

/** Extracted claim from Layer 2b narrative scanning. */
export interface ExtractedClaim {
  type: 'planet_house' | 'planet_dignity' | 'yoga_mentioned' | 'dosha_mentioned';
  planet?: number;
  house?: number;
  dignity?: string;
  yogaName?: string;
  /** The matched text from the narrative. */
  source: string;
}
