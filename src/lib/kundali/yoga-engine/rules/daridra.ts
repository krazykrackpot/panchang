/**
 * Daridra (Poverty) Yoga Rules
 *
 * Classical yogas indicating financial difficulties, obstructed gains,
 * and wealth dissipation. These are the inverse of Dhana (wealth) yogas.
 *
 * All rules are inauspicious with domain: wealth.
 *
 * Sources: BPHS Ch.36, Phaladeepika Ch.7, Saravali, Jataka Parijata
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * House IDs:  1-12 (1-based, 1=ascendant)
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Shared strength assessor for Daridra yogas
// ─────────────────────────────────────────────────────────────────────────────

function daridraStrength(ctx: YogaContext, result: YogaDetectionResult): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let severeFactors = 0;
  let mitigatingFactors = 0;

  for (const pid of planets) {
    const dignity = ctx.dignity(pid);
    if (dignity === 'debilitated') severeFactors += 2;
    if (dignity === 'enemy') severeFactors++;
    if (ctx.isCombust(pid)) severeFactors++;
    if (dignity === 'exalted' || dignity === 'own' || dignity === 'moolatrikona') mitigatingFactors++;
    if (ctx.isKendra(ctx.planetHouse(pid))) mitigatingFactors++;
  }

  if (severeFactors >= 3 && mitigatingFactors === 0) return 'Strong';
  if (mitigatingFactors >= 2) return 'Weak';
  return 'Moderate';
}

// ─────────────────────────────────────────────────────────────────────────────
// Daridra Yoga Rules
// ─────────────────────────────────────────────────────────────────────────────

export const DARIDRA_RULES: YogaRule[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Daridra Yoga (General) — 11th lord in 6th/8th/12th
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Daridra Yoga (General)
   *
   * 11th lord in a dusthana (6/8/12). The house of gains is ruled by a planet
   * trapped in a house of loss, debt, or suffering. Gains are obstructed.
   *
   * Source: BPHS Ch.36; Phaladeepika Ch.7
   */
  {
    id: 'daridra-general',
    name: { en: 'Daridra Yoga', hi: 'दरिद्र योग', sa: 'दरिद्रयोगः' },
    group: 'dhana',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.36; Phaladeepika Ch.7',

    conditions: {
      type: 'lord_in_house',
      lordOfHouse: 11,
      inHouses: [6, 8, 12],
    },

    assessStrength: daridraStrength,

    affectedDomains: ['wealth'],
    domainImpactWeight: 2,

    formationRule: {
      en: '11th lord (gains) in a dusthana (6th/8th/12th) — income and gains are obstructed',
      hi: '11वें भाव का स्वामी (लाभ) दुष्ट भाव (6/8/12) में — आय और लाभ बाधित',
    },
    description: {
      en: 'Daridra Yoga obstructs the flow of income and gains. The 11th house — signifier of profits, elder siblings, and fulfilment of desires — has its lord trapped in a house of disease (6th), transformation/debt (8th), or loss/expenditure (12th). The native earns with difficulty and may see gains consumed by debts, health expenses, or hidden losses. This does not mean permanent poverty but indicates that wealth requires exceptional effort.',
      hi: 'दरिद्र योग आय और लाभ के प्रवाह को बाधित करता है। 11वें भाव — लाभ, ज्येष्ठ भाई-बहन और इच्छाओं की पूर्ति का सूचक — का स्वामी रोग (6ठे), ऋण (8वें), या व्यय (12वें) भाव में फँसा है। जातक कठिनाई से कमाता है और लाभ ऋण या छिपे नुकसान में खप सकते हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Daridra (Lagna-12) — Lagna lord in 12th house
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Daridra (Lagna-12) — Self-undermining
   *
   * Lagna lord in the 12th house. The self (1st) is directed towards
   * expenditure, loss, and foreign lands (12th). Self-undermining patterns.
   *
   * Source: BPHS Ch.36; Saravali
   */
  {
    id: 'daridra-lagna-12',
    name: { en: 'Daridra (Lagna-12)', hi: 'दरिद्र (लग्न-12)', sa: 'दरिद्रयोगः (लग्नद्वादशे)' },
    group: 'dhana',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.36; Saravali',

    conditions: {
      type: 'lord_in_house',
      lordOfHouse: 1,
      inHouses: [12],
    },

    assessStrength: daridraStrength,

    affectedDomains: ['wealth'],
    domainImpactWeight: 1,

    formationRule: {
      en: 'Lagna lord in the 12th house — the self is directed towards expenditure and loss',
      hi: 'लग्न स्वामी 12वें भाव में — आत्म व्यय और हानि की ओर निर्देशित',
    },
    description: {
      en: 'When the lagna lord occupies the 12th house, the native\'s energy and identity are channelled towards expenses, isolation, or foreign lands. Self-undermining patterns emerge — the person may unconsciously sabotage financial stability or prioritise spending over saving. In spiritual contexts, this can indicate detachment from material concerns (which is positive), but materially it creates chronic expenditure exceeding income.',
      hi: 'जब लग्न स्वामी 12वें भाव में होता है, जातक की ऊर्जा और पहचान व्यय, एकांत या विदेश की ओर निर्देशित होती है। आत्म-विनाशकारी पैटर्न उभरते हैं — व्यक्ति अनजाने में आर्थिक स्थिरता को नुकसान पहुँचा सकता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Daridra (2nd in 12) — 2nd lord in 12th
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Daridra (2nd in 12) — Wealth dissipated through expenses
   *
   * 2nd lord in the 12th house. Accumulated wealth (2nd) flows directly
   * into the house of expenditure (12th). Family wealth dissipates.
   *
   * Source: BPHS Ch.36; Jataka Parijata
   */
  {
    id: 'daridra-2nd-in-12',
    name: { en: 'Daridra (2nd in 12)', hi: 'दरिद्र (2-12)', sa: 'दरिद्रयोगः (द्वितीये द्वादशे)' },
    group: 'dhana',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.36; Jataka Parijata',

    conditions: {
      type: 'lord_in_house',
      lordOfHouse: 2,
      inHouses: [12],
    },

    assessStrength: daridraStrength,

    affectedDomains: ['wealth'],
    domainImpactWeight: 2,

    formationRule: {
      en: '2nd lord (wealth, family) in 12th house (expenditure, loss) — accumulated wealth dissipates',
      hi: '2रे भाव का स्वामी (धन, परिवार) 12वें भाव (व्यय, हानि) में — संचित धन बिखर जाता है',
    },
    description: {
      en: 'The 2nd lord in the 12th house creates a direct pipeline from wealth accumulation to expenditure. The native may earn well but finds that money slips away through medical bills, legal costs, foreign travel, or charitable giving. Family wealth may be spent rather than preserved. The specific nature of expenditure depends on the 2nd lord\'s nature and sign placement.',
      hi: '2रे स्वामी का 12वें भाव में होना धन संचय से व्यय तक सीधा मार्ग बनाता है। जातक अच्छा कमा सकता है लेकिन पैसा चिकित्सा, कानूनी खर्च, विदेश यात्रा या दान से निकल जाता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Daridra (11th in 6/12) — Gains in debt/loss houses
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Daridra (11th in 6/12) — 11th lord in 6th or 12th
   *
   * The gains house lord in houses of debt or loss (not 8th — that's the
   * general Daridra above). Specifically targets service/debt and expenditure.
   *
   * Source: BPHS Ch.36; Phaladeepika
   */
  {
    id: 'daridra-11th-in-6-12',
    name: { en: 'Daridra (11th in 6/12)', hi: 'दरिद्र (11-6/12)', sa: 'दरिद्रयोगः (एकादशे षष्ठद्वादशे)' },
    group: 'dhana',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.36; Phaladeepika',

    conditions: {
      type: 'lord_in_house',
      lordOfHouse: 11,
      inHouses: [6, 12],
    },

    assessStrength: daridraStrength,

    affectedDomains: ['wealth'],
    domainImpactWeight: 1,

    formationRule: {
      en: '11th lord in 6th (debt/disease) or 12th (expenditure/loss) — gains consumed by obligations',
      hi: '11वें का स्वामी 6ठे (ऋण/रोग) या 12वें (व्यय/हानि) में — लाभ दायित्वों में खप जाते हैं',
    },
    description: {
      en: 'When the 11th lord occupies the 6th or 12th, gains are consumed by debts, service obligations, or unplanned expenses. In the 6th, income may come through competitive or service-oriented work but is eroded by health costs or legal battles. In the 12th, earnings flow towards foreign investments, spiritual pursuits, or institutional expenses. The native works hard but retains less than expected.',
      hi: 'जब 11वें का स्वामी 6ठे या 12वें में होता है, लाभ ऋण, सेवा दायित्वों या अनियोजित व्यय में खप जाते हैं। जातक कड़ी मेहनत करता है लेकिन अपेक्षा से कम बचा पाता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Daridra (Malefic Axis) — Malefics in both 1st and 7th
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Daridra (Malefic Axis) — Self and partner axis afflicted
   *
   * Natural malefics in both the 1st and 7th houses simultaneously.
   * Both the self and partnership axis are under pressure, affecting
   * both personal and business finances.
   *
   * Source: Saravali; Jataka Parijata
   */
  {
    id: 'daridra-malefic-axis',
    name: { en: 'Daridra (Malefic Axis)', hi: 'दरिद्र (पापग्रह अक्ष)', sa: 'दरिद्रयोगः (पापाक्षः)' },
    group: 'dhana',
    isAuspicious: false,
    classicalRef: 'Saravali; Jataka Parijata',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Natural malefics: Sun(0), Mars(2), Saturn(6), Rahu(7), Ketu(8)
        const MALEFIC_IDS = [0, 2, 6, 7, 8];

        const planetsIn1 = ctx.planetsInHouse(1);
        const planetsIn7 = ctx.planetsInHouse(7);

        const maleficsIn1 = planetsIn1.filter(pid => MALEFIC_IDS.includes(pid));
        const maleficsIn7 = planetsIn7.filter(pid => MALEFIC_IDS.includes(pid));

        const present = maleficsIn1.length > 0 && maleficsIn7.length > 0;

        return {
          present,
          involvedPlanets: present ? [...maleficsIn1, ...maleficsIn7] : [],
          customData: present ? { maleficsIn1, maleficsIn7 } : undefined,
        };
      },
    },

    assessStrength: (_ctx: YogaContext, result: YogaDetectionResult) => {
      const count = result.involvedPlanets.length;
      if (count >= 4) return 'Strong';
      if (count >= 3) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: ['wealth', 'marriage'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Natural malefics in both the 1st and 7th houses — the self-partnership axis is doubly afflicted',
      hi: 'प्राकृतिक पापग्रह 1ले और 7वें दोनों भावों में — आत्म-साझेदारी अक्ष दोहरा पीड़ित',
    },
    description: {
      en: 'The malefic axis yoga places natural malefics on both poles of the self-partnership axis. The 1st house (self, body, initiative) and 7th house (partnerships, business, spouse) are simultaneously afflicted. This creates challenges in both personal finance and business/partnership income. The native may find that their own impulsive tendencies (1st) and difficult partnerships (7th) combine to erode wealth.',
      hi: 'पापग्रह अक्ष योग आत्म-साझेदारी अक्ष के दोनों ध्रुवों पर प्राकृतिक पापग्रह रखता है। 1ला भाव (आत्म, शरीर) और 7वां भाव (साझेदारी, व्यापार, जीवनसाथी) एक साथ पीड़ित हैं। यह व्यक्तिगत वित्त और व्यापार दोनों में चुनौतियाँ पैदा करता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Daridra (Saturn-Mars 2nd) — Saturn and Mars conjunct in 2nd
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Daridra (Saturn-Mars 2nd) — Destructive for accumulated wealth
   *
   * Saturn and Mars conjunct in the 2nd house. Two harsh malefics in the
   * house of accumulated wealth and family create destructive financial patterns.
   *
   * Source: Saravali; Phaladeepika
   */
  {
    id: 'daridra-saturn-mars-2nd',
    name: { en: 'Daridra (Saturn-Mars 2nd)', hi: 'दरिद्र (शनि-मंगल 2)', sa: 'दरिद्रयोगः (शनिमङ्गलद्वितीये)' },
    group: 'dhana',
    isAuspicious: false,
    classicalRef: 'Saravali; Phaladeepika',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const saturnHouse = ctx.planetHouse(6); // Saturn = 6
        const marsHouse = ctx.planetHouse(2);   // Mars = 2

        // Both must be in the 2nd house
        const present = saturnHouse === 2 && marsHouse === 2;

        return {
          present,
          involvedPlanets: present ? [2, 6] : [], // Mars, Saturn
        };
      },
    },

    assessStrength: (ctx: YogaContext, _result: YogaDetectionResult) => {
      // Stronger if both are also in enemy/debilitated signs (harsher)
      const marsDig = ctx.dignity(2);
      const satDig = ctx.dignity(6);
      const marsHarsh = marsDig === 'debilitated' || marsDig === 'enemy';
      const satHarsh = satDig === 'debilitated' || satDig === 'enemy';
      if (marsHarsh && satHarsh) return 'Strong';
      if (marsHarsh || satHarsh) return 'Moderate';
      return 'Weak';
    },

    affectedDomains: ['wealth', 'family'],
    domainImpactWeight: 2,

    formationRule: {
      en: 'Saturn and Mars conjunct in the 2nd house — two harsh malefics destroy accumulated wealth',
      hi: 'शनि और मंगल 2रे भाव में युति — दो कठोर पापग्रह संचित धन का विनाश',
    },
    description: {
      en: 'Saturn (restriction, delay, chronic problems) and Mars (aggression, impulsive spending, accidents) together in the 2nd house (wealth, family, speech) create a potent combination for financial destruction. The native may experience sudden losses (Mars) followed by prolonged recovery (Saturn), harsh speech that damages business relationships, or family conflicts over money.',
      hi: 'शनि (प्रतिबंध, विलंब) और मंगल (आक्रामकता, आवेगी खर्च) 2रे भाव (धन, परिवार, वाणी) में एक साथ आर्थिक विनाश का शक्तिशाली संयोग बनाते हैं। जातक को अचानक हानि (मंगल) और लम्बी पुनर्प्राप्ति (शनि) का अनुभव हो सकता है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Daridra (12th in 1st) — 12th lord in lagna
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Daridra (12th in 1st) — Expenses dominate self
   *
   * 12th lord in lagna. The house of expenditure, loss, and foreign lands
   * dominates the self. The native is inclined towards spending over saving.
   *
   * Source: BPHS Ch.36; Saravali
   */
  {
    id: 'daridra-12th-in-1st',
    name: { en: 'Daridra (12th in 1st)', hi: 'दरिद्र (12-1)', sa: 'दरिद्रयोगः (द्वादशे प्रथमे)' },
    group: 'dhana',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.36; Saravali',

    conditions: {
      type: 'lord_in_house',
      lordOfHouse: 12,
      inHouses: [1],
    },

    assessStrength: daridraStrength,

    affectedDomains: ['wealth'],
    domainImpactWeight: 1,

    formationRule: {
      en: '12th lord (expenditure, loss) in the 1st house (lagna) — expenses dominate the self',
      hi: '12वें भाव का स्वामी (व्यय, हानि) 1ले भाव (लग्न) में — व्यय आत्म पर हावी',
    },
    description: {
      en: 'When the 12th lord occupies the lagna, the native\'s personality and life direction are coloured by expenditure, loss, or detachment. Money tends to flow outward — charitable giving, foreign travel, medical expenses, or spiritual pursuits. While not always financially devastating, the native must consciously cultivate saving habits. This placement can also indicate someone who gains through foreign connections or spiritual work.',
      hi: 'जब 12वें का स्वामी लग्न में होता है, जातक का व्यक्तित्व और जीवन दिशा व्यय, हानि या वैराग्य से रंगित होती है। धन बाहर प्रवाहित होता है — दान, विदेश यात्रा, चिकित्सा व्यय या आध्यात्मिक साधना।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Daridra (5th in Dusthana) — Intelligence/speculation losses
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Daridra (5th in Dusthana) — 5th lord in 6th/8th/12th
   *
   * The 5th lord (intelligence, speculation, merit, children) in a dusthana.
   * Losses through speculation, poor investment decisions, or children-related
   * expenses. The native's Purva Punya (past-life merit) is blocked.
   *
   * Source: BPHS Ch.36; Jataka Parijata
   */
  {
    id: 'daridra-5th-in-dusthana',
    name: { en: 'Daridra (5th in Dusthana)', hi: 'दरिद्र (5-दुष्ट)', sa: 'दरिद्रयोगः (पञ्चमे दुःस्थाने)' },
    group: 'dhana',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.36; Jataka Parijata',

    conditions: {
      type: 'lord_in_house',
      lordOfHouse: 5,
      inHouses: [6, 8, 12],
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      const lord5 = ctx.houseLord(5);
      const lord5House = ctx.planetHouse(lord5);
      // In 8th (sudden losses) is worst; 6th (debt) moderate; 12th (expenditure) mildest
      if (lord5House === 8) {
        const d = ctx.dignity(lord5);
        if (d === 'debilitated' || d === 'enemy') return 'Strong';
        return 'Moderate';
      }
      return daridraStrength(ctx, result);
    },

    affectedDomains: ['wealth', 'children'],
    domainImpactWeight: 1,

    formationRule: {
      en: '5th lord (intelligence, speculation, children) in a dusthana (6th/8th/12th) — merit and speculation losses',
      hi: '5वें भाव का स्वामी (बुद्धि, सट्टा, संतान) दुष्ट भाव (6/8/12) में — पुण्य और सट्टे में हानि',
    },
    description: {
      en: 'The 5th lord in a dusthana blocks Purva Punya (past-life merit) and creates losses through speculation, investments, or decisions based on faulty intelligence. The native may make consistently poor financial bets, lose through stock markets or gambling, or face unexpected expenses related to children\'s education or health. The 8th house placement is particularly harsh — indicating sudden, transformative financial losses.',
      hi: '5वें स्वामी का दुष्ट भाव में होना पूर्व पुण्य (पूर्व जन्म के सुकृत) को अवरुद्ध करता है और सट्टा, निवेश या दोषपूर्ण बुद्धि के निर्णयों से हानि पैदा करता है। जातक लगातार खराब आर्थिक दांव लगा सकता है या शेयर बाज़ार में नुकसान उठा सकता है।',
    },
  },
];
