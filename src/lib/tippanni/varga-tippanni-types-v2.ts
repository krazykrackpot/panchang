/**
 * Varga Deep Analysis Types v2
 *
 * TypeScript types for the Personal Pandit deep divisional chart engine.
 * All narrative fields use LocaleText for multilingual support.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Rashi IDs: 1-based (1–12)
 */

import type { LocaleText } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Domain classification
// ---------------------------------------------------------------------------

export type VargaDomain =
  | 'marriage'
  | 'career'
  | 'children'
  | 'wealth'
  | 'spiritual'
  | 'health'
  | 'family'
  | 'education';

/** Maps divisional chart IDs to the domain(s) they govern. */
export const CHART_DOMAIN_MAP: Record<string, VargaDomain | VargaDomain[]> = {
  D9: 'marriage',
  D10: 'career',
  D7: 'children',
  D2: 'wealth',
  D4: ['wealth', 'family'],
  D12: 'family',
  D20: 'spiritual',
  D24: 'education',
  D30: 'health',
  D60: 'spiritual',
} as const;

// ---------------------------------------------------------------------------
// Dignity
// ---------------------------------------------------------------------------

export type DignityLevel =
  | 'exalted'
  | 'own'
  | 'friend'
  | 'neutral'
  | 'enemy'
  | 'debilitated';

/**
 * Comparison of a planet's dignity between D1 (Rasi) and a divisional chart.
 * Used to assess whether planetary strength improves or declines in a varga.
 */
export interface DignityShift {
  planetId: number;
  planetName: LocaleText;
  d1Sign: number;
  dxxSign: number;
  d1Dignity: DignityLevel;
  dxxDignity: DignityLevel;
  /** Net direction of dignity change in the divisional chart vs D1. */
  shift: 'improved' | 'same' | 'declined' | 'mixed';
  /** True when D1 sign === Dxx sign (Vargottama condition). */
  isVargottama: boolean;
  narrative: LocaleText;
}

// ---------------------------------------------------------------------------
// Pushkara
// ---------------------------------------------------------------------------

/**
 * Checks whether a planet occupies a Pushkara Navamsha or Pushkara Bhaga degree,
 * both of which confer exceptional benefic strength.
 */
export interface PushkaraCheck {
  planetId: number;
  isPushkaraNavamsha: boolean;
  isPushkaraBhaga: boolean;
  /** Exact degree of the planet within its sign (0–29.999…). */
  degree: number;
}

// ---------------------------------------------------------------------------
// Gandanta
// ---------------------------------------------------------------------------

/**
 * Identifies planets placed at a Gandanta junction (water→fire sign cusp),
 * which is considered a zone of karmic stress.
 */
export interface GandantaCheck {
  planetId: number;
  isGandanta: boolean;
  severity: 'severe' | 'moderate' | 'mild' | 'none';
  /** How many degrees the planet is from the exact junction point. */
  proximityDegrees: number;
  /** Human-readable description of the specific junction (e.g. "Pisces–Aries"). */
  junction: string;
}

// ---------------------------------------------------------------------------
// Varga Visesha (special dignities in Shad-Varga / Sapta-Varga)
// ---------------------------------------------------------------------------

export type VargaVisesha =
  | 'parijatamsha'
  | 'uttamamsha'
  | 'gopuramsha'
  | 'simhasanamsha'
  | 'paravatamsha'
  | 'devalokamsha'
  | 'none';

// ---------------------------------------------------------------------------
// Promise vs Delivery scoring
// ---------------------------------------------------------------------------

/**
 * Compares the natal (D1) promise for a domain with the divisional chart's
 * delivery potential, yielding a verdict string and score pair.
 */
export interface PromiseDeliveryScore {
  /** D1 natal promise score, 0–100. */
  d1Promise: number;
  /** Divisional chart delivery score, 0–100. */
  dxxDelivery: number;
  /** i18n key for the verdict label (e.g. "strong_promise_strong_delivery"). */
  verdictKey: string;
  verdict: LocaleText;
}

// ---------------------------------------------------------------------------
// Dispositor chain
// ---------------------------------------------------------------------------

/** A single node in a planetary dispositor chain. */
export interface DispositorNode {
  planetId: number;
  sign: number;
}

/**
 * Traces the dispositor chain for the chart's most important planet
 * (usually the lagna lord or the relevant karaka) until it reaches
 * a self-disposed planet or a circular loop.
 */
export interface DispositorChain {
  chain: DispositorNode[];
  /** Planet ID of the final dispositor, or null if the chain is circular. */
  finalDispositor: number | null;
  isCircular: boolean;
  narrative: LocaleText;
}

// ---------------------------------------------------------------------------
// Parivartana (mutual sign exchange)
// ---------------------------------------------------------------------------

/** A Parivartana yoga between two planets in a divisional chart. */
export interface Parivartana {
  planet1Id: number;
  planet2Id: number;
  sign1: number;
  sign2: number;
  significance: LocaleText;
}

// ---------------------------------------------------------------------------
// Cross-Correlation — the comprehensive varga overlay object
// ---------------------------------------------------------------------------

export interface CrossCorrelation {
  /** Dignity comparisons for each planet between D1 and this varga. */
  dignityShifts: DignityShift[];

  /** Planet IDs that are Vargottama (same sign in D1 and this varga). */
  vargottamaPlanets: number[];

  /** Pushkara status for each planet. */
  pushkaraChecks: PushkaraCheck[];

  /** Gandanta proximity for each planet. */
  gandantaChecks: GandantaCheck[];

  /** Special Varga Visesha classification per planet. */
  vargaVisesha: { planetId: number; classification: VargaVisesha }[];

  /**
   * Lords of key houses in this varga (typically 1st, relevant domain house,
   * and 5th/9th), with dignity and narrative commentary.
   */
  keyHouseLords: {
    house: number;
    lordId: number;
    lordSign: number;
    lordDignity: DignityLevel;
    narrative: LocaleText;
  }[];

  /**
   * Jaimini Karakas relevant to this varga's domain, mapped to their
   * current sign and house placement.
   */
  jaiminiKarakas: {
    karaka: string;
    planetId: number;
    sign: number;
    house: number;
    narrative: LocaleText;
  }[];

  /**
   * Argala (intervention) analysis on key houses — which planets support
   * or obstruct the flow of energy to those houses.
   */
  argalaOnKeyHouses: {
    house: number;
    supporting: number[];
    obstructing: number[];
  }[];

  /**
   * Sarvashtakavarga overlay for the relevant signs, indicating cumulative
   * benefic point strength.
   */
  savOverlay: {
    sign: number;
    bindus: number;
    quality: 'strong' | 'average' | 'weak';
  }[];

  /**
   * Current dasha lord's placement in this divisional chart.
   * Null when no dasha is active or calculation data is unavailable.
   */
  dashaLordPlacement: {
    lordId: number;
    sign: number;
    house: number;
    dignity: DignityLevel;
    narrative: LocaleText;
  } | null;

  /** Notable yogas formed within this divisional chart. */
  yogasInChart: {
    name: string;
    planets: number[];
    significance: LocaleText;
  }[];

  /** Planetary aspects received by key houses in this varga. */
  aspectsOnKeyHouses: {
    house: number;
    aspectingPlanets: { id: number; type: 'benefic' | 'malefic' }[];
  }[];

  /** Parivartana (sign-exchange) yogas present in this divisional chart. */
  parivartanas: Parivartana[];

  /** Full dispositor chain for the primary karaka in this varga. */
  dispositorChain: DispositorChain;
}

// ---------------------------------------------------------------------------
// Top-level result object
// ---------------------------------------------------------------------------

/**
 * Complete deep analysis result for a single divisional chart.
 * One `DeepVargaResult` is produced per chart analysed (D9, D10, …).
 */
export interface DeepVargaResult {
  /** Chart identifier, e.g. "D9", "D10". */
  chartId: string;
  domain: VargaDomain;
  crossCorrelation: CrossCorrelation;
  promiseDelivery: PromiseDeliveryScore;
  /** High-level narrative synthesis for the entire chart analysis. */
  narrative: LocaleText;
}
