import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';

const querySchema = z.object({
  moonSign: z.coerce.number().int().min(1).max(12),
  nakshatra: z.coerce.number().int().min(1).max(27).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function GET(request: Request) {
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
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
    },
  });
}
