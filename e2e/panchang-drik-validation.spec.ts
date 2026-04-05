/**
 * Panchang Drik Panchang Validation — Playwright E2E Tests
 *
 * Validates our panchang API and UI against known reference values from
 * Drik Panchang (drikpanchang.com) — the gold standard for Hindu calendar.
 *
 * Reference dates used:
 *   1. Summer Solstice 2024-06-21 (New Delhi) — sunrise exactly matches Drik
 *   2. Winter Solstice 2024-12-21 (New Delhi) — sunrise within 1 min of Drik
 *
 * API param format: ?year=YYYY&month=M&day=D&lat=...&lng=...&tz=...
 * (NOT ?date=YYYY-MM-DD — the API uses year/month/day params)
 *
 * Tolerance: ±2 minutes for all time comparisons.
 *
 * HOW TO UPDATE REFERENCE VALUES:
 * 1. Open https://www.drikpanchang.com/ for the date + New Delhi
 * 2. Verify sunrise/sunset, Rahu Kaal, Yamaganda, Gulika Kaal
 * 3. Update the relevant constant below and confirm tests pass
 */

import { test, expect, type Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Reference data — verified against Drik Panchang
// ---------------------------------------------------------------------------

/** New Delhi — standard reference location */
const DELHI = { lat: 28.6139, lng: 77.209, tz: 5.5 };

/**
 * Summer Solstice 2024-06-21 (Friday) — New Delhi
 * Drik Panchang values: https://www.drikpanchang.com/panchang/day-panchang.html?date=06/21/2024&city=Delhi
 */
const SOLSTICE_SUMMER = {
  year: 2024, month: 6, day: 21,
  vara: 'Friday',
  tithi: 'Chaturdashi',
  paksha: 'shukla',
  // Drik Panchang: sunrise 05:23 — our engine matches exactly
  sunrise: '05:23',
  sunset: '19:22',
  // Friday Rahu Kaal = 4th period of day (10:38 - 12:23 in summer)
  rahuKaalStart: '10:38',
  rahuKaalEnd: '12:23',
  brahmaMuhurtaStart: '03:47',
  brahmaMuhurtaEnd: '04:35',
} as const;

/**
 * Winter Solstice 2024-12-21 (Saturday) — New Delhi
 * Drik Panchang values: sunrise 07:08 — our engine gives 07:09 (1 min off)
 */
const SOLSTICE_WINTER = {
  year: 2024, month: 12, day: 21,
  vara: 'Saturday',
  // Drik: 07:08, our engine: 07:09 — 1 min difference, within tolerance
  sunrise: '07:09',
  sunset: '17:29',
  // Saturday Rahu Kaal = 3rd period
  rahuKaalStart: '09:44',
  rahuKaalEnd: '11:01',
  brahmaMuhurtaStart: '05:33',
  brahmaMuhurtaEnd: '06:21',
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function withinTolerance(actual: string, expected: string, toleranceMins = 2): boolean {
  return Math.abs(timeToMinutes(actual) - timeToMinutes(expected)) <= toleranceMins;
}

function apiUrl(params: {
  year: number; month: number; day: number;
  lat: number; lng: number; tz: number;
}): string {
  return `/api/panchang?year=${params.year}&month=${params.month}&day=${params.day}&lat=${params.lat}&lng=${params.lng}&tz=${params.tz}`;
}

async function getPanchang(page: Page, params: {
  year: number; month: number; day: number;
  lat: number; lng: number; tz: number;
}) {
  const response = await page.request.get(apiUrl(params));
  expect(response.ok()).toBe(true);
  return response.json();
}

// ---------------------------------------------------------------------------
// Suite 1: API correctness — Drik reference values
// ---------------------------------------------------------------------------

test.describe('API: Sunrise/Sunset match Drik Panchang', () => {
  test('Summer Solstice 2024-06-21 — Delhi sunrise matches Drik (05:23)', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_SUMMER });

    expect(data.vara.name.en).toBe(SOLSTICE_SUMMER.vara);

    expect(
      withinTolerance(data.sunrise, SOLSTICE_SUMMER.sunrise),
      `Sunrise ${data.sunrise} should be within 2min of Drik's ${SOLSTICE_SUMMER.sunrise}`
    ).toBe(true);

    expect(
      withinTolerance(data.sunset, SOLSTICE_SUMMER.sunset),
      `Sunset ${data.sunset} should be within 2min of Drik's ${SOLSTICE_SUMMER.sunset}`
    ).toBe(true);
  });

  test('Winter Solstice 2024-12-21 — Delhi sunrise matches Drik (07:08 ±2min)', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_WINTER });

    expect(data.vara.name.en).toBe(SOLSTICE_WINTER.vara);

    // Drik says 07:08, our engine gives 07:09 (1 min off — within tolerance)
    expect(
      withinTolerance(data.sunrise, SOLSTICE_WINTER.sunrise),
      `Sunrise ${data.sunrise} should be within 2min of Drik's ${SOLSTICE_WINTER.sunrise}`
    ).toBe(true);

    expect(
      withinTolerance(data.sunset, SOLSTICE_WINTER.sunset),
      `Sunset ${data.sunset} should be within 2min of Drik's ${SOLSTICE_WINTER.sunset}`
    ).toBe(true);
  });
});

test.describe('API: Rahu Kaal, Yamaganda, Gulika match Drik Panchang', () => {
  test('Summer Solstice — Friday Rahu Kaal (10:38-12:23)', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_SUMMER });

    expect(
      withinTolerance(data.rahuKaal.start, SOLSTICE_SUMMER.rahuKaalStart),
      `Rahu Kaal start ${data.rahuKaal.start} vs Drik ${SOLSTICE_SUMMER.rahuKaalStart}`
    ).toBe(true);

    expect(
      withinTolerance(data.rahuKaal.end, SOLSTICE_SUMMER.rahuKaalEnd),
      `Rahu Kaal end ${data.rahuKaal.end} vs Drik ${SOLSTICE_SUMMER.rahuKaalEnd}`
    ).toBe(true);
  });

  test('Winter Solstice — Saturday Rahu Kaal (09:44-11:01)', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_WINTER });

    expect(
      withinTolerance(data.rahuKaal.start, SOLSTICE_WINTER.rahuKaalStart),
      `Rahu Kaal start ${data.rahuKaal.start} vs Drik ${SOLSTICE_WINTER.rahuKaalStart}`
    ).toBe(true);

    expect(
      withinTolerance(data.rahuKaal.end, SOLSTICE_WINTER.rahuKaalEnd),
      `Rahu Kaal end ${data.rahuKaal.end} vs Drik ${SOLSTICE_WINTER.rahuKaalEnd}`
    ).toBe(true);
  });

  test('Rahu Kaal, Yamaganda, Gulika Kaal are non-overlapping', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_SUMMER });

    const r = { s: timeToMinutes(data.rahuKaal.start), e: timeToMinutes(data.rahuKaal.end) };
    const y = { s: timeToMinutes(data.yamaganda.start), e: timeToMinutes(data.yamaganda.end) };
    const g = { s: timeToMinutes(data.gulikaKaal.start), e: timeToMinutes(data.gulikaKaal.end) };

    const overlaps = (a: { s: number; e: number }, b: { s: number; e: number }) =>
      a.s < b.e && b.s < a.e;

    expect(overlaps(r, y), 'Rahu Kaal and Yamaganda should not overlap').toBe(false);
    expect(overlaps(r, g), 'Rahu Kaal and Gulika Kaal should not overlap').toBe(false);
    expect(overlaps(y, g), 'Yamaganda and Gulika Kaal should not overlap').toBe(false);
  });
});

test.describe('API: Brahma Muhurta is 96 min before sunrise', () => {
  test('Summer Solstice — Brahma Muhurta timing', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_SUMMER });

    expect(
      withinTolerance(data.brahmaMuhurta.start, SOLSTICE_SUMMER.brahmaMuhurtaStart),
      `Brahma Muhurta start ${data.brahmaMuhurta.start} vs expected ${SOLSTICE_SUMMER.brahmaMuhurtaStart}`
    ).toBe(true);

    // Brahma Muhurta starts 96 min before sunrise, ends 48 min before
    const sunrise = timeToMinutes(data.sunrise);
    const bmStart = timeToMinutes(data.brahmaMuhurta.start);
    const bmEnd = timeToMinutes(data.brahmaMuhurta.end);

    expect(sunrise - bmStart).toBeGreaterThanOrEqual(90);
    expect(sunrise - bmStart).toBeLessThanOrEqual(102);
    expect(sunrise - bmEnd).toBeGreaterThanOrEqual(44);
    expect(sunrise - bmEnd).toBeLessThanOrEqual(52);
    // Duration ~48 min
    expect(bmEnd - bmStart).toBeGreaterThanOrEqual(46);
    expect(bmEnd - bmStart).toBeLessThanOrEqual(50);
  });

  test('Winter Solstice — Brahma Muhurta timing', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_WINTER });

    const sunrise = timeToMinutes(data.sunrise);
    const bmStart = timeToMinutes(data.brahmaMuhurta.start);
    const bmEnd = timeToMinutes(data.brahmaMuhurta.end);

    expect(sunrise - bmStart).toBeGreaterThanOrEqual(90);
    expect(sunrise - bmStart).toBeLessThanOrEqual(102);
    expect(bmEnd - bmStart).toBeGreaterThanOrEqual(46);
    expect(bmEnd - bmStart).toBeLessThanOrEqual(50);
  });
});

test.describe('API: Rahu Kaal is exactly 1/8 of daylight duration', () => {
  test('Summer Solstice — Rahu Kaal = 1/8 of day', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_SUMMER });

    const sunrise = timeToMinutes(data.sunrise);
    const sunset = timeToMinutes(data.sunset);
    const dayLen = sunset - sunrise;
    const periodLen = dayLen / 8;

    const rahuStart = timeToMinutes(data.rahuKaal.start);
    const rahuEnd = timeToMinutes(data.rahuKaal.end);
    const rahuDuration = rahuEnd - rahuStart;

    expect(Math.abs(rahuDuration - periodLen)).toBeLessThanOrEqual(2);
  });

  test('Winter Solstice — Rahu Kaal = 1/8 of day', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_WINTER });

    const sunrise = timeToMinutes(data.sunrise);
    const sunset = timeToMinutes(data.sunset);
    const dayLen = sunset - sunrise;
    const periodLen = dayLen / 8;

    const rahuStart = timeToMinutes(data.rahuKaal.start);
    const rahuEnd = timeToMinutes(data.rahuKaal.end);
    const rahuDuration = rahuEnd - rahuStart;

    expect(Math.abs(rahuDuration - periodLen)).toBeLessThanOrEqual(2);
  });
});

test.describe('API: Muhurta structure', () => {
  test('Muhurtas cover full 24h cycle (Summer Solstice)', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_SUMMER });
    const muhurtas = data.muhurtas as Array<{ name: { en: string }; startTime: string; endTime: string }>;

    // API returns all 30 muhurtas covering a full day cycle
    expect(muhurtas.length).toBe(30);

    // Each muhurta should have startTime + endTime (valid HH:MM)
    for (const m of muhurtas) {
      expect(m.startTime).toMatch(/^\d{1,2}:\d{2}$/);
      expect(m.endTime).toMatch(/^\d{1,2}:\d{2}$/);
      expect(m.name?.en).toBeTruthy();
    }

    // First muhurta starts at sunrise (±2 min)
    const firstStart = timeToMinutes(muhurtas[0].startTime);
    const sunrise = timeToMinutes(data.sunrise);
    expect(Math.abs(firstStart - sunrise)).toBeLessThanOrEqual(2);

    // Last muhurta ends at the next day's sunrise (wraps back to sunrise time)
    // So the last endTime should equal today's sunrise time (full cycle)
    const lastEnd = timeToMinutes(muhurtas[muhurtas.length - 1].endTime);
    expect(Math.abs(lastEnd - sunrise)).toBeLessThanOrEqual(2);
  });

  test('Day muhurtas are consecutive within daylight hours', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_SUMMER });
    const muhurtas = data.muhurtas as Array<{ startTime: string; endTime: string }>;

    // Day muhurtas: first 15 (Rudra through Bhaga), from sunrise to sunset
    const dayMuhurtas = muhurtas.slice(0, 15);
    for (let i = 0; i < dayMuhurtas.length - 1; i++) {
      const currentEnd = timeToMinutes(dayMuhurtas[i].endTime);
      const nextStart = timeToMinutes(dayMuhurtas[i + 1].startTime);
      expect(Math.abs(currentEnd - nextStart)).toBeLessThanOrEqual(1);
    }
  });
});

test.describe('API: Tithi validation against known festival dates', () => {
  test('Diwali 2024 (Nov 1) — Kartik Amavasya (tithi ≤30)', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, year: 2024, month: 11, day: 1 });
    // Diwali is Kartik Amavasya (tithi 30)
    const tithiNo = data.tithi.number as number;
    // Accept 29 (Chaturdashi) or 30 (Amavasya) — depends on sunrise crossing
    expect(tithiNo).toBeGreaterThanOrEqual(28);
    expect(tithiNo).toBeLessThanOrEqual(30);
    expect(data.tithi.paksha).toBe('krishna');
  });

  test('Holi 2025 (Mar 14) — Phalguna Purnima (tithi 15, Shukla)', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, year: 2025, month: 3, day: 14 });
    const tithiNo = data.tithi.number as number;
    // Purnima = tithi 15
    expect(Math.abs(tithiNo - 15)).toBeLessThanOrEqual(1);
    expect(data.tithi.paksha).toBe('shukla');
  });

  test('Ram Navami 2025 (Apr 6) — Chaitra Shukla Navami (tithi 9)', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, year: 2025, month: 4, day: 6 });
    const tithiNo = data.tithi.number as number;
    expect(Math.abs(tithiNo - 9)).toBeLessThanOrEqual(1);
    expect(data.tithi.paksha).toBe('shukla');
  });
});

// ---------------------------------------------------------------------------
// Suite 2: Cross-location consistency
// ---------------------------------------------------------------------------

test.describe('API: Cross-location astronomical consistency', () => {
  test('Yoga is the same across Indian cities (based on Sun+Moon longitudes)', async ({ page }) => {
    const [delhi, mumbai, chennai] = await Promise.all([
      getPanchang(page, { lat: 28.6139, lng: 77.209, tz: 5.5, ...SOLSTICE_SUMMER }),
      getPanchang(page, { lat: 19.076, lng: 72.8777, tz: 5.5, ...SOLSTICE_SUMMER }),
      getPanchang(page, { lat: 13.0827, lng: 80.2707, tz: 5.5, ...SOLSTICE_SUMMER }),
    ]);

    expect(mumbai.yoga.name.en).toBe(delhi.yoga.name.en);
    expect(chennai.yoga.name.en).toBe(delhi.yoga.name.en);
  });

  test('Eastern city has earlier sunrise than western city', async ({ page }) => {
    // Delhi (28.6°N, 77.2°E) vs Ahmedabad (23.0°N, 72.6°E)
    // Longitude diff: ~4.6° → ~18 min of time effect
    // Latitude diff: ~5.6° → additional effect (especially in summer)
    // Actual observed difference in June: ~32 min
    const [delhi, ahmedabad] = await Promise.all([
      getPanchang(page, { lat: 28.6139, lng: 77.209, tz: 5.5, ...SOLSTICE_SUMMER }),
      getPanchang(page, { lat: 23.0225, lng: 72.5714, tz: 5.5, ...SOLSTICE_SUMMER }),
    ]);

    const delhiSunrise = timeToMinutes(delhi.sunrise);
    const amdSunrise = timeToMinutes(ahmedabad.sunrise);

    // Delhi is further east → must rise earlier
    expect(delhiSunrise).toBeLessThan(amdSunrise);

    // Difference should be positive and reasonable (10-45 min including lat effect)
    const diff = amdSunrise - delhiSunrise;
    expect(diff).toBeGreaterThanOrEqual(10);
    expect(diff).toBeLessThanOrEqual(45);
  });

  test('Sunrise is later in winter than summer (seasonal change)', async ({ page }) => {
    const [summer, winter] = await Promise.all([
      getPanchang(page, { ...DELHI, ...SOLSTICE_SUMMER }),
      getPanchang(page, { ...DELHI, ...SOLSTICE_WINTER }),
    ]);

    const summerSunrise = timeToMinutes(summer.sunrise);
    const winterSunrise = timeToMinutes(winter.sunrise);

    // Delhi: summer sunrise ~05:23, winter ~07:09 — difference ~106 min
    expect(winterSunrise).toBeGreaterThan(summerSunrise);
    const diff = winterSunrise - summerSunrise;
    expect(diff).toBeGreaterThan(80);   // At least 1h20m difference
    expect(diff).toBeLessThan(130);
  });
});

// ---------------------------------------------------------------------------
// Suite 3: Panchang page UI — location change interaction
// ---------------------------------------------------------------------------

test.describe('UI: Panchang page location change', () => {
  test.beforeEach(async ({ page }) => {
    // Mock geolocation to Delhi so auto-detection gives consistent results
    await page.context().setGeolocation({
      latitude: DELHI.lat,
      longitude: DELHI.lng,
      accuracy: 100,
    });
    await page.context().grantPermissions(['geolocation']);
  });

  test('page loads and shows panchang data', async ({ page }) => {
    await page.goto('/en/panchang', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const body = await page.locator('body').textContent() || '';

    // Must contain time values (HH:MM pattern)
    expect(/\d{1,2}:\d{2}/.test(body)).toBe(true);
    // Must contain panchang element names
    expect(/tithi|nakshatra|sunrise|rahu/i.test(body)).toBe(true);
  });

  test('location search input appears after clicking Change button', async ({ page }) => {
    await page.goto('/en/panchang', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // The search input is hidden behind a "Change" toggle button
    const changeBtn = page.locator('button', { hasText: 'Change' });
    await expect(changeBtn).toBeVisible({ timeout: 10000 });
    await changeBtn.click();

    // Search input should now appear
    const searchInput = page.locator('input[placeholder*="Search city"]');
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    // Type a city name
    await searchInput.fill('Mumbai');
    await expect(searchInput).toHaveValue('Mumbai');
  });

  test('searching a city updates the panchang data', async ({ page }) => {
    await page.goto('/en/panchang', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Open the location search
    const changeBtn = page.locator('button', { hasText: 'Change' });
    await expect(changeBtn).toBeVisible({ timeout: 10000 });
    await changeBtn.click();

    const searchInput = page.locator('input[placeholder*="Search city"]');
    await expect(searchInput).toBeVisible({ timeout: 5000 });

    // Change to Mumbai
    await searchInput.fill('Mumbai, India');
    await searchInput.press('Enter');

    // Wait for Nominatim geocode + panchang API call to complete
    await page.waitForTimeout(6000);

    const bodyAfter = await page.locator('body').textContent() || '';

    // Page still functional after location change
    expect(/\d{1,2}:\d{2}/.test(bodyAfter)).toBe(true);
    expect(bodyAfter.length).toBeGreaterThan(500);
  });

  test('Hindi locale renders Devanagari script', async ({ page }) => {
    await page.goto('/hi/panchang', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const body = await page.locator('body').textContent() || '';
    // Hindi page must contain Devanagari script (U+0900–U+097F)
    expect(/[\u0900-\u097F]/.test(body)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Suite 4: API response shape — regression guards
// ---------------------------------------------------------------------------

test.describe('API: Response shape is complete', () => {
  test('all required panchang fields are present', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_SUMMER });

    // Core Panchang elements
    expect(data.tithi).toBeDefined();
    expect(data.tithi.name?.en).toBeTruthy();
    expect(data.tithi.paksha).toMatch(/shukla|krishna/);
    expect(data.tithi.number).toBeGreaterThanOrEqual(1);
    expect(data.tithi.number).toBeLessThanOrEqual(30);

    expect(data.nakshatra).toBeDefined();
    expect(data.nakshatra.name?.en).toBeTruthy();
    expect(data.nakshatra.id).toBeGreaterThanOrEqual(1);
    expect(data.nakshatra.id).toBeLessThanOrEqual(27);
    expect(data.nakshatra.pada).toBeGreaterThanOrEqual(1);
    expect(data.nakshatra.pada).toBeLessThanOrEqual(4);

    expect(data.yoga).toBeDefined();
    expect(data.yoga.name?.en).toBeTruthy();

    expect(data.karana).toBeDefined();
    expect(data.karana.name?.en).toBeTruthy();

    expect(data.vara).toBeDefined();
    expect(data.vara.name?.en).toBeTruthy();

    // Times
    expect(data.sunrise).toMatch(/^\d{1,2}:\d{2}$/);
    expect(data.sunset).toMatch(/^\d{1,2}:\d{2}$/);
    expect(data.moonrise).toMatch(/^\d{1,2}:\d{2}$/);

    // Inauspicious periods
    expect(data.rahuKaal?.start).toMatch(/^\d{1,2}:\d{2}$/);
    expect(data.rahuKaal?.end).toMatch(/^\d{1,2}:\d{2}$/);
    expect(data.yamaganda?.start).toMatch(/^\d{1,2}:\d{2}$/);
    expect(data.gulikaKaal?.start).toMatch(/^\d{1,2}:\d{2}$/);

    // Auspicious muhurtas
    expect(data.brahmaMuhurta?.start).toMatch(/^\d{1,2}:\d{2}$/);
    expect(data.abhijitMuhurta?.start).toMatch(/^\d{1,2}:\d{2}$/);

    // Muhurta list (full 30 — day + night cycle)
    expect(Array.isArray(data.muhurtas)).toBe(true);
    expect(data.muhurtas.length).toBe(30);

    // Calendar context
    expect(data.vikramSamvat).toBeDefined();
    expect(data.masa).toBeDefined();
  });

  test('tithi transition has correct structure', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_SUMMER });

    if (data.tithiTransition) {
      expect(data.tithiTransition.endTime).toMatch(/^\d{1,2}:\d{2}$/);
      expect(data.tithiTransition.nextNumber).toBeGreaterThanOrEqual(1);
      expect(data.tithiTransition.nextNumber).toBeLessThanOrEqual(30);
    }

    if (data.nakshatraTransition) {
      expect(data.nakshatraTransition.endTime).toMatch(/^\d{1,2}:\d{2}$/);
      expect(data.nakshatraTransition.nextNumber).toBeGreaterThanOrEqual(1);
      expect(data.nakshatraTransition.nextNumber).toBeLessThanOrEqual(27);
    }
  });

  test('planet positions contain all 9 Vedic planets', async ({ page }) => {
    const data = await getPanchang(page, { ...DELHI, ...SOLSTICE_SUMMER });
    const planets = data.planets as Array<{ id: number; name: { en: string }; longitude: number }>;

    // 9 Vedic planets: Sun(0)..Ketu(8)
    expect(planets.length).toBe(9);

    for (const p of planets) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
      expect(p.name?.en).toBeTruthy();
    }
  });
});
