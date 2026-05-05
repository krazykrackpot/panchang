/**
 * Special Yoga Rules — 3 rules for rare auspicious combinations
 *
 * 1. amrita-siddhi-yoga — weekday + nakshatra combo (Muhurta Chintamani)
 * 2. sarvartha-siddhi-yoga — weekday + nakshatra combo (MC Ch.8)
 * 3. godhuli-lagna — sunset ± 24 min window (Brihat Samhita Ch.103)
 */

import type { MuhurtaRule, RuleAssessment, RuleContext } from '../types';

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

// Amrita Siddhi Yoga: [weekday (0=Sun), nakshatra (1-based)]
// Sun+Pushya, Mon+Hasta, Tue+Ashwini, Wed+Anuradha, Thu+Pushya, Fri+Revati, Sat+Rohini
const AMRITA_SIDDHI_TABLE: [number, number][] = [
  [0, 8],  // Sunday + Pushya
  [1, 13], // Monday + Hasta
  [2, 1],  // Tuesday + Ashwini
  [3, 17], // Wednesday + Anuradha
  [4, 8],  // Thursday + Pushya
  [5, 27], // Friday + Revati
  [6, 4],  // Saturday + Rohini
];

// Sarvartha Siddhi Yoga: [weekday (0=Sun), nakshatra (1-based)]
const SARVARTHA_SIDDHI_TABLE: [number, number][] = [
  [0, 8],  // Sunday + Pushya
  [1, 22], // Monday + Shravana
  [2, 3],  // Tuesday + Krittika
  [3, 17], // Wednesday + Anuradha
  [4, 13], // Thursday + Hasta
  [5, 27], // Friday + Revati
  [6, 22], // Saturday + Shravana
];

// ---------------------------------------------------------------------------
// 1. amrita-siddhi-yoga
// ---------------------------------------------------------------------------
const amritaSiddhiYoga: MuhurtaRule = {
  id: 'amrita-siddhi-yoga',
  name: { en: 'Amrita Siddhi Yoga', hi: 'अमृत सिद्धि योग', sa: 'अमृतसिद्धियोगः' },
  category: 'yoga-special',
  scope: 'day',
  effect: 'bonus',
  tier: 2,
  appliesTo: 'all',
  source: 'Muhurta Chintamani',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const match = AMRITA_SIDDHI_TABLE.find(
      ([wd, nk]) => wd === ctx.snap.weekday && nk === ctx.snap.nakshatra,
    );
    if (!match) return null;

    return assess(ctx, this, {
      tier: 2,
      points: 5,
      maxPoints: 5,
      severity: 'positive',
      reason: {
        en: 'Amrita Siddhi Yoga — weekday-nakshatra combination bestows success',
        hi: 'अमृत सिद्धि योग — वार-नक्षत्र संयोग सिद्धिदायक',
        sa: 'अमृतसिद्धियोगः — वारनक्षत्रसंयोगः सिद्धिप्रदः',
      },
      cancels: ['dur-muhurtam', 'gulika-kaal'],
    });
  },
};

// ---------------------------------------------------------------------------
// 2. sarvartha-siddhi-yoga
// ---------------------------------------------------------------------------
const sarvarthaSiddhiYoga: MuhurtaRule = {
  id: 'sarvartha-siddhi-yoga',
  name: { en: 'Sarvartha Siddhi Yoga', hi: 'सर्वार्थ सिद्धि योग', sa: 'सर्वार्थसिद्धियोगः' },
  category: 'yoga-special',
  scope: 'day',
  effect: 'bonus',
  tier: 2,
  appliesTo: 'all',
  source: 'Muhurta Chintamani Ch.8',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const match = SARVARTHA_SIDDHI_TABLE.find(
      ([wd, nk]) => wd === ctx.snap.weekday && nk === ctx.snap.nakshatra,
    );
    if (!match) return null;

    return assess(ctx, this, {
      tier: 2,
      points: 5,
      maxPoints: 5,
      severity: 'positive',
      reason: {
        en: 'Sarvartha Siddhi Yoga — all endeavours succeed on this combination',
        hi: 'सर्वार्थ सिद्धि योग — सभी कार्य सफल होते हैं',
        sa: 'सर्वार्थसिद्धियोगः — सर्वकार्याणि सिद्ध्यन्ति',
      },
      cancels: ['dur-muhurtam', 'gulika-kaal'],
    });
  },
};

// ---------------------------------------------------------------------------
// 3. godhuli-lagna (Brihat Samhita Ch.103)
// Active when scoring window overlaps sunset ± 24 minutes (0.4 hours).
// "The character of the nakshatra need not be considered" — overrides
// everything except Tier 0 vetoes.
// ---------------------------------------------------------------------------
const godhuliLagna: MuhurtaRule = {
  id: 'godhuli-lagna',
  name: { en: 'Godhuli Lagna', hi: 'गोधूलि लग्न', sa: 'गोधूलिलग्नम्' },
  category: 'yoga-special',
  scope: 'window',
  effect: 'bonus',
  tier: 1,
  appliesTo: ['marriage', 'engagement'],
  source: 'Brihat Samhita Ch.103',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const sunsetUT = ctx.sunsetUT;
    // 0.4 hours = 24 minutes on each side of sunset
    const windowOverlaps =
      ctx.windowStartUT < sunsetUT + 0.4 && ctx.windowEndUT > sunsetUT - 0.4;

    if (!windowOverlaps) return null;

    return assess(ctx, this, {
      tier: 1,
      points: 15,
      maxPoints: 15,
      severity: 'positive',
      reason: {
        en: 'Godhuli Lagna — sacred cow-dust hour at sunset, supremely auspicious for marriage',
        hi: 'गोधूलि लग्न — सूर्यास्त का पवित्र गोधूलि काल, विवाह हेतु अत्यंत शुभ',
        sa: 'गोधूलिलग्नम् — सूर्यास्तसमये गोधूलिः, विवाहार्थं परमशुभम्',
      },
      cancels: [
        'tithi-quality',
        'yoga-quality',
        'karana-quality',
        'vara-quality',
        'panchaka',
        'rahu-kaal',
        'yamaganda',
        'gulika-kaal',
        'dur-muhurtam',
        'varjyam',
        'krishna-paksha-adjustment',
      ],
    });
  },
};

export const SPECIAL_YOGA_RULES: MuhurtaRule[] = [
  amritaSiddhiYoga,
  sarvarthaSiddhiYoga,
  godhuliLagna,
];
