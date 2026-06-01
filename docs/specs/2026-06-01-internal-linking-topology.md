# Internal Linking Topology — Audit + Hub Pages

**Date**: 2026-06-01
**Context**: §2.2 of the May 2026 Core Update recovery plan. Audit click-depth of top-traffic URLs and fix structural orphans where evergreens lack internal-link authority.

## Audit summary

Tested 6 top-traffic evergreens against the visible navigation surface (Navbar + Footer) and the obvious hub pages (`/calendars`, `/tools`, `/festivals`).

| URL | Weekly clicks | Top-nav direct? | Reachable in 2 clicks? |
|---|---|---|---|
| `/en/calendar/regional/bengali` | 634 | ❌ | ✅ via `/calendars` |
| `/hi/baby-names` | 83 | ❌ | ✅ via `/tools` |
| **`/en/muhurta/annaprashan`** | **46** | ❌ | ❌ **3+ clicks (orphan)** |
| `/te/muhurta/vehicle-purchase` | 33 | ❌ | ❌ same |
| `/hi/dates/purnima` | 32 | ❌ | ❌ same |
| `/en/festivals/hartalika-teej/2026` | 15 | ❌ | ✅ via `/festivals` |

### The critical orphan

**The 12 `/muhurta/[type]` pages had no parent hub.** Trying to load `/en/muhurta` returned 404. The annaprashan page (position 3.8 with 46 clicks/week — a strong landing!) had zero internal-link authority — Google had to find it through the sitemap alone. That's exactly the structural pattern Core Update reclassifies as "scaled programmatic content".

Same for `/dates/[category]` — `/en/dates` is 404 and `/dates/purnima` etc. live in isolation.

## This PR

### `/[locale]/muhurta/page.tsx` — new hub

Lists every entry in `MUHURTA_TYPES` (12 entries) as a card with name + subtitle + description + CTA. Mirrors the card design used on `/tools`. Includes cross-links to `/muhurta-ai`, `/career-muhurta`, `/caesarean-muhurta`, `/learn/muhurtas` as related surfaces.

### `/[locale]/muhurta/layout.tsx` — metadata

Title + description + hreflang for all 8 visible locales. Canonical points at `/en/muhurta` for x-default. Suppressed locales (sa) get `noindex`.

### `src/components/layout/Footer.tsx` — Footer link, NOT main nav

Per the project rule for orphan-recovery (`feedback_orphan_links_in_footer`): orphan hubs whose only justification is internal-link discoverability go in the **Footer**, NOT main navigation or the `/tools` curation page.

Reason: the muhurta family generates ~50 clicks/week — meaningful for SEO but not enough to justify main-nav real estate. The Footer is the standard SEO-link-equity surface where users tolerate clutter because they don't see it unless scrolling.

Added under the "Calendars" Footer column next to the existing `/muhurat` and `/rituals` rescue entries (Audit 2026-05-25 §B prior orphan-rescue batch).

### `sitemap.ts` — added `/muhurta` to the static routes array.

The 12 `/muhurta/[type]` entries are also still emitted via `generateStaticParams` in the dynamic route; the hub joins the static surface for hreflang completeness.

## Tests

`vitest`:
- New hub page exists, exports default function, includes `MUHURTA_TYPES.map(...)` to render every type
- `sitemap.ts` routes array contains `'/muhurta'`
- `/tools/page.tsx` has a `href: '/muhurta'` entry

`next build` produces a new `/[locale]/muhurta` route for every visible locale.

## Out of scope (separate work)

### Equally orphaned, will be addressed in §2.2 follow-ups

- **`/[locale]/dates/page.tsx`** — hub for `/dates/[category]` (purnima, amavasya, ekadashi, sankashti-chaturthi, ganda-mool). Same orphan pattern as muhurta.
- **`/calendars` page — bury fix**: the prominent `/calendar/regional/bengali` link is buried in a body paragraph instead of being a top-billed card. Given that page is 47% of evergreen traffic, it should headline `/calendars`.
- **Breadcrumb visibility on `/muhurta/[type]`** — schema.org breadcrumb LD is emitted but no visible `<nav aria-label="breadcrumb">` exists. Visible breadcrumb both helps users navigate and reinforces the hub→landing relationship for crawlers.
- **`/festivals/[slug]/[year]` → sibling festivals** — `FestivalClusterTimeline` component exists and renders within the cluster context, but linking out to the cluster's other festivals would deepen the internal-link graph.
- **`/panchang` (root) → date hub explainers**: cross-link `/dates/purnima`, `/dates/amavasya`, `/dates/ekadashi` from the panchang root page (where users land on "today's tithi").

### Not orphans — confirmed reachable

- `/calendar/regional/*` family (8 variants): reachable via `/calendars` page (depth 2). Could be deeper-featured but not orphan.
- `/festivals/[slug]/[year]`: reachable via `/festivals` listing (depth 2).
- `/baby-names`: reachable via `/tools` (depth 2).

## Open questions for user

1. Should `/muhurta` get promoted to a top-nav slot alongside `/horoscope` and `/charts`? Current decision: NO — keep top nav stable; surface from `/tools`.
2. Same question for `/dates` (when its hub ships).
3. Bengali calendar promotion on `/calendars`: ok to convert the inline link to a top-billed card with image + meta-description?
