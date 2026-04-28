import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClaudeClient, DEFAULT_MODEL, MAX_CHAT_MESSAGE_LENGTH } from '@/lib/llm/llm-client';
import { buildChartChatSystemPrompt, sanitizeChatMessage, buildFallbackResponse } from '@/lib/llm/chart-chat-prompt';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';
import { smartMuhurtaSearch, type MuhurtaWindow } from '@/lib/muhurta/smart-search';
import type { ExtendedActivityId } from '@/types/muhurta-ai';

// ─── Timing Question Detection ─────────────────────────────────

const TIMING_KEYWORDS = [
  'when should', 'best time', 'good time', 'auspicious time', 'auspicious date',
  'right time', 'muhurta for', 'shubh muhurat', 'शुभ मुहूर्त', 'कब करें',
  'when to', 'best day', 'good day', 'when can i', 'ideal time',
  'suitable time', 'favorable time', 'propitious',
];

function isTimingQuestion(message: string): boolean {
  const lower = message.toLowerCase();
  return TIMING_KEYWORDS.some(kw => lower.includes(kw));
}

const ACTIVITY_KEYWORDS: Record<string, ExtendedActivityId> = {
  'house': 'property', 'property': 'property', 'real estate': 'property',
  'marriage': 'marriage', 'wedding': 'marriage', 'marry': 'marriage', 'vivah': 'marriage',
  'travel': 'travel', 'trip': 'travel', 'journey': 'travel', 'yatra': 'travel',
  'business': 'business', 'company': 'business', 'startup': 'business',
  'vehicle': 'vehicle', 'car': 'vehicle', 'bike': 'vehicle',
  'exam': 'exam', 'test': 'exam', 'interview': 'exam',
  'job': 'business', 'career': 'business', 'promotion': 'business',
  'surgery': 'surgery', 'operation': 'surgery', 'medical': 'medical_treatment',
  'education': 'education', 'study': 'education', 'school': 'education', 'college': 'education',
  'griha pravesh': 'griha_pravesh', 'housewarming': 'griha_pravesh', 'new home': 'griha_pravesh',
  'gold': 'gold_purchase', 'jewel': 'gold_purchase', 'purchase': 'gold_purchase',
  'spiritual': 'spiritual_practice', 'puja': 'spiritual_practice', 'meditation': 'spiritual_practice',
  'court': 'court_case', 'legal': 'court_case',
  'move': 'relocation', 'relocat': 'relocation', 'shift': 'relocation',
  'farm': 'agriculture', 'sow': 'agriculture', 'harvest': 'agriculture',
  'sign': 'financial_signing', 'contract': 'financial_signing', 'agreement': 'financial_signing',
  'buy': 'gold_purchase',
};

function extractActivity(message: string): ExtendedActivityId {
  const lower = message.toLowerCase();
  for (const [keyword, activity] of Object.entries(ACTIVITY_KEYWORDS)) {
    if (lower.includes(keyword)) return activity;
  }
  return 'spiritual_practice'; // fallback default
}

// Map planet name strings (from DashaEntry) to planet IDs (0-8)
const PLANET_NAME_TO_ID: Record<string, number> = {
  sun: 0, moon: 1, mars: 2, mercury: 3, jupiter: 4,
  venus: 5, saturn: 6, rahu: 7, ketu: 8,
};

function findCurrentDashaLords(
  dashas: Array<{ planet: string; startDate: string; endDate: string; level: string; subPeriods?: Array<any> }>,
): { maha: number; antar: number; pratyantar: number } | undefined {
  const now = Date.now();

  for (const maha of dashas) {
    const mahaStart = new Date(maha.startDate).getTime();
    const mahaEnd = new Date(maha.endDate).getTime();
    if (now < mahaStart || now > mahaEnd) continue;

    const mahaId = PLANET_NAME_TO_ID[maha.planet.toLowerCase()];
    if (mahaId === undefined) continue;

    let antarId = mahaId;
    let pratyantarId = mahaId;

    if (maha.subPeriods) {
      for (const antar of maha.subPeriods) {
        const antarStart = new Date(antar.startDate).getTime();
        const antarEnd = new Date(antar.endDate).getTime();
        if (now < antarStart || now > antarEnd) continue;

        const aId = PLANET_NAME_TO_ID[antar.planet.toLowerCase()];
        if (aId !== undefined) antarId = aId;

        if (antar.subPeriods) {
          for (const prat of antar.subPeriods) {
            const pratStart = new Date(prat.startDate).getTime();
            const pratEnd = new Date(prat.endDate).getTime();
            if (now < pratStart || now > pratEnd) continue;

            const pId = PLANET_NAME_TO_ID[prat.planet.toLowerCase()];
            if (pId !== undefined) pratyantarId = pId;
            break;
          }
        }
        break;
      }
    }

    return { maha: mahaId, antar: antarId, pratyantar: pratyantarId };
  }

  return undefined;
}

// ─── Schema ─────────────────────────────────────────────────────

const chatSchema = z.object({
  message: z.string().min(1).max(MAX_CHAT_MESSAGE_LENGTH),
  kundali: z.object({
    ascendant: z.object({ degree: z.number(), sign: z.number(), signName: z.any() }),
    planets: z.array(z.any()),
    chart: z.object({ houses: z.array(z.array(z.number())), ascendantDeg: z.number(), ascendantSign: z.number() }),
    navamshaChart: z.any(),
    dashas: z.array(z.any()),
    birthData: z.object({
      name: z.string().optional(),
      date: z.string().optional(),
      time: z.string().optional(),
      place: z.string().optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
      timezone: z.string().optional(),
      ayanamsha: z.string().optional(),
    }).optional(),
  }).passthrough(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).max(10).optional(),
  locale: z.enum(['en', 'hi', 'sa']).default('en'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export async function POST(request: Request) {
  // Rate limiting
  const ip = getClientIP(request);
  const { allowed } = checkRateLimit(ip, { maxRequests: 30, windowMs: 60000 });
  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = await request.json();
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { message, kundali, history, locale, lat, lng } = parsed.data;
  const cleanMessage = sanitizeChatMessage(message);

  // ─── Timing question detection + muhurta search ───────────────
  let muhurtaWindows: MuhurtaWindow[] | undefined;
  let muhurtaContext = '';
  const timingDetected = isTimingQuestion(cleanMessage);

  if (timingDetected) {
    try {
      const activityId = extractActivity(cleanMessage);
      const birthData = kundali.birthData;

      // Determine location: prefer birth location, fall back to client location
      const searchLat = birthData?.lat ?? lat ?? 0;
      const searchLng = birthData?.lng ?? lng ?? 0;

      // Compute tzOffset from birth timezone or approximate from longitude
      // Longitude / 15 gives a rough UTC offset in hours
      let tzOffset = searchLng / 15;
      if (birthData?.timezone) {
        try {
          const now = new Date();
          const utcStr = now.toLocaleString('en-US', { timeZone: 'UTC' });
          const localStr = now.toLocaleString('en-US', { timeZone: birthData.timezone });
          tzOffset = (new Date(localStr).getTime() - new Date(utcStr).getTime()) / 3600000;
        } catch {
          // timezone string invalid — keep longitude-based approximation
          console.error('[API/chart-chat] Could not resolve timezone:', birthData.timezone);
        }
      }

      // Date range: next 60 days
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000);
      const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      // Build user snapshot for personal scoring
      let userSnapshot: { birthData: { name: string; date: string; time: string; place: string; lat: number; lng: number; timezone: string; ayanamsha: string }; dashaLords?: { maha: number; antar: number; pratyantar: number } } | undefined;
      if (birthData?.date && birthData?.time && birthData?.lat !== undefined && birthData?.lng !== undefined) {
        const dashaLords = findCurrentDashaLords(kundali.dashas as any[]);
        userSnapshot = {
          birthData: {
            name: birthData.name ?? '',
            date: birthData.date,
            time: birthData.time,
            place: birthData.place ?? '',
            lat: birthData.lat,
            lng: birthData.lng,
            timezone: birthData.timezone ?? 'UTC',
            ayanamsha: birthData.ayanamsha ?? 'lahiri',
          },
          dashaLords,
        };
      }

      muhurtaWindows = smartMuhurtaSearch(
        {
          activity: activityId,
          startDate: fmt(startDate),
          endDate: fmt(endDate),
          lat: searchLat,
          lng: searchLng,
          tzOffset,
        },
        userSnapshot,
      );

      // Build context string for Claude
      if (muhurtaWindows.length > 0) {
        muhurtaContext = `\n\n[MUHURTA RESULTS for ${activityId}]\nTop windows found:\n${muhurtaWindows.slice(0, 3).map((w, i) =>
          `${i + 1}. ${w.date} ${w.startTime}-${w.endTime} (score: ${w.score}/100) — ${w.proof.tithi.name}, ${w.proof.nakshatra.name}, ${w.proof.hora.planet} hora`
        ).join('\n')}\n\nRefer to these specific dates and times in your response. Explain WHY these times are good based on the panchang factors shown.`;
      }
    } catch (err) {
      // Muhurta search failed — continue without windows
      console.error('[API/chart-chat] Muhurta search failed:', err);
    }
  }

  // ─── LLM response ────────────────────────────────────────────

  const client = getClaudeClient();
  if (!client) {
    return NextResponse.json({
      response: buildFallbackResponse(kundali as any, locale),
      fallback: true,
      muhurtaWindows: muhurtaWindows?.length ? muhurtaWindows : undefined,
    });
  }

  try {
    const systemPrompt = buildChartChatSystemPrompt(kundali as any, locale);

    // Build messages array from history + current message (with optional muhurta context)
    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...(history || []),
      { role: 'user' as const, content: cleanMessage + muhurtaContext },
    ];

    const response = await client.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const text = response.content
      .filter(c => c.type === 'text')
      .map(c => (c as { type: 'text'; text: string }).text)
      .join('');

    return NextResponse.json({
      response: text,
      fallback: false,
      muhurtaWindows: muhurtaWindows?.length ? muhurtaWindows : undefined,
    });
  } catch (err) {
    console.error('[API/chart-chat] Error:', err);
    return NextResponse.json({
      response: locale === 'hi'
        ? 'क्षमा करें, अभी उत्तर देने में असमर्थ हूँ। कृपया पुनः प्रयास करें।'
        : 'Sorry, I am unable to respond right now. Please try again.',
      fallback: true,
      muhurtaWindows: muhurtaWindows?.length ? muhurtaWindows : undefined,
    });
  }
}
