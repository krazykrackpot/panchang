# KP UI Batch — Finish KP System Roadmap (PRs 2 + 3 + 4 + 6)

**Date**: 2026-06-05
**Branch**: `feat/kp-ui-batch`
**Scope**: Single squash-merge PR delivering all remaining KP user-facing surfaces.
**Predecessor**: `docs/specs/2026-06-04-kp-system-roadmap.md` (engine + foundation, already in main).
**Decisions log** (resolved 2026-06-05):
- Prashna interaction: number-only AND text-question (both)
- Embed widget mode: `sunrise` default, `now` opt-in
- Ruling Planets exposure: extend engine 5 → 7

---

## 1. Why one PR

Three considerations made the user accept a single big PR over three small ones:

1. The 7-RP engine extension touches `ruling-planets.ts` and ripples to KPTab + `/kp-system` + every new surface. Spreading it across PRs would force three rebase windows.
2. Embed widgets share `getEmbedLabels()`, `buildWidgetCss()`, `parseEmbed*` helpers. Splitting them complicates label-set authoring.
3. Vercel build cost: feature-branch development is free, main is expensive. Per `feedback_pr_workflow`, batch.

Trade-off accepted: harder Gemini review surface, harder to bisect later. Mitigation: clean per-file commit history on the branch; review is gated on user-flagged comments (per the user's instruction to not merge until high/medium are flagged).

---

## 2. Engine work — 7-RP extension (`src/lib/kp/ruling-planets.ts`)

### Current state

```ts
export interface RulingPlanets {
  ascSignLord, ascStarLord, moonSignLord, moonStarLord, dayLord
}
```

### Target state

```ts
export interface RulingPlanets {
  ascSignLord, ascStarLord, ascSubLord,    // NEW
  moonSignLord, moonStarLord, moonSubLord, // NEW
  dayLord
}
```

### Implementation

`getRulingPlanets()` already accepts `ascDeg` and `moonDeg`. Sub-lord derivation reuses the existing `getSubLordForDegree(deg: number) → planetId` from `src/lib/kp/sub-lords.ts` (the 249-sub Krishnamurti table). No new tables introduced — Lesson Q (one canonical source) preserved.

```ts
import { getSubLordForDegree } from './sub-lords';
// ...
const ascSubLordId = getSubLordForDegree(ascDeg);
const moonSubLordId = getSubLordForDegree(moonDeg);
```

### Consumer audit (touched files)

| File | Change |
|---|---|
| `src/types/kp.ts` | Add `ascSubLord`, `moonSubLord` to `RulingPlanets` interface |
| `src/lib/kp/ruling-planets.ts` | Compute and return 2 new fields |
| `src/components/kundali/KPTab.tsx` | Render 7 rows in "Ruling Planet Oracle" section (current renders 5) |
| `src/app/[locale]/kp-system/page.tsx` (Client) | Same display update |
| `/api/kp-system/route.ts` | No change — passthrough |

### Source citation

Krishnamurti's *Astrology and Athrishta* (Reader VI, 1971) documents the 7-RP set. The original 1955 *Krishnamurti Padhdhati* used 5; he expanded to 7 in later writings to handle horary cases where the original 5 gave ties. Implementer to verify and cite exact page numbers in the code comment before merge — placeholder note in code OK during implementation, must be resolved before requesting Gemini review. Cross-software comparison + full lineage citations land in the deferred PR 5 (cross-software benchmark doc).

### Tests

`src/lib/kp/__tests__/ruling-planets.test.ts` — 3 cases:
1. Aswini 0°00′ + Magha 0°00′ at noon Wed 2026-06-05 → snapshot of all 7 fields
2. Same chart with 5-RP signature backwards-compat — old consumers still resolve `ascSignLord` etc.
3. Sub lord for ascDeg in Bharani sub of Aswini matches `getSubLordForDegree()` directly

---

## 3. `/kp/prashna` — KP horary page

### Routes

- `src/app/[locale]/kp/prashna/page.tsx` (server, force-dynamic)
- `src/app/[locale]/kp/prashna/Client.tsx` (`'use client'`)
- `src/app/[locale]/kp/prashna/layout.tsx` + OG + error + loading

`export const dynamic = 'force-dynamic'` — required because every submission casts at a fresh moment. Lesson ZD compliance is automatic when force-dynamic (no ISR mismatch possible).

### Engine — `src/lib/kp/prashna.ts` (NEW)

```ts
export interface KPPrashnaInput {
  mode: 'number' | 'text';
  number?: number;              // 1..249 if mode='number'
  question?: string;            // free text if mode='text'
  submissionEpochMs: number;    // moment of cast
  lat: number;
  lng: number;
  timezone: string;             // IANA
  category?: 'will-it-happen' | 'when' | 'yes-no' | 'general';
}

export interface KPPrashnaResult {
  question: string | null;
  number: number;               // derived from text mode → number mode
  nakshatra: { id: number; name: LocaleText };
  sub: { id: number; name: LocaleText };       // sub lord of that 1..249 slot
  rulingPlanets: RulingPlanets;                // 7-RP
  verdict: 'favourable' | 'adverse' | 'mixed';
  verdictReason: LocaleText;                   // 1-2 sentence rationale
  fructificationWindow: {
    earliest: Date;
    likely: Date;
    latest: Date;
    dashaContext: string;       // "Sat-Jup-Mer running until 2027-08-12"
  } | null;
  cuspalSubLordOfH11: { planetId: number; favours: boolean }; // for "will-it-happen"
  warnings: string[];
}
```

### Number derivation (text mode)

Number mode is the canonical Krishnamurti input — user picks 1..249. Text mode is a modern UX convenience. We follow KPStarOne's convention: text submission's epoch-ms modulo 249 + 1. The number is shown to the user; they can re-enter manually if they don't trust the derivation. No prompt-content analytics — per `feedback_brihaspati_confidentiality`, the question text never leaves the request lifecycle.

### Verdict logic

Per Krishnamurti's *Six Readers* (Reader II is the horary-focused volume):

- **"Will it happen?" (will-it-happen / yes-no)**: cuspal sub-lord of 11th house. If it signifies 2/6/10/11 → favourable; 5/8/12 → adverse; mixed otherwise.
- **"When?" (when)**: closest Dasha-Antardasha-Pratyantar of strongest favourable significator. Returns the dasha period as the "likely" date.
- **General**: ruling planets + the derived sub lord's significations.

Exact page citations to be added to code comments by implementer before Gemini-review request.

Verdict copy is structured (not LLM-generated) — pulled from `src/lib/kp/prashna-verdicts.ts` with locale-text templates.

### Page UI

Single-screen wizard:

1. **Header**: "KP Prashna — Krishnamurti Horary"
2. **Mode toggle**: Number / Question (radio)
3. **Input**: number-stepper (1..249) OR textarea
4. **Location**: defaults to user's location (per `feedback_location_picker_canonical` — `LocationSearch` Nominatim picker)
5. **Submit** → results render below:
   - Echo of question + number
   - **Derived nakshatra+sub** card
   - **7 Ruling Planets** table
   - **Verdict** large card (color-coded)
   - **Fructification window** date strip
   - **Cuspal sub-lord of H11** explanation panel
   - **Save** (logged-in users — to `pandit_clients.notes` if account_type=pandit, otherwise `saved_charts`)
6. **Cross-link**: "Open full KP analysis →" → `/kp-system` with prefilled birth data

### Lesson ZD compliance

Force-dynamic → no ISR cache → server render and client hydrate within milliseconds → no day-boundary mismatch possible. No `new Date()` calls in client render body anyway — submission triggers a server action that returns the result.

---

## 4. `/kp/transits` — current RP for location

### Routes

- `src/app/[locale]/kp/transits/page.tsx` (server, force-dynamic)
- `src/app/[locale]/kp/transits/Client.tsx`
- layout / OG / error / loading

### Behaviour

- Page server-renders the current RPs for the SSR moment + visitor's resolved location (Vercel geo headers).
- Client mounts, displays the SSR snapshot for the first paint (no Lesson ZD mismatch).
- Inside a `useEffect`, a `setInterval(60_000)` re-fetches `/api/kp-system?mode=ruling-now&lat&lng` and updates the displayed RPs.
- Location picker (LocationSearch) lets visitor override the geo default — triggers refetch.

### Cuspal sub transit table

For each of 12 cusps (use the user's most recent saved kundali if logged in; otherwise show the current-moment Asc-relative cusps for the visitor's location), display which planet's sub the cusp currently lies in.

If no saved kundali, show the "anchor cusps for this moment + location" instead — a degenerate but useful view of "what KP energies are alive right now at this place".

### Cross-link

"Open full KP analysis for my chart →" → `/kp-system?from=transits`.

---

## 5. Embed widgets — 3 new

All three follow the existing pattern (`src/app/embed/panchang/page.tsx` reference):
- Single `page.tsx` with `searchParams: Promise<...>`
- Uses `getEmbedLabels(locale)`, `buildWidgetCss({ theme, size })`, `parseEmbedTheme/Size/Locale/Ref`
- Emits its own complete `<html>` document (root layout passthrough)
- `metadata: { robots: { index: false, follow: false } }`
- AttributionFooter at the bottom

### 5.1 `/embed/kp-ruling`

**URL contract**:
```
/embed/kp-ruling?city=varanasi&theme=light&size=default&locale=en&ref=…&mode=sunrise|now
```
- `mode=sunrise` (default) — ISR `revalidate = 86400`; computes RPs at today's local sunrise. Matches panchang embed cadence.
- `mode=now` — `export const dynamic = 'force-dynamic'`; computes RPs at request time. Higher cost.

Card shows the 7 RPs vertically + a one-line "what this energy favours today" interpretation (template, not LLM).

### 5.2 `/embed/kp-rashi`

12-rashi KP daily forecast strip. ISR 24h.

Each rashi shows: rashi name + 1-line KP forecast derived from today's RPs interacting with that rashi's natal Moon-equivalent position (we don't have user natal data on a public embed, so we use Moon-in-rashi midpoint as the proxy — same approach as the existing horoscope embed strip).

### 5.3 `/embed/kp-prashna`

Number → KP verdict. `force-dynamic`. Compact widget: number input + Cast button → verdict card.

Question-mode is **not** in the embed. Embeds are 320×480 typically — text input + verdict explanation would be cramped. Number-only suits the embed surface. Question-mode lives on the full `/kp/prashna` page; widget links to it.

### 5.4 Anti-fallback discipline

All 9-locale label keys added to `getEmbedLabels()` directly. No `isDevanagariLocale` collapse, no en/hi fallback in the widget itself (per the established `feedback_seo_partial_locale_strategy` pattern for embeds).

---

## 6. WidgetConfigurator integration

Add 3 tabs to `src/app/[locale]/widget/WidgetConfigurator.tsx`:

```ts
type WidgetType = 'panchang' | 'festivals' | 'horoscope'
                | 'kp-ruling' | 'kp-rashi' | 'kp-prashna';
```

Per-widget controls:

| Widget | Common | Specific |
|---|---|---|
| kp-ruling | theme, size, locale, ref, city | mode toggle (sunrise / now) |
| kp-rashi | theme, size, locale, ref | (none extra) |
| kp-prashna | theme, size, locale, ref | (none extra) |

Live preview iframe reuses the existing debounced-URL pattern. Copy-paste textarea generates the embed `<iframe>` snippet.

---

## 7. Locale labels

### Architecture choice

Keep the existing trilingual-object architecture in `src/messages/pages/kp-system.json` (NOT migrate to per-locale JSON). Reasons:

1. The file is already 145 keys in this shape; migrating shape mid-batch expands scope.
2. The `lt()` helper handles per-key fallback to `.en` — already integrated everywhere.
3. Per-locale migration is a separate concern documented in `docs/i18n/`. Not in this PR's scope.

### New keys to add

For each new surface, append keys to `pages/kp-system.json` under nested namespaces:

- `prashna.*` — page title, mode toggle, input labels, verdict labels, footer
- `transits.*` — page title, refresh hint, cuspal table headers
- `embeds.ruling.*` — heading, "what this favours today", mode label
- `embeds.rashi.*` — heading, rashi-name fallback
- `embeds.prashna.*` — heading, input label, verdict labels

### Locale coverage policy

Per `feedback_seo_partial_locale_strategy`:
- en + hi + mai + mr authored directly (the 4 lipi-similar locales we have engineering confidence in)
- ta + te + bn + gu + kn fall through to en via `lt()` (deferred — needs native speakers)
- New keys must be present in **all 9 locale slots** with en fallback values — no key missing entirely

### Deferred-translations doc

`docs/i18n/kp-deferred-translations.md` — mirror the about-page pattern. List the 5 deferred locales, what users see today (en strings), contributor brief.

---

## 8. Cross-linking (Lesson D — unlinked pages are dead)

### Navbar

`src/components/layout/Navbar.tsx` — Tools dropdown gets 2 new entries:
- "KP Prashna" → `/{locale}/kp/prashna`
- "KP Transits" → `/{locale}/kp/transits`

(KP System main page is already in the dropdown.)

### Footer

KP discovery section in `src/components/layout/Footer.tsx`:
- KP System
- KP Prashna
- KP Transits
- KP embed widgets (→ `/widget?type=kp-ruling`)

### /learn landing

`src/app/[locale]/learn/page.tsx` REF_GROUPS — add KP curriculum module references for prashna + transits (these are tools, not curriculum, so they link as "Try it" CTAs rather than full modules).

### `/kp-system` page header

Add tab strip at top: "Birth Chart | Prashna | Transits" → links to siblings.

### Sitemap

`src/app/sitemap.ts` — add `/kp/prashna` and `/kp/transits` with multilingual alternates for all 9 locales.

### `<head>` hreflang

Per `feedback_seo_partial_locale_strategy`: prashna + transits hreflang restricted to en + hi + mai + mr (the authored locales). Use `buildIndexableLagnaHreflang` not `buildHreflangMap`.

---

## 9. Tests — exhaustive

Testing is layered: pure-logic unit → component snapshot → integration → e2e in real browsers. Every astronomical claim asserts a numeric result against a reference value (CLAUDE.md Definition of Done #5).

### 9.1 Unit tests — engine

| File | Cases |
|---|---|
| `src/lib/kp/__tests__/ruling-planets.test.ts` | 7-RP signature: sample chart returns all 7 fields populated. Sub-lord values match `getSubLordForDegree()` direct call (regression guard). Weekday boundary: 23:59:59 → next day. 3 reference charts from Krishnamurti's *Reader VI* p.42-48 worked examples. Asc/Moon at exact nakshatra boundary (0°00′00.0″) → next-nakshatra lord, not previous. |
| `src/lib/kp/__tests__/prashna-number-derivation.test.ts` | Numbers 1, 249, 100 → correct nakshatra (Aswini, Revati, Magha) and sub (per 249-sub table). Boundary: 0 → error, 250 → error. Text-mode determinism: same `submissionEpochMs` → same number across 10 runs. Different epochs (1ms apart) → different numbers. Negative epoch → error. |
| `src/lib/kp/__tests__/prashna-verdict.test.ts` | 3 worked examples from *Six Readers* Reader II (will-it-happen / when / yes-no categories). Cuspal sub-lord of H11 → favourable when sig houses include 2/6/10/11. Adverse when sig houses include 5/8/12. Mixed when both. Empty significator list → throws (data integrity). |
| `src/lib/kp/__tests__/prashna-fructification.test.ts` | Dasha period overlap math. Strongest significator's MD-AD-PD window. Window-bounds invariants: earliest ≤ likely ≤ latest, all > submission time, all < submission + 120 years. |

### 9.2 Unit tests — timezone matrix (CLAUDE.md mandate)

Per `testing_strategy.md` + Lesson L: every astronomical computation tested at **3 reference locations × 2 DST states**.

`src/lib/kp/__tests__/timezone-matrix.test.ts`:

| Location | IANA TZ | UTC offset | DST | Test purpose |
|---|---|---|---|---|
| Corseaux, Switzerland | Europe/Zurich | +01:00 / +02:00 | both | User's home; DST sensitivity |
| Delhi, India | Asia/Kolkata | +05:30 | none | Half-hour offset; no DST |
| Seattle, USA | America/Los_Angeles | -08:00 / -07:00 | both | Negative offset; westward DST |
| Auckland, NZ | Pacific/Auckland | +12:00 / +13:00 | both | Date-line proximity; reverse DST |
| Reykjavik, Iceland | Atlantic/Reykjavik | +00:00 | none | UTC reference baseline |

Each location runs the FULL matrix: ruling-planets at solar noon, prashna number 100 at midnight local, prashna number 1 at 1 second before DST spring-forward, prashna number 249 at 1 second after DST fall-back. Asserts that:
1. Weekday lord matches local civil day (not UTC day)
2. RPs are stable across DST step (same chart, before/after `gap` second, no jump)
3. JD computation uses UTC throughout — same numeric JD regardless of input TZ once normalized

### 9.3 Unit tests — DST boundary stress

`src/lib/kp/__tests__/dst-boundaries.test.ts`:

- Europe/Zurich 2026-03-29 02:00 → 03:00 (CET→CEST). Prashna cast at 02:30 in `Europe/Zurich` (non-existent local time) → engine resolves to 03:00 or 01:30 deterministically (document chosen behaviour in spec; assert it).
- Europe/Zurich 2026-10-25 03:00 → 02:00 (CEST→CET). Prashna cast at 02:30 (ambiguous local time) → engine picks first occurrence (CEST) deterministically.
- America/Los_Angeles same two boundaries.
- Pacific/Apia 2011-12-30 (date-skip) — historical sanity check that engine doesn't crash on a missing day.

### 9.4 Component tests — embed widgets

| File | Cases |
|---|---|
| `src/app/embed/kp-ruling/__tests__/page.test.tsx` | SSR snapshot for {locale × theme × size × mode} = (9 × 3 × 3 × 2) = 162 combos, sampled to 18 (each locale once, each theme once, each size once, each mode once). Assert no `[object Object]`, no missing labels, all 7 RPs present. Mode=sunrise → revalidate metadata present. Mode=now → no revalidate. |
| `src/app/embed/kp-rashi/__tests__/page.test.tsx` | All 12 rashis rendered, no missing labels per rashi, per locale (9 locales). Strip layout for narrow/default/wide sizes. |
| `src/app/embed/kp-prashna/__tests__/page.test.tsx` | Number input renders, Cast submit produces verdict card. URL with `?number=100` pre-fills. Invalid `?number=0` or `?number=250` shows error not crash. |
| `src/app/embed/__tests__/labels-coverage.test.tsx` | For each of {kp-ruling, kp-rashi, kp-prashna} × 9 locales × all label keys: assert non-empty string. Catches a key missed in `getEmbedLabels()`. |

### 9.5 Component tests — pages

| File | Cases |
|---|---|
| `src/app/[locale]/kp/prashna/__tests__/page.test.tsx` | Server render returns valid HTML. force-dynamic respected. Locale param 'hi' renders Hindi labels. Invalid locale → 404. |
| `src/app/[locale]/kp/transits/__tests__/page.test.tsx` | Same as prashna. SSR snapshot uses Vercel geo headers; with mock header `x-vercel-ip-city=Delhi` resolves to Delhi RPs. |
| `src/app/[locale]/kp-system/__tests__/seven-rp-display.test.tsx` | Existing standalone page renders 7 RP rows after engine change (regression for 5→7 extension). |
| `src/components/kundali/__tests__/KPTab-seven-rp.test.tsx` | Existing KPTab renders 7 RPs (regression). |

### 9.6 Integration tests — API + engine

`src/app/api/kp-system/__tests__/ruling-now.test.ts`:
- New `?mode=ruling-now&lat=…&lng=…` query param returns just RPs (not full chart). Tested for 5 lat/lng pairs spanning hemispheres.
- Rate-limit still enforced (20 req/min). 21st request in 60s → 429.
- Lesson AA compliance: catch block logs with `console.error('[kp-system] …', err)`. Mock `generateKPChart` to throw; assert log captured.

`src/app/api/kp-system/__tests__/timezone-resolution.test.ts`:
- POST with `timezone: 'America/Los_Angeles'` and a birth time → JD matches longitude-LMT for pre-1880 dates (per Lesson "Pre-1880 LMT timezone bug" in memory).
- POST with `timezone: 'Asia/Kolkata'` 1947-08-15 12:00 → JD checks against a published reference.

### 9.7 ISR-hydration audit

`scripts/audit-isr-hydration.ts` (existing) — runs against the new pages too. Acceptance:
- `/kp/prashna`, `/kp/transits`, `/embed/kp-ruling`, `/embed/kp-rashi`, `/embed/kp-prashna` all flagged as safe (force-dynamic on prashna+transits+kp-prashna; ISR 86400 on kp-ruling+kp-rashi with no clock-reading client mount).
- New baseline entries added in `scripts/audit-isr-hydration.baseline.json` only if false-positives surface — never to suppress real violations.

### 9.8 e2e — Playwright (extensive)

`e2e/kp-ui-batch.spec.ts`:

**Page-level smoke**:
- `/en/kp/prashna` loads, no console errors, no React errors, no hydration warnings
- `/hi/kp/prashna` same
- `/mai/kp/prashna` same
- `/en/kp/transits` same + waits for RP card to render (selector-based, not sleep)
- `/en/kp-system` still works (regression)
- `/en/kundali/abc-id` KPTab still works (regression)

**Prashna flow (number mode)**:
- Open `/en/kp/prashna`
- Toggle to "Number" mode
- Enter 100
- Submit
- Verdict card appears within 10s, has all 7 RPs visible, has verdict label, has fructification window
- Repeat for `/hi/`, `/mai/`, `/mr/`

**Prashna flow (text mode)**:
- Open `/en/kp/prashna`
- Toggle to "Question" mode
- Enter "Will I get the job?"
- Submit
- Verdict card appears; derived number shown; verdict matches what we'd get if we re-entered that number directly (consistency check)

**Prashna with location switch**:
- Open `/en/kp/prashna`, change location via LocationSearch to "Mumbai"
- Cast number 100
- Compare RP day-lord with same cast in "Reykjavik" same moment → day-lord may differ across timezones at midnight boundaries (assert: same JD → same day-lord regardless of location)

**Transits page real-time**:
- Open `/en/kp/transits`
- Verify SSR shows initial RPs
- Wait 65s
- Verify either RPs unchanged (most likely) OR updated (if a nakshatra boundary crossed — rare); never crashed
- Mock `Date.now()` via `page.addInitScript` to fast-forward 6h; trigger refresh; verify Asc sub-lord changed

**Embed widgets**:
- For each of `/embed/kp-ruling`, `/embed/kp-rashi`, `/embed/kp-prashna`:
  - Visit with `theme=dark`, `size=narrow`, `locale=hi` — render OK, no console errors
  - Visit with `theme=light`, `size=wide`, `locale=mai` — render OK
  - Visit with `theme=auto`, `size=default`, `locale=en` — render OK
  - Visit with missing required params → graceful error message (not crash)
- `/embed/kp-ruling?city=varanasi&mode=sunrise` → RPs match the standalone `/kp-system` for same location/date
- `/embed/kp-ruling?city=varanasi&mode=now` → RPs may differ (request time vs sunrise) — assert mode-toggle changes output

**WidgetConfigurator**:
- Open `/en/widget`
- Switch tab to "KP Ruling" → live preview iframe loads `/embed/kp-ruling` URL
- Drag size to "wide" → URL updates, preview reloads (debounced)
- Switch locale to "mai" → preview re-renders in Maithili
- Copy iframe snippet → assert clipboard contains valid `<iframe src="/embed/kp-ruling?…">`
- Switch tab to "KP Prashna" → preview updates correctly
- Switch tab to "KP Rashi" → preview shows 12-rashi strip

**Timezone E2E** (Playwright with browser-tz override):
- Run prashna number=100 from:
  - `await context.newContext({ locale: 'en-US', timezoneId: 'America/Los_Angeles' })`
  - `await context.newContext({ locale: 'hi-IN', timezoneId: 'Asia/Kolkata' })`
  - `await context.newContext({ locale: 'en-GB', timezoneId: 'Europe/Zurich' })`
- Verify each renders without errors AND that the displayed RP day-lord matches the user's selected location TZ (not browser TZ — per `feedback_timezone_rule`)

**Mobile viewport**:
- Resize to iPhone 14 viewport (390×844)
- `/en/kp/prashna` — submit button reachable, verdict card readable
- `/en/kp/transits` — RP card stacks vertically
- `/embed/kp-ruling?size=narrow` — fits 240px width

**Print check (for spec completeness)**: skip — KP pages aren't print targets.

**ISR-hydration runtime crawl**: `e2e/isr-hydration-crawl.spec.ts` (existing) — add new page URLs to the crawl list. Failure on any pageerror or hydration warning.

### 9.9 Visual regression (optional but recommended)

Per PR-review-toolkit best practice: capture screenshot of prashna verdict card and transits RP card; commit to `e2e/snapshots/` as a baseline. Future PRs can detect unintended visual drift.

### 9.10 Test execution gates

CI gates (must pass before PR ready):

```bash
npx tsc --noEmit -p tsconfig.build-check.json   # 0 errors
npx vitest run                                  # 0 failures
npx next build                                  # 0 errors
npx tsx scripts/audit-isr-hydration.ts          # clean
npx tsx scripts/check-locale-parity.py          # KP keys present in all 9 locales
npx playwright test e2e/kp-ui-batch.spec.ts     # all green
npx playwright test e2e/isr-hydration-crawl.spec.ts  # 0 hydration errors
```

If any gate fails: STOP. No "skip" comments. No `it.skip()`. No baseline-add to suppress. Per CLAUDE.md Definition of Done — all five must be true.

### 9.11 Manual browser verification (Definition of Done #4)

After CI passes, walk through every flow listed in Section 9.8 in a real browser:
- Chrome (latest), Safari, Firefox
- Mobile Safari on a real iPhone if available, otherwise iOS Simulator
- Screenshots embedded in PR description for each flow

This is not redundant with Playwright — Playwright misses CSS issues (gradient rendering, gold borders, dark mode artefacts) that the human eye catches.

---

## 10. Out of scope (deferred, explicitly)

- PR 1 (engine unit tests for placidus/sub-lords/significators) — separate session
- PR 5 (cross-software benchmark + lineage docs) — separate session
- Saving prashna history to a new `kp_prashna_questions` table — possible v2; for now logged-in users see their last 5 in localStorage
- Pandit CRM integration (link a prashna result to a client) — separate concern
- AI commentary on verdicts — deferred (LLM cost concern + structural prompt work)
- `/horoscope/{rashi}` KP-vs-Parashari toggle — out of this scope
- Per-locale message file migration — orthogonal i18n refactor

---

## 11. Acceptance criteria

Before marking the PR ready for review:

- [ ] `npx tsc --noEmit -p tsconfig.build-check.json` passes (0 errors)
- [ ] `npx vitest run` passes (0 failures; all 9.1–9.6 tests authored and green)
- [ ] `npx next build` succeeds (0 errors)
- [ ] `npx tsx scripts/audit-isr-hydration.ts` clean (no new violations; baseline unchanged)
- [ ] `npx tsx scripts/check-locale-parity.py` passes (all 9 locale slots present for new KP keys)
- [ ] `npx playwright test e2e/kp-ui-batch.spec.ts` all green (Section 9.8)
- [ ] `npx playwright test e2e/isr-hydration-crawl.spec.ts` 0 hydration errors
- [ ] TZ matrix tests (9.2 + 9.3) cover Corseaux/Delhi/Seattle/Auckland/Reykjavik at DST and non-DST states
- [ ] All 3 new pages + 3 embeds verified manually in real browser (Chrome + Safari + Firefox), screenshots attached to PR description
- [ ] Mobile viewport check on iPhone 14 (390×844) — all surfaces usable
- [ ] All 9-locale slots populated in `pages/kp-system.json` (en fallback OK for 5 deferred locales — explicit list in `docs/i18n/kp-deferred-translations.md`)
- [ ] Sitemap entries present for `/kp/prashna` + `/kp/transits` with multilingual alternates
- [ ] hreflang restricted to en + hi + mai + mr (authored locales) per `feedback_seo_partial_locale_strategy`
- [ ] Navbar Tools dropdown + Footer KP section + /learn landing + /kp-system header all cross-link to new surfaces
- [ ] No `catch {}`, no `then(({ data })…)` that ignores error, no untagged console.error (Lesson AA)
- [ ] All new `new Date(…)` uses Date.UTC or has explicit comment (Lesson L)
- [ ] No hardcoded counts (per `feedback_no_hardcoded_counts`)
- [ ] No emoji icons (per CLAUDE.md style rule)
- [ ] `/gemini review` posted as PR comment after first push
- [ ] User has triaged Gemini comments (high/medium must be flagged for response)
- [ ] **No merge** until user explicitly confirms high/medium Gemini comments are addressed

---

## 12. Sequencing within the PR

```
Step 1: Engine — 7-RP extension + tests        (foundation, all surfaces depend)
Step 2: Locale labels — add all new keys       (unblocks UI work)
Step 3: /kp/prashna engine + tests              (parallel-safe)
Step 4: /kp/prashna page + Client               (depends on Step 3)
Step 5: /kp/transits page + Client              (depends on Step 1)
Step 6: Three embed widgets                     (depends on Steps 1, 2)
Step 7: WidgetConfigurator KP tabs              (depends on Step 6)
Step 8: Cross-linking — navbar/footer/learn     (depends on 4, 5, 6)
Step 9: Browser verification + screenshots
Step 10: Open PR, request Gemini review
Step 11: Wait for user-flagged Gemini response, fix, request re-review
Step 12: Merge after user confirms high/medium clear
```

---

## 13. Risk register

| Risk | Mitigation |
|---|---|
| Lesson ZD mismatch on /kp/transits | force-dynamic + empty seed pattern; auditor script in CI |
| 7-RP change breaks existing KPTab consumers | Type extension is additive — `RulingPlanets` gains 2 fields, existing 5 unchanged; consumers updated in same PR |
| Embed widget locale labels missed | `getEmbedLabels()` test asserts all 9 locale × all keys non-empty |
| Big-PR Gemini review fatigue | Per-section commit messages on the branch; user manually triages comments |
| Number-mode prashna verdict accuracy without engine tests for placidus/sub-lords | Tests cover prashna engine logic itself; underlying engine is already used in production via /kp-system; PR 1 (engine unit tests) deferred but documented |
| WidgetConfigurator URL contract drift | One source of truth for URL builder; shared test |

---

## 14. Open follow-ups for next session

(Out of this PR's scope; tracked for memory.)

1. KP engine unit tests (PR 1 from roadmap) — placidus/sub-lords/significators
2. Cross-software benchmark + lineage decisions doc (PR 5)
3. ta/te/bn/gu/kn native-speaker translations for `kp-system.json`
4. Per-locale message file migration for `pages/kp-system.json` (i18n refactor concern)
5. Save Prashna question history to a server-side table (currently localStorage)
6. AI commentary on KP verdicts (post-LLM-cost decision)
