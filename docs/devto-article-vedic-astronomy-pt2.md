---
title: "370 Tithis, 4 Eclipses, and One Bug That Moved Dussehra by 11 Days"
published: false
description: "Computing the entire Hindu calendar in TypeScript — from lunar phase geometry to festival date resolution."
tags: typescript, astronomy, javascript, webdev
series: "Vedic Astronomy in the Browser"
---

In [Part 1](https://dev.to/dekhopanchang/vedic-astronomy-in-the-browser-pure-math-no-apis-2a8g) I built a panchang engine that could tell you the state of any moment: the tithi, the nakshatra, the yoga, the karana, and the vara. Five limbs computed from the Sun-Moon elongation at a single point in time.

That's useful for a daily snapshot. It is not useful for building a calendar.

A calendar needs every tithi transition in the year, with exact start and end times. It needs to know which lunar month each tithi falls in, and whether that month is ordinary or intercalary. It needs to predict eclipses from orbital geometry. And it needs to map all of this onto the 150+ festivals that people actually observe, each defined by a specific lunar coordinate: this month, this fortnight, this tithi.

I got all three working. Then I shipped a bug that moved Dussehra by 11 days. The computation was correct. The mapping was wrong.

This article covers the three hardest problems I solved while building [Dekho Panchang](https://dekhopanchang.com?utm_source=devto&utm_medium=article&utm_campaign=vedic-astronomy-pt2): the tithi table, eclipse prediction, and the festival engine.

## The Tithi Table

A tithi is not a fixed-length day. In the Gregorian calendar, a day is always 24 hours. A tithi is the time it takes for the Moon to gain 12 degrees of elongation from the Sun. Because the Moon's orbit is elliptical, its angular speed varies between roughly 11.5 and 15.4 degrees per day. The Sun also moves at a variable rate (about 0.95 to 1.02 degrees per day), so the relative elongation rate changes continuously. A tithi can last anywhere from 19 to 26 hours. That's a 37% variation.

You cannot divide a lunar month into 30 equal slots. You have to find each boundary individually.

A naive approach would be to sample the elongation every minute and look for crossings. That works, but it's expensive: 525,600 function evaluations per year, each involving Sun and Moon longitude calculations. For a pre-computed table that gets built once, that's tolerable. For on-demand computation with a 2-second time budget, it's too slow.

The approach is binary search. Each tithi boundary corresponds to a specific Sun-Moon elongation: 0 degrees for the start of Shukla Pratipada, 12 degrees for Shukla Dwitiya, 24 degrees for Shukla Tritiya, all the way up to 348 degrees for Krishna Chaturdashi. For each boundary, I scan forward in coarse 2-hour steps until the tithi number changes, then binary-search the interval for 20 iterations. That converges to about 5 seconds of precision, which is more than enough.

```typescript
function findTithiEndJd(startJd: number, currentTithi: number): number {
  const step = 2 / 24; // 2 hours in Julian Day units
  const maxJd = startJd + 2.0; // scan up to 2 days forward

  // Coarse scan: walk forward until the tithi number changes
  let lo = startJd;
  let hi = maxJd;
  for (let jd = startJd + step; jd <= maxJd; jd += step) {
    const t = calculateTithi(jd).number;
    if (t !== currentTithi) {
      lo = jd - step;
      hi = jd;
      break;
    }
  }

  // Binary search: 20 iterations gives ~5-second precision
  // (2 hours / 2^20 = 0.007 seconds)
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (calculateTithi(mid).number === currentTithi) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return (lo + hi) / 2;
}
```

`calculateTithi` computes the Sun-Moon elongation at a given Julian Day and divides by 12 to get the tithi number (1-30). It's the same function from Part 1. The binary search just calls it repeatedly until it finds the exact moment where the number flips.

Why 2-hour steps for the coarse scan? A tithi lasts at minimum about 19 hours, so stepping by 2 hours guarantees we will never skip an entire tithi. We might overshoot the boundary by up to 2 hours, but that's what the binary search is for. The 20 iterations of binary search divide a 2-hour interval by 2^20, giving a precision of about 0.007 seconds. In practice, the Sun and Moon longitude functions themselves have errors larger than that, so the limiting factor is the ephemeris, not the search.

Starting from 1 December of the previous year (to catch tithis that straddle the year boundary), the engine walks forward through every tithi, calling `findTithiEndJd` for each one. The result is a chain: the end of one tithi is the start of the next. The output is roughly 370 entries per year. Each entry has exact Julian Day start and end times, local time strings, the paksha (Shukla or Krishna), and flags for two special cases.

**Kshaya tithis** happen when a tithi is so short that no sunrise falls within it. It starts after one sunrise and ends before the next. The tithi effectively gets skipped in the civil calendar. The engine detects this by scanning every calendar date between the start and end of the tithi and checking whether sunrise falls within the window. If no sunrise does, `isKshaya` is true.

**Vriddhi tithis** are the opposite. A tithi is long enough that two sunrises fall within it. When a tithi spans two days, you need a rule for which day "owns" the festival. The rule is simple: for Ekadashi, use the second day. For everything else, use the first day. This is the Smarta Dwi-Ekadashi rule, and it's one of those things that sounds arbitrary until you read the Dharmasindhu and realise it's been standardised for centuries.

### Dual masa assignment

Every tithi also needs a lunar month label. The Hindu calendar has two competing systems for this. The Amanta system (used in South India and by most reference sources) runs from New Moon to New Moon. The Purnimanta system (used in North India) runs from Full Moon to Full Moon. The same tithi can have different month names depending on which system you use.

For the Amanta months, the engine finds every true New Moon by scanning Sun-Moon elongation for zero-crossings. At each New Moon, it reads the Sun's sidereal longitude to determine the sign. The month is named by the sign the Sun occupies. If two consecutive New Moons have the Sun in the same sign, no Sankranti (solar ingress) occurred during that month, and it is classified as Adhika (intercalary).

```typescript
// At each pair of consecutive New Moons:
const sunSid1 = toSidereal(sunLongitude(nm1.jd), nm1.jd);
const sunSid2 = toSidereal(sunLongitude(nm2.jd), nm2.jd);
const sign1 = Math.floor(sunSid1 / 30) + 1; // 1-12
const sign2 = Math.floor(sunSid2 / 30) + 1;

// No Sankranti between these two New Moons = Adhika month
const isAdhika = sign1 === sign2;

// Month name comes from the Sun's sign (classical convention)
// Mesha(1) -> Vaishakha, Vrishabha(2) -> Jyeshtha, ... Meena(12) -> Chaitra
const monthName = getHinduMonth(sign1);
```

This correctly produces Adhika Jyeshtha in 2026, Adhika Chaitra in 2029, and no false Adhika months in 2027. Getting here took three iterations.

The first version tried to derive month boundaries from the tithi scan's Amavasya entries. The Amavasya (tithi #30) starts when the Sun-Moon elongation hits 348 degrees, which is roughly 24 hours before the true conjunction at 0 degrees. I was using the start of the Amavasya tithi as a rough anchor for the New Moon, then refining with a +/- 24 hour search for the minimum elongation. This worked most of the time, but occasionally the refinement converged on the wrong conjunction, producing phantom Adhika months. 2027 showed both Adhika Ashadha and Adhika Shravana, when neither exists.

The second version tried to fix this with a tighter refinement window, but jitter from the elongation function near 0/360 degree crossings made it unreliable.

The third version, which shipped, decouples month detection entirely from the tithi scan. It does its own daily scan of Sun-Moon elongation looking for 360-to-0 crossings, then binary-searches each crossing to sub-minute precision. This gives the exact New Moon moment, from which the Sun's sidereal sign can be reliably read. Two clean phases, no coupling between them.

## Eclipse Prediction

An eclipse happens when a New Moon or Full Moon occurs close to one of the lunar nodes. The nodes are the two points where the Moon's orbital plane crosses the ecliptic (the Sun's apparent path). The Moon's orbit is tilted about 5.14 degrees relative to the ecliptic, so most New Moons and Full Moons pass above or below the Sun's disc or Earth's shadow. Only when the Moon is near a node does its latitude become small enough for an eclipse to occur.

In Vedic astronomy these nodes are called Rahu (ascending node) and Ketu (descending node). They drift westward at about 0.053 degrees per day, completing one full cycle every 18.6 years. This is why eclipse seasons shift earlier by about 20 days each year.

The key quantity is the Moon's ecliptic latitude at the moment of conjunction (New Moon) or opposition (Full Moon). If the Moon is right at a node, its latitude is zero and you get a deep, central eclipse. As the Moon moves away from the node, its latitude increases and the eclipse becomes partial, then penumbral (for lunar eclipses), then there's no eclipse at all.

The thresholds depend on the apparent sizes of the Sun, Moon, and Earth's shadow, which in turn depend on the Moon's distance. The Moon's distance varies by about 13% between perigee and apogee. I use the Moon's daily angular speed as a proxy: faster motion means the Moon is closer, which means a larger apparent disc. At average speed (13.2 degrees/day), the Moon's apparent radius is about 0.259 degrees. At perigee (14.5 degrees/day), it's about 0.283 degrees. That difference determines whether a central solar eclipse is total (Moon larger than Sun) or annular (Moon smaller, leaving a ring).

```typescript
for (const nm of newMoons) {
  const jd = (nm.startJd + nm.endJd) / 2;
  const positions = getPlanetaryPositions(jd);
  const moonPos = positions.find(p => p.id === 1); // Moon
  if (!moonPos) continue;

  const moonLat = Math.abs(moonPos.latitude);
  const moonSpeed = Math.abs(moonPos.speed);

  // Scale thresholds by apparent size (speed is a proxy for distance)
  const speedFactor = moonSpeed / 13.2; // 13.2 deg/day = average
  const partialLimit = 1.25 * speedFactor + 0.26 + 0.15;
  const centralLimit = 0.53 * speedFactor + 0.26 + 0.10;

  if (moonLat < partialLimit) {
    let magnitude: 'total' | 'annular' | 'partial';
    if (moonLat < centralLimit) {
      // Close enough for central: total if Moon is close (fast),
      // annular if Moon is far (slow, smaller apparent disc)
      magnitude = moonSpeed > 13.0 ? 'total' : 'annular';
    } else {
      magnitude = 'partial';
    }

    // Which node? Compare Sun's longitude to Rahu and Ketu
    const rahuLon = positions.find(p => p.id === 7)?.longitude ?? 0;
    const ketuLon = normalizeDeg(rahuLon + 180);
    const distToRahu = angularDistance(sunLongitude(jd), rahuLon);
    const distToKetu = angularDistance(sunLongitude(jd), ketuLon);
    const node = distToRahu < distToKetu ? 'rahu' : 'ketu';

    eclipses.push({ type: 'solar', magnitude, node, date: jdToDate(jd) });
  }
}
```

The same logic runs for Full Moons with different thresholds. Lunar eclipses have three tiers: the Moon can pass through the penumbra (faint outer shadow), the umbra (dark inner shadow) partially, or the umbra entirely for a total eclipse. The umbral radius at the Moon's distance is roughly 0.72 degrees on average, the penumbral radius roughly 1.28 degrees.

I deliberately set the thresholds wider than the theoretical limits by about 0.15 degrees. This is because the Moon latitude comes from Swiss Ephemeris via the Meeus-derived positions, which have a precision limit of about 0.1 degrees. Generous thresholds ensure we never miss a real eclipse. The trade-off is false positives at the margins.

### Hybrid validation

To handle those false positives, the engine cross-checks against a pre-computed table of eclipses from NASA data (2024-2035). Any eclipse the engine finds that does not appear in the table (within one day tolerance) gets discarded. Any eclipse in the table that the engine missed gets injected.

```typescript
const nasaTable = getEclipsesForYear(year);
if (nasaTable.length > 0) {
  const validated: EclipseEvent[] = [];

  // Keep engine results that match a NASA entry (same type, +/- 1 day)
  for (const e of eclipses) {
    const match = nasaTable.find(t =>
      t.kind === e.type &&
      Math.abs(daysBetween(t.date, e.date)) <= 1
    );
    if (match) validated.push(e);
  }

  // Inject any NASA eclipses the engine missed
  for (const t of nasaTable) {
    const alreadyFound = validated.some(e =>
      e.type === t.kind &&
      Math.abs(daysBetween(t.date, e.date)) <= 1
    );
    if (!alreadyFound) {
      validated.push(buildEclipseFromTable(t));
    }
  }

  return validated;
}
```

This hybrid approach gives us the best of both worlds. The engine provides the astronomical details (node identification, sidereal longitude, eclipse type classification) while the NASA table provides ground truth on which eclipses actually happen. For years beyond 2035, the engine runs unsupervised, which is fine because its recall is near-perfect. It just occasionally hallucinates a penumbral lunar eclipse at the margins.

One thing worth noting: the Meeus fallback (when Swiss Ephemeris is not available) returns Moon latitude as zero, because the simplified Meeus series only computes longitude and speed, not latitude. In that case, eclipse detection is disabled entirely, because with latitude always zero, every New Moon and Full Moon would register as a total eclipse. The engine logs a warning and returns an empty array rather than returning garbage. This is a deliberate design choice: wrong data is worse than no data.

## The Festival Engine

Dussehra was 11 days early. Diwali was 30 days early. Users noticed before I did.

The computation was mathematically correct. Every tithi boundary was accurate to within a minute. The month assignments matched Prokerala. The bug was in one comparison.

Here is the problem. Hindu festivals are defined by lunar calendar coordinates. Dussehra is Ashvina Shukla Dashami (the 10th tithi of the bright fortnight of the month Ashvina). Diwali is Kartika Krishna Amavasya (the New Moon of the dark fortnight of Kartika). To display these on a Gregorian calendar, you scan your tithi table for entries matching the right month + paksha + tithi number.

Every reference source defines festivals using Purnimanta month names. This is the convention used by Prokerala, Drik Panchang, and the traditional almanacs. In my code, each tithi entry has both an Amanta and a Purnimanta month label.

During Shukla Paksha (bright fortnight), both systems agree. Ashvina Shukla Dashami is Ashvina in both Amanta and Purnimanta. No problem.

During Krishna Paksha (dark fortnight), they diverge. The Purnimanta system is one month ahead of Amanta. What Purnimanta calls "Kartika Krishna Amavasya" (Diwali) is "Ashvina Krishna Amavasya" in Amanta.

My code was matching `entry.masa.amanta === definition.masa` for all festivals. For Shukla Paksha festivals this worked by coincidence, because the two systems agree. For Krishna Paksha festivals, it was looking in the wrong month. Diwali, defined as Kartika in the festival definitions, was being searched in the Amanta column where it's listed as Ashvina. No match. The engine would find a Kartika Amavasya in the Amanta column, but that was actually Purnimanta Kartika which is a full month later. Diwali landed 30 days late. Dussehra, being Shukla Paksha, should have been fine, but a secondary Kala-Vyapti overlap calculation was pulling a date from the wrong month, shifting it by 11 days.

The fix was a branching comparison:

```typescript
for (const def of MAJOR_FESTIVALS) {
  const tithiNum = defToTithiNumber(def);

  const matches = table.entries.filter(entry => {
    if (entry.number !== tithiNum) return false;
    if (entry.masa.isAdhika) return false; // skip intercalary months

    if (tithiNum <= 15) {
      // Shukla Paksha: Amanta and Purnimanta agree.
      // Match directly against Amanta.
      return entry.masa.amanta === def.masa;
    }

    // Krishna Paksha: definition uses Purnimanta convention,
    // which is one month AHEAD of Amanta.
    // So: Amanta's NEXT month should equal the definition's month.
    return getNextHinduMonth(entry.masa.amanta) === def.masa;
  });

  // ... date resolution, Kala-Vyapti, puja muhurat
}
```

One function call. `getNextHinduMonth` maps 'ashvina' to 'kartika', 'kartika' to 'margashirsha', and so on through the twelve-month cycle. Three weeks of confused users, fixed by six characters of code change plus a function call.

The worst part is that I had both month labels available in each tithi entry. The data was right there. I was just reading the wrong column. This is the kind of bug that no amount of type safety catches. TypeScript will happily let you compare `entry.masa.amanta` with a string that happens to be a Purnimanta month name. Both are `string`. Both compile. One is wrong.

### Kala-Vyapti: when a tithi spans two days

Even after finding the right tithi entry, you sometimes need to decide which of two calendar days to assign the festival to. A tithi lasting 25 hours will straddle two sunrises. Which day is "the" festival day?

The answer depends on the festival. Each festival has a preferred time window, called its Muhurta Rule. Ram Navami should be observed during Madhyahna (the middle fifth of the daytime). Diwali during Pradosh (after sunset). Maha Shivaratri during Nishita Kaal (the eighth muhurta of the night).

The engine computes the overlap of the tithi with the festival's preferred window on both candidate days, then picks the day with greater overlap. Night festivals (Pradosh, Nishita) prefer the earlier day when overlap is equal. Day festivals pick the greater overlap.

```typescript
// Compute the festival's time window on both candidate days
const win1 = getKalaWindow(day1, lat, lon, timezone, rule);
const win2 = getKalaWindow(day2, lat, lon, timezone, rule);

// Measure tithi overlap with each window (in Julian Day fractions)
const overlap1 = Math.max(0,
  Math.min(tithi.endJd, win1.endJd) - Math.max(tithi.startJd, win1.startJd)
);
const overlap2 = Math.max(0,
  Math.min(tithi.endJd, win2.endJd) - Math.max(tithi.startJd, win2.startJd)
);

if (overlap1 > 0 && overlap2 === 0) {
  festivalDate = day1;
} else if (overlap1 > 0 && overlap2 > 0) {
  // Night festivals (pradosh, nishita) prefer the earlier day
  if (['pradosh', 'nishita'].includes(rule) || overlap1 >= overlap2) {
    festivalDate = day1;
  }
}
```

This is the Dharmasindhu resolution method. It handles the standard cases well. Edge cases, like a Kshaya tithi (no sunrise within it at all), fall back to the preceding day, which the `sunriseDate` field already points to.

### Ekadashi and Parana: the most complex recurring vrat

Ekadashi (the 11th tithi of each fortnight) deserves special mention because it has the most complex rules of any recurring observance.

There are 24 named Ekadashis per year, each with a specific name tied to its lunar month and paksha. Nirjala Ekadashi in Jyeshtha Shukla, Devshayani in Ashadha Shukla, Kamika in Shravana Krishna, and so on. During Adhika (intercalary) months, the Ekadashis get special names: Kamala for Shukla, Padmini for Krishna.

The fasting rules are strict. You fast from sunrise on Ekadashi day until a specific window the next morning called Parana. The Parana window is bounded by multiple constraints: it must be after Hari Vasara ends (the first quarter of the Dwadashi tithi's duration), it should fall within Pratahkala (the first fifth of daytime), and it must avoid Madhyahna (the middle fifth of daytime). If Hari Vasara ends during Madhyahna, the Parana shifts to after Madhyahna ends.

The engine computes all of this from the tithi table. It reads the Dwadashi entry (the one right after Ekadashi), calculates its duration, derives the Hari Vasara end point, computes the five-fold daytime division from sunrise and sunset, and resolves the optimal window. The output includes the Parana start and end times, sunrise time, Hari Vasara end, Dwadashi end, and Madhyahna boundaries. That is seven separate time calculations for each of the 24 Ekadashis per year.

### The scope

The festival engine currently handles 150+ festivals from declarative definitions, 24 named Ekadashis with full Parana calculations, 12 Sankrantis (solar ingress dates), monthly recurring vrats (Pradosham, Chaturthi, Purnima, Amavasya), and puja muhurat windows for major festivals (Diwali Lakshmi Puja during Vrishabha Kaal, Ram Navami during Madhyahna, Maha Shivaratri during Nishita Kaal).

Each festival definition is declarative: a slug, a month name, a paksha, a tithi number, and a muhurta rule. The engine does the rest. Adding a new festival is a single object in an array. No date computation code needs to change.

All of it runs in TypeScript, server-side on initial page load, then cached. No external APIs, no database lookups for festival dates. The tithi table for a full year computes in about 2 seconds on a modern machine. Eclipse detection adds negligible time since it just iterates the New Moon and Full Moon entries that already exist.

## What I learned

The Amanta-Purnimanta bug taught me something I keep relearning. The hard part of calendar computation is not the astronomy. The Sun-Moon elongation, the binary search, the node detection, the eclipse thresholds: those are well-defined problems with well-defined solutions. The hard part is the conventions. Two month-naming systems that agree half the time and diverge the other half. Festival definitions that use one convention while your data uses the other. The mismatch is invisible during testing if you only test Shukla Paksha festivals.

I now have a rule: after touching any festival date logic, verify at least three Krishna Paksha festivals against a reference source for the same year and location. If I had done that before shipping, the bug would have been caught in minutes.

The second lesson is about testing coverage. My test suite had tithi accuracy tests (comparing computed times against reference values), Adhika month detection tests, and Ekadashi name resolution tests. All passing. None of them tested a Krishna Paksha festival date end-to-end. The gap was invisible until users reported it.

The third lesson is about the cost of dual conventions in a single system. If I had stored everything in Amanta and done the Purnimanta conversion only at display time, the bug could not have happened. Having both conventions in the data model, with some code reading one column and other code reading the other, created a surface area for exactly this kind of mismatch. I kept both because users need to see both month names, but the festival matching should have been locked to a single convention from the start.

## What's next

Part 3 will cover the muhurta scoring engine (multi-factor auspiciousness rating for 20+ activities), the KP system (sub-lord theory implemented from Placidus house cusps), and transit prediction. Each of these builds on top of the tithi table and the planetary position engine from Parts 1 and 2. The muhurta engine alone checks seven different inauspicious period types before scoring a time slot, and the KP system requires computing Placidus house cusps from scratch, since no JavaScript library does it accurately for all latitudes.

The full application is live at [Dekho Panchang](https://dekhopanchang.com?utm_source=devto&utm_medium=article&utm_campaign=vedic-astronomy-pt2). Everything described here runs in the browser with zero external API calls.

If you have questions about the astronomical algorithms, the Hindu calendar system, or the trade-offs involved in building this kind of engine in the browser, I'm in the comments.
