import { NextResponse } from 'next/server';
import { computeAshtaKuta, type MatchInput } from '@/lib/matching/ashta-kuta';
import { calculateDashaKoota } from '@/lib/matching/dasha-koota';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

export async function POST(request: Request) {
  // L7 fix: rate limit CPU-heavy matching computation (20 requests/day per IP)
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(`matching:${ip}`, { maxRequests: 20, windowMs: 24 * 60 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again tomorrow.' },
      { status: 429, headers: { 'Retry-After': '86400', 'X-RateLimit-Remaining': '0' } },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const { boy, girl, system } = body as { boy: MatchInput; girl: MatchInput; system?: 'ashta-kuta' | 'dasha-koota' };

    const isValidInt = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n);
    if (
      !isValidInt(boy?.moonNakshatra) || !isValidInt(boy?.moonRashi) ||
      !isValidInt(girl?.moonNakshatra) || !isValidInt(girl?.moonRashi) ||
      boy.moonNakshatra < 1 || boy.moonNakshatra > 27 ||
      girl.moonNakshatra < 1 || girl.moonNakshatra > 27 ||
      boy.moonRashi < 1 || boy.moonRashi > 12 ||
      girl.moonRashi < 1 || girl.moonRashi > 12
    ) {
      return NextResponse.json(
        { error: 'moonNakshatra must be 1-27, moonRashi must be 1-12 for both boy and girl' },
        { status: 400 }
      );
    }

    if (system === 'dasha-koota') {
      const result = calculateDashaKoota(
        { moonNakshatra: boy.moonNakshatra, moonRashi: boy.moonRashi },
        { moonNakshatra: girl.moonNakshatra, moonRashi: girl.moonRashi },
      );
      // POST responses are never cached by CDN regardless of Cache-Control.
      // Header omitted intentionally.
      return NextResponse.json(result);
    }

    const result = computeAshtaKuta(boy, girl);
    // POST responses are never cached by CDN regardless of Cache-Control.
    // Header omitted intentionally.
    return NextResponse.json(result);
  } catch (err) {
    console.error('[matching] computation error:', err);
    return NextResponse.json(
      { error: 'Failed to compute matching' },
      { status: 500 }
    );
  }
}
