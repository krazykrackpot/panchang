/**
 * Planet Conjunction Yoga Rules
 *
 * Yogas formed when specific planets occupy the same house (rashi conjunction).
 * These are among the most commonly observed combinations in practical Jyotish,
 * producing distinct personality traits and life outcomes based on the planetary
 * energies blending together.
 *
 * Sources: BPHS Ch.35, Saravali, Phaladeepika Ch.6
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Sign IDs:   1=Aries through 12=Pisces (1-based)
 * House IDs:  1-12 (1-based, 1=ascendant)
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Shared strength assessors
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Standard conjunction strength: Strong if in kendra/trikona with good dignity,
 * Weak if in dusthana or both planets debilitated, Moderate otherwise.
 */
function conjunctionStrength(
  ctx: YogaContext,
  result: YogaDetectionResult,
): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let strongFactors = 0;
  let weakFactors = 0;

  for (const pid of planets) {
    const house = ctx.planetHouse(pid);
    const dignity = ctx.dignity(pid);

    if (ctx.isKendra(house) || ctx.isTrikona(house)) strongFactors++;
    if (dignity === 'exalted' || dignity === 'own' || dignity === 'moolatrikona') strongFactors++;
    if (ctx.isDusthana(house)) weakFactors++;
    if (dignity === 'debilitated') weakFactors++;
    if (ctx.isCombust(pid)) weakFactors++;
  }

  if (strongFactors >= 2 && weakFactors === 0) return 'Strong';
  if (weakFactors >= 2) return 'Weak';
  return 'Moderate';
}

/**
 * Inauspicious conjunction strength: Strong when afflicting planets are dignified
 * (more potent malefic effect), Weak when debilitated or combust.
 */
function inauspiciousConjunctionStrength(
  ctx: YogaContext,
  result: YogaDetectionResult,
): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let strongFactors = 0;
  let weakFactors = 0;

  for (const pid of planets) {
    const house = ctx.planetHouse(pid);
    const dignity = ctx.dignity(pid);

    // Malefic conjunction is STRONGER when planets are dignified (more powerful to cause harm)
    if (ctx.isKendra(house)) strongFactors++;
    if (dignity === 'exalted' || dignity === 'own' || dignity === 'moolatrikona') strongFactors++;
    // Weaker when debilitated (less energy to cause harm)
    if (dignity === 'debilitated') weakFactors++;
    if (ctx.isCombust(pid)) weakFactors++;
  }

  if (strongFactors >= 2) return 'Strong';
  if (weakFactors >= 2) return 'Weak';
  return 'Moderate';
}

// ─────────────────────────────────────────────────────────────────────────────
// Conjunction Rules
// ─────────────────────────────────────────────────────────────────────────────

export const CONJUNCTION_RULES: YogaRule[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Guru-Mangal Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Guru-Mangal Yoga — Jupiter conjunct Mars
   *
   * Jupiter's wisdom combined with Mars's courage and action. Produces righteous
   * warriors, disciplined leaders, and courageous spiritual seekers. The native
   * takes principled action and fights for dharma.
   *
   * Source: BPHS Ch.35; Saravali
   */
  {
    id: 'guru-mangal',
    name: { en: 'Guru-Mangal Yoga', hi: 'गुरु-मंगल योग', sa: 'गुरुमङ्गलयोगः' },
    group: 'conjunction',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.35; Saravali',

    conditions: {
      type: 'conjunction',
      planet1: 4, // Jupiter
      planet2: 2, // Mars
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const house = ctx.planetHouse(4); // Jupiter's house (conjunction house)
      // Strong if in kendra or trikona — both planets' energies are well-placed
      if (ctx.isKendra(house) || ctx.isTrikona(house)) return 'Strong';
      // Weak if in dusthana — courage is misdirected
      if (ctx.isDusthana(house)) return 'Weak';
      return 'Moderate';
    },

    affectedDomains: ['career', 'spiritual'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Jupiter and Mars conjunct in the same house',
      hi: 'गुरु और मंगल एक ही भाव में युति',
    },
    description: {
      en: 'Guru-Mangal Yoga combines wisdom with courage. The native is blessed with righteous action, principled leadership, and the ability to fight for just causes. Excellent for careers in law, military leadership, sports coaching, or spiritual teaching. The conjunction is strongest in angular houses where both energies have maximum expression.',
      hi: 'गुरु-मंगल योग ज्ञान और साहस का संगम है। जातक को धार्मिक कर्म, सिद्धांतवादी नेतृत्व और न्यायपूर्ण कार्यों के लिए लड़ने की क्षमता प्राप्त होती है। कानून, सैन्य नेतृत्व, खेल प्रशिक्षण या आध्यात्मिक शिक्षण में उत्कृष्ट करियर।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Guru-Shukra Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Guru-Shukra Yoga — Jupiter conjunct Venus
   *
   * A complex conjunction: Jupiter and Venus are natural enemies (per BPHS Ch.3).
   * Jupiter represents dharma, expansion, higher knowledge; Venus represents kama,
   * luxury, material comfort. Their conjunction produces wealth but creates tension
   * between spiritual values and material desires.
   *
   * Despite the enmity, the combination IS wealth-producing — both are benefics.
   *
   * Source: Saravali; Phaladeepika Ch.6
   */
  {
    id: 'guru-shukra',
    name: { en: 'Guru-Shukra Yoga', hi: 'गुरु-शुक्र योग', sa: 'गुरुशुक्रयोगः' },
    group: 'conjunction',
    isAuspicious: true,
    classicalRef: 'Saravali; Phaladeepika Ch.6',

    conditions: {
      type: 'conjunction',
      planet1: 4, // Jupiter
      planet2: 5, // Venus
    },

    assessStrength: conjunctionStrength,

    affectedDomains: ['wealth', 'marriage'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Jupiter and Venus conjunct in the same house',
      hi: 'गुरु और शुक्र एक ही भाव में युति',
    },
    description: {
      en: 'Guru-Shukra Yoga blends Jupiter\'s wisdom with Venus\'s material grace. Despite their natural enmity, both are benefics — the conjunction produces wealth, artistic talent, and social charm. However, the native may experience inner conflict between spiritual aspirations and material desires, or between duty and pleasure. Financial prosperity is indicated, but value systems may need conscious alignment.',
      hi: 'गुरु-शुक्र योग गुरु के ज्ञान और शुक्र की भौतिक कृपा का मिश्रण है। प्राकृतिक शत्रुता के बावजूद दोनों शुभ ग्रह हैं — युति धन, कलात्मक प्रतिभा और सामाजिक आकर्षण देती है। हालांकि जातक आध्यात्मिक आकांक्षाओं और भौतिक इच्छाओं के बीच आंतरिक द्वंद्व अनुभव कर सकता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Shani-Mangal Yoga (Angarak Yoga)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Angarak Yoga — Mars conjunct Saturn
   *
   * Two first-rate malefics together. Mars = fire, aggression, speed; Saturn = cold,
   * restriction, delay. The combination produces explosive frustration — accelerator
   * and brake applied simultaneously. Prone to accidents, conflicts, and chronic
   * health issues (especially blood, bones, muscles).
   *
   * Cancellation: If in Capricorn (Mars exalted, Saturn in own sign) or Libra
   * (Saturn exalted), the malefic effects are significantly reduced — both planets
   * are dignified and channel energy constructively.
   *
   * Source: BPHS Ch.35; Saravali
   */
  {
    id: 'angarak-yoga',
    name: { en: 'Angarak Yoga', hi: 'अंगारक योग', sa: 'अङ्गारकयोगः' },
    group: 'conjunction',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.35; Saravali',

    conditions: {
      type: 'conjunction',
      planet1: 2, // Mars
      planet2: 6, // Saturn
    },

    assessStrength: inauspiciousConjunctionStrength,

    cancellations: [
      {
        // Mars exalted in Capricorn + Saturn in own sign = constructive discipline
        condition: {
          type: 'planet_in_sign',
          planetId: 2, // Mars
          signs: [10], // Capricorn (Mars exalted, Saturn's own sign)
        },
        reason: {
          en: 'Mars-Saturn conjunction in Capricorn — Mars exalted, Saturn in own sign; malefic energy channelled constructively',
          hi: 'मकर में मंगल-शनि युति — मंगल उच्च, शनि स्वराशि; दुष्प्रभाव रचनात्मक रूप से प्रवाहित',
        },
        effect: 'weaken',
      },
      {
        // Saturn exalted in Libra
        condition: {
          type: 'planet_in_sign',
          planetId: 6, // Saturn
          signs: [7], // Libra (Saturn exalted)
        },
        reason: {
          en: 'Saturn exalted in Libra — disciplined balance reduces Mars-Saturn friction',
          hi: 'शनि तुला में उच्च — अनुशासित संतुलन मंगल-शनि घर्षण को कम करता है',
        },
        effect: 'weaken',
      },
    ],

    affectedDomains: ['health', 'career'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Mars and Saturn conjunct in the same house',
      hi: 'मंगल और शनि एक ही भाव में युति',
    },
    description: {
      en: 'Angarak Yoga places two powerful malefics together — Mars\'s fire meets Saturn\'s ice. This creates explosive frustration, accident-proneness, and conflicts with authority. The native faces obstacles requiring immense patience and disciplined effort. Health concerns often involve blood pressure, bones, and muscles. When in Capricorn or Libra, both planets find constructive expression and the dosha is greatly reduced.',
      hi: 'अंगारक योग दो शक्तिशाली पापग्रहों को एक साथ रखता है — मंगल की अग्नि और शनि की शीतलता। यह विस्फोटक निराशा, दुर्घटना प्रवृत्ति और अधिकारियों से संघर्ष पैदा करता है। मकर या तुला में दोनों ग्रह रचनात्मक अभिव्यक्ति पाते हैं और दोष बहुत कम हो जाता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Shukra-Shani Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Shukra-Shani Yoga — Venus conjunct Saturn
   *
   * Venus = beauty, romance, luxury, comfort; Saturn = delay, discipline, austerity.
   * Produces delayed but enduring relationships, artistic discipline (great for
   * musicians, sculptors), and a mature approach to love. Not devastating, but
   * relationships come late or require patience.
   *
   * Source: Saravali; Phaladeepika
   */
  {
    id: 'shukra-shani',
    name: { en: 'Shukra-Shani Yoga', hi: 'शुक्र-शनि योग', sa: 'शुक्रशनियोगः' },
    group: 'conjunction',
    isAuspicious: true, // Eventually productive despite delays
    classicalRef: 'Saravali; Phaladeepika',

    conditions: {
      type: 'conjunction',
      planet1: 5, // Venus
      planet2: 6, // Saturn
    },

    assessStrength: conjunctionStrength,

    affectedDomains: ['marriage', 'career'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Venus and Saturn conjunct in the same house',
      hi: 'शुक्र और शनि एक ही भाव में युति',
    },
    description: {
      en: 'Shukra-Shani Yoga brings Saturn\'s discipline to Venus\'s realm of relationships and aesthetics. Marriage or partnerships may be delayed but prove deeply enduring. The native develops artistic mastery through sustained effort rather than innate talent alone. Excellent for careers in architecture, classical music, and fine craftsmanship. Emotional expression is restrained but sincere.',
      hi: 'शुक्र-शनि योग शनि का अनुशासन शुक्र के संबंधों और सौंदर्य के क्षेत्र में लाता है। विवाह या साझेदारी में देरी हो सकती है लेकिन वे गहरी और स्थायी होती हैं। कलात्मक निपुणता निरंतर प्रयास से विकसित होती है। वास्तुकला, शास्त्रीय संगीत और शिल्पकला में उत्कृष्ट करियर।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Surya-Shani Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Surya-Shani Yoga — Sun conjunct Saturn
   *
   * The classical father-son conflict: Sun = king, authority, ego, father;
   * Saturn = servant, restriction, humility, Saturn is Sun's son in mythology.
   * The conjunction creates authority struggles, difficult relationship with father,
   * and career obstacles despite capability. Government dealings are troubled.
   *
   * Source: BPHS Ch.35; Saravali; Phaladeepika
   */
  {
    id: 'surya-shani',
    name: { en: 'Surya-Shani Yoga', hi: 'सूर्य-शनि योग', sa: 'सूर्यशनियोगः' },
    group: 'conjunction',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.35; Saravali; Phaladeepika',

    conditions: {
      type: 'conjunction',
      planet1: 0, // Sun
      planet2: 6, // Saturn
    },

    assessStrength: inauspiciousConjunctionStrength,

    affectedDomains: ['career', 'family'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Sun and Saturn conjunct in the same house',
      hi: 'सूर्य और शनि एक ही भाव में युति',
    },
    description: {
      en: 'Surya-Shani Yoga creates the classical father-son conflict in the chart. The native struggles with authority figures, faces obstacles in career advancement despite capability, and may have a strained relationship with the father. Government or bureaucratic dealings are delayed or frustrating. The combination tests ego and builds resilience through hardship. Leadership comes only after sustained effort and maturity.',
      hi: 'सूर्य-शनि योग कुंडली में शास्त्रीय पिता-पुत्र संघर्ष पैदा करता है। जातक अधिकारियों से जूझता है, क्षमता के बावजूद करियर में बाधाएं आती हैं और पिता के साथ तनावपूर्ण संबंध हो सकते हैं। सरकारी कामकाज में देरी होती है। नेतृत्व केवल निरंतर प्रयास और परिपक्वता के बाद मिलता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Surya-Mangal Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Surya-Mangal Yoga — Sun conjunct Mars
   *
   * Two fiery planets together: Sun = authority, vitality; Mars = action, courage.
   * Produces commanding, aggressive, authoritative personalities. Excellent for
   * military, police, surgery, sports. Can be too forceful in personal relationships.
   *
   * Source: Saravali; Phaladeepika Ch.6
   */
  {
    id: 'surya-mangal',
    name: { en: 'Surya-Mangal Yoga', hi: 'सूर्य-मंगल योग', sa: 'सूर्यमङ्गलयोगः' },
    group: 'conjunction',
    isAuspicious: true,
    classicalRef: 'Saravali; Phaladeepika Ch.6',

    conditions: {
      type: 'conjunction',
      planet1: 0, // Sun
      planet2: 2, // Mars
    },

    assessStrength: conjunctionStrength,

    affectedDomains: ['career', 'health'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Sun and Mars conjunct in the same house',
      hi: 'सूर्य और मंगल एक ही भाव में युति',
    },
    description: {
      en: 'Surya-Mangal Yoga amplifies fire — authority meets action. The native is commanding, courageous, and decisive. Excellent for military leadership, surgery, competitive sports, and executive roles. Physical vitality is strong but temper can be sharp. In angular houses, the yoga produces natural leaders who inspire through bold action rather than soft persuasion.',
      hi: 'सूर्य-मंगल योग अग्नि को प्रबल करता है — अधिकार और कर्म का मिलन। जातक प्रभावशाली, साहसी और निर्णायक होता है। सैन्य नेतृत्व, शल्य चिकित्सा, प्रतिस्पर्धी खेल और कार्यकारी भूमिकाओं के लिए उत्कृष्ट। शारीरिक शक्ति प्रबल होती है लेकिन स्वभाव तीव्र हो सकता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Chandra-Shani Yoga (Vish Yoga / Punarphoo)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Vish Yoga — Moon conjunct Saturn
   *
   * Moon = mind, emotions, mother; Saturn = depression, restriction, cold.
   * The most commonly discussed emotional affliction. Creates melancholy,
   * emotional heaviness, pessimistic outlook, and difficulty experiencing joy.
   * Relationship with mother may be cold or burdened.
   *
   * Cancellation: Moon in own sign (Cancer=4) or exalted (Taurus=2) provides
   * emotional resilience that counteracts Saturn's heaviness.
   *
   * Source: BPHS Ch.35; Saravali; widely discussed in all classical texts
   */
  {
    id: 'vish-yoga',
    name: { en: 'Vish Yoga', hi: 'विष योग', sa: 'विषयोगः' },
    group: 'conjunction',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.35; Saravali',

    conditions: {
      type: 'conjunction',
      planet1: 1, // Moon
      planet2: 6, // Saturn
    },

    assessStrength: (ctx: YogaContext) => {
      const moonDignity = ctx.dignity(1);
      const moonHouse = ctx.planetHouse(1);

      // Moon dignified = emotional resilience, dosha weakened
      if (moonDignity === 'exalted' || moonDignity === 'own') return 'Weak';
      // Moon debilitated in Scorpio = double affliction
      if (moonDignity === 'debilitated') return 'Strong';
      // In dusthana = intensified suffering
      if (ctx.isDusthana(moonHouse)) return 'Strong';

      return 'Moderate';
    },

    cancellations: [
      {
        condition: {
          type: 'planet_dignity',
          planetId: 1, // Moon
          dignities: ['own', 'exalted'],
        },
        reason: {
          en: 'Moon in own sign (Cancer) or exalted (Taurus) — emotional resilience counteracts Saturn\'s heaviness',
          hi: 'चंद्र स्वराशि (कर्क) या उच्च (वृषभ) में — भावनात्मक लचीलापन शनि के भार को संतुलित करता है',
        },
        effect: 'weaken',
      },
    ],

    affectedDomains: ['health', 'marriage'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Moon and Saturn conjunct in the same house',
      hi: 'चंद्र और शनि एक ही भाव में युति',
    },
    description: {
      en: 'Vish Yoga (Poison Yoga) is one of the most emotionally challenging conjunctions. Saturn\'s cold, restrictive energy suppresses the Moon\'s emotional expression, creating a tendency towards melancholy, pessimism, and difficulty experiencing spontaneous joy. The native may struggle with depression, anxiety, or emotional numbness. The relationship with the mother is often burdened or distant. When Moon is dignified, emotional resilience develops through the suffering, producing profound wisdom.',
      hi: 'विष योग (ज़हर योग) सबसे भावनात्मक रूप से चुनौतीपूर्ण युतियों में से एक है। शनि की शीतल, प्रतिबंधात्मक ऊर्जा चंद्र की भावनात्मक अभिव्यक्ति को दबा देती है, जिससे उदासी, निराशावाद और सहज आनंद अनुभव करने में कठिनाई होती है। माता के साथ संबंध अक्सर बोझिल या दूर का होता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Budha-Mangal Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Budha-Mangal Yoga — Mercury conjunct Mars
   *
   * Mercury = intellect, communication, analysis; Mars = sharp, decisive, aggressive.
   * Produces a razor-sharp mind, technical skill, debating prowess, and
   * engineering/mathematical ability. Can also make one argumentative and sarcastic.
   *
   * Source: Saravali; Phaladeepika
   */
  {
    id: 'budha-mangal',
    name: { en: 'Budha-Mangal Yoga', hi: 'बुध-मंगल योग', sa: 'बुधमङ्गलयोगः' },
    group: 'conjunction',
    isAuspicious: true,
    classicalRef: 'Saravali; Phaladeepika',

    conditions: {
      type: 'conjunction',
      planet1: 3, // Mercury
      planet2: 2, // Mars
    },

    assessStrength: conjunctionStrength,

    affectedDomains: ['education', 'career'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Mercury and Mars conjunct in the same house',
      hi: 'बुध और मंगल एक ही भाव में युति',
    },
    description: {
      en: 'Budha-Mangal Yoga sharpens the intellect with Mars\'s decisiveness. The native excels in technical fields, engineering, mathematics, debate, and strategic thinking. Communication is direct and assertive — excellent for lawyers, surgeons, programmers, and military strategists. The downside is a tendency towards argumentativeness and cutting speech. In good dignity, this produces analytical brilliance.',
      hi: 'बुध-मंगल योग मंगल की निर्णायकता से बुद्धि को तीक्ष्ण करता है। जातक तकनीकी क्षेत्रों, इंजीनियरिंग, गणित, वाद-विवाद और रणनीतिक सोच में उत्कृष्ट होता है। संवाद प्रत्यक्ष और दृढ़ होता है — वकीलों, शल्य चिकित्सकों, प्रोग्रामरों के लिए उत्कृष्ट।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 9. Guru-Chandra Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Guru-Chandra Yoga — Jupiter conjunct Moon
   *
   * Note: When Jupiter is in a kendra FROM Moon, it forms Gajakesari Yoga
   * (covered in chandra.ts). This rule covers the specific CONJUNCTION case
   * (same house), which is a subset of Gajakesari but worth noting separately
   * as the most direct form of the wisdom-emotion alignment.
   *
   * Jupiter = wisdom, optimism, dharma; Moon = mind, emotions, intuition.
   * The conjunction aligns rational wisdom with emotional intelligence.
   *
   * Source: BPHS Ch.35; Phaladeepika Ch.6
   */
  {
    id: 'guru-chandra',
    name: { en: 'Guru-Chandra Yoga', hi: 'गुरु-चंद्र योग', sa: 'गुरुचन्द्रयोगः' },
    group: 'conjunction',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.35; Phaladeepika Ch.6',

    // NOTE: This is a subset of Gajakesari Yoga (chandra.ts). Gajakesari checks
    // Jupiter in kendra FROM Moon (houses 1/4/7/10 from Moon). This conjunction
    // rule fires when they are in the same house (house 1 from Moon = conjunction).
    // Both may fire simultaneously — that is intentional, as the conjunction is
    // the strongest form of Gajakesari.
    conditions: {
      type: 'conjunction',
      planet1: 4, // Jupiter
      planet2: 1, // Moon
    },

    assessStrength: conjunctionStrength,

    affectedDomains: ['education', 'spiritual'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Jupiter and Moon conjunct in the same house',
      hi: 'गुरु और चंद्र एक ही भाव में युति',
    },
    description: {
      en: 'Guru-Chandra Yoga is the strongest form of the Jupiter-Moon connection (also a Gajakesari variant). Wisdom and emotional intelligence align perfectly — the native is optimistic, compassionate, and blessed with sound judgement informed by empathy. Excellent for teaching, counselling, and spiritual guidance. The mind is expansive and naturally inclined towards learning and philosophy.',
      hi: 'गुरु-चंद्र योग गुरु-चंद्र संबंध का सबसे शक्तिशाली रूप है (गजकेसरी का एक रूप भी)। ज्ञान और भावनात्मक बुद्धिमत्ता का पूर्ण संगम — जातक आशावादी, दयालु और सहानुभूतिपूर्ण विवेक से भरा होता है। शिक्षण, परामर्श और आध्यात्मिक मार्गदर्शन के लिए उत्कृष्ट।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 10. Budha-Aditya Strong Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Budha-Aditya Strong Yoga — Sun-Mercury conjunction where Mercury is NOT
   * combust (more than 10° apart) AND both are in a kendra house.
   *
   * The standard Budha-Aditya Yoga (Sun-Mercury conjunction) is extremely
   * common because Mercury never strays far from the Sun. This STRONGER
   * variant requires Mercury to be far enough from the Sun to avoid
   * combustion AND placed in a kendra for maximum expression.
   *
   * Source: BPHS Ch.35; Phaladeepika Ch.6
   */
  {
    id: 'budha-aditya-strong',
    name: { en: 'Budha-Aditya Strong', hi: 'बुध-आदित्य प्रबल योग', sa: 'बुधादित्यप्रबलयोगः' },
    group: 'conjunction',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.35; Phaladeepika Ch.6',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Sun (0) and Mercury (3) must be in the same house
        if (!ctx.areConjunct(0, 3)) {
          return { present: false, involvedPlanets: [] };
        }

        // Mercury must NOT be combust (> 10° from Sun)
        // Combustion orb for Mercury: 14° (direct), 12° (retrograde)
        // For the "strong" variant we use the stricter 10° threshold
        const sunLong = ctx.planetLongitude(0);
        const mercLong = ctx.planetLongitude(3);
        let angularDist = Math.abs(sunLong - mercLong);
        if (angularDist > 180) angularDist = 360 - angularDist;

        if (angularDist <= 10) {
          return { present: false, involvedPlanets: [] };
        }

        // Both must be in a kendra house
        const sunHouse = ctx.planetHouse(0);
        const mercHouse = ctx.planetHouse(3);
        if (!ctx.isKendra(sunHouse) || !ctx.isKendra(mercHouse)) {
          return { present: false, involvedPlanets: [] };
        }

        return {
          present: true,
          involvedPlanets: [0, 3],
          customData: { angularDistance: angularDist, house: sunHouse },
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { angularDistance?: number } | undefined;
      const dist = data?.angularDistance ?? 0;

      // Mercury's dignity strengthens the yoga
      const mercDignity = ctx.dignity(3);
      const mercStrong = mercDignity === 'exalted' || mercDignity === 'own' || mercDignity === 'moolatrikona';

      // Wider separation = stronger Mercury (further from Sun's glare)
      if (dist > 20 && mercStrong) return 'Strong';
      if (dist > 14 || mercStrong) return 'Strong';
      return 'Moderate';
    },

    affectedDomains: ['education', 'career'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Sun and Mercury conjunct in a kendra house with Mercury more than 10° from the Sun (not combust) — the stronger form of Budha-Aditya',
      hi: 'सूर्य और बुध केन्द्र भाव में युति, बुध सूर्य से 10° से अधिक दूर (अदग्ध) — बुध-आदित्य का प्रबल रूप',
    },
    description: {
      en: 'Budha-Aditya Strong is the elevated form of the common Sun-Mercury conjunction. While basic Budha-Aditya is ubiquitous (Mercury never strays far from the Sun), this variant demands that Mercury escapes combustion and both planets occupy a kendra. The native possesses exceptional intellect, oratory skill, and administrative ability. They thrive in education, government, publishing, and advisory roles. The non-combust Mercury retains its full analytical and communicative power alongside the Sun\'s authority.',
      hi: 'बुध-आदित्य प्रबल सामान्य सूर्य-बुध युति का उन्नत रूप है। सामान्य बुध-आदित्य बहुत आम है, यह प्रकार मांग करता है कि बुध अदग्ध हो और दोनों ग्रह केन्द्र में हों। जातक असाधारण बुद्धि, वक्तृत्व कौशल और प्रशासनिक क्षमता रखता है। शिक्षा, सरकार, प्रकाशन और परामर्श भूमिकाओं में उत्कृष्ट।',
    },
  },
];
