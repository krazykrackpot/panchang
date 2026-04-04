/**
 * LLM-powered tippanni synthesis using Claude API.
 * Supports both streaming and non-streaming modes.
 */

import type { ConvergenceResult } from '../convergence/types';
import { buildSystemPrompt, buildUserPrompt } from './prompt';

export interface LLMSynthesisResult {
  model: string;
  content: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
}

function getApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');
  return key;
}

function getModelId(model: 'sonnet' | 'opus'): string {
  return model === 'opus' ? 'claude-opus-4-20250514' : 'claude-sonnet-4-20250514';
}

export interface ChartSummary {
  ascendant: string;
  moonSign: string;
  sunSign: string;
  currentDasha: string;
  currentAntardasha: string;
}

/**
 * Non-streaming synthesis — returns full result when complete.
 */
export async function generateLLMSynthesis(
  convergence: ConvergenceResult,
  chartSummary: ChartSummary,
  options: { model: 'sonnet' | 'opus'; locale?: 'en' | 'hi' }
): Promise<LLMSynthesisResult> {
  const apiKey = getApiKey();
  const locale = options.locale || 'en';
  const modelId = getModelId(options.model);

  const start = Date.now();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 2000,
      temperature: 0,
      system: buildSystemPrompt(locale),
      messages: [{ role: 'user', content: buildUserPrompt(convergence, chartSummary) }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error (${response.status}): ${err}`);
  }

  const data = await response.json();

  return {
    model: modelId,
    content: data.content?.[0]?.text || '',
    inputTokens: data.usage?.input_tokens || 0,
    outputTokens: data.usage?.output_tokens || 0,
    durationMs: Date.now() - start,
  };
}

/**
 * Streaming synthesis — returns a ReadableStream of SSE events.
 * Each event is either: { type: 'text', text: '...' } or { type: 'done', usage: {...} }
 */
export async function generateLLMSynthesisStream(
  convergence: ConvergenceResult,
  chartSummary: ChartSummary,
  options: { model: 'sonnet' | 'opus'; locale?: 'en' | 'hi' }
): Promise<ReadableStream> {
  const apiKey = getApiKey();
  const locale = options.locale || 'en';
  const modelId = getModelId(options.model);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 2000,
      temperature: 0,
      stream: true,
      system: buildSystemPrompt(locale),
      messages: [{ role: 'user', content: buildUserPrompt(convergence, chartSummary) }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error (${response.status}): ${err}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  return new ReadableStream({
    async pull(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const parsed = JSON.parse(data);

            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify({ type: 'text', text: parsed.delta.text })}\n\n`)
              );
            }

            if (parsed.type === 'message_delta' && parsed.usage) {
              controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify({ type: 'done', model: modelId, usage: parsed.usage })}\n\n`)
              );
            }
          } catch {
            // Skip unparseable lines
          }
        }
      }
    },
  });
}
