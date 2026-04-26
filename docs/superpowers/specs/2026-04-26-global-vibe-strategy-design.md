# Global-Vibe Transformation — Design Spec

**Date:** 2026-04-26
**Status:** Draft
**Goal:** Attract the global "Modern Mystic" audience by making Vedic astrology accessible without diluting its precision. Five features, shipped in cascade order with shared infrastructure first.

---

## Table of Contents

1. [Strategy Summary](#1-strategy-summary)
2. [Shared Infrastructure](#2-shared-infrastructure)
3. [Feature 1: Sidereal vs Tropical Comparison](#3-feature-1-sidereal-vs-tropical-comparison)
4. [Feature 2: Progressive Sanskrit Vocabulary](#4-feature-2-progressive-sanskrit-vocabulary)
5. [Feature 3: The Cosmic Blueprint](#5-feature-3-the-cosmic-blueprint)
6. [Feature 4: Shareable Compatibility Cards](#6-feature-4-shareable-compatibility-cards)
7. [Feature 5: Lunar Lifestyle Calendar](#7-feature-5-lunar-lifestyle-calendar)
8. [Implementation Order](#8-implementation-order)
9. [Testing Strategy](#9-testing-strategy)
10. [SEO Strategy](#10-seo-strategy)
11. [Navigation & Integration](#11-navigation--integration)

---

## 1. Strategy Summary

**Positioning:** "Precision Astronomical Tool for Human Potential" — not a wellness app, not a religious app. The moat is accuracy and depth. Make it accessible, but don't sand off the edges.

**Core principles:**
- Keep Sanskrit terms (they're the brand moat) but pair each with progressive disclosure
- Never rename concepts — teach the vocabulary through contextual tooltips
- Frame traditional practices through their observational/scientific basis, not religious prescription
- Show users what Western astrology misses (nakshatras, dashas, Shadbala) rather than translating Vedic into Western vocabulary
- Every new feature is a conversion funnel: viral hook → discovery → depth

**Five features in priority order:**

| # | Feature | Conversion Role | New Pages | New Engines |
|---|---------|----------------|-----------|-------------|
| 1 | Sidereal vs Tropical Comparison | Viral "aha" moment — converts Western users | `/tropical-compare` | `comparison-engine.ts` |
| 2 | Progressive Sanskrit Vocabulary | Accessibility — removes intimidation barrier | `/glossary` | `glossary.ts` data, `<JyotishTerm>` component |
| 3 | The Cosmic Blueprint | Differentiation — time-dependent personality unlike MBTI | `/cosmic-blueprint` + kundali tab | `archetype-engine.ts` |
| 4 | Shareable Compatibility Cards | Social growth — share-driven acquisition | None (enhances `/matching`) | Card data mapper |
| 5 | Lunar Lifestyle Calendar | Acquisition funnel — captures "moon phase" search traffic | `/lunar-calendar` | `energy-score.ts`, `panchang-insights.ts` |

---

## 2. Shared Infrastructure

### 2.1 Comparison Engine

**File:** `src/lib/ephem/comparison-engine.ts`

**Purpose:** Computes all planets twice — tropical (raw) and sidereal (minus ayanamsha) — and identifies which planets shift sign between the two systems.

**Types:**

```ts
export interface ComparisonResult {
  planetId: number;
  planetName: LocaleText;
  tropical: {
    longitude: number;
    sign: number;             // 1-12
    signName: string;         // Western name, always English
    degreeInSign: number;     // 0-30
  };
  sidereal: {
    longitude: number;
    sign: number;
    signName: LocaleText;     // Vedic name, trilingual
    degreeInSign: number;
    nakshatra?: {             // Moon and Ascendant only
      id: number;
      name: LocaleText;
      pada: number;
    };
  };
  isShifted: boolean;
  shiftDescription: string;   // "Moved back from Aries to Pisces"
}

export interface FullComparison {
  birthData: { name: string; date: string; time: string; location: string };
  ayanamsha: { value: number; type: string; formatted: string };
  planets: ComparisonResult[];
  ascendant: ComparisonResult;
  shiftedCount: number;
  hookLine: string;           // Viral "aha" sentence
  precessionData: {
    currentAyanamsha: number;
    yearlyRate: number;       // ~50.3" per year
    epochYear: number;        // When ayanamsha was 0 degrees
  };
}
```

**Function:** `compareTropicalVsSidereal(jd: number, ayanamshaType?: string): FullComparison`

**Implementation:** Calls `getPlanetaryPositions(jd)` once (returns tropical longitudes). Subtracts ayanamsha for sidereal. No double computation — tropical is the raw output.

**Hook line generation:** `generateIdentityHook(comparison: FullComparison): string` — produces the viral sentence. If Sun shifted: "You've been reading {tropical} horoscopes, but the Sun was actually in {sidereal} when you were born." If Sun didn't shift but Moon did: "Your Sun is {sign} in both systems, but your Moon shifted from {tropical} to {sidereal}, revealing a different emotional blueprint."

---

### 2.2 JyotishTerm Component

**File:** `src/components/ui/JyotishTerm.tsx`

**Props:**
```ts
interface JyotishTermProps {
  term: string;           // Glossary key: "nakshatra", "tithi", "dasha"
  children?: ReactNode;   // Override display text (default: term's display name)
  showOnce?: boolean;     // Only show tooltip on first encounter (default: false)
}
```

**Behavior:**
- Renders inline with gold dotted underline (`border-b border-dotted border-gold-primary/40`)
- Hover (desktop) / tap (mobile): floating tooltip with short definition
- Tooltip contains "Full glossary entry" link to `/glossary#{term}`
- `showOnce` mode: stores seen terms in localStorage `jyotish-terms-seen`, renders plain text after first view
- Tooltip positioned via CSS anchor positioning with JS fallback — no heavy library dependency
- If CSS disabled: renders as plain text (progressive enhancement)
- Zero visual impact on existing layout, spacing, or content

---

### 2.3 Glossary Data Store

**File:** `src/lib/constants/glossary.ts`

**Type:**
```ts
export interface GlossaryEntry {
  id: string;                    // "nakshatra"
  term: LocaleText;              // { en: "Nakshatra", hi: "नक्षत्र", sa: "नक्षत्रम्" }
  pronunciation: string;         // "nuhk-SHUH-truh"
  shortDef: string;              // One line for tooltip
  fullDef: string;               // 2-3 paragraphs for glossary page
  westernEquivalent?: string;    // "Lunar Mansion / Lunar Constellation"
  category: 'panchang' | 'kundali' | 'dasha' | 'yoga' | 'general';
  relatedTerms: string[];        // ["rashi", "pada", "moon"]
  seeAlso?: string;              // URL to learn module if exists
}
```

**Language note:** `shortDef` and `fullDef` are English-only for v1 (same rationale as archetype text — Global-Vibe targets English-first audience). The `term` field uses existing `LocaleText` for script-native display. Localized definitions are a Phase 2 concern.

**Starter corpus (~45 terms):**
- Panchang (12): Panchang, Tithi, Nakshatra, Yoga, Karana, Vara, Masa, Paksha, Amavasya, Purnima, Samvatsara, Ayana
- Kundali (14): Kundali, Lagna, Rashi, Graha, Bhava, Navamsha, Ayanamsha, Hora, Drekkana, Varga, Sphuta, Ashtakavarga, Bhava Chalit, Divisional Chart
- Dasha (6): Dasha, Mahadasha, Antardasha, Pratyantar, Vimshottari, Dasha Sandhi
- Yoga (7): Yoga (combination), Dosha, Raja Yoga, Dhana Yoga, Manglik/Kuja Dosha, Sade Sati, Pancha Mahapurusha
- General (6): Jyotish, Muhurta, Guna Milan, Ashta Kuta, Vedic, Sidereal/Tropical

---

## 3. Feature 1: Sidereal vs Tropical Comparison

### 3.1 Sign Calculator Enhancement

**Page:** Existing `/[locale]/sign-calculator`

**Change:** Add a "24-degree Shift" comparison panel below the existing sign results.

**Shows:** Sun, Moon, Ascendant only — side-by-side tropical vs sidereal with shift indicators.

**Content:**
- Table: Planet | Western (Tropical) | Vedic (Sidereal) | Shifted?
- Shifted count headline: "3 of 3 key placements shifted sign"
- Hook line (generated from comparison engine)
- Two CTAs: "See Full Comparison" (links to `/tropical-compare`) and "Share Discovery Card" (generates Satori card)

**Data flow:** Same birth input already collected. After computing sidereal signs (existing), call `compareTropicalVsSidereal(jd)` for the 3 key placements only.

---

### 3.2 Deep-Dive Page

**URL:** `/[locale]/tropical-compare`

**Entry points:**
- "See Full Comparison" link from sign calculator
- Navbar Tools dropdown
- Direct URL (organic search, shared links)
- Birth data passed via URL params from sign calculator; otherwise shows BirthForm

**Layout — 3 sections:**

**Section 1: The Identity Reveal**
- Split-panel layout: Western View (left) vs Vedic View (right)
- All 9 planets + Ascendant listed in both columns
- Shifted planets highlighted with gold + animated arrow
- Unshifted planets dimmed
- Right column shows extra Vedic data (nakshatra, pada) — the "higher resolution" proof
- Headline stat: "5 of 9 planets shifted sign. Ayanamsha: 24.19 degrees (Lahiri)"

**Section 2: The Precession Slider**
- Interactive time slider: 285 AD (0 degrees) to 2026 AD (24.19 degrees)
- Two concentric zodiac rings in SVG:
  - Inner ring: fixed sidereal constellations
  - Outer ring: tropical signs, rotates with slider
  - Planet dots on inner ring (fixed sidereal positions)
- As user drags, outer ring rotates and planets appear to cross sign boundaries
- Year markers where each planet's sign split occurs
- Explanatory text updates dynamically with slider position

**Section 3: What This Means**
- Per-planet interpretive text for shifted planets (generated from existing sign description data in constants)
- Nakshatra callout for Moon: "This is data Western astrology doesn't have"
- CTAs: "Generate Full Birth Chart" (links to `/kundali` with birth data in params) and "Share Discovery Card"

---

### 3.3 Discovery Share Card

**Card type:** `discovery` (new type in existing Satori pipeline at `/api/card/[type]`)

**Formats:** Story (1080x1920), Square (1080x1080), OG (1200x630)

**Visual:** Split-screen. Left (dark/muted): old Western sign. Right (gold/radiant): real sidereal sign. Hook line at center. Shifted count stat. QR code linking to `/tropical-compare` with UTM params.

**Card data:**
```ts
export interface DiscoveryCardData {
  tropicalSunSign: string;
  siderealSunSign: string;
  shiftedCount: number;
  totalPlanets: number;
  ayanamshaFormatted: string;
  hookLine: string;
}
```

---

## 4. Feature 2: Progressive Sanskrit Vocabulary

### 4.1 Integration Rollout

**Phase 1 (with this spec):** All new pages/features use `<JyotishTerm>` for every Sanskrit term. Specifically:
- `/tropical-compare` page
- `/glossary` page
- `/cosmic-blueprint` page
- `/lunar-calendar` page
- Blueprint tab in kundali
- Matching page share card modal
- Panchang insight blocks

**Phase 2 (follow-up):** Retrofit onto high-traffic existing pages:
- Panchang page (tithi, nakshatra, yoga, karana, vara)
- Kundali results page (lagna, graha, rashi, dasha, shadbala)
- Sign calculator (nakshatra, rashi, ayanamsha)
- Home page widget

**Phase 3 (deferred):** Learn modules, calendar pages, matching page.

### 4.2 Glossary Page

**URL:** `/[locale]/glossary`

**Layout:**
- Category filter tabs: All | Panchang | Kundali | Dasha | Yoga | General
- Client-side search/filter of server-rendered content
- Alphabetical sections with anchor links per term
- Each entry: term (with locale variant), pronunciation, short definition, full definition, western equivalent (if applicable), related terms, "Learn more" link

**Server-rendered** — no client interactivity needed except filter/search (client-side filtering of pre-rendered list).

**JSON-LD:** `DefinedTermSet` schema with `DefinedTerm` entries for each term. Targets Google definition rich snippets for "what is [term] in vedic astrology" queries.

**Metadata:** "Vedic Astrology Glossary — 50+ Terms Explained | Dekho Panchang"

---

## 5. Feature 3: The Cosmic Blueprint

### 5.1 Archetype Engine

**File:** `src/lib/kundali/archetype-engine.ts`

**Input:** Existing computed data — `ShadBalaComplete`, `DashaPeriod[]`, `YogaComplete[]`, ascendant sign, planet positions.

**No new astronomical computation.** Pure synthesis of already-computed data.

**Language note:** All interpretation text (archetype descriptions, traits, blind spots, yoga influences, hook lines) is English-only for v1. This is intentional — the Global-Vibe features target an English-first international audience. Planet names and sign names use existing `LocaleText` trilingual constants. Localization of interpretation text is a Phase 2 concern.

**9 Archetypes (mapped to 9 Vedic planets):**

| Planet | Archetype | Core Drive | Shadow When Weak |
|--------|-----------|------------|-----------------|
| Sun (0) | The Sovereign | Authority, identity, purpose | Ego fragility, need for validation |
| Moon (1) | The Empath | Emotional intelligence, nurturing | Emotional overwhelm, dependency |
| Mars (2) | The Warrior | Action, courage, competition | Aggression, impatience, burnout |
| Mercury (3) | The Analyst | Communication, logic, adaptability | Overthinking, anxiety, scattered focus |
| Jupiter (4) | The Visionary | Wisdom, expansion, meaning | Overcommitment, blind optimism |
| Venus (5) | The Harmonizer | Beauty, connection, pleasure | Conflict avoidance, indulgence |
| Saturn (6) | The Architect | Discipline, structure, endurance | Rigidity, isolation, fear of failure |
| Rahu (7) | The Maverick | Ambition, disruption, obsession | Compulsive striving, identity confusion |
| Ketu (8) | The Mystic | Detachment, intuition, liberation | Disconnection, apathy, escapism |

**Determination logic:**

1. **Primary archetype:** Planet with highest Shadbala `strengthRatio` (Sun through Saturn). Rahu/Ketu **replace** the Shadbala-derived primary if conjunct lagna lord or Moon (within 10 degrees) — this is a strong signal that the nodes dominate the life theme. If both Rahu and Ketu qualify, Rahu takes precedence (stronger worldly drive).
2. **Shadow archetype:** Planet with lowest `strengthRatio`.
3. **Current chapter:** Active Vimshottari Mahadasha lord maps to its archetype.
4. **Next chapter:** Next Mahadasha lord after current one ends.
5. **Persona modifier:** Lagna sign's ruling planet provides a "lens" description. E.g., Cancer lagna + Mars dominant = "Your Warrior nature expresses through Cancer's protective instinct."
6. **Yoga influences:** Top 3 strongest present yogas from `yogasComplete` with psychological interpretations (pre-written lookup table, not AI-generated).

**Output type:**
```ts
export interface CosmicBlueprint {
  primary: {
    archetype: ArchetypeId;
    name: LocaleText;
    planet: number;
    strength: number;
    description: string;
    traits: string[];
    blindSpot: string;
  };
  shadow: {
    archetype: ArchetypeId;
    name: LocaleText;
    planet: number;
    strength: number;
    description: string;
    growthArea: string;
  };
  currentChapter: {
    archetype: ArchetypeId;
    name: LocaleText;
    dashaLord: number;
    startDate: Date;
    endDate: Date;
    yearsRemaining: number;
    description: string;
    themes: string[];
  };
  nextChapter: {
    archetype: ArchetypeId;
    name: LocaleText;
    dashaLord: number;
    startDate: Date;
    transitionNote: string;
  };
  persona: {
    lagnaSign: number;
    expression: string;
  };
  activeYogas: {
    name: LocaleText;
    influence: string;
  }[];
  headline: string;   // "Analyst soul in a Visionary phase, approaching a Warrior shift in 2031"
}
```

### 5.2 Kundali Tab — "Blueprint"

**Location:** New tab in kundali results page, lazy-loaded via `next/dynamic`.

**Tab label:** "Blueprint"

**Layout:**
- Composite headline at top (the one-line summary)
- Two side-by-side cards: Primary archetype (left) and Shadow archetype (right)
  - Each card: planet symbol, archetype name, Shadbala score, 3-4 sentence description, traits list, blind spot / growth area
- Horizontal dasha timeline bar: previous chapter | current chapter (highlighted, "you are here" marker) | next chapter
- Current chapter detail: archetype name, dasha lord, date range, years remaining, description, themes
- Next chapter preview: transition note
- Shaping influences: top 3 yogas with psychological one-liners
- CTAs: "Share Blueprint Card" and "Full Dasha Timeline"

**Data source:** Runs `generateCosmicBlueprint()` client-side from already-computed `KundaliData` fields (shadbala, dashas, yogasComplete, ascendant). No additional API call.

### 5.3 Standalone Page

**URL:** `/[locale]/cosmic-blueprint`

**Same content as the tab** but with its own BirthForm entry point. For users arriving from shared cards or organic search who don't have a full kundali.

**Computation:** Reuses the full kundali computation pipeline (positions, Shadbala, Dasha, yogas are ~80% of it anyway) but only renders the Blueprint section. No "lightweight" variant — that creates a second code path that will drift. The standalone page computes a full `KundaliData` internally, renders only the Blueprint view.

**CTA:** "See your complete birth chart" links to `/kundali` with birth data in URL params.

**SEO targets:** "cosmic personality profile", "vedic astrology personality", "birth chart personality type", "what archetype am I"

**JSON-LD:** `Quiz` schema (input = birth data, output = archetype result).

### 5.4 Blueprint Share Card

**Card type:** `blueprint` in Satori pipeline.

**Visual:** Navy background. Planet symbol + archetype name (gold, large). Current chapter + next chapter. Composite headline. QR code to `/cosmic-blueprint`.

**Card data:**
```ts
export interface BlueprintCardData {
  name: string;
  primaryArchetype: string;
  primaryPlanet: string;
  currentChapter: string;
  currentDashaYears: string;      // "Jupiter, until 2035"
  nextChapter: string;
  nextDashaStart: string;         // "Mars, from 2035"
  headline: string;
}
```

---

## 6. Feature 4: Shareable Compatibility Cards

### 6.1 Card Data

**No new computation engine.** Maps from existing `MatchResult` (Ashta Kuta output).

```ts
export interface CompatibilityCardData {
  person1: { name: string; moonSign: LocaleText; moonNakshatra: LocaleText };
  person2: { name: string; moonSign: LocaleText; moonNakshatra: LocaleText };
  score: number;           // 0-36
  maxScore: number;        // 36
  percentage: number;
  verdict: string;         // "Excellent", "Good", etc.
  highlightedKutas: {
    name: string;
    score: number;
    maxScore: number;
    insight: string;       // Psychological framing, not traditional
  }[];
  hookLine: string;
}
```

### 6.2 Kuta Selection Logic

Pick 2-3 most narratively interesting kutas (not necessarily highest score). Priority:
1. Nadi (8 points, always show if score is 0 or 8 — both dramatic)
2. Bhakoot (7 points — emotional compatibility)
3. Whichever remaining kuta has the most extreme score (full marks or zero)

**Pre-written insight lookup:** ~24 entries covering each kuta at key score thresholds. Examples:

| Kuta | Score | Insight |
|------|-------|---------|
| Nadi | 8/8 | "Complementary vital energies — strong bond" |
| Nadi | 0/8 | "Your vital energies are identical — powerful but needs conscious balancing" |
| Bhakoot | 7/7 | "Emotional wavelengths are naturally harmonized" |
| Bhakoot | 0/7 | "Emotional wavelengths create productive tension — growth through difference" |
| Tara | 3/3 | "Your lunar rhythms are naturally synchronized" |
| Yoni | 4/4 | "Deep instinctive understanding — you read each other without words" |
| Gana | 6/6 | "Temperamental match — you operate at the same speed" |
| Gana | 0/6 | "Fire meets grace — passionate but requires mutual respect" |

### 6.3 Card Visual

**Formats:** Story (1080x1920), Square (1080x1080), OG (1200x630)

**Story layout:**
- Header: "Cosmic Compatibility"
- Two rashi icons (from existing `RashiIcons` SVG set) with names underneath
- Score display: large number (e.g., "28/36"), progress bar, verdict text
- 3 highlighted kutas with scores and insight text
- QR code + CTA: "Check YOUR compatibility"
- Footer: dekhopanchang.com

**Verdict color scale:** Excellent = gold, Good = soft green, Average = amber, Below Average = muted orange, Not Recommended = soft red

### 6.4 Integration into Matching Page

**Change to existing `/[locale]/matching` page:**
- New "Share Compatibility Card" and "Download as Image" buttons above the detailed results section
- Click opens existing `CardPreviewModal` with the compatibility card preview
- Share via existing `ShareCardButton` (Web Share API + clipboard fallback)

**No new page required.** Reuses existing modal/share infrastructure.

**Card generated via:** Existing `/api/card/[type]` route with type `compatibility`.

---

## 7. Feature 5: Lunar Lifestyle Calendar

### 7.1 Part A — Panchang Insight Blocks

**Enhances** the existing panchang page's 5 cards (tithi, nakshatra, yoga, karana, vara) with contextual "why this matters" explanations.

**Data file:** `src/lib/constants/panchang-insights.ts`

```ts
export interface PanchangInsight {
  id: string;                    // "shukla_ekadashi", "rohini"
  type: 'tithi' | 'nakshatra' | 'yoga' | 'karana' | 'vara';
  headline: string;              // "Natural Fasting Window"
  explanation: string;           // 2-3 sentences, scientific/observational framing
  bestFor: string[];
  avoid: string[];
  tradition: string;             // Brief note on traditional practice
}
```

**Coverage:** Pre-written insights for all 30 tithis, 27 nakshatras, 27 yogas, 11 karanas, 7 varas = ~102 entries.

**UI:** Collapsible insight block below each panchang card. "What does this mean?" toggle. Collapsed by default on mobile, expanded on desktop.

### 7.2 Part B — Lunar Lifestyle Page

**URL:** `/[locale]/lunar-calendar`

**The gateway page for the wellness audience.** Presents the lunar cycle as a month-view calendar with daily energy descriptions. Minimal Sanskrit terms, but uses `<JyotishTerm>` when they appear.

**Layout — 3 sections:**

**Section 1: Current Lunar Phase Hero**
- Moon phase visual (CSS/SVG rendered, accurate illumination percentage)
- Today's lunar energy headline (from nakshatra + yoga quality)
- Energy score bar (0-100)
- Best for / Avoid activity lists
- "Share Today's Energy" CTA (uses existing daily-vibe card type)

**Section 2: Month View Calendar**
- Standard month grid (Mon-Sun)
- Each day cell: moon phase icon (CSS-rendered crescent), energy score (0-100), marker dots for key events
- Event markers: Full Moon (FM), New Moon (NM), Ekadashi (E), Eclipse, Reset Point (Amavasya)
- Click/tap a day: inline detail panel expands below the row (only one panel open at a time — clicking a new day closes the previous one) with:
  - Energy score + headline
  - Nakshatra-derived description (psychological framing)
  - Best for / Avoid lists
  - Traditional context line (bridges to Vedic system without leading with it)
  - "See Full Panchang for This Day" link to existing daily panchang page
- Energy color scale: 80-100 gold, 50-79 muted gold, 0-49 grey

**Section 3: Lunar Rhythm Guide (static)**
- Explanatory content: Waxing Phase, Full Moon, Waning Phase, New Moon — what each means
- Key Windows: Ekadashi (fasting), Eclipse Windows
- "Explore the Full Vedic Calendar" CTA links to existing festival calendar

### 7.3 Energy Score Engine

**File:** `src/lib/panchang/energy-score.ts`

```ts
export interface DailyEnergy {
  score: number;           // 0-100
  label: string;           // "High", "Moderate", "Low"
  dominantFactor: string;  // "Full Moon", "Rohini Nakshatra"
  bestFor: string[];
  avoid: string[];
}

export function computeDailyEnergy(panchang: PanchangData): DailyEnergy
```

**Scoring formula:**
- Moon phase (40%): Peaks at Full Moon (100), troughs at New Moon (20). Not zero — even low-energy days have value.
- Nakshatra quality (30%): Base rating per nakshatra from existing constant data. Rohini, Pushya, Ashwini = 85-95. Ardra, Ashlesha, Jyeshtha = 30-45.
- Yoga quality (15%): 27 yogas classified auspicious/inauspicious in existing data. Siddha, Shubha = boost. Vyaghata, Vajra = penalty.
- Karana quality (10%): Movable karanas = 50. Fixed karanas (Shakuni, Chatushpada, Naga, Kimstughna) = 25-35. Bava, Balava = 70.
- Vara (5%): Friday/Monday slight boost, Saturday/Tuesday slight penalty.

All data already exists in constants files. No new astronomical computation.

### 7.4 Lunar Calendar SEO

**Target queries:** "moon phase calendar 2026", "lunar cycle planner", "moon energy today", "full moon calendar 2026", "best days to start a project astrology"

**Metadata:** "Lunar Lifestyle Calendar — Moon Phase Energy Guide | Dekho Panchang"

**JSON-LD:** `Event` entries for key lunar events (Full Moon, New Moon, eclipses) for Google event carousel. `FAQPage` schema for the Lunar Rhythm Guide content.

---

## 8. Implementation Order

**Approach: Hybrid — shared infra + Feature 1 together, then cascade.**

### Phase 1: Foundation + Feature 1
1. Comparison engine (`src/lib/ephem/comparison-engine.ts`)
2. Glossary data store (`src/lib/constants/glossary.ts`) — 45 terms
3. `<JyotishTerm>` component (`src/components/ui/JyotishTerm.tsx`)
4. Sign calculator enhancement (comparison panel)
5. Deep-dive page (`/tropical-compare`)
6. Precession slider (SVG interactive)
7. Discovery share card (Satori pipeline)
8. Glossary page (`/glossary`)

### Phase 2: Feature 3 — Cosmic Blueprint
9. Archetype engine (`src/lib/kundali/archetype-engine.ts`)
10. Archetype content data (descriptions, traits, blind spots for all 9 archetypes, yoga psychological interpretations, lagna-modifier text)
11. Blueprint tab in kundali page
12. Standalone `/cosmic-blueprint` page
13. Blueprint share card

### Phase 3: Feature 4 — Compatibility Cards
14. Kuta insight lookup table
15. Compatibility card data mapper
16. Compatibility card Satori template
17. Matching page share integration

### Phase 4: Feature 5 — Lunar Lifestyle
18. Panchang insights data (~102 entries)
19. Panchang page insight blocks (collapsible)
20. Energy score engine
21. Lunar calendar page (`/lunar-calendar`) — hero + month view + rhythm guide
22. Lunar event JSON-LD

### Phase 5: Integration & Polish
23. Navigation integration (all new pages in navbar/tools)
24. Sitemap updates (all new pages, all locale alternates)
25. Cross-linking (tropical-compare <-> sign-calculator <-> kundali, cosmic-blueprint <-> kundali, lunar-calendar <-> panchang <-> festival calendar)
26. `<JyotishTerm>` Phase 2 retrofit on existing high-traffic pages

---

## 9. Testing Strategy

### 9.1 Unit Tests

**Comparison engine:**
- Verify `isShifted` is correct for known birth data (Sun in late Aries tropical should shift to Pisces sidereal)
- Verify ayanamsha calculation matches known value for given JD
- Verify `shiftedCount` matches manual count
- Edge case: planet at exact sign boundary (e.g., 0.01 degrees into Aries tropical — does it correctly identify as Pisces sidereal?)
- Edge case: ayanamsha type toggle (Lahiri vs Raman vs KP)

**Archetype engine:**
- Verify primary archetype selects highest Shadbala planet
- Verify shadow archetype selects lowest
- Verify current chapter maps to correct dasha lord
- Verify next chapter selects correct next dasha period
- Verify Rahu/Ketu override triggers when conjunct lagna lord
- Edge case: two planets with identical Shadbala score (tiebreaker: natural benefic wins)

**Energy score engine:**
- Verify score range is always 0-100
- Verify Full Moon date produces score > 80
- Verify New Moon date produces score between 20-40
- Verify known auspicious nakshatra (Pushya) boosts score
- Verify known inauspicious yoga (Vyaghata) lowers score
- Cross-check: scores for 7 consecutive days should show lunar phase wave pattern

**Glossary data:**
- Every term has all required fields (no empty shortDef, fullDef, pronunciation)
- Every `relatedTerms` reference points to an existing term ID
- No duplicate term IDs
- Every category value is valid

### 9.2 Integration Tests

**Sign calculator -> comparison panel:**
- Birth form submission triggers comparison computation
- Shifted planets display gold highlight
- "See Full Comparison" link navigates to `/tropical-compare` with correct URL params
- Birth data survives the navigation (URL params parsed correctly on destination)

**Kundali -> Blueprint tab:**
- Tab renders only when clicked (lazy load verified)
- Blueprint data matches manually computed archetype for known chart
- Dasha timeline bar dates match the Dasha tab's dates

**Matching -> Compatibility card:**
- Share button appears only after results are computed
- Card preview modal opens with correct data
- Web Share API triggers (or clipboard fallback on desktop)
- Generated PNG matches preview

### 9.3 Visual / Browser Tests

**Every new page/component must be verified in browser:**
- Responsive: mobile (375px), tablet (768px), desktop (1280px+)
- Dark theme only — no light theme artifacts
- All `<JyotishTerm>` tooltips appear on hover/tap and dismiss correctly
- Precession slider is draggable and zodiac rings rotate smoothly
- Month calendar grid renders correctly for months starting on different weekdays
- Day expansion panel opens/closes without layout shift
- Share cards render correctly in all 3 formats (story, square, OG)
- All CTAs navigate to correct destinations
- No console errors after any interaction
- Print: not applicable (these are interactive features)

### 9.4 SEO Verification

- Every new page has `generateMetadata` in its `layout.tsx`
- JSON-LD renders in page source (view-source check)
- OG image generates correctly for each new page
- Sitemap includes all new pages with locale alternates
- No `noindex` on public pages
- Canonical URLs are correct
- `<JyotishTerm>` anchors on glossary page are crawlable

### 9.5 Regression Checks

- Existing sign calculator functionality unchanged (sidereal results still render)
- Existing matching page results unchanged (card is additive, not replacing)
- Existing kundali tabs still work (new tab is additive)
- Existing panchang cards unchanged (insight blocks are additive)
- Existing share cards (birth-poster, daily-vibe, yoga-badge) still generate
- Build passes: `npx next build` with zero errors
- Type check passes: `npx tsc --noEmit -p tsconfig.build-check.json`
- All existing tests pass: `npx vitest run`

---

## 10. SEO Strategy

### 10.1 New Pages & Target Queries

| Page | Primary Query Targets | JSON-LD Schema |
|------|----------------------|----------------|
| `/tropical-compare` | "sidereal vs tropical astrology", "why is my vedic sign different", "precession of equinoxes astrology" | `FAQPage` + `WebApplication` |
| `/glossary` | "what is [term] in vedic astrology" (x45 terms) | `DefinedTermSet` with `DefinedTerm` entries |
| `/cosmic-blueprint` | "vedic astrology personality", "cosmic personality profile", "birth chart archetype" | `Quiz` |
| `/lunar-calendar` | "moon phase calendar 2026", "lunar cycle planner", "moon energy today" | `Event` (lunar events) + `FAQPage` |

### 10.2 Metadata Template

Every new page:
1. `generateMetadata` in `layout.tsx` using `getPageMetadata()` from `src/lib/seo/metadata.ts`
2. Locale alternates for all active locales
3. OG image (either page-specific Satori or fallback to global)
4. JSON-LD via `generateToolLD()` + `generateBreadcrumbLD()`

### 10.3 Internal Linking Strategy

- `/tropical-compare` <-> `/sign-calculator` (bidirectional)
- `/tropical-compare` -> `/kundali` ("See full birth chart")
- `/cosmic-blueprint` <-> `/kundali` (bidirectional, Blueprint tab links to standalone, standalone links back)
- `/lunar-calendar` <-> `/panchang` (bidirectional, "See Full Panchang" / "See Lunar View")
- `/lunar-calendar` -> `/calendar` ("Explore Full Vedic Calendar")
- `/glossary` <- all new pages (via `<JyotishTerm>` links)
- `/glossary` -> `/learn/*` modules (via `seeAlso` links)

---

## 11. Navigation & Integration

### 11.1 Navbar Changes

**Tools dropdown** — add 3 new entries:
- "Tropical vs Sidereal" -> `/tropical-compare`
- "Cosmic Blueprint" -> `/cosmic-blueprint`
- "Lunar Calendar" -> `/lunar-calendar`

**No separate dropdown for "Global" features.** They integrate into the existing nav structure as tools.

**Glossary** — add to footer links section (not navbar — it's reference, not a tool).

### 11.2 Cross-Page CTAs

| From Page | CTA | Destination |
|-----------|-----|-------------|
| Sign calculator | "See Full Comparison" | `/tropical-compare` |
| Sign calculator | "Share Discovery Card" | Card modal |
| Tropical compare | "Generate Full Birth Chart" | `/kundali` |
| Tropical compare | "Share Discovery Card" | Card modal |
| Kundali (Blueprint tab) | "Share Blueprint Card" | Card modal |
| Kundali (Blueprint tab) | "Full Dasha Timeline" | Dasha tab |
| Cosmic blueprint | "See your complete birth chart" | `/kundali` |
| Matching results | "Share Compatibility Card" | Card modal |
| Lunar calendar (day detail) | "See Full Panchang for This Day" | `/panchang?date=YYYY-MM-DD` |
| Lunar calendar (rhythm guide) | "Explore the Full Vedic Calendar" | `/calendar` |
| Panchang (insight blocks) | "See Lunar View" | `/lunar-calendar` |

### 11.3 Sitemap

All 4 new pages added to `/app/sitemap.ts` with alternates for all active locales (en, hi, ta, bn).

---

## Appendix: What This Spec Does NOT Include

- **Light theme** — dark mode only, no changes
- **AI-generated interpretations** — all text is pre-written lookup tables
- **Account/login requirements** — all features work without auth
- **Database changes** — no new tables, no migrations
- **Tropical chart generation** — we show the comparison, not a full tropical chart engine
- **Invite flow for compatibility** — solo generation only (user enters both birth details)
- **Mobile app** — web only, PWA already exists
- **Monetization gates** — all features are free (consistent with current model)
