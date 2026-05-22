/**
 * Shared types for the Tithi Calendar feature surface.
 *
 * Previously TithiDayData lived inside `src/components/calendar/TithiMonthGrid.tsx`
 * and was imported by four sibling components and the page. Co-locating with
 * the grid implied the grid "owned" the type, which is misleading — the route
 * handler produces it and the grid, list, header, panel, and page all consume
 * it. Moving here per the type-design review (M9).
 */

import type { LocaleText } from '@/types/panchang';

/** End-time pair attached to lunar elements that transition during the day. */
export interface TithiEndTime {
  /** Local HH:MM (24-hour) when the element transitions. */
  hhmm: string;
  /** True when the transition falls on the calendar day AFTER `date`. */
  nextDay: boolean;
}

/** One day's panchang row as carried through the calendar UI. */
export interface TithiDayData {
  date: string;
  day: number;
  tithiNumber: number;
  tithiName: LocaleText;
  paksha: 'shukla' | 'krishna';
  masa?: { amanta: string; purnimanta: string; isAdhika: boolean };
  festivals: { name: LocaleText; type: string; slug?: string; category?: string }[];
  isToday: boolean;
  nakshatra?: LocaleText;
  nakshatraNum?: number;
  moonRashi?: LocaleText;
  moonRashiNum?: number;
  yoga?: LocaleText;
  karana?: LocaleText;
  sunRashi?: LocaleText;
  sunrise?: string;
  sunset?: string;
  tithiEnd?: TithiEndTime;
  nakshatraEnd?: TithiEndTime;
  yogaEnd?: TithiEndTime;
  moonRashiEnd?: TithiEndTime;
  rahuKaal?: { start: string; end: string };
}

/**
 * Natal personalisation state — was previously two correlated optionals
 * (`natalNakshatra?: number | null`, `natalMoonSign?: number | null`)
 * propagated through 5 components, with each consumer re-implementing
 * the `if (A && B && ...)` guard. Tagged union enforces "either both
 * or neither" at the type level.
 */
export type NatalContext =
  | { kind: 'none' }
  | { kind: 'present'; nakshatra: number; moonSign: number };

/** Build a NatalContext from raw snapshot fields. */
export function makeNatalContext(
  nakshatra: number | null | undefined,
  moonSign: number | null | undefined,
): NatalContext {
  // Both must be valid 1-based indices in their ranges. A corrupted snapshot
  // with 0/NaN/out-of-range is silently treated as "no kundali" — the alt
  // would be to throw and break the whole calendar.
  const validNak = typeof nakshatra === 'number' && nakshatra >= 1 && nakshatra <= 27;
  const validRashi = typeof moonSign === 'number' && moonSign >= 1 && moonSign <= 12;
  if (!validNak || !validRashi) return { kind: 'none' };
  return { kind: 'present', nakshatra: nakshatra as number, moonSign: moonSign as number };
}

/**
 * Monthly context bar values. `masaSolar` was renamed from `masa` to
 * disambiguate — the per-day `masa.amanta` is the LUNAR masa, but this top-
 * level value is sampled from the Sun's sidereal longitude at mid-month
 * (solar approximation). Previously both were called `masa` which risked
 * Lesson M ("two sources for the same conceptual data").
 */
export interface MonthlyContext {
  samvatsara: LocaleText;
  masaSolar: LocaleText;
  ritu: LocaleText;
  ayana: LocaleText;
  /** Decimal degrees, 4 dp. */
  ayanamshaDeg: number;
}
