/**
 * Pancha Mahapurusha Yoga Rules
 *
 * The 5 Mahapurusha ("great person") yogas formed when Mars, Mercury, Jupiter,
 * Venus, or Saturn occupies a kendra (1/4/7/10) from the ascendant in its own
 * sign or exaltation sign. Source: BPHS Ch.34 v.2-6.
 *
 * These are among the most precisely defined yogas in classical literature —
 * no ambiguity in conditions. The pattern is identical for all five:
 *   Planet in kendra AND (own sign OR exalted)
 *
 * Expected frequency: each individual yoga ~5-8% of random charts.
 * If detection exceeds ~10%, the condition is too loose (Lesson T).
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Shared strength assessor for all Mahapurusha yogas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Assess strength of a Mahapurusha yoga.
 *
 * Strong:   planet is exalted AND in house 1 or 10 (maximum dig bala)
 * Moderate: planet in own sign in any kendra, OR exalted in house 4 or 7
 * Weak:     conditions met but planet is combust or in planetary war
 *
 * Combustion always downgrades to Weak per BPHS — a combust planet cannot
 * deliver the full Mahapurusha results even if technically in kendra + own/exalted.
 */
function assessMahapurushaStrength(
  planetId: number,
  ctx: YogaContext,
  _result: YogaDetectionResult,
): 'Strong' | 'Moderate' | 'Weak' {
  const dignity = ctx.dignity(planetId);
  const house = ctx.planetHouse(planetId);
  const combust = ctx.isCombust(planetId);

  // Combustion always weakens (BPHS Ch.25)
  if (combust) return 'Weak';

  // Exalted in the strongest kendras (1st = lagna dig bala, 10th = karma sthana)
  if (dignity === 'exalted' && (house === 1 || house === 10)) return 'Strong';

  // Exalted in other kendras, or own sign in any kendra
  if (dignity === 'exalted') return 'Moderate';

  // Own sign in kendra — solid but not peak
  return 'Moderate';
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared cancellation rules for all Mahapurusha yogas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build cancellation rules for a Mahapurusha yoga.
 *
 * Per BPHS Ch.34:
 * - Planet combust (within combustion orb of Sun) weakens the yoga
 * - Lagna lord weak (in dusthana 6/8/12) reduces effectiveness
 *
 * Note: Planetary war (graha yuddha) is not expressible as a simple condition
 * type — it requires degree-level proximity checks. We handle combustion
 * (which is the more common weakener) declaratively.
 */
function buildMahapurushaCancellations(planetId: number) {
  return [
    {
      condition: { type: 'combust' as const, planetId, isCombust: true },
      reason: {
        en: `The yoga-forming planet is combust (too close to Sun), significantly weakening its results.`,
        hi: `योग बनाने वाला ग्रह अस्त है (सूर्य के बहुत निकट), जिससे इसके फल काफी कमजोर होते हैं।`,
      },
      effect: 'weaken' as const,
    },
    {
      condition: {
        type: 'lord_in_house' as const,
        lordOfHouse: 1,
        inHouses: [6, 8, 12],
      },
      reason: {
        en: `Lagna lord is in a dusthana (6th/8th/12th), reducing the yoga's effectiveness.`,
        hi: `लग्न स्वामी दुस्थान (6/8/12) में है, जिससे योग की प्रभावशीलता कम होती है।`,
      },
      effect: 'weaken' as const,
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Ruchaka Yoga — Mars in kendra in own/exalted sign
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ruchaka Yoga — BPHS Ch.34 v.2
 *
 * Formation: Mars in a kendra (1/4/7/10) in own sign (Aries/Scorpio) or
 * exaltation sign (Capricorn).
 *
 * Results: The native is brave, valorous, a commander or leader.
 * Strong physique, ruddy complexion, charitable but fierce in conflict.
 * Success in military, police, surgery, sports, engineering.
 *
 * Mars own signs: Aries (1), Scorpio (8)
 * Mars exaltation: Capricorn (10)
 */
const RUCHAKA: YogaRule = {
  id: 'ruchaka',
  name: { en: 'Ruchaka', hi: 'रुचक', sa: 'रुचकम्' },
  group: 'mahapurusha',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.34 v.2',

  conditions: {
    type: 'and',
    conditions: [
      { type: 'planet_in_house', planetId: 2, houses: [1, 4, 7, 10], fromLagna: true },
      { type: 'planet_dignity', planetId: 2, dignities: ['own', 'exalted'] },
    ],
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) =>
    assessMahapurushaStrength(2, ctx, result),

  cancellations: buildMahapurushaCancellations(2),

  affectedDomains: ['career', 'health'],
  domainImpactWeight: 3,

  formationRule: {
    en: 'Mars is in a kendra (1st/4th/7th/10th house) in its own sign (Aries/Scorpio) or exaltation (Capricorn).',
    hi: 'मंगल केन्द्र (1/4/7/10 भाव) में अपनी राशि (मेष/वृश्चिक) या उच्च राशि (मकर) में है।',
  },

  description: {
    en: 'Ruchaka Yoga bestows courage, physical vitality, and leadership ability. The native excels in competitive fields — military, sports, surgery, engineering. They command respect through action rather than words, and possess a strong, athletic constitution. Success comes through decisive initiative and fearlessness.',
    hi: 'रुचक योग साहस, शारीरिक ऊर्जा और नेतृत्व क्षमता प्रदान करता है। जातक प्रतिस्पर्धात्मक क्षेत्रों — सेना, खेल, शल्य चिकित्सा, इंजीनियरिंग में उत्कृष्ट होता है। वे शब्दों से नहीं बल्कि कार्यों से सम्मान पाते हैं और मजबूत शारीरिक संरचना के धनी होते हैं।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Bhadra Yoga — Mercury in kendra in own/exalted sign
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bhadra Yoga — BPHS Ch.34 v.3
 *
 * Formation: Mercury in a kendra (1/4/7/10) in own sign (Gemini/Virgo) or
 * exaltation sign (Virgo).
 *
 * Results: Intellectual brilliance, eloquence, skill in commerce and trade.
 * The native is learned, handsome, skilled in rhetoric, and long-lived.
 * Success in communication, writing, teaching, business, accounting.
 *
 * Mercury own signs: Gemini (3), Virgo (6)
 * Mercury exaltation: Virgo (6)
 * Note: Virgo qualifies as both own and exalted — Mercury is especially
 * powerful in Virgo (both rulership AND exaltation).
 */
const BHADRA: YogaRule = {
  id: 'bhadra',
  name: { en: 'Bhadra', hi: 'भद्र', sa: 'भद्रम्' },
  group: 'mahapurusha',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.34 v.3',

  conditions: {
    type: 'and',
    conditions: [
      { type: 'planet_in_house', planetId: 3, houses: [1, 4, 7, 10], fromLagna: true },
      // No 'moolatrikona' needed — Mercury in Virgo moolatrikona range is already
      // classified as 'own' by the context's computeDignity(). Matches other 4 yogas.
      { type: 'planet_dignity', planetId: 3, dignities: ['own', 'exalted'] },
    ],
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) =>
    assessMahapurushaStrength(3, ctx, result),

  cancellations: buildMahapurushaCancellations(3),

  affectedDomains: ['education', 'career', 'wealth'],
  domainImpactWeight: 3,

  formationRule: {
    en: 'Mercury is in a kendra (1st/4th/7th/10th house) in its own sign (Gemini/Virgo) or exaltation (Virgo).',
    hi: 'बुध केन्द्र (1/4/7/10 भाव) में अपनी राशि (मिथुन/कन्या) या उच्च राशि (कन्या) में है।',
  },

  description: {
    en: 'Bhadra Yoga grants sharp intellect, eloquence, and commercial acumen. The native excels in fields requiring communication — writing, teaching, trade, accounting, diplomacy. They possess a youthful appearance, quick wit, and the ability to master multiple subjects. Financial success comes through intellectual endeavour rather than physical labour.',
    hi: 'भद्र योग तीव्र बुद्धि, वाक्पटुता और व्यापारिक कुशलता प्रदान करता है। जातक संचार क्षेत्रों — लेखन, शिक्षण, व्यापार, लेखा, कूटनीति में उत्कृष्ट होता है। युवा रूप, तीक्ष्ण बुद्धि और अनेक विषयों में निपुणता प्राप्त होती है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Hamsa Yoga — Jupiter in kendra in own/exalted sign
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hamsa Yoga — BPHS Ch.34 v.4
 *
 * Formation: Jupiter in a kendra (1/4/7/10) in own sign (Sagittarius/Pisces)
 * or exaltation sign (Cancer).
 *
 * Results: Righteous, learned, spiritually inclined, respected by scholars
 * and rulers alike. The native is a natural teacher and guide.
 * Success in education, law, religion, philosophy, advisory roles.
 *
 * Jupiter own signs: Sagittarius (9), Pisces (12)
 * Jupiter exaltation: Cancer (4)
 */
const HAMSA: YogaRule = {
  id: 'hamsa',
  name: { en: 'Hamsa', hi: 'हंस', sa: 'हंसम्' },
  group: 'mahapurusha',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.34 v.4',

  conditions: {
    type: 'and',
    conditions: [
      { type: 'planet_in_house', planetId: 4, houses: [1, 4, 7, 10], fromLagna: true },
      { type: 'planet_dignity', planetId: 4, dignities: ['own', 'exalted'] },
    ],
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) =>
    assessMahapurushaStrength(4, ctx, result),

  cancellations: buildMahapurushaCancellations(4),

  affectedDomains: ['spiritual', 'education', 'children'],
  domainImpactWeight: 3,

  formationRule: {
    en: 'Jupiter is in a kendra (1st/4th/7th/10th house) in its own sign (Sagittarius/Pisces) or exaltation (Cancer).',
    hi: 'गुरु केन्द्र (1/4/7/10 भाव) में अपनी राशि (धनु/मीन) या उच्च राशि (कर्क) में है।',
  },

  description: {
    en: 'Hamsa Yoga blesses the native with wisdom, righteousness, and spiritual depth. They are natural teachers, guides, and counsellors — respected for their learning and ethical conduct. Success in education, law, philosophy, and religious institutions. Children are a source of pride and carry the native\'s legacy forward.',
    hi: 'हंस योग जातक को ज्ञान, धार्मिकता और आध्यात्मिक गहराई प्रदान करता है। वे स्वाभाविक शिक्षक, मार्गदर्शक और परामर्शदाता होते हैं — अपने ज्ञान और नैतिक आचरण के लिए सम्मानित। शिक्षा, कानून, दर्शन और धार्मिक संस्थानों में सफलता मिलती है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Malavya Yoga — Venus in kendra in own/exalted sign
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Malavya Yoga — BPHS Ch.34 v.5
 *
 * Formation: Venus in a kendra (1/4/7/10) in own sign (Taurus/Libra) or
 * exaltation sign (Pisces).
 *
 * Results: Attractive appearance, refined tastes, wealth through luxury goods
 * or the arts. Happy marriage, sensual pleasures, vehicles, fine clothing.
 * Success in arts, fashion, entertainment, hospitality, diplomacy.
 *
 * Venus own signs: Taurus (2), Libra (7)
 * Venus exaltation: Pisces (12)
 */
const MALAVYA: YogaRule = {
  id: 'malavya',
  name: { en: 'Malavya', hi: 'मालव्य', sa: 'मालव्यम्' },
  group: 'mahapurusha',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.34 v.5',

  conditions: {
    type: 'and',
    conditions: [
      { type: 'planet_in_house', planetId: 5, houses: [1, 4, 7, 10], fromLagna: true },
      { type: 'planet_dignity', planetId: 5, dignities: ['own', 'exalted'] },
    ],
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) =>
    assessMahapurushaStrength(5, ctx, result),

  cancellations: buildMahapurushaCancellations(5),

  affectedDomains: ['marriage', 'wealth'],
  domainImpactWeight: 3,

  formationRule: {
    en: 'Venus is in a kendra (1st/4th/7th/10th house) in its own sign (Taurus/Libra) or exaltation (Pisces).',
    hi: 'शुक्र केन्द्र (1/4/7/10 भाव) में अपनी राशि (वृषभ/तुला) या उच्च राशि (मीन) में है।',
  },

  description: {
    en: 'Malavya Yoga grants beauty, artistic talent, and material abundance. The native enjoys luxury, comfortable surroundings, and a harmonious marriage. Success in the arts, fashion, entertainment, hospitality, and diplomacy. Wealth comes through aesthetic sensibility — they instinctively know what people find beautiful and desirable.',
    hi: 'मालव्य योग सुंदरता, कलात्मक प्रतिभा और भौतिक समृद्धि प्रदान करता है। जातक विलासिता, आरामदायक वातावरण और सुखी वैवाहिक जीवन का आनंद लेता है। कला, फैशन, मनोरंजन, आतिथ्य और कूटनीति में सफलता मिलती है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. Shasha Yoga — Saturn in kendra in own/exalted sign
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shasha Yoga — BPHS Ch.34 v.6
 *
 * Formation: Saturn in a kendra (1/4/7/10) in own sign (Capricorn/Aquarius)
 * or exaltation sign (Libra).
 *
 * Results: Authority over servants and workers, administrative power, command
 * of large organisations. The native is disciplined, methodical, and
 * long-lived. Success in government, judiciary, mining, real estate, labour.
 *
 * Saturn own signs: Capricorn (10), Aquarius (11)
 * Saturn exaltation: Libra (7)
 */
const SHASHA: YogaRule = {
  id: 'shasha',
  name: { en: 'Shasha', hi: 'शश', sa: 'शशम्' },
  group: 'mahapurusha',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.34 v.6',

  conditions: {
    type: 'and',
    conditions: [
      { type: 'planet_in_house', planetId: 6, houses: [1, 4, 7, 10], fromLagna: true },
      { type: 'planet_dignity', planetId: 6, dignities: ['own', 'exalted'] },
    ],
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) =>
    assessMahapurushaStrength(6, ctx, result),

  cancellations: buildMahapurushaCancellations(6),

  affectedDomains: ['career', 'health'],
  domainImpactWeight: 3,

  formationRule: {
    en: 'Saturn is in a kendra (1st/4th/7th/10th house) in its own sign (Capricorn/Aquarius) or exaltation (Libra).',
    hi: 'शनि केन्द्र (1/4/7/10 भाव) में अपनी राशि (मकर/कुम्भ) या उच्च राशि (तुला) में है।',
  },

  description: {
    en: 'Shasha Yoga confers discipline, administrative talent, and longevity. The native commands authority in structured environments — government, judiciary, large corporations. They are methodical, patient, and capable of sustained effort over decades. Success comes late but is durable, built on mastery rather than luck.',
    hi: 'शश योग अनुशासन, प्रशासनिक प्रतिभा और दीर्घायु प्रदान करता है। जातक संगठित वातावरण — सरकार, न्यायपालिका, बड़े निगमों में अधिकार प्राप्त करता है। वे व्यवस्थित, धैर्यवान और दशकों तक निरंतर प्रयास करने में सक्षम होते हैं।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

/** All 5 Pancha Mahapurusha Yoga rules — BPHS Ch.34 v.2-6 */
export const MAHAPURUSHA_RULES: YogaRule[] = [
  RUCHAKA,
  BHADRA,
  HAMSA,
  MALAVYA,
  SHASHA,
];
