# Unified Tippanni / Life Summary — Granular Spec

**Date:** 2026-05-01  
**Status:** FINAL — User Approved Direction  
**Principle:** Two engines remain. One unified reading experience. Redundant UI removed AFTER verification.

---

## The Problem

The user sees TWO separate readings of their chart:

1. **Life Reading** (Domain Synthesis) — the dashboard default. 8 domain cards with ratings, narratives, timelines, remedies. Excellent "what should I do" guidance. But no classical depth — no yoga citations, no planet-by-planet analysis, no dosha cancellation logic.

2. **Tippanni** — buried 3 clicks deep in the technical view (tab 6 of 25). Excellent classical analysis — personality, all planets with BPHS citations, all yogas, all doshas with cancellation, yearly predictions, dasha synthesis to pratyantar level. But generic presentation, no domain-specific actionability.

These two systems:
- Rate the SAME domain differently (Tippanni: simple `rateHouse()` vs Domain Synthesis: 7-factor composite)
- Cover overlapping ground without referencing each other
- Are presented on completely separate views with no cross-linking
- Leave the user wondering which reading to trust

---

## The Solution: Tippanni / Life Summary

**One unified reading that flows like a real pandit consultation.**

The pandit doesn't give you two reports. They give you one conversation:
1. "Here is who you are" (personality)
2. "Here is what your chart promises" (yogas, planetary strengths)
3. "Here is where you are now" (dasha, transits)
4. "Here is what each area of your life looks like" (domains with classical evidence)
5. "Here is what's coming" (year ahead, key dates)
6. "Here is what you can do" (remedies, action plan)

### New View: `'summary'`

Replace the current `questionEntry` → `dashboard` flow with a single `'summary'` view that IS the tippanni + life reading combined.

```
Current flow:
  questionEntry → dashboard (life reading) → [toggle] → technical → tippanni tab
  
New flow:
  summary (unified reading, scrollable) → [expand any section] → classical detail
  technical view → [preserved exactly as-is for power users]
```

---

## Section-by-Section Design

### Section 1: Chart Narrative (EXISTS — no changes)

**Source:** `chart-narrative.ts` → `buildChartNarrative()`  
**What it shows:** The pandit's opening statement. 3-5 woven threads connecting dominant planet + yoga + dasha + dosha + life stage.  
**Changes:** None. Already at the top.

---

### Section 2: Who You Are — Personality

**Source:** Tippanni `personality` section (lagna, Moon sign, Sun sign, `currentRelevance`)  
**Currently:** Buried in tippanni tab.  
**In unified view:** Rendered immediately after chart narrative.

```
┌─────────────────────────────────────────────────┐
│ WHO YOU ARE                                      │
│                                                  │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│ │ LAGNA       │ │ MOON SIGN   │ │ SUN SIGN    ││
│ │ Taurus ♉    │ │ Cancer ♋    │ │ Pisces ♓    ││
│ │ Stable,     │ │ Emotional,  │ │ Intuitive,  ││
│ │ determined..│ │ nurturing...│ │ creative... ││
│ └─────────────┘ └─────────────┘ └─────────────┘│
│                                                  │
│ ⟡ What This Means for You Now (life stage)       │
│ "At 38, your Taurus steadiness is your..."       │
└─────────────────────────────────────────────────┘
```

**Data:** `tippanni.personality` — no new computation.  
**Change:** Move rendering from TippanniTab to the unified summary.  
**TippanniTab keeps it too** — no deletion.

---

### Section 3: Your Planetary Strengths — Shadbala Overview

**Source:** Tippanni `strengthOverview`  
**Currently:** Buried in tippanni tab.  
**In unified view:** Compact horizontal bar chart showing 9 planet strengths. Expandable to show the full per-planet insights from `tippanni.planetInsights`.

```
┌─────────────────────────────────────────────────┐
│ YOUR PLANETARY STRENGTHS                         │
│                                                  │
│ ☉ Sun     ████████░░  78%  Strong               │
│ ☽ Moon    ██████░░░░  62%  Moderate              │
│ ♂ Mars    █████░░░░░  48%  Needs support         │
│ ...                                              │
│                                                  │
│ [▸ See detailed planet-by-planet analysis]        │
│   → Expands to show tippanni.planetInsights      │
│     (full BPHS citations, dignity, avasthas)     │
└─────────────────────────────────────────────────┘
```

**Data:** `tippanni.strengthOverview` + `tippanni.planetInsights` (expandable)  
**Change:** Rendered in summary. TippanniTab keeps it too.

---

### Section 4: Yogas & Doshas — What Your Chart Carries

**Source:** Tippanni `yogas` + `doshas`  
**Currently:** Buried in tippanni tab (and separately in yogas/doshas technical tabs).  
**In unified view:** Compact cards — top 5 yogas (sorted by ageRelevance × strength) + active doshas with cancellation status. Expandable to show full list with classical citations.

```
┌─────────────────────────────────────────────────┐
│ WHAT YOUR CHART CARRIES                          │
│                                                  │
│ ✦ YOGAS (5 most relevant for your life stage)    │
│ ┌──────────────────────────────────────────────┐ │
│ │ Gaja Kesari Yoga ⭐ Strong                   │ │
│ │ Jupiter + Moon conjunction/aspect → wisdom,  │ │
│ │ reputation, family happiness                 │ │
│ │ "At your stage, this yoga supports career    │ │
│ │  leadership..." (stageContext)               │ │
│ │ [BPHS Ch.36 Sl.4]                           │ │
│ └──────────────────────────────────────────────┘ │
│ ... (4 more)                                     │
│ [▸ See all 12 detected yogas]                    │
│                                                  │
│ ⚠ DOSHAS                                         │
│ ┌──────────────────────────────────────────────┐ │
│ │ Mangal Dosha — Moderate (partially cancelled)│ │
│ │ Mars in 7th from Lagna                       │ │
│ │ Cancellation: ✓ Jupiter aspects 7th          │ │
│ │ [▸ Full cancellation analysis]               │ │
│ └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Data:** `tippanni.yogas` + `tippanni.doshas`  
**Change:** Rendered in summary. Full lists remain expandable. Technical tabs untouched.

---

### Section 5: Your Life Domains — The Core Reading

**Source:** Domain Synthesis `personalReading.domains` (8 domains) — THIS is the primary rating.  
**Enriched with:** Tippanni `lifeAreas` classical evidence (planet placements, house lords).  
**Currently:** Dashboard shows domain cards. Tippanni shows life areas separately.  
**In unified view:** Domain cards from Domain Synthesis, but each card has a "Classical Evidence" expandable that shows the Tippanni's planet/house analysis for that domain.

```
┌─────────────────────────────────────────────────┐
│ YOUR LIFE DOMAINS                                │
│ (ordered by life stage priority)                 │
│                                                  │
│ ┌──────────────────────────────────────────────┐ │
│ │ CAREER ★★★★★★★☆☆☆  Uttama (7.2/10)          │ │
│ │ Most relevant for you now                    │ │
│ │                                              │ │
│ │ "Saturn in 10th brings disciplined career    │ │
│ │  growth. Jupiter's aspect amplifies this..." │ │
│ │ (Domain Synthesis narrative)                 │ │
│ │                                              │ │
│ │ ┌─ Timeline ──────────────────────────────┐  │ │
│ │ │ 2026 Jun: Saturn transit activates 10th │  │ │
│ │ │ 2027 Mar: Jupiter enters career house   │  │ │
│ │ └─────────────────────────────────────────┘  │ │
│ │                                              │ │
│ │ ┌─ Remedies ──────────────────────────────┐  │ │
│ │ │ Gemstone: Blue Sapphire (Neelam)        │  │ │
│ │ │ Mantra: ॐ शं शनैश्चराय नमः (108 daily) │  │ │
│ │ └─────────────────────────────────────────┘  │ │
│ │                                              │ │
│ │ [▸ Classical Evidence]                       │ │
│ │   10th lord Mercury in 4th (Kendra)         │ │
│ │   Sun in 10th — authority, govt connection   │ │
│ │   SAV: H10 = 32 bindu (above average)       │ │
│ │   (from Tippanni lifeAreas.career)           │ │
│ │                                              │ │
│ │ [▸ Deep Dive →]  (opens DomainDeepDive)     │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ ┌──────────────────────────────────────────────┐ │
│ │ WEALTH ★★★★★★☆☆☆☆  Madhyama (6.1/10)       │ │
│ │ ...                                          │ │
│ └──────────────────────────────────────────────┘ │
│ ... (6 more domains)                             │
└─────────────────────────────────────────────────┘
```

**Scoring:** Domain Synthesis 7-factor composite is PRIMARY.  
**Tippanni rating:** Shown as "Classical Assessment: 8/10" in the expandable evidence section — not hidden, not conflicting, clearly labeled as a different methodology.  
**Order:** `tippanni.lifeStage.priorityOrder` determines display order.  
**Deep Dive:** Each domain card links to the existing `DomainDeepDive` component (unchanged).

---

### Section 6: Where You Are Now — Current Period

**Source:** MERGED from both systems.  
- Tippanni: `dashaInsight` (current maha + antar with dignity analysis, stage advice) + `yearPredictions` (quarterly forecast, transit events)
- Domain Synthesis: `currentPeriod` card (cross-domain activation) + `keyDates`

```
┌─────────────────────────────────────────────────┐
│ WHERE YOU ARE NOW                                │
│                                                  │
│ ┌─ Current Dasha ───────────────────────────────┐│
│ │ Jupiter Mahadasha (2022-2038)                 ││
│ │ Saturn Antardasha (2025 Sep - 2028 Mar)       ││
│ │                                               ││
│ │ "Jupiter as your dasha lord activates Gaja    ││
│ │  Kesari Yoga. At your age, this means career  ││
│ │  leadership and institutional recognition..." ││
│ │ (from tippanni.dashaInsight + stage advice)    ││
│ │                                               ││
│ │ Domains Activated Now:                        ││
│ │ ● Career (strong) ● Wealth (moderate)         ││
│ │ (from domain synthesis currentPeriod)          ││
│ └───────────────────────────────────────────────┘│
│                                                  │
│ ┌─ Year Ahead ──────────────────────────────────┐│
│ │ Q1 2026: Favorable — Jupiter transit supports ││
│ │ Q2 2026: Mixed — Saturn retrograde challenges ││
│ │ Q3 2026: Strong — dasha activation peak       ││
│ │ Q4 2026: Stable — consolidation phase         ││
│ │ (from tippanni.yearPredictions.quarters)       ││
│ └───────────────────────────────────────────────┘│
│                                                  │
│ ┌─ Key Dates ───────────────────────────────────┐│
│ │ 📅 Jun 12 — Saturn enters Pisces (transit)    ││
│ │ 📅 Aug 3 — Antardasha transition (Mer→Ket)    ││
│ │ 📅 Nov 8 — Diwali (festival muhurta)          ││
│ │ (from domain synthesis keyDates)               ││
│ └───────────────────────────────────────────────┘│
│                                                  │
│ [▸ Full Dasha Timeline (Pratyantar level)]       │
│   → Expands tippanni.dashaSynthesis              │
└─────────────────────────────────────────────────┘
```

---

### Section 7: What You Can Do — Unified Remedies

**Source:** MERGED from both systems.  
- Tippanni: planet-centric remedies (gemstones, mantras, practices)  
- Domain Synthesis: domain-centric remedies (what to do for career, health, etc.)  
- ActionPlan: modern practical guidance (best days, lifestyle, affirmation)

```
┌─────────────────────────────────────────────────┐
│ WHAT YOU CAN DO                                  │
│                                                  │
│ ⚠ "At your age, strict fasting may be           │
│    challenging. Consider lighter alternatives."  │
│ (life stage remedy advisory)                     │
│                                                  │
│ ┌─ By Planet (Classical) ───────────────────────┐│
│ │ Mars (weak — 42% shadbala):                   ││
│ │  Gemstone: Red Coral (4-6 ratti, gold ring)   ││
│ │  Mantra: ॐ अं अङ्गारकाय नमः (10,000)         ││
│ │  Charity: Red lentils on Tuesday              ││
│ └───────────────────────────────────────────────┘│
│                                                  │
│ ┌─ By Life Area (Practical) ────────────────────┐│
│ │ For Career:                                   ││
│ │  • Wear Blue Sapphire after consulting pandit ││
│ │  • Chant Saturn beej mantra Saturdays         ││
│ │  • Lifestyle: structured morning routine      ││
│ │                                               ││
│ │ For Health:                                   ││
│ │  • Strengthen Mars (weak — governs vitality)  ││
│ │  • Best days this week: Tue, Thu              ││
│ │  • Avoid: overexertion on Saturdays           ││
│ └───────────────────────────────────────────────┘│
│                                                  │
│ ┌─ This Week's Action Plan ─────────────────────┐│
│ │ 🌅 Affirmation: "I build with patience..."    ││
│ │ 📋 Practice: 15 min Hanuman Chalisa daily     ││
│ │ 📅 Best days: Tuesday, Thursday               ││
│ │ ⚠ Avoid: major decisions on Saturday          ││
│ │ (from Domain Synthesis ActionPlan)             ││
│ └───────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

---

### Section 8: Convergence Summary (EXISTS — no changes)

**Source:** `tippanni.convergence`  
**Currently:** Rendered at the bottom of TippanniTab.  
**In unified view:** Rendered after remedies. Shows pattern matches, urgent flags, section markers.

---

## Navigation Changes

### Before (current — 4 views)

```
Generate Kundali
  → QuestionEntry ("What do you want to explore?")
    → Dashboard (life reading cards)
      → Deep Dive (single domain)
    → Toggle Technical (25 tabs including tippanni)
```

### After (3 views)

```
Generate Kundali
  → Summary (THE reading — unified tippanni + life reading, scrollable)
    → Any domain card → Deep Dive (single domain, unchanged)
    → "Technical Analysis" button → Technical View
  
Technical View:
  Charts, planet tables, shadbala, ashtakavarga, varga, Jaimini, KP,
  avasthas, argala, sphutas, bhavabala, bhava chalit, sudarshana, nadi,
  ayanamsha, dasha timeline, life timeline, patrika, blueprint, chat
  (NO tippanni tab — its content is in the Summary)
```

**View states:** `'summary' | 'deepDive' | 'technical'`
- `questionEntry` — REMOVED (Summary replaces it)
- `dashboard` — REMOVED (Summary replaces it)
- `tippanni` tab in technical — REMOVED (Summary contains all its content)

**ELI5 mode:** Toggle available on Summary view (simplified version of the unified reading).

**AI Chat:** Remains in Technical view (it needs the full kundali context).

**PDF/Patrika:** Header buttons remain (unchanged). PDF exports from the Summary data.

---

## Two-Phase Implementation

### Phase 1: Build Summary (ADDITIVE — nothing removed yet)

Build the SummaryView. Add `'summary'` as a new view state alongside the existing ones. Set as default. Verify every piece of information from Tippanni and Domain Synthesis appears in the Summary. All old views still accessible for comparison.

### Phase 2: Cleanup (AFTER Phase 1 verification)

Once verified that Summary contains EVERYTHING:
1. Remove `questionEntry` view (no longer default)
2. Remove `dashboard` view (replaced by Summary)
3. Remove `tippanni` tab from Technical view tab strip
4. Remove `LifeReadingDashboard` component usage from kundali page
5. Delete view state options: `'questionEntry' | 'dashboard'`
6. Component FILES are NOT deleted — only their usage in kundali/page.tsx is removed. They may be used elsewhere (PDF export, saved chart preview, etc.)

**Phase 2 happens in a SEPARATE commit** so it can be reverted independently if anything is missing.

---

## What Changes vs What Stays

### Phase 1 Changes (ADDITIVE only — NO engine changes)

| Change | Type | Risk |
|--------|------|------|
| New `SummaryView` component | New component | Zero — additive |
| New `SummaryDomainCard` component | New component | Zero — additive |
| New `SummaryCurrentPeriod` component | New component | Zero — additive |
| New `SummaryRemedies` component | New component | Zero — additive |
| Add `'summary'` view state, set as default | State change | Low — one line |
| Summary renders sections from both `tip` and `personalReading` | Composition | Low — reads existing data |

### Phase 2 Changes (AFTER verification)

| Change | Type | Risk |
|--------|------|------|
| Remove `questionEntry` view | Removal | Low — Summary replaces |
| Remove `dashboard` view | Removal | Low — Summary replaces |
| Remove `tippanni` from technical tab strip | Removal | Low — Summary contains all |
| Remove `LifeReadingDashboard` from kundali page | Removal | Low — Summary replaces |

### NEVER TOUCHED (in either phase)

| Preserved | Why |
|-----------|-----|
| `tippanni-engine.ts` | Computation engine — never changed |
| `domain-synthesis/synthesizer.ts` | Computation engine — never changed |
| `TippanniTab.tsx` FILE | May be used by PDF export, other pages |
| `LifeReadingDashboard.tsx` FILE | May be used elsewhere |
| `DomainDeepDive.tsx` | Still used from Summary domain cards |
| All tippanni data files | Content unchanged |
| All domain synthesis data files | Content unchanged |
| All test files | No engine changes → no test changes |
| Festival/calendar/panchang systems | Completely untouched |
| Adhik Masa logic | Completely untouched |
| Swiss Eph sunrise engine | Completely untouched |
| Technical tabs (23 remaining) | Charts, planet tables, dasha, shadbala, etc. |

---

## New Files

| File | Purpose | Size estimate |
|------|---------|--------------|
| `src/components/kundali/SummaryView.tsx` | The unified reading component | ~800 lines |
| `src/components/kundali/SummaryDomainCard.tsx` | Domain card with Tippanni evidence expand | ~200 lines |
| `src/components/kundali/SummaryCurrentPeriod.tsx` | Merged dasha + year predictions + key dates | ~300 lines |
| `src/components/kundali/SummaryRemedies.tsx` | Merged planet + domain remedies | ~250 lines |

---

## Files Modified (UI ONLY)

| File | Change |
|------|--------|
| `src/app/[locale]/kundali/page.tsx` | Add `'summary'` view state. Set as default. Render `SummaryView` in LAYER 0. ~20 lines changed. |

---

## Data Flow

```
kundali (API response)
  ├─ generateTippanni(kundali, locale)     → tip: TippanniContent
  ├─ synthesizeReading(kundali, locale)     → personalReading: PersonalReading  
  ├─ computeKeyDates(kundali)              → keyDates: KeyDate[]
  └─ generateVedicProfile(kundali, locale) → vedicProfile
        │
        ▼
   SummaryView receives ALL of the above as props
        │
        ├─ Section 1: tip.chartNarrative
        ├─ Section 2: tip.personality + tip.lifeStage
        ├─ Section 3: tip.strengthOverview + tip.planetInsights (expandable)
        ├─ Section 4: tip.yogas + tip.doshas (expandable)
        ├─ Section 5: personalReading.domains + tip.lifeAreas (evidence)
        ├─ Section 6: tip.dashaInsight + tip.yearPredictions + personalReading.currentPeriod + keyDates
        ├─ Section 7: tip.remedies + personalReading.domains[].remedies + actionPlan
        └─ Section 8: tip.convergence
```

No new computations. No new API calls. Pure UI composition of existing data.

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Adhik Masa logic lost (happened before) | NO festival/calendar/panchang code touched. Not even in the same directory. |
| Information lost in Summary | Phase 1 INFORMATION AUDIT (step 13): side-by-side checklist before Phase 2 |
| Phase 2 removes something needed | Phase 2 is a separate commit. `git revert` restores old views instantly. |
| Score confusion (two ratings for same domain) | Domain Synthesis = primary rating displayed. Tippanni = "Classical Assessment" in expandable evidence — clearly labeled. |
| Page becomes too long | Progressive disclosure — sections are compact by default, [▸ expand] for depth |
| Performance (rendering both systems) | Both are already computed at page level (`useMemo`). SummaryView just reads the data. Zero new computation. |
| 3005 tests break | No engine changes → no test changes. Verified TWICE (after Phase 1 and Phase 2). |
| Component files deleted accidentally | Phase 2 does NOT delete component files — only removes their usage from kundali page. Files stay for PDF export, other pages. |

---

## What This Does NOT Do

- Does NOT merge the two computation engines into one
- Does NOT change any scoring algorithm
- Does NOT delete any computation file (tippanni-engine.ts, synthesizer.ts, etc.)
- Does NOT delete any component FILE — only removes rendering from kundali page in Phase 2
- Does NOT touch festivals, panchang, calendar, or any non-kundali code
- Does NOT require any new API endpoints or database changes
- Does NOT change the kundali API response shape
- Does NOT affect PDF export, saved charts, or chart sharing

---

## Implementation Order

### Phase 1: Build (ADDITIVE)

1. Create `SummaryView.tsx` — the unified reading component (reads existing data, renders 8 sections with progressive disclosure)
2. Create `SummaryDomainCard.tsx` — domain card with Domain Synthesis rating + narrative + timeline + remedies + Tippanni classical evidence expandable
3. Create `SummaryCurrentPeriod.tsx` — merged dasha insight + year predictions + key dates
4. Create `SummaryRemedies.tsx` — merged planet-centric + domain-centric remedies + action plan
5. Add `'summary'` view state to kundali page, set as default
6. ELI5 toggle on Summary view

### Phase 1: Verify

7. Generate kundali for a young person (born 2004) — verify all 8 sections render, life stage framing correct
8. Generate kundali for a middle-aged person (born 1985) — verify domain ordering, dasha content
9. Generate kundali for an elder (born 1958) — verify health-first ordering, remedy advisory
10. Verify technical view still works with all tabs (click through each)
11. Verify DomainDeepDive still works from domain card clicks
12. Run full test suite (3005 tests must pass unchanged)
13. **INFORMATION AUDIT:** Side-by-side comparison — open old TippanniTab and new Summary. Checklist every data point that appears in old but not in new. Fix gaps before Phase 2.

### Phase 2: Cleanup (SEPARATE COMMIT)

14. Remove `questionEntry` view code from kundali page
15. Remove `dashboard` view code from kundali page  
16. Remove `tippanni` from technical tab strip (tab still exists in code, just not rendered)
17. Update view state type: `'summary' | 'deepDive' | 'technical'`
18. Final browser verification — Summary is the default, Technical works, Deep Dive works
19. Run full test suite again

### Rollback plan

If Phase 2 reveals missing information:
- `git revert` the Phase 2 commit
- Fix the gaps in Phase 1
- Re-attempt Phase 2

Phase 1 and Phase 2 are ALWAYS separate commits.
