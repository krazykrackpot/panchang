/**
 * Dhana (Wealth) Yoga Rules
 *
 * Wealth yogas primarily from BPHS Ch.36. These describe combinations
 * that indicate financial prosperity, accumulation of assets, and
 * material abundance.
 *
 * Key houses for wealth: 2nd (savings/family wealth), 5th (speculation/past merit),
 * 9th (fortune/luck), 11th (gains/income).
 *
 * Expected frequencies (Lesson T):
 * - Dhana General: ~8% (2nd-11th lord connection — moderately common)
 * - Lakshmi: ~3% (9th lord exalted/own in kendra/trikona — rare)
 * - Kubera: ~2% (specific lord chain — rare)
 * - Kalanidhi: ~2% (Jupiter in 2/5 with Mercury+Venus — rare)
 * - Mahalakshmi: ~2% (Venus in own sign in 2/11 aspected by Jupiter)
 * - Shankha: ~3% (5th+6th lords in mutual kendras)
 * - Bheri: ~2% (Venus+Jupiter mutual kendras/trikonas)
 * - Chapa: ~1% (lagna lord exalted + 4th/10th exchange — very rare)
 * - Sunapha Dhana: ~15% (benefic in 2nd from Moon — common)
 * - Dhana from 5th: ~5% (5th lord in 2/11 with benefic aspect)
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: house offset calculation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the house that is N houses from a reference house.
 * Uses 1-based forward counting: offset 1 = same house, offset 2 = next house, etc.
 */
function houseFrom(refHouse: number, offset: number): number {
  return ((refHouse - 1 + offset - 1) % 12) + 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared strength assessor for wealth yogas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Assess strength of a Dhana yoga based on involved planets' dignity and placement.
 */
function assessDhanaStrength(ctx: YogaContext, result: YogaDetectionResult): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  let score = 0;

  for (const pid of planets) {
    const d = ctx.dignity(pid);
    if (d === 'exalted') score += 3;
    else if (d === 'moolatrikona' || d === 'own') score += 2;
    else if (d === 'friend') score += 1;
    else if (d === 'enemy') score -= 1;
    else if (d === 'debilitated') score -= 2;

    if (ctx.isCombust(pid)) score -= 1;
    if (ctx.isKendra(ctx.planetHouse(pid)) || ctx.isTrikona(ctx.planetHouse(pid))) score += 1;
  }

  if (score >= 5) return 'Strong';
  if (score >= 2) return 'Moderate';
  return 'Weak';
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Dhana Yoga (General) — 2nd lord and 11th lord connected
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dhana Yoga (General) — BPHS Ch.36 v.1-2
 *
 * Formation: The lords of the 2nd house (accumulated wealth, family resources)
 * and 11th house (gains, income) are in conjunction, mutual aspect, or sign exchange.
 *
 * Results: Financial prosperity through earned income and savings.
 * The native is skilled at both earning and preserving wealth.
 */
const DHANA_GENERAL: YogaRule = {
  id: 'dhana-general',
  name: { en: 'Dhana Yoga', hi: 'धन योग', sa: 'धनयोगः' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36 v.1-2',

  conditions: {
    type: 'lord_connection',
    house1: 2,
    house2: 11,
    connectionType: 'any',
  },

  assessStrength: assessDhanaStrength,

  cancellations: [
    {
      condition: {
        type: 'lord_in_house',
        lordOfHouse: 2,
        inHouses: [6, 8, 12],
      },
      reason: {
        en: '2nd lord in a dusthana (6/8/12) weakens wealth accumulation.',
        hi: 'द्वितीय भाव का स्वामी दुस्थान (6/8/12) में है, जिससे धन संचय कमजोर होता है।',
      },
      effect: 'weaken',
    },
    {
      condition: {
        type: 'lord_in_house',
        lordOfHouse: 11,
        inHouses: [6, 8, 12],
      },
      reason: {
        en: '11th lord in a dusthana (6/8/12) weakens income and gains.',
        hi: 'एकादश भाव का स्वामी दुस्थान (6/8/12) में है, जिससे आय और लाभ कमजोर होते हैं।',
      },
      effect: 'weaken',
    },
  ],

  affectedDomains: ['wealth'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'Lords of the 2nd (wealth) and 11th (gains) houses are connected by conjunction, mutual aspect, or sign exchange.',
    hi: 'दूसरे (धन) और ग्यारहवें (लाभ) भावों के स्वामी युति, परस्पर दृष्टि या राशि परिवर्तन से जुड़े हैं।',
  },

  description: {
    en: 'Dhana Yoga — the fundamental wealth combination — connects the house of accumulated wealth (2nd) with the house of income and gains (11th). The native possesses both the ability to earn and the discipline to save. Financial growth is steady and sustainable, built on productive effort rather than speculation.',
    hi: 'धन योग — मूलभूत धन संयोग — संचित धन के भाव (दूसरे) को आय और लाभ के भाव (ग्यारहवें) से जोड़ता है। जातक में कमाने की क्षमता और बचत का अनुशासन दोनों होते हैं। वित्तीय वृद्धि स्थिर और टिकाऊ होती है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Lakshmi Yoga — 9th lord in own/exalted sign in kendra or trikona
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lakshmi Yoga — BPHS Ch.36 v.4
 *
 * Formation: The lord of the 9th house (fortune, dharma, luck) is placed in
 * its own or exaltation sign, AND that placement is in a kendra (1/4/7/10)
 * or trikona (1/5/9).
 *
 * Results: Great wealth, virtue, learning, fame. Named after Lakshmi,
 * the goddess of prosperity. The native attracts fortune through
 * righteous conduct and past-life merit.
 */
const LAKSHMI: YogaRule = {
  id: 'lakshmi',
  name: { en: 'Lakshmi', hi: 'लक्ष्मी', sa: 'लक्ष्मी' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36 v.4',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const lord9 = ctx.houseLord(9);
      const lord9House = ctx.planetHouse(lord9);
      const dignity = ctx.dignity(lord9);

      // 9th lord must be in own or exalted sign
      const wellDignified = dignity === 'own' || dignity === 'exalted' || dignity === 'moolatrikona';
      if (!wellDignified) {
        return { present: false, involvedPlanets: [] };
      }

      // Must be in a kendra or trikona
      const inKendraTrikona = ctx.isKendra(lord9House) || ctx.isTrikona(lord9House);
      if (!inKendraTrikona) {
        return { present: false, involvedPlanets: [] };
      }

      return {
        present: true,
        involvedPlanets: [lord9],
        customData: { lord9House, dignity },
      };
    },
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
    const lord9 = result.involvedPlanets[0];
    const dignity = ctx.dignity(lord9);
    const house = ctx.planetHouse(lord9);

    // Exalted in 1st or 10th — peak Lakshmi
    if (dignity === 'exalted' && (house === 1 || house === 10)) return 'Strong';
    // Exalted or own in any kendra
    if ((dignity === 'exalted' || dignity === 'own') && ctx.isKendra(house)) return 'Strong';
    // Own sign in trikona
    if (dignity === 'own' && ctx.isTrikona(house)) return 'Moderate';

    if (ctx.isCombust(lord9)) return 'Weak';
    return 'Moderate';
  },

  cancellations: [
    {
      condition: {
        type: 'custom',
        detect: (ctx: YogaContext) => {
          const lord9 = ctx.houseLord(9);
          return { present: ctx.isCombust(lord9), involvedPlanets: ctx.isCombust(lord9) ? [lord9] : [] };
        },
      },
      reason: {
        en: '9th lord is combust, reducing Lakshmi Yoga\'s potency.',
        hi: 'नवम भाव का स्वामी अस्त है, जिससे लक्ष्मी योग की शक्ति कम होती है।',
      },
      effect: 'weaken',
    },
  ],

  affectedDomains: ['wealth', 'spiritual'],
  domainImpactWeight: 3,

  formationRule: {
    en: '9th lord (fortune) is in its own or exaltation sign, placed in a kendra (1/4/7/10) or trikona (1/5/9).',
    hi: 'नवम भाव का स्वामी (भाग्य) अपनी या उच्च राशि में, केन्द्र (1/4/7/10) या त्रिकोण (1/5/9) में स्थित है।',
  },

  description: {
    en: 'Lakshmi Yoga — named after the goddess of wealth — indicates prosperity rooted in dharma and past-life merit. The native attracts fortune almost effortlessly, not through cunning but through righteous conduct. Wealth flows from multiple sources: inheritance, career, investments, and fortunate circumstances. They are generous with their prosperity and respected for both material success and moral integrity.',
    hi: 'लक्ष्मी योग — धन की देवी के नाम पर — धर्म और पूर्व जन्म के पुण्य पर आधारित समृद्धि का संकेत देता है। जातक लगभग सहज रूप से भाग्य आकर्षित करता है। धन अनेक स्रोतों से प्रवाहित होता है: विरासत, करियर, निवेश और शुभ परिस्थितियाँ।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Kubera Yoga — 1st lord in 2nd AND 2nd lord in 11th
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Kubera Yoga — Classical wealth chain
 *
 * Formation: Lord of the 1st house is in the 2nd house (self → savings),
 * AND lord of the 2nd house is in the 11th house (savings → gains).
 * This creates a wealth chain: self → accumulated wealth → income.
 *
 * Results: The native is a natural wealth builder. They channel personal
 * effort into savings, and savings into productive investments.
 */
const KUBERA: YogaRule = {
  id: 'kubera',
  name: { en: 'Kubera', hi: 'कुबेर', sa: 'कुबेरः' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const lord1 = ctx.houseLord(1);
      const lord2 = ctx.houseLord(2);
      const lord1House = ctx.planetHouse(lord1);
      const lord2House = ctx.planetHouse(lord2);

      // 1st lord in 2nd AND 2nd lord in 11th
      const present = lord1House === 2 && lord2House === 11;
      return {
        present,
        involvedPlanets: present ? [lord1, lord2] : [],
      };
    },
  },

  assessStrength: assessDhanaStrength,

  affectedDomains: ['wealth'],
  domainImpactWeight: 2,

  formationRule: {
    en: '1st lord is in the 2nd house (self → savings) AND 2nd lord is in the 11th house (savings → gains) — a wealth chain.',
    hi: 'प्रथम भाव का स्वामी दूसरे भाव में (स्वयं → बचत) और दूसरे भाव का स्वामी ग्यारहवें भाव में (बचत → लाभ) — धन श्रृंखला।',
  },

  description: {
    en: 'Kubera Yoga — named after the divine treasurer — creates a wealth pipeline from personal effort to savings to gains. The native has an instinctive understanding of money: how to earn it, preserve it, and grow it. Financial acumen is a defining trait. They build wealth systematically rather than through windfalls.',
    hi: 'कुबेर योग — दिव्य कोषाध्यक्ष के नाम पर — व्यक्तिगत प्रयास से बचत और बचत से लाभ तक धन पाइपलाइन बनाता है। जातक को धन की सहज समझ होती है: कैसे कमाना, बचाना और बढ़ाना है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Kalanidhi Yoga — Jupiter in 2nd/5th conjunct/aspected by Mercury + Venus
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Kalanidhi Yoga — BPHS Ch.36
 *
 * Formation: Jupiter in the 2nd or 5th house, AND connected to both
 * Mercury and Venus (by conjunction or aspect).
 *
 * Results: Wealth combined with learning and artistic skill.
 * The native is a cultured person of means — knowledgeable in many
 * arts and sciences, and wealthy enough to patronise them.
 */
const KALANIDHI: YogaRule = {
  id: 'kalanidhi',
  name: { en: 'Kalanidhi', hi: 'कलानिधि', sa: 'कलानिधिः' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const jupHouse = ctx.planetHouse(4); // 4 = Jupiter

      // Jupiter must be in 2nd or 5th house
      if (jupHouse !== 2 && jupHouse !== 5) {
        return { present: false, involvedPlanets: [] };
      }

      // Mercury (3) and Venus (5) must be connected to Jupiter:
      // either conjunct (same house) or aspecting Jupiter's house
      const mercConnected = ctx.areConjunct(4, 3) || ctx.doesAspect(3, jupHouse);
      const venusConnected = ctx.areConjunct(4, 5) || ctx.doesAspect(5, jupHouse);

      const present = mercConnected && venusConnected;
      const involved: number[] = present ? [4] : [];
      if (present) {
        involved.push(3); // Mercury
        involved.push(5); // Venus
      }

      return { present, involvedPlanets: involved };
    },
  },

  assessStrength: assessDhanaStrength,

  cancellations: [
    {
      condition: { type: 'combust', planetId: 4, isCombust: true },
      reason: {
        en: 'Jupiter is combust, reducing Kalanidhi Yoga\'s potency.',
        hi: 'गुरु अस्त है, जिससे कलानिधि योग की शक्ति कम होती है।',
      },
      effect: 'weaken',
    },
  ],

  affectedDomains: ['wealth', 'education'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'Jupiter is in the 2nd or 5th house, conjunct or aspected by both Mercury and Venus.',
    hi: 'गुरु दूसरे या पाँचवें भाव में है, बुध और शुक्र दोनों से युति या दृष्ट।',
  },

  description: {
    en: 'Kalanidhi Yoga blends wealth with culture and learning. Jupiter in a wealth/intelligence house, supported by Mercury (intellect) and Venus (arts), creates a refined personality who prospers through knowledge. The native excels in fields combining finance with expertise — consulting, academia, publishing, art dealing.',
    hi: 'कलानिधि योग धन को संस्कृति और विद्या से मिलाता है। गुरु धन/बुद्धि भाव में, बुध (बुद्धि) और शुक्र (कला) के सहयोग से, एक परिष्कृत व्यक्तित्व बनाता है जो ज्ञान से समृद्ध होता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. Mahalakshmi Yoga — Venus in own sign in 2nd/11th aspected by Jupiter
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mahalakshmi Yoga — Classical wealth yoga
 *
 * Formation: Venus in its own sign (Taurus or Libra) placed in the 2nd
 * or 11th house, aspected by Jupiter.
 *
 * Results: Sustained, luxurious wealth. Venus in its own sign in a wealth
 * house provides material abundance; Jupiter's aspect ensures it comes
 * through dharmic means and is long-lasting.
 */
const MAHALAKSHMI: YogaRule = {
  id: 'mahalakshmi',
  name: { en: 'Mahalakshmi', hi: 'महालक्ष्मी', sa: 'महालक्ष्मी' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const venusHouse = ctx.planetHouse(5); // 5 = Venus
      const venusDignity = ctx.dignity(5);

      // Venus must be in own sign
      if (venusDignity !== 'own') {
        return { present: false, involvedPlanets: [] };
      }

      // Venus must be in 2nd or 11th house
      if (venusHouse !== 2 && venusHouse !== 11) {
        return { present: false, involvedPlanets: [] };
      }

      // Jupiter must aspect Venus's house
      const jupAspects = ctx.doesAspect(4, venusHouse); // 4 = Jupiter
      if (!jupAspects) {
        return { present: false, involvedPlanets: [] };
      }

      return {
        present: true,
        involvedPlanets: [5, 4], // Venus, Jupiter
      };
    },
  },

  assessStrength: (ctx: YogaContext, _result: YogaDetectionResult) => {
    const jupDignity = ctx.dignity(4);
    const jupCombust = ctx.isCombust(4);

    if (jupCombust) return 'Weak';
    if (jupDignity === 'exalted' || jupDignity === 'own' || jupDignity === 'moolatrikona') return 'Strong';
    if (jupDignity === 'friend' || jupDignity === 'neutral') return 'Moderate';
    return 'Weak';
  },

  affectedDomains: ['wealth'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'Venus is in its own sign (Taurus/Libra) in the 2nd or 11th house, aspected by Jupiter.',
    hi: 'शुक्र अपनी राशि (वृषभ/तुला) में दूसरे या ग्यारहवें भाव में, गुरु की दृष्टि से।',
  },

  description: {
    en: 'Mahalakshmi Yoga produces sustained, luxurious wealth. Venus — planet of comfort and beauty — at full strength in a wealth house, blessed by Jupiter\'s wisdom, ensures prosperity that is both abundant and enduring. The native enjoys the finest things in life and shares their abundance generously.',
    hi: 'महालक्ष्मी योग स्थायी, विलासपूर्ण धन उत्पन्न करता है। शुक्र — सुख और सौंदर्य का ग्रह — धन भाव में पूर्ण शक्ति पर, गुरु के आशीर्वाद से, प्रचुर और स्थायी समृद्धि सुनिश्चित करता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. Shankha Yoga — 5th and 6th lords in mutual kendras, lagna lord strong
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shankha Yoga — BPHS Ch.36
 *
 * Formation: The 5th and 6th house lords are in mutual kendras (both occupy
 * kendras from each other), AND the lagna lord is strong (in kendra/trikona
 * and not debilitated).
 *
 * Results: Wealth, longevity, moral conduct. The native is righteous and
 * prosperous, enjoying both health and reputation.
 */
const SHANKHA: YogaRule = {
  id: 'shankha',
  name: { en: 'Shankha', hi: 'शंख', sa: 'शङ्खम्' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const lord5 = ctx.houseLord(5);
      const lord6 = ctx.houseLord(6);
      const lord5House = ctx.planetHouse(lord5);
      const lord6House = ctx.planetHouse(lord6);

      // Both must be in kendras
      if (!ctx.isKendra(lord5House) || !ctx.isKendra(lord6House)) {
        return { present: false, involvedPlanets: [] };
      }

      // Lagna lord must be strong: in kendra or trikona, not debilitated
      const lord1 = ctx.houseLord(1);
      const lord1House = ctx.planetHouse(lord1);
      const lord1Dignity = ctx.dignity(lord1);
      const lagnaStrong = (ctx.isKendra(lord1House) || ctx.isTrikona(lord1House))
        && lord1Dignity !== 'debilitated';

      if (!lagnaStrong) {
        return { present: false, involvedPlanets: [] };
      }

      return {
        present: true,
        involvedPlanets: [lord5, lord6, lord1],
      };
    },
  },

  assessStrength: assessDhanaStrength,

  affectedDomains: ['wealth', 'career'],
  domainImpactWeight: 1,

  formationRule: {
    en: '5th and 6th lords are both in kendras, and the lagna lord is strong (in kendra/trikona, not debilitated).',
    hi: 'पाँचवें और छठे भावों के स्वामी दोनों केन्द्र में हैं, और लग्न स्वामी बलवान (केन्द्र/त्रिकोण में, नीच नहीं) है।',
  },

  description: {
    en: 'Shankha Yoga grants wealth, longevity, and a virtuous reputation. The combination of the 5th lord (intelligence, merit) and 6th lord (competition, service) in strong positions, backed by a strong lagna lord, creates a person who overcomes obstacles through wisdom and prospers through righteous effort.',
    hi: 'शंख योग धन, दीर्घायु और सद्गुणी प्रतिष्ठा प्रदान करता है। पाँचवें स्वामी (बुद्धि, पुण्य) और छठे स्वामी (प्रतिस्पर्धा, सेवा) का बलवान स्थिति में होना, मजबूत लग्न स्वामी के साथ, बाधाओं पर ज्ञान से विजय प्राप्त करने वाला व्यक्ति बनाता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. Bheri Yoga — Venus and Jupiter in mutual kendras/trikonas, 9th lord strong
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bheri Yoga — BPHS Ch.36
 *
 * Formation: Venus and Jupiter in mutual kendras or trikonas (each is in a
 * kendra or trikona from the other), AND the 9th lord is strong.
 *
 * Results: Wealth, devotion, fame, good character. The native is blessed
 * by both material and spiritual prosperity.
 */
const BHERI: YogaRule = {
  id: 'bheri',
  name: { en: 'Bheri', hi: 'भेरी', sa: 'भेरी' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const jupHouse = ctx.planetHouse(4);
      const venHouse = ctx.planetHouse(5);

      // Venus and Jupiter must be in mutual kendras/trikonas
      const offsetJupToVen = ctx.houseOffset(jupHouse, venHouse);
      const offsetVenToJup = ctx.houseOffset(venHouse, jupHouse);

      const kendraTrikonaOffsets = [1, 4, 5, 7, 9, 10]; // kendra (1,4,7,10) + trikona (1,5,9)
      const jupToVenOk = kendraTrikonaOffsets.includes(offsetJupToVen);
      const venToJupOk = kendraTrikonaOffsets.includes(offsetVenToJup);

      if (!jupToVenOk || !venToJupOk) {
        return { present: false, involvedPlanets: [] };
      }

      // 9th lord must be strong
      const lord9 = ctx.houseLord(9);
      const lord9Dignity = ctx.dignity(lord9);
      const lord9House = ctx.planetHouse(lord9);
      const lord9Strong = (ctx.isKendra(lord9House) || ctx.isTrikona(lord9House))
        && lord9Dignity !== 'debilitated' && lord9Dignity !== 'enemy';

      if (!lord9Strong) {
        return { present: false, involvedPlanets: [] };
      }

      return {
        present: true,
        involvedPlanets: [4, 5, lord9],
      };
    },
  },

  assessStrength: assessDhanaStrength,

  affectedDomains: ['wealth', 'spiritual'],
  domainImpactWeight: 1,

  formationRule: {
    en: 'Venus and Jupiter are in mutual kendras/trikonas from each other, and the 9th lord is strong.',
    hi: 'शुक्र और गुरु परस्पर केन्द्र/त्रिकोण में हैं, और नवम भाव का स्वामी बलवान है।',
  },

  description: {
    en: 'Bheri Yoga blends wealth with devotion and good character. The mutual support of Jupiter (wisdom, dharma) and Venus (luxury, arts) in strong positions, combined with a strong 9th lord, produces a native who is both materially comfortable and spiritually inclined. They earn through ethical means and are known for generosity.',
    hi: 'भेरी योग धन को भक्ति और सद्चरित्र से मिलाता है। गुरु (ज्ञान, धर्म) और शुक्र (विलास, कला) का बलवान स्थिति में परस्पर सहयोग, मजबूत नवम स्वामी के साथ, भौतिक सुख और आध्यात्मिक प्रवृत्ति दोनों वाला जातक बनाता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. Chapa Yoga — Lagna lord exalted, 4th and 10th lords exchange
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Chapa Yoga — BPHS Ch.36
 *
 * Formation: Lagna lord is exalted, AND the lords of the 4th and 10th
 * houses exchange signs (parivartana).
 *
 * Results: Royal comforts, authority, landed property, vehicles.
 * The kendra axis exchange (sukha sthana ↔ karma sthana) creates a
 * powerful foundation, amplified by the exalted lagna lord.
 */
const CHAPA: YogaRule = {
  id: 'chapa',
  name: { en: 'Chapa', hi: 'चाप', sa: 'चापम्' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const lord1 = ctx.houseLord(1);
      const lord1Dignity = ctx.dignity(lord1);

      // Lagna lord must be exalted
      if (lord1Dignity !== 'exalted') {
        return { present: false, involvedPlanets: [] };
      }

      // 4th and 10th lords must exchange signs
      const lord4 = ctx.houseLord(4);
      const lord10 = ctx.houseLord(10);
      const lord4Sign = ctx.planetSign(lord4);
      const lord10Sign = ctx.planetSign(lord10);

      // Exchange: lord4 is in lord10's sign and lord10 is in lord4's sign
      const sign4 = ctx.houseSign(4);
      const sign10 = ctx.houseSign(10);
      const exchange = lord4Sign === sign10 && lord10Sign === sign4;

      if (!exchange) {
        return { present: false, involvedPlanets: [] };
      }

      return {
        present: true,
        involvedPlanets: [lord1, lord4, lord10],
      };
    },
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
    const lord1 = result.involvedPlanets[0];
    const house = ctx.planetHouse(lord1);

    // Lagna lord exalted in a kendra — peak
    if (ctx.isKendra(house)) return 'Strong';
    if (ctx.isTrikona(house)) return 'Strong';
    if (ctx.isCombust(lord1)) return 'Weak';
    return 'Moderate';
  },

  affectedDomains: ['wealth', 'career'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'Lagna lord is exalted, and the 4th and 10th lords exchange signs (parivartana).',
    hi: 'लग्न स्वामी उच्च है, और चौथे और दसवें भावों के स्वामी राशि परिवर्तन करते हैं।',
  },

  description: {
    en: 'Chapa Yoga confers royal comforts, authority, and property. An exalted lagna lord provides personal strength, while the 4th-10th axis exchange connects domestic happiness with career success. The native enjoys vehicles, landed property, and positions of power — living like royalty through earned authority.',
    hi: 'चाप योग राजसी सुख, अधिकार और संपत्ति प्रदान करता है। उच्च लग्न स्वामी व्यक्तिगत बल प्रदान करता है, जबकि 4-10 अक्ष का परिवर्तन घरेलू सुख को करियर सफलता से जोड़ता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. Sunapha Dhana — natural benefic in 2nd from Moon providing wealth
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sunapha Dhana — Phaladeepika Ch.6 (wealth variant)
 *
 * Formation: A natural benefic (Jupiter, Venus, or Mercury) in the 2nd
 * house from Moon. This is the wealth-specific variant of Sunapha.
 *
 * Results: Self-earned wealth through benefic means. The nature of wealth
 * depends on the specific benefic: Jupiter = wisdom/teaching, Venus = arts/luxury,
 * Mercury = trade/communication.
 */
const SUNAPHA_DHANA: YogaRule = {
  id: 'sunapha-dhana',
  name: { en: 'Sunapha Dhana', hi: 'सुनफा धन', sa: 'सुनफा धनम्' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.6 v.3',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const moonHouse = ctx.planetHouse(1);
      const secondFromMoon = houseFrom(moonHouse, 2);
      const planetsInSecond = ctx.planetsInHouse(secondFromMoon);

      // Natural benefics: Mercury (3), Jupiter (4), Venus (5)
      const benefics = planetsInSecond.filter(id => id === 3 || id === 4 || id === 5);

      return {
        present: benefics.length > 0,
        involvedPlanets: benefics.length > 0 ? [1, ...benefics] : [],
      };
    },
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
    const benefics = result.involvedPlanets.filter(id => id !== 1);
    const dignifiedCount = benefics.filter(id => {
      const d = ctx.dignity(id);
      return d === 'exalted' || d === 'own' || d === 'moolatrikona';
    }).length;

    if (benefics.length >= 2 || dignifiedCount >= 1) return 'Strong';
    if (benefics.length === 1) return 'Moderate';
    return 'Weak';
  },

  affectedDomains: ['wealth'],
  domainImpactWeight: 1,

  formationRule: {
    en: 'A natural benefic (Jupiter, Venus, or Mercury) occupies the 2nd house from Moon.',
    hi: 'एक प्राकृतिक शुभ ग्रह (गुरु, शुक्र या बुध) चन्द्रमा से दूसरे भाव में स्थित है।',
  },

  description: {
    en: 'Sunapha Dhana indicates self-earned wealth through benefic activities. The benefic planet in the 2nd from Moon determines the channel: Jupiter brings wealth through knowledge and teaching, Venus through arts and luxury goods, Mercury through trade and communication. The native builds financial independence through their own talents.',
    hi: 'सुनफा धन शुभ गतिविधियों के माध्यम से स्वयं अर्जित धन का संकेत देता है। चन्द्र से दूसरे भाव में शुभ ग्रह माध्यम निर्धारित करता है: गुरु ज्ञान से, शुक्र कला से, बुध व्यापार से धन लाता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. Dhana from 5th — 5th lord in 2nd or 11th with benefic aspect
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dhana from 5th — BPHS Ch.36
 *
 * Formation: The 5th lord (purva punya, past merit, intelligence) is placed
 * in the 2nd or 11th house, AND aspected by a natural benefic.
 *
 * Results: Wealth through intelligence, speculation, or past-life merit.
 * The native earns through clever investment, intellectual property, or
 * children's success.
 */
const DHANA_FROM_5TH: YogaRule = {
  id: 'dhana-from-5th',
  name: { en: 'Dhana from 5th', hi: 'पंचमेश धन', sa: 'पञ्चमेशधनम्' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const lord5 = ctx.houseLord(5);
      const lord5House = ctx.planetHouse(lord5);

      // 5th lord must be in 2nd or 11th
      if (lord5House !== 2 && lord5House !== 11) {
        return { present: false, involvedPlanets: [] };
      }

      // Must be aspected by a natural benefic (Mercury=3, Jupiter=4, Venus=5)
      const beneficAspect = [3, 4, 5].some(bid =>
        bid !== lord5 && ctx.doesAspect(bid, lord5House),
      );

      if (!beneficAspect) {
        return { present: false, involvedPlanets: [] };
      }

      const aspectingBenefics = [3, 4, 5].filter(bid =>
        bid !== lord5 && ctx.doesAspect(bid, lord5House),
      );

      return {
        present: true,
        involvedPlanets: [lord5, ...aspectingBenefics],
      };
    },
  },

  assessStrength: assessDhanaStrength,

  affectedDomains: ['wealth'],
  domainImpactWeight: 1,

  formationRule: {
    en: '5th lord (intelligence, merit) is in the 2nd or 11th house, aspected by a natural benefic.',
    hi: 'पाँचवें भाव का स्वामी (बुद्धि, पुण्य) दूसरे या ग्यारहवें भाव में, प्राकृतिक शुभ ग्रह से दृष्ट।',
  },

  description: {
    en: 'Dhana from the 5th lord channels intelligence and past-life merit into material wealth. The native earns through intellectual pursuits, wise investments, speculative gains, or children\'s success. The benefic aspect ensures the wealth comes through ethical and sustainable means.',
    hi: 'पंचमेश धन बुद्धि और पूर्व जन्म के पुण्य को भौतिक धन में बदलता है। जातक बौद्धिक कार्यों, बुद्धिमान निवेश, सट्टा लाभ या संतान की सफलता से कमाता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

/** All 10 Dhana (wealth) yoga rules — BPHS Ch.36 */
export const DHANA_RULES: YogaRule[] = [
  DHANA_GENERAL,
  LAKSHMI,
  KUBERA,
  KALANIDHI,
  MAHALAKSHMI,
  SHANKHA,
  BHERI,
  CHAPA,
  SUNAPHA_DHANA,
  DHANA_FROM_5TH,
];
