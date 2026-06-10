/**
 * Page-handler entry point for /horoscope/[rashi]/[date].
 *
 * Sibling to choghadiya/gauri-panchang page-model loaders. Wraps
 * `getPrecomputed` with the canonical engine output as the fallback.
 * One Blob per (rashi, date) covers all 9 visible locales — the page
 * resolves with `tl(field, locale)` at render time.
 *
 * Output is byte-identical (modulo `_computedAt` timestamp) across
 * all four cache states (kill switch off / cold cache / hot Blob /
 * schema-invalid Blob).
 */

import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';
import { getPrecomputed } from './reader';
import { horoscopeKey } from './keys';
import {
  HoroscopePageModel,
  type HoroscopePageModel as HoroscopePageModelT,
} from './schema/horoscope';

interface Args {
  /** YYYY-MM-DD — pre-validated by the route (isStrictYmd). */
  date: string;
  /** Rashi slug (e.g. 'mesha'). */
  rashiSlug: string;
  /** Moon-sign id 1-12. Comes from `getRashiBySlug(slug).id`. */
  moonSign: number;
}

export async function getHoroscopePageModel(args: Args): Promise<HoroscopePageModelT> {
  const { date, rashiSlug, moonSign } = args;

  return await getPrecomputed({
    key: horoscopeKey(rashiSlug, date),
    schema: HoroscopePageModel,
    fallback: async () => {
      // Live compute path — identical to what the page used to inline.
      // The engine is deterministic per (moonSign, date) with all
      // LocaleText fields baked in.
      const h = generateDailyHoroscope({ moonSign, date });
      return {
        _v: 1 as const,
        _computedAt: new Date().toISOString(),
        date: h.date,
        moonSign: h.moonSign,
        moonSignName: h.moonSignName,
        overallScore: h.overallScore,
        areas: h.areas,
        insight: h.insight,
        luckyColor: h.luckyColor,
        luckyNumber: h.luckyNumber,
        luckyTime: h.luckyTime,
        luckyDirection: h.luckyDirection,
        transitSummary: h.transitSummary,
        compatibility: h.compatibility,
        remedy: h.remedy,
        dosAndDonts: h.dosAndDonts,
      };
    },
  });
}
