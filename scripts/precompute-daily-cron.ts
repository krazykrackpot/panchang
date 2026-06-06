/* eslint-disable no-console */
/**
 * Precompute daily cron — refreshes the choghadiya Blobs for the
 * rolling forward window and posts a path-revalidation request to
 * the Vercel /api/precompute/revalidate webhook.
 *
 * Why a local cron (in PARALLEL to .github/workflows/precompute-nightly.yml):
 *   - GH Actions is the primary runner today. It's reliable, has a
 *     visible audit trail, and doesn't depend on the laptop being on.
 *   - This local script is documented as the FALLBACK / FUTURE PRIMARY
 *     when we decide we want lower latency and faster compute.
 *     STATUS: NOT INSTALLED YET. Use `launchctl bootstrap` from the
 *     plist template to arm it. Until then, this file is dormant
 *     scaffolding — running it manually still works for one-off
 *     backfills, but no automated trigger is wired.
 *
 * What it does:
 *   1. Resolve the rolling window (default: past 0d + future 60d).
 *      `--backfill-days N` extends past coverage. `--window-days N`
 *      overrides forward coverage. Same flags as the GH Action.
 *   2. Resolve cities from src/lib/constants/cities.ts CITIES,
 *      filtered to Asia/Kolkata (42 IST cities). Drift-proof against
 *      catalog changes.
 *   3. Call precomputeChoghadiya() with --skip-if-present so re-runs
 *      are idempotent and cheap. Per-tuple try/catch in the script
 *      means a single bad tuple logs + skips, never craters the batch.
 *   4. POST to /api/precompute/revalidate with all (locale × date)
 *     paths so the page edge cache flips after the writes land.
 *
 * Required env (read from `.env.local`, `.env`, or process env):
 *   PRECOMPUTE_STORAGE                        Must be 'blob' (the only
 *                                              backend that talks to prod).
 *   BLOB_READ_WRITE_TOKEN                     From Vercel Blob → Project
 *                                              connection.
 *   PRECOMPUTE_REVALIDATE_SECRET              Shared secret matching the
 *                                              Vercel env var.
 *   PRECOMPUTE_TARGET_URL                     The base URL the webhook
 *                                              lives on (e.g.
 *                                              https://dekhopanchang.com).
 *
 * Logging:
 *   stdout         → /tmp/precompute-daily-cron.out.log via the plist
 *   stderr         → /tmp/precompute-daily-cron.err.log via the plist
 *   structured     → scripts/precompute-daily-cron.log (this script)
 *
 * Failure modes:
 *   - PRECOMPUTE_STORAGE=local on the laptop by mistake → blob writes
 *     go nowhere. Script throws if storage != 'blob' AND the
 *     PRECOMPUTE_TARGET_URL is dekhopanchang.com (refuses to silently
 *     no-op on production runs).
 *   - Revalidate webhook returns 401/500 → script logs and exits 2.
 *     Blobs are still written; next run picks up from where this one
 *     left off via skipIfPresent.
 *   - Blob token expired / invalid → first put() throws, script exits 1.
 *
 * Run manually (one-off ad-hoc):
 *   npx tsx scripts/precompute-daily-cron.ts            # default window
 *   npx tsx scripts/precompute-daily-cron.ts --backfill-days 365
 *
 * Schedule via launchd (DO NOT DO THIS YET — see status note above):
 *   1. Copy scripts/precompute-daily-cron.plist.template →
 *      ~/Library/LaunchAgents/com.dekhopanchang.precompute.plist
 *   2. Replace __REPO__, __NPX__ placeholders.
 *   3. plutil -lint the file.
 *   4. launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.dekhopanchang.precompute.plist
 *   5. Delete .github/workflows/precompute-nightly.yml IF you want to
 *      retire the GH Action. Otherwise both will run; the second to
 *      finish hits the webhook a few minutes later, no harm done
 *      (revalidatePath is idempotent).
 */

import { precomputeChoghadiya } from './precompute/choghadiya';
import { CITIES } from '../src/lib/constants/cities';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const LOG_PATH = path.resolve(__dirname, 'precompute-daily-cron.log');

interface Args {
  windowDays: number;
  backfillDays: number;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (flag: string, def: number): number => {
    const i = argv.indexOf(flag);
    if (i < 0) return def;
    const n = parseInt(argv[i + 1] ?? '', 10);
    if (isNaN(n) || n < 0) {
      throw new Error(`[precompute-daily-cron] ${flag} requires a non-negative integer`);
    }
    return n;
  };
  return {
    windowDays: get('--window-days', 60),
    backfillDays: get('--backfill-days', 0),
  };
}

function buildDateList(backfillDays: number, windowDays: number): string[] {
  // Lesson L — UTC. The cron should produce the same date list whether
  // it runs at 02:00 or 14:00 local time.
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const dates: string[] = [];
  for (let offset = -backfillDays; offset <= windowDays; offset++) {
    const d = new Date(todayUTC.getTime() + offset * 86400000);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function resolveISTCities(): string[] {
  return CITIES.filter((c) => c.timezone === 'Asia/Kolkata').map((c) => c.slug);
}

async function logLine(line: string): Promise<void> {
  const stamp = new Date().toISOString();
  const formatted = `${stamp} ${line}\n`;
  process.stdout.write(formatted);
  await fs.appendFile(LOG_PATH, formatted).catch(() => { /* log-rotation noise */ });
}

async function postRevalidate(opts: {
  url: string;
  secret: string;
  paths: string[];
}): Promise<{ ok: boolean; status: number; body: string }> {
  const res = await fetch(`${opts.url}/api/precompute/revalidate`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${opts.secret}`,
    },
    body: JSON.stringify({ paths: opts.paths }),
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

async function main(): Promise<number> {
  const args = parseArgs();

  // Safety gate: refuse to run if we'd silently no-op on production.
  // The local LocalFsStorage writes to a directory the production
  // pages can't see — a misconfigured cron would write Blobs nowhere
  // useful while looking successful.
  const storage = process.env.PRECOMPUTE_STORAGE;
  const target = process.env.PRECOMPUTE_TARGET_URL;
  if (storage !== 'blob') {
    if (target && target.includes('dekhopanchang.com')) {
      throw new Error(
        `[precompute-daily-cron] refusing to run: PRECOMPUTE_STORAGE=${storage} but PRECOMPUTE_TARGET_URL=${target}. Set PRECOMPUTE_STORAGE=blob for production runs.`,
      );
    }
    await logLine(`WARN: PRECOMPUTE_STORAGE=${storage} (not 'blob'); writing locally`);
  }

  const dates = buildDateList(args.backfillDays, args.windowDays);
  const cities = resolveISTCities();
  await logLine(
    `BEGIN dates=${dates.length} (backfill=${args.backfillDays}d window=${args.windowDays}d) cities=${cities.length}`,
  );

  // 1. Write Blobs.
  const t0 = Date.now();
  const results = await precomputeChoghadiya({
    dates,
    cities,
    skipIfPresent: true,
  });
  const written = results.filter((r) => r.status === 'written').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const elapsedSec = Math.round((Date.now() - t0) / 1000);
  await logLine(
    `WRITES written=${written} skipped=${skipped} elapsed=${elapsedSec}s`,
  );

  // 2. Revalidate paths for the locales we serve.
  const VISIBLE_LOCALES = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
  const paths = dates.flatMap((d) =>
    VISIBLE_LOCALES.map((l) => `/${l}/choghadiya/${d}`),
  );
  await logLine(`REVALIDATE paths=${paths.length}`);

  const secret = process.env.PRECOMPUTE_REVALIDATE_SECRET;
  const targetUrl = process.env.PRECOMPUTE_TARGET_URL;
  if (!secret || !targetUrl) {
    await logLine('REVALIDATE skipped — PRECOMPUTE_REVALIDATE_SECRET or PRECOMPUTE_TARGET_URL missing');
    return 0; // Blobs are written; missing webhook is recoverable next run
  }

  const result = await postRevalidate({ url: targetUrl, secret, paths });
  if (!result.ok) {
    await logLine(`REVALIDATE FAILED status=${result.status} body=${result.body.slice(0, 200)}`);
    return 2;
  }
  await logLine(`REVALIDATE ok status=${result.status} body=${result.body.slice(0, 200)}`);

  await logLine(`END`);
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch(async (err) => {
    await logLine(`FATAL ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
    process.exit(1);
  });
