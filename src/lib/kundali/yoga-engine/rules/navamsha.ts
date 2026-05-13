/**
 * Navamsha (D9) Chart Yoga Rules
 *
 * Yogas derived from the Navamsha divisional chart — the 9th harmonic division.
 * Navamsha is the most important divisional chart after the Rashi (D1), governing
 * dharma, marriage, and the deeper spiritual potential of the native.
 *
 * Navamsha sign is computed from the sidereal longitude:
 * - Each sign (30°) is divided into 9 navamshas of 3°20' each
 * - Starting navamsha depends on sign modality:
 *   - Movable signs (1,4,7,10): start from SELF
 *   - Fixed signs (2,5,8,11): start from 9th sign
 *   - Dual signs (3,6,9,12): start from 5th sign
 *
 * Sources: BPHS Ch.6-7 (divisional charts), Phaladeepika, Jataka Parijata
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Sign IDs:   1=Aries through 12=Pisces (1-based)
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';
import { EXALTATION_SIGNS, DEBILITATION_SIGNS, SIGN_LORDS } from '@/lib/constants/dignities';

// ─────────────────────────────────────────────────────────────────────────────
// Navamsha computation
// ─────────────────────────────────────────────────────────────────────────────

/** Movable signs: Aries(1), Cancer(4), Libra(7), Capricorn(10) */
const MOVABLE_SIGNS = [1, 4, 7, 10];

/** Fixed signs: Taurus(2), Leo(5), Scorpio(8), Aquarius(11) */
const FIXED_SIGNS = [2, 5, 8, 11];

// Dual signs: Gemini(3), Virgo(6), Sagittarius(9), Pisces(12) — inferred as remainder

/**
 * Compute navamsha sign from sidereal longitude.
 *
 * Algorithm (BPHS Ch.6):
 * 1. Determine the D1 sign (1-12) and degree within sign (0-30)
 * 2. Compute navamsha index within the sign: floor(degreeInSign * 9 / 30) → 0-8
 * 3. Determine the starting sign based on modality:
 *    - Movable: starts from the sign itself
 *    - Fixed: starts from the 9th sign
 *    - Dual: starts from the 5th sign
 * 4. Navamsha sign = (startSign - 1 + navamshaIndex) % 12 + 1
 */
function computeNavamshaSign(longitude: number): number {
  const signIndex = Math.floor(longitude / 30); // 0-11
  const degreeInSign = longitude % 30;
  const navamshaIndex = Math.floor(degreeInSign * 9 / 30); // 0-8 (clamps at 8 for exactly 30°)
  const signNum = signIndex + 1; // 1-12

  let startSign: number;
  if (MOVABLE_SIGNS.includes(signNum)) {
    startSign = signNum; // Movable: starts from self
  } else if (FIXED_SIGNS.includes(signNum)) {
    startSign = ((signNum + 8 - 1) % 12) + 1; // Fixed: starts from 9th sign
  } else {
    startSign = ((signNum + 4 - 1) % 12) + 1; // Dual: starts from 5th sign
  }

  return ((startSign - 1 + navamshaIndex) % 12) + 1; // 1-12
}

/**
 * Pushkara Navamsha positions — specific navamsha divisions considered
 * especially auspicious. These are the 24 Pushkara Navamshas.
 *
 * Format: Map of D1 sign → set of navamsha indices (0-8) within that sign
 * that are Pushkara Navamshas.
 *
 * Source: Jataka Parijata; Prashna Marga
 *
 * The Pushkara Navamshas fall in signs ruled by benefics (Venus/Jupiter)
 * and in specific degree ranges per sign.
 */
const PUSHKARA_NAVAMSHA: Record<number, number[]> = {
  // Complete table per Jataka Parijata — two Pushkara Navamsha indices (0-based) per sign
  // Values from spec are 1-based navamsha numbers; stored here as 0-based indices (subtract 1)
  1:  [6, 8],     // Aries: 7th & 9th navamshas
  2:  [2, 4],     // Taurus: 3rd & 5th navamshas
  3:  [0, 6],     // Gemini: 1st & 7th navamshas
  4:  [2, 4],     // Cancer: 3rd & 5th navamshas
  5:  [6, 8],     // Leo: 7th & 9th navamshas
  6:  [2, 4],     // Virgo: 3rd & 5th navamshas
  7:  [0, 6],     // Libra: 1st & 7th navamshas
  8:  [2, 4],     // Scorpio: 3rd & 5th navamshas
  9:  [6, 8],     // Sagittarius: 7th & 9th navamshas
  10: [2, 4],     // Capricorn: 3rd & 5th navamshas
  11: [0, 6],     // Aquarius: 1st & 7th navamshas
  12: [2, 4],     // Pisces: 3rd & 5th navamshas
};

/**
 * Check if a planet is in a Pushkara Navamsha position.
 */
function isPushkaraNavamsha(longitude: number): boolean {
  const signNum = Math.floor(longitude / 30) + 1; // 1-12
  const degreeInSign = longitude % 30;
  const navamshaIndex = Math.floor(degreeInSign * 9 / 30); // 0-8
  const pushkaraIndices = PUSHKARA_NAVAMSHA[signNum];
  return pushkaraIndices?.includes(navamshaIndex) ?? false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Planet name helper for customData descriptions
// ─────────────────────────────────────────────────────────────────────────────

const PLANET_NAMES: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

// ─────────────────────────────────────────────────────────────────────────────
// Navamsha Rules
// ─────────────────────────────────────────────────────────────────────────────

export const NAVAMSHA_RULES: YogaRule[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Vargottama Lagna
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Vargottama Lagna — Ascendant in the same sign in D1 and D9
   *
   * When the rising sign occupies the same navamsha as its rashi sign,
   * the lagna's energy is doubly reinforced. Considered one of the most
   * powerful D9 indications — the native's core personality and dharmic
   * path are perfectly aligned.
   *
   * Source: BPHS Ch.7; Phaladeepika; Jataka Parijata
   */
  {
    id: 'vargottama-lagna',
    name: { en: 'Vargottama Lagna', hi: 'वर्गोत्तम लग्न', sa: 'वर्गोत्तमलग्नम्' },
    group: 'navamsha',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.7; Phaladeepika',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const d1Sign = ctx.ascendantSign;
        const d9Sign = computeNavamshaSign(ctx.ascendantLongitude);
        const present = d1Sign === d9Sign;

        return {
          present,
          involvedPlanets: [], // No planets involved, lagna-based
          customData: present ? { d1Sign, d9Sign } : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext) => {
      // Vargottama lagna is inherently strong — strength depends on lagna lord's dignity
      const lagnaLord = ctx.houseLord(1);
      const dignity = ctx.dignity(lagnaLord);

      if (dignity === 'exalted' || dignity === 'moolatrikona') return 'Strong';
      if (dignity === 'debilitated') return 'Weak';
      return 'Moderate'; // Own/friend/neutral still good for vargottama
    },

    affectedDomains: 'all',
    domainImpactWeight: 2,

    formationRule: {
      en: 'Ascendant occupies the same sign in both Rashi (D1) and Navamsha (D9) charts',
      hi: 'लग्न राशि चार्ट (D1) और नवमांश चार्ट (D9) दोनों में एक ही राशि में',
    },
    description: {
      en: 'Vargottama Lagna is among the most auspicious indications in divisional chart analysis. The native\'s personality, physical constitution, and life direction receive double reinforcement from the D1-D9 alignment. The dharmic path is clear and well-supported. This strengthens all houses and their significations, acting as a general amplifier of the chart\'s promise.',
      hi: 'वर्गोत्तम लग्न विभागीय चार्ट विश्लेषण में सबसे शुभ संकेतों में से एक है। D1-D9 संरेखण से जातक के व्यक्तित्व, शारीरिक संरचना और जीवन दिशा को दोगुना बल मिलता है। धार्मिक मार्ग स्पष्ट और सुदृढ़ होता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Vargottama Planets
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Vargottama Planet — Any planet in the same sign in D1 and D9
   *
   * A vargottama planet has its rashi placement confirmed by the navamsha.
   * The planet's significations are reinforced and its results become more
   * reliable. Checks all 9 planets and reports which ones qualify.
   *
   * Source: BPHS Ch.7; Jataka Parijata
   */
  {
    id: 'vargottama-planet',
    name: { en: 'Vargottama Planet', hi: 'वर्गोत्तम ग्रह', sa: 'वर्गोत्तमग्रहः' },
    group: 'navamsha',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.7; Jataka Parijata',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const vargottamaPlanets: number[] = [];
        const details: Record<string, number> = {};

        for (let pid = 0; pid <= 8; pid++) {
          const longitude = ctx.planetLongitude(pid);
          const d1Sign = ctx.planetSign(pid);
          const d9Sign = computeNavamshaSign(longitude);

          if (d1Sign === d9Sign) {
            vargottamaPlanets.push(pid);
            details[PLANET_NAMES[pid] ?? `Planet${pid}`] = d1Sign;
          }
        }

        return {
          present: vargottamaPlanets.length > 0,
          involvedPlanets: vargottamaPlanets,
          customData: vargottamaPlanets.length > 0
            ? { vargottamaPlanets: details, count: vargottamaPlanets.length }
            : undefined,
        };
      },
    },

    assessStrength: (_ctx: YogaContext, result: YogaDetectionResult) => {
      const count = (result.customData as { count?: number } | undefined)?.count ?? 0;
      // More vargottama planets = stronger yoga
      if (count >= 3) return 'Strong';
      if (count >= 2) return 'Moderate';
      return 'Weak'; // Single vargottama planet is still beneficial but mild
    },

    affectedDomains: 'all',
    domainImpactWeight: 1,

    formationRule: {
      en: 'One or more planets occupy the same sign in both D1 and D9 charts',
      hi: 'एक या अधिक ग्रह D1 और D9 दोनों चार्ट में एक ही राशि में',
    },
    description: {
      en: 'Vargottama planets have their rashi placement confirmed by the Navamsha. Their significations become more dependable and their dasha periods deliver clearer results. A vargottama benefic amplifies blessings in its house; a vargottama malefic delivers its results (good or bad) with certainty. Multiple vargottama planets significantly strengthen the overall chart.',
      hi: 'वर्गोत्तम ग्रहों की राशि स्थिति नवमांश द्वारा पुष्ट होती है। उनके कारकत्व अधिक विश्वसनीय हो जाते हैं और उनकी दशा अवधि स्पष्ट परिणाम देती है। वर्गोत्तम शुभ ग्रह अपने भाव में आशीर्वाद बढ़ाता है; एक से अधिक वर्गोत्तम ग्रह समग्र कुंडली को मजबूत करते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Pushkara Navamsha
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Pushkara Navamsha — Planet in an especially auspicious D9 division
   *
   * Pushkara ("nourishing") Navamshas are specific 3°20' segments of the zodiac
   * considered highly auspicious. They fall in signs ruled by benefics
   * (Venus and Jupiter). A planet in Pushkara Navamsha receives extra
   * nourishment and delivers enhanced positive results.
   *
   * Source: Jataka Parijata; Prashna Marga
   */
  {
    id: 'pushkara-navamsha',
    name: { en: 'Pushkara Navamsha', hi: 'पुष्कर नवमांश', sa: 'पुष्करनवांशः' },
    group: 'navamsha',
    isAuspicious: true,
    classicalRef: 'Jataka Parijata; Prashna Marga',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const pushkaraPlanets: number[] = [];
        const details: Record<string, boolean> = {};

        for (let pid = 0; pid <= 8; pid++) {
          const longitude = ctx.planetLongitude(pid);
          if (isPushkaraNavamsha(longitude)) {
            pushkaraPlanets.push(pid);
            details[PLANET_NAMES[pid] ?? `Planet${pid}`] = true;
          }
        }

        return {
          present: pushkaraPlanets.length > 0,
          involvedPlanets: pushkaraPlanets,
          customData: pushkaraPlanets.length > 0
            ? { pushkaraPlanets: details, count: pushkaraPlanets.length }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const count = (result.customData as { count?: number } | undefined)?.count ?? 0;
      // Benefics in Pushkara = stronger; malefics in Pushkara = moderate
      const hasBeneficPushkara = result.involvedPlanets.some(pid => ctx.isNaturalBenefic(pid));

      if (count >= 3 || (count >= 2 && hasBeneficPushkara)) return 'Strong';
      if (count >= 2 || hasBeneficPushkara) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: 'all',
    domainImpactWeight: 1,

    formationRule: {
      en: 'One or more planets occupy a Pushkara Navamsha degree range',
      hi: 'एक या अधिक ग्रह पुष्कर नवमांश अंश सीमा में',
    },
    description: {
      en: 'Pushkara Navamsha positions are especially nourishing for planets. These auspicious D9 divisions amplify the planet\'s positive significations and protect against adverse transits. Benefic planets in Pushkara Navamsha deliver enhanced blessings; even malefics have their harsh edge softened. Particularly important in muhurta (electional) astrology for timing auspicious events.',
      hi: 'पुष्कर नवमांश स्थितियां ग्रहों के लिए विशेष रूप से पोषक होती हैं। ये शुभ D9 विभाग ग्रह के सकारात्मक कारकत्व को बढ़ाते हैं और प्रतिकूल गोचर से सुरक्षा प्रदान करते हैं। शुभ ग्रह पुष्कर नवमांश में उन्नत आशीर्वाद देते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Navamsha Exaltation
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Navamsha Exaltation — Planet exalted in D9 chart
   *
   * When a planet occupies its exaltation sign in the Navamsha, its deeper
   * (dharmic/spiritual) significations are strengthened. The planet's D9
   * exaltation indicates that the soul-level purpose connected to that
   * planet is well-supported.
   *
   * Source: BPHS Ch.7; Phaladeepika
   */
  {
    id: 'navamsha-exaltation',
    name: { en: 'Navamsha Exaltation', hi: 'नवमांश उच्च', sa: 'नवांशोच्चम्' },
    group: 'navamsha',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.7; Phaladeepika',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const exaltedPlanets: number[] = [];
        const details: Record<string, number> = {};

        for (let pid = 0; pid <= 8; pid++) {
          const longitude = ctx.planetLongitude(pid);
          const d9Sign = computeNavamshaSign(longitude);
          const exaltSign = EXALTATION_SIGNS[pid];

          if (exaltSign !== undefined && d9Sign === exaltSign) {
            exaltedPlanets.push(pid);
            details[PLANET_NAMES[pid] ?? `Planet${pid}`] = d9Sign;
          }
        }

        return {
          present: exaltedPlanets.length > 0,
          involvedPlanets: exaltedPlanets,
          customData: exaltedPlanets.length > 0
            ? { exaltedInD9: details, count: exaltedPlanets.length }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const count = (result.customData as { count?: number } | undefined)?.count ?? 0;
      // Also exalted or dignified in D1 = very strong
      const d1AlsoStrong = result.involvedPlanets.some(pid => {
        const d = ctx.dignity(pid);
        return d === 'exalted' || d === 'own' || d === 'moolatrikona';
      });

      if (count >= 2 || (count >= 1 && d1AlsoStrong)) return 'Strong';
      if (count >= 1) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: 'all',
    domainImpactWeight: 1,

    formationRule: {
      en: 'One or more planets occupy their exaltation sign in the Navamsha (D9) chart',
      hi: 'एक या अधिक ग्रह नवमांश (D9) चार्ट में अपनी उच्च राशि में',
    },
    description: {
      en: 'Navamsha Exaltation indicates that the planet\'s dharmic and spiritual significations are operating at peak strength. The soul-level purpose connected to that planet is well-supported. When combined with good D1 dignity, the planet delivers exceptional results in its dasha periods. Particularly important for marriage analysis — Venus exalted in D9 is one of the strongest indicators of a fulfilling partnership.',
      hi: 'नवमांश उच्च दर्शाता है कि ग्रह के धार्मिक और आध्यात्मिक कारकत्व अपनी चरम शक्ति पर हैं। D1 में अच्छी गरिमा के साथ मिलकर ग्रह अपनी दशा अवधि में असाधारण परिणाम देता है। विवाह विश्लेषण में विशेष महत्व — D9 में शुक्र उच्च सबसे शक्तिशाली संकेतों में से एक है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Navamsha Debilitation
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Navamsha Debilitation — Planet debilitated in D9 chart
   *
   * The opposite of Navamsha Exaltation. The planet's D9 debilitation weakens
   * its deeper significations — the soul-level function struggles. Even if
   * well-placed in D1, D9 debilitation undermines long-term fulfilment.
   *
   * Source: BPHS Ch.7; Phaladeepika
   */
  {
    id: 'navamsha-debilitation',
    name: { en: 'Navamsha Debilitation', hi: 'नवमांश नीच', sa: 'नवांशनीचम्' },
    group: 'navamsha',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.7; Phaladeepika',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const debilitatedPlanets: number[] = [];
        const details: Record<string, number> = {};

        for (let pid = 0; pid <= 8; pid++) {
          const longitude = ctx.planetLongitude(pid);
          const d9Sign = computeNavamshaSign(longitude);
          const debilSign = DEBILITATION_SIGNS[pid];

          if (debilSign !== undefined && d9Sign === debilSign) {
            debilitatedPlanets.push(pid);
            details[PLANET_NAMES[pid] ?? `Planet${pid}`] = d9Sign;
          }
        }

        return {
          present: debilitatedPlanets.length > 0,
          involvedPlanets: debilitatedPlanets,
          customData: debilitatedPlanets.length > 0
            ? { debilitatedInD9: details, count: debilitatedPlanets.length }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const count = (result.customData as { count?: number } | undefined)?.count ?? 0;
      // Also debilitated in D1 = very strong affliction
      const d1AlsoWeak = result.involvedPlanets.some(pid => ctx.dignity(pid) === 'debilitated');

      if (count >= 2 || (count >= 1 && d1AlsoWeak)) return 'Strong';
      if (count >= 1) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: 'all',
    domainImpactWeight: 1,

    formationRule: {
      en: 'One or more planets occupy their debilitation sign in the Navamsha (D9) chart',
      hi: 'एक या अधिक ग्रह नवमांश (D9) चार्ट में अपनी नीच राशि में',
    },
    description: {
      en: 'Navamsha Debilitation weakens the planet\'s deeper dharmic function. Even if well-placed in D1, D9 debilitation indicates that long-term fulfilment in the planet\'s domain may be undermined. The native may achieve surface-level success but feel unfulfilled at the soul level. When also debilitated in D1, the planet\'s significations are comprehensively weak. Remedial measures for the debilitated planet become especially important.',
      hi: 'नवमांश नीच ग्रह के गहरे धार्मिक कार्य को कमज़ोर करता है। D1 में अच्छी स्थिति के बावजूद, D9 नीच दर्शाता है कि ग्रह के क्षेत्र में दीर्घकालिक संतुष्टि कमज़ोर हो सकती है। D1 में भी नीच होने पर ग्रह के कारकत्व व्यापक रूप से कमज़ोर होते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Navamsha Parivartana
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Navamsha Parivartana — Two planets exchange signs in D9
   *
   * When planet A is in the D9 sign ruled by planet B, and planet B is in the
   * D9 sign ruled by planet A, they form a D9 exchange (parivartana). This
   * creates a deep spiritual bond between the significations of both planets,
   * strengthening both.
   *
   * Source: BPHS Ch.7; Jataka Parijata
   */
  {
    id: 'navamsha-parivartana',
    name: { en: 'Navamsha Parivartana', hi: 'नवमांश परिवर्तन', sa: 'नवांशपरिवर्तनम्' },
    group: 'navamsha',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.7; Jataka Parijata',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const exchanges: Array<{ planet1: number; planet2: number; sign1: number; sign2: number }> = [];
        const involvedPlanets: number[] = [];

        // Check all pairs of classical planets (Sun=0 through Saturn=6)
        // Rahu/Ketu (7,8) have no sign lordship per BPHS
        for (let p1 = 0; p1 <= 6; p1++) {
          for (let p2 = p1 + 1; p2 <= 6; p2++) {
            const d9Sign1 = computeNavamshaSign(ctx.planetLongitude(p1));
            const d9Sign2 = computeNavamshaSign(ctx.planetLongitude(p2));

            const lordOfD9Sign1 = SIGN_LORDS[d9Sign1];
            const lordOfD9Sign2 = SIGN_LORDS[d9Sign2];

            // Exchange: p1 is in p2's sign AND p2 is in p1's sign (in D9)
            if (lordOfD9Sign1 === p2 && lordOfD9Sign2 === p1) {
              exchanges.push({ planet1: p1, planet2: p2, sign1: d9Sign1, sign2: d9Sign2 });
              involvedPlanets.push(p1, p2);
            }
          }
        }

        const uniquePlanets = [...new Set(involvedPlanets)];
        return {
          present: exchanges.length > 0,
          involvedPlanets: uniquePlanets,
          customData: exchanges.length > 0
            ? { exchanges, count: exchanges.length }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { count?: number } | undefined;
      const count = data?.count ?? 0;

      // Multiple exchanges = very strong
      if (count >= 2) return 'Strong';
      // Single exchange involving benefics = moderate to strong
      const hasBenefic = result.involvedPlanets.some(pid => ctx.isNaturalBenefic(pid));
      if (hasBenefic) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: 'all',
    domainImpactWeight: 1,

    formationRule: {
      en: 'Two planets exchange signs in the Navamsha (D9) chart — each occupies the D9 sign ruled by the other',
      hi: 'दो ग्रह नवमांश (D9) चार्ट में राशि परिवर्तन करते हैं — प्रत्येक दूसरे की D9 राशि में',
    },
    description: {
      en: 'Navamsha Parivartana creates a deep spiritual linkage between two planets through D9 sign exchange. Both planets\' dharmic significations become intertwined and mutually supportive. An exchange between benefics (Jupiter-Venus, Jupiter-Moon) is especially auspicious for marriage and spiritual growth. An exchange involving the lagna lord strengthens the entire chart\'s promise at the soul level.',
      hi: 'नवमांश परिवर्तन D9 राशि विनिमय के माध्यम से दो ग्रहों के बीच एक गहरा आध्यात्मिक संबंध बनाता है। दोनों ग्रहों के धार्मिक कारकत्व परस्पर जुड़े और सहायक हो जाते हैं। शुभ ग्रहों के बीच विनिमय विवाह और आध्यात्मिक विकास के लिए विशेष रूप से शुभ है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Navamsha Neechabhanga (D9 Debilitation Cancellation)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * D9 Neechabhanga — Planet debilitated in D9 but cancellation applies
   *
   * A planet debilitated in D9 has its debilitation cancelled when:
   * (a) The lord of the D9 debilitation sign is in a kendra in D9
   *     (we approximate this by checking if that lord is also well-placed in D1), OR
   * (b) The planet that is exalted in the debilitation sign is in a kendra from D9 lagna
   *
   * Since we compute D9 from longitude but don't have full D9 house positions,
   * we use a simplified check: the lord of the planet's D9 debilitation sign must
   * be in its own/exalted/moolatrikona sign in D1. This is a practical proxy
   * that captures the core neechabhanga principle.
   *
   * Source: BPHS Ch.28; Phaladeepika Ch.7
   */
  {
    id: 'navamsha-neechabhanga',
    name: { en: 'D9 Neechabhanga', hi: 'D9 नीचभंग', sa: 'नवांशनीचभङ्गः' },
    group: 'navamsha',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.28; Phaladeepika Ch.7',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const cancelledPlanets: number[] = [];
        const details: Array<{ planet: number; d9Sign: number; cancelledBy: number }> = [];

        for (let pid = 0; pid <= 8; pid++) {
          const longitude = ctx.planetLongitude(pid);
          const d9Sign = computeNavamshaSign(longitude);
          const debilSign = DEBILITATION_SIGNS[pid];

          if (debilSign === undefined || d9Sign !== debilSign) continue;

          // Planet IS debilitated in D9. Check cancellation:
          // The lord of the D9 debilitation sign must be dignified in D1
          const debilSignLord = SIGN_LORDS[debilSign];
          if (debilSignLord === undefined) continue;

          const lordDignity = ctx.dignity(debilSignLord);
          const lordInKendra = ctx.isKendra(ctx.planetHouse(debilSignLord));

          // Cancellation: sign lord in own/exalted/moolatrikona OR in a kendra
          if (
            lordDignity === 'exalted' ||
            lordDignity === 'own' ||
            lordDignity === 'moolatrikona' ||
            lordInKendra
          ) {
            cancelledPlanets.push(pid);
            details.push({
              planet: pid,
              d9Sign,
              cancelledBy: debilSignLord,
            });
          }
        }

        return {
          present: cancelledPlanets.length > 0,
          involvedPlanets: cancelledPlanets.length > 0
            ? [...new Set([...cancelledPlanets, ...details.map(d => d.cancelledBy)])]
            : [],
          customData: cancelledPlanets.length > 0
            ? { cancelledPlanets: details, count: cancelledPlanets.length }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { count?: number } | undefined;
      const count = data?.count ?? 0;

      // Neechabhanga in D9 is always significant
      if (count >= 2) return 'Strong';
      // Check if the cancelled planet is also strong in D1
      const d1AlsoStrong = result.involvedPlanets.some(pid => {
        const d = ctx.dignity(pid);
        return d === 'exalted' || d === 'own' || d === 'moolatrikona';
      });
      if (d1AlsoStrong) return 'Strong';
      return 'Moderate';
    },

    affectedDomains: 'all',
    domainImpactWeight: 2,

    formationRule: {
      en: 'A planet debilitated in D9 has its debilitation cancelled — the lord of its D9 debilitation sign is dignified or in a kendra in D1',
      hi: 'D9 में नीच ग्रह का नीचभंग — D9 नीच राशि का स्वामी D1 में गरिमायुक्त या केंद्र में',
    },
    description: {
      en: 'D9 Neechabhanga is a powerful redemptive yoga. A planet that appears debilitated in the Navamsha has its weakness cancelled by the strong placement of the debilitation sign\'s lord. The native transforms spiritual challenges into strengths — initial difficulties in the planet\'s domain lead to eventual mastery. This yoga is especially significant for Raja Yoga results when combined with D1 strength.',
      hi: 'D9 नीचभंग एक शक्तिशाली उपचारात्मक योग है। नवमांश में नीच दिखने वाले ग्रह की कमज़ोरी नीच राशि के स्वामी की मजबूत स्थिति से रद्द हो जाती है। जातक आध्यात्मिक चुनौतियों को शक्तियों में बदलता है — ग्रह के क्षेत्र में शुरुआती कठिनाइयां अंततः निपुणता की ओर ले जाती हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Navamsha Rajayoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Navamsha Rajayoga — Lagna lord exalted in D9 AND in kendra in D1
   *
   * The lagna lord exalted in the navamsha indicates powerful dharmic
   * reinforcement, and its placement in a kendra in D1 ensures that
   * the native can express this elevated potential in the material world.
   * A strong form of Raja Yoga operating through divisional chart strength.
   *
   * Source: BPHS Ch.7; Jataka Parijata
   */
  {
    id: 'navamsha-rajayoga',
    name: { en: 'Navamsha Rajayoga', hi: 'नवमांश राजयोग', sa: 'नवांशराजयोगः' },
    group: 'navamsha',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.7; Jataka Parijata',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lagnaLord = ctx.houseLord(1);
        const longitude = ctx.planetLongitude(lagnaLord);
        const d9Sign = computeNavamshaSign(longitude);
        const exaltSign = EXALTATION_SIGNS[lagnaLord];

        // Lagna lord must be exalted in D9
        if (exaltSign === undefined || d9Sign !== exaltSign) {
          return { present: false, involvedPlanets: [] };
        }

        // Lagna lord must be in a kendra in D1
        const lagnaLordHouse = ctx.planetHouse(lagnaLord);
        if (!ctx.isKendra(lagnaLordHouse)) {
          return { present: false, involvedPlanets: [] };
        }

        return {
          present: true,
          involvedPlanets: [lagnaLord],
          customData: { lagnaLord, d9Sign, d1House: lagnaLordHouse },
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const lagnaLord = result.involvedPlanets[0];
      if (lagnaLord === undefined) return 'Moderate';
      const d1Dignity = ctx.dignity(lagnaLord);

      // Exalted in D9 AND strong in D1 = exceptionally strong
      if (d1Dignity === 'exalted' || d1Dignity === 'own' || d1Dignity === 'moolatrikona') return 'Strong';
      // In kendra but weak dignity = moderate
      if (d1Dignity === 'debilitated') return 'Weak';
      return 'Moderate';
    },

    affectedDomains: ['career', 'wealth'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Lagna lord exalted in Navamsha (D9) AND placed in a kendra (1/4/7/10) in the Rashi (D1) chart',
      hi: 'लग्नेश नवमांश (D9) में उच्च और राशि (D1) चार्ट में केन्द्र (1/4/7/10) में स्थित',
    },
    description: {
      en: 'Navamsha Rajayoga is a potent combination linking D1 angular strength with D9 exaltation. The lagna lord — the chart\'s most personal planet — is doubly empowered: exalted at the dharmic/soul level (D9) and positioned for maximum worldly impact (D1 kendra). The native rises to positions of authority and influence with dharmic purpose. This is a strongly career- and wealth-enhancing yoga.',
      hi: 'नवमांश राजयोग D1 केन्द्र बल और D9 उच्च को जोड़ने वाला शक्तिशाली संयोजन है। लग्नेश — कुंडली का सबसे व्यक्तिगत ग्रह — दोगुना सशक्त है: आत्मिक स्तर (D9) पर उच्च और अधिकतम सांसारिक प्रभाव (D1 केन्द्र) के लिए स्थित। जातक धार्मिक उद्देश्य के साथ अधिकार और प्रभाव के पदों पर पहुँचता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 9. D9 Neechabhanga Saturn
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * D9 Neechabhanga Saturn — Saturn debilitated in D9 with cancellation
   *
   * Saturn debilitated in Aries in D9, but the sign lord (Mars) is strong
   * in D1 (own/exalted/moolatrikona or in a kendra). Saturn's D9 debilitation
   * is cancelled, turning restrictions into eventual success through persistence.
   * Specific to Saturn because of its karmic significance.
   *
   * Source: BPHS Ch.28; Phaladeepika
   */
  {
    id: 'd9-neechabhanga-saturn',
    name: { en: 'D9 Neechabhanga Saturn', hi: 'D9 नीचभंग शनि', sa: 'नवांशनीचभङ्गशनिः' },
    group: 'navamsha',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.28; Phaladeepika',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Saturn (6) must be debilitated in D9 (Aries = sign 1)
        const saturnLongitude = ctx.planetLongitude(6);
        const d9Sign = computeNavamshaSign(saturnLongitude);
        const saturnDebilSign = DEBILITATION_SIGNS[6]; // Aries = 1

        if (saturnDebilSign === undefined || d9Sign !== saturnDebilSign) {
          return { present: false, involvedPlanets: [] };
        }

        // Sign lord of Aries is Mars (2) — Mars must be strong in D1
        const marsId = 2; // Mars = SIGN_LORDS[1]
        const marsDignity = ctx.dignity(marsId);
        const marsInKendra = ctx.isKendra(ctx.planetHouse(marsId));

        const marsStrong =
          marsDignity === 'exalted' ||
          marsDignity === 'own' ||
          marsDignity === 'moolatrikona' ||
          marsInKendra;

        if (!marsStrong) {
          return { present: false, involvedPlanets: [] };
        }

        return {
          present: true,
          involvedPlanets: [6, marsId],
          customData: { d9Sign, marsDignity, marsHouse: ctx.planetHouse(marsId) },
        };
      },
    },

    assessStrength: (ctx: YogaContext) => {
      // Mars exalted in D1 (Capricorn) = strongest cancellation
      const marsDignity = ctx.dignity(2);
      if (marsDignity === 'exalted') return 'Strong';
      if (marsDignity === 'own' || marsDignity === 'moolatrikona') return 'Strong';
      // Mars in kendra but neutral dignity
      return 'Moderate';
    },

    affectedDomains: ['career'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Saturn debilitated in D9 (Aries) with cancellation — Mars (sign lord) strong in D1 (own/exalted or in kendra)',
      hi: 'शनि D9 में नीच (मेष) परंतु नीचभंग — मंगल (राशि स्वामी) D1 में बलवान (स्वराशि/उच्च या केन्द्र में)',
    },
    description: {
      en: 'D9 Neechabhanga Saturn specifically addresses Saturn\'s karmic debilitation in the navamsha being cancelled by a strong Mars in D1. Saturn debilitated in D9 Aries suggests spiritual lessons around patience, authority, and structure feel burdensome at the soul level. Mars\'s D1 strength provides the courage and decisive action needed to overcome these karmic blocks. The native earns career success through perseverance, transforming Saturn\'s delays into durable achievements.',
      hi: 'D9 नीचभंग शनि विशेष रूप से नवमांश में शनि के कार्मिक नीच को D1 में बलवान मंगल द्वारा रद्द करने का संकेत देता है। D9 मेष में शनि नीच होने पर धैर्य और अधिकार के आध्यात्मिक पाठ बोझिल लगते हैं। मंगल की D1 शक्ति इन कार्मिक बाधाओं को पार करने का साहस प्रदान करती है। जातक दृढ़ता से करियर में सफलता अर्जित करता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 10. D9 Atmakaraka Strength
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * D9 Atmakaraka Strength — Atmakaraka in own/exalted sign in D9
   *
   * The Atmakaraka (planet with highest degree in any sign) represents
   * the soul's deepest desire. When this planet occupies its own or
   * exalted sign in the Navamsha, the soul's purpose is strongly
   * supported at the dharmic level — the Karakamsha is powerful.
   *
   * Source: Jaimini Sutras; BPHS Ch.32-33
   */
  {
    id: 'd9-atmakaraka-strength',
    name: { en: 'D9 Atmakaraka Strength', hi: 'D9 आत्मकारक बल', sa: 'नवांशात्मकारकबलम्' },
    group: 'navamsha',
    isAuspicious: true,
    classicalRef: 'Jaimini Sutras; BPHS Ch.32-33',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Find Atmakaraka: planet with highest degree in its sign (Sun through Saturn only)
        // Per Jaimini: use Sun(0) through Saturn(6), optionally Rahu(7)
        let akId = 0;
        let maxDeg = -1;
        for (let pid = 0; pid <= 6; pid++) {
          const deg = ctx.planetDegreeInSign(pid);
          if (deg > maxDeg) {
            maxDeg = deg;
            akId = pid;
          }
        }

        // Check Atmakaraka's D9 sign
        const akLongitude = ctx.planetLongitude(akId);
        const d9Sign = computeNavamshaSign(akLongitude);

        // Check if AK is in own or exalted sign in D9
        const exaltSign = EXALTATION_SIGNS[akId];
        const ownSigns: number[] = [];

        // Determine own signs from SIGN_LORDS (reverse lookup)
        for (let s = 1; s <= 12; s++) {
          if (SIGN_LORDS[s] === akId) ownSigns.push(s);
        }

        const isExaltedInD9 = exaltSign !== undefined && d9Sign === exaltSign;
        const isOwnInD9 = ownSigns.includes(d9Sign);

        if (!isExaltedInD9 && !isOwnInD9) {
          return { present: false, involvedPlanets: [] };
        }

        return {
          present: true,
          involvedPlanets: [akId],
          customData: {
            atmakaraka: akId,
            atmakarakaDegree: maxDeg,
            d9Sign,
            d9Dignity: isExaltedInD9 ? 'exalted' : 'own',
          },
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { d9Dignity?: string } | undefined;
      const akId = result.involvedPlanets[0];
      if (akId === undefined) return 'Moderate';

      const d1Dignity = ctx.dignity(akId);
      const d9Exalted = data?.d9Dignity === 'exalted';

      // Exalted in D9 + strong in D1 = very strong
      if (d9Exalted && (d1Dignity === 'exalted' || d1Dignity === 'own')) return 'Strong';
      if (d9Exalted) return 'Strong';
      // Own sign in D9 = moderate to strong
      if (d1Dignity === 'exalted' || d1Dignity === 'own') return 'Strong';
      return 'Moderate';
    },

    affectedDomains: ['spiritual'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Atmakaraka (planet with highest degree) in own or exalted sign in Navamsha (D9) — the soul\'s purpose is strongly supported',
      hi: 'आत्मकारक (सबसे अधिक अंश वाला ग्रह) नवमांश (D9) में स्वराशि या उच्च राशि में — आत्मा का उद्देश्य दृढ़ता से समर्थित',
    },
    description: {
      en: 'D9 Atmakaraka Strength indicates that the soul\'s deepest desire (represented by the Atmakaraka — the planet with the highest degree) is powerfully supported at the dharmic level. The Karakamsha (Atmakaraka\'s D9 sign) being strong means the native\'s spiritual evolution is well-directed. Life circumstances naturally align with the soul\'s purpose. This is particularly significant in Jaimini astrology where the Atmakaraka governs the soul\'s karmic journey.',
      hi: 'D9 आत्मकारक बल दर्शाता है कि आत्मा की सबसे गहरी इच्छा (आत्मकारक — सबसे अधिक अंश वाला ग्रह) धार्मिक स्तर पर शक्तिशाली रूप से समर्थित है। कारकांश (आत्मकारक की D9 राशि) का बलवान होना जातक के आध्यात्मिक विकास की सुदिशा का संकेत देता है। जीवन की परिस्थितियां स्वाभाविक रूप से आत्मा के उद्देश्य के अनुरूप होती हैं।',
    },
  },
];
