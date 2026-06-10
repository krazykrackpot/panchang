#!/usr/bin/env tsx
/**
 * recover-nps-feedback-sends.ts
 *
 * One-shot recovery for the 2026-06-06 NPS_TOKEN_SECRET rotation
 * incident. Every NPS feedback email sent before that rotation
 * carried a token signed with the old secret. After the rotation
 * those tokens HMAC-mismatch the current secret and the
 * /api/feedback/nps endpoint 400s every click — the corresponding
 * users land on a JSON error page and the operator hears nothing.
 *
 * The fix:
 *   - First-line: deploy the v2 rotation-safe token + NPS_TOKEN_SECRET_PREV
 *     workflow (this PR). Future rotations will not silently break
 *     in-flight emails.
 *   - Recovery for this incident: clear `nps_feedback_sent_at` on
 *     affected user_profiles so the next /api/cron/nps-feedback run
 *     re-sends each one with a freshly-signed (and now rotation-safe)
 *     token.
 *
 * SAFETY
 *   - Dry-run by default. Pass --apply to actually update rows.
 *   - --cutoff defaults to 2026-06-06 (the rotation date). Override
 *     if you need to recover a different window.
 *   - The cron's claim-first / send-after / rollback-on-failure
 *     pattern means a single re-send attempt is safe — failure rolls
 *     back the timestamp and the next cron tick retries.
 *   - The cron also still respects the 3-day post-engagement gate,
 *     so users with very recent saves will not be re-emailed before
 *     the gate clears.
 *
 * USAGE
 *   npx tsx scripts/recover-nps-feedback-sends.ts                  # dry-run
 *   npx tsx scripts/recover-nps-feedback-sends.ts --apply
 *   npx tsx scripts/recover-nps-feedback-sends.ts --cutoff=2026-06-06 --apply
 *
 * REQUIRES
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in env.
 */

import { createClient } from '@supabase/supabase-js';

const DEFAULT_CUTOFF = '2026-06-06T00:00:00Z';

interface Args {
  cutoff: string;
  apply: boolean;
}

function parseArgs(argv: string[]): Args {
  let cutoff = DEFAULT_CUTOFF;
  let apply = false;
  for (const arg of argv) {
    if (arg === '--apply') apply = true;
    else if (arg.startsWith('--cutoff=')) cutoff = arg.slice('--cutoff='.length);
  }
  // Normalise to ISO Z if just a date was passed.
  if (/^\d{4}-\d{2}-\d{2}$/.test(cutoff)) cutoff = `${cutoff}T00:00:00Z`;
  return { cutoff, apply };
}

async function main(): Promise<void> {
  const { cutoff, apply } = parseArgs(process.argv.slice(2));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
    process.exit(1);
  }
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Pull every affected profile up front so we can show the operator
  // exactly what would change. Use `count: 'exact'` so the operator
  // sees the TRUE total even when PostgREST truncates the `.select()`
  // results to its default 1000-row page (an unattended .update()
  // below would still touch every matching row — divergence between
  // the two would silently mislead the operator). Gemini #666 round 2.
  const { data: affected, count: totalAffected, error } = await supabase
    .from('user_profiles')
    .select('id, display_name, nps_feedback_sent_at', { count: 'exact' })
    .lte('nps_feedback_sent_at', cutoff)
    .order('nps_feedback_sent_at', { ascending: true });
  if (error) {
    console.error('Query failed:', error.message);
    process.exit(1);
  }

  const trueCount = totalAffected ?? affected?.length ?? 0;
  const shownCount = affected?.length ?? 0;
  const truncated = trueCount > shownCount;

  console.log(`Cutoff: ${cutoff}`);
  console.log(`Mode:   ${apply ? 'APPLY' : 'DRY-RUN'}`);
  console.log(`Found:  ${trueCount} user_profiles with nps_feedback_sent_at <= cutoff`);
  if (truncated) {
    console.log(`        (showing first ${shownCount}; ${trueCount - shownCount} more exist past the API page limit)`);
  }
  console.log('');

  if (trueCount === 0) {
    console.log('Nothing to do.');
    return;
  }

  for (const row of affected ?? []) {
    console.log(
      `  ${row.id}  ${row.nps_feedback_sent_at}  ${row.display_name ?? '(no name)'}`,
    );
  }
  console.log('');

  if (!apply) {
    console.log('Dry-run only. Re-run with --apply to clear nps_feedback_sent_at on these rows.');
    return;
  }

  // Apply: clear the timestamp so the next daily cron re-sends.
  const { error: updateErr, count: updatedCount } = await supabase
    .from('user_profiles')
    .update({ nps_feedback_sent_at: null }, { count: 'exact' })
    .lte('nps_feedback_sent_at', cutoff);

  if (updateErr) {
    console.error('Update failed:', updateErr.message);
    process.exit(1);
  }

  console.log(`Cleared nps_feedback_sent_at on ${updatedCount ?? '?'} row(s).`);
  if (updatedCount !== null && updatedCount !== trueCount) {
    console.warn(
      `Note: update touched ${updatedCount} rows, dry-run preview reported ${trueCount}. ` +
        'A small drift can happen if a profile was modified between the two queries; investigate if the gap is large.',
    );
  }
  console.log('Next /api/cron/nps-feedback run will re-send with a v2 (rotation-safe) token.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
