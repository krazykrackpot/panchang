/**
 * Panchanga Rules — 6 rules extracted from scorePanchangFactors()
 *
 * Each rule is a self-contained MuhurtaRule that evaluates one panchanga
 * element (tithi, nakshatra, yoga, karana, vara, panchaka) and returns
 * a RuleAssessment with points, tier, and cancellation metadata.
 *
 * Sources: Muhurta Chintamani (MC) Ch.6-7, Jyotirnibandha
 */

import type { MuhurtaRule, RuleAssessment, RuleContext } from '../types';

// 9 inauspicious yogas per MC Ch.6 (Vivah Prakarana)
const INAUSPICIOUS_YOGAS = new Set([1, 6, 9, 10, 13, 15, 17, 19, 27]);

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

// ---------------------------------------------------------------------------
// 1. tithi-quality
// ---------------------------------------------------------------------------
const tithiQuality: MuhurtaRule = {
  id: 'tithi-quality',
  name: { en: 'Tithi Quality', hi: 'तिथि गुणवत्ता', sa: 'तिथिगुणः' },
  category: 'panchanga',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.6',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const pakshaRelTithi = ctx.snap.tithi > 15 ? ctx.snap.tithi - 15 : ctx.snap.tithi;
    const isKrishna = ctx.snap.tithi > 15;
    const isGood = ctx.activityRules.goodTithis.includes(pakshaRelTithi);
    const isAvoid = ctx.activityRules.avoidTithis.includes(pakshaRelTithi);

    let points = 0;
    let reason: RuleAssessment['reason'];
    let severity: RuleAssessment['severity'] = 'minor';

    if (isGood && !isKrishna) {
      points = 8;
      severity = 'positive';
      reason = { en: 'Auspicious Tithi (Shukla)', hi: 'शुभ तिथि (शुक्ल)', sa: 'शुभतिथिः (शुक्ले)' };
    } else if (isGood && isKrishna) {
      points = 1;
      severity = 'minor';
      reason = { en: 'Krishna Paksha \u2014 reduced auspiciousness', hi: 'कृष्ण पक्ष \u2014 न्यून शुभत्व', sa: 'कृष्णपक्षः \u2014 न्यूनशुभत्वम्' };
    } else if (isKrishna && !isGood) {
      points = -3;
      severity = 'moderate';
      reason = { en: 'Krishna Paksha with non-auspicious Tithi', hi: 'कृष्ण पक्ष अशुभ तिथि', sa: 'कृष्णपक्षे अशुभतिथिः' };
    } else {
      // Shukla non-good, non-avoid: neutral
      points = 0;
      reason = { en: 'Neutral Tithi', hi: 'सामान्य तिथि', sa: 'सामान्यतिथिः' };
    }

    // Avoid tithi penalty stacks (applies to both pakshas)
    if (isAvoid) {
      points -= 5;
      severity = 'major';
      reason = { en: 'Inauspicious Tithi', hi: 'अशुभ तिथि', sa: 'अशुभतिथिः' };
    }

    return assess(ctx, this, {
      tier: 3,
      points,
      maxPoints: 8,
      severity,
      reason,
      cancelledBy: ['lagna-quality'],
    });
  },
};

// ---------------------------------------------------------------------------
// 2. nakshatra-quality
// ---------------------------------------------------------------------------
const nakshatraQuality: MuhurtaRule = {
  id: 'nakshatra-quality',
  name: { en: 'Nakshatra Quality', hi: 'नक्षत्र गुणवत्ता', sa: 'नक्षत्रगुणः' },
  category: 'panchanga',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.6',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const nak = ctx.snap.nakshatra;
    const hardAvoid = ctx.activityRules.hardAvoidNakshatras ?? [];

    // Hard avoid = absolute veto (Tier 0)
    if (hardAvoid.includes(nak)) {
      return assess(ctx, this, {
        tier: 0,
        points: -10,
        maxPoints: 8,
        vetoed: true,
        severity: 'critical',
        reason: { en: 'Forbidden Nakshatra \u2014 hard veto', hi: 'वर्जित नक्षत्र \u2014 कठोर वर्ज्य', sa: 'वर्जितनक्षत्रम् \u2014 दृढवर्ज्यम्' },
      });
    }

    if (ctx.activityRules.goodNakshatras.includes(nak)) {
      return assess(ctx, this, {
        tier: 3,
        points: 8,
        maxPoints: 8,
        severity: 'positive',
        reason: { en: 'Auspicious Nakshatra', hi: 'शुभ नक्षत्र', sa: 'शुभनक्षत्रम्' },
      });
    }

    if (ctx.activityRules.avoidNakshatras.includes(nak)) {
      return assess(ctx, this, {
        tier: 3,
        points: -5,
        maxPoints: 8,
        severity: 'major',
        reason: { en: 'Inauspicious Nakshatra', hi: 'अशुभ नक्षत्र', sa: 'अशुभनक्षत्रम्' },
        cancelledBy: ['lagna-quality'],
      });
    }

    // Neutral nakshatra
    return assess(ctx, this, {
      tier: 3,
      points: 0,
      maxPoints: 8,
      severity: 'minor',
      reason: { en: 'Neutral Nakshatra', hi: 'सामान्य नक्षत्र', sa: 'सामान्यनक्षत्रम्' },
    });
  },
};

// ---------------------------------------------------------------------------
// 3. yoga-quality
// ---------------------------------------------------------------------------
const yogaQuality: MuhurtaRule = {
  id: 'yoga-quality',
  name: { en: 'Yoga Quality', hi: 'योग गुणवत्ता', sa: 'योगगुणः' },
  category: 'panchanga',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.6',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (INAUSPICIOUS_YOGAS.has(ctx.snap.yoga)) {
      return assess(ctx, this, {
        tier: 3,
        points: -3,
        maxPoints: 4,
        severity: 'moderate',
        reason: { en: 'Inauspicious Yoga', hi: 'अशुभ योग', sa: 'अशुभयोगः' },
        cancelledBy: ['lagna-quality'],
      });
    }

    return assess(ctx, this, {
      tier: 3,
      points: 4,
      maxPoints: 4,
      severity: 'positive',
      reason: { en: 'Auspicious Yoga', hi: 'शुभ योग', sa: 'शुभयोगः' },
    });
  },
};

// ---------------------------------------------------------------------------
// 4. karana-quality
// ---------------------------------------------------------------------------
const karanaQuality: MuhurtaRule = {
  id: 'karana-quality',
  name: { en: 'Karana Quality', hi: 'करण गुणवत्ता', sa: 'करणगुणः' },
  category: 'panchanga',
  scope: 'window',
  effect: 'bonus',
  tier: 4,
  appliesTo: 'all',
  source: 'MC Ch.7',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const k = ctx.snap.karana;

    if (k === 7) {
      // Vishti (Bhadra) — most inauspicious, but cancellable by strong lagna
      return assess(ctx, this, {
        tier: 4,
        points: -5,
        maxPoints: 2,
        severity: 'major',
        reason: { en: 'Vishti (Bhadra) Karana \u2014 inauspicious', hi: 'विष्टि (भद्रा) करण \u2014 अशुभ', sa: 'विष्टिकरणम् \u2014 अशुभम्' },
        cancelledBy: ['lagna-quality'],
      });
    }

    if (k >= 8 && k <= 10) {
      // Sthira karanas: Shakuni(8), Chatushpada(9), Naga(10)
      return assess(ctx, this, {
        tier: 4,
        points: -3,
        maxPoints: 2,
        severity: 'moderate',
        reason: { en: 'Sthira Karana \u2014 inauspicious', hi: 'स्थिर करण \u2014 अशुभ', sa: 'स्थिरकरणम् \u2014 अशुभम्' },
        cancelledBy: ['lagna-quality'],
      });
    }

    if (k === 11) {
      // Kimstughna — auspicious sthira karana
      return assess(ctx, this, {
        tier: 4,
        points: 2,
        maxPoints: 2,
        severity: 'positive',
        reason: { en: 'Kimstughna Karana \u2014 auspicious', hi: 'किंस्तुघ्न करण \u2014 शुभ', sa: 'किंस्तुघ्नकरणम् \u2014 शुभम्' },
      });
    }

    if (k >= 1 && k <= 6) {
      // Chara karanas — generally favourable
      return assess(ctx, this, {
        tier: 4,
        points: 2,
        maxPoints: 2,
        severity: 'positive',
        reason: { en: 'Chara Karana \u2014 favourable', hi: 'चर करण \u2014 अनुकूल', sa: 'चरकरणम् \u2014 अनुकूलम्' },
      });
    }

    // Unknown karana — neutral
    return assess(ctx, this, {
      tier: 4,
      points: 0,
      maxPoints: 2,
      severity: 'minor',
      reason: { en: 'Neutral Karana', hi: 'सामान्य करण', sa: 'सामान्यकरणम्' },
    });
  },
};

// ---------------------------------------------------------------------------
// 5. vara-quality
// ---------------------------------------------------------------------------
const varaQuality: MuhurtaRule = {
  id: 'vara-quality',
  name: { en: 'Vara (Weekday) Quality', hi: 'वार गुणवत्ता', sa: 'वारगुणः' },
  category: 'panchanga',
  scope: 'window',
  effect: 'bonus',
  tier: 4,
  appliesTo: 'all',
  source: 'MC Ch.6',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const wd = ctx.snap.weekday; // 0=Sunday, 1=Mon, ..., 6=Sat

    if (ctx.activityRules.goodWeekdays.includes(wd)) {
      return assess(ctx, this, {
        tier: 4,
        points: 3,
        maxPoints: 3,
        severity: 'positive',
        reason: { en: 'Favourable weekday', hi: 'अनुकूल वार', sa: 'अनुकूलवारः' },
      });
    }

    if (wd === 2) {
      // Tuesday — Mars day, most strongly avoided
      return assess(ctx, this, {
        tier: 4,
        points: -4,
        maxPoints: 3,
        severity: 'moderate',
        reason: { en: 'Tuesday \u2014 generally avoided', hi: 'मंगलवार \u2014 सामान्यतः वर्ज्य', sa: 'मङ्गलवारः \u2014 सामान्यतः वर्ज्यः' },
        cancelledBy: ['lagna-quality'],
      });
    }

    if (wd === 6) {
      // Saturday — Saturn's day
      return assess(ctx, this, {
        tier: 4,
        points: -3,
        maxPoints: 3,
        severity: 'moderate',
        reason: { en: 'Saturday \u2014 less auspicious', hi: 'शनिवार \u2014 अल्प शुभ', sa: 'शनिवारः \u2014 अल्पशुभः' },
        cancelledBy: ['lagna-quality'],
      });
    }

    if (wd === 0) {
      // Sunday — mild penalty
      return assess(ctx, this, {
        tier: 4,
        points: -1,
        maxPoints: 3,
        severity: 'minor',
        reason: { en: 'Sunday \u2014 neutral', hi: 'रविवार \u2014 सामान्य', sa: 'रविवारः \u2014 सामान्यः' },
        cancelledBy: ['lagna-quality'],
      });
    }

    // Other weekday not in good list — neutral
    return assess(ctx, this, {
      tier: 4,
      points: 0,
      maxPoints: 3,
      severity: 'minor',
      reason: { en: 'Neutral weekday', hi: 'सामान्य वार', sa: 'सामान्यवारः' },
    });
  },
};

// ---------------------------------------------------------------------------
// 6. panchaka
// ---------------------------------------------------------------------------
const panchaka: MuhurtaRule = {
  id: 'panchaka',
  name: { en: 'Panchaka', hi: 'पंचक', sa: 'पञ्चकम्' },
  category: 'panchanga',
  scope: 'window',
  effect: 'penalty',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.6',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const nak = ctx.snap.nakshatra;

    // Panchaka is only active when Moon is in nakshatras 23-27
    // (Dhanishtha, Shatabhisha, P.Bhadrapada, U.Bhadrapada, Revati)
    if (nak < 23 || nak > 27) {
      return null;
    }

    return assess(ctx, this, {
      tier: 3,
      points: -5,
      maxPoints: 0,
      severity: 'major',
      reason: {
        en: 'Panchaka active \u2014 Moon in inauspicious nakshatra zone',
        hi: 'पंचक सक्रिय \u2014 चन्द्र अशुभ नक्षत्र क्षेत्र में',
        sa: 'पञ्चकं प्रवर्तते \u2014 चन्द्रः अशुभनक्षत्रक्षेत्रे',
      },
      cancelledBy: ['pushkar-navamsha'],
    });
  },
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const PANCHANGA_RULES: MuhurtaRule[] = [
  tithiQuality,
  nakshatraQuality,
  yogaQuality,
  karanaQuality,
  varaQuality,
  panchaka,
];
