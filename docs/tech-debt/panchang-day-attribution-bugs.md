# Engine `panchangDayForJD` ↔ Drik tithi-at-sunrise divergence

Surfaced during 2026-06-05 Phase-1 cross-source verification (PR fixing the silent CRITICAL drifts from `duplicate-logic-audit-2026-06-05.md`). Three test cases in `src/lib/__tests__/audit-phase1-cross-source.test.ts` are marked `it.skip` with `TODO(panchang-day-attribution)` pointing here so they re-activate when this bug is fixed.

## Root cause (single statement)

`panchangDayForJD` in `src/lib/calendar/hindu-months.ts:496` attributes a New Moon to the calendar day on which the NM event occurs (with a sunrise adjustment), while Drik / Prokerala / AstroSage use **tithi-at-sunrise** attribution. These rules diverge by 1 calendar day whenever the NM event happens **after sunrise of its local calendar day** AND the Amavasya tithi (which runs ~24h starting at NM) is still active at the **next** sunrise.

In code:
```ts
// src/lib/calendar/hindu-months.ts:496
function panchangDayForJD(jd: number, lat: number, lon: number, timezone: string): string {
  const { year: y, month: m, day: d } = jdToGregorianUTC(jd);
  const srUT = sunriseUTHoursOr(dateToJD(y, m, d, 12), lat, lon, 0, 6).value;
  const srJd = dateToJD(y, m, d, srUT);
  const dateJd = jd < srJd ? jd - 1 : jd;  // ← engine rule
  return jdToLocalDateStrFromJD(dateJd, timezone);
}
```

Engine: `jd < sunrise → previous day`, otherwise current day. This is "NM-day attribution" — the calendar day containing the NM event.

Drik: walks the calendar forward; for each day, asks "what tithi is active at sunrise?" The day where Amavasya is at sunrise gets labelled the Amavasya panchang day. This is "tithi-at-sunrise attribution".

The two rules agree when the NM falls **between midnight and sunrise** (both pick the previous calendar day) OR when the NM falls **between sunrise and noon** (current day, and Amavasya is at sunrise of the current day so Drik agrees). They **disagree** when the NM falls between noon and midnight — engine picks the current day; Drik picks the next day (because Amavasya hasn't started by current day's sunrise, but is active at next day's sunrise).

## Why this surfaced now

PR #432 fixed an unrelated bug — `getLunarMasaForDate` returned `null` on every Amavasya panchang day because the engine's `endDate` (Amavasya panchang day) was excluded by strict `<` containment. With the inclusive `<=` fix, the gap days now resolve, AND the cross-source Drik verification became feasible. Running 22 dates through the engine post-fix surfaced the 3 cases below where engine ≠ Drik.

## The three concrete cases (Delhi, 2026)

### Case 1 — 2026-05-17 (kshaya boundary, Vaishakha → Adhika Jyeshtha)

- **Astronomical NM:** ~03:31 IST on 2026-05-17 (NM before sunrise).
- **Engine attribution:** NM < sunrise → panchang day = 2026-05-16. So Vaishakha `endDate=2026-05-17` (because pratipadaPanchangDay returns 05-17 as the next sunrise-inside-Pratipada). Adhika Jyeshtha `startDate=2026-05-17` (same day, shared boundary).
- **Engine returns** for date `2026-05-17`: forward `find()` with `<=` picks Vaishakha first.
- **Drik returns** for date `2026-05-17`: `Adhika Jyeshtha Shukla Pratipada` (tithi 1 at sunrise = Adhika's first day).
- **Disagreement:** engine = `Vaishakha`, Drik = `Adhika Jyeshtha`.
- **Pre-existing on main:** YES. Forward `<` ALSO returned `Vaishakha` for `2026-05-17` (Vaishakha row `[04-18, 05-17)` excluded 05-17, but Adhika row `[05-17, 06-14)` *included* it — find() picked Adhika. Wait — actually on `main` PR #432, returning Vaishakha is the new bug. On `main` before PR #432, the lookup returned `null` and panchang-calc fell back to solar `getMasa()`. So neither version matches Drik; the bug *flavour* changed in PR #432 but the underlying engine attribution didn't.

### Case 2 — 2026-06-15 (terminal Amavasya of the Adhika lunation)

- **Astronomical NM:** 2026-06-14 at ~19:24 IST (≈13:54 UT). After sunrise (~05:25 IST), before midnight.
- **Engine attribution:** NM (19:24) > sunrise (05:25) → panchang day = `2026-06-14`. Engine sets Adhika Jyeshtha `endDate=2026-06-14`.
- **Drik attribution:** at sunrise on `2026-06-14` the active tithi is Krishna **Chaturdashi** (tithi 29, ends 12:19 PM). Amavasya runs 12:19 PM 06-14 → 08:23 AM 06-15. So at sunrise on `2026-06-15` the active tithi is **Amavasya**. Drik attributes the Adhika Amavasya panchang day to **2026-06-15**.
- **Engine returns** for `2026-06-15`: lookup falls into Nija Jyeshtha row `[2026-06-14, 2026-07-14]` → `Jyeshtha`.
- **Drik returns** for `2026-06-15`: `Adhika Jyeshtha` (Krishna Amavasya, last day of Adhika).
- **Disagreement:** engine off by 1 day for this Adhika-terminal Amavasya specifically.

### Case 3 — 2026-06-30 (cascade from case 2)

- **Drik tithi at sunrise:** tithi 16 (Krishna Pratipada).
- **Drik masas:** Amanta = `Jyeshtha` (still — Nija Jyeshtha started 2026-06-16 in Drik's reckoning), Purnimanta = `Ashadha` (normal Krishna-paksha advance, post-Adhika).
- **Engine tithi at sunrise:** different number (the engine's tithi counter is off because the prior Amavasya was attributed to 06-14 instead of 06-15, so the engine is "ahead" by ~1 day in the synodic month).
- **Engine returns** for `2026-06-30`: Amanta = `Jyeshtha` ✓, Purnimanta = `Jyeshtha` ✗ (Drik says `Ashadha`).
- **Disagreement:** the entire post-Adhika synodic month is shifted by ~1 day relative to Drik, so the tithi number AND Purnimanta name diverge on the day Drik calls "Krishna Pratipada after Jyeshtha Purnima".

## Scope of impact across all calendar dates

Without doing a year-by-year run, the affected days per 2026 lunar cycle are exactly the Amavasyas whose NM event falls in the noon-to-midnight IST window. From the cycle data already inspected, this includes:

- 2026-06-14/15 (Adhika Jyeshtha Amavasya — case 2 above)
- Likely also: any other Amavasya whose NM is between local-noon and midnight

The non-Adhika Amavasyas in 2026 (verified by the audit) all happen to fall at times where engine and Drik agree, hence the audit's 19/22 pass rate. The Adhika lunation is the canary because its boundary cases compound: 05-17 kshaya + 06-15 terminal Amavasya + 06-30 cascade.

## Proposed fix (NOT in scope for Phase 1 — separate PR)

Rewrite `panchangDayForJD` to use tithi-at-sunrise attribution. Pseudocode:

```ts
function panchangDayForTithiEvent(jd: number, lat: number, lon: number, timezone: string): string {
  // Walk forward from the NM/Purnima JD: find the first sunrise where
  // the tithi at that sunrise has the NM/Purnima tithi number.
  // For a NM, that's the first sunrise where elongation is in [0, 12) degrees.
  // Typically jd → jd+1 (rarely +2 in kshaya cases).
  for (let offset = 0; offset <= 2; offset++) {
    const probe = jd + offset;
    const { year, month, day } = jdToGregorianUTC(probe);
    const srUT = sunriseUTHoursOr(dateToJD(year, month, day, 12), lat, lon, 0, 6).value;
    const srJd = dateToJD(year, month, day, srUT);
    if (srJd >= jd) {  // sunrise after the event
      // Check the tithi at this sunrise has the expected tithi number
      // (Amavasya for NM = tithi 30; Purnima = tithi 15)
      // If yes, return this day; if not, the next day.
      // ...
    }
  }
}
```

Cascading consumers that need to be re-audited after the fix:
- `computeHinduMonths` `endDate` (affects `/calendars/masa` display)
- `computePurnimantMonths` boundary handling
- `computePurnimantMonthsWithAdhikaSandwich` filling/top/bottom boundaries
- `getLunarMasaForDate` + `getPurnimantMasaForDate` lookup tests (3 currently-skipped cases will re-activate)
- Sankalpa Sanskrit text (uses lunarMasa via PR #432)
- Festival generator boundary matches (`Lesson ZC` was sensitive to this)
- Muhurta engine context-builder + classical-checks `isAdhikaMasa`
- Tithi-table tithi attribution

Effort estimate: 1-2 day focused PR with a 50-100 case Drik parametric test suite spanning multiple years. Required Drik reference dates ~30 NMs across 2025-2027 to cover all noon-to-midnight NM scenarios.

## Related

- PR #432 (`fix(panchang): close Amavasya gap in getLunarMasaForDate`) — fixed the strict-`<` containment gap that previously masked these attribution cases as `null` lookups
- `docs/tech-debt/duplicate-logic-audit-2026-06-05.md` — Phase-1 audit that surfaced this via cross-source verification
- `src/lib/__tests__/audit-phase1-cross-source.test.ts` — 3 `it.skip('TODO panchang-day-attribution …')` tests will turn green when this is fixed
