/**
 * Template Engine — Tier 0 response generation.
 *
 * Produces a complete LLMOutput from SAC data without any LLM call.
 * Used for factual queries and as fallback when providers fail.
 */

import type {
  LLMOutput,
  StructuredAstrologicalContext,
  ClassifiedQuery,
} from '../types';
import { generateTemplateNarrative } from './narratives';

export function fillTemplate(
  sac: StructuredAstrologicalContext,
  query: ClassifiedQuery,
): LLMOutput {
  const narrative = generateTemplateNarrative(sac, query.category, query.locale);

  return {
    narrative,
    claims: [], // Templates don't produce structured claims
    remedies: [],
    classicalCitations: [],
  };
}
