import { NextResponse } from 'next/server';
import { generatePrashnaResult } from '@/lib/prashna/ashtamangala';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { QuestionCategory } from '@/types/prashna';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

// Whitelist of valid prashna categories — kept aligned with QuestionCategory
// in @/types/prashna. Previous code cast any string to QuestionCategory.
const VALID_CATEGORIES: ReadonlySet<QuestionCategory> = new Set<QuestionCategory>([
  'health', 'wealth', 'siblings', 'property', 'children', 'enemies',
  'marriage', 'longevity', 'fortune', 'career', 'gains', 'loss',
]);

export async function POST(request: Request) {
  // P1-43 — rate limit. Was unprotected; category was cast without validation.
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(ip, { maxRequests: 20, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Guard against `null` / non-object payloads (e.g. client sends literal
  // JSON `null`) — destructuring those throws TypeError → 500. Catch here
  // and return 400 instead.
  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'Invalid JSON body: expected an object' },
      { status: 400 },
    );
  }

  try {
    const {
      numbers,
      category = 'fortune',
      lat = 0, // DEPRECATED fallback: client should always provide location
      lng = 0, // DEPRECATED fallback: client should always provide location
      tz: tzFallback = 0,
      timezone,
    } = body as {
      numbers: [number, number, number];
      category?: QuestionCategory;
      lat?: number;
      lng?: number;
      tz?: number;
      timezone?: string;
    };

    // Validate category against the canonical allowlist BEFORE the cast.
    if (!VALID_CATEGORIES.has(category as QuestionCategory)) {
      return NextResponse.json(
        { error: `Invalid category. Allowed: ${Array.from(VALID_CATEGORIES).join(', ')}` },
        { status: 400 },
      );
    }

    // Resolve tz from IANA timezone string if provided
    const now = new Date();
    const tz = timezone
      ? getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), timezone)
      : tzFallback;

    if (!numbers || numbers.length !== 3) {
      return NextResponse.json(
        { error: 'Must provide exactly 3 numbers' },
        { status: 400 },
      );
    }

    // Validate each number is a finite positive integer
    if (!numbers.every((n: unknown) => typeof n === 'number' && Number.isFinite(n) && Number.isInteger(n) && n > 0)) {
      return NextResponse.json(
        { error: 'Each number must be a finite positive integer' },
        { status: 400 },
      );
    }

    // Validate lat/lng ranges when provided
    if (lat !== 0 || lng !== 0) {
      if (typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90) {
        return NextResponse.json(
          { error: 'lat must be a finite number between -90 and 90' },
          { status: 400 },
        );
      }
      if (typeof lng !== 'number' || !Number.isFinite(lng) || lng < -180 || lng > 180) {
        return NextResponse.json(
          { error: 'lng must be a finite number between -180 and 180' },
          { status: 400 },
        );
      }
    }

    const result = generatePrashnaResult(numbers, category, lat, lng, tz);
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, max-age=1800' },
    });
  } catch (err) {
    console.error('[prashna-ashtamangala] computation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate Ashtamangala Prashna' },
      { status: 500 },
    );
  }
}
