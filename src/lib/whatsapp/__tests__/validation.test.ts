import { describe, it, expect } from 'vitest';
import {
  isValidE164,
  isAllowedLocale,
  isValidIanaTimezone,
  isTopOfHourTime,
  validateOptin,
} from '../validation';

describe('isValidE164', () => {
  it('accepts well-formed E.164', () => {
    expect(isValidE164('+919876543210')).toBe(true);
    expect(isValidE164('+12025550100')).toBe(true);
    expect(isValidE164('+447911123456')).toBe(true);
  });
  it('rejects missing +', () => {
    expect(isValidE164('919876543210')).toBe(false);
  });
  it('rejects too short (< 7 digits after +)', () => {
    expect(isValidE164('+12345')).toBe(false);
  });
  it('rejects too long (> 15 digits after +)', () => {
    expect(isValidE164('+1234567890123456')).toBe(false);
  });
  it('rejects leading zero (E.164 country codes start 1-9)', () => {
    expect(isValidE164('+0123456789')).toBe(false);
  });
  it('rejects non-string', () => {
    expect(isValidE164(919876543210)).toBe(false);
    expect(isValidE164(null)).toBe(false);
    expect(isValidE164(undefined)).toBe(false);
  });
});

describe('isAllowedLocale', () => {
  it.each(['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'])(
    'accepts %s',
    (loc) => {
      expect(isAllowedLocale(loc)).toBe(true);
    },
  );
  it('rejects retired sa', () => {
    expect(isAllowedLocale('sa')).toBe(false);
  });
  it('rejects unknown', () => {
    expect(isAllowedLocale('xx')).toBe(false);
    expect(isAllowedLocale('ml')).toBe(false);
  });
});

describe('isValidIanaTimezone', () => {
  it('accepts common Indian + western timezones', () => {
    expect(isValidIanaTimezone('Asia/Kolkata')).toBe(true);
    expect(isValidIanaTimezone('America/New_York')).toBe(true);
    expect(isValidIanaTimezone('Europe/Zurich')).toBe(true);
  });
  it('rejects garbage', () => {
    expect(isValidIanaTimezone('Not/A_Zone')).toBe(false);
    expect(isValidIanaTimezone('')).toBe(false);
  });
});

describe('isTopOfHourTime', () => {
  it('accepts HH:MM and HH:MM:SS at top of hour', () => {
    expect(isTopOfHourTime('06:00')).toBe(true);
    expect(isTopOfHourTime('06:00:00')).toBe(true);
    expect(isTopOfHourTime('00:00')).toBe(true);
    expect(isTopOfHourTime('23:00')).toBe(true);
  });
  it('rejects non-top-of-hour', () => {
    expect(isTopOfHourTime('06:30')).toBe(false);
    expect(isTopOfHourTime('06:00:30')).toBe(false);
  });
  it('rejects invalid hour', () => {
    expect(isTopOfHourTime('24:00')).toBe(false);
    expect(isTopOfHourTime('99:00')).toBe(false);
  });
});

describe('validateOptin', () => {
  const good = {
    phone_e164: '+919876543210',
    locale: 'hi',
    timezone: 'Asia/Kolkata',
    send_time_local: '06:00',
    send_at_sunrise: false,
  };

  it('accepts a well-formed request', () => {
    const r = validateOptin(good);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.send_time_local).toBe('06:00:00');  // normalized
      expect(r.data.locale).toBe('hi');
    }
  });

  it('collects multiple errors at once', () => {
    const r = validateOptin({
      phone_e164: 'bad',
      locale: 'xx',
      timezone: 'Not/A_Zone',
      send_time_local: '06:30',
      send_at_sunrise: 'yes',
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors).toHaveLength(5);
      expect(r.errors.map((e) => e.field).sort()).toEqual([
        'locale', 'phone_e164', 'send_at_sunrise', 'send_time_local', 'timezone',
      ]);
    }
  });

  it('rejects non-object body', () => {
    expect(validateOptin('hello').ok).toBe(false);
    expect(validateOptin(null).ok).toBe(false);
    expect(validateOptin(42).ok).toBe(false);
  });
});
