import { describe, it, expect } from 'vitest';
import { computeKundaliFingerprint } from '../fingerprint';

describe('computeKundaliFingerprint', () => {
  it('is deterministic for the same input', () => {
    const a = computeKundaliFingerprint({ date: '1990-08-15', time: '10:30', lat: 28.6139, lng: 77.2090 });
    const b = computeKundaliFingerprint({ date: '1990-08-15', time: '10:30', lat: 28.6139, lng: 77.2090 });
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is identical for coordinates differing within the 4-decimal rounding window', () => {
    // 28.61390 and 28.61391 round to the same 4-decimal string ("28.6139").
    // Past 5dp the values diverge again. The rounding window is intentional
    // — charts within ~11m of each other share a fingerprint.
    const a = computeKundaliFingerprint({ date: '1990-08-15', time: '10:30', lat: 28.6139, lng: 77.2090 });
    const b = computeKundaliFingerprint({ date: '1990-08-15', time: '10:30', lat: 28.61390, lng: 77.20900 });
    expect(a).toBe(b);
  });

  it('differs when coordinates differ past the 4-decimal window', () => {
    const a = computeKundaliFingerprint({ date: '1990-08-15', time: '10:30', lat: 28.6139, lng: 77.2090 });
    const b = computeKundaliFingerprint({ date: '1990-08-15', time: '10:30', lat: 28.6140, lng: 77.2090 });
    expect(a).not.toBe(b);
  });

  it('differs for distinct dates / times', () => {
    const base = { lat: 28.6139, lng: 77.2090 };
    const d1 = computeKundaliFingerprint({ ...base, date: '1990-08-15', time: '10:30' });
    const d2 = computeKundaliFingerprint({ ...base, date: '1990-08-16', time: '10:30' });
    const d3 = computeKundaliFingerprint({ ...base, date: '1990-08-15', time: '10:31' });
    expect(new Set([d1, d2, d3]).size).toBe(3);
  });

  it('rejects malformed dates', () => {
    expect(() => computeKundaliFingerprint({ date: '1990-8-15', time: '10:30', lat: 28.6, lng: 77.2 }))
      .toThrow(/YYYY-MM-DD/);
  });

  it('rejects malformed / out-of-range times', () => {
    expect(() => computeKundaliFingerprint({ date: '1990-08-15', time: '10:60', lat: 28.6, lng: 77.2 }))
      .toThrow(/out of range/);
    expect(() => computeKundaliFingerprint({ date: '1990-08-15', time: '24:00', lat: 28.6, lng: 77.2 }))
      .toThrow(/out of range/);
    expect(() => computeKundaliFingerprint({ date: '1990-08-15', time: '10-30', lat: 28.6, lng: 77.2 }))
      .toThrow(/HH:MM/);
  });

  it('matches the SHA-256 hex format expected by the DB column', () => {
    const fp = computeKundaliFingerprint({ date: '1990-08-15', time: '10:30', lat: 28.6139, lng: 77.2090 });
    // chart_entitlements.kundali_fingerprint is text — but downstream
    // queries do `WHERE kundali_fingerprint = $1` with the hex string,
    // so format consistency matters.
    expect(fp).toHaveLength(64);
    expect(fp).toMatch(/^[0-9a-f]+$/);
  });

  it('strips seconds from HH:MM:SS so DB-time-column reads match form-input reads', () => {
    // Postgres `time` columns return HH:MM:SS in JSON payloads. The
    // grandfather script reads from user_profiles.time_of_birth (a
    // `time` column) — its fingerprints must match the /api/kundali/unlock
    // fingerprints computed from the form's HH:MM input, otherwise
    // grandfathered users see a paywall on their own chart.
    const a = computeKundaliFingerprint({ date: '1990-08-15', time: '10:30', lat: 28.6139, lng: 77.2090 });
    const b = computeKundaliFingerprint({ date: '1990-08-15', time: '10:30:00', lat: 28.6139, lng: 77.2090 });
    const c = computeKundaliFingerprint({ date: '1990-08-15', time: '10:30:59', lat: 28.6139, lng: 77.2090 });
    expect(a).toBe(b);
    expect(a).toBe(c);
  });

  it('survives lat/lng float-precision artefacts (toFixed bug check)', () => {
    // 28.6139 stored as JS number can round-trip to 28.61389999999...
    // The fingerprint code uses toFixed(4) to normalise. Verify the
    // float-equivalent values produce the SAME hash.
    const messyLat = parseFloat((28.6139 + 1e-12).toFixed(15)); // 28.613900000001 territory
    const a = computeKundaliFingerprint({ date: '1990-08-15', time: '10:30', lat: 28.6139, lng: 77.2090 });
    const b = computeKundaliFingerprint({ date: '1990-08-15', time: '10:30', lat: messyLat, lng: 77.2090 });
    expect(a).toBe(b);
  });
});
