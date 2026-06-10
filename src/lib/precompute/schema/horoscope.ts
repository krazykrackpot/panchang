/**
 * Page model for /horoscope/[rashi]/[date].
 *
 * Mirrors the DailyHoroscope shape produced by
 * `generateDailyHoroscope({ moonSign, date })`. Locale-independent —
 * each LocaleText carries all 9 visible locales (plus sa) so one
 * Blob serves every locale. The page resolves with `tl(field, locale)`
 * at render time.
 *
 * Versioned via `_v` literal. Bump on breaking shape changes; reader
 * fails soft to live compute on schema mismatch.
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

const AreaScore = z.object({
  score: z.number(),
  text: LocaleText,
});

const TransitSummary = z.object({
  moonTransitSign: z.number().int().min(1).max(12),
  moonTransitSignName: LocaleText,
  moonHouseFromNatal: z.number().int().min(1).max(12),
  jupiterSign: z.number().int().min(1).max(12),
  jupiterSignName: LocaleText,
  jupiterHouse: z.number().int().min(1).max(12),
  saturnSign: z.number().int().min(1).max(12),
  saturnSignName: LocaleText,
  saturnHouse: z.number().int().min(1).max(12),
  rahuSign: z.number().int().min(1).max(12),
  rahuSignName: LocaleText,
  rahuHouse: z.number().int().min(1).max(12),
});

const DailyRemedy = z.object({
  mantra: LocaleText,
  practical: LocaleText,
});

export const HoroscopePageModel = z.object({
  _v: z.literal(1),
  _computedAt: z.string(),

  /** YYYY-MM-DD — the URL date. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Moon-sign id 1-12 (Aries=1 .. Pisces=12). */
  moonSign: z.number().int().min(1).max(12),
  moonSignName: LocaleText,

  /** 1-10. */
  overallScore: z.number(),

  areas: z.object({
    career: AreaScore,
    love: AreaScore,
    health: AreaScore,
    finance: AreaScore,
    spirituality: AreaScore,
  }),

  insight: LocaleText,
  luckyColor: LocaleText,
  luckyNumber: z.number().int(),
  luckyTime: z.string(),
  luckyDirection: LocaleText,

  transitSummary: TransitSummary,
  compatibility: z.array(z.number().int().min(1).max(12)),
  remedy: DailyRemedy,
  dosAndDonts: z.object({
    dos: z.array(LocaleText),
    donts: z.array(LocaleText),
  }),
});

export type HoroscopePageModel = z.infer<typeof HoroscopePageModel>;
