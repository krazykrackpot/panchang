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
          type: 'custom',
          detect: (ctx: YogaContext) => ({
            present: ctx.doesAspect(4, ctx.planetHouse(2)), // Jupiter aspects Mars's house
            involvedPlanets: [4, 2],
          }),
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

        // Helper: check if a point falls STRICTLY inside the arc from start to end (mod 360).
        // A planet exactly ON a node (conjunct Rahu/Ketu) breaks Kaal Sarpa per many authorities.
        function isInArc(point: number, start: number, end: number): boolean {
          if (start < end) {
            return point > start && point < end;
          } else {
            // Arc crosses 0°
            return point > start || point < end;
          }
        }

        // Check BOTH arcs — Kaal Sarpa is present if all 7 planets are in
        // EITHER the Rahu→Ketu arc OR the Ketu→Rahu arc.
        let allInRahuToKetu = true;
        let allInKetuToRahu = true;
        let anyConjunctNode = false;
        const involvedPlanets: number[] = [7, 8]; // Rahu and Ketu always involved

        for (let pid = 0; pid <= 6; pid++) {
          const pLong = ctx.planetLongitude(pid);
          involvedPlanets.push(pid);

          if (!isInArc(pLong, rahuLong, ketuLong)) {
            allInRahuToKetu = false;
          }
          if (!isInArc(pLong, ketuLong, rahuLong)) {
            allInKetuToRahu = false;
          }

          // Check if conjunct a node (same house = weakens)
          if (ctx.areConjunct(pid, 7) || ctx.areConjunct(pid, 8)) {
            anyConjunctNode = true;
          }
        }

        const present = allInRahuToKetu || allInKetuToRahu;
        const rahuHouse = ctx.planetHouse(7);
        const variant = KAAL_SARPA_VARIANTS[rahuHouse] ?? 'Unknown';

        return {
          present,
          involvedPlanets: present ? involvedPlanets : [],
          customData: present
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

    assessStrength: (ctx: YogaContext, _result: YogaDetectionResult) => {
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

    assessStrength: (ctx: YogaContext, _result: YogaDetectionResult) => {
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

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Kalathra Dosha
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Kalathra Dosha
   *
   * 7th lord afflicted — placed in a dusthana (6/8/12), combust, or debilitated.
   * Indicates difficulties in marriage, delayed or troubled partnerships.
   *
   * Source: BPHS Ch.34; Phaladeepika; Jataka Parijata
   */
  {
    id: 'kalathra-dosha',
    name: { en: 'Kalathra Dosha', hi: 'कलत्र दोष', sa: 'कलत्रदोषः' },
    group: 'dosha',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.34; Phaladeepika',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lord7 = ctx.houseLord(7);
        const lord7House = ctx.planetHouse(lord7);
        const lord7Dignity = ctx.dignity(lord7);
        const lord7Combust = ctx.isCombust(lord7);

        const inDusthana = ctx.isDusthana(lord7House);
        const isDebilitated = lord7Dignity === 'debilitated';

        const present = inDusthana || lord7Combust || isDebilitated;

        return {
          present,
          involvedPlanets: present ? [lord7] : [],
          customData: present
            ? { inDusthana, combust: lord7Combust, debilitated: isDebilitated, lord7House }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as {
        inDusthana?: boolean;
        combust?: boolean;
        debilitated?: boolean;
      } | undefined;

      let factors = 0;
      if (data?.inDusthana) factors++;
      if (data?.combust) factors++;
      if (data?.debilitated) factors++;

      if (factors >= 2) return 'Strong';
      if (factors === 1) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: ['marriage'],
    domainImpactWeight: 2,

    formationRule: {
      en: '7th lord in a dusthana (6th/8th/12th), combust, or debilitated — marriage house lord afflicted',
      hi: '7वें भाव का स्वामी दुष्ट भाव (6/8/12) में, अस्त, या नीच — विवाह भाव का स्वामी पीड़ित',
    },
    description: {
      en: 'Kalathra Dosha indicates difficulties in married life and partnerships. The 7th lord — signifier of the spouse — is weakened by placement in a dusthana, combustion, or debilitation. The native may experience delayed marriage, misunderstandings with the partner, or repeated relationship challenges. The specific nature depends on which affliction applies.',
      hi: 'कलत्र दोष वैवाहिक जीवन और साझेदारी में कठिनाइयों का संकेत देता है। 7वें भाव का स्वामी — जीवनसाथी का कारक — दुष्ट भाव, अस्तत्व या नीच राशि से कमज़ोर है। जातक को विवाह में देरी, साथी के साथ गलतफ़हमी या बार-बार संबंध चुनौतियों का अनुभव हो सकता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 9. Marana Karaka Sthana (MKS)
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Marana Karaka Sthana — Planet in its "death-like" house
   *
   * Each planet has a house where its significations are severely weakened:
   * Sun in 12th, Moon in 8th, Mars in 7th, Mercury in 4th,
   * Jupiter in 3rd, Venus in 6th, Saturn in 1st.
   *
   * Source: Phaladeepika Ch.7; Saravali; Prashna Marga
   */
  {
    id: 'marana-karaka-sthana',
    name: { en: 'Marana Karaka Sthana', hi: 'मारक कारक स्थान', sa: 'मारककारकस्थानम्' },
    group: 'dosha',
    isAuspicious: false,
    classicalRef: 'Phaladeepika Ch.7; Saravali; Prashna Marga',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // MKS house assignments: planetId → house where it suffers
        const MKS_MAP: Record<number, number> = {
          0: 12, // Sun in 12th
          1: 8,  // Moon in 8th
          2: 7,  // Mars in 7th
          3: 4,  // Mercury in 4th
          4: 3,  // Jupiter in 3rd
          5: 6,  // Venus in 6th
          6: 1,  // Saturn in 1st
        };

        const involvedPlanets: number[] = [];
        const mksDetails: { planetId: number; house: number }[] = [];

        for (const [pidStr, mksHouse] of Object.entries(MKS_MAP)) {
          const pid = Number(pidStr);
          if (ctx.planetHouse(pid) === mksHouse) {
            involvedPlanets.push(pid);
            mksDetails.push({ planetId: pid, house: mksHouse });
          }
        }

        const present = involvedPlanets.length > 0;
        return {
          present,
          involvedPlanets,
          customData: present ? { mksDetails } : undefined,
        };
      },
    },

    assessStrength: (_ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { mksDetails?: { planetId: number; house: number }[] } | undefined;
      const count = data?.mksDetails?.length ?? 0;
      if (count >= 2) return 'Strong';
      return 'Moderate';
    },

    affectedDomains: ['health'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'A planet in its Marana Karaka Sthana: Sun in 12th, Moon in 8th, Mars in 7th, Mercury in 4th, Jupiter in 3rd, Venus in 6th, Saturn in 1st',
      hi: 'ग्रह अपने मारक कारक स्थान में: सूर्य 12वें, चंद्र 8वें, मंगल 7वें, बुध 4थे, गुरु 3रे, शुक्र 6ठे, शनि 1ले भाव में',
    },
    description: {
      en: 'Marana Karaka Sthana (MKS) places a planet in a house where its natural significations are severely weakened — as though the planet were "dead." The planet can neither deliver its promises nor protect the affairs of the house it lords. The native experiences chronic frustration in the areas ruled by the afflicted planet. Multiple MKS placements compound the difficulty.',
      hi: 'मारक कारक स्थान (MKS) ग्रह को ऐसे भाव में रखता है जहाँ उसके प्राकृतिक कारकत्व अत्यंत कमज़ोर हो जाते हैं — मानो ग्रह "मृत" हो। जातक पीड़ित ग्रह द्वारा शासित क्षेत्रों में दीर्घकालिक निराशा का अनुभव करता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 10. Badhaka Dosha
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Badhaka Dosha — Obstruction Dosha
   *
   * The Badhaka lord (obstructor) depends on lagna quality:
   * - Movable (Aries, Cancer, Libra, Capricorn): 11th lord is Badhaka
   * - Fixed (Taurus, Leo, Scorpio, Aquarius): 9th lord is Badhaka
   * - Dual (Gemini, Virgo, Sagittarius, Pisces): 7th lord is Badhaka
   *
   * Dosha forms when Badhaka lord is in a kendra or conjunct lagna lord.
   *
   * Source: Prashna Marga; Uttara Kalamrita
   */
  {
    id: 'badhaka-dosha',
    name: { en: 'Badhaka Dosha', hi: 'बाधक दोष', sa: 'बाधकदोषः' },
    group: 'dosha',
    isAuspicious: false,
    classicalRef: 'Prashna Marga; Uttara Kalamrita',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lagnaSign = ctx.ascendantSign;
        // Determine sign modality: 1=movable, 2=fixed, 3=dual
        const MOVABLE_SIGNS = [1, 4, 7, 10]; // Aries, Cancer, Libra, Capricorn
        const FIXED_SIGNS = [2, 5, 8, 11];   // Taurus, Leo, Scorpio, Aquarius
        // Dual: 3, 6, 9, 12

        let badhakaHouse: number;
        if (MOVABLE_SIGNS.includes(lagnaSign)) {
          badhakaHouse = 11;
        } else if (FIXED_SIGNS.includes(lagnaSign)) {
          badhakaHouse = 9;
        } else {
          badhakaHouse = 7;
        }

        const badhakaLord = ctx.houseLord(badhakaHouse);
        const badhakaLordHouse = ctx.planetHouse(badhakaLord);
        const lagnaLord = ctx.houseLord(1);

        const inKendra = ctx.isKendra(badhakaLordHouse);
        const conjunctLagnaLord = ctx.areConjunct(badhakaLord, lagnaLord);

        const present = inKendra || conjunctLagnaLord;

        return {
          present,
          involvedPlanets: present ? [...new Set([badhakaLord, ...(conjunctLagnaLord ? [lagnaLord] : [])])] : [],
          customData: present
            ? { badhakaHouse, badhakaLord, inKendra, conjunctLagnaLord }
            : undefined,
        };
      },
    },

    assessStrength: (_ctx: YogaContext, result: YogaDetectionResult) => {
      const data = result.customData as { inKendra?: boolean; conjunctLagnaLord?: boolean } | undefined;
      if (data?.inKendra && data?.conjunctLagnaLord) return 'Strong';
      return 'Moderate';
    },

    affectedDomains: 'all',
    domainImpactWeight: 1,

    formationRule: {
      en: 'Badhaka lord (11th for movable, 9th for fixed, 7th for dual lagna) in a kendra or conjunct lagna lord',
      hi: 'बाधक स्वामी (चर लग्न: 11वें, स्थिर: 9वें, द्विस्वभाव: 7वें का स्वामी) केन्द्र में या लग्न स्वामी के साथ',
    },
    description: {
      en: 'Badhaka Dosha creates unexplained, persistent obstructions in life. The Badhaka lord — determined by the lagna sign\'s modality — acts as a hidden blocker. When placed in a kendra or conjunct the lagna lord, it intensifies obstacles that seem disproportionate to the situation. The native may face repeated setbacks without clear external cause.',
      hi: 'बाधक दोष जीवन में अस्पष्ट, निरंतर बाधाएँ उत्पन्न करता है। बाधक स्वामी — लग्न राशि के स्वभाव द्वारा निर्धारित — एक छिपे अवरोधक का काम करता है। जातक को बार-बार ऐसी विफलताओं का सामना करना पड़ सकता है जिनका कोई स्पष्ट बाहरी कारण नहीं दिखता।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 11. Vanchana Chora Bheeti
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Vanchana Chora Bheeti — Fear of Deception/Theft
   *
   * 7th lord conjunct Rahu or in navamsha of Rahu, aspected by a malefic.
   * Indicates fear of betrayal, deception, or theft in partnerships.
   *
   * Simplified: 7th lord conjunct Rahu AND aspected by any malefic (Mars/Saturn/Rahu/Ketu).
   *
   * Source: Saravali; Prashna Marga
   */
  {
    id: 'vanchana-chora-bheeti',
    name: { en: 'Vanchana Chora Bheeti', hi: 'वंचना चोर भीति', sa: 'वञ्चनाचौरभीतिः' },
    group: 'dosha',
    isAuspicious: false,
    classicalRef: 'Saravali; Prashna Marga',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const lord7 = ctx.houseLord(7);
        const lord7Conjunct7Rahu = ctx.areConjunct(lord7, 7); // 7 = Rahu

        if (!lord7Conjunct7Rahu) {
          return { present: false, involvedPlanets: [] };
        }

        // Check if aspected by any malefic (Mars=2, Saturn=6, Ketu=8)
        const lord7House = ctx.planetHouse(lord7);
        const MALEFICS = [2, 6, 8]; // Mars, Saturn, Ketu (Rahu already conjunct)
        const aspectingMalefics: number[] = [];
        for (const mid of MALEFICS) {
          if (mid === lord7) continue; // skip if lord7 IS the malefic
          if (ctx.doesAspect(mid, lord7House)) {
            aspectingMalefics.push(mid);
          }
        }

        const present = aspectingMalefics.length > 0;
        return {
          present,
          involvedPlanets: present ? [...new Set([lord7, 7, ...aspectingMalefics])] : [],
          customData: present ? { aspectingMalefics } : undefined,
        };
      },
    },

    assessStrength: standardDoshaStrength,

    affectedDomains: ['marriage'],
    domainImpactWeight: 1,

    formationRule: {
      en: '7th lord conjunct Rahu and aspected by a natural malefic (Mars, Saturn, or Ketu)',
      hi: '7वें भाव का स्वामी राहु के साथ और प्राकृतिक पापग्रह (मंगल, शनि, या केतु) की दृष्टि',
    },
    description: {
      en: 'Vanchana Chora Bheeti indicates a deep-seated fear of deception, betrayal, or theft in partnerships. The 7th lord\'s conjunction with Rahu — the planet of illusion — under malefic aspect creates vulnerability to dishonest partners, fraud in business, or trust issues in marriage. The native should exercise extra due diligence in partnerships and financial agreements.',
      hi: 'वंचना चोर भीति साझेदारी में धोखा, विश्वासघात या चोरी के गहरे भय का संकेत देता है। राहु — भ्रम के ग्रह — के साथ 7वें स्वामी की युति पापग्रह दृष्टि में बेईमान साथियों, व्यापार में धोखाधड़ी या विवाह में विश्वास की समस्याओं के प्रति भेद्यता पैदा करती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 12. Shubha Kartari Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Shubha Kartari Yoga — Benefic Hemming
   *
   * Natural benefics in the 12th and 2nd houses from Lagna (houses flanking
   * the ascendant). The lagna is "hemmed" by benefic influences — protective.
   *
   * Source: BPHS Ch.34; Phaladeepika
   */
  {
    id: 'shubha-kartari',
    name: { en: 'Shubha Kartari Yoga', hi: 'शुभ कर्तरी योग', sa: 'शुभकर्तरीयोगः' },
    group: 'dosha',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.34; Phaladeepika',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Check for benefics in H12 and H2 (houses flanking lagna)
        const planetsIn12 = ctx.planetsInHouse(12);
        const planetsIn2 = ctx.planetsInHouse(2);

        const beneficsIn12 = planetsIn12.filter(pid => ctx.isNaturalBenefic(pid));
        const beneficsIn2 = planetsIn2.filter(pid => ctx.isNaturalBenefic(pid));

        // Both sides must have at least one benefic
        const present = beneficsIn12.length > 0 && beneficsIn2.length > 0;

        return {
          present,
          involvedPlanets: present ? [...beneficsIn12, ...beneficsIn2] : [],
          customData: present ? { beneficsIn12, beneficsIn2 } : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const dignifiedCount = result.involvedPlanets.filter(pid => {
        const d = ctx.dignity(pid);
        return d === 'exalted' || d === 'own' || d === 'moolatrikona';
      }).length;
      if (dignifiedCount >= 2) return 'Strong';
      if (result.involvedPlanets.length >= 3) return 'Strong';
      return 'Moderate';
    },

    affectedDomains: ['health', 'career'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Natural benefics in both the 12th and 2nd houses from Lagna — benefics hem the ascendant',
      hi: 'लग्न से 12वें और 2रे दोनों भावों में प्राकृतिक शुभ ग्रह — शुभ ग्रह लग्न को घेरते हैं',
    },
    description: {
      en: 'Shubha Kartari Yoga creates a protective shield around the ascendant. Benefics flanking the lagna from both sides bring good health, a positive disposition, and general well-being. The native is surrounded by supportive people and encounters fewer obstacles in personal endeavours. This is one of the simpler yet practically significant auspicious combinations.',
      hi: 'शुभ कर्तरी योग लग्न के चारों ओर एक सुरक्षात्मक कवच बनाता है। दोनों ओर से लग्न को घेरने वाले शुभ ग्रह अच्छा स्वास्थ्य, सकारात्मक स्वभाव और सामान्य कल्याण लाते हैं। जातक सहायक लोगों से घिरा रहता है और व्यक्तिगत प्रयासों में कम बाधाओं का सामना करता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 13. Papa Kartari Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Papa Kartari Yoga — Malefic Hemming
   *
   * Natural malefics in the 12th and 2nd houses from Lagna. The lagna is
   * "hemmed" by malefic influences — constricting and challenging.
   *
   * Natural malefics: Sun (0), Mars (2), Saturn (6), Rahu (7), Ketu (8).
   *
   * Source: BPHS Ch.34; Phaladeepika
   */
  {
    id: 'papa-kartari',
    name: { en: 'Papa Kartari Yoga', hi: 'पाप कर्तरी योग', sa: 'पापकर्तरीयोगः' },
    group: 'dosha',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.34; Phaladeepika',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Natural malefics: Sun(0), Mars(2), Saturn(6), Rahu(7), Ketu(8)
        const MALEFIC_IDS = [0, 2, 6, 7, 8];

        const planetsIn12 = ctx.planetsInHouse(12);
        const planetsIn2 = ctx.planetsInHouse(2);

        const maleficsIn12 = planetsIn12.filter(pid => MALEFIC_IDS.includes(pid));
        const maleficsIn2 = planetsIn2.filter(pid => MALEFIC_IDS.includes(pid));

        // Both sides must have at least one malefic
        const present = maleficsIn12.length > 0 && maleficsIn2.length > 0;

        return {
          present,
          involvedPlanets: present ? [...maleficsIn12, ...maleficsIn2] : [],
          customData: present ? { maleficsIn12, maleficsIn2 } : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      // Stronger when malefics are themselves strong (exalted/own)
      const strongMalefics = result.involvedPlanets.filter(pid => {
        const d = ctx.dignity(pid);
        return d === 'exalted' || d === 'own' || d === 'moolatrikona';
      }).length;
      // Strong malefics = stronger affliction
      if (strongMalefics >= 2) return 'Strong';
      if (result.involvedPlanets.length >= 3) return 'Strong';
      return 'Moderate';
    },

    cancellations: [
      {
        condition: {
          type: 'custom',
          detect: (ctx: YogaContext) => {
            // Jupiter aspects lagna — mitigates hemming
            const present = ctx.doesAspect(4, 1);
            return { present, involvedPlanets: present ? [4] : [] };
          },
        },
        reason: {
          en: 'Jupiter aspects the lagna — divine protection mitigates the malefic hemming',
          hi: 'गुरु की लग्न पर दृष्टि — दैवी सुरक्षा पापग्रह कर्तरी को कम करती है',
        },
        effect: 'weaken',
      },
    ],

    affectedDomains: ['health'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Natural malefics in both the 12th and 2nd houses from Lagna — malefics hem the ascendant',
      hi: 'लग्न से 12वें और 2रे दोनों भावों में प्राकृतिक पापग्रह — पापग्रह लग्न को घेरते हैं',
    },
    description: {
      en: 'Papa Kartari Yoga constricts the ascendant between malefic influences. The native feels hemmed in — health challenges, limited freedom, and a sense of being trapped by circumstances. Growth requires extra effort as malefic energies press in from both sides. Jupiter\'s aspect on the lagna can significantly mitigate this affliction.',
      hi: 'पाप कर्तरी योग लग्न को पापग्रह प्रभावों के बीच संकुचित करता है। जातक को स्वास्थ्य चुनौतियाँ, सीमित स्वतंत्रता और परिस्थितियों में फँसे होने की भावना होती है। दोनों ओर से पापग्रह ऊर्जाओं के दबाव में विकास के लिए अतिरिक्त प्रयास आवश्यक है।',
    },
  },
];
