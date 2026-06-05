# Deep duplicate-logic audit — 2026-06-05

Trigger: today's bug. `/panchang` showed AMANT="Adhika Jyeshtha" but PURNIMANT="Jyeshtha" while `/calendars/masa` correctly showed both as "Adhika Jyeshtha". Root cause: `panchang-calc.ts` hand-rolled Purnimanta Adhika logic instead of calling the shared `hindu-months` engine. Lesson M. Fixed in PR #432.

This audit walks the codebase looking for the same pattern: same data, two sources, drift. 5 parallel agents scanned 5 axes (Jyotish constants, computation engines, display components, data fetches, date/time pitfalls). 11 CRITICAL, ~12 HIGH, ~6 MEDIUM findings. Several CRITICAL are already shipping wrong values to users.

This doc is sorted by **blast radius**, not by category. Each entry is `file:line` exact and ready to act on.

---

## 🔴 CRITICAL — already shipping wrong values

### 1. Sankalpa generator hand-rolls Purnimanta — identical bug to the one we just fixed
- **`src/lib/puja/sankalpa-generator.ts:101`**
  ```ts
  const purnimantMasaIndex = tithiResult.number > 15 ? (amantMasaIndex + 1) % 12 : amantMasaIndex;
  ```
- Exact same Adhika-blind formula just removed from `panchang-calc.ts`. The sankalpa recited at every puja names the wrong masa in any Purnimanta Adhika year. Ritually meaningful. Same bug class, hiding one folder over.
- **Fix:** import `getPurnimantMasaForDate` and use the result; delete the formula.

### 2. Pushkar Bhaga values disagree between UI and engine
- **`src/components/kundali/SphutasTab.tsx:579-582`** has 12 sign→degree values: Aries=14, Taurus=28, Gemini=7, ...
- **`src/lib/constants/pushkar-bhaga.ts:9`** (canonical) has: Aries=21, Taurus=14, Gemini=18, ...
- **Every single value differs.** The UI displays `(PB=X°)` badges using SphutasTab's wrong table while the engine (`kundali-calc.ts:983`, `muhurta/engine/rules/graha.ts:133`) scores against the canonical. Live drift.
- **Fix:** delete the inline map; `import { PUSHKAR_BHAGA } from '@/lib/constants/pushkar-bhaga'`.

### 3. Three non-cron consumers read `kundali_snapshots` without staleness gate
- **`src/app/api/user/profile/route.ts:42,145,167,328`** — dashboard chart can be years-stale
- **`src/app/api/medical/route.ts:160,256`** — has its own ad-hoc `computation_version === ENGINE_VERSION` check that bypasses `isSnapshotStale` (so old-ephemeris results pass through)
- **`src/lib/brihaspati/router/load-subject-kundali.ts:66`** — Brihaspati AI ingests stale charts → hallucinated transits in chat
- CLAUDE.md "Kundali Snapshot Architecture" explicitly forbids this. Cron jobs are clean.
- **Fix:** all three route through `getFreshSnapshot(supabase, userId)`.

### 4. Two festival generators alive, both wired
- **Canonical:** `src/lib/calendar/festival-generator.ts` → `generateFestivalCalendarV2` (~25 importers).
- **Legacy:** `src/lib/calendar/festivals.ts` → `generateFestivalCalendar` — ~1000-line shadow implementation still wired to `src/app/api/festival-compare/route.ts:2`.
- A/B comparator silently drifts as V2 evolves.
- **Fix:** retire `festival-compare` or move `festivals.ts` to `__tests__/legacy/` as snapshot fixtures.

### 5. Amavasya gap — `getLunarMasaForDate` returns null on every Amavasya
- **`src/lib/calendar/hindu-months.ts:671`** — strict `<` containment, `endDate = Amavasya`, `next.startDate = Pratipada (Amavasya+1)` → Amavasya is in no row. 8+ gap days in 2026 alone.
- Cascades into:
  - **`src/lib/muhurta/classical-checks.ts:247-249`** `isAdhikaMasa` returns false on every Amavasya → **marriage muhurta engine certifies the last day of an Adhika Masa as auspicious** (Tier-0 veto bypassed).
  - **`src/lib/muhurta/engine/context-builder.ts:90-93`** masaResult = null → Adhika/Chaturmas vetoes skipped.
  - **`src/lib/puja/sankalpa-generator.ts:95-97`** falls back to solar `getMasa(sunSid)` → sankalpa on Mauni Amavasya, Mahalaya Amavasya, Diwali (Kartika Amavasya), Vat Savitri (Jyeshtha Amavasya), Diwali names the wrong masa.
  - **`src/lib/ephem/panchang-calc.ts:1248-1250`** falls back to solar masa, drops Adhika flag.
- **Fix (proposed earlier today, no code yet):** Option 2 — change `<` to `<=` containment in both `getLunarMasaForDate` and `getPurnimantMasaForDate`; bump sandwich bottom-layer `startDate` by 1 day to preserve no-overlap.

### 6. OG image rebuilds tithi/nakshatra/yoga from longitudes
- **`src/app/[locale]/panchang/opengraph-image.tsx:154-163`**
  ```ts
  const tithiNum = Math.floor(tithiDiff / 12) + 1;
  const nakshatraNum = Math.floor(moonSid / (360 / 27)) + 1;
  const yogaNum = Math.floor(yogaSum / (360 / 27)) + 1;
  ```
- Bypasses `calculateTithi/getNakshatraNumber/calculateYoga`. Hardcodes Lahiri ayanamsha — KP/Raman users get a different value on the OG card than on the page.
- **Fix:** import the canonical helpers.

### 7. Five panchang cards rendered twice with diverging "isPassed" logic
- **`src/app/[locale]/panchang/PanchangClient.tsx:1033-1200`** — `hasTransitionPassed(..., selectedDate, location.ianaTimezone)` (**timezone-aware** ✓)
- **`src/components/panchang/TodayPanchangWidget.tsx:233-400`** — `isTimePassed(tithiTr.endTime, tithiTr.endDate)` (**no timezone** ✗)
- **`src/app/embed/panchang/page.tsx:217-228`** — third shape with no transition logic at all (SSR-frozen for third-party embedders)
- Pure Lesson ZA. Cards stay "highlighted" for hours past their end in the home widget for any non-IST visitor.
- **Fix:** extract `<PanchangCardGrid panchang={...} locale={...} now={...} />` and use it in all three sites.

### 8. Today's Amant/Purnimant fix already has a sibling render that bypasses i18n
- **`src/app/[locale]/panchang/PanchangClient.tsx:1151`** uses `msg('amant', locale)` ✓
- **`src/components/panchang/TodayPanchangWidget.tsx:296`** uses inline `locale === 'hi' ? 'अमान्त' : 'Amant'` ✗
- Tamil/Telugu/Bengali/Kannada/Gujarati/Maithili/Marathi visitors see English labels in the home widget while seeing localised labels on `/panchang`. The data fix today landed; the LABEL was already drifted.
- **Fix:** route TodayPanchangWidget through `msg('amant', locale)` too.

### 9. DayDrilldown muhurta-ai mis-highlights midnight-crossing slots
- **`src/app/[locale]/muhurta-ai/components/DayDrilldown.tsx:43-47`**
  ```ts
  return nowMin >= start && nowMin < end;
  ```
- No midnight-wrap branch. Choghadiya/Hora/Rahu-Kaal pages all got the Lesson-R fix; this one slipped through. Nishita and late-night muhurtas display the wrong slot as active.
- **Fix:** copy the wrap pattern from `choghadiya/Client.tsx:274-276`.

### 10. Three competing hora implementations
- **`src/lib/hora/hora-calculator.ts:108`** `calculateHoras` (uses `WEEKDAY_LORD`)
- **`src/lib/panchang/hora-engine.ts:62`** `computeHoraTable` (uses `VARA_START_PLANET`, `CHALDEAN_ORDER`)
- **`src/lib/ephem/panchang-calc.ts:443`** `computeHora` (uses `HORA_DAY_START_INDEX`, `HORA_PLANET_SEQUENCE`)
- Plus `shadbala.ts:731` `horaBala` with internal hora logic.
- Three different start-planet tables. The DAY one of them drifts, hora display, energy score, and Hora Bala silently disagree.
- **Fix:** keep `calculateHoras` as the engine; make the others delegate.

### 11. Solar `getMasa()` still used for birth masa in user-facing surfaces
- **`src/app/[locale]/vedic-time/Client.tsx:320`** `const masaIndex = getMasa(sunSid);`
- **`src/app/api/user/profile/route.ts:69`** `const masaIndex = getMasa(sunSid);`
- The kundali code (`Client.tsx`, `PatrikaTab.tsx`) already removed `getMasa()` with a comment explaining it's "wrong near Sankranti, blind to Adhika." These two paths still ship the documented-wrong value.
- **Fix:** call `getLunarMasaForDate(year, month, day)` with the canonical fallback.

---

## 🟠 HIGH — ticking time bombs

### 12. Nine `SIGN_LORDS` copies with mixed key schemes
- One canonical: `src/lib/constants/dignities.ts:80` `SIGN_LORDS` + `:220` `SIGN_LORDS_ARRAY`.
- Eight inline `{1:2, 2:5, ..., 12:4}` redefinitions:
  - `src/app/[locale]/cosmic-blueprint/page.tsx:22-24`
  - `src/app/[locale]/kundali/Client.tsx:2573` AND `:2616` (**same file twice**)
  - `src/app/embed/kp-rashi/page.tsx:51`
  - `src/lib/tippanni/remedies-enhanced.ts:253`
  - `src/lib/tippanni/varga-tippanni.ts:54`
  - `src/lib/kundali/special-lagnas.ts:18`
  - `src/lib/kundali/tippanni-engine.ts:329`
  - `src/lib/kundali/sudarshana-interpretation.ts:73`
- One ALSO with 0-based keys: `src/components/kundali/AyanamshaComparison.tsx:304`.
- BPHS planetary rulership debates (Rahu→Aquarius co-lord, Ketu→Scorpio) will fork these silently.

### 13. Nakshatra→ruling-planet duplicated 7 ways with mixed encodings
- Strings: `src/lib/ephem/kundali-calc.ts:242-246`, `src/lib/caesarean/scorer.ts:64-68`
- Numeric IDs: `src/lib/kundali/sphutas.ts:24-28` (`[8,5,0,1,2,7,4,6,3]`)
- Learn pages: `learn/labs/dasha/page.tsx:18`, `learn/labs/kp/page.tsx:16`, `learn/nakshatras/page.tsx:36`, `learn/dasha-sandhi/page.tsx:171`
- Vimshottari ordering is the backbone of every dasha prediction. Drift here corrupts dasha + KP + nakshatra-pada features at once.

### 14. 52 ad-hoc `user_profiles` SELECTs, no shared loader
- Top offenders: `src/app/[locale]/settings/page.tsx` (4 separate fetches in one file: lines 710, 878, 930, 980), `src/app/[locale]/kundali/Client.tsx:496`, 6 dashboard `layout.tsx` files.
- Schema change = 50-file PR. New columns silently drop from older pages.
- **Fix:** introduce `src/lib/user/get-profile.ts` exporting `getProfile(supabase, userId, fields?)` + `useProfile()` hook.

### 15. Eight unguarded `obj[locale]` accesses in compatibility page
- **`src/app/[locale]/learn/compatibility/page.tsx`** lines 127, 164, 177, 190, 207, 208, 239, 256.
- Public marketing page. **Crashes for ta/te/kn/bn/gu/mai/mr visitors.**
- **Fix:** `import { tl } from '@/lib/utils/trilingual'` and use it.

### 16. Service-role helper missing `.trim()`
- **`src/lib/supabase/server.ts:5`** `const key = process.env.SUPABASE_SERVICE_ROLE_KEY;`
- One missing trim at the canonical helper every server route inherits from. Vercel adds trailing newlines → admin client fails to authenticate silently if anyone re-pastes the value.
- **Fix:** `process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()`.

### 17. 108 inline pada `deity:` strings independent of `NAKSHATRAS[].deity.en`
- **`src/lib/constants/nakshatra-pada-profiles.ts:88, 112+`** — 27-key `NAKSHATRA_DEITIES` map plus 108 per-pada `deity:` literals. None imported from `NAKSHATRAS`.
- A BPHS deity-name correction (Pushya = Brihaspati vs. Brahaspati) won't propagate.
- **Fix:** derive at module load: `const deities = NAKSHATRAS.map(n => n.deity.en);`

### 18. `EXALTATION_DEG` in shadbala as absolute longitudes
- **`src/lib/kundali/shadbala.ts:102`** holds `Sun=10, Moon=33, Mars=298…` (absolute sidereal degrees).
- Parallel encoding of `EXALTATION_SIGNS` × 30 + `EXALTATION_DEGREES` from canonical. Mathematically correct *today*. The moment anyone tweaks the canonical for Rahu/Ketu modern-rulership, Uccha Bala silently goes wrong.
- **Fix:** derive: `(EXALTATION_SIGNS[id]-1)*30 + EXALTATION_DEGREES[id]`.

### 19. Local-TZ `new Date()` in festival/tithi date construction
- **`src/lib/calendar/festivals.ts:55, 60, 86, 90, 135, 143, 165, 341`**
- **`src/lib/calendar/tithi-table.ts:169, 172, 237, 240`**
- All use `new Date(y, m-1, d)` then read `.getFullYear()/.getMonth()+1/.getDate()` to build YYYY-MM-DD strings fed back to `dateToJD`. Vercel servers are UTC so this works in prod; **the moment we move to a regional Vercel region or self-host on a non-UTC box, Ekadashi/Pradosham/Sankashti dates shift by one calendar day for sunrise-edge cases.**
- Feeds Chaturmas + festival lookups, which feed muhurta-engine vetoes. Latent Lesson L.
- **Fix:** `Date.UTC(y, m-1, d)` + `.getUTC*()` accessors.

### 20. Naïve-local birthdate parse in tippanni
- **`src/lib/kundali/tippanni-engine.ts:1441`** `new Date(kundali.birthData.date + 'T00:00:00')`
- On UTC server this is UT midnight, which is 5.5h earlier than IST. Age math at `getLifeStageContext` shifts by ~5.5h. Users born near their birthday hour see the wrong life-stage band on/near their birthday.
- **Fix:** `new Date(date + 'T00:00:00Z')` or parse to JD via the timezone resolver.

### 21. ~20 inline `Math.floor(longitude/30)+1` rashi computations
- Pervasive: `forecast/monthly-transit.ts:56`, `tippanni/dasha-synthesis.ts:154`, `varga-tippanni.ts:147`, `varga-classical-checks.ts:73`, `llm/personalized-horoscope.ts:61,69`, `sky/positions.ts:75`, `calendar/tithi-table.ts:274,286,470-471`, `festivals.ts:238,243,687-688`, `retro-combust.ts:175,180,203`, `hindu-months.ts:210,214,220,231,233,604,610`, `eclipse/eclipse-impact.ts:89,113`, `horoscope/daily-engine.ts:416`, `matching/detailed-report.ts:148`, `ephem/kundali-calc.ts:371,492,1208,1389`, `panchang-calc.ts:1769`.
- Formula stable, but the 1-based vs 0-based convention is *not* uniformly applied — some sites read the result with `RASHIS[n-1]`, others with `RASHIS[n]`. One renumber breaks everything at once.
- **Fix:** import `getRashiNumber` from `astronomical.ts:442` everywhere.

### 22. Three sunrise/sunset implementations
- **`src/lib/ephem/swiss-ephemeris.ts:440/451`** `sunriseUTHoursOr/sunsetUTHoursOr` (canonical, Swiss + Meeus fallback)
- **`src/lib/astronomy/sunrise.ts:76`** `getSunTimes` (own spherical-trig solver)
- **`src/lib/ephem/astronomical.ts:580/641`** `approximateSunrise` + an unnamed twin at line 641
- **`src/lib/calendar/eclipse-compute.ts:133`** `getSunriseSunset` (local helper)
- 1-2 min refraction/EoT drift across OG card / calendar / eclipse calculator. Refraction constant tweak hits one, not the others.
- **Fix:** retire `astronomy/sunrise.ts` and `eclipse-compute.ts:133` in favour of the canonical.

### 23. Five inline mini-chart SVGs
- **`src/components/kundali/MiniChart.tsx:74,108`**, **`MiniChartNorth.tsx:51`**, **`ExampleKundaliChart.tsx:58`**, **`HouseHighlightChart.tsx:46`** — each renders its own inline north/south chart SVG.
- A glyph or house-numbering fix in `ChartNorth/ChartSouth` doesn't propagate. These are on SEO-indexed learn pages.
- **Fix:** thin wrappers over `ChartNorth/ChartSouth` with a `compact` prop.

---

## 🟡 MEDIUM — should be cleaned

### 24. Tatkalika (temporary) friendship rule not in a constants file
- **`src/lib/tippanni/dignity.ts:149`** `tempFriendHouses = [2, 3, 4, 10, 11, 12]`
- **`src/lib/kundali/shadbala.ts:241`** same rule, different shape.
- **Fix:** add `TATKALIKA_FRIEND_HOUSES` to `src/lib/constants/friendships.ts`.

### 25. Inline rashi-element array in matching
- **`src/lib/matching/detailed-report.ts:486`** `elements = ['', 'fire', 'earth', 'air', 'water', ...]`
- Derive from `RASHIS[i].element.en` or compute as `i % 4`.

### 26. Festival cards drift across 5+ surfaces
- `calendar/Client.tsx:640-757`, `dashboard/FestivalCountdown.tsx:243`, `embed/festivals/page.tsx`, plus 5 distinct cards in `components/festivals/`.
- No `<FestivalCard>` component; each surface renders its own JSX.
- **Fix:** extract a `FestivalCard` (or a `FestivalCardCompact` variant).

### 27. `setMonth(+N) / setFullYear(+N)` in domain-synthesis windows
- **`src/lib/kundali/domain-synthesis/key-dates.ts:111`** `windowEnd.setMonth(... + monthsAhead)`
- **`src/lib/kundali/domain-synthesis/timeline.ts:37`** `windowEnd.setFullYear(... + yearsAhead)`
- JS normalises Jan-31 + 1mo = Mar-3. Window edges swallow/expose dasha transitions by 2-3 days.
- **Fix:** millisecond arithmetic per Lesson P.

### 28. Three empty `catch {}` blocks (all browser-storage guards)
- `src/stores/birth-data-store.ts:48` (localStorage)
- `src/components/eclipses/PersonalEclipseInsight.tsx:300` (sessionStorage QuotaExceeded silently breaks next route's hydration)
- `src/app/[locale]/layout.tsx:184` (theme init script)
- **Fix:** add `console.warn('[module] storage failed:', err)` so we see the failure.

### 29. Choghadiya double-implementation
- **`src/lib/ephem/panchang-calc.ts:341`** `computeChoghadiya` (canonical)
- **`src/lib/muhurta/engine/rules/kaala.ts:151`** reimplements the loop using the same constants but its own duration arithmetic.
- **Fix:** delegate to canonical.

### 30. KP-specific dasha duplication
- **`src/lib/kp/sub-lords.ts:26-98`** has its own copy of `VIMSHOTTARI_YEARS = [7,20,6,10,7,18,16,19,17]` plus star/sub/sss span loop.
- Intentional KP-specific path, but the years constant should be shared.

---

## ✅ Verified clean

These were claimed clean by CLAUDE.md Lessons or expected to be drift-prone. Verified by the audit:

- **Naisargika Maitri (friendship table)** — `src/lib/constants/friendships.ts` is canonical; all consumers import. Lesson S regression test guards it.
- **Moolatrikona** — `src/lib/constants/dignities.ts:63` canonical, all consumers import.
- **Rahu Kaal / Yamaganda / Gulika weekday-segment order** — `src/lib/constants/inauspicious-orders.ts:13,16,19` canonical.
- **Karana cycle / sthira karanas** — no duplicate tables.
- **Ayanamsha** — `getAyanamsha` only, no twins.
- **Weekday convention (Lesson O)** — every `% 7` site uses 0=Sun. Zero violations.
- **Fractional-year arithmetic (Lesson P)** — Vimshottari/Ashtottari/Yogini all use `getTime() + y*365.25*86400000`. Zero violations.
- **Midnight wrap (Lesson R)** — choghadiya, hora-calculator, hora-engine, rahu-kaal, gauri-panchang all correct. **Only `DayDrilldown.tsx:47` (#9) violates.**
- **ISR hydration (Lesson ZD)** — 23 baseline known violations, **zero new regressions**.
- **Browser timezone in kundali/ephem/calendar** — zero violations.
- **Service-role on client** — zero leaks (one missing trim at the helper, #16).
- **Stripe / Razorpay subscription write paths** — single upsert per provider.
- **Bare `process.env` in API routes (no `.trim()`)** — zero confirmed (probes use `!!process.env.X` which is safe).
- **Tithi-table grid component** — single canonical `TithiMonthGrid`.
- **Birth-chart consumers (15+)** — all import `ChartNorth/ChartSouth`. (Mini variants in #23 are a separate concern.)

---

## Suggested ordering

### Phase 1 — silent CRITICAL drift (this PR or next)
1. `#1 Sankalpa Purnimanta` (`sankalpa-generator.ts:101`) — trivial, ~5 LOC
2. `#2 Pushkar Bhaga UI` (`SphutasTab.tsx:579`) — delete + import
3. `#5 Amavasya gap fix` (`hindu-months.ts:671/716` + sandwich bottom-layer bump)
4. `#9 DayDrilldown midnight wrap` (`DayDrilldown.tsx:47`) — copy from choghadiya
5. `#11 Solar getMasa fallback` (vedic-time + user/profile) — replace with lunar lookup
6. `#16 Service-role .trim()` (`server.ts:5`) — one line

### Phase 2 — architectural CRITICAL
7. `#3 Snapshot consumers` (3 files) — route through `getFreshSnapshot`
8. `#6 OG image rebuild` — import canonical helpers
9. `#7 5-card extraction` — `<PanchangCardGrid>`
10. `#8 Widget masa labels` — route through `msg()`
11. `#4 Legacy festival generator retirement`
12. `#10 Hora consolidation`

### Phase 3 — HIGH ticking bombs
13. `#12 SIGN_LORDS` — 9 sites, mostly mechanical
14. `#13 Nakshatra→ruler` — 7 sites
15. `#15 compatibility/page.tsx tl()` — 8 sites in one file
16. `#19 Festival/tithi-table local-TZ Date construction`
17. `#21 Rashi-from-longitude (`Math.floor(/30)+1`)` — 20+ sites
18. `#14 user_profiles loader` — 50+ sites, batch-merge friendly

### Phase 4 — MEDIUM cleanup
19. `#17 Pada deity derivation`
20. `#22 Sunrise consolidation`
21. `#23 MiniChart wrappers`
22. `#26 FestivalCard extraction`

---

## Newly-surfaced engine bug (not in the original audit)

Phase-1 cross-source verification against Drik (19 Delhi dates + 4 TZ dates) turned up **3 PRE-EXISTING `panchangDayForJD` attribution failures** — engine uses NM-day attribution; Drik uses tithi-at-sunrise attribution. Diverges by 1 day around the Adhika Jyeshtha boundary (2026-05-17, 06-15, 06-30). Already broken on `main` pre-PR #432.

→ Full detail: [`panchang-day-attribution-bugs.md`](./panchang-day-attribution-bugs.md)
→ Test cases: 3 `it.skip('TODO panchang-day-attribution …')` in `src/lib/__tests__/audit-phase1-cross-source.test.ts`
→ Engine site: `src/lib/calendar/hindu-months.ts` `panchangDayForJD` (has TODO comment block pointing here)

## Phase 3 — refutations of original audit findings

Phase 3 deep-dive verified that **2 of the original 11 CRITICAL findings were stale** (the audit was based on a code snapshot that predated existing fixes):

### #7 (CRITICAL → REFUTED): 5-card grid drift between PanchangClient and TodayPanchangWidget

The audit claimed the `tithiPassed` / `nakPassed` logic differed: timezone-aware in `PanchangClient.tsx`, naive in `TodayPanchangWidget.tsx`. **This is no longer true.** Commit `045dded3` (`fix(panchang): unify transition-passed comparison`) routed both surfaces through `hasMomentPassed` from `@/lib/utils/now-in-timezone`. The wrappers in each file differ only because `PanchangClient` supports a date-picker (`selectedDate` parameter) while the widget is today-only; both call the same canonical helper. Forcing a `<PanchangCardGrid>` extraction would couple unrelated concerns.

Locked in by `audit-phase3-cross-source.test.ts` § 3 (both files import `hasMomentPassed`).

### #10 (CRITICAL → REFUTED): three competing hora implementations

Three files (`hora-calculator.ts`, `hora-engine.ts`, `panchang-calc.ts` `computeHora`) use two different rotations of the Chaldean order:

- `[6, 4, 2, 0, 5, 3, 1]` (Saturn first) — hora-calculator + shadbala
- `[0, 5, 3, 1, 6, 4, 2]` (Sun first) — hora-engine + panchang-calc

**These produce identical 24-hour hora sequences.** A rotated cyclic table iterated cyclically gives the same answer regardless of where you start the array. Verified for 2026-06-05 Friday Delhi: all 3 implementations agree on the planet ID for all 24 horas. Friday's first day hora = Venus (planet 5) in all three.

Locked in by `audit-phase3-cross-source.test.ts` § 1 (24/24 cross-implementation agreement).

### #8 (HIGH, fixed) — Amant/Purnimant hardcoded labels

`TodayPanchangWidget.tsx:299, 303` used `locale === 'hi' ? 'अमान्त' : 'Amant'` — 7 of 9 visible locales (ta, te, bn, kn, gu, mai, mr) saw English while `PanchangClient.tsx` localised properly. Fixed by adding `amant` + `purnimant` to `src/messages/components/today-panchang.json` with all 9 locales and routing the widget through `msg(...)`.

### #6 (CRITICAL, fixed) — OG image rebuilt from longitudes inside Edge runtime

`src/app/[locale]/panchang/opengraph-image.tsx` declared `runtime = 'edge'` and inlined Meeus implementations of `sunLongitude`/`moonLongitude`/`lahiriAyanamsha`, hardcoded English-only TITHI/NAKSHATRA/YOGA name arrays, computed tithi/nakshatra/yoga from raw degrees. Drift surface from the canonical engine.

Fixed: dropped `runtime = 'edge'`, switched to `calculateTithi` / `getNakshatraNumber` / `calculateYoga` from `@/lib/ephem/astronomical` and `TITHIS` / `NAKSHATRAS` / `YOGAS` from `@/lib/constants/*`. Image is daily-revalidated (`revalidate = 86400`) so the Node runtime is fine — Edge gave no useful speed-up but forced the duplication.

## Notes for next audit

- Tooling: this should be a script (`scripts/audit-duplicates.ts`) that greps for canonical-table values, inline `Math.floor(jd/30)+1` patterns, `obj[locale]` non-`tl` accesses, and reports a count delta against a checked-in baseline. The audit cost ~30 min of agent time; a script could run in <30s per PR.
- Lessons S/Z/Q/M/ZA/ZC all describe *recurrences* of the same pattern. The pattern itself — "same data, two sources" — is the meta-bug. Until we have automated guards, we will keep paying this tax.
- "Just one inline copy because it's easier" cost us the Pushkar Bhaga drift, the Adhika Purnimanta drift, and the widget i18n drift today.
