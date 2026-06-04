#!/usr/bin/env -S npx tsx
/* eslint-disable no-console */
/**
 * One-shot GSC reindex submission for the 8 pages fixed in today's
 * recovery PRs (#409, #410, #411). Drives the GSC URL Inspection
 * "Request indexing" button via Playwright — see
 * reference_gsc_request_indexing_playwright in memory for details on
 * the UI selectors and quota constraints.
 *
 * The 8 URLs exactly fill the daily quota (~8 successful requests per
 * property per 24h). Run AFTER Vercel finishes deploying — the GSC
 * crawl needs to see the fixes live.
 *
 * Uses the same persistent Playwright profile as gsc-daily-cron.ts.
 * If you've never authenticated before, the first run will pop a
 * Chromium window — log into Google in that window and the cookies
 * persist for subsequent runs.
 *
 * Run:
 *   npx tsx scripts/gsc-reindex-recovery-batch.ts
 *   npx tsx scripts/gsc-reindex-recovery-batch.ts --dry-run   # plan only
 */

import { chromium, type Page } from 'playwright';

const PROFILE_DIR = '/tmp/playwright-gsc-profile';
const PROPERTY = 'sc-domain%3Adekhopanchang.com';
const POLITE_DELAY_MS = 3000;

// The 8 URLs that need urgent recrawl after today's PRs landed:
//   - 6 from PR #409 (calendar regional dup-FAQ fix)
//   - 2 from PR #410 (career-muhurta dup-FAQ fix)
// Bengali first since it's the GSC canary (146 clicks/day → 0 collapse).
const URLS = [
  'https://dekhopanchang.com/en/calendar/regional/bengali',
  'https://dekhopanchang.com/en/career-muhurta/business-launch',
  'https://dekhopanchang.com/en/calendar/regional/gujarati',
  'https://dekhopanchang.com/en/calendar/regional/mithila',
  'https://dekhopanchang.com/en/calendar/regional/telugu',
  'https://dekhopanchang.com/en/calendar/regional/tamil',
  'https://dekhopanchang.com/en/calendar/regional/odia',
  'https://dekhopanchang.com/en/career-muhurta/job-interview',
];

type SubmitOutcome = 'requested' | 'quota' | 'no-button' | 'no-confirmation' | 'error';

async function submit(page: Page, url: string): Promise<SubmitOutcome> {
  const input = page.locator('input[aria-label="Inspect any URL in dekhopanchang.com"]');
  await input.fill(url);
  await input.press('Enter');

  // Poll for the "Request indexing" affordance — non-indexed URLs run a
  // live test server-side that can take 60-180s before the button shows.
  const result: SubmitOutcome = await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    type AnyEl = HTMLElement;

    const findRequestBtn = (): AnyEl | undefined =>
      Array.from(document.querySelectorAll('button, [role="button"]')).find(
        (b) => (b as AnyEl).offsetParent !== null && /^Request indexing/i.test((b.textContent || '').trim()),
      ) as AnyEl | undefined;

    let btn: AnyEl | undefined;
    for (let i = 0; i < 180; i++) {
      btn = findRequestBtn();
      if (btn) break;
      await sleep(1000);
    }
    if (!btn) return 'no-button' as SubmitOutcome;
    btn.click();

    // After click, wait for the "Indexing requested" dialog OR a quota /
    // error dialog. Indexed URLs confirm fast; non-indexed run a live
    // fetch (up to 2 min).
    for (let i = 0; i < 120; i++) {
      const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
      for (const d of dialogs) {
        const txt = (d.textContent || '').trim();
        if (!(d as AnyEl).offsetParent) continue;
        if (d.getAttribute('aria-label') === 'Indexing requested' || /Indexing requested/i.test(txt)) {
          return 'requested' as SubmitOutcome;
        }
        if (/Quota exceeded|exceeded your daily quota/i.test(txt)) {
          return 'quota' as SubmitOutcome;
        }
      }
      await sleep(1000);
    }
    return 'no-confirmation' as SubmitOutcome;
  });

  // Dismiss whatever dialog is open before submitting the next URL.
  try {
    await page.evaluate(() => {
      const dismiss = Array.from(document.querySelectorAll('button, [role="button"]')).find(
        (b) => (b as HTMLElement).offsetParent !== null && /^(Dismiss|Got it|Close|OK)$/i.test((b.textContent || '').trim()),
      ) as HTMLElement | undefined;
      dismiss?.click();
    });
  } catch {
    // Best-effort — the next inspection will overwrite the panel anyway.
  }

  return result;
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');

  console.log(`\n[gsc-reindex] ${URLS.length} URLs queued:`);
  for (const u of URLS) console.log(`  - ${u}`);

  if (dryRun) {
    console.log('\n[gsc-reindex] --dry-run set, exiting without browser launch');
    return;
  }

  console.log(`\n[gsc-reindex] Launching Chromium with profile ${PROFILE_DIR}...`);
  const ctx = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    viewport: { width: 1400, height: 900 },
  });

  // Polyfill `__name` in the browser context. tsx transpiles every
  // closure passed to page.evaluate() with esbuild keepNames=true, which
  // inlines `__name(fn, "n")` around function decls. The helper itself
  // lives at the top of the module, but Playwright serialises only the
  // closure body — so the page sees `__name(...)` with nothing to call
  // → ReferenceError on every evaluate. Same fix as PR #396 applied to
  // gsc-daily-cron.ts. Passed as a string so tsx can't re-transform it.
  await ctx.addInitScript('window.__name = (fn) => fn;');

  const page = ctx.pages()[0] ?? (await ctx.newPage());

  try {
    const inspectUrl = `https://search.google.com/search-console/inspect?resource_id=${PROPERTY}`;
    await page.goto(inspectUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });

    // If we land on a login page, bail with a clear message — the user
    // needs to authenticate manually in the Chromium window. Subsequent
    // runs will reuse the cookies.
    const onLogin = await page.evaluate(() => /accounts\.google\.com|signin/i.test(location.href));
    if (onLogin) {
      console.error('\n[gsc-reindex] Not authenticated. Log in to Google in the Chromium window,');
      console.error('             then re-run this script. Press Ctrl+C to exit.');
      // Stay open so the user can log in for next time.
      await new Promise((r) => setTimeout(r, 600_000));
      return;
    }

    // Confirm the inspection input is reachable.
    await page.waitForSelector('input[aria-label="Inspect any URL in dekhopanchang.com"]', {
      timeout: 30_000,
    });

    const outcomes: Array<{ url: string; outcome: SubmitOutcome }> = [];

    for (let i = 0; i < URLS.length; i++) {
      const url = URLS[i];
      console.log(`\n[gsc-reindex] (${i + 1}/${URLS.length}) submitting ${url}`);
      try {
        const outcome = await submit(page, url);
        console.log(`[gsc-reindex]   → ${outcome}`);
        outcomes.push({ url, outcome });
        if (outcome === 'quota') {
          console.log('[gsc-reindex] Hit daily quota — stopping.');
          break;
        }
      } catch (err) {
        console.error(`[gsc-reindex]   → error:`, err);
        outcomes.push({ url, outcome: 'error' });
      }

      if (i < URLS.length - 1) {
        await new Promise((r) => setTimeout(r, POLITE_DELAY_MS));
      }
    }

    console.log('\n[gsc-reindex] ─── Summary ───');
    const counts = outcomes.reduce<Record<string, number>>((acc, o) => {
      acc[o.outcome] = (acc[o.outcome] ?? 0) + 1;
      return acc;
    }, {});
    for (const [outcome, n] of Object.entries(counts)) {
      console.log(`  ${outcome}: ${n}`);
    }
    for (const o of outcomes) {
      console.log(`  [${o.outcome}] ${o.url}`);
    }
  } finally {
    await ctx.close();
  }
}

main().catch((err) => {
  console.error('[gsc-reindex] FAILED:', err);
  process.exit(1);
});
