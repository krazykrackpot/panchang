# Feature Spec 12: Yogini Dasha System

**Tier:** 3 — Deep classical
**Priority:** Deferred (not in custom priority list)
**Status:** Spec Complete

---

## What It Does

Implements the Yogini Dasha — a simpler 36-year cycle using 8 "Yogini" energies mapped to planets. Known for accurate short-term predictions, especially for events within 3-5 years. Already partially typed in `KundaliData` as `yoginiDashas?`.

## Why It Matters

- **Shorter cycle = more actionable:** 36-year cycle means periods are shorter and predictions more immediate.
- **Complementary:** used alongside Vimshottari for confirmation — if both agree on timing, confidence is higher.
- **Simple computation:** well-defined algorithm, minimal effort to implement.

---

## Yogini Periods (Total: 36 years)

| Yogini | Planet | Years | Starting Nakshatra |
|--------|--------|-------|--------------------|
| Mangala | Moon | 1 | Ashwini, Magha, Moola |
| Pingala | Sun | 2 | Bharani, P.Phalguni, P.Ashadha |
| Dhanya | Jupiter | 3 | Krittika, U.Phalguni, U.Ashadha |
| Bhramari | Mars | 4 | Rohini, Hasta, Shravana |
| Bhadrika | Mercury | 5 | Mrigashira, Chitra, Dhanishta |
| Ulka | Saturn | 6 | Ardra, Swati, Shatabhisha |
| Siddha | Venus | 7 | Punarvasu, Vishakha, P.Bhadrapada |
| Sankata | Rahu | 8 | Pushya, Anuradha, U.Bhadrapada |

## Engine: `src/lib/kundali/yogini-dasha.ts` (NEW)

Same pattern as other dasha engines. Maha + Antar levels. Starting Yogini determined by Moon's nakshatra at birth.

## UI: Additional toggle on Dashas tab alongside Vimshottari and Ashtottari.

## Learning Page: `/learn/dashas/yogini`

## Effort: ~1.5 days
