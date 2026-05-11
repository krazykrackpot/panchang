/**
 * Tests for the split timezone resolution functions.
 *
 * Critical regression: resolveBirthTimezone must NEVER use the browser's
 * timezone. A user in Switzerland generating a kundali for someone born
 * in Hyderabad must get Asia/Kolkata, not Europe/Zurich.
 */
import { describe, it, expect, vi } from 'vitest';
import {
  resolveBirthTimezone,
  resolveCurrentLocationTimezone,
} from '@/lib/utils/timezone';

describe('resolveBirthTimezone', () => {
  // The core regression case
  it('Swiss user, Hyderabad birth → Asia/Kolkata (not Europe/Zurich)', async () => {
    const tz = await resolveBirthTimezone(17.385, 78.4867);
    expect(['Asia/Kolkata', 'Asia/Calcutta']).toContain(tz);
  });

  it('US user, Delhi birth → Asia/Kolkata', async () => {
    const tz = await resolveBirthTimezone(28.6139, 77.209);
    expect(['Asia/Kolkata', 'Asia/Calcutta']).toContain(tz);
  });

  it('Indian user, New York birth → America/New_York', async () => {
    const tz = await resolveBirthTimezone(40.7128, -74.006);
    expect(tz).toBe('America/New_York');
  });

  it('UK user, Tokyo birth → Asia/Tokyo', async () => {
    const tz = await resolveBirthTimezone(35.6762, 139.6503);
    expect(tz).toBe('Asia/Tokyo');
  });

  it('Indian user, London birth → Europe timezone (not Asia/Kolkata)', async () => {
    const tz = await resolveBirthTimezone(51.5074, -0.1278);
    expect(tz).toBeTruthy();
    expect(tz).not.toBe('Asia/Kolkata');
  });

  it('Nepal birth → Asia/Kathmandu', async () => {
    const tz = await resolveBirthTimezone(27.7172, 85.324);
    expect(tz).toBe('Asia/Kathmandu');
  });

  it('Sri Lanka birth → Asia/Colombo', async () => {
    const tz = await resolveBirthTimezone(6.9271, 79.8612);
    expect(tz).toBe('Asia/Colombo');
  });

  it('Sydney birth → Australia/Sydney', async () => {
    const tz = await resolveBirthTimezone(-33.8688, 151.2093);
    expect(tz).toBe('Australia/Sydney');
  });

  it('NEVER calls Intl.DateTimeFormat', async () => {
    const spy = vi.spyOn(Intl, 'DateTimeFormat');
    await resolveBirthTimezone(17.385, 78.4867);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('NEVER accesses window object', async () => {
    // Verify no window access in the function body
    const src = resolveBirthTimezone.toString();
    expect(src).not.toContain('window');
    expect(src).not.toContain('Intl.DateTimeFormat');
  });
});

describe('resolveCurrentLocationTimezone', () => {
  it('returns a timezone for current location coords', async () => {
    const tz = await resolveCurrentLocationTimezone(47.3769, 8.5417); // Zurich
    expect(tz).toBeTruthy();
    expect(tz).not.toBe('UTC');
  });
});

describe('cross-timezone kundali regression', () => {
  // THE critical test: same birth data must produce same result
  // regardless of where the USER is located
  it('Diksha Acharya: Hyderabad birth produces Purva Bhadrapada regardless of user location', async () => {
    const { generateKundali } = await import('@/lib/ephem/kundali-calc');

    // Get the birth timezone from coordinates (NOT browser)
    const birthTz = await resolveBirthTimezone(17.385, 78.4867);

    const kundali = generateKundali({
      name: 'Diksha Acharya',
      date: '1998-11-01',
      time: '09:55',
      place: 'Hyderabad',
      lat: 17.385,
      lng: 78.4867,
      timezone: birthTz,
      ayanamsha: 'lahiri',
    });

    const moon = kundali.planets[1];
    expect(moon.nakshatra?.name?.en).toBe('Purva Bhadrapada');
    expect(moon.pada).toBe(4);
    // Moon should be ~331.85° — in Pisces but Purva Bhadrapada
    expect(moon.longitude).toBeGreaterThan(320);
    expect(moon.longitude).toBeLessThan(333.33);
  });

  it('birth in New York 1990-07-04 12:00 produces consistent result', async () => {
    const { generateKundali } = await import('@/lib/ephem/kundali-calc');
    const birthTz = await resolveBirthTimezone(40.7128, -74.006);

    const k1 = generateKundali({
      name: 'Test', date: '1990-07-04', time: '12:00',
      place: 'New York', lat: 40.7128, lng: -74.006, timezone: birthTz, ayanamsha: 'lahiri',
    });

    // Generate again with explicitly Asia/Kolkata (simulating wrong TZ)
    const k2 = generateKundali({
      name: 'Test', date: '1990-07-04', time: '12:00',
      place: 'New York', lat: 40.7128, lng: -74.006, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri',
    });

    // The two should produce DIFFERENT results (proving TZ matters)
    expect(k1.planets[1].longitude).not.toBeCloseTo(k2.planets[1].longitude, 0);
    // And the correct one should use America/New_York
    expect(birthTz).toBe('America/New_York');
  });

  it('birth in Zurich 2000-03-15 14:30 gets Europe timezone not Asia', async () => {
    const birthTz = await resolveBirthTimezone(47.3769, 8.5417);

    expect(birthTz).not.toBe('Asia/Kolkata');
    expect(birthTz).not.toBe('UTC');
    // Should be CET/CEST region
    expect(['Europe/Zurich', 'Europe/Paris', 'Europe/Berlin', 'Europe/Vienna']).toContain(birthTz);
  });
});
