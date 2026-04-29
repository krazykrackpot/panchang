# Transits Page Redesign — Design Spec

**Date:** 2026-04-29
**Status:** Approved

## Overview

Redesign `/[locale]/transits` from a flat month-by-month list into a visual dashboard with two new sections:
1. **Hero Card** — Mini zodiac wheel (LiveSkyMap visual language) + info panel
2. **Timeline View** — Horizontal swimlane on desktop, vertical timeline on mobile

Replaces the current "laundry list" of ~80 identically-styled transit event rows with a layout that communicates visual hierarchy (Jupiter changing signs vs Sun entering Gemini) at a glance.

## Section 1: Hero Card — "What's Happening NOW"

Replaces the current 7 small planet chips with a two-column card:

### Left column: Mini zodiac wheel (SVG)
- Reuse visual language from `LiveSkyMap.tsx` (same colors, ring structure, planet dots)
- `viewBox="0 0 400 400"`, rendered at 280×280px desktop, 240×240px mobile
- Concentric rings: outer rashi ring (12 segments with 3-letter labels), planet track ring, center earth-cross
- Ring strokes: `#8a6d2b` at low opacity, matching LiveSkyMap
- Planet dots: filled circles `r=9` with glow filters, 2-letter abbreviation inside
- Planet colors from LiveSkyMap: Sun=#FF9500, Moon=#C0C0C0, Mars=#DC143C, Mercury=#50C878, Jupiter=#FFD700, Venus=#FF69B4, Saturn=#6B8DD6, Rahu=#B8860B, Ketu=#808080
- Positions computed from current transit data (which sign → which 30° sector)
- Non-interactive snapshot — clicking the wheel links to `/sky-map`
- Only show slow planets (Mars through Ketu, ids 2-8) — Sun and Moon move too fast to be meaningful here

### Right column: Info panel
- **Title:** "Planetary Positions" with date subtitle
- **Planet list:** 2-column grid of 7 items, each showing colored dot + planet name + current sign
- **Next Major Transit countdown:** Large number + "days" + event name (e.g., "Jupiter → Gemini")
  - Computed from `events` array: first future event with `significance === 'major'`
- **Personal insight bar** (conditional, only when `hasBirthData`): Purple-tinted bar showing house position from Moon sign. E.g., "Jupiter is in your 5th house — creativity peak"
  - Computed: `((planetSign - birthRashi + 12) % 12) + 1` → house number → one-line interpretation from a static HOUSE_EFFECTS lookup

### Layout
- Flex row on desktop (md+), flex column on mobile
- Card uses standard purple mega gradient: `from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27]`
- Shows only when `year === currentYear`

## Section 2: Timeline View

Replaces the entire month-by-month event list below the filters.

### Desktop (md+ breakpoint): Horizontal Swimlane

A CSS flex-based chart where each planet gets its own horizontal row. Time flows left→right (Jan→Dec).

**Structure:**
```
[Planet label (90px)] [────── bars spanning proportional widths ──────]
```

**Rows (top to bottom):**
1. Jupiter (slow, tall row 32px)
2. Saturn (slow, tall row 32px)
3. Rahu (slow, tall row 32px)
4. Ketu (slow, tall row 32px)
5. — 8px gap —
6. Mars (fast, short row 22px)
7. Venus (fast, short row 22px)
8. Mercury (fast, short row 22px)

Sun and Moon are excluded — they change signs every 1-2.5 days, producing 12+ tiny bars that add noise without insight.

**Bar rendering:**
- Each bar spans the duration of one sign transit, using `flex: <months>` proportional width
- Bar colors: per-planet (same as hero card), translucent fill + border
- Bar labels: sign name (abbreviated for short bars, full for long bars)
- Retrograde segments: hatched pattern overlay (`repeating-linear-gradient -45deg`)
- Hover: brightness increase + `scaleY(1.15)` + tooltip with exact dates

**Month headers:** 12 abbreviated month names evenly spaced above the bars.

**TODAY line:** Vertical gold line at the current date position. Label "TODAY" pinned at top. Positioned using `left: calc(90px + (100% - 90px) * dayOfYear / 365)`.

**Data transformation:**
The API returns individual transit events (planet changes sign on date X). To build swimlane bars:
1. Sort events by planet, then by date
2. For each planet, each pair of consecutive events defines one bar: start = event[i].date, end = event[i+1].date, sign = event[i].toSign
3. First bar starts Jan 1 (sign = first event's fromSign), last bar ends Dec 31
4. Compute bar flex value: `(endDate - startDate) / totalDaysInYear * 12`

**Horizontal scroll:** Container has `overflow-x: auto` with `min-width: 700px` on the inner content, so narrow desktop screens can scroll.

### Mobile (<md breakpoint): Vertical Timeline

A scrollable vertical timeline with month markers and event cards.

**Structure:**
- Left edge: 2px vertical gold gradient line
- Month markers: dots on the line + month name
- Event cards: indented from the line, stacked under each month

**Month marker:**
- Gold dot (12px) for current month, gray dot for others
- Month name in bold, "NOW" badge for current month

**Event cards:**
- Purple mega gradient background, gold border (stronger for major events)
- Layout: planet glyph (from `GrahaIconById`) + "Planet → Sign" title + date/duration meta + significance badge
- Major events get `border-color: rgba(212, 168, 83, 0.25)` and stronger gradient

**Empty months:** Omitted entirely (same as current behavior).

## What Stays Unchanged

- **Page title + subtitle** (h1 hero with gold gradient)
- **InfoBlock** ("What are Transits?" accordion)
- **Year selector** (< 2026 > arrows)
- **Stats bar** (total/major/planets counts)
- **Filters** (significance + planet chip toggles)
- **Mesha Sankranti section** at the bottom
- **Jupiter Vedha warning** — moved into the hero card info panel (below personal insight)
- **Ashtama Shani warning** — moved into the hero card info panel
- **API** (`/api/transits?year=`) — no changes, same data model

## What Gets Removed

- The flat month-by-month event list (lines 386-465 of current page)
- The current "Current Planetary Positions" grid of 7 small chips (replaced by hero card)

## Data Flow

1. Page loads → fetches `/api/transits?year=YYYY` → gets `TransitEvent[]`
2. `TransitEvent` has: `planetId, planetName, fromSign, fromSignName, toSign, toSignName, date, significance`
3. **Hero card:** derives current positions from events (most recent past event per slow planet) — same logic as existing `currentTransits` useMemo
4. **Swimlane:** transforms events into bars per planet (start/end/sign segments)
5. **Vertical timeline:** groups events by month (existing `eventsByMonth` logic)
6. Filters apply to both views

## Component Structure

All changes are within `src/app/[locale]/transits/page.tsx` (currently 516 lines). New sections:

- `TransitHeroCard` — inline component, ~120 lines (SVG wheel + info panel)
- `SwimlaneBars` — inline component, ~100 lines (bar computation + rendering)
- `buildSwimlaneBars(events)` — utility function, ~40 lines
- `VerticalTimeline` — inline component, ~80 lines (month markers + event cards)

Estimated final page size: ~550-600 lines (replacing ~80 lines of flat list with ~180 lines of new components, plus removing ~50 lines of the old chips grid).

## Responsive Behavior

| Breakpoint | Hero Card | Timeline |
|---|---|---|
| ≥768px (md) | Flex row (wheel + panel side by side) | Horizontal swimlane |
| <768px | Flex column (wheel on top, panel below) | Vertical timeline |

Both views use CSS-only responsive switching (`hidden md:block` / `md:hidden`). Both render from the same filtered data.

## Files to Modify

- **Modify:** `src/app/[locale]/transits/page.tsx` — replace current positions grid + event list with hero card + timeline
- **No new files** — everything stays in the single page component

## Mockup References

- Swimlane: `.superpowers/brainstorm/52411-1777447521/content/timeline-layout-v2.html`
- Hero card: `.superpowers/brainstorm/52411-1777447521/content/hero-card-v2.html`
