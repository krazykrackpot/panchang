/**
 * Lagna Rules — ascendant-based scoring for muhurta selection
 *
 * 3 rules:
 *   1. lagna-quality — scores the sidereal lagna sign (Tier 2 when strong, cancels defects)
 *   2. navamsha-shuddhi — D9 lagna quality (Tier 3)
 *   3. krishna-paksha-adjustment — conditional penalty for waning Moon dates
 *
 * Sources: Muhurta Chintamani (MC) Ch.6-7, Dharmasindhu
 */

import type { MuhurtaRule, RuleAssessment, RuleContext } from '../types';
import { toSidereal, getRashiNumber } from '@/lib/ephem/astronomical';

// ─── Lagna Scoring Tables ──────────────────────────────────────────────────
// Vivah lagna suitability: rashi index 1-12 → score
// Matches VIVAH_LAGNA_SCORE in classical-checks.ts
const VIVAH_LAGNA_SCORE: Record<number, number> = {
  1: -2,  // Mesha (Aries) — Mars-ruled, aggressive for marriage
  2: 6,   // Vrishabha (Taurus) — Venus-ruled, excellent
  3: 8,   // Mithuna (Gemini) — MC top pick
  4: 5,   // Karka (Cancer) — Moon-ruled, emotional, good
  5: 2,   // Simha (Leo) — Sun-ruled, neutral
  6: 8,   // Kanya (Virgo) — MC top pick
  7: 8,   // Tula (Libra) — MC top pick, Venus-ruled
  8: -3,  // Vrischika (Scorpio) — Mars-ruled, 8th natural sign
  9: 5,   // Dhanu (Sagittarius) — Jupiter-ruled, good
  10: 1,  // Makara (Capricorn) — Saturn-ruled, neutral
  11: 1,  // Kumbha (Aquarius) — Saturn-ruled, neutral
  12: 5,  // Meena (Pisces) — Jupiter-ruled, good
};

// Generic lagna scores for non-marriage activities
// Matches GENERIC_LAGNA_SCORE in classical-checks.ts
const GENERIC_LAGNA_SCORE: Record<number, number> = {
  1: 3, 2: 5, 3: 5, 4: 4, 5: 3, 6: 5,
  7: 5, 8: 0, 9: 5, 10: 3, 11: 3, 12: 4,
};

const RASHI_NAMES_EN: Record<number, string> = {
  1: 'Mesha', 2: 'Vrishabha', 3: 'Mithuna', 4: 'Karka',
  5: 'Simha', 6: 'Kanya', 7: 'Tula', 8: 'Vrischika',
  9: 'Dhanu', 10: 'Makara', 11: 'Kumbha', 12: 'Meena',
};

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

// ---------------------------------------------------------------------------
// 1. lagna-quality
// MC Ch.7: "Even where other favourable conditions are not present,
// a properly chosen lagna will remove the defects."
// When score >= 6, Tier 2 with cancellation power over Tier 4 defects.
// ---------------------------------------------------------------------------
const lagnaQuality: MuhurtaRule = {
  id: 'lagna-quality',
  name: { en: 'Lagna Quality', hi: 'लग्न गुणवत्ता', sa: 'लग्नगुणः' },
  category: 'lagna',
  scope: 'window',
  effect: 'bonus',
  tier: 3, // dynamic — upgraded to Tier 2 when score >= 6
  appliesTo: 'all',
  source: 'MC Ch.7',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (ctx.lagnaSign == null) return null;

    const isVivah = ctx.activity === 'marriage' || ctx.activity === 'engagement';
    const scores = isVivah ? VIVAH_LAGNA_SCORE : GENERIC_LAGNA_SCORE;
    const score = scores[ctx.lagnaSign] ?? 0;
    const rashiName = RASHI_NAMES_EN[ctx.lagnaSign] ?? `Rashi ${ctx.lagnaSign}`;

    const isStrong = score >= 6;
    const tier = isStrong ? 2 : 3;

    let severity: RuleAssessment['severity'];
    if (score >= 6) severity = 'positive';
    else if (score >= 3) severity = 'minor';
    else if (score >= 0) severity = 'moderate';
    else severity = 'major';

    const result = assess(this, {
      tier,
      points: score,
      maxPoints: 8,
      severity,
      reason: {
        en: `${rashiName} Lagna — ${isStrong ? 'excellent, removes defects' : score >= 3 ? 'acceptable' : score >= 0 ? 'neutral' : 'unfavourable'}`,
        hi: `${rashiName} लग्न — ${isStrong ? 'उत्कृष्ट, दोष निवारक' : score >= 3 ? 'स्वीकार्य' : score >= 0 ? 'तटस्थ' : 'प्रतिकूल'}`,
        sa: `${rashiName} लग्नम् — ${isStrong ? 'उत्तमम्, दोषनिवारकम्' : score >= 3 ? 'स्वीकार्यम्' : score >= 0 ? 'मध्यमम्' : 'अशुभम्'}`,
      },
    });

    // MC Ch.7: strong lagna cancels Tier 4 defects
    if (isStrong) {
      result.cancels = ['karana-quality', 'yoga-quality', 'vara-quality', 'dur-muhurtam', 'gulika-kaal'];
    }

    return result;
  },
};

// ---------------------------------------------------------------------------
// 2. navamsha-shuddhi
// MC: Navamsha Shuddhi emphasised for Vivah — D9 lagna should be auspicious.
// Navamsha spans 3°20' (~13.3 minutes), finest-grained classical tool.
// ---------------------------------------------------------------------------
const navamshaShuddhi: MuhurtaRule = {
  id: 'navamsha-shuddhi',
  name: { en: 'Navamsha Shuddhi', hi: 'नवांश शुद्धि', sa: 'नवांशशुद्धिः' },
  category: 'lagna',
  scope: 'window',
  effect: 'bonus',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.7',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (ctx.navamshaSign == null) return null;

    const isVivah = ctx.activity === 'marriage' || ctx.activity === 'engagement';
    const scores = isVivah ? VIVAH_LAGNA_SCORE : GENERIC_LAGNA_SCORE;
    const rawScore = scores[ctx.navamshaSign] ?? 0;
    // Navamsha contribution is half weight of lagna (secondary factor)
    const score = Math.round(rawScore / 2);
    const rashiName = RASHI_NAMES_EN[ctx.navamshaSign] ?? `Rashi ${ctx.navamshaSign}`;

    let severity: RuleAssessment['severity'];
    if (score >= 3) severity = 'positive';
    else if (score >= 1) severity = 'minor';
    else if (score === 0) severity = 'moderate';
    else severity = 'major';

    return assess(this, {
      tier: 3,
      points: score,
      maxPoints: 4,
      severity,
      reason: {
        en: `Navamsha in ${rashiName} — ${score >= 3 ? 'auspicious D9' : score >= 1 ? 'acceptable D9' : score === 0 ? 'neutral D9' : 'weak D9'}`,
        hi: `नवांश ${rashiName} में — ${score >= 3 ? 'शुभ डी9' : score >= 1 ? 'स्वीकार्य डी9' : score === 0 ? 'तटस्थ डी9' : 'दुर्बल डी9'}`,
        sa: `नवांशः ${rashiName} — ${score >= 3 ? 'शुभनवांशः' : score >= 1 ? 'स्वीकार्यः' : score === 0 ? 'मध्यमः' : 'दुर्बलः'}`,
      },
    });
  },
};

// ---------------------------------------------------------------------------
// 3. krishna-paksha-adjustment
// Shukla Paksha universally preferred (waxing Moon = growth).
// Krishna Paksha permitted only with excellent nakshatra + strong lagna.
// ---------------------------------------------------------------------------
const krishnaPakshaAdjustment: MuhurtaRule = {
  id: 'krishna-paksha-adjustment',
  name: { en: 'Krishna Paksha Penalty', hi: 'कृष्ण पक्ष दंड', sa: 'कृष्णपक्षदण्डः' },
  category: 'lagna',
  scope: 'window',
  effect: 'penalty',
  tier: 3,
  appliesTo: 'all',
  source: 'MC Ch.6, Dharmasindhu',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const isKrishna = ctx.snap.tithi > 15;
    if (!isKrishna) return null; // Shukla Paksha — not applicable

    const hasGoodNakshatra = ctx.activityRules.goodNakshatras.includes(ctx.snap.nakshatra);
    const lagnaScore = ctx.lagnaSign != null
      ? (VIVAH_LAGNA_SCORE[ctx.lagnaSign] ?? 0)
      : 0;
    const hasStrongLagna = lagnaScore >= 5;

    let points: number;
    let severity: RuleAssessment['severity'];
    let reason: RuleAssessment['reason'];

    if (hasGoodNakshatra && hasStrongLagna) {
      points = -1;
      severity = 'minor';
      reason = {
        en: 'Krishna Paksha — mitigated by good nakshatra + strong lagna',
        hi: 'कृष्ण पक्ष — शुभ नक्षत्र + बलवान लग्न से शमित',
        sa: 'कृष्णपक्षः — शुभनक्षत्रबलवल्लग्नाभ्यां शमितः',
      };
    } else if (hasGoodNakshatra) {
      points = -3;
      severity = 'moderate';
      reason = {
        en: 'Krishna Paksha — good nakshatra but lagna is weak',
        hi: 'कृष्ण पक्ष — शुभ नक्षत्र किन्तु लग्न दुर्बल',
        sa: 'कृष्णपक्षः — शुभनक्षत्रं किन्तु लग्नं दुर्बलम्',
      };
    } else {
      points = -6;
      severity = 'major';
      reason = {
        en: 'Krishna Paksha — no supporting factors',
        hi: 'कृष्ण पक्ष — कोई सहायक कारक नहीं',
        sa: 'कृष्णपक्षः — सहायककारकाभावः',
      };
    }

    return assess(this, {
      tier: 3,
      points,
      maxPoints: 0,
      severity,
      reason,
    });
  },
};

// ---------------------------------------------------------------------------
// 4. planets-in-ascendant (Muhurta Chintamani Ch.7)
// "Venus, Mercury, or Jupiter in the ascendant completely destroy all adverse
// influences." — Tier 1 override, cancels all Tier 3/4 negatives.
// ---------------------------------------------------------------------------
const planetsInAscendant: MuhurtaRule = {
  id: 'planets-in-ascendant',
  name: { en: 'Benefics in Lagna', hi: 'लग्न में शुभ ग्रह', sa: 'लग्ने शुभग्रहाः' },
  category: 'lagna',
  scope: 'window',
  effect: 'bonus',
  tier: 1,
  appliesTo: 'all',
  source: 'MC Ch.7',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (ctx.lagnaSign == null || !ctx.planets || ctx.planets.length === 0) return null;

    // Venus (5), Mercury (3), Jupiter (4) — check if any is in lagna sign
    const beneficIds = [5, 3, 4];
    const beneficNames = { 3: 'Mercury', 4: 'Jupiter', 5: 'Venus' };
    const inLagna: number[] = [];

    for (const pid of beneficIds) {
      const planet = ctx.planets.find(p => p.id === pid);
      if (!planet) continue;
      const sidSign = getRashiNumber(toSidereal(planet.longitude, ctx.midpointJD));
      if (sidSign === ctx.lagnaSign) {
        inLagna.push(pid);
      }
    }

    if (inLagna.length === 0) return null;

    const names = inLagna.map(id => beneficNames[id as keyof typeof beneficNames]).join(', ');

    return assess(this, {
      tier: 1,
      points: 10,
      maxPoints: 10,
      severity: 'positive',
      reason: {
        en: `${names} in ascendant — destroys all adverse influences`,
        hi: `${names} लग्न में — सभी दोषों का नाश`,
        sa: `लग्ने ${names} — सर्वदोषनाशकः`,
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

// ---------------------------------------------------------------------------
// 5. eighth-house-vacancy (B.V. Raman — Marriage/Engagement only)
// "The 8th house must be unoccupied at the time of marriage."
// ---------------------------------------------------------------------------
const eighthHouseVacancy: MuhurtaRule = {
  id: 'eighth-house-vacancy',
  name: { en: '8th House Vacancy', hi: 'अष्टम भाव शून्यता', sa: 'अष्टमभावशून्यता' },
  category: 'lagna',
  scope: 'window',
  effect: 'bonus', // dynamic: bonus when vacant, penalty when occupied
  tier: 3,
  appliesTo: ['marriage', 'engagement'],
  source: 'B.V. Raman Muhurtha Ch.12',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (ctx.lagnaSign == null || !ctx.planets || ctx.planets.length === 0) return null;

    // 8th house = 7 signs from lagna (1-indexed, wrapped)
    const eighthSign = ((ctx.lagnaSign - 1 + 7) % 12) + 1;

    // Check if ANY planet (ids 0-8) occupies the 8th sign
    const occupants: number[] = [];
    for (const planet of ctx.planets) {
      if (planet.id < 0 || planet.id > 8) continue;
      const sidSign = getRashiNumber(toSidereal(planet.longitude, ctx.midpointJD));
      if (sidSign === eighthSign) {
        occupants.push(planet.id);
      }
    }

    if (occupants.length > 0) {
      return assess(this, {
        tier: 3,
        points: -3,
        maxPoints: 3,
        severity: 'moderate',
        reason: {
          en: `8th house occupied — ${occupants.length} planet(s) in house of longevity`,
          hi: `अष्टम भाव अशून्य — आयु भाव में ${occupants.length} ग्रह`,
          sa: `अष्टमभावे ग्रहाः — आयुर्भावे ${occupants.length} ग्रहाः`,
        },
      });
    }

    return assess(this, {
      tier: 3,
      points: 3,
      maxPoints: 3,
      severity: 'positive',
      reason: {
        en: '8th house vacant — auspicious for marital longevity',
        hi: 'अष्टम भाव शून्य — दाम्पत्य दीर्घायु हेतु शुभ',
        sa: 'अष्टमभावः शून्यः — दाम्पत्यदीर्घायुषे शुभम्',
      },
    });
  },
};

export const LAGNA_RULES: MuhurtaRule[] = [
  lagnaQuality,
  navamshaShuddhi,
  krishnaPakshaAdjustment,
  planetsInAscendant,
  eighthHouseVacancy,
];
