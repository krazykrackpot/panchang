/**
 * Personal Rules — 3 rules that require the querent's birth data
 *
 * 1. tara-bala — birth nakshatra to muhurta nakshatra compatibility
 * 2. chandra-bala — Moon sign transit compatibility
 * 3. dasha-harmony — current dasha lord alignment with activity
 *
 * All return null when the required birth data is not provided,
 * so the engine gracefully degrades to non-personal scoring.
 */

import type { MuhurtaRule, RuleAssessment, RuleContext } from '../types';
import { scoreDashaHarmony } from '@/lib/muhurta/dasha-harmony';

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

// Inauspicious Tara numbers: 3 (Vipat), 5 (Pratyari), 7 (Vadha)
const INAUSPICIOUS_TARAS = new Set([3, 5, 7]);

// Chandra Bala: Moon transit houses considered favourable from birth rashi
const GOOD_MOON_POSITIONS = new Set([1, 3, 6, 7, 10, 11]);

// ---------------------------------------------------------------------------
// 1. tara-bala
// Count from birth nakshatra to muhurta nakshatra, derive Tara (1-9 cycle).
// Inauspicious taras: 3 (Vipat), 5 (Pratyari), 7 (Vadha).
// ---------------------------------------------------------------------------
const taraBala: MuhurtaRule = {
  id: 'tara-bala',
  name: { en: 'Tara Bala', hi: 'तारा बल', sa: 'ताराबलम्' },
  category: 'personal',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'Muhurta Chintamani',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (ctx.birthNakshatra === undefined) return null;

    const count = ((ctx.snap.nakshatra - ctx.birthNakshatra + 27) % 27) + 1;
    const tara = ((count - 1) % 9) + 1;
    const isInauspicious = INAUSPICIOUS_TARAS.has(tara);

    if (isInauspicious) {
      return assess(ctx, this, {
        tier: 3,
        points: 0,
        maxPoints: 8,
        severity: 'moderate',
        reason: {
          en: `Tara ${tara} (${tara === 3 ? 'Vipat' : tara === 5 ? 'Pratyari' : 'Vadha'}) — inauspicious`,
          hi: `तारा ${tara} (${tara === 3 ? 'विपत' : tara === 5 ? 'प्रत्यरि' : 'वध'}) — अशुभ`,
          sa: `तारा ${tara} (${tara === 3 ? 'विपत्' : tara === 5 ? 'प्रत्यरिः' : 'वधः'}) — अशुभम्`,
        },
      });
    }

    return assess(ctx, this, {
      tier: 3,
      points: 8,
      maxPoints: 8,
      severity: 'positive',
      reason: {
        en: `Tara ${tara} — auspicious star compatibility`,
        hi: `तारा ${tara} — शुभ नक्षत्र अनुकूलता`,
        sa: `तारा ${tara} — शुभनक्षत्रानुकूल्यम्`,
      },
    });
  },
};

// ---------------------------------------------------------------------------
// 2. chandra-bala
// Moon's transit sign relative to birth rashi. Good: 1,3,6,7,10,11.
// ---------------------------------------------------------------------------
const chandraBala: MuhurtaRule = {
  id: 'chandra-bala',
  name: { en: 'Chandra Bala', hi: 'चन्द्र बल', sa: 'चन्द्रबलम्' },
  category: 'personal',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'Muhurta Chintamani',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (ctx.birthRashi === undefined) return null;

    const position = ((ctx.snap.moonSign - ctx.birthRashi + 12) % 12) + 1;
    const isGood = GOOD_MOON_POSITIONS.has(position);

    if (isGood) {
      return assess(ctx, this, {
        tier: 3,
        points: 8,
        maxPoints: 8,
        severity: 'positive',
        reason: {
          en: `Moon in ${ordinal(position)} from birth sign — favourable Chandra Bala`,
          hi: `जन्म राशि से ${position}वें स्थान में चन्द्र — शुभ चन्द्र बल`,
          sa: `जन्मराशेः ${position}स्थाने चन्द्रः — शुभचन्द्रबलम्`,
        },
      });
    }

    return assess(ctx, this, {
      tier: 3,
      points: 0,
      maxPoints: 8,
      severity: 'moderate',
      reason: {
        en: `Moon in ${ordinal(position)} from birth sign — weak Chandra Bala`,
        hi: `जन्म राशि से ${position}वें स्थान में चन्द्र — दुर्बल चन्द्र बल`,
        sa: `जन्मराशेः ${position}स्थाने चन्द्रः — दुर्बलचन्द्रबलम्`,
      },
    });
  },
};

// ---------------------------------------------------------------------------
// 3. dasha-harmony
// Uses scoreDashaHarmony() to rate current dasha lord alignment with activity.
// ---------------------------------------------------------------------------
const dashaHarmony: MuhurtaRule = {
  id: 'dasha-harmony',
  name: { en: 'Dasha Harmony', hi: 'दशा सामंजस्य', sa: 'दशासामञ्जस्यम्' },
  category: 'personal',
  scope: 'day',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'Classical Dasha principles',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (!ctx.dashaLords) return null;

    const result = scoreDashaHarmony(ctx.dashaLords, ctx.activityRules);
    const points = Math.min(result.score, 8); // Cap at 8 for the engine

    return assess(ctx, this, {
      tier: 3,
      points,
      maxPoints: 8,
      severity: result.favorable ? 'positive' : 'moderate',
      reason: {
        en: result.label,
        hi: result.favorable ? 'दशा नाथ अनुकूल' : 'दशा नाथ प्रतिकूल',
        sa: result.favorable ? 'दशानाथः अनुकूलः' : 'दशानाथः प्रतिकूलः',
      },
    });
  },
};

/** Simple English ordinal helper */
function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const PERSONAL_RULES: MuhurtaRule[] = [taraBala, chandraBala, dashaHarmony];
