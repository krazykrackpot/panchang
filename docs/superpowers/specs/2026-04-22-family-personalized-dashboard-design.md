# Family-Personalized Dashboard — Design Spec

**Date:** 2026-04-22
**Status:** Approved
**Approach:** Extend domain synthesis (Approach B)

---

## Problem

The dashboard and domain synthesis are entirely single-person. A user who saves their spouse's or child's kundali gets no cross-chart insights. The Marriage domain scores only the native's 7th house; the Children domain scores only the native's 5th house. No synastry, no cross-chart transit correlation, no relationship-aware guidance.

## Solution

Augment (not replace) the Marriage and Children domains with a **RelationshipDynamics** overlay. When a user has saved charts tagged `spouse` or `child`, a new server-side family synthesis engine computes cross-chart analysis and returns actionable, narrative-rich guidance. A new "Your Family" card on the dashboard surfaces this.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| How users declare relationships | Chart save with relationship dropdown | Already exists in BirthForm; no extra profile step |
| Base score modification | Augment, never replace | Individual score reflects YOUR chart karma (classical Jyotish); cross-chart layer is additive |
| Narrative depth | Full actionable guidance (Level C) | Fits Personal Pandit vision — illuminate AND guide |
| Dashboard placement | Dedicated "Your Family" card with drill-down | Groups all family dynamics; keeps main scroll scannable |
| Computation | Server-side API with caching | Heavy cross-chart analysis; cacheable; single API call |
| Regression safety | Zero modifications to existing scorers | Family synthesis is a new module that consumes existing engine output |

---

## 1. Data Model

### 1.1 `saved_charts` table changes

```sql
-- Add queryable relationship column (extracted from JSONB for indexed access)
ALTER TABLE saved_charts ADD COLUMN relationship text;

-- Backfill from existing JSONB birth_data
UPDATE saved_charts SET relationship = birth_data->>'relationship'
  WHERE birth_data->>'relationship' IS NOT NULL;

-- Index for fast family chart lookup
CREATE INDEX idx_saved_charts_user_relationship ON saved_charts(user_id, relationship);
```

No changes to `user_profiles`. Marital status is derived from the existence of a saved chart with `relationship = 'spouse'`. Single source of truth.

### 1.2 New `family_readings` cache table

```sql
CREATE TABLE family_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  reading_data jsonb NOT NULL,
  computed_at timestamptz NOT NULL DEFAULT now(),
  chart_ids uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE family_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own family readings" ON family_readings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role manages family readings" ON family_readings
  FOR ALL USING (auth.role() = 'service_role');
```

### 1.3 Cache invalidation

- When any chart in `chart_ids` is updated or a new spouse/child chart is saved, the cached reading is stale.
- 24-hour TTL as a safety net (transits change daily).
- Manual recompute via `forceRecompute: true` parameter.

---

## 2. Type System

### 2.1 Core types (`src/lib/kundali/family-synthesis/types.ts`)

```typescript
import type { KundaliData } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';

// --- Input context ---

export interface FamilyContext {
  spouse?: FamilyMember;
  children: FamilyMember[];
}

export interface FamilyMember {
  chartId: string;
  kundali: KundaliData;
  name: string;
  birthOrder?: number; // children only, for sorting
}

// --- Output: relationship dynamics overlay ---

export interface RelationshipDynamics {
  // Cross-chart synthesis (static, cached)
  synastryHighlights: SynastryHighlight[];
  gunaScore?: number;                        // 36-point Ashta Kuta (marriage only)
  gunaBreakdown?: GunaBreakdown;             // per-kuta scores
  vargaCrossRead: VargaCrossRead;
  karmicIndicators: KarmicIndicator[];       // Rahu-Ketu nodal contacts
  karakaAnalysis: LocaleText;                // DK for marriage, PK for children

  // Temporal dynamics (transit-dependent)
  transitImpact: TransitRelationshipImpact;
  dashaSynchronicity: DashaSyncAnalysis;
  upcomingWindows: RelationshipWindow[];     // next 3 months significant periods
  stressPeriods: StressPeriod[];

  // Actionable guidance
  currentDynamic: LocaleText;                // narrative paragraph
  actionItems: ActionItem[];
  monthlyForecast: LocaleText;
}

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
  compatibility: number;      // 0-10 score
  narrative: LocaleText;
}

export interface KarmicIndicator {
  type: 'nodal_contact' | 'saturn_aspect' | 'rahu_ketu_axis';
  description: LocaleText;
  strength: number;           // 0-10
}

export interface TransitRelationshipImpact {
  overallTone: 'supportive' | 'challenging' | 'mixed' | 'neutral';
  yourTransits: TransitHit[];   // transits hitting your relationship houses
  theirTransits: TransitHit[];  // transits hitting their relationship houses
  narrative: LocaleText;
}

export interface TransitHit {
  planet: string;
  house: number;
  sign: string;
  effect: LocaleText;
}

export interface DashaSyncAnalysis {
  inSync: boolean;
  yourDasha: string;           // e.g. "Venus-Jupiter"
  theirDasha: string;
  yourActivation: string[];    // houses activated by your dasha
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
  trigger: string;             // e.g. "Saturn transiting spouse's 7th"
  severity: 'mild' | 'moderate' | 'intense';
  guidance: LocaleText;
}

export interface ActionItem {
  type: 'do' | 'avoid' | 'watch';
  text: LocaleText;
  timing?: string;
  relevance: number;           // 0-10, for sorting
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

// --- Full family reading payload ---

export interface FamilyReading {
  marriageDynamics: RelationshipDynamics | null;
  childrenDynamics: ChildDynamics[];
  familySummary: LocaleText;
  computedAt: string;
}

export interface ChildDynamics {
  childName: string;
  chartId: string;
  dynamics: RelationshipDynamics;
}
```

### 2.2 Integration with existing `DomainReading`

Add one optional field — zero impact on existing consumers:

```typescript
// In src/lib/kundali/domain-synthesis/types.ts
interface DomainReading {
  // ... all existing fields untouched ...
  relationshipDynamics?: RelationshipDynamics; // new, only populated when family context exists
}
```

---

## 3. Engine Architecture

### 3.1 Module layout

```
src/lib/kundali/family-synthesis/
├── types.ts                    # All types above
├── index.ts                    # Orchestrator: computeFamilyReading()
├── marriage-dynamics.ts        # Marriage overlay computation
├── child-dynamics.ts           # Per-child overlay computation
├── transit-relationship.ts     # Cross-chart transit analysis
├── dasha-sync.ts               # Dasha synchronicity analysis
├── varga-cross-read.ts         # D9/D7 cross-chart analysis
├── narrative-gen.ts            # Generates actionable text from computed factors
└── __tests__/
    ├── marriage-dynamics.test.ts
    ├── child-dynamics.test.ts
    ├── dasha-sync.test.ts
    └── family-synthesis.test.ts
```

### 3.2 Orchestration flow

```
POST /api/family-synthesis
  │
  ├─ Auth check (Bearer token → user_id)
  ├─ Fetch user's primary kundali (kundali_snapshots)
  ├─ Query saved_charts WHERE user_id AND relationship IN ('spouse', 'child')
  ├─ Cache check: family_readings WHERE user_id
  │   └─ If chart_ids match AND computed_at < 24h → return cached
  │
  ├─ For each family chart: compute KundaliData via kundali-calc
  ├─ Build FamilyContext { spouse?, children[] }
  │
  ├─ If spouse exists:
  │   ├─ ashta-kuta.ts (existing) → gunaScore + breakdown
  │   ├─ synastry-engine.ts (existing) → cross-chart aspects
  │   ├─ marriage-dynamics.ts (new):
  │   │   ├─ D9 Navamsha cross-read
  │   │   ├─ 7th house overlay (your 7th lord in their chart, vice versa)
  │   │   ├─ Venus-Mars dynamics
  │   │   ├─ Saturn cross-aspects (commitment/challenge)
  │   │   ├─ Rahu-Ketu axis overlap (karmic bond)
  │   │   ├─ Mangal Dosha cross-check
  │   │   └─ Darakaraka analysis
  │   ├─ transit-relationship.ts → current transit impact on both 7th houses
  │   ├─ dasha-sync.ts → are both dashas activating marriage houses?
  │   └─ narrative-gen.ts → interpreted text + action items + monthly forecast
  │
  ├─ For each child:
  │   ├─ synastry-engine.ts (existing) → parent-child aspects
  │   ├─ child-dynamics.ts (new):
  │   │   ├─ 5th house ↔ child's Lagna overlay
  │   │   ├─ D7 Saptamsha cross-read
  │   │   ├─ Moon connection (emotional bond, nakshatra compatibility)
  │   │   ├─ Jupiter cross-aspects (guidance dynamic)
  │   │   ├─ Saturn cross-aspects (discipline dynamic)
  │   │   ├─ Rahu-Ketu nodal contacts (karmic lessons)
  │   │   └─ Putrakaraka analysis
  │   ├─ transit-relationship.ts → transits hitting your 5th / their 1st, 4th
  │   ├─ dasha-sync.ts → parenting periods vs developmental periods
  │   └─ narrative-gen.ts → per-child text + action items
  │
  ├─ Generate familySummary narrative
  ├─ Cache in family_readings (upsert)
  └─ Return FamilyReading
```

### 3.3 Engines reused (ZERO modifications)

| Engine | What it provides |
|--------|-----------------|
| `synastry-engine.ts` | Planet-level cross-chart aspects, sign relationships, graha maitri |
| `ashta-kuta.ts` | 36-point Guna Milan with per-kuta breakdown |
| `kundali-calc.ts` | Full chart computation from birth data |
| `panchang-calc.ts` | Current planet positions for transit analysis |
| Domain synthesis base scoring | Individual domain scores — completely untouched |
| `dasha-comparison.ts` | Existing dasha period comparison between two charts |

---

## 4. Marriage Dynamics — Full Factor List

### 4.1 Static cross-chart factors (cached)

| # | Factor | Source | Output |
|---|--------|--------|--------|
| 1 | Ashta Kuta Guna Milan | `ashta-kuta.ts` | 36-point score + per-kuta breakdown |
| 2 | Synastry aspects | `synastry-engine.ts` | Top 5 inter-chart aspects, ranked by strength |
| 3 | D9 Navamsha cross-read | New: `varga-cross-read.ts` | D9 7th lord placement vs their D9 Lagna lord; Navamsha Venus exchange; D9 sign compatibility |
| 4 | 7th house overlay | New: `marriage-dynamics.ts` | Your 7th lord in their chart houses, vice versa; mutual 7th house occupants |
| 5 | Venus-Mars dynamics | New: `marriage-dynamics.ts` | Cross-chart Venus/Mars aspects (romantic chemistry) |
| 6 | Saturn cross-aspects | New: `marriage-dynamics.ts` | Commitment and challenge indicators |
| 7 | Rahu-Ketu axis overlap | New: `marriage-dynamics.ts` | Karmic bond indicators (nodal contacts between charts) |
| 8 | Mangal Dosha cross-check | New: `marriage-dynamics.ts` | If either has Mangal Dosha, does the other's chart cancel it? |
| 9 | Darakaraka analysis | New: `marriage-dynamics.ts` | Your DK sign vs their Lagna, and vice versa |

### 4.2 Temporal dynamics (transit-dependent)

| # | Factor | Source | Output |
|---|--------|--------|--------|
| 10 | Current transit impact | `transit-relationship.ts` | Planets transiting your 7th / their 7th / conjuncting natal relationship planets |
| 11 | Dasha synchronicity | `dasha-sync.ts` | Are your current dasha lords activating 7th/Venus/DK? Are theirs? |
| 12 | Upcoming relationship windows | `narrative-gen.ts` | Next 3 months: when both charts show 7th house activation simultaneously |
| 13 | Stress periods | `narrative-gen.ts` | When Saturn/Rahu transits hit relationship houses in either chart |

### 4.3 Narrative output

- **currentDynamic** — interpreted paragraph connecting static + temporal factors
- **actionItems** — 3-5 specific `do`/`avoid`/`watch` items with timing
- **monthlyForecast** — what to expect this month for the relationship

Example action items:
- `do`: "Joint financial decisions are well-supported this week — your 2nd lord and their 11th lord are both activated by Jupiter's transit"
- `avoid`: "Defer major confrontations May 8-12 — Mercury retrograde hits your spouse's 3rd house of communication"
- `watch`: "Your dasha period is activating your 5th house while theirs activates their 7th — a window for deepening emotional intimacy"

---

## 5. Children Dynamics — Full Factor List

Each child gets their own sub-section in the UI and their own `ChildDynamics` entry in the payload.

### 5.1 Static cross-chart factors (cached)

| # | Factor | Source | Output |
|---|--------|--------|--------|
| 1 | Parent-child synastry | `synastry-engine.ts` | Top 5 inter-chart aspects |
| 2 | 5th house ↔ child's Lagna | `child-dynamics.ts` | Your 5th lord in their chart houses; how your house of children maps to who they are |
| 3 | D7 Saptamsha cross-read | `varga-cross-read.ts` | Your D7 and their D7 interaction patterns |
| 4 | Moon connection | `child-dynamics.ts` | Your Moon ↔ their Moon aspects; nakshatra compatibility; emotional bond quality |
| 5 | Jupiter cross-aspects | `child-dynamics.ts` | Guidance/teaching dynamic |
| 6 | Saturn cross-aspects | `child-dynamics.ts` | Discipline/structure dynamic |
| 7 | Rahu-Ketu nodal contacts | `child-dynamics.ts` | Karmic lessons between parent and child |
| 8 | Putrakaraka analysis | `child-dynamics.ts` | Your PK sign vs child's Lagna and Moon |

### 5.2 Temporal dynamics

| # | Factor | Source | Output |
|---|--------|--------|--------|
| 9 | Current transit impact | `transit-relationship.ts` | Planets transiting your 5th / their 1st or 4th |
| 10 | Dasha synchronicity | `dasha-sync.ts` | Your parenting periods (5th activation) vs their developmental periods (1st/4th/9th) |
| 11 | Academic/growth windows | `narrative-gen.ts` | When their 4th/5th/9th houses are activated |
| 12 | Health watch periods | `narrative-gen.ts` | When their 6th/8th lords are activated |

### 5.3 Narrative output

Same structure as marriage: `currentDynamic`, `actionItems`, `monthlyForecast` — adapted for parent-child context.

Example action items:
- `do`: "Your child's Jupiter return is in June — excellent for introducing new learning or spiritual practices"
- `watch`: "Saturn transiting their 4th house this quarter — they may feel emotionally withdrawn. Extra patience and home stability will help."
- `do`: "Your dasha activates your 5th house — parenting feels natural this period. Prioritise quality bonding time."

---

## 6. API Design

### 6.1 Endpoint: `POST /api/family-synthesis`

**Auth:** Bearer token required. User ID from session.

**Request:**
```json
{
  "forceRecompute": false
}
```

**Response:**
```json
{
  "familyReading": {
    "marriageDynamics": { /* RelationshipDynamics | null */ },
    "childrenDynamics": [
      {
        "childName": "Arjun",
        "chartId": "uuid-child-1",
        "dynamics": { /* RelationshipDynamics */ }
      }
    ],
    "familySummary": { "en": "...", "hi": "...", "sa": "..." },
    "computedAt": "2026-04-22T10:30:00Z"
  },
  "cached": true,
  "chartIds": ["uuid-self", "uuid-spouse", "uuid-child-1"]
}
```

**Response when no family charts exist:**
```json
{
  "familyReading": null,
  "cached": false,
  "chartIds": []
}
```

**Error responses:**
- 401: Not authenticated
- 404: User has no primary kundali snapshot
- 500: Computation error (logged server-side, user sees generic message)

### 6.2 Cache logic

```
currentFamilyChartIds = SELECT id FROM saved_charts
  WHERE user_id = X AND relationship IN ('spouse', 'child')
  ORDER BY id

cached = SELECT * FROM family_readings WHERE user_id = X

if cached exists:
  if SORT(cached.chart_ids) == SORT(currentFamilyChartIds):
    if (now - cached.computed_at) < 24 hours:
      return cached.reading_data     # cache hit
    else:
      recompute (transit data stale)  # TTL expired
  else:
    recompute (family chart set changed)  # chart added/removed
else:
  first computation
```

### 6.3 Multi-spouse handling

If multiple charts are tagged `spouse`, use the most recently saved one. Log a warning but don't error — the user may have saved a corrected chart without deleting the old one.

### 6.4 Locale handling

All `LocaleText` fields in narratives follow the existing i18n pattern: generate `en` and `hi`, with `sa` falling back to `en`. Tamil (`ta`) and Bengali (`bn`) fall back to `en` or `hi` per the existing `tl()` helper convention. No new locale infrastructure needed.

---

## 7. Dashboard UI

### 7.1 "Your Family" card (compact)

Appears on dashboard ONLY when at least one saved chart has `relationship = 'spouse'` or `relationship = 'child'`. No empty state, no prompts — the card materialises when family data exists.

**Layout:**
- Header: "Your Family" with a subtle family icon (custom SVG, no emoji)
- Marriage sub-card (if spouse exists): Guna Milan badge + one-line current dynamic + "View" link
- Children sub-cards (one per child): Child name + one-line insight + "View" link
- Footer: Family summary quote (one sentence from familySummary)

### 7.2 Detail view (drill-down)

Each "View" link opens a detail view (full-width section or modal — follows existing dashboard patterns).

**Marriage detail view sections:**
1. Compatibility overview — Guna Milan score with per-kuta breakdown, top synastry aspects
2. D9 cross-read — Navamsha compatibility narrative
3. Current dynamics — interpreted paragraph connecting static + temporal factors
4. Action items — list of `do`/`avoid`/`watch` items with timing badges
5. Monthly forecast — what to expect this month
6. Upcoming windows & stress periods — timeline of significant dates

**Child detail view sections (per child):**
1. Parent-child bond overview — synastry highlights, Moon connection, PK analysis
2. Current dynamics — interpreted narrative
3. Action items — parenting guidance, academic windows, health watch
4. Monthly forecast
5. Growth/development windows — timeline

### 7.3 Toast on chart save

When a user saves a chart with `relationship = 'spouse'` or `'child'`, show a brief toast:
> "Family insights will now appear on your dashboard."

No modal, no wizard, no extra steps.

### 7.4 Component structure

```
src/components/dashboard/
├── FamilyCard.tsx              # Compact card for dashboard
├── FamilyMarriageDetail.tsx    # Full marriage dynamics view
├── FamilyChildDetail.tsx       # Per-child dynamics view
└── FamilyActionItems.tsx       # Shared action item list component
```

---

## 8. Regression Safety

### 8.1 Zero-touch guarantees

These existing modules are consumed but NEVER modified:

- `src/lib/kundali/domain-synthesis/synthesizer.ts` — base scoring unchanged
- `src/lib/kundali/domain-synthesis/types.ts` — only addition is one optional field on `DomainReading`
- `src/lib/matching/ashta-kuta.ts` — called as-is
- `src/lib/comparison/synastry-engine.ts` — called as-is
- `src/lib/ephem/kundali-calc.ts` — called as-is
- `src/lib/ephem/panchang-calc.ts` — called as-is
- Dashboard existing widgets — untouched, FamilyCard is additive

### 8.2 Type-level safety

- `RelationshipDynamics` is optional on `DomainReading` — no existing code that reads domain readings will break
- `FamilyReading` is a new type consumed only by new components
- No changes to any existing function signatures

### 8.3 Database safety

- `saved_charts.relationship` is a new nullable column — no existing queries break
- `family_readings` is a new table — zero impact on existing tables
- Backfill UPDATE is safe: only writes to the new column from existing JSONB data
- RLS follows existing patterns (users read own, service_role manages all)

### 8.4 Testing strategy

- **Unit tests** for each new module (marriage-dynamics, child-dynamics, dasha-sync, transit-relationship, varga-cross-read, narrative-gen)
- **Integration test** for the full orchestrator (`computeFamilyReading`) with fixture kundali data
- **API test** for `/api/family-synthesis` endpoint (auth, cache hit, cache miss, no-family-charts)
- **Existing test suite** must pass unchanged (`npx vitest run`)
- **Build gate** (`npx next build`) must pass with zero new errors

### 8.5 Saved charts write path

When saving a chart, the existing `birth_data` JSONB already contains `relationship`. The only change: also write `relationship` to the new top-level column for indexed querying.

**Where the write happens:** The kundali page's `handleSaveChart` function calls `supabase.from('saved_charts').insert(...)`. This insert payload must include `relationship: birthData.relationship` as a top-level column alongside the existing `birth_data` JSONB. This is a one-line addition to the insert object.

**Backfill:** The migration SQL handles existing rows. New saves write both the JSONB field and the indexed column.

---

## 9. Scope Boundaries

### In scope
- Family synthesis engine (marriage + children dynamics)
- `/api/family-synthesis` endpoint with caching
- "Your Family" dashboard card with compact + detail views
- `saved_charts.relationship` column + `family_readings` table
- Toast notification on family chart save
- Unit + integration tests for all new modules

### Out of scope (future iterations)
- Parent chart dynamics (user saves their parent's chart)
- Sibling chart dynamics
- Multi-spouse handling (only one spouse chart is used)
- AI-generated deeper narratives (current narratives are rule-based)
- Push notifications for upcoming relationship windows
- Family chart comparison page (standalone, outside dashboard)
- Relationship-aware trajectory tracking (trends over time for the family dynamics)

---

## 10. File Inventory

### New files
```
src/lib/kundali/family-synthesis/types.ts
src/lib/kundali/family-synthesis/index.ts
src/lib/kundali/family-synthesis/marriage-dynamics.ts
src/lib/kundali/family-synthesis/child-dynamics.ts
src/lib/kundali/family-synthesis/transit-relationship.ts
src/lib/kundali/family-synthesis/dasha-sync.ts
src/lib/kundali/family-synthesis/varga-cross-read.ts
src/lib/kundali/family-synthesis/narrative-gen.ts
src/lib/kundali/family-synthesis/__tests__/marriage-dynamics.test.ts
src/lib/kundali/family-synthesis/__tests__/child-dynamics.test.ts
src/lib/kundali/family-synthesis/__tests__/dasha-sync.test.ts
src/lib/kundali/family-synthesis/__tests__/family-synthesis.test.ts
src/app/api/family-synthesis/route.ts
src/components/dashboard/FamilyCard.tsx
src/components/dashboard/FamilyMarriageDetail.tsx
src/components/dashboard/FamilyChildDetail.tsx
src/components/dashboard/FamilyActionItems.tsx
supabase/migrations/XXX_family_readings.sql
```

### Modified files (minimal, additive changes only)
```
src/lib/kundali/domain-synthesis/types.ts    # Add optional relationshipDynamics field
src/app/[locale]/dashboard/page.tsx          # Import and render FamilyCard
src/app/api/kundali/route.ts                 # Write relationship to new column on save
```
