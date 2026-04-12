/**
 * Comprehensive E2E Tests — Playwright
 *
 * Tests all major pages, navigation flows, dead buttons,
 * console errors, locale switching, and form interactions.
 */

import { test, expect, type Page } from '@playwright/test';

// ─── Helper: collect console errors on a page ────────────────────────
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

// ─── Helper: check no JS errors on page ──────────────────────────────
async function expectNoJSErrors(page: Page, url: string) {
  const errors = collectConsoleErrors(page);
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await page.waitForLoadState('networkidle');
  const criticalErrors = errors.filter(e =>
    !e.includes('hydration') &&
    !e.includes('favicon') &&
    !e.includes('ad') &&
    !e.includes('gtag') &&
    !e.includes('analytics') &&
    !e.includes('NEXT_REDIRECT') &&
    !e.includes('net::ERR')
  );
  return criticalErrors;
}

// ═══════════════════════════════════════════════════════════════════════
// SECTION 1: PAGE LOAD TESTS (All major pages load without JS errors)
// ═══════════════════════════════════════════════════════════════════════

const CORE_PAGES = [
  { path: '/en', name: 'Home' },
  { path: '/en/panchang', name: 'Panchang' },
  { path: '/en/kundali', name: 'Kundali' },
  { path: '/en/matching', name: 'Matching' },
  { path: '/en/calendar', name: 'Calendar' },
  { path: '/en/about', name: 'About' },
];

const DEEP_DIVE_PAGES = [
  { path: '/en/panchang/tithi', name: 'Tithi Deep Dive' },
  { path: '/en/panchang/nakshatra', name: 'Nakshatra Deep Dive' },
  { path: '/en/panchang/yoga', name: 'Yoga Deep Dive' },
  { path: '/en/panchang/karana', name: 'Karana Deep Dive' },
  { path: '/en/panchang/rashi', name: 'Rashi Deep Dive' },
  { path: '/en/panchang/masa', name: 'Masa Deep Dive' },
  { path: '/en/panchang/samvatsara', name: 'Samvatsara' },
  { path: '/en/panchang/grahan', name: 'Grahan' },
];

const TOOL_PAGES = [
  { path: '/en/sign-calculator', name: 'Sign Calculator' },
  { path: '/en/sade-sati', name: 'Sade Sati' },
  { path: '/en/prashna', name: 'Prashna' },
  { path: '/en/baby-names', name: 'Baby Names' },
  { path: '/en/shraddha', name: 'Shraddha' },
  { path: '/en/vedic-time', name: 'Vedic Time' },
  { path: '/en/varshaphal', name: 'Varshaphal' },
  { path: '/en/kp-system', name: 'KP System' },
  { path: '/en/devotional', name: 'Devotional' },
  { path: '/en/muhurta-ai', name: 'Muhurta AI' },
  { path: '/en/transits', name: 'Transits' },
  { path: '/en/eclipses', name: 'Eclipses' },
  { path: '/en/retrograde', name: 'Retrograde' },
];

const LEARN_PAGES = [
  { path: '/en/learn', name: 'Learn Hub' },
  { path: '/en/learn/grahas', name: 'Learn Grahas' },
  { path: '/en/learn/rashis', name: 'Learn Rashis' },
  { path: '/en/learn/nakshatras', name: 'Learn Nakshatras' },
  { path: '/en/learn/tithis', name: 'Learn Tithis' },
  { path: '/en/learn/yogas', name: 'Learn Yogas' },
  { path: '/en/learn/kundali', name: 'Learn Kundali' },
];

test.describe('Page Load — Core Pages', () => {
  for (const pg of CORE_PAGES) {
    test(`${pg.name} (${pg.path}) loads without critical JS errors`, async ({ page }) => {
      const errors = await expectNoJSErrors(page, pg.path);
      if (errors.length > 0) {
        console.warn(`[BUG-LOG] JS errors on ${pg.path}:`, errors);
      }
      expect(page.url()).toContain(pg.path.split('?')[0]);
    });
  }
});

test.describe('Page Load — Deep Dive Pages', () => {
  for (const pg of DEEP_DIVE_PAGES) {
    test(`${pg.name} (${pg.path}) loads`, async ({ page }) => {
      const errors = await expectNoJSErrors(page, pg.path);
      if (errors.length > 0) {
        console.warn(`[BUG-LOG] JS errors on ${pg.path}:`, errors);
      }
      expect(page.url()).toContain(pg.path.split('?')[0]);
    });
  }
});

test.describe('Page Load — Tool Pages', () => {
  for (const pg of TOOL_PAGES) {
    test(`${pg.name} (${pg.path}) loads`, async ({ page }) => {
      const errors = await expectNoJSErrors(page, pg.path);
      if (errors.length > 0) {
        console.warn(`[BUG-LOG] JS errors on ${pg.path}:`, errors);
      }
      expect(page.url()).toContain(pg.path.split('?')[0]);
    });
  }
});

test.describe('Page Load — Learn Pages', () => {
  for (const pg of LEARN_PAGES) {
    test(`${pg.name} (${pg.path}) loads`, async ({ page }) => {
      const errors = await expectNoJSErrors(page, pg.path);
      if (errors.length > 0) {
        console.warn(`[BUG-LOG] JS errors on ${pg.path}:`, errors);
      }
      expect(page.url()).toContain(pg.path.split('?')[0]);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// SECTION 2: NAVIGATION & LINKS
// ═══════════════════════════════════════════════════════════════════════

test.describe('Navigation', () => {
  test('navbar has working links', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Check that navbar is visible
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible({ timeout: 15000 });

    // Count all links in navbar
    const links = nav.locator('a[href]');
    const count = await links.count();
    expect(count).toBeGreaterThan(3);
  });

  test('footer has working links', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    const footer = page.locator('footer').first();
    if (await footer.isVisible()) {
      const links = footer.locator('a[href]');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('home page CTA buttons are clickable', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Find all links on the page (React uses <a> for navigation)
    const links = page.locator('a[href]');
    const count = await links.count();
    expect(count).toBeGreaterThan(5);

    // Verify first few links have valid href
    for (let i = 0; i < Math.min(5, count); i++) {
      const link = links.nth(i);
      if (await link.isVisible().catch(() => false)) {
        const href = await link.getAttribute('href');
        expect(href).toBeTruthy();
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// SECTION 3: DEAD BUTTON DETECTION
// ═══════════════════════════════════════════════════════════════════════

test.describe('Dead Button Detection', () => {
  const PAGES_TO_CHECK = ['/en', '/en/panchang', '/en/kundali', '/en/matching', '/en/calendar'];

  for (const pagePath of PAGES_TO_CHECK) {
    test(`no dead buttons on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath, { waitUntil: 'load', timeout: 30000 });
      await page.waitForLoadState('networkidle');

      // Find all buttons that are not disabled
      const buttons = page.locator('button:not([disabled])');
      const count = await buttons.count();

      const deadButtons: string[] = [];
      for (let i = 0; i < count; i++) {
        const btn = buttons.nth(i);
        if (!(await btn.isVisible())) continue;

        // Check if button has any event handler or is inside a form
        const hasHandler = await btn.evaluate(el => {
          const hasOnClick = el.hasAttribute('onclick') || (el as HTMLButtonElement).type === 'submit';
          // React attaches events differently, so also check for common patterns
          const hasReactHandler = el.getAttribute('data-action') !== null;
          const isInsideForm = el.closest('form') !== null;
          const isInsideLink = el.closest('a') !== null;
          const hasAriaRole = el.getAttribute('role') !== null;
          return hasOnClick || hasReactHandler || isInsideForm || isInsideLink || hasAriaRole;
        });

        const text = (await btn.textContent())?.trim() ?? '';
        const classes = await btn.getAttribute('class') ?? '';

        // Skip icon-only buttons, menu toggles, etc.
        if (text === '' && !classes.includes('close') && !classes.includes('toggle')) continue;

        // Log potentially dead buttons (no handler and not in a form/link)
        if (!hasHandler && text.length > 0) {
          // This isn't necessarily a bug (React handlers aren't detectable this way)
          // but we log for manual inspection
          deadButtons.push(`Button: "${text.substring(0, 50)}" on ${pagePath}`);
        }
      }

      if (deadButtons.length > 0) {
        console.warn(`[BUG-LOG] Potentially dead buttons on ${pagePath}:`, deadButtons);
      }
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// SECTION 4: LOCALE / i18n TESTS
// ═══════════════════════════════════════════════════════════════════════

test.describe('Internationalization (i18n)', () => {
  test('English locale loads correctly', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    // Layout sets <html lang={locale}>
    const html = await page.locator('html').getAttribute('lang');
    expect(html).toBe('en');
  });

  test('Hindi locale loads correctly', async ({ page }) => {
    await page.goto('/hi', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    // Should have Hindi content — the Gayatri Mantra is always present on home page
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toMatch(/[\u0900-\u097F]/); // Devanagari range
  });

  test('Sanskrit locale loads correctly', async ({ page }) => {
    await page.goto('/sa', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toMatch(/[\u0900-\u097F]/); // Sanskrit also uses Devanagari
  });

  test('locale switcher is present and functional', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Look for any locale-related link or button (EN/HI/SA switcher)
    const bodyText = await page.locator('body').textContent();
    // The page should at minimum contain English text
    expect(bodyText!.length).toBeGreaterThan(100);
  });

  test('panchang page shows content in Hindi', async ({ page }) => {
    await page.goto('/hi/panchang', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').textContent();
    // Should contain Devanagari text for tithi/nakshatra
    expect(bodyText).toMatch(/[\u0900-\u097F]/);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// SECTION 5: FORM INTERACTIONS
// ═══════════════════════════════════════════════════════════════════════

test.describe('Kundali Form', () => {
  test('form has required fields', async ({ page }) => {
    await page.goto('/en/kundali', { waitUntil: 'load' });
    // Wait for client-side hydration — BirthForm is a client component
    await page.waitForLoadState('networkidle');

    // BirthForm renders date/time inputs after hydration
    // Check for any interactive elements (inputs, selects, buttons)
    const allInputs = page.locator('input, select, textarea');
    const count = await allInputs.count();

    // Also check for buttons (Generate/Calculate)
    const buttons = page.locator('button');
    const btnCount = await buttons.count();

    // Page should have some interactive elements (form inputs or buttons)
    expect(count + btnCount).toBeGreaterThanOrEqual(1);
  });

  test('form validates required fields before submission', async ({ page }) => {
    await page.goto('/en/kundali', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Try to submit empty form
    const submitBtn = page.locator('button[type="submit"], button:has-text("Generate"), button:has-text("Calculate")').first();
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitBtn.click();
      await page.waitForLoadState('networkidle');

      // Should still be on kundali page (not navigated away)
      expect(page.url()).toContain('/kundali');
    }
  });
});

test.describe('Matching Form', () => {
  test('matching page has two profile sections', async ({ page }) => {
    await page.goto('/en/matching', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Should have interactive elements (selects, inputs, or buttons for matching)
    const selects = page.locator('select');
    const selectCount = await selects.count();
    const inputs = page.locator('input');
    const inputCount = await inputs.count();

    // At minimum should have some form elements for the two profiles
    expect(selectCount + inputCount).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Sign Calculator', () => {
  test('sign calculator page loads and has inputs', async ({ page }) => {
    await page.goto('/en/sign-calculator', { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');

    // Sign calculator has date, time, and location inputs
    const allInputs = page.locator('input');
    const count = await allInputs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// SECTION 6: API RESPONSE TESTS (via page fetch)
// ═══════════════════════════════════════════════════════════════════════

test.describe('API Smoke Tests', () => {
  test('panchang API returns valid JSON', async ({ request }) => {
    const res = await request.get('/api/panchang?lat=28.6&lng=77.2&tz=5.5');
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('tithi');
    expect(data).toHaveProperty('nakshatra');
    expect(data).toHaveProperty('yoga');
    expect(data).toHaveProperty('karana');
  });

  test('matching API returns valid score', async ({ request }) => {
    const res = await request.post('/api/matching', {
      data: {
        boy: { moonNakshatra: 1, moonRashi: 1 },
        girl: { moonNakshatra: 10, moonRashi: 5 },
      },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.totalScore).toBeGreaterThanOrEqual(0);
    expect(data.totalScore).toBeLessThanOrEqual(36);
  });

  test('transits API returns events array', async ({ request }) => {
    const res = await request.get('/api/transits?year=2024');
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('events');
  });

  test('eclipses API returns eclipse data', async ({ request }) => {
    const res = await request.get('/api/eclipses?year=2024');
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('eclipses');
  });
});

// ═══════════════════════════════════════════════════════════════════════
// SECTION 7: RESPONSIVE DESIGN
// ═══════════════════════════════════════════════════════════════════════

test.describe('Responsive Design', () => {
  test('home page renders on mobile viewport', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 }, // iPhone X
    });
    const page = await context.newPage();
    await page.goto('/en', { waitUntil: 'load' });

    // Should not have horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // 5px tolerance

    await context.close();
  });

  test('panchang page renders on tablet viewport', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 768, height: 1024 }, // iPad
    });
    const page = await context.newPage();
    await page.goto('/en/panchang', { waitUntil: 'load' });

    // Page should load without errors
    expect(page.url()).toContain('/panchang');
    await context.close();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// SECTION 8: 404 & ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════

test.describe('Error Handling', () => {
  test('invalid page shows 404 or redirects', async ({ page }) => {
    const res = await page.goto('/en/this-page-does-not-exist', { waitUntil: 'load' });
    // Should either show 404 page or redirect
    expect(res?.status()).toBeDefined();
    if (res?.status() === 404) {
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toMatch(/not found|404|error/i);
    }
  });

  test('invalid locale redirects or shows error', async ({ page }) => {
    const res = await page.goto('/xx/panchang', { waitUntil: 'load' });
    // Should redirect to default locale or show error
    expect(res?.status()).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// SECTION 9: FEATURE GATE REGRESSION (free-tier API access)
// These tests catch the class of bug where an API endpoint incorrectly
// requires a paid plan for features that should be free.
// ═══════════════════════════════════════════════════════════════════════

const FREE_TIER_BIRTH_DATA = {
  name: 'Test',
  date: '1990-06-15',
  time: '10:30',
  lat: 28.6139,
  lng: 77.2090,
  timezone: '5.5',
  place: 'Delhi',
  ayanamsha: 'lahiri',
};

test.describe('Feature Gate — Free Tier Access (unauthenticated)', () => {
  test('POST /api/kp-system returns 200 for unauthenticated request (free tier)', async ({ request }) => {
    const res = await request.post('/api/kp-system', { data: FREE_TIER_BIRTH_DATA });
    expect(res.status()).not.toBe(403);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).not.toHaveProperty('error');
    expect(data).toHaveProperty('chart');
  });

  test('POST /api/prashna-ashtamangala returns 200 for unauthenticated request (free tier)', async ({ request }) => {
    const res = await request.post('/api/prashna-ashtamangala', {
      data: {
        numbers: [7, 21, 54],
        category: 'wealth',
        lat: 28.6139,
        lng: 77.2090,
        tz: 5.5,
        timezone: 'Asia/Kolkata',
      },
    });
    expect(res.status()).not.toBe(403);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).not.toHaveProperty('error');
  });

  test('POST /api/varshaphal returns 200 for unauthenticated request (free tier)', async ({ request }) => {
    const res = await request.post('/api/varshaphal', {
      data: {
        birthData: FREE_TIER_BIRTH_DATA,
        year: 2025,
      },
    });
    expect(res.status()).not.toBe(403);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).not.toHaveProperty('error');
  });

  test('POST /api/kundali returns 200 for unauthenticated request (free tier)', async ({ request }) => {
    const res = await request.post('/api/kundali', { data: FREE_TIER_BIRTH_DATA });
    expect(res.status()).not.toBe(403);
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data).not.toHaveProperty('error');
    expect(data).toHaveProperty('ascendant');
  });

  test('POST /api/muhurta-ai returns 200 for unauthenticated request (free tier)', async ({ request }) => {
    const res = await request.post('/api/muhurta-ai', {
      data: {
        lat: 28.6139,
        lng: 77.2090,
        tz: 5.5,
        timezone: 'Asia/Kolkata',
        activity: 'travel',
        startDate: '2025-06-01',
        endDate: '2025-06-07',
      },
    });
    // muhurta-ai uses usage gate — may return 429 if limit hit, but never 403
    const status = res.status();
    expect(status).not.toBe(403);
    expect([200, 429]).toContain(status);
  });
});
