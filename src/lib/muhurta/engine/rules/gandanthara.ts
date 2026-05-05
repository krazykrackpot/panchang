/**
 * Tithi-Gandanthara Rule
 *
 * Per Muhurta Chintamani Ch.6, the junction periods between specific tithis
 * are inauspicious:
 *   - Last 2 ghatis of Panchami (5th), Dashami (10th), Purnima (15th)
 *     and their Krishna equivalents (20th, 25th, 30th)
 *   - First 2 ghatis of Shashthi (6th), Ekadashi (11th), Krishna Pratipada (16th)
 *     and their Krishna equivalents (21st, 26th, 1st)
 *
 * These "Gandanthara" periods are transitional zones where tithi energy is unstable.
 * 2 ghatis ≈ 2/60 of a tithi ≈ 0.4° of Moon-Sun elongation.
 *
 * Tier 3 (standard) — not cancellable by lagna since it's a temporal defect.
 * Source: MC Ch.6
 */

import type { MuhurtaRule, RuleAssessment, RuleContext } from '../types';
import { sunLongitude, moonLongitude, normalizeDeg } from '@/lib/ephem/astronomical';

function assess(
  rule: MuhurtaRule,
  partial: Omit<RuleAssessment, 'ruleId' | 'ruleName' | 'category' | 'source'>,
): RuleAssessment {
  return {
    ruleId: rule.id,
    ruleName: rule.name,
    category: rule.category,
    source: rule.source,
    ...partial,
  };
}

// Tithis where the LAST 2 ghatis are inauspicious (end of tithi)
const GANDANTHARA_END_TITHIS = [5, 10, 15, 20, 25, 30];
// Tithis where the FIRST 2 ghatis are inauspicious (start of tithi)
const GANDANTHARA_START_TITHIS = [6, 11, 16, 21, 26, 1];

// 2 ghatis / 60 ghatis per tithi × 12° per tithi = 0.4°
const GANDANTHARA_THRESHOLD_DEG = 0.4;

const gandanthara: MuhurtaRule = {
  id: 'tithi-gandanthara',
  name: { en: 'Tithi Gandanthara', hi: 'तिथि गण्डान्तर', sa: 'तिथिगण्डान्तरम्' },
  category: 'panchanga',
  scope: 'window',
  effect: 'penalty',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.6',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    // Compute Moon-Sun elongation at window midpoint
    // Tithi is ayanamsha-independent — use tropical longitudes
    const sunLon = sunLongitude(ctx.midpointJD);
    const moonLon = moonLongitude(ctx.midpointJD);
    const elongation = normalizeDeg(moonLon - sunLon); // 0-360°

    // Position within current tithi (0-12°)
    const posInTithi = elongation % 12;

    // Current tithi number (1-30)
    const currentTithi = Math.floor(elongation / 12) + 1;

    const isEndGandanthara =
      GANDANTHARA_END_TITHIS.includes(currentTithi) &&
      posInTithi > (12 - GANDANTHARA_THRESHOLD_DEG); // last 0.4°

    const isStartGandanthara =
      GANDANTHARA_START_TITHIS.includes(currentTithi) &&
      posInTithi < GANDANTHARA_THRESHOLD_DEG; // first 0.4°

    if (!isEndGandanthara && !isStartGandanthara) return null;

    return assess(this, {
      tier: 3,
      points: -4,
      maxPoints: 0,
      severity: 'moderate',
      reason: {
        en: 'Tithi Gandanthara — unstable tithi junction period',
        hi: 'तिथि गण्डान्तर — अस्थिर तिथि सन्धि काल',
        sa: 'तिथिगण्डान्तरम् — अस्थिरतिथिसन्धिकालः',
      },
    });
  },
};

export const GANDANTHARA_RULES: MuhurtaRule[] = [gandanthara];
