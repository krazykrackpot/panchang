import { NextResponse } from 'next/server';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getClaudeClient, DEFAULT_MODEL } from '@/lib/llm/llm-client';
import { buildPersonalizedData, buildPersonalizedPrompt, buildPersonalizedFallback } from '@/lib/llm/personalized-horoscope';
import type { PersonalChartSnapshot } from '@/lib/llm/personalized-horoscope';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { getServerSupabase } from '@/lib/supabase/server';
import { getFreshSnapshot } from '@/lib/supabase/get-fresh-snapshot';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// Sanitize free-text strings that flow into the LLM prompt. Strips
// control chars + caps length; allowlist alpha-numerics, spaces, and
// the punctuation that legitimate yoga/dosha names use. Mitigates the
// prompt-injection surface where a crafted yoga name could try to
// coerce the LLM (audit H12). Per-item cap is conservative; classical
// names are well under 40 chars.
function sanitizePromptString(s: unknown, maxLen = 40): string {
  if (typeof s !== 'string') return '';
  return s
    .replace(/[\x00-\x1F\x7F]/g, '')  // strip ASCII control chars
    .replace(/[^a-zA-Z0-9 ()\-,./']/g, '')  // allowlist
    .trim()
    .slice(0, maxLen);
}

// In-memory daily rate limiter: userId -> { date: 'YYYY-MM-DD', count: number }
// Resets each day. Acceptable for single-instance; good enough before Redis.
const dailyUsage = new Map<string, { date: string; count: number }>();
const MAX_DAILY_REQUESTS = 5;

// Lazy eviction on every access instead of setInterval
// (setInterval is unreliable in serverless — function instances are ephemeral)
function evictStaleDailyUsage() {
  const today = new Date().toISOString().slice(0, 10);
  for (const [key, entry] of dailyUsage.entries()) {
    if (entry.date !== today) dailyUsage.delete(key);
  }
  if (dailyUsage.size > 10000) dailyUsage.clear();
}

function checkDailyLimit(userId: string): boolean {
  evictStaleDailyUsage();
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
    const { chart, date: dateStr, lat, lng, timezone, locale = 'en' } = body as {
      chart: PersonalChartSnapshot;
      date?: string; // YYYY-MM-DD from the client date picker
      lat: number;
      lng: number;
      timezone?: string;
      locale?: string;
    };

    if (!chart || !chart.ascendantSign || !chart.moonSign) {
      return NextResponse.json({ error: 'Missing chart data' }, { status: 400 });
    }

    // Audit H12: cross-check the client-supplied chart against the user's
    // stored snapshot so a signed-in attacker can't request a horoscope for
    // arbitrary ascendant/moon values (which would otherwise feed straight
    // into the LLM prompt). The free-text yoga/dosha strings are also
    // sanitized below to neuter prompt-injection via crafted yoga names.
    const snapshot = await getFreshSnapshot(supabase, user.id);
    if (!snapshot) {
      return NextResponse.json(
        { error: 'Birth chart not computed yet. Please add your birth details first.' },
        { status: 422 },
      );
    }
    if (chart.ascendantSign !== snapshot.ascendant_sign || chart.moonSign !== snapshot.moon_sign) {
      console.warn('[horoscope/personalized] body.chart does not match snapshot for user', user.id);
      return NextResponse.json(
        { error: 'Chart does not match your saved birth details.' },
        { status: 403 },
      );
    }
    // Sanitize free-text fields BEFORE they reach the LLM prompt builder.
    chart.keyYogas = (chart.keyYogas ?? []).slice(0, 12).map((y) => sanitizePromptString(y)).filter(Boolean);
    chart.keyDoshas = (chart.keyDoshas ?? []).slice(0, 8).map((d) => sanitizePromptString(d)).filter(Boolean);
    chart.currentMahaDasha = sanitizePromptString(chart.currentMahaDasha, 20);
    chart.currentAntarDasha = sanitizePromptString(chart.currentAntarDasha, 20);
    chart.name = sanitizePromptString(chart.name, 80);

    // Use client-provided date if valid, otherwise fall back to today.
    // Parse via Date UTC to reject invalid calendar dates like 2023-02-30.
    let year: number, month: number, day: number;
    const parsedDate = (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr))
      ? new Date(`${dateStr}T00:00:00.000Z`)
      : null;

    if (parsedDate && !isNaN(parsedDate.getTime())) {
      year = parsedDate.getUTCFullYear();
      month = parsedDate.getUTCMonth() + 1;
      day = parsedDate.getUTCDate();
    } else {
      const now = new Date();
      year = now.getFullYear();
      month = now.getMonth() + 1;
      day = now.getDate();
    }

    const tz = timezone
      ? getUTCOffsetForDate(year, month, day, timezone)
      : 0;

    const panchang = computePanchang({
      year, month, day,
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
          // P3 — Devanagari-script locales (hi, mai) get the Hindi
          // system prompt; others get the English persona. Tuned-per-
          // language prompts for ta/te/bn/gu/kn are tracked separately.
          system: isDevanagariLocale(locale)
            ? 'आप एक अनुभवी वैदिक ज्योतिषी हैं। व्यक्तिगत दैनिक राशिफल हिंदी में लिखें। दशा, गोचर SAV बल, और ग्रह स्थिति का सटीक उल्लेख करें।'
            : 'You are an experienced Vedic astrologer giving a personalized daily reading. Reference specific dasha periods, SAV transit strengths, and planetary positions. Be specific and practical  –  this is a personal consultation, not a generic horoscope.',
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

    const today = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

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
