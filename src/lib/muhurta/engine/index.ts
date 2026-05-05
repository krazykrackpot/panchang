/**
 * Muhurta Engine — Entry Point
 *
 * Registers all rules and exports the evaluation + reasoning API.
 * Import this file to get a fully initialised engine.
 */

import { registerRules, getRuleCount } from './registry';
import { PANCHANGA_RULES } from './rules/panchanga';
import { PERIOD_RULES } from './rules/periods';
import { KAALA_RULES } from './rules/kaala';
import { LAGNA_RULES } from './rules/lagna';
import { VARJYAM_RULES } from './rules/varjyam';
import { SPECIAL_YOGA_RULES } from './rules/special-yogas';
import { GRAHA_RULES } from './rules/graha';
import { PERSONAL_RULES } from './rules/personal';
import { GANDANTHARA_RULES } from './rules/gandanthara';

// Register all rules on first import (idempotent — check if already registered)
if (getRuleCount() === 0) {
  registerRules([
    ...PANCHANGA_RULES,
    ...PERIOD_RULES,
    ...KAALA_RULES,
    ...LAGNA_RULES,
    ...VARJYAM_RULES,
    ...SPECIAL_YOGA_RULES,
    ...GRAHA_RULES,
    ...PERSONAL_RULES,
    ...GANDANTHARA_RULES,
  ]);
}

// Re-export the public API
export { evaluateWindow } from './evaluator';
export { generateVerdict } from './reasoning';
export { buildDayContext, buildWindowContext } from './context-builder';
export { getRuleCount, getAllRules } from './registry';
export { unifiedScan } from './scanner';
export type { UnifiedScanOptions, ScoredWindow } from './scanner';
export type {
  RuleContext, RuleAssessment, ResolvedAssessment,
  EvaluationResult, MuhurtaVerdict, MuhurtaGrade, WindowBreakdown,
} from './types';
