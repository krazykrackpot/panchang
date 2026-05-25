# SEO Deep Audit — 2026-05-24

**Scope:** Read-only audit of all SEO infrastructure, metadata, structured data, internal linking, on-page content quality, and Core Web Vitals factors for the Panchang webapp. Five parallel agents covered distinct domains; this document consolidates findings.

**Method:** 5 parallel sub-agents using `claude-opus-4-7[1m]`, each focused on one dimension. ~50 minutes total compute.

**Outcome:** Documentation only. **No code changes** in this pass. A follow-on sprint plan is sketched at the bottom; user approval required before any fixes.

**Status note:** Some findings overlap with PR #169 (merged just before this audit) — the agents ran against different branch states; resolved items are tagged `[RESOLVED in #169]`.

---

## Executive summary

The site has a **strong SEO foundation** — Next.js metadata cascade, dynamic OG images on 38 pages, JSON-LD on 239 emissions, comprehensive sitemap (~14-15K URLs across 8 locales), defence-in-depth `robots: noindex` on most private pages, and per-locale 301 redirects for retired locales.

The gaps cluster in **five themes**:

1. **Hreflang + locale-coverage rot** — retired locales (`sa`, `mr`) still emitted as hreflang in 132 layout files; 233 of 269 `PAGE_META` entries have only `en`+`hi` (no `ta/te/bn/gu/kn/mai`); Maithili (#1 traffic driver) renders English on most of `/brihaspati` and all of `/sadhakaPath`.
2. **Pre-render budget overrun (~3-4× the stated 2,000-page cap)** — `[locale]/layout.tsx` returns 8 locales instead of 4; multiple programmatic-SEO loops seed dozens of pages each.
3. **Bilingual-title rule violated on ~440 non-EN titles** — codified rule (`feedback_bilingual_titles.md`) ignored on most regional-locale titles. Only `/calendar/regional/bengali` and `/brihaspati` follow the pattern.
4. **Internal-linking orphans + missing breadcrumbs** — 4 sitemap routes have zero inbound links (`/muhurat`, `/rituals`, `/videos`, `/accuracy`); `/tools` hub missing 7 of the 12 canonical tools; no reusable visible `<Breadcrumb>` component despite 12 routes emitting `BreadcrumbList` JSON-LD.
5. **Performance: AdSense loaded globally on every page** despite a code comment claiming on-demand loading; no `preconnect` for AdSense/Supabase origins; 9 font families loaded for every locale regardless of script need; client-side kundali compute is the main INP hazard.

The single highest-ROI fix is item #1 (centralising hreflang emission through `getPageMetadata` and stripping retired locales from 132 layouts), because it touches the most URLs (~14K) and propagates to Google's locale-targeting signals.

---

## Severity-ranked findings (top 30)

### HIGH

1. **Retired-locale hreflang leak across 132 layouts.** 86% of hreflang-emitting layouts hardcode their own `alternates.languages` and still include `sa:` (some also `mr:`). Examples: `src/app/[locale]/horoscope/[rashi]/layout.tsx:83`, `…/weekly/layout.tsx:84`, `…/monthly/layout.tsx:84` (all three list 10 locales), `src/app/[locale]/calendar/[slug]/layout.tsx:126-130` (emits ONLY en/hi/sa — drops the other 5 active), `src/app/[locale]/panchang/nakshatra/[id]/layout.tsx:17-22`, `src/app/[locale]/panchang/rashi/[id]/layout.tsx:25-26`, `src/app/[locale]/matching/compatibility/layout.tsx:15-22`, `src/app/[locale]/learn/library/layout.tsx:22`, ~70 `src/app/[locale]/learn/modules/{id}/layout.tsx:18-22`. Net effect: hreflang advertises URLs to retired locales that the proxy then 301-redirects — Google warns this dilutes locale-targeting signal.

2. **PAGE_META locale gap on 233 of 269 routes.** Only `en`+`hi` (+ stale `sa`) titles/descriptions. Active locales `ta/te/bn/gu/kn/mai` missing on routes including `/varshaphal`, `/kp-system`, `/prashna`, `/mangal-dosha`, `/kaal-sarp`, `/pitra-dosha`, `/shraddha`, `/vedic-time`, `/upagraha`, all 12 `/panchang/rashi/{slug}`, all 8 `/panchang/{deep-dive}`, all `/muhurta/{type}`, all 5 `/vs/*`, all ~50 `/learn/*` non-curated, `/brihaspati`, `/sadhaka-path`, `/pricing`, `/regional`, `/calendar/regional/mithila`, `/calendar/regional/iskcon`, dozens more. Source: `src/lib/seo/metadata.ts`.

3. **Bilingual-title rule broken on ~440 non-EN titles.** Per `feedback_bilingual_titles.md`: non-EN locales must include regional script + English (e.g., `"Bangla Calendar 2026 | বাংলা ক্যালেন্ডার ২০২৬"`). Compliant: 2 routes (`/calendar/regional/bengali`, `/brihaspati`). Non-compliant (script-only): every other non-EN title in `metadata.ts`, including all `/panchang`, `/kundali`, `/matching`, `/calendar`, `/horoscope`, `/festivals` non-EN titles. Locales with NO regional title at all (silent English fallback): `/ekadashi`, `/chandrabalam`, `/tarabalam`, `/glossary`, `/mundane`, `/financial-astrology`, `/chandra-darshan`.

4. **Pre-render budget overrun (~7,500–9,000 pages vs. 2,000 cap).** Primary cause: `src/app/[locale]/layout.tsx:111` returns all 8 visible locales — CLAUDE.md says `['en','hi','ta','bn']`. Secondary causes: festival/year seeds 5×8=40 (`festivals/[slug]/[year]/page.tsx:167-173`), festival/year/city seeds 25×8=200 (`festivals/[slug]/[year]/[city]/page.tsx:137-147`), choghadiya 38×3=114 (`choghadiya/[date]/page.tsx:65-74`). Likely root cause of any slow Vercel build.

5. **PAGE_META `/tools` and `/festivals` entries are dead copies.** Both routes have full 8-locale `PAGE_META` but the layouts (`src/app/[locale]/tools/layout.tsx`, `src/app/[locale]/festivals/layout.tsx`) use hardcoded English titles. Non-EN visitors to `/ta/tools`, `/bn/festivals` get English meta despite ready translations sitting in the file.

6. **`FESTIVAL_VALID_YEARS` includes stale 2025.** `src/lib/calendar/festival-defs.ts:11` exports `[2025, 2026, 2027, 2028, 2029]`. Sitemap loop at `src/app/sitemap.ts:656-662` emits 160 stale 2025 festival URLs (20 festivals × 8 locales). Inception year is 2026.

7. **AdSense loaded globally on every page** despite comment at `src/app/[locale]/layout.tsx:198` claiming "loaded on-demand by AdUnit." `layout.tsx:155-159` ships `adsbygoogle.js` to every route (dashboard, kundali generation, brihaspati chat, panchang, settings). The on-demand loader in `src/components/ads/AdUnit.tsx:44-48` is dead code. Single biggest LCP/TBT regression on ad-free routes.

8. **No `preconnect` to AdSense / Supabase origins.** `src/app/[locale]/layout.tsx` `<head>` has zero `preconnect` / `dns-prefetch`. With AdSense global + every authenticated page hitting Supabase on hydration, ~200-400ms LCP penalty is left on the table.

9. **All 9 font families attached to every locale's body.** `src/app/[locale]/layout.tsx:143` includes all Indic font CSS variables regardless of locale. Latin-only users (`en`) preload 6 unused Noto Sans Indic fonts.

10. **Kundali generation is synchronous on main thread.** `src/app/[locale]/kundali/Client.tsx:756` runs `generateTippanni()` + yoga engine + shadbala + bhavabala synchronously on "Generate Chart" click. With ~1.5 MB trilingual constants + 47 dynamic component imports + framer-motion, INP for that click is likely well above the 200ms "good" threshold on mid-range mobile.

11. **49 `/learn/*` sub-pages render with zero `<h1>`.** Top-of-funnel curriculum pages start at `<h2>`. Affected: `adhika-masa`, `advanced`, `ashtakavarga`, `ashtakavarga-dasha`, `aspects`, `ayanamsha`, `bhava-chalit`, `bhavas`, `calculations`, `choghadiya`, `classical-texts`, `dashas`, `dashboard`, `doshas`, `doshas-detailed`, `eclipses`, `festival-rules`, `gochar`, `grahas`, `gun-milan`, `hindu-calendar`, `kaal-sarp`, `karanas`, `kp-system`, `kundali`, `lordship`, `mangal-dosha`, `masa`, `matching`, `modules`, `muhurta-selection`, `muhurtas`, `nakshatra-baby-names`, `nakshatra-pada`, `nakshatras`, `panchang-guide`, `planets`, `prashna`, `rahu-kaal`, `rashis`, `remedies`, `smarta-vaishnava`, `tarabalam`, `tithi-pravesha`, `tithis`, `vara`, `vargas`, `varshaphal`, `yogas`. Example: `src/app/[locale]/learn/dashas/page.tsx:109`.

12. **Competitor names exposed in user-facing content — direct rule violation.** Per `feedback_no_competitor_references.md`: NEVER name Prokerala / Drik / Shubh Panchang / GaneshaSpeaks / AstroSage / mPanchang in user-facing content. Violations:
    - 5 dedicated `/vs/{prokerala,drik-panchang,astrosage,ganeshaspeaks,mpanchang}/page.tsx` (770/769/526/509/519 lines), all linked from `src/app/sitemap.ts:40-44`
    - Competitor names in `src/lib/seo/metadata.ts:1036-1057` titles + descriptions (visible in SERPs)
    - 10 Q&A pairs in `src/lib/seo/faq-data.ts:1682-1750` (rendered + JSON-LD)
    - `src/lib/seo/structured-data.ts:58` includes `'drik-panchang': 'Drik Panchang'` in `SEGMENT_LABELS`
    - `src/messages/learn/modules/27-3.json:323-335` — module body says "Professional panchangs like Prokerala and Drik Panchang"

13. **`muhurta-ai` page has empty-string content for 6 of 8 active locales.** `src/app/[locale]/muhurta-ai/page.tsx:40-61` — entire educational section (10 fields × 5 locales = 50 blank strings) set to `''` for `sa/ta/te/bn/gu/kn/mai/mr`. Renders ~1500 words on EN, blank on everyone else.

14. **`brihaspati` namespace ~92% English-fallback in mai/gu/kn/te.** Out of ~106 keys, 97 are identical to English in `src/messages/{mai,gu,kn,te}.json`. Flagship conversion page renders in English for #1 traffic locale (Maithili). `sadhakaPath` (17 keys) is 100% English in every non-EN/HI locale.

15. **Inline `locale === 'xx' ? ... : ...` ternaries bypass i18n in 7+ top-level pages.** `src/app/[locale]/charts/page.tsx:387,396,428,432`, `tools/page.tsx:843-852`, `baby-names/page.tsx:150-238`, `learn/page.tsx:204-282`, `festivals/page.tsx:200,237`, `horoscope/page.tsx:16-37`, `panchang/grahan/page.tsx`, `sade-sati/page.tsx`. Direct violation of CLAUDE.md i18n rule.

16. **4 sitemap routes have zero inbound internal links.** `/muhurat`, `/rituals`, `/videos`, `/accuracy`. Listed in sitemap but no `<Link>` anywhere in `src/` references them. Burn crawl budget.

17. **`/tools` index missing 7 of 12 canonical tools.** `src/app/[locale]/tools/page.tsx` lists 24 items but skips `/shraddha`, `/upagraha`, `/devotional`, `/varshaphal`, `/kp-system`, `/prashna-ashtamangala`, `/muhurta-ai` — these are only discoverable via Footer or `/charts`.

18. **`/kundali` ↔ `/matching` have zero internal links to each other.** The most obvious related pair in the app. Direct Feature Integration violation.

19. **`/settings` and `/embed-demo` lack `robots: noindex`.** `src/app/[locale]/settings/page.tsx` is `'use client'` with no `layout.tsx`. `/embed-demo` is supposed to 301 to `/widget` per Footer comment (`src/components/layout/Footer.tsx:163`) but no `redirect()` exists in code — the page is still live and crawlable.

20. **`/profile` exposed in `SearchModal.tsx:34` to logged-out visitors.** Same for `/settings`. Should be gated by `user` state.

21. **`getPageMetadata` Twitter card lacks `site:@dekhopanchang`, `creator`, `images[]`.** Only the locale-root layout's twitter card has these. Every per-route page omits Twitter attribution.

22. **`/brihaspati/history` and `/brihaspati/return` were indexable.** [RESOLVED in #169] — added `robots: { index: false, follow: false }` via new `layout.tsx` for both subroutes.

23. **`/brihaspati` not in navbar.** [RESOLVED in #169] — added as 7th nav item with 10-locale labels stored in `src/messages/components/navbar.json`.

### MEDIUM

24. **62 routes have descriptions > 170 chars** (will be SERP-truncated). Worst: `/kundali` 299 EN/283 HI, `/sadhaka-path` 271, `/calendars/masa` 280, `/caesarean-muhurta` 246, `/panchang` 248, `/horoscope` 246, `/brihaspati` 246, `/accuracy` 258, `/learn/caesarean-muhurta` 269.

25. **35+ routes have EN titles > 65 chars** (will be SERP-truncated). Worst: `/learn/doshas-detailed` 87 chars, `/learn/contributions/negative-numbers` 85, `/learn/contributions/pythagoras` 76, `/mundane` 74.

26. **24 individual tool pages missing `generateToolLD` + `generateBreadcrumbLD`.** Only `/tools` hub has ToolLD. Affected: `/rahu-kaal`, `/choghadiya`, `/hora`, `/sade-sati`, `/kp-system`, `/varshaphal`, `/prashna`, `/baby-names`, `/sign-calculator`, `/kaal-sarp`, `/mangal-dosha`, `/pitra-dosha`, `/upagraha`, `/tarabalam`, `/chandrabalam`, `/chandra-darshan`, `/kaal-nirnaya`, `/rudraksha`, `/sky`, `/vedic-time`, `/tithi-pravesha`, `/tropical-compare`, `/sign-shift`, `/cosmic-blueprint`, `/financial-astrology`, `/medical-astrology`, `/nadi-jyotish`, `/mundane`.

27. **118 `/learn/modules/*` pages have no Article/Course-segment JSON-LD.** Module layouts emit metadata + canonical only. ~32% Article LD coverage across all 268 `/learn/*` layouts.

28. **Dynamic OG images missing on ~30 mid-tier major pages.** `/eclipses`, `/transits`, `/retrograde`, `/sade-sati`, `/mangal-dosha`, `/kaal-sarp`, `/varshaphal`, `/kp-system`, `/sign-calculator`, `/baby-names`, `/calendar/regional/*` (8 routes). Fall back to single locale-wide OG image.

29. **AuthModal + OnboardingModal eagerly imported in `UserMenu` and `SignupBanner`.** `src/components/auth/UserMenu.tsx:8-9`, `src/components/auth/SignupBanner.tsx:6`. Modals load on every page render despite only opening on user action.

30. **`/calendar` page fully client-rendered with framer-motion.** `src/app/[locale]/calendar/Client.tsx:1` (`'use client'`). Festival/vrat listing should have a server-rendered HTML fallback for Googlebot.

### LOW (notable, ~15 items)

31. **Service worker precache missing Maithili.** `public/sw.js:40` precaches `[en, hi, ta, bn]` only. `mai` is #1 traffic driver.
32. **`panchang/[city]` revalidate = 3600 (1h) aggressive.** Tithi changes every ~12h; 6h revalidate would halve serverless rebuild cost.
33. **`<Image src={...} unoptimized />` at `src/app/[locale]/panchang/PanchangClient.tsx:216`** skips Next image pipeline.
34. **Hardcoded `aggregateRating: { ratingValue: '4.8', ratingCount: '120' }` in `/brihaspati` Software JSON-LD** (`src/app/[locale]/brihaspati/page.tsx:40`). Verify provenance — Google policy violation if ratings aren't sourced from real reviews.
35. **`mr` redirects to `/en/` instead of `/hi/`** (`src/proxy.ts:31`). Marathi speakers closer to Hindi.
36. **Footer missing `/festivals` root, `/charts`, `/stories`, `/pricing`, `/refunds`, `/vs/*`** links. Comparison pages especially are SEO-critical battlegrounds with zero internal link equity (though see HIGH #12 — they should arguably not exist at all).
37. **No visible `<Breadcrumb>` component exists.** Only 2 routes have visible breadcrumb UI; 12 emit BreadcrumbList JSON-LD. Users landing from search have no orientation on deep routes.
38. **`Disallow: /*/learn/dashboard/` in 7 bot blocks of `public/robots.txt`** — no such route exists. Typo for `/dashboard/` or stale rule.
39. **AI-bot Allow/Disallow blocks duplicated 7×** (`robots.txt:45-446`). Comment claims `scripts/build-robots.ts` generates them — verify it actually runs.
40. **2,880 daily-churn URLs in sitemap** from `/horoscope/{rashi}/{date}` 30 days × 12 × 8. Google may treat as ephemeral.
41. **`festivalSeoSlugs` (sitemap) and `TOP_FESTIVAL_SLUGS` (page)** are parallel hardcoded lists that will drift.
42. **35 layouts use custom metadata instead of `getPageMetadata`** — `/dashboard/*`, `/profile`, `/path`, `/embed` (correct because they're noindex). But `/tools/layout.tsx`, `/festivals/layout.tsx`, `/calendars/layout.tsx`, `/calendars/tithi/layout.tsx` use hardcoded English (see HIGH #5).
43. **Locale-specific alts hard-coded to English** in `src/components/gamification/LevelPortrait.tsx:33` and `src/app/[locale]/learn/yoga/[slug]/page.tsx:191` — pass `name.en` even in non-EN contexts.
44. **Year leftovers in user-visible copy** — `src/app/[locale]/panchang/grahan/page.tsx:709` ("Upcoming Eclipses (2025-2026)" — should be 2026-2027), `sade-sati/page.tsx:33` Saturn transit table starts 2023 (now historical).
45. **Thin content on high-intent landings.** `/charts` (~95 words), `/festivals` (~300), `/horoscope` (~200), `/calendars` (~250) below 400-word ranking threshold.

---

## Per-domain detail

### 1. Sitemap, robots, middleware, canonicals, hreflang

- **Sitemap**: ~14-15K URLs across 8 locales. `src/app/sitemap.ts:30` correctly uses `visibleLocales` (excludes retired `sa`/`mr`).
- **robots.txt**: 506 lines, mostly correct; AI-bot blocks are near-duplicates that will drift.
- **Middleware (`src/proxy.ts`)**: Next 16's renamed `proxy.ts` convention used correctly. `RETIRED_LOCALES = ['sa', 'mr']` 301-redirected. `mr → /en/` should arguably be `/hi/`.
- **Canonicals**: `getPageMetadata()` emits canonical + hreflang correctly via 8-locale `locales` array; 132 override layouts leak `sa:` (and 3 leak `mr:`).
- **Static-params budget**: ~3-4× over the stated 2,000-page cap.

### 2. Metadata + structured data

- **`src/lib/seo/metadata.ts`**: 2,455 lines, 269 routes with `PAGE_META`. 30 routes (11%) have full 8-locale coverage. 233 have only en+hi+sa. `sa` is retired but still occupies ~233 entries (~80% of file).
- **Layouts**: 386 layout files; 230 call `getPageMetadata`. 4 layouts (`/tools`, `/festivals`, `/calendars`, `/calendars/tithi`) hardcode English titles despite full 8-locale PAGE_META existing.
- **JSON-LD**: 239 emissions; 223 helper calls. Strong on home, brihaspati, horoscope, festival, regional-calendar pages. Weak on individual tool pages (24 missing), learn-modules (118 missing).
- **OG images**: 38 dynamic generators. ~30 mid-tier pages fall back to the locale-wide image.
- **Twitter cards**: global default sets `site:@dekhopanchang` + `creator`; `getPageMetadata`'s per-route twitter strips both.

### 3. Internal linking + discoverability

- **Navbar (post-#169)**: 7 items + auth-gated Dashboard/Family. `/brihaspati` now wired.
- **Footer**: 4 cols (Tools, Calendars, Learn, Deep Dives). Missing `/festivals` root, `/charts`, `/stories`, `/pricing`, `/refunds`, `/vs/*`, sitemap.xml link, Brihaspati/SadhakaPath.
- **`/tools` hub**: 24 tools listed, missing 7 of the 12 canonical CLAUDE.md tools.
- **`/calendars` hub**: 15 routes only; missing high-value vrat/hindu-calendar/dates entries.
- **`/charts` hub**: missing `/prashna-ashtamangala`, `/cosmic-blueprint`, `/transit-playground`.
- **Cross-links (`src/lib/seo/cross-links.ts`)**: 33 tool→learn maps, healthy coverage. Reverse map (`LEARN_TO_TOOL`) presumed-present but not verified per-consumer.
- **Orphans**: 4 zero-inbound (`/muhurat`, `/rituals`, `/videos`, `/accuracy`); 4 single-inbound (`/sadhaka-path`, `/mundane`, `/annual-forecast`, `/glossary`); ~12 two-inbound thin-discoverability routes.
- **Bidirectional breaks**: `/kundali`↔`/matching`, `/transits`↔`/retrograde`, `/horoscope`↔`/panchang/rashi/[id]`, `/panchang`↔`/muhurat`.
- **Breadcrumbs**: no shared visible component. 12 routes emit BreadcrumbList JSON-LD; only 2 have visible breadcrumb UI.

### 4. On-page content quality

- **H1 cardinality**: Good on top-level public pages. 49 `/learn/*` sub-pages have no `<h1>`.
- **Heading hierarchy**: Skips on `/baby-names` (h1→h3), `/learn/lagna` (h1→h4), `/learn/birth-chart` (h1→h4). `/tools` and `/charts` have h1 + no h2 (row labels are `<div>`).
- **Alt text**: No empty alts. Two alts hardcoded to `name.en` in non-EN-locale contexts.
- **Competitor mentions**: see HIGH #12.
- **Year leftovers**: 2 user-visible, ~3 code-level.
- **Locale-script gaps**: `brihaspati` 92% English in mai/gu/kn/te; `sadhakaPath` 100% English in all 7 regional locales; Tamil `learn.*` 42 English-fallback strings.
- **Inline ternaries**: see HIGH #15.
- **Thin landings**: `/charts`, `/festivals`, `/horoscope`, `/calendars` all sub-400 words.
- **FAQ coverage**: missing on `/sade-sati`, `/baby-names` landing, `/matching` landing.
- **Schema freshness**: all hardcoded dates use 2026 ✓. Hardcoded ratings need provenance verification.

### 5. Performance + Core Web Vitals

- **LCP**: Mostly text-LCP on server-rendered pages. `/calendars/masa` + `/learn/yoga/[slug]` use Image priority correctly.
- **Image priority**: Healthy. One image per priority page. Mostly self-correct.
- **Fonts**: 9 families, all `display: 'swap'`. Issue: all 9 attached to body for every locale (Latin users preload 6 unused Indic fonts).
- **Dynamic imports**: Healthy on kundali (47), home, navbar, ClientShell (10). Eager imports of AuthModal/OnboardingModal in UserMenu + SignupBanner.
- **CLS**: Strong. Explicit dimensions on every Image. `min-h-[400px]` reservation on home lazy widgets.
- **INP**: Kundali generation click is the main hazard (sync compute on main thread).
- **Static-params**: see Sitemap section.
- **ISR `revalidate`**: All values in 60s–7day range. `panchang/[city]` at 1h slightly aggressive.
- **Service worker**: Good (NetworkFirst HTML, CacheFirst static, auth-API bypass). `mai` not in precache.
- **Third-party scripts**: AdSense global (HIGH #7), Vercel Analytics (OK).
- **Resource hints**: NONE. No `preconnect`, `dns-prefetch`, `preload`. Major gap.
- **SSR vs CSR**: Server-first architecture mostly intact. `/calendar` and `/panchang` interactive UI are client-rendered with framer-motion (OK because SEO copy is server-rendered separately).

---

## Recommended follow-on sprints (NOT actioned in this pass)

Sprinted by ROI per touched-URL count, dependency order, and risk:

**Sprint A — Hreflang + locale-config unification** (~1 day, ~14K URLs affected)
- Create a single `buildAlternates(path, locale)` helper that reads from `i18n/config.ts` `locales` (8 active, no `sa`/`mr`).
- Mass-replace the 132 hardcoded `alternates.languages` blocks with calls to the helper.
- Strip retired-locale fields from `metadata.ts` PAGE_META entries (cosmetic — ~233 dead `sa:` entries).
- Fix `proxy.ts:31` to redirect `mr → /hi/`.

**Sprint B — Pre-render budget restoration** (~2 hours)
- Set `src/app/[locale]/layout.tsx:111` back to `['en','hi','ta','bn']` per CLAUDE.md OR update CLAUDE.md to reflect the deliberate 8-locale prebuild + the additional cost.
- Set `festivals/[slug]/[year]/page.tsx:167`, `festivals/[slug]/[year]/[city]/page.tsx:137`, `choghadiya/[date]/page.tsx:65` to return `[]` (or document the deliberate seed).

**Sprint C — Bilingual titles + PAGE_META locale fill** (~1-2 days)
- For the top 30 highest-traffic non-EN pages, rewrite titles in the bilingual pattern.
- For 233 routes missing ta/te/bn/gu/kn/mai entries, decide: do a bulk translation pass (LLM-assisted), OR add a graceful en-fallback note (current behaviour, but documented).

**Sprint D — Competitor-mention scrub** (~1 day)
- Decision required: keep `/vs/*` pages for SEO value (they rank for competitor-name queries) OR remove them entirely (rule compliance).
- Either way: strip competitor names from `metadata.ts:1036-1057`, `faq-data.ts:1682-1750`, `structured-data.ts:58`, and `messages/learn/modules/27-3.json`.

**Sprint E — Internal linking + breadcrumb** (~1 day)
- Add `/shraddha`, `/upagraha`, `/devotional`, `/varshaphal`, `/kp-system`, `/prashna-ashtamangala`, `/muhurta-ai` to `/tools` hub.
- Link `/kundali` ↔ `/matching`, `/transits` ↔ `/retrograde`, `/horoscope` ↔ `/panchang/rashi`.
- Link or remove orphans: `/muhurat`, `/rituals`, `/videos`, `/accuracy`.
- Build a shared `<Breadcrumb>` component; mount on deep routes that already have BreadcrumbList JSON-LD.

**Sprint F — Performance: AdSense + preconnect + fonts** (~half day)
- Remove global AdSense script from `[locale]/layout.tsx:155-159`; restore on-demand load via `AdUnit.tsx`.
- Add `<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin>` and Supabase project preconnect.
- Conditionally attach Indic font variables based on `locale` (only Devanagari for hi/sa/mai/mr, only Bengali for bn, etc.).

**Sprint G — H1 + Learn-page hygiene** (~half day)
- Add `<h1>` to the 49 `/learn/*` sub-pages missing one.
- Fix heading skips on `/baby-names`, `/learn/lagna`, `/learn/birth-chart`.
- Add `<h2>` row labels to `/tools` and `/charts` grids.

**Sprint H — JSON-LD coverage expansion** (~half day)
- Add `generateToolLD + generateBreadcrumbLD` to 24 individual tool layouts.
- Add Article LD to 118 `/learn/modules/*` (extract from MODULE_SEQUENCE).

**Sprint I — Settings/embed-demo/profile guarding** (~1 hour)
- Add `robots: { index: false }` layout to `/settings`, `/auth/callback`.
- Convert `/embed-demo` to a `redirect()` to `/widget`.
- Gate `/profile` and `/settings` entries in `SearchModal.tsx` by `user` state.

**Sprint J — Maithili coverage** (~1 day, high impact given #1 traffic)
- Fill `brihaspati.*` namespace in `messages/mai.json` (97 strings).
- Fill `sadhakaPath.*` namespace in all 7 regional locales (17 strings × 7 = 119 strings).
- Add Maithili to `public/sw.js:40` precache list.
- Fill empty-string `muhurta-ai/page.tsx` content for 6 locales.

---

## Files of interest (audit referenced)

- `src/app/sitemap.ts` (729 lines)
- `src/proxy.ts` (Next 16 renamed middleware)
- `src/lib/i18n/config.ts` (canonical locale union)
- `src/lib/seo/metadata.ts` (2,455 lines, `PAGE_META`)
- `src/lib/seo/structured-data.ts` (JSON-LD helpers)
- `src/lib/seo/faq-data.ts` (FAQ Q&A)
- `src/lib/seo/cross-links.ts` (tool↔learn cross-link map)
- `src/lib/calendar/festival-defs.ts` (`FESTIVAL_VALID_YEARS`)
- `src/app/[locale]/layout.tsx` (root metadata + JSON-LD + global AdSense)
- `src/components/layout/Navbar.tsx` (7 items post-#169)
- `src/components/layout/Footer.tsx`
- `src/components/search/SearchModal.tsx`
- `src/components/auth/UserMenu.tsx` (eager AuthModal import)
- `public/robots.txt`
- `public/sw.js` (service worker, `dp-v6` cache)

---

## Closing notes

This audit is a snapshot at 2026-05-24 21:00 UTC, run against a worktree at HEAD `a846268d` plus PR #169 (`c5702fcd`). Three audit dimensions ran against pre-#169 state; their findings about Brihaspati nav + history/return noindex are tagged `[RESOLVED in #169]` above.

No changes were made in this audit pass. Sprint plan above is sketched for prioritisation; user approval required before any execution. Recommend tackling Sprint A first — it touches the most URLs and has the cleanest dependency profile.
