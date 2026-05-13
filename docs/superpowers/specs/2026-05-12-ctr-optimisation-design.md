# CTR Optimisation — From 0.6% to 2%+

**Date:** 2026-05-12  
**Status:** Draft  
**Baseline (Apr 12 – May 11):** 609 clicks / 99,350 impressions = 0.6% CTR, avg position 9.6  
**Prior spec:** `2026-04-21-seo-position-ctr-improvement.md` (focused on ranking; position now solved — 23→9.6)

---

## Executive Summary

We rank on page 1 for thousands of queries but almost nobody clicks. The data reveals five root causes: (1) festival page cannibalisation diluting rank authority across 25+ URL variants, (2) titles that bury the answer searchers want, (3) generic template descriptions that don't differentiate, (4) missing structured data that would unlock rich snippets, and (5) a cosmetic doubled brand suffix wasting title space. This spec addresses all five with concrete page-type formulas, canonical strategies, and JSON-LD additions.

---

## 1. Problem Analysis (Data-Driven)

### 1.1 Festival Page Cannibalisation

**The single biggest CTR killer.**

| Query | Impressions | Clicks | CTR | URLs Shown |
|-------|------------|--------|-----|------------|
| ganesh chaturthi 2027 | 1,982 | 1 | 0.05% | 25+ |
| akshaya tritiya 2027 | 1,181 | 1 | 0.08% | 25+ |
| hanuman jayanti 2027 | 299 | 1 | 0.33% | — |
| akshaya tritiya 2027 date | 270 | 1 | 0.37% | 22+ |
| hartalika teej 2026 date in bihar | 249 | 2 | 0.80% | — |
| akshaya tritiya 2028 date and time | 195 | 1 | 0.51% | — |

**Root cause:** Each festival has city-specific URLs:
```
/en/festivals/ganesh-chaturthi/2027/mumbai
/en/festivals/ganesh-chaturthi/2027/pune
/en/festivals/ganesh-chaturthi/2027/bangalore
/kn/festivals/ganesh-chaturthi/2027/chandigarh
/mai/festivals/ganesh-chaturthi/2027/ahmedabad
... (25+ variants per festival per year)
```

Google rotates between them, never consolidating authority. Position oscillates between 4 and 16 across variants instead of holding steady at 4.

**Key insight:** The festival date is the SAME nationwide. Only puja muhurat times differ slightly by city (sunrise-dependent). Google doesn't need 25 pages to answer "ganesh chaturthi 2027 date."

### 1.2 Titles Don't Match Search Intent

People search for **dates and times**. Our titles bury them:

| Page | Current Title | Problem |
|------|--------------|---------|
| Akshaya Tritiya 2027 Pune | `Akshaya Tritiya 2027 Pune – May 8, Sunrise 6:03 AM` | City-specific, "Sunrise 6:03 AM" is irrelevant to the query |
| Ganesh Chaturthi 2027 Mumbai | `Ganesh Chaturthi 2027 Mumbai – Sep 4, Puja 11:22 AM–1:52 PM` | City before date; not what "ganesh chaturthi 2027" wants |
| Travel Muhurta | `Travel Muhurat 2026 – Next: Apr 15 \| Dekho Panchang \| Dekho Panchang` | Date is stale (Apr 15 is past), doubled brand suffix |
| Annaprashan (Hindi) | `अन्नप्राशन मुहूर्त 2026 – Next: Apr 22 \| Dekho Panchang \| Dekho Panchang` | Hindi page with English "Next:" prefix; doubled brand |
| Rahu Kaal | `Rahu Kaal Today – Exact Time for Your City` | Generic — doesn't show the actual time or city |

**Benchmark:** Drik Panchang titles: `Akshaya Tritiya 2027 Date and Muhurat` — clean, query-matched, no fluff.

### 1.3 Generic Template Descriptions

Every muhurta page uses the same description template:
> "Vedic Panchang-based dates with nakshatra, tithi & planetary analysis."

This tells the searcher nothing specific. In a SERP with 10 results, it doesn't differentiate. The description should be a **mini-answer** — showing the next date, the day of week, and a count of available dates to establish completeness.

### 1.4 Missing Rich Snippet Structured Data

**Current JSON-LD on festival pages:** Only `Organization` schema (site-wide).  
**Missing:** `Event` schema — which would give us rich results with dates, times, and event badges in the SERP.

**Current JSON-LD on muhurta/learn pages:** Only `BreadcrumbList` + `Organization`.  
**Missing:** `FAQPage` schema on pages that have Q&A content, `HowTo` schema on puja vidhi pages.

**Impact:** Rich results can increase CTR by 2-3x according to Google's own studies. We have the data for Event, FAQ, and HowTo — we're just not emitting the schema.

### 1.5 Doubled Brand Suffix

Some pages render `| Dekho Panchang | Dekho Panchang` — wasting ~17 characters of the ~60-character visible title.

**Root cause (confirmed):** The root layout at `src/app/[locale]/layout.tsx:38-40` defines:
```typescript
title: { default: title, template: `%s | Dekho Panchang` }
```
This auto-appends `| Dekho Panchang` to every child page's title. But some `PAGE_META` entries in `src/lib/seo/metadata.ts` ALSO include `| Dekho Panchang` explicitly:
- Ekadashi (line 142)
- Tamil Calendar (line 749)
- Bengali Calendar (line 755)
- Chandra Darshan (line 1439)
- Panchak (line 1446)
- Holashtak variants (lines 1451, 1456, 1461)
- Gujarati Calendar (line 762)

**Not affected:** Muhurta pages, festival pages, rahu kaal — these use clean titles without the suffix, so the template works correctly for them.

---

## 2. Design

### 2.1 Festival Cannibalisation Fix

**Strategy: Canonical consolidation with city selector.**

#### 2.1.1 New Canonical Festival URLs

Create one **canonical festival page per festival per year** at:
```
/en/festivals/{slug}/{year}         ← canonical, indexed
/en/festivals/{slug}/{year}/{city}  ← kept for direct links, BUT canonical points to parent
```

The canonical page shows:
- Festival date (national, since it's the same everywhere)
- Default puja muhurat (for the most common city, or a "popular cities" table)
- Interactive city selector that loads city-specific muhurat times client-side
- Full puja vidhi, significance, mantras (the existing content)

The city-variant pages add:
```html
<link rel="canonical" href="/en/festivals/{slug}/{year}" />
<meta name="robots" content="noindex, follow" />
```

**Why noindex + canonical together:** The canonical tag alone is a hint Google may ignore. `noindex` is a directive. Together, they guarantee Google consolidates signals to the parent URL. The city pages still work for users arriving from existing links or bookmarks.

#### 2.1.2 Internal Link Updates

- Sitemap: only include the canonical `/festivals/{slug}/{year}` URL, not city variants
- Internal links from calendar, panchang, and learn pages: point to canonical URL
- City-variant pages: `rel="canonical"` + `noindex` as above

#### 2.1.3 Festival Title + Description Formula

**Title** (≤60 chars):
```
{Festival} {Year} Date: {Month Day} ({Day}) – Puja Muhurat
```
Examples:
- `Ganesh Chaturthi 2027 Date: Sep 4 (Saturday) – Puja Muhurat`
- `Akshaya Tritiya 2027 Date: May 8 (Saturday) – Muhurat & Vidhi`
- `Diwali 2026 Date: Oct 20 (Tuesday) – Lakshmi Puja Time`

**Description** (≤155 chars):
```
{Festival} is on {Month Day, Year} ({Day}). Puja muhurat: {Time Range}. Complete vidhi, mantra, samagri list. City-wise muhurat for {N} cities.
```
Examples:
- `Ganesh Chaturthi is on Sep 4, 2027 (Saturday). Puja muhurat: 11:22 AM–1:52 PM. Complete vidhi, mantras, samagri list. City-wise timings for 12+ cities.`

#### 2.1.4 Hindi Festival Title Formula

```
{Festival} {Year} तिथि: {Day} {Month} ({Day of Week}) – पूजा मुहूर्त
```
Examples:
- `गणेश चतुर्थी 2027 तिथि: 4 सितम्बर (शनिवार) – पूजा मुहूर्त`
- `अक्षय तृतीया 2027 तिथि: 8 मई (शनिवार) – मुहूर्त व विधि`

### 2.2 Muhurta Page Title + Description Rewrite

#### 2.2.1 Muhurta Title Formula

**Current:** `{Activity} Muhurat 2026 – Next: {Date} | Dekho Panchang | Dekho Panchang`  
**New:** `{Activity} Muhurat {Year}: Next {Date} ({Day}) | Dekho Panchang`

The `Next:` prefix is removed (it adds nothing), the date includes the day of week (searchers want to know if it's a weekday/weekend), and brand appears once.

**Hindi variant:**
```
{Activity} मुहूर्त {Year}: अगला {Date} ({Day}) | Dekho Panchang
```

Examples:
- `Travel Muhurat 2026: Next May 15 (Friday) | Dekho Panchang`
- `Annaprashan Muhurat 2026: Next Jun 3 (Wednesday) | Dekho Panchang`
- `यात्रा मुहूर्त 2026: अगला 15 मई (शुक्रवार) | Dekho Panchang`

#### 2.2.2 Muhurta Description Formula

**Current:** `Vedic Panchang-based dates with nakshatra, tithi & planetary analysis.`  
**New:** `Next {activity} muhurat: {Date} ({Day}, {Nakshatra} nakshatra). {N}+ auspicious dates for {Year} ranked by Vedic strength. Free, updated daily.`

Examples:
- `Next travel muhurat: May 15, 2026 (Friday, Pushya nakshatra). 48 auspicious dates for 2026 ranked by Vedic strength. Free, updated daily.`
- `Next annaprashan muhurat: Jun 3, 2026 (Wednesday, Rohini nakshatra). 36 auspicious dates for 2026. Free, no signup.`

#### 2.2.3 City-Specific Muhurta Pages

City-specific muhurta pages (e.g., `/en/muhurta/property/2026/may/bangalore`) should have:

**Title:** `{Activity} Muhurat May 2026 Bangalore – {N} Dates | Dekho Panchang`  
**Description:** `{N} auspicious {activity} dates in Bangalore for May 2026. Next: {Date} ({Day}). Tithi, nakshatra & planetary alignment checked. Free.`

### 2.3 Rahu Kaal Title + Description

**Current:** `Rahu Kaal Today – Exact Time for Your City | Dekho Panchang`  
**Problem:** Generic. Doesn't show the actual time. Position 25-28 means it barely appears, but when it does, it should win the click.

**New title (dynamic, generated at build/ISR time):**
```
Rahu Kaal Today: {StartTime}–{EndTime} ({City}) | Dekho Panchang
```

Since the page is being SSR-converted (Phase 1 from the current WIP), the server component can inject today's Rahu Kaal time into the meta tag. For the generic page without a city, use the user's geo or default to the most common city.

**New description:**
```
Today's Rahu Kaal: {StartTime}–{EndTime}. Also Yamaganda ({Time}), Gulika Kaal ({Time}). Avoid new beginnings during these periods. Updated daily for {City}.
```

**Note:** Dynamic titles with today's times are powerful for recurrent queries but require ISR/SSR. Since the SSR conversion is already in progress, this is achievable.

### 2.4 Panchang Page Title + Description

**Current (Hindi):** `आज का पंचांग – तिथि, नक्षत्र, योग, करण | Dekho Panchang`  
**Problem:** Lists elements but doesn't give the actual values. Competitor Drik Panchang shows today's tithi name right in the title.

**New (dynamic):**
```
आज का पंचांग {Date} – {Tithi Name}, {Nakshatra Name} | Dekho Panchang
```
```
Today's Panchang {Date} – {Tithi}, {Nakshatra} | Dekho Panchang
```

**New description:**
```
{Date} पंचांग: {Tithi} ({Paksha}), {Nakshatra}, {Yoga}, {Karana}। सूर्योदय {Time}, राहुकाल {Time}। {City} के लिए सटीक गणना।
```

This gives Google a snippet-worthy answer that matches "aaj ka panchang" perfectly.

### 2.5 Horoscope Page Title + Description

Horoscope pages (`/hi/horoscope/makar`, `/hi/horoscope/dhanu`) get impressions but low CTR.

**Current:** Generic titles like `मकर राशिफल | Dekho Panchang`  
**New:**
```
मकर राशिफल आज {Date} – {1-line prediction hook} | Dekho Panchang
```
```
Capricorn Horoscope Today {Date} – Daily Prediction | Dekho Panchang
```

**Description:** Include today's moon sign transit, a teaser of the prediction, and the time period it covers.

### 2.6 Dates Pages (Amavasya, Ekadashi, Purnima)

**Current:** `अमावस्या 2026 – सभी तिथियाँ और समय | Dekho Panchang`  
**New:** `अमावस्या 2026: अगली {Date} – पूरे साल की {N} तिथियाँ | Dekho Panchang`

**Description:** `अगली अमावस्या: {Date} ({Day})। 2026 में कुल {N} अमावस्या — तारीख, समय, शुभ-अशुभ कार्य और पूजा विधि।`

### 2.7 Event JSON-LD for Festival Pages

Add `Event` structured data to every festival page. The data is already computed — this is just a schema emission.

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Ganesh Chaturthi 2027",
  "description": "Hindu festival celebrating the birth of Lord Ganesha. 10-day celebration ending with Ganesh Visarjan.",
  "startDate": "2027-09-04",
  "endDate": "2027-09-14",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Country",
    "name": "India"
  },
  "organizer": {
    "@type": "Organization",
    "name": "Dekho Panchang",
    "url": "https://dekhopanchang.com"
  },
  "image": "https://dekhopanchang.com/images/festivals/ganesh-chaturthi.jpg",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "url": "https://dekhopanchang.com/en/festivals/ganesh-chaturthi/2027",
    "validFrom": "2027-01-01"
  }
}
```

**For multi-day festivals:** Use `startDate` and `endDate`.  
**For single-day festivals:** Use `startDate` only.  
**For festivals with specific puja windows:** Add `subEvent` with the muhurat time range.

### 2.8 FAQPage JSON-LD for High-Impression Pages

Add `FAQPage` schema to pages that already have FAQ-like content (or add a small FAQ section). Target the top 10 pages by impressions first.

Example questions per page type:
- **Muhurta:** "What is the next auspicious date for {activity}?", "How is muhurta calculated?"
- **Festival:** "When is {festival} in {year}?", "What is the puja muhurat for {festival}?", "What is the significance of {festival}?"
- **Rahu Kaal:** "What is Rahu Kaal?", "What time is Rahu Kaal today?", "What should you avoid during Rahu Kaal?"

Google sometimes shows FAQ rich results as expandable accordions under the main result — this can double the SERP real estate.

### 2.9 Fix Doubled Brand Suffix

**Root cause (confirmed):** Root layout template (`%s | Dekho Panchang`) + explicit suffix in 8 `PAGE_META` entries = double suffix.

**Fix:** Strip `| Dekho Panchang` from all PAGE_META entries that have it. The root layout template handles branding globally. Specific entries to fix:

```
PAGE_META['/dates/ekadashi'].title.en  — remove " | Dekho Panchang"
PAGE_META['/calendar/regional/tamil'].title.en  — remove " | Dekho Panchang"
PAGE_META['/calendar/regional/bengali'].title.en  — remove " | Dekho Panchang"
PAGE_META['/calendar/regional/gujarati'].title.en  — remove " | Dekho Panchang"
PAGE_META['/learn/chandra-darshan'].title.en  — remove " | Dekho Panchang"
PAGE_META['/learn/panchak'].title.en  — remove " | Dekho Panchang"
PAGE_META['/learn/holashtak'].title.en (×3 locales)  — remove " | Dekho Panchang"
```

Also grep for `| Dekho Panchang` across ALL PAGE_META entries and all `generateMetadata()` functions to catch any others. The pattern: `grep -rn "Dekho Panchang" src/lib/seo/metadata.ts | grep -i "title"` — any match inside a title value is a bug (the template handles it).

---

## 3. Implementation Architecture

### 3.1 Files to Modify

#### Festival cannibalisation (Phase 1):
- `src/app/[locale]/festivals/[slug]/[year]/[city]/layout.tsx` — **existing** file. Add `robots: { index: false }` + canonical pointing to parent. Currently generates city-specific metadata (title with city name, dynamic puja times).
- `src/app/[locale]/festivals/[slug]/[year]/page.tsx` — **NEW FILE**. Canonical festival page without city. Does not exist today — only the `[city]` variant has a page.
- `src/app/[locale]/festivals/[slug]/[year]/layout.tsx` — **NEW FILE**. Metadata for canonical festival page (title with date, no city).
- `src/app/sitemap.ts` (lines 527-570) — currently emits ~2,000 festival city URLs (20 festivals × 50 cities × 2+ years). Replace with ~60 canonical URLs (20 festivals × 3 years, en+hi only).
- Internal links in calendar/panchang/learn pages — update to point to canonical `/festivals/{slug}/{year}` not city variants.

#### Metadata rewrites (Phase 2):
- `src/lib/seo/metadata.ts` — PAGE_META entries: strip `| Dekho Panchang` from ~8 entries that have explicit suffix. Rewrite muhurta description templates.
- Muhurta page layouts — title formula change from `{Activity} Muhurat 2026 – Next: {Date}` to `{Activity} Muhurat {Year}: Next {Date} ({Day})`
- `src/app/[locale]/rahu-kaal/page.tsx` — static title rewrite (dynamic in Phase 4)
- `src/app/[locale]/panchang/page.tsx` — static title rewrite (dynamic in Phase 4)
- `src/app/[locale]/horoscope/[sign]/page.tsx` — title + description rewrite
- `src/app/[locale]/dates/[type]/page.tsx` — title + description rewrite

#### Structured data (Phase 3):
- `src/lib/seo/json-ld.ts` — add `generateEventLD()` and `generateFAQLD()` helpers
- Festival canonical page — emit Event schema
- Top 10 pages by impressions — emit FAQPage schema (add FAQ section if not present)

#### Dynamic metadata (Phase 4):
- Panchang, rahu kaal, horoscope, dates pages — `generateMetadata()` computes fresh values server-side

### 3.2 Dynamic Metadata Pattern

For pages with dynamic titles (panchang, rahu kaal, horoscope), the metadata must be generated server-side with fresh data. Pattern:

```typescript
// In page.tsx or layout.tsx (server component)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const panchang = computePanchangForToday(/* server geo or default */);
  
  return {
    title: `Today's Panchang ${formatDate(today)} – ${panchang.tithi.name.en}, ${panchang.nakshatra.name.en}`,
    description: `${formatDate(today)} panchang: ${panchang.tithi.name.en} (${panchang.paksha}), ${panchang.nakshatra.name.en}...`,
  };
}
```

This works with ISR — the title updates on each revalidation (currently daily with 86400s TTL).

**Caveat:** The panchang and rahu kaal pages are currently `'use client'`. Their SSR conversion is in progress (separate WIP branch). Phase 4 dynamic metadata depends on this conversion completing. If the SSR work isn't done yet, proceed with improved static titles (Phase 2) and add dynamic titles when SSR lands.

### 3.3 Canonical Page Creation Strategy

**Current route structure (confirmed via codebase exploration):**
```
src/app/[locale]/festivals/
├── page.tsx                           # Hub page — lists all festivals
├── layout.tsx                         # Hub metadata
└── [slug]/
    └── [year]/
        └── [city]/
            ├── page.tsx               # ONLY detail page — requires city
            └── layout.tsx             # City-specific metadata
```

There is NO page at `/festivals/[slug]/[year]/` — only the city variant exists. We need to create the canonical route.

**Chosen approach: Option B — Add a sibling page.**

Create `src/app/[locale]/festivals/[slug]/[year]/page.tsx` alongside the existing `[city]/page.tsx`. Rationale:

- Option A (`[[city]]` optional catch-all) would require renaming `[city]` to `[[...city]]`, which changes the params type across the existing city page + layout and risks breaking the 2,000+ existing URLs.
- Option B is additive — the existing city route is untouched. The new page at `/festivals/[slug]/[year]/` renders the same content with a city selector instead of a fixed city.

**New canonical page behaviour:**
1. Compute festival date (same for all cities — based on tithi/nakshatra)
2. Show a "Popular Cities" muhurat table (top 6: Delhi, Mumbai, Bangalore, Chennai, Kolkata, Pune)
3. Include a city selector dropdown that links to the city-specific page (for users who want exact local times)
4. Full puja vidhi, significance, mantras — same content as city page
5. Title uses the date-first formula (no city in title)

---

## 4. Measurement

### 4.1 Success Metrics

| Metric | Current | Target (30 days post-launch) | Target (90 days) |
|--------|---------|------------------------------|-------------------|
| Overall CTR | 0.6% | 1.2% | 2.0%+ |
| Festival page CTR | 0.05-0.08% | 1.5% | 3.0% |
| Muhurta page CTR | 3-5% | 5-8% | 8%+ |
| Rahu Kaal CTR | 3.8% | 8% | 12%+ |
| Rich result eligible pages | ~8 | 50+ | 100+ |
| URLs in SERP per festival query | 25+ (cannibalising) | 1-2 (consolidated) | 1 (dominant) |

### 4.2 Monitoring

- **Weekly:** Pull GSC data via ADC API (now working), compare CTR by page type
- **Monthly:** Check rich result status in GSC → Enhancements → Events/FAQ
- **Per-deploy:** Spot-check 3 festival + 3 muhurta page titles via `curl -s | grep <title>`

### 4.3 Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Noindexing city pages causes temporary rank drop | Medium — Google may take 2-4 weeks to reconsolidate | Ship canonical tags 1 week before noindex. Monitor GSC daily. Roll back noindex if clicks drop >30% within 7 days. |
| Dynamic titles cause ISR cache staleness | Low — titles show yesterday's date | Revalidation at 86400s means at worst 24h stale. For rahu kaal (time-sensitive), consider shorter revalidation. |
| Event schema rejected by Google's rich result validator | Low | Test with Google's Rich Results Test before deploying. All schema must pass validation. |
| Title changes cause Google to re-evaluate rankings | Medium — short-term fluctuation normal | Change titles in batches (festivals first, then muhurta, then others). Don't change everything at once. |

---

## 5. Implementation Phases

### Phase 1: Fix Cannibalisation + Stale Titles (Days 1-3)
- Create canonical festival page: `src/app/[locale]/festivals/[slug]/[year]/page.tsx` + `layout.tsx` with multi-city muhurat table
- Add `robots: { index: false }` + canonical tag on city-variant `[city]/layout.tsx`
- Rewrite festival page titles + descriptions using the date-first formulas
- Slash sitemap from ~2,000 festival URLs to ~60 canonical URLs (20 festivals × 3 years, en+hi)
- Update internal links to point to canonical URLs
- **Fix stale muhurta dates:** Muhurta title templates currently show past dates (e.g., "Next: Apr 15" in May). Update muhurta `generateMetadata()` to compute the actual next date server-side, or if computation is too heavy for metadata, show `{Year}` only (no specific date that can go stale)

### Phase 2: Title + Description Rewrite (Days 3-4)
- Fix doubled `| Dekho Panchang | Dekho Panchang` bug in metadata chain
- Rewrite muhurta page title/description templates
- Rewrite rahu kaal, panchang, horoscope, dates page metadata
- Hindi/regional variants using the Hindi formulas above
- Verify all 10 locales generate correct metadata

### Phase 3: Structured Data (Days 5-6)
- Add `generateEventLD()` to `src/lib/seo/json-ld.ts`
- Emit Event schema on all festival pages
- Add `generateFAQLD()` helper
- Add FAQ sections + schema to top 10 pages by impressions
- Validate all schema with Google Rich Results Test

### Phase 4: Dynamic Metadata for Daily Pages (Days 7-8)
- Panchang page: dynamic title with today's tithi + nakshatra
- Rahu Kaal page: dynamic title with today's times (depends on SSR conversion)
- Horoscope pages: dynamic title with today's date
- Dates pages: dynamic title with next upcoming date

### Phase 5: Verify + Monitor (Day 9+)
- Spot-check all modified page titles via curl
- Submit updated sitemap to GSC
- Request re-crawl of top 20 pages via GSC URL Inspection
- Set up weekly GSC pull script for ongoing monitoring
- Review rich result status after 7 days

---

## 6. Out of Scope

- Creating new pages or routes (except the canonical festival route if needed)
- Content changes to page body text
- Backlink acquisition or off-page SEO
- Page speed optimisation (separate concern)
- SSR conversion of remaining `'use client'` pages (in progress separately)

---

## 7. Dependencies

- **SSR conversion of rahu-kaal, panchang** (in progress, WIP branch) — Phase 4 dynamic metadata for these pages requires server-side `generateMetadata()`. Phases 1-3 can proceed independently. If SSR isn't done when Phase 4 starts, use improved static titles as a fallback.
- **ISR revalidation** — currently at 86400s. Dynamic titles will be at most 24h stale. Acceptable for festival/muhurta pages. For daily pages (panchang, rahu kaal), consider 3600s revalidation for the metadata computation only (not the full page).
- **Festival page route structure** — confirmed: no canonical page exists today. Option B (sibling page.tsx) chosen to avoid breaking existing city routes. New files needed: `[slug]/[year]/page.tsx` + `[slug]/[year]/layout.tsx`.

---

## 8. Critical Review

Issues found during self-review and codebase exploration:

### 8.1 Corrections Made

1. **Festival route structure was assumed, not verified.** The original draft proposed `[[city]]` optional catch-all without checking the actual file structure. Investigation revealed only the 3-segment city route exists. Changed to Option B (sibling page) to avoid breaking 2,000+ existing URLs.

2. **Doubled brand was misattributed.** Draft blamed muhurta pages and "template + layout both appending." Investigation confirmed the root layout template is correct — the bug is specifically in 8 `PAGE_META` entries that redundantly include the suffix. Muhurta pages are NOT affected. Fix list is now exact with line numbers.

3. **Sitemap scale was understated.** Draft said "25+ variants per festival." Actual count: ~2,000 festival URLs in sitemap (20 festivals × 50 cities × 2+ years). This is the core of the cannibalisation — we're actively inviting Google to index all 2,000 variants.

### 8.2 Risks Not Originally Covered

4. **Stale "Next: Apr 15" in muhurta titles.** The muhurta title says `Next: Apr 15` but that date is in the past. This is actively harmful — searchers see a stale date and skip. This is more urgent than the description rewrite. The title formula must use server-side computation to show the true next date, or if static, show the year only (not a specific past date). **Priority: Move to Phase 1 alongside festival fix.**

5. **City pages still receive traffic.** Some city-specific pages rank for city-specific queries (e.g., "kn/muhurta/property/2026/may/bangalore" ranks for Kannada property muhurta queries). Noindexing ALL city festival pages could kill these legitimate city+locale rankings. **Mitigation:** Only noindex city festival pages for locales where the canonical `/en/festivals/` page exists. For non-English locales where we don't have a canonical, keep the highest-traffic city variant indexed and noindex the rest.

6. **Event schema "offers" field is questionable.** The draft includes an `Offer` with `price: 0` — this is not a ticketed event. Google may penalise or ignore Event schema for religious observances that aren't events in the "attending an event" sense. **Mitigation:** Use `Event` schema only for festivals with a specific date/time window (ganesh chaturthi puja muhurat, diwali lakshmi puja). For date-lookup pages (akshaya tritiya date), use `FAQPage` or `WebPage` with `datePublished`/`dateModified` instead.

7. **Hindi muhurta titles mix scripts.** The formula `यात्रा मुहूर्त 2026: अगला 15 मई (शुक्रवार) | Dekho Panchang` mixes Devanagari with Latin brand name. This is unavoidable for the brand, but the `| Dekho Panchang` portion comes from the root layout template and can't be locale-switched without template changes. **Accepted as-is** — the brand is "Dekho Panchang" in Latin across all locales.

### 8.3 Open Questions

8. **Should canonical festival pages show Delhi by default or a multi-city table?** Multi-city is better for the user, but the page becomes heavier. Recommendation: show a compact 6-city muhurat table (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Pune) with a "See all cities" link. This also gives Google rich content to index.

9. **Do we need separate canonical pages for en and hi?** Yes — the hreflang system handles this. `/en/festivals/ganesh-chaturthi/2027` and `/hi/festivals/ganesh-chaturthi/2027` are separate canonicals, each for their locale. Only index en + hi (the 4 active locales). Other locales should canonical to en.

10. **ISR revalidation for panchang/rahu kaal: 3600s vs 86400s.** Dynamic titles showing "today's tithi" need daily freshness. 86400s means titles could be 24h stale (showing yesterday's tithi). 3600s revalidation for just the metadata would be ideal, but Next.js revalidation applies to the whole page, not just metadata. **Recommendation:** Accept 86400s for now. A user seeing yesterday's tithi in the Google SERP at 12:01 AM is a minor issue — the page itself shows the correct live data once they click through.
