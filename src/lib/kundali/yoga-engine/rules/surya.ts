/**
 * Surya (Sun) Yoga Rules
 *
 * Sun-based yogas from Phaladeepika Ch.6. These describe how planets
 * adjacent to the Sun (2nd and 12th from Sun) modify the native's
 * career, intelligence, and social standing.
 *
 * Expected frequencies (Lesson T):
 * - Budhaditya: ~15% (Sun-Mercury conjunction is common, but combustion filter reduces it)
 * - Veshi: ~40% (any planet in 2nd from Sun — common)
 * - Vasi: ~40% (any planet in 12th from Sun — common)
 * - Obhayachari: ~20% (planets flanking Sun on both sides)
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';
import { houseFrom, eligiblePlanetsInHouse } from '../utils';

// ─────────────────────────────────────────────────────────────────────────────
// 1. Budhaditya Yoga — Sun conjunct Mercury, Mercury NOT combust
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Budhaditya Yoga — Phaladeepika Ch.6
 *
 * Formation: Sun and Mercury in the same house, BUT Mercury must not be
 * combust (within 3° of Sun). When Mercury is too close to the Sun, it
 * loses its independent signification — the yoga is weakened significantly.
 *
 * Results: Intelligence, eloquence, skill in mathematics and science,
 * oratory ability, fame through intellectual pursuits.
 *
 * Note on combustion: Classical combustion orb for Mercury is 14° (12° if retrograde),
 * but for Budhaditya specifically, texts require Mercury to have sufficient
 * separation (~3°+) from Sun to retain its own identity. Mercury within 3°
 * is "too merged" with Sun to produce the yoga's results.
 */
const BUDHADITYA: YogaRule = {
  id: 'budhaditya',
  name: { en: 'Budhaditya', hi: 'बुधादित्य', sa: 'बुधादित्यम्' },
  group: 'surya',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.6',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const sunHouse = ctx.planetHouse(0);
      const mercuryHouse = ctx.planetHouse(3);

      // Sun and Mercury must be in the same house
      if (sunHouse !== mercuryHouse) {
        return { present: false, involvedPlanets: [] };
      }

      // Mercury must be at least 3° from Sun (not too close / combust for this yoga)
      const sunLng = ctx.planetLongitude(0);
      const mercLng = ctx.planetLongitude(3);
      let separation = Math.abs(sunLng - mercLng);
      // Handle wrap-around at 0°/360°
      if (separation > 180) separation = 360 - separation;

      if (separation < 3) {
        return { present: false, involvedPlanets: [] };
      }

      return {
        present: true,
        involvedPlanets: [0, 3], // Sun, Mercury
        customData: { separationDeg: Math.round(separation * 100) / 100 },
      };
    },
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
    const mercDignity = ctx.dignity(3);
    const sunDignity = ctx.dignity(0);
    const house = ctx.planetHouse(0);
    const separation = (result.customData?.separationDeg as number) || 0;

    // Mercury combust by classical orb (14° / 12° retrograde) — weakened
    if (ctx.isCombust(3)) return 'Weak';

    // Both well-dignified + good house placement + wide separation
    const goodDignity = (d: string) => d === 'exalted' || d === 'own' || d === 'moolatrikona';
    if (goodDignity(mercDignity) && goodDignity(sunDignity) && (ctx.isKendra(house) || ctx.isTrikona(house))) {
      return 'Strong';
    }

    // Wide separation (10°+) and decent dignity
    if (separation >= 10 && (goodDignity(mercDignity) || goodDignity(sunDignity))) {
      return 'Strong';
    }

    // Mercury in friend/neutral — moderate
    if (mercDignity !== 'enemy' && mercDignity !== 'debilitated') return 'Moderate';

    return 'Weak';
  },

  cancellations: [
    {
      condition: {
        type: 'custom',
        detect: (ctx: YogaContext) => {
          // Mercury within 3° of Sun — too close, yoga significantly weakened
          const sunLng = ctx.planetLongitude(0);
          const mercLng = ctx.planetLongitude(3);
          let separation = Math.abs(sunLng - mercLng);
          if (separation > 180) separation = 360 - separation;
          const tooClose = separation < 3;
          return { present: tooClose, involvedPlanets: tooClose ? [0, 3] : [] };
        },
      },
      reason: {
        en: 'Mercury is within 3° of the Sun (deeply combust), losing independent signification — Budhaditya is severely weakened.',
        hi: 'बुध सूर्य से 3° के भीतर है (गहन अस्त), स्वतंत्र फल खो देता है — बुधादित्य अत्यंत कमजोर।',
      },
      effect: 'cancel',
    },
    {
      condition: {
        type: 'lord_in_house',
        lordOfHouse: 1,
        inHouses: [6, 8, 12],
      },
      reason: {
        en: 'Lagna lord in a dusthana (6th/8th/12th) reduces the yoga\'s effectiveness.',
        hi: 'लग्न स्वामी दुस्थान (6/8/12) में है, जिससे योग की प्रभावशीलता कम होती है।',
      },
      effect: 'weaken',
    },
  ],

  affectedDomains: ['education', 'career'],
  domainImpactWeight: 2,
  // G2: Budhaditya primarily affects education/intellect (Saravali Ch.15), career secondary
  domainWeights: { education: 3, career: 2 },

  formationRule: {
    en: 'Sun and Mercury are conjunct in the same house, with Mercury at least 3° from the Sun (not deeply combust).',
    hi: 'सूर्य और बुध एक ही भाव में युति में हैं, बुध सूर्य से कम से कम 3° दूर (गहन अस्त नहीं)।',
  },

  description: {
    en: 'Budhaditya Yoga bestows sharp intelligence, eloquence, and analytical ability. The native excels in education, oratory, writing, and scientific pursuits. They possess a keen mind that can grasp complex subjects quickly and communicate ideas effectively. Success comes through intellectual merit and the ability to articulate clearly.',
    hi: 'बुधादित्य योग तीव्र बुद्धि, वाक्पटुता और विश्लेषणात्मक क्षमता प्रदान करता है। जातक शिक्षा, वक्तृत्व, लेखन और वैज्ञानिक क्षेत्रों में उत्कृष्ट होता है। जटिल विषयों को शीघ्र समझने और विचारों को प्रभावी ढंग से संप्रेषित करने की क्षमता होती है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Veshi Yoga — planet(s) in 2nd from Sun
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Veshi Yoga — Phaladeepika Ch.6 v.11
 *
 * Formation: Any planet except Moon, Rahu, or Ketu in the 2nd house from Sun.
 *
 * Results: Wealth, status, and a good reputation. The native is truthful,
 * generous, and commands respect in society. The specific planet in the 2nd
 * from Sun modifies the results (benefic = better quality wealth).
 */
const VESHI: YogaRule = {
  id: 'veshi',
  name: { en: 'Veshi', hi: 'वेशी', sa: 'वेशी' },
  group: 'surya',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.6 v.11',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const sunHouse = ctx.planetHouse(0);
      const secondFromSun = houseFrom(sunHouse, 2);
      const planets = eligiblePlanetsInHouse(ctx, secondFromSun);
      return {
        present: planets.length > 0,
        involvedPlanets: [0, ...planets],
      };
    },
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
    const formingPlanets = result.involvedPlanets.filter(id => id !== 0);
    const beneficCount = formingPlanets.filter(id => ctx.isNaturalBenefic(id)).length;
    const dignifiedCount = formingPlanets.filter(id => {
      const d = ctx.dignity(id);
      return d === 'exalted' || d === 'own' || d === 'moolatrikona';
    }).length;

    if (beneficCount >= 2 || dignifiedCount >= 1) return 'Strong';
    if (beneficCount >= 1) return 'Moderate';
    return 'Weak';
  },

  affectedDomains: ['wealth', 'career'],
  domainImpactWeight: 1,

  formationRule: {
    en: 'A planet (excluding Moon, Rahu, Ketu) occupies the 2nd house from Sun.',
    hi: 'सूर्य से दूसरे भाव में कोई ग्रह (चन्द्र, राहु, केतु को छोड़कर) स्थित है।',
  },

  description: {
    en: 'Veshi Yoga indicates wealth, social status, and a truthful nature. A planet placed immediately after the Sun supports the native\'s accumulation of resources and reputation. Benefic planets in this position bring wealth through ethical means; malefics bring wealth through authority and assertiveness.',
    hi: 'वेशी योग धन, सामाजिक प्रतिष्ठा और सत्यवादी स्वभाव का संकेत देता है। सूर्य के तुरंत बाद स्थित ग्रह जातक के संसाधन संचय और प्रतिष्ठा का समर्थन करता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Vasi Yoga — planet(s) in 12th from Sun
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vasi Yoga — Phaladeepika Ch.6 v.12
 *
 * Formation: Any planet except Moon, Rahu, or Ketu in the 12th house from Sun.
 *
 * Results: Charitable nature, good reputation, skill in the arts.
 * The native is generous, kind-hearted, and gains through service to others.
 */
const VASI: YogaRule = {
  id: 'vasi',
  name: { en: 'Vasi', hi: 'वासी', sa: 'वासी' },
  group: 'surya',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.6 v.12',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const sunHouse = ctx.planetHouse(0);
      const twelfthFromSun = houseFrom(sunHouse, 12);
      const planets = eligiblePlanetsInHouse(ctx, twelfthFromSun);
      return {
        present: planets.length > 0,
        involvedPlanets: [0, ...planets],
      };
    },
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
    const formingPlanets = result.involvedPlanets.filter(id => id !== 0);
    const beneficCount = formingPlanets.filter(id => ctx.isNaturalBenefic(id)).length;
    const dignifiedCount = formingPlanets.filter(id => {
      const d = ctx.dignity(id);
      return d === 'exalted' || d === 'own' || d === 'moolatrikona';
    }).length;

    if (beneficCount >= 2 || dignifiedCount >= 1) return 'Strong';
    if (beneficCount >= 1) return 'Moderate';
    return 'Weak';
  },

  affectedDomains: ['wealth', 'career'],
  domainImpactWeight: 1,

  formationRule: {
    en: 'A planet (excluding Moon, Rahu, Ketu) occupies the 12th house from Sun.',
    hi: 'सूर्य से बारहवें भाव में कोई ग्रह (चन्द्र, राहु, केतु को छोड़कर) स्थित है।',
  },

  description: {
    en: 'Vasi Yoga bestows a charitable disposition, artistic skill, and a fine reputation. The native gains through generosity and service — their giving nature attracts support and goodwill. Benefic planets in the 12th from Sun enhance artistic and creative talents.',
    hi: 'वासी योग दानशीलता, कलात्मक कौशल और उत्तम प्रतिष्ठा प्रदान करता है। जातक उदारता और सेवा से लाभ प्राप्त करता है — उनका दानी स्वभाव सहयोग और सद्भावना आकर्षित करता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Obhayachari Yoga — planets in BOTH 2nd AND 12th from Sun
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Obhayachari (Ubhayachari) Yoga — Phaladeepika Ch.6 v.13
 *
 * Formation: Eligible planets in BOTH the 2nd AND 12th houses from Sun.
 * The Sun is flanked on both sides — combining Veshi and Vasi effects.
 *
 * Results: The native is eloquent, handsome, even-tempered, wealthy,
 * and commands respect from all quarters. A well-rounded personality
 * with both material success and moral virtue.
 */
const OBHAYACHARI: YogaRule = {
  id: 'obhayachari',
  name: { en: 'Obhayachari', hi: 'उभयचारी', sa: 'उभयचारी' },
  group: 'surya',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.6 v.13',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const sunHouse = ctx.planetHouse(0);
      const secondFromSun = houseFrom(sunHouse, 2);
      const twelfthFromSun = houseFrom(sunHouse, 12);
      const inSecond = eligiblePlanetsInHouse(ctx, secondFromSun);
      const inTwelfth = eligiblePlanetsInHouse(ctx, twelfthFromSun);
      const present = inSecond.length > 0 && inTwelfth.length > 0;
      return {
        present,
        involvedPlanets: present ? [0, ...inSecond, ...inTwelfth] : [],
      };
    },
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
    const formingPlanets = result.involvedPlanets.filter(id => id !== 0);
    const beneficCount = formingPlanets.filter(id => ctx.isNaturalBenefic(id)).length;
    const dignifiedCount = formingPlanets.filter(id => {
      const d = ctx.dignity(id);
      return d === 'exalted' || d === 'own' || d === 'moolatrikona';
    }).length;

    if (beneficCount >= 3 || dignifiedCount >= 2) return 'Strong';
    if (beneficCount >= 1 || dignifiedCount >= 1) return 'Moderate';
    return 'Weak';
  },

  affectedDomains: ['career', 'wealth'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'Planets (excluding Moon, Rahu, Ketu) occupy both the 2nd and 12th houses from Sun — the Sun is flanked on both sides.',
    hi: 'सूर्य से दूसरे और बारहवें दोनों भावों में ग्रह (चन्द्र, राहु, केतु को छोड़कर) स्थित हैं — सूर्य दोनों ओर से घिरा है।',
  },

  description: {
    en: 'Obhayachari Yoga — the Sun flanked by planets on both sides — creates a well-rounded, commanding personality. The native is eloquent, attractive, even-tempered, and prosperous. They command respect from all directions and succeed in both material and intellectual pursuits. This combines the wealth-giving nature of Veshi with the charitable disposition of Vasi.',
    hi: 'उभयचारी योग — सूर्य दोनों ओर से ग्रहों से घिरा — एक संपूर्ण, प्रभावशाली व्यक्तित्व बनाता है। जातक वाक्पटु, आकर्षक, सम-स्वभाव और समृद्ध होता है। सभी दिशाओं से सम्मान प्राप्त करता है और भौतिक व बौद्धिक दोनों क्षेत्रों में सफल होता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

/** All 4 Sun-based (Surya) yoga rules — Phaladeepika Ch.6 v.11-13 */
export const SURYA_RULES: YogaRule[] = [
  BUDHADITYA,
  VESHI,
  VASI,
  OBHAYACHARI,
];
