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
// ---------------------------------------------------------------------------
// TARA BALA — Classical 9-fold star compatibility (HARDENED)
//
// Count from birth nakshatra to muhurta nakshatra, mod 9 → Tara (1-9):
//   1. Janma (birth)      — neutral-sensitive, +3 (not full bonus)
//   2. Sampat (wealth)     — auspicious, +8
//   3. Vipat (danger)      — INAUSPICIOUS, -5 (active penalty, not just 0)
//   4. Kshema (well-being) — auspicious, +8
//   5. Pratyari (obstacle) — INAUSPICIOUS, -5
//   6. Sadhana (achievement) — auspicious, +8
//   7. Vadha (death)       — INAUSPICIOUS, -5
//   8. Mitra (friend)      — auspicious, +8
//   9. Ati-Mitra (best friend) — most auspicious, +8
//
// Cycle degradation (classical refinement):
//   1st cycle (nakshatras 1-9 from birth): full points
//   2nd cycle (10-18): 75% of bonus (penalties unchanged)
//   3rd cycle (19-27): 50% of bonus (penalties unchanged)
//   Rationale: influence weakens with distance from birth star
// ---------------------------------------------------------------------------
const TARA_NAMES: Record<number, { en: string; hi: string; sa: string }> = {
  1: { en: 'Janma', hi: 'जन्म', sa: 'जन्म' },
  2: { en: 'Sampat', hi: 'सम्पत्', sa: 'सम्पत्' },
  3: { en: 'Vipat', hi: 'विपत्', sa: 'विपत्' },
  4: { en: 'Kshema', hi: 'क्षेम', sa: 'क्षेम' },
  5: { en: 'Pratyari', hi: 'प्रत्यरि', sa: 'प्रत्यरिः' },
  6: { en: 'Sadhana', hi: 'साधन', sa: 'साधनम्' },
  7: { en: 'Vadha', hi: 'वध', sa: 'वधः' },
  8: { en: 'Mitra', hi: 'मित्र', sa: 'मित्रम्' },
  9: { en: 'Ati-Mitra', hi: 'अतिमित्र', sa: 'अतिमित्रम्' },
};

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
    const cycle = Math.ceil(count / 9); // 1st, 2nd, or 3rd cycle
    const taraName = TARA_NAMES[tara] || { en: `Tara ${tara}`, hi: `तारा ${tara}`, sa: `तारा ${tara}` };

    // Cycle degradation multiplier (bonuses only — penalties stay full)
    const cycleMultiplier = cycle === 1 ? 1.0 : cycle === 2 ? 0.75 : 0.5;

    // Inauspicious taras: active penalty (not just missed bonus)
    if (INAUSPICIOUS_TARAS.has(tara)) {
      return assess(ctx, this, {
        tier: 3,
        points: -5, // Active penalty — makes bad tara visible in scoring
        maxPoints: 8,
        severity: 'major',
        reason: {
          en: `Tara ${tara} (${taraName.en}) — inauspicious${cycle > 1 ? ` (${ordinal(cycle)} cycle)` : ''}`,
          hi: `तारा ${tara} (${taraName.hi}) — अशुभ${cycle > 1 ? ` (${cycle}रा चक्र)` : ''}`,
          sa: `तारा ${tara} (${taraName.sa}) — अशुभम्`,
        },
      });
    }

    // Janma Tara (1st): classically neutral-to-sensitive — reduced bonus
    if (tara === 1) {
      const pts = Math.round(3 * cycleMultiplier);
      return assess(ctx, this, {
        tier: 3,
        points: pts,
        maxPoints: 8,
        severity: 'minor',
        reason: {
          en: `Tara 1 (${taraName.en}) — birth star, neutral${cycle > 1 ? ` (${ordinal(cycle)} cycle, ${pts}pts)` : ''}`,
          hi: `तारा 1 (${taraName.hi}) — जन्म नक्षत्र, सामान्य`,
          sa: `तारा 1 (${taraName.sa}) — जन्मनक्षत्रम्, सामान्यम्`,
        },
      });
    }

    // Auspicious taras: full bonus, degraded by cycle
    const pts = Math.round(8 * cycleMultiplier);
    return assess(ctx, this, {
      tier: 3,
      points: pts,
      maxPoints: 8,
      severity: 'positive',
      reason: {
        en: `Tara ${tara} (${taraName.en}) — auspicious${cycle > 1 ? ` (${ordinal(cycle)} cycle, ${pts}pts)` : ''}`,
        hi: `तारा ${tara} (${taraName.hi}) — शुभ${cycle > 1 ? ` (${cycle}रा चक्र)` : ''}`,
        sa: `तारा ${tara} (${taraName.sa}) — शुभम्`,
      },
    });
  },
};

// ---------------------------------------------------------------------------
// 2. chandra-bala
// Moon's transit sign relative to birth rashi. Good: 1,3,6,7,10,11.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// CHANDRA BALA — Moon transit strength (HARDENED)
//
// Classical rule (MC, Jyotirnibandha):
//   Moon's transit house from birth rashi determines Chandra Bala.
//   Good houses: 1 (Janma), 3 (Upachaya), 6 (Upachaya), 7 (Kendra),
//                10 (Kendra), 11 (Labha)
//   Bad houses:  2, 4, 5, 8, 9, 12
//   Worst: 8th (Ashtama Chandra — Moon in 8th from birth)
//
// HARDENED: bad positions now give ACTIVE PENALTY (-4 or -5),
// not just missed bonus (0). This makes bad Chandra Bala visible
// in the final score rather than silently disappearing.
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

    // 8th position (Ashtama Chandra) — worst placement, heaviest penalty
    if (position === 8) {
      return assess(ctx, this, {
        tier: 3,
        points: -5,
        maxPoints: 8,
        severity: 'major',
        reason: {
          en: `Ashtama Chandra — Moon in 8th from birth sign (worst position)`,
          hi: `अष्टम चन्द्र — जन्म राशि से 8वें स्थान में (सबसे कमजोर)`,
          sa: `अष्टमचन्द्रः — जन्मराशेः अष्टमस्थाने (अत्यन्तदुर्बलम्)`,
        },
      });
    }

    // Other bad positions (2, 4, 5, 9, 12) — moderate penalty
    return assess(ctx, this, {
      tier: 3,
      points: -4,
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
