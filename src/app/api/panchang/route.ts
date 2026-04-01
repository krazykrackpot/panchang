import { NextResponse } from 'next/server';
import { z } from 'zod';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

const panchangSchema = z.object({
  year: z.coerce.number().int().min(1900).max(2200),
  month: z.coerce.number().int().min(1).max(12),
  day: z.coerce.number().int().min(1).max(31),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  tz: z.coerce.number().min(-12).max(14).optional(),
  timezone: z.string().max(100).optional(), // IANA timezone (e.g., 'Europe/Zurich')
  location: z.string().max(200).optional(),
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
    lat: searchParams.get('lat') || '28.6139',
    lng: searchParams.get('lng') || '77.2090',
    tz: searchParams.get('tz') || undefined,
    timezone: searchParams.get('timezone') || undefined,
    location: searchParams.get('location') || 'New Delhi',
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid parameters', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { year, month, day, lat, lng, tz, timezone, location } = parsed.data;

  // Resolve timezone: prefer IANA string, fall back to numeric offset, then default
  const tzOffset = timezone
    ? getUTCOffsetForDate(year, month, day, timezone)
    : (tz ?? 5.5);

  try {
    const panchang = computePanchang({
      year, month, day, lat, lng, tzOffset, locationName: location || '',
    });

    return NextResponse.json(panchang, {
      headers: { 'X-RateLimit-Remaining': remaining.toString(), 'Cache-Control': 'public, s-maxage=300' },
    });
  } catch (err) {
    console.error('[API/panchang] Computation error:', err);
    return NextResponse.json(
      { error: 'Failed to compute panchang' },
      { status: 500 }
    );
  }
}
