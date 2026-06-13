/**
 * Centralised key naming for precompute Blobs.
 *
 * The schema-version segment (`v1`) is the storage abstraction's
 * responsibility (LocalFsStorage maps it to a directory; VercelBlobStorage
 * will prefix the bucket path). Keys produced here are LOGICAL only —
 * forward-slash-separated, version-less, deterministic.
 *
 * One key per page-render unit. For routes whose page model is locale-
 * independent (e.g. choghadiya — labels are trilingual objects in the
 * Blob and the page does `tl(name, locale)` at render time), the key
 * omits locale. Saves 9× storage and 9× writes.
 *
 * Closes "issue K" from the plan review: this file IS the manifest
 * generator — anything else (sitemap, generateStaticParams) derives from
 * the key set produced here, never from a hand-maintained list.
 */

import type { Locale } from '@/lib/i18n/config';

/**
 * Choghadiya — date + city. Locale-independent (slot labels are trilingual).
 */
export function choghadiyaKey(date: string, citySlug: string): string {
  assertDate(date);
  assertSlug(citySlug);
  return `choghadiya/${date}/${citySlug}`;
}

/**
 * Gauri Panchang — date + city. Locale-independent (period labels are
 * locale-keyed objects in the Blob; page resolves at render time).
 */
export function gauriPanchangKey(date: string, citySlug: string): string {
  assertDate(date);
  assertSlug(citySlug);
  return `gauri-panchang/${date}/${citySlug}`;
}

/**
 * Panchang for a specific date — date + city. Locale-independent.
 */
export function panchangDateKey(date: string, citySlug: string): string {
  assertDate(date);
  assertSlug(citySlug);
  return `panchang-date/${date}/${citySlug}`;
}

/**
 * Full panchang model for a city on a date — wraps the entire
 * computePanchang result + festival list + tithi-table enrichment.
 * Consumed by /api/panchang on (date, citySlug) hint and (in future
 * PR) by /panchang/[city] SSR. Locale-independent (all LocaleText
 * fields baked in, page/API resolves at render time).
 */
export function panchangCityKey(date: string, citySlug: string): string {
  assertDate(date);
  assertSlug(citySlug);
  return `panchang-city/${date}/${citySlug}`;
}

/**
 * Horoscope for a rashi on a specific date — rashi + date.
 *
 * LOCALE-INDEPENDENT. The original keys.ts (2026-06-06) declared this
 * locale-dependent on a guess; verified 2026-06-10 that
 * `generateDailyHoroscope({ moonSign, date })` does NOT take a locale
 * and returns a DailyHoroscope whose LocaleText fields (`insight`,
 * `areas.*.text`, `luckyColor`, `luckyDirection`, `remedy.description`,
 * `dosAndDonts.*`) carry all 9 locales baked in. One Blob per (rashi,
 * date) serves every locale — same shape as choghadiyaKey, 9× storage
 * cheaper than the locale-keyed alternative.
 */
export function horoscopeKey(
  rashiSlug: string,
  date: string,
): string {
  assertDate(date);
  assertSlug(rashiSlug);
  return `horoscope/${rashiSlug}/${date}`;
}

// ─── Validators ──────────────────────────────────────────────────────────────

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z][a-z0-9-]*$/;

function assertDate(s: string): void {
  if (!DATE_RE.test(s)) {
    throw new Error(`[keys] expected YYYY-MM-DD, got "${s}"`);
  }
}

function assertSlug(s: string): void {
  if (!SLUG_RE.test(s)) {
    throw new Error(`[keys] expected lowercase-hyphen-slug, got "${s}"`);
  }
}
