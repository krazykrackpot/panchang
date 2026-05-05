/**
 * Kaala (Timing) Rules — 7 window-level rules for muhurta scoring
 *
 * Evaluates hora, choghadiya, Rahu Kaal, Yamaganda, Gulika Kaal,
 * Dur Muhurtam, and Abhijit Muhurta timing at the window level.
 *
 * Sources: Muhurta Chintamani (MC), Dharma Sindhu, Kaala Prakashika
 */

import type { MuhurtaRule, RuleAssessment, RuleContext } from '../types';
import {
  computeRahuKaal,
  computeYamaganda,
  computeGulikaKaal,
  computeDurMuhurtam,
} from '@/lib/muhurta/inauspicious-periods';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function rangesOverlap(a1: number, a2: number, b1: number, b2: number): boolean {
  return a1 < b2 && b1 < a2;
}

// Chaldean order: Sun(0), Venus(5), Mercury(3), Moon(1), Saturn(6), Jupiter(4), Mars(2)
const CHALDEAN_ORDER = [0, 5, 3, 1, 6, 4, 2] as const;

// Starting Chaldean index per weekday (0=Sunday)
// Sunday starts with Sun(idx 0), Monday with Moon(idx 3), etc.
const HORA_DAY_START = [0, 3, 6, 2, 5, 1, 4] as const;

// Choghadiya types in order
const CHOGHADIYA_TYPES = ['udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh', 'rog'] as const;

// Day choghadiya start indices per weekday (0=Sunday)
const CHOGHADIYA_DAY_START = [0, 3, 6, 2, 5, 1, 4] as const;

const AUSPICIOUS_CHOGHADIYA = new Set(['amrit', 'shubh', 'labh']);

// ---------------------------------------------------------------------------
// 1. hora — Chaldean hora lord matching activity's good horas
// ---------------------------------------------------------------------------
const hora: MuhurtaRule = {
  id: 'hora',
  name: { en: 'Hora Lord', hi: 'होरा स्वामी', sa: 'होरास्वामी' },
  category: 'kaala',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.7',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const sunriseLocal = ctx.sunriseUT + ctx.tz;
    const sunsetLocal = ctx.sunsetUT + ctx.tz;
    const dayDuration = sunsetLocal - sunriseLocal;
    const nightDuration = 24 - dayDuration;

    // Midpoint of window in local hours
    const midpointLocal = (ctx.windowStartUT + ctx.windowEndUT) / 2 + ctx.tz;

    let horaIndex: number;

    if (midpointLocal >= sunriseLocal && midpointLocal < sunsetLocal) {
      // Day hora — each hora = dayDuration / 12
      const horaDuration = dayDuration / 12;
      const slotInDay = Math.floor((midpointLocal - sunriseLocal) / horaDuration);
      const startIdx = HORA_DAY_START[ctx.weekday];
      horaIndex = (startIdx + Math.min(slotInDay, 11)) % 7;
    } else {
      // Night hora — each hora = nightDuration / 12
      const horaDuration = nightDuration / 12;
      // Night starts at sunset; 12 day horas already elapsed
      let hoursAfterSunset: number;
      if (midpointLocal >= sunsetLocal) {
        hoursAfterSunset = midpointLocal - sunsetLocal;
      } else {
        // Before sunrise (next day's early morning)
        hoursAfterSunset = (24 - sunsetLocal) + midpointLocal;
      }
      const slotInNight = Math.floor(hoursAfterSunset / horaDuration);
      const startIdx = HORA_DAY_START[ctx.weekday];
      // Night horas start after 12 day horas
      horaIndex = (startIdx + 12 + Math.min(slotInNight, 11)) % 7;
    }

    const horaLord = CHALDEAN_ORDER[horaIndex];
    const isGoodHora = ctx.activityRules.goodHoras.includes(horaLord);

    if (isGoodHora) {
      return assess(ctx, this, {
        tier: 3,
        points: 8,
        maxPoints: 8,
        severity: 'positive',
        reason: { en: 'Favourable hora lord for activity', hi: 'गतिविधि के लिए अनुकूल होरा स्वामी', sa: 'कर्मणे अनुकूलहोरास्वामी' },
      });
    }

    return assess(ctx, this, {
      tier: 3,
      points: 0,
      maxPoints: 8,
      severity: 'minor',
      reason: { en: 'Neutral hora lord', hi: 'सामान्य होरा स्वामी', sa: 'सामान्यहोरास्वामी' },
    });
  },
};

// ---------------------------------------------------------------------------
// 2. choghadiya — Amrit/Shubh/Labh choghadiya
// ---------------------------------------------------------------------------
const choghadiya: MuhurtaRule = {
  id: 'choghadiya',
  name: { en: 'Choghadiya', hi: 'चौघड़िया', sa: 'चतुर्घटिका' },
  category: 'kaala',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.7',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const midpointUT = (ctx.windowStartUT + ctx.windowEndUT) / 2;
    const isDaytime = midpointUT >= ctx.sunriseUT && midpointUT < ctx.sunsetUT;

    if (!isDaytime) {
      // Only evaluate daytime choghadiya for simplicity
      return null;
    }

    const daySlotDuration = (ctx.sunsetUT - ctx.sunriseUT) / 8;
    const slotIdx = Math.min(Math.floor((midpointUT - ctx.sunriseUT) / daySlotDuration), 7);
    const startIdx = CHOGHADIYA_DAY_START[ctx.weekday];
    const chogType = CHOGHADIYA_TYPES[(startIdx + slotIdx) % 7];

    if (AUSPICIOUS_CHOGHADIYA.has(chogType)) {
      return assess(ctx, this, {
        tier: 3,
        points: 6,
        maxPoints: 6,
        severity: 'positive',
        reason: {
          en: `Auspicious Choghadiya (${chogType})`,
          hi: `शुभ चौघड़िया (${chogType})`,
          sa: `शुभचतुर्घटिका (${chogType})`,
        },
      });
    }

    return assess(ctx, this, {
      tier: 3,
      points: 0,
      maxPoints: 6,
      severity: 'minor',
      reason: {
        en: `Choghadiya: ${chogType}`,
        hi: `चौघड़िया: ${chogType}`,
        sa: `चतुर्घटिका: ${chogType}`,
      },
    });
  },
};

// ---------------------------------------------------------------------------
// 3. rahu-kaal — Rahu Kaal overlap penalty
// ---------------------------------------------------------------------------
const rahuKaal: MuhurtaRule = {
  id: 'rahu-kaal',
  name: { en: 'Rahu Kaal', hi: 'राहु काल', sa: 'राहुकालः' },
  category: 'kaala',
  scope: 'window',
  effect: 'penalty',
  tier: 4,
  appliesTo: 'all',
  source: 'MC Ch.7',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const rk = computeRahuKaal(ctx.sunriseUT, ctx.sunsetUT, ctx.weekday);
    const overlaps = rangesOverlap(ctx.windowStartUT, ctx.windowEndUT, rk.start, rk.end);

    if (!overlaps) return null;

    return assess(ctx, this, {
      tier: 4,
      points: -4,
      maxPoints: 0,
      severity: 'major',
      reason: { en: 'Window overlaps Rahu Kaal', hi: 'राहु काल में', sa: 'राहुकाले' },
      cancelledBy: ['lagna-quality', 'amrita-siddhi-yoga'],
    });
  },
};

// ---------------------------------------------------------------------------
// 4. yamaganda — Yamaganda overlap penalty
// ---------------------------------------------------------------------------
const yamaganda: MuhurtaRule = {
  id: 'yamaganda',
  name: { en: 'Yamaganda', hi: 'यमगण्ड', sa: 'यमघण्टः' },
  category: 'kaala',
  scope: 'window',
  effect: 'penalty',
  tier: 4,
  appliesTo: 'all',
  source: 'MC Ch.7',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const yg = computeYamaganda(ctx.sunriseUT, ctx.sunsetUT, ctx.weekday);
    const overlaps = rangesOverlap(ctx.windowStartUT, ctx.windowEndUT, yg.start, yg.end);

    if (!overlaps) return null;

    return assess(ctx, this, {
      tier: 4,
      points: -3,
      maxPoints: 0,
      severity: 'moderate',
      reason: { en: 'Window overlaps Yamaganda', hi: 'यमगण्ड काल में', sa: 'यमघण्टकाले' },
      cancelledBy: ['lagna-quality', 'amrita-siddhi-yoga'],
    });
  },
};

// ---------------------------------------------------------------------------
// 5. gulika-kaal — Gulika Kaal overlap penalty
// ---------------------------------------------------------------------------
const gulikaKaal: MuhurtaRule = {
  id: 'gulika-kaal',
  name: { en: 'Gulika Kaal', hi: 'गुलिक काल', sa: 'गुलिककालः' },
  category: 'kaala',
  scope: 'window',
  effect: 'penalty',
  tier: 4,
  appliesTo: 'all',
  source: 'MC Ch.7',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const gk = computeGulikaKaal(ctx.sunriseUT, ctx.sunsetUT, ctx.weekday);
    const overlaps = rangesOverlap(ctx.windowStartUT, ctx.windowEndUT, gk.start, gk.end);

    if (!overlaps) return null;

    return assess(ctx, this, {
      tier: 4,
      points: -2,
      maxPoints: 0,
      severity: 'minor',
      reason: { en: 'Window overlaps Gulika Kaal', hi: 'गुलिक काल में', sa: 'गुलिककाले' },
      cancelledBy: ['lagna-quality', 'amrita-siddhi-yoga'],
    });
  },
};

// ---------------------------------------------------------------------------
// 6. dur-muhurtam — Inauspicious muhurta window
// ---------------------------------------------------------------------------
const durMuhurtam: MuhurtaRule = {
  id: 'dur-muhurtam',
  name: { en: 'Dur Muhurtam', hi: 'दुर्मुहूर्त', sa: 'दुर्मुहूर्तम्' },
  category: 'kaala',
  scope: 'window',
  effect: 'penalty',
  tier: 4,
  appliesTo: 'all',
  source: 'Kaala Prakashika',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const durWindows = computeDurMuhurtam(ctx.sunriseUT, ctx.sunsetUT, ctx.weekday);
    const overlaps = durWindows.some(dw =>
      rangesOverlap(ctx.windowStartUT, ctx.windowEndUT, dw.start, dw.end),
    );

    if (!overlaps) return null;

    return assess(ctx, this, {
      tier: 4,
      points: -3,
      maxPoints: 0,
      severity: 'moderate',
      reason: { en: 'Window falls in Dur Muhurtam', hi: 'दुर्मुहूर्त काल में', sa: 'दुर्मुहूर्तकाले' },
      cancelledBy: ['lagna-quality', 'amrita-siddhi-yoga'],
    });
  },
};

// ---------------------------------------------------------------------------
// 7. abhijit-muhurta — 8th daytime muhurta (bonus, NOT on Wednesdays)
// ---------------------------------------------------------------------------
const abhijitMuhurta: MuhurtaRule = {
  id: 'abhijit-muhurta',
  name: { en: 'Abhijit Muhurta', hi: 'अभिजित मुहूर्त', sa: 'अभिजिन्मुहूर्तम्' },
  category: 'kaala',
  scope: 'window',
  effect: 'bonus',
  tier: 2,
  appliesTo: 'all',
  source: 'MC Ch.7, Dharma Sindhu',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    // Abhijit is NOT auspicious on Wednesdays (weekday 3) — Dharma Sindhu
    if (ctx.weekday === 3) return null;

    const sunriseLocal = ctx.sunriseUT + ctx.tz;
    const sunsetLocal = ctx.sunsetUT + ctx.tz;
    const muhurtaDuration = (sunsetLocal - sunriseLocal) / 15;

    // 8th muhurta (0-indexed: index 7)
    const abhijitStart = sunriseLocal + 7 * muhurtaDuration;
    const abhijitEnd = abhijitStart + muhurtaDuration;

    // Check if window midpoint falls within Abhijit
    const midpointLocal = (ctx.windowStartUT + ctx.windowEndUT) / 2 + ctx.tz;

    if (midpointLocal >= abhijitStart && midpointLocal < abhijitEnd) {
      return assess(ctx, this, {
        tier: 2,
        points: 6,
        maxPoints: 6,
        severity: 'positive',
        reason: { en: 'Window in Abhijit Muhurta — universally auspicious', hi: 'अभिजित मुहूर्त — सर्वशुभ', sa: 'अभिजिन्मुहूर्तम् — सर्वशुभम्' },
      });
    }

    return null;
  },
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const KAALA_RULES: MuhurtaRule[] = [
  hora,
  choghadiya,
  rahuKaal,
  yamaganda,
  gulikaKaal,
  durMuhurtam,
  abhijitMuhurta,
];
