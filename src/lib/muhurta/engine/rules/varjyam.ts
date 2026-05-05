/**
 * Varjyam Rule — "time of poison" from nakshatra-based ghati offsets
 *
 * Varjyam is a Tier 4 (cancellable) inauspicious period. A strong lagna
 * (Tier 2) can cancel it per MC Ch.7: "a properly chosen lagna removes
 * all defects."
 *
 * Source: Prashna Marga Ch.7
 */

import type { MuhurtaRule, RuleAssessment, RuleContext } from '../types';
import { isVarjyamActive } from '@/lib/muhurta/inauspicious-periods';

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

const varjyam: MuhurtaRule = {
  id: 'varjyam',
  name: { en: 'Varjyam', hi: 'वर्ज्यम्', sa: 'वर्ज्यम्' },
  category: 'kaala',
  scope: 'window',
  effect: 'penalty',
  tier: 4,
  appliesTo: 'all',
  source: 'Prashna Marga Ch.7',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (!isVarjyamActive(ctx.snap.moonSid)) return null;

    return assess(this, {
      tier: 4,
      points: -3,
      maxPoints: 0,
      severity: 'moderate',
      reason: {
        en: 'Varjyam active — inauspicious lunar window',
        hi: 'वर्ज्यम् सक्रिय — अशुभ चन्द्र काल',
        sa: 'वर्ज्यं प्रवर्तते — अशुभचन्द्रकालः',
      },
      cancelledBy: ['lagna-quality'],
    });
  },
};

export const VARJYAM_RULES: MuhurtaRule[] = [varjyam];
