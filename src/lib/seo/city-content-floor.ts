/**
 * Render-time circuit breaker for /panchang/[city] (Phase 0c, 2026-06-10).
 *
 * Returns true when the page has enough locale-native content to be safely
 * indexed for the given (locale, slug) pair. When it returns false, the
 * page metadata emits `<meta name="robots" content="noindex, follow">` so
 * Google drops the page from the index rather than treating it as a
 * near-duplicate of the same slug in a different locale.
 *
 * The floor we enforce — both conditions must hold:
 *
 *   1. `city.name[locale]` is in the LOCALE's expected script. If the
 *      overlay didn't cover the slug for ta/te/bn/kn/gu, the name silently
 *      degrades to English — exactly the case the May 31 demote was
 *      triggered by ("Mumbai இன்றைய பஞ்சாங்கம்" gets canonicalised against
 *      the English page).
 *
 *   2. `getCityDescriptor(slug).descriptor[locale]` is present, non-empty,
 *      and at least MIN_DESCRIPTOR_CHARS long. The Gemini-authored
 *      descriptor file covers the 44 indexable slugs, but a future slug
 *      additions or partial run could leave a hole — this keeps the floor
 *      enforced regardless.
 *
 * The check is intentionally NOT a Jaccard-similarity guard against other
 * pages: we proved in the 2026-06-10 audit that the existing descriptors
 * are well-differentiated (cross-city Jaccard 0.08–0.29 across all 9
 * locales). The floor only catches the missing-content case, not subtle
 * authoring problems — those are a downstream test concern.
 */
import { getCityBySlugExtended } from '@/lib/constants/cities-extended';
import { getCityDescriptor } from '@/lib/constants/city-descriptors';

const MIN_DESCRIPTOR_CHARS = 200;

// Unicode script ranges for the 9 visible locales. Membership is "any char
// in the range" so a single loanword in another script doesn't fail the
// check — we only catch the case where the locale's expected script is
// completely absent (i.e. the field is pure English fallback).
const SCRIPT_PATTERN_BY_LOCALE: Record<string, RegExp> = {
  // en allows any Latin output (no constraint beyond non-empty).
  en:  /[A-Za-z]/,
  hi:  /[ऀ-ॿ]/,    // Devanagari
  mai: /[ऀ-ॿ]/,    // Devanagari (Maithili shares the script)
  mr:  /[ऀ-ॿ]/,    // Devanagari (Marathi shares the script)
  ta:  /[஀-௿]/,    // Tamil
  te:  /[ఀ-౿]/,    // Telugu
  bn:  /[ঀ-৿]/,    // Bengali
  kn:  /[ಀ-೿]/,    // Kannada
  gu:  /[઀-૿]/,    // Gujarati
};

function hasExpectedScript(text: string | undefined, locale: string): boolean {
  if (!text) return false;
  const pattern = SCRIPT_PATTERN_BY_LOCALE[locale];
  if (!pattern) return true; // unknown locale — don't second-guess
  return pattern.test(text);
}

/**
 * Returns true when (locale, slug) has both (a) a locale-native city name
 * and (b) a locale-native descriptor of at least 200 chars. Callers should
 * emit `robots: { index: false, follow: true }` on false.
 *
 * Always returns true for `en` provided the slug exists and has a
 * non-empty descriptor — English is the canonical authoring locale and
 * descriptors are seeded there first.
 */
export function hasLocaleNativeCityContent(slug: string, locale: string): boolean {
  const city = getCityBySlugExtended(slug);
  if (!city) return false;

  const nameInLocale = (city.name as Record<string, string>)[locale];
  if (!hasExpectedScript(nameInLocale, locale)) return false;

  const descriptor = getCityDescriptor(slug);
  const text = descriptor?.descriptor[locale as keyof typeof descriptor.descriptor];
  if (!text || text.length < MIN_DESCRIPTOR_CHARS) return false;
  if (!hasExpectedScript(text, locale)) return false;

  return true;
}
