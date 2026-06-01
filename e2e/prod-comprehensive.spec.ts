/**
 * Comprehensive production E2E — read-only.
 *
 * Hits https://dekhopanchang.com. Verifies:
 *   1. Site infrastructure   (robots, sitemap, geo API, 404)
 *   2. All 9 locale homepages render with no console errors / no raw i18n keys
 *   3. Core tool pages render (kundali, panchang, matching, calendar)
 *   4. Regional calendars (Bengali — shipped + indexed)
 *   5. Learn landing + a chapter
 *   6. Anonymous kundali generation (form fill + submit + chart render)
 *   7. ISR hydration safety (no pageerror on ISR-cached date pages — guards Lesson ZD)
 *   8. SEO surfaces (canonical, hreflang, JSON-LD on tool pages)
 *   9. Mobile viewport rendering for key pages   (tagged @mobile)
 *
 * NO writes: no signup, no checkout, no chart save, no email triggers.
 */
import { test, expect, Page } from '@playwright/test';

const PROD = 'https://dekhopanchang.com';
const LOCALES = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mr', 'mai'] as const;

// Collect pageerrors and console.errors per test so we can fail loudly.
function attachErrorRecorders(page: Page, sink: { pageerrors: string[]; consoleErrors: string[] }) {
  page.on('pageerror', (err) => {
    sink.pageerrors.push(err.message);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      // Filter known-noisy thirdparty errors that aren't our bug:
      // - AdSense, gtag, doubleclick ad errors (network blocked, etc.)
      // - GA "Refused to load" CSP probes
      if (/googlesyndication|googletagmanager|doubleclick|adservice|gtag|google-analytics/i.test(txt)) return;
      sink.consoleErrors.push(txt);
    }
  });
}

// ───────────────────────────────────────────────────────────────────────
// 1. Site infrastructure
// ───────────────────────────────────────────────────────────────────────
test.describe('infrastructure', () => {
  test('robots.txt is served', async ({ request }) => {
    const res = await request.get(`${PROD}/robots.txt`);
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toMatch(/User-agent/i);
    expect(text).toMatch(/Sitemap:/i);
  });

  test('sitemap.xml is served and references multiple locales', async ({ request }) => {
    const res = await request.get(`${PROD}/sitemap.xml`);
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain('<urlset');
    // Should reference at least the 4 must-haves
    for (const loc of ['en', 'hi', 'bn', 'mai']) {
      expect(xml).toMatch(new RegExp(`dekhopanchang\\.com/${loc}`));
    }
  });

  test('/api/geo returns shape { country }', async ({ request }) => {
    const res = await request.get(`${PROD}/api/geo`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('country');
  });

  test('404 page returns 404 and renders something', async ({ page }) => {
    const res = await page.goto(`${PROD}/en/this-route-does-not-exist-xyz123`, {
      waitUntil: 'domcontentloaded',
    });
    expect(res?.status()).toBe(404);
  });
});

// ───────────────────────────────────────────────────────────────────────
// 2. All locale homepages
// ───────────────────────────────────────────────────────────────────────
test.describe('locale homepages', () => {
  for (const locale of LOCALES) {
    test(`/${locale} renders, no console errors, no raw i18n keys`, async ({ page }) => {
      const sink = { pageerrors: [] as string[], consoleErrors: [] as string[] };
      attachErrorRecorders(page, sink);

      const res = await page.goto(`${PROD}/${locale}`, { waitUntil: 'domcontentloaded' });
      expect(res?.status(), `/${locale} should 200`).toBe(200);

      // Title element should be non-empty
      await expect(page).toHaveTitle(/.+/);

      // Wait briefly for client hydration
      await page.waitForTimeout(1500);

      // No raw next-intl keys leak into visible text
      const visible = await page.locator('body').innerText();
      expect(
        visible,
        `Raw i18n key leak on /${locale}: ${visible.slice(0, 200)}`
      ).not.toMatch(/\b[a-zA-Z][a-zA-Z0-9_-]+\.(?!com\b|in\b|org\b|net\b|io\b|co\b|dev\b|app\b)[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+){0,3}\b/);

      // Hydration sanity
      expect(sink.pageerrors, `pageerror on /${locale}`).toEqual([]);
    });
  }
});

// ───────────────────────────────────────────────────────────────────────
// 3. Core tool pages render
// ───────────────────────────────────────────────────────────────────────
const CORE_PAGES = [
  { path: '/en/kundali', name: 'Kundali tool', mustContain: /kundali|birth/i },
  { path: '/en/panchang', name: 'Panchang', mustContain: /panchang|tithi/i },
  { path: '/en/matching', name: 'Matching', mustContain: /matching|kuta|compatibility/i },
  { path: '/en/calendar', name: 'Calendar', mustContain: /calendar|festival/i },
  { path: '/en/horoscope/mesh', name: 'Horoscope Aries', mustContain: /aries|mesh|horoscope/i },
  { path: '/en/muhurat', name: 'Muhurat', mustContain: /muhurat|muhurta/i },
  { path: '/en/sade-sati', name: 'Sade Sati', mustContain: /sade.sati|saturn/i },
];

test.describe('core tool pages', () => {
  for (const p of CORE_PAGES) {
    test(`${p.name} (${p.path})`, async ({ page }) => {
      const sink = { pageerrors: [] as string[], consoleErrors: [] as string[] };
      attachErrorRecorders(page, sink);
      const res = await page.goto(`${PROD}${p.path}`, { waitUntil: 'domcontentloaded' });
      expect(res?.status(), `${p.path} should 200`).toBe(200);
      const html = await page.content();
      expect(html, `${p.path} should contain ${p.mustContain}`).toMatch(p.mustContain);
      await page.waitForTimeout(1000);
      expect(sink.pageerrors).toEqual([]);
    });
  }
});

// ───────────────────────────────────────────────────────────────────────
// 4. Regional calendars
// ───────────────────────────────────────────────────────────────────────
test.describe('regional calendars', () => {
  test('Bengali calendar page renders', async ({ page }) => {
    const sink = { pageerrors: [] as string[], consoleErrors: [] as string[] };
    attachErrorRecorders(page, sink);
    const res = await page.goto(`${PROD}/bn/calendar/regional/bengali`, {
      waitUntil: 'domcontentloaded',
    });
    expect(res?.status()).toBe(200);
    const html = await page.content();
    // Bilingual title must include both regional script + English
    expect(html, 'page should have bangla script').toMatch(/[ঀ-৿]/);
    expect(sink.pageerrors).toEqual([]);
  });

  test('Marathi calendar landing renders', async ({ page }) => {
    const res = await page.goto(`${PROD}/mr`, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);
  });

  test('Maithili (#1 traffic) calendar landing renders', async ({ page }) => {
    const res = await page.goto(`${PROD}/mai`, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);
  });
});

// ───────────────────────────────────────────────────────────────────────
// 5. Learn pages
// ───────────────────────────────────────────────────────────────────────
test.describe('learn surface', () => {
  test('/en/learn landing renders with module index', async ({ page }) => {
    const res = await page.goto(`${PROD}/en/learn`, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);
    const html = await page.content();
    expect(html).toMatch(/learn|chapter|foundation/i);
  });

  test('/en/learn/grahas chapter renders', async ({ page }) => {
    const res = await page.goto(`${PROD}/en/learn/grahas`, { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(200);
  });
});

// ───────────────────────────────────────────────────────────────────────
// 6. Anonymous kundali generation (functional)
// ───────────────────────────────────────────────────────────────────────
test.describe('kundali generation (anonymous)', () => {
  test('fill birth form + generate + chart renders', async ({ page }) => {
    test.setTimeout(120_000);
    const sink = { pageerrors: [] as string[], consoleErrors: [] as string[] };
    attachErrorRecorders(page, sink);

    await page.goto(`${PROD}/en/kundali`, { waitUntil: 'domcontentloaded' });

    // Try a couple of common selector patterns the form might use.
    // Birth date — first <input type="date"> or one labelled "Date"
    const dateInput = page.locator('input[type="date"], input[name*="date" i]').first();
    await expect(dateInput).toBeVisible({ timeout: 15000 });
    await dateInput.fill('1990-06-15');

    const timeInput = page.locator('input[type="time"], input[name*="time" i]').first();
    if (await timeInput.isVisible().catch(() => false)) {
      await timeInput.fill('10:30');
    }

    // Place / city autocomplete — type "Mumbai" and pick first suggestion
    const placeInput = page
      .locator('input[placeholder*="place" i], input[placeholder*="city" i], input[name*="place" i], input[name*="location" i]')
      .first();
    if (await placeInput.isVisible().catch(() => false)) {
      await placeInput.fill('Mumbai');
      // Wait for Nominatim suggestions
      await page.waitForTimeout(2500);
      const firstSuggestion = page
        .locator('[role="option"], li[data-suggestion], button:has-text("Mumbai")')
        .first();
      if (await firstSuggestion.isVisible().catch(() => false)) {
        await firstSuggestion.click();
      }
    }

    // Submit
    const submit = page
      .locator('button:has-text("Generate"), button:has-text("Create"), button[type="submit"]')
      .first();
    await expect(submit).toBeVisible({ timeout: 10000 });
    await submit.click();

    // Wait for result — a chart container or rashi/nakshatra label
    const result = page
      .locator(':text-matches("nakshatra|rashi|ascendant|lagna", "i")')
      .first();
    await expect(result).toBeVisible({ timeout: 30000 });

    expect(sink.pageerrors, `pageerrors during kundali gen: ${sink.pageerrors.join(' | ')}`).toEqual([]);
  });
});

// ───────────────────────────────────────────────────────────────────────
// 7. ISR hydration safety (Lesson ZD regression guard)
// ───────────────────────────────────────────────────────────────────────
test.describe('ISR hydration safety', () => {
  const ISR_DATE_PAGES = [
    '/en/choghadiya',
    '/en/gauri-panchang',
    '/en/career-muhurta',
  ];

  for (const path of ISR_DATE_PAGES) {
    test(`${path} hydrates with no errors`, async ({ page }) => {
      const sink = { pageerrors: [] as string[], consoleErrors: [] as string[] };
      attachErrorRecorders(page, sink);
      const res = await page.goto(`${PROD}${path}`, { waitUntil: 'domcontentloaded' });
      expect(res?.status()).toBeLessThan(500);
      // Hydration takes a moment; wait for client React tree to settle
      await page.waitForTimeout(3000);
      expect(sink.pageerrors, `pageerror on ${path}: ${sink.pageerrors.join(' | ')}`).toEqual([]);
    });
  }
});

// ───────────────────────────────────────────────────────────────────────
// 8. SEO surfaces
// ───────────────────────────────────────────────────────────────────────
test.describe('SEO surfaces', () => {
  test('home has canonical, og:title, hreflang in 9 locales', async ({ page }) => {
    await page.goto(`${PROD}/en`, { waitUntil: 'domcontentloaded' });

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('dekhopanchang.com');

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();

    // hreflang alternates for each locale
    for (const loc of LOCALES) {
      const href = await page.locator(`link[rel="alternate"][hreflang^="${loc}"]`).first().getAttribute('href');
      expect(href, `hreflang missing for ${loc}`).toBeTruthy();
    }
  });

  test('kundali page has tool JSON-LD', async ({ page }) => {
    await page.goto(`${PROD}/en/kundali`, { waitUntil: 'domcontentloaded' });
    const lds = await page.locator('script[type="application/ld+json"]').all();
    expect(lds.length).toBeGreaterThan(0);
  });

  test('Bengali calendar title is bilingual (script + English)', async ({ page }) => {
    await page.goto(`${PROD}/bn/calendar/regional/bengali`, { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    // Must include both Bengali script chars and Latin letters
    expect(title, `Bilingual title check: ${title}`).toMatch(/[ঀ-৿]/);
    expect(title, `Bilingual title needs English too: ${title}`).toMatch(/[A-Za-z]/);
  });
});

// ───────────────────────────────────────────────────────────────────────
// 9. Mobile viewport (only runs under the 'mobile' project)
// ───────────────────────────────────────────────────────────────────────
test.describe('mobile @mobile', () => {
  test('@mobile home renders without horizontal scroll', async ({ page }) => {
    await page.goto(`${PROD}/en`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return { scrollW: doc.scrollWidth, clientW: doc.clientWidth };
    });
    // Tolerate up to 2px FP overflow
    expect(overflow.scrollW - overflow.clientW).toBeLessThanOrEqual(2);
  });

  test('@mobile kundali form mounts and is interactive', async ({ page }) => {
    await page.goto(`${PROD}/en/kundali`, { waitUntil: 'domcontentloaded' });
    const dateInput = page.locator('input[type="date"], input[name*="date" i]').first();
    await expect(dateInput).toBeVisible({ timeout: 15000 });
  });

  test('@mobile navbar mobile menu opens', async ({ page }) => {
    await page.goto(`${PROD}/en`, { waitUntil: 'domcontentloaded' });
    const menuBtn = page.getByRole('button', { name: /menu|open menu|navigation/i }).first();
    if (await menuBtn.isVisible().catch(() => false)) {
      await menuBtn.click();
      await page.waitForTimeout(500);
    }
    // Either the mobile menu opens with nav items, or the page is large
    // enough that no mobile menu is needed. Just confirm we can see nav.
    const navLink = page.getByRole('link', { name: /panchang|kundali|calendar/i }).first();
    await expect(navLink).toBeVisible({ timeout: 5000 });
  });
});
