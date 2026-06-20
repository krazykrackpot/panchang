/**
 * GET /api/sky/positions
 * Returns sidereal planetary positions (Lahiri ayanamsha).
 * Optional ?date=ISO param for historical/future positions (time animation).
 * Cached for 60s when no date param (live mode).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSkyPositions } from '@/lib/sky/positions';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(ip, { maxRequests: 30, windowMs: 60000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait before making more requests.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'Retry-After': '60' } },
    );
  }

  try {
    const dateParam = request.nextUrl.searchParams.get('date');
    const now = dateParam ? new Date(dateParam) : new Date();
    if (isNaN(now.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }
    const positions = getCurrentSkyPositions(now);

    return NextResponse.json(
      {
        positions,
        timestamp: now.toISOString(),
      },
      {
        headers: {
          // Cache at CDN edge for 60s  –  matches client auto-refresh interval
          // Live positions refresh every 60s. No SWR — background regen of
// real-time data adds CPU cost with no freshness benefit.
'Cache-Control': 'public, s-maxage=60',
        },
      }
    );
  } catch (err) {
    console.error('[api/sky/positions] error:', err);
    return NextResponse.json(
      { error: 'Failed to compute planetary positions' },
      { status: 500 }
    );
  }
}
