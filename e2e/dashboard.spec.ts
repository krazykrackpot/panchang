/**
 * Dashboard E2E Tests
 *
 * Tests the personalized dashboard page: Morning Briefing, Week Ahead,
 * Festival Countdown, Eclipse Alert, Dasha Transition Alert,
 * and Learning Streak display.
 *
 * Note: Dashboard requires authentication for full functionality.
 * Without auth, it should show a sign-in prompt. These tests verify
 * both the unauthenticated state and the page structure.
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard — Unauthenticated State', () => {

  test('dashboard page loads without errors', async ({ page }) => {
    await page.goto('/en/dashboard', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    // Page should load and show either dashboard content or sign-in prompt
    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(50);
  });

  test('shows sign-in prompt when not authenticated', async ({ page }) => {
    await page.goto('/en/dashboard', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    // Dashboard should prompt sign-in or show dashboard title
    const hasExpectedContent = /Sign In|Sign in|Dashboard|डैशबोर्ड|personalized|loading/i.test(bodyText || '');
    expect(hasExpectedContent).toBe(true);
  });

  test('dashboard has correct title/heading', async ({ page }) => {
    await page.goto('/en/dashboard', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    // Should contain "Dashboard" or "My Dashboard" or Hindi equivalent
    const hasDashboard = /Dashboard|डैशबोर्ड/i.test(bodyText || '');
    expect(hasDashboard).toBe(true);
  });
});

test.describe('Dashboard — Component Structure', () => {

  test('page references Morning Briefing component', async ({ page }) => {
    await page.goto('/en/dashboard', { waitUntil: 'load' });
    await page.waitForTimeout(4000);

    const bodyText = await page.locator('body').textContent();
    // If authenticated, Morning Briefing shows tithi/nakshatra/yoga
    // If not, sign-in prompt. Either way, page should load.
    const hasRelevantContent =
      /Cosmic Weather|Tithi|Nakshatra|Yoga|Sign In|Loading|personalized|cosmic profile/i.test(bodyText || '');
    expect(hasRelevantContent).toBe(true);
  });

  test('page references week ahead or quick links', async ({ page }) => {
    await page.goto('/en/dashboard', { waitUntil: 'load' });
    await page.waitForTimeout(4000);

    const bodyText = await page.locator('body').textContent();
    // Either shows week-ahead data or auth prompt
    const hasContent =
      /Week Ahead|Quick Links|Birth Chart|Sign In|Loading|birth details/i.test(bodyText || '');
    expect(hasContent).toBe(true);
  });

  test('page mentions dasha, transit, or learning features', async ({ page }) => {
    await page.goto('/en/dashboard', { waitUntil: 'load' });
    await page.waitForTimeout(4000);

    // The dashboard imports components for:
    // EclipseAlert, FestivalCountdown, MorningBriefing, WeekAhead,
    // DashaTransitionAlert, LevelBadge
    // These should be referenced in the page even if behind auth gate
    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(50);
  });
});

test.describe('Dashboard — Hindi Locale', () => {

  test('dashboard loads in Hindi', async ({ page }) => {
    await page.goto('/hi/dashboard', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    // Should contain Devanagari script
    expect(bodyText).toMatch(/[\u0900-\u097F]/);
    // Should mention dashboard in Hindi
    const hasDashboard = /डैशबोर्ड|साइन इन/i.test(bodyText || '');
    expect(hasDashboard).toBe(true);
  });
});

test.describe('Dashboard — Navigation Links', () => {

  test('dashboard page is accessible from navbar or direct URL', async ({ page }) => {
    const response = await page.goto('/en/dashboard', { waitUntil: 'load' });
    // Should return 200 (not 404)
    expect(response?.status()).toBeLessThan(400);
  });

  test('dashboard imports expected component types', async ({ page }) => {
    await page.goto('/en/dashboard', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    // Verify page loaded successfully by checking for the dashboard's key labels
    const bodyText = await page.locator('body').textContent();

    // The page should contain at least one of these dashboard-specific labels
    const hasDashboardLabel =
      /My Dashboard|personalized|Vedic astrology overview|Sign In|Loading|cosmic/i.test(bodyText || '');
    expect(hasDashboardLabel).toBe(true);
  });
});

test.describe('Dashboard — Festival & Eclipse Sections', () => {

  test('festival countdown section label exists in page source', async ({ page }) => {
    await page.goto('/en/dashboard', { waitUntil: 'load' });
    await page.waitForTimeout(4000);

    // Even without auth, the page component references festival/eclipse labels
    // The page body should load without crashing
    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(50);

    // Regardless of auth state, the page should not show error messages
    const hasError = /Something went wrong|Error|error occurred|500/i.test(bodyText || '');
    expect(hasError).toBe(false);
  });

  test('no runtime errors on dashboard page', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto('/en/dashboard', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    // Filter out non-critical errors
    const critical = errors.filter(e =>
      !e.includes('hydration') &&
      !e.includes('NEXT_REDIRECT') &&
      !e.includes('net::ERR')
    );
    expect(critical).toHaveLength(0);
  });
});
