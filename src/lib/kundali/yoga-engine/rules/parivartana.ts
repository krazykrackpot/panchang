/**
 * Parivartana (Exchange) Yoga Rules
 *
 * Parivartana Yogas form when two house lords exchange signs — lord of house A
 * is in the sign of house B AND lord of house B is in the sign of house A.
 *
 * Three types per BPHS:
 * 1. Maha Parivartana — exchange between kendra (1/4/7/10) and trikona (1/5/9) lords
 * 2. Dainya Parivartana — exchange involving at least one dusthana (6/8/12) lord
 * 3. Khala Parivartana — exchange involving the 3rd lord with a non-dusthana lord
 *
 * Sources: BPHS Ch.34-35, Phaladeepika Ch.6, Jataka Parijata
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
 * House IDs:  1-12 (1-based, 1=ascendant)
 */

import type { YogaRule, YogaContext, YogaDetectionResult, DomainType } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const KENDRA_HOUSES = [1, 4, 7, 10];
const TRIKONA_HOUSES = [1, 5, 9];
const DUSTHANA_HOUSES = [6, 8, 12];

/**
 * House meanings for dynamic description generation.
 * Each house pair exchange produces a unique interpretation.
 */
const HOUSE_MEANINGS: Record<number, { en: string; hi: string }> = {
  1:  { en: 'self/body', hi: 'आत्म/शरीर' },
  2:  { en: 'wealth/speech', hi: 'धन/वाणी' },
  3:  { en: 'courage/siblings', hi: 'साहस/भाई-बहन' },
  4:  { en: 'mother/home', hi: 'माता/गृह' },
  5:  { en: 'children/intelligence', hi: 'संतान/बुद्धि' },
  6:  { en: 'enemies/disease', hi: 'शत्रु/रोग' },
  7:  { en: 'marriage/partnerships', hi: 'विवाह/साझेदारी' },
  8:  { en: 'transformation/longevity', hi: 'परिवर्तन/आयु' },
  9:  { en: 'father/dharma', hi: 'पिता/धर्म' },
  10: { en: 'career/status', hi: 'करियर/प्रतिष्ठा' },
  11: { en: 'gains/aspirations', hi: 'लाभ/आकांक्षा' },
  12: { en: 'losses/moksha', hi: 'हानि/मोक्ष' },
};

/**
 * Map house numbers to their primary domain impact.
 * Used for dynamic affectedDomains assignment.
 */
const HOUSE_DOMAIN_MAP: Record<number, DomainType[]> = {
  1:  ['health'],
  2:  ['wealth'],
  3:  ['career'],
  4:  ['family', 'education'],
  5:  ['children', 'education'],
  6:  ['health'],
  7:  ['marriage'],
  8:  ['health', 'spiritual'],
  9:  ['spiritual', 'career'],
  10: ['career'],
  11: ['wealth'],
  12: ['spiritual'],
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if two house lords exchange signs.
 * Lord of houseA is in the sign ruling houseB AND lord of houseB is in the sign ruling houseA.
 */
function areExchanging(ctx: YogaContext, houseA: number, houseB: number): boolean {
  if (houseA === houseB) return false;

  const lordA = ctx.houseLord(houseA);
  const lordB = ctx.houseLord(houseB);

  // Same lord rules both houses — no exchange possible
  if (lordA === lordB) return false;

  const lordAHouse = ctx.planetHouse(lordA);
  const lordBHouse = ctx.planetHouse(lordB);

  // Lord of A in house B AND lord of B in house A
  return lordAHouse === houseB && lordBHouse === houseA;
}

/**
 * Merge domains from two houses, deduplicating.
 */
function mergedDomains(houseA: number, houseB: number): DomainType[] {
  const a = HOUSE_DOMAIN_MAP[houseA] ?? [];
  const b = HOUSE_DOMAIN_MAP[houseB] ?? [];
  return [...new Set([...a, ...b])];
}

/**
 * Standard strength assessment for parivartana yogas based on planet dignity.
 */
function parivartanaStrength(ctx: YogaContext, result: YogaDetectionResult): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let strongFactors = 0;
  let weakFactors = 0;

  for (const pid of planets) {
    const house = ctx.planetHouse(pid);
    const dignity = ctx.dignity(pid);

    // In exchange, planets are in each other's signs — so "own" dignity is common.
    // Look for additional strengthening factors.
    if (dignity === 'exalted' || dignity === 'moolatrikona') strongFactors += 2;
    if (dignity === 'own') strongFactors++;
    if (ctx.isKendra(house)) strongFactors++;
    if (ctx.isTrikona(house)) strongFactors++;

    if (dignity === 'debilitated') weakFactors += 2;
    if (ctx.isCombust(pid)) weakFactors++;
    if (ctx.isDusthana(house)) weakFactors++;
  }

  // Multiple exchanges amplify
  const data = result.customData as { exchanges?: unknown[] } | undefined;
  const exchangeCount = data?.exchanges?.length ?? 0;
  if (exchangeCount >= 2) strongFactors += 2;

  if (strongFactors >= 4 && weakFactors === 0) return 'Strong';
  if (weakFactors >= 3) return 'Weak';
  return 'Moderate';
}

// ─────────────────────────────────────────────────────────────────────────────
// Parivartana Yoga Rules
// ─────────────────────────────────────────────────────────────────────────────

export const PARIVARTANA_RULES: YogaRule[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Maha Parivartana Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Maha Parivartana Yoga
   *
   * The most auspicious exchange — lords of kendras (1/4/7/10) and
   * trikonas (1/5/9) exchanging signs. Combines the power of angular
   * houses with the fortune of trinal houses.
   *
   * Source: BPHS Ch.34 v.17-18
   */
  {
    id: 'maha-parivartana',
    name: { en: 'Maha Parivartana Yoga', hi: 'महा परिवर्तन योग', sa: 'महापरिवर्तनयोगः' },
    group: 'parivartana',
    isAuspicious: true,
    classicalRef: 'BPHS Ch.34 v.17-18',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const exchanges: Array<{
          houseA: number;
          houseB: number;
          lordA: number;
          lordB: number;
        }> = [];
        const involvedPlanets: number[] = [];

        // Check all kendra-trikona pairs for exchanges
        // House 1 is both kendra and trikona but we include it in both lists
        const kendraTrikonaPairs = new Set<string>();

        for (const kh of KENDRA_HOUSES) {
          for (const th of TRIKONA_HOUSES) {
            if (kh === th) continue; // Skip same house (house 1)
            const key = [Math.min(kh, th), Math.max(kh, th)].join('-');
            if (kendraTrikonaPairs.has(key)) continue;
            kendraTrikonaPairs.add(key);

            if (areExchanging(ctx, kh, th)) {
              const lordA = ctx.houseLord(kh);
              const lordB = ctx.houseLord(th);
              exchanges.push({ houseA: kh, houseB: th, lordA, lordB });
              involvedPlanets.push(lordA, lordB);
            }
          }
        }

        // Also check kendra-kendra exchanges (both are kendras)
        for (let i = 0; i < KENDRA_HOUSES.length; i++) {
          for (let j = i + 1; j < KENDRA_HOUSES.length; j++) {
            const hA = KENDRA_HOUSES[i];
            const hB = KENDRA_HOUSES[j];
            if (areExchanging(ctx, hA, hB)) {
              const lordA = ctx.houseLord(hA);
              const lordB = ctx.houseLord(hB);
              exchanges.push({ houseA: hA, houseB: hB, lordA, lordB });
              involvedPlanets.push(lordA, lordB);
            }
          }
        }

        // Also check trikona-trikona exchanges
        for (let i = 0; i < TRIKONA_HOUSES.length; i++) {
          for (let j = i + 1; j < TRIKONA_HOUSES.length; j++) {
            const hA = TRIKONA_HOUSES[i];
            const hB = TRIKONA_HOUSES[j];
            if (areExchanging(ctx, hA, hB)) {
              const lordA = ctx.houseLord(hA);
              const lordB = ctx.houseLord(hB);
              exchanges.push({ houseA: hA, houseB: hB, lordA, lordB });
              involvedPlanets.push(lordA, lordB);
            }
          }
        }

        const present = exchanges.length > 0;
        const uniquePlanets = [...new Set(involvedPlanets)];

        // Dynamic domains from the exchanging houses
        const allDomains = exchanges.flatMap((e) => mergedDomains(e.houseA, e.houseB));
        const uniqueDomains = [...new Set(allDomains)];

        return {
          present,
          involvedPlanets: present ? uniquePlanets : [],
          customData: present
            ? {
                exchanges,
                exchangeCount: exchanges.length,
                domains: uniqueDomains,
                // Build a human-readable summary for each exchange
                descriptions: exchanges.map((e) => ({
                  en: `Exchange between ${e.houseA}${ordinalSuffix(e.houseA)} house (${HOUSE_MEANINGS[e.houseA]?.en}) and ${e.houseB}${ordinalSuffix(e.houseB)} house (${HOUSE_MEANINGS[e.houseB]?.en}) — these life areas are deeply interlinked`,
                  hi: `${e.houseA}वें भाव (${HOUSE_MEANINGS[e.houseA]?.hi}) और ${e.houseB}वें भाव (${HOUSE_MEANINGS[e.houseB]?.hi}) के बीच परिवर्तन — ये जीवन क्षेत्र गहराई से जुड़े हैं`,
                })),
              }
            : undefined,
        };
      },
    },

    assessStrength: parivartanaStrength,

    affectedDomains: ['career', 'wealth'], // Overridden dynamically via customData.domains
    domainImpactWeight: 3,

    formationRule: {
      en: 'Lords of kendra (1/4/7/10) and trikona (1/5/9) houses exchange signs — lord of house A is in house B and vice versa',
      hi: 'केन्द्र (1/4/7/10) और त्रिकोण (1/5/9) भावों के स्वामी राशि परिवर्तन करते हैं — भाव A का स्वामी भाव B में और इसके विपरीत',
    },
    description: {
      en: 'Maha Parivartana Yoga is the most beneficial exchange yoga — when lords of power houses (kendras) and fortune houses (trikonas) swap positions, both life areas amplify each other. The native finds that success in one domain naturally feeds into another, creating a virtuous cycle of achievement and good fortune. This is considered equivalent to a strong Raja Yoga.',
      hi: 'महा परिवर्तन योग सबसे लाभकारी परिवर्तन योग है — जब शक्ति भावों (केन्द्र) और भाग्य भावों (त्रिकोण) के स्वामी स्थान बदलते हैं, तो दोनों जीवन क्षेत्र एक-दूसरे को बढ़ाते हैं। जातक पाता है कि एक क्षेत्र में सफलता स्वाभाविक रूप से दूसरे को पोषित करती है।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Dainya Parivartana Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Dainya Parivartana Yoga
   *
   * Exchange involving at least one dusthana lord (6/8/12). Inauspicious —
   * the dusthana energy contaminates the other house. The good house loses
   * its positive significations while the dusthana gains nothing beneficial.
   *
   * Source: BPHS Ch.34 v.19; Phaladeepika Ch.6
   */
  {
    id: 'dainya-parivartana',
    name: { en: 'Dainya Parivartana Yoga', hi: 'दैन्य परिवर्तन योग', sa: 'दैन्यपरिवर्तनयोगः' },
    group: 'parivartana',
    isAuspicious: false,
    classicalRef: 'BPHS Ch.34 v.19; Phaladeepika Ch.6',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const exchanges: Array<{
          houseA: number;
          houseB: number;
          lordA: number;
          lordB: number;
          dusthanaHouse: number;
        }> = [];
        const involvedPlanets: number[] = [];

        // Check all house pairs where at least one is a dusthana
        for (const dh of DUSTHANA_HOUSES) {
          for (let other = 1; other <= 12; other++) {
            if (other === dh) continue;
            // Avoid double-counting when both are dusthanas
            if (DUSTHANA_HOUSES.includes(other) && other < dh) continue;

            if (areExchanging(ctx, dh, other)) {
              const lordA = ctx.houseLord(dh);
              const lordB = ctx.houseLord(other);
              exchanges.push({
                houseA: dh,
                houseB: other,
                lordA,
                lordB,
                dusthanaHouse: dh,
              });
              involvedPlanets.push(lordA, lordB);
            }
          }
        }

        const present = exchanges.length > 0;
        const uniquePlanets = [...new Set(involvedPlanets)];
        const allDomains = exchanges.flatMap((e) => mergedDomains(e.houseA, e.houseB));
        const uniqueDomains = [...new Set(allDomains)];

        return {
          present,
          involvedPlanets: present ? uniquePlanets : [],
          customData: present
            ? {
                exchanges,
                exchangeCount: exchanges.length,
                domains: uniqueDomains,
                descriptions: exchanges.map((e) => ({
                  en: `Exchange between ${e.houseA}${ordinalSuffix(e.houseA)} house (${HOUSE_MEANINGS[e.houseA]?.en}) and ${e.houseB}${ordinalSuffix(e.houseB)} house (${HOUSE_MEANINGS[e.houseB]?.en}) — dusthana energy contaminates the ${DUSTHANA_HOUSES.includes(e.houseA) ? e.houseB : e.houseA}${ordinalSuffix(DUSTHANA_HOUSES.includes(e.houseA) ? e.houseB : e.houseA)} house`,
                  hi: `${e.houseA}वें भाव (${HOUSE_MEANINGS[e.houseA]?.hi}) और ${e.houseB}वें भाव (${HOUSE_MEANINGS[e.houseB]?.hi}) के बीच परिवर्तन — दुष्ट भाव की ऊर्जा ${DUSTHANA_HOUSES.includes(e.houseA) ? e.houseB : e.houseA}वें भाव को दूषित करती है`,
                })),
              }
            : undefined,
        };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      // For dainya, "strong" means the affliction is severe
      const data = result.customData as { exchangeCount?: number } | undefined;
      const count = data?.exchangeCount ?? 0;

      if (count >= 2) return 'Strong'; // Multiple dusthana exchanges = severe
      return parivartanaStrength(ctx, result);
    },

    affectedDomains: ['health'], // Overridden dynamically via customData.domains
    domainImpactWeight: 2,

    formationRule: {
      en: 'Lord of a dusthana (6th/8th/12th) exchanges signs with another house lord — the dusthana energy taints the other house',
      hi: 'दुष्ट भाव (6/8/12) का स्वामी किसी अन्य भाव के स्वामी से राशि परिवर्तन करता है — दुष्ट ऊर्जा दूसरे भाव को दूषित करती है',
    },
    description: {
      en: 'Dainya Parivartana Yoga is an inauspicious exchange where a dusthana lord contaminates a healthier house. The significations of the non-dusthana house suffer — for example, if the 6th lord exchanges with the 2nd lord, wealth (2nd) is drained by enemies, debts, or disease (6th). The native may experience chronic difficulties in the affected area that seem disproportionate to their efforts. Remedial measures through the stronger planet can mitigate the effects.',
      hi: 'दैन्य परिवर्तन योग एक अशुभ परिवर्तन है जहाँ दुष्ट भाव का स्वामी एक स्वस्थ भाव को दूषित करता है। गैर-दुष्ट भाव के फलादेश पीड़ित होते हैं — उदाहरण के लिए, यदि 6ठे का स्वामी 2रे से परिवर्तन करे, तो धन (2रा) शत्रु, ऋण या रोग (6ठा) से क्षीण होता है। जातक को प्रभावित क्षेत्र में दीर्घकालिक कठिनाइयाँ हो सकती हैं।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Khala Parivartana Yoga
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Khala Parivartana Yoga
   *
   * Exchange involving the 3rd house lord with a non-dusthana lord.
   * Mixed results — the 3rd house (courage, efforts, siblings) creates
   * restless energy that can be channelled productively or dispersed.
   *
   * Not as damaging as Dainya, not as beneficial as Maha. The 3rd house
   * is an upachaya (growth house) so results improve over time.
   *
   * Source: BPHS Ch.34; Jataka Parijata
   */
  {
    id: 'khala-parivartana',
    name: { en: 'Khala Parivartana Yoga', hi: 'खल परिवर्तन योग', sa: 'खलपरिवर्तनयोगः' },
    group: 'parivartana',
    isAuspicious: true, // Mixed — set to true as results improve over time
    classicalRef: 'BPHS Ch.34; Jataka Parijata',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const exchanges: Array<{
          houseA: number;
          houseB: number;
          lordA: number;
          lordB: number;
        }> = [];
        const involvedPlanets: number[] = [];

        // 3rd lord exchanges with any non-dusthana lord (also not 3 itself)
        for (let other = 1; other <= 12; other++) {
          if (other === 3) continue;
          if (DUSTHANA_HOUSES.includes(other)) continue; // Dainya handles dusthana exchanges

          if (areExchanging(ctx, 3, other)) {
            const lord3 = ctx.houseLord(3);
            const lordOther = ctx.houseLord(other);
            exchanges.push({ houseA: 3, houseB: other, lordA: lord3, lordB: lordOther });
            involvedPlanets.push(lord3, lordOther);
          }
        }

        const present = exchanges.length > 0;
        const uniquePlanets = [...new Set(involvedPlanets)];

        return {
          present,
          involvedPlanets: present ? uniquePlanets : [],
          customData: present
            ? {
                exchanges,
                exchangeCount: exchanges.length,
                domains: ['career', 'health'] as DomainType[],
                descriptions: exchanges.map((e) => ({
                  en: `Exchange between 3rd house (${HOUSE_MEANINGS[3]?.en}) and ${e.houseB}${ordinalSuffix(e.houseB)} house (${HOUSE_MEANINGS[e.houseB]?.en}) — restless 3rd-house energy channelled through the ${e.houseB}${ordinalSuffix(e.houseB)}`,
                  hi: `3रे भाव (${HOUSE_MEANINGS[3]?.hi}) और ${e.houseB}वें भाव (${HOUSE_MEANINGS[e.houseB]?.hi}) के बीच परिवर्तन — 3रे भाव की अस्थिर ऊर्जा ${e.houseB}वें भाव से प्रवाहित`,
                })),
              }
            : undefined,
        };
      },
    },

    assessStrength: parivartanaStrength,

    affectedDomains: ['career', 'health'],
    domainImpactWeight: 1,

    formationRule: {
      en: '3rd house lord exchanges signs with a non-dusthana house lord — restless energy of courage and effort mixes with the other house',
      hi: '3रे भाव का स्वामी गैर-दुष्ट भाव के स्वामी से राशि परिवर्तन करता है — साहस और प्रयास की अस्थिर ऊर्जा दूसरे भाव से मिलती है',
    },
    description: {
      en: 'Khala Parivartana Yoga produces mixed results. The 3rd house represents courage, initiative, and restless effort — when its lord exchanges with another house, that area of life is infused with constant activity and ambition. The results depend heavily on which house is involved: exchange with the 10th gives relentless career drive, with the 5th gives prolific creative output, with the 2nd gives hustle for wealth. As an upachaya house, the 3rd improves with age — early restlessness matures into productive determination.',
      hi: 'खल परिवर्तन योग मिश्रित परिणाम देता है। 3रा भाव साहस, पहल और अस्थिर प्रयास का प्रतिनिधित्व करता है — जब इसका स्वामी किसी अन्य भाव से परिवर्तन करता है, तो वह जीवन क्षेत्र निरंतर गतिविधि और महत्वाकांक्षा से भर जाता है। उपचय भाव होने से 3रा भाव उम्र के साथ सुधरता है — प्रारम्भिक अस्थिरता उत्पादक दृढ़ता में परिपक्व होती है।',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────

/** Returns English ordinal suffix for a number (1st, 2nd, 3rd, 4th, ...) */
function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
