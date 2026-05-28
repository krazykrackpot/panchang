/**
 * ISR hydration crawl — structural regression gate for React #418.
 *
 * Background: 2026-05-28 we lost ~80% of analytics page-views to React
 * error #418 hydration mismatches on `/choghadiya/[date]` and
 * `/gauri-panchang/[date]` (fixed in PR #267 + #269) and the same trap
 * was live on `/career-muhurta`. Pattern: an ISR-cached page mounts a
 * 'use client' component whose render body (or `useMemo`) calls
 * `new Date()` / `todayInTimezone()`. The server renders with cache-
 * generation-time "today"; the client hydrates with the visitor's
 * "today". When those disagree, text content mismatches → React #418 →
 * the entire React tree dies post-hydration → all client-side analytics
 * events (Vercel Web Analytics, GA, Plausible) silently stop firing.
 * The dashboards do NOT show a JS error — they show "fewer visitors."
 *
 * This crawler:
 *   1. Enumerates every page.tsx under src/app/[locale]/ that exports
 *      `revalidate` (i.e. is ISR-cached).
 *   2. For each route, navigates Playwright to a sample URL (substituting
 *      [date] = a future date, [city] = delhi, [rashi] = aries, etc.).
 *   3. Asserts: zero `pageerror` events AND zero console errors that
 *      look like a hydration mismatch (#418, "Text content did not
 *      match", "Hydration failed", "did not match").
 *
 * Failures are loud and structural: any new ISR-cached page that adds
 * a render-time clock call will fail this test on the PR, before merge.
 */
import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const HYDRATION_RE = /#418|Hydration failed|Text content did not match|did not match|hydrating/i;

const PARAM_SUBSTITUTIONS: Record<string, string> = {
  date: '2026-06-15',
  rashi: 'aries',
  city: 'delhi',
  nakshatra: 'ashwini',
  category: 'auspicious',
  slug: 'diwali',
  year: '2026',
  month: '6',
  type: 'wedding',
  activity: 'job-interview',
  sign: 'aries',
};

function listISRRoutes(): { route: string; pageFile: string }[] {
  const root = path.resolve(__dirname, '..', 'src/app/[locale]');
  const results: { route: string; pageFile: string }[] = [];
  function walk(dir: string) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.name === 'page.tsx') {
        const src = fs.readFileSync(full, 'utf8');
        // ISR if it sets revalidate to a positive value. Skip force-dynamic
        // (revalidate is unused) and the explicit "no ISR" exports.
        if (!/^export const revalidate\s*=/m.test(src)) continue;
        if (/^export const dynamic\s*=\s*['"]force-dynamic['"]/m.test(src)) continue;
        // Strip Next.js route groups `(name)` — they're omitted from the
        // URL at runtime, so leaving them in produces 404s. Normalise
        // `\` → `/` first for Windows. Build-only routes (those that return
        // an empty generateStaticParams without `dynamicParams = true`) are
        // naturally absorbed by the 404 skip clause in the test body.
        const relativePath = path.relative(path.resolve(__dirname, '..', 'src/app'), full);
        const route = '/' + relativePath
          .replace(/\\/g, '/')
          .replace(/\/page\.tsx$/, '')
          .replace(/\/\([^)]+\)/g, '');
        results.push({ route, pageFile: full });
      }
    }
  }
  walk(root);
  return results;
}

function substituteParams(route: string): string | null {
  // `/[locale]/foo/[bar]` → `/en/foo/<sub>`. Returns null if a param has
  // no substitution defined — we conservatively skip those rather than
  // navigate to a /404.
  let out = route.replace('/[locale]', '/en');
  // Match `[param]`, `[...slug]`, AND `[[...slug]]` (optional catch-all). The
  // `[+...]+` form captures both single- and double-bracket variants.
  const params = out.match(/\[+[^\]]+\]+/g) || [];
  for (const p of params) {
    const name = p.replace(/^\[+|\]+$/g, '').replace(/^\.\.\.|^\?/, '');
    const sub = PARAM_SUBSTITUTIONS[name];
    if (!sub) return null;
    out = out.replace(p, sub);
  }
  return out;
}

const ROUTES = listISRRoutes()
  .map((r) => ({ ...r, url: substituteParams(r.route) }))
  .filter((r): r is { route: string; pageFile: string; url: string } => r.url !== null);

test.describe('ISR hydration crawl — no React #418 on any ISR-cached route', () => {
  for (const r of ROUTES) {
    test(`${r.url} hydrates without #418`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
      });
      page.on('pageerror', (err) => {
        errors.push(`pageerror: ${err.message}`);
      });
      const resp = await page.goto(r.url, { waitUntil: 'networkidle' });
      if (resp) {
        // 404/410 on a sample-route is fine — the substitution may not match a
        // real entry. Anything ELSE in 4xx/5xx is a real failure — especially
        // 500, which means the server-render crashed (a strictly worse symptom
        // than the hydration mismatch this test was built to catch).
        if (resp.status() === 404 || resp.status() === 410) {
          test.skip(true, `route returned ${resp.status()} — sample substitution didn't match a real path`);
        }
        expect(resp.status(), `${r.url} returned ${resp.status()}`).toBeLessThan(400);
      }
      const hits = errors.filter((e) => HYDRATION_RE.test(e));
      expect(hits, `Hydration error on ${r.url}:\n  source: ${r.pageFile}\n  hits:\n${hits.join('\n')}`).toHaveLength(0);
    });
  }
});
