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

## Prevention

All new code MUST import constants from canonical files:
- Dignities: `src/lib/constants/dignities.ts`
- Planet data: `src/lib/constants/grahas.ts`
- Nakshatra data: `src/lib/constants/nakshatras.ts`
- Rashi data: `src/lib/constants/rashis.ts`
- Inauspicious period orders: consolidate into one file

See CLAUDE.md rule Q: "Constants that appear in multiple files must live in one shared file."
