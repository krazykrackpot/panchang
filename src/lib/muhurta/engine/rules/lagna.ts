/**
 * Lagna Rules  –  ascendant-based scoring for muhurta selection
 *
 * 3 rules:
 *   1. lagna-quality  –  scores the sidereal lagna sign (Tier 2 when strong, cancels defects)
 *   2. navamsha-shuddhi  –  D9 lagna quality (Tier 3)
 *   3. krishna-paksha-adjustment  –  conditional penalty for waning Moon dates
 *
 * Sources: Muhurta Chintamani (MC) Ch.6-7, Dharmasindhu
 */

import type { MuhurtaRule, RuleAssessment, RuleContext } from '../types';
import { toSidereal, getRashiNumber } from '@/lib/ephem/astronomical';

// ─── Lagna Scoring Tables ──────────────────────────────────────────────────
// Vivah lagna suitability: rashi index 1-12 → score
// Matches VIVAH_LAGNA_SCORE in classical-checks.ts
const VIVAH_LAGNA_SCORE: Record<number, number> = {
  1: -2,  // Mesha (Aries)  –  Mars-ruled, aggressive for marriage
  2: 6,   // Vrishabha (Taurus)  –  Venus-ruled, excellent
  3: 8,   // Mithuna (Gemini)  –  MC top pick
  4: 5,   // Karka (Cancer)  –  Moon-ruled, emotional, good
  5: 2,   // Simha (Leo)  –  Sun-ruled, neutral
  6: 8,   // Kanya (Virgo)  –  MC top pick
  7: 8,   // Tula (Libra)  –  MC top pick, Venus-ruled
  8: -3,  // Vrischika (Scorpio)  –  Mars-ruled, 8th natural sign
  9: 5,   // Dhanu (Sagittarius)  –  Jupiter-ruled, good
  10: 1,  // Makara (Capricorn)  –  Saturn-ruled, neutral
  11: 1,  // Kumbha (Aquarius)  –  Saturn-ruled, neutral
  12: 5,  // Meena (Pisces)  –  Jupiter-ruled, good
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
  tier: 3, // dynamic  –  upgraded to Tier 2 when score >= 6
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
        en: `${rashiName} Lagna  –  ${isStrong ? 'excellent, removes defects' : score >= 3 ? 'acceptable' : score >= 0 ? 'neutral' : 'unfavourable'}`,
        hi: `${rashiName} लग्न  –  ${isStrong ? 'उत्कृष्ट, दोष निवारक' : score >= 3 ? 'स्वीकार्य' : score >= 0 ? 'तटस्थ' : 'प्रतिकूल'}`,
        sa: `${rashiName} लग्नम्  –  ${isStrong ? 'उत्तमम्, दोषनिवारकम्' : score >= 3 ? 'स्वीकार्यम्' : score >= 0 ? 'मध्यमम्' : 'अशुभम्'}`,
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
// MC: Navamsha Shuddhi emphasised for Vivah  –  D9 lagna should be auspicious.
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
        en: `Navamsha in ${rashiName}  –  ${score >= 3 ? 'auspicious D9' : score >= 1 ? 'acceptable D9' : score === 0 ? 'neutral D9' : 'weak D9'}`,
        hi: `नवांश ${rashiName} में  –  ${score >= 3 ? 'शुभ डी9' : score >= 1 ? 'स्वीकार्य डी9' : score === 0 ? 'तटस्थ डी9' : 'दुर्बल डी9'}`,
        sa: `नवांशः ${rashiName}  –  ${score >= 3 ? 'शुभनवांशः' : score >= 1 ? 'स्वीकार्यः' : score === 0 ? 'मध्यमः' : 'दुर्बलः'}`,
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
    if (!isKrishna) return null; // Shukla Paksha  –  not applicable

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
        en: 'Krishna Paksha  –  mitigated by good nakshatra + strong lagna',
        hi: 'कृष्ण पक्ष  –  शुभ नक्षत्र + बलवान लग्न से शमित',
        sa: 'कृष्णपक्षः  –  शुभनक्षत्रबलवल्लग्नाभ्यां शमितः',
      };
    } else if (hasGoodNakshatra) {
      points = -3;
      severity = 'moderate';
      reason = {
        en: 'Krishna Paksha  –  good nakshatra but lagna is weak',
        hi: 'कृष्ण पक्ष  –  शुभ नक्षत्र किन्तु लग्न दुर्बल',
        sa: 'कृष्णपक्षः  –  शुभनक्षत्रं किन्तु लग्नं दुर्बलम्',
      };
    } else {
      points = -6;
      severity = 'major';
      reason = {
        en: 'Krishna Paksha  –  no supporting factors',
        hi: 'कृष्ण पक्ष  –  कोई सहायक कारक नहीं',
        sa: 'कृष्णपक्षः  –  सहायककारकाभावः',
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
// influences."  –  Tier 1 override, cancels all Tier 3/4 negatives.
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

    // Venus (5), Mercury (3), Jupiter (4)  –  check if any is in lagna sign
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
        en: `${names} in ascendant  –  destroys all adverse influences`,
        hi: `${names} लग्न में  –  सभी दोषों का नाश`,
        sa: `लग्ने ${names}  –  सर्वदोषनाशकः`,
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
// 5. eighth-house-vacancy (B.V. Raman  –  Marriage/Engagement only)
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
          en: `8th house occupied  –  ${occupants.length} planet(s) in house of longevity`,
          hi: `अष्टम भाव अशून्य  –  आयु भाव में ${occupants.length} ग्रह`,
          sa: `अष्टमभावे ग्रहाः  –  आयुर्भावे ${occupants.length} ग्रहाः`,
        },
      });
    }

    return assess(this, {
      tier: 3,
      points: 3,
      maxPoints: 3,
      severity: 'positive',
      reason: {
        en: '8th house vacant  –  auspicious for marital longevity',
        hi: 'अष्टम भाव शून्य  –  दाम्पत्य दीर्घायु हेतु शुभ',
        sa: 'अष्टमभावः शून्यः  –  दाम्पत्यदीर्घायुषे शुभम्',
      },
    });
  },
};

// ---------------------------------------------------------------------------
// 6. seventh-house-vacancy (MC + B.V. Raman  –  Marriage/Engagement)
// 7th house is the marriage house. Malefics there damage marital harmony.
// Rahu, Ketu, Saturn, Mars = -4; Sun = -2 (lesser malefic).
// Exception: Waxing Moon in 7th is sometimes tolerated (near Purnima).
// ---------------------------------------------------------------------------
const MARRIAGE_ACTIVITIES: string[] = ['marriage', 'engagement'];

const seventhHouseVacancy: MuhurtaRule = {
  id: 'seventh-house-vacancy',
  name: { en: '7th House Vacancy', hi: 'सप्तम भाव शून्यता', sa: 'सप्तमभावशून्यता' },
  category: 'lagna',
  scope: 'window',
  effect: 'penalty',
  tier: 3,
  appliesTo: ['marriage', 'engagement'],
  source: 'MC Vivah Prakarana, B.V. Raman Muhurtha Ch.12',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (!MARRIAGE_ACTIVITIES.includes(ctx.activity)) return null;
    if (ctx.lagnaSign == null || !ctx.planets || ctx.planets.length === 0) return null;

    // 7th house = 6 signs from lagna (1-indexed, wrapped)
    const seventhSign = ((ctx.lagnaSign - 1 + 6) % 12) + 1;

    // Malefic planet ids: Sun(0), Mars(2), Saturn(6), Rahu(7), Ketu(8)
    const maleficPenalty: Record<number, number> = { 0: -2, 2: -4, 6: -4, 7: -4, 8: -4 };
    const maleficNames: Record<number, string> = { 0: 'Sun', 2: 'Mars', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu' };
    let totalPenalty = 0;
    const occupants: string[] = [];

    for (const planet of ctx.planets) {
      if (!(planet.id in maleficPenalty)) continue;
      const sidSign = getRashiNumber(toSidereal(planet.longitude, ctx.midpointJD));
      if (sidSign === seventhSign) {
        // Moon (id=1) exception  –  not in maleficPenalty, so won't reach here
        totalPenalty += maleficPenalty[planet.id]!;
        occupants.push(maleficNames[planet.id]!);
      }
    }

    if (occupants.length === 0) {
      return assess(this, {
        tier: 3,
        points: 3,
        maxPoints: 3,
        severity: 'positive',
        reason: {
          en: '7th house (marriage house) vacant  –  auspicious',
          hi: 'सप्तम भाव (विवाह भाव) शून्य  –  शुभ',
          sa: 'सप्तमभावः शून्यः  –  शुभम्',
        },
      });
    }

    return assess(this, {
      tier: 3,
      points: totalPenalty,
      maxPoints: 3,
      severity: totalPenalty <= -4 ? 'major' : 'moderate',
      reason: {
        en: `${occupants.join(', ')} in 7th house  –  damages marital harmony`,
        hi: `${occupants.join(', ')} सप्तम भाव में  –  दाम्पत्य सुख को हानि`,
        sa: `सप्तमभावे ${occupants.join(', ')}  –  दाम्पत्यसुखहानिः`,
      },
    });
  },
};

// ---------------------------------------------------------------------------
// 7. malefics-aspecting-seventh (MC + B.V. Raman  –  Marriage/Engagement)
// Vedic aspects on the 7th house from malefics: -3 points per malefic.
// All planets aspect 7th from their position. Mars also aspects 4th/8th.
// Saturn also aspects 3rd/10th.
// ---------------------------------------------------------------------------
const maleficsAspectingSeventh: MuhurtaRule = {
  id: 'malefics-aspecting-seventh',
  name: { en: 'Malefics Aspecting 7th', hi: 'सप्तम पर पापदृष्टि', sa: 'सप्तमे पापदृष्टिः' },
  category: 'lagna',
  scope: 'window',
  effect: 'penalty',
  tier: 3,
  appliesTo: ['marriage', 'engagement'],
  source: 'MC Vivah Prakarana, B.V. Raman',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (!MARRIAGE_ACTIVITIES.includes(ctx.activity)) return null;
    if (ctx.lagnaSign == null || !ctx.planets || ctx.planets.length === 0) return null;

    const seventhSign = ((ctx.lagnaSign - 1 + 6) % 12) + 1;

    // Malefic ids to check: Mars(2), Saturn(6), Rahu(7), Ketu(8)
    // Sun(0) excluded  –  its aspects are not traditionally checked for this rule
    const maleficIds = [2, 6, 7, 8];
    const maleficNames: Record<number, string> = { 2: 'Mars', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu' };
    const aspecting: string[] = [];

    for (const pid of maleficIds) {
      const planet = ctx.planets.find(p => p.id === pid);
      if (!planet) continue;
      const planetSign = getRashiNumber(toSidereal(planet.longitude, ctx.midpointJD));

      // Compute house offset: how many houses from planet to 7th house
      // houseOffset = ((targetSign - planetSign + 12) % 12) || 12
      const offset = ((seventhSign - planetSign + 12) % 12) || 12;

      // All planets aspect 7th from self (offset 7)
      let aspects = false;
      if (offset === 7) aspects = true;
      // Mars special aspects: 4th and 8th from its position
      if (pid === 2 && (offset === 4 || offset === 8)) aspects = true;
      // Saturn special aspects: 3rd and 10th from its position
      if (pid === 6 && (offset === 3 || offset === 10)) aspects = true;

      // Skip if planet is already IN the 7th (handled by seventh-house-vacancy)
      if (offset === 0 || planetSign === seventhSign) continue;

      if (aspects) {
        aspecting.push(maleficNames[pid]!);
      }
    }

    if (aspecting.length === 0) return null;

    const points = -3 * aspecting.length;
    return assess(this, {
      tier: 3,
      points,
      maxPoints: 0,
      severity: aspecting.length >= 2 ? 'major' : 'moderate',
      reason: {
        en: `${aspecting.join(', ')} aspect${aspecting.length > 1 ? '' : 's'} 7th house  –  adverse for marriage`,
        hi: `${aspecting.join(', ')} की सप्तम भाव पर दृष्टि  –  विवाह हेतु प्रतिकूल`,
        sa: `${aspecting.join(', ')} सप्तमभावे दृष्टिः  –  विवाहे प्रतिकूलम्`,
      },
    });
  },
};

// ---------------------------------------------------------------------------
// 8. venus-in-sixth (MC  –  Marriage/Engagement)
// Venus (karaka of marriage) in 6th house from lagna = -3 points.
// 6th house = enemies, obstacles, debts  –  terrible for Venus.
// ---------------------------------------------------------------------------
const venusInSixth: MuhurtaRule = {
  id: 'venus-in-sixth',
  name: { en: 'Venus in 6th House', hi: 'शुक्र षष्ठ भाव में', sa: 'शुक्रः षष्ठभावे' },
  category: 'lagna',
  scope: 'window',
  effect: 'penalty',
  tier: 3,
  appliesTo: ['marriage', 'engagement'],
  source: 'MC Vivah Prakarana',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (!MARRIAGE_ACTIVITIES.includes(ctx.activity)) return null;
    if (ctx.lagnaSign == null || !ctx.planets || ctx.planets.length === 0) return null;

    const sixthSign = ((ctx.lagnaSign - 1 + 5) % 12) + 1;
    const venus = ctx.planets.find(p => p.id === 5);
    if (!venus) return null;

    const venusSign = getRashiNumber(toSidereal(venus.longitude, ctx.midpointJD));
    if (venusSign !== sixthSign) return null;

    return assess(this, {
      tier: 3,
      points: -3,
      maxPoints: 0,
      severity: 'moderate',
      reason: {
        en: 'Venus (marriage karaka) in 6th house  –  obstacles to conjugal happiness',
        hi: 'शुक्र (विवाह कारक) षष्ठ भाव में  –  दाम्पत्य सुख में बाधा',
        sa: 'शुक्रः (विवाहकारकः) षष्ठभावे  –  दाम्पत्यसुखबाधा',
      },
    });
  },
};

// ---------------------------------------------------------------------------
// 9. mars-in-eighth-extra (B.V. Raman  –  Marriage/Engagement)
// Mars in 8th house gets an extra -2 penalty on top of the generic
// eighth-house-vacancy rule (-3). Mars in 8th = violence/accident to
// spouse, the worst malefic placement for marriage. Total = -5.
// ---------------------------------------------------------------------------
const marsInEighthExtra: MuhurtaRule = {
  id: 'mars-in-eighth-extra',
  name: { en: 'Mars in 8th House', hi: 'मंगल अष्टम भाव में', sa: 'कुजः अष्टमभावे' },
  category: 'lagna',
  scope: 'window',
  effect: 'penalty',
  tier: 3,
  appliesTo: ['marriage', 'engagement'],
  source: 'B.V. Raman Muhurtha Ch.12',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (!MARRIAGE_ACTIVITIES.includes(ctx.activity)) return null;
    if (ctx.lagnaSign == null || !ctx.planets || ctx.planets.length === 0) return null;

    const eighthSign = ((ctx.lagnaSign - 1 + 7) % 12) + 1;
    const mars = ctx.planets.find(p => p.id === 2);
    if (!mars) return null;

    const marsSign = getRashiNumber(toSidereal(mars.longitude, ctx.midpointJD));
    if (marsSign !== eighthSign) return null;

    return assess(this, {
      tier: 3,
      points: -2,
      maxPoints: 0,
      severity: 'major',
      reason: {
        en: 'Mars in 8th house  –  severe danger to marital longevity (additional penalty)',
        hi: 'मंगल अष्टम भाव में  –  दाम्पत्य दीर्घायु को गंभीर खतरा (अतिरिक्त दंड)',
        sa: 'कुजः अष्टमभावे  –  दाम्पत्यदीर्घायुषे गम्भीरभयम् (अतिरिक्तदण्डः)',
      },
    });
  },
};

// ---------------------------------------------------------------------------
// 10. jupiter-venus-aspecting-lagna (MC Ch.7  –  all activities)
// Jupiter or Venus ASPECTING lagna (not just occupying) also confers
// significant benefit. +5 points per aspecting benefic (Tier 2).
// Jupiter aspects from houses 5, 7, 9 (i.e. offsets 5, 7, 9 from Jupiter).
// Venus aspects from house 7 only (standard 7th aspect).
// This complements rule #4 (planets-in-ascendant) which checks occupation.
// ---------------------------------------------------------------------------
const jupiterVenusAspectingLagna: MuhurtaRule = {
  id: 'jupiter-venus-aspecting-lagna',
  name: { en: 'Jupiter/Venus Aspecting Lagna', hi: 'गुरु/शुक्र लग्न पर दृष्टि', sa: 'गुरुशुक्रलग्नदृष्टिः' },
  category: 'lagna',
  scope: 'window',
  effect: 'bonus',
  tier: 2,
  appliesTo: 'all',
  source: 'MC Ch.7',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    if (ctx.lagnaSign == null || !ctx.planets || ctx.planets.length === 0) return null;

    const aspecting: string[] = [];

    for (const pid of [4, 5]) { // Jupiter(4), Venus(5)
      const planet = ctx.planets.find(p => p.id === pid);
      if (!planet) continue;
      const planetSign = getRashiNumber(toSidereal(planet.longitude, ctx.midpointJD));

      // Skip if planet is IN lagna (already handled by planets-in-ascendant)
      if (planetSign === ctx.lagnaSign) continue;

      // Compute offset from planet to lagna
      const offset = ((ctx.lagnaSign - planetSign + 12) % 12) || 12;

      let aspects = false;
      // Jupiter special aspects: 5th, 7th, 9th from its position
      if (pid === 4 && (offset === 5 || offset === 7 || offset === 9)) aspects = true;
      // Venus standard aspect: 7th from its position
      if (pid === 5 && offset === 7) aspects = true;

      if (aspects) {
        aspecting.push(pid === 4 ? 'Jupiter' : 'Venus');
      }
    }

    if (aspecting.length === 0) return null;

    const points = 5 * aspecting.length;
    return assess(this, {
      tier: 2,
      points,
      maxPoints: 10,
      severity: 'positive',
      reason: {
        en: `${aspecting.join(' & ')} aspect${aspecting.length > 1 ? '' : 's'} lagna  –  strong benefic influence`,
        hi: `${aspecting.join(' व ')} की लग्न पर दृष्टि  –  प्रबल शुभ प्रभाव`,
        sa: `${aspecting.join(' ')} लग्ने दृष्टिः  –  प्रबलशुभप्रभावः`,
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
  seventhHouseVacancy,
  maleficsAspectingSeventh,
  venusInSixth,
  marsInEighthExtra,
  jupiterVenusAspectingLagna,
];
