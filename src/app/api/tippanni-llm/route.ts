import { NextRequest, NextResponse } from 'next/server';
import type { KundaliData } from '@/types/kundali';
import { buildConvergenceInput } from '@/lib/tippanni/convergence/relationship-map';
import { runConvergenceEngine } from '@/lib/tippanni/convergence/engine';
import { generateLLMSynthesis, generateLLMSynthesisStream } from '@/lib/tippanni/convergence-llm/synthesizer';
import type { ChartSummary } from '@/lib/tippanni/convergence-llm/synthesizer';
import { RASHIS } from '@/lib/constants/rashis';

// ─── Response cache: store AI readings per chart to avoid re-generation ──────

interface CachedReading {
  content: string;
  convergenceHash: string; // hash of patterns + tone + activation to detect change
  generatedAt: number;
  model: string;
}

const readingCache = new Map<string, CachedReading>();

// ─── Monthly usage tracking per user ─────────────────────────────────────────

interface MonthlyUsage {
  count: number;
  month: string; // "2026-04"
}

const monthlyUsageMap = new Map<string, MonthlyUsage>();

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
  const ascSign = RASHIS[kundali.ascendant.sign - 1]?.name.en || 'Unknown';
  const moonPlanet = kundali.planets.find(p => p.planet.id === 1);
  const moonSign = moonPlanet ? (RASHIS[moonPlanet.sign - 1]?.name.en || 'Unknown') : 'Unknown';
  const sunPlanet = kundali.planets.find(p => p.planet.id === 0);
  const sunSign = sunPlanet ? (RASHIS[sunPlanet.sign - 1]?.name.en || 'Unknown') : 'Unknown';

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
    currentDasha: currentMaha?.planet || 'Unknown',
    currentAntardasha: currentAntar?.planet || 'Unknown',
  };
}

function getChartKey(kundali: KundaliData): string {
  return `${kundali.ascendant.sign}-${kundali.planets.map(p => `${p.planet.id}:${p.house}`).join(',')}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      kundali,
      stream = true,
      locale = 'en',
      compare = false,
    } = body as {
      kundali: KundaliData;
      stream?: boolean;
      locale?: 'en' | 'hi';
      compare?: boolean;
    };

    if (!kundali) {
      return NextResponse.json({ error: 'kundali data required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY?.trim()) {
      return NextResponse.json({ error: 'AI readings not configured' }, { status: 503 });
    }

    // Build convergence data
    const convergenceInput = buildConvergenceInput(kundali);
    const convergence = runConvergenceEngine(convergenceInput);
    const chartSummary = buildChartSummary(kundali);
    const chartKey = getChartKey(kundali);

    // Clean caches periodically
    cleanCaches();

    // Check for cached reading (if convergence patterns haven't changed)
    if (!compare) {
      const cached = readingCache.get(chartKey);
      const currentHash = getConvergenceHash(convergence);

      if (cached && cached.convergenceHash === currentHash && (Date.now() - cached.generatedAt) < CACHE_TTL_MS) {
        // Patterns haven't changed — serve cached reading
        return NextResponse.json({
          content: cached.content,
          model: cached.model,
          cached: true,
          cachedAt: new Date(cached.generatedAt).toISOString(),
        });
      }

      // Monthly usage limit (use chartKey as user proxy for now; replace with actual user ID when auth is wired)
      const userKey = chartKey; // TODO: replace with authenticated user ID
      const monthlyUsage = getMonthlyUsage(userKey);
      const monthlyLimit = MONTHLY_LIMITS['pro'] || 5; // TODO: check actual user tier
      if (monthlyUsage >= monthlyLimit) {
        return NextResponse.json({
          error: `Monthly AI reading limit reached (${monthlyLimit} per month). Your last reading is still available above.`,
          rateLimited: true,
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

    const userKey = compare ? '' : chartKey;
    const currentHash = getConvergenceHash(convergence);

    // Streaming mode (default) — Opus
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

    // Non-streaming mode — Opus
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
  } catch (err: any) {
    console.error('LLM synthesis error:', err);
    return NextResponse.json(
      { error: err.message || 'AI reading failed. Showing rule-based analysis instead.' },
      { status: 500 }
    );
  }
}
