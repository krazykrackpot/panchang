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

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const KENDRA_HOUSES = [1, 4, 7, 10];
const DUSTHANA_HOUSES = [6, 8, 12];

/** Natural benefic planet IDs: Moon(1), Mercury(3), Jupiter(4), Venus(5) */
const NATURAL_BENEFICS = [1, 3, 4, 5];

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
];
