/**
 * GET /api/sky/positions
 * Returns current sidereal planetary positions (Lahiri ayanamsha).
 * No inputs — always returns "now" positions.
 * Cached for 60s (max useful resolution for Moon movement).
 */

import { NextResponse } from 'next/server';
import { getCurrentSkyPositions } from '@/lib/sky/positions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const now = new Date();
    const positions = getCurrentSkyPositions(now);

    return NextResponse.json(
      {
        positions,
        timestamp: now.toISOString(),
      },
      {
        headers: {
          // Cache at CDN edge for 60s — matches client auto-refresh interval
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
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
