#!/usr/bin/env npx tsx
/**
 * Daily Bing Webmaster URL submission — runs on the operator's local
 * Mac via launchd, not on Vercel.
 *
 * Why local: Vercel cron invocations cost compute quota for an
 * operation that's a single HTTPS POST. Bing's daily quota is 100
 * URLs and the work takes <2s; running it on the Mac is free and
 * the latency from a US/CA home connection is fine.
 *
 * Companion launchd template at `scripts/bing-submit-urls.plist.template`.
 * See `docs/runbooks/bing-webmaster-setup.md` for the install flow.
 *
 * Usage:
 *   BING_WEBMASTER_API_KEY=<key> npx tsx scripts/bing-submit-urls.ts
 *
 * Reads the same EN+HI primary rotation as the IndexNow cron uses,
 * caps at 100 URLs (Bing's actual daily quota), POSTs to Bing's
 * Webmaster API. Logs go to stdout/stderr; launchd captures both
 * to ~/Library/Logs/dekhopanchang-bing/.
 *
 * Exit codes:
 *   0  — submission succeeded (or BING_WEBMASTER_API_KEY not set, which
 *        is the "operator hasn't configured yet" no-op path)
 *   1  — Bing returned a non-2xx; investigate via the printed error
 *   2  — Network or runtime error reaching Bing
 */

import {
  getBingApiKey,
  submitUrlsToBing,
  BING_SITE_URL,
} from '../src/lib/seo/bing-webmaster';
import {
  buildIndexNowPaths,
  INDEXNOW_GROUP_PRIMARY,
} from '../src/lib/seo/indexnow-urls';

const BING_DAILY_QUOTA = 100;

async function main(): Promise<void> {
  const apiKey = getBingApiKey();
  if (!apiKey) {
    // Soft exit — operator may not have set the key yet. Same
    // behaviour as the GSC daily-cron when GSC env vars are missing.
    console.warn(
      '[bing-submit-urls] BING_WEBMASTER_API_KEY not set — skipping. ' +
        'See docs/runbooks/bing-webmaster-setup.md.',
    );
    process.exit(0);
  }

  const today = new Date().toISOString().slice(0, 10);
  const paths = buildIndexNowPaths(INDEXNOW_GROUP_PRIMARY, today);
  const urls = paths
    .slice(0, BING_DAILY_QUOTA)
    .map((p) => `${BING_SITE_URL}${p}`);

  console.log(`[bing-submit-urls] submitting ${urls.length} URLs for ${today}`);

  try {
    const result = await submitUrlsToBing(urls, apiKey);
    if (result.ok) {
      console.log(
        `[bing-submit-urls] OK (status ${result.status}, ${result.submitted} URLs)`,
      );
      process.exit(0);
    }
    console.error(
      `[bing-submit-urls] FAILED (status ${result.status}): ${result.error ?? '(no error body)'}`,
    );
    process.exit(1);
  } catch (err) {
    console.error('[bing-submit-urls] uncaught:', err);
    process.exit(2);
  }
}

main();
