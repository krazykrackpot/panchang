#!/usr/bin/env npx tsx
/**
 * Submit the sitemap to Bing Webmaster Tools.
 *
 * Mirror of `scripts/gsc-submit-sitemap.ts` for Bing's webmaster API.
 *
 * Usage:
 *   BING_WEBMASTER_API_KEY=<key> npx tsx scripts/bing-submit-sitemap.ts
 *
 * Get the API key from https://www.bing.com/webmasters/apikey (Bing
 * Webmaster Tools → Settings → API access). The key inherits the
 * verified-site permissions of the account it was created under, so
 * the site (`dekhopanchang.com`) must already be verified in Bing
 * Webmaster Tools before the API call will succeed.
 *
 * Run this once when:
 *   - First setting up Bing Webmaster Tools
 *   - After a sitemap URL changes (we currently only have one)
 *   - When you want to nudge Bing to re-fetch the sitemap
 *
 * Bing's webmaster index polls submitted sitemaps automatically (~24h
 * cadence), so a one-shot is enough. The daily-IndexNow cron handles
 * incremental URL updates.
 */

import { getBingApiKey, submitSitemapToBing, BING_SITE_URL } from '../src/lib/seo/bing-webmaster';

const SITEMAP_URL = `${BING_SITE_URL}/sitemap.xml`;

async function main(): Promise<void> {
  const apiKey = getBingApiKey();
  if (!apiKey) {
    console.error('[bing-submit-sitemap] BING_WEBMASTER_API_KEY not set.');
    console.error('  Get one: https://www.bing.com/webmasters/apikey');
    console.error('  Then:    export BING_WEBMASTER_API_KEY=<key>');
    process.exit(1);
  }

  console.log(`[bing-submit-sitemap] submitting ${SITEMAP_URL} ...`);
  const result = await submitSitemapToBing(SITEMAP_URL, apiKey);

  if (result.ok) {
    console.log(`[bing-submit-sitemap] OK (status ${result.status})`);
    process.exit(0);
  }

  console.error(`[bing-submit-sitemap] FAILED (status ${result.status})`);
  if (result.error) console.error(`  ${result.error}`);
  process.exit(1);
}

main().catch((err) => {
  console.error('[bing-submit-sitemap] uncaught:', err);
  process.exit(1);
});
