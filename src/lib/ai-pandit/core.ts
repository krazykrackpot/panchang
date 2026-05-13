/**
 * Core Orchestrator — consultPandit()
 *
 * The single entry point for the AI Pandit module.
 * Orchestrates: classify → cache → build context → build prompt →
 *               route (template/self-hosted/API) → validate → respond.
 */

import type { KundaliData } from '@/types/kundali';
import type {
  PanditQuery,
  PanditResponse,
  PanditConfig,
  LLMProvider,
} from './types';
import { buildContext } from './context/context-builder';
import { buildSystemPrompt, buildUserPrompt } from './context/prompt-builder';
import { classifyQuery } from './query/classifier';
import { buildBirthFingerprint } from './query/normaliser';
import { route } from './providers/router';
import { SelfHostedProvider } from './providers/self-hosted';
import { AnthropicProvider } from './providers/anthropic';
import { fillTemplate } from './templates';
import { getDisclaimer } from './templates/disclaimer';
import { ResponseCache } from './cache/response-cache';

// ─────────────────────────────────────────────────────────────────────────────
// Module-level singletons
// ─────────────────────────────────────────────────────────────────────────────

const cache = new ResponseCache();
const selfHostedProvider = new SelfHostedProvider();
const anthropicProvider = new AnthropicProvider();

// ─────────────────────────────────────────────────────────────────────────────
// Default config
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: PanditConfig = {
  tradition: 'parashari',
  maxRetries: 2,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────

export async function consultPandit(
  query: PanditQuery,
  kundali: KundaliData,
  config?: Partial<PanditConfig>,
): Promise<PanditResponse> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // 1. Build birth fingerprint
  const birthFp = buildBirthFingerprint(
    kundali.birthData.date,
    kundali.birthData.time,
    kundali.birthData.lat,
    kundali.birthData.lng,
  );

  // 2. Classify query
  const classified = classifyQuery(query, birthFp);
  console.error(
    `[ai-pandit] classify: "${classified.originalText.slice(0, 60)}" → ${classified.category}/${classified.complexity}/tier-${classified.tier}`
  );

  // 3. Check cache
  if (!cfg.skipCache) {
    const cached = cache.get(classified.cacheKey);
    if (cached) {
      console.error(`[ai-pandit] cache: HIT (key=${classified.cacheKey.slice(0, 8)})`);
      return { ...cached, cached: true };
    }
    console.error(`[ai-pandit] cache: MISS (key=${classified.cacheKey.slice(0, 8)})`);
  }

  // 4. Build SAC from KundaliData
  const sac = buildContext(kundali, classified.category);
  console.error(
    `[ai-pandit] context: SAC built (${sac.planets.length} planets, ${sac.yogas.length} yogas, ${sac.doshas.length} doshas)`
  );

  // 5. Build prompts
  const system = buildSystemPrompt(query.locale, cfg.tradition, sac.primaryVerdict);
  const user = buildUserPrompt(sac, query);

  // 6. Resolve providers
  let providers: { selfHosted: LLMProvider; anthropic: LLMProvider };
  if (cfg.forceProvider === 'mock' && cfg._mockProvider) {
    // Testing path — use injected mock for both tiers
    providers = { selfHosted: cfg._mockProvider, anthropic: cfg._mockProvider };
  } else {
    providers = { selfHosted: selfHostedProvider, anthropic: anthropicProvider };
  }

  // 7. Route to provider
  const tier = cfg.forceTier ?? classified.tier;
  const result = await route(tier, { system, user }, sac, classified, cfg, providers, fillTemplate);

  // 8. Build response
  const disclaimer = getDisclaimer(classified.category, sac.primaryVerdict, query.locale);

  const response: PanditResponse = {
    narrative: result.output.narrative,
    disclaimer,
    tier: result.tier,
    model: result.model,
    cached: false,
    validation: {
      passed: result.validationResult?.passed ?? true,
      layersChecked: result.validationResult
        ? ['verdict_alignment', 'claim_verification', 'narrative_scan', 'tradition_guardrails']
        : [],
      regenerationCount: result.regenerationCount,
      warnings: result.validationResult?.warnings ?? [],
    },
    citations: result.output.classicalCitations ?? [],
    remedies: result.output.remedies ?? [],
    estimatedCostUsd: estimateCost(result.model, result.inputTokens, result.outputTokens),
  };

  // 9. Cache the response
  if (!cfg.skipCache) {
    const hasTransitData = classified.complexity !== 'factual';
    cache.set(classified.cacheKey, response, hasTransitData);
  }

  // 10. Training data callback
  if (cfg.onValidatedResponse && result.validationResult?.passed) {
    try {
      cfg.onValidatedResponse({
        sac,
        query: classified,
        response: result.output,
        model: result.model,
        validationResult: result.validationResult,
      });
    } catch (err) {
      console.error('[ai-pandit] onValidatedResponse callback failed:', err);
    }
  }

  return response;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cost estimation
// ─────────────────────────────────────────────────────────────────────────────

/** Estimate USD cost from model name and actual token counts.
 *  Haiku pricing (May 2026): $1/$5 per MTok in/out. */
function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  if (model.includes('self-hosted') || model.includes('template')) return 0;
  if (inputTokens === 0 && outputTokens === 0) return 0;
  // Haiku: $1/MTok input, $5/MTok output
  const inputCost = (inputTokens / 1_000_000) * 1;
  const outputCost = (outputTokens / 1_000_000) * 5;
  return parseFloat((inputCost + outputCost).toFixed(6));
}
