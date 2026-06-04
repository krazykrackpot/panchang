# R3a — collapse `/learn/modules/<id>` static folders into a single `[moduleId]` dynamic route

**Status:** ❌ WITHDRAWN — audit error in §1.1; see §9 correction at the bottom.
**Author:** Claude (this session)
**Date:** 2026-06-04 drafted · 2026-06-04 withdrawn same session
**Audience:** Reviewing agent (Gemini / human reviewer)
**Related work:** [noindex spec](2026-06-04-noindex-thin-translation-locales.md) §2.3 R3b shipped via PR #408 (the per-folder layout codemod tactical fix). This spec was the architectural follow-up promised there — that follow-up turns out to be infeasible as scoped here. See §9.

---

## 1. Problem statement

We currently have **117 static folders** under `src/app/[locale]/learn/modules/`, one per curriculum module (e.g. `0-1/`, `22-5/`, `24-1/`). Each folder ships a `page.tsx` (133–631 lines, 5× variance) and a `layout.tsx`. The layouts were already collapsed to 3-line stubs calling `generateModuleMetadata` via PR #408 (R3b — tactical). The page.tsx files are the remaining duplication.

### 1.1 Audit (verified 2026-06-04 against `feat/option-a-pilot-mai-yoga` HEAD)

```
total modules:              118 page.tsx files
ModuleContainer-wrapped:    116
custom JSX:                   2 (24-1, 11-1)
```

**Critical finding:** 116 of 118 modules (98.3%) share the exact same shape:

```tsx
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import L from '@/messages/learn/modules/22-5.json';

const META: ModuleMeta = {
  id: 'mod_22_5', phase: 9, topic: 'Astronomy', moduleNumber: '22.5',
  title: L.title as unknown as Record<string, string>,
  // ...
};

const QUESTIONS: ModuleQuestion[] = [/* ... */];

export default function Module22_5Page() {
  const locale = useModuleLocale();
  return <ModuleContainer meta={META} questions={QUESTIONS} L={L} locale={locale} />;
}
```

The only thing that differs between any two ModuleContainer-wrapped modules is the **content of `META`, `QUESTIONS`, and the `L` JSON import**. The JSX is byte-identical.

The 2 custom-JSX modules (24-1, 11-1) are rich-narrative modules with framer-motion animations, custom icon imports (`NakshatraIconById`, `GoldDivider`), and bespoke layout. They have no shared structure with each other or the 116-module pattern.

### 1.2 Why this matters

- **Build time** — 117 static routes × 9 visible locales = up to 1,053 pre-rendered pages just for modules. Per CLAUDE.md "Static Page Budget", we're at the ~9,000 cap; modules are a meaningful chunk.
- **Maintenance** — adding a new module today means creating a folder, hand-rolling page.tsx + layout.tsx, copy-pasting the wrapper, getting the META/QUESTIONS shape right. Easy to silently regress. CLAUDE.md Lesson H (no bulk find/replace) lurks every time a curriculum field name needs to change.
- **PR #408 follow-up** — that PR's R3b shared-helper migration left 117 layout files as 3-line stubs. We should finish the job by removing 117 page files too.
- **Coupling test surface** — every new render-time concern (Lesson ZD ISR hydration, hreflang policy changes, persona mode lookup) has to be plumbed through 117 files. Bad.

## 2. Proposed fix

Collapse the 116 `ModuleContainer`-wrapped modules into a single `[moduleId]` dynamic route. Leave the 2 custom-JSX modules (24-1, 11-1) in their existing folders as **legacy exceptions** until they're either retired or migrated to a "rich-narrative" content type in a separate spec.

### 2.1 New file layout

```
src/
├── app/[locale]/learn/modules/
│   ├── [moduleId]/                      ← NEW — the 116 collapse to one route
│   │   ├── layout.tsx                   (calls generateModuleMetadata)
│   │   └── page.tsx                     (renders ModuleContainer from data)
│   ├── 24-1/                            ← KEEP — custom JSX, legacy
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── 11-1/                            ← KEEP — custom JSX, legacy
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── page.tsx                         (hub, unchanged)
└── lib/learn/
    └── module-data/                     ← NEW — per-module data files
        ├── 0-1.ts                       (META + QUESTIONS exports)
        ├── 0-2.ts
        ├── ... (114 total — every ModuleContainer-shaped module except 24-1, 11-1)
        └── index.ts                     (Record<string, ModuleData> registry)
```

The 116 old folders get deleted. Their JSON content (`src/messages/learn/modules/<id>.json`) stays where it is — we just import it from the data file instead of from each page.tsx.

### 2.2 Data file shape

Each per-module data file pulls out the `META + QUESTIONS + L.json` triple into a single exported record:

```ts
// src/lib/learn/module-data/22-5.ts
import L from '@/messages/learn/modules/22-5.json';
import type { ModuleMeta, ModuleQuestion } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_22_5',
  phase: 9,
  topic: 'Astronomy',
  moduleNumber: '22.5',
  title: L.title as unknown as Record<string, string>,
  // ...
};

const QUESTIONS: ModuleQuestion[] = [/* ... */];

export const data = { META, QUESTIONS, L };
```

```ts
// src/lib/learn/module-data/index.ts
import { data as m0_1 } from './0-1';
import { data as m0_2 } from './0-2';
// ... 114 imports
export const MODULE_DATA = {
  '0-1': m0_1,
  '0-2': m0_2,
  // ... 114 entries
} as const;
export type ModuleId = keyof typeof MODULE_DATA;
```

### 2.3 Dynamic route render

```tsx
// src/app/[locale]/learn/modules/[moduleId]/page.tsx
import ModuleContainer, { useModuleLocale } from '@/components/learn/ModuleContainer';
import { MODULE_DATA, type ModuleId } from '@/lib/learn/module-data';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return Object.keys(MODULE_DATA).map((moduleId) => ({ moduleId }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ locale: string; moduleId: string }>;
}) {
  const { moduleId } = await params;
  const entry = MODULE_DATA[moduleId as ModuleId];
  if (!entry) notFound();
  const locale = useModuleLocale();
  return <ModuleContainer meta={entry.META} questions={entry.QUESTIONS} L={entry.L} locale={locale} />;
}
```

```tsx
// src/app/[locale]/learn/modules/[moduleId]/layout.tsx
import { generateModuleMetadata } from '@/lib/seo/module-metadata';
import { ModuleArticleLD } from '@/components/seo/ModuleArticleLD';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; moduleId: string }> }) {
  const { locale, moduleId } = await params;
  return generateModuleMetadata(moduleId, locale);
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; moduleId: string }>;
}) {
  const { locale, moduleId } = await params;
  return (
    <>
      <ModuleArticleLD modId={moduleId} locale={locale} />
      {children}
    </>
  );
}
```

### 2.4 Migration codemod

The 116 page.tsx files have an identical shape (verified §1.1) modulo `META`, `QUESTIONS`, and the JSON import path. A codemod (ts-morph, AST-based per CLAUDE.md Lesson H — **not** regex) extracts those three pieces and writes a per-module data file.

```
For each src/app/[locale]/learn/modules/<id>/page.tsx that imports ModuleContainer:
  1. Parse the AST
  2. Extract the `const META = {...}` literal
  3. Extract the `const QUESTIONS = [...]` literal
  4. Extract the `import L from '@/messages/learn/modules/<id>.json'` specifier
  5. Write src/lib/learn/module-data/<id>.ts with the shape in §2.2
  6. Delete src/app/[locale]/learn/modules/<id>/ (page.tsx + layout.tsx)
```

Pilot on 1 module manually, verify build + render parity, then run codemod across the other 115.

### 2.5 Sitemap / static-params change

`generateStaticParams` moves from "one entry per folder" (implicit) to an explicit `Object.keys(MODULE_DATA).map(...)`. URL count stays the same: 114 modules × visible-locale fan-out (currently en+hi only per `/learn/` thin-coverage policy = 228 URLs). Per the noindex spec we don't need to change this.

The two custom-JSX modules continue to ship their own `generateStaticParams` (currently they don't ship one at all — they're auto-discovered by Next.js folder routing). That stays unchanged.

## 3. Out of scope (deliberate)

- **Migrating the 2 custom-JSX modules (24-1, 11-1)** into the dynamic route. They have framer-motion, custom icon imports, narrative layouts — different shape, different concerns. Separate follow-up spec if/when we want to retire them or build a "rich-narrative" content type.
- **Refactoring `ModuleContainer` itself.** This spec preserves its current API.
- **Curriculum content edits** — translation completeness, question bank quality, etc. Pure structural migration.
- **JSON file relocation.** `src/messages/learn/modules/<id>.json` stays where it is; only the import site changes.

## 4. Verification plan

### 4.1 Codemod self-test

For each module the codemod migrates:
- Re-emit the original page.tsx from the extracted data via a small renderer (1-line wrapper of `<ModuleContainer {...data} />`)
- AST-diff the re-emitted vs the original page.tsx
- If they don't match (modulo whitespace + comments + import order), the codemod skips that module and flags it for manual review

### 4.2 Per-module render parity

After the codemod runs:
- `npx next build` succeeds with 0 errors
- For 10 representative modules (mix of phases, MCQ shapes, content sizes), curl the prod route after deploy and diff the rendered HTML body against pre-PR HTML
- Acceptable differences: `<script>` chunk hash names, build IDs in `data-build-id`, whitespace
- Unacceptable: any content/structural difference

### 4.3 Sitemap budget regression test

`src/lib/__tests__/seo-invariants.test.ts` already enforces 6,000 < sitemap < 49,500. Should be unchanged by this PR (same URL count).

### 4.4 Static-params parity

```
Before: 117 folders × static-params from page.tsx (mostly implicit folder routing)
After:   1 dynamic route × generateStaticParams returns 114 entries
        + 2 legacy folders unchanged
```

Total prerendered modules: 114 + 2 = 116. Matches the count of `<id>.json` files in `src/messages/learn/modules/`.

### 4.5 ISR-hydration audit

Per CLAUDE.md Lesson ZD, the existing `scripts/audit-isr-hydration.ts` baseline must not grow. ModuleContainer is the render surface; if it has any `new Date()` / `todayInTimezone()` calls at render time, they'd surface as 116 new violations once collapsed. Run the auditor pre-commit.

## 5. Risk assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| Codemod misses a per-module deviation we didn't notice | Medium | §4.1 AST-diff gate — codemod skips and flags any module whose emitted form doesn't match the original. Manual review of skipped modules. |
| ModuleContainer relies on some implicit per-folder Next.js convention (e.g. file-name-based routing for cross-module nav) | Low | Cross-module nav uses `<Link href="/learn/modules/X">` with explicit slugs; doesn't depend on folder routing. Spot-checked module 22-5 nav. |
| Build performance degrades from 1 dynamic route generating 114 params at build | Very low | Same total prerender count; only difference is fewer chunks to compile. Expected build-time improvement. |
| The 2 custom-JSX modules need a shared utility that the dynamic route also uses — interaction surface | Low | They stay independent; nothing depends on the other direction. |
| Cross-module relative imports (e.g. module 22-5 importing from module 23-1) | Very low | Modules don't cross-import per spot check. JSON imports are from `@/messages/...`, not from sibling pages. |
| 116 in-flight curriculum edits during the codemod window | Medium | Run the codemod once, on a clean branch, in a single PR. No incremental partial migrations. |

## 6. Deliverables (if approved)

- `src/lib/learn/module-data/<id>.ts` × 114 (auto-generated by codemod)
- `src/lib/learn/module-data/index.ts` (registry)
- `src/app/[locale]/learn/modules/[moduleId]/page.tsx`
- `src/app/[locale]/learn/modules/[moduleId]/layout.tsx`
- 114 deletions: `src/app/[locale]/learn/modules/<id>/` folders (page.tsx + layout.tsx)
- Codemod script kept under `scripts/` for posterity (in case future curriculum batches need to re-run)
- PR description references this spec + audit
- After T+24h post-deploy: spot-check 5 representative module URLs in production

## 7. Sequencing with other in-flight work

- **Noindex spec** — shipped (PR #408). The `/learn/yoga/` promotion in PR #412 doesn't touch `/learn/modules/` policy; that's still on the `/learn/` prefix at en+hi.
- **6-locale translation expansion** (task #105) — independent. Each locale ships its own overlay JSON + INDEXABLE_BY_PREFIX promotion; doesn't touch the module surface.
- **Soft-404 spec** — shipped (PR #402). Doesn't touch modules.
- This spec can ship any time after the merge bus settles; no dependencies.

## 8. Open questions for the reviewer

1. **Are 24-1 and 11-1 worth preserving as custom-JSX legacy folders?** Both have unique narrative + animation. If we plan to deprecate them anyway, the cleaner move is to roll them into the dynamic route with a "rich-narrative" content variant. My recommendation: keep them as legacy in this PR, evaluate retirement separately.
2. **Should `MODULE_DATA` import its JSON inline at the data-file level (current proposal) or be loaded lazily by the dynamic route?** Inline is simpler; lazy reduces the dynamic route's bundle size. With 114 modules × small JSON, inline is fine for now. Flag for re-evaluation if bundle size becomes a concern.
3. **Codemod testability** — what's the smallest pilot? My recommendation: 5 modules of varying shape, full AST-diff verification, then run on the remaining 109.
4. **Naming of `module-data` directory** — currently I propose `src/lib/learn/module-data/`. Alternative: `src/lib/learn/modules/` (consistent with other content stores). The latter conflicts with the `app/learn/modules/` route folder visually but they're in different trees. Flag for your preference.

---

## 9. AUDIT CORRECTION (added 2026-06-04, same session) — spec is WITHDRAWN

This spec is **withdrawn** before any implementation began. The §1.1 audit was incomplete in a way that invalidates the proposed migration. Posting the correction in-line so future readers don't repeat the mistake.

### 9.1 What the original audit captured

> 116 of 118 modules use the same `ModuleContainer` wrapper, only 2 (24-1, 11-1) have custom JSX. The only thing that differs between any two ModuleContainer-wrapped modules is the content of `META`, `QUESTIONS`, and the `L` JSON import. The JSX is byte-identical.

### 9.2 What the audit MISSED

Inspecting `src/app/[locale]/learn/modules/22-5/page.tsx` (the smallest at 133 lines) revealed the actual shape of every "ModuleContainer-wrapped" module:

```tsx
const META: ModuleMeta = { /* ... */ };
const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

// 50–200 lines of bespoke JSX per page function:
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway points={[...]} locale={locale} />
      <section>
        <h3>{tl({ en: '...', hi: '...', sa: '...' }, locale)}</h3>
        <p>{isHi ? <>...Hindi narrative...</> : <>...English narrative...</>}</p>
        {/* more sections */}
      </section>
    </div>
  );
}
function Page2() { /* unique JSX */ }
function Page3() { /* unique JSX */ }
function Page4() { /* unique JSX */ }

export default function Module22_5Page() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />, <Page4 key="p4" />]}
      questions={QUESTIONS}
    />
  );
}
```

**`ModuleContainer.pages: ReactNode[]`** — the prop is an array of React components, NOT a data array. Each module ships 2–6 page function components with hand-written JSX (~50–200 lines each) carrying the actual curriculum content. The "wrapper uniformity" my audit measured was just the import + the final `<ModuleContainer />` call — about 20 lines per file. The remaining 100–600 lines per page.tsx are **per-module curriculum content** that cannot be extracted to a data file without rewriting it into a different content medium.

Across 116 modules at ~150 lines avg page content = ~17,400 lines of bespoke JSX. Not data.

### 9.3 What this means for the proposed fix

The §2 proposed dynamic route + `module-data/<id>.ts` registry CANNOT work as written. The data files would need to include not just META + QUESTIONS, but also the JSX page functions. Importing JSX from a `.ts` file in `src/lib/` is fine, but at that point we've just **moved** 117 page.tsx files from `app/[locale]/learn/modules/<id>/` to `lib/learn/module-data/<id>.ts` — not collapsed them.

Three options exist for true collapse, in increasing scope:

| Option | Approach | Scope | Verdict |
|---|---|---|---|
| **R3a-partial** | Extract only META + QUESTIONS into data; keep Pages JSX per-module. | ~20 LOC saved per module × 116 = ~2,300 LOC | Marginal — still 117 folders, still 116 hand-rolled files |
| **R3a-full (MDX)** | Migrate all page content to MDX, write an MDX → ModuleContainer renderer | Multi-week — rewrite ~17,400 lines of JSX into MDX with custom components | Real win but multi-session project |
| **R3a-full (content-DSL)** | Define a JSON content schema (sections, paragraphs, takeaway-blocks, ternaries), write a renderer | Multi-week — design the schema, migrate 116 files, build the renderer | Real win, but loses TypeScript checking of content |

### 9.4 Decision

**Withdraw R3a as scoped.** The bug the spec was meant to address (117 hand-rolled `generateMetadata` files producing wrong `robots`, wrong hreflang fan-out, wrong canonical fallback) was already fixed via PR #408's R3b layout-stub codemod. The remaining duplication (`page.tsx` boilerplate) is real but the bulk of each file is genuinely per-module curriculum content. There is no shortcut.

Future work — if someone wants to revisit this:
1. Write a NEW spec for MDX-based curriculum migration, multi-session scope
2. Decide if 17K lines of JSX → MDX is worth the architectural cleanup
3. Treat it as a content-system migration, not a small refactor

### 9.5 Lesson

The audit query `grep -l "from '@/components/learn/ModuleContainer'"` correctly identified the wrapping pattern but failed to look at file bodies. Should have followed up with a representative `wc -l` distribution + at least one full file read. CLAUDE.md §"Audit before refactor" implies this; future audits should verify "what's *different* between files claimed to be uniform" before drafting a spec that depends on uniformity.

Task #95 is closed as **withdrawn — investigated, scoped wrong, won't fix**.
