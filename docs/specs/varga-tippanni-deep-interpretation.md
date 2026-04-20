# Varga Tippanni Deep Interpretation — Design Spec

**Date:** 2026-04-20
**Status:** Approved
**Scope:** Complete overhaul of divisional chart (Dxx) interpretation + VargasTab UI rework

---

## Problem Statement

The current varga-tippanni engine applies identical structural analysis to every divisional chart. D9 and D10 read almost identically because:

1. Planet-in-house text is NOT differentiated by chart domain
2. No cross-referencing with D1 placement, dignity, lordships, aspects, dashas, or yogas
3. Multiple charts share the same domain category (D1 and D10 both map to "career")
4. Only D3 Drekkana has chart-specific content (36 face archetypes)
5. No classical techniques applied: no Pushkara, Gandanta, Vargottama analysis, no Promise/Delivery framework, no dispositor chains, no Parivartana detection

---

## Design: 5-Layer Enhancement Architecture

### Layer 1: Domain-Specific Planet-in-House Interpretations

New data file with planet-in-house text keyed by domain, covering what a placement MEANS for that specific life area — not what the planet generically does in a house.

**Coverage targets:**

| Domain | Charts | Houses Covered | Entries |
|--------|--------|----------------|---------|
| `marriage` | D9 | All 12 houses × 9 planets | 108 |
| `career` | D10 | All 12 houses × 9 planets | 108 |
| `children` | D7 | Houses 1,2,4,5,7,9,11 × 9 planets | 63 |
| `wealth` | D2, D4 | Houses 1,2,4,5,9,11 × 9 planets | 54 |
| `spiritual` | D20, D60 | Houses 1,5,9,12 × 9 planets | 36 |
| `health` | D30 | Houses 1,6,8,12 × 9 planets | 36 |
| **Total** | | | **~405** |

D9 and D10 get full 12-house coverage because they are the most queried. Each entry is 1-2 sentences, domain-contextualized.

**Examples:**

D9 Marriage domain:
- "Sun in D9 1st house: Strong ego in marriage. You need a partner who respects your independence. Marriage transforms your public identity."
- "Venus in D9 7th house: One of the strongest placements for marital harmony. The spouse is attractive, cultured, and the relationship is aesthetically rich."
- "Saturn in D9 8th house: Marriage involves deep karmic lessons. Delayed marriage often works better. The bond strengthens dramatically after early difficulties."
- "Rahu in D9 12th: Unconventional private life within the marriage. Foreign spouse or foreign residence after marriage is likely."

D10 Career domain:
- "Sun in D10 10th house: Born for public leadership. Government, politics, or executive roles. Career is your identity."
- "Mercury in D10 3rd house: Career built on communication — writing, media, sales, marketing. Multiple income streams from intellectual work."
- "Saturn in D10 1st house: Slow but unstoppable career rise. Early delays give way to authority. Career longevity exceeds peers."

**Structure:** Each entry is `{ en: string; hi: string }` — English authored first, Hindi follows via translate-locale.

### Layer 2: Cross-Correlation Engine (15 Factors)

Function `buildDeepVargaAnalysis()` that cross-references all available data:

#### 2a. D1↔Dxx Sign Comparison
For each of 9 planets, compare D1 sign vs Dxx sign with dignity shift analysis:
- Same sign (vargottama behavior) → "unified expression"
- Exalted → debilitated → "surface promise, domain-level struggle"
- Debilitated → exalted → "hidden strength emerging in this domain"
- Own → enemy → "natural ability meets resistance in this context"
- Full 4-level dignity comparison: exalted/own/friend/neutral/enemy/debilitated

#### 2b. Functional Nature per Dxx Lagna
Call existing `calculateFunctionalNature(dxxLagnaSign)`. Compare with D1 functional nature:
- YogaKaraka in both → "unconditional ally"
- YogaKaraka in D1 but Badhak in Dxx → "what empowers you generally obstructs you in this domain"
- Badhak in D1 but YogaKaraka in Dxx → "a challenge elsewhere becomes your greatest asset here"

#### 2c. Vargottama Detection
Flag planets in same sign in D1 and current Dxx. Also detect "multi-varga vargottama" — same sign across 3+ charts (extremely rare, extremely powerful).

#### 2d. Pushkara Navamsha/Bhaga Check
- **Pushkara Navamsha:** 24 specific navamsha padas in benefic-ruled signs (Cancer, Taurus, Pisces, Sagittarius).
- **Pushkara Bhaga:** Specific auspicious degrees within each sign (one per sign). A planet within 1° of its sign's Pushkara Bhaga degree has amplified beneficence.

Both are "hidden blessings" — a weak planet in Pushkara is rescued; a strong planet becomes exceptional.

#### 2e. Gandanta Detection
Planets within 3°20' of the three water↔fire sign junctions (Cancer↔Leo, Scorpio↔Sagittarius, Pisces↔Aries = 120°/240°/0° sidereal). Gandanta = "karmic knot" — deep entanglement in the domain of the divisional chart. Differentiate by proximity: within 1° = severe, 1-2° = moderate, 2-3°20' = mild.

#### 2f. Key House Lordship Tracing
For each Dxx, trace not just THE key house lord but also the secondary key house:

| Chart | Primary Key House | Secondary Key House |
|-------|------------------|-------------------|
| D9 | 7th (spouse) | 2nd (family from marriage) |
| D10 | 10th (career) | 7th (business partnerships) |
| D7 | 5th (children) | 9th (grandchildren/fortune through children) |
| D2 | 2nd (accumulated wealth) | 11th (income streams) |
| D4 | 4th (property) | 9th (fortune from property) |
| D30 | 6th (disease) | 8th (chronic conditions) |
| D60 | 1st (past-life self) | 12th (past-life karma resolution) |

For each lord: where placed, dignity, conjunctions, who aspects it, is it retrograde/combust.

#### 2g. AK/DK/AmK/PK Placement (Jaimini Karakas)
Beyond just AK (Atmakaraka) and DK (Darakaraka), also track:
- **AmK** (Amatyakaraka = minister) in D10 → career expression of soul's purpose
- **PK** (Putrakaraka = children) in D7 → children expression
- **MK** (Matrukaraka = mother) in D4 → property/happiness through mother
- **GK** (Gnatikaraka = enemy/disease) in D30 → health challenges

#### 2h. Argala on Key Houses
Call existing `calculateArgala(dxxPlanets, dxxLagna)` and interpret for primary + secondary key houses.

#### 2i. Vimshopaka Per-Varga Dignity
Surface existing per-varga dignity from Vimshopaka computation. Also compute Varga Visesha classification:
- **Parijatamsha**: Exalted/own in 2 vargas
- **Uttamamsha**: 3 vargas
- **Gopuramsha**: 4 vargas
- **Simhasanamsha**: 5 vargas
- **Paravatamsha**: 6 vargas
- **Devalokamsha**: 7 vargas

A planet at Simhasanamsha or above has its interpretation elevated substantially.

#### 2j. SAV Bindu Overlay
Cross-reference D1 Sarvashtakavarga scores for signs occupied in Dxx. SAV ≥ 28 = "well-supported sign"; SAV ≤ 22 = "challenging sign needing effort."

#### 2k. Dasha Lord in Dxx
Find current Mahadasha + Antardasha lord's placement in this specific chart. Also find WHEN the current dasha lord was/will be in the most favorable position for this chart (timing window analysis).

#### 2l. Yoga Detection in Dxx
Call existing `detectAllYogas(dxxPlanets, dxxLagna)` with domain relevance filter. But also detect chart-specific yogas not in the generic engine:
- D9: Spouse-quality yogas (Venus/Jupiter in kendras, 7th lord in trikona)
- D10: Career-rise yogas (10th lord in kendra, Sun exalted)
- D7: Fertility yogas (5th lord strong, Jupiter in kendra)

#### 2m. Aspect Analysis Within Dxx (NEW)
Compute planetary aspects within the divisional chart. Focus on:
- Aspects TO the key house (who aspects the 7th of D9?)
- Aspects FROM the key house lord (what does the 7th lord aspect?)
- Mutual aspects between planet pairs that matter for the domain (Venus-Mars in D9, Sun-Saturn in D10)

#### 2n. Parivartana (Sign Exchange) in Dxx (NEW)
Two planets exchanging signs in a divisional chart. High-impact combinations:
- D9: 1st and 7th lords exchanging = deep self-spouse merger
- D10: 10th and 1st lords exchanging = career IS the personality
- D7: 5th and 1st lords exchanging = parent identifies deeply with children

#### 2o. Dispositor Chain in Dxx (NEW)
Follow the chain of sign lords until reaching a planet in its own sign (the "final dispositor"). This planet ultimately controls outcomes in the divisional chart.
- "In your D9, the dispositor chain runs: Venus (in Sagittarius) → Jupiter (in Taurus) → Venus... circular dependency between Venus and Jupiter means marriage is a joint Venus-Jupiter theme — refinement + wisdom."
- A single final dispositor = one planet dominates the domain.
- Circular chain = shared governance, more nuanced outcome.

### Layer 3: Promise-Delivery Framework

#### Promise Assessment (D1)
For each Dxx's corresponding D1 houses, compute a 0-100 promise score based on:
- House occupants: benefics +15 each, malefics -10 each, neutral +5
- House lord placement: kendra +20, trikona +15, dusthana -15, 12th -10
- House lord dignity: exalted +20, own +15, friend +5, neutral 0, enemy -10, debilitated -15
- Aspects on house: benefic aspects +10, malefic aspects -10
- Relevant karaka strength: shadbala ≥ 1.0 rupa → +15
- SAV of house sign: ≥ 30 → +10, ≤ 22 → -10

#### Delivery Assessment (Dxx)
Same scoring applied to the Dxx chart:
- Key house occupants, lord placement, dignity, aspects
- Yogas formed: each relevant yoga +15
- Vargottama planets in key houses +10 each
- Pushkara placement +10
- Gandanta -15

#### Verdict Matrix (4×4 nuance, not 2×2)

| | Dxx Excellent (75-100) | Dxx Good (50-74) | Dxx Modest (25-49) | Dxx Weak (0-24) |
|---|---|---|---|---|
| **D1 Strong (75-100)** | Supreme manifestation | High quality, minor friction | Promise exceeds delivery — timing/effort gaps | External promise, internal disconnect — needs conscious work |
| **D1 Good (50-74)** | Delivery exceeds promise — pleasant surprises | Solid, reliable outcomes | Average experience | Struggles despite some potential |
| **D1 Modest (25-49)** | Hidden gem — compensatory strength | Modest but improving with effort | Underwhelming, redirect energy | Not a primary life theme |
| **D1 Weak (0-24)** | Unexpected gift — divisional chart overrides D1 weakness | Surprising positive despite weak promise | Limited in both dimensions | Clearly not a focus — accept and redirect |

Each cell gets a 2-sentence narrative explaining the combination.

### Layer 4: Combustion, Retrogression, and War Status in Dxx (NEW)

Planets carry D1 combustion and retrogression status into divisional charts:

- **Combust in Dxx context:** "Venus is combust (within 8° of Sun) — spouse-significations are overshadowed by ego. The partner may feel eclipsed by your personality or career. Awareness of this dynamic is itself the remedy."
- **Retrograde in Dxx context:** "Saturn retrograde in D10's 10th — career path is unconventional, non-linear. May revisit old roles or industries. Success comes through reviewing and refining rather than pushing forward."
- **Planetary war (graha yuddha):** Two planets within 1° — the loser's significations in this divisional domain are weakened.

### Layer 5: Synthesized Narrative

Multi-paragraph prognosis weaving all layers together. Structure per chart:

**Paragraph 1 — Chart Identity:**
Rising sign, lagna lord placement, functional nature of key planets for this lagna. Dispositor chain summary. Overall chart strength rating.

**Paragraph 2 — The D1↔Dxx Story:**
For the 3-4 most important planets for this domain, narrate the sign shift. Flag vargottama, Pushkara, Gandanta. Note combustion/retrogression where relevant.

**Paragraph 3 — Key Houses Deep Dive:**
Primary and secondary key house analysis. Lord tracing with dignity. Argala status. AK/DK/relevant karaka placement. Parivartana if present.

**Paragraph 4 — Yogas, Strengths, and Classical Markers:**
Divisional chart yogas. Vimshopaka with Varga Visesha classification. SAV overlay on key signs. Aspect analysis on key houses.

**Paragraph 5 — Promise vs Delivery:**
D1 promise score with breakdown → Dxx delivery score with breakdown → 4×4 matrix verdict → what this means practically.

**Paragraph 6 — Timing & Dasha Integration:**
Current dasha lord's placement in this chart. When the best/worst windows are. Specific Antardasha periods that activate this chart most strongly. If possible, Narayana Dasha period for this chart.

**Paragraph 7 — Practical Guidance:**
Based on all the above: 3-4 actionable insights. What to lean into, what to watch for, what remedies apply specifically to this divisional chart's findings.

---

## Priority Chart Coverage

| Tier | Charts | Coverage |
|------|--------|----------|
| **Tier 1** | D9 (Navamsha), D10 (Dashamsha) | All 5 layers. Full 108-entry planet-in-house. All 15 cross-correlation factors. 7-paragraph narrative. |
| **Tier 2** | D7 (Saptamsha), D2 (Hora), D4 (Chaturthamsha) | Layers 1-5. Selective planet-in-house (63/54 entries). All 15 factors. 5-paragraph narrative. |
| **Tier 3** | D3 (Drekkana), D12 (Dwadashamsha), D30 (Trimsamsha), D60 (Shashtiamsha) | Layers 2-5 (cross-correlation + narrative, no dedicated planet-in-house text — use compositional approach from D1 text + domain modifier). |
| **Tier 4** | D16, D20, D24, D27, D40, D45 | Layers 2+5 only (enhanced structural + 3-paragraph narrative). Vargottama, functional nature, dignity comparison, basic key-house analysis. |

---

## Differentiation Proof: D9 vs D10 Example

### D9 (Marriage) — Same person
> **Chart Identity:** Cancer rising in D9, with lagna lord Moon in the 11th house (Taurus, exalted). Jupiter is YogaKaraka for Cancer lagna (ruling 6th + 9th). The dispositor chain terminates at Venus (own sign Taurus in 11th) — Venus is the final dispositor, making refinement and comfort the ultimate marriage theme.
>
> **D1↔D9 Story:** Venus moves from Aquarius (D1) to Taurus (D9, own sign) — a dramatic improvement. Your innate detachment in relationships (Aquarius Venus) transforms into deep sensual connection and stability in marriage. Mars moves from Aries (own, D1) to Scorpio (own, D9) — vargottama behavior for Mars. Intensity, passion, and transformative energy are consistent from personality to marriage.
>
> **Timing:** Saturn Antardasha within Jupiter Mahadasha — Saturn sits in D9's 7th house in Capricorn (own sign). Despite Saturn's slow, testing nature, own-sign placement in THE marriage house means the partnership solidifies into a durable, mature bond during this period.

### D10 (Career) — Same person
> **Chart Identity:** Virgo rising in D10, with lagna lord Mercury in the 10th house (Gemini, own sign). Mercury as lagna lord in the 10th in own sign is one of the most powerful career placements — communication, analysis, and intellect define your professional identity. Saturn is YogaKaraka for Virgo lagna (ruling 5th + 6th), placed in the 5th — creative authority.
>
> **D1↔D10 Story:** Mercury moves from Capricorn (D1) to Gemini (D10, own sign) — business acumen in D1 becomes intellectual mastery in career. The shift suggests your career should be MORE cerebral than your general personality. Sun moves from Sagittarius (D1) to Cancer (D10, debilitated) — self-confidence and leadership (strong in D1) need conscious development in professional contexts. Don't assume authority will come naturally at work.
>
> **Timing:** Jupiter Mahadasha — Jupiter in D10's 4th house (Sagittarius, own sign) creates a Hamsa Mahapurusha Yoga. Career operates from a base of wisdom and ethical foundations. This is a period of building institutional credibility.

These are genuinely different readings from the same person's chart — driven by different divisional chart positions, different functional natures, different key houses, and different yogas.

---

## Files to Create / Modify

| File | Action | Est. Lines |
|------|--------|------------|
| `src/lib/tippanni/varga-planet-interpretations.ts` | **CREATE** — Domain-specific planet-in-house text (6 domains, ~405 entries) | ~800 |
| `src/lib/tippanni/varga-deep-analysis.ts` | **CREATE** — Cross-correlation engine (15 factors + dispositor + parivartana) | ~600 |
| `src/lib/tippanni/varga-promise-delivery.ts` | **CREATE** — Promise/delivery scoring + 4×4 verdict matrix | ~250 |
| `src/lib/tippanni/varga-classical-checks.ts` | **CREATE** — Pushkara, Gandanta, Varga Visesha, combustion/retro in Dxx | ~200 |
| `src/lib/tippanni/varga-narrative.ts` | **CREATE** — 7-paragraph synthesized narrative builder | ~300 |
| `src/lib/tippanni/varga-tippanni-types.ts` | **CREATE** — Extended types for all new data structures | ~100 |
| `src/lib/tippanni/varga-tippanni.ts` | **MODIFY** — Wire all layers into `analyzeChart` | ~200 changed |

**Total: ~2,450 new lines across 7 files**

---

## VargasTab UI Rework (Phase 2)

### Current Problems
1. Flat data grid with dignity badges — no interpretive text
2. Vimshopaka table disconnected from planet context
3. No D1↔Dxx comparison visible
4. Key house analysis is structural (kendra/dusthana counts) not meaningful
5. No yoga or argala display for divisional charts
6. Flat dropdown chart selector — no hierarchy or chart importance indication
7. No promise/delivery visualization
8. No interactive planet↔interpretation linking

### Proposed Layout

```
┌──────────────────────────────────────────────────────────┐
│ Chart Selector (pill tabs, not dropdown)                  │
│ [D9 ★★★] [D10 ★★★] [D7 ★★] [D2 ★★] [D4 ★★] [More ▾]  │
├──────────────────────────────────────────────────────────┤
│ ┌── Chart + Overview ──────────────────────────────────┐ │
│ │ ┌─ North/South ─┐  Domain: Marriage & Dharma          │ │
│ │ │ Diamond chart  │  Rising: Cancer ★ exalted Moon     │ │
│ │ │ with planet    │  Key house: 7th lord Venus (9H ☆)  │ │
│ │ │ glyphs + D1    │  Final dispositor: Venus            │ │
│ │ │ comparison dots│  Promise: 72/100 | Delivery: 81/100 │ │
│ │ └────────────────┘  [████████░░] Strong manifestation  │ │
│ └──────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│ Planet Placements (interactive — click for detail)        │
│ ┌──────┬────────┬─────────┬────────┬───────────────────┐ │
│ │Planet│ D1→Dxx │ Dignity │ Badges │ Brief             │ │
│ ├──────┼────────┼─────────┼────────┼───────────────────┤ │
│ │☉ Sun │ Sg→Ca  │ ↓ debi  │        │ Ego needs work in│ │
│ │☽ Moon│ Ca→Ca  │ ★ vargo │ P      │ Emotional center │ │
│ │♂ Mars│ Ar→Sc  │ ★ vargo │        │ Passion unified  │ │
│ │♃ Jup │ Ta→Sg  │ ↑ own   │ YK     │ Dharmic protect  │ │
│ │♀ Ven │ Aq→Ta  │ ↑ own   │ P FD   │ Marriage anchor   │ │
│ │♄ Sat │ Pi→Cp  │ ↑ own   │        │ Mature bond       │ │
│ └──────┴────────┴─────────┴────────┴───────────────────┘ │
│ Badges: ★=Vargottama P=Pushkara G=Gandanta               │
│         YK=YogaKaraka FD=FinalDispositor R=Retro C=Comb  │
├──────────────────────────────────────────────────────────┤
│ Yogas in This Chart (cards)                               │
│ ┌─ Hamsa Yoga ──────┐ ┌─ Gajakesari ────────┐           │
│ │ Jupiter in kendra  │ │ Jupiter angular from │           │
│ │ in own sign        │ │ Moon — wisdom in     │           │
│ │ ★ Career authority │ │ marriage             │           │
│ └────────────────────┘ └──────────────────────┘           │
├──────────────────────────────────────────────────────────┤
│ ▼ Deep Analysis (expandable sections)                     │
│   ├── Key House Lordship Trace                            │
│   ├── Argala on Key Houses                                │
│   ├── Jaimini Karakas (AK/DK/AmK/PK)                     │
│   ├── Parivartana (Sign Exchanges)                        │
│   ├── Dispositor Chain                                    │
│   └── Combustion / Retrogression Effects                  │
├──────────────────────────────────────────────────────────┤
│ Synthesized Prognosis                                     │
│ [7-paragraph narrative — always visible, not hidden]      │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ Chart Identity... D1↔Dxx Story... Key Houses...     │  │
│ │ Yogas & Strength... Promise/Delivery... Timing...   │  │
│ │ Practical Guidance...                                │  │
│ └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Key UI Features
1. **Pill-tab chart selector** with tier indicators (★★★/★★/★) — replaces flat dropdown
2. **D1→Dxx column** with directional dignity arrows (↑ better, ↓ worse, ★ vargottama)
3. **Badge system**: P=Pushkara, G=Gandanta, YK=YogaKaraka, FD=FinalDispositor, R=Retro, C=Combust
4. **Promise/Delivery gauge** — horizontal bar with score and verdict text
5. **Yoga cards** — divisional-chart-specific yogas with domain-relevant significance
6. **Expandable deep analysis** — lordship trace, argala, karakas, parivartana, dispositor chain
7. **Interactive planet rows** — click/tap to expand inline interpretation
8. **Always-visible prognosis** — the synthesized narrative is the star, not buried
9. **Chart visualization** with D1 comparison dots (small dots showing where planets are in D1 vs Dxx)
10. **Mobile:** Horizontal scroll on planet table, stacked cards for yogas, full-width prognosis

### Chart Visualization Enhancement
The existing North/South Indian chart should show:
- **Primary planets** (current Dxx) in standard position with full glyphs
- **Ghost dots** showing D1 positions for comparison (50% opacity, smaller)
- **Key house highlighted** with a subtle golden border (7th in D9, 10th in D10)
- **Argala lines** as faint arrows showing support/obstruction to key houses

---

## Implementation Sequence

### Phase 1 — Engine (Layers 1-5)
Create 6 new files + modify varga-tippanni.ts. Each layer is independently testable:
1. Types first (varga-tippanni-types.ts)
2. Classical checks (Pushkara, Gandanta, Varga Visesha, combustion)
3. Promise/Delivery scoring engine
4. Cross-correlation engine (15 factors)
5. Planet-in-house interpretations (D9 and D10 first, then D7/D2/D4, then D30/D60)
6. Narrative builder
7. Wire everything into varga-tippanni.ts

Unit tests for each layer. Golden test: generate interpretation for a known chart, verify differentiation between D9 and D10.

### Phase 2 — VargasTab UI Rework
1. Refactor from flat grid to multi-section card layout
2. Pill-tab chart selector with tier badges
3. Planet table with D1 comparison + badges
4. Yoga cards
5. Promise/Delivery gauge
6. Expandable deep analysis sections
7. Always-visible prognosis section
8. Chart visualization with comparison dots

### Phase 3 — Polish & Expand
1. Review all Tier 1+2 charts in browser with real kundali data
2. Tune interpretation text — read every generated paragraph for a test chart
3. Add Tier 3 chart content (D3, D12, D30, D60)
4. Hindi translation for all interpretation text via translate-locale
5. Mobile responsiveness pass

---

## Testing Strategy

1. **Golden test charts:** 3 known kundali with manually verified interpretations (from Prokerala/Shubh Panchang). Compare engine output with expected analysis.
2. **Differentiation test:** Same kundali, verify D9 and D10 outputs are substantively different in content (not just sign/house labels).
3. **Edge cases:** Charts where ALL planets are debilitated in Dxx (extreme weakness), charts with multiple vargottama planets, charts with Gandanta placements.
4. **Regression:** Existing tippanni tests must still pass — D1 tippanni engine is untouched.

---

## Deferred (Future Phases)

| Feature | Why Deferred | Impact When Added |
|---------|-------------|-------------------|
| **Narayana Dasha per Dxx** | Requires rethinking lord-in-sign lookups for divisional positions. Medium complexity. | VERY HIGH — the most authoritative rashi-based timing for divisional domains |
| **Arudha Padas in Dxx** | Computation is straightforward but interpretation data for 12 arudhas × 19 charts is massive | HIGH — shows worldly perception vs reality per domain |
| **Bhavat Bhavam (house-from-house)** | Adds a layer of derived house analysis. Interpretation content needed. | MEDIUM — "7th from 7th" insights |
| **Divisional Shadbala** | Full recomputation is heavy; selective components (Uccha + Dig only) possible | MEDIUM — quantitative strength overlay |
| **Compare mode (UI)** | Side-by-side D1 vs Dxx visual comparison | HIGH — immediate visual understanding |
