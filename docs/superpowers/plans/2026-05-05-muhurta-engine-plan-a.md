# Muhurta Engine — Plan A: Foundation + Rules + Evaluator + Reasoning

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a composable Jyotish muhurta engine with typed rules, tiered cancellation logic, and pandit-style reasoning chains — independently testable before integrating with the scanner.

**Architecture:** Three-layer engine: Layer 1 (Rule Registry) holds self-contained rule objects. Layer 2 (Evaluator) runs rules against a context, resolves cancellations using a 5-tier authority system from MC/BPHS/Dharma Sindhu. Layer 3 (Reasoning) converts evaluation results into human-readable verdicts with classical citations. All existing scoring logic is extracted from `ai-recommender.ts`, `classical-checks.ts`, `inauspicious-periods.ts`, and `smart-search.ts` into rule objects.

**Tech Stack:** TypeScript, Vitest

**Spec:** `docs/superpowers/specs/2026-05-05-muhurta-scanner-unification-design.md`

**Testing philosophy:** Each rule is tested against known astronomical dates cross-referenced with Prokerala/Drik Panchang. Where our classical text interpretation differs from a third party, we document the textual reason and keep our value. See `docs/muhurta-rules.md` for all citations.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/lib/muhurta/engine/types.ts` | All interfaces: MuhurtaRule, RuleContext, RuleAssessment, EvaluationResult, MuhurtaVerdict |
| Create | `src/lib/muhurta/engine/registry.ts` | Rule registration, lookup by activity, authority tier definitions |
| Create | `src/lib/muhurta/engine/context-builder.ts` | Builds RuleContext from JD + lat/lng + activity + personal data |
| Create | `src/lib/muhurta/engine/rules/panchanga.ts` | 6 rules: tithi, nakshatra, yoga, karana, vara, panchaka |
| Create | `src/lib/muhurta/engine/rules/periods.ts` | 6 rules: combustion, adhika masa, chaturmas, kharmas, dakshinayana, shishutva |
| Create | `src/lib/muhurta/engine/rules/kaala.ts` | 7 rules: hora, choghadiya, rahu kaal, yamaganda, gulika, dur muhurtam, abhijit |
| Create | `src/lib/muhurta/engine/rules/lagna.ts` | 3 rules: lagna quality, navamsha shuddhi, krishna paksha adjustment |
| Create | `src/lib/muhurta/engine/rules/special-yogas.ts` | 3 rules: amrita siddhi, sarvartha siddhi, godhuli lagna |
| Create | `src/lib/muhurta/engine/rules/graha.ts` | 2 rules: transit strength, pushkar navamsha/bhaga |
| Create | `src/lib/muhurta/engine/rules/personal.ts` | 3 rules: tara bala, chandra bala, dasha harmony |
| Create | `src/lib/muhurta/engine/rules/varjyam.ts` | 1 rule: varjyam (moved from inauspicious-periods for clean separation) |
| Create | `src/lib/muhurta/engine/evaluator.ts` | Cancellation resolution, score normalisation, grade assignment |
| Create | `src/lib/muhurta/engine/reasoning.ts` | Verdict generation with strengths, concerns, mitigations, citations |
| Create | `src/lib/__tests__/muhurta-engine-core.test.ts` | Integration tests: full pipeline for known dates |

---

## Task 1: Engine Types

**Files:**
- Create: `src/lib/muhurta/engine/types.ts`

- [ ] **Step 1: Create the types file**

```typescript
/**
 * Muhurta Engine — Core Type Definitions
 *
 * Three-layer architecture:
 *   Layer 1: Rule Registry — self-contained rule objects
 *   Layer 2: Evaluator — cancellation resolution, scoring
 *   Layer 3: Reasoning — human-readable verdicts with citations
 */

import type { LocaleText } from '@/types/panchang';
import type { ExtendedActivityId, ExtendedActivity, InauspiciousPeriod } from '@/types/muhurta-ai';
import type { PanchangSnapshot } from '@/lib/muhurta/ai-recommender';

// ═══════════════════════════════════════════════════════════════════
// Layer 1: Rule Registry Types
// ═══════════════════════════════════════════════════════════════════

export type RuleScope = 'day' | 'window';

export type RuleEffect = 'veto' | 'penalty' | 'bonus' | 'info';

export type RuleCategory =
  | 'panchanga'      // tithi, nakshatra, yoga, karana, vara
  | 'graha'          // combustion, transit positions, pushkar
  | 'kaala'          // hora, choghadiya, rahu kaal, dur muhurtam, varjyam, abhijit
  | 'lagna'          // ascendant quality, navamsha shuddhi
  | 'yoga-special'   // amrita siddhi, sarvartha siddhi, godhuli
  | 'period'         // adhika masa, chaturmas, kharmas, dakshinayana, holashtak
  | 'personal';      // tara bala, chandra bala, dasha harmony

export type AuthorityTier = 0 | 1 | 2 | 3 | 4;
// Tier 0 (Absolute): Hard vetoes — combustion, Adhika, Chaturmas, forbidden nakshatras. CANNOT be cancelled.
// Tier 1 (Override): Godhuli Lagna — cancels everything except Tier 0.
// Tier 2 (Major): Strong lagna, special yogas, Pushkar Navamsha — can cancel Tier 4 defects.
// Tier 3 (Standard): All panchanga factors, timing factors.
// Tier 4 (Cancellable): Weak karana, inauspicious yoga, Dur Muhurtam, Gulika — can be cancelled by Tier 2.

export interface MuhurtaRule {
  id: string;
  name: LocaleText;
  category: RuleCategory;
  scope: RuleScope;
  effect: RuleEffect;
  tier: AuthorityTier;
  appliesTo: ExtendedActivityId[] | 'all';
  source?: string;                    // 'MC Ch.6', 'Dharma Sindhu', 'BPHS Ch.3'
  evaluate: (ctx: RuleContext) => RuleAssessment | null;
}

export interface RuleContext {
  // Day-level context
  date: string;                       // YYYY-MM-DD
  jdNoon: number;
  sunriseUT: number;
  sunsetUT: number;
  weekday: number;                    // 0=Sunday

  // Window-level context
  windowStartUT: number;
  windowEndUT: number;
  midpointJD: number;
  snap: PanchangSnapshot;             // tithi, nakshatra, yoga, karana, moonSign, moonSid, weekday
  lagnaSign?: number;                 // Sidereal ascendant sign 1-12 at midpoint
  navamshaSign?: number;              // D9 lagna sign 1-12 at midpoint

  // Activity context
  activity: ExtendedActivityId;
  activityRules: ExtendedActivity;

  // Location
  lat: number;
  lng: number;
  tz: number;

  // Personal (optional)
  birthNakshatra?: number;
  birthRashi?: number;
  dashaLords?: { maha: number; antar: number; pratyantar: number };

  // Planetary positions (pre-computed for the day, shared across windows)
  planets?: Array<{ id: number; longitude: number; isRetrograde: boolean }>;
  combustion?: { vetoed: boolean; planets: string[]; details: Array<{ planet: string; distance: number; orb: number; severity: 'full' | 'partial' }> };
  lunarMasa?: { masaIdx: number; name: string; isAdhika: boolean };
}

export type AssessmentSeverity = 'critical' | 'major' | 'moderate' | 'minor' | 'positive';

export interface RuleAssessment {
  ruleId: string;
  ruleName: LocaleText;
  category: RuleCategory;
  tier: AuthorityTier;
  points: number;                     // Raw contribution (+8, -5, etc.)
  maxPoints: number;                  // Maximum possible for normalisation
  vetoed?: boolean;                   // Hard veto — day/window is excluded
  severity: AssessmentSeverity;
  reason: LocaleText;                 // "Rohini nakshatra — auspicious for marriage (MC Ch.6)"
  source?: string;                    // Classical text citation
  cancels?: string[];                 // Rule IDs this assessment can cancel
  cancelledBy?: string[];             // Rule IDs that can cancel this assessment
}

// ═══════════════════════════════════════════════════════════════════
// Layer 2: Evaluator Types
// ═══════════════════════════════════════════════════════════════════

export interface ResolvedAssessment extends RuleAssessment {
  cancelled: boolean;
  cancelledByRuleId?: string;
  effectivePoints: number;            // 0 if cancelled, else points
}

export interface Cancellation {
  cancellerRuleId: string;
  cancellerReason: LocaleText;
  cancelledRuleId: string;
  cancelledReason: LocaleText;
  source?: string;
}

export type MuhurtaGrade = 'excellent' | 'good' | 'fair' | 'marginal' | 'poor';

export interface WindowBreakdown {
  panchanga: number;                  // 0-25
  graha: number;                      // 0-15
  kaala: number;                      // 0-20
  lagna: number;                      // 0-12
  special: number;                    // 0-10
  personal: number;                   // 0-20
}

export interface EvaluationResult {
  score: number;                      // Final normalised 0-100
  rawScore: number;
  grade: MuhurtaGrade;
  breakdown: WindowBreakdown;
  assessments: ResolvedAssessment[];
  vetoes: RuleAssessment[];
  cancellations: Cancellation[];
  activeSpecialYogas: string[];
}

// ═══════════════════════════════════════════════════════════════════
// Layer 3: Reasoning Types
// ═══════════════════════════════════════════════════════════════════

export interface VerdictPoint {
  factor: LocaleText;
  assessment: LocaleText;
  source?: string;
  severity: AssessmentSeverity;
  cancelled?: boolean;                // Show as strikethrough in UI
  cancelledBy?: string;               // "Strong Taurus lagna (MC Ch.7)"
}

export interface MuhurtaVerdict {
  headline: LocaleText;
  grade: MuhurtaGrade;
  summary: LocaleText;
  strengths: VerdictPoint[];
  concerns: VerdictPoint[];
  mitigations: VerdictPoint[];        // Cancellations that helped
  recommendation: LocaleText;
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/muhurta/engine/types.ts
git commit -m "feat(muhurta-engine): core type definitions for 3-layer architecture

MuhurtaRule, RuleContext, RuleAssessment (Layer 1),
ResolvedAssessment, EvaluationResult (Layer 2),
MuhurtaVerdict, VerdictPoint (Layer 3).

5-tier authority system for cancellation resolution:
Tier 0 (Absolute) → Tier 4 (Cancellable)."
```

---

## Task 2: Rule Registry

**Files:**
- Create: `src/lib/muhurta/engine/registry.ts`
- Test: `src/lib/__tests__/muhurta-engine-core.test.ts` (started)

- [ ] **Step 1: Create the registry**

```typescript
/**
 * Muhurta Engine — Rule Registry
 *
 * Central registry of all muhurta rules. Rules register themselves
 * at module load time. The evaluator queries the registry for rules
 * applicable to a given activity.
 */

import type { MuhurtaRule, RuleScope, ExtendedActivityId } from './types';

const rules: Map<string, MuhurtaRule> = new Map();

/** Register a rule. Throws if ID is duplicate. */
export function registerRule(rule: MuhurtaRule): void {
  if (rules.has(rule.id)) {
    throw new Error(`[muhurta-engine] Duplicate rule ID: ${rule.id}`);
  }
  rules.set(rule.id, rule);
}

/** Register multiple rules at once. */
export function registerRules(ruleList: MuhurtaRule[]): void {
  for (const rule of ruleList) registerRule(rule);
}

/** Get all rules applicable to an activity and scope. */
export function getRulesFor(activity: ExtendedActivityId, scope: RuleScope): MuhurtaRule[] {
  const result: MuhurtaRule[] = [];
  for (const rule of rules.values()) {
    if (rule.scope !== scope) continue;
    if (rule.appliesTo === 'all' || rule.appliesTo.includes(activity)) {
      result.push(rule);
    }
  }
  // Sort by tier (lowest = highest authority) for deterministic evaluation order
  return result.sort((a, b) => a.tier - b.tier);
}

/** Get a rule by ID. */
export function getRule(id: string): MuhurtaRule | undefined {
  return rules.get(id);
}

/** Get all registered rules (for testing/debugging). */
export function getAllRules(): MuhurtaRule[] {
  return [...rules.values()];
}

/** Clear all rules (for testing only). */
export function clearRules(): void {
  rules.clear();
}

/** Get count of registered rules. */
export function getRuleCount(): number {
  return rules.size;
}
```

- [ ] **Step 2: Write registry tests**

Create `src/lib/__tests__/muhurta-engine-core.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerRule, registerRules, getRulesFor, getRule,
  getAllRules, clearRules, getRuleCount,
} from '@/lib/muhurta/engine/registry';
import type { MuhurtaRule, RuleContext } from '@/lib/muhurta/engine/types';

// Minimal test rule factory
function makeRule(overrides: Partial<MuhurtaRule> & { id: string }): MuhurtaRule {
  return {
    name: { en: overrides.id, hi: overrides.id },
    category: 'panchanga',
    scope: 'window',
    effect: 'bonus',
    tier: 3,
    appliesTo: 'all',
    evaluate: () => null,
    ...overrides,
  };
}

describe('Rule Registry', () => {
  beforeEach(() => clearRules());

  it('registers and retrieves a rule by ID', () => {
    registerRule(makeRule({ id: 'test-1' }));
    expect(getRule('test-1')).toBeDefined();
    expect(getRule('test-1')!.id).toBe('test-1');
  });

  it('throws on duplicate rule ID', () => {
    registerRule(makeRule({ id: 'dup' }));
    expect(() => registerRule(makeRule({ id: 'dup' }))).toThrow('Duplicate rule ID: dup');
  });

  it('registers multiple rules at once', () => {
    registerRules([makeRule({ id: 'a' }), makeRule({ id: 'b' }), makeRule({ id: 'c' })]);
    expect(getRuleCount()).toBe(3);
  });

  it('filters rules by activity', () => {
    registerRules([
      makeRule({ id: 'all-rule', appliesTo: 'all' }),
      makeRule({ id: 'marriage-only', appliesTo: ['marriage'] }),
      makeRule({ id: 'travel-only', appliesTo: ['travel'] }),
    ]);
    const marriageRules = getRulesFor('marriage', 'window');
    expect(marriageRules.map(r => r.id)).toContain('all-rule');
    expect(marriageRules.map(r => r.id)).toContain('marriage-only');
    expect(marriageRules.map(r => r.id)).not.toContain('travel-only');
  });

  it('filters rules by scope', () => {
    registerRules([
      makeRule({ id: 'day-rule', scope: 'day' }),
      makeRule({ id: 'window-rule', scope: 'window' }),
    ]);
    expect(getRulesFor('marriage', 'day').map(r => r.id)).toEqual(['day-rule']);
    expect(getRulesFor('marriage', 'window').map(r => r.id)).toEqual(['window-rule']);
  });

  it('sorts rules by tier (lowest first = highest authority)', () => {
    registerRules([
      makeRule({ id: 'tier-3', tier: 3 }),
      makeRule({ id: 'tier-0', tier: 0 }),
      makeRule({ id: 'tier-2', tier: 2 }),
    ]);
    const rules = getRulesFor('marriage', 'window');
    expect(rules.map(r => r.id)).toEqual(['tier-0', 'tier-2', 'tier-3']);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/lib/__tests__/muhurta-engine-core.test.ts
```
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/muhurta/engine/registry.ts src/lib/__tests__/muhurta-engine-core.test.ts
git commit -m "feat(muhurta-engine): rule registry with activity/scope filtering

registerRule, getRulesFor, getRule. Sorts by authority tier.
Throws on duplicate IDs. 6 unit tests."
```

---

## Task 3: Context Builder

**Files:**
- Create: `src/lib/muhurta/engine/context-builder.ts`

- [ ] **Step 1: Create the context builder**

```typescript
/**
 * Muhurta Engine — Context Builder
 *
 * Builds a RuleContext from astronomical parameters. This is the bridge
 * between the raw ephemeris layer and the rule evaluation layer.
 *
 * Day-level context (computed once per day): sunrise/sunset, weekday,
 * combustion, lunar masa, planetary positions.
 *
 * Window-level context (computed per scoring window): panchang snapshot,
 * lagna, navamsha at midpoint.
 */

import {
  dateToJD, approximateSunriseSafe, approximateSunsetSafe,
  getPlanetaryPositions, toSidereal, getRashiNumber,
} from '@/lib/ephem/astronomical';
import { getPanchangSnapshot } from '@/lib/muhurta/ai-recommender';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import { checkVivahCombustion, scoreLagna, scoreNavamshaShuddhi } from '@/lib/muhurta/classical-checks';
import { getLunarMasaForDate } from '@/lib/calendar/hindu-months';
import type { RuleContext, ExtendedActivityId } from './types';

export interface DayContext {
  date: string;
  jdNoon: number;
  sunriseUT: number;
  sunsetUT: number;
  weekday: number;
  planets: RuleContext['planets'];
  combustion: RuleContext['combustion'];
  lunarMasa: RuleContext['lunarMasa'];
}

/**
 * Build day-level context. Called once per day, shared across all windows.
 */
export function buildDayContext(
  year: number, month: number, day: number,
  lat: number, lng: number, tz: number,
): DayContext {
  const jdNoon = dateToJD(year, month, day, 12 - tz);
  const sunriseUT = approximateSunriseSafe(jdNoon, lat, lng);
  const sunsetUT = approximateSunsetSafe(jdNoon, lat, lng);
  const weekday = Math.floor(jdNoon + 1.5) % 7; // 0=Sunday

  const planets = getPlanetaryPositions(jdNoon).map(p => ({
    id: p.id, longitude: p.longitude, isRetrograde: p.isRetrograde,
  }));
  const combustion = checkVivahCombustion(jdNoon);
  const masa = getLunarMasaForDate(year, month, day);
  const lunarMasa = masa ? { masaIdx: masa.masaIdx, name: masa.name, isAdhika: masa.isAdhika } : undefined;

  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return { date: dateStr, jdNoon, sunriseUT, sunsetUT, weekday, planets, combustion, lunarMasa };
}

/**
 * Build window-level context. Called per scoring window within a day.
 */
export function buildWindowContext(
  day: DayContext,
  windowStartUT: number,
  windowEndUT: number,
  activity: ExtendedActivityId,
  lat: number, lng: number, tz: number,
  personal?: { birthNakshatra?: number; birthRashi?: number; dashaLords?: { maha: number; antar: number; pratyantar: number } },
): RuleContext {
  const midUT = (windowStartUT + windowEndUT) / 2;
  const midpointJD = day.jdNoon + (midUT - (12 - tz)) / 24;
  const snap = getPanchangSnapshot(midpointJD, lat, lng);
  const activityRules = getExtendedActivity(activity);

  // Lagna at midpoint
  const lagnaResult = scoreLagna(midpointJD, lat, lng, activity);
  const navamshaResult = scoreNavamshaShuddhi(midpointJD, lat, lng, activity);

  return {
    date: day.date,
    jdNoon: day.jdNoon,
    sunriseUT: day.sunriseUT,
    sunsetUT: day.sunsetUT,
    weekday: day.weekday,
    windowStartUT,
    windowEndUT,
    midpointJD,
    snap,
    lagnaSign: lagnaResult.rashi,
    navamshaSign: navamshaResult.rashi,
    activity,
    activityRules,
    lat, lng, tz,
    planets: day.planets,
    combustion: day.combustion,
    lunarMasa: day.lunarMasa,
    birthNakshatra: personal?.birthNakshatra,
    birthRashi: personal?.birthRashi,
    dashaLords: personal?.dashaLords,
  };
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

Note: `scoreNavamshaShuddhi` returns an object with `rashi` — check the actual return type in `classical-checks.ts`. If it doesn't have `rashi`, adjust accordingly. Read the function signature before assuming.

- [ ] **Step 3: Commit**

```bash
git add src/lib/muhurta/engine/context-builder.ts
git commit -m "feat(muhurta-engine): context builder — day-level and window-level

buildDayContext: sunrise/sunset, planets, combustion, lunar masa.
buildWindowContext: panchang snapshot, lagna, navamsha at midpoint.
Day context shared across windows for performance."
```

---

## Task 4: Panchanga Rules (6 Rules)

**Files:**
- Create: `src/lib/muhurta/engine/rules/panchanga.ts`
- Test: add to `src/lib/__tests__/muhurta-engine-core.test.ts`

These 6 rules are extracted from `scorePanchangFactors()` in `ai-recommender.ts` (lines 39-152). Each rule is a self-contained object that evaluates one panchanga factor.

- [ ] **Step 1: Create the panchanga rules file**

```typescript
/**
 * Panchanga Rules — Tithi, Nakshatra, Yoga, Karana, Vara, Panchaka
 *
 * Extracted from ai-recommender.ts → scorePanchangFactors().
 * Each rule evaluates one element of the five-fold panchanga quality check.
 *
 * Classical sources: Muhurta Chintamani Ch.6, B.V. Raman Ch.12-13.
 * See docs/muhurta-rules.md for full citations.
 */

import type { MuhurtaRule, RuleAssessment, RuleContext } from '../types';

// 9 inauspicious yogas per MC Ch.6 (Vivah Prakarana)
const INAUSPICIOUS_YOGAS = new Set([1, 6, 9, 10, 13, 15, 17, 19, 27]);

export const tithiRule: MuhurtaRule = {
  id: 'tithi-quality',
  name: { en: 'Tithi Quality', hi: 'तिथि गुणवत्ता' },
  category: 'panchanga',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.6',
  evaluate: (ctx: RuleContext): RuleAssessment | null => {
    const pakshaRelTithi = ctx.snap.tithi > 15 ? ctx.snap.tithi - 15 : ctx.snap.tithi;
    const isKrishna = ctx.snap.tithi > 15;
    const rules = ctx.activityRules;

    let points = 0;
    let reason: { en: string; hi: string };
    let severity: RuleAssessment['severity'] = 'moderate';

    if (rules.avoidTithis.includes(pakshaRelTithi)) {
      points = -5;
      reason = { en: `Rikta Tithi — inauspicious (MC Ch.6)`, hi: `रिक्त तिथि — अशुभ` };
      severity = 'major';
    } else if (rules.goodTithis.includes(pakshaRelTithi) && !isKrishna) {
      points = 8;
      reason = { en: `Auspicious Tithi (Shukla Paksha)`, hi: `शुभ तिथि (शुक्ल पक्ष)` };
      severity = 'positive';
    } else if (rules.goodTithis.includes(pakshaRelTithi) && isKrishna) {
      points = 1;
      reason = { en: `Good Tithi but Krishna Paksha — reduced auspiciousness`, hi: `शुभ तिथि किन्तु कृष्ण पक्ष — न्यून शुभत्व` };
      severity = 'minor';
    } else if (isKrishna) {
      points = -3;
      reason = { en: `Krishna Paksha — non-good Tithi`, hi: `कृष्ण पक्ष — अशुभ तिथि` };
      severity = 'moderate';
    } else {
      points = 0;
      reason = { en: `Neutral Tithi`, hi: `तटस्थ तिथि` };
      severity = 'minor';
    }

    return {
      ruleId: 'tithi-quality', ruleName: tithiRule.name, category: 'panchanga',
      tier: 3, points, maxPoints: 8, severity, reason, source: 'MC Ch.6',
      cancelledBy: ['lagna-quality'],
    };
  },
};

export const nakshatraRule: MuhurtaRule = {
  id: 'nakshatra-quality',
  name: { en: 'Nakshatra Quality', hi: 'नक्षत्र गुणवत्ता' },
  category: 'panchanga',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.6, Jyotirnibandha',
  evaluate: (ctx: RuleContext): RuleAssessment | null => {
    const rules = ctx.activityRules;

    // Hard avoid — Tier 0 veto
    if (rules.hardAvoidNakshatras?.includes(ctx.snap.nakshatra)) {
      return {
        ruleId: 'nakshatra-quality', ruleName: nakshatraRule.name, category: 'panchanga',
        tier: 0, points: 0, maxPoints: 8, vetoed: true, severity: 'critical',
        reason: { en: `Forbidden nakshatra for ${ctx.activity} — strong textual consensus (MC Ch.6, Jyotirnibandha)`, hi: `${ctx.activity} के लिए वर्जित नक्षत्र — शास्त्रीय सहमति` },
        source: 'MC Ch.6, Jyotirnibandha',
      };
    }

    let points = 0;
    let reason: { en: string; hi: string };
    let severity: RuleAssessment['severity'] = 'moderate';

    if (rules.goodNakshatras.includes(ctx.snap.nakshatra)) {
      points = 8;
      reason = { en: `Auspicious nakshatra for ${ctx.activity}`, hi: `${ctx.activity} के लिए शुभ नक्षत्र` };
      severity = 'positive';
    } else if (rules.avoidNakshatras.includes(ctx.snap.nakshatra)) {
      points = -5;
      reason = { en: `Inauspicious nakshatra`, hi: `अशुभ नक्षत्र` };
      severity = 'major';
    } else {
      points = 0;
      reason = { en: `Neutral nakshatra`, hi: `तटस्थ नक्षत्र` };
      severity = 'minor';
    }

    return {
      ruleId: 'nakshatra-quality', ruleName: nakshatraRule.name, category: 'panchanga',
      tier: 3, points, maxPoints: 8, severity, reason, source: 'MC Ch.6',
    };
  },
};

export const yogaRule: MuhurtaRule = {
  id: 'yoga-quality',
  name: { en: 'Yoga Quality', hi: 'योग गुणवत्ता' },
  category: 'panchanga',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.6',
  evaluate: (ctx: RuleContext): RuleAssessment | null => {
    const isInauspicious = INAUSPICIOUS_YOGAS.has(ctx.snap.yoga);
    return {
      ruleId: 'yoga-quality', ruleName: yogaRule.name, category: 'panchanga',
      tier: 3,
      points: isInauspicious ? -3 : 4,
      maxPoints: 4,
      severity: isInauspicious ? 'moderate' : 'positive',
      reason: isInauspicious
        ? { en: `Inauspicious Yoga — one of 9 Ashubh Yogas (MC Ch.6)`, hi: `अशुभ योग — 9 अशुभ योगों में से एक` }
        : { en: `Auspicious Yoga`, hi: `शुभ योग` },
      source: 'MC Ch.6',
      cancelledBy: isInauspicious ? ['lagna-quality'] : undefined,
    };
  },
};

export const karanaRule: MuhurtaRule = {
  id: 'karana-quality',
  name: { en: 'Karana Quality', hi: 'करण गुणवत्ता' },
  category: 'panchanga',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.6',
  evaluate: (ctx: RuleContext): RuleAssessment | null => {
    const k = ctx.snap.karana;
    let points: number;
    let reason: { en: string; hi: string };
    let severity: RuleAssessment['severity'];

    if (k === 7) {
      // Vishti (Bhadra) — universally inauspicious
      points = -5;
      reason = { en: `Vishti (Bhadra) Karana — universally inauspicious`, hi: `विष्टि (भद्रा) करण — सर्वथा अशुभ` };
      severity = 'major';
    } else if ([8, 9, 10].includes(k)) {
      // Sthira karanas: Shakuni, Chatushpada, Naga
      points = -3;
      reason = { en: `Sthira Karana — inauspicious`, hi: `स्थिर करण — अशुभ` };
      severity = 'moderate';
    } else if (k === 11) {
      // Kimstughna — auspicious sthira
      points = 2;
      reason = { en: `Kimstughna Karana — auspicious`, hi: `किंस्तुघ्न करण — शुभ` };
      severity = 'positive';
    } else if (k >= 1 && k <= 6) {
      // Chara karanas — favorable
      points = 2;
      reason = { en: `Chara Karana — favorable`, hi: `चर करण — अनुकूल` };
      severity = 'positive';
    } else {
      points = 0;
      reason = { en: `Neutral Karana`, hi: `तटस्थ करण` };
      severity = 'minor';
    }

    return {
      ruleId: 'karana-quality', ruleName: karanaRule.name, category: 'panchanga',
      tier: k === 7 ? 4 : 3, // Vishti is Tier 4 (cancellable by strong lagna)
      points, maxPoints: 2, severity, reason, source: 'MC Ch.6',
      cancelledBy: (k === 7 || k >= 8 && k <= 10) ? ['lagna-quality'] : undefined,
    };
  },
};

export const varaRule: MuhurtaRule = {
  id: 'vara-quality',
  name: { en: 'Weekday Quality', hi: 'वार गुणवत्ता' },
  category: 'panchanga',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.6',
  evaluate: (ctx: RuleContext): RuleAssessment | null => {
    const rules = ctx.activityRules;
    let points: number;
    let reason: { en: string; hi: string };
    let severity: RuleAssessment['severity'];

    if (rules.goodWeekdays.includes(ctx.snap.weekday)) {
      points = 3;
      reason = { en: `Favourable weekday`, hi: `अनुकूल वार` };
      severity = 'positive';
    } else if (ctx.snap.weekday === 2) {
      points = -4;
      reason = { en: `Tuesday (Mangalvar) — generally avoided`, hi: `मंगलवार — सामान्यतः वर्ज्य` };
      severity = 'moderate';
    } else if (ctx.snap.weekday === 6) {
      points = -3;
      reason = { en: `Saturday (Shanivar) — less auspicious`, hi: `शनिवार — अल्प शुभ` };
      severity = 'moderate';
    } else if (ctx.snap.weekday === 0) {
      points = -1;
      reason = { en: `Sunday — neutral (MC lists as auspicious; Raman omits)`, hi: `रविवार — तटस्थ` };
      severity = 'minor';
    } else {
      points = 0;
      reason = { en: `Neutral weekday`, hi: `तटस्थ वार` };
      severity = 'minor';
    }

    return {
      ruleId: 'vara-quality', ruleName: varaRule.name, category: 'panchanga',
      tier: 4, // Weekday defects are cancellable
      points, maxPoints: 3, severity, reason, source: 'MC Ch.6',
      cancelledBy: points < 0 ? ['lagna-quality'] : undefined,
    };
  },
};

export const panchakaRule: MuhurtaRule = {
  id: 'panchaka',
  name: { en: 'Panchaka', hi: 'पंचक' },
  category: 'panchanga',
  scope: 'window',
  effect: 'penalty',
  tier: 3,
  appliesTo: 'all',
  evaluate: (ctx: RuleContext): RuleAssessment | null => {
    if (ctx.snap.nakshatra < 23 || ctx.snap.nakshatra > 27) return null; // Not active

    return {
      ruleId: 'panchaka', ruleName: panchakaRule.name, category: 'panchanga',
      tier: 3, points: -5, maxPoints: 0, severity: 'major',
      reason: { en: `Panchaka active — Moon in nakshatras 23-27 zone`, hi: `पंचक सक्रिय — चन्द्र अशुभ नक्षत्र क्षेत्र में` },
      cancelledBy: ['pushkar-navamsha'],
    };
  },
};

/** All panchanga rules for bulk registration */
export const PANCHANGA_RULES: MuhurtaRule[] = [
  tithiRule, nakshatraRule, yogaRule, karanaRule, varaRule, panchakaRule,
];
```

- [ ] **Step 2: Write panchanga rule tests**

Add to `src/lib/__tests__/muhurta-engine-core.test.ts`:

```typescript
import { PANCHANGA_RULES, tithiRule, nakshatraRule, karanaRule } from '@/lib/muhurta/engine/rules/panchanga';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';

// Minimal context factory for rule testing
function makeCtx(overrides: Partial<RuleContext>): RuleContext {
  const activity = overrides.activity ?? 'marriage';
  return {
    date: '2026-05-05', jdNoon: 2461401.5, sunriseUT: 4.5, sunsetUT: 19.0,
    weekday: 1, windowStartUT: 10, windowEndUT: 11.5, midpointJD: 2461401.5,
    snap: { tithi: 7, nakshatra: 4, yoga: 2, karana: 2, weekday: 1, moonSign: 2, moonSid: 45.0 },
    activity, activityRules: getExtendedActivity(activity),
    lat: 46.46, lng: 6.80, tz: 2,
    ...overrides,
  } as RuleContext;
}

describe('Panchanga Rules', () => {
  it('tithi: Shukla Saptami scores +8 for marriage', () => {
    const result = tithiRule.evaluate(makeCtx({ snap: { ...makeCtx({}).snap, tithi: 7 } }));
    expect(result?.points).toBe(8);
    expect(result?.severity).toBe('positive');
  });

  it('tithi: Krishna Navami (avoid) scores -5', () => {
    const result = tithiRule.evaluate(makeCtx({ snap: { ...makeCtx({}).snap, tithi: 24 } })); // Krishna Navami = 15+9
    expect(result?.points).toBe(-5);
  });

  it('nakshatra: Rohini (4) scores +8 for marriage', () => {
    const result = nakshatraRule.evaluate(makeCtx({ snap: { ...makeCtx({}).snap, nakshatra: 4 } }));
    expect(result?.points).toBe(8);
  });

  it('nakshatra: Ardra (6) is hard-vetoed for marriage', () => {
    const result = nakshatraRule.evaluate(makeCtx({ snap: { ...makeCtx({}).snap, nakshatra: 6 } }));
    expect(result?.vetoed).toBe(true);
    expect(result?.tier).toBe(0);
  });

  it('karana: Vishti (7) scores -5 and is Tier 4 (cancellable)', () => {
    const result = karanaRule.evaluate(makeCtx({ snap: { ...makeCtx({}).snap, karana: 7 } }));
    expect(result?.points).toBe(-5);
    expect(result?.tier).toBe(4);
    expect(result?.cancelledBy).toContain('lagna-quality');
  });

  it('all 6 panchanga rules are defined', () => {
    expect(PANCHANGA_RULES).toHaveLength(6);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/lib/__tests__/muhurta-engine-core.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/muhurta/engine/rules/panchanga.ts src/lib/__tests__/muhurta-engine-core.test.ts
git commit -m "feat(muhurta-engine): 6 panchanga rules — tithi, nakshatra, yoga, karana, vara, panchaka

Extracted from ai-recommender.ts → scorePanchangFactors().
Each rule is self-contained with cancellation metadata:
- Vishti karana is Tier 4 (cancellable by strong lagna per MC Ch.7)
- Forbidden nakshatras are Tier 0 (absolute veto, never cancelled)
- Weekday defects are Tier 4 (cancellable)
6 unit tests."
```

---

## Task 5: Period/Veto Rules (6 Day-Level Rules)

**Files:**
- Create: `src/lib/muhurta/engine/rules/periods.ts`

These are day-level hard vetoes extracted from the V2 scanner's inline checks (`time-window-scanner.ts:288-332`) and `classical-checks.ts`. They run once per day before window scanning.

- [ ] **Step 1: Create the period rules file**

Extract the following from existing code:
- `venus-jupiter-combustion` — from `checkVivahCombustion()` in `classical-checks.ts`
- `adhika-masa` — from `isAdhikaMasa()` in `classical-checks.ts`
- `chaturmas` — from `checkChaturmas()` in `classical-checks.ts`
- `kharmas` — from `isProhibitedSolarMonth()` in `classical-checks.ts`
- `dakshinayana` — from `isDakshinayana()` in `classical-checks.ts`
- `shishutva` — from `checkShishutva()` in `classical-checks.ts`

Each rule:
- `scope: 'day'` — evaluated once per day
- `tier: 0` — absolute, cannot be cancelled
- `effect: 'veto'` — hard veto, day is skipped
- `appliesTo` varies by samskara type (see tiered activity sets in V2 scanner lines 256-271)

The rule implementations should call the existing functions from `classical-checks.ts` — don't re-implement, just wrap. This is an extraction, not a rewrite.

```typescript
/**
 * Period Rules — Day-level hard vetoes
 *
 * Classical prohibitions that exclude entire days from consideration.
 * These are Tier 0 (absolute) — no other factor can override them.
 *
 * Extracted from time-window-scanner.ts (V2 inline checks) +
 * classical-checks.ts helper functions.
 */

import type { MuhurtaRule, RuleAssessment, RuleContext } from '../types';
import {
  checkVivahCombustion, isAdhikaMasa, checkChaturmas,
  isProhibitedSolarMonth, checkShishutva, isDakshinayana,
} from '@/lib/muhurta/classical-checks';

// Activity sets matching V2 scanner's tiered prohibition levels
const SAMSKARA_FULL = new Set(['marriage', 'engagement', 'griha_pravesh']);
const SAMSKARA_PARTIAL = new Set(['upanayana']);
const SAMSKARA_LIGHT = new Set(['mundan']);
const ALL_SAMSKARAS = new Set([...SAMSKARA_FULL, ...SAMSKARA_PARTIAL, ...SAMSKARA_LIGHT]);

export const combustionVetoRule: MuhurtaRule = {
  id: 'venus-jupiter-combustion',
  name: { en: 'Venus/Jupiter Combustion', hi: 'शुक्र/गुरु अस्त' },
  category: 'period',
  scope: 'day',
  effect: 'veto',
  tier: 0,
  appliesTo: ['marriage', 'engagement', 'griha_pravesh', 'upanayana', 'mundan', 'namakarana'],
  source: 'MC + Dharma Sindhu',
  evaluate: (ctx: RuleContext): RuleAssessment | null => {
    if (!ALL_SAMSKARAS.has(ctx.activity)) return null;
    if (!ctx.combustion?.vetoed) return null;
    return {
      ruleId: 'venus-jupiter-combustion', ruleName: combustionVetoRule.name, category: 'period',
      tier: 0, points: 0, maxPoints: 0, vetoed: true, severity: 'critical',
      reason: {
        en: `${ctx.combustion.planets.join(' & ')} combust — samskaras forbidden (MC, Dharma Sindhu)`,
        hi: `${ctx.combustion.planets.join(' और ')} अस्त — संस्कार वर्जित`,
      },
      source: 'MC + Dharma Sindhu',
    };
  },
};

export const adhikaMasaVetoRule: MuhurtaRule = {
  id: 'adhika-masa',
  name: { en: 'Adhika Masa', hi: 'अधिक मास' },
  category: 'period',
  scope: 'day',
  effect: 'veto',
  tier: 0,
  appliesTo: ['marriage', 'engagement', 'griha_pravesh', 'upanayana', 'mundan'],
  source: 'Dharma Sindhu',
  evaluate: (ctx: RuleContext): RuleAssessment | null => {
    if (ctx.activity === 'namakarana') return null; // Namakarana exempt
    if (!ALL_SAMSKARAS.has(ctx.activity)) return null;
    const [y, m, d] = ctx.date.split('-').map(Number);
    if (!isAdhikaMasa(y, m, d)) return null;
    return {
      ruleId: 'adhika-masa', ruleName: adhikaMasaVetoRule.name, category: 'period',
      tier: 0, points: 0, maxPoints: 0, vetoed: true, severity: 'critical',
      reason: { en: `Adhika Masa — samskaras prohibited (Dharma Sindhu)`, hi: `अधिक मास — संस्कार वर्जित` },
      source: 'Dharma Sindhu',
    };
  },
};

export const chaturmasVetoRule: MuhurtaRule = {
  id: 'chaturmas',
  name: { en: 'Chaturmas', hi: 'चातुर्मास' },
  category: 'period',
  scope: 'day',
  effect: 'veto',
  tier: 0,
  appliesTo: ['marriage', 'engagement', 'griha_pravesh', 'upanayana'],
  source: 'Dharma Sindhu',
  evaluate: (ctx: RuleContext): RuleAssessment | null => {
    if (!SAMSKARA_FULL.has(ctx.activity) && !SAMSKARA_PARTIAL.has(ctx.activity)) return null;
    const [y, m, d] = ctx.date.split('-').map(Number);
    if (checkChaturmas(y, m, d) !== 'full') return null;
    return {
      ruleId: 'chaturmas', ruleName: chaturmasVetoRule.name, category: 'period',
      tier: 0, points: 0, maxPoints: 0, vetoed: true, severity: 'critical',
      reason: { en: `Chaturmas — Harishayana period, samskaras prohibited`, hi: `चातुर्मास — हरिशयन काल, संस्कार वर्जित` },
      source: 'Dharma Sindhu',
    };
  },
};

export const kharmasVetoRule: MuhurtaRule = {
  id: 'kharmas',
  name: { en: 'Kharmas', hi: 'खरमास' },
  category: 'period',
  scope: 'day',
  effect: 'veto',
  tier: 0,
  appliesTo: ['marriage', 'engagement', 'griha_pravesh'],
  source: 'Dharma Sindhu',
  evaluate: (ctx: RuleContext): RuleAssessment | null => {
    if (!SAMSKARA_FULL.has(ctx.activity)) return null;
    if (!isProhibitedSolarMonth(ctx.jdNoon)) return null;
    return {
      ruleId: 'kharmas', ruleName: kharmasVetoRule.name, category: 'period',
      tier: 0, points: 0, maxPoints: 0, vetoed: true, severity: 'critical',
      reason: { en: `Kharmas — Sun in Dhanu/Mina, auspicious activities restricted`, hi: `खरमास — सूर्य धनु/मीन में, शुभ कार्य वर्जित` },
      source: 'Dharma Sindhu',
    };
  },
};

export const dakshinayanaVetoRule: MuhurtaRule = {
  id: 'dakshinayana',
  name: { en: 'Dakshinayana', hi: 'दक्षिणायन' },
  category: 'period',
  scope: 'day',
  effect: 'veto',
  tier: 0,
  appliesTo: ['mundan'],
  source: 'MC Chudakarana Prakarana',
  evaluate: (ctx: RuleContext): RuleAssessment | null => {
    if (ctx.activity !== 'mundan') return null;
    if (!isDakshinayana(ctx.jdNoon)) return null;
    return {
      ruleId: 'dakshinayana', ruleName: dakshinayanaVetoRule.name, category: 'period',
      tier: 0, points: 0, maxPoints: 0, vetoed: true, severity: 'critical',
      reason: { en: `Dakshinayana — Uttarayana required for Mundan (MC)`, hi: `दक्षिणायन — मुण्डन के लिए उत्तरायण आवश्यक` },
      source: 'MC Chudakarana Prakarana',
    };
  },
};

export const shishutvaVetoRule: MuhurtaRule = {
  id: 'shishutva',
  name: { en: 'Shishutva (Post-Combustion Grace)', hi: 'शिशुत्व' },
  category: 'period',
  scope: 'day',
  effect: 'veto',
  tier: 0,
  appliesTo: ['marriage', 'engagement', 'griha_pravesh'],
  source: 'BPHS (Bala phase)',
  evaluate: (ctx: RuleContext): RuleAssessment | null => {
    if (!SAMSKARA_FULL.has(ctx.activity)) return null;
    if (!checkShishutva(ctx.jdNoon)) return null;
    return {
      ruleId: 'shishutva', ruleName: shishutvaVetoRule.name, category: 'period',
      tier: 0, points: 0, maxPoints: 0, vetoed: true, severity: 'critical',
      reason: { en: `Venus/Jupiter in Shishutva (infant phase, 5 days post-combustion)`, hi: `शुक्र/गुरु शिशुत्व में (अस्त के 5 दिन बाद)` },
      source: 'BPHS',
    };
  },
};

export const PERIOD_RULES: MuhurtaRule[] = [
  combustionVetoRule, adhikaMasaVetoRule, chaturmasVetoRule,
  kharmasVetoRule, dakshinayanaVetoRule, shishutvaVetoRule,
];
```

- [ ] **Step 2: Run type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/muhurta/engine/rules/periods.ts
git commit -m "feat(muhurta-engine): 6 period rules — combustion, adhika, chaturmas, kharmas, dakshinayana, shishutva

All Tier 0 (absolute) day-level vetoes. Wraps existing functions
from classical-checks.ts. Activity-tiered: marriage/griha_pravesh
get full checks, mundan gets Dakshinayana, namakarana exempt."
```

---

## Task 6: Kaala/Timing Rules (7 Rules)

**Files:**
- Create: `src/lib/muhurta/engine/rules/kaala.ts`

Extract hora, choghadiya, Rahu Kaal, Yamaganda, Gulika, Dur Muhurtam, and Abhijit from `ai-recommender.ts` → `scoreTimingFactors()` and `inauspicious-periods.ts`.

Each rule reads sunrise/sunset/weekday from `RuleContext` and checks whether the window overlaps the relevant period.

- [ ] **Step 1: Create the kaala rules file**

The rule implementations should reuse helper functions from `inauspicious-periods.ts` (`computeRahuKaal`, `computeYamaganda`, `computeGulikaKaal`, `computeDurMuhurtam`, `isVarjyamActive`) and hora constants from `smart-search.ts` (`CHALDEAN_ORDER`, `HORA_DAY_START`).

For each rule:
- **hora** — +8 bonus when hora lord matches activity's `goodHoras`. Scope: window, Tier: 3.
- **choghadiya** — +6 for amrit/shubh/labh slots. Scope: window, Tier: 3.
- **rahu-kaal** — -4 penalty when window overlaps. Scope: window, Tier: 4 (cancellable).
- **yamaganda** — -3 penalty. Scope: window, Tier: 4.
- **gulika-kaal** — -2 penalty. Scope: window, Tier: 4.
- **dur-muhurtam** — -3 penalty. Scope: window, Tier: 4 (cancellable by strong lagna or special yoga).
- **abhijit-muhurta** — +6 bonus for 8th daytime muhurta, not Wednesdays. Scope: window, Tier: 2 (major bonus).

Implement with full code — import and call existing helper functions, don't rewrite the underlying calculations.

- [ ] **Step 2: Run type check and tests**

```bash
npx tsc --noEmit -p tsconfig.build-check.json && npx vitest run
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/muhurta/engine/rules/kaala.ts
git commit -m "feat(muhurta-engine): 7 kaala rules — hora, choghadiya, rahu kaal, yamaganda, gulika, dur muhurtam, abhijit

Timing factors at window level. Rahu Kaal/Yamaganda/Gulika/
Dur Muhurtam are Tier 4 (cancellable by Tier 2 factors like
strong lagna or Amrita Siddhi Yoga). Abhijit is Tier 2 bonus."
```

---

## Task 7: Lagna Rules (3 Rules) + Varjyam

**Files:**
- Create: `src/lib/muhurta/engine/rules/lagna.ts`
- Create: `src/lib/muhurta/engine/rules/varjyam.ts`

- [ ] **Step 1: Create lagna rules**

Three rules:
- **lagna-quality** — from `scoreLagna()` in `classical-checks.ts`. Score 0-8, Tier 2 when score >= 6 (can cancel Tier 4 defects per MC Ch.7: "a properly chosen lagna removes all defects"). When score < 6, Tier 3.
- **navamsha-shuddhi** — from `scoreNavamshaShuddhi()`. Score 0-4, Tier 3.
- **krishna-paksha-adjustment** — from `krishnaPakshaAdjustment()`. Conditional penalty 0 to -6 depending on nakshatra and lagna quality. Tier 3.

The lagna-quality rule is special: its `cancels` field lists `['karana-quality', 'yoga-quality', 'vara-quality', 'dur-muhurtam', 'gulika-kaal']` when score >= 6, implementing MC's cancellation principle.

- [ ] **Step 2: Create varjyam rule**

One rule:
- **varjyam** — from `isVarjyamActive()` in `inauspicious-periods.ts`. Penalty -3, Tier 4 (cancellable). Reads `ctx.snap.moonSid`.

- [ ] **Step 3: Type check and commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add src/lib/muhurta/engine/rules/lagna.ts src/lib/muhurta/engine/rules/varjyam.ts
git commit -m "feat(muhurta-engine): lagna rules + varjyam

lagna-quality: Tier 2 when score >= 6 (cancels Tier 4 defects
per MC Ch.7). navamsha-shuddhi: half weight of lagna (MC emphasis
for Vivah). krishna-paksha-adjustment: conditional -1 to -6.
varjyam: -3, Tier 4, cancellable by strong lagna."
```

---

## Task 8: Special Yoga + Graha + Personal Rules

**Files:**
- Create: `src/lib/muhurta/engine/rules/special-yogas.ts`
- Create: `src/lib/muhurta/engine/rules/graha.ts`
- Create: `src/lib/muhurta/engine/rules/personal.ts`

- [ ] **Step 1: Special yoga rules (3 rules)**

- **amrita-siddhi-yoga** — weekday+nakshatra lookup table from `smart-search.ts:110-118`. +5, Tier 2, `cancels: ['dur-muhurtam', 'gulika-kaal']`.
- **sarvartha-siddhi-yoga** — weekday+nakshatra lookup from `smart-search.ts:121-129`. +5, Tier 2.
- **godhuli-lagna** — NEW. Window overlaps sunset ± 24 min. +15 (override cap), Tier 1, `cancels: ['ALL_TIER_3', 'ALL_TIER_4']`. Marriage/engagement only. Source: Brihat Samhita Ch.103.

- [ ] **Step 2: Graha rules (2 rules)**

- **transit-strength** — benefic/malefic positions from `scoreTransitFactors()`. Score 0-15, Tier 3.
- **pushkar-navamsha-bhaga** — Moon in Pushkar Navamsha (+8) or Pushkar Bhaga (+10). Tier 2, `cancels: ['panchaka']`.

- [ ] **Step 3: Personal rules (3 rules)**

- **tara-bala** — from V2 scanner's `getTaraBala()`. Score 0 or +8, Tier 3.
- **chandra-bala** — from V2 scanner's `getChandraBala()`. Score 0 or +8, Tier 3.
- **dasha-harmony** — from `scoreDashaHarmony()`. Score 0-8, Tier 3.

- [ ] **Step 4: Type check and commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add src/lib/muhurta/engine/rules/special-yogas.ts src/lib/muhurta/engine/rules/graha.ts src/lib/muhurta/engine/rules/personal.ts
git commit -m "feat(muhurta-engine): special yoga + graha + personal rules

Amrita/Sarvartha Siddhi Yogas (Tier 2, cancel minor defects).
Godhuli Lagna (Tier 1, overrides all for marriage — BS Ch.103).
Transit strength + Pushkar Navamsha/Bhaga.
Tara Bala + Chandra Bala + Dasha Harmony."
```

---

## Task 9: Evaluator (Cancellation Engine)

**Files:**
- Create: `src/lib/muhurta/engine/evaluator.ts`
- Test: add to `src/lib/__tests__/muhurta-engine-core.test.ts`

This is the core of the engine — runs all rules, resolves cancellations, normalises scores.

- [ ] **Step 1: Create the evaluator**

```typescript
/**
 * Muhurta Engine — Evaluator
 *
 * Runs rules from the registry against a RuleContext.
 * Resolves cancellations using the 5-tier authority system.
 * Normalises raw scores to 0-100 with grade assignment.
 *
 * Cancellation algorithm:
 * 1. Run all rules, collect assessments
 * 2. Identify cancellers (assessments with 'cancels' list and positive points)
 * 3. For each canceller, find negative assessments that are in its cancels list
 *    AND whose tier is >= the canceller's tier + 2 (Tier 2 cancels Tier 4)
 * 4. Mark cancelled assessments: effectivePoints = 0
 * 5. Compute final score from effectivePoints
 */

import type {
  RuleContext, RuleAssessment, ResolvedAssessment, Cancellation,
  EvaluationResult, MuhurtaGrade, WindowBreakdown,
} from './types';
import { getRulesFor } from './registry';

const CATEGORY_MAX: Record<string, number> = {
  panchanga: 25,
  graha: 15,
  kaala: 20,
  lagna: 12,
  'yoga-special': 10,
  personal: 20,
  period: 0,  // vetoes only, no score contribution
};

function computeGrade(score: number): MuhurtaGrade {
  if (score >= 75) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 45) return 'fair';
  if (score >= 30) return 'marginal';
  return 'poor';
}

export function evaluateWindow(ctx: RuleContext): EvaluationResult {
  // 1. Run day-level rules first (vetoes)
  const dayRules = getRulesFor(ctx.activity, 'day');
  const dayAssessments: RuleAssessment[] = [];
  const vetoes: RuleAssessment[] = [];

  for (const rule of dayRules) {
    const result = rule.evaluate(ctx);
    if (!result) continue;
    dayAssessments.push(result);
    if (result.vetoed) vetoes.push(result);
  }

  // If any day-level veto is active, return early with score 0
  if (vetoes.length > 0) {
    return {
      score: 0, rawScore: 0, grade: 'poor',
      breakdown: { panchanga: 0, graha: 0, kaala: 0, lagna: 0, special: 0, personal: 0 },
      assessments: dayAssessments.map(a => ({ ...a, cancelled: false, effectivePoints: a.points })),
      vetoes,
      cancellations: [],
      activeSpecialYogas: [],
    };
  }

  // 2. Run window-level rules
  const windowRules = getRulesFor(ctx.activity, 'window');
  const allAssessments: RuleAssessment[] = [...dayAssessments];

  for (const rule of windowRules) {
    const result = rule.evaluate(ctx);
    if (!result) continue;
    allAssessments.push(result);
    if (result.vetoed) vetoes.push(result);
  }

  // If any window-level veto (e.g., forbidden nakshatra), return early
  if (vetoes.length > 0) {
    return {
      score: 0, rawScore: 0, grade: 'poor',
      breakdown: { panchanga: 0, graha: 0, kaala: 0, lagna: 0, special: 0, personal: 0 },
      assessments: allAssessments.map(a => ({ ...a, cancelled: false, effectivePoints: a.points })),
      vetoes,
      cancellations: [],
      activeSpecialYogas: [],
    };
  }

  // 3. Resolve cancellations
  const resolved: ResolvedAssessment[] = allAssessments.map(a => ({
    ...a, cancelled: false, effectivePoints: a.points,
  }));
  const cancellations: Cancellation[] = [];

  // Find cancellers: positive assessments with a cancels list
  const cancellers = resolved.filter(a => a.points > 0 && a.cancels && a.cancels.length > 0);

  for (const canceller of cancellers) {
    for (const targetId of canceller.cancels!) {
      // Find negative assessments matching the target rule ID
      for (const target of resolved) {
        if (target.ruleId !== targetId) continue;
        if (target.cancelled) continue; // Already cancelled by a higher authority
        if (target.points >= 0) continue; // Only cancel negative assessments
        if (target.tier === 0) continue; // Never cancel Tier 0

        // Tier check: canceller must be at least 2 tiers above target
        // OR be Tier 1 (Godhuli — cancels everything except Tier 0)
        if (canceller.tier === 1 || canceller.tier <= target.tier - 2) {
          target.cancelled = true;
          target.cancelledByRuleId = canceller.ruleId;
          target.effectivePoints = 0;
          cancellations.push({
            cancellerRuleId: canceller.ruleId,
            cancellerReason: canceller.reason,
            cancelledRuleId: target.ruleId,
            cancelledReason: target.reason,
            source: canceller.source,
          });
        }
      }
    }
  }

  // 4. Compute category scores
  const categoryTotals: Record<string, number> = {};
  for (const a of resolved) {
    const cat = a.category;
    categoryTotals[cat] = (categoryTotals[cat] ?? 0) + a.effectivePoints;
  }

  // Clamp each category to its max
  const breakdown: WindowBreakdown = {
    panchanga: Math.max(0, Math.min(CATEGORY_MAX.panchanga, categoryTotals.panchanga ?? 0)),
    graha: Math.max(0, Math.min(CATEGORY_MAX.graha, categoryTotals.graha ?? 0)),
    kaala: Math.max(0, Math.min(CATEGORY_MAX.kaala, categoryTotals.kaala ?? 0)),
    lagna: Math.max(0, Math.min(CATEGORY_MAX.lagna, categoryTotals.lagna ?? 0)),
    special: Math.max(0, Math.min(CATEGORY_MAX['yoga-special'], categoryTotals['yoga-special'] ?? 0)),
    personal: Math.max(0, Math.min(CATEGORY_MAX.personal, categoryTotals.personal ?? 0)),
  };

  const maxPossible = Object.values(CATEGORY_MAX).reduce((s, v) => s + v, 0); // 102
  const rawScore = Object.values(breakdown).reduce((s, v) => s + v, 0);
  const score = Math.round(Math.max(0, Math.min(100, (rawScore / maxPossible) * 100)));

  // Collect special yogas
  const activeSpecialYogas = resolved
    .filter(a => a.category === 'yoga-special' && a.points > 0 && !a.cancelled)
    .map(a => a.ruleId);

  return {
    score, rawScore, grade: computeGrade(score),
    breakdown, assessments: resolved, vetoes, cancellations, activeSpecialYogas,
  };
}
```

- [ ] **Step 2: Write evaluator tests**

Add to `src/lib/__tests__/muhurta-engine-core.test.ts`:

```typescript
import { evaluateWindow } from '@/lib/muhurta/engine/evaluator';
import { registerRules, clearRules } from '@/lib/muhurta/engine/registry';
import { PANCHANGA_RULES } from '@/lib/muhurta/engine/rules/panchanga';

describe('Evaluator', () => {
  beforeEach(() => {
    clearRules();
    registerRules(PANCHANGA_RULES);
  });

  it('returns score 0 with vetoes when forbidden nakshatra for marriage', () => {
    const ctx = makeCtx({ snap: { ...makeCtx({}).snap, nakshatra: 6 } }); // Ardra
    const result = evaluateWindow(ctx);
    expect(result.score).toBe(0);
    expect(result.vetoes.length).toBeGreaterThan(0);
    expect(result.vetoes[0].ruleId).toBe('nakshatra-quality');
  });

  it('scores positively for Rohini + Shukla Saptami marriage window', () => {
    const ctx = makeCtx({
      snap: { ...makeCtx({}).snap, tithi: 7, nakshatra: 4, yoga: 2, karana: 2, weekday: 1 },
    });
    const result = evaluateWindow(ctx);
    expect(result.score).toBeGreaterThan(0);
    expect(result.grade).not.toBe('poor');
  });

  it('cancellation: strong lagna cancels Vishti karana', () => {
    // Register a mock lagna rule that returns strong score with cancels
    const mockLagnaRule: MuhurtaRule = {
      id: 'lagna-quality', name: { en: 'Lagna', hi: 'लग्न' },
      category: 'lagna', scope: 'window', effect: 'bonus', tier: 2, appliesTo: 'all',
      evaluate: () => ({
        ruleId: 'lagna-quality', ruleName: { en: 'Lagna', hi: 'लग्न' },
        category: 'lagna', tier: 2, points: 8, maxPoints: 8,
        severity: 'positive' as const,
        reason: { en: 'Strong Taurus lagna', hi: 'शक्तिशाली वृषभ लग्न' },
        source: 'MC Ch.7',
        cancels: ['karana-quality', 'yoga-quality', 'vara-quality'],
      }),
    };
    registerRule(mockLagnaRule);

    const ctx = makeCtx({
      snap: { ...makeCtx({}).snap, karana: 7, tithi: 7, nakshatra: 4, yoga: 9 }, // Vishti + inauspicious yoga
    });
    const result = evaluateWindow(ctx);

    // Vishti karana (-5) and inauspicious yoga (-3) should be cancelled
    const karanaAssessment = result.assessments.find(a => a.ruleId === 'karana-quality');
    expect(karanaAssessment?.cancelled).toBe(true);
    expect(karanaAssessment?.effectivePoints).toBe(0);

    const yogaAssessment = result.assessments.find(a => a.ruleId === 'yoga-quality');
    expect(yogaAssessment?.cancelled).toBe(true);

    expect(result.cancellations.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/lib/__tests__/muhurta-engine-core.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/muhurta/engine/evaluator.ts src/lib/__tests__/muhurta-engine-core.test.ts
git commit -m "feat(muhurta-engine): evaluator with 5-tier cancellation resolution

Runs all rules, resolves cancellations (MC Ch.7: strong lagna
cancels defects), normalises to 0-100. Tier 0 vetoes are absolute.
Tier 2 can cancel Tier 4 (strong lagna cancels weak karana).
Tier 1 (Godhuli) cancels everything except Tier 0."
```

---

## Task 10: Reasoning Engine

**Files:**
- Create: `src/lib/muhurta/engine/reasoning.ts`

- [ ] **Step 1: Create the reasoning engine**

The reasoning engine takes an `EvaluationResult` and produces a `MuhurtaVerdict` — a pandit-style assessment with strengths, concerns (with strikethrough for cancelled ones), mitigations, and a recommendation.

```typescript
/**
 * Muhurta Engine — Reasoning Engine
 *
 * Converts an EvaluationResult into a human-readable MuhurtaVerdict.
 * This is what makes the engine a "Digital Pandit" rather than a calculator.
 */

import type { EvaluationResult, MuhurtaVerdict, VerdictPoint, MuhurtaGrade } from './types';
import type { LocaleText } from '@/types/panchang';

const GRADE_HEADLINES: Record<MuhurtaGrade, LocaleText> = {
  excellent: { en: 'Excellent window', hi: 'उत्कृष्ट समय' },
  good:      { en: 'Good window', hi: 'अच्छा समय' },
  fair:      { en: 'Fair window', hi: 'ठीक समय' },
  marginal:  { en: 'Marginal window', hi: 'सीमांत समय' },
  poor:      { en: 'Poor window', hi: 'अनुचित समय' },
};

const RECOMMENDATIONS: Record<MuhurtaGrade, LocaleText> = {
  excellent: { en: 'Proceed with confidence. This is among the best windows available.', hi: 'पूर्ण विश्वास से आगे बढ़ें। यह उपलब्ध सर्वोत्तम समय में से एक है।' },
  good:      { en: 'A solid choice. Minor concerns are outweighed by strong positives.', hi: 'एक अच्छा विकल्प। मामूली चिंताएँ सकारात्मक कारकों से कम हैं।' },
  fair:      { en: 'Acceptable if dates are limited. Consider alternatives if flexible.', hi: 'यदि तिथियाँ सीमित हैं तो स्वीकार्य। लचीलापन हो तो विकल्प देखें।' },
  marginal:  { en: 'Multiple classical concerns. Look for better windows if possible.', hi: 'अनेक शास्त्रीय चिंताएँ। यदि सम्भव हो तो बेहतर समय खोजें।' },
  poor:      { en: 'Not recommended. Significant inauspicious factors present.', hi: 'अनुशंसित नहीं। महत्वपूर्ण अशुभ कारक मौजूद हैं।' },
};

export function generateVerdict(result: EvaluationResult, activity: string): MuhurtaVerdict {
  const strengths: VerdictPoint[] = [];
  const concerns: VerdictPoint[] = [];
  const mitigations: VerdictPoint[] = [];

  for (const a of result.assessments) {
    if (a.points > 0 && !a.cancelled) {
      strengths.push({
        factor: a.ruleName,
        assessment: a.reason,
        source: a.source,
        severity: a.severity,
      });
    } else if (a.points < 0 && !a.cancelled) {
      concerns.push({
        factor: a.ruleName,
        assessment: a.reason,
        source: a.source,
        severity: a.severity,
      });
    } else if (a.points < 0 && a.cancelled) {
      // Cancelled negative — show as mitigation
      mitigations.push({
        factor: a.ruleName,
        assessment: a.reason,
        source: a.source,
        severity: a.severity,
        cancelled: true,
        cancelledBy: a.cancelledByRuleId,
      });
    }
  }

  // Sort by severity: critical > major > moderate > minor > positive
  const severityOrder = { critical: 0, major: 1, moderate: 2, minor: 3, positive: 4 };
  strengths.sort((a, b) => (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4));
  concerns.sort((a, b) => (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4));

  // Build summary
  const topStrength = strengths[0]?.assessment?.en ?? '';
  const topConcern = concerns[0]?.assessment?.en ?? '';
  const cancelCount = mitigations.length;

  let summaryEn = '';
  if (result.grade === 'excellent' || result.grade === 'good') {
    summaryEn = topStrength;
    if (cancelCount > 0) summaryEn += ` ${cancelCount} minor concern${cancelCount > 1 ? 's' : ''} mitigated by strong factors.`;
  } else if (result.grade === 'fair') {
    summaryEn = `Mixed signals. ${topStrength} ${topConcern ? `However, ${topConcern.toLowerCase()}.` : ''}`;
  } else {
    summaryEn = topConcern || 'Multiple inauspicious factors present.';
  }

  const headline: LocaleText = {
    en: `${GRADE_HEADLINES[result.grade].en} for ${activity}`,
    hi: `${activity} के लिए ${GRADE_HEADLINES[result.grade].hi}`,
  };

  return {
    headline,
    grade: result.grade,
    summary: { en: summaryEn, hi: summaryEn }, // Hindi summary can be enhanced later
    strengths,
    concerns,
    mitigations,
    recommendation: RECOMMENDATIONS[result.grade],
  };
}
```

- [ ] **Step 2: Type check and commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add src/lib/muhurta/engine/reasoning.ts
git commit -m "feat(muhurta-engine): reasoning engine — pandit-style verdicts

Converts EvaluationResult into MuhurtaVerdict with:
- Strengths: positive factors with citations
- Concerns: active negative factors
- Mitigations: cancelled negatives (shown as strikethrough)
- Recommendation: grade-based guidance"
```

---

## Task 11: Rule Registration + Full Pipeline Test

**Files:**
- Create: `src/lib/muhurta/engine/index.ts` (registers all rules, exports engine API)
- Modify: `src/lib/__tests__/muhurta-engine-core.test.ts` (full pipeline test)

- [ ] **Step 1: Create the engine index that registers all rules**

```typescript
/**
 * Muhurta Engine — Entry Point
 *
 * Registers all rules and exports the evaluation + reasoning API.
 * Import this file to get a fully initialised engine.
 */

import { registerRules } from './registry';
import { PANCHANGA_RULES } from './rules/panchanga';
import { PERIOD_RULES } from './rules/periods';
import { KAALA_RULES } from './rules/kaala';
import { LAGNA_RULES } from './rules/lagna';
import { VARJYAM_RULES } from './rules/varjyam';
import { SPECIAL_YOGA_RULES } from './rules/special-yogas';
import { GRAHA_RULES } from './rules/graha';
import { PERSONAL_RULES } from './rules/personal';

// Register all rules on first import
registerRules([
  ...PANCHANGA_RULES,
  ...PERIOD_RULES,
  ...KAALA_RULES,
  ...LAGNA_RULES,
  ...VARJYAM_RULES,
  ...SPECIAL_YOGA_RULES,
  ...GRAHA_RULES,
  ...PERSONAL_RULES,
]);

// Re-export the public API
export { evaluateWindow } from './evaluator';
export { generateVerdict } from './reasoning';
export { buildDayContext, buildWindowContext } from './context-builder';
export { getRuleCount, getAllRules } from './registry';
export type {
  RuleContext, RuleAssessment, ResolvedAssessment,
  EvaluationResult, MuhurtaVerdict, MuhurtaGrade, WindowBreakdown,
} from './types';
```

- [ ] **Step 2: Write full pipeline integration test**

Add to `src/lib/__tests__/muhurta-engine-core.test.ts`:

```typescript
describe('Full Pipeline Integration', () => {
  it('evaluates a real date through the complete engine', () => {
    // Use the engine entry point which auto-registers all rules
    const { evaluateWindow, generateVerdict, buildDayContext, buildWindowContext, getRuleCount } = require('@/lib/muhurta/engine');

    expect(getRuleCount()).toBeGreaterThanOrEqual(25); // At least 25 rules registered

    // 2026-05-05, Corseaux, marriage, midday window
    const day = buildDayContext(2026, 5, 5, 46.46, 6.80, 2);
    const ctx = buildWindowContext(day, 10, 11.5, 'marriage', 46.46, 6.80, 2);
    const result = evaluateWindow(ctx);

    // Score should be a valid 0-100 number
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(['excellent', 'good', 'fair', 'marginal', 'poor']).toContain(result.grade);

    // Should have assessments from multiple categories
    const categories = new Set(result.assessments.map(a => a.category));
    expect(categories.has('panchanga')).toBe(true);
    expect(categories.has('kaala')).toBe(true);

    // Generate verdict
    const verdict = generateVerdict(result, 'marriage');
    expect(verdict.headline.en).toContain('marriage');
    expect(verdict.recommendation.en.length).toBeGreaterThan(0);

    // Log for manual inspection
    console.log(`Score: ${result.score}/100 (${result.grade})`);
    console.log(`Strengths: ${verdict.strengths.length}, Concerns: ${verdict.concerns.length}, Mitigations: ${verdict.mitigations.length}`);
    console.log(`Cancellations: ${result.cancellations.length}`);
    if (result.cancellations.length > 0) {
      for (const c of result.cancellations) {
        console.log(`  ${c.cancellerRuleId} cancelled ${c.cancelledRuleId}`);
      }
    }
  });

  it('cross-check: combustion veto blocks marriage on known combust date', () => {
    // Venus combust ~Jan 2026 (within 10° of Sun)
    const { evaluateWindow, buildDayContext, buildWindowContext } = require('@/lib/muhurta/engine');
    const day = buildDayContext(2026, 1, 20, 46.46, 6.80, 1);
    const ctx = buildWindowContext(day, 10, 11.5, 'marriage', 46.46, 6.80, 1);
    const result = evaluateWindow(ctx);

    // Should be vetoed
    expect(result.score).toBe(0);
    expect(result.vetoes.length).toBeGreaterThan(0);
    console.log('Combustion veto:', result.vetoes.map(v => v.reason.en).join(', '));
  });
});
```

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run && npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 4: Cross-check engine output against Prokerala**

```bash
npx tsx -e "
const { evaluateWindow, generateVerdict, buildDayContext, buildWindowContext, getRuleCount } = require('./src/lib/muhurta/engine');
console.log('Rules registered:', getRuleCount());

// Score 3 windows for 2026-05-10 marriage in Corseaux
const day = buildDayContext(2026, 5, 10, 46.46, 6.80, 2);
for (let h = 8; h <= 16; h += 4) {
  const ctx = buildWindowContext(day, h - 2, h - 2 + 1.5, 'marriage', 46.46, 6.80, 2);
  const result = evaluateWindow(ctx);
  const verdict = generateVerdict(result, 'marriage');
  console.log('---');
  console.log(h + ':00 window:', result.score + '/100', result.grade);
  console.log('Strengths:', verdict.strengths.map(s => s.assessment.en).join('; '));
  console.log('Concerns:', verdict.concerns.map(c => c.assessment.en).join('; '));
  if (verdict.mitigations.length > 0) {
    console.log('Mitigations:', verdict.mitigations.map(m => m.assessment.en + ' [cancelled]').join('; '));
  }
}
"
```

Compare the nakshatra and tithi shown with Prokerala for 2026-05-10, Corseaux. If our engine says "Rohini" but Prokerala says "Mrigashira", investigate — check whether the time difference explains it (nakshatra may transition during the day). If there's a genuine discrepancy, check the classical text and document which is correct.

- [ ] **Step 5: Commit**

```bash
git add src/lib/muhurta/engine/index.ts src/lib/__tests__/muhurta-engine-core.test.ts
git commit -m "feat(muhurta-engine): engine entry point + full pipeline integration tests

Registers all rules on import. Entry point exports evaluateWindow,
generateVerdict, buildDayContext, buildWindowContext.
Integration tests: real date evaluation, combustion veto check,
cross-reference output against Prokerala."
```

---

## Verification Checklist (Run After All Tasks)

- [ ] `npx vitest run` — all tests pass
- [ ] `npx tsc --noEmit -p tsconfig.build-check.json` — zero errors
- [ ] `npx next build` — zero errors (engine is not yet wired to UI, but must not break the build)
- [ ] Cross-check 3 dates against Prokerala for Corseaux:
  - One date during Venus combustion (Jan 2026) — should veto
  - One date during Adhika Masa (May 2026) — should veto for marriage
  - One normal date — score should be reasonable (40-80 range)
- [ ] Verify cancellation logic: create a window with Vishti karana + strong Taurus lagna → Vishti should be cancelled
- [ ] Verify rule count: at least 29 rules registered
- [ ] Review verdict output: does it read like a pandit's advice, not a database dump?
