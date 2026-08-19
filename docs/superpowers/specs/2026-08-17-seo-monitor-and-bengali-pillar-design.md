# SEO monitor fix + Bengali pillar + surgical title rewrites

**Date:** 2026-08-17
**Author:** brainstormed with Claude in-session; user-approved section by section.
**Status:** design approved; awaiting implementation-plan handoff.
**Branch (planned):** `feat/seo-monitor-fix-and-bengali-pillar`

## Context

The GSC health cron fired a `bangla calendar position +16.6 ranks` alert on
2026-08-17. Investigation showed the alert is a **false positive**:

- The canary term "bangla calendar" gets 3 imps/day on 20+ different long-tail
  variants. Average position swings ±20 ranks purely on random query mix.
- Same-week per-query breakdown showed **clicks quadrupled (1→4)** and
  **impressions grew 15×** (3→46). Coverage is expanding, not shrinking.
- Overall site trend: impressions 86→114→150→114→125→**188**→148→101 in the
  reporting window; clicks 23 total vs 11 in the prior 7d (**~2×**).

The health monitor's alert methodology mistakes coverage expansion (new
long-tail queries surfacing at position 40-80) for rank decay. This produces
false-positive alerts and hides real regressions.

Alongside fixing the monitor, per-page opportunity analysis surfaced two
lower-effort wins on the acquisition axis (user priority = new users, not
retention; cost constraint = no expensive new crons or per-user compute).

## Constraints and non-goals

- **Cost:** must not add new Vercel functions, crons, or per-user compute.
  Existing engine reuse only. Cost reduction work (2026-05-27, spec on file)
  is not to be reverted.
- **No unrelated refactoring.** In-scope changes to touched files only.
- **No new pages.** Per-date URLs (`/en/calendar/regional/bengali/2026-10-16`)
  and per-nakshatra-pair URLs (`/en/matching/nakshatra/rohini/mrigashira`)
  were considered and explicitly rejected as sprawl.
- **Retention features (transit alerts, deeper Brihaspati) out of scope.**
  User's priority is acquisition. Both are addressable separately.

## Scope: three parts on one feature branch

Batched to save Vercel builds (~9 min each) per CLAUDE.md. Sequenced
A → C → B so smaller/safer land first and the highest-iteration part lands
last.

---

## Part A — GSC health monitor rewrite

**File:** `scripts/gsc-health-monitor.ts`, `scripts/__tests__/gsc-health-monitor.test.ts` (new).

### Root cause

`gsc-health-monitor.ts` line ~250 fires `CANARY_POS_DROP` alert when the
canary query's *average position* drops by ≥3 ranks vs the 7-day median.
Averaging across all impressions for a query means a spray of new
position-60-80 long-tail hits mechanically drags the average — that's what
happened on 2026-08-17.

### New signal architecture

Replace one flawed metric with two better ones. Keep the platform-wide
health rules unchanged.

**Rule 5 (new): Click-basket position tracking.**

- Once per week (rotates when `clickBasket.refreshedAt` is >7d old — piggybacks
  on the same daily cron, no new schedule), refresh a "top 20 queries by
  clicks in last 28d" basket via a single GSC API call.
- For each basket query, fetch this-week and prior-week positions.
- Fire alert when **≥3 queries in the basket lost ≥5 rank positions AND
  their prior position was <20** (i.e. real winners that slipped, not noise
  on already-page-5 queries).

**Rule 6 (new): Page-level impression collapse.**

- Fetch pages dimension for last 7d and prior 7d (single GSC call each).
- Filter to pages with ≥100 prior impressions.
- Fire alert when any page dropped >70% impressions.

**Rules removed/demoted:**

- `CANARY_POS_DROP` (rule 4): remove entirely. Its purpose (early-warning
  on canary rank decay) is subsumed by the click-basket rule with real
  statistical footing.
- `CANARY_IMPS_DROP_RATIO` (rule 3): keep — a raw impression drop on the
  canary is still a legitimate signal.

**Rules preserved unchanged:**

- Rule 1: Yesterday clicks < 30% of 7-day median (catches platform outages).
- Rule 2: Yesterday impressions < 30% of 7-day median (same).

### Cache schema extension

`~/.cache/panchang-gsc-health-latest.json` — additive changes only,
preserves all existing fields so `/health` skill continues to render.

```json
{
  "ranAt": "...",
  "range": { "start": "...", "end": "..." },
  "daily": [ ... ],
  "baseline": { ... },
  "yesterday": { ... },
  "canary": { ... },
  "clickBasket": {
    "refreshedAt": "2026-08-17",
    "windowDays": 28,
    "queries": [
      {
        "query": "aaj ka panchang",
        "clicks28d": 42,
        "priorPos": 6.4,
        "recentPos": 8.9,
        "posDelta": 2.5,
        "priorClicks7d": 8,
        "recentClicks7d": 6
      }
    ]
  },
  "pageLosses": [
    { "page": "/kn/hindu-calendar/2027", "priorImps": 140, "recentImps": 25, "dropPct": 82 }
  ],
  "alerts": [ ... ]
}
```

### API budget

- Existing: 2 GSC calls per run (topline daily + canary daily).
- Added: 1 basket-refresh call every 7d (amortised: <0.2 calls/day) + 2 page-dimension calls/day.
- Total post-change: ~4-5 calls/day. GSC quota is 1200/site/day. Trivial.

### Testing

New file `scripts/__tests__/gsc-health-monitor.test.ts` (vitest). Mock
`gscQuery` at module boundary. Cases:

- Basket refresh triggers when >7d old; no-op otherwise.
- Rule 5 fires on 3 winners slipping ≥5 ranks; doesn't fire on 2 winners
  slipping, or on non-winners slipping.
- Rule 6 fires on ≥70% imp loss with prior ≥100; doesn't fire on <100 prior.
- Old rules 1/2/3 preserved (regression check).
- Schema roundtrips through JSON without loss.

### Rollout / observability

- Cache file JSON is read by the `/health` skill; new keys render as
  additional lines (already tolerant of unknown fields).
- macOS notification path (`osascript`) unchanged.
- Exit codes preserved (2 on alert, 0 on healthy).

---

## Part C — Two title/description rewrites

**File:** `src/lib/seo/metadata.ts`.

Investigation of the 8 pages with imps≥20, pos≤15, CTR<2% (see
`scripts/gsc-title-opportunities.mjs`) showed most are unfixable-via-title:

- 3 are date-lookup queries where our title already contains the date — SERP
  fully satisfies the query without a click. Needs downloadable content or
  reminder CTA (out of scope; log as follow-up).
- 2 are locale-routing issues (Marathi page ranking for `odia panjika`;
  Kannada for English queries). Needs hreflang audit (out of scope).
- 1 has no query data.

Two genuine title fixes remain:

### C1. `/upagraha` (confident)

Top queries: `upagraha chart` (40 imps), `upgraha chart` (7), `parivesha` (2).

- **Current title.en:** `Upagraha – Shadow Sub-Planets`
- **New title.en:** `Upagraha Chart Calculator — Dhuma, Vyatipata, Parivesha & More`

- **Current description.en:** `Calculate Upagrahas (shadow sub-planets) including Dhuma, Vyatipata, Parivesha, Indra Chapa, and Upaketu in your chart.`
- **New description.en:** `Free upagraha chart calculator: Dhuma, Vyatipata, Parivesha, Indra Chapa, Upaketu & more shadow sub-planets. Exact positions + classical interpretations for your kundali.`

Rationale: leads with "Chart Calculator" (matches top-query intent);
enumerates specific upagrahas including `Parivesha` (a real query); adds
"Free" click magnet in description.

### C2. `/hindu-calendar/2027` MAI (experimental)

Top query for the page: `2027 चैत्र महीना कैलेंडर` (Chaitra-month calendar).

- **Current title.mai:** `हिन्दू कैलेण्डर 2027 – सम्पूर्ण पाबनि, व्रत आ ग्रहण तिथि`
- **New title.mai:** `हिन्दू कैलेण्डर 2027 — पाबनि, व्रत, मास-तिथि | Hindu Calendar 2027 (Maithili)`

Two changes bundled:

1. Fixes existing bilingual-title-rule violation (memory
   `feedback_bilingual_titles`: non-EN titles MUST include regional script +
   English). Adds `| Hindu Calendar 2027 (Maithili)` suffix.
2. Adds `मास-तिथि` (month-tithi) hook to match actual top-query intent.

### Success criteria

- Post-deploy: `curl` both pages, verify rendered `<title>` and
  `<meta description>` bytes.
- 30d SERP check via new health-monitor `topQueries` basket: `/en/upagraha`
  CTR 0% → ≥2%; `/mai/hindu-calendar/2027` CTR 0% → ≥2%.

### Follow-ups explicitly deferred

- `/mr/calendar/[year]` and `/hi/hindu-calendar/*` titles also missing
  English bilingual suffix. Log as separate hygiene pass.
- `/kn/hindu-calendar/2027` ranking on English queries — hreflang audit
  needed (separate ticket).
- `/en/festivals/*/YYYY` pages losing clicks to SERP snippet answering the
  date query — needs downloadable calendar CTA / reminder signup / city
  muhurat hook. Separate feature workstream.

---

## Part B — Bengali regional pillar upgrade

**File:** `src/app/[locale]/calendar/regional/bengali/page.tsx`,
`src/app/[locale]/calendar/regional/bengali/layout.tsx`, plus a new
client-side date-converter component.

### Diagnosis

The page already has ~15 substantive sections (Bangabda origin theories,
Gupta Press vs Vishuddha Siddhanta reckoning schools, day-by-day Durga Puja
chronology, Bangabda year cycle 1432-1439 with cultural anchors, month
conversion table, embedded FAQPage JSON-LD). Content depth is not the
problem.

Top queries analysis (see `scripts/gsc-bengali-queries.mjs`):

- `bangla calendar` (53 imps, pos 72) — head term dominated by Kalnirnay/Drik
- `today bengali date` (6 imps, pos 10.7) — CLOSE to top 5
- `16 october 2026 bengali date`, `25 boishakh 2026`, `29 august bengali date` — specific date-lookup queries where we rank #1 but volume is 1-2 imps each
- `bangla srabon mas 2026 calendar` (pos 14.5, CTR 100%)

**The winning queries are conversion queries. Users want a tool, not an
essay. The page ships an essay.**

### Changes

**B1. "Today's Bengali Date" hero block** (new client component).

- Component: `src/components/calendar/BengaliDateHero.tsx`.
- Placement: immediately after `<h1>`/intro, before "Month Table" section.
- Displays: current Gregorian date · Bengali date · Bengali tithi/paksha ·
  Gupta Press variant · Vishuddha Siddhanta variant (leverages existing
  content asset).
- Interactive: `<input type="date">` on change → recomputes Bengali date
  client-side.
- Engine: reuses existing `computeBengaliDate` from
  `src/lib/calendar/bengali-panjika.ts` (already exists per `page.tsx`
  imports — verify at implementation time). If it doesn't exist as a
  reusable function, extract from the current inline logic — small refactor,
  in scope.
- **No new API route; no new cron.** Client-side pure function call.
- ISR-hydration safe: mounts with `useState(null)` + `useEffect` fill (per
  CLAUDE.md lesson ZD — `'use client'` render body must not call
  `new Date()`).

**B2. Add `Article` + `BreadcrumbList` JSON-LD to `layout.tsx`.**

- Mirror the pattern in `src/app/[locale]/calendar/regional/bengali/[year]/layout.tsx`
  which already emits `toolLD + breadcrumbLD + articleLD`.
- Parent currently emits `FAQPage` inline in `page.tsx` only. Missing:
  `Article` and `BreadcrumbList`.
- Change: extend `layout.tsx` to import + emit both LDs via `<script>` tags.

**B3. Expand FAQPage** in `page.tsx` with 4 conversion-query FAQs:

- "What is today's Bengali date?"
- "How to convert any Gregorian date to Bengali date?"
- "What Gregorian date is 25 Boishakh 2026?"
- "Why does the Bengali calendar year begin on 14 April?"

Each answer includes an in-body link to the new hero widget (`#bengali-date-converter`).

**B4. Inbound linking audit.** Verified during design — already linked from
`/en/calendars`, `/en/panchang`, and 4 other regional calendar pages
(gujarati/mithila/tamil/telugu). No action needed. Confirm at implementation
time by re-grepping.

**B5. hreflang audit.** Quick check that `/bn/calendar/regional/bengali`
exists and layout emits proper alternates. If broken, fix; if fine, skip.
Expected time: 5 min.

### Success criteria

- Post-deploy: hero widget renders on production, date input works, JSON-LD
  validates in Google's Rich Results Test.
- 30d SERP check:
  - `today bengali date` position 10.7 → top 5
  - `/en/calendar/regional/bengali` overall pos 37 → top 25
  - `bangla calendar` head term: watch only — pos 72 → 40 would be a
    stretch win.
- Interactive widget usage: measurable via Vercel Web Analytics `date-input`
  event (add lightweight event fire).

### Explicitly out of scope

- Per-date URLs (`/en/calendar/regional/bengali/2026-10-16`): 365 pages of
  sprawl, cost constraint violation.
- Downloadable PDF panjika: hosting + copyright + no clear ROI story.
- Bengali translation of the essay content: parent page is EN-only by
  design; `/bn/calendar/regional/bengali` handles Bengali-locale visitors.

---

## Sequencing on branch

`feat/seo-monitor-fix-and-bengali-pillar`

1. **Commit 1 (Part A):** monitor refactor + tests. Independently mergeable.
2. **Commit 2 (Part C):** two `metadata.ts` string edits. Independently mergeable.
3. **Commit 3 (Part B):** Bengali page hero + LD + FAQs. Largest, iterative.

Squash-merge to `main` in one operation per CLAUDE.md batch policy (single
Vercel build for all three).

## Testing gates before merge

Per CLAUDE.md Definition of Done:

1. `npx tsc --noEmit -p tsconfig.build-check.json` — passes
2. `npx vitest run` — passes (new Part A tests included)
3. `npx next build` — passes
4. Browser-verify: interactive Bengali date widget works with 3 sample
   dates including a Boishakh (Apr) and a Choitro (Mar) case; upagraha
   title updates in browser DevTools; hindu-calendar mai locale title
   correct.
5. Post-deploy: `curl` all 3 URLs for title/description bytes; run
   `node scripts/gsc-slide-diag.mjs` and confirm no regression.

## Metrics review

- **T+7d:** run `gsc-slide-diag.mjs` — expect no regression across topline.
- **T+30d:** re-run all three success-criteria queries. If success met on
  ≥2 of 3, ship a follow-up expanding the same pattern. If met on ≤1,
  regroup and reconsider.

## Open questions / risks

- **B1 engine reuse:** at design time I referenced `computeBengaliDate` in
  `src/lib/calendar/bengali-panjika.ts` but did not confirm exact shape.
  Implementation may need to extract from existing page-level logic.
  Contingency: if extraction is >30 lines, spec allows it as in-scope
  refactor per "targeted improvements as part of the design" guidance.
- **C2 experimental risk:** Maithili title change is a bet on a narrow
  strategic hypothesis. Downside is minor — old title also underperformed.
- **Part A weekly-basket refresh timing:** if the cron happens to run the
  first time inside a partial week (basket empty), rule 5 no-ops silently
  rather than firing on partial data. Documented behaviour; not a bug.
