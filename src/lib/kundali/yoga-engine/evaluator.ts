/**
 * Yoga Condition Evaluator
 *
 * Evaluates declarative YogaCondition objects against a YogaContext.
 * This is the core of the engine — all yoga detection flows through here.
 *
 * Conditions are evaluated recursively:
 * - Primitive conditions (planet_in_house, dignity, etc.) check the context directly
 * - Composite conditions (and/or) recurse into sub-conditions
 * - Custom conditions delegate to their detect function
 *
 * Every evaluation is PURE: no side effects, no state mutation, no DOM access.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * House IDs:  1-12 (1=ascendant)
 */

import type { YogaCondition, YogaContext } from './types';

/** Result of evaluating a single condition */
export interface ConditionResult {
  /** Whether the condition is met */
  met: boolean;
  /** Planet IDs involved in satisfying this condition */
  involvedPlanets: number[];
  /** Custom data returned by CustomCondition detectors */
  customData?: Record<string, unknown>;
}

/**
 * Evaluates a declarative YogaCondition against a YogaContext.
 *
 * This function pattern-matches on the condition's `type` discriminant and
 * delegates to the appropriate evaluation logic. Composite conditions
 * (and/or) recurse. Custom conditions invoke their pure detector function.
 *
 * @param condition - The condition to evaluate
 * @param ctx - The precomputed chart context
 * @returns Whether the condition is met, which planets are involved, and any custom data
 */
export function evaluateCondition(
  condition: YogaCondition,
  ctx: YogaContext,
): ConditionResult {
  switch (condition.type) {
    case 'planet_in_house':
      return evaluatePlanetInHouse(condition, ctx);

    case 'planet_in_sign':
      return evaluatePlanetInSign(condition, ctx);

    case 'planet_dignity':
      return evaluatePlanetDignity(condition, ctx);

    case 'conjunction':
      return evaluateConjunction(condition, ctx);

    case 'planet_aspects_house':
      return evaluateAspect(condition, ctx);

    case 'lord_in_house':
      return evaluateLordInHouse(condition, ctx);

    case 'lord_connection':
      return evaluateLordConnection(condition, ctx);

    case 'consecutive_houses':
      return evaluateConsecutiveHouses(condition, ctx);

    case 'stellium':
      return evaluateStellium(condition, ctx);

    case 'houses_occupied':
      return evaluateHousesOccupied(condition, ctx);

    case 'retrograde':
      return evaluateRetrograde(condition, ctx);

    case 'combust':
      return evaluateCombust(condition, ctx);

    case 'custom':
      return evaluateCustom(condition, ctx);

    case 'and':
    case 'or':
      return evaluateComposite(condition, ctx);

    default: {
      // Exhaustiveness check — should never reach here if types are correct
      const _exhaustive: never = condition;
      console.error('[yoga-evaluator] Unknown condition type:', (_exhaustive as { type: string }).type);
      return { met: false, involvedPlanets: [] };
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Primitive condition evaluators
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate: planet must be in one of the specified houses.
 *
 * When fromLagna is false, the house is counted from Moon's position instead
 * of the ascendant. This is used for Moon-based yogas like Sunapha/Anapha
 * where "2nd from Moon" means 2nd house counting from Moon's house.
 */
function evaluatePlanetInHouse(
  condition: Extract<YogaCondition, { type: 'planet_in_house' }>,
  ctx: YogaContext,
): ConditionResult {
  const { planetId, houses, fromLagna = true } = condition;

  let effectiveHouse: number;
  if (fromLagna) {
    // Standard: house from ascendant
    effectiveHouse = ctx.planetHouse(planetId);
  } else {
    // From Moon: calculate house offset from Moon's position
    // Moon's house is the reference point (acts as "house 1")
    const moonHouse = ctx.planetHouse(1); // 1 = Moon
    const planetHouse = ctx.planetHouse(planetId);
    effectiveHouse = ctx.houseOffset(moonHouse, planetHouse);
  }

  const met = houses.includes(effectiveHouse);
  return { met, involvedPlanets: met ? [planetId] : [] };
}

/**
 * Evaluate: planet must be in one of the specified signs.
 *
 * Used for sign-specific yogas. For example, Ruchaka Yoga requires Mars
 * in Aries, Scorpio, or Capricorn (own/exalted signs) AND in a kendra.
 */
function evaluatePlanetInSign(
  condition: Extract<YogaCondition, { type: 'planet_in_sign' }>,
  ctx: YogaContext,
): ConditionResult {
  const { planetId, signs } = condition;
  const sign = ctx.planetSign(planetId);
  const met = signs.includes(sign);
  return { met, involvedPlanets: met ? [planetId] : [] };
}

/**
 * Evaluate: planet must have one of the specified dignity levels.
 *
 * Dignity is computed by the context builder using canonical BPHS tables.
 * This check is fundamental to Mahapurusha yogas (own/exalted in kendra)
 * and strength assessments.
 */
function evaluatePlanetDignity(
  condition: Extract<YogaCondition, { type: 'planet_dignity' }>,
  ctx: YogaContext,
): ConditionResult {
  const { planetId, dignities } = condition;
  const dignity = ctx.dignity(planetId);
  const met = dignities.includes(dignity);
  return { met, involvedPlanets: met ? [planetId] : [] };
}

/**
 * Evaluate: two planets must be conjunct (in the same house).
 *
 * Uses the classical definition: same rashi (house in whole-sign system).
 * This is NOT degree-based — two planets 29° apart in the same sign are conjunct.
 * Degree-based orbs are used only for special cases like combustion.
 */
function evaluateConjunction(
  condition: Extract<YogaCondition, { type: 'conjunction' }>,
  ctx: YogaContext,
): ConditionResult {
  const { planet1, planet2 } = condition;
  const met = ctx.areConjunct(planet1, planet2);
  return { met, involvedPlanets: met ? [planet1, planet2] : [] };
}

/**
 * Evaluate: planet must aspect a specific house.
 *
 * Includes both the universal 7th-house aspect and special aspects:
 * - Mars aspects 4th, 7th, 8th from its position
 * - Jupiter aspects 5th, 7th, 9th from its position
 * - Saturn aspects 3rd, 7th, 10th from its position
 *
 * Direction is always FROM planet TO target house (Lesson T).
 */
function evaluateAspect(
  condition: Extract<YogaCondition, { type: 'planet_aspects_house' }>,
  ctx: YogaContext,
): ConditionResult {
  const { planetId, house, fromLagna = true } = condition;

  let targetHouse = house;
  if (!fromLagna) {
    // Resolve house from Moon: convert "Nth from Moon" to absolute house number
    const moonHouse = ctx.planetHouse(1);
    targetHouse = ((moonHouse - 1 + house - 1) % 12) + 1;
  }

  const met = ctx.doesAspect(planetId, targetHouse);
  return { met, involvedPlanets: met ? [planetId] : [] };
}

/**
 * Evaluate: lord of a specified house must be in one of the specified houses.
 *
 * This is the building block for many classical yogas:
 * - 9th lord in kendra → fortune through righteous action
 * - 10th lord in trikona → career success through past merit
 * - 6th lord in 12th → debts self-resolve (Viparita Raja Yoga)
 */
function evaluateLordInHouse(
  condition: Extract<YogaCondition, { type: 'lord_in_house' }>,
  ctx: YogaContext,
): ConditionResult {
  const { lordOfHouse, inHouses } = condition;
  const lordId = ctx.houseLord(lordOfHouse);
  const lordHouse = ctx.planetHouse(lordId);
  const met = inHouses.includes(lordHouse);
  return { met, involvedPlanets: met ? [lordId] : [] };
}

/**
 * Evaluate: lords of two houses must be connected.
 *
 * Connection types (BPHS Ch.34-35):
 * - conjunction: both lords in the same house
 * - exchange: lords are in each other's houses (parivartana)
 * - mutual_aspect: lords aspect each other (including special aspects)
 * - any: any of the above three
 *
 * This is the CORE building block for Raja Yoga detection:
 * "When the lords of a kendra and trikona are connected, Raja Yoga forms."
 */
function evaluateLordConnection(
  condition: Extract<YogaCondition, { type: 'lord_connection' }>,
  ctx: YogaContext,
): ConditionResult {
  const { house1, house2, connectionType } = condition;
  const lord1 = ctx.houseLord(house1);
  const lord2 = ctx.houseLord(house2);

  // Skip if both houses are ruled by the same planet (e.g. Gemini lagna: 1st and 4th both Mercury)
  // The connection is inherent — the yoga is automatically formed by that planet.
  if (lord1 === lord2) {
    return { met: true, involvedPlanets: [lord1] };
  }

  const lord1House = ctx.planetHouse(lord1);
  const lord2House = ctx.planetHouse(lord2);

  let connected = false;

  if (connectionType === 'conjunction' || connectionType === 'any') {
    // Conjunction: both lords in the same house
    if (lord1House === lord2House) connected = true;
  }

  if (!connected && (connectionType === 'exchange' || connectionType === 'any')) {
    // Exchange (Parivartana): lord1 is in house2's sign AND lord2 is in house1's sign
    // We check house placement: lord of house1 is in house2, and vice versa
    if (lord1House === house2 && lord2House === house1) connected = true;
  }

  if (!connected && (connectionType === 'mutual_aspect' || connectionType === 'any')) {
    // Mutual aspect: lord1 aspects lord2's house AND lord2 aspects lord1's house
    if (ctx.doesAspect(lord1, lord2House) && ctx.doesAspect(lord2, lord1House)) {
      connected = true;
    }
  }

  return {
    met: connected,
    involvedPlanets: connected ? [lord1, lord2] : [],
  };
}

/**
 * Evaluate: planets must occupy N or more consecutive houses.
 *
 * Used for Nabhasa Akriti yogas (Phaladeepika Ch.7):
 * - Yupa: all 7 planets in 4 consecutive houses starting from a kendra
 * - Shara: all 7 planets in 4 consecutive houses starting from a panaphara
 * - Shakti: all 7 planets in 4 consecutive houses starting from an apoklima
 * - Danda: all 7 planets in 4 consecutive houses starting from a specific house
 *
 * Also used for Graha Malika detection (planets forming a "garland" chain).
 */
function evaluateConsecutiveHouses(
  condition: Extract<YogaCondition, { type: 'consecutive_houses' }>,
  ctx: YogaContext,
): ConditionResult {
  const { minChain, planetsConsidered } = condition;
  const maxPlanetId = planetsConsidered === 'sun_to_saturn' ? 6 : 8;

  // Build a set of occupied houses
  const occupiedHouses = new Set<number>();
  const involvedPlanets: number[] = [];

  for (const p of ctx.planets) {
    if (p.id <= maxPlanetId) {
      occupiedHouses.add(p.house);
      involvedPlanets.push(p.id);
    }
  }

  // Find the longest chain of consecutive occupied houses (wrapping around 12→1)
  let bestChain = 0;
  let bestStart = 1;
  for (let start = 1; start <= 12; start++) {
    let chain = 0;
    for (let offset = 0; offset < 12; offset++) {
      const h = ((start - 1 + offset) % 12) + 1;
      if (occupiedHouses.has(h)) {
        chain++;
        if (chain > bestChain) {
          bestChain = chain;
          bestStart = start;
        }
      } else {
        break;
      }
    }
  }

  const met = bestChain >= minChain;

  // Only include planets whose houses are IN the found chain
  let filteredPlanets: number[] = [];
  if (met) {
    const chainHouses = new Set<number>();
    for (let i = 0; i < bestChain; i++) {
      chainHouses.add(((bestStart - 1 + i) % 12) + 1);
    }
    filteredPlanets = involvedPlanets.filter(pid => {
      const pHouse = ctx.planets.find(p => p.id === pid)?.house;
      return pHouse !== undefined && chainHouses.has(pHouse);
    });
  }

  return {
    met,
    involvedPlanets: met ? filteredPlanets : [],
    customData: met ? { chainLength: bestChain, startHouse: bestStart } : undefined,
  };
}

/**
 * Evaluate: N or more planets must occupy a single house.
 *
 * Used for:
 * - Sannyasa Yoga: 4+ planets in one sign (Phaladeepika)
 * - Stellium detection: concentration of planetary energy
 * - Specific house stelliums (e.g. 4+ planets in 10th for career dominance)
 */
function evaluateStellium(
  condition: Extract<YogaCondition, { type: 'stellium' }>,
  ctx: YogaContext,
): ConditionResult {
  const { minPlanets, inHouse } = condition;

  if (inHouse !== undefined) {
    // Check specific house
    const planets = ctx.planetsInHouse(inHouse);
    const met = planets.length >= minPlanets;
    return { met, involvedPlanets: met ? planets : [] };
  }

  // Check any house
  for (let h = 1; h <= 12; h++) {
    const planets = ctx.planetsInHouse(h);
    if (planets.length >= minPlanets) {
      return { met: true, involvedPlanets: planets };
    }
  }

  return { met: false, involvedPlanets: [] };
}

/**
 * Evaluate: exactly N houses must be occupied by planets.
 *
 * Used for Nabhasa Sankhya yogas (Phaladeepika Ch.7):
 * - Gola: all planets in 1 house
 * - Yuga: all planets in 2 houses
 * - Shoola: all planets in 3 houses
 * - Kedara: all planets in 4 houses
 * - Paasha: all planets in 5 houses
 * - Dama: all planets in 6 houses
 * - Veena: all planets in 7 houses
 */
function evaluateHousesOccupied(
  condition: Extract<YogaCondition, { type: 'houses_occupied' }>,
  ctx: YogaContext,
): ConditionResult {
  const { count, planetsConsidered } = condition;
  const maxPlanetId = planetsConsidered === 'sun_to_saturn' ? 6 : 8;

  const occupiedHouses = new Set<number>();
  const involvedPlanets: number[] = [];

  for (const p of ctx.planets) {
    if (p.id <= maxPlanetId) {
      occupiedHouses.add(p.house);
      involvedPlanets.push(p.id);
    }
  }

  const met = occupiedHouses.size === count;
  return { met, involvedPlanets: met ? involvedPlanets : [] };
}

/**
 * Evaluate: planet must be retrograde (or direct).
 *
 * Retrograde planets are considered stronger in certain contexts (BPHS Ch.28)
 * and weaker in others. Sun and Moon never retrograde. Rahu/Ketu are always
 * retrograde by definition (their mean motion is always backward).
 */
function evaluateRetrograde(
  condition: Extract<YogaCondition, { type: 'retrograde' }>,
  ctx: YogaContext,
): ConditionResult {
  const { planetId, isRetrograde } = condition;
  const met = ctx.isRetrograde(planetId) === isRetrograde;
  return { met, involvedPlanets: met ? [planetId] : [] };
}

/**
 * Evaluate: planet must be combust (or non-combust).
 *
 * Combustion weakens a planet significantly (BPHS Ch.25). A combust planet
 * cannot deliver its full results. Combustion orbs (from Sun):
 * Moon: 12°, Mars: 17°, Mercury: 14° (retrograde: 12°),
 * Jupiter: 11°, Venus: 10° (retrograde: 8°), Saturn: 15°
 *
 * The combustion flag is precomputed in KundaliData — we just read it here.
 * Lesson X: combustion orbs differ for retrograde Mercury and Venus.
 */
function evaluateCombust(
  condition: Extract<YogaCondition, { type: 'combust' }>,
  ctx: YogaContext,
): ConditionResult {
  const { planetId, isCombust } = condition;
  const met = ctx.isCombust(planetId) === isCombust;
  return { met, involvedPlanets: met ? [planetId] : [] };
}

/**
 * Evaluate: custom detection function.
 *
 * Escape hatch for yogas too complex for declarative conditions.
 * The detect function must be pure (no side effects).
 *
 * Used for: Kaal Sarpa (all planets between Rahu-Ketu axis),
 * Graha Malika (garland chain), Kemadurma cancellation, etc.
 */
function evaluateCustom(
  condition: Extract<YogaCondition, { type: 'custom' }>,
  ctx: YogaContext,
): ConditionResult {
  const result = condition.detect(ctx);
  return {
    met: result.present,
    involvedPlanets: result.involvedPlanets,
    customData: result.customData,
  };
}

/**
 * Evaluate: composite AND/OR of sub-conditions.
 *
 * AND: all sub-conditions must be true. Involved planets = union of all.
 * OR:  at least one sub-condition must be true. Involved planets = first match.
 *
 * Short-circuits:
 * - AND stops at first false
 * - OR stops at first true
 */
function evaluateComposite(
  condition: Extract<YogaCondition, { type: 'and' | 'or' }>,
  ctx: YogaContext,
): ConditionResult {
  const { type, conditions } = condition;

  if (type === 'and') {
    // All must be true
    const allPlanets: number[] = [];
    let mergedCustomData: Record<string, unknown> | undefined;

    for (const sub of conditions) {
      const result = evaluateCondition(sub, ctx);
      if (!result.met) {
        return { met: false, involvedPlanets: [] };
      }
      allPlanets.push(...result.involvedPlanets);
      if (result.customData) {
        mergedCustomData = { ...mergedCustomData, ...result.customData };
      }
    }

    // Deduplicate planet IDs
    const uniquePlanets = [...new Set(allPlanets)];
    return { met: true, involvedPlanets: uniquePlanets, customData: mergedCustomData };
  }

  // OR: at least one must be true
  for (const sub of conditions) {
    const result = evaluateCondition(sub, ctx);
    if (result.met) {
      return result;
    }
  }

  return { met: false, involvedPlanets: [] };
}
