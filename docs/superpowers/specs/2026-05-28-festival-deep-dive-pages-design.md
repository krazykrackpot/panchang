# Festival Deep-Dive Pages — Design Spec

**Date:** 2026-05-28
**Status:** Draft — for review
**Scope:** Enhance `/festivals/[slug]/[year]` and `/festivals/[slug]/[year]/[city]` with personalized astrology, structured-data schema, content depth, and historical archive
**Target ship:** One PR. Merge does NOT trigger deploy — per the May-2026 deploy policy, prod deploys are cron-driven (06:00 UTC daily) and the `[deploy]` commit-message marker is reserved for explicit user request. **Implementation merge commits must NOT contain `[deploy]`.**

---

## 1. Goal

Turn `/festivals/[slug]/[year]` from a date-and-muhurta lookup page into a **complete festival reference** that ranks for the long-tail of festival-related queries (date, wishes, do's, don'ts, what it means for you), and unlocks the personalised-astrology hook that competitors can't match.

**Primary metric:** Organic traffic to `/festivals/*` URLs grows 3× over 90 days, with `/festivals/diwali/2026` and `/festivals/holi/2027` ranking on page 1 for `<festival name> <year>` and `<festival name> wishes <year>`.

**Secondary metric:** Brihaspati conversion attributed to festival pages — users who land on a festival page, click into "what this means for you", and end up paying for a reading.

---

## 2. Current state (what already exists)

- 20 festivals in `TOP_FESTIVAL_SLUGS` (Diwali, Janmashtami, Holi, Dussehra, Maha Shivaratri, Ram Navami, Ganesh Chaturthi, Raksha Bandhan, Dhanteras, Narak Chaturdashi, Govardhan Puja, Bhai Dooj, Hanuman Jayanti, Akshaya Tritiya, Guru Purnima, Vasant Panchami, Holika Dahan, Hartalika Teej, Chhath Puja, Makar Sankranti).
- Valid years: 2026 – 2030 (`FESTIVAL_VALID_YEARS`).
- Per-festival page (`/festivals/[slug]/[year]/page.tsx`, 943 LOC) already renders: hero with this-year date, multi-city muhurat table (Delhi/Mumbai/Bangalore/Chennai/Kolkata/Pune), Kala-Vyapti rule explainer, regional names, mythology + significance + observance (from `FESTIVAL_DETAILS`).
- Per-city variant (`/festivals/[slug]/[year]/[city]/page.tsx`, 836 LOC) handles the city-specific computation.
- Puja-vidhi data exists for ~35 festivals in `src/lib/constants/puja-vidhi/`. Each puja file is independently keyed; the festival-slug ↔ puja-vidhi-slug mapping is 1:1 for the top 20 but **must be verified at impl time** for `getPujaVidhiBySlug(festivalSlug)` to return correctly — if not, a small `FESTIVAL_TO_PUJA_SLUG` lookup is added.
- FAQ JSON-LD already attached (via `generateFAQLD('/festivals/...')`).

---

## 3. Out of scope (for this PR)

- Recipes / food content (separate effort; competes with food-blog SEO, low ROI).
- Bhajans / mantra audio (TTS pipeline is a separate spec).
- Video content embeds.
- New festival slugs beyond the existing 20 (Karva Chauth, Tulsi Vivah, etc. — backlog).
- Translation of new content to all 8 active locales — see §7 for the *en + hi first, others fall back* policy. (Active locales per memory: en, hi, ta, te, bn, gu, kn, mai. `sa` and `mr` are retired with 301 → /en/.)

---

## 4. New features

### 4A. Personalized astrology widget — "What does <Festival> 2026 mean for you?"

**Why:** Unique to us. Competitors (Drik, Astrosage) have generic per-festival pages; nobody surfaces *personalised* transit reads. Drives Brihaspati conversion (via the CTA below the free content — NOT by gating any reading text).

**UX:**
- Section block titled "How will <Festival> <Year> affect your sign?" (i18n'd).
- 12 collapsible accordion cards (one per rashi), each showing — **all free, no paywall, no preview/expansion tease**:
  - 1-line transit summary on the festival date for that sign (e.g. "Diwali 2026 falls during your Jupiter Mahadasha + Saturn transit through your 10th house — focus on career rituals").
  - 1-sentence ritual recommendation tied to the transit (e.g. "Light an extra lamp facing west — your 7th lord is afflicted").
- **Separate Brihaspati CTA card below the accordion** (not inside it): "Want a full personalised reading for <Festival> 2026? Ask Brihaspati — INR 49 / USD 2 →". This is an *upgrade to a conversation*, not a paid expansion of the free text.
- "Find my sign" inline link if user doesn't know their rashi (deep-links to `/sign-calculator`).

**Data model:**
- Add `src/lib/festivals/personalized-reading.ts`:
  ```ts
  export interface PersonalizedFestivalReading {
    festival: string;       // slug
    year: number;
    rashi: number;          // 1-12
    summary: LocaleText;    // 1-line transit summary
    ritual: LocaleText;     // 1-line ritual rec
    relevantHouse: number;  // for the CTA template
  }

  export function computePersonalizedReading(
    festivalSlug: string,
    year: number,
    rashi: number,
  ): PersonalizedFestivalReading;
  ```
- Implementation: at the festival's exact date, compute slow-planet transits (Saturn, Jupiter, Rahu) relative to each rashi's natal-from-rashi houses + look up the festival's `astroFocus` (which house/planet/karaka the festival emphasises — see new data file below).
- **Computed server-side at build/ISR time** (inside the page component, not a client effect) so all 12 rashi reads are baked into the rendered HTML. SEO-visible, no client compute cost. Same `revalidate: 86400` cadence as the existing year page.

**Per-festival astro-focus data:** new file `src/lib/festivals/festival-astro-focus.ts` mapping each of the 20 top festivals → relevant planet/house/karaka. Full table to populate:

| Festival | primaryPlanet | primaryHouse | karaka | Classical anchor |
|---|---|---|---|---|
| diwali | 5 (Venus) | 2 | wealth | Lakshmi Puja → 2nd house wealth |
| dhanteras | 5 (Venus) + 6 (Saturn) | 2 | wealth+health | Dhanvantari + Lakshmi |
| holi | 2 (Mars) | 3 | courage/release | Holika Dahan → Mars-driven |
| maha-shivaratri | 6 (Saturn) | 12 | moksha | Shiva → Saturn karaka |
| ram-navami | 0 (Sun) | 9 | dharma | Rama as Surya-vamsha |
| janmashtami | 1 (Moon) | 5 | devotion | Krishna midnight birth → Moon |
| ganesh-chaturthi | 3 (Mercury) | 4 | beginnings | Ganesha → Mercury+Buddhi |
| dussehra | 0 (Sun) | 10 | victory | Vijaya Dashami → 10th career |
| raksha-bandhan | 4 (Jupiter) | 3 | siblings | Rakhi → 3rd house |
| narak-chaturdashi | 6 (Saturn) | 8 | purification | Pre-dawn cleansing |
| govardhan-puja | 4 (Jupiter) | 4 | home/refuge | Krishna-Indra lore |
| bhai-dooj | 4 (Jupiter) | 3 | siblings | Same as Raksha Bandhan |
| hanuman-jayanti | 2 (Mars) | 6 | strength/service | Hanuman → Mars |
| akshaya-tritiya | 4 (Jupiter) + 5 (Venus) | 2 | wealth/giving | Eternal-prosperity day |
| guru-purnima | 4 (Jupiter) | 9 | teacher/dharma | Jupiter = Guru |
| vasant-panchami | 3 (Mercury) | 5 | learning | Saraswati → 5th studies |
| holika-dahan | 2 (Mars) | 12 | release | Bonfire purification |
| hartalika-teej | 5 (Venus) | 7 | marriage | Parvati-Shiva union |
| chhath-puja | 0 (Sun) | 1 | vitality | Surya worship |
| makar-sankranti | 0 (Sun) | 10 | transition | Sun's northward turn |

20 entries, locked by a fixture test asserting each `TOP_FESTIVAL_SLUGS` slug has an entry.

### 4B. Wishes & greetings section (text only — image cards in v2)

**Why:** "Diwali wishes 2026" / "Holi wishes 2026" generate massive India search volume. Easy content surface.

**UX (v1, this PR):**
- Section "Diwali 2026 Wishes & Greetings" with:
  - 3-5 ready-to-share text greetings per festival, per locale.
  - Each card: short greeting (max 280 chars), copy-to-clipboard button, Web Share API on mobile.
  - Devanagari / Tamil / Bengali / etc. greetings render in their native script.
- **No image generation in v1.** Image-card output (via `opengraph-image.tsx` pattern) is a deliberate v2 follow-up — keeps this PR scoped to text content. The data shape below supports image overlay without modification when v2 lands.

**Data model:**
- Add `src/lib/festivals/wishes.ts`:
  ```ts
  export interface FestivalWish {
    text: LocaleText;       // multi-locale text
    tone: 'traditional' | 'modern' | 'family' | 'business';
  }

  export const FESTIVAL_WISHES: Record<string, FestivalWish[]> = {
    'diwali': [ ... ],
    'holi':  [ ... ],
    ...
  };
  ```
- 5 wishes per festival × 20 festivals = 100 wishes total. EN + HI written by hand (200 strings); other locales fall back to EN (per CLAUDE.md "Locale fallback is non-negotiable" rule — better to render EN than `undefined`).
- **Originality:** all greetings must be original (no copying from Hallmark, no copying competitor festival pages). Hindi greetings draw on folk-traditional phrasing which is not copyrightable, but the *specific composition* must be ours. Implementation note: include a top-of-file comment in `wishes.ts` reminding future contributors.

### 4C. Do's & don'ts checklist

**Why:** Easy to write, adds page depth, picks up "what to do on diwali" / "what not to do on holi" long-tail.

**UX:**
- Two side-by-side cards: green check icons for ✓ Do, amber X icons for ✗ Don't.
- **6 items per side per festival, fixed** (was "5-8" — fixing for content-volume predictability).
- Each item has a 1-line text + optional tooltip with the classical source.

**Content volume:** 6 + 6 = 12 items × 20 festivals × 2 languages (en + hi) = **480 strings** to hand-write. The bulk of the writing effort.

**Source corpus:** items must cite from one of: Dharmasindhu, Nirnayasindhu, regional Panchang traditions, or contemporary practitioner consensus. The `source` field is optional but recommended for the items that need it (e.g. "Don't cut hair on Amavasya — Dharmasindhu Ch.4").

**Data model:**
- Add `src/lib/festivals/observances.ts`:
  ```ts
  export interface FestivalObservance {
    dos: Array<{ text: LocaleText; source?: string }>;
    donts: Array<{ text: LocaleText; source?: string }>;
  }
  export const FESTIVAL_OBSERVANCES: Record<string, FestivalObservance> = { ... };
  ```

### 4D. HowTo schema markup for puja vidhi

**Why:** Google rich results for step-by-step content. The puja-vidhi data already exists — just wrap it in `@type: HowTo` JSON-LD.

**Implementation:**
- In `/festivals/[slug]/[year]/layout.tsx`, if `getPujaVidhiBySlug(slug)` returns data, generate a HowTo JSON-LD alongside the existing FAQ schema:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to perform Diwali Puja 2026",
    "step": [
      { "@type": "HowToStep", "name": "Cleansing", "text": "..." },
      ...
    ]
  }
  ```
- Add `generateHowToLD(slug, locale)` helper in `src/lib/seo/howto-ld.ts`.
- Validate output with Google's Rich Results test for one festival before rolling out.

### 4E. Event schema per festival × year

**Why:** Each festival becomes a structured `Event` in Google's knowledge graph. May surface in Events panel for queries like "diwali 2026 date".

**Caveat:** Google's Event schema is technically meant for ticketed/attendable events, and there's a documented risk of spammy-event markup penalties. To stay defensible:
- Use **`eventAttendanceMode: 'OfflineEventAttendanceMode'`** (the festivals are real-world observances, not online events).
- Set `location.@type: 'Place'` with `address.@type: 'PostalAddress'` describing the festival's cultural context (e.g. "Observed across India and the global Hindu diaspora") rather than a venue.
- Multi-day festivals (Navratri, Pitru Paksha) use proper `startDate`/`endDate` covering the full sequence.
- **Manual Rich Results test** for `/festivals/diwali/2026` on a preview deploy before merge — if Google's tester flags it as Spam, drop the Event schema and ship only HowTo. Better to ship less schema cleanly than risk an algorithmic demotion.

**Implementation:**
- Augment the existing JSON-LD output with:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Diwali 2026",
    "startDate": "2026-11-08T00:00:00+05:30",
    "endDate":   "2026-11-08T23:59:59+05:30",
    "eventAttendanceMode": "OfflineEventAttendanceMode",
    "eventStatus": "EventScheduled",
    "location": {
      "@type": "Place",
      "name": "India and the global Hindu diaspora",
      "address": { "@type": "PostalAddress", "addressCountry": "IN" }
    },
    "description": "...",
    "image": "..."
  }
  ```
- Helper: `generateFestivalEventLD(slug, year, locale)` in `src/lib/seo/event-ld.ts`.
- The helper accepts an optional `multiDay: { startDate, endDate }` override so Navratri / Pitru Paksha can cover their full sequence.

### 4F. Cross-link cluster (festival ↔ festival)

**Why:** Builds topical authority for multi-day sequences. Internal-linking-driven SEO.

**Implementation:**
- New section at the bottom of each festival page: "Festivals in the same cluster".
- New data file `src/lib/festivals/festival-clusters.ts` with three cluster *types*:
  ```ts
  export type ClusterType = 'sequence' | 'navratri' | 'pitru-paksha';

  export interface FestivalCluster {
    type: ClusterType;
    slugs: string[];        // ordered sequence
    name: LocaleText;       // cluster display name (e.g. "5-Day Diwali Sequence")
  }

  export const FESTIVAL_CLUSTERS: Record<string, FestivalCluster> = {
    'diwali': {
      type: 'sequence',
      slugs: ['dhanteras', 'narak-chaturdashi', 'diwali', 'govardhan-puja', 'bhai-dooj'],
      name: { en: '5-Day Diwali Sequence', hi: 'पाँच दिवसीय दीपावली पर्व' },
    },
    'navratri': {
      type: 'navratri',
      slugs: ['navratri-day-1', ..., 'navratri-day-9', 'dussehra'],
      name: { en: 'Navratri (9 Nights) + Dussehra', hi: 'नवरात्रि एवं दशहरा' },
    },
    'pitru-paksha': {
      type: 'pitru-paksha',
      slugs: ['pitru-paksha-day-1', ..., 'pitru-paksha-day-15'],
      name: { en: 'Pitru Paksha (15 Days of Ancestor Rites)', hi: 'पितृ पक्ष' },
    },
    'holi':   {
      type: 'sequence',
      slugs: ['holika-dahan', 'holi'],
      name: { en: 'Holika Dahan + Holi', hi: 'होलिका दहन एवं होली' },
    },
    ...
  };
  ```
- Renders as a horizontal scrolling timeline showing the sequence. Long clusters (Navratri 9, Pitru Paksha 15) render compactly — day-of-N badges + name + date — with horizontal scroll on mobile.
- 4-6 clusters defined initially; festivals not in any cluster render their `relatedFestivals: string[]` fallback from `FESTIVAL_DETAILS` instead.

**Note**: Navratri day-pages and Pitru Paksha day-pages don't all exist today (only `dussehra`, `durga-ashtami`, `maha-navami` are in `TOP_FESTIVAL_SLUGS`). The cluster data may reference future slugs — implementation must handle missing-slug gracefully (render the cluster entry as plain text if no page exists yet, with a "coming soon" tag). The fixture test asserts each referenced slug either exists in `MAJOR_FESTIVALS` OR is marked `comingSoon: true` in the cluster def.

### 4G. Historical year archive section

**Why:** Picks up "diwali 2024 date" / "holi 2025 date" long-tail (users searching past dates for journals, memory, project deadlines).

**Implementation:**
- Render a "Diwali across the years" table at the bottom showing 2020-2030 dates for this festival (11 years × 20 festivals = 220 dates).
- Each row clickable — current valid years (2026-2030) link to that year's page; past years (2020-2025, six years × 20 festivals = 120 entries) render the historical date as plain text with a note "Past date — no muhurat tool".
- **Verification step** (mandatory before merge): the tithi engine `generateFestivalCalendarV2` *should* work for past years (tithi math is symmetric), but this needs runtime verification at impl time. If the engine refuses past dates, the past 6 years fall back to a hand-curated static fixture (~120 historical dates) — slow to write but bounded.
- Spot-check 3 historical dates per festival (Diwali 2020/2022/2024, Holi 2021/2023/2025) against Prokerala / Shubh Panchang per CLAUDE.md Definition-of-Done item #5.
- Schema: wrap the table in `@type: ItemList` with each year as a `ListItem`.

---

## 5. Implementation plan

Single PR, but commits structured so the team (or Gemini) can review one feature at a time.

| Commit | What | LOC est. | Risk |
|---|---|---|---|
| 1 | New constant files: `festival-astro-focus.ts`, `festival-clusters.ts`, `wishes.ts`, `observances.ts` (data only, no UI) | ~2000 (content-heavy: 100 wishes × 2 locales + 480 do/don't strings + 20 astro-focus + cluster defs) | Low — pure data |
| 2 | Schema helpers: `howto-ld.ts`, `event-ld.ts` + unit tests | ~250 | Low |
| 3 | `personalized-reading.ts` engine + unit tests against known-date charts | ~400 (12 transit-template rules × 1-line summary + 1-line ritual per template) | Medium — uses transit math |
| 4 | UI: personalized accordion widget on year page | ~250 | Medium |
| 5 | UI: wishes carousel + share buttons | ~200 | Low |
| 6 | UI: do's & don'ts cards | ~120 | Low |
| 7 | UI: cluster cross-link section + historical archive table | ~250 | Low |
| 8 | Wire HowTo + Event JSON-LD into layout.tsx | ~80 | Low |
| 9 | Fixture tests for the 4 new data files (presence + LocaleText shape parity) | ~300 | Low |
| 10 | Update `/festivals/page.tsx` landing to teaser the new sections | ~50 | Low |

**Revised total estimate:** ~3900 LOC (was ~2500 — underestimated content volume in v1). Still manageable in one PR, but if review burden feels heavy mid-flight, commits 1-3 (data + helpers + engine) can ship as a separate "foundation" PR followed by commits 4-10 as the UI PR. Decision point: end of commit 3.

**Branch:** `feat/festival-deep-dive`

**Commit-message convention:** none of the implementation commits may contain `[deploy]`. Per the May-2026 deploy policy, prod deploy is cron-driven (06:00 UTC daily). After merge, the change ships on the next scheduled deploy automatically.

---

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Personalized reading text reads generically (LLM-style filler) | Use deterministic rule-based generation (transit X in house Y → template Z), not LLM — same shape as `tippanni-engine.ts`. Curated copy locked in fixture tests. |
| 20 festivals × 5 wishes × 9 locales = 900 strings; risk of `undefined` rendering | Type-level enforcement: `WishText = { en: string; hi: string }` (en + hi required; other locales optional, fall back to en). Parity test in `scripts/check-locale-parity.py`. |
| Schema validation failures hurt SEO instead of helping | Run Google Rich Results test on `/festivals/diwali/2026` preview URL before merge. |
| Page weight balloons (already 943 LOC, adding ~1500 LOC of new sections to the year page alone) | Big sections (personalized accordion, cluster timeline, historical archive) are extracted to dedicated components and dynamically imported with `next/dynamic` + intersection-observer lazy load. Run Lighthouse before/after — LCP must stay under 2.5s on 3G-throttled mobile. |
| Cross-link cluster contains broken slugs (Navratri/Pitru Paksha day-pages don't exist yet) | Fixture test that every slug referenced in `FESTIVAL_CLUSTERS` either exists in `MAJOR_FESTIVALS` OR is marked `comingSoon: true`. The render layer handles `comingSoon` by showing a non-clickable item with a "coming soon" badge. |
| Historical archive dates wrong (we're computing past tithis) | Cross-check 3 dates per festival against Prokerala or Shubh Panchang (per CLAUDE.md "No Drik Panchang references — all comparisons use Prokerala / Shubh"). Spot-checks: Diwali 2020/2022/2024 + Holi 2021/2023/2025. |
| Personalized reading sections feel formulaic across festivals (same template) | Mix 3 transit templates per (festival, rashi) pair so the language varies; explicit fixture test that two random (festival, rashi) outputs are textually different. |

---

## 7. Locale strategy

Per CLAUDE.md "Locale fallback is non-negotiable":

- New strings: `en` and `hi` required for all 20 festivals × all sections. Concrete content tally:
  - Wishes: 100 wishes × 2 locales = 200 strings
  - Do's & Don'ts: 240 items × 2 locales = 480 strings
  - Personalized reading templates: ~12 transit templates × 2 lines × 2 locales = 48 strings (template-based, not per-festival)
  - Astro-focus karaka labels: 20 × 2 = 40 strings
  - Cluster names: ~6 × 2 = 12 strings
  - **Total: ~780 strings to hand-write.**
- `ta`, `te`, `bn`, `kn`, `gu`, `mai` fall back to `en` initially. Translation backlog can fill these incrementally per-festival as traffic justifies.
- The render layer must use the existing `tl()` helper which falls back to `en` automatically.
- `sa` and `mr` are retired (301 → /en/) — do NOT add fields for them.

---

## 8. Test plan

- Fixture tests for each new data file (constant-drift-invariants pattern): every festival slug in `TOP_FESTIVAL_SLUGS` has corresponding entries in `FESTIVAL_ASTRO_FOCUS`, `FESTIVAL_WISHES`, `FESTIVAL_OBSERVANCES`. Plus cluster-slug fixture: every slug referenced in `FESTIVAL_CLUSTERS` either exists in `MAJOR_FESTIVALS` or has `comingSoon: true`.
- Unit tests for `computePersonalizedReading` — 12 rashis × **all 20 festivals = 240 cases** (was "3 sample festivals" — bumped to full coverage since each festival has its own astro-focus). Each case asserts the output references the correct primary planet/house and the language is non-empty and matches the template grammar.
- Variation test: two random `(festival, rashi)` outputs must be textually different — guards against template-collapse where all reads sound identical.
- Unit tests for `generateHowToLD` and `generateFestivalEventLD` — assert JSON-LD structure + run through `schema-dts` types for type safety.
- One end-to-end test in `e2e/`: open `/en/festivals/diwali/2026`, verify all 7 new sections render + JSON-LD parses + share button works + accordion expand works.
- **Performance gate:** Lighthouse run on the year page before and after. LCP must stay under 2.5s on 3G-throttled mobile; CLS unchanged.
- **Astronomical correctness gate (per CLAUDE.md Def-of-Done #5):** spot-check 3 historical dates per 2 festivals (so 6 total, e.g. Diwali 2020/2022/2024 + Holi 2021/2023/2025) against **Prokerala or Shubh Panchang** (NOT Drik Panchang). Aditya verifies the lookup; assistant pastes both computed + reference output side-by-side in the PR.
- `npx tsc --noEmit` clean, full `npx vitest run` green, `npx next build` succeeds.

---

## 9. Rollout

**No feature flag.** Per CLAUDE.md ("Don't use feature flags or backwards-compatibility shims when you can just change the code") the new sections ship directly. The personalized reading is a pure derivation from existing data; if it breaks, rolling back the PR is straightforward.

**Deploy cadence:** does NOT use `[deploy]` marker in commit messages. Merge to `main`, then the change ships on the next 06:00 UTC cron deploy. If something is genuinely broken in production, fix-forward with another PR on the next cron — do not force-deploy.

**Section order on the year page (top to bottom):**
1. Existing hero (date, this-year)
2. Existing multi-city muhurat table
3. **NEW: Personalized "What does X mean for you?" accordion**
4. Existing mythology + significance + observance
5. **NEW: Do's & Don'ts cards**
6. Existing puja vidhi reference link + (NEW) HowTo schema attached to it
7. **NEW: Wishes & greetings carousel**
8. **NEW: Cluster timeline** (if this festival is in a cluster)
9. **NEW: Historical archive table (2020-2030)**
10. Existing regional names + FAQ

The personalized accordion is high on the page (slot #3) because it's the highest-engagement section. Wishes go below the puja vidhi so users finish learning the festival before they share greetings.

**Analytics:** add GA events for `festival_rashi_expand`, `festival_wish_share`, `festival_brihaspati_cta_click`, `festival_cluster_link_click`. These drive the §1 secondary metric measurement.

---

## 10. Resolved decisions (2026-05-28)

1. **Cluster definitions:** ✅ Yes — encode Navratri (9 days) and Pitru Paksha (15 days) the same way as the Diwali 5-day sequence. The cluster timeline component renders any length; the cluster data file is the only thing that changes. Add a third type: `'sequence'` (Diwali-style 5 days), `'navratri'` (9 days, one per day), `'pitru-paksha'` (15 days of tarpan).
2. **Personalised reading depth:** ✅ **All personalised content is FREE.** Drop the "free preview + paid expansion" idea entirely. The page shows:
   - Full 12-rashi accordion with per-sign transit summary + ritual recommendation, free, complete.
   - A separate Brihaspati CTA card at the section's end: "Want a full personalised reading for <Festival> 2026? Ask Brihaspati — INR 49 / USD 2". The free content stands alone; Brihaspati is the upgrade for *conversation*, not gated text.
3. **Greeting cards as images:** ✅ Deferred to v2. Text-only for this PR. The OpenGraph-image pattern can wrap any wish in v2 without touching the data shape.
4. **Past-year coverage:** ✅ 2020-2030 stays as the range. No deeper history. Past years (2020-2025) render as plain text rows; current valid years (2026-2030) link to their page.

---

## 11. Acceptance criteria

For this PR to ship:

- [ ] All 4 new data files populated with EN + HI for 20 top festivals (concrete counts: 200 wishes + 480 do/don't items + 48 reading templates + 40 karaka labels + 12 cluster names = ~780 strings)
- [ ] Personalized widget renders for all 12 rashis on `/festivals/diwali/2026` AND on `/festivals/holi/2026` (two spot-checks)
- [ ] HowTo schema validates via Google Rich Results test on `/festivals/diwali/2026` preview deploy
- [ ] Event schema validates via Google Rich Results test on `/festivals/diwali/2026` preview deploy — and if flagged as spam-risk by the tester, Event is dropped without blocking the rest of the PR
- [ ] Cross-link cluster + historical archive render correctly on Diwali (5-day cluster) and Navratri (9-day cluster with `comingSoon` items)
- [ ] 240 personalized-reading fixture tests + variation test + 5 data-parity tests pass (one parity test per data file + the cluster slug-existence test)
- [ ] 1 e2e test asserting the 7 new sections appear on `/festivals/diwali/2026` in order, with accordion + share + cluster link working
- [ ] `npx tsc --noEmit`, `npx vitest run`, `npx next build` all green
- [ ] Lighthouse on `/festivals/diwali/2026`: LCP < 2.5s on 3G-throttled mobile (before/after comparison, before recorded as the baseline)
- [ ] 6 historical dates spot-checked against Prokerala / Shubh (Diwali 2020/2022/2024 + Holi 2021/2023/2025) — both computed and reference values pasted in the PR description side-by-side per CLAUDE.md
- [ ] Browser-verified on localhost: open `/en/festivals/diwali/2026`, click into rashi card, click into wishes share, click into cluster link, click into Brihaspati CTA
- [ ] Merge commit does NOT contain `[deploy]` — change ships on next 06:00 UTC cron

---

## 12. Self-review delta (vs first draft)

Issues caught on second read and addressed inline:

1. ✅ `Target ship` clarified: no `[deploy]` marker; cron-driven release.
2. ✅ §2: noted festival-slug ↔ puja-vidhi-slug mapping must be verified at impl time (1:1 assumed for top 20).
3. ✅ §3 + §7: locale count corrected from "9" to "8" (sa + mr retired).
4. ✅ §4A: per-festival astro-focus table fully populated (was 3 example rows; now all 20 with classical anchors).
5. ✅ §4A: clarified the widget is **server-rendered** for SEO, not a client effect.
6. ✅ §4B: originality + sourcing note added.
7. ✅ §4C: item count fixed at 6+6 (was "5-8") and total string count made explicit (480).
8. ✅ §4E: Event schema risk acknowledged; `OfflineEventAttendanceMode` instead of `Online`; spam-risk escape hatch documented.
9. ✅ §4F: cluster fixture test extended to handle `comingSoon: true` for Navratri/Pitru Paksha day-pages.
10. ✅ §4G: verification step for past-year tithi math + static-fixture fallback if the engine refuses.
11. ✅ §5: revised LOC estimate from ~2500 to ~3900 (content underestimated); decision point for "foundation PR + UI PR" split.
12. ✅ §6: Drik reference removed in favor of Prokerala / Shubh per CLAUDE.md; template-collapse risk added with mitigation.
13. ✅ §8: personalized-reading fixture coverage bumped from 36 cases to 240 (12 rashis × 20 festivals); Lighthouse perf gate added.
14. ✅ §9: feature flag dropped per CLAUDE.md "no feature flags when you can just change code"; section-order layout added; GA events listed.
15. ✅ §11: acceptance criteria tightened with concrete counts, Lighthouse threshold, Prokerala spot-check requirement, `[deploy]` ban.

---

## 13. Known unknowns (resolve at impl time, not blocking spec)

- Whether `generateFestivalCalendarV2` accepts past-year inputs (§4G). If not, static-fixture fallback.
- Whether `getPujaVidhiBySlug(festivalSlug)` returns matches 1:1 for the top 20 (§2). If not, add a thin `FESTIVAL_TO_PUJA_SLUG` map.
- Whether Google's Rich Results tester accepts the Event schema for a real-world cultural observance (§4E). If flagged as spam-risk, drop Event, keep HowTo.

---

*This spec is ready for review. Open the spec PR, run Gemini, address, merge — then start implementation per §5.*
