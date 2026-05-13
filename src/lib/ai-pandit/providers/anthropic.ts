/**
 * Anthropic Provider — wraps existing Claude client for Tier 2 overflow.
 *
 * Uses Haiku (cheapest) by default. Falls back gracefully when
 * ANTHROPIC_API_KEY is not set.
 */

import type { LLMProvider, LLMProviderRequest, LLMProviderResponse } from '../types';

// Lazy import to avoid pulling Anthropic SDK into bundles when not used
let _client: any = null;

function getClient(): any {
  if (_client) return _client;
  try {
    // Dynamic import of the existing singleton — avoids hard dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getClaudeClient } = require('@/lib/llm/llm-client');
    _client = getClaudeClient();
    return _client;
  } catch {
    return null;
  }
}

export class AnthropicProvider implements LLMProvider {
  name = 'anthropic-haiku';
  private model: string;

  constructor(model?: string) {
    this.model = model ?? 'claude-haiku-4-5-20251001';
  }

  isAvailable(): boolean {
    return !!process.env.ANTHROPIC_API_KEY?.trim();
  }

  async complete(params: LLMProviderRequest): Promise<LLMProviderResponse> {
    const client = getClient();
    if (!client) {
      throw new Error('[ai-pandit] Anthropic client not available');
    }

    const response = await client.messages.create({
      model: this.model,
      max_tokens: params.maxTokens,
      temperature: params.temperature ?? 0,
      system: params.system,
      messages: [{ role: 'user', content: params.user }],
    });

    const content = response.content
      ?.map((block: any) => block.type === 'text' ? block.text : '')
      .join('') ?? '';

    return {
      content,
      inputTokens: response.usage?.input_tokens ?? 0,
      outputTokens: response.usage?.output_tokens ?? 0,
    };
  }
}
