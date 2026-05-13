/**
 * Dosha (Affliction) Yoga Rules
 *
 * Classical doshas — the most commonly checked affliction conditions in practical Jyotish.
 * These are inauspicious combinations that indicate karmic challenges, health issues,
 * or obstacles in specific life areas.
 *
 * Sources: BPHS Ch.34-40, Phaladeepika, Saravali, Jataka Parijata
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Sign IDs:   1=Aries through 12=Pisces (1-based)
 * House IDs:  1-12 (1-based, 1=ascendant)
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Kaal Sarpa variant names based on Rahu's house position
// ─────────────────────────────────────────────────────────────────────────────

const KAAL_SARPA_VARIANTS: Record<number, string> = {
  1: 'Ananta',
  2: 'Kulika',
  3: 'Vasuki',
  4: 'Shankhapal',
  5: 'Padma',
  6: 'Mahapadma',
  7: 'Takshaka',
  8: 'Karkotaka',
  9: 'Shankhachuda',
  10: 'Ghataka',
  11: 'Vishadhar',
  12: 'Sheshnag',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: check if Mars is in a dosha house from a given reference house
// ─────────────────────────────────────────────────────────────────────────────

/** Mangal Dosha houses from any reference point (1, 2, 4, 7, 8, 12) */
const MANGAL_DOSHA_HOUSES = [1, 2, 4, 7, 8, 12];

function isMarsInDoshaHouseFrom(ctx: YogaContext, referenceHouse: number): boolean {
  const marsHouse = ctx.planetHouse(2); // 2 = Mars
  const offset = ctx.houseOffset(referenceHouse, marsHouse);
  return MANGAL_DOSHA_HOUSES.includes(offset);
}

// ─────────────────────────────────────────────────────────────────────────────
// Strength assessment helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Standard dosha strength assessment: stronger when involved planets are
 * in angular houses or in their own/exalted signs; weaker when combust or
 * in dusthanas.
 */
function standardDoshaStrength(
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

    // Stronger in kendras
    if (ctx.isKendra(house)) strongFactors++;
    // Stronger if exalted/own
    if (dignity === 'exalted' || dignity === 'own' || dignity === 'moolatrikona') strongFactors++;
    // Weaker if debilitated
    if (dignity === 'debilitated') weakFactors++;
    // Weaker if combust
    if (ctx.isCombust(pid)) weakFactors++;
  }

  if (strongFactors >= 2) return 'Strong';
  if (weakFactors >= 2) return 'Weak';
  return 'Moderate';
}

// ─────────────────────────────────────────────────────────────────────────────
// Dosha Rules
// ─────────────────────────────────────────────────────────────────────────────

export const DOSHA_RULES: YogaRule[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Mangal Dosha (Manglik)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Mangal Dosha (Manglik / Kuja Dosha)
   *
   * Mars in the 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus.
   * The most widely discussed dosha for marriage compatibility.
   *
   * When Mars occupies these houses from ANY of the three reference points
   * (Lagna, Moon, Venus), the dosha is present. Checking from all three is
   * the comprehensive method used by most traditional astrologers.
   *
   * Source: BPHS Ch.34, also discussed extensively in Phaladeepika and Muhurta texts
   */
  {
    id: 'mangal-dosha',
    name: { en: 'Mangal Dosha', hi: 'मंगल दोष', sa: 'मङ्गलदोषः' },
    group: 'dosha',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.34; Phaladeepika',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lagnaHouse = 1; // House 1 = Lagna
        const moonHouse = ctx.planetHouse(1); // Moon
        const venusHouse = ctx.planetHouse(5); // Venus

        const fromLagna = isMarsInDoshaHouseFrom(ctx, lagnaHouse);
        const fromMoon = isMarsInDoshaHouseFrom(ctx, moonHouse);
        const fromVenus = isMarsInDoshaHouseFrom(ctx, venusHouse);

        const present = fromLagna || fromMoon || fromVenus;

        return {
          present,
          involvedPlanets: present ? [2] : [], // Mars
          customData: present
            ? {
                fromLagna,
                fromMoon,
                fromVenus,
                marsHouse: ctx.planetHouse(2),
              }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const marsHouse = ctx.planetHouse(2);
      const marsDignity = ctx.dignity(2);

      // Mars in own sign (Aries=1, Scorpio=8) or exalted (Capricorn=10) weakens the dosha
      if (marsDignity === 'own' || marsDignity === 'exalted' || marsDignity === 'moolatrikona') {
        return 'Weak';
      }

      // Mars aspected by Jupiter weakens
      const jupiterAspectsMarHouse = ctx.doesAspect(4, marsHouse); // 4 = Jupiter
      if (jupiterAspectsMarHouse) return 'Weak';

      // From all three reference points = strong
      const data = result.customData as { fromLagna?: boolean; fromMoon?: boolean; fromVenus?: boolean } | undefined;
      if (data?.fromLagna && data?.fromMoon && data?.fromVenus) return 'Strong';

      // From two reference points = moderate
      const count = [data?.fromLagna, data?.fromMoon, data?.fromVenus].filter(Boolean).length;
      if (count >= 2) return 'Moderate';

      return 'Weak';
    },

    cancellations: [
      {
        condition: {
          type: 'planet_dignity',
          planetId: 2, // Mars
          dignities: ['own', 'exalted', 'moolatrikona'],
        },
        reason: {
          en: 'Mars in own or exalted sign — Mangal Dosha is cancelled',
          hi: 'मंगल स्वराशि या उच्च राशि में — मंगल दोष निरस्त',
        },
        effect: 'weaken',
      },
      {
        condition: {
          type: 'planet_aspects_house',
          planetId: 4, // Jupiter
          house: 0, // Placeholder — actual check is in custom detect via assessStrength
          fromLagna: true,
        },
        reason: {
          en: 'Jupiter aspects Mars — Mangal Dosha weakened',
          hi: 'गुरु की दृष्टि मंगल पर — मंगल दोष कमज़ोर',
        },
        effect: 'weaken',
      },
    ],

    affectedDomains: ['marriage', 'health'],
    domainImpactWeight: 3,

    formationRule: {
      en: 'Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus',
      hi: 'मंगल लग्न, चंद्र, या शुक्र से 1, 2, 4, 7, 8, या 12वें भाव में',
    },
    description: {
      en: 'Mangal Dosha indicates challenges in married life and partnerships. Mars\'s aggressive energy in sensitive houses creates friction, delays in marriage, or health concerns for the spouse. The dosha is strongest when present from all three reference points and weakest when Mars is dignified or aspected by Jupiter.',
      hi: 'मंगल दोष वैवाहिक जीवन और साझेदारी में चुनौतियों का संकेत देता है। संवेदनशील भावों में मंगल की आक्रामक ऊर्जा घर्षण, विवाह में देरी, या जीवनसाथी के स्वास्थ्य संबंधी चिंताओं को जन्म देती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Kaal Sarpa Dosha
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Kaal Sarpa Dosha
   *
   * All 7 planets (Sun through Saturn) hemmed between Rahu and Ketu,
   * i.e. all fall within the arc from Rahu to Ketu (going forward in longitude).
   * If even one planet is on the other side of the nodal axis, it is NOT Kaal Sarpa.
   *
   * There are 12 variants named after serpents, based on which house Rahu occupies.
   *
   * Source: Various classical texts; widely discussed in Lal Kitab and modern Jyotish
   */
  {
    id: 'kaal-sarpa',
    name: { en: 'Kaal Sarpa Dosha', hi: 'काल सर्प दोष', sa: 'कालसर्पदोषः' },
    group: 'dosha',
    isAuspicious: false,
    classicalRef: 'Various classical sources; Lal Kitab',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const rahuLong = ctx.planetLongitude(7); // Rahu
        const ketuLong = ctx.planetLongitude(8); // Ketu

        // Arc from Rahu to Ketu going forward (clockwise in longitude)
        // A planet is "between" Rahu and Ketu if its longitude falls in the
        // shorter arc from Rahu→Ketu (going in the direction of increasing longitude, modulo 360).
        // We check: all planets Sun(0) through Saturn(6) must be in this arc.
        let allBetween = true;
        let anyConjunctNode = false;
        const involvedPlanets: number[] = [7, 8]; // Rahu and Ketu always involved

        for (let pid = 0; pid <= 6; pid++) {
          const pLong = ctx.planetLongitude(pid);
          involvedPlanets.push(pid);

          // Check if planet is in the arc from Rahu to Ketu (forward)
          let inArc: boolean;
          if (rahuLong < ketuLong) {
            // Normal case: Rahu longitude < Ketu longitude
            inArc = pLong >= rahuLong && pLong <= ketuLong;
          } else {
            // Wrapped case: Rahu longitude > Ketu longitude (crosses 0°)
            inArc = pLong >= rahuLong || pLong <= ketuLong;
          }

          if (!inArc) {
            allBetween = false;
            break;
          }

          // Check if conjunct a node (same house = weakens)
          if (ctx.areConjunct(pid, 7) || ctx.areConjunct(pid, 8)) {
            anyConjunctNode = true;
          }
        }

        const rahuHouse = ctx.planetHouse(7);
        const variant = KAAL_SARPA_VARIANTS[rahuHouse] ?? 'Unknown';

        return {
          present: allBetween,
          involvedPlanets: allBetween ? involvedPlanets : [],
          customData: allBetween
            ? { variant, rahuHouse, anyConjunctNode }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { anyConjunctNode?: boolean } | undefined;

      // Weakened if any planet is conjunct a node
      if (data?.anyConjunctNode) return 'Moderate';

      // Check if Rahu/Ketu are in kendras (stronger)
      const rahuHouse = ctx.planetHouse(7);
      const ketuHouse = ctx.planetHouse(8);
      if (ctx.isKendra(rahuHouse) || ctx.isKendra(ketuHouse)) return 'Strong';

      return 'Moderate';
    },

    cancellations: [
      {
        condition: {
          type: 'custom',
          detect: (ctx: YogaContext) => {
            // If any planet (Sun-Saturn) is conjunct Rahu or Ketu, it weakens
            for (let pid = 0; pid <= 6; pid++) {
              if (ctx.areConjunct(pid, 7) || ctx.areConjunct(pid, 8)) {
                return { present: true, involvedPlanets: [pid] };
              }
            }
            return { present: false, involvedPlanets: [] };
          },
        },
        reason: {
          en: 'A planet conjunct Rahu or Ketu weakens Kaal Sarpa Dosha',
          hi: 'राहु या केतु के साथ ग्रह की युति काल सर्प दोष को कमज़ोर करती है',
        },
        effect: 'weaken',
      },
    ],

    affectedDomains: 'all',
    domainImpactWeight: 2,

    formationRule: {
      en: 'All seven planets (Sun through Saturn) hemmed between Rahu and Ketu on one side of the nodal axis',
      hi: 'सूर्य से शनि तक सभी सात ग्रह राहु और केतु के बीच एक ओर',
    },
    description: {
      en: 'Kaal Sarpa Dosha indicates karmic constraints from past lives. The nodal axis confines all planetary energies, creating a pattern of sudden ups and downs, obstacles in career, and delayed results. The specific variant (based on Rahu\'s house) determines which life area is most affected.',
      hi: 'काल सर्प दोष पूर्व जन्म के कार्मिक बंधनों का संकेत देता है। राहु-केतु अक्ष सभी ग्रह ऊर्जाओं को सीमित करता है, जिससे अचानक उतार-चढ़ाव, करियर में बाधाएं और विलंबित परिणाम होते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Pitru Dosha
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Pitru Dosha
   *
   * Ancestral karmic debt indicated by:
   * (a) Sun conjunct Rahu (especially in 9th house), OR
   * (b) 9th lord conjunct Rahu or Ketu, OR
   * (c) 9th house afflicted by malefics (Rahu, Ketu, Saturn in 9th)
   *
   * The 9th house represents father and ancestral blessings (pitru).
   * Affliction here indicates unresolved karmic debts from the paternal lineage.
   *
   * Source: BPHS Ch.34; widely discussed in remedial Jyotish texts
   */
  {
    id: 'pitru-dosha',
    name: { en: 'Pitru Dosha', hi: 'पितृ दोष', sa: 'पितृदोषः' },
    group: 'dosha',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.34; Lal Kitab',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involvedPlanets: number[] = [];

        // (a) Sun conjunct Rahu
        const sunRahuConjunct = ctx.areConjunct(0, 7); // Sun=0, Rahu=7
        if (sunRahuConjunct) {
          involvedPlanets.push(0, 7);
        }

        // (b) 9th lord conjunct Rahu or Ketu
        const ninthLord = ctx.houseLord(9);
        const ninthLordWithRahu = ctx.areConjunct(ninthLord, 7);
        const ninthLordWithKetu = ctx.areConjunct(ninthLord, 8);
        if (ninthLordWithRahu) involvedPlanets.push(ninthLord, 7);
        if (ninthLordWithKetu) involvedPlanets.push(ninthLord, 8);

        // (c) Rahu, Ketu, or Saturn in 9th house
        const planetsIn9 = ctx.planetsInHouse(9);
        const maleficsIn9 = planetsIn9.filter((pid) => pid === 6 || pid === 7 || pid === 8);
        if (maleficsIn9.length > 0) involvedPlanets.push(...maleficsIn9);

        const present =
          sunRahuConjunct || ninthLordWithRahu || ninthLordWithKetu || maleficsIn9.length > 0;

        return {
          present,
          involvedPlanets: present ? [...new Set(involvedPlanets)] : [],
          customData: present
            ? {
                sunRahuConjunct,
                ninthLordAfflicted: ninthLordWithRahu || ninthLordWithKetu,
                maleficsIn9th: maleficsIn9,
              }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as {
        sunRahuConjunct?: boolean;
        ninthLordAfflicted?: boolean;
        maleficsIn9th?: number[];
      } | undefined;

      let factors = 0;
      if (data?.sunRahuConjunct) factors++;
      if (data?.ninthLordAfflicted) factors++;
      if (data?.maleficsIn9th && data.maleficsIn9th.length > 0) factors++;

      // Sun-Rahu conjunction in 9th house specifically is strongest
      if (data?.sunRahuConjunct && ctx.planetHouse(0) === 9) return 'Strong';

      if (factors >= 2) return 'Strong';
      if (factors === 1) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: ['family', 'spiritual'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Sun conjunct Rahu, or 9th lord with Rahu/Ketu, or malefics in the 9th house',
      hi: 'सूर्य-राहु की युति, या नवम भाव का स्वामी राहु/केतु के साथ, या नवम भाव में पापग्रह',
    },
    description: {
      en: 'Pitru Dosha indicates unresolved ancestral karma. The affliction to the 9th house (father, dharma, fortune) suggests debts from the paternal lineage that manifest as obstacles in spiritual growth, strained relationships with father figures, and delayed blessings. Remedies include Pitru Tarpana and Shraddha rituals.',
      hi: 'पितृ दोष अनसुलझे पैतृक कर्मों का संकेत देता है। नवम भाव (पिता, धर्म, भाग्य) पर पीड़ा पैतृक वंश के ऋणों को दर्शाती है जो आध्यात्मिक विकास में बाधा, पिता के साथ तनावपूर्ण संबंध और विलंबित आशीर्वाद के रूप में प्रकट होते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Shrapit Dosha
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Shrapit Dosha
   *
   * Saturn conjunct Rahu in any house. Indicates a past-life curse (shrapit = cursed).
   * The combination of Saturn's karmic restrictions with Rahu's obsessive/deceptive
   * nature creates a powerful affliction that affects all life areas.
   *
   * Source: Lal Kitab; also referenced in various Jyotish Shastra texts
   */
  {
    id: 'shrapit-dosha',
    name: { en: 'Shrapit Dosha', hi: 'शापित दोष', sa: 'शापितदोषः' },
    group: 'dosha',
    isAuspicious: false,
    classicalRef: 'Lal Kitab; Jyotish Shastra',

    conditions: {
      type: 'conjunction',
      planet1: 6, // Saturn
      planet2: 7, // Rahu
    },

    assessStrength: (ctx: YogaContext) => {
      const saturnHouse = ctx.planetHouse(6);
      const saturnDignity = ctx.dignity(6);

      // Stronger in kendras or dusthanas
      if (ctx.isKendra(saturnHouse) || ctx.isDusthana(saturnHouse)) return 'Strong';
      // Weaker if Saturn is dignified
      if (saturnDignity === 'exalted' || saturnDignity === 'own') return 'Weak';

      return 'Moderate';
    },

    affectedDomains: 'all',
    domainImpactWeight: 2,

    formationRule: {
      en: 'Saturn conjunct Rahu in any house',
      hi: 'किसी भी भाव में शनि और राहु की युति',
    },
    description: {
      en: 'Shrapit Dosha indicates a past-life karmic curse. The conjunction of Saturn (karma, restriction) and Rahu (obsession, illusion) creates recurring patterns of frustration, betrayal, and unexplained obstacles. The house of conjunction determines which life area bears the brunt of this affliction.',
      hi: 'शापित दोष पूर्व जन्म के शाप का संकेत देता है। शनि (कर्म, प्रतिबंध) और राहु (जुनून, भ्रम) की युति निराशा, विश्वासघात और अस्पष्ट बाधाओं की पुनरावृत्ति पैदा करती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Guru Chandal Dosha
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Guru Chandal Dosha
   *
   * Jupiter conjunct Rahu. The "outcaste guru" — Jupiter's wisdom and ethics
   * are corrupted by Rahu's materialism and deception. Affects education,
   * spirituality, children, and moral judgement.
   *
   * Cancellation: Jupiter in own sign (Sagittarius/Pisces) or exalted (Cancer)
   * significantly reduces the negative effects.
   *
   * Source: BPHS; Phaladeepika
   */
  {
    id: 'guru-chandal',
    name: { en: 'Guru Chandal Dosha', hi: 'गुरु चांडाल दोष', sa: 'गुरुचाण्डालदोषः' },
    group: 'dosha',
    isAuspicious: false,
    classicalRef: 'BPHS; Phaladeepika',

    conditions: {
      type: 'conjunction',
      planet1: 4, // Jupiter
      planet2: 7, // Rahu
    },

    assessStrength: (ctx: YogaContext) => {
      const jupiterDignity = ctx.dignity(4);
      const jupiterHouse = ctx.planetHouse(4);

      // Jupiter in own/exalted = dosha weakened significantly
      if (jupiterDignity === 'exalted' || jupiterDignity === 'own' || jupiterDignity === 'moolatrikona') {
        return 'Weak';
      }
      // Jupiter debilitated makes it worse
      if (jupiterDignity === 'debilitated') return 'Strong';
      // In dusthana = stronger affliction
      if (ctx.isDusthana(jupiterHouse)) return 'Strong';

      return 'Moderate';
    },

    cancellations: [
      {
        condition: {
          type: 'planet_dignity',
          planetId: 4, // Jupiter
          dignities: ['own', 'exalted', 'moolatrikona'],
        },
        reason: {
          en: 'Jupiter in own or exalted sign — Guru Chandal Dosha significantly weakened',
          hi: 'गुरु स्वराशि या उच्च राशि में — गुरु चांडाल दोष काफी कमज़ोर',
        },
        effect: 'weaken',
      },
    ],

    affectedDomains: ['education', 'spiritual', 'children'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Jupiter conjunct Rahu in any house',
      hi: 'किसी भी भाव में गुरु और राहु की युति',
    },
    description: {
      en: 'Guru Chandal Dosha corrupts Jupiter\'s qualities of wisdom, ethics, and higher learning. The native may struggle with misguided beliefs, issues in education, challenges with children, or difficulty finding a trustworthy spiritual guide. Financial judgement may also be impaired. When Jupiter is dignified, the negative effects are greatly reduced and Rahu may even amplify Jupiter\'s positive qualities.',
      hi: 'गुरु चांडाल दोष गुरु की ज्ञान, नैतिकता और उच्च शिक्षा के गुणों को प्रभावित करता है। जातक को भ्रामक विश्वासों, शिक्षा में समस्याओं, संतान संबंधी चुनौतियों, या विश्वसनीय आध्यात्मिक मार्गदर्शक खोजने में कठिनाई हो सकती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Grahan Yoga (Surya Grahan + Chandra Grahan)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Grahan Yoga — Eclipsed Luminary
   *
   * Sun or Moon conjunct Rahu or Ketu. Creates an "eclipse" in the birth chart.
   * Two variants:
   * - Surya Grahan: Sun with Rahu or Ketu → affects vitality, authority, father
   * - Chandra Grahan: Moon with Rahu or Ketu → affects mind, emotions, mother
   *
   * Source: BPHS Ch.34; Saravali
   */
  {
    id: 'grahan-yoga',
    name: { en: 'Grahan Yoga', hi: 'ग्रहण योग', sa: 'ग्रहणयोगः' },
    group: 'dosha',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.34; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const involvedPlanets: number[] = [];

        // Surya Grahan: Sun conjunct Rahu or Ketu
        const sunRahu = ctx.areConjunct(0, 7);
        const sunKetu = ctx.areConjunct(0, 8);
        if (sunRahu) involvedPlanets.push(0, 7);
        if (sunKetu) involvedPlanets.push(0, 8);

        // Chandra Grahan: Moon conjunct Rahu or Ketu
        const moonRahu = ctx.areConjunct(1, 7);
        const moonKetu = ctx.areConjunct(1, 8);
        if (moonRahu) involvedPlanets.push(1, 7);
        if (moonKetu) involvedPlanets.push(1, 8);

        const hasSurya = sunRahu || sunKetu;
        const hasChandra = moonRahu || moonKetu;
        const present = hasSurya || hasChandra;

        return {
          present,
          involvedPlanets: present ? [...new Set(involvedPlanets)] : [],
          customData: present
            ? { surya: hasSurya, chandra: hasChandra }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { surya?: boolean; chandra?: boolean } | undefined;

      // Both luminaries eclipsed = very strong
      if (data?.surya && data?.chandra) return 'Strong';

      // Check dignity of the eclipsed luminary
      for (const pid of result.involvedPlanets) {
        if (pid === 0 || pid === 1) {
          const dignity = ctx.dignity(pid);
          // Eclipsed luminary in own/exalted = moderate (dignity provides some protection)
          if (dignity === 'exalted' || dignity === 'own') return 'Moderate';
          // Eclipsed luminary debilitated = very afflicted
          if (dignity === 'debilitated') return 'Strong';
        }
      }

      return 'Moderate';
    },

    affectedDomains: ['health', 'career'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Sun or Moon conjunct Rahu or Ketu (eclipsed luminary)',
      hi: 'सूर्य या चंद्र राहु या केतु के साथ (ग्रहण)',
    },
    description: {
      en: 'Grahan Yoga creates an "eclipse" of the luminary\'s significations. Surya Grahan (Sun eclipsed) weakens vitality, authority, and the relationship with the father. Chandra Grahan (Moon eclipsed) disturbs mental peace, emotional stability, and the relationship with the mother. When both luminaries are eclipsed, the impact is profound and pervasive.',
      hi: 'ग्रहण योग प्रकाशमान ग्रह के कारकत्व का "ग्रहण" करता है। सूर्य ग्रहण जीवन शक्ति, अधिकार और पिता के साथ संबंध को कमज़ोर करता है। चंद्र ग्रहण मानसिक शांति, भावनात्मक स्थिरता और माता के साथ संबंध को प्रभावित करता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Kendradhipati Dosha
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Kendradhipati Dosha
   *
   * Per BPHS Ch.34: natural benefics (Jupiter, Venus, Mercury, Moon) lose their
   * benefic nature when they lord kendra houses (1, 4, 7, 10). They become
   * "neutral" rather than helpful — a subtle but important distinction.
   *
   * This is not a devastating dosha but rather a weakening of expected benefits.
   * The benefic planet cannot deliver its full promise when burdened with kendra lordship.
   *
   * Note: This is most significant for Jupiter and Venus. Moon and Mercury are
   * considered milder cases.
   *
   * Source: BPHS Ch.34 v.10-11
   */
  {
    id: 'kendradhipati-dosha',
    name: { en: 'Kendradhipati Dosha', hi: 'केन्द्राधिपति दोष', sa: 'केन्द्राधिपतिदोषः' },
    group: 'dosha',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.34 v.10-11',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Natural benefics: Moon(1), Mercury(3), Jupiter(4), Venus(5)
        const naturalBenefics = [1, 3, 4, 5];
        const kendraHouses = [1, 4, 7, 10];
        const involvedPlanets: number[] = [];
        const affectedHouses: number[] = [];

        for (const house of kendraHouses) {
          const lord = ctx.houseLord(house);
          if (naturalBenefics.includes(lord)) {
            involvedPlanets.push(lord);
            affectedHouses.push(house);
          }
        }

        const uniquePlanets = [...new Set(involvedPlanets)];
        const present = uniquePlanets.length > 0;

        return {
          present,
          involvedPlanets: present ? uniquePlanets : [],
          customData: present ? { affectedHouses } : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      // More benefics affected = stronger dosha
      const uniquePlanets = result.involvedPlanets.length;

      // Jupiter or Venus affected is more significant than Moon or Mercury
      const majorBeneficAffected = result.involvedPlanets.some((pid) => pid === 4 || pid === 5);

      if (uniquePlanets >= 3 || (uniquePlanets >= 2 && majorBeneficAffected)) return 'Strong';
      if (uniquePlanets === 1 && !majorBeneficAffected) return 'Weak';
      return 'Moderate';
    },

    affectedDomains: ['career', 'marriage', 'health'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'A natural benefic (Jupiter, Venus, Mercury, or Moon) lords a kendra house (1st, 4th, 7th, or 10th)',
      hi: 'प्राकृतिक शुभ ग्रह (गुरु, शुक्र, बुध, या चंद्र) केन्द्र भाव (1, 4, 7, या 10) का स्वामी',
    },
    description: {
      en: 'Kendradhipati Dosha is a subtle affliction where natural benefics lose their benefic power by lording angular houses. Per BPHS, benefics owning kendras become functionally neutral — they cannot deliver the blessings normally expected of them. This is most impactful when Jupiter or Venus is the affected planet, and milder when it is Moon or Mercury.',
      hi: 'केन्द्राधिपति दोष एक सूक्ष्म पीड़ा है जहां प्राकृतिक शुभ ग्रह केन्द्र भाव के स्वामी होने से अपनी शुभ शक्ति खो देते हैं। BPHS के अनुसार, केन्द्र के स्वामी शुभ ग्रह कार्यात्मक रूप से तटस्थ हो जाते हैं।',
    },
  },
];
