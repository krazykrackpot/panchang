# UX Comprehensibility Audit — Panchang App

**Date:** 2026-04-09
**Overall Score:** 7.5/10 for novices
**Scope:** All pages, kundali tabs, tool pages, learn modules

---

## Executive Summary

The app has excellent educational scaffolding on learn pages and core kundali tabs, but tool pages and advanced kundali tabs lack context for beginners. Most users are total novices to Vedic astrology — they need "What is this?" intros and "What does this mean for ME?" implications on every page.

---

## 1. Kundali Tabs — 18 Tabs Audit

### Excellent for Novices (have explanations + implications)

| Tab | What Works |
|-----|-----------|
| **Chart** | "What is a Birth Chart?" InfoBlock opens by default. Sky-map analogy, planet abbreviation key, house-click panels with "What this means for you" boxes |
| **Planets** | Defines each planet's themes in dual narrative (strong vs weak). Avastha moods explained with life-impact translations |
| **Dasha** | "Chapters in a book" analogy. 4-tier forecasts (strong/adequate/weak/node) with best actions. "You can't change timing but CAN change response" |
| **Yogas** | "Bonus features installed at birth" analogy. 5 yoga categories in plain language with life effects |
| **Avasthas** | "Mood and energy level" analogy. All 5 systems explained with "Impact on you" for each |
| **Sphutas** | Vitality/longevity degrees explained. "Does NOT predict death" caveat. Transit activation windows |
| **Shadbala** | "Chart Captain" identifies strongest planet. Life dasha timeline color-coded by strength |
| **Sade Sati** | Saturn's 7.5-year cycle well explained with phase-by-phase implications |

### Missing Explanations (no/minimal intro for novices)

| Tab | Problem | Fix Applied |
|-----|---------|------------|
| **Argala** | No beginner explanation of what Argala means or how planetary "intervention/blocking" affects life areas | Added InfoBlock with analogy and implications |
| **Jaimini** | No intro distinguishing Jaimini from Parashari system. Chara Karakas shown without "why this matters" | Added InfoBlock explaining the system and its unique value |
| **Bhavabala** | Minimal explanation of house strength. Shows numbers without life-theme translation | Added InfoBlock + plain-language strongest/weakest house implications |
| **Ashtakavarga** | Limited layperson translation. Shows bindus without explaining scoring | Added InfoBlock with scoring interpretation guide |
| **Varga Analysis** | Lists divisional charts but doesn't explain practical implications | Added per-varga implication text |

### Missing "So What?" Implications

| Tab | Issue | Fix Applied |
|-----|-------|------------|
| **Planets** | R (Retrograde) badge shown but never explained | Added badge legend with inline definitions |
| **Planets** | C (Combustion) badge shown but no explanation | Added to badge legend |
| **Planets** | Vgm (Vargottama) badge — exists but doesn't say "exceptionally strong" | Added to badge legend |
| **Planets** | MB (Mrityu Bhaga) — tooltip only | Added to badge legend with health context |
| **Shadbala** | Remedies listed but not explained (WHY Ruby for Sun?) | Added gem-planet resonance explanations |

---

## 2. Tool Pages — Comprehensibility Gaps

### Critical — Raw Data, No Context

| Page | Problem | Fix Applied |
|------|---------|------------|
| **Transits** | Zero explanatory intro. Planet sign-changes shown without explaining what a transit IS | Added "What Are Transits?" InfoBlock + per-planet transit implications |
| **Eclipses** | Grahan Kaal significance mentioned but never explained. No Sutak rules | Added Grahan Kaal timing, Sutak rules, do's/don'ts |
| **Vedic Time** | 30 Muhurta names shown as pure data without purpose | Added "Why Vedic Time Divisions?" section with practical use cases |

### Moderate — Functional But Missing "Why"

| Page | Problem | Fix Applied |
|------|---------|------------|
| **Sign Calculator** | Shows Sun/Moon sign but no "what this means" | Added personality snapshot per sign |
| **Baby Names** | Shows syllables but no cultural context | Added Namakarana Samskara tradition paragraph |
| **Prashna** | Verdict given but reasoning sparse | Added key indicator explanations |
| **Retrograde Calendar** | Lists periods but no explanation of retrograde | Added "What is Retrograde?" intro + effects |

---

## 3. Learn Pages — Generally Excellent

| Page | Rating | Notes |
|------|--------|-------|
| Tithis | Excellent | Clear formula, worked examples, festival connections |
| Nakshatras | Excellent | Geometry explanation, baby naming connection |
| Muhurtas | Excellent | Layered approach, "when should I do X?" |
| Masa | Excellent | Festival ties, seasonal rhythm |
| Vara | Excellent | Practical daily planning |
| Rashis | Excellent | Multiple classification angles |
| Yogas | Good → Fixed | Added inline kendra/trikona/dusthana definitions |
| Karanas | Good | Less visual but definition strong |
| Ayanamsha | Good | Spinning top analogy works |

---

## 4. Undefined Terms — Glossary Gaps

| Term | Where Used | Definition Added |
|------|-----------|-----------------|
| **Kendra** (1,4,7,10) | Yogas tab, learn/yogas | "The 4 pillar houses — self, home, partner, career" |
| **Trikona** (1,5,9) | Yogas tab, learn/yogas | "The 3 luck houses — self, creativity, fortune" |
| **Dusthana** (6,8,12) | Multiple tabs | "The 3 challenge houses — enemies, crisis, loss" |
| **Retrograde** | Planet badges | "Planet appears to move backward — intensifies its energy" |
| **Combustion** | Planet badges | "Planet too close to Sun — significations overshadowed" |
| **Exaltation/Debilitation** | Planet table | "Peak strength" / "Weakest expression" |
| **Vargottama** | Planet badges | "Same sign in D1 and D9 = exceptionally reliable planet" |
| **Rupa** | Shadbala | "Unit of planetary strength measurement" |

---

## 5. Pattern Summary

| Category | Explanation Quality | Implications Quality |
|----------|-------------------|---------------------|
| Kundali core tabs | Excellent | Excellent |
| Kundali advanced tabs | Weak → Fixed | Weak → Fixed |
| Learn pages | Excellent | Excellent |
| Calendar/Festivals | Excellent | Excellent |
| Tool pages (Transits, Eclipses, Vedic Time) | None → Fixed | None → Fixed |
| Tool pages (Sign Calc, Baby Names, Prashna) | Good → Fixed | Weak → Fixed |

---

## 6. Design Principles for Future Pages

1. **Every page/tab needs a "What is X?" intro** — use InfoBlock component, open by default
2. **Every data display needs "What this means for you"** — translate numbers to life themes
3. **Define jyotish terms on first occurrence** — don't assume ANY prior knowledge
4. **Use analogies** — "chapters in a book", "bonus features", "mood of a planet"
5. **Show implications before data** — lead with "why this matters" then show details
6. **Badge/icon legend** — any abbreviation or symbol needs an inline explanation
7. **Link to Learn modules** — tool pages should cross-reference educational content
