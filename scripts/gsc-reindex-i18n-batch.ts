#!/usr/bin/env -S npx tsx
/* eslint-disable no-console */
/**
 * Request-indexing batch for the 2026-06-09 i18n parity sweep deploy.
 *
 * The recent sweep (PRs #569 / #572 / #577 / #582 / #591 / #595 / #597)
 * gave the 7 non-en/hi locales (ta/te/bn/gu/kn/mai/mr) genuinely
 * distinct content where /mai/ was previously near-Hindi-shadow on
 * chrome strings. Google needs to re-crawl the locale roots to pick
 * up the distinctness signal; from there it spiders the linked
 * translated pages.
 *
 * 8 URLs exactly fill the daily quota (~8 successful requests per
 * property per 24h). Maithili first since it's the #1 traffic locale.
 *
 *   npx tsx scripts/gsc-reindex-i18n-batch.ts
 *   npx tsx scripts/gsc-reindex-i18n-batch.ts --dry-run
 */

import { chromium, type Page } from 'playwright';

const PROFILE_DIR = '/tmp/playwright-gsc-profile';
const PROPERTY = 'sc-domain%3Adekhopanchang.com';
const POLITE_DELAY_MS = 3000;

const URLS = [
  'https://dekhopanchang.com/mai',
  'https://dekhopanchang.com/mai/choghadiya',
  'https://dekhopanchang.com/mai/panchang',
  'https://dekhopanchang.com/mr',
  'https://dekhopanchang.com/bn',
  'https://dekhopanchang.com/ta',
  'https://dekhopanchang.com/te',
  'https://dekhopanchang.com/gu',
];

type SubmitOutcome = 'requested' | 'quota' | 'no-button' | 'no-confirmation' | 'error';

async function submit(page: Page, url: string): Promise<SubmitOutcome> {
  const input = page.locator('input[aria-label="Inspect any URL in dekhopanchang.com"]');
  await input.fill(url);
  await input.press('Enter');

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

  try {
    await page.evaluate(() => {
      const dismiss = Array.from(document.querySelectorAll('button, [role="button"]')).find(
        (b) => (b as HTMLElement).offsetParent !== null && /^(Dismiss|Got it|Close|OK)$/i.test((b.textContent || '').trim()),
      ) as HTMLElement | undefined;
      dismiss?.click();
    });
  } catch {
    // Best-effort.
  }

  return result;
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');

  console.log(`\n[gsc-reindex-i18n] ${URLS.length} URLs queued:`);
  for (const u of URLS) console.log(`  - ${u}`);

  if (dryRun) {
    console.log('\n[gsc-reindex-i18n] --dry-run set, exiting without browser launch');
    return;
  }

  console.log(`\n[gsc-reindex-i18n] Launching Chromium with profile ${PROFILE_DIR}...`);
  const ctx = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    viewport: { width: 1400, height: 900 },
  });

  await ctx.addInitScript('window.__name = (fn) => fn;');

  const page = ctx.pages()[0] ?? (await ctx.newPage());

  try {
    const inspectUrl = `https://search.google.com/search-console/inspect?resource_id=${PROPERTY}`;
    await page.goto(inspectUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });

    const onLogin = await page.evaluate(() => /accounts\.google\.com|signin/i.test(location.href));
    if (onLogin) {
      console.error('\n[gsc-reindex-i18n] Not authenticated. Log in to Google in the Chromium window,');
      console.error('             then re-run this script. Press Ctrl+C to exit.');
      await new Promise((r) => setTimeout(r, 600_000));
      return;
    }

    await page.waitForSelector('input[aria-label="Inspect any URL in dekhopanchang.com"]', {
      timeout: 30_000,
    });

    const outcomes: Array<{ url: string; outcome: SubmitOutcome }> = [];

    for (let i = 0; i < URLS.length; i++) {
      const url = URLS[i];
      console.log(`\n[gsc-reindex-i18n] (${i + 1}/${URLS.length}) submitting ${url}`);
      try {
        const outcome = await submit(page, url);
        console.log(`[gsc-reindex-i18n]   → ${outcome}`);
        outcomes.push({ url, outcome });
        if (outcome === 'quota') {
          console.log('[gsc-reindex-i18n] Hit daily quota — stopping.');
          break;
        }
      } catch (err) {
        console.error(`[gsc-reindex-i18n]   → error:`, err);
        outcomes.push({ url, outcome: 'error' });
      }

      if (i < URLS.length - 1) {
        await new Promise((r) => setTimeout(r, POLITE_DELAY_MS));
      }
    }

    console.log('\n[gsc-reindex-i18n] ─── Summary ───');
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
  console.error('[gsc-reindex-i18n] FAILED:', err);
  process.exit(1);
});
