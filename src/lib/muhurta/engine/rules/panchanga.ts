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

// Inauspicious yogas per MC Ch.6 — split into hard and moderate
// Hard: classically considered muhurta-breakers for new beginnings
const HARD_INAUSPICIOUS_YOGAS = new Set([10, 17, 27]); // Ganda, Vyatipata, Vaidhriti
// Moderate: inauspicious but less severe
const MODERATE_INAUSPICIOUS_YOGAS = new Set([1, 6, 9, 13, 15, 19]); // Vishkambha, Atiganda, Shula, Vyaghata, Vajra, Parigha
// Combined for backward compat
const INAUSPICIOUS_YOGAS = new Set([...HARD_INAUSPICIOUS_YOGAS, ...MODERATE_INAUSPICIOUS_YOGAS]);

// Samskara activities — hard inauspicious yoga = absolute veto
const YOGA_VETO_ACTIVITIES = new Set(['marriage', 'engagement', 'griha_pravesh', 'upanayana', 'mundan', 'namakarana']);

// Dagdha (burnt) tithi-weekday combinations per MC Ch.3
// Key: weekday (0=Sun..6=Sat), Value: paksha-relative tithi number that is burnt on that day
const DAGDHA_TITHI: Record<number, number> = {
  0: 12, // Sunday + Dwadashi
  1: 11, // Monday + Ekadashi
  2: 5,  // Tuesday + Panchami
  3: 3,  // Wednesday + Tritiya
  4: 6,  // Thursday + Shashthi
  5: 8,  // Friday + Ashtami
  6: 9,  // Saturday + Navami
};

// Nakshatra Gandanta — water-fire sign junctions (last/first 3°20' = 3.333°)
// These are the nakshatra IDs at the boundaries:
// Ashlesha(9)→Magha(10), Jyeshtha(18)→Mula(19), Revati(27)→Ashwini(1)
const GANDANTA_END_NAKSHATRAS = new Set([9, 18, 27]); // last portion is gandanta
const GANDANTA_START_NAKSHATRAS = new Set([1, 10, 19]); // first portion is gandanta
const GANDANTA_DEGREE_RANGE = 3.333; // 3°20' = 200 arcmin

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
// 3. yoga-quality (HARDENED — classical rejection logic)
//
// Classical rule (MC Ch.6, Jyotirnibandha):
//   - Ganda, Vyatipata, Vaidhriti are muhurta-breakers — they CANNOT be
//     overridden by strong lagna or other positives
//   - For samskaras (marriage, etc.): hard inauspicious yoga = absolute veto
//   - For other activities: heavy penalty (-8), tier 2 (lagna cannot cancel
//     because lagna is also tier 2, and cancellation requires tier <= target-2)
//   - Moderate inauspicious yogas: -6, tier 2 (still not cancellable by lagna)
//
// This ensures a Ganda Yoga day can NEVER score "Excellent" (75+)
// ---------------------------------------------------------------------------
const yogaQuality: MuhurtaRule = {
  id: 'yoga-quality',
  name: { en: 'Yoga Quality', hi: 'योग गुणवत्ता', sa: 'योगगुणः' },
  category: 'panchanga',
  scope: 'window',
  effect: 'bonus',
  tier: 2,
  appliesTo: 'all',
  source: 'MC Ch.6',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const yoga = ctx.snap.yoga;

    // Hard inauspicious yogas: Ganda(10), Vyatipata(17), Vaidhriti(27)
    // These are classical muhurta-breakers — no amount of positive factors can save them
    if (HARD_INAUSPICIOUS_YOGAS.has(yoga)) {
      // For samskaras: absolute veto (Tier 0)
      if (YOGA_VETO_ACTIVITIES.has(ctx.activity)) {
        return assess(ctx, this, {
          tier: 0,
          points: -10,
          maxPoints: 4,
          vetoed: true,
          severity: 'critical',
          reason: {
            en: 'Severely inauspicious Yoga — samskara forbidden',
            hi: 'अत्यन्त अशुभ योग — संस्कार वर्जित',
            sa: 'अत्यन्तम् अशुभयोगः — संस्कारवर्जितम्',
          },
        });
      }
      // For other activities: heavy penalty, NOT cancellable by lagna
      // Tier 2 means only Tier 1 (Godhuli) can cancel it
      return assess(ctx, this, {
        tier: 2,
        points: -8,
        maxPoints: 4,
        severity: 'critical',
        reason: {
          en: 'Severely inauspicious Yoga (Ganda/Vyatipata/Vaidhriti)',
          hi: 'अत्यन्त अशुभ योग (गण्ड/व्यतीपात/वैधृति)',
          sa: 'अत्यन्तम् अशुभयोगः (गण्डः/व्यतीपातः/वैधृतिः)',
        },
      });
    }

    // Moderate inauspicious yogas: Vishkambha(1), Atiganda(6), Shula(9),
    // Vyaghata(13), Vajra(15), Parigha(19)
    // Heavy penalty but not a veto — still makes "Excellent" nearly impossible
    if (MODERATE_INAUSPICIOUS_YOGAS.has(yoga)) {
      return assess(ctx, this, {
        tier: 2,
        points: -6,
        maxPoints: 4,
        severity: 'major',
        reason: { en: 'Inauspicious Yoga', hi: 'अशुभ योग', sa: 'अशुभयोगः' },
      });
    }

    // Auspicious yoga — all others
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
// 7. dagdha-tithi (Burnt Tithi)
//
// Classical rule (MC Ch.3):
//   Certain tithi-weekday combinations are "dagdha" (burnt/scorched).
//   Activities begun during dagdha tithi are said to be destroyed.
//   Table: Sun=Dwadashi, Mon=Ekadashi, Tue=Panchami, Wed=Tritiya,
//          Thu=Shashthi, Fri=Ashtami, Sat=Navami
//
// Tier 2, -6 points — NOT cancellable by lagna (same tier).
// Only Godhuli Lagna (Tier 1) can override a dagdha tithi.
// ---------------------------------------------------------------------------
const dagdhaTithi: MuhurtaRule = {
  id: 'dagdha-tithi',
  name: { en: 'Dagdha Tithi', hi: 'दग्ध तिथि', sa: 'दग्धतिथिः' },
  category: 'panchanga',
  scope: 'window',
  effect: 'penalty',
  tier: 2,
  appliesTo: 'all',
  source: 'MC Ch.3',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const weekday = ctx.snap.weekday; // 0=Sun..6=Sat
    const pakshaRelTithi = ctx.snap.tithi > 15 ? ctx.snap.tithi - 15 : ctx.snap.tithi;
    const dagdhaTithiForDay = DAGDHA_TITHI[weekday];

    if (dagdhaTithiForDay === undefined || pakshaRelTithi !== dagdhaTithiForDay) {
      return null; // No dagdha — rule does not fire
    }

    return assess(ctx, this, {
      tier: 2,
      points: -6,
      maxPoints: 0,
      severity: 'major',
      reason: {
        en: 'Dagdha (burnt) Tithi — inauspicious tithi-weekday combination',
        hi: 'दग्ध तिथि — अशुभ तिथि-वार संयोग',
        sa: 'दग्धतिथिः — अशुभतिथिवारसंयोगः',
      },
    });
  },
};

// ---------------------------------------------------------------------------
// 8. nakshatra-gandanta (Nakshatra Junction)
//
// Classical rule (BPHS, Muhurta Chintamani):
//   The last 3°20' (200') of Ashlesha(9), Jyeshtha(18), Revati(27)
//   and the first 3°20' of Magha(10), Mula(19), Ashwini(1) are
//   "gandanta" — water-fire sign junctions where the Moon is unstable.
//
//   For samskaras (esp. mundan, namakarana): Tier 0 veto
//   For other activities: Tier 2, -6 points
//
// Requires ctx.snap.moonSid (Moon's sidereal longitude) to compute
// the Moon's position within the nakshatra.
// ---------------------------------------------------------------------------
const nakshatraGandanta: MuhurtaRule = {
  id: 'nakshatra-gandanta',
  name: { en: 'Nakshatra Gandanta', hi: 'नक्षत्र गण्डान्त', sa: 'नक्षत्रगण्डान्तम्' },
  category: 'panchanga',
  scope: 'window',
  effect: 'penalty',
  tier: 2,
  appliesTo: 'all',
  source: 'BPHS, MC',
  evaluate(ctx: RuleContext): RuleAssessment | null {
    const nak = ctx.snap.nakshatra;
    const moonSid = ctx.snap.moonSid;
    if (moonSid === undefined) return null;

    // Each nakshatra spans 13°20' (13.333°)
    const nakSpan = 360 / 27; // 13.333°
    const nakStart = (nak - 1) * nakSpan;
    const degreeInNak = ((moonSid - nakStart) % 360 + 360) % 360;

    let isGandanta = false;

    // Last 3°20' of water-sign-end nakshatras (Ashlesha, Jyeshtha, Revati)
    if (GANDANTA_END_NAKSHATRAS.has(nak) && degreeInNak > (nakSpan - GANDANTA_DEGREE_RANGE)) {
      isGandanta = true;
    }

    // First 3°20' of fire-sign-start nakshatras (Ashwini, Magha, Mula)
    if (GANDANTA_START_NAKSHATRAS.has(nak) && degreeInNak < GANDANTA_DEGREE_RANGE) {
      isGandanta = true;
    }

    if (!isGandanta) return null;

    // For samskaras involving children (mundan, namakarana): absolute veto
    const childSamskaras = new Set(['mundan', 'namakarana']);
    if (childSamskaras.has(ctx.activity)) {
      return assess(ctx, this, {
        tier: 0,
        points: -10,
        maxPoints: 0,
        vetoed: true,
        severity: 'critical',
        reason: {
          en: 'Nakshatra Gandanta — water-fire junction, child samskara forbidden',
          hi: 'नक्षत्र गण्डान्त — जल-अग्नि सन्धि, बाल संस्कार वर्जित',
          sa: 'नक्षत्रगण्डान्तम् — जलाग्निसन्धिः, बालसंस्कारवर्जितम्',
        },
      });
    }

    // For other activities: heavy penalty
    return assess(ctx, this, {
      tier: 2,
      points: -6,
      maxPoints: 0,
      severity: 'major',
      reason: {
        en: 'Nakshatra Gandanta — Moon at water-fire junction (unstable)',
        hi: 'नक्षत्र गण्डान्त — चन्द्र जल-अग्नि सन्धि पर (अस्थिर)',
        sa: 'नक्षत्रगण्डान्तम् — चन्द्रः जलाग्निसन्धौ (अस्थिरः)',
      },
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
  dagdhaTithi,
  nakshatraGandanta,
];
