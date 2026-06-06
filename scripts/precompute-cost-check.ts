/* eslint-disable no-console */
/**
 * Precompute migration cost-check email script.
 *
 * Runs from launchd (or manually with --checkpoint) and emails a cost
 * + traffic delta report to the user, then unloads its own launchd
 * plist so it doesn't fire twice.
 *
 * Why a separate script (vs the in-session CronCreate from 2026-06-06):
 *   - CronCreate is session-only; closing Claude Code kills it.
 *   - launchd survives logout/reboot. The plist fires at a wall-clock
 *     date even if no Claude session is alive.
 *   - The email lands in your inbox; no UI dependency.
 *
 * What it does:
 *   1. Resolves the two date windows for the requested checkpoint:
 *        --checkpoint t24h: post = 2026-06-07 (single day); pre = 2026-06-05
 *        --checkpoint t7d:  post = 2026-06-06..06-12; pre = 2026-05-30..06-05
 *   2. Shells out to `vercel usage --from X --to Y --format json` twice
 *      and parses the per-service breakdown.
 *   3. Composes a plain-text + HTML report with the delta per service,
 *      flagging Fluid Active CPU + ISR Writes (the two we attacked) in
 *      bold.
 *   4. POSTs the body to Resend's API and emails it to the user.
 *   5. Calls `launchctl bootout` on its own plist so the schedule
 *      doesn't re-fire next year on the same calendar day.
 *
 * Required env:
 *   RESEND_API_KEY    From .env.local (already present).
 *   COST_CHECK_TO     Optional override for the recipient. Defaults to
 *                     aditya.kr.jha@gmail.com (per memory user_identity).
 *
 * Required system state:
 *   `vercel` CLI on $PATH, authenticated for the panchang project. (The
 *   CLI reads ~/.local/share/com.vercel.cli/auth.json — no env token
 *   needed.) The launchd job runs as your user so the auth file is
 *   accessible.
 *
 * Manual run:
 *   npx tsx scripts/precompute-cost-check.ts --checkpoint t24h
 *   npx tsx scripts/precompute-cost-check.ts --checkpoint t24h --dry-run
 *
 * Failure modes:
 *   - vercel CLI not logged in → captured stderr in the email body so
 *     you see the failure mode in your inbox, not a silent skip.
 *   - Resend rejects → script exits 2 (launchd logs); plist NOT
 *     unloaded so a manual re-run is possible.
 *   - --dry-run prints the email body to stdout and skips Resend +
 *     self-unload.
 */

import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const SCRIPT_DIR = __dirname;
const LOG_PATH = path.resolve(SCRIPT_DIR, 'precompute-cost-check.log');

// Pre-migration cost baseline (the bill we were trying to cut). These
// are reference numbers for the email body — the script doesn't try
// to back-fetch the May totals.
const PRE_MIGRATION_BASELINE = {
  monthlyTotal: 163,
  fluidActiveCpu: 69,
  isrWrites: 59,
  other: 35,
};

const DEPLOY_DATE = '2026-06-06';

interface CheckpointConfig {
  label: string;
  postRange: { from: string; to: string };
  preRange: { from: string; to: string };
  daysInRange: number;
  plistName: string;
}

// Date windows are interpreted as LA-midnight bounds by `vercel usage`.
// Each fire time is chosen so that the post-window is FULLY closed by
// the time the script runs — querying a still-open day returns $0 and
// makes the delta meaningless.
//   Deploy: 2026-06-06 09:34 PT (16:34 UTC)
//   T+24h fire: 2026-06-08 09:23 CEST = 00:23 PT  → 2026-06-07 PT-day is fully closed.
//   T+7d  fire: 2026-06-14 09:23 CEST = 00:23 PT  → 2026-06-13 PT-day is fully closed.
const CHECKPOINTS: Record<string, CheckpointConfig> = {
  t24h: {
    label: 'T+24h',
    postRange: { from: '2026-06-07', to: '2026-06-07' },
    preRange: { from: '2026-06-05', to: '2026-06-05' },
    daysInRange: 1,
    plistName: 'com.dekhopanchang.precompute-cost-t24h.plist',
  },
  t7d: {
    label: 'T+7d',
    postRange: { from: '2026-06-07', to: '2026-06-13' },
    preRange: { from: '2026-05-30', to: '2026-06-05' },
    daysInRange: 7,
    plistName: 'com.dekhopanchang.precompute-cost-t7d.plist',
  },
};

interface VercelUsageService {
  name: string;
  pricingQuantity: number;
  effectiveCost: number;
  billedCost: number;
  pricingUnit: string;
}

interface VercelUsage {
  period: { from: string; to: string };
  services: VercelUsageService[];
}

function parseArgs(): { checkpoint: keyof typeof CHECKPOINTS; dryRun: boolean } {
  const argv = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const checkpoint = get('--checkpoint') as keyof typeof CHECKPOINTS | undefined;
  if (!checkpoint || !(checkpoint in CHECKPOINTS)) {
    throw new Error(`--checkpoint must be one of: ${Object.keys(CHECKPOINTS).join(', ')}`);
  }
  return { checkpoint, dryRun: argv.includes('--dry-run') };
}

async function logLine(line: string): Promise<void> {
  const stamp = new Date().toISOString();
  const formatted = `${stamp} ${line}\n`;
  process.stdout.write(formatted);
  await fs.appendFile(LOG_PATH, formatted).catch(() => { /* log rotation */ });
}

function fetchUsage(range: { from: string; to: string }): VercelUsage | { error: string } {
  try {
    const raw = execFileSync(
      'vercel',
      ['usage', '--format', 'json', '--from', range.from, '--to', range.to, '--non-interactive'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    // vercel CLI prints leading status lines before JSON; extract the {
    // ... } block. Grab everything from the first `{` to the last `}`.
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start < 0 || end < 0) {
      return { error: `no JSON in vercel usage output. raw=${raw.slice(0, 200)}` };
    }
    return JSON.parse(raw.slice(start, end + 1)) as VercelUsage;
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

function indexByService(usage: VercelUsage): Map<string, number> {
  const m = new Map<string, number>();
  for (const s of usage.services) m.set(s.name, s.billedCost);
  return m;
}

function compose(args: {
  cfg: CheckpointConfig;
  post: VercelUsage | { error: string };
  pre: VercelUsage | { error: string };
}): { subject: string; text: string; html: string } {
  const { cfg, post, pre } = args;

  const lines: string[] = [];
  const hLines: string[] = [];
  lines.push(`Precompute migration ${cfg.label} cost-delta report`);
  lines.push(`Deployed: ${DEPLOY_DATE} (PRECOMPUTE_FETCH_ENABLED flipped to true)`);
  lines.push(`Pre-migration baseline: ~$${PRE_MIGRATION_BASELINE.monthlyTotal}/mo`);
  lines.push(`  Fluid Active CPU $${PRE_MIGRATION_BASELINE.fluidActiveCpu}, ISR Writes $${PRE_MIGRATION_BASELINE.isrWrites}, other $${PRE_MIGRATION_BASELINE.other}`);
  lines.push('');
  lines.push(`Post window: ${cfg.postRange.from} → ${cfg.postRange.to} (${cfg.daysInRange} day${cfg.daysInRange > 1 ? 's' : ''})`);
  lines.push(`Pre window:  ${cfg.preRange.from} → ${cfg.preRange.to} (${cfg.daysInRange} day${cfg.daysInRange > 1 ? 's' : ''}, same length)`);
  lines.push('');

  hLines.push(`<h2>Precompute migration ${cfg.label} cost-delta report</h2>`);
  hLines.push(`<p><strong>Deployed:</strong> ${DEPLOY_DATE} (<code>PRECOMPUTE_FETCH_ENABLED=true</code>)<br>`);
  hLines.push(`<strong>Pre-migration baseline:</strong> ~$${PRE_MIGRATION_BASELINE.monthlyTotal}/mo (Fluid CPU $${PRE_MIGRATION_BASELINE.fluidActiveCpu} + ISR Writes $${PRE_MIGRATION_BASELINE.isrWrites} + other $${PRE_MIGRATION_BASELINE.other})</p>`);
  hLines.push(`<p>Comparing <b>${cfg.postRange.from} → ${cfg.postRange.to}</b> vs <b>${cfg.preRange.from} → ${cfg.preRange.to}</b> (${cfg.daysInRange}d each)</p>`);

  if ('error' in post || 'error' in pre) {
    const postErr = 'error' in post ? post.error : null;
    const preErr = 'error' in pre ? pre.error : null;
    lines.push('FAILED to fetch one or both windows:');
    if (postErr) lines.push(`  post: ${postErr}`);
    if (preErr) lines.push(`  pre:  ${preErr}`);
    lines.push('');
    lines.push('Re-run manually:');
    lines.push(`  npx tsx scripts/precompute-cost-check.ts --checkpoint ${cfg.label.toLowerCase().replace('+', '')}`);
    hLines.push(`<p style="color:#c00"><strong>Fetch failed:</strong></p><ul>`);
    if (postErr) hLines.push(`<li>post: <code>${postErr}</code></li>`);
    if (preErr) hLines.push(`<li>pre: <code>${preErr}</code></li>`);
    hLines.push(`</ul>`);
    return {
      subject: `[FAIL] Precompute migration ${cfg.label} cost check`,
      text: lines.join('\n'),
      html: hLines.join('\n'),
    };
  }

  const postIdx = indexByService(post);
  const preIdx = indexByService(pre);
  const allServices = new Set([...postIdx.keys(), ...preIdx.keys()]);

  const rows: { name: string; pre: number; post: number; delta: number; highlight: boolean }[] = [];
  for (const name of allServices) {
    const preCost = preIdx.get(name) ?? 0;
    const postCost = postIdx.get(name) ?? 0;
    const delta = postCost - preCost;
    if (preCost < 0.005 && postCost < 0.005) continue;
    const highlight = name === 'Fluid Active CPU' || name === 'ISR Writes' || name.startsWith('Blob');
    rows.push({ name, pre: preCost, post: postCost, delta, highlight });
  }
  rows.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  const totalPre = rows.reduce((acc, r) => acc + r.pre, 0);
  const totalPost = rows.reduce((acc, r) => acc + r.post, 0);
  const totalDelta = totalPost - totalPre;
  const annualizedDelta = (totalDelta / cfg.daysInRange) * 30;

  lines.push('Service                                Pre        Post       Delta');
  lines.push('-------------------------------------------------------------------');
  for (const r of rows) {
    const flag = r.highlight ? '*' : ' ';
    lines.push(`${flag} ${r.name.padEnd(38)}$${r.pre.toFixed(2).padStart(8)}  $${r.post.toFixed(2).padStart(8)}  $${r.delta.toFixed(2).padStart(8)}`);
  }
  lines.push('-------------------------------------------------------------------');
  lines.push(`  TOTAL                                 $${totalPre.toFixed(2).padStart(8)}  $${totalPost.toFixed(2).padStart(8)}  $${totalDelta.toFixed(2).padStart(8)}`);
  lines.push('');
  lines.push(`Annualized delta (post-window run-rate − pre-window run-rate × 30/${cfg.daysInRange}): $${annualizedDelta.toFixed(2)}/mo`);
  lines.push('');
  lines.push('* = service we expected the precompute migration to affect.');
  lines.push('');
  lines.push('Interpretation:');
  if (totalDelta < -2) {
    lines.push(`  ✅ Net spend DOWN by $${Math.abs(totalDelta).toFixed(2)} over ${cfg.daysInRange}d. Migration working.`);
  } else if (totalDelta < 2) {
    lines.push(`  ⚠️  Net spend roughly FLAT (±$${Math.abs(totalDelta).toFixed(2)}). Check whether traffic is comparable.`);
  } else {
    lines.push(`  🚨 Net spend UP by $${totalDelta.toFixed(2)}. Investigate Blob ops, check GSC traffic.`);
  }
  lines.push('');
  lines.push('Rollback if needed:');
  lines.push('  vercel env rm PRECOMPUTE_FETCH_ENABLED production --yes');
  lines.push('  echo -n "false" | vercel env add PRECOMPUTE_FETCH_ENABLED production');
  lines.push('  (No redeploy required — env reads at runtime.)');

  hLines.push(`<table style="border-collapse:collapse;font-family:monospace;font-size:13px"><thead><tr>`);
  hLines.push(`<th style="text-align:left;padding:4px 8px;border-bottom:1px solid #ccc">Service</th>`);
  hLines.push(`<th style="text-align:right;padding:4px 8px;border-bottom:1px solid #ccc">Pre</th>`);
  hLines.push(`<th style="text-align:right;padding:4px 8px;border-bottom:1px solid #ccc">Post</th>`);
  hLines.push(`<th style="text-align:right;padding:4px 8px;border-bottom:1px solid #ccc">Δ</th></tr></thead><tbody>`);
  for (const r of rows) {
    const style = r.highlight ? 'font-weight:bold' : '';
    hLines.push(`<tr style="${style}">`);
    hLines.push(`<td style="padding:2px 8px">${r.name}</td>`);
    hLines.push(`<td style="padding:2px 8px;text-align:right">$${r.pre.toFixed(2)}</td>`);
    hLines.push(`<td style="padding:2px 8px;text-align:right">$${r.post.toFixed(2)}</td>`);
    hLines.push(`<td style="padding:2px 8px;text-align:right;color:${r.delta < 0 ? '#0a0' : r.delta > 0.5 ? '#c00' : '#000'}">${r.delta >= 0 ? '+' : ''}$${r.delta.toFixed(2)}</td>`);
    hLines.push(`</tr>`);
  }
  hLines.push(`<tr style="border-top:2px solid #000;font-weight:bold">`);
  hLines.push(`<td style="padding:4px 8px">TOTAL</td>`);
  hLines.push(`<td style="padding:4px 8px;text-align:right">$${totalPre.toFixed(2)}</td>`);
  hLines.push(`<td style="padding:4px 8px;text-align:right">$${totalPost.toFixed(2)}</td>`);
  hLines.push(`<td style="padding:4px 8px;text-align:right;color:${totalDelta < 0 ? '#0a0' : '#c00'}">${totalDelta >= 0 ? '+' : ''}$${totalDelta.toFixed(2)}</td>`);
  hLines.push(`</tr></tbody></table>`);
  hLines.push(`<p><b>Annualized delta:</b> <span style="color:${annualizedDelta < 0 ? '#0a0' : '#c00'}">${annualizedDelta >= 0 ? '+' : ''}$${annualizedDelta.toFixed(2)}/mo</span></p>`);
  hLines.push(`<p style="font-size:12px;color:#666">Bold rows = services the precompute migration was expected to affect (Fluid Active CPU, ISR Writes, Blob*).</p>`);

  if (totalDelta < -2) {
    hLines.push(`<p style="color:#0a0"><b>✅ Net spend DOWN by $${Math.abs(totalDelta).toFixed(2)}.</b> Migration working.</p>`);
  } else if (totalDelta < 2) {
    hLines.push(`<p style="color:#a60"><b>⚠️ Net spend roughly flat (±$${Math.abs(totalDelta).toFixed(2)}).</b> Check whether traffic is comparable.</p>`);
  } else {
    hLines.push(`<p style="color:#c00"><b>🚨 Net spend UP by $${totalDelta.toFixed(2)}.</b> Investigate Blob ops + GSC traffic.</p>`);
  }
  hLines.push(`<p style="font-size:12px;color:#666"><b>Rollback if needed</b> (no redeploy required, env reads at runtime):<br>`);
  hLines.push(`<code>vercel env rm PRECOMPUTE_FETCH_ENABLED production --yes</code><br>`);
  hLines.push(`<code>echo -n "false" | vercel env add PRECOMPUTE_FETCH_ENABLED production</code></p>`);

  const subject =
    totalDelta < -2
      ? `✅ Precompute ${cfg.label}: -$${Math.abs(totalDelta).toFixed(0)} (annualized -$${Math.abs(annualizedDelta).toFixed(0)}/mo)`
      : totalDelta > 2
        ? `🚨 Precompute ${cfg.label}: +$${totalDelta.toFixed(0)} — investigate`
        : `⚠️ Precompute ${cfg.label}: flat`;

  return { subject, text: lines.join('\n'), html: hLines.join('\n') };
}

async function sendEmail(args: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY missing');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Dekho Panchang <noreply@dekhopanchang.com>',
      to: args.to,
      subject: args.subject,
      text: args.text,
      html: args.html,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

function selfUnloadPlist(plistName: string): { ok: boolean; detail: string } {
  const plistPath = path.join(os.homedir(), 'Library', 'LaunchAgents', plistName);
  try {
    const uid = process.getuid?.();
    if (uid === undefined) return { ok: false, detail: 'process.getuid() unavailable' };
    execFileSync('launchctl', ['bootout', `gui/${uid}`, plistPath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { ok: true, detail: `unloaded ${plistPath}` };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : String(err) };
  }
}

async function main(): Promise<number> {
  const { checkpoint, dryRun } = parseArgs();
  const cfg = CHECKPOINTS[checkpoint];
  const recipient = process.env.COST_CHECK_TO || 'aditya.kr.jha@gmail.com';

  await logLine(`BEGIN checkpoint=${checkpoint} dryRun=${dryRun} to=${recipient}`);

  await logLine(`fetching post window ${cfg.postRange.from}..${cfg.postRange.to}`);
  const post = fetchUsage(cfg.postRange);
  await logLine(`fetching pre  window ${cfg.preRange.from}..${cfg.preRange.to}`);
  const pre = fetchUsage(cfg.preRange);

  const { subject, text, html } = compose({ cfg, post, pre });

  if (dryRun) {
    console.log('--- subject ---');
    console.log(subject);
    console.log('--- text ---');
    console.log(text);
    console.log('--- html length ---', html.length);
    return 0;
  }

  try {
    await sendEmail({ to: recipient, subject, text, html });
    await logLine(`SENT subject="${subject}" to=${recipient}`);
  } catch (err) {
    await logLine(`EMAIL FAILED: ${err instanceof Error ? err.message : err}`);
    return 2;
  }

  const unload = selfUnloadPlist(cfg.plistName);
  await logLine(`self-unload ok=${unload.ok} detail=${unload.detail}`);

  await logLine('END');
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch(async (err) => {
    await logLine(`FATAL ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
    process.exit(1);
  });
