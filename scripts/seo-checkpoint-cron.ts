/* eslint-disable no-console */
/**
 * SEO checkpoint cron — runs the +14d (2026-06-10) or +30d (2026-06-26)
 * measurement defined in `project_seo_step123_2026_05_27.md` and emails
 * a pass/fail report, then self-unloads its launchd plist.
 *
 * Mirror of `scripts/precompute-cost-check.ts`. Same Resend send path,
 * same `launchctl bootout` self-uninstall, same `.env.local` source for
 * RESEND_API_KEY.
 *
 * What gets checked at each checkpoint:
 *
 * ## +14d (2026-06-10) — Step 1+2 signals
 * 1. `bangla calendar` CTR ≥ 3%      (baseline 1.5% @ pos 7.7)
 * 2. `aaj ka panchang` position < 40 (baseline pos 68, 0 clicks)
 * 3. date-format `panchang [date]` query impressions > 0 (any)
 *
 * ## +30d (2026-06-26) — Step 3 signals
 * 4. kundali-intent total imps > 100 (`{sign} ascendant`, `{sign} lagna`)
 * 5. featured-yoga imps each > 20 (gajakesari, kemadruma, shankha,
 *    bheri, kedara, gauri)
 *
 * Required env:
 *   RESEND_API_KEY    From .env.local
 *   COST_CHECK_TO     Optional recipient override (defaults to
 *                     aditya.kr.jha@gmail.com per memory user_identity)
 *
 * Required system state:
 *   gcloud ADC logged in for the dekhopanchang project. The cron runs
 *   as your user so `gcloud auth application-default print-access-token`
 *   resolves the same credentials used elsewhere in this codebase
 *   (see reference_gsc_via_adc.md).
 *
 * Manual run:
 *   npx tsx scripts/seo-checkpoint-cron.ts --checkpoint t14
 *   npx tsx scripts/seo-checkpoint-cron.ts --checkpoint t14 --dry-run
 *
 * Failure modes:
 *   - gcloud ADC token expired → captured stderr in email body
 *   - GSC API rejects (project mismatch) → captured stderr
 *   - Resend rejects → exit 2, plist NOT unloaded (manual re-run possible)
 */

import { execFileSync, spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const SCRIPT_DIR = __dirname;
const LOG_PATH = path.resolve(SCRIPT_DIR, 'seo-checkpoint-cron.log');
const GSC_SITE = 'sc-domain:dekhopanchang.com';
const GSC_PROJECT = 'dekhopanchang';

interface CheckpointConfig {
  label: string;
  /** 7-day window ending on the checkpoint day. */
  range: { from: string; to: string };
  /** Plist filename to bootout after sending the email. */
  plistName: string;
  /** Which checks fire at this checkpoint. */
  checks: ReadonlyArray<keyof typeof CHECK_DEFS>;
}

interface CheckResult {
  key: string;
  label: string;
  expected: string;
  actual: string;
  status: 'pass' | 'fail' | 'partial' | 'error';
  detail?: string;
}

const CHECKPOINTS: Record<string, CheckpointConfig> = {
  t14: {
    label: 'T+14d',
    range: { from: '2026-06-04', to: '2026-06-10' },
    plistName: 'com.dekhopanchang.seo-checkpoint-t14.plist',
    checks: ['bangla_calendar_ctr', 'aaj_ka_panchang_position', 'panchang_date_imps'],
  },
  t30: {
    label: 'T+30d',
    range: { from: '2026-06-20', to: '2026-06-26' },
    plistName: 'com.dekhopanchang.seo-checkpoint-t30.plist',
    checks: ['kundali_intent_imps', 'featured_yogas_imps'],
  },
};

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

function getAdcToken(): string {
  const r = spawnSync('gcloud', ['auth', 'application-default', 'print-access-token'], {
    encoding: 'utf8',
  });
  // Handle the ENOENT case first — `gcloud` missing from PATH gives
  // `r.error` set and `r.status === null`. Without this branch the
  // status check below tries to read r.stderr/r.stdout which are
  // both undefined. Gemini PR #504.
  if (r.error) {
    throw new Error(`gcloud ADC failed to execute: ${r.error.message}`);
  }
  if (r.status !== 0) {
    throw new Error(`gcloud ADC failed: ${r.stderr || r.stdout}`);
  }
  return r.stdout.trim();
}

interface GscRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

async function gscQuery(args: {
  token: string;
  from: string;
  to: string;
  dimensions: string[];
  filters?: Array<{ dimension: string; operator: string; expression: string }>;
  rowLimit?: number;
}): Promise<GscRow[]> {
  const body: Record<string, unknown> = {
    startDate: args.from,
    endDate: args.to,
    dimensions: args.dimensions,
    rowLimit: args.rowLimit ?? 1000,
  };
  if (args.filters && args.filters.length) {
    body.dimensionFilterGroups = [{ filters: args.filters }];
  }
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${args.token}`,
      'x-goog-user-project': GSC_PROJECT,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`GSC ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const j = (await res.json()) as { rows?: GscRow[] };
  return j.rows ?? [];
}

const CHECK_DEFS = {
  bangla_calendar_ctr: async (token: string, range: { from: string; to: string }): Promise<CheckResult> => {
    const rows = await gscQuery({
      token, from: range.from, to: range.to,
      dimensions: ['query'],
      filters: [{ dimension: 'query', operator: 'equals', expression: 'bangla calendar' }],
    });
    const row = rows[0];
    if (!row) {
      return {
        key: 'bangla_calendar_ctr',
        label: '`bangla calendar` CTR',
        expected: '≥ 3% (baseline 1.5% @ pos 7.7)',
        actual: 'no impressions in window',
        status: 'partial',
      };
    }
    const ctr = row.ctr * 100;
    return {
      key: 'bangla_calendar_ctr',
      label: '`bangla calendar` CTR',
      expected: '≥ 3%',
      actual: `${ctr.toFixed(2)}% @ pos ${row.position.toFixed(1)} (${row.impressions} imp, ${row.clicks} clk)`,
      status: ctr >= 3 ? 'pass' : 'fail',
    };
  },

  aaj_ka_panchang_position: async (token: string, range: { from: string; to: string }): Promise<CheckResult> => {
    const rows = await gscQuery({
      token, from: range.from, to: range.to,
      dimensions: ['query'],
      filters: [{ dimension: 'query', operator: 'equals', expression: 'aaj ka panchang' }],
    });
    const row = rows[0];
    if (!row) {
      return {
        key: 'aaj_ka_panchang_position',
        label: '`aaj ka panchang` position',
        expected: '< 40 (baseline pos 68)',
        actual: 'no impressions in window',
        status: 'fail',
      };
    }
    return {
      key: 'aaj_ka_panchang_position',
      label: '`aaj ka panchang` position',
      expected: '< 40',
      actual: `pos ${row.position.toFixed(1)} (${row.impressions} imp, ${row.clicks} clk)`,
      status: row.position < 40 ? 'pass' : 'fail',
    };
  },

  panchang_date_imps: async (token: string, range: { from: string; to: string }): Promise<CheckResult> => {
    const rows = await gscQuery({
      token, from: range.from, to: range.to,
      dimensions: ['query'],
      filters: [{ dimension: 'query', operator: 'includingRegex', expression: 'panchang (today|tomorrow|of today|today in)' }],
    });
    const totalImps = rows.reduce((acc, r) => acc + r.impressions, 0);
    return {
      key: 'panchang_date_imps',
      label: 'date-format `panchang [date]` impressions',
      expected: '> 0',
      actual: `${totalImps} imp across ${rows.length} queries`,
      status: totalImps > 0 ? 'pass' : 'fail',
      detail: rows.slice(0, 5).map((r) => `${r.keys[0]}: ${r.impressions} imp @ pos ${r.position.toFixed(1)}`).join('; '),
    };
  },

  kundali_intent_imps: async (token: string, range: { from: string; to: string }): Promise<CheckResult> => {
    const rows = await gscQuery({
      token, from: range.from, to: range.to,
      dimensions: ['query'],
      filters: [{ dimension: 'query', operator: 'includingRegex', expression: '(ascendant|lagna)' }],
    });
    const totalImps = rows.reduce((acc, r) => acc + r.impressions, 0);
    return {
      key: 'kundali_intent_imps',
      label: 'kundali-intent total impressions (`{sign} ascendant` / `{sign} lagna`)',
      expected: '> 100',
      actual: `${totalImps} imp across ${rows.length} queries`,
      status: totalImps > 100 ? 'pass' : totalImps > 50 ? 'partial' : 'fail',
    };
  },

  featured_yogas_imps: async (token: string, range: { from: string; to: string }): Promise<CheckResult> => {
    const yogas = ['gajakesari', 'kemadruma', 'shankha', 'bheri', 'kedara', 'gauri'];
    // Six GSC API calls — fire in parallel. Sequential awaits add
    // ~600ms × 6 = 3.6s; Promise.all collapses to ~600ms. Gemini PR #504.
    const results = await Promise.all(
      yogas.map(async (name) => {
        const rows = await gscQuery({
          token, from: range.from, to: range.to,
          dimensions: ['query'],
          filters: [{ dimension: 'query', operator: 'includingRegex', expression: `\\b${name}\\b` }],
        });
        const imp = rows.reduce((acc, r) => acc + r.impressions, 0);
        return { name, imp, pass: imp > 20 };
      }),
    );
    const passed = results.filter((r) => r.pass).length;
    return {
      key: 'featured_yogas_imps',
      label: 'featured-yoga impressions (each > 20)',
      expected: `each > 20 across ${yogas.length} yogas`,
      actual: `${passed}/${yogas.length} pass — ${results.map((r) => `${r.name}=${r.imp}${r.pass ? '✓' : '✗'}`).join(', ')}`,
      status: passed === yogas.length ? 'pass' : passed >= yogas.length / 2 ? 'partial' : 'fail',
    };
  },
} as const;

function compose(args: { cfg: CheckpointConfig; results: CheckResult[] }): {
  subject: string;
  text: string;
  html: string;
} {
  const passed = args.results.filter((r) => r.status === 'pass').length;
  const failed = args.results.filter((r) => r.status === 'fail').length;
  const partial = args.results.filter((r) => r.status === 'partial').length;
  const errored = args.results.filter((r) => r.status === 'error').length;
  const total = args.results.length;

  let banner = '';
  if (errored > 0) banner = '🚨 errors';
  else if (failed === 0 && partial === 0) banner = '✅ all green';
  else if (failed === 0) banner = '🟡 partial — close to threshold';
  else if (passed > 0) banner = '🟡 mixed';
  else banner = '🔴 missed threshold';

  const lines: string[] = [];
  lines.push(`SEO ${args.cfg.label} checkpoint — ${banner}`);
  lines.push(`Window: ${args.cfg.range.from} → ${args.cfg.range.to} (7d)`);
  lines.push(`Result: ${passed} pass · ${failed} fail · ${partial} partial · ${errored} error`);
  lines.push('');
  lines.push('Compare against: project_seo_step123_2026_05_27.md (original baseline + thresholds)');
  lines.push('Decision tree: see "Decision tree at +30d" in that memory.');
  lines.push('');
  for (const r of args.results) {
    const icon = r.status === 'pass' ? '✓' : r.status === 'fail' ? '✗' : r.status === 'partial' ? '~' : '!';
    lines.push(`${icon} ${r.label}`);
    lines.push(`    expected: ${r.expected}`);
    lines.push(`    actual:   ${r.actual}`);
    if (r.detail) lines.push(`    detail:   ${r.detail}`);
    lines.push('');
  }
  lines.push('Re-open T-3d snapshot: project_seo_step123_2026_06_07_t14_baseline.md.');
  lines.push('Apply the decision tree manually; this email is the data-pull, not the call.');

  const hLines: string[] = [];
  hLines.push(`<h2>SEO ${args.cfg.label} checkpoint — ${banner}</h2>`);
  hLines.push(`<p><b>Window:</b> ${args.cfg.range.from} → ${args.cfg.range.to} (7d)<br>`);
  hLines.push(`<b>Result:</b> ${passed} pass · ${failed} fail · ${partial} partial · ${errored} error</p>`);
  hLines.push('<table style="border-collapse:collapse;font-family:monospace;font-size:13px"><thead>');
  hLines.push('<tr><th style="text-align:left;padding:4px 8px">Check</th><th style="text-align:left;padding:4px 8px">Expected</th><th style="text-align:left;padding:4px 8px">Actual</th></tr></thead><tbody>');
  for (const r of args.results) {
    const color = r.status === 'pass' ? '#0a0' : r.status === 'fail' ? '#c00' : r.status === 'partial' ? '#a60' : '#666';
    hLines.push(`<tr style="border-top:1px solid #ccc;color:${color}">`);
    hLines.push(`<td style="padding:4px 8px"><b>${r.label}</b></td>`);
    hLines.push(`<td style="padding:4px 8px">${r.expected}</td>`);
    hLines.push(`<td style="padding:4px 8px">${r.actual}${r.detail ? `<br><small>${r.detail}</small>` : ''}</td>`);
    hLines.push('</tr>');
  }
  hLines.push('</tbody></table>');
  hLines.push('<p style="font-size:12px;color:#666">Baseline + thresholds: <code>project_seo_step123_2026_05_27.md</code>. T-3d snapshot: <code>project_seo_step123_2026_06_07_t14_baseline.md</code>. Decision tree is human work — this email is the data pull.</p>');

  return {
    subject: `[SEO ${args.cfg.label}] ${banner.replace(/^[^a-zA-Z]+/, '').trim()} (${passed}/${total} pass)`,
    text: lines.join('\n'),
    html: hLines.join('\n'),
  };
}

async function sendEmail(args: { to: string; subject: string; text: string; html: string }): Promise<void> {
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
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
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

  // ADC-failure path emails the diagnostic and self-unloads, matching
  // the doc-comment ("captured stderr in email body so you see the
  // failure mode in your inbox, not a silent skip"). Previous version
  // exited 2 immediately which contradicted that — Gemini PR #504.
  let token = '';
  let adcError: Error | null = null;
  try {
    token = getAdcToken();
  } catch (err) {
    adcError = err instanceof Error ? err : new Error(String(err));
    await logLine(`ADC FAILED: ${adcError.message}`);
  }

  const results: CheckResult[] = [];
  for (const key of cfg.checks) {
    if (adcError) {
      results.push({
        key,
        label: key,
        expected: 'check should run',
        actual: `ADC failed: ${adcError.message}`,
        status: 'error',
      });
      continue;
    }
    try {
      const res = await CHECK_DEFS[key](token, cfg.range);
      results.push(res);
      await logLine(`CHECK ${res.key} = ${res.status} (${res.actual})`);
    } catch (err) {
      results.push({
        key,
        label: key,
        expected: 'check should run',
        actual: err instanceof Error ? err.message : String(err),
        status: 'error',
      });
      await logLine(`CHECK ${key} ERROR: ${err instanceof Error ? err.message : err}`);
    }
  }

  const { subject, text, html } = compose({ cfg, results });

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
    await logLine(`SENT subject="${subject}"`);
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
