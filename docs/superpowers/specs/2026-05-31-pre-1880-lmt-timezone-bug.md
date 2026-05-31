# Pre-1880 LMT Timezone Bug — Engine Spec

**Date:** 2026-05-31
**Status:** Open — also blocking PR #317 per user directive.
**Discovered during:** Einstein birth-time verification (Item C cross-check session).

---

## 1. The bug

For birth dates before zone-time was standardised at the birth location, our engine resolves the user's `timezone` string via IANA tzdb and gets the **wrong Local Mean Time**. The error is the longitude difference between the IANA zone's reference meridian and the actual birth longitude, divided by 15° / hr.

For historical charts this is a real correctness defect: the ascendant degree shifts by `(lng_birth - lng_zone_reference) × 4 minutes/°` worth of UT offset, which can be tens of minutes for charts in countries spanning multiple degrees of longitude.

## 2. The Einstein worked example

| Source | Birth | UT equivalent | Notes |
|---|---|---|---|
| **Astro-Databank (Rodden AA, canonical)** | 1879-03-14 11:30 LMT Ulm (lng 9.99°E) | 10:50 UT | UT offset = +0:40 from LMT |
| **Our engine** with `timezone: 'Europe/Berlin'` | 1879-03-14 11:30 Europe/Berlin | ~10:37 UT | IANA Europe/Berlin pre-1893 = Berlin LMT (lng 13.4°E, +0:53) |
| **Δ** | | **13 min UT earlier** | = ~3.25° ascendant shift |

The `Europe/Berlin` IANA zone reference meridian is Berlin (13.4°E), not Ulm (9.99°E). The 3.4° longitude difference becomes a 13-minute UT discrepancy.

## 3. Impact assessment

### When this matters

- Any chart with birth date **before standardised time was adopted at that location**:
  - Germany: before 1893-04-01 (then Central European Time)
  - UK: before 1880-08-02 (then GMT)
  - USA: before 1883-11-18 (then ST zones)
  - India: before 1906-01-01 (then IST)
  - Australia: varies by state, 1895-1899
  - Most other countries: late 19th to early 20th century

- Magnitude: error = `(lng_actual - lng_zone_reference) × 4 min/°`
  - Worst case is a chart near the timezone boundary in a wide country (e.g. someone born in Spain (~3°W) but using Europe/Madrid (Madrid is ~3.7°W) — small. But Russia is huge.)
  - Typical: 0-20 min UT error → 0-5° ascendant shift, sub-degree planetary positions.

### When this doesn't matter

- Any chart with birth date **after standardisation** at that location (the vast majority — 99% of users).
- Charts where the user-supplied `timezone` string already corresponds to a zone that uses the birth longitude as reference (rare, but happens for charts very close to the IANA zone's reference meridian).

### Concrete blast radius

Our user base is mostly post-1950 charts (modern people). Per-chart, the bug typically does not change which sign any planet is in. It DOES change:
- Ascendant degree by 0-5°
- Whole-sign house placement for planets at sign boundaries (rare but possible)
- Dasha start dates by minutes-to-hours (cascading over 120 years can shift dasha boundaries by ~1 day)
- Per-degree-sensitive computations (Moolatrikona inclusion, navamsha sign at sign boundaries)

For our active user base this is mostly invisible. For historical-chart enthusiasts and case studies (e.g. anyone running famous-person charts for Jyotish analysis), this is a real defect.

## 4. The fix

For any date pre-standardisation at the birth location:
- Compute UT offset as `lng / 15` (hours), regardless of the user's `timezone` string.
- Use this LMT offset to convert the user's local time → UT for ephemeris calculations.

For post-standardisation dates:
- Continue using IANA tzdb resolution.

The standardisation cutoffs are well-known and stable. A lookup table by country / region keyed off `lat, lng` is feasible. Alternatively, just always use longitude-based LMT for **any date before, say, 1925** (a conservative cutoff covering all locations) — accepting that this gives slightly wrong results for the small minority of charts where the IANA zone already used the birth longitude as reference.

## 5. What needs to happen

1. **Audit** the engine: where in `kundali-calc.ts` is the timezone → UT conversion done? Identify the single function to patch.
2. **Decide** whether to use a per-region cutoff lookup or a blanket pre-1925 LMT fallback.
3. **Implement** longitude-based LMT for affected dates.
4. **Test:**
   - Anchor Einstein (UT 10:50) and verify ascendant matches Astro-Databank's published value (Gemini, ~7°19' tropical / ~16°48' sidereal Lahiri).
   - Regression test 5 pre-1900 charts vs Astro-Databank Rodden-AA reference values.
   - Verify post-1925 charts are unaffected (no regression on modern test fixtures).
5. **Re-run** PR-J's Einstein + Clinton Shadbala cross-checks with the fixed UT. Some of the residual divergence vs Lagna360 may resolve (or may not, if Lagna360 also has the bug — both could be wrong in the same way).

## 6. Acceptance criteria

- [ ] Engine produces UT 10:50 for Einstein 1879-03-14 11:30 in Ulm (lng 9.99°E)
- [ ] Engine produces unchanged UT for any test chart with `date > 1925-01-01`
- [ ] 5 pre-1900 reference charts produce ascendants within ±10' of Astro-Databank canonical values
- [ ] Existing kundali test suite passes (no regression on modern fixtures)
- [ ] PR-J Shadbala cross-check rerun and documented

## 7. Why this blocks PR #317

The Einstein cross-check in PR #317 was done with the buggy UT (13 minutes off). Even though sub-degree planetary positions matched Lagna360 (because Lagna360 likely uses the same buggy convention), the comparison would be more rigorous with corrected UT. Per user directive: "we will not merge till we have good fix covering all aspects" — fixing the LMT bug first lets us re-baseline the Shadbala numerical anchor against the *correct* chart, not the chart-that-matches-Lagna360's-same-bug.

## 8. References

- Astro-Databank canonical Einstein record: https://www.astro.com/astro-databank/Einstein,_Albert
- IANA tzdb pre-standardisation handling: https://data.iana.org/time-zones/theory.html
- Related: `docs/superpowers/specs/2026-05-31-shadbala-mercury-moon-calibration-bug.md`
- Related: `docs/superpowers/specs/2026-05-31-gemini-implementation-audit-response.md`
- PR #317 (blocked): https://github.com/krazykrackpot/panchang/pull/317
