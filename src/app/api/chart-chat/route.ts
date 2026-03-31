import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClaudeClient, DEFAULT_MODEL, MAX_CHAT_MESSAGE_LENGTH } from '@/lib/llm/llm-client';
import { buildChartChatSystemPrompt, sanitizeChatMessage, buildFallbackResponse } from '@/lib/llm/chart-chat-prompt';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

const chatSchema = z.object({
  message: z.string().min(1).max(MAX_CHAT_MESSAGE_LENGTH),
  kundali: z.object({
    ascendant: z.object({ degree: z.number(), sign: z.number(), signName: z.any() }),
    planets: z.array(z.any()),
    chart: z.object({ houses: z.array(z.array(z.number())), ascendantDeg: z.number(), ascendantSign: z.number() }),
    navamshaChart: z.any(),
    dashas: z.array(z.any()),
  }).passthrough(),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).max(10).optional(),
  locale: z.enum(['en', 'hi', 'sa']).default('en'),
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

  const { message, kundali, history, locale } = parsed.data;
  const cleanMessage = sanitizeChatMessage(message);

  const client = getClaudeClient();
  if (!client) {
    // Fallback: return a static response
    return NextResponse.json({
      response: buildFallbackResponse(kundali as any, locale),
      fallback: true,
    });
  }

  try {
    const systemPrompt = buildChartChatSystemPrompt(kundali as any, locale);

    // Build messages array from history + current message
    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...(history || []),
      { role: 'user' as const, content: cleanMessage },
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

    return NextResponse.json({ response: text, fallback: false });
  } catch (err) {
    console.error('[API/chart-chat] Error:', err);
    return NextResponse.json({
      response: locale === 'hi'
        ? 'क्षमा करें, अभी उत्तर देने में असमर्थ हूँ। कृपया पुनः प्रयास करें।'
        : 'Sorry, I am unable to respond right now. Please try again.',
      fallback: true,
    });
  }
}
