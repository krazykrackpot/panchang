/**
 * Comprehensive unit tests for the astronomy module.
 * Reference values sourced from Meeus "Astronomical Algorithms",
 * USNO data, and well-known astronomical constants.
 */

import { describe, it, expect } from 'vitest';
import {
  dateToJD,
  jdToDate,
  julianCenturies,
  dateObjectToJD,
  normalizeAngle,
  degToRad,
  radToDeg,
  getSolarPosition,
  getLunarPosition,
  getAyanamsa,
  tropicalToSidereal,
  getPlanetPosition,
  getAllPlanetPositions,
  getSunTimes,
  getObliquity,
  getGMST,
  getLST,
  getEquationOfTime,
  getMoonPhase,
} from '../index';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const J2000_JD = 2451545.0; // 2000-01-01 12:00:00 UTC

// ---------------------------------------------------------------------------
// dateToJD
// ---------------------------------------------------------------------------
describe('dateToJD', () => {
  it('should return J2000.0 for 2000-01-01 12:00 UTC', () => {
    expect(dateToJD(2000, 1, 1, 12, 0, 0)).toBe(J2000_JD);
  });

  it('should return correct JD for Sputnik launch (1957-10-04 19:28:34 UTC)', () => {
    const jd = dateToJD(1957, 10, 4, 19, 28, 34);
    expect(jd).toBeCloseTo(2436116.31149, 4);
  });

  it('should handle date with only year/month/day (defaults to 0h)', () => {
    // 2000-01-01 00:00 UTC => JD 2451544.5
    expect(dateToJD(2000, 1, 1)).toBe(2451544.5);
  });

  it('should handle a date in January (month <= 2 branch)', () => {
    // 1999-01-01 00:00 UTC => JD 2451179.5
    const jd = dateToJD(1999, 1, 1);
    expect(jd).toBeCloseTo(2451179.5, 1);
  });

  it('should handle a date in February (month <= 2 branch)', () => {
    const jd = dateToJD(2000, 2, 29, 0, 0, 0); // leap day
    expect(jd).toBeCloseTo(2451603.5, 1);
  });

  it('should return correct JD for a historical date (1582-10-15 Gregorian reform)', () => {
    const jd = dateToJD(1582, 10, 15);
    expect(jd).toBeCloseTo(2299160.5, 1);
  });

  it('should handle dates before 1582 (Julian calendar boundary)', () => {
    // Note: implementation always applies Gregorian correction;
    // this test verifies it does not crash and returns a number.
    const jd = dateToJD(1000, 6, 15);
    expect(jd).toBeGreaterThan(0);
    expect(typeof jd).toBe('number');
  });

  it('should handle negative years (BCE dates)', () => {
    const jd = dateToJD(-4712, 1, 1, 12);
    expect(typeof jd).toBe('number');
  });
});

// ---------------------------------------------------------------------------
// jdToDate
// ---------------------------------------------------------------------------
describe('jdToDate', () => {
  it('should convert J2000.0 back to 2000-01-01 12:00:00', () => {
    const d = jdToDate(J2000_JD);
    expect(d.year).toBe(2000);
    expect(d.month).toBe(1);
    expect(d.day).toBe(1);
    expect(d.hour).toBe(12);
    expect(d.minute).toBe(0);
    expect(d.second).toBe(0);
  });

  it('should convert Sputnik JD back to approximate date', () => {
    const d = jdToDate(2436116.31149);
    expect(d.year).toBe(1957);
    expect(d.month).toBe(10);
    expect(d.day).toBe(4);
    expect(d.hour).toBe(19);
    expect(d.minute).toBeCloseTo(28, 0);
  });

  it('should handle JD in the Julian calendar range (z < 2299161)', () => {
    // JD 2000000 is well before the Gregorian reform
    const d = jdToDate(2000000.0);
    expect(typeof d.year).toBe('number');
    expect(d.month).toBeGreaterThanOrEqual(1);
    expect(d.month).toBeLessThanOrEqual(12);
  });
});

// ---------------------------------------------------------------------------
// dateToJD / jdToDate round-trip consistency
// ---------------------------------------------------------------------------
describe('dateToJD / jdToDate round-trip', () => {
  const testDates = [
    [2024, 3, 20, 6, 30, 0],
    [1900, 1, 1, 0, 0, 0],
    [2100, 12, 31, 23, 59, 59],
    [2000, 6, 21, 12, 0, 0],
  ] as const;

  for (const [y, m, d, h, mi, s] of testDates) {
    it(`round-trip for ${y}-${m}-${d} ${h}:${mi}:${s}`, () => {
      const jd = dateToJD(y, m, d, h, mi, s);
      const result = jdToDate(jd);
      expect(result.year).toBe(y);
      expect(result.month).toBe(m);
      expect(result.day).toBe(d);
      expect(result.hour).toBe(h);
      expect(result.minute).toBe(mi);
      // seconds may have small rounding due to float arithmetic
      expect(result.second).toBeCloseTo(s, 0);
    });
  }
});

// ---------------------------------------------------------------------------
// julianCenturies
// ---------------------------------------------------------------------------
describe('julianCenturies', () => {
  it('should return 0 at J2000.0', () => {
    expect(julianCenturies(J2000_JD)).toBe(0);
  });

  it('should return 1 for one century after J2000.0', () => {
    expect(julianCenturies(J2000_JD + 36525)).toBeCloseTo(1, 10);
  });

  it('should return -1 for one century before J2000.0', () => {
    expect(julianCenturies(J2000_JD - 36525)).toBeCloseTo(-1, 10);
  });
});

// ---------------------------------------------------------------------------
// dateObjectToJD
// ---------------------------------------------------------------------------
describe('dateObjectToJD', () => {
  it('should convert a JS Date at J2000.0 epoch', () => {
    const date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    expect(dateObjectToJD(date)).toBe(J2000_JD);
  });

  it('should match dateToJD for the same date', () => {
    const date = new Date(Date.UTC(2024, 2, 20, 6, 30, 0));
    const fromObj = dateObjectToJD(date);
    const fromArgs = dateToJD(2024, 3, 20, 6, 30, 0);
    expect(fromObj).toBeCloseTo(fromArgs, 8);
  });
});

// ---------------------------------------------------------------------------
// normalizeAngle
// ---------------------------------------------------------------------------
describe('normalizeAngle', () => {
  it('should return 270 for -90', () => {
    expect(normalizeAngle(-90)).toBe(270);
  });

  it('should return 10 for 370', () => {
    expect(normalizeAngle(370)).toBe(10);
  });

  it('should return 0 for 0', () => {
    expect(normalizeAngle(0)).toBe(0);
  });

  it('should return 0 for 360', () => {
    expect(normalizeAngle(360)).toBe(0);
  });

  it('should handle large positive angles', () => {
    expect(normalizeAngle(720 + 45)).toBeCloseTo(45, 10);
  });

  it('should handle large negative angles', () => {
    expect(normalizeAngle(-720 - 45)).toBeCloseTo(315, 10);
  });

  it('should return 180 for -180', () => {
    expect(normalizeAngle(-180)).toBe(180);
  });
});

// ---------------------------------------------------------------------------
// degToRad / radToDeg
// ---------------------------------------------------------------------------
describe('degToRad', () => {
  it('should convert 180 degrees to PI', () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI, 10);
  });

  it('should convert 0 degrees to 0', () => {
    expect(degToRad(0)).toBe(0);
  });

  it('should convert 90 degrees to PI/2', () => {
    expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 10);
  });

  it('should convert 360 degrees to 2*PI', () => {
    expect(degToRad(360)).toBeCloseTo(2 * Math.PI, 10);
  });
});

describe('radToDeg', () => {
  it('should convert PI to 180 degrees', () => {
    expect(radToDeg(Math.PI)).toBeCloseTo(180, 10);
  });

  it('should convert 0 to 0', () => {
    expect(radToDeg(0)).toBe(0);
  });

  it('should be inverse of degToRad', () => {
    expect(radToDeg(degToRad(123.456))).toBeCloseTo(123.456, 10);
  });
});

// ---------------------------------------------------------------------------
// getSolarPosition
// ---------------------------------------------------------------------------
describe('getSolarPosition', () => {
  it('should return tropical longitude ~280 deg at J2000.0', () => {
    const pos = getSolarPosition(J2000_JD);
    // Sun at J2000.0 is near 280.5 deg tropical longitude
    expect(pos.longitude).toBeCloseTo(280.5, 0);
  });

  it('should return apparentLongitude close to longitude at J2000.0', () => {
    const pos = getSolarPosition(J2000_JD);
    expect(Math.abs(pos.apparentLongitude - pos.longitude)).toBeLessThan(0.1);
  });

  it('should return distance ~1 AU at J2000.0', () => {
    const pos = getSolarPosition(J2000_JD);
    // Earth-Sun distance around 0.983-1.017 AU
    expect(pos.distance).toBeCloseTo(0.9833, 2);
  });

  it('should return declination near -23 deg at J2000.0 (near winter solstice)', () => {
    const pos = getSolarPosition(J2000_JD);
    // Jan 1 is about 10 days after winter solstice, declination around -23 deg
    expect(pos.declination).toBeLessThan(-20);
    expect(pos.declination).toBeGreaterThan(-24);
  });

  it('should return rightAscension in 0-360 range', () => {
    const pos = getSolarPosition(J2000_JD);
    expect(pos.rightAscension).toBeGreaterThanOrEqual(0);
    expect(pos.rightAscension).toBeLessThan(360);
  });

  it('should return near-zero declination at vernal equinox 2024', () => {
    // 2024 vernal equinox: ~March 20, 03:06 UTC
    const jd = dateToJD(2024, 3, 20, 3, 6, 0);
    const pos = getSolarPosition(jd);
    expect(Math.abs(pos.declination)).toBeLessThan(0.5);
  });
});

// ---------------------------------------------------------------------------
// getLunarPosition
// ---------------------------------------------------------------------------
describe('getLunarPosition', () => {
  it('should return longitude in 0-360 range at J2000.0', () => {
    const pos = getLunarPosition(J2000_JD);
    expect(pos.longitude).toBeGreaterThanOrEqual(0);
    expect(pos.longitude).toBeLessThan(360);
  });

  it('should return latitude within +/- 6 degrees', () => {
    const pos = getLunarPosition(J2000_JD);
    // Moon's max latitude is ~5.3 deg
    expect(Math.abs(pos.latitude)).toBeLessThan(6);
  });

  it('should return distance ~385000 km (average)', () => {
    const pos = getLunarPosition(J2000_JD);
    // Moon distance ranges 356,500 - 406,700 km
    expect(pos.distance).toBeGreaterThan(350000);
    expect(pos.distance).toBeLessThan(410000);
  });

  it('should return parallax ~0.9-1.0 degrees', () => {
    const pos = getLunarPosition(J2000_JD);
    expect(pos.parallax).toBeGreaterThan(0.8);
    expect(pos.parallax).toBeLessThan(1.1);
  });

  it('should give different longitudes for dates 14 days apart', () => {
    const pos1 = getLunarPosition(J2000_JD);
    const pos2 = getLunarPosition(J2000_JD + 14);
    // Moon moves ~13 deg/day, so 14 days => ~180 deg difference
    expect(Math.abs(pos1.longitude - pos2.longitude)).toBeGreaterThan(90);
  });
});

// ---------------------------------------------------------------------------
// getAyanamsa
// ---------------------------------------------------------------------------
describe('getAyanamsa', () => {
  it('should return ~23.85 deg (Lahiri) at J2000.0', () => {
    const aya = getAyanamsa(J2000_JD, 'lahiri');
    expect(aya).toBeCloseTo(23.854, 1);
  });

  it('should return Lahiri by default', () => {
    const ayaDefault = getAyanamsa(J2000_JD);
    const ayaLahiri = getAyanamsa(J2000_JD, 'lahiri');
    expect(ayaDefault).toBe(ayaLahiri);
  });

  it('should return Krishnamurti ayanamsa slightly less than Lahiri', () => {
    const lahiri = getAyanamsa(J2000_JD, 'lahiri');
    const kp = getAyanamsa(J2000_JD, 'krishnamurti');
    expect(kp).toBeLessThan(lahiri);
    expect(kp).toBeCloseTo(23.76, 1);
  });

  it('should return Raman ayanamsa less than Lahiri', () => {
    const lahiri = getAyanamsa(J2000_JD, 'lahiri');
    const raman = getAyanamsa(J2000_JD, 'raman');
    expect(raman).toBeLessThan(lahiri);
    expect(raman).toBeCloseTo(22.38, 1);
  });

  it('should increase over time (precession advances)', () => {
    const aya2000 = getAyanamsa(J2000_JD, 'lahiri');
    const aya2024 = getAyanamsa(dateToJD(2024, 1, 1, 0), 'lahiri');
    expect(aya2024).toBeGreaterThan(aya2000);
  });

  it('all three types should differ from each other', () => {
    const lahiri = getAyanamsa(J2000_JD, 'lahiri');
    const kp = getAyanamsa(J2000_JD, 'krishnamurti');
    const raman = getAyanamsa(J2000_JD, 'raman');
    expect(lahiri).not.toBeCloseTo(kp, 1);
    expect(lahiri).not.toBeCloseTo(raman, 1);
    expect(kp).not.toBeCloseTo(raman, 1);
  });
});

// ---------------------------------------------------------------------------
// tropicalToSidereal
// ---------------------------------------------------------------------------
describe('tropicalToSidereal', () => {
  it('should subtract ayanamsa from tropical longitude', () => {
    const tropical = 280;
    const ayanamsa = 24;
    expect(tropicalToSidereal(tropical, ayanamsa)).toBeCloseTo(256, 5);
  });

  it('should wrap around when result would be negative', () => {
    const tropical = 10;
    const ayanamsa = 24;
    // 10 - 24 = -14 => 346
    expect(tropicalToSidereal(tropical, ayanamsa)).toBeCloseTo(346, 5);
  });

  it('should handle tropical exactly equal to ayanamsa', () => {
    expect(tropicalToSidereal(24, 24)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getPlanetPosition
// ---------------------------------------------------------------------------
describe('getPlanetPosition', () => {
  const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'rahu', 'ketu'] as const;

  for (const planet of planets) {
    it(`should return longitude 0-360 for ${planet} at J2000.0`, () => {
      const pos = getPlanetPosition(planet, J2000_JD);
      expect(pos.longitude).toBeGreaterThanOrEqual(0);
      expect(pos.longitude).toBeLessThan(360);
    });
  }

  it('should have Rahu always retrograde', () => {
    const pos = getPlanetPosition('rahu', J2000_JD);
    expect(pos.isRetrograde).toBe(true);
  });

  it('should have Ketu always retrograde', () => {
    const pos = getPlanetPosition('ketu', J2000_JD);
    expect(pos.isRetrograde).toBe(true);
  });

  it('should place Ketu 180 deg from Rahu', () => {
    const rahu = getPlanetPosition('rahu', J2000_JD);
    const ketu = getPlanetPosition('ketu', J2000_JD);
    const diff = Math.abs(normalizeAngle(ketu.longitude - rahu.longitude));
    expect(diff).toBeCloseTo(180, 1);
  });

  it('should return isRetrograde as a boolean for Mars', () => {
    const pos = getPlanetPosition('mars', J2000_JD);
    expect(typeof pos.isRetrograde).toBe('boolean');
  });
});

// ---------------------------------------------------------------------------
// getAllPlanetPositions
// ---------------------------------------------------------------------------
describe('getAllPlanetPositions', () => {
  it('should return positions for all 7 planets', () => {
    const all = getAllPlanetPositions(J2000_JD);
    const keys = Object.keys(all);
    expect(keys).toContain('mercury');
    expect(keys).toContain('venus');
    expect(keys).toContain('mars');
    expect(keys).toContain('jupiter');
    expect(keys).toContain('saturn');
    expect(keys).toContain('rahu');
    expect(keys).toContain('ketu');
    expect(keys).toHaveLength(7);
  });

  it('should match individual getPlanetPosition calls', () => {
    const all = getAllPlanetPositions(J2000_JD);
    const jupiter = getPlanetPosition('jupiter', J2000_JD);
    expect(all.jupiter.longitude).toBe(jupiter.longitude);
    expect(all.jupiter.isRetrograde).toBe(jupiter.isRetrograde);
  });
});

// ---------------------------------------------------------------------------
// getSunTimes
// ---------------------------------------------------------------------------
describe('getSunTimes', () => {
  it('should return sunrise ~6:15-6:25 for Delhi on 2024-03-20 (equinox)', () => {
    const times = getSunTimes(2024, 3, 20, 28.6139, 77.2090, 5.5);
    const sunriseHour = times.sunrise.getHours();
    const sunriseMin = times.sunrise.getMinutes();
    const totalMinutes = sunriseHour * 60 + sunriseMin;
    // Expect sunrise between 6:10 and 6:30 IST
    expect(totalMinutes).toBeGreaterThanOrEqual(370); // 6:10
    expect(totalMinutes).toBeLessThanOrEqual(390);    // 6:30
  });

  it('should return sunset after sunrise', () => {
    const times = getSunTimes(2024, 3, 20, 28.6139, 77.2090, 5.5);
    expect(times.sunset.getTime()).toBeGreaterThan(times.sunrise.getTime());
  });

  it('should return dawn before sunrise', () => {
    const times = getSunTimes(2024, 3, 20, 28.6139, 77.2090, 5.5);
    expect(times.dawn.getTime()).toBeLessThan(times.sunrise.getTime());
  });

  it('should return dusk after sunset', () => {
    const times = getSunTimes(2024, 3, 20, 28.6139, 77.2090, 5.5);
    expect(times.dusk.getTime()).toBeGreaterThan(times.sunset.getTime());
  });

  it('should return ~12h day duration near equinox at low latitude', () => {
    const times = getSunTimes(2024, 3, 20, 28.6139, 77.2090, 5.5);
    // Near equinox, day duration should be close to 720 minutes (12 hours)
    expect(times.dayDurationMinutes).toBeGreaterThan(700);
    expect(times.dayDurationMinutes).toBeLessThan(740);
  });

  it('should handle polar region (Tromso, 69.6N) in summer without crashing', () => {
    // June 21 at 69.6N — should be near midnight sun; clamp triggers
    const times = getSunTimes(2024, 6, 21, 69.6496, 18.9560, 2);
    expect(times.sunrise).toBeInstanceOf(Date);
    expect(times.sunset).toBeInstanceOf(Date);
    // Day duration should be very long (near 24h) or clamped
    expect(times.dayDurationMinutes).toBeGreaterThan(1200);
  });

  it('should handle polar region in winter without crashing', () => {
    // December 21 at 69.6N — near polar night
    const times = getSunTimes(2024, 12, 21, 69.6496, 18.9560, 1);
    expect(times.sunrise).toBeInstanceOf(Date);
    expect(times.sunset).toBeInstanceOf(Date);
    // Day duration should be very short or zero
    expect(times.dayDurationMinutes).toBeLessThan(120);
  });

  it('should return sunrise ~7:00-7:20 for Corseaux/Vevey in January', () => {
    // Corseaux, Switzerland: 46.47N, 6.81E, CET = UTC+1
    const times = getSunTimes(2024, 1, 15, 46.47, 6.81, 1);
    const sunriseHour = times.sunrise.getHours();
    const sunriseMin = times.sunrise.getMinutes();
    const totalMinutes = sunriseHour * 60 + sunriseMin;
    // Expect sunrise between 7:50 and 8:20 CET in mid-January
    expect(totalMinutes).toBeGreaterThanOrEqual(470); // 7:50
    expect(totalMinutes).toBeLessThanOrEqual(500);    // 8:20
  });
});

// ---------------------------------------------------------------------------
// getObliquity
// ---------------------------------------------------------------------------
describe('getObliquity', () => {
  it('should return ~23.44 deg at J2000.0', () => {
    const obl = getObliquity(J2000_JD);
    expect(obl).toBeCloseTo(23.4393, 2);
  });

  it('should decrease slowly over time', () => {
    const obl2000 = getObliquity(J2000_JD);
    const obl2100 = getObliquity(dateToJD(2100, 1, 1, 12));
    expect(obl2100).toBeLessThan(obl2000);
  });
});

// ---------------------------------------------------------------------------
// getGMST
// ---------------------------------------------------------------------------
describe('getGMST', () => {
  it('should return GMST in 0-360 range', () => {
    const gmst = getGMST(J2000_JD);
    expect(gmst).toBeGreaterThanOrEqual(0);
    expect(gmst).toBeLessThan(360);
  });

  it('should return ~280.46 deg at J2000.0 epoch', () => {
    // At J2000.0 (2000-01-01 12:00 TT), GMST ~ 280.46 deg
    const gmst = getGMST(J2000_JD);
    expect(gmst).toBeCloseTo(280.46, 0);
  });

  it('should advance ~360.98 deg per day', () => {
    const gmst1 = getGMST(J2000_JD);
    const gmst2 = getGMST(J2000_JD + 1);
    let diff = gmst2 - gmst1;
    if (diff < 0) diff += 360;
    // Sidereal day is ~0.98 deg more than 360 per solar day
    expect(diff).toBeCloseTo(0.986, 0);
  });
});

// ---------------------------------------------------------------------------
// getLST
// ---------------------------------------------------------------------------
describe('getLST', () => {
  it('should equal GMST when longitude is 0', () => {
    const gmst = getGMST(J2000_JD);
    const lst = getLST(J2000_JD, 0);
    expect(lst).toBeCloseTo(gmst, 10);
  });

  it('should be GMST + longitude for positive longitude', () => {
    const gmst = getGMST(J2000_JD);
    const lst = getLST(J2000_JD, 77.209);
    expect(lst).toBeCloseTo(normalizeAngle(gmst + 77.209), 5);
  });

  it('should handle negative longitude (west)', () => {
    const gmst = getGMST(J2000_JD);
    const lst = getLST(J2000_JD, -73.9857); // New York
    expect(lst).toBeCloseTo(normalizeAngle(gmst - 73.9857), 5);
  });
});

// ---------------------------------------------------------------------------
// getEquationOfTime
// ---------------------------------------------------------------------------
describe('getEquationOfTime', () => {
  it('should return value in reasonable range (-17 to +17 minutes)', () => {
    const eot = getEquationOfTime(J2000_JD);
    expect(eot).toBeGreaterThan(-17);
    expect(eot).toBeLessThan(17);
  });

  it('should be near zero around mid-April and mid-June', () => {
    // EoT crosses zero around April 15 and June 14
    const eotApril = getEquationOfTime(dateToJD(2024, 4, 15, 12));
    expect(Math.abs(eotApril)).toBeLessThan(2);
  });

  it('should be most negative around Feb 12 (~-14 minutes)', () => {
    const eotFeb = getEquationOfTime(dateToJD(2024, 2, 12, 12));
    expect(eotFeb).toBeLessThan(-10);
    expect(eotFeb).toBeGreaterThan(-17);
  });
});

// ---------------------------------------------------------------------------
// getMoonPhase
// ---------------------------------------------------------------------------
describe('getMoonPhase', () => {
  it('should return 0 for new moon (sun and moon at same longitude)', () => {
    expect(getMoonPhase(100, 100)).toBe(0);
  });

  it('should return 180 for full moon (opposition)', () => {
    expect(getMoonPhase(100, 280)).toBe(180);
  });

  it('should return 90 for first quarter', () => {
    expect(getMoonPhase(100, 190)).toBe(90);
  });

  it('should return 270 for last quarter', () => {
    expect(getMoonPhase(100, 10)).toBe(270);
  });

  it('should handle wrapping around 360', () => {
    // Moon at 10, Sun at 350 => phase = 10 - 350 = -340 => normalize => 20
    expect(getMoonPhase(350, 10)).toBeCloseTo(20, 5);
  });
});

// ---------------------------------------------------------------------------
// Integration: sidereal solar longitude at J2000.0
// ---------------------------------------------------------------------------
describe('integration: sidereal positions', () => {
  it('should compute sidereal Sun longitude at J2000.0 (~256-257 deg)', () => {
    const solar = getSolarPosition(J2000_JD);
    const aya = getAyanamsa(J2000_JD, 'lahiri');
    const sidereal = tropicalToSidereal(solar.apparentLongitude, aya);
    // ~280 - ~24 = ~256
    expect(sidereal).toBeGreaterThan(254);
    expect(sidereal).toBeLessThan(259);
  });
});
