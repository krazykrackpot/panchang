/**
 * Self-Hosted Provider — OpenAI-compatible API (Ollama / llama.cpp)
 *
 * HTTP POST to AI_PANDIT_ENDPOINT/v1/chat/completions.
 * Not testable until infra provisioned — all dev/test uses MockProvider.
 */

import type { LLMProvider, LLMProviderRequest, LLMProviderResponse } from '../types';

const TIMEOUT_MS = 45_000; // 14B on ARM CPU: ~10-12 tok/s, needs headroom

export class SelfHostedProvider implements LLMProvider {
  name = 'self-hosted';
  private endpoint: string;
  private model: string;

  constructor(endpoint?: string, model?: string) {
    this.endpoint = endpoint ?? process.env.AI_PANDIT_ENDPOINT ?? '';
    this.model = model ?? process.env.AI_PANDIT_MODEL ?? 'qwen2.5:14b-instruct';
  }

  isAvailable(): boolean {
    return this.endpoint.length > 0;
  }

  async complete(params: LLMProviderRequest): Promise<LLMProviderResponse> {
    if (!this.endpoint) {
      throw new Error('[ai-pandit] Self-hosted endpoint not configured');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(`${this.endpoint}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: params.system },
            { role: 'user', content: params.user },
          ],
          max_tokens: params.maxTokens,
          temperature: params.temperature ?? 0,
          ...(params.jsonMode ? { response_format: { type: 'json_object' } } : {}),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`[ai-pandit] Self-hosted returned ${res.status}: ${body.slice(0, 200)}`);
      }

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content ?? '';
      const inputTokens = json.usage?.prompt_tokens ?? 0;
      const outputTokens = json.usage?.completion_tokens ?? 0;

      return { content, inputTokens, outputTokens };
    } finally {
      clearTimeout(timeout);
    }
  }
}
