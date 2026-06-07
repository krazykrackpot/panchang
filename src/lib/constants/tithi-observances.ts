/**
 * Tithi-observance intro paragraphs — one per tithi (1-30), in all 9 locales.
 *
 * Background: date-keyed pages (/choghadiya/[date], /panchang/date/[date],
 * /gauri-panchang/[date]) were rendering near-identical bodies across
 * adjacent dates — within-locale Jaccard 81-86%. This data table provides
 * a per-tithi paragraph that materially differentiates each date's body
 * (a given calendar date maps to one of 30 tithis), without cutting the
 * 7-day forward window.
 *
 * Numbering matches src/lib/constants/tithis.ts:
 *   1-15 = shukla paksha (waxing Moon): Pratipada → Purnima
 *   16-30 = krishna paksha (waning Moon): Pratipada → Amavasya (30)
 *
 * Source: scripts/generate-tithi-observances.py — authored EN via Gemini 2.5
 * Flash, translated to mai/mr/ta/te/bn/gu/kn via the same model. The
 * paragraphs cover the presiding deity, the tithi's character (favourable
 * activities), and one traditional observance. ~60-90 words each in EN.
 */
import type { LocaleText } from '@/types/panchang';
import data from './tithi-observances.json';

export interface TithiObservance {
  intro: LocaleText;
}

const TITHI_OBSERVANCES = data as Record<string, TithiObservance>;

/**
 * Look up the observance for a tithi number (1-30, 1-based).
 * Returns undefined for out-of-range numbers (callers can skip the section).
 */
export function getTithiObservance(tithiNumber: number): TithiObservance | undefined {
  if (!Number.isInteger(tithiNumber) || tithiNumber < 1 || tithiNumber > 30) {
    return undefined;
  }
  return TITHI_OBSERVANCES[String(tithiNumber)];
}
