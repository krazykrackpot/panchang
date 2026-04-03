# Remaining TODO & Feature Roadmap

**Date:** April 3, 2026
**Current state:** 473+ pages, 617 tests, 83 learn modules, live on dekhopanchang.com

---

## Priority 1: Deploy Optimization

### Issues
- Vercel build cache issues (turbopack.root config removed, chunk path resolution)
- Pre-existing TypeScript error in `src/app/api/user/profile/route.ts` (ChartData type)
- Pre-existing TypeScript error in `src/app/[locale]/settings/page.tsx` (ChartData type)
- Hydration mismatch in Navbar (locationStore SSR vs client)

### Tasks
- [ ] Fix ChartData type errors in profile/settings routes
- [ ] Fix Navbar hydration mismatch (wrap location-dependent UI in client-only check)
- [ ] Verify Vercel build passes cleanly with zero TypeScript errors
- [ ] Confirm all 473+ pages render correctly in production

---

## Priority 2: SEO — Complete Audit

### 2.1 Google Search Console
- [ ] Verify domain ownership in Google Search Console
- [ ] Submit sitemap: https://www.dekhopanchang.com/sitemap.xml
- [ ] Request indexing for 10 key pages (home, panchang, kundali, learn, matching, calendar, sankalpa, sign-calculator, sade-sati, varshaphal)
- [ ] Set up Bing Webmaster Tools and submit sitemap

### 2.2 Meta Tags Audit (per page type)
- [ ] Home page: title, description, OG image, JSON-LD (WebSite + Organization)
- [ ] Panchang page: daily-specific title ("Panchang for [date] [location]"), JSON-LD (Event)
- [ ] Kundali page: title, description, JSON-LD (SoftwareApplication)
- [ ] Learn landing: JSON-LD (Course) — already present, verify completeness
- [ ] Learn modules (83): each needs unique title/description (currently may share generic)
- [ ] Matching page: title, description
- [ ] Calendar page: JSON-LD (Event for each festival)
- [ ] Puja pages (30): each needs unique description with deity/festival name
- [ ] Sankalpa page: title, description
- [ ] Tools pages (15): each needs unique title/description
- [ ] About page: JSON-LD (Organization)

### 2.3 Technical SEO
- [ ] Canonical URLs for all locale variants (en/hi/sa)
- [ ] Hreflang tags — verify all 3 locales are properly linked (already in sitemap, verify in HTML)
- [ ] robots.txt — verify API routes and _next are blocked
- [ ] Open Graph images — dynamic OG for panchang (date-specific), kundali (chart preview)
- [ ] Twitter card meta tags
- [ ] Structured data validation — test with Google Rich Results Test
- [ ] Core Web Vitals — LCP, FID, CLS audit via PageSpeed Insights
- [ ] Image alt text audit across all pages
- [ ] 404 page — custom, SEO-friendly with navigation links
- [ ] Internal linking audit — ensure all pages are reachable within 3 clicks from home

### 2.4 Content SEO
- [ ] Ensure every page has a unique H1 tag
- [ ] Meta descriptions for all 473 pages (many may be missing or generic)
- [ ] FAQ schema on learn pages (questions from quiz can become FAQ)
- [ ] Breadcrumb structured data on all subpages
- [ ] Sitemap: verify priority/changefreq values are appropriate
  - Home, Panchang: priority 1.0, daily
  - Calendar, Learn: priority 0.8, weekly
  - Tools: priority 0.7, monthly
  - Static pages: priority 0.5, monthly

---

## Priority 3: Performance

### Tasks
- [ ] Lazy-load divisional chart tabs (compute D2-D60 only when tab opened)
- [ ] Code splitting — separate bundles for learn modules, kundali tabs, calendar
- [ ] Image optimization — compress SVG icons, lazy-load non-critical images
- [ ] API response caching — verify s-maxage headers on all GET routes
- [ ] Precompute panchang for ±7 days on first load (background fetch)
- [ ] Web worker for heavy calculations (Shadbala, yogas, ashtakavarga)
- [ ] Bundle analysis — identify large dependencies, tree-shake unused code
- [ ] Font loading optimization — preload critical fonts, swap strategy

---

## Priority 4: Content Gaps — 35 Missing Puja Vidhis

### Festivals needing puja guides
- [ ] Buddha Purnima (Vaishakha Purnima)
- [ ] Ganga Dussehra
- [ ] Govardhan Puja
- [ ] Bhai Dooj
- [ ] Anant Chaturdashi
- [ ] Durga Ashtami
- [ ] Chaitra Navratri (separate from Sharad Navratri)
- [ ] Holika Dahan (separate from Holi)
- [ ] Hariyali Teej
- [ ] Guru Nanak Jayanti
- [ ] Maha Navami
- [ ] Devshayani Ekadashi (specific vidhi)
- [ ] Devutthana Ekadashi (specific vidhi)
- [ ] Kamada Ekadashi
- [ ] Putrada Ekadashi

### Recurring vrats needing specific vidhis
- [ ] Chaturthi (generic Vinayak Chaturthi monthly vidhi)
- [ ] Purnima Vrat (generic monthly vidhi)
- [ ] Amavasya Tarpan — already exists, verify completeness
- [ ] Masik Durga Ashtami

---

## Feature Roadmap (post-Priority 1-4)

### Feature 1: Interactive Calculation Labs
Connect learn modules to live calculations where users input their data and watch the engine work.

- [ ] Lab 1: Compute Your Panchang — enter date + location, see tithi/nakshatra computed with intermediate values
- [ ] Lab 2: Trace Your Moon — enter birth details, see Moon longitude calculated term by term
- [ ] Lab 3: Your Dasha Timeline — enter birth nakshatra, watch 120-year timeline generated
- [ ] Lab 4: Shadbala Breakdown — generate kundali, see each planet's 6 strengths scored
- [ ] Lab 5: KP Sub-Lord Lookup — enter a degree, walk through Sign → Star → Sub Lord

### Feature 2: PDF Export
- [ ] Kundali chart PDF with all planet positions, houses, yogas
- [ ] Sankalpa PDF — formatted Devanagari text suitable for printing
- [ ] Matching report PDF with all 8 kuta scores
- [ ] Daily panchang PDF/printable view

### Feature 3: Push Notifications / Reminders
- [ ] Service Worker registration for PWA
- [ ] Daily panchang notification at Brahma Muhurta
- [ ] Festival reminders (1 day before)
- [ ] Ekadashi vrat reminders with parana timing
- [ ] Personal dasha transition alerts
- [ ] Sade Sati phase change notifications

### Feature 4: PWA Offline Support
- [ ] Service worker with cache-first strategy for static assets
- [ ] Offline panchang for current week (pre-computed)
- [ ] Offline learn module content
- [ ] App manifest with icons for home screen installation
- [ ] Background sync for when connectivity returns

### Feature 5: AI Chart Chat Improvements
- [ ] Context-aware follow-up questions (remember previous Q&A)
- [ ] Multi-chart comparison (compare two kundalis in chat)
- [ ] Dasha-specific queries ("What happens in my Saturn Mahadasha?")
- [ ] Transit overlay queries ("How will Jupiter transit affect me?")
- [ ] Voice input for queries (Web Speech API)

### Feature 6: Social & Sharing
- [ ] Shareable kundali links (URL-encoded chart data)
- [ ] Dynamic OG images showing chart preview
- [ ] WhatsApp/Telegram share for daily panchang
- [ ] QR code for chart sharing
- [ ] Embed widget for blogs/websites (daily panchang iframe)

### Feature 7: Regional Calendar Enhancements
- [ ] Tamil calendar month names and festivals
- [ ] Telugu calendar integration
- [ ] Bengali calendar (Boishakh to Choitro)
- [ ] Malayalam calendar (Chingam to Karkidakam)
- [ ] Gujarati calendar (Kartik-starting year)
- [ ] Regional Purnimant vs Amant mapping per state

---

## Execution Order

| Phase | Items | Priority |
|-------|-------|----------|
| Now | Priority 1 (Deploy fixes) | Critical |
| Now | Priority 2 (SEO audit + fixes) | Critical |
| Next | Priority 3 (Performance) | High |
| Next | Priority 4 (Content gaps) | Medium |
| Then | Feature 1 (Interactive Labs) | Medium |
| Then | Feature 2 (PDF Export) | Medium |
| Later | Features 3-7 | Low-Medium |
