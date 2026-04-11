import { NextResponse } from 'next/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { generateDailyPanchangEmail } from '@/lib/email/templates/daily-panchang';
import { sendEmail } from '@/lib/email/resend-client';
import { getServerSupabase } from '@/lib/supabase/server';

/**
 * Cron endpoint: sends daily panchang email to all opted-in users.
 * Triggered by Vercel Cron or external scheduler.
 * Protected by CRON_SECRET header.
 */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Get all users who opted in for daily panchang email
    // Join user_profiles (prefs + location) with auth.users (email)
    const { data: subscribers, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id, preferred_locale, panchang_location_lat, panchang_location_lng, panchang_location_timezone, panchang_location_name, birth_lat, birth_lng, birth_timezone, birth_place')
      .eq('daily_panchang_email', true);

    if (fetchError || !subscribers?.length) {
      return NextResponse.json({
        sent: 0,
        error: fetchError?.message || 'No subscribers',
      });
    }

    // Fetch emails from auth.users
    const userIds = subscribers.map(s => s.id);
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const emailMap = new Map<string, string>();
    if (authUsers?.users) {
      for (const u of authUsers.users) {
        if (u.email) emailMap.set(u.id, u.email);
      }
    }

    let sent = 0;
    let errors = 0;

    for (const sub of subscribers) {
      try {
        const email = emailMap.get(sub.id);
        // Use panchang location if set, otherwise fall back to birth location
        const lat = sub.panchang_location_lat || sub.birth_lat;
        const lng = sub.panchang_location_lng || sub.birth_lng;
        const tz = sub.panchang_location_timezone || sub.birth_timezone;
        const locName = sub.panchang_location_name || sub.birth_place;
        if (!email || !lat || !lng) continue;

        const now = new Date();
        const tzOffset = tz
          ? getTimezoneOffset(tz, now)
          : 5.5; // fallback IST

        const panchang = computePanchang({
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          day: now.getDate(),
          lat: Number(lat),
          lng: Number(lng),
          tzOffset,
          timezone: tz || undefined,
          locationName: locName || undefined,
        });

        const locale = (sub.preferred_locale === 'hi' ? 'hi' : 'en') as 'en' | 'hi';
        const L = (obj: { en: string; hi: string; sa: string }) => obj[locale] || obj.en;

        const emailData = {
          date: panchang.date,
          vara: L(panchang.vara.name),
          tithi: L(panchang.tithi.name),
          nakshatra: L(panchang.nakshatra.name),
          nakshatraPada: panchang.nakshatra.pada || 1,
          yoga: L(panchang.yoga.name),
          karana: L(panchang.karana.name),
          sunrise: panchang.sunrise,
          sunset: panchang.sunset,
          rahuKaal: `${panchang.rahuKaal.start}–${panchang.rahuKaal.end}`,
          yamaganda: `${panchang.yamaganda.start}–${panchang.yamaganda.end}`,
          amritKalam: panchang.amritKalam ? `${panchang.amritKalam.start}–${panchang.amritKalam.end}` : undefined,
          varjyam: panchang.varjyam ? `${panchang.varjyam.start}–${panchang.varjyam.end}` : undefined,
          locale,
          locationName: locName || `${Number(lat).toFixed(1)}°N, ${Number(lng).toFixed(1)}°E`,
          unsubscribeUrl: `https://dekhopanchang.com/${locale}/settings?unsubscribe=daily`,
        };

        const { subject, html } = generateDailyPanchangEmail(emailData);
        const result = await sendEmail({ to: email, subject, html });
        if (result.success) sent++;
        else errors++;
      } catch {
        errors++;
      }
    }

    return NextResponse.json({ sent, errors, total: subscribers.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

function getTimezoneOffset(timezone: string, date: Date): number {
  try {
    const utc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const local = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (local.getTime() - utc.getTime()) / (3600 * 1000);
  } catch {
    return 5.5;
  }
}
