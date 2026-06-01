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
  });
});
