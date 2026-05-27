# Duplicate Code Audit — 2026-04-28

## Status: Active Tech Debt

13 confirmed instances of duplicate logic across the codebase. Two critical items addressed immediately; remainder tracked here for incremental cleanup.

---

## CRITICAL (Fixed 2026-04-28)

### 1. EXALTATION sign table — 12+ copies
**Consolidated to:** `src/lib/constants/dignities.ts` → `EXALTATION_SIGNS`
All 12+ files now import from this single source.

### 2. Sign lordship table — 10+ copies
**Consolidated to:** `src/lib/constants/dignities.ts` → `SIGN_LORDS`
All files now import from this single source.

---

## HIGH (Address next)

### 3. `calculateRahuKaal` / `computeRahuKaal` — 2 implementations
- `src/lib/ephem/astronomical.ts:495` — `calculateRahuKaal`
- `src/lib/muhurta/inauspicious-periods.ts:25` — `computeRahuKaal`
**Fix:** Remove from `inauspicious-periods.ts`, import from `astronomical.ts`.

### 4. `calculateTithi` — 2 different functions
- `src/lib/panchang/calculator.ts:40` — takes `(sunLon, moonLon)`, returns `TithiInfo`
- `src/lib/ephem/astronomical.ts:306` — takes `(jd)`, returns `{ number, degree }`
**Fix:** Deprecate `panchang/calculator.ts` version; almost all callers use `ephem/astronomical.ts`.

### 5. `calculateYoga` — 2 different functions
- `src/lib/panchang/calculator.ts:102` — takes `(sunLon, moonLon)`
- `src/lib/ephem/astronomical.ts:323` — takes `(jd)`
**Fix:** Same as tithi — deprecate `panchang/calculator.ts`.

### 6. `calculateKarana` — 2 different functions
- `src/lib/panchang/calculator.ts:115` — takes `(sunLon, moonLon)`
- `src/lib/ephem/astronomical.ts:335` — takes `(jd)`
**Fix:** Same as above.

### 7. Hora computation — 2 implementations
- `src/lib/ephem/panchang-calc.ts:305` — `computeHora` (UT-based)
- `src/lib/hora/hora-calculator.ts:108` — `calculateHoras` (string-time-based)
**Fix:** Keep `hora-calculator.ts` as the richer API; have `panchang-calc.ts` call it.

---

## MEDIUM (Incremental cleanup)

### 8. RAHU_ORDER array — 3 copies
- `src/lib/muhurta/ai-recommender.ts:260`
- `src/lib/muhurta/inauspicious-periods.ts:16`
- `src/lib/ephem/astronomical.ts:498`
**Fix:** Move to `src/lib/constants/inauspicious-periods.ts`, import everywhere.

### 9. YAMA_ORDER — 2 copies
- `src/lib/ephem/panchang-calc.ts:915`
- `src/lib/muhurta/inauspicious-periods.ts:17`

### 10. GULIKA_ORDER — 2 copies
- `src/lib/ephem/panchang-calc.ts:924`
- `src/lib/muhurta/inauspicious-periods.ts:18`

### 11. MOOLATRIKONA sign table — 3 copies
- `src/lib/tippanni/varga-deep-analysis.ts:56`
- `src/lib/kundali/vimshopaka.ts:15`
- `src/lib/kundali/shadbala.ts:179`
**Fix:** Add to `src/lib/constants/dignities.ts`, import everywhere.

### 12. `getNakshatraPada` — 2 copies
- `src/lib/ephem/astronomical.ts:296` (exported)
- `src/lib/sky/positions.ts:61` (private local copy)
**Fix:** Delete local copy in `positions.ts`, import from `astronomical.ts`.

---

## LOW (Accepted debt)

### 13. PLANET_NAMES — 40+ local copies
Local `const PLANET_NAMES = [...]` arrays across 40+ files instead of importing from `GRAHAS`.
**Fix:** Incremental — replace when touching each file. Too many files for a bulk replace without risk.

---

---

## RESOLVED — health-diagnosis legacy cleanup (PR #242, 2026-05-27)

### 14. `SIGN_LORDS` — local copy removed from health-prognosis.ts
**Was:** `src/lib/kundali/health-diagnosis/legacy/health-prognosis.ts` had a local 12-entry `SIGN_LORDS` array.
**Fixed:** Removed; now imports `SIGN_LORDS` from `src/lib/constants/dignities.ts`.

### 15. `PLANET_NAME_TO_ID` — local copy removed from health-prognosis.ts
**Was:** Local `PLANET_NAME_TO_ID` record mapping string names to 0-based planet IDs.
**Fixed:** Removed; now imports `PLANET_NAME_TO_ID` from `src/lib/constants/grahas.ts`.

### 16. Legacy files in health-diagnosis/legacy/ — not yet audited
`src/lib/kundali/health-diagnosis/legacy/` contains `constants.ts`, `prakriti.ts`, `body-map.ts`,
`disease-profile.ts`, `health-timeline.ts`, `health-prognosis.ts`. Items 14–15 above were
cleaned. Other constants in these files (e.g. dosha mappings, body-region data) have NOT been
cross-checked against the rest of the codebase. Low risk (legacy path, not imported from new code),
but should be audited before the legacy layer is promoted or merged.

### 17. Local `PLANET_NAMES` in health-diagnosis components — intentionally kept
`src/components/medical/HealthElementGrid.tsx` and `src/app/[locale]/medical-astrology/page.tsx`
contain local bilingual display maps (e.g. `RATING_LABEL: Record<Rating, LocaleText>`). These are
NOT duplicates of the canonical planet-id maps in `grahas.ts` — they map `Rating` enum values to
display strings, which is component-local UI logic. No action needed.

---

## RESOLVED — caesarean Pushkar Navamsha unification (PR #__pending__, 2026-05-27)

### 18. `PUSHKAR_NAVAMSHA_RANGES` — removed from caesarean/constants.ts
**Was:** `src/lib/caesarean/constants.ts:145` defined a 19-entry degree-range table
that materially diverged from the canonical 24-entry `PUSHKAR_NAVAMSHA_SET` in
`src/lib/constants/pushkar-bhaga.ts`. Only Libra agreed between the two; the
remaining 11 signs claimed different navamsha positions as Pushkar. The caesarean
table's pattern was irregular (movable signs with 1 or 2 entries, dual signs with
1, fixed signs with 2) and did not match BV Raman / KS Charak / Saravali Ch.5.
Both files claimed the same source — caesarean's was a transcription error, not
a different tradition.

**Why not flagged as a correctness bug:** only one consumer
(`scoreLagnaPillar` in `src/lib/caesarean/scorer.ts`) used the table, awarding +3
to the lagna pillar (out of 30) when the ascendant fell in a Pushkar Navamsha.
The score is clamped 0-30 per pillar, so the maximum behavioral swing for any
candidate birth moment was ±3/30 to one pillar.

**Fixed:**
- Added `isInPushkarNavamsha(sign, degInSign)` helper to
  `@/lib/constants/pushkar-bhaga.ts` derived from the canonical SET.
- Caesarean scorer now imports and uses the canonical helper; the local
  `isInPushkarNavamsha` function in `scorer.ts` deleted.
- `PUSHKAR_NAVAMSHA_RANGES` deleted from `caesarean/constants.ts`.
- Added `src/lib/caesarean/__tests__/pushkar-unification.test.ts` (16 tests) that
  locks the migration: positions canonical considers Pushkar stay Pushkar;
  positions OLD caesarean incorrectly classified are now correctly excluded;
  positions canonical newly includes are correctly Pushkar.

---

## Prevention

All new code MUST import constants from canonical files:
- Dignities: `src/lib/constants/dignities.ts`
- Planet data: `src/lib/constants/grahas.ts`
- Nakshatra data: `src/lib/constants/nakshatras.ts`
- Rashi data: `src/lib/constants/rashis.ts`
- Inauspicious period orders: consolidate into one file

See CLAUDE.md rule Q: "Constants that appear in multiple files must live in one shared file."
