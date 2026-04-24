# Application Audit Round 2 — TODO

**Date:** 2026-04-24
**Focus:** Edge cases, data integrity, cross-feature interactions, numerical precision

---

## CRITICAL (3)

### R2-C1. `addYears()` drops fractional months — dasha dates drift by months
- **File:** `src/lib/kundali/additional-dashas.ts:37-42`
- **Bug:** `Math.floor((years % 1) * 12)` truncates sub-month fractions. 7.3 years = 7y 3m, losing ~18 days. Compounds across 12+ dasha periods.
- **Fix:** Use millisecond-based `new Date(date.getTime() + years * 365.25 * 24 * 60 * 60 * 1000)`

### R2-C2. Muhurta AI hora scoring inverts timezone
- **File:** `src/lib/muhurta/ai-recommender.ts:187`
- **Bug:** `localHour = hourOfDay - tzOffset` — if hourOfDay is already local, this double-converts. For India (+5.5), hora shifts by 11 hours.
- **Fix:** Audit callers, clarify parameter as UT or local, fix the conversion direction.

### R2-C3. Birth date constructed in server timezone, not UT
- **File:** `src/lib/ephem/kundali-calc.ts:760`
- **Bug:** `new Date(year, month-1, day, hour, minute)` uses server runtime timezone (UTC on Vercel). Birth time 10:30 IST becomes 10:30 UTC. All dasha dates shift by birth timezone offset.
- **Fix:** Use `new Date(Date.UTC(year, month-1, day, Math.floor(utHour), Math.round((utHour % 1) * 60)))` where utHour is the UT-converted birth time.

---

## IMPORTANT (5)

### R2-I1. Pushkar Bhaga degree tables differ between files
- **Files:** `kundali-calc.ts:706` vs `ai-recommender.ts:155`
- **Fix:** Verify against Saravali, unify into shared constant.

### R2-I2. Panchaka not checked in Muhurta AI
- **File:** `ai-recommender.ts`
- **Fix:** Add Panchaka detection (Moon in nakshatras 23-27) with -5 penalty.

### R2-I3. Sthira karanas (8-10) not scored in Muhurta AI
- **File:** `ai-recommender.ts:80-86`
- **Fix:** Score Shakuni/Chatushpada/Naga as -3, Kimstughna as +2.

### R2-I4. Binary search can converge on wrong transition during kshaya tithi
- **File:** `panchang-calc.ts:37-79`
- **Fix:** Reduce coarse scan step from 30min to 15min, verify transition target after convergence.

### R2-I5. Weekday formula mismatch between muhurta AI and panchang engine
- **File:** `ai-recommender.ts:246`
- **Fix:** Align JD weekday formula with `Date.getDay()` convention: `(Math.floor(jd + 1.5) % 7 + 1) % 7`.

---

## MINOR (7)

### R2-M1. Night choghadiya UT values can have startUT > endUT (midnight wrap)
### R2-M2. Nadi Dosha cancellation missing additional classical rules
### R2-M3. Vimshottari sub-period end date floating-point drift
### R2-M4. Hora Lagna oblique ascension — already documented, add UI warning
### R2-M5. API /kundali lacks date/time format validation
### R2-M6. Tithi Pravesha converges on tithi START not exact elongation
### R2-M7. `toSidereal()` always uses Lahiri — documented, known limitation
