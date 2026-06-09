#!/usr/bin/env -S npx tsx
/* eslint-disable no-console */
/**
 * GSC reindex submission for the highest-leverage URLs touched by
 * today's locale-parity PR batch (#602–#616). Drives the GSC URL
 * Inspection "Request indexing" button via Playwright — see
 * reference_gsc_request_indexing_playwright in memory.
 *
 * Priority order:
 *   1-4 — Maithili surfaces (mai = #1 traffic locale per GSC).
 *   5-7 — Marathi surfaces (gained Devanagari chrome via PR #614).
 *   8   — EN yoga index (touched by #608 + #614 chrome refactor).
 *
 * The 8 URLs exactly fill the daily quota.
 */

import { chromium, type Page } from 'playwright';

const PROFILE_DIR = '/tmp/playwright-gsc-profile';
const PROPERTY = 'sc-domain%3Adekhopanchang.com';
const POLITE_DELAY_MS = 3000;

const URLS = [
  'https://dekhopanchang.com/mai/learn/yoga',
  'https://dekhopanchang.com/mai/panchang',
  'https://dekhopanchang.com/mai/learn/dashboard',
  'https://dekhopanchang.com/mai/learn/transits',
  'https://dekhopanchang.com/mr/learn/yoga',
  'https://dekhopanchang.com/mr/panchang',
  'https://dekhopanchang.com/mr/learn/transits',
  'https://dekhopanchang.com/en/learn/yoga',
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
    // best-effort
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

  await ctx.addInitScript('window.__name = (fn) => fn;');

  const page = ctx.pages()[0] ?? (await ctx.newPage());

  try {
    const inspectUrl = `https://search.google.com/search-console/inspect?resource_id=${PROPERTY}`;
    await page.goto(inspectUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });

    const onLogin = await page.evaluate(() => /accounts\.google\.com|signin/i.test(location.href));
    if (onLogin) {
      console.error('\n[gsc-reindex] Not authenticated. Log in to Google in the Chromium window,');
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
