# Roadmap — Remaining Items

Items parked for future sessions. Ordered by impact.

## Done (verified Apr 28 2026)

- [x] **Pre-compute tithi tables** — 168 JSON files (55 cities × 3 years + UTC). Eliminates CPU for known cities.
- [x] **Swiss Ephemeris integration** — sweph@2.10.3 installed, wrapper complete, all planets + ayanamshas. Meeus fallback wired. Working in production (0 warnings = sweph active).
- [x] **Cmd+K command palette** — SearchModal.tsx (240 lines), Cmd+K/Ctrl+K shortcut, fuzzy search across 300+ pages.
- [x] **Kaal Sarpa / Mangal Dosha learn pages** — doshas/page.tsx (46KB) + doshas-detailed/page.tsx (62KB). All 12 Kaal Sarpa sub-types, cancellation codes, remedies.
- [x] **Tools landing page** — 20 tarot cards, 4×5 grid, multilingual.
- [x] **Edge caching** — panchang 12h, tithi-table 7d, static data 7d. ~90% CPU reduction.

## Performance & Infrastructure

- [ ] **Hetzner + Coolify migration** — See `docs/INFRASTRUCTURE.md` for full plan. CAX21 (~€7/mo) + Coolify + Cloudflare. Target: after 1-2 months stable on Vercel Pro.

## Computation Accuracy

- [ ] **True node vs mean node toggle** — Currently uses mean Rahu/Ketu (SE_MEAN_NODE). True nodes oscillate and are preferred by some traditions. sweph supports both — just needs a user preference toggle.
- [ ] **Broader Meeus fallback warnings** — When sweph is unavailable, only Graha Yuddha warns. Mars can be 22° off — users should see a general accuracy warning.
- [ ] **Ayanamsha fallback warnings** — true_revati/true_pushya/galactic_center silently degrade to Lahiri in Meeus mode.

## UI/UX

- [ ] **Landing page redesign** — Cosmic Portal hero, scroll cinema, micro-interactions, editorial typography. Spec parked at `.superpowers/brainstorm/9877-1775204001/content/landing-redesign.html`.

## Content & SEO

- [ ] **GSC Performance review** — Revisit ~2026-05-28 with 6 weeks of Google Search Console data. Decide which programmatic SEO pages to keep/prune.
- [ ] **Regional calendar deep pages** — Tamil, Bengali, Mithila panchangs with region-specific festivals and naming conventions.
- [ ] **Update docs/ASTRONOMICAL_CALCULATIONS.md** — Still describes pure-Meeus architecture. Needs to reflect sweph primary + Meeus fallback reality.
