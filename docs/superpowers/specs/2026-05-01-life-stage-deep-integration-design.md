# Life-Stage-Aware Tippanni — Deep Integration Spec

**Date:** 2026-05-01
**Status:** Draft → Review
**Scope:** All three tiers — UI wiring, content reweighting, and conditional generation

---

## Problem

The tippanni engine produces identical interpretations for all ages. Saturn Mahadasha reads the same for a 20-year-old student and a 65-year-old retiree. Dhana Yogas are equally emphasized for teenagers and peak earners. Remedies prescribe intense fasting to 80-year-olds. Year predictions list "children prosper" for 18-year-olds. The result feels like a generic computer printout rather than a personal consultation from a pandit who sees the person in front of them.

## Solution

Thread `LifeStageContext` through every interpretation module. Every section — personality, dasha, yogas, year predictions, remedies, convergence, life areas — produces age-conditioned output. The six life stages (student, early_career, householder, established, elder, sage) each get distinct voices.

## Design Decisions (from brainstorming)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Dasha interpretation | **Conditional generation (B)** — different text per stage, not appended modifiers | 80% impact vs modifier approach; worth the test rewrite |
| Yoga significance | **Reweight + contextual suffix (B+C)** — `ageRelevance` multiplier + stage interpretation | Feels personalized without rewriting 127 definitions |
| Convergence patterns | **Boost/suppress by multiplier (A)** — nothing hidden, weighted by relevance | Avoids suppressing genuinely important patterns |
| Remedy intensity | **Lead with classical, add advisory notes** — no modification of traditional values | Respects shastra; adds "strict fasting may be challenging at advanced age, consider lighter alternatives" |
| Year predictions | **Conditional paragraphs per stage (B)** — different text for major transits | First thing users read; biggest impression opportunity |
| Personality section | **Stage-specific "What This Means Now" (A)** — 2-3 sentences per lagna × stage appended | Light touch; personality is inherent but developmental context adds value |

---

## Architecture

### Data Flow

```
BirthData.date
    ↓
getLifeStageContext(birthDate) → LifeStageContext
    ↓
┌──────────────────────────────────────────────────┐
│ generateTippanni(kundali, locale, stageCtx)      │
│                                                  │
│  ├─ generatePersonality(... stageCtx)            │
│  │   └─ appends "What This Means Now" per lagna  │
│  │                                               │
│  ├─ generateYearPredictions(... stageCtx)        │
│  │   └─ Jupiter/Saturn/Rahu transit text varies   │
│  │                                               │
│  ├─ generateYogas(... stageCtx)                  │
│  │   └─ ageRelevance multiplier + context suffix  │
│  │                                               │
│  ├─ generateLifeAreas(... stageCtx)              │
│  │   └─ framing text prepended (existing)         │
│  │                                               │
│  ├─ generateDashaInsight(... stageCtx)           │
│  │   └─ conditional advice text per stage         │
│  │                                               │
│  ├─ generateDashaSynthesis(... stageCtx)         │
│  │   └─ period themes conditioned on life phase   │
│  │                                               │
│  ├─ generateRemedies(... stageCtx)               │
│  │   └─ reorder by preference + add age advisory  │
│  │                                               │
│  └─ convergence engine                           │
│      └─ pattern weights adjusted by stage         │
└──────────────────────────────────────────────────┘
    ↓
TippanniContent (with lifeStage info)
    ↓
TippanniTab.tsx — renders headline, reorders life areas, shows remedy notes
```

### LifeStageContext (existing, no changes needed)

```ts
interface LifeStageContext {
  age: number;
  stage: 'student' | 'early_career' | 'householder' | 'established' | 'elder' | 'sage';
  priorityOrder: LifeAreaKey[];
  framing: Record<LifeAreaKey, { en: string; hi: string }>;
  headline: { en: string; hi: string };
  remedyPreference: RemedyPreference;
}
```

---

## Module-by-Module Changes

### 1. `tippanni-engine.ts` — Threading

**Change:** `generateTippanni` signature gains optional `stageCtx` parameter. If `kundali.birthData?.date` exists and `stageCtx` is not provided, compute it internally (current behavior). Pass `stageCtx` to every sub-generator.

```ts
export function generateTippanni(
  kundali: KundaliData,
  locale: Locale,
  stageCtx?: LifeStageContext
): TippanniContent
```

Each sub-generator gets `stageCtx?: LifeStageContext` as an optional last parameter. When absent (e.g., called from tests with minimal mock data), behavior is unchanged — age-neutral default.

### 2. `tippanni-engine.ts` — Personality ("What This Means Now")

**Change:** After generating the existing personality summary (lagna lord, moon sign, sun sign), append a `currentRelevance` field to `PersonalitySection`.

**Data structure:**
```ts
// New field on PersonalitySection
currentRelevance?: string; // 2-3 sentences, stage-specific
```

**Content:** 12 lagnas × 6 stages = 72 entries. Stored as a constant `LAGNA_STAGE_CONTEXT: Record<number, Record<LifeStage, { en: string; hi: string }>>`.

Example entries:
- **Taurus lagna, student:** "Your steadiness is your superpower in academics — while others burn out, you endure. This is the time to build deep expertise in one field rather than scattering your energy. The Venusian love of beauty can be channeled into architecture, design, or culinary arts."
- **Taurus lagna, elder:** "Your lifetime of patience now bears fruit in the stability others seek from you. This is the season to enjoy the material comforts you've earned and to guide the next generation in the art of persistence. Your relationship with beauty deepens — art, music, and nature become sources of profound peace."

**Location:** New file `src/lib/kundali/lagna-stage-context.ts` — pure data, no logic.

### 3. `year-predictions.ts` — Conditional Transit Paragraphs

**Change:** The three major transit generators (Jupiter, Saturn, Rahu-Ketu) produce different text per life stage.

**Current structure:** `JUPITER_TRANSIT_EFFECTS[house]` returns `{ en: string; hi: string }` — a single text for all ages.

**New structure:**
```ts
interface TransitEffect {
  base: { en: string; hi: string };          // fallback when no stage
  byStage?: Partial<Record<LifeStage, { en: string; hi: string }>>;
}
```

When `byStage[stage]` exists, use it instead of `base`. When it doesn't, fall back to `base`.

**Scope:** 12 houses × 3 planets × 6 stages = 216 entries maximum. In practice, many stages share similar text (e.g., householder and established often overlap). Target: ~100 unique entries for Jupiter (most impactful), ~60 for Saturn, ~36 for Rahu-Ketu axis. The rest fall back to `base`.

**Example:** Jupiter in 5th house:
- **student:** "Jupiter illuminates your house of education — this is a breakthrough year for academic achievement. Competitive exams favor you. Creative talents emerge. If you've been uncertain about your field of study, clarity arrives now."
- **householder:** "Jupiter in 5th brings joy through children, creative fulfillment, and speculative gains. If planning a family, this is among the most auspicious transits. Investment decisions made this year tend toward success."
- **sage:** "Jupiter blesses your 5th house of purva punya (past-life merit). Joy arrives through grandchildren, spiritual study, and creative hobbies. This is a year for writing memoirs, teaching, or deepening your meditation practice."

### 4. `dasha-effects-enhanced.ts` — Conditional Dasha Lord Analysis

**Change:** `getDashaLordAnalysis()` gains `stage?: LifeStage` parameter. The `advice` field (currently generic) becomes stage-conditioned.

**Current:** Returns `{ overall, dignityEffect, houseEffect, advice }` — `advice` is a single string.

**New:** `advice` is generated conditionally:
```ts
function getDashaAdvice(planet: string, dignity: string, stage: LifeStage): { en: string; hi: string }
```

**Data:** 9 planets × 3 dignity levels (strong/neutral/weak) × 6 stages = 162 entries. Stored in a new constant `DASHA_STAGE_ADVICE`.

**Example:** Saturn Mahadasha, strong dignity:
- **student:** "Saturn rewards your discipline now — academic rigor, competitive preparation, and structured routines bear fruit. Accept institutional authority as a teacher, not an enemy. The delays you feel are Saturn's way of building depth."
- **householder:** "Saturn in strength brings career consolidation, property acquisition, and organizational leadership. This is the period to build lasting structures — businesses, institutions, reputations. The effort is heavy but the foundation is permanent."
- **sage:** "Saturn, your old teacher, now crowns you with the respect of a life lived with integrity. This period brings recognition from institutions, government honors, and the quiet satisfaction of seeing your structures outlast you. Health requires attention — Saturn governs longevity but demands you maintain the body."

### 5. `dasha-synthesis.ts` — Period Theme Conditioning

**Change:** The dasha synthesis engine's `buildAntardashaBlock()` and `buildMahaDashaSummary()` functions receive `stage` and adjust their theme emphasis.

**Mechanism:** A lookup table maps `theme × stage → weight`:

```ts
const THEME_STAGE_WEIGHT: Record<string, Record<LifeStage, number>> = {
  career:      { student: 0.8, early_career: 1.3, householder: 1.5, established: 1.0, elder: 0.5, sage: 0.3 },
  education:   { student: 1.5, early_career: 1.0, householder: 0.6, established: 0.4, elder: 0.3, sage: 0.5 },
  marriage:    { student: 0.6, early_career: 1.4, householder: 1.2, established: 0.8, elder: 0.7, sage: 0.5 },
  wealth:      { student: 0.4, early_career: 0.8, householder: 1.5, established: 1.3, elder: 0.8, sage: 0.4 },
  health:      { student: 0.3, early_career: 0.4, householder: 0.7, established: 1.2, elder: 1.5, sage: 1.5 },
  spiritual:   { student: 0.3, early_career: 0.3, householder: 0.5, established: 0.8, elder: 1.3, sage: 1.5 },
  children:    { student: 0.1, early_career: 0.5, householder: 1.5, established: 1.2, elder: 0.8, sage: 0.5 },
};
```

When building the antardasha life-area effects, multiply the base score by the stage weight. This shifts which themes appear as "primary" vs "secondary" in the synthesis output.

### 6. `remedies-enhanced.ts` — Reorder + Age Advisory

**Change:** `getRemediesForWeakPlanets()` gains `stage?: LifeStage` parameter.

**Behavior:**
1. **Reorder:** Sort remedy items by `STAGE_REMEDIES[stage].preferred` — gemstones first for householder, mantras first for sage.
2. **Age advisory:** For stages `elder` and `sage`, append an advisory note to fasting remedies:

```ts
// Advisory note added to fasting remedies for elder/sage
const FASTING_ADVISORY = {
  en: 'Note: Strict fasting may be physically challenging at your age. Classical texts recommend modifying to a light sattvic diet (fruits, milk, grains) if full fasting is not feasible. Consult your physician before undertaking fasts.',
  hi: 'ध्यान दें: आपकी आयु में कठोर उपवास शारीरिक रूप से चुनौतीपूर्ण हो सकता है। शास्त्र हल्के सात्विक आहार (फल, दूध, अनाज) की अनुशंसा करते हैं यदि पूर्ण उपवास सम्भव न हो। उपवास से पहले चिकित्सक से परामर्श करें।',
};
```

3. **Mantra advisory:** For `sage` stage, add: "Consider chanting in smaller sessions (108 per sitting) rather than attempting the full count in one session."

**Classical values are NOT modified.** The mantra count stays 23,000. The fasting day stays Tuesday. Only advisory text is added.

### 7. `yogas-extended.ts` / `tippanni-engine.ts` (generateYogas) — Relevance + Context

**Change:** Each detected yoga gets two new optional fields:

```ts
interface YogaInsight {
  // ... existing fields
  ageRelevance?: number;     // 0.5 to 1.5 multiplier
  stageContext?: string;     // 1-2 sentence contextualizer
}
```

**Relevance multiplier:** Derived from yoga category × stage:
```ts
const YOGA_CATEGORY_STAGE_WEIGHT: Record<string, Record<LifeStage, number>> = {
  dhana:      { student: 0.6, early_career: 0.9, householder: 1.4, established: 1.3, elder: 0.8, sage: 0.5 },
  raja:       { student: 0.7, early_career: 1.2, householder: 1.5, established: 1.0, elder: 0.6, sage: 0.4 },
  moksha:     { student: 0.4, early_career: 0.4, householder: 0.5, established: 0.8, elder: 1.3, sage: 1.5 },
  parivartana:{ student: 0.8, early_career: 1.0, householder: 1.2, established: 1.0, elder: 0.8, sage: 0.7 },
  saraswati:  { student: 1.5, early_career: 1.2, householder: 0.8, established: 0.6, elder: 0.5, sage: 0.7 },
  daridra:    { student: 0.5, early_career: 0.8, householder: 1.3, established: 1.2, elder: 0.7, sage: 0.4 },
  health:     { student: 0.3, early_career: 0.5, householder: 0.8, established: 1.2, elder: 1.5, sage: 1.5 },
};
```

**Stage context suffix:** Per category × stage. Example:
- Dhana Yoga for student: "This wealth combination activates in your earning years — focus on building the skills and networks that will unlock it."
- Dhana Yoga for established: "You are in the prime window to activate this wealth combination. Strategic financial decisions now have outsized impact."
- Moksha Yoga for sage: "This spiritual liberation yoga is at its peak influence now. Meditation, pilgrimage, and scriptural study accelerate your journey."

**Sorting:** Yogas are sorted by `strength × ageRelevance` descending, so the most stage-relevant yogas appear first.

### 8. Convergence Engine — Pattern Weight Adjustment

**Change:** Add `age?: number` and `stage?: LifeStage` to `ConvergenceInput`.

**Mechanism:** In `scoring.ts`, after computing a pattern's base score, multiply by a theme-stage weight (same `THEME_STAGE_WEIGHT` table from dasha synthesis). This boosts health patterns for elders and career patterns for householders without hiding anything.

The `executiveInsights` post-processor in `post-processor.ts` sorts insights by adjusted score, naturally pushing stage-relevant insights to the top.

### 9. TippanniTab.tsx — UI Wiring

**Changes:**

1. **Life stage headline:** Render `tip.lifeStage.headline` as a banner at the top of the tippanni section, styled with the gold gradient. Include age and stage name.

2. **Life area reordering:** Render life area cards in `tip.lifeStage.priorityOrder` order instead of the fixed career/wealth/marriage/health/education sequence.

3. **Remedy advisory:** Show `tip.lifeStage.remedyNote` at the top of the remedies section.

4. **Yoga sorting:** Display yogas sorted by `ageRelevance × strength` descending. Show the `stageContext` text below each yoga's classical description.

5. **Personality "What This Means Now":** Render `tip.personality.currentRelevance` after the existing personality text, in a distinct styled block.

### 10. ELI5 Engine — Light Touch

**Change:** `generateELI5()` gains optional `stage?: LifeStage`. The "What to Watch" section gets a 1-sentence stage framing: "At your stage of life, the most important thing your chart says is: [stage-relevant headline from the most prominent life area]."

No deeper changes — ELI5 is already simplified; over-personalizing it adds complexity without proportional value.

---

## Data Volume Estimate

| Data set | Entries | Words/entry (avg) | Total words |
|----------|---------|-------------------|-------------|
| Lagna × stage personality | 72 (12 × 6) | 50 | ~3,600 |
| Jupiter transit × stage | ~60 (12 × ~5 unique) | 60 | ~3,600 |
| Saturn transit × stage | ~40 | 50 | ~2,000 |
| Rahu-Ketu axis × stage | ~24 (6 axes × ~4 unique) | 60 | ~1,440 |
| Dasha lord × dignity × stage | ~162 (9 × 3 × 6) | 50 | ~8,100 |
| Yoga category × stage context | ~42 (7 × 6) | 30 | ~1,260 |
| **Total content** | **~400** | | **~20,000 words** |

Plus Hindi translations: ~40,000 words total. This is substantial but one-time content creation.

---

## Files Modified

| File | Type of change |
|------|---------------|
| `src/lib/kundali/tippanni-engine.ts` | Thread stageCtx to all generators |
| `src/lib/kundali/tippanni-types.ts` | Add `currentRelevance` to PersonalitySection, `ageRelevance`/`stageContext` to YogaInsight |
| `src/lib/kundali/life-stage.ts` | No changes (already complete) |
| `src/lib/tippanni/year-predictions.ts` | Transit effects by stage |
| `src/lib/tippanni/dasha-effects-enhanced.ts` | `getDashaAdvice()` by stage |
| `src/lib/tippanni/dasha-synthesis.ts` | Theme weights by stage |
| `src/lib/tippanni/remedies-enhanced.ts` | Reorder + advisory notes |
| `src/lib/tippanni/convergence/types.ts` | Add age/stage to ConvergenceInput |
| `src/lib/tippanni/convergence/scoring.ts` | Multiply by theme-stage weight |
| `src/components/kundali/TippanniTab.tsx` | Render headline, reorder, advisory, yoga sort |
| `src/lib/kundali/eli5-engine.ts` | 1-sentence stage framing |

## New Files

| File | Purpose |
|------|---------|
| `src/lib/kundali/lagna-stage-context.ts` | 72 personality context entries (12 lagnas × 6 stages) |
| `src/lib/tippanni/stage-transit-effects.ts` | Jupiter/Saturn/Rahu stage-conditioned transit text |
| `src/lib/tippanni/dasha-stage-advice.ts` | 162 dasha advice entries (9 planets × 3 dignity × 6 stages) |
| `src/lib/tippanni/yoga-stage-context.ts` | Yoga category × stage relevance weights + context suffixes |
| `src/lib/tippanni/stage-weights.ts` | Shared THEME_STAGE_WEIGHT table used by dasha synthesis + convergence |

---

## Testing Strategy

1. **Unit tests for life-stage module:** Already pass. No changes needed.
2. **Update `kundali-subcalcs.test.ts`:** The `generateTippanni` test needs to pass a valid `birthData.date`. Update the test fixture.
3. **New test file `life-stage-integration.test.ts`:**
   - Verify personality `currentRelevance` is populated for all 6 stages
   - Verify yoga `ageRelevance` differs across stages for a Dhana yoga
   - Verify remedy ordering changes between student and sage
   - Verify year prediction text differs for Jupiter in 5th (student vs elder)
   - Verify dasha advice text differs for Saturn Mahadasha (student vs sage)
4. **Snapshot regression:** Run existing 3005 tests — ensure non-age-dependent paths are unchanged.
5. **Browser verification:** Generate kundali for birth dates in each stage bracket, visually confirm the tippanni sections show differentiated content.

---

## Non-Goals

- **No AI/LLM generation** — all content is deterministic, pre-authored text. No API calls.
- **No user-configurable life stage** — derived from birth date only. No "I feel younger than my age" toggle.
- **No gender-based differentiation** — life stage is age-only, not gendered.
- **No modification of classical values** — mantra counts, fasting rules, gemstone weights stay as prescribed by BPHS/Dharmasindhu. Only advisory notes added.
