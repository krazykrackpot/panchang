/**
 * Timezone fallback tests — verifies that when the external API is down,
 * the lat/lng region detection returns the correct IANA timezone.
 *
 * This test file exists because the timezone bug was reported THREE times:
 * 1. Browser timezone used instead of birth coordinates
 * 2. Longitude fallback mapped India (UTC+5.5) to Pakistan (UTC+5)
 * 3. Crude region bounds misassigned European and US cities
 *
 * NEVER DELETE THESE TESTS.
 */

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

// We need to test the FALLBACK path, so we mock fetch to always fail
// (simulating the external timezone API being down).
beforeAll(() => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('API down')));
});
afterAll(() => {
  vi.unstubAllGlobals();
});

// Dynamic import after mocking fetch
async function getResolver() {
  // Clear module cache to pick up the mocked fetch
  const mod = await import('@/lib/utils/timezone');
  return mod.resolveTimezoneFromCoords;
}

describe('resolveTimezoneFromCoords fallback (API down)', () => {
  // ─── India (ALL must return Asia/Kolkata) ─────────────────────────────
  const indianCities = [
    { name: 'Delhi', lat: 28.6139, lng: 77.209 },
    { name: 'Mumbai', lat: 19.076, lng: 72.878 },
    { name: 'Hyderabad', lat: 17.385, lng: 78.487 },
    { name: 'Chennai', lat: 13.083, lng: 80.271 },
    { name: 'Kolkata', lat: 22.572, lng: 88.364 },
    { name: 'Bangalore', lat: 12.972, lng: 77.594 },
    { name: 'Varanasi', lat: 25.318, lng: 83.011 },
    { name: 'Guwahati', lat: 26.144, lng: 91.736 },
    { name: 'Jaisalmer (western edge)', lat: 26.916, lng: 70.916 },
    { name: 'Port Blair (Andaman)', lat: 11.667, lng: 92.736 },
    { name: 'Kanyakumari (south tip)', lat: 8.088, lng: 77.537 },
    { name: 'Leh (north edge)', lat: 34.153, lng: 77.577 },
  ];

  for (const city of indianCities) {
    it(`${city.name} → Asia/Kolkata`, async () => {
      const resolve = await getResolver();
      expect(await resolve(city.lat, city.lng)).toBe('Asia/Kolkata');
    });
  }

  // ─── South Asia ───────────────────────────────────────────────────────
  it('Kathmandu → Asia/Kathmandu', async () => {
    const resolve = await getResolver();
    expect(await resolve(27.717, 85.324)).toBe('Asia/Kathmandu');
  });

  it('Colombo → Asia/Colombo', async () => {
    const resolve = await getResolver();
    expect(await resolve(6.932, 79.848)).toBe('Asia/Colombo');
  });

  it('Karachi → Asia/Karachi', async () => {
    const resolve = await getResolver();
    expect(await resolve(24.861, 67.010)).toBe('Asia/Karachi');
  });

  it('Dhaka → Asia/Dhaka', async () => {
    const resolve = await getResolver();
    expect(await resolve(23.811, 90.413)).toBe('Asia/Dhaka');
  });

  // ─── Europe ───────────────────────────────────────────────────────────
  it('London → Europe/London', async () => {
    const resolve = await getResolver();
    expect(await resolve(51.507, -0.128)).toBe('Europe/London');
  });

  it('Paris → Europe/Paris', async () => {
    const resolve = await getResolver();
    expect(await resolve(48.857, 2.352)).toBe('Europe/Paris');
  });

  it('Zurich → Europe/Zurich', async () => {
    const resolve = await getResolver();
    expect(await resolve(47.377, 8.542)).toBe('Europe/Zurich');
  });

  it('Berlin → Europe/Berlin', async () => {
    const resolve = await getResolver();
    expect(await resolve(52.520, 13.405)).toBe('Europe/Berlin');
  });

  it('Athens → Europe/Athens', async () => {
    const resolve = await getResolver();
    expect(await resolve(37.984, 23.728)).toBe('Europe/Athens');
  });

  it('Moscow → Europe/Moscow', async () => {
    const resolve = await getResolver();
    expect(await resolve(55.756, 37.618)).toBe('Europe/Moscow');
  });

  // ─── United States ────────────────────────────────────────────────────
  it('New York → America/New_York', async () => {
    const resolve = await getResolver();
    expect(await resolve(40.713, -74.006)).toBe('America/New_York');
  });

  it('Chicago → America/Chicago', async () => {
    const resolve = await getResolver();
    expect(await resolve(41.878, -87.630)).toBe('America/Chicago');
  });

  it('Denver → America/Denver', async () => {
    const resolve = await getResolver();
    expect(await resolve(39.739, -104.991)).toBe('America/Denver');
  });

  it('Los Angeles → America/Los_Angeles', async () => {
    const resolve = await getResolver();
    expect(await resolve(34.052, -118.244)).toBe('America/Los_Angeles');
  });

  // ─── NEVER return browser timezone ────────────────────────────────────
  it('never returns browser timezone for foreign coordinates', async () => {
    const resolve = await getResolver();
    // A user in Zurich generating a chart for Hyderabad
    // Must get Asia/Kolkata, NEVER Europe/Zurich
    const result = await resolve(17.385, 78.487);
    expect(result).toBe('Asia/Kolkata');
    expect(result).not.toBe('Europe/Zurich');
  });
});
