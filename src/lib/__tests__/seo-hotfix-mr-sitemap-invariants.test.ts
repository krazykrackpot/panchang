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

    it('horoscope base date is UTC-midnight-normalised (Gemini #329 MED)', () => {
      // Before the fix, `horoscopeDateBase = new Date()` carried build-
      // time hours/minutes/seconds and `lastModified` ticked on every
      // redeploy of the same calendar date. The choghadiya + panchang
      // blocks already used `Date.UTC(year, month, date)` to zero out
      // the time component; horoscope must do the same now.
      expect(src).toMatch(
        /horoscopeDateBase\s*=\s*new Date\(\s*Date\.UTC\(\s*_horoNow\.getUTCFullYear\(\)/,
      );
      // The bare `new Date()` form must NOT be the immediate value of
      // horoscopeDateBase (only used as the `_horoNow` source).
      expect(src).not.toMatch(/const\s+horoscopeDateBase\s*=\s*new Date\(\s*\)\s*;/);
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
  });
});
