# Vedic Astrology Profile — Narrative Section Design

**Date:** 2026-04-22
**Location:** Personal Pandit dashboard, above Key Dates Timeline
**Approach:** Fully templated (no AI API calls)
**Render:** Progressive reveal — ~200 words collapsed, ~600 expanded

---

## Problem

The current tippanni system generates structured data cards (personality blocks, planet tables, yoga lists) inside a technical tab. It reads like a reference manual. Users expect a **narrative consultation** — the kind of flowing, synthesized reading a senior Jyotishi would give in their first sitting: connecting dots between placements, picking out what's distinctive about *this specific chart*, and explaining it in plain language with Jyotish vocabulary naturally woven in.

## Solution

A new `VedicProfile` section at the top of the Personal Pandit dashboard (Layer 1), rendered above Key Dates. It produces a templated narrative essay whose framing adapts to the chart's actual patterns — not every chart gets the same "inner vs. outer self" treatment.

## Narrative Sections

### 1. Opening Hook (always visible)

One sentence capturing what's most distinctive about this chart. The framing is chosen by a priority-based pattern detector — the first matching pattern wins:

| Priority | Pattern | Example Framing |
|----------|---------|-----------------|
| 1 | Stellium (3+ planets in one house) | "Your chart concentrates enormous energy in [house theme] — [N] planets crowd your [Nth] house, making [theme] the gravitational center of your life." |
| 2 | Kaal Sarpa Yoga active | "The Rahu-Ketu axis grips your entire chart between [houses], channeling all planetary energy through a karmic corridor." |
| 3 | Multiple raja yogas (2+) | "Your chart carries unusual markers of authority — [N] raja yogas weave together planets of power and opportunity." |
| 4 | Mahapurusha Yoga | "[Yoga name] forms in your chart: [planet] in its strongest dignity in a kendra, conferring [quality]." |
| 5 | Lagna lord exalted or own-sign | "With [planet] — lord of your ascendant — commanding from [dignity] in [sign], your chart has an unusually strong anchor." |
| 6 | Debilitated key planet (lagna lord, Moon, or Sun) | "[Planet] labors in [sign], its sign of debilitation — this shapes a core theme of [area] that asks for conscious effort." |
| 7 | Lagna & Moon in same sign | "Your outer persona and inner emotional world are unified in [sign] — there is no duality here, only concentrated [element] energy." |
| 8 | Lagna & Moon in contrasting elements | "You navigate between [lagna element] intellect and [moon element] depth — [sign] shapes your face to the world while [moon sign] runs the inner current." |
| 9 | Sade Sati active | "Saturn's passage over your Moon — Sade Sati — is the defining pressure of your current years." |
| 10 | Gajakesari / Chandra-Mangala Yoga | "[Yoga] forms between [planets], creating [quality] — one of the more recognized combinations in Jyotish." |
| 11 | Fallback | Lagna element + Moon element synthesis sentence |

Each pattern has 2-3 template variants to avoid repetition across charts that share the same top pattern. Variant selection is deterministic — based on a hash of the birth data (date + time + coordinates) — so the same chart always produces the same profile text.

### 2. Core Identity (always visible)

Two short paragraphs:

**Lagna paragraph (2-3 sentences):** Pulled from `LAGNA_DEEP[sign].personality`, trimmed to the most distinctive lines. Prefaced with the sign name and ruling planet context. Example: "**Aquarius Ascendant (Saturn-ruled).** You are likely perceived as an original, progressive, and somewhat unconventional thinker. Saturn as lagna lord gives you a serious undertone and a natural inclination toward systematic or humanitarian work."

**Moon paragraph (2-3 sentences):** A new per-sign narrative template that integrates:
- Rashi name + ruling planet
- Moon nakshatra name + its core nature (from `nakshatra-details.characteristics`)
- Element and quality of the sign
- One behavioral insight specific to the nakshatra

Example: "**Moon in Scorpio · Jyeshtha Nakshatra.** Your inner world runs deep — Scorpio Moon people process emotions through transformation rather than expression. Jyeshtha, the Elder Star, adds an instinct for mastery and seniority; you earn authority not by asking but by enduring."

This is NOT rigidly "outer vs. inner" — if Lagna and Moon are the same sign, the paragraph pivots to "your identity is undivided" framing. If Moon is in the lagna itself (1st house), it frames as "what you feel is what you show."

### 3. Standout Observation (always visible)

One paragraph (3-4 sentences) expanding the opening hook's pattern into practical meaning. This is where specific yogas, stelliums, or dignities get their narrative moment.

Sources:
- Yoga descriptions from `yogasComplete` (reformatted into prose)
- `PLANET_HOUSE_DEPTH` implications for house-based patterns
- `DIGNITY_EFFECTS` for dignity-based patterns
- Connector phrases that relate the pattern to the person's life

Example (Chandra-Mangala Yoga): "Moon and Mars together in Scorpio form Chandra-Mangala Yoga — a combination that creates high-energy, passionate drive. In Scorpio, Mars's own sign, this energy runs hot but controlled, like pressure channeled through a narrow valve. The 10th house placement directs this intensity toward career and public standing. Professionally, you are built for crisis management and high-stakes environments."

--- EXPAND BOUNDARY ("Read full profile") ---

### 4. Key Planetary Observations (expanded)

2-3 paragraphs, each covering one notable pattern from the priority list (positions 2-4 after the standout). Each paragraph:
- Names the pattern (conjunction, house cluster, dignity, yoga)
- Explains it in 2-3 sentences using Jyotish terms with inline context
- Connects it to a life area

Patterns are picked from `detectChartPatterns()` — the same scored list as the hook, minus the one already used for the standout.

Source data: `PLANET_HOUSE_DEPTH`, `DIGNITY_EFFECTS`, yoga descriptions, functional nature (yogakaraka/maraka/badhak).

### 5. Nakshatra Insight (expanded)

One paragraph on the Moon nakshatra using `nakshatra-details.ts`:
- Nakshatra name + meaning + symbol
- Mythology snippet (1-2 sentences from the `mythology` field)
- Behavioral characteristics (from `characteristics` field)
- Pada-specific note if data allows

This data is already rich and 10-language. We surface `mythology` (trimmed to 1-2 sentences) + `characteristics` as a flowing paragraph.

### 6. Dasha Context (expanded)

One paragraph framing "where you are in your life story":
- Current Mahadasha lord + remaining years
- Current Antardasha lord
- Dasha lord's dignity and house position → practical meaning
- Uses `DASHA_EFFECTS` text + house/dignity data

Example: "You are in Saturn Mahadasha (12 years remaining) — a period of disciplined building and structural work. Saturn sits in your 10th house in its own sign Aquarius, meaning this period rewards sustained professional effort over shortcuts. The current Antardasha of Mercury adds a communicative, analytical quality to this Saturn phase."

### 7. Active Doshas (expanded, conditional)

Shown only if one or more doshas are active. One paragraph per dosha:
- Dosha name + severity (full/partial/cancelled)
- What it means in plain language
- Cancellation conditions if any apply (framed positively: "This is mitigated by...")
- No alarm language — factual and contextual

Doshas to cover: Manglik, Kaal Sarpa, Pitra Dosha, Sade Sati (if active).

If no doshas are active, this section is omitted entirely (no "you have no doshas" filler).

### 8. Strength Snapshot (expanded)

A compact reference table — the only non-narrative element:

| Planet | Dignity | House | One-line Impact |
|--------|---------|-------|-----------------|
| Saturn | Own Sign | 10H | Strong focus on career and public reputation |
| Sun | Exalted | 7H | Powerful partnerships, authoritative spouse |
| Mars | Own Sign | 10H | Crisis-grade courage, professional intensity |
| ... | ... | ... | ... |

Only planets with notable dignity (exalted, own sign, debilitated, retrograde) are included. Planets in neutral dignity are omitted to keep the table meaningful.

---

## Pattern Detection Engine

```typescript
interface ChartPattern {
  type: 'stellium' | 'kaalSarpa' | 'rajaYoga' | 'mahapurusha' | 'dignifiedLagnaLord'
      | 'debilitatedKey' | 'sameLagnaMoon' | 'contrastingElements' | 'sadeSati'
      | 'lunarYoga' | 'retrogradeKendra';
  score: number;           // base weight × relevance
  planets: number[];       // planet IDs involved
  houses?: number[];       // houses involved
  yogaName?: string;       // if yoga-based
  description?: string;    // pre-resolved locale text
}

function detectChartPatterns(kundali: KundaliData): ChartPattern[]
// Returns patterns sorted by score descending.
// Top pattern → hook + standout.
// Patterns 2-4 → key planetary observations.
```

Score weights (from design discussion):
- Stellium: 90
- Kaal Sarpa: 85
- Raja Yoga (2+): 80
- Mahapurusha: 75
- Exalted/own-sign lagna lord: 70
- Debilitated key planet: 65
- Retrograde in kendra: 60
- Sade Sati active: 55
- Gajakesari/Chandra-Mangala: 50
- Same lagna/moon sign: 45
- Contrasting elements: 40

## Data Flow

```
KundaliData (already computed on page)
  │
  ▼
generateVedicProfile(kundali, locale): VedicProfile
  ├── detectChartPatterns(kundali) → ChartPattern[] (scored, sorted)
  ├── buildHook(patterns[0], kundali, locale) → string
  ├── buildCoreIdentity(kundali, locale) → { lagna: string, moon: string }
  ├── buildStandout(patterns[0], kundali, locale) → string
  ├── buildPlanetaryObservations(patterns[1..3], kundali, locale) → string[]
  ├── buildNakshatraInsight(kundali, locale) → string
  ├── buildDashaContext(kundali, locale) → string
  ├── buildDoshaSection(kundali, locale) → string | null
  └── buildStrengthTable(kundali, locale) → StrengthRow[]
  │
  ▼
VedicProfile {
  hook: string;
  coreIdentity: { lagna: string; moon: string };
  standout: string;
  planetaryObservations: string[];
  nakshatraInsight: string;
  dashaContext: string;
  doshaSection: string | null;
  strengthTable: StrengthRow[];
  personName: string;
}

StrengthRow {
  planet: string;
  dignity: string;
  house: number;
  impact: string;
}
```

## Component: `<VedicProfile />`

**Props:**
```typescript
interface VedicProfileProps {
  profile: VedicProfile;
  locale: string;
}
```

**Behavior:**
- Collapsed by default: shows hook + coreIdentity + standout (~200 words)
- "Read full profile" button expands to show all sections
- Expansion state stored in local component state (not persisted)
- Smooth height animation on expand/collapse (CSS transition, not Framer Motion)

**Styling:**
- Dark card with subtle gradient (`from-[#1a1040]/40 to-[#0a0e27]`)
- Gold border accent (`border-gold-primary/10`)
- Section headings in `text-gold-light` with small gold dividers between sections
- Body text in `text-text-primary` with `leading-relaxed` for readability
- Person's name as a heading: "Vedic Profile: [Name]"
- Strength table uses the standard dark table styling

**Placement:** Inside Layer 1 (Personal Pandit dashboard), as the first element — above Key Dates Timeline.

## Tone

**Layered Jyotish-native:** Uses terms naturally but contextualizes them inline.

- YES: "Mars as your yogakaraka — the single most supportive planet for your ascendant — sits in its own sign."
- YES: "Jyeshtha, the Elder Star, adds an instinct for mastery."
- NO: "You have Chandra-Mangala Yoga (this means Moon and Mars are together)."
- NO: "Mars in 10H gives career success." (too terse, no context)

Second person ("you", "your"). Present tense for chart interpretation, present continuous for dasha ("you are running...").

## Files to Create/Modify

### New Files
1. `src/lib/kundali/vedic-profile.ts` — engine: `generateVedicProfile()`, `detectChartPatterns()`, all `build*()` helpers
2. `src/lib/kundali/vedic-profile-templates.ts` — hook templates, connector phrases, moon-sign narrative templates (all EN + HI)
3. `src/components/kundali/VedicProfile.tsx` — render component

### Modified Files
4. `src/app/[locale]/kundali/page.tsx` — import `VedicProfile`, call `generateVedicProfile()` when kundali is ready, render above Key Dates in Layer 1

### Existing Files Used (read-only)
- `src/lib/kundali/tippanni-lagna.ts` — `LAGNA_DEEP` personality text
- `src/lib/constants/nakshatra-details.ts` — mythology, characteristics
- `src/lib/kundali/tippanni-planets.ts` — `PLANET_HOUSE_DEPTH`, `DIGNITY_EFFECTS`, `DASHA_EFFECTS`
- `src/lib/kundali/yogas-complete.ts` — yoga descriptions
- `src/types/panchang.ts` / `src/types/kundali.ts` — existing types

## Multilingual Support

| Section | EN | HI | TA | BN |
|---------|----|----|----|----|
| Hook templates | New | New | Fallback EN | Fallback EN |
| Lagna text | LAGNA_DEEP | LAGNA_DEEP | Fallback EN | Fallback EN |
| Moon narrative | New | New | Fallback EN | Fallback EN |
| Nakshatra insight | nakshatra-details | nakshatra-details | nakshatra-details | nakshatra-details |
| Planet observations | PLANET_HOUSE_DEPTH (EN only) | Fallback EN | Fallback EN | Fallback EN |
| Dasha context | DASHA_EFFECTS | DASHA_EFFECTS | Fallback EN | Fallback EN |
| Dosha section | New | New | Fallback EN | Fallback EN |
| Connector phrases | New | New | Fallback EN | Fallback EN |
| UI labels | next-intl | next-intl | next-intl | next-intl |

Nakshatra details already have 10-language support — that section gets the best multilingual coverage automatically.

## What This Is NOT

- Not an AI reading (no API calls, no latency)
- Not a replacement for the Tippanni tab (which remains the deep technical reference)
- Not a replacement for the Personal Pandit domain cards (which cover life areas in detail)
- Not a horoscope prediction (no time-based forecasting beyond dasha context)

It is the **first thing you read** after generating a chart — the "here is who you are and what stands out" synthesis that orients you before diving into specifics.
