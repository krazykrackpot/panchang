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

    it('Marathi panchang description uses दिल्लीसाठी and अचूक — cycle-2 HIGH', () => {
      expect(src).toMatch(/दिल्लीसाठी/);
      expect(src).toMatch(/अचूक/);
    });

    it('Maithili panchang description uses दिल्लीक लेल — cycle-2', () => {
      expect(src).toMatch(/दिल्लीक लेल/);
    });

    it('Marathi choghadiya description preserves cycle-8/9 grammar (दिल्लीचे + सूर्योदय-सूर्यास्तावर)', () => {
      expect(src).toMatch(/दिल्लीचे चौघड़िया/);
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
    const src = read('src/app/sitemap.ts');

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

    it('all four date-base blocks share BUILD_UTC_MIDNIGHT — cycle-6', () => {
      // Cycle-2 unified horoscope + choghadiya + panchang on BUILD_NOW.
      // Cycle-3 caught Gauri.
      // Cycle-6 refactored the four duplicate `new Date(Date.UTC(...))`
      // calls into a single module-level `BUILD_UTC_MIDNIGHT` constant.
      // The Date.UTC(BUILD_NOW...) expression now appears exactly once
      // (defining BUILD_UTC_MIDNIGHT); each xDateBase = BUILD_UTC_MIDNIGHT.
      const buildExpr = src.match(/Date\.UTC\(\s*BUILD_NOW\.getUTCFullYear\(\),\s*BUILD_NOW\.getUTCMonth\(\),\s*BUILD_NOW\.getUTCDate\(\)\s*\)/g);
      expect(buildExpr?.length ?? 0).toBe(1);
      // Four xDateBase assignments now reuse BUILD_UTC_MIDNIGHT.
      const bases = src.match(/(horoscope|choghadiya|panchang|gauri)DateBase\s*=\s*BUILD_UTC_MIDNIGHT\b/g);
      expect(bases?.length ?? 0).toBe(4);
      // The bare `new Date()` shadow names must all be gone.
      expect(src).not.toMatch(/_horoNow|_choghadiyaNow|_pdNow|_gauriNow/);
    });

    it('Gauri Panchang block passes per-URL lastModified — cycle-3', () => {
      expect(src).toMatch(/\/gauri-panchang\/\$\{dateStr\}[\s\S]{0,400}lastModified:\s*d/);
    });

    it('caps future lastModified values at BUILD_NOW — cycle-4 (SEO anti-pattern guard)', () => {
      // Date-based blocks pass per-URL `d` for the 60-day forward
      // window. For URLs whose date is in the future, Google treats
      // a future `<lastmod>` as invalid; the cap rolls them back to
      // BUILD_NOW.
      expect(src).toMatch(/opts\.lastModified\s*>\s*BUILD_NOW\s*\?\s*BUILD_NOW\s*:\s*opts\.lastModified/);
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

    it('proxy 404s rollover date URLs at the edge — 2026-06-01 follow-up', () => {
      const src = read('src/proxy.ts');
      expect(src).toMatch(/import\s+\{[^}]*isRolloverDate[^}]*\}\s+from\s+['"]@\/lib\/seo\/date-validation['"]/);
      expect(src).toMatch(/status:\s*404/);
      // Routes that must be gated. Year-only routes (festivals, muhurta)
      // are intentionally excluded — isRolloverDate only fires on
      // YYYY-MM-DD shape so listing them would be a no-op.
      expect(src).toMatch(/'panchang',\s*'date'/);
      expect(src).toMatch(/'choghadiya'/);
      expect(src).toMatch(/'gauri-panchang'/);
      expect(src).toMatch(/'daily'/);
      expect(src).toMatch(/horoscope/);
    });
  });
});
