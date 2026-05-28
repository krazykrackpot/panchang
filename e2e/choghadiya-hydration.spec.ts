import { test, expect } from '@playwright/test';

/**
 * Regression tests for React #418 hydration mismatch on ISR-cached [date] routes.
 *
 * Root cause: ChoghadiyaClient / GauriPanchangClient computed year/month/day
 * via todayInTimezone() (new Date()) at render time. When an ISR-cached page
 * was served from a cache generated on a previous day, server HTML and client
 * computed different choghadiya slots → text-content mismatch → React #418 →
 * the entire React tree died, killing analytics pageview events.
 *
 * Fix: the [date] page routes pass urlDate to the client component; both server
 * and client now use the same URL date → no mismatch possible.
 */

test.describe('Choghadiya [date] hydration', () => {
  test('en/choghadiya/<future-date> hydrates without React #418', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.goto('/en/choghadiya/2026-06-15', { waitUntil: 'networkidle' });
    const hydrationErrors = consoleErrors.filter(e => /#418|hydrat/i.test(e));
    expect(hydrationErrors, hydrationErrors.join('\n')).toHaveLength(0);
  });

  test('mai/choghadiya/<future-date> hydrates without React #418', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.goto('/mai/choghadiya/2026-06-15', { waitUntil: 'networkidle' });
    const hydrationErrors = consoleErrors.filter(e => /#418|hydrat/i.test(e));
    expect(hydrationErrors, hydrationErrors.join('\n')).toHaveLength(0);
  });

  test('hi/gauri-panchang/<future-date> hydrates without React #418', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.goto('/hi/gauri-panchang/2026-06-15', { waitUntil: 'networkidle' });
    const hydrationErrors = consoleErrors.filter(e => /#418|hydrat/i.test(e));
    expect(hydrationErrors, hydrationErrors.join('\n')).toHaveLength(0);
  });

  test('en/choghadiya (no date — dynamic route) still works', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.goto('/en/choghadiya', { waitUntil: 'networkidle' });
    const hydrationErrors = consoleErrors.filter(e => /#418|hydrat/i.test(e));
    expect(hydrationErrors, hydrationErrors.join('\n')).toHaveLength(0);
    await expect(page.getByRole('heading', { name: /choghadiya/i }).first()).toBeVisible();
  });
});
