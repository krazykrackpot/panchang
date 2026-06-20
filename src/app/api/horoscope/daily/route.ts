import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';

const querySchema = z.object({
  moonSign: z.coerce.number().int().min(1).max(12),
  nakshatra: z.coerce.number().int().min(1).max(27).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      moonSign: searchParams.get('moonSign'),
      nakshatra: searchParams.get('nakshatra') || undefined,
      date: searchParams.get('date') || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid parameters. moonSign (1-12) is required.' },
        { status: 400 },
      );
    }

    const { moonSign, nakshatra, date } = parsed.data;
    const hasExplicitDate = !!date;

    // Default to today's date
    const now = new Date();
    const today = date || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const horoscope = generateDailyHoroscope({
      moonSign,
      date: today,
      nakshatra,
    });

    return NextResponse.json(horoscope, {
      headers: {
        // Explicit date: content is deterministic — cache for the full day.
        // No date (defaults to today): short cache to avoid serving
        // yesterday's horoscope after midnight. No SWR on either path —
        // background regeneration generates ISR Write + CPU cost for no
        // freshness benefit (data is deterministic per (sign, date) tuple).
        'Cache-Control': hasExplicitDate
          ? 'public, s-maxage=86400'
          : 'public, s-maxage=600',
      },
    });
  } catch (err) {
    console.error('[horoscope-daily] error:', err);
    return NextResponse.json({ error: 'Failed to generate horoscope' }, { status: 500 });
  }
}
