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

describe('Sprint 17 — P3 /api/calendar/export paranaLocalization map (Gemini-refactored)', () => {
  const src = read('src/app/api/calendar/export/route.ts');

  it('defines a paranaLocalization() helper returning label + dateSuffix + sunriseSuffix', () => {
    // Gemini #155: the previous ternary chain (a) was hard to extend and
    // (b) only translated the label — date+sunrise suffixes leaked English
    // into the rendered ICS line for non-EN locales. The helper map now
    // carries all three strings together so every line renders in one script.
    expect(src).toMatch(
      /function paranaLocalization\(locale:\s*string\):\s*\{[\s\S]*?label:\s*string;[\s\S]*?dateSuffix:\s*string;[\s\S]*?sunriseSuffix:\s*string;[\s\S]*?\}/,
    );
  });

  it('map covers every visible regional locale, not just hi/sa', () => {
    // The Sprint-17 fix adds ta/te/bn/kn/gu/mai. Each script must appear
    // in the helper map — match the canonical labels.
    expect(src).toMatch(/ta:\s*\{\s*label:\s*'பாரணை'/);
    expect(src).toMatch(/te:\s*\{\s*label:\s*'పారణ'/);
    expect(src).toMatch(/bn:\s*\{\s*label:\s*'পারণ'/);
    expect(src).toMatch(/kn:\s*\{\s*label:\s*'ಪಾರಣ'/);
    expect(src).toMatch(/gu:\s*\{\s*label:\s*'પારણ'/);
    expect(src).toMatch(/mai:\s*\{\s*label:\s*'पारण'/);
    expect(src).toMatch(/hi:\s*\{\s*label:\s*'पारण'/);
    expect(src).toMatch(/sa:\s*\{\s*label:\s*'पारणम्'/);
    // EN fallback for unknown locales.
    expect(src).toMatch(/\?\?\s*\{\s*label:\s*'Parana'/);
  });

  it('the description builder consumes the localized strings (no English "date"/"Sunrise" leak)', () => {
    // Before: `${paranaLabel} date: ...` and `Sunrise: ...` were hardcoded
    // English even when the label was Devanagari/Tamil/etc.
    expect(src).toMatch(/paranaStrings\.dateSuffix/);
    expect(src).toMatch(/paranaStrings\.sunriseSuffix/);
    // Old hardcoded mixed-language shape must be gone.
    expect(src).not.toMatch(/\$\{paranaLabel\} date:/);
    expect(src).not.toMatch(/parts\.push\(`Sunrise:\s*\$\{f\.paranaSunrise\}`/);
  });
});

describe('Sprint 17 — tippanni-llm Devanagari narrowing matches horoscope routes (Gemini #155)', () => {
  const src = read('src/app/api/tippanni-llm/route.ts');

  it('imports isDevanagariLocale alongside the canonical locales array', () => {
    expect(src).toMatch(
      /import\s*\{\s*isDevanagariLocale\s*\}\s*from\s*['"]@\/lib\/utils\/locale-fonts['"]/,
    );
  });

  it('llmLocale narrows via isDevanagariLocale (covers mai + retired sa), not the strict locale === \'hi\'', () => {
    expect(src).toMatch(/const llmLocale:\s*'en'\s*\|\s*'hi'\s*=\s*isDevanagariLocale\(locale\s*\?\?\s*'en'\)\s*\?\s*'hi'\s*:\s*'en'/);
    // The previous strict-equality shape must be gone.
    expect(src).not.toMatch(/const llmLocale:[^=]*=\s*locale === 'hi'\s*\?\s*'hi'\s*:\s*'en'/);
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
