/**
 * Chandra (Moon) Yoga Rules
 *
 * Moon-based yogas from Phaladeepika Ch.6. These define how the Moon's
 * neighbourhood — planets adjacent to, opposing, or aspecting the Moon —
 * affects the native's fortune, wealth, and mental disposition.
 *
 * Many of these yogas are measured "from Moon" (Moon's house as the reference
 * point). For such yogas we use CustomCondition since the evaluator's
 * HouseCondition with fromLagna=false counts planet offset from Moon, which
 * is correct. However, some yogas (like Kemadruma) require checking multiple
 * conditions about Moon's neighbourhood that are cleaner as custom logic.
 *
 * Expected frequencies (Lesson T):
 * - Gajakesari: ~25% (Jupiter in kendra from Moon — common)
 * - Sunapha: ~50% (any planet in 2nd from Moon — very common)
 * - Anapha: ~50% (any planet in 12th from Moon — very common)
 * - Durdhara: ~30% (planets in both 2nd and 12th from Moon)
 * - Kemadruma: ~5% (no planets in 2nd/12th/kendra from Moon — rare)
 * - Chandra-Mangala: ~8% (Moon-Mars conjunction)
 * - Shakata: ~17% (Moon in 6/8/12 from Jupiter)
 * - Adhi: ~2% (benefics in 6th/7th/8th from Moon — rare)
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';
import { houseFrom } from '../utils';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: planets eligible for Sunapha/Anapha/Durdhara/Kemadruma
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Planets considered for Moon-neighbourhood yogas (Sunapha, Anapha, Durdhara, Kemadruma).
 * Per Phaladeepika Ch.6: Sun, Rahu, and Ketu are excluded.
 * Only Mars (2), Mercury (3), Jupiter (4), Venus (5), Saturn (6) count.
 */
const ELIGIBLE_PLANET_IDS = [2, 3, 4, 5, 6];

/**
 * Get eligible planet IDs in a specific house.
 * Filters to ELIGIBLE_PLANET_IDS (excludes Sun, Moon, Rahu, Ketu).
 */
function eligiblePlanetsInHouse(ctx: YogaContext, house: number): number[] {
  return ctx.planetsInHouse(house).filter(id => ELIGIBLE_PLANET_IDS.includes(id));
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Sunapha Yoga — planet(s) in 2nd from Moon
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sunapha Yoga — Phaladeepika Ch.6 v.3
 *
 * Formation: Any planet except Sun, Rahu, or Ketu in the 2nd house from Moon.
 *
 * Results: Self-made wealth. The native earns through their own effort and
 * intelligence, not through inheritance or patronage. Good financial sense.
 */
const SUNAPHA: YogaRule = {
  id: 'sunapha',
  name: { en: 'Sunapha', hi: 'सुनफा', sa: 'सुनफा' },
  group: 'chandra',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.6 v.3',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const moonHouse = ctx.planetHouse(1); // 1 = Moon
      const secondFromMoon = houseFrom(moonHouse, 2);
      const planets = eligiblePlanetsInHouse(ctx, secondFromMoon);
      return {
        present: planets.length > 0,
        involvedPlanets: [1, ...planets], // Moon + forming planets
      };
    },
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
    // Stronger with benefics (Jupiter/Venus/Mercury) in 2nd from Moon
    const beneficCount = result.involvedPlanets
      .filter(id => id !== 1) // exclude Moon itself
      .filter(id => ctx.isNaturalBenefic(id)).length;
    if (beneficCount >= 2) return 'Strong';
    if (beneficCount >= 1) return 'Moderate';
    return 'Weak'; // Only malefics in 2nd from Moon
  },

  affectedDomains: ['wealth'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'A planet (excluding Sun, Rahu, Ketu) occupies the 2nd house from Moon.',
    hi: 'चन्द्रमा से दूसरे भाव में कोई ग्रह (सूर्य, राहु, केतु को छोड़कर) स्थित है।',
  },

  description: {
    en: 'Sunapha Yoga indicates self-made wealth and financial independence. The native builds prosperity through personal effort and intelligence rather than inheritance. They possess good financial judgement and earn respect through their own achievements.',
    hi: 'सुनफा योग स्वयं के प्रयास से धन और आर्थिक स्वतंत्रता का संकेत देता है। जातक विरासत के बजाय व्यक्तिगत प्रयास और बुद्धि से समृद्धि बनाता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Anapha Yoga — planet(s) in 12th from Moon
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Anapha Yoga — Phaladeepika Ch.6 v.4
 *
 * Formation: Any planet except Sun, Rahu, or Ketu in the 12th house from Moon.
 *
 * Results: Virtue, fame, and a good reputation. The native is well-spoken,
 * healthy, and free from major vices. Known for generosity and moral conduct.
 */
const ANAPHA: YogaRule = {
  id: 'anapha',
  name: { en: 'Anapha', hi: 'अनफा', sa: 'अनफा' },
  group: 'chandra',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.6 v.4',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const moonHouse = ctx.planetHouse(1);
      const twelfthFromMoon = houseFrom(moonHouse, 12);
      const planets = eligiblePlanetsInHouse(ctx, twelfthFromMoon);
      return {
        present: planets.length > 0,
        involvedPlanets: [1, ...planets],
      };
    },
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
    const beneficCount = result.involvedPlanets
      .filter(id => id !== 1)
      .filter(id => ctx.isNaturalBenefic(id)).length;
    if (beneficCount >= 2) return 'Strong';
    if (beneficCount >= 1) return 'Moderate';
    return 'Weak';
  },

  affectedDomains: ['wealth'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'A planet (excluding Sun, Rahu, Ketu) occupies the 12th house from Moon.',
    hi: 'चन्द्रमा से बारहवें भाव में कोई ग्रह (सूर्य, राहु, केतु को छोड़कर) स्थित है।',
  },

  description: {
    en: 'Anapha Yoga bestows virtue, fame, and a sound reputation. The native is well-mannered, generous, and commands respect in their community. They enjoy good health and are known for moral integrity.',
    hi: 'अनफा योग सद्गुण, यश और अच्छी प्रतिष्ठा प्रदान करता है। जातक शिष्ट, उदार और अपने समुदाय में सम्मानित होता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Durdhara Yoga — planets in BOTH 2nd and 12th from Moon
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Durdhara Yoga — Phaladeepika Ch.6 v.5
 *
 * Formation: Eligible planets in BOTH the 2nd AND 12th houses from Moon.
 * This combines and amplifies the effects of Sunapha and Anapha.
 *
 * Results: Wealth, generosity, vehicles, enjoyments. The native is blessed
 * with both material success and moral virtue — a rare combination.
 */
const DURDHARA: YogaRule = {
  id: 'durdhara',
  name: { en: 'Durdhara', hi: 'दुर्धरा', sa: 'दुर्धरा' },
  group: 'chandra',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.6 v.5',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const moonHouse = ctx.planetHouse(1);
      const secondFromMoon = houseFrom(moonHouse, 2);
      const twelfthFromMoon = houseFrom(moonHouse, 12);
      const inSecond = eligiblePlanetsInHouse(ctx, secondFromMoon);
      const inTwelfth = eligiblePlanetsInHouse(ctx, twelfthFromMoon);
      const present = inSecond.length > 0 && inTwelfth.length > 0;
      return {
        present,
        involvedPlanets: present ? [1, ...inSecond, ...inTwelfth] : [],
      };
    },
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
    // Stronger when benefics flank Moon on both sides
    const formingPlanets = result.involvedPlanets.filter(id => id !== 1);
    const beneficCount = formingPlanets.filter(id => ctx.isNaturalBenefic(id)).length;
    if (beneficCount >= 3) return 'Strong';
    if (beneficCount >= 1) return 'Moderate';
    return 'Weak';
  },

  affectedDomains: ['wealth'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'Planets (excluding Sun, Rahu, Ketu) occupy both the 2nd and 12th houses from Moon.',
    hi: 'चन्द्रमा से दूसरे और बारहवें दोनों भावों में ग्रह (सूर्य, राहु, केतु को छोड़कर) स्थित हैं।',
  },

  description: {
    en: 'Durdhara Yoga combines the effects of Sunapha and Anapha — the Moon is flanked by planets on both sides. This grants both wealth and virtue: material success paired with generosity and moral standing. The native enjoys vehicles, comforts, and a respected position in society.',
    hi: 'दुर्धरा योग सुनफा और अनफा दोनों के प्रभावों को संयुक्त करता है — चन्द्रमा दोनों ओर से ग्रहों से घिरा है। यह धन और सद्गुण दोनों प्रदान करता है। जातक वाहन, सुख-सुविधाओं और समाज में सम्मानित स्थिति का आनंद लेता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Kemadruma Yoga — no planets in 2nd/12th/kendra from Moon
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Kemadruma Yoga — Phaladeepika Ch.6 v.8
 *
 * Formation: NO eligible planet in the 2nd or 12th from Moon, AND no planet
 * in a kendra from Moon. The Moon is completely isolated.
 *
 * Results: Poverty, hardship, menial work, loneliness, mental suffering.
 * This is one of the most feared inauspicious yogas.
 *
 * Cancellations (any ONE cancels the yoga entirely):
 * 1. Moon in kendra from Lagna (Moon itself is strong by position)
 * 2. Moon aspected by Jupiter (Jupiter's benefic gaze protects)
 * 3. Moon conjunct any planet (Moon is not truly isolated)
 * 4. Moon in own sign (Cancer) or exalted (Taurus) — inherent strength
 */
const KEMADRUMA: YogaRule = {
  id: 'kemadruma',
  name: { en: 'Kemadruma', hi: 'केमद्रुम', sa: 'केमद्रुमम्' },
  group: 'chandra',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.6 v.8',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const moonHouse = ctx.planetHouse(1);
      const secondFromMoon = houseFrom(moonHouse, 2);
      const twelfthFromMoon = houseFrom(moonHouse, 12);

      // Check 2nd and 12th from Moon for eligible planets
      const inSecond = eligiblePlanetsInHouse(ctx, secondFromMoon);
      const inTwelfth = eligiblePlanetsInHouse(ctx, twelfthFromMoon);

      if (inSecond.length > 0 || inTwelfth.length > 0) {
        return { present: false, involvedPlanets: [] };
      }

      // Check kendras from Moon (1st/4th/7th/10th from Moon)
      const kendraOffsets = [1, 4, 7, 10]; // offset 1 = Moon's own house
      for (const offset of kendraOffsets) {
        const kendraHouse = houseFrom(moonHouse, offset);
        const planets = ctx.planetsInHouse(kendraHouse)
          .filter(id => id !== 1 && id !== 7 && id !== 8); // exclude Moon itself, Rahu, Ketu
        if (planets.length > 0) {
          return { present: false, involvedPlanets: [] };
        }
      }

      // Moon is truly isolated — Kemadruma is present
      return { present: true, involvedPlanets: [1] };
    },
  },

  assessStrength: (ctx: YogaContext, _result: YogaDetectionResult) => {
    // Kemadruma severity depends on Moon's own strength
    const moonDignity = ctx.dignity(1);
    // If Moon is in a friend's sign, the isolation is less severe
    if (moonDignity === 'friend') return 'Weak';
    // Moon in neutral sign — moderate impact
    if (moonDignity === 'neutral') return 'Moderate';
    // Moon in enemy/debilitated sign — full severity
    return 'Strong';
  },

  cancellations: [
    {
      condition: {
        type: 'planet_in_house',
        planetId: 1, // Moon
        houses: [1, 4, 7, 10],
        fromLagna: true,
      },
      reason: {
        en: 'Moon is in a kendra from Lagna, giving it positional strength that cancels Kemadruma.',
        hi: 'चन्द्रमा लग्न से केन्द्र में है, जो स्थिति बल प्रदान करके केमद्रुम को निरस्त करता है।',
      },
      effect: 'cancel',
    },
    {
      condition: {
        type: 'custom',
        detect: (ctx: YogaContext) => {
          // Jupiter aspects Moon's house — benefic protection
          const moonHouse = ctx.planetHouse(1);
          const jupiterAspects = ctx.doesAspect(4, moonHouse); // 4 = Jupiter
          return { present: jupiterAspects, involvedPlanets: jupiterAspects ? [4] : [] };
        },
      },
      reason: {
        en: 'Jupiter aspects Moon, providing benefic protection that cancels Kemadruma.',
        hi: 'गुरु चन्द्रमा को दृष्टि देता है, जो शुभ सुरक्षा प्रदान करके केमद्रुम को निरस्त करता है।',
      },
      effect: 'cancel',
    },
    // NOTE: "Moon conjunct any planet" cancellation removed — the detection logic
    // already handles this case: conjunction = offset 1 from Moon = in Moon's own
    // house = kendra check catches it. Adding it as a separate cancellation was dead code.
    {
      condition: {
        type: 'planet_dignity',
        planetId: 1, // Moon
        dignities: ['own', 'exalted'],
      },
      reason: {
        en: 'Moon is in its own sign (Cancer) or exalted (Taurus), providing inherent strength that cancels Kemadruma.',
        hi: 'चन्द्रमा अपनी राशि (कर्क) या उच्च राशि (वृषभ) में है, जो स्वाभाविक बल से केमद्रुम को निरस्त करता है।',
      },
      effect: 'cancel',
    },
  ],

  affectedDomains: 'all',
  domainImpactWeight: 3,

  formationRule: {
    en: 'No planet (except Sun, Rahu, Ketu) in the 2nd, 12th, or any kendra from Moon. The Moon is completely isolated.',
    hi: 'चन्द्रमा से 2, 12 या किसी भी केन्द्र में कोई ग्रह (सूर्य, राहु, केतु को छोड़कर) नहीं है। चन्द्रमा पूर्णतः एकाकी है।',
  },

  description: {
    en: 'Kemadruma Yoga indicates hardship, financial struggle, and a sense of isolation. The Moon — ruler of the mind — receives no planetary support, leaving the native vulnerable to anxiety, poverty, and lack of stable relationships. However, this yoga has many cancellation conditions, and if even one applies, the negative effects are fully neutralised.',
    hi: 'केमद्रुम योग कठिनाई, आर्थिक संघर्ष और एकाकीपन का संकेत देता है। चन्द्रमा — मन का स्वामी — को कोई ग्रह सहयोग नहीं मिलता। हालांकि, इस योग के कई निरस्तीकरण नियम हैं, और यदि एक भी लागू हो तो नकारात्मक प्रभाव पूर्णतः समाप्त हो जाते हैं।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. Gajakesari Yoga — Jupiter in kendra from Moon
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gajakesari Yoga — Phaladeepika Ch.6 v.1
 *
 * Formation: Jupiter in a kendra (1st/4th/7th/10th) from Moon.
 *
 * Results: Fame, wealth, lasting reputation, many supporters.
 * The native is like a lion among elephants — their presence commands
 * attention and their achievements endure beyond their lifetime.
 *
 * This is one of the most commonly found auspicious yogas (~25% of charts).
 *
 * Cancellations per classical texts:
 * - Jupiter combust — burned by Sun's proximity, cannot deliver results
 * - Jupiter in enemy sign — weakened, yoga is diluted
 * - Jupiter debilitated — too weak to produce Gajakesari effects
 */
const GAJAKESARI: YogaRule = {
  id: 'gajakesari',
  name: { en: 'Gajakesari', hi: 'गजकेसरी', sa: 'गजकेसरी' },
  group: 'chandra',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.6 v.1',

  conditions: {
    type: 'planet_in_house',
    planetId: 4, // Jupiter
    houses: [1, 4, 7, 10], // kendra from Moon
    fromLagna: false, // counted from Moon
  },

  assessStrength: (ctx: YogaContext, _result: YogaDetectionResult) => {
    const jupDignity = ctx.dignity(4);
    const jupCombust = ctx.isCombust(4);

    // Combust Jupiter — weakened significantly
    if (jupCombust) return 'Weak';

    // Jupiter exalted or in own sign — peak Gajakesari
    if (jupDignity === 'exalted' || jupDignity === 'own' || jupDignity === 'moolatrikona') {
      return 'Strong';
    }

    // Jupiter in friend's sign — solid
    if (jupDignity === 'friend') return 'Moderate';

    // Jupiter in neutral/enemy — present but diluted
    return 'Weak';
  },

  cancellations: [
    {
      condition: { type: 'combust', planetId: 4, isCombust: true },
      reason: {
        en: 'Jupiter is combust (too close to Sun), severely weakening Gajakesari Yoga.',
        hi: 'गुरु अस्त है (सूर्य के बहुत निकट), जिससे गजकेसरी योग अत्यंत कमजोर होता है।',
      },
      effect: 'weaken',
    },
    {
      condition: { type: 'planet_dignity', planetId: 4, dignities: ['enemy'] },
      reason: {
        en: 'Jupiter is in an enemy sign, reducing the potency of Gajakesari Yoga.',
        hi: 'गुरु शत्रु राशि में है, जिससे गजकेसरी योग की शक्ति कम होती है।',
      },
      effect: 'weaken',
    },
    {
      condition: { type: 'planet_dignity', planetId: 4, dignities: ['debilitated'] },
      reason: {
        en: 'Jupiter is debilitated (in Capricorn), making Gajakesari Yoga ineffective.',
        hi: 'गुरु नीच (मकर) में है, जिससे गजकेसरी योग निष्प्रभावी हो जाता है।',
      },
      effect: 'cancel',
    },
  ],

  affectedDomains: ['education', 'wealth', 'children', 'career'],
  domainImpactWeight: 3,

  formationRule: {
    en: 'Jupiter is in a kendra (1st/4th/7th/10th) from Moon.',
    hi: 'गुरु चन्द्रमा से केन्द्र (1/4/7/10) में स्थित है।',
  },

  description: {
    en: 'Gajakesari Yoga — "the lion among elephants" — is one of the most celebrated yogas. It bestows fame that outlasts the native\'s lifetime, wealth through wisdom, many supporters and well-wishers, and success in education and advisory roles. The native commands natural authority and is remembered for their contributions.',
    hi: 'गजकेसरी योग — "हाथियों में सिंह" — सबसे प्रसिद्ध योगों में से एक है। यह जीवनकाल से परे यश, ज्ञान से धन, अनेक समर्थक और शिक्षा में सफलता प्रदान करता है। जातक स्वाभाविक अधिकार रखता है और अपने योगदान के लिए स्मरणीय होता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. Chandra-Mangala Yoga — Moon conjunct Mars
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Chandra-Mangala Yoga — Phaladeepika Ch.6 v.6
 *
 * Formation: Moon and Mars in the same house (conjunction).
 *
 * Results: Wealth, but through questionable or aggressive means. The native
 * may earn through speculation, risky ventures, or manipulation. Strong
 * emotional drive. When in kendras or trikonas, results are more positive.
 */
const CHANDRA_MANGALA: YogaRule = {
  id: 'chandra-mangala',
  name: { en: 'Chandra-Mangala', hi: 'चन्द्र-मंगल', sa: 'चन्द्रमङ्गलम्' },
  group: 'chandra',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.6 v.6',

  conditions: {
    type: 'conjunction',
    planet1: 1, // Moon
    planet2: 2, // Mars
  },

  assessStrength: (ctx: YogaContext, _result: YogaDetectionResult) => {
    const moonHouse = ctx.planetHouse(1);
    // Stronger in kendras (1/4/7/10) or trikonas (1/5/9)
    if (ctx.isKendra(moonHouse) || ctx.isTrikona(moonHouse)) return 'Strong';
    // Weaker in dusthanas (6/8/12)
    if (ctx.isDusthana(moonHouse)) return 'Weak';
    return 'Moderate';
  },

  affectedDomains: ['wealth', 'marriage'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'Moon and Mars are conjunct (in the same house).',
    hi: 'चन्द्रमा और मंगल एक ही भाव में युति में हैं।',
  },

  description: {
    en: 'Chandra-Mangala Yoga indicates wealth acquired through bold, sometimes aggressive means. The native has a powerful emotional drive and excels in competitive, high-stakes environments — trading, real estate, entrepreneurship. When placed in kendras or trikonas, the wealth comes through more legitimate channels. In dusthanas, the methods may be questionable.',
    hi: 'चन्द्र-मंगल योग साहसिक, कभी-कभी आक्रामक तरीकों से धन अर्जन का संकेत देता है। जातक में शक्तिशाली भावनात्मक प्रेरणा होती है और प्रतिस्पर्धी वातावरण — व्यापार, अचल संपत्ति, उद्यमिता में उत्कृष्ट होता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. Shakata Yoga — Moon in 6th, 8th, or 12th from Jupiter
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shakata Yoga — Phaladeepika Ch.6 v.7
 *
 * Formation: Moon in the 6th, 8th, or 12th house from Jupiter.
 * "Shakata" means "cart wheel" — fortune rises and falls cyclically.
 *
 * Results: Fluctuating fortunes, instability. The native experiences
 * alternating periods of success and failure. Loss of wealth and position
 * followed by recovery — a perpetual cycle.
 *
 * Cancellation: Moon in kendra from Lagna cancels Shakata.
 */
const SHAKATA: YogaRule = {
  id: 'shakata',
  name: { en: 'Shakata', hi: 'शकट', sa: 'शकटम्' },
  group: 'chandra',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.6 v.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const jupiterHouse = ctx.planetHouse(4); // 4 = Jupiter
      const moonHouse = ctx.planetHouse(1);    // 1 = Moon
      // House offset from Jupiter to Moon
      const offset = ctx.houseOffset(jupiterHouse, moonHouse);
      // Moon in 6th, 8th, or 12th from Jupiter
      const present = offset === 6 || offset === 8 || offset === 12;
      return {
        present,
        involvedPlanets: present ? [1, 4] : [],
      };
    },
  },

  assessStrength: (ctx: YogaContext, _result: YogaDetectionResult) => {
    // More severe when Moon is also weak by dignity
    const moonDignity = ctx.dignity(1);
    if (moonDignity === 'debilitated' || moonDignity === 'enemy') return 'Strong';
    if (moonDignity === 'neutral') return 'Moderate';
    return 'Weak'; // Moon in friend/own/exalted — less severe
  },

  cancellations: [
    {
      condition: {
        type: 'planet_in_house',
        planetId: 1, // Moon
        houses: [1, 4, 7, 10],
        fromLagna: true,
      },
      reason: {
        en: 'Moon is in a kendra from Lagna, providing positional strength that cancels Shakata Yoga.',
        hi: 'चन्द्रमा लग्न से केन्द्र में है, जो स्थिति बल प्रदान करके शकट योग को निरस्त करता है।',
      },
      effect: 'cancel',
    },
  ],

  affectedDomains: ['wealth'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'Moon is in the 6th, 8th, or 12th house from Jupiter.',
    hi: 'चन्द्रमा गुरु से 6, 8 या 12वें भाव में स्थित है।',
  },

  description: {
    en: 'Shakata Yoga — named after a cart wheel that endlessly rotates — causes fluctuating fortunes. The native experiences cycles of gain and loss, rising and falling in status. Wealth and position are never stable. However, if Moon is in a kendra from the ascendant, this yoga is fully cancelled.',
    hi: 'शकट योग — अनंत घूमने वाले गाड़ी के पहिये के नाम पर — अस्थिर भाग्य का कारण बनता है। जातक लाभ और हानि, उत्थान और पतन के चक्र का अनुभव करता है। हालांकि, यदि चन्द्रमा लग्न से केन्द्र में हो तो यह योग पूर्णतः निरस्त हो जाता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. Adhi Yoga — natural benefics in 6th, 7th, 8th from Moon
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Adhi Yoga — Phaladeepika Ch.6 v.10
 *
 * Formation: Natural benefics (Mercury, Jupiter, Venus) in the 6th, 7th,
 * AND 8th houses from Moon. All three houses must have at least one benefic.
 *
 * Results: Great authority, ministerial or royal position, command over
 * others, polite and virtuous, long-lived. This is a rare and powerful yoga.
 *
 * Note: Some texts say benefics in ANY of 6th/7th/8th (partial Adhi).
 * We follow the strict definition: all three houses must be occupied.
 */
const ADHI: YogaRule = {
  id: 'adhi',
  name: { en: 'Adhi', hi: 'अधि', sa: 'अधियोगः' },
  group: 'chandra',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.6 v.10',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const moonHouse = ctx.planetHouse(1);
      const house6 = houseFrom(moonHouse, 6);
      const house7 = houseFrom(moonHouse, 7);
      const house8 = houseFrom(moonHouse, 8);

      // Natural benefics: Mercury (3), Jupiter (4), Venus (5)
      // Moon (1) is also a natural benefic but is the reference point here
      const beneficIds = [3, 4, 5];

      const beneficsIn6 = ctx.planetsInHouse(house6).filter(id => beneficIds.includes(id));
      const beneficsIn7 = ctx.planetsInHouse(house7).filter(id => beneficIds.includes(id));
      const beneficsIn8 = ctx.planetsInHouse(house8).filter(id => beneficIds.includes(id));

      // All three houses must have at least one natural benefic
      const present = beneficsIn6.length > 0 && beneficsIn7.length > 0 && beneficsIn8.length > 0;

      return {
        present,
        involvedPlanets: present ? [1, ...beneficsIn6, ...beneficsIn7, ...beneficsIn8] : [],
      };
    },
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
    // Stronger with more benefics and when those benefics are dignified
    const formingBenefics = result.involvedPlanets.filter(id => id !== 1);
    const dignifiedCount = formingBenefics.filter(id => {
      const d = ctx.dignity(id);
      return d === 'exalted' || d === 'own' || d === 'moolatrikona';
    }).length;

    if (formingBenefics.length >= 3 && dignifiedCount >= 2) return 'Strong';
    if (dignifiedCount >= 1) return 'Moderate';
    return 'Weak';
  },

  affectedDomains: ['career', 'wealth'],
  domainImpactWeight: 3,

  formationRule: {
    en: 'Natural benefics (Mercury, Jupiter, Venus) occupy the 6th, 7th, and 8th houses from Moon — all three houses must have at least one benefic.',
    hi: 'प्राकृतिक शुभ ग्रह (बुध, गुरु, शुक्र) चन्द्रमा से 6, 7 और 8वें भावों में — तीनों भावों में कम से कम एक शुभ ग्रह होना चाहिए।',
  },

  description: {
    en: 'Adhi Yoga is a rare and powerful combination that grants ministerial authority, command over people and resources, and lasting influence. The native rises to a position of significant responsibility — government minister, CEO, institutional leader. They are polite yet commanding, virtuous yet pragmatic. This yoga produces individuals who shape the lives of many.',
    hi: 'अधि योग एक दुर्लभ और शक्तिशाली संयोग है जो मंत्री-पद का अधिकार, लोगों और संसाधनों पर नियंत्रण और स्थायी प्रभाव प्रदान करता है। जातक महत्वपूर्ण उत्तरदायित्व के पद तक पहुँचता है। यह योग ऐसे व्यक्तियों का निर्माण करता है जो अनेकों के जीवन को प्रभावित करते हैं।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

/** All 8 Moon-based (Chandra) yoga rules — Phaladeepika Ch.6 */
export const CHANDRA_RULES: YogaRule[] = [
  SUNAPHA,
  ANAPHA,
  DURDHARA,
  KEMADRUMA,
  GAJAKESARI,
  CHANDRA_MANGALA,
  SHAKATA,
  ADHI,
];
