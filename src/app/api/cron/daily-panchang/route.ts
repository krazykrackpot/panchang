import type { LocaleText } from '@/types/panchang';
import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
// isSnapshotStale / recomputeSnapshotDirect intentionally NOT imported.
// The email cron only needs moon_sign + moon_nakshatra for rashifal.
// Those change by at most 1 nakshatra per day; serving a slightly stale
// value is acceptable for an email vs the cost of recomputeSnapshotDirect
// (full kundali engine run × every subscriber). Snapshots refresh on
// the user's next kundali page visit via the normal ISR/precompute path.
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { generateDailyPanchangEmail } from '@/lib/email/templates/daily-panchang';
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';
import { sendEmail } from '@/lib/email/resend-client';
import { getServerSupabase } from '@/lib/supabase/server';
import { RASHIS } from '@/lib/constants/rashis';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { getTrackableVrat } from '@/lib/vrat/trackable-vrats';
import { claimCronEmailSlot, utcRunDate } from '@/lib/cron/email-sent-anchor';

// Batch email send — scales with subscriber count. At ~50 users 30s is fine.
// If this starts timing out: switch to Vercel Queue or chunk into batches of 50.
export const maxDuration = 60;

/**
 * Cron endpoint: sends daily panchang email to all opted-in users.
 * Triggered by Vercel Cron or external scheduler.
 * Protected by CRON_SECRET header.
 */
export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

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

    if (fetchError) {
      // 5xx on DB error so Vercel scheduler marks the cron as failed.
      // The previous code returned 200 with the error in the body, which
      // looked like "success: 0 emails sent" in observability and let
      // a real DB outage go undetected for days. Audit Round 2.
      console.error('[cron/daily-panchang] subscribers fetch failed:', fetchError.message);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    if (!subscribers?.length) {
      return NextResponse.json({ sent: 0, reason: 'No subscribers' });
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
    // moon_sign (1-12) and moon_nakshatra (1-27) enable personalized horoscope.
    // If the query fails, every subscriber's email falls back to a generic
    // (wrong moon-sign) rashifal — log loudly so a regression is visible
    // in production instead of silently shipping wrong content. Audit H7.
    const { data: snapshots, error: snapshotsErr } = await supabase
      .from('kundali_snapshots')
      .select('user_id, moon_sign, moon_nakshatra, computation_version')
      .in('user_id', userIds);
    if (snapshotsErr) {
      // Return 500 so the cron is marked as failed by Vercel's scheduler
      // — falling through with an empty snapshotMap would silently send
      // every subscriber a generic (wrong moon-sign) rashifal email.
      // Audit H7 + Gemini #111 review.
      console.error('[cron/daily-panchang] snapshots fetch failed:', snapshotsErr.message);
      return NextResponse.json({ error: 'Failed to fetch snapshots' }, { status: 500 });
    }

    // Use the stored moon_sign/moon_nakshatra as-is. Skipping staleness
    // recomputation: the full kundali engine run per subscriber was the
    // largest CPU cost in this cron. Moon sign changes by at most 1-2
    // nakshatras per day — acceptable for an email rashifal. Snapshots
    // refresh on the user's next kundali page visit via normal ISR path.
    const snapshotMap = new Map<string, { moonSign: number; moonNakshatra: number }>();
    if (snapshots) {
      for (const s of snapshots) {
        // Validate moon_sign (1-12) and moon_nakshatra (1-27) before use.
        // Skips null/undefined and out-of-range values defensively —
        // corrupted snapshots would otherwise crash generateDailyHoroscope.
        const moonSign = s.moon_sign as unknown;
        const moonNak = s.moon_nakshatra as unknown;
        if (typeof moonSign !== 'number' || !Number.isInteger(moonSign) || moonSign < 1 || moonSign > 12) continue;
        if (typeof moonNak !== 'number' || !Number.isInteger(moonNak) || moonNak < 1 || moonNak > 27) continue;
        snapshotMap.set(s.user_id, { moonSign, moonNakshatra: moonNak });
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
    let skipped = 0;
    // Round 3 R3-IDEM-3 — per-user sent anchor. Vercel cron retries on 502
    // previously re-sent every email. claim_first via cron_email_sent
    // (migration 040) collides on the second attempt so the user gets at
    // most one email per UTC day.
    const runDate = utcRunDate();

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

        // Use Intl.DateTimeFormat for reliable timezone-aware date extraction (Lesson L).
        // new Date(toLocaleString(...)) is implementation-dependent and can break across Node versions.
        const dateParts = new Intl.DateTimeFormat('en-US', {
          timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric',
        }).formatToParts(new Date());
        const year = parseInt(dateParts.find(p => p.type === 'year')!.value);
        const month = parseInt(dateParts.find(p => p.type === 'month')!.value);
        const day = parseInt(dateParts.find(p => p.type === 'day')!.value);
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

            for (const vratSlug of userVrats) {
              const vt = getTrackableVrat(vratSlug);
              if (!vt) continue;

              // Weekday vrats: simple weekday match against tomorrow.
              if (vt.category === 'weekday' && typeof vt.weekday === 'number') {
                if (tomorrowWeekday === vt.weekday) {
                  reminders.push({ name: L(vt.name), sunrise: panchang.sunrise });
                }
                continue;
              }

              // Everything else: match calendarSlug against the festival
              // generator output. Ekadashi is the wildcard sentinel — the
              // generator emits named slugs (kamada-ekadashi etc.) instead
              // of a generic `ekadashi`, so `calendarSlug: 'ekadashi'` in
              // the catalogue matches any `*-ekadashi` slug. Gemini #226.
              const match = festivals.find((f) => {
                if (f.date !== tomorrowStr) return false;
                if (vt.calendarSlug === 'ekadashi') {
                  return Boolean(f.slug?.endsWith('-ekadashi'));
                }
                return f.slug === vt.calendarSlug;
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

        // Claim the (cron, user, date) slot BEFORE sending. If another
        // cron invocation (retry / manual re-trigger) already sent today,
        // the claim collides and we silently skip.
        const { claimed, error: claimErr } = await claimCronEmailSlot(supabase, {
          cronName: 'daily-panchang',
          userId: sub.id,
          runDate,
        });
        if (claimErr) {
          console.error('[daily-panchang] claim failed for', sub.id, ':', claimErr.message);
          errors++;
          continue;
        }
        if (!claimed) {
          skipped++;
          continue; // already sent today
        }

        const { subject, html } = generateDailyPanchangEmail(emailData);
        const result = await sendEmail({ to: email, subject, html });
        if (result.success) sent++;
        else errors++;
      } catch (err) {
        console.error('[daily-panchang] email send failed:', err);
        errors++;
      }
    }

    return NextResponse.json({ sent, errors, skipped, total: subscribers.length });
  } catch (e) {
    // P2-19 — generic to client; detail in logs.
    console.error('[daily-panchang] cron failed:', e);
    return NextResponse.json(
      { error: 'Daily panchang cron failed' },
      { status: 500 },
    );
  }
}

// Removed duplicate getTimezoneOffset — using shared getUTCOffsetForDate from @/lib/utils/timezone
