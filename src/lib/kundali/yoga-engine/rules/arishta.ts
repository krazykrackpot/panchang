/**
 * Arishta (Longevity & Health Affliction) Yoga Rules
 *
 * Yogas relating to health, longevity, disease proneness, and their cancellations.
 * These are sensitive indicators — the presence of Arishta Bhanga (cancellation)
 * yogas is just as important as the arishta itself.
 *
 * Sources: BPHS Ch.34-35, Phaladeepika Ch.7, Jataka Parijata Ch.5, Saravali
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
 * House IDs:  1-12 (1-based, 1=ascendant)
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';
import { KENDRA_HOUSES, DUSTHANA_HOUSES, NATURAL_BENEFIC_IDS } from '../utils';

/** @deprecated Alias — use NATURAL_BENEFIC_IDS from utils.ts */
const NATURAL_BENEFICS = NATURAL_BENEFIC_IDS;

// ─────────────────────────────────────────────────────────────────────────────
// Shared strength assessor
// ─────────────────────────────────────────────────────────────────────────────

function arishtaStrength(ctx: YogaContext, result: YogaDetectionResult): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let severeFactors = 0;
  let mitigatingFactors = 0;

  for (const pid of planets) {
    const dignity = ctx.dignity(pid);
    // For inauspicious yogas, debilitated involved planets make it worse
    if (dignity === 'debilitated') severeFactors += 2;
    if (dignity === 'enemy') severeFactors++;
    if (ctx.isCombust(pid)) severeFactors++;

    // Strong dignity mitigates
    if (dignity === 'exalted' || dignity === 'own' || dignity === 'moolatrikona') mitigatingFactors++;
    if (ctx.isKendra(ctx.planetHouse(pid))) mitigatingFactors++;
  }

  if (severeFactors >= 3 && mitigatingFactors === 0) return 'Strong';
  if (mitigatingFactors >= 2) return 'Weak';
  return 'Moderate';
}

function beneficStrength(ctx: YogaContext, result: YogaDetectionResult): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let strongFactors = 0;
  let weakFactors = 0;

  for (const pid of planets) {
    const dignity = ctx.dignity(pid);
    if (dignity === 'exalted' || dignity === 'moolatrikona') strongFactors += 2;
    if (dignity === 'own') strongFactors++;
    if (ctx.isKendra(ctx.planetHouse(pid))) strongFactors++;
    if (dignity === 'debilitated') weakFactors += 2;
    if (ctx.isCombust(pid)) weakFactors++;
  }

  if (strongFactors >= 3 && weakFactors === 0) return 'Strong';
  if (weakFactors >= 2) return 'Weak';
  return 'Moderate';
}

// ─────────────────────────────────────────────────────────────────────────────
// Arishta Yoga Rules
// ─────────────────────────────────────────────────────────────────────────────

export const ARISHTA_RULES: YogaRule[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Balarishta Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Balarishta Yoga — Early Life Health Challenges
   *
   * Moon in a dusthana (6/8/12) WITHOUT Jupiter's aspect. Indicates
   * vulnerability in early life — health issues, separation from mother,
   * or general frailty during childhood.
   *
   * Cancellations:
   * - Jupiter aspects Moon (protective grace)
   * - Moon in own sign (Cancer) or exalted (Taurus) — inherent strength
   * - Strong lagna lord in kendra — bodily vitality compensates
   *
   * Source: BPHS Ch.35 v.1-3; Jataka Parijata Ch.5
   */
  {
    id: 'balarishta',
    name: { en: 'Balarishta Yoga', hi: 'बालारिष्ट योग', sa: 'बालारिष्टयोगः' },
    group: 'arishta',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.35 v.1-3; Jataka Parijata Ch.5',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const moonHouse = ctx.planetHouse(1);

        // Moon must be in a dusthana
        if (!ctx.isDusthana(moonHouse)) {
          return { present: false, involvedPlanets: [] };
        }

        // Check if Jupiter aspects Moon's house — this cancels the yoga
        const jupiterAspects = ctx.doesAspect(4, moonHouse);
        if (jupiterAspects) {
          return { present: false, involvedPlanets: [] };
        }

        return {
          present: true,
          involvedPlanets: [1], // Moon
          customData: {
            moonHouse,
            moonDignity: ctx.dignity(1),
          },
        };
      },
    },

    assessStrength: arishtaStrength,

    cancellations: [
      {
        condition: {
          type: 'custom',
          detect: (ctx: YogaContext) => {
            // Moon in own sign (Cancer=4) or exalted (Taurus=2)
            const moonSign = ctx.planetSign(1);
            const present = moonSign === 4 || moonSign === 2;
            return { present, involvedPlanets: present ? [1] : [] };
          },
        },
        reason: {
          en: 'Moon in own sign (Cancer) or exalted (Taurus) — inherent lunar strength overrides dusthana placement',
          hi: 'चंद्रमा स्वराशि (कर्क) या उच्च (वृषभ) में — चंद्र की अंतर्निहित शक्ति दुष्ट स्थान को पराजित करती है',
        },
        effect: 'cancel',
      },
      {
        condition: {
          type: 'custom',
          detect: (ctx: YogaContext) => {
            // Strong lagna lord in kendra
            const lagnaLord = ctx.houseLord(1);
            const lagnaLordHouse = ctx.planetHouse(lagnaLord);
            const dignity = ctx.dignity(lagnaLord);
            const inKendra = ctx.isKendra(lagnaLordHouse);
            const isStrong = dignity === 'exalted' || dignity === 'own' || dignity === 'moolatrikona';
            const present = inKendra && isStrong;
            return { present, involvedPlanets: present ? [lagnaLord] : [] };
          },
        },
        reason: {
          en: 'Strong lagna lord in kendra — bodily vitality compensates for lunar weakness',
          hi: 'बलवान लग्न स्वामी केन्द्र में — शारीरिक जीवनशक्ति चंद्र की दुर्बलता की भरपाई करती है',
        },
        effect: 'weaken',
      },
    ],

    affectedDomains: ['health', 'children'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Moon in a dusthana (6th/8th/12th) without Jupiter\'s aspect',
      hi: 'चंद्रमा दुष्ट भाव (6/8/12) में बिना गुरु की दृष्टि के',
    },
    description: {
      en: 'Balarishta Yoga indicates vulnerability during early life — the Moon in a dusthana without Jupiter\'s protective aspect leaves the mind and body exposed during the formative years. The native may experience childhood health challenges, emotional sensitivity, or early separation from the mother. The effects typically diminish after the first Saturn cycle (age ~30). When viewed in a parent\'s chart, it can indicate concern regarding a child\'s early health.',
      hi: 'बालारिष्ट योग प्रारम्भिक जीवन में भेद्यता दर्शाता है — गुरु की सुरक्षात्मक दृष्टि के बिना दुष्ट भाव में चंद्रमा निर्माण वर्षों में मन और शरीर को उजागर छोड़ देता है। जातक को बचपन में स्वास्थ्य चुनौतियाँ, भावनात्मक संवेदनशीलता या माँ से शीघ्र वियोग हो सकता है। प्रभाव आमतौर पर पहले शनि चक्र (लगभग 30 वर्ष) के बाद कम हो जाते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Alpayu Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Alpayu Yoga — Short Lifespan Indicator
   *
   * Lagna lord and 8th lord together in a dusthana. The two most critical
   * longevity factors (body and death/transformation) are both weakened.
   *
   * Source: BPHS Ch.35; Jataka Parijata Ch.5
   */
  {
    id: 'alpayu',
    name: { en: 'Alpayu Yoga', hi: 'अल्पायु योग', sa: 'अल्पायुयोगः' },
    group: 'arishta',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.35; Jataka Parijata Ch.5',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lagnaLord = ctx.houseLord(1);
        const lord8 = ctx.houseLord(8);
        const lagnaLordHouse = ctx.planetHouse(lagnaLord);
        const lord8House = ctx.planetHouse(lord8);

        // Both must be in the same house AND that house must be a dusthana
        const conjunct = lagnaLordHouse === lord8House;
        const inDusthana = ctx.isDusthana(lagnaLordHouse);

        if (!conjunct || !inDusthana) {
          return { present: false, involvedPlanets: [] };
        }

        const involved = lagnaLord === lord8 ? [lagnaLord] : [lagnaLord, lord8];

        return {
          present: true,
          involvedPlanets: involved,
          customData: { house: lagnaLordHouse },
        };
      },
    },

    assessStrength: arishtaStrength,

    affectedDomains: ['health'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Lagna lord and 8th lord conjunct in a dusthana (6th/8th/12th)',
      hi: 'लग्न स्वामी और अष्टम स्वामी दुष्ट भाव (6/8/12) में युति',
    },
    description: {
      en: 'Alpayu Yoga is a serious longevity indicator — when the lords of both the body (1st) and transformation/death (8th) are together in a house of suffering, the vital force is significantly weakened. This does not predict a specific lifespan but signals heightened vulnerability to health crises. The native should prioritise preventive healthcare and lifestyle discipline. Benefic aspects or strong cancellation yogas (Arishta Bhanga) can substantially mitigate this.',
      hi: 'अल्पायु योग एक गम्भीर दीर्घायु सूचक है — जब शरीर (1ला) और मृत्यु/परिवर्तन (8वें) दोनों के स्वामी पीड़ा के भाव में एक साथ हों, तो जीवन शक्ति महत्वपूर्ण रूप से कमज़ोर होती है। यह किसी विशिष्ट आयु की भविष्यवाणी नहीं करता बल्कि स्वास्थ्य संकटों के प्रति बढ़ी हुई संवेदनशीलता का संकेत देता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Madhyayu Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Madhyayu Yoga — Medium Lifespan
   *
   * 8th lord in a kendra but with mixed influences — benefic and malefic
   * aspects creating a balanced longevity. Neither short nor long life.
   *
   * Source: BPHS Ch.35; Phaladeepika Ch.7
   */
  {
    id: 'madhyayu',
    name: { en: 'Madhyayu Yoga', hi: 'मध्यायु योग', sa: 'मध्यायुयोगः' },
    group: 'arishta',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.35; Phaladeepika Ch.7',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lord8 = ctx.houseLord(8);
        const lord8House = ctx.planetHouse(lord8);

        // 8th lord must be in a kendra
        if (!ctx.isKendra(lord8House)) {
          return { present: false, involvedPlanets: [] };
        }

        // Check for mixed influences — both benefic and malefic aspects
        let beneficAspects = 0;
        let maleficAspects = 0;

        for (let pid = 0; pid <= 6; pid++) {
          if (pid === lord8) continue;
          if (ctx.doesAspect(pid, lord8House)) {
            if (ctx.isNaturalBenefic(pid)) beneficAspects++;
            else maleficAspects++;
          }
        }

        // Mixed = at least one of each, OR 8th lord is neither strong nor weak
        const dignity = ctx.dignity(lord8);
        const isNeutralDignity = dignity === 'neutral' || dignity === 'friend' || dignity === 'enemy';
        const hasMixedAspects = beneficAspects > 0 && maleficAspects > 0;
        const present = hasMixedAspects || isNeutralDignity;

        return {
          present,
          involvedPlanets: present ? [lord8] : [],
          customData: present ? { lord8House, beneficAspects, maleficAspects, dignity } : undefined,
        };
      },
    },

    assessStrength: (_ctx: YogaContext, _result: YogaDetectionResult) => 'Moderate' as const,

    affectedDomains: ['health'],
    domainImpactWeight: 1,

    formationRule: {
      en: '8th lord in a kendra with mixed benefic and malefic influences',
      hi: 'अष्टम स्वामी केन्द्र में शुभ और अशुभ दोनों प्रभावों के साथ',
    },
    description: {
      en: 'Madhyayu Yoga indicates a moderate lifespan — the 8th lord in a kendra gives stability, but mixed influences prevent either exceptionally long or short life. The native typically enjoys reasonable health with periodic challenges that are manageable. This is neither a blessing nor an affliction but rather a balanced indicator. Focus on consistent health maintenance rather than dramatic interventions.',
      hi: 'मध्यायु योग मध्यम आयु दर्शाता है — केन्द्र में 8वें का स्वामी स्थिरता देता है, लेकिन मिश्रित प्रभाव न तो अत्यधिक लम्बी न ही छोटी आयु देते हैं। जातक सामान्यतः उचित स्वास्थ्य का आनंद लेता है जिसमें समय-समय पर प्रबंधनीय चुनौतियाँ आती हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Deerghayu Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Deerghayu Yoga — Long Life
   *
   * 8th lord strong (own/exalted) in a kendra, aspected by a natural benefic.
   * The longevity house lord is empowered and protected.
   *
   * Source: BPHS Ch.35; Phaladeepika Ch.7
   */
  {
    id: 'deerghayu',
    name: { en: 'Deerghayu Yoga', hi: 'दीर्घायु योग', sa: 'दीर्घायुयोगः' },
    group: 'arishta',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.35; Phaladeepika Ch.7',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lord8 = ctx.houseLord(8);
        const lord8House = ctx.planetHouse(lord8);
        const dignity = ctx.dignity(lord8);

        // 8th lord must be in kendra
        if (!ctx.isKendra(lord8House)) {
          return { present: false, involvedPlanets: [] };
        }

        // 8th lord must be strong (own/exalted/moolatrikona)
        const isStrong = dignity === 'exalted' || dignity === 'own' || dignity === 'moolatrikona';
        if (!isStrong) {
          return { present: false, involvedPlanets: [] };
        }

        // Must be aspected by at least one natural benefic
        let beneficAspecting = false;
        const aspectingBenefics: number[] = [];
        for (const bid of NATURAL_BENEFICS) {
          if (bid === lord8) continue;
          if (ctx.doesAspect(bid, lord8House)) {
            beneficAspecting = true;
            aspectingBenefics.push(bid);
          }
        }

        if (!beneficAspecting) {
          return { present: false, involvedPlanets: [] };
        }

        return {
          present: true,
          involvedPlanets: [lord8, ...aspectingBenefics],
          customData: { lord8House, dignity, aspectingBenefics },
        };
      },
    },

    assessStrength: beneficStrength,

    affectedDomains: ['health'],
    domainImpactWeight: 1,

    formationRule: {
      en: '8th lord strong (own/exalted) in a kendra, aspected by a natural benefic',
      hi: 'अष्टम स्वामी बलवान (स्वराशि/उच्च) केन्द्र में, शुभ ग्रह की दृष्टि के साथ',
    },
    description: {
      en: 'Deerghayu Yoga blesses the native with a long and robust life. The 8th lord — custodian of longevity — is empowered in a kendra with natural strength and benefic protection. The native recovers well from illnesses, has good stamina, and typically enjoys vitality well into advanced age. This yoga also indicates resilience in times of crisis.',
      hi: 'दीर्घायु योग जातक को लम्बे और स्वस्थ जीवन का आशीर्वाद देता है। 8वें भाव का स्वामी — दीर्घायु का संरक्षक — केन्द्र में प्राकृतिक बल और शुभ सुरक्षा के साथ सशक्त है। जातक बीमारियों से अच्छी तरह उबरता है और वृद्धावस्था में भी जीवन शक्ति का आनंद लेता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Arishta Bhanga Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Arishta Bhanga (Cancellation of Affliction) Yoga
   *
   * Protective factors that cancel health/longevity afflictions:
   * - Strong lagna lord in kendra (strong body)
   * - Jupiter aspects lagna (divine protection)
   * - Benefics in kendras (general shield)
   *
   * At least 2 of 3 conditions must be met for full cancellation.
   *
   * Source: BPHS Ch.35 v.5-6; Phaladeepika Ch.7
   */
  {
    id: 'arishta-bhanga',
    name: { en: 'Arishta Bhanga Yoga', hi: 'अरिष्ट भंग योग', sa: 'अरिष्टभङ्गयोगः' },
    group: 'arishta',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.35 v.5-6; Phaladeepika Ch.7',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involvedPlanets: number[] = [];
        let conditionsMet = 0;

        // Condition 1: Strong lagna lord in kendra
        const lagnaLord = ctx.houseLord(1);
        const lagnaLordHouse = ctx.planetHouse(lagnaLord);
        const lagnaLordDignity = ctx.dignity(lagnaLord);
        const lagnaLordStrong =
          ctx.isKendra(lagnaLordHouse) &&
          (lagnaLordDignity === 'exalted' || lagnaLordDignity === 'own' || lagnaLordDignity === 'moolatrikona');
        if (lagnaLordStrong) {
          conditionsMet++;
          involvedPlanets.push(lagnaLord);
        }

        // Condition 2: Jupiter aspects lagna (house 1)
        const jupiterAspectsLagna = ctx.doesAspect(4, 1);
        if (jupiterAspectsLagna) {
          conditionsMet++;
          if (!involvedPlanets.includes(4)) involvedPlanets.push(4);
        }

        // Condition 3: Benefics in kendras (at least 2)
        let beneficsInKendras = 0;
        const kendras = [1, 4, 7, 10];
        for (const kh of kendras) {
          const planets = ctx.planetsInHouse(kh);
          for (const pid of planets) {
            if (ctx.isNaturalBenefic(pid)) {
              beneficsInKendras++;
              if (!involvedPlanets.includes(pid)) involvedPlanets.push(pid);
            }
          }
        }
        if (beneficsInKendras >= 2) conditionsMet++;

        // At least 2 of 3 conditions for full formation
        const present = conditionsMet >= 2;

        return {
          present,
          involvedPlanets: present ? involvedPlanets : [],
          customData: present
            ? {
                lagnaLordStrong,
                jupiterAspectsLagna,
                beneficsInKendras,
                conditionsMet,
              }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { conditionsMet?: number } | undefined;
      const met = data?.conditionsMet ?? 0;
      if (met === 3) return 'Strong';
      return beneficStrength(ctx, result);
    },

    affectedDomains: ['health'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'At least 2 of: strong lagna lord in kendra, Jupiter aspects lagna, 2+ benefics in kendras — cancels health afflictions',
      hi: 'कम से कम 2: बलवान लग्न स्वामी केन्द्र में, गुरु की लग्न पर दृष्टि, 2+ शुभ ग्रह केन्द्रों में — स्वास्थ्य पीड़ा का निवारण',
    },
    description: {
      en: 'Arishta Bhanga Yoga is a powerful protective combination that cancels or substantially weakens health and longevity afflictions present elsewhere in the chart. A strong lagna lord anchors the physical body, Jupiter\'s aspect on the ascendant brings divine protection, and benefics in kendras create a general shield against adversity. When all three conditions are met, even severe arishtas lose most of their potency.',
      hi: 'अरिष्ट भंग योग एक शक्तिशाली सुरक्षात्मक संयोजन है जो कुंडली में अन्यत्र उपस्थित स्वास्थ्य और दीर्घायु पीड़ाओं को निरस्त या काफी कमज़ोर करता है। बलवान लग्न स्वामी शारीरिक शरीर को स्थिर करता है, लग्न पर गुरु की दृष्टि दैवी सुरक्षा लाती है, और केन्द्रों में शुभ ग्रह विपत्ति के विरुद्ध सामान्य ढाल बनाते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Roga Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Roga Yoga — Disease Proneness
   *
   * 6th lord in lagna, or lagna lord in 6th. The disease house (6th)
   * and body house (1st) are linked, creating chronic health vulnerability.
   *
   * Source: BPHS Ch.35; Saravali
   */
  {
    id: 'roga-yoga',
    name: { en: 'Roga Yoga', hi: 'रोग योग', sa: 'रोगयोगः' },
    group: 'arishta',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.35; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lord6 = ctx.houseLord(6);
        const lagnaLord = ctx.houseLord(1);

        const lord6InLagna = ctx.planetHouse(lord6) === 1;
        const lagnaLordIn6 = ctx.planetHouse(lagnaLord) === 6;

        // Either condition forms the yoga
        const present = lord6InLagna || lagnaLordIn6;
        if (!present) return { present: false, involvedPlanets: [] };

        const involved = [
          ...(lord6InLagna ? [lord6] : []),
          ...(lagnaLordIn6 ? [lagnaLord] : []),
        ];
        const uniquePlanets = [...new Set(involved)];

        return {
          present: true,
          involvedPlanets: uniquePlanets,
          customData: {
            lord6InLagna,
            lagnaLordIn6,
            // Both conditions simultaneously = stronger affliction
            bothPresent: lord6InLagna && lagnaLordIn6,
          },
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { bothPresent?: boolean } | undefined;
      // Both conditions = severe
      if (data?.bothPresent) return 'Strong';
      return arishtaStrength(ctx, result);
    },

    cancellations: [
      {
        condition: {
          type: 'custom',
          detect: (ctx: YogaContext) => {
            // Jupiter aspects lagna — mitigates disease proneness
            const present = ctx.doesAspect(4, 1);
            return { present, involvedPlanets: present ? [4] : [] };
          },
        },
        reason: {
          en: 'Jupiter aspects the lagna — divine protection mitigates disease proneness',
          hi: 'गुरु की लग्न पर दृष्टि — दैवी सुरक्षा रोग प्रवृत्ति को कम करती है',
        },
        effect: 'weaken',
      },
    ],

    affectedDomains: ['health'],
    domainImpactWeight: 2,

    formationRule: {
      en: '6th lord in lagna, or lagna lord in 6th — the disease and body houses are linked',
      hi: '6ठे का स्वामी लग्न में, या लग्न स्वामी 6ठे में — रोग और शरीर भाव जुड़े हुए',
    },
    description: {
      en: 'Roga Yoga links the house of disease (6th) with the house of the body (1st), creating a constitutional tendency towards health issues. The native may be prone to chronic or recurring ailments rather than acute emergencies. The specific nature of health challenges is indicated by the planets involved and the signs occupied. When both conditions are present simultaneously (6th lord in 1st AND 1st lord in 6th — a mutual exchange), the affliction is significantly stronger.',
      hi: 'रोग योग रोग भाव (6ठा) और शरीर भाव (1ला) को जोड़ता है, स्वास्थ्य समस्याओं की ओर संवैधानिक प्रवृत्ति बनाता है। जातक को तीव्र आपातकाल के बजाय दीर्घकालिक या बार-बार होने वाली बीमारियों का खतरा हो सकता है। जब दोनों स्थितियाँ एक साथ उपस्थित हों (6ठे का स्वामी 1ले में और 1ले का स्वामी 6ठे में), तो पीड़ा काफी प्रबल होती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Balarishta (Moon Afflicted)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Balarishta (Moon) — Moon in 6th/8th/12th afflicted by malefic, without benefic aspect
   *
   * A more specific variant of Balarishta: Moon in dusthana AND aspected by
   * a natural malefic, with NO benefic aspect to counterbalance.
   *
   * Source: BPHS Ch.35 v.1-3; Jataka Parijata Ch.5
   */
  {
    id: 'balarishta-moon',
    name: { en: 'Balarishta (Moon)', hi: 'बालारिष्ट (चंद्र)', sa: 'बालारिष्टयोगः (चन्द्रः)' },
    group: 'arishta',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.35 v.1-3; Jataka Parijata Ch.5',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const moonHouse = ctx.planetHouse(1);
        if (!ctx.isDusthana(moonHouse)) {
          return { present: false, involvedPlanets: [] };
        }

        // Check malefic aspect on Moon's house (Sun=0, Mars=2, Saturn=6, Rahu=7, Ketu=8)
        const MALEFIC_IDS = [0, 2, 6, 7, 8];
        let hasMaleficAspect = false;
        const aspectingMalefics: number[] = [];
        for (const mid of MALEFIC_IDS) {
          if (ctx.doesAspect(mid, moonHouse)) {
            hasMaleficAspect = true;
            aspectingMalefics.push(mid);
          }
        }

        if (!hasMaleficAspect) {
          return { present: false, involvedPlanets: [] };
        }

        // Check if any benefic aspects Moon's house — cancels if so
        const BENEFIC_IDS = [3, 4, 5]; // Mercury, Jupiter, Venus (Moon itself excluded)
        let hasBeneficAspect = false;
        for (const bid of BENEFIC_IDS) {
          if (ctx.doesAspect(bid, moonHouse)) {
            hasBeneficAspect = true;
            break;
          }
        }

        if (hasBeneficAspect) {
          return { present: false, involvedPlanets: [] };
        }

        return {
          present: true,
          involvedPlanets: [1, ...aspectingMalefics],
          customData: { moonHouse, aspectingMalefics },
        };
      },
    },

    assessStrength: arishtaStrength,

    affectedDomains: ['health', 'children'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Moon in 6th/8th/12th afflicted by a malefic aspect, without any benefic aspect',
      hi: 'चंद्रमा 6/8/12वें भाव में पापग्रह की दृष्टि से पीड़ित, बिना किसी शुभ दृष्टि के',
    },
    description: {
      en: 'This variant of Balarishta is more specific than the basic form: Moon is not merely in a dusthana, but actively afflicted by malefic aspects with no benefic counterbalance. Childhood health issues are more pronounced — potentially frequent illnesses, emotional disturbances, or difficulty in the early learning environment. The native needs extra care during formative years.',
      hi: 'बालारिष्ट का यह रूप मूल रूप से अधिक विशिष्ट है: चंद्रमा न केवल दुष्ट भाव में है, बल्कि बिना शुभ संतुलन के पापग्रह दृष्टि से सक्रिय रूप से पीड़ित भी है। बचपन की स्वास्थ्य समस्याएँ अधिक स्पष्ट होती हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Balarishta (Extended)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Balarishta (Extended) — Lagna lord weak + malefic in lagna + no benefic aspect
   *
   * A broader Balarishta: the body itself is afflicted (weak lagna lord),
   * malefics occupy the ascendant, and no benefic aspects the lagna.
   *
   * Source: BPHS Ch.35; Saravali
   */
  {
    id: 'balarishta-extended',
    name: { en: 'Balarishta (Extended)', hi: 'बालारिष्ट (विस्तृत)', sa: 'बालारिष्टयोगः (विस्तृतः)' },
    group: 'arishta',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.35; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lagnaLord = ctx.houseLord(1);
        const lagnaLordDignity = ctx.dignity(lagnaLord);

        // Lagna lord must be weak (debilitated, enemy, or combust)
        const isWeak =
          lagnaLordDignity === 'debilitated' ||
          lagnaLordDignity === 'enemy' ||
          ctx.isCombust(lagnaLord);

        if (!isWeak) return { present: false, involvedPlanets: [] };

        // Malefic in lagna
        const MALEFIC_IDS = [0, 2, 6, 7, 8];
        const planetsInLagna = ctx.planetsInHouse(1);
        const maleficsInLagna = planetsInLagna.filter(pid => MALEFIC_IDS.includes(pid));

        if (maleficsInLagna.length === 0) return { present: false, involvedPlanets: [] };

        // No benefic aspect on lagna
        const BENEFIC_IDS = [3, 4, 5]; // Mercury, Jupiter, Venus
        let hasBeneficAspect = false;
        for (const bid of BENEFIC_IDS) {
          if (ctx.doesAspect(bid, 1)) {
            hasBeneficAspect = true;
            break;
          }
        }

        if (hasBeneficAspect) return { present: false, involvedPlanets: [] };

        return {
          present: true,
          involvedPlanets: [lagnaLord, ...maleficsInLagna],
          customData: { lagnaLordDignity, maleficsInLagna },
        };
      },
    },

    assessStrength: arishtaStrength,

    affectedDomains: ['health'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Lagna lord weak (debilitated/enemy/combust) + malefic in lagna + no benefic aspect on lagna',
      hi: 'लग्न स्वामी कमज़ोर (नीच/शत्रु/अस्त) + लग्न में पापग्रह + लग्न पर कोई शुभ दृष्टि नहीं',
    },
    description: {
      en: 'This extended Balarishta identifies a triple vulnerability: the lagna lord is weak, a malefic sits in the ascendant, and no benefic rescues through aspect. The body house is thoroughly compromised. Childhood and general constitutional health are both at risk. Remedies should focus on strengthening the lagna lord.',
      hi: 'यह विस्तृत बालारिष्ट तीन स्तरीय भेद्यता की पहचान करता है: लग्न स्वामी कमज़ोर है, पापग्रह लग्न में बैठा है, और कोई शुभ ग्रह दृष्टि से रक्षा नहीं करता। शरीर भाव पूरी तरह समझौता किया हुआ है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 9. Pitru Arishta
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Pitru Arishta — Father's health/relationship issues
   *
   * 9th lord in a dusthana OR Sun afflicted by Saturn.
   * The 9th house represents the father — afflictions here indicate
   * challenges in the father's health or the native's relationship with him.
   *
   * Source: BPHS Ch.35; Jataka Parijata
   */
  {
    id: 'pitru-arishta',
    name: { en: 'Pitru Arishta', hi: 'पितृ अरिष्ट', sa: 'पित्रारिष्टम्' },
    group: 'arishta',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.35; Jataka Parijata',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lord9 = ctx.houseLord(9);
        const lord9House = ctx.planetHouse(lord9);
        const lord9InDusthana = ctx.isDusthana(lord9House);

        // Sun afflicted by Saturn (conjunction or aspect)
        const sunSaturnConjunct = ctx.areConjunct(0, 6); // Sun=0, Saturn=6
        const saturnAspectsSun = ctx.doesAspect(6, ctx.planetHouse(0));
        const sunAfflictedBySaturn = sunSaturnConjunct || saturnAspectsSun;

        const present = lord9InDusthana || sunAfflictedBySaturn;
        if (!present) return { present: false, involvedPlanets: [] };

        const involved: number[] = [];
        if (lord9InDusthana) involved.push(lord9);
        if (sunAfflictedBySaturn) involved.push(0, 6);

        return {
          present: true,
          involvedPlanets: [...new Set(involved)],
          customData: { lord9InDusthana, sunAfflictedBySaturn },
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { lord9InDusthana?: boolean; sunAfflictedBySaturn?: boolean } | undefined;
      if (data?.lord9InDusthana && data?.sunAfflictedBySaturn) return 'Strong';
      return arishtaStrength(ctx, result);
    },

    affectedDomains: ['family'],
    domainImpactWeight: 2,

    formationRule: {
      en: '9th lord in a dusthana (6/8/12) OR Sun afflicted by Saturn (conjunction or aspect)',
      hi: '9वें भाव का स्वामी दुष्ट भाव (6/8/12) में या सूर्य शनि से पीड़ित (युति या दृष्टि)',
    },
    description: {
      en: 'Pitru Arishta indicates challenges related to the father — his health, longevity, or the native\'s relationship with him. The 9th house (father, dharma, fortune) is compromised through its lord\'s dusthana placement or through Sun (natural karaka for father) being afflicted by Saturn. The native may experience early separation from the father, estrangement, or witness the father\'s health struggles.',
      hi: 'पितृ अरिष्ट पिता से संबंधित चुनौतियों का संकेत देता है — उनका स्वास्थ्य, दीर्घायु, या जातक का उनके साथ संबंध। 9वें भाव (पिता, धर्म, भाग्य) का स्वामी दुष्ट भाव में या सूर्य (पिता का प्राकृतिक कारक) शनि से पीड़ित होने पर जातक को पिता से शीघ्र वियोग या उनके स्वास्थ्य संघर्ष का अनुभव हो सकता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 10. Matru Arishta
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Matru Arishta — Mother's health/relationship issues
   *
   * 4th lord in a dusthana OR Moon afflicted by Saturn/Rahu.
   * The 4th house represents the mother — afflictions here indicate
   * challenges in the mother's health or emotional well-being.
   *
   * Source: BPHS Ch.35; Saravali
   */
  {
    id: 'matru-arishta',
    name: { en: 'Matru Arishta', hi: 'मातृ अरिष्ट', sa: 'मात्रारिष्टम्' },
    group: 'arishta',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.35; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lord4 = ctx.houseLord(4);
        const lord4House = ctx.planetHouse(lord4);
        const lord4InDusthana = ctx.isDusthana(lord4House);

        // Moon afflicted by Saturn or Rahu (conjunction or aspect)
        const moonHouse = ctx.planetHouse(1);
        const moonSaturnConjunct = ctx.areConjunct(1, 6);
        const saturnAspectsMoon = ctx.doesAspect(6, moonHouse);
        const moonRahuConjunct = ctx.areConjunct(1, 7);
        const moonAfflicted = moonSaturnConjunct || saturnAspectsMoon || moonRahuConjunct;

        const present = lord4InDusthana || moonAfflicted;
        if (!present) return { present: false, involvedPlanets: [] };

        const involved: number[] = [];
        if (lord4InDusthana) involved.push(lord4);
        if (moonAfflicted) {
          involved.push(1);
          if (moonSaturnConjunct || saturnAspectsMoon) involved.push(6);
          if (moonRahuConjunct) involved.push(7);
        }

        return {
          present: true,
          involvedPlanets: [...new Set(involved)],
          customData: { lord4InDusthana, moonAfflicted },
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { lord4InDusthana?: boolean; moonAfflicted?: boolean } | undefined;
      if (data?.lord4InDusthana && data?.moonAfflicted) return 'Strong';
      return arishtaStrength(ctx, result);
    },

    affectedDomains: ['family'],
    domainImpactWeight: 2,

    formationRule: {
      en: '4th lord in a dusthana (6/8/12) OR Moon afflicted by Saturn/Rahu (conjunction or aspect)',
      hi: '4थे भाव का स्वामी दुष्ट भाव (6/8/12) में या चंद्रमा शनि/राहु से पीड़ित (युति या दृष्टि)',
    },
    description: {
      en: 'Matru Arishta indicates challenges related to the mother — her health, emotional state, or the native\'s relationship with her. The 4th house (mother, home, emotional foundation) is compromised through its lord\'s dusthana placement or through Moon (natural karaka for mother) being afflicted by Saturn or Rahu. The native may experience difficulties in the home environment or maternal health concerns.',
      hi: 'मातृ अरिष्ट माता से संबंधित चुनौतियों का संकेत देता है — उनका स्वास्थ्य, भावनात्मक स्थिति, या जातक का उनके साथ संबंध। 4थे भाव (माता, गृह, भावनात्मक आधार) का स्वामी दुष्ट भाव में या चंद्रमा (माता का प्राकृतिक कारक) शनि या राहु से पीड़ित होने पर जातक को गृह वातावरण या मातृ स्वास्थ्य की चिंताओं का अनुभव हो सकता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 11. Roga Yoga (6-in-1)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Roga Yoga (6th lord in 1st) — Disease Proneness (targeted variant)
   *
   * Specifically: 6th lord in the 1st house. The disease house lord
   * directly occupies the body house — more focused than the exchange variant.
   *
   * Source: BPHS Ch.35; Phaladeepika
   */
  {
    id: 'roga-yoga-6-in-1',
    name: { en: 'Roga Yoga (6-in-1)', hi: 'रोग योग (6 में 1)', sa: 'रोगयोगः (षष्ठे प्रथमे)' },
    group: 'arishta',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.35; Phaladeepika',

    conditions: {
      type: 'lord_in_house',
      lordOfHouse: 6,
      inHouses: [1],
    },

    assessStrength: (ctx: YogaContext, _result: YogaDetectionResult) => {
      const lord6 = ctx.houseLord(6);
      const dignity = ctx.dignity(lord6);
      // Stronger when 6th lord is also strong (can inflict more disease)
      if (dignity === 'exalted' || dignity === 'own') return 'Strong';
      if (dignity === 'debilitated') return 'Weak';
      return 'Moderate';
    },

    cancellations: [
      {
        condition: {
          type: 'custom',
          detect: (ctx: YogaContext) => {
            const present = ctx.doesAspect(4, 1); // Jupiter aspects lagna
            return { present, involvedPlanets: present ? [4] : [] };
          },
        },
        reason: {
          en: 'Jupiter aspects lagna — divine protection mitigates disease proneness',
          hi: 'गुरु की लग्न पर दृष्टि — दैवी सुरक्षा रोग प्रवृत्ति को कम करती है',
        },
        effect: 'weaken',
      },
    ],

    affectedDomains: ['health'],
    domainImpactWeight: 2,

    formationRule: {
      en: '6th lord placed directly in the 1st house (lagna) — disease lord occupies the body house',
      hi: '6ठे भाव का स्वामी सीधे 1ले भाव (लग्न) में — रोग का स्वामी शरीर भाव में',
    },
    description: {
      en: 'This focused variant of Roga Yoga places the 6th lord (disease, enemies, debts) directly in the lagna (body, self). The native\'s constitution is inherently vulnerable to illness. The type of illness is indicated by the 6th lord\'s nature: Mars → inflammatory, Saturn → chronic, Mercury → nervous, Venus → reproductive. A strong 6th lord paradoxically makes the yoga more potent — a powerful disease lord creates stronger health challenges.',
      hi: 'रोग योग का यह केंद्रित रूप 6ठे स्वामी (रोग, शत्रु, ऋण) को सीधे लग्न (शरीर, आत्म) में रखता है। जातक का शरीर स्वाभाविक रूप से बीमारी के प्रति संवेदनशील है। रोग का प्रकार 6ठे स्वामी की प्रकृति से संकेतित होता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 12. Arishta Bhanga (Extended)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Arishta Bhanga (Extended) — Strong cancellation of health afflictions
   *
   * Strong lagna lord + benefic aspects on lagna + Jupiter strong.
   * A more robust version: requires Jupiter itself to be dignified
   * in addition to aspecting the lagna.
   *
   * Source: BPHS Ch.35 v.5-6; Phaladeepika
   */
  {
    id: 'arishta-bhanga-extended',
    name: { en: 'Arishta Bhanga (Extended)', hi: 'अरिष्ट भंग (विस्तृत)', sa: 'अरिष्टभङ्गयोगः (विस्तृतः)' },
    group: 'arishta',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.35 v.5-6; Phaladeepika',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involvedPlanets: number[] = [];

        // Condition 1: Strong lagna lord (own/exalted/moolatrikona)
        const lagnaLord = ctx.houseLord(1);
        const lagnaLordDignity = ctx.dignity(lagnaLord);
        const lagnaLordStrong =
          lagnaLordDignity === 'exalted' ||
          lagnaLordDignity === 'own' ||
          lagnaLordDignity === 'moolatrikona';
        if (!lagnaLordStrong) return { present: false, involvedPlanets: [] };
        involvedPlanets.push(lagnaLord);

        // Condition 2: Benefic aspects on lagna
        let beneficAspectCount = 0;
        for (const bid of NATURAL_BENEFICS) {
          if (ctx.doesAspect(bid, 1)) {
            beneficAspectCount++;
            if (!involvedPlanets.includes(bid)) involvedPlanets.push(bid);
          }
        }
        if (beneficAspectCount === 0) return { present: false, involvedPlanets: [] };

        // Condition 3: Jupiter strong (own/exalted/moolatrikona or in kendra)
        const jupDignity = ctx.dignity(4);
        const jupHouse = ctx.planetHouse(4);
        const jupiterStrong =
          jupDignity === 'exalted' ||
          jupDignity === 'own' ||
          jupDignity === 'moolatrikona' ||
          ctx.isKendra(jupHouse);
        if (!jupiterStrong) return { present: false, involvedPlanets: [] };
        if (!involvedPlanets.includes(4)) involvedPlanets.push(4);

        return {
          present: true,
          involvedPlanets,
          customData: { lagnaLordDignity, beneficAspectCount, jupDignity, jupHouse },
        };
      },
    },

    assessStrength: beneficStrength,

    affectedDomains: ['health'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Strong lagna lord (own/exalted) + benefic aspect on lagna + Jupiter strong (dignified or in kendra)',
      hi: 'बलवान लग्न स्वामी (स्वराशि/उच्च) + लग्न पर शुभ दृष्टि + गुरु बलवान (गरिमामय या केन्द्र में)',
    },
    description: {
      en: 'This extended Arishta Bhanga is a robust health-protection combination. It requires three simultaneous conditions: (1) a dignified lagna lord anchoring the body, (2) benefic aspects protecting the ascendant, and (3) Jupiter — the great benefic — itself being strong. When all three are present, even severe arishtas in the chart are substantially neutralised. The native possesses remarkable resilience and recovers from health crises that would debilitate others.',
      hi: 'यह विस्तृत अरिष्ट भंग एक मज़बूत स्वास्थ्य-सुरक्षा संयोजन है। इसके लिए तीन एक साथ शर्तें आवश्यक हैं: (1) गरिमामय लग्न स्वामी शरीर को स्थिर करे, (2) शुभ दृष्टि लग्न की रक्षा करे, (3) गुरु — महान शुभ ग्रह — स्वयं बलवान हो। तीनों उपस्थित होने पर गम्भीर अरिष्ट भी काफी हद तक निष्प्रभावी हो जाते हैं।',
    },
  },
];
