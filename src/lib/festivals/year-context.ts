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
  /** Next-year date in YYYY-MM-DD, or null. Mirrors previousYearDate. */
  nextYearDate: string | null;
  /** Days drift to next-year same festival. Sign convention same as previous. */
  driftToNextYear: number | null;
  /** Next-year weekday name in English ("Sunday"..."Saturday"), or null. */
  nextYearWeekdayEn: string | null;
  /** Previous-year weekday name in English, or null. */
  previousYearWeekdayEn: string | null;
  /**
   * 1-sentence weekday-significance note in English. E.g. Sunday →
   * Surya's day; Monday → Chandra's day. Empty string when the festival
   * doesn't carry strong weekday symbolism (rare). Used to give each
   * year's prose a distinct opening line.
   */
  weekdayNoteEn: string;
}

const REFERENCE_CITY_LAT = 28.6139;   // Delhi — same panchang fingerprint
const REFERENCE_CITY_LNG = 77.2090;   // as the page's `refRow` uses
const REFERENCE_TIMEZONE = 'Asia/Kolkata';

/**
 * `festivalDate` is YYYY-MM-DD (the festival's date in the current `year`).
 * Resolves the previous-year date for the same `slug` via the festival
 * generator and returns the assembled context block.
 */
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * One-sentence weekday-significance note in English. Used to give each
 * year's prose a distinct opening — Diwali on a Sunday reads differently
 * from Diwali on a Wednesday. Drawn from the classical week-day
 * planetary lord (Sun = Sunday, Moon = Monday, ...) and the festival's
 * tradition.
 *
 * The slug is accepted so future per-festival overrides can land here
 * (e.g. Mahashivaratri-on-Monday has unique Sanatani significance).
 * Currently slug-agnostic; refine as content needs.
 */
function weekdaySignificanceEn(weekday: number, _slug: string): string {
  switch (weekday) {
    case 0: return 'Falling on a Sunday gives the day a Surya emphasis — Sun-ruled rites and copper offerings carry extra weight.';
    case 1: return 'Falling on a Monday brings a Chandra emphasis — lunar rites and milk/rice offerings carry extra weight, especially for the moon-sensitive nakshatras.';
    case 2: return 'Falling on a Tuesday gives the day a Mangal emphasis — courage-related rites and red offerings carry extra weight.';
    case 3: return 'Falling on a Wednesday gives the day a Budha emphasis — learning-related rites and green offerings carry extra weight, traditionally favourable for new study.';
    case 4: return 'Falling on a Thursday brings a Guru (Jupiter) emphasis — guru-related rites, yellow offerings and dharmic decisions carry extra weight.';
    case 5: return 'Falling on a Friday gives the day a Shukra emphasis — relationship-related rites and white/silver offerings carry extra weight, traditionally favourable for women\'s vratas.';
    case 6: return 'Falling on a Saturday brings a Shani emphasis — ancestral rites and black-sesame offerings carry extra weight, mitigating Shani\'s shadow.';
    default: return '';
  }
}

function driftDaysFromYearReference(slug: string, refYear: number, refUtc: number): { date: string | null; drift: number | null; weekdayEn: string | null } {
  try {
    const list = generateFestivalCalendarV2(refYear, REFERENCE_CITY_LAT, REFERENCE_CITY_LNG, REFERENCE_TIMEZONE);
    const hit = list.find(f => f.slug === slug);
    if (!hit) return { date: null, drift: null, weekdayEn: null };
    const pm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(hit.date);
    if (!pm) return { date: hit.date, drift: null, weekdayEn: null };
    const pUtc = Date.UTC(Number(pm[1]), Number(pm[2]) - 1, Number(pm[3]));
    // Drift = total Gregorian days between the two festival dates, minus
    // 365. Positive = ref year is *later* in its Gregorian calendar than
    // the reference UTC; negative = earlier. Caller decides sign meaning.
    const totalDays = Math.round((pUtc - refUtc) / 86400000);
    const drift = totalDays - 365 * Math.sign(refYear - new Date(refUtc).getUTCFullYear() || 1);
    const wd = new Date(pUtc).getUTCDay();
    return { date: hit.date, drift, weekdayEn: WEEKDAYS_EN[wd] };
  } catch (err) {
    console.error('[year-context] year-reference compute failed:', refYear, err);
    return { date: null, drift: null, weekdayEn: null };
  }
}

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
      nextYearDate: null,
      driftToNextYear: null,
      nextYearWeekdayEn: null,
      previousYearWeekdayEn: null,
      weekdayNoteEn: '',
    };
  }
  const fy = Number(m[1]);
  const fm = Number(m[2]) - 1;
  const fd = Number(m[3]);
  const utc = Date.UTC(fy, fm, fd);
  const weekday = new Date(utc).getUTCDay();

  // Resolve previous-year same-slug date via the festival generator.
  // Most festivals recur annually so the previous-year calendar will
  // contain the slug; for those that don't (eclipses, occasional
  // observances), returns null.
  const prev = driftDaysFromYearReference(slug, year - 1, utc);
  // Sign for previous-year drift is the conventional one: positive =
  // this year is later than last year by N days, negative = earlier.
  // (driftDaysFromYearReference returned `pUtc - utc`; flip for prev.)
  const driftFromPreviousYear = prev.drift == null ? null : -prev.drift;

  // Next-year same-slug date and drift. Positive = next year is later
  // than this year (typical Adhika-masa pattern); negative = earlier
  // (typical 11-day-shift pattern).
  const next = driftDaysFromYearReference(slug, year + 1, utc);
  const driftToNextYear = next.drift;

  return {
    weekdayEn: WEEKDAYS_EN[weekday],
    weekday,
    vikramSamvat: year + 57,
    shakaSamvat: year - 78,
    driftFromPreviousYear,
    previousYearDate: prev.date,
    previousYearWeekdayEn: prev.weekdayEn,
    nextYearDate: next.date,
    driftToNextYear,
    nextYearWeekdayEn: next.weekdayEn,
    weekdayNoteEn: weekdaySignificanceEn(weekday, slug),
  };
}
