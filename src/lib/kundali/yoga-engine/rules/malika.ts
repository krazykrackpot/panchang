/**
 * Graha Malika (Garland) & Graha Sanghata Yoga Rules
 *
 * Graha Malika — planets in consecutive houses forming a chain (garland).
 * Named by the starting house. Chain must be >= 3 houses with Sun-Saturn only.
 *
 * Graha Sanghata — all 7 planets (Sun-Saturn) within a 4-house window.
 * A cluster, NOT a Malika (planets need not fill every house in the window).
 *
 * Sources: BPHS Ch.35, Phaladeepika Ch.7, Saravali
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
 * House IDs:  1-12 (1-based, 1=ascendant)
 */

import type { YogaRule, YogaContext, YogaDetectionResult, DomainType } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Sun through Saturn — the 7 classical visible planets used in Malika detection */
const SUN_TO_SATURN = [0, 1, 2, 3, 4, 5, 6];

/**
 * Planet role descriptions for first/last planet interpretation in Malika yogas.
 * First planet = approach to the garland's themes.
 * Last planet = how the themes manifest in the world.
 */
const PLANET_ROLES: Record<number, { en: string; hi: string }> = {
  0: { en: 'authority, self, vitality', hi: 'अधिकार, आत्मा, जीवनशक्ति' },
  1: { en: 'emotions, nurturing, mind', hi: 'भावनाएँ, पोषण, मन' },
  2: { en: 'energy, courage, action', hi: 'ऊर्जा, साहस, कर्म' },
  3: { en: 'intellect, commerce, communication', hi: 'बुद्धि, वाणिज्य, संवाद' },
  4: { en: 'wisdom, expansion, grace', hi: 'ज्ञान, विस्तार, कृपा' },
  5: { en: 'love, beauty, creativity', hi: 'प्रेम, सौंदर्य, रचनात्मकता' },
  6: { en: 'discipline, endurance, karma', hi: 'अनुशासन, धैर्य, कर्मफल' },
};

/** Malika variant metadata indexed by starting house (1-12) */
const MALIKA_VARIANTS: Record<number, {
  name: { en: string; hi: string; sa: string };
  isAuspicious: boolean;
  domains: DomainType[] | 'all';
}> = {
  1:  { name: { en: 'Lagna Malika Yoga', hi: 'लग्न मालिका योग', sa: 'लग्नमालिकायोगः' }, isAuspicious: true, domains: 'all' },
  2:  { name: { en: 'Dhana Malika Yoga', hi: 'धन मालिका योग', sa: 'धनमालिकायोगः' }, isAuspicious: true, domains: ['wealth'] },
  3:  { name: { en: 'Vikrama Malika Yoga', hi: 'विक्रम मालिका योग', sa: 'विक्रममालिकायोगः' }, isAuspicious: true, domains: ['career', 'health'] },
  4:  { name: { en: 'Sukha Malika Yoga', hi: 'सुख मालिका योग', sa: 'सुखमालिकायोगः' }, isAuspicious: true, domains: ['family', 'education'] },
  5:  { name: { en: 'Putra Malika Yoga', hi: 'पुत्र मालिका योग', sa: 'पुत्रमालिकायोगः' }, isAuspicious: true, domains: ['children', 'education'] },
  6:  { name: { en: 'Shatru Malika Yoga', hi: 'शत्रु मालिका योग', sa: 'शत्रुमालिकायोगः' }, isAuspicious: false, domains: ['health'] },
  7:  { name: { en: 'Kalatra Malika Yoga', hi: 'कलत्र मालिका योग', sa: 'कलत्रमालिकायोगः' }, isAuspicious: true, domains: ['marriage'] },
  8:  { name: { en: 'Randhra Malika Yoga', hi: 'रन्ध्र मालिका योग', sa: 'रन्ध्रमालिकायोगः' }, isAuspicious: false, domains: ['spiritual', 'health'] },
  9:  { name: { en: 'Dharma Malika Yoga', hi: 'धर्म मालिका योग', sa: 'धर्ममालिकायोगः' }, isAuspicious: true, domains: ['spiritual', 'career'] },
  10: { name: { en: 'Karma Malika Yoga', hi: 'कर्म मालिका योग', sa: 'कर्ममालिकायोगः' }, isAuspicious: true, domains: ['career'] },
  11: { name: { en: 'Labha Malika Yoga', hi: 'लाभ मालिका योग', sa: 'लाभमालिकायोगः' }, isAuspicious: true, domains: ['wealth'] },
  12: { name: { en: 'Vyaya Malika Yoga', hi: 'व्यय मालिका योग', sa: 'व्ययमालिकायोगः' }, isAuspicious: false, domains: ['spiritual'] },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Find the longest chain of consecutive occupied houses (Sun-Saturn only).
 * Houses wrap around: 12 → 1 is consecutive.
 *
 * Returns the chain as an array of house numbers in order, or empty if < 3.
 */
function findLongestConsecutiveChain(ctx: YogaContext): number[] {
  // Build a set of occupied houses (Sun-Saturn only)
  const occupied = new Set<number>();
  for (const pid of SUN_TO_SATURN) {
    occupied.add(ctx.planetHouse(pid));
  }

  if (occupied.size < 3) return [];

  // Try each house as a potential chain start and find the longest run
  let bestChain: number[] = [];

  for (let start = 1; start <= 12; start++) {
    if (!occupied.has(start)) continue;

    const chain: number[] = [start];
    let current = start;
    for (let step = 1; step < 12; step++) {
      const next = (current % 12) + 1; // wrap 12 → 1
      if (!occupied.has(next)) break;
      chain.push(next);
      current = next;
    }

    if (chain.length > bestChain.length) {
      bestChain = chain;
    }
  }

  return bestChain.length >= 3 ? bestChain : [];
}

/**
 * Get the first planet found in a given house (lowest planet ID = classical order).
 * Returns planet ID or -1 if no Sun-Saturn planet in that house.
 */
function firstPlanetInHouse(ctx: YogaContext, house: number): number {
  for (const pid of SUN_TO_SATURN) {
    if (ctx.planetHouse(pid) === house) return pid;
  }
  return -1;
}

/**
 * Get all Sun-Saturn planet IDs in the given set of houses.
 */
function planetsInHouses(ctx: YogaContext, houses: number[]): number[] {
  const houseSet = new Set(houses);
  return SUN_TO_SATURN.filter((pid) => houseSet.has(ctx.planetHouse(pid)));
}

// ─────────────────────────────────────────────────────────────────────────────
// Strength assessor shared by Malika and Sanghata
// ─────────────────────────────────────────────────────────────────────────────

function malikaStrength(ctx: YogaContext, result: YogaDetectionResult): 'Strong' | 'Moderate' | 'Weak' {
  const planets = result.involvedPlanets;
  if (planets.length === 0) return 'Moderate';

  let strongFactors = 0;
  let weakFactors = 0;

  for (const pid of planets) {
    const dignity = ctx.dignity(pid);
    if (dignity === 'exalted' || dignity === 'moolatrikona') strongFactors += 2;
    if (dignity === 'own') strongFactors++;
    if (dignity === 'debilitated') weakFactors += 2;
    if (ctx.isCombust(pid)) weakFactors++;
  }

  // Longer chains are inherently stronger
  const chainLength = result.chainLength ?? 0;
  if (chainLength >= 5) strongFactors += 2;
  else if (chainLength >= 4) strongFactors += 1;

  if (strongFactors >= 4 && weakFactors === 0) return 'Strong';
  if (weakFactors >= 3) return 'Weak';
  return 'Moderate';
}

// ─────────────────────────────────────────────────────────────────────────────
// Malika Yoga Rules
// ─────────────────────────────────────────────────────────────────────────────

export const MALIKA_RULES: YogaRule[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Graha Malika Yoga — single rule with dynamic detection
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Graha Malika (Garland) Yoga
   *
   * Planets (Sun-Saturn) in consecutive houses forming a chain of >= 3 houses.
   * Named by the starting house. First planet in chain = approach/energy,
   * last planet = manifestation/outcome.
   *
   * Source: BPHS Ch.35; Phaladeepika Ch.7; Saravali
   */
  {
    id: 'graha-malika',
    name: { en: 'Graha Malika Yoga', hi: 'ग्रह मालिका योग', sa: 'ग्रहमालिकायोगः' },
    group: 'malika',
    isAuspicious: true, // Default — overridden dynamically in customData
    classicalRef: 'BPHS Ch.35; Phaladeepika Ch.7',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        const chain = findLongestConsecutiveChain(ctx);
        if (chain.length === 0) {
          return { present: false, involvedPlanets: [] };
        }

        const startHouse = chain[0];
        const endHouse = chain[chain.length - 1];
        const chainLength = chain.length;

        const firstPlanet = firstPlanetInHouse(ctx, startHouse);
        const lastPlanet = firstPlanetInHouse(ctx, endHouse);
        const involved = planetsInHouses(ctx, chain);

        const variant = MALIKA_VARIANTS[startHouse];

        return {
          present: true,
          involvedPlanets: involved,
          customData: {
            startHouse,
            endHouse,
            chainLength,
            firstPlanet,
            lastPlanet,
            variantName: variant?.name ?? MALIKA_VARIANTS[1].name,
            isAuspicious: variant?.isAuspicious ?? true,
            domains: variant?.domains ?? 'all',
            firstPlanetRole: firstPlanet >= 0 ? PLANET_ROLES[firstPlanet] : undefined,
            lastPlanetRole: lastPlanet >= 0 ? PLANET_ROLES[lastPlanet] : undefined,
          },
        };
      },
    },

    assessStrength: malikaStrength,

    affectedDomains: 'all', // Overridden dynamically via customData.domains
    domainImpactWeight: 2,

    formationRule: {
      en: 'Sun-Saturn planets occupy 3 or more consecutive houses, forming a garland (malika). Named by the starting house.',
      hi: 'सूर्य-शनि ग्रह 3 या अधिक लगातार भावों में, मालिका (माला) बनाते हैं। प्रारम्भ भाव के अनुसार नाम।',
    },
    description: {
      en: 'Graha Malika Yoga forms when planets occupy consecutive houses like beads on a garland. The starting house determines the name and nature of the yoga — Lagna Malika (from 1st) bestows all-round fortune, while Dharma Malika (from 9th) strengthens spiritual and career pursuits. The first planet in the chain colours the approach, the last planet shapes the manifestation. Longer chains (5+ houses) are exceptionally powerful.',
      hi: 'ग्रह मालिका योग तब बनता है जब ग्रह माला के मोतियों की तरह लगातार भावों में बैठते हैं। प्रारम्भ भाव योग का नाम और स्वभाव तय करता है — लग्न मालिका (1 से) सर्वांगीण भाग्य देती है, धर्म मालिका (9 से) आध्यात्मिक और करियर को बल देती है। श्रृंखला का पहला ग्रह दृष्टिकोण देता है, अंतिम ग्रह परिणाम।',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Graha Sanghata Yoga — all 7 planets within 4 consecutive houses
  // ───────────────────────────────────────────────────────────────────────────
  /**
   * Graha Sanghata (Planetary Cluster) Yoga
   *
   * All 7 classical planets (Sun-Saturn) fit within a window of 4 consecutive
   * houses. Unlike Malika, not every house in the window needs to be occupied —
   * the planets just need to cluster within 4 houses.
   *
   * Source: Phaladeepika Ch.7; Saravali
   */
  {
    id: 'graha-sanghata',
    name: { en: 'Graha Sanghata Yoga', hi: 'ग्रह संघात योग', sa: 'ग्रहसंघातयोगः' },
    group: 'malika',
    isAuspicious: true, // Can vary — set dynamically
    classicalRef: 'Phaladeepika Ch.7; Saravali',

    conditions: {
      type: 'custom',
      detect: (ctx: YogaContext) => {
        // Get houses occupied by each of the 7 planets
        const planetHouses = SUN_TO_SATURN.map((pid) => ctx.planetHouse(pid));

        // Try each possible 4-house window (starting at each house 1-12)
        for (let windowStart = 1; windowStart <= 12; windowStart++) {
          const windowHouses = new Set<number>();
          for (let offset = 0; offset < 4; offset++) {
            windowHouses.add(((windowStart - 1 + offset) % 12) + 1);
          }

          const allFit = planetHouses.every((h) => windowHouses.has(h));
          if (allFit) {
            const windowArr = Array.from(windowHouses);

            // Determine if window overlaps kendra/trikona for auspiciousness
            const hasKendra = windowArr.some((h) => ctx.isKendra(h));
            const hasTrikona = windowArr.some((h) => ctx.isTrikona(h));
            const isAuspicious = hasKendra && hasTrikona;

            const firstPlanet = firstPlanetInHouse(ctx, windowStart);
            const lastHouse = ((windowStart - 1 + 3) % 12) + 1;
            const lastPlanet = firstPlanetInHouse(ctx, lastHouse);

            return {
              present: true,
              involvedPlanets: [...SUN_TO_SATURN],
              customData: {
                windowStart,
                windowHouses: windowArr,
                firstPlanet,
                lastPlanet,
                isAuspicious,
                hasKendra,
                hasTrikona,
              },
            };
          }
        }

        return { present: false, involvedPlanets: [] };
      },
    },

    assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => {
      // All 7 planets involved — check overall dignity
      let strongFactors = 0;
      let weakFactors = 0;

      for (const pid of SUN_TO_SATURN) {
        const dignity = ctx.dignity(pid);
        if (dignity === 'exalted' || dignity === 'own' || dignity === 'moolatrikona') strongFactors++;
        if (dignity === 'debilitated') weakFactors++;
        if (ctx.isCombust(pid)) weakFactors++;
      }

      if (strongFactors >= 4 && weakFactors <= 1) return 'Strong';
      if (weakFactors >= 3) return 'Weak';
      return 'Moderate';
    },

    affectedDomains: 'all',
    domainImpactWeight: 2,

    formationRule: {
      en: 'All 7 classical planets (Sun through Saturn) fit within 4 consecutive houses',
      hi: 'सभी 7 शास्त्रीय ग्रह (सूर्य से शनि) 4 लगातार भावों में समा जाते हैं',
    },
    description: {
      en: 'Graha Sanghata Yoga forms when all seven visible planets cluster within just four consecutive houses — an extremely concentrated chart. The native\'s energy is intensely focused on the life areas represented by those houses. When the cluster overlaps with kendras and trikonas, it produces formidable results in career and fortune. When it falls in dusthanas, it creates intense challenges that demand extraordinary resilience.',
      hi: 'ग्रह संघात योग तब बनता है जब सातों दृश्य ग्रह केवल चार लगातार भावों में एकत्रित होते हैं — अत्यंत केंद्रित कुंडली। जातक की ऊर्जा उन भावों के जीवन क्षेत्रों पर तीव्रता से केंद्रित होती है। जब समूह केन्द्र और त्रिकोण में आता है, तो करियर और भाग्य में प्रबल परिणाम देता है।',
    },
  },
];
