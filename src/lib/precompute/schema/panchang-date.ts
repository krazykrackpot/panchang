/**
 * Page model for /[locale]/panchang/date/[date].
 *
 * Captures the panchang fields the page renders SSR-side: title/H1
 * pieces (tithi, nakshatra), the info-table rows, the JSON-LD FAQ
 * answers, and any festival hit for that calendar day.
 *
 * Locale-keyed cities — the route resolves an SEO city per locale via
 * `getSeoCityForLocale(locale)` (9 distinct cities for the 9 visible
 * locales). Blob is keyed by (date, citySlug) so a single Blob serves
 * every locale that maps to the same SEO city, and `tl(field, locale)`
 * at render time picks the right script.
 *
 * Versioned via `_v` literal — reader fails soft to live compute on
 * schema mismatch.
 */

import { z } from 'zod';

const LocaleText = z.object({
  en: z.string(),
  hi: z.string().optional(),
  sa: z.string().optional(),
  ta: z.string().optional(),
  te: z.string().optional(),
  bn: z.string().optional(),
  gu: z.string().optional(),
  kn: z.string().optional(),
  mai: z.string().optional(),
  mr: z.string().optional(),
}).catchall(z.string().optional());

const TimeRange = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
});

const FestivalToday = z.object({
  name: LocaleText,
  slug: z.string(),
});

export const PanchangDatePageModel = z.object({
  _v: z.literal(1),
  _computedAt: z.string(),

  /** YYYY-MM-DD — the URL date. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Slug of the SEO city used (resolved per-locale at request time). */
  city: z.string().regex(/^[a-z][a-z0-9-]*$/),
  /** 0=Sun..6=Sat — matches Date.getUTCDay() (Lesson O). */
  weekday: z.number().int().min(0).max(6),

  /** `number` is the 1-30 paksha tithi index — used by
   *  TodaySignificanceSection to gate paksha-specific copy. */
  tithi: z.object({ name: LocaleText, number: z.number().int().min(0).max(30) }),
  nakshatra: z.object({ name: LocaleText }),
  yoga: z.object({ name: LocaleText }).nullable(),
  karana: z.object({ name: LocaleText }).nullable(),
  vara: z.object({ name: LocaleText, day: z.number().int().min(0).max(6) }).nullable(),

  sunrise: z.string().regex(/^\d{2}:\d{2}$/),
  sunset: z.string().regex(/^\d{2}:\d{2}$/),
  rahuKaal: TimeRange.nullable(),
  abhijitMuhurta: TimeRange.nullable(),

  /** First festival entry whose `.date` matches this YYYY-MM-DD; null otherwise. */
  festivalToday: FestivalToday.nullable(),
});

export type PanchangDatePageModel = z.infer<typeof PanchangDatePageModel>;
