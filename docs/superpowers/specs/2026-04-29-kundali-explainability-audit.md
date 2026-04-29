# Kundali Tab Explainability Audit

**Date:** 2026-04-29
**Auditor:** Claude Opus 4.6
**Scope:** All tab components in `src/components/kundali/` evaluated for interpretive content

## Scoring Criteria

For each tab, four dimensions are evaluated:

| Dimension | Description |
|-----------|-------------|
| **What is X?** | Does the tab have an introductory explanation of the concept? |
| **Data meaning** | Does it explain what the numbers/values/colors mean? |
| **Personalized interpretation** | Does it give chart-specific commentary, not just raw data? |
| **Actionable guidance** | Does it explain what to DO with the information? |

## Audit Results

### 1. BhavaChalitTab.tsx (FIXED in this commit)

| Dimension | Before | After |
|-----------|--------|-------|
| What is X? | Weak (generic note at bottom) | Strong (prominent "What is Bhava Chalit?" at top with Rashi vs Bhava explanation) |
| Data meaning | Weak (one-word house keywords) | Strong (expanded house themes, impact interpretation paragraphs) |
| Personalized interpretation | None | Strong (per-planet shift interpretation with house theme analysis, sentiment labels) |
| Actionable guidance | None | Strong (prediction guidance per planet: which house themes to use for dasha/transit) |

---

### 2. ShadbalaTab.tsx + ShadbalaRadar.tsx + ShadbalaRadarDetail.tsx

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **YES** | Subtitle: "Classical six-component planetary strength calculation" |
| Data meaning | **YES** | Radar chart has axis descriptions (Sthana = positional, Dig = directional, etc.). Color coding for ratio >= 1.0. Detail view breaks down sub-components. |
| Personalized interpretation | **PARTIAL** | Radar shows relative strengths visually. Color-coded rank/ratio values. But no prose like "Your Jupiter is your strongest planet, meaning..." |
| Actionable guidance | **NO** | Does not explain: "A strong Jupiter means wisdom/children themes flourish; a weak Mars means initiative needs conscious effort." |

**Recommendation:** Add a 2-3 sentence per-planet "So what?" after the radar: strongest planet = your natural advantage area; weakest planet = area requiring conscious effort. Link Ishta/Kashta Phala to benefic/malefic expected results.

---

### 3. VargasTab.tsx

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **YES** | Each varga has name, meaning, and key house label (e.g., D9 = Marriage & Dharma). VARGA_INFO metadata is rich. |
| Data meaning | **YES** | Dignity badges (exalted, debilitated, vargottama), deep analysis engine provides domain insights with strength ratings. |
| Personalized interpretation | **YES** | `buildDeepVargaAnalysis()` generates chart-specific commentary per varga. Drekkana face descriptions included. |
| Actionable guidance | **PARTIAL** | Domain insights say "strong" or "weak" but don't always say what to do about it. |

**Recommendation:** Minimal improvements needed. Could add remedial suggestions for weak varga placements.

---

### 4. SphutasTab.tsx

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **YES** | Rich educational intro: "What are Sphutas?" with Yogi/Avayogi, Prana/Deha/Mrityu, Transit Activation sub-sections. |
| Data meaning | **YES** | Each sphuta type explained. Sign elements, house themes mapped. |
| Personalized interpretation | **YES** | Synthesis paragraph: "Your Prana is rooted in X sign... Deha in Y gives you... Yogi Planet is Z." |
| Actionable guidance | **YES** | Transit timeline shows upcoming key windows with benefic/malefic markers and specific action text. |

**Verdict:** Excellent. This tab is the gold standard for explainability. Other tabs should follow this pattern.

---

### 5. BhavabalaTab.tsx

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **MINIMAL** | Title says "Bhavabala -- House Strength" but no explanation of what house strength means or why it matters. |
| Data meaning | **YES** | Color coding (green >= 120%, gold >= 90%, red < 90%). Bar chart visualization. Percentage column. |
| Personalized interpretation | **NO** | Pure data table + bar chart. No prose explaining "Your 10th house (career) is your strongest house at 142%, meaning career themes are well-supported." |
| Actionable guidance | **NO** | No guidance on what strong/weak houses mean for life areas. |

**Recommendation:** Add intro paragraph explaining house strength concept. Add top-3 strongest and weakest house summary with life-area implications. Example: "Your strongest house is the 9th (Fortune/Dharma) -- fortune, father, and higher learning themes are powerfully supported in your chart."

---

### 6. NadiAmshaTab.tsx

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **YES** | Excellent: "What is Nadi Amsha (D-150)?" with 3 sub-cards explaining Nadi Number, D-150 Sign, and Karmic Theme. Birth time sensitivity warning. |
| Data meaning | **YES** | Nadi number, D-150 sign, and karmic interpretation per planet. |
| Personalized interpretation | **YES** | Each planet has expandable karmic theme text. |
| Actionable guidance | **PARTIAL** | Karmic themes are descriptive but don't suggest concrete actions or which dashas to watch. |

**Verdict:** Strong. Minor improvement: add a note about which dasha periods activate Nadi-level karma.

---

### 7. YogasTab.tsx

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **YES** | InfoBlock: "What are Yogas?" with detailed explanation of Raja, Dhana, Mahapurusha, and inauspicious yogas. |
| Data meaning | **YES** | Present/absent badges, strength rating (Strong/Moderate/Weak), auspicious/inauspicious color coding, category grouping. |
| Personalized interpretation | **YES** | Each yoga has description, involved planets, and expandable details. Present count and breakdown shown. |
| Actionable guidance | **PARTIAL** | Descriptions explain what the yoga does, but no guidance on activation periods or remedies. |

**Verdict:** Good. Could add: "This yoga activates most during [involved planet] dasha periods."

---

### 8. GrahaTab.tsx

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **MINIMAL** | Title "Graha Details" with no explanation of what the columns mean or why they matter. |
| Data meaning | **PARTIAL** | R = retrograde, C = combust badges. But latitude, R.A., declination, speed are raw numbers with no explanation. |
| Personalized interpretation | **YES** | `planetInsights` section provides per-planet interpretation with sign, house, and implications. Upagraha notes explain each upagraha's significance. |
| Actionable guidance | **PARTIAL** | Planet insights give implications but the raw data table at top has no guidance. |

**Recommendation:** Add a brief intro explaining: "This table shows the precise astronomical positions of all 9 planets. Retrograde (R) means the planet appears to move backward -- its effects become internalized. Combust (C) means the planet is too close to the Sun -- its significations are temporarily weakened."

---

### 9. AshtakavargaTab.tsx

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **PARTIAL** | Has InfoBlock but relies on `t()` translation key. Strong/weak sign insights computed from SAV table. |
| Data meaning | **YES** | SAV scores with strong (>=28) and weak (<22) thresholds. Transit windows for slow planets through strong/weak signs. |
| Personalized interpretation | **YES** | "Strong signs" and "weak signs" identified. Transit windows computed showing when Jupiter/Saturn/Rahu pass through these signs. |
| Actionable guidance | **YES** | Transit windows give specific date ranges: "Saturn in [strong sign] from May 2027 -- Apr 2029" with type indicators. |

**Verdict:** Good overall. The transit window feature is particularly useful.

---

### 10. SadeSatiTab.tsx

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **YES** (inferred from section labels: summary, phase effect, Saturn's nature, Moon strength) |
| Data meaning | **YES** | Intensity scoring (Mild/Moderate/Challenging/Intense) with color coding. Phase labels (Rising/Peak/Setting). |
| Personalized interpretation | **YES** | Saturn's nature for specific ascendant. Moon strength analysis. Dasha interplay. Ashtakavarga insight. Nakshatra transit details. |
| Actionable guidance | **YES** | Remedies section with priority levels (essential, recommended, supportive). |

**Verdict:** Excellent. One of the most complete tabs in terms of explainability.

---

### 11. BlueprintTab.tsx

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **YES** | Cosmic Blueprint concept with primary/shadow archetypes, current chapter (dasha), and headline. |
| Data meaning | **YES** | Timeline visualization with elapsed progress. Active yogas listed. |
| Personalized interpretation | **YES** | Narrative-driven: primary archetype, shadow archetype, current life chapter, next chapter preview. |
| Actionable guidance | **YES** | "Navigate to Dasha" button for deeper exploration. Chapter framing gives life-stage context. |

**Verdict:** Excellent. This is a model tab for interpretive content.

---

### 12. JaiminiTab.tsx (728 lines)

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **YES** | Large tab covering Jaimini system: Chara Karakas, Chara Dasha, Argala, Arudha Padas. |
| Data meaning | **YES** | Karaka roles explained, Argala intervention/obstruction concepts included. |
| Personalized interpretation | **YES** | Chart-specific karaka assignments, dasha timeline, and interpretations. |
| Actionable guidance | **PARTIAL** | Argala section explains concept but doesn't always tie to concrete life advice. |

**Verdict:** Good. Argala interpretation could be more explicit about "what does this mean for me."

---

### 13. SudarshanaTab.tsx

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **PARTIAL** | Visual chakra with age slider. Ring interpretation available but tab leans heavily on visualization. |
| Data meaning | **YES** | Color-coded rings (Lagna/Moon/Sun), planet placement in rings. |
| Personalized interpretation | **YES** | `DetailedRingAnalysis` type imported, age-specific analysis. |
| Actionable guidance | **PARTIAL** | Shows which houses are active at a given age but doesn't always explain implications. |

---

### 14. VargaAnalysisTab.tsx

| Dimension | Status | Notes |
|-----------|--------|-------|
| What is X? | **YES** | Varga synthesis title with overall description from `generateVargaTippanni()`. |
| Data meaning | **YES** | Strength badges (Strong/Moderate/Weak) per varga. Strong/weak areas identified. |
| Personalized interpretation | **YES** | Overall synthesis paragraph. Per-varga insights with planet placements. |
| Actionable guidance | **PARTIAL** | Lists strong/weak areas but doesn't give specific remedial advice. |

---

## Summary Matrix

| Tab | What is X? | Data Meaning | Personalized | Actionable | Overall |
|-----|:----------:|:------------:|:------------:|:----------:|:-------:|
| BhavaChalit (FIXED) | Strong | Strong | Strong | Strong | A |
| Shadbala | Yes | Yes | Partial | No | B- |
| Vargas | Yes | Yes | Yes | Partial | A- |
| Sphutas | Yes | Yes | Yes | Yes | A+ |
| Bhavabala | Minimal | Yes | No | No | C |
| NadiAmsha | Yes | Yes | Yes | Partial | A- |
| Yogas | Yes | Yes | Yes | Partial | B+ |
| Graha | Minimal | Partial | Yes | Partial | B |
| Ashtakavarga | Partial | Yes | Yes | Yes | B+ |
| SadeSati | Yes | Yes | Yes | Yes | A+ |
| Blueprint | Yes | Yes | Yes | Yes | A+ |
| Jaimini | Yes | Yes | Yes | Partial | A- |
| Sudarshana | Partial | Yes | Yes | Partial | B+ |
| VargaAnalysis | Yes | Yes | Yes | Partial | A- |

## Priority Fixes (ordered by impact)

1. **BhavabalaTab** (Grade C) -- Needs intro explanation + strongest/weakest house summary with life implications
2. **ShadbalaTab** (Grade B-) -- Needs per-planet "so what?" summary: strongest = advantage, weakest = needs effort
3. **GrahaTab** (Grade B) -- Needs brief explanation of R/C badges and what raw astronomical data means
4. **YogasTab** (Grade B+) -- Add dasha activation period note per present yoga
5. **AshtakavargaTab** (Grade B+) -- Ensure InfoBlock intro text is present and not relying on missing translation key

## Pattern Recommendation

The **SphutasTab** and **SadeSatiTab** should be the template for all future tabs:
1. "What is X?" educational intro with sub-topic cards
2. Personalized synthesis paragraph using chart data
3. Color-coded actionable timeline or guidance
4. Collapsible raw data for advanced users
