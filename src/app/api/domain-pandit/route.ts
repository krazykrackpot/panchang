import { NextRequest, NextResponse } from 'next/server';
import { getClaudeClient, DEFAULT_MODEL } from '@/lib/llm/llm-client';
import { getServerSupabase } from '@/lib/supabase/server';
import { getUserTier } from '@/lib/subscription/check-access';

// ─── Daily usage tracking per user (in-memory, resets on redeploy) ──────────

interface DailyUsage {
  count: number;
  date: string; // "2026-04-12"
}

const dailyUsageMap = new Map<string, DailyUsage>();

// Lazy eviction on every access instead of setInterval
// (setInterval is unreliable in serverless — function instances are ephemeral)
function evictStaleDailyUsage() {
  const today = new Date().toISOString().slice(0, 10);
  for (const [key, entry] of dailyUsageMap.entries()) {
    if (entry.date !== today) dailyUsageMap.delete(key);
  }
  if (dailyUsageMap.size > 10000) dailyUsageMap.clear();
}

const DAILY_LIMITS: Record<string, number> = {
  free: 2,
  pro: 10,
  jyotishi: -1, // unlimited
};

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDailyUsage(userKey: string): number {
  evictStaleDailyUsage();
  const usage = dailyUsageMap.get(userKey);
  if (!usage || usage.date !== getToday()) return 0;
  return usage.count;
}

function incrementDailyUsage(userKey: string) {
  const today = getToday();
  const usage = dailyUsageMap.get(userKey);
  if (!usage || usage.date !== today) {
    dailyUsageMap.set(userKey, { count: 1, date: today });
  } else {
    usage.count++;
  }
}

/** Extract authenticated user ID from Bearer token or cookie. Returns
 *  userId=null only when supabase is unconfigured or the caller is truly
 *  anonymous — in either case the calling route MUST reject the request.
 *  Previous version silently downgraded paying users to tier='free' when
 *  auth failed; the route is now responsible for rejecting unauthorized
 *  callers explicitly. */
async function extractUserId(req: NextRequest): Promise<{ userId: string | null; tier: 'free' | 'pro' | 'jyotishi' }> {
  const supabase = getServerSupabase();
  if (!supabase) {
    console.error('[domain-pandit] supabase not configured — cannot authenticate caller');
    return { userId: null, tier: 'free' };
  }

  let userId: string | null = null;

  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const { data, error: authError } = await supabase.auth.getUser(authHeader.slice(7).trim());
    if (authError) {
      console.error('[domain-pandit] bearer auth failed:', authError.message);
    }
    userId = data.user?.id ?? null;
  }

  if (!userId) {
    const cookie = req.headers.get('cookie');
    if (cookie) {
      const match = cookie.match(/sb-[^=]+-auth-token=([^;]+)/);
      if (match) {
        try {
          const tokenData = JSON.parse(decodeURIComponent(match[1]));
          const accessToken = Array.isArray(tokenData) ? tokenData[0] : tokenData?.access_token;
          if (accessToken) {
            const { data, error: cookieAuthError } = await supabase.auth.getUser(accessToken);
            if (cookieAuthError) {
              console.error('[domain-pandit] cookie auth failed:', cookieAuthError.message);
            }
            userId = data.user?.id ?? null;
          }
        } catch (err) {
          console.error('[domain-pandit] cookie parse failed:', err);
        }
      }
    }
  }

  if (!userId) return { userId: null, tier: 'free' };

  const { tier } = await getUserTier(userId);
  return { userId, tier };
}

// Server-controlled system prompt. The client used to send `systemPrompt`
// in the body, which (combined with auth-only gating) still let any signed-
// in user use our Anthropic key for arbitrary LLM tasks. The prompt is now
// fixed here — clients can only supply the user-side question content.
const DOMAIN_PANDIT_SYSTEM_PROMPT = `You are a Vedic astrology pandit. Answer the user's question about Vedic astrology, panchang, kundali, dashas, yogas, or related topics in a concise, accurate, and warm tone.

Rules:
- Stay strictly on Vedic / Jyotish topics. If asked anything else (general knowledge, code, current events), politely decline and redirect to a Jyotish question.
- Never produce content that contradicts classical Jyotish principles or invents fictional dashas/yogas/nakshatras.
- Keep responses under 250 words unless the question explicitly asks for depth.
- Use plain language; if you mention a Sanskrit term, gloss it in parentheses on first use.
- Do not pretend to know the user's birth chart unless it is provided in the question.`;

const MAX_USER_PAYLOAD_LENGTH = 2000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // systemPrompt is intentionally ignored if the client sends it — kept
    // in the destructure only to log the attempt for observability.
    const { userPayload, systemPrompt: clientSuppliedSystemPrompt } = body as {
      userPayload?: unknown;
      systemPrompt?: unknown;
    };

    if (typeof userPayload !== 'string' || userPayload.trim().length === 0) {
      return NextResponse.json(
        { error: 'userPayload is required' },
        { status: 400 },
      );
    }
    if (userPayload.length > MAX_USER_PAYLOAD_LENGTH) {
      return NextResponse.json(
        { error: `userPayload exceeds ${MAX_USER_PAYLOAD_LENGTH} characters` },
        { status: 413 },
      );
    }
    if (clientSuppliedSystemPrompt !== undefined) {
      console.warn('[domain-pandit] client supplied systemPrompt — ignored');
    }

    const claude = getClaudeClient();
    if (!claude) {
      return NextResponse.json(
        { error: 'AI readings not configured' },
        { status: 503 },
      );
    }

    // Auth — reject anonymous callers. Previously the route allowed
    // unauthenticated access with a shared 'anon' rate-limit bucket, which
    // turned this into a free LLM proxy for our Anthropic key. Users MUST
    // present a valid bearer token (or sb-* cookie).
    const { userId, tier } = await extractUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const userKey = userId;
    const dailyLimit = DAILY_LIMITS[tier] ?? 2;
    const used = getDailyUsage(userKey);

    if (dailyLimit !== -1 && used >= dailyLimit) {
      return NextResponse.json(
        {
          error:
            dailyLimit === 0
              ? 'AI readings require a subscription.'
              : `You've used your AI consultation quota for today (${dailyLimit}/day on ${tier} plan). Try again tomorrow.`,
          rateLimited: true,
          tier,
          usage: { used, limit: dailyLimit },
        },
        { status: 429 },
      );
    }

    // Call Claude with the server-defined system prompt — the client only
    // contributes the question content (userPayload).
    const response = await claude.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1024,
      system: DOMAIN_PANDIT_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPayload }],
    });

    // Extract text content
    const content = response.content
      .filter((b) => b.type === 'text')
      .map((b) => ('text' in b ? b.text : ''))
      .join('\n\n');

    incrementDailyUsage(userKey);

    return NextResponse.json({
      content,
      model: response.model,
      tokens: { input: response.usage.input_tokens, output: response.usage.output_tokens },
    });
  } catch (err: unknown) {
    console.error('[domain-pandit] LLM error:', err);
    // Don't leak err.message — it may contain Anthropic API URLs, key
    // prefixes, request IDs, Supabase column names. Generic message only.
    return NextResponse.json({ error: 'AI reading failed' }, { status: 500 });
  }
}
