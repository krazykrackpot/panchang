/**
 * Vercel usage snapshot — parses `vercel usage` output and appends
 * one row per non-zero service to docs/vercel-usage-history.csv.
 *
 * Use case — early-warning system for cost spikes.
 * June 2026 ISR Writes went from $6/month to $44 in 12 days; the
 * regression sat unnoticed for two weeks because nothing alerted on
 * the daily rate change. This snapshot script, run weekly via cron
 * or `npm run snapshot:vercel`, gives a check-in-able audit trail
 * of what each line item costs over time.
 *
 * Usage (manual):
 *   npx tsx scripts/snapshot-vercel-usage.ts
 *   npx tsx scripts/snapshot-vercel-usage.ts --scope adi-dekho-panchang
 *   npx tsx scripts/snapshot-vercel-usage.ts --diff  # show vs last snapshot
 *
 * CSV columns:
 *   snapshot_at_iso, scope, period_start, period_end, service, billed_cost_usd
 *
 * The script intentionally avoids @vercel/sdk / API calls — `vercel
 * usage` already does the same query and we just want a stable text
 * format to parse. CSV grows by one row per service per snapshot
 * (~16 rows/snapshot at current line-item count).
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, appendFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DEFAULT_SCOPE = 'adis-projects-13833487';
const CSV_PATH = resolve(process.cwd(), 'docs/vercel-usage-history.csv');
const CSV_HEADER = 'snapshot_at_iso,scope,period_start,period_end,service,billed_cost_usd\n';

interface UsageSnapshot {
  scope: string;
  periodStart: string;
  periodEnd: string;
  services: Array<{ name: string; billedUsd: number }>;
}

function getArg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function parseUsageOutput(raw: string, scope: string): UsageSnapshot {
  // Period line shape: "> Period: 2026-06-01 to 2026-06-13 (current month)"
  const periodMatch = raw.match(/Period:\s+(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/);
  if (!periodMatch) {
    throw new Error('[snapshot] could not find Period line in vercel usage output');
  }
  const periodStart = periodMatch[1];
  const periodEnd = periodMatch[2];

  // Each row shape: "  Service Name                                 $X.YYYY          $X.YYYY        $X.YYYY"
  // 4 columns: name, usage cost, effective cost, billed cost. We capture
  // the billed (last) column.
  // Name uses [^$]+? rather than a tight allow-list so parenthesised
  // names like "Serverless Function Execution (GB-hours)" match too.
  // Gemini PR #702.
  const services: UsageSnapshot['services'] = [];
  const lineRe = /^\s{2}([^$]+?)\s+\$([\d.]+)\s+\$([\d.]+)\s+\$([\d.]+)\s*$/;
  for (const line of raw.split('\n')) {
    const m = lineRe.exec(line);
    if (!m) continue;
    const name = m[1].trim();
    if (name === 'Total') continue; // recorded separately below
    const billed = parseFloat(m[4]);
    if (!Number.isFinite(billed)) continue;
    if (billed === 0) continue; // skip zero rows; the CSV is for non-trivial cost drivers
    services.push({ name, billedUsd: billed });
  }

  // Total appears in the same shape on its own row; record it too.
  const totalMatch = raw.match(/^\s{2}Total\s+\$[\d.]+\s+\$[\d.]+\s+\$([\d.]+)\s*$/m);
  if (totalMatch) {
    const total = parseFloat(totalMatch[1]);
    if (Number.isFinite(total)) {
      services.push({ name: 'Total', billedUsd: total });
    }
  }

  return { scope, periodStart, periodEnd, services };
}

function appendSnapshot(snapshot: UsageSnapshot): number {
  if (!existsSync(CSV_PATH)) {
    writeFileSync(CSV_PATH, CSV_HEADER, 'utf8');
  }
  const at = new Date().toISOString();
  let appended = 0;
  for (const svc of snapshot.services) {
    // Escape commas in service names (none expected, but safe).
    const safeName = svc.name.includes(',') ? `"${svc.name}"` : svc.name;
    const row = `${at},${snapshot.scope},${snapshot.periodStart},${snapshot.periodEnd},${safeName},${svc.billedUsd.toFixed(4)}\n`;
    appendFileSync(CSV_PATH, row, 'utf8');
    appended++;
  }
  return appended;
}

interface CsvRow {
  snapshotAt: string;
  scope: string;
  periodStart: string;
  periodEnd: string;
  service: string;
  billed: number;
}

function readCsv(): CsvRow[] {
  if (!existsSync(CSV_PATH)) return [];
  const lines = readFileSync(CSV_PATH, 'utf8').split('\n');
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    // Naive parse — no quoted commas in our writer.
    const cols = line.split(',');
    if (cols.length < 6) continue;
    rows.push({
      snapshotAt: cols[0],
      scope: cols[1],
      periodStart: cols[2],
      periodEnd: cols[3],
      // Strip surrounding quotes added by the writer for names with
      // commas — without this the diff matcher misses the row.
      // Gemini PR #702.
      service: cols.slice(4, cols.length - 1).join(',').replace(/^"|"$/g, ''),
      billed: parseFloat(cols[cols.length - 1]),
    });
  }
  return rows;
}

function diffAgainstLastSnapshot(snapshot: UsageSnapshot): void {
  const all = readCsv();
  const sameScope = all.filter((r) => r.scope === snapshot.scope);
  if (sameScope.length === 0) {
    console.log('[snapshot] no prior snapshot for this scope — nothing to diff.');
    return;
  }
  const lastAt = sameScope[sameScope.length - 1].snapshotAt;
  const last = sameScope.filter((r) => r.snapshotAt === lastAt);
  const lastByService = new Map(last.map((r) => [r.service, r.billed]));

  console.log(`\nDiff vs last snapshot at ${lastAt}:\n`);
  const all_services = new Set<string>([
    ...snapshot.services.map((s) => s.name),
    ...lastByService.keys(),
  ]);
  const rows: Array<{ service: string; prev: number; curr: number; delta: number }> = [];
  for (const service of all_services) {
    const prev = lastByService.get(service) ?? 0;
    const curr = snapshot.services.find((s) => s.name === service)?.billedUsd ?? 0;
    rows.push({ service, prev, curr, delta: curr - prev });
  }
  rows.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  for (const row of rows) {
    if (row.prev === 0 && row.curr === 0) continue;
    const arrow = row.delta > 0.005 ? '⬆' : row.delta < -0.005 ? '⬇' : ' ';
    console.log(
      `  ${arrow} ${row.service.padEnd(40)} $${row.prev.toFixed(2).padStart(8)} → $${row.curr.toFixed(2).padStart(8)}  Δ ${row.delta >= 0 ? '+' : ''}$${row.delta.toFixed(2)}`,
    );
  }
}

function main(): void {
  const scope = getArg('--scope') ?? DEFAULT_SCOPE;
  // Defence in depth: --scope flows into execSync below as a shell
  // argument. Vercel team slugs are alnum + hyphen + underscore so a
  // strict allow-list closes the command-injection door without ever
  // accepting a real-world team slug we'd care about. Gemini PR #702.
  if (!/^[a-zA-Z0-9\-_]+$/.test(scope)) {
    throw new Error(`[snapshot] invalid --scope value: ${JSON.stringify(scope)}`);
  }
  const diffOnly = process.argv.includes('--diff');

  console.log(`[snapshot] querying vercel usage for scope ${scope} ...`);
  let raw: string;
  try {
    raw = execSync(`vercel usage --scope ${scope}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) {
    throw new Error(
      `[snapshot] vercel usage failed. Verify CLI is installed and \`vercel whoami\` succeeds. ` +
        (err instanceof Error ? err.message : String(err)),
    );
  }

  const snapshot = parseUsageOutput(raw, scope);
  console.log(`[snapshot] period ${snapshot.periodStart} → ${snapshot.periodEnd}, ${snapshot.services.length} services with non-zero billing.`);

  if (diffOnly) {
    diffAgainstLastSnapshot(snapshot);
    return;
  }

  diffAgainstLastSnapshot(snapshot);

  const appended = appendSnapshot(snapshot);
  console.log(`\n[snapshot] appended ${appended} rows to ${CSV_PATH}`);
}

main();
