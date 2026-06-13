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
 * Hindu calendar for a year — flat festival list, computed once per
 * year against Ujjain coordinates (the page's canonical anchor).
 * Trilingual labels are baked in; one Blob per year serves every
 * locale. Page does `tl(field, locale)` at render time.
 */
export function hinduCalendarKey(year: number): string {
  if (!Number.isInteger(year) || year < 1900 || year > 2200) {
    throw new Error(`[keys] expected year in [1900, 2200], got ${year}`);
  }
  return `hindu-calendar/${year}`;
}

/**
 * Daily article + horoscope bundle for a city on a date — wraps
 * generateDailyArticle output + the 12-rashi horoscope grid the
 * /daily/[date]/[city] page surfaces in one Blob per (date, city).
 * Trilingual fields baked in (one Blob per tuple regardless of locale).
 */
export function dailyArticleKey(date: string, citySlug: string): string {
  assertDate(date);
  assertSlug(citySlug);
  return `daily-article/${date}/${citySlug}`;
}

/**
 * Full yearly festival list keyed by (year, citySlug) — same shape as
 * hindu-calendar but per-city. Consumed by /festivals/[slug]/[year]/[city]
 * which does `.find(f.slug === slug)` at render time. One Blob per
 * (year, city) is reused across every festival slug for that city.
 */
export function festivalsYearKey(year: number, citySlug: string): string {
  if (!Number.isInteger(year) || year < 1900 || year > 2200) {
    throw new Error(`[keys] expected year in [1900, 2200], got ${year}`);
  }
  assertSlug(citySlug);
  return `festivals-year/${year}/${citySlug}`;
}

/**
 * Muhurta windows for an (activity, year, month, city) tuple — wraps
 * the scanDateRangeV2 output. Consumed by
 * /muhurta/[type]/[year]/[month]/[city] which sorts by score and
 * surfaces the top 10. One Blob per tuple; trilingual labels baked in.
 */
export function muhurtaMonthKey(activitySlug: string, year: number, month: number, citySlug: string): string {
  if (!Number.isInteger(year) || year < 1900 || year > 2200) {
    throw new Error(`[keys] expected year in [1900, 2200], got ${year}`);
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`[keys] expected month 1..12, got ${month}`);
  }
  assertSlug(activitySlug);
  assertSlug(citySlug);
  return `muhurta-month/${activitySlug}/${year}/${month}/${citySlug}`;
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
