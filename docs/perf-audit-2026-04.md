# Performance audit — Dekho Panchang

**Date:** 2026-04-16
**Scope:** Baseline measurement + top opportunities per `docs/prompts/09-performance-audit.md`
**Auditor:** Claude Opus 4.6 + local instrumentation
**Verdict:** **Server is fast, client bundle is heavy.** Two JS chunks exceed 1.3 MB each. Targeted chunk-splitting + heavy-dep isolation would deliver the biggest wins.

---

## Methodology caveats

- All numbers are from a **local dev server** (webpack mode) on localhost, not production.
- **No real Lighthouse / Core Web Vitals data captured** in this pass — the browsers available here are limited and I can't reliably throttle to "4G mobile." You should run a real Lighthouse pass in Chrome DevTools against the Vercel production URL to confirm LCP/CLS/INP before shipping fixes.
- Bundle sizes are post-build production chunks (from `.next/static/chunks`).
- This audit is baseline + opportunity ranking, not fixes.

---

## Baseline measurements

### Server-side response times (dev, localhost)

| Route | Time | HTML size |
|---|---|---|
| `/en` | ~320 ms | 233 KB |
| `/en/panchang` | ~390 ms | 146 KB |
| `/en/kundali` | ~450 ms | 106 KB |
| `/api/panchang?lat=…&lng=…` | 20–60 ms | — |
| `/api/kundali` (POST) | 20–75 ms | — |

**Interpretation:** server computation is not the bottleneck. Kundali calculation lands in ~20-75 ms warm. Panchang is even faster. API endpoints are already in good shape.

The server-rendered HTML at 233 KB for the home page is large — likely a lot of inline JSON-LD, pre-rendered widget content, and inlined CSS. Worth profiling what's in it, but not the first fire to fight.

### Client bundle sizes (top 10 chunks, production build)

| Size | Chunk |
|---|---|
| **1.46 MB** | `05tem3dlzbst6.js` |
| **1.37 MB** | `0gs~ibk7r7n__.js` |
| 616 KB | `0~zpxgyh1t0jt.js` |
| 444 KB | `0hmtyw6l4nohe.js` |
| 418 KB | `14g13qf5zcona.js` |
| 362 KB | `01g6r-b63ydy..js` |
| 313 KB | `0ynn.6vlw.qq7.js` |
| 303 KB | `0k2q1oy8jf1zy.js` |
| 294 KB | `08jivuyasvvyk.js` |
| 282 KB | `03plp3zm11qqs.js` |

Two chunks > 1.3 MB each is a red flag. Combined with the next 8 chunks, a cold load on any heavy page is pulling down several MB of JS.

### Source file size indicators

| Lines | File |
|---|---|
| 5,637 | `src/app/[locale]/kundali/page.tsx` |
| 2,662 | `src/app/[locale]/panchang/page.tsx` |
| 2,405 | `src/lib/kundali/yogas-complete.ts` |
| 1,822 | `src/components/kundali/InterpretationHelpers.tsx` |
| 1,683 | `src/lib/export/pdf-kundali.ts` |
| 1,661 | `src/lib/ephem/panchang-calc.ts` |
| 1,470 | `src/app/[locale]/dashboard/page.tsx` |

The kundali page at 5,637 lines is down from ~7,100 per CLAUDE.md (already partially extracted), but the tab components imported via `next/dynamic` are still substantial. The sheer file size suggests a lot of JSX lives in one module bundle.

### Heavy runtime dependencies

| Size | Package | Likely fate in bundle |
|---|---|---|
| 36 MB | `pdfjs-dist` | Used where? Should be server-only if possible |
| 34 MB | `lucide-react` | `optimizePackageImports` is already on — should tree-shake well |
| 29 MB | `jspdf` | Pulled in by `src/lib/export/pdf-kundali.ts`. Client-side. Big. |
| 21 MB | `pdf-parse` | Classical-texts ingestion only? Should be server-only |

---

## Top 3 opportunities (ranked by impact / effort)

### 1. Lazy-load the PDF stack (jsPDF) — highest ROI

**Problem.** `jspdf` (~29 MB on disk, probably 200–400 KB minified in the bundle) is imported by `src/lib/export/pdf-kundali.ts`, which is dynamically imported from the kundali page's "PDF" button:

```tsx
const { exportKundaliPDF } = await import('@/lib/export/pdf-kundali');
```

That `import()` is already dynamic, so jsPDF *shouldn't* be in the initial page chunk — but it's worth verifying with a bundle analyzer. If any eager import path exists (e.g., from `PatrikaTab`, which also imports `generateKundaliPrintHtml`), jsPDF is being eagerly loaded for every kundali viewer.

**Expected impact.** If jsPDF is currently eager: 200–400 KB off the kundali chunk, proportional LCP improvement on that route. If already lazy: no change — but confirm.

**Effort.** 30 min to install `@next/bundle-analyzer`, run `ANALYZE=true npm run build`, check whether jspdf is in the main chunk. If yes, audit every import path and make the cold path dynamic.

**Verification.** Compare `ls -la .next/static/chunks/*.js | sort -n` before and after. Run Lighthouse on `/en/kundali` before and after.

### 2. Audit and split the two 1.3 MB+ chunks

**Problem.** Two chunks at 1.46 MB and 1.37 MB is enormous. Likely candidates:
- `framer-motion` + all pages that use it → one big motion chunk
- The kundali page's direct imports (tippanni engine, yogas-complete, shadbala, bhavabala, divisional charts) → all bundled together
- D3 + chart utilities pulled in by multiple pages

**Expected impact.** Reducing the biggest chunk from 1.46 MB → 600 KB is a realistic target (second-party refactor), which on a cold 4G load saves ~1.5 s of TTI.

**Effort.** 3–4 hours:
1. Install `@next/bundle-analyzer`, produce the visual treemap
2. Identify the 3 biggest culprits
3. For each, decide: (a) dynamic-import behind a user action, (b) move to server-only, or (c) accept + split further via `splitChunks` tuning
4. Re-measure

**Verification.** Treemap-before vs. treemap-after. Lighthouse mobile score before vs. after.

### 3. Split the 5,637-line kundali page

**Problem.** Even with every tab being `next/dynamic`, the page module itself is 5.6K lines of TypeScript. Module-level constants, helpers, and shared state all live in one file. The parser has to chew through all of it for every request.

**Expected impact.** Less about runtime speed, more about:
- Faster HMR / dev iteration
- Smaller initial parse cost (even if the code splits, the dev bundle still has to go through it)
- Easier code review and safer refactoring
- May surface additional "this is eagerly imported when it shouldn't be" findings

**Effort.** Real work — probably 1–2 days to do safely. Use `docs/prompts/08-refactor-safely.md` as the framework. Extract:
- Compute helpers to `src/lib/kundali/view-helpers.ts`
- Tab-specific handlers to each tab component
- Module-level constants to `src/lib/constants/kundali-view.ts`
- Hooks (`useKundaliQueryParams`, `useKundaliSessionCache`, `useTransitData`) to `src/hooks/kundali/`

**Verification.** Build green, E2E tests green (especially the new `kundali-url-params.spec.ts`), no visible behavior change.

---

## Other observations worth tracking (lower priority)

- **Home page HTML is 233 KB** — inspect what's inline. JSON-LD structured data? Pre-rendered widget content? Likely some fat can be shed there, but it's server-rendered so the impact is on TTFB not bundle.
- **Fonts** — 8 font families per CLAUDE.md. Each adds a preconnect + request. Worth auditing which ones are actually reached from the initial render path vs. loaded on demand.
- **Framer Motion on the home page** — CLAUDE.md notes this was replaced with CSS animations on home. Verify nothing reintroduced it.
- **Image optimization** — no images were flagged, but I didn't run a Lighthouse image audit. A real pass should confirm every `<img>` is actually `<Image>`.
- **Service worker (sw.js)** — CacheFirst/SWR/NetworkFirst strategies documented. Should audit the version bump discipline — stale SWs breaking content updates is a class of bug not covered by this audit.

---

## Recommended next step

Before applying any fixes, **install the bundle analyzer**:

```bash
npm i -D @next/bundle-analyzer
```

Add to `next.config.ts`:

```ts
import bundleAnalyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
// wrap: withBundleAnalyzer(withNextIntl(nextConfig))
```

Then:

```bash
ANALYZE=true npm run build
```

Open the treemap in `/.next/analyze/client.html`. That visualizes where the 1.3 MB+ chunks come from, and the path forward usually reveals itself in 10 minutes.

Once the treemap is available, we can pick opportunities #1 and #2 with surgical precision rather than educated guesses.

---

## Definition of "done" for this audit

- [x] Baseline server timings captured
- [x] Baseline bundle sizes captured
- [x] Top 3 opportunities identified + ranked
- [ ] **Real Lighthouse pass from production URL** — deferred to a browser session with DevTools access
- [ ] **Bundle analyzer treemap** — requires installing `@next/bundle-analyzer` (not applied yet)

**Do not apply fixes until the treemap is in hand.** The fix estimates above are directional, not final.
