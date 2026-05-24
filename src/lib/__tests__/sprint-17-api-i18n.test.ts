/**
 * Sprint 17 — P2 + P3 API + i18n cleanups invariants.
 *
 * Locks in:
 *   - P2-34 four API routes z.enum / locale-allowlist sourced from the
 *     canonical `locales` array in @/lib/i18n/config (no more stale
 *     hand-rolled lists)
 *   - P2-39 /api/cron/onboarding-drip reads `preferred_locale` from
 *     user_profiles (no more hardcoded 'en')
 *   - P3 /api/calendar/export `paranaLabel` covers every visible locale
 *   - P3 /api/horoscope + /api/horoscope/personalized system prompts
 *     branch on `isDevanagariLocale` (covers hi + mai), not just hi
 *   - P3 OAuth redirect preserves pathname + search (already fixed —
 *     locked in here)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) =>
  readFileSync(join(process.cwd(), rel), 'utf8');

describe('Sprint 17 — P2-34 z.enum locale lists imported from canonical config', () => {
  const STALE_TARGETS = [
    'src/app/api/horoscope/route.ts',
    'src/app/api/tippanni-llm/route.ts',
    'src/app/api/kundali-report/route.ts',
  ];

  for (const path of STALE_TARGETS) {
    it(`${path} imports + uses the canonical locales array in z.enum`, () => {
      const src = read(path);
      expect(src, `${path} missing locales import`).toMatch(
        /import\s*\{\s*locales\s*\}\s*from\s*['"]@\/lib\/i18n\/config['"]/,
      );
      expect(src, `${path} z.enum should use locales`).toMatch(/z\.enum\(locales\)/);
      // The old hand-rolled lists must be gone (the smoking-gun shapes).
      expect(src, `${path} still has hand-rolled list`).not.toMatch(
        /z\.enum\(\[\s*['"]en['"]\s*,\s*['"]hi['"]\s*\]/,
      );
      expect(src, `${path} still has retired sa in enum`).not.toMatch(
        /z\.enum\(\[[^\]]*['"]sa['"][^\]]*\]\)/,
      );
    });
  }

  it('src/app/api/nadi/route.ts uses the canonical locales array for its allowlist', () => {
    const src = read('src/app/api/nadi/route.ts');
    expect(src).toMatch(
      /import\s*\{\s*locales\s*\}\s*from\s*['"]@\/lib\/i18n\/config['"]/,
    );
    expect(src).toMatch(/\(locales as readonly string\[\]\)\.includes\(/);
    // Old hand-rolled allowlist must be gone.
    expect(src).not.toMatch(/\['en',\s*'hi',\s*'ta',\s*'bn'\]\.includes/);
  });
});

describe('Sprint 17 — P2-39 /api/cron/onboarding-drip reads preferred_locale', () => {
  const src = read('src/app/api/cron/onboarding-drip/route.ts');

  it('selects preferred_locale from user_profiles', () => {
    expect(src).toMatch(
      /\.select\(\s*['"][^'"]*preferred_locale[^'"]*['"]\)/,
    );
  });

  it('falls back to "en" when stored value is null or unsupported', () => {
    expect(src).toMatch(
      /\(locales as readonly string\[\]\)\.includes\(preferred\)/,
    );
    expect(src).toMatch(/\?\s*\(preferred as Locale\)\s*:\s*'en'/);
  });

  it('the hardcoded `locale: \'en\' | \'hi\' = \'en\'` shape is gone', () => {
    expect(src).not.toMatch(/const locale:\s*'en'\s*\|\s*'hi'\s*=\s*'en';/);
  });
});

describe('Sprint 17 — P3 /api/calendar/export paranaLabel covers every visible locale', () => {
  const src = read('src/app/api/calendar/export/route.ts');

  it('label is defined for hi, mai, ta, te, bn, kn, gu plus EN fallback', () => {
    // Each branch in the ternary chain must include the right script.
    // Specifically: ta + te + bn + kn + gu were missing before this PR.
    expect(src).toMatch(/locale === 'ta'\s*\?\s*'பாரணை'/);
    expect(src).toMatch(/locale === 'te'\s*\?\s*'పారణ'/);
    expect(src).toMatch(/locale === 'bn'\s*\?\s*'পারণ'/);
    expect(src).toMatch(/locale === 'kn'\s*\?\s*'ಪಾರಣ'/);
    expect(src).toMatch(/locale === 'gu'\s*\?\s*'પારણ'/);
    // hi + mai + sa (retired but cached) all use Devanagari पारण.
    expect(src).toMatch(/locale === 'hi'\s*\|\|\s*locale === 'sa'\s*\|\|\s*locale === 'mai'\s*\?\s*'पारण'/);
  });
});

describe('Sprint 17 — P3 horoscope system prompts branch on isDevanagariLocale', () => {
  const routes = [
    'src/app/api/horoscope/route.ts',
    'src/app/api/horoscope/personalized/route.ts',
  ];

  for (const path of routes) {
    it(`${path} imports isDevanagariLocale + uses it in the system prompt`, () => {
      const src = read(path);
      expect(src, `${path} missing isDevanagariLocale import`).toMatch(
        /import\s*\{\s*isDevanagariLocale\s*\}\s*from\s*['"]@\/lib\/utils\/locale-fonts['"]/,
      );
      expect(src, `${path} system prompt should branch on isDevanagariLocale`).toMatch(
        /system:\s*isDevanagariLocale\(locale\)/,
      );
      // The old hi-only ternary must be gone from the system prompt site.
      expect(src, `${path} still has hi-only system prompt`).not.toMatch(
        /system:\s*locale === 'hi'/,
      );
    });
  }
});

describe('Sprint 17 — P3 OAuth signInWithGoogle preserves pathname + search', () => {
  const src = read('src/stores/auth-store.ts');

  it('redirectTo is computed from baseUrl + (pathname + search)', () => {
    expect(src).toMatch(/const returnPath = window\.location\.pathname \+ window\.location\.search;/);
    expect(src).toMatch(/redirectTo:\s*`\$\{baseUrl\}\$\{returnPath\}`/);
  });

  it('baseUrl is pinned to NEXT_PUBLIC_SITE_URL (open-redirect guard)', () => {
    expect(src).toMatch(
      /const baseUrl = \(process\.env\.NEXT_PUBLIC_SITE_URL/,
    );
  });
});
