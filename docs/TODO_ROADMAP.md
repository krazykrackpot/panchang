# Roadmap — Remaining Items

Updated: 2026-04-29

## Done (verified)

- [x] Pre-compute tithi tables (168 JSON files, 55 cities × 3 years)
- [x] Swiss Ephemeris integration (sweph@2.10.3, all planets + ayanamshas, working in production)
- [x] Cmd+K command palette (SearchModal, fuzzy search 300+ pages)
- [x] Kaal Sarpa / Mangal Dosha learn pages (108KB of content, 12 sub-types)
- [x] Tools landing page (20 tarot cards, 4×5 grid, multilingual)
- [x] Edge caching (panchang 12h, tithi-table 7d, ~90% CPU reduction)
- [x] True node vs mean node toggle (user preference in Settings)
- [x] Sudarshana Chakra redesign (900px, colored planet glyphs, full names)
- [x] Ayanamsha tab with holistic impact analysis
- [x] Birth poster mini chart + card scaling fix
- [x] SEO cross-links (festival→learn hubs, tool↔learn bi-directional)
- [x] JSON-LD gaps (tools layout, HowTo on sign-calculator, Article on festival-rules)
- [x] Personalized birth chart OG image (viral sharing card)
- [x] OG images for tools, festivals, calendar, learn/tithis
- [x] IndexNow daily URL submission (228 URLs/day at 00:05 UTC)
- [x] Share Your Chart button (shares actual PNG image, not just link)
- [x] Learn sidebar REF integration (45 reference articles in sidebar)
- [x] SpeedInsights removed ($10/mo saved)

## Remaining

### Infrastructure (do when ready)
- [ ] **Hetzner + Coolify migration** — See `docs/INFRASTRUCTURE.md`. CAX21 ~€7/mo + Cloudflare. Target: after stable on Vercel Pro 1-2 months.

### Accuracy (small fixes)
- [ ] **Broader Meeus fallback warnings** — Mars can be 22° off when sweph unavailable. Users should see a warning. (30 min)
- [ ] **Ayanamsha fallback warnings** — true_revati/true_pushya silently degrade to Lahiri in Meeus mode. (15 min)

### Content & SEO (future)
- [ ] **GSC Performance review** — Revisit ~2026-05-28 with 6 weeks of Search Console data.
- [ ] **Regional calendar deep pages** — Tamil, Bengali, Mithila specific festivals/naming. (4h)
- [ ] **Update docs/ASTRONOMICAL_CALCULATIONS.md** — Still says pure-Meeus. Needs to reflect sweph reality. (30 min)

### UI/UX (parked)
- [ ] **Landing page redesign** — Cosmic Portal hero. User decided to skip this for now.
