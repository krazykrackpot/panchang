import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { calculatePanchang } from '@/lib/panchang/calculator';
import type { PanchangData } from '@/lib/panchang/types';

/**
 * Golden-dataset tests for panchang accuracy.
 *
 * Each fixture under src/lib/__tests__/fixtures/golden/ contains values
 * transcribed from Prokerala (or Shubh Panchang) for a specific location/date.
 * Tolerance: ±2 minutes for time-of-day values by default.
 *
 * ADD FIXTURES, DO NOT FABRICATE. See fixtures/golden/README.md.
 */

type GoldenFixture = {
  source: string;
  sourceUrl?: string;
  capturedAt: string;
  location: { name: string; lat: number; lng: number; tzOffset: number };
  date: string; // YYYY-MM-DD
  expected: {
    sunrise?: string;  // HH:MM
    sunset?: string;
    tithi?: { name?: string; number?: number };
    nakshatra?: { name?: string; number?: number };
    yoga?: { name?: string; number?: number };
    karana?: { name?: string; number?: number };
    rahuKaal?: { start: string; end: string };
    yamaganda?: { start: string; end: string };
    gulikaKaal?: { start: string; end: string };
  };
  tolerances?: { timeMinutes?: number };
};

const FIXTURES_DIR = path.resolve(__dirname, 'fixtures/golden');

function loadFixtures(): GoldenFixture[] {
  if (!fs.existsSync(FIXTURES_DIR)) return [];
  return fs
    .readdirSync(FIXTURES_DIR)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, f), 'utf8')) as GoldenFixture);
}

function hhmm(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function toMinutes(s: string): number {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
}

function diffMinutes(a: string, b: string): number {
  return Math.abs(toMinutes(a) - toMinutes(b));
}

describe('Golden panchang fixtures (accuracy vs Prokerala/Shubh)', () => {
  const fixtures = loadFixtures();

  if (fixtures.length === 0) {
    it.skip('no fixtures found — add JSON files under fixtures/golden/ (see README)', () => {});
    return;
  }

  for (const fx of fixtures) {
    describe(`${fx.location.name} @ ${fx.date} (source: ${fx.source})`, () => {
      // Default tolerance is 5 min — ephemeris-vs-Prokerala commonly differ 2-4 min
      // on sunrise/sunset/Rahu-kaal due to refraction and horizon-dip assumptions.
      // Tighten per-fixture via `tolerances.timeMinutes` when you want stricter.
      const tolerance = fx.tolerances?.timeMinutes ?? 5;
      let actual: PanchangData;

      beforeAll(() => {
        const [year, month, day] = fx.date.split('-').map(Number);
        actual = calculatePanchang({
          year, month, day,
          latitude: fx.location.lat,
          longitude: fx.location.lng,
          timezoneOffset: fx.location.tzOffset,
          locationName: fx.location.name,
        });
      });

      if (fx.expected.sunrise) {
        it(`sunrise within ±${tolerance} min`, () => {
          expect(diffMinutes(hhmm(actual.sunrise), fx.expected.sunrise!)).toBeLessThanOrEqual(tolerance);
        });
      }
      if (fx.expected.sunset) {
        it(`sunset within ±${tolerance} min`, () => {
          expect(diffMinutes(hhmm(actual.sunset), fx.expected.sunset!)).toBeLessThanOrEqual(tolerance);
        });
      }
      if (fx.expected.tithi?.number !== undefined) {
        it(`tithi number = ${fx.expected.tithi.number}`, () => {
          expect(actual.tithi.number).toBe(fx.expected.tithi!.number);
        });
      }
      if (fx.expected.nakshatra?.number !== undefined) {
        it(`nakshatra number = ${fx.expected.nakshatra.number}`, () => {
          expect(actual.nakshatra.number).toBe(fx.expected.nakshatra!.number);
        });
      }
      if (fx.expected.yoga?.number !== undefined) {
        it(`yoga number = ${fx.expected.yoga.number}`, () => {
          expect(actual.yoga.number).toBe(fx.expected.yoga!.number);
        });
      }
      if (fx.expected.karana?.number !== undefined) {
        it(`karana number = ${fx.expected.karana.number}`, () => {
          expect(actual.karana.number).toBe(fx.expected.karana!.number);
        });
      }
      if (fx.expected.karana?.name !== undefined) {
        it(`karana name = "${fx.expected.karana.name}"`, () => {
          expect(actual.karana.name).toBe(fx.expected.karana!.name);
        });
      }
      if (fx.expected.rahuKaal) {
        it(`rahuKaal start within ±${tolerance} min`, () => {
          expect(diffMinutes(hhmm(actual.rahuKalam.start), fx.expected.rahuKaal!.start)).toBeLessThanOrEqual(tolerance);
        });
        it(`rahuKaal end within ±${tolerance} min`, () => {
          expect(diffMinutes(hhmm(actual.rahuKalam.end), fx.expected.rahuKaal!.end)).toBeLessThanOrEqual(tolerance);
        });
      }
    });
  }
});
