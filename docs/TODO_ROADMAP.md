# Roadmap — Bigger Lifts (Deferred)

Items parked for future sessions. Ordered by impact.

## Performance & Infrastructure

- [ ] **Pre-compute tithi tables at build time** — Generate JSON for current + next 2 years for top 50 cities. API routes read static files instead of computing. Eliminates API CPU for read-only data entirely.
- [ ] **Hetzner + Coolify migration** — See `docs/INFRASTRUCTURE.md` for full plan. CAX21 (~€7/mo) + Coolify + Cloudflare. Target: after 1-2 months stable on Vercel Pro.
- [ ] **Swiss Ephemeris (sweph) integration** — Higher accuracy planet positions. Fixes Meeus retrograde station drift (Jupiter ~40 days late, Saturn ~13 days late). Requires native binary — easy on VPS, complex on Vercel.

## Computation Accuracy

- [ ] **Swiss Ephemeris for outer planets** — Meeus simplified series is ~0.5° for Moon, worse for Jupiter/Saturn retro stations. sweph gives arcsecond accuracy.
- [ ] **True node vs mean node toggle** — Currently uses mean Rahu/Ketu. True nodes oscillate and are preferred by some traditions.

## UI/UX

- [ ] **Landing page redesign** — Cosmic Portal hero, scroll cinema, micro-interactions, editorial typography. Spec parked at `.superpowers/brainstorm/9877-1775204001/content/landing-redesign.html`. Needs formal plan.
- [ ] **Cmd+K command palette** — Quick navigation across all 300+ pages. Fuzzy search by tool name, nakshatra, rashi, etc.

## Content & SEO

- [ ] **GSC Performance review** — Revisit ~2026-05-28 with 6 weeks of Google Search Console data. Decide which programmatic SEO pages to keep/prune.
- [ ] **Regional calendar deep pages** — Tamil, Bengali, Mithila panchangs with region-specific festivals and naming conventions.
