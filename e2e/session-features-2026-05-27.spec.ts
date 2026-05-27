/**
 * End-to-end coverage for the six PRs landed on 2026-05-27:
 *   #224 Calendar collapsible intro
 *   #230 Gauri Panchang (Gowri Nalla Neram)
 *   #233 Career Muhurta design spec (docs only — no test)
 *   #235 Career Muhurta Phase 1 + 2 (widget, hub, 8 landings, learn page)
 *   #236 Career Muhurta locale name fix (Tamil H1, contract-signing alignment)
 *
 * Each describe block targets one feature. Tests prefer text content
 * over CSS selectors so a future visual redesign doesn't silently break
 * coverage. The TodayCareerCard test pauses for the panchang client to
 * hydrate because the widget renders post-mount inside PanchangClient.
 */
import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────
// #224 — Calendar collapsible intro + "Upcoming Major Festivals" moved
// to the bottom of the page
// ─────────────────────────────────────────────────────────────────
test.describe('Calendar collapsible intro (#224)', () => {
  test('intro <details> renders default-closed and toggles open', async ({ page }) => {
    await page.goto('/en/calendar');

    const details = page.locator('details.group').first();
    await expect(details).toBeVisible();
    // `open` is a boolean attribute — single-arg toHaveAttribute checks
    // presence regardless of value (browsers may render it as `open`,
    // `open=""`, or `open="open"`).
    await expect(details).not.toHaveAttribute('open');

    await details.locator('summary').click();
    await expect(details).toHaveAttribute('open');
  });

  test('"Upcoming Major Festivals" sits below the interactive calendar', async ({ page }) => {
    await page.goto('/en/calendar');

    const upcomingHeading = page.getByRole('heading', { name: /Upcoming Major Festivals/i }).first();
    await expect(upcomingHeading).toBeVisible();
    const viewToggle = page.getByRole('button', { name: /Western Months/i }).first();
    await expect(viewToggle).toBeVisible();

    // PR #224 moved the festivals table from inside the intro <article>
    // (above CalendarClient) to a section AFTER it. Assert real DOM
    // ordering with compareDocumentPosition — layout-coordinate
    // comparisons are flaky if the page rerenders during the check.
    const togglesAboveHeading = await page.evaluate(() => {
      const toggle = Array.from(document.querySelectorAll('button')).find(
        (el) => /Western Months/i.test(el.textContent || ''),
      );
      const heading = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).find(
        (el) => /Upcoming Major Festivals/i.test(el.textContent || ''),
      );
      if (!toggle || !heading) return false;
      // DOCUMENT_POSITION_FOLLOWING = 4 — true when `heading` comes
      // after `toggle` in document order.
      return Boolean(toggle.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(togglesAboveHeading).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────
// #230 — Gauri Panchang
// ─────────────────────────────────────────────────────────────────
test.describe('Gauri Panchang (#230)', () => {
  test('/en/gauri-panchang H1 + all 8 period names render', async ({ page }) => {
    await page.goto('/en/gauri-panchang');

    await expect(page.getByRole('heading', { name: /Gauri Panchang Today/, level: 1 })).toBeVisible();

    // Each of the 8 Gauri period names should appear at least once in
    // the body (in the day/night tables). Order-independent assertion.
    const body = page.locator('body');
    for (const name of ['Amritha', 'Siddha', 'Marana', 'Rogam', 'Laabha', 'Dhanam', 'Sugam', 'Sokam']) {
      await expect(body).toContainText(name);
    }
  });

  test('/ta/gauri-panchang renders Tamil H1', async ({ page }) => {
    await page.goto('/ta/gauri-panchang');
    await expect(page.locator('h1').first()).toContainText('கௌரி பஞ்சாங்கம்');
  });

  test('dated page renders without a "Today" badge for a non-today date', async ({ page }) => {
    // Pick a date 30 days out — guaranteed not to be "today" in any TZ.
    const future = new Date();
    future.setDate(future.getDate() + 30);
    const dateStr = future.toISOString().slice(0, 10);
    await page.goto(`/en/gauri-panchang/${dateStr}`);

    await expect(page.locator('h1').first()).toContainText('Gauri Panchang');

    // The TodayBadge is a small green pill — must NOT render here.
    // not.toBeVisible auto-retries until the element is gone (or
    // confirmed never rendered); toHaveCount(0) doesn't retry.
    await expect(page.getByText(/📅 Today$/)).not.toBeVisible();
  });

  test('Choghadiya page still works (no regression from shared TodayBadge)', async ({ page }) => {
    await page.goto('/en/choghadiya');
    await expect(page.getByRole('heading', { name: /Choghadiya Today/, level: 1 })).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────
// #235 — Career Muhurta hub + 8 activity landing pages
// ─────────────────────────────────────────────────────────────────
test.describe('Career Muhurta hub + landings (#235)', () => {
  test('/en/career-muhurta hub links to all 8 activities', async ({ page }) => {
    await page.goto('/en/career-muhurta');

    const slugs = [
      'job-interview', 'job-application', 'salary-negotiation', 'contract-signing',
      'first-day-at-job', 'resignation', 'business-launch', 'asking-promotion',
    ];
    for (const slug of slugs) {
      await expect(page.locator(`a[href="/en/career-muhurta/${slug}"]`).first()).toBeVisible();
    }
  });

  test('job-interview landing has all required sections + Brihaspati CTA', async ({ page }) => {
    await page.goto('/en/career-muhurta/job-interview');

    await expect(page.getByRole('heading', { name: 'Job Interview', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Classical Rationale/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /How This Differs/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /What to Avoid/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Frequently Asked Questions/ })).toBeVisible();

    // Brihaspati CTA: scoped to the dedicated career-page CTA section
    // (the global BrihaspatiBanner also exposes an "Ask Brihaspati"
    // button — getByRole alone would match both and fail strict mode).
    const careerCta = page.getByRole('region', { name: /Get a personalised reading/i });
    await expect(careerCta.getByRole('button', { name: 'Ask Brihaspati' })).toBeVisible();

    // Sibling links — at least the 3 declared siblings should be linked.
    await expect(page.locator('a[href="/en/career-muhurta/salary-negotiation"]').first()).toBeVisible();
  });

  test('resignation landing preserves the inversion — Bharani called out positively', async ({ page }) => {
    await page.goto('/en/career-muhurta/resignation');
    await expect(page.getByRole('heading', { name: 'Resignation', level: 1 })).toBeVisible();

    // Resignation's classical rationale explicitly names Bharani as
    // ending-friendly. This is the invariant that distinguishes it from
    // every other career muhurta.
    await expect(page.locator('body')).toContainText(/Bharani/);
    await expect(page.locator('body')).toContainText(/ending/i);
  });

  test('FAQ items toggle open on click', async ({ page }) => {
    await page.goto('/en/career-muhurta/job-interview');

    const firstFaq = page.locator('details').filter({ hasText: /best for a job interview/i }).first();
    await expect(firstFaq).toBeVisible();
    await expect(firstFaq).not.toHaveAttribute('open');
    await firstFaq.locator('summary').click();
    await expect(firstFaq).toHaveAttribute('open');
  });
});

// ─────────────────────────────────────────────────────────────────
// #236 — locale name fix
// ─────────────────────────────────────────────────────────────────
test.describe('Career Muhurta locale names (#236)', () => {
  test('/ta H1 lands in Tamil (not English fallback)', async ({ page }) => {
    await page.goto('/ta/career-muhurta/job-interview');
    await expect(page.locator('h1').first()).toContainText('வேலை நேர்காணல்');
  });

  test('/ta resignation H1 is Tamil', async ({ page }) => {
    await page.goto('/ta/career-muhurta/resignation');
    await expect(page.locator('h1').first()).toContainText('ராஜினாமா');
  });

  test('contract-signing H1 matches the selector label exactly', async ({ page }) => {
    await page.goto('/en/career-muhurta/contract-signing');
    // Should be "Contract / Offer Signing" (the full form), aligned with
    // the activity selector in Muhurta AI. Gemini PR #236 review caught
    // the drift between "Contract Signing" (landing) and "Contract /
    // Offer Signing" (selector). This invariant pins the alignment.
    await expect(page.getByRole('heading', { name: 'Contract / Offer Signing', level: 1 })).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────
// TodayCareerCard widget on /panchang — client-side after hydration
// ─────────────────────────────────────────────────────────────────
test.describe('TodayCareerCard widget on /panchang (#235)', () => {
  // PanchangClient gates its main content on location.ianaTimezone
  // (PanchangClient.tsx:451). The location store reads from localStorage
  // under STORAGE_KEY='panchang_location' on store construction — when
  // a value is present, `confirmed` initialises true and the panchang
  // computation runs immediately.
  //
  // Seeding localStorage via addInitScript runs BEFORE any page script
  // (including before the store's `create()` call), so the store starts
  // with a populated location instead of needing /api/geo round-tripping.
  // Mumbai picked because of its clean canonical timezone (Asia/Kolkata,
  // no DST).
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem(
        'panchang_location',
        JSON.stringify({
          lat: 19.076,
          lng: 72.8777,
          name: 'Mumbai, India',
          timezone: 'Asia/Kolkata',
          source: 'manual',
        }),
      );
    });
  });

  test('widget appears with heading + see-all link', async ({ page }) => {
    await page.goto('/en/panchang');

    // PanchangClient renders the widget post-hydration. Wait for the
    // distinctive heading text — auto-retrying until the card mounts.
    const heading = page.getByRole('heading', { name: /Today for Your Career/i });
    await expect(heading).toBeVisible({ timeout: 30_000 });

    // "See all career muhurtas →" link should sit inside the card and
    // navigate to the hub when clicked.
    const seeAll = page.getByRole('link', { name: /See all career muhurtas/i });
    await expect(seeAll).toBeVisible();
    await seeAll.click();
    await expect(page).toHaveURL(/\/en\/career-muhurta\/?$/);
  });
});

// ─────────────────────────────────────────────────────────────────
// Muhurta AI Career facet (#235)
// ─────────────────────────────────────────────────────────────────
test.describe('Muhurta AI Career facet (#235)', () => {
  // Scoped selector — only the activity dropdown has <optgroup>s.
  // `select.first()` would otherwise pick the city / locale / etc.
  const ACTIVITY_SELECT = 'select:has(optgroup)';

  // The scanner needs a location to run /api/muhurta-scan — without
  // it the initial scan early-returns and the controls never settle.
  // Seed Mumbai for both tests in this block.
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem(
        'panchang_location',
        JSON.stringify({
          lat: 19.076,
          lng: 72.8777,
          name: 'Mumbai, India',
          timezone: 'Asia/Kolkata',
          source: 'manual',
        }),
      );
    });
  });

  test('Career optgroup appears first in the activity selector', async ({ page }) => {
    await page.goto('/en/muhurta-ai');

    // toHaveAttribute auto-retries — getAttribute reads synchronously
    // and races React hydration.
    await expect(page.locator(`${ACTIVITY_SELECT} optgroup`).first()).toHaveAttribute('label', 'Career');

    const jobInterviewOption = page.locator(`${ACTIVITY_SELECT} option[value="job_interview"]`);
    await expect(jobInterviewOption).toHaveCount(1);
  });

  test('Selecting Job Interview updates the scan', async ({ page }) => {
    // Wait for the initial overview scan to actually return — that's
    // the moment overviewLoading flips back to false and the select is
    // reliably enabled. Without this gate, selectOption races the first
    // scan's loading=true state and silently no-ops on the briefly-
    // disabled select.
    const initialScan = page.waitForResponse(
      (r) => r.url().includes('/api/muhurta-scan') && r.status() === 200,
      { timeout: 60_000 },
    );
    await page.goto('/en/muhurta-ai');
    await initialScan;

    const select = page.locator(ACTIVITY_SELECT);
    await expect(select).not.toBeDisabled();
    await select.selectOption('job_interview');
    await expect(select).toHaveValue('job_interview');
  });
});

// ─────────────────────────────────────────────────────────────────
// Learn page locale coverage (#235 + #236 Gemini fix)
// ─────────────────────────────────────────────────────────────────
test.describe('Learn page translations (#235)', () => {
  test('/hi/learn/career-muhurta body content renders in Hindi', async ({ page }) => {
    await page.goto('/hi/learn/career-muhurta');

    // H1 in Hindi
    await expect(page.locator('h1').first()).toContainText('करियर मुहूर्त');

    // Nakshatra-class labels must be in Hindi (previously hardcoded
    // English — Gemini #5 on PR #235). Check three of the six.
    const body = page.locator('body');
    await expect(body).toContainText('स्थिर'); // Sthira (fixed) in Hindi
    await expect(body).toContainText('मृदु');   // Mrdu (soft)
    await expect(body).toContainText('तीक्ष्ण'); // Tikshna (sharp)

    // Weekday list in Hindi
    await expect(body).toContainText('बुधवार');
    await expect(body).toContainText('गुरुवार');

    // Hora cards in Hindi
    await expect(body).toContainText('बृहस्पति होरा');
  });

  test('/ta/learn/career-muhurta body content renders in Tamil', async ({ page }) => {
    await page.goto('/ta/learn/career-muhurta');

    await expect(page.locator('h1').first()).toContainText('தொழில் முகூர்த்தம்');

    const body = page.locator('body');
    // Tamil weekday labels
    await expect(body).toContainText('ஞாயிறு');
    await expect(body).toContainText('புதன்');

    // Tamil hora cards
    await expect(body).toContainText('குரு ஹோரை');
    await expect(body).toContainText('புதன் ஹோரை');
  });
});
