# 4.3 Google Discover Optimization

**Goal:** Get our "India's Contributions" pages surfaced in Google Discover — the content feed shown to 800M+ users on mobile Google app and Chrome new tab.

---

## Why Our Content is Perfect for Discover

Google Discover surfaces **interest-based content** — not search queries. It favors:
- "Did you know?" / curiosity-gap content → ALL 14 contribution pages fit this
- Evergreen educational content → our pages are timeless
- Rich media (large images) → we have OG images
- Structured data → we just added Article + FAQ schema
- High engagement signals → WhatsApp shares, time on page

---

## What We Need to Do

### 1. Meta Tag: max-image-preview:large (CRITICAL)
Google Discover REQUIRES permission to show large image previews. Without this tag, content is deprioritized.

**Add to root layout or each page's metadata:**
```html
<meta name="robots" content="max-image-preview:large, max-snippet:-1, max-video-preview:-1">
```

**Implementation:** Add to `src/app/[locale]/layout.tsx` metadata export.

### 2. High-Resolution Images (≥1200px wide) ✅ DONE
Our OG images are 1200x630. Google Discover requires ≥1200px wide with `max-image-preview:large`. We meet this.

### 3. Article Structured Data ✅ DONE
Already added Article + FAQ schema to all 14 contribution pages.

### 4. RSS/Atom Feed for Content Discovery
Google crawls RSS feeds to discover new content faster than sitemaps.

**Create:** `/api/feed/route.ts` — RSS 2.0 feed with:
- All 14 contribution pages
- All learn reference pages (eclipses, hora, etc.)
- Future blog posts when added
- Include title, description, pubDate, link, image

**Also create:** `/api/feed/atom/route.ts` — Atom feed (some aggregators prefer Atom)

**Add to head:** `<link rel="alternate" type="application/rss+xml" href="/api/feed" />`

### 5. Content Freshness Signals
Discover favors content that's been recently updated.

**Implementation:**
- Add `dateModified` to Article schema (already have `datePublished`)
- When we update content, bump the `dateModified`
- Add a "Last updated" line at the bottom of each contribution page

### 6. Web Stories (High Priority for Discover)
Google HEAVILY promotes Web Stories (AMP Stories) in the Discover feed. Each story is a swipeable, full-screen mobile experience.

**Create 5 Web Stories from our best content:**
1. "Sine Is Sanskrit" — 8 slides: bowstring diagram, mistranslation chain, Aryabhata portrait placeholder, modern GPS
2. "Zero Was Indian" — 8 slides: Brahmagupta, rules, Florence ban, binary/computers
3. "Calculus Before Newton" — 8 slides: Kerala map, Madhava series, Yuktibhasha, timeline
4. "Pythagorean Theorem — 300 Years Before Pythagoras" — 8 slides: Sulba Sutra, altar, formula, comparison
5. "Speed of Light in 14th Century" — 8 slides: Sayana quote, calculation, comparison, "coincidence?"

**Tech:** Use `@google/web-stories-wp` pattern or implement as simple AMP pages at `/stories/{slug}`

### 7. Core Web Vitals
Discover considers page experience signals.

**Verify:**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- Run `npx next build` + Lighthouse on contribution pages

### 8. Topic Authority Building
Google Discover uses "topic authority" — sites that consistently publish quality content on a topic get more Discover impressions.

**Strategy:**
- We have 14 contribution pages + hora + eclipses = 16 high-quality pages on Indian science/history
- Add 2-3 new pages per month to maintain freshness signal
- Topics to add: Indian astronomy instruments (Jantar Mantar), Sanskrit as programming language (Panini), Indian metallurgy (Delhi Iron Pillar)

### 9. Social Proof Signals
Discover considers social engagement. Our WhatsApp shares now provide this signal indirectly (when shared links get clicks).

### 10. Language Variants
Discover serves content in the user's language. Our bilingual (EN/HI) pages with proper `hreflang` tags can appear in BOTH English and Hindi Discover feeds — doubling our potential audience.

**Verify hreflang tags** are correct across all pages.

---

## Implementation Order

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| 1 | `max-image-preview:large` meta tag | 5 min | HIGH — unlocks Discover |
| 2 | RSS feed | 30 min | MEDIUM — faster indexing |
| 3 | `dateModified` in schema | 10 min | MEDIUM — freshness signal |
| 4 | Verify hreflang tags | 15 min | MEDIUM — Hindi audience |
| 5 | Core Web Vitals audit | 1 hr | MEDIUM — page experience |
| 6 | Web Stories (5 stories) | 4 hrs | HIGH — Discover loves stories |
| 7 | New content pipeline | Ongoing | HIGH — topic authority |

---

## Expected Timeline to Discover

After implementing items 1-4:
- Google recrawls within 1-2 weeks
- First Discover impressions within 2-4 weeks
- Consistent Discover traffic within 6-8 weeks
- Peak: contribution pages should each get 1,000-10,000 Discover impressions/month based on similar "Did you know?" content performance

---

## Tracking

- **Google Search Console → Discover tab** — impressions, clicks, CTR per page
- **Target CTR:** 8-15% (Discover CTRs are higher than Search)
- **Target:** 5,000+ Discover clicks/month within 3 months
