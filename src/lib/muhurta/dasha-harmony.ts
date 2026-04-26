/**
 * Dasha Harmony Scoring — rates antardasha lord compatibility with an activity.
 *
 * Uses the activity's goodHoras (benefic planet list) as a proxy for which
 * planet periods favor the activity. Antardasha lord is weighted higher than
 * mahadasha because it governs the current sub-period (months, not years).
 */

import type { ExtendedActivity } from '@/types/muhurta-ai';

// Malefic planets for general muhurta purposes
// Saturn(6), Mars(2), Rahu(7), Ketu(8)
const MALEFIC_IDS = new Set([2, 6, 7, 8]);

export function scoreDashaHarmony(
  dashaLords: { maha: number; antar: number; pratyantar: number },
  activity: ExtendedActivity,
): { score: number; label: string; favorable: boolean } {
  const benefics = new Set(activity.goodHoras);

  // Antardasha lord match → full score
  if (benefics.has(dashaLords.antar)) {
    return { score: 10, label: 'Antardasha lord favors this activity', favorable: true };
  }

  // Mahadasha lord match (antar didn't match) → partial score
  if (benefics.has(dashaLords.maha)) {
    return { score: 5, label: 'Mahadasha lord favors this activity', favorable: true };
  }

  // Malefic antardasha lord → zero
  if (MALEFIC_IDS.has(dashaLords.antar)) {
    return { score: 0, label: 'Malefic antardasha lord suppresses this activity', favorable: false };
  }

  // Neutral — non-matching, non-malefic
  return { score: 3, label: 'Neutral dasha period', favorable: true };
}
