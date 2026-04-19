# Feature Spec 11: Ashtottari Dasha System

**Tier:** 3 — Deep classical
**Priority:** 4th in custom order (after 14, 15, 13)
**Status:** Spec Complete

---

## What It Does

Implements the Ashtottari Dasha system — a 108-year planetary period system that uses only 8 planets (excludes Rahu). Classical texts prescribe it when the Moon is in Krishna Paksha (waning phase) at birth. Displayed as a togglable alternative to Vimshottari on the kundali page.

## Why It Matters

- **Classical completeness:** Parashara describes both Vimshottari (120-year) and Ashtottari (108-year). Offering both makes the app authoritative.
- **Applicability debate:** some authorities use Ashtottari for all charts, not just Krishna Paksha births. Offering it lets users compare.
- **Existing infra:** the `KundaliData` type already has an `ashtottariDashas?` field — it's typed but not computed.

---

## Classical Foundation

**Ashtottari Dasha periods (total: 108 years):**

| Planet | Years | Nakshatra Lord |
|--------|-------|----------------|
| Sun | 6 | Ardra (6) |
| Moon | 15 | Hasta (13) |
| Mars | 8 | Pushya (8) |
| Mercury | 17 | Jyeshtha (18) |
| Saturn | 10 | Anuradha (17) |
| Jupiter | 19 | Moola (19) |
| Rahu | excluded | — |
| Venus | 21 | Purva Ashadha (20) |
| Ketu | 12 | Ashlesha (9) |

**Applicability rule (Parashara):**
- If Moon is in Krishna Paksha (tithi 16-30) at birth → use Ashtottari
- If Moon is in Shukla Paksha → use Vimshottari
- Alternative view (Nadi texts): Ashtottari applicable for all charts

**Computation:**
1. Find Moon's nakshatra at birth
2. Count nakshatras from Ardra in the Ashtottari sequence (6 → 13 → 8 → 18 → 17 → 19 → 20 → 9)
3. Determine balance of first dasha from Moon's position within the nakshatra
4. Generate Maha → Antar → Pratyantar levels using proportional subdivision

## Engine: `src/lib/kundali/ashtottari-dasha.ts` (NEW)

```typescript
interface AshtottariDashaEntry {
  planet: number;           // 0-8 (excluding 7/Rahu)
  planetName: Trilingual;
  years: number;
  startDate: Date;
  endDate: Date;
  subPeriods: AshtottariDashaEntry[];  // Antar level
}

function calculateAshtottariDashas(
  moonNakshatraIndex: number,     // 1-27
  moonDegreeInNakshatra: number,  // 0-13.333°
  birthDate: Date
): AshtottariDashaEntry[];

function isAshtottariApplicable(birthTithi: number): boolean;
```

## UI Integration

- **Kundali Dashas tab:** add toggle "Vimshottari | Ashtottari"
- If Moon was in Krishna Paksha: show note "Ashtottari Dasha is classically prescribed for your chart (Krishna Paksha birth)"
- Same timeline/tree UI as Vimshottari, just different periods

## Learning Page: `/learn/dashas/ashtottari`

Topics: why 108 years (sacred number), when to use Ashtottari vs Vimshottari, the applicability debate, comparing dasha predictions between the two systems, practical interpretation differences.

## Effort: ~2 days
