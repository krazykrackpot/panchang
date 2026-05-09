import { NextResponse } from 'next/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getClaudeClient, DEFAULT_MODEL } from '@/lib/llm/llm-client';
import { buildPersonalizedData, buildPersonalizedPrompt, buildPersonalizedFallback } from '@/lib/llm/personalized-horoscope';
import type { PersonalChartSnapshot } from '@/lib/llm/personalized-horoscope';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { getServerSupabase } from '@/lib/supabase/server';

// In-memory daily rate limiter: userId -> { date: 'YYYY-MM-DD', count: number }
// Resets each day. Acceptable for single-instance; good enough before Redis.
const dailyUsage = new Map<string, { date: string; count: number }>();
const MAX_DAILY_REQUESTS = 5;

function checkDailyLimit(userId: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const entry = dailyUsage.get(userId);
  if (!entry || entry.date !== today) {
    dailyUsage.set(userId, { date: today, count: 1 });
    return true;
  }
  if (entry.count >= MAX_DAILY_REQUESTS) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    // --- Auth (requires valid Supabase session) ---
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7).trim();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- Daily rate limit (AI calls cost money) ---
    if (!checkDailyLimit(user.id)) {
      return NextResponse.json(
        { error: 'Daily limit reached (5 personalised horoscopes per day)' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { chart, lat, lng, timezone, locale = 'en' } = body as {
      chart: PersonalChartSnapshot;
      lat: number;
      lng: number;
      timezone?: string;
      locale?: string;
    };

    if (!chart || !chart.ascendantSign || !chart.moonSign) {
      return NextResponse.json({ error: 'Missing chart data' }, { status: 400 });
    }

    const now = new Date();
    const tz = timezone
      ? getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), timezone)
      : 0;

    const panchang = computePanchang({
      year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(),
      lat: lat || 0, lng: lng || 0, tzOffset: tz, locationName: '',
    });

    const personalData = buildPersonalizedData(chart, panchang);
    const client = getClaudeClient();

    let forecast: string;

    if (client) {
      try {
        const prompt = buildPersonalizedPrompt(personalData, locale);
        const response = await client.messages.create({
          model: DEFAULT_MODEL,
          max_tokens: 400,
          system: locale === 'hi'
            ? 'आप एक अनुभवी वैदिक ज्योतिषी हैं। व्यक्तिगत दैनिक राशिफल हिंदी में लिखें। दशा, गोचर SAV बल, और ग्रह स्थिति का सटीक उल्लेख करें।'
            : 'You are an experienced Vedic astrologer giving a personalized daily reading. Reference specific dasha periods, SAV transit strengths, and planetary positions. Be specific and practical — this is a personal consultation, not a generic horoscope.',
          messages: [{ role: 'user', content: prompt }],
        });
        forecast = response.content
          .filter(c => c.type === 'text')
          .map(c => (c as { type: 'text'; text: string }).text)
          .join('');
      } catch (err) {
        console.error('[horoscope/personalized] AI generation failed, using fallback:', err);
        forecast = buildPersonalizedFallback(personalData, locale);
      }
    } else {
      forecast = buildPersonalizedFallback(personalData, locale);
    }

    const today = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

    return NextResponse.json({
      date: today,
      forecast,
      moonTransitHouse: personalData.moonTransitHouse,
      moonTransitSign: personalData.moonTransitSign,
      slowTransits: personalData.slowTransits,
      dasha: { maha: chart.currentMahaDasha, antar: chart.currentAntarDasha },
    }, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (err) {
    console.error('[PersonalizedHoroscope] Error:', err);
    return NextResponse.json({ error: 'Failed to generate horoscope' }, { status: 500 });
  }
}
