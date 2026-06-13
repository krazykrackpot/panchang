---
title: Building Arc-Minute Panchang Accuracy in TypeScript — Lessons from Six Months of Wrong Answers
published_at: DRAFT — review then publish
target: dev.to
canonical_url: https://dekhopanchang.com/blog/arcminute-panchang   # if/when we host
tags: typescript, astronomy, opensource, jyotish
cover_image: TBD — generate a clean planetary-motion diagram
author: Aditya Kumar Jha
brand_url: https://dekhopanchang.com
---

# Building Arc-Minute Panchang Accuracy in TypeScript — Lessons from Six Months of Wrong Answers

The Panchang — the five-element Vedic calendar of *tithi*, *nakshatra*, *yoga*, *karana*, and *vara* — looks like a lookup table. It is anything but. Every one of those five values is the output of a precise astronomical computation, and the moment you treat the Panchang as data to be loaded instead of physics to be computed, you start shipping wrong answers.

At [Dekho Panchang](https://dekhopanchang.com) I have spent the last six months learning that lesson the slow way. This post is the lessons-bundle for anyone else who looks at a Panchang renderer and thinks "how hard can it be?"

## Why the Panchang is not a lookup table

A *tithi* (lunar day) is defined as 12 degrees of elongation between the Sun and the Moon along the ecliptic. There are 30 tithis in a lunar month. The Moon's orbit is elliptical — its angular speed varies from roughly 12°/day at apogee to about 15°/day at perigee. So tithis are not 24 hours long. They drift between roughly 19 hours and 26 hours.

The day a tithi is "named after" depends on whether it overlaps sunrise in your city. Move the city, the tithi shifts. Move the date, the tithi length shifts. There is no calendar you can pre-render once and serve to every user — every render is a function of `(date, latitude, longitude, timezone)`.

This is why the field of Panchang software is full of subtle wrong answers.

## The architecture: dual-path, with the slow path tested by the fast one

The Dekho Panchang engine uses a two-tier astronomical pipeline.

**Primary path — Swiss Ephemeris (DE431 / VSOP87).**
The Swiss Ephemeris is the gold-standard implementation of JPL's DE431 lunar theory and the VSOP87 planetary theory. Sub-arcsecond accuracy for every planet from 13,200 BCE to 17,191 CE — far beyond what any Panchang calculation requires. When Swiss is available, every position uses it.

**Fallback path — Jean Meeus's algorithms (Astronomical Algorithms, 2nd ed., 1998).**
The Meeus series is the practical reference for computational astronomy in software. Accuracy: Sun within ~0.01°, Moon within ~0.5°. Slightly looser on outer planets in the simplified series — Jupiter's retrograde station can be ~40 days late, Saturn's ~13 days late vs. Swiss. When the engine falls back, this gets recorded in `warnings[]` so the user knows.

The interesting part: every fallback computation is regression-tested against the Swiss path. When the two paths disagree by more than the stated tolerance, the test suite fails. That alone has caught five real bugs that would have shipped silently.

## The five lessons that cost the most time

### 1. Never `new Date(year, month, day)` in computation code

`new Date(2026, 5, 15, 10, 30)` interprets every argument in the **server's local timezone**. On Vercel, that's UTC. On my laptop in Switzerland, it's CEST. A birth time of "10:30 IST" becomes "10:30 UTC" — six hours off. Every dasha date that comes out the other end is shifted by the birth timezone offset.

The fix:

```ts
// WRONG — local-tz constructor
const t = new Date(year, month - 1, day, hour, minute);

// RIGHT — UTC, every time
const t = new Date(Date.UTC(year, month - 1, day, hour, minute));
```

I had to grep every `new Date(` in the engine and prove each one was either UTC or had a documented reason to be local. That audit took an afternoon and reverted three subtle bugs.

### 2. The Julian Day weekday formula gives 0 = Sunday, not Monday

The classical Julian Day weekday formula is:

```ts
const weekday = Math.floor(jd + 1.5) % 7;
```

`0` is Sunday, `1` is Monday, …, `6` is Saturday. It matches `Date.prototype.getUTCDay()`. I missed this once — assumed `0 = Monday` — and the *vara lord* (planetary ruler of the day) shifted by one. The KP system's ruling-planet sequence was off by a day for two weeks.

A comment now sits on every weekday-using line:

```ts
// 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
const weekday = Math.floor(jd + 1.5) % 7;
```

### 3. Fractional years must use millisecond arithmetic — never `setMonth`

A Vimshottari Maha Dasha lasts 7 years (Ketu), 20 years (Venus), 10 years (Moon), and so on. A pratyantar within an antar within a mahadasha can be 1.43 years long. Adding fractional years via `setMonth` and `setFullYear` truncates to whole months, and the truncation compounds over 12+ sub-dashas.

```ts
// WRONG — month-truncation drift, compounds over sub-dashas
function addYears(d: Date, years: number): Date {
  const out = new Date(d);
  out.setFullYear(out.getFullYear() + Math.floor(years));
  out.setMonth(out.getMonth() + Math.floor((years % 1) * 12));
  return out;
}

// RIGHT — millisecond-precision, no truncation
const MS_PER_YEAR = 365.25 * 86_400 * 1000;
function addYears(d: Date, years: number): Date {
  return new Date(d.getTime() + years * MS_PER_YEAR);
}
```

Before the fix, a chart computed in 2026 had dasha dates that drifted by **weeks** at the 60-year mark. After: millisecond consistency. A real client noticed before the test suite did.

### 4. Time ranges that cross midnight need wrap-aware comparison

Choghadiya, Hora, Varjyam, and Amrit Kalam slots that start at 23:30 and end at 01:15 are real cases. The naive comparison fails:

```ts
// WRONG — fails for any midnight-spanning window
const isNow = now >= start && now < end;

// RIGHT — handles the wrap
function inWindow(now: number, start: number, end: number): boolean {
  if (end < start) return now >= start || now < end;
  return now >= start && now < end;
}
```

The "NOW" badge never appeared for night choghadiya slots for months because of the naive form. I fixed it once, then found two more places it appeared in the codebase. Now there's a grep guard in the test suite that fails CI if anyone reintroduces the bare `>= && <` pattern in time-comparison code.

### 5. Canonical Jyotish tables must be defined **once** and grepped from everywhere

The Naisargika Maitri table — the planetary friendship matrix — existed in **sixteen separate files** in our codebase last year. Five of them disagreed on whether the Moon counts Jupiter as a friend (the correct answer, per *Brihat Parashara Hora Shastra* Ch. 3, is **neutral** — Moon has no natural enemies; only Mercury is a friend). Five files were wrong. Five different code paths gave five different answers.

The fix wasn't to update one file. The fix was:

1. Put the canonical table in **one** file (`src/lib/constants/dignities.ts`).
2. Add a pre-commit grep that fails the build if the constant name appears in any other file.
3. Delete the other fifteen copies, import from the canonical source.

Every Jyotish constant — exaltation degrees, debilitation, moolatrikona ranges, sign lords, karana cycles, nakshatra boundaries, naisargika friendships — is now defined exactly once.

## Verifying against neutral references

The Dekho Panchang engine is cross-checked against:

- **NASA / JPL Horizons** ephemeris data for planetary positions at multiple test dates and observer locations.
- **USNO (United States Naval Observatory)** solar tables for sunrise / sunset times.
- **Indian Government's official Saka calendar** for festival placement.
- **Surya Siddhanta** (c. 400 CE) for core constants — sidereal year length, planetary revolution periods, the Graha Yuddha (planetary war) victor rule.

The current tolerances:

| Quantity | Tolerance vs. reference |
|---|---|
| Sunrise / Sunset | ±1 minute of NASA/USNO |
| Tithi / Nakshatra boundary times | ±1–2 minutes |
| Sun position | ~0.01° (Meeus) / sub-arcsec (Swiss) |
| Moon position | ~0.5° (Meeus) / sub-arcsec (Swiss) |
| Festival dates | Exact day vs. government Saka calendar |
| Dasha date precision | Millisecond, no month-truncation |

Every release runs the full test suite against these references. Where any tolerance is broken, the release blocks.

## What I would tell my past self

1. **Treat astronomical inputs the way you treat money.** Wrap every `new Date(...)` like you would wrap a currency conversion. The bug surface is identical: silent loss of precision that compounds.
2. **Single source of truth, enforced at the grep level.** Constants in Jyotish are not "implementation details" — they are domain facts. Drift between two definitions is a bug being written.
3. **Reference values are non-negotiable.** "It type-checks" is not verification. Until you have computed the value, looked up the reference, and held them next to each other, the value is not verified. I had to learn this the hard way after shipping Adhika Ashadha when it should have been Adhika Jyeshtha — a one-month error that would have been caught in 30 seconds against a single reference.

## What is open

The astronomical engine is closed source for now — it is the moat. But the Panchang itself, every page, every chart, every computation result, is rendered live at [dekhopanchang.com](https://dekhopanchang.com) and accuracy reports are public on the [methodology page](https://dekhopanchang.com/en/about/methodology).

If you are building Panchang or Jyotish software, the headline finding is this: the bugs are not in the obvious places. They are in `new Date()`, in midnight-crossing comparisons, in constants that drifted between files, in fractional-year arithmetic. Tighten those first. Everything else follows.

---

*Aditya Kumar Jha is the founder of [Dekho Panchang](https://dekhopanchang.com), a free Vedic-astrology web application for daily Panchang, Kundali generation, and Muhurta finding. He writes from Switzerland.*
