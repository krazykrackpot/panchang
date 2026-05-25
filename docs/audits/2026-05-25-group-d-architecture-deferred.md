# Group D — Architecture items deferred for separate sprints

Three larger refactors from `docs/audits/2026-05-25-outstanding-items.md` Group D were too big to bundle with the May-25 quick-wins PR. This doc sketches the approach for each so a future sprint can pick them up cold.

---

## D1 — Kundali generation off the main thread

**Problem:** `src/app/[locale]/kundali/Client.tsx:756` runs `generateTippanni()` + yoga + shadbala + bhavabala synchronously on the "Generate Chart" click. INP > 200 ms on mid-range mobile because:
- ~1.5 MB trilingual constants imported by the compute pipeline
- 47 dynamic component imports loaded eagerly
- Framer-motion render thrash during the 500 ms+ compute window

**Two viable approaches:**

### Approach A — Server Action

Convert the compute to a `'use server'` function called from the form submit handler.

```ts
// src/app/[locale]/kundali/actions.ts
'use server';

import { generateKundali } from '@/lib/kundali/generate';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';

export async function computeKundaliAction(input: BirthInput, locale: string) {
  const kundali = generateKundali(input);
  const tippanni = generateTippanni(kundali, locale);
  return { kundali, tippanni };
}
```

```diff
- // Client.tsx (current — sync on main thread)
- const kundali = generateKundali(input);
- const tippanni = generateTippanni(kundali, locale);
+ // Client.tsx — call server action
+ const { kundali, tippanni } = await computeKundaliAction(input, locale);
```

**Pros:** Compute runs on the server, ~1.5 MB constants never ship to the browser, INP becomes a network round-trip (~200-400 ms but yields the main thread).
**Cons:** Adds latency cost on the client (compute → network → render). Server-render is cheaper per-request now, but Vercel serverless cost grows with usage. Saved-chart re-renders need re-thinking (currently re-compute in-browser).

### Approach B — Web Worker

Keep the compute on the client but in a worker. The browser yields the main thread; INP becomes near-zero.

```ts
// src/lib/kundali/compute-worker.ts
self.onmessage = async (e) => {
  const { input, locale } = e.data;
  const { generateKundali } = await import('@/lib/kundali/generate');
  const { generateTippanni } = await import('@/lib/kundali/tippanni-engine');
  const kundali = generateKundali(input);
  const tippanni = generateTippanni(kundali, locale);
  self.postMessage({ kundali, tippanni });
};
```

**Pros:** No network hop; saved-chart re-compute still works; the 1.5 MB constants still ship but are bundled into the worker chunk (loaded on demand).
**Cons:** Worker bundles require Webpack config tweaks; structured-clone serialization costs for the kundali payload.

**Recommendation:** Approach A. The Vercel cost trade-off is well worth shedding the 1.5 MB client payload. Saved-chart re-renders can read from `kundali_snapshots` (already exists per CLAUDE.md kundali-snapshot architecture).

**Effort:** ~1 day including test rewrites + canary deploy.

---

## D2 — `/calendar` SSR fallback

**Problem:** `src/app/[locale]/calendar/Client.tsx:1` is `'use client'` with framer-motion. The festival/vrat listing requires JS execution for Googlebot to see content. Indexing latency + ranking penalty on the highest-traffic content page.

**Approach:**

1. Split `Client.tsx` into two:
   - `CalendarServerView.tsx` — pure server component that pre-computes the next 30 festival entries via `generateFestivalCalendarV2()` and renders them as a static `<ul>` for crawler consumption.
   - `CalendarInteractive.tsx` (existing `Client.tsx` renamed) — the framer-motion grid + filters. Mounted below the server `<ul>`.

2. The server view is hidden via CSS once the interactive grid hydrates (`sr-only` after `useEffect` mount), so users only ever see the rich grid.

```tsx
// src/app/[locale]/calendar/page.tsx
import { CalendarServerView } from './CalendarServerView';
const CalendarInteractive = dynamic(() => import('./Client'), { ssr: false });

export default async function Page({ params }: ...) {
  const { locale } = await params;
  const entries = await generateFestivalCalendarV2({ ... });
  return (
    <>
      <CalendarServerView entries={entries} locale={locale} />
      <CalendarInteractive />
    </>
  );
}
```

3. Update `tithi-month-grid` JSON-LD to match the visible entries.

**Effort:** ~3-4 hr.

---

## D3 — 1.5 MB trilingual constants split

**Problem:** `src/lib/constants/{nakshatras,tithis,rashis,grahas,yogas,karanas,muhurtas}.ts` etc. total ~1.5 MB of Trilingual text bundled into every client page that imports any constant. Tracked as R3-DX-5 known tech debt.

**Approach:** Per-category lazy loading.

1. Split each category file into per-locale chunks:
   ```
   src/lib/constants/nakshatras/en.ts
   src/lib/constants/nakshatras/hi.ts
   src/lib/constants/nakshatras/ta.ts
   ...
   src/lib/constants/nakshatras/index.ts  // dynamic loader
   ```

2. The `index.ts` provides a `loadNakshatras(locale)` function that does `await import(`./${locale}`)`. Consumers (currently `import { NAKSHATRAS } from '@/lib/constants/nakshatras'`) become `const NAKSHATRAS = await loadNakshatras(locale)`.

3. Server components await directly; client components wrap in `useEffect` + state.

**Pros:** Each page only loads its own locale's chunk (~150 KB vs 1.5 MB).
**Cons:** Async-everywhere conversion; some `tl(obj, locale)` call sites need restructuring.

**Alternative:** Keep the synchronous interface but use Next.js's per-locale code-splitting more aggressively. Investigate `next-intl`'s `getMessages()` pattern.

**Effort:** ~1-2 days, requires careful audit of every `import { X } from '@/lib/constants/X'` to ensure the async conversion doesn't break server rendering.

---

## Status

**Closed in PR #181 (Group D bundle):**
- D4 footer adds 5 entries ✅
- D5 build-robots wired into `npm run build` ✅
- D6 horoscope-date sitemap trimmed 30→7 days ✅
- D7 single canonical `TOP_FESTIVAL_SLUGS` in festival-defs ✅
- D9 hardcoded aggregateRating removed from /brihaspati ✅
- D10 LevelPortrait + yoga alt now localised via `tl()` ✅
- D11 PanchangClient `unoptimized` justified inline ✅
- D12 CLAUDE.md Static Page Budget updated for 9-locale prebuild ✅

**Deferred to dedicated sprints:**
- D1 Kundali server action — this doc
- D2 /calendar SSR fallback — this doc
- D3 1.5 MB constants split — this doc
- D8 thin landings (< 400 words) — content/copywriting task, not engineering

Pick whichever is the next priority and schedule a dedicated half-day per item.
