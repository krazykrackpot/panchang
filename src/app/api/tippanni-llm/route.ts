import { NextRequest, NextResponse } from 'next/server';
import type { KundaliData } from '@/types/kundali';
import { buildConvergenceInput } from '@/lib/tippanni/convergence/relationship-map';
import { runConvergenceEngine } from '@/lib/tippanni/convergence/engine';
import { generateLLMSynthesis, generateLLMSynthesisStream } from '@/lib/tippanni/convergence-llm/synthesizer';
import type { ChartSummary } from '@/lib/tippanni/convergence-llm/synthesizer';
import { RASHIS } from '@/lib/constants/rashis';
import { getServerSupabase } from '@/lib/supabase/server';
import { getFreshSnapshot } from '@/lib/supabase/get-fresh-snapshot';
import { getUserTier } from '@/lib/subscription/check-access';

// ─── Response cache: store AI readings per chart to avoid re-generation ──────

interface CachedReading {
  content: string;
  convergenceHash: string; // hash of patterns + tone + activation to detect change
  generatedAt: number;
  model: string;
}

const readingCache = new Map<string, CachedReading>();

// Lazy eviction on every cache read instead of setInterval
// (setInterval is unreliable in serverless — function instances are ephemeral)
const READING_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function evictStaleReadingCache() {
  const now = Date.now();
  for (const [key, entry] of readingCache.entries()) {
    if (now - entry.generatedAt > READING_CACHE_TTL) readingCache.delete(key);
  }
  if (readingCache.size > 1000) readingCache.clear();
}

// ─── Monthly usage tracking per user ─────────────────────────────────────────

interface MonthlyUsage {
  count: number;
  month: string; // "2026-04"
}

const monthlyUsageMap = new Map<string, MonthlyUsage>();

// Lazy eviction on every access instead of setInterval
function evictStaleMonthlyUsage() {
  const currentMonth = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; })();
  for (const [key, entry] of monthlyUsageMap.entries()) {
    if (entry.month !== currentMonth) monthlyUsageMap.delete(key);
  }
  if (monthlyUsageMap.size > 10000) monthlyUsageMap.clear();
}

const MONTHLY_LIMITS: Record<string, number> = {
  pro: 5,
  jyotishi: 15,
  free: 0,
};

function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthlyUsage(userKey: string): number {
  evictStaleMonthlyUsage();
  const usage = monthlyUsageMap.get(userKey);
  if (!usage || usage.month !== getCurrentMonth()) return 0;
  return usage.count;
}

function incrementMonthlyUsage(userKey: string) {
  const month = getCurrentMonth();
  const usage = monthlyUsageMap.get(userKey);
  if (!usage || usage.month !== month) {
    monthlyUsageMap.set(userKey, { count: 1, month });
  } else {
    usage.count++;
  }
}

function getConvergenceHash(convergence: { patterns: { patternId: string; finalScore: number }[]; executive: { tone: string; activation: number } }): string {
  return convergence.patterns.map(p => `${p.patternId}:${p.finalScore.toFixed(1)}`).join('|')
    + `|${convergence.executive.tone}|${convergence.executive.activation}`;
}

// Cache expiry: 7 days (if patterns haven't changed, no need to regenerate)
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function cleanCaches() {
  const cutoff = Date.now() - CACHE_TTL_MS;
  for (const [key, cached] of readingCache.entries()) {
    if (cached.generatedAt < cutoff) readingCache.delete(key);
  }
  // Clean monthly usage for past months
  const currentMonth = getCurrentMonth();
  for (const [key, usage] of monthlyUsageMap.entries()) {
    if (usage.month !== currentMonth) monthlyUsageMap.delete(key);
  }
}

function buildChartSummary(kundali: KundaliData): ChartSummary {
  const ascSign = RASHIS[kundali.ascendant.sign - 1]?.name.en || '(unresolved sign)';
  const moonPlanet = kundali.planets.find(p => p.planet.id === 1);
  const moonSign = moonPlanet ? (RASHIS[moonPlanet.sign - 1]?.name.en || '(unresolved sign)') : '(no Moon data)';
  const sunPlanet = kundali.planets.find(p => p.planet.id === 0);
  const sunSign = sunPlanet ? (RASHIS[sunPlanet.sign - 1]?.name.en || '(unresolved sign)') : '(no Sun data)';

  const now = new Date();
  const currentMaha = kundali.dashas?.find(d =>
    d.level === 'maha' && new Date(d.startDate) <= now && new Date(d.endDate) >= now
  );
  const currentAntar = currentMaha?.subPeriods?.find(d =>
    new Date(d.startDate) <= now && new Date(d.endDate) >= now
  );

  return {
    ascendant: ascSign,
    moonSign,
    sunSign,
    currentDasha: currentMaha?.planet || '(no active dasha)',
    currentAntardasha: currentAntar?.planet || '(no active antardasha)',
  };
}

function getChartKey(kundali: KundaliData): string {
  return `${kundali.ascendant.sign}-${kundali.planets.map(p => `${p.planet.id}:${p.house}`).join(',')}`;
}

/** Extracts authenticated user ID and subscription tier from the request.
 *  Returns userId=null only for genuine anon callers or supabase-down
 *  scenarios — silent fall-through to tier='free' for paying users on a
 *  transient auth error was the previous bug. We now log every auth failure
 *  with a tag so a paying user's silent downgrade is visible in production. */
async function extractAuthContext(req: NextRequest): Promise<{ userId: string | null; tier: 'free' | 'pro' | 'jyotishi' }> {
  const supabase = getServerSupabase();
  if (!supabase) {
    console.error('[tippanni-llm] supabase not configured — cannot authenticate caller');
    return { userId: null, tier: 'free' };
  }

  let userId: string | null = null;

  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const { data, error: authError } = await supabase.auth.getUser(authHeader.slice(7).trim());
    if (authError) {
      console.error('[tippanni-llm] bearer auth failed:', authError.message);
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
              console.error('[tippanni-llm] cookie auth failed:', cookieAuthError.message);
            }
            userId = data.user?.id ?? null;
          }
        } catch (err) {
          console.error('[tippanni-llm] cookie parse failed:', err);
        }
      }
    }
  }

  if (!userId) return { userId: null, tier: 'free' };

  const { tier } = await getUserTier(userId);
  return { userId, tier };
}

export const maxDuration = 30; // LLM inference

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      stream = true,
      locale = 'en',
      compare = false,
      kundali: clientKundali,
    } = body as {
      kundali?: unknown;
      stream?: boolean;
      locale?: 'en' | 'hi';
      compare?: boolean;
    };

    if (!process.env.ANTHROPIC_API_KEY?.trim()) {
      return NextResponse.json({ error: 'AI readings not configured' }, { status: 503 });
    }

    // Resolve authenticated user + subscription tier
    const { userId, tier } = await extractAuthContext(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Server-side chart resolution (audit H11): NEVER trust body.kundali.
    // A signed-in user could otherwise craft a kundali whose planet/dasha
    // names contain prompt-injection payloads, or poke the LLM with
    // arbitrary chart data to coerce policy violations / quota bypass.
    // Load the authenticated user's snapshot instead.
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    if (clientKundali !== undefined) {
      console.warn('[tippanni-llm] client supplied kundali in body — ignored (server uses snapshot)');
    }
    const snapshot = await getFreshSnapshot(supabase, userId);
    if (!snapshot?.full_kundali) {
      return NextResponse.json(
        { error: 'Birth chart not computed yet. Please add your birth details first.' },
        { status: 422 },
      );
    }
    const kundali = snapshot.full_kundali as KundaliData;

    // Build convergence data
    const convergenceInput = buildConvergenceInput(kundali);
    const convergence = runConvergenceEngine(convergenceInput);
    const chartSummary = buildChartSummary(kundali);
    const chartKey = getChartKey(kundali);

    // Clean caches periodically
    cleanCaches();

    // Check for cached reading (if convergence patterns haven't changed)
    if (!compare) {
      evictStaleReadingCache();
      const cached = readingCache.get(chartKey);
      const currentHash = getConvergenceHash(convergence);

      if (cached && cached.convergenceHash === currentHash && (Date.now() - cached.generatedAt) < CACHE_TTL_MS) {
        // Patterns haven't changed  –  serve cached reading
        return NextResponse.json({
          content: cached.content,
          model: cached.model,
          cached: true,
          cachedAt: new Date(cached.generatedAt).toISOString(),
        });
      }

      // Monthly usage limit  –  keyed by authenticated user ID (falls back to chart fingerprint for anonymous users)
      const userKey = userId ?? chartKey;
      const monthlyUsage = getMonthlyUsage(userKey);
      const monthlyLimit = MONTHLY_LIMITS[tier] ?? 0;
      if (monthlyLimit === 0 || monthlyUsage >= monthlyLimit) {
        const message = monthlyLimit === 0
          ? 'AI readings require a Pro or Jyotishi subscription.'
          : `Monthly AI reading limit reached (${monthlyLimit} per month on ${tier} plan). Your last reading is still available above.`;
        return NextResponse.json({
          error: message,
          rateLimited: true,
          tier,
          usage: { used: monthlyUsage, limit: monthlyLimit },
        }, { status: 429 });
      }
    }

    // Comparison mode (non-streaming, both models)
    if (compare) {
      const [sonnetResult, opusResult] = await Promise.all([
        generateLLMSynthesis(convergence, chartSummary, { model: 'sonnet', locale }),
        generateLLMSynthesis(convergence, chartSummary, { model: 'opus', locale }),
      ]);
      return NextResponse.json({
        convergence: {
          patternsMatched: convergence.patterns.length,
          tone: convergence.executive.tone,
          activation: convergence.executive.activation,
          favorability: convergence.executive.favorability,
        },
        sonnet: {
          content: sonnetResult.content,
          model: sonnetResult.model,
          tokens: { input: sonnetResult.inputTokens, output: sonnetResult.outputTokens },
          durationMs: sonnetResult.durationMs,
        },
        opus: {
          content: opusResult.content,
          model: opusResult.model,
          tokens: { input: opusResult.inputTokens, output: opusResult.outputTokens },
          durationMs: opusResult.durationMs,
        },
      });
    }

    const userKey = compare ? '' : (userId ?? chartKey);
    const currentHash = getConvergenceHash(convergence);

    // Streaming mode (default)  –  Opus
    if (stream && !compare) {
      // For streaming, we generate non-streaming first to cache, then serve
      // This is simpler and ensures we always have a cached copy
      const result = await generateLLMSynthesis(
        convergence, chartSummary, { model: 'opus', locale }
      );

      // Cache the result
      readingCache.set(chartKey, {
        content: result.content,
        convergenceHash: currentHash,
        generatedAt: Date.now(),
        model: result.model,
      });
      incrementMonthlyUsage(userKey);

      // Stream the cached content as SSE for the typing effect
      const encoder = new TextEncoder();
      const words = result.content.split(/(\s+)/); // split preserving whitespace
      const stream = new ReadableStream({
        async start(controller) {
          for (const word of words) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'text', text: word })}\n\n`)
            );
          }
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done', model: result.model })}\n\n`)
          );
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming mode  –  Opus
    const result = await generateLLMSynthesis(
      convergence, chartSummary, { model: 'opus', locale }
    );

    // Cache and record usage
    if (!compare) {
      readingCache.set(chartKey, {
        content: result.content,
        convergenceHash: currentHash,
        generatedAt: Date.now(),
        model: result.model,
      });
      incrementMonthlyUsage(userKey);
    }

    return NextResponse.json({
      content: result.content,
      model: result.model,
      tokens: { input: result.inputTokens, output: result.outputTokens },
      durationMs: result.durationMs,
    });
  } catch (err: unknown) {
    console.error('[tippanni-llm] synthesis error:', err);
    // Don't leak err.message — Anthropic / Supabase error strings contain
    // API URLs, key prefixes, request IDs, column names. Generic only.
    return NextResponse.json(
      { error: 'AI reading failed. Showing rule-based analysis instead.' },
      { status: 500 }
    );
  }
}
