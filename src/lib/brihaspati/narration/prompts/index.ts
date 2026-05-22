/**
 * Public API for the prompt library. The original
 * src/lib/brihaspati/narration/prompts.ts is replaced by this module.
 *
 * Why a library and not a flat file:
 *   - Native multi-locale rules without template substitution (REVIEW L1)
 *   - Pluggable citation modes (REVIEW L3)
 *   - Pluggable safety rule per category (REVIEW P3)
 *   - Voice variants for post-launch A/B (REVIEW I1)
 *   - Hash-based versioning that captures every composition variant
 *
 * Callers should use `systemPromptFor()`. `systemPromptVersion()` is kept
 * for legacy callers of the old prompts.ts module — it returns the version
 * hash for the default-voice, principle-only-citation composition of the
 * given category + locale.
 */

import type { BrihaspatiCategory, BrihaspatiLocale } from '../../types';
import { buildPrompt, type BuildPromptInput, type BuiltPrompt, type VoiceVariant } from './builder';
import type { CitationMode } from './rules/citation';

export type { CitationMode } from './rules/citation';
export type { VoiceVariant } from './builder';

/**
 * Produce the system prompt for a (category, locale, voice, citationMode)
 * tuple. The version hash is deterministic for the tuple.
 */
export function systemPromptFor(input: BuildPromptInput): BuiltPrompt {
  return buildPrompt(input);
}

/**
 * Legacy compatibility — returns just the prompt text for the default
 * voice, principle-only citation, and the 'general' category at this
 * locale. Prefer `systemPromptFor({ category, locale, ... })` for new
 * callers because the category-specific scaffold materially improves
 * narration quality.
 */
export function systemPrompt(
  locale: BrihaspatiLocale,
  category: BrihaspatiCategory = 'general',
  voice: VoiceVariant = 'default',
  citationMode: CitationMode = 'principle-only',
): string {
  return buildPrompt({ locale, category, voice, citationMode }).text;
}

/**
 * Legacy compatibility — returns the version hash. Same defaults as
 * `systemPrompt()` above.
 */
export function systemPromptVersion(
  locale: BrihaspatiLocale,
  category: BrihaspatiCategory = 'general',
  voice: VoiceVariant = 'default',
  citationMode: CitationMode = 'principle-only',
): string {
  return buildPrompt({ locale, category, voice, citationMode }).version;
}
