import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';
import { alertEmail } from '@/lib/email/templates/alert';

// Runs daily at 6 AM UTC — checks for dasha transitions and festival reminders
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET?.trim()}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const { data: users } = await supabase
    .from('kundali_snapshots')
    .select('user_id, dasha_timeline, sade_sati');

  if (!users || users.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  for (const snap of users) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('display_name, notification_prefs')
      .eq('id', snap.user_id)
      .maybeSingle();

    const prefs = (profile?.notification_prefs as Record<string, boolean>) || {};

    const { data: { user: authUser } } = await supabase.auth.admin.getUserById(snap.user_id);
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

              const result = await sendEmail({ to: authUser.email, ...email });
              if (result.success) sent++;

              // Also store as in-app notification
              await supabase.from('user_notifications').insert({
                user_id: snap.user_id,
                type: 'dasha_transition',
                title: email.subject,
                body: `${currentAntar.planet} Antardasha ends in ${daysUntilEnd} day(s)`,
              });
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

            const result = await sendEmail({ to: authUser.email, ...email });
            if (result.success) sent++;

            await supabase.from('user_notifications').insert({
              user_id: snap.user_id,
              type: 'sade_sati',
              title: 'Sade Sati Has Begun',
              body: 'Saturn has begun its transit over your Moon sign',
            });
          }
        }
      }
    }
  }

  return NextResponse.json({ sent, total: users.length });
}
