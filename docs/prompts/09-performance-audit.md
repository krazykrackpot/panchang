# 09 — Performance audit

Use this for a systematic performance pass. Don't guess — measure. Fix the
biggest thing first. Ship one improvement, measure again.

---

I want to do a performance audit on `<PROJECT NAME>`.

## Where I'm feeling pain

- `<e.g., "/kundali page takes 4s to interactive on 4G">`
- `<e.g., "mobile Lighthouse LCP is 4.2s, target is <2.5s">`
- `<e.g., "dashboard spinner hangs for 3s before content renders">`

## Measurement baseline (required before touching code)

Record the current state for each target:

1. **Lighthouse** (mobile, throttled 4G, CPU 4x slowdown):
   - LCP, CLS, INP, TTI, TBT
   - Page weight by type (HTML, JS, CSS, images, fonts)

2. **Bundle analyzer** (`@next/bundle-analyzer`) — top 10 heaviest modules.

3. **Server timing** (hot routes):
   - Response time p50/p95/p99
   - Which route handler / DB query / computation dominates

4. **Core Web Vitals from production** (Vercel Analytics / field data, not
   lab data). Lab tells you what's possible; field tells you what's real.

Paste the numbers before proposing fixes.

## Audit checklist (work through in order — cheapest-first)

### 1. Fonts
- `next/font` with `display: 'swap'` on every family?
- Only subsets actually used (avoid loading all Devanagari weights if you use 2)?
- Preloaded? Variable fonts where possible?

### 2. Images
- All `<Image>` components from `next/image`? No raw `<img>`?
- Explicit width/height to prevent CLS?
- Responsive `sizes` attribute matching real breakpoints?
- AVIF/WebP where source supports it?
- LCP image has `priority` + above-the-fold intersection check?

### 3. Client JS
- Heavy pages using route-level code splitting (`next/dynamic` with `ssr: false`
  for browser-only widgets)?
- Framer Motion / D3 / Chart libs loaded on demand, not globally?
- `optimizePackageImports` in `next.config` for common libs?
- No `useEffect` fetches on above-the-fold content — prefer server components
  with streaming?

### 4. Server-side
- Slow DB queries with EXPLAIN plans: `EXPLAIN (ANALYZE, BUFFERS) <query>`
- Missing indexes on hot-path `WHERE` / `ORDER BY` columns
- N+1 query patterns — replace with a single JOIN
- Heavy computations that could be cached (Runtime Cache, Edge Config,
  per-user profile snapshot)

### 5. Caching
- Static pages using `generateStaticParams` where appropriate?
- ISR revalidation windows sensible for content freshness?
- `Cache-Control` headers on API routes that return stable data?
- Supabase queries using `.select()` projection (fetch only needed columns)?

### 6. Third-party scripts
- Analytics, chat widgets, ads loaded via `next/script` with `strategy="lazyOnload"` or `"afterInteractive"`?
- Iframes deferred or lazy-loaded?

## Rules

1. **Measure, fix ONE thing, re-measure.** Don't batch optimizations —
   you won't know which one moved the needle.

2. **Ship the biggest win first.** Lighthouse's diagnostics panel tells
   you what's dominating. Trust it.

3. **Never regress to win elsewhere.** Every fix must improve the target
   without breaking anything else (bundle size, accessibility,
   correctness). Re-run the test suite after each change.

4. **Document the fix.** Commit message format:
   `perf(<area>): <fix> — <metric> before → after`
   Example: `perf(home): lazy-load TodayPanchangWidget — LCP 3.8s → 1.9s`

5. **Beware micro-optimizations.** Don't spend a day on a 20ms
   improvement when LCP is 4s.

## Give me back

1. The measurement baseline (numbers, not impressions).
2. The top 3 opportunities, ranked by expected impact / effort ratio.
3. For opportunity #1: file diff preview, expected impact, how to verify.
4. Wait for my "go" before implementing.
5. After each fix: fresh measurement, pass/fail against the target, next
   candidate.

## What NOT to do

- Don't jump straight to "add `"use client"` everywhere" — it usually makes
  things worse.
- Don't reach for React Server Components as a blanket answer. They help
  when the real bottleneck is hydration cost; they hurt when the bottleneck
  is DB latency.
- Don't add Redis / CDN / queues to fix a slow query. Fix the query.
- Don't optimize dev-mode performance (slow HMR) by changing production
  code. Different problem, different solution.
