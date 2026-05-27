/**
 * Vrat Occurrence Generator
 *
 * Per-user, per-vrat upcoming occurrence resolver. Reads from the
 * existing festival generator (single source of truth for tithi-based
 * dates), the catalogue (TRACKABLE_VRATS), and the user's tradition +
 * location to produce a fully-resolved schedule:
 *
 *   - fast date (YYYY-MM-DD)
 *   - fast-start time (typically sunrise local)
 *   - parana date + window times
 *
 * Used by the dashboard "Upcoming" list (PR 2), the personalised iCal
 * feed (PR 2), and the reminder cron (PR 3).
 *
 * Spec: docs/specs/2026-05-27-vrat-tracker-and-pandit-dashboard.md §6
 */
import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import {
  getTrackableVrat,
  type TrackableVrat,
  type ParanaRule,
} from '@/lib/vrat/trackable-vrats';

export interface VratLocation {
  lat: number;
  lng: number;
  /** IANA tz name. */
  tz: string;
}

export type VratTradition = 'smarta' | 'vaishnava';

export interface VratOccurrence {
  /** The vrat being observed. Carries name + deity + pujaSlug for UI. */
  vrat: TrackableVrat;
  /** YYYY-MM-DD in the user's vrat location. */
  fastDate: string;
  /** "HH:MM" local — sunrise on the fast day. May be undefined for
   *  weekday vrats where the generator doesn't compute per-day sunrise. */
  fastStartLocal?: string;
  /** YYYY-MM-DD of the day parana is broken on. Same day as fastDate
   *  for sunset-same-day rules; next day for sunrise rules. */
  paranaDate?: string;
  /** "HH:MM" local. The earliest moment the user can break the fast. */
  paranaStartLocal?: string;
  /** "HH:MM" local. The latest moment the parana window remains valid. */
  paranaEndLocal?: string;
  /** Localized hint surfaced to the user, e.g. "Break at moonrise". */
  paranaNote?: string;
  /** Echoed from the catalogue so callers can branch on rule type. */
  paranaRule: ParanaRule;
}

/**
 * Resolve the effective parana rule given a vrat and tradition.
 * Tradition-dependent vrats use the Vaishnava rule when the user's
 * tradition is 'vaishnava'; the catalogue's `paranaRule` is the Smarta
 * default for tradition-dependent entries.
 */
function effectiveParanaRule(vrat: TrackableVrat, tradition: VratTradition): ParanaRule {
  if (vrat.slug === 'ekadashi' && tradition === 'vaishnava') {
    return 'vaishnava_quarter_dwadashi';
  }
  return vrat.paranaRule;
}

/**
 * Compute the next N occurrences of a weekly weekday vrat starting from
 * `fromDate` (inclusive). Pure date arithmetic in the vrat location's
 * timezone — we treat the date as a local-day rather than UTC because
 * weekday observances follow the local calendar.
 *
 * Returns YYYY-MM-DD strings.
 */
function nextWeeklyDates(weekday: number, fromDate: Date, windowDays: number): string[] {
  const out: string[] = [];
  const start = new Date(Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), fromDate.getUTCDate()));
  const endMs = start.getTime() + windowDays * 86_400_000;
  // Advance to the first matching weekday >= today
  const cur = new Date(start);
  const diff = (weekday - cur.getUTCDay() + 7) % 7;
  cur.setUTCDate(cur.getUTCDate() + diff);
  while (cur.getTime() < endMs) {
    out.push(
      `${cur.getUTCFullYear()}-${String(cur.getUTCMonth() + 1).padStart(2, '0')}-${String(cur.getUTCDate()).padStart(2, '0')}`,
    );
    cur.setUTCDate(cur.getUTCDate() + 7);
  }
  return out;
}

/**
 * Add days to a YYYY-MM-DD string and return the new YYYY-MM-DD.
 * Uses Date.UTC to avoid the local-tz `new Date(y, m-1, d)` Lesson-L pitfall.
 */
function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const ms = Date.UTC(y, m - 1, d) + days * 86_400_000;
  const dt = new Date(ms);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`;
}

/**
 * For weekday vrats only: synthesize a minimal VratOccurrence with no
 * sunrise/parana times. The dashboard UI shows date + day-of-week; the
 * cron's parana reminder is opt-in and weekday vrats default to a
 * coarser "sunrise next day" parana that the UI/email computes from the
 * user's location at render time (out of generator scope for now).
 */
function weeklyOccurrence(vrat: TrackableVrat, date: string): VratOccurrence {
  return {
    vrat,
    fastDate: date,
    paranaDate: addDays(date, 1),
    paranaRule: vrat.paranaRule,
  };
}

/**
 * For festival/tithi vrats: build a VratOccurrence from a FestivalEntry
 * the generator already produced. Carries forward parana times when the
 * generator computed them; falls back to "parana next day" structure
 * otherwise.
 */
function tithiOccurrence(
  vrat: TrackableVrat,
  fest: FestivalEntry,
  tradition: VratTradition,
  locale: string = 'en',
): VratOccurrence {
  const rule = effectiveParanaRule(vrat, tradition);
  const paranaDate = fest.paranaDate
    ?? (rule === 'sunset_same_day' ? fest.date : addDays(fest.date, 1));
  return {
    vrat,
    fastDate: fest.date,
    fastStartLocal: fest.paranaSunrise, // generator's sunrise for the day
    paranaDate,
    paranaStartLocal: fest.paranaStart,
    paranaEndLocal: fest.paranaEnd,
    paranaNote:
      fest.paranaNote
        ? (fest.paranaNote as Record<string, string>)[locale]
          ?? (fest.paranaNote as Record<string, string>).en
        : undefined,
    paranaRule: rule,
  };
}

/**
 * Match a FestivalEntry against a catalogue entry's calendarSlug,
 * honouring the Ekadashi wildcard sentinel ('ekadashi' matches any
 * `*-ekadashi` slug since the festival generator emits named ekadashi
 * slugs rather than a generic one).
 */
function festivalMatches(f: FestivalEntry, vrat: TrackableVrat): boolean {
  if (!f.slug) return false;
  if (vrat.calendarSlug === 'ekadashi') {
    return f.slug.endsWith('-ekadashi');
  }
  return f.slug === vrat.calendarSlug;
}

export interface GenerateUpcomingOptions {
  vratSlug: string;
  /** Inclusive start. Defaults to "now". */
  fromDate?: Date;
  /** How many days forward to scan. Defaults to 90. */
  windowDays?: number;
  location: VratLocation;
  tradition: VratTradition;
  /** Locale for paranaNote resolution. Defaults to 'en'. */
  locale?: string;
}

/**
 * Main entry point. Returns occurrences sorted ascending by fastDate.
 *
 * For tithi-based vrats: walks `generateFestivalCalendarV2` for the
 * relevant year(s) and filters to entries matching the catalogue's
 * `calendarSlug`. For weekday vrats: enumerates the next matching
 * weekdays in the window.
 */
export function generateUpcomingOccurrences(
  opts: GenerateUpcomingOptions,
): VratOccurrence[] {
  const vrat = getTrackableVrat(opts.vratSlug);
  if (!vrat) return [];

  const from = opts.fromDate ?? new Date();
  const windowDays = opts.windowDays ?? 90;
  const tradition = opts.tradition;
  const locale = opts.locale ?? 'en';

  // Format YYYY-MM-DD in the vrat *location's* timezone (Gemini #227). A
  // user in Asia/Kolkata fasting on "today" must compare against entries
  // dated in their local day, not UTC. en-CA emits YYYY-MM-DD natively.
  const isoFmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: opts.location.tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const fromIso = isoFmt.format(from);

  // Weekly vrats: pure arithmetic.
  if (vrat.category === 'weekday' && typeof vrat.weekday === 'number') {
    return nextWeeklyDates(vrat.weekday, from, windowDays).map((d) =>
      weeklyOccurrence(vrat, d),
    );
  }

  // Tithi / festival vrats: walk the festival calendar across every
  // calendar year the window touches. A loop is more robust than the
  // earlier two-year special case for windows > 366 days (Gemini #227).
  const windowEnd = new Date(from.getTime() + windowDays * 86_400_000);
  const windowEndIso = isoFmt.format(windowEnd);
  const startYear = Number(fromIso.slice(0, 4));
  const endYear = Number(windowEndIso.slice(0, 4));
  const generatedFests: FestivalEntry[] = [];
  for (let y = startYear; y <= endYear; y++) {
    generatedFests.push(
      ...generateFestivalCalendarV2(y, opts.location.lat, opts.location.lng, opts.location.tz),
    );
  }

  return generatedFests
    .filter((f) => f.date >= fromIso && f.date <= windowEndIso && festivalMatches(f, vrat))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((f) => tithiOccurrence(vrat, f, tradition, locale));
}
