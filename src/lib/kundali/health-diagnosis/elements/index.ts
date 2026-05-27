// src/lib/kundali/health-diagnosis/elements/index.ts
//
// Task B23 — Elements index aggregator.
//
// Exports:
//   SCORERS  — Record<ElementId, ElementScorer> mapping all 22 element ids
//              to their scorer functions.
//   ElementScorer — canonical function type for a single element scorer.
//
// Every scorer in this map follows the same signature:
//   (k, strength, signatures, locale) → NatalElement
//
// Import rules (CLAUDE.md "NEVER Duplicate Logic"):
//   All 22 scorer functions are imported from their individual files.
//   No scorer logic is defined here — this file is a pure re-export/index.

import type { KundaliData } from '@/types/kundali';
import type { NatalElement, ElementId } from '../types';
import type { StrengthInputs } from '../strength-inputs';

// ─── Element scorers ──────────────────────────────────────────────────────────

import { scoreVitality }     from './vitality';
import { scoreMental }       from './mental';
import { scoreDigestive }    from './digestive';
import { scoreCardiac }      from './cardiac';
import { scoreRespiratory }  from './respiratory';
import { scoreNervous }      from './nervous';
import { scoreSkeletal }     from './skeletal';
import { scoreMuscular }     from './muscular';
import { scoreSkin }         from './skin';
import { scoreEyes }         from './eyes';
import { scoreReproductive } from './reproductive';
import { scoreEndocrine }    from './endocrine';
import { scoreImmunity }     from './immunity';
import { scoreChronic }      from './chronic';
import { scoreAccidents }    from './accidents';
import { scoreSurgery }      from './surgery';
import { scorePsychiatric }  from './psychiatric';
import { scoreAddictions }   from './addictions';
import { scoreSleep }        from './sleep';
import { scoreAllergies }    from './allergies';
import { scoreCancer }       from './cancer';
import { scoreLongevity }    from './longevity';

// ─── Public type ──────────────────────────────────────────────────────────────

/**
 * Canonical function type for any element scorer.
 *
 * @param k          KundaliData from generateKundali()
 * @param strength   Pre-collected strength inputs from collectStrengthInputs()
 * @param signatures Boolean map from detectAllSignatures()
 * @param locale     Display locale string (e.g. 'en', 'hi')
 * @returns          NatalElement with vulnerability score, rating, factors, and
 *                   matched classical signatures.
 */
export type ElementScorer = (
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  locale: string,
) => NatalElement;

// ─── SCORERS map ──────────────────────────────────────────────────────────────

/**
 * All 22 element scorers keyed by their stable ElementId.
 *
 * Order follows the §4 element matrix (vitality through longevity).
 * The map is exhaustive — every ElementId must have an entry. The test
 * `__tests__/elements/_aggregator.test.ts` asserts this invariant.
 */
export const SCORERS: Record<ElementId, ElementScorer> = {
  vitality:     scoreVitality,
  mental:       scoreMental,
  digestive:    scoreDigestive,
  cardiac:      scoreCardiac,
  respiratory:  scoreRespiratory,
  nervous:      scoreNervous,
  skeletal:     scoreSkeletal,
  muscular:     scoreMuscular,
  skin:         scoreSkin,
  eyes:         scoreEyes,
  reproductive: scoreReproductive,
  endocrine:    scoreEndocrine,
  immunity:     scoreImmunity,
  chronic:      scoreChronic,
  accidents:    scoreAccidents,
  surgery:      scoreSurgery,
  psychiatric:  scorePsychiatric,
  addictions:   scoreAddictions,
  sleep:        scoreSleep,
  allergies:    scoreAllergies,
  cancer:       scoreCancer,
  longevity:    scoreLongevity,
};
