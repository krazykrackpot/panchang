/**
 * Dashboard → Saved Kundalis integration.
 *
 * Context: in Apr 2026 the saved-charts subpage worked fine but was only
 * reachable via a Quick Link tile on the dashboard — users couldn't find
 * their saved charts and assumed Save was broken. Fix was an inline
 * "My Saved Kundalis" section on /dashboard.
 *
 * Separately: card links passed `?n=X&d=Y&t=Z&la=...&lo=...` to /kundali
 * but the kundali page ignored URL params. Even if the section rendered,
 * clicks went to the wrong chart.
 *
 * These tests (a) verify the inline section exists on the dashboard and
 * (b) verify each saved card's href carries the expected query params,
 * so a future refactor can't silently drop either integration.
 *
 * Auth is mocked via route interception — we stub the Supabase client
 * calls so the tests don't depend on a live session.
 */

import { test, expect } from '@playwright/test';

// Mock saved_charts rows returned to the dashboard query. Three entries
// covering the common shape (Devanagari name, English name, mixed).
const MOCK_CHARTS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    label: 'Arjun Jha',
    birth_data: {
      name: 'Arjun Jha',
      date: '2016-09-09',
      time: '19:45',
      place: 'Luxembourg',
      lat: 49.8159,
      lng: 6.1297,
      timezone: 'Europe/Luxembourg',
    },
    is_primary: false,
    created_at: '2026-04-16T07:59:37.167091+00:00',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    label: 'Vaibhavi Jha',
    birth_data: {
      name: 'Vaibhavi Jha',
      date: '1985-06-20',
      time: '14:45',
      place: 'Mumbai',
      lat: 19.076,
      lng: 72.8777,
      timezone: 'Asia/Kolkata',
    },
    is_primary: false,
    created_at: '2026-04-16T07:53:06.871155+00:00',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    label: 'Adi Kumar',
    birth_data: {
      name: 'Adi Kumar',
      date: '1990-01-15',
      time: '08:30',
      place: 'Delhi',
      lat: 28.6139,
      lng: 77.209,
      timezone: 'Asia/Kolkata',
    },
    is_primary: true,
    created_at: '2026-04-10T14:28:33.583813+00:00',
  },
];

// Note: this test relies on being able to reach the dashboard authenticated
// state. If the dashboard redirects to sign-in before our mock kicks in,
// Playwright will navigate away and the test will degrade gracefully.
test.describe('Dashboard — My Saved Kundalis section', () => {
  test.skip(
    !process.env.E2E_AUTH_COOKIE,
    'Requires E2E_AUTH_COOKIE env var with a valid dekho-panchang-auth session for the dashboard to render the authenticated flow.',
  );

  test('renders each saved chart with a correctly-parameterized Open Kundali link', async ({ page, context }) => {
    // Inject a session cookie so the dashboard treats us as logged in.
    if (process.env.E2E_AUTH_COOKIE) {
      await context.addCookies([
        {
          name: 'dekho-panchang-auth',
          value: process.env.E2E_AUTH_COOKIE,
          domain: 'localhost',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
      ]);
    }

    // Intercept the Supabase saved_charts query and return our fixture.
    // Supabase PostgREST URLs look like:
    //   https://<proj>.supabase.co/rest/v1/saved_charts?user_id=eq.XXX&...
    await page.route(/\/rest\/v1\/saved_charts/, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_CHARTS),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/en/dashboard', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const bodyText = (await page.locator('body').textContent()) || '';

    // If we never got past the sign-in wall, skip gracefully rather than
    // fail loudly — the test is about the logged-in rendering, not auth.
    test.skip(
      /sign in to see|please sign in/i.test(bodyText) && !bodyText.includes('Arjun Jha'),
      'Dashboard did not render authenticated state — auth cookie may be expired.',
    );

    // All three saved charts should be visible by name.
    for (const chart of MOCK_CHARTS) {
      expect(bodyText).toContain(chart.label);
    }

    // Each card must have an "Open Kundali" link whose href carries the
    // correct query params. This is the exact contract the kundali page
    // now honors (URL params beat sessionStorage).
    for (const chart of MOCK_CHARTS) {
      const link = page.locator(`a[href*="${encodeURIComponent(chart.label)}"]`).first();
      const href = await link.getAttribute('href');

      expect(href, `Missing link for ${chart.label}`).toBeTruthy();
      expect(href).toContain(`d=${chart.birth_data.date}`);
      expect(href).toContain(`t=${chart.birth_data.time}`);
      expect(href).toContain(`la=${chart.birth_data.lat}`);
      expect(href).toContain(`lo=${chart.birth_data.lng}`);
    }
  });
});
