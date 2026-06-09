#!/usr/bin/env -S npx tsx
/* eslint-disable no-console */
/**
 * GSC reindex submission for the highest-leverage URLs touched by
 * today's late-session work (PRs #618-#632). Drives the GSC URL
 * Inspection "Request indexing" button via Playwright — see
 * reference_gsc_request_indexing_playwright in memory.
 *
 * Priority mix:
 *   1-3 — 3 NEW chalisa slugs (PR #630): krishna, vishnu, surya.
 *         Each was previously a 404 and is now a real ~600+ word page.
 *         Highest-impact submissions because they're net-new SEO surfaces.
 *   4-5 — EXPANDED devotional content (PRs #628, #629): one mantra
 *         and one aarti, representing the 45-item rescue. Re-crawl
 *         tells Google to re-evaluate ~3x-richer meaning/significance.
 *   6   — EXPANDED yoga page (PRs #618 + #621): gajakesari. Re-crawl
 *         picks up the 4 new sections (realWorldManifestation,
 *         strengthFactors, activationTiming, practicalGuidance) +
 *         the 8-locale fan-out.
 *   7   — EXPANDED baby-names page (PR #619): ashwini. Re-crawl
 *         picks up the 6 new sections (deityLegend, symbolMeaning,
 *         personalityTraits, nameThemes, namingTradition, famousBearers).
 *   8   — MODULE_SSR fix (PR #627): module 29-2. Re-crawl picks up the
 *         all-pages-in-DOM change for the 117 module corpus — though
 *         we only submit ONE module URL here, the SSR fix applies to
 *         all of them, so any subsequent organic crawls benefit.
 *
 * The 8 URLs exactly fill the daily quota (~8 successful requests per
 * property per 24h per memory:reference_gsc_request_indexing_playwright).
 */

import { chromium, type Page } from 'playwright';

const PROFILE_DIR = '/tmp/playwright-gsc-profile';
const PROPERTY = 'sc-domain%3Adekhopanchang.com';
const POLITE_DELAY_MS = 3000;

const URLS = [
  // NEW slugs (PR #630)
  'https://dekhopanchang.com/en/devotional/chalisa/krishna-chalisa',
  'https://dekhopanchang.com/en/devotional/chalisa/vishnu-chalisa',
  'https://dekhopanchang.com/en/devotional/chalisa/surya-chalisa',
  // EXPANDED meaning + significance (PR #628 + #629)
  'https://dekhopanchang.com/en/devotional/mantra/surya-beej-mantra',
  'https://dekhopanchang.com/en/devotional/aarti/karva-chauth-aarti',
  // EXPANDED structured sections (PRs #618, #619, #621)
  'https://dekhopanchang.com/en/learn/yoga/gajakesari',
  'https://dekhopanchang.com/en/baby-names/ashwini',
  // SSR-all-pages module fix (PR #627)
  'https://dekhopanchang.com/en/learn/modules/29-2',
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
