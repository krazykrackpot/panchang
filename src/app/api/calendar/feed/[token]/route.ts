/**
 * GET /api/calendar/feed/[token]
 *
 * Per-user personalised vrat iCal feed. Subscribed in Apple/Google
 * Calendar via webcal:// URL — every subscribed vrat's upcoming
 * occurrences (next 12 months) become calendar events with a
 * day-before alarm baked in.
 *
 * Auth: token-only (URL param). Calendar apps can't send Bearer
 * tokens. Token is a 32-byte random value generated on first
 * subscription; rotatable from /settings. Leaking the token only
 * exposes "this user observes these vrats" — minor PII, documented in
 * /privacy.
 *
 * Rate-limit: per-token (not per-IP — calendar providers fetch from
 * shared IP ranges, per-IP would falsely throttle different users'
 * feeds, Gemini #225). 60 req/hour per token = generous for
 * hourly-refresh calendar apps. Per-IP 300/hour fallback catches
 * abuse that rotates tokens.
 *
 * Spec: docs/specs/2026-05-27-vrat-tracker-and-pandit-dashboard.md §9
 */
import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';
import { generateICal, type ICalEvent } from '@/lib/calendar/ical-generator';
import {
  generateUpcomingOccurrences,
  type VratTradition,
} from '@/lib/vrat/generator';
import { tl } from '@/lib/utils/trilingual';
import { localTimeToUtcMs } from '@/lib/utils/timezone';

interface RouteParams { params: Promise<{ token: string }> }

const FEED_WINDOW_DAYS = 365;

export async function GET(request: Request, ctx: RouteParams) {
  const { token } = await ctx.params;
  // ?download=1 switches Content-Disposition to attachment so the
  // browser downloads the .ics file instead of subscribing inline.
  const isDownload = new URL(request.url).searchParams.get('download') === '1';

  // Token shape check before any DB hit — reject malformed early.
  // 32 bytes hex-encoded = 64 chars. Tolerate ±4 chars to allow for
  // base64url variants if we change format later.
  if (!token || token.length < 32 || token.length > 128 || !/^[A-Za-z0-9_-]+$/.test(token)) {
    return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
  }

  // Per-token rate limit (primary).
  const tokenLimit = checkRateLimit(`vrat-feed:${token}`, { maxRequests: 60, windowMs: 3_600_000 });
  if (!tokenLimit.allowed) {
    return new Response('Rate limit', {
      status: 429,
      headers: { 'Retry-After': '3600', 'X-RateLimit-Remaining': '0' },
    });
  }
  // Per-IP coarse abuse ceiling — only kicks in for attackers rotating
  // tokens against the endpoint.
  const ipLimit = checkRateLimit(`vrat-feed-ip:${getClientIP(request)}`, {
    maxRequests: 300, windowMs: 3_600_000,
  });
  if (!ipLimit.allowed) {
    return new Response('Rate limit', { status: 429, headers: { 'Retry-After': '3600' } });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  // Resolve token → user.
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, vrat_tradition, vrat_location_lat, vrat_location_lng, vrat_location_tz, parana_reminder_offset_minutes, preferred_locale')
    .eq('vrat_calendar_token', token)
    .single();

  if (profileError || !profile) {
    // 404 instead of 401: a 401 would tell a probe that the URL pattern
    // is correct but the token is wrong. 404 looks the same as a missing
    // route from an attacker's perspective.
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // No vrat location yet → empty feed is the polite response (calendar
  // apps will keep refreshing). Won't crash.
  if (profile.vrat_location_lat == null || profile.vrat_location_lng == null || !profile.vrat_location_tz) {
    const empty = generateICal({
      calName: 'Dekho Panchang — Your Vrat Calendar',
      timezone: 'UTC',
      events: [],
    });
    return new Response(empty, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600',
      },
    });
  }

  // Fetch the user's subscribed vrats with their reminder prefs.
  const { data: prefs, error: prefsError } = await supabase
    .from('user_vrat_preferences')
    .select('vrat_type, start_date, end_date, remind_day_before, remind_parana')
    .eq('user_id', profile.id)
    .eq('enabled', true);

  if (prefsError) {
    console.error('[vrat-feed] prefs fetch failed:', prefsError.message);
    return NextResponse.json({ error: 'Failed to load feed' }, { status: 500 });
  }

  const tradition: VratTradition = (profile.vrat_tradition as VratTradition) ?? 'smarta';
  const location = {
    lat: Number(profile.vrat_location_lat),
    lng: Number(profile.vrat_location_lng),
    tz: profile.vrat_location_tz as string,
  };
  const reminderOffsetMin = (profile.parana_reminder_offset_minutes as number) ?? 30;
  const locale = (profile.preferred_locale as string) ?? 'en';
  const now = new Date();

  const events: ICalEvent[] = [];

  for (const pref of prefs ?? []) {
    // Honour the subscription's start/end window.
    const startBoundary = pref.start_date ? new Date(`${pref.start_date}T00:00:00Z`) : new Date(0);
    const endBoundary = pref.end_date ? new Date(`${pref.end_date}T23:59:59Z`) : new Date(8.64e15);
    if (now > endBoundary) continue;

    const occurrences = generateUpcomingOccurrences({
      vratSlug: pref.vrat_type as string,
      fromDate: now > startBoundary ? now : startBoundary,
      windowDays: FEED_WINDOW_DAYS,
      location,
      tradition,
      locale,
    });

    for (const occ of occurrences) {
      // Trim if past the user's end_date.
      if (occ.fastDate > (pref.end_date ?? '9999-12-31')) continue;

      const vratName = tl(occ.vrat.name, locale);
      const summary = vratName;
      const descParts: string[] = [tl(occ.vrat.description, locale)];
      descParts.push(`Deity: ${tl(occ.vrat.deity, locale)}`);
      if (occ.fastStartLocal) descParts.push(`Fast starts: ${occ.fastStartLocal}`);
      if (occ.paranaDate && occ.paranaStartLocal && occ.paranaEndLocal) {
        descParts.push(`Parana: ${occ.paranaDate} ${occ.paranaStartLocal}-${occ.paranaEndLocal}`);
      } else if (occ.paranaDate) {
        descParts.push(`Parana date: ${occ.paranaDate}`);
      }
      if (occ.paranaNote) descParts.push(occ.paranaNote);

      const uid = `vrat-${pref.vrat_type}-${occ.fastDate}@dekhopanchang.com`;
      const event: ICalEvent = {
        uid,
        dtstart: occ.fastDate, // all-day event keyed on the fast day
        summary,
        description: descParts.join('\n'),
        categories: ['Vrat', occ.vrat.category],
        url: occ.vrat.pujaSlug
          ? `https://dekhopanchang.com/${locale}/puja/${occ.vrat.pujaSlug}`
          : `https://dekhopanchang.com/${locale}/dashboard/vrats`,
      };

      // Day-before alarm — only if the user opted in. Gemini PR #714.
      if (pref.remind_day_before) {
        event.alarm = {
          trigger: `-PT${24 * 60}M`,
          description: `Tomorrow: ${summary}`,
        };
      }

      events.push(event);

      // Parana timed VEVENT — only if the user opted in. Gemini PR #714.
      if (pref.remind_parana && occ.paranaDate && occ.paranaStartLocal && occ.paranaEndLocal) {
        try {
          const startUtcMs = localTimeToUtcMs(occ.paranaDate, occ.paranaStartLocal, location.tz);
          const endUtcMs   = localTimeToUtcMs(occ.paranaDate, occ.paranaEndLocal,   location.tz);
          if (startUtcMs != null && endUtcMs != null) {
            const toIcalUtc = (ms: number) =>
              new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
            events.push({
              uid: `vrat-${pref.vrat_type}-${occ.fastDate}-parana@dekhopanchang.com`,
              dtstart: toIcalUtc(startUtcMs),
              dtend:   toIcalUtc(endUtcMs),
              summary: `${summary} — Parana`,
              description: [
                `Break fast between ${occ.paranaStartLocal} and ${occ.paranaEndLocal}.`,
                occ.paranaNote ?? '',
              ].filter(Boolean).join('\n'),
              categories: ['Vrat', 'Parana', occ.vrat.category],
              url: event.url,
              alarm: {
                trigger: `-PT${reminderOffsetMin}M`,
                description: `${summary} Parana in ${reminderOffsetMin} min`,
              },
            });
          }
        } catch (err) {
          // Invalid timezone in profile — skip this parana event rather
          // than crashing the entire feed. Gemini PR #714 MED.
          console.error('[vrat-feed] parana local-time conversion failed:', err);
        }
      }
    }
  }

  // Sort chronologically. Strip hyphens before comparing so that all-day
  // dates (YYYY-MM-DD) and timed UTC events (YYYYMMDDTHHmmssZ) sort
  // correctly — '-' (ASCII 45) sorts before '0' (ASCII 48), which would
  // place all all-day events before all timed events. Gemini PR #714 HIGH.
  events.sort((a, b) => a.dtstart.replace(/-/g, '').localeCompare(b.dtstart.replace(/-/g, '')));

  // Dedup by UID — defensive in case the generator emits duplicates.
  const seen = new Set<string>();
  const deduped = events.filter(e => {
    if (seen.has(e.uid)) return false;
    seen.add(e.uid);
    return true;
  });

  const icsContent = generateICal({
    calName: 'Dekho Panchang — Your Vrat Calendar',
    timezone: profile.vrat_location_tz as string,
    events: deduped,
  });

  return new Response(icsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      // webcal:// subscriptions want inline disposition. Download links
      // (?download=1) switch to attachment so the browser saves it.
      'Content-Disposition': `${isDownload ? 'attachment' : 'inline'}; filename="dekho-panchang-vrats.ics"`,
      'Cache-Control': isDownload ? 'no-store' : 'public, s-maxage=3600',
    },
  });
}
