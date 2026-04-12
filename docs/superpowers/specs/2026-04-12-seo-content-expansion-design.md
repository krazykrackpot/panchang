# SEO Content Expansion — Design Spec

**Date:** 2026-04-12
**Goal:** Drive organic traffic through programmatic content pages, rich schema markup, and internal linking — executed in 3 tiers by traffic potential.

---

## Tier 1: High-Volume Daily & Evergreen Pages

### 1A. Standalone Rahu Kaal & Choghadiya Pages

**Routes:**
- `/[locale]/rahu-kaal/` — "Rahu Kaal Today"
- `/[locale]/choghadiya/` — "Choghadiya Today"

**Rendering:** Server component with locale-inferred default city (hi→Delhi, ta→Chennai, te→Hyderabad, bn→Kolkata, kn→Bangalore, sa/en→Delhi). Client-side city switcher swaps data without URL change.

**Content per page:**
- H1: "Rahu Kaal Today — {Date}" (city shown in subtitle, not H1)
- Visual timeline bar showing the inauspicious window within the day
- Time table: Rahu Kaal (+ Yamaganda, Gulika for rahu-kaal page), all 8 Choghadiya periods (for choghadiya page)
- Quick city selector bar (top 10 cities from `cities.ts`)
- Educational section below fold: "What is Rahu Kaal?", "How it's calculated", "Activities to avoid"
- FAQ schema JSON-LD (3-5 FAQs)
- Internal links: main panchang page, city pages, each other

**SEO:**
- `PAGE_META` entries with multilingual title/description/keywords
- BreadcrumbList + FAQPage JSON-LD
- Sitemap entries for all locales
- Navbar: add to Tools dropdown

### 1B. 12 Individual Rashi Detail Pages

**Route:** `/[locale]/panchang/rashi/[id]/` where id is slug: `mesh`, `vrishabh`, `mithun`, `kark`, `simha`, `kanya`, `tula`, `vrishchik`, `dhanu`, `makar`, `kumbh`, `meen`

**Data constant:** `src/lib/constants/rashi-details.ts`
```ts
type MultilingualText = Record<string, string>;

interface RashiDetail {
  id: number;           // 1-12
  slug: string;         // URL slug
  name: MultilingualText;
  symbol: MultilingualText;
  element: MultilingualText;
  modality: MultilingualText;
  rulingPlanet: number; // planet ID (0-8)
  personality: MultilingualText;
  career: MultilingualText;
  health: MultilingualText;
  relationships: MultilingualText;
  strengths: MultilingualText;
  challenges: MultilingualText;
  luckyNumbers: number[];
  luckyColors: MultilingualText;
  luckyGems: MultilingualText;
  compatibleRashis: number[];  // rashi IDs
  faqs: Array<{ question: MultilingualText; answer: MultilingualText }>;
}
```

Content starts en + hi; `tl()` falls back to `en` for all other locales.

**Page structure:**
1. Hero: Rashi SVG icon (existing `RashiIcons`) + name + element badge
2. Quick info grid: ruler, element, modality, lucky numbers/colors/gems
3. Personality & Traits section (~300 words)
4. Career section (~150 words)
5. Health section (~150 words)
6. Relationships section (~150 words)
7. **Dynamic "Today for {Rashi}" section** — client-fetched from existing `daily-engine.ts`: score breakdown (career/love/health/finance/spirituality), lucky time, one-line prediction
8. Compatible rashis cards (link to pair pages in Tier 3)
9. Related nakshatras list (nakshatras falling in this rashi)
10. FAQ accordion with FAQPage JSON-LD

**SEO:**
- `PAGE_META` per rashi
- BreadcrumbList + FAQPage JSON-LD
- `generateStaticParams()` for all slugs x all locales
- Sitemap entries

**Internal linking:**
- FROM: rashi index page, horoscope page (each rashi card), nakshatra detail pages (parent rashi), matching page, heatmap (Tier 3)
- TO: horoscope page, matching tool, related nakshatra pages, compatibility pair pages

---

## Tier 2: Seasonal Content & Schema Expansion

### 2A. Yearly Date Listing Pages

**Route:** `/[locale]/dates/[category]/` where category is: `ekadashi`, `purnima`, `amavasya`, `pradosham`, `chaturthi`

**Data source:** Existing `tithi-table.ts` engine + `festival-generator.ts`. Filter tithi entries by:
- ekadashi: tithi 11 (both pakshas)
- purnima: tithi 15
- amavasya: tithi 30
- pradosham: tithi 13 (both pakshas)
- chaturthi: tithi 4 (both pakshas, focus on Krishna Chaturthi for Sankashti)

**Page structure:**
- H1: "Ekadashi 2026 — Complete Dates, Timings & Parana Schedule"
- Year navigator (prev/next)
- Monthly sections with anchor links
- Table per month: Date | Day | Name | Start-End times | Nakshatra | Associated vrat | Puja vidhi link
- For Ekadashi: Parana (fast-breaking) time from next-day calculation
- Summary stats: "26 Ekadashis in 2026, next one is {date}"
- FAQ section with FAQPage JSON-LD

**SEO:**
- `PAGE_META` per category
- BreadcrumbList + FAQPage JSON-LD
- Sitemap entries (one per category per locale, yearly refresh via `lastmod`)

**Internal linking:**
- FROM: calendar page (filter buttons become links too), festival detail pages ("See all Ekadashi dates"), navbar Calendars dropdown
- TO: individual festival/vrat detail pages, puja vidhi pages, main calendar

### 2B. FAQ Schema Expansion

**New file:** `src/lib/seo/faq-data.ts`
```ts
interface FAQEntry {
  question: Record<string, string>;  // multilingual
  answer: Record<string, string>;
}

const FAQ_DATA: Record<string, FAQEntry[]> = {
  '/panchang': [ ... ],      // 3-5 FAQs
  '/panchang/tithi': [ ... ],
  '/panchang/nakshatra': [ ... ],
  '/panchang/yoga': [ ... ],
  '/panchang/rashi': [ ... ],
  '/matching': [ ... ],
  '/horoscope': [ ... ],
  '/kundali': [ ... ],
  '/muhurta-ai': [ ... ],
  '/rahu-kaal': [ ... ],
  '/choghadiya': [ ... ],
};
```

**Helper:** `generateFAQLD(route: string, locale: string)` — returns FAQPage JSON-LD or null if no FAQs for that route.

**Integration:** Each page's `layout.tsx` or `page.tsx` injects FAQ JSON-LD via `<script type="application/ld+json">`. Approximately 11 pages updated.

---

## Tier 3: Content Reach Expansion

### 3A. Multi-City Daily Articles

**Route:** `/[locale]/daily/[date]/[city]/` — city-specific variant

**Cities:** Top 10 by search volume: Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Jaipur, Lucknow, Varanasi (slugs from `cities.ts`)

**Changes to `generateDailyArticle()`:**
- Accept `city?: CityConfig` parameter (currently hardcoded to Delhi)
- Compute panchang with city's coordinates and timezone
- Add city-specific narrative variation: "In {city}, with sunset at {time}, evening prayers begin at..." — not just swapped numbers but contextual framing based on regional traditions
- Delhi remains the default for `/daily/[date]/` (no city param)

**Article JSON-LD:** Add `contentLocation` with city GeoCoordinates.

**Sitemap:** Dynamic generation — last 30 days + next 7 days x 10 cities x 7 locales. `generateStaticParams()` pre-renders today + yesterday only; older dates via ISR with 1-day revalidation.

**Internal linking:**
- `/daily/[date]/` page shows "View for other cities" links
- City panchang pages (`/panchang/[city]/`) link to today's daily article for that city

### 3B. Per-Rashi Section in Daily Articles

**Not a new route** — extends existing daily article pages.

- Add "Today's Horoscope by Rashi" section after panchang content
- 12 expandable cards pulling from `daily-engine.ts`
- Each card: rashi icon, overall score (5-star or /10), one-line prediction, lucky color/number
- Click expands: career/love/health/finance breakdown
- Each card links to `/panchang/rashi/[id]/`
- Adds ~400 words of unique content per article

### 3C. Rashi Compatibility Heatmap + Pair Pages

**Heatmap index route:** `/[locale]/matching/compatibility/`

**Heatmap page:**
- H1: "Vedic Rashi Compatibility Chart"
- 12x12 CSS Grid with rashi names on both axes
- Cell colors: deep red (#8b1a1a at ~20%) → amber (#d4a853 at ~40%) → green/gold (#4ade80 at ~30%) based on compatibility score
- Score number visible in each cell
- Hover tooltip: one-line summary (e.g., "Fiery alliance — strong passion, potential power struggles")
- Click → navigates to detail page
- Grid is visually symmetric; both directions navigate to same canonical URL
- Mobile: horizontal scroll with sticky first column, or dropdown pickers ("Select Rashi 1" + "Select Rashi 2") → shows result card
- Scores computed server-side from Ashta Kuta engine with representative birth configs (Sun at 15° of each rashi, Moon at 15° of each rashi)

**Pair detail route:** `/[locale]/matching/[rashi1]-and-[rashi2]/` using rashi slugs (e.g., `mesh-and-vrishabh`)

Canonical ordering: lower rashi ID first (mesh=1 always before vrishabh=2). Reverse URL (`vrishabh-and-mesh`) redirects to canonical.

**Pair page content — generated from astrological rules, NOT templates:**
- Element compatibility (fire+fire=volatile passion, fire+earth=grounding, etc.)
- Lord friendship from traditional Graha Maitri table (Surya-Chandra=friend, Surya-Shani=enemy)
- Natural house relationship (kendra/trikona/dusthana from each other)
- Nadi & Gana kuta scores from Ashta Kuta
- Sections: Overall Score, Temperament, Communication, Romance, Career Partnership, Challenges, Remedies

**Content constant:** `src/lib/constants/rashi-compatibility.ts` — generated programmatically from astrological rules, then reviewed. Each pair gets unique content because the underlying astrology genuinely differs.

**Data structure:**
```ts
interface RashiPairContent {
  rashi1: number;
  rashi2: number;
  score: number;           // 0-36 Ashta Kuta score
  summary: Record<string, string>;
  temperament: Record<string, string>;
  communication: Record<string, string>;
  romance: Record<string, string>;
  career: Record<string, string>;
  challenges: Record<string, string>;
  remedies: Record<string, string>;
}
```

**SEO per pair page:**
- H1: "{Rashi1} and {Rashi2} Compatibility — Vedic Astrology Analysis"
- BreadcrumbList + FAQPage JSON-LD
- 78 sitemap entries x 7 locales

**Internal linking:**
- FROM: heatmap page (primary), both rashi detail pages (compatible rashis section), matching tool results page
- TO: both rashi detail pages, matching tool, horoscope page

---

## Cross-Cutting Concerns

### Sitemap Impact
- Current: ~2,485 entries
- New: ~470 entries x 7 locales = ~3,290
- Total: ~5,775 entries
- All new entries include `<lastmod>` and priority tiers (daily content=0.7, evergreen=0.6)

### Multilingual
- All new content constants use `Record<string, string>` (not `Trilingual`)
- Content authored in en + hi initially
- `tl()` helper provides en fallback for all other locales
- Locale config at `src/lib/i18n/config.ts` (currently 7 locales) is the single source of truth

### Navbar Updates
- Tools dropdown: add Rahu Kaal, Choghadiya (14 items total — may need visual subcategorization)
- Calendars dropdown: add Dates section linking to Ekadashi/Purnima/etc. pages

### Performance
- Heatmap: 78 Ashta Kuta computations server-side — benchmark, precompute to static JSON if >100ms
- Daily city articles: ISR with 1-day revalidation, pre-render only today+yesterday
- Rashi detail "today" section: client-fetched, does not block SSR

### New Files Summary
- `src/lib/constants/rashi-details.ts` — 12 rashi personality content
- `src/lib/constants/rashi-compatibility.ts` — 78 pair content (generated from astro rules)
- `src/lib/seo/faq-data.ts` — FAQ data for ~11 pages
- `src/app/[locale]/rahu-kaal/page.tsx` + `layout.tsx`
- `src/app/[locale]/choghadiya/page.tsx` + `layout.tsx`
- `src/app/[locale]/panchang/rashi/[id]/page.tsx` + `layout.tsx`
- `src/app/[locale]/dates/[category]/page.tsx` + `layout.tsx`
- `src/app/[locale]/daily/[date]/[city]/page.tsx` + `layout.tsx`
- `src/app/[locale]/matching/compatibility/page.tsx` + `layout.tsx`
- `src/app/[locale]/matching/[pair]/page.tsx` + `layout.tsx`
- Updates to: sitemap.ts, metadata.ts, structured-data.ts, daily-article.ts, navbar, ~11 existing layouts for FAQ injection
