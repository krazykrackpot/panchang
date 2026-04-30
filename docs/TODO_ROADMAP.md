# Roadmap

Updated: 2026-04-30

## Everything Built & Running

- [x] Pre-compute tithi tables (168 JSON files, 55 cities × 3 years)
- [x] Swiss Ephemeris (sweph@2.10.3, production verified)
- [x] Edge caching (~90% CPU reduction)
- [x] IndexNow daily URL submission (399 URLs/day, 7 locales)
- [x] Daily Twitter auto-post cron (needs API keys)
- [x] Daily blog content at `/daily/[date]`
- [x] OG images for all major pages (birth chart, festivals, tools, calendar)
- [x] Shareable chart images (birth poster, discovery, blueprint, compatibility)
- [x] CTR-optimized meta titles (India + diaspora, native script per locale)
- [x] FAQ schema on festival pages
- [x] All kundali tabs at A/A+ explainability
- [x] Tippanni wow UX (hero dashboard, progressive disclosure, action plan)
- [x] 7 active locales: EN, HI, TA, TE, BN, GU, KN
- [x] PWA: offline page, Rahu Kaal shortcut, panchang caching, 4 shortcuts
- [x] Tools landing page (20 tarot cards, multilingual)
- [x] Learn sidebar with 45 REF articles integrated
- [x] Sudarshana Chakra redesign (900px, colored planets)
- [x] True node vs mean node toggle
- [x] Ayanamsha tab with holistic impact analysis
- [x] Color-coded Shadbala bars + Ashtakavarga heatmap
- [x] 12-Sankranti explorer
- [x] Bhava Chalit learn page
- [x] SEO cross-links (festival→learn, tool↔learn)
- [x] Social auto-post cron + Organization schema
- [x] Meeus fallback warnings + ayanamsha degradation notices
- [x] Matching kuta interpretations + overall verdict
- [x] Birth poster mini chart + Share Your Chart (PNG sharing)

## Remaining — Manual Actions (NOT code)

### One-Time Setup
- [x] Create Twitter/X @dekhopanchang — done, auto-posting live
- [x] Create YouTube @DekhoPanchang — done, keywords set
- [x] Update Organization schema `sameAs` — Twitter + YouTube live
- [x] New ॐ icon across all sizes (favicon, PWA, app icons)
- [x] Product Hunt — launched
- [x] Google Business Profile — Ujjain, MP
- [ ] Create Instagram @dekhopanchang (business account)
- [ ] Submit to: AlternativeTo, SaasHub, ToolPilot

### Recurring (~10 min/week)
- [ ] Reddit: r/hinduism, r/india, r/astrology — genuine answers with links
- [ ] Quora: festival date questions, panchang questions
- [ ] Temple outreach: offer panchang widget embed for backlinks

## Remaining — Decisions (not urgent)

### Infrastructure
- [ ] **Hetzner migration** — €7/mo vs $20/mo Vercel Pro. Plan at `docs/INFRASTRUCTURE.md`. Do after 1-2 months stable.
- [ ] **Vercel tier evaluation** — check CPU usage mid-May. If under limits, consider downgrading to free.

### Security
- [ ] **Security headers** — CSP (Content-Security-Policy) for XSS protection, HSTS (Strict-Transport-Security), X-Frame-Options/COOP for clickjacking, Trusted Types for DOM XSS. Add via `next.config.ts` headers or Vercel config.

### SEO
- [ ] **GSC review** — ~May 28. 6 weeks of data needed. Decide which programmatic pages to keep/prune. Current: 1% CTR, position 18.7.

### Mobile
- [ ] **Native app** — NOT YET. Wait for 10K MAU. PWA covers 80% of use cases. See analysis in previous version of this doc.

### Parked
- [ ] Landing page redesign — skipped by choice
