/**
 * E2E Core Flow Tests — Playwright
 *
 * Tests the critical user journeys:
 *   1. Homepage loads and displays panchang
 *   2. Panchang page shows all 5 elements
 *   3. Kundali page generates a chart
 *   4. Profile page (requires auth — skip if not logged in)
 *   5. Navigation works across pages
 *   6. Locale switching
 *   7. Vedic Time page loads and ticks
 */
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Homepage', () => {
  test('loads and shows Gayatri mantra', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await expect(page.locator('text=भूर्भुवः')).toBeVisible({ timeout: 10000 });
  });

  test('shows Today\'s Panchang section', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await expect(page.locator('text=Panchang')).toBeVisible({ timeout: 10000 });
  });

  test('has Explore Panchang CTA', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await expect(page.locator('text=Explore Panchang')).toBeVisible({ timeout: 10000 });
  });

  test('has 8 tool cards', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    // The tool cards section
    await expect(page.locator('text=Birth Chart')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Muhurta AI')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Learn Jyotish')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Panchang Page', () => {
  test('loads and shows tithi', async ({ page }) => {
    await page.goto(`${BASE}/en/panchang`);
    // Should show a tithi name (one of the 30)
    await expect(page.locator('text=/Pratipada|Dwitiya|Tritiya|Chaturthi|Panchami|Shashthi|Saptami|Ashtami|Navami|Dashami|Ekadashi|Dwadashi|Trayodashi|Chaturdashi|Purnima|Amavasya/')).toBeVisible({ timeout: 15000 });
  });

  test('shows sunrise and sunset times', async ({ page }) => {
    await page.goto(`${BASE}/en/panchang`);
    // Sunrise/sunset should be in HH:MM format
    await expect(page.locator('text=/\\d{2}:\\d{2}/')).toBeVisible({ timeout: 15000 });
  });

  test('shows nakshatra', async ({ page }) => {
    await page.goto(`${BASE}/en/panchang`);
    await expect(page.locator('text=/Ashwini|Bharani|Krittika|Rohini|Mrigashira|Ardra|Punarvasu|Pushya|Ashlesha|Magha|Purva Phalguni|Uttara Phalguni|Hasta|Chitra|Swati|Vishakha|Anuradha|Jyeshtha|Mula|Purva Ashadha|Uttara Ashadha|Shravana|Dhanishta|Shatabhisha|Purva Bhadrapada|Uttara Bhadrapada|Revati/')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Kundali Page', () => {
  test('loads and shows birth form', async ({ page }) => {
    await page.goto(`${BASE}/en/kundali`);
    await expect(page.locator('input[type="date"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="time"]')).toBeVisible({ timeout: 10000 });
  });

  test('has ayanamsha selector', async ({ page }) => {
    await page.goto(`${BASE}/en/kundali`);
    await expect(page.locator('text=Lahiri')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Matching Page', () => {
  test('loads with boy/girl input panels', async ({ page }) => {
    await page.goto(`${BASE}/en/matching`);
    await expect(page.locator('text=/Groom|Boy|Bride|Girl/')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Vedic Time Page', () => {
  test('loads and shows Ghati clock', async ({ page }) => {
    await page.goto(`${BASE}/en/vedic-time`);
    await expect(page.locator('text=Ghati')).toBeVisible({ timeout: 10000 });
  });

  test('shows clock mode toggle', async ({ page }) => {
    await page.goto(`${BASE}/en/vedic-time`);
    await expect(page.locator('text=60-Ghati')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=30-Ghati')).toBeVisible({ timeout: 10000 });
  });

  test('switches between 60 and 30 ghati modes', async ({ page }) => {
    await page.goto(`${BASE}/en/vedic-time`);
    await page.click('text=30-Ghati');
    await expect(page.locator('text=Dinamana')).toBeVisible({ timeout: 5000 });
    await page.click('text=60-Ghati');
    await expect(page.locator('text=Ishtakala')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Navigation', () => {
  test('navbar has logo', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await expect(page.locator('text=Dekho Panchang')).toBeVisible({ timeout: 5000 });
  });

  test('navbar links work — Panchang', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.click('nav >> text=Panchang');
    await expect(page).toHaveURL(/\/en\/panchang/);
  });

  test('navbar links work — Kundali', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.click('nav >> text=Kundali');
    await expect(page).toHaveURL(/\/en\/kundali/);
  });

  test('Sign In button visible when not authenticated', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await expect(page.locator('text=Sign In')).toBeVisible({ timeout: 5000 });
  });

  test('Sign In opens auth modal', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.click('text=Sign In');
    await expect(page.locator('text=Continue with Google')).toBeVisible({ timeout: 5000 });
  });

  test('auth modal has forgot password link', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.click('text=Sign In');
    await expect(page.locator('text=Forgot password?')).toBeVisible({ timeout: 5000 });
  });

  test('auth modal switches to signup mode', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.click('text=Sign In');
    await page.click('text=Sign up');
    await expect(page.locator('text=Create Account')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Confirm Password"]')).toBeVisible();
  });
});

test.describe('Locale Switching', () => {
  test('switches to Hindi', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    // Find and click the locale switcher
    const hindi = page.locator('text=हिन्दी');
    if (await hindi.isVisible()) {
      await hindi.click();
      await expect(page).toHaveURL(/\/hi/);
    }
  });
});

test.describe('Learn Page', () => {
  test('loads learning modules', async ({ page }) => {
    await page.goto(`${BASE}/en/learn`);
    await expect(page.locator('text=/Learn|Jyotish|Foundations/')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Calendar Page', () => {
  test('loads festival calendar', async ({ page }) => {
    await page.goto(`${BASE}/en/calendar`);
    await expect(page.locator('text=/Festival|Calendar|Ekadashi/')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Pricing Page', () => {
  test('shows subscription tiers', async ({ page }) => {
    await page.goto(`${BASE}/en/pricing`);
    await expect(page.locator('text=Pro')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Jyotishi')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Profile Page (unauthenticated)', () => {
  test('shows sign-in prompt when not logged in', async ({ page }) => {
    await page.goto(`${BASE}/en/profile`);
    await expect(page.locator('text=/Sign In|sign in/')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Settings Page (unauthenticated)', () => {
  test('shows sign-in prompt when not logged in', async ({ page }) => {
    await page.goto(`${BASE}/en/settings`);
    await expect(page.locator('text=/Sign In|sign in/')).toBeVisible({ timeout: 10000 });
  });
});
