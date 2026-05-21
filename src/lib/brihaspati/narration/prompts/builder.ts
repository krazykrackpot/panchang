/**
 * Prompt builder — composes voice + scaffold + rule blocks into a single
 * system prompt string, plus a deterministic version hash.
 *
 * Composition order (from top to bottom of the prompt):
 *   1. Voice persona block
 *   2. Per-category Jyotish-lens scaffold
 *   3. Common-rules block (#1–7) in the user's locale
 *   4. Safety rule (#8) — if the category is in SAFETY_CATEGORIES
 *
 * The result is hashed (sha256, 16-char slice) and persisted as
 * brihaspati_questions.system_prompt_version. Distinct {category, locale,
 * voice, citationMode} tuples produce distinct hashes — the training-data
 * flywheel groups answers by prompt revision without manual tagging.
 */

import { createHash } from 'node:crypto';
import type { BrihaspatiCategory, BrihaspatiLocale } from '../../types';
import { commonRules } from './rules/common';
import { citationRule, type CitationMode } from './rules/citation';
import { safetyRule } from './rules/safety';
import { defaultVoice } from './voices/default';
import { brihaspatiVoice } from './voices/brihaspati';
import { categoryScaffold } from './scaffolds/per-category';

export type VoiceVariant = 'default' | 'brihaspati';

export interface BuildPromptInput {
  category: BrihaspatiCategory;
  locale: BrihaspatiLocale;
  voice?: VoiceVariant;
  citationMode?: CitationMode;
}

export interface BuiltPrompt {
  text: string;
  /** sha256 of text, 16-char prefix. Persists to system_prompt_version. */
  version: string;
}

function voiceBlock(variant: VoiceVariant, locale: BrihaspatiLocale): string {
  switch (variant) {
    case 'default': return defaultVoice(locale);
    case 'brihaspati': return brihaspatiVoice(locale);
  }
}

export function buildPrompt(input: BuildPromptInput): BuiltPrompt {
  const voice = input.voice ?? 'default';
  const citationMode = input.citationMode ?? 'principle-only';

  const parts: string[] = [];
  parts.push(voiceBlock(voice, input.locale));
  parts.push(categoryScaffold(input.category, input.locale));

  const citation = citationRule(citationMode, input.locale);
  parts.push(commonRules(input.locale, citation));

  const safety = safetyRule(input.category, input.locale);
  if (safety) {
    parts.push(safety);
  }

  const text = parts.filter(Boolean).join('\n\n').trim();
  const version = createHash('sha256').update(text).digest('hex').slice(0, 16);
  return { text, version };
}
