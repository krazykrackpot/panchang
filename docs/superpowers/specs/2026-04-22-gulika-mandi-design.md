# Gulika & Mandi Calculation — Design Spec

**Date:** 2026-04-22
**Status:** Draft
**Scope:** Compute Gulika and Mandi natal longitudes + add to upagraha display

---

## 1. Problem

The app computes Gulika Kaal (the time window) for the daily panchang but does NOT compute the natal Gulika/Mandi longitude — the ecliptic degree that Gulika occupies in the birth chart. This is a fundamental upagraha used in:
- Natal analysis (Gulika's house indicates karmic suffering area)
- Muhurta (avoid starting activities when Gulika is angular)
- Prashna (Gulika position is diagnostic)

## 2. Solution

### 2.1 Gulika Longitude (BPHS Ch.25)

**Algorithm:**
1. Find the weekday of birth
2. Look up which 1/8th segment of the day belongs to Saturn (that's the Gulika Kaal segment). Order: Sun=7, Mon=6, Tue=5, Wed=4, Thu=3, Fri=2, Sat=1.
3. Compute the JD at the START of that segment: `jdGulikaStart = jdSunrise + (segment - 1) * dayDuration / 8`
4. Compute the ascendant (rising degree) at `jdGulikaStart` using the existing `calculateAscendant(jd, lat, lng)` function
5. Convert to sidereal: `gulikaLong = tropicalAsc - ayanamsha`
6. That sidereal longitude IS Gulika's position

### 2.2 Mandi Longitude

Some texts treat Mandi as identical to Gulika. Others use the MIDPOINT of the segment instead of the start. We follow the Parashara tradition where Mandi = Gulika (same longitude). If distinguished, Mandi uses the midpoint:
- `jdMandiMid = jdSunrise + (segment - 0.5) * dayDuration / 8`

We compute both and let the UI display them. For most charts they'll be within a few degrees of each other.

### 2.3 Integration

Add Gulika and Mandi as two new entries in the `upagrahas` array of `KundaliData`. The existing upagraha UI page and graha tab already display this array — no UI changes needed beyond the data flowing through.

## 3. Architecture

### 3.1 Changes to `src/lib/ephem/kundali-calc.ts`

After the existing 5 upagraha computations (Dhuma through Upaketu), add Gulika and Mandi:

```typescript
// Gulika: ascendant at start of Saturn's segment
const birthDate = new Date(year, month - 1, day);
const weekday = birthDate.getDay();
const gulikaSegments = [7, 6, 5, 4, 3, 2, 1]; // Sun-Sat
const segment = gulikaSegments[weekday];
const dayDuration = sunsetUT - sunriseUT;
const gulikaStartUT = sunriseUT + (segment - 1) * dayDuration / 8;
const jdGulikaStart = dateToJD(year, month, day, gulikaStartUT);
const gulikaAscTropical = calculateAscendant(jdGulikaStart, lat, lng);
const gulikaLong = normalizeDeg(gulikaAscTropical - ayanamshaValue);

// Mandi: ascendant at midpoint of Saturn's segment
const mandiMidUT = sunriseUT + (segment - 0.5) * dayDuration / 8;
const jdMandiMid = dateToJD(year, month, day, mandiMidUT);
const mandiAscTropical = calculateAscendant(jdMandiMid, lat, lng);
const mandiLong = normalizeDeg(mandiAscTropical - ayanamshaValue);
```

Push both to the existing `upagrahas` array as `UpagrahaPosition` objects.

### 3.2 No new files needed

This is a ~20-line addition to the existing upagraha block in `kundali-calc.ts`. No new module.

### 3.3 No UI changes needed

The existing upagraha display (`src/app/[locale]/upagraha/page.tsx` and the Graha tab on the kundali page) iterates over `kundali.upagrahas` and renders each entry. Gulika and Mandi will appear automatically.

## 4. Testing

### Unit test: `src/lib/__tests__/gulika-mandi.test.ts`

- Generate a kundali for a known birth data
- Verify `upagrahas` array contains entries named "Gulika" and "Mandi"
- Verify both have valid longitudes (0-360)
- Verify both have valid signs (1-12)
- Verify Gulika and Mandi are within ~15° of each other (same segment, start vs mid)
- Verify Gulika is NOT identical to any of the 5 existing upagrahas

## 5. Files Changed

| File | Change |
|------|--------|
| `src/lib/ephem/kundali-calc.ts` | MODIFY — Add Gulika/Mandi computation after existing upagrahas |
| `src/lib/__tests__/gulika-mandi.test.ts` | NEW — Verification tests |

## 6. Deferred

| # | Item | Rationale |
|---|------|-----------|
| D1 | Gulika house interpretation text | Content/editorial, not computation |
| D2 | Gulika in Prashna charts | Requires Prashna engine integration |
| D3 | Night-time Gulika (for night births) | BPHS describes night segments separately. Current impl uses day segments. Night births with Gulika Kaal after sunset need the night formula. |

## 7. Success Criteria

1. `generateKundali()` returns Gulika and Mandi in upagrahas array
2. Longitudes are astronomically valid (computed from ascendant at Gulika Kaal start/mid)
3. Existing upagraha UI displays them without code changes
4. All tests pass, build succeeds
