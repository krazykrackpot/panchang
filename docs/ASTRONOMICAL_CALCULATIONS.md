# Astronomical Calculation Engine — Technical Documentation

**Last updated:** April 2026
**Accuracy benchmark:** Prokerala / Shubh Panchang (primary); Drik Panchang (secondary)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Dual-Path Engine: Swiss Ephemeris + Meeus Fallback](#2-dual-path-engine-swiss-ephemeris--meeus-fallback)
3. [Julian Day Number](#3-julian-day-number)
4. [Sun Position](#4-sun-position)
5. [Moon Position](#5-moon-position)
6. [Sunrise & Sunset](#6-sunrise--sunset)
7. [Moonrise & Moonset](#7-moonrise--moonset)
8. [Ayanamsha (Precession)](#8-ayanamsha-precession)
9. [Panchang Elements](#9-panchang-elements)
10. [Timezone & DST Handling](#10-timezone--dst-handling)
11. [Accuracy Report](#11-accuracy-report)

---

## 1. Architecture Overview

The engine uses **Swiss Ephemeris (sweph@2.10.3) as the primary computation backend**. Meeus polynomial algorithms are the fallback, activated automatically when the sweph native binary fails to load (e.g., unsupported platform or missing binary). See [Section 2](#2-dual-path-engine-swiss-ephemeris--meeus-fallback) for the dual-path design.

```
User Input (date, location, timezone)
    │
    ▼
┌─────────────────────────────────────┐
│  getUTCOffsetForDate()              │  ← IANA timezone → numeric offset
│  (src/lib/utils/timezone.ts)        │    via Intl.DateTimeFormat
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│  computePanchang() / computeKundali()                       │  ← Main orchestrators
│  (src/lib/ephem/panchang-calc.ts / kundali-calc.ts)         │
│                                                             │
│  ┌──────────────────────────────────────────────────┐       │
│  │ isSwissEphAvailable() gate                       │       │
│  │                                                  │       │
│  │  TRUE  → swiss-ephemeris.ts (arcsecond accuracy) │       │
│  │  FALSE → astronomical.ts Meeus fallback          │       │
│  └──────────────────────────────────────────────────┘       │
│                                                             │
│  ┌──────────────────────────┐                               │
│  │ getSunTimes()            │  ← 2-pass sunrise/sunset      │
│  │ (src/lib/astronomy/      │    (sweph or Meeus Ch.15)     │
│  │  sunrise.ts)             │                               │
│  └──────────────────────────┘                               │
│                                                             │
│  ┌──────────────────────────┐                               │
│  │ sunLongitude(jd)         │  ← sweph SE_SUN or Meeus Ch.25│
│  │ moonLongitude(jd)        │  ← sweph SE_MOON or Meeus Ch.47
│  │ (src/lib/ephem/          │                               │
│  │  astronomical.ts)        │                               │
│  └──────────────────────────┘                               │
│                                                             │
│  ┌──────────────────────────┐                               │
│  │ calculateMoonriseUT()    │  ← Iterative horizon-crossing │
│  │ calculateMoonsetUT()     │    with parallax + latitude   │
│  │ (inline in panchang-     │                               │
│  │  calc.ts)                │                               │
│  └──────────────────────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

**Sources:**
- Swiss Ephemeris: Astrodienst AG (Zurich), based on DE431 JPL ephemeris. Sub-arcsecond accuracy.
- Jean Meeus, *Astronomical Algorithms* (2nd ed., 1998). Used as Meeus-fallback. All chapter references below are to this book.

---

## 2. Dual-Path Engine: Swiss Ephemeris + Meeus Fallback

**File:** `src/lib/ephem/swiss-ephemeris.ts`

### Design

Every computation function checks `isSwissEphAvailable()` before executing. This is a lightweight synchronous check that returns `true` if the sweph native module loaded successfully at startup.

```typescript
// Pattern used across all computation functions:
export function sunLongitude(jd: number): number {
  if (isSwissEphAvailable()) {
    return swissPlanetLongitude(jd, SE_SUN).longitude;  // arcsecond accuracy
  }
  return _meesusSunLongitude(jd);                       // Meeus Ch.25 fallback
}
```

### When Each Path Activates

| Condition | Path | Accuracy |
|-----------|------|----------|
| sweph binary loaded (production / Vercel) | Swiss Ephemeris | Sub-arcsecond (0.001°) |
| sweph binary not found (some dev setups) | Meeus polynomial | Varies by planet (see below) |

### Memoization

`swiss-ephemeris.ts` caches results per JD to avoid redundant native calls:
- `swissAllPlanets(jd)` — all 10 bodies computed once and cached by JD
- `swissAyanamsha(jd, type)` — cached per (JD, type) pair
- Cache is in-memory, scoped to the request lifetime (no cross-request leakage on Vercel)

### Meeus Fallback Accuracy Limits

When sweph is unavailable, the following limitations apply. A `KundaliData.warnings[]` entry is added to every chart to notify users.

| Body | Meeus Accuracy | Notes |
|------|---------------|-------|
| Sun | ~0.01° (36") | Very accurate — Meeus Ch.25 nutation correction |
| Moon | ~0.3° (18') | Meeus Ch.47 (60 terms) — sufficient for tithi, not occultations |
| Mercury | ~5° | Near greatest elongation; highly eccentric orbit |
| Venus | ~1° | Inner planet, good for sign placement |
| Mars | ~1-22° | Worst case near opposition — sign may be wrong |
| Jupiter | ~1-3° | Retrograde *stations* 40 days late |
| Saturn | ~1-3° | Retrograde *stations* 13 days late |
| Rahu/Ketu | ~0.5° | Nodal motion uses mean node approximation |

**User-visible warnings when Meeus fallback is active:**
1. General accuracy warning added to `KundaliData.warnings[]`
2. Graha Yuddha warning (ecliptic latitude approximation)
3. Non-Lahiri ayanamsha systems (`true_revati`, `true_pushya`, `galactic_center`) silently degrade to Lahiri — `console.warn` emitted

### Verifying Which Path Is Active

```typescript
import { isSwissEphAvailable } from '@/lib/ephem/swiss-ephemeris';
console.log('sweph active:', isSwissEphAvailable());
```

In production (Vercel), sweph loads successfully and this returns `true`. No fallback warnings appear on the live site.

---

## 3. Julian Day Number

**File:** `src/lib/ephem/astronomical.ts` → `dateToJD()`
**Reference:** Meeus Ch. 7

The Julian Day (JD) is a continuous count of days since January 1, 4713 BC. It eliminates calendar irregularities and is the universal time unit for all astronomical calculations.

### Algorithm

```
Input: year Y, month M, day D, hour H (decimal, UT)

1. If M ≤ 2: Y = Y - 1, M = M + 12
2. A = floor(Y / 100)
3. B = 2 - A + floor(A / 4)       ← Gregorian correction
4. JD = floor(365.25 × (Y + 4716))
     + floor(30.6001 × (M + 1))
     + D + H/24 + B - 1524.5
```

**Example:** April 2, 2026, 12:00 UT → JD 2461132.0

### Julian Centuries (T)

Many formulas use centuries from the J2000.0 epoch:

```
T = (JD - 2451545.0) / 36525
```

J2000.0 = January 1, 2000, 12:00 TT (JD 2451545.0)

---

## 4. Sun Position

**File:** `src/lib/ephem/astronomical.ts` → `sunLongitude()`
**Reference:** Meeus Ch. 25

### Step-by-step

1. **Geometric mean longitude** (L₀):
   ```
   L₀ = 280.46646 + 36000.76983·T + 0.0003032·T²   (mod 360°)
   ```

2. **Mean anomaly** (M):
   ```
   M = 357.52911 + 35999.05029·T - 0.0001537·T²     (mod 360°)
   ```

3. **Equation of center** (C):
   ```
   C = (1.9146 - 0.004817·T)·sin(M)
     + (0.019993 - 0.000101·T)·sin(2M)
     + 0.000289·sin(3M)
   ```

4. **True longitude**: `☉ = L₀ + C`

5. **Apparent longitude** (nutation + aberration):
   ```
   Ω = 125.04 - 1934.136·T
   λ = ☉ - 0.00569 - 0.00478·sin(Ω)
   ```

**Accuracy:** ~0.01° (36 arcseconds)

### Sidereal Conversion

Tropical longitude → Sidereal:
```
sidereal = tropical - ayanamsha(JD)
```

---

## 5. Moon Position

**File:** `src/lib/ephem/astronomical.ts` → `moonLongitude()`
**Reference:** Meeus Ch. 47

The Moon's position is the most complex calculation. It uses 60 periodic terms from Meeus Table 47.A.

### Fundamental Arguments

Five angles drive all Moon terms:

| Symbol | Name | Mean rate (°/day) |
|--------|------|-------------------|
| L' | Mean longitude | 13.176 |
| D | Mean elongation (Moon from Sun) | 12.190 |
| M | Sun's mean anomaly | 0.986 |
| M' | Moon's mean anomaly | 13.065 |
| F | Moon's argument of latitude | 13.229 |

Each is a polynomial in T:
```
L' = 218.3164 + 481267.8812·T - 0.001579·T² + ...
D  = 297.8502 + 445267.1114·T - 0.001882·T² + ...
M  = 357.5291 + 35999.0503·T  - 0.000154·T² + ...
M' = 134.9634 + 477198.8676·T + 0.008741·T² + ...
F  = 93.2721  + 483202.0175·T - 0.003654·T² + ...
```

### Longitude Summation (60 terms)

Each term has the form:
```
ΔL = coefficient × sin(a·D + b·M + c·M' + d·F)
```

The top 5 terms (in 1e-6 degrees):

| Term | D | M | M' | F | Coefficient | Physical meaning |
|------|---|---|----|----|-------------|------------------|
| 1 | 0 | 0 | 1 | 0 | +6,288,774 | Elliptic inequality (main) |
| 2 | 2 | 0 | -1 | 0 | +1,274,027 | Evection |
| 3 | 2 | 0 | 0 | 0 | +658,314 | Variation |
| 4 | 0 | 0 | 2 | 0 | +213,618 | Second elliptic term |
| 5 | 0 | 1 | 0 | 0 | -185,116 | Annual equation |

**Eccentricity correction:** Terms involving M (Sun's anomaly) are multiplied by E = 1 - 0.002516·T (Earth's decreasing orbital eccentricity).

**Additional corrections:** Venus (A1), Jupiter (A2), and Earth-flattening (A3) perturbations.

**Final longitude:**
```
λ_Moon = L' + ΣΔL / 1,000,000    (degrees)
```

**Accuracy:** ~0.3° (18 arcminutes) — sufficient for Panchang but not for precise occultation timing.

### Moon Ecliptic Latitude (13 terms)

**File:** `panchang-calc.ts` → `_meeusMoonLatitude()`
**Reference:** Meeus Table 47.B

The Moon's orbit is inclined ~5.15° to the ecliptic. Latitude is critical for accurate moonrise calculation.

```
ΔB = 5,128,122·sin(F)
   + 280,602·sin(M' + F)
   + 277,693·sin(M' - F)
   + 173,237·sin(2D - F)
   + ... (9 more terms)

β_Moon = ΣΔB / 1,000,000    (degrees, range ±5.3°)
```

### Moon Distance & Horizontal Parallax (14 terms)

**File:** `panchang-calc.ts` → `_meeusMoonParallax()`
**Reference:** Meeus Table 47.A (cosine column)

The same fundamental arguments produce distance via cosine terms:

```
ΔR = -20,905,355·cos(M')         ← Main term
   + -3,699,111·cos(2D - M')     ← Evection
   + -2,955,968·cos(2D)          ← Variation
   + ... (11 more terms)

distance = 385,000.56 + ΣΔR/1000    (km)
```

**Horizontal parallax:**
```
sin(HP) = 6378.14 / distance
HP ≈ 54' to 61' (varies with distance)
```

This is used for the topocentric parallax correction in moonrise calculations.

---

## 6. Sunrise & Sunset

**File:** `src/lib/astronomy/sunrise.ts` → `getSunTimes()`
**Reference:** Meeus Ch. 15

### Algorithm (2-pass iterative)

**Pass 1: Initial estimate using noon solar position**

1. Compute Equation of Time at local noon:
   ```
   EoT = f(obliquity, L₀, M, eccentricity)    (minutes)
   ```

2. Solar noon in local minutes:
   ```
   solar_noon = 720 - 4×longitude - EoT + timezone×60
   ```

3. Hour angle for sunrise/sunset:
   ```
   cos(H₀) = [sin(-0.8333°) - sin(lat)·sin(decl)] / [cos(lat)·cos(decl)]
   ```

   The **-0.8333°** accounts for:
   - Atmospheric refraction at horizon: **-34 arcmin**
   - Sun's semi-diameter: **-16 arcmin**
   - Total: -50 arcmin = -0.8333°

4. First estimates:
   ```
   sunrise = solar_noon - 4 × H₀
   sunset  = solar_noon + 4 × H₀
   ```

**Pass 2: Refine using solar position at estimated times**

5. Compute the Sun's declination and EoT at the estimated sunrise JD (not noon)
6. Recalculate H₀ with the corrected declination
7. Recalculate solar noon with the corrected EoT
8. Final sunrise/sunset = corrected solar noon ∓ 4 × corrected H₀

**Why 2 passes?** The Sun's declination changes throughout the day (~0.4° in 12h near equinoxes). Using noon's declination for sunrise introduces a systematic error of ~2-4 minutes. The 2nd pass eliminates this.

### Solar Position for Sunrise

Uses `getSolarPosition()` from `src/lib/astronomy/solar.ts` which provides:
- **Full nutation-corrected obliquity** (Meeus Ch. 22, 5 terms)
- **Apparent longitude** (not geometric)
- **Proper RA/Dec** from ecliptic

### Equation of Time

```
y = tan²(ε/2)

EoT = y·sin(2L₀) - 2e·sin(M) + 4e·y·sin(M)·cos(2L₀)
    - 0.5y²·sin(4L₀) - 1.25e²·sin(2M)

EoT_minutes = EoT × (180/π) × 4
```

Range: approximately -14 to +16 minutes throughout the year. Peaks in February (~+14 min) and November (~-16 min).

---

## 7. Moonrise & Moonset

**File:** `src/lib/ephem/panchang-calc.ts` → `calculateMoonriseUT()`

Unlike the Sun, the Moon moves ~13°/day — too fast for an analytical formula. We use an **iterative horizon-crossing** method.

### Algorithm

1. **Ecliptic → Equatorial conversion:**
   ```
   sin(δ) = sin(β)·cos(ε) + cos(β)·sin(ε)·sin(λ)
   α = atan2(sin(λ)·cos(ε) - tan(β)·sin(ε), cos(λ))
   ```
   where λ = Moon longitude, β = Moon latitude, ε = obliquity (with nutation)

2. **Topocentric altitude** at any JD:
   ```
   GST = 280.46062 + 360.98565·(JD - 2451545) + ...
   LST = GST + observer_longitude
   HA = LST - α

   sin(alt) = sin(lat)·sin(δ) + cos(lat)·cos(δ)·cos(HA)
   alt_geo = arcsin(sin(alt))

   // Topocentric parallax correction
   alt_topo = alt_geo - HP·cos(alt_geo)
   ```

   The parallax correction lowers the Moon's apparent altitude by up to ~1° at the horizon — this is the Moon's most distinctive feature compared to solar calculations.

3. **Scan for horizon crossing:**
   - Start at midnight UT
   - Step through 24 hours in **5-minute intervals** (288 steps)
   - At each step, compute `moonAltitude()`
   - Detect when altitude crosses the threshold h₀ = **-0.3°**

4. **Binary search refinement:**
   - Once a crossing bracket is found (5-min window)
   - 15 iterations of bisection → precision ~0.03 seconds
   - Return the crossing time in UT decimal hours

### Moonrise Threshold: h₀ = -0.3°

Since `moonAltitude()` already applies topocentric parallax:
```
h₀ = semi_diameter - refraction = 16'/60 - 34'/60 = -0.3°
```

Meaning: moonrise occurs when the Moon's center is 0.3° below the geometric horizon, because atmospheric refraction (34') lifts the image more than the semi-diameter (16') that needs to clear the horizon.

### Edge Cases

- **Moon doesn't rise:** Returns `--:--` (e.g., near Amavasya when moonrise occurs very close to sunrise and may fall outside the 24h UT scan window)
- **Moon doesn't set:** Returns `--:--` (possible near full moon at high latitudes)
- **Polar regions:** Both moonrise and moonset may be absent for extended periods

---

## 8. Ayanamsha (Precession)

**File:** `src/lib/ephem/astronomical.ts` → `getAyanamsha()`, `lahiriAyanamsha()`
**Reference:** IAU precession + multiple ayanamsha systems

Vedic astrology uses the **sidereal zodiac**, which accounts for the precession of the equinoxes. The ayanamsha is the accumulated angular difference between tropical (season-fixed) and sidereal (star-fixed) zodiacs.

### Precession Physics

Earth's rotational axis traces a cone in space over **25,772 years** due to the gravitational torque from the Sun and Moon on Earth's equatorial bulge. Rate: **50.29 arcseconds/year** (≈ 1° every 71.6 years).

Historical milestones:
- **Hipparchus (c. 150 BCE):** First measured precession — estimated 36"/year
- **Surya Siddhanta (c. 400 CE):** Described precession but used incorrect trepidation (oscillating) model
- **Varahamihira (505 CE):** Compared 5 astronomical systems in Pancha Siddhantika
- **Bhaskaracharya II (1150 CE):** Gave precession rate close to modern value
- **Meghnad Saha Committee (1955):** Officially adopted Lahiri for India's National Calendar

### Supported Ayanamsha Systems

Our app implements 6 ayanamsha systems via `getAyanamsha(jd, type)`:

| System | Formula (T = centuries from J2000.0) | Value at 2026 | Anchor | Zero Ayanamsha Date |
|--------|--------------------------------------|---------------|--------|---------------------|
| **Lahiri (Chitrapaksha)** | 23.853 + 1.397·T + 0.0002·T² | **24.22°** | Spica at 180° | ~285 CE |
| **KP (Krishnamurti)** | 23.761 + 1.397·T + 0.0002·T² | **24.12°** | Spica (refined) | ~291 CE |
| **CV Raman** | 22.460 + 1.385·T + 0.0002·T² | **22.82°** | — | ~397 CE |
| **BV Raman** | 22.378 + 1.383·T + 0.0002·T² | **22.74°** | — | ~400 CE |
| **Sri Yukteshwar** | 21.767 + 1.385·T | **22.13°** | — | ~499 CE |
| **JN Bhasin** | 23.152 + 1.397·T + 0.0002·T² | **23.52°** | — | ~334 CE |

### Why the Choice Matters — Real Example

**Birth: 14 May 1988, 06:00 IST, Delhi**

| Planet | Lahiri (23.69°) | Raman (22.30°) | Impact |
|--------|----------------|----------------|--------|
| **Sun** | Aries 29.75° | **Taurus 1.14°** | **Sign changed** — Sun sign, lordship, all Sun yogas differ |
| **Venus** | Mrigashira Nak. | **Ardra Nak.** | **Nakshatra changed** — affects matching (Melapaka) |
| **Ketu** | Purva Phalguni | **Uttara Phalguni** | **Nakshatra changed** — shifts spiritual karma patterns |
| Other 6 | Same signs | Same nakshatras | Not near boundaries |

A 1.39° ayanamsha difference creates 3 changes in one chart. For planets near 0° or 30° of any sign, the system choice determines the entire interpretation.

### Conversion

```
sidereal_longitude = tropical_longitude - ayanamsha(JD, system)
```

The kundali generator applies the selected ayanamsha (Lahiri/Raman/KP) to ALL planet positions, ascendant, and divisional charts.

---

## 9. Panchang Elements

All five elements are computed at the **local sunrise JD**, not midnight.

### 8.1 Tithi

**The angle between Moon and Sun, divided into 12° segments.**

```
elongation = moon_longitude - sun_longitude    (mod 360°)
tithi = floor(elongation / 12) + 1             (1-30)
```

- Tithis 1-15: Shukla Paksha (waxing, Moon ahead of Sun by 0-180°)
- Tithis 16-30: Krishna Paksha (waning, 180-360°)
- Tithi #15 = Purnima (Full Moon), #30 = Amavasya (New Moon)

**Transition time:** Binary search for the JD where the elongation crosses the 12° boundary.

### 8.2 Nakshatra

**Moon's sidereal longitude divided into 27 equal segments of 13°20'.**

```
nakshatra = floor(moon_sidereal / (360/27)) + 1    (1-27)
pada = floor((moon_sidereal mod 13.333) / 3.333) + 1    (1-4)
```

Each nakshatra has 4 padas (quarters), giving 108 padas total — the basis for Navamsha (D9) chart division.

### 8.3 Yoga

**Sum of Sun and Moon sidereal longitudes, divided into 27 segments.**

```
yoga_angle = (sun_sidereal + moon_sidereal) mod 360
yoga = floor(yoga_angle / (360/27)) + 1    (1-27)
```

This measures the combined Sun-Moon energy for the day.

### 8.4 Karana

**Half of a tithi (6° of elongation). 60 karanas per lunar month.**

```
karana_index = floor(elongation / 6)    (0-59)
```

The 11 karana types cycle in a fixed pattern:
- Kimstughna (first half of S1) — fixed
- 7 chara karanas cycle: Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti
- Shakuni, Chatushpada, Nagava — fixed (last 3 halves)

### 8.5 Vara (Weekday)

```
weekday = floor(JD + 1.5) mod 7
```
0 = Sunday, 1 = Monday, ..., 6 = Saturday

---

## 10. Timezone & DST Handling

**File:** `src/lib/utils/timezone.ts`

### The Problem

A numeric timezone offset (e.g., `tz=2` for CEST) is wrong for dates in a different DST period (e.g., CET=UTC+1 in winter). India (IST) doesn't observe DST, but Europe, Americas, and many other regions do.

### Solution: IANA Timezone Strings

Every calculation accepts an **IANA timezone string** (e.g., `'Europe/Zurich'`, `'America/New_York'`).

```typescript
function getUTCOffsetForDate(year, month, day, timezone): number {
  // Create a date at noon to avoid DST edge cases
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  // Use Intl API to resolve the actual offset for this specific date
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'shortOffset',
  });

  // Parse "GMT+2", "GMT-5:30", etc.
  const parts = formatter.formatToParts(date);
  const tzPart = parts.find(p => p.type === 'timeZoneName');
  // Extract numeric offset from "GMT+2" → 2, "GMT-5:30" → -5.5
}
```

### DST Examples

| Location | January | July | Difference |
|----------|---------|------|------------|
| Zurich | CET (+1) | CEST (+2) | +1h |
| New York | EST (-5) | EDT (-4) | +1h |
| London | GMT (+0) | BST (+1) | +1h |
| India | IST (+5.5) | IST (+5.5) | 0 |
| Nepal | NPT (+5.75) | NPT (+5.75) | 0 |

### Data Flow

```
User selects location → LocationSearch returns IANA timezone
                      → Location store persists to localStorage
                      → API calls include ?timezone=Europe/Zurich
                      → getUTCOffsetForDate() resolves per-date offset
                      → All calculations use correct UTC offset
```

### Backward Compatibility

The `resolveTimezone()` function handles both formats:
```typescript
resolveTimezone("5.5", ...)        → 5.5    (numeric string)
resolveTimezone("Asia/Kolkata", ...)→ 5.5    (IANA, resolved for date)
resolveTimezone("Europe/Zurich", 2026, 7, 15) → 2.0  (CEST in July)
resolveTimezone("Europe/Zurich", 2026, 1, 15) → 1.0  (CET in January)
```

---

## 11. Accuracy Report

### Swiss Ephemeris (Production Path)

When sweph is active (production/Vercel), all planetary positions are sub-arcsecond accurate, based on DE431 JPL ephemeris. Planet longitudes are accurate to ~0.001° for dates 2000 BCE – 3000 CE.

### Delhi, April 2, 2026 — vs Prokerala

| Element | Our Value | Prokerala | Difference |
|---------|-----------|-----------|------------|
| Sunrise | 06:10 | 06:10 | **exact** |
| Sunset | 18:39 | 18:39 | **exact** |
| Moonrise | 19:05 | 19:07 | 2 min |
| Rahu Kaal | 13:58-15:32 | 13:59-15:32 | 1 min |
| Tithi (Purnima) end | 07:42 | 07:41 | 1 min |
| Nakshatra (Hasta) end | 17:38 | 17:38 | **exact** |
| Yoga (Dhruva) end | 14:19 | 14:20 | 1 min |

### Multi-Timezone Validation

| Location | Timezone | Sunrise | Sunset | Notes |
|----------|----------|---------|--------|-------|
| Delhi | IST (+5.5) | 06:10 | 18:39 | Exact match |
| Zurich Jan | CET (+1) | 08:03 | 17:02 | DST correctly NOT applied |
| Zurich Jul | CEST (+2) | 05:48 | 21:16 | DST correctly applied |
| New York Apr | EDT (-4) | 06:37 | 19:21 | Negative offset handled |
| London Jan | GMT (+0) | 07:49 | 16:11 | Zero offset |
| London Apr | BST (+1) | 06:05 | 19:55 | DST correctly applied |
| Nepal Apr | NPT (+5.75) | 05:49 | 18:17 | Fractional offset handled |
| Sydney Apr | AEST (+10) | 07:04 | 18:46 | Southern hemisphere |

### Known Limitations (apply to both paths)

1. **No atmospheric model:** We use standard refraction of 34 arcmin. Actual refraction varies with temperature and pressure (can differ by ±2 arcmin in extreme conditions).

2. **Topographic horizon:** All calculations assume a mathematical horizon. Mountains, buildings, and elevation are not accounted for.

3. **Moon semi-diameter:** We use a fixed 16 arcmin. The actual value varies from 14.7' to 16.7' with distance (±1 min effect on moonrise).

### Meeus Fallback Limitations (dev-only, no sweph binary)

4. **Moon longitude accuracy:** ~0.3° (Meeus Ch.47, 60 terms). Translates to ~1-2 min in moonrise.

5. **Outer planet accuracy:** Mars ±1-22°, Jupiter/Saturn ±1-3°. Retrograde stations for Jupiter may be 40 days late; Saturn 13 days late.

6. **Non-Lahiri ayanamsha systems:** `true_revati`, `true_pushya`, and `galactic_center` fall back to Lahiri polynomial (max ~0.3° difference).

---

## File Reference

| File | Purpose |
|------|---------|
| `src/lib/ephem/swiss-ephemeris.ts` | Swiss Ephemeris wrapper — primary engine, memoized, `isSwissEphAvailable()` |
| `src/lib/ephem/astronomical.ts` | Sun/Moon longitude, JD, ayanamsha — sweph gate + Meeus fallback |
| `src/lib/ephem/panchang-calc.ts` | Main Panchang computation, moonrise/moonset, all 5 elements |
| `src/lib/ephem/kundali-calc.ts` | Birth chart generation (houses, planets, dashas, warnings) |
| `src/lib/astronomy/sunrise.ts` | 2-pass iterative sunrise/sunset |
| `src/lib/astronomy/solar.ts` | Full solar position, obliquity, EoT, GMST |
| `src/lib/astronomy/julian.ts` | Julian Day conversion, centuries, angle normalization |
| `src/lib/astronomy/ayanamsa.ts` | Standalone ayanamsha (lahiri/kp/raman polynomial) — used by legacy callers |
| `src/lib/utils/timezone.ts` | IANA timezone resolution, DST-aware offset computation |
| `src/stores/location-store.ts` | Client-side location + timezone persistence |
| `src/lib/kp/kp-chart.ts` | KP System calculations (Placidus houses, sub-lords) |
| `src/lib/varshaphal/solar-return.ts` | Solar return (annual chart) JD finder |
