import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Source-level invariants pinning down the 2026-06-01 SEO hotfix.
 *
 * These guard the three template files where Marathi was falling
 * through to Hindi-grammar titles (`/mr/panchang/date/...`,
 * `/mr/choghadiya/...`, `/mr/horoscope/.../...`) and the sitemap entry
 * helper that was emitting `BUILD_NOW` for every date-based URL.
 *
 * The tests are intentionally string-grep style — the route-level
 * `generateMetadata` functions are awkward to invoke from vitest
 * (they pull next-intl request context, server-only modules, etc.).
 * Greps prove the contract held.
 */

function read(rel: string): string {
  return readFileSync(join(process.cwd(), rel), 'utf8');
}

describe('SEO hotfix 2026-06-01 — exhaustive locale dispatch + sitemap freshness', () => {
  // Post-2026-06-02 architecture: the per-locale title / description /
  // keywords moved from inline ternaries in each template into the
  // exhaustive `panchang/choghadiya/horoscopeDateSeo()` helpers in
  // `src/lib/seo/date-page-seo.ts`. The templates now just call those
  // helpers. The Marathi-grammar invariants are now asserted against
  // the helper module — see also `src/lib/seo/__tests__/date-page-seo.test.ts`
  // for the pairwise-distinct-titles regression.

  describe('panchang/date/[date] metadata uses the exhaustive helper', () => {
    const src = read('src/app/[locale]/panchang/date/[date]/page.tsx');

    it('imports panchangDateSeo from @/lib/seo/date-page-seo', () => {
      expect(src).toMatch(/import\s+\{[^}]*panchangDateSeo[^}]*\}\s+from\s+['"]@\/lib\/seo\/date-page-seo['"]/);
    });

    it('calls panchangDateSeo(...) inside generateMetadata — no inline ternary cascade', () => {
      expect(src).toMatch(/panchangDateSeo\(\s*\{[\s\S]{0,200}locale:\s*locale\s+as\s+Locale[\s\S]{0,100}humanDate[\s\S]{0,100}\}\s*\)/);
      // The old ternary must be gone — no more `isHi ? hindi : english`
      // in the title construction.
      expect(src).not.toMatch(/title\s*=\s*locale\s*===\s*['"]mr['"]\s*\?\s*`[^`]*पंचांग/);
    });

    it('still emits robots: noindex when isSuppressedSeoLocale(locale)', () => {
      expect(src).toMatch(/isSuppressedSeoLocale/);
      expect(src).toMatch(/robots:\s*noindex\s*\?\s*\{\s*index:\s*false/);
    });
  });

  describe('choghadiya/[date] metadata uses the exhaustive helper', () => {
    const src = read('src/app/[locale]/choghadiya/[date]/page.tsx');

    it('imports choghadiyaDateSeo from @/lib/seo/date-page-seo', () => {
      expect(src).toMatch(/import\s+\{[^}]*choghadiyaDateSeo[^}]*\}\s+from\s+['"]@\/lib\/seo\/date-page-seo['"]/);
    });

    it('calls choghadiyaDateSeo(...) — no inline locale === "mr" title branch', () => {
      expect(src).toMatch(/choghadiyaDateSeo\(\s*\{[\s\S]{0,200}locale:\s*locale\s+as\s+Locale[\s\S]{0,200}\}\s*\)/);
      expect(src).not.toMatch(/title\s*=\s*`[^`]*दिवस आणि रात्रीची[^`]*`/);
    });

    it('still emits robots: noindex when suppressed', () => {
      expect(src).toMatch(/robots:\s*noindex\s*\?\s*\{\s*index:\s*false/);
    });
  });

  describe('horoscope/[rashi]/[date] metadata uses the exhaustive helper', () => {
    const src = read('src/app/[locale]/horoscope/[rashi]/[date]/layout.tsx');

    it('imports horoscopeDateSeo from @/lib/seo/date-page-seo', () => {
      expect(src).toMatch(/import\s+\{[^}]*horoscopeDateSeo[^}]*\}\s+from\s+['"]@\/lib\/seo\/date-page-seo['"]/);
    });

    it('calls horoscopeDateSeo(...) and passes a per-locale rashi name', () => {
      expect(src).toMatch(/horoscopeDateSeo\(\s*\{[\s\S]{0,400}locale:\s*locale\s+as\s+Locale[\s\S]{0,400}rashiName:[\s\S]{0,100}\}\s*\)/);
    });

    it('still emits robots: noindex when suppressed', () => {
      expect(src).toMatch(/isSuppressedSeoLocale/);
      expect(src).toMatch(/robots:\s*noindex\s*\?\s*\{\s*index:\s*false/);
    });
  });

  describe('date-page-seo helper preserves the cycle-2 / cycle-8 / cycle-9 Marathi tuning', () => {
    const src = read('src/lib/seo/date-page-seo.ts');

    it('Marathi panchang title uses तिथी (long ी), राहू, काळ — cycle-2 MEDIUM', () => {
      // Find the mr case for panchangDateSeo and assert all three.
      const mrSlice = src.match(/case 'mr': return \{[\s\S]{0,1200}\};/g) ?? [];
      const panchangMr = mrSlice.find(s => s.includes('पंचांग') && s.includes('तिथी'));
      expect(panchangMr, 'no Marathi case found in panchangDateSeo').toBeDefined();
      expect(panchangMr).toMatch(/तिथी/);
      expect(panchangMr).toMatch(/राहू/);
      expect(panchangMr).toMatch(/काळ/);
    });

    it('Marathi panchang description uses ${cityName}साठी particle and अचूक — cycle-2 HIGH (now templated 2026-06-02)', () => {
      // City was hardcoded as "दिल्ली"+"साठी" pre-2026-06-02. Per
      // PR feat/per-locale-seo-city the city is templated; the साठी
      // particle attached to ${cityName} is the same grammatical
      // contract from PR #329 cycle 2 — preserved across all 9
      // locale defaults. The अचूक "accurate" cycle-2 token is unchanged.
      expect(src).toMatch(/\$\{cityName\}साठी/);
      expect(src).toMatch(/अचूक/);
    });

    it('Maithili panchang description uses ${cityName}क लेल particle — cycle-2 (now templated 2026-06-02)', () => {
      // Mithila क लेल particle preserved; only the noun is templated.
      expect(src).toMatch(/\$\{cityName\}क लेल/);
    });

    it('Marathi choghadiya description preserves cycle-8/9 grammar (${cityName}चे + सूर्योदय-सूर्यास्तावर)', () => {
      // Cycle-8/9 Gemini-MEDIUM grammar — the no-space possessive चे
      // and the oblique form सूर्योदय-सूर्यास्तावर — both still in
      // the helper. Only the hardcoded "दिल्ली" was lifted out.
      expect(src).toMatch(/\$\{cityName\}चे चौघड़िया/);
      expect(src).toMatch(/सूर्योदय-सूर्यास्तावर/);
    });

    it('Marathi horoscope title uses राशीफल (long ी) AND चे connector', () => {
      const mrSlices = src.match(/case 'mr': return \{[\s\S]{0,1200}\};/g) ?? [];
      const horoMr = mrSlices.find(s => s.includes('राशीफल'));
      expect(horoMr, 'no Marathi case found in horoscopeDateSeo').toBeDefined();
      expect(horoMr).toMatch(/राशीफल/);
      expect(horoMr).toMatch(/चे/);
    });

    it('contains an assertNever exhaustiveness call so adding a new locale errors at compile time', () => {
      expect(src).toMatch(/function assertNever\(x:\s*never\)/);
      // Every exported function must end with `return assertNever(locale);`
      // so the compiler can verify no case is missed.
      const calls = src.match(/return assertNever\(locale\);/g) ?? [];
      expect(calls.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('sitemap.ts — per-URL lastModified for date-based URLs', () => {
    const src = read('src/lib/seo/sitemap-data.ts');

    it('addEntries accepts an optional lastModified override', () => {
      expect(src).toMatch(/lastModified\?:\s*Date/);
      // Cycle-4 changed `opts.lastModified ?? routeLastModified(route)`
      // to a ternary that also caps at BUILD_NOW for future dates.
      // The fallback to routeLastModified must still happen when no
      // override is supplied.
      expect(src).toMatch(/opts\.lastModified[\s\S]*routeLastModified\(route\)/);
    });

    it('horoscope date block passes per-URL lastModified', () => {
      // Specifically the `/horoscope/${slug}/${dateStr}` addEntries call
      // must include `lastModified: d` so each entry's <lastmod> reflects
      // the URL's date, not BUILD_NOW.
      expect(src).toMatch(/\/horoscope\/\$\{slug\}\/\$\{dateStr\}[\s\S]{0,400}lastModified:\s*d/);
    });

    it('choghadiya date block passes per-URL lastModified', () => {
      expect(src).toMatch(/\/choghadiya\/\$\{dateStr\}[\s\S]{0,400}lastModified:\s*d/);
    });

    it('panchang date block passes per-URL lastModified', () => {
      expect(src).toMatch(/\/panchang\/date\/\$\{dateStr\}[\s\S]{0,400}lastModified:\s*d/);
    });

    it('all four date-base blocks share a single per-invocation UTC midnight — cycle-6 (post ISR refactor)', () => {
      // History: cycle-2 unified horoscope+choghadiya+panchang on a
      // module-level BUILD_NOW; cycle-3 caught Gauri; cycle-6 collapsed
      // the four duplicate `new Date(Date.UTC(...))` into one
      // BUILD_UTC_MIDNIGHT constant. 2026-06-01 recovery moved that
      // constant inside an ISR-revalidated function (sitemap.ts now
      // exports `revalidate = 86400`) so each daily regen captures
      // today's date — the previous module-load-time constants would
      // freeze for the life of the ISR server.
      //
      // The four xDateBase assignments now reuse `_utcMidnight`, set
      // per-invocation by `refreshReferences()`.
      expect(src).toMatch(/export\s+const\s+revalidate\s*=\s*86400/);
      expect(src).toMatch(/refreshReferences\s*\(\s*\)\s*;/);
      const bases = src.match(/(horoscope|choghadiya|panchang|gauri)DateBase\s*=\s*_utcMidnight\b/g);
      expect(bases?.length ?? 0).toBe(4);
      // The old module-level BUILD_NOW / BUILD_UTC_MIDNIGHT constants
      // must NOT be reintroduced — they'd silently break the daily
      // refresh.
      expect(src).not.toMatch(/^const\s+BUILD_NOW\s*=\s*new Date\(\)/m);
      expect(src).not.toMatch(/^const\s+BUILD_UTC_MIDNIGHT\s*=/m);
    });

    it('Gauri Panchang block passes per-URL lastModified — cycle-3', () => {
      expect(src).toMatch(/\/gauri-panchang\/\$\{dateStr\}[\s\S]{0,400}lastModified:\s*d/);
    });

    it('caps future lastModified values at the per-invocation now — cycle-4 (SEO anti-pattern guard)', () => {
      // Date-based blocks pass per-URL `d` for the 7-day forward
      // window. For URLs whose date is in the future, Google treats
      // a future `<lastmod>` as invalid; the cap rolls them back to
      // today's regen reference (`_nowRef`).
      expect(src).toMatch(/opts\.lastModified\s*>\s*_nowRef\s*\?\s*_nowRef\s*:\s*opts\.lastModified/);
    });

    it('date-rolling windows are 7 days, not the pre-recovery 60 — 2026-06-01 cut', () => {
      // 2026-06-01 recovery cut /choghadiya, /panchang/date, /gauri-panchang
      // from 60 days to 7. The Marathi grammar fix was a side-quest; the
      // real demotion driver was scaled date-templated content. Keep the
      // window tight until Google reclassifies the property.
      const sixtyDayLoops = src.match(/for\s*\(\s*let\s+i\s*=\s*0;\s*i\s*<=?\s*60;/g);
      expect(sixtyDayLoops?.length ?? 0).toBe(0);
      // Four windowed blocks (horoscope + 3 cut blocks) all use < 7.
      const sevenDayLoops = src.match(/for\s*\(\s*let\s+i\s*=\s*0;\s*i\s*<\s*7;/g);
      expect(sevenDayLoops?.length ?? 0).toBe(4);
    });
  });

  describe('formatSeoDate adoption — three templates and horoscope page body all use it', () => {
    it('panchang/date metadata + page body use formatSeoDate(locale)', () => {
      const src = read('src/app/[locale]/panchang/date/[date]/page.tsx');
      // The import landed
      expect(src).toMatch(/import\s+\{[^}]*formatSeoDate[^}]*\}\s+from\s+['"]@\/lib\/utils\/locale-fonts['"]/);
      // Both `humanDate = ...` sites use it (was formatDateHuman with the
      // isHi bool that mis-spelt Marathi months).
      const matches = src.match(/humanDate\s*=\s*formatSeoDate\([^)]*locale\s*\)/g);
      expect(matches?.length ?? 0).toBeGreaterThanOrEqual(2);
    });

    it('choghadiya metadata + page body use formatSeoDate(locale)', () => {
      const src = read('src/app/[locale]/choghadiya/[date]/page.tsx');
      expect(src).toMatch(/import\s+\{[^}]*formatSeoDate[^}]*\}\s+from\s+['"]@\/lib\/utils\/locale-fonts['"]/);
      const matches = src.match(/humanDate\s*=\s*formatSeoDate\([^)]*locale\s*\)/g);
      expect(matches?.length ?? 0).toBeGreaterThanOrEqual(2);
    });

    it('horoscope layout uses formatSeoDate(locale) for the title date', () => {
      const src = read('src/app/[locale]/horoscope/[rashi]/[date]/layout.tsx');
      expect(src).toMatch(/import\s+\{[^}]*formatSeoDate[^}]*\}\s+from\s+['"]@\/lib\/utils\/locale-fonts['"]/);
      expect(src).toMatch(/formatSeoDate\([^)]*locale\s*\)/);
      // The old hardcoded en-US format must be gone — that's what
      // produced "June 1, 2026 चे..." mixed-language titles.
      expect(src).not.toMatch(/toLocaleDateString\(\s*['"]en-US['"]/);
    });

    it('horoscope page body uses formatSeoDate(locale) and Marathi राशीफल spelling', () => {
      const src = read('src/app/[locale]/horoscope/[rashi]/[date]/page.tsx');
      expect(src).toMatch(/formatSeoDate\([^)]*locale\s*\)/);
      // Marathi-specific branch with the right spelling
      expect(src).toMatch(/locale\s*===\s*['"]mr['"]/);
      expect(src).toMatch(/राशीफल/); // Marathi spelling (with ी)
      // Old en-US hardcode is gone
      expect(src).not.toMatch(/toLocaleDateString\(\s*['"]en-US['"]/);
    });

    it('horoscope page strict-validates date components to refuse rollover dates — cycle-3', () => {
      // 2026-02-30 must not silently roll over to 2026-03-02. After the
      // 2026-06-01 follow-up, the round-trip check lives in the shared
      // `isStrictYmd` helper (src/lib/seo/date-validation.ts) so the
      // proxy can 404 rollover URLs at the edge. The page + layout
      // import it for defense-in-depth.
      const helperSrc = read('src/lib/seo/date-validation.ts');
      expect(helperSrc).toMatch(/getUTCFullYear\(\)\s*===\s*y/);
      expect(helperSrc).toMatch(/getUTCMonth\(\)\s*\+\s*1\s*===\s*m/);
      expect(helperSrc).toMatch(/getUTCDate\(\)\s*===\s*d/);
      for (const f of [
        'src/app/[locale]/horoscope/[rashi]/[date]/page.tsx',
        'src/app/[locale]/horoscope/[rashi]/[date]/layout.tsx',
      ]) {
        const src = read(f);
        expect(src).toMatch(/isStrictYmd/);
      }
    });

    it('proxy 404s rollover date URLs at the edge — 2026-06-01 follow-up + 2026-06-04 soft-404 fix', () => {
      const src = read('src/proxy.ts');
      // After the 2026-06-04 soft-404 fix (docs/specs/2026-06-04-soft-404-date-keyed-routes.md)
      // the proxy uses isStrictYmd directly — catches both rollover dates
      // (2026-02-30) AND garbage slugs ('foo', 'tomorrow') that
      // isRolloverDate alone would let through to a page-level soft-404.
      expect(src).toMatch(/import\s+\{[^}]*isStrictYmd[^}]*\}\s+from\s+['"]@\/lib\/seo\/date-validation['"]/);
      expect(src).toMatch(/status:\s*404/);
      // Date-segment routes (today-aware: redirect 'today' → today's YYYY-MM-DD; reject anything else)
      expect(src).toMatch(/'panchang',\s*'date'/);
      expect(src).toMatch(/'choghadiya'/);
      expect(src).toMatch(/'gauri-panchang'/);
      expect(src).toMatch(/'daily'/);
      expect(src).toMatch(/horoscope/);
      // Year-segment routes (today-blind: 'today' and bad years → 404)
      expect(src).toMatch(/'hindu-calendar'/);
      expect(src).toMatch(/'vivah-muhurat'/);
      expect(src).toMatch(/festivals/);
      expect(src).toMatch(/muhurta/);
      // 'today' redirect must be a temporary 302 (target changes daily;
      // 301/308 would let CDNs and browsers memoise yesterday's target)
      expect(src).toMatch(/redirect\([^,]+,\s*302\)/);
      // Today resolution anchored to SEO_CITY timezone (Asia/Kolkata)
      expect(src).toMatch(/Asia\/Kolkata/);
      expect(src).toMatch(/todayInTimezone/);
    });
  });
});
