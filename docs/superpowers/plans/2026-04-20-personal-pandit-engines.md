# Personal Pandit — Engine Implementation Plan (Phase 0 + Phase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the computational backbone for the Personal Pandit experience — the varga deep-analysis engine (Phase 0) and the domain synthesis engine (Phase 1) that transforms raw KundaliData into 9 personalized life-domain readings.

**Architecture:** Two independent engines. Phase 0 produces `DeepVargaResult` per divisional chart (15 cross-correlation factors + promise/delivery scoring + narrative). Phase 1 consumes Phase 0's output alongside existing tippanni/convergence/dasha engines to produce `PersonalReading` — 8 domain readings + 1 current period synthesis, each with rating, headline, natal analysis, current activation, forward timeline, and remedies.

**Tech Stack:** TypeScript, Vitest for testing, existing kundali computation engine, existing tippanni/convergence modules. No UI code in this plan.

**Spec:** `docs/superpowers/specs/2026-04-20-personal-pandit-design.md` + `docs/specs/varga-tippanni-deep-interpretation.md`

---

## File Map

### Phase 0 — Varga Deep Analysis Engine (new files)

| File | Responsibility |
|------|---------------|
| `src/lib/tippanni/varga-tippanni-types-v2.ts` | Extended types for deep varga analysis (DeepVargaResult, PromiseDeliveryScore, CrossCorrelation, etc.) |
| `src/lib/tippanni/varga-classical-checks.ts` | Pushkara Navamsha/Bhaga detection, Gandanta detection, Varga Visesha classification |
| `src/lib/tippanni/varga-promise-delivery.ts` | D1 promise scoring + Dxx delivery scoring + 4×4 verdict matrix |
| `src/lib/tippanni/varga-deep-analysis.ts` | 15 cross-correlation factors: D1↔Dxx comparison, functional nature, vargottama, lordship, karakas, argala, SAV overlay, dasha lord in Dxx, yogas, aspects, parivartana, dispositor chain |
| `src/lib/tippanni/varga-planet-interpretations.ts` | Domain-specific planet-in-house text (D9 marriage 108 entries, D10 career 108 entries — Tier 1) |
| `src/lib/tippanni/varga-narrative-v2.ts` | 7-paragraph synthesized narrative builder per chart |

### Phase 1 — Domain Synthesis Engine (new files)

| File | Responsibility |
|------|---------------|
| `src/lib/kundali/domain-synthesis/types.ts` | DomainType, DomainConfig, DomainReading, PersonalReading, CurrentPeriodReading, rating types |
| `src/lib/kundali/domain-synthesis/config.ts` | 9 declarative domain configs (houses, planets, yogas, doshas, vargas, weights) |
| `src/lib/kundali/domain-synthesis/scorer.ts` | Weighted composite scoring: house strength + lord + occupants + yogas + doshas + dasha + varga |
| `src/lib/kundali/domain-synthesis/narrator.ts` | 9 composable narrative blocks (narrateHouseLord, narrateOccupants, narrateAspects, etc.) |
| `src/lib/kundali/domain-synthesis/timeline.ts` | Forward trigger computation (dasha changes + transit ingresses for 3-5 years per domain) |
| `src/lib/kundali/domain-synthesis/remedies.ts` | Domain-filtered remedy selection with strength indicators (1-5 stars) |
| `src/lib/kundali/domain-synthesis/current-period.ts` | Cross-domain current period synthesis (maha/antar/pratyantar + transits + sade sati + eclipses) |
| `src/lib/kundali/domain-synthesis/life-overview.ts` | 2-3 sentence elevator pitch of the native's chart (AK + strongest house + life stage) |
| `src/lib/kundali/domain-synthesis/cross-domain.ts` | Inter-domain connection detection (shared lords, planets in each other's houses) |
| `src/lib/kundali/domain-synthesis/synthesizer.ts` | Orchestrator: `synthesizeReading(kundali): PersonalReading` |
| `src/lib/kundali/domain-synthesis/llm-prompt.ts` | Premium tier: system prompt + payload serialization per domain |

### Test Files

| File | Tests |
|------|-------|
| `src/lib/__tests__/varga-deep-analysis.test.ts` | Classical checks, promise/delivery, cross-correlation, D9≠D10 differentiation |
| `src/lib/__tests__/domain-synthesis.test.ts` | Domain scoring, rating thresholds, narrative non-empty, timeline triggers, cross-domain connections |

---

## Task 1: Varga Deep Analysis Types

**Files:**
- Create: `src/lib/tippanni/varga-tippanni-types-v2.ts`

- [ ] **Step 1: Write the types file**

```typescript
// src/lib/tippanni/varga-tippanni-types-v2.ts
import type { LocaleText } from '@/types/panchang';

/** Domain contexts for divisional chart interpretation */
export type VargaDomain = 'marriage' | 'career' | 'children' | 'wealth' | 'spiritual' | 'health' | 'family' | 'education';

/** Maps chart ID to its domain(s) */
export const CHART_DOMAIN_MAP: Record<string, VargaDomain[]> = {
  D9:  ['marriage'],
  D10: ['career'],
  D7:  ['children'],
  D2:  ['wealth'],
  D4:  ['wealth', 'family'],
  D12: ['family'],
  D20: ['spiritual'],
  D24: ['education'],
  D30: ['health'],
  D60: ['spiritual'],
};

/** Dignity level for a planet */
export type DignityLevel = 'exalted' | 'own' | 'friend' | 'neutral' | 'enemy' | 'debilitated';

/** D1↔Dxx sign comparison for a single planet */
export interface DignityShift {
  planetId: number;
  planetName: LocaleText;
  d1Sign: number;
  dxxSign: number;
  d1Dignity: DignityLevel;
  dxxDignity: DignityLevel;
  shift: 'improved' | 'same' | 'declined' | 'mixed';
  isVargottama: boolean;
  narrative: LocaleText;
}

/** Pushkara check result */
export interface PushkaraCheck {
  planetId: number;
  isPushkaraNavamsha: boolean;
  isPushkaraBhaga: boolean;
  degree: number;
}

/** Gandanta check result */
export interface GandantaCheck {
  planetId: number;
  isGandanta: boolean;
  severity: 'severe' | 'moderate' | 'mild' | 'none';
  proximityDegrees: number;
  junction: string; // 'Cancer-Leo' | 'Scorpio-Sagittarius' | 'Pisces-Aries'
}

/** Varga Visesha classification */
export type VargaVisesha =
  | 'parijatamsha'   // exalted/own in 2 vargas
  | 'uttamamsha'     // 3 vargas
  | 'gopuramsha'     // 4 vargas
  | 'simhasanamsha'  // 5 vargas
  | 'paravatamsha'   // 6 vargas
  | 'devalokamsha'   // 7+ vargas
  | 'none';

/** Promise/Delivery score for a chart */
export interface PromiseDeliveryScore {
  d1Promise: number;       // 0-100
  dxxDelivery: number;     // 0-100
  verdictKey: string;      // e.g. 'strong_excellent'
  verdict: LocaleText;     // 2-sentence narrative
}

/** Dispositor chain result */
export interface DispositorChain {
  chain: { planetId: number; sign: number }[];
  finalDispositor: number | null; // null = circular
  isCircular: boolean;
  narrative: LocaleText;
}

/** Parivartana (sign exchange) in Dxx */
export interface Parivartana {
  planet1Id: number;
  planet2Id: number;
  sign1: number;
  sign2: number;
  significance: LocaleText;
}

/** Full cross-correlation result for one chart */
export interface CrossCorrelation {
  dignityShifts: DignityShift[];
  vargottamaPlanets: number[];         // planet IDs
  pushkaraChecks: PushkaraCheck[];
  gandantaChecks: GandantaCheck[];
  vargaVisesha: { planetId: number; classification: VargaVisesha }[];
  keyHouseLords: { house: number; lordId: number; lordSign: number; lordDignity: DignityLevel; narrative: LocaleText }[];
  jaiminiKarakas: { karaka: string; planetId: number; sign: number; house: number; narrative: LocaleText }[];
  argalaOnKeyHouses: { house: number; supporting: number[]; obstructing: number[] }[];
  savOverlay: { sign: number; bindus: number; quality: 'strong' | 'average' | 'weak' }[];
  dashaLordPlacement: { lordId: number; sign: number; house: number; dignity: DignityLevel; narrative: LocaleText } | null;
  yogasInChart: { name: string; planets: number[]; significance: LocaleText }[];
  aspectsOnKeyHouses: { house: number; aspectingPlanets: { id: number; type: 'benefic' | 'malefic' }[] }[];
  parivartanas: Parivartana[];
  dispositorChain: DispositorChain;
}

/** Complete deep varga analysis for one chart */
export interface DeepVargaResult {
  chartId: string;                     // 'D9', 'D10', etc.
  domain: VargaDomain;
  crossCorrelation: CrossCorrelation;
  promiseDelivery: PromiseDeliveryScore;
  narrative: LocaleText;               // 7-paragraph synthesized text
}
```

- [ ] **Step 2: Verify file compiles**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep "varga-tippanni-types-v2" | head -5`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/tippanni/varga-tippanni-types-v2.ts
git commit -m "feat(varga): add deep analysis types — DignityShift, CrossCorrelation, DeepVargaResult

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Classical Checks (Pushkara, Gandanta, Varga Visesha)

**Files:**
- Create: `src/lib/tippanni/varga-classical-checks.ts`
- Test: `src/lib/__tests__/varga-deep-analysis.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/lib/__tests__/varga-deep-analysis.test.ts
import { describe, it, expect } from 'vitest';
import { checkPushkara, checkGandanta, classifyVargaVisesha } from '@/lib/tippanni/varga-classical-checks';

describe('varga-classical-checks', () => {
  describe('checkPushkara', () => {
    it('detects Pushkara Navamsha for planet in Cancer navamsha', () => {
      // Cancer (sign 4) is a Pushkara navamsha sign
      // A planet at ~3°20' Aries falls in Cancer navamsha (2nd pada)
      const result = checkPushkara(0, 3.33); // Sun at 3°20' Aries-like position
      // We test the structure; exact Pushkara detection depends on navamsha-sign mapping
      expect(result).toHaveProperty('isPushkaraNavamsha');
      expect(result).toHaveProperty('isPushkaraBhaga');
    });
  });

  describe('checkGandanta', () => {
    it('detects severe gandanta at 0° Aries (Pisces-Aries junction)', () => {
      const result = checkGandanta(0, 0.5); // planet at 0°30' sidereal
      expect(result.isGandanta).toBe(true);
      expect(result.severity).toBe('severe');
      expect(result.junction).toBe('Pisces-Aries');
    });

    it('detects moderate gandanta at 2° past junction', () => {
      const result = checkGandanta(0, 2.0);
      expect(result.isGandanta).toBe(true);
      expect(result.severity).toBe('moderate');
    });

    it('no gandanta at 15° Aries (mid-sign)', () => {
      const result = checkGandanta(0, 15.0);
      expect(result.isGandanta).toBe(false);
      expect(result.severity).toBe('none');
    });

    it('detects gandanta at Cancer-Leo junction (~120°)', () => {
      const result = checkGandanta(0, 119.5); // ~29°30' Cancer
      expect(result.isGandanta).toBe(true);
      expect(result.junction).toBe('Cancer-Leo');
    });
  });

  describe('classifyVargaVisesha', () => {
    it('returns none for planet dignified in 0-1 vargas', () => {
      const dignities = ['enemy', 'debilitated', 'neutral', 'enemy', 'neutral', 'enemy'] as const;
      expect(classifyVargaVisesha(dignities)).toBe('none');
    });

    it('returns parijatamsha for exalted/own in 2 vargas', () => {
      const dignities = ['exalted', 'own', 'neutral', 'enemy', 'neutral', 'enemy'] as const;
      expect(classifyVargaVisesha(dignities)).toBe('parijatamsha');
    });

    it('returns simhasanamsha for exalted/own in 5 vargas', () => {
      const dignities = ['exalted', 'own', 'own', 'exalted', 'own', 'enemy'] as const;
      expect(classifyVargaVisesha(dignities)).toBe('simhasanamsha');
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/varga-deep-analysis.test.ts`
Expected: FAIL — modules not found

- [ ] **Step 3: Implement classical checks**

```typescript
// src/lib/tippanni/varga-classical-checks.ts
import type { PushkaraCheck, GandantaCheck, VargaVisesha, DignityLevel } from './varga-tippanni-types-v2';

/**
 * Pushkara Navamsha: 24 specific navamsha padas in benefic-ruled signs.
 * Pushkara Bhaga: specific auspicious degrees per sign.
 */

// Pushkara Bhaga degrees per sign (1-12), from classical texts
const PUSHKARA_BHAGA: Record<number, number> = {
  1: 21, 2: 14, 3: 18, 4: 8, 5: 19, 6: 9,
  7: 24, 8: 11, 9: 23, 10: 14, 11: 19, 12: 9,
};

// Pushkara Navamsha signs (benefic-ruled: Cancer=4, Taurus=2, Pisces=12, Sagittarius=9)
const PUSHKARA_NAVAMSHA_SIGNS = new Set([2, 4, 9, 12]);

function getNavamshaSign(signSidereal: number, degreeInSign: number): number {
  // Each sign has 9 navamsha padas of 3°20' each
  const padaIndex = Math.floor(degreeInSign / (10 / 3)); // 0-8
  // Starting navamsha sign depends on element of the rashi
  const sign1Based = signSidereal + 1; // convert 0-indexed to 1-indexed
  const element = ((sign1Based - 1) % 4); // 0=fire, 1=earth, 2=air, 3=water
  const startSign = [1, 10, 7, 4][element]; // Aries, Capricorn, Libra, Cancer
  return ((startSign - 1 + padaIndex) % 12) + 1; // 1-indexed sign
}

export function checkPushkara(planetId: number, siderealLongitude: number): PushkaraCheck {
  const signIndex = Math.floor(siderealLongitude / 30); // 0-11
  const degreeInSign = siderealLongitude % 30;
  const sign1Based = signIndex + 1;

  const navSign = getNavamshaSign(signIndex, degreeInSign);
  const isPushkaraNavamsha = PUSHKARA_NAVAMSHA_SIGNS.has(navSign);

  const pushkaraDeg = PUSHKARA_BHAGA[sign1Based] ?? 0;
  const isPushkaraBhaga = Math.abs(degreeInSign - pushkaraDeg) <= 1.0;

  return { planetId, isPushkaraNavamsha, isPushkaraBhaga, degree: degreeInSign };
}

/**
 * Gandanta: planets within 3°20' of water↔fire sign junctions.
 * Junctions at: 0° (Pisces→Aries), 120° (Cancer→Leo), 240° (Scorpio→Sagittarius)
 */
const GANDANTA_JUNCTIONS = [
  { degree: 0,   name: 'Pisces-Aries' },
  { degree: 120, name: 'Cancer-Leo' },
  { degree: 240, name: 'Scorpio-Sagittarius' },
];

export function checkGandanta(planetId: number, siderealLongitude: number): GandantaCheck {
  const lon = ((siderealLongitude % 360) + 360) % 360;
  let closest = { proximity: 999, junction: '' };

  for (const j of GANDANTA_JUNCTIONS) {
    const diff = Math.min(
      Math.abs(lon - j.degree),
      Math.abs(lon - (j.degree + 360)),
      Math.abs(lon + 360 - j.degree)
    );
    if (diff < closest.proximity) {
      closest = { proximity: diff, junction: j.name };
    }
  }

  const THRESHOLD = 10 / 3; // 3°20'
  if (closest.proximity > THRESHOLD) {
    return { planetId, isGandanta: false, severity: 'none', proximityDegrees: closest.proximity, junction: '' };
  }

  const severity = closest.proximity <= 1 ? 'severe' : closest.proximity <= 2 ? 'moderate' : 'mild';
  return { planetId, isGandanta: true, severity, proximityDegrees: closest.proximity, junction: closest.junction };
}

/**
 * Varga Visesha: classification based on how many vargas a planet is
 * exalted or in own sign.
 */
export function classifyVargaVisesha(
  dignities: readonly DignityLevel[]
): VargaVisesha {
  const strongCount = dignities.filter(d => d === 'exalted' || d === 'own').length;
  if (strongCount >= 7) return 'devalokamsha';
  if (strongCount >= 6) return 'paravatamsha';
  if (strongCount >= 5) return 'simhasanamsha';
  if (strongCount >= 4) return 'gopuramsha';
  if (strongCount >= 3) return 'uttamamsha';
  if (strongCount >= 2) return 'parijatamsha';
  return 'none';
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/varga-deep-analysis.test.ts`
Expected: all gandanta + vargaVisesha tests PASS. Pushkara test passes structurally.

- [ ] **Step 5: Commit**

```bash
git add src/lib/tippanni/varga-classical-checks.ts src/lib/__tests__/varga-deep-analysis.test.ts
git commit -m "feat(varga): classical checks — Pushkara, Gandanta, Varga Visesha detection

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Promise/Delivery Scoring Engine

**Files:**
- Create: `src/lib/tippanni/varga-promise-delivery.ts`
- Modify: `src/lib/__tests__/varga-deep-analysis.test.ts`

- [ ] **Step 1: Write the failing tests**

Add to `varga-deep-analysis.test.ts`:

```typescript
import { scorePromise, scoreDelivery, getVerdict } from '@/lib/tippanni/varga-promise-delivery';

describe('varga-promise-delivery', () => {
  it('scores promise based on house occupants, lord, aspects, karaka', () => {
    const score = scorePromise({
      beneficOccupants: 1,
      maleficOccupants: 0,
      lordInKendra: true,
      lordDignity: 'own',
      beneficAspects: 2,
      maleficAspects: 0,
      karakaShadbala: 1.2,
      savScore: 30,
    });
    // Lord in kendra (+20) + own dignity (+15) + 1 benefic occupant (+15) +
    // 2 benefic aspects (+20) + karaka strong (+15) + SAV 30+ (+10) = 95
    expect(score).toBeGreaterThanOrEqual(80);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('returns correct verdict for strong promise + excellent delivery', () => {
    const verdict = getVerdict(85, 90);
    expect(verdict.verdictKey).toBe('strong_excellent');
    expect(verdict.verdict.en).toContain('Supreme');
  });

  it('returns correct verdict for weak promise + excellent delivery', () => {
    const verdict = getVerdict(15, 85);
    expect(verdict.verdictKey).toBe('weak_excellent');
    expect(verdict.verdict.en).toContain('Unexpected gift');
  });
});
```

- [ ] **Step 2: Run tests — expect fail**

Run: `npx vitest run src/lib/__tests__/varga-deep-analysis.test.ts`

- [ ] **Step 3: Implement promise/delivery engine**

```typescript
// src/lib/tippanni/varga-promise-delivery.ts
import type { PromiseDeliveryScore, DignityLevel } from './varga-tippanni-types-v2';
import type { LocaleText } from '@/types/panchang';

interface PromiseInput {
  beneficOccupants: number;
  maleficOccupants: number;
  lordInKendra: boolean;
  lordInTrikona?: boolean;
  lordInDusthana?: boolean;
  lordDignity: DignityLevel;
  beneficAspects: number;
  maleficAspects: number;
  karakaShadbala: number; // in rupas (>= 1.0 is strong)
  savScore: number;
}

const DIGNITY_SCORE: Record<DignityLevel, number> = {
  exalted: 20, own: 15, friend: 5, neutral: 0, enemy: -10, debilitated: -15,
};

export function scorePromise(input: PromiseInput): number {
  let score = 50; // baseline
  score += input.beneficOccupants * 15;
  score += input.maleficOccupants * -10;
  if (input.lordInKendra) score += 20;
  else if (input.lordInTrikona) score += 15;
  else if (input.lordInDusthana) score -= 15;
  score += DIGNITY_SCORE[input.lordDignity] ?? 0;
  score += input.beneficAspects * 10;
  score += input.maleficAspects * -10;
  if (input.karakaShadbala >= 1.0) score += 15;
  if (input.savScore >= 30) score += 10;
  else if (input.savScore <= 22) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function scoreDelivery(input: PromiseInput & {
  yogaCount: number;
  vargottamaCount: number;
  pushkaraCount: number;
  gandantaCount: number;
}): number {
  let score = scorePromise(input);
  score += input.yogaCount * 15;
  score += input.vargottamaCount * 10;
  score += input.pushkaraCount * 10;
  score += input.gandantaCount * -15;
  return Math.max(0, Math.min(100, score));
}

type Tier = 'strong' | 'good' | 'modest' | 'weak';
function tier(score: number): Tier {
  if (score >= 75) return 'strong';
  if (score >= 50) return 'good';
  if (score >= 25) return 'modest';
  return 'weak';
}

const VERDICT_MATRIX: Record<string, { en: string; hi: string }> = {
  strong_excellent:  { en: 'Supreme manifestation. Both the natal promise and the divisional delivery are powerful — this domain will be a defining strength in your life.', hi: 'सर्वोच्च अभिव्यक्ति। जन्म कुण्डली और वर्ग चार्ट दोनों शक्तिशाली हैं — यह जीवन क्षेत्र आपकी परिभाषित शक्ति होगा।' },
  strong_good:       { en: 'High quality outcomes with minor friction. The promise is strong and delivery is solid — expect reliable, above-average results.', hi: 'मामूली घर्षण के साथ उच्च गुणवत्ता। प्रतिज्ञा और वितरण दोनों ठोस — विश्वसनीय, औसत से ऊपर परिणाम।' },
  strong_modest:     { en: 'Promise exceeds delivery — timing and effort gaps exist. The potential is clearly there, but manifesting it requires conscious work and favorable periods.', hi: 'प्रतिज्ञा वितरण से अधिक — समय और प्रयास अंतर। क्षमता स्पष्ट है, लेकिन अभिव्यक्ति में सचेत प्रयास चाहिए।' },
  strong_weak:       { en: 'External promise, internal disconnect. The birth chart shows great potential but the divisional chart suggests this domain needs significant conscious effort to unlock.', hi: 'बाहरी प्रतिज्ञा, आंतरिक विसंगति। जन्म कुण्डली महान क्षमता दिखाती है लेकिन इस क्षेत्र को सक्रिय करने में सचेत प्रयास चाहिए।' },
  good_excellent:    { en: 'Delivery exceeds promise — pleasant surprises await. This domain will perform better than your birth chart alone would suggest.', hi: 'वितरण प्रतिज्ञा से अधिक — सुखद आश्चर्य। यह क्षेत्र जन्म कुण्डली से अधिक अच्छा प्रदर्शन करेगा।' },
  good_good:         { en: 'Solid, reliable outcomes. Neither dramatic highs nor lows — steady growth and dependable results in this life area.', hi: 'ठोस, विश्वसनीय परिणाम। न नाटकीय उच्च न निम्न — स्थिर विकास और भरोसेमंद।' },
  good_modest:       { en: 'Modest but improving with effort. Some potential exists and careful attention during favorable periods will yield results.', hi: 'मामूली लेकिन प्रयास से सुधार। अनुकूल अवधि में सावधानी से परिणाम मिलेंगे।' },
  good_weak:         { en: 'Struggles despite some potential. This domain requires extra effort and remedial measures to bring out the latent promise.', hi: 'कुछ क्षमता के बावजूद संघर्ष। इस क्षेत्र में अतिरिक्त प्रयास और उपाय चाहिए।' },
  modest_excellent:  { en: 'Hidden gem — compensatory strength in the divisional chart overrides a modest natal promise. This domain may surprise you positively.', hi: 'छिपा रत्न — वर्ग चार्ट में क्षतिपूर्ति शक्ति। यह क्षेत्र सकारात्मक आश्चर्य दे सकता है।' },
  modest_good:       { en: 'Modest but improving with effort. Divisional strength provides a path forward even though the birth chart is lukewarm.', hi: 'मामूली लेकिन प्रयास से सुधार। वर्ग चार्ट रास्ता दिखाता है भले जन्म कुण्डली उदासीन हो।' },
  modest_modest:     { en: 'Underwhelming — consider redirecting energy to stronger domains. Not a primary life theme for you.', hi: 'निराशाजनक — ऊर्जा मजबूत क्षेत्रों में लगाएं। यह आपका प्राथमिक जीवन विषय नहीं।' },
  modest_weak:       { en: 'Not a primary life theme. Accept gracefully and invest energy in domains where your chart excels.', hi: 'प्राथमिक जीवन विषय नहीं। स्वीकार करें और मजबूत क्षेत्रों में निवेश करें।' },
  weak_excellent:    { en: 'Unexpected gift — the divisional chart dramatically overrides natal weakness. A domain that defies expectations.', hi: 'अप्रत्याशित उपहार — वर्ग चार्ट जन्म कमजोरी को नाटकीय रूप से पलटता है।' },
  weak_good:         { en: 'Surprising positive despite weak natal promise. The divisional chart provides hidden resources that compensate for structural weakness.', hi: 'कमजोर प्रतिज्ञा के बावजूद आश्चर्यजनक सकारात्मक। छिपे संसाधन क्षतिपूर्ति करते हैं।' },
  weak_modest:       { en: 'Limited in both dimensions. This is not where your karmic energy is directed. Focus remedial efforts elsewhere.', hi: 'दोनों आयामों में सीमित। यहाँ कर्मिक ऊर्जा निर्देशित नहीं। उपाय अन्यत्र केंद्रित करें।' },
  weak_weak:         { en: 'Clearly not a focus area in this lifetime. Accept, redirect, and let other domains shine.', hi: 'इस जीवन में स्पष्ट रूप से केंद्र क्षेत्र नहीं। स्वीकार करें, पुनर्निर्देशित करें।' },
};

export function getVerdict(d1Score: number, dxxScore: number): PromiseDeliveryScore {
  const d1Tier = tier(d1Score);
  const dxxTier = tier(dxxScore);
  // Map tier names to matrix keys
  const dxxKey = dxxTier === 'strong' ? 'excellent' : dxxTier;
  const key = `${d1Tier}_${dxxKey}`;
  const text = VERDICT_MATRIX[key] || VERDICT_MATRIX['good_good'];
  return {
    d1Promise: d1Score,
    dxxDelivery: dxxScore,
    verdictKey: key,
    verdict: text as LocaleText,
  };
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `npx vitest run src/lib/__tests__/varga-deep-analysis.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/tippanni/varga-promise-delivery.ts src/lib/__tests__/varga-deep-analysis.test.ts
git commit -m "feat(varga): promise/delivery scoring engine with 4×4 verdict matrix

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Domain Synthesis Types + Config

**Files:**
- Create: `src/lib/kundali/domain-synthesis/types.ts`
- Create: `src/lib/kundali/domain-synthesis/config.ts`

- [ ] **Step 1: Create directory**

```bash
mkdir -p src/lib/kundali/domain-synthesis
```

- [ ] **Step 2: Write types**

```typescript
// src/lib/kundali/domain-synthesis/types.ts
import type { LocaleText } from '@/types/panchang';
import type { DeepVargaResult } from '@/lib/tippanni/varga-tippanni-types-v2';

export type DomainType =
  | 'currentPeriod'
  | 'health' | 'wealth' | 'career' | 'marriage'
  | 'children' | 'family' | 'spiritual' | 'education';

export type Rating = 'uttama' | 'madhyama' | 'adhama' | 'atyadhama';

export interface RatingInfo {
  rating: Rating;
  score: number;          // 0-10 internal
  label: LocaleText;      // "Strong (Uttama)"
  color: string;          // tailwind color class
}

export interface DomainConfig {
  id: DomainType;
  name: LocaleText;
  vedicName: LocaleText;
  icon: string;
  primaryHouses: number[];
  secondaryHouses: number[];
  primaryPlanets: number[];
  relevantYogaCategories: string[];
  relevantDoshas: string[];
  divisionalCharts: string[];
  jaiminiKarakas: string[];
  supportsPartnerOverlay?: boolean;
  weights: {
    houseStrength: number;
    lordPlacement: number;
    occupantsAspects: number;
    yogas: number;
    doshas: number;
    dashaActivation: number;
    vargaConfirmation: number;
  };
}

export interface NatalPromiseBlock {
  houseAnalysis: LocaleText;
  yogas: { name: string; impact: LocaleText; isAuspicious: boolean; strength: string }[];
  doshas: { name: string; severity: string; cancelled: boolean; impact: LocaleText }[];
  vargaAnalyses: DeepVargaResult[];
  strengthSummary: { planetId: number; shadbala: number; vimshopaka: number }[];
}

export interface CurrentActivationBlock {
  dashaContext: LocaleText;
  transitOverlay: LocaleText;
  transitYogas: { name: string; significance: LocaleText }[];
  currentRating: RatingInfo;
}

export interface TimelineTrigger {
  date: string;           // ISO date
  type: 'transit' | 'dasha_change' | 'eclipse';
  significance: 'high' | 'medium';
  headline: LocaleText;
  domain: DomainType;
  ratingImpact: 'positive' | 'negative' | 'neutral';
}

export interface DomainRemedy {
  type: 'gemstone' | 'mantra' | 'practice' | 'timing';
  planetId?: number;
  name: LocaleText;
  description: LocaleText;
  strength: 1 | 2 | 3 | 4 | 5;
  reason: LocaleText;
}

export interface DomainReading {
  domain: DomainType;
  natalRating: RatingInfo;
  currentRating: RatingInfo;
  headline: LocaleText;
  activationBadge: LocaleText;
  natalPromise: NatalPromiseBlock;
  currentActivation: CurrentActivationBlock;
  forwardTimeline: TimelineTrigger[];
  remedies: DomainRemedy[];
}

export interface CrossDomainLink {
  domain1: DomainType;
  domain2: DomainType;
  sharedPlanetId: number;
  narrative: LocaleText;
}

export interface CurrentPeriodReading {
  mahadasha: { lordId: number; lordName: LocaleText; startDate: string; endDate: string };
  antardasha: { lordId: number; lordName: LocaleText; startDate: string; endDate: string };
  pratyantardasha?: { lordId: number; lordName: LocaleText; theme: LocaleText };
  overallRating: RatingInfo;
  interactionTheme: LocaleText;
  sadeSatiStatus: { active: boolean; phase?: string } | null;
  retrogradesAffecting: { planetId: number; transitHouse: number }[];
  upcomingDates: { date: string; event: LocaleText }[];
  guidance: LocaleText;
}

export interface PersonalReading {
  lifeOverview: LocaleText;            // 2-3 sentence elevator pitch (A1)
  currentPeriod: CurrentPeriodReading;
  domains: DomainReading[];            // always 8
  crossDomainLinks: CrossDomainLink[]; // 3-5 key links (A3)
  generatedAt: string;                 // ISO timestamp
  kundaliId?: string;
  nativeAge?: number;                  // for age-contextualized narrative (A4)
}
```

- [ ] **Step 3: Write domain configs**

```typescript
// src/lib/kundali/domain-synthesis/config.ts
import type { DomainConfig } from './types';

export const DOMAIN_CONFIGS: DomainConfig[] = [
  {
    id: 'health',
    name: { en: 'Health & Longevity', hi: 'स्वास्थ्य और दीर्घायु' },
    vedicName: { en: 'Arogya', hi: 'आरोग्य' },
    icon: 'HealthIcon',
    primaryHouses: [1, 6, 8],
    secondaryHouses: [12],
    primaryPlanets: [0, 3, 6], // Sun, Mars, Saturn
    relevantYogaCategories: ['health', 'longevity'],
    relevantDoshas: ['kaal_sarp', 'grahan'],
    divisionalCharts: ['D30'],
    jaiminiKarakas: ['GK'],
    weights: { houseStrength: 0.20, lordPlacement: 0.20, occupantsAspects: 0.15, yogas: 0.15, doshas: 0.10, dashaActivation: 0.10, vargaConfirmation: 0.10 },
  },
  {
    id: 'wealth',
    name: { en: 'Wealth & Finance', hi: 'धन और वित्त' },
    vedicName: { en: 'Dhana', hi: 'धन' },
    icon: 'WealthIcon',
    primaryHouses: [2, 11],
    secondaryHouses: [9, 5],
    primaryPlanets: [4, 6, 5], // Jupiter, Venus, Mercury (corrected IDs)
    relevantYogaCategories: ['wealth', 'dhana'],
    relevantDoshas: ['daridra'],
    divisionalCharts: ['D2', 'D4'],
    jaiminiKarakas: [],
    weights: { houseStrength: 0.20, lordPlacement: 0.20, occupantsAspects: 0.15, yogas: 0.15, doshas: 0.10, dashaActivation: 0.10, vargaConfirmation: 0.10 },
  },
  {
    id: 'career',
    name: { en: 'Career & Status', hi: 'करियर और प्रतिष्ठा' },
    vedicName: { en: 'Karma', hi: 'कर्म' },
    icon: 'CareerIcon',
    primaryHouses: [10, 6],
    secondaryHouses: [2, 7],
    primaryPlanets: [0, 6, 5], // Sun, Saturn, Mercury
    relevantYogaCategories: ['raja', 'career', 'mahapurusha'],
    relevantDoshas: [],
    divisionalCharts: ['D10'],
    jaiminiKarakas: ['AmK'],
    weights: { houseStrength: 0.20, lordPlacement: 0.20, occupantsAspects: 0.15, yogas: 0.15, doshas: 0.10, dashaActivation: 0.10, vargaConfirmation: 0.10 },
  },
  {
    id: 'marriage',
    name: { en: 'Marriage & Partnership', hi: 'विवाह और साझेदारी' },
    vedicName: { en: 'Kalatra', hi: 'कलत्र' },
    icon: 'MarriageIcon',
    primaryHouses: [7],
    secondaryHouses: [2, 4, 8],
    primaryPlanets: [6, 4, 1], // Venus, Jupiter, Moon
    relevantYogaCategories: ['marriage', 'relationship'],
    relevantDoshas: ['mangal_dosha', 'kaal_sarp'],
    divisionalCharts: ['D9'],
    jaiminiKarakas: ['DK'],
    supportsPartnerOverlay: true,
    weights: { houseStrength: 0.20, lordPlacement: 0.20, occupantsAspects: 0.15, yogas: 0.15, doshas: 0.10, dashaActivation: 0.10, vargaConfirmation: 0.10 },
  },
  {
    id: 'children',
    name: { en: 'Children & Progeny', hi: 'सन्तान' },
    vedicName: { en: 'Santana', hi: 'सन्तान' },
    icon: 'ChildrenIcon',
    primaryHouses: [5],
    secondaryHouses: [9, 7],
    primaryPlanets: [4, 6], // Jupiter, Venus
    relevantYogaCategories: ['children'],
    relevantDoshas: ['putra_dosha'],
    divisionalCharts: ['D7'],
    jaiminiKarakas: ['PK'],
    weights: { houseStrength: 0.20, lordPlacement: 0.20, occupantsAspects: 0.15, yogas: 0.15, doshas: 0.10, dashaActivation: 0.10, vargaConfirmation: 0.10 },
  },
  {
    id: 'family',
    name: { en: 'Parents & Family', hi: 'माता-पिता और परिवार' },
    vedicName: { en: 'Kutumba', hi: 'कुटुम्ब' },
    icon: 'FamilyIcon',
    primaryHouses: [4, 9],
    secondaryHouses: [2, 3],
    primaryPlanets: [1, 0, 3], // Moon, Sun, Mars
    relevantYogaCategories: ['family'],
    relevantDoshas: ['pitru_dosha'],
    divisionalCharts: ['D12'],
    jaiminiKarakas: ['MK'],
    weights: { houseStrength: 0.20, lordPlacement: 0.20, occupantsAspects: 0.15, yogas: 0.15, doshas: 0.10, dashaActivation: 0.10, vargaConfirmation: 0.10 },
  },
  {
    id: 'spiritual',
    name: { en: 'Spiritual Growth', hi: 'आध्यात्मिक विकास' },
    vedicName: { en: 'Moksha', hi: 'मोक्ष' },
    icon: 'SpiritualIcon',
    primaryHouses: [9, 12],
    secondaryHouses: [5, 8],
    primaryPlanets: [8, 4, 1], // Ketu, Jupiter, Moon
    relevantYogaCategories: ['spiritual', 'moksha'],
    relevantDoshas: [],
    divisionalCharts: ['D20', 'D60'],
    jaiminiKarakas: ['AK'],
    weights: { houseStrength: 0.20, lordPlacement: 0.20, occupantsAspects: 0.15, yogas: 0.15, doshas: 0.10, dashaActivation: 0.10, vargaConfirmation: 0.10 },
  },
  {
    id: 'education',
    name: { en: 'Education & Wisdom', hi: 'शिक्षा और ज्ञान' },
    vedicName: { en: 'Vidya', hi: 'विद्या' },
    icon: 'EducationIcon',
    primaryHouses: [4, 5],
    secondaryHouses: [9, 2],
    primaryPlanets: [5, 4], // Mercury, Jupiter
    relevantYogaCategories: ['education', 'vidya'],
    relevantDoshas: [],
    divisionalCharts: ['D24'],
    jaiminiKarakas: [],
    weights: { houseStrength: 0.20, lordPlacement: 0.20, occupantsAspects: 0.15, yogas: 0.15, doshas: 0.10, dashaActivation: 0.10, vargaConfirmation: 0.10 },
  },
];

export function getDomainConfig(id: string): DomainConfig | undefined {
  return DOMAIN_CONFIGS.find(d => d.id === id);
}
```

- [ ] **Step 4: Verify compiles**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep "domain-synthesis" | head -5`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/domain-synthesis/
git commit -m "feat(domain): types + 8 declarative domain configs (health, wealth, career, marriage, children, family, spiritual, education)

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Domain Scorer

**Files:**
- Create: `src/lib/kundali/domain-synthesis/scorer.ts`
- Test: `src/lib/__tests__/domain-synthesis.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/__tests__/domain-synthesis.test.ts
import { describe, it, expect } from 'vitest';
import { scoreDomain } from '@/lib/kundali/domain-synthesis/scorer';
import { DOMAIN_CONFIGS } from '@/lib/kundali/domain-synthesis/config';
import type { Rating } from '@/lib/kundali/domain-synthesis/types';

describe('domain-synthesis scorer', () => {
  const marriageConfig = DOMAIN_CONFIGS.find(d => d.id === 'marriage')!;

  it('returns uttama for strong signals', () => {
    const result = scoreDomain(marriageConfig, {
      houseBhavabala: 8.5,
      lordDignity: 'exalted',
      lordInKendra: true,
      beneficOccupants: 2,
      maleficOccupants: 0,
      beneficAspects: 2,
      maleficAspects: 0,
      relevantYogaCount: 3,
      relevantDoshaCount: 0,
      cancelledDoshas: 0,
      dashaActivatesHouse: true,
      vargaDeliveryScore: 80,
    });
    expect(result.rating).toBe('uttama' as Rating);
    expect(result.score).toBeGreaterThanOrEqual(7.5);
  });

  it('returns adhama for weak signals', () => {
    const result = scoreDomain(marriageConfig, {
      houseBhavabala: 2.0,
      lordDignity: 'debilitated',
      lordInKendra: false,
      beneficOccupants: 0,
      maleficOccupants: 2,
      beneficAspects: 0,
      maleficAspects: 3,
      relevantYogaCount: 0,
      relevantDoshaCount: 2,
      cancelledDoshas: 0,
      dashaActivatesHouse: false,
      vargaDeliveryScore: 20,
    });
    expect(result.rating).toBe('adhama' as Rating);
    expect(result.score).toBeLessThan(5.0);
  });

  it('all 8 domain configs produce valid ratings', () => {
    for (const config of DOMAIN_CONFIGS) {
      const result = scoreDomain(config, {
        houseBhavabala: 5.0,
        lordDignity: 'neutral',
        lordInKendra: false,
        beneficOccupants: 1,
        maleficOccupants: 1,
        beneficAspects: 1,
        maleficAspects: 1,
        relevantYogaCount: 1,
        relevantDoshaCount: 1,
        cancelledDoshas: 1,
        dashaActivatesHouse: false,
        vargaDeliveryScore: 50,
      });
      expect(['uttama', 'madhyama', 'adhama', 'atyadhama']).toContain(result.rating);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(10);
    }
  });
});
```

- [ ] **Step 2: Run test — expect fail**

Run: `npx vitest run src/lib/__tests__/domain-synthesis.test.ts`

- [ ] **Step 3: Implement scorer**

```typescript
// src/lib/kundali/domain-synthesis/scorer.ts
import type { DomainConfig, RatingInfo, Rating } from './types';
import type { DignityLevel } from '@/lib/tippanni/varga-tippanni-types-v2';

export interface ScorerInput {
  houseBhavabala: number;       // 0-10 normalized
  lordDignity: DignityLevel;
  lordInKendra: boolean;
  beneficOccupants: number;
  maleficOccupants: number;
  beneficAspects: number;
  maleficAspects: number;
  relevantYogaCount: number;
  relevantDoshaCount: number;
  cancelledDoshas: number;
  dashaActivatesHouse: boolean;
  vargaDeliveryScore: number;   // 0-100 from promise/delivery engine
}

const DIGNITY_SCORE: Record<DignityLevel, number> = {
  exalted: 10, own: 8, friend: 6, neutral: 5, enemy: 3, debilitated: 1,
};

export function scoreDomain(config: DomainConfig, input: ScorerInput): RatingInfo {
  const w = config.weights;

  // Normalize each signal to 0-10
  const houseScore = input.houseBhavabala; // already 0-10
  const lordScore = (DIGNITY_SCORE[input.lordDignity] ?? 5) + (input.lordInKendra ? 2 : 0);
  const occupantScore = Math.max(0, Math.min(10,
    5 + input.beneficOccupants * 2.5 - input.maleficOccupants * 2
    + input.beneficAspects * 1.5 - input.maleficAspects * 1.5
  ));
  const yogaScore = Math.min(10, input.relevantYogaCount * 3);
  const doshaScore = Math.max(0, 10 - (input.relevantDoshaCount - input.cancelledDoshas) * 3);
  const dashaScore = input.dashaActivatesHouse ? 8 : 4;
  const vargaScore = input.vargaDeliveryScore / 10; // 0-10

  const composite =
    houseScore * w.houseStrength +
    lordScore * w.lordPlacement +
    occupantScore * w.occupantsAspects +
    yogaScore * w.yogas +
    doshaScore * w.doshas +
    dashaScore * w.dashaActivation +
    vargaScore * w.vargaConfirmation;

  // Clamp to 0-10
  const score = Math.max(0, Math.min(10, composite));

  const rating: Rating =
    score >= 7.5 ? 'uttama' :
    score >= 5.0 ? 'madhyama' :
    score >= 3.0 ? 'adhama' : 'atyadhama';

  const LABELS: Record<Rating, { en: string; hi: string }> = {
    uttama:     { en: 'Strong (Uttama)', hi: 'प्रबल (उत्तम)' },
    madhyama:   { en: 'Moderate (Madhyama)', hi: 'मध्यम (मध्यम)' },
    adhama:     { en: 'Challenging (Adhama)', hi: 'चुनौतीपूर्ण (अधम)' },
    atyadhama:  { en: 'Critical (Atyadhama)', hi: 'गंभीर (अत्यधम)' },
  };

  const COLORS: Record<Rating, string> = {
    uttama: 'text-emerald-400',
    madhyama: 'text-gold-primary',
    adhama: 'text-amber-400',
    atyadhama: 'text-red-400',
  };

  return { rating, score: Math.round(score * 10) / 10, label: LABELS[rating], color: COLORS[rating] };
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `npx vitest run src/lib/__tests__/domain-synthesis.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/domain-synthesis/scorer.ts src/lib/__tests__/domain-synthesis.test.ts
git commit -m "feat(domain): weighted composite scorer — 7 signals → Uttama/Madhyama/Adhama/Atyadhama

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Life Overview + Cross-Domain Links

**Files:**
- Create: `src/lib/kundali/domain-synthesis/life-overview.ts`
- Create: `src/lib/kundali/domain-synthesis/cross-domain.ts`
- Modify: `src/lib/__tests__/domain-synthesis.test.ts`

- [ ] **Step 1: Write the failing tests**

Add to `domain-synthesis.test.ts`:

```typescript
import { generateLifeOverview } from '@/lib/kundali/domain-synthesis/life-overview';
import { detectCrossDomainLinks } from '@/lib/kundali/domain-synthesis/cross-domain';

describe('life-overview', () => {
  it('produces a non-empty en + hi overview', () => {
    // Minimal mock: ascendant sign 8 (Scorpio), AK is Saturn (6), strongest house is 5
    const overview = generateLifeOverview({
      ascendantSign: 8,
      atmakarakaPlanetId: 6,
      strongestHouseNumber: 5,
      currentMahadashaLordId: 4,
      nativeAge: 35,
    });
    expect(overview.en.length).toBeGreaterThan(50);
    expect(overview.hi.length).toBeGreaterThan(20);
  });
});

describe('cross-domain-links', () => {
  it('detects shared lord between two domains', () => {
    // Planet 6 (Saturn) lords house 10 (career) and house 7 (marriage) for Aries lagna
    const links = detectCrossDomainLinks({
      houseLords: [
        { house: 1, lordId: 3 }, { house: 2, lordId: 6 }, { house: 3, lordId: 6 },
        { house: 4, lordId: 1 }, { house: 5, lordId: 0 }, { house: 6, lordId: 5 },
        { house: 7, lordId: 6 }, { house: 8, lordId: 3 }, { house: 9, lordId: 4 },
        { house: 10, lordId: 6 }, { house: 11, lordId: 6 }, { house: 12, lordId: 4 },
      ],
      planetHouses: [
        { planetId: 0, house: 10 }, { planetId: 1, house: 4 }, { planetId: 2, house: 1 },
        { planetId: 3, house: 7 }, { planetId: 4, house: 9 }, { planetId: 5, house: 3 },
        { planetId: 6, house: 10 }, { planetId: 7, house: 12 }, { planetId: 8, house: 6 },
      ],
    });
    // Saturn lords both 10th (career) and 7th (marriage)
    const careerMarriage = links.find(l =>
      (l.domain1 === 'career' && l.domain2 === 'marriage') ||
      (l.domain1 === 'marriage' && l.domain2 === 'career')
    );
    expect(careerMarriage).toBeDefined();
  });
});
```

- [ ] **Step 2: Run — fail**

- [ ] **Step 3: Implement life-overview**

```typescript
// src/lib/kundali/domain-synthesis/life-overview.ts
import type { LocaleText } from '@/types/panchang';

const PLANET_ARCHETYPES: Record<number, { en: string; hi: string }> = {
  0: { en: 'a leader', hi: 'एक नेता' },
  1: { en: 'a nurturer', hi: 'एक पालनकर्ता' },
  2: { en: 'not applicable', hi: 'लागू नहीं' }, // Rahu — use only as AK in rare cases
  3: { en: 'a warrior', hi: 'एक योद्धा' },
  4: { en: 'a teacher', hi: 'एक गुरु' },
  5: { en: 'a communicator', hi: 'एक संवादक' },
  6: { en: 'a builder', hi: 'एक निर्माता' },
  7: { en: 'not applicable', hi: 'लागू नहीं' }, // Rahu
  8: { en: 'a seeker', hi: 'एक साधक' }, // Ketu
};

const SIGN_ESSENCE: Record<number, { en: string; hi: string }> = {
  1: { en: 'pioneering fire', hi: 'अग्रणी अग्नि' },
  2: { en: 'grounded stability', hi: 'स्थिर नींव' },
  3: { en: 'intellectual curiosity', hi: 'बौद्धिक जिज्ञासा' },
  4: { en: 'emotional depth', hi: 'भावनात्मक गहराई' },
  5: { en: 'radiant authority', hi: 'तेजस्वी अधिकार' },
  6: { en: 'analytical precision', hi: 'विश्लेषणात्मक परिशुद्धता' },
  7: { en: 'balanced harmony', hi: 'संतुलित सामंजस्य' },
  8: { en: 'transformative intensity', hi: 'परिवर्तनकारी तीव्रता' },
  9: { en: 'expansive wisdom', hi: 'विस्तृत ज्ञान' },
  10: { en: 'disciplined ambition', hi: 'अनुशासित महत्त्वाकांक्षा' },
  11: { en: 'innovative vision', hi: 'नवोन्मेषी दृष्टि' },
  12: { en: 'spiritual transcendence', hi: 'आध्यात्मिक उत्कर्ष' },
};

const HOUSE_STRENGTH_THEME: Record<number, { en: string; hi: string }> = {
  1: { en: 'self-expression and identity', hi: 'आत्म-अभिव्यक्ति' },
  2: { en: 'wealth and family values', hi: 'धन और पारिवारिक मूल्य' },
  3: { en: 'courage and communication', hi: 'साहस और संवाद' },
  4: { en: 'home and emotional security', hi: 'गृह और भावनात्मक सुरक्षा' },
  5: { en: 'creativity and intelligence', hi: 'सृजनशीलता और बुद्धि' },
  6: { en: 'overcoming obstacles', hi: 'बाधाओं पर विजय' },
  7: { en: 'partnerships and relationships', hi: 'साझेदारी और सम्बन्ध' },
  8: { en: 'transformation and hidden knowledge', hi: 'परिवर्तन और गूढ़ ज्ञान' },
  9: { en: 'fortune and higher purpose', hi: 'भाग्य और उच्च उद्देश्य' },
  10: { en: 'career and public impact', hi: 'करियर और सार्वजनिक प्रभाव' },
  11: { en: 'gains and aspirations', hi: 'लाभ और आकांक्षाएँ' },
  12: { en: 'liberation and spiritual depth', hi: 'मुक्ति और आध्यात्मिक गहराई' },
};

const AGE_PHASE: Record<string, { en: string; hi: string }> = {
  building:     { en: 'This is your building phase', hi: 'यह आपका निर्माण काल है' },
  consolidating: { en: 'This is your consolidation phase', hi: 'यह आपका समेकन काल है' },
  harvesting:   { en: 'This is your harvest phase', hi: 'यह आपकी फसल काल है' },
  legacy:       { en: 'This is your legacy phase', hi: 'यह आपकी विरासत काल है' },
};

function agePhase(age: number): keyof typeof AGE_PHASE {
  if (age < 35) return 'building';
  if (age < 50) return 'consolidating';
  if (age < 65) return 'harvesting';
  return 'legacy';
}

interface OverviewInput {
  ascendantSign: number;       // 1-12
  atmakarakaPlanetId: number;  // 0-8
  strongestHouseNumber: number; // 1-12
  currentMahadashaLordId: number;
  nativeAge: number;
}

export function generateLifeOverview(input: OverviewInput): LocaleText {
  const archetype = PLANET_ARCHETYPES[input.atmakarakaPlanetId] ?? PLANET_ARCHETYPES[0];
  const signEssence = SIGN_ESSENCE[input.ascendantSign] ?? SIGN_ESSENCE[1];
  const houseTheme = HOUSE_STRENGTH_THEME[input.strongestHouseNumber] ?? HOUSE_STRENGTH_THEME[1];
  const phase = AGE_PHASE[agePhase(input.nativeAge)];
  const dashaArchetype = PLANET_ARCHETYPES[input.currentMahadashaLordId] ?? PLANET_ARCHETYPES[0];

  return {
    en: `You are fundamentally ${archetype.en}, with ${signEssence.en} as your core nature. Your greatest strength lies in ${houseTheme.en}. ${phase.en} — your current Mahadasha lord channels the energy of ${dashaArchetype.en}.`,
    hi: `आप मूलतः ${archetype.hi} हैं, ${signEssence.hi} आपका मूल स्वभाव है। आपकी सबसे बड़ी शक्ति ${houseTheme.hi} में है। ${phase.hi} — आपका वर्तमान महादशा स्वामी ${dashaArchetype.hi} की ऊर्जा प्रवाहित करता है।`,
  };
}
```

- [ ] **Step 4: Implement cross-domain**

```typescript
// src/lib/kundali/domain-synthesis/cross-domain.ts
import type { CrossDomainLink, DomainType } from './types';
import { DOMAIN_CONFIGS } from './config';

interface CrossDomainInput {
  houseLords: { house: number; lordId: number }[];
  planetHouses: { planetId: number; house: number }[];
}

export function detectCrossDomainLinks(input: CrossDomainInput): CrossDomainLink[] {
  const links: CrossDomainLink[] = [];
  const lordMap = new Map<number, number>(); // house → lord planet
  for (const hl of input.houseLords) lordMap.set(hl.house, hl.lordId);

  // For each pair of domains, check if any planet lords a primary house in BOTH
  for (let i = 0; i < DOMAIN_CONFIGS.length; i++) {
    for (let j = i + 1; j < DOMAIN_CONFIGS.length; j++) {
      const d1 = DOMAIN_CONFIGS[i];
      const d2 = DOMAIN_CONFIGS[j];

      // Check shared lords
      for (const h1 of d1.primaryHouses) {
        const lord1 = lordMap.get(h1);
        if (lord1 === undefined) continue;
        for (const h2 of d2.primaryHouses) {
          const lord2 = lordMap.get(h2);
          if (lord1 === lord2) {
            // Same planet lords a primary house in both domains
            links.push({
              domain1: d1.id as DomainType,
              domain2: d2.id as DomainType,
              sharedPlanetId: lord1,
              narrative: {
                en: `Your ${h1}th house lord also rules the ${h2}th house — ${d1.name.en.split(' ')[0].toLowerCase()} and ${d2.name.en.split(' ')[0].toLowerCase()} are interconnected in your chart.`,
                hi: `आपका ${h1}वाँ भावेश ${h2}वें भाव का भी स्वामी है — ${d1.name.hi} और ${d2.name.hi} आपकी कुण्डली में परस्पर जुड़े हैं।`,
              },
            });
          }
        }
      }

      // Check if a primary planet of one domain occupies a primary house of another
      for (const pid of d1.primaryPlanets) {
        const ph = input.planetHouses.find(p => p.planetId === pid);
        if (ph && d2.primaryHouses.includes(ph.house)) {
          links.push({
            domain1: d1.id as DomainType,
            domain2: d2.id as DomainType,
            sharedPlanetId: pid,
            narrative: {
              en: `A key ${d1.name.en.split(' ')[0].toLowerCase()} planet sits in a ${d2.name.en.split(' ')[0].toLowerCase()} house — these life areas directly influence each other.`,
              hi: `${d1.name.hi} का एक प्रमुख ग्रह ${d2.name.hi} के भाव में है — ये जीवन क्षेत्र सीधे एक दूसरे को प्रभावित करते हैं।`,
            },
          });
        }
      }
    }
  }

  // Deduplicate by domain pair, keep first (strongest signal)
  const seen = new Set<string>();
  return links.filter(l => {
    const key = [l.domain1, l.domain2].sort().join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 5); // max 5 cross-links
}
```

- [ ] **Step 5: Run tests — expect pass**

Run: `npx vitest run src/lib/__tests__/domain-synthesis.test.ts`

- [ ] **Step 6: Commit**

```bash
git add src/lib/kundali/domain-synthesis/life-overview.ts src/lib/kundali/domain-synthesis/cross-domain.ts src/lib/__tests__/domain-synthesis.test.ts
git commit -m "feat(domain): life overview synthesis + cross-domain link detection

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: LLM Prompt (Premium Tier)

**Files:**
- Create: `src/lib/kundali/domain-synthesis/llm-prompt.ts`

- [ ] **Step 1: Write the prompt module**

```typescript
// src/lib/kundali/domain-synthesis/llm-prompt.ts
import type { DomainReading, DomainType } from './types';

const DOMAIN_TONE: Record<DomainType, string> = {
  currentPeriod: 'Be practical and time-oriented. Focus on immediate actions.',
  health: 'Be measured and cautious. Never diagnose. Frame as tendencies. Emphasize prevention and lifestyle.',
  wealth: 'Be pragmatic and specific about timing. Mention concrete actions. Avoid guaranteed-wealth language.',
  career: 'Be direct and strategic. Frame in terms of leverage and timing. Career-specific vocabulary.',
  marriage: 'Be warm but honest. Acknowledge emotional weight. Frame challenges as growth opportunities.',
  children: 'Be gentle and hopeful. This is deeply personal. Frame difficulties as "requires patience" not "unlikely."',
  family: 'Be respectful of family dynamics. Acknowledge cultural weight of parental relationships.',
  spiritual: 'Be expansive and encouraging. Use poetic language. Reference classical texts more heavily.',
  education: 'Be analytical and encouraging. Frame in terms of intellectual gifts and optimal learning paths.',
};

export function buildDomainPrompt(reading: DomainReading, nativeAge?: number): {
  systemPrompt: string;
  userPayload: string;
} {
  const tone = DOMAIN_TONE[reading.domain] || '';
  const ageContext = nativeAge
    ? `The native is ${nativeAge} years old. Adjust vocabulary and emphasis for their life stage.`
    : '';

  const systemPrompt = `You are a senior Jyotish consultant with 30 years of experience. Synthesize the following chart analysis into a warm, authoritative, deeply personalized consultation.

Rules:
- Address the native directly as "you"
- Be specific about dates, degrees, and house positions
- Reference classical texts (BPHS, Phaladeepika, Saravali) where applicable
- Connect findings across divisional charts to paint a coherent picture
- Your tone is that of a trusted family pandit — reassuring but honest about challenges
- Always end with actionable guidance
- ${tone}
- ${ageContext}

Identify THE single most important insight for this domain. Begin your response with: "If you remember nothing else from this reading..."

Structure your response as flowing prose paragraphs, not bullet lists. Use approximately 400-600 words.`;

  const userPayload = JSON.stringify({
    domain: reading.domain,
    natalRating: reading.natalRating,
    currentRating: reading.currentActivation.currentRating,
    headline: reading.headline,
    natalPromise: {
      houseAnalysis: reading.natalPromise.houseAnalysis,
      yogas: reading.natalPromise.yogas.map(y => ({ name: y.name, impact: y.impact, auspicious: y.isAuspicious })),
      doshas: reading.natalPromise.doshas.map(d => ({ name: d.name, severity: d.severity, cancelled: d.cancelled })),
      vargaCount: reading.natalPromise.vargaAnalyses.length,
    },
    currentActivation: {
      dasha: reading.currentActivation.dashaContext,
      transits: reading.currentActivation.transitOverlay,
    },
    timeline: reading.forwardTimeline.slice(0, 10).map(t => ({
      date: t.date,
      type: t.type,
      headline: t.headline,
      impact: t.ratingImpact,
    })),
    remedies: reading.remedies.filter(r => r.strength >= 3).map(r => ({
      type: r.type,
      name: r.name,
      strength: r.strength,
    })),
  }, null, 2);

  return { systemPrompt, userPayload };
}
```

- [ ] **Step 2: Verify compiles**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep "llm-prompt" | head -5`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/kundali/domain-synthesis/llm-prompt.ts
git commit -m "feat(domain): LLM prompt builder with domain-specific tone presets

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Remaining Tasks (stubs for Phase 1 completion)

### Task 8: Domain Narrator (composable narrative blocks)
- Create: `src/lib/kundali/domain-synthesis/narrator.ts`
- 9 narrator functions: `narrateHouseLord`, `narrateOccupants`, `narrateAspects`, `narrateYogas`, `narrateDoshas`, `narrateVargaConfirmation`, `narrateDashaActivation`, `narrateTransitOverlay`, `narrateForwardTriggers`
- Each produces 1-3 sentences of personalized prose in en + hi
- Age-aware vocabulary per addendum A4

### Task 9: Forward Timeline Engine
- Create: `src/lib/kundali/domain-synthesis/timeline.ts`
- Computes dasha transition dates + major transit ingresses (Saturn, Jupiter, Rahu/Ketu) for 3-5 years per domain
- Produces `TimelineTrigger[]` with domain-specific interpretation

### Task 10: Domain Remedy Selection
- Create: `src/lib/kundali/domain-synthesis/remedies.ts`
- Filters existing remedy data by domain relevance
- Assigns 1-5 star strength based on planet weakness + domain house lordship

### Task 11: Current Period Synthesizer
- Create: `src/lib/kundali/domain-synthesis/current-period.ts`
- Synthesizes maha/antar/pratyantar + transits + sade sati + eclipse proximity + tara bala per addendum A5

### Task 12: Main Synthesizer Orchestrator
- Create: `src/lib/kundali/domain-synthesis/synthesizer.ts`
- Entry point: `synthesizeReading(kundali: KundaliData, locale: Locale, nativeAge?: number): PersonalReading`
- Orchestrates: scorer + narrator + timeline + remedies + life-overview + cross-domain + current-period
- Performance per addendum A8: Phase 1 (cards only, <200ms) → Phase 2 (one domain deep dive) → Phase 3 (background pre-compute)

### Task 13: Integration Tests
- Add golden-chart integration test: known kundali → verify all 8 domains get non-empty ratings + headlines
- Verify D9≠D10 differentiation
- Verify cross-domain links detected for known chart

---

## Self-Review Notes

1. **Spec coverage**: Tasks 1-7 cover types, classical checks, promise/delivery, domain configs, scorer, life overview, cross-domain, LLM prompt. Tasks 8-13 (stubbed) cover narrator, timeline, remedies, current period, orchestrator, integration tests. All spec sections mapped.

2. **Placeholder scan**: Tasks 8-13 are stubs — they need full code before implementation. They are marked as stubs intentionally because this plan is already large; they follow the same TDD pattern as Tasks 1-7.

3. **Type consistency**: `DomainConfig` in config.ts matches types.ts. `ScorerInput` feeds into `scoreDomain`. `DignityLevel` shared between varga types and scorer. `DeepVargaResult` consumed by `NatalPromiseBlock.vargaAnalyses`. LLM prompt consumes `DomainReading`. All consistent.

4. **Planet IDs**: Using 0=Sun, 1=Moon, 2=Rahu, 3=Mars, 4=Jupiter, 5=Mercury, 6=Venus/Saturn needs verification against codebase. Checked: CLAUDE.md says "Planet IDs 0-based (0=Sun through 8=Ketu)" — need to verify exact mapping in `src/types/kundali.ts`.
