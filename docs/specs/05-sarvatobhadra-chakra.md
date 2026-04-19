# Feature Spec 05: Sarvatobhadra Chakra

**Tier:** 1 — High-value, unique, buildable in 2–3 days
**Priority:** 5 (tied with Sudarshana)
**Status:** Spec Complete

---

## What It Does

Renders the classical 9×9 Sarvatobhadra Chakra grid — a matrix mapping 28 nakshatras, 16 vowels, 7 weekdays, and 30 tithis — and overlays the user's birth nakshatra + current transiting planets to show vedha (obstruction) patterns and favorable/unfavorable days.

## Why It Matters

- **Zero competition:** "sarvatobhadra chakra calculator" has near-zero online results. Any digital implementation becomes the definitive resource.
- **Serious practitioner magnet:** this is a tool every classical jyotishi uses but can't find digitally. Sticky audience with high expertise.
- **SEO goldmine:** the keyword is entirely uncontested.
- **Visually striking:** the 9×9 grid with color-coded vedha patterns is inherently beautiful.

---

## Classical Foundation

The Sarvatobhadra Chakra is described in Narada Samhita and Brihat Samhita. It is a 9×9 grid (81 cells) arranged as:

- **Center cell:** Abhijit nakshatra (special 28th nakshatra)
- **28 nakshatras:** placed around the grid in a specific pattern
- **16 vowels (Svaras):** अ आ इ ई उ ऊ ए ऐ ओ औ अं अः ऋ ॠ ऌ ॡ
- **7 weekdays (Varas):** Sunday through Saturday
- **30 tithis:** Shukla 1-15, Krishna 1-15
- **4 corner cells:** Rashi directions (cardinal)

### Vedha Rules

When a transiting planet enters a nakshatra, it "strikes" (vedha) the cells that share a row, column, or diagonal with that nakshatra's cell. This affects:
- Other nakshatras on the vedha line → people born in those nakshatras
- Vowels on the vedha line → names starting with those letters
- Weekdays on the vedha line → activities on those days
- Tithis on the vedha line → those tithis become affected

**Benefic transit (Jupiter, Venus, Mercury, Moon):** vedha is favorable
**Malefic transit (Saturn, Mars, Rahu, Ketu, Sun):** vedha is obstructive

---

## Architecture

### Engine: `src/lib/chakra/sarvatobhadra.ts` (NEW)

```typescript
// The fixed 9×9 grid layout
interface SBCGrid {
  cells: SBCCell[][];           // 9×9
}

interface SBCCell {
  row: number;
  col: number;
  type: 'nakshatra' | 'vowel' | 'weekday' | 'tithi' | 'direction' | 'abhijit';
  value: string;                // nakshatra name, vowel character, etc.
  id?: number;                  // nakshatra ID (1-28) if applicable
}

interface SBCAnalysis {
  grid: SBCGrid;
  birthNakshatra: {
    id: number;
    name: Trilingual;
    cell: { row: number; col: number };
  };
  
  // Current transiting planets' vedha patterns
  transitVedhas: TransitVedha[];
  
  // Summary: which days/tithis/nakshatras are favorable/unfavorable right now
  favorableDays: string[];
  unfavorableDays: string[];
  favorableNakshatras: number[];    // IDs
  unfavorableNakshatras: number[];
  favorableTithis: number[];
  unfavorableTithis: number[];
  
  // Names affected (vowel vedha)
  favorableVowels: string[];
  unfavorableVowels: string[];
}

interface TransitVedha {
  planet: number;                   // 0-8
  planetName: Trilingual;
  currentNakshatra: number;         // 1-28
  nakshatraName: Trilingual;
  nakshatraCell: { row: number; col: number };
  isBenefic: boolean;
  vedhaLines: VedhaLine[];          // all cells struck
}

interface VedhaLine {
  direction: 'row' | 'column' | 'diagonal-ne' | 'diagonal-nw';
  cells: SBCCell[];
  affectedNakshatras: number[];
  affectedVowels: string[];
  affectedWeekdays: string[];
  affectedTithis: number[];
}

function generateSarvatobhadra(
  birthNakshatraId: number,
  transitPlanets: { planetId: number; nakshatraId: number }[],
  locale: string
): SBCAnalysis;
```

### Grid Layout (Classical)

The standard 9×9 layout (reading left-to-right, top-to-bottom):

```
Row 0: [Di] [T16] [V-ओ] [N14] [V-औ] [T01] [V-अं] [N21] [Di]
Row 1: [T15] [N07] [W-Fr] [N13] [W-Sa] [N20] [W-Su] [N27] [T02]
Row 2: [V-ए] [W-Th] [N06] [N12] [N19] [N26] [N28] [W-Mo] [V-अः]
Row 3: [N08] [N05] [N04] [N11] [N18] [N25] [N24] [N23] [N22]
Row 4: [V-ऐ] [W-We] [N03] [N10] [Abh] [N17] [N16] [W-Tu] [V-ऋ]
Row 5: ... (mirrored pattern continues)
```

(Exact classical placement from Narada Samhita — will be hardcoded as a constant.)

---

## UI Integration

### 1. New Page: `/sarvatobhadra`

```
┌────────────────────────────────────────────────────────┐
│  SARVATOBHADRA CHAKRA                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                          │
│  Your Birth Nakshatra: Rohini (★ highlighted in grid)    │
│  Date: April 17, 2026                                    │
│                                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │                                              │        │
│  │         [9×9 Interactive Grid]               │        │
│  │                                              │        │
│  │  Birth nakshatra: gold highlight             │        │
│  │  Benefic vedha: green lines/cells            │        │
│  │  Malefic vedha: red lines/cells              │        │
│  │  Neutral: dim default                        │        │
│  │                                              │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  CURRENT TRANSITS                                        │
│  ┌────────────────────────────────────────────────┐      │
│  │ ♃ Jupiter in Pushya → Benefic vedha on:        │      │
│  │   Nakshatras: Ashlesha, Punarvasu, Shravana    │      │
│  │   Days: Thursday, Monday                        │      │
│  │   Tithis: S3, S10, K3, K10                     │      │
│  │                                                  │      │
│  │ ♄ Saturn in Shatabhisha → Malefic vedha on:    │      │
│  │   Nakshatras: Dhanishta, P.Bhadra, Rohini (!)  │      │
│  │   ⚠ YOUR nakshatra is under Saturn vedha        │      │
│  │   Days: Saturday, Tuesday                        │      │
│  │   Tithis: K7, K14, S7, S14                      │      │
│  └────────────────────────────────────────────────┘      │
│                                                          │
│  SUMMARY FOR YOU                                         │
│  ┌────────────────────────────────────────────────┐      │
│  │ Favorable days this week: Thu, Mon, Wed         │      │
│  │ Avoid: Sat, Tue (Saturn + Mars vedha)           │      │
│  │ Best tithis: S3, S10                            │      │
│  │ Caution tithis: K7, K14                         │      │
│  └────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────┘
```

### 2. Interactive Features

- **Hover on grid cell:** highlight all vedha lines passing through it
- **Hover on planet row:** show vedha pattern on the grid
- **Date picker:** change transit date to see vedha patterns for any date
- **Birth nakshatra selector:** for anonymous users or exploration
- **Toggle:** show/hide specific planets' vedha lines
- **Mobile:** grid scales down with pinch-zoom; summary moves above grid

### 3. Navigation

- Add to **Tools** dropdown in navbar
- Cross-link from nakshatra deep dive pages
- Cross-link from panchang page (daily nakshatra → "See its Sarvatobhadra impact")

---

## Implementation Files

| File | Action | Description |
|------|--------|-------------|
| `src/lib/chakra/sarvatobhadra.ts` | **NEW** | Grid layout + vedha computation |
| `src/lib/chakra/sbc-grid-layout.ts` | **NEW** | Classical 9×9 cell definitions |
| `src/lib/chakra/sbc-types.ts` | **NEW** | TypeScript interfaces |
| `src/components/chakra/SarvatobhadraGrid.tsx` | **NEW** | Interactive 9×9 SVG grid |
| `src/components/chakra/VedhaAnalysis.tsx` | **NEW** | Transit vedha summary |
| `src/app/[locale]/sarvatobhadra/page.tsx` | **NEW** | Page |
| `src/app/[locale]/sarvatobhadra/layout.tsx` | **NEW** | SEO metadata |
| `src/lib/__tests__/sarvatobhadra.test.ts` | **NEW** | Unit tests |
| `e2e/sarvatobhadra.spec.ts` | **NEW** | E2E tests |
| `src/app/sitemap.ts` | **EDIT** | Add sarvatobhadra with alternates |
| `src/components/layout/Navbar.tsx` | **EDIT** | Add to Tools dropdown |

---

## Learning Page: `/learn/advanced/sarvatobhadra`

### Content Sections

1. **What is Sarvatobhadra Chakra?**
   - Origin: Narada Samhita, Brihat Samhita
   - The "all-auspicious wheel" — a master grid for transit analysis
   - How it encodes the relationship between nakshatras, sound (vowels), time (weekdays, tithis), and space (directions)

2. **Understanding the 9×9 Grid**
   - Nakshatra placement pattern (why specific cells)
   - Vowel rows: the Vedic connection between sound and cosmic energy
   - Weekday columns: planetary rulership of days
   - Tithi borders: lunar phase influence
   - Abhijit at center: the "hidden 28th nakshatra"

3. **Vedha: The Concept of Obstruction**
   - How transiting planets "strike" cells along rows, columns, diagonals
   - Benefic vedha (Jupiter/Venus/Mercury/Moon): enhancement
   - Malefic vedha (Saturn/Mars/Rahu/Ketu/Sun): obstruction
   - Multiple vedhas on the same cell: compound effects

4. **Practical Use: Planning Your Week**
   - Identifying favorable weekdays from the chakra
   - Matching tithis to vedha patterns for muhurta selection
   - Names and vowels: why traditional naming follows nakshatra syllables

5. **Personalization**
   - Your birth nakshatra as the focal point
   - How current transits create your personal favorable/unfavorable map
   - Comparing with Tarabala and Chandrabala for confirmation

---

## Edge Cases

- **Abhijit nakshatra:** only used in SBC, not in regular 27-nakshatra system. Transit through Abhijit is between Uttara Ashadha and Shravana — compute from longitude range.
- **Multiple planets in same nakshatra:** stack vedha effects — if Jupiter and Saturn both have vedha on a cell, the net effect depends on relative strength.
- **Retrograde planets:** still in the nakshatra they occupy — no special handling needed for the grid, but note retrograde status in the analysis.
- **Mobile layout:** the 9×9 grid needs minimum 320px width. Below that, show a simplified list view with vedha summaries.

---

## Effort Estimate

- Grid layout data + vedha engine: 4 hours
- Interactive SVG grid component: 8 hours
- Vedha analysis + interpretation: 3 hours
- Page + navigation integration: 2 hours
- Tests: 3 hours
- Learning page: 2 hours
- **Total: ~2.5-3 days**
