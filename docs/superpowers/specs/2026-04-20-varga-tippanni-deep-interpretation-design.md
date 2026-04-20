# Varga Tippanni Deep Interpretation — Design Spec

**Date:** 2026-04-20
**Status:** Draft for review
**Scope:** Enhancement of divisional chart (Dxx) interpretation in the Tippanni system + VargasTab UI rework

---

## Problem Statement

The current varga-tippanni engine applies identical structural analysis (benefic/malefic counting, kendra/dusthana classification) with the same template sentences to every divisional chart. D9 and D10 read almost identically. The prognosis repeats because:

1. No planet-in-house text is differentiated by chart domain
2. No cross-referencing with D1 placement, dignity, lordships, aspects, dashas, or yogas
3. Multiple charts share the same domain category in dasha-prognosis (D1 and D10 both map to "career")
4. Only D3 Drekkana has chart-specific content (36 face archetypes)

**User impact:** "Tippanni analysis for Dxx — prognosis is just a repeat mostly."

---

## Design: 4-Layer Enhancement Architecture

### Layer 1: Domain-Specific Planet-in-House Interpretations

New data file with planet-in-house text keyed by domain. Unlike D1's generic PLANET_IN_HOUSE (108 entries), these focus on what a placement MEANS for that specific life area.

**6 priority domains × 9 planets × top 4-6 significant houses each:**

| Domain | Charts | Key Houses | Example |
|--------|--------|------------|---------|
| `marriage` | D9 | 1,2,4,7,8,12 | "Venus in D9's 7th: strong indicator of an attractive, harmonious spouse. Both partners value beauty and refinement." |
| `career` | D10 | 1,5,7,10,11 | "Saturn in D10's 10th: exceptional placement for long-term career building. Authority comes through persistence." |
| `children` | D7 | 1,5,7,9 | "Jupiter in D7's 5th: one of the strongest indicators of blessed progeny and emotional fulfillment through children." |
| `wealth` | D2, D4 | 1,2,4,9,11 | "Jupiter in D2's 2nd: natural wealth accumulator through wisdom-based professions." |
| `spiritual` | D20, D60 | 1,5,9,12 | "Ketu in D20's 12th: deep moksha potential; spiritual practices yield profound inner transformation." |
| `health` | D30 | 1,6,8,12 | "Saturn in D30's 6th: chronic but manageable health patterns requiring disciplined routine." |

**Est. ~250 entries (not all 648 — focus on significant placements)**

### Layer 2: Cross-Correlation Engine

New function `buildDeepVargaAnalysis()` that cross-references 12 data points per chart:

#### 2a. D1↔Dxx Comparison (LOW difficulty)
For each planet, compare D1 sign vs Dxx sign:
- Same sign = amplified (vargottama behavior)
- D1 exalted → Dxx debilitated = "promise exists at surface but weakens in this domain"
- D1 debilitated → Dxx exalted = "hidden strength that manifests specifically in this life area"

#### 2b. Functional Nature per Dxx Lagna (LOW)
Call existing `calculateFunctionalNature(dxxLagnaSign)`:
- A planet that's YogaKaraka for D1 but Badhak for Dxx = tension
- A planet that's functional benefic for Dxx lagna but malefic for D1 = domain-specific ally

#### 2c. Vargottama Detection (LOW)
Flag planets in the same sign in D1 and current Dxx:
- "Mars is vargottama in your D10 — career is a natural extension of your personality, with no dissonance between who you are and what you do professionally."

#### 2d. Pushkara Navamsha Check (LOW)
24 specific navamsha padas ruled by natural benefics. A planet in Pushkara = inherent hidden blessing:
- "Venus falls in Pushkara Navamsha — even if other factors are challenging, an undercurrent of grace supports this area."

Lookup table: Padas at Cancer, Taurus, Pisces, Sagittarius navamshas in the 9 trine nakshatras.

#### 2e. Gandanta Detection (LOW)
Planets within 3°20' of water↔fire sign boundaries (0°/120°/240° sidereal):
- "Mercury is at the Gandanta junction in D9 — a deep karmic knot around communication in relationships. Past-life patterns in how you express yourself in marriage surface strongly."

#### 2f. Key House Lordship Tracing (MEDIUM)
For each Dxx, identify THE most important house and trace its lord:
- D9 → 7th house lord. Where is that lord placed? In which dignity?
- D10 → 10th house lord
- D7 → 5th house lord
- D2 → 2nd house lord

"Your D9 7th lord is Venus, placed in the 9th house in exaltation — the spouse brings fortune, dharma, and higher purpose into your life."

#### 2g. AK/DK Placement (Jaimini) (LOW)
Atmakaraka and Darakaraka positions in Dxx:
- AK in D10's 10th house = soul's purpose aligns with career
- DK in D9's 7th house = spouse is a natural dharmic partner
- AK in D7's 5th house = soul deeply invested in children

#### 2h. Argala on Key Houses (LOW)
Call existing `calculateArgala(dxxPlanets, dxxLagna)`:
- "The 7th house of your D9 has supported argala from Jupiter in the 4th — divine grace actively intervenes to protect your marriage."
- "Virodha argala on D10's 10th from Saturn in the 3rd — career progress faces structural obstruction requiring extra effort."

#### 2i. Vimshopaka Per-Varga Dignity (LOW)
Surface existing Vimshopaka data for the specific varga:
- "Jupiter scores 18.5/20 Vimshopaka — strong across most divisions including this one. Its D9 placement carries full weight."

#### 2j. SAV Bindu Overlay (LOW)
Cross-reference D1 Sarvashtakavarga scores for signs occupied in Dxx:
- "Your D9 7th house falls in Taurus which has 32 SAV bindus — a well-supported sign adding potency to marriage significations."

#### 2k. Dasha Lord in Dxx (MEDIUM)
Find the current Mahadasha/Antardasha lord's placement in this specific chart:
- "During Venus Mahadasha (2020–2040), Venus sits in D9's 7th house in own sign — this 20-year period is THE most favorable window for marriage quality and partnership harmony."

#### 2l. Yoga Detection in Dxx (MEDIUM)
Call existing `detectAllYogas(dxxPlanets, dxxLagna)` with a curated relevance filter:
- D9: Gajakesari, Rajayoga, Mahapurusha (marriage-relevant)
- D10: Rajayoga, Dhana Yoga, Mahapurusha (career-relevant)
- D7: Gajakesari, Putrakameshti (children-relevant)
- D2/D4: Dhana Yoga, Lakshmi Yoga (wealth-relevant)

"Gajakesari Yoga forms in your D9 (Jupiter in kendra from Moon) — marriage blessed with wisdom, mutual respect, and social grace."

### Layer 3: Promise-Delivery Framework (MEDIUM)

Classical principle from BPHS/Jataka Parijata: D1 shows WHETHER something can happen (promise); Dxx shows HOW it manifests (delivery quality).

For each priority Dxx, check its "promise houses" in D1:

| Chart | Promise Houses in D1 | What to Check |
|-------|---------------------|---------------|
| D9 | 7th house, Venus, 7th lord | Is marriage promised? How strong? |
| D10 | 10th house, Sun, 10th lord | Is career prominence promised? |
| D7 | 5th house, Jupiter, 5th lord | Are children promised? How many? |
| D2 | 2nd house, 11th house, 2nd lord | Is wealth accumulation promised? |
| D4 | 4th house, 4th lord | Is property/vehicle promised? |
| D30 | 6th, 8th houses | What health challenges are indicated? |

Then compare D1 promise strength vs Dxx delivery quality:
- Strong D1 promise + strong Dxx = "clear manifestation, high quality"
- Strong D1 promise + weak Dxx = "the potential exists but manifestation is modest or delayed"
- Weak D1 promise + strong Dxx = "unexpected positive outcome in this area despite D1 indicators"
- Weak D1 promise + weak Dxx = "this area may not be a primary focus; redirect energy"

### Layer 4: Synthesized Narrative

Replace the current generic commentary with a structured multi-paragraph prognosis:

**Paragraph 1 — Chart Overview:**
"Your D9 Navamsha reveals [sign] rising, with lagna lord [planet] in the [Nth] house. This divisional chart's theme is [VARGA_DOMAINS description, shortened]. [Functional nature: yogakaraka/badhak for this lagna.]"

**Paragraph 2 — D1↔Dxx Comparison:**
"Compared to your birth chart: [planet] moves from [D1 sign] to [Dxx sign] — [dignity shift interpretation]. [Vargottama/Pushkara/Gandanta flags if present.]"

**Paragraph 3 — Key House & Lordship:**
"The [Nth] house lord (most significant for [domain]) is [planet], placed in [house] with [dignity]. [Argala status: supported/obstructed.] [AK/DK placement if relevant.]"

**Paragraph 4 — Yogas & Strengths:**
"[Yoga name] forms in your [Dxx], indicating [significance]. [Planet] has [Vimshopaka score] Vimshopaka. The [Nth] house sign has [SAV] Sarvashtakavarga bindus."

**Paragraph 5 — Timing (Dasha):**
"During your current [dasha lord] Mahadasha ([dates]), [lord]'s placement in [Dxx]'s [house] suggests [timing prediction]. [Promise vs delivery assessment.]"

---

## Priority Chart Coverage

| Tier | Charts | Full treatment (all 4 layers) |
|------|--------|-------------------------------|
| **Tier 1** | D9 (Navamsha), D10 (Dashamsha) | Yes — most impactful, most queried |
| **Tier 2** | D7 (Saptamsha), D2 (Hora), D4 (Chaturthamsha) | Yes — common life questions |
| **Tier 3** | D3 (Drekkana), D12 (Dwadashamsha), D30 (Trimsamsha), D60 (Shashtiamsha) | Layers 2+4 only (cross-correlation + narrative, no dedicated planet-in-house text) |
| **Tier 4** | Remaining (D16, D20, D24, D27, D40, D45) | Enhanced structural analysis only (vargottama, functional nature, dignity comparison) |

---

## Files to Create / Modify

| File | Action | Est. Lines |
|------|--------|------------|
| `src/lib/tippanni/varga-planet-interpretations.ts` | **CREATE** — Domain-specific planet-in-house text for 6 domains | ~500 |
| `src/lib/tippanni/varga-deep-analysis.ts` | **CREATE** — Cross-correlation engine (all 12 factors) | ~450 |
| `src/lib/tippanni/varga-promise-delivery.ts` | **CREATE** — Promise/delivery framework | ~150 |
| `src/lib/tippanni/varga-classical-checks.ts` | **CREATE** — Pushkara, Gandanta, Varga Visesha detection | ~120 |
| `src/lib/tippanni/varga-tippanni.ts` | **MODIFY** — Wire deep analysis into `analyzeChart` | ~150 changed |
| `src/lib/tippanni/varga-tippanni-types.ts` | **CREATE** — Extended types | ~60 |

**Total: ~1,430 new lines across 6 files**

---

## What Changes for the User

### Before (current)
> D9 Navamsha shows Aries rising. Lagna lord Mars is in the 5th house. Jupiter in the 4th house provides protection. Overall: moderate strength.

### After (enhanced)
> **Chart Overview:** Your Navamsha reveals an Aries ascendant, making Mars both your D1 and D9 lagna lord (vargottama lagna lord — rare alignment where personality and soul purpose are unified). Mars is a functional benefic for Aries lagna, and here serves as a powerful 1st+8th lord.
>
> **D1↔D9 Shift:** Mars moves from Capricorn (exalted in D1) to Leo in D9 — the shift from disciplined ambition to bold self-expression suggests marriage brings out your more dramatic, creative side. Venus moves from Pisces (exalted in D1) to Sagittarius in D9 — a philosophical, adventure-seeking quality colors your romantic nature. Venus falls in Pushkara Navamsha — a hidden blessing supports partnership harmony.
>
> **Key House:** Your 7th lord Venus is placed in the 9th house — spouse brings fortune, higher learning, and dharmic growth. Jupiter aspects the 7th from the 4th house, creating supported argala on the 7th — divine grace actively protects the marriage. Your Darakaraka (Saturn) falls in D9's 10th house — spouse is career-oriented and brings structure to your public life.
>
> **Yogas & Strength:** Gajakesari Yoga forms in D9 (Jupiter in kendra from Moon) — marriage blessed with wisdom and social grace. Malavya Mahapurusha Yoga (Venus in kendra in own/exalted sign) — refined partnership with strong aesthetic bond. Venus scores 17.2/20 Vimshopaka — strong across most divisions.
>
> **Timing:** During your current Jupiter Mahadasha (2024–2040), Jupiter's placement in D9's 4th house indicates domestic happiness through marriage. D1 promise: strong 7th house with benefic aspects = marriage is clearly promised. D9 delivery: multiple yogas + exalted 7th lord = high-quality, dharmic partnership. This is one of the most favorable periods for deepening marital bonds.

---

## Task 2: VargasTab UI Rework (Next Phase)

### Current Problems
1. Tab shows a grid of planet placements with dignity badges but no interpretive text inline
2. Vimshopaka Bala table is separate from planet context
3. No visual indication of D1↔Dxx dignity shifts
4. Key house analysis is structural (kendra/dusthana counts) not meaningful
5. No yoga or argala display for divisional charts
6. Chart navigation is a flat dropdown — no visual hierarchy by importance

### Proposed UI Structure

```
┌─────────────────────────────────────────────────┐
│ [Chart Selector: D9 Navamsha ▼]                 │
│ Tier badge: ★★★ (primary)                       │
├─────────────────────────────────────────────────┤
│ ┌─── Chart ──────┐  ┌─── Overview ────────────┐ │
│ │ North/South    │  │ Aries rising             │ │
│ │ Diamond/Grid   │  │ Lagna lord: Mars (5H)    │ │
│ │ with planet    │  │ 7th lord: Venus (9H, ☆)  │ │
│ │ glyphs         │  │ AK: Saturn in 10H        │ │
│ │                │  │ Yogas: 2 detected         │ │
│ └────────────────┘  └──────────────────────────┘ │
├─────────────────────────────────────────────────┤
│ Planet Placements (with D1 comparison)           │
│ ┌────────┬────────┬─────────┬──────────────────┐ │
│ │ Planet │ D1→D9  │ Dignity │ Interpretation   │ │
│ ├────────┼────────┼─────────┼──────────────────┤ │
│ │ ☉ Sun  │ Cp→Le  │ ↓ weak  │ Leadership in... │ │
│ │ ☽ Moon │ Cn→Cn  │ ★ vargo │ Emotional cont..│ │
│ │ ♂ Mars │ Cp→Le  │ ↓ fall  │ Assertiveness...│ │
│ └────────┴────────┴─────────┴──────────────────┘ │
├─────────────────────────────────────────────────┤
│ ▼ Detailed Analysis (expandable)                 │
│   • Promise/Delivery assessment                  │
│   • Key house lordship trace                     │
│   • Argala on key houses                         │
│   • Dasha lord in this chart                     │
│   • Yoga details                                 │
├─────────────────────────────────────────────────┤
│ Synthesized Prognosis                            │
│ [Multi-paragraph narrative from Layer 4]          │
└─────────────────────────────────────────────────┘
```

### Key UI Changes
1. **D1→Dxx column** in planet table showing sign shift with ↑/↓/★ indicators
2. **Vargottama/Pushkara/Gandanta badges** on planet rows
3. **Key house card** highlighting THE most important house for this chart (7th for D9, 10th for D10)
4. **Yoga cards** showing divisional-chart-specific yogas detected
5. **Promise/Delivery meter** — visual gauge showing D1 promise strength vs Dxx delivery quality
6. **Chart tier indicator** — ★★★/★★/★ showing chart importance
7. **Prognosis section** — the synthesized narrative, not hidden behind a tab

### Implementation Approach
- Refactor VargasTab from a flat data grid to a structured multi-section layout
- Each section is a card matching the mega-card style (`bg-gradient-to-br from-[#2d1b69]/40...`)
- Planet table uses a responsive grid (not HTML table) with expandable rows
- Prognosis section renders the enhanced varga-tippanni output

---

## Implementation Sequence

1. **Phase 1 — Engine (Layers 1-3):** Create the 4 new files (interpretations, deep analysis, promise/delivery, classical checks). Wire into varga-tippanni.ts. Verify with existing tests + new unit tests.

2. **Phase 2 — VargasTab UI Rework:** Redesign the tab component to consume the enhanced data. New layout with D1 comparison, yoga display, prognosis section, promise/delivery meter.

3. **Phase 3 — Polish:** Review all 8 priority charts in the browser. Tune interpretation text quality. Add missing entries for under-covered placements.

---

## What We Will NOT Do
- Recompute full Shadbala for divisional positions (HIGH effort, marginal gain)
- Recompute Bhava Bala for divisional houses (HIGH effort)
- Narayana Dasha for each Dxx (MEDIUM effort, deferred to future — powerful but complex)
- Arudha Padas in Dxx (deferred — meaningful but complex)
- D-150 correlation (already has its own tab)
