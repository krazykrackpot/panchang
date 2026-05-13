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
import { houseFrom } from '../utils';
import { SIGN_LORDS } from '@/lib/constants/dignities';

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

      // Venus and Jupiter must be in mutual kendras from each other.
      // Classical Bheri definition: mutual kendra placement (1,4,7,10 offsets only).
      // Trikona offsets (5,9) are NOT included — that would make the yoga too loose.
      const offsetJupToVen = ctx.houseOffset(jupHouse, venHouse);
      const offsetVenToJup = ctx.houseOffset(venHouse, jupHouse);

      const kendraOffsets = [1, 4, 7, 10]; // kendra offsets only
      const jupToVenOk = kendraOffsets.includes(offsetJupToVen);
      const venToJupOk = kendraOffsets.includes(offsetVenToJup);

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
 * NOTE: This overlaps with the Chandra group's Sunapha yoga (chandra.ts).
 * Both can be present simultaneously — they serve different analytical purposes:
 * this one is a wealth lens (Dhana group), the Chandra version is a Moon strength lens.
 * Neither should be removed.
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
// 11. Parijata Yoga — Lagna lord's dispositor in own/exalted in kendra/trikona
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parijata Yoga — BPHS Ch.36
 *
 * Formation: The dispositor (sign lord) of the lagna lord is in its own
 * or exalted sign, placed in a kendra or trikona.
 *
 * Results: Wealth, royal comforts, and high status. The lagna lord is
 * "supported" by a strong dispositor, creating a chain of strength.
 */
const PARIJATA: YogaRule = {
  id: 'parijata',
  name: { en: 'Parijata', hi: 'पारिजात', sa: 'पारिजातम्' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const lord1 = ctx.houseLord(1);
      const lord1Sign = ctx.planetSign(lord1);

      // Dispositor of lagna lord = lord of the sign that lagna lord occupies
      const dispositor = SIGN_LORDS[lord1Sign] as number;

      if (dispositor === undefined || dispositor === lord1) {
        // If lagna lord is in its own sign, dispositor = self (already well-placed)
        // Still check if lagna lord itself is in kendra/trikona with own/exalted
        if (dispositor === lord1) {
          const d = ctx.dignity(lord1);
          const h = ctx.planetHouse(lord1);
          if ((d === 'own' || d === 'exalted' || d === 'moolatrikona') && (ctx.isKendra(h) || ctx.isTrikona(h))) {
            return { present: true, involvedPlanets: [lord1] };
          }
        }
        return { present: false, involvedPlanets: [] };
      }

      // Dispositor must be in own/exalted sign
      const dispDignity = ctx.dignity(dispositor);
      if (dispDignity !== 'own' && dispDignity !== 'exalted' && dispDignity !== 'moolatrikona') {
        return { present: false, involvedPlanets: [] };
      }

      // Dispositor must be in kendra or trikona
      const dispHouse = ctx.planetHouse(dispositor);
      if (!ctx.isKendra(dispHouse) && !ctx.isTrikona(dispHouse)) {
        return { present: false, involvedPlanets: [] };
      }

      return {
        present: true,
        involvedPlanets: [lord1, dispositor],
      };
    },
  },

  assessStrength: assessDhanaStrength,

  affectedDomains: ['wealth'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'The dispositor of the lagna lord is in own/exalted sign in a kendra or trikona.',
    hi: 'लग्न स्वामी का स्वामी (अधिपति) स्वगृही/उच्च राशि में केन्द्र या त्रिकोण में।',
  },

  description: {
    en: 'Parijata Yoga creates a chain of support for the self — the lagna lord is backed by a strong, well-placed dispositor. This "lord supporting the lord" pattern grants wealth, royal comforts, and elevated status. The native prospers through a stable foundation of personal strength and fortunate circumstances.',
    hi: 'पारिजात योग स्वयं के लिए समर्थन की श्रृंखला बनाता है — लग्न स्वामी एक बलवान, सुस्थित अधिपति द्वारा समर्थित है। यह "स्वामी स्वामी का समर्थन" पैटर्न धन, राजसी सुख और उन्नत प्रतिष्ठा प्रदान करता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 12. Chandra-Mangal Dhana — Moon-Mars conjunction in kendra/trikona
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Chandra-Mangal Dhana Yoga — Phaladeepika Ch.6
 *
 * Formation: Moon and Mars conjunct in a kendra or trikona.
 * Wealth through property, mother, and courage.
 *
 * Expected frequency: ~8% (Moon-Mars conjunction ~1/12, in kendra/trikona ~7/12).
 */
const CHANDRA_MANGAL_DHANA: YogaRule = {
  id: 'chandra-mangal-dhana',
  name: { en: 'Chandra-Mangal Dhana', hi: 'चन्द्र-मंगल धन', sa: 'चन्द्रमङ्गलधनम्' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.6',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      // Moon (1) and Mars (2) must be conjunct
      if (!ctx.areConjunct(1, 2)) return { present: false, involvedPlanets: [] };

      // Must be in a kendra or trikona
      const house = ctx.planetHouse(1); // same house since conjunct
      if (!ctx.isKendra(house) && !ctx.isTrikona(house)) {
        return { present: false, involvedPlanets: [] };
      }

      return {
        present: true,
        involvedPlanets: [1, 2], // Moon, Mars
      };
    },
  },

  assessStrength: assessDhanaStrength,

  affectedDomains: ['wealth'],
  domainImpactWeight: 1,

  formationRule: {
    en: 'Moon and Mars conjunct in a kendra (1/4/7/10) or trikona (1/5/9).',
    hi: 'चंद्र और मंगल केन्द्र (1/4/7/10) या त्रिकोण (1/5/9) में युक्त।',
  },

  description: {
    en: 'Chandra-Mangal Dhana Yoga combines the Moon\'s receptivity with Mars\'s initiative in a position of strength. The native earns wealth through property, real estate, agriculture, or maternal inheritance. They possess both the emotional intelligence to identify opportunities and the courage to act on them decisively.',
    hi: 'चन्द्र-मंगल धन योग चंद्र की ग्रहणशीलता को मंगल की पहल के साथ बल की स्थिति में जोड़ता है। जातक संपत्ति, भूमि या मातृ विरासत से धन अर्जित करता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 13. Dhana Axis — Lords of 2nd and 11th in mutual kendras or conjunct
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dhana Axis Yoga — BPHS Ch.36
 *
 * Formation: Lords of the 2nd and 11th houses are in mutual kendras
 * (both in kendras from each other) or conjunct.
 *
 * Stronger variant of the basic Dhana Yoga — mutual kendra placement
 * is more powerful than simple connection.
 */
const DHANA_AXIS: YogaRule = {
  id: 'dhana-axis',
  name: { en: 'Dhana Axis', hi: 'धन अक्ष', sa: 'धनाक्षः' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const lord2 = ctx.houseLord(2);
      const lord11 = ctx.houseLord(11);
      const lord2House = ctx.planetHouse(lord2);
      const lord11House = ctx.planetHouse(lord11);

      // Conjunct
      if (ctx.areConjunct(lord2, lord11)) {
        return { present: true, involvedPlanets: [lord2, lord11], customData: { type: 'conjunct' } };
      }

      // Both in kendras (mutual kendra placement)
      if (ctx.isKendra(lord2House) && ctx.isKendra(lord11House)) {
        return { present: true, involvedPlanets: [lord2, lord11], customData: { type: 'mutual_kendra' } };
      }

      return { present: false, involvedPlanets: [] };
    },
  },

  assessStrength: assessDhanaStrength,

  affectedDomains: ['wealth'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'Lords of the 2nd and 11th houses in mutual kendras or conjunct.',
    hi: 'दूसरे और ग्यारहवें भावों के स्वामी परस्पर केन्द्र में या युक्त।',
  },

  description: {
    en: 'Dhana Axis Yoga strengthens the wealth axis of the chart by connecting its two poles — accumulated wealth (2nd) and income/gains (11th) — through angular or conjunct placement. The native has a powerful financial axis that channels earning into savings effectively. Multiple income streams converge into sustainable wealth.',
    hi: 'धन अक्ष योग कुंडली की धन अक्ष को मजबूत करता है — संचित धन (द्वितीय) और आय/लाभ (एकादश) — को केन्द्रीय या युति स्थिति के माध्यम से जोड़कर।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 14. Shankha Dhana — 5th and 6th lords in mutual kendras
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shankha Dhana Yoga — BPHS Ch.36
 *
 * Formation: 5th and 6th lords are both in kendras.
 * Wealth through overcoming competition using intelligence.
 *
 * NOTE: This is the dhana-specific variant. The existing Shankha in this file
 * additionally requires a strong lagna lord; this simpler variant does not.
 * Unique ID differentiates it from the other Shankha rule.
 */
const SHANKHA_DHANA: YogaRule = {
  id: 'shankha-dhana',
  name: { en: 'Shankha Dhana', hi: 'शंख धन', sa: 'शङ्खधनम्' },
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

      // Both in kendras
      const present = ctx.isKendra(lord5House) && ctx.isKendra(lord6House);

      return {
        present,
        involvedPlanets: present ? [...new Set([lord5, lord6])] : [],
      };
    },
  },

  assessStrength: assessDhanaStrength,

  affectedDomains: ['wealth'],
  domainImpactWeight: 1,

  formationRule: {
    en: '5th and 6th lords both in kendras (simpler Shankha wealth variant).',
    hi: 'पाँचवें और छठे भावों के स्वामी दोनों केन्द्र में (सरल शंख धन प्रकार)।',
  },

  description: {
    en: 'Shankha Dhana — the wealth variant of Shankha Yoga — forms when the lords of intelligence (5th) and competition (6th) occupy angular houses. The native earns wealth by outcompeting rivals through superior strategy and mental acuity. Professional success comes through solving problems others cannot.',
    hi: 'शंख धन — शंख योग का धन प्रकार — तब बनता है जब बुद्धि (पंचम) और प्रतिस्पर्धा (षष्ठ) के स्वामी केन्द्र भावों में होते हैं। जातक बेहतर रणनीति से प्रतिस्पर्धियों को हराकर धन अर्जित करता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 15. Chandika Yoga — Strong lagna lord + strong 2nd lord + Jupiter aspect
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Chandika Yoga — Saravali
 *
 * Formation: Lagna lord is strong (in kendra/trikona, not debilitated),
 * 2nd lord is strong (same criteria), and Jupiter aspects the 2nd house or 2nd lord.
 *
 * Results: Wealth through personal authority combined with Jupiter's blessings.
 */
const CHANDIKA: YogaRule = {
  id: 'chandika',
  name: { en: 'Chandika', hi: 'चण्डिका', sa: 'चण्डिका' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'Saravali',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const lord1 = ctx.houseLord(1);
      const lord2 = ctx.houseLord(2);
      const lord1House = ctx.planetHouse(lord1);
      const lord2House = ctx.planetHouse(lord2);

      // Both lords must be strong: in kendra/trikona, not debilitated
      const lord1Strong = (ctx.isKendra(lord1House) || ctx.isTrikona(lord1House))
        && ctx.dignity(lord1) !== 'debilitated';
      const lord2Strong = (ctx.isKendra(lord2House) || ctx.isTrikona(lord2House))
        && ctx.dignity(lord2) !== 'debilitated';

      if (!lord1Strong || !lord2Strong) return { present: false, involvedPlanets: [] };

      // Jupiter must aspect the 2nd house or be conjunct with 2nd lord
      const jupAspects2 = ctx.doesAspect(4, 2);
      const jupConjunct2ndLord = ctx.areConjunct(4, lord2);

      if (!jupAspects2 && !jupConjunct2ndLord) return { present: false, involvedPlanets: [] };

      return {
        present: true,
        involvedPlanets: [...new Set([lord1, lord2, 4])],
      };
    },
  },

  assessStrength: assessDhanaStrength,

  affectedDomains: ['wealth'],
  domainImpactWeight: 1,

  formationRule: {
    en: 'Strong lagna lord + strong 2nd lord + Jupiter aspecting 2nd house or 2nd lord.',
    hi: 'बलवान लग्न स्वामी + बलवान द्वितीय स्वामी + गुरु की दृष्टि द्वितीय भाव या द्वितीय स्वामी पर।',
  },

  description: {
    en: 'Chandika Yoga combines personal strength (strong lagna lord), wealth potential (strong 2nd lord), and Jupiter\'s expansive blessing. The native builds substantial wealth through their own authority and reputation, amplified by Jupiter\'s wisdom and ethical guidance. Financial growth is steady and well-directed.',
    hi: 'चण्डिका योग व्यक्तिगत शक्ति (बलवान लग्न स्वामी), धन क्षमता (बलवान द्वितीय स्वामी) और गुरु के विस्तारशील आशीर्वाद को जोड़ता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 16. Shri Kanthi Yoga — Lagna lord, 9th lord, 10th lord all in kendras
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shri Kanthi Yoga — BPHS Ch.36; Jataka Parijata
 *
 * Formation: Lagna lord, 9th lord, and 10th lord all in kendras.
 *
 * Results: Wealth combined with career success. The three pillars
 * (self, fortune, action) are all in positions of power.
 */
const SHRI_KANTHI: YogaRule = {
  id: 'shri-kanthi',
  name: { en: 'Shri Kanthi', hi: 'श्री कान्ती', sa: 'श्रीकान्तिः' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36; Jataka Parijata',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const lord1 = ctx.houseLord(1);
      const lord9 = ctx.houseLord(9);
      const lord10 = ctx.houseLord(10);

      const lord1House = ctx.planetHouse(lord1);
      const lord9House = ctx.planetHouse(lord9);
      const lord10House = ctx.planetHouse(lord10);

      const present = ctx.isKendra(lord1House) && ctx.isKendra(lord9House) && ctx.isKendra(lord10House);

      return {
        present,
        involvedPlanets: present ? [...new Set([lord1, lord9, lord10])] : [],
      };
    },
  },

  assessStrength: assessDhanaStrength,

  affectedDomains: ['wealth', 'career'],
  domainImpactWeight: 2,

  formationRule: {
    en: 'Lagna lord, 9th lord (fortune), and 10th lord (career) all in kendras.',
    hi: 'लग्न स्वामी, नवम स्वामी (भाग्य) और दशम स्वामी (करियर) सभी केन्द्र में।',
  },

  description: {
    en: 'Shri Kanthi Yoga — the "Radiance of Prosperity" — places all three key lords (self, fortune, career) in angular houses. The native shines in their profession, attracts fortunate circumstances, and builds wealth through a combination of personal effort and divine grace. Career advancement and financial growth are intertwined.',
    hi: 'श्री कान्ती योग — "समृद्धि की कान्ति" — तीनों प्रमुख स्वामियों (स्वयं, भाग्य, करियर) को केन्द्र भावों में रखता है। जातक अपने पेशे में चमकता है और व्यक्तिगत प्रयास और दैवी कृपा के संयोग से धन बनाता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 17. Dhana from 5th (variant) — already exists as rule 10; this is the
//     explicit "5th lord in 2nd or 11th with benefic aspect" — SKIP
//     (duplicate detection avoided — see rule 10 DHANA_FROM_5TH above)
// ─────────────────────────────────────────────────────────────────────────────
// NOTE: Dhana from 5th already exists above. The spec item #7 duplicates it.
// Skipping to avoid duplicate ID. See DHANA_FROM_5TH (rule 10).

// ─────────────────────────────────────────────────────────────────────────────
// 18. Bhagya Yoga — 9th lord in 9th house in own sign
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bhagya Yoga — Fortune's Own House
 *
 * Formation: 9th lord in the 9th house in its own sign.
 * The lord of fortune sits in its own house in its own sign —
 * maximum fortune at maximum strength.
 *
 * Source: BPHS Ch.36; Phaladeepika Ch.6
 */
const BHAGYA: YogaRule = {
  id: 'bhagya',
  name: { en: 'Bhagya', hi: 'भाग्य', sa: 'भाग्यम्' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'BPHS Ch.36; Phaladeepika Ch.6',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const lord9 = ctx.houseLord(9);
      const lord9House = ctx.planetHouse(lord9);
      const lord9Dignity = ctx.dignity(lord9);

      // 9th lord must be in 9th house AND in own sign
      const present = lord9House === 9 && lord9Dignity === 'own';

      return {
        present,
        involvedPlanets: present ? [lord9] : [],
      };
    },
  },

  assessStrength: (_ctx: YogaContext, _result: YogaDetectionResult) => {
    // 9th lord in own sign in own house is inherently strong
    return 'Strong';
  },

  affectedDomains: ['wealth', 'spiritual'],
  domainImpactWeight: 2,

  formationRule: {
    en: '9th lord in the 9th house in its own sign — fortune at maximum strength.',
    hi: 'नवम स्वामी नवम भाव में स्वराशि में — भाग्य अधिकतम बल पर।',
  },

  description: {
    en: 'Bhagya Yoga — "Fortune" — is the purest expression of luck and divine grace. The 9th lord returning to its own house in its own sign means fortune is operating at full power without compromise. The native is blessed with extraordinary luck in all undertakings. Past-life merit manifests as effortless good fortune in this lifetime.',
    hi: 'भाग्य योग — "सौभाग्य" — भाग्य और दैवी कृपा की शुद्धतम अभिव्यक्ति है। नवम स्वामी अपने ही घर में अपनी ही राशि में लौटता है, अर्थात् भाग्य बिना किसी समझौते के पूर्ण शक्ति पर संचालित हो रहा है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 19. Anapha from Lagna — Planet in 12th from Lagna (not from Moon)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Anapha from Lagna
 *
 * Formation: Any planet (Sun through Saturn, excluding Rahu/Ketu) in the
 * 12th house from lagna. Provides wealth through expenditure discipline
 * and behind-the-scenes influence.
 *
 * Source: Saravali; Jataka Parijata
 */
const ANAPHA_FROM_LAGNA: YogaRule = {
  id: 'anapha-from-lagna',
  name: { en: 'Anapha from Lagna', hi: 'लग्न अनफा योग', sa: 'लग्नानफायोगः' },
  group: 'dhana',
  isAuspicious: true,
  classicalRef: 'Saravali; Jataka Parijata',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      // Planets in 12th house from lagna, excluding Rahu(7)/Ketu(8)
      const planetsIn12 = ctx.planetsInHouse(12).filter((pid) => pid <= 6);

      return {
        present: planetsIn12.length > 0,
        involvedPlanets: planetsIn12,
      };
    },
  },

  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
    let score = 0;
    for (const pid of result.involvedPlanets) {
      if (ctx.isNaturalBenefic(pid)) score += 2;
      const d = ctx.dignity(pid);
      if (d === 'exalted' || d === 'own') score += 1;
      if (d === 'debilitated') score -= 1;
    }

    if (score >= 3) return 'Strong';
    if (score >= 1) return 'Moderate';
    return 'Weak';
  },

  affectedDomains: ['wealth'],
  domainImpactWeight: 1,

  formationRule: {
    en: 'A planet (Sun through Saturn) occupies the 12th house from the ascendant.',
    hi: 'सूर्य से शनि तक कोई ग्रह लग्न से द्वादश भाव में।',
  },

  description: {
    en: 'Anapha from Lagna activates the 12th house — the house of expenditure, foreign lands, and spiritual liberation. A well-placed planet here indicates wealth through foreign connections, behind-the-scenes work, or institutional roles. The native manages resources wisely and often benefits from international dealings or charitable activities.',
    hi: 'लग्न अनफा द्वादश भाव को सक्रिय करता है — व्यय, विदेश और मोक्ष का भाव। यहाँ सुस्थित ग्रह विदेशी संबंधों, पर्दे के पीछे के कार्य या संस्थागत भूमिकाओं से धन का संकेत देता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

/** All 19 Dhana (wealth) yoga rules — BPHS Ch.36 and classical sources */
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
  PARIJATA,
  CHANDRA_MANGAL_DHANA,
  DHANA_AXIS,
  SHANKHA_DHANA,
  CHANDIKA,
  SHRI_KANTHI,
  BHAGYA,
  ANAPHA_FROM_LAGNA,
];
