# AI Pandit Module — Implementation Spec

> **Status:** FINALISED — ready for implementation
> **Parent doc:** `docs/specs/ai-pandit-engine.md` (architecture + cost model)
> **Target model:** Qwen 2.5 14B-Instruct (self-hosted), Haiku API (overflow)
> **Primary language:** Hindi (Jyotish register) — English secondary
> **Hardware:** Deferred — all development and testing against mock providers

---

## 1. Design Constraint: Complete Isolation from Production

This module MUST be buildable, testable, and runnable without affecting the existing app in any way. It lives behind a build flag. No existing file is modified until integration day.

### 1.1 Build Flag

```
NEXT_PUBLIC_AI_PANDIT_ENABLED=false   # .env.local (default off)
AI_PANDIT_ENDPOINT=                    # empty = module disabled server-side
```

**Rules:**
- No existing file (`src/lib/llm/*`, `src/app/api/*`, `src/components/*`) is modified
- No new route is added to `src/app/api/` until integration phase
- All module code lives under `src/lib/ai-pandit/` — a self-contained directory
- All tests run independently via `npx vitest run src/lib/ai-pandit/`
- The module exports a single public API surface; internals are not importable from outside
- TypeScript compilation of the module must not require the rest of the app to change
- `npx next build` must pass identically with or without the flag — the module is dead code when disabled

### 1.2 Integration Day (Later — Not Part of This Spec)

When infra is provisioned (Hetzner CAX41 + Ollama + Qwen 2.5 7B):
1. Set `AI_PANDIT_ENDPOINT=http://internal:11434` and `NEXT_PUBLIC_AI_PANDIT_ENABLED=true`
2. Add `/api/ai-pandit` route that imports from `src/lib/ai-pandit`
3. Wire into chart-chat UI behind the flag
4. Existing `/api/chart-chat` remains untouched as fallback

---

## 2. Module Structure

```
src/lib/ai-pandit/
├── index.ts                          # Public API — the ONLY file imported from outside
├── types.ts                          # All module types (SAC, validation, provider, etc.)
│
├── context/
│   ├── context-builder.ts            # KundaliData → StructuredAstrologicalContext
│   ├── context-slimmer.ts            # Full SAC → minimal SAC (per query tier)
│   └── prompt-builder.ts             # SAC + query → system prompt + user prompt
│
├── query/
│   ├── classifier.ts                 # Natural language → QueryType + required modules
│   └── normaliser.ts                 # Synonym dedup ("career" = "job" = "profession")
│
├── validation/
│   ├── index.ts                      # Orchestrator — runs all 3 layers in sequence
│   ├── verdict-alignment.ts          # Layer 1: narrative tone ↔ engine verdict
│   ├── claim-verifier.ts             # Layer 2: structured claims ↔ SAC facts
│   ├── narrative-scanner.ts          # Layer 2b: regex extraction from prose
│   └── tradition-guardrails.ts       # Layer 3: immutable Jyotish rules
│
├── providers/
│   ├── types.ts                      # LLMProvider interface
│   ├── self-hosted.ts                # OpenAI-compatible API (Ollama/llama.cpp)
│   ├── anthropic.ts                  # Claude API (Haiku for overflow)
│   └── router.ts                     # Tier 0/1/2 routing + retry + fallback
│
├── templates/
│   ├── index.ts                      # Template engine (slot-fill from SAC)
│   ├── narratives.ts                 # Pre-written blocks: verdict × query_type
│   └── disclaimer.ts                 # Standard + contextual disclaimer text
│
├── cache/
│   └── response-cache.ts             # Birth fingerprint + query category cache
│
└── __tests__/
    ├── context-builder.test.ts       # SAC generation from real KundaliData fixtures
    ├── query-classifier.test.ts      # Classification accuracy
    ├── verdict-alignment.test.ts     # Layer 1 — keyword sentiment vs verdict
    ├── claim-verifier.test.ts        # Layer 2 — claim ↔ SAC matching
    ├── tradition-guardrails.test.ts  # Layer 3 — immutable rule violations
    ├── narrative-scanner.test.ts     # Layer 2b — regex extraction accuracy
    ├── template-engine.test.ts       # Slot-fill correctness
    ├── router.test.ts                # Tier routing + fallback behaviour
    └── fixtures/
        ├── sample-kundali.ts         # Real KundaliData object (anonymised)
        ├── sample-sac.ts             # Expected SAC output
        └── sample-narratives.ts      # LLM outputs (pass + fail examples)
```

---

## 3. Public API

The module exposes exactly one function and one type namespace.

```typescript
// src/lib/ai-pandit/index.ts

export { consultPandit } from './core';
export type {
  PanditQuery,
  PanditResponse,
  PanditConfig,
} from './types';
```

### 3.1 `consultPandit(query, kundali, config?)`

```typescript
async function consultPandit(
  query: PanditQuery,
  kundali: KundaliData,
  config?: Partial<PanditConfig>
): Promise<PanditResponse>
```

**Inputs:**
- `query` — the user's question + locale
- `kundali` — the existing `KundaliData` from our engine (no transformation needed by caller)
- `config` — optional overrides (tradition, max retries, model preference)

**Output:**
- `PanditResponse` — narrative + claims + validation metadata + disclaimer

The caller doesn't need to know about SAC, validation layers, provider routing, or caching. It's one function call.

---

## 4. Type Definitions

```typescript
// src/lib/ai-pandit/types.ts

import type { KundaliData, PlanetPosition, DashaEntry } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

export type QueryCategory =
  | 'career' | 'relationship' | 'health' | 'wealth'
  | 'children' | 'education' | 'spiritual' | 'general';

export type QueryComplexity = 'factual' | 'interpretive' | 'predictive' | 'remedial' | 'comparative';

export interface PanditQuery {
  text: string;                        // User's natural language question
  locale: string;                      // 'en' | 'hi' | 'ta' | 'bn'
  /** Override auto-classification if caller already knows the category. */
  category?: QueryCategory;
}

/** Internal classification result. */
export interface ClassifiedQuery {
  originalText: string;
  locale: string;
  category: QueryCategory;
  complexity: QueryComplexity;
  /** Which engine data subsets are needed for this query. */
  requiredModules: RequiredModule[];
  /** Routing tier: 0=template, 1=self-hosted, 2=API. */
  tier: 0 | 1 | 2;
  /** Normalised cache key for dedup. */
  cacheKey: string;
}

export type RequiredModule =
  | 'planets' | 'houses' | 'dashas' | 'transits'
  | 'yogas' | 'doshas' | 'shadbala' | 'ashtakavarga'
  | 'sade_sati' | 'jaimini' | 'divisional';

// ---------------------------------------------------------------------------
// Structured Astrological Context (SAC) — the ground truth
// ---------------------------------------------------------------------------

export interface SACPlanet {
  id: number;                          // 0=Sun .. 8=Ketu
  name: string;                        // English name for LLM readability
  sign: number;                        // 1-12
  signName: string;                    // English sign name
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
  detected: boolean;
  planets: number[];
  strength: 'strong' | 'moderate' | 'weak';
  category: string;
}

export interface SACDosha {
  name: string;
  detected: boolean;
  severity: 'severe' | 'moderate' | 'mild' | 'cancelled';
}

export interface SACTransit {
  planetId: number;
  planetName: string;
  sign: number;
  houseFromMoon: number;
  houseFromLagna: number;
  isRetrograde: boolean;
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

  /** Pre-computed by domain synthesis scorer. Maps query category → verdict. */
  domainVerdicts: Partial<Record<QueryCategory, {
    verdict: Verdict;
    score: number;
    factors: VerdictFactor[];
  }>>;

  /** Overall verdict for the primary query category. Set by context builder. */
  primaryVerdict: Verdict;
  primaryFactors: VerdictFactor[];
}

// ---------------------------------------------------------------------------
// LLM Output (what the model returns)
// ---------------------------------------------------------------------------

export interface LLMClaim {
  type:
    | 'planet_house' | 'planet_sign' | 'planet_dignity' | 'planet_retrograde'
    | 'dasha_reference' | 'yoga_mentioned' | 'dosha_mentioned'
    | 'transit_position' | 'sade_sati' | 'verdict_tone';
  /** Structured payload — shape depends on type. */
  data: Record<string, unknown>;
}

export interface LLMOutput {
  narrative: string;
  claims: LLMClaim[];
  remedies: { type: string; name: string; instructions: string }[];
  classicalCitations: { text: string; claim: string }[];
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export type ValidationLayer = 'verdict_alignment' | 'claim_verification' | 'tradition_guardrails';

export interface ValidationFailure {
  layer: ValidationLayer;
  message: string;
  /** The specific claim or phrase that failed. */
  evidence: string;
  /** Whether this can be fixed by string replacement (vs needing regeneration). */
  fixable: boolean;
  /** Suggested fix if fixable. */
  fix?: { find: string; replace: string };
}

export interface ValidationResult {
  passed: boolean;
  failures: ValidationFailure[];
  /** Time spent in validation (ms). */
  durationMs: number;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface LLMProvider {
  name: string;
  complete(params: {
    system: string;
    user: string;
    maxTokens: number;
    temperature?: number;
    jsonMode?: boolean;
  }): Promise<{ content: string; inputTokens: number; outputTokens: number }>;
  isAvailable(): boolean;
}

// ---------------------------------------------------------------------------
// Response
// ---------------------------------------------------------------------------

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
  };
  /** Classical text citations, if any. */
  citations: { text: string; claim: string }[];
  /** Remedies, if applicable. */
  remedies: { type: string; name: string; instructions: string }[];
  /** Cost estimate for this call in USD (0 for cached/template). */
  estimatedCostUsd: number;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export interface PanditConfig {
  /** Jyotish tradition for the reading. Default: 'parashari'. */
  tradition: 'parashari' | 'jaimini' | 'kp';
  /** Max regeneration attempts before template fallback. Default: 2. */
  maxRetries: number;
  /** Force a specific tier (bypass auto-classification). */
  forceTier?: 0 | 1 | 2;
  /** Force a specific provider (bypass router). */
  forceProvider?: 'self-hosted' | 'anthropic';
  /** Disable cache lookup (for testing). */
  skipCache?: boolean;
}
```

---

## 5. Component Specs

### 5.1 Context Builder (`context/context-builder.ts`)

**Input:** `KundaliData` (the existing engine output — unchanged)
**Output:** `StructuredAstrologicalContext`

**Mapping logic:**

| SAC Field | Source in KundaliData |
|---|---|
| `birth` | `kundali.birthData` (direct copy) |
| `ascendant` | `kundali.ascendant` + nakshatra from degree |
| `planets` | `kundali.planets[]` — map each `PlanetPosition` to `SACPlanet` |
| `dasha` | `kundali.dashas[]` — find active maha/antar/pratyantar by date |
| `yogas` | `kundali.yogasComplete[]` — map to `SACYoga[]` |
| `doshas` | Extract from tippanni engine or `yogasComplete` dosha category |
| `transits` | Compute live via `computeCurrentTransits()` from domain-synthesis |
| `sadeSati` | `kundali.sadeSati` (direct copy if present) |
| `kaalSarpa` | Extract from `yogasComplete` or tippanni |
| `shadbala` | `kundali.shadbala[]` → `Record<planetId, {total, required, ratio}>` |
| `ashtakavarga` | `kundali.ashtakavarga?.savTable` → `{houseScores}` |
| `domainVerdicts` | Import `scoreDomain` from `domain-synthesis/scorer.ts` — reuse, don't recompute |
| `primaryVerdict` | `domainVerdicts[classifiedQuery.category].verdict` |

**Key rule:** The context builder IMPORTS from existing modules. It does not duplicate any computation. The domain-synthesis scorer, the transit calculator, the yoga engine — all are called as-is.

**Dependencies (import only, no modification):**
- `@/types/kundali` — `KundaliData`, `PlanetPosition`, `DashaEntry`
- `@/lib/kundali/domain-synthesis/scorer` — `scoreDomain`, `ScorerInput`
- `@/lib/kundali/domain-synthesis/transit-activation` — `computeCurrentTransits`
- `@/lib/constants/dignities` — `EXALTATION_SIGNS`, etc.
- `@/lib/constants/grahas` — `GRAHAS` (for planet names)

### 5.2 Context Slimmer (`context/context-slimmer.ts`)

Not all queries need the full SAC. A factual query ("what dasha am I in?") only needs the dasha block. Sending less context = fewer input tokens = lower cost + better focus.

| Query Complexity | SAC Fields Included |
|---|---|
| `factual` | Only the relevant subset (e.g., `dasha` for dasha questions) |
| `interpretive` | `planets`, `dasha`, `transits`, `domainVerdicts` for the queried domain |
| `predictive` | Full SAC |
| `remedial` | `planets`, `doshas`, `yogas`, `domainVerdicts` |
| `comparative` | Two slimmed SACs (one per time period) |

### 5.3 Query Classifier (`query/classifier.ts`)

**Method:** Keyword-based (no LLM call), **bilingual English + Hindi**. Rule-based classification is sufficient because:
1. Astrological queries cluster tightly around ~8 life domains
2. The validation wall catches misclassification (wrong domain → wrong verdict → fails Layer 1)
3. Zero cost, zero latency

**Hindi keyword support is mandatory.** The primary user base queries in Hindi or Hinglish. Examples:

```
Input: "Is this a good time for a job change?"
Output: { category: 'career', complexity: 'interpretive', tier: 1, ... }

Input: "मेरी दशा क्या चल रही है?"  (What dasha am I in?)
Output: { category: 'general', complexity: 'factual', tier: 0, ... }

Input: "क्या ये समय नौकरी बदलने के लिए सही है?"  (Is this good time to change job?)
Output: { category: 'career', complexity: 'interpretive', tier: 1, ... }

Input: "शनि की साढ़ेसाती और काल सर्प दोष का क्या प्रभाव है?"
Output: { category: 'general', complexity: 'predictive', tier: 2, ... }

Input: "career kaisa rahega?"  (Hinglish: how will career be?)
Output: { category: 'career', complexity: 'interpretive', tier: 1, ... }
```

**Keyword maps (bilingual):**
```
career:       job | work | profession | business | नौकरी | करियर | व्यापार | काम | रोज़गार
relationship: marriage | partner | love | spouse | विवाह | शादी | पत्नी | पति | रिश्ता | प्रेम
health:       health | illness | disease | body | स्वास्थ्य | बीमारी | शरीर | रोग | आरोग्य
wealth:       money | wealth | finance | income | धन | पैसा | आय | लक्ष्मी | संपत्ति
children:     child | son | daughter | fertility | संतान | बच्चा | पुत्र | पुत्री | गर्भ
education:    education | study | exam | learning | शिक्षा | पढ़ाई | परीक्षा | विद्या
spiritual:    spiritual | moksha | meditation | sadhana | आध्यात्मिक | मोक्ष | ध्यान | साधना | पूजा
```

**Tier assignment rules:**
- `factual` → Tier 0 (template, always)
- `interpretive` + single domain → Tier 1 (self-hosted)
- `predictive` or `comparative` → Tier 1 (attempt), overflow to Tier 2
- Multi-domain synthesis or 3+ conflicting factors → Tier 2

### 5.4 Query Normaliser (`query/normaliser.ts`)

Maps synonymous queries to the same cache key (bilingual):

```
career | job | work | profession | नौकरी | करियर | व्यापार → 'career'
marriage | relationship | partner | विवाह | शादी | रिश्ता → 'relationship'
health | illness | disease | स्वास्थ्य | बीमारी | रोग → 'health'
...
```

Cache key = `SHA256(birthFingerprint + ':' + normalisedCategory + ':' + locale)`

### 5.5 Validation Wall (`validation/`)

Each layer is a pure function: `(llmOutput, sac) → ValidationResult`. No side effects, no I/O. Fully testable with fixtures.

**Layer 1 — Verdict Alignment** (`verdict-alignment.ts`)
- Input: `LLMOutput.narrative` + `SAC.primaryVerdict`
- Method: Count positive/negative marker phrases, compute ratio, check against verdict threshold
- **Bilingual markers** — must detect sentiment in both English and Hindi:
  - Positive (EN): excellent, auspicious, blessed, strong, favourable
  - Positive (HI): शुभ, उत्तम, अनुकूल, प्रबल, मंगलकारी, अत्यंत शुभ
  - Negative (EN): challenging, difficult, caution, obstacle, delay
  - Negative (HI): कठिन, चुनौतीपूर्ण, सावधानी, बाधा, विलम्ब, अशुभ, प्रतिकूल
- Pure function, ~80 lines (expanded for Hindi)

**Layer 2 — Claim Verification** (`claim-verifier.ts`)
- Input: `LLMOutput.claims[]` + `SAC`
- Method: For each claim, lookup the corresponding SAC field, assert equality
- Returns list of failed claims with specifics
- Claims array is always in English (structured data, not prose) — no Hindi needed here

**Layer 2b — Narrative Scanner** (`narrative-scanner.ts`)
- Input: `LLMOutput.narrative` + `SAC`
- Method: Regex extraction of planet-house, planet-dignity, yoga names, dasha references
- **Bilingual patterns** — must extract from both English and Hindi prose:
  - EN: `"Saturn is in (your )?(the )?\d+(st|nd|rd|th) house"`
  - HI: `"शनि (आपके )?(\d+|प्रथम|द्वितीय|...) भाव में"` (शनि in Xth bhava)
  - EN: `"(exalted|debilitated) (Sun|Moon|Mars|...)"`
  - HI: `"(उच्च|नीच) (सूर्य|चन्द्र|मंगल|...)"`
  - Yoga names work in both scripts: "Gajakesari" / "गजकेसरी"
- Cross-check extracted entities against SAC

**Layer 3 — Tradition Guardrails** (`tradition-guardrails.ts`)
- Input: `LLMOutput.narrative`
- Method: Pattern matching against immutable Jyotish rules
- Imports from `@/lib/constants/dignities`, `@/lib/constants/grahas`
- **Bilingual rules** — catches errors in both English and Hindi:
  - EN: "Jupiter, a natural malefic" → REJECT
  - HI: "बृहस्पति, एक प्राकृतिक पाप ग्रह" → REJECT
  - EN: "Mars aspects the 5th and 9th" → REJECT (Mars aspects 4th/8th)
  - HI: "मंगल की पंचम और नवम दृष्टि" → REJECT
- **Hinglish code-switching detection** (Layer 3 addition):
  - If locale is 'hi', detect English astronomy terms mixed in:
    "Saturn ka transit" → should be "शनि का गोचर"
    "retrograde ho raha hai" → should be "वक्री हो रहा है"
  - This is a WARNING, not a REJECT — flags for quality but doesn't block delivery
  - Used as signal for fine-tuning: high Hinglish rate = model needs more Hindi training data
- Zero dependency on SAC — these rules are universal

**Orchestrator** (`validation/index.ts`)
- Runs Layer 1 → 2 → 2b → 3 in sequence
- Short-circuits on first REJECT (no point checking Layer 3 if Layer 1 failed)
- Applies fixable corrections (Layer 3 string replacements) before returning
- Returns aggregate `ValidationResult`

### 5.6 Provider Abstraction (`providers/`)

**Interface** (`providers/types.ts`)
- `LLMProvider` as defined in §4 types
- OpenAI-compatible request/response shape (Ollama and Anthropic both support this)

**Self-Hosted Provider** (`providers/self-hosted.ts`)
- HTTP POST to `AI_PANDIT_ENDPOINT/v1/chat/completions`
- Timeout: 45s (14B on ARM CPU is ~10-12 tok/s — needs headroom)
- JSON mode via `response_format: { type: 'json_object' }`
- `isAvailable()`: checks `AI_PANDIT_ENDPOINT` is set + health ping
- **Not testable until infra provisioned** — all dev/test uses MockProvider

**Anthropic Provider** (`providers/anthropic.ts`)
- Wraps existing `getClaudeClient()` from `@/lib/llm/llm-client.ts`
- Uses Haiku (cheapest) for overflow
- `isAvailable()`: delegates to existing `isLLMAvailable()`

**Router** (`providers/router.ts`)
- Tier 0: return template (no provider call)
- Tier 1: try self-hosted → validate → if fail after 2 retries, escalate to Tier 2
- Tier 2: try Anthropic → validate → if fail after 2 retries, template fallback
- Logs every routing decision for monitoring

### 5.7 Template Engine (`templates/`)

**Slot-fill system, bilingual:**

English:
```
"During your {dasha_lord} Mahadasha, {domain} matters are {verdict_adjective}.
{positive_factors_sentence} {negative_factors_sentence}
Classical tradition suggests {primary_remedy}."
```

Hindi:
```
"आपकी {dasha_lord_hi} महादशा में {domain_hi} से संबंधित विषय {verdict_adjective_hi} हैं।
{positive_factors_sentence_hi} {negative_factors_sentence_hi}
शास्त्रों के अनुसार {primary_remedy_hi} का सुझाव दिया जाता है।"
```

Slots filled from SAC — no LLM involved. Planet/rashi names use the existing `GRAHAS[].name.hi` and `RASHIS[].name.hi` from constants. Templates exist for every `verdict × category × locale` combination (4 × 8 × 2 = 64 templates — English and Hindi).

**Hindi template vocabulary** uses proper Jyotish register:
- दशा (not "dasha period"), गोचर (not "transit"), भाव (not "house")
- राहुकाल, गुलिक काल, यमगण्ड (inauspicious period names)
- शुभ/अशुभ (auspicious/inauspicious), उच्च/नीच (exalted/debilitated)
- No Hinglish mixing in templates — pure Hindi with Jyotish terminology

**Disclaimer** (`templates/disclaimer.ts`)
- Standard text in both English and Hindi (always present)
- Contextual additions keyed by `QueryCategory`, `Verdict`, and `locale`
- Exported as pure functions: `getDisclaimer(category, verdict, locale) → string`

### 5.8 Response Cache (`cache/response-cache.ts`)

**Strategy:** In-memory `Map<string, CachedResponse>` with LRU eviction.

- Key: `SHA256(birthFingerprint + ':' + normalisedCategory + ':' + locale)`
- Value: `PanditResponse` + timestamp
- TTL: 24 hours (transits change daily)
- Max entries: 1,000 (each ~2KB = ~2MB total)
- No external dependency (no Redis, no Supabase) — this runs in-process

**Birth fingerprint:** `SHA256(date + time + lat.toFixed(4) + lng.toFixed(4))`

Birth chart cache entries have no TTL (chart never changes). Only transit-dependent parts expire.

---

## 6. Data Flow

```
consultPandit(query, kundali)
  │
  ├─ 1. classifyQuery(query)
  │     → ClassifiedQuery { category, complexity, tier, cacheKey }
  │
  ├─ 2. checkCache(cacheKey)
  │     → if hit: return cached PanditResponse
  │
  ├─ 3. buildContext(kundali, classifiedQuery)
  │     → StructuredAstrologicalContext (SAC)
  │     → (imports scoreDomain, computeCurrentTransits — no duplication)
  │
  ├─ 4. slimContext(sac, classifiedQuery.requiredModules)
  │     → Slimmed SAC (only fields needed for this query type)
  │
  ├─ 5. route(classifiedQuery.tier)
  │     │
  │     ├─ Tier 0: fillTemplate(sac, classifiedQuery)
  │     │          → PanditResponse (no LLM, no validation needed)
  │     │
  │     ├─ Tier 1: selfHosted.complete(buildPrompt(sac, query))
  │     │          → LLMOutput (parsed JSON)
  │     │          → validate(llmOutput, sac)
  │     │          │   ├─ PASS → build PanditResponse
  │     │          │   └─ FAIL → retry with tighter constraints (max 2×)
  │     │          │             └─ still fails → escalate to Tier 2
  │     │          │
  │     │
  │     └─ Tier 2: anthropic.complete(buildPrompt(sac, query))
  │                → LLMOutput → validate → retry/fallback same as above
  │                → final fallback: fillTemplate()
  │
  ├─ 6. attachDisclaimer(response, classifiedQuery)
  │
  ├─ 7. cacheResponse(cacheKey, response)
  │
  └─ 8. return PanditResponse
```

---

## 7. What This Module Does NOT Do

Explicit scope boundaries to prevent creep:

| Out of Scope | Reason |
|---|---|
| New API route | Added at integration time, not now |
| UI components | Added at integration time |
| Database tables | Training data collection deferred to Phase 2 |
| Supabase interaction | Module is pure compute, no DB dependency |
| Modifying existing LLM routes | Existing `/api/chart-chat` etc. stay untouched |
| Fine-tuning pipeline | Separate project, runs offline |
| RAG / vector search | Phase 3 — separate module |
| Ollama installation / server setup | Infra provisioning is separate |
| i18n / locale files | Module returns English + locale-tagged content; UI handles display |

---

## 8. Testing Strategy

**All tests run against mock providers. No network calls. No hardware required.**

### 8.1 Fixtures

**Chart fixtures** — real `KundaliData` objects (anonymised birth data):
- A chart with strong career yogas (expected: FAVOURABLE for career queries)
- A chart with Sade Sati active + debilitated Saturn (expected: CAUTION/CHALLENGING)
- A chart with mixed factors (expected: MIXED)
- A chart with Kaal Sarpa dosha (expected: specific dosha detection)

**Narrative fixtures** — hand-written LLM output samples for validation testing:

*English (good — should pass all layers):*
```json
{
  "narrative": "Saturn's placement in your 7th house during this Saturn-Mercury dasha period suggests a phase of careful deliberation in relationships. Jupiter's benefic aspect from the 11th house provides protective grace...",
  "claims": [{ "type": "planet_house", "data": { "planet": 6, "house": 7 } }, ...]
}
```

*Hindi (good — proper Jyotish register, should pass):*
```json
{
  "narrative": "शनि की आपके सप्तम भाव में स्थिति और वर्तमान शनि-बुध दशा काल में संबंधों के विषय में सावधानीपूर्वक विचार की आवश्यकता है। बृहस्पति की एकादश भाव से शुभ दृष्टि सुरक्षा प्रदान करती है...",
  "claims": [{ "type": "planet_house", "data": { "planet": 6, "house": 7 } }, ...]
}
```

*Hindi (bad — Hinglish code-switching, should warn):*
```json
{
  "narrative": "Saturn ka transit aapke 7th house mein hai. Jupiter ka aspect positive hai. Dasha period mein career accha rahega..."
}
```

*English (bad — hallucinated claim, should fail Layer 2):*
```json
{
  "narrative": "Jupiter in your 10th house brings excellent career prospects...",
  "claims": [{ "type": "planet_house", "data": { "planet": 4, "house": 10 } }]
}
```
(Where SAC says Jupiter is actually in house 3 — claim fails verification.)

*English (bad — tradition violation, should fail Layer 3):*
```json
{
  "narrative": "Jupiter, being a natural malefic, creates obstacles in the 5th house..."
}
```

*Hindi (bad — tradition violation in Hindi, should fail Layer 3):*
```json
{
  "narrative": "बृहस्पति एक प्राकृतिक पाप ग्रह होने के कारण पंचम भाव में बाधाएँ उत्पन्न करते हैं..."
}
```

**Mock provider** — returns fixture narratives based on test scenario:
```typescript
class MockProvider implements LLMProvider {
  name = 'mock';
  constructor(private fixture: LLMOutput) {}
  async complete() {
    return { content: JSON.stringify(this.fixture), inputTokens: 0, outputTokens: 0 };
  }
  isAvailable() { return true; }
}
```

### 8.2 Unit Tests (per component)

| File | What It Tests | Fixture Needed |
|---|---|---|
| `context-builder.test.ts` | KundaliData → SAC mapping completeness and correctness | Sample KundaliData |
| `query-classifier.test.ts` | 40+ queries classified correctly — **20 English, 15 Hindi, 5 Hinglish** | None (string inputs) |
| `verdict-alignment.test.ts` | Positive narrative + FAVOURABLE = pass; Positive + CHALLENGING = fail. **Both EN and HI marker words.** | Narrative strings |
| `claim-verifier.test.ts` | Correct claims pass; wrong planet-house/dignity claims fail | SAC + claims arrays |
| `tradition-guardrails.test.ts` | "Jupiter malefic" fails; "बृहस्पति पाप ग्रह" fails; "Mars aspects 4th/8th" passes. **Both EN and HI patterns.** | Narrative strings |
| `narrative-scanner.test.ts` | Extracts planet-house, yoga names, dasha refs from **both EN and HI prose** | Narrative strings |
| `template-engine.test.ts` | All 64 verdict×category×locale templates render without empty slots | SAC fixture |
| `router.test.ts` | Tier 0→template; Tier 1 fail→Tier 2; Tier 2 fail→template. **All via MockProvider.** | Mock providers |
| `hinglish-detector.test.ts` | Detects code-switching: "Saturn ka transit" flagged, "शनि का गोचर" clean | Narrative strings |

### 8.3 Integration Tests (Mock Provider Only)

Two end-to-end tests that call `consultPandit()` with real KundaliData fixture + MockProvider:

**Test A — English query flow:**
- Input: `{ text: "How is my career looking?", locale: "en" }` + chart fixture
- MockProvider returns good English narrative fixture
- Asserts: response non-empty, disclaimer in English, validation passed, tier correct, cache hit on repeat

**Test B — Hindi query flow:**
- Input: `{ text: "मेरा करियर कैसा रहेगा?", locale: "hi" }` + chart fixture
- MockProvider returns good Hindi narrative fixture
- Asserts: response non-empty, disclaimer in Hindi, validation passed (Hindi markers), tier correct

**Test C — Validation rejection flow:**
- MockProvider returns narrative with hallucinated claim
- Asserts: first call fails validation, retry with tighter constraints, eventually falls back to template
- Template output is correct and has proper disclaimer

### 8.4 What We Do NOT Test

- Actual LLM output quality — deferred to provisioning time when we have a real model
- Network connectivity to Ollama — infra concern, tested at provisioning
- Latency / throughput — benchmarked at provisioning, not in CI
- Real Anthropic API calls — existing routes already test this; module uses MockProvider
- Hindi quality from Qwen 2.5 14B specifically — evaluated at provisioning with manual spot-checks

---

## 9. Dependencies (Imports Only — No New Packages)

The module adds **zero new npm dependencies**. Everything it needs already exists:

| Need | Source |
|---|---|
| KundaliData type | `@/types/kundali` (existing) |
| Dignity constants | `@/lib/constants/dignities` (existing) |
| Planet data | `@/lib/constants/grahas` (existing) |
| Domain scorer | `@/lib/kundali/domain-synthesis/scorer` (existing) |
| Transit computation | `@/lib/kundali/domain-synthesis/transit-activation` (existing) |
| Anthropic client | `@/lib/llm/llm-client` (existing) |
| HTTP calls (self-hosted) | `fetch` (built-in) |
| Hashing | `crypto` (Node built-in) |
| JSON parsing | Built-in |

No Langchain, no Vercel AI SDK, no `openai` package. Just `fetch` to an OpenAI-compatible endpoint.

---

## 10. Build Verification

The module is done when ALL of the following are true:

```
□ npx vitest run src/lib/ai-pandit/  — all tests pass (zero network calls)
□ npx tsc --noEmit -p tsconfig.build-check.json  — zero errors
□ npx next build  — passes identically to before (no new pages, no new routes)
□ No existing file outside src/lib/ai-pandit/ was modified
□ consultPandit() works end-to-end with MockProvider (English + Hindi)
□ Template fallback produces coherent output for all 64 verdict×category×locale combos
□ Validation wall correctly rejects 10+ known-bad EN narratives in fixtures
□ Validation wall correctly rejects 10+ known-bad HI narratives in fixtures
□ Validation wall correctly passes 10+ known-good EN narratives in fixtures
□ Validation wall correctly passes 10+ known-good HI narratives in fixtures
□ Query classifier handles 20+ Hindi and 5+ Hinglish queries correctly
□ Hinglish code-switching detector flags mixed-language narratives
□ All providers implement the same interface — swappable with no code change
```

---

## 11. Critical Review — What Could Go Wrong

### 11.1 Context Builder Accuracy

**Risk:** SAC misrepresents the engine output. The LLM then narrates wrong data, and the validation wall PASSES because it validates against the same wrong SAC.

**Mitigation:** Context builder tests compare SAC output against manually verified chart data. If the SAC says "Saturn in 7th" but KundaliData says house 8, the test catches it. The SAC is a faithful translation, not a reinterpretation.

### 11.2 Validation Wall False Negatives

**Risk:** The wall fails to catch a hallucination. A wrong claim reaches the user.

**Mitigation:** Layer 2b (narrative scanner) is the safety net for claims the LLM made in prose but omitted from structured output. But regex extraction is inherently incomplete — a novel phrasing could slip through. Hindi adds complexity: more grammatical variation in how claims are expressed.

**Acceptance:** At launch, we accept that ~2-5% of factual claims in prose may bypass Layer 2b. The structured `claims` array (Layer 2) catches the explicit ones. Over time, narrative scanner patterns are expanded based on observed misses — especially Hindi patterns, which will need iteration.

### 11.3 Validation Wall False Positives

**Risk:** The wall rejects a perfectly valid response. Excessive regeneration wastes tokens and increases latency.

**Mitigation:** Layer 1 thresholds are loose (ratio ranges, not exact scores). Layer 3 rules are conservative (only immutable Jyotish facts, no edge cases). Expected false positive rate: <3%. Hindi sentiment markers are curated from actual Jyotish literature to avoid false triggers on common Hindi phrases.

### 11.4 Template Quality

**Risk:** Tier 0 template responses feel robotic compared to LLM narratives. Users notice the quality gap.

**Mitigation:** Templates are written by hand to sound natural, not generated. Hindi templates use proper Jyotish register (शुभ/अशुभ, गोचर, दशा — not Hinglish). They use SAC data for personalisation (planet names from `GRAHAS[].name.hi`, rashi names from `RASHIS[].name.hi`). The gap is intentional — templates are the safety floor, not the quality target.

### 11.5 Query Misclassification

**Risk:** "मेरा स्वास्थ्य कैसा रहेगा?" (How's my health?) classified as `general` instead of `health`. Wrong domain verdict loaded.

**Mitigation — RESOLVED:** The prompt ALWAYS includes the original user query verbatim. Classification affects which SAC subset and which verdict are loaded, but the narrative is anchored to the user's actual words. The LLM responds to "स्वास्थ्य" because it's right there in the prompt, regardless of what category we assigned.

Additionally, for v1 we send full SAC always (no context slimmer). The ~5K token SAC costs ~$0.001 extra per self-hosted call (effectively free). The slimmer is a v2 optimisation once we've validated that classification accuracy is high enough.

### 11.6 Self-Hosted Model Quality (Qwen 2.5 14B)

**Risk:** Base Qwen 2.5 14B produces Hindi narratives that mix Hinglish or use incorrect Jyotish terminology. Validation wall warns but doesn't block.

**Mitigation:** This is expected behaviour pre-fine-tuning. The Hinglish detector (Layer 3 warning) tracks code-switching rate. If >30% of Hindi responses trigger Hinglish warnings, the router escalates Hindi queries to Anthropic API (Haiku handles Hindi well). Fine-tuning with collected Hindi training data brings this down.

**Development phase:** Since we're testing with MockProvider only, model quality is not a concern until provisioning. The module's correctness is proven against fixtures. Actual model behaviour is evaluated at provisioning time with manual spot-checks.

### 11.7 Structured Output from 14B Models

**Risk:** Qwen 2.5 14B doesn't reliably produce valid JSON with the required `claims` array. Parsing fails.

**Mitigation:** JSON mode is supported natively by Qwen 2.5 via Ollama. Belt-and-braces: the response parser strips markdown fences, attempts JSON.parse, and on failure extracts the narrative as plain text with an empty claims array (falling through to Layer 2b regex scanner only). Worst case: Layer 2 is skipped, Layers 1 + 2b + 3 still run.

### 11.8 Hindi Narrative Scanner Coverage (NEW)

**Risk:** Hindi has more grammatical flexibility than English. "शनि सप्तम भाव में हैं", "सातवें भाव में शनि की स्थिति", "शनि आपके ७वें घर में" all mean "Saturn in 7th house" but have different word orders and vocabulary.

**Mitigation:** The Hindi narrative scanner starts with a conservative set of patterns (ordinal भाव references, standard planet names from GRAHAS constant). We explicitly accept lower coverage in Hindi for v1 — Layer 2 (structured claims) is the primary check. Layer 2b (narrative scanner) is a bonus safety net, not the primary gate. Over time, patterns are expanded based on observed Hindi narratives from the live model.

### 11.9 Training Data Collection (RESOLVED)

**Concern:** Module is DB-free, but we need `(SAC, query, response)` tuples for fine-tuning.

**Resolution:** `PanditConfig` accepts an optional `onValidatedResponse` callback:

```typescript
interface PanditConfig {
  // ... existing fields ...
  /** Hook for training data collection. Called after validation passes. Module doesn't know about Supabase. */
  onValidatedResponse?: (data: {
    sac: StructuredAstrologicalContext;
    query: ClassifiedQuery;
    response: LLMOutput;
    model: string;
    validationResult: ValidationResult;
  }) => void;
}
```

The API route (at integration time) passes a callback that writes to Supabase. The module itself has zero DB knowledge. Clean separation.
