import { describe, it, expect } from 'vitest';
import { validateBirthData, validateLocale } from '@/lib/kundali/validate-birth-data';

const validBd = {
  name: 'Test',
  date: '1990-06-15',
  time: '14:30',
  place: 'Delhi',
  lat: 28.6139,
  lng: 77.2090,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri',
};

describe('validateBirthData', () => {
  it('accepts a well-formed BirthData', () => {
    expect(validateBirthData(validBd)).toEqual({ ok: true });
  });

  it.each([null, undefined, 'string', 42, true])('rejects non-object input: %j', (bad) => {
    const r = validateBirthData(bad as unknown);
    expect(r.ok).toBe(false);
  });

  it('rejects missing date', () => {
    const r = validateBirthData({ ...validBd, date: undefined });
    expect(r).toEqual({ ok: false, error: 'Invalid date format. Use YYYY-MM-DD.' });
  });

  it('rejects malformed date — wrong separator', () => {
    expect(validateBirthData({ ...validBd, date: '1990/06/15' }).ok).toBe(false);
  });

  it('rejects malformed date — month out of range', () => {
    expect(validateBirthData({ ...validBd, date: '1990-13-15' }).ok).toBe(false);
  });

  it('rejects malformed date — Feb 30 (days-in-month check)', () => {
    const r = validateBirthData({ ...validBd, date: '1990-02-30' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/has only 28 days/);
  });

  it('accepts Feb 29 in a leap year', () => {
    expect(validateBirthData({ ...validBd, date: '2024-02-29' })).toEqual({ ok: true });
  });

  it('rejects Feb 29 in a non-leap year', () => {
    expect(validateBirthData({ ...validBd, date: '2023-02-29' }).ok).toBe(false);
  });

  it('rejects malformed time — hour out of range', () => {
    expect(validateBirthData({ ...validBd, time: '24:00' }).ok).toBe(false);
  });

  it('rejects malformed time — minute out of range', () => {
    expect(validateBirthData({ ...validBd, time: '14:60' }).ok).toBe(false);
  });

  it('rejects lat out of [-90, 90]', () => {
    expect(validateBirthData({ ...validBd, lat: 91 }).ok).toBe(false);
    expect(validateBirthData({ ...validBd, lat: -91 }).ok).toBe(false);
  });

  it('rejects lng out of [-180, 180]', () => {
    expect(validateBirthData({ ...validBd, lng: 181 }).ok).toBe(false);
    expect(validateBirthData({ ...validBd, lng: -181 }).ok).toBe(false);
  });

  it.each([NaN, Infinity, -Infinity])('rejects non-finite lat: %j', (v) => {
    expect(validateBirthData({ ...validBd, lat: v }).ok).toBe(false);
  });

  it.each([NaN, Infinity, -Infinity])('rejects non-finite lng: %j', (v) => {
    expect(validateBirthData({ ...validBd, lng: v }).ok).toBe(false);
  });

  it('rejects string lat (TS-only protection — runtime payloads vary)', () => {
    expect(validateBirthData({ ...validBd, lat: '28.6' as unknown as number }).ok).toBe(false);
  });

  it('rejects empty timezone', () => {
    expect(validateBirthData({ ...validBd, timezone: '' }).ok).toBe(false);
  });

  it('rejects pathologically long timezone (>64 chars)', () => {
    expect(validateBirthData({ ...validBd, timezone: 'A'.repeat(65) }).ok).toBe(false);
  });
});

describe('validateLocale', () => {
  it.each(['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn', 'gu', 'mai', 'mr'])('accepts supported locale %s', (l) => {
    expect(validateLocale(l)).toEqual({ ok: true });
  });

  it.each(['fr', 'EN', '', 'english', '../etc/passwd', 42, null, undefined, {}])('rejects %j', (bad) => {
    expect(validateLocale(bad as unknown).ok).toBe(false);
  });
});
