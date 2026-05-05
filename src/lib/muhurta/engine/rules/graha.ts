/**
 * Graha Rules — 2 rules for planetary transit and dignity factors
 *
 * 1. transit-strength — benefics in kendras/trikonas, no retrograde benefics
 * 2. pushkar-navamsha-bhaga — Moon in Pushkar Navamsha or Pushkar Bhaga
 *
 * Simplified version of scoreTransitFactors() in ai-recommender.ts,
 * refactored as self-contained MuhurtaRule objects.
 */

import type { MuhurtaRule, RuleAssessment, RuleContext } from '../types';
import {
  getPlanetaryPositions,
  toSidereal,
  getRashiNumber,
  sunLongitude,
} from '@/lib/ephem/astronomical';
import { PUSHKAR_BHAGA, PUSHKAR_NAVAMSHA_SET } from '@/lib/constants/pushkar-bhaga';

function assess(
  ctx: RuleContext,
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

const BENEFIC_IDS = [4, 5, 3]; // Jupiter, Venus, Mercury
const KENDRAS = [1, 4, 7, 10];
const TRIKONAS = [1, 5, 9];
const KENDRA_TRIKONA = new Set([...KENDRAS, ...TRIKONAS]); // 1, 4, 5, 7, 9, 10

// ---------------------------------------------------------------------------
// 1. transit-strength
// ---------------------------------------------------------------------------
const transitStrength: MuhurtaRule = {
  id: 'transit-strength',
  name: { en: 'Transit Strength', hi: 'गोचर बल', sa: 'गोचरबलम्' },
  category: 'graha',
  scope: 'day',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'Classical transit principles',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const jd = ctx.midpointJD;
    const planets = ctx.planets ?? getPlanetaryPositions(jd);

    // Reference sign: Sun's sidereal sign (used as lagna proxy for transits)
    const sunSid = toSidereal(sunLongitude(jd), jd);
    const sunSign = getRashiNumber(sunSid);

    let beneficScore = 0;
    for (const p of planets) {
      if (!BENEFIC_IDS.includes(p.id)) continue;
      const sidLong = toSidereal(p.longitude, jd);
      const sign = getRashiNumber(sidLong);
      const house = ((sign - sunSign + 12) % 12) + 1;
      if (KENDRA_TRIKONA.has(house)) {
        beneficScore += 3;
      }
    }
    // Cap benefic placement bonus at 9
    beneficScore = Math.min(beneficScore, 9);

    // No retrograde benefics bonus
    const retroBenefics = planets.filter(
      (p) => p.isRetrograde && BENEFIC_IDS.includes(p.id),
    );
    const retroBonus = retroBenefics.length === 0 ? 5 : 0;

    const total = beneficScore + retroBonus; // 0–14 (max 9+5)
    if (total === 0) return null;

    let severity: RuleAssessment['severity'] = 'minor';
    if (total >= 10) severity = 'positive';
    else if (total >= 5) severity = 'positive';

    const reason =
      retroBonus > 0
        ? {
            en: `Benefics in strong houses, no retrograde benefics (+${total})`,
            hi: `शुभ ग्रह बलवान भावों में, कोई वक्री शुभ ग्रह नहीं (+${total})`,
            sa: `शुभग्रहाः बलवत्स्थाने, शुभग्रहवक्रता नास्ति (+${total})`,
          }
        : {
            en: `Benefics in strong houses (+${total})`,
            hi: `शुभ ग्रह बलवान भावों में (+${total})`,
            sa: `शुभग्रहाः बलवत्स्थाने (+${total})`,
          };

    return assess(ctx, this, {
      tier: 3,
      points: total,
      maxPoints: 15,
      severity,
      reason,
    });
  },
};

// ---------------------------------------------------------------------------
// 2. pushkar-navamsha-bhaga
// Moon in Pushkar Navamsha (+8) or Pushkar Bhaga (+10, within 0.8°)
// Pushkar positions purify per Saravali — cancels Panchaka.
// ---------------------------------------------------------------------------
const pushkarNavamshaBhaga: MuhurtaRule = {
  id: 'pushkar-navamsha-bhaga',
  name: { en: 'Pushkar Navamsha / Bhaga', hi: 'पुष्कर नवांश / भाग', sa: 'पुष्करनवांशः / भागः' },
  category: 'graha',
  scope: 'window',
  effect: 'bonus',
  tier: 2,
  appliesTo: 'all',
  source: 'Saravali / Kalaprakashika',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const moonSid = ctx.snap.moonSid;
    const moonSign = getRashiNumber(moonSid); // 1-based
    const degInSign = moonSid % 30;

    // Check Pushkar Navamsha
    const navamshaIdx = Math.floor(degInSign / (30 / 9)); // 0-8
    const signIdx = moonSign - 1; // 0-based
    const isNavamsha = PUSHKAR_NAVAMSHA_SET.has(signIdx * 9 + navamshaIdx);

    // Check Pushkar Bhaga (within 0.8° orb)
    const pb = PUSHKAR_BHAGA[moonSign];
    const isBhaga = pb !== undefined && Math.abs(degInSign - pb) <= 0.8;

    if (isNavamsha && isBhaga) {
      // Bhaga subsumes Navamsha (don't stack to 18)
      return assess(ctx, this, {
        tier: 2,
        points: 10,
        maxPoints: 10,
        severity: 'positive',
        reason: {
          en: 'Moon in both Pushkar Navamsha and Bhaga — extraordinary auspiciousness',
          hi: 'चन्द्र पुष्कर नवांश एवं भाग दोनों में — असाधारण शुभत्व',
          sa: 'चन्द्रः पुष्करनवांशे भागे च — असाधारणशुभत्वम्',
        },
        cancels: ['panchaka'],
      });
    }

    if (isBhaga) {
      return assess(ctx, this, {
        tier: 2,
        points: 10,
        maxPoints: 10,
        severity: 'positive',
        reason: {
          en: 'Moon in Pushkar Bhaga — most auspicious degree',
          hi: 'चन्द्र पुष्कर भाग में — सर्वाधिक शुभ अंश',
          sa: 'चन्द्रः पुष्करभागे — परमशुभांशः',
        },
        cancels: ['panchaka'],
      });
    }

    if (isNavamsha) {
      return assess(ctx, this, {
        tier: 2,
        points: 8,
        maxPoints: 10,
        severity: 'positive',
        reason: {
          en: 'Moon in Pushkar Navamsha — supremely auspicious',
          hi: 'चन्द्र पुष्कर नवांश में — अत्यंत शुभ',
          sa: 'चन्द्रः पुष्करनवांशे — अत्यन्तशुभम्',
        },
        cancels: ['panchaka'],
      });
    }

    return null;
  },
};

export const GRAHA_RULES: MuhurtaRule[] = [transitStrength, pushkarNavamshaBhaga];
