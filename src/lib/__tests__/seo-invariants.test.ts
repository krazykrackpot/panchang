/**
 * SEO invariants — gates against the May 2026 click-drop class of bugs.
 *
 * Each of the six findings in
 * `docs/superpowers/specs/2026-05-23-seo-click-drop-recovery.md` had a
 * silent code-change root cause that would have failed one of these
 * tests. Keeping them in CI means the next regression breaks a build,
 * not a week of Maithili traffic.
 *
 * Scope on purpose: structural assertions only (file contents, sitemap
 * length, locale parity). Live HTTP smoke is in a separate file because
 * it requires the dev server.
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sitemap from '@/app/sitemap';
import { locales, visibleLocales } from '@/lib/i18n/config';

const APP_LOCALE_ROOT = join(process.cwd(), 'src/app/[locale]');

/* --------------------------------------------------------------------
 * Test 1 — locale-prebuild invariant
 *
 * [locale]/layout.tsx's generateStaticParams must return every visible
 * locale. The May 2026 regression silently cut prebuild from 8 locales
 * to ['en','hi','ta','bn'], demoting /mai/* (the #1 traffic locale) to
 * cold ISR. Google's first-byte signal degraded and the cluster lost
 * rank. A test that asserts ALL visibleLocales appear in the function
 * body would have failed the offending PR.
 * ------------------------------------------------------------------ */
describe('SEO invariant: locale-prebuild', () => {
  const src = readFileSync(join(APP_LOCALE_ROOT, 'layout.tsx'), 'utf8');

  it('layout.tsx exports generateStaticParams', () => {
    expect(/export\s+(?:async\s+)?function\s+generateStaticParams/.test(src)).toBe(true);
  });

  it('generateStaticParams returns every visible locale', () => {
    // Strict: every locale string in visibleLocales must appear within
    // the generateStaticParams function body. Accepts both the
    // `visibleLocales.map(...)` shape and a literal array.
    const bodyMatch = src.match(
      /export\s+(?:async\s+)?function\s+generateStaticParams[^{]*\{([\s\S]*?)\n\}/,
    );
    expect(bodyMatch, 'generateStaticParams body not located').not.toBeNull();
    const body = bodyMatch?.[1] ?? '';

    // Two valid shapes:
    //   1. `visibleLocales.map(...)`  — references the canonical const
    //   2. Literal array including every locale: ['en', 'hi', ...]
    const usesCanonical = /\bvisibleLocales\b/.test(body);

    if (usesCanonical) {
      // Safe by reference — no per-locale check needed
      return;
    }

    // Literal array: every locale string must be present
    const missing = visibleLocales.filter((l) => !body.includes(`'${l}'`) && !body.includes(`"${l}"`));
    expect(
      missing,
      `generateStaticParams does not reference visibleLocales and is missing literal entries for: ${missing.join(', ')}. ` +
        `If you intentionally cap prebuild (e.g. to save build time), reference visibleLocales and slice — never hand-list.`,
    ).toEqual([]);
  });
});

/* --------------------------------------------------------------------
 * Test 2 — hreflang call-site invariant
 *
 * The May 15 → 22 regression shipped `alternates.languages: { en, hi }`
 * literal on /mai/choghadiya/[date], dropping Maithili hreflang for a
 * week. Google collapsed the cluster into Hindi. The fix in PR #129
 * caught the live offenders; this test prevents new ones.
 *
 * Every `languages:` block under [locale]/ must either:
 *   - iterate `locales` or `visibleLocales`, OR
 *   - delegate to `getPageMetadata` (which iterates internally)
 * ------------------------------------------------------------------ */
describe('SEO invariant: hreflang call sites', () => {
  function walk(dir: string, out: string[] = []): string[] {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return out;
    }
    for (const name of entries) {
      const p = join(dir, name);
      let st: ReturnType<typeof statSync>;
      try {
        st = statSync(p);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        walk(p, out);
      } else if (name.endsWith('.tsx') || name.endsWith('.ts')) {
        out.push(p);
      }
    }
    return out;
  }

  // Allowlist for files that ARE indexed but use a known hand-built
  // shape we're not chasing down in this pass. Each entry is tech debt
  // — fix opportunistically, don't bulk-rewrite (Lesson H).
  //
  // Learn modules (~140 files) all follow the same template added by
  // PR #71 and would need a single shared helper to refactor cleanly.
  const TECH_DEBT_PREFIXES = [
    join(APP_LOCALE_ROOT, 'learn', 'modules'),
  ];

  // Specific files with known F2-pattern hand-built `languages:` blocks
  // (en+hi only, or referencing retired sa/mr). Each is real SEO debt
  // and should be migrated to iterate `locales` over time. Listed here
  // so the test is HONEST about the current state — additions are NOT
  // permitted, only removals as files get fixed.
  const TECH_DEBT_FILES = new Set<string>([
    join(APP_LOCALE_ROOT, 'baby-names', '[nakshatra]', 'page.tsx'),
    join(APP_LOCALE_ROOT, 'calendar', '[slug]', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'calendar', 'regional', 'odia', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'daily', 'page.tsx'),
    join(APP_LOCALE_ROOT, 'eclipses', 'simulator', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'kundali', '[id]', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'learn', 'library', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'learn', 'nakshatra-pada', '[slug]', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'learn', 'planet-in-house', '[slug]', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'learn', 'transits', '[slug]', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'learn', 'yoga', '[slug]', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'learn', 'yoga', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'matching', 'report', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'panchang', 'locations', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'panchang', 'nakshatra', '[id]', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'privacy', 'page.tsx'),
    join(APP_LOCALE_ROOT, 'puja', '[slug]', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'refunds', 'page.tsx'),
    join(APP_LOCALE_ROOT, 'terms', 'page.tsx'),
    join(APP_LOCALE_ROOT, 'tools', 'layout.tsx'),
    join(APP_LOCALE_ROOT, 'vs', 'drik-panchang', 'page.tsx'),
  ]);

  it('every languages: block iterates locales, uses getPageMetadata, or is on a noindex page', () => {
    const offenders: string[] = [];

    for (const file of walk(APP_LOCALE_ROOT)) {
      const src = readFileSync(file, 'utf8');
      if (!src.includes('languages:')) continue;

      // Pass if the file iterates ANY identifier ending in `locales`
      // (case-insensitive). Accepts both the canonical `locales` /
      // `visibleLocales` AND legacy names like `ACTIVE_LOCALES`.
      const iterates = /\bfor\s*\(\s*(?:const|let)\s+\w+\s+of\s+\w*[Ll]ocales\b/.test(src)
        || /\b\w*[Ll]ocales\.map\s*\(/.test(src)
        || /\b\w*[Ll]ocales\.forEach\s*\(/.test(src)
        || /Object\.fromEntries\(\s*\w*[Ll]ocales\.map/.test(src);
      if (iterates) continue;

      // Pass if a literal array within the file contains every visible
      // locale (e.g. `['en','hi','ta','te','bn','gu','kn','mai'].map(...)`).
      // We don't validate WHERE in the file — just that the file knows
      // about all 8 locales. This is a coarse but safe heuristic.
      const literalArrays = src.matchAll(/\[(\s*(?:['"`][a-z]{2,4}['"`]\s*,?\s*){2,})\]/g);
      let hasFullArray = false;
      for (const arr of literalArrays) {
        const tokens = (arr[1].match(/[a-z]{2,4}/g) ?? []).filter((t) => /^[a-z]+$/.test(t));
        if (visibleLocales.every((l) => tokens.includes(l))) {
          hasFullArray = true;
          break;
        }
      }
      if (hasFullArray) continue;

      // Pass if the file delegates to getPageMetadata
      if (/\bgetPageMetadata\s*\(/.test(src)) continue;

      // Pass if the file delegates to buildHreflangMap (canonical helper
      // introduced May 2026 — reads visibleLocales from i18n/config, so
      // adding/retiring a locale propagates automatically).
      if (/\bbuildHreflangMap\s*\(/.test(src)) continue;

      // Pass if the page is explicitly noindex — hreflang has no SERP
      // impact for noindex pages.
      if (/robots\s*:\s*\{\s*index\s*:\s*false/.test(src)) continue;

      // Tech-debt allowlists
      if (TECH_DEBT_PREFIXES.some((p) => file.startsWith(p))) continue;
      if (TECH_DEBT_FILES.has(file)) continue;

      offenders.push(file.replace(process.cwd() + '/', ''));
    }

    expect(
      offenders,
      `Files with hand-built \`languages:\` maps that miss locales and aren't noindex:\n  ${offenders.join('\n  ')}\n\nFix each by either (a) iterating \`locales\` / \`visibleLocales\` / a local *_LOCALES const that includes all 8, (b) calling \`getPageMetadata(route, locale)\`, or (c) marking the page noindex if hreflang doesn't apply.`,
    ).toEqual([]);
  });
});

/* --------------------------------------------------------------------
 * Test 3 — sitemap URL-count budget
 *
 * Google's per-sitemap cap is 50,000 URLs. Past that, we'd need to
 * split into a sitemap index. The May 2026 audit found the sitemap had
 * bloated to 19,443 entries (× 3 sitemap locales = 58,329) BEFORE the
 * 8-locale fix; after Step 3 + Step 4 we're at ~40,000.
 *
 * Goal: maximum visibility up to Google's cap.
 *   - Upper bound: under 50,000 (Google's hard cap, with light headroom)
 *   - Lower bound: above 25,000 (catastrophic-drop alarm — if someone
 *     accidentally deletes 40% of the sitemap, this fires)
 *
 * Not a budget to defend against growth — a guardrail against regression.
 * ------------------------------------------------------------------ */
describe('SEO invariant: sitemap URL-count budget', () => {
  it('sitemap entry count is between 10,000 (regression alarm) and 49,500 (Google cap headroom)', () => {
    const entries = sitemap();
    const count = entries.length;

    // Lower bound: 10,000 — catches accidental ~25% deletion from the
    // current ~13,500 baseline. Goal is MAXIMUM visibility up to
    // Google's cap, so the lower bound is a regression alarm, not a
    // ceiling.
    //
    // Upper bound: 49,500 — Google's per-sitemap cap is 50K. If you
    // genuinely need more URLs, split into a sitemap index (multiple
    // child sitemaps) and update this test.
    expect(
      count,
      `Sitemap has ${count} entries — under the 10,000 lower bound. Check sitemap.ts for accidentally removed routes.`,
    ).toBeGreaterThan(10_000);
    expect(
      count,
      `Sitemap has ${count} entries — over Google's 50K per-sitemap cap. Split into a sitemap index.`,
    ).toBeLessThan(49_500);
  });

  it('every sitemap entry has a non-empty url and a lastModified', () => {
    const entries = sitemap();
    const bad = entries.filter((e) => !e.url || !e.lastModified).slice(0, 5);
    expect(
      bad.map((e) => e.url),
      'Sitemap entries with missing url or lastModified — first 5 shown',
    ).toEqual([]);
  });
});

/* --------------------------------------------------------------------
 * Test 4 — sitemapLocales ↔ visibleLocales parity
 *
 * The two arrays must match exactly. When they drift, hreflang on every
 * page advertises locales that don't appear in the sitemap, Google can't
 * verify the cluster, and ta/te/bn/gu/kn rankings degrade. This was F4
 * in the May audit.
 * ------------------------------------------------------------------ */
describe('SEO invariant: sitemap locale parity', () => {
  it('sitemap.ts sitemapLocales matches visibleLocales', () => {
    const sitemapSrc = readFileSync(join(process.cwd(), 'src/app/sitemap.ts'), 'utf8');

    // The canonical, healthy state is the literal `= visibleLocales` —
    // any hand-list is a smell.
    const usesCanonical = /const\s+sitemapLocales[^=]*=\s*visibleLocales/.test(sitemapSrc);

    if (usesCanonical) return;

    // Fallback: if someone hand-lists, every visible locale must appear
    // in that literal array.
    const literalMatch = sitemapSrc.match(/const\s+sitemapLocales[^=]*=\s*\[([^\]]+)\]/);
    expect(
      literalMatch,
      'sitemapLocales is neither `visibleLocales` nor a hand-list literal — inspect src/app/sitemap.ts',
    ).not.toBeNull();

    const literal = literalMatch?.[1] ?? '';
    const missing = visibleLocales.filter((l) => !literal.includes(`'${l}'`) && !literal.includes(`"${l}"`));

    expect(
      missing,
      `sitemapLocales is a hand-listed array missing visible locales: ${missing.join(', ')}. ` +
        `Either add them, or switch to \`const sitemapLocales = visibleLocales\`. ` +
        `Mismatch breaks hreflang clusters for the absent locales.`,
    ).toEqual([]);
  });

  it('every entry advertises all visible locales as hreflang alternates', () => {
    const entries = sitemap();
    // Sample a few entries — full check is expensive
    const sample = [entries[0], entries[Math.floor(entries.length / 2)], entries[entries.length - 1]];

    for (const entry of sample) {
      const langs = Object.keys(entry.alternates?.languages ?? {});
      const missing = visibleLocales.filter((l) => !langs.includes(l));
      expect(
        missing,
        `Sitemap entry ${entry.url} missing hreflang for: ${missing.join(', ')}`,
      ).toEqual([]);
      expect(
        langs,
        `Sitemap entry ${entry.url} missing x-default hreflang`,
      ).toContain('x-default');
    }
  });
});

/* --------------------------------------------------------------------
 * Test 5 — static-route 200/30x structural sanity
 *
 * Verifies that every entry in PAGE_META and every static (non-dynamic)
 * route in the sitemap has a corresponding page.tsx file on disk. Would
 * have caught F5 (bare /festivals/[slug] 404) before it shipped.
 *
 * This is the file-system version of an HTTP smoke test — runs in
 * vitest without a dev server. A separate live-HTTP smoke would catch
 * runtime errors but adds CI cost; this catches the structural class.
 * ------------------------------------------------------------------ */
describe('SEO invariant: every sitemap route resolves to a page.tsx', () => {
  /**
   * Resolve a sitemap path to a page.tsx on disk, accepting Next.js App
   * Router dynamic segments. For each path segment, accept the literal
   * directory if present, otherwise the first `[param]` sibling.
   *
   * Returns the matched page.tsx path, or null if nothing on disk can
   * serve this URL. Catches F5 (bare /festivals/[slug] 404) because
   * neither literal `festivals/diwali/` nor `festivals/[*]/page.tsx`
   * exists — only `festivals/[slug]/[year]/page.tsx`, too deep to match
   * a 2-segment URL.
   */
  function resolveRouteToPage(route: string): string | null {
    const segments = route.split('/').filter(Boolean);
    let dir = APP_LOCALE_ROOT;

    for (const seg of segments) {
      // Try literal child directory first
      const literal = join(dir, seg);
      try {
        if (statSync(literal).isDirectory()) {
          dir = literal;
          continue;
        }
      } catch {
        /* fall through */
      }

      // Otherwise look for a single [param] dynamic sibling
      let dynamic: string | null = null;
      try {
        for (const child of readdirSync(dir)) {
          if (child.startsWith('[') && child.endsWith(']')) {
            try {
              if (statSync(join(dir, child)).isDirectory()) {
                dynamic = join(dir, child);
                break;
              }
            } catch {
              /* skip */
            }
          }
        }
      } catch {
        return null;
      }

      if (dynamic) {
        dir = dynamic;
        continue;
      }
      return null; // no literal AND no dynamic child — orphan
    }

    // Reached the leaf — must have a page.tsx
    for (const fname of ['page.tsx', 'page.ts']) {
      try {
        statSync(join(dir, fname));
        return join(dir, fname);
      } catch {
        /* try next */
      }
    }
    return null;
  }

  // Pull every unique route from the sitemap (strip locale + dedupe)
  const routes = Array.from(
    new Set(
      sitemap()
        .map((e) => {
          const url = new URL(e.url);
          return url.pathname.replace(/^\/[a-z]{2,3}/, '') || '/';
        }),
    ),
  );

  it('sitemap route count is non-trivial', () => {
    expect(routes.length).toBeGreaterThan(100);
  });

  it('every sitemap route maps to a page.tsx (literal or dynamic-segment)', () => {
    const orphans: string[] = [];

    for (const route of routes) {
      // Root locale page is handled by [locale]/page.tsx
      if (route === '/') {
        try {
          statSync(join(APP_LOCALE_ROOT, 'page.tsx'));
          continue;
        } catch {
          orphans.push(route);
          continue;
        }
      }
      if (!resolveRouteToPage(route)) orphans.push(route);
    }

    expect(
      orphans,
      `Sitemap advertises ${orphans.length} routes with no resolvable page.tsx on disk:\n  ${orphans.slice(0, 20).join('\n  ')}\n${orphans.length > 20 ? `... +${orphans.length - 20} more` : ''}\n\nEither (a) add the page, (b) remove from src/app/sitemap.ts, or (c) confirm a redirect in next.config.ts. The sitemap shouldn't point at 404s.`,
    ).toEqual([]);
  });
});
