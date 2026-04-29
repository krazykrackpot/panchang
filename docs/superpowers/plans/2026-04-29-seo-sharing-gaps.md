# SEO & Sharing Gaps — Implementation Plan

> **Audit date:** 2026-04-29
> **Priority order:** highest ROI first

---

## Task 1: Cross-link festival/calendar pages → learn hubs

**Status:** MISSING entirely
**Files to modify:**
- `src/app/[locale]/calendar/[slug]/page.tsx` — add "Learn the science" links
- `src/app/[locale]/festivals/[slug]/[year]/[city]/page.tsx` — convert "Why This Date?" text into links

**What to add:**
- Link to `/learn/festival-rules` (Kala-Vyapti timing rules)
- Link to `/learn/tithis` (tithi explanation)
- Link to `/learn/masa` (month system)
- Link to `/learn/smarta-vaishnava` (calendar system differences)

**Note:** `/learn/festival-rules` page already exists at `src/app/[locale]/learn/festival-rules/page.tsx`.

---

## Task 2: Bi-directional tool ↔ learn links

**Status:** Almost entirely MISSING
**Files to modify:**
- `src/app/[locale]/panchang/PanchangClient.tsx` — add "Learn about Tithis/Nakshatras" links
- `src/app/[locale]/kundali/page.tsx` — add "Learn about Birth Charts" (partially exists)
- `src/app/[locale]/matching/page.tsx` — add "Learn about Compatibility"
- `src/app/[locale]/learn/tithis/page.tsx` — fix locale-prefixed link to `/panchang` (line 617 bug)
- `src/app/[locale]/learn/masa/page.tsx` — add link to `/calendar`
- Other learn pages: add "Try this tool" CTAs

---

## Task 3: Personalized birth chart OG image

**Status:** Stub exists in `/api/card/birth-poster` but returns "coming soon"
**Files to modify:**
- `src/app/api/card/[type]/route.tsx` — implement `birth-poster` card rendering

**What to build:** Server-side rendered 1200×630 OG image showing:
- Name, date, place
- Mini North Indian diamond chart
- Rising sign, Moon sign, Sun sign
- Current dasha
- Branded footer "dekhopanchang.com"

Uses `@vercel/og` (ImageResponse) which is already used by other OG images in the app.

**Also:** Add `opengraph-image.tsx` to `/kundali/[id]/` route for saved chart sharing.

---

## Task 4: JSON-LD coverage gaps

**Status:** Good coverage but gaps remain
**Files to create/modify:**

### 4a: `/tools/layout.tsx` — DOES NOT EXIST
Create with WebApplication schema for the tools hub.

### 4b: HowTo schema on tool pages
Add `generateHowToLD` to layouts for:
- `/kundali/layout.tsx` (already has SoftwareApplication — add HowTo)
- `/matching/layout.tsx` (already has WebApplication — add HowTo)
- `/sign-calculator/layout.tsx`

### 4c: Article schema on remaining learn pages
`/learn/festival-rules` is NOT in the `ARTICLE_META` list in `article-ld.ts`. Add it.

---

## Task 5: Google Indexing API for daily panchang

**Status:** MISSING entirely
**Files to create:**
- `src/app/api/cron/index-urls/route.ts` — cron job that pings Google Indexing API
- `src/lib/seo/indexing.ts` — helper for Google Indexing API calls

**What it does:**
- Runs daily (00:45 UTC, after daily panchang email at 00:30)
- Submits today's panchang URLs for all 55 cities (55 URLs)
- Uses Google Indexing API v3 with service account auth
- Requires: GCP service account key in env vars

**Prerequisite:** GCP project with Indexing API enabled + service account.

---

## Task 6: Missing OG images

**Status:** Most pages missing
**Files to create:**
- `src/app/[locale]/festivals/opengraph-image.tsx` — festival index
- `src/app/[locale]/calendar/[slug]/opengraph-image.tsx` — per-festival
- `src/app/[locale]/tools/opengraph-image.tsx` — tools hub
- `src/app/[locale]/learn/tithis/opengraph-image.tsx` (and other learn topics)

Lower priority since the existing site-level OG image provides a fallback.

---

## Task 7: Fix locale prefix bug

**Status:** Bug in `/learn/tithis/page.tsx` line 617
**Fix:** Change `<Link href="/panchang">` to `<Link href={`/${locale}/panchang`}>` or use the i18n Link component.

---

## What's Already Done (no action needed)

- [x] Event schema on festival city pages (`generateEventLD`)
- [x] FAQPage schema on 12+ pages
- [x] Article schema on learn hub pages (via `LearnArticleLD`)
- [x] Panchang OG image (dynamic, shows live tithi/nakshatra)
- [x] Kundali OG image (generic, "Generate Your Birth Chart")
- [x] Discovery/Blueprint/Compatibility shareable cards (fully rendered)
- [x] BreadcrumbList on festivals, matching, learn layouts
- [x] Course schema on `/learn` layout
- [x] HowTo schema on `/puja/[slug]`

---

## Execution Order

1. **Task 7** — Fix locale bug (2 min)
2. **Task 1** — Festival → learn cross-links (30 min)
3. **Task 2** — Bi-directional tool ↔ learn links (30 min)
4. **Task 4a** — Tools layout.tsx with schema (15 min)
5. **Task 4b+4c** — JSON-LD gaps (20 min)
6. **Task 3** — Personalized birth chart OG image (1-2h)
7. **Task 6** — Missing OG images (1h)
8. **Task 5** — Google Indexing API (1h, needs GCP setup)
