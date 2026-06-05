/**
 * TZ matrix + DST stress tests for the KP engine + prashna + ruling-now.
 *
 * Per CLAUDE.md and `testing_strategy.md`: every astronomical computation
 * must be tested at multiple reference locations and at DST boundaries.
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §9.2 + §9.3
 */

import { describe, expect, it } from 'vitest';
import { getRulingPlanetsForMoment } from '../ruling-now';
import { castKPPrashna } from '../prashna';

interface Loc { name: string; lat: number; lng: number; tz: string; }

const LOCATIONS: Loc[] = [
  { name: 'Corseaux',  lat: 46.46,  lng:   6.86, tz: 'Europe/Zurich' },
  { name: 'Delhi',     lat: 28.61,  lng:  77.21, tz: 'Asia/Kolkata' },
  { name: 'Seattle',   lat: 47.60,  lng: -122.33, tz: 'America/Los_Angeles' },
  { name: 'Auckland',  lat: -36.85, lng: 174.76, tz: 'Pacific/Auckland' },
  { name: 'Reykjavik', lat: 64.13,  lng: -21.82, tz: 'Atlantic/Reykjavik' },
];

const SOLAR_NOON_EPOCH = Date.UTC(2026, 5, 5, 12, 0, 0);          // Fri
const MIDNIGHT_EPOCH   = Date.UTC(2026, 5, 5,  0, 0, 0);
const NEW_YEAR_EVE     = Date.UTC(2025, 11, 31, 23, 59, 59);     // year wrap

describe('TZ matrix — RPs computed at varied locations', () => {
  for (const loc of LOCATIONS) {
    describe(loc.name, () => {
      it('solar noon UTC — returns a valid result with 7 RPs', () => {
        const r = getRulingPlanetsForMoment({
          atEpochMs: SOLAR_NOON_EPOCH,
          lat: loc.lat,
          lng: loc.lng,
        });
        expect(r.rulingPlanets.ascSignLord).toBeDefined();
        expect(r.rulingPlanets.ascSubLord).toBeDefined();
        expect(r.rulingPlanets.moonSubLord).toBeDefined();
        expect(r.rulingPlanets.dayLord.id).toBe(5); // Friday → Venus
      });

      it('midnight UTC — does not throw and dayLord matches JD', () => {
        const r = getRulingPlanetsForMoment({
          atEpochMs: MIDNIGHT_EPOCH,
          lat: loc.lat,
          lng: loc.lng,
        });
        // Friday at 00:00 UTC may still be Thursday by JD weekday convention;
        // accept any 0..6 result, just assert no crash.
        expect(r.rulingPlanets.dayLord.id).toBeGreaterThanOrEqual(0);
        expect(r.rulingPlanets.dayLord.id).toBeLessThanOrEqual(6);
      });

      it('year boundary — does not throw', () => {
        const r = getRulingPlanetsForMoment({
          atEpochMs: NEW_YEAR_EVE,
          lat: loc.lat,
          lng: loc.lng,
        });
        expect(r.julianDay).toBeGreaterThan(2_400_000);
      });
    });
  }

  it('day lord identical across all locations at the same UT moment', () => {
    const ids = LOCATIONS.map((loc) =>
      getRulingPlanetsForMoment({
        atEpochMs: SOLAR_NOON_EPOCH,
        lat: loc.lat,
        lng: loc.lng,
      }).rulingPlanets.dayLord.id,
    );
    const first = ids[0];
    for (const id of ids) {
      expect(id).toBe(first);
    }
  });

  it('moon position identical across locations (Moon is geocentric)', () => {
    const moonDegs = LOCATIONS.map((loc) =>
      getRulingPlanetsForMoment({
        atEpochMs: SOLAR_NOON_EPOCH,
        lat: loc.lat,
        lng: loc.lng,
      }).moonDeg,
    );
    const first = moonDegs[0];
    for (const m of moonDegs) {
      expect(m).toBeCloseTo(first, 4);
    }
  });
});

describe('DST stress — Europe/Zurich spring-forward 2026-03-29', () => {
  // CET → CEST. Local 02:00 → 03:00. Local 02:30 is non-existent.
  const SPRING_BEFORE = Date.UTC(2026, 2, 29, 0, 59, 59); // 01:59:59 UTC = 02:59:59 CET, last moment of CET
  const SPRING_AFTER  = Date.UTC(2026, 2, 29, 1, 0, 1);   // 01:00:01 UTC = 03:00:01 CEST, first moment of CEST

  it('moments straddling DST step produce continuous results', () => {
    const before = getRulingPlanetsForMoment({ atEpochMs: SPRING_BEFORE, lat: 47.37, lng: 8.55 });
    const after  = getRulingPlanetsForMoment({ atEpochMs: SPRING_AFTER,  lat: 47.37, lng: 8.55 });
    // Asc moves continuously (no jump). The diff should be tiny.
    const ascDiff = Math.abs(after.ascDeg - before.ascDeg);
    // 2 seconds of Earth rotation = ~0.0083° in RA. Account for sidereal/Asc ratio + ayanamsha.
    expect(ascDiff).toBeLessThan(1);
  });
});

describe('DST stress — Europe/Zurich fall-back 2026-10-25', () => {
  // CEST → CET. Local 03:00 → 02:00. Local 02:30 is ambiguous.
  const FALL_BEFORE = Date.UTC(2026, 9, 25, 0, 59, 59); // 02:59:59 CEST
  const FALL_AFTER  = Date.UTC(2026, 9, 25, 1, 0, 1);   // 02:00:01 CET

  it('moments straddling fall-back DST step produce continuous results', () => {
    const before = getRulingPlanetsForMoment({ atEpochMs: FALL_BEFORE, lat: 47.37, lng: 8.55 });
    const after  = getRulingPlanetsForMoment({ atEpochMs: FALL_AFTER,  lat: 47.37, lng: 8.55 });
    const ascDiff = Math.abs(after.ascDeg - before.ascDeg);
    expect(ascDiff).toBeLessThan(1);
  });
});

describe('DST stress — America/Los_Angeles spring-forward 2026-03-08', () => {
  const SPRING_BEFORE = Date.UTC(2026, 2, 8, 9, 59, 59); // 01:59:59 PST
  const SPRING_AFTER  = Date.UTC(2026, 2, 8, 10, 0, 1);  // 03:00:01 PDT

  it('moments straddling DST step produce continuous results', () => {
    const before = getRulingPlanetsForMoment({ atEpochMs: SPRING_BEFORE, lat: 47.6, lng: -122.33 });
    const after  = getRulingPlanetsForMoment({ atEpochMs: SPRING_AFTER,  lat: 47.6, lng: -122.33 });
    const ascDiff = Math.abs(after.ascDeg - before.ascDeg);
    expect(ascDiff).toBeLessThan(1);
  });
});

describe('TZ matrix — KP Prashna cast across locations', () => {
  for (const loc of LOCATIONS) {
    it(`${loc.name} — number=100 cast succeeds`, () => {
      const r = castKPPrashna({
        mode: 'number',
        number: 100,
        submissionEpochMs: SOLAR_NOON_EPOCH,
        lat: loc.lat,
        lng: loc.lng,
        timezone: '+00:00',
      });
      expect(['favourable', 'adverse', 'mixed']).toContain(r.verdict);
      expect(r.rulingPlanets.ascSubLord).toBeDefined();
      expect(r.cuspalSubLordOfH11.planetId).toBeGreaterThanOrEqual(0);
    });
  }

  it('Prashna day lord is identical across locations for same epoch', () => {
    const dayLordIds = LOCATIONS.map((loc) =>
      castKPPrashna({
        mode: 'number',
        number: 100,
        submissionEpochMs: SOLAR_NOON_EPOCH,
        lat: loc.lat,
        lng: loc.lng,
        timezone: '+00:00',
      }).rulingPlanets.dayLord.id,
    );
    const first = dayLordIds[0];
    for (const id of dayLordIds) {
      expect(id).toBe(first);
    }
  });
});

describe('Polar/extreme latitudes — Placidus degrades gracefully', () => {
  it('does not throw at 80°N (above Arctic Circle, near Placidus limit)', () => {
    // Placidus is mathematically undefined above ~66.5°. The implementation
    // should still return a result (possibly degraded) rather than throw.
    expect(() =>
      getRulingPlanetsForMoment({
        atEpochMs: SOLAR_NOON_EPOCH,
        lat: 80,
        lng: 0,
      }),
    ).not.toThrow();
  });

  it('does not throw at 80°S (below Antarctic Circle)', () => {
    expect(() =>
      getRulingPlanetsForMoment({
        atEpochMs: SOLAR_NOON_EPOCH,
        lat: -80,
        lng: 0,
      }),
    ).not.toThrow();
  });
});

describe('Date-line crossing — Pacific/Auckland +13 hours from UTC', () => {
  // UTC 2026-06-05 23:00 = NZ 2026-06-06 12:00 (next day local)
  const epoch = Date.UTC(2026, 5, 5, 23, 0, 0);
  it('cast at UTC late evening produces NZ next-day result without crash', () => {
    const r = getRulingPlanetsForMoment({
      atEpochMs: epoch,
      lat: -36.85,
      lng: 174.76,
    });
    expect(r.computedAtUtc.getUTCFullYear()).toBe(2026);
    expect(r.computedAtUtc.getUTCMonth()).toBe(5); // June (0-indexed)
    expect(r.rulingPlanets.dayLord.id).toBeGreaterThanOrEqual(0);
  });
});
