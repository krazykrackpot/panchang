# Competitive Edge Features — Design Spec

**Date:** 2026-04-21
**Features:** 4 independent features to ship together
**Goal:** Daily engagement hooks + tools no competitor has

---

## Feature A: Muhurta Calendar — Personalized Auspicious Windows

### What exists
- Basic month-view calendar at `/muhurat` with 8 activities (flat date list, basic scoring)
- Advanced `scanDateRange()` engine in `src/lib/muhurta/time-window-scanner.ts` with 20 activities, multi-factor 0-100 scoring, personal birth data integration — **NOT wired to any UI**
- Personal scoring via Tara Bala + Chandra Bala in `personal-compatibility.ts`

### What we build
Upgrade the existing `/muhurat` page to use the advanced scanner engine. Add a visual calendar grid showing color-coded days (green/gold/amber/red) per activity. When logged in with a saved birth chart, overlay personal compatibility scores.

### Architecture
- **No new page needed** — enhance existing `/muhurat` page
- **New API endpoint:** `GET /api/muhurat/scan?year=&month=&activity=&birthNak=&birthRashi=` — calls `scanDateRange()` instead of the basic `findMuhuratDates()`
- **UI:** Replace flat date list with a calendar grid. Each day cell shows quality color + score badge. Click a day → expand to show time windows (morning/midday/afternoon) with scores.
- **Personal overlay:** When user has saved birth data, pass birthNakshatra + birthRashi to scanner for Tara/Chandra Bala personalization. Show "Personal Score" badge alongside generic score.

### Key constraint
- The Tara Bala mapping in `personal-compatibility.ts` has Sampat/Vipat inverted — fix before using.

---

## Feature B: Tithi Pravesha (Vedic Birthday Chart)

### What exists
- `src/lib/kundali/tithi-pravesha.ts` — `calculateTithiPravesha()` finds the exact date/time when natal tithi recurs in a target year. Returns Sun/Moon longitudes.
- No page, no UI.

### What we build
New page at `/tithi-pravesha` — user enters birth data (or uses saved chart), selects a year, and gets their Vedic birthday chart. Shows:
- Pravesha date and time (when your natal tithi recurs this year)
- Sun and Moon positions at pravesha moment
- Key interpretation: which tithi lord rules the year, general tone
- Link to full Varshaphal for deeper analysis

### Architecture
- **New page:** `src/app/[locale]/tithi-pravesha/page.tsx` — client component with birth form + year selector
- **Uses existing** `calculateTithiPravesha()` — called client-side (it's pure math, no API needed)
- **Interpretation:** Simple rule-based text based on tithi lord (Moon phase → planet ruler → year theme). No LLM needed.
- **SEO:** PAGE_META entry, layout with FAQ JSON-LD, sitemap entry, navbar link under Tools

### Key constraint
- The engine returns raw Sun/Moon longitudes but not a full chart (no houses, no other planets). V1 shows the pravesha date + tithi lord interpretation. Full chart generation is a future enhancement.

---

## Feature C: Daily Nakshatra Activity Guide

### What exists
- `src/lib/personalization/personal-muhurta.ts` — `computePersonalMuhurta()` returns per-activity recommendations for 10 activities based on Tara + Chandra Bala
- `src/lib/personalization/personal-panchang.ts` — `computePersonalizedDay()` returns day quality
- Daily panchang already computes today's nakshatra

### What we build
A "Today's Guide" section on the panchang page (SSR block) + a standalone widget for the dashboard. Shows:
- Today's nakshatra with its general qualities (good for X, avoid Y)
- If logged in: personalized Tara Bala result ("Today is a Sampat day for you — excellent for new ventures")
- 10-activity recommendation grid: marriage, business, travel, education, property, medical, vehicle, spiritual, financial, legal — each rated excellent/good/neutral/avoid with color coding

### Architecture
- **New component:** `src/components/panchang/NakshatraActivityGuide.tsx` — client component that reads panchang data + birth data from store
- **Panchang SSR block:** Add a condensed version (top 3 activities) to the server-rendered summary
- **Dashboard:** Add as a widget on `/dashboard`
- **Data source:** Uses existing `computePersonalMuhurta()` — no new engine needed
- **Non-personalized fallback:** When not logged in, show generic nakshatra qualities from a static data map (nakshatra → activity affinities)

### Key constraint
- Nakshatra-specific activity data (e.g., "Rohini: good for agriculture, beauty") does NOT exist in the codebase. Need to create a lookup table: `src/lib/constants/nakshatra-activities.ts` with activity affinities per nakshatra.

---

## Feature D: Transit Impact Alerts — Personalized Countdown

### What exists
- Weekly cron at `src/app/api/cron/transit-alerts/route.ts` — computes slow-planet transits, creates notifications, sends push
- `computePersonalTransits()` in `personal-transits.ts` — SAV-based transit quality scoring
- `computeUpcomingTransitions()` — scans 6 months for sign changes
- Push notification infrastructure (`sendPushToUser()`)

### What we build
Enhance the transit alert system to include:
1. **Countdown alerts:** "Saturn enters your 7th house in 23 days" — sent 30 days, 7 days, and 1 day before a major transit
2. **Domain-aware messaging:** "This affects your marriage/partnerships area"
3. **Dashboard widget:** `TransitCountdown` card showing upcoming major transits with days remaining
4. **Email alerts:** Use existing Resend infrastructure to send transit emails (not just push)

### Architecture
- **Enhance cron:** Modify `transit-alerts/route.ts` to use `computeUpcomingTransitions()` for future-looking alerts (currently only checks current transits)
- **New component:** `src/components/dashboard/TransitCountdown.tsx` — shows next 3 upcoming transits with countdown, domain mapping, and nature (benefic/malefic)
- **Email template:** `src/lib/email/templates/transit-alert.ts` — reuse Resend client
- **Dedup logic:** Already exists in cron — extend to track "30-day", "7-day", "1-day" alert stages

### Key constraint
- Only slow planets (Saturn, Jupiter, Rahu, Ketu) for alerts — fast planets change too quickly to be useful.
- `computeUpcomingTransitions()` already exists but returns raw data — need to map to user's houses and score with SAV.

---

## Critical Self-Review

### Issues found and addressed:

1. **Tara Bala inconsistency** — `personal-compatibility.ts` has Sampat=unfavorable (wrong). Must fix before Features A and C use it. **Resolution:** Fix the mapping in `personal-compatibility.ts` to match the correct traditional values in `personal-panchang.ts`.

2. **Feature A scope creep risk** — The advanced scanner computes time windows within each day (morning/midday/afternoon). Showing all this in a calendar grid could be overwhelming. **Resolution:** V1 shows day-level quality only. Click to expand → time windows. Don't try to show everything at once.

3. **Feature B is thin** — Tithi Pravesha without a full chart is just a date + brief interpretation. Users may expect more. **Resolution:** Clearly label as "Find your Vedic Birthday" with the date and year-lord interpretation. Link to Varshaphal for full annual analysis. Under-promise, over-deliver later.

4. **Feature C data gap** — Nakshatra-specific activity affinities don't exist. Creating accurate data for 27 nakshatras × 10+ activities is content work. **Resolution:** Create the lookup table with data from classical sources (BPHS, Muhurta Chintamani). 27 entries × 10 activities = 270 data points — manageable.

5. **Feature D email spam risk** — 3 alerts per transit × 4 slow planets × multiple users = potential email volume. **Resolution:** Only email for "strong" quality transits (SAV-based). Push for all, email only for high-impact.

6. **Missing integration points:**
   - Feature B (Tithi Pravesha) must be added to: navbar Tools dropdown, sitemap, PAGE_META
   - Feature C (Activity Guide) must be added to: panchang SSR block, dashboard
   - Feature D (Transit Countdown) must be added to: dashboard

### What's NOT in scope:
- Full chart generation for Tithi Pravesha (future enhancement)
- Fast planet transit alerts (too noisy)
- Notification preferences UI (separate feature)
- Historical event validation (Feature 1 — deferred)
- Crowdsourced correlation database (Feature 6 — deferred)

---

## Implementation Order

1. **Fix Tara Bala bug** — prerequisite for A and C
2. **Feature B: Tithi Pravesha** — quickest (engine exists)
3. **Feature C: Nakshatra Activity Guide** — needs data table + component
4. **Feature A: Muhurta Calendar upgrade** — needs API + UI rework
5. **Feature D: Transit Countdown** — needs cron enhancement + widget
