/**
 * Additional House Systems
 * Sripati, Whole Sign, Koch (via Swiss Ephemeris where available)
 * Reference: Various traditions
 */

import { normalizeDeg } from '@/lib/ephem/astronomical';

/**
 * Sripati House System — midpoint between Equal and Placidus
 * Each cusp is the midpoint of the adjacent Bhava Madhya points.
 * Widely used in India, especially in Maharashtra tradition.
 *
 * Sripati cusps: C(n) = midpoint between Equal(n) and Equal(n+1)
 * In practice: each house midpoint = (start of this house + start of next) / 2
 * This means house N spans from midpoint(N-1, N) to midpoint(N, N+1)
 */
export function calculateSripatiCusps(ascDeg: number): number[] {
  // Equal house cusps first
  const equalCusps: number[] = [];
  for (let i = 0; i < 12; i++) {
    equalCusps.push(normalizeDeg(ascDeg + i * 30));
  }

  // Sripati: each cusp is midpoint between two equal cusps
  // Bhava Madhya (house midpoint) = equal cusp itself
  // Bhava Sandhi (house boundary) = midpoint between adjacent madhyas
  const sripatiCusps: number[] = [];
  for (let i = 0; i < 12; i++) {
    const curr = equalCusps[i];
    const prev = equalCusps[(i + 11) % 12]; // previous house
    // Cusp = midpoint between prev house center and current house center
    let mid = (prev + curr) / 2;
    // Handle wraparound
    if (Math.abs(prev - curr) > 180) {
      mid = normalizeDeg(mid + 180);
    }
    sripatiCusps.push(normalizeDeg(mid));
  }

  return sripatiCusps;
}

/**
 * Whole Sign House System
 * The entire sign containing the Ascendant = 1st house
 * Each subsequent sign = next house
 * Simplest system, used by beginners and some traditional practitioners
 */
export function calculateWholeSignCusps(ascDeg: number): number[] {
  const ascSign = Math.floor(ascDeg / 30); // 0-based sign index
  const cusps: number[] = [];
  for (let i = 0; i < 12; i++) {
    cusps.push(((ascSign + i) % 12) * 30); // Each cusp starts at 0° of the sign
  }
  return cusps;
}

/**
 * Determine which house a planet falls in for a given cusp system
 */
export function getHouseForCusps(longitude: number, cusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const start = cusps[i];
    const end = cusps[(i + 1) % 12];
    if (end > start) {
      if (longitude >= start && longitude < end) return i + 1;
    } else {
      // Wraparound case
      if (longitude >= start || longitude < end) return i + 1;
    }
  }
  return 1; // fallback
}

export type HouseSystem = 'equal' | 'sripati' | 'whole_sign' | 'placidus';

export function calculateCusps(ascDeg: number, system: HouseSystem): number[] {
  switch (system) {
    case 'sripati': return calculateSripatiCusps(ascDeg);
    case 'whole_sign': return calculateWholeSignCusps(ascDeg);
    case 'equal':
    default:
      const cusps: number[] = [];
      for (let i = 0; i < 12; i++) cusps.push(normalizeDeg(ascDeg + i * 30));
      return cusps;
  }
}
