/**
 * Vrat reminder cron — every 30 minutes.
 *
 * Cadence rationale: users can set a parana reminder at 15/30/60 min
 * before the parana window opens. At 30-min cadence the worst-case
 * delay is 29 min, so the 15-min offset users may receive their
 * reminder up to 14 min after parana opens — acceptable. Every-5-min
 * was overkill: the cron already short-circuits on most runs via the
 * `next_reminder_due_at` DB predicate (288 → 48 invocations/day).
 *
 * Two reminder streams per (user, vrat) pair:
 *   1. Day-before — sent 18–30h before the fast starts (user's local
 *      evening of the previous day). Body includes the full parana
 *      schedule so users who haven't opted into the parana reminder
 *      still get the times.
 *   2. Parana — sent N minutes (15/30/60, user preference) before the
 *      parana window opens.
 *
 * Per-type dedup (Gemini #225): `last_day_before_reminder_date` and
 * `last_parana_reminder_date` are separate columns so the two streams
 * never collide (e.g., during Navratri the same row can hold both a
 * recent day-before claim AND a recent parana claim).
 *
 * Atomicity (lesson from onboarding-drip P1-18): claim-first with a
 * conditional WHERE, send the email, roll back the claim on send
 * failure so the next run retries.
 *
 * Spec: docs/specs/2026-05-27-vrat-tracker-and-pandit-dashboard.md §8
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';
import {
  generateUpcomingOccurrences,
  buildFestivalsForWindow,
  type VratOccurrence,
  type VratTradition,
} from '@/lib/vrat/generator';
import type { FestivalEntry } from '@/lib/calendar/festival-generator';
import {
  vratDayBeforeEmail,
  vratParanaEmail,
  type VratReminderTemplateData,
} from '@/lib/email/templates/vrat-reminder';
import { getTrackableVrat } from '@/lib/vrat/trackable-vrats';
import { tl } from '@/lib/utils/trilingual';
// N3 audit fix: use canonical localTimeToUtcMs from timezone.ts (removes the
// private copy below). Both callers had identical implementations — a single
// export prevents future drift between the two.
import { localTimeToUtcMs } from '@/lib/utils/timezone';
import {
  recomputeNextReminderDueAt,
  NEXT_REMINDER_INFINITY,
  type VratPrefMinimal,
} from '@/lib/vrat/next-reminder';
import { pickByScript } from "@/lib/utils/locale-fonts";

export const maxDuration = 60;

const SITE_ORIGIN = 'https://dekhopanchang.com';

interface VratPrefRow extends VratPrefMinimal {
  // email_reminders + enabled are required by VratPrefMinimal.
  // Re-declare here for readability — no duplication of values.
  next_reminder_due_at?: string | null;
}

interface UserCtx {
  email: string;
  display_name: string;
  preferred_locale: string;
  tradition: VratTradition;
  lat: number;
  lng: number;
  tz: string;
  paranaOffsetMin: number;
}

/** Format YYYY-MM-DD in a given IANA tz from a Date. */
function isoInTz(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Format "Wednesday, 28 May" in a given IANA tz. */
function prettyDateInTz(dateStr: string, tz: string, locale: string = 'en'): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const at = new Date(Date.UTC(y, m - 1, d, 12)); // noon UTC — safely inside the local day
  return new Intl.DateTimeFormat(pickByScript('en-GB', 'hi-IN', locale), {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(at);
}

export async function GET(req: NextRequest) {
  const authError = verifyCronAuth(req);
  if (authError) return authError;

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  }

  const now = new Date();
  const nowMs = now.getTime();

  // ── Early-exit: skip all work when no reminder is due soon ─────────────
  //
  // Query for any row that might need processing:
  //   - IS NULL: unmigrated row (backfill not yet run). Process once via
  //     the legacy path, then populate next_reminder_due_at. After backfill
  //     completes, IS NULL should never appear again naturally.
  //   - <= NOW() + INTERVAL '35 minutes': concrete due-soon timestamp.
  //     35-min grace = 1 cron cycle (30 min) + 5 min buffer for clock
  //     skew and GH Actions cron drift. At 30-min cadence, any reminder
  //     due within the next 35 min will be caught by this run or the next.
  //   - 'infinity'::timestamptz rows are EXCLUDED: infinity is never <=
  //     any finite timestamp, so completed rows never trigger expensive work.
  //
  // Spec: docs/superpowers/specs/2026-05-27-vercel-cost-reduction-design.md §2.1
  const { data: earlyCheck, error: earlyErr } = await supabase
    .from('user_vrat_preferences')
    .select('user_id')
    .eq('enabled', true)
    .eq('email_reminders', true)
    .or('next_reminder_due_at.is.null,next_reminder_due_at.lte.' + new Date(now.getTime() + 35 * 60_000).toISOString())
    .limit(1);

  if (earlyErr) {
    console.error('[vrat-reminder] early-exit check failed:', earlyErr.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
  if (!earlyCheck || earlyCheck.length === 0) {
    // No reminder due within the next 10 minutes. Skip all expensive work.
    return NextResponse.json({ success: true, checked: 0, sent: 0, mode: 'early-exit' });
  }

  // 1. Pull all eligible subscriptions. Partial index handles the
  //    `enabled AND email_reminders` predicate.
  const { data: prefs, error: prefErr } = await supabase
    .from('user_vrat_preferences')
    .select(
      'user_id, vrat_type, enabled, email_reminders, remind_day_before, remind_parana, start_date, end_date, last_day_before_reminder_date, last_parana_reminder_date, next_reminder_due_at',
    )
    .eq('enabled', true)
    .eq('email_reminders', true);

  if (prefErr) {
    console.error('[vrat-reminder] prefs fetch failed:', prefErr.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
  if (!prefs || prefs.length === 0) {
    return NextResponse.json({ success: true, checked: 0, sent: 0 });
  }

  // 2. Group by user, fetch each user's context once.
  const userIds = Array.from(new Set(prefs.map((p) => p.user_id)));
  const { data: profiles, error: profErr } = await supabase
    .from('user_profiles')
    .select(
      'id, display_name, preferred_locale, vrat_tradition, vrat_location_lat, vrat_location_lng, vrat_location_tz, parana_reminder_offset_minutes',
    )
    .in('id', userIds);

  if (profErr) {
    console.error('[vrat-reminder] profiles fetch failed:', profErr.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  // Build the user-context map. Skip users with no location set — those
  // can't have sunrise-based reminders.
  //
  // Resolve auth emails in PARALLEL (Gemini #234): the previous
  // sequential `for-of` triggered one round-trip per profile, which at
  // scale blew past Vercel's 60s timeout and risked Supabase Auth rate
  // limits. Promise.all + safe destructure handles both the throughput
  // problem and the "data: null on auth error" crash.
  const validProfiles = (profiles ?? []).filter(
    (p) => p.vrat_location_lat != null && p.vrat_location_lng != null && p.vrat_location_tz,
  );
  const userResolutions = await Promise.all(
    validProfiles.map(async (p) => {
      try {
        const { data, error: adminErr } = await supabase.auth.admin.getUserById(p.id);
        if (adminErr) {
          console.error('[vrat-reminder] getUserById failed for', p.id, ':', adminErr.message);
          return null;
        }
        const email = data?.user?.email;
        if (!email) return null;
        const ctx: UserCtx = {
          email,
          display_name: (p.display_name as string) ?? '',
          preferred_locale: (p.preferred_locale as string) ?? 'en',
          tradition: ((p.vrat_tradition as VratTradition) ?? 'smarta'),
          lat: Number(p.vrat_location_lat),
          lng: Number(p.vrat_location_lng),
          tz: p.vrat_location_tz as string,
          paranaOffsetMin: (p.parana_reminder_offset_minutes as number) ?? 30,
        };
        return { id: p.id as string, ctx };
      } catch (err) {
        console.error('[vrat-reminder] profile resolution threw for', p.id, ':', err);
        return null;
      }
    }),
  );
  const userMap = new Map<string, UserCtx>();
  for (const r of userResolutions) {
    if (r) userMap.set(r.id, r.ctx);
  }

  // Group prefs by user so we can amortise festival-calendar generation
  // across all subscribed vrats for the same user (Gemini #234).
  const prefsByUser = new Map<string, VratPrefRow[]>();
  for (const pref of prefs as VratPrefRow[]) {
    const arr = prefsByUser.get(pref.user_id) ?? [];
    arr.push(pref);
    prefsByUser.set(pref.user_id, arr);
  }

  let sent = 0;
  let failed = 0;

  // 3. For each user, build their festival calendar ONCE (covers all
  //    their tithi vrats), then iterate their prefs against it. Every
  //    pref is wrapped in try/catch so a single bad timezone, send
  //    failure, or unexpected exception doesn't blow up the whole run
  //    (Gemini #234 — high-priority error isolation).
  for (const [userId, userPrefs] of prefsByUser) {
    const user = userMap.get(userId);
    if (!user) continue;

    // Pre-build the festival calendar covering the next-2-day window
    // for this user's location. Reused across all their vrat prefs.
    let prebuiltFestivals: FestivalEntry[];
    try {
      prebuiltFestivals = buildFestivalsForWindow(now, 2, {
        lat: user.lat,
        lng: user.lng,
        tz: user.tz,
      });
    } catch (err) {
      console.error('[vrat-reminder] festival build failed for user', userId, ':', err);
      continue;
    }

    for (const pref of userPrefs) {
      try {
        // Honour the subscription's start/end window.
        // H1 audit fix: also enforce start_date — skip sending when the
        // subscription hasn't started yet. Without this, a preference with
        // start_date='2027-01-01' would fire reminders today.
        if (pref.start_date && isoInTz(now, user.tz) < pref.start_date) {
          // Subscription hasn't started yet — don't send.
          // H2 audit fix: persist next_reminder_due_at even for future-start prefs so
          // the IS-NULL early-exit filter stops matching this row every 5 min.
          // Without this persist, rows with next_reminder_due_at IS NULL and a future
          // start_date match the null filter on every cron tick — defeating the
          // skip-ahead optimisation. recomputeNextReminderDueAt will return a date
          // around the start_date (or the first occurrence after it).
          const userCtxForFuture = {
            lat: user.lat,
            lng: user.lng,
            tz: user.tz,
            tradition: user.tradition,
            paranaOffsetMin: user.paranaOffsetMin,
          };
          const futureDue = recomputeNextReminderDueAt(pref, userCtxForFuture);
          if (futureDue !== null) {
            await persistNextReminderDueAt(supabase, pref, futureDue);
          }
          continue;
        }
        if (pref.end_date && isoInTz(now, user.tz) > pref.end_date) {
          // Past end_date — mark as done so future cron ticks skip this row.
          await persistNextReminderDueAt(supabase, pref, NEXT_REMINDER_INFINITY);
          continue;
        }

        const vrat = getTrackableVrat(pref.vrat_type);
        if (!vrat) continue;

        const occurrences = generateUpcomingOccurrences({
          vratSlug: pref.vrat_type,
          fromDate: now,
          windowDays: 2,
          location: { lat: user.lat, lng: user.lng, tz: user.tz },
          tradition: user.tradition,
          locale: user.preferred_locale,
          prebuiltFestivals,
        });

        let anySent = false;

        for (const occ of occurrences) {
          // Day-before stream
          if (
            pref.remind_day_before &&
            pref.last_day_before_reminder_date !== occ.fastDate
          ) {
            const fastStartMs = occ.fastStartLocal
              ? localTimeToUtcMs(occ.fastDate, occ.fastStartLocal, user.tz)
              : localTimeToUtcMs(occ.fastDate, '06:00', user.tz);
            if (fastStartMs != null) {
              const hoursAway = (fastStartMs - nowMs) / 3_600_000;
              if (hoursAway >= 18 && hoursAway <= 30) {
                const result = await sendDayBefore(supabase, pref, user, vrat, occ);
                if (result === 'sent') {
                  sent++;
                  anySent = true;
                  // Update the cached last_day_before_reminder_date so the
                  // next-reminder recompute below sees the current state.
                  pref.last_day_before_reminder_date = occ.fastDate;
                } else if (result === 'failed') {
                  failed++;
                }
              }
            }
          }

          // Parana stream
          if (
            pref.remind_parana &&
            occ.paranaDate &&
            occ.paranaStartLocal &&
            pref.last_parana_reminder_date !== occ.paranaDate
          ) {
            const paranaStartMs = localTimeToUtcMs(occ.paranaDate, occ.paranaStartLocal, user.tz);
            if (paranaStartMs != null) {
              const minutesAway = (paranaStartMs - nowMs) / 60_000;
              const offset = user.paranaOffsetMin;
              // Window: send if we are between (offset + 35 min early) and
              // exactly at the offset. The 35-min backstop = 1 cron cycle
              // (30 min) + 5 min drift buffer. Without this widening, a
              // 30-min cron almost always misses the old ±2.5-min window,
              // leaving anySent=false → next_reminder_due_at never advances
              // → infinite per-cycle DB load. Gemini PR #714 CRITICAL.
              if (minutesAway >= offset - 35 && minutesAway <= offset) {
                const result = await sendParana(supabase, pref, user, vrat, occ);
                if (result === 'sent') {
                  sent++;
                  anySent = true;
                  // Update cached state for next-reminder recompute below.
                  pref.last_parana_reminder_date = occ.paranaDate;
                } else if (result === 'failed') {
                  failed++;
                }
              }
            }
          }
        }

        // After processing (send or no-send), always recompute and persist
        // next_reminder_due_at. This:
        //   - Self-heals NULL rows from before the migration (processed once
        //     via the legacy path here, then the column is populated).
        //   - Advances the timestamp after a successful send so the cron
        //     doesn't retry the same reminder window on the next tick.
        //   - Never leaves a processed row as NULL — spec §2.1 invariant.
        if (anySent || pref.next_reminder_due_at == null) {
          // Only recompute when we sent something or when next_reminder_due_at
          // is NULL (unmigrated row). Using next_reminder_due_at (not
          // last_day_before_reminder_date) is correct here: a row whose
          // last_* columns are non-null but next_reminder_due_at is still NULL
          // would never trigger recompute under the old condition, leaving it
          // NULL forever and breaking the early-exit optimisation.
          // For rows that were already populated and no send happened this
          // tick, skip the extra DB write.
          const userCtx = {
            lat: user.lat,
            lng: user.lng,
            tz: user.tz,
            tradition: user.tradition,
            paranaOffsetMin: user.paranaOffsetMin,
          };
          const nextDue = recomputeNextReminderDueAt(pref, userCtx);
          if (nextDue !== null) {
            await persistNextReminderDueAt(supabase, pref, nextDue);
          }
        }
      } catch (err) {
        console.error(
          '[vrat-reminder] pref processing threw for',
          userId,
          pref.vrat_type,
          ':',
          err,
        );
        failed++;
      }
    }
  }

  return NextResponse.json({
    success: true,
    checked: prefs.length,
    sent,
    failed,
  });
}

type SendResult = 'sent' | 'failed' | 'claimed-by-other' | 'skipped';

/**
 * Persist a computed next_reminder_due_at value for a pref row.
 * Accepts either a Date or the sentinel string 'infinity'.
 *
 * 'infinity' is passed as the literal string so Postgres interprets it as
 * the timestamptz infinity value — never back to NULL after this call.
 * Spec §2.1: no processed row should remain NULL after one cron tick.
 */
async function persistNextReminderDueAt(
  supabase: ReturnType<typeof getServerSupabase>,
  pref: Pick<VratPrefRow, 'user_id' | 'vrat_type'>,
  value: Date | typeof NEXT_REMINDER_INFINITY,
): Promise<void> {
  if (!supabase) return;
  const isoOrInfinity = value === NEXT_REMINDER_INFINITY ? 'infinity' : (value as Date).toISOString();
  const { error } = await supabase
    .from('user_vrat_preferences')
    .update({ next_reminder_due_at: isoOrInfinity })
    .eq('user_id', pref.user_id)
    .eq('vrat_type', pref.vrat_type);
  if (error) {
    console.error('[vrat-reminder] persistNextReminderDueAt failed for', pref.user_id, pref.vrat_type, ':', error.message);
  }
}

// Atomic claim → send → rollback-on-failure for the day-before stream.
async function sendDayBefore(
  supabase: ReturnType<typeof getServerSupabase>,
  pref: VratPrefRow,
  user: UserCtx,
  vrat: NonNullable<ReturnType<typeof getTrackableVrat>>,
  occ: VratOccurrence,
): Promise<SendResult> {
  if (!supabase) return 'skipped';
  const { error: claimErr, count: claimCount } = await supabase
    .from('user_vrat_preferences')
    .update(
      { last_day_before_reminder_date: occ.fastDate },
      { count: 'exact' },
    )
    .eq('user_id', pref.user_id)
    .eq('vrat_type', pref.vrat_type)
    .or(`last_day_before_reminder_date.is.null,last_day_before_reminder_date.neq.${occ.fastDate}`);

  if (claimErr) {
    console.error('[vrat-reminder] day-before claim failed:', claimErr.message);
    return 'failed';
  }
  if (claimCount !== 1) return 'claimed-by-other';

  const tpl = buildTemplateData(user, vrat, occ);
  const { subject, html } = vratDayBeforeEmail(tpl);
  const result = await sendEmail({ to: user.email, subject, html });
  if (!result.success) {
    console.error('[vrat-reminder] day-before send failed:', result.error);
    // Rollback the claim so the next cron tick retries.
    await supabase
      .from('user_vrat_preferences')
      .update({ last_day_before_reminder_date: pref.last_day_before_reminder_date })
      .eq('user_id', pref.user_id)
      .eq('vrat_type', pref.vrat_type)
      .eq('last_day_before_reminder_date', occ.fastDate);
    return 'failed';
  }
  return 'sent';
}

async function sendParana(
  supabase: ReturnType<typeof getServerSupabase>,
  pref: VratPrefRow,
  user: UserCtx,
  vrat: NonNullable<ReturnType<typeof getTrackableVrat>>,
  occ: VratOccurrence,
): Promise<SendResult> {
  if (!supabase) return 'skipped';
  if (!occ.paranaDate) return 'skipped';
  const { error: claimErr, count: claimCount } = await supabase
    .from('user_vrat_preferences')
    .update(
      { last_parana_reminder_date: occ.paranaDate },
      { count: 'exact' },
    )
    .eq('user_id', pref.user_id)
    .eq('vrat_type', pref.vrat_type)
    .or(`last_parana_reminder_date.is.null,last_parana_reminder_date.neq.${occ.paranaDate}`);

  if (claimErr) {
    console.error('[vrat-reminder] parana claim failed:', claimErr.message);
    return 'failed';
  }
  if (claimCount !== 1) return 'claimed-by-other';

  const tpl = buildTemplateData(user, vrat, occ);
  const { subject, html } = vratParanaEmail(tpl);
  const result = await sendEmail({ to: user.email, subject, html });
  if (!result.success) {
    console.error('[vrat-reminder] parana send failed:', result.error);
    await supabase
      .from('user_vrat_preferences')
      .update({ last_parana_reminder_date: pref.last_parana_reminder_date })
      .eq('user_id', pref.user_id)
      .eq('vrat_type', pref.vrat_type)
      .eq('last_parana_reminder_date', occ.paranaDate);
    return 'failed';
  }
  return 'sent';
}

function buildTemplateData(
  user: UserCtx,
  vrat: NonNullable<ReturnType<typeof getTrackableVrat>>,
  occ: VratOccurrence,
): VratReminderTemplateData {
  const locale = user.preferred_locale;
  const dashboardUrl = `${SITE_ORIGIN}/${locale}/dashboard/vrats`;
  const pujaUrl = vrat.pujaSlug ? `${SITE_ORIGIN}/${locale}/puja/${vrat.pujaSlug}` : undefined;
  return {
    displayName: user.display_name,
    vratName: tl(vrat.name, locale),
    deity: tl(vrat.deity, locale),
    fastDate: occ.fastDate,
    fastDateLocal: prettyDateInTz(occ.fastDate, user.tz, locale),
    fastStartLocal: occ.fastStartLocal,
    paranaDate: occ.paranaDate,
    paranaDateLocal: occ.paranaDate ? prettyDateInTz(occ.paranaDate, user.tz, locale) : undefined,
    paranaStartLocal: occ.paranaStartLocal,
    paranaEndLocal: occ.paranaEndLocal,
    paranaNote: occ.paranaNote,
    pujaUrl,
    dashboardUrl,
    unsubscribeUrl: dashboardUrl,
  };
}
