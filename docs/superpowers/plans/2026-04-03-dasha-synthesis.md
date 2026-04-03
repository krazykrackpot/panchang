# Dasha Period Synthesis Engine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 3-level dasha synthesis engine (Mahadasha → Antardasha → Pratyantardasha) that produces granular period-by-period forecasts combining yogas, doshas, transits, divisional charts, and life area predictions.

**Architecture:** New module `src/lib/tippanni/dasha-synthesis.ts` (pure computation, no UI). Types in `dasha-synthesis-types.ts`. Integrates into existing `TippanniContent` via new `dashaSynthesis` field. UI rendered in the tippanni tab of the kundali page.

**Tech Stack:** TypeScript, existing astronomy engine (`getPlanetaryPositions`, `toSidereal`), existing dasha analysis (`getDashaLordAnalysis`, `getAntardashaInteraction`, `generateDashaPrognosis`).

**Spec:** `docs/superpowers/specs/2026-04-03-dasha-synthesis-design.md`

---

## File Map

### New Files

| File | Responsibility |
|------|---------------|
| `src/lib/tippanni/dasha-synthesis-types.ts` | All type definitions (DashaSynthesis, MahadashaOverview, etc.) |
| `src/lib/tippanni/dasha-synthesis.ts` | Main `generateDashaSynthesis()` function + helpers |

### Modified Files

| File | Changes |
|------|---------|
| `src/lib/kundali/tippanni-types.ts` | Add `dashaSynthesis?: DashaSynthesis` to `TippanniContent` |
| `src/lib/kundali/tippanni-engine.ts` | Call `generateDashaSynthesis()`, add to output |
| `src/app/[locale]/kundali/page.tsx` | Render the synthesis in the tippanni tab |

---

## Task 1: Type Definitions

**Files:**
- Create: `src/lib/tippanni/dasha-synthesis-types.ts`

- [ ] **Step 1: Create the types file**

All types from the spec — DashaSynthesis, MahadashaOverview, MahadashaSynthesis, AntardashaSynthesis, PratyantardashaSynthesis.

- [ ] **Step 2: Build check**
```bash
npx next build 2>&1 | grep "error" | grep -v ExperimentalWarning | head -5
```

- [ ] **Step 3: Commit**
```bash
git add src/lib/tippanni/dasha-synthesis-types.ts
git commit -m "feat: add dasha synthesis type definitions"
```

---

## Task 2: Core Synthesis Engine

**Files:**
- Create: `src/lib/tippanni/dasha-synthesis.ts`

The main `generateDashaSynthesis(kundali, locale)` function that:
1. Generates lifetime summary (all Mahadashas)
2. Finds current Mahadasha
3. Deep-dives: overview, yogas, doshas, divisional insights
4. For each antardasha: lord analysis, interaction, yoga/dosha activation, house activation, transit context, life areas, net assessment, advice
5. For each pratyantardasha: light assessment + critical expansion

- [ ] **Step 1: Create the engine file with all helper functions**

Key helpers needed:
- `findCurrentMaha(dashas, now)` — find running Mahadasha
- `planetIdFromName(name)` — map "Jupiter" → 4
- `housesOwnedByPlanet(planetId, ascSign)` — what houses does this planet lord?
- `computeTransitContext(startDate, endDate, moonSign)` — Jupiter/Saturn positions during period
- `activateYogas(yogas, planetId)` — which yogas fire when this planet is active?
- `activateDoshas(doshas, planetId)` — which doshas intensify?
- `assessPeriod(factors)` — compute net assessment score
- `generateLifeAreas(...)` — synthesize career/relationships/health/finance/spirituality
- `isCriticalPratyantar(...)` — determine if a pratyantardasha needs expansion

- [ ] **Step 2: Build check**
- [ ] **Step 3: Commit**

---

## Task 3: Wire Into Tippanni Engine

**Files:**
- Modify: `src/lib/kundali/tippanni-types.ts`
- Modify: `src/lib/kundali/tippanni-engine.ts`

- [ ] **Step 1: Add dashaSynthesis to TippanniContent**

In `tippanni-types.ts`, add to the interface:
```typescript
import type { DashaSynthesis } from '@/lib/tippanni/dasha-synthesis-types';
// ...
dashaSynthesis?: DashaSynthesis;
```

- [ ] **Step 2: Call generateDashaSynthesis in tippanni-engine.ts**

In `generateTippanni()`, add:
```typescript
import { generateDashaSynthesis } from '@/lib/tippanni/dasha-synthesis';
// Inside the return:
dashaSynthesis: generateDashaSynthesis(kundali, locale),
```

- [ ] **Step 3: Build check**
- [ ] **Step 4: Commit**

---

## Task 4: UI — Lifetime Timeline + Mahadasha Overview

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx`

Replace the current single-card dasha section in the tippanni tab with the new synthesis UI. This task adds the lifetime timeline bar and the current Mahadasha overview card.

- [ ] **Step 1: Add lifetime timeline component**

Horizontal scrollable bar of Mahadasha periods. Current highlighted gold. Past dimmed.

- [ ] **Step 2: Add Mahadasha overview card**

Glass card with planet icon, dates, overview text, activated yogas/doshas as badges, divisional insight tabs.

- [ ] **Step 3: Build check**
- [ ] **Step 4: Commit**

---

## Task 5: UI — Antardasha Cards + Pratyantardasha Row

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx`

- [ ] **Step 1: Add antardasha card stack**

9 cards in vertical stack. Collapsed: net assessment bar + life area indicators + summary. Expandable for full detail.

- [ ] **Step 2: Add pratyantardasha mini-row**

Inside each expanded antardasha: 9 colored blocks (green/amber/red) for pratyantardashas. Critical ones marked with a dot. Click to expand.

- [ ] **Step 3: Build check + visual test**
- [ ] **Step 4: Commit**

---

## Task 6: Integration Test

- [ ] **Step 1: Build production**
```bash
npx next build 2>&1 | tail -20
```

- [ ] **Step 2: Test on localhost**
Generate a kundali, go to Tippanni tab, verify:
- Lifetime timeline renders
- Current Mahadasha card shows yogas/doshas/divisional insights
- 9 antardasha cards render with assessments
- Expanding an antardasha shows full detail
- Pratyantardasha row shows colored blocks
- Critical pratyantardashas expand

- [ ] **Step 3: Commit final**
