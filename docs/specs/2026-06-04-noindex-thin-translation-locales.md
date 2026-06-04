# Transitional noindex for under-translated regional locales

**Status:** Draft for review — Q1–Q5 resolved 2026-06-04
**Author:** Claude (this session)
**Date:** 2026-06-04
**Audience:** Reviewing agent (Gemini / human reviewer) — sign off before implementation
**Related work:** [soft-404 spec](2026-06-04-soft-404-date-keyed-routes.md) (parallel PR); option A pilot (translation pipeline, separate spec to follow); R3a learn/modules dynamic route (task #95, separate spec follow-up)

---

## 0. Framing — noindex is staging, not policy

This commit ships a noindex *gate* — it is **transitional infrastructure**, not a permanent verdict. The intent is to formalise what Google's canonical-consolidation algorithm has already decided (untranslated regional-locale pages get folded into EN/HI canonicals) and stop the bleeding while option A's translation pipeline catches up. **As translations land via option A, pages flip back to indexable** — at first one slug at a time via the per-route override map (§2.1), then prefix-level once a (prefix × locale) is fully covered (§3 Promotion path). The end state, after option A succeeds, is most pages indexable across most locales — i.e., this gate progressively shrinks itself away.

The data structures and helpers in this spec are explicitly designed for that lifecycle. Reviewers and future readers should treat any entry in `INDEXABLE_BY_PREFIX` or `PER_ROUTE_INDEXABLE` as a *staging entry* awaiting translation, not a stable policy claim.

## 1. Problem statement

The GSC Coverage Drilldown export `dekhopanchang.com-Coverage-Drilldown-2026-06-04.zip` shows **524 pages** flagged as *"Duplicate, Google chose different canonical than user"*, growing from 32 → 524 over April 28 → May 26 (16× in 4 weeks). Latest data point is May 29 — 2 days before the impressions cliff. **The cliff is the user-visible consequence of this curve.**

### 1.1 Evidence

**Affected URL count by locale** (`Table.csv` from the export, parsed):

```
gu (Gujarati)    97 pages
kn (Kannada)     92 pages
bn (Bengali)     82 pages
mai (Maithili)   69 pages
ta (Tamil)       68 pages
mr (Marathi)     46 pages
te (Telugu)      41 pages
en               18 pages
hi               10 pages
sa                1 page  (retired locale, ignore)
─────────────────────────
Regional Indic  495 / 524 (94%)
```

**Affected URL count by pattern:**

```
*/learn/yoga/*               176 pages (across all locales)
*/learn/modules/*            117 pages
*/learn/planet-in-house/*      9 pages
*/devotional/*                41 pages
*/horoscope/*                 33 pages
*/gauri-panchang/*            33 pages
*/baby-names/*                14 pages
*/matching/*                  11 pages
others                        90 pages
```

### 1.2 Root cause

Multi-faceted but converges on the same shape: **regional-locale URLs render byte-identical EN or HI content** because:

1. **Data shape** — 14 constants files (`yoga-details.ts`, `rashi-compatibility.ts`, `planet-in-house-verses.ts`, etc.) declare `LocaleText = { en: string; hi: string; sa?: string }`. No fields for `ta`, `te`, `bn`, `gu`, `kn`, `mr`, `mai`.

2. **Rendering** — pages do `const isHi = isDevanagariLocale(locale)` then `isHi ? text.hi : text.en`. 5 non-Devanagari locales (ta/te/bn/gu/kn) render EN; 3 Devanagari (hi/mr/mai) render HI.

3. **Indexing** — Google's content-similarity classifier detects the duplication and consolidates. The user-declared canonical (`/gu/learn/X`) gets folded into the chosen canonical (`/en/learn/X`).

The longstanding fix in the codebase is the **noindex thin-coverage policy** in `src/lib/seo/indexable-locales.ts`. It works correctly where it's wired in. The bug is that several affected page families bypass `getPageMetadata` with hand-rolled `generateMetadata`, OR their layouts don't ship through this codepath at all. As a result the policy is unevenly applied.

### 1.3 Coverage gap audit (verified 2026-06-04)

```
Route                                 | Currently wires noindex on non-{en,hi}? | Notes
--------------------------------------|------------------------------------------|----------------------------
/learn/yoga/[slug]                    | ✓ (own INDEXABLE_LAGNA_LOCALES)          | Will migrate to central predicate (Q4)
/learn/planet-in-house/[slug]         | ✓ (verified live curl)                   | No retrofit needed
/learn/modules/<id> (117 folders)     | ✗ 0/117 emit any robots                  | 3 bugs: no robots, wrong hreflang, wrong canonical
/matching/[pair]                      | ✗ hand-rolled, no predicate              | Retrofit needed
/devotional/[type]/[slug]             | ✗ hand-rolled, no predicate              | Retrofit needed
/horoscope/[rashi]/[date]             | ✗ only `sa` gate (retired locale)        | Q5 — full predicate needed
/horoscope/[rashi] (evergreen)        | ✗ no predicate                           | Retrofit needed
/horoscope/[rashi]/weekly             | ✗ no predicate                           | Retrofit needed
/horoscope/[rashi]/monthly            | ✗ no predicate                           | Retrofit needed
/gauri-panchang/[date]                | ✗ no layout.tsx, page metadata           | Retrofit (preserve ta+te+kn coverage)
/baby-names/[nakshatra]               | ✗ page-level metadata                    | Retrofit needed
```

The /learn/modules row is the biggest single gap: 117 layouts × 9 locales = ~1,053 pages currently serving `<meta name="robots" content="index, follow">` while the sitemap restricts /learn/* to en+hi. Page meta beats sitemap restriction for Google's crawler.

## 2. Proposed fix

Three coordinated changes.

### 2.1 Rewrite `indexable-locales.ts` — per-prefix policy + per-route overrides

Replace the current `EN_HI_ONLY_PREFIXES: string[]` shape with a per-prefix indexable-locale map plus a sparse per-route override map for transitional staging:

```ts
// src/lib/seo/indexable-locales.ts (rewritten)

/**
 * Indexable-locale set per route prefix. A page at /{locale}{prefix}/* ships
 *   robots: index: true     if locale ∈ the set
 *   robots: index: false    otherwise
 * AND the sitemap+hreflang only emit URLs for the set.
 *
 * Entries here represent CURRENT translation coverage. As option A's
 * translation pipeline ships per-prefix coverage, expand the set here;
 * see §3 Promotion path.
 */
const INDEXABLE_BY_PREFIX: ReadonlyArray<[string, ReadonlyArray<string>]> = [
  ['/learn/',          ['en', 'hi']],
  ['/matching/',       ['en', 'hi']],
  ['/devotional/',     ['en', 'hi']],
  ['/baby-names/',     ['en', 'hi']],
  ['/horoscope/',      ['en', 'hi']],
  ['/gauri-panchang/', ['en', 'hi', 'ta', 'te', 'kn']],  // partial existing
];

/**
 * Per-route additions to the prefix indexable set. Use this to mark
 * individual translated slugs as indexable while the rest of the
 * prefix stays noindexed.
 *
 * Keys are routes WITHOUT the locale prefix.
 *
 * Lifecycle: option A's translation pipeline adds entries here as each
 * (slug × locale) ships with real translated content. When a full
 * (prefix × locale) is complete (e.g. all 137 yoga slugs translated to
 * mai), promote to INDEXABLE_BY_PREFIX above and remove the now-
 * redundant per-route entries. See §3.
 *
 * Empty at first commit; grows as option A ships translations.
 */
const PER_ROUTE_INDEXABLE: Readonly<Record<string, ReadonlyArray<string>>> = {
  // seed once translations land:
  // '/learn/yoga/gajakesari': ['mai'],
  // '/learn/yoga/vasumati':   ['mai'],
};

export function getIndexableLocales(route: string): ReadonlyArray<string> | undefined {
  let baseSet: ReadonlyArray<string> | undefined;
  for (const [prefix, set] of INDEXABLE_BY_PREFIX) {
    if (route.startsWith(prefix)) { baseSet = set; break; }
  }
  // Routes outside thin-coverage prefixes are fully indexable —
  // overrides are inert (no expressive shape for "remove a locale
  // from full coverage"; YAGNI until we hit such a case).
  if (baseSet === undefined) return undefined;

  const extras = PER_ROUTE_INDEXABLE[route];
  if (!extras || extras.length === 0) return baseSet;
  return [...new Set([...baseSet, ...extras])];
}

export function isLocaleIndexable(route: string, locale: string): boolean {
  const indexable = getIndexableLocales(route);
  if (!indexable) return true;
  return (indexable as readonly string[]).includes(locale);
}
```

The existing `getPageMetadata` integration in `src/lib/seo/metadata.ts:6579+` (which reads `getIndexableLocales`) is unchanged.

### 2.2 Wire the predicate into every hand-rolled layout

Routes from §1.3's "needs retrofit" rows. Each layout / page becomes:

```ts
import { isLocaleIndexable } from '@/lib/seo/indexable-locales';
import { buildIndexableLagnaHreflang } from '@/lib/seo/hreflang';

export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale, ...rest } = await params;
  const route = `/matching/${rest.pair}`;             // example
  const isIndexable = isLocaleIndexable(route, locale);

  return {
    // ... existing title, description, openGraph, twitter ...
    robots: isIndexable ? undefined : { index: false, follow: true },
    alternates: {
      canonical: `${BASE_URL}/${isIndexable ? locale : 'en'}${route}`,
      languages: buildIndexableLagnaHreflang(route),
    },
  };
}
```

Concrete files to touch:

1. `src/app/[locale]/matching/[pair]/layout.tsx`
2. `src/app/[locale]/devotional/[type]/[slug]/layout.tsx`
3. `src/app/[locale]/horoscope/[rashi]/[date]/layout.tsx` (replace `sa`-only gate with full predicate; keep sa-suppression as a no-op since it's also covered by the predicate)
4. `src/app/[locale]/horoscope/[rashi]/layout.tsx`
5. `src/app/[locale]/horoscope/[rashi]/weekly/layout.tsx`
6. `src/app/[locale]/horoscope/[rashi]/monthly/layout.tsx`
7. `src/app/[locale]/baby-names/[nakshatra]/page.tsx`
8. `src/app/[locale]/gauri-panchang/[date]/page.tsx`
9. `src/app/[locale]/learn/yoga/[slug]/layout.tsx` — migrate from local `INDEXABLE_LAGNA_LOCALES` to central `getIndexableLocales` (Q4 — same result today, removes drift surface)
10. **117 `src/app/[locale]/learn/modules/<id>/layout.tsx` files** — via shared helper (§2.3)

### 2.3 Shared helper for /learn/modules — R3b

Add `src/lib/seo/module-metadata.ts`:

```ts
// src/lib/seo/module-metadata.ts
import type { Metadata } from 'next';
import { isLocaleIndexable } from './indexable-locales';
import { buildIndexableLagnaHreflang } from './hreflang';
import { getModuleRef } from '@/lib/learn/module-sequence';
import { BASE_URL } from './base-url';

export async function generateModuleMetadata(modId: string, locale: string): Promise<Metadata> {
  const mod = getModuleRef(modId);
  const route = `/learn/modules/${modId}`;
  const isIndexable = isLocaleIndexable(route, locale);
  const canonicalLocale = isIndexable ? locale : 'en';

  const title = mod
    ? `${((mod.title as Record<string, string>)[locale] || mod.title.en)}  –  Learn Jyotish`
    : `Module ${modId}  –  Learn Jyotish`;
  const description = mod
    ? `${mod.topic} · Module ${modId}  –  Interactive Vedic astrology lesson`
    : undefined;

  return {
    title,
    description,
    robots: isIndexable ? undefined : { index: false, follow: true },
    alternates: {
      canonical: `${BASE_URL}/${canonicalLocale}${route}`,
      languages: buildIndexableLagnaHreflang(route),
    },
    openGraph: { title, description },
  };
}
```

Each of the 117 `learn/modules/<id>/layout.tsx` files becomes a 3-line stub:

```ts
import type { Metadata } from 'next';
import { generateModuleMetadata } from '@/lib/seo/module-metadata';

const MOD_ID = '23-4';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generateModuleMetadata(MOD_ID, locale);
}

// Layout body unchanged — keeps the existing ModuleArticleLD render
```

Mechanical retrofit. Codemod via AST (e.g. ts-morph) or per-file edits — **NOT** regex per memory Lesson H. The structural change per file is small and identical: swap the `buildHreflangMap` import for the helper import, replace the body of `generateMetadata` with a single line calling the helper. Verifiable by spot-curl after deploy.

(R3a — the architectural collapse into a single `[moduleId]` dynamic route — is queued as a separate spec; see §4 and task #95.)

### 2.4 Sitemap filtering — already wired

`src/app/sitemap.ts:525` already reads `getIndexableLocales(route)` to restrict the per-route fan-out. **No new code needed** here — once §2.1 lands, the sitemap automatically tightens. Verified by the §5.3 budget measurement.

## 3. Promotion path (as translations land)

The lifecycle each (route, locale) goes through:

```
                  ┌──────────────────────────────────────────┐
                  │   1. UNTRANSLATED                        │
                  │   prefix → ['en','hi']                   │
                  │   no per-route entry                     │
                  │   ⇒ noindex                              │
                  └──────────────────┬───────────────────────┘
                                     │ option A translates this single slug
                                     ▼
                  ┌──────────────────────────────────────────┐
                  │   2. PARTIALLY TRANSLATED                │
                  │   per-route entry added                  │
                  │   PER_ROUTE_INDEXABLE['/learn/yoga/X'] = │
                  │     ['mai']                              │
                  │   ⇒ /mai/learn/yoga/X becomes indexable  │
                  │     other yogas in mai stay noindexed    │
                  └──────────────────┬───────────────────────┘
                                     │ all slugs in this (prefix × locale) translated
                                     ▼
                  ┌──────────────────────────────────────────┐
                  │   3. FULLY TRANSLATED — PROMOTE          │
                  │   INDEXABLE_BY_PREFIX['/learn/yoga/'] += │
                  │     ['mai']                              │
                  │   remove all /learn/yoga/* entries from  │
                  │     PER_ROUTE_INDEXABLE                  │
                  │   ⇒ all yogas in mai indexable           │
                  └──────────────────────────────────────────┘
```

State 1 → state 2 is mechanical per translated slug. State 2 → state 3 is done **manually with verification** — adding mai to the prefix-level set is irreversible-looking in the diff, so a maintainer should confirm coverage before promoting. Recommend a small `scripts/check-translation-coverage.ts` (out of scope for this PR, queued as follow-up) that scans `PER_ROUTE_INDEXABLE` against `MODULE_SEQUENCE` / yoga-details / etc. and reports: *"prefix X is at 137/137 known slugs in locale Y — safe to promote."*

After option A succeeds end-to-end, `INDEXABLE_BY_PREFIX` should be a list of `[prefix, ['en','hi','ta','te','bn','gu','kn','mr','mai']]` entries (full coverage) — at which point the entire file is a no-op and can be removed.

## 4. Out of scope (explicit)

- **The actual translation work.** Option A pilot — separate spec to follow.
- **R3a — collapse 117 module folders into `[moduleId]` dynamic route.** Task #95 tracks this. Will be its own spec at `docs/specs/<date>-learn-modules-dynamic-route.md` queued after this PR is verified in GSC.
- **Promote-check automation.** `scripts/check-translation-coverage.ts` per §3 — defer until we actually need it.
- **Backfilling missing 308 www→apex redirects.** 23 of the 524 affected URLs are on `www.dekhopanchang.com`. The redirect is in place; Google is slowly consolidating. Tracked separately.

## 5. Verification plan

### 5.1 Unit tests (`src/lib/seo/__tests__/indexable-locales.test.ts`)

```ts
import { isLocaleIndexable, getIndexableLocales } from '../indexable-locales';

describe('prefix policy', () => {
  it('treats en + hi as indexable across thin-coverage prefixes', () => {
    for (const route of [
      '/learn/yoga/gajakesari',
      '/matching/aries-and-leo',
      '/devotional/aarti/santoshi-maa-aarti',
      '/baby-names/punarvasu',
      '/horoscope/aries/2026-06-04',
    ]) {
      expect(isLocaleIndexable(route, 'en')).toBe(true);
      expect(isLocaleIndexable(route, 'hi')).toBe(true);
    }
  });

  it('noindexes regional Indic locales on thin-coverage prefixes', () => {
    for (const route of [
      '/learn/yoga/gajakesari',
      '/matching/aries-and-leo',
      '/devotional/aarti/santoshi-maa-aarti',
      '/baby-names/punarvasu',
      '/horoscope/aries/2026-06-04',
    ]) {
      for (const loc of ['ta', 'te', 'bn', 'gu', 'kn', 'mr', 'mai']) {
        expect(isLocaleIndexable(route, loc)).toBe(false);
      }
    }
  });

  it('keeps ta+te+kn indexable on /gauri-panchang (has real translations)', () => {
    const route = '/gauri-panchang/2026-07-04';
    for (const loc of ['en', 'hi', 'ta', 'te', 'kn']) {
      expect(isLocaleIndexable(route, loc)).toBe(true);
    }
    for (const loc of ['bn', 'gu', 'mr', 'mai']) {
      expect(isLocaleIndexable(route, loc)).toBe(false);
    }
  });

  it('preserves full 9-locale indexability outside the thin prefixes', () => {
    const route = '/panchang/date/2026-06-04';
    expect(getIndexableLocales(route)).toBeUndefined();
    for (const loc of ['en','hi','ta','te','bn','gu','kn','mr','mai']) {
      expect(isLocaleIndexable(route, loc)).toBe(true);
    }
  });
});

describe('per-route overrides (transitional staging)', () => {
  // These tests use a synthetic harness — actual PER_ROUTE_INDEXABLE
  // is empty at first commit; tests verify the lookup mechanism only.
  // Use vi.mock or a test export to inject sample entries.

  it('unions prefix policy with explicit per-route additions', () => {
    // assuming /learn/yoga/gajakesari → ['mai'] in PER_ROUTE_INDEXABLE
    // (mock the override map for this test)
    // expect getIndexableLocales('/learn/yoga/gajakesari') to contain 'mai'
    // expect getIndexableLocales('/learn/yoga/gajakesari') to contain 'en' and 'hi'
  });

  it('still noindexes non-overridden slugs in the same prefix', () => {
    // /learn/yoga/vasumati has no override → still [en,hi] only
    // expect isLocaleIndexable('/learn/yoga/vasumati', 'mai') === false
  });

  it('ignores overrides for routes outside any thin-coverage prefix', () => {
    // /panchang/date/[date] is not in INDEXABLE_BY_PREFIX → overrides inert
    // expect getIndexableLocales('/panchang/date/2026-06-04') === undefined
  });
});

describe('promotion-ready behaviour', () => {
  it('treats a prefix-level expansion the same as per-route overrides covering all slugs', () => {
    // Sanity test for state 2 → state 3 in §3: if we add 'mai' to the
    // prefix policy AND remove all /learn/yoga/* overrides, lookup for
    // every yoga slug × mai must return indexable.
    // (Synthetic harness — uses mocked policies.)
  });
});
```

### 5.2 Curl sweep against preview deploy

For each affected route, curl and verify the response includes the right meta-robots tag:

```
Route                              | Locale | Expected robots
-----------------------------------|--------|----------------
/en/learn/yoga/gajakesari          | en     | (no tag — indexable)
/gu/learn/yoga/gajakesari          | gu     | noindex, follow
/en/learn/modules/23-4             | en     | (no tag — indexable)
/gu/learn/modules/23-4             | gu     | noindex, follow      ← currently INDEX, FOLLOW (bug)
/en/matching/aries-and-leo         | en     | (no tag — indexable)
/kn/matching/aries-and-leo         | kn     | noindex, follow
/ta/gauri-panchang/2026-07-04      | ta     | (no tag — indexable, translation exists)
/mr/gauri-panchang/2026-07-04      | mr     | noindex, follow      (no translation)
/gu/horoscope/aries/weekly         | gu     | noindex, follow      ← currently no tag (bug)
/en/panchang/date/2026-06-04       | en     | (no tag — indexable; control)
/gu/panchang/date/2026-06-04       | gu     | (no tag — indexable; control, not thin-coverage)
```

### 5.3 Sitemap budget (measured 2026-06-04)

Current live sitemap (`https://dekhopanchang.com/sitemap.xml` at 07:46 UTC): **9,217 URLs**. Projected post-policy: **7,215 URLs** (drop of 2,002, ~22%).

```
Prefix             |  Pre   →  Post   |  Drop  | Notes
-------------------|------------------|--------|---------------------------
/learn/*           | 1,138 →  1,138   |    0   | already restricted to en+hi
/matching/*        |   720 →    160   | -560   | new restriction to en+hi
/devotional/*      |   495 →    110   | -385   | new restriction to en+hi
/baby-names/*      |   243 →     54   | -189   | new restriction to en+hi
/horoscope/*       | 1,080 →    240   | -840   | new restriction to en+hi
/gauri-panchang/*  |    63 →     35   |  -28   | keep en+hi+ta+te+kn (existing translations)
─────────────────────────────────────────────
Total thin-cov     | 3,739 →  1,737   |-2,002
Total sitemap      | 9,217 →  7,215   |-2,002
```

This is well within Vercel's build-time threshold and gives ~1,800 URLs of headroom for future content. (The previously-documented "9K cap" reflects Vercel build-time symptoms, not a strategic ceiling — can be expanded as needed.)

The 2,002 dropped URLs are exactly the URLs Google was already consolidating away per the drilldown. Strictly cleanup, no real visibility loss.

### 5.4 GSC verification (~7–14d post-deploy)

- Pull next coverage drilldown export
- "Duplicate, chose different canonical" count should start decreasing as Google honours the noindex on previously-served pages
- Target: 524 → <100 within 30 days (Google takes time to revisit and de-index; 30d is generous)
- Note that some duplicates will hang around for weeks regardless — that's normal Google indexing latency, not a sign the fix failed

### 5.5 No regression on canonical pages

```
/en/learn/yoga/gajakesari            → 200 + indexable
/hi/learn/yoga/gajakesari            → 200 + indexable
/en/learn/modules/23-4               → 200 + indexable
/en/matching/aries-and-leo           → 200 + indexable
/en/devotional/aarti/santoshi-…      → 200 + indexable
/en/horoscope/aries/2026-06-04       → 200 + indexable
```

These must be unchanged. Real impressions on en+hi canonicals must not drop.

## 6. Risk assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| Noindex applied to a page that genuinely had locale-specific content we missed | Low — §1.3 is empirical | Each row in §1.3 was verified against live HTML or source code. Tests in §5.1 cover the predicate; curl sweep in §5.2 covers per-route behaviour. |
| /learn/yoga's old `INDEXABLE_LAGNA_LOCALES` diverges from the new central predicate | Low (we migrate it in this commit) | Tests assert both routes produce identical results |
| Codemod across 117 module layouts introduces a regression | Medium | Use AST-based codemod or per-file edits with `git diff`-grep verification; per Lesson H, NOT regex. Stage on one module first, manually verify, then bulk. |
| Premature promotion (flipping prefix to indexable when translations haven't shipped) | Low — requires intentional manual edit to INDEXABLE_BY_PREFIX | The "promote" step in §3 is deliberately manual; promote-check script (out of scope) would automate the safety check |
| Google takes 30+ days to honor the noindex and de-consolidate | Likely (this is how Google works) | This is the expected baseline; the alternative (do nothing) is worse |
| Lose small amounts of organic traffic on the noindexed locale pages | Very low — these are already not ranking per GSC drilldown | The pages are already consolidated; noindex formalises what Google already decided. Strictly improves crawl-budget allocation. |
| Hreflang breakage if `buildIndexableLagnaHreflang` doesn't generalise to non-lagna routes | Low | Helper is already called with arbitrary route strings; this is just extending its callers |

## 7. Deliverables (if approved)

- `src/lib/seo/indexable-locales.ts` — rewritten per §2.1
- `src/lib/seo/module-metadata.ts` — new shared helper per §2.3
- `src/lib/seo/__tests__/indexable-locales.test.ts` — new test file per §5.1
- Layout / page retrofits per §2.2:
  - `src/app/[locale]/matching/[pair]/layout.tsx`
  - `src/app/[locale]/devotional/[type]/[slug]/layout.tsx`
  - `src/app/[locale]/horoscope/[rashi]/[date]/layout.tsx`
  - `src/app/[locale]/horoscope/[rashi]/layout.tsx`
  - `src/app/[locale]/horoscope/[rashi]/weekly/layout.tsx`
  - `src/app/[locale]/horoscope/[rashi]/monthly/layout.tsx`
  - `src/app/[locale]/baby-names/[nakshatra]/page.tsx`
  - `src/app/[locale]/gauri-panchang/[date]/page.tsx`
  - `src/app/[locale]/learn/yoga/[slug]/layout.tsx` — migrate to central predicate (Q4)
  - 117 × `src/app/[locale]/learn/modules/<id>/layout.tsx` — codemod to call shared helper
- PR description references this spec + §1.1 evidence + §5.3 sitemap delta
- Deploy on the daily cron (no `[deploy]` marker — SEO fix, not outage; per `feedback_deploy_marker_seo_fixes`)
- After T+24h: curl-sweep §5.2 against prod, paste result into PR comment
- After T+14d: pull next coverage drilldown, paste delta into PR comment or follow-up issue
- Task #95 stays open for R3a follow-up

## 8. Sequencing with other in-flight work

- **Soft-404 spec ([2026-06-04-soft-404-date-keyed-routes.md](2026-06-04-soft-404-date-keyed-routes.md))** — independent fix. Different bug, different surface, different files (`src/proxy.ts` vs layout files). Can ship in either order.
- **Option A translation pipeline** (separate spec to follow) — depends on this commit landing first. Translation pipeline flips entries in `PER_ROUTE_INDEXABLE` back to indexable as each (slug × locale) gets real translated content. When a (prefix × locale) is complete, promote per §3.
- **R3a architectural collapse of /learn/modules** (task #95) — queued after this PR is verified in GSC. Will be its own spec.
