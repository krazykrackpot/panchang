import { test, expect, type Page } from '@playwright/test';

test.describe('Divisional Charts (Varga Tab)', () => {
  // URL params that auto-submit the form. Short-form keys (`la`/`lo`) per
  // `kundali/Client.tsx`'s mount handler; `tz` is ignored (resolved from
  // coords); ayanamsha is hardcoded to lahiri so no need to pass it.
  const KUNDALI_URL = '/en/kundali?n=Test&d=2000-01-15&t=10:30&p=Zurich&la=47.3769&lo=8.5417';

  // Before every test: set the E2E session-storage flag so the SignupPrompt
  // and CookieConsent modals stay closed. They auto-pop on a kundali:generated
  // event + page-view threshold; either race against the next click and
  // intercept pointer events on their z-[9999] backdrop. The flag is checked
  // by `lib/utils/e2e-mode.ts`, which both modals read in their mount
  // effects. Production never sets the flag — sessionStorage is per-tab and
  // can only be written by same-origin scripts, and the only writer is here.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.sessionStorage.setItem('dp-e2e', '1');
      } catch {
        // sessionStorage can throw in some sandboxes — happy-path is fine.
      }
    });
  });

  /** Navigate from form-skip URL to the Varga tab inside Expert mode.
   *
   *  Three deterministic transitions:
   *    1. URL params auto-generate a kundali in Simple Mode.
   *    2. Click the "Expert" toggle → SummaryView (Expert landing card).
   *    3. Click "View Technical Analysis" → tab strip with `data-tab={tab.key}`
   *       buttons; the varga tab is one of them.
   */
  async function gotoVargaTab(page: Page) {
    await page.goto(KUNDALI_URL);

    // Expert toggle is reliably the only "Expert" button on Simple Mode.
    await page.getByRole('button', { name: /^Expert$/ }).click();

    // The SummaryView "View Technical Analysis" button carries
    // `data-testid="view-technical-summary"`. There's a second copy in
    // the SummaryView footer with the same text; the testid disambiguates
    // without relying on `.first()` ordering.
    await page.locator('[data-testid="view-technical-summary"]').click();

    await page.locator('[data-tab="varga"]').click();
    // Confirm the Varga tab is now the active tab — the tabBtn applies a
    // strong gold border via classNames when active. Use a presence check
    // on the pill row container itself instead of waiting on a classname.
    await expect(page.locator('[data-pill]').first()).toBeVisible();
  }

  test('varga tab shows division selector pills', async ({ page }) => {
    await gotoVargaTab(page);
    // Specific, stable selectors — `data-pill="<div>"` is rendered once per
    // pill button in `VargasTab.tsx` and is i18n-independent.
    await expect(page.locator('[data-pill="D9"]')).toBeVisible();
    await expect(page.locator('[data-pill="D10"]')).toBeVisible();
  });

  test('clicking a division pill shows chart and interpretation', async ({ page }) => {
    await gotoVargaTab(page);
    await page.locator('[data-pill="D10"]').click();
    // After click, D10 should be the active pill.
    await expect(page.locator('[data-pill="D10"][data-pill-active]')).toBeVisible();
    // The "Dasamsha" name appears both in the chart-title h2 and in a
    // description h3. We only need ONE occurrence to prove selection — scope
    // to the chart-title heading via role.
    await expect(page.getByRole('heading', { level: 2, name: /Dasamsha|दशांश/ })).toBeVisible();
    // Planet placements section appears in the deep-analysis card; just
    // assert its presence by text without locking to a heading level.
    await expect(page.getByText(/Planet Placements|ग्रह स्थितियां/)).toBeVisible();
  });

  test('D9 is selected by default', async ({ page }) => {
    await gotoVargaTab(page);
    await expect(page.locator('[data-pill="D9"][data-pill-active]')).toBeVisible();
  });

  test('D60 pill is visible and selectable', async ({ page }) => {
    // Bonus: covers the D60 deity surfacing work merged in PRs #299/#301/
    // #303/#316. The deeper assertion (legend renders, deity rows shown)
    // belongs in a dedicated spec; this one verifies the pill is wired.
    await gotoVargaTab(page);
    await expect(page.locator('[data-pill="D60"]')).toBeVisible();
    await page.locator('[data-pill="D60"]').click();
    await expect(page.locator('[data-pill="D60"][data-pill-active]')).toBeVisible();
    // The Shashtiamsha deity card from PR #303 should appear. The
    // card wrapper carries `data-testid="d60-deity-card"` — selecting on
    // testid rather than the heading text means future copy changes
    // (e.g. "Shashtiamsha Deities — Classical Segment Interpretation"
    // -> shorter title) don't break the test.
    await expect(page.locator('[data-testid="d60-deity-card"]')).toBeVisible();
  });
});
