#!/usr/bin/env -S npx tsx
/**
 * GSC health monitor — daily local cron.
 *
 * Pulls topline + canary-query metrics from Search Console and emits a
 * macOS notification when traffic falls off a cliff. Modelled after the
 * June 1 collapse where /en/calendar/regional/bengali went from 146
 * clicks → 0 in 48 hours and we only noticed days later by squinting
 * at the GSC UI.
 *
 * Auth: gcloud Application Default Credentials. One-time setup is the
 * same as scripts/gsc-daily-cron.ts — see reference_gsc_via_adc.md in
 * the project memory. The `x-goog-user-project` header is required on
 * every request because Search Console doesn't accept user-credential
 * ADC without a quota project.
 *
 * Schedule: 09:00 local via launchd. GSC's daily aggregation lands at
 * roughly T+24-48h for "final" numbers but `dataState=all` exposes
 * partial-day data within ~3h, which is what we use for the canary.
 *
 * Output:
 *   - Always appends a JSONL row to scripts/gsc-health.log
 *   - Always prints a summary to stdout (launchd captures to /tmp)
 *   - On alert: macOS notification via osascript AND exit code 2
 *
 * Alert rules (any single trigger fires the notification):
 *   1. Yesterday clicks < 30% of the rolling 7-day median (-70%+ drop)
 *   2. Yesterday impressions < 30% of the 7-day median
 *   3. Canary query "bangla calendar" impressions drop > 70% vs 7d median
 *   4. Canary query position drops by 3 or more ranks vs 7d median
 *
 * Manual run: `npx tsx scripts/gsc-health-monitor.ts`
 * Force-alert (for testing the notifier): pass `--test-alert`.
 * Read cached summary without calling GSC: pass `--print-last` (this
 * is what the `/health` slash command uses).
 */

import { execSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'sc-domain:dekhopanchang.com';
const PROJECT_ID = 'dekhopanchang';
const SITE_ENC = encodeURIComponent(SITE);
const API_BASE = `https://searchconsole.googleapis.com/webmasters/v3/sites/${SITE_ENC}/searchAnalytics/query`;
const CANARY_QUERY = 'bangla calendar';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
// Per-run history (one JSONL row per run, append-only)
const LOG_PATH = resolve(SCRIPT_DIR, 'gsc-health.log');
// Latest summary, overwritten on every run. Lives at a worktree-
// independent path so /health and other readers find it without
// caring which checkout the cron ran from.
const CACHE_DIR = resolve(homedir(), '.cache');
const LATEST_PATH = resolve(CACHE_DIR, 'panchang-gsc-health-latest.json');

// Alert thresholds — tuned to catch the June 1 collapse pattern (>95%
// drop in 48h) while ignoring normal day-of-week swings (Sundays often
// run -20% from Wednesday peak).
const CLICKS_DROP_RATIO = 0.3;      // alert when below 30% of baseline
const IMPS_DROP_RATIO = 0.3;        // same
const CANARY_IMPS_DROP_RATIO = 0.3; // canary query impression floor
const CANARY_POS_DROP = 3;          // canary position ↓ N ranks

interface Row {
  date: string;
  clicks: number;
  impressions: number;
  position: number;
}

interface CanaryRow extends Row { ctr: number }

interface Summary {
  ranAt: string;
  range: { start: string; end: string };
  daily: Row[];
  baseline: { medianClicks: number; medianImps: number; days: number };
  yesterday: Row | null;
  canary: { yesterday: CanaryRow | null; baseline: { medianImps: number; medianPos: number; days: number } };
  alerts: string[];
}

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return ymd(d);
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function getAccessToken(): string {
  try {
    return execSync('gcloud auth application-default print-access-token', {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (err) {
    console.error('[gsc-health] Failed to obtain ADC token. Run `gcloud auth application-default login`.');
    throw err;
  }
}

async function gscQuery(token: string, body: Record<string, unknown>): Promise<{ rows?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> }> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-goog-user-project': PROJECT_ID,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[gsc-health] GSC API ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<{ rows?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> }>;
}

function notify(title: string, message: string): void {
  // macOS native notification. Falls back silently on non-macOS so the
  // script remains portable for CI runs.
  try {
    const safeTitle = title.replace(/"/g, '\\"');
    const safeMsg = message.replace(/"/g, '\\"');
    execSync(
      `osascript -e 'display notification "${safeMsg}" with title "${safeTitle}" sound name "Sosumi"'`,
      { stdio: 'ignore' },
    );
  } catch {
    // Non-fatal — log path still captures the alert
  }
}

// ─────────────────────────────────────────────────────────────────────
// Core analysis
// ─────────────────────────────────────────────────────────────────────

async function gatherSummary(testAlert: boolean): Promise<Summary> {
  const token = getAccessToken();
  // Window: last 10 days. We let GSC's natural data-availability cliff
  // tell us which day to treat as "yesterday" — at 09:00 local UTC the
  // latest returned date may be today-2 (during weekend lag) or today-1.
  // Baseline is then the 7 days immediately preceding that most-recent
  // returned date.
  const end = daysAgo(0);
  const start = daysAgo(10);

  const totals = await gscQuery(token, {
    startDate: start,
    endDate: end,
    dimensions: ['date'],
    rowLimit: 15,
  });

  const today = daysAgo(0);
  const daily: Row[] = (totals.rows ?? [])
    .map((r) => ({
      date: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      position: r.position,
    }))
    // Drop today — its data is always partial when this cron fires and
    // would trigger a false collapse alert every healthy morning.
    .filter((r) => r.date < today)
    .sort((a, b) => a.date.localeCompare(b.date));

  // "Yesterday" = the most recent complete day GSC has data for (may
  // be day-1 or day-2 depending on GSC's daily aggregation lag).
  // Baseline = the 7 days strictly before that.
  const yesterday = daily.length > 0 ? daily[daily.length - 1] : null;
  const baselineRows = daily.slice(-8, -1); // up to 7 days before "yesterday"
  const baseline = {
    medianClicks: median(baselineRows.map((r) => r.clicks)),
    medianImps: median(baselineRows.map((r) => r.impressions)),
    days: baselineRows.length,
  };

  // Canary query trajectory — same window, same "last day with data"
  // semantics.
  const canaryResp = await gscQuery(token, {
    startDate: start,
    endDate: end,
    dimensions: ['date'],
    dimensionFilterGroups: [{
      filters: [{ dimension: 'query', operator: 'equals', expression: CANARY_QUERY }],
    }],
    rowLimit: 15,
  });
  const canaryDaily: CanaryRow[] = (canaryResp.rows ?? [])
    .map((r) => ({
      date: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      position: r.position,
      ctr: r.ctr,
    }))
    .filter((r) => r.date < today) // skip partial today, same as topline
    .sort((a, b) => a.date.localeCompare(b.date));
  // Align canary "yesterday" to the topline yesterday so comparisons
  // describe the same day. Falls back to the latest canary date if the
  // exact day is missing (e.g. zero-impression days are sometimes
  // omitted from filtered responses).
  const canaryYesterday = yesterday
    ? (canaryDaily.find((d) => d.date === yesterday.date)
       ?? (canaryDaily.length > 0 ? canaryDaily[canaryDaily.length - 1] : null))
    : null;
  const canaryBaselineRows = canaryYesterday
    ? canaryDaily.filter((d) => d.date < canaryYesterday.date).slice(-7)
    : [];
  const canaryBaseline = {
    medianImps: median(canaryBaselineRows.map((r) => r.impressions)),
    medianPos: median(canaryBaselineRows.map((r) => r.position)),
    days: canaryBaselineRows.length,
  };

  // ─── Evaluate alert rules ───
  const alerts: string[] = [];
  if (yesterday && baseline.medianClicks > 5 && yesterday.clicks < baseline.medianClicks * CLICKS_DROP_RATIO) {
    const pct = Math.round((1 - yesterday.clicks / baseline.medianClicks) * 100);
    alerts.push(`Clicks -${pct}%: ${yesterday.clicks} vs 7d median ${Math.round(baseline.medianClicks)}`);
  }
  if (yesterday && baseline.medianImps > 100 && yesterday.impressions < baseline.medianImps * IMPS_DROP_RATIO) {
    const pct = Math.round((1 - yesterday.impressions / baseline.medianImps) * 100);
    alerts.push(`Impressions -${pct}%: ${yesterday.impressions} vs 7d median ${Math.round(baseline.medianImps)}`);
  }
  if (canaryYesterday && canaryBaseline.medianImps > 50 && canaryYesterday.impressions < canaryBaseline.medianImps * CANARY_IMPS_DROP_RATIO) {
    const pct = Math.round((1 - canaryYesterday.impressions / canaryBaseline.medianImps) * 100);
    alerts.push(`"${CANARY_QUERY}" imps -${pct}%: ${canaryYesterday.impressions} vs 7d median ${Math.round(canaryBaseline.medianImps)}`);
  }
  if (canaryYesterday && canaryBaseline.medianPos > 0 && canaryYesterday.position - canaryBaseline.medianPos >= CANARY_POS_DROP) {
    const delta = (canaryYesterday.position - canaryBaseline.medianPos).toFixed(1);
    alerts.push(`"${CANARY_QUERY}" position +${delta} ranks: ${canaryYesterday.position.toFixed(1)} vs 7d median ${canaryBaseline.medianPos.toFixed(1)}`);
  }
  if (testAlert) alerts.push('Test alert (--test-alert flag set)');

  return {
    ranAt: new Date().toISOString(),
    range: { start, end },
    daily,
    baseline,
    yesterday,
    canary: { yesterday: canaryYesterday, baseline: canaryBaseline },
    alerts,
  };
}

// ─────────────────────────────────────────────────────────────────────
// Reporting
// ─────────────────────────────────────────────────────────────────────

function formatRow(r: Row | null): string {
  if (!r) return 'no data';
  return `${r.clicks} clicks · ${r.impressions} imps · pos ${r.position.toFixed(1)}`;
}

function printSummary(s: Summary): void {
  console.log(`──── GSC health [${s.ranAt}] ────`);
  console.log(`Window: ${s.range.start} → ${s.range.end}`);
  console.log(`Latest complete day (${s.yesterday?.date ?? 'no data'}): ${formatRow(s.yesterday)}`);
  console.log(`7d baseline median: ${Math.round(s.baseline.medianClicks)} clicks · ${Math.round(s.baseline.medianImps)} imps (n=${s.baseline.days})`);
  console.log(`Canary "${CANARY_QUERY}" (${s.canary.yesterday?.date ?? 'no data'}): ${s.canary.yesterday ? formatRow(s.canary.yesterday) : 'no data'}`);
  console.log(`Canary 7d median: ${Math.round(s.canary.baseline.medianImps)} imps · pos ${s.canary.baseline.medianPos.toFixed(1)}`);
  if (s.alerts.length === 0) {
    console.log('Status: ✓ healthy');
  } else {
    console.log(`Status: ⚠ ${s.alerts.length} alert(s)`);
    for (const a of s.alerts) console.log(`  - ${a}`);
  }
}

function writeLog(s: Summary): void {
  mkdirSync(dirname(LOG_PATH), { recursive: true });
  appendFileSync(LOG_PATH, JSON.stringify(s) + '\n', 'utf-8');
  // Stable "latest snapshot" path — survives worktree churn so the
  // /health slash command always finds the most recent summary
  // regardless of which checkout ran the cron.
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(LATEST_PATH, JSON.stringify(s, null, 2), 'utf-8');
}

function printLatest(): void {
  if (!existsSync(LATEST_PATH)) {
    console.log(`No cached summary at ${LATEST_PATH}.`);
    console.log('Run the monitor once: `npx tsx scripts/gsc-health-monitor.ts`');
    process.exit(1);
  }
  const raw = readFileSync(LATEST_PATH, 'utf-8');
  const s = JSON.parse(raw) as Summary;
  printSummary(s);
  console.log(`\nSource: ${LATEST_PATH} (cached, no GSC call)`);
}

// ─────────────────────────────────────────────────────────────────────
// Entry
// ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (process.argv.includes('--print-last')) {
    printLatest();
    return;
  }
  const testAlert = process.argv.includes('--test-alert');
  const summary = await gatherSummary(testAlert);
  printSummary(summary);
  writeLog(summary);

  if (summary.alerts.length > 0) {
    const title = `GSC: ${summary.alerts.length} alert${summary.alerts.length > 1 ? 's' : ''}`;
    const body = summary.alerts.join(' · ').slice(0, 250);
    notify(title, body);
    process.exit(2);
  }
}

main().catch((err) => {
  console.error('[gsc-health] FAILED:', err);
  notify('GSC monitor failed', err.message ?? String(err));
  process.exit(1);
});
