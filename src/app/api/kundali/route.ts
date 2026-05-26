import { NextResponse } from 'next/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { validateBirthData } from '@/lib/kundali/validate-birth-data';
import type { BirthData } from '@/types/kundali';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

export async function POST(request: Request) {
  // L6 fix: rate limit CPU-heavy kundali computation (20 requests/day per IP)
  const ip = getClientIP(request);
  const isDev = process.env.NODE_ENV === "development";
  const { allowed } = isDev ? { allowed: true } : checkRateLimit(`kundali:${ip}`, { maxRequests: 100, windowMs: 24 * 60 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again tomorrow.' },
      { status: 429, headers: { 'Retry-After': '86400', 'X-RateLimit-Remaining': '0' } },
    );
  }

  try {
    const body: BirthData = await request.json();

    // Single source of truth — same validator used by the Server
    // Action at src/app/[locale]/kundali/actions.ts. Don't inline new
    // checks here; add them to validate-birth-data.ts so both surfaces
    // stay aligned.
    const check = validateBirthData(body);
    if (!check.ok) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }

    const kundali = generateKundali(body);

    return NextResponse.json(kundali, {
      headers: { 'Cache-Control': 'no-store' }, // Never cache  –  birth data varies per request
    });
  } catch (err) {
    console.error('[API/kundali] Generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate kundali' },
      { status: 500 }
    );
  }
}
