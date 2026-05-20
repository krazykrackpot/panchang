---
title: "11 Ways to Measure Where the Zodiac Starts (And Why None of Them Agree)"
published: false
description: "Precession of the equinoxes, the difference between Western and Vedic astrology, and how I implemented 11 ayanamsha systems in TypeScript."
tags: typescript, astronomy, javascript, webdev
series: "Vedic Astronomy in the Browser"
---

*Part 3 of the "Vedic Astronomy in the Browser" series. [Part 1](https://dev.to/TODO) covered the panchang engine. [Part 2](https://dev.to/TODO) covered tithis, eclipses, and festivals.*

Every astrology app has the same quiet assumption baked into its code: it knows where the zodiac starts. Western apps put 0 degrees Aries at the vernal equinox. Vedic apps subtract a correction factor. Both claim accuracy. Neither mentions that this "correction factor" has at least eleven competing values, and the difference between them can shift your Sun sign.

I spent a month implementing all eleven in [Dekho Panchang](https://dekhopanchang.com?utm_source=devto&utm_medium=article&utm_campaign=vedic-astronomy-pt3). This article is about what I learned.

## The Problem in One Sentence

The stars move. Or rather, the Earth's axis wobbles. And this wobble means the point where the Sun crosses the celestial equator in March (the vernal equinox) drifts westward against the backdrop of fixed stars at about 1 degree every 72 years.

The ancient Greeks noticed this. Hipparchus measured it around 130 BCE. The technical name is "precession of the equinoxes." The practical consequence is that the zodiac signs defined by the seasons (tropical zodiac) and the zodiac signs defined by the stars (sidereal zodiac) are slowly drifting apart.

In 2026, the gap is about 24 degrees. That is nearly a full zodiac sign.

## Why This Matters to Anyone Building an Astrology App

If you build a Western astrology app, you use the tropical zodiac. The Sun enters Aries on the March equinox, always. Your code computes the Sun's ecliptic longitude and divides by 30 to get the sign. Done.

If you build a Vedic (Jyotish) astrology app, you use the sidereal zodiac. You compute the same tropical longitude, then subtract a correction called the "ayanamsha" to get the sidereal longitude. The sign comes from the corrected value.

```typescript
function toSidereal(tropicalLong: number, jd: number): number {
  const ayanamsha = getAyanamsha(jd);
  return ((tropicalLong - ayanamsha) % 360 + 360) % 360;
}
```

The entire Vedic system depends on `getAyanamsha()` returning the right number. And "right" is where the trouble starts.

## What Ayanamsha Actually Is

Ayanamsha (Sanskrit: अयनांश, "portion of the path") is the angular difference between the tropical and sidereal zodiacs at a given moment. It grows by about 50.3 arcseconds per year, roughly 1 degree every 71.6 years.

The formula looks deceptively simple. For the Lahiri system (the Indian government standard):

```typescript
function lahiriAyanamsha(jd: number): number {
  // t = Julian centuries from J2000.0 (1 Jan 2000, 12:00 TT)
  const t = (jd - 2451545.0) / 36525.0;
  // Polynomial: base value + linear precession rate + acceleration
  return 23.85306 + 1.39722 * t + 0.00018 * t * t - 0.000005 * t * t * t;
}
```

The linear term (1.39722 degrees per century) is the precession rate. The quadratic and cubic terms account for the fact that precession itself is not constant. The Earth's wobble is influenced by the Moon, the Sun, and the other planets, and their gravitational tugs change over time.

For May 2026, this polynomial gives approximately 24.19 degrees. The Swiss Ephemeris (the professional astronomical library my app uses as primary engine) gives 24.1855 degrees. The difference is about 16 arcseconds, well within the tolerance for astrological use.

## 11 Systems, 11 Answers

Here is the problem. The polynomial above has a base value of 23.85306 degrees at J2000.0. Where does that number come from?

It comes from a choice: which fixed star do you anchor the sidereal zodiac to?

The Lahiri system says the star Spica (called Chitra in Sanskrit) should sit at exactly 180 degrees sidereal longitude (0 degrees Libra). This is the Chitrapaksha ayanamsha, adopted by the Indian government in 1956 on the recommendation of the Calendar Reform Committee.

But there are other anchoring choices. Each gives a slightly different base value, which means a slightly different ayanamsha for any given date.

| System | Anchor Point | Ayanamsha at J2000 | Difference from Lahiri |
|--------|-------------|-------------------|----------------------|
| Lahiri (Chitrapaksha) | Spica at 180° | 23.853° | 0 (reference) |
| True Chitrapaksha | Spica's actual current position | ~23.85° | ~0.003° |
| KP (Krishnamurti) | Lahiri minus ~6 arcmin | 23.759° | -0.094° |
| Raman / BV Raman | Galactic centre theory | 22.378° | -1.475° |
| Yukteshwar | Holy Science (1894 text) | 21.767° | -2.086° |
| JN Bhasin | Modified Lahiri | 23.152° | -0.701° |
| Fagan-Bradley | Western sidereal, Aldebaran at 15° Taurus | 24.042° | +0.189° |
| True Revati | Zeta Piscium at 0° Aries | varies | ~-0.5° |
| True Pushya | Delta Cancri anchored | varies | ~-1° |
| Galactic Centre | Galactic centre at 0° Sagittarius | varies | ~-2° |

The "True" systems (True Chitra, True Revati, True Pushya) track the actual current position of a specific star rather than using a fixed epoch. Stars have proper motion. They drift. Spica moves about 0.04 arcseconds per year relative to the ecliptic frame. Over centuries, this adds up.

## The Code: Supporting All 11

The dual-engine architecture from Part 1 handles this cleanly. Swiss Ephemeris supports all these systems natively through its `set_sid_mode` function. The Meeus polynomial fallback handles the ones that can be expressed as simple polynomials.

```typescript
type AyanamshaType = 'lahiri' | 'true_chitra' | 'true_revati' | 'raman'
  | 'kp' | 'bv_raman' | 'yukteshwar' | 'jn_bhasin'
  | 'fagan_bradley' | 'true_pushya' | 'galactic_center';

function getAyanamsha(jd: number, type: AyanamshaType = 'lahiri'): number {
  // Swiss Ephemeris: sub-arcsecond accuracy for all systems
  if (isSwissEphAvailable()) {
    return swissAyanamsha(jd, type);
  }

  // Polynomial fallback for common systems
  const t = (jd - 2451545.0) / 36525.0;
  switch (type) {
    case 'lahiri':
    case 'true_chitra':
      return 23.85306 + 1.39722 * t + 0.00018 * t * t;
    case 'kp':
      return 23.76056 + 1.39722 * t + 0.00018 * t * t;
    case 'raman':
    case 'bv_raman':
      return 22.37778 + 1.38250 * t + 0.00015 * t * t;
    case 'yukteshwar':
      return 21.76667 + 1.38472 * t;
    case 'fagan_bradley':
      return 24.04222 + 1.39722 * t + 0.00018 * t * t;
    default:
      return 23.85306 + 1.39722 * t + 0.00018 * t * t;
  }
}
```

Notice that several systems share the same linear precession rate (1.39722). They differ only in the base constant. Lahiri and KP, for example, are offset by about 6 arcminutes (0.094 degrees). KP was developed by K.S. Krishnamurti who believed Lahiri's anchor point was very slightly off.

The Raman system uses a different precession rate (1.38250 vs 1.39722). BV Raman believed the general precession rate itself was measured differently from the standard IAU value. Whether this is astronomically defensible is a separate question. The code implements what each tradition specifies.

## The Swiss Ephemeris Wrapper

For the "True" systems, polynomials are not enough. True Chitrapaksha needs the actual position of Spica right now, computed from proper motion, parallax, and aberration. True Revati needs the same for Zeta Piscium. Only a full ephemeris engine can do this.

```typescript
function swissAyanamsha(jd: number, mode: string): number {
  const se = getSweph(); // native Node.js bindings to Swiss Ephemeris C library

  // KP is Lahiri with a fixed offset, not a separate Swiss Eph mode
  const isKP = mode === 'kp';
  const sidmConstant = isKP
    ? se.constants.SE_SIDM_LAHIRI
    : SIDM_MAP[mode]; // maps our type names to Swiss Eph integer constants

  se.set_sid_mode(sidmConstant, 0, 0);
  let result = se.get_ayanamsa_ut(jd);

  if (isKP) result -= 0.09444; // KP offset: ~6 arcmin less than Lahiri

  // Reset to default after use
  se.set_sid_mode(se.constants.SE_SIDM_LAHIRI, 0, 0);

  return result;
}
```

The `set_sid_mode` / `get_ayanamsa_ut` pair is how Swiss Ephemeris handles this. You tell it which sidereal mode you want, ask for the ayanamsha at your Julian Day, and it gives you the answer to sub-arcsecond precision.

The reset-after-use on the last line is important. Swiss Ephemeris is stateful. `set_sid_mode` changes a global setting that affects all subsequent calls. If a panchang computation runs between the `set_sid_mode` and the reset, it would get the wrong ayanamsha. In a multi-request server environment, this is a real concurrency bug. The code resets to Lahiri immediately after reading the value.

## The Practical Impact: Your Sign Changes

The difference between Lahiri and Raman is about 1.5 degrees. The difference between Lahiri and Yukteshwar is about 2 degrees. These seem small, but zodiac signs are only 30 degrees wide.

If your Sun is at 28 degrees tropical Taurus, the Lahiri ayanamsha (~24.19 degrees) puts it at about 3.8 degrees sidereal Taurus. The Yukteshwar ayanamsha (~22.1 degrees) puts it at about 5.9 degrees sidereal Taurus. Same sign, no drama.

But if your Sun is at 24.5 degrees tropical Taurus, Lahiri puts it at 0.3 degrees sidereal Taurus. Yukteshwar puts it at 2.4 degrees sidereal Taurus. Still fine. Now try 24.0 degrees tropical. Lahiri gives -0.19 degrees, which wraps to 29.8 degrees sidereal Aries. Yukteshwar gives 1.9 degrees sidereal Taurus.

Your Sun sign just changed. From Taurus to Aries. Because two Indian astronomers disagreed about where the zodiac starts.

This is not an edge case. About 8% of people have at least one planet within 2 degrees of a sign boundary. For those people, the choice of ayanamsha changes their chart.

## The Comparison Tool

I built a page that shows this side by side. Given a birth date and time, it computes tropical positions for all nine Vedic planets, then applies the selected ayanamsha to get sidereal positions, and flags any planets that change sign.

```typescript
function computeComparison(jd: number, ayanamshaType: AyanamshaType) {
  const ayanamsha = getAyanamsha(jd, ayanamshaType);
  const tropicalPositions = getPlanetaryPositions(jd);

  return tropicalPositions.map(planet => {
    const tropicalSign = Math.floor(planet.longitude / 30) + 1;
    const siderealLong = ((planet.longitude - ayanamsha) % 360 + 360) % 360;
    const siderealSign = Math.floor(siderealLong / 30) + 1;

    return {
      planet: planet.name,
      tropicalSign,
      siderealSign,
      isShifted: tropicalSign !== siderealSign,
    };
  });
}
```

For most charts, 6 or 7 of the 9 planets shift sign between tropical and sidereal. The Moon and fast-moving planets shift most often because they spend the least time in each sign.

## The Philosophical Question

Which ayanamsha is correct? The honest answer: nobody knows. The vernal equinox and the fixed stars are both real astronomical reference points. The choice between them is a convention, not a measurement.

The Lahiri system is backed by the Indian government and used by the vast majority of practicing astrologers. KP is preferred by the Krishnamurti Paddhati school. BV Raman had a large following in South India. Fagan-Bradley is used by the small Western sidereal community. Each has internal consistency. None has a physical basis for claiming superiority.

My approach: implement all of them, let the user choose, and make sure every computation consistently uses whichever system is selected. When someone picks KP, their dashas, transits, muhurtas, and birth chart all use KP. Mixing ayanamshas across features would give contradictory results.

The ayanamsha selector propagates through every calculation: panchang, kundali, shadbala, sade-sati, transits, muhurta. One setting, applied everywhere. This consistency is the engineering challenge. Getting the number right for one function is trivial. Making sure 22 modules all use the same number, from the same source, without any file having a hardcoded Lahiri assumption, is where the bugs live.

## What I Learned

Three things.

First, astronomical constants are not as constant as the name suggests. The precession rate changes. Star positions drift. The "fixed" stars are not fixed. Any system that anchors to a specific star inherits that star's proper motion as a slow, invisible source of error.

Second, the difference between "the code compiles" and "the code is consistent" is where real-world bugs hide. Five files each computing Lahiri independently would pass every unit test. The bug would show up when one file gets updated and the others do not. Single source of truth is not just a software principle. It is an astronomical necessity.

Third, the most interesting engineering problems are the ones where there is no single correct answer. Ayanamsha is not a bug to be fixed. It is a parameter to be supported. The code does not decide which zodiac is real. It computes all of them accurately and lets the user bring their own tradition.

## Try It

The comparison tool is live at [dekhopanchang.com/en/tropical-compare](https://dekhopanchang.com/en/tropical-compare?utm_source=devto&utm_medium=article&utm_campaign=vedic-astronomy-pt3). Enter a birth date and see how your planets move between tropical and sidereal, with all 11 ayanamsha systems available.

The full kundali (birth chart) generator supports ayanamsha selection in settings: [dekhopanchang.com/en/kundali](https://dekhopanchang.com/en/kundali?utm_source=devto&utm_medium=article&utm_campaign=vedic-astronomy-pt3).

Everything computed from Swiss Ephemeris (NASA JPL DE441). No external APIs. All the code runs on the server. Free, no account needed.

If you have questions about precession, sidereal coordinate systems, or why your star sign app disagrees with your pandit, I am in the comments.
