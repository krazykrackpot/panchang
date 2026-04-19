# Feature Roadmap — Build Order & Status

Last updated: 2026-04-17

---

## Build Order

| # | Feature | Spec | Days | Status | Depends On |
|---|---------|------|------|--------|------------|
| **Phase 1 — Tier 1 (High-value, unique)** |||||
| 1 | Vedic Calendar Sync (iCal) | [01](./01-vedic-calendar-sync.md) | 1.5 | TODO | — |
| 2 | Gemstone & Mantra Recs | [03](./03-gemstone-mantra-recs.md) | 2 | TODO | — |
| 3 | Eclipse Impact on Your Chart | [02](./02-eclipse-impact-chart.md) | 2 | TODO | — |
| 4 | Sudarshana Chakra | [04](./04-sudarshana-chakra.md) | 2 | TODO | — |
| 5 | Sarvatobhadra Chakra | [05](./05-sarvatobhadra-chakra.md) | 3 | TODO | — |
| **Phase 2 — Custom Tier 3 Priorities** |||||
| 6 | Nadi Amsha (D-150) | [14](./14-nadi-amsha.md) | 3 | TODO | — |
| 7 | Tajika Yoga Engine (16 yogas) | [15](./15-tajika-yoga-engine.md) | 2.5 | TODO | — |
| 8 | Higher Divisional Charts UI | [13](./13-higher-divisional-charts.md) | 3 | TODO | — |
| 9 | Ashtottari Dasha | [11](./11-ashtottari-dasha.md) | 2 | TODO | — |
| 10 | Detailed Compatibility Report | [08](./08-detailed-compatibility-report.md) | 5 | TODO | — |
| **Phase 3 — Remaining Tier 2 (when time permits)** |||||
| 11 | Kundali Comparison Timeline | [06](./06-kundali-comparison-timeline.md) | 3 | TODO | — |
| 12 | Personalized Daily Push | [07](./07-personalized-daily-push.md) | 2 | TODO | — |
| 13 | Hora Calculator | [09](./09-hora-calculator.md) | 1 | TODO | — |
| 14 | Live Prashna with AI | [10](./10-live-prashna-ai.md) | 3 | TODO | — |
| 15 | Yogini Dasha | [12](./12-yogini-dasha.md) | 1.5 | TODO | — |

---

## Phase 1 Implementation Checklist (Tier 1)

Each feature MUST meet these criteria before marking complete:

- [ ] Engine/computation code with unit tests (`npx vitest run`)
- [ ] UI components integrated into existing pages (not orphaned)
- [ ] Learning page with full content (all 10 locales)
- [ ] E2E test coverage (`e2e/*.spec.ts`)
- [ ] Added to sitemap with multilingual alternates
- [ ] Added to navbar (if top-level tool) or kundali tabs (if chart feature)
- [ ] Cross-linked from related pages
- [ ] `npx tsc --noEmit -p tsconfig.build-check.json` passes
- [ ] `npx vitest run` passes
- [ ] `npx next build` succeeds with 0 errors
- [ ] Verified in running browser

---

## Total Estimated Effort

| Phase | Features | Est. Days |
|-------|----------|-----------|
| Phase 1 | 5 features | ~10.5 days |
| Phase 2 | 5 features | ~15.5 days |
| Phase 3 | 5 features | ~10.5 days |
| **Total** | **15 features** | **~36.5 days** |

---

## Architecture Notes

### Shared Infrastructure (already exists)
- Kundali engine: `src/lib/kundali/` — full chart computation including all 17 divisional charts
- Eclipse engine: `src/lib/calendar/eclipse-compute.ts` + `eclipse-data.ts` (2024-2035)
- Festival engine: `src/lib/calendar/festival-generator.ts`
- Dasha engine: `src/lib/kundali/dasha.ts` + `additional-dashas.ts` (19 systems)
- Shadbala engine: `src/lib/kundali/shadbala.ts`
- Matching engine: `src/lib/matching/ashta-kuta.ts`
- Push notification: `src/lib/push/send-push.ts`
- Varshaphal engine: `src/lib/varshaphal/` (Solar Return + partial Tajika)
- Chart rendering: `ChartNorth.tsx`, `ChartSouth.tsx`
- i18n: `next-intl` with 10 locales

### New Modules to Create
- `src/lib/remedies/` — gemstone + mantra engine (spec 03)
- `src/lib/eclipse/` — eclipse-chart impact engine (spec 02)
- `src/lib/calendar/ical-generator.ts` — iCal RFC 5545 builder (spec 01)
- `src/lib/chakra/` — Sarvatobhadra engine (spec 05)
- `src/lib/kundali/sudarshana.ts` — Sudarshana data (spec 04)
- `src/lib/kundali/nadi-amsha.ts` — D-150 computation (spec 14)
- `src/lib/kundali/ashtottari-dasha.ts` — 108-year dasha (spec 11)
- `src/lib/kundali/yogini-dasha.ts` — 36-year dasha (spec 12)
