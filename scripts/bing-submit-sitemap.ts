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

import * as fs from 'fs';
import * as path from 'path';
import { getBingApiKey, submitSitemapToBing, BING_SITE_URL } from '../src/lib/seo/bing-webmaster';

const SITEMAP_URL = `${BING_SITE_URL}/sitemap.xml`;

/**
 * Load .env.local into process.env so the script can run without an
 * explicit `BING_WEBMASTER_API_KEY=…` prefix on the laptop. Mirrors
 * the same helper in scripts/gsc-submit-sitemap.ts; both scripts ran
 * silently no-op once each when first invoked because the env was
 * only loaded by `vercel pull` (production-only) but the .env.local
 * had the key all along.
 *
 * Does not override pre-set env vars — explicit `export FOO=bar npx
 * tsx ...` still wins over the file value.
 */
function loadEnv(): void {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

async function main(): Promise<void> {
  loadEnv();
  const apiKey = getBingApiKey();
  if (!apiKey) {
    console.error('[bing-submit-sitemap] BING_WEBMASTER_API_KEY not set.');
    console.error('  Add to .env.local: BING_WEBMASTER_API_KEY=<key>');
    console.error('  Or run with:       BING_WEBMASTER_API_KEY=<key> npx tsx scripts/bing-submit-sitemap.ts');
    console.error('  Get a key at:      https://www.bing.com/webmasters/apikey');
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
