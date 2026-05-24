/**
 * Claim-first sent-anchor for email crons.
 *
 * Backs migration 040's `cron_email_sent` table. Each subscriber-email
 * combination is keyed on (cron_name, user_id, run_date) — the primary
 * key enforces dedup at the DB. The claim happens BEFORE the email
 * send: on Vercel cron retry the second attempt's claim collides with
 * the first attempt's row and the send is skipped.
 *
 * Trade-off: a failed Resend delivery after a successful claim doesn't
 * auto-retry within the same cron run. The next daily/weekly cron will
 * reach the user with the latest content; loss is bounded to one cycle.
 * That's strictly better than the previous bombardment-shape behaviour.
 *
 * Closes Round 3 R3-IDEM-3.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export interface ClaimResult {
  /** True if THIS process claimed the slot (caller should send). */
  claimed: boolean;
  /** Surface DB errors loudly — caller decides whether to fail-loud or skip. */
  error: { message: string; code?: string } | null;
}

/**
 * Atomically claim the (cron_name, user_id, run_date) slot. Returns
 * `claimed: true` only on a fresh insert. Returns `claimed: false` if
 * the row already exists (PG unique violation 23505) — the user was
 * already sent on this run; skip silently.
 *
 * Any other DB error is surfaced via `error` so the cron can log and
 * decide whether to retry the user or skip them.
 */
export async function claimCronEmailSlot(
  supabase: SupabaseClient,
  opts: {
    cronName: string;
    userId: string;
    runDate: string; // YYYY-MM-DD in UTC
  },
): Promise<ClaimResult> {
  const PG_UNIQUE_VIOLATION = '23505';
  const { error } = await supabase
    .from('cron_email_sent')
    .insert({
      cron_name: opts.cronName,
      user_id: opts.userId,
      run_date: opts.runDate,
    });

  if (!error) {
    return { claimed: true, error: null };
  }
  // Unique-violation → already sent today. Silent skip.
  if ((error as { code?: string }).code === PG_UNIQUE_VIOLATION) {
    return { claimed: false, error: null };
  }
  // Real DB error — surface so the cron can log + skip with tagged trace.
  return { claimed: false, error };
}

/**
 * Today's run date in UTC as YYYY-MM-DD. Crons run on UTC schedule;
 * the dedup bucket follows the cron schedule.
 */
export function utcRunDate(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/**
 * ISO-week start (Monday) in UTC as YYYY-MM-DD. Used by weekly-digest
 * so the same week's retry collides with the first attempt regardless
 * of which day within the week the retry fires.
 */
export function utcWeekStartDate(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const offsetToMonday = (day === 0 ? -6 : 1 - day);
  d.setUTCDate(d.getUTCDate() + offsetToMonday);
  return d.toISOString().slice(0, 10);
}

/**
 * Chunk an array into fixed-size batches. Used by the batched cron
 * SELECTs (R3-DX-1 / R3-DX-2) so a `.in('id', allUserIds)` query
 * doesn't exceed the PostgREST URL length limit (~2-8 KB depending on
 * provider) when the user base grows past ~200. Gemini #168 review.
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) throw new Error('chunk size must be > 0');
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

/**
 * Singleton (broadcast) cron lock. Used by social-post / youtube-short
 * etc. — one row per (cron_name, run_date) regardless of user count.
 * Closes Round 3 R3-IDEM-4 / R3-IDEM-5.
 *
 * Same claim-first pattern as `claimCronEmailSlot`: insert with ON
 * CONFLICT DO NOTHING. PG 23505 → already ran today; skip silently.
 */
export async function claimCronSingletonRun(
  supabase: SupabaseClient,
  opts: {
    cronName: string;
    runDate: string;
    metadata?: Record<string, unknown>;
  },
): Promise<ClaimResult> {
  const PG_UNIQUE_VIOLATION = '23505';
  const { error } = await supabase
    .from('cron_singleton_run')
    .insert({
      cron_name: opts.cronName,
      run_date: opts.runDate,
      metadata: opts.metadata ?? null,
    });
  if (!error) return { claimed: true, error: null };
  if ((error as { code?: string }).code === PG_UNIQUE_VIOLATION) {
    return { claimed: false, error: null };
  }
  return { claimed: false, error };
}
