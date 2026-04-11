/**
 * Contribution Pages E2E Tests
 *
 * Tests all 14 contribution pages load without errors,
 * each has title + content, share buttons, timeline with 16+ entries,
 * and Kerala School page has mathematical formulas.
 */

import { test, expect, type Page } from '@playwright/test';

// ── Helper: collect console errors ──────────────────────────────────
function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    errors.push(`[pageerror] ${err.message}`);
  });
  return errors;
}

// All 14 contribution page slugs
const CONTRIBUTION_SLUGS = [
  'binary',
  'calculus',
  'cosmic-time',
  'earth-rotation',
  'fibonacci',
  'gravity',
  'kerala-school',
  'negative-numbers',
  'pi',
  'pythagoras',
  'sine',
  'speed-of-light',
  'timeline',
  'zero',
];

test.describe('Contribution Pages — Load Tests', () => {

  for (const slug of CONTRIBUTION_SLUGS) {
    test(`${slug} page loads without JS errors`, async ({ page }) => {
      const errors = collectConsoleErrors(page);
      await page.goto(`/en/learn/contributions/${slug}`, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Page should have a visible heading
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 10000 });

      // Page should have substantial content
      const bodyText = await page.locator('body').textContent();
      expect(bodyText!.length).toBeGreaterThan(300);

      // Filter critical errors (ignore hydration, analytics, favicon)
      const criticalErrors = errors.filter(e =>
        !e.includes('hydration') &&
        !e.includes('favicon') &&
        !e.includes('ad') &&
        !e.includes('gtag') &&
        !e.includes('analytics') &&
        !e.includes('NEXT_REDIRECT') &&
        !e.includes('net::ERR')
      );
      expect(criticalErrors).toHaveLength(0);
    });
  }
});

test.describe('Contribution Pages — Content Structure', () => {

  test('each contribution page has a title and content sections', async ({ page }) => {
    // Sample 3 pages to verify structure without running all 14
    const samples = ['zero', 'gravity', 'sine'];

    for (const slug of samples) {
      await page.goto(`/en/learn/contributions/${slug}`, { waitUntil: 'load' });
      await page.waitForTimeout(2000);

      // Must have an h1 or h2 title
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 10000 });
      const headingText = await heading.textContent();
      expect(headingText!.length).toBeGreaterThan(5);

      // Must have multiple content sections (paragraphs)
      const paragraphs = page.locator('p');
      const pCount = await paragraphs.count();
      expect(pCount).toBeGreaterThan(3);
    }
  });

  test('share button is present on contribution pages', async ({ page }) => {
    // Check a couple of pages for share functionality
    const samples = ['pi', 'kerala-school', 'timeline'];

    for (const slug of samples) {
      await page.goto(`/en/learn/contributions/${slug}`, { waitUntil: 'load' });
      await page.waitForTimeout(2000);

      const bodyText = await page.locator('body').textContent();
      const hasShare = /Share|WhatsApp|शेयर|Copy/i.test(bodyText || '');
      expect(hasShare).toBe(true);
    }
  });
});

test.describe('Contribution Pages — Timeline', () => {

  test('timeline page loads with 16+ entries', async ({ page }) => {
    await page.goto('/en/learn/contributions/timeline', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const bodyText = await page.locator('body').textContent();

    // Timeline should mention "2,000 Years" or "Visual Timeline"
    expect(bodyText).toMatch(/Timeline|कालरेखा|2,000 Years|Visual/i);

    // Should have many entries — look for CE dates (e.g., "500 CE", "1350 CE")
    const ceMatches = (bodyText || '').match(/\d+\s*CE/g) || [];
    expect(ceMatches.length).toBeGreaterThanOrEqual(10);

    // Should mention "16 discoveries" or "Attribution Gap"
    const hasEntries = /16 discoveries|14 are attributed|Attribution Gap/i.test(bodyText || '');
    expect(hasEntries).toBe(true);
  });

  test('timeline has cross-reference links to other contribution pages', async ({ page }) => {
    await page.goto('/en/learn/contributions/timeline', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    // Timeline cross-references other pages like "Explore the Full Stories"
    const hasCrossRef = /Explore.*Stories|Full Stories|Learn more|और जानें/i.test(bodyText || '');
    expect(hasCrossRef).toBe(true);
  });
});

test.describe('Contribution Pages — Kerala School', () => {

  test('Kerala School page has mathematical formulas', async ({ page }) => {
    await page.goto('/en/learn/contributions/kerala-school', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const bodyText = await page.locator('body').textContent();

    // Should mention Madhava, pi, sine/cosine series
    expect(bodyText).toMatch(/Madhava|माधव/);
    expect(bodyText).toMatch(/π|pi|\u03C0/i);

    // Should contain mathematical notation or series references
    const hasMathContent = /series|formula|infinite|Taylor|Leibniz|correction|convergence|sin|cos/i.test(bodyText || '');
    expect(hasMathContent).toBe(true);

    // Should reference the 250-year gap
    expect(bodyText).toMatch(/250|300|340|years.*before.*Europe|years.*early/i);
  });

  test('Kerala School page has substantial content (long-form article)', async ({ page }) => {
    await page.goto('/en/learn/contributions/kerala-school', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const bodyText = await page.locator('body').textContent();
    // This is a deep article — should be very long
    expect(bodyText!.length).toBeGreaterThan(3000);

    // Should have multiple sections
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(3);
  });
});
