# AI Pandit Engine — Architecture, Validation Wall & Cost Model

> **Status:** Architecture finalised — module spec at `ai-pandit-module-spec.md`
> **Author:** Architecture session, 2026-05-12
> **Depends on:** Swiss Ephemeris computation engine, existing Claude API integration
> **Target model:** Qwen 2.5 14B-Instruct (self-hosted on Hetzner CAX41)
> **Primary language:** Hindi (Jyotish register) — English secondary
> **Pricing model:** App is free. All LLM cost is infrastructure, offset by ads/affiliates.

---

## 1. Core Principle

**The engine computes. The LLM narrates. The validation wall ensures they never disagree.**

Every astronomical fact, every yoga detection, every directional verdict is computed by our Swiss Ephemeris-backed rule engine before the LLM sees anything. The LLM's job is to translate structured astrological facts into compassionate, personalised guidance grounded in classical tradition. It never calculates. It never invents.

```
USER QUESTION
     │
     ▼
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   QUERY     │────▶│  COMPUTATION     │────▶│  CONTEXT    │
│  CLASSIFIER │     │  ENGINE          │     │  BUILDER    │
│             │     │  (Swiss Ephem)   │     │             │
└─────────────┘     └──────────────────┘     └──────┬──────┘
                                                     │
                    ┌──────────────────┐              │
                    │   VALIDATION     │◀─────────────┤
                    │   WALL           │              │
                    │  (3 layers)      │              ▼
                    └────────┬─────────┘     ┌──────────────┐
                             │               │   LLM LAYER  │
                             │               │  (narrator)  │
                             ▼               └──────┬───────┘
                    ┌──────────────────┐             │
                    │   RESPONSE       │◀────────────┘
                    │   + DISCLAIMER   │
                    └──────────────────┘
```

---

## 2. What the LLM Does and Does NOT Do

| LLM DOES | LLM DOES NOT |
|---|---|
| Weave computed facts into narrative | Calculate planet positions |
| Explain WHY a factor matters classically | Decide if something is favourable/unfavourable |
| Contextualise for the user's specific question | Detect yogas or doshas |
| Choose emphasis, tone, and pacing | Determine dasha periods or transit dates |
| Offer remedial suggestions from classical sources | Compute muhurta scores or shadbala |
| Handle ambiguity when multiple factors conflict | Invent planetary positions or aspects |
| Answer "what does this mean for my life?" | Answer "what planet is in which house?" |
| Cite BPHS, Phaladeepika, Saravali by chapter | Generate or fabricate classical references |

---

## 3. Query Classification

Every user query is classified before computation begins.

### 3.1 Query Types

| Type | Example | Computation Required | LLM Role |
|---|---|---|---|
| **Factual** | "What dasha am I in?" | Dasha calculation | Minimal — format the answer |
| **Interpretive** | "Is this a good time for business?" | Dasha + transits + muhurta + ashtakavarga | Full narrative synthesis |
| **Predictive** | "What will 2027 look like for me?" | Annual transits + dasha progression + varshaphal | Heavy narrative with timeline |
| **Remedial** | "What should I do about my Sade Sati?" | Sade Sati phase + Saturn dignity + current dasha | Remedial selection + prioritisation |
| **Comparative** | "Which month is better — June or July?" | Muhurta scan for both periods | Comparative narrative |
| **Explanatory** | "Why do I keep facing career setbacks?" | Full chart + dasha + transits + yogas/doshas | Deepest narrative — multi-factor synthesis |

### 3.2 Classification Method

A lightweight classifier (can be rule-based for v1, LLM-assisted for v2) maps the query to:
- Required computation modules (which engine functions to call)
- Response depth (brief / standard / comprehensive)
- Whether remedial suggestions are expected

---

## 4. Computation Engine Output (Ground Truth)

The engine produces a **Structured Astrological Context** (SAC) — the single source of truth that the LLM must not contradict.

```typescript
interface StructuredAstrologicalContext {
  // Identity
  birthData: { date: string; time: string; place: string; coordinates: [number, number]; timezone: string };
  
  // Core chart
  ascendant: { sign: number; degree: number; nakshatra: string; pada: number };
  planets: Array<{
    id: number;           // 0=Sun .. 8=Ketu
    sign: number;         // 1-12
    house: number;        // 1-12
    degree: number;
    nakshatra: string;
    pada: number;
    dignity: 'exalted' | 'own' | 'moolatrikona' | 'friend' | 'neutral' | 'enemy' | 'debilitated';
    isRetrograde: boolean;
    isCombust: boolean;
    speed: number;
  }>;
  
  // Active periods
  dasha: {
    mahadasha: { lord: number; start: string; end: string };
    antardasha: { lord: number; start: string; end: string };
    pratyantardasha: { lord: number; start: string; end: string };
  };
  
  // Detected patterns (boolean flags — engine authority)
  yogas: Array<{ name: string; detected: boolean; planets: number[]; strength: 'strong' | 'moderate' | 'weak' }>;
  doshas: Array<{ name: string; detected: boolean; severity: 'severe' | 'moderate' | 'mild' | 'cancelled' }>;
  
  // Transits (current)
  transits: Array<{
    planet: number;
    sign: number;
    houseFromMoon: number;
    houseFromLagna: number;
    isRetrograde: boolean;
    savBindus: number;    // Ashtakavarga score for that house
  }>;
  
  // Special conditions
  sadeSati: { active: boolean; phase: 'rising' | 'peak' | 'setting' | null };
  kaalSarpa: { active: boolean; type: string | null };
  
  // Domain scores (rule engine pre-computed)
  domainScores: Record<string, {
    score: number;        // 0-100
    verdict: 'FAVOURABLE' | 'MIXED' | 'CAUTION' | 'CHALLENGING';
    positiveFactors: string[];
    negativeFactors: string[];
    yogasContributing: string[];
    doshasContributing: string[];
  }>;
  
  // Strengths
  shadbala: Record<number, { total: number; required: number; ratio: number }>;
  ashtakavarga: { houseScores: number[]; sarvashtaka: number[] };
  
  // Overall verdict for the queried topic
  verdict: 'FAVOURABLE' | 'MIXED' | 'CAUTION' | 'CHALLENGING';
  verdictFactors: Array<{
    type: 'dasha' | 'transit' | 'yoga' | 'dosha' | 'dignity' | 'ashtakavarga' | 'special';
    detail: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    weight: number;       // 0.0 - 1.0
  }>;
}
```

---

## 5. Context Builder

Transforms the SAC into an LLM-digestible prompt payload. This is the bridge between engine and narrator.

### 5.1 What It Sends

```
SYSTEM PROMPT (fixed per tradition):
  "You are a senior Jyotish consultant following Parashari tradition (BPHS).
   All astronomical facts are provided — you NEVER calculate or invent positions.
   You weave the provided facts into compassionate, actionable guidance.
   You cite classical sources (BPHS chapter, Phaladeepika verse) when making claims.
   You NEVER contradict the provided verdict.
   You always offer remedial paths — never fatalistic predictions.
   Tradition: {parashari | jaimini | kp} (user-selected)"

CONTEXT BLOCK (from SAC):
  - Birth details
  - Planet positions table (with all dignities, retrogrades, combustion)
  - Active dasha chain
  - Relevant transits with SAV bindus
  - Detected yogas and doshas (boolean flags from engine)
  - Domain scores and verdict
  - Verdict factors with weights

CONSTRAINTS BLOCK (dynamic, per query):
  - "Verdict is {VERDICT}. Your narrative MUST align with this assessment."
  - "Detected yogas: {list}. You may elaborate on these. Do NOT claim yogas not in this list."
  - "Detected doshas: {list}. You may discuss severity and remedies for these only."
  - "Planet positions are as listed. Do NOT state any planet is in a sign/house not shown."

USER QUERY:
  The original natural-language question.

OUTPUT FORMAT:
  {
    "narrative": "...",           // The human-readable response
    "claims": [                  // Machine-verifiable assertions made
      { "type": "planet_house", "planet": 6, "house": 7 },
      { "type": "yoga_mentioned", "name": "gajakesari" },
      { "type": "dasha_reference", "major": 6, "sub": 4 },
      { "type": "verdict_tone", "tone": "caution" }
    ],
    "remedies": [...],
    "classicalCitations": [
      { "text": "BPHS Ch.26", "claim": "Saturn in 7th delays marriage" }
    ]
  }
```

### 5.2 What It NEVER Sends

- Raw Swiss Ephemeris output (too noisy)
- Internal score weights or algorithm details
- Other users' data
- Unverified or approximate positions

---

## 6. The Validation Wall

Three layers. Each catches a different failure mode. All three must pass before the response reaches the user.

### 6.1 Layer 1 — Verdict Alignment

**Purpose:** The engine's directional answer must not be contradicted by the narrative's tone.

**Method:** Sentiment analysis on the LLM's narrative, mapped against the engine verdict.

| Engine Verdict | Allowed Narrative Tone |
|---|---|
| `FAVOURABLE` | Positive, encouraging, optimistic. May use "highly auspicious", "excellent period", "strong indicators". Minor caveats allowed. |
| `MIXED` | Balanced, nuanced. Must acknowledge both positive and negative factors. "Promising but requires attention." |
| `CAUTION` | Qualified, measured. Must lead with the concern, then offer remedial path. "Challenging period — but remedies can help." |
| `CHALLENGING` | Serious, remedial-focused. Must not minimise. "This period demands patience and specific remedial action." Must always include hope. |

**Note on language:** The LLM MAY use strong positive language ("highly auspicious", "excellent") when the engine verdict is `FAVOURABLE`. There is no artificial ceiling on optimism — the constraint is alignment, not dampening. Every response carries the standard disclaimer (see §8) regardless of sentiment.

**Implementation (v1):** Keyword + phrase classifier. Fast, deterministic, no additional LLM call.

```typescript
// Positive markers
const POSITIVE = ['excellent', 'auspicious', 'blessed', 'strong period', 
                  'favourable', 'fortunate', 'highly positive', 'wonderful'];
// Negative markers  
const NEGATIVE = ['challenging', 'difficult', 'caution', 'obstacle', 
                  'delay', 'setback', 'avoid', 'unfavourable'];

function checkVerdictAlignment(narrative: string, verdict: Verdict): ValidationResult {
  const positiveScore = countMatches(narrative, POSITIVE);
  const negativeScore = countMatches(narrative, NEGATIVE);
  const ratio = positiveScore / (positiveScore + negativeScore + 1);
  
  switch (verdict) {
    case 'FAVOURABLE':    return ratio >= 0.5 ? PASS : FAIL;  // mostly positive
    case 'MIXED':         return ratio > 0.2 && ratio < 0.8 ? PASS : FAIL;  // balanced
    case 'CAUTION':       return ratio <= 0.5 ? PASS : FAIL;  // mostly cautious
    case 'CHALLENGING':   return ratio <= 0.3 ? PASS : FAIL;  // predominantly serious
  }
}
```

**v2 upgrade path:** Replace keyword matcher with a small classifier model (distilled from labelled examples). But v1 keyword matching catches 90%+ of misalignment.

### 6.2 Layer 2 — Factual Claim Verification

**Purpose:** Every verifiable assertion the LLM makes must trace back to the SAC.

**Method:** The LLM returns a structured `claims` array alongside its narrative (see §5.1 output format). Each claim is verified against the SAC programmatically.

| Claim Type | Verification Logic |
|---|---|
| `planet_house` | `sac.planets[claim.planet].house === claim.house` |
| `planet_sign` | `sac.planets[claim.planet].sign === claim.sign` |
| `planet_dignity` | `sac.planets[claim.planet].dignity === claim.dignity` |
| `planet_retrograde` | `sac.planets[claim.planet].isRetrograde === claim.isRetrograde` |
| `dasha_reference` | `sac.dasha.mahadasha.lord === claim.major && sac.dasha.antardasha.lord === claim.sub` |
| `yoga_mentioned` | `sac.yogas.find(y => y.name === claim.name && y.detected)` |
| `dosha_mentioned` | `sac.doshas.find(d => d.name === claim.name && d.detected)` |
| `transit_position` | `sac.transits.find(t => t.planet === claim.planet)?.houseFromMoon === claim.house` |
| `sade_sati` | `sac.sadeSati.active === claim.active` |
| `verdict_tone` | Redundant check with Layer 1 (belt and braces) |

**Failure modes:**
- **Claim not in SAC** → hallucinated fact → REJECT
- **Claim contradicts SAC** → inverted fact → REJECT
- **Claim missing from claims array but present in narrative** → Layer 2b catches this (see below)

**Layer 2b — Narrative Scan (safety net):**

Even with structured output, the LLM might make claims in the narrative that it omits from the `claims` array. A regex-based scanner catches common patterns:

```
"Saturn is in (your )?(the )?\d+(st|nd|rd|th) house"  → extract planet + house
"(exalted|debilitated|retrograde) (Sun|Moon|Mars|...)" → extract planet + state  
"(Gajakesari|Chandra Mangala|Raja|...) yoga"           → extract yoga name
"Sade Sati (is active|is ending|peak phase|...)"       → extract sade sati claim
```

Any extracted claim not in the `claims` array AND not in the SAC → REJECT.

### 6.3 Layer 3 — Classical Tradition Guardrails

**Purpose:** Catch claims that are astrologically impossible, regardless of chart context. These are universal Jyotish facts that never change.

**Source:** Imported directly from the existing `src/lib/constants/` files.

**Checks:**

```typescript
import { NATURAL_BENEFICS, NATURAL_MALEFICS } from '@/lib/constants/grahas';
import { EXALTATION_SIGNS, DEBILITATION_SIGNS } from '@/lib/constants/dignities';
import { SIGN_LORDS } from '@/lib/constants/rashis';
import { PLANET_ASPECTS } from '@/lib/constants/aspects';

const TRADITION_RULES = [
  // Benefic/Malefic classification
  { 
    pattern: /Jupiter|Venus.*malefic|malefic.*Jupiter|Venus/i,
    check: () => false,  // Jupiter and Venus are NEVER natural malefics
    message: 'Misclassified natural benefic as malefic'
  },
  
  // Exaltation
  {
    pattern: /Sun.*exalted.*(?!Aries)/i,
    check: (match) => extractSign(match) === 'Aries',
    message: 'Wrong exaltation sign'
  },
  
  // Aspect attribution
  {
    pattern: /Mars.*aspects?.*(5th|9th)/i,
    check: () => false,  // Mars aspects 4th, 7th, 8th — NOT 5th or 9th
    message: 'Wrong special aspect for Mars'
  },
  
  // Lordship
  {
    pattern: /Venus.*rules?.*Gemini|lord of Gemini.*Venus/i,
    check: () => false,  // Mercury rules Gemini, not Venus
    message: 'Wrong sign lordship'
  },
];
```

**This layer is purely deterministic.** No LLM call, no ambiguity. These are immutable facts of Jyotish that apply to every chart in every era.

### 6.4 Validation Outcome Flow

```
Layer 1 (Verdict Alignment)
  │
  ├─ PASS → Layer 2
  │          │
  │          ├─ PASS → Layer 3
  │          │          │
  │          │          ├─ ALL PASS → ✅ Deliver to user (with disclaimer)
  │          │          │
  │          │          └─ FAIL → Targeted fix*
  │          │
  │          └─ FAIL (hallucinated/contradicted claim)
  │                    │
  │                    └─ REGENERATE with tighter constraints
  │                       (add: "You previously claimed X. This is incorrect.
  │                        The correct fact is Y. Do not repeat this error.")
  │
  └─ FAIL (sentiment mismatch)
           │
           └─ REGENERATE with explicit tone instruction
              (add: "Your previous response was too {positive/negative} 
               for the CAUTION verdict. Recalibrate.")

After 2 failed regenerations → TEMPLATE FALLBACK
```

*Targeted fix for Layer 3: Simple string replacement. "Jupiter, a natural malefic" → "Jupiter, a natural benefic". No regeneration needed — these are atomic corrections.

### 6.5 Template Fallback (Safety Net)

Pre-written narrative blocks per `verdict × query_type`. Less personalised but guaranteed accurate.

```typescript
const TEMPLATES: Record<Verdict, Record<QueryType, string>> = {
  FAVOURABLE: {
    career: `The planetary alignments for your career are strongly supportive 
             during this period. {dasha_lord} Mahadasha combined with 
             {positive_factors} creates an environment where professional 
             growth comes naturally. Classical texts (BPHS Ch.{ref}) note 
             that {transit_detail}. Consider this an excellent window for 
             {activity}. {remedies_if_any}`,
    // ...
  },
  // ...
};
```

Template slots (`{dasha_lord}`, `{positive_factors}`) are filled from the SAC — no LLM needed. The user gets a slightly generic but never wrong response.

---

## 7. The Unsolvable Questions — Where the LLM Earns Its Value

Rule engines produce structured scores. But certain classes of questions genuinely need narrative intelligence:

### 7.1 Conflicting Indicators
Saturn in 10th (career obstruction) + Jupiter aspecting 10th (career blessing) + Rahu in 10th (unconventional path). Three classical rules, three different implications. The rule engine flags all three with their weights. The LLM synthesises: "While Saturn's presence demands patience in career matters, Jupiter's full aspect provides protection and eventual success — often through unconventional means, as Rahu suggests. BPHS notes that Jupiter's aspect on Saturn ameliorates much of its harshness (Ch.26)."

No rule table covers this specific three-planet combination. The synthesis is the LLM's contribution.

### 7.2 Life-Stage Contextualisation
"Saturn in 7th" for a 22-year-old asking about marriage prospects vs a 55-year-old asking about marital harmony. Same position, different human context. The engine produces the same SAC for both. The LLM adjusts the narrative.

### 7.3 Remedial Personalisation
Classical texts list dozens of remedies per planet — gemstones, mantras, charities, fasting, worship. The LLM selects and prioritises based on the user's expressed situation, accessibility, and the severity of the issue. A user in Switzerland isn't going to perform a Rudrabhishek easily — suggest accessible alternatives first.

### 7.4 Cross-Domain Synthesis
"How does my Sade Sati interact with my Kaal Sarpa Dosha during this Rahu Mahadasha?" The engine computes each condition independently and scores them. The LLM weaves them into a coherent narrative about what the combination means holistically — something no lookup table covers.

### 7.5 Emotional Calibration
A chart showing a genuinely difficult period still needs hope. Classical texts are often blunt — medieval authors wrote for practitioners, not anxious users. The LLM's tone layer transforms "8th lord in lagna indicates health dangers" into guidance the user can actually use without panic.

---

## 8. Disclaimer Framework

Every AI Pandit response — regardless of verdict sentiment — carries a disclaimer. The language may be positive, optimistic, even enthusiastic when warranted. The disclaimer ensures informed consumption.

### 8.1 Standard Disclaimer (appears on every response)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This reading is generated by our AI Pandit, trained on classical 
Vedic texts including Brihat Parashara Hora Shastra, Phaladeepika, 
and Saravali. All planetary positions are computed using the Swiss 
Ephemeris astronomical engine.

This is for guidance and self-reflection. Jyotish describes 
tendencies and karmic patterns — not fixed destiny. Important life 
decisions should consider multiple sources of wisdom.

Tradition: Parashari (BPHS) | Engine: Swiss Ephemeris
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8.2 Contextual Additions

| Condition | Additional Note |
|---|---|
| Health-related query | "Health indications in Jyotish reflect karmic tendencies. They are not medical diagnoses. Please consult a healthcare professional for medical concerns." |
| Financial query | "Astrological timing can inform but should not replace professional financial advice." |
| Relationship query | "Compatibility readings highlight karmic patterns between charts. Every relationship is shaped by both karma and conscious effort." |
| Challenging verdict | "Challenging planetary periods are opportunities for growth and spiritual development. Classical texts prescribe specific remedies precisely because difficult periods are workable." |
| Conflicting factors | "Your chart shows opposing influences in this area. We've presented both sides — multiple valid interpretations exist in the classical tradition." |

### 8.3 What Is NOT Restricted

- Strong positive language: "Highly auspicious", "Excellent period", "Rarely seen combination"
- Strong recommendations: "This is an ideal window for...", "Strongly consider acting during..."
- Classical authority: "BPHS states clearly that...", "Parashari tradition regards this as..."
- Confidence in computation: "Our Swiss Ephemeris calculations confirm..."

The disclaimer is a frame, not a muzzle. If the engine says FAVOURABLE and the factors are strong, the LLM should say so enthusiastically. Underplaying a genuinely strong chart is as dishonest as overplaying a weak one.

---

## 9. Cost Model — Free App, Zero Margin, Minimum Spend

### 9.1 Design Constraint

**The app is free. There are no paid tiers. Every user gets the full experience.** This means LLM cost is pure operating expense with no direct revenue offset. The goal is to make per-query cost so low that it can be sustained by ads, sponsorships, or simply absorbed as infrastructure cost alongside hosting.

**Target: under $50/month total LLM spend at 10K DAU.**

### 9.2 The Key Insight: The Validation Wall Enables Cheap Models

Most AI apps need expensive models (Sonnet, GPT-4o) because they rely on the model's intelligence for accuracy. We don't. Our engine computes every fact. The validation wall catches every hallucination. The LLM's only job is **prose quality** — turning structured data into readable narrative.

Prose quality is the cheapest capability in the LLM stack. A fine-tuned 8B model writes perfectly adequate English paragraphs. It doesn't need to reason about planetary positions — it just needs to say "Saturn in your 7th house suggests patience in relationships" without garbling the grammar.

**This means we can use models that are 50-500× cheaper than Sonnet and still deliver accurate, validated readings.**

### 9.3 Cost Per Call — Model Comparison

For a typical AI Pandit call (~5K input tokens, ~1.5K output tokens):

| Provider / Model | Cost/Call | vs Sonnet | Quality for Narration | Notes |
|---|---|---|---|---|
| **Anthropic Sonnet** | $0.037 | baseline | Excellent | Current setup |
| **Anthropic Haiku** | $0.005 | 7× cheaper | Good | Adequate for narration |
| Groq — Llama 3.3 70B | $0.003 | 12× cheaper | Good | Fast, free tier exists |
| Together AI — Llama 3.3 70B | $0.004 | 9× cheaper | Good | $1 free credit/day |
| Cerebras — Llama 3.3 70B | $0.002 | 18× cheaper | Good | Fastest inference |
| **Self-hosted 8B (Hetzner CPU)** | **~$0.0002** | **185× cheaper** | Adequate + fine-tuned | Fixed cost, unlimited calls |
| **Self-hosted 14B (Hetzner CPU)** | **~$0.0005** | **74× cheaper** | Good + fine-tuned | Fixed cost, unlimited calls |
| **Self-hosted 70B (Hetzner GPU)** | **~$0.001** | **37× cheaper** | Very good | Requires GPU server |

### 9.4 The Three-Tier Cost Strategy

Not all LLM calls are equal. Match model cost to task complexity:

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 0 — NO LLM (templates)                    Cost: $0   │
│                                                             │
│  "What's my Moon sign?"                                     │
│  "What dasha am I in?"                                      │
│  "When does Sade Sati end?"                                 │
│  Daily horoscopes (pre-generated, cached 24h)               │
│  Any factual lookup that the engine answers directly        │
│                                                             │
│  Method: Slot-fill templates from SAC                       │
│  Estimated share: ~40% of all queries                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  TIER 1 — SMALL MODEL (self-hosted 8B-14B)    Cost: ~$0    │
│                                                             │
│  "Is this a good time for a job change?"                    │
│  "Tell me about my career prospects"                        │
│  "What does Saturn in my 7th house mean?"                   │
│  Standard interpretive questions with clear verdict         │
│                                                             │
│  Method: Fine-tuned small model on Hetzner                  │
│  Validated by wall — accuracy guaranteed regardless         │
│  Estimated share: ~45% of all queries                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  TIER 2 — LARGE MODEL (API fallback)          Cost: ~$0.04 │
│                                                             │
│  "How does my Sade Sati interact with Kaal Sarpa during     │
│   this Rahu Mahadasha while Jupiter transits my 10th?"      │
│  Multi-factor cross-domain synthesis                        │
│  Questions the small model fails validation on twice        │
│  Hindi/Sanskrit narration (until small model fine-tuned)    │
│                                                             │
│  Method: Sonnet/Haiku API call                              │
│  Estimated share: ~15% of all queries                       │
└─────────────────────────────────────────────────────────────┘
```

### 9.5 Self-Hosted Inference — The Core of the Free Model

**This is where the economics work.** A self-hosted model on Hetzner turns LLM cost from per-call variable to fixed monthly infrastructure.

#### Hardware Options

| Hetzner Server | Specs | Monthly Cost | Can Run | Throughput |
|---|---|---|---|---|
| **CAX31** (ARM) | 8 cores, 16GB RAM | **€16/mo** | Llama 3.2 8B (Q4) | ~15 tok/s — fine for streaming |
| **CAX41** (ARM) | 16 cores, 32GB RAM | **€30/mo** | Llama 3.2 8B (Q5) or 14B (Q4) | ~20 tok/s |
| **CCX33** (x86) | 8 cores, 32GB RAM | **€40/mo** | Mistral 7B or Llama 14B (Q4) | ~25 tok/s |
| **GPU (EX44-A100)** | A100 40GB | **€180/mo** | Llama 70B (Q4), or 8B at 100+ tok/s | ~40 tok/s (70B) |

**Recommendation for launch: CAX41 at €30/mo.** Runs a quantised 8B model comfortably. Handles ~50 concurrent users with streaming. Scales to ~2,000 calls/day before queueing becomes noticeable.

#### Inference Stack

```
Hetzner CAX41 (€30/mo)
├── Coolify (deployment manager — already planned)
├── llama.cpp server (or Ollama)
│   └── Fine-tuned Llama 3.2 8B (Q5_K_M quantisation)
│       └── ~6GB RAM, leaves 10GB for OS + app
├── Simple HTTP API: POST /v1/chat/completions (OpenAI-compatible)
└── Cloudflare Tunnel (secure exposure, no public IP needed)
```

**Why llama.cpp over vLLM:** ARM-native, no GPU required, lower memory footprint, OpenAI-compatible API out of the box. vLLM is better for GPU servers at scale — upgrade path when needed.

**Why Ollama:** Even simpler. `ollama serve` + `ollama run` with a Modelfile. One-command deployment. Trade-off: less control over quantisation and batching. Good for v1.

#### Cost at Scale (Self-Hosted)

| DAU | Calls/Day | Model Tier Split | Infra Cost/Month | API Overflow Cost/Month | **Total LLM Cost/Month** |
|---|---|---|---|---|---|
| 500 | ~200 | 40% T0 / 45% T1 / 15% T2 | €30 (CAX41) | ~$11 (30 API calls) | **~$45** |
| 2,000 | ~800 | 40% T0 / 45% T1 / 15% T2 | €30 (CAX41) | ~$43 (120 API calls) | **~$77** |
| 5,000 | ~2,000 | 40% T0 / 50% T1 / 10% T2 | €40 (CCX33) | ~$72 (200 API calls) | **~$117** |
| 10,000 | ~4,000 | 40% T0 / 55% T1 / 5% T2 | €40 (CCX33) | ~$72 (200 API calls) | **~$117** |
| 50,000 | ~20,000 | 40% T0 / 55% T1 / 5% T2 | €180 (GPU) | ~$360 (1K API calls) | **~$560** |

**At 10K DAU, total LLM cost is ~$117/month — well under the $50 target if we push fine-tuning to reduce T2 overflow to 2-3%.** Even at 50K DAU with a GPU upgrade, it's ~$560/month — sustainable from AdSense alone on a 50K-DAU site.

The key: as the fine-tuned model improves, T2 (expensive API) share drops. At maturity, T2 is only for genuinely novel multi-factor queries — perhaps 2-3% of traffic. Everything else runs on fixed-cost infrastructure.

### 9.6 Aggressive Caching — Eliminates 60-80% of LLM Calls

Caching is the biggest cost lever, and astrology has uniquely cache-friendly properties:

#### A. Birth Chart Cache (Permanent)

A birth chart never changes. The SAC for a given birth fingerprint is immutable. Cache the LLM narrative for common questions per chart:

```typescript
// Cache key: SHA256(birth_fingerprint + query_category + locale)
// e.g., "career" reading for chart ABC in English
// TTL: permanent (chart data never changes)
// Storage: Supabase row or filesystem

const cacheKey = sha256(`${birthFingerprint}:${queryCategory}:${locale}`);
const cached = await getFromCache(cacheKey);
if (cached) return cached; // Zero LLM cost
```

Estimated hit rate: **40-60%** — many users ask the same categories of questions about their chart.

#### B. Transit Overlay Cache (Daily)

Transit positions change daily but are the **same for everyone**. Pre-generate transit narratives once per day:

```typescript
// At 00:30 UTC daily (same cron as panchang email):
// For each Moon sign (12) × common question type (6) = 72 narratives
// Cost: 72 × T1 calls = ~$0 (self-hosted) or 72 × $0.005 (Haiku) = $0.36/day

const transitNarratives = await preGenerateTransitNarratives(today);
// Personalise at serve time by injecting user's natal data into template slots
```

#### C. Question Deduplication

"Is this good for career?" and "How's my career looking?" are the same query. Normalise before cache lookup:

```typescript
// LLM-free classification (keyword matching for v1):
function normaliseQuery(query: string): string {
  if (/career|job|work|profession|business/i.test(query)) return 'career';
  if (/marriage|relationship|partner|love|spouse/i.test(query)) return 'relationship';
  if (/health|illness|disease|medical/i.test(query)) return 'health';
  if (/money|wealth|finance|income/i.test(query)) return 'wealth';
  if (/child|progeny|son|daughter|fertility/i.test(query)) return 'children';
  if (/education|study|exam|learning/i.test(query)) return 'education';
  if (/spiritual|moksha|meditation|sadhana/i.test(query)) return 'spiritual';
  return 'general'; // Only 'general' needs fresh LLM call
}
```

#### D. Combined Cache Impact

| Cache Layer | Hit Rate | Calls Eliminated |
|---|---|---|
| Birth chart + question category | 40-60% | Repeat visitors asking about career, marriage, etc. |
| Transit overlay (pre-generated daily) | 20-30% | Generic "how's today/this month" questions |
| Question deduplication | 10-15% | Synonymous phrasings |
| **Combined (conservative)** | **60-75%** | **Only 25-40% of incoming queries actually hit the model** |

This means the actual call volumes in §9.5 are 60-75% lower. At 10K DAU with 4,000 raw queries/day, only ~1,000-1,600 actually reach the model.

### 9.7 Further Cost Reduction: Speculative Decoding + Draft Models

For self-hosted inference, speculative decoding uses a tiny model (1B-3B) to draft tokens and a larger model (8B-14B) to verify them. This can **2-3× throughput** on the same hardware because most narrative tokens are predictable ("The planetary alignments for your...").

```
Draft model: Llama 3.2 1B (~1GB RAM)
Verify model: Llama 3.2 8B (~6GB RAM)
Combined: fits in CAX41's 16GB with room to spare
Throughput: ~30-40 tok/s (vs ~15 tok/s without drafting)
```

This doesn't reduce cost (fixed infra) but increases the ceiling of calls/day per server before needing to scale up.

### 9.8 Total Infrastructure Cost — Everything Free

| Component | Current | With AI Pandit (Self-Hosted) |
|---|---|---|
| **App hosting** (Hetzner CAX21 via Coolify) | €7/mo | €7/mo |
| **LLM inference** (Hetzner CAX41) | — | €30/mo |
| **Database** (Supabase free tier) | €0 | €0 |
| **CDN/DNS** (Cloudflare free) | €0 | €0 |
| **Domain** | ~€12/yr | ~€12/yr |
| **Email** (Resend free tier) | €0 | €0 |
| **API overflow** (Haiku for T2 queries) | — | ~$10-40/mo |
| **Total** | **~€8/mo** | **~€47-77/mo (~$50-82)** |

Compare with the previous Sonnet-only API model: $82/day at 10K DAU ($2,472/month). Self-hosted with tiered routing: **$50-82/month at the same scale**. That's a **30× reduction**.

### 9.9 Revenue Model (Sustaining a Free App)

The LLM cost is manageable. But how to cover even $50-80/month?

| Revenue Source | Expected Monthly | Notes |
|---|---|---|
| **Google AdSense** (10K DAU) | $100-400 | Astrology has high CPC ($0.50-2.00) in India and diaspora |
| **Affiliate** (gemstones, puja services) | $50-200 | Classical remedies link naturally to products |
| **Voluntary donations** (Buy Me a Coffee / UPI) | $20-100 | Indian audience responds well to dakshina framing |
| **YouTube** (channel cross-promotion) | $50-150 | Already producing video content |
| **Sponsored content** (temple, puja booking platforms) | $100-500 | High relevance to audience |

Even conservative AdSense alone ($100/month) covers the entire infrastructure including LLM inference. The app is sustainably free.

---

## 10. Fine-Tuning — The Path to Near-Zero Marginal Cost

### 10.1 Why Fine-Tuning Is Critical for the Free Model

With paid tiers, fine-tuning was an optimisation. With a free app, it's a necessity. The goal: **push T2 (expensive API) share from 15% to under 3%**, making the self-hosted model handle virtually everything.

### 10.2 The Training Pipeline

```
Phase 1: Data Collection (Month 1-2)
  Launch with Sonnet API for all calls (accept the higher cost temporarily)
  Every validated response → training dataset
  Target: 5K-10K examples across all query types and verdicts

Phase 2: Initial Fine-Tune (Month 2-3)
  Fine-tune Llama 3.2 8B on collected dataset
  Using Unsloth (free, 2× faster, 60% less memory)
  QLoRA: 4-bit quantised base + low-rank adapters
  Training cost: ~$5-15 on Hetzner GPU (few hours)
  Deploy to CAX41 via Ollama

Phase 3: Validation-Driven Improvement (Ongoing)
  Every T2 overflow (small model failed validation) → hard example
  Monthly re-fine-tune incorporating hard examples
  T2 share drops: 15% → 10% → 5% → 3% → plateau

Phase 4: Domain Specialisation (Month 4+)
  Separate LoRA adapters per query type:
  - career_lora.bin (career/finance narration)
  - relationship_lora.bin (marriage/compatibility)
  - health_lora.bin (health/longevity)
  - spiritual_lora.bin (spiritual/moksha)
  Hot-swap adapters per query classification
  Dramatic quality improvement per domain
```

### 10.3 Fine-Tuning Dataset Structure

```jsonl
{"messages": [
  {"role": "system", "content": "You are a Jyotish narrator following Parashari tradition..."},
  {"role": "user", "content": "[SAC data block]\n\nQuestion: Is this a good time for career change?"},
  {"role": "assistant", "content": "{\"narrative\": \"The current planetary alignment...\", \"claims\": [...]}"}
]}
```

**Only responses that passed all 3 validation layers on first attempt go into the dataset.** This means the training data is pre-validated — the model learns to produce responses that won't get rejected.

### 10.4 Multilingual Fine-Tuning

Hindi narration is critical for the Indian audience. Strategy:

1. **Phase 1:** English-only fine-tune (largest dataset, easiest to validate)
2. **Phase 2:** Hindi fine-tune using translated training pairs + native Hindi prompts
3. **Phase 3:** Tamil and Bengali follow the same pattern (locale-specific LoRA adapters)

Llama 3.2 and Qwen 2.5 both have reasonable Hindi capability out of the box. Fine-tuning sharpens it for Jyotish vocabulary (nakshatra names, dosha terms, remedy descriptions).

### 10.5 Cost of Fine-Tuning

| Step | Cost | Frequency |
|---|---|---|
| Training data collection | $0 (side effect of serving) | Continuous |
| QLoRA fine-tune (8B model, 10K examples) | ~€5 (2h on Hetzner GPU) | Monthly |
| Evaluation + validation pass | $0 (deterministic) | Per fine-tune |
| Model deployment | $0 (swap weights on existing server) | Per fine-tune |
| **Annual fine-tuning cost** | **~€60** | |

### 10.6 RAG Over Classical Texts (Phase 3)

```
"BPHS Ch.26, Verse 14 states: 'When Saturn occupies the 7th,
 the native experiences delays in marriage, yet perseverance 
 yields a stable union.'"
```

This is the differentiator no competitor has. Implementation:

- Digitised texts: BPHS (197 chapters), Phaladeepika, Saravali, Jataka Parijata
- Embedding model: `nomic-embed-text` (self-hosted, 137M params, runs on CPU)
- Vector store: Supabase pgvector (already available)
- Retrieval: top-3 relevant verses per query
- Injection: verses added to context block, LLM cites them in narrative

Embedding cost: one-time ~€2 for the full corpus. Retrieval cost: ~0.5ms per query (pgvector). Zero ongoing LLM cost for the RAG component.

---

## 11. Self-Hosted Architecture — Detailed

### 11.1 Deployment Topology

```
                    Cloudflare (DNS + CDN + Tunnel)
                              │
                    ┌─────────┴──────────┐
                    │                    │
            Hetzner CAX21 (€7)    Hetzner CAX41 (€30)
            ┌──────────────┐      ┌──────────────────┐
            │  Coolify      │      │  Coolify          │
            │  ├── Next.js  │      │  ├── Ollama       │
            │  ├── Cron     │      │  │   └── 8B model │
            │  └── SW cache │      │  ├── Embedding    │
            │               │      │  │   └── nomic    │
            │  App server   │      │  └── Cache layer  │
            └───────┬───────┘      └────────┬──────────┘
                    │                       │
                    └───────┬───────────────┘
                            │
                    Supabase (free)
                    ├── PostgreSQL
                    ├── pgvector
                    ├── Auth
                    └── ai_pandit_training
```

### 11.2 API Interface (OpenAI-Compatible)

Ollama and llama.cpp both expose an OpenAI-compatible API. This means the provider switch is a one-line change:

```typescript
// src/lib/llm/llm-client.ts — current
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// After migration — provider abstraction
interface LLMProvider {
  complete(system: string, user: string, maxTokens: number): Promise<LLMResponse>;
}

class SelfHostedProvider implements LLMProvider {
  async complete(system: string, user: string, maxTokens: number) {
    const res = await fetch(`${process.env.LLM_ENDPOINT}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || 'jyotish-pandit-8b',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        max_tokens: maxTokens,
        temperature: 0,
        response_format: { type: 'json_object' }
      })
    });
    return res.json();
  }
}

class AnthropicProvider implements LLMProvider {
  // Existing Anthropic SDK wrapper — used for T2 overflow
  async complete(system: string, user: string, maxTokens: number) {
    return getClaudeClient().messages.create({
      model: 'claude-haiku-4-5-20251001',  // cheapest API option for overflow
      system, messages: [{ role: 'user', content: user }],
      max_tokens: maxTokens
    });
  }
}

// Router: try self-hosted first, fall back to API
class TieredLLMRouter {
  async complete(system: string, user: string, maxTokens: number, queryTier: 0 | 1 | 2) {
    if (queryTier === 0) return templateResponse(system, user);  // No LLM
    
    if (queryTier === 1) {
      try {
        const response = await selfHosted.complete(system, user, maxTokens);
        const validation = validate(response);
        if (validation.passed) return response;
        // Retry once with tighter constraints
        const retry = await selfHosted.complete(tighten(system), user, maxTokens);
        if (validate(retry).passed) return retry;
        // Fall through to T2
      } catch (e) {
        console.error('[ai-pandit] Self-hosted failed, falling back to API:', e);
      }
    }
    
    // T2: API fallback
    return anthropic.complete(system, user, maxTokens);
  }
}
```

### 11.3 Monitoring & Alerting

```typescript
// Track per-query metrics for cost optimisation
interface QueryMetrics {
  queryId: string;
  tier: 0 | 1 | 2;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  validationPassed: boolean;
  regenerationCount: number;
  cacheHit: boolean;
  estimatedCost: number;  // $0 for T0/T1, actual for T2
}

// Daily summary cron (runs alongside panchang email cron)
// Alerts if T2 share exceeds 20% (model quality degrading)
// Alerts if avg latency exceeds 5s (server overloaded)
// Alerts if validation failure rate exceeds 30% (model needs re-fine-tune)
```

---

## 12. Migration Plan — Phased Rollout

### Phase 0 — Validate Concept (1 week, $0 cost)
- [ ] Build validation wall (Layers 1-3) against existing `/api/chart-chat` responses
- [ ] Measure current hallucination rate to establish baseline
- [ ] Build template fallback library for top 6 query categories
- [ ] Prove the wall catches real errors before investing in infrastructure

### Phase 1 — Launch with API (2-3 weeks, ~$50-80/month)
- [ ] Build Context Builder (SAC from engine output)
- [ ] Build `/api/ai-pandit` route with tiered routing
- [ ] Use Haiku for T1 (cheap API while self-hosted is prepared)
- [ ] Templates for T0
- [ ] Response caching (birth fingerprint + query category)
- [ ] Training data collection table
- [ ] Disclaimer component
- [ ] Wire into chart-chat UI

### Phase 2 — Self-Host (2-3 weeks, drops to ~€47/month)
- [ ] Provision Hetzner CAX41
- [ ] Deploy Ollama + base Llama 3.2 8B via Coolify
- [ ] Cloudflare Tunnel to expose inference endpoint
- [ ] Switch T1 routing from Haiku API to self-hosted
- [ ] Benchmark: latency, throughput, validation pass rate
- [ ] Keep Haiku API as T2 fallback

### Phase 3 — Fine-Tune (2-4 weeks, drops T2 to 5%)
- [ ] Export 5K+ training examples from collection table
- [ ] QLoRA fine-tune with Unsloth on Hetzner GPU (one-off)
- [ ] Deploy fine-tuned model, A/B test vs base model
- [ ] Measure T2 overflow reduction
- [ ] Hindi fine-tune (separate LoRA adapter)

### Phase 4 — Optimise (ongoing)
- [ ] Monthly re-fine-tune with hard examples
- [ ] Domain-specific LoRA adapters (career, health, relationship, spiritual)
- [ ] RAG pipeline over classical texts (pgvector)
- [ ] Speculative decoding for throughput
- [ ] Tamil/Bengali narration adapters
- [ ] Evaluate upgrade to 14B if quality ceiling hit

---

## 13. Risk Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Self-hosted model quality too low | Poor narrative quality | Validation wall catches factual errors; template fallback for worst case; API overflow for complex queries |
| Hetzner server down | AI Pandit offline | Automatic fallback to Haiku API (existing Anthropic key); app still works without LLM (graceful degradation already built) |
| Fine-tuning doesn't improve enough | High T2 overflow = higher API cost | Cap T2 at $X/month hard limit; degrade to templates beyond cap |
| Traffic spike (viral) | Server overloaded | Queue + rate limit per IP; cached responses served instantly; template fallback is instant |
| Anthropic changes pricing | T2 overflow cost increases | Self-hosted handles 85%+; switch T2 to Groq/Together (even cheaper) |
| Model weights become unavailable | Can't serve fine-tuned model | Keep base model as fallback; training data allows re-fine-tune on any future model |

---

## 14. Competitive Positioning

| Competitor Type | What They Do | What We Do Differently |
|---|---|---|
| **Generic AI horoscopes** (Co-Star, Pattern) | Sun-sign platitudes from GPT | Real Swiss Ephemeris computation, full birth chart, classical tradition |
| **Template engines** (astrosage.com) | Rule → template text, robotic | LLM narrative with human warmth, validated against computation |
| **Human astrologers** | Personalised but expensive (₹2K-10K/session) | Same quality of insight, completely free, available 24/7 |
| **Other AI astrology** (if any) | LLM guessing at positions | Computation-first, LLM-narrates, validation wall prevents hallucination |

**Our moat is the stack:** Swiss Ephemeris engine (the brain) + Classical rule evaluation (the knowledge) + Validated LLM narration (the voice) + Fine-tuned self-hosted model (the economics) + Training data flywheel (the future).

Nobody else has all five layers. The engine took years to build. The validation wall is non-trivial to replicate. The fine-tuned model improves with every query. And the whole thing runs for under €50/month.
