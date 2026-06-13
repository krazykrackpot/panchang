/**
 * Page model for /[locale]/daily/[date]/[city].
 *
 * Bundles the daily article (city-specific, LocaleText) with the
 * 12-rashi horoscope grid (date-only, opaque). One Blob per (date,
 * city) tuple. The horoscope grid is duplicated across cities at
 * the same date — storage trade is small (~10 KB × 57 cities = 570
 * KB per date) and lets the page serve every section from a single
 * cache read instead of 13.
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

const DailyArticleField = z.object({
  slug: z.string(),
  title: LocaleText,
  description: LocaleText,
  body: LocaleText,
  date: z.string(),
  publishedAt: z.string(),
  cityName: z.string().optional(),
});

/** DailyHoroscope has 12+ deeply nested fields (transitSummary,
 *  areas.{career,love,health,finance,spirituality}, remedy,
 *  dosAndDonts). Strict schema is already mirrored in
 *  schema/horoscope.ts but importing it here would cross-couple the
 *  two models; same opaque-inner posture as panchang-city /
 *  hindu-calendar. */
const HoroscopeOpaque = z.record(z.string(), z.unknown());

export const DailyArticlePageModel = z.object({
  _v: z.literal(1),
  _computedAt: z.string(),

  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  city: z.string().regex(/^[a-z][a-z0-9-]*$/),

  article: DailyArticleField,
  /** 12 horoscopes in RASHIS canonical order (id 1..12). */
  horoscopes: z.array(HoroscopeOpaque).length(12),
});

export type DailyArticlePageModel = z.infer<typeof DailyArticlePageModel>;
