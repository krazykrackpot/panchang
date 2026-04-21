/**
 * /api/ai-reading — Single comprehensive AI reading for all 8 life domains.
 *
 * Flow:
 * 1. Receive kundali data + PersonalReading from client
 * 2. Compute birth fingerprint
 * 3. Check Supabase cache (ai_readings table) for fingerprint + prompt version
 * 4. Cache HIT → return stored reading_json immediately
 * 5. Cache MISS → single LLM call → parse structured JSON → store → return
 *
 * Rate limits (daily, per user):
 *   free: 2/day, pro: 10/day, jyotishi: unlimited
 */

import { NextRequest, NextResponse } from 'next/server';
import { getClaudeClient, DEFAULT_MODEL } from '@/lib/llm/llm-client';
import { getServerSupabase } from '@/lib/supabase/server';
import { getUserTier } from '@/lib/subscription/check-access';
import {
  buildComprehensivePrompt,
  parseAIReadingResponse,
  generateBirthFingerprint,
  PROMPT_VERSION,
} from '@/lib/kundali/domain-synthesis/comprehensive-prompt';
import type { KundaliData } from '@/types/kundali';
import type { PersonalReading } from '@/lib/kundali/domain-synthesis/types';

// ─── Daily usage tracking (in-memory, resets on redeploy) ───────────────────

interface DailyUsage {
  count: number;
  date: string;
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

function getDailyUsage(userId: string): number {
  const usage = dailyUsageMap.get(userId);
  if (!usage || usage.date !== getToday()) return 0;
  return usage.count;
}

function incrementDailyUsage(userId: string) {
  const today = getToday();
  const usage = dailyUsageMap.get(userId);
  if (!usage || usage.date !== today) {
    dailyUsageMap.set(userId, { count: 1, date: today });
  } else {
    usage.count++;
  }
}

// ─── Auth helper ────────────────────────────────────────────────────────────

async function extractUserId(
  req: NextRequest,
): Promise<{ userId: string | null; tier: 'free' | 'pro' | 'jyotishi' }> {
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
          const accessToken = Array.isArray(tokenData)
            ? tokenData[0]
            : tokenData?.access_token;
          if (accessToken) {
            const { data } = await supabase.auth.getUser(accessToken);
            userId = data.user?.id ?? null;
          }
        } catch (cookieErr) {
          console.error('[ai-reading] Cookie auth parse failed:', cookieErr);
          /* invalid cookie — fall through to anon */
        }
      }
    }
  }

  if (!userId) return { userId: null, tier: 'free' };

  const { tier } = await getUserTier(userId);
  return { userId, tier: tier as 'free' | 'pro' | 'jyotishi' };
}

// ─── POST handler ───────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kundali, reading, nativeAge, regenerate } = body as {
      kundali: KundaliData;
      reading: PersonalReading;
      nativeAge?: number;
      regenerate?: boolean;
    };

    if (!kundali || !reading) {
      return NextResponse.json(
        { error: 'kundali and reading are required' },
        { status: 400 },
      );
    }

    const claude = getClaudeClient();
    if (!claude) {
      return NextResponse.json(
        { error: 'AI readings not configured — ANTHROPIC_API_KEY missing' },
        { status: 503 },
      );
    }

    // Auth — require sign-in for AI readings (prevents anonymous abuse)
    const { userId, tier } = await extractUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Sign in to use AI readings.' },
        { status: 401 },
      );
    }

    // ─── Step 1: Check Supabase cache ─────────────────────────────────────

    const fingerprint = generateBirthFingerprint(kundali);
    const supabase = getServerSupabase();

    if (supabase && userId && !regenerate) {
      const { data: cached, error: cacheError } = await supabase
        .from('ai_readings')
        .select('reading_json')
        .eq('user_id', userId)
        .eq('birth_fingerprint', fingerprint)
        .eq('prompt_version', PROMPT_VERSION)
        .maybeSingle();

      if (cacheError) {
        console.error('[ai-reading] Cache lookup failed:', cacheError.message);
        // Continue to LLM call — cache miss is not fatal
      }

      if (cached?.reading_json) {
        return NextResponse.json({
          ...cached.reading_json,
          cached: true,
          fingerprint,
        });
      }
    }

    // ─── Step 2: Rate limit check (only for LLM calls, not cache hits) ───

    const dailyLimit = DAILY_LIMITS[tier] ?? 2;
    const used = getDailyUsage(userId);

    if (dailyLimit !== -1 && used >= dailyLimit) {
      return NextResponse.json(
        {
          error:
            dailyLimit === 0
              ? 'AI readings require a subscription.'
              : `You've used your AI reading quota for today (${used}/${dailyLimit} on ${tier} plan). Try again tomorrow.`,
          rateLimited: true,
          tier,
          usage: { used, limit: dailyLimit },
        },
        { status: 429 },
      );
    }

    // ─── Step 3: Build prompt + call LLM ──────────────────────────────────

    const { systemPrompt, userPayload, promptVersion } =
      buildComprehensivePrompt(kundali, reading, nativeAge);

    const response = await claude.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPayload }],
    });

    const rawContent = response.content
      .filter((b) => b.type === 'text')
      .map((b) => ('text' in b ? b.text : ''))
      .join('');

    // ─── Step 4: Parse structured response ────────────────────────────────

    let parsed;
    try {
      parsed = parseAIReadingResponse(rawContent);
    } catch (parseErr) {
      console.error('[ai-reading] Failed to parse LLM response:', parseErr);
      console.error('[ai-reading] Raw response (first 500 chars):', rawContent.slice(0, 500));
      return NextResponse.json(
        { error: 'AI generated an invalid response. Please try again.' },
        { status: 502 },
      );
    }

    incrementDailyUsage(userId);

    // ─── Step 5: Store in Supabase cache ──────────────────────────────────

    const readingJson = {
      overallInsight: parsed.overallInsight,
      domains: parsed.domains,
    };

    if (supabase && userId) {
      // Upsert handles both insert and update (on conflict) — no need to delete first
      const { error: insertErr } = await supabase.from('ai_readings').upsert(
        {
          user_id: userId,
          birth_fingerprint: fingerprint,
          prompt_version: promptVersion,
          model: response.model,
          reading_json: readingJson,
          tokens_input: response.usage.input_tokens,
          tokens_output: response.usage.output_tokens,
        },
        { onConflict: 'user_id,birth_fingerprint,prompt_version' },
      );

      if (insertErr) {
        console.error('[ai-reading] Failed to cache reading:', insertErr.message);
        // Non-fatal: we still return the reading to the user
      }
    }

    return NextResponse.json({
      ...readingJson,
      cached: false,
      fingerprint,
      model: response.model,
      tokens: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
    });
  } catch (err: unknown) {
    console.error('[ai-reading] Unexpected error:', err);
    const message = err instanceof Error ? err.message : 'AI reading failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
