/**
 * Provider Router — Tier 0/1/2 routing with retry and fallback.
 *
 * Tier 0: Template (no LLM)
 * Tier 1: Self-hosted → validate → retry → escalate to Tier 2
 * Tier 2: Anthropic API → validate → retry → template fallback
 *
 * Issue 12 from design review: lastFailures properly declared before use.
 */

import type {
  LLMOutput,
  LLMProvider,
  StructuredAstrologicalContext,
  ClassifiedQuery,
  PanditConfig,
  ValidationResult,
  ValidationFailure,
} from '../types';
import { validate } from '../validation';
import { buildRetryPrompt, type ValidationFailureSummary } from '../context/prompt-builder';

// ─────────────────────────────────────────────────────────────────────────────
// Response parsing (defensive)
// ─────────────────────────────────────────────────────────────────────────────

export function parseLLMOutput(raw: string): LLMOutput | null {
  let cleaned = raw.trim();

  // Strip markdown fences
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  try {
    const parsed = JSON.parse(cleaned);

    if (typeof parsed.narrative !== 'string' || parsed.narrative.length < 50) {
      return null;
    }

    return {
      narrative: parsed.narrative,
      claims: Array.isArray(parsed.claims) ? parsed.claims : [],
      remedies: Array.isArray(parsed.remedies) ? parsed.remedies : [],
      classicalCitations: Array.isArray(parsed.classicalCitations) ? parsed.classicalCitations : [],
    };
  } catch (err) {
    // JSON parse failed — extract narrative as plain text
    // Layer 2 is skipped (no structured claims), Layer 2b scans the prose
    console.error('[ai-pandit] JSON parse failed, falling back to plain text:', (err as Error).message);
    if (cleaned.length > 100) {
      return {
        narrative: cleaned,
        claims: [],
        remedies: [],
        classicalCitations: [],
      };
    }
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Route result
// ─────────────────────────────────────────────────────────────────────────────

export interface RouteResult {
  output: LLMOutput;
  model: string;
  tier: 0 | 1 | 2;
  validationResult: ValidationResult | null;
  regenerationCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────────────────────

export async function route(
  tier: 0 | 1 | 2,
  prompts: { system: string; user: string },
  sac: StructuredAstrologicalContext,
  query: ClassifiedQuery,
  config: PanditConfig,
  providers: {
    selfHosted: LLMProvider;
    anthropic: LLMProvider;
  },
  fillTemplate: (sac: StructuredAstrologicalContext, query: ClassifiedQuery) => LLMOutput,
): Promise<RouteResult> {

  // ── Tier 0: Template ──
  if (tier === 0) {
    const output = fillTemplate(sac, query);
    return { output, model: 'template', tier: 0, validationResult: null, regenerationCount: 0 };
  }

  // ── Tier 1 or 2: LLM call ──
  const provider = tier === 1 ? providers.selfHosted : providers.anthropic;
  const providerName = tier === 1 ? 'self-hosted' : 'anthropic';
  let lastFailures: ValidationFailure[] = []; // Issue 12: declared before use
  let regenerationCount = 0;

  if (provider.isAvailable()) {
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        const promptToUse = attempt === 0
          ? prompts
          : {
              system: prompts.system,
              user: buildRetryPrompt(
                prompts.user,
                lastFailures.map(f => ({ layer: f.layer, message: f.message } as ValidationFailureSummary))
              ),
            };

        const raw = await provider.complete({
          system: promptToUse.system,
          user: promptToUse.user,
          maxTokens: 2000,
          temperature: 0,
          jsonMode: true,
        });

        const parsed = parseLLMOutput(raw.content);
        if (!parsed) {
          lastFailures = [{
            layer: 'claim_verification',
            message: 'Invalid JSON output from model',
            evidence: raw.content.slice(0, 200),
            fixable: false,
          }];
          regenerationCount++;
          console.error(`[ai-pandit] ${providerName} attempt ${attempt + 1}: invalid JSON`);
          continue;
        }

        const validation = validate(parsed, sac, query.locale);

        if (validation.passed) {
          return {
            output: parsed,
            model: `${providerName}:${provider.name}`,
            tier,
            validationResult: validation,
            regenerationCount,
          };
        }

        lastFailures = validation.failures;
        regenerationCount++;
        console.error(
          `[ai-pandit] ${providerName} attempt ${attempt + 1} failed validation:`,
          validation.failures.map(f => f.message).join('; ')
        );

      } catch (err) {
        console.error(`[ai-pandit] ${providerName} call failed:`, err);
        break; // Network error — don't retry, escalate
      }
    }
  }

  // ── Escalation: Tier 1 → Tier 2 ──
  if (tier === 1 && providers.anthropic.isAvailable()) {
    console.error('[ai-pandit] Self-hosted failed, escalating to Anthropic API');
    return route(2, prompts, sac, query, config, providers, fillTemplate);
  }

  // ── Final fallback: Template ──
  console.error('[ai-pandit] All providers failed, falling back to template');
  const output = fillTemplate(sac, query);
  return {
    output,
    model: 'template-fallback',
    tier: 0,
    validationResult: null,
    regenerationCount,
  };
}
