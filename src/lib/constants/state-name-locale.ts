/**
 * Locale-aware state / country name resolver for /panchang/[city].
 *
 * `CityData.state` is a canonical English string (e.g. "Maharashtra",
 * "Tamil Nadu", "USA"). When that string gets templated into prose for
 * a non-English locale page, it produces mixed-script output like
 * "मुंबई, Maharashtra के लिए आज का पंचांग" — the kind of locale-bleed
 * Google's content classifier flagged on 2026-05-31 (PR #329).
 *
 * This helper looks the English name up in state-name-overlay.json and
 * returns the locale-native form. Falls back to the English string on
 * miss (better than emitting an empty value) so a missing overlay entry
 * downgrades gracefully rather than breaking the body prose.
 *
 * Regen: scripts/translate-city-state-names-via-gemini.py (covers all 26
 * unique state/country strings used by SEO_INDEXABLE_CITY_SLUGS).
 */
import overlayRaw from './state-name-overlay.json';

type OverlayLocale = 'hi' | 'mai' | 'mr' | 'ta' | 'te' | 'bn' | 'kn' | 'gu';
const STATE_NAME_OVERLAY = overlayRaw as Record<OverlayLocale, Record<string, string>>;

export function getStateLocale(stateEn: string | undefined, locale: string): string {
  if (!stateEn) return '';
  if (locale === 'en') return stateEn;
  const bucket = STATE_NAME_OVERLAY[locale as OverlayLocale];
  if (!bucket) return stateEn;
  return bucket[stateEn] ?? stateEn;
}
