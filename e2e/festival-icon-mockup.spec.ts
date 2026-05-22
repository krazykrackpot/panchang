/**
 * Renders the festival-icon mockup HTML and captures a screenshot for review.
 * Not a regression test — used to verify the Path B samples render as
 * expected and to give the user a single PNG to flip through.
 */
import { test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

test('capture festival-icon mockup screenshot', async ({ page }) => {
  const html = readFileSync(join(process.cwd(), 'docs/tithi-festival-icons-mockup.html'), 'utf-8');
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'test-results/festival-icons-mockup-v2.png', fullPage: true });
});

test('capture Path B comparison section only', async ({ page }) => {
  const html = readFileSync(join(process.cwd(), 'docs/tithi-festival-icons-mockup.html'), 'utf-8');
  // Higher device-pixel ratio for sharper icon rendering.
  await page.setViewportSize({ width: 1200, height: 1600 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  // Scroll into the Path B comparison heading.
  const heading = page.locator('h2', { hasText: 'Path B Samples' }).first();
  await heading.scrollIntoViewIfNeeded();
  // Take a clip from below the heading down through the 5 A/B cards.
  const box = await heading.boundingBox();
  if (box) {
    await page.screenshot({
      path: 'test-results/festival-icons-pathB-zoom.png',
      clip: { x: 0, y: box.y - 20, width: 1200, height: 1500 },
    });
  }
});
