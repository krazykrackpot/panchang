import { NextResponse } from 'next/server';
import { z } from 'zod';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getClaudeClient, DEFAULT_MODEL } from '@/lib/llm/llm-client';
import { buildAllHoroscopePrompts, buildHoroscopePrompt, buildFallbackHoroscope } from '@/lib/llm/horoscope-prompt';

// In-memory cache: date → horoscopes
const cache = new Map<string, { data: Record<number, string>; createdAt: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const querySchema = z.object({
  sign: z.coerce.number().int().min(1).max(12).optional(),
  locale: z.enum(['en', 'hi', 'sa']).default('en'),
  lat: z.coerce.number().min(-90).max(90).default(28.6139),
  lng: z.coerce.number().min(-180).max(180).default(77.209),
  tz: z.coerce.number().min(-12).max(14).default(5.5),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    sign: searchParams.get('sign'),
    locale: searchParams.get('locale') || 'en',
    lat: searchParams.get('lat') || '28.6139',
    lng: searchParams.get('lng') || '77.209',
    tz: searchParams.get('tz') || '5.5',
  });

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  const { sign, locale, lat, lng, tz } = parsed.data;
  const now = new Date();
  const today = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

  // Check cache
  const cacheKey = `${today}-${locale}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.createdAt < CACHE_TTL) {
    if (sign) {
      return NextResponse.json({ sign, signName: getSignName(sign), forecast: cached.data[sign] || '', date: today, cached: true });
    }
    return NextResponse.json({ date: today, horoscopes: cached.data, cached: true });
  }

  // Compute today's panchang for transit data
  const panchang = computePanchang({
    year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(),
    lat, lng, tzOffset: tz, locationName: '',
  });

  const allPrompts = buildAllHoroscopePrompts(panchang);
  const client = getClaudeClient();

  const horoscopes: Record<number, string> = {};

  if (client) {
    // Generate all 12 horoscopes
    const promises = allPrompts.map(async (promptData) => {
      try {
        const prompt = buildHoroscopePrompt(promptData);
        const response = await client.messages.create({
          model: DEFAULT_MODEL,
          max_tokens: 300,
          system: locale === 'hi'
            ? 'आप एक वैदिक ज्योतिष विशेषज्ञ हैं। दैनिक राशिफल हिंदी में लिखें। ग्रह गोचर का सटीक उल्लेख करें।'
            : 'You are a Vedic astrology expert writing daily horoscopes. Reference specific planetary transits. Be practical and actionable.',
          messages: [{ role: 'user', content: prompt }],
        });
        const text = response.content
          .filter(c => c.type === 'text')
          .map(c => (c as { type: 'text'; text: string }).text)
          .join('');
        horoscopes[promptData.sign] = text;
      } catch {
        horoscopes[promptData.sign] = buildFallbackHoroscope(promptData, locale);
      }
    });

    // Run 3 at a time to avoid rate limits
    for (let i = 0; i < promises.length; i += 3) {
      await Promise.all(promises.slice(i, i + 3));
    }
  } else {
    // Fallback: transit-based summaries without LLM
    for (const promptData of allPrompts) {
      horoscopes[promptData.sign] = buildFallbackHoroscope(promptData, locale);
    }
  }

  // Cache the results
  cache.set(cacheKey, { data: horoscopes, createdAt: Date.now() });

  // Clean old cache entries
  for (const [key, entry] of cache.entries()) {
    if (Date.now() - entry.createdAt > CACHE_TTL) cache.delete(key);
  }

  if (sign) {
    return NextResponse.json({ sign, signName: getSignName(sign), forecast: horoscopes[sign] || '', date: today, cached: false });
  }
  return NextResponse.json({ date: today, horoscopes, cached: false });
}

function getSignName(sign: number): string {
  const names = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  return names[(sign - 1) % 12];
}
