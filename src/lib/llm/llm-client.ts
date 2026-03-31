/**
 * Shared Claude API client singleton
 * All LLM features use this to avoid creating multiple instances.
 */

import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

export function getClaudeClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export function isLLMAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

export const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
export const MAX_CHAT_MESSAGE_LENGTH = 500;
export const MAX_CHAT_HISTORY = 10;
export const CHAT_RATE_LIMIT = 20; // per session
