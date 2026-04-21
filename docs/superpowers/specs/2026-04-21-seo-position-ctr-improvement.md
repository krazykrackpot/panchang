# SEO: Position & CTR Improvement — Design Spec

**Date:** 2026-04-21
**Problem:** Average position ~23 (page 3), CTR ~1%. Goal: get to page 1, then optimize CTR.
**Baseline:** 1,800+ sitemap URLs, 200+ pages, rich metadata already in place.

---

## Current State (What's Already Strong)

- Centralized `PAGE_META` with multilingual titles/descriptions/keywords for every route
- 8 JSON-LD schema types deployed (Organization, WebSite, SoftwareApplication, BreadcrumbList, FAQPage, WebApplication, HowTo, Event)
- Comprehensive sitemap with hreflang for 10 locales
- Correct canonical + robots.txt setup
- 301 redirects from Western zodiac aliases
- Year-specific content (festivals 2026, retrograde 2026)

## What's Holding Us Back

1. **Panchang page is client-rendered** — Google crawls thin HTML for our highest-value page
2. **Footer has only 8 links** — poor link equity distribution across 200+ pages
3. **No Article schema on 50+ learn pages** — missing rich snippet eligibility
4. **No contextual internal links on panchang page** — no editorial links to deep dives/learn content
5. **FAQ schema only on ~8 route groups** — could cover 30+ pages

---

## Implementation Plan (5 Steps, Priority Order)

### Step 1: Server-Render Panchang Summary (SSR SEO Block)

**Problem:** `/panchang` is `'use client'` — crawlers see an empty shell until JS executes. This is our most important organic landing page.

**Solution:** Add a server component wrapper that pre-renders a static "Today's Panchang" summary block above the client component. The client component still handles interactivity (city switching, expanded details).

**Architecture:**
```
/panchang/page.tsx (server component — NEW)
├── <PanchangSEOBlock />   ← Server-rendered summary (static HTML)
│   └── computePanchang() using Vercel geo headers (same pattern as home page)
│   └── Renders: date, tithi, nakshatra, yoga, karana, sunrise/sunset, vara
│   └── Includes contextual internal links (Step 4)
├── <PanchangClient />     ← Existing client component (renamed, extracted)
│   └── All interactivity: city switcher, expanded cards, etc.
```

**What Google sees (without JS):**
- H1: "Today's Panchang — {Date}"
- Full tithi, nakshatra, yoga, karana with names and times
- Sunrise/sunset times
- Brief educational description of each element
- Internal links to learn pages

**Key constraint:** The existing panchang client component is ~3,000+ lines. We do NOT refactor it. We add a server wrapper that renders an SEO-visible summary block, then mounts the client component below it. The client component hydrates and takes over for interactivity.

**Files:**
- `src/app/[locale]/panchang/page.tsx` → rename to `PanchangClient.tsx` (add 'use client' if not already)
- New `src/app/[locale]/panchang/page.tsx` → async server component
- New `src/components/panchang/PanchangSEOBlock.tsx` → server-rendered summary

---

### Step 2: Mega-Footer with Categorized Links

**Problem:** 8-link footer provides almost no link equity to deeper pages. Internal linking is the #1 lever for distributing PageRank to long-tail content.

**Solution:** Replace the minimal footer with a 4-column categorized footer.

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│ TOOLS          │ CALENDARS       │ LEARN           │ DEEP DIVES  │
│ ─────          │ ──────────      │ ─────           │ ──────────  │
│ Kundali        │ Festival Cal    │ Foundations      │ Tithi       │
│ Matching       │ Transit Cal     │ Grahas           │ Nakshatra   │
│ Sign Calc      │ Retrograde Cal  │ Rashis           │ Yoga        │
│ Muhurta AI     │ Eclipse Cal     │ Nakshatras       │ Karana      │
│ Varshaphal     │ Muhurat Cal     │ Tithis           │ Muhurta     │
│ KP System      │ Regional Cal    │ Yogas            │ Rashi       │
│ Prashna        │                 │ Karanas          │ Masa        │
│ Baby Names     │                 │ Kundali Reading  │ Grahan      │
│ Sade Sati      │                 │                  │ Samvatsara  │
├─────────────────────────────────────────────────────────────────┤
│ Dekho Panchang © 2026   |  About · Privacy · Terms             │
│ ॐ ज्योतिषां ज्योतिः                                              │
└─────────────────────────────────────────────────────────────────┘
```

**~35 links** covering all major sections. All links use `next-intl` `<Link>` for proper locale-prefixed URLs. Anchor text is translated per locale.

**Files:**
- `src/components/layout/Footer.tsx` — rewrite
- `src/messages/components/footer.json` — add new link labels (all 4 active locales)

---

### Step 3: FAQ Schema Expansion

**Problem:** FAQPage schema only on ~8 route groups. Most tool pages, deep dives, and the panchang page itself lack FAQ markup.

**Solution:** Add FAQ JSON-LD to 20+ additional pages using the existing `faq-data.ts` infrastructure.

**Pages to add FAQ schema:**
- `/panchang` (the SSR block from Step 1 — 5 FAQs about daily panchang)
- `/sign-calculator` — "How to find my rashi?"
- `/sade-sati` — "What is Sade Sati? How long does it last?"
- `/baby-names` — "How are Vedic baby names chosen?"
- `/shraddha` — "What is Shraddha ceremony?"
- `/vedic-time` — "What is Vedic time?"
- `/varshaphal` — "What is Varshaphal/Solar Return?"
- `/kp-system` — "What is KP System?"
- `/muhurta-ai` — "How does muhurta selection work?"
- All 10 deep dive pages (`/tithi`, `/nakshatra`, `/yoga`, `/karana`, `/muhurta`, `/grahan`, `/rashi`, `/masa`, `/samvatsara`, and `/panchang/nakshatra/[id]`)

**Implementation:** Add FAQ data to `src/lib/seo/faq-data.ts` (multilingual en/hi), then inject `<script type="application/ld+json">` in each page's layout.

**Files:**
- `src/lib/seo/faq-data.ts` — add FAQ entries for new pages
- ~20 layout.tsx files — add FAQPage JSON-LD injection

---

### Step 4: Contextual Internal Links on Panchang Page

**Problem:** The panchang page (highest-value) has no editorial links to learn content or deep dives. Users (and Google) see panchang data but no pathway to deeper content.

**Solution:** The SSR block from Step 1 includes a "Learn More" section below the summary:

```
Today's Panchang — April 21, 2026
├── Tithi: Shukla Navami → [What is Tithi?](/learn/tithis)
├── Nakshatra: Pushya → [Learn about Pushya](/panchang/nakshatra/8) · [All 27 Nakshatras](/nakshatra)
├── Yoga: Shubha → [Understanding Yoga](/learn/yogas)
├── Karana: Balava → [What is Karana?](/learn/karanas)
├── Muhurta window: [Today's Muhurtas](/muhurta)
└── Related: [Kundali Generator](/kundali) · [Festival Calendar](/calendar) · [Transit Calendar](/transits)
```

Each panchang element links to its learn page and its deep dive page. This creates a web of topical authority that Google rewards.

**Files:** Included in the `PanchangSEOBlock.tsx` from Step 1.

---

### Step 5: Article Schema on Learn Pages

**Problem:** 50+ learn pages have substantial educational content but no Article structured data. Google can't identify them as authoritative articles.

**Solution:** Add Article JSON-LD to all learn topic pages and module pages.

**Schema structure:**
```json
{
  "@type": "Article",
  "headline": "Understanding the 27 Nakshatras in Vedic Astrology",
  "description": "...",
  "author": { "@type": "Organization", "name": "Dekho Panchang" },
  "publisher": { "@type": "Organization", "name": "Dekho Panchang" },
  "datePublished": "2026-03-01",
  "dateModified": "2026-04-21",
  "mainEntityOfPage": { "@id": "https://dekhopanchang.com/en/learn/nakshatras" }
}
```

**Files:**
- New `src/lib/seo/article-data.ts` — Article metadata per learn page
- `src/app/[locale]/learn/[topic]/layout.tsx` — inject Article JSON-LD
- `src/app/[locale]/learn/modules/[moduleId]/layout.tsx` — inject Article JSON-LD

---

## Self-Review: Critical Assessment

### What could go wrong?

1. **Step 1 (SSR panchang):** The panchang page is ~3,000+ lines. Extracting to a client component and wrapping with a server component could break the URL routing or state management. **Mitigation:** Don't touch the existing component internals — just rename the file and import it into a new server wrapper.

2. **Step 1 (SSR panchang):** The geo-header approach only works on Vercel. In development, headers are empty → fallback needed. **Mitigation:** Use a hardcoded fallback location (user is in Corseaux, Switzerland) for dev, same as the home page pattern.

3. **Step 2 (Footer):** Adding 35 links to every page increases HTML size. At ~100 bytes per link × 35 = ~3.5KB — negligible. **No real risk.**

4. **Step 3 (FAQ schema):** Too many FAQs can trigger "spammy structured data" warnings in GSC. **Mitigation:** 3-5 FAQs per page max, all genuinely useful content.

5. **Step 5 (Article schema):** `datePublished` and `dateModified` need to be real dates, not hardcoded. **Mitigation:** Use git commit dates or define in the article-data.ts config.

### What's NOT in this plan (and why)?

- **Nakshatra URL slugs** (`/nakshatra/ashwini` vs `/nakshatra/1`): This requires 301 redirects from old URLs, sitemap changes, and potential GSC re-indexing. Risky mid-flight. **Deferred** — do this in a separate spec.
- **Custom OG images per section**: Nice-to-have but doesn't directly impact position. **Deferred.**
- **Security headers in next.config.ts**: Not a ranking factor for Google (despite SEO tool claims). **Deferred.**
- **Social profiles in Organization LD**: Marginal impact. **Deferred.**

### Expected Impact

| Metric | Current | 30-day Target | 90-day Target |
|--------|---------|---------------|---------------|
| Avg Position | 23.1 | 15-18 | 8-12 |
| CTR | 1% | 2-3% | 4-6% |

The biggest position mover is Step 1 (SSR panchang) because it makes our highest-value page fully crawlable. Steps 2-4 distribute authority across the site. Step 5 targets featured snippet eligibility.

---

## Implementation Order

1. **Step 1: SSR Panchang** — biggest impact, most complex
2. **Step 2: Mega-Footer** — broad impact, straightforward
3. **Step 3: FAQ Schema Expansion** — quick wins
4. **Step 4: Contextual Links** — built into Step 1
5. **Step 5: Article Schema** — straightforward additions
