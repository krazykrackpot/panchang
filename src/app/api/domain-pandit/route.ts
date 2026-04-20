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

const DAILY_LIMITS: Record<string, number> = {
  free: 2,
  pro: 10,
  jyotishi: -1, // unlimited
};

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDailyUsage(userKey: string): number {
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

/** Extract authenticated user ID from Bearer token or cookie. */
async function extractUserId(req: NextRequest): Promise<{ userId: string | null; tier: 'free' | 'pro' | 'jyotishi' }> {
  const supabase = getServerSupabase();
  if (!supabase) return { userId: null, tier: 'free' };

  let userId: string | null = null;

  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const { data } = await supabase.auth.getUser(authHeader.slice(7));
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
            const { data } = await supabase.auth.getUser(accessToken);
            userId = data.user?.id ?? null;
          }
        } catch { /* invalid cookie */ }
      }
    }
  }

  if (!userId) return { userId: null, tier: 'free' };

  const { tier } = await getUserTier(userId);
  return { userId, tier };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { systemPrompt, userPayload } = body as {
      systemPrompt: string;
      userPayload: string;
    };

    if (!systemPrompt || !userPayload) {
      return NextResponse.json(
        { error: 'systemPrompt and userPayload are required' },
        { status: 400 },
      );
    }

    const claude = getClaudeClient();
    if (!claude) {
      return NextResponse.json(
        { error: 'AI readings not configured' },
        { status: 503 },
      );
    }

    // Auth + rate limiting
    const { userId, tier } = await extractUserId(request);
    const userKey = userId ?? 'anon';
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

    // Call Claude
    const response = await claude.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
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
    console.error('Domain pandit LLM error:', err);
    const message = err instanceof Error ? err.message : 'AI reading failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
