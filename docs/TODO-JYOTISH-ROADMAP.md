# Jyotish Implementation Roadmap

**Created:** 2026-04-22
**Context:** Follow-up from 4-round audit + 4 gap feature implementations

---

## Completed (This Session)

- [x] 4-round Jyotish audit (~41 bugs fixed)
- [x] Ashtakavarga Shodhana (Trikona + Ekadhipatya + Pinda + UI)
- [x] Mangal Dosha unified engine (7 cancellation rules + 3 consumers)
- [x] Nadi Dosha extended (5 cancellation rules including N4 same-pada override)
- [x] Gulika/Mandi upagraha computation
- [x] Gochara framework (Vedha + Double Transit + BAV quality + TransitRadar UI)

---

## High Value (User-Facing Improvements)

### H1: Switch transit components from raw SAV to reduced SAV
**Effort:** Small (change `savTable` → `reducedSavTable` references in 5 components)
**Impact:** All transit quality ratings become more accurate after Shodhana
**Files:** `TransitCountdown.tsx`, `PersonalizedHoroscope.tsx`, `TransitForecastWidget.tsx`, `LifeTimeline.tsx`, `personal-transits.ts`
**Status:** TODO

### H2: Integrate Gochara engine into dashboard transits page
**Effort:** Medium
**Impact:** Users see Vedha status, Double Transit markers on their main transit dashboard
**Files:** `src/app/[locale]/dashboard/transits/page.tsx` — replace old `computeGochar` with new `analyzeGochara` + `analyzeDoubleTransit`
**Status:** TODO

### H3: Dasha Sandhi (junction period warnings)
**Effort:** Small
**Impact:** Highlight turbulent transition periods between Maha Dasha lords (6-12 months around changeover)
**Source:** BPHS, Phaladeepika
**Files:** New module `src/lib/kundali/dasha-sandhi.ts` + display on kundali page Dasha tab
**Status:** TODO

### H4: Rajju Dosha (South Indian matching)
**Effort:** Medium
**Impact:** Tamil/South Indian users expect Rajju compatibility in addition to Ashta Kuta
**Source:** Tamil Jyotish tradition — 5 Rajju categories (Pada/Kati/Nabhi/Kantha/Shiro)
**Files:** New module + matching page extension
**Status:** TODO

---

## Medium Value (Correctness Improvements)

### M1: Partial aspect strengths in Shadbala Drik Bala
**Effort:** Small
**Impact:** More precise Shadbala scores — currently all aspects treated as full strength
**Source:** BPHS Ch.26 — 3rd/10th=1/4, 4th/8th=3/4, 5th/9th=1/2, 7th=full (with planet-specific overrides)
**Files:** `src/lib/kundali/shadbala.ts` (Drik Bala section)
**Status:** TODO

### M2: D60 Shashtiamsha proper lookup table
**Effort:** Medium (720-entry table from BPHS Ch.6)
**Impact:** D60 carries highest Vimshopaka weight (4.0 of 20) — currently uses simple cyclic formula
**Files:** `src/lib/ephem/kundali-calc.ts` (divisional chart computation)
**Status:** TODO

### M3: Night-time Gulika for births after sunset
**Effort:** Small
**Impact:** Correct Gulika/Mandi for ~30% of births (current impl uses day segments only)
**Source:** BPHS Ch.25 — night segments have different Saturn ordering
**Files:** `src/lib/ephem/kundali-calc.ts` (Gulika block)
**Status:** TODO

### M4: Delta T (TT-UT) correction
**Effort:** Small
**Impact:** ~69 seconds error at current epoch, growing. Affects Moon position by ~0.5 arcmin. Critical for historical charts.
**Source:** Meeus Ch.10
**Files:** `src/lib/ephem/astronomical.ts`
**Status:** TODO

---

## Lower Priority (Nice-to-Have)

### L1: Rashi Drishti (Jaimini sign aspects) as standalone display
**Effort:** Small
**Source:** Jaimini Sutras — movable↔fixed, dual↔dual aspect rules
**Status:** TODO

### L2: Kakshya sub-transit timing
**Effort:** Medium
**Dependency:** Ashtakavarga Shodhana (done)
**Source:** BPHS Ch.70 — 8 sub-divisions within each sign
**Status:** TODO

### L3: Transit-to-natal aspect analysis
**Effort:** Medium
**Impact:** Transiting Saturn conjunct natal Moon, etc. — beyond house placement
**Status:** TODO

### L4: Ashtakavarga learn page with Shodhana examples
**Effort:** Small
**Impact:** Educational enhancement
**Status:** TODO

### L5: Age-based Mangal Dosha reduction (>28 years)
**Effort:** Small
**Source:** Various commentaries — Mars matures after 28
**Dependency:** Requires birth date context in the engine
**Status:** TODO

### L6: Ashtakavarga-based Dasha predictions (BPHS Ch.70)
**Effort:** Medium
**Dependency:** Shodhana (done) + Dasha display
**Status:** TODO

### L7: Sarvashtakavarga Shodhana (apply reductions to SAV row itself)
**Effort:** Small
**Source:** Some texts prescribe this as additional step; JHora does not by default
**Status:** TODO

### L8: Export/print BAV grid as PDF
**Effort:** Small
**Dependency:** UI grid (done)
**Status:** TODO

---

## Notes

- Items are ordered by priority within each tier
- "Small" = 1-2 files, <100 lines. "Medium" = 3+ files or >200 lines.
- Each item should go through: spec → plan → implement → test → verify cycle
- All items should maintain the 4 gates: tsc, vitest, next build, browser verify
