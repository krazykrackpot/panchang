# Muhurta Engine — Unified Scanner + Rule Registry + Reasoning Engine

**Date:** 2026-05-05
**Goal:** Replace 3 fragmented scanners with a single Jyotish muhurta engine featuring composable rules, classical cancellation logic, priority cascades, and human-readable reasoning chains.

---

## Why "Engine", Not "Calculator"

A calculator sums scores. An engine **reasons**. The classical texts don't just say "Rohini is +8 points" — they say:

- *"A properly chosen lagna removes all defects"* (MC) — this is a **cancellation rule**, not a score
- *"Godhuli Lagna overrides ALL other factors for marriage"* (Brihat Samhita) — this is a **priority override**
- *"Inauspicious yogas contain a specific Visha Ghati; some discard only that portion"* — this is a **context-dependent partial application**
- *"Venus/Mercury/Jupiter in ascendant completely destroy all adverse influences"* (MC) — this is a **compound cancellation** requiring planetary house computation

The current implementation treats everything as additive arithmetic: score += bonus, score -= penalty. The real classical system has **layers of authority** where higher-layer factors can completely negate lower ones.

---

## Architecture

### Three Layers

```
Layer 3: Reasoning Engine
  Produces human-readable verdict chains from rule results.
  "Excellent window: Rohini + Shukla Saptami + Venus hora.
   Dur Muhurtam overlaps but strong Taurus lagna compensates (MC Ch.7)."

Layer 2: Evaluation Engine  
  Runs rules, applies cancellation logic, resolves conflicts.
  Knows that a strong lagna can cancel a weak karana.
  Knows that Godhuli overrides everything for marriage.

Layer 1: Rule Registry
  Self-contained rule objects. Each returns a raw assessment.
  No knowledge of other rules or cancellation logic.
```

### Layer 1: Rule Registry

Each rule is a pure function: given a context snapshot, return an assessment or null (not applicable).

```typescript
// src/lib/muhurta/engine/types.ts

type RuleScope = 'day' | 'window';
type RuleEffect = 'veto' | 'penalty' | 'bonus' | 'info';
type RuleCategory = 
  | 'panchanga'     // tithi, nakshatra, yoga, karana, vara
  | 'graha'         // combustion, transit positions, pushkar
  | 'kaala'         // hora, choghadiya, rahu kaal, dur muhurtam, varjyam, abhijit
  | 'lagna'         // ascendant quality, navamsha shuddhi
  | 'yoga-special'  // amrita siddhi, sarvartha siddhi, godhuli
  | 'period'        // adhika masa, chaturmas, kharmas, dakshinayana, holashtak
  | 'personal';     // tara bala, chandra bala, dasha harmony

interface MuhurtaRule {
  id: string;
  name: LocaleText;
  category: RuleCategory;
  scope: RuleScope;
  effect: RuleEffect;
  appliesTo: ExtendedActivityId[] | 'all';
  source?: string;                    // 'MC Ch.6', 'Dharma Sindhu', 'BPHS Ch.3'
  evaluate: (ctx: RuleContext) => RuleAssessment | null;
}

interface RuleAssessment {
  ruleId: string;
  points: number;                     // Raw contribution (+8, -5, etc.)
  maxPoints: number;                  // Maximum possible for normalisation
  vetoed?: boolean;                   // Hard veto — day/window is excluded
  severity: 'critical' | 'major' | 'moderate' | 'minor' | 'positive';
  reason: LocaleText;                 // "Rohini nakshatra — auspicious for marriage (MC Ch.6)"
  cancels?: string[];                 // Rule IDs this assessment can cancel
  cancelledBy?: string[];             // Rule IDs that can cancel this assessment
}
```

**Cancellation metadata** is declared on the rule assessment itself:
- `cancels: ['karana-quality', 'yoga-quality']` — "strong lagna cancels karana and yoga defects" (MC Ch.7)
- `cancelledBy: ['lagna-quality']` — "karana defect is cancelled by a strong lagna"

This is declarative, not procedural — the evaluation engine reads these declarations and applies them.

### Layer 2: Evaluation Engine

The evaluation engine runs all applicable rules, then resolves cancellations and conflicts.

```typescript
// src/lib/muhurta/engine/evaluator.ts

interface EvaluationResult {
  score: number;                      // Final normalised 0-100
  rawScore: number;
  grade: 'excellent' | 'good' | 'fair' | 'marginal' | 'poor';
  assessments: ResolvedAssessment[];  // All rule results with cancellation status
  vetoes: RuleAssessment[];           // Hard vetoes that killed this window
  activeSpecialYogas: string[];       // Amrita Siddhi, Sarvartha Siddhi, etc.
  cancellations: Cancellation[];      // Which rules cancelled which
}

interface ResolvedAssessment extends RuleAssessment {
  cancelled: boolean;                 // Was this assessment cancelled by a higher-authority rule?
  cancelledByRuleId?: string;         // Which rule cancelled it
  effectivePoints: number;            // Points after cancellation (0 if cancelled)
}

interface Cancellation {
  cancellerRuleId: string;
  cancellerReason: LocaleText;
  cancelledRuleId: string;
  cancelledReason: LocaleText;
}
```

**Cancellation resolution algorithm:**

1. Run all rules, collect assessments
2. Sort by authority tier (highest first):
   - **Tier 0 (Absolute):** Hard vetoes — combustion, Adhika Masa, Chaturmas, forbidden nakshatras. CANNOT be cancelled.
   - **Tier 1 (Override):** Godhuli Lagna — cancels everything except Tier 0.
   - **Tier 2 (Major):** Strong lagna (score >= 6), special yogas (Amrita/Sarvartha Siddhi), Pushkar Navamsha — can cancel Tier 4 defects.
   - **Tier 3 (Standard):** All panchanga factors (tithi, yoga, karana, vara), timing factors (hora, choghadiya).
   - **Tier 4 (Cancellable defects):** Weak karana, inauspicious yoga, Dur Muhurtam, Gulika Kaal, minor weekday penalty — can be cancelled by Tier 2.
3. For each Tier 2+ assessment with `cancels` list, find matching Tier 4 negative assessments and mark them `cancelled: true`
4. Compute final score from `effectivePoints` (cancelled assessments contribute 0)

**Classical cancellation rules (from MC, Brihat Samhita, BPHS):**

| Canceller | What it cancels | Source |
|-----------|----------------|--------|
| Strong lagna (score >= 6) | Karana defect, yoga defect, weekday defect | MC Ch.7: "a properly chosen lagna removes all defects" |
| Godhuli Lagna active | ALL negative assessments except hard vetoes | BS Ch.103: "character of nakshatra need not be considered" |
| Amrita Siddhi Yoga | Minor inauspicious periods (Dur Muhurtam, Gulika) | MC: special yogas override minor temporal defects |
| Pushkar Navamsha (Moon) | Panchaka, weak karana | Saravali: Pushkar positions purify |

**What cancellation does NOT override:**
- Hard vetoes (combustion, Adhika Masa, Chaturmas, Kharmas) — these are absolute prohibitions, not defects that lagna can fix
- Forbidden nakshatras — MC is explicit that these cannot be compensated

### Layer 3: Reasoning Engine

Converts the `EvaluationResult` into a human-readable verdict chain — what a pandit would tell you.

```typescript
// src/lib/muhurta/engine/reasoning.ts

interface MuhurtaVerdict {
  headline: LocaleText;               // "Excellent window for marriage"
  grade: 'excellent' | 'good' | 'fair' | 'marginal' | 'poor';
  summary: LocaleText;                // 2-3 sentence overview
  strengths: VerdictPoint[];          // Positive factors with citations
  concerns: VerdictPoint[];           // Negative factors (not cancelled)
  mitigations: VerdictPoint[];        // Cancellations that helped
  recommendation: LocaleText;         // "Proceed with confidence" / "Consider alternatives"
}

interface VerdictPoint {
  factor: LocaleText;                 // "Rohini nakshatra"
  assessment: LocaleText;             // "Auspicious for marriage — fixed, gentle nature"
  source?: string;                    // "MC Ch.6"
  severity: 'critical' | 'major' | 'moderate' | 'minor' | 'positive';
}
```

**Example verdict for a strong window:**

> **Excellent window for marriage** (Score: 82/100)
>
> Rohini nakshatra in Shukla Saptami with Venus hora — a classically strong combination. Taurus lagna at midpoint adds stability. Dur Muhurtam overlaps this window, but the strong lagna compensates per Muhurta Chintamani Ch.7.
>
> **Strengths:**
> - Rohini nakshatra — fixed, gentle; one of 11 auspicious nakshatras for marriage (MC Ch.6)
> - Shukla Saptami — auspicious tithi, waxing Moon (MC Ch.6)
> - Venus hora — planet of love and marriage governs this hour
> - Taurus lagna — Venus-ruled, stable; excellent for marriage (MC Ch.7, score 6/8)
> - Amrita Siddhi Yoga active — Thursday + Rohini combination (MC)
>
> **Concerns:**
> - ~~Dur Muhurtam (14th muhurta) — inauspicious window~~ *cancelled by strong lagna*
>
> **Recommendation:** Proceed with confidence. This is among the best windows in the selected range.

**Example verdict for a weak window:**

> **Marginal window for marriage** (Score: 38/100)
>
> Krishna Navami in Ashlesha nakshatra with Saturn hora. Multiple classical concerns; consider alternative dates.
>
> **Strengths:**
> - Outside Rahu Kaal
>
> **Concerns:**
> - Ashlesha nakshatra — Tikshna (fierce); avoided for marriage (MC Ch.6, Jyotirnibandha)
> - Krishna Navami — Rikta tithi in waning phase; double penalty (MC Ch.6)
> - Saturn hora — planet of restriction governs this hour
> - Panchaka not active but karana is Vishti — universally inauspicious (MC Ch.6)
>
> **Recommendation:** This window has significant classical concerns. If dates are flexible, look for a Shukla Paksha date with a Deva nakshatra.

---

## Unified Scanner

### Interface

```typescript
// src/lib/muhurta/engine/scanner.ts

interface ScanOptions {
  startDate: string;
  endDate: string;
  activity: ExtendedActivityId;
  lat: number;
  lng: number;
  tz: number;
  windowMinutes: number;
  preSunriseHours?: number;
  postSunsetHours?: number;
  birthNakshatra?: number;
  birthRashi?: number;
  dashaLords?: { maha: number; antar: number; pratyantar: number };
  maxResults?: number;
  minScore?: number;
  twoPass?: boolean;                  // Coarse-then-fine for large ranges
  twoPassTopDays?: number;            // Default: 5
  includeVerdicts?: boolean;          // Generate reasoning chains (more expensive)
}

interface ScoredWindow {
  date: string;
  startTime: string;
  endTime: string;
  timeSlot: number;
  score: number;                      // 0-100 normalised
  rawScore: number;
  grade: 'excellent' | 'good' | 'fair' | 'marginal' | 'poor';

  breakdown: WindowBreakdown;
  panchangContext: PanchangContext;
  factors: ResolvedAssessment[];
  cancellations: Cancellation[];
  inauspiciousPeriods: InauspiciousPeriod[];
  specialYogas: string[];
  taraBala?: { tara: number; name: string; auspicious: boolean };
  chandraBala?: boolean;
  verdict?: MuhurtaVerdict;           // Only when includeVerdicts: true
  dayVetoes?: RuleAssessment[];       // Why the day was restricted (if any)
}

interface WindowBreakdown {
  panchanga: number;                  // 0-25 (tithi+nak+yoga+karana+vara+panchaka)
  graha: number;                      // 0-15 (transit positions, pushkar)
  kaala: number;                      // 0-20 (hora+choghadiya+inauspicious periods+abhijit)
  lagna: number;                      // 0-12 (lagna quality + navamsha shuddhi)
  special: number;                    // 0-10 (special yogas, godhuli)
  personal: number;                   // 0-20 (tara+chandra+dasha, when provided)
}
```

### Score Budget (0-100)

| Category | Max | Components |
|----------|-----|-----------|
| Panchanga | 25 | Tithi (8), Nakshatra (8), Yoga (4), Karana (2), Vara (3), Panchaka (-5) |
| Graha | 15 | Benefic positions (9), no retro benefics (5), Pushkar Nav/Bhaga (10, capped) |
| Kaala | 20 | Hora (8), Choghadiya (6), Abhijit (6), inauspicious periods (deductions) |
| Lagna | 12 | Lagna sign (8), Navamsha Shuddhi (4) |
| Special | 10 | Amrita Siddhi (5), Sarvartha Siddhi (5), Godhuli (15, but capped) |
| Personal | 20 | Tara Bala (8), Chandra Bala (8), Dasha Harmony (8, only when provided) |
| **Total** | **102** | Normalised to 0-100. Over-100 possible from Godhuli override. |

Krishna Paksha adjustment (-1 to -6) and Holashtak (-8) are subtractive from the total.

### Two-Pass Architecture

For ranges > 7 days, the scanner uses coarse-then-fine:

**Pass 1 (Coarse):** Sample 6 points per day. Run only panchanga + period rules (cheap — no lagna, hora, or transits). Record peak score. Promote top N days.

**Pass 2 (Fine):** For promoted days, scan at `windowMinutes` resolution. Run ALL rules including lagna, hora, transits, cancellation logic, and optionally verdict generation.

For ranges <= 7 days, run fine scan directly.

---

## Adapter Layer

Thin wrappers that map the unified `ScoredWindow` to the format each existing caller expects. Zero breaking changes.

```typescript
// src/lib/muhurta/engine/adapters.ts

// For /api/muhurta-ai (expects ScoredTimeWindow with totalScore, keyFactors)
export function adaptToV1(windows: ScoredWindow[]): ScoredTimeWindow[] { ... }

// For /api/muhurta-scan, /api/muhurat/scan (expects ScanV2Window with DetailBreakdown)
export function adaptToV2(windows: ScoredWindow[]): ScanV2Window[] { ... }

// For /api/muhurta-search, /api/chart-chat (expects MuhurtaWindow with proof)
export function adaptToSmartSearch(windows: ScoredWindow[]): MuhurtaWindow[] { ... }
```

---

## New Rules (Not in Any Current Scanner)

### Godhuli Lagna (Brihat Samhita Ch.103)
- **Scope:** window
- **Effect:** bonus (+15, overrides cap) + cancels ALL negative assessments except hard vetoes
- **Condition:** Window includes sunset ± 24 minutes (when cows return, dust rises)
- **Activity:** Marriage, engagement only
- **Implementation:** Check if window overlaps `[sunsetUT - 0.4h, sunsetUT + 0.4h]`

### Tithi-Gandanthara (MC Ch.6)
- **Scope:** window
- **Effect:** penalty (-4)
- **Condition:** Last 2 ghatis of 5th/10th/Purnima; first 2 ghatis of 6th/11th/Krishna Pratipada
- **Implementation:** Check tithi fractional position within the lunar day cycle

### Exact Chaturmas Boundaries
- **Scope:** day
- **Effect:** veto
- **Condition:** Between Devshayani Ekadashi and Prabodhini Ekadashi (from tithi table)
- **Replaces:** Current month-level approximation

---

## File Structure

```
src/lib/muhurta/engine/
├── types.ts                  # MuhurtaRule, RuleContext, RuleAssessment, EvaluationResult, etc.
├── registry.ts               # Rule registry + rule resolution
├── evaluator.ts              # Cancellation logic, conflict resolution, score normalisation
├── reasoning.ts              # Verdict generation (reasoning chains)
├── scanner.ts                # Unified scanner (two-pass, window iteration)
├── context-builder.ts        # Builds RuleContext from JD + lat/lng + panchang snapshot
├── adapters.ts               # V1/V2/SmartSearch backward-compatible wrappers
└── rules/
    ├── panchanga.ts           # tithi, nakshatra, yoga, karana, vara, panchaka
    ├── graha.ts               # combustion vetoes, transit positions, pushkar nav/bhaga
    ├── kaala.ts               # hora, choghadiya, rahu kaal, yamaganda, gulika, dur muhurtam, varjyam, abhijit
    ├── lagna.ts               # lagna quality, navamsha shuddhi, krishna paksha adjustment
    ├── special-yogas.ts       # amrita siddhi, sarvartha siddhi, godhuli lagna
    ├── periods.ts             # adhika masa, chaturmas, kharmas, dakshinayana, shishutva, holashtak
    ├── personal.ts            # tara bala, chandra bala, dasha harmony
    └── gandanthara.ts         # tithi-gandanthara (new)
```

Existing files (`ai-recommender.ts`, `classical-checks.ts`, `inauspicious-periods.ts`, `smart-search.ts`, `time-window-scanner.ts`) are retained during migration. Once all callers use adapters, the old files become dead code and are deleted.

---

## Execution Strategy

**Phase 1: Foundation** — types, registry, context-builder, evaluator (no cancellation yet)
**Phase 2: Rules Migration** — extract existing scoring logic into rule objects
**Phase 3: Cancellation Engine** — implement classical cancellation rules
**Phase 4: Reasoning Engine** — verdict generation with citations
**Phase 5: Unified Scanner** — two-pass scanner using the engine
**Phase 6: Adapters + Wiring** — backward-compatible wrappers, switch callers
**Phase 7: New Rules** — Godhuli, Gandanthara, exact Chaturmas
**Phase 8: Cleanup** — delete old scanner files

---

## Risk Assessment

- **Scoring will shift** — the unified engine includes factors no individual scanner had (V2 gets hora + special yogas, smartSearch gets vetoes + inauspicious periods + navamsha). Top recommendations will change. This is intentional — the current scores are incomplete.
- **Cancellation logic is the riskiest part** — a bug in "strong lagna cancels karana defect" could incorrectly promote bad windows. Mitigation: each cancellation rule must cite its classical source, and verdicts explicitly show what was cancelled and why.
- **Performance** — the two-pass architecture is critical for month-view heatmaps. Lagna computation per window is expensive (~0.5ms). For a month at 120-min windows (~7 per day × 30 days = 210 windows), this is ~100ms total — acceptable.
- **Adapter regression** — side-by-side comparison on 10 sample dates before switching any production caller.
