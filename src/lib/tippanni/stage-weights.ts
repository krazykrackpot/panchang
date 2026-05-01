/**
 * Theme × Life Stage weight table.
 *
 * Used by dasha synthesis, convergence scoring, and yoga relevance
 * to shift emphasis based on the user's current life phase.
 *
 * Weights: 0.1 (barely relevant) to 1.5 (peak relevance).
 * A weight of 1.0 = neutral (no boost or suppression).
 */

import type { LifeStage } from '@/lib/kundali/life-stage';

export type ThemeKey = 'career' | 'education' | 'marriage' | 'wealth' | 'health' | 'spiritual' | 'children' | 'family';

/**
 * How important each life theme is at each life stage.
 *
 * Rationale:
 * - Student: education dominant, career emerging, health low-concern
 * - Early career: career + marriage peak, wealth building begins
 * - Householder: career peak, wealth + children critical
 * - Established: wealth preservation, health awareness rising, children's future
 * - Elder: health dominant, spiritual awakening, family/legacy
 * - Sage: health + spiritual peak, material concerns fade
 */
export const THEME_STAGE_WEIGHT: Record<ThemeKey, Record<LifeStage, number>> = {
  career: {
    student: 0.8,
    early_career: 1.3,
    householder: 1.5,
    established: 1.0,
    elder: 0.5,
    sage: 0.3,
  },
  education: {
    student: 1.5,
    early_career: 1.0,
    householder: 0.6,
    established: 0.4,
    elder: 0.3,
    sage: 0.5,  // scriptural study gains value
  },
  marriage: {
    student: 0.6,
    early_career: 1.4,
    householder: 1.2,
    established: 0.8,
    elder: 0.7,
    sage: 0.5,
  },
  wealth: {
    student: 0.4,
    early_career: 0.8,
    householder: 1.5,
    established: 1.3,
    elder: 0.8,
    sage: 0.4,
  },
  health: {
    student: 0.3,
    early_career: 0.4,
    householder: 0.7,
    established: 1.2,
    elder: 1.5,
    sage: 1.5,
  },
  spiritual: {
    student: 0.3,
    early_career: 0.3,
    householder: 0.5,
    established: 0.8,
    elder: 1.3,
    sage: 1.5,
  },
  children: {
    student: 0.1,
    early_career: 0.5,
    householder: 1.5,
    established: 1.2,  // children's marriage/career
    elder: 0.8,         // grandchildren
    sage: 0.5,
  },
  family: {
    student: 0.5,
    early_career: 0.7,
    householder: 1.3,
    established: 1.2,
    elder: 1.0,
    sage: 0.8,
  },
};

/**
 * Get the weight for a theme at a given life stage.
 * Returns 1.0 (neutral) if theme or stage not found.
 */
export function getThemeWeight(theme: string, stage: LifeStage): number {
  const themeWeights = THEME_STAGE_WEIGHT[theme as ThemeKey];
  if (!themeWeights) return 1.0;
  return themeWeights[stage] ?? 1.0;
}
