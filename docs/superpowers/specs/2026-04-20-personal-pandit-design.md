# Personal Pandit — Life Reading Dashboard

**Date:** 2026-04-20
**Status:** Reviewed — 14 addenda incorporated
**Scope:** Complete overhaul of the kundali results experience — from 21-tab data explorer to a 9-card Life Reading dashboard with domain deep dives. Subsumes and harmonizes with `docs/specs/varga-tippanni-deep-interpretation.md`.

---

## Problem Statement

The current kundali page shows 21 tabs of raw astrological data. The interpretation (tippanni) is one tab among many — fragmented, not synthesized across chart elements, and not organized around what users actually care about: health, money, career, marriage, children, family, spirituality, education. Users get data; they want guidance. The experience should feel like sitting with a personal pandit, not browsing a database.

---

## Design: 3-Layer Architecture

### Layer 1 — Life Reading Dashboard (default landing)

When a user generates their kundali, they land here. Nine cards. No tabs.

```
┌─────────────────────────────────────────────────────────────┐
│  CURRENT PERIOD (full-width hero)                           │
│  What's happening NOW in your life + what's coming next     │
├────────────────┬────────────────┬────────────────┬──────────┤
│ Health         │ Wealth         │ Career         │ Marriage │
│ ▌ Madhyama    │ ▌ Uttama       │ ▌ Adhama       │ ▌ Uttama│
│ headline...   │ headline...    │ headline...    │ head... │
├────────────────┼────────────────┼────────────────┼──────────┤
│ Children      │ Family         │ Spiritual      │ Education│
│ ▌ Madhyama    │ ▌ Uttama       │ ▌ Uttama       │ ▌ Madhy.│
│ headline...   │ headline...    │ headline...    │ head... │
└────────────────┴────────────────┴────────────────┴──────────┘
        [ ▾ Advanced: Technical Chart Data ]
```

### Layer 2 — Domain Deep Dive (click any card)

Full-page synthesis for a single life domain: natal promise → current activation → forward timeline → remedies. Algorithmic narrative for all users; LLM prose upgrade for premium.

### Layer 3 — Technical Details (toggle at bottom)

The existing 20 tabs (chart, planets, dasha, yogas, avasthas, argala, shadbala, bhavabala, sade sati, jaimini, sphutas, ashtakavarga, timeline, remedies, sudarshana, nadi, patrika, vargas, chat, graha). Collapsed by default. The VargasTab is enhanced per the varga-tippanni spec with pill selectors, D1↔Dxx comparison, promise/delivery gauges, and 7-paragraph narratives.

---

## The 9 Domain Cards

### Current Period (pinned, full-width)

Not a life domain — a time snapshot. Answers: "What is happening in my life RIGHT NOW?"

**Content:**
- Mahadasha lord + Antardasha lord with interaction theme
- Active transits (Saturn, Jupiter, Rahu/Ketu from Moon)
- Sade Sati status if active (rising/peak/setting phase)
- Overall period assessment: traffic-light rating
- Key dates ahead: next antardasha change, next major transit ingress
- One-line guidance: "Focus on consolidation, not new ventures"

**Visual:**
- Dark gradient background with subtle animated orbital ring (CSS) showing dasha lord symbol
- Left: large pulsing traffic-light dot + period name
- Right: mini timeline bar showing progress through current antardasha
- Bottom strip: upcoming key dates as small pills

### 8 Life Domain Cards

| # | Domain | Vedic Name | Primary Houses | Key Grahas | Divisional Charts |
|---|--------|-----------|----------------|------------|-------------------|
| 1 | Health & Longevity | Arogya (आरोग्य) | 1, 6, 8 | Sun, Mars, Saturn | D1, D30 (Trimsamsha) |
| 2 | Wealth & Finance | Dhana (धन) | 2, 11, 9, 5 | Jupiter, Venus, Mercury | D1, D2 (Hora), D4 (Chaturthamsha) |
| 3 | Career & Status | Karma (कर्म) | 10, 6, 2, 7 | Sun, Saturn, Mercury | D1, D10 (Dashamsha) |
| 4 | Marriage & Partnership | Kalatra (कलत्र) | 7, 2, 4, 8 | Venus, Jupiter, Moon | D1, D9 (Navamsha) |
| 5 | Children & Progeny | Santana (सन्तान) | 5, 9, 7 | Jupiter, Venus | D1, D7 (Saptamsha) |
| 6 | Parents & Family | Kutumba (कुटुम्ब) | 4, 9, 2, 3 | Moon, Sun, Mars | D1, D12 (Dwadashamsha) |
| 7 | Spiritual Growth | Moksha (मोक्ष) | 9, 12, 5, 8 | Ketu, Jupiter, Moon | D1, D20 (Vimshamsha), D60 (Shashtiamsha) |
| 8 | Education & Wisdom | Vidya (विद्या) | 4, 5, 9, 2 | Mercury, Jupiter | D1, D24 (Chaturvimshamsha) |

**Each card on dashboard shows:**
- Custom SVG illustration (gold gradient on navy, not icon — a scene)
- Domain name (heading font) + Vedic name (devanagari, smaller)
- Traffic-light rating bar along left edge (full card height): green=Uttama / gold=Madhyama / amber=Adhama / red=Atyadhama
- Personalized headline (1-2 sentences)
- Current activation badge: "Active: Jupiter transit ↑" or "Stress: Sade Sati peak"
- Hover: card lifts, SVG gains glow matching rating color

**SVG illustrations per domain:**
1. Health: stylized figure with chakra points
2. Wealth: scales with coins and lotus
3. Career: ascending mountain path with flag
4. Marriage: two interlinked rings with flame
5. Children: tree with blossoming branches
6. Family: house/temple silhouette with figures
7. Spiritual: meditating figure with third eye
8. Education: open book with radiating light

All use the gold gradient system (f0d48a → d4a853 → 8a6d2b).

---

## Rating System

### Rating Labels
- **Uttama** (उत्तम) — Strong — Green (#34d399)
- **Madhyama** (मध्यम) — Moderate — Gold (#d4a853)
- **Adhama** (अधम) — Challenging — Amber (#f59e0b)
- **Atyadhama** (अत्यधम) — Critical — Red (#ef4444)

### Rating Algorithm (per domain)

Weighted composite of:

| Signal | Weight | Source |
|--------|--------|--------|
| House strength (bhavabala of primary houses) | 20% | Existing bhavabala engine |
| House lord dignity + placement | 20% | Calculator + dignity module |
| Benefic/malefic occupants + aspects | 15% | Aspect engine |
| Relevant yogas (filtered by domain) | 15% | yogas-complete.ts |
| Relevant doshas (filtered, with cancellation) | 10% | doshas-extended.ts |
| Dasha activation (current lords' relationship to domain houses) | 10% | Dasha synthesis |
| Divisional chart confirmation (promise/delivery from varga spec) | 10% | varga-deep-analysis.ts |

**Thresholds:** ≥7.5 = Uttama, 5.0–7.4 = Madhyama, 3.0–4.9 = Adhama, <3.0 = Atyadhama

---

## Domain Deep Dive Structure

When a user clicks any domain card, they enter a full-page deep dive. Same structure for all 9 domains.

### A. Natal Promise (the permanent blueprint)

**House Analysis (prose, not table):**
Primary house lord — placement, dignity, retrograde status. Occupants. Aspects received. Bhavabala score. Written as flowing sentences: "Your 7th lord Mars is debilitated in the 12th in Pisces, receiving Jupiter's full aspect from the 6th. This creates a complex marriage pattern — the spouse may come from a different cultural background, but Jupiter's aspect indicates eventual stability through patience."

**Relevant Yogas:**
Filtered from 148+ to only those affecting THIS domain. E.g., Marriage card shows only Kalatra-related yogas. Each with domain-specific impact (not generic description).

**Relevant Doshas:**
Filtered. Each with: severity (full/partial/cancelled), cancellation conditions, practical impact on this domain.

**Divisional Chart Confirmation (ALL relevant vargas):**
For each relevant divisional chart:
- D1↔Dxx sign comparison with dignity shift for key planets
- Vargottama detection (same sign D1 and Dxx)
- Pushkara Navamsha/Bhaga check (hidden blessings)
- Gandanta detection (karmic knots — within 3°20' of water↔fire junctions)
- Key house lord tracing in the Dxx
- Jaimini karaka placement (AK/DK/AmK/PK/MK/GK as relevant)
- Argala on key houses in the Dxx
- Parivartana (sign exchange) detection in the Dxx
- Dispositor chain in the Dxx
- Yogas formed in the Dxx (domain-filtered)
- SAV bindu overlay on signs occupied in Dxx
- Promise/Delivery scores with 4×4 verdict matrix
- Combustion/retrogression effects in Dxx context

Each of these 15 cross-correlation factors is from the varga-tippanni spec, applied per domain's relevant charts. For Marriage: D9 gets all 15 factors. For Career: D10 gets all 15. Domains with multiple vargas (e.g., Wealth: D2 + D4) get analysis for each.

**Strength Summary (visual):**
Mini bar chart of key planets for this domain with shadbala/vimshopaka scores. Not explained in detail — just a confidence indicator. Click through to Layer 3 for full shadbala.

**Visual — Focused mini chart:**
North-Indian diamond with only the domain's relevant houses highlighted (e.g., Marriage: 7, 2, 4, 8 lit). Planets shown with dignity colors (exalted=emerald, own=gold, friend=blue, enemy=amber, debilitated=red). Faded houses for non-relevant.

### B. Current Activation (what's happening now)

**Dasha context:**
Current Maha + Antar lords — do they activate this domain's houses? Friends or enemies of the domain's significators? Prose: "You're in Saturn MD / Mercury AD. Saturn is your 7th lord — marriage themes are directly activated. Mercury rules your 12th — expect communication challenges with spouse."

**Transit overlay:**
Saturn, Jupiter, Rahu/Ketu positions relative to this domain's houses. Ashtakavarga bindus in those transit houses. "Jupiter transiting your 5th with 5 bindus — excellent for children."

**Dasha lord in divisional charts:**
Where are the current Maha/Antar lords placed in the domain's relevant Dxx? This is the varga spec's "Dasha Lord in Dxx" factor, surfaced per domain.

**Transit-triggered yogas:**
Any Gajakesari, transit Raja Yogas, etc. active now.

**Current period rating:**
Separate from natal rating. Natal might be Madhyama but current period Uttama due to favorable dasha/transit.

**Visual — Transit overlay chart:**
Natal chart with transit planets as outlined dots (existing `transitData` prop pattern), filtered to domain-relevant planets only. Ashtakavarga heatmap strip (12 cells, green=high bindus, red=low).

### C. Forward Timeline (next 3-5 years)

**Horizontal scrollable timeline:**
Nodes at each trigger (dasha change, major transit ingress). Each node color-coded (green/gold/amber/red). Date above, one-line domain-specific interpretation below. Connected by a line that shifts color as outlook changes.

"You are here" pulsing dot at current date. Scroll left = past (what just happened). Scroll right = future (what's coming).

Each trigger is personalized: "Saturn enters YOUR 7th where YOUR debilitated Mars sits — expect increased friction but karmic maturation of the partnership."

**Favorable windows:**
Highlighted green zones on the timeline — best periods for domain-specific actions. "Best window for property purchase: Jupiter in 4th from Moon, Mar–Sep 2027."

### D. Remedies (domain-filtered)

- **Gemstone**: which, why, when to wear, which finger, weight
- **Mantra**: specific to the weakest planet for this domain, Devanagari at large size, transliteration below, count and timing
- **Practical actions**: "Donate black sesame on Saturdays" / "Fast on Thursdays during Jupiter transit"
- **Favorable periods**: repeated from timeline, actionable format
- Favorable periods highlighted on the same timeline from section C as green zones

### E. "Consult Your Personal Pandit" (premium LLM)

Fixed at bottom of deep dive. Full-width button with distinct styling: gold gradient border, dhyana-mudra icon.

**What it does:**
Takes the complete `DomainReading` structured payload — natal analysis, all varga cross-correlations, current activation, forward triggers, remedies — and sends to LLM with system prompt:

> "You are a senior Jyotish consultant with 30 years of experience. Synthesize this chart data into a warm, authoritative, deeply personalized consultation. Address the native directly as 'you.' Be specific about dates, degrees, and remedies. Reference classical texts (BPHS, Phaladeepika, Saravali) where applicable. Connect findings across divisional charts to paint a coherent picture. Your tone is that of a trusted family pandit — reassuring but honest about challenges, always ending with actionable guidance."

Response replaces sections A–D with flowing narrative prose. Cached per kundali + domain for 24 hours. Costs 1 AI call from user's budget (2/day free, unlimited for paid).

---

## Synthesis Engine Architecture

### New Module: Domain Synthesis Engine

```
src/lib/kundali/domain-synthesis/
├── types.ts                  # DomainConfig, DomainReading, PersonalReading, etc.
├── config.ts                 # 9 domain configurations (declarative)
├── scorer.ts                 # Weighted composite scoring per domain
├── narrator.ts               # Composable narrative blocks (9 narrators)
├── timeline.ts               # Forward trigger computation per domain
├── remedies.ts               # Domain-filtered remedy selection
├── current-period.ts         # Cross-domain current period synthesis
├── synthesizer.ts            # Orchestrator: synthesizeDomain() + synthesizeReading()
└── llm-prompt.ts             # System prompt + payload serialization for premium tier
```

### Data Flow

```
KundaliData
  ├── planets, houses, dashas, yogas, doshas
  ├── shadbala, avasthas, ashtakavarga
  ├── functional nature, vimshopaka
  └── divisional chart positions
        │
        ▼
┌─── Existing Engines (unchanged) ──────────┐
│ tippanni-engine.ts → TippanniContent      │
│ varga-deep-analysis.ts → DeepVargaResult  │  ← from varga-tippanni spec
│ varga-promise-delivery.ts → PromiseScore  │  ← from varga-tippanni spec
│ convergence/engine.ts → ConvergenceResult │
│ dasha-synthesis.ts → DashaSynthesis       │
│ year-predictions.ts → YearPredictions     │
└───────────────────────────────────────────┘
        │
        ▼
┌─── Domain Synthesis Engine (NEW) ─────────┐
│ For each of 9 domains:                     │
│  1. Filter: houses, planets, yogas, doshas │
│     vargas relevant to this domain         │
│  2. Score: weighted composite → rating     │
│  3. Narrate: composable prose blocks       │
│  4. Timeline: forward triggers 3-5 years   │
│  5. Remedies: domain-filtered              │
│  6. Varga: all relevant Dxx analyses       │
│     (15 cross-correlation factors each)    │
└───────────────────────────────────────────┘
        │
        ▼
PersonalReading {
  currentPeriod: CurrentPeriodReading
  domains: DomainReading[8]
  generatedAt: Date
  kundaliId: string
}
```

### Domain Configuration (declarative)

```typescript
interface DomainConfig {
  id: DomainType;
  name: LocaleText;
  vedicName: LocaleText;
  icon: string;                        // SVG component name
  primaryHouses: number[];
  secondaryHouses: number[];
  primaryPlanets: number[];            // planet IDs (0=Sun..8=Ketu)
  relevantYogaCategories: string[];
  relevantDoshas: string[];
  divisionalCharts: string[];          // ['D9', 'D7'] — ALL relevant, not just primary
  jaiminiKarakas: string[];            // ['DK', 'PK'] — which karakas matter
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
```

Adding a 10th domain in the future = adding a config object, not writing engine code.

### Narrative Generation (algorithmic tier)

Composable narrative blocks — each is a pure function producing 1-3 sentences:

```
narrateHouseLord()        → "Your 7th lord Mars is debilitated in the 12th..."
narrateOccupants()        → "Benefic Jupiter occupies the 7th, softening..."
narrateAspects()          → "Saturn's full aspect from the 1st adds karmic weight..."
narrateYogas()            → "Gajakesari Yoga formed in the 7th gives..."
narrateDoshas()           → "Mangal Dosha is present but partially cancelled by..."
narrateVargaConfirmation() → "In your Navamsha, Venus is exalted — confirming..."
narrateDashaActivation()   → "Current Saturn MD directly activates marriage..."
narrateTransitOverlay()    → "Jupiter transiting your 7th until Sep 2027..."
narrateForwardTriggers()   → "Watch for: Ketu AD starts Mar 2028, detachment phase..."
```

Composed by the synthesizer with contextual connectors ("However," "This is compounded by," "On a positive note,"). Result reads as coherent paragraphs, not bullet lists.

### Relationship to Existing Code

| Existing Module | Role in New System |
|---|---|
| `tippanni-engine.ts` | Still generates raw sections; Domain Synthesis Engine CONSUMES its output |
| `convergence/` engine | Its pattern matching becomes one scoring signal per domain |
| `life-areas-enhanced.ts` | Replaced by domain-specific scoring with richer signals |
| `dasha-synthesis.ts` | Consumed by `narrateDashaActivation()` and `narrateForwardTriggers()` |
| `year-predictions.ts` | Consumed by Current Period synthesizer and forward timeline |
| `yogas-complete.ts` | Filtered per domain by yoga category tags |
| `varga-deep-analysis.ts` | ← from varga spec. Consumed per domain for all relevant Dxx |
| `varga-promise-delivery.ts` | ← from varga spec. Promise/Delivery scores feed into domain rating |
| `varga-planet-interpretations.ts` | ← from varga spec. Domain-specific planet-in-house text |
| `varga-narrative.ts` | ← from varga spec. 7-paragraph chart narrative → subsection of domain deep dive |
| `InterpretationHelpers.tsx` | Gradually superseded — content moves into domain narrative blocks |

No existing engine code is deleted. New system is an orchestration layer.

### Harmonization with Varga-Tippanni Spec

The varga-tippanni spec (`docs/specs/varga-tippanni-deep-interpretation.md`) defines:
- 5-layer varga enhancement (planet-in-house, cross-correlation, promise/delivery, classical checks, narrative)
- 15 cross-correlation factors
- VargasTab UI rework

**How they combine:**
- The varga spec's engine outputs (`DeepVargaResult`, `PromiseDeliveryScore`, domain-specific planet-in-house text) are consumed as DATA INPUTS by the Domain Synthesis Engine
- The varga spec's VargasTab UI rework becomes part of Layer 3 (Technical Details) — the advanced chart-centric view
- The domain deep dive (Layer 2) is the DOMAIN-CENTRIC view of the same underlying data
- Two navigation paths to the same engine: domain-first (our design) and chart-first (varga spec)
- Implementation: build the varga engine first (it's pure computation), then the domain synthesis layer on top, then the UI

---

## Visual Language

### Dashboard (Layer 1)

**Current Period Card:**
- Full-width dark gradient with subtle CSS orbital animation
- Left: large pulsing traffic-light dot + period name in heading font
- Right: mini timeline bar showing antardasha progress (% through, end date)
- Bottom: upcoming dates as pill badges

**8 Domain Cards (2×4 grid desktop, single column mobile):**
- Custom SVG scene at top (gold gradient on navy)
- Domain name + Vedic name (devanagari)
- Traffic-light bar along left edge (full card height) — instant "life heatmap" scan
- Headline text (1-2 lines, personalized)
- Activation badge
- Hover: lift + glow matching rating color

**Life heatmap scan pattern:** User's eye goes top-left → bottom-right. The left-edge color bars give instant overview — mostly green = life is good. Red in Health and Marriage = those need attention. This is the pandit glancing at the chart.

### Deep Dive (Layer 2)

**A. Natal Promise:**
- Focused mini North-Indian chart with only domain houses highlighted, planets shown with dignity colors
- Yoga/Dosha pills (horizontal scroll, green=auspicious, red=inauspicious, bold=strong, dashed=weak)
- Varga confirmation: small chart per relevant Dxx with same highlighting, D1 ghost dots for comparison
- Promise/Delivery gauge per Dxx: horizontal bar with score + 4×4 verdict text

**B. Current Activation:**
- Transit overlay chart (natal + transit dots, filtered to domain planets)
- Ashtakavarga heatmap strip (12 cells, green=high, red=low bindus)

**C. Forward Timeline:**
- Horizontal scrollable track with colored nodes at trigger points
- "You are here" pulsing dot
- Line color shifts as outlook changes (river through seasons)
- Green zones = favorable windows for action
- Scroll left (past) and right (future 3-5 years)

**D. Remedies:**
- Gemstone as colored swatch (actual gem color) with name + properties
- Mantra in large Devanagari, transliteration below
- Favorable periods highlighted on the same timeline

**E. "Consult Your Personal Pandit":**
- Fixed bottom, full-width, gold gradient border, dhyana-mudra SVG icon
- Lock icon if AI budget exhausted
- "Consult Your Personal Pandit" (localized)

### Layer 3 Toggle
- Thin expandable bar: "Advanced: Technical Chart Data ▾"
- Reveals existing 20 tabs in compact interface
- VargasTab enhanced per varga-tippanni spec (pill selectors, D1↔Dxx comparison, promise/delivery gauges, badge system, 7-paragraph narratives)
- Collapsed by default

---

## Implementation Phases

### Phase 0 — Varga Engine (from varga-tippanni spec)
Build the 5-layer varga enhancement engine first. This is pure computation with no UI changes:
1. `varga-tippanni-types.ts` — extended types
2. `varga-classical-checks.ts` — Pushkara, Gandanta, Varga Visesha
3. `varga-promise-delivery.ts` — scoring + 4×4 matrix
4. `varga-deep-analysis.ts` — 15 cross-correlation factors
5. `varga-planet-interpretations.ts` — 405 domain-specific entries (D9+D10 first, then rest)
6. `varga-narrative.ts` — 7-paragraph builder
7. Wire into `varga-tippanni.ts`

Tests: golden charts verifying D9≠D10, Pushkara/Gandanta detection, promise/delivery scores.

### Phase 1 — Domain Synthesis Engine
Build the new orchestration layer:
1. `domain-synthesis/types.ts` — DomainConfig, DomainReading, PersonalReading
2. `domain-synthesis/config.ts` — 9 domain configs
3. `domain-synthesis/scorer.ts` — weighted scoring consuming existing + varga engines
4. `domain-synthesis/narrator.ts` — 9 composable narrative blocks
5. `domain-synthesis/timeline.ts` — forward trigger computation
6. `domain-synthesis/remedies.ts` — domain-filtered selection
7. `domain-synthesis/current-period.ts` — cross-domain period synthesis
8. `domain-synthesis/synthesizer.ts` — main `synthesizeReading(kundali): PersonalReading`
9. `domain-synthesis/llm-prompt.ts` — premium tier prompt + serialization

Tests: golden charts with verified domain ratings, narrative coherence checks, timeline trigger dates.

### Phase 2 — Dashboard UI (Layer 1)
1. 9 custom SVG illustrations
2. Current Period hero card component
3. 8 domain card components with rating bars
4. Dashboard layout (grid, responsive)
5. Navigation: card click → deep dive slide transition

### Phase 3 — Deep Dive UI (Layer 2)
1. Natal Promise section with focused chart, yoga/dosha pills, varga gauges
2. Current Activation with transit overlay and ashtakavarga heatmap
3. Forward Timeline (horizontal scrollable)
4. Remedies section
5. "Consult Your Personal Pandit" button + LLM integration

### Phase 4 — Layer 3 Integration
1. "Advanced: Technical Chart Data" toggle
2. Wire existing 20 tabs into collapsed section
3. Enhanced VargasTab per varga-tippanni spec (pill selectors, badges, D1 comparison)
4. Ensure all Layer 3 tabs still work identically

### Phase 5 — Polish & Verification
1. Browser testing: generate 5 known charts, review every domain card + deep dive
2. Compare domain ratings against manual Jyotish assessment
3. Timeline accuracy: verify dasha transition dates match dasha engine
4. Mobile responsiveness pass
5. Performance: ensure `synthesizeReading()` completes in <500ms
6. Multilingual: all narrative blocks produce en/hi output (other locales via tl() fallback)
7. Accessibility: keyboard navigation through cards, screen reader labels on rating bars

---

## Files Created / Modified

### New Files (~4,500 lines)

| File | Est. Lines | Purpose |
|------|-----------|---------|
| `src/lib/kundali/domain-synthesis/types.ts` | ~150 | DomainConfig, DomainReading, PersonalReading, rating types |
| `src/lib/kundali/domain-synthesis/config.ts` | ~200 | 9 domain configurations (declarative) |
| `src/lib/kundali/domain-synthesis/scorer.ts` | ~300 | Weighted composite scoring per domain |
| `src/lib/kundali/domain-synthesis/narrator.ts` | ~600 | 9 composable narrative block functions |
| `src/lib/kundali/domain-synthesis/timeline.ts` | ~250 | Forward trigger computation (3-5 years) |
| `src/lib/kundali/domain-synthesis/remedies.ts` | ~150 | Domain-filtered remedy selection |
| `src/lib/kundali/domain-synthesis/current-period.ts` | ~200 | Cross-domain current period synthesis |
| `src/lib/kundali/domain-synthesis/synthesizer.ts` | ~200 | Orchestrator entry point |
| `src/lib/kundali/domain-synthesis/llm-prompt.ts` | ~100 | Premium tier LLM prompt |
| `src/components/kundali/LifeReadingDashboard.tsx` | ~400 | Layer 1 dashboard component |
| `src/components/kundali/DomainCard.tsx` | ~150 | Individual domain card |
| `src/components/kundali/CurrentPeriodCard.tsx` | ~200 | Current period hero card |
| `src/components/kundali/DomainDeepDive.tsx` | ~500 | Layer 2 deep dive component |
| `src/components/kundali/ForwardTimeline.tsx` | ~250 | Horizontal scrollable timeline |
| `src/components/kundali/DomainChart.tsx` | ~150 | Focused mini chart for domain |
| `src/components/icons/DomainIcons.tsx` | ~400 | 8 custom SVG domain illustrations |
| **Subtotal (new)** | **~4,200** | |

### From Varga-Tippanni Spec (~2,450 lines)

| File | Est. Lines | Purpose |
|------|-----------|---------|
| `src/lib/tippanni/varga-tippanni-types.ts` | ~100 | Extended varga types |
| `src/lib/tippanni/varga-planet-interpretations.ts` | ~800 | 405 domain-specific entries |
| `src/lib/tippanni/varga-deep-analysis.ts` | ~600 | 15 cross-correlation factors |
| `src/lib/tippanni/varga-promise-delivery.ts` | ~250 | Promise/delivery scoring |
| `src/lib/tippanni/varga-classical-checks.ts` | ~200 | Pushkara, Gandanta, Varga Visesha |
| `src/lib/tippanni/varga-narrative.ts` | ~300 | 7-paragraph builder |
| `src/lib/tippanni/varga-tippanni.ts` | ~200 mod | Wire layers into analyzeChart |
| **Subtotal (varga)** | **~2,450** | |

### Modified Files

| File | Change |
|------|--------|
| `src/app/[locale]/kundali/page.tsx` | Restructure: Layer 1 as default, Layer 3 tabs behind toggle |
| `src/app/[locale]/kundali/[id]/page.tsx` | Same restructure for saved chart view |
| `src/components/kundali/PatrikaTab.tsx` | Wire domain data into printable format |
| `src/lib/kundali/tippanni-engine.ts` | No changes — consumed as-is by domain engine |

**Total: ~6,650 new lines + ~200 modified**

---

## Testing Strategy

### Engine Tests (Vitest)
1. **Golden chart verification**: 3 known kundali → verify domain ratings match manual Jyotish assessment
2. **Domain differentiation**: same chart, verify Health ≠ Career ≠ Marriage (different ratings, different yogas cited)
3. **Varga differentiation**: same chart, verify D9 output ≠ D10 output (from varga spec)
4. **Rating stability**: same chart → same rating on repeated runs (no randomness)
5. **Timeline accuracy**: verify forward trigger dates match dasha engine's period boundaries
6. **Edge cases**: chart with all planets debilitated, chart with 5 vargottama planets, chart with no yogas

### UI Tests (browser verification)
1. Generate 5 charts → verify all 9 cards render with non-empty content
2. Click each domain → verify deep dive loads with all 5 sections
3. Mobile: verify grid collapses, timeline scrolls horizontally
4. Layer 3 toggle: verify all 20 tabs still work
5. "Consult Your Personal Pandit": verify LLM call fires, response renders, caching works

### Regression
- All existing tippanni tests must pass unchanged
- All existing golden panchang fixtures must pass
- Layer 3 tabs must render identically to current behavior

---

## Critical Review Addenda (2026-04-20)

These findings from critical self-review EXPAND scope (not reduce it). All should be incorporated into implementation.

### A1. Life Overview Synthesis (add to Layer 1, above the 8 cards)

Before the domain grid, a 2-3 sentence "elevator pitch" of the native's chart:

> "You are fundamentally a builder (Saturn Atmakaraka) with deep creative gifts (5th house stellium in Leo). Your life theme is transforming challenges into wisdom — the Scorpio ascendant with Jupiter in the 9th is your compass. This decade is your harvest period (5th cycle, Jupiter Mahadasha)."

**Source data:** Atmakaraka nature + strongest house/stellium + ascendant+9th lord synthesis + life stage (Sudarshana cycle context) + current mahadasha character.

This is what a pandit says FIRST. The dashboard without it is a menu without a greeting.

### A2. Dual Rating on Dashboard Cards (natal + current)

Each domain card shows TWO indicators:
- **Natal bar** (left edge, permanent): the structural strength of this domain
- **Current activation dot** (top-right corner): how the domain is performing RIGHT NOW given dasha + transits

Visual: "Marriage: Uttama (natal) · Currently stressed (Sade Sati peak)" — the dot is amber even though the bar is green. User instantly sees: "my marriage foundation is strong but I'm in a rough patch."

This turns the dashboard from a static blueprint into a living status board.

### A3. Cross-Domain Connections (add section to Layer 1, below the 8 cards)

3-5 key inter-domain linkages unique to this chart:

> "Career ↔ Marriage: Your 10th lord also rules the 7th — career and partnership are inseparable. Professional decisions directly affect marital harmony."
> "Wealth ↔ Children: 5th lord in the 2nd house — children or creative output become a significant income source."
> "Health ↔ Spiritual: 6th lord in the 12th — health challenges are best addressed through spiritual practice, not just medicine."

**Engine:** For each pair of domains, check if any planet lords BOTH a primary house from domain A and domain B. Also check if primary planets of one domain occupy primary houses of another.

### A4. Age-Contextualized Narrative

The narrator module must accept `currentAge: number` and adjust:
- **Vocabulary:** "building" at 25, "consolidating" at 40, "harvesting" at 55, "legacy" at 65
- **Emphasis:** Children domain gets paragraphs at 25-35, a sentence at 65. Career domain shifts from "advancement" to "mentoring" after 55.
- **Life stage integration:** Sudarshana cycle context (already built) feeds into every narrative block

### A5. Current Period Card — Enhanced

Add to the existing Current Period spec:
- **Pratyantardasha** (finest active sub-period) with its theme
- **Retrograde planets** currently affecting the chart (any retrograde planet transiting a natal sensitive point)
- **Eclipse proximity** — if upcoming eclipse is within 5° of natal Rahu/Ketu or natal Sun/Moon, flag it
- **Today's panchang overlay** — current tithi/nakshatra interaction with birth tithi/nakshatra (tara bala, chandrabala)
- **Samvatsara character** — the current year's nature (from the 60-year cycle)

### A6. Remedy Strength Indicators

Each remedy gets a 1-5 strength rating based on HOW relevant it is to THIS chart:

| Strength | Meaning | When |
|----------|---------|------|
| ★★★★★ | Critical — planet is debilitated AND rules key domain house | Debilitated 7th lord for marriage |
| ★★★★ | High — planet is weak AND currently in unfavorable dasha | Weak Sun in Saturn dasha |
| ★★★ | Moderate — planet is neutral but domain needs support | Average Mars, career needs boost |
| ★★ | Mild — preventive, planet is OK but could be stronger | Good Jupiter, maintaining strength |
| ★ | Optional — planet is already strong, remedy is insurance | Exalted Venus, wearing diamond anyway |

### A7. Smart Layer 3 Links

Deep dive sections include "See technical details →" links that open Layer 3 pre-filtered:
- Marriage deep dive → opens VargasTab scrolled to D9
- Career deep dive → opens VargasTab scrolled to D10
- Yogas section → opens Yogas tab filtered to domain-relevant yogas
- Dasha section → opens Dasha tab with current period highlighted

Implementation: URL hash params or React state to pre-select tab + chart.

### A8. Performance: Lazy Computation

`synthesizeReading()` should NOT compute everything at once:

**Phase 1 (< 200ms, blocking):** Compute 9 card headlines + ratings only. Uses pre-computed data (shadbala, ashtakavarga, dasha dates — already on KundaliData).

**Phase 2 (on card click, progressive):** Compute the full deep dive for ONE domain. Varga analysis, narrative, timeline, remedies. Cached after first computation.

**Phase 3 (background, non-blocking):** Pre-compute remaining 7 domains in a web worker after dashboard renders. By the time user clicks the second card, it's ready.

This means dashboard appears in < 200ms. First deep dive may take 500-800ms (with loading state). Subsequent deep dives are instant.

### A9. LLM Prompt — Domain-Specific Tone

Add to `llm-prompt.ts`:

```typescript
const DOMAIN_TONE: Record<DomainType, string> = {
  health: 'Be measured and cautious. Never diagnose. Frame as tendencies. Emphasize prevention and lifestyle.',
  wealth: 'Be pragmatic and specific about timing. Mention concrete actions. Avoid guaranteed-wealth language.',
  career: 'Be direct and strategic. Frame in terms of leverage and timing. Career-specific vocabulary.',
  marriage: 'Be warm but honest. Acknowledge emotional weight. Frame challenges as growth opportunities.',
  children: 'Be gentle and hopeful. This is deeply personal. Frame difficulties as "requires patience" not "unlikely."',
  family: 'Be respectful of family dynamics. Acknowledge cultural weight of parental relationships.',
  spiritual: 'Be expansive and encouraging. Use poetic language. Reference classical texts more heavily.',
  education: 'Be analytical and encouraging. Frame in terms of intellectual gifts and optimal learning paths.',
};
```

Also add: "Identify THE single most important insight. Begin your response with: 'If you remember nothing else from this reading...'"

### A10. Persistence & Sharing

`PersonalReading` should be persistable:
- **Supabase table:** `personal_readings` with `kundali_id` FK, `generated_at`, `reading_json` (JSONB), `llm_response` (TEXT, nullable)
- **Share:** Generate a shareable image of a single domain card (canvas-to-PNG or html-to-image)
- **Print:** Domain deep dive should have a print-optimized layout (extend existing PatrikaTab print infrastructure)
- **Re-generate:** Button to force fresh computation (in case user updated birth time)

### A11. Notification Hooks

`DomainReading` should expose `upcomingTriggers: DomainTrigger[]` that the notification system can consume:

```typescript
interface DomainTrigger {
  domain: DomainType;
  date: string;          // ISO date
  type: 'transit' | 'dasha_change' | 'eclipse';
  significance: 'high' | 'medium';
  headline: string;      // "Jupiter enters your 7th — marriage window opens"
}
```

The existing `/api/cron/transit-alerts` route can consume these to send domain-specific email/push alerts.

### A12. Accessibility Requirements

- ARIA `role="grid"` on dashboard with `role="gridcell"` per card
- Rating bars: `aria-label="Marriage: Uttama (strong)"` + `aria-valuenow` for screen readers
- Colorblind mode: rating bars get TEXT labels (U/M/A/X) alongside color, not just color
- Keyboard: Tab navigates cards, Enter opens deep dive, Escape returns to dashboard
- Focus management: opening deep dive traps focus, closing returns focus to originating card
- Timeline: aria-label on each node with date + description

### A13. SVG Illustration Design Direction

All 8 illustrations follow the existing icon system:
- **Style:** Abstract/geometric (like NakshatraIcons), not photorealistic
- **Palette:** Gold gradient system (f0d48a → d4a853 → 8a6d2b) with glow filters matching GrahaIcons
- **Size:** 120×80px viewBox, scalable
- **Animation:** Subtle CSS shimmer on hover (not JS animation — performance)
- **Consistency:** All use the same stroke width (1.5px), corner radius (2px), and gradient IDs

### A14. Partner Chart Hook (design now, build later)

Extend `DomainConfig` with optional partner data:

```typescript
interface DomainConfig {
  // ...existing fields...
  supportsPartnerOverlay?: boolean;  // true for 'marriage' domain
}
```

Marriage deep dive shows: "Add partner's birth details for compatibility analysis →" — links to matching page pre-filled with native's data. When matching data exists, the Marriage domain deep dive adds a "Compatibility" subsection consuming existing Ashta Kuta + the D9 cross-reference.

---

## Deferred (Future Phases)

| Feature | Why Deferred | Impact |
|---------|-------------|--------|
| Narayana Dasha per Dxx | Requires rethinking lord-in-sign lookups for divisional positions | VERY HIGH — best rashi-based timing |
| Arudha Padas in Dxx | Computation straightforward but interpretation data massive | HIGH — worldly perception vs reality |
| Audio mantra playback | Requires audio file creation/sourcing | MEDIUM — devotional engagement |
| PDF export of Life Reading | Needs layout engine for the dashboard format | MEDIUM — shareable output |
| Compare mode (two charts) | Synastry across domains | HIGH — relationship counseling |
| D1↔Dxx side-by-side UI | Visual chart comparison | HIGH — immediate understanding |
| Bhavat Bhavam (house-from-house) | Additional interpretation layer | MEDIUM |
| Divisional Shadbala | Computationally heavy | MEDIUM |
| Comparative benchmark | "Your career rating is top 15%" — requires aggregate statistics | MEDIUM — social proof |
