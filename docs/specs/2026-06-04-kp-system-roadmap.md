# KP System — Status + Remaining Roadmap

**Date**: 2026-06-04
**Status**: Engine + production UI already shipped. Six follow-up PRs scoped for outreach + test coverage + locale parity.
**Owner**: TBD when work resumes

---

## 1. What already exists (verified 2026-06-04 against `origin/main`)

The KP (Krishnamurti Paddhati) system is **fully implemented in production**. A prior design session almost duplicated the work by mis-reading a stale worktree as "engine empty"; this section documents what's actually there so future sessions don't repeat the false start.

### 1.1 Engine — `src/lib/kp/` (1,060 LOC)

| File | Lines | What it does |
|---|---|---|
| `placidus.ts` | 234 | Placidus house-cusp computation |
| `sub-lords.ts` | 181 | The 249-sub Krishnamurti table + `getSubLordForDegree()` |
| `ruling-planets.ts` | 109 | 5-RP computation (Asc Sign Lord, Asc Star Lord, Moon Sign Lord, Moon Star Lord, Day Lord) |
| `significators.ts` | 256 | KP 4-level significator table (L1–L4) + `calculateCuspalAnalysis()` |
| `kp-chart.ts` | 280 | Orchestrator — `generateKPChart(birthData) → KPChartData` |

Uses the canonical Krishnamurti Ayanamsha via `getAyanamsha(jd, 'kp')` in the shared `astronomical.ts` module.

### 1.2 Types — `src/types/kp.ts` (57 LOC)

Defines `KPChartData`, `KPCusp`, `KPPlanet`. Consumed by both the kundali KPTab and the standalone `/kp-system` page.

### 1.3 API surface — `src/app/api/kp-system/route.ts` (74 LOC)

POST handler with:
- Rate limit (20 req/min per IP)
- Regex format gates on `date` (YYYY-MM-DD) and `time` (HH:MM[:SS])
- Range validation on `lat` (-90..90) and `lng` (-180..180)
- `null`-body and non-object guard before destructuring
- Calls `generateKPChart(body)` and returns the result

Hardened in Sprint 8 P1-42.

### 1.4 Kundali Expert-mode KP tab — `src/components/kundali/KPTab.tsx` (742 LOC)

Lazy-loaded via `dynamic({ ssr: false })` from `Client.tsx:117`. Renders:

- **Intro card** — KP in 60 seconds
- **Life Mandate** — KP's verdict on six life domains
- **Ruling Planet Oracle** — the 5 RPs at chart-cast moment with descriptions
- **House-by-House Signification** — 12 houses × (cusp sub-lord, signified houses, Promised/Denied verdict)
- **Cuspal Sub-Lord Table** — 12 cusps × (degree, sign lord, star lord, sub lord, sub-sub lord)
- **Planetary Sub-Lord Table** — 9 planets × (sign lord, star lord, sub lord, sub-sub lord, house)
- **Significator Table** — 12 houses × L1/L2/L3/L4/combined
- **Per-house meaning translator** (`HOUSE_MEANING` map): raw house numbers → "Self & Health", "Wealth & Family", … with colour-coded trine/kendra/upachaya/dusthana classification

Fetches via `/api/kp-system` POST on mount; own loading + error states.

### 1.5 Standalone surface — `src/app/[locale]/kp-system/page.tsx` (182 LOC)

Independent page (not nested in `/kundali`). Own birth-form, saved-charts integration, family picker, cross-links. The "Open Full KP Analysis Page →" CTA from inside the kundali KPTab leads here.

### 1.6 Learn module — `src/app/[locale]/learn/kp-system/page.tsx` (198 LOC)

Curriculum page explaining KP theory. Linked from `/learn`.

### 1.7 Localization

- `src/messages/pages/kp-system.json` — 145 keys
- `src/messages/learn/kp-system.json` — 156 keys

Both files are **en + hi only**. The remaining 7 visible locales (ta/te/bn/gu/kn/mr/mai) fall through to en via the `lt()` helper — same shape as the pre-#369 about page.

### 1.8 Kundali tab integration — `Client.tsx:4236-4271`

1. Tab labelled "KP System" / "केपी पद्धति" appears in the Expert tab grid (`activeTab === 'kp'`)
2. Marketing card explains KP's three foundational concepts (Sub-Lord Chain, Significators, Ruling Planets)
3. `<KPTab birthData={kundali.birthData} locale={locale} />` rendered inside Suspense
4. Footer CTA "Open Full KP Analysis Page →" → `/{locale}/kp-system`

The KPTab fetches its own data from the API rather than reusing the main kundali compute pipeline. That's a deliberate design choice — KP needs Placidus + Krishnamurti Ayanamsha, which the main kundali pipeline doesn't compute by default (it uses Whole-Sign + Lahiri).

---

## 2. What's missing (the actual roadmap)

Six work items. Effort estimates assume one engineer familiar with the embed widget patterns; double for greenfield contributor.

### 2.1 PR 1 — Test coverage for the existing KP engine

**Effort**: 0.5d
**Risk if skipped**: A refactor of the sub-lord table or Placidus formula has no guardrail; the audit-rebuttal we just wrote becomes harder to defend because there are no source-level invariants pinning the implementation.

**Tests to add**:
- `src/lib/kp/__tests__/sub-lords.test.ts` — source-level invariants on the 249-sub Krishnamurti table: 249 total entries, each nakshatra's 9 subs sum to 13°20′, sub order matches Vimshottari (Ketu→Venus→Sun→Moon→Mars→Rahu→Jupiter→Saturn→Mercury starting from the nakshatra's star-lord). Plus a fixture test: degree 9°47′ in Aswini → Saturn sub, against Krishnamurti's worked example.
- `src/lib/kp/__tests__/placidus.test.ts` — fixture chart against published Placidus tables for 3 latitudes (Chennai 13°N, Delhi 28°N, London 51°N) at noon equinox. Tolerance 0.01°.
- `src/lib/kp/__tests__/ruling-planets.test.ts` — against 5 of Krishnamurti's own published worked examples from *Six Readers*.
- `src/lib/kp/__tests__/kp-chart.test.ts` — end-to-end against 3 published KP analyses where the cuspal sub-lord assignments are hand-derived in the source text.

**Done means**: `npx vitest run src/lib/kp` 100% pass, with primary source citations in each fixture comment so the next reader can re-verify.

### 2.2 PR 2 — `/kp/prashna` horary page

**Effort**: 1d
**Why**: KP prashna is the surface that distinguishes us from Parashari-only competitors. Number-based horary (1–249) is a well-defined, tractable feature.

**Scope**:
- New `src/app/[locale]/kp/prashna/page.tsx` + client
- New `src/lib/kp/prashna.ts` — given a number 1–249 → derive the corresponding nakshatra+sub → compute RPs at the moment of submission → apply KP horary verdict (cuspal sub-lord of house 11 for "will this happen" questions; differs by question category)
- Optional text-question entry mode — extract a moment-based number from question submit time (Krishnamurti's tradition is number-only; modern KP softwares offer both)
- Page renders: question echo, number, derived nakshatra+sub, current RPs, KP verdict ("Favourable / Adverse / Mixed") with supporting analysis, expected fructification window from the strongest dasha-RP match

**Cross-reference**: There's a pre-existing roadmap row in `docs/specs/00-FEATURE-ROADMAP.md` row 14, "Live Prashna with AI" — that was the Parashari-based prashna; this is a different system (KP-specific). The two should coexist on `/prashna` as a system-toggle.

### 2.3 PR 3 — `/kp/transits` current-RP-for-location page

**Effort**: 0.5d
**Why**: KP practitioners checking timing throughout the day need a "what are the RPs right now for my location" view. Also the natural place to surface cuspal transit data (which planet currently transits which cusp's sub).

**Scope**:
- New `src/app/[locale]/kp/transits/page.tsx`
- Location picker (LocationSearch — canonical, per `feedback_location_picker_canonical`)
- Real-time RP display (refreshes on a 60s interval client-side; the page is `force-dynamic` server-side per Lesson ZD)
- Cuspal sub transit table — for each of 12 cusps, which planet's sub the current-moment Asc lies inside

### 2.4 PR 4 — KP embed widgets

**Effort**: 1d
**Why**: Same reasoning as the existing panchang/festivals/horoscope embeds — each widget is a permanent backlink + a daily-update destination on a host site.

**Three widgets, shared infra**:

| URL | Mode | ISR strategy | Use case |
|---|---|---|---|
| `/embed/kp-ruling` | RPs for a location | `mode=sunrise` (ISR 24h) default; `mode=now` (`force-dynamic`) optional | Temple sites showing the day's KP energy |
| `/embed/kp-rashi` | 12-rashi KP daily forecast strip | ISR 24h | Reuses the horoscope-strip CSS; per-rashi reading derived from today's RPs + each rashi's natal Moon position |
| `/embed/kp-prashna` | Number → KP verdict | `force-dynamic` | KP practitioners embedding a daily question tool |

**Builder integration**: WidgetConfigurator gets three new widget-type tabs alongside Daily Panchang / Festivals / Horoscope.

**Anti-fallback discipline**: all 9 locales fill labels directly per the established embed-labels pattern (no `isDevanagariLocale` collapse, no en/hi-only fallback).

### 2.5 PR 5 — Cross-software benchmark + lineage decisions doc

**Effort**: 0.5d
**Why**: Audit-rebuttal future-proofing. When a future auditor asks "why do you get cusp I = 9°47′ when JHora gets 9°45′?", the answer is in a doc that they can read before filing.

**Deliverables**:
- `docs/internals/kp-cross-software.md` — comparison matrix vs JHora / KPStarOne / Janus for 3 fixture charts. Target: agreement within 0.01° on all 12 cusps + identical sub-lord assignments.
- `docs/internals/kp-lineage-decisions.md` — pin the choices we've made: Krishnamurti Ayanamsha (1955 formula, 50.2388475″/yr precession rate), Placidus implementation choice, 5-RP vs 7-RP (we ship 5, document the 2 we omit), 249-sub Krishnamurti original (not Bhuvananda's KP-V), 4-level significator hierarchy. Cite source text + page for each decision.

### 2.6 PR 6 — 9-locale label coverage

**Effort**: 0.5d
**Why**: `kp-system.json` is en+hi only. mai/mr have engineering-confident translation paths (Devanagari proximity + Maithil author identity); ta/te/bn/gu/kn require native speakers — defer per the established about-page pattern.

**Scope**:
- Add mai + mr translations to `src/messages/pages/kp-system.json` and `src/messages/learn/kp-system.json` (145 + 156 keys)
- Run `scripts/check-locale-parity.py` (create if missing) — gate CI to require all 9 locales for new namespaces, with explicit en-fallback acknowledgement for the 5 deferred locales
- New doc `docs/i18n/kp-deferred-translations.md` mirroring the about-page deferred-translations pattern: locale list, what users see today, contributor brief, style guide
- Per-key fallback structure (the `lt()` helper already does this correctly, so this is largely a JSON additions task)

---

## 3. Sequencing + dependencies

```
PR 1 (tests)               ────────────┐
                                       │
PR 2 (/kp/prashna)         ─────┐      │
                                │      │
PR 3 (/kp/transits)        ─────┼──────┴─► PR 5 (benchmark + lineage doc)
                                │
PR 4 (embed widgets)       ─────┤
                                │
PR 6 (9-locale labels)     ─────┘  (independent)
```

PR 1 first — pins the engine. PRs 2/3/4/6 are independent of each other (no shared file conflicts). PR 5 should land last so the benchmark covers everything that's shipped.

**Suggested cadence**: PR 1 alone in one session as a foundation, then 2 + 4 in a session (most user-facing impact), then 3 + 6, finally 5.

---

## 4. Out of scope (explicitly deferred — keep here for record)

These were considered and deliberately not included in the v1 roadmap. Each is real KP work but would expand scope beyond what's justified by current user demand.

- **KP-V (Newer KP / Bhuvananda revisions)** — Used by a minority of practitioners. We ship Krishnamurti-original first; if user demand surfaces, file a separate v2 spec.
- **Cuspal sub-sub-lord (Pratyantar) in the verdict engine** — Currently displayed in the cuspal table but not used in the prediction logic. Advanced KP-V territory.
- **KP Marriage Matching** — KP-based compatibility scoring (deferred to its own marriage-matching roadmap; orthogonal to this).
- **KP transit AI commentary** — Natural-language interpretation via LLM. Requires a separate prompt-engineering pass; not a structural gap.
- **High-latitude Placidus warning UI** — Placidus degrades above 60°N. The existing `KundaliWarnings` channel handles this; we don't auto-fallback to a different house system. Documented in PR 5 (lineage decisions).
- **`/horoscope/{rashi}` KP-vs-Parashari toggle** — Considered, but the horoscope page's reading model is built around the `generateDailyHoroscope` engine; integrating KP would require dual engines on one page. File a separate horoscope-engine spec when prioritised.

---

## 5. Cross-references

- `docs/specs/00-FEATURE-ROADMAP.md` row 14 — "Live Prashna with AI" (Parashari-based, system-orthogonal to KP prashna in PR 2)
- `docs/specs/10-live-prashna-ai.md` — original prashna spec (predates KP engine work)
- Memory `reference_jyotish_audit_false_positives` — audit-rebuttal protocol for KP findings; relevant when an audit re-flags KP engine details
- Memory `project_dasha_year_length_param` — dasha year-length convention; KP dasha uses the same convention as Parashari (no separate decision)
- CLAUDE.md Lesson S — "Same canonical BPHS tables must be defined ONCE and cross-checked against ALL consumers" — applies to any new KP constant tables added in the work below

---

## 6. Open decisions for when work resumes

1. **`/kp/prashna` interaction model** — number-only (Krishnamurti's tradition) vs number + text-question (modern KP softwares). The text-question path adds value but requires moment-extraction logic. Recommended: ship number-only in PR 2, add text in a follow-up if demand surfaces.
2. **Embed widget naming** — keep jargon-heavy `kp-ruling` / `kp-rashi` / `kp-prashna`, or use lay names like `daily-energy` / `rashi-forecast-kp` / `quick-question`? Current widget names are jargon-aligned with the audience; recommend keeping.
3. **5-RP vs 7-RP exposure** — current engine returns 5 RPs (Asc Sign/Star, Moon Sign/Star, Day). Krishnamurti's later writings used 7 (adding Asc Sub and Moon Sub). Add the 2 extra in PR 1 alongside tests? Or defer to a v2 engine pass?
4. **PR 4 widget mode default** — `sunrise` is ISR-friendly and matches the host-site daily-rhythm use case. `now` requires `force-dynamic` (no ISR cache) and adds per-request compute cost. Recommend `sunrise` default, `now` opt-in.
5. **Test fixture sourcing** — Krishnamurti's *Six Readers* worked examples are the canonical reference but hard to obtain digitally. Plan: cite the 1971 *Reader I* + cross-verify against KPStarOne's public sub-lord table. If discrepancies emerge, follow Lesson Z (majority reading wins).
