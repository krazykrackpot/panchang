// src/lib/kundali/health-diagnosis/__tests__/scoring-utils.test.ts
//
// Unit tests for scoring-utils.ts (Task B1 reviewer fix).
//
// Covers:
//   vulnerabilityScore — boundary values (0, 50, 100) and clamp behaviour
//   ratingFromScore    — tier boundaries at 0, 24, 25, 49, 50, 74, 75, 99
//   dignityToScore     — all seven tier labels + unknown fallback
//   w                  — valid axis lookup; missing axis returns 0 + console.error

import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  vulnerabilityScore,
  ratingFromScore,
  dignityToScore,
  w,
} from '../scoring-utils';
import type { WeightVector } from '../weights';

// ─── vulnerabilityScore ──────────────────────────────────────────────────────

describe('vulnerabilityScore', () => {
  it('100 resilience → 0 vulnerability (perfectly healthy)', () => {
    expect(vulnerabilityScore(100)).toBe(0);
  });

  it('0 resilience → 100 vulnerability (maximally vulnerable)', () => {
    expect(vulnerabilityScore(0)).toBe(100);
  });

  it('50 resilience → 50 vulnerability (midpoint)', () => {
    expect(vulnerabilityScore(50)).toBe(50);
  });

  it('clamps above-100 resilience to 0 vulnerability', () => {
    // Floating-point weight sums can slightly exceed 100.
    expect(vulnerabilityScore(110)).toBe(0);
  });

  it('clamps negative resilience to 100 vulnerability', () => {
    expect(vulnerabilityScore(-5)).toBe(100);
  });
});

// ─── ratingFromScore ─────────────────────────────────────────────────────────

describe('ratingFromScore', () => {
  // uttama: vulnerability < 25
  it('0  → uttama', ()  => expect(ratingFromScore(0)).toBe('uttama'));
  it('24 → uttama', ()  => expect(ratingFromScore(24)).toBe('uttama'));

  // madhyama: 25 ≤ vulnerability < 50
  it('25 → madhyama', () => expect(ratingFromScore(25)).toBe('madhyama'));
  it('49 → madhyama', () => expect(ratingFromScore(49)).toBe('madhyama'));

  // adhama: 50 ≤ vulnerability < 75
  it('50 → adhama', ()  => expect(ratingFromScore(50)).toBe('adhama'));
  it('74 → adhama', ()  => expect(ratingFromScore(74)).toBe('adhama'));

  // atyadhama: vulnerability ≥ 75
  it('75 → atyadhama', () => expect(ratingFromScore(75)).toBe('atyadhama'));
  it('99 → atyadhama', () => expect(ratingFromScore(99)).toBe('atyadhama'));
});

// ─── dignityToScore ──────────────────────────────────────────────────────────

describe('dignityToScore', () => {
  it('exalted      → 95', () => expect(dignityToScore('exalted')).toBe(95));
  it('moolatrikona → 85', () => expect(dignityToScore('moolatrikona')).toBe(85));
  it('own          → 80', () => expect(dignityToScore('own')).toBe(80));
  it('friend       → 65', () => expect(dignityToScore('friend')).toBe(65));
  it('neutral      → 50', () => expect(dignityToScore('neutral')).toBe(50));
  it('enemy        → 30', () => expect(dignityToScore('enemy')).toBe(30));
  it('debilitated  → 10', () => expect(dignityToScore('debilitated')).toBe(10));
  it('unknown      → 50 (neutral fallback)', () => expect(dignityToScore('unknown')).toBe(50));
});

// ─── w (safe weight-axis resolver) ───────────────────────────────────────────

describe('w', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the correct weight for a present axis', () => {
    const vec: WeightVector = { sunShadbala: 0.2, lagnaLordDignity: 0.15 };
    expect(w(vec, 'sunShadbala', 'test')).toBe(0.2);
    expect(w(vec, 'lagnaLordDignity', 'test')).toBe(0.15);
  });

  it('returns 0 for a missing axis', () => {
    const vec: WeightVector = { sunShadbala: 0.2 };
    expect(w(vec, 'missing', 'test')).toBe(0);
  });

  it('calls console.error with element-tagged message when axis is absent', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const vec: WeightVector = {};
    w(vec, 'nonExistentAxis', 'myElement');
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(
      '[health-diagnosis/myElement] unknown weight axis: "nonExistentAxis"',
    );
  });

  it('does NOT call console.error when axis is present', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const vec: WeightVector = { validAxis: 0.5 };
    w(vec, 'validAxis', 'test');
    expect(spy).not.toHaveBeenCalled();
  });

  it('returns 0 for a weight of exactly 0 (axis present, zero-weighted)', () => {
    // Axis present but weight intentionally set to 0 — should NOT log an error.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const vec: WeightVector = { zeroAxis: 0 };
    expect(w(vec, 'zeroAxis', 'test')).toBe(0);
    expect(spy).not.toHaveBeenCalled();
  });
});
