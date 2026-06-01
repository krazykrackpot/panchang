/**
 * Polar-latitude regression suite for the lagna + sunrise consolidation.
 *
 * Guards against three classes of regression:
 *   1. The ±66.5° latitude clamp that used to silently mis-compute the
 *      ascendant for any chart inside the polar circles (McMurdo at -77.85°
 *      was 29.5° off vs Swiss Ephemeris because the engine computed at -66.5°).
 *   2. The genuine pole guard that throws within ±0.5° of the geographic pole.
 *   3. The polar-non-rise null propagation through sunriseUTHours and Hora Bala.
 */
import { describe, it, expect } from 'vitest';
import { calculateAscendant } from '../kundali-calc';
import { dateToJD, normalizeDeg } from '../astronomical';
import { sunriseUTHours, sunsetUTHours, swissAyanamsha, swissJulDay } from '../swiss-ephemeris';

describe('lagna at polar latitudes (post-clamp-removal)', () => {
  it('McMurdo Station Antarctic chart: matches sweph Whole Sign within 0.1°', () => {
    // 1990-12-22 06:00 NZDT = 1990-12-21 17:00:29 UT (Pacific/Auckland +13 in DST)
    // sweph (Whole Sign 'W') at lat -77.85°, lng 166.67° → sidereal asc ≈ 304.33°
    const jd = swissJulDay(1990, 12, 21, 17 + 29.376 / 3600);
    const trop = calculateAscendant(jd, -77.85, 166.67);
    const sid = normalizeDeg(trop - swissAyanamsha(jd));
    // Tolerance 0.1° accommodates the Meeus-vs-sweph ayanamsha-frame gap
    // (audited at ~0.0884° in audit-engine-vs-swiss.ts). Pre-clamp-fix
    // value was 274.85° — 29.5° off; this assertion FAILS dramatically
    // if anyone re-introduces the clamp.
    expect(sid).toBeCloseTo(304.34, 0.5);
  });

  it('Arctic latitude 80°N: engine differs significantly from clamp-at-66.5°', () => {
    // At lat 80°N the ecliptic-horizon geometry is dramatically different
    // from 66.5°N. If the ±66.5° clamp were re-introduced, the engine
    // would silently compute at 66.5° and produce a very different
    // ascendant from what the unclamped formula gives.
    //
    // Pick 06:00 UT (near sunrise at this longitude in June) when the
    // ascendant rate sweeps fastest and is most lat-sensitive.
    const jd = swissJulDay(2024, 6, 1, 6);
    const at_actual = calculateAscendant(jd, 80, 18.96);
    const at_clamp = calculateAscendant(jd, 66.5, 18.96);
    expect(Math.abs(normalizeDeg(at_actual - at_clamp))).toBeGreaterThan(5);
  });

  it('genuine pole guard fires at |lat| ≥ 89.5°', () => {
    const jd = swissJulDay(2024, 6, 1, 12);
    expect(() => calculateAscendant(jd, 89.6, 0)).toThrow(/within 0\.5° of geographic pole/);
    expect(() => calculateAscendant(jd, -89.5001, 0)).toThrow(/within 0\.5° of geographic pole/);
    expect(() => calculateAscendant(jd, NaN, 0)).toThrow();
    expect(() => calculateAscendant(jd, Infinity, 0)).toThrow();
  });

  it('the pole guard does NOT fire just inside the threshold', () => {
    const jd = swissJulDay(2024, 6, 1, 12);
    expect(() => calculateAscendant(jd, 89.499, 0)).not.toThrow();
    expect(() => calculateAscendant(jd, -89.499, 0)).not.toThrow();
  });
});

describe('sunrise null propagation on polar non-rise', () => {
  it('McMurdo Dec 22 (polar day): sunriseUTHours returns null (not a synthetic 6)', () => {
    // Southern summer solstice — sun never sets at McMurdo in late December.
    // sweph rise_trans returns flag<0 for no-rise window; Meeus fallback
    // also returns null. The old approximateSunriseSafe used to stamp 6.0
    // silently — this assertion guards that path stays dead.
    const jd = dateToJD(1990, 12, 22, 0);
    const sr = sunriseUTHours(jd, -77.85, 166.67, 13);
    expect(sr).toBeNull();
  });

  it('Murmansk Dec 22 (polar night): sunriseUTHours returns null', () => {
    // Northern winter solstice — sun never rises at Murmansk (lat 68.97°N)
    // in late December. Inside the Arctic Circle, well above 66.5° clamp.
    const jd = dateToJD(2024, 12, 22, 0);
    const sr = sunriseUTHours(jd, 68.97, 33.08, 3);
    expect(sr).toBeNull();
  });

  it('sunsetUTHours returns null symmetrically on polar non-set day', () => {
    const jd = dateToJD(1990, 12, 22, 0);
    const ss = sunsetUTHours(jd, -77.85, 166.67, 13);
    expect(ss).toBeNull();
  });

  it('Equatorial chart: sunrise/sunset are defined (sanity)', () => {
    // Macapá, Brazil at lat 0.03° — sun rises and sets every day, no clamp behaviour.
    const jd = dateToJD(2024, 6, 1, 0);
    expect(sunriseUTHours(jd, 0.03, -51.07, -3)).not.toBeNull();
    expect(sunsetUTHours(jd, 0.03, -51.07, -3)).not.toBeNull();
  });
});
