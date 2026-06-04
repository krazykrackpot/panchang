# Dekho Panchang — SEO Guide

> Complete reference for all SEO work: what's done, what's pending, and how to do it yourself.
> Written for someone new to the project who needs to maintain or extend SEO independently.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Metadata System](#2-metadata-system)
3. [Structured Data (JSON-LD)](#3-structured-data-json-ld)
4. [Sitemap](#4-sitemap)
5. [robots.txt](#5-robotstxt)
6. [OpenGraph & Social Cards](#6-opengraph--social-cards)
7. [Canonical URLs & hreflang](#7-canonical-urls--hreflang)
8. [RSS Feed](#8-rss-feed)
9. [Cross-Linking System](#9-cross-linking-system)
10. [FAQ Schema](#10-faq-schema)
11. [Performance SEO](#11-performance-seo)
12. [AdSense Setup](#12-adsense-setup)
13. [AI Crawler Management](#13-ai-crawler-management)
14. [Search Console & IndexNow](#14-search-console--indexnow)
15. [Checklist: Adding a New Page](#15-checklist-adding-a-new-page)
16. [Checklist: Adding a New Locale](#16-checklist-adding-a-new-locale)
17. [Pending / Future Work](#17-pending--future-work)
18. [Common Mistakes](#18-common-mistakes)

---

## 1. Architecture Overview

SEO is spread across these key files:

| File | Purpose |
|------|---------|
| `src/lib/seo/metadata.ts` | 241 PAGE_META entries (title, description, keywords per locale) |
| `src/lib/seo/structured-data.ts` | JSON-LD generators (Organization, WebSite, Tool, Breadcrumb, Event, HowTo, Person) |
| `src/lib/seo/article-ld.ts` | Article JSON-LD for 67 learn routes |
| `src/lib/seo/faq-data.ts` | 89 FAQ questions across 30 routes |
| `src/lib/seo/cross-links.ts` | Tool↔Learn internal linking maps |
| `src/lib/seo/contribution-jsonld.ts` | JSON-LD for 15 Indian science contribution pages |
| `src/lib/seo/indexnow.ts` | IndexNow URL submission helper |
| `src/app/sitemap.ts` | Dynamic sitemap (20,000+ URLs, 3 locales) |
| `src/app/api/feed/route.ts` | RSS 2.0 feed (16 items) |
| `src/app/[locale]/layout.tsx` | Root metadata, JSON-LD injection, meta tags |
| `src/components/learn/LearnArticleLD.tsx` | Article JSON-LD for learn page layouts |
| `src/components/ui/RelatedLinks.tsx` | Cross-link pill rendering |
| `public/robots.txt` | Crawler rules |
| `public/ads.txt` | AdSense publisher verification |
| `public/llms.txt` | AI assistant guidance document |
| `public/manifest.json` | PWA manifest |

---

## 2. Metadata System

### How it works

Every page gets its title, description, and keywords from `PAGE_META` in `src/lib/seo/metadata.ts`. Each entry is keyed by route path and contains multilingual values (en, hi, sa at minimum).

```typescript
'/learn/surya': {
  title: { en: 'Surya (Sun) in Vedic Astrology — Complete Guide', hi: '...', sa: '...' },
  description: { en: '...', hi: '...', sa: '...' },
  keywords: ['surya in astrology', 'sun vedic astrology', ...],
},
```

### How pages consume it

Each page's `layout.tsx` calls `getPageMetadata(route, locale)`:

```typescript
// src/app/[locale]/learn/surya/layout.tsx
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/learn/surya', locale);
}
```

`getPageMetadata()` returns a full Next.js `Metadata` object with:
- Title and description in the user's locale
- OpenGraph tags (title, description, image, locale)
- Twitter card (summary_large_image)
- Canonical URL
- Alternates for all 10 locales + x-default

### Adding metadata for a new page

1. Add an entry to `PAGE_META` in `metadata.ts`
2. Create `layout.tsx` in the page directory calling `getPageMetadata('/your/route', locale)`
3. If it's a learn page, also add `LearnArticleLD` in the layout

### Current count: 241 entries

---

## 3. Structured Data (JSON-LD)

### Sitewide (injected on every page)

In `src/app/[locale]/layout.tsx`, three JSON-LD blocks are injected into `<body>`:

```html
<script type="application/ld+json">OrganizationLD</script>
<script type="application/ld+json">WebSiteLD</script>
<script type="application/ld+json">SoftwareApplicationLD</script>
```

- **Organization**: name, URL, logo, founder, sameAs (Twitter, YouTube, Wikidata)
- **WebSite**: SearchAction for sitelinks search box, inLanguage array
- **SoftwareApplication**: free offer, category "Lifestyle"

### Per-page schemas

| Schema Type | Generator Function | Used By |
|-------------|-------------------|---------|
| `WebApplication` | `generateToolLD()` | Tool pages (kundali, matching, muhurta-ai, etc.) |
| `BreadcrumbList` | `generateBreadcrumbLD()` | Most pages via layout.tsx |
| `Article` | `generateArticleLD()` | 67 learn routes via LearnArticleLD component |
| `FAQPage` | via faq-data.ts | 30 routes with FAQ sections |
| `Event` | `generateEventLD()` | Festival/calendar pages |
| `HowTo` | `generateHowToLD()` | Puja vidhi pages (steps, materials, time) |
| `Person` | `generatePersonLD()` | Author pages |

### Adding JSON-LD to a new page

For a tool page:
```typescript
// In layout.tsx
import { generateToolLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';

// In the component:
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: safeJsonLd(generateToolLD('Tool Name', 'Description', url)) }}
/>
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD(pathname, locale)) }}
/>
```

For a learn page:
```typescript
// In layout.tsx
<LearnArticleLD route="/learn/your-topic" locale={locale} title="..." description="..." />
```

Always use `safeJsonLd()` from `src/lib/seo/safe-jsonld.ts` to prevent XSS in JSON-LD output.

---

## 4. Sitemap

### File: `src/app/sitemap.ts`

Generates 20,000+ URLs across 3 primary locales (en, hi, mai). Structure:

```
Static routes (~280) × 3 locales = ~840
+ City panchang pages (~250 cities) × 3 = ~750
+ Rashi compatibility pairs (144) × 3 = ~432
+ Festival × City × Year combinations = ~6,000
+ Muhurta type × month × year × city = ~14,400
+ Nakshatra pada pages, transit articles, etc.
```

### hreflang in sitemap

Every entry includes alternates for all 10 locales + x-default:
```typescript
alternates: {
  languages: {
    en: `${BASE}/en${route}`,
    hi: `${BASE}/hi${route}`,
    // ... all 10 locales
    'x-default': `${BASE}/en${route}`,
  }
}
```

### Adding a route to the sitemap

1. Add the route path to the `routes` array in `sitemap.ts`
2. It will automatically generate entries for all 3 active locales with hreflang

### Excluded from sitemap

- `/daily/[date]/[city]` pages — too many, thin content, carry `noindex`
- `/api/*` routes
- Private pages (`/dashboard`, `/settings`, `/profile`)

---

## 5. robots.txt

### File: `public/robots.txt`

```
User-agent: *
Allow: /
Crawl-delay: 2
Disallow: /api/
Disallow: /_next/
Disallow: /auth/
Disallow: /settings/
Disallow: /profile/
Disallow: /dashboard/
Disallow: /embed/
```

### AI bot rules

| Bot | Rule | Reason |
|-----|------|--------|
| GPTBot, ChatGPT-User | Allow tool pages, block `/*/learn/` | Let AI recommend tools, protect curriculum IP |
| Claude-Web, anthropic-ai | Same as above | Same strategy |
| Google-Extended | Same | AI training data control |
| CCBot, Bytespider | Disallow: / | Fully blocked (scraping concerns) |

Sitemap declared: `Sitemap: https://dekhopanchang.com/sitemap.xml`

---

## 6. OpenGraph & Social Cards

### 30 opengraph-image.tsx files

These are Next.js ImageResponse API routes that generate dynamic OG images at build/request time. Each returns a 1200×630 PNG.

Key pages with custom OG images:
- Root, Panchang, Kundali, Matching, Muhurta AI, Calendar, Tools, Festivals
- Per-rashi horoscope pages (daily/weekly/monthly)
- Learn landing + all 15 contribution pages
- Learn tithis

### Twitter cards

A shared `twitter-image.tsx` at the locale level. All pages use `summary_large_image` card type with `@dekhopanchang` site and creator handles.

### Adding an OG image to a new page

Create `opengraph-image.tsx` in the page directory:
```typescript
import { ImageResponse } from 'next/og';

export default function OGImage() {
  return new ImageResponse(
    <div style={{ /* 1200×630 layout */ }}>
      {/* Your design */}
    </div>,
    { width: 1200, height: 630 }
  );
}
```

---

## 7. Canonical URLs & hreflang

### Automatic via layout metadata

The root `layout.tsx` `generateMetadata()` sets:
- `alternates.canonical` → current locale URL
- `alternates.languages` → all 10 locales + x-default

Per-page `layout.tsx` files inherit this pattern.

### Retired locales

Sanskrit (sa) and Marathi (mr) were retired in April 2026. Middleware 301-redirects them to `/en/`. They still appear in hreflang (pointing to `/en/`) for backward compatibility with any indexed URLs.

---

## 8. RSS Feed

### File: `src/app/api/feed/route.ts`

RSS 2.0 at `/api/feed` with 16 items (contribution articles + learn pages). Cached 24h (`s-maxage=86400`).

Declared in layout `<head>`:
```html
<link rel="alternate" type="application/rss+xml" title="Dekho Panchang" href="/api/feed" />
```

### Adding items to the feed

Edit the `items` array in the feed route. Each item needs title, link, description, and pubDate.

---

## 9. Cross-Linking System

### File: `src/lib/seo/cross-links.ts`

Two maps create a bidirectional linking network:

- `TOOL_TO_LEARN`: Each tool page → related learn pages ("Deepen Your Knowledge")
- `LEARN_TO_TOOL`: Each learn page → related tool pages ("Try the Tool")

Rendered by `src/components/ui/RelatedLinks.tsx` as localized pill-link rows.

### Adding cross-links

Add entries to the appropriate map. The component auto-renders them with correct icons and translations.

---

## 10. FAQ Schema

### File: `src/lib/seo/faq-data.ts`

89 FAQ questions across 30 routes. Each FAQ has multilingual Q&A (en, hi, sa).

FAQ JSON-LD is injected in each page's `layout.tsx` as a `FAQPage` schema.

### Adding FAQs to a page

1. Add the route and questions to `FAQ_DATA` in `faq-data.ts`
2. In the page's `layout.tsx`, generate and inject the FAQPage JSON-LD
3. Optionally render the FAQs visually on the page (accordion component)

---

## 11. Performance SEO

### Fonts (CLS prevention)

All 9 Google Fonts loaded via `next/font/google` with `display: 'swap'`:
- Critical fonts (Inter, Cinzel): `preload: true`
- Indic fonts: weight-trimmed to 400/600/700 only (saves ~12 WOFF2 files)

### Skeleton loading (CLS)

20+ components use skeleton placeholders matching final layout dimensions. Key pages: homepage, panchang, kundali, calendar grid.

### Bundle optimization

- AdSense script loaded on-demand by `<AdUnit>` component, not globally
- Heavy widgets lazy-loaded via `next/dynamic` with `ssr: false`
- `optimizePackageImports` for framer-motion + lucide-react

### ISR (Incremental Static Regeneration)

325+ city panchang pages use ISR with appropriate revalidation intervals.

---

## 12. AdSense Setup

### Three verification methods active

| Method | Location | Status |
|--------|----------|--------|
| **ads.txt** | `public/ads.txt` | `google.com, pub-4787764488539456, DIRECT, f08c47fec0942fa0` |
| **Meta tag** | `layout.tsx <head>` | `<meta name="google-adsense-account" content="ca-pub-4787764488539456">` |
| **Script tag** | `layout.tsx <body>` | `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js` loaded afterInteractive |

### Google Consent Mode v2

Consent defaults script runs `beforeInteractive` (before AdSense loads). Cookie banner stores choice in `dp-consent-v2` localStorage key. Non-personalized ads served until user consents.

### AdSense rejection history

- First rejection: "Low value content" — fixed by adding editorial content sections to homepage and panchang page (server-rendered, crawlable text below the fold)
- Second review: pending as of May 2026

---

## 13. AI Crawler Management

### llms.txt

`public/llms.txt` is a 118-line document that:
- Describes the app's capabilities to AI assistants
- Provides direct tool recommendations ("use /panchang for daily timings")
- Documents the muhurta engine's 36-rule system
- Explicitly marks `/learn/` as "Do Not Scrape"

Declared as `<link rel="author" href="/llms.txt" />` in layout.

### Strategy

Tool pages are **allowed** for AI crawlers (so ChatGPT/Claude recommend the site). Educational curriculum (`/learn/`) is **blocked** (IP protection). This is enforced in robots.txt per-bot rules.

---

## 14. Search Console & IndexNow

### Google Search Console

Verification file: `public/googlef2c686aab81d237e.html`

### IndexNow

- Key file: `public/89ef80b257d5a8596056ec514f3c1f47.txt` (regenerated 2026-06-04)
- Helper: `src/lib/seo/indexnow.ts` — submits up to 10,000 URLs per call
- Used after bulk page additions to speed up indexing

---

## 15. Checklist: Adding a New Page

When you create a new page, do ALL of these:

- [ ] **Metadata**: Add entry to `PAGE_META` in `src/lib/seo/metadata.ts` (en + hi + sa)
- [ ] **Layout**: Create `layout.tsx` with `generateMetadata` calling `getPageMetadata()`
- [ ] **JSON-LD**: Add appropriate schema (Tool? Article? Breadcrumb?)
- [ ] **Sitemap**: Add route to `routes` array in `src/app/sitemap.ts`
- [ ] **Navigation**: Link from navbar, learn landing, or parent page (NO DEAD PAGES)
- [ ] **Cross-links**: Add to `cross-links.ts` if it's a tool or learn page
- [ ] **FAQ**: Add 2-3 FAQs to `faq-data.ts` if the page answers common questions
- [ ] **OG image**: Create `opengraph-image.tsx` if this page will be shared on social media
- [ ] **Editorial content**: If it's a primary page (homepage, panchang), ensure crawlable text content

### Quick test after adding

```bash
# Verify metadata generates
curl -s https://dekhopanchang.com/en/your-page | grep '<title>'
curl -s https://dekhopanchang.com/en/your-page | grep 'application/ld+json'

# Verify sitemap includes it
curl -s https://dekhopanchang.com/sitemap.xml | grep 'your-page'
```

---

## 16. Checklist: Adding a New Locale

1. Add locale code to `locales` array in `src/lib/i18n/config.ts`
2. Add to `visibleLocales` if it should appear in the locale switcher
3. Create message files in `src/messages/{locale}/` (global, pages, components, learn)
4. Add font import in `src/lib/fonts.ts` if it needs a non-Latin script font
5. Update `OG_LOCALE_MAP` in `metadata.ts` (e.g., `ta` → `ta_IN`)
6. Add locale label in `localeLabels` config
7. Verify sitemap generates URLs for the new locale
8. Add translations to FAQ data, cross-links headings, and component labels

---

## 17. Pending / Future Work

### High Priority

- [ ] **AdSense re-review**: Submit for review after editorial content is indexed
- [ ] **OG images for 21 graha/rashi pages**: Currently using default locale OG image
- [ ] **FAQ expansion**: Add FAQs for the 21 new graha/rashi learn pages
- [ ] **Article JSON-LD for new pages**: 21 graha/rashi pages + 7 yoga pages need entries in article-ld.ts

### Medium Priority

- [ ] **RSS feed expansion**: Currently only 16 items — add graha/rashi articles
- [ ] **Video schema**: YouTube Shorts have no VideoObject JSON-LD yet
- [ ] **Product schema**: For premium subscription features
- [ ] **Local Business schema**: For city-specific panchang pages
- [ ] **Cross-links for new pages**: 21 graha/rashi pages need TOOL_TO_LEARN entries
- [ ] **IndexNow after bulk changes**: Run indexnow submission after major content additions

### Low Priority

- [ ] **Structured data testing**: Run Google's Rich Results Test on all schema types
- [ ] **Sitemap index**: If sitemap exceeds 50MB, split into sitemap index
- [ ] **AMP pages**: Not planned — Next.js App Router doesn't support AMP natively
- [ ] **hreflang audit**: Verify all 10 locales resolve correctly (especially retired sa/mr)

---

## 18. Common Mistakes

1. **Forgetting the sitemap**: Every new page route MUST be in `sitemap.ts`. An unindexed page is invisible to Google.

2. **Missing layout.tsx**: Without `generateMetadata`, the page gets generic metadata. Always create a layout with `getPageMetadata()`.

3. **Dead pages**: A page not linked from navigation is a dead page. Google finds it harder to crawl and may deprioritize it.

4. **Hardcoded strings in metadata**: Always use the multilingual `{ en, hi, sa }` pattern. Never hardcode English-only titles.

5. **JSON-LD without safeJsonLd()**: Raw `JSON.stringify` can produce invalid JSON-LD or XSS vectors. Always use the safe serializer.

6. **Duplicate content across locales**: If a locale doesn't have real translations, it should fall back to English — but the URL should still exist (for hreflang completeness).

7. **Blocking good bots**: Don't block Googlebot. Don't block Bingbot. Only block scrapers (CCBot, Bytespider) and control AI bots selectively.

8. **Large sitemap without index**: If your sitemap exceeds 50,000 URLs or 50MB, Google may truncate it. Split into a sitemap index file.

---

*Last updated: May 2026. Maintained by the engineering team.*
