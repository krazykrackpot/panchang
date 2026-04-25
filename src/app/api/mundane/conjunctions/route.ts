/**
 * GET /api/mundane/conjunctions
 *
 * Returns the Great Conjunction timeline (Jupiter-Saturn conjunctions 1800-2100).
 * No authentication required — public data.
 * Cached at CDN level for 24 hours — results are deterministic and don't change.
 */

import { NextResponse } from 'next/server';
import { getAllGreatConjunctions, getNearConjunctions } from '@/lib/mundane/great-conjunctions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode')?.trim() ?? 'near';

    let data;
    if (mode === 'all') {
      data = { conjunctions: getAllGreatConjunctions() };
    } else {
      // Default: return 5 past + current + 5 future
      const beforeCount = Math.min(parseInt(searchParams.get('before') ?? '5', 10), 20);
      const afterCount = Math.min(parseInt(searchParams.get('after') ?? '5', 10), 20);
      data = getNearConjunctions(beforeCount, afterCount);
    }

    return NextResponse.json(data, {
      headers: {
        // Cache for 24 hours — conjunction data is fully deterministic
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch (err) {
    console.error('[API/mundane/conjunctions] Failed:', err);
    return NextResponse.json(
      { error: 'Failed to compute Great Conjunction timeline' },
      { status: 500 },
    );
  }
}
