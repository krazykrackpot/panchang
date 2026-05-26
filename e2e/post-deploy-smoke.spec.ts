/**
 * Post-deploy production smoke. Runs against https://dekhopanchang.com
 * via absolute URLs — does NOT use the playwright.config.ts baseURL.
 *
 * Triggered manually after a [deploy] commit lands and Vercel reports
 * Ready. Covers the surface most likely to break in a release:
 *   • basic page renders (home, locale variants)
 *   • new endpoints from this deploy (PR #182 / #186 / #190)
 *   • client hydration of Brihaspati panel + currency display
 *   • critical SEO surfaces (title, og:title, JSON-LD presence)
 *
 * Skips anything that needs a signed-in user — those go through
 * dashboard-saved-kundalis.spec.ts with E2E_AUTH_COOKIE set.
 */

import { test, expect } from '@playwright/test';

const PROD = 'https://dekhopanchang.com';

test.describe('production smoke (post-deploy)', () => {
  test.beforeEach(async ({ page }) => {
    // Surface console errors so we catch hydration mismatches etc.
    page.on('pageerror', (err) => {
      console.error(`[browser pageerror] ${err.message}`);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`[browser console.error] ${msg.text()}`);
      }
    });
  });

  test('home page renders + has the brand title', async ({ page }) => {
    const res = await page.goto(`${PROD}/en`, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle(/Dekho|Panchang/i);
  });

  test('/api/geo endpoint (PR #186) returns a country code', async ({ request }) => {
    const res = await request.get(`${PROD}/api/geo`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    // The runner could be in any country. We only assert the shape.
    expect(body).toHaveProperty('country');
    expect(typeof body.country === 'string' || body.country === null).toBe(true);
  });

  test('/api/brihaspati/check-similarity (PR #190) requires auth', async ({ request }) => {
    const res = await request.post(`${PROD}/api/brihaspati/check-similarity`, {
      data: { question: 'How will my career go?' },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/unauthor/i);
  });

  test('/api/webhooks/stripe (PR #182) rejects unsigned POST with 401', async ({ request }) => {
    const res = await request.post(`${PROD}/api/webhooks/stripe`, {
      data: { id: 'evt_smoke_test' },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toMatch(/signature/i);
  });

  test('panchang city page renders with tithi metadata', async ({ page }) => {
    const res = await page.goto(`${PROD}/en/panchang/delhi`, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);
    // The SEO HTML must include "Panchang" + the city.
    const html = await page.content();
    expect(html).toMatch(/panchang/i);
    expect(html).toMatch(/delhi/i);
  });

  test('Brihaspati panel mounts (button visible) on home', async ({ page }) => {
    await page.goto(`${PROD}/en`, { waitUntil: 'domcontentloaded' });
    // The floating Ask-Brihaspati button is mounted via ClientShell;
    // selector based on accessible name to avoid coupling to internal IDs.
    const button = page.getByRole('button', { name: /brihaspati/i }).first();
    await expect(button).toBeVisible({ timeout: 10000 });
  });

  test('Brihaspati panel currency reflects geo (USD for non-IN runners)', async ({ page }) => {
    // The /api/geo lookup runs client-side on mount. For non-IN
    // runners (US/EU/CH including Vercel test agents), the panel
    // currency should land on USD within a moment. We probe the
    // /api/geo response to compute the expectation.
    const geoRes = await page.request.get(`${PROD}/api/geo`);
    const { country } = await geoRes.json();
    const expectedCurrency = country === 'IN' ? '₹' : '$';

    await page.goto(`${PROD}/en`, { waitUntil: 'domcontentloaded' });
    const button = page.getByRole('button', { name: /brihaspati/i }).first();
    await button.click();

    // Wait for the panel to hydrate + the geo lookup to settle.
    await page.waitForTimeout(2000);
    const html = await page.content();
    // Either the expected symbol is present, or the panel is still
    // in 'idle' showing the question composer (which doesn't show
    // a price). Both are acceptable; we want to rule out the
    // OPPOSITE currency showing (the May 25 incident).
    if (html.includes('₹') || html.includes('$')) {
      if (country !== 'IN') {
        expect(html).not.toMatch(/₹\d/);
      }
    }
  });

  test('home page exposes Organization JSON-LD', async ({ page }) => {
    await page.goto(`${PROD}/en`, { waitUntil: 'domcontentloaded' });
    const ldScripts = await page.locator('script[type="application/ld+json"]').all();
    expect(ldScripts.length).toBeGreaterThan(0);
    let foundOrg = false;
    for (const s of ldScripts) {
      const content = await s.textContent();
      if (content && /Organization|WebSite/i.test(content)) {
        foundOrg = true;
        break;
      }
    }
    expect(foundOrg).toBe(true);
  });

  test('horoscope rashi page (ISR) renders 200', async ({ page }) => {
    const res = await page.goto(`${PROD}/en/horoscope/mesh`, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);
  });

  test('no raw next-intl translation keys leak (regression guard)', async ({ page }) => {
    await page.goto(`${PROD}/en`, { waitUntil: 'domcontentloaded' });
    // Use innerText (rendered visible text only) — textContent would
    // include <script> bodies and match legitimate domain names in
    // inline JS (e.g. "pagead2.googlesyndication.com" trips a generic
    // a.b.c pattern). innerText skips scripts/hidden nodes.
    const visible = await page.locator('body').innerText();
    // Specifically check for the brihaspati keys we touched in #190
    // (the panel tier labels and the "From $X" CTA). If next-intl's
    // missing-key fallback is wired right, these strings should be
    // translated to readable copy, not leaked as keys.
    expect(visible).not.toMatch(/panel\.tier|panel\.fromPrice/);
    // Broader catch: namespace.key (.subkey)* patterns that survive
    // into innerText. innerText already excludes <script> so the
    // remaining domain-name false-positive risk is small; use a
    // negative lookahead to also exclude common TLDs surviving in
    // visible text (footer copy, contact links, etc.).
    //
    // Per Gemini PR #204 review: the previous all-lowercase 3+ seg
    // regex missed camelCase keys (panel.fromPrice), 2-seg keys
    // (panel.tier), and short segments (ui.ok).
    expect(visible).not.toMatch(/(?:^|\s)[a-zA-Z][a-zA-Z0-9_-]+\.(?!com\b|in\b|org\b|net\b|io\b|co\b|dev\b|app\b)[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*(?=$|\s|[.,!?])/);
  });
});
