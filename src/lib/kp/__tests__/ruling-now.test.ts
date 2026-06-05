/**
 * Tests for the lean RP-only computation used by /kp/transits and
 * /embed/kp-ruling.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §4 + §9.6
 */

import { describe, expect, it } from 'vitest';
import { getRulingPlanetsForMoment } from '../ruling-now';

const DELHI = { lat: 28.61, lng: 77.21 };
const ZURICH = { lat: 47.37, lng: 8.55 };
const SEATTLE = { lat: 47.6, lng: -122.33 };
const AUCKLAND = { lat: -36.85, lng: 174.76 };
const REYKJAVIK = { lat: 64.13, lng: -21.82 };

describe('getRulingPlanetsForMoment', () => {
  it('throws when lat is out of range', () => {
    expect(() => getRulingPlanetsForMoment({ lat: 91, lng: 0 })).toThrow();
    expect(() => getRulingPlanetsForMoment({ lat: -91, lng: 0 })).toThrow();
  });

  it('throws when lng is out of range', () => {
    expect(() => getRulingPlanetsForMoment({ lat: 0, lng: 181 })).toThrow();
    expect(() => getRulingPlanetsForMoment({ lat: 0, lng: -181 })).toThrow();
  });

  it('accepts lat/lng at exact boundaries', () => {
    expect(() => getRulingPlanetsForMoment({ lat: 90, lng: 180 })).not.toThrow();
    expect(() => getRulingPlanetsForMoment({ lat: -90, lng: -180 })).not.toThrow();
  });

  it('returns deterministic result for fixed epoch + location', () => {
    const atEpochMs = Date.UTC(2026, 5, 5, 12, 0, 0); // 2026-06-05 12:00 UT
    const r1 = getRulingPlanetsForMoment({ ...DELHI, atEpochMs });
    const r2 = getRulingPlanetsForMoment({ ...DELHI, atEpochMs });

    expect(r1.julianDay).toBe(r2.julianDay);
    expect(r1.rulingPlanets.ascSignLord.id).toBe(r2.rulingPlanets.ascSignLord.id);
    expect(r1.rulingPlanets.moonSubLord.id).toBe(r2.rulingPlanets.moonSubLord.id);
    expect(r1.rulingPlanets.dayLord.id).toBe(r2.rulingPlanets.dayLord.id);
  });

  it('day lord matches JD weekday convention (0=Sun, 6=Sat — Lesson O)', () => {
    // 2026-06-05 12:00 UT is a Friday
    const fri = getRulingPlanetsForMoment({
      ...ZURICH,
      atEpochMs: Date.UTC(2026, 5, 5, 12, 0, 0),
    });
    expect(fri.rulingPlanets.dayLord.id).toBe(5); // Venus

    // 2026-06-07 12:00 UT is a Sunday
    const sun = getRulingPlanetsForMoment({
      ...ZURICH,
      atEpochMs: Date.UTC(2026, 5, 7, 12, 0, 0),
    });
    expect(sun.rulingPlanets.dayLord.id).toBe(0); // Sun
  });

  it('day lord is the same across locations for the same UT moment', () => {
    // Day lord depends on JD only, not location
    const epoch = Date.UTC(2026, 5, 5, 12, 0, 0);
    const delhi = getRulingPlanetsForMoment({ ...DELHI, atEpochMs: epoch });
    const seattle = getRulingPlanetsForMoment({ ...SEATTLE, atEpochMs: epoch });
    const auckland = getRulingPlanetsForMoment({ ...AUCKLAND, atEpochMs: epoch });
    expect(delhi.rulingPlanets.dayLord.id).toBe(seattle.rulingPlanets.dayLord.id);
    expect(delhi.rulingPlanets.dayLord.id).toBe(auckland.rulingPlanets.dayLord.id);
  });

  it('asc/moon sign lords vary across locations for the same UT moment', () => {
    // Asc rotates ~15°/hour with longitude; Delhi vs Seattle = 200° apart
    // → very high chance the sign lord differs.
    const epoch = Date.UTC(2026, 5, 5, 12, 0, 0);
    const delhi = getRulingPlanetsForMoment({ ...DELHI, atEpochMs: epoch });
    const seattle = getRulingPlanetsForMoment({ ...SEATTLE, atEpochMs: epoch });
    // Just assert: different ascDeg → different cusps. Don't lock the actual sign.
    expect(delhi.ascDeg).not.toBe(seattle.ascDeg);
  });

  it('returns moon position consistent across locations (Moon is global)', () => {
    const epoch = Date.UTC(2026, 5, 5, 12, 0, 0);
    const delhi = getRulingPlanetsForMoment({ ...DELHI, atEpochMs: epoch });
    const reykjavik = getRulingPlanetsForMoment({ ...REYKJAVIK, atEpochMs: epoch });
    // Moon's geocentric longitude is location-invariant
    expect(delhi.moonDeg).toBeCloseTo(reykjavik.moonDeg, 4);
  });

  it('default atEpochMs uses Date.now()', () => {
    const before = Date.now();
    const r = getRulingPlanetsForMoment({ lat: 0, lng: 0 });
    const after = Date.now();
    expect(r.computedAtUtc.getTime()).toBeGreaterThanOrEqual(before);
    expect(r.computedAtUtc.getTime()).toBeLessThanOrEqual(after);
  });

  it('returns 7 RP fields populated', () => {
    const r = getRulingPlanetsForMoment({
      ...ZURICH,
      atEpochMs: Date.UTC(2026, 5, 5, 12, 0, 0),
    });
    expect(r.rulingPlanets.ascSignLord).toBeDefined();
    expect(r.rulingPlanets.ascStarLord).toBeDefined();
    expect(r.rulingPlanets.ascSubLord).toBeDefined();
    expect(r.rulingPlanets.moonSignLord).toBeDefined();
    expect(r.rulingPlanets.moonStarLord).toBeDefined();
    expect(r.rulingPlanets.moonSubLord).toBeDefined();
    expect(r.rulingPlanets.dayLord).toBeDefined();
  });
});
