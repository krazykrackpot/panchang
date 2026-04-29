# Roadmap

Updated: 2026-04-29

## Automated — Built & Running

- [x] Pre-compute tithi tables (168 JSON files, 55 cities × 3 years)
- [x] Swiss Ephemeris integration (sweph@2.10.3, production)
- [x] Edge caching (~90% CPU reduction)
- [x] IndexNow daily URL submission (228 URLs/day at 00:05 UTC)
- [x] Daily Twitter auto-post cron (00:30 UTC — needs API keys)
- [x] Daily blog content at `/daily/[date]` (auto-generated)
- [x] OG images for all major pages (personalized birth chart, festivals, tools)
- [x] Shareable chart images (birth poster, discovery, blueprint, compatibility)
- [x] Organization schema with social profile placeholders
- [x] CTR-optimized meta titles (India + diaspora markets)
- [x] FAQ schema on festival pages
- [x] Hreflang verification script
- [x] All kundali tabs at A/A+ explainability
- [x] Tippanni wow UX (hero dashboard, progressive disclosure, action plan)

## Manual Actions — One-Time Setup (see docs/SEO_MANUAL_ACTIONS.md)

- [ ] Create Twitter/X account @dekhopanchang → add API keys to env vars
- [ ] Create Instagram business account @dekhopanchang
- [ ] Create Facebook Page
- [ ] Create YouTube channel (authority signal, no videos needed yet)
- [ ] Submit to 6 directories (Google Business, Product Hunt, AlternativeTo, etc.)
- [ ] Add social URLs to Organization schema (replace placeholders in structured-data.ts)

## Manual Actions — Recurring (10 min/week)

- [ ] Reddit participation: r/hinduism, r/india, r/astrology (genuine answers with links)
- [ ] Quora answers: "What is tithi today?", "When is Diwali 2028?" etc.
- [ ] Temple website outreach: offer free panchang widget embed for backlinks

## Infrastructure

- [ ] **Hetzner + Coolify migration** — See `docs/INFRASTRUCTURE.md`. ~€7/mo vs $20/mo Vercel Pro.
- [ ] **Vercel Pro evaluation** — Monitor CPU usage May 2026. If cache fix keeps us under limits, consider downgrading back to free tier.

## SEO — Waiting on Data

- [ ] **GSC Performance review** — Revisit ~2026-05-28 with 6 weeks of data. Current: 1% CTR, position 18.7. Decide which programmatic SEO pages to keep/prune.

## Mobile App — Analysis

### Should we build native iOS/Android apps?

**Arguments FOR:**
- Push notifications for daily panchang, festival reminders, Rahu Kaal alerts → higher engagement than web
- App Store presence = discoverability (people search "panchang app" on Play Store)
- Offline access to pre-computed tithi tables (168 JSON files already exist)
- Home screen widget showing today's tithi/nakshatra (killer feature on Android)
- Indian market is mobile-first (85% mobile traffic for astrology sites)
- Competitors (Drik Panchang, AstroSage) have apps with millions of downloads
- App retention > web retention (daily open habit for panchang)

**Arguments AGAINST:**
- We already have a PWA (service worker, installable, push notifications)
- App Store review process is slow and unpredictable for astrology apps
- Maintaining 3 codebases (web + iOS + Android) is expensive
- React Native / Expo could share code but native performance for charts is better
- App Store takes 15-30% of any in-app payments
- Our Swiss Ephemeris (sweph) is a native C binary — complex on mobile
- SEO value is zero (app content isn't indexed by Google)

**Recommendation: NOT YET. Here's why:**

1. **Your PWA already does 80% of what a native app would.** It's installable, works offline for cached pages, and can send push notifications.

2. **The missing 20% that only native apps provide:**
   - Home screen widgets (Android) — show today's tithi without opening the app
   - Background location for auto-city detection
   - Smoother chart rendering (Metal/Vulkan vs SVG)
   - App Store discovery

3. **When to build the app:**
   - When you have 10K+ monthly active web users (proves demand)
   - When push notification opt-in rate exceeds 5% on web (proves users want alerts)
   - When "dekho panchang app" starts appearing in search queries (organic demand)

4. **If you do build it, use Expo/React Native:**
   - Share 90% of UI code with the web app
   - Pre-computed tithi table JSON files bundle directly into the app
   - Charts render via react-native-svg (same patterns as web)
   - sweph can be compiled for mobile via a C bridge (expo-modules)
   - Cost: ~2 weeks for MVP, ~$99/yr Apple + $25 one-time Google developer fees

5. **Quick win instead:** Enhance the PWA:
   - [ ] Better install prompt (we have one, verify it works well)
   - [ ] Periodic background sync for daily panchang data
   - [ ] PWA shortcut actions ("Today's Panchang", "Rahu Kaal")

### PWA Enhancements (do before native app)

- [ ] **PWA install prompt audit** — verify the banner appears, test on Android Chrome + iOS Safari
- [ ] **PWA shortcuts** — add to manifest.json: "Today's Panchang", "Rahu Kaal Now", "Generate Kundali"
- [ ] **Offline daily page** — cache today's panchang in service worker for offline access
- [ ] **Web push for daily panchang** — morning notification with today's tithi (cron already exists)

## Parked

- [ ] Landing page redesign — user decided to skip
- [ ] Native iOS/Android app — wait for 10K MAU signal
