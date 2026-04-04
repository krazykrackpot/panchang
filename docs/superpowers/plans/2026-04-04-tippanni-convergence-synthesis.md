# Tippanni Convergence Synthesis — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add cross-element synthesis to the tippanni system — a convergence engine that detects when multiple astrological factors align on the same life theme, producing an executive summary and inline markers.

**Architecture:** A pure-function pattern engine runs alongside the existing tippanni generator. It takes pre-joined chart data (natal + dasha + transits + retro/combust + Ashtakavarga), scans 58 convergence patterns, applies 12 meta-interaction rules, and produces a `ConvergenceResult` with executive insights, section markers, and a transit overlay. The UI renders this as a hero card at the top of the tippanni tab with convergence badges on related sections.

**Tech Stack:** TypeScript, Next.js API routes, Framer Motion, existing astronomical engine (`src/lib/ephem/`), existing tippanni system (`src/lib/tippanni/`), Vitest for testing.

**Spec:** `docs/superpowers/specs/2026-04-04-tippanni-convergence-synthesis-design.md`

---

## Phase 1: Foundation

### Task 1: Types & Interfaces

**Files:**
- Create: `src/lib/tippanni/convergence/types.ts`

- [ ] **Step 1: Create the convergence types file**

```typescript
// src/lib/tippanni/convergence/types.ts

import type { Trilingual } from '@/types/panchang';

// ─── Enums ───────────────────────────────────────────────────────────────────

export type PatternTheme = 'career' | 'relationship' | 'wealth' | 'health' | 'spiritual' | 'family';
export type Significance = 1 | 2 | 3 | 4 | 5;
export type Tone = 'growth' | 'pressure' | 'transformation' | 'quiet' | 'mixed';
export type TemporalFrame = 'lifetime' | 'multi-year' | 'this-year' | 'this-month';
export type FlagIcon = 'warning' | 'opportunity' | 'transition';
export type FlagSeverity = 1 | 2 | 3;

export enum TippanniSection {
  Personality = 'personality',
  PlanetInsights = 'planet-insights',
  Yogas = 'yogas',
  Doshas = 'doshas',
  LifeAreas = 'life-areas',
  DashaSynthesis = 'dasha-synthesis',
  Strength = 'strength',
  YearPredictions = 'year-predictions',
}

// ─── Input ───────────────────────────────────────────────────────────────────

export interface RelationshipMap {
  houseRulers: Record<number, number>;     // house (1-12) -> planet ID (0-8)
  planetHouses: Record<number, number>;    // planet ID -> house occupied
  planetSigns: Record<number, number>;     // planet ID -> sign (1-12)
  transitHouses: Record<number, number>;   // planet ID -> transit house from Moon
  dashaLord: number;                       // current mahadasha lord planet ID
  antarLord: number;                       // current antardasha lord planet ID
}

export interface ConvergenceInput {
  ascendant: number;                       // ascendant sign (1-12)
  moonSign: number;                        // moon sign (1-12)
  planets: {
    id: number;
    house: number;
    sign: number;
    isRetrograde: boolean;
    isCombust: boolean;
    isExalted: boolean;
    isDebilitated: boolean;
    isOwnSign: boolean;
    shadbala: number;
  }[];
  houses: { house: number; sign: number; lordId: number }[];
  dashaLord: number;
  antarLord: number;
  yogaIds: string[];                       // IDs of present yogas
  doshaIds: string[];                      // IDs of present doshas
  transits: { planetId: number; sign: number; isRetrograde: boolean }[];
  ashtakavargaSAV: number[];              // 12 signs, sum per sign
  ashtakavargaBPI: number[][];            // [planetIndex][sign] = bindus
  relationships: RelationshipMap;
  dashaTransitionWithin6Months: boolean;
  navamshaConfirmations: Record<string, boolean>; // theme -> confirmed in D9
}

// ─── Pattern Conditions ──────────────────────────────────────────────────────

export type PlanetFilter = number | 'malefic' | 'benefic' | 'any';

export type PatternCondition =
  | { type: 'natal'; check: 'planet-in-house'; planet: PlanetFilter; house: number; weight?: number }
  | { type: 'natal'; check: 'lord-strong'; house: number; weight?: number }
  | { type: 'natal'; check: 'lord-afflicted'; house: number; weight?: number }
  | { type: 'natal'; check: 'yoga-present'; yogaId: string; weight?: number }
  | { type: 'natal'; check: 'dosha-present'; doshaId: string; weight?: number }
  | { type: 'natal'; check: 'benefic-aspect-to-house'; house: number; weight?: number }
  | { type: 'transit'; check: 'planet-in-house-from-moon'; planet: number; house: number; weight?: number }
  | { type: 'dasha'; check: 'lord-rules-or-occupies'; house: number; weight?: number }
  | { type: 'dasha'; check: 'lord-is-planet'; planet: number; weight?: number }
  | { type: 'retro'; check: 'planet-retrograde'; planet: number; weight?: number }
  | { type: 'combust'; check: 'planet-combust'; planet: number; weight?: number };

// ─── Pattern Definition ──────────────────────────────────────────────────────

export interface ConvergencePattern {
  id: string;
  theme: PatternTheme;
  significance: Significance;
  conditions: PatternCondition[];
  mutuallyExclusive?: string[];
  text: {
    full: { en: string; hi: string };
    mild: { en: string; hi: string };
  };
  advice: { en: string; hi: string };
  laypersonNote: { en: string; hi: string };
  relatedSections: TippanniSection[];
}

// ─── Matched Pattern ─────────────────────────────────────────────────────────

export interface MatchedPattern {
  patternId: string;
  theme: PatternTheme;
  matchCount: number;                      // how many conditions matched
  totalConditions: number;                 // total conditions in pattern
  isFullMatch: boolean;
  finalScore: number;                      // weighted score
  text: { en: string; hi: string };        // full or mild depending on match
  advice: { en: string; hi: string };
  laypersonNote: { en: string; hi: string };
  relatedSections: TippanniSection[];
}

// ─── Meta-Interaction ────────────────────────────────────────────────────────

export interface MetaRule {
  id: string;
  trigger: (patterns: MatchedPattern[], input: ConvergenceInput) => boolean;
  generate: (patterns: MatchedPattern[], input: ConvergenceInput, locale: 'en' | 'hi') => MetaInsight | null;
}

export interface MetaInsight {
  ruleId: string;
  text: { en: string; hi: string };
  severity: FlagSeverity;
}

// ─── Output ──────────────────────────────────────────────────────────────────

export interface ExecutiveInsight {
  theme: string;
  themeIcon: PatternTheme;
  summary: { en: string; hi: string };
  laypersonNote: { en: string; hi: string };
  temporalFrame: TemporalFrame;
  matchCount: string;                      // "3 of 3 signals"
  relatedPatterns: string[];
  expandedDetail: { en: string; hi: string };
  advice: { en: string; hi: string };
}

export interface UrgentFlag {
  severity: FlagSeverity;
  icon: FlagIcon;
  message: { en: string; hi: string };
  expiresAt: string;
  relatedPatterns: string[];
}

export interface TransitInsight {
  planetId: number;
  transitSign: number;
  houseFromMoon: number;
  isRetrograde: boolean;
  ashtakavargaBindus: number;
  effect: { en: string; hi: string };
}

export interface AshtakHighlight {
  planetId: number;
  sign: number;
  bindus: number;
  text: { en: string; hi: string };
}

export interface ConvergenceResult {
  version: string;
  computedAt: string;

  executive: {
    activation: number;                    // 1-10
    favorability: number;                  // -5 to +5
    tone: Tone;
    insights: ExecutiveInsight[];           // top 3-5
    urgentFlags: UrgentFlag[];             // max 3
    metaInsights: MetaInsight[];
  };

  patterns: MatchedPattern[];              // all matched, sorted by score
  sectionMarkers: Partial<Record<TippanniSection, string[]>>;

  transitOverlay: {
    snapshot: TransitInsight[];
    retroStatus: { planetId: number; effect: { en: string; hi: string } }[];
    combustStatus: { planetId: number; effect: { en: string; hi: string } }[];
    ashtakavargaHighlights: AshtakHighlight[];
  };
}

// ─── Pattern version hash ────────────────────────────────────────────────────

export const CONVERGENCE_VERSION = '1.0.0'; // bump when patterns change
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep convergence`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/tippanni/convergence/types.ts
git commit -m "feat(convergence): add types and interfaces for convergence synthesis engine"
```

---

### Task 2: Utility Functions

**Files:**
- Create: `src/lib/tippanni/convergence/utils.ts`
- Test: `src/lib/tippanni/convergence/__tests__/utils.test.ts`

- [ ] **Step 1: Write the utility tests**

```typescript
// src/lib/tippanni/convergence/__tests__/utils.test.ts

import { describe, it, expect } from 'vitest';
import {
  isPlanetStrong,
  isHouseAfflicted,
  getHouseFromMoon,
  getPlanetWeight,
} from '../utils';
import type { ConvergenceInput } from '../types';

// Minimal chart fixture — Mars strong in 10th house
const makeMinimalInput = (overrides?: Partial<ConvergenceInput>): ConvergenceInput => ({
  ascendant: 1, // Aries
  moonSign: 4,  // Cancer
  planets: [
    { id: 0, house: 1, sign: 1, isRetrograde: false, isCombust: false, isExalted: true, isDebilitated: false, isOwnSign: false, shadbala: 1.5 },
    { id: 1, house: 4, sign: 4, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: true, shadbala: 1.2 },
    { id: 2, house: 10, sign: 10, isRetrograde: false, isCombust: false, isExalted: true, isDebilitated: false, isOwnSign: false, shadbala: 1.8 },
    { id: 3, house: 2, sign: 2, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 0.9 },
    { id: 4, house: 5, sign: 5, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.3 },
    { id: 5, house: 7, sign: 7, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.1 },
    { id: 6, house: 8, sign: 8, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 0.7 },
    { id: 7, house: 6, sign: 6, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 0.5 },
    { id: 8, house: 12, sign: 12, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 0.4 },
  ],
  houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: i + 1, lordId: [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4][i] })),
  dashaLord: 7, // Rahu
  antarLord: 2, // Mars
  yogaIds: ['gajakesari'],
  doshaIds: ['manglik'],
  transits: [
    { planetId: 6, sign: 7, isRetrograde: false }, // Saturn in Libra
  ],
  ashtakavargaSAV: [28, 30, 25, 32, 27, 29, 31, 26, 33, 24, 28, 30],
  ashtakavargaBPI: [],
  relationships: {
    houseRulers: { 1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3, 7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4 },
    planetHouses: { 0: 1, 1: 4, 2: 10, 3: 2, 4: 5, 5: 7, 6: 8, 7: 6, 8: 12 },
    planetSigns: { 0: 1, 1: 4, 2: 10, 3: 2, 4: 5, 5: 7, 6: 8, 7: 6, 8: 12 },
    transitHouses: { 6: 4 }, // Saturn transiting 4th from Moon (Cancer)
    dashaLord: 7,
    antarLord: 2,
  },
  dashaTransitionWithin6Months: false,
  navamshaConfirmations: {},
  ...overrides,
});

describe('isPlanetStrong', () => {
  it('returns true for exalted planet with high shadbala not in dusthana', () => {
    const input = makeMinimalInput();
    expect(isPlanetStrong(0, input)).toBe(true); // Sun exalted in 1st
  });

  it('returns false for debilitated planet', () => {
    const input = makeMinimalInput();
    input.planets[3] = { ...input.planets[3], isDebilitated: true };
    expect(isPlanetStrong(3, input)).toBe(false);
  });

  it('returns false for combust planet', () => {
    const input = makeMinimalInput();
    input.planets[3] = { ...input.planets[3], isCombust: true };
    expect(isPlanetStrong(3, input)).toBe(false);
  });

  it('returns false for planet in dusthana (6/8/12) with low shadbala', () => {
    const input = makeMinimalInput();
    // Saturn in 8th with low shadbala
    expect(isPlanetStrong(6, input)).toBe(false);
  });
});

describe('isHouseAfflicted', () => {
  it('returns true when malefic occupies the house', () => {
    const input = makeMinimalInput();
    // Rahu (7) in house 6 — but testing house 6 with malefic
    expect(isHouseAfflicted(6, input)).toBe(true);
  });

  it('returns false when only benefics occupy the house', () => {
    const input = makeMinimalInput();
    // House 5 has Jupiter (benefic)
    expect(isHouseAfflicted(5, input)).toBe(false);
  });
});

describe('getHouseFromMoon', () => {
  it('computes correct house distance', () => {
    expect(getHouseFromMoon(4, 4)).toBe(1);  // same sign = 1st house
    expect(getHouseFromMoon(4, 7)).toBe(4);  // Cancer to Libra = 4th
    expect(getHouseFromMoon(4, 1)).toBe(10); // Cancer to Aries = 10th
  });
});

describe('getPlanetWeight', () => {
  it('returns 1.5 for natural malefics', () => {
    expect(getPlanetWeight(2)).toBe(1.5); // Mars
    expect(getPlanetWeight(6)).toBe(1.5); // Saturn
    expect(getPlanetWeight(7)).toBe(1.5); // Rahu
  });

  it('returns 1.0 for natural benefics', () => {
    expect(getPlanetWeight(4)).toBe(1.0); // Jupiter
    expect(getPlanetWeight(5)).toBe(1.0); // Venus
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/tippanni/convergence/__tests__/utils.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the utilities**

```typescript
// src/lib/tippanni/convergence/utils.ts

import { isMalefic, isBenefic } from '@/lib/tippanni/utils';
import type { ConvergenceInput, PlanetFilter } from './types';

/**
 * A planet is "strong" if it is:
 * - not debilitated
 * - not combust
 * - ShadBala >= 1.0 (above median)
 * - not in a dusthana house (6, 8, 12)
 */
export function isPlanetStrong(planetId: number, input: ConvergenceInput): boolean {
  const p = input.planets.find(pl => pl.id === planetId);
  if (!p) return false;
  if (p.isDebilitated || p.isCombust) return false;
  if (p.shadbala < 1.0) return false;
  if ([6, 8, 12].includes(p.house)) return false;
  return true;
}

/**
 * A house is "afflicted" if:
 * - a natural malefic occupies it, OR
 * - the house lord is debilitated or combust
 */
export function isHouseAfflicted(house: number, input: ConvergenceInput): boolean {
  // Check for malefic occupant
  const occupants = input.planets.filter(p => p.house === house);
  if (occupants.some(p => isMalefic(p.id))) return true;

  // Check if lord is weak
  const lordId = input.relationships.houseRulers[house];
  if (lordId !== undefined) {
    const lord = input.planets.find(p => p.id === lordId);
    if (lord && (lord.isDebilitated || lord.isCombust)) return true;
  }

  return false;
}

/**
 * Compute house position from Moon sign.
 * If Moon is in Cancer (4) and planet is in Libra (7), house = 4th from Moon.
 */
export function getHouseFromMoon(moonSign: number, transitSign: number): number {
  return ((transitSign - moonSign + 12) % 12) + 1;
}

/**
 * Weight multiplier for planets in pattern scoring.
 * Natural malefics get 1.5x (their effects are stronger).
 * Natural benefics get 1.0x.
 */
export function getPlanetWeight(planetId: number): number {
  return isMalefic(planetId) ? 1.5 : 1.0;
}

/**
 * Check if a planet filter matches a specific planet.
 */
export function matchesPlanetFilter(filter: PlanetFilter, planetId: number): boolean {
  if (typeof filter === 'number') return filter === planetId;
  if (filter === 'malefic') return isMalefic(planetId);
  if (filter === 'benefic') return isBenefic(planetId);
  return true; // 'any'
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/tippanni/convergence/__tests__/utils.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/tippanni/convergence/utils.ts src/lib/tippanni/convergence/__tests__/utils.test.ts
git commit -m "feat(convergence): add utility functions — isPlanetStrong, isHouseAfflicted, scoring weights"
```

---

### Task 3: Relationship Map Builder

**Files:**
- Create: `src/lib/tippanni/convergence/relationship-map.ts`
- Test: `src/lib/tippanni/convergence/__tests__/relationship-map.test.ts`

- [ ] **Step 1: Write the test**

```typescript
// src/lib/tippanni/convergence/__tests__/relationship-map.test.ts

import { describe, it, expect } from 'vitest';
import { buildConvergenceInput } from '../relationship-map';
import type { KundaliData } from '@/types/kundali';

// Minimal KundaliData fixture
const mockKundali: Partial<KundaliData> = {
  ascendant: { degree: 15, sign: 1, signName: { en: 'Aries', hi: 'मेष', sa: 'मेषः' } },
  planets: [
    { planet: { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' } }, house: 10, sign: 10, isRetrograde: false, isCombust: false, isExalted: true, isDebilitated: false, isOwnSign: false, longitude: 10, latitude: 0, speed: 1, signName: { en: 'Capricorn', hi: 'मकर', sa: 'मकरः' }, nakshatra: { id: 1, name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' }, ruler: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' } }, pada: 1, degree: '10°00\'00"' },
    { planet: { id: 1, name: { en: 'Moon', hi: 'चन्द्रमा', sa: 'चन्द्रः' } }, house: 4, sign: 4, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: true, longitude: 100, latitude: 0, speed: 13, signName: { en: 'Cancer', hi: 'कर्क', sa: 'कर्कः' }, nakshatra: { id: 8, name: { en: 'Pushya', hi: 'पुष्य', sa: 'पुष्यम्' }, ruler: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' } }, pada: 1, degree: '10°00\'00"' },
  ] as any[],
  houses: [
    { house: 1, degree: 0, sign: 1, signName: { en: 'Aries', hi: 'मेष', sa: 'मेषः' }, lord: 'Mars', lordName: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' } },
    { house: 4, degree: 90, sign: 4, signName: { en: 'Cancer', hi: 'कर्क', sa: 'कर्कः' }, lord: 'Moon', lordName: { en: 'Moon', hi: 'चन्द्रमा', sa: 'चन्द्रः' } },
    { house: 10, degree: 270, sign: 10, signName: { en: 'Capricorn', hi: 'मकर', sa: 'मकरः' }, lord: 'Saturn', lordName: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' } },
  ] as any[],
  dashas: [
    { planet: 'Rahu', planetName: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, startDate: '2020-01-01', endDate: '2038-01-01', level: 'maha' as const },
  ],
  shadbala: [
    { planet: 'Sun', value: 1.5 },
    { planet: 'Moon', value: 1.2 },
  ] as any[],
  ashtakavarga: {
    savTable: [28, 30, 25, 32, 27, 29, 31, 26, 33, 24, 28, 30],
    bpiTable: [],
    planetNames: [],
  },
};

describe('buildConvergenceInput', () => {
  it('builds a valid ConvergenceInput from KundaliData', () => {
    const result = buildConvergenceInput(mockKundali as KundaliData);
    expect(result.ascendant).toBe(1);
    expect(result.moonSign).toBe(4);
    expect(result.dashaLord).toBe(7); // Rahu = id 7
    expect(result.relationships.planetHouses[0]).toBe(10); // Sun in 10th
    expect(result.ashtakavargaSAV).toHaveLength(12);
  });

  it('correctly identifies Moon sign from planets array', () => {
    const result = buildConvergenceInput(mockKundali as KundaliData);
    expect(result.moonSign).toBe(4); // Cancer
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/tippanni/convergence/__tests__/relationship-map.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the relationship map builder**

```typescript
// src/lib/tippanni/convergence/relationship-map.ts

import type { KundaliData } from '@/types/kundali';
import { getSignLord } from '@/lib/tippanni/utils';
import { dateToJD, getPlanetaryPositions, toSidereal, getRashiNumber } from '@/lib/ephem/astronomical';
import type { ConvergenceInput, RelationshipMap } from './types';
import { getHouseFromMoon } from './utils';

// Map planet name strings to IDs
const PLANET_NAME_TO_ID: Record<string, number> = {
  'Sun': 0, 'Moon': 1, 'Mars': 2, 'Mercury': 3, 'Jupiter': 4,
  'Venus': 5, 'Saturn': 6, 'Rahu': 7, 'Ketu': 8,
};

/**
 * Build a ConvergenceInput from a KundaliData object.
 * This pre-joins all relationships for O(1) pattern lookups.
 */
export function buildConvergenceInput(kundali: KundaliData): ConvergenceInput {
  const ascSign = kundali.ascendant.sign;
  const moonPlanet = kundali.planets.find(p => p.planet.id === 1);
  const moonSign = moonPlanet?.sign || 1;

  // Build planet lookup arrays
  const planets = kundali.planets.map(p => ({
    id: p.planet.id,
    house: p.house,
    sign: p.sign,
    isRetrograde: p.isRetrograde,
    isCombust: p.isCombust,
    isExalted: p.isExalted,
    isDebilitated: p.isDebilitated,
    isOwnSign: p.isOwnSign,
    shadbala: kundali.shadbala?.find(s =>
      s.planet === p.planet.name?.en || s.planet === p.planet.id?.toString()
    )?.value ?? 1.0,
  }));

  // Build house data
  const houses = (kundali.houses || []).map(h => ({
    house: h.house,
    sign: h.sign,
    lordId: PLANET_NAME_TO_ID[h.lord] ?? getSignLord(h.sign),
  }));

  // Ensure all 12 houses exist
  const houseMap: { house: number; sign: number; lordId: number }[] = [];
  for (let i = 1; i <= 12; i++) {
    const existing = houses.find(h => h.house === i);
    if (existing) {
      houseMap.push(existing);
    } else {
      const sign = ((ascSign - 1 + i - 1) % 12) + 1;
      houseMap.push({ house: i, sign, lordId: getSignLord(sign) });
    }
  }

  // Find current dasha lord
  const now = new Date();
  const currentMaha = kundali.dashas?.find(d =>
    d.level === 'maha' && new Date(d.startDate) <= now && new Date(d.endDate) >= now
  );
  const dashaLordId = currentMaha ? (PLANET_NAME_TO_ID[currentMaha.planet] ?? 0) : 0;

  // Find current antardasha lord
  const currentAntar = currentMaha?.subPeriods?.find(d =>
    new Date(d.startDate) <= now && new Date(d.endDate) >= now
  );
  const antarLordId = currentAntar ? (PLANET_NAME_TO_ID[currentAntar.planet] ?? 0) : 0;

  // Check dasha transition within 6 months
  const sixMonths = new Date();
  sixMonths.setMonth(sixMonths.getMonth() + 6);
  const dashaTransitionWithin6Months = currentMaha
    ? new Date(currentMaha.endDate) <= sixMonths
    : false;

  // Compute current transits
  const jd = dateToJD(now.getFullYear(), now.getMonth() + 1, now.getDate(), 12);
  const transitPositions = getPlanetaryPositions(jd);
  const transits = transitPositions.map(tp => {
    const sidLong = toSidereal(tp.longitude, jd);
    return {
      planetId: tp.id,
      sign: getRashiNumber(sidLong),
      isRetrograde: tp.isRetrograde,
    };
  });

  // Build relationship map
  const houseRulers: Record<number, number> = {};
  for (const h of houseMap) {
    houseRulers[h.house] = h.lordId;
  }

  const planetHouses: Record<number, number> = {};
  const planetSigns: Record<number, number> = {};
  for (const p of planets) {
    planetHouses[p.id] = p.house;
    planetSigns[p.id] = p.sign;
  }

  const transitHouses: Record<number, number> = {};
  for (const t of transits) {
    transitHouses[t.planetId] = getHouseFromMoon(moonSign, t.sign);
  }

  // Collect yoga and dosha IDs
  const yogaIds = (kundali.yogasComplete || [])
    .filter(y => y.present !== false)
    .map(y => y.id || y.name?.en?.toLowerCase().replace(/\s+/g, '-') || '');

  const doshaIds: string[] = [];
  // Detect from existing dosha data if available
  if ((kundali as any).manglikDosha?.isPresent) doshaIds.push('manglik');
  if ((kundali as any).kaalSarpDosha?.isPresent) doshaIds.push('kaal-sarp');
  if ((kundali as any).pitriDosha?.isPresent) doshaIds.push('pitri');

  // Ashtakavarga
  const ashtakavargaSAV = kundali.ashtakavarga?.savTable || new Array(12).fill(28);
  const ashtakavargaBPI = kundali.ashtakavarga?.bpiTable || [];

  // Retrograde/combust arrays
  const retrogrades = new Array(9).fill(false);
  const combustions = new Array(9).fill(false);
  for (const p of planets) {
    if (p.id < 9) {
      retrogrades[p.id] = p.isRetrograde;
      combustions[p.id] = p.isCombust;
    }
  }

  const relationships: RelationshipMap = {
    houseRulers,
    planetHouses,
    planetSigns,
    transitHouses,
    dashaLord: dashaLordId,
    antarLord: antarLordId,
  };

  return {
    ascendant: ascSign,
    moonSign,
    planets,
    houses: houseMap,
    dashaLord: dashaLordId,
    antarLord: antarLordId,
    yogaIds,
    doshaIds,
    transits,
    ashtakavargaSAV,
    ashtakavargaBPI,
    relationships,
    dashaTransitionWithin6Months,
    navamshaConfirmations: {},
  };
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/tippanni/convergence/__tests__/relationship-map.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/tippanni/convergence/relationship-map.ts src/lib/tippanni/convergence/__tests__/relationship-map.test.ts
git commit -m "feat(convergence): add relationship map builder — pre-joins chart data for O(1) pattern lookups"
```

---

### Task 4: Condition Evaluator

**Files:**
- Create: `src/lib/tippanni/convergence/evaluator.ts`
- Test: `src/lib/tippanni/convergence/__tests__/evaluator.test.ts`

- [ ] **Step 1: Write the tests**

```typescript
// src/lib/tippanni/convergence/__tests__/evaluator.test.ts

import { describe, it, expect } from 'vitest';
import { evaluateCondition } from '../evaluator';
import type { ConvergenceInput, PatternCondition } from '../types';

// Reuse the minimal input factory from utils.test.ts
function makeInput(overrides?: Partial<ConvergenceInput>): ConvergenceInput {
  return {
    ascendant: 1,
    moonSign: 4,
    planets: [
      { id: 0, house: 1, sign: 1, isRetrograde: false, isCombust: false, isExalted: true, isDebilitated: false, isOwnSign: false, shadbala: 1.5 },
      { id: 2, house: 7, sign: 7, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.3 },
      { id: 6, house: 10, sign: 10, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 0.7 },
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: ((i) % 12) + 1, lordId: [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4][i] })),
    dashaLord: 7,
    antarLord: 2,
    yogaIds: ['gajakesari'],
    doshaIds: ['manglik'],
    transits: [
      { planetId: 6, sign: 7, isRetrograde: false },
    ],
    ashtakavargaSAV: [28, 30, 25, 32, 27, 29, 31, 26, 33, 24, 28, 30],
    ashtakavargaBPI: [],
    relationships: {
      houseRulers: { 1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3, 7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4 },
      planetHouses: { 0: 1, 2: 7, 6: 10 },
      planetSigns: { 0: 1, 2: 7, 6: 10 },
      transitHouses: { 6: 4 },
      dashaLord: 7,
      antarLord: 2,
    },
    dashaTransitionWithin6Months: false,
    navamshaConfirmations: {},
    ...overrides,
  };
}

describe('evaluateCondition', () => {
  it('natal: planet-in-house — Mars in 7th', () => {
    const input = makeInput();
    const cond: PatternCondition = { type: 'natal', check: 'planet-in-house', planet: 2, house: 7 };
    expect(evaluateCondition(cond, input)).toBe(true);
  });

  it('natal: planet-in-house — malefic in 7th', () => {
    const input = makeInput();
    const cond: PatternCondition = { type: 'natal', check: 'planet-in-house', planet: 'malefic', house: 7 };
    expect(evaluateCondition(cond, input)).toBe(true); // Mars is malefic
  });

  it('natal: planet-in-house — benefic in 7th (false)', () => {
    const input = makeInput();
    const cond: PatternCondition = { type: 'natal', check: 'planet-in-house', planet: 'benefic', house: 7 };
    expect(evaluateCondition(cond, input)).toBe(false);
  });

  it('transit: planet-in-house-from-moon — Saturn in 4th from Moon', () => {
    const input = makeInput();
    const cond: PatternCondition = { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 4 };
    expect(evaluateCondition(cond, input)).toBe(true);
  });

  it('dasha: lord-rules-or-occupies — Rahu dasha lord rules/occupies house', () => {
    const input = makeInput();
    // Rahu (7) doesn't own any house in traditional Jyotish, but occupies house 6 in our fixture
    // We need to adjust: dasha lord "rules or occupies" checks both
    const cond: PatternCondition = { type: 'dasha', check: 'lord-rules-or-occupies', house: 7 };
    // Rahu doesn't rule 7th (Venus does) and doesn't occupy 7th in our input
    expect(evaluateCondition(cond, input)).toBe(false);
  });

  it('dasha: lord-is-planet — dasha lord is Rahu', () => {
    const input = makeInput();
    const cond: PatternCondition = { type: 'dasha', check: 'lord-is-planet', planet: 7 };
    expect(evaluateCondition(cond, input)).toBe(true);
  });

  it('natal: yoga-present', () => {
    const input = makeInput();
    const cond: PatternCondition = { type: 'natal', check: 'yoga-present', yogaId: 'gajakesari' };
    expect(evaluateCondition(cond, input)).toBe(true);
  });

  it('natal: yoga-present (absent)', () => {
    const input = makeInput();
    const cond: PatternCondition = { type: 'natal', check: 'yoga-present', yogaId: 'raja-yoga' };
    expect(evaluateCondition(cond, input)).toBe(false);
  });

  it('retro: planet-retrograde', () => {
    const input = makeInput();
    input.planets[1] = { ...input.planets[1], isRetrograde: true }; // Mars retro
    const cond: PatternCondition = { type: 'retro', check: 'planet-retrograde', planet: 2 };
    expect(evaluateCondition(cond, input)).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/tippanni/convergence/__tests__/evaluator.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement the condition evaluator**

```typescript
// src/lib/tippanni/convergence/evaluator.ts

import type { PatternCondition, ConvergenceInput } from './types';
import { isPlanetStrong, isHouseAfflicted, matchesPlanetFilter } from './utils';

/**
 * Evaluate a single pattern condition against the chart data.
 * Returns true if the condition is met.
 */
export function evaluateCondition(cond: PatternCondition, input: ConvergenceInput): boolean {
  switch (cond.type) {
    case 'natal':
      return evaluateNatal(cond, input);
    case 'transit':
      return evaluateTransit(cond, input);
    case 'dasha':
      return evaluateDasha(cond, input);
    case 'retro':
      return evaluateRetro(cond, input);
    case 'combust':
      return evaluateCombust(cond, input);
    default:
      return false;
  }
}

function evaluateNatal(
  cond: Extract<PatternCondition, { type: 'natal' }>,
  input: ConvergenceInput
): boolean {
  switch (cond.check) {
    case 'planet-in-house': {
      return input.planets.some(
        p => matchesPlanetFilter(cond.planet, p.id) && p.house === cond.house
      );
    }
    case 'lord-strong': {
      const lordId = input.relationships.houseRulers[cond.house];
      return lordId !== undefined && isPlanetStrong(lordId, input);
    }
    case 'lord-afflicted': {
      return isHouseAfflicted(cond.house, input);
    }
    case 'yoga-present': {
      return input.yogaIds.includes(cond.yogaId);
    }
    case 'dosha-present': {
      return input.doshaIds.includes(cond.doshaId);
    }
    case 'benefic-aspect-to-house': {
      // Simplified: check if any benefic planet is in a kendra (1,4,7,10) from the house
      // This is an approximation — full aspect calculation is complex
      const houseSign = input.houses.find(h => h.house === cond.house)?.sign || cond.house;
      return input.planets.some(p => {
        if (!matchesPlanetFilter('benefic', p.id)) return false;
        const dist = ((p.sign - houseSign + 12) % 12);
        return [0, 3, 6, 9].includes(dist); // kendra aspects (simplified)
      });
    }
    default:
      return false;
  }
}

function evaluateTransit(
  cond: Extract<PatternCondition, { type: 'transit' }>,
  input: ConvergenceInput
): boolean {
  if (cond.check === 'planet-in-house-from-moon') {
    const transitHouse = input.relationships.transitHouses[cond.planet];
    return transitHouse === cond.house;
  }
  return false;
}

function evaluateDasha(
  cond: Extract<PatternCondition, { type: 'dasha' }>,
  input: ConvergenceInput
): boolean {
  switch (cond.check) {
    case 'lord-rules-or-occupies': {
      const dashaLord = input.dashaLord;
      // Check if dasha lord rules this house
      const rulerOfHouse = input.relationships.houseRulers[cond.house];
      if (rulerOfHouse === dashaLord) return true;
      // Check if dasha lord occupies this house
      const lordHouse = input.relationships.planetHouses[dashaLord];
      if (lordHouse === cond.house) return true;
      // Also check antardasha lord
      const antarLord = input.antarLord;
      if (input.relationships.houseRulers[cond.house] === antarLord) return true;
      if (input.relationships.planetHouses[antarLord] === cond.house) return true;
      return false;
    }
    case 'lord-is-planet': {
      return input.dashaLord === cond.planet || input.antarLord === cond.planet;
    }
    default:
      return false;
  }
}

function evaluateRetro(
  cond: Extract<PatternCondition, { type: 'retro' }>,
  input: ConvergenceInput
): boolean {
  if (cond.check === 'planet-retrograde') {
    const p = input.planets.find(pl => pl.id === cond.planet);
    return p?.isRetrograde === true;
  }
  return false;
}

function evaluateCombust(
  cond: Extract<PatternCondition, { type: 'combust' }>,
  input: ConvergenceInput
): boolean {
  if (cond.check === 'planet-combust') {
    const p = input.planets.find(pl => pl.id === cond.planet);
    return p?.isCombust === true;
  }
  return false;
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/tippanni/convergence/__tests__/evaluator.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/tippanni/convergence/evaluator.ts src/lib/tippanni/convergence/__tests__/evaluator.test.ts
git commit -m "feat(convergence): add condition evaluator — natal, transit, dasha, retro, combust checks"
```

---

### Task 5: Scoring Engine

**Files:**
- Create: `src/lib/tippanni/convergence/scoring.ts`
- Test: `src/lib/tippanni/convergence/__tests__/scoring.test.ts`

- [ ] **Step 1: Write the tests**

```typescript
// src/lib/tippanni/convergence/__tests__/scoring.test.ts

import { describe, it, expect } from 'vitest';
import { scorePattern } from '../scoring';
import type { ConvergencePattern, ConvergenceInput } from '../types';

const mockPattern: ConvergencePattern = {
  id: 'test-pattern',
  theme: 'career',
  significance: 4,
  conditions: [
    { type: 'natal', check: 'planet-in-house', planet: 2, house: 10 },
    { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 10 },
    { type: 'dasha', check: 'lord-rules-or-occupies', house: 10 },
  ],
  text: { full: { en: 'Full text', hi: 'पूर्ण' }, mild: { en: 'Mild text', hi: 'हल्का' } },
  advice: { en: 'Advice', hi: 'सलाह' },
  laypersonNote: { en: 'Note', hi: 'नोट' },
  relatedSections: [],
};

// Input where all 3 conditions match
const fullMatchInput: ConvergenceInput = {
  ascendant: 1, moonSign: 1,
  planets: [
    { id: 2, house: 10, sign: 10, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.3 },
  ],
  houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: i + 1, lordId: [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4][i] })),
  dashaLord: 6, // Saturn rules 10th
  antarLord: 0,
  yogaIds: [], doshaIds: [],
  transits: [{ planetId: 4, sign: 1, isRetrograde: false }], // Jupiter transit in sign 1 = house 1 from Moon(1)... need house 10
  ashtakavargaSAV: [28, 30, 25, 32, 27, 29, 31, 26, 33, 24, 28, 30],
  ashtakavargaBPI: [],
  relationships: {
    houseRulers: { 1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3, 7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4 },
    planetHouses: { 2: 10 },
    planetSigns: { 2: 10 },
    transitHouses: { 4: 10 }, // Jupiter transiting 10th from Moon
    dashaLord: 6,
    antarLord: 0,
  },
  dashaTransitionWithin6Months: false,
  navamshaConfirmations: {},
};

describe('scorePattern', () => {
  it('returns full match with high score when all conditions met', () => {
    const result = scorePattern(mockPattern, fullMatchInput);
    expect(result).not.toBeNull();
    expect(result!.isFullMatch).toBe(true);
    expect(result!.matchCount).toBe(3);
    expect(result!.totalConditions).toBe(3);
    expect(result!.finalScore).toBeGreaterThan(0);
    expect(result!.text.en).toBe('Full text');
  });

  it('returns null when fewer than 2 conditions match', () => {
    const input = { ...fullMatchInput };
    input.relationships = { ...input.relationships, transitHouses: {}, planetHouses: {} };
    input.planets = [];
    const result = scorePattern(mockPattern, input);
    expect(result).toBeNull();
  });

  it('returns mild match when 2 of 3 conditions met', () => {
    const input = { ...fullMatchInput };
    input.relationships = { ...input.relationships, transitHouses: {} }; // break transit condition
    input.planets = [{ id: 2, house: 10, sign: 10, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.3 }];
    const result = scorePattern(mockPattern, input);
    expect(result).not.toBeNull();
    expect(result!.isFullMatch).toBe(false);
    expect(result!.matchCount).toBe(2);
    expect(result!.text.en).toBe('Mild text');
  });

  it('full match scores higher than partial match', () => {
    const fullResult = scorePattern(mockPattern, fullMatchInput);

    const partialInput = { ...fullMatchInput };
    partialInput.relationships = { ...partialInput.relationships, transitHouses: {} };
    partialInput.planets = [{ id: 2, house: 10, sign: 10, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.3 }];
    const partialResult = scorePattern(mockPattern, partialInput);

    expect(fullResult!.finalScore).toBeGreaterThan(partialResult!.finalScore);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/tippanni/convergence/__tests__/scoring.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement the scoring engine**

```typescript
// src/lib/tippanni/convergence/scoring.ts

import type { ConvergencePattern, ConvergenceInput, MatchedPattern, PatternCondition } from './types';
import { evaluateCondition } from './evaluator';
import { getPlanetWeight } from './utils';

/**
 * Score a single pattern against the input.
 * Returns a MatchedPattern if >= 2 conditions match, null otherwise.
 *
 * finalScore = baseSignificance * conditionWeightSum * matchRatio * ashtakavargaModifier
 */
export function scorePattern(
  pattern: ConvergencePattern,
  input: ConvergenceInput
): MatchedPattern | null {
  const results = pattern.conditions.map(cond => ({
    condition: cond,
    matched: evaluateCondition(cond, input),
  }));

  const matchCount = results.filter(r => r.matched).length;
  const totalConditions = pattern.conditions.length;

  // Minimum 2 conditions must match
  if (matchCount < 2) return null;

  const isFullMatch = matchCount === totalConditions;
  const matchRatio = isFullMatch ? 1.0 : 0.6;

  // Compute condition weight sum (malefic planets get 1.5x)
  const conditionWeightSum = results
    .filter(r => r.matched)
    .reduce((sum, r) => {
      const weight = getConditionWeight(r.condition, input);
      return sum + weight;
    }, 0) / matchCount; // normalize by match count

  // Ashtakavarga modifier for transit conditions
  const ashtakavargaModifier = getAshtakavargaModifier(pattern, input, results);

  const finalScore = pattern.significance * conditionWeightSum * matchRatio * ashtakavargaModifier;

  return {
    patternId: pattern.id,
    theme: pattern.theme,
    matchCount,
    totalConditions,
    isFullMatch,
    finalScore,
    text: isFullMatch ? pattern.text.full : pattern.text.mild,
    advice: pattern.advice,
    laypersonNote: pattern.laypersonNote,
    relatedSections: pattern.relatedSections,
  };
}

function getConditionWeight(cond: PatternCondition, input: ConvergenceInput): number {
  // Extract planet ID from condition if applicable
  if (cond.type === 'natal' && cond.check === 'planet-in-house' && typeof cond.planet === 'number') {
    return cond.weight ?? getPlanetWeight(cond.planet);
  }
  if (cond.type === 'transit' && cond.check === 'planet-in-house-from-moon') {
    return cond.weight ?? getPlanetWeight(cond.planet);
  }
  if (cond.type === 'dasha') {
    return cond.weight ?? getPlanetWeight(input.dashaLord);
  }
  return cond.weight ?? 1.0;
}

function getAshtakavargaModifier(
  pattern: ConvergencePattern,
  input: ConvergenceInput,
  results: { condition: PatternCondition; matched: boolean }[]
): number {
  // Find transit conditions that matched
  const transitMatches = results.filter(
    r => r.matched && r.condition.type === 'transit' && r.condition.check === 'planet-in-house-from-moon'
  );

  if (transitMatches.length === 0) return 1.0;

  let modifier = 1.0;
  for (const tm of transitMatches) {
    const cond = tm.condition as Extract<PatternCondition, { type: 'transit' }>;
    if (cond.check === 'planet-in-house-from-moon') {
      const transit = input.transits.find(t => t.planetId === cond.planet);
      if (transit) {
        const bindus = input.ashtakavargaSAV[transit.sign - 1] ?? 28;
        if (bindus >= 30) modifier *= 1.3;      // strong transit
        else if (bindus <= 22) modifier *= 0.7;  // weak transit
      }
    }
  }

  return modifier;
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/tippanni/convergence/__tests__/scoring.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/tippanni/convergence/scoring.ts src/lib/tippanni/convergence/__tests__/scoring.test.ts
git commit -m "feat(convergence): add scoring engine — weighted pattern matching with Ashtakavarga modifiers"
```

---

### Task 6: First 15 Career & Relationship Patterns (English Only)

**Files:**
- Create: `src/lib/tippanni/convergence/patterns/career.ts`
- Create: `src/lib/tippanni/convergence/patterns/relationship.ts`
- Create: `src/lib/tippanni/convergence/patterns/index.ts`

- [ ] **Step 1: Create career patterns**

```typescript
// src/lib/tippanni/convergence/patterns/career.ts

import type { ConvergencePattern } from '../types';
import { TippanniSection } from '../types';

export const CAREER_PATTERNS: ConvergencePattern[] = [
  {
    id: 'career-peak',
    theme: 'career',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 10 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 10 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 10 },
    ],
    text: {
      full: {
        en: 'A rare triple convergence on your 10th house of career. Your 10th lord is natally strong, Jupiter — the great benefic — is transiting your career house, and your current dasha period activates this same area. This is a career peak window. Authority, recognition, and professional advancement are all aligned in your favor. Bold moves made now carry exceptional momentum.',
        hi: 'आपके दशम भाव (करियर) पर एक दुर्लभ तिहरा संयोग। आपका दशमेश जन्म से बलवान है, बृहस्पति — महान शुभ ग्रह — आपके करियर भाव में गोचर कर रहा है, और वर्तमान दशा इसी क्षेत्र को सक्रिय करती है। यह करियर शिखर की खिड़की है।',
      },
      mild: {
        en: 'Multiple signals point toward career activation. Your professional house is receiving attention from both dasha and transit — though not all factors align perfectly, this is still a meaningful period for career advancement. Stay alert for opportunities.',
        hi: 'कई संकेत करियर सक्रियता की ओर इशारा करते हैं। आपका पेशेवर भाव दशा और गोचर दोनों से ध्यान प्राप्त कर रहा है। अवसरों के प्रति सतर्क रहें।',
      },
    },
    advice: {
      en: 'Apply for promotions, launch ventures, seek public visibility. This window is time-bound — act decisively while the alignment holds.',
      hi: 'पदोन्नति के लिए आवेदन करें, उद्यम शुरू करें, सार्वजनिक दृश्यता चाहें। यह खिड़की समय-सीमित है — संरेखण के दौरान निर्णायक रूप से कार्य करें।',
    },
    laypersonNote: {
      en: 'When three independent astrological cycles all focus on your career simultaneously, it creates a rare momentum window. Think of it as three green lights turning on at the same time.',
      hi: 'जब तीन स्वतंत्र ज्योतिषीय चक्र एक साथ आपके करियर पर केंद्रित होते हैं, तो यह एक दुर्लभ गति खिड़की बनाता है।',
    },
    relatedSections: [TippanniSection.PlanetInsights, TippanniSection.DashaSynthesis, TippanniSection.LifeAreas],
  },
  {
    id: 'authority-conflict',
    theme: 'career',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 'malefic', house: 10 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 10 },
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 10 },
    ],
    text: {
      full: {
        en: 'A challenging convergence on your career house. A natal malefic already creates friction in your professional life, Saturn\'s transit is adding weight and pressure to this area, and your dasha period is activating the same theme. Power struggles with authority figures, bureaucratic delays, and tests of professional patience are likely. This isn\'t punishment — it\'s Saturn asking if your career is built on solid foundations.',
        hi: 'करियर भाव पर एक चुनौतीपूर्ण संयोग। जन्म से एक पापी ग्रह पेशेवर जीवन में घर्षण पैदा करता है, शनि का गोचर इस क्षेत्र पर भार डाल रहा है, और दशा इसी विषय को सक्रिय कर रही है। यह दंड नहीं — शनि पूछ रहा है कि क्या आपका करियर ठोस नींव पर बना है।',
      },
      mild: {
        en: 'Career pressure is building from multiple directions. Authority figures may be demanding or unsupportive. The current period tests your professional resilience — respond with discipline, not rebellion.',
        hi: 'कई दिशाओं से करियर का दबाव बढ़ रहा है। अधिकारी कठिन या असहायक हो सकते हैं। वर्तमान अवधि पेशेवर लचीलेपन की परीक्षा है।',
      },
    },
    advice: {
      en: 'Don\'t confront authority directly — work within the system. Document everything. Build alliances quietly. This transit passes, but the lessons stick.',
      hi: 'अधिकार का सीधा सामना न करें — व्यवस्था के भीतर कार्य करें। सब कुछ दस्तावेज़ित करें। चुपचाप गठबंधन बनाएँ।',
    },
    laypersonNote: {
      en: 'Multiple planetary pressures on the same career area create a stress-test. It feels heavy, but it\'s building something stronger.',
      hi: 'एक ही करियर क्षेत्र पर कई ग्रहीय दबाव एक तनाव-परीक्षण बनाते हैं।',
    },
    relatedSections: [TippanniSection.PlanetInsights, TippanniSection.DashaSynthesis, TippanniSection.LifeAreas],
  },
  {
    id: 'career-change',
    theme: 'career',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'lord-afflicted', house: 10 },
      { type: 'dasha', check: 'lord-is-planet', planet: 7 }, // Rahu dasha
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 10 },
    ],
    text: {
      full: {
        en: 'A convergence suggesting career transformation. Your 10th house is under natal stress, Rahu\'s dasha brings unconventional ambitions and restless energy, and Saturn\'s transit through your career sector is dismantling outdated structures. This is not a setback — it\'s a forced evolution. The career you\'re leaving behind no longer fits who you\'re becoming.',
        hi: 'करियर परिवर्तन का संकेत देने वाला संयोग। दशम भाव जन्म से तनावग्रस्त है, राहु दशा अपरंपरागत महत्वाकांक्षा लाती है, और शनि का गोचर पुरानी संरचनाओं को तोड़ रहा है। यह पराजय नहीं — यह बाध्य विकास है।',
      },
      mild: {
        en: 'Career dissatisfaction is building. The urge to change direction is strong — but timing matters. Prepare your exit strategy while the current structure still supports you.',
        hi: 'करियर असंतोष बढ़ रहा है। दिशा बदलने की इच्छा प्रबल है — लेकिन समय महत्वपूर्ण है।',
      },
    },
    advice: {
      en: 'Research new directions actively. Upskill in your area of curiosity. Don\'t quit impulsively — let the new path crystallize before abandoning the old one.',
      hi: 'नई दिशाओं पर सक्रिय रूप से शोध करें। जिज्ञासा के क्षेत्र में कौशल बढ़ाएँ। आवेश में न छोड़ें।',
    },
    laypersonNote: {
      en: 'When your chart shows multiple forces pushing you away from your current career, it usually means you\'ve outgrown it — not that you\'ve failed.',
      hi: 'जब कुंडली कई बल वर्तमान करियर से दूर धकेलते दिखाती है, तो आमतौर पर इसका मतलब है कि आपने इसे पार कर लिया है।',
    },
    relatedSections: [TippanniSection.PlanetInsights, TippanniSection.DashaSynthesis, TippanniSection.YearPredictions],
  },
  {
    id: 'public-recognition',
    theme: 'career',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 0, house: 10 }, // Sun in 10th
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 10 }, // Jupiter transit 10th
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 10 },
    ],
    text: {
      full: {
        en: 'A powerful convergence for public recognition. Your natal Sun in the 10th house gives you natural authority and leadership charisma. Jupiter\'s transit is now amplifying this, and your dasha period activates career themes. This is a window for awards, public honors, media attention, or promotion to a visible leadership role. Your light is meant to be seen.',
        hi: 'सार्वजनिक मान्यता के लिए शक्तिशाली संयोग। दशम भाव में जन्मस्थ सूर्य स्वाभाविक अधिकार देता है। बृहस्पति का गोचर इसे बढ़ा रहा है, और दशा करियर विषय सक्रिय करती है। पुरस्कार, सार्वजनिक सम्मान, या नेतृत्व पदोन्नति की खिड़की।',
      },
      mild: {
        en: 'Your natural authority is being activated by favorable transits. Public visibility is increasing — step into the spotlight when opportunities arise.',
        hi: 'आपका स्वाभाविक अधिकार अनुकूल गोचर से सक्रिय हो रहा है। सार्वजनिक दृश्यता बढ़ रही है।',
      },
    },
    advice: {
      en: 'Accept leadership roles offered. Publish, present, be visible. Your reputation is your greatest asset during this window.',
      hi: 'प्रस्तावित नेतृत्व भूमिकाएँ स्वीकार करें। प्रकाशित करें, प्रस्तुत करें, दृश्यमान रहें।',
    },
    laypersonNote: {
      en: 'Your birth chart has natural leadership wiring, and right now the cosmic timing is amplifying it. Step forward.',
      hi: 'आपकी जन्म कुंडली में स्वाभाविक नेतृत्व क्षमता है, और अभी ब्रह्मांडीय समय इसे बढ़ा रहा है।',
    },
    relatedSections: [TippanniSection.PlanetInsights, TippanniSection.LifeAreas],
  },
  {
    id: 'professional-stagnation',
    theme: 'career',
    significance: 3,
    conditions: [
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 10 }, // Saturn in 10th
      { type: 'dasha', check: 'lord-is-planet', planet: 6 }, // Saturn dasha
    ],
    text: {
      full: {
        en: 'Saturn\'s double grip on your career — both through transit and dasha. Professional progress feels glacially slow. Promotions are delayed, recognition is withheld, and the workload increases without reward. This is Saturn\'s signature: delayed, not denied. Every seed of effort planted now will bear fruit when this transit lifts. Patience is not passive — it\'s strategic.',
        hi: 'शनि की दोहरी पकड़ — गोचर और दशा दोनों से। पेशेवर प्रगति बेहद धीमी। पदोन्नति विलंबित, मान्यता रोकी गई। यह शनि का हस्ताक्षर है: विलंबित, इनकार नहीं। अभी बोया हर प्रयास का बीज फल देगा जब यह गोचर हटेगा।',
      },
      mild: {
        en: 'Career momentum is slow under Saturn\'s influence. Focus on building foundations rather than seeking quick wins.',
        hi: 'शनि के प्रभाव में करियर गति धीमी। त्वरित जीत के बजाय नींव बनाने पर ध्यान दें।',
      },
    },
    advice: {
      en: 'Don\'t chase shortcuts — Saturn punishes them. Build skills, document achievements, maintain impeccable discipline. The delayed reward will be substantial.',
      hi: 'शॉर्टकट का पीछा न करें — शनि उन्हें दंडित करता है। कौशल बनाएँ, उपलब्धियाँ दर्ज करें, अनुशासन बनाए रखें।',
    },
    laypersonNote: {
      en: 'Saturn slows things down so you build them properly. It feels frustrating, but the results are lasting.',
      hi: 'शनि चीजों को धीमा करता है ताकि आप उन्हें ठीक से बनाएँ।',
    },
    relatedSections: [TippanniSection.DashaSynthesis, TippanniSection.LifeAreas, TippanniSection.YearPredictions],
  },
];
```

- [ ] **Step 2: Create relationship patterns**

```typescript
// src/lib/tippanni/convergence/patterns/relationship.ts

import type { ConvergencePattern } from '../types';
import { TippanniSection } from '../types';

export const RELATIONSHIP_PATTERNS: ConvergencePattern[] = [
  {
    id: 'marriage-window',
    theme: 'relationship',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'lord-strong', house: 7 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 7 }, // Jupiter transit 7th
      { type: 'dasha', check: 'lord-is-planet', planet: 5 }, // Venus dasha
    ],
    text: {
      full: {
        en: 'A rare marriage alignment. Your 7th lord is natally strong — you have the foundation for lasting partnership. Jupiter\'s transit through your 7th house brings expansion, optimism, and auspicious timing to relationships. Venus dasha activates love, beauty, and the desire for union. If unmarried, this is one of the strongest marriage windows your chart will produce. If married, expect a renewal of love and harmony.',
        hi: 'एक दुर्लभ विवाह संरेखण। सप्तमेश जन्म से बलवान — स्थायी साझेदारी की नींव है। बृहस्पति का गोचर सप्तम भाव में विस्तार और शुभ समय लाता है। शुक्र दशा प्रेम और मिलन की इच्छा सक्रिय करती है। यदि अविवाहित हैं, तो यह सबसे मजबूत विवाह खिड़कियों में से एक है।',
      },
      mild: {
        en: 'Relationship energy is favorable. Partnership opportunities are emerging — whether romantic or professional. Trust the timing.',
        hi: 'संबंध ऊर्जा अनुकूल है। साझेदारी के अवसर उभर रहे हैं — चाहे प्रेम हो या पेशेवर।',
      },
    },
    advice: {
      en: 'If considering marriage, this is an auspicious window. Attend social events, be open to introductions, and consult a Muhurta for ideal timing.',
      hi: 'यदि विवाह पर विचार कर रहे हैं, तो यह शुभ खिड़की है। सामाजिक आयोजनों में जाएँ, परिचय के लिए खुले रहें।',
    },
    laypersonNote: {
      en: 'Three planetary forces are aligning to support partnership — this kind of convergence is rare and traditionally considered highly auspicious for marriage.',
      hi: 'तीन ग्रहीय बल साझेदारी के समर्थन में संरेखित हो रहे हैं — विवाह के लिए अत्यंत शुभ माना जाता है।',
    },
    relatedSections: [TippanniSection.PlanetInsights, TippanniSection.DashaSynthesis, TippanniSection.LifeAreas],
  },
  {
    id: 'relationship-storm',
    theme: 'relationship',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 'malefic', house: 7 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 7 }, // Saturn transit 7th
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 7 },
    ],
    text: {
      full: {
        en: 'A serious convergence on your 7th house of partnerships. A natal malefic already creates inherent tension in relationships, Saturn\'s transit is now testing every partnership with cold scrutiny, and your dasha period is activating this same area. Relationships that lack genuine commitment or honesty will face existential pressure. This is not random — your chart is asking you to confront the truth about your partnerships.',
        hi: 'साझेदारी के सप्तम भाव पर गंभीर संयोग। जन्म से एक पापी ग्रह संबंधों में तनाव पैदा करता है, शनि का गोचर ठंडी जाँच से परख रहा है, और दशा इसी क्षेत्र को सक्रिय करती है। जिन संबंधों में सच्ची प्रतिबद्धता नहीं, उन पर अस्तित्वगत दबाव होगा।',
      },
      mild: {
        en: 'Relationships are under pressure from multiple directions. Existing partnerships face tests — but those built on genuine foundation will emerge stronger.',
        hi: 'संबंध कई दिशाओं से दबाव में हैं। मौजूदा साझेदारियाँ परीक्षा का सामना करती हैं।',
      },
    },
    advice: {
      en: 'Don\'t make permanent decisions under temporary pressure. Communicate openly with your partner. If single, this is a period for self-reflection on relationship patterns, not for starting new relationships.',
      hi: 'अस्थायी दबाव में स्थायी निर्णय न लें। साथी से खुलकर संवाद करें।',
    },
    laypersonNote: {
      en: 'When three astrological forces all stress your relationship area simultaneously, it\'s the universe forcing a reckoning — not to destroy, but to reveal what\'s real.',
      hi: 'जब तीन ज्योतिषीय बल एक साथ आपके संबंध क्षेत्र पर दबाव डालते हैं, तो यह सत्य प्रकट करने के लिए है।',
    },
    relatedSections: [TippanniSection.PlanetInsights, TippanniSection.DashaSynthesis, TippanniSection.LifeAreas, TippanniSection.Doshas],
  },
  {
    id: 'partnership-blessing',
    theme: 'relationship',
    significance: 4,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 'benefic', house: 7 },
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 7 }, // Jupiter transit 7th
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 7 },
    ],
    text: {
      full: {
        en: 'A harmonious convergence on partnerships. A natal benefic in your 7th house blesses relationships with grace, Jupiter\'s transit amplifies this with expansion and optimism, and your dasha period activates partnership themes. Existing relationships deepen, new connections feel destined, and professional partnerships flourish. This is a period of genuine alliance and mutual support.',
        hi: 'साझेदारी पर सामंजस्यपूर्ण संयोग। सप्तम भाव में शुभ ग्रह संबंधों को कृपा से आशीर्वादित करता है, बृहस्पति का गोचर विस्तार लाता है, और दशा साझेदारी विषय सक्रिय करती है। मौजूदा संबंध गहरे होते हैं, नए संपर्क नियति जैसे लगते हैं।',
      },
      mild: {
        en: 'Partnership energy is positive. Collaborative ventures and close relationships are favored. Lean into partnership opportunities.',
        hi: 'साझेदारी ऊर्जा सकारात्मक है। सहयोगी उद्यम और निकट संबंध अनुकूल हैं।',
      },
    },
    advice: {
      en: 'Invest in your key relationships — they\'re bearing fruit. Propose partnerships, deepen commitments, express gratitude.',
      hi: 'अपने प्रमुख संबंधों में निवेश करें — वे फल दे रहे हैं। साझेदारी प्रस्तावित करें, प्रतिबद्धता गहरी करें।',
    },
    laypersonNote: {
      en: 'Multiple planetary blessings on your partnership house — this is one of the more fortunate relationship periods in your chart.',
      hi: 'साझेदारी भाव पर कई ग्रहीय आशीर्वाद — आपकी कुंडली में अधिक भाग्यशाली संबंध अवधियों में से एक।',
    },
    relatedSections: [TippanniSection.PlanetInsights, TippanniSection.LifeAreas],
  },
  {
    id: 'divorce-separation',
    theme: 'relationship',
    significance: 5,
    conditions: [
      { type: 'natal', check: 'planet-in-house', planet: 2, house: 7 }, // Mars in 7th
      { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 7 }, // Saturn transit 7th
      { type: 'natal', check: 'lord-afflicted', house: 7 },
    ],
    text: {
      full: {
        en: 'A critical convergence indicating severe relationship pressure. Mars in your 7th house brings inherent conflict and aggression to partnerships, Saturn\'s transit adds duration and weight to this pressure, and your 7th lord is weakened — reducing your chart\'s capacity to sustain relationships. If underlying issues have been ignored, this period forces them into the open. Separation is one possible outcome, but so is radical restructuring of the relationship.',
        hi: 'गंभीर संबंध दबाव का संकेत देने वाला महत्वपूर्ण संयोग। सप्तम भाव में मंगल साझेदारी में संघर्ष लाता है, शनि का गोचर दबाव बढ़ाता है, और सप्तमेश कमजोर है। यदि अंतर्निहित समस्याओं को अनदेखा किया गया है, तो यह अवधि उन्हें खुले में लाती है।',
      },
      mild: {
        en: 'Relationship foundations are being tested. Communication may turn combative. Seek counseling before making irreversible decisions.',
        hi: 'संबंध की नींव की परीक्षा हो रही है। संवाद लड़ाई-झगड़ा बन सकता है। अपरिवर्तनीय निर्णय लेने से पहले परामर्श लें।',
      },
    },
    advice: {
      en: 'Do not make permanent decisions impulsively. Seek professional counseling. If separation is truly necessary, consult Muhurta for timing. Saturn demands maturity, not destruction.',
      hi: 'आवेश में स्थायी निर्णय न लें। पेशेवर परामर्श लें। शनि परिपक्वता की माँग करता है, विनाश की नहीं।',
    },
    laypersonNote: {
      en: 'Three astrological forces are pressuring your relationship area with unusual intensity. This doesn\'t mean separation is inevitable — but ignoring the signals is not an option.',
      hi: 'तीन ज्योतिषीय बल असामान्य तीव्रता से आपके संबंध क्षेत्र पर दबाव डाल रहे हैं।',
    },
    relatedSections: [TippanniSection.PlanetInsights, TippanniSection.Doshas, TippanniSection.LifeAreas],
    mutuallyExclusive: ['partnership-blessing', 'marriage-window'],
  },
  {
    id: 'past-love-returns',
    theme: 'relationship',
    significance: 3,
    conditions: [
      { type: 'retro', check: 'planet-retrograde', planet: 5 }, // Venus retrograde
      { type: 'dasha', check: 'lord-rules-or-occupies', house: 5 }, // 5th house (romance) activated
    ],
    text: {
      full: {
        en: 'Venus retrograde during a period that activates your 5th house of romance — a classic "ex returns" signature. Past lovers, unfinished romantic chapters, and old feelings resurface for re-examination. This isn\'t necessarily about going back — it\'s about understanding what you truly value in love before moving forward.',
        hi: 'शुक्र वक्री आपके पंचम भाव (प्रेम) की सक्रियता के दौरान — "पुराना प्रेम लौटता है" का शास्त्रीय संकेत। पुराने प्रेमी, अधूरे अध्याय और पुरानी भावनाएँ पुनः परीक्षा के लिए सतह पर आती हैं।',
      },
      mild: {
        en: 'Venus retrograde is stirring old romantic memories. Reflect on past relationship patterns — but don\'t act impulsively on nostalgia.',
        hi: 'शुक्र वक्री पुरानी प्रेम स्मृतियाँ जगा रहा है। पिछले संबंध पैटर्न पर चिंतन करें।',
      },
    },
    advice: {
      en: 'Journal about what you learned from past relationships. If an ex reaches out, listen but don\'t commit. New relationships started during Venus retrograde rarely last.',
      hi: 'पिछले संबंधों से क्या सीखा, इस पर लिखें। यदि कोई पुराना संपर्क करे, सुनें लेकिन प्रतिबद्ध न हों।',
    },
    laypersonNote: {
      en: 'When the planet of love goes backward while your romance area is active, old relationship themes replay — it\'s the universe giving you a second look, not necessarily a second chance.',
      hi: 'जब प्रेम का ग्रह पीछे जाता है जबकि प्रेम क्षेत्र सक्रिय है, पुराने संबंध विषय दोहराते हैं।',
    },
    relatedSections: [TippanniSection.PlanetInsights, TippanniSection.DashaSynthesis],
  },
];
```

- [ ] **Step 3: Create the patterns index**

```typescript
// src/lib/tippanni/convergence/patterns/index.ts

import { CAREER_PATTERNS } from './career';
import { RELATIONSHIP_PATTERNS } from './relationship';
import type { ConvergencePattern } from '../types';

export const ALL_PATTERNS: ConvergencePattern[] = [
  ...CAREER_PATTERNS,
  ...RELATIONSHIP_PATTERNS,
];

// Pattern lookup by ID
export const PATTERN_MAP = new Map(ALL_PATTERNS.map(p => [p.id, p]));
```

- [ ] **Step 4: Verify compilation**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep convergence`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/lib/tippanni/convergence/patterns/
git commit -m "feat(convergence): add first 10 patterns — 5 career + 5 relationship with full EN/HI text"
```

---

### Task 7: Main Convergence Engine

**Files:**
- Create: `src/lib/tippanni/convergence/engine.ts`
- Test: `src/lib/tippanni/convergence/__tests__/engine.test.ts`

- [ ] **Step 1: Write the engine tests**

```typescript
// src/lib/tippanni/convergence/__tests__/engine.test.ts

import { describe, it, expect } from 'vitest';
import { runConvergenceEngine } from '../engine';
import type { ConvergenceInput } from '../types';

// Career peak chart: strong 10th lord, Jupiter transiting 10th, dasha lord rules 10th
function makeCareerPeakChart(): ConvergenceInput {
  return {
    ascendant: 1, moonSign: 1,
    planets: [
      { id: 0, house: 10, sign: 10, isRetrograde: false, isCombust: false, isExalted: true, isDebilitated: false, isOwnSign: false, shadbala: 1.8 },
      { id: 1, house: 4, sign: 4, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: true, shadbala: 1.2 },
      { id: 6, house: 3, sign: 3, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.4 },
    ],
    houses: Array.from({ length: 12 }, (_, i) => {
      const sign = ((i) % 12) + 1;
      const lords = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4];
      return { house: i + 1, sign, lordId: lords[i] };
    }),
    dashaLord: 6, // Saturn = rules 10th house in Aries asc
    antarLord: 0,
    yogaIds: [],
    doshaIds: [],
    transits: [{ planetId: 4, sign: 10, isRetrograde: false }], // Jupiter in Capricorn
    ashtakavargaSAV: [28, 30, 25, 32, 27, 29, 31, 26, 33, 24, 28, 30],
    ashtakavargaBPI: [],
    relationships: {
      houseRulers: { 1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3, 7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4 },
      planetHouses: { 0: 10, 1: 4, 6: 3 },
      planetSigns: { 0: 10, 1: 4, 6: 3 },
      transitHouses: { 4: 10 }, // Jupiter transit 10th from Moon
      dashaLord: 6, antarLord: 0,
    },
    dashaTransitionWithin6Months: false,
    navamshaConfirmations: {},
  };
}

// Quiet chart — nothing converges
function makeQuietChart(): ConvergenceInput {
  return {
    ascendant: 1, moonSign: 1,
    planets: [
      { id: 4, house: 5, sign: 5, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.0 },
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: ((i) % 12) + 1, lordId: [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4][i] })),
    dashaLord: 1, antarLord: 3,
    yogaIds: [], doshaIds: [],
    transits: [{ planetId: 4, sign: 3, isRetrograde: false }],
    ashtakavargaSAV: Array(12).fill(28),
    ashtakavargaBPI: [],
    relationships: {
      houseRulers: { 1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3, 7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4 },
      planetHouses: { 4: 5 },
      planetSigns: { 4: 5 },
      transitHouses: { 4: 3 },
      dashaLord: 1, antarLord: 3,
    },
    dashaTransitionWithin6Months: false,
    navamshaConfirmations: {},
  };
}

describe('runConvergenceEngine', () => {
  it('detects career-peak pattern for matching chart', () => {
    const result = runConvergenceEngine(makeCareerPeakChart());
    const careerPeak = result.patterns.find(p => p.patternId === 'career-peak');
    expect(careerPeak).toBeDefined();
    expect(careerPeak!.isFullMatch).toBe(true);
  });

  it('produces executive insights for matching chart', () => {
    const result = runConvergenceEngine(makeCareerPeakChart());
    expect(result.executive.insights.length).toBeGreaterThan(0);
  });

  it('returns activation > 0 for matching chart', () => {
    const result = runConvergenceEngine(makeCareerPeakChart());
    expect(result.executive.activation).toBeGreaterThan(0);
  });

  it('returns quiet tone for chart with no pattern matches', () => {
    const result = runConvergenceEngine(makeQuietChart());
    expect(result.executive.tone).toBe('quiet');
    expect(result.patterns.length).toBe(0);
  });

  it('has a valid version string', () => {
    const result = runConvergenceEngine(makeQuietChart());
    expect(result.version).toBeTruthy();
  });

  it('patterns are sorted by finalScore descending', () => {
    const result = runConvergenceEngine(makeCareerPeakChart());
    for (let i = 1; i < result.patterns.length; i++) {
      expect(result.patterns[i - 1].finalScore).toBeGreaterThanOrEqual(result.patterns[i].finalScore);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/tippanni/convergence/__tests__/engine.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement the engine**

```typescript
// src/lib/tippanni/convergence/engine.ts

import type {
  ConvergenceInput,
  ConvergenceResult,
  MatchedPattern,
  ExecutiveInsight,
  UrgentFlag,
  Tone,
  TippanniSection,
} from './types';
import { CONVERGENCE_VERSION } from './types';
import { ALL_PATTERNS } from './patterns';
import { scorePattern } from './scoring';

/**
 * Main convergence engine.
 * Scans all patterns against the chart, ranks matches, builds executive summary.
 */
export function runConvergenceEngine(input: ConvergenceInput): ConvergenceResult {
  // 1. Score all patterns
  const matched: MatchedPattern[] = [];
  for (const pattern of ALL_PATTERNS) {
    const result = scorePattern(pattern, input);
    if (result) matched.push(result);
  }

  // 2. Handle mutual exclusion — if two mutually exclusive patterns match, keep higher score
  const suppressed = new Set<string>();
  for (const pattern of ALL_PATTERNS) {
    if (pattern.mutuallyExclusive) {
      const thisMatch = matched.find(m => m.patternId === pattern.id);
      if (!thisMatch) continue;
      for (const excludeId of pattern.mutuallyExclusive) {
        const other = matched.find(m => m.patternId === excludeId);
        if (other && thisMatch.finalScore > other.finalScore) {
          suppressed.add(excludeId);
        }
      }
    }
  }
  const activePatterns = matched
    .filter(m => !suppressed.has(m.patternId))
    .sort((a, b) => b.finalScore - a.finalScore);

  // 3. Compute activation & favorability
  const activation = Math.min(10, Math.round(
    activePatterns.reduce((sum, p) => sum + p.finalScore, 0) / 2
  )) || 0;

  const favorability = activePatterns.reduce((sum, p) => {
    const pattern = ALL_PATTERNS.find(ap => ap.id === p.patternId);
    if (!pattern) return sum;
    // Positive themes: career-peak, marriage-window, partnership-blessing, etc.
    const posIds = ['career-peak', 'public-recognition', 'marriage-window', 'partnership-blessing', 'past-love-returns'];
    const negIds = ['authority-conflict', 'relationship-storm', 'divorce-separation', 'professional-stagnation', 'career-change'];
    if (posIds.includes(p.patternId)) return sum + (p.isFullMatch ? 2 : 1);
    if (negIds.includes(p.patternId)) return sum - (p.isFullMatch ? 2 : 1);
    return sum;
  }, 0);

  // 4. Determine tone
  let tone: Tone = 'quiet';
  if (activePatterns.length === 0) tone = 'quiet';
  else if (favorability >= 3) tone = 'growth';
  else if (favorability <= -3) tone = 'pressure';
  else if (activePatterns.some(p => p.finalScore > 6)) tone = 'transformation';
  else tone = 'mixed';

  // 5. Build executive insights from top 5 patterns
  const insights: ExecutiveInsight[] = activePatterns.slice(0, 5).map(p => {
    const pattern = ALL_PATTERNS.find(ap => ap.id === p.patternId)!;
    const themeLabels: Record<string, string> = {
      career: 'Career', relationship: 'Relationship', wealth: 'Wealth',
      health: 'Health', spiritual: 'Spiritual', family: 'Family',
    };
    return {
      theme: `${themeLabels[p.theme] || p.theme} ${p.isFullMatch ? 'Convergence' : 'Signal'}`,
      themeIcon: p.theme,
      summary: p.text,
      laypersonNote: p.laypersonNote,
      temporalFrame: p.isFullMatch ? 'this-year' as const : 'multi-year' as const,
      matchCount: `${p.matchCount} of ${p.totalConditions} signals`,
      relatedPatterns: [p.patternId],
      expandedDetail: p.text, // same for now; can differentiate later
      advice: p.advice,
    };
  });

  // 6. Build urgent flags (max 3)
  const urgentFlags: UrgentFlag[] = [];
  if (input.dashaTransitionWithin6Months) {
    urgentFlags.push({
      severity: 3,
      icon: 'transition',
      message: {
        en: 'A major dasha transition is approaching within 6 months — decisions made now carry into the next cycle.',
        hi: 'एक बड़ा दशा संक्रमण 6 महीने के भीतर आ रहा है — अभी लिए गए निर्णय अगले चक्र में जाएँगे।',
      },
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      relatedPatterns: [],
    });
  }

  // 7. Build section markers
  const sectionMarkers: Partial<Record<TippanniSection, string[]>> = {};
  for (const p of activePatterns) {
    for (const section of p.relatedSections) {
      if (!sectionMarkers[section]) sectionMarkers[section] = [];
      if (!sectionMarkers[section]!.includes(p.patternId)) {
        sectionMarkers[section]!.push(p.patternId);
      }
    }
  }

  return {
    version: CONVERGENCE_VERSION,
    computedAt: new Date().toISOString(),
    executive: {
      activation,
      favorability: Math.max(-5, Math.min(5, favorability)),
      tone,
      insights,
      urgentFlags: urgentFlags.slice(0, 3),
      metaInsights: [], // Phase 2: interaction layer
    },
    patterns: activePatterns,
    sectionMarkers,
    transitOverlay: {
      snapshot: [],
      retroStatus: [],
      combustStatus: [],
      ashtakavargaHighlights: [],
    },
  };
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/tippanni/convergence/__tests__/engine.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/tippanni/convergence/engine.ts src/lib/tippanni/convergence/__tests__/engine.test.ts
git commit -m "feat(convergence): add main convergence engine — pattern matching, scoring, executive summary generation"
```

---

### Task 8: Wire Into Tippanni API

**Files:**
- Modify: `src/app/api/tippanni/route.ts`
- Modify: `src/lib/kundali/tippanni-types.ts`

- [ ] **Step 1: Extend TippanniContent type to include convergence**

Add to `src/lib/kundali/tippanni-types.ts`:

```typescript
import type { ConvergenceResult } from '@/lib/tippanni/convergence/types';

// Add to TippanniContent interface:
// convergence?: ConvergenceResult | null;
```

Find the `TippanniContent` interface and add the field:

```typescript
interface TippanniContent {
  // ... existing fields ...
  convergence?: ConvergenceResult | null;
}
```

- [ ] **Step 2: Modify the API route to run convergence engine**

In `src/app/api/tippanni/route.ts`, after `const baseTippanni = generateTippanni(kundali, locale);`:

```typescript
import { buildConvergenceInput } from '@/lib/tippanni/convergence/relationship-map';
import { runConvergenceEngine } from '@/lib/tippanni/convergence/engine';

// After baseTippanni generation:
let convergence: ConvergenceResult | null = null;
try {
  const convergenceInput = buildConvergenceInput(kundali);
  convergence = runConvergenceEngine(convergenceInput);
} catch (err) {
  console.error('Convergence engine failed (non-fatal):', err);
}

// Merge into response:
const response = { ...baseTippanni, convergence };
```

- [ ] **Step 3: Verify the build passes**

Run: `npx next build 2>&1 | grep -E "error|Error|✓|✗" | head -5`
Expected: Compiled successfully

- [ ] **Step 4: Test the API endpoint manually**

Run: `curl -s localhost:3000/api/tippanni -X POST -H 'Content-Type: application/json' -d '{"kundali":{...test data...},"locale":"en"}' | jq '.convergence.executive.tone'`
Expected: Returns a tone value ("quiet", "growth", etc.)

- [ ] **Step 5: Commit**

```bash
git add src/app/api/tippanni/route.ts src/lib/kundali/tippanni-types.ts
git commit -m "feat(convergence): wire convergence engine into tippanni API — executive summary in response"
```

---

### Task 9: Executive Summary UI Component

**Files:**
- Create: `src/components/kundali/ConvergenceSummary.tsx`
- Modify: `src/app/[locale]/kundali/page.tsx` (TippanniTab section)

- [ ] **Step 1: Create the executive summary component**

```typescript
// src/components/kundali/ConvergenceSummary.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertTriangle, Sparkles, ArrowUpRight } from 'lucide-react';
import type { ConvergenceResult, ExecutiveInsight, PatternTheme } from '@/lib/tippanni/convergence/types';
import type { Locale } from '@/types/panchang';

const THEME_STYLES: Record<PatternTheme, { gradient: string; border: string; text: string }> = {
  career: { gradient: 'from-[#2d1b69]/50 via-[#1a1040]/60 to-transparent', border: 'border-violet-500/25', text: 'text-violet-300' },
  relationship: { gradient: 'from-[#4a1a3a]/35 via-[#2a0a20]/45 to-transparent', border: 'border-pink-500/25', text: 'text-pink-300' },
  wealth: { gradient: 'from-[#3a2a10]/35 via-[#1a1508]/45 to-transparent', border: 'border-gold-light/25', text: 'text-gold-light' },
  health: { gradient: 'from-[#1a2a5a]/40 via-[#0a1530]/50 to-transparent', border: 'border-blue-500/25', text: 'text-blue-300' },
  spiritual: { gradient: 'from-[#1a1a4a]/40 via-[#0a0a25]/50 to-transparent', border: 'border-indigo-500/25', text: 'text-indigo-300' },
  family: { gradient: 'from-[#4a2a10]/40 via-[#2a1508]/50 to-transparent', border: 'border-orange-500/25', text: 'text-orange-300' },
};

interface Props {
  convergence: ConvergenceResult;
  locale: Locale;
  headingFont: React.CSSProperties;
}

export default function ConvergenceSummary({ convergence, locale, headingFont }: Props) {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const { executive } = convergence;
  const isDevanagari = locale !== 'en';
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;
  const t = (obj: { en: string; hi: string }) => locale === 'en' ? obj.en : obj.hi;

  const toneColor = executive.favorability >= 2 ? 'emerald' : executive.favorability <= -2 ? 'red' : 'amber';
  const toneLabel = executive.tone === 'growth' ? (locale === 'en' ? 'Growth Period' : 'विकास काल')
    : executive.tone === 'pressure' ? (locale === 'en' ? 'Testing Period' : 'परीक्षा काल')
    : executive.tone === 'transformation' ? (locale === 'en' ? 'Transformation' : 'परिवर्तन')
    : executive.tone === 'quiet' ? (locale === 'en' ? 'Consolidation' : 'स्थिरीकरण')
    : (locale === 'en' ? 'Mixed Influences' : 'मिश्रित प्रभाव');

  if (executive.insights.length === 0 && executive.urgentFlags.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 border-2 border-emerald-500/20 bg-gradient-to-br from-[#1a4a3a]/20 via-[#0a0e27] to-[#0a0e27] mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-gold-light font-bold text-lg" style={headingFont}>
              {locale === 'en' ? 'Chart Synthesis' : 'कुंडली संश्लेषण'}
            </h3>
            <p className="text-emerald-400 text-xs font-bold">{toneLabel}</p>
          </div>
        </div>
        <p className="text-text-secondary text-sm mt-3 leading-relaxed" style={bodyFont}>
          {locale === 'en'
            ? 'No major convergence patterns are active right now. This is a consolidation period — a quiet sky for reflection and preparation. Use this window to strengthen foundations before the next wave of activation.'
            : 'अभी कोई बड़ा संयोग पैटर्न सक्रिय नहीं है। यह स्थिरीकरण काल है — चिंतन और तैयारी के लिए शांत आकाश।'}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-2xl p-6 border-2 mb-8 bg-gradient-to-br from-[#1a0e3a]/60 via-[#0f0825]/70 to-[#0a0e27] ${
        toneColor === 'emerald' ? 'border-emerald-500/25' : toneColor === 'red' ? 'border-red-500/25' : 'border-amber-500/25'
      }`}
    >
      {/* Header with gauge */}
      <div className="flex items-start gap-4 mb-5">
        {/* Activation gauge */}
        <div className="flex-shrink-0">
          <svg width={64} height={64} viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(212,168,83,0.1)" strokeWidth="4" />
            <circle
              cx="32" cy="32" r="28" fill="none"
              stroke={toneColor === 'emerald' ? '#34d399' : toneColor === 'red' ? '#f87171' : '#fbbf24'}
              strokeWidth="4"
              strokeDasharray={`${(executive.activation / 10) * 176} 176`}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
            <text x="32" y="30" textAnchor="middle" fill="#f0d48a" fontSize="16" fontWeight="bold" fontFamily="monospace">
              {executive.activation.toFixed(1)}
            </text>
            <text x="32" y="42" textAnchor="middle" fill="#9b97a0" fontSize="8">
              {locale === 'en' ? 'ACTIVE' : 'सक्रिय'}
            </text>
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-gold-light font-bold text-xl mb-1" style={headingFont}>
            {locale === 'en' ? 'Your Chart Synthesis' : 'आपका कुंडली संश्लेषण'}
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              toneColor === 'emerald' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : toneColor === 'red' ? 'bg-red-500/15 border-red-500/30 text-red-300'
              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
            }`}>
              {toneLabel}
            </span>
            <span className="text-text-secondary/50 text-xs">
              {executive.insights.length} {locale === 'en' ? 'convergence patterns active' : 'संयोग पैटर्न सक्रिय'}
            </span>
          </div>
        </div>
      </div>

      {/* Urgent flags */}
      {executive.urgentFlags.length > 0 && (
        <div className="space-y-2 mb-5">
          {executive.urgentFlags.map((flag, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/8 border border-amber-500/20">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-amber-200 text-xs font-medium" style={bodyFont}>{t(flag.message)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {executive.insights.map((insight) => {
          const style = THEME_STYLES[insight.themeIcon] || THEME_STYLES.career;
          const isExpanded = expandedInsight === insight.relatedPatterns[0];

          return (
            <motion.div
              key={insight.relatedPatterns[0]}
              layout
              className={`rounded-xl border ${style.border} bg-gradient-to-br ${style.gradient} overflow-hidden`}
            >
              <button
                onClick={() => setExpandedInsight(isExpanded ? null : insight.relatedPatterns[0])}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>
                    {insight.theme}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-gold-primary/60 text-[10px] font-mono">{insight.matchCount}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-text-secondary/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                <p className="text-text-primary text-sm leading-relaxed line-clamp-3" style={bodyFont}>
                  {t(insight.summary)}
                </p>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gold-primary/10"
                  >
                    <div className="p-4 space-y-3">
                      {/* Layperson note */}
                      <div className="rounded-lg p-3 bg-bg-primary/40 border border-gold-primary/10">
                        <p className="text-text-secondary text-xs leading-relaxed italic" style={bodyFont}>
                          {t(insight.laypersonNote)}
                        </p>
                      </div>
                      {/* Advice */}
                      <div>
                        <div className="text-gold-dark text-[10px] uppercase tracking-wider font-bold mb-1">
                          {locale === 'en' ? 'Guidance' : 'मार्गदर्शन'}
                        </div>
                        <p className="text-text-primary text-xs leading-relaxed" style={bodyFont}>
                          {t(insight.advice)}
                        </p>
                      </div>
                      {/* Temporal frame badge */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-primary/10 border border-gold-primary/15 text-gold-dark">
                          {insight.temporalFrame === 'this-month' ? (locale === 'en' ? 'Active this month' : 'इस माह सक्रिय')
                            : insight.temporalFrame === 'this-year' ? (locale === 'en' ? 'Active this year' : 'इस वर्ष सक्रिय')
                            : insight.temporalFrame === 'multi-year' ? (locale === 'en' ? 'Multi-year cycle' : 'बहु-वर्षीय चक्र')
                            : (locale === 'en' ? 'Lifetime pattern' : 'आजीवन पैटर्न')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Wire ConvergenceSummary into the TippanniTab**

In `src/app/[locale]/kundali/page.tsx`, inside the `TippanniTab` component, add at the top of the render (before existing sections):

```typescript
import ConvergenceSummary from '@/components/kundali/ConvergenceSummary';

// Inside TippanniTab render, before existing sections:
{tip.convergence && (
  <ConvergenceSummary
    convergence={tip.convergence}
    locale={locale}
    headingFont={headingFont}
  />
)}
```

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1 | grep -E "error|Error|✓|✗" | head -5`
Expected: Compiled successfully

- [ ] **Step 4: Test in browser**

Navigate to `http://localhost:3000/en/kundali`, generate a chart, switch to Tippanni tab. Verify the executive summary card appears at the top.

- [ ] **Step 5: Commit**

```bash
git add src/components/kundali/ConvergenceSummary.tsx src/app/[locale]/kundali/page.tsx
git commit -m "feat(convergence): add executive summary UI component — hero card with insights, gauge, urgent flags"
```

---

### Task 10: Build Verification & Full Test Suite

**Files:**
- Test: All convergence test files

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run src/lib/tippanni/convergence/`
Expected: All tests pass

- [ ] **Step 2: Run the full project build**

Run: `npx next build`
Expected: 0 errors, compiled successfully

- [ ] **Step 3: Run the full project test suite**

Run: `npx vitest run`
Expected: All existing tests still pass (no regressions)

- [ ] **Step 4: Commit all Phase 1 work**

```bash
git add -A
git commit -m "feat(convergence): Phase 1 complete — engine, 10 patterns, scoring, API integration, executive summary UI

Convergence synthesis engine with:
- Types & interfaces for the full system
- Utility functions (isPlanetStrong, isHouseAfflicted, scoring weights)
- Relationship map builder (pre-joins chart data for O(1) lookups)
- Condition evaluator (natal, transit, dasha, retro, combust)
- Weighted scoring engine with Ashtakavarga modifiers
- 10 initial patterns (5 career + 5 relationship) with EN/HI text
- Main convergence engine with executive summary generation
- API integration (non-fatal, alongside existing tippanni)
- ConvergenceSummary UI component with insight cards and activation gauge"
```

---

## Phase 2-4 Tasks (To Be Detailed After Phase 1 Ships)

Phase 2-4 tasks will be planned after Phase 1 is in production and validated. They include:

- **Phase 2:** Remaining 48 patterns (wealth, health, spiritual, family), interaction layer (12 meta-rules), transit overlay, convergence badges on section headers, key term highlighter
- **Phase 3:** Hindi translations for all patterns, dasha timeline UI, life area score bars, remedy priority cards, progressive disclosure animation, print stylesheet
- **Phase 4:** LLM premium tier (Claude API integration, streaming, follow-up question), paywall gate

Each phase will get its own detailed implementation plan following the same task structure.
