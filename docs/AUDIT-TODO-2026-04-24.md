# Application Audit — TODO

**Date:** 2026-04-24
**Trigger:** Purnimant month boundary bug (fixed -15 day approximation)
**Status:** All issues documented, awaiting sequential execution

---

## CRITICAL (5) — Wrong data visible to users NOW

### C1. Abhijit Muhurta shown as auspicious on Wednesdays
- **File:** `src/app/[locale]/panchang/PanchangClient.tsx:1008-1018`
- **Bug:** The computation engine correctly sets `abhijitMuhurta.available = false` on Wednesdays (panchang-calc.ts:986), but the UI unconditionally renders Abhijit in the "Auspicious Timings" section with gold borders and "Most auspicious" text. No check for `available` flag.
- **Impact:** Wrong muhurta advice every Wednesday for all users.
- **Fix:** Wrap the Abhijit card rendering in `panchang.abhijitMuhurta.available !== false`. On Wednesdays, either hide it or show with inauspicious styling + note.
- **Verify:** Load panchang for a Wednesday, confirm Abhijit is NOT shown as auspicious. Cross-check with Prokerala.

### C2. `nextName[locale]` crashes on Tamil/Bengali
- **File:** `src/app/[locale]/panchang/PanchangClient.tsx:762, 798`
- **Bug:** Yoga and karana transition "Then X" labels use `panchang.yogaTransition.nextName[locale]` — directly indexing LocaleText with locale string. For Tamil (`ta`), Bengali (`bn`), returns `undefined`.
- **Impact:** Blank text or React crash for Tamil/Bengali users on panchang page.
- **Fix:** Replace with the component-local `tl()` helper: `tl(panchang.yogaTransition.nextName)`.
- **Verify:** Switch to Tamil locale, check yoga/karana transition text renders correctly.

### C3. Karana transition start time uses wrong wrapping logic
- **File:** `src/lib/ephem/panchang-calc.ts:1064-1068`
- **Bug:** `computeTransition` is called with `wrapMax: 11` for karana. The "previous value" is computed as `currentValue === 1 ? wrapMax : currentValue - 1`. But the karana cycle is NOT a simple 1-11 linear sequence — it repeats as `[11, 1,2,3,4,5,6,7, 1,2,3,4,5,6,7, ... 8,9,10]` within each tithi pair. The simple decrement can match the wrong occurrence and produce an incorrect start time.
- **Impact:** Karana start times can be wrong, especially near the cycle transition points.
- **Fix:** For karana start-time, scan backward from sunrise until `getter(jd) !== currentValue` and binary-search the transition point. Don't rely on `prevValue` wrapping.
- **Verify:** Compare karana start/end times with Prokerala for 5+ dates including dates near Amavasya (where karanas 8,9,10,11 occur).

### C4. TodayPanchangWidget direct `[locale]` access — no fallback for Tamil/Bengali
- **File:** `src/components/panchang/TodayPanchangWidget.tsx:212-216`
- **Bug:** All panchang element values use `panchang.tithi.name[locale]`, `panchang.nakshatra.deity[locale]`, `panchang.yoga.meaning[locale]` with no fallback. For locales missing keys, renders `undefined`.
- **Impact:** Broken display on home page for Tamil/Bengali users.
- **Fix:** Use `tl()` helper or `|| obj.en` pattern consistently.
- **Verify:** Switch to Tamil/Bengali, check home page panchang widget renders all values.

### C5. Polar sunrise fallback returns hardcoded 6:00/18:00
- **File:** `src/lib/ephem/astronomical.ts:325-326`
- **Bug:** When `cosH > 1 || cosH < -1` (polar regions where Sun doesn't rise/set), returns hardcoded `6` (6 AM) or `18` (6 PM). All downstream calculations (Rahu Kaal, Choghadiya, Muhurta, Brahma Muhurta) are wrong for locations above ~65° latitude.
- **Impact:** Wrong panchang data for users in Scandinavia, Iceland, northern Russia, etc.
- **Fix:** Return `null` or sentinel value, have callers handle gracefully (show "Sun does not rise/set at this latitude" instead of fake times).
- **Verify:** Test with Reykjavik (64.1°N) and Tromso (69.6°N) during summer/winter.

---

## IMPORTANT (15) — Edge cases or accuracy problems

### I1. Midnight-crossing bug — NOW badge never shows for night slots
- **File:** `src/app/[locale]/panchang/PanchangClient.tsx:1954, 297-311, 847-851`
- **Bug:** Three separate instances where time comparison `nowMin >= start && nowMin < end` fails when a slot crosses midnight (e.g., 23:30 to 01:15 → start=1410, end=75). The condition is always false.
- **Impact:** No "NOW" badge on night choghadiya, hora, or muhurta slots after midnight. Users can't see which slot is currently active.
- **Fix:** Add midnight-wrap handling: `if (end < start) return nowMin >= start || nowMin < end;`
- **Verify:** Check panchang page at 00:30 AM — should show NOW badge on the active night slot.

### I2. Vikram/Shaka Samvat uses fixed April cutoff
- **File:** `src/lib/ephem/panchang-calc.ts:1112-1114`
- **Bug:** `(month >= 4) ? year + 57 : year + 56` uses April as the Vikram Samvat new year boundary. The actual boundary is Chaitra Shukla Pratipada, which varies between mid-March and mid-April.
- **Impact:** Wrong Samvat number displayed for ~2-4 weeks each year around March-April.
- **Fix:** Compute actual Chaitra Shukla Pratipada date and compare against it.
- **Verify:** Check Samvat display for dates in March 20-April 15 range against Prokerala.

### I3. Yoga calculation hardcodes Lahiri ayanamsha
- **File:** `src/lib/ephem/astronomical.ts:289-293`
- **Bug:** `calculateYoga()` uses `toSidereal()` which always uses `lahiriAyanamsha()`. Users who select KP or Raman ayanamsha get yoga computed with Lahiri.
- **Impact:** Wrong yoga near boundaries for non-Lahiri users.
- **Fix:** Pass ayanamsha value as parameter to `calculateYoga()`.
- **Verify:** Compare yoga for a boundary case with KP ayanamsha against KP reference.

### I4. Mean Rahu/Ketu instead of True node
- **File:** `src/lib/ephem/astronomical.ts:549`
- **Bug:** `rahu = 125.044 - 1934.1362 * t` is the MEAN lunar node. True node oscillates around mean by ~1.5°. Most Vedic astrologers use true node.
- **Impact:** Rahu/Ketu can be in wrong nakshatra near boundaries (~1.5° error).
- **Fix:** Add principal nutation correction: `rahu_true = rahu_mean - 1.4979 * sin(omega)`.
- **Verify:** Compare Rahu position with Prokerala/Swiss Ephemeris for 5 dates.

### I5. Zero planet latitudes in Meeus fallback
- **File:** `src/lib/ephem/astronomical.ts:476-477`
- **Bug:** When Swiss Ephemeris is unavailable, all planets get `latitude: 0`. This breaks Graha Yuddha (planetary war) which uses latitude to determine winner.
- **Impact:** Graha Yuddha results are random for Meeus users.
- **Fix:** Either compute approximate latitudes from Meeus Tables 47.B, or skip Graha Yuddha when Swiss Eph is unavailable with a documented warning.
- **Verify:** Check kundali graha yuddha section with Meeus fallback.

### I6. Meeus outer planet positions off by 1-3 degrees
- **File:** `src/lib/ephem/astronomical.ts:496-522`
- **Bug:** Simplified 2-term orbital elements for outer planets. Can be off by 1-3° for Jupiter/Saturn and up to 5° for Mercury near greatest elongation.
- **Impact:** Sidereal positions (rashi, nakshatra) can be wrong by 1 nakshatra for slower planets.
- **Fix:** Add more series terms from Meeus Ch.31-36, or document accuracy limits. At minimum, add a `warnings` field when using Meeus path.
- **Verify:** Compare Mercury, Jupiter, Saturn positions with Swiss Eph for 5 dates.

### I7. Hora Lagna uses fixed 15 degrees/hour
- **File:** `src/lib/kundali/special-lagnas.ts:45`
- **Bug:** `horaLagnaDeg = sunDeg + hoursFromSunrise * (360/24)` assumes uniform 15°/hour rotation. At higher latitudes, signs rise at different speeds (oblique ascension). For Switzerland (~46°N), error can be 10-20°.
- **Impact:** Wrong Hora Lagna for non-equatorial locations.
- **Fix:** Use actual sidereal time / ascendant calculation for the Hora Lagna moment.
- **Verify:** Compare Hora Lagna for a birth in Corseaux with JHora or similar software.

### I8. Vimshopaka weights sum to 21, not classical 20
- **File:** `src/lib/kundali/vimshopaka.ts:49-53`
- **Bug:** 19 varga entries with weights summing to 21. BPHS Ch.16 specifies 16 charts (Shodashavarga) with weights summing to 20. Extra D5, D8, D27 entries distort the score.
- **Impact:** Vimshopaka Bala scores are on a slightly different scale than classical.
- **Fix:** Implement the standard Shodashavarga (16 charts, weights = 20) per BPHS, or rename to "extended multi-varga strength."
- **Verify:** Compare Vimshopaka scores with JHora for a test chart.

### I9. New Moon detection has ambiguous elongation folding
- **File:** `src/lib/calendar/hindu-months.ts:55-76`
- **Bug:** Elongation is folded to 0-180° range (`if (elong > 180) elong = 360 - elong`), making New Moon and Full Moon detections ambiguous. The binary search also searches for the 180° crossing instead of the 0° crossing.
- **Impact:** Could misidentify a Full Moon as a New Moon or vice versa, producing wrong Amant month boundaries.
- **Fix:** Use raw 0-360° elongation. Detect New Moon as elongation crossing from ~350° to ~10°. Binary search should refine the 0° crossing.
- **Verify:** Compare computed New Moon dates with astronomical reference for all 12 months of 2026.

### I10. `getMasa()` solar approximation used for lunar calendar display
- **File:** `src/lib/ephem/astronomical.ts:566-574`
- **Bug:** `getMasa()` maps Sun's sidereal sign to a month name — this is solar month assignment used for a lunar calendar. Near Sankranti dates, this can assign the wrong month name.
- **Impact:** Current masa display on daily panchang can be wrong for a few days near Sankranti.
- **Fix:** Use tithi-table-based lunar month assignment instead of this solar approximation.
- **Verify:** Compare masa display with Prokerala for dates near Sun sign transitions.

### I11. Duplicate panchang calculator
- **File:** `src/lib/panchang/calculator.ts`
- **Bug:** A separate, potentially unmaintained panchang calculator exists alongside the primary `src/lib/ephem/panchang-calc.ts`. Could produce slightly different results.
- **Impact:** Maintenance hazard — changes to one aren't reflected in the other.
- **Fix:** Remove or consolidate. If still used, make it a thin wrapper around the primary calculator.
- **Verify:** Grep all imports to confirm which pages use which calculator.

### I12. Multiple direct `[locale]` accesses without fallback
- **File:** `src/app/[locale]/panchang/PanchangClient.tsx:692, 740`
- **Bug:** `panchang.tithi.deity[locale]`, `panchang.nakshatra.nature[locale]`, `panchang.nakshatra.rulerName[locale]` all accessed without `tl()` or `|| .en` fallback.
- **Impact:** `undefined` text visible to Tamil/Bengali users on panchang page.
- **Fix:** Replace all direct `[locale]` accesses with `tl()` helper.
- **Verify:** Search entire PanchangClient.tsx for `[locale]` pattern and fix all instances.

### I13. Purnimant month name uses noon JD instead of actual Full Moon JD
- **File:** `src/lib/calendar/hindu-months.ts` (computePurnimantMonths)
- **Bug:** Sun position for month naming is evaluated at noon on the Full Moon date, not at the actual refined Full Moon moment. Near Sankranti, this could assign the wrong month name.
- **Impact:** Rare — only affects months where Sankranti coincides with Purnima.
- **Fix:** Store the refined Full Moon JD from binary search and use it for Sun position evaluation.
- **Verify:** Check month names for Purnimant months near Sankranti dates.

### I14. Abhijit Muhurta not available check missing in multiple places
- **File:** Various muhurta-related components
- **Bug:** Beyond C1, other pages/components that reference Abhijit Muhurta may also lack the `available` check.
- **Impact:** Consistent Wednesday Abhijit error across the app.
- **Fix:** Grep for all Abhijit references and add `available` check everywhere.
- **Verify:** Full-text search for "abhijit" across the codebase.

### I15. Night muhurta descriptions hardcoded as Hindi for non-Hindi locales
- **File:** `src/app/[locale]/panchang/PanchangClient.tsx:2113-2115`
- **Bug:** Binary `locale === 'en' ? english : hindi` ternary. Tamil/Bengali users see Hindi instead of their language.
- **Impact:** Wrong language for 2 locales on muhurta descriptions.
- **Fix:** Use locale message keys or at minimum check for Tamil/Bengali.
- **Verify:** Switch to Tamil, check muhurta descriptions.

---

## MINOR (8) — Code quality, cosmetic

### M1. Dead simplified Shadbala function
- **File:** `src/lib/ephem/kundali-calc.ts:207-233`
- **Fix:** Remove or mark as deprecated.

### M2. Karana edge case at index 59 (degree exactly 360)
- **File:** `src/lib/ephem/astronomical.ts:300-307`
- **Fix:** Add bounds check: `Math.min(karanaIndex - 57, 2)`.

### M3. Samvatsara formula ignores Chaitra year boundary
- **File:** `src/lib/ephem/astronomical.ts:663-668`
- **Fix:** Accept month parameter for pre-Chaitra dates.

### M4. Godhuli/Sandhya/Nishita use fixed-minute durations
- **File:** `src/lib/ephem/panchang-calc.ts:491-503`
- **Fix:** Use proportional calculations or add comment citing source for fixed durations.

### M5. Mercury classified as always benefic
- **File:** `src/lib/kundali/avasthas.ts:159`
- **Fix:** Add conditional: Mercury is malefic when conjunct malefics.

### M6. Synastry aspects use Western orbs instead of Vedic sign-based aspects
- **File:** `src/lib/comparison/synastry-engine.ts:67-73`
- **Fix:** Label as "Western-style aspects" or implement Vedic sign-based aspects.

### M7. Sagittarius Vashya classification ambiguity
- **File:** `src/lib/matching/ashta-kuta.ts:69`
- **Fix:** Add comment citing source for chosen classification.

### M8. Multiple hardcoded Hindi fallbacks for Tamil/Bengali in PanchangClient
- **File:** `src/app/[locale]/panchang/PanchangClient.tsx` (various)
- **Fix:** Replace `locale === 'en' ? en : hi` ternaries with proper locale handling.

---

## Execution Order

1. C1 → C2 → C4 → I12 → I15 → M8 (locale/display fixes — batch together)
2. C3 (karana transition fix)
3. C5 (polar sunrise)
4. I1 (midnight-crossing NOW badges — 3 instances)
5. I2 (Vikram/Shaka Samvat)
6. I3 (yoga ayanamsha)
7. I4 (true Rahu/Ketu node)
8. I9 (New Moon detection)
9. I10 (getMasa solar approximation)
10. I7 (Hora Lagna)
11. I8 (Vimshopaka weights)
12. I5 + I6 (Meeus accuracy)
13. I11 (duplicate calculator)
14. I13 (Purnimant noon JD)
15. M1-M7 (minor fixes batch)

**After each fix:** `npx vitest run` + `npx tsc --noEmit` + browser verification
