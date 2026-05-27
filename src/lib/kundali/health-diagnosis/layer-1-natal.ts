// src/lib/kundali/health-diagnosis/layer-1-natal.ts
//
// Task C1 — Layer 1 natal composer.
//
// Composes all natal element scores for a given KundaliData, returning an
// ordered NatalElement[] containing either 19 (default) or 22 (extended) entries.
//
// Algorithm:
//   1. Collect strength inputs once (collectStrengthInputs)
//   2. Detect all classical signatures once (detectAllSignatures)
//   3. Determine which ElementIds to score (default vs extended)
//   4. Run each element scorer via SCORERS map
//   5. Return {natalElements, hiddenElements}
//
// No Layer 3 multipliers are applied here — this is the static natal baseline.
// The caller (main entry point, index.ts) applies Layer 3 on top.

import type { KundaliData } from '@/types/kundali';
import type { NatalElement, ElementId } from './types';
import { collectStrengthInputs } from './strength-inputs';
import { detectAllSignatures } from './signatures';
import { SCORERS } from './elements/index';
import { DEFAULT_VISIBLE_IDS, EXTENDED_IDS, ELEMENT_IDS } from './element-catalog';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface Layer1Result {
  /** Scored natal elements — 19 or 22 depending on extended flag. */
  natalElements: NatalElement[];
  /** ElementIds that were excluded (not scored) due to extended: false. */
  hiddenElements: ElementId[];
}

// ─── Main composer ────────────────────────────────────────────────────────────

/**
 * Compose Layer 1 natal element scores for all requested elements.
 *
 * @param kundali   KundaliData from generateKundali()
 * @param extended  When true, includes allergies + cancer + longevity.
 *                  Default: false (19 elements).
 * @param locale    Display locale string (e.g. 'en', 'hi').
 * @returns         Layer1Result with natalElements and hiddenElements arrays.
 */
export function composeLayer1(
  kundali: KundaliData,
  extended: boolean,
  locale: string,
): Layer1Result {
  try {
    // Collect all strength inputs once — shared across all 22 scorers.
    const strength = collectStrengthInputs(kundali);

    // Detect all classical signatures once — shared across all 22 scorers.
    const signatures = detectAllSignatures(kundali);

    // Determine which element IDs to score.
    const visibleIds: ElementId[] = extended ? ELEMENT_IDS : DEFAULT_VISIBLE_IDS;
    const hiddenIds: ElementId[]  = extended ? [] : EXTENDED_IDS;

    // Score each element in order.
    const natalElements: NatalElement[] = [];
    for (const id of visibleIds) {
      const scorer = SCORERS[id];
      if (!scorer) {
        // Guard: should never happen given SCORERS has all 22 entries.
        console.error(`[health-diagnosis/layer-1-natal] no scorer registered for element "${id}"`);
        continue;
      }
      try {
        const element = scorer(kundali, strength, signatures, locale);
        natalElements.push(element);
      } catch (err) {
        console.error(`[health-diagnosis/layer-1-natal] scorer "${id}" threw:`, err);
        // Skip this element rather than aborting the entire composition.
        // The consumer can detect the gap via natalElements.length < expected.
      }
    }

    return { natalElements, hiddenElements: hiddenIds };
  } catch (err) {
    console.error('[health-diagnosis/layer-1-natal] composeLayer1 failed:', err);
    return { natalElements: [], hiddenElements: ELEMENT_IDS };
  }
}
