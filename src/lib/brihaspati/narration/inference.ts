/**
 * Layer-3 inference orchestrator.
 *
 * Decides which tier handles the question (Tier 2 Claude API → Tier 0
 * template fallback at launch; Tier 1 self-hosted Qwen is a future
 * sandwich layer per INFRASTRUCTURE.md Phase 5+).
 *
 * Per validation-wall Layer 3: the LLM only narrates from the provided
 * structured context. The system prompt and the structured JSON body
 * are the only things the LLM sees — the call site never lets a free
 * user-message into the LLM's view without being pre-shaped by Layer
 * 2's buildContext().
 *
 * Streaming: callers consume the AsyncIterable<string> token by token.
 * The full text is also returned in the final BrihaspatiNarration via
 * `collect(answer)` for persistence.
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  BrihaspatiAnswer,
  BrihaspatiContext,
  BrihaspatiNarration,
  BrihaspatiTier,
} from '../types';
import { BRIHASPATI_TIERS } from '../types';
import { systemPromptFor } from './prompts';
import { template } from './fallback';
import { validate } from './validator';

/** Model selection. Sonnet 4.6 by default — narration doesn't need Opus. */
const CLAUDE_MODEL = process.env.BRIHASPATI_CLAUDE_MODEL?.trim() || 'claude-sonnet-4-6';
/**
 * Output token cap. The prompt now asks for 500–800 words for a
 * substantive reading; ~1500 tokens ≈ 1100 words leaves comfortable
 * headroom plus space for Devanagari which is more token-dense than
 * Latin script. Truncation is flagged below as a telemetry signal.
 */
const MAX_OUTPUT_TOKENS = 1500;
const TEMPERATURE = 0.4;

let clientSingleton: Anthropic | null = null;
function client(): Anthropic {
  if (clientSingleton) return clientSingleton;
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('[brihaspati] ANTHROPIC_API_KEY not set');
  }
  clientSingleton = new Anthropic({ apiKey });
  return clientSingleton;
}

/** For tests only. */
export function __resetClientForTests() {
  clientSingleton = null;
}

/**
 * Format the structured context as a single user-message payload. The
 * LLM sees the original question + the JSON context; nothing else.
 */
function formatUserMessage(ctx: BrihaspatiContext): string {
  // Subject framing: when the asker is asking about a family member, tell
  // the LLM to use "<Name>'s chart shows…" framing instead of "your chart
  // shows…". The asker remains the audience — the chart's owner is the
  // grammatical subject of the reading.
  const subjectLine = ctx.subject.kind === 'family'
    ? `\nThis question is about ${ctx.subject.name} (a family member of the asker). Use "${ctx.subject.name}'s chart shows…" framing, NEVER "your chart shows…". Address the asker as "you" but refer to the chart owner by name. Use third-person pronouns (he/she/they) for ${ctx.subject.name} as appropriate.\n`
    : '';
  // Parent-Bhava-proxy directive: the user asked about a relative whose
  // chart we don't have, and explicitly opted into a partial reading
  // from their own chart's Nth house (the classical Bhava for that
  // relative). The narration MUST open with an honest disclaimer that
  // this is partial and gently encourage adding the relative's chart.
  const proxyLine = ctx.parentBhavaProxy
    ? `\nIMPORTANT  –  Parent-chart-proxy mode: The user asked about their ${ctx.parentBhavaProxy.relative}, but the asker's daughter/son/spouse/parent chart is NOT on file. Read this question from the asker's OWN chart's ${ctx.parentBhavaProxy.label.en}. Open the answer with a one-sentence honest disclaimer: "I don't have your ${ctx.parentBhavaProxy.relative}'s chart yet, so I'm reading this from your own ${ctx.parentBhavaProxy.label.en}  –  the karmic indicator for this relationship." Close the answer with a gentle nudge to add the relative's birth details for a deeper, direct reading. Stay within the asker's chart  –  never invent the relative's chart. The reading is indicative of the karmic field around this relationship, not deterministic about the individual.\n`
    : '';
  // Health diagnosis context: pre-computed structured summary appended
  // before the chart JSON when the question is health-related. The LLM
  // MUST cite specific elements from this block rather than inventing
  // general health claims. Only present when `questionIsHealthRelated()`
  // returned true at order time — absent for non-health questions.
  const healthLine = ctx.healthContext
    ? `\n${ctx.healthContext}\n\nUse the health diagnosis context above to cite specific elements (e.g. "Your Digestive element shows elevated vulnerability…") rather than generic health observations. Do NOT invent health information beyond what appears in the context.\n`
    : '';
  return [
    `User question: ${ctx.question}`,
    subjectLine,
    proxyLine,
    healthLine,
    'Chart analysis JSON (authoritative — do not invent beyond this):',
    JSON.stringify(
      {
        category: ctx.category,
        subject: ctx.subject,
        chart: ctx.chart,
        dashas: ctx.dashas,
        yogas: ctx.yogas,
        doshas: ctx.doshas,
        transits: ctx.transits,
        analysis: ctx.analysis,
      },
      null,
      2,
    ),
  ].join('\n');
}

/**
 * Call Claude with streaming. Returns the full narration as one chunk
 * (the API route layers SSE on top via an AsyncIterable wrapper —
 * here we collect and return for simplicity of validation).
 */
async function callClaude(ctx: BrihaspatiContext): Promise<BrihaspatiNarration> {
  const prompt = systemPromptFor({
    category: ctx.category,
    locale: ctx.locale,
    voice: 'default',
    citationMode: 'principle-only',
  });
  const stream = await client().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    temperature: TEMPERATURE,
    system: [
      {
        type: 'text',
        text: prompt.text,
        cache_control: { type: 'ephemeral' }, // §6 — cache the long system prompt
      },
    ],
    messages: [{ role: 'user', content: formatUserMessage(ctx) }],
    stream: true,
  });

  let text = '';
  let inputTokens = 0;
  let outputTokens = 0;

  for await (const event of stream) {
    if (event.type === 'content_block_delta') {
      const delta = event.delta as { type?: string; text?: string };
      if (delta.type === 'text_delta' && delta.text) {
        text += delta.text;
      }
    } else if (event.type === 'message_delta') {
      const usage = event.usage;
      if (usage && typeof usage.output_tokens === 'number') {
        outputTokens = usage.output_tokens;
      }
    } else if (event.type === 'message_start') {
      const usage = event.message.usage;
      if (usage && typeof usage.input_tokens === 'number') {
        inputTokens = usage.input_tokens;
      }
    }
  }

  // I4 — truncation flag. If the model emitted exactly MAX_OUTPUT_TOKENS,
  // the answer was almost certainly cut mid-sentence. Log so the
  // training-data flywheel can filter these rows out (output_tokens ==
  // cap is the §11 filter signal) and so ops can plot a frequency.
  if (outputTokens === MAX_OUTPUT_TOKENS) {
    console.error(
      `[brihaspati] possible truncation: hit max_tokens=${MAX_OUTPUT_TOKENS} for category=${ctx.category} locale=${ctx.locale}`,
    );
  }

  return {
    text,
    modelUsed: CLAUDE_MODEL,
    inputTokens,
    outputTokens,
    systemPromptVersion: prompt.version,
  };
}

interface NarrateOptions {
  /** Force a specific tier; used by tests + ops debug. */
  forceTier?: BrihaspatiTier;
  /** Inject a Claude callable so tests don't hit the network. */
  __claudeOverride?: (ctx: BrihaspatiContext) => Promise<BrihaspatiNarration>;
}

/**
 * Main entry point. Tries Tier 2 (Claude), falls back to Tier 0
 * (template). Layer 4 runs on both — failures from Tier 2 trigger a
 * second Claude attempt; persistent failures fall through to the
 * template. The result records tier, validation status, and retry count
 * for persistence into brihaspati_questions.
 */
export async function narrate(
  ctx: BrihaspatiContext,
  options: NarrateOptions = {},
): Promise<BrihaspatiAnswer> {
  const claude = options.__claudeOverride ?? callClaude;
  const maxAttempts = 2;
  const forceTemplate = options.forceTier === BRIHASPATI_TIERS.TEMPLATE;

  let retryCount = 0;

  if (!forceTemplate) {
    let lastNarration: BrihaspatiNarration | null = null;
    let lastFailures: ReturnType<typeof validate>['failures'] = [];

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const narration = await claude(ctx);
        const v = validate(narration.text, ctx);
        lastNarration = narration;
        lastFailures = v.failures;

        if (v.passed) {
          return {
            tier: BRIHASPATI_TIERS.CLAUDE_API,
            narration,
            validationPassed: true,
            validationFailures: [],
            retryCount: attempt - 1,
          };
        }
        retryCount = attempt; // count this as a retry-needed attempt
      } catch (err) {
        console.error('[brihaspati] claude failed:', err);
        retryCount = attempt;
      }
    }

    // Layer-4 keep-or-block: per spec, log-only mode at launch means we
    // STILL surface the last Claude attempt to the user with a recorded
    // failure list. Strict-block mode (BRIHASPATI_LAYER4_BLOCK=true)
    // falls through to template.
    const block = process.env.BRIHASPATI_LAYER4_BLOCK === 'true';
    if (lastNarration && !block) {
      return {
        tier: BRIHASPATI_TIERS.CLAUDE_API,
        narration: lastNarration,
        validationPassed: false,
        validationFailures: lastFailures,
        retryCount,
      };
    }
  }

  // Tier-0 template fallback. Always succeeds.
  const fallback = template(ctx);
  return {
    tier: BRIHASPATI_TIERS.TEMPLATE,
    narration: fallback,
    validationPassed: true, // templates pass by construction
    validationFailures: [],
    retryCount,
  };
}
