/**
 * Static-page budget lock.
 *
 * CLAUDE.md "Static Page Budget" mandates that the routes below either
 * return [] from generateStaticParams (delegate fully to ISR) or seed a
 * small bounded list. Vercel builds OOM around ~2,000 static pages, and
 * past PR merges have reverted these to defaults at least three times.
 *
 * This test enforces the cap so a future regression breaks CI instead of
 * production.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROUTE_RULES: ReadonlyArray<{
  /** Path under src/app/[locale]/ */
  route: string;
  /** Max param objects allowed from generateStaticParams. 0 means must return []. */
  maxParams: number;
  /** Why we cap here. */
  reason: string;
}> = [
  {
    route: 'horoscope/[rashi]/[date]',
    maxParams: 0,
    reason: 'Dates are infinite — ISR only.',
  },
  {
    route: 'horoscope/[rashi]/weekly',
    maxParams: 0,
    reason: 'Weekly revalidates — ISR only.',
  },
  {
    route: 'horoscope/[rashi]/monthly',
    maxParams: 0,
    reason: 'Monthly revalidates — ISR only.',
  },
  {
    route: 'calendar/[slug]',
    maxParams: 0,
    reason: 'Festival slugs use ISR.',
  },
  {
    route: 'panchang/[city]',
    maxParams: 0,
    reason: '800+ cities — ISR only, sitemap handles tier-1+2 discovery.',
  },
  {
    route: 'choghadiya/[date]',
    // Currently seeds a small forward window (-7 to +30 days). Bounded.
    maxParams: 60,
    reason: 'Forward-window seed for current/upcoming choghadiya queries.',
  },
  {
    route: 'career-muhurta/[activity]',
    // Exactly the 8 career activity slugs — never grows beyond the
    // CAREER_ACTIVITY_IDS array. Set the cap to 10 to allow a couple of
    // additions before requiring an audit.
    maxParams: 10,
    reason: 'One static landing per career activity (8 in Phase 1).',
  },
  {
    route: 'muhurta/[type]/[year]/[month]/[city]',
    // 10 activities × 2 years × 3 months × top 5 cities = 300 — but actual
    // implementation prebuilds only a handful. Cap is generous.
    maxParams: 400,
    reason: 'Activity × month × city — bounded seed; rest via ISR.',
  },
  {
    route: 'festivals/[slug]/[year]',
    maxParams: 30,
    reason: 'Top festivals × 2 years pre-rendered for SEO; rest ISR.',
  },
  {
    route: 'festivals/[slug]/[year]/[city]',
    maxParams: 100,
    reason: 'Top festivals × top cities pre-rendered; rest ISR.',
  },
];

const APP_LOCALE_ROOT = join(process.cwd(), 'src/app/[locale]');

/**
 * Spawn a Node child that imports the page module, calls
 * generateStaticParams(), and prints the array length. We can't `await
 * import()` directly inside vitest for these files because they pull in
 * the full Next runtime — but a static AST sanity check catches the
 * regressions we actually saw (someone deletes the empty-return).
 */
function readPageSource(route: string): string {
  const path = join(APP_LOCALE_ROOT, route, 'page.tsx');
  expect(existsSync(path), `page.tsx missing for ${route}`).toBe(true);
  return readFileSync(path, 'utf8');
}

describe('Static page budget', () => {
  it.each(ROUTE_RULES)('$route — generateStaticParams stays within budget', ({ route, maxParams, reason }) => {
    const src = readPageSource(route);

    // No generateStaticParams export — Next.js defaults to "no params
    // pre-rendered", which is what we want. Pass.
    if (!/export\s+(async\s+)?function\s+generateStaticParams/.test(src)) {
      return;
    }

    // generateStaticParams exists. For maxParams === 0 routes, the body
    // MUST return [] (no seeding allowed).
    if (maxParams === 0) {
      // Strict check: function body should literally `return []`.
      const exportPattern = /export\s+(?:async\s+)?function\s+generateStaticParams[^{]*\{([\s\S]*?)\n\}/;
      const match = src.match(exportPattern);
      expect(
        match,
        `${route}: could not locate generateStaticParams body`,
      ).not.toBeNull();
      const body = match?.[1] ?? '';

      expect(
        /return\s+\[\s*\]/.test(body),
        `${route}: must return [] from generateStaticParams (${reason}). Found body:\n${body.slice(0, 200)}`,
      ).toBe(true);
      return;
    }

    // maxParams > 0 routes — the page has seeded prerendering. We can't
    // easily count without executing, so we instead enforce that the seed
    // arrays in the source are small. Find numeric literals on `.slice(`,
    // `for (let i = ...; i < N; ...)`, and similar.
    //
    // Heuristic: collect every numeric literal inside the function body
    // and assert the max is below 2× budget. Catches "someone bumped
    // top-5 to top-50" without false positives on small constants.
    const bodyMatch = src.match(/export\s+(?:async\s+)?function\s+generateStaticParams[^{]*\{([\s\S]*?)\n\}/);
    expect(bodyMatch, `${route}: could not locate generateStaticParams body`).not.toBeNull();
    const body = bodyMatch?.[1] ?? '';

    // Filter out year-like literals (>= 1990 < 2100) — they're calendar
    // years, not seed sizes. We only care about loop counts, slice() args,
    // and array lengths.
    const numbers = (body.match(/\b\d+\b/g) ?? [])
      .map(Number)
      .filter((n) => n < 1990 || n >= 2100);
    const maxLiteral = numbers.length ? Math.max(...numbers) : 0;

    expect(
      maxLiteral,
      `${route}: a numeric literal of ${maxLiteral} exceeds the 2× budget cap of ${maxParams * 2} — review the seed in generateStaticParams. Reason for the cap: ${reason}`,
    ).toBeLessThanOrEqual(maxParams * 2);
  });
});
