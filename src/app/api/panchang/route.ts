import type { LocaleText } from '@/types/panchang';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { buildYearlyTithiTable, lookupTithiAtSunrise } from '@/lib/calendar/tithi-table';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { dateToJD } from '@/lib/ephem/astronomical';
import { sunriseUTHours } from '@/lib/ephem/swiss-ephemeris';
import { CITIES } from '@/lib/constants/cities';
import { getPanchangCityPageModel } from '@/lib/precompute/panchang-city-page-model';

const panchangSchema = z.object({
  year: z.coerce.number().int().min(1900).max(2200),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  tz: z.coerce.number().min(-12).max(14).optional(),
  timezone: z.string().max(100).optional(), // IANA timezone (e.g., 'Europe/Zurich')
  location: z.string().max(200).optional(),
  /** Optional hint from city-page consumers. If present AND resolves to a
   *  known city, short-circuit through the precompute Blob and skip the
   *  full live-compute pipeline below. Other callers (root /panchang with
   *  arbitrary geo coords) omit this and live-compute as before. */
  citySlug: z.string().regex(/^[a-z][a-z0-9-]*$/).max(60).optional(),
});

export async function GET(request: Request) {
  // Rate limiting
  const ip = getClientIP(request);
  const { allowed, remaining } = checkRateLimit(ip, { maxRequests: 120, windowMs: 60000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before making more requests.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'Retry-After': '60' } }
    );
  }

  const { searchParams } = new URL(request.url);
  const now = new Date();

  // Parse and validate with Zod
  const parsed = panchangSchema.safeParse({
    year: searchParams.get('year') || now.getFullYear(),
    month: searchParams.get('month') || (now.getMonth() + 1),
    day: searchParams.get('day') || now.getDate(),
    lat: searchParams.get('lat') || '0', // DEPRECATED fallback: client should always provide location
    lng: searchParams.get('lng') || '0', // DEPRECATED fallback: client should always provide location
    tz: searchParams.get('tz') || undefined,
    timezone: searchParams.get('timezone') || undefined,
    location: searchParams.get('location') || undefined,
    citySlug: searchParams.get('citySlug') || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid parameters', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { year, month, day, lat, lng, tz, timezone, location, citySlug } = parsed.data;

  // Reject requests with no real location — 0,0 is Null Island, not a valid user location
  if (lat === 0 && lng === 0) {
    return NextResponse.json(
      { error: 'Location required. Provide lat and lng parameters.' },
      { status: 400 }
    );
  }

  // Precompute short-circuit: when the caller passes a valid citySlug,
  // try the Blob first. Live compute below remains the fallback for
  // (a) callers with no citySlug, (b) unknown city slugs, (c) Blob miss.
  if (citySlug) {
    const city = CITIES.find((c) => c.slug === citySlug);
    if (city) {
      try {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const model = await getPanchangCityPageModel({ date: dateStr, city });
        const body: Record<string, unknown> = { ...model.panchang };
        if (model.tithiTable) body.tithiTable = model.tithiTable;
        if (model.festivals) body.festivals = model.festivals;
        return NextResponse.json(body, {
          headers: {
            'X-RateLimit-Remaining': remaining.toString(),
            'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=43200',
            'X-Panchang-Source': 'precompute',
          },
        });
      } catch (err) {
        // Reader contract is "never throw" — but defence in depth: if
        // anything escapes, drop to live compute rather than 500.
        console.error('[API/panchang] precompute path failed (falling back to live):', err);
      }
    }
  }

  // Resolve timezone: prefer IANA string, fall back to numeric offset, then default
  const tzOffset = timezone
    ? getUTCOffsetForDate(year, month, day, timezone)
    : (tz ?? 0);

  try {
    const panchang = computePanchang({
      year, month, day, lat, lng, tzOffset, timezone: timezone || undefined, locationName: location || '',
    });

    // Enrich with tithi table data (masa info, precise tithi times)
    let tithiTableData: Record<string, unknown> | undefined;
    try {
      if (timezone) {
        const table = buildYearlyTithiTable(year, lat, lng, timezone);
        const jdApprox = dateToJD(year, month, day, 0);
        const srUT = sunriseUTHours(jdApprox, lat, lng, tzOffset);
        // Skip tithi enrichment on polar non-rise — no canonical sunrise
        // means no sunrise-anchored tithi for that civil day. The panchang
        // computation above is still returned; only the tithi-table enrichment
        // is omitted. Caller can detect via the absence of tithiTableData.
        if (srUT === null) {
          console.error(`[API/panchang] No sunrise at lat=${lat}° on ${year}-${month}-${day} — polar non-rise; tithi enrichment skipped`);
        } else {
          const sunriseJd = dateToJD(year, month, day, srUT);
          const entry = lookupTithiAtSunrise(table, sunriseJd);
          if (entry) {
            tithiTableData = {
              masa: entry.masa,
              tithiStart: entry.startLocal,
              tithiEnd: entry.endLocal,
              tithiStartDate: entry.startDate,
              tithiEndDate: entry.endDate,
              isKshaya: entry.isKshaya,
              durationHours: Math.round(entry.durationHours * 10) / 10,
            };
          }
        }
      }
    } catch (err) {
      console.error('[API/panchang] Tithi table enrichment failed (non-fatal):', err);
    }

    // Enrich with festivals/vrats for this date
    let festivals: { name: LocaleText; type: string; category: string; description: LocaleText; slug?: string; pujaMuhurat?: { start: string; end: string; name: string }; paranaStart?: string; paranaEnd?: string; paranaDate?: string }[] | undefined;
    try {
      if (timezone) {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const allFestivals = generateFestivalCalendarV2(year, lat, lng, timezone);
        const todayFestivals = allFestivals.filter(f => f.date === dateStr);
        if (todayFestivals.length > 0) {
          festivals = todayFestivals.map(f => ({
            name: f.name,
            type: f.type,
            category: f.category,
            description: f.description,
            slug: f.slug,
            ...(f.pujaMuhurat ? { pujaMuhurat: f.pujaMuhurat } : {}),
            ...(f.paranaStart ? { paranaStart: f.paranaStart, paranaEnd: f.paranaEnd, paranaDate: f.paranaDate } : {}),
          }));
        }
      }
    } catch (err) {
      console.error('[API/panchang] Festival enrichment failed (non-fatal):', err);
    }

    return NextResponse.json({
      ...panchang,
      ...(tithiTableData ? { tithiTable: tithiTableData } : {}),
      ...(festivals ? { festivals } : {}),
    }, {
      headers: { 'X-RateLimit-Remaining': remaining.toString(), 'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=43200' },
    });
  } catch (err) {
    console.error('[API/panchang] Computation error:', err);
    return NextResponse.json(
      { error: 'Failed to compute panchang' },
      { status: 500 }
    );
  }
}
