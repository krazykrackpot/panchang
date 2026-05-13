/**
 * Yoga Engine Types
 *
 * A comprehensive type system for declarative yoga detection in Vedic astrology.
 * Each yoga is defined as a YogaRule with conditions, cancellations,
 * domain mappings, and interpretation data.
 *
 * Classical sources: BPHS Ch.34-40, Phaladeepika Ch.6-7, Saravali, Jataka Parijata
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Sign IDs:   1=Aries through 12=Pisces (1-based)
 * House IDs:  1-12 (1-based, 1=ascendant)
 */

import type { LocaleText } from '@/types/panchang';

// ─────────────────────────────────────────────────────────────────────────────
// Yoga classification enums
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Yoga group — maps to classical text chapters.
 *
 * - mahapurusha:  Pancha Mahapurusha (BPHS Ch.34) — Mars/Mercury/Jupiter/Venus/Saturn in kendra in own/exalted sign
 * - chandra:      Moon-based yogas (Phaladeepika Ch.6) — Gajakesari, Sunapha, Anapha, etc.
 * - surya:        Sun-based yogas — Veshi, Vashi, Ubhayachari
 * - raja:         Raja Yogas (BPHS Ch.34-35) — kendra-trikona lord connections
 * - dhana:        Wealth yogas (BPHS Ch.36) — 2nd/11th lord connections
 * - dosha:        Afflictions (various) — Manglik, Kaal Sarpa, Pitru Dosha
 * - nabhasa:      Nabhasa — 32 types in 4 sub-groups (Phaladeepika Ch.7)
 * - malika:       Graha Malika / Garland yogas — planets in consecutive houses
 * - parivartana:  Exchange yogas — mutual sign exchange between house lords
 * - arishta:      Longevity/health yogas — afflictions to 1st/8th lords
 * - sannyasa:     Renunciation/spiritual yogas — 4+ planets in one sign, etc.
 * - conjunction:  Planet conjunction yogas — specific planet combinations
 * - navamsha:     D9 divisional chart yogas — Vargottama, Pushkara
 * - tajika:       Tajika (annual chart) yogas — Varshaphal-specific
 */
export type YogaGroup =
  | 'mahapurusha'
  | 'chandra'
  | 'surya'
  | 'raja'
  | 'dhana'
  | 'dosha'
  | 'nabhasa'
  | 'malika'
  | 'parivartana'
  | 'arishta'
  | 'sannyasa'
  | 'conjunction'
  | 'navamsha'
  | 'tajika';

/**
 * Nabhasa sub-groups — 4 categories of sky-pattern yogas (Phaladeepika Ch.7).
 *
 * - aashray:  Based on movable/fixed/dual sign occupation
 * - dala:     Based on kendra/panaphara/apoklima occupation
 * - akriti:   Based on geometric patterns (Yupa, Shara, Shakti, etc.)
 * - sankhya:  Based on count of occupied houses (Gola=1 through Vallaki=7)
 */
export type NabhasaSubGroup = 'aashray' | 'dala' | 'akriti' | 'sankhya';

/**
 * Life domains affected by yogas.
 * Used for domain-level synthesis: "What does this chart say about career?"
 */
export type DomainType =
  | 'health'
  | 'wealth'
  | 'career'
  | 'marriage'
  | 'children'
  | 'family'
  | 'spiritual'
  | 'education';

/**
 * Planetary dignity levels — ordered from strongest to weakest.
 * Source: BPHS Ch.3-4
 *
 * - exalted:      Planet in its exaltation sign (e.g. Sun in Aries)
 * - moolatrikona: Planet in its moolatrikona range (e.g. Sun in Leo 0-20°)
 * - own:          Planet in a sign it rules (e.g. Mars in Aries or Scorpio)
 * - friend:       Planet in a sign ruled by a natural friend
 * - neutral:      Planet in a sign ruled by a natural neutral
 * - enemy:        Planet in a sign ruled by a natural enemy
 * - debilitated:  Planet in its debilitation sign (e.g. Sun in Libra)
 */
export type DignityLevel =
  | 'exalted'
  | 'moolatrikona'
  | 'own'
  | 'friend'
  | 'neutral'
  | 'enemy'
  | 'debilitated';

// ─────────────────────────────────────────────────────────────────────────────
// Condition primitives — declarative building blocks for yoga detection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Planet must be in specific house(s).
 *
 * Example: Jupiter in a kendra → { type: 'planet_in_house', planetId: 4, houses: [1,4,7,10] }
 */
export interface HouseCondition {
  type: 'planet_in_house';
  /** Planet ID (0=Sun through 8=Ketu) */
  planetId: number;
  /** Acceptable house numbers (1-12) */
  houses: number[];
  /** If true, count from ascendant (default). If false, count from Moon sign. */
  fromLagna?: boolean;
}

/**
 * Planet must be in specific sign(s).
 *
 * Example: Saturn in Libra (exalted) → { type: 'planet_in_sign', planetId: 6, signs: [7] }
 */
export interface SignCondition {
  type: 'planet_in_sign';
  /** Planet ID (0=Sun through 8=Ketu) */
  planetId: number;
  /** Acceptable sign numbers (1-12, 1=Aries) */
  signs: number[];
}

/**
 * Planet must have specific dignity in its current sign.
 *
 * Example: Venus in own/exalted → { type: 'planet_dignity', planetId: 5, dignities: ['own', 'exalted'] }
 */
export interface DignityCondition {
  type: 'planet_dignity';
  /** Planet ID (0=Sun through 8=Ketu) */
  planetId: number;
  /** Acceptable dignity levels */
  dignities: DignityLevel[];
}

/**
 * Two planets must be conjunct (occupying the same house).
 * Classical definition: same rashi (sign), not degree-based.
 */
export interface ConjunctionCondition {
  type: 'conjunction';
  /** First planet ID */
  planet1: number;
  /** Second planet ID */
  planet2: number;
}

/**
 * Planet must aspect a specific house.
 * Includes special (vishesh drishti) aspects per BPHS Ch.26:
 * - All planets aspect 7th house from themselves
 * - Mars additionally aspects 4th and 8th
 * - Jupiter additionally aspects 5th and 9th
 * - Saturn additionally aspects 3rd and 10th
 */
export interface AspectCondition {
  type: 'planet_aspects_house';
  /** Planet ID doing the aspecting */
  planetId: number;
  /** Target house number (1-12) */
  house: number;
  /** If true, house counted from lagna (default). If false, from Moon. */
  fromLagna?: boolean;
}

/**
 * Lord of a specific house must be placed in specific house(s).
 *
 * Example: 9th lord in kendra → { type: 'lord_in_house', lordOfHouse: 9, inHouses: [1,4,7,10] }
 */
export interface LordInHouseCondition {
  type: 'lord_in_house';
  /** The house whose lord we're checking */
  lordOfHouse: number;
  /** Lord must be in one of these houses */
  inHouses: number[];
}

/**
 * Two house lords must be connected via conjunction, exchange, or mutual aspect.
 * This is the core building block for Raja Yoga detection per BPHS Ch.34-35:
 * "When lords of a kendra and a trikona are connected, Raja Yoga forms."
 */
export interface LordConnectionCondition {
  type: 'lord_connection';
  /** First house number */
  house1: number;
  /** Second house number */
  house2: number;
  /** Type of connection required */
  connectionType: 'conjunction' | 'exchange' | 'mutual_aspect' | 'any';
}

/**
 * All planets must fall within N consecutive houses.
 * Used for Nabhasa Akriti yogas like Yupa (all in 4 consecutive houses).
 */
export interface ConsecutiveHouseCondition {
  type: 'consecutive_houses';
  /** Minimum length of the consecutive occupied house chain */
  minChain: number;
  /** Which planets to consider */
  planetsConsidered: 'sun_to_saturn' | 'all_nine';
}

/**
 * N or more planets in a single house.
 * Used for Sannyasa yoga (4+ planets in one house) and stellium detection.
 */
export interface StelliumCondition {
  type: 'stellium';
  /** Minimum planet count in one house */
  minPlanets: number;
  /** If specified, planets must be in this exact house. Otherwise any house qualifies. */
  inHouse?: number;
}

/**
 * Exactly N houses are occupied by planets.
 * Used for Nabhasa Sankhya yogas: Gola (1 house), Yuga (2), Shoola (3), etc.
 */
export interface HousesOccupiedCondition {
  type: 'houses_occupied';
  /** Exactly this many houses must have at least one planet */
  count: number;
  /** Which planets to consider */
  planetsConsidered: 'sun_to_saturn' | 'all_nine';
}

/**
 * Planet must be retrograde (or direct).
 * Retrograde planets are considered stronger in certain yoga contexts (BPHS Ch.28).
 */
export interface RetrogradeCondition {
  type: 'retrograde';
  /** Planet ID (typically 2-6; Sun/Moon/Rahu/Ketu don't retrograde classically) */
  planetId: number;
  /** true = must be retrograde, false = must be direct */
  isRetrograde: boolean;
}

/**
 * Planet must be combust (within combustion orb of Sun) or non-combust.
 * Combustion weakens a planet significantly (BPHS Ch.25).
 * Combustion orbs: Moon 12°, Mars 17°, Mercury 14°(R:12°), Jupiter 11°, Venus 10°(R:8°), Saturn 15°
 */
export interface CombustCondition {
  type: 'combust';
  /** Planet ID */
  planetId: number;
  /** true = must be combust, false = must not be combust */
  isCombust: boolean;
}

/**
 * Custom detection function — escape hatch for yogas too complex for declarative conditions.
 *
 * Used for yogas like Kaal Sarpa (all planets between Rahu-Ketu axis),
 * Graha Malika (consecutive house chain detection), or yogas requiring
 * degree-level precision.
 *
 * The detect function must be PURE: no side effects, no DOM access, no API calls.
 */
export interface CustomCondition {
  type: 'custom';
  /** Pure function that evaluates the chart context and returns detection result */
  detect: (ctx: YogaContext) => {
    present: boolean;
    involvedPlanets: number[];
    customData?: Record<string, unknown>;
  };
}

/**
 * Composite condition — AND / OR of multiple sub-conditions.
 *
 * AND: all sub-conditions must be true (e.g. planet in kendra AND in own sign)
 * OR:  at least one sub-condition must be true (e.g. lord in 9th OR lord in 10th)
 */
export interface CompositeCondition {
  type: 'and' | 'or';
  /** Sub-conditions to evaluate */
  conditions: YogaCondition[];
}

/**
 * Union of all condition types.
 * The evaluator pattern-matches on the `type` discriminant.
 */
export type YogaCondition =
  | HouseCondition
  | SignCondition
  | DignityCondition
  | ConjunctionCondition
  | AspectCondition
  | LordInHouseCondition
  | LordConnectionCondition
  | ConsecutiveHouseCondition
  | StelliumCondition
  | HousesOccupiedCondition
  | RetrogradeCondition
  | CombustCondition
  | CustomCondition
  | CompositeCondition;

// ─────────────────────────────────────────────────────────────────────────────
// Yoga context — precomputed chart data for condition evaluation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Planet data within the yoga evaluation context.
 * Flattened from KundaliData's PlanetPosition for efficient lookup.
 */
export interface YogaPlanetData {
  /** Planet ID (0=Sun through 8=Ketu) */
  id: number;
  /** House number (1-12, whole-sign from ascendant) */
  house: number;
  /** Sign number (1=Aries through 12=Pisces) */
  sign: number;
  /** Sidereal longitude in degrees (0-360) */
  longitude: number;
  /** Degree within current sign (0-30) */
  degreeInSign: number;
  /** True if planet is in retrograde motion */
  isRetrograde: boolean;
  /** True if planet is within combustion orb of the Sun */
  isCombust: boolean;
}

/**
 * YogaContext — precomputed chart data that condition evaluators read from.
 *
 * Built once per chart by `buildYogaContext()`, then shared across all yoga
 * rule evaluations. All lookup functions are O(1) via precomputed maps.
 *
 * This is the ONLY input the condition evaluator uses — it never touches
 * KundaliData directly, ensuring clean separation between computation layers.
 */
export interface YogaContext {
  /** All planet positions, indexed by planet ID for O(1) access */
  planets: YogaPlanetData[];

  /** Ascendant sign (1-12) */
  ascendantSign: number;

  /** Ascendant longitude in degrees (0-360 sidereal) */
  ascendantLongitude: number;

  /** House cusps: house number (1-12) → sign number (1-12) */
  houseSigns: Record<number, number>;

  // ── Precomputed lookup functions ──

  /** Get the house number (1-12) a planet occupies */
  planetHouse: (id: number) => number;

  /** Get the sign number (1-12) a planet is in */
  planetSign: (id: number) => number;

  /** Get the sidereal longitude (0-360) of a planet */
  planetLongitude: (id: number) => number;

  /** Get the degree within current sign (0-30) for a planet */
  planetDegreeInSign: (id: number) => number;

  /** Check if a planet is retrograde */
  isRetrograde: (id: number) => boolean;

  /** Check if a planet is combust (within Sun's combustion orb) */
  isCombust: (id: number) => boolean;

  /** Get the sign occupying a given house (whole-sign houses) */
  houseSign: (house: number) => number;

  /**
   * Get the lord (ruling planet) of a given house.
   * Uses SIGN_LORDS from canonical dignities.ts.
   * Returns planet ID (0-6). Rahu/Ketu have no lordship.
   */
  houseLord: (house: number) => number;

  /**
   * Get the natural dignity of a planet in its current sign.
   * Uses the canonical dignity tables from BPHS Ch.3-4.
   * Rahu/Ketu always return 'neutral' (they use a different system).
   */
  dignity: (id: number) => DignityLevel;

  /** Is house a kendra? (1, 4, 7, 10 — angular houses) */
  isKendra: (house: number) => boolean;

  /** Is house a trikona? (1, 5, 9 — trinal houses) */
  isTrikona: (house: number) => boolean;

  /** Is house a dusthana? (6, 8, 12 — evil houses) */
  isDusthana: (house: number) => boolean;

  /** Is house an upachaya? (3, 6, 10, 11 — growth houses; malefics do well here) */
  isUpachaya: (house: number) => boolean;

  /**
   * Are two planets conjunct (in the same house)?
   * Classical definition: same rashi, not degree-based orb.
   */
  areConjunct: (id1: number, id2: number) => boolean;

  /**
   * Does a planet aspect a specific house?
   * Includes the 7th-house universal aspect AND special (vishesh) aspects:
   * - Jupiter aspects 5th, 7th, 9th from its position
   * - Saturn aspects 3rd, 7th, 10th from its position
   * - Mars aspects 4th, 7th, 8th from its position
   * Direction: FROM planet TO target house (Lesson T: specify direction).
   */
  doesAspect: (planetId: number, targetHouse: number) => boolean;

  /**
   * Is planet a natural benefic?
   * Natural benefics: Jupiter (always), Venus (always), waxing Moon (bright half),
   * Mercury (when not conjunct malefics — simplified to always benefic here).
   * Source: BPHS Ch.3
   */
  isNaturalBenefic: (id: number) => boolean;

  /**
   * Is planet a functional benefic for THIS specific lagna?
   * Functional benefics are determined by house lordship relative to the ascendant.
   * Source: BPHS Ch.34 — varies by lagna. See FUNCTIONAL_BENEFICS table.
   */
  isFunctionalBenefic: (id: number) => boolean;

  /**
   * Is planet a yogakaraka for this lagna?
   * A yogakaraka lords both a kendra and a trikona — the most auspicious planet.
   * Only some lagnas have a yogakaraka. Source: BPHS Ch.34.
   */
  isYogakaraka: (id: number) => boolean;

  /** Get all planet IDs occupying a specific house */
  planetsInHouse: (house: number) => number[];

  /**
   * House offset: how many houses from source to target (1-based, forward count).
   * Same house = 1, next house = 2, ..., opposite house = 7.
   * Formula: ((target - source + 12) % 12) + 1
   */
  houseOffset: (fromHouse: number, toHouse: number) => number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Yoga detection result (internal)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Result of evaluating a single yoga rule's conditions against a chart.
 * This is the raw detection output before cancellation and strength assessment.
 */
export interface YogaDetectionResult {
  /** Whether the yoga's formation conditions are met */
  present: boolean;

  /** Strength assessment (set after initial detection) */
  strength: 'Strong' | 'Moderate' | 'Weak';

  /** Planet IDs involved in forming this yoga */
  involvedPlanets: number[];

  /** For Malika/pattern yogas: starting house of the chain */
  startHouse?: number;

  /** For Malika/pattern yogas: ending house of the chain */
  endHouse?: number;

  /** For Malika/pattern yogas: length of the consecutive chain */
  chainLength?: number;

  /** For pattern yogas: first planet in the pattern */
  firstPlanet?: number;

  /** For pattern yogas: last planet in the pattern */
  lastPlanet?: number;

  /** Cancellation check results (populated by engine after detection) */
  cancellations?: { cancelled: boolean; reason: string }[];

  /** Yoga-specific extra data for interpretation (e.g. which exchange pair) */
  customData?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Yoga rule definition — the core building block
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cancellation rule — conditions that nullify or weaken a yoga.
 *
 * Classical texts (BPHS, Phaladeepika) specify explicit cancellation rules.
 * For example, Gajakesari Yoga is cancelled if Jupiter is combust or in a
 * dusthana, even though the formation conditions are met.
 */
export interface YogaCancellation {
  /** Condition that, when true, triggers the cancellation */
  condition: YogaCondition;
  /** Human-readable explanation of why this cancels the yoga */
  reason: { en: string; hi: string };
  /** 'cancel' = yoga nullified entirely; 'weaken' = strength reduced */
  effect: 'cancel' | 'weaken';
}

/**
 * A complete yoga rule definition — the central building block of the engine.
 *
 * Each yoga is defined declaratively with:
 * 1. Detection conditions (what must be true in the chart)
 * 2. Strength assessment (given it's present, how strong is it)
 * 3. Cancellation conditions (what nullifies the yoga)
 * 4. Domain mapping (which life areas it affects)
 * 5. Interpretation data (classical references, descriptions)
 *
 * Rules are pure data + pure functions — no side effects, no state.
 */
export interface YogaRule {
  /**
   * Unique identifier for this yoga.
   * Convention: lowercase-kebab, e.g. 'gajakesari', 'ruchaka', 'kaal-sarpa'
   */
  id: string;

  /** Trilingual name of the yoga */
  name: { en: string; hi: string; sa: string };

  /** Classical yoga group — determines UI grouping and chapter reference */
  group: YogaGroup;

  /** Sub-group for Nabhasa yogas (aashray, dala, akriti, sankhya) */
  subGroup?: NabhasaSubGroup;

  /** Is this yoga generally auspicious (true) or inauspicious/affliction (false)? */
  isAuspicious: boolean;

  /**
   * Classical text reference for sourcing.
   * Format: "BPHS Ch.34 v.3" or "Phaladeepika Ch.6 v.12"
   */
  classicalRef: string;

  // ── Detection ──

  /**
   * Declarative conditions for detecting this yoga.
   * For simple yogas, use atomic condition objects.
   * For complex yogas, compose with 'and'/'or' composites.
   * For yogas beyond declarative expression, use CustomCondition.
   */
  conditions: YogaCondition;

  /**
   * Strength assessment — given the yoga IS present, how strong is it?
   * Takes the context and raw detection result; returns a strength level.
   *
   * Typical strength factors:
   * - Dignity of involved planets (exalted > own > friend > neutral > enemy > debilitated)
   * - Retrograde status (can strengthen certain yogas)
   * - Combustion (always weakens)
   * - House placement (kendra > trikona > other)
   */
  assessStrength: (ctx: YogaContext, result: YogaDetectionResult) => 'Strong' | 'Moderate' | 'Weak';

  // ── Cancellation ──

  /**
   * Conditions that cancel or weaken this yoga.
   * Per BPHS: many yogas have specific cancellation rules.
   * Evaluated only when the yoga's formation conditions are met.
   */
  cancellations?: YogaCancellation[];

  // ── Domain mapping ──

  /**
   * Which life domains this yoga affects.
   * 'all' means it touches every domain (e.g. Gajakesari — general fortune).
   */
  affectedDomains: DomainType[] | 'all';

  /**
   * Impact weight on domain scoring.
   * 1 = mild influence, 2 = moderate influence, 3 = strong/defining influence.
   */
  domainImpactWeight: 1 | 2 | 3;

  // ── Interpretation ──

  /**
   * Formation rule description — shown to users explaining how this yoga forms.
   * Should be concise and use planet/house names, not IDs.
   */
  formationRule: { en: string; hi: string };

  /** Full description when yoga IS present — interpretive text for the user */
  description: { en: string; hi: string };

  /** Description when yoga is NOT present (optional — not all yogas need absence text) */
  absentDescription?: { en: string; hi: string };
}

// ─────────────────────────────────────────────────────────────────────────────
// Evaluated yoga — output format for UI and scoring
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The evaluated result for one yoga — what the UI / tippanni / domain scoring consumes.
 *
 * This is the output format, designed to be backward-compatible with the existing
 * YogaComplete interface via the `toYogaComplete()` adapter in engine.ts.
 */
export interface EvaluatedYoga {
  /** Unique yoga identifier */
  id: string;

  /** Trilingual name */
  name: { en: string; hi: string; sa: string };

  /** Classical group */
  group: YogaGroup;

  /** Sub-group for Nabhasa yogas */
  subGroup?: NabhasaSubGroup;

  /** Is this yoga auspicious? */
  isAuspicious: boolean;

  /** Is this yoga present in the chart? */
  present: boolean;

  /** Strength when present */
  strength: 'Strong' | 'Moderate' | 'Weak';

  /** Classical text reference */
  classicalRef: string;

  /** Formation rule (trilingual — sa falls back to en) */
  formationRule: LocaleText;

  /** Interpretive description (trilingual — sa falls back to en) */
  description: LocaleText;

  /** Planet IDs involved in forming this yoga */
  involvedPlanets: number[];

  /** Affected life domains */
  affectedDomains: DomainType[] | 'all';

  /** Domain impact weight (1-3) */
  domainImpactWeight: 1 | 2 | 3;

  /** Cancellation status — only present if cancellations were checked */
  cancellationStatus?: {
    /** True if any cancellation rule fired with effect='cancel' */
    anyCancelled: boolean;
    /** Individual cancellation check results */
    details: {
      cancelled: boolean;
      reason: string;
      effect: 'cancel' | 'weaken';
    }[];
  };

  /** For pattern yogas (Malika, Nabhasa Akriti) */
  patternData?: {
    startHouse?: number;
    endHouse?: number;
    chainLength?: number;
    firstPlanet?: number;
    lastPlanet?: number;
  };
}
