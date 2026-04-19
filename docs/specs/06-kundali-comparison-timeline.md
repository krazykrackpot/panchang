# Feature Spec 06: Kundali Comparison Timeline

**Tier:** 2 — Strong retention, 3 days
**Priority:** Deferred (after Tier 1 + custom Tier 3 priorities)
**Status:** Spec Complete

---

## What It Does

Takes two saved birth charts and overlays their Vimshottari dasha timelines side-by-side. Highlights periods of alignment (both in favorable dashas) and tension (one under Saturn while the other thrives). Visualizes the temporal rhythm of any two-person relationship.

## Why It Matters

- **No app does this.** The matching page gives a static score; this shows a dynamic timeline of relationship evolution.
- **Extends matching:** users who run Ashta Kuta matching naturally want to see "when will things be good/tough?"
- **Retention:** users return to check alignment windows before major joint decisions.

---

## Core Concept

For any two charts (couple, parent-child, business partners):

1. Extract both Vimshottari dasha timelines (Maha + Antar levels)
2. Classify each dasha period as favorable/neutral/challenging based on:
   - Functional nature of dasha lord for that lagna
   - Dasha lord's dignity (exalted/debilitated/combustion)
   - Dasha lord's house placement (benefic houses 1/5/9/4/7/10 vs dusthanas 6/8/12)
3. Overlay the two timelines and identify:
   - **Green windows:** both charts in favorable periods → best times for joint ventures
   - **Red windows:** one or both in challenging periods → caution
   - **Mixed windows:** one favorable, one challenging → imbalanced dynamics

## Page: `/kundali/compare`

- Select two saved charts (dropdowns or chart cards)
- Dual horizontal dasha bars (like Gantt charts) with color coding
- Scrollable timeline spanning the overlap of both lives
- Hover on any period: detailed dasha lord analysis for both charts
- Summary: "Next 5 years outlook" with identified alignment windows

## Learning Page: `/learn/advanced/comparison-timeline`

Topics: dasha compatibility theory, why timing matters more than static scores, Parashara's guidance on matching dashas for muhurta selection, compound dasha analysis for family dynamics.

## Effort: ~3 days
