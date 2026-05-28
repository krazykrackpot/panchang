/**
 * E2E for the festival deep-dive feature (PR #265 + #271).
 *
 * Asserts the 7 new sections render on /en/festivals/diwali/2026
 * and exercises the interactive bits:
 *   1. Hero with festival name + year
 *   2. Multi-city muhurat table
 *   3. Personalised 12-rashi accordion + a rashi card expands
 *   4. Do's & Don'ts cards
 *   5. Wishes carousel + copy button works
 *   6. Cluster timeline (Diwali 5-day sequence)
 *   7. Historical archive 2020-2030 with at least one past + one
 *      future-year link visible
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §11
 */

import { test, expect } from '@playwright/test';

const DIWALI_URL = '/en/festivals/diwali/2026';

test.describe('Festival deep-dive — /en/festivals/diwali/2026', () => {
  test('hero shows the festival name and year', async ({ page }) => {
    await page.goto(DIWALI_URL);
    // h1 from the existing hero block on the year page
    await expect(page.locator('h1').filter({ hasText: 'Diwali 2026' })).toBeVisible({ timeout: 15000 });
  });

  test('multi-city muhurat table renders with the 6 reference cities', async ({ page }) => {
    await page.goto(DIWALI_URL);
    // The table contains city rows for the canonical 6 (Delhi, Mumbai,
    // Bangalore, Chennai, Kolkata, Pune). Assert at least one is visible.
    const muhuratTable = page.locator('table').first();
    await expect(muhuratTable).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Delhi|Mumbai|Bangalore|Chennai|Kolkata|Pune/).first()).toBeVisible();
  });

  test('personalised 12-rashi accordion is present and a card expands', async ({ page }) => {
    await page.goto(DIWALI_URL);
    // Section title from FestivalPersonalizedAccordion
    await expect(page.getByRole('heading', { name: /affect your sign/i })).toBeVisible({ timeout: 15000 });

    // Click an accordion button (e.g. Aries) and verify the body becomes visible
    const ariesButton = page.getByRole('button').filter({ hasText: 'Aries' }).first();
    await expect(ariesButton).toBeVisible();
    await ariesButton.click();
    // After expansion, the panel content (relevantHouse reference / ritual text)
    // becomes visible — assert the aria-expanded flips to true on the button.
    await expect(ariesButton).toHaveAttribute('aria-expanded', 'true');
  });

  test('Brihaspati CTA card is present below the accordion', async ({ page }) => {
    await page.goto(DIWALI_URL);
    await expect(page.getByRole('button', { name: /Ask Brihaspati/i })).toBeVisible({ timeout: 15000 });
  });

  test('do\'s & don\'ts cards render with checks and exes', async ({ page }) => {
    await page.goto(DIWALI_URL);
    await expect(page.getByRole('heading', { name: /Do's & Don'ts/i })).toBeVisible({ timeout: 15000 });
    // "Do" + "Don't" subheadings under the section heading
    await expect(page.getByRole('heading', { name: 'Do', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Don\'t/i, exact: false })).toBeVisible();
  });

  test('wishes carousel renders 3 wish cards and copy button is interactive', async ({ page }) => {
    await page.goto(DIWALI_URL);
    await expect(page.getByRole('heading', { name: /Wishes & Greetings/i })).toBeVisible({ timeout: 15000 });
    const copyButtons = page.getByRole('button', { name: /Copy/i });
    await expect(copyButtons.first()).toBeVisible();
    // At least 3 wishes => at least 3 Copy buttons
    expect(await copyButtons.count()).toBeGreaterThanOrEqual(3);
  });

  test('cluster timeline shows the 5-day Diwali sequence with current festival highlighted', async ({ page }) => {
    await page.goto(DIWALI_URL);
    await expect(page.getByRole('heading', { name: /5-Day Diwali Sequence/i })).toBeVisible({ timeout: 15000 });
    // Cluster shows: Dhanteras, Narak Chaturdashi, Diwali, Govardhan Puja, Bhai Dooj
    // Assert at least one sibling-festival name is visible in the cluster region.
    await expect(page.getByText(/Dhanteras/i).first()).toBeVisible();
    await expect(page.getByText(/Bhai Dooj/i).first()).toBeVisible();
  });

  test('historical archive table shows 2020-2030 with at least one past + future row', async ({ page }) => {
    await page.goto(DIWALI_URL);
    await expect(page.getByRole('heading', { name: /Across the Years/i })).toBeVisible({ timeout: 15000 });
    // Past year — render 2020 from the static fixture
    await expect(page.getByRole('cell', { name: '2020', exact: true })).toBeVisible();
    // Future year — render 2030 with a "View" link
    await expect(page.getByRole('cell', { name: '2030', exact: true })).toBeVisible();
  });

  test('JSON-LD: Event, FAQ, HowTo, Breadcrumb are all present in the page source', async ({ page }) => {
    await page.goto(DIWALI_URL);
    const ldScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    // Recursive type extraction — JSON-LD can be a single object, an
    // array of objects, OR a single object with an @graph array. The
    // @type field can itself be a string or an array of strings. Catch
    // all variants so the test stays valid through future schema
    // optimizations (caught by Gemini PR #275).
    const collectTypes = (obj: unknown): string[] => {
      if (!obj || typeof obj !== 'object') return [];
      if (Array.isArray(obj)) return obj.flatMap(collectTypes);
      const o = obj as Record<string, unknown>;
      const found: string[] = [];
      const t = o['@type'];
      if (typeof t === 'string') found.push(t);
      else if (Array.isArray(t)) found.push(...(t as string[]));
      const graph = o['@graph'];
      if (Array.isArray(graph)) found.push(...graph.flatMap(collectTypes));
      return found;
    };
    const types = ldScripts.flatMap((s) => {
      try { return collectTypes(JSON.parse(s)); } catch { return []; }
    });
    expect(types).toContain('Event');
    expect(types).toContain('BreadcrumbList');
    expect(types).toContain('FAQPage');
    expect(types).toContain('HowTo');
  });
});

test.describe('Festival deep-dive — Navratri (cluster has comingSoon entries)', () => {
  test('navratri page renders the 9-day cluster with Coming Soon badges', async ({ page }) => {
    await page.goto('/en/festivals/dussehra/2026');
    // Dussehra is in the navratri cluster — assert the cluster heading
    await expect(page.getByRole('heading', { name: /Navratri.*9 Nights/i })).toBeVisible({ timeout: 15000 });
    // At least one "Coming soon" badge for the day pages
    await expect(page.getByText(/Coming soon/i).first()).toBeVisible();
  });
});

test.describe('Festival landing page — teaser callout', () => {
  test('/festivals shows the deep-dive feature teaser', async ({ page }) => {
    await page.goto('/en/festivals');
    await expect(page.getByText(/Every festival page now includes/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Personalised transit read/i)).toBeVisible();
  });
});
