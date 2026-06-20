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
import { getTrackableVrat } from '@/lib/vrat/trackable-vrats';
// N3 audit fix: import canonical localTimeToUtcMs from timezone.ts instead of
// maintaining a private copy. The algorithm is identical in both callers; a
// single source of truth prevents the two implementations from drifting.
import { localTimeToUtcMs } from '@/lib/utils/timezone';

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
  // C4 audit fix: use null-check (== null) not truthy-check (!) for coordinates.
  // lat=0 (equator) and lng=0 (prime meridian) are VALID coordinates — !0 === true
  // would incorrectly return null for users in Singapore, Nairobi, London, Accra,
  // leaving their next_reminder_due_at NULL forever and hammering the cron.
  if (userCtx.lat == null || userCtx.lng == null || !userCtx.tz) return null;

  // Guard: pref not actionable.
  if (!pref.enabled || !pref.email_reminders) return NEXT_REMINDER_INFINITY;
  if (!pref.remind_day_before && !pref.remind_parana) return NEXT_REMINDER_INFINITY;

  const now = new Date();
  const nowMs = now.getTime();
  const todayIso = isoInTz(now, userCtx.tz);

  // H1/M6 audit fix: honour start_date — don't schedule reminders before the
  // subscription start. Return a near-future Date (start_date at 00:00 UTC) so
  // the cron revisits this row when start_date arrives rather than writing
  // 'infinity' (which would exclude it permanently from the early-exit set).
  if (pref.start_date && todayIso < pref.start_date) {
    const [sy, sm, sd] = pref.start_date.split('-').map(Number);
    // Return the start_date itself so the cron picks it up on that day.
    return new Date(Date.UTC(sy, sm - 1, sd, 0, 0, 0));
  }

  // Past end_date → no more reminders.
  if (pref.end_date && todayIso > pref.end_date) return NEXT_REMINDER_INFINITY;

  const location: VratLocation = {
    lat: userCtx.lat,
    lng: userCtx.lng,
    tz: userCtx.tz,
  };

  // H2 audit fix: use a wider window for annual vrats (365 days) so yearly
  // festivals like Maha Shivaratri, Janmashtami, Navratri etc. are found even
  // when the user subscribes months before the occurrence. The 32-day window
  // was designed for twice-monthly vrats (Ekadashi, Pradosh) and silently
  // returned 'infinity' for annual vrats subscribed early — permanently
  // excluding them from the cron and causing silent reminder-skip.
  const vratCatalogEntry = getTrackableVrat(pref.vrat_type);
  const isAnnualVrat = vratCatalogEntry?.frequency === 'annual';
  // Annual vrats need a 366-day window; all others use 32 days.
  const searchWindowDays = isAnnualVrat ? 366 : 32;

  let festivals;
  try {
    festivals = buildFestivalsForWindow(now, searchWindowDays, location);
  } catch (err) {
    console.error('[next-reminder] festival build failed for', pref.user_id, pref.vrat_type, ':', err);
    return null;
  }

  let occurrences;
  try {
    occurrences = generateUpcomingOccurrences({
      vratSlug: pref.vrat_type,
      fromDate: now,
      windowDays: searchWindowDays,
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
    //
    // Window awareness: if we're already INSIDE the 18-30h window
    // (dayBeforeMs <= nowMs but nowMs < dayBeforeEndMs), the reminder is
    // still due NOW — we should add it as a candidate rather than skip it.
    // dayBeforeEndMs = fastStart - 18h (inner bound of the send window).
    if (pref.remind_day_before && pref.last_day_before_reminder_date !== occ.fastDate) {
      const fastStartMs = occ.fastStartLocal
        ? localTimeToUtcMs(occ.fastDate, occ.fastStartLocal, userCtx.tz)
        : localTimeToUtcMs(occ.fastDate, '06:00', userCtx.tz);
      if (fastStartMs != null) {
        const dayBeforeMs = fastStartMs - 30 * 3_600_000;
        const dayBeforeEndMs = fastStartMs - 18 * 3_600_000; // inner bound
        if (nowMs < dayBeforeEndMs) {
          // Clamp to nowMs so the cron picks it up immediately when we're
          // already inside the window, but schedule for the future otherwise.
          candidates.push(Math.max(dayBeforeMs, nowMs));
        }
      }
    }

    // Parana stream: paranaStart - paranaOffsetMin.
    //
    // Window awareness: the cron's send path uses a ±2.5-minute window
    // around paranaReminderMs. If we're already inside that window
    // (paranaReminderMs <= nowMs < paranaEndMs), the reminder is still due
    // NOW and must be a candidate. Clamping to nowMs ensures the cron picks
    // it up on the current tick rather than skipping it entirely.
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
        // Upper bound of the ±2.5-min send window — still actionable until here.
        // Candidate window: actionable from 35 min before the ideal send
        // time up to the exact moment. Widened from +2.5 → +35 min to
        // survive the 30-min cron cadence. Gemini PR #714 CRITICAL fix.
        const paranaEndMs = paranaReminderMs + 35 * 60_000;
        if (nowMs < paranaEndMs) {
          candidates.push(Math.max(paranaReminderMs, nowMs));
        }
      }
    }
  }

  if (candidates.length === 0) {
    // H2 audit fix: no occurrences in the search window.
    // For annual vrats the window is already 366 days — if nothing was found,
    // the vrat genuinely has no occurrence in the next year (rare edge case,
    // e.g. user subscribed very close to end_date). In that case, infinity is
    // correct — no future reminder is possible within the subscription window.
    //
    // For non-annual vrats the 32-day window may be too narrow if the next
    // occurrence is at the boundary. Return a 30-day refresh date so the cron
    // walks forward and retries rather than writing 'infinity' and silently
    // abandoning the subscription forever.
    if (isAnnualVrat) {
      return NEXT_REMINDER_INFINITY;
    }
    // Non-annual: schedule a check 30 days from now (cron will re-evaluate).
    return new Date(nowMs + 30 * 24 * 3_600_000);
  }

  return new Date(Math.min(...candidates));
}
