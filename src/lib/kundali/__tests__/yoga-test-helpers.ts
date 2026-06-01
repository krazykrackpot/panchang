/**
 * Shared helpers for the yoga frequency calibration test
 * (yoga-frequency-calibration.test.ts) and the calibration probe
 * (scripts/probe-yoga-freq.ts).
 *
 * Extracted so the deterministic PRNG and random-chart generator stay in
 * lockstep across the two callers — drift between the two would make the
 * probe's frequency calibration disagree with the test's bounds.
 */
import type { BirthData } from '@/types/panchang';

/**
 * Mulberry32 — a fast 32-bit seeded PRNG with good statistical properties
 * for test-fixture purposes. Returns a closure that emits floats in [0, 1).
 */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a synthetic random `BirthData` for chart `i`, using `rand` as
 * the deterministic source of randomness. Latitude is clamped to the
 * inhabited band [-55, 55] because the ephemeris ascendant math degenerates
 * near the poles.
 */
export function randomChart(rand: () => number, i: number): BirthData {
  const year = 1950 + Math.floor(rand() * 70);
  const month = 1 + Math.floor(rand() * 12);
  const day = 1 + Math.floor(rand() * 28);
  const hour = Math.floor(rand() * 24);
  const minute = Math.floor(rand() * 60);
  const lat = -55 + rand() * 110;
  const lng = -180 + rand() * 360;
  return {
    name: `Chart ${i}`,
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    place: `Random ${i}`,
    lat,
    lng,
    timezone: 'UTC',
    ayanamsha: 'lahiri',
  };
}
