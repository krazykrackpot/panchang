# Family-Personalized Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Augment the Marriage and Children domains with cross-chart relationship dynamics when a user has saved spouse/child kundalis, surfaced via a new "Your Family" dashboard card.

**Architecture:** New `family-synthesis` engine module consumes existing synastry, ashta-kuta, and kundali-calc outputs without modifying them. A server-side API endpoint orchestrates computation and caches results. Dashboard gets a new FamilyCard component that fetches and renders the family reading.

**Tech Stack:** TypeScript, Next.js App Router, Supabase (PostgreSQL + RLS), Zustand, existing synastry/matching engines, Tailwind CSS v4.

**Spec:** `docs/superpowers/specs/2026-04-22-family-personalized-dashboard-design.md`

---

## File Structure

### New files
```
supabase/migrations/013_family_readings.sql          # DB migration
src/lib/kundali/family-synthesis/types.ts             # All family synthesis types
src/lib/kundali/family-synthesis/varga-cross-read.ts  # D9/D7 cross-chart analysis
src/lib/kundali/family-synthesis/transit-relationship.ts  # Cross-chart transit impact
src/lib/kundali/family-synthesis/dasha-sync.ts        # Dasha synchronicity analysis
src/lib/kundali/family-synthesis/marriage-dynamics.ts  # Marriage overlay computation
src/lib/kundali/family-synthesis/child-dynamics.ts    # Per-child overlay computation
src/lib/kundali/family-synthesis/narrative-gen.ts     # Actionable guidance text generation
src/lib/kundali/family-synthesis/index.ts             # Orchestrator
src/lib/kundali/family-synthesis/__tests__/family-synthesis.test.ts
src/app/api/family-synthesis/route.ts                 # API endpoint
src/components/dashboard/FamilyCard.tsx               # Compact dashboard card
src/components/dashboard/FamilyMarriageDetail.tsx     # Marriage drill-down view
src/components/dashboard/FamilyChildDetail.tsx        # Per-child drill-down view
src/components/dashboard/FamilyActionItems.tsx        # Shared action items component
```

### Modified files
```
src/lib/kundali/domain-synthesis/types.ts             # Add optional relationshipDynamics
src/app/[locale]/kundali/page.tsx                     # Write relationship column on save
src/app/[locale]/dashboard/page.tsx                   # Import and render FamilyCard
```

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/013_family_readings.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- 013_family_readings.sql
-- Add indexed relationship column to saved_charts + family_readings cache table

-- 1. Add queryable relationship column to saved_charts
ALTER TABLE saved_charts ADD COLUMN IF NOT EXISTS relationship text;

-- 2. Backfill from existing JSONB birth_data
UPDATE saved_charts
SET relationship = birth_data->>'relationship'
WHERE birth_data->>'relationship' IS NOT NULL
  AND relationship IS NULL;

-- 3. Index for fast family chart lookup
CREATE INDEX IF NOT EXISTS idx_saved_charts_user_relationship
  ON saved_charts(user_id, relationship);

-- 4. Family readings cache table
CREATE TABLE IF NOT EXISTS family_readings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_data jsonb NOT NULL,
  computed_at timestamptz NOT NULL DEFAULT now(),
  chart_ids   uuid[] NOT NULL DEFAULT '{}',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  CONSTRAINT family_readings_user_unique UNIQUE (user_id)
);

-- 5. RLS for family_readings
ALTER TABLE family_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own family readings"
  ON family_readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages family readings"
  ON family_readings FOR ALL
  USING (auth.role() = 'service_role');

-- 6. Index on family_readings user_id (covered by UNIQUE, but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_family_readings_user ON family_readings(user_id);
```

- [ ] **Step 2: Apply migration to live DB**

Run:
```bash
npx supabase db query --linked "$(cat supabase/migrations/013_family_readings.sql)"
```

Expected: No errors. Verify with:
```bash
npx supabase db query --linked "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'saved_charts' AND column_name = 'relationship';"
npx supabase db query --linked "SELECT table_name FROM information_schema.tables WHERE table_name = 'family_readings';"
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/013_family_readings.sql
git commit -m "feat: add saved_charts.relationship column + family_readings table"
```

---

### Task 2: Type System

**Files:**
- Create: `src/lib/kundali/family-synthesis/types.ts`
- Modify: `src/lib/kundali/domain-synthesis/types.ts`

- [ ] **Step 1: Create the family synthesis types file**

Create `src/lib/kundali/family-synthesis/types.ts` with all types from the spec. This is the foundation — every subsequent task imports from here.

```typescript
/**
 * Family Synthesis Types
 *
 * Cross-chart relationship analysis for Marriage and Children domains.
 * These types are consumed by the family-synthesis engine modules and
 * the dashboard FamilyCard components.
 */

import type { KundaliData } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Input context
// ---------------------------------------------------------------------------

/** Family context passed into the synthesis pipeline. */
export interface FamilyContext {
  spouse?: FamilyMember;
  children: FamilyMember[];
}

/** A family member's chart data + metadata. */
export interface FamilyMember {
  chartId: string;
  kundali: KundaliData;
  name: string;
  birthOrder?: number;
}

// ---------------------------------------------------------------------------
// Cross-chart analysis results
// ---------------------------------------------------------------------------

export interface SynastryHighlight {
  yourPlanet: string;
  theirPlanet: string;
  aspect: string;
  orb: number;
  nature: 'harmonious' | 'challenging' | 'transformative';
  interpretation: LocaleText;
}

export interface VargaCrossRead {
  vargaType: 'D9' | 'D7';
  compatibility: number;
  narrative: LocaleText;
}

export interface KarmicIndicator {
  type: 'nodal_contact' | 'saturn_aspect' | 'rahu_ketu_axis';
  description: LocaleText;
  strength: number;
}

export interface GunaBreakdown {
  varna: number;
  vashya: number;
  tara: number;
  yoni: number;
  grahaMaitri: number;
  gana: number;
  bhakut: number;
  nadi: number;
}

// ---------------------------------------------------------------------------
// Temporal dynamics
// ---------------------------------------------------------------------------

export interface TransitHit {
  planet: string;
  house: number;
  sign: string;
  effect: LocaleText;
}

export interface TransitRelationshipImpact {
  overallTone: 'supportive' | 'challenging' | 'mixed' | 'neutral';
  yourTransits: TransitHit[];
  theirTransits: TransitHit[];
  narrative: LocaleText;
}

export interface DashaSyncAnalysis {
  inSync: boolean;
  yourDasha: string;
  theirDasha: string;
  yourActivation: string[];
  theirActivation: string[];
  narrative: LocaleText;
}

export interface RelationshipWindow {
  startDate: string;
  endDate: string;
  type: 'bonding' | 'growth' | 'challenge' | 'milestone';
  description: LocaleText;
}

export interface StressPeriod {
  startDate: string;
  endDate: string;
  trigger: string;
  severity: 'mild' | 'moderate' | 'intense';
  guidance: LocaleText;
}

// ---------------------------------------------------------------------------
// Actionable guidance
// ---------------------------------------------------------------------------

export interface ActionItem {
  type: 'do' | 'avoid' | 'watch';
  text: LocaleText;
  timing?: string;
  relevance: number;
}

// ---------------------------------------------------------------------------
// Relationship dynamics (the overlay on a domain)
// ---------------------------------------------------------------------------

export interface RelationshipDynamics {
  synastryHighlights: SynastryHighlight[];
  gunaScore?: number;
  gunaBreakdown?: GunaBreakdown;
  vargaCrossRead: VargaCrossRead;
  karmicIndicators: KarmicIndicator[];
  karakaAnalysis: LocaleText;

  transitImpact: TransitRelationshipImpact;
  dashaSynchronicity: DashaSyncAnalysis;
  upcomingWindows: RelationshipWindow[];
  stressPeriods: StressPeriod[];

  currentDynamic: LocaleText;
  actionItems: ActionItem[];
  monthlyForecast: LocaleText;
}

// ---------------------------------------------------------------------------
// Full family reading payload (cached in family_readings table)
// ---------------------------------------------------------------------------

export interface ChildDynamics {
  childName: string;
  chartId: string;
  dynamics: RelationshipDynamics;
}

export interface FamilyReading {
  marriageDynamics: RelationshipDynamics | null;
  childrenDynamics: ChildDynamics[];
  familySummary: LocaleText;
  computedAt: string;
}
```

- [ ] **Step 2: Add optional field to DomainReading**

In `src/lib/kundali/domain-synthesis/types.ts`, add the import and field. Find the `DomainReading` interface and add one line at the end:

```typescript
// Add this import at the top of the file:
import type { RelationshipDynamics } from '@/lib/kundali/family-synthesis/types';

// Add this field at the end of the DomainReading interface:
  /** Cross-chart relationship overlay. Only populated when family context exists. */
  relationshipDynamics?: RelationshipDynamics;
```

- [ ] **Step 3: Verify build**

Run:
```bash
npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep -v mangal-dosha
```
Expected: No new errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/kundali/family-synthesis/types.ts src/lib/kundali/domain-synthesis/types.ts
git commit -m "feat: add family synthesis type system"
```

---

### Task 3: Varga Cross-Read Module

Computes D9 (Navamsha) cross-chart compatibility for marriage, D7 (Saptamsha) for children.

**Files:**
- Create: `src/lib/kundali/family-synthesis/varga-cross-read.ts`

- [ ] **Step 1: Write failing test**

Create `src/lib/kundali/family-synthesis/__tests__/varga-cross-read.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { computeVargaCrossRead } from '../varga-cross-read';
import type { KundaliData } from '@/types/kundali';

// Minimal fixture: two charts with navamsha data
function makeChart(overrides: Partial<KundaliData> = {}): KundaliData {
  return {
    birthData: { name: 'Test', date: '1990-01-15', time: '06:00', place: 'Delhi', lat: 28.6, lng: 77.2, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' },
    ascendant: { degree: 10, sign: 1, signName: { en: 'Aries', hi: 'मेष', sa: 'मेष' } },
    planets: [
      { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य' }, longitude: 270, sign: 10, degree: 0, isRetrograde: false, house: 10 },
      { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र' }, longitude: 60, sign: 3, degree: 0, isRetrograde: false, house: 3 },
      { id: 2, name: { en: 'Mars', hi: 'मंगल', sa: 'मंगल' }, longitude: 30, sign: 2, degree: 0, isRetrograde: false, house: 2 },
      { id: 3, name: { en: 'Mercury', hi: 'बुध', sa: 'बुध' }, longitude: 280, sign: 10, degree: 10, isRetrograde: false, house: 10 },
      { id: 4, name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु' }, longitude: 120, sign: 5, degree: 0, isRetrograde: false, house: 5 },
      { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र' }, longitude: 300, sign: 11, degree: 0, isRetrograde: false, house: 11 },
      { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनि' }, longitude: 270, sign: 10, degree: 0, isRetrograde: false, house: 10 },
      { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहु' }, longitude: 180, sign: 7, degree: 0, isRetrograde: true, house: 7 },
      { id: 8, name: { en: 'Ketu', hi: 'केतु', sa: 'केतु' }, longitude: 0, sign: 1, degree: 0, isRetrograde: true, house: 1 },
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: ((i) % 12) + 1, degree: i * 30 })),
    chart: { planets: [] },
    navamshaChart: { planets: [] },
    dashas: [],
    shadbala: [],
    ayanamshaValue: 24.2,
    julianDay: 2447913.5,
    ...overrides,
  } as unknown as KundaliData;
}

describe('computeVargaCrossRead', () => {
  it('returns D9 cross-read for marriage context', () => {
    const chartA = makeChart();
    const chartB = makeChart();
    const result = computeVargaCrossRead(chartA, chartB, 'D9');
    expect(result.vargaType).toBe('D9');
    expect(result.compatibility).toBeGreaterThanOrEqual(0);
    expect(result.compatibility).toBeLessThanOrEqual(10);
    expect(result.narrative.en).toBeTruthy();
  });

  it('returns D7 cross-read for children context', () => {
    const chartA = makeChart();
    const chartB = makeChart();
    const result = computeVargaCrossRead(chartA, chartB, 'D7');
    expect(result.vargaType).toBe('D7');
    expect(result.compatibility).toBeGreaterThanOrEqual(0);
    expect(result.compatibility).toBeLessThanOrEqual(10);
    expect(result.narrative.en).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/family-synthesis/__tests__/varga-cross-read.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement varga-cross-read.ts**

Create `src/lib/kundali/family-synthesis/varga-cross-read.ts`:

```typescript
/**
 * Varga Cross-Read — D9 (Navamsha) and D7 (Saptamsha) cross-chart analysis.
 *
 * D9 for marriage: compares navamsha placements between spouses.
 * D7 for children: compares saptamsha placements between parent and child.
 *
 * Scoring factors:
 * - Varga lagna compatibility (same/friendly/neutral/enemy signs)
 * - Venus placement harmony (D9) or Jupiter placement harmony (D7)
 * - Lord exchange or mutual aspects in the varga
 * - Sign relationship between the two varga ascendants
 */

import type { KundaliData } from '@/types/kundali';
import type { VargaCrossRead } from './types';
import { getSignRelation } from '@/lib/comparison/synastry-engine';

// Sign lordship mapping: sign (1-12) → planet id (0=Sun..6=Saturn, 7=Rahu, 8=Ketu)
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

// Sign relation scoring (matches SignRelation type from synastry-engine)
const RELATION_SCORE: Record<string, number> = {
  same: 10, trine: 8, neutral: 5, difficult: 3,
};

/**
 * Get the varga chart planets. Falls back to main chart planets
 * if divisional chart data isn't available.
 */
function getVargaPlanets(kundali: KundaliData, vargaType: 'D9' | 'D7') {
  if (vargaType === 'D9' && kundali.navamshaChart?.planets?.length) {
    return kundali.navamshaChart.planets;
  }
  if (vargaType === 'D7' && kundali.divisionalCharts?.D7?.planets?.length) {
    return kundali.divisionalCharts.D7.planets;
  }
  // Fallback: compute navamsha sign from longitude
  // Each navamsha = 3°20' (3.333°). navamsha sign = floor(longitude / 3.333) % 12 + 1
  return kundali.planets.map(p => ({
    ...p,
    sign: vargaType === 'D9'
      ? (Math.floor(p.longitude / (10 / 3)) % 12) + 1
      : (Math.floor(p.longitude / (30 / 7)) % 12) + 1,
  }));
}

/**
 * Get the varga ascendant sign. Falls back to computing from main ascendant.
 */
function getVargaAscSign(kundali: KundaliData, vargaType: 'D9' | 'D7'): number {
  if (vargaType === 'D9' && kundali.navamshaChart?.planets?.length) {
    // If navamsha chart has lagna data, use it
    return kundali.navamshaChart.planets.find(p => p.id === -1)?.sign ?? computeVargaSign(kundali.ascendant.degree + (kundali.ascendant.sign - 1) * 30, vargaType);
  }
  return computeVargaSign(kundali.ascendant.degree + (kundali.ascendant.sign - 1) * 30, vargaType);
}

function computeVargaSign(longitude: number, vargaType: 'D9' | 'D7'): number {
  if (vargaType === 'D9') {
    return (Math.floor(longitude / (10 / 3)) % 12) + 1;
  }
  return (Math.floor(longitude / (30 / 7)) % 12) + 1;
}

/**
 * Compute D9 or D7 cross-chart compatibility.
 */
export function computeVargaCrossRead(
  chartA: KundaliData,
  chartB: KundaliData,
  vargaType: 'D9' | 'D7',
): VargaCrossRead {
  const planetsA = getVargaPlanets(chartA, vargaType);
  const planetsB = getVargaPlanets(chartB, vargaType);

  const ascSignA = getVargaAscSign(chartA, vargaType);
  const ascSignB = getVargaAscSign(chartB, vargaType);

  let totalScore = 0;
  let factorCount = 0;

  // Factor 1: Varga ascendant compatibility
  const ascRelation = getSignRelation(ascSignA, ascSignB);
  const ascScore = RELATION_SCORE[ascRelation.relation] ?? 5;
  totalScore += ascScore;
  factorCount++;

  // Factor 2: Key planet placement harmony
  // D9: Venus (id=5) signs compatible? D7: Jupiter (id=4) signs compatible?
  const keyPlanetId = vargaType === 'D9' ? 5 : 4;
  const keyA = planetsA.find(p => p.id === keyPlanetId);
  const keyB = planetsB.find(p => p.id === keyPlanetId);
  if (keyA && keyB) {
    const keyRelation = getSignRelation(keyA.sign, keyB.sign);
    totalScore += RELATION_SCORE[keyRelation.relation] ?? 5;
    factorCount++;
  }

  // Factor 3: Moon compatibility in varga (emotional resonance)
  const moonA = planetsA.find(p => p.id === 1);
  const moonB = planetsB.find(p => p.id === 1);
  if (moonA && moonB) {
    const moonRelation = getSignRelation(moonA.sign, moonB.sign);
    totalScore += RELATION_SCORE[moonRelation.relation] ?? 5;
    factorCount++;
  }

  // Factor 4: Lord exchange check (A's asc lord in B's asc sign or vice versa)
  const lordA = SIGN_LORD[ascSignA];
  const lordB = SIGN_LORD[ascSignB];
  const lordAPlanet = planetsA.find(p => p.id === lordA);
  const lordBPlanet = planetsB.find(p => p.id === lordB);
  let lordExchange = false;
  if (lordAPlanet && lordBPlanet) {
    if (lordAPlanet.sign === ascSignB || lordBPlanet.sign === ascSignA) {
      lordExchange = true;
      totalScore += 9;
      factorCount++;
    }
  }

  // Factor 5: 7th lord compatibility (D9) or 5th lord (D7)
  const targetHouse = vargaType === 'D9' ? 7 : 5;
  const targetSignA = ((ascSignA + targetHouse - 2) % 12) + 1;
  const targetSignB = ((ascSignB + targetHouse - 2) % 12) + 1;
  const targetLordA = SIGN_LORD[targetSignA];
  const targetLordB = SIGN_LORD[targetSignB];
  const targetPlanetA = planetsA.find(p => p.id === targetLordA);
  const targetPlanetB = planetsB.find(p => p.id === targetLordB);
  if (targetPlanetA && targetPlanetB) {
    const targetRelation = getSignRelation(targetPlanetA.sign, targetPlanetB.sign);
    totalScore += RELATION_SCORE[targetRelation.relation] ?? 5;
    factorCount++;
  }

  const compatibility = factorCount > 0
    ? Math.round((totalScore / factorCount) * 10) / 10
    : 5;
  const clampedScore = Math.max(0, Math.min(10, compatibility));

  // Generate narrative
  const narrative = generateVargaNarrative(vargaType, clampedScore, ascRelation.relation, lordExchange, keyA, keyB);

  return { vargaType, compatibility: clampedScore, narrative };
}

function generateVargaNarrative(
  vargaType: 'D9' | 'D7',
  score: number,
  ascRelation: string,
  lordExchange: boolean,
  keyA: { sign: number } | undefined,
  keyB: { sign: number } | undefined,
): { en: string; hi: string } {
  const vargaName = vargaType === 'D9' ? 'Navamsha (D9)' : 'Saptamsha (D7)';
  const vargaNameHi = vargaType === 'D9' ? 'नवांश (D9)' : 'सप्तांश (D7)';
  const context = vargaType === 'D9' ? 'marriage' : 'parent-child';
  const contextHi = vargaType === 'D9' ? 'वैवाहिक' : 'माता-पिता-संतान';

  let en = `${vargaName} cross-read shows `;
  let hi = `${vargaNameHi} विश्लेषण दर्शाता है कि `;

  if (score >= 8) {
    en += `strong ${context} compatibility (${score}/10). `;
    hi += `${contextHi} अनुकूलता मज़बूत है (${score}/10)। `;
  } else if (score >= 6) {
    en += `good ${context} compatibility (${score}/10). `;
    hi += `${contextHi} अनुकूलता अच्छी है (${score}/10)। `;
  } else if (score >= 4) {
    en += `moderate ${context} compatibility (${score}/10). `;
    hi += `${contextHi} अनुकूलता मध्यम है (${score}/10)। `;
  } else {
    en += `challenging ${context} dynamics (${score}/10). `;
    hi += `${contextHi} गतिशीलता चुनौतीपूर्ण है (${score}/10)। `;
  }

  if (lordExchange) {
    en += 'A beneficial lord exchange strengthens the bond. ';
    hi += 'लाभकारी ग्रह विनिमय बंधन को मज़बूत करता है। ';
  }

  return { en: en.trim(), hi: hi.trim() };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/kundali/family-synthesis/__tests__/varga-cross-read.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/family-synthesis/varga-cross-read.ts src/lib/kundali/family-synthesis/__tests__/varga-cross-read.test.ts
git commit -m "feat: varga cross-read module (D9/D7 cross-chart analysis)"
```

---

### Task 4: Transit Relationship Module

Analyzes how current planetary transits affect relationship houses in both charts.

**Files:**
- Create: `src/lib/kundali/family-synthesis/transit-relationship.ts`

- [ ] **Step 1: Write failing test**

Create `src/lib/kundali/family-synthesis/__tests__/transit-relationship.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { computeTransitRelationshipImpact } from '../transit-relationship';
import type { KundaliData, PlanetPosition } from '@/types/kundali';

function makeMinimalChart(ascSign: number): KundaliData {
  return {
    birthData: { name: 'Test', date: '1990-01-15', time: '06:00', place: 'Test', lat: 28.6, lng: 77.2, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' },
    ascendant: { degree: 10, sign: ascSign, signName: { en: 'Test', hi: 'Test', sa: 'Test' } },
    planets: [
      { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य' }, longitude: 270, sign: 10, degree: 0, isRetrograde: false, house: 10 },
      { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र' }, longitude: 60, sign: 3, degree: 0, isRetrograde: false, house: 3 },
      { id: 4, name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु' }, longitude: 120, sign: 5, degree: 0, isRetrograde: false, house: 5 },
      { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र' }, longitude: 300, sign: 11, degree: 0, isRetrograde: false, house: 11 },
      { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनि' }, longitude: 330, sign: 12, degree: 0, isRetrograde: false, house: 12 },
      { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहु' }, longitude: 180, sign: 7, degree: 0, isRetrograde: true, house: 7 },
    ] as PlanetPosition[],
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: ((ascSign - 1 + i) % 12) + 1, degree: i * 30 })),
    chart: { planets: [] },
    navamshaChart: { planets: [] },
    dashas: [],
    shadbala: [],
    ayanamshaValue: 24.2,
    julianDay: 2447913.5,
  } as unknown as KundaliData;
}

const transitPlanets: PlanetPosition[] = [
  { id: 4, name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु' }, longitude: 180, sign: 7, degree: 0, isRetrograde: false, house: 7 },
  { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनि' }, longitude: 330, sign: 12, degree: 0, isRetrograde: false, house: 12 },
  { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहु' }, longitude: 0, sign: 1, degree: 0, isRetrograde: true, house: 1 },
] as PlanetPosition[];

describe('computeTransitRelationshipImpact', () => {
  it('returns transit impact for marriage context (houses 7, 1, 2)', () => {
    const chartA = makeMinimalChart(1); // Aries asc → 7th house = Libra (sign 7)
    const chartB = makeMinimalChart(4); // Cancer asc → 7th house = Capricorn (sign 10)
    const result = computeTransitRelationshipImpact(chartA, chartB, transitPlanets, 'marriage');
    expect(result.overallTone).toMatch(/supportive|challenging|mixed|neutral/);
    expect(result.narrative.en).toBeTruthy();
    expect(Array.isArray(result.yourTransits)).toBe(true);
    expect(Array.isArray(result.theirTransits)).toBe(true);
  });

  it('returns transit impact for children context (houses 5, 1, 4)', () => {
    const chartA = makeMinimalChart(1);
    const chartB = makeMinimalChart(4);
    const result = computeTransitRelationshipImpact(chartA, chartB, transitPlanets, 'children');
    expect(result.overallTone).toMatch(/supportive|challenging|mixed|neutral/);
    expect(result.narrative.en).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/family-synthesis/__tests__/transit-relationship.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement transit-relationship.ts**

Create `src/lib/kundali/family-synthesis/transit-relationship.ts`:

```typescript
/**
 * Transit Relationship Impact — how current transits affect relationship houses.
 *
 * For marriage: checks transits to 7th house (partnership), 1st (self in relationship),
 * 2nd house (family/shared resources) in both charts.
 *
 * For children: checks transits to 5th house (children), 1st (child's identity),
 * 4th house (home/nurture) in both charts.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { TransitRelationshipImpact, TransitHit } from './types';

const RASHI_NAMES: Record<number, { en: string; hi: string }> = {
  1: { en: 'Aries', hi: 'मेष' }, 2: { en: 'Taurus', hi: 'वृषभ' },
  3: { en: 'Gemini', hi: 'मिथुन' }, 4: { en: 'Cancer', hi: 'कर्क' },
  5: { en: 'Leo', hi: 'सिंह' }, 6: { en: 'Virgo', hi: 'कन्या' },
  7: { en: 'Libra', hi: 'तुला' }, 8: { en: 'Scorpio', hi: 'वृश्चिक' },
  9: { en: 'Sagittarius', hi: 'धनु' }, 10: { en: 'Capricorn', hi: 'मकर' },
  11: { en: 'Aquarius', hi: 'कुम्भ' }, 12: { en: 'Pisces', hi: 'मीन' },
};

const PLANET_NAMES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sun', hi: 'सूर्य' }, 1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' }, 3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'गुरु' }, 5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' }, 7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

// Slow planets that matter for transit analysis
const SLOW_PLANET_IDS = [4, 5, 6, 7, 8]; // Jupiter, Venus, Saturn, Rahu, Ketu

// Benefic vs malefic for tone assessment
const BENEFIC_IDS = new Set([1, 3, 4, 5]); // Moon, Mercury, Jupiter, Venus
const MALEFIC_IDS = new Set([0, 2, 6, 7, 8]); // Sun, Mars, Saturn, Rahu, Ketu

type Context = 'marriage' | 'children';

/** Get the houses relevant to a relationship context. */
function getRelationshipHouses(context: Context): number[] {
  return context === 'marriage' ? [7, 1, 2] : [5, 1, 4];
}

/** Get the sign occupying a house (whole sign from ascendant). */
function houseToSign(ascSign: number, house: number): number {
  return ((ascSign - 1 + house - 1) % 12) + 1;
}

/** Check which slow transit planets are hitting relationship houses in a chart. */
function findTransitHits(
  chart: KundaliData,
  transitPlanets: PlanetPosition[],
  context: Context,
): TransitHit[] {
  const houses = getRelationshipHouses(context);
  const hits: TransitHit[] = [];

  for (const tp of transitPlanets) {
    if (!SLOW_PLANET_IDS.includes(tp.id)) continue;

    for (const house of houses) {
      const houseSign = houseToSign(chart.ascendant.sign, house);
      if (tp.sign === houseSign) {
        const pName = PLANET_NAMES[tp.id] ?? { en: `Planet ${tp.id}`, hi: `ग्रह ${tp.id}` };
        const rName = RASHI_NAMES[houseSign] ?? { en: `Sign ${houseSign}`, hi: `राशि ${houseSign}` };

        const isBenefic = BENEFIC_IDS.has(tp.id);
        const houseLabel = context === 'marriage'
          ? (house === 7 ? 'partnership' : house === 1 ? 'self' : 'family resources')
          : (house === 5 ? 'children' : house === 1 ? 'identity' : 'home & nurture');

        const effectEn = isBenefic
          ? `${pName.en} transiting ${rName.en} (${house}th house) supports ${houseLabel}.`
          : `${pName.en} transiting ${rName.en} (${house}th house) brings pressure to ${houseLabel}.`;
        const effectHi = isBenefic
          ? `${pName.hi} ${rName.hi} में (${house}वें भाव) ${houseLabel} को सहायता दे रहा है।`
          : `${pName.hi} ${rName.hi} में (${house}वें भाव) ${houseLabel} पर दबाव ला रहा है।`;

        hits.push({
          planet: pName.en,
          house,
          sign: rName.en,
          effect: { en: effectEn, hi: effectHi },
        });
      }
    }
  }

  return hits;
}

/** Determine overall tone from benefic/malefic ratio. */
function assessTone(yourHits: TransitHit[], theirHits: TransitHit[], transitPlanets: PlanetPosition[]): TransitRelationshipImpact['overallTone'] {
  const allHits = [...yourHits, ...theirHits];
  if (allHits.length === 0) return 'neutral';

  let beneficCount = 0;
  let maleficCount = 0;
  for (const hit of allHits) {
    const tp = transitPlanets.find(p => PLANET_NAMES[p.id]?.en === hit.planet);
    if (tp && BENEFIC_IDS.has(tp.id)) beneficCount++;
    if (tp && MALEFIC_IDS.has(tp.id)) maleficCount++;
  }

  if (beneficCount > maleficCount + 1) return 'supportive';
  if (maleficCount > beneficCount + 1) return 'challenging';
  if (beneficCount > 0 && maleficCount > 0) return 'mixed';
  return 'neutral';
}

/**
 * Compute how current transits impact the relationship between two charts.
 */
export function computeTransitRelationshipImpact(
  chartA: KundaliData,
  chartB: KundaliData,
  transitPlanets: PlanetPosition[],
  context: Context,
): TransitRelationshipImpact {
  const yourTransits = findTransitHits(chartA, transitPlanets, context);
  const theirTransits = findTransitHits(chartB, transitPlanets, context);
  const overallTone = assessTone(yourTransits, theirTransits, transitPlanets);

  // Generate narrative
  const totalHits = yourTransits.length + theirTransits.length;
  const contextLabel = context === 'marriage' ? 'relationship' : 'parent-child bond';
  const contextLabelHi = context === 'marriage' ? 'संबंध' : 'माता-पिता-संतान बंधन';

  let en: string;
  let hi: string;

  if (totalHits === 0) {
    en = `No major slow-planet transits are currently activating ${contextLabel} houses in either chart. A calm, neutral period.`;
    hi = `इस समय किसी भी चार्ट में ${contextLabelHi} भावों पर कोई प्रमुख धीमे ग्रह गोचर सक्रिय नहीं है। शांत, तटस्थ अवधि।`;
  } else {
    const toneEn = overallTone === 'supportive' ? 'favourable' : overallTone === 'challenging' ? 'demanding' : overallTone === 'mixed' ? 'mixed' : 'stable';
    const toneHi = overallTone === 'supportive' ? 'अनुकूल' : overallTone === 'challenging' ? 'चुनौतीपूर्ण' : overallTone === 'mixed' ? 'मिश्रित' : 'स्थिर';
    en = `Current transits create a ${toneEn} environment for your ${contextLabel}. `;
    hi = `वर्तमान गोचर आपके ${contextLabelHi} के लिए ${toneHi} वातावरण बना रहे हैं। `;

    // Add top hit summaries
    const topHits = [...yourTransits, ...theirTransits].slice(0, 3);
    for (const hit of topHits) {
      en += hit.effect.en + ' ';
      hi += (hit.effect.hi ?? hit.effect.en) + ' ';
    }
  }

  return {
    overallTone,
    yourTransits,
    theirTransits,
    narrative: { en: en.trim(), hi: hi.trim() },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/kundali/family-synthesis/__tests__/transit-relationship.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/family-synthesis/transit-relationship.ts src/lib/kundali/family-synthesis/__tests__/transit-relationship.test.ts
git commit -m "feat: transit relationship impact module"
```

---

### Task 5: Dasha Synchronicity Module

Compares dasha periods between two charts to find synchronous activation of relationship houses.

**Files:**
- Create: `src/lib/kundali/family-synthesis/dasha-sync.ts`

- [ ] **Step 1: Write failing test**

Create `src/lib/kundali/family-synthesis/__tests__/dasha-sync.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { computeDashaSynchronicity } from '../dasha-sync';
import type { KundaliData, DashaEntry } from '@/types/kundali';

function makeChartWithDashas(dashas: DashaEntry[], ascSign: number = 1): KundaliData {
  return {
    birthData: { name: 'Test', date: '1990-01-15', time: '06:00', place: 'Test', lat: 28.6, lng: 77.2, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' },
    ascendant: { degree: 10, sign: ascSign, signName: { en: 'Aries', hi: 'मेष', sa: 'मेष' } },
    planets: [
      { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र' }, longitude: 180, sign: 7, degree: 0, isRetrograde: false, house: 7 },
      { id: 4, name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु' }, longitude: 120, sign: 5, degree: 0, isRetrograde: false, house: 5 },
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: ((ascSign - 1 + i) % 12) + 1, degree: i * 30 })),
    chart: { planets: [] },
    navamshaChart: { planets: [] },
    dashas,
    shadbala: [],
    ayanamshaValue: 24.2,
    julianDay: 2447913.5,
  } as unknown as KundaliData;
}

const now = new Date();
const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString();
const oneYearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString();

describe('computeDashaSynchronicity', () => {
  it('detects synchronicity when both dashas activate relationship houses', () => {
    // Venus Mahadasha for chart A (Venus lords 7th from Aries asc)
    const dashasA: DashaEntry[] = [
      { planet: 'Venus', startDate: oneYearAgo, endDate: oneYearLater, level: 0 },
    ];
    // Jupiter Mahadasha for chart B (Jupiter lords 7th from Gemini asc = Sagittarius)
    const dashasB: DashaEntry[] = [
      { planet: 'Jupiter', startDate: oneYearAgo, endDate: oneYearLater, level: 0 },
    ];

    const result = computeDashaSynchronicity(
      makeChartWithDashas(dashasA, 1),
      makeChartWithDashas(dashasB, 3),
      'marriage',
    );
    expect(result.yourDasha).toBeTruthy();
    expect(result.theirDasha).toBeTruthy();
    expect(typeof result.inSync).toBe('boolean');
    expect(result.narrative.en).toBeTruthy();
  });

  it('works for children context', () => {
    const dashasA: DashaEntry[] = [
      { planet: 'Jupiter', startDate: oneYearAgo, endDate: oneYearLater, level: 0 },
    ];
    const dashasB: DashaEntry[] = [
      { planet: 'Moon', startDate: oneYearAgo, endDate: oneYearLater, level: 0 },
    ];

    const result = computeDashaSynchronicity(
      makeChartWithDashas(dashasA, 1),
      makeChartWithDashas(dashasB, 1),
      'children',
    );
    expect(result.narrative.en).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/family-synthesis/__tests__/dasha-sync.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement dasha-sync.ts**

Create `src/lib/kundali/family-synthesis/dasha-sync.ts`:

```typescript
/**
 * Dasha Synchronicity — are both charts' dasha periods activating
 * relationship-relevant houses simultaneously?
 *
 * Marriage context: checks if current dashas activate 7th house, Venus, or DK.
 * Children context: checks if parent's dasha activates 5th house and child's
 * dasha activates 1st/4th/9th (developmental houses).
 */

import type { KundaliData, DashaEntry } from '@/types/kundali';
import type { DashaSyncAnalysis } from './types';

// Planet name → id mapping
const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

// Sign lordship: sign (1-12) → planet id
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

type Context = 'marriage' | 'children';

/** Find the currently active Mahadasha. */
function getCurrentDasha(dashas: DashaEntry[]): DashaEntry | null {
  const now = Date.now();
  // Level 0 = Mahadasha
  const mahadashas = dashas.filter(d => d.level === 0);
  return mahadashas.find(d => {
    const start = new Date(d.startDate).getTime();
    const end = new Date(d.endDate).getTime();
    return now >= start && now <= end;
  }) ?? mahadashas[0] ?? null;
}

/** Find the currently active Antardasha (level 1). */
function getCurrentAntardasha(dashas: DashaEntry[]): DashaEntry | null {
  const now = Date.now();
  const antardashas = dashas.filter(d => d.level === 1);
  return antardashas.find(d => {
    const start = new Date(d.startDate).getTime();
    const end = new Date(d.endDate).getTime();
    return now >= start && now <= end;
  }) ?? null;
}

/** Get houses activated by a dasha lord (house it lords + house it occupies). */
function getActivatedHouses(kundali: KundaliData, planetName: string): number[] {
  const pid = PLANET_NAME_TO_ID[planetName];
  if (pid === undefined) return [];

  const houses: number[] = [];
  const ascSign = kundali.ascendant.sign;

  // House the planet occupies
  const planet = kundali.planets.find(p => p.id === pid);
  if (planet) {
    const occupiedHouse = ((planet.sign - ascSign + 12) % 12) + 1;
    houses.push(occupiedHouse);
  }

  // Houses the planet lords (by sign lordship)
  for (let h = 1; h <= 12; h++) {
    const houseSign = ((ascSign - 1 + h - 1) % 12) + 1;
    if (SIGN_LORD[houseSign] === pid) {
      houses.push(h);
    }
  }

  return [...new Set(houses)];
}

/** Check if any of the activated houses match relationship-relevant houses. */
function hasRelationshipActivation(activatedHouses: number[], context: Context, isSecondChart: boolean): string[] {
  const relevantHouses = context === 'marriage'
    ? [7, 1, 2]
    : isSecondChart
      ? [1, 4, 9] // child's developmental houses
      : [5, 9];   // parent's children/blessing houses

  const matches: string[] = [];
  for (const h of activatedHouses) {
    if (relevantHouses.includes(h)) {
      matches.push(`${h}th`);
    }
  }
  return matches;
}

/**
 * Compute dasha synchronicity between two charts.
 */
export function computeDashaSynchronicity(
  chartA: KundaliData,
  chartB: KundaliData,
  context: Context,
): DashaSyncAnalysis {
  const dashaA = getCurrentDasha(chartA.dashas);
  const dashaB = getCurrentDasha(chartB.dashas);
  const antarA = getCurrentAntardasha(chartA.dashas);
  const antarB = getCurrentAntardasha(chartB.dashas);

  const yourDashaLabel = dashaA
    ? `${dashaA.planet}${antarA ? `-${antarA.planet}` : ''}`
    : 'Unknown';
  const theirDashaLabel = dashaB
    ? `${dashaB.planet}${antarB ? `-${antarB.planet}` : ''}`
    : 'Unknown';

  // Check activation
  const yourActivation: string[] = [];
  const theirActivation: string[] = [];

  if (dashaA) {
    yourActivation.push(...hasRelationshipActivation(
      getActivatedHouses(chartA, dashaA.planet), context, false,
    ));
    if (antarA) {
      yourActivation.push(...hasRelationshipActivation(
        getActivatedHouses(chartA, antarA.planet), context, false,
      ));
    }
  }

  if (dashaB) {
    theirActivation.push(...hasRelationshipActivation(
      getActivatedHouses(chartB, dashaB.planet), context, true,
    ));
    if (antarB) {
      theirActivation.push(...hasRelationshipActivation(
        getActivatedHouses(chartB, antarB.planet), context, true,
      ));
    }
  }

  const uniqueYours = [...new Set(yourActivation)];
  const uniqueTheirs = [...new Set(theirActivation)];
  const inSync = uniqueYours.length > 0 && uniqueTheirs.length > 0;

  // Narrative
  const contextLabel = context === 'marriage' ? 'relationship' : 'parenting';
  const contextLabelHi = context === 'marriage' ? 'वैवाहिक' : 'पालन-पोषण';

  let en: string;
  let hi: string;

  if (inSync) {
    en = `Dasha periods are synchronized for ${contextLabel}. Your ${yourDashaLabel} period activates ${uniqueYours.join(', ')} houses, while their ${theirDashaLabel} period activates ${uniqueTheirs.join(', ')} houses. Both charts are in a phase of ${contextLabel} activation.`;
    hi = `${contextLabelHi} के लिए दशा काल समन्वित हैं। आपकी ${yourDashaLabel} दशा ${uniqueYours.join(', ')} भावों को सक्रिय कर रही है, जबकि उनकी ${theirDashaLabel} दशा ${uniqueTheirs.join(', ')} भावों को सक्रिय कर रही है।`;
  } else if (uniqueYours.length > 0) {
    en = `Your ${yourDashaLabel} dasha activates ${contextLabel} houses (${uniqueYours.join(', ')}), but their ${theirDashaLabel} dasha is focused elsewhere. You may feel more invested in the ${contextLabel} than they do right now.`;
    hi = `आपकी ${yourDashaLabel} दशा ${contextLabelHi} भावों (${uniqueYours.join(', ')}) को सक्रिय कर रही है, लेकिन उनकी ${theirDashaLabel} दशा कहीं और केंद्रित है।`;
  } else if (uniqueTheirs.length > 0) {
    en = `Their ${theirDashaLabel} dasha activates ${contextLabel} houses (${uniqueTheirs.join(', ')}), while your ${yourDashaLabel} dasha is focused elsewhere. They may need more from the ${contextLabel} right now.`;
    hi = `उनकी ${theirDashaLabel} दशा ${contextLabelHi} भावों (${uniqueTheirs.join(', ')}) को सक्रिय कर रही है, जबकि आपकी ${yourDashaLabel} दशा कहीं और केंद्रित है।`;
  } else {
    en = `Neither dasha period is directly activating ${contextLabel} houses. This is a neutral period — the ${contextLabel} dynamic runs on its established rhythm.`;
    hi = `कोई भी दशा काल सीधे ${contextLabelHi} भावों को सक्रिय नहीं कर रहा है। यह एक तटस्थ अवधि है।`;
  }

  return {
    inSync,
    yourDasha: yourDashaLabel,
    theirDasha: theirDashaLabel,
    yourActivation: uniqueYours,
    theirActivation: uniqueTheirs,
    narrative: { en, hi },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/kundali/family-synthesis/__tests__/dasha-sync.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/family-synthesis/dasha-sync.ts src/lib/kundali/family-synthesis/__tests__/dasha-sync.test.ts
git commit -m "feat: dasha synchronicity analysis module"
```

---

### Task 6: Narrative Generation Module

Generates actionable guidance text (action items, monthly forecast, family summary) from computed factors.

**Files:**
- Create: `src/lib/kundali/family-synthesis/narrative-gen.ts`

- [ ] **Step 1: Write failing test**

Create `src/lib/kundali/family-synthesis/__tests__/narrative-gen.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  generateMarriageActionItems,
  generateChildActionItems,
  generateFamilySummary,
  generateMonthlyForecast,
} from '../narrative-gen';
import type { TransitRelationshipImpact, DashaSyncAnalysis, VargaCrossRead, SynastryHighlight } from '../types';

const mockTransitImpact: TransitRelationshipImpact = {
  overallTone: 'supportive',
  yourTransits: [{ planet: 'Jupiter', house: 7, sign: 'Libra', effect: { en: 'Jupiter supports partnership.', hi: 'गुरु साझेदारी का समर्थन करता है।' } }],
  theirTransits: [],
  narrative: { en: 'Supportive transits.', hi: 'सहायक गोचर।' },
};

const mockDashaSync: DashaSyncAnalysis = {
  inSync: true,
  yourDasha: 'Venus-Jupiter',
  theirDasha: 'Moon-Venus',
  yourActivation: ['7th'],
  theirActivation: ['7th'],
  narrative: { en: 'Both activating 7th.', hi: 'दोनों 7वें भाव सक्रिय।' },
};

const mockVarga: VargaCrossRead = {
  vargaType: 'D9',
  compatibility: 7.5,
  narrative: { en: 'Good navamsha compatibility.', hi: 'अच्छी नवांश अनुकूलता।' },
};

const mockSynastry: SynastryHighlight[] = [
  { yourPlanet: 'Venus', theirPlanet: 'Jupiter', aspect: 'conjunction', orb: 2, nature: 'harmonious', interpretation: { en: 'Deep emotional bond.', hi: 'गहरा भावनात्मक बंधन।' } },
];

describe('narrative-gen', () => {
  it('generates marriage action items', () => {
    const items = generateMarriageActionItems(mockTransitImpact, mockDashaSync, mockSynastry, 28);
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].type).toMatch(/do|avoid|watch/);
    expect(items[0].text.en).toBeTruthy();
    expect(items[0].relevance).toBeGreaterThanOrEqual(0);
  });

  it('generates child action items', () => {
    const items = generateChildActionItems(mockTransitImpact, mockDashaSync, 'Arjun');
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].text.en).toBeTruthy();
  });

  it('generates family summary', () => {
    const summary = generateFamilySummary(true, 1, 'supportive', true);
    expect(summary.en).toBeTruthy();
    expect(summary.en.length).toBeGreaterThan(20);
  });

  it('generates monthly forecast', () => {
    const forecast = generateMonthlyForecast(mockTransitImpact, mockDashaSync, 'marriage');
    expect(forecast.en).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/family-synthesis/__tests__/narrative-gen.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement narrative-gen.ts**

Create `src/lib/kundali/family-synthesis/narrative-gen.ts`:

```typescript
/**
 * Narrative Generation — produces actionable guidance text from computed factors.
 *
 * All text is bilingual (en/hi). Tamil and Bengali fall back to en via the
 * tl() helper at render time.
 */

import type {
  ActionItem, TransitRelationshipImpact, DashaSyncAnalysis,
  SynastryHighlight, RelationshipWindow, StressPeriod,
} from './types';
import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Marriage Action Items
// ---------------------------------------------------------------------------

export function generateMarriageActionItems(
  transit: TransitRelationshipImpact,
  dashaSync: DashaSyncAnalysis,
  synastryHighlights: SynastryHighlight[],
  gunaScore?: number,
): ActionItem[] {
  const items: ActionItem[] = [];

  // Transit-based items
  if (transit.overallTone === 'supportive') {
    items.push({
      type: 'do',
      text: {
        en: 'Current transits favour your partnership. This is a good period for joint decisions, shared goals, and deepening trust.',
        hi: 'वर्तमान गोचर आपकी साझेदारी के अनुकूल हैं। यह संयुक्त निर्णयों, साझा लक्ष्यों और विश्वास बढ़ाने का अच्छा समय है।',
      },
      timing: 'This month',
      relevance: 8,
    });
  } else if (transit.overallTone === 'challenging') {
    items.push({
      type: 'avoid',
      text: {
        en: 'Transit pressure on relationship houses suggests this is not ideal for major confrontations. Practise patience and defer contentious discussions.',
        hi: 'संबंध भावों पर गोचर दबाव बताता है कि यह बड़े टकराव का समय नहीं है। धैर्य रखें और विवादास्पद चर्चाओं को टालें।',
      },
      timing: 'This month',
      relevance: 9,
    });
  }

  // Malefic transit warnings
  for (const hit of [...transit.yourTransits, ...transit.theirTransits]) {
    if (hit.planet === 'Saturn' && hit.house === 7) {
      items.push({
        type: 'watch',
        text: {
          en: `Saturn transiting the 7th house tests commitment. Focus on reliability and shared responsibilities rather than romance.`,
          hi: `शनि 7वें भाव में गोचर कर रहा है — प्रतिबद्धता की परीक्षा। रोमांस की बजाय विश्वसनीयता और साझा ज़िम्मेदारियों पर ध्यान दें।`,
        },
        timing: 'Ongoing',
        relevance: 9,
      });
    }
    if (hit.planet === 'Rahu' && hit.house === 7) {
      items.push({
        type: 'watch',
        text: {
          en: 'Rahu in the 7th house can create restlessness or unconventional desires in the partnership. Stay grounded in shared values.',
          hi: 'राहु 7वें भाव में साझेदारी में बेचैनी या असामान्य इच्छाएँ पैदा कर सकता है। साझा मूल्यों में स्थिर रहें।',
        },
        timing: 'Ongoing',
        relevance: 8,
      });
    }
  }

  // Dasha-based items
  if (dashaSync.inSync) {
    items.push({
      type: 'do',
      text: {
        en: `Both your dasha periods are activating relationship houses simultaneously. This is a rare alignment — use it for meaningful conversations, shared rituals, or relationship milestones.`,
        hi: `आपकी और उनकी दोनों दशाएँ एक साथ संबंध भावों को सक्रिय कर रही हैं। यह दुर्लभ संयोग है — इसे सार्थक बातचीत, साझा अनुष्ठानों या रिश्ते के मील के पत्थरों के लिए उपयोग करें।`,
      },
      timing: 'Current dasha period',
      relevance: 9,
    });
  }

  // Synastry-based items
  const harmonious = synastryHighlights.filter(s => s.nature === 'harmonious');
  const challenging = synastryHighlights.filter(s => s.nature === 'challenging');

  if (harmonious.length > 0) {
    const top = harmonious[0];
    items.push({
      type: 'do',
      text: {
        en: `Your ${top.yourPlanet}-${top.theirPlanet} ${top.aspect} is a source of natural harmony. Lean into activities that resonate with this energy.`,
        hi: `आपका ${top.yourPlanet}-${top.theirPlanet} ${top.aspect} प्राकृतिक सामंजस्य का स्रोत है। इस ऊर्जा से जुड़ी गतिविधियों में भाग लें।`,
      },
      relevance: 7,
    });
  }

  if (challenging.length > 0) {
    const top = challenging[0];
    items.push({
      type: 'watch',
      text: {
        en: `The ${top.yourPlanet}-${top.theirPlanet} ${top.aspect} can create friction. Awareness is the remedy — acknowledge this dynamic rather than fighting it.`,
        hi: `${top.yourPlanet}-${top.theirPlanet} ${top.aspect} घर्षण पैदा कर सकता है। जागरूकता ही उपाय है — इस गतिशीलता को स्वीकार करें, लड़ें नहीं।`,
      },
      relevance: 7,
    });
  }

  // Sort by relevance descending, cap at 5
  return items.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
}

// ---------------------------------------------------------------------------
// Child Action Items
// ---------------------------------------------------------------------------

export function generateChildActionItems(
  transit: TransitRelationshipImpact,
  dashaSync: DashaSyncAnalysis,
  childName: string,
): ActionItem[] {
  const items: ActionItem[] = [];

  if (transit.overallTone === 'supportive') {
    items.push({
      type: 'do',
      text: {
        en: `Transits are favourable for your bond with ${childName}. Good time for quality activities, learning together, or introducing new experiences.`,
        hi: `${childName} के साथ आपके बंधन के लिए गोचर अनुकूल हैं। गुणवत्तापूर्ण गतिविधियों, साथ में सीखने या नए अनुभवों के लिए अच्छा समय।`,
      },
      timing: 'This month',
      relevance: 8,
    });
  } else if (transit.overallTone === 'challenging') {
    items.push({
      type: 'watch',
      text: {
        en: `${childName} may feel pressure from transit influences. Extra patience, listening, and stability will help them navigate this period.`,
        hi: `${childName} गोचर प्रभावों से दबाव महसूस कर सकते हैं। अतिरिक्त धैर्य, सुनना और स्थिरता इस अवधि में उनकी मदद करेगी।`,
      },
      timing: 'This month',
      relevance: 9,
    });
  }

  // Saturn on child's 4th house (home/emotional security)
  for (const hit of transit.theirTransits) {
    if (hit.planet === 'Saturn' && hit.house === 4) {
      items.push({
        type: 'watch',
        text: {
          en: `Saturn transiting ${childName}'s 4th house may create a need for extra emotional security. Maintain routines and offer reassurance.`,
          hi: `शनि ${childName} के 4थे भाव में — अतिरिक्त भावनात्मक सुरक्षा की ज़रूरत हो सकती है। दिनचर्या बनाए रखें और आश्वासन दें।`,
        },
        timing: 'Ongoing',
        relevance: 8,
      });
    }
    if (hit.planet === 'Jupiter' && (hit.house === 5 || hit.house === 9)) {
      items.push({
        type: 'do',
        text: {
          en: `Jupiter blesses ${childName}'s house of learning. Encourage education, new skills, or spiritual practices during this transit.`,
          hi: `गुरु ${childName} के शिक्षा भाव को आशीर्वाद दे रहा है। इस गोचर में शिक्षा, नए कौशल या आध्यात्मिक अभ्यास को प्रोत्साहित करें।`,
        },
        timing: 'This quarter',
        relevance: 8,
      });
    }
  }

  if (dashaSync.inSync) {
    items.push({
      type: 'do',
      text: {
        en: `Your dasha periods are aligned with ${childName}'s developmental cycle. Parenting feels more natural now — trust your instincts.`,
        hi: `आपकी दशा ${childName} के विकास चक्र के साथ संरेखित है। पालन-पोषण अभी अधिक स्वाभाविक लगता है — अपनी सहज बुद्धि पर भरोसा करें।`,
      },
      timing: 'Current period',
      relevance: 7,
    });
  }

  return items.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
}

// ---------------------------------------------------------------------------
// Monthly Forecast
// ---------------------------------------------------------------------------

export function generateMonthlyForecast(
  transit: TransitRelationshipImpact,
  dashaSync: DashaSyncAnalysis,
  context: 'marriage' | 'children',
): LocaleText {
  const month = new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' });
  const contextEn = context === 'marriage' ? 'relationship' : 'parent-child bond';
  const contextHi = context === 'marriage' ? 'संबंध' : 'माता-पिता-संतान बंधन';

  const toneDescEn = transit.overallTone === 'supportive' ? 'favourable'
    : transit.overallTone === 'challenging' ? 'testing'
    : transit.overallTone === 'mixed' ? 'mixed — some growth, some friction'
    : 'calm and steady';
  const toneDescHi = transit.overallTone === 'supportive' ? 'अनुकूल'
    : transit.overallTone === 'challenging' ? 'परीक्षापूर्ण'
    : transit.overallTone === 'mixed' ? 'मिश्रित — कुछ वृद्धि, कुछ घर्षण'
    : 'शांत और स्थिर';

  let en = `${month} outlook for your ${contextEn}: ${toneDescEn}. `;
  let hi = `${month} में आपके ${contextHi} का दृष्टिकोण: ${toneDescHi}। `;

  if (dashaSync.inSync) {
    en += `Dasha alignment amplifies the bond. `;
    hi += `दशा संरेखण बंधन को बढ़ाता है। `;
  }

  en += transit.narrative.en;
  hi += transit.narrative.hi ?? transit.narrative.en;

  return { en, hi };
}

// ---------------------------------------------------------------------------
// Family Summary
// ---------------------------------------------------------------------------

export function generateFamilySummary(
  hasSpouse: boolean,
  childrenCount: number,
  marriageTone?: TransitRelationshipImpact['overallTone'],
  anyDashaSync?: boolean,
): LocaleText {
  let en = '';
  let hi = '';

  if (hasSpouse && childrenCount > 0) {
    en = `Your family dynamics are active across ${1 + childrenCount} relationships. `;
    hi = `आपकी पारिवारिक गतिशीलता ${1 + childrenCount} संबंधों में सक्रिय है। `;
  } else if (hasSpouse) {
    en = 'Your marriage is the primary relationship dynamic this period. ';
    hi = 'इस अवधि में आपका विवाह प्राथमिक संबंध गतिशीलता है। ';
  } else if (childrenCount > 0) {
    en = `Your parenting dynamic with ${childrenCount} ${childrenCount === 1 ? 'child' : 'children'} is in focus. `;
    hi = `${childrenCount} ${childrenCount === 1 ? 'संतान' : 'संतानों'} के साथ आपकी पालन-पोषण गतिशीलता केंद्र में है। `;
  }

  if (marriageTone === 'supportive') {
    en += 'Marriage transits are supportive — a nurturing foundation for the family. ';
    hi += 'वैवाहिक गोचर सहायक हैं — परिवार के लिए पोषणकारी आधार। ';
  } else if (marriageTone === 'challenging') {
    en += 'Marriage transits bring some tension — prioritise communication and patience. ';
    hi += 'वैवाहिक गोचर कुछ तनाव ला रहे हैं — संवाद और धैर्य को प्राथमिकता दें। ';
  }

  if (anyDashaSync) {
    en += 'Dasha alignment across charts creates a window for meaningful family connection.';
    hi += 'चार्ट्स में दशा संरेखण सार्थक पारिवारिक जुड़ाव का अवसर बनाता है।';
  }

  return { en: en.trim(), hi: hi.trim() };
}

// ---------------------------------------------------------------------------
// Upcoming Windows & Stress Periods (simplified — based on transit data)
// ---------------------------------------------------------------------------

export function generateUpcomingWindows(
  transit: TransitRelationshipImpact,
  dashaSync: DashaSyncAnalysis,
  context: 'marriage' | 'children',
): RelationshipWindow[] {
  const windows: RelationshipWindow[] = [];
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const twoMonths = new Date(now.getFullYear(), now.getMonth() + 2, 1);

  if (transit.overallTone === 'supportive') {
    windows.push({
      startDate: now.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0],
      type: 'bonding',
      description: {
        en: context === 'marriage'
          ? 'Benefic transits create a natural bonding window for your partnership.'
          : 'Positive transit energy supports quality time with your child.',
        hi: context === 'marriage'
          ? 'शुभ गोचर आपकी साझेदारी के लिए प्राकृतिक बंधन का अवसर बनाते हैं।'
          : 'सकारात्मक गोचर ऊर्जा आपके बच्चे के साथ गुणवत्ता समय का समर्थन करती है।',
      },
    });
  }

  if (dashaSync.inSync) {
    windows.push({
      startDate: now.toISOString().split('T')[0],
      endDate: twoMonths.toISOString().split('T')[0],
      type: 'milestone',
      description: {
        en: 'Dasha synchronicity makes this an auspicious period for relationship milestones.',
        hi: 'दशा समन्वय इसे संबंध के मील के पत्थरों के लिए शुभ अवधि बनाता है।',
      },
    });
  }

  return windows;
}

export function generateStressPeriods(
  transit: TransitRelationshipImpact,
): StressPeriod[] {
  const periods: StressPeriod[] = [];
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth() + 3, 1);

  // Flag stress from malefic transits on relationship houses
  const maleficHits = [...transit.yourTransits, ...transit.theirTransits].filter(
    h => ['Saturn', 'Rahu', 'Ketu', 'Mars'].includes(h.planet),
  );

  for (const hit of maleficHits) {
    periods.push({
      startDate: now.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      trigger: `${hit.planet} transiting ${hit.house}th house`,
      severity: hit.planet === 'Saturn' ? 'moderate' : hit.planet === 'Rahu' ? 'moderate' : 'mild',
      guidance: hit.effect,
    });
  }

  return periods;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/kundali/family-synthesis/__tests__/narrative-gen.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/family-synthesis/narrative-gen.ts src/lib/kundali/family-synthesis/__tests__/narrative-gen.test.ts
git commit -m "feat: narrative generation module for family synthesis"
```

---

### Task 7: Marriage Dynamics Module

Orchestrates all marriage-specific cross-chart factors into a single `RelationshipDynamics` output.

**Files:**
- Create: `src/lib/kundali/family-synthesis/marriage-dynamics.ts`

- [ ] **Step 1: Write failing test**

Add to `src/lib/kundali/family-synthesis/__tests__/family-synthesis.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { computeMarriageDynamics } from '../marriage-dynamics';
import type { KundaliData, PlanetPosition } from '@/types/kundali';

function makeFullChart(ascSign: number, overrides: Partial<KundaliData> = {}): KundaliData {
  const planets: PlanetPosition[] = [
    { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य' }, longitude: 270, sign: 10, degree: 0, isRetrograde: false, house: 10, nakshatra: 1, nakshatraPada: 1 },
    { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र' }, longitude: 60, sign: 3, degree: 0, isRetrograde: false, house: 3, nakshatra: 6, nakshatraPada: 2 },
    { id: 2, name: { en: 'Mars', hi: 'मंगल', sa: 'मंगल' }, longitude: 30, sign: 2, degree: 0, isRetrograde: false, house: 2, nakshatra: 3, nakshatraPada: 3 },
    { id: 3, name: { en: 'Mercury', hi: 'बुध', sa: 'बुध' }, longitude: 280, sign: 10, degree: 10, isRetrograde: false, house: 10, nakshatra: 21, nakshatraPada: 1 },
    { id: 4, name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु' }, longitude: 120, sign: 5, degree: 0, isRetrograde: false, house: 5, nakshatra: 11, nakshatraPada: 1 },
    { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र' }, longitude: 180, sign: 7, degree: 0, isRetrograde: false, house: 7, nakshatra: 14, nakshatraPada: 1 },
    { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनि' }, longitude: 330, sign: 12, degree: 0, isRetrograde: false, house: 12, nakshatra: 26, nakshatraPada: 1 },
    { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहु' }, longitude: 90, sign: 4, degree: 0, isRetrograde: true, house: 4, nakshatra: 8, nakshatraPada: 1 },
    { id: 8, name: { en: 'Ketu', hi: 'केतु', sa: 'केतु' }, longitude: 270, sign: 10, degree: 0, isRetrograde: true, house: 10, nakshatra: 22, nakshatraPada: 1 },
  ] as PlanetPosition[];

  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, 0, 1).toISOString();
  const fiveYearsLater = new Date(now.getFullYear() + 5, 0, 1).toISOString();

  return {
    birthData: { name: 'Test', date: '1990-01-15', time: '06:00', place: 'Delhi', lat: 28.6, lng: 77.2, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' },
    ascendant: { degree: 10, sign: ascSign, signName: { en: 'Test', hi: 'Test', sa: 'Test' } },
    planets,
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: ((ascSign - 1 + i) % 12) + 1, degree: i * 30 })),
    chart: { planets },
    navamshaChart: { planets },
    dashas: [
      { planet: 'Venus', startDate: oneYearAgo, endDate: fiveYearsLater, level: 0 },
    ],
    shadbala: [],
    ayanamshaValue: 24.2,
    julianDay: 2447913.5,
    ...overrides,
  } as unknown as KundaliData;
}

describe('computeMarriageDynamics', () => {
  it('produces a complete RelationshipDynamics for two charts', () => {
    const chartA = makeFullChart(1);
    const chartB = makeFullChart(4);
    const transitPlanets = chartA.planets; // use natal as proxy for transits in test
    const result = computeMarriageDynamics(chartA, chartB, transitPlanets);

    expect(result.synastryHighlights).toBeDefined();
    expect(result.vargaCrossRead.vargaType).toBe('D9');
    expect(result.transitImpact.overallTone).toBeTruthy();
    expect(result.dashaSynchronicity).toBeDefined();
    expect(result.currentDynamic.en).toBeTruthy();
    expect(result.actionItems.length).toBeGreaterThan(0);
    expect(result.monthlyForecast.en).toBeTruthy();
    // Guna score should exist for marriage
    expect(typeof result.gunaScore).toBe('number');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/family-synthesis/__tests__/family-synthesis.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement marriage-dynamics.ts**

Create `src/lib/kundali/family-synthesis/marriage-dynamics.ts`:

```typescript
/**
 * Marriage Dynamics — computes the full RelationshipDynamics overlay for marriage.
 *
 * Orchestrates: Ashta Kuta, synastry, D9 cross-read, transit impact, dasha sync,
 * karmic indicators, and narrative generation.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { RelationshipDynamics, SynastryHighlight, KarmicIndicator } from './types';
import { computeVargaCrossRead } from './varga-cross-read';
import { computeTransitRelationshipImpact } from './transit-relationship';
import { computeDashaSynchronicity } from './dasha-sync';
import {
  generateMarriageActionItems, generateMonthlyForecast,
  generateUpcomingWindows, generateStressPeriods,
} from './narrative-gen';
import { computeEnhancedSynastry, computeSynastrySummary } from '@/lib/comparison/synastry-engine';
import { computeAshtaKuta, type MatchInput } from '@/lib/matching/ashta-kuta';

// Aspect nature classification
const HARMONIOUS_ASPECTS = new Set(['conjunction', 'trine', 'sextile']);
const CHALLENGING_ASPECTS = new Set(['opposition', 'square']);

// Planet id → name lookup
const PLANET_NAMES_MAP: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sun', hi: 'सूर्य' }, 1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' }, 3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'गुरु' }, 5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' }, 7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

/** Map SynastryAspect from the synastry engine to our SynastryHighlight format. */
function mapSynastryHighlights(chartA: KundaliData, chartB: KundaliData): SynastryHighlight[] {
  try {
    const aspects = computeEnhancedSynastry(chartA, chartB);
    const sorted = aspects.sort((a, b) => Math.abs(a.orb) - Math.abs(b.orb));

    return sorted.slice(0, 5).map(asp => {
      const pA = PLANET_NAMES_MAP[asp.planetA] ?? { en: `Planet ${asp.planetA}`, hi: `ग्रह ${asp.planetA}` };
      const pB = PLANET_NAMES_MAP[asp.planetB] ?? { en: `Planet ${asp.planetB}`, hi: `ग्रह ${asp.planetB}` };
      const nature: SynastryHighlight['nature'] = asp.isHarmonious ? 'harmonious' : 'challenging';
      const aspectName = asp.type.toLowerCase();

      return {
        yourPlanet: pA.en,
        theirPlanet: pB.en,
        aspect: aspectName,
        orb: Math.round(Math.abs(asp.orb) * 10) / 10,
        nature,
        interpretation: asp.interpretation ?? {
          en: `${pA.en} ${aspectName} ${pB.en} — ${nature} dynamic.`,
          hi: `${pA.hi} ${aspectName} ${pB.hi} — ${nature === 'harmonious' ? 'सामंजस्यपूर्ण' : 'चुनौतीपूर्ण'} गतिशीलता।`,
        },
      };
    });
  } catch (err) {
    console.warn('[marriage-dynamics] synastry computation failed:', err);
    return [];
  }
}

/** Compute Ashta Kuta Guna Milan score. */
function computeGunaScore(chartA: KundaliData, chartB: KundaliData): { score: number; breakdown?: Record<string, number> } {
  try {
    const moonA = chartA.planets.find(p => p.id === 1);
    const moonB = chartB.planets.find(p => p.id === 1);
    if (!moonA || !moonB) return { score: 0 };

    const inputA: MatchInput = {
      moonNakshatra: moonA.nakshatra ?? Math.ceil((moonA.longitude * 27) / 360),
      moonRashi: moonA.sign,
      moonPada: moonA.nakshatraPada,
    };
    const inputB: MatchInput = {
      moonNakshatra: moonB.nakshatra ?? Math.ceil((moonB.longitude * 27) / 360),
      moonRashi: moonB.sign,
      moonPada: moonB.nakshatraPada,
    };

    const result = computeAshtaKuta(inputA, inputB);
    const breakdown: Record<string, number> = {};
    for (const k of result.kutas) {
      breakdown[k.name.en.toLowerCase()] = k.scored;
    }

    return { score: result.totalScore, breakdown };
  } catch (err) {
    console.warn('[marriage-dynamics] guna computation failed:', err);
    return { score: 0 };
  }
}

/** Detect karmic indicators (Rahu-Ketu contacts, Saturn aspects). */
function detectKarmicIndicators(chartA: KundaliData, chartB: KundaliData): KarmicIndicator[] {
  const indicators: KarmicIndicator[] = [];

  const rahuA = chartA.planets.find(p => p.id === 7);
  const ketuA = chartA.planets.find(p => p.id === 8);
  const rahuB = chartB.planets.find(p => p.id === 7);
  const ketuB = chartB.planets.find(p => p.id === 8);

  // Rahu-Ketu axis overlap (same sign axis)
  if (rahuA && rahuB && (rahuA.sign === rahuB.sign || rahuA.sign === ketuB?.sign)) {
    indicators.push({
      type: 'rahu_ketu_axis',
      description: {
        en: 'Your Rahu-Ketu axes overlap, indicating a deep karmic bond. This relationship carries past-life significance.',
        hi: 'आपकी राहु-केतु अक्ष ओवरलैप करती हैं, जो गहरे कर्म बंधन का संकेत है। इस संबंध में पूर्व जन्म का महत्व है।',
      },
      strength: 9,
    });
  }

  // Nodal contact with personal planets
  const personalPlanetIds = [0, 1, 5]; // Sun, Moon, Venus
  for (const pid of personalPlanetIds) {
    const pA = chartA.planets.find(p => p.id === pid);
    if (pA && rahuB && pA.sign === rahuB.sign) {
      indicators.push({
        type: 'nodal_contact',
        description: {
          en: `Your ${pA.name?.en ?? 'planet'} conjuncts their Rahu — a magnetic attraction with a karmic quality.`,
          hi: `आपका ${pA.name?.hi ?? 'ग्रह'} उनके राहु से युति — कर्मिक गुणवत्ता के साथ चुंबकीय आकर्षण।`,
        },
        strength: 7,
      });
    }
  }

  // Saturn cross-aspects (on each other's Moon or Venus)
  const satA = chartA.planets.find(p => p.id === 6);
  const satB = chartB.planets.find(p => p.id === 6);
  const moonB = chartB.planets.find(p => p.id === 1);
  const venusB = chartB.planets.find(p => p.id === 5);

  if (satA && moonB && satA.sign === moonB.sign) {
    indicators.push({
      type: 'saturn_aspect',
      description: {
        en: 'Your Saturn on their Moon creates a stabilising but sometimes restrictive emotional dynamic.',
        hi: 'आपका शनि उनके चंद्रमा पर — भावनात्मक गतिशीलता को स्थिर लेकिन कभी-कभी प्रतिबंधात्मक बनाता है।',
      },
      strength: 6,
    });
  }

  if (satB && chartA.planets.find(p => p.id === 5) && satB.sign === chartA.planets.find(p => p.id === 5)?.sign) {
    indicators.push({
      type: 'saturn_aspect',
      description: {
        en: 'Their Saturn on your Venus tests romantic expression but builds enduring commitment.',
        hi: 'उनका शनि आपके शुक्र पर — रोमांटिक अभिव्यक्ति की परीक्षा लेकिन स्थायी प्रतिबद्धता बनाता है।',
      },
      strength: 6,
    });
  }

  return indicators;
}

/** Generate Darakaraka analysis text. */
function analyzeDarakaraka(chartA: KundaliData, chartB: KundaliData): { en: string; hi: string } {
  // DK = planet with 7th lowest degree (excluding Rahu/Ketu in some systems)
  // Simplified: use Jaimini charaKarakas if available
  const dkA = chartA.jaimini?.charaKarakas?.find((k: { role: string }) => k.role === 'DK');
  const dkB = chartB.jaimini?.charaKarakas?.find((k: { role: string }) => k.role === 'DK');

  if (dkA && dkB) {
    return {
      en: `Your Darakaraka (${dkA.planet ?? 'DK'}) and their Darakaraka (${dkB.planet ?? 'DK'}) reveal complementary partnership needs.`,
      hi: `आपका दारकारक (${dkA.planet ?? 'DK'}) और उनका दारकारक (${dkB.planet ?? 'DK'}) पूरक साझेदारी आवश्यकताओं को प्रकट करते हैं।`,
    };
  }

  return {
    en: 'Darakaraka analysis reveals the nature of your partnership needs based on Jaimini principles.',
    hi: 'दारकारक विश्लेषण जैमिनी सिद्धांतों के आधार पर आपकी साझेदारी आवश्यकताओं की प्रकृति को प्रकट करता है।',
  };
}

/**
 * Compute complete marriage dynamics between two charts.
 */
export function computeMarriageDynamics(
  userChart: KundaliData,
  spouseChart: KundaliData,
  transitPlanets: PlanetPosition[],
): RelationshipDynamics {
  // Cross-chart analysis
  const synastryHighlights = mapSynastryHighlights(userChart, spouseChart);
  const { score: gunaScore, breakdown } = computeGunaScore(userChart, spouseChart);
  const vargaCrossRead = computeVargaCrossRead(userChart, spouseChart, 'D9');
  const karmicIndicators = detectKarmicIndicators(userChart, spouseChart);
  const karakaAnalysis = analyzeDarakaraka(userChart, spouseChart);

  // Temporal dynamics
  const transitImpact = computeTransitRelationshipImpact(userChart, spouseChart, transitPlanets, 'marriage');
  const dashaSynchronicity = computeDashaSynchronicity(userChart, spouseChart, 'marriage');
  const upcomingWindows = generateUpcomingWindows(transitImpact, dashaSynchronicity, 'marriage');
  const stressPeriods = generateStressPeriods(transitImpact);

  // Narrative
  const actionItems = generateMarriageActionItems(transitImpact, dashaSynchronicity, synastryHighlights, gunaScore);
  const monthlyForecast = generateMonthlyForecast(transitImpact, dashaSynchronicity, 'marriage');

  // Current dynamic narrative
  const currentDynamic = buildCurrentDynamic(transitImpact, dashaSynchronicity, gunaScore, vargaCrossRead.compatibility);

  return {
    synastryHighlights,
    gunaScore,
    gunaBreakdown: breakdown ? {
      varna: breakdown.varna ?? 0,
      vashya: breakdown.vashya ?? 0,
      tara: breakdown.tara ?? 0,
      yoni: breakdown.yoni ?? 0,
      grahaMaitri: breakdown.graha_maitri ?? breakdown.grahamaitri ?? 0,
      gana: breakdown.gana ?? 0,
      bhakut: breakdown.bhakut ?? 0,
      nadi: breakdown.nadi ?? 0,
    } : undefined,
    vargaCrossRead,
    karmicIndicators,
    karakaAnalysis,
    transitImpact,
    dashaSynchronicity,
    upcomingWindows,
    stressPeriods,
    currentDynamic,
    actionItems,
    monthlyForecast,
  };
}

function buildCurrentDynamic(
  transit: { overallTone: string; narrative: { en: string; hi?: string } },
  dashaSync: { inSync: boolean; yourDasha: string; theirDasha: string },
  gunaScore: number,
  vargaCompat: number,
): { en: string; hi: string } {
  const gunaLabel = gunaScore >= 28 ? 'excellent' : gunaScore >= 21 ? 'good' : gunaScore >= 14 ? 'average' : 'challenging';
  const gunaLabelHi = gunaScore >= 28 ? 'उत्कृष्ट' : gunaScore >= 21 ? 'अच्छी' : gunaScore >= 14 ? 'औसत' : 'चुनौतीपूर्ण';

  let en = `Your marriage rests on ${gunaLabel} foundational compatibility (${gunaScore}/36 Guna Milan) `;
  en += `with a ${vargaCompat >= 7 ? 'strong' : vargaCompat >= 5 ? 'moderate' : 'developing'} Navamsha connection. `;
  en += transit.narrative.en + ' ';
  if (dashaSync.inSync) {
    en += `Your ${dashaSync.yourDasha} and their ${dashaSync.theirDasha} dashas are synchronised — both charts resonate in the partnership domain.`;
  }

  let hi = `आपका विवाह ${gunaLabelHi} मूलभूत अनुकूलता (${gunaScore}/36 गुण मिलान) पर आधारित है `;
  hi += `${vargaCompat >= 7 ? 'मज़बूत' : vargaCompat >= 5 ? 'मध्यम' : 'विकासशील'} नवांश संबंध के साथ। `;
  hi += (transit.narrative.hi ?? transit.narrative.en) + ' ';
  if (dashaSync.inSync) {
    hi += `आपकी ${dashaSync.yourDasha} और उनकी ${dashaSync.theirDasha} दशाएँ समन्वित हैं।`;
  }

  return { en: en.trim(), hi: hi.trim() };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/kundali/family-synthesis/__tests__/family-synthesis.test.ts`
Expected: PASS

Note: If the `computeMatch` import doesn't resolve (may be named differently in `ashta-kuta.ts`), check the actual export name and adjust the import. The test fixture may also need adjustments to match the exact `SynastryAspect` shape returned by `computeEnhancedSynastry`. Handle any type mismatches by inspecting the actual types and adjusting the mapping function.

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/family-synthesis/marriage-dynamics.ts src/lib/kundali/family-synthesis/__tests__/family-synthesis.test.ts
git commit -m "feat: marriage dynamics module"
```

---

### Task 8: Child Dynamics Module

Orchestrates per-child cross-chart analysis.

**Files:**
- Create: `src/lib/kundali/family-synthesis/child-dynamics.ts`

- [ ] **Step 1: Add test to family-synthesis.test.ts**

Append to `src/lib/kundali/family-synthesis/__tests__/family-synthesis.test.ts`:

```typescript
import { computeChildDynamics } from '../child-dynamics';

describe('computeChildDynamics', () => {
  it('produces RelationshipDynamics for a parent-child pair', () => {
    const parent = makeFullChart(1);
    const child = makeFullChart(7);
    const transitPlanets = parent.planets;
    const result = computeChildDynamics(parent, child, 'Arjun', transitPlanets);

    expect(result.synastryHighlights).toBeDefined();
    expect(result.vargaCrossRead.vargaType).toBe('D7');
    expect(result.transitImpact.overallTone).toBeTruthy();
    expect(result.dashaSynchronicity).toBeDefined();
    expect(result.currentDynamic.en).toBeTruthy();
    expect(result.actionItems.length).toBeGreaterThan(0);
    expect(result.monthlyForecast.en).toBeTruthy();
    // No guna score for children
    expect(result.gunaScore).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/family-synthesis/__tests__/family-synthesis.test.ts`
Expected: FAIL on the new test.

- [ ] **Step 3: Implement child-dynamics.ts**

Create `src/lib/kundali/family-synthesis/child-dynamics.ts`:

```typescript
/**
 * Child Dynamics — computes RelationshipDynamics for a parent-child pair.
 *
 * Orchestrates: parent-child synastry, D7 cross-read, Moon connection,
 * Jupiter/Saturn dynamics, transit impact, dasha sync, and narrative generation.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { RelationshipDynamics, SynastryHighlight, KarmicIndicator } from './types';
import { computeVargaCrossRead } from './varga-cross-read';
import { computeTransitRelationshipImpact } from './transit-relationship';
import { computeDashaSynchronicity } from './dasha-sync';
import {
  generateChildActionItems, generateMonthlyForecast,
  generateUpcomingWindows, generateStressPeriods,
} from './narrative-gen';
import { computeEnhancedSynastry } from '@/lib/comparison/synastry-engine';

const PLANET_NAMES_MAP: Record<number, { en: string; hi: string }> = {
  0: { en: 'Sun', hi: 'सूर्य' }, 1: { en: 'Moon', hi: 'चन्द्र' },
  2: { en: 'Mars', hi: 'मंगल' }, 3: { en: 'Mercury', hi: 'बुध' },
  4: { en: 'Jupiter', hi: 'गुरु' }, 5: { en: 'Venus', hi: 'शुक्र' },
  6: { en: 'Saturn', hi: 'शनि' }, 7: { en: 'Rahu', hi: 'राहु' },
  8: { en: 'Ketu', hi: 'केतु' },
};

function mapSynastryHighlights(chartA: KundaliData, chartB: KundaliData): SynastryHighlight[] {
  try {
    const aspects = computeEnhancedSynastry(chartA, chartB);
    return aspects
      .sort((a, b) => Math.abs(a.orb) - Math.abs(b.orb))
      .slice(0, 5)
      .map(asp => {
        const pA = PLANET_NAMES_MAP[asp.planetA] ?? { en: `Planet ${asp.planetA}`, hi: `ग्रह ${asp.planetA}` };
        const pB = PLANET_NAMES_MAP[asp.planetB] ?? { en: `Planet ${asp.planetB}`, hi: `ग्रह ${asp.planetB}` };
        const aspectName = asp.type.toLowerCase();
        return {
          yourPlanet: pA.en,
          theirPlanet: pB.en,
          aspect: aspectName,
          orb: Math.round(Math.abs(asp.orb) * 10) / 10,
          nature: asp.isHarmonious ? 'harmonious' as const : 'challenging' as const,
          interpretation: asp.interpretation ?? {
            en: `${pA.en} ${aspectName} ${pB.en}.`,
            hi: `${pA.hi} ${aspectName} ${pB.hi}।`,
          },
        };
      });
  } catch (err) {
    console.warn('[child-dynamics] synastry computation failed:', err);
    return [];
  }
}

function analyzeMoonConnection(parent: KundaliData, child: KundaliData): { en: string; hi: string } {
  const moonP = parent.planets.find(p => p.id === 1);
  const moonC = child.planets.find(p => p.id === 1);

  if (!moonP || !moonC) {
    return { en: 'Moon connection data not available.', hi: 'चंद्र संबंध डेटा उपलब्ध नहीं है।' };
  }

  const sameSigns = moonP.sign === moonC.sign;
  const friendlySigns = Math.abs(moonP.sign - moonC.sign) % 6 === 0; // same element rough check

  if (sameSigns) {
    return {
      en: 'Your Moons share the same sign — a natural emotional resonance. You intuitively understand this child\'s feelings.',
      hi: 'आपके चंद्रमा एक ही राशि में हैं — प्राकृतिक भावनात्मक अनुनाद। आप सहज रूप से इस बच्चे की भावनाओं को समझते हैं।',
    };
  }
  if (friendlySigns) {
    return {
      en: 'Your Moons are in compatible signs, supporting emotional understanding between parent and child.',
      hi: 'आपके चंद्रमा अनुकूल राशियों में हैं, माता-पिता और बच्चे के बीच भावनात्मक समझ का समर्थन करते हैं।',
    };
  }

  return {
    en: 'Your Moons are in different elements — emotional expression styles may differ. Conscious effort in understanding helps bridge this gap.',
    hi: 'आपके चंद्रमा अलग-अलग तत्वों में हैं — भावनात्मक अभिव्यक्ति शैली भिन्न हो सकती है। समझने में सचेत प्रयास इस अंतर को पाटने में मदद करता है।',
  };
}

function detectChildKarmicIndicators(parent: KundaliData, child: KundaliData): KarmicIndicator[] {
  const indicators: KarmicIndicator[] = [];

  const rahuP = parent.planets.find(p => p.id === 7);
  const ketuP = parent.planets.find(p => p.id === 8);
  const rahuC = child.planets.find(p => p.id === 7);
  const moonC = child.planets.find(p => p.id === 1);

  // Nodal contacts
  if (rahuP && moonC && rahuP.sign === moonC.sign) {
    indicators.push({
      type: 'nodal_contact',
      description: {
        en: 'Your Rahu on their Moon — you play a pivotal role in this child\'s emotional growth and life direction.',
        hi: 'आपका राहु उनके चंद्रमा पर — आप इस बच्चे की भावनात्मक वृद्धि और जीवन दिशा में महत्वपूर्ण भूमिका निभाते हैं।',
      },
      strength: 8,
    });
  }

  if (rahuC && parent.planets.find(p => p.id === 0)?.sign === rahuC.sign) {
    indicators.push({
      type: 'nodal_contact',
      description: {
        en: 'Their Rahu on your Sun — this child pushes you to grow in ways you didn\'t expect.',
        hi: 'उनका राहु आपके सूर्य पर — यह बच्चा आपको अप्रत्याशित तरीकों से बढ़ने के लिए प्रेरित करता है।',
      },
      strength: 7,
    });
  }

  return indicators;
}

function analyzePutrakaraka(parent: KundaliData, child: KundaliData): { en: string; hi: string } {
  const pk = parent.jaimini?.charaKarakas?.find((k: { role: string }) => k.role === 'PK');

  if (pk) {
    return {
      en: `Your Putrakaraka (${pk.planet ?? 'PK'}) guides the nature of your parenting style and what you seek to nurture in your children.`,
      hi: `आपका पुत्रकारक (${pk.planet ?? 'PK'}) आपकी पालन-पोषण शैली और आप अपने बच्चों में क्या पोषित करना चाहते हैं, इसका मार्गदर्शन करता है।`,
    };
  }

  return {
    en: 'Putrakaraka analysis reveals your innate parenting strengths based on Jaimini principles.',
    hi: 'पुत्रकारक विश्लेषण जैमिनी सिद्धांतों के आधार पर आपकी जन्मजात पालन-पोषण शक्तियों को प्रकट करता है।',
  };
}

/**
 * Compute complete child dynamics between parent and child charts.
 */
export function computeChildDynamics(
  parentChart: KundaliData,
  childChart: KundaliData,
  childName: string,
  transitPlanets: PlanetPosition[],
): RelationshipDynamics {
  const synastryHighlights = mapSynastryHighlights(parentChart, childChart);
  const vargaCrossRead = computeVargaCrossRead(parentChart, childChart, 'D7');
  const karmicIndicators = detectChildKarmicIndicators(parentChart, childChart);
  const moonConnection = analyzeMoonConnection(parentChart, childChart);
  const karakaAnalysis = analyzePutrakaraka(parentChart, childChart);

  const transitImpact = computeTransitRelationshipImpact(parentChart, childChart, transitPlanets, 'children');
  const dashaSynchronicity = computeDashaSynchronicity(parentChart, childChart, 'children');
  const upcomingWindows = generateUpcomingWindows(transitImpact, dashaSynchronicity, 'children');
  const stressPeriods = generateStressPeriods(transitImpact);

  const actionItems = generateChildActionItems(transitImpact, dashaSynchronicity, childName);
  const monthlyForecast = generateMonthlyForecast(transitImpact, dashaSynchronicity, 'children');

  // Build current dynamic narrative
  const toneEn = transitImpact.overallTone === 'supportive' ? 'nurturing'
    : transitImpact.overallTone === 'challenging' ? 'requiring patience'
    : transitImpact.overallTone === 'mixed' ? 'mixed' : 'steady';
  const toneHi = transitImpact.overallTone === 'supportive' ? 'पोषणकारी'
    : transitImpact.overallTone === 'challenging' ? 'धैर्य की आवश्यकता'
    : transitImpact.overallTone === 'mixed' ? 'मिश्रित' : 'स्थिर';

  let enDynamic = `Your bond with ${childName} is in a ${toneEn} phase. `;
  let hiDynamic = `${childName} के साथ आपका बंधन ${toneHi} चरण में है। `;
  enDynamic += moonConnection.en + ' ';
  hiDynamic += moonConnection.hi + ' ';
  if (dashaSynchronicity.inSync) {
    enDynamic += `Your dasha periods are aligned with ${childName}'s developmental cycle.`;
    hiDynamic += `आपकी दशाएँ ${childName} के विकास चक्र के साथ संरेखित हैं।`;
  }

  return {
    synastryHighlights,
    gunaScore: undefined, // Not applicable for parent-child
    gunaBreakdown: undefined,
    vargaCrossRead,
    karmicIndicators,
    karakaAnalysis,
    transitImpact,
    dashaSynchronicity,
    upcomingWindows,
    stressPeriods,
    currentDynamic: { en: enDynamic.trim(), hi: hiDynamic.trim() },
    actionItems,
    monthlyForecast,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/kundali/family-synthesis/__tests__/family-synthesis.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/family-synthesis/child-dynamics.ts src/lib/kundali/family-synthesis/__tests__/family-synthesis.test.ts
git commit -m "feat: child dynamics module"
```

---

### Task 9: Orchestrator + API Route

The orchestrator ties all modules together. The API route handles auth, caching, and serves the result.

**Files:**
- Create: `src/lib/kundali/family-synthesis/index.ts`
- Create: `src/app/api/family-synthesis/route.ts`

- [ ] **Step 1: Implement the orchestrator**

Create `src/lib/kundali/family-synthesis/index.ts`:

```typescript
/**
 * Family Synthesis Orchestrator
 *
 * Takes the user's primary kundali + family charts, runs all cross-chart
 * analysis modules, and assembles the FamilyReading payload.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { FamilyContext, FamilyReading } from './types';
import { computeMarriageDynamics } from './marriage-dynamics';
import { computeChildDynamics } from './child-dynamics';
import { generateFamilySummary } from './narrative-gen';

/**
 * Compute the complete family reading.
 *
 * @param userKundali - The logged-in user's computed kundali
 * @param familyContext - Spouse and children kundali data
 * @param transitPlanets - Current planetary positions for transit analysis
 */
export function computeFamilyReading(
  userKundali: KundaliData,
  familyContext: FamilyContext,
  transitPlanets: PlanetPosition[],
): FamilyReading {
  // Marriage dynamics
  const marriageDynamics = familyContext.spouse
    ? computeMarriageDynamics(userKundali, familyContext.spouse.kundali, transitPlanets)
    : null;

  // Children dynamics (one per child)
  const childrenDynamics = familyContext.children.map(child =>
    ({
      childName: child.name,
      chartId: child.chartId,
      dynamics: computeChildDynamics(userKundali, child.kundali, child.name, transitPlanets),
    }),
  );

  // Family summary
  const familySummary = generateFamilySummary(
    !!familyContext.spouse,
    familyContext.children.length,
    marriageDynamics?.transitImpact.overallTone,
    marriageDynamics?.dashaSynchronicity.inSync ||
      childrenDynamics.some(c => c.dynamics.dashaSynchronicity.inSync),
  );

  return {
    marriageDynamics,
    childrenDynamics,
    familySummary,
    computedAt: new Date().toISOString(),
  };
}
```

- [ ] **Step 2: Implement the API route**

Create `src/app/api/family-synthesis/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { computeFamilyReading } from '@/lib/kundali/family-synthesis';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import type { FamilyContext, FamilyMember } from '@/lib/kundali/family-synthesis/types';
import type { BirthData } from '@/types/kundali';

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // Auth
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '').trim();
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const forceRecompute = body?.forceRecompute === true;

  try {
    // 1. Get user's primary kundali snapshot
    const { data: snapshot, error: snapError } = await supabase
      .from('kundali_snapshots')
      .select('full_kundali')
      .eq('user_id', user.id)
      .single();

    if (snapError || !snapshot?.full_kundali) {
      return NextResponse.json({ error: 'No primary kundali found. Generate your birth chart first.' }, { status: 404 });
    }

    // 2. Get family charts
    const { data: familyCharts, error: chartError } = await supabase
      .from('saved_charts')
      .select('id, label, birth_data, relationship')
      .eq('user_id', user.id)
      .in('relationship', ['spouse', 'child'])
      .order('created_at', { ascending: true });

    if (chartError) {
      console.error('[family-synthesis] chart query error:', chartError);
      return NextResponse.json({ error: 'Failed to load family charts' }, { status: 500 });
    }

    if (!familyCharts || familyCharts.length === 0) {
      return NextResponse.json({ familyReading: null, cached: false, chartIds: [] });
    }

    const currentChartIds = familyCharts.map(c => c.id).sort();

    // 3. Cache check
    if (!forceRecompute) {
      const { data: cached } = await supabase
        .from('family_readings')
        .select('reading_data, computed_at, chart_ids')
        .eq('user_id', user.id)
        .single();

      if (cached) {
        const cachedIds = [...(cached.chart_ids || [])].sort();
        const idsMatch = JSON.stringify(cachedIds) === JSON.stringify(currentChartIds);
        const age = Date.now() - new Date(cached.computed_at).getTime();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (idsMatch && age < maxAge) {
          return NextResponse.json({
            familyReading: cached.reading_data,
            cached: true,
            chartIds: currentChartIds,
          });
        }
      }
    }

    // 4. Compute kundalis for family members
    const userKundali = snapshot.full_kundali;

    // For spouse, pick the most recent one if multiple exist
    const spouseCharts = familyCharts.filter(c => c.relationship === 'spouse');
    const spouseChart = spouseCharts[spouseCharts.length - 1]; // most recent
    if (spouseCharts.length > 1) {
      console.warn(`[family-synthesis] User ${user.id} has ${spouseCharts.length} spouse charts, using most recent`);
    }

    const childCharts = familyCharts.filter(c => c.relationship === 'child');

    const familyContext: FamilyContext = { children: [] };

    if (spouseChart) {
      const bd = spouseChart.birth_data as BirthData;
      const spouseKundali = generateKundali(bd);
      familyContext.spouse = {
        chartId: spouseChart.id,
        kundali: spouseKundali,
        name: bd.name || spouseChart.label || 'Spouse',
      };
    }

    for (let i = 0; i < childCharts.length; i++) {
      const cc = childCharts[i];
      const bd = cc.birth_data as BirthData;
      const childKundali = generateKundali(bd);
      familyContext.children.push({
        chartId: cc.id,
        kundali: childKundali,
        name: bd.name || cc.label || `Child ${i + 1}`,
        birthOrder: i + 1,
      });
    }

    // 5. Get current transit positions
    const now = new Date();
    const lat = userKundali.birthData?.lat ?? 46.47;
    const lng = userKundali.birthData?.lng ?? 6.86;
    const panchang = computePanchang({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      lat,
      lng,
      tzOffset: 1, // Will be refined by timezone
      timezone: 'Europe/Zurich',
    });
    // Map Graha[] to PlanetPosition-compatible objects for transit analysis
    const transitPlanets = (panchang.planets ?? []).map(g => ({
      id: g.id,
      name: g.name,
      longitude: g.longitude ?? 0,
      sign: g.rashi ?? Math.floor((g.longitude ?? 0) / 30) + 1,
      degree: (g.longitude ?? 0) % 30,
      isRetrograde: g.isRetrograde ?? false,
      house: 0, // not needed for transit analysis
    })) as PlanetPosition[];

    // 6. Compute family reading
    const familyReading = computeFamilyReading(userKundali, familyContext, transitPlanets);

    // 7. Cache result (upsert)
    const { error: upsertError } = await supabase
      .from('family_readings')
      .upsert({
        user_id: user.id,
        reading_data: familyReading,
        computed_at: new Date().toISOString(),
        chart_ids: currentChartIds,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (upsertError) {
      console.error('[family-synthesis] cache upsert error:', upsertError);
      // Non-fatal — we still return the computed result
    }

    return NextResponse.json({
      familyReading,
      cached: false,
      chartIds: currentChartIds,
    });
  } catch (err) {
    console.error('[family-synthesis] computation error:', err);
    return NextResponse.json({ error: 'Family synthesis computation failed' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Verify build**

Run:
```bash
npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep -v mangal-dosha
```
Expected: No new errors. Fix any import resolution issues (e.g., `computeMatch` vs `calculateMatch` in ashta-kuta, `computePanchang` parameters).

- [ ] **Step 4: Commit**

```bash
git add src/lib/kundali/family-synthesis/index.ts src/app/api/family-synthesis/route.ts
git commit -m "feat: family synthesis orchestrator + API route"
```

---

### Task 10: Save Chart Path Update

Write the `relationship` column when saving a chart.

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx` (handleSaveChart function)

- [ ] **Step 1: Find and update the save insert**

In `src/app/[locale]/kundali/page.tsx`, find the `handleSaveChart` function's supabase insert call (around line 370-390). Add `relationship` as a top-level column:

Find the insert object:
```typescript
const { error } = await supabase.from('saved_charts').insert({
  user_id: user.id,
  label: kundali.birthData.name || 'Chart',
  birth_data: {
```

Add `relationship` at the top level of the insert object, after `is_primary`:

```typescript
  is_primary: isSelf,
  relationship: relationship || 'self',   // <-- add this line
```

Where `relationship` is the variable already extracted from `kundali.birthData.relationship || 'self'` earlier in the function.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep -v mangal-dosha`
Expected: No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/kundali/page.tsx
git commit -m "feat: write relationship column on chart save"
```

---

### Task 11: Dashboard UI Components

Build the FamilyCard (compact), FamilyMarriageDetail, FamilyChildDetail, and FamilyActionItems components.

**Files:**
- Create: `src/components/dashboard/FamilyActionItems.tsx`
- Create: `src/components/dashboard/FamilyMarriageDetail.tsx`
- Create: `src/components/dashboard/FamilyChildDetail.tsx`
- Create: `src/components/dashboard/FamilyCard.tsx`

- [ ] **Step 1: Create FamilyActionItems (shared component)**

Create `src/components/dashboard/FamilyActionItems.tsx`:

```typescript
'use client';

import type { ActionItem } from '@/lib/kundali/family-synthesis/types';
import { tl } from '@/lib/utils/trilingual';
import { getBodyFont } from '@/lib/utils/locale-fonts';

interface FamilyActionItemsProps {
  items: ActionItem[];
  locale: string;
}

const TYPE_STYLES: Record<ActionItem['type'], { bg: string; border: string; text: string; label: string; labelHi: string }> = {
  do:    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', label: 'Do', labelHi: 'करें' },
  avoid: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', label: 'Avoid', labelHi: 'बचें' },
  watch: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', label: 'Watch', labelHi: 'ध्यान दें' },
};

export default function FamilyActionItems({ items, locale }: FamilyActionItemsProps) {
  const bodyStyle = getBodyFont(locale);

  if (items.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => {
        const style = TYPE_STYLES[item.type];
        return (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-xl ${style.bg} border ${style.border} px-3.5 py-2.5`}
          >
            <span className={`text-xs font-semibold uppercase tracking-wider shrink-0 mt-0.5 ${style.text}`}>
              {locale === 'hi' || locale === 'sa' ? style.labelHi : style.label}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm leading-relaxed" style={bodyStyle}>
                {tl(item.text, locale)}
              </p>
              {item.timing && (
                <span className="text-text-secondary text-xs mt-1 block">
                  {item.timing}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create FamilyMarriageDetail**

Create `src/components/dashboard/FamilyMarriageDetail.tsx`:

```typescript
'use client';

import { useState } from 'react';
import type { RelationshipDynamics } from '@/lib/kundali/family-synthesis/types';
import { tl } from '@/lib/utils/trilingual';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import FamilyActionItems from './FamilyActionItems';

interface FamilyMarriageDetailProps {
  dynamics: RelationshipDynamics;
  locale: string;
  onClose: () => void;
}

const LABELS = {
  title:        { en: 'Marriage Dynamics', hi: 'वैवाहिक गतिशीलता' },
  compatibility:{ en: 'Compatibility', hi: 'अनुकूलता' },
  gunaLabel:    { en: 'Guna Milan', hi: 'गुण मिलान' },
  synastry:     { en: 'Key Aspects', hi: 'मुख्य पहलू' },
  navamsha:     { en: 'Navamsha (D9)', hi: 'नवांश (D9)' },
  currentDyn:   { en: 'Current Dynamics', hi: 'वर्तमान गतिशीलता' },
  actions:      { en: 'Guidance', hi: 'मार्गदर्शन' },
  forecast:     { en: 'Monthly Forecast', hi: 'मासिक पूर्वानुमान' },
  karmic:       { en: 'Karmic Bonds', hi: 'कर्म बंधन' },
  close:        { en: 'Close', hi: 'बंद करें' },
};

function label(key: keyof typeof LABELS, locale: string): string {
  const obj = LABELS[key];
  return locale === 'hi' || locale === 'sa' ? obj.hi : obj.en;
}

export default function FamilyMarriageDetail({ dynamics, locale, onClose }: FamilyMarriageDetailProps) {
  const headingStyle = getHeadingFont(locale);
  const bodyStyle = getBodyFont(locale);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-gold-light text-lg font-semibold" style={headingStyle}>
          {label('title', locale)}
        </h3>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary text-sm px-3 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
        >
          {label('close', locale)}
        </button>
      </div>

      {/* Guna Milan */}
      {dynamics.gunaScore !== undefined && (
        <div className="rounded-xl bg-gold-primary/5 border border-gold-primary/15 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gold-light text-sm font-medium" style={headingStyle}>
              {label('gunaLabel', locale)}
            </span>
            <span className="text-gold-light font-mono text-lg font-bold">
              {dynamics.gunaScore}/36
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gold-primary transition-all"
              style={{ width: `${(dynamics.gunaScore / 36) * 100}%` }}
            />
          </div>
          {dynamics.gunaBreakdown && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {Object.entries(dynamics.gunaBreakdown).map(([kuta, score]) => (
                <div key={kuta} className="text-center">
                  <div className="text-text-secondary text-[10px] capitalize">{kuta}</div>
                  <div className="text-text-primary text-xs font-mono">{score}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top Synastry Aspects */}
      {dynamics.synastryHighlights.length > 0 && (
        <div>
          <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
            {label('synastry', locale)}
          </h4>
          <div className="space-y-2">
            {dynamics.synastryHighlights.slice(0, 5).map((asp, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  asp.nature === 'harmonious' ? 'bg-emerald-400' :
                  asp.nature === 'challenging' ? 'bg-red-400' : 'bg-amber-400'
                }`} />
                <span className="text-text-primary" style={bodyStyle}>
                  {asp.yourPlanet} {asp.aspect} {asp.theirPlanet}
                </span>
                <span className="text-text-secondary text-xs ml-auto">
                  {asp.orb}&deg;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navamsha Cross-Read */}
      <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/10 p-4">
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('navamsha', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyStyle}>
          {tl(dynamics.vargaCrossRead.narrative, locale)}
        </p>
      </div>

      {/* Current Dynamics */}
      <div>
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('currentDyn', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyStyle}>
          {tl(dynamics.currentDynamic, locale)}
        </p>
      </div>

      {/* Karmic Indicators */}
      {dynamics.karmicIndicators.length > 0 && (
        <div>
          <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
            {label('karmic', locale)}
          </h4>
          <div className="space-y-2">
            {dynamics.karmicIndicators.map((ki, i) => (
              <p key={i} className="text-text-secondary text-sm leading-relaxed" style={bodyStyle}>
                {tl(ki.description, locale)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      <div>
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('actions', locale)}
        </h4>
        <FamilyActionItems items={dynamics.actionItems} locale={locale} />
      </div>

      {/* Monthly Forecast */}
      <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/10 p-4">
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('forecast', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyStyle}>
          {tl(dynamics.monthlyForecast, locale)}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create FamilyChildDetail**

Create `src/components/dashboard/FamilyChildDetail.tsx`:

```typescript
'use client';

import type { RelationshipDynamics } from '@/lib/kundali/family-synthesis/types';
import { tl } from '@/lib/utils/trilingual';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import FamilyActionItems from './FamilyActionItems';

interface FamilyChildDetailProps {
  childName: string;
  dynamics: RelationshipDynamics;
  locale: string;
  onClose: () => void;
}

const LABELS = {
  bond:       { en: 'Parent-Child Bond', hi: 'माता-पिता-संतान बंधन' },
  synastry:   { en: 'Key Aspects', hi: 'मुख्य पहलू' },
  saptamsha:  { en: 'Saptamsha (D7)', hi: 'सप्तांश (D7)' },
  currentDyn: { en: 'Current Dynamics', hi: 'वर्तमान गतिशीलता' },
  actions:    { en: 'Parenting Guidance', hi: 'पालन-पोषण मार्गदर्शन' },
  forecast:   { en: 'Monthly Forecast', hi: 'मासिक पूर्वानुमान' },
  karmic:     { en: 'Karmic Connection', hi: 'कर्म संबंध' },
  close:      { en: 'Close', hi: 'बंद करें' },
};

function label(key: keyof typeof LABELS, locale: string): string {
  const obj = LABELS[key];
  return locale === 'hi' || locale === 'sa' ? obj.hi : obj.en;
}

export default function FamilyChildDetail({ childName, dynamics, locale, onClose }: FamilyChildDetailProps) {
  const headingStyle = getHeadingFont(locale);
  const bodyStyle = getBodyFont(locale);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-gold-light text-lg font-semibold" style={headingStyle}>
          {childName} — {label('bond', locale)}
        </h3>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary text-sm px-3 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
        >
          {label('close', locale)}
        </button>
      </div>

      {/* Top Synastry Aspects */}
      {dynamics.synastryHighlights.length > 0 && (
        <div>
          <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
            {label('synastry', locale)}
          </h4>
          <div className="space-y-2">
            {dynamics.synastryHighlights.slice(0, 5).map((asp, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  asp.nature === 'harmonious' ? 'bg-emerald-400' :
                  asp.nature === 'challenging' ? 'bg-red-400' : 'bg-amber-400'
                }`} />
                <span className="text-text-primary" style={bodyStyle}>
                  {asp.yourPlanet} {asp.aspect} {asp.theirPlanet}
                </span>
                <span className="text-text-secondary text-xs ml-auto">
                  {asp.orb}&deg;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* D7 Cross-Read */}
      <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/10 p-4">
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('saptamsha', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyStyle}>
          {tl(dynamics.vargaCrossRead.narrative, locale)}
        </p>
      </div>

      {/* Current Dynamics */}
      <div>
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('currentDyn', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyStyle}>
          {tl(dynamics.currentDynamic, locale)}
        </p>
      </div>

      {/* Karmic Indicators */}
      {dynamics.karmicIndicators.length > 0 && (
        <div>
          <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
            {label('karmic', locale)}
          </h4>
          <div className="space-y-2">
            {dynamics.karmicIndicators.map((ki, i) => (
              <p key={i} className="text-text-secondary text-sm leading-relaxed" style={bodyStyle}>
                {tl(ki.description, locale)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      <div>
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('actions', locale)}
        </h4>
        <FamilyActionItems items={dynamics.actionItems} locale={locale} />
      </div>

      {/* Monthly Forecast */}
      <div className="rounded-xl bg-bg-secondary/50 border border-gold-primary/10 p-4">
        <h4 className="text-text-primary text-sm font-medium mb-2" style={headingStyle}>
          {label('forecast', locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyStyle}>
          {tl(dynamics.monthlyForecast, locale)}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create FamilyCard (the main dashboard widget)**

Create `src/components/dashboard/FamilyCard.tsx`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { authedFetch } from '@/lib/api/authed-fetch';
import { tl } from '@/lib/utils/trilingual';
import { getHeadingFont, getBodyFont } from '@/lib/utils/locale-fonts';
import FamilyMarriageDetail from './FamilyMarriageDetail';
import FamilyChildDetail from './FamilyChildDetail';
import type { FamilyReading, ChildDynamics } from '@/lib/kundali/family-synthesis/types';

interface FamilyCardProps {
  locale: string;
}

const LABELS = {
  title:    { en: 'Your Family', hi: 'आपका परिवार' },
  marriage: { en: 'Marriage', hi: 'विवाह' },
  children: { en: 'Children', hi: 'संतान' },
  view:     { en: 'View', hi: 'देखें' },
  loading:  { en: 'Loading family insights...', hi: 'पारिवारिक अंतर्दृष्टि लोड हो रही है...' },
  error:    { en: 'Could not load family insights.', hi: 'पारिवारिक अंतर्दृष्टि लोड नहीं हो सकी।' },
};

function label(key: keyof typeof LABELS, locale: string): string {
  const obj = LABELS[key];
  return locale === 'hi' || locale === 'sa' ? obj.hi : obj.en;
}

export default function FamilyCard({ locale }: FamilyCardProps) {
  const [familyReading, setFamilyReading] = useState<FamilyReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<'none' | 'marriage' | string>('none');
  const [selectedChild, setSelectedChild] = useState<ChildDynamics | null>(null);

  const headingStyle = getHeadingFont(locale);
  const bodyStyle = getBodyFont(locale);

  const fetchFamilyReading = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authedFetch('/api/family-synthesis', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 404) {
          // No primary kundali — don't show the card
          setFamilyReading(null);
          setLoading(false);
          return;
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setFamilyReading(data.familyReading);
    } catch (err) {
      console.error('[FamilyCard] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFamilyReading();
  }, [fetchFamilyReading]);

  // Don't render if no family data
  if (!loading && !error && !familyReading) return null;
  if (loading) {
    return (
      <div className="rounded-2xl bg-bg-secondary/50 border border-gold-primary/10 p-5">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-32 bg-white/[0.06] rounded" />
          <div className="h-3 w-full bg-white/[0.04] rounded" />
          <div className="h-3 w-3/4 bg-white/[0.04] rounded" />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl bg-bg-secondary/50 border border-red-500/20 p-5">
        <p className="text-red-400 text-sm">{label('error', locale)}</p>
      </div>
    );
  }
  if (!familyReading) return null;

  // Detail views
  if (detailView === 'marriage' && familyReading.marriageDynamics) {
    return (
      <div className="rounded-2xl bg-bg-secondary/50 border border-gold-primary/10 p-5">
        <FamilyMarriageDetail
          dynamics={familyReading.marriageDynamics}
          locale={locale}
          onClose={() => setDetailView('none')}
        />
      </div>
    );
  }
  if (detailView.startsWith('child:') && selectedChild) {
    return (
      <div className="rounded-2xl bg-bg-secondary/50 border border-gold-primary/10 p-5">
        <FamilyChildDetail
          childName={selectedChild.childName}
          dynamics={selectedChild.dynamics}
          locale={locale}
          onClose={() => { setDetailView('none'); setSelectedChild(null); }}
        />
      </div>
    );
  }

  // Compact card view
  return (
    <div className="rounded-2xl bg-bg-secondary/50 border border-gold-primary/10 p-5">
      {/* Header */}
      <h3 className="text-gold-light text-base font-semibold tracking-wide mb-4" style={headingStyle}>
        {label('title', locale)}
      </h3>

      <div className="space-y-3">
        {/* Marriage sub-card */}
        {familyReading.marriageDynamics && (
          <button
            type="button"
            onClick={() => setDetailView('marriage')}
            className="w-full text-left rounded-xl bg-white/[0.02] border border-gold-primary/10 hover:border-gold-primary/25 p-3.5 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-text-primary text-sm font-medium" style={bodyStyle}>
                {label('marriage', locale)}
              </span>
              <span className="text-gold-primary text-xs">
                {label('view', locale)} &rarr;
              </span>
            </div>
            {familyReading.marriageDynamics.gunaScore !== undefined && (
              <span className="text-text-secondary text-xs">
                {familyReading.marriageDynamics.gunaScore}/36 {label('marriage', locale) === 'Marriage' ? 'Guna Milan' : 'गुण मिलान'}
              </span>
            )}
            <p className="text-text-secondary text-xs mt-1 line-clamp-2" style={bodyStyle}>
              {tl(familyReading.marriageDynamics.currentDynamic, locale).substring(0, 120)}...
            </p>
          </button>
        )}

        {/* Children sub-cards */}
        {familyReading.childrenDynamics.map((child) => (
          <button
            key={child.chartId}
            type="button"
            onClick={() => { setSelectedChild(child); setDetailView(`child:${child.chartId}`); }}
            className="w-full text-left rounded-xl bg-white/[0.02] border border-gold-primary/10 hover:border-gold-primary/25 p-3.5 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-text-primary text-sm font-medium" style={bodyStyle}>
                {child.childName}
              </span>
              <span className="text-gold-primary text-xs">
                {label('view', locale)} &rarr;
              </span>
            </div>
            <p className="text-text-secondary text-xs line-clamp-2" style={bodyStyle}>
              {tl(child.dynamics.currentDynamic, locale).substring(0, 120)}...
            </p>
          </button>
        ))}
      </div>

      {/* Family summary */}
      {familyReading.familySummary && (
        <p className="mt-4 text-text-secondary text-xs leading-relaxed italic" style={bodyStyle}>
          {tl(familyReading.familySummary, locale)}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep -v mangal-dosha`
Expected: No new errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/FamilyCard.tsx src/components/dashboard/FamilyMarriageDetail.tsx src/components/dashboard/FamilyChildDetail.tsx src/components/dashboard/FamilyActionItems.tsx
git commit -m "feat: family dashboard UI components"
```

---

### Task 12: Dashboard Integration

Wire FamilyCard into the dashboard page.

**Files:**
- Modify: `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1: Add import and render**

In `src/app/[locale]/dashboard/page.tsx`:

Add import near the top with other component imports:
```typescript
import FamilyCard from '@/components/dashboard/FamilyCard';
```

Find the "My Saved Kundalis" section (search for `saved_charts` or "Saved Kundalis" in the render). Insert the FamilyCard BEFORE the saved charts section:

```typescript
              {/* Family Insights — shows only when spouse/child charts exist */}
              {user && kundaliSnapshot && (
                <div className="mb-8">
                  <FamilyCard locale={locale} />
                </div>
              )}

              {/* My Saved Kundalis */}
```

The `user` and `kundaliSnapshot` guards ensure it only attempts to load when the user is logged in and has a primary chart.

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep -v mangal-dosha`
Expected: No new errors.

- [ ] **Step 3: Test in browser**

1. Start dev server: `npx next dev --turbopack`
2. Navigate to `/en/dashboard`
3. If logged in with family charts: FamilyCard should appear
4. If no family charts: FamilyCard should not render (returns null)
5. Click "View" on marriage/child — detail view should expand
6. Click "Close" — returns to compact view

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/dashboard/page.tsx
git commit -m "feat: integrate FamilyCard into dashboard"
```

---

### Task 13: Full Test Suite + Build Verification

Run all existing tests to confirm zero regressions, then run a full build.

**Files:** None (verification only)

- [ ] **Step 1: Run all new tests**

```bash
npx vitest run src/lib/kundali/family-synthesis/
```
Expected: All tests PASS.

- [ ] **Step 2: Run full existing test suite**

```bash
npx vitest run
```
Expected: All existing tests still pass. Zero regressions.

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep -v mangal-dosha
```
Expected: No new errors.

- [ ] **Step 4: Production build**

```bash
npx next build
```
Expected: Build succeeds with zero new errors.

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve any type/test issues from family synthesis integration"
```

---

## Dependency Graph

```
Task 1 (Migration)
  ↓
Task 2 (Types) ← imported by all subsequent tasks
  ↓
Tasks 3, 4, 5, 6 (varga, transit, dasha, narrative) ← can run in parallel
  ↓
Tasks 7, 8 (marriage-dynamics, child-dynamics) ← depend on 3, 4, 5, 6
  ↓
Task 9 (orchestrator + API) ← depends on 7, 8
  ↓
Task 10 (save chart path) ← independent, can run anytime after Task 1
  ↓
Task 11 (UI components) ← depends on types (Task 2)
  ↓
Task 12 (dashboard integration) ← depends on 9, 11
  ↓
Task 13 (verification) ← depends on all above
```
