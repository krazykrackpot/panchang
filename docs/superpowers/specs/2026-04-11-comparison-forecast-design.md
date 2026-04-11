# Kundali Comparison + Annual Forecast Report — Design Spec

> **Date:** 2026-04-11
> **Status:** Approved for implementation

---

## Feature 9: Kundali Comparison — Enhanced

### Current State
`/kundali/compare` exists with basic side-by-side charts, planet position table, and simple synastry aspects (conjunction, opposition, trine, square, sextile with orbs). Gaps: no chart overlay, no saved chart integration, no dasha alignment, no house-lord analysis, no Navamsha comparison.

### Goal
Transform the comparison page into a comprehensive relationship analysis tool that goes beyond Ashta Kuta scoring.

### URL
`/[locale]/kundali/compare` (enhance existing page)

### Data Flow
1. User selects two charts — from saved charts dropdown OR enters new birth details
2. Both charts fetched via `/api/kundali` in parallel (already works)
3. Client computes synastry, overlay data, dasha alignment from returned KundaliData

### 5 Tabs

#### Tab 1: Chart Overlay
- Single chart view with Chart A planets in solid style, Chart B planets in outlined/translucent style
- **Key:** ChartNorth and ChartSouth already accept `transitData?: ChartData` prop for overlay rendering — pass Chart B's `.chart` as `transitData`
- Toggle: "Show A on B" vs "Show B on A" (swap base vs overlay)
- Toggle: Rashi chart / Navamsha chart
- House click: highlight to see both charts' planets + lords for that house
- Legend: solid = Chart A, outlined = Chart B

#### Tab 2: Planet-by-Planet
- Enhanced comparison table for all 9 planets
- Each row: sign, degree, nakshatra, pada, house, dignity, retrograde — side by side
- Color coding: green = same sign, amber = trine signs (1-5-9), red = 6-8 relationship
- Expandable: click a planet to see its synastry aspects with the other chart

#### Tab 3: Synastry Aspects
- Desktop: 9×9 visual aspect grid (Chart A rows × Chart B columns)
- Mobile: sorted list by tightest orb (grid is unusable on small screens)
- Cell icons: ☌ conjunction, ☍ opposition, △ trine, □ square, ⚹ sextile
- Color: green = harmonious (trine, sextile, benefic conjunction), red = tense (square, opposition, malefic conjunction)
- Click cell: exact orb, interpretation, connected houses
- Summary: total harmonious vs tense count, dominant pattern

#### Tab 4: Dasha Alignment
- Horizontal stacked timeline: Chart A dashas on top, Chart B below
- Default view: ±10 years from current date (expandable to full 120-year)
- Highlight overlapping same-planet periods
- "Now" marker with current period details
- Click segment: planet lord, sub-period, compatibility of both lords (natural friendship)
- Key insight card: "When both charts activate the same planet, that planet's themes dominate the relationship"

#### Tab 5: Compatibility Deep Dive
- Ashta Kuta score (computed from Moon nakshatra/rashi already in KundaliData)
- Mangal Dosha check for both (from tippanni doshas)
- 7th house lord comparison: placement and dignity
- Venus placement comparison (relationship karaka)
- Navamsha lagna comparison
- Combined verdict

### Saved Chart Integration
- Two dropdowns at top: "Select from saved charts" + "+ Enter new" option
- Authenticated users see their saved charts; anonymous users see only "Enter new"
- Primary chart pre-selected as Chart A if available

### Design Decisions
- No composite/midpoint chart — YAGNI, overlay + synastry covers core use case
- Dasha timeline limited to ±10yr default to prevent visual overload
- Synastry grid desktop-only; list on mobile

---

## Feature 10: Annual Forecast Report

### Goal
A single comprehensive page weaving Varshaphal + Dasha + Transits + Ashtakavarga into one narrative annual prediction with monthly granularity.

### URL
`/[locale]/annual-forecast` (new page)

### Data Flow
1. User selects saved chart (or enters birth details) + year
2. Parallel API calls: `/api/varshaphal` (solar return) + `/api/kundali` (natal)
3. Client engine computes month-by-month transit positions, dasha periods, SAV scores

### Page Sections

#### Section 1: Year Overview Card
- Year lord (Varsheshvara) with planet icon + meaning
- Muntha sign + house + one-line interpretation
- Current Maha/Antar dasha with dates
- Sade Sati status badge (if applicable)
- Year rating: breakdown of component scores (transit SAV avg, dasha lord dignity, Muntha house, Varsheshvara strength) — NOT a single opaque number

#### Section 2: Solar Return Chart
- Varshaphal chart via ChartNorth/South
- Toggle overlay: natal planets as `transitData` on varshaphal chart
- Tajika Yogas with favorable/unfavorable badges
- 16 Sahams: degree, sign, house, one-line meaning

#### Section 3: Monthly Timeline
- 12 cards (horizontal scroll on mobile, grid on desktop)
- Per month:
  - Slow planet positions (Saturn, Jupiter, Rahu, Ketu) with house from lagna
  - SAV bindu score for each slow planet's transit sign
  - Active Mudda Dasha sub-period
  - Significant events: sign change, retrograde start/end, eclipse
  - Monthly outlook: favorable / mixed / challenging (from SAV + dasha dignity)
  - 2-3 sentence narrative driven by actual computed positions

#### Section 4: Transit Impact Analysis
- Per slow planet (Saturn, Jupiter, Rahu, Ketu):
  - Current sign + house from lagna
  - SAV bindu score
  - Sign change date if changing this year
  - Vedic drishti aspects to natal planets (7th all; +3/10 Saturn; +5/9 Jupiter; +5/9 Rahu)
  - Impact interpretation per house theme

#### Section 5: Dasha Narrative
- Current Maha Dasha lord: dignity, house, aspects — dominant life themes
- Current Antar Dasha lord: same, framed as "immediate focus"
- Upcoming Antar transitions this year with dates
- Maha Dasha change alert if applicable
- Cross-reference: dasha lords' relationship with active transit planets

#### Section 6: Key Dates
- Grouped by quarter (not a calendar grid — simpler, equally useful)
- Items: dasha transitions, planet sign changes, retrograde periods, eclipses affecting chart
- Each with date + one-line significance

#### Section 7: Remedies & Guidance
- Top 3 gemstones based on weakest planets this year
- Mantras for dasha lords
- Favorable activities per quarter
- Cautionary periods

### PDF Export
- "Download Full Report" button
- jsPDF multi-page: cover (name/year/chart), overview, monthly breakdown, transits, dashas, remedies
- Progressive generation with progress indicator

### Design Decisions
- Monthly transit batch-computed in one pass (12 months × midpoint positions), cached via SwEph memoization
- Year rating is a breakdown, not a single star score — avoids subjectivity
- Key dates as quarterly lists, not visual calendar (complexity not justified)
- No overlap with tippanni: annual forecast has monthly granularity, solar return chart, Tajika yogas, Mudda Dasha — none in tippanni
- "Compare with last year" toggle: shows previous year's Varsheshvara, Muntha, dasha alongside current

---

## File Plan

### New Files
| File | Purpose |
|------|---------|
| `src/app/[locale]/annual-forecast/page.tsx` | Annual forecast page |
| `src/lib/forecast/annual-engine.ts` | Orchestrates all data into structured forecast |
| `src/lib/forecast/monthly-transit.ts` | Month-by-month slow planet positions + SAV |
| `src/lib/forecast/dasha-narrative.ts` | Dasha lord interpretation generation |
| `src/lib/forecast/year-rating.ts` | Computes year quality breakdown |
| `src/lib/forecast/pdf-report.ts` | jsPDF multi-page report generation |

### Modified Files
| File | Change |
|------|--------|
| `src/app/[locale]/kundali/compare/page.tsx` | Major: add 5 tabs, overlay, dasha timeline, saved chart integration |
| `src/lib/transit/personal-transits.ts` | Add `computeMonthlyTransits(ascSign, savTable, year)` |
| `src/components/layout/Navbar.tsx` | Add Annual Forecast to Tools dropdown |
| `src/app/sitemap.ts` | Add annual-forecast route |

### No New Dependencies
Everything builds on existing engines: varshaphal, dasha, transit, ashtakavarga, eclipse, tippanni, jsPDF.
