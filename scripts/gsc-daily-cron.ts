/* eslint-disable no-console */
/**
 * GSC daily indexing-request cron — rotates through a pool of ~40 URLs
 * and submits a quota-bounded batch each day. Google's Request Indexing
 * affordance lives only in the UI (the URL Inspection API is read-only;
 * the Indexing API is restricted to JobPosting + BroadcastEvent), so
 * the cron drives a real Chromium session via Playwright using the
 * persistent auth profile at /tmp/playwright-gsc-profile.
 *
 * Why a cron instead of one-off ad-hoc submissions:
 *   - Google's UI cap is ~8 priority-crawl requests per property per
 *     24h (confirmed empirically 2026-06-01; previously documented as
 *     10/day). With 8 slots/day and a 40-URL pool, each URL gets
 *     re-pinged roughly every 5 days — frequent enough to keep
 *     Marathi / Maithili content under Google's "recently changed"
 *     classifier without exhausting quota.
 *   - The Marathi grammar fix (PR #329, 2026-06-01) needs URLs that
 *     were crawled WITH the bad `का` grammar to be re-crawled with the
 *     new `चे` grammar. Without an active push, Google's natural crawl
 *     can take weeks. Manual pushes don't scale.
 *
 * Pool composition (40 URLs):
 *   - 16 mr (40% — Marathi traffic was the hit locale)
 *   - 12 mai (30% — #1 traffic driver per `feedback_four_locales`)
 *   - 8 hi (20%)
 *   - 4 en (10%)
 *   - Within each locale: rolling date URLs (today, today+1, today+2)
 *     for /panchang/date/{date} and /choghadiya/{date}, plus evergreen
 *     /panchang, /kundali, /horoscope, /matching.
 *
 * Selection: history-aware. Each URL has a list of past submission
 * timestamps. Pick the 8 URLs whose most-recent submission is OLDEST
 * (never-submitted = -Infinity). Within identical submission ages, the
 * locale weight breaks the tie.
 *
 * State file: scripts/gsc-rotation-state.json. Commit-safe — the
 * history is small and is rebuilt deterministically by future runs.
 *
 * Run:
 *   npx tsx scripts/gsc-daily-cron.ts             # default: headed
 *   npx tsx scripts/gsc-daily-cron.ts --dry-run   # print plan, no submits
 *
 * launchd: see scripts/gsc-daily-cron.plist.template for the macOS
 * agent that runs this at 08:00 CEST daily (06:00 UTC, fresh quota).
 */

import { chromium, type BrowserContext, type Page } from 'playwright';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ────────────────────────────────────────────────────────────────────
// Config
// ────────────────────────────────────────────────────────────────────

const PROPERTY = 'sc-domain%3Adekhopanchang.com';
const PROFILE_DIR = '/tmp/playwright-gsc-profile';
const STATE_PATH = path.resolve(__dirname, 'gsc-rotation-state.json');
const LOG_PATH = path.resolve(__dirname, 'gsc-daily-cron.log');
const LOCK_PATH = path.resolve(__dirname, '.gsc-daily-cron.lock');
// Lock is considered stale (and force-released) after 30 min. Real
// runs finish in 5-10 min; anything over 30 min is a crashed process.
const STALE_LOCK_MS = 30 * 60 * 1000;

const DAILY_QUOTA = 8;
const POLITE_DELAY_MS = 3000;

// Locale priority per `feedback_four_locales` — mai is the #1 traffic
// driver; mr restored May 2026 and took the duplicate-content hit; en/hi
// share is smaller but still material. The pool itself is uniform (10
// URLs per locale) — the weight only breaks ties when multiple URLs
// have the same last-submission timestamp. So on day 1 (all URLs
// never-submitted), the 8 picks are all-mr. Day 2 finishes the mr
// long tail and starts mai.
//
// Rotation behaviour:
//  - The 16 evergreen URLs (/<locale>/{panchang,kundali,horoscope,matching})
//    cycle every ~2-3 days under 8-per-day quota.
//  - The 24 date-rolling URLs only stay in the pool for their 3-day
//    window (today, +1, +2) and then naturally fall out — each date
//    gets at most one submission attempt during its window. This is
//    the desired behaviour: re-pinging a date URL for yesterday is
//    wasted quota; today's URL is the fresh one.
export const LOCALES_BY_WEIGHT: ReadonlyArray<{ code: string; weight: number }> = [
  { code: 'mr', weight: 40 },
  { code: 'mai', weight: 30 },
  { code: 'hi', weight: 20 },
  { code: 'en', weight: 10 },
];

// Evergreen routes — pages whose content doesn't depend on URL date.
const EVERGREEN_ROUTES = ['panchang', 'kundali', 'horoscope', 'matching'] as const;

// Date-rolling routes — paired with a date segment. Index 0..N rolls
// from today forward. 3 days × 2 routes = 6 date URLs per locale.
const DATE_ROUTES: ReadonlyArray<{ template: (date: string) => string }> = [
  { template: (date) => `panchang/date/${date}` },
  { template: (date) => `choghadiya/${date}` },
];

const DATE_OFFSETS = [0, 1, 2] as const;

// ────────────────────────────────────────────────────────────────────
// Pure helpers (exported for tests)
// ────────────────────────────────────────────────────────────────────

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function isoDateUtc(offsetDays: number, now: Date = new Date()): string {
  const d = new Date(now);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export interface PoolEntry {
  url: string;
  locale: string;
  weight: number;
  category: 'date' | 'evergreen';
}

/**
 * Build today's candidate URL pool. The pool is regenerated every run
 * so date-rolling URLs always reflect the current week. Returns ~40
 * entries; exact count depends on how the share/route tables intersect.
 */
export function buildPool(now: Date = new Date()): PoolEntry[] {
  const pool: PoolEntry[] = [];
  for (const { code, weight } of LOCALES_BY_WEIGHT) {
    for (const offset of DATE_OFFSETS) {
      const date = isoDateUtc(offset, now);
      for (const route of DATE_ROUTES) {
        pool.push({
          url: `https://dekhopanchang.com/${code}/${route.template(date)}`,
          locale: code,
          weight,
          category: 'date',
        });
      }
    }
    for (const route of EVERGREEN_ROUTES) {
      pool.push({
        url: `https://dekhopanchang.com/${code}/${route}`,
        locale: code,
        weight,
        category: 'evergreen',
      });
    }
  }
  return pool;
}

export interface State {
  history: Record<string, string[]>; // url → ISO timestamps (oldest first)
}

const EPOCH = '1970-01-01T00:00:00Z';

/**
 * Pick the next batch of URLs to submit. Sort by (lastSubmittedAt asc,
 * weight desc). Never-submitted entries sort to the top via the EPOCH
 * sentinel. Within identical timestamps the higher-weighted locale
 * wins, so a Marathi never-submitted URL beats an English never-submitted
 * URL.
 */
export function pickTargets(
  pool: PoolEntry[],
  history: Record<string, string[]>,
  quota: number,
): PoolEntry[] {
  const annotated = pool.map((p) => {
    const ts = history[p.url];
    const lastAt = ts && ts.length > 0 ? ts[ts.length - 1] : EPOCH;
    return { entry: p, lastAt };
  });
  annotated.sort((a, b) => {
    if (a.lastAt !== b.lastAt) return a.lastAt < b.lastAt ? -1 : 1;
    return b.entry.weight - a.entry.weight;
  });
  return annotated.slice(0, quota).map((a) => a.entry);
}

export function loadState(file: string = STATE_PATH): State {
  if (!fs.existsSync(file)) return { history: {} };
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as Partial<State>;
    return { history: raw.history ?? {} };
  } catch (err) {
    console.error(`[gsc-cron] state file unreadable: ${err}. Starting fresh.`);
    return { history: {} };
  }
}

export function saveState(state: State, file: string = STATE_PATH): void {
  // Atomic write — fs.rename is POSIX-atomic, so a crash between the
  // tmp write and the rename leaves the old state intact rather than a
  // truncated JSON file. Losing the most recent submission timestamps
  // is acceptable; losing the entire rotation history (and thus
  // re-submitting URLs Google has already seen) is not.
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  fs.renameSync(tmp, file);
}

/**
 * Best-effort single-instance lock. Refuses to start if another run is
 * in progress (fresh lockfile). A lockfile older than STALE_LOCK_MS is
 * assumed to come from a crashed process and is force-released.
 *
 * Why we care: launchd can fire while a manual run is open, or two
 * launchd agents could collide if the plist is loaded twice. Two
 * Chromium instances sharing /tmp/playwright-gsc-profile corrupts the
 * profile and forces a re-login.
 */
export function acquireLock(lockPath: string = LOCK_PATH, now: number = Date.now()): boolean {
  if (fs.existsSync(lockPath)) {
    const ageMs = now - fs.statSync(lockPath).mtimeMs;
    if (ageMs < STALE_LOCK_MS) return false;
    fs.unlinkSync(lockPath);
  }
  fs.writeFileSync(lockPath, String(process.pid));
  return true;
}

export function releaseLock(lockPath: string = LOCK_PATH): void {
  try {
    fs.unlinkSync(lockPath);
  } catch {
    // Lock already gone — nothing to do. Logging would be noise.
  }
}

export function recordSubmission(state: State, url: string, at: string = new Date().toISOString()): void {
  if (!state.history[url]) state.history[url] = [];
  state.history[url].push(at);
}

// ────────────────────────────────────────────────────────────────────
// Logging
// ────────────────────────────────────────────────────────────────────

function logLine(line: string): void {
  const ts = new Date().toISOString();
  const msg = `[${ts}] ${line}\n`;
  try {
    fs.appendFileSync(LOG_PATH, msg);
  } catch {
    // best-effort — also write to stdout below
  }
  process.stdout.write(msg);
}

// ────────────────────────────────────────────────────────────────────
// Playwright submission
// ────────────────────────────────────────────────────────────────────

type SubmitOutcome = 'requested' | 'quota' | 'no-button' | 'no-confirmation' | 'error';

/**
 * Drive the GSC URL Inspection panel for one URL. Returns the outcome
 * as a discriminated string. The Playwright session is reused across
 * URLs — we type into the same inspection bar each time.
 */
async function submit(page: Page, url: string): Promise<SubmitOutcome> {
  const input = page.locator('input[aria-label="Inspect any URL in dekhopanchang.com"]');
  await input.fill(url);
  await input.press('Enter');

  // The page navigates to /search-console/inspect?id=...; wait for the
  // Request indexing affordance to render. Slow non-indexed URLs run a
  // live test server-side and can take 60-180s before the button shows.
  const result = await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    type AnyEl = HTMLElement;
    const findRequestBtn = (): AnyEl | undefined =>
      Array.from(document.querySelectorAll('button, [role="button"]'))
        .find((b) => (b as AnyEl).offsetParent !== null && /^Request indexing/i.test((b.textContent || '').trim())) as AnyEl | undefined;

    let btn: AnyEl | undefined;
    for (let i = 0; i < 180; i++) {
      btn = findRequestBtn();
      if (btn) break;
      await sleep(1000);
    }
    if (!btn) return 'no-button';
    btn.click();

    // After click, either an "Indexing requested" dialog or a "Quota
    // exceeded" dialog appears. Indexed URLs confirm within ~5s;
    // non-indexed URLs run a live fetch that can take up to 2 min.
    for (let i = 0; i < 120; i++) {
      const dlg = Array.from(document.querySelectorAll('[role="dialog"]'))
        .find(
          (d) =>
            (d as AnyEl).offsetParent !== null &&
            (d.getAttribute('aria-label') === 'Indexing requested' || /Indexing requested/i.test(d.textContent || '')),
        ) as AnyEl | undefined;
      if (dlg) {
        const dismiss = Array.from(dlg.querySelectorAll('button, [role="button"]'))
          .find((b) => /^(Dismiss|Got it|Close|OK)$/i.test((b.textContent || '').trim())) as AnyEl | undefined;
        if (dismiss) dismiss.click();
        return 'requested';
      }
      const errDlg = Array.from(document.querySelectorAll('[role="dialog"], [role="alertdialog"]'))
        .find((d) => (d as AnyEl).offsetParent !== null && /quota|cannot be processed|try again later|temporarily unavailable|too many/i.test(d.textContent || '')) as AnyEl | undefined;
      if (errDlg) {
        const dismiss = Array.from(errDlg.querySelectorAll('button, [role="button"]'))
          .find((b) => /^(Dismiss|Got it|Close|OK)$/i.test((b.textContent || '').trim())) as AnyEl | undefined;
        if (dismiss) dismiss.click();
        return 'quota';
      }
      await sleep(1000);
    }
    return 'no-confirmation';
  });

  return result as SubmitOutcome;
}

async function isLoggedIn(page: Page): Promise<boolean> {
  if (page.url().includes('accounts.google.com')) return false;
  try {
    await page.locator('input[aria-label*="Inspect" i]').first().waitFor({ timeout: 8000 });
    return true;
  } catch {
    return false;
  }
}

// ────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────

async function main(): Promise<number> {
  const dryRun = process.argv.includes('--dry-run');
  if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });

  logLine('--- daily run start ---');

  // Dry runs skip the lock — they're read-only and a debugging tool.
  if (!dryRun && !acquireLock()) {
    logLine(`Another run already in progress (lock at ${LOCK_PATH}). Exiting.`);
    return 3;
  }

  // Outer try guarantees lock release no matter where we exit/throw
  // between acquire and the inner browser-context section.
  try {
    const state = loadState();
    const pool = buildPool();
    const targets = pickTargets(pool, state.history, DAILY_QUOTA);

    const byLocale = pool.reduce<Record<string, number>>((a, p) => {
      a[p.locale] = (a[p.locale] ?? 0) + 1;
      return a;
    }, {});
    logLine(`Pool: ${pool.length} URLs (${Object.entries(byLocale).map(([c, n]) => `${c}=${n}`).join(' ')}). Quota: ${DAILY_QUOTA}.`);
    for (const t of targets) {
      const last = (state.history[t.url] || []).slice(-1)[0] || 'never';
      logLine(`  target ${t.locale.padEnd(4)} ${t.category.padEnd(9)} last=${last} ${t.url}`);
    }

    if (dryRun) {
      logLine('Dry run — exiting without submission.');
      return 0;
    }

    const ctx: BrowserContext = await chromium.launchPersistentContext(PROFILE_DIR, {
      headless: false,
      viewport: { width: 1400, height: 900 },
      args: ['--disable-blink-features=AutomationControlled'],
    });

    // Polyfill `__name` in browser context. tsx (the runner) transpiles
    // any closure passed to `page.evaluate(...)` through esbuild with
    // `keepNames: true`, which inlines `__name(fn, "name")` calls
    // around every function declaration to preserve `.name` for stack
    // traces. esbuild's emitted helper lives at the top of the *module*,
    // not the function source — so once Playwright serialises the
    // closure via `Function.prototype.toString()` and ships it into
    // the page, the browser executes a body that references `__name`
    // with nothing to call. Result: `ReferenceError: __name is not
    // defined` on every evaluate. Observed 2026-06-03 when the first
    // real run of this cron submitted 0 URLs across 8 attempts (memory
    // flagged PR #339 as "needs refactor before cron is reliable" —
    // this is the manifestation).
    //
    // The polyfill matches esbuild's runtime behaviour (`__name`
    // returns its first argument) so existing call sites continue to
    // work. Passed as a string (not a function) so tsx's own
    // transformation can't re-introduce the very `__name` reference
    // we're polyfilling. addInitScript runs on every navigation and
    // every new frame within the context, covering the whole session.
    await ctx.addInitScript('window.__name = (fn) => fn;');

    const page = ctx.pages()[0] ?? (await ctx.newPage());

    try {
      await page.goto(`https://search.google.com/search-console?resource_id=${PROPERTY}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });

      if (!(await isLoggedIn(page))) {
        logLine('NOT LOGGED IN — Google session expired in persistent profile.');
        logLine('Recover (one-time): run this script from a terminal — the visible');
        logLine('Chromium window lands on Google sign-in. Log in there, wait for the');
        logLine('GSC dashboard to load, then close the window. Tomorrow\'s cron run');
        logLine('picks up the refreshed cookies automatically.');
        logLine('  $ cd ' + process.cwd());
        logLine('  $ npx tsx scripts/gsc-daily-cron.ts');
        return 2;
      }
      logLine('Logged in. Starting submissions.');

      let successCount = 0;
      let quotaHit = false;
      for (const target of targets) {
        logLine(`Submit ${target.url}`);
        try {
          const outcome = await submit(page, target.url);
          logLine(`  → ${outcome}`);
          recordSubmission(state, target.url);
          if (outcome === 'requested') successCount += 1;
          if (outcome === 'quota') {
            quotaHit = true;
            logLine('Quota exceeded — stopping batch.');
            break;
          }
          await page.waitForTimeout(POLITE_DELAY_MS);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          logLine(`  → ERROR: ${msg}`);
        }
      }

      logLine(`Run complete. requested=${successCount} quota-hit=${quotaHit} attempted=${targets.length}.`);
      return successCount > 0 ? 0 : 1;
    } finally {
      saveState(state);
      logLine('State saved.');
      await ctx.close();
    }
  } finally {
    if (!dryRun) releaseLock();
    logLine('--- daily run end ---');
  }
}

// Run main only when invoked as a script. Importing from tests skips it.
if (require.main === module) {
  main()
    .then((code) => process.exit(code))
    .catch((err) => {
      logLine(`FATAL: ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
      process.exit(1);
    });
}
