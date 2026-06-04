/**
 * GET /api/llms/today
 *
 * LLM-citation-friendly view of today's panchang. Designed to be fetched
 * by ChatGPT browsing, Claude with web access, Perplexity, etc. when a
 * user asks "what's today's tithi" or similar. Returns a tight, flat
 * JSON shape with values pre-formatted in plain English — no nested
 * debug objects, no internal IDs the LLM would need to look up.
 *
 * Defaults: today (UTC), New Delhi coordinates + IST. Optional query
 * params:
 *   ?lat=NN&lng=NN&timezone=Asia/Kolkata   — override location
 *   ?date=YYYY-MM-DD                       — override day
 *
 * Cached at the edge: 1h s-maxage, with 24h SWR. The result is
 * identical per-date-per-location so the LLM can hammer it without
 * pressuring the engine.
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Date
  const dateParam = searchParams.get('date');
  let year: number, month: number, day: number;
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    [year, month, day] = dateParam.split('-').map(Number);
  } else {
    const now = new Date();
    year = now.getUTCFullYear();
    month = now.getUTCMonth() + 1;
    day = now.getUTCDate();
  }

  // Location
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

  const tzOffset = getUTCOffsetForDate(year, month, day, timezone);

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
      // Aggressive edge caching — LLM crawlers can hit this endpoint
      // frequently and the result is identical per-date-per-location.
      'Cache-Control': `public, s-maxage=${HOUR_SECONDS}, max-age=${HOUR_SECONDS / 6}, stale-while-revalidate=${HOUR_SECONDS * 24}`,
      'X-Robots-Tag': 'all',
    },
  });
}
