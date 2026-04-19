# Feature Spec 13: Higher Divisional Charts (D3–D60 Display)

**Tier:** 3 — Deep classical
**Priority:** 3rd in custom order (after 14, 15)
**Status:** Spec Complete

---

## What It Does

The computation engine already calculates all 17 divisional charts (D2 through D60) via `calculateDivisionalChart()`. This feature surfaces them in the UI with dedicated chart rendering, house-by-house analysis, and interpretive commentary for each division.

## Why It Matters

- **Computation already done.** The engine in `kundali-calc.ts` (line 429+) calculates all 17 vargas. They're stored in `KundaliData.divisionalCharts`. We just need UI.
- **Professional differentiator:** D10 (career), D7 (children), D24 (education) are the most-asked divisional charts after D9.
- **Vimshopaka already weights them:** the strength analysis (`vimshopaka.ts`) already scores planets across all vargas — we just need to show the charts.

---

## Priority Divisions (most asked)

| Chart | Name | Life Area | Weight in Vimshopaka |
|-------|------|-----------|---------------------|
| D1 | Rashi | Overall life | 3.5 |
| D9 | Navamsha | Marriage, dharma, inner self | 3.0 |
| D10 | Dasamsha | Career, profession, status | 1.5 |
| D7 | Saptamsha | Children, progeny | 0.5 |
| D3 | Drekkana | Siblings, courage, initiative | 1.0 |
| D12 | Dwadasamsha | Parents, ancestral karma | 0.5 |
| D24 | Chaturvimshamsha | Education, learning | 0.5 |
| D30 | Trimshamsha | Misfortunes, challenges | 1.0 |
| D60 | Shashtiamsha | Past-life karma (most precise) | 4.0 |
| D2 | Hora | Wealth | 1.0 |
| D4 | Chaturthamsha | Property, fixed assets | 0.5 |
| D16 | Shodasamsha | Vehicles, comforts, luxuries | 2.0 |
| D20 | Vimshamsha | Spiritual progress | 0.5 |
| D27 | Nakshatramsha | Strengths, weaknesses | 0.5 |
| D40 | Khavedamsha | Maternal lineage effects | 0.5 |
| D45 | Akshavedamsha | Paternal lineage effects | 0.5 |

## UI: New "Vargas" Tab on Kundali Page

### Layout

```
┌──────────────────────────────────────────────────┐
│  Vargas Tab                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                    │
│  Select Division:                                  │
│  [D1] [D2] [D3] [D4] [D7] [D9] [D10] [D12]      │
│  [D16] [D20] [D24] [D27] [D30] [D40] [D45] [D60] │
│                                                    │
│  D10 — DASAMSHA (Career & Profession)              │
│  ┌──────────────────────┬─────────────────────┐    │
│  │                      │ D10 Analysis:       │    │
│  │   [Chart Rendering]  │                     │    │
│  │   North/South style  │ Ascendant: Virgo    │    │
│  │                      │ 10th Lord: Mercury  │    │
│  │                      │ in 5th → creative   │    │
│  │                      │ career, consulting  │    │
│  │                      │                     │    │
│  │                      │ Strong planets:     │    │
│  │                      │ Jupiter in 1st      │    │
│  │                      │ (leadership)        │    │
│  └──────────────────────┴─────────────────────┘    │
└──────────────────────────────────────────────────┘
```

### Interpretation Engine

For each divisional chart, provide:
1. **Division meaning:** what life area it governs
2. **Ascendant sign:** the rising sign in this division
3. **Key house analysis:** the most relevant house for this division (e.g., 10th house in D10)
4. **Planet placements:** dignity of planets in this division
5. **Vargottama check:** planets occupying the same sign in D1 and this division
6. **Vimshopaka contribution:** how this division contributes to overall planetary strength

## Implementation Files

| File | Action | Description |
|------|--------|-------------|
| `src/components/kundali/VargasTab.tsx` | **NEW** | Tab with division selector + chart + analysis |
| `src/lib/kundali/varga-interpretations.ts` | **NEW** | Division-specific interpretation data |
| `src/app/[locale]/kundali/page.tsx` | **EDIT** | Add Vargas tab |
| `e2e/divisional-charts.spec.ts` | **NEW** | E2E tests |

## Learning Page: `/learn/vargas`

Topics: Parashara's 16 divisions, why different life areas have different charts, vargottama significance, how Vimshopaka Bala uses all 16 divisions, practical reading of D10/D7/D60.

## Effort: ~2-3 days (computation exists — UI + interpretations are the work)
