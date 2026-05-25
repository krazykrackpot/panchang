# Outstanding SEO + Perf Items — 2026-05-25

**Audit:** `docs/audits/2026-05-24-seo-deep-audit.md` (45 numbered findings) + `docs/audits/2026-05-25-perf-cwv-remediation.md` (5 perf themes).

**Shipped this sprint (PRs #169–#176):** 23 findings closed. See "Closed" section at bottom.

**Status:** This doc enumerates everything NOT yet closed, severity-ranked, with file pointers and an estimate of effort. Group A is the next-sprint candidate set. Groups B-D are larger/deferred.

---

## Group A — High-impact, low-effort (next sprint)

Items where the win is concrete and effort is < ~2 hours each.

### A1. **`FESTIVAL_VALID_YEARS` still includes stale 2025** [HIGH]
- `src/lib/calendar/festival-defs.ts:11` exports `[2025, 2026, 2027, 2028, 2029]`.
- Sitemap loop at `src/app/sitemap.ts:656-662` emits 160 stale 2025 festival URLs (20 festivals × 8 locales).
- Inception year is 2026 — 2025 entries serve no one and burn crawl budget.
- **Fix:** drop `2025` from the array. ~5 min.

### A2. **PAGE_META `/tools` and `/festivals` are dead copies** [HIGH]
- Both routes have full 8-locale `PAGE_META` entries but their `layout.tsx` files hardcode English titles/descriptions and ignore PAGE_META.
- Files: `src/app/[locale]/tools/layout.tsx`, `src/app/[locale]/festivals/layout.tsx`, `src/app/[locale]/calendars/layout.tsx`, `src/app/[locale]/calendars/tithi/layout.tsx`.
- **Fix:** replace bespoke metadata with `getPageMetadata('/tools', locale)` etc. ~30 min total.

### A3. **`/embed-demo` lacks `redirect()`** [HIGH]
- Footer comment at `src/components/layout/Footer.tsx:163` claims `/embed-demo` 301s to `/widget`, but no `redirect()` exists in `src/app/[locale]/embed-demo/page.tsx`. The page is still live and crawlable.
- **Fix:** convert the page body to `redirect('/widget')` (Next.js `next/navigation` `redirect`, permanent). ~10 min.

### A4. **`/profile` + `/settings` exposed in SearchModal to logged-out visitors** [HIGH]
- `src/components/search/SearchModal.tsx:34-35` lists `/profile` and `/settings` in the public search index.
- **Fix:** gate these entries behind `useAuthStore` `user` state. ~15 min.

### A5. **Twitter card per-route lacks `site`, `creator`, `images[]`** [MED]
- `getPageMetadata` in `src/lib/seo/metadata.ts` emits `twitter: { card, title, description }` but skips the global `site:@dekhopanchang`, `creator:@dekhopanchang`, and `images[]`.
- **Fix:** spread the same Twitter shape the root `[locale]/layout.tsx:69-75` uses, into every `getPageMetadata` return. ~10 min.

### A6. **89 overlong bilingual conversions need hand-tuned shorter EN suffixes** [MED]
- `/calendars/tithi` (all 7 non-EN), `/charts` (ta/te), `/about` (5 locales), `/hindu-calendar/2026` (all 7), `/vivah-muhurat/2026` (7), `/sign-calculator`, `/baby-names` (ta).
- The bilingualize codemod skipped them because `<script> | <english>` exceeds 110 chars.
- **Fix:** either shorten the EN title (e.g., "Hindu Calendar 2026 — Tithi, Festivals" → "Hindu Calendar 2026") or accept the longer string with documented `MAX_LEN = 130`. ~1 hr.

### A7. **19 of 49 learn pages still missing `<h1>`** [MED]
- The May 24 codemod fixed 30 of 49. The other 19 use a different layout shell (different `className` on the title wrapper).
- **Fix:** spot-check each, then either extend the codemod or hand-edit. ~45 min.

### A8. **SW precache missing `mai`** [LOW]
- `public/sw.js:40` precaches `[en, hi, ta, bn]`. Maithili is the #1 traffic driver via `/mai/choghadiya/<date>` pages but isn't precached.
- **Fix:** add `mai` to `PRECACHE_LOCALES`. Bump SW cache version. ~5 min.

### A9. **robots.txt `Disallow: /*/learn/dashboard/` is a typo** [LOW]
- Present in all 7 AI-bot blocks of `public/robots.txt`. No such route exists; likely meant `/dashboard/` (already covered) or `/learn/dashboard/` (the route IS at `/learn/dashboard`, but it has its own noindex layout). Either way the line is either stale or duplicative.
- **Fix:** verify intent, then delete or correct. ~10 min.

### A10. **Year leftovers in user-visible copy** [LOW]
- `src/app/[locale]/panchang/grahan/page.tsx:709` — "Upcoming Eclipses (2025-2026)" should be "2026-2027".
- `src/app/[locale]/sade-sati/page.tsx:33` — Saturn transit table starts 2023 (now historical).
- `src/app/[locale]/learn/eclipses/page.tsx:842-843` — eclipse timeline includes 2024 and 2025 entries marked `current: false`.
- `src/app/[locale]/learn/compatibility-advanced/page.tsx:33-34` — past-tense dasha-example years.
- **Fix:** rewrite 4 strings. ~20 min.

### A11. **Mount the shared `<Breadcrumb>` on deep routes** [MED]
- Component exists at `src/components/ui/Breadcrumb.tsx` (PR #173) but isn't dropped in yet.
- Best targets: `/learn/modules/<id>`, `/festivals/<slug>/<year>`, `/puja/<slug>`, `/horoscope/<rashi>/<date>`, `/calendar/<slug>`. All have BreadcrumbList JSON-LD already.
- **Fix:** add `<Breadcrumb items={[...]} className="mb-6" />` at the top of each of those 5 layouts. ~1 hr.

### A12. **mr title for `/eclipses` was the visible tip of a wider locale-typo bug** [HIGH for audit, fix scope MED]
- Gemini's PR #172 critical revealed that the `/eclipses` `gu/kn/mai/bn/te/ta` PAGE_META entries had pasted-in **horoscope** copy (`राशिफल / ராசிபலன் / রাশিফল`) instead of eclipse copy. Fixed by hand.
- **Open question:** are there other PAGE_META entries with similar paste errors? A quick audit script could scan for routes where a locale's title doesn't share keywords with the EN title.
- **Fix:** write a `scripts/audit-pageMeta-keyword-overlap.ts` that flags entries where the EN title's keyword Jaccard overlap with each non-EN title (transliterated) is < 0.1. ~1 hr to scaffold + run.

---

## Group B — Medium-effort translation / content fills

These are real translation work; they don't fit a codemod.

### B1. **PAGE_META locale gap: 233 routes missing `ta/te/bn/gu/kn/mai/mr`** [HIGH]
- 233 of 269 PAGE_META entries have only `en` + `hi`. Active locales `ta, te, bn, gu, kn, mai, mr` fall back to English at render time.
- Notable affected: all 12 `/panchang/rashi/{slug}`, all 8 `/panchang/{deep-dive}`, `/varshaphal`, `/kp-system`, `/prashna`, `/mangal-dosha`, `/kaal-sarp`, `/pitra-dosha`, `/shraddha`, `/vedic-time`, `/upagraha`, all `/muhurta/{type}`, `/regional`, `/calendar/regional/mithila`, `/calendar/regional/iskcon`, all ~50 non-curated `/learn/*`, `/pricing`.
- Scope: 233 routes × 7 locales × 2 fields (title + description) = ~3,260 strings.
- **Approach:** an LLM-assisted bulk translation pass with manual spot-check of the top 20 high-traffic routes. ~6-10 hours.

### B2. **`muhurta-ai` page has empty-string content for 6 locales** [HIGH]
- `src/app/[locale]/muhurta-ai/page.tsx:40-61` — 10 educational-section fields set to `''` for `sa/ta/te/bn/gu/kn/mai/mr`. Renders ~1500 words on EN, blank on everyone else.
- **Fix:** translate 10 fields × 6 active non-EN locales (sa retired) = 60 strings. ~2-3 hr.

### B3. **`brihaspati.*` namespace ~92% English-fallback in mai/gu/kn/te** [HIGH]
- 97 of ~106 keys in `src/messages/{mai,gu,kn,te}.json` are identical to English. Brihaspati is a primary conversion page; renders almost entirely in English for the #1 traffic locale (Maithili) + 3 regional locales.
- **Fix:** translate ~388 strings (97 keys × 4 locales). ~3-4 hr.

### B4. **`sadhakaPath.*` namespace 100% English in all 7 regional locales** [HIGH]
- 17 keys per locale × 7 locales = 119 strings entirely English.
- **Fix:** translate. ~1-2 hr.

### B5. **Tamil `learn.*` 42 English-fallback strings** [MED]
- Tamil `learn.*` significantly thinner than Bengali (0 fallback). Affects every `/ta/learn/*` page.
- **Fix:** translate 42 strings. ~1 hr.

### B6. **Inline `locale === 'xx' ? ... : ...` ternaries bypass i18n in 7+ top-level pages** [HIGH]
- `charts/page.tsx:387-432`, `tools/page.tsx:843-852`, `baby-names/page.tsx:150-238`, `learn/page.tsx:204-282`, `festivals/page.tsx:200,237`, `horoscope/page.tsx:16-37`, `sade-sati/page.tsx`.
- Each ternary covers a hardcoded subset of locales (typically en/hi only); non-listed locales fall back to English mid-page.
- **Fix:** move each inline string to a `messages/pages/<route>.json` file, switch ternary to `useTranslations(...)`. ~30 min per page × 7 = ~3 hr.

### B7. **62 routes have descriptions > 170 chars** (SERP-truncated) [MED]
- Worst: `/kundali` 299/EN 283/HI, `/sadhaka-path` 271, `/calendars/masa` 280, `/caesarean-muhurta` 246, `/panchang` 248, `/horoscope` 246, `/brihaspati` 246, `/accuracy` 258.
- **Fix:** rewrite each to ≤ 160 chars. ~2 hr.

### B8. **35+ routes have EN titles > 65 chars** (SERP-truncated) [MED]
- Worst: `/learn/doshas-detailed` 87, `/learn/contributions/negative-numbers` 85, `/learn/contributions/pythagoras` 76, `/mundane` 74.
- **Fix:** rewrite. Most overlap with A6's hand-tuning task. ~1 hr.

### B9. **27-3 module Maithili grammar — only 2 strings rewritten** [LOW]
- Gemini noted the rest of the file mixes Hindi grammar (`करते हैं`) with proper Maithili (`करत अछि`).
- **Fix:** systematic Maithili grammar pass across the file. ~30 min.

---

## Group C — JSON-LD + OG-image coverage expansion

### C1. **24 individual tool pages missing `generateToolLD` + `generateBreadcrumbLD`** [MED]
- `/rahu-kaal`, `/choghadiya`, `/hora`, `/sade-sati`, `/kp-system`, `/varshaphal`, `/prashna`, `/baby-names`, `/sign-calculator`, `/kaal-sarp`, `/mangal-dosha`, `/pitra-dosha`, `/upagraha`, `/tarabalam`, `/chandrabalam`, `/chandra-darshan`, `/kaal-nirnaya`, `/rudraksha`, `/sky`, `/vedic-time`, `/tithi-pravesha`, `/tropical-compare`, `/sign-shift`, `/cosmic-blueprint`, `/financial-astrology`, `/medical-astrology`, `/nadi-jyotish`, `/mundane`.
- Only the `/tools` hub has ToolLD.
- **Fix:** add `generateToolLD + generateBreadcrumbLD` to each tool's layout. Same pattern, codemod-able. ~2 hr.

### C2. **118 `/learn/modules/*` pages have no Article/Course JSON-LD** [MED]
- Module layouts emit metadata + canonical only. 32% Article LD coverage across all 268 `/learn/*` layouts.
- **Fix:** add `Article` LD to each module via codemod, extracting fields from `MODULE_SEQUENCE`. ~1 hr.

### C3. **Dynamic OG images missing on ~30 mid-tier major pages** [MED]
- `/eclipses`, `/transits`, `/retrograde`, `/sade-sati`, `/mangal-dosha`, `/kaal-sarp`, `/varshaphal`, `/kp-system`, `/sign-calculator`, `/baby-names`, 8 `/calendar/regional/*`.
- Fall back to single locale-wide OG image. Social CTR penalty.
- **Fix:** add `opengraph-image.tsx` per route using `next/og`. ~10 min × 30 = ~5 hr.

---

## Group D — Architecture / larger refactors

### D1. **Kundali generation synchronous on main thread** [HIGH-perf, MED-effort]
- `src/app/[locale]/kundali/Client.tsx:756` runs `generateTippanni` + yoga + shadbala + bhavabala synchronously on "Generate Chart" click. INP likely > 200ms on mid-range mobile.
- **Fix:** move to Server Action OR Web Worker. ~1 day (architecture choice + plumbing + tests).

### D2. **`/calendar` page fully client-rendered with framer-motion** [MED]
- `src/app/[locale]/calendar/Client.tsx:1` is `'use client'`. Festival/vrat listing requires JS execution for Googlebot to see content.
- **Fix:** server-render a fallback `<ul>` of upcoming festivals in the parent server component; keep the interactive grid as the client island. ~3-4 hr.

### D3. **1.5 MB trilingual constants in client bundles (R3-DX-5)** [MED]
- Known tech debt. Tracked separately.
- **Fix:** lazy-load constants by category, OR split into per-locale chunks consumed via dynamic import. ~1-2 days.

### D4. **Footer missing `/festivals` root, `/charts`, `/stories`, `/pricing`, `/refunds`** [LOW]
- All exist; absent from footer columns. PR #173 added `/muhurat`, `/rituals`, `/videos`, `/accuracy` — these others were left.
- **Fix:** add 5 entries to relevant footer columns. ~15 min.

### D5. **AI-bot Allow/Disallow blocks duplicated 7×** [LOW]
- 7 near-identical 50-line blocks in `public/robots.txt` for GPTBot, ChatGPT-User, Claude-Web, anthropic-ai, Google-Extended, PerplexityBot, cohere-ai. The header comment says they're generated by `scripts/build-robots.ts` — verify that script actually runs.
- **Fix:** confirm or wire the generator. ~30 min.

### D6. **2,880 daily-churn URLs in sitemap** [LOW]
- `/horoscope/{rashi}/{date}` 30 days × 12 × 8 locales. Google may treat as ephemeral.
- **Fix:** decide whether to keep these in the sitemap or drop. ~30 min.

### D7. **`festivalSeoSlugs` (sitemap) vs `TOP_FESTIVAL_SLUGS` (page)** [LOW]
- Two parallel hardcoded festival lists that will drift.
- **Fix:** export one canonical list. ~20 min.

### D8. **Thin landings (< 400 words)** [MED]
- `/charts` ~95 words, `/festivals` ~300, `/horoscope` ~200, `/calendars` ~250.
- **Fix:** add SEO-quality copy. Translation/copywriting task. ~2 hr per landing.

### D9. **Hardcoded `aggregateRating: { ratingValue: '4.8', ratingCount: '120' }` in /brihaspati JSON-LD** [LOW]
- `src/app/[locale]/brihaspati/page.tsx:40`. Google policy violates if numbers aren't real review data.
- **Fix:** wire to real review data OR remove the aggregateRating block. ~30 min.

### D10. **Two `<Image>` alts hardcoded to `name.en` in non-EN contexts** [LOW]
- `src/components/gamification/LevelPortrait.tsx:33` and `src/app/[locale]/learn/yoga/[slug]/page.tsx:191`.
- Screen readers in non-EN locales hear English.
- **Fix:** swap to `tl(name, locale)`. ~5 min.

### D11. **`<Image unoptimized />` at `panchang/PanchangClient.tsx:216`** [LOW]
- Skips Next image optimization pipeline. If the thumbnail is a local asset, drop `unoptimized`.
- **Fix:** verify source then adjust. ~10 min.

### D12. **`generateStaticParams` 9-locale prebuild vs 4-locale CLAUDE.md cap** [docs-only]
- The audit flagged this as a budget overrun. After the May-25 promote-mr work, returning 9 locales is the **deliberate intent** (Maithili was demoted by the 4-locale cap and lost ranking — restored).
- **Fix:** update `CLAUDE.md` "Static Page Budget" section to reflect 9 locales × N as the new accepted budget. ~5 min docs change.

---

## Group E — Resolved by today's PRs (no action needed)

For traceability — these were flagged in the audit and are now closed:

- Hreflang centralisation across 102 module layouts + 8 high-traffic layouts ✅ #170
- `sa` retirement (11,361 keys stripped) ✅ #170
- `mr` restored to active ✅ #170
- `buildHreflangMap` helper ✅ #170
- `/brihaspati` nav link ✅ #169
- `/brihaspati/history`, `/brihaspati/return` noindex ✅ #169
- AdSense global removal ✅ #172
- preconnect/dns-prefetch for 3 origins ✅ #172
- `fontClassesForLocale` conditional Indic fonts ✅ #172
- Dynamic AuthModal + OnboardingModal ✅ #172
- `/panchang/[city]` revalidate 3600→21600 ✅ #172
- `/tools` hub gains 7 missing canonical tools ✅ #173
- Footer gains `/muhurat`, `/rituals`, `/videos`, `/accuracy` (4 zero-inbound orphans) ✅ #173
- Shared `<Breadcrumb>` component ✅ #173 (built, not yet mounted — see A11)
- `/settings` + `/auth/callback` noindex ✅ #173
- `/vs/*` deletion + competitor scrub (FAQ, structured-data, module 27-3) ✅ #175
- 30 of 49 learn pages h2 → h1 ✅ #175 (19 outstanding — A7)
- 105 priority-route titles converted to bilingual `Script | English` ✅ #171/#176 (89 overlong outstanding — A6)
- `mr` titles + descriptions for top-30 priority routes ✅ #171/#172
- `/eclipses` locale-typo regression fix (was horoscope copy on 6 locales) ✅ #172

---

## Recommended next-sprint order

1. **Group A bundle** — ship A1–A11 as ~one focused PR (~5-6 hr total). Highest ROI per minute.
2. **A12 codemod** — write the keyword-overlap auditor, run it, fix surface findings. ~1 hr.
3. **Group B6 (inline ternaries)** — high audit visibility, ~3 hr.
4. **Group C codemods** (C1 ToolLD, C2 Article LD) — mechanical, ~3 hr combined.
5. **Group B1 (233-route translation sweep)** — schedule as a dedicated half-day with LLM-assisted bulk translation + spot-check.
6. **Group D items** as bandwidth allows.

Total Group A: ~5-6 hr. Total all groups including translation work: ~30-40 hr.
