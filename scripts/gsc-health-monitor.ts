#!/usr/bin/env -S npx tsx
/**
 * GSC health monitor — daily local cron.
 *
 * Pulls topline + canary + click-basket + page-loss metrics from Search
 * Console and emits a macOS notification when traffic falls off a cliff
 * or when winning queries slip meaningful rank.
 *
 * Auth: gcloud Application Default Credentials. One-time setup is the
 * same as scripts/gsc-daily-cron.ts — see reference_gsc_via_adc.md in
 * the project memory. The `x-goog-user-project` header is required on
 * every request because Search Console doesn't accept user-credential
 * ADC without a quota project.
 *
 * Schedule: 09:00 local via launchd. GSC's daily aggregation lands at
 * roughly T+24-48h for "final" numbers but `dataState=all` exposes
 * partial-day data within ~3h.
 *
 * Output:
 *   - Always appends a JSONL row to scripts/gsc-health.log
 *   - Always prints a summary to stdout (launchd captures to /tmp)
 *   - On alert: macOS notification via osascript AND exit code 2
 *
 * Alert rules (any single trigger fires the notification):
 *   1. Yesterday clicks < 30% of the rolling 7-day median (-70%+ drop)
 *   2. Yesterday impressions < 30% of the 7-day median
 *   3. Canary "bangla calendar" impressions drop > 70% vs 7d median
 *   5. Click-basket rank slip — ≥3 winning queries lost ≥5 rank positions
 *      week-over-week (prior position must have been <20 so we only flag
 *      real winners, not noise on page-5 long-tail).
 *   6. Page-level impression collapse — any page with ≥100 prior imps
 *      dropped >70% week-over-week.
 *
 * Rule 4 (CANARY_POS_DROP) removed 2026-08-19 — averaging position across
 * a spray of new long-tail hits mechanically drags the mean and fired
 * false positives whenever coverage expanded. Rule 5 subsumes its intent
 * with real statistical footing (per-winner rank tracking).
 *
 * API budget: ≈4.14 calls/run. baseline(1) + canary(1) + basket-positions(1) +
 * pages(1) + basket-refresh(0.14 amortised across 7 days). GSC quota is
 * 1200/site/day.
 *
 * Manual run: `npx tsx scripts/gsc-health-monitor.ts`
 * Force-alert (for testing the notifier): pass `--test-alert`.
 * Force basket refresh regardless of age: pass `--refresh-basket`.
 * Read cached summary without calling GSC: pass `--print-last`.
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
const LOG_PATH = resolve(SCRIPT_DIR, 'gsc-health.log');
// Worktree-independent path so /health and other readers find the summary
// regardless of which checkout the cron ran from.
const CACHE_DIR = resolve(homedir(), '.cache');
const LATEST_PATH = resolve(CACHE_DIR, 'panchang-gsc-health-latest.json');

const CLICKS_DROP_RATIO = 0.3;
const IMPS_DROP_RATIO = 0.3;
const CANARY_IMPS_DROP_RATIO = 0.3;

// Rule 5 tuning
const BASKET_REFRESH_DAYS = 7;
const BASKET_WINDOW_DAYS = 28;
const BASKET_SIZE = 20;
const BASKET_MIN_SLIPPERS = 3;
const BASKET_MIN_POS_DELTA = 5;
const BASKET_WINNER_MAX_PRIOR_POS = 20;

// Rule 6 tuning
const PAGE_MIN_PRIOR_IMPS = 100;
const PAGE_DROP_PCT = 70;

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

export interface Row {
  date: string;
  clicks: number;
  impressions: number;
  position: number;
}

export interface CanaryRow extends Row { ctr: number }

export interface BasketQuery {
  query: string;
  clicks28d: number;
  priorPos: number;
  recentPos: number;
  posDelta: number;
  priorClicks7d: number;
  recentClicks7d: number;
}

export interface ClickBasket {
  refreshedAt: string;
  windowDays: number;
  queries: BasketQuery[];
}

export interface PageLoss {
  page: string;
  priorImps: number;
  recentImps: number;
  dropPct: number;
}

export interface Summary {
  ranAt: string;
  range: { start: string; end: string };
  daily: Row[];
  baseline: { medianClicks: number; medianImps: number; days: number };
  yesterday: Row | null;
  canary: {
    yesterday: CanaryRow | null;
    baseline: { medianImps: number; medianPos: number; days: number };
  };
  clickBasket: ClickBasket;
  pageLosses: PageLoss[];
  alerts: string[];
}

export interface GscRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscResponse {
  rows?: GscRow[];
}

export type GscQueryFn = (body: Record<string, unknown>) => Promise<GscResponse>;

export interface GatherOptions {
  testAlert?: boolean;
  refreshBasket?: boolean;
  now?: Date;
  gscQuery?: GscQueryFn;
  priorBasket?: ClickBasket | null;
}

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setUTCDate(d.getUTCDate() - n);
  return ymd(d);
}

function daysBetween(a: string, b: string): number {
  const ma = Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8, 10));
  const mb = Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8, 10));
  return Math.round((mb - ma) / (24 * 3600 * 1000));
}

export function median(nums: number[]): number {
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

function makeLiveGscQuery(token: string): GscQueryFn {
  return async function gscQuery(body) {
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
    return res.json() as Promise<GscResponse>;
  };
}

function notify(title: string, message: string): void {
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

function readPriorBasket(): ClickBasket | null {
  if (!existsSync(LATEST_PATH)) return null;
  try {
    const raw = readFileSync(LATEST_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as { clickBasket?: ClickBasket };
    return parsed.clickBasket ?? null;
  } catch (err) {
    console.error('[gsc-health] Failed to read prior basket:', err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Basket refresh + week-over-week enrichment
// ─────────────────────────────────────────────────────────────────────

export function shouldRefreshBasket(
  prior: ClickBasket | null,
  today: string,
  force = false,
): boolean {
  if (force) return true;
  if (!prior) return true;
  if (!prior.refreshedAt) return true;
  return daysBetween(prior.refreshedAt, today) >= BASKET_REFRESH_DAYS;
}

export async function refreshBasketQueries(
  gscQuery: GscQueryFn,
  today: string,
): Promise<{ query: string; clicks28d: number }[]> {
  const start = daysAgo(BASKET_WINDOW_DAYS, new Date(`${today}T00:00:00Z`));
  const end = daysAgo(1, new Date(`${today}T00:00:00Z`));
  const resp = await gscQuery({
    startDate: start,
    endDate: end,
    dimensions: ['query'],
    rowLimit: BASKET_SIZE,
  });
  return (resp.rows ?? []).map((r) => ({
    query: r.keys[0],
    clicks28d: r.clicks,
  }));
}

export async function enrichBasketPositions(
  gscQuery: GscQueryFn,
  basketSeeds: { query: string; clicks28d: number }[],
  today: string,
): Promise<BasketQuery[]> {
  if (basketSeeds.length === 0) return [];
  // 14-day window split into recent-7 and prior-7 halves. Single call
  // with query+date dimensions lets us derive both halves in code
  // (keeps API budget under the 5-calls-per-run soft ceiling).
  const recentEnd = daysAgo(1, new Date(`${today}T00:00:00Z`));
  const priorStart = daysAgo(14, new Date(`${today}T00:00:00Z`));
  const recentStart = daysAgo(7, new Date(`${today}T00:00:00Z`));
  const priorEnd = daysAgo(8, new Date(`${today}T00:00:00Z`));

  const seedSet = new Set(basketSeeds.map((s) => s.query));
  const resp = await gscQuery({
    startDate: priorStart,
    endDate: recentEnd,
    dimensions: ['query', 'date'],
    rowLimit: 25000,
  });

  interface Agg { clicks: number; impressions: number; posSum: number; posN: number }
  const recent = new Map<string, Agg>();
  const prior = new Map<string, Agg>();
  for (const r of resp.rows ?? []) {
    const query = r.keys[0];
    const date = r.keys[1];
    if (!seedSet.has(query)) continue;
    const bucket = date >= recentStart && date <= recentEnd ? recent
      : date >= priorStart && date <= priorEnd ? prior
      : null;
    if (!bucket) continue;
    const cur = bucket.get(query) ?? { clicks: 0, impressions: 0, posSum: 0, posN: 0 };
    cur.clicks += r.clicks;
    cur.impressions += r.impressions;
    // Impression-weighted position, matching how GSC computes it.
    cur.posSum += r.position * r.impressions;
    cur.posN += r.impressions;
    bucket.set(query, cur);
  }

  return basketSeeds.map((seed) => {
    const r = recent.get(seed.query);
    const p = prior.get(seed.query);
    const recentPos = r && r.posN > 0 ? r.posSum / r.posN : 0;
    const priorPos = p && p.posN > 0 ? p.posSum / p.posN : 0;
    return {
      query: seed.query,
      clicks28d: seed.clicks28d,
      priorPos,
      recentPos,
      posDelta: recentPos - priorPos,
      priorClicks7d: p?.clicks ?? 0,
      recentClicks7d: r?.clicks ?? 0,
    };
  });
}

export async function fetchPageLosses(
  gscQuery: GscQueryFn,
  today: string,
): Promise<PageLoss[]> {
  const priorStart = daysAgo(14, new Date(`${today}T00:00:00Z`));
  const recentEnd = daysAgo(1, new Date(`${today}T00:00:00Z`));
  const recentStart = daysAgo(7, new Date(`${today}T00:00:00Z`));
  const priorEnd = daysAgo(8, new Date(`${today}T00:00:00Z`));

  const resp = await gscQuery({
    startDate: priorStart,
    endDate: recentEnd,
    dimensions: ['page', 'date'],
    rowLimit: 25000,
  });

  const recent = new Map<string, number>();
  const prior = new Map<string, number>();
  for (const r of resp.rows ?? []) {
    const page = r.keys[0];
    const date = r.keys[1];
    if (date >= recentStart && date <= recentEnd) {
      recent.set(page, (recent.get(page) ?? 0) + r.impressions);
    } else if (date >= priorStart && date <= priorEnd) {
      prior.set(page, (prior.get(page) ?? 0) + r.impressions);
    }
  }

  const losses: PageLoss[] = [];
  for (const [page, priorImps] of prior) {
    if (priorImps < PAGE_MIN_PRIOR_IMPS) continue;
    const recentImps = recent.get(page) ?? 0;
    const dropPct = Math.round((1 - recentImps / priorImps) * 100);
    if (dropPct > PAGE_DROP_PCT) {
      losses.push({ page, priorImps, recentImps, dropPct });
    }
  }
  losses.sort((a, b) => b.dropPct - a.dropPct);
  return losses;
}

// ─────────────────────────────────────────────────────────────────────
// Core analysis (exported for tests)
// ─────────────────────────────────────────────────────────────────────

export async function gatherSummary(opts: GatherOptions = {}): Promise<Summary> {
  const now = opts.now ?? new Date();
  const gscQuery = opts.gscQuery ?? makeLiveGscQuery(getAccessToken());
  const priorBasket = opts.priorBasket !== undefined ? opts.priorBasket : readPriorBasket();

  // Window: last 10 days. GSC's data-availability cliff tells us which
  // day to treat as "yesterday" — at 09:00 local UTC the latest returned
  // date may be today-2 (weekend lag) or today-1.
  const end = daysAgo(0, now);
  const start = daysAgo(10, now);
  const today = end;

  const totals = await gscQuery({
    startDate: start,
    endDate: end,
    dimensions: ['date'],
    rowLimit: 15,
  });

  const daily: Row[] = (totals.rows ?? [])
    .map((r) => ({
      date: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      position: r.position,
    }))
    // Drop today — partial data would trigger a false collapse alert.
    .filter((r) => r.date < today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const yesterday = daily.length > 0 ? daily[daily.length - 1] : null;
  const baselineRows = daily.slice(-8, -1);
  const baseline = {
    medianClicks: median(baselineRows.map((r) => r.clicks)),
    medianImps: median(baselineRows.map((r) => r.impressions)),
    days: baselineRows.length,
  };

  const canaryResp = await gscQuery({
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
    .filter((r) => r.date < today)
    .sort((a, b) => a.date.localeCompare(b.date));
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

  // Click basket — refresh the seed set weekly, always re-enrich positions.
  const needsRefresh = shouldRefreshBasket(priorBasket, today, opts.refreshBasket);
  let basketSeeds: { query: string; clicks28d: number }[];
  let basketRefreshedAt: string;
  if (needsRefresh) {
    basketSeeds = await refreshBasketQueries(gscQuery, today);
    basketRefreshedAt = today;
  } else {
    basketSeeds = (priorBasket?.queries ?? []).map((q) => ({ query: q.query, clicks28d: q.clicks28d }));
    basketRefreshedAt = priorBasket?.refreshedAt ?? today;
  }
  const basketQueries = await enrichBasketPositions(gscQuery, basketSeeds, today);
  const clickBasket: ClickBasket = {
    refreshedAt: basketRefreshedAt,
    windowDays: BASKET_WINDOW_DAYS,
    queries: basketQueries,
  };

  const pageLosses = await fetchPageLosses(gscQuery, today);

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

  // Rule 5: click-basket rank slip
  const slippers = basketQueries.filter((q) =>
    q.priorPos > 0
    && q.priorPos < BASKET_WINNER_MAX_PRIOR_POS
    && q.posDelta >= BASKET_MIN_POS_DELTA,
  );
  if (slippers.length >= BASKET_MIN_SLIPPERS) {
    const preview = slippers
      .slice(0, 3)
      .map((q) => `"${q.query}" ${q.priorPos.toFixed(1)}→${q.recentPos.toFixed(1)}`)
      .join(', ');
    alerts.push(`Basket rank slip: ${slippers.length} winners ↓≥${BASKET_MIN_POS_DELTA} — ${preview}`);
  }

  // Rule 6: page-level impression collapse
  for (const loss of pageLosses) {
    alerts.push(`Page ${loss.page} imps -${loss.dropPct}%: ${loss.recentImps} vs prior 7d ${loss.priorImps}`);
  }

  if (opts.testAlert) alerts.push('Test alert (--test-alert flag set)');

  return {
    ranAt: now.toISOString(),
    range: { start, end },
    daily,
    baseline,
    yesterday,
    canary: { yesterday: canaryYesterday, baseline: canaryBaseline },
    clickBasket,
    pageLosses,
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
  console.log(`Click basket (refreshed ${s.clickBasket.refreshedAt}, ${s.clickBasket.queries.length} queries)`);
  if (s.pageLosses.length > 0) {
    console.log(`Page losses: ${s.pageLosses.length} page(s) dropped >${PAGE_DROP_PCT}%`);
  }
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
  const refreshBasket = process.argv.includes('--refresh-basket');
  const summary = await gatherSummary({ testAlert, refreshBasket });
  printSummary(summary);
  writeLog(summary);

  if (summary.alerts.length > 0) {
    const title = `GSC: ${summary.alerts.length} alert${summary.alerts.length > 1 ? 's' : ''}`;
    const body = summary.alerts.join(' · ').slice(0, 250);
    notify(title, body);
    process.exit(2);
  }
}

// Guard entry so `import` from tests doesn't kick off the CLI.
const invokedDirectly = (() => {
  try {
    return process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
  } catch {
    return false;
  }
})();

if (invokedDirectly) {
  main().catch((err) => {
    console.error('[gsc-health] FAILED:', err);
    notify('GSC monitor failed', err.message ?? String(err));
    process.exit(1);
  });
}
