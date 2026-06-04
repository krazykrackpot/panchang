# Soft 404s on date- and year-keyed routes — root cause + fix plan (v2)

**Status:** Draft for review — second pass, incorporates reviewer feedback from round 1
**Author:** Aditya (via Claude)
**Date:** 2026-06-04
**Audience:** Reviewing agent (Gemini / human reviewer) — sign off before implementation

**Changes vs v1:**
- Combined v1's proxy fix with the round-1 reviewer's per-page "today → 302" idea into a **single proxy.ts implementation** (one redirect hop, one source of truth, no per-page edits).
- Added §4 **SEO Impact Analysis** answering the question "would redirects get us penalised by GSC?" with Google's documented stance.
- Added §3 **Policy declaration** for `/today` semantics across route families (resolves reviewer's blocking gap #2 — horoscope asymmetry).
- §3.3 fix table now explicitly enumerates routes that ship broken in this commit (reviewer's blocking gap #1).
- §6.5 `NextResponse.rewrite` with status 404 moved from "open question" to "must verify on preview deploy before merge" (reviewer's blocking gap #3).
- Verification §5 adds **wire-status check** (`curl -I` to confirm the HTTP status that hits the wire is the one we set in code).
- v1's evidence sweep had `/horoscope/aries/today` marked OK because curl-with-redirect-follow showed 308. **Re-traced**: 308 was just the western→vedic alias; the final destination `/horoscope/mesh/today` also soft-404s. §1.1 corrected.

---

## 1. Problem statement

Eight URL families across the site return **HTTP 200 with a "page not found" body** (a "soft 404") instead of a real HTTP 404 when the dynamic segment is invalid. GSC URL Inspection flagged this on `/en/choghadiya/today` ("issues detected in live testing"), and a sweep showed the same pattern across every date- and year-keyed route — including horoscope, which v1 mistakenly listed as working.

### 1.1 Evidence — live sweep (2026-06-04, prod, corrected)

```
[200] body=119437 404-text=1  /en/choghadiya/today              SOFT 404
[200] body=119443 404-text=1  /en/choghadiya/tomorrow           SOFT 404
[200] body=119459 404-text=1  /en/choghadiya/invalid-date-xyz   SOFT 404
[200] body=121712 404-text=1  /en/gauri-panchang/today          SOFT 404
[200] body=122465 404-text=1  /en/career-muhurta/today          SOFT 404 (slug-based, deferred)
[200] body=118518 404-text=2  /en/panchang/date/today           SOFT 404
[200] body=118633 404-text=1  /en/festivals/diwali/today        SOFT 404
[200] body=130647 404-text=1  /en/calendar/today                SOFT 404 (slug-based, deferred)
[308 → 200] /en/horoscope/aries/today  →  /en/horoscope/mesh/today  SOFT 404
[404] body=9811                /en/totally-bogus-route-xyz      OK (real 404)
```

`/horoscope/aries/today` 308-redirects via the existing western→vedic alias in `next.config.ts`, but the final destination `/horoscope/mesh/today` soft-404s exactly like the others. There is **no working `/today` handler in the codebase right now**.

All eight broken responses include `<meta name="robots" content="noindex">` *and* the layout-level `<meta name="robots" content="index, follow, ...">` — a contradictory pair. Body contains the literal text "404" with only the navbar/layout shell and `Loading...` content. Vercel response headers show `x-nextjs-prerender: 1`, `age: 48`, `cache-control: public, max-age=0, must-revalidate` — i.e. the response is being served from the ISR/CDN cache as a successful prerender.

### 1.2 Why this matters

- **GSC "Soft 404" is an explicit quality signal Google penalises** (see §4.1). Soft 404s appear in the GSC Coverage report under "Excluded — Soft 404" and the URLs compete with the canonical pages for crawl budget. Repeated soft 404s also feed into site-level quality signals that affect ranking of unrelated pages.
- **Contradictory robots directives** mean different crawlers reach different conclusions about indexability — inconsistent indexing across engines.
- **Backlinks, typed URLs, and GSC URL Inspection** keep finding these endpoints because they never return a clean 404. They stay in GSC's discovery queue indefinitely.

The two URLs we have been trying to push to indexing (`/en/choghadiya/today`, `/mai/choghadiya/today`) are not real pages and never have been. IndexNow and GSC Request Indexing have been failing on them because the underlying URL is broken — not because of crawl budget or indexing policy.

## 2. Root cause

Every affected route file declares `export const revalidate = N` (ISR) **and** `export const dynamicParams = true`. The pattern inside the page is:

```ts
// e.g. src/app/[locale]/choghadiya/[date]/page.tsx
const parsed = parseDate(dateStr);
if (!parsed) notFound();
```

When an unknown slug hits this route:

1. Next.js generates the page on-demand (ISR + `dynamicParams = true`).
2. `notFound()` throws `NEXT_NOT_FOUND`.
3. Next.js renders the nearest `not-found.tsx` (here: `src/app/[locale]/not-found.tsx`).
4. The rendered output is written to Vercel's ISR cache. **Vercel caches the output as a successful prerender (`x-nextjs-prerender: 1`) and serves it with HTTP 200** — the 404 status is lost at the cache boundary.
5. Every subsequent request for the same bad slug hits the cache and gets 200.

This is a known interaction between Next.js `notFound()` and Vercel's ISR cache layer: status codes on the not-found UI of a static segment don't propagate through the prerender cache.

## 3. Policy decision + proposed fix

### 3.1 Policy: how `/today` behaves on each route family

Routes split into two groups based on whether `/today` is a meaningful concept for that surface:

| Route family | `/today` semantically meaningful? | Policy |
|---|---|---|
| `/<lc>/choghadiya/[date]` | Yes — today's choghadiya is a real, daily-changing thing | **302 redirect to today's `YYYY-MM-DD` in SEO_CITY timezone** |
| `/<lc>/gauri-panchang/[date]` | Yes — same as choghadiya | **302 redirect** |
| `/<lc>/panchang/date/[date]` | Yes — same | **302 redirect** |
| `/<lc>/daily/[date](/[city])?` | Yes — same | **302 redirect** |
| `/<lc>/horoscope/[rashi]/[date]` | Yes — today's horoscope is the dominant user query | **302 redirect** (replaces current soft-404 behaviour after western→vedic alias resolves) |
| `/<lc>/festivals/[slug]/[year]` | No — festivals are fixed-date events, "today" is nonsense | **Real HTTP 404** |
| `/<lc>/festivals/[slug]/[year]/[city]` | No — same | **Real HTTP 404** |
| `/<lc>/hindu-calendar/[year]` | No — year-keyed, "today" is not a year | **Real HTTP 404** |
| `/<lc>/vivah-muhurat/[year]` | No — same | **Real HTTP 404** |
| `/<lc>/calendar/regional/bengali/[year]` | No — same | **Real HTTP 404** |
| `/<lc>/muhurta/[type]/[year]/[month]/[city]` | No — year-month keyed | **Real HTTP 404** for bad year/month; type deferred to slug whitelist |
| `/<lc>/career-muhurta/[activity]` | (slug-based — see §5) | **Ships broken in this commit; tracked in §5** |
| `/<lc>/calendar/[slug]` | (slug-based — see §5) | **Ships broken in this commit; tracked in §5** |

**Policy statement (the explicit decision):** date-keyed routes that have a natural "today" interpretation redirect `today` to today's canonical date URL with HTTP 302 (temporary). Every other invalid slug on date-/year-keyed routes returns real HTTP 404. We do not invent `/today` aliases on routes where "today" has no semantic meaning. This applies retroactively to `/horoscope/[rashi]/today` (which currently soft-404s after the alias resolves) and forward to any new `/[date]` or `/[year]` route added in future.

### 3.2 Why proxy.ts (single source of truth) and not per-page

The round-1 reviewer proposed per-page `if (dateStr === 'today') redirect(...)` blocks at the top of each affected `page.tsx`. Both approaches work; I'm preferring proxy.ts for these reasons:

- **One file, one diff** — proxy.ts gets +50 lines; per-page would touch 5 page.tsx files with copy-pasted today-resolution code, each needing to import a timezone helper.
- **One redirect hop instead of two** — without proxy handling, a request to `/choghadiya/today` would first hit the locale-prefix redirect in proxy.ts (308 → `/en/choghadiya/today`), THEN hit the page-level handler (302 → `/en/choghadiya/2026-06-04`). With proxy handling both, it's one hop directly to `/en/choghadiya/2026-06-04`. Google tolerates chains up to ~10 hops but each hop slows crawling; flatter is better.
- **Edge timing is fine** — proxy runs at the edge before any ISR generation. `new Date()` and timezone resolution work normally in an edge function (it's not an ISR-cached page, so Lesson ZD doesn't apply).
- **Future-proof** — new `[date]` routes inherit the validation automatically if they match a prefix; reviewer's per-page pattern requires the next dev to remember (Lesson E — guard in code, not memory).
- **Garbage slugs covered for free** — once proxy validates format, `/choghadiya/invalid-date-xyz` is rejected at the same place as `/choghadiya/today`, no extra code.

### 3.3 Validation table — in scope for this commit

`<lc>` = one of the 9 active locales (`en|hi|ta|te|bn|gu|kn|mai|mr`). `today` is a valid alias only on the rows marked "→ 302". Everything else not matching the required format → real 404.

| Route family | Required segment | `today` allowed? | Examples that pass | Examples that 404 / 302 |
|---|---|---|---|---|
| `/<lc>/choghadiya/[date]` | `YYYY-MM-DD` | Yes → 302 | `2026-06-04` | `today` → 302; `tomorrow`, `foo` → 404 |
| `/<lc>/gauri-panchang/[date]` | `YYYY-MM-DD` | Yes → 302 | `2026-06-04` | `today` → 302; `foo` → 404 |
| `/<lc>/panchang/date/[date]` | `YYYY-MM-DD` | Yes → 302 | `2026-06-04` | `today` → 302; `foo` → 404 |
| `/<lc>/daily/[date]` | `YYYY-MM-DD` | Yes → 302 | `2026-06-04` | `today` → 302; `foo` → 404 |
| `/<lc>/daily/[date]/[city]` | `YYYY-MM-DD` (date only; city not validated — deliberate, see §3.5) | Yes → 302 | `2026-06-04/delhi` | `today/delhi` → 302; `foo/delhi` → 404 |
| `/<lc>/horoscope/[rashi]/[date]` | `YYYY-MM-DD`, rashi matches existing alias rules | Yes → 302 (after western→vedic alias) | `mesh/2026-06-04` | `mesh/today` → 302; `mesh/foo` → 404 |
| `/<lc>/festivals/[slug]/[year]` | year = `YYYY` (2020–2035) | No → 404 | `diwali/2026` | `diwali/today`, `diwali/2x26` → 404 |
| `/<lc>/festivals/[slug]/[year]/[city]` | year = `YYYY` (city not validated) | No → 404 | `diwali/2026/delhi` | `diwali/today/delhi` → 404 |
| `/<lc>/hindu-calendar/[year]` | `YYYY` (2020–2035) | No → 404 | `2026` | `today`, `foo` → 404 |
| `/<lc>/vivah-muhurat/[year]` | `YYYY` (2020–2035) | No → 404 | `2026` | `today` → 404 |
| `/<lc>/calendar/regional/bengali/[year]` | `YYYY` (2020–2035) | No → 404 | `2026` | `today` → 404 |
| `/<lc>/muhurta/[type]/[year]/[month]/[city]` | year `YYYY`, month `1–12` (type and city not validated here) | No → 404 | `marriage/2026/6/delhi` | `marriage/today/6/delhi`, `marriage/2026/13/delhi` → 404 |

**Explicitly out of scope, ships broken after this commit, tracked in §5:** `/career-muhurta/today` and `/calendar/today` — both fall into the slug-whitelist follow-up category. **This commit fixes 6 of the 8 URL families from §1.1; the remaining 2 are tracked.**

### 3.4 Proxy code sketch — single-source two-layer implementation

```ts
// near top of proxy.ts, after RETIRED_LOCALES handling

// Route prefixes (relative to /<lc>) and the required format of the
// FIRST dynamic segment after the prefix. The "today" group accepts
// the literal slug 'today' as an alias for the SEO_CITY timezone's
// current date.
const DATE_KEYED_TODAY_AWARE = [
  '/choghadiya/',
  '/gauri-panchang/',
  '/panchang/date/',
  '/daily/',
];
const DATE_KEYED_RASHI_ROUTE = '/horoscope/'; // [rashi]/[date]
const YEAR_KEYED = [
  '/hindu-calendar/',
  '/vivah-muhurat/',
  '/calendar/regional/bengali/',
];

// SEO_CITY timezone (matches the SEO_CITY = 'delhi' constant in the
// affected page files). 'today' on today-aware routes resolves to
// today's date in Asia/Kolkata to match what the page would render
// for the default SEO city anyway. This is consistent with the
// project rule that page content is SEO-anchored to Delhi while
// allowing per-user city override on the client.
const SEO_CITY_TZ = 'Asia/Kolkata';

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const YEAR_RE = /^\d{4}$/;

function todayInTZ(tz: string): string {
  // Edge-runtime safe: Intl.DateTimeFormat is available.
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
  });
  return fmt.format(new Date()); // 'YYYY-MM-DD'
}

function isValidDate(s: string): boolean {
  const m = s.match(DATE_RE);
  if (!m) return false;
  const y = +m[1], mo = +m[2], d = +m[3];
  if (y < 2020 || y > 2035 || mo < 1 || mo > 12 || d < 1 || d > 31) return false;
  const t = new Date(Date.UTC(y, mo - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() + 1 === mo && t.getUTCDate() === d;
}

function isValidYear(s: string): boolean {
  if (!YEAR_RE.test(s)) return false;
  const y = +s;
  return y >= 2020 && y <= 2035;
}

function rewriteAs404(req: NextRequest, locale: string): NextResponse {
  // Rewrite to a path that does not match any real route so Next falls
  // through to [locale]/not-found.tsx. The explicit { status: 404 }
  // overrides whatever status the rewrite target would otherwise emit.
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}/__not_found__`;
  return NextResponse.rewrite(url, { status: 404 });
}

function redirectToToday(req: NextRequest, locale: string, prefix: string, restAfterFirstSeg: string): NextResponse {
  const today = todayInTZ(SEO_CITY_TZ);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${prefix}${today}${restAfterFirstSeg}`;
  // 302 (temporary): "today" changes daily, so we MUST NOT 301 — see §4.2.
  return NextResponse.redirect(url, 302);
}

// inside proxy() after pathnameLocale is established (existing code):
if (pathnameLocale) {
  // pathname examples: "/en", "/en/choghadiya/today", "/en/festivals/diwali/today"
  // Edge case: "/en" with no trailing slash → tail === "" → skip the loops.
  const tail = pathname.slice(pathnameLocale.length + 1); // "" or "choghadiya/today"

  if (tail) {
    // Today-aware date routes: 'today' → 302 to YYYY-MM-DD; bad format → 404
    for (const prefix of DATE_KEYED_TODAY_AWARE) {
      const prefixNoLead = prefix.slice(1); // "choghadiya/"
      if (tail.startsWith(prefixNoLead)) {
        const rest = tail.slice(prefixNoLead.length); // "today" or "today/delhi"
        const slashIdx = rest.indexOf('/');
        const firstSeg = slashIdx === -1 ? rest : rest.slice(0, slashIdx);
        const tailAfterFirstSeg = slashIdx === -1 ? '' : rest.slice(slashIdx);
        if (firstSeg === 'today') {
          return redirectToToday(request, pathnameLocale, prefix, tailAfterFirstSeg);
        }
        if (firstSeg && !isValidDate(firstSeg)) {
          return rewriteAs404(request, pathnameLocale);
        }
        break; // matched a prefix; don't fall through
      }
    }

    // horoscope/[rashi]/[date] — 'today' → 302; bad date → 404
    if (tail.startsWith('horoscope/')) {
      const segs = tail.split('/'); // ['horoscope', rashi, date?]
      if (segs.length >= 3) {
        const date = segs[2];
        if (date === 'today') {
          const today = todayInTZ(SEO_CITY_TZ);
          const url = request.nextUrl.clone();
          url.pathname = `/${pathnameLocale}/horoscope/${segs[1]}/${today}`;
          return NextResponse.redirect(url, 302);
        }
        if (!isValidDate(date)) {
          return rewriteAs404(request, pathnameLocale);
        }
      }
    }

    // Year-keyed: any bad year → 404
    for (const prefix of YEAR_KEYED) {
      const prefixNoLead = prefix.slice(1);
      if (tail.startsWith(prefixNoLead)) {
        const firstSeg = tail.slice(prefixNoLead.length).split('/')[0];
        if (firstSeg && !isValidYear(firstSeg)) {
          return rewriteAs404(request, pathnameLocale);
        }
        break;
      }
    }

    // festivals/[slug]/[year] (and /[city]) — bad year → 404
    if (tail.startsWith('festivals/')) {
      const segs = tail.split('/');
      if (segs.length >= 3 && !isValidYear(segs[2])) {
        return rewriteAs404(request, pathnameLocale);
      }
    }

    // muhurta/[type]/[year]/[month]/[city] — bad year or month → 404
    if (tail.startsWith('muhurta/')) {
      const segs = tail.split('/');
      if (segs.length >= 4) {
        if (!isValidYear(segs[2])) return rewriteAs404(request, pathnameLocale);
        const month = +segs[3];
        if (!Number.isInteger(month) || month < 1 || month > 12) {
          return rewriteAs404(request, pathnameLocale);
        }
      }
    }
  }

  // ... existing locale cookie-set return ...
}
```

### 3.5 Notes on the sketch

- `__not_found__` is chosen as the rewrite marker because no real route uses double-underscore-bracketed paths and it reads as an obvious sentinel in logs.
- `pathname === '/en'` (no trailing slash, no segments after locale) → `tail === ''` → all loops skip → existing locale flow runs. Safe.
- `city` in `daily/[date]/[city]` and `festivals/[slug]/[year]/[city]` is **deliberately not validated here**. City is a slug whitelist (`CITIES` constant in `src/lib/constants/cities.ts`) that drifts with new city additions; better handled per-page or in a follow-up that imports the whitelist. Bad city today → soft 404; matches existing behaviour, not regressed.
- `muhurta/[type]` — the `type` slug whitelist (`marriage`, `vehicle`, etc.) is also deferred. Bad type → soft 404 today, soft 404 after this commit. Tracked in §5.
- `horoscope/[rashi]` — the rashi slug is validated by the existing `getRashiBySlug()` flow in the page; bad rashi → notFound today, still notFound after this commit. Out of scope for this fix. The asymmetric handling is intentional: rashi has a tight slug whitelist (12 values + 12 western aliases), date has an open format.

## 4. SEO impact analysis

**Reviewer-asked question: "would redirects get us penalised by GSC?"** Short answer: no — the proposed redirects are *strictly better* for SEO than the current soft-404 state. Detailed below.

### 4.1 What Google actually penalises

Google Search Central's published quality signals around URL handling:

| Signal | Google's stated behaviour | Affects ranking? |
|---|---|---|
| **Soft 404** (200 OK + "page not found" body) | Explicitly classified in GSC Coverage report under "Excluded — Soft 404". Listed in [Search Console Help: Soft 404](https://support.google.com/webmasters/answer/2409439) as a signal the site has indexing/quality problems. | **Yes — site-wide quality signal**, contributes to crawl-budget reduction and can affect ranking of unrelated pages. |
| **Real HTTP 404** | Treated as the canonical "this URL does not exist" signal. Drops from index after consistent failure, frees crawl budget for real pages. | No — neutral, the correct behaviour for non-existent URLs. |
| **302/307 temporary redirect to canonical URL** | Documented as the correct pattern for "URL has temporarily moved" or "URL is a shortcut to a canonical resource." PageRank is transferred to the target. | No penalty. Source URL is kept in Google's discovery list but not indexed; target URL ranks. |
| **301/308 permanent redirect** | Documented for permanent URL moves. PageRank fully transferred; source URL eventually drops from index. | No penalty. |
| **Redirect chains** | Google follows up to 10 hops, but each hop slows crawling. Flat redirects preferred. | Mild — chains >5 hops can delay/reduce crawl. Ours is 1 hop. |
| **Redirect loops** | Crawler aborts. URL is flagged in GSC. | Yes — immediate de-indexing of the source. Our fix has no loops. |
| **Sneaky redirects** (e.g., desktop→target page, mobile→phishing page) | Manual action in GSC. | Yes — actual penalty. N/A to our fix. |
| **Cloaking** (showing different content to bot vs user) | Manual action. | Yes — actual penalty. N/A. |

**Conclusion:** the soft-404 state we're in right now *is* a Google-penalised pattern. Moving to a mix of (a) 302 redirects to canonical date URLs for today-aware routes and (b) real 404s for everything else is the *correction*, not a new risk.

### 4.2 Why 302 (not 301/308) for the `today` redirects

The `today` shortcut resolves to a *different target every day*. If we used 301 or 308 (permanent), browsers and intermediate caches (CDN, ISP caches, browser cache) would memoise today's date as the permanent target — tomorrow, the same `/today` URL would still redirect to yesterday's date. 302 (and 307) are documented as *temporary*; clients re-fetch the source URL on each request. This is the correct semantic.

### 4.3 SEO impact comparison — current vs proposed

For `/choghadiya/today` (representative today-aware route):

| State | Status served | GSC Coverage report | Crawl budget | PageRank | Risk |
|---|---|---|---|---|---|
| **Current (soft 404)** | 200 + "404" body | "Excluded — Soft 404" | Wasted (Google revisits) | Diluted | Site-wide quality signal hit |
| **Proposed (302)** | 302 → today's `YYYY-MM-DD` | "URL is a redirect" (informational) | Minimal (Google deprioritises pure-redirect URLs) | Transferred to dated page | None |

For `/festivals/diwali/today` (representative today-blind route):

| State | Status served | GSC Coverage report | Crawl budget | PageRank | Risk |
|---|---|---|---|---|---|
| **Current (soft 404)** | 200 + "404" body | "Excluded — Soft 404" | Wasted | Diluted | Site-wide quality signal hit |
| **Proposed (real 404)** | 404 | "Excluded — Not found (404)" (informational) | URL dropped after repeated failures | N/A (no value to transfer) | None |

Both directions are strict improvements.

### 4.4 Sitemap and internal-link audit

Verified 2026-06-04 (this session, before drafting v2):

- `/today` URLs in `sitemap.xml`: **0**
- Internal `<Link>` references to `/<route>/today`: **0**
- The `/choghadiya/[date]` page's "Today's Choghadiya" anchor already points to bare `/choghadiya` (the index page), not `/choghadiya/today`. Correct.

We do not need to repoint any internal links. The 302 traffic comes entirely from external sources (typed URLs, GSC URL Inspection probes, third-party backlinks if any), which is the *correct* place for a redirect to fire.

### 4.5 Side effects to monitor

- **GSC URL Inspection on the redirected URLs** will flip from "URL is unknown to Google" → "Page with redirect" within 1–2 crawls. This is the desired state — we don't want `/today` indexed as its own thing.
- **GSC Coverage report** "Soft 404" count should drop by the number of `/today`-shaped URLs currently flagged (estimate: 18+ across the 9 locales × 2 today-aware routes we know GSC has visited).
- **Crawl budget** for date routes should improve marginally — Google stops re-visiting soft 404s, freeing budget for real dated pages.
- **Backlinks pointing at `/today`** (if any — unknown) continue to land users on the right page via the 302. No broken-link experience.

## 5. Out of scope — ships broken after this commit (tracked)

| Route | Why deferred | Soft-404 status post-commit |
|---|---|---|
| `/<lc>/career-muhurta/[activity]` | Slug whitelist (~12 activities); list lives in route page, not extractable to proxy cheaply | Still soft-404 |
| `/<lc>/calendar/[slug]` | Festival-key whitelist; large, drifts with festival additions | Still soft-404 |
| `/<lc>/festivals/[slug]` (no year) | Slug whitelist | Still soft-404 |
| `/<lc>/learn/yoga/[slug]`, `/<lc>/learn/transits/[slug]`, `/<lc>/learn/planet-in-house/[slug]`, `/<lc>/learn/nakshatra-pada/[slug]` | Curriculum slug whitelists | Still soft-404 |
| `/<lc>/vrat-katha/[slug]`, `/<lc>/puja/[slug]`, `/<lc>/stories/[slug]` | Content slug whitelists | Still soft-404 |
| `/<lc>/devotional/[type]/[slug]` | Two-segment whitelist | Still soft-404 |
| `/<lc>/muhurta/[type]/...` (type validation only) | Type whitelist (~10 values) | Bad type → still soft-404; bad year/month → real 404 |

**Net effect of this commit:** 6 of the 8 URL families in §1.1 evidence go from soft-404 → either 302 (today-aware) or real 404 (today-blind). The remaining 2 (`/career-muhurta/today`, `/calendar/today`) plus the broader slug-whitelist long-tail above are tracked in a follow-up spec to be drafted after this one merges.

**Follow-up approach (separate spec):** each slug-whitelist route gets a per-page change — replace `if (!known) notFound()` with `redirect()` to the parent index (for slugs where a parent-index fallback makes sense, e.g. `/festivals/unknownslug` → `/festivals`), OR a `route.ts` handler that returns explicit 404 status. Scope deferred until this commit ships and we measure GSC recovery.

## 6. Verification plan

### 6.1 Pre-merge — gates that BLOCK merge

1. **Verify `NextResponse.rewrite(url, { status: 404 })` actually puts 404 on the wire.** Reviewer's load-bearing concern. The Next.js 16 docs describe `ResponseInit` with `status` on `NextResponse.rewrite`, but this surface is exactly where `notFound()`'s status got eaten by the prerender cache — there is non-zero risk that the rewrite's status is also dropped. **Procedure:**
   - Ship the proxy change on a feature branch.
   - Deploy to Vercel **Preview** (not main; bare push to feature branch triggers a preview deploy).
   - From a terminal, run:
     ```bash
     curl -sI 'https://<preview-url>/en/choghadiya/foo'   # expect HTTP/2 404
     curl -sI 'https://<preview-url>/en/festivals/diwali/today'  # expect HTTP/2 404
     curl -sI 'https://<preview-url>/en/choghadiya/today'  # expect HTTP/2 302 + location: /en/choghadiya/<today>
     ```
   - **If any 404-expected row returns 200, fall back to Plan B (§7.3) before merging.**

2. **Locale flow unaffected.** Curl the preview:
   - `/` → 307 to `/en/` (existing behaviour preserved)
   - `/en/` → 200 (existing behaviour preserved)
   - `/sa/choghadiya/2026-06-04` → 301 to `/en/choghadiya/2026-06-04` (existing retired-locale behaviour preserved)

3. **Type-check + tests pass** as per project Definition of Done.

### 6.2 Proxy unit tests (added to `src/__tests__/proxy.test.ts` — new file if not present)

Cover both layers + the policy split:

| Input | Expected output |
|---|---|
| `/en/choghadiya/2026-06-04` | pass-through (NextResponse.next) |
| `/en/choghadiya/today` | 302 → `/en/choghadiya/<today YYYY-MM-DD in Asia/Kolkata>` |
| `/en/choghadiya/tomorrow` | rewrite to 404 |
| `/en/choghadiya/invalid-date-xyz` | rewrite to 404 |
| `/en/gauri-panchang/today` | 302 → today's date |
| `/en/panchang/date/today` | 302 → today's date |
| `/en/daily/today/delhi` | 302 → `/en/daily/<today>/delhi` (preserves trailing city segment) |
| `/en/horoscope/mesh/today` | 302 → `/en/horoscope/mesh/<today>` |
| `/en/horoscope/mesh/2026-06-04` | pass-through |
| `/en/horoscope/mesh/foo` | rewrite to 404 |
| `/en/festivals/diwali/today` | rewrite to 404 |
| `/en/festivals/diwali/2026` | pass-through |
| `/en/festivals/diwali/2026/delhi` | pass-through |
| `/en/hindu-calendar/today` | rewrite to 404 |
| `/en/hindu-calendar/2026` | pass-through |
| `/en/vivah-muhurat/today` | rewrite to 404 |
| `/en/calendar/regional/bengali/today` | rewrite to 404 |
| `/en/muhurta/marriage/2026/13/delhi` | rewrite to 404 (month out of range) |
| `/en/muhurta/marriage/today/6/delhi` | rewrite to 404 (year not 4-digit) |
| `/en/muhurta/marriage/2026/6/delhi` | pass-through |
| `/en/totally-bogus` | pass-through to existing global not-found |
| `/en` | pass-through to existing locale flow |
| `/` | redirect to `/en/` (existing locale flow) |

### 6.3 Post-merge prod sweep (T+0, within minutes of deploy)

Re-run the §1.1 evidence table against prod. Every soft-404 row except the two deferred (`/career-muhurta/today`, `/calendar/today`) must flip to either `[404]` or `[302]` per §3.1.

### 6.4 GSC URL Inspection (T+48h)

Spot-check on at least 3 of the affected URLs across the 9 locales:
- `/en/choghadiya/today` — expected: "Page with redirect"
- `/mai/choghadiya/today` — expected: "Page with redirect"
- `/en/festivals/diwali/today` — expected: "Not found (404)"
- `/en/hindu-calendar/today` — expected: "Not found (404)"

### 6.5 GSC Coverage report (T+14d)

"Excluded — Soft 404" count for the affected routes should trend down to ~zero (excluding the deferred §5 routes).

## 7. Open questions for the reviewer

1. **Choice of rewrite marker path** — `__not_found__`. Alternatives: `_internal/not-found`, or an existing real route guaranteed to not exist. Pick the one that reads cleanest in logs. (Non-blocking.)
2. **`SEO_CITY_TZ = 'Asia/Kolkata'`** — matches the `SEO_CITY = 'delhi'` constant in the affected pages. Worth confirming we don't want to derive this from the request's geo headers (Vercel-IP-Country) instead. Argument against: consistency — the page renders SEO content for Delhi by default regardless of the visitor, so the `today` resolution should too. (Lean: keep Delhi.)
3. **2020–2035 year range** — reviewer's round-1 note agreed: keep the clamp. Historical festival lookups have zero GSC impressions. Confirmed.

(§6.5 from v1 — `NextResponse.rewrite` with status — promoted to a blocking gate in §6.1.)

## 8. Risk assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `NextResponse.rewrite(url, { status: 404 })` ships as 200 (rewrite's status also dropped by prerender cache) | Medium — this is the same surface where `notFound()`'s status got eaten | Spec's "real 404" promise broken; falls back to soft 404 | Preview-deploy `curl -I` verification BEFORE merge (§6.1.1). Plan B in §7.3. |
| Regex too strict, rejects a valid URL pattern | Low | Regression on a real page | Unit tests §6.2 + post-merge curl spot-check §6.3. |
| Proxy edge bundle size exceeds 1 MB | Very low | Proxy stops running | `wc -c src/proxy.ts` before/after; add to PR description. Current 93 lines, after ~140 lines, well under limit. |
| Two-hop redirect chain via the existing western→vedic alias for horoscope routes | Low (1 chain becomes 2 hops total) | Mildly slower Google crawl on horoscope/today URLs | Acceptable. Could collapse by inlining the alias into the proxy too, but out of scope. |
| Vercel ISR cache holds the old soft-404 entries for affected URLs after deploy | Medium | New code runs but old URLs still serve 200 from CDN cache until they revalidate | Vercel revalidates on push automatically; `vercel cache invalidate` if needed for stuck entries. |
| Edge runtime doesn't have `Intl.DateTimeFormat` with timezone support | Very low — documented to work in V8 isolates | `todayInTZ` throws, request 500s | Unit test the helper; if needed, fall back to a manual UTC offset (`Asia/Kolkata` is +5:30 fixed, no DST). |

### Plan B if `NextResponse.rewrite` with status doesn't put 404 on the wire

```ts
// Replace rewriteAs404 with:
function rewriteAs404(req: NextRequest, locale: string): NextResponse {
  const body = `<!DOCTYPE html><html lang="${locale}"><head><meta charset="utf-8"><title>Not Found</title><meta name="robots" content="noindex"></head><body><h1>Page not found</h1><p><a href="/${locale}">Home</a></p></body></html>`;
  return new NextResponse(body, {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
```

Loses the styled `not-found.tsx` UI but guarantees real 404 status. Accept the UI loss as the lesser evil — soft 404 is worse than ugly 404.

## 9. Deliverables (if approved)

- `src/proxy.ts` — ~50 line addition (validation + redirect/rewrite helpers + Intl.DateTimeFormat for today resolution).
- `src/__tests__/proxy.test.ts` — new file, covering §6.2's full table.
- `docs/specs/2026-06-04-soft-404-date-keyed-routes.md` — this spec, marked **Implemented** after merge.
- PR description references §1.1 (evidence), §3.1 (policy), §6.1 (pre-merge verification log), and §4 (SEO analysis).
- **Deploy via daily cron** — no `[deploy]` marker. Per `feedback_deploy_marker_seo_fixes`, SEO fixes ride the cron. Confirmed.
- Post-deploy: §6.3 curl sweep, paste result into PR comment.
- T+48h: §6.4 GSC URL Inspection spot-check.
- T+14d: §6.5 GSC Coverage report check.
- Follow-up spec for §5 slug-whitelist routes drafted after T+14d measurement.
