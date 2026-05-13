# AI Pandit — Comprehensive Design Document

> **Status:** FINALISED (reviewed 2026-05-13 — 12 issues found and addressed, see §11)
> **Date:** 2026-05-13
> **Companion docs:**
> - `ai-pandit-engine.md` — architecture overview + cost model
> - `ai-pandit-module-spec.md` — file structure, types, build flags, testing strategy
>
> **This document** covers the detailed design: data flows, algorithms, validation
> engine internals, prompt engineering, template system, and provider routing —
> everything an implementer needs to write the code without ambiguity.

---

## Table of Contents

1. [End-to-End Data Flow](#1-end-to-end-data-flow)
2. [Context Builder — KundaliData to SAC](#2-context-builder)
3. [Prompt Engineering](#3-prompt-engineering)
4. [Query Classification Engine](#4-query-classification-engine)
5. [Validation Engine (Deep Dive)](#5-validation-engine)
6. [Provider Router & Retry Logic](#6-provider-router)
7. [Template Engine](#7-template-engine)
8. [Cache System](#8-cache-system)
9. [Disclaimer System](#9-disclaimer-system)
10. [Error Handling & Graceful Degradation](#10-error-handling)

---

## 1. End-to-End Data Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                          consultPandit()                              │
│                                                                      │
│  ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌──────────────────┐ │
│  │ CLASSIFY │───▶│ CACHE   │───▶│ BUILD    │───▶│ BUILD PROMPT     │ │
│  │ QUERY    │    │ LOOKUP  │    │ SAC      │    │ (system + user)  │ │
│  └─────────┘    └────┬────┘    └──────────┘    └────────┬─────────┘ │
│                      │                                   │           │
│                 cache hit?                                │           │
│                   │    │                                  │           │
│                  yes   no                                 │           │
│                   │    │                                  ▼           │
│                   │    │         ┌──────────────────────────────────┐│
│                   │    │         │         PROVIDER ROUTER          ││
│                   │    │         │                                  ││
│                   │    │         │  ┌──────┐  ┌──────┐  ┌────────┐ ││
│                   │    └────────▶│  │TIER 0│  │TIER 1│  │TIER 2  │ ││
│                   │              │  │templ.│  │self- │  │API     │ ││
│                   │              │  │      │  │hosted│  │fallback│ ││
│                   │              │  └──┬───┘  └──┬───┘  └───┬────┘ ││
│                   │              │     │         │           │      ││
│                   │              └─────┼─────────┼───────────┼──────┘│
│                   │                    │         │           │       │
│                   │                    │         ▼           ▼       │
│                   │                    │  ┌──────────────────────┐   │
│                   │                    │  │  PARSE LLM OUTPUT    │   │
│                   │                    │  │  (JSON → LLMOutput)  │   │
│                   │                    │  └──────────┬───────────┘   │
│                   │                    │             │               │
│                   │                    │             ▼               │
│                   │                    │  ┌──────────────────────┐   │
│                   │                    │  │  VALIDATION WALL     │   │
│                   │                    │  │                      │   │
│                   │                    │  │  L1: Verdict align   │   │
│                   │                    │  │  L2: Claim verify    │   │
│                   │                    │  │  L2b: Narrative scan │   │
│                   │                    │  │  L3: Tradition guard │   │
│                   │                    │  └──────────┬───────────┘   │
│                   │                    │             │               │
│                   │                    │        pass / fail          │
│                   │                    │          │      │           │
│                   │                    │         pass   fail         │
│                   │                    │          │      │           │
│                   │                    │          │   retry ≤ 2?     │
│                   │                    │          │    yes / no      │
│                   │                    │          │     │     │      │
│                   │                    │          │  retry   template│
│                   │                    │          │     │     │      │
│                   ▼                    ▼          ▼     │     ▼      │
│              ┌──────────────────────────────────────────────────┐    │
│              │              BUILD RESPONSE                      │    │
│              │  narrative + disclaimer + validation metadata    │    │
│              └──────────────────────┬───────────────────────────┘    │
│                                     │                               │
│                                     ▼                               │
│              ┌──────────────────────────────────────────────┐       │
│              │  CACHE STORE + onValidatedResponse callback  │       │
│              └──────────────────────────────────────────────┘       │
│                                     │                               │
│                                     ▼                               │
│                             PanditResponse                          │
└──────────────────────────────────────────────────────────────────────┘
```

### Step-by-step walkthrough

| Step | Function | Input | Output | Cost |
|------|----------|-------|--------|------|
| 1 | `classifyQuery()` | `PanditQuery` | `ClassifiedQuery` (category, complexity, tier, cacheKey) | $0 (pure code) |
| 2 | `checkCache()` | `cacheKey` | `PanditResponse \| null` | $0 |
| 3 | `buildContext()` | `KundaliData` + `ClassifiedQuery` | `StructuredAstrologicalContext` | $0 (calls existing engine) |
| 4 | `buildPrompt()` | `SAC` + `PanditQuery` | `{ system: string, user: string }` | $0 |
| 5 | `route()` | tier + prompts | `LLMOutput \| TemplateOutput` | $0 (T0), ~$0 (T1), ~$0.005 (T2) |
| 6 | `validate()` | `LLMOutput` + `SAC` | `ValidationResult` | $0 (pure code) |
| 7 | `buildResponse()` | narrative + validation + disclaimer | `PanditResponse` | $0 |
| 8 | `cacheStore()` + callback | `PanditResponse` | side effects | $0 |

---

## 2. Context Builder

### 2.1 Purpose

Transforms the existing `KundaliData` (the engine's output, ~50 fields) into a `StructuredAstrologicalContext` (SAC) — a flattened, LLM-readable representation that serves as the single source of truth for both the prompt and the validation wall.

### 2.2 Mapping Rules

```typescript
function buildContext(kundali: KundaliData, query: ClassifiedQuery): StructuredAstrologicalContext {

  // --- Birth ---
  const birth = {
    date: kundali.birthData.date,
    time: kundali.birthData.time,
    place: kundali.birthData.place,
    coordinates: [kundali.birthData.lat, kundali.birthData.lng] as [number, number],
    timezone: kundali.birthData.timezone,
  };

  // --- Ascendant ---
  const ascSign = kundali.ascendant.sign;            // 1-12
  const ascDeg = kundali.ascendant.degree;
  const ascNak = getNakshatraForDegree(ascDeg);      // from existing nakshatra util
  const ascendant = {
    sign: ascSign,
    signName: RASHIS[ascSign - 1].name.en,
    degree: formatDegree(ascDeg),
    nakshatra: ascNak.name,
    pada: ascNak.pada,
  };

  // --- Planets ---
  // Map each PlanetPosition to SACPlanet.
  // Key: use English names for LLM readability in the prompt.
  // Dignity: computed from sign using existing getDignity() from synthesizer.ts
  const planets: SACPlanet[] = kundali.planets.map(p => ({
    id: p.planet.id,
    name: GRAHAS[p.planet.id].name.en,
    sign: p.sign,
    signName: RASHIS[p.sign - 1].name.en,
    house: p.house,
    degree: p.degree,
    nakshatra: p.nakshatra.name.en,
    pada: p.pada,
    dignity: computeDignityLabel(p.planet.id, p.sign),   // reuse from constants/dignities
    isRetrograde: p.isRetrograde,
    isCombust: p.isCombust,
    speed: p.speed ?? 0,
  }));

  // --- Dasha ---
  // Find active maha/antar/pratyantar by comparing today's date against start/end
  const today = new Date().toISOString().slice(0, 10);
  const activeMaha = findActivePeriod(kundali.dashas, today, 'maha');
  const activeAntar = findActivePeriod(activeMaha?.subPeriods ?? [], today, 'antar');
  const activePratyantar = findActivePeriod(activeAntar?.subPeriods ?? [], today, 'pratyantar');

  const dasha: SACDasha = {
    mahadasha: {
      lordId: planetNameToId(activeMaha.planet),
      lordName: activeMaha.planet,
      start: activeMaha.startDate,
      end: activeMaha.endDate,
    },
    antardasha: { /* same pattern */ },
    pratyantardasha: activePratyantar ? { /* same */ } : undefined,
  };

  // --- Yogas ---
  // Map from YogaComplete[] (engine output) to SACYoga[]
  // Only include detected yogas (detected: true). The LLM must not claim undetected yogas.
  const yogas: SACYoga[] = (kundali.yogasComplete ?? [])
    .filter(y => y.detected)
    .map(y => ({
      name: y.name.en,
      detected: true,
      planets: y.planets ?? [],
      strength: y.strength ?? 'moderate',
      category: y.category ?? 'general',
    }));

  // --- Doshas ---
  // Extract from yogasComplete where category = 'dosha', or from tippanni engine
  const doshas: SACDosha[] = (kundali.yogasComplete ?? [])
    .filter(y => y.category === 'dosha' && y.detected)
    .map(d => ({
      name: d.name.en,
      detected: true,
      severity: d.severity ?? 'moderate',
    }));

  // --- Transits ---
  // Reuse computeCurrentTransits() from domain-synthesis/transit-activation.ts
  // This computes live planetary positions and their house positions from Moon and Lagna
  const transits = computeCurrentTransits(kundali).map(t => ({
    planetId: t.planetId,
    planetName: GRAHAS[t.planetId].name.en,
    sign: t.transitSign,
    houseFromMoon: t.transitHouse,        // house from Moon sign
    houseFromLagna: computeHouseFromLagna(t.transitSign, ascSign),
    isRetrograde: t.isRetrograde ?? false,
    savBindus: t.savBindus ?? 0,
  }));

  // --- Special conditions ---
  const sadeSati = kundali.sadeSati
    ? { active: kundali.sadeSati.isActive, phase: kundali.sadeSati.phase }
    : { active: false, phase: null };

  // Kaal Sarpa: check yogas for kaal_sarpa category
  const kaalSarpaYoga = yogas.find(y => y.name.toLowerCase().includes('kaal sarpa'));
  const kaalSarpa = {
    active: !!kaalSarpaYoga,
    type: kaalSarpaYoga?.name ?? null,
  };

  // --- Shadbala ---
  const shadbala: Record<number, { total: number; required: number; ratio: number }> = {};
  for (const sb of kundali.shadbala) {
    const pid = planetNameToId(sb.planet);
    const required = SHADBALA_REQUIRED[pid] ?? 1;
    shadbala[pid] = {
      total: sb.totalStrength,
      required,
      ratio: sb.totalStrength / required,
    };
  }

  // --- Ashtakavarga ---
  const ashtakavarga = kundali.ashtakavarga
    ? { houseScores: kundali.ashtakavarga.savTable }
    : null;

  // --- Domain verdicts ---
  // Reuse existing scoreDomain() for each relevant domain
  // This is the pre-computed directional answer from the rule engine
  const domainVerdicts = computeDomainVerdicts(kundali, query.category);

  // --- Primary verdict ---
  const primaryDomain = domainVerdicts[query.category];
  const primaryVerdict = primaryDomain?.verdict ?? 'MIXED';
  const primaryFactors = primaryDomain?.factors ?? [];

  return {
    birth, ascendant, planets, dasha, yogas, doshas, transits,
    sadeSati, kaalSarpa, shadbala, ashtakavarga,
    domainVerdicts, primaryVerdict, primaryFactors,
  };
}
```

### 2.3 Key Design Decisions

- **English names in SAC** — even for Hindi queries. The SAC is a structured data format, not user-facing text. English is used because LLMs handle structured English more reliably for claim extraction. The Hindi rendering happens in the narrative.
- **No duplication** — `scoreDomain()`, `computeCurrentTransits()`, dignity computation all import from existing modules. The context builder is a translator, not a calculator.
- **v1: full SAC always** — no context slimming. The ~5K token cost is negligible on self-hosted. Slimming is a v2 optimisation.

---

## 3. Prompt Engineering

### 3.1 System Prompt (Fixed Per Tradition)

```
You are a senior Jyotish consultant with 30 years of experience, following
{tradition} tradition ({tradition_source}).

ABSOLUTE RULES:
1. All planetary positions, yogas, doshas, and dashas are PROVIDED to you.
   You NEVER calculate or invent positions. If a planet is not listed in
   a house, it is NOT in that house.
2. Your verdict alignment: the overall assessment is {verdict}. Your
   narrative MUST align with this assessment. Do not contradict it.
3. You NEVER claim a yoga or dosha that is not in the provided list.
4. You ALWAYS offer remedial paths for challenging periods. Never fatalistic.
5. You cite classical sources when making claims (BPHS chapter, verse).

LANGUAGE:
- Respond in {locale_instruction}.
- {hindi_instruction}

OUTPUT FORMAT:
Respond with ONLY valid JSON matching this schema:
{
  "narrative": "Your full narrative response (3-8 paragraphs)",
  "claims": [
    {"type": "planet_house", "data": {"planet": 6, "house": 7}},
    {"type": "yoga_mentioned", "data": {"name": "gajakesari"}},
    ...
  ],
  "remedies": [
    {"type": "mantra", "name": "...", "instructions": "..."}
  ],
  "classicalCitations": [
    {"text": "BPHS Ch.26", "claim": "Saturn in 7th delays marriage"}
  ]
}
```

Where `{hindi_instruction}` is:

```
For Hindi (locale = 'hi'):
  "Respond in शुद्ध हिन्दी using proper Jyotish terminology.
   Use: दशा (not dasha), गोचर (not transit), भाव (not house),
   राशि (not sign), ग्रह (not planet), उच्च (not exalted),
   नीच (not debilitated), वक्री (not retrograde), अस्त (not combust),
   शुभ (not auspicious), अशुभ (not inauspicious).
   NEVER mix English words into Hindi sentences.
   Devanagari numerals are optional — Arabic numerals (1,2,3) are acceptable."

For English (locale = 'en'):
  "Respond in clear, accessible English. Use Jyotish terms with
   brief parenthetical explanations for non-obvious ones."
```

### 3.2 User Prompt Construction

```
=== BIRTH DATA ===
Date: {birth.date} | Time: {birth.time} | Place: {birth.place}
Coordinates: {birth.coordinates} | Timezone: {birth.timezone}

=== ASCENDANT ===
{ascendant.signName} ({ascendant.degree}) | Nakshatra: {ascendant.nakshatra} Pada {ascendant.pada}

=== PLANETARY POSITIONS ===
| Planet    | Sign        | House | Degree    | Nakshatra      | Pada | Dignity      | R? | Combust? |
|-----------|-------------|-------|-----------|----------------|------|--------------|----|----------|
| Sun       | Aries       | 1     | 10°15'22" | Ashwini        | 3    | exalted      | No | No       |
| Moon      | Scorpio     | 8     | 05°42'18" | Anuradha       | 2    | debilitated  | No | No       |
| ...       | ...         | ...   | ...       | ...            | ...  | ...          | .. | ..       |

=== ACTIVE DASHA ===
Mahadasha: Saturn (2023-04-15 to 2042-04-15)
Antardasha: Mercury (2025-01-20 to 2027-10-01)
Pratyantardasha: Venus (2026-03-15 to 2026-08-22)

=== DETECTED YOGAS ===
- Gajakesari Yoga (strong) — Jupiter, Moon
- Budhaditya Yoga (moderate) — Sun, Mercury

=== DETECTED DOSHAS ===
- Mangal Dosha (moderate)

=== CURRENT TRANSITS ===
| Planet  | Sign    | From Moon | From Lagna | R? | SAV Bindus |
|---------|---------|-----------|------------|----|------------|
| Jupiter | Taurus  | 11th      | 2nd        | No | 5          |
| Saturn  | Pisces  | 5th       | 12th       | No | 3          |
| ...     | ...     | ...       | ...        | .. | ...        |

=== SPECIAL CONDITIONS ===
Sade Sati: Active (peak phase)
Kaal Sarpa: Not active

=== DOMAIN ASSESSMENT ===
Category: {query.category}
Verdict: {primaryVerdict}
Key factors:
- [positive] Jupiter transits 11th from Moon (SAV 5 — strong)
- [negative] Sade Sati peak phase active
- [positive] Gajakesari Yoga supports this domain
- [negative] Saturn-Mercury dasha — Saturn is functional malefic for this lagna

=== CONSTRAINTS ===
- Verdict is {primaryVerdict}. Your narrative MUST align.
- You may elaborate on ONLY the yogas listed above. No others.
- You may discuss ONLY the doshas listed above. No others.
- Planet positions are as shown. Do NOT claim any planet in a different house/sign.

=== USER QUESTION ===
{query.originalText}
```

### 3.3 Retry Prompt (When Validation Fails)

On retry, the prompt is augmented with the specific failure:

```
=== CORRECTION NOTICE ===
Your previous response was rejected by our verification system.

Failures:
1. [Layer 1] Verdict mismatch: verdict is CAUTION but your narrative was
   predominantly positive. Recalibrate tone — acknowledge challenges first,
   then offer remedial path.
2. [Layer 2] Claim error: you stated "Jupiter is in the 10th house" but
   Jupiter is actually in the 3rd house. Correct this.

Generate a new response that addresses these specific issues.
All other constraints from the original prompt still apply.
```

---

## 4. Query Classification Engine

### 4.1 Algorithm

```typescript
function classifyQuery(query: PanditQuery): ClassifiedQuery {
  const text = query.text.toLowerCase().trim();

  // Step 1: Determine category
  const category = classifyCategory(text, query.locale);

  // Step 2: Determine complexity
  const complexity = classifyComplexity(text, query.locale);

  // Step 3: Determine tier
  const tier = assignTier(category, complexity);

  // Step 4: Build cache key
  const cacheKey = buildCacheKey(query);

  // Step 5: Determine required modules
  const requiredModules = getRequiredModules(category, complexity);

  return {
    originalText: query.text,
    locale: query.locale,
    category,
    complexity,
    tier,
    cacheKey,
    requiredModules,
  };
}
```

### 4.2 Category Classification — Bilingual Keyword Maps

```typescript
const CATEGORY_KEYWORDS: Record<QueryCategory, string[]> = {
  career: [
    // English
    'career', 'job', 'work', 'profession', 'business', 'employment',
    'promotion', 'salary', 'company', 'office', 'interview', 'resign',
    // Hindi
    'करियर', 'नौकरी', 'काम', 'व्यापार', 'रोज़गार', 'पेशा',
    'तरक्की', 'वेतन', 'कंपनी', 'दफ्तर', 'इंटरव्यू',
    // Hinglish
    'job change', 'career kaisa',
  ],
  relationship: [
    'marriage', 'partner', 'love', 'spouse', 'wife', 'husband',
    'relationship', 'compatibility', 'divorce', 'engagement',
    'विवाह', 'शादी', 'पत्नी', 'पति', 'रिश्ता', 'प्रेम',
    'साथी', 'तलाक', 'सगाई', 'वैवाहिक',
    'shaadi', 'rishta',
  ],
  health: [
    'health', 'illness', 'disease', 'body', 'medical', 'surgery',
    'hospital', 'pain', 'recovery', 'longevity', 'fitness',
    'स्वास्थ्य', 'बीमारी', 'शरीर', 'रोग', 'आरोग्य',
    'चिकित्सा', 'दवा', 'अस्पताल', 'दर्द', 'आयु',
    'health kaisa', 'tabiyat',
  ],
  wealth: [
    'money', 'wealth', 'finance', 'income', 'investment', 'property',
    'loan', 'debt', 'profit', 'loss', 'savings', 'tax',
    'धन', 'पैसा', 'आय', 'लक्ष्मी', 'संपत्ति', 'निवेश',
    'ऋण', 'कर्ज़', 'लाभ', 'हानि', 'बचत',
    'paisa', 'kamai',
  ],
  children: [
    'child', 'son', 'daughter', 'fertility', 'baby', 'pregnancy',
    'birth', 'offspring', 'progeny',
    'संतान', 'बच्चा', 'पुत्र', 'पुत्री', 'गर्भ',
    'बेटा', 'बेटी', 'औलाद', 'प्रजनन',
    'baccha', 'santaan',
  ],
  education: [
    'education', 'study', 'exam', 'learning', 'school', 'college',
    'university', 'degree', 'result', 'admission',
    'शिक्षा', 'पढ़ाई', 'परीक्षा', 'विद्या', 'स्कूल',
    'कॉलेज', 'विश्वविद्यालय', 'नतीजा', 'दाखिला',
    'padhai', 'exam kaisa',
  ],
  spiritual: [
    'spiritual', 'moksha', 'meditation', 'sadhana', 'karma', 'dharma',
    'temple', 'mantra', 'guru', 'enlightenment', 'yoga',
    'आध्यात्मिक', 'मोक्ष', 'ध्यान', 'साधना', 'कर्म', 'धर्म',
    'मंदिर', 'मंत्र', 'गुरु', 'पूजा', 'भक्ति',
    'pooja', 'bhagwan',
  ],
  general: [], // Fallback — matches when no other category does
};

function classifyCategory(text: string, locale: string): QueryCategory {
  let bestCategory: QueryCategory = 'general';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'general') continue;
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as QueryCategory;
    }
  }

  return bestCategory;
}
```

### 4.3 Complexity Classification

```typescript
// Factual indicators — questions that have a single definitive answer
const FACTUAL_PATTERNS = [
  /what (dasha|mahadasha|antardasha)/i,
  /which (nakshatra|rashi|sign)/i,
  /कौन सी (दशा|राशि|नक्षत्र)/,
  /मेरी (दशा|राशि) क्या/,
  /when (does|will|is).*(start|end|begin|finish)/i,
  /कब (शुरू|खत्म|समाप्त)/,
];

// Remedial indicators — user wants solutions, not just diagnosis
const REMEDIAL_PATTERNS = [
  /what (should|can|do) i do/i,
  /how (to|can i) (fix|improve|overcome|reduce)/i,
  /remedy|remedies|upay|उपाय|solution/i,
  /क्या करें|क्या करूँ|कैसे सुधारें/,
  /gemstone|mantra|charity|donation|fasting/i,
  /रत्न|मंत्र|दान|व्रत|उपवास/,
];

// Predictive indicators — future-oriented, timeline-based
const PREDICTIVE_PATTERNS = [
  /next (year|month|quarter|period)/i,
  /2026|2027|2028/,
  /अगले (साल|महीने|वर्ष)/,
  /when will.*(happen|come|improve|change)/i,
  /कब (होगा|आएगा|बदलेगा|सुधरेगा)/,
  /future|outlook|forecast|prediction/i,
  /भविष्य|भविष्यवाणी/,
];

// Comparative indicators — comparing two options or periods
const COMPARATIVE_PATTERNS = [
  /which.*(better|worse|best)/i,
  /(june|july|march|april).*(or|vs|versus)/i,
  /कौन सा.*(बेहतर|अच्छा)/,
  /compare|comparison/i,
  /तुलना/,
];

function classifyComplexity(text: string, locale: string): QueryComplexity {
  if (FACTUAL_PATTERNS.some(p => p.test(text))) return 'factual';
  if (COMPARATIVE_PATTERNS.some(p => p.test(text))) return 'comparative';
  if (REMEDIAL_PATTERNS.some(p => p.test(text))) return 'remedial';
  if (PREDICTIVE_PATTERNS.some(p => p.test(text))) return 'predictive';
  return 'interpretive'; // Default: "Is X good/bad for Y?"
}
```

### 4.4 Tier Assignment

```typescript
function assignTier(category: QueryCategory, complexity: QueryComplexity): 0 | 1 | 2 {
  // Tier 0: factual questions answered by template
  if (complexity === 'factual') return 0;

  // Tier 2: complex multi-factor synthesis
  if (complexity === 'comparative') return 2;
  if (complexity === 'predictive') return 2;

  // Tier 1: standard interpretive and remedial
  return 1;
}
```

---

## 5. Validation Engine

This is the core intellectual property. The validation wall is what allows cheap models to produce reliable output. It runs entirely in code — zero LLM calls, zero cost, deterministic.

### 5.1 Architecture

```
              LLMOutput + SAC
                    │
                    ▼
         ┌──────────────────┐
         │    LAYER 1        │
         │ Verdict Alignment │
         │                   │
         │ narrative tone    │
         │   vs              │
         │ engine verdict    │
         └────────┬─────────┘
                  │
             pass │ fail → REJECT (regenerate with tone correction)
                  │
                  ▼
         ┌──────────────────┐
         │    LAYER 2        │
         │ Claim Verification│
         │                   │
         │ structured claims │
         │   vs              │
         │ SAC facts         │
         └────────┬─────────┘
                  │
             pass │ fail → REJECT (regenerate with claim correction)
                  │
                  ▼
         ┌──────────────────┐
         │    LAYER 2b       │
         │ Narrative Scanner │
         │                   │
         │ regex-extracted   │
         │ claims from prose │
         │   vs              │
         │ SAC facts         │
         └────────┬─────────┘
                  │
             pass │ fail → REJECT (regenerate with specific correction)
                  │
                  ▼
         ┌──────────────────┐
         │    LAYER 3        │
         │ Tradition Guards  │
         │                   │
         │ immutable Jyotish │
         │ rules             │
         │ + Hinglish detect │
         └────────┬─────────┘
                  │
             pass │ fail → FIX if fixable, else REJECT
                  │   │
                  │   └─ warnings (Hinglish) → attach to response metadata
                  │
                  ▼
              VALIDATED
         (ready for user)
```

### 5.2 Layer 1 — Verdict Alignment (Detail)

**Purpose:** Ensure the LLM's narrative tone matches the engine's pre-computed directional verdict.

**Algorithm:**

```typescript
// Bilingual sentiment markers
const POSITIVE_MARKERS_EN = [
  'excellent', 'auspicious', 'blessed', 'strong period', 'favourable',
  'fortunate', 'highly positive', 'wonderful', 'promising', 'thriving',
  'prosperous', 'ideal', 'rewarding', 'beneficial', 'supportive',
  'great time', 'best period', 'golden phase',
];

const POSITIVE_MARKERS_HI = [
  'शुभ', 'उत्तम', 'अनुकूल', 'प्रबल', 'मंगलकारी', 'अत्यंत शुभ',
  'भाग्यशाली', 'सौभाग्यपूर्ण', 'लाभकारी', 'समृद्ध', 'उन्नति',
  'सर्वश्रेष्ठ', 'उत्कृष्ट', 'प्रगतिशील', 'सफल',
];

const NEGATIVE_MARKERS_EN = [
  'challenging', 'difficult', 'caution', 'obstacle', 'delay',
  'setback', 'avoid', 'unfavourable', 'struggle', 'hardship',
  'adversity', 'troubled', 'stressful', 'crisis', 'danger',
  'critical period', 'testing time',
];

const NEGATIVE_MARKERS_HI = [
  'कठिन', 'चुनौतीपूर्ण', 'सावधानी', 'बाधा', 'विलम्ब',
  'अशुभ', 'प्रतिकूल', 'कष्ट', 'संघर्ष', 'विपत्ति',
  'परेशानी', 'तनाव', 'संकट', 'खतरा', 'कठिनाई',
];

interface SentimentScore {
  positiveCount: number;
  negativeCount: number;
  ratio: number;  // positive / (positive + negative + 1)  [+1 to avoid division by zero]
}

function scoreSentiment(narrative: string): SentimentScore {
  const lower = narrative.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  for (const marker of [...POSITIVE_MARKERS_EN, ...POSITIVE_MARKERS_HI]) {
    // Count occurrences, not just presence — "very auspicious and auspicious" = 2
    const regex = new RegExp(escapeRegex(marker), 'gi');
    const matches = narrative.match(regex);
    if (matches) positiveCount += matches.length;
  }

  for (const marker of [...NEGATIVE_MARKERS_EN, ...NEGATIVE_MARKERS_HI]) {
    const regex = new RegExp(escapeRegex(marker), 'gi');
    const matches = narrative.match(regex);
    if (matches) negativeCount += matches.length;
  }

  return {
    positiveCount,
    negativeCount,
    ratio: positiveCount / (positiveCount + negativeCount + 1),
  };
}

// Verdict → allowed sentiment ratio range
const VERDICT_THRESHOLDS: Record<Verdict, { min: number; max: number }> = {
  'FAVOURABLE':   { min: 0.45, max: 1.0 },   // Must be mostly positive
  'MIXED':        { min: 0.25, max: 0.75 },   // Must be balanced
  'CAUTION':      { min: 0.0,  max: 0.55 },   // Must lean negative
  'CHALLENGING':  { min: 0.0,  max: 0.35 },   // Must be predominantly serious
};

function checkVerdictAlignment(
  narrative: string,
  verdict: Verdict
): ValidationResult {
  const start = Date.now();
  const sentiment = scoreSentiment(narrative);
  const threshold = VERDICT_THRESHOLDS[verdict];

  const passed = sentiment.ratio >= threshold.min && sentiment.ratio <= threshold.max;

  const failures: ValidationFailure[] = [];
  if (!passed) {
    const tooPositive = sentiment.ratio > threshold.max;
    failures.push({
      layer: 'verdict_alignment',
      message: tooPositive
        ? `Narrative is too positive (ratio ${sentiment.ratio.toFixed(2)}) for ${verdict} verdict (max ${threshold.max})`
        : `Narrative is too negative (ratio ${sentiment.ratio.toFixed(2)}) for ${verdict} verdict (min ${threshold.min})`,
      evidence: `Positive markers: ${sentiment.positiveCount}, Negative markers: ${sentiment.negativeCount}`,
      fixable: false,
    });
  }

  return { passed, failures, durationMs: Date.now() - start };
}
```

**Worked examples:**

| Narrative (excerpt) | Positive | Negative | Ratio | Verdict | Result |
|---|---|---|---|---|---|
| "Excellent period for career. शुभ results expected. Very prosperous." | 4 | 0 | 0.80 | FAVOURABLE | PASS (0.80 ≥ 0.45) |
| "Excellent period for career. शुभ results expected. Very prosperous." | 4 | 0 | 0.80 | CAUTION | FAIL (0.80 > 0.55) |
| "Challenging phase. कठिन but remedies help. Some obstacles but growth possible." | 1 | 3 | 0.20 | CAUTION | PASS (0.20 in [0.0, 0.55]) |
| "Challenging phase. कठिन but remedies help. Some obstacles but growth possible." | 1 | 3 | 0.20 | FAVOURABLE | FAIL (0.20 < 0.45) |
| "Mixed signals. शुभ in career but सावधानी in health. Balanced period." | 2 | 1 | 0.50 | MIXED | PASS (0.50 in [0.25, 0.75]) |

### 5.3 Layer 2 — Claim Verification (Detail)

**Purpose:** Every explicit claim the LLM makes (via the structured `claims` array) must be factually correct against the SAC.

**Algorithm:**

```typescript
// Claim type → verification function
const CLAIM_VERIFIERS: Record<string, (claim: LLMClaim, sac: SAC) => ClaimCheck> = {

  planet_house: (claim, sac) => {
    const { planet, house } = claim.data as { planet: number; house: number };
    const sacPlanet = sac.planets.find(p => p.id === planet);
    if (!sacPlanet) return { passed: false, message: `Planet ID ${planet} not found in SAC` };
    if (sacPlanet.house !== house) {
      return {
        passed: false,
        message: `Claimed ${sacPlanet.name} in house ${house}, actually in house ${sacPlanet.house}`,
      };
    }
    return { passed: true };
  },

  planet_sign: (claim, sac) => {
    const { planet, sign } = claim.data as { planet: number; sign: number };
    const sacPlanet = sac.planets.find(p => p.id === planet);
    if (!sacPlanet) return { passed: false, message: `Planet ID ${planet} not found in SAC` };
    if (sacPlanet.sign !== sign) {
      return {
        passed: false,
        message: `Claimed ${sacPlanet.name} in sign ${sign}, actually in sign ${sacPlanet.sign}`,
      };
    }
    return { passed: true };
  },

  planet_dignity: (claim, sac) => {
    const { planet, dignity } = claim.data as { planet: number; dignity: string };
    const sacPlanet = sac.planets.find(p => p.id === planet);
    if (!sacPlanet) return { passed: false, message: `Planet ID ${planet} not found in SAC` };
    if (sacPlanet.dignity !== dignity) {
      return {
        passed: false,
        message: `Claimed ${sacPlanet.name} is ${dignity}, actually ${sacPlanet.dignity}`,
      };
    }
    return { passed: true };
  },

  planet_retrograde: (claim, sac) => {
    const { planet, isRetrograde } = claim.data as { planet: number; isRetrograde: boolean };
    const sacPlanet = sac.planets.find(p => p.id === planet);
    if (!sacPlanet) return { passed: false, message: `Planet ID ${planet} not found in SAC` };
    if (sacPlanet.isRetrograde !== isRetrograde) {
      return {
        passed: false,
        message: `Claimed ${sacPlanet.name} retrograde=${isRetrograde}, actually ${sacPlanet.isRetrograde}`,
      };
    }
    return { passed: true };
  },

  dasha_reference: (claim, sac) => {
    const { major, sub } = claim.data as { major: number; sub: number };
    if (sac.dasha.mahadasha.lordId !== major) {
      return {
        passed: false,
        message: `Claimed Mahadasha lord ${major}, actually ${sac.dasha.mahadasha.lordId}`,
      };
    }
    if (sac.dasha.antardasha.lordId !== sub) {
      return {
        passed: false,
        message: `Claimed Antardasha lord ${sub}, actually ${sac.dasha.antardasha.lordId}`,
      };
    }
    return { passed: true };
  },

  yoga_mentioned: (claim, sac) => {
    const { name } = claim.data as { name: string };
    const found = sac.yogas.find(
      y => y.name.toLowerCase() === name.toLowerCase() && y.detected
    );
    if (!found) {
      return {
        passed: false,
        message: `Claimed yoga "${name}" but it is not in the detected yogas list`,
      };
    }
    return { passed: true };
  },

  dosha_mentioned: (claim, sac) => {
    const { name } = claim.data as { name: string };
    const found = sac.doshas.find(
      d => d.name.toLowerCase() === name.toLowerCase() && d.detected
    );
    if (!found) {
      return {
        passed: false,
        message: `Claimed dosha "${name}" but it is not in the detected doshas list`,
      };
    }
    return { passed: true };
  },

  transit_position: (claim, sac) => {
    const { planet, houseFromMoon } = claim.data as { planet: number; houseFromMoon: number };
    const transit = sac.transits.find(t => t.planetId === planet);
    if (!transit) return { passed: false, message: `Planet ${planet} not in transit data` };
    if (transit.houseFromMoon !== houseFromMoon) {
      return {
        passed: false,
        message: `Claimed ${transit.planetName} transits ${houseFromMoon}th from Moon, actually ${transit.houseFromMoon}th`,
      };
    }
    return { passed: true };
  },

  sade_sati: (claim, sac) => {
    const { active } = claim.data as { active: boolean };
    if (sac.sadeSati.active !== active) {
      return {
        passed: false,
        message: `Claimed Sade Sati active=${active}, actually ${sac.sadeSati.active}`,
      };
    }
    return { passed: true };
  },

  verdict_tone: (_claim, _sac) => {
    // Redundant with Layer 1 — always pass here (Layer 1 is the authority)
    return { passed: true };
  },
};

function verifyClaims(claims: LLMClaim[], sac: SAC): ValidationResult {
  const start = Date.now();
  const failures: ValidationFailure[] = [];

  for (const claim of claims) {
    const verifier = CLAIM_VERIFIERS[claim.type];
    if (!verifier) {
      // Unknown claim type — skip, don't block
      continue;
    }
    const result = verifier(claim, sac);
    if (!result.passed) {
      failures.push({
        layer: 'claim_verification',
        message: result.message,
        evidence: JSON.stringify(claim),
        fixable: false,
      });
    }
  }

  return {
    passed: failures.length === 0,
    failures,
    durationMs: Date.now() - start,
  };
}
```

**Worked example:**

SAC says: Jupiter (id=4) is in house 3, sign Gemini (3), dignity neutral.

LLM claims array:
```json
[
  {"type": "planet_house", "data": {"planet": 4, "house": 10}},
  {"type": "yoga_mentioned", "data": {"name": "gajakesari"}}
]
```

Result:
- Claim 1: FAIL — "Claimed Jupiter in house 10, actually in house 3"
- Claim 2: PASS (if Gajakesari is in SAC yogas) or FAIL (if not detected)

### 5.4 Layer 2b — Narrative Scanner (Detail)

**Purpose:** Safety net for claims the LLM made in prose but omitted from the structured `claims` array. Uses regex to extract verifiable assertions from natural language.

**Algorithm:**

```typescript
// Planet name → ID mapping (bilingual)
const PLANET_NAME_TO_ID: Record<string, number> = {
  // English
  'sun': 0, 'moon': 1, 'mars': 2, 'mercury': 3, 'jupiter': 4,
  'venus': 5, 'saturn': 6, 'rahu': 7, 'ketu': 8,
  // Hindi
  'सूर्य': 0, 'चन्द्र': 1, 'चंद्र': 1, 'मंगल': 2, 'बुध': 3,
  'बृहस्पति': 4, 'गुरु': 4, 'शुक्र': 5, 'शनि': 6,
  'राहु': 7, 'केतु': 8,
};

// House ordinal mapping (Hindi)
const HINDI_ORDINAL_TO_NUM: Record<string, number> = {
  'प्रथम': 1, 'पहले': 1, 'पहला': 1,
  'द्वितीय': 2, 'दूसरे': 2, 'दूसरा': 2,
  'तृतीय': 3, 'तीसरे': 3,
  'चतुर्थ': 4, 'चौथे': 4,
  'पंचम': 5, 'पाँचवें': 5,
  'षष्ठ': 6, 'छठे': 6,
  'सप्तम': 7, 'सातवें': 7,
  'अष्टम': 8, 'आठवें': 8,
  'नवम': 9, 'नौवें': 9,
  'दशम': 10, 'दसवें': 10,
  'एकादश': 11, 'ग्यारहवें': 11,
  'द्वादश': 12, 'बारहवें': 12,
};

interface ExtractedClaim {
  type: string;
  planet?: number;
  house?: number;
  dignity?: string;
  yogaName?: string;
  source: string;  // The matched text
}

function scanNarrative(narrative: string): ExtractedClaim[] {
  const claims: ExtractedClaim[] = [];

  // --- English planet-house patterns ---
  // "Saturn is in your 7th house"
  // "Jupiter in the 10th house"
  // "Mars placed in house 4"
  const enPlanetHouse = /\b(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\b[^.]{0,30}?\b(\d{1,2})(st|nd|rd|th)\s+house/gi;
  for (const match of narrative.matchAll(enPlanetHouse)) {
    const planetName = match[1].toLowerCase();
    const house = parseInt(match[2]);
    if (PLANET_NAME_TO_ID[planetName] !== undefined && house >= 1 && house <= 12) {
      claims.push({
        type: 'planet_house',
        planet: PLANET_NAME_TO_ID[planetName],
        house,
        source: match[0],
      });
    }
  }

  // --- Hindi planet-house patterns ---
  // "शनि आपके सप्तम भाव में"
  // "बृहस्पति दशम भाव में स्थित"
  const hiPlanetNames = Object.keys(PLANET_NAME_TO_ID).filter(k => /[\u0900-\u097F]/.test(k));
  const hiOrdinals = Object.keys(HINDI_ORDINAL_TO_NUM);

  for (const planetName of hiPlanetNames) {
    for (const ordinal of hiOrdinals) {
      // Pattern: planet ... ordinal ... भाव (within 40 chars)
      const pattern = new RegExp(
        `${escapeRegex(planetName)}[^।]{0,40}?${escapeRegex(ordinal)}\\s*(भाव|घर|स्थान)`,
        'g'
      );
      for (const match of narrative.matchAll(pattern)) {
        claims.push({
          type: 'planet_house',
          planet: PLANET_NAME_TO_ID[planetName],
          house: HINDI_ORDINAL_TO_NUM[ordinal],
          source: match[0],
        });
      }

      // Reverse pattern: ordinal bhav ... planet
      const reversePattern = new RegExp(
        `${escapeRegex(ordinal)}\\s*(भाव|घर|स्थान)[^।]{0,40}?${escapeRegex(planetName)}`,
        'g'
      );
      for (const match of narrative.matchAll(reversePattern)) {
        claims.push({
          type: 'planet_house',
          planet: PLANET_NAME_TO_ID[planetName],
          house: HINDI_ORDINAL_TO_NUM[ordinal],
          source: match[0],
        });
      }
    }
  }

  // --- Hindi numeric house pattern ---
  // "शनि आपके 7वें भाव में"
  const hiNumericHouse = new RegExp(
    `(${hiPlanetNames.map(escapeRegex).join('|')})[^।]{0,30}?(\\d{1,2})\\s*(वें|वीं|वाँ)?\\s*(भाव|घर|स्थान)`,
    'g'
  );
  for (const match of narrative.matchAll(hiNumericHouse)) {
    const planetName = match[1];
    const house = parseInt(match[2]);
    if (house >= 1 && house <= 12) {
      claims.push({
        type: 'planet_house',
        planet: PLANET_NAME_TO_ID[planetName],
        house,
        source: match[0],
      });
    }
  }

  // --- Dignity patterns (EN) ---
  // "exalted Sun", "debilitated Moon", "Saturn is exalted"
  const enDignity = /\b(exalted|debilitated|own sign|moolatrikona)\b[^.]{0,20}?\b(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\b/gi;
  for (const match of narrative.matchAll(enDignity)) {
    claims.push({
      type: 'planet_dignity',
      dignity: match[1].toLowerCase(),
      planet: PLANET_NAME_TO_ID[match[2].toLowerCase()],
      source: match[0],
    });
  }
  // Reverse: "Sun is exalted"
  const enDignityReverse = /\b(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)\b[^.]{0,20}?\b(exalted|debilitated|own sign|moolatrikona)\b/gi;
  for (const match of narrative.matchAll(enDignityReverse)) {
    claims.push({
      type: 'planet_dignity',
      planet: PLANET_NAME_TO_ID[match[1].toLowerCase()],
      dignity: match[2].toLowerCase(),
      source: match[0],
    });
  }

  // --- Dignity patterns (HI) ---
  // "उच्च सूर्य", "नीच चन्द्र", "शनि उच्च राशि में"
  const hiDignityMap: Record<string, string> = {
    'उच्च': 'exalted', 'नीच': 'debilitated',
    'स्वराशि': 'own', 'स्वगृही': 'own', 'मूलत्रिकोण': 'moolatrikona',
  };
  for (const [hiTerm, enDignity] of Object.entries(hiDignityMap)) {
    for (const planetName of hiPlanetNames) {
      const pattern = new RegExp(
        `(${escapeRegex(hiTerm)}\\s*${escapeRegex(planetName)}|${escapeRegex(planetName)}\\s*${escapeRegex(hiTerm)})`,
        'g'
      );
      for (const match of narrative.matchAll(pattern)) {
        claims.push({
          type: 'planet_dignity',
          planet: PLANET_NAME_TO_ID[planetName],
          dignity: enDignity,
          source: match[0],
        });
      }
    }
  }

  // --- Yoga name extraction (bilingual) ---
  // Known yoga names from our constants
  const KNOWN_YOGAS = [
    'gajakesari', 'chandra mangala', 'budhaditya', 'raja', 'dhana',
    'viparita raja', 'neechabhanga', 'mahapurusha', 'pancha mahapurusha',
    'hamsa', 'malavya', 'shasha', 'ruchaka', 'bhadra',
    'गजकेसरी', 'चन्द्र मंगल', 'बुधादित्य', 'राज', 'धन',
    'विपरीत राज', 'नीचभंग', 'महापुरुष', 'पंच महापुरुष',
    'हंस', 'मालव्य', 'शश', 'रुचक', 'भद्र',
  ];

  const lowerNarrative = narrative.toLowerCase();
  for (const yoga of KNOWN_YOGAS) {
    if (lowerNarrative.includes(yoga.toLowerCase()) || narrative.includes(yoga)) {
      claims.push({
        type: 'yoga_mentioned',
        yogaName: yoga,
        source: yoga,
      });
    }
  }

  // Deduplicate (same planet+house or same yoga from different patterns)
  return deduplicateClaims(claims);
}

function verifyScannedClaims(
  scannedClaims: ExtractedClaim[],
  sac: SAC,
  existingClaimsFromL2: LLMClaim[]
): ValidationResult {
  const start = Date.now();
  const failures: ValidationFailure[] = [];

  for (const sc of scannedClaims) {
    // Skip if this claim was already verified by Layer 2 (structured claims)
    if (isAlreadyVerifiedByL2(sc, existingClaimsFromL2)) continue;

    if (sc.type === 'planet_house' && sc.planet !== undefined && sc.house !== undefined) {
      const sacPlanet = sac.planets.find(p => p.id === sc.planet);
      if (sacPlanet && sacPlanet.house !== sc.house) {
        failures.push({
          layer: 'claim_verification',
          message: `Narrative states "${sc.source}" but ${sacPlanet.name} is in house ${sacPlanet.house}`,
          evidence: sc.source,
          fixable: false,
        });
      }
    }

    if (sc.type === 'planet_dignity' && sc.planet !== undefined && sc.dignity) {
      const sacPlanet = sac.planets.find(p => p.id === sc.planet);
      if (sacPlanet && sacPlanet.dignity !== sc.dignity) {
        failures.push({
          layer: 'claim_verification',
          message: `Narrative states "${sc.source}" but ${sacPlanet.name} is ${sacPlanet.dignity}`,
          evidence: sc.source,
          fixable: false,
        });
      }
    }

    if (sc.type === 'yoga_mentioned' && sc.yogaName) {
      const normalised = sc.yogaName.toLowerCase();
      const found = sac.yogas.find(
        y => y.name.toLowerCase().includes(normalised) && y.detected
      );
      if (!found) {
        failures.push({
          layer: 'claim_verification',
          message: `Narrative mentions "${sc.yogaName}" yoga but it is not in the detected yogas list`,
          evidence: sc.source,
          fixable: false,
        });
      }
    }
  }

  return { passed: failures.length === 0, failures, durationMs: Date.now() - start };
}
```

### 5.5 Layer 3 — Tradition Guardrails (Detail)

**Purpose:** Catch claims that violate universal, immutable Jyotish rules — regardless of chart context. These rules are always true.

```typescript
import { EXALTATION_SIGNS, DEBILITATION_SIGNS, SIGN_LORDS } from '@/lib/constants/dignities';
import { GRAHAS } from '@/lib/constants/grahas';

// ─── Immutable rule: Natural benefic/malefic classification ───

const NATURAL_BENEFICS = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus
const NATURAL_MALEFICS = new Set([0, 2, 6, 7, 8]); // Sun, Mars, Saturn, Rahu, Ketu

// Benefic planet called malefic (or vice versa)
const BENEFIC_MALEFIC_RULES_EN = [
  { pattern: /Jupiter[^.]{0,30}(malefic|cruel|papa)/i, message: 'Jupiter is a natural benefic, not malefic' },
  { pattern: /Venus[^.]{0,30}(malefic|cruel|papa)/i, message: 'Venus is a natural benefic, not malefic' },
  { pattern: /(malefic|cruel|papa)[^.]{0,30}Jupiter/i, message: 'Jupiter is a natural benefic, not malefic' },
  { pattern: /(malefic|cruel|papa)[^.]{0,30}Venus/i, message: 'Venus is a natural benefic, not malefic' },
  { pattern: /Saturn[^.]{0,30}(benefic|gentle|shubh)/i, message: 'Saturn is a natural malefic, not benefic' },
  { pattern: /Mars[^.]{0,30}(benefic|gentle|shubh)/i, message: 'Mars is a natural malefic, not benefic' },
];

const BENEFIC_MALEFIC_RULES_HI = [
  { pattern: /बृहस्पति[^।]{0,30}(पाप|क्रूर|अशुभ)/g, message: 'बृहस्पति शुभ ग्रह हैं, पाप ग्रह नहीं' },
  { pattern: /गुरु[^।]{0,30}(पाप|क्रूर|अशुभ)/g, message: 'गुरु शुभ ग्रह हैं, पाप ग्रह नहीं' },
  { pattern: /शुक्र[^।]{0,30}(पाप|क्रूर|अशुभ)/g, message: 'शुक्र शुभ ग्रह हैं, पाप ग्रह नहीं' },
  { pattern: /शनि[^।]{0,30}(शुभ ग्रह|सौम्य)/g, message: 'शनि पाप ग्रह हैं, शुभ ग्रह नहीं' },
  { pattern: /मंगल[^।]{0,30}(शुभ ग्रह|सौम्य)/g, message: 'मंगल पाप ग्रह हैं, शुभ ग्रह नहीं' },
];

// ─── Immutable rule: Special aspects ───

// Mars aspects 4th, 7th, 8th — NOT 5th or 9th
// Jupiter aspects 5th, 7th, 9th — NOT 4th or 8th
// Saturn aspects 3rd, 7th, 10th — NOT 5th or 9th
const WRONG_ASPECT_RULES_EN = [
  { pattern: /Mars[^.]{0,40}aspects?[^.]{0,20}(5th|9th|fifth|ninth)/i, message: 'Mars aspects 4th/7th/8th, NOT 5th/9th' },
  { pattern: /Jupiter[^.]{0,40}aspects?[^.]{0,20}(4th|8th|fourth|eighth)/i, message: 'Jupiter aspects 5th/7th/9th, NOT 4th/8th' },
  { pattern: /Saturn[^.]{0,40}aspects?[^.]{0,20}(5th|9th|fifth|ninth)/i, message: 'Saturn aspects 3rd/7th/10th, NOT 5th/9th' },
];

const WRONG_ASPECT_RULES_HI = [
  { pattern: /मंगल[^।]{0,40}(दृष्टि|aspect)[^।]{0,20}(पंचम|नवम)/g, message: 'मंगल की 4/7/8 दृष्टि है, 5/9 नहीं' },
  { pattern: /बृहस्पति[^।]{0,40}(दृष्टि|aspect)[^।]{0,20}(चतुर्थ|अष्टम)/g, message: 'बृहस्पति की 5/7/9 दृष्टि है, 4/8 नहीं' },
  { pattern: /शनि[^।]{0,40}(दृष्टि|aspect)[^।]{0,20}(पंचम|नवम)/g, message: 'शनि की 3/7/10 दृष्टि है, 5/9 नहीं' },
];

// ─── Immutable rule: Wrong exaltation/debilitation signs ───

// Build dynamic rules from canonical constants
function buildExaltationRules(): Array<{ pattern: RegExp; message: string }> {
  const rules: Array<{ pattern: RegExp; message: string }> = [];
  const signNames = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                     'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

  for (const [pidStr, correctSign] of Object.entries(EXALTATION_SIGNS)) {
    const pid = Number(pidStr);
    if (pid > 6) continue; // Skip Rahu/Ketu (less commonly mentioned)
    const planetName = GRAHAS[pid].name.en;
    const correctSignName = signNames[correctSign - 1];

    // Flag "Planet exalted in WrongSign"
    for (let s = 1; s <= 12; s++) {
      if (s === correctSign) continue;
      const wrongSign = signNames[s - 1];
      rules.push({
        pattern: new RegExp(`${planetName}[^.]{0,30}exalted[^.]{0,20}${wrongSign}`, 'i'),
        message: `${planetName} is exalted in ${correctSignName}, not ${wrongSign}`,
      });
    }
  }
  return rules;
}

// ─── Hinglish code-switching detection (WARNING, not REJECT) ───

const HINGLISH_PATTERNS = [
  // English astronomy terms that should be in Hindi when locale=hi
  { pattern: /\b(Saturn|Jupiter|Mars|Venus|Mercury|Sun|Moon)\s+(ka|ki|ke|ko)\b/gi,
    correction: 'Use Hindi planet names: शनि, बृहस्पति, मंगल, शुक्र, बुध, सूर्य, चन्द्र' },
  { pattern: /\b(transit|retrograde|aspect|house|sign|dasha)\s+(ho|hai|hain|mein|ka|ki)\b/gi,
    correction: 'Use Hindi terms: गोचर, वक्री, दृष्टि, भाव, राशि, दशा' },
  { pattern: /\b(positive|negative|good|bad|excellent)\s+(hai|hain|ho|hoga)\b/gi,
    correction: 'Use Hindi: शुभ, अशुभ, उत्तम, कठिन' },
];

function checkTraditionGuardrails(
  narrative: string,
  locale: string
): ValidationResult {
  const start = Date.now();
  const failures: ValidationFailure[] = [];
  const warnings: ValidationFailure[] = [];

  // Combine all rule sets
  const allRules = [
    ...BENEFIC_MALEFIC_RULES_EN,
    ...BENEFIC_MALEFIC_RULES_HI,
    ...WRONG_ASPECT_RULES_EN,
    ...WRONG_ASPECT_RULES_HI,
    ...buildExaltationRules(),
  ];

  for (const rule of allRules) {
    const match = narrative.match(rule.pattern);
    if (match) {
      // Check if this is fixable via string replacement
      const isFixable = rule.message.includes('not malefic') || rule.message.includes('not benefic');
      failures.push({
        layer: 'tradition_guardrails',
        message: rule.message,
        evidence: match[0],
        fixable: isFixable,
        fix: isFixable ? buildFix(match[0], rule.message) : undefined,
      });
    }
  }

  // Hinglish detection (warnings only, for hi locale)
  if (locale === 'hi') {
    for (const hp of HINGLISH_PATTERNS) {
      const matches = [...narrative.matchAll(hp.pattern)];
      if (matches.length > 0) {
        warnings.push({
          layer: 'tradition_guardrails',
          message: `Hinglish code-switching detected: ${hp.correction}`,
          evidence: matches.map(m => m[0]).join(', '),
          fixable: false,
        });
      }
    }
  }

  return {
    passed: failures.length === 0, // Warnings don't block
    failures: [...failures, ...warnings],
    durationMs: Date.now() - start,
  };
}
```

### 5.6 Validation Orchestrator

```typescript
function validate(
  llmOutput: LLMOutput,
  sac: StructuredAstrologicalContext,
  locale: string
): ValidationResult {
  const allFailures: ValidationFailure[] = [];
  let totalDuration = 0;

  // Layer 1: Verdict alignment
  const l1 = checkVerdictAlignment(llmOutput.narrative, sac.primaryVerdict);
  totalDuration += l1.durationMs;
  if (!l1.passed) {
    // Short-circuit — no point checking facts if the tone is wrong
    return { passed: false, failures: l1.failures, durationMs: totalDuration };
  }

  // Layer 2: Structured claim verification
  const l2 = verifyClaims(llmOutput.claims, sac);
  totalDuration += l2.durationMs;
  allFailures.push(...l2.failures);
  if (!l2.passed) {
    return { passed: false, failures: allFailures, durationMs: totalDuration };
  }

  // Layer 2b: Narrative scanner
  const scannedClaims = scanNarrative(llmOutput.narrative);
  const l2b = verifyScannedClaims(scannedClaims, sac, llmOutput.claims);
  totalDuration += l2b.durationMs;
  allFailures.push(...l2b.failures);
  if (!l2b.passed) {
    return { passed: false, failures: allFailures, durationMs: totalDuration };
  }

  // Layer 3: Tradition guardrails
  const l3 = checkTraditionGuardrails(llmOutput.narrative, locale);
  totalDuration += l3.durationMs;

  // Apply fixable corrections
  let correctedNarrative = llmOutput.narrative;
  for (const f of l3.failures) {
    if (f.fixable && f.fix) {
      correctedNarrative = correctedNarrative.replace(f.fix.find, f.fix.replace);
    }
  }

  // Non-fixable L3 failures still block
  const nonFixableL3 = l3.failures.filter(f => !f.fixable && !f.message.includes('Hinglish'));
  allFailures.push(...l3.failures); // Include all for metadata (warnings too)

  if (nonFixableL3.length > 0) {
    return { passed: false, failures: allFailures, durationMs: totalDuration };
  }

  // If we corrected the narrative, update it
  if (correctedNarrative !== llmOutput.narrative) {
    llmOutput.narrative = correctedNarrative;
  }

  return { passed: true, failures: allFailures, durationMs: totalDuration };
}
```

---

## 6. Provider Router

### 6.1 Routing Logic

```typescript
async function route(
  tier: 0 | 1 | 2,
  prompts: { system: string; user: string },
  sac: StructuredAstrologicalContext,
  query: ClassifiedQuery,
  config: PanditConfig
): Promise<{ output: LLMOutput | null; model: string; tier: 0 | 1 | 2 }> {

  // ── Tier 0: Template (no LLM) ──
  if (tier === 0) {
    const template = fillTemplate(sac, query);
    return { output: templateToLLMOutput(template), model: 'template', tier: 0 };
  }

  // ── Tier 1: Self-hosted ──
  if (tier === 1 || tier === 2) {
    const provider = tier === 1 ? selfHostedProvider : anthropicProvider;
    const providerName = tier === 1 ? 'self-hosted' : 'anthropic';

    if (provider.isAvailable()) {
      for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
          const promptToUse = attempt === 0
            ? prompts
            : augmentPromptWithFailures(prompts, lastFailures);

          const raw = await provider.complete({
            system: promptToUse.system,
            user: promptToUse.user,
            maxTokens: 2000,
            temperature: 0,
            jsonMode: true,
          });

          const parsed = parseLLMOutput(raw.content);
          if (!parsed) {
            // JSON parse failed — treat as validation failure
            lastFailures = [{ layer: 'claim_verification', message: 'Invalid JSON output', evidence: raw.content.slice(0, 200), fixable: false }];
            continue;
          }

          const validation = validate(parsed, sac, query.locale);

          if (validation.passed) {
            return { output: parsed, model: `${providerName}:${provider.name}`, tier };
          }

          lastFailures = validation.failures;
          console.error(`[ai-pandit] ${providerName} attempt ${attempt + 1} failed validation:`,
            validation.failures.map(f => f.message).join('; '));

        } catch (err) {
          console.error(`[ai-pandit] ${providerName} call failed:`, err);
          break; // Network error — don't retry, escalate
        }
      }
    }

    // ── Escalation: Tier 1 failed → try Tier 2 ──
    if (tier === 1 && anthropicProvider.isAvailable()) {
      console.error('[ai-pandit] Self-hosted failed, escalating to Anthropic API');
      return route(2, prompts, sac, query, config);
    }
  }

  // ── Final fallback: Template ──
  console.error('[ai-pandit] All providers failed, falling back to template');
  const template = fillTemplate(sac, query);
  return { output: templateToLLMOutput(template), model: 'template-fallback', tier: 0 };
}
```

### 6.2 Response Parsing (Defensive)

```typescript
function parseLLMOutput(raw: string): LLMOutput | null {
  // Strip markdown fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  try {
    const parsed = JSON.parse(cleaned);

    // Validate required fields
    if (typeof parsed.narrative !== 'string' || parsed.narrative.length < 50) {
      return null;
    }

    return {
      narrative: parsed.narrative,
      claims: Array.isArray(parsed.claims) ? parsed.claims : [],
      remedies: Array.isArray(parsed.remedies) ? parsed.remedies : [],
      classicalCitations: Array.isArray(parsed.classicalCitations) ? parsed.classicalCitations : [],
    };
  } catch {
    // JSON parse failed — try to extract narrative as plain text
    // This happens when the model ignores JSON mode
    if (cleaned.length > 100) {
      return {
        narrative: cleaned,
        claims: [],           // Empty — Layer 2 skipped, Layer 2b will scan
        remedies: [],
        classicalCitations: [],
      };
    }
    return null;
  }
}
```

---

## 7. Template Engine

### 7.1 Template Structure

Each template is a function that takes SAC data and returns filled text.

```typescript
interface TemplateSlots {
  dashaLord: string;            // "Saturn" or "शनि"
  dashaLordHi: string;
  domain: string;               // "career" or "करियर"
  domainHi: string;
  verdictAdjective: string;     // "favourable" or "अनुकूल"
  verdictAdjectiveHi: string;
  positiveFactors: string;      // "Jupiter's transit through 11th house..."
  positiveFactorsHi: string;
  negativeFactors: string;
  negativeFactorsHi: string;
  primaryRemedy: string;
  primaryRemedyHi: string;
  ascendantSign: string;
  moonSign: string;
}

function buildSlots(sac: SAC, query: ClassifiedQuery): TemplateSlots {
  const dashaLordId = sac.dasha.mahadasha.lordId;
  const dashaLord = GRAHAS[dashaLordId].name.en;
  const dashaLordHi = GRAHAS[dashaLordId].name.hi;

  const domainVerdict = sac.domainVerdicts[query.category];
  const posFactors = (domainVerdict?.factors ?? []).filter(f => f.sentiment === 'positive');
  const negFactors = (domainVerdict?.factors ?? []).filter(f => f.sentiment === 'negative');

  return {
    dashaLord,
    dashaLordHi,
    domain: query.category,
    domainHi: DOMAIN_NAMES_HI[query.category],
    verdictAdjective: VERDICT_ADJECTIVES_EN[sac.primaryVerdict],
    verdictAdjectiveHi: VERDICT_ADJECTIVES_HI[sac.primaryVerdict],
    positiveFactors: posFactors.map(f => f.detail).join('. ') || 'No strong positive factors at this time.',
    positiveFactorsHi: posFactors.map(f => translateFactor(f, 'hi')).join('। ') || 'इस समय कोई प्रबल शुभ कारक नहीं है।',
    negativeFactors: negFactors.map(f => f.detail).join('. ') || '',
    negativeFactorsHi: negFactors.map(f => translateFactor(f, 'hi')).join('। ') || '',
    primaryRemedy: selectPrimaryRemedy(sac, query.category, 'en'),
    primaryRemedyHi: selectPrimaryRemedy(sac, query.category, 'hi'),
    ascendantSign: sac.ascendant.signName,
    moonSign: sac.planets.find(p => p.id === 1)?.signName ?? 'Unknown',
  };
}
```

### 7.2 Template Variants

64 templates total: 4 verdicts × 8 categories × 2 locales.

Example (CAUTION × career × hi):

```
आपकी {dashaLordHi} महादशा में करियर के विषय में सावधानी बरतने की आवश्यकता है।

{positiveFactorsHi}

हालाँकि, कुछ चुनौतियाँ भी विद्यमान हैं। {negativeFactorsHi}

शास्त्रों के अनुसार {primaryRemedyHi} करने से इन बाधाओं में कमी आ सकती है। यह समय धैर्य और सतर्कता का है — कठिनाइयाँ अस्थायी हैं और उपायों से निवारण संभव है।
```

---

## 8. Cache System

```typescript
interface CacheEntry {
  response: PanditResponse;
  createdAt: number;
  birthFingerprint: string;
  hasTransitData: boolean;  // If true, TTL = 24h. If false (natal only), TTL = never.
}

class ResponseCache {
  private cache = new Map<string, CacheEntry>();
  private maxEntries = 1000;
  private transitTtlMs = 24 * 60 * 60 * 1000; // 24 hours

  get(key: string): PanditResponse | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check TTL for transit-dependent entries
    if (entry.hasTransitData) {
      const age = Date.now() - entry.createdAt;
      if (age > this.transitTtlMs) {
        this.cache.delete(key);
        return null;
      }
    }

    return entry.response;
  }

  set(key: string, response: PanditResponse, birthFingerprint: string, hasTransitData: boolean): void {
    // LRU eviction
    if (this.cache.size >= this.maxEntries) {
      const oldest = this.cache.keys().next().value;
      if (oldest) this.cache.delete(oldest);
    }

    this.cache.set(key, {
      response,
      createdAt: Date.now(),
      birthFingerprint,
      hasTransitData,
    });
  }
}
```

Cache key: `SHA256(date + time + lat.toFixed(4) + lng.toFixed(4) + ':' + normalisedCategory + ':' + locale)`

---

## 9. Disclaimer System

```typescript
const STANDARD_DISCLAIMER = {
  en: `This reading is generated by our AI Pandit, grounded in classical Vedic texts including Brihat Parashara Hora Shastra, Phaladeepika, and Saravali. All planetary positions are computed using the Swiss Ephemeris astronomical engine.\n\nThis is for guidance and self-reflection. Jyotish describes tendencies and karmic patterns — not fixed destiny. Important life decisions should consider multiple sources of wisdom.\n\nTradition: Parashari (BPHS) | Engine: Swiss Ephemeris`,

  hi: `यह विश्लेषण हमारे AI पंडित द्वारा तैयार किया गया है, जो बृहत् पाराशर होरा शास्त्र, फलदीपिका और सारावली जैसे शास्त्रीय ग्रंथों पर आधारित है। सभी ग्रह स्थितियों की गणना स्विस एफेमेरिस खगोलीय इंजन द्वारा की गई है।\n\nयह मार्गदर्शन और आत्मचिंतन के लिए है। ज्योतिष कर्म प्रवृत्तियों का वर्णन करता है — निश्चित भाग्य का नहीं। महत्वपूर्ण जीवन निर्णयों में अनेक स्रोतों से विचार करें।\n\nपरंपरा: पाराशरी (बृहत् पाराशर होरा शास्त्र) | गणना: स्विस एफेमेरिस`,
};

const CONTEXTUAL_DISCLAIMERS: Record<string, Record<string, string>> = {
  health: {
    en: 'Health indications in Jyotish reflect karmic tendencies. They are not medical diagnoses. Please consult a healthcare professional for medical concerns.',
    hi: 'ज्योतिष में स्वास्थ्य संकेत कर्म प्रवृत्तियों को दर्शाते हैं। ये चिकित्सकीय निदान नहीं हैं। चिकित्सा संबंधी चिंताओं के लिए कृपया योग्य चिकित्सक से परामर्श करें।',
  },
  wealth: {
    en: 'Astrological timing can inform but should not replace professional financial advice.',
    hi: 'ज्योतिषीय समय मार्गदर्शन दे सकता है, किन्तु यह पेशेवर वित्तीय सलाह का विकल्प नहीं है।',
  },
  relationship: {
    en: 'Compatibility readings highlight karmic patterns between charts. Every relationship is shaped by both karma and conscious effort.',
    hi: 'संगतता विश्लेषण कुंडलियों के बीच कर्म प्रवृत्तियों को दर्शाता है। प्रत्येक संबंध कर्म और सचेत प्रयास दोनों से आकार लेता है।',
  },
  challenging: {
    en: 'Challenging planetary periods are opportunities for growth and spiritual development. Classical texts prescribe specific remedies precisely because difficult periods are workable.',
    hi: 'कठिन ग्रह काल आध्यात्मिक विकास के अवसर हैं। शास्त्रों में विशिष्ट उपाय इसीलिए बताए गए हैं क्योंकि कठिन काल निवारण योग्य होते हैं।',
  },
};

function getDisclaimer(category: QueryCategory, verdict: Verdict, locale: string): string {
  const loc = locale === 'hi' ? 'hi' : 'en';
  let disclaimer = STANDARD_DISCLAIMER[loc];

  // Add category-specific disclaimer
  if (CONTEXTUAL_DISCLAIMERS[category]?.[loc]) {
    disclaimer += '\n\n' + CONTEXTUAL_DISCLAIMERS[category][loc];
  }

  // Add challenging-verdict disclaimer
  if ((verdict === 'CAUTION' || verdict === 'CHALLENGING') && CONTEXTUAL_DISCLAIMERS.challenging?.[loc]) {
    disclaimer += '\n\n' + CONTEXTUAL_DISCLAIMERS.challenging[loc];
  }

  return disclaimer;
}
```

---

## 10. Error Handling & Graceful Degradation

### 10.1 Failure Hierarchy

```
LLM network error
  → retry once
  → escalate to next tier
  → template fallback

JSON parse error
  → extract plain text narrative
  → skip Layer 2 (no structured claims)
  → Layer 2b + Layer 3 still run
  → if validation fails: template fallback

Validation failure (Layer 1, 2, 2b)
  → regenerate with correction prompt (max 2 retries)
  → escalate to next tier
  → template fallback

Validation failure (Layer 3, non-fixable)
  → regenerate with correction prompt
  → template fallback

Validation failure (Layer 3, fixable)
  → apply string fix in-place
  → continue (no retry needed)

Context builder error
  → log error
  → return error response with message "Unable to analyse chart at this time"
  → NEVER return a wrong reading — silence is better than misinformation

Self-hosted provider unavailable
  → route directly to Tier 2 (API)
  → if API also unavailable: template for all queries

Both providers unavailable (no API key, no self-hosted endpoint)
  → template for Tier 0 queries
  → error response for Tier 1/2: "AI consultation is temporarily unavailable.
     Your chart analysis and domain scores are shown above."
```

### 10.2 Logging Convention

Every routing decision, validation result, and error is logged with the `[ai-pandit]` tag:

```
[ai-pandit] classify: "मेरा करियर कैसा रहेगा?" → career/interpretive/tier-1
[ai-pandit] cache: MISS (key=sha256:abc123)
[ai-pandit] context: built SAC in 12ms (9 planets, 3 yogas, 1 dosha)
[ai-pandit] self-hosted: call 1 (2000 tok max, temp=0)
[ai-pandit] validate: L1 PASS (ratio=0.32, verdict=CAUTION, range=[0.0, 0.55])
[ai-pandit] validate: L2 PASS (5/5 claims verified)
[ai-pandit] validate: L2b PASS (3 scanned claims, 3 verified)
[ai-pandit] validate: L3 PASS (0 failures, 1 Hinglish warning)
[ai-pandit] response: tier-1, model=self-hosted:qwen-14b, cached=false, cost=$0
```

Or on failure:
```
[ai-pandit] self-hosted: call 1 (2000 tok max, temp=0)
[ai-pandit] validate: L1 FAIL (ratio=0.72, verdict=CAUTION, max=0.55)
[ai-pandit] self-hosted: retry 1 with correction prompt
[ai-pandit] validate: L1 PASS (ratio=0.41)
[ai-pandit] validate: L2 FAIL — claimed Jupiter in house 10, actually house 3
[ai-pandit] self-hosted: retry 2 with correction prompt
[ai-pandit] validate: ALL PASS
[ai-pandit] response: tier-1, model=self-hosted:qwen-14b, regenerations=2
```

---

## 11. Critical Review — Issues Found and Addressed

Reviewed 2026-05-13 against actual codebase types and module contracts. 12 issues found.

### Issue 1: `computeCurrentTransits()` signature mismatch — CRITICAL

**Bug:** The design calls `computeCurrentTransits(kundali)` passing the full `KundaliData`. The actual function signature is:

```typescript
// transit-activation.ts:169
export function computeCurrentTransits(
  natalAscSign: number,    // ← takes ascendant sign number, NOT KundaliData
  currentDate?: Date,
): TransitEntry[]
```

**Impact:** Context builder code as written will not compile.

**Fix:** Call must be `computeCurrentTransits(kundali.ascendant.sign)`. Updated in §2.2.

Additionally, the actual `TransitEntry` interface has no `savBindus` field:

```typescript
// actual TransitEntry
{ planetId: number; currentSign: number; transitHouse: number; isRetrograde: boolean; }
```

The SAC type specifies `savBindus: number` on transits, but the transit calculator doesn't compute it. SAV bindus would need to be looked up separately from `kundali.ashtakavarga.savTable[houseIndex]`.

**Fix:** In context builder, join transit entries with SAV data:

```typescript
const savTable = kundali.ashtakavarga?.savTable ?? [];
const transits = computeCurrentTransits(kundali.ascendant.sign).map(t => ({
  planetId: t.planetId,
  planetName: GRAHAS[t.planetId].name.en,
  sign: t.currentSign,          // was: t.transitSign (wrong field name)
  houseFromMoon: t.transitHouse,
  houseFromLagna: t.transitHouse,  // already computed from lagna by the function
  isRetrograde: t.isRetrograde,
  savBindus: savTable[t.transitHouse - 1] ?? 0,
}));
```

Note: `transitHouse` is already computed from lagna (not Moon) by the function. Design assumed `houseFromMoon` — this is wrong. The function computes house from natal ascendant. Moon-based house needs separate calculation: `((t.currentSign - moonSign + 12) % 12) + 1`.

---

### Issue 2: `TransitEntry.currentSign` vs `TransitEntry.transitSign` — field name mismatch

**Bug:** Design references `t.transitSign` but the actual field is `t.currentSign`.

**Fix:** Use `t.currentSign` throughout. Updated in §2.2 transit mapping.

---

### Issue 3: `YogaComplete` uses `present` not `detected`, and `strength` is capitalised

**Bug:** Design filters on `y.detected` and maps `y.strength` as lowercase. Actual `YogaComplete` type:

```typescript
{
  present: boolean;              // NOT 'detected'
  strength: 'Strong' | 'Moderate' | 'Weak';  // Capitalised, NOT lowercase
}
```

Also, `YogaComplete` has no `planets` or `category` field with the assumed shape. It has `category: 'dosha' | 'mahapurusha' | 'moon_based' | ...` (union, not freeform string) and no `planets: number[]` array.

**Fix:** In context builder yoga mapping:

```typescript
const yogas: SACYoga[] = (kundali.yogasComplete ?? [])
  .filter(y => y.present)                              // NOT y.detected
  .map(y => ({
    name: y.name.en,
    detected: true,
    planets: [],                                        // YogaComplete doesn't carry planet IDs
    strength: y.strength.toLowerCase() as SACYoga['strength'],  // Normalise case
    category: y.category,
  }));
```

Dosha extraction similarly uses `y.present`:

```typescript
const doshas: SACDosha[] = (kundali.yogasComplete ?? [])
  .filter(y => y.category === 'dosha' && y.present)    // NOT y.detected
  .map(d => ({
    name: d.name.en,
    detected: true,
    severity: 'moderate',  // YogaComplete has no severity field — default
  }));
```

The `SACYoga.planets` field should be made optional in the type definition since the engine doesn't provide it. The LLM doesn't need planet IDs for yoga claims — the yoga name is sufficient for validation.

---

### Issue 4: `SadeSatiAnalysis` field name mismatch

**Bug:** Design accesses `kundali.sadeSati.isActive` and `kundali.sadeSati.phase`. Actual fields:

```typescript
{ isActive: boolean; currentPhase: 'rising' | 'peak' | 'setting' | null; ... }
```

The phase field is `currentPhase`, not `phase`.

**Fix:**

```typescript
const sadeSati = kundali.sadeSati
  ? { active: kundali.sadeSati.isActive, phase: kundali.sadeSati.currentPhase }
  : { active: false, phase: null };
```

---

### Issue 5: `SHADBALA_REQUIRED` constant doesn't exist

**Bug:** Design references `SHADBALA_REQUIRED[pid]` — this constant doesn't exist in the codebase.

**Fix:** The Shadbala minimum required values are standard per BPHS (Sun=390, Moon=360, Mars=300, Mercury=420, Jupiter=390, Venus=330, Saturn=300 in Shashtiamsas). Define inline in the context builder:

```typescript
const SHADBALA_MIN_REQUIRED: Record<number, number> = {
  0: 390, 1: 360, 2: 300, 3: 420, 4: 390, 5: 330, 6: 300,
};
```

Or better: check if `kundali.fullShadbala` already contains the required values (it might, via the `ShadBalaComplete` type).

---

### Issue 6: `planetNameToId()` utility doesn't exist

**Bug:** Used twice in context builder for Dasha and Shadbala mapping. Not a codebase export (only found in one unrelated file `relationship-map.ts`).

**Fix:** Define locally in the context builder:

```typescript
const PLANET_NAME_TO_ID: Record<string, number> = {
  'Sun': 0, 'Moon': 1, 'Mars': 2, 'Mercury': 3, 'Jupiter': 4,
  'Venus': 5, 'Saturn': 6, 'Rahu': 7, 'Ketu': 8,
};
function planetNameToId(name: string): number {
  return PLANET_NAME_TO_ID[name] ?? -1;
}
```

---

### Issue 7: `scoreDomain()` returns `RatingInfo`, not a verdict+factors structure

**Bug:** Design says `domainVerdicts` maps category → `{ verdict: Verdict, score: number, factors: VerdictFactor[] }`. But `scoreDomain()` returns `RatingInfo`:

```typescript
interface RatingInfo {
  rating: Rating;            // 'uttama' | 'madhyama' | 'adhama' | 'atyadhama'
  score: number;
  label: LocaleText;
  color: string;
  factors?: ScoringFactor[];  // Different shape from VerdictFactor
}
```

The `Rating` type (`uttama/madhyama/adhama/atyadhama`) is NOT the same as `Verdict` (`FAVOURABLE/MIXED/CAUTION/CHALLENGING`). And `ScoringFactor` has `{ label: LocaleText, verdict: string, value: string }` — not the same as `VerdictFactor`.

**Fix:** The context builder needs a mapping layer:

```typescript
function ratingToVerdict(rating: Rating): Verdict {
  switch (rating) {
    case 'uttama': return 'FAVOURABLE';
    case 'madhyama': return 'MIXED';
    case 'adhama': return 'CAUTION';
    case 'atyadhama': return 'CHALLENGING';
  }
}

function scoringFactorToVerdictFactor(sf: ScoringFactor): VerdictFactor {
  return {
    type: 'dignity',  // Approximate — ScoringFactor doesn't carry a detailed type
    detail: `${sf.label.en}: ${sf.value}`,
    sentiment: sf.verdict as 'positive' | 'negative' | 'neutral',
    weight: sf.verdict === 'positive' ? 0.7 : sf.verdict === 'negative' ? 0.7 : 0.3,
  };
}
```

Also, `scoreDomain()` takes `(DomainConfig, ScorerInput)` — the context builder would need to construct a `ScorerInput` from `KundaliData`, which is non-trivial (it's what the synthesiser does). A better approach: **reuse the full synthesiser output** if available, or compute `RatingInfo` once and translate. The existing `synthesizePersonalReading()` already does this work — if the `PersonalReading` is available on `KundaliData`, use it directly instead of re-invoking `scoreDomain()`.

---

### Issue 8: `DashaEntry.planet` is a string, not a planet ID

**Bug:** The design assumes `activeMaha.planet` is a planet name string (which it is), but then calls `planetNameToId()` to get an ID. The `DashaEntry` type:

```typescript
interface DashaEntry {
  planet: string;        // e.g., "Saturn"
  planetName: LocaleText;
  startDate: string;
  endDate: string;
  level: 'maha' | 'antar' | 'pratyantar';
  subPeriods?: DashaEntry[];
}
```

`planet` is the English name as a string. The context builder must map it to an ID. The `planetNameToId()` fix from Issue 6 handles this — but the design should note that `DashaEntry.planet` contains the English name (e.g., "Saturn"), not a localised name.

---

### Issue 9: Query classifier `.toLowerCase()` breaks Hindi matching

**Bug:** `classifyQuery` does `text.toLowerCase().trim()` on line 415. Hindi characters are not affected by `.toLowerCase()`, so this works accidentally. But Hinglish patterns like `'career kaisa'` contain no uppercase, so they work too.

However, the real issue is that `.toLowerCase()` is applied once and the result used for all matching. Hindi keywords are case-insensitive by nature (no case in Devanagari), but the English keywords like `'Saturn'` in Hinglish patterns won't match after lowercasing if the keyword list has mixed case.

**Fix:** Already correct — all English keywords in the maps are lowercase. No change needed, but add a comment in the design noting that keyword lists must be lowercase (English) or Devanagari (case-irrelevant).

---

### Issue 10: Layer 1 sentiment scoring — negation blindness

**Bug:** "This is NOT a favourable period" contains the word "favourable" and would score +1 positive. Similarly, "शुभ नहीं है" ("is not auspicious") contains "शुभ" and scores +1 positive.

**Impact:** Negated positive statements inflate the positive score, causing CAUTION verdicts to appear more positive than they are. False passes on Layer 1.

**Mitigation:** This is a known limitation of keyword-based sentiment. Full fix requires n-gram or dependency parsing, which is over-engineered for v1. Partial fix: add negated phrases as negative markers:

```
NEGATIVE_MARKERS_EN: add 'not favourable', 'not auspicious', 'not ideal', 'unfavourable'
NEGATIVE_MARKERS_HI: add 'शुभ नहीं', 'अनुकूल नहीं', 'उत्तम नहीं'
```

And in the scoring function, check negated phrases FIRST (they're longer), remove them from the text before counting bare positives. This is good enough for v1 — the LLM is unlikely to use many double negatives given the system prompt constraints.

---

### Issue 11: Layer 3 exaltation rules generate 7 × 11 = 77 regex patterns

**Bug:** `buildExaltationRules()` creates one regex per planet × wrong sign. That's 7 planets × 11 wrong signs = 77 patterns, each compiled and tested against the full narrative. For a 2,000-word narrative this is ~77 regex matches.

**Impact:** Not a correctness bug, but a performance concern. On a cold start, compiling 77 regexes adds latency.

**Fix:** Cache the compiled rules at module level (build once on import, not per validation call). In the design, move `buildExaltationRules()` to module-level initialisation:

```typescript
const EXALTATION_RULES = buildExaltationRules(); // Computed once at import time
```

---

### Issue 12: Router `lastFailures` variable is undeclared

**Bug:** In the router code (§6.1), `lastFailures` is used but never declared with `let`. It's referenced on line 1436 (`augmentPromptWithFailures(prompts, lastFailures)`) before being assigned on line 1459.

**Fix:** Add `let lastFailures: ValidationFailure[] = [];` before the retry loop.

---

### Summary

| # | Severity | Component | Issue | Status |
|---|----------|-----------|-------|--------|
| 1 | CRITICAL | Context Builder | `computeCurrentTransits()` wrong signature + missing SAV | Documented fix above |
| 2 | HIGH | Context Builder | `TransitEntry.currentSign` not `.transitSign` | Documented fix above |
| 3 | HIGH | Context Builder | `YogaComplete.present` not `.detected`, strength capitalised | Documented fix above |
| 4 | MEDIUM | Context Builder | `SadeSatiAnalysis.currentPhase` not `.phase` | Documented fix above |
| 5 | MEDIUM | Context Builder | `SHADBALA_REQUIRED` doesn't exist | Documented fix above |
| 6 | MEDIUM | Context Builder | `planetNameToId()` doesn't exist | Documented fix above |
| 7 | HIGH | Context Builder | `scoreDomain()` returns `RatingInfo` not verdict | Documented fix above |
| 8 | LOW | Context Builder | `DashaEntry.planet` is string, needs ID mapping | Covered by Issue 6 fix |
| 9 | LOW | Classifier | `.toLowerCase()` + Hindi — works accidentally | No change needed |
| 10 | MEDIUM | Layer 1 | Negation blindness in keyword sentiment | Partial fix documented |
| 11 | LOW | Layer 3 | 77 compiled regexes per call — cache at module level | Fix documented |
| 12 | LOW | Router | `lastFailures` undeclared variable | Fix documented |

7 of 12 issues are in the Context Builder — the translation layer between our engine types and the SAC. This is expected: it's the only component that touches real codebase types. The validation engine and router logic are internally consistent.

**Recommendation:** When implementing, write the Context Builder first with its tests. The type mismatches (Issues 1-8) will surface immediately at compile time. The validation engine and router can be implemented exactly as designed — they operate on the SAC abstraction, not on raw engine types.
