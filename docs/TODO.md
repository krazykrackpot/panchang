# Jyotish Panchang — TODO List

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Complete

---

## 1. Deploy to Production [PARKED]
- [ ] Vercel/Railway deployment configuration
- [ ] Custom domain setup + SSL
- [ ] Environment variables for production
- [ ] CDN configuration for static assets
- [ ] Database migration scripts for Supabase
- [ ] Monitoring and error tracking (Sentry)
**Status:** Parked — not ready for deployment yet

---

## 2. Content Quality Pass — Deepen All Learning Modules
**Goal:** Bring all 42 scaffolded modules (currently 65 lines) to the same depth as the 8 deeply-written ones (150-315 lines)

### What "deep" means per module:
- 2-3 content pages (not 1)
- ~2,500 words of real educational content
- 3-5 visual diagrams/tables
- 2+ worked examples with real chart data
- Common misconceptions section
- Modern relevance assessment
- 8-10 knowledge check questions (not 2-5)
- Cross-references to related modules

### Modules needing deepening:
- [ ] 3-2 Sign Qualities (has 2 pages but needs more questions)
- [ ] 3-3 Sign Lordship (needs enrichment)
- [ ] 4-1 through 4-3 Ayanamsha (needs Swiss Eph content)
- [ ] 5-1 through 5-3 Tithi (needs Parana calculation examples)
- [ ] 6-1 through 6-4 Nakshatra (needs yogtara table, pada-syllable mapping)
- [ ] 7-1 through 7-3 Yoga/Karana/Vara (needs calculation walkthroughs)
- [ ] 8-1 Muhurtas (needs muhurta selection flowchart)
- [ ] 9-1 through 9-4 Kundali (needs worked chart example with SVG)
- [ ] 10-1 through 10-3 Bhavas (needs house lord analysis examples)
- [ ] 11-1 through 11-3 Vargas (needs D9 calculation walkthrough)
- [ ] 12-1 through 12-3 Dashas (needs dasha timeline with real dates)
- [ ] 13-1 through 13-3 Transits (needs Sade Sati timeline visual)
- [ ] 14-1 through 14-3 Compatibility (needs worked matching example)
- [ ] 15-1 through 15-4 Yogas/Doshas (needs detection logic explanation)
- [ ] 16-1 through 16-3 Classical Texts (needs more accuracy comparison data)
- [ ] 17-1 through 17-4 Technical (needs code snippets and architecture diagrams)

---

## 3. Expand Yogas (75 → 150+)
**Current:** 75 yogas | **JHora:** 184 | **Parity:** 41%

### Missing yoga categories:
- [ ] More Nabhasa subtypes (need ~10 more: Akriti geometric patterns)
- [ ] Sankhya refinements (we have 7, need sub-variants)
- [ ] More specific Raja Yoga combinations (lords of specific houses)
- [ ] Daridra Yoga variants (5+: poverty indicators beyond basic)
- [ ] More Arishta Yogas (10+: health/longevity danger indicators)
- [ ] Kala Amrita Yoga (all planets between Moon-Sun axis)
- [ ] Akhanda Samrajya refinements (full classical conditions)
- [ ] Chaturmukha Yoga (benefics in all 4 kendras — strict version)
- [ ] More Parivartana sub-types (Maha/Khala/Dainya explicit detection)
- [ ] Shakat Yoga variants (Moon in 6th/8th from Jupiter variations)
- [ ] More Moon-based yogas from Phaladeepika
- [ ] Pancha Pakshi-based yogas

---

## 4. Expand Dasha Systems (15 → 25+)
**Current:** 15 | **JHora:** 40+ | **Parity:** 37%

### Missing dasha systems:
- [ ] Mandooka Dasha (Frog — jumps between signs)
- [ ] Drig Dasha (Aspect-based, Jaimini)
- [ ] Moola Dasha (Root dasha)
- [ ] Navamsha Dasha (D9 sign-based)
- [ ] Brahma Dasha (rare, BPHS)
- [ ] Naisargika Dasha (natural planetary periods)
- [ ] Tara Dasha (star-based)
- [ ] Buddhi Gathi Dasha (intelligence-based)
- [ ] Tithi Ashtottari (tithi-based 108yr)
- [ ] Yoga Vimsottari (yoga-based 120yr)

---

## 5. Dosha Cancellation UI
**Current:** Doshas detected but cancellation conditions not shown

- [ ] For each detected dosha, list ALL cancellation conditions from BPHS
- [ ] Show which cancellation conditions ARE met in this specific chart
- [ ] Severity scoring: Full / Partial / Cancelled
- [ ] Specific remedies per dosha (gemstone, mantra, charity, deity)
- [ ] Connection to dasha: "This dosha activates during X Mahadasha"
- [ ] Visual: green checkmarks for met cancellation conditions, red X for unmet

### Doshas to add cancellation logic for:
- [ ] Mangal Dosha (Mars in 1/2/4/7/8/12) — 6+ cancellation conditions
- [ ] Kala Sarpa (all planets between Rahu-Ketu) — 3 cancellation conditions
- [ ] Pitra Dosha (Sun with Rahu/Ketu) — Jupiter aspect cancels
- [ ] Shrapit Dosha (Saturn-Rahu conjunction) — Jupiter aspect cancels
- [ ] Kemadruma (Moon alone) — planet in kendra from Moon cancels
- [ ] Guru Chandal (Jupiter-Rahu) — sign of Jupiter matters

---

## 6. Regional Calendar Content
**Current:** Generic Hindu calendar | **Needed:** Region-specific variants

- [ ] Tamil calendar (Chithirai to Panguni months, Tamil month names)
- [ ] Telugu calendar (Chaitra to Phalguna with Telugu names + festivals)
- [ ] Bengali calendar (Boishakh to Choitro)
- [ ] Marathi calendar (Chaitra to Phalguna with Marathi festivals)
- [ ] Kerala/Malayalam calendar (Chingam to Karkidakam)
- [ ] Gujarati calendar (Kartik-starting year)
- [ ] Regional festival variations (e.g., Pongal vs Makar Sankranti)
- [ ] Adhika Masa regional naming differences
- [ ] Regional Purnimant vs Amant mapping

---

## 7. Shareable Chart Links
**Current:** Charts exist only in session | **Needed:** Unique URLs for sharing

- [ ] Generate unique chart ID on kundali creation
- [ ] Store chart data in Supabase (or URL-encoded params)
- [ ] Create `/kundali/[id]` page that loads saved chart
- [ ] Social sharing: OG image generation showing chart preview
- [ ] Share button generating link: "See my birth chart on Jyotish Panchang"
- [ ] QR code generation for chart link
- [ ] Privacy: option to share chart without birth time (time redacted)
- [ ] Expiry: shared links valid for 30 days (configurable)

---

## 8. Performance Optimization
- [ ] Memoize Swiss Ephemeris calls (same JD → same result)
- [ ] Lazy-load divisional chart tabs (compute D2-D60 only when tab opened)
- [ ] API response caching (s-maxage headers, ISR where possible)
- [ ] Image optimization (compress SVG icons, lazy-load chart images)
- [ ] Code splitting (separate bundle for learn modules, kundali tabs)
- [ ] Precompute panchang for ±7 days on first load
- [ ] Web worker for heavy calculations (Shadbala, yogas, avasthas)
- [ ] Database query optimization (Supabase indexes for RAG)

---

## 9. E2E Tests
**Current:** 105 unit tests | **Needed:** Browser-based E2E tests

### Critical user flows to test:
- [ ] Panchang page: loads → shows today's data → location detection works
- [ ] Kundali: fill form → generate → view chart → switch tabs → all tabs render
- [ ] Chart chat: generate kundali → open chat tab → ask question → get response
- [ ] Horoscope: load page → select sign → see forecast
- [ ] Learn modules: navigate to 1.1 → read pages → take quiz → pass → navigate to 1.2
- [ ] Matching: enter two nakshatras → compute → see 36-point result
- [ ] Calendar: select year → see festivals → open festival detail modal
- [ ] Yearly calendar: navigate months → see tithi/nakshatra per day
- [ ] Language switching: toggle EN/HI/SA → all content translates
- [ ] Light/dark mode: toggle → theme persists across pages

### Test infrastructure:
- [ ] Install Playwright or Cypress
- [ ] Configure for Next.js App Router
- [ ] CI pipeline integration (GitHub Actions)
- [ ] Screenshot comparison for chart rendering
- [ ] Accessibility audit (ARIA labels, keyboard navigation)

---

## 10. SEO
- [ ] JSON-LD structured data for panchang page (Event schema)
- [ ] JSON-LD for kundali page (SoftwareApplication schema)
- [ ] JSON-LD for learn pages (Course + CourseInstance schemas)
- [ ] Dynamic OG images per page (panchang date, kundali chart preview)
- [ ] Sitemap.xml with all 375 pages and proper priority/changefreq
- [ ] robots.txt optimization
- [ ] Meta descriptions for all page types (currently missing on many)
- [ ] Canonical URLs for locale variants
- [ ] Hreflang tags for EN/HI/SA
- [ ] Page speed optimization (Core Web Vitals: LCP, FID, CLS)
- [ ] Schema markup for FAQ sections on learn pages
- [ ] Breadcrumb structured data

---

## Summary

| # | Item | Priority | Status | Effort |
|---|------|----------|--------|--------|
| 1 | Deploy to Production | High | PARKED | Large |
| 2 | Content Quality Pass | High | Not started | Very Large (42 modules) |
| 3 | Expand Yogas (75→150+) | High | DONE (150+ yogas, 25 detectors) | Large |
| 4 | Expand Dashas (15→25+) | Medium | DONE (25 systems) | Medium |
| 5 | Dosha Cancellation UI | High | DONE (3 doshas w/ cancellation) | Medium |
| 6 | Regional Calendars | Medium | DONE (8 calendars) | Large |
| 7 | Shareable Chart Links | Medium | DONE (URL-encoded sharing) | Medium |
| 8 | Performance Optimization | Medium | DONE (SwEph memoization, API caching) | Medium |
| 9 | E2E Tests | High | DONE (Playwright setup + specs) | Large |
| 10 | SEO | Medium | DONE (JSON-LD, meta, breadcrumbs) | Medium |
