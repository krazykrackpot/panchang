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

describe('SEO hotfix 2026-06-01 — Marathi grammar + Sanskrit noindex + sitemap freshness', () => {
  describe('panchang/date/[date] metadata', () => {
    const src = read('src/app/[locale]/panchang/date/[date]/page.tsx');

    it('imports getDateGenitive and isSuppressedSeoLocale from locale-fonts', () => {
      expect(src).toMatch(/import\s+\{[^}]*getDateGenitive[^}]*\}\s+from\s+['"]@\/lib\/utils\/locale-fonts['"]/);
      expect(src).toMatch(/isSuppressedSeoLocale/);
    });

    it('uses getDateGenitive(locale) for the date connector — NOT hardcoded "का"', () => {
      expect(src).toMatch(/const\s+dateConnector\s*=\s*getDateGenitive\(locale\)/);
      // The old hardcoded ternary must be gone — if it ever comes back,
      // Marathi falls through to Hindi again.
      expect(src).not.toMatch(/dateConnector\s*=\s*locale\s*===\s*['"]mai['"]\s*\?\s*['"]क['"]\s*:\s*['"]का['"]/);
    });

    it('emits robots: noindex when isSuppressedSeoLocale(locale)', () => {
      expect(src).toMatch(/const\s+noindex\s*=\s*isSuppressedSeoLocale\(locale\)/);
      expect(src).toMatch(/robots:\s*noindex\s*\?\s*\{\s*index:\s*false/);
    });

    it('Marathi title uses Marathi spellings: तिथी (long ी), राहू, काळ — cycle-2 MEDIUM', () => {
      // Hindi: तिथि (short ि), राहु, काल. Marathi: तिथी, राहू, काळ.
      // Mixing the two in a /mr/ title was a Hindi-fallback smell.
      expect(src).toMatch(/locale\s*===\s*['"]mr['"][\s\S]{0,400}तिथी[\s\S]{0,100}राहू\s*काळ/);
    });

    it('Marathi description uses दिल्लीसाठी and अचूक (not Hindi दिल्ली के लिए / सटीक) — cycle-2 HIGH', () => {
      expect(src).toMatch(/दिल्लीसाठी/);
      expect(src).toMatch(/अचूक/);
    });

    it('Maithili description uses दिल्लीक लेल — cycle-2', () => {
      expect(src).toMatch(/दिल्लीक लेल/);
    });
  });

  describe('choghadiya/[date] metadata', () => {
    const src = read('src/app/[locale]/choghadiya/[date]/page.tsx');

    it('imports getDateGenitive and isSuppressedSeoLocale', () => {
      expect(src).toMatch(/import\s+\{[^}]*getDateGenitive[^}]*\}\s+from\s+['"]@\/lib\/utils\/locale-fonts['"]/);
      expect(src).toMatch(/isSuppressedSeoLocale/);
    });

    it('uses getDateGenitive(locale) for the date connector', () => {
      expect(src).toMatch(/const\s+dateConnector\s*=\s*getDateGenitive\(locale\)/);
      expect(src).not.toMatch(/dateConnector\s*=\s*locale\s*===\s*['"]mai['"]\s*\?\s*['"]क['"]\s*:\s*['"]का['"]/);
    });

    it('emits a Marathi-specific description branch (separate from Hindi)', () => {
      // Marathi description must use Marathi-specific phrasing ("साठी"),
      // not Hindi "के लिए". Without this the description was identical
      // to the Hindi version and triggered duplicate-content.
      expect(src).toMatch(/locale\s*===\s*['"]mr['"]/);
      expect(src).toMatch(/साठी/);
    });

    it('emits Marathi-specific TITLE (not just description) — cycle-2', () => {
      // Cycle-1 left the title hardcoded to Hindi
      // "दिन और रात के शुभ-अशुभ समय"; cycle-2 split it into per-locale
      // branches with the Marathi equivalent
      // "दिवस आणि रात्रीची शुभ-अशुभ वेळ".
      expect(src).toMatch(/दिवस आणि रात्रीची/);
    });

    it('emits robots: noindex when suppressed', () => {
      expect(src).toMatch(/robots:\s*noindex\s*\?\s*\{\s*index:\s*false/);
    });
  });

  describe('horoscope/[rashi]/[date] metadata', () => {
    const src = read('src/app/[locale]/horoscope/[rashi]/[date]/layout.tsx');

    it('imports isSuppressedSeoLocale', () => {
      expect(src).toMatch(/isSuppressedSeoLocale/);
    });

    it('has a Marathi-specific title branch (locale === "mr")', () => {
      // The old code had a single isHi branch covering hi/mr/mai/sa
      // identically. Marathi must now diverge.
      expect(src).toMatch(/locale\s*===\s*['"]mr['"]/);
    });

    it('Marathi title uses राशीफल (Marathi spelling) AND चे connector', () => {
      // Marathi spells it राशीफल (with ी) vs Hindi राशिफल (with ि).
      // The Marathi branch must use the Marathi connector "चे".
      expect(src).toMatch(/राशीफल/);
      expect(src).toMatch(/['"]\s*चे\s*['"]?|चे\s+\$\{/);
    });

    it('emits robots: noindex when suppressed', () => {
      expect(src).toMatch(/robots:\s*noindex\s*\?\s*\{\s*index:\s*false/);
    });
  });

  describe('sitemap.ts — per-URL lastModified for date-based URLs', () => {
    const src = read('src/app/sitemap.ts');

    it('addEntries accepts an optional lastModified override', () => {
      expect(src).toMatch(/lastModified\?:\s*Date/);
      expect(src).toMatch(/opts\.lastModified\s*\?\?\s*routeLastModified/);
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

    it('all FOUR date-base computations share the module-level BUILD_NOW — cycle-3', () => {
      // Cycle-2 unified horoscope + choghadiya + panchang on BUILD_NOW.
      // Cycle-3 caught that the Gauri Panchang block had been missed —
      // it still had its own `_gauriNow` shadow and didn't pass
      // per-URL lastModified. Now all FOUR date-based blocks share
      // BUILD_NOW and pass lastModified: d.
      const matches = src.match(/Date\.UTC\(\s*BUILD_NOW\.getUTCFullYear\(\),\s*BUILD_NOW\.getUTCMonth\(\),\s*BUILD_NOW\.getUTCDate\(\)\s*\)/g);
      expect(matches?.length ?? 0).toBe(4);
      // The bare `new Date()` shadow names must all be gone.
      expect(src).not.toMatch(/_horoNow|_choghadiyaNow|_pdNow|_gauriNow/);
    });

    it('Gauri Panchang block passes per-URL lastModified — cycle-3', () => {
      expect(src).toMatch(/\/gauri-panchang\/\$\{dateStr\}[\s\S]{0,400}lastModified:\s*d/);
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
      // 2026-02-30 must not silently roll over to 2026-03-02. The page
      // and layout both round-trip the parsed components through
      // Date.UTC and notFound() / {} if they don't match.
      for (const f of [
        'src/app/[locale]/horoscope/[rashi]/[date]/page.tsx',
        'src/app/[locale]/horoscope/[rashi]/[date]/layout.tsx',
      ]) {
        const src = read(f);
        expect(src).toMatch(/getUTCFullYear\(\)\s*!==\s*y/);
        expect(src).toMatch(/getUTCMonth\(\)\s*\+\s*1\s*!==\s*m/);
        expect(src).toMatch(/getUTCDate\(\)\s*!==\s*d/);
      }
    });
  });
});
