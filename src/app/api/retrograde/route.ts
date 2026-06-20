import { NextRequest, NextResponse } from 'next/server';
import { generateRetrogradeCalendar } from '@/lib/calendar/retro-combust';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

export async function GET(req: NextRequest) {
  const ip = getClientIP(req);
  const { allowed } = checkRateLimit(ip, { maxRequests: 30, windowMs: 60000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before making more requests.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'Retry-After': '60' } },
    );
  }

  try {
    const year = parseInt(req.nextUrl.searchParams.get('year') || String(new Date().getFullYear()));
    const periods = generateRetrogradeCalendar(year);
    return NextResponse.json({ year, periods }, {
      headers: { 'Cache-Control': 'public, s-maxage=604800' },
    });
  } catch (err) {
    console.error('[retrograde] error:', err);
    return NextResponse.json({ error: 'Failed to generate retrograde calendar' }, { status: 500 });
  }
}
