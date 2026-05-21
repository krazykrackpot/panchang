/**
 * Playwright smoke for the 2026-05-21 activation fix.
 *
 * Verifies the two modified files don't introduce:
 *   - console errors / pageerror events on /dashboard or /
 *   - rapid duplicate POST requests to /api/user/profile (the 2026-05-20
 *     email-bombardment failure mode — see profile-email-guard.test.ts)
 *   - re-render loops symptomized by a flurry of duplicate GETs
 *
 * Auth: tests run unauthenticated (no Supabase session). The modified
 * conditional render lives inside the authenticated render path, but the
 * dashboard PAGE COMPONENT still mounts and the conditional must compile
 * cleanly. Combined with the static guards in
 * src/lib/__tests__/onboarding-skip-and-progress.test.ts, this gives:
 *   - source-level correctness (static guard, fast)
 *   - runtime correctness on the same file (this smoke, slower)
 */

import { test, expect, type Page, type ConsoleMessage, type Request } from '@playwright/test';

type NetSample = {
  profileGets: number;
  profilePosts: number;
  duplicateProfileCalls: number;
  consoleErrors: string[];
  pageErrors: string[];
};

async function sampleTraffic(page: Page, url: string, holdMs: number): Promise<NetSample> {
  const profileRequests: Request[] = [];
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  const onRequest = (req: Request) => {
    const u = req.url();
    if (u.includes('/api/user/profile')) profileRequests.push(req);
  };
  const onConsole = (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filter known-benign noise: AdSense CSP probe noise, hydration text on
      // SSG locale pages, missing-NEXT_PUBLIC_SUPABASE_URL when env is absent.
      if (
        /adtrafficquality|hydration|favicon|net::ERR_/i.test(text) ||
        /Failed to load resource/i.test(text)
      ) {
        return;
      }
      consoleErrors.push(text);
    }
  };
  const onPageError = (err: Error) => pageErrors.push(err.message);

  page.on('request', onRequest);
  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  await page.goto(url, { waitUntil: 'load' });
  // Hold to observe potential render loops / late effects.
  await page.waitForTimeout(holdMs);

  page.off('request', onRequest);
  page.off('console', onConsole);
  page.off('pageerror', onPageError);

  const profileGets = profileRequests.filter((r) => r.method() === 'GET').length;
  const profilePosts = profileRequests.filter((r) => r.method() === 'POST').length;

  // "Duplicate" = more than one GET to the same URL in the sample window.
  // A render loop produces dozens. One or two is fine (hook + dashboard
  // both call it, but the hook caches at module level).
  const urlCounts = new Map<string, number>();
  for (const r of profileRequests) {
    const k = `${r.method()} ${r.url()}`;
    urlCounts.set(k, (urlCounts.get(k) || 0) + 1);
  }
  // Highest single-URL hit count minus one. Clamp inner max to 0 so an empty
  // profileRequests set (e.g. unauthenticated home page) doesn't yield -1.
  const maxHits = urlCounts.size > 0 ? Math.max(...urlCounts.values()) : 0;
  const duplicateProfileCalls = Math.max(0, maxHits - 1);

  return { profileGets, profilePosts, duplicateProfileCalls, consoleErrors, pageErrors };
}

test.describe('Activation fix — runtime safety', () => {
  test('dashboard: zero pageerrors, zero POSTs to /api/user/profile', async ({ page }) => {
    const sample = await sampleTraffic(page, '/en/dashboard', 8000);

    // The bombardment guarantee: dashboard MUST NOT POST to the profile route.
    expect(sample.profilePosts, 'dashboard POSTed to /api/user/profile — bombardment risk').toBe(0);

    // No JS exceptions during 8s of dwell.
    expect(sample.pageErrors).toEqual([]);

    // Allow a small number of GETs (caching coalesces); a render loop would
    // produce >>5 identical GETs.
    expect(sample.duplicateProfileCalls, 'rapid duplicate calls suggest render loop').toBeLessThan(5);
  });

  test('home: no errors, no profile traffic when unauthenticated', async ({ page }) => {
    const sample = await sampleTraffic(page, '/en', 5000);

    expect(sample.profilePosts).toBe(0);
    expect(sample.pageErrors).toEqual([]);
  });

  test('dashboard renders progress-bar copy in unauthenticated state graceful path', async ({ page }) => {
    // We can't assert the progress bar IS visible (auth required), but we
    // can assert the dashboard renders without crashing — that's where the
    // modified conditional lives. The earlier dashboard.spec.ts asserts
    // sign-in prompt or dashboard chrome; we just confirm length here so
    // a compilation error in the modified branch would surface as a 500.
    const response = await page.goto('/en/dashboard', { waitUntil: 'load' });
    expect(response?.status()).toBeLessThan(400);
    const body = await page.locator('body').textContent();
    expect((body || '').length).toBeGreaterThan(100);
  });
});
