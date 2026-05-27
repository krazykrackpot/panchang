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

### 18. Pushkar Navamsha — caesarean tool uses a different doctrine than canonical
**Filed 2026-05-27 during deep-audit (PR #254).**

Two divergent tables for the same Jyotish concept:
- **Canonical:** `src/lib/constants/pushkar-bhaga.ts` → `PUSHKAR_NAVAMSHA_SET` — 24 positions, 2 per every sign, follows Saravali Ch.5 / Jataka Parijata as cited by BV Raman + KS Charak. Locked by `src/lib/constants/__tests__/pushkar-bhaga.test.ts`.
- **Caesarean:** `src/lib/caesarean/constants.ts` → `PUSHKAR_NAVAMSHA_RANGES` — 19 entries in degree-range form (some signs have 1 Pushkar, not 2). Comment cites the same source but the position set materially differs.

**Spot-check of divergence (Aries):**
- Canonical: navamshas 1 (0–3.333°) and 5 (13.333–16.667°) — keys 0 and 4 in the encoded SET
- Caesarean: 20–23.333° only (navamsha 7) — NOT in canonical

**Why not a pure refactor:** caesarean muhurta scoring (`src/lib/caesarean/scorer.ts:567`) is tuned to the current ranges. Swapping in the canonical set would change every caesarean recommendation produced so far. The fix needs (a) a scholarly decision on which Pushkar tradition the caesarean tool should follow (it's a niche India-only Kerala-tradition tool, so the current convention may be intentional), and (b) regression scoring against historical caesarean recommendations.

**Suggested resolution:** confirm with reference texts. Pushkar Navamsha is most thoroughly described in Kerala Jyotish / Ashtamangala traditions for caesarean timing — those may be the actual source of the current table, not Saravali. If yes, rename `PUSHKAR_NAVAMSHA_RANGES` → `KERALA_PUSHKAR_NAVAMSHA_RANGES` and update the source comment. If no, migrate to canonical with a focused caesarean regression test.

**Why MEDIUM, not HIGH:** caesarean scoring is internally consistent with its own table; no user-visible bug today. But two definitions of "Pushkar Navamsha" in the codebase is a Lesson Z violation by construction (a future reader edits the canonical, expects caesarean to track, and finds it doesn't).

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

## Prevention

All new code MUST import constants from canonical files:
- Dignities: `src/lib/constants/dignities.ts`
- Planet data: `src/lib/constants/grahas.ts`
- Nakshatra data: `src/lib/constants/nakshatras.ts`
- Rashi data: `src/lib/constants/rashis.ts`
- Inauspicious period orders: consolidate into one file

See CLAUDE.md rule Q: "Constants that appear in multiple files must live in one shared file."
