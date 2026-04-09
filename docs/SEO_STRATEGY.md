# Dekho Panchang — SEO Strategy & Implementation

> Comprehensive documentation of all SEO measures implemented across dekhopanchang.com.
> Last updated: April 2026.

---

## Table of Contents

1. [Brand Recognition & Entity Establishment](#1-brand-recognition--entity-establishment)
2. [Structured Data (JSON-LD)](#2-structured-data-json-ld)
3. [Metadata System](#3-metadata-system)
4. [Sitemap & Crawlability](#4-sitemap--crawlability)
5. [Multilingual SEO (Hreflang)](#5-multilingual-seo-hreflang)
6. [OpenGraph & Social Cards](#6-opengraph--social-cards)
7. [Robots & Bot Policy](#7-robots--bot-policy)
8. [Performance & Core Web Vitals](#8-performance--core-web-vitals)
9. [Content Architecture & Internal Linking](#9-content-architecture--internal-linking)
10. [Brand Search Optimization](#10-brand-search-optimization)
11. [Ongoing SEO Checklist](#11-ongoing-seo-checklist)
12. [File Reference Map](#12-file-reference-map)

---

## 1. Brand Recognition & Entity Establishment

### Problem
When users search "dekhopanchang," Google may suggest "Did you mean: drik panchang" because it hasn't established "Dekho Panchang" as a known entity. This is a cold-start brand recognition issue.

### Solution: Organization & WebSite Schemas

We inject three JSON-LD blocks on every page via the root layout (`src/app/[locale]/layout.tsx`):

#### Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Dekho Panchang",
  "alternateName": ["DekhoPanchang", "dekhopanchang", "Dekho Panchang - Vedic Astrology"],
  "url": "https://dekhopanchang.com",
  "logo": "https://dekhopanchang.com/apple-touch-icon.png",
  "description": "Dekho Panchang is a free Vedic astrology platform...",
  "foundingDate": "2024",
  "sameAs": [
    // Social profiles go here — each one strengthens entity signals
  ]
}
```

**Why `alternateName` matters:** Google uses these to understand that "DekhoPanchang", "dekhopanchang", and "Dekho Panchang" all refer to the same entity. This directly combats the "Did you mean" problem.

#### WebSite Schema with SearchAction
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Dekho Panchang",
  "alternateName": ["DekhoPanchang", "dekhopanchang"],
  "url": "https://dekhopanchang.com",
  "inLanguage": ["en", "hi", "sa"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://dekhopanchang.com/en?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

**Why this matters:** The SearchAction enables Google's sitelinks search box, which only appears for recognized brands. Once Google grants this, it's a strong signal that "dekhopanchang" is a real entity.

#### SoftwareApplication Schema
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Dekho Panchang",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web",
  "publisher": { "@type": "Organization", "name": "Dekho Panchang" }
}
```

### Implementation
- **File:** `src/lib/seo/structured-data.ts` — helper functions
- **Injection:** `src/app/[locale]/layout.tsx` — three `<script type="application/ld+json">` blocks
- All three schemas appear on every page, every locale

---

## 2. Structured Data (JSON-LD)

Beyond the global schemas, we add page-specific structured data to key sections:

| Page/Section | Schema Type | File | Purpose |
|---|---|---|---|
| Every page | `Organization` | `layout.tsx` (root) | Brand entity establishment |
| Every page | `WebSite` + `SearchAction` | `layout.tsx` (root) | Sitelinks search box eligibility |
| Every page | `SoftwareApplication` | `layout.tsx` (root) | App store / rich result eligibility |
| Daily Panchang | `Event` | `panchang/layout.tsx` | Today's panchang as a daily event |
| Kundali Generator | `SoftwareApplication` | `kundali/layout.tsx` | Tool-specific app schema |
| Learn Section | `Course` | `learn/layout.tsx` | Educational content recognition |
| Puja Vidhis | `HowTo` + `HowToStep` | `puja/[slug]/layout.tsx` | Step-by-step rich results |
| Festival Calendar | `Article` | `calendar/[slug]/layout.tsx` | Article rich results |
| Multiple sections | `BreadcrumbList` | Various layouts | Breadcrumb trail in SERPs |

### Breadcrumb Generation
- **Helper:** `generateBreadcrumbLD(pathname, locale)` in `structured-data.ts`
- Automatically generates breadcrumb JSON-LD from URL path segments
- Maps URL slugs to human-readable names via `DISPLAY_NAMES` dictionary
- Used in learn, puja, calendar, and other hierarchical sections

### Validation
Test all schemas at:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## 3. Metadata System

### Architecture
All SEO metadata is centralized in `src/lib/seo/metadata.ts` — a single source of truth for 90+ routes.

### Structure
```typescript
interface PageMeta {
  title: { en: string; hi: string; sa: string };
  description: { en: string; hi: string; sa: string };
  keywords?: string[];
}

const PAGE_META: Record<string, PageMeta> = {
  '/panchang': {
    title: {
      en: 'Daily Panchang — Tithi, Nakshatra, Yoga, Karana Today',
      hi: 'आज का पंचांग — तिथि, नक्षत्र, योग, करण',
      sa: 'दैनिकपञ्चाङ्गम् — तिथिः नक्षत्रं योगः करणम्',
    },
    description: { ... },
    keywords: ['panchang today', 'daily panchang', ...],
  },
  // ... 90+ routes
};
```

### `getPageMetadata()` Function
The helper builds a complete Next.js `Metadata` object for any route:
- Localized title and description
- Canonical URL with locale prefix
- Hreflang alternates (en, hi, sa, x-default)
- OpenGraph with locale mapping (en_US, hi_IN, sa_IN)
- Twitter Card (summary_large_image)
- Keyword arrays

### Title Template
```
%s | Dekho Panchang
```
Every page title ends with the brand name, reinforcing brand recognition in SERPs.

### Coverage
- **Core:** Panchang, Kundali, Matching, Calendar, About, Pricing
- **Deep Dives:** Tithi, Nakshatra, Yoga, Karana, Muhurta, Grahan, Rashi, Masa, Samvatsara
- **Learn (9+ pages):** Foundations, Grahas, Rashis, Nakshatras, Tithis, Yogas, Karanas, Muhurtas, Kundali
- **Tools (12):** Sign Calculator, Sade Sati, Prashna, Baby Names, Shraddha, Vedic Time, etc.
- **Calendars (6):** Festival Calendar, Transits, Retrograde, Eclipses, Muhurat, Regional
- **Dynamic:** Puja vidhis (40+ slugs), festival articles (30+ slugs)

---

## 4. Sitemap & Crawlability

### Dynamic Sitemap
**File:** `src/app/sitemap.ts`

Generates a complete XML sitemap at `/sitemap.xml` with:

| Feature | Implementation |
|---|---|
| **Static routes** | 100+ routes × 3 locales |
| **Dynamic routes** | Puja slugs (40+), calendar slugs (30+) |
| **Hreflang** | Every entry has `languages` with en, hi, sa, x-default |
| **Priorities** | 1.0 (homepage), 0.9 (panchang), 0.8 (kundali/matching), 0.6 (others) |
| **Change frequency** | `daily` (home/panchang), `weekly` (tools), `monthly` (details) |
| **x-default** | Points to `/en` variant |

### Sitemap Reference
```
https://www.dekhopanchang.com/sitemap.xml
```
Declared in `robots.txt` so crawlers auto-discover it.

---

## 5. Multilingual SEO (Hreflang)

### Three Languages
| Code | Language | Locale | OpenGraph Locale |
|---|---|---|---|
| `en` | English | en_US | en_US |
| `hi` | Hindi | hi_IN | hi_IN |
| `sa` | Sanskrit | sa_IN | sa_IN |

### Implementation
1. **URL structure:** `/{locale}/path` — e.g., `/en/panchang`, `/hi/panchang`, `/sa/panchang`
2. **Hreflang in metadata:** Every page's `generateMetadata` includes:
   ```typescript
   alternates: {
     canonical: `${BASE_URL}/${locale}/path`,
     languages: {
       en: `${BASE_URL}/en/path`,
       hi: `${BASE_URL}/hi/path`,
       sa: `${BASE_URL}/sa/path`,
       'x-default': `${BASE_URL}/en/path`,
     },
   }
   ```
3. **Hreflang in sitemap:** Every sitemap entry includes language alternates
4. **x-default:** Always points to English (`/en`) variant
5. **i18n framework:** `next-intl` handles locale routing and message loading

### Trilingual Content
All page-specific content uses `Trilingual` type (`{ en, hi, sa }`) — titles, descriptions, labels, and keywords are available in all three languages.

---

## 6. OpenGraph & Social Cards

### Dynamic OG Images
Generated at build time using Next.js `ImageResponse` (edge runtime):

| Route | File | Dimensions |
|---|---|---|
| Root | `src/app/opengraph-image.tsx` | 1200 × 630 |
| Per-locale root | `src/app/[locale]/opengraph-image.tsx` | 1200 × 630 |
| Panchang | `src/app/[locale]/panchang/opengraph-image.tsx` | 1200 × 630 |
| Kundali | `src/app/[locale]/kundali/opengraph-image.tsx` | 1200 × 630 |
| Learn | `src/app/[locale]/learn/opengraph-image.tsx` | 1200 × 630 |
| Matching | `src/app/[locale]/matching/opengraph-image.tsx` | 1200 × 630 |

### Twitter Cards
- Matching `twitter-image.tsx` files for key routes
- Card type: `summary_large_image`
- Consistent gold/gradient branding across all images

### OpenGraph Configuration
```typescript
openGraph: {
  title,
  description,
  url,
  siteName: 'Dekho Panchang',
  locale: 'en_US' | 'hi_IN' | 'sa_IN',
  type: 'website',
  images: [{ url, width: 1200, height: 630, alt: 'Dekho Panchang — Vedic Astrology' }],
}
```

---

## 7. Robots & Bot Policy

### File: `public/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://www.dekhopanchang.com/sitemap.xml

# Protected paths
Disallow: /api/
Disallow: /_next/
Disallow: /*/auth/
Disallow: /*/settings/
Disallow: /*/profile/

# AI training bot blocking
User-agent: GPTBot
Disallow: /
User-agent: ChatGPT-User
Disallow: /
User-agent: CCBot
Disallow: /
```

### Rationale
- **API routes:** No indexable content, prevent unnecessary crawling
- **Private pages:** Auth, settings, profile — user-specific, no SEO value
- **AI bots:** Block GPTBot, ChatGPT-User, CCBot from scraping content for training
- **All other crawlers:** Full access to all public content

---

## 8. Performance & Core Web Vitals

### Monitoring
- **Vercel Analytics:** Client-side real-user metrics (FCP, LCP, CLS, FID)
- **Vercel Speed Insights:** Synthetic performance monitoring
- Both injected in root layout via `<Analytics />` and `<SpeedInsights />`

### PWA Support
- **Manifest:** `public/manifest.json` with theme color `#0a0e27`
- **Service Worker:** Registered via `ServiceWorkerRegistrar` component
- **Offline:** `OfflineBanner` component for connectivity loss
- **Install Prompt:** `InstallPrompt` component for add-to-home-screen
- **Apple Touch Icon:** `public/apple-touch-icon.png`
- **Favicon:** `public/favicon.svg` (SVG for crisp rendering at all sizes)

### Font Strategy
External Google Fonts with `display=swap`:
- **Cormorant Garamond:** Elegant serif for headings
- **Inter:** Clean sans-serif for body text
- **Tiro Devanagari:** Hindi/Sanskrit heading text
- **Noto Sans Devanagari:** Hindi/Sanskrit body text

### Server-Side Rendering
- All pages use Server Components by default (zero client JS overhead)
- Client components only where interactivity is required
- Streaming SSR with React Suspense boundaries

---

## 9. Content Architecture & Internal Linking

### URL Hierarchy
```
dekhopanchang.com/
├── {locale}/                          # Homepage
├── {locale}/panchang/                 # Daily Panchang
│   ├── tithi/                         # Deep dive: Tithis
│   ├── nakshatra/                     # Deep dive: Nakshatras
│   │   └── {id}/                      # Individual nakshatra pages (27)
│   ├── yoga/                          # Deep dive: Yogas
│   ├── karana/                        # Deep dive: Karanas
│   ├── muhurta/                       # Deep dive: Muhurtas
│   ├── grahan/                        # Deep dive: Eclipses
│   ├── rashi/                         # Deep dive: Rashis
│   ├── masa/                          # Deep dive: Lunar months
│   └── samvatsara/                    # Deep dive: 60-year cycle
├── {locale}/kundali/                  # Kundali Generator
│   └── {id}/                          # Saved chart view
├── {locale}/matching/                 # Kundali Matching
├── {locale}/calendar/                 # Festival Calendar
│   └── {slug}/                        # Individual festivals (30+)
├── {locale}/learn/                    # Learning Hub
│   ├── grahas/                        # Planets
│   ├── rashis/                        # Signs
│   ├── nakshatras/                    # Lunar mansions
│   ├── tithis/                        # Lunar days
│   ├── yogas/                         # Yogas explained
│   ├── karanas/                       # Karanas explained
│   ├── muhurtas/                      # Auspicious times
│   └── kundali/                       # Birth chart basics
├── {locale}/puja/{slug}/              # Puja Vidhis (40+)
├── {locale}/transits/                 # Transit tracker
├── {locale}/retrograde/               # Retrograde calendar
├── {locale}/eclipses/                 # Eclipse calendar
├── {locale}/muhurat/                  # Muhurat calendar
├── {locale}/sign-calculator/          # Rashi calculator
├── {locale}/baby-names/               # Vedic baby names
├── {locale}/sade-sati/                # Sade Sati checker
├── {locale}/vedic-time/               # Vedic time converter
├── {locale}/varshaphal/               # Solar return
├── {locale}/kp-system/                # KP astrology
├── {locale}/prashna/                  # Horary astrology
├── {locale}/prashna-ashtamangala/     # Kerala horary
├── {locale}/muhurta-ai/               # AI muhurta finder
├── {locale}/shraddha/                 # Shraddha calculator
├── {locale}/devotional/               # Devotional content
└── {locale}/upagraha/                 # Sub-planet calculator
```

### Internal Linking Strategy
- **Navbar mega menu:** Links to all major sections (Calendars, Tools)
- **Footer:** Comprehensive sitemap-style link grid
- **Cross-linking within deep dives:** Each panchang element links to related learn pages
- **Breadcrumbs:** JSON-LD breadcrumb trails for hierarchical sections
- **Related content:** Learn pages link to corresponding tool pages and vice versa

---

## 10. Brand Search Optimization

### Current Status
Google's "Did you mean: drik panchang" indicates low brand recognition. Here's the multi-pronged strategy to fix this:

### Technical Measures (Implemented)
1. **Organization schema** with `alternateName` variants (DekhoPanchang, dekhopanchang)
2. **WebSite schema** with SearchAction for sitelinks search box
3. **Consistent brand name** in title template: `%s | Dekho Panchang`
4. **Brand in OG siteName:** `siteName: 'Dekho Panchang'` on every page

### Off-Site Measures (Action Required)

#### Google Search Console
- [ ] Verify `dekhopanchang.com` in Google Search Console
- [ ] Submit sitemap: `https://www.dekhopanchang.com/sitemap.xml`
- [ ] Monitor "Queries" report for brand searches
- [ ] Use URL inspection tool on key pages

#### Google Knowledge Panel
- [ ] Create a Wikidata entry for "Dekho Panchang" (Q-ID)
- [ ] Link Wikidata to the website URL
- [ ] Once Knowledge Panel appears, claim it via Google Search Console

#### Social Profiles (Feed `sameAs` in Organization Schema)
Each verified social profile adds an entity signal. Create and maintain:
- [ ] Twitter/X: @dekhopanchang
- [ ] YouTube: @dekhopanchang
- [ ] Instagram: @dekhopanchang
- [ ] GitHub: dekhopanchang (for open-source credibility)
- [ ] LinkedIn company page

After creating each, add the URL to the `sameAs` array in `generateOrganizationLD()`.

#### Google Business Profile
- [ ] Create a Google Business Profile (if applicable as a "Software Company")
- [ ] Link to website

#### Brand Mentions
- Publish guest posts, astrology community contributions, and forum answers that mention "Dekho Panchang" by name
- Press releases, Product Hunt launch, directory submissions
- The goal: Google sees "Dekho Panchang" referenced on external sites, confirming it's a real entity

#### Content Differentiation from Drik Panchang
Focus content on what Drik Panchang doesn't offer:
- **Trilingual support** (Hindi + Sanskrit — not just English)
- **Kundali generation** with detailed interpretations (Tippanni)
- **Muhurta AI** — intelligent auspicious time finder
- **KP System, Varshaphal, Prashna** — advanced Jyotish tools
- **Learn section** — structured educational content
- **40+ Puja Vidhis** — ritual procedure guides

---

## 11. Ongoing SEO Checklist

### When Adding a New Page
- [ ] Add trilingual metadata to `PAGE_META` in `src/lib/seo/metadata.ts`
- [ ] Add route to `routes` array in `src/app/sitemap.ts`
- [ ] Use `getPageMetadata()` in the page's `generateMetadata` or layout
- [ ] Add breadcrumb JSON-LD if the page is in a hierarchy
- [ ] Ensure hreflang alternates are generated (automatic via metadata helper)
- [ ] Add OpenGraph image if the section is high-traffic
- [ ] Verify with Google Rich Results Test after deploy

### When Adding a New Dynamic Section
- [ ] Add dynamic slug generation to sitemap (like puja and calendar slugs)
- [ ] Add appropriate schema type (Article, HowTo, FAQPage, etc.)
- [ ] Ensure `generateStaticParams` covers all slugs

### Monthly Review
- [ ] Check Google Search Console for crawl errors
- [ ] Review "Queries" for brand search trends
- [ ] Validate all structured data (Google Rich Results Test)
- [ ] Check Core Web Vitals in Vercel Analytics
- [ ] Update sitemap priorities based on traffic data
- [ ] Verify robots.txt is not blocking important pages

---

## 12. File Reference Map

| Purpose | File Path |
|---|---|
| **Metadata definitions** | `src/lib/seo/metadata.ts` |
| **Structured data helpers** | `src/lib/seo/structured-data.ts` |
| **Root layout (schema injection)** | `src/app/[locale]/layout.tsx` |
| **Sitemap generator** | `src/app/sitemap.ts` |
| **Robots.txt** | `public/robots.txt` |
| **PWA manifest** | `public/manifest.json` |
| **Favicon** | `public/favicon.svg` |
| **Apple touch icon** | `public/apple-touch-icon.png` |
| **OG image (root)** | `src/app/opengraph-image.tsx` |
| **OG image (locale)** | `src/app/[locale]/opengraph-image.tsx` |
| **OG image (panchang)** | `src/app/[locale]/panchang/opengraph-image.tsx` |
| **OG image (kundali)** | `src/app/[locale]/kundali/opengraph-image.tsx` |
| **OG image (learn)** | `src/app/[locale]/learn/opengraph-image.tsx` |
| **OG image (matching)** | `src/app/[locale]/matching/opengraph-image.tsx` |
| **Twitter image** | `src/app/[locale]/twitter-image.tsx` |
| **Panchang schema** | `src/app/[locale]/panchang/layout.tsx` |
| **Kundali schema** | `src/app/[locale]/kundali/layout.tsx` |
| **Learn schema** | `src/app/[locale]/learn/layout.tsx` |
| **Puja schema** | `src/app/[locale]/puja/[slug]/layout.tsx` |
| **Festival schema** | `src/app/[locale]/calendar/[slug]/layout.tsx` |
| **i18n config** | `src/lib/i18n/config.ts` |
| **Locale messages** | `src/messages/{en,hi,sa}.json` |

---

## Appendix: Schema Validation Commands

```bash
# Test structured data locally (run dev server first)
curl -s http://localhost:3000/en | grep 'application/ld+json'

# Count JSON-LD blocks on a page
curl -s https://dekhopanchang.com/en | grep -c 'application/ld+json'

# Extract and pretty-print all JSON-LD from a page
curl -s https://dekhopanchang.com/en | \
  grep -oP '(?<=<script type="application/ld\+json">).*?(?=</script>)' | \
  python3 -m json.tool
```

## Appendix: Google Search Console API Queries

After verification, monitor these metrics:
- **Brand queries:** "dekho panchang", "dekhopanchang", "dekho panchang app"
- **Category queries:** "panchang today", "kundali online", "hindu calendar 2026"
- **Long-tail queries:** "tithi today [city]", "nakshatra today", "muhurta for [activity]"

Track the ratio of brand vs. non-brand traffic — the goal is to grow brand searches until Google no longer suggests "drik panchang."
