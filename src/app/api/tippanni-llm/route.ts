import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { KundaliData } from '@/types/kundali';
import { buildConvergenceInput } from '@/lib/tippanni/convergence/relationship-map';
import { runConvergenceEngine } from '@/lib/tippanni/convergence/engine';
import { generateLLMSynthesis, generateLLMSynthesisStream } from '@/lib/tippanni/convergence-llm/synthesizer';
import type { ChartSummary } from '@/lib/tippanni/convergence-llm/synthesizer';
import { RASHIS } from '@/lib/constants/rashis';
import { getServerSupabase } from '@/lib/supabase/server';
import { getFreshSnapshot } from '@/lib/supabase/get-fresh-snapshot';
import { getUserTier } from '@/lib/subscription/check-access';
import { locales } from '@/lib/i18n/config';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// Minimal runtime guard for snapshot.full_kundali — see ai-reading route
// for the same shape rationale. Catches DB corruption before the cast.
const FullKundaliMinShape = z.object({
  ascendant: z.object({ sign: z.number().int().min(1).max(12) }),
  planets: z.array(z.unknown()).min(1),
  houses: z.array(z.unknown()).length(12),
}).passthrough();

const TippanniLlmBodySchema = z.object({
  stream: z.boolean().optional(),
  // P2-34 — canonical locale list from @/lib/i18n/config (previously
  // restricted to en/hi, blocking every regional language).
  locale: z.enum(locales).optional(),
  compare: z.boolean().optional(),
}).passthrough();

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

// ─── Monthly usage tracking ──────────────────────────────────────────────
//
// Round 2 IDEM-4 — atomic check-and-increment via claim_monthly_usage RPC
// (migration 038). Replaces the previous in-memory per-user counter map
// which (a) didn't share across Fluid Compute containers and (b) had a
// TOCTOU race with the LLM call between read and increment, enabling
// free-tier callers to burn Anthropic tokens past the monthly cap.

const MONTHLY_LIMITS: Record<string, number> = {
  pro: 5,
  jyotishi: 15,
  free: 0,
};

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
  // Monthly usage now lives in daily_usage via claim_monthly_usage RPC
  // (Sprint 19 / IDEM-4). No in-memory state to evict.
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

  // P1-1 — Bearer-only auth (cookie fallback dropped). State-changing AI POST
  // that consumes Anthropic quota and writes ai_readings; cookie auth + cross-
  // origin form post would have been a CSRF + quota-burn vector. SPA always
  // sends Bearer via authedFetch.

  if (!userId) return { userId: null, tier: 'free' };

  const { tier } = await getUserTier(userId);
  return { userId, tier };
}

export const maxDuration = 30; // LLM inference

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const bodyParsed = TippanniLlmBodySchema.safeParse(rawBody);
    if (!bodyParsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: bodyParsed.error.issues.map(i => i.path.join('.')) },
        { status: 400 },
      );
    }
    const stream = bodyParsed.data.stream ?? true;
    const locale = bodyParsed.data.locale ?? 'en';
    const compare = bodyParsed.data.compare ?? false;
    const clientKundali = (rawBody as { kundali?: unknown })?.kundali;

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
    const kundaliShape = FullKundaliMinShape.safeParse(snapshot.full_kundali);
    if (!kundaliShape.success) {
      console.error('[tippanni-llm] snapshot.full_kundali shape mismatch for user', userId, kundaliShape.error.issues);
      return NextResponse.json({ error: 'Stored chart is malformed; please regenerate from /kundali.' }, { status: 500 });
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

      // Round 2 IDEM-4 — atomic monthly claim via claim_monthly_usage RPC.
      // FOR UPDATE row locks serialise concurrent claims for this user
      // so two parallel requests can't both pass the gate under the
      // monthly cap. Claim BEFORE the LLM call so token-burn aligns with
      // accounted increments.
      const monthlyLimit = MONTHLY_LIMITS[tier] ?? 0;
      if (monthlyLimit === 0) {
        return NextResponse.json({
          error: 'AI readings require a Pro or Jyotishi subscription.',
          rateLimited: true,
          tier,
          usage: { used: 0, limit: 0 },
        }, { status: 429 });
      }
      const { data: claimRows, error: claimErr } = await supabase.rpc('claim_monthly_usage', {
        p_user_id: userId,
        p_field: 'tippanni_llm_count',
        p_limit: monthlyLimit,
      });
      if (claimErr) {
        console.error('[tippanni-llm] claim_monthly_usage failed:', claimErr.message);
        return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
      }
      const claimRow = Array.isArray(claimRows) ? claimRows[0] : claimRows;
      const monthlyUsage = Number(claimRow?.new_count ?? 0);
      if (!claimRow?.claimed) {
        return NextResponse.json({
          error: `Monthly AI reading limit reached (${monthlyLimit} per month on ${tier} plan). Your last reading is still available above.`,
          rateLimited: true,
          tier,
          usage: { used: monthlyUsage, limit: monthlyLimit },
        }, { status: 429 });
      }
    }

    // P2-34 — the route now accepts every canonical locale, but the
    // LLM synthesizer's prompt templates only cover en/hi today. Map
    // every Devanagari-script locale (hi, mai, retired sa) to the
    // Hindi persona and everything else to English. Matches the
    // narrowing used in /api/horoscope + /api/horoscope/personalized
    // for consistency (Gemini #155). When the synthesizer's locale
    // support widens, drop this narrowing.
    const llmLocale: 'en' | 'hi' = isDevanagariLocale(locale ?? 'en') ? 'hi' : 'en';

    // Comparison mode (non-streaming, both models)
    if (compare) {
      const [sonnetResult, opusResult] = await Promise.all([
        generateLLMSynthesis(convergence, chartSummary, { model: 'sonnet', locale: llmLocale }),
        generateLLMSynthesis(convergence, chartSummary, { model: 'opus', locale: llmLocale }),
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

    const currentHash = getConvergenceHash(convergence);

    // Streaming mode (default)  –  Opus
    if (stream && !compare) {
      // For streaming, we generate non-streaming first to cache, then serve
      // This is simpler and ensures we always have a cached copy
      const result = await generateLLMSynthesis(
        convergence, chartSummary, { model: 'opus', locale: llmLocale }
      );

      // Cache the result. Counter was already incremented atomically by
      // claim_monthly_usage in the gate above — no second increment.
      readingCache.set(chartKey, {
        content: result.content,
        convergenceHash: currentHash,
        generatedAt: Date.now(),
        model: result.model,
      });

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
      convergence, chartSummary, { model: 'opus', locale: llmLocale }
    );

    // Cache. Counter was already incremented atomically by
    // claim_monthly_usage in the gate above (claim path only runs when
    // !compare, matching this branch).
    if (!compare) {
      readingCache.set(chartKey, {
        content: result.content,
        convergenceHash: currentHash,
        generatedAt: Date.now(),
        model: result.model,
      });
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
