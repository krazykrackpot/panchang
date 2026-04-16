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
    tithi?: { name?: string; id?: number };
    nakshatra?: { name?: string; id?: number };
    yoga?: { name?: string; id?: number };
    karana?: { name?: string; id?: number };
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
      const tolerance = fx.tolerances?.timeMinutes ?? 2;
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
      if (fx.expected.tithi?.id !== undefined) {
        it(`tithi id = ${fx.expected.tithi.id}`, () => {
          expect(actual.tithi.id).toBe(fx.expected.tithi!.id);
        });
      }
      if (fx.expected.nakshatra?.id !== undefined) {
        it(`nakshatra id = ${fx.expected.nakshatra.id}`, () => {
          expect(actual.nakshatra.id).toBe(fx.expected.nakshatra!.id);
        });
      }
      if (fx.expected.yoga?.id !== undefined) {
        it(`yoga id = ${fx.expected.yoga.id}`, () => {
          expect(actual.yoga.id).toBe(fx.expected.yoga!.id);
        });
      }
      if (fx.expected.karana?.id !== undefined) {
        it(`karana id = ${fx.expected.karana.id}`, () => {
          expect(actual.karana.id).toBe(fx.expected.karana!.id);
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
