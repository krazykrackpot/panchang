/**
 * Nabhasa Yoga Rules
 *
 * The 32 Nabhasa ("celestial") yogas from Phaladeepika Ch.7. These are based
 * on the overall pattern of planetary distribution across the chart — not
 * specific planet-house combinations, but geometric shapes formed by the
 * collective placement of planets.
 *
 * Four sub-groups:
 * 1. Sankhya (Number) — how many houses are occupied by Sun through Saturn (7 yogas)
 * 2. Akriti (Shape) — geometric patterns formed by planet placements (varied)
 * 3. Aashray (Sign quality) — all planets in movable/fixed/dual signs (3 yogas)
 * 4. Dala (Kendra pattern) — benefics/malefics in kendras vs upachaya (2 yogas)
 *
 * Important: Sankhya yogas are MUTUALLY EXCLUSIVE — only one can be present per chart.
 * The engine should detect all, but only the matching one will fire.
 *
 * "Sun through Saturn" = IDs 0-6 (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn).
 * Rahu/Ketu excluded from most Nabhasa calculations per classical texts.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

import type { YogaRule, YogaContext, YogaDetectionResult } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: count occupied houses for Sun-Saturn
// ─────────────────────────────────────────────────────────────────────────────

/** Planet IDs for Sun through Saturn (classical seven) */
const SUN_TO_SATURN = [0, 1, 2, 3, 4, 5, 6];

/**
 * Get the set of distinct houses occupied by Sun through Saturn.
 */
function getOccupiedHouses(ctx: YogaContext): Set<number> {
  const houses = new Set<number>();
  for (const pid of SUN_TO_SATURN) {
    houses.add(ctx.planetHouse(pid));
  }
  return houses;
}

/**
 * Get all planets (Sun-Saturn) involved in the chart pattern.
 */
function allSevenPlanets(): number[] {
  return [...SUN_TO_SATURN];
}

/**
 * Check if all Sun-Saturn planets are in the given set of houses.
 */
function allPlanetsInHouses(ctx: YogaContext, allowedHouses: Set<number>): boolean {
  for (const pid of SUN_TO_SATURN) {
    if (!allowedHouses.has(ctx.planetHouse(pid))) return false;
  }
  return true;
}

/**
 * Shared strength assessor for Nabhasa yogas.
 * Strength depends on dignity of key involved planets.
 */
function assessNabhasaStrength(ctx: YogaContext, result: YogaDetectionResult): 'Strong' | 'Moderate' | 'Weak' {
  let dignityScore = 0;
  for (const pid of result.involvedPlanets) {
    const d = ctx.dignity(pid);
    if (d === 'exalted' || d === 'own' || d === 'moolatrikona') dignityScore += 1;
    else if (d === 'debilitated') dignityScore -= 1;
  }
  if (dignityScore >= 3) return 'Strong';
  if (dignityScore >= 0) return 'Moderate';
  return 'Weak';
}

// ═══════════════════════════════════════════════════════════════════════════════
// SANKHYA (Number) Sub-group — 7 yogas based on occupied house count
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Gola Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets (Sun through Saturn) in 1 house.
 * Extremely rare — essentially impossible in practice.
 *
 * Results: Inauspicious. The native has an extremely narrow life,
 * lacking variety and breadth of experience. Poverty and hardship.
 */
const GOLA: YogaRule = {
  id: 'nabhasa-gola',
  name: { en: 'Gola', hi: 'गोल', sa: 'गोलम्' },
  group: 'nabhasa',
  subGroup: 'sankhya',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'houses_occupied',
    count: 1,
    planetsConsidered: 'sun_to_saturn',
  },

  assessStrength: () => 'Strong', // If present, always strong (extreme concentration)

  affectedDomains: 'all',
  domainImpactWeight: 3,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy a single house.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) एक ही भाव में स्थित हैं।',
  },

  description: {
    en: 'Gola Yoga — all planets concentrated in one house — is an extremely rare and inauspicious formation. Life is narrow and constrained, with all energy focused on one area to the detriment of all others. The native faces poverty, limited opportunities, and a constricted existence.',
    hi: 'गोल योग — सभी ग्रह एक भाव में केंद्रित — अत्यंत दुर्लभ और अशुभ योग है। जीवन संकीर्ण और सीमित होता है, सारी ऊर्जा एक क्षेत्र में केंद्रित होती है।',
  },
};

/**
 * Yuga Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets in exactly 2 houses.
 *
 * Results: Inauspicious. Limited scope of life, though less extreme than Gola.
 * The native struggles with poverty and social isolation.
 */
const YUGA: YogaRule = {
  id: 'nabhasa-yuga',
  name: { en: 'Yuga', hi: 'युग', sa: 'युगम्' },
  group: 'nabhasa',
  subGroup: 'sankhya',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'houses_occupied',
    count: 2,
    planetsConsidered: 'sun_to_saturn',
  },

  assessStrength: () => 'Strong',

  affectedDomains: 'all',
  domainImpactWeight: 3,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy exactly 2 houses.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) ठीक 2 भावों में स्थित हैं।',
  },

  description: {
    en: 'Yuga Yoga — all planets confined to two houses — severely limits the scope of life. While less extreme than Gola, the native still faces poverty, social restrictions, and a lack of diverse opportunities. Life revolves around two narrow themes with little breadth.',
    hi: 'युग योग — सभी ग्रह दो भावों तक सीमित — जीवन की सीमा को गंभीर रूप से सीमित करता है। निर्धनता, सामाजिक प्रतिबंध और विविध अवसरों की कमी होती है।',
  },
};

/**
 * Shoola Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets in exactly 3 houses.
 *
 * Results: Mixed. Concentrated power but narrow focus. The native may be
 * sharp and capable in specific areas but lacks balance. Prone to anger,
 * conflict, and health issues.
 */
const SHOOLA: YogaRule = {
  id: 'nabhasa-shoola',
  name: { en: 'Shoola', hi: 'शूल', sa: 'शूलम्' },
  group: 'nabhasa',
  subGroup: 'sankhya',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'houses_occupied',
    count: 3,
    planetsConsidered: 'sun_to_saturn',
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 2,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy exactly 3 houses.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) ठीक 3 भावों में स्थित हैं।',
  },

  description: {
    en: 'Shoola Yoga — a triangular concentration of planets in three houses — indicates sharp but narrow abilities. The native may be fierce, quick-tempered, and intense. They excel in focused domains but lack the balanced life experience that broader distribution provides. Health issues and conflicts are common.',
    hi: 'शूल योग — तीन भावों में ग्रहों की त्रिकोणीय एकाग्रता — तीव्र लेकिन संकीर्ण क्षमताओं का संकेत देता है। जातक उग्र, तीव्र स्वभाव का हो सकता है। स्वास्थ्य समस्याएँ और संघर्ष सामान्य हैं।',
  },
};

/**
 * Kedara Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets in exactly 4 houses.
 *
 * Results: Mixed to positive. Moderate concentration. The native is
 * industrious, like a farmer (kedara = field), working steadily to
 * produce results. Helpful to others, agricultural or land-based success.
 */
const KEDARA: YogaRule = {
  id: 'nabhasa-kedara',
  name: { en: 'Kedara', hi: 'केदार', sa: 'केदारम्' },
  group: 'nabhasa',
  subGroup: 'sankhya',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'houses_occupied',
    count: 4,
    planetsConsidered: 'sun_to_saturn',
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy exactly 4 houses.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) ठीक 4 भावों में स्थित हैं।',
  },

  description: {
    en: 'Kedara Yoga — named after a cultivated field — indicates a hardworking, industrious nature. The moderate concentration of planets gives focused energy without excessive narrowness. The native prospers through persistent effort, often in agriculture, land development, or steady professional work. They are helpful to others and build wealth gradually.',
    hi: 'केदार योग — खेत के नाम पर — मेहनती, परिश्रमी स्वभाव का संकेत देता है। ग्रहों की मध्यम एकाग्रता केंद्रित ऊर्जा देती है। जातक निरंतर प्रयास से समृद्ध होता है।',
  },
};

/**
 * Pasha Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets in exactly 5 houses.
 *
 * Results: Positive. Good distribution with some focus. The native has
 * varied interests and capabilities. May face bondage or entanglement
 * (pasha = noose) in some area but overall positive life outcomes.
 */
const PASHA: YogaRule = {
  id: 'nabhasa-pasha',
  name: { en: 'Pasha', hi: 'पाश', sa: 'पाशम्' },
  group: 'nabhasa',
  subGroup: 'sankhya',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'houses_occupied',
    count: 5,
    planetsConsidered: 'sun_to_saturn',
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy exactly 5 houses.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) ठीक 5 भावों में स्थित हैं।',
  },

  description: {
    en: 'Pasha Yoga — the "noose" pattern with planets in five houses — indicates a life with good variety and moderate focus. The native has diverse interests and competencies. While some area of life may feel like a binding constraint (the noose), overall outcomes are positive with balanced opportunities across multiple domains.',
    hi: 'पाश योग — पाँच भावों में ग्रहों का "फंदा" पैटर्न — अच्छी विविधता और मध्यम ध्यान वाले जीवन का संकेत देता है। जातक के विविध रुचियाँ और क्षमताएँ होती हैं।',
  },
};

/**
 * Damini (Dama) Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets in exactly 6 houses.
 *
 * Results: Positive. Well-spread distribution. The native is generous,
 * charitable, and enjoys a balanced life with achievements across
 * multiple areas. Good fortune and social standing.
 */
const DAMINI: YogaRule = {
  id: 'nabhasa-damini',
  name: { en: 'Damini', hi: 'दामिनी', sa: 'दामिनी' },
  group: 'nabhasa',
  subGroup: 'sankhya',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'houses_occupied',
    count: 6,
    planetsConsidered: 'sun_to_saturn',
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy exactly 6 houses.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) ठीक 6 भावों में स्थित हैं।',
  },

  description: {
    en: 'Damini Yoga — planets well-spread across six houses — indicates a generous, balanced, and fortunate life. The native achieves success across multiple domains: career, family, learning, and social standing. They are charitable and well-regarded in their community.',
    hi: 'दामिनी योग — छह भावों में ग्रह अच्छी तरह फैले — उदार, संतुलित और भाग्यशाली जीवन का संकेत देता है। जातक अनेक क्षेत्रों में सफलता प्राप्त करता है।',
  },
};

/**
 * Veena Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets in exactly 7 houses (each planet in its own house).
 *
 * Results: Very positive. Every house activated. The native has diverse
 * talents, balanced life, love for music and arts. Like the veena (stringed
 * instrument), their life has many harmonious notes.
 */
const VEENA: YogaRule = {
  id: 'nabhasa-veena',
  name: { en: 'Veena', hi: 'वीणा', sa: 'वीणा' },
  group: 'nabhasa',
  subGroup: 'sankhya',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'houses_occupied',
    count: 7,
    planetsConsidered: 'sun_to_saturn',
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 2,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy exactly 7 different houses — each in its own house.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) ठीक 7 अलग-अलग भावों में — प्रत्येक अपने भाव में।',
  },

  description: {
    en: 'Veena Yoga — named after the celestial stringed instrument — indicates a harmonious, multi-talented life. With every planet in a different house, the native\'s life resonates across all domains. They are artistically inclined, musically gifted, and enjoy balanced success in career, relationships, and personal growth.',
    hi: 'वीणा योग — दिव्य तंतु वाद्य के नाम पर — सुसंगत, बहुप्रतिभाशाली जीवन का संकेत देता है। प्रत्येक ग्रह अलग भाव में होने से, जातक का जीवन सभी क्षेत्रों में गुंजायमान होता है।',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// AKRITI (Shape) Sub-group — geometric patterns
// ═══════════════════════════════════════════════════════════════════════════════

// NOTE: Graha Malika was previously defined here as 'nabhasa-graha-malika' but has been
// removed to avoid duplication with the more detailed version in malika.ts (id: 'graha-malika').
// The malika.ts version includes variant names, first/last planet roles, and dynamic domains.

/**
 * Ardha Chandra Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets in 7 consecutive houses (forming a half-circle).
 * This is a special case of Graha Malika where the chain spans exactly 7 houses.
 *
 * Results: Highly auspicious. The native is a natural leader, beautiful,
 * commanding, and prosperous. Like the half-moon, they illuminate all
 * they touch.
 */
const ARDHA_CHANDRA: YogaRule = {
  id: 'nabhasa-ardha-chandra',
  name: { en: 'Ardha Chandra', hi: 'अर्ध चन्द्र', sa: 'अर्धचन्द्रम्' },
  group: 'nabhasa',
  subGroup: 'akriti',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const occupied = getOccupiedHouses(ctx);
      // Must be exactly 7 houses occupied AND they must be consecutive
      if (occupied.size !== 7) {
        return { present: false, strength: 'Weak', involvedPlanets: [] };
      }

      // Check if all 7 are consecutive (wrap-around allowed)
      const houses = Array.from(occupied).sort((a, b) => a - b);
      for (let start = 0; start < 12; start++) {
        let allPresent = true;
        for (let i = 0; i < 7; i++) {
          const h = ((start + i) % 12) + 1;
          if (!occupied.has(h)) { allPresent = false; break; }
        }
        if (allPresent) {
          return {
            present: true,
            involvedPlanets: allSevenPlanets(),
            customData: { startHouse: start + 1, chainLength: 7 },
          };
        }
      }

      return { present: false, strength: 'Weak', involvedPlanets: [] };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 2,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy 7 consecutive houses, forming a half-circle.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) 7 क्रमागत भावों में स्थित हैं, अर्ध-वृत्त बनाते हुए।',
  },

  description: {
    en: 'Ardha Chandra — the half-moon — is a powerful Akriti yoga. All seven planets span half the zodiac in an unbroken chain, illuminating seven consecutive life domains. The native is a natural leader: commanding, attractive, and prosperous. They enjoy broad influence and a life of balanced, progressive fortune.',
    hi: 'अर्ध चन्द्र — आधा चाँद — एक शक्तिशाली आकृति योग है। सात ग्रह राशि चक्र के आधे भाग में अखंड श्रृंखला बनाते हैं। जातक स्वाभाविक नेता होता है: प्रभावशाली, आकर्षक और समृद्ध।',
  },
};

/**
 * Nauka Yoga — Phaladeepika Ch.7 v.14
 *
 * "If all the planets occupy the seven houses from the Lagna, the yoga
 * called Nauka is formed. The person born in it will earn his livelihood
 * by water, will be famous, wicked, miserly, and miserable."
 * — Phaladeepika, Chapter 7, Verse 14 (translated by S.S. Sareen)
 *
 * Formation: All planets in houses 1 through 7 (first half of the chart).
 *
 * Results: Wealth through maritime/water-related activities, trade, travel.
 * The native prospers through navigation, shipping, or water resources.
 */
const NAUKA: YogaRule = {
  id: 'nabhasa-nauka',
  name: { en: 'Nauka', hi: 'नौका', sa: 'नौका' },
  group: 'nabhasa',
  subGroup: 'akriti',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const allowedHouses = new Set([1, 2, 3, 4, 5, 6, 7]);
      const present = allPlanetsInHouses(ctx, allowedHouses);
      return {
        present,
        involvedPlanets: present ? allSevenPlanets() : [],
      };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) are in houses 1 through 7.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) पहले से सातवें भाव में स्थित हैं।',
  },

  description: {
    en: 'Nauka Yoga — the "boat" — places all planets in the visible half of the chart (houses 1-7). The native prospers through travel, trade, shipping, or water-related activities. They have a pioneering spirit, navigating life\'s currents with skill and earning through movement and commerce.',
    hi: 'नौका योग — "नाव" — सभी ग्रहों को चार्ट के दृश्य भाग (भाव 1-7) में रखता है। जातक यात्रा, व्यापार, जहाजरानी या जल-संबंधित गतिविधियों से समृद्ध होता है।',
  },
};

/**
 * Koota Yoga — Phaladeepika Ch.7
 *
 * Formation: All planets in houses 4 through 10 (angular emphasis).
 *
 * Results: The native lives in fortified or enclosed spaces — prisons,
 * forts, monasteries, or gated communities. Can indicate authority
 * within confined structures.
 */
const KOOTA: YogaRule = {
  id: 'nabhasa-koota',
  name: { en: 'Koota', hi: 'कूट', sa: 'कूटम्' },
  group: 'nabhasa',
  subGroup: 'akriti',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const allowedHouses = new Set([4, 5, 6, 7, 8, 9, 10]);
      const present = allPlanetsInHouses(ctx, allowedHouses);
      return {
        present,
        involvedPlanets: present ? allSevenPlanets() : [],
      };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) are in houses 4 through 10.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) चौथे से दसवें भाव में स्थित हैं।',
  },

  description: {
    en: 'Koota Yoga — the "fortress" — concentrates all planets in the mid-chart houses (4-10). The native may live or work in confined, structured environments: military bases, monasteries, prisons, or highly regulated institutions. They can hold authority within such structures but lack freedom of movement.',
    hi: 'कूट योग — "किला" — सभी ग्रहों को मध्य-चार्ट भावों (4-10) में केंद्रित करता है। जातक सीमित, संरचित वातावरण में रह या काम कर सकता है।',
  },
};

/**
 * Chhatra Yoga — Phaladeepika Ch.7
 *
 * Formation: All planets in houses 7 through 1 (second half wrapping to start).
 *
 * Results: The native is helpful to many, enjoys protection from superiors,
 * charitable and philanthropic. Like an umbrella (chhatra), they shelter others.
 */
const CHHATRA: YogaRule = {
  id: 'nabhasa-chhatra',
  name: { en: 'Chhatra', hi: 'छत्र', sa: 'छत्रम्' },
  group: 'nabhasa',
  subGroup: 'akriti',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const allowedHouses = new Set([7, 8, 9, 10, 11, 12, 1]);
      const present = allPlanetsInHouses(ctx, allowedHouses);
      return {
        present,
        involvedPlanets: present ? allSevenPlanets() : [],
      };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) are in houses 7 through 1 (wrapping around).',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) सातवें से पहले भाव तक (वृत्ताकार) स्थित हैं।',
  },

  description: {
    en: 'Chhatra Yoga — the "umbrella" or "royal canopy" — places all planets in the upper half of the chart. The native is charitable, protective of others, and enjoys patronage from powerful people. Like a royal parasol, they provide shelter and command loyalty.',
    hi: 'छत्र योग — "छतरी" या "राजसी छत्र" — सभी ग्रहों को चार्ट के ऊपरी भाग में रखता है। जातक दानशील, दूसरों की रक्षा करने वाला और शक्तिशाली लोगों से संरक्षण प्राप्त करता है।',
  },
};

/**
 * Dhanush Yoga — Phaladeepika Ch.7
 *
 * Formation: All planets in houses 4 through 10 (same as Koota but
 * interpreted as a bow shape — the "upper half" from IC to MC).
 *
 * Note: Some texts distinguish Dhanush from Koota by requiring planets
 * to be specifically in 4th and 10th (the tips of the bow) plus houses between.
 * We implement the stricter interpretation: planets in 4-10 AND at least one
 * planet in both the 4th AND 10th houses.
 *
 * Results: Wealth through valour, archery, military skill. The native is
 * brave and skilled in combat arts.
 */
const DHANUSH: YogaRule = {
  id: 'nabhasa-dhanush',
  name: { en: 'Dhanush', hi: 'धनुष', sa: 'धनुषम्' },
  group: 'nabhasa',
  subGroup: 'akriti',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const allowedHouses = new Set([4, 5, 6, 7, 8, 9, 10]);
      if (!allPlanetsInHouses(ctx, allowedHouses)) {
        return { present: false, strength: 'Weak', involvedPlanets: [] };
      }

      // Stricter: require at least one planet in both tips (4th AND 10th)
      const in4 = ctx.planetsInHouse(4).filter(id => SUN_TO_SATURN.includes(id));
      const in10 = ctx.planetsInHouse(10).filter(id => SUN_TO_SATURN.includes(id));

      const present = in4.length > 0 && in10.length > 0;
      return {
        present,
        involvedPlanets: present ? allSevenPlanets() : [],
      };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets in houses 4-10 with at least one planet at each tip (4th and 10th houses), forming a bow shape.',
    hi: 'सभी 7 ग्रह भाव 4-10 में, प्रत्येक सिरे (4वां और 10वां भाव) पर कम से कम एक ग्रह, धनुष आकार बनाते हुए।',
  },

  description: {
    en: 'Dhanush Yoga — the "bow" — forms when planets span from the 4th to 10th house with endpoints anchored. The native is brave, skilled in competitive pursuits, and earns through valour or martial discipline. Success in military, sports, or assertive professional fields.',
    hi: 'धनुष योग — "धनुष" — जब ग्रह 4 से 10वें भाव तक फैले और दोनों सिरे स्थिर हों। जातक बहादुर, प्रतिस्पर्धी कार्यों में कुशल और पराक्रम से कमाता है।',
  },
};

/**
 * Shakata (Nabhasa) Yoga — Phaladeepika Ch.7
 *
 * Formation: All planets in the 1st and 7th houses only (opposition axis).
 * Not to be confused with Chandra group's Shakata (Moon 6/8/12 from Jupiter).
 *
 * Results: Mixed. The native is like a cart (shakata) — alternating between
 * fortune and misfortune. Life of extremes.
 */
const SHAKATA_NABHASA: YogaRule = {
  id: 'nabhasa-shakata',
  name: { en: 'Shakata (Nabhasa)', hi: 'शकट (नभस)', sa: 'शकटम्' },
  group: 'nabhasa',
  subGroup: 'akriti',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const allowedHouses = new Set([1, 7]);
      const present = allPlanetsInHouses(ctx, allowedHouses);
      return {
        present,
        involvedPlanets: present ? allSevenPlanets() : [],
      };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 2,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy only the 1st and 7th houses (opposition axis).',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) केवल पहले और सातवें भाव (विपरीत अक्ष) में स्थित हैं।',
  },

  description: {
    en: 'Shakata (Nabhasa) — the "cart wheel" — places all planets on the 1-7 axis of self and partnership. Life oscillates between extremes: wealth then poverty, success then failure. The native experiences dramatic ups and downs, like a cart wheel endlessly turning.',
    hi: 'शकट (नभस) — "गाड़ी का पहिया" — सभी ग्रहों को स्वयं और साझेदारी के 1-7 अक्ष पर रखता है। जीवन चरम सीमाओं के बीच झूलता है।',
  },
};

/**
 * Shringataka Yoga — Phaladeepika Ch.7
 *
 * Formation: All planets in trikona houses (1st, 5th, 9th only).
 *
 * Results: Auspicious but with conflict. The native is quarrelsome but
 * also fortunate, enjoying support from dharma (9th) and purva punya (5th).
 */
const SHRINGATAKA: YogaRule = {
  id: 'nabhasa-shringataka',
  name: { en: 'Shringataka', hi: 'शृंगाटक', sa: 'शृङ्गाटकम्' },
  group: 'nabhasa',
  subGroup: 'akriti',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const allowedHouses = new Set([1, 5, 9]);
      const present = allPlanetsInHouses(ctx, allowedHouses);
      return {
        present,
        involvedPlanets: present ? allSevenPlanets() : [],
      };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 2,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy only the trikona houses (1st, 5th, 9th).',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) केवल त्रिकोण भावों (1, 5, 9) में स्थित हैं।',
  },

  description: {
    en: 'Shringataka Yoga — planets concentrated in the three trikona (trinal) houses — indicates a life blessed by dharma and past merit. The 1st (self), 5th (intelligence/children), and 9th (fortune/guru) are the most auspicious houses. Despite some quarrelsome tendencies, the native enjoys strong spiritual protection and intellectual gifts.',
    hi: 'शृंगाटक योग — ग्रह तीन त्रिकोण भावों में केंद्रित — धर्म और पूर्व पुण्य से आशीर्वित जीवन का संकेत देता है। कुछ विवादास्पद प्रवृत्तियों के बावजूद, जातक को मजबूत आध्यात्मिक सुरक्षा और बौद्धिक उपहार प्राप्त होते हैं।',
  },
};

/**
 * Hala Yoga — Phaladeepika Ch.7
 *
 * Formation: All planets in one of three trine sets:
 * - 2nd, 6th, 10th (artha trikona — material success)
 * - 3rd, 7th, 11th (kama trikona — desire fulfillment)
 * - 4th, 8th, 12th (moksha trikona — spiritual/transformative)
 *
 * Results: The native is a farmer or labourer (hala = plough).
 * Toils hard but may lack refinement. Specific trine set determines area.
 */
const HALA: YogaRule = {
  id: 'nabhasa-hala',
  name: { en: 'Hala', hi: 'हल', sa: 'हलम्' },
  group: 'nabhasa',
  subGroup: 'akriti',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const trinePatterns = [
        new Set([2, 6, 10]), // artha trikona
        new Set([3, 7, 11]), // kama trikona
        new Set([4, 8, 12]), // moksha trikona
      ];

      for (const pattern of trinePatterns) {
        if (allPlanetsInHouses(ctx, pattern)) {
          return {
            present: true,
            involvedPlanets: allSevenPlanets(),
            customData: { trineSet: Array.from(pattern) },
          };
        }
      }

      return { present: false, strength: 'Weak', involvedPlanets: [] };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy one trine set: 2/6/10, 3/7/11, or 4/8/12.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) एक त्रिकोण समूह में: 2/6/10, 3/7/11, या 4/8/12।',
  },

  description: {
    en: 'Hala Yoga — the "plough" — concentrates all planets into one of three trine sets. In 2/6/10 (artha): hard work brings material rewards. In 3/7/11 (kama): effort directed toward desires and partnerships. In 4/8/12 (moksha): toil leads to spiritual transformation. The native works hard like a farmer but may lack breadth of experience.',
    hi: 'हल योग — "हल" — सभी ग्रहों को तीन त्रिकोण समूहों में से एक में केंद्रित करता है। जातक किसान की तरह कड़ी मेहनत करता है लेकिन अनुभव की विस्तृत श्रेणी से वंचित हो सकता है।',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// AASHRAY (Sign quality) Sub-group — based on sign modality
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Rajju Yoga — Phaladeepika Ch.7
 *
 * Formation: All planets in movable (chara) signs: Aries(1), Cancer(4), Libra(7), Capricorn(10).
 *
 * Results: The native loves travel, is restless, and constantly seeks change.
 * They prosper in foreign lands or through activities requiring mobility.
 */
const RAJJU: YogaRule = {
  id: 'nabhasa-rajju',
  name: { en: 'Rajju', hi: 'रज्जु', sa: 'रज्जुः' },
  group: 'nabhasa',
  subGroup: 'aashray',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      // Movable signs: Aries(1), Cancer(4), Libra(7), Capricorn(10)
      const movableSigns = new Set([1, 4, 7, 10]);
      for (const pid of SUN_TO_SATURN) {
        if (!movableSigns.has(ctx.planetSign(pid))) {
          return { present: false, strength: 'Weak', involvedPlanets: [] };
        }
      }
      return { present: true, strength: 'Moderate', involvedPlanets: allSevenPlanets() };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) are in movable signs (Aries, Cancer, Libra, Capricorn).',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) चर राशियों (मेष, कर्क, तुला, मकर) में स्थित हैं।',
  },

  description: {
    en: 'Rajju Yoga — all planets in movable signs — creates a restless, travel-loving personality. The native thrives on change and new experiences. They prosper in foreign lands, through frequent relocation, or in careers requiring constant movement. Stability is neither desired nor achieved.',
    hi: 'रज्जु योग — सभी ग्रह चर राशियों में — अस्थिर, यात्रा-प्रेमी व्यक्तित्व बनाता है। जातक परिवर्तन और नए अनुभवों पर फलता-फूलता है। विदेश में या गतिशीलता वाले करियर में समृद्ध होता है।',
  },
};

/**
 * Musala Yoga — Phaladeepika Ch.7
 *
 * Formation: All planets in fixed (sthira) signs: Taurus(2), Leo(5), Scorpio(8), Aquarius(11).
 *
 * Results: The native is steady, stubborn, proud, and wealthy. They hold
 * firm to their positions and build lasting structures. Slow but durable success.
 */
const MUSALA: YogaRule = {
  id: 'nabhasa-musala',
  name: { en: 'Musala', hi: 'मूसल', sa: 'मूसलम्' },
  group: 'nabhasa',
  subGroup: 'aashray',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      // Fixed signs: Taurus(2), Leo(5), Scorpio(8), Aquarius(11)
      const fixedSigns = new Set([2, 5, 8, 11]);
      for (const pid of SUN_TO_SATURN) {
        if (!fixedSigns.has(ctx.planetSign(pid))) {
          return { present: false, strength: 'Weak', involvedPlanets: [] };
        }
      }
      return { present: true, strength: 'Moderate', involvedPlanets: allSevenPlanets() };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) are in fixed signs (Taurus, Leo, Scorpio, Aquarius).',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) स्थिर राशियों (वृषभ, सिंह, वृश्चिक, कुम्भ) में स्थित हैं।',
  },

  description: {
    en: 'Musala Yoga — all planets in fixed signs — produces a steadfast, determined personality. The native is proud, wealthy, and resistant to change. They build lasting structures — businesses, institutions, legacies. Success comes slowly but endures. Stubbornness can be both their greatest strength and weakness.',
    hi: 'मूसल योग — सभी ग्रह स्थिर राशियों में — दृढ़, निश्चयी व्यक्तित्व बनाता है। जातक गर्वित, धनी और परिवर्तन के प्रति प्रतिरोधी होता है। स्थायी संरचनाएँ बनाता है।',
  },
};

/**
 * Nala Yoga — Phaladeepika Ch.7
 *
 * Formation: All planets in dual (dvisvabhava) signs: Gemini(3), Virgo(6), Sagittarius(9), Pisces(12).
 *
 * Results: The native is skilled, clever, deformed in some way (classical
 * interpretation), adaptable, and resourceful. Modern: versatile and dual-natured.
 */
const NALA: YogaRule = {
  id: 'nabhasa-nala',
  name: { en: 'Nala', hi: 'नल', sa: 'नलम्' },
  group: 'nabhasa',
  subGroup: 'aashray',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      // Dual signs: Gemini(3), Virgo(6), Sagittarius(9), Pisces(12)
      const dualSigns = new Set([3, 6, 9, 12]);
      for (const pid of SUN_TO_SATURN) {
        if (!dualSigns.has(ctx.planetSign(pid))) {
          return { present: false, strength: 'Weak', involvedPlanets: [] };
        }
      }
      return { present: true, strength: 'Moderate', involvedPlanets: allSevenPlanets() };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) are in dual signs (Gemini, Virgo, Sagittarius, Pisces).',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) द्विस्वभाव राशियों (मिथुन, कन्या, धनु, मीन) में स्थित हैं।',
  },

  description: {
    en: 'Nala Yoga — all planets in dual/mutable signs — creates an adaptable, versatile personality. The native is clever, resourceful, and skilled at handling multiple roles. They thrive in changing environments and can pivot quickly when circumstances shift. May lack the focus of fixed signs or the initiative of movable signs.',
    hi: 'नल योग — सभी ग्रह द्विस्वभाव राशियों में — अनुकूलनीय, बहुमुखी व्यक्तित्व बनाता है। जातक चतुर, संसाधनपूर्ण और अनेक भूमिकाओं को संभालने में कुशल होता है।',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DALA (Kendra/Upachaya pattern) Sub-group
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Mala Yoga — Phaladeepika Ch.7
 *
 * Formation: All natural benefics (Mercury, Jupiter, Venus, Moon) in kendras
 * (1/4/7/10), AND all natural malefics (Sun, Mars, Saturn) in houses 3/6/11.
 *
 * Results: Extremely auspicious. The native enjoys comforts, wealth, vehicles,
 * good reputation. Benefics protecting the angles while malefics serve in
 * upachaya (growth) houses is the ideal distribution.
 */
const MALA: YogaRule = {
  id: 'nabhasa-mala',
  name: { en: 'Mala', hi: 'माल', sa: 'मालम्' },
  group: 'nabhasa',
  subGroup: 'dala',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      // Natural benefics: Moon(1), Mercury(3), Jupiter(4), Venus(5)
      const benefics = [1, 3, 4, 5];
      // Natural malefics: Sun(0), Mars(2), Saturn(6)
      const malefics = [0, 2, 6];

      const kendras = new Set([1, 4, 7, 10]);
      const upachaya3611 = new Set([3, 6, 11]);

      // All benefics must be in kendras
      for (const pid of benefics) {
        if (!kendras.has(ctx.planetHouse(pid))) {
          return { present: false, strength: 'Weak', involvedPlanets: [] };
        }
      }

      // All malefics must be in 3/6/11
      for (const pid of malefics) {
        if (!upachaya3611.has(ctx.planetHouse(pid))) {
          return { present: false, strength: 'Weak', involvedPlanets: [] };
        }
      }

      return {
        present: true,
        involvedPlanets: allSevenPlanets(),
      };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 2,

  formationRule: {
    en: 'All natural benefics (Moon, Mercury, Jupiter, Venus) in kendras (1/4/7/10), and all natural malefics (Sun, Mars, Saturn) in houses 3/6/11.',
    hi: 'सभी प्राकृतिक शुभ ग्रह (चन्द्र, बुध, गुरु, शुक्र) केन्द्रों (1/4/7/10) में, और सभी प्राकृतिक पाप ग्रह (सूर्य, मंगल, शनि) 3/6/11 भावों में।',
  },

  description: {
    en: 'Mala Yoga — the "garland" of ideal planetary distribution — places benefics in the strongest positions (kendras) while malefics serve in upachaya houses where they do well. This is the classical ideal: protection at the angles, growth through challenges. The native enjoys wealth, vehicles, comforts, and a sterling reputation.',
    hi: 'माल योग — आदर्श ग्रह वितरण की "माला" — शुभ ग्रहों को सबसे मजबूत स्थिति (केन्द्र) में और पाप ग्रहों को उपचय भावों में रखता है। जातक धन, वाहन, सुख और उत्तम प्रतिष्ठा का आनंद लेता है।',
  },
};

/**
 * Sarpa Yoga — Phaladeepika Ch.7
 *
 * Formation: All natural malefics (Sun, Mars, Saturn) in kendras (1/4/7/10),
 * AND all natural benefics (Moon, Mercury, Jupiter, Venus) in houses 3/6/11.
 *
 * Results: Inauspicious. The opposite of Mala — malefics dominate the angles
 * while benefics are relegated to secondary houses. The native is miserable,
 * cruel, and suffers from poverty and poor relationships.
 */
const SARPA: YogaRule = {
  id: 'nabhasa-sarpa',
  name: { en: 'Sarpa', hi: 'सर्प', sa: 'सर्पम्' },
  group: 'nabhasa',
  subGroup: 'dala',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      // Natural malefics: Sun(0), Mars(2), Saturn(6)
      const malefics = [0, 2, 6];
      // Natural benefics: Moon(1), Mercury(3), Jupiter(4), Venus(5)
      const benefics = [1, 3, 4, 5];

      const kendras = new Set([1, 4, 7, 10]);
      const upachaya3611 = new Set([3, 6, 11]);

      // All malefics must be in kendras
      for (const pid of malefics) {
        if (!kendras.has(ctx.planetHouse(pid))) {
          return { present: false, strength: 'Weak', involvedPlanets: [] };
        }
      }

      // All benefics must be in 3/6/11
      for (const pid of benefics) {
        if (!upachaya3611.has(ctx.planetHouse(pid))) {
          return { present: false, strength: 'Weak', involvedPlanets: [] };
        }
      }

      return {
        present: true,
        involvedPlanets: allSevenPlanets(),
      };
    },
  },

  assessStrength: () => 'Strong', // If present, always strong (severe affliction)

  affectedDomains: 'all',
  domainImpactWeight: 2,

  formationRule: {
    en: 'All natural malefics (Sun, Mars, Saturn) in kendras (1/4/7/10), and all natural benefics (Moon, Mercury, Jupiter, Venus) in houses 3/6/11.',
    hi: 'सभी प्राकृतिक पाप ग्रह (सूर्य, मंगल, शनि) केन्द्रों (1/4/7/10) में, और सभी प्राकृतिक शुभ ग्रह (चन्द्र, बुध, गुरु, शुक्र) 3/6/11 भावों में।',
  },

  description: {
    en: 'Sarpa Yoga — the "serpent" — is the inverse of Mala: malefics control the angles while benefics are pushed to secondary positions. The native faces hardship, cruelty in relationships, and a life marked by struggle. The malefic dominance at the chart\'s core creates an environment of conflict and suffering.',
    hi: 'सर्प योग — "सर्प" — माल का विपरीत है: पाप ग्रह कोणों को नियंत्रित करते हैं जबकि शुभ ग्रह गौण स्थिति में होते हैं। जातक कठिनाई, संबंधों में क्रूरता और संघर्षपूर्ण जीवन का सामना करता है।',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// Additional AKRITI (Shape) rules
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Gada Yoga — Phaladeepika Ch.7
 *
 * Formation: All planets in two separate pairs of consecutive houses
 * (e.g. houses 2-3 and 8-9). The two pairs are non-adjacent.
 *
 * Results: Mixed. The native alternates between two distinct phases or
 * pursuits in life, like a mace (gada) with weight at both ends.
 *
 * Implementation: Check if the occupied house set forms exactly two disjoint
 * consecutive pairs across the chart.
 */
const GADA: YogaRule = {
  id: 'nabhasa-gada',
  name: { en: 'Gada', hi: 'गदा', sa: 'गदा' },
  group: 'nabhasa',
  subGroup: 'akriti',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const occupied = getOccupiedHouses(ctx);
      // Must be exactly 4 houses occupied
      if (occupied.size !== 4) {
        return { present: false, strength: 'Weak', involvedPlanets: [] };
      }

      const houses = Array.from(occupied).sort((a, b) => a - b);

      // Check all ways to partition 4 houses into 2 consecutive pairs
      // A "consecutive pair" is two houses where second = first + 1 (mod 12)
      for (let i = 0; i < houses.length; i++) {
        for (let j = i + 1; j < houses.length; j++) {
          const pair1 = [houses[i], houses[j]];
          const pair2 = houses.filter(h => !pair1.includes(h));

          const isPair1Consecutive =
            ((pair1[1] - pair1[0] + 12) % 12) === 1 ||
            ((pair1[0] - pair1[1] + 12) % 12) === 1;
          const isPair2Consecutive =
            pair2.length === 2 && (
              ((pair2[1] - pair2[0] + 12) % 12) === 1 ||
              ((pair2[0] - pair2[1] + 12) % 12) === 1
            );

          // Ensure the two pairs are NOT adjacent to each other
          if (isPair1Consecutive && isPair2Consecutive) {
            const allInPairs = new Set([...pair1, ...pair2]);
            // Check that pairs are disjoint (non-overlapping consecutive runs)
            // i.e. not all 4 houses consecutive
            let allFourConsecutive = false;
            for (let start = 0; start < 12; start++) {
              let runOk = true;
              for (let k = 0; k < 4; k++) {
                if (!allInPairs.has(((start + k) % 12) + 1)) { runOk = false; break; }
              }
              if (runOk) { allFourConsecutive = true; break; }
            }

            if (!allFourConsecutive) {
              return {
                present: true,
                involvedPlanets: allSevenPlanets(),
                customData: { pair1, pair2 },
              };
            }
          }
        }
      }

      return { present: false, strength: 'Weak', involvedPlanets: [] };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: 'all',
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) in two separate pairs of consecutive houses, with a gap between the pairs.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) दो अलग-अलग क्रमागत भावों के जोड़ों में, जोड़ों के बीच अंतर के साथ।',
  },

  description: {
    en: 'Gada Yoga — the "mace" — distributes all planets into two separate consecutive-house pairs with a gap between them. Like a mace with weight at both ends, the native\'s life energy concentrates in two distinct areas, leaving the rest unsupported. Life alternates between two dominant themes with little middle ground.',
    hi: 'गदा योग — "गदा" — सभी ग्रहों को दो अलग-अलग क्रमागत-भाव जोड़ों में वितरित करता है। गदा की तरह दोनों सिरों पर भार, जातक की जीवन ऊर्जा दो अलग-अलग क्षेत्रों में केंद्रित होती है।',
  },
};

/**
 * Shayana Yoga — Phaladeepika Ch.7
 *
 * Formation: All planets (Sun through Saturn) in the 4th and 10th houses only.
 *
 * Results: The native is lazy, idle, and enjoys comforts without effort.
 * The kendra axis of home (4th) and career (10th) dominates, but in
 * a passive, reclining manner — hence "shayana" (reclining/sleeping).
 */
const SHAYANA: YogaRule = {
  id: 'nabhasa-shayana',
  name: { en: 'Shayana', hi: 'शयन', sa: 'शयनम्' },
  group: 'nabhasa',
  subGroup: 'akriti',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const allowedHouses = new Set([4, 10]);
      const present = allPlanetsInHouses(ctx, allowedHouses);
      return {
        present,
        involvedPlanets: present ? allSevenPlanets() : [],
      };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: ['career'],
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy only the 4th and 10th houses.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) केवल चौथे और दसवें भाव में स्थित हैं।',
  },

  description: {
    en: 'Shayana Yoga — the "reclining" pattern — places all planets on the 4-10 kendra axis. The native tends towards laziness and passive comfort. While home life and career are strongly emphasised, the energy is expressed in a languid, effortless manner. Success may come through inherited wealth or positions of comfort rather than active effort.',
    hi: 'शयन योग — "लेटने" का पैटर्न — सभी ग्रहों को 4-10 केन्द्र अक्ष पर रखता है। जातक आलस्य और निष्क्रिय आराम की ओर प्रवृत्त होता है। विरासत या आरामदायक पदों से सफलता मिल सकती है।',
  },
};

/**
 * Chaamara (Nabhasa) Yoga — Phaladeepika Ch.7
 *
 * Formation: All planets (Sun through Saturn) in the 1st and 7th houses only.
 * Note: Different from the Raja Yoga "Chamara" (which involves specific
 * lord connections). This is the Nabhasa Akriti pattern.
 *
 * Results: The native is learned, eloquent, and long-lived. The self-other
 * axis (1st/7th) dominates, producing someone deeply engaged in
 * partnerships and public life.
 */
const CHAAMARA_NABHASA: YogaRule = {
  id: 'nabhasa-chaamara',
  name: { en: 'Chaamara (Nabhasa)', hi: 'चामर (नभस)', sa: 'चामरम्' },
  group: 'nabhasa',
  subGroup: 'akriti',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7',

  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext) => {
      const allowedHouses = new Set([1, 7]);
      const present = allPlanetsInHouses(ctx, allowedHouses);
      return {
        present,
        involvedPlanets: present ? allSevenPlanets() : [],
      };
    },
  },

  assessStrength: assessNabhasaStrength,

  affectedDomains: ['career'],
  domainImpactWeight: 1,

  formationRule: {
    en: 'All 7 planets (Sun through Saturn) occupy only the 1st and 7th houses.',
    hi: 'सभी 7 ग्रह (सूर्य से शनि) केवल पहले और सातवें भाव में स्थित हैं।',
  },

  description: {
    en: 'Chaamara (Nabhasa) Yoga — the "flywhisk" — places all planets on the 1-7 axis of self and partnership. Unlike the Nabhasa Shakata (which shares the same axis but is inauspicious), Chaamara emphasises royalty and learning. The native is eloquent, scholarly, and commands respect in public life. Partnerships and alliances are central to their identity.',
    hi: 'चामर (नभस) योग — "चंवर" — सभी ग्रहों को स्वयं और साझेदारी के 1-7 अक्ष पर रखता है। जातक वाक्पटु, विद्वान और सार्वजनिक जीवन में सम्मानित होता है। साझेदारी और गठबंधन उनकी पहचान के केंद्र में होते हैं।',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADDITIONAL AKRITI (Shape) Sub-group — Classical missing types
// ═══════════════════════════════════════════════════════════════════════════════

/** Natural benefics: Jupiter (4), Venus (5), Mercury (3), Moon (1) — waxing Moon only, simplified to always */
const NATURAL_BENEFICS = new Set([1, 3, 4, 5]);
/**
 * Natural malefics: Sun (0), Mars (2), Saturn (6), Rahu (7), Ketu (8).
 * Round 2 COMP-4 — Sprint 13 aligned `MALEFICS = [0, 2, 6, 7, 8]` across
 * the engine (see yogas-complete.ts); this file was missed in that
 * cluster. Nabhasa-shape detection (Yupa, Shara, Shakti, Danda) needs
 * the full malefic set so node-only formations aren't mis-classified
 * as benefic-shapes.
 */
const NATURAL_MALEFICS = new Set([0, 2, 6, 7, 8]);

/**
 * Yupa Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets (Sun-Saturn) in 4 consecutive houses starting from a kendra (1/4/7/10).
 * Named after the Vedic sacrificial post — signifies ritual purity and dharmic life.
 *
 * Results: Auspicious. The native is devoted to spiritual practices, charitable,
 * learned in Vedic sciences, and respected for moral conduct.
 */
const YUPA: YogaRule = {
  id: 'nabhasa-yupa',
  name: { en: 'Yupa', hi: 'यूप', sa: 'यूपः' },
  group: 'nabhasa',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7 v.14',
  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext): YogaDetectionResult => {
      const occupied = getOccupiedHouses(ctx);
      // Must start from a kendra: 1, 4, 7, or 10
      for (const start of [1, 4, 7, 10]) {
        const allowed = new Set([start, ((start) % 12) + 1, ((start + 1) % 12) + 1, ((start + 2) % 12) + 1]);
        if (allPlanetsInHouses(ctx, allowed) && occupied.size <= 4) {
          return { present: true, strength: 'Moderate', involvedPlanets: allSevenPlanets() };
        }
      }
      return { present: false, strength: 'Weak', involvedPlanets: [] };
    },
  },
  assessStrength: assessNabhasaStrength,
  affectedDomains: ['spiritual'],
  domainImpactWeight: 2,
  formationRule: { en: 'All 7 planets in 4 consecutive houses starting from a kendra (1/4/7/10)', hi: 'सभी 7 ग्रह एक केन्द्र (1/4/7/10) से 4 लगातार भावों में' },
  description: {
    en: 'Yupa Yoga — "sacrificial post" — all planets concentrated in 4 houses from a kendra. The native is devoted to spiritual practices, charitable, learned in Vedic sciences, and respected for moral conduct.',
    hi: 'यूप योग — "यज्ञ स्तंभ" — सभी ग्रह एक केन्द्र से 4 भावों में। जातक आध्यात्मिक साधनाओं में लीन, दानशील, वैदिक विद्याओं में पारंगत और नैतिक आचरण के लिए सम्मानित होता है।',
  },
};

/**
 * Ishu (Shara) Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets in 4 consecutive houses starting from a panapara (2/5/8/11).
 * Named after an arrow — indicates sharp focus and directedness.
 *
 * Results: Mixed. The native is connected with arms, prisons, or guard work;
 * may be a jailer, soldier, or someone who enforces order.
 */
const ISHU: YogaRule = {
  id: 'nabhasa-ishu',
  name: { en: 'Ishu (Shara)', hi: 'इषु (शर)', sa: 'इषुः' },
  group: 'nabhasa',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.7 v.14',
  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext): YogaDetectionResult => {
      const occupied = getOccupiedHouses(ctx);
      for (const start of [2, 5, 8, 11]) {
        const allowed = new Set([start, (start % 12) + 1, ((start + 1) % 12) + 1, ((start + 2) % 12) + 1]);
        if (allPlanetsInHouses(ctx, allowed) && occupied.size <= 4) {
          return { present: true, strength: 'Moderate', involvedPlanets: allSevenPlanets() };
        }
      }
      return { present: false, strength: 'Weak', involvedPlanets: [] };
    },
  },
  assessStrength: assessNabhasaStrength,
  affectedDomains: ['career'],
  domainImpactWeight: 1,
  formationRule: { en: 'All 7 planets in 4 consecutive houses starting from a panapara (2/5/8/11)', hi: 'सभी 7 ग्रह एक पणफर (2/5/8/11) से 4 लगातार भावों में' },
  description: {
    en: 'Ishu (Shara) Yoga — "arrow" — all planets in 4 houses starting from a succedent house. The native may work in enforcement, security, or discipline-oriented fields. Sharp and focused personality.',
    hi: 'इषु (शर) योग — "बाण" — सभी ग्रह एक पणफर भाव से 4 भावों में। जातक सुरक्षा, अनुशासन या प्रवर्तन क्षेत्र में कार्य कर सकता है। तीक्ष्ण और केन्द्रित व्यक्तित्व।',
  },
};

/**
 * Shakti Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets in 4 consecutive houses starting from an apoklima (3/6/9/12).
 * Named after power/energy — indicates latent strength.
 *
 * Results: Mixed-negative. The native may be lazy, poor, devoid of enterprise,
 * defeated in battles. The apoklima start weakens the concentration of energy.
 */
const SHAKTI: YogaRule = {
  id: 'nabhasa-shakti',
  name: { en: 'Shakti', hi: 'शक्ति', sa: 'शक्तिः' },
  group: 'nabhasa',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.7 v.14',
  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext): YogaDetectionResult => {
      const occupied = getOccupiedHouses(ctx);
      for (const start of [3, 6, 9, 12]) {
        const allowed = new Set([start, (start % 12) + 1, ((start + 1) % 12) + 1, ((start + 2) % 12) + 1]);
        if (allPlanetsInHouses(ctx, allowed) && occupied.size <= 4) {
          return { present: true, strength: 'Moderate', involvedPlanets: allSevenPlanets() };
        }
      }
      return { present: false, strength: 'Weak', involvedPlanets: [] };
    },
  },
  assessStrength: assessNabhasaStrength,
  affectedDomains: ['career', 'wealth'],
  domainImpactWeight: 1,
  formationRule: { en: 'All 7 planets in 4 consecutive houses starting from an apoklima (3/6/9/12)', hi: 'सभी 7 ग्रह एक अपोक्लिम (3/6/9/12) से 4 लगातार भावों में' },
  description: {
    en: 'Shakti Yoga — "power" — all planets in 4 houses from a cadent position. Despite the name, this concentrates energy in weak houses, leading to unfulfilled potential and lack of enterprise.',
    hi: 'शक्ति योग — "शक्ति" — सभी ग्रह एक अपोक्लिम भाव से 4 भावों में। नाम के बावजूद, यह ऊर्जा को दुर्बल भावों में केन्द्रित करता है, जिससे अपूर्ण क्षमता और उद्यम की कमी होती है।',
  },
};

/**
 * Danda Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets in 4 consecutive houses starting from any house.
 * The generic version of Yupa/Ishu/Shakti — if the start isn't kendra/panapara/apoklima
 * specifically, or as a catch-all when all 7 are in a 4-house band.
 *
 * Results: Mixed. Depends on which houses are involved. Generally indicates
 * loss of children, poverty, and servile existence per Phaladeepika.
 */
const DANDA: YogaRule = {
  id: 'nabhasa-danda',
  name: { en: 'Danda', hi: 'दण्ड', sa: 'दण्डः' },
  group: 'nabhasa',
  isAuspicious: false,
  classicalRef: 'Phaladeepika Ch.7 v.14',
  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext): YogaDetectionResult => {
      const occupied = getOccupiedHouses(ctx);
      if (occupied.size > 4) return { present: false, strength: 'Weak', involvedPlanets: [] };
      // Check any 4 consecutive houses
      for (let start = 1; start <= 12; start++) {
        const allowed = new Set([start, (start % 12) + 1, ((start + 1) % 12) + 1, ((start + 2) % 12) + 1]);
        if (allPlanetsInHouses(ctx, allowed)) {
          // Skip if it's one of the specific subtypes (Yupa/Ishu/Shakti)
          const kendras = new Set([1, 4, 7, 10]);
          const panaparas = new Set([2, 5, 8, 11]);
          const apoklimas = new Set([3, 6, 9, 12]);
          if (kendras.has(start) || panaparas.has(start) || apoklimas.has(start)) continue;
          return { present: true, strength: 'Moderate', involvedPlanets: allSevenPlanets() };
        }
      }
      return { present: false, strength: 'Weak', involvedPlanets: [] };
    },
  },
  assessStrength: assessNabhasaStrength,
  affectedDomains: ['career', 'children'],
  domainImpactWeight: 1,
  formationRule: { en: 'All 7 planets in 4 consecutive houses (generic)', hi: 'सभी 7 ग्रह 4 लगातार भावों में (सामान्य)' },
  description: {
    en: 'Danda Yoga — "staff" — planets concentrated in a 4-house band. Indicates a constrained life with limited breadth of experience.',
    hi: 'दण्ड योग — "डंडा" — ग्रह 4 भावों में केन्द्रित। सीमित अनुभव विस्तार के साथ एक बाधित जीवन इंगित करता है।',
  },
};

/**
 * Vajra Yoga — Phaladeepika Ch.7
 *
 * Formation: Benefics in 1st and 7th houses, malefics in 4th and 10th houses
 * (or vice versa). Diamond-shaped pattern across the kendra axis.
 *
 * Results: Auspicious in the first form (benefics on lagna-7th axis).
 * The native is handsome, happy in the beginning and end of life, but may
 * face difficulties in middle age.
 */
const VAJRA: YogaRule = {
  id: 'nabhasa-vajra',
  name: { en: 'Vajra', hi: 'वज्र', sa: 'वज्रम्' },
  group: 'nabhasa',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7 v.17',
  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext): YogaDetectionResult => {
      // Check if benefics occupy 1st/7th AND malefics occupy 4th/10th
      const h1 = ctx.planetsInHouse(1).filter(p => p <= 6);
      const h7 = ctx.planetsInHouse(7).filter(p => p <= 6);
      const h4 = ctx.planetsInHouse(4).filter(p => p <= 6);
      const h10 = ctx.planetsInHouse(10).filter(p => p <= 6);

      const beneficsIn1_7 = [...h1, ...h7].some(p => NATURAL_BENEFICS.has(p));
      const maleficsIn4_10 = [...h4, ...h10].some(p => NATURAL_MALEFICS.has(p));
      const noBeneficsIn4_10 = ![...h4, ...h10].some(p => NATURAL_BENEFICS.has(p));
      const noMaleficsIn1_7 = ![...h1, ...h7].some(p => NATURAL_MALEFICS.has(p));

      if (beneficsIn1_7 && maleficsIn4_10 && noBeneficsIn4_10 && noMaleficsIn1_7) {
        const involved = [...h1, ...h7, ...h4, ...h10];
        return { present: true, strength: 'Moderate', involvedPlanets: involved };
      }
      return { present: false, strength: 'Weak', involvedPlanets: [] };
    },
  },
  assessStrength: assessNabhasaStrength,
  affectedDomains: ['career', 'marriage'],
  domainImpactWeight: 2,
  formationRule: { en: 'Benefics in 1st/7th houses, malefics in 4th/10th houses', hi: 'शुभ ग्रह 1/7 भावों में, पाप ग्रह 4/10 भावों में' },
  description: {
    en: 'Vajra Yoga — "thunderbolt" — benefics across the lagna-7th axis, malefics on the 4th-10th axis. The native is happy in early and later life but may face adversity in the middle years.',
    hi: 'वज्र योग — "वज्र" — शुभ ग्रह लग्न-7 अक्ष पर, पाप ग्रह 4-10 अक्ष पर। जातक प्रारंभिक और बाद के जीवन में सुखी, मध्य काल में कठिनाई संभव।',
  },
};

/**
 * Yava Yoga — Phaladeepika Ch.7
 *
 * Formation: Benefics in 4th and 10th houses, malefics in 1st and 7th houses.
 * The inverse of Vajra — barley-grain shaped.
 *
 * Results: Mixed. The native faces difficulties in early and later life
 * but enjoys prosperity during middle age.
 */
const YAVA: YogaRule = {
  id: 'nabhasa-yava',
  name: { en: 'Yava', hi: 'यव', sa: 'यवः' },
  group: 'nabhasa',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7 v.17',
  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext): YogaDetectionResult => {
      const h1 = ctx.planetsInHouse(1).filter(p => p <= 6);
      const h7 = ctx.planetsInHouse(7).filter(p => p <= 6);
      const h4 = ctx.planetsInHouse(4).filter(p => p <= 6);
      const h10 = ctx.planetsInHouse(10).filter(p => p <= 6);

      const beneficsIn4_10 = [...h4, ...h10].some(p => NATURAL_BENEFICS.has(p));
      const maleficsIn1_7 = [...h1, ...h7].some(p => NATURAL_MALEFICS.has(p));
      const noBeneficsIn1_7 = ![...h1, ...h7].some(p => NATURAL_BENEFICS.has(p));
      const noMaleficsIn4_10 = ![...h4, ...h10].some(p => NATURAL_MALEFICS.has(p));

      if (beneficsIn4_10 && maleficsIn1_7 && noBeneficsIn1_7 && noMaleficsIn4_10) {
        const involved = [...h1, ...h7, ...h4, ...h10];
        return { present: true, strength: 'Moderate', involvedPlanets: involved };
      }
      return { present: false, strength: 'Weak', involvedPlanets: [] };
    },
  },
  assessStrength: assessNabhasaStrength,
  affectedDomains: ['career', 'wealth'],
  domainImpactWeight: 1,
  formationRule: { en: 'Benefics in 4th/10th houses, malefics in 1st/7th houses', hi: 'शुभ ग्रह 4/10 भावों में, पाप ग्रह 1/7 भावों में' },
  description: {
    en: 'Yava Yoga — "barley grain" — inverse of Vajra. Benefics at the 4th-10th axis, malefics at 1st-7th. The native faces difficulties in youth and old age but prospers in middle life.',
    hi: 'यव योग — "जौ" — वज्र का विपरीत। शुभ ग्रह 4-10 अक्ष पर, पाप ग्रह 1-7 पर। जातक को युवावस्था और वृद्धावस्था में कठिनाई, मध्य जीवन में समृद्धि।',
  },
};

/**
 * Kamala (Padma) Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets in the 4 kendras (houses 1, 4, 7, 10) only.
 * Named after the lotus — a rare and highly auspicious pattern.
 *
 * Results: Very auspicious. The native is virtuous, performs many meritorious deeds,
 * enjoys lasting fame, is learned and wealthy.
 */
const KAMALA: YogaRule = {
  id: 'nabhasa-kamala',
  name: { en: 'Kamala', hi: 'कमल', sa: 'कमलम्' },
  group: 'nabhasa',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7 v.18',
  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext): YogaDetectionResult => {
      const kendras = new Set([1, 4, 7, 10]);
      if (allPlanetsInHouses(ctx, kendras)) {
        return { present: true, strength: 'Moderate', involvedPlanets: allSevenPlanets() };
      }
      return { present: false, strength: 'Weak', involvedPlanets: [] };
    },
  },
  assessStrength: assessNabhasaStrength,
  affectedDomains: ['career', 'wealth', 'spiritual'],
  domainImpactWeight: 3,
  formationRule: { en: 'All 7 planets in the 4 kendras (houses 1/4/7/10)', hi: 'सभी 7 ग्रह 4 केन्द्रों (1/4/7/10 भावों) में' },
  description: {
    en: 'Kamala (Padma) Yoga — "lotus" — all planets in kendras. Extremely rare and highly auspicious. The native is virtuous, famous, learned, wealthy, and performs many meritorious deeds.',
    hi: 'कमल (पद्म) योग — "कमल" — सभी ग्रह केन्द्रों में। अत्यंत दुर्लभ और अत्यधिक शुभ। जातक गुणवान, प्रसिद्ध, विद्वान, धनी और अनेक पुण्य कर्म करता है।',
  },
};

/**
 * Vaapi Yoga — Phaladeepika Ch.7
 *
 * Formation: All 7 planets in panaparas (2/5/8/11) only OR in apoklimas (3/6/9/12) only.
 * Named after a step-well — signifies accumulation.
 *
 * Results: Mixed-positive. The native accumulates wealth gradually, is happy,
 * enjoys material comforts, but in a measured, step-by-step manner.
 */
const VAAPI: YogaRule = {
  id: 'nabhasa-vaapi',
  name: { en: 'Vaapi', hi: 'वापी', sa: 'वापी' },
  group: 'nabhasa',
  isAuspicious: true,
  classicalRef: 'Phaladeepika Ch.7 v.18',
  conditions: {
    type: 'custom',
    detect: (ctx: YogaContext): YogaDetectionResult => {
      const panaparas = new Set([2, 5, 8, 11]);
      const apoklimas = new Set([3, 6, 9, 12]);
      if (allPlanetsInHouses(ctx, panaparas) || allPlanetsInHouses(ctx, apoklimas)) {
        return { present: true, strength: 'Moderate', involvedPlanets: allSevenPlanets() };
      }
      return { present: false, strength: 'Weak', involvedPlanets: [] };
    },
  },
  assessStrength: assessNabhasaStrength,
  affectedDomains: ['wealth'],
  domainImpactWeight: 2,
  formationRule: { en: 'All 7 planets in panaparas (2/5/8/11) or apoklimas (3/6/9/12)', hi: 'सभी 7 ग्रह पणफर (2/5/8/11) या अपोक्लिम (3/6/9/12) में' },
  description: {
    en: 'Vaapi Yoga — "step-well" — all planets in succedent or cadent houses. The native accumulates wealth gradually, enjoys comforts in a measured way, and builds prosperity step by step.',
    hi: 'वापी योग — "बावड़ी" — सभी ग्रह पणफर या अपोक्लिम भावों में। जातक धीरे-धीरे धन संचय करता है, क्रमबद्ध तरीके से सुखों का आनंद लेता है।',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

/** All 31 Nabhasa yoga rules — Phaladeepika Ch.7 (4 sub-groups) */
export const NABHASA_RULES: YogaRule[] = [
  // Sankhya (Number) — mutually exclusive
  GOLA,
  YUGA,
  SHOOLA,
  KEDARA,
  PASHA,
  DAMINI,
  VEENA,
  // Akriti (Shape)
  // GRAHA_MALIKA removed — use the more detailed version in malika.ts instead
  ARDHA_CHANDRA,
  NAUKA,
  KOOTA,
  CHHATRA,
  DHANUSH,
  SHAKATA_NABHASA,
  SHRINGATAKA,
  HALA,
  GADA,
  SHAYANA,
  CHAAMARA_NABHASA,
  // Additional Akriti (Phaladeepika Ch.7)
  YUPA,
  ISHU,
  SHAKTI,
  DANDA,
  VAJRA,
  YAVA,
  KAMALA,
  VAAPI,
  // Aashray (Sign quality)
  RAJJU,
  MUSALA,
  NALA,
  // Dala (Kendra pattern)
  MALA,
  SARPA,
];
