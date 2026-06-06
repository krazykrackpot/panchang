import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';
import { alertEmail } from '@/lib/email/templates/alert';
import { isSnapshotStale, recomputeSnapshotDirect } from '@/lib/supabase/get-fresh-snapshot';

export const maxDuration = 30; // Cron job — email/notification/sync tasks

// Runs daily at 6 AM UTC  –  checks for dasha transitions and festival reminders
export async function GET(req: Request) {
  try {
  const authError = verifyCronAuth(req);
  if (authError) return authError;

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const { data: users, error: usersErr } = await supabase
    .from('kundali_snapshots')
    .select('user_id, dasha_timeline, sade_sati, computation_version');
  if (usersErr) {
    // Without logging this, a cron run that sends 0 emails for a real DB
    // failure looks identical to "no eligible users" in observability,
    // and dasha-transition alerts can be silently down for days. Audit H8.
    console.error('[cron/email-alerts] users fetch failed:', usersErr.message);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  for (const snap of users) {
    if (isSnapshotStale(snap)) {
      const fresh = await recomputeSnapshotDirect(supabase, snap.user_id);
      if (!fresh) { console.error(`[cron/email-alerts] Could not recompute for ${snap.user_id}`); continue; }
      Object.assign(snap, fresh);
    }
    const { data: profile, error: profileErr } = await supabase
      .from('user_profiles')
      .select('display_name, notification_prefs')
      .eq('id', snap.user_id)
      .maybeSingle();
    if (profileErr) {
      console.error('[cron/email-alerts] profile fetch failed for', snap.user_id, ':', profileErr.message);
      continue;
    }

    const prefs = (profile?.notification_prefs as Record<string, boolean>) || {};

    const { data: { user: authUser }, error: authUserErr } = await supabase.auth.admin.getUserById(snap.user_id);
    if (authUserErr) {
      console.error('[cron/email-alerts] auth.admin.getUserById failed for', snap.user_id, ':', authUserErr.message);
      continue;
    }
    if (!authUser?.email) continue;

    const name = profile?.display_name || 'Friend';

    // Check dasha transitions (antardasha ending within 30 days)
    if (prefs.dasha_transition !== false) {
      const dashaTimeline = (snap.dasha_timeline as { planet: string; startDate: string; endDate: string; subPeriods?: { planet: string; startDate: string; endDate: string }[] }[]) || [];
      const currentMaha = dashaTimeline.find(d => new Date(d.startDate) <= now && now <= new Date(d.endDate));

      if (currentMaha?.subPeriods) {
        const currentAntar = currentMaha.subPeriods.find(s => new Date(s.startDate) <= now && now <= new Date(s.endDate));
        if (currentAntar) {
          const antarEnd = new Date(currentAntar.endDate);
          const daysUntilEnd = Math.ceil((antarEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

          // Alert at exactly 30, 14, 7, and 1 day before
          if ([30, 14, 7, 1].includes(daysUntilEnd)) {
            // Check if we already sent this alert today
            const { data: existing } = await supabase
              .from('user_notifications')
              .select('id')
              .eq('user_id', snap.user_id)
              .eq('type', 'dasha_transition')
              .gte('created_at', new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString())
              .limit(1);

            if (!existing || existing.length === 0) {
              const nextAntarIdx = currentMaha.subPeriods.indexOf(currentAntar) + 1;
              const nextAntar = currentMaha.subPeriods[nextAntarIdx];

              const email = alertEmail({
                name,
                type: 'dasha_transition',
                title: `${currentAntar.planet} Antardasha ends in ${daysUntilEnd} day${daysUntilEnd > 1 ? 's' : ''}`,
                body: nextAntar
                  ? `Your ${currentAntar.planet} Antardasha ends on ${currentAntar.endDate}. ${nextAntar.planet} Antardasha begins next, bringing changes in ${nextAntar.planet}'s significations.`
                  : `Your ${currentAntar.planet} Antardasha ends on ${currentAntar.endDate}. A new phase in your ${currentMaha.planet} Mahadasha begins.`,
                ctaUrl: 'https://dekhopanchang.com/en/dashboard/dashas',
                ctaText: 'View Dasha Timeline',
              });

              // Insert dedup row FIRST so a partial failure can't lead to
              // re-send tomorrow (the existingDasha query above is the dedup
              // anchor). If insert fails, don't send the email — the row is
              // the only signal that prevents bombardment. (Audit P0-13.)
              //
              // BUT: if the email subsequently fails to send, roll the row
              // BACK so the next cron run will retry — otherwise the user
              // never gets the alert at all. Dedup is by id (returned from
              // the insert) so we delete exactly the row we claimed, not a
              // coincidentally-equal row from another flow. (Gemini on #134.)
              const { data: insertedRows, error: insertErr } = await supabase
                .from('user_notifications')
                .insert({
                  user_id: snap.user_id,
                  type: 'dasha_transition',
                  title: email.subject,
                  body: `${currentAntar.planet} Antardasha ends in ${daysUntilEnd} day(s)`,
                })
                .select('id');
              if (insertErr) {
                console.error(`[email-alerts] dasha_transition dedup insert failed for ${snap.user_id}:`, insertErr.message);
                continue;
              }
              const insertedId = insertedRows?.[0]?.id as string | undefined;

              const result = await sendEmail({ to: authUser.email, ...email });
              if (result.success) {
                sent++;
              } else {
                console.error(`[email-alerts] dasha_transition send failed for ${snap.user_id}:`, result.error);
                if (insertedId) {
                  const { error: rollbackErr } = await supabase
                    .from('user_notifications')
                    .delete()
                    .eq('id', insertedId);
                  if (rollbackErr) {
                    console.error(`[email-alerts] dasha_transition rollback failed for ${snap.user_id}:`, rollbackErr.message);
                  }
                }
              }
            }
          }
        }
      }
    }

    // Check Sade Sati onset (within 60 days)
    if (prefs.sade_sati !== false) {
      const sadeSati = snap.sade_sati as { isActive?: boolean; cycleStart?: string; currentPhase?: string } | null;
      if (sadeSati?.isActive && sadeSati.cycleStart) {
        const cycleStart = new Date(sadeSati.cycleStart + '-01-01');
        const daysSinceStart = Math.floor((now.getTime() - cycleStart.getTime()) / (24 * 60 * 60 * 1000));

        // Alert once within first 60 days
        if (daysSinceStart >= 0 && daysSinceStart <= 60) {
          const { data: existing } = await supabase
            .from('user_notifications')
            .select('id')
            .eq('user_id', snap.user_id)
            .eq('type', 'sade_sati')
            .limit(1);

          if (!existing || existing.length === 0) {
            const email = alertEmail({
              name,
              type: 'sade_sati',
              title: 'Sade Sati Has Begun',
              body: `Saturn has begun its 7.5-year transit over your Moon sign. This is a period of transformation and growth through discipline. Visit your dashboard for personalized remedies and guidance.`,
              ctaUrl: 'https://dekhopanchang.com/en/dashboard/remedies',
              ctaText: 'View Remedies',
            });

            // Insert dedup row FIRST (same shape as the dasha branch above).
            // Roll back by id on send failure so the next cron run retries.
            const { data: insertedRows, error: insertErr } = await supabase
              .from('user_notifications')
              .insert({
                user_id: snap.user_id,
                type: 'sade_sati',
                title: 'Sade Sati Has Begun',
                body: 'Saturn has begun its transit over your Moon sign',
              })
              .select('id');
            if (insertErr) {
              console.error(`[email-alerts] sade_sati dedup insert failed for ${snap.user_id}:`, insertErr.message);
              continue;
            }
            const insertedId = insertedRows?.[0]?.id as string | undefined;

            const result = await sendEmail({ to: authUser.email, ...email });
            if (result.success) {
              sent++;
            } else {
              console.error(`[email-alerts] sade_sati send failed for ${snap.user_id}:`, result.error);
              if (insertedId) {
                const { error: rollbackErr } = await supabase
                  .from('user_notifications')
                  .delete()
                  .eq('id', insertedId);
                if (rollbackErr) {
                  console.error(`[email-alerts] sade_sati rollback failed for ${snap.user_id}:`, rollbackErr.message);
                }
              }
            }
          }
        }
      }
    }
  }

  return NextResponse.json({ sent, total: users.length });
  } catch (err) {
    console.error('[email-alerts] error:', err);
    return NextResponse.json({ error: 'Failed to process email alerts' }, { status: 500 });
  }
}
