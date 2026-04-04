# Tippanni Convergence Synthesis — Design Spec

**Date:** 2026-04-04
**Status:** Approved
**Scope:** Cross-element synthesis engine for the tippanni (interpretive commentary) system, plus UI redesign and LLM premium tier.

---

## 1. Problem Statement

The current tippanni system produces ~5,000 words across 10 sections, but each section operates in isolation. A user with Mars in the 7th house, currently in Rahu Mahadasha, with Saturn transiting their 7th house, and Venus retrograde — four independent signals all pointing at "relationship turbulence" — never gets a unified narrative connecting them. Each gets its own separate paragraph in a separate section.

The enhancement adds cross-element synthesis that weaves natal placements, dasha periods, transits, retrogrades, combustions, and Ashtakavarga strength into coherent narratives — both as an executive summary at the top and as inline convergence markers throughout existing sections.

**Free tier:** Rule-based pattern matcher (deterministic, trilingual).
**Paid tier:** Claude API narrative layered on top (English-first, streaming).

---

## 2. Architecture Overview

### Data Flow

```
Kundali generation:
  -> compute chart (existing, unchanged)
  -> generate tippanni sections (existing, unchanged)
  -> build relationship map (NEW, ~1ms)
  -> run convergence engine with natal + current dasha (NEW, ~5ms)
  -> run interaction layer (NEW, ~1ms)
  -> attach convergence markers to tippanni sections (NEW, ~2ms)
  -> cache natal synthesis + pattern version hash

Page view:
  -> serve cached natal tippanni
  -> compute transit overlay (daily-cached):
      -> current transits + retro/combust status (~5ms)
      -> Ashtakavarga-weighted transit pattern scan (~3ms)
      -> merge into executive summary with natal synthesis (~2ms)
  -> render: executive summary at top, marked sections below
```

Total new computation: ~10ms on generation, ~10ms daily for transit overlay.

### Key Principle

The convergence engine is a **pure function** that runs alongside the existing tippanni engine. It does not modify existing tippanni code. It takes structured input, returns structured output, and the API layer merges them.

---

## 3. Convergence Input

Pre-computed from existing chart data — no new astronomical calculations needed.

```typescript
interface ConvergenceInput {
  planets: PlanetPlacement[];       // natal positions
  houses: House[];                  // house cusps
  dashas: DashaInfo;                // current maha/antar/pratyantar
  yogas: YogaResult[];              // detected yogas
  doshas: DoshaResult[];            // detected doshas
  transits: TransitPosition[];      // current planet positions
  retrogrades: boolean[];           // indexed by planet ID
  combustions: boolean[];           // indexed by planet ID
  moonSign: number;                 // for house-from-moon
  ascendant: number;                // for house-from-lagna
  ashtakavarga: number[][];         // SAV table [planet][sign]
  relationships: RelationshipMap;   // pre-joined lookups (see below)
}

interface RelationshipMap {
  houseRulers: Record<number, number>;    // house -> ruling planet ID
  planetHouses: Record<number, number>;   // planet ID -> house occupied
  planetSigns: Record<number, number>;    // planet ID -> sign occupied
  transitHouses: Record<number, number>;  // planet ID -> current transit house from Moon
  dashaLord: number;                      // current mahadasha lord planet ID
  antarLord: number;                      // current antardasha lord planet ID
}
```

The relationship map is pre-joined so pattern conditions are O(1) key lookups.

---

## 4. Pattern Definition

```typescript
interface ConvergencePattern {
  id: string;                           // e.g. 'career-peak'
  theme: 'career' | 'relationship' | 'wealth' | 'health' | 'spiritual' | 'family';
  significance: 1 | 2 | 3 | 4 | 5;    // base weight
  conditions: PatternCondition[];        // 2-4 independent signals
  mutuallyExclusive?: string[];         // pattern IDs that are suppressed if this fires higher
  text: {
    full: { en: string; hi: string };   // when all conditions match
    mild: { en: string; hi: string };   // when minMatches but not all
  };
  advice: { en: string; hi: string };
  laypersonNote: { en: string; hi: string };  // plain-language explainer
}
```

### Condition Types

```typescript
type PatternCondition =
  | { type: 'natal'; check: 'planet-in-house'; planet: number | 'malefic' | 'benefic'; house: number }
  | { type: 'natal'; check: 'lord-of-house-strong'; house: number }
  | { type: 'natal'; check: 'lord-of-house-afflicted'; house: number }
  | { type: 'natal'; check: 'yoga-present'; yogaId: string }
  | { type: 'natal'; check: 'dosha-present'; doshaId: string }
  | { type: 'transit'; check: 'planet-transiting-house'; planet: number; house: number }
  | { type: 'dasha'; check: 'lord-rules-or-occupies'; house: number }
  | { type: 'dasha'; check: 'lord-is-planet'; planet: number }
  | { type: 'retro'; check: 'planet-retrograde'; planet: number }
  | { type: 'combust'; check: 'planet-combust'; planet: number };
```

### Authoring DX — Builder Pattern

```typescript
definePattern({
  id: 'career-peak',
  theme: 'career',
  significance: 5,
  conditions: [
    natal.lordOfHouse(10).isStrong(),
    transit.planet(JUPITER).inHouseFromMoon(10),
    dasha.lordRulesOrOccupies(10),
  ],
  text: {
    full: { en: '...', hi: '...' },
    mild: { en: '...', hi: '...' },
  },
  advice: { en: '...', hi: '...' },
  laypersonNote: { en: '...', hi: '...' },
});
```

### Shared Utilities

```typescript
// Standard definitions reused across all patterns:
function isPlanetStrong(planetId: number, input: ConvergenceInput): boolean
  // not debilitated, not combust, ShadBala above median, not in 6/8/12

function isHouseAfflicted(house: number, input: ConvergenceInput): boolean
  // malefic occupant OR malefic aspect OR lord debilitated

function isPlanetStrong(planetId: number, input: ConvergenceInput): boolean
```

---

## 5. Scoring & Matching

### Match Grading

Each pattern has N conditions (typically 2-4). The engine evaluates all conditions:
- **Full match** (all conditions true) -> `full` text, full significance score
- **Partial match** (>= 2 conditions true, but not all) -> `mild` text, reduced score
- **No match** (< 2 conditions true) -> pattern not included

### Weighted Scoring

```
finalScore = baseSignificance
  * conditionWeightSum   // malefic planets get 1.5x, benefics 1.0x
  * matchRatio           // full match = 1.0, partial = 0.6
  * ashtakavargaModifier // transit conditions: 5+ bindus = 1.3x, <=2 = 0.7x
```

### Ranking

All matched patterns are sorted by `finalScore` descending. The top 3-5 become executive summary insights. All matched patterns are available in the full result.

---

## 6. Interaction Layer — 12 Meta-Rules

Meta-rules fire after pattern matching to add cross-pattern synthesis.

| # | Rule | Trigger | Output |
|---|------|---------|--------|
| 1 | Career + Health clash | career-positive AND health-negative active | Burnout warning narrative |
| 2 | Wealth + Relationship tension | wealth-positive AND relationship-negative | Balance advisory |
| 3 | Spiritual + Career conflict | spiritual-awakening AND career-pressure | Inner-vs-outer tension narrative |
| 4 | Multiple high-activation | 3+ high-significance patterns active | "Exceptionally intense period" flag |
| 5 | All quiet | No patterns fire above mild | "Consolidation period" narrative |
| 6 | Dasha transition amplifier | Dasha change within 6 months + any pattern | Transition urgency flag |
| 7 | Double benefic convergence | 2+ benefic patterns same theme | "Rare double blessing" amplifier |
| 8 | Double malefic convergence | 2+ malefic patterns same theme | "Compounding pressure" warning |
| 9 | Retrograde amplifier | Active pattern's key planet is retrograde | "Effects felt internally" modifier |
| 10 | Ashtakavarga boost | Transit planet has 5+ bindus | "Pronounced effects" modifier |
| 11 | Ashtakavarga weakness | Transit planet has <=2 bindus | "Muted effects" modifier |
| 12 | Navamsha confirmation | Pattern theme confirmed in D9 | "Deeper karmic significance" modifier |

Each meta-rule produces a `MetaInsight` appended to the executive summary.

---

## 7. Convergence Output

```typescript
interface ConvergenceResult {
  version: string;                       // pattern definition hash
  computedAt: string;                    // ISO timestamp

  executive: {
    activation: number;                  // 1-10, how much is happening
    favorability: number;                // -5 to +5, overall direction
    tone: 'growth' | 'pressure' | 'transformation' | 'quiet' | 'mixed';
    insights: ExecutiveInsight[];        // 3-5 discrete cards
    urgentFlags: UrgentFlag[];           // max 3, severity-ranked
    metaInsights: MetaInsight[];         // from interaction layer
  };

  patterns: MatchedPattern[];            // all matched, sorted by score
  sectionMarkers: Record<TippanniSection, string[]>;  // sectionId -> patternIds

  transitOverlay: {
    snapshot: TransitInsight[];           // significant current transits
    retroStatus: RetroInsight[];
    combustStatus: CombustInsight[];
    ashtakavargaHighlights: AshtakHighlight[];
  };
}

interface ExecutiveInsight {
  theme: string;                         // 'Career Convergence'
  themeIcon: string;                     // maps to SVG icon
  summary: Trilingual;                   // 2-3 sentences
  laypersonNote: Trilingual;             // 1 plain-language sentence
  temporalFrame: 'lifetime' | 'multi-year' | 'this-year' | 'this-month';
  matchCount: string;                    // "3 of 3 signals align"
  relatedPatterns: string[];
  expandedDetail: Trilingual;            // deeper analysis on expand
}

interface UrgentFlag {
  severity: 1 | 2 | 3;
  icon: 'warning' | 'opportunity' | 'transition';
  message: Trilingual;
  expiresAt: string;
  relatedPatterns: string[];
}

enum TippanniSection {
  Personality = 'personality',
  PlanetInsights = 'planet-insights',
  Yogas = 'yogas',
  Doshas = 'doshas',
  LifeAreas = 'life-areas',
  DashaSynthesis = 'dasha-synthesis',
  Strength = 'strength',
  YearPredictions = 'year-predictions',
}
```

---

## 8. Pattern Library — 58 Patterns

### Career (12)

| ID | Pattern | Key Conditions | Significance |
|----|---------|---------------|-------------|
| career-peak | Career Peak | 10th lord strong + Jupiter transit 10th + dasha of 10th lord | 5 |
| authority-conflict | Authority Conflict | Saturn/Rahu in 10th + Mars aspect 10th + dasha lord afflicted | 4 |
| career-change | Career Change | 10th lord in 12th + Rahu dasha + Saturn transit 10th | 4 |
| business-launch | Business Launch Window | 7th/10th lords strong + Jupiter aspect + benefic dasha | 3 |
| professional-stagnation | Stagnation | Saturn transit 10th + Saturn dasha + no benefic to 10th | 3 |
| foreign-career | Foreign Career | 9th/12th to 10th + Rahu dasha + transit 12th | 3 |
| public-recognition | Public Recognition | Sun/10th lord in kendra + Jupiter transit 10th/1st | 5 |
| mentor-appears | Mentor Appears | Jupiter transit 9th/10th + Jupiter dasha + strong 9th | 3 |
| legal-trouble | Legal Trouble | 6th lord to 10th + Rahu/Mars transit + malefic dasha | 4 |
| skill-mastery | Skill Mastery | 3rd lord strong + Mercury well-placed + 3rd/Mercury dasha | 2 |
| team-leadership | Team Leadership | Sun strong in 10th + Leo planets + Sun/10th lord dasha | 3 |
| retirement | Retirement/Withdrawal | 12th lord active + Saturn transit + Ketu dasha | 3 |

### Relationship (12)

| ID | Pattern | Key Conditions | Significance |
|----|---------|---------------|-------------|
| marriage-window | Marriage Window | Venus/7th lord strong + Jupiter transit 7th/1st + Venus dasha | 5 |
| relationship-storm | Relationship Storm | Malefic in 7th + Saturn transit 7th + dasha lord afflicting 7th | 5 |
| past-love-returns | Past Love Returns | Venus retrograde + 5th lord activated + Rahu/Venus dasha | 3 |
| second-marriage | Second Marriage | 2nd/9th lord to 7th + dual sign + dasha activation | 3 |
| partnership-blessing | Partnership Blessing | Benefics in 7th + Jupiter transit + Venus dasha | 4 |
| divorce-separation | Divorce/Separation | Mars/Rahu in 7th + Saturn 7th transit + 6th lord active | 5 |
| long-distance-love | Long-Distance Love | 9th/12th to 7th + Rahu influence + foreign transit | 2 |
| trust-betrayal | Trust Betrayal | Rahu in 7th + 7th lord combust/retrograde + malefic dasha | 4 |
| deepening-intimacy | Deepening Intimacy | Venus/Moon in 8th + benefic transit + harmonious dasha | 3 |
| commitment-resistance | Commitment Resistance | Ketu in 7th + Saturn aspect + Ketu dasha | 3 |
| business-partner-conflict | Business Partner Conflict | 7th lord afflicted + Mars transit + 6th lord activated | 3 |
| soulmate-connection | Soulmate Connection | Venus/7th lord navamsha kendra + Jupiter transit + Venus dasha | 5 |

### Wealth (10)

| ID | Pattern | Key Conditions | Significance |
|----|---------|---------------|-------------|
| sudden-wealth | Sudden Wealth | 2nd/11th lords strong + Jupiter transit 2nd/11th + Rahu dasha | 5 |
| financial-crisis | Financial Crisis | 2nd lord afflicted + Saturn transit 2nd + malefic dasha | 5 |
| steady-accumulation | Steady Accumulation | 2nd/11th well-placed + Saturn/Jupiter aspect + stable dasha | 3 |
| speculative-gains | Speculative Gains | 5th lord strong + Jupiter/Rahu transit 5th + favorable dasha | 3 |
| speculative-losses | Speculative Losses | 5th lord afflicted + Rahu/Mars in 5th + malefic transit | 4 |
| property-acquisition | Property Acquisition | 4th lord strong + Jupiter transit 4th + Saturn favorable | 3 |
| inheritance | Inheritance | 8th lord activated + 2nd triggered + 8th/2nd lord dasha | 3 |
| income-change | Income Source Change | 10th/11th lord transit + Rahu dasha + career-change co-active | 3 |
| debt-trap | Debt Trap | 6th/12th lords active + Rahu/Saturn transit + malefic dasha | 4 |
| charity-phase | Charity/Donation Phase | 12th lord activated + Jupiter transit + Ketu dasha | 2 |

### Health (8)

| ID | Pattern | Key Conditions | Significance |
|----|---------|---------------|-------------|
| chronic-illness | Chronic Illness Onset | 6th lord + Mars/Saturn affliction + malefic transit 6th/8th | 5 |
| recovery | Recovery Period | 6th lord weakening + Jupiter transit 1st/6th + benefic dasha | 3 |
| accident-prone | Accident Prone | Mars in 8th + Rahu-Ketu 1st-7th + malefic transit | 5 |
| mental-health | Mental Health Pressure | Moon afflicted + 4th stressed + Saturn/Rahu transit Moon | 5 |
| surgery | Surgical Period | Mars active + 8th triggered + Mars/Ketu transit | 3 |
| vitality-peak | Vitality Peak | Sun/Mars strong + Jupiter transit 1st + benefic dasha | 3 |
| eye-head | Eye/Head Issues | Sun afflicted + 2nd/12th stressed + Mars transit | 2 |
| digestive | Digestive/Metabolic | 6th lord + Mercury afflicted + transit stress | 2 |

### Spiritual (8)

| ID | Pattern | Key Conditions | Significance |
|----|---------|---------------|-------------|
| awakening | Spiritual Awakening | Ketu dasha + 12th activated + Jupiter transit 9th/12th | 5 |
| guru-connection | Guru Connection | 9th lord strong + Jupiter transit 9th + Jupiter/9th lord dasha | 4 |
| pilgrimage | Pilgrimage Call | 9th/12th active + Ketu transit + spiritual dasha | 3 |
| moksha-activation | Moksha Yoga Activation | Ketu in 12th + 12th lord kendra + Ketu dasha + Jupiter transit | 5 |
| meditation | Meditation Deepening | Moon strong + 12th benefic + Ketu/Moon dasha | 3 |
| past-life | Past-Life Surfacing | Ketu conjunct planet + that planet's dasha + Rahu transit Ketu | 3 |
| detachment | Detachment Phase | Ketu transit 1st/7th + Saturn aspect + Ketu dasha | 3 |
| occult | Occult Abilities | 8th lord strong + Rahu/Ketu axis + 8th transit | 2 |

### Family (8)

| ID | Pattern | Key Conditions | Significance |
|----|---------|---------------|-------------|
| childbirth | Childbirth Window | 5th lord strong + Jupiter transit 5th + benefic dasha | 5 |
| child-health | Child Health Concern | 5th lord afflicted + malefic transit 5th + Rahu/Ketu dasha | 3 |
| mother-health | Mother's Health | 4th lord afflicted + Moon stressed + Saturn transit 4th | 3 |
| father-health | Father's Health | 9th lord afflicted + Sun stressed + Saturn transit 9th | 3 |
| property-dispute | Property Dispute | 4th lord afflicted + Mars/Rahu in 4th + 6th lord active | 4 |
| family-harmony | Family Harmony | Benefics in 4th + Jupiter transit + Venus/Moon dasha | 3 |
| ancestral-karma | Ancestral Karma | Pitri dosha + Ketu/Saturn transit 9th + dasha activation | 3 |
| sibling-dynamics | Sibling Support/Conflict | 3rd lord status + Mars transit + 3rd activation | 2 |

---

## 9. Caching Strategy

### Natal Synthesis
- Cached with the kundali object.
- Keyed by: `kundali_id + pattern_version_hash`.
- Recomputed lazily if version hash changes (new patterns added).
- Recomputed if birth data is edited.

### Transit Overlay
- Daily cache, keyed by: `kundali_id + date_string`.
- Computed on first request of the day.
- Lightweight: transit positions + retrograde/combust booleans + Ashtakavarga lookup.

### LLM Responses (Paid Tier)
- Cached for 24 hours, keyed by: `kundali_id + date_string + hash(chart_id + date)`.
- `temperature: 0` + seed for deterministic output.
- Rate limit: 1 generation per chart per day.

### Backward Compatibility
- Old kundalis without convergence data get it computed lazily on next view.
- No migration script needed — the natal data is already stored.

---

## 10. LLM Premium Tier

### Architecture

The pattern engine does the astrology. Claude is the **narrator** — it takes structured findings and weaves them into natural prose.

```
Free: chart -> pattern engine -> rule-based text -> display
Paid: chart -> pattern engine -> matched patterns + chart data -> Claude API -> narrative -> display
```

### Prompt Design

```
System: You are a senior Vedic astrologer writing a personal consultation.
You will receive structured chart analysis results. Your job is to weave
these findings into a coherent, empathetic narrative. Do not invent
astrological claims — only narrate what the data shows. Write in {locale}.

User:
Chart: {natal summary}
Active patterns: {matched patterns with scores and conditions}
Interaction notes: {meta-rule outputs}
Transit snapshot: {current transits with house positions}
Temporal context: {dasha period, upcoming transitions}

Write a personalized reading:
1. Opening — the single most important thing this person needs to hear now
2. Life themes — weave active patterns into 3-4 themed sections
3. Timing — what's peaking now, building, fading
4. Guidance — actionable advice grounded in chart findings
```

### Cost & Constraints

- Input: ~2000 tokens, output: ~1500 tokens
- Cost per reading: ~$0.02-0.04 (Sonnet), ~$0.08-0.12 (Opus)
- Rate limit: 1 LLM generation per chart per day
- Trigger: explicit "Get AI Reading" button, not automatic on page load
- Streaming: SSE for word-by-word display
- Fallback: if API fails, serve rule-based synthesis seamlessly
- Language: English only at launch. Hindi after quality evaluation.

### "Ask a Follow-Up"

After the LLM reading, paid users get 1 follow-up question per session. Uses the existing chart + reading as conversation context. Capped at 1 to control costs.

### Launch Quality Gates

- 20 manual reviews with >80% quality score
- p95 latency < 8 seconds including streaming first token
- Cost per reading confirmed < $0.10
- Fallback to rule-based works reliably when API is down

---

## 11. UI Design — "The Reading Room"

### Design Language

Follows the existing app's color system: navy `#0a0e27` backgrounds, gold `#d4a853` / `#f0d48a` accents, glass-card styling. Theme-specific gradients match the homepage hero card system for consistency.

Key terms throughout all tippanni text are highlighted in `text-amber-400 font-semibold`: planet names, house numbers, sign names, dasha names, yoga names, dosha names, nakshatra names. Matched against exact Jyotish term dictionary (from constants files) with word boundaries — no substring false positives.

### Executive Summary — Hero Card

- Sits at the top of the tippanni tab with elevated visual weight
- Stays within `max-w-5xl` but uses thicker border (`border-2 border-gold-primary/25`), deeper gradient (`from-[#1a0e3a]/60 via-[#0f0825]/70`), and radial glow to signal importance
- **Dual-axis gauge** (SVG): activation ring (1-10) + favorability color (green to red)
- **Urgent flags**: pill badges with pulse animation, `border-amber-500/30 bg-amber-500/10`, max 3, severity-ranked
- **Insight cards**: 2-column grid (desktop), 1-column (mobile). Each card has theme-colored left border matching homepage card system:
  - Career: Purple `from-[#2d1b69]/50`
  - Relationship: Pink `from-[#4a1a3a]/35`
  - Wealth: Gold `from-[#3a2a10]/35`
  - Health: Blue `from-[#1a2a5a]/40`
  - Spiritual: Indigo `from-[#1a1a4a]/40`
  - Family: Orange `from-[#4a2a10]/40`
- Each insight card shows: theme icon (custom SVG), match count ("3 of 3 signals"), summary text, temporal frame badge, expand arrow
- Expandable: tap reveals `expandedDetail` + `laypersonNote` + `advice`

### Section Cards

Each tippanni section (Personality, Planets, Yogas, etc.) renders as a collapsible mega card with theme-specific gradient background.

- **Default state**: Top 3 most relevant sections auto-expanded (determined by convergence score). Rest collapsed.
- **Header**: Section title + 1-line summary + convergence badge if applicable
- **Convergence badge**: Gold pill on section header — `Part of: Career Peak` — clicking scrolls to executive summary
- **Expand animation**: Framer Motion `layout` with height auto-animation, content stagger

### Planet Insight Cards

9 planet cards, each with:
- Planet-specific accent via left border: `border-l-4` with graha color (Sun `#e67e22`, Moon `#ecf0f1`, Mars `#e74c3c`, etc.)
- Strength bar: thin horizontal, green (strong) to red (weak) based on ShadBala
- **Convergence callout box**: appears only if this planet participates in an active convergence pattern. Styled `bg-gold-primary/5 border border-gold-primary/20 rounded-lg`.
- Bottom metadata row: dignity, ShadBala, nakshatra pada — monospace chips

### Life Area Score Cards

5 horizontal bars (Career, Wealth, Marriage, Health, Education):
- Score bar with gradient fill: red (0-3) -> amber (4-6) -> green (7-10)
- 1-line summary with amber-highlighted key terms
- Clickable to expand detailed analysis

### Dasha Timeline

- **Desktop**: horizontal timeline, colored bars per planet, current period glowing with pulse
- **Mobile**: vertical timeline, current period at top, each period a full-width card
- Hover/tap reveals antardasha breakdown
- Near-term transitions get urgent flag styling

### Remedy Cards

- 3-column grid (desktop), 1-column (mobile)
- Each card: custom SVG icon (not emoji), planet association, timing guidance
- Priority 1 remedies: gold border + "Recommended" badge
- Priority 2-3: grouped in collapsible "Other remedies" section
- Cards connected to convergence patterns get gold top-border

### Progressive Disclosure

On first load, animate in sequence:
1. Executive summary card (0.5s fade-in)
2. Section headers stagger in (0.05s each)
3. Auto-expanded sections reveal content (0.3s each)

Creates a "the reading is being prepared for you" ceremonial feeling.

### Print/PDF

Print-optimized stylesheet: all sections expanded, no interactive elements, clean serif typography, executive summary + all sections on A4 paper.

---

## 12. Testing Strategy

### Test Chart Factory

```typescript
function makeChart(spec: Partial<ChartSpec>): ConvergenceInput
// Generates realistic chart data from a compact spec:
// makeChart({ mars: { house: 7, sign: 7 }, dashaLord: 'rahu', saturnTransit: 7 })
// Only specified conditions are set; everything else defaults to neutral positions.
```

### Unit Tests (116+ cases)

Each of the 58 patterns gets:
- 1 positive test (chart where it fires)
- 1 negative test (chart where it doesn't fire)

Total: 116 minimum. Edge cases added for patterns with complex conditions.

### Integration Tests

- Engine correctly ranks patterns by weighted score
- Interaction layer fires when opposing patterns co-exist
- Post-processor attaches markers to correct `TippanniSection` values
- Transit overlay respects daily cache

### Structural Snapshot Tests

- Given fixed chart + fixed date -> `ConvergenceResult` structure (matched pattern IDs, scores, section markers) must match stored snapshot
- Text content excluded from snapshots — content changes shouldn't break tests
- Snapshots updated intentionally when patterns change (verified by version hash)

### Performance Benchmark

- Full engine run against 10 different charts: assert total < 50ms
- Transit overlay computation: assert < 20ms
- Catches regressions if pattern count grows

### Coverage Tracking

Every pattern ID must appear in at least one test file. CI check enforces this.

### LLM Tier Testing

- Schema validation: verify LLM response contains expected sections
- Prompt regression: 5 reference charts, manual review when prompt changes
- Cost monitoring: alert if average tokens per reading exceeds threshold

---

## 13. File Organization

```
src/lib/tippanni/convergence/
├── types.ts                     // all interfaces and enums
├── patterns/
│   ├── career.ts               // 12 career patterns
│   ├── relationship.ts         // 12 relationship patterns
│   ├── wealth.ts               // 10 wealth patterns
│   ├── health.ts               // 8 health patterns
│   ├── spiritual.ts            // 8 spiritual patterns
│   ├── family.ts               // 8 family patterns
│   └── index.ts                // exports ALL_PATTERNS array
├── interactions.ts              // 12 meta-interaction rules
├── engine.ts                    // main scan + match + rank (~200 lines)
├── relationship-map.ts          // build RelationshipMap from chart
├── transit-overlay.ts           // daily transit synthesis
├── post-processor.ts            // attach convergence markers
├── scoring.ts                   // weighted scoring + Ashtakavarga
├── phrases.ts                   // reusable trilingual phrase builders
├── utils.ts                     // isPlanetStrong(), isHouseAfflicted()
├── highlight.ts                 // key term highlighter for UI text
└── __tests__/
    ├── engine.test.ts
    ├── patterns.test.ts
    ├── interactions.test.ts
    ├── chart-factory.ts         // test chart generator
    └── snapshots/               // structural snapshots

src/lib/tippanni/convergence-llm/  // Phase 4
├── prompt.ts                    // prompt templates
├── synthesizer.ts               // Claude API + streaming
├── cache.ts                     // 24h response cache
└── fallback.ts                  // graceful degradation
```

---

## 14. Rollout Plan

### Phase 1 — Foundation (Week 1-2)
- Convergence engine core: types, relationship map, matching loop, scoring
- 15-20 highest-impact patterns (English only)
- All 12 interaction meta-rules
- Post-processor for convergence markers
- Unit tests for all initial patterns
- Wire into `/api/tippanni` — executive summary in response
- Feature flag: `CONVERGENCE_SYNTHESIS` env var (default ON)

### Phase 2 — Content + Transit (Week 3-4)
- Author remaining 38-43 patterns (English)
- Test chart factory + complete test suite
- Transit overlay (daily-cached) with Ashtakavarga weighting
- Key term highlighter utility
- UI: executive summary hero card
- UI: convergence badges on section headers
- UI: planet convergence callout boxes

### Phase 3 — Hindi + Polish (Week 5)
- Hindi translations for all 58 patterns + 12 meta-rules
- Sanskrit for executive summary only
- UI: dasha timeline (horizontal/vertical responsive)
- UI: life area score bars
- UI: remedy priority cards
- UI: progressive disclosure animation
- Performance benchmarks + snapshot tests
- Print stylesheet

### Phase 4 — LLM Premium (Week 6+)
- Claude API integration + prompt engineering
- Streaming response UI ("Get AI Reading" button)
- Rate limiting + caching + cost monitoring
- "Ask a follow-up" feature (1 per session)
- Paywall gate on LLM synthesis
- Quality review of first 100 readings
- Launch gates verified

### Feature Flag

```typescript
// In convergence engine entry point:
const CONVERGENCE_ENABLED = process.env.CONVERGENCE_SYNTHESIS !== 'false';
if (!CONVERGENCE_ENABLED) return null;
```

Disables the entire convergence system without a deploy if a bug surfaces in production.

---

## 15. Analytics

Track post-launch:
- Which patterns fire most frequently (prioritize content quality for high-frequency patterns)
- Time spent on tippanni tab with vs without convergence synthesis
- Executive summary expand rate (do users click into insight cards?)
- LLM tier conversion rate (free -> paid for AI reading)
- LLM tier cost per user per month
- Follow-up question usage rate
