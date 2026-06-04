/**
 * GET /api/llms/today
 *
 * LLM-citation-friendly view of today's panchang. Designed to be fetched
 * by ChatGPT browsing, Claude with web access, Perplexity, etc. when a
 * user asks "what's today's tithi" or similar. Returns a tight, flat
 * JSON shape with values pre-formatted in plain English — no nested
 * debug objects, no internal IDs the LLM would need to look up.
 *
 * Defaults: today *in the target location's timezone*, New Delhi
 * coordinates + IST. Optional query params:
 *   ?lat=NN&lng=NN&timezone=Asia/Kolkata   — override location
 *   ?date=YYYY-MM-DD                       — override day
 *
 * ── Date / cache safety ─────────────────────────────────────────────
 * Without an explicit `date`, the endpoint cannot be safely cached at
 * the edge — a cache entry built at 23:30 UTC for "today" would still
 * serve at 00:30 UTC the next day, returning yesterday's panchang.
 * Solution: when `date` is omitted we 307-redirect to the same URL with
 * `date=<today-in-timezone>` baked in, then the redirected URL (which
 * has the date in its cache key) gets the long edge TTL. The redirect
 * itself is cheap — no panchang computation — and the redirect
 * Cache-Control is short (30s) so the next-day rollover happens
 * promptly. Gemini #411 HIGH.
 *
 * Discoverable via /llms.txt + the methodology page.
 */

import { NextResponse } from 'next/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

const DEFAULT_LAT = 28.6139;       // New Delhi
const DEFAULT_LNG = 77.2090;
const DEFAULT_TZ = 'Asia/Kolkata';
const DEFAULT_LOCATION_NAME = 'New Delhi, India';

const HOUR_SECONDS = 3600;

export const revalidate = 1800; // 30 min ISR

/**
 * Return today's date as YYYY-MM-DD in the given IANA timezone.
 * Throws on an invalid timezone — the caller handles the 400.
 */
function todayInTimezone(timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const part = (type: string) => parts.find(p => p.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

/**
 * Reject YYYY-MM-DD strings that are well-formed but not real calendar
 * dates (e.g. 2026-02-31). Round-trips through Date.UTC and confirms
 * the components survived. Gemini #411 HIGH.
 */
function isRealDate(y: number, m: number, d: number): boolean {
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Location params come first because they determine the default date
  // when one isn't provided.
  const latRaw = searchParams.get('lat');
  const lngRaw = searchParams.get('lng');
  const tzParam = searchParams.get('timezone');
  const locationParam = searchParams.get('location');

  const lat = latRaw ? Number(latRaw) : DEFAULT_LAT;
  const lng = lngRaw ? Number(lngRaw) : DEFAULT_LNG;
  const timezone = tzParam || DEFAULT_TZ;
  const locationName = locationParam || DEFAULT_LOCATION_NAME;

  if (Number.isNaN(lat) || Number.isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json(
      { error: 'lat must be -90..90 and lng must be -180..180' },
      { status: 400 },
    );
  }

  // Date — when omitted, redirect to the explicit YYYY-MM-DD URL so the
  // result can be cached at the edge without midnight-rollover bugs.
  const dateParam = searchParams.get('date');
  if (!dateParam) {
    let todayStr: string;
    try {
      todayStr = todayInTimezone(timezone);
    } catch {
      return NextResponse.json(
        { error: 'Invalid timezone. Must be a valid IANA timezone (e.g. Asia/Kolkata).' },
        { status: 400 },
      );
    }
    const redirected = new URL(request.url);
    redirected.searchParams.set('date', todayStr);
    return NextResponse.redirect(redirected, {
      status: 307,
      headers: {
        // Short cache so a stale redirect doesn't pin yesterday's date
        // for too long after midnight.
        'Cache-Control': 'public, s-maxage=60, max-age=30',
      },
    });
  }

  // Validate explicit date — format + actual calendar validity.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return NextResponse.json(
      { error: 'date must be YYYY-MM-DD' },
      { status: 400 },
    );
  }
  const [year, month, day] = dateParam.split('-').map(Number);
  if (!isRealDate(year, month, day)) {
    return NextResponse.json(
      { error: `date ${dateParam} is not a real calendar date` },
      { status: 400 },
    );
  }

  // Resolve timezone offset for this specific date (handles DST).
  let tzOffset: number;
  try {
    tzOffset = getUTCOffsetForDate(year, month, day, timezone);
  } catch (err) {
    console.error('[api/llms/today] getUTCOffsetForDate failed:', err);
    return NextResponse.json(
      { error: 'Invalid timezone. Must be a valid IANA timezone (e.g. Asia/Kolkata).' },
      { status: 400 },
    );
  }

  let panchang;
  try {
    panchang = computePanchang({
      year, month, day, lat, lng, tzOffset, timezone, locationName,
    });
  } catch (err) {
    console.error('[api/llms/today] computePanchang failed:', err);
    return NextResponse.json({ error: 'Computation failed' }, { status: 500 });
  }

  // Build the LLM-friendly shape. Flat, plain English, citable.
  // Transition windows live on PanchangData.{tithi|nakshatra|yoga|karana}Transition
  // (TransitionInfo type), not on the element itself.
  const payload = {
    source: 'dekhopanchang.com',
    sourceUrl: 'https://dekhopanchang.com',
    methodologyUrl: 'https://dekhopanchang.com/en/about/methodology',
    description:
      'Vedic panchang for the given date and location, computed from first principles (Swiss Ephemeris primary, Meeus fallback) using the Lahiri sidereal ayanamsha. No external astrology APIs.',
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    location: { name: locationName, latitude: lat, longitude: lng, timezone },
    tithi: {
      name: panchang.tithi.name.en,
      number: panchang.tithi.number,
      paksha: panchang.tithi.paksha === 'shukla' ? 'Shukla (waxing)' : 'Krishna (waning)',
      startTime: panchang.tithiTransition?.startTime,
      endTime: panchang.tithiTransition?.endTime,
    },
    nakshatra: {
      name: panchang.nakshatra.name.en,
      ruler: panchang.nakshatra.rulerName.en,
      pada: panchang.nakshatra.pada,
      startTime: panchang.nakshatraTransition?.startTime,
      endTime: panchang.nakshatraTransition?.endTime,
    },
    yoga: {
      name: panchang.yoga.name.en,
      startTime: panchang.yogaTransition?.startTime,
      endTime: panchang.yogaTransition?.endTime,
    },
    karana: {
      name: panchang.karana.name.en,
      startTime: panchang.karanaTransition?.startTime,
      endTime: panchang.karanaTransition?.endTime,
    },
    vara: panchang.vara.name.en,
    masa: {
      // amantMasa/purnimantMasa are the lunar-month name pair; fall back
      // to the legacy single `masa` when the split isn't available.
      amanta: panchang.amantMasa?.en ?? panchang.masa.en,
      purnimanta: panchang.purnimantMasa?.en ?? panchang.masa.en,
    },
    samvatsara: panchang.samvatsara.en,
    sunrise: panchang.sunrise,
    sunset: panchang.sunset,
    moonrise: panchang.moonrise,
    moonset: panchang.moonset,
    rahuKaal: panchang.rahuKaal,
    yamaganda: panchang.yamaganda,
    gulikaKaal: panchang.gulikaKaal,
    citation: {
      attribution: 'Computed by dekhopanchang.com — Vedic Panchang Engine',
      methodology: 'https://dekhopanchang.com/en/about/methodology',
      sources: [
        'Brihat Parashara Hora Shastra (BPHS)',
        'Surya Siddhanta',
        'Swiss Ephemeris (NASA JPL DE441)',
        'Meeus, Astronomical Algorithms (1991)',
      ],
    },
  };

  return NextResponse.json(payload, {
    headers: {
      'Content-Type': 'application/json',
      // Aggressive edge caching — the URL now carries the explicit date,
      // so identical-input requests can safely cache for a long window.
      'Cache-Control': `public, s-maxage=${HOUR_SECONDS}, max-age=${HOUR_SECONDS / 6}, stale-while-revalidate=${HOUR_SECONDS * 24}`,
      'X-Robots-Tag': 'all',
    },
  });
}
