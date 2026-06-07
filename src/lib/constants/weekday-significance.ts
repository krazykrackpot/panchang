/**
 * Weekday-significance intro paragraphs — one per weekday (0=Sunday-6=Saturday),
 * in all 9 locales. Used by the date-keyed page templates as a third
 * differentiation axis on top of tithi-observance (Pass 1) and festival
 * proximity. Adds weekday-level variance (7-way) to break the per-date
 * duplicate-content signal further.
 *
 * Numbering matches JS Date.getUTCDay():
 *   0 = Sunday    → ruled by Surya
 *   1 = Monday    → ruled by Chandra
 *   2 = Tuesday   → ruled by Mangala
 *   3 = Wednesday → ruled by Budha
 *   4 = Thursday  → ruled by Brihaspati
 *   5 = Friday    → ruled by Shukra
 *   6 = Saturday  → ruled by Shani
 *
 * Source: scripts/generate-weekday-significance.py — authored EN via Gemini
 * 2.5 Flash with a Vedic-tradition prompt, translated to 8 locales.
 */
import type { LocaleText } from '@/types/panchang';
import data from './weekday-significance.json';

export interface WeekdaySignificance {
  intro: LocaleText;
}

const WEEKDAY_SIGNIFICANCE = data as Record<string, WeekdaySignificance>;

/**
 * Look up significance for a weekday (0-6). Returns undefined for out-of-range.
 */
export function getWeekdaySignificance(weekday: number): WeekdaySignificance | undefined {
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) return undefined;
  return WEEKDAY_SIGNIFICANCE[String(weekday)];
}
