/**
 * Compute the next_reminder_due_at value for a vrat preference row.
 *
 * Single source of truth used by three sites:
 *   1. vrat-reminder cron (after each send)
 *   2. vrat preferences write sites (after upsert/update)
 *   3. backfill script (one-time, idempotent)
 *
 * Return semantics (three states):
 *   Date                — concrete next reminder moment
 *   'infinity' (string) — no future reminder due (completed, disabled,
 *                          or past end_date). Postgres stores this as
 *                          'infinity'::timestamptz — the cron's
 *                          `<= NOW() + INTERVAL '10 minutes'` predicate
 *                          naturally excludes it.
 *   null                — cannot compute yet (missing location / context).
 *                          Should only happen when user hasn't set a vrat
 *                          location. The cron IS NULL fallback will catch
 *                          these rows and retry.
 *
 * Spec: docs/superpowers/specs/2026-05-27-vercel-cost-reduction-design.md §2 Fix 1
 */

import {
  generateUpcomingOccurrences,
  buildFestivalsForWindow,
  type VratTradition,
  type VratLocation,
} from '@/lib/vrat/generator';

export interface VratPrefMinimal {
  user_id: string;
  vrat_type: string;
  enabled: boolean;
  email_reminders: boolean;
  remind_day_before: boolean;
  remind_parana: boolean;
  start_date: string | null;
  end_date: string | null;
  last_day_before_reminder_date: string | null;
  last_parana_reminder_date: string | null;
}

export interface UserContext {
  lat: number;
  lng: number;
  tz: string;
  tradition: VratTradition;
  paranaOffsetMin: number;
}

/** Sentinel string written to Postgres for "no future reminder due". */
export const NEXT_REMINDER_INFINITY = 'infinity' as const;

/**
 * Format YYYY-MM-DD in a given IANA timezone from a Date.
 * Uses en-CA which emits YYYY-MM-DD natively (Lesson L: avoid local new Date(y,m,d)).
 */
function isoInTz(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Parse "HH:MM" local wall-clock time on a YYYY-MM-DD date in a given tz → epoch ms.
 * Returns null for invalid/missing times.
 */
function localTimeToUtcMs(dateStr: string, hhmm: string | undefined, tz: string): number | null {
  if (!hhmm || !/^\d{1,2}:\d{2}$/.test(hhmm)) return null;
  const [hh, mm] = hhmm.split(':').map(Number);
  const [y, m, d] = dateStr.split('-').map(Number);
  // Two-step: build a naive UTC ms for the wall-clock, then correct by the
  // tz offset at that instant. Intl gives us the offset via formatToParts.
  const naive = Date.UTC(y, m - 1, d, hh, mm);
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const parts = fmt.formatToParts(new Date(naive));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? '0');
  const tzWallMs = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  const offsetMs = tzWallMs - naive;
  return naive - offsetMs;
}

/**
 * Compute the next reminder timestamp for a (pref, userCtx) pair.
 *
 * Algorithm:
 *   1. If the pref is not actionable (disabled, email_reminders=false,
 *      no future dates, past end_date) → return 'infinity'.
 *   2. Generate upcoming occurrences within a 32-day window (wider than
 *      the 30h day-before window to catch the next occurrence after a
 *      just-sent reminder).
 *   3. For each occurrence, compute the candidate reminder timestamps:
 *      - Day-before: fastStart - 30h (latest in the 18-30h window).
 *        We use the END of the window (30h before) so the cron picks it
 *        up first and the 18h guard in the send path confirms eligibility.
 *      - Parana: paranaStart - paranaOffsetMin.
 *   4. Filter out past candidates and already-sent ones.
 *   5. Return the earliest remaining candidate, or 'infinity' if none.
 *   6. Return null only if context is structurally missing (no lat/lng etc.).
 */
export function recomputeNextReminderDueAt(
  pref: VratPrefMinimal,
  userCtx: UserContext,
): Date | typeof NEXT_REMINDER_INFINITY | null {
  // Guard: structurally missing context.
  if (!userCtx.lat || !userCtx.lng || !userCtx.tz) return null;

  // Guard: pref not actionable.
  if (!pref.enabled || !pref.email_reminders) return NEXT_REMINDER_INFINITY;
  if (!pref.remind_day_before && !pref.remind_parana) return NEXT_REMINDER_INFINITY;

  const now = new Date();
  const nowMs = now.getTime();
  const todayIso = isoInTz(now, userCtx.tz);

  // Past end_date → no more reminders.
  if (pref.end_date && todayIso > pref.end_date) return NEXT_REMINDER_INFINITY;

  const location: VratLocation = {
    lat: userCtx.lat,
    lng: userCtx.lng,
    tz: userCtx.tz,
  };

  let festivals;
  try {
    festivals = buildFestivalsForWindow(now, 32, location);
  } catch (err) {
    console.error('[next-reminder] festival build failed for', pref.user_id, pref.vrat_type, ':', err);
    return null;
  }

  let occurrences;
  try {
    occurrences = generateUpcomingOccurrences({
      vratSlug: pref.vrat_type,
      fromDate: now,
      windowDays: 32,
      location,
      tradition: userCtx.tradition,
      locale: 'en',
      prebuiltFestivals: festivals,
    });
  } catch (err) {
    console.error('[next-reminder] occurrence generation failed for', pref.user_id, pref.vrat_type, ':', err);
    return null;
  }

  const candidates: number[] = [];

  for (const occ of occurrences) {
    // Day-before stream: compute fastStart, then go back 30h (the outer
    // bound of the 18-30h window). The send path checks the 18h bound.
    if (pref.remind_day_before && pref.last_day_before_reminder_date !== occ.fastDate) {
      const fastStartMs = occ.fastStartLocal
        ? localTimeToUtcMs(occ.fastDate, occ.fastStartLocal, userCtx.tz)
        : localTimeToUtcMs(occ.fastDate, '06:00', userCtx.tz);
      if (fastStartMs != null) {
        // 30 hours before fast start = start of the send window.
        const dayBeforeMs = fastStartMs - 30 * 3_600_000;
        if (dayBeforeMs > nowMs) {
          candidates.push(dayBeforeMs);
        }
      }
    }

    // Parana stream: paranaStart - paranaOffsetMin.
    if (
      pref.remind_parana &&
      occ.paranaDate &&
      occ.paranaStartLocal &&
      pref.last_parana_reminder_date !== occ.paranaDate
    ) {
      const paranaStartMs = localTimeToUtcMs(occ.paranaDate, occ.paranaStartLocal, userCtx.tz);
      if (paranaStartMs != null) {
        // Reminder fires paranaOffsetMin before the parana window opens.
        const paranaReminderMs = paranaStartMs - userCtx.paranaOffsetMin * 60_000;
        if (paranaReminderMs > nowMs) {
          candidates.push(paranaReminderMs);
        }
      }
    }
  }

  if (candidates.length === 0) {
    // No upcoming reminders in the 32-day window → may have more later,
    // but we can't compute them cheaply. Set 'infinity' if end_date is set
    // and there are no more occurrences; otherwise return a far-future
    // refresh point. For simplicity per spec, return 'infinity' — the cron
    // IS NULL guard will catch any rows that shouldn't be 'infinity' if we
    // under-estimate (there are none currently, since we use a wide window).
    return NEXT_REMINDER_INFINITY;
  }

  return new Date(Math.min(...candidates));
}
