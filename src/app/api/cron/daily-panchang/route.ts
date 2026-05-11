import type { LocaleText } from '@/types/panchang';
import { NextResponse } from 'next/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { generateDailyPanchangEmail } from '@/lib/email/templates/daily-panchang';
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';
import { sendEmail } from '@/lib/email/resend-client';
import { getServerSupabase } from '@/lib/supabase/server';
import { RASHIS } from '@/lib/constants/rashis';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { getVratType } from '@/lib/constants/vrat-types';

/**
 * Cron endpoint: sends daily panchang email to all opted-in users.
 * Triggered by Vercel Cron or external scheduler.
 * Protected by CRON_SECRET header.
 */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (authHeader !== `Bearer ${cronSecret}`) {
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
      .select('id, preferred_locale, panchang_location_lat, panchang_location_lng, panchang_location_timezone, panchang_location_name')
      .eq('daily_panchang_email', true);

    if (fetchError || !subscribers?.length) {
      return NextResponse.json({
        sent: 0,
        error: fetchError?.message || 'No subscribers',
      });
    }

    // Fetch emails from auth.users (paginated — listUsers returns max 1000 per page)
    const userIds = subscribers.map(s => s.id);
    const emailMap = new Map<string, string>();
    let page = 1;
    const perPage = 1000;
    while (true) {
      const { data: authPage, error: authErr } = await supabase.auth.admin.listUsers({ page, perPage });
      if (authErr) {
        console.error('[daily-panchang] listUsers page', page, 'failed:', authErr);
        break;
      }
      if (!authPage?.users || authPage.users.length === 0) break;
      for (const u of authPage.users) {
        if (u.email) emailMap.set(u.id, u.email);
      }
      if (authPage.users.length < perPage) break;
      page++;
    }

    // Fetch kundali snapshots for moon sign data (used for daily rashifal)
    // moon_sign (1-12) and moon_nakshatra (1-27) enable personalized horoscope
    const { data: snapshots } = await supabase
      .from('kundali_snapshots')
      .select('user_id, moon_sign, moon_nakshatra')
      .in('user_id', userIds);

    const snapshotMap = new Map<string, { moonSign: number; moonNakshatra: number }>();
    if (snapshots) {
      for (const s of snapshots) {
        snapshotMap.set(s.user_id, { moonSign: s.moon_sign, moonNakshatra: s.moon_nakshatra });
      }
    }

    // Fetch vrat preferences for all subscribers (for day-before reminders)
    const vratPrefsMap = new Map<string, Set<string>>();
    try {
      const { data: vratPrefs, error: vratErr } = await supabase
        .from('user_vrat_preferences')
        .select('user_id, vrat_type')
        .eq('enabled', true)
        .in('user_id', userIds);

      if (vratErr) {
        console.error('[daily-panchang] vrat prefs fetch failed:', vratErr);
      } else if (vratPrefs) {
        for (const vp of vratPrefs) {
          if (!vratPrefsMap.has(vp.user_id)) vratPrefsMap.set(vp.user_id, new Set());
          vratPrefsMap.get(vp.user_id)!.add(vp.vrat_type);
        }
      }
    } catch (err) {
      console.error('[daily-panchang] vrat prefs error:', err);
      // Non-fatal: send emails without vrat reminders
    }

    let sent = 0;
    let errors = 0;

    for (const sub of subscribers) {
      try {
        const email = emailMap.get(sub.id);
        // Use panchang location ONLY  –  panchang data depends on where the user IS,
        // not where they were born. If no panchang location is set, skip this user
        // rather than sending email with wrong-location data.
        const lat = sub.panchang_location_lat;
        const lng = sub.panchang_location_lng;
        const tz = sub.panchang_location_timezone;
        const locName = sub.panchang_location_name;
        if (!email || !lat || !lng || !tz) {
          // No panchang location configured  –  skip user, don't send wrong data
          continue;
        }

        const now = new Date();
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1;
        const day = now.getUTCDate();
        const tzOffset = getUTCOffsetForDate(year, month, day, tz);

        const panchang = computePanchang({
          year,
          month,
          day,
          lat: Number(lat),
          lng: Number(lng),
          tzOffset,
          timezone: tz || undefined,
          locationName: locName || undefined,
        });

        const locale = (sub.preferred_locale === 'hi' ? 'hi' : 'en') as 'en' | 'hi';
        const L = (obj: LocaleText) => obj[locale] || obj.en;

        // Compute daily rashifal if user has a kundali snapshot with moon sign
        const snapshot = snapshotMap.get(sub.id);
        let horoscopeData: Parameters<typeof generateDailyPanchangEmail>[0]['horoscope'];
        if (snapshot) {
          try {
            const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const horoscope = generateDailyHoroscope({
              moonSign: snapshot.moonSign,
              date: todayStr,
              nakshatra: snapshot.moonNakshatra,
            });
            const rashi = RASHIS[snapshot.moonSign - 1];
            horoscopeData = {
              moonSignName: L(horoscope.moonSignName),
              rashiSlug: rashi?.slug || 'mesh',
              overallScore: horoscope.overallScore,
              insight: L(horoscope.insight),
              areas: {
                career: horoscope.areas.career.score,
                love: horoscope.areas.love.score,
                health: horoscope.areas.health.score,
                finance: horoscope.areas.finance.score,
                spirituality: horoscope.areas.spirituality.score,
              },
              luckyColor: L(horoscope.luckyColor),
              luckyNumber: horoscope.luckyNumber,
            };
          } catch (err) {
            console.error('[daily-panchang] horoscope generation failed for user:', sub.id, err);
            // Non-fatal: send email without rashifal section
          }
        }

        // Compute vrat reminders for tomorrow
        let vratReminders: { name: string; sunrise: string }[] | undefined;
        const userVrats = vratPrefsMap.get(sub.id);
        if (userVrats && userVrats.size > 0) {
          try {
            const tomorrowDate = new Date(Date.UTC(year, month - 1, day + 1));
            const ty = tomorrowDate.getUTCFullYear();
            const tm = tomorrowDate.getUTCMonth() + 1;
            const td = tomorrowDate.getUTCDate();
            const tomorrowStr = `${ty}-${String(tm).padStart(2, '0')}-${String(td).padStart(2, '0')}`;
            const tomorrowWeekday = tomorrowDate.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat

            const festivals = generateFestivalCalendarV2(ty, Number(lat), Number(lng), tz);
            const reminders: { name: string; sunrise: string }[] = [];

            for (const vratId of userVrats) {
              const vt = getVratType(vratId);
              if (!vt) continue;

              if (vt.category === 'weekday' && vt.weekday !== undefined) {
                if (tomorrowWeekday === vt.weekday) {
                  reminders.push({ name: L(vt.name), sunrise: panchang.sunrise });
                }
                continue;
              }

              const categoryMap: Record<string, string[]> = {
                ekadashi: ['ekadashi'],
                pradosham: ['pradosham'],
                chaturthi: ['chaturthi'],
                lunar: vratId === 'purnima' || vratId === 'satyanarayan' ? ['purnima'] : ['amavasya'],
                shivaratri: ['vrat'],
              };
              const cats = categoryMap[vt.category] || [];
              const match = festivals.find(f => {
                if (f.date !== tomorrowStr) return false;
                if (!cats.includes(f.category)) return false;
                if (vt.category === 'shivaratri' && f.slug !== 'masik-shivaratri' && f.slug !== 'maha-shivaratri') return false;
                return true;
              });
              if (match) {
                reminders.push({ name: L(vt.name), sunrise: panchang.sunrise });
              }
            }
            if (reminders.length > 0) vratReminders = reminders;
          } catch (err) {
            console.error('[daily-panchang] vrat reminder failed for user:', sub.id, err);
          }
        }

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
          horoscope: horoscopeData,
          vratReminders,
        };

        const { subject, html } = generateDailyPanchangEmail(emailData);
        const result = await sendEmail({ to: email, subject, html });
        if (result.success) sent++;
        else errors++;
      } catch (err) {
        console.error('[daily-panchang] email send failed:', err);
        errors++;
      }
    }

    return NextResponse.json({ sent, errors, total: subscribers.length });
  } catch (e) {
    console.error('[daily-panchang] cron failed:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// Removed duplicate getTimezoneOffset — using shared getUTCOffsetForDate from @/lib/utils/timezone
