# How I Built a Vedic Panchang Engine in TypeScript — Swiss Ephemeris, Meeus Fallback, Zero External APIs

*Sub-arcsecond planetary positions, sunrise for any location on Earth, and an entire astronomical calendar — all computed server-side in a Next.js app.*

---

For the past year I've been building [Dekho Panchang](https://dekhopanchang.com) — an Indian Vedic astrology web app that computes a daily **Panchang** (the traditional Hindu almanac) for any location on Earth. Every astronomical value — sunrise, sunset, Moon's position, tithis, nakshatras, yogas, karanas — is computed locally on the server. No external ephemeris APIs. No third-party astrology services.

The production engine uses **Swiss Ephemeris** (sub-arcsecond accuracy, the same library used by professional observatories) with a pure-math **Meeus fallback** for environments where native modules can't load. This post walks through the architecture and mathematics, with real code from the production codebase.

## What Is a Panchang?

A Panchang (पञ्चाङ्ग, literally "five limbs") is the daily Indian almanac. The five limbs are:

| Limb | What It Measures | Astronomical Basis |
|------|------------------|--------------------|
| **Tithi** | Lunar day (1-30) | Moon–Sun elongation ÷ 12° |
| **Nakshatra** | Lunar mansion (1-27) | Moon's sidereal longitude ÷ 13°20′ |
| **Yoga** | Sun-Moon combination (1-27) | (Sun + Moon sidereal) ÷ 13°20′ |
| **Karana** | Half a tithi (1-11 types) | Moon–Sun elongation ÷ 6° |
| **Vara** | Weekday | Julian Day → day of week |

Every Hindu festival date, auspicious muhurta (electional window), and fast (vrat) is determined by these five values. Get the Sun or Moon wrong by half a degree, and a festival lands on the wrong day.

## The Dual-Engine Architecture

The core design decision: every astronomical function checks for Swiss Ephemeris first, falls back to Meeus if unavailable.

```typescript
export function sunLongitude(jd: number): number {
  if (isSwissEphAvailable()) {
    return swissPlanetLongitude(jd, 0).longitude; // < 0.001° accuracy
  }
  return _meeusSunLongitude(jd); // ±0.01° fallback
}

export function moonLongitude(jd: number): number {
  if (isSwissEphAvailable()) {
    return swissPlanetLongitude(jd, 1).longitude; // < 0.001° accuracy
  }
  return _meeusMoonLongitude(jd); // ±0.5° fallback
}
```

Swiss Ephemeris loads as a native Node.js module on the server — it's the `sweph` npm package wrapping the C library from the Astronomical Institute at the University of Zurich. On the client side or in edge runtimes where native modules can't load, Meeus kicks in automatically.

| Engine | Sun | Moon | Outer Planets | Where It Runs |
|--------|-----|------|---------------|---------------|
| Swiss Ephemeris | ±0.001° | ±0.001° | ±0.001° | Server (Node.js) — **primary** |
| Meeus | ±0.01° | ±0.5° | ±1-3° | Browser/Edge — **fallback** |

The Swiss Ephemeris integration includes a memoisation cache (keyed on JD rounded to 6 decimals) to avoid redundant calls — a single panchang computation queries the same JD dozens of times for different planets:

```typescript
const planetCache = new Map<string, PlanetResult>();
const CACHE_MAX = 500;

function cacheKey(jd: number, planetId?: number): string {
  return `${jd.toFixed(6)}${planetId !== undefined ? `:${planetId}` : ''}`;
}
```

## Step 1: Julian Day — The Universal Time Counter

Both engines start by converting a calendar date to a **Julian Day Number** — a continuous day count used by astronomers since 1583. JD 2451545.0 = 1 January 2000, 12:00 UT (the J2000.0 epoch).

The algorithm comes from Jean Meeus's *Astronomical Algorithms* (Ch.7):

```typescript
export function dateToJD(
  year: number, month: number, day: number, hour: number = 0
): number {
  // Meeus convention: Jan/Feb treated as months 13/14 of prior year
  if (month <= 2) { year -= 1; month += 12; }
  // Gregorian correction for the 10-day gap
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716))
    + Math.floor(30.6001 * (month + 1))
    + day + hour / 24 + B - 1524.5;
}
```

Everything downstream — Sun position, Moon position, sunrise — takes a JD as input. Swiss Ephemeris has its own `swe_julday` function, but ours matches it to 10 decimal places.

## Step 2: The Meeus Fallback — How It Works

When Swiss Ephemeris isn't available, the Meeus algorithms handle everything. Here's the Sun's position via Meeus Ch.25:

```typescript
function _meeusSunLongitude(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0; // Julian centuries from J2000.0

  // Geometric mean longitude
  const L0 = normalizeDeg(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
  // Mean anomaly — angle from perihelion
  const M = normalizeDeg(357.52911 + 35999.05029 * t - 0.0001537 * t * t);
  const Mrad = M * Math.PI / 180;

  // Equation of centre — correction for elliptical orbit
  const C = (1.914602 - 0.004817 * t) * Math.sin(Mrad)
    + (0.019993 - 0.000101 * t) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad);

  const sunTrue = normalizeDeg(L0 + C);

  // Nutation + aberration correction
  const omega = 125.04 - 1934.136 * t;
  return normalizeDeg(sunTrue - 0.00569
    - 0.00478 * Math.sin(omega * Math.PI / 180));
}
```

The dominant term (1.9146°) in the equation of centre reflects Earth's orbital eccentricity (~0.017). The Sun moves ~1°/day, so ±0.01° accuracy means we're within ~14 seconds of the true position.

The Moon is more complex — Meeus Ch.47 implements a truncated ELP-2000/82 lunar theory with 60 periodic terms:

```typescript
function _meeusMoonLongitude(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0;

  // Four fundamental arguments (degrees)
  const Lp = normalizeDeg(218.3164477 + 481267.88123421 * t
    - 0.0015786 * t * t + t**3 / 538841);
  const D  = normalizeDeg(297.8501921 + 445267.1114034 * t
    - 0.0018819 * t * t + t**3 / 545868);
  const M  = normalizeDeg(357.5291092 + 35999.0502909 * t
    - 0.0001536 * t * t);
  const Mp = normalizeDeg(134.9633964 + 477198.8675055 * t
    + 0.0087414 * t * t + t**3 / 69699);
  const F  = normalizeDeg(93.2720950 + 483202.0175233 * t
    - 0.0036539 * t * t);

  // Sum 60 periodic terms: each is sin(aD + bM + cMp + dF) × coefficient
  let sumL = 0;
  for (const [coeffD, coeffM, coeffMp, coeffF, sinCoeff] of MOON_TERMS) {
    const arg = coeffD * D + coeffM * M + coeffMp * Mp + coeffF * F;
    sumL += sinCoeff * Math.sin(arg * Math.PI / 180);
  }

  // Planetary corrections (Venus, Jupiter perturbations)
  const A1 = normalizeDeg(119.75 + 131.849 * t);
  const A2 = normalizeDeg(53.09 + 479264.290 * t);
  sumL += 3958 * Math.sin(A1 * Math.PI / 180)
       + 1962 * Math.sin((Lp - F) * Math.PI / 180)
       + 318  * Math.sin(A2 * Math.PI / 180);

  return normalizeDeg(Lp + sumL / 1_000_000);
}
```

The Moon's orbit is perturbed by the Sun, Jupiter, and the non-spherical Earth. Even this 60-term truncation gives ±0.5° — well within the 13°20' span of each nakshatra. In production, Swiss Ephemeris handles the Moon with full precision.

## Step 3: Tropical → Sidereal (The Ayanamsha Bridge)

Western astronomy uses the **tropical** zodiac (anchored to the vernal equinox). Indian astronomy uses the **sidereal** zodiac (anchored to fixed stars). The difference is called **ayanamsha** — the accumulated precession of the equinoxes.

Swiss Ephemeris has built-in ayanamsha computation for multiple systems. Our fallback uses the Lahiri (Chitrapaksha) polynomial, anchoring the star Spica (Chitra) at exactly 180° sidereal:

```typescript
export function lahiriAyanamsha(jd: number): number {
  if (isSwissEphAvailable()) {
    return swissAyanamsha(jd); // Uses SE_SIDM_LAHIRI mode
  }
  const t = (jd - 2451545.0) / 36525.0;
  // ~50.29 arcseconds/year precession rate
  return 23.85306 + 1.39722 * t + 0.00018 * t * t;
}

function toSidereal(tropicalLong: number, jd: number): number {
  return normalizeDeg(tropicalLong - lahiriAyanamsha(jd));
}
```

In 2026, the ayanamsha is approximately 24.2° — meaning the tropical and sidereal zodiacs differ by nearly a full sign. This is why your "Sun sign" in Western astrology is often one sign ahead of your Vedic rashi.

## Step 4: Computing the Five Limbs

With Sun and Moon positions in sidereal coordinates, the five Panchang elements are straightforward:

```typescript
// Tithi: 30 lunar days per synodic month
// Each tithi = 12° of Moon-Sun elongation
function calculateTithi(jd: number): { number: number; degree: number } {
  const sunSid = toSidereal(sunLongitude(jd), jd);
  const moonSid = toSidereal(moonLongitude(jd), jd);
  const diff = normalizeDeg(moonSid - sunSid); // 0° = new moon, 180° = full
  return { number: Math.floor(diff / 12) + 1, degree: diff };
}

// Nakshatra: Moon's sidereal position in 27 equal divisions
function getNakshatraNumber(moonSidereal: number): number {
  return Math.floor(moonSidereal / (360 / 27)) + 1; // 1-27
}

// Yoga: sum of Sun + Moon sidereal longitudes, divided by 13°20'
function calculateYoga(jd: number): number {
  const sunSid = toSidereal(sunLongitude(jd), jd);
  const moonSid = toSidereal(moonLongitude(jd), jd);
  const sum = normalizeDeg(sunSid + moonSid);
  return Math.floor(sum / (360 / 27)) + 1; // 1-27
}

// Karana: half a tithi — each 6° arc of Moon-Sun elongation
// 7 repeating types cycle through 56 slots, 4 fixed types fill the edges
function calculateKarana(jd: number): number {
  const { degree } = calculateTithi(jd);
  const idx = Math.floor(degree / 6);
  if (idx === 0) return 11;         // Kimstughna
  if (idx >= 57) return [8, 9, 10][idx - 57]; // Shakuni, Chatushpada, Naga
  return ((idx - 1) % 7) + 1;       // Bava through Vishti cycle
}
```

These functions are engine-agnostic — they call `sunLongitude()` and `moonLongitude()`, which internally route to Swiss Ephemeris or Meeus. The panchang logic itself doesn't know or care which engine produced the positions.

## Step 5: Sunrise — The Panchang Day Boundary

In Vedic tradition, the panchang day runs sunrise to sunrise (not midnight to midnight). All five limbs are evaluated at the moment of sunrise. Swiss Ephemeris provides precise sunrise via atmospheric refraction models, but the Meeus fallback solves the hour angle equation directly (Meeus Ch.15):

```
cos(H) = (sin(-0.8333°) - sin(lat) × sin(δ)) / (cos(lat) × cos(δ))
```

Where `-0.8333°` accounts for atmospheric refraction (34 arcminutes) and the Sun's semi-diameter (16 arcminutes). Then sunrise = solar noon − H/15 hours.

```typescript
function approximateSunrise(jd: number, lat: number, lng: number): number | null {
  if (isSwissEphAvailable()) {
    return swissSunrise(jd, lat, lng); // ±10 seconds accuracy
  }

  // Meeus fallback: ±2 minutes accuracy
  const T = (jd - 2451545.0) / 36525;
  const obliquity = 23.4393 - 0.0130 * T;
  const sunLong = _meeusSunLongitude(jd);
  const decl = toDeg(Math.asin(
    Math.sin(toRad(obliquity)) * Math.sin(toRad(sunLong))
  ));

  const cosH = (Math.sin(toRad(-0.8333)) - Math.sin(toRad(lat)) * Math.sin(toRad(decl)))
    / (Math.cos(toRad(lat)) * Math.cos(toRad(decl)));
  if (cosH > 1 || cosH < -1) return null; // Polar — no sunrise

  const H = toDeg(Math.acos(cosH));

  // Equation of Time: corrects for orbital eccentricity + obliquity
  const y2 = Math.tan(toRad(obliquity / 2)) ** 2;
  const L0 = toRad(280.46646 + 36000.76983 * T);
  const M = toRad(357.52911 + 35999.05029 * T);
  const e = 0.016708634 - 0.000042037 * T;
  const eot = toDeg(
    y2 * Math.sin(2 * L0) - 2 * e * Math.sin(M)
    + 4 * e * y2 * Math.sin(M) * Math.cos(2 * L0)
    - 0.5 * y2 * y2 * Math.sin(4 * L0)
    - 1.25 * e * e * Math.sin(2 * M)
  ) * 4; // minutes

  const solarNoon = (720 - 4 * lng - eot) / 60;
  return ((solarNoon - H / 15) % 24 + 24) % 24; // UT hours
}
```

The Equation of Time (up to ±16 minutes) corrects for two effects: Earth's orbital eccentricity makes the Sun appear to speed up and slow down, and the obliquity of the ecliptic means equal ecliptic arcs don't correspond to equal time intervals.

## How Accurate Is It?

We run automated regression tests on every commit for **Bern (UTC+1/+2)**, **Delhi (UTC+5:30)**, and **Seattle (UTC-7/-8)** — covering DST transitions, half-hour offsets, and western hemisphere edge cases.

| Element | Swiss Ephemeris (production) | Meeus Fallback |
|---------|------------------------------|----------------|
| Sunrise/Sunset | ±10 seconds | ±2 minutes |
| Moonrise/Moonset | ±30 seconds | ±5 minutes |
| Tithi transition | ±1 second | ±1 minute |
| Nakshatra transition | ±1 second | ±1 minute |
| Yoga / Karana | Exact | Exact (within element span) |
| Planet longitudes | < 1 arcsecond | Sun ±36″, Moon ±30′ |

```typescript
// From our actual test suite
it('sunrise within 2 min of reference', () =>
  assertWithinMinutes('sunrise', computed.sunrise, reference.sunrise, 2));

it('tithi end time within 2 min', () =>
  assertWithinMinutes('tithi end', computed.tithiEnd, reference.tithiEnd, 2));
```

## Hard Lessons from Production

Building this over the past year, I've catalogued **63+ bugs** across 6 audit rounds. Some highlights:

### The Timezone Trap

```typescript
// BAD: Creates date in server's local timezone (UTC on Vercel, UTC+2 on my laptop)
const d = new Date(1990, 2, 15, 10, 30);

// GOOD: Always use UTC explicitly
const d = new Date(Date.UTC(1990, 2, 15, 10, 30));
```

Every single `new Date(year, month, day)` call in computation code is a landmine. On Vercel (UTC), it works fine. On a dev machine in Switzerland (UTC+2), birth time 10:30 IST silently becomes 10:30 CET — and your dasha dates drift by 5.5 hours.

### The Sidereal Double-Subtraction

Moon's longitude from Swiss Ephemeris is already sidereal (ayanamsha pre-subtracted). One module re-derived the nakshatra by subtracting ayanamsha *again*. Result: Moon appeared to be in the wrong nakshatra — off by nearly a full mansion. The fix: always use the stored `.nakshatra.id` or `.sign` instead of re-deriving from longitude.

### Midnight-Crossing Time Ranges

Rahu Kaal might run 23:30–01:15. A naïve `now >= start && now < end` check *never* triggers because start > end. The fix:

```typescript
function isTimeActive(now: number, start: number, end: number): boolean {
  if (end < start) return now >= start || now < end; // Wraps past midnight
  return now >= start && now < end;
}
```

This same bug appeared in three separate components before we found all instances.

### Fixed Intervals for Lunar Phenomena

```typescript
// WRONG: Moon's orbit is elliptical — intervals vary 13.9 to 15.6 days
const fullMoonDate = newMoonDate + 15 * DAY_MS;

// RIGHT: Binary search for the actual Moon-Sun elongation = 180°
function findFullMoon(startJd: number): number {
  // Newton-Raphson or bisection on moonSid - sunSid = 180°
}
```

We shipped Purnimant month boundaries that used a fixed 15-day offset from New Moon. Result: months started on Ashtami instead of Purnima. The Moon's elliptical orbit means this interval varies by nearly 2 days.

## The Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Primary engine**: Swiss Ephemeris via `sweph` npm package (sub-arcsecond, 5400 BC – 5400 AD)
- **Fallback engine**: ~3,000 lines of Meeus algorithms (pure TypeScript, no native deps)
- **Deployment**: Vercel with ISR (revalidate every 24 hours)
- **Testing**: Vitest with automated regression across 3 timezone locations

The entire panchang calculation runs in ~15ms on a cold start. No network requests, no API keys, no rate limits.

## Try It

[**dekhopanchang.com**](https://dekhopanchang.com) — free, no signup needed. Enter any location and get the complete Panchang with all five limbs, sunrise/sunset, Rahu Kaal, auspicious windows, and more.

The full computation engine handles:
- Daily Panchang for any location globally
- Birth charts (Kundali) with 9 planets, 12 houses, and interpretive commentary
- Dasha systems (Vimshottari, Yogini, Chara, and 5 more)
- 80+ yoga detections with classical source references
- Festival calendar with Amanta/Purnimanta month support
- Muhurta (electional astrology) with multi-factor scoring
- Compatibility matching (Ashta Kuta, 36 points)

All computed from first principles. No black boxes.

---

*If you're interested in astronomical computing, celestial mechanics, or the intersection of ancient knowledge systems and modern engineering — I'd love to hear your thoughts in the comments.*

*The codebase handles 142 pages across multiple locales, serves users from Seattle to Delhi to Bern, and every number on every page is computed fresh from orbital equations. It's the most fun I've had with trigonometry since university.*
