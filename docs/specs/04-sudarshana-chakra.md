# Feature Spec 04: Sudarshana Chakra (Triple-Chart Overlay)

**Tier:** 1 — High-value, unique, buildable in 2 days
**Priority:** 5
**Status:** Spec Complete

---

## What It Does

Renders a three-ring concentric chart showing the Lagna chart (outermost), Moon chart (middle), and Sun chart (innermost) overlaid. Classical technique from Brihat Parashara Hora Shastra for comprehensive event timing — an event is confirmed only when all three charts agree.

## Why It Matters

- **Visually stunning:** three concentric rings in dark+gold theme = the most impressive chart visualization on any Vedic astrology website.
- **Unique differentiator:** almost no web app implements this. JHora has it as a static grid; we make it interactive.
- **Deeply classical:** serious practitioners use Sudarshana Chakra for annual predictions (Sudarshana Dasha). It's the missing piece between basic chart reading and advanced timing.

---

## Classical Foundation

The Sudarshana Chakra ("auspicious wheel") was described by Parashara:

1. **Outer ring — Lagna Chart (D1):** houses counted from the Ascendant sign. Shows the material framework of life.
2. **Middle ring — Chandra (Moon) Chart:** the same planets, but houses re-counted from the Moon sign as the 1st house. Shows the emotional/mental framework.
3. **Inner ring — Surya (Sun) Chart:** houses re-counted from the Sun sign as the 1st house. Shows the soul-level framework.

**Sudarshana Dasha:** Each house = 1 year of life. Year N activates the Nth house in all three charts simultaneously. A planet in the 5th house from Lagna, 3rd from Moon, and 7th from Sun tells a multi-layered story about age 5/15/25/35...

---

## Architecture

### Engine: `src/lib/kundali/sudarshana.ts` (NEW)

```typescript
interface SudarshanaData {
  lagnaChart: SudarshanaRing;   // houses from ascendant
  chandraChart: SudarshanaRing; // houses from Moon sign
  suryaChart: SudarshanaRing;   // houses from Sun sign
  
  // Sudarshana Dasha (annual progression)
  currentYear: number;           // user's current age
  dashaAnalysis: SudarshanaDashaYear[];
}

interface SudarshanaRing {
  startSign: number;            // 1-12 (rashi ID)
  startSignName: Trilingual;
  houses: SudarshanaHouse[];    // 12 houses
}

interface SudarshanaHouse {
  houseNumber: number;          // 1-12
  sign: number;                 // rashi ID
  signName: Trilingual;
  planets: SudarshanaPlanet[];  // planets in this house
}

interface SudarshanaPlanet {
  id: number;                   // 0-8
  name: Trilingual;
  degree: number;
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: 'exalted' | 'own' | 'friend' | 'neutral' | 'enemy' | 'debilitated';
}

interface SudarshanaDashaYear {
  age: number;
  lagnaHouse: number;           // which house is activated in lagna chart
  chandraHouse: number;         // which house is activated in moon chart
  suryaHouse: number;           // which house is activated in sun chart
  lagnaLord: Trilingual;        // lord of activated lagna house
  chandraLord: Trilingual;
  suryaLord: Trilingual;
  interpretation: string;       // combined reading
}

function generateSudarshana(chart: KundaliData, locale: string): SudarshanaData;
```

The data already exists — we just re-index `chart.planets` from three different starting signs.

### SVG Component: Concentric Rings

```
        ╭──────────────────────╮
       │  ╭────────────────╮   │
       │ │  ╭──────────╮   │   │
       │ │ │            │   │   │
       │ │ │   SURYA    │   │   │
       │ │ │   (Sun)    │   │   │
       │ │ │            │   │   │
       │ │  ╰──────────╯   │   │
       │ │    CHANDRA       │   │
       │ │    (Moon)        │   │
       │  ╰────────────────╯   │
       │     LAGNA              │
       │     (Ascendant)        │
        ╰──────────────────────╯
```

Each ring is divided into 12 segments (30° each). Signs are labeled. Planets are placed as gold dots/glyphs within their segment. Hover shows planet details.

The age-based highlight shows which segment is "active" for the current year in each ring — three highlighted segments across the three rings.

---

## UI Integration

### 1. Kundali Page — New "Sudarshana" Tab

```
┌──────────────────────────────────────────────────────┐
│  Patrika | Dashas | Yogas | Remedies | Sudarshana    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                        │
│  Age slider: [●━━━━━━━━━━━━━━━━━━━━━━] 32 years       │
│                                                        │
│  ┌──────────────────────────────────┐                  │
│  │                                  │                  │
│  │     [Sudarshana Chakra SVG]      │                  │
│  │     Three concentric rings       │                  │
│  │     Active houses highlighted    │                  │
│  │                                  │                  │
│  └──────────────────────────────────┘                  │
│                                                        │
│  YEAR 32 ANALYSIS                                      │
│  ┌────────────────────────────────────────────────┐    │
│  │ Lagna: 8th house (Scorpio) — Lord: Mars        │    │
│  │ Moon:  4th house (Cancer) — Lord: Moon          │    │
│  │ Sun:   10th house (Capricorn) — Lord: Saturn    │    │
│  │                                                  │    │
│  │ Combined reading: Transformation (8th) meets     │    │
│  │ emotional grounding (4th) and career ambition    │    │
│  │ (10th). A year of deep inner change manifesting  │    │
│  │ as professional restructuring...                  │    │
│  └────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### 2. Interactive Features

- **Age slider:** drag to see which houses are active at any age (1-120)
- **Hover on planet:** tooltip with degree, dignity, aspects
- **Click on house segment:** expand interpretation for that house in that ring
- **Ring toggle:** click ring label to solo-view one chart
- **Animation:** on age change, the highlight sweeps clockwise to the next segment

---

## Implementation Files

| File | Action | Description |
|------|--------|-------------|
| `src/lib/kundali/sudarshana.ts` | **NEW** | Sudarshana data generator |
| `src/components/kundali/SudarshanaChakra.tsx` | **NEW** | SVG three-ring chart component |
| `src/components/kundali/SudarshanaTab.tsx` | **NEW** | Tab content with slider + analysis |
| `src/app/[locale]/kundali/page.tsx` | **EDIT** | Add Sudarshana tab |
| `src/lib/__tests__/sudarshana.test.ts` | **NEW** | Unit tests |
| `e2e/sudarshana-chakra.spec.ts` | **NEW** | E2E tests |

---

## Learning Page: `/learn/advanced/sudarshana`

### Content Sections

1. **What is Sudarshana Chakra?**
   - Origin in Brihat Parashara Hora Shastra
   - The three perspectives: body (Lagna), mind (Moon), soul (Sun)
   - Why single-chart analysis is incomplete

2. **Reading the Three Rings**
   - Lagna chart: material life, physical body, worldly affairs
   - Moon chart: emotional state, mental health, relationships
   - Sun chart: dharma, authority, soul's purpose, father

3. **Sudarshana Dasha (Annual Progression)**
   - Each house = 1 year, cycling every 12 years
   - How to read the active houses at any age
   - Convergence years: when all three rings activate favorable houses simultaneously

4. **Practical Application**
   - Annual predictions using Sudarshana
   - Comparing with Vimshottari Dasha for confirmation
   - Why three-chart agreement makes predictions more reliable
   - Historical example: Parashara's own teaching on combined analysis

5. **Significance & Personalization**
   - How your three starting signs create a unique pattern
   - Years of convergence in your chart (automatically highlighted)
   - Using this alongside transit analysis for complete timing

---

## Edge Cases

- **Same sign for Lagna/Moon/Sun:** rings overlap in starting sign — visually distinguish with opacity/pattern
- **Many planets in one house:** stack vertically, reduce glyph size
- **Age > 120:** cycle back (house = age % 12 + 1)
- **Mobile responsive:** rings scale down; consider stacked single-ring view for <640px with tab toggle

---

## Effort Estimate

- Sudarshana engine (trivial — re-index existing data): 1 hour
- SVG component (the bulk of the work): 8 hours
- Age slider + dasha analysis: 3 hours
- Tests: 2 hours
- Learning page: 2 hours
- **Total: ~2 days**
