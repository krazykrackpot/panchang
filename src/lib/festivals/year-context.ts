/**
 * Year-context helpers for /festivals/[slug]/[year] pages.
 *
 * Background: each festival year-variant page had ~35% year-specific
 * dynamic content (festival date, puja muhurat, 12-rashi planetary
 * snapshot) and ~65% static prose shared across years (history,
 * mythology, significance, puja vidhi). Borderline thin year-variants
 * — see docs/specs/2026-06-08-seo-audit-followups.md item #5.
 *
 * This module produces purely computed year-specific facts:
 *
 *   - The weekday this year's festival falls on.
 *   - Days drift from the previous year's date (lunar calendar offset).
 *   - Vikram Samvat + Shaka Samvat year markers.
 *   - A short locale-aware prose sentence summarising the above.
 *
 * The output is rendered inline on the festival/year page so each
 * year-variant carries distinct copy beyond the static prose blocks.
 * No Gemini needed — computation is deterministic given the festival
 * date(s).
 */

import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';

export interface YearContext {
  /** "Sunday" / "Monday" / ... — English-only; UI translates via WEEKDAY_NAMES. */
  weekdayEn: string;
  /** 0..6 (Sun=0). */
  weekday: number;
  /** Vikram Samvat for the festival year. Conventional offset +57. */
  vikramSamvat: number;
  /** Shaka Samvat for the festival year. Conventional offset −78. */
  shakaSamvat: number;
  /**
   * Days drift from the previous year's same festival. Positive means
   * THIS year is later in the Gregorian calendar; negative means earlier.
   * Magnitude is reported relative to 365 days (the typical sidereal
   * gap minus the lunar variance — 11d is the canonical "ten/eleven
   * days earlier" value for Hindu festivals in a non-Adhika-masa year).
   * Null when no previous-year date can be computed (festival doesn't
   * occur in the reference city's panchang for year-1).
   */
  driftFromPreviousYear: number | null;
  /** Previous-year date in YYYY-MM-DD, or null. */
  previousYearDate: string | null;
}

const REFERENCE_CITY_LAT = 28.6139;   // Delhi — same panchang fingerprint
const REFERENCE_CITY_LNG = 77.2090;   // as the page's `refRow` uses
const REFERENCE_TIMEZONE = 'Asia/Kolkata';

/**
 * `festivalDate` is YYYY-MM-DD (the festival's date in the current `year`).
 * Resolves the previous-year date for the same `slug` via the festival
 * generator and returns the assembled context block.
 */
export function computeYearContext(slug: string, year: number, festivalDate: string): YearContext {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(festivalDate);
  if (!m) {
    // Unparseable — return a minimal context. Caller checks weekday > 0
    // to decide whether to render.
    return {
      weekdayEn: '',
      weekday: -1,
      vikramSamvat: year + 57,
      shakaSamvat: year - 78,
      driftFromPreviousYear: null,
      previousYearDate: null,
    };
  }
  const fy = Number(m[1]);
  const fm = Number(m[2]) - 1;
  const fd = Number(m[3]);
  const utc = Date.UTC(fy, fm, fd);
  const weekday = new Date(utc).getUTCDay();
  const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // Resolve previous-year same-slug date via the festival generator.
  // Most festivals recur annually so the previous-year calendar will
  // contain the slug; for those that don't (eclipses, occasional
  // observances), returns null.
  let previousYearDate: string | null = null;
  let driftFromPreviousYear: number | null = null;
  try {
    const prevList = generateFestivalCalendarV2(year - 1, REFERENCE_CITY_LAT, REFERENCE_CITY_LNG, REFERENCE_TIMEZONE);
    const prev = prevList.find(f => f.slug === slug);
    if (prev) {
      previousYearDate = prev.date;
      const pm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(prev.date);
      if (pm) {
        const pUtc = Date.UTC(Number(pm[1]), Number(pm[2]) - 1, Number(pm[3]));
        // Days-difference normalised to "drift from 365 days" — positive
        // = this year is later in the Gregorian calendar, negative = earlier.
        // A typical Hindu festival in a 12-month lunar year drifts ~11
        // days earlier; in an Adhika-masa year ~19 days later.
        const totalDays = Math.round((utc - pUtc) / 86400000);
        driftFromPreviousYear = totalDays - 365;
      }
    }
  } catch (err) {
    console.error('[year-context] prev-year compute failed:', err);
  }
  return {
    weekdayEn: WEEKDAYS_EN[weekday],
    weekday,
    vikramSamvat: year + 57,
    shakaSamvat: year - 78,
    driftFromPreviousYear,
    previousYearDate,
  };
}
