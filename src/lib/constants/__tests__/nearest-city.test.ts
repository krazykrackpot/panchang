/**
 * Unit tests for findNearestPrecomputedCity — the helper that lets
 * TodayPanchangWidget short-circuit /api/panchang through the
 * precomputed panchang-city Blob.
 */

import { describe, it, expect } from 'vitest';
import { findNearestPrecomputedCity, haversineKm } from '@/lib/constants/nearest-city';

describe('haversineKm', () => {
  it('returns 0 for the same point', () => {
    expect(haversineKm(28.6, 77.2, 28.6, 77.2)).toBe(0);
  });

  it('matches a known ground-truth distance (Delhi → Mumbai ≈ 1148 km)', () => {
    const km = haversineKm(28.6139, 77.209, 19.076, 72.8777);
    expect(km).toBeGreaterThan(1100);
    expect(km).toBeLessThan(1200);
  });

  it('matches a known ground-truth distance (London → NY ≈ 5570 km)', () => {
    const km = haversineKm(51.5074, -0.1278, 40.7128, -74.006);
    expect(km).toBeGreaterThan(5500);
    expect(km).toBeLessThan(5700);
  });
});

describe('findNearestPrecomputedCity', () => {
  it('returns the city itself when called on its exact coordinates', () => {
    // Delhi is in CITIES at (28.6139, 77.209)
    const result = findNearestPrecomputedCity(28.6139, 77.209);
    expect(result?.slug).toBe('delhi');
  });

  it('returns Delhi for a point in central Delhi (~5km off-centre)', () => {
    const result = findNearestPrecomputedCity(28.65, 77.25);
    expect(result?.slug).toBe('delhi');
  });

  it('returns null for a point in the middle of the Indian Ocean', () => {
    const result = findNearestPrecomputedCity(-15, 75);
    expect(result).toBeNull();
  });

  it('returns null for a point far from any city when tolerance is 50km', () => {
    // ~200km from Mumbai (closest precomputed city) — outside default 50km
    const result = findNearestPrecomputedCity(20.5, 75.5);
    expect(result).toBeNull();
  });

  it('returns the closer of two candidates within tolerance', () => {
    // Halfway between Delhi (28.61, 77.21) and Agra (~27.18, 78.01) —
    // but only one (Delhi) is within 50km of the test point.
    const result = findNearestPrecomputedCity(28.5, 77.3, 50);
    expect(result?.slug).toBe('delhi');
  });

  it('returns null for non-finite inputs', () => {
    expect(findNearestPrecomputedCity(NaN, 0)).toBeNull();
    expect(findNearestPrecomputedCity(0, Infinity)).toBeNull();
  });
});
