import type { CSSProperties } from 'react';

/**
 * Returns the appropriate body font style for a given locale.
 * - Hindi/Sanskrit → Devanagari
 * - Tamil → Noto Sans Tamil
 * - Telugu → Noto Sans Telugu
 * - Bengali → Noto Sans Bengali
 * - Kannada → Noto Sans Kannada
 * - English → undefined (uses default)
 */
export function getBodyFont(locale: string): CSSProperties | undefined {
  if (locale === 'hi' || locale === 'sa') return { fontFamily: 'var(--font-devanagari-body)' };
  if (locale === 'ta') return { fontFamily: 'var(--font-tamil-body)' };
  if (locale === 'te') return { fontFamily: 'var(--font-telugu-body)' };
  if (locale === 'bn') return { fontFamily: 'var(--font-bengali-body)' };
  if (locale === 'kn') return { fontFamily: 'var(--font-kannada-body)' };
  if (locale === 'mr' || locale === 'mai') return { fontFamily: 'var(--font-devanagari-body)' };
  if (locale === 'gu') return { fontFamily: 'var(--font-gujarati-body)' };
  return undefined;
}

/**
 * Returns the appropriate heading font style for a given locale.
 * - Hindi/Sanskrit → Devanagari heading
 * - Tamil → Noto Sans Tamil heading
 * - Telugu → Noto Sans Telugu heading
 * - Bengali → Noto Sans Bengali heading
 * - Kannada → Noto Sans Kannada heading
 * - English → Cormorant Garamond heading
 */
export function getHeadingFont(locale: string): CSSProperties {
  if (locale === 'hi' || locale === 'sa') return { fontFamily: 'var(--font-devanagari-heading)' };
  if (locale === 'ta') return { fontFamily: 'var(--font-tamil-heading)' };
  if (locale === 'te') return { fontFamily: 'var(--font-telugu-heading)' };
  if (locale === 'bn') return { fontFamily: 'var(--font-bengali-heading)' };
  if (locale === 'kn') return { fontFamily: 'var(--font-kannada-heading)' };
  if (locale === 'mr' || locale === 'mai') return { fontFamily: 'var(--font-devanagari-heading)' };
  if (locale === 'gu') return { fontFamily: 'var(--font-gujarati-heading)' };
  return { fontFamily: 'var(--font-heading)' };
}

/** True for locales that use a non-Latin script (Devanagari, Tamil, Telugu, Bengali, Kannada, Gujarati, Marathi, Maithili). */
export function isIndicLocale(locale: string): boolean {
  return locale === 'hi' || locale === 'sa' || locale === 'ta' || locale === 'te' || locale === 'bn' || locale === 'kn' || locale === 'gu' || locale === 'mr' || locale === 'mai';
}

/** True for Devanagari-script locales: Hindi, Sanskrit, Marathi, Maithili. */
export function isDevanagariLocale(locale: string): boolean {
  return locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';
}

/**
 * Per-locale genitive ("of") connector for date-based SEO titles like
 * `"1 जून 2026 ${connector} पंचांग"`. Picks the locale-correct
 * postposition so each Devanagari locale's date pages aren't byte-
 * identical duplicates of the Hindi version.
 *
 * 2026-06-01 hotfix: before this existed, every Devanagari locale fell
 * into the Hindi path and emitted `का`, which made `/mr/...` pages
 * identical to `/hi/...` and triggered Google duplicate-content
 * de-ranking (-76% Marathi click drop in 24h). See
 * `feedback_seo_partial_locale_strategy` and the hotfix PR notes.
 */
export function getDateGenitive(locale: string): string {
  switch (locale) {
    case 'hi': return 'का';      // Hindi masculine genitive
    case 'mai': return 'क';      // Maithili masculine singular genitive
    case 'mr': return 'चे';      // Marathi neuter genitive (works for पंचांग, चौघडिया, राशीफल)
    case 'sa': return 'स्य';     // Sanskrit genitive (we noindex /sa/ anyway, kept for completeness)
    default: return '';           // EN path — title is fully English, no connector needed
  }
}

/**
 * Locales whose date-based SEO routes should be emitted as
 * `robots: noindex` regardless of normal indexability rules. Currently
 * only Sanskrit (retired in `i18n/config.ts` but its URL space is still
 * reachable via the dynamic `[locale]` segment — without an explicit
 * noindex Google indexes whatever the Hindi-fallback title produces
 * and treats `/sa/...` as a near-duplicate of `/hi/...`).
 *
 * Keep this list in sync with `retiredLocales` in `i18n/config.ts`.
 */
export function isSuppressedSeoLocale(locale: string): boolean {
  return locale === 'sa';
}

/**
 * Hindi month names tuned for SEO. Used by `formatSeoDate` when the
 * locale is Hindi / Maithili / Sanskrit — keeps the long-standing
 * "1 जून 2026" rendering stable instead of risking layout/spacing
 * drift from `toLocaleDateString`. Marathi gets ICU formatting (see
 * `formatSeoDate`) because ICU produces the correct Marathi month
 * spelling (मे, जानेवारी, ऑगस्ट) which the Hindi array does not.
 */
const MONTHS_HI = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

/**
 * Render `1 June 2026` (or the locale-appropriate equivalent) for
 * titles, descriptions, keywords, and H1s on date-based SEO routes.
 *
 *   - `mr` → ICU-localised Marathi with Latin numerals (e.g. `1 मे, 2026`).
 *     The Hindi MONTHS_HI array would produce mis-spelt `मई` / `जनवरी`;
 *     the Marathi spellings are `मे` / `जानेवारी`. Gemini PR #329 MEDIUM.
 *   - `hi`, `mai`, `sa` → tuned `MONTHS_HI` rendering (preserves existing
 *     "1 जून 2026" format and SEO history). `sa` is noindex anyway.
 *   - other → English `1 June 2026` via ICU `en-IN`.
 *
 * Numerals stay Latin everywhere (`-u-nu-latn` for ICU) — search queries
 * use Latin digits, so titles do too.
 */
export function formatSeoDate(year: number, month: number, day: number, locale: string): string {
  const utc = new Date(Date.UTC(year, month - 1, day));
  // Defensive guard — every caller validates components first (parseDate
  // / strict UTC round-trip in the route handlers), so this branch
  // shouldn't fire in production. Belt-and-braces against future callers
  // who forget the validation step. Gemini PR #329 cycle-7 MEDIUM.
  if (isNaN(utc.getTime())) return '';
  if (locale === 'mr') {
    return utc.toLocaleDateString('mr-IN-u-nu-latn', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }
  if (locale === 'hi' || locale === 'mai' || locale === 'sa') {
    // Out-of-range `month` would give `MONTHS_HI[month - 1] === undefined`
    // and produce "1 undefined 2026". Coerce to empty.
    const monthName = MONTHS_HI[month - 1] ?? '';
    return `${day} ${monthName} ${year}`;
  }
  return utc.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Maps a UI locale to the key used for accessing Trilingual constant data.
 * Hindi uses 'hi'; everything else falls back to 'en'.
 */
export function dataLocale(locale: string): 'en' | 'hi' {
  if (locale === 'hi') return 'hi';
  return 'en';
}

/**
 * Pick a string by script family — Devanagari locales (hi/sa/mr/mai) get
 * the `hi` text, everything else gets `en`. Bookend replacement for the
 * inline `isHi ? 'X' : 'Y'` pattern that previously hard-coded the
 * locale list and missed mr/mai/sa cases.
 *
 * For finer-grained per-script labels use `pickByLocale` below.
 * Audit 2026-05-25 §B6.
 */
export function pickByScript<T>(en: T, hi: T, locale: string): T {
  return isDevanagariLocale(locale) ? hi : en;
}

/**
 * Multi-script label picker — covers each of the active non-Latin scripts
 * with an explicit fallback chain. Devanagari locales fall through `hi`;
 * everything else returns the locale's own script when provided, else `en`.
 *
 * Example:
 *   pickByLocale({ en: 'Tools', hi: 'उपकरण', ta: 'கருவிகள்', bn: 'সরঞ্জাম' }, locale)
 *
 * Returns the most specific script available; never `undefined`. Audit §B6.
 */
export function pickByLocale(
  variants: { en: string; hi?: string; ta?: string; te?: string; bn?: string; gu?: string; kn?: string; mai?: string; mr?: string },
  locale: string,
): string {
  const direct = (variants as Record<string, string | undefined>)[locale];
  // Use !== undefined so an intentional empty-string locale variant is
  // respected rather than falling through to the EN copy. Gemini #193 MED.
  if (direct !== undefined) return direct;
  // Devanagari fallback when the active locale uses Devanagari but lacks
  // its own variant (e.g., a `mai` page that only has en + hi).
  if (isDevanagariLocale(locale) && variants.hi !== undefined) return variants.hi;
  return variants.en;
}
