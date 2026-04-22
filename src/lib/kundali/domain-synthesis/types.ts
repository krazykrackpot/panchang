/**
 * Domain Synthesis Types
 *
 * TypeScript types for the Personal Pandit 8-domain life reading engine.
 * Each domain (health, wealth, career, etc.) synthesises natal promise,
 * current activations, and timeline triggers into a structured reading.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Rashi IDs: 1-based (1–12)
 */

import type { LocaleText } from '@/types/panchang';
import type { RelationshipDynamics } from '@/lib/kundali/family-synthesis/types';

// ---------------------------------------------------------------------------
// Core enumerations
// ---------------------------------------------------------------------------

/** All 8 life domains plus the current-period card. */
export type DomainType =
  | 'currentPeriod'
  | 'health'
  | 'wealth'
  | 'career'
  | 'marriage'
  | 'children'
  | 'family'
  | 'spiritual'
  | 'education';

/** Four-tier Sanskrit rating scale used across all domain scores. */
export type Rating =
  | 'uttama'    // excellent  (≥ 7.5/10)
  | 'madhyama'  // moderate   (≥ 5.0/10)
  | 'adhama'    // weak       (≥ 3.0/10)
  | 'atyadhama'; // very weak (<  3.0/10)

// ---------------------------------------------------------------------------
// Rating info
// ---------------------------------------------------------------------------

/** A fully resolved rating with score, human label and display colour. */
export interface RatingInfo {
  rating: Rating;
  /** Numeric score 0–10. */
  score: number;
  /** Translated label, e.g. "Excellent / उत्तम". */
  label: LocaleText;
  /** Tailwind-compatible CSS colour string, e.g. "#22c55e" or "var(--gold-primary)". */
  color: string;
}

// ---------------------------------------------------------------------------
// Domain weight structure
// ---------------------------------------------------------------------------

/**
 * Relative weights for the seven scoring factors that make up a domain score.
 * Values must sum to 1.0.
 */
export interface DomainWeights {
  /** Strength of the primary house(s) and their lords. */
  houseStrength: number;
  /** Quality of the primary lord's placement (house + sign). */
  lordPlacement: number;
  /** Net benefic/malefic influence from occupants and aspecters. */
  occupantsAspects: number;
  /** Relevant yogas that amplify or suppress the domain. */
  yogas: number;
  /** Relevant doshas / afflictions that weaken the domain. */
  doshas: number;
  /** Whether the current Vimshottari/Jaimini dasha activates the domain. */
  dashaActivation: number;
  /** Cross-confirmation from the relevant divisional chart(s). */
  vargaConfirmation: number;
}

// ---------------------------------------------------------------------------
// Domain configuration
// ---------------------------------------------------------------------------

/**
 * Declarative specification for one life domain.
 * Used by the synthesis engine to know which houses, planets, charts, and
 * karakas to examine — and with what relative importance.
 */
export interface DomainConfig {
  /** Unique domain identifier. */
  id: DomainType;
  /** Short display name, e.g. "Health". */
  name: LocaleText;
  /** Sanskrit / Vedic name, e.g. "Ārogya". */
  vedicName: LocaleText;
  /**
   * Icon identifier for the UI.  Matches a key in the custom SVG icon system
   * (e.g. "sun", "jupiter", "house-1").
   */
  icon: string;

  // --- House relevance ---
  /** Houses that are the primary indicators for this domain (e.g. [1, 6, 8] for health). */
  primaryHouses: number[];
  /** Supporting houses that provide secondary evidence. */
  secondaryHouses: number[];

  // --- Planet relevance ---
  /** Planet IDs that are natural karakas or strong indicators for this domain. */
  primaryPlanets: number[];

  // --- Yoga / Dosha filters ---
  /** Yoga category slugs (from the yoga engine) that are relevant to this domain. */
  relevantYogaCategories: string[];
  /** Dosha keys (e.g. "mangal_dosha", "kaal_sarpa") that affect this domain. */
  relevantDoshas: string[];

  // --- Divisional charts ---
  /** Chart IDs (e.g. ["D9", "D10"]) to include in varga cross-confirmation. */
  divisionalCharts: string[];

  // --- Jaimini ---
  /** Jaimini Karaka names relevant to this domain (e.g. ["DK", "GK"]). */
  jaiminiKarakas: string[];

  // --- Feature flags ---
  /**
   * When true the reading UI shows a "partner overlay" button that
   * blends the partner's relevant placements into the analysis.
   * Currently only meaningful for the marriage domain.
   */
  supportsPartnerOverlay?: boolean;

  // --- Scoring weights ---
  weights: DomainWeights;
}

// ---------------------------------------------------------------------------
// Natal promise block
// ---------------------------------------------------------------------------

/**
 * Encapsulates the birth-chart (D1 + divisional) promise for a domain,
 * independent of any current dasha or transit activation.
 */
export interface NatalPromiseBlock {
  /** Overall natal promise score and rating. */
  rating: RatingInfo;

  /** Key house strengths contributing to the promise (house number → 0–10 score). */
  houseScores: Record<number, number>;

  /** Dignity and placement quality of the primary lord(s). */
  lordQualities: {
    lordId: number;
    houseInD1: number;
    signInD1: number;
    /** Dignity level as text slug, e.g. "exalted", "debilitated". */
    dignity: string;
    score: number;
  }[];

  /** Yogas that strengthen the natal promise. */
  supportingYogas: {
    name: LocaleText;
    category: string;
    strength: number;
  }[];

  /** Doshas / afflictions that weaken the natal promise. */
  activeAfflictions: {
    name: LocaleText;
    severity: 'severe' | 'moderate' | 'mild';
  }[];

  /** Divisional-chart confirmation for each relevant varga. */
  vargaConfirmations: {
    chartId: string;
    score: number;
    keyInsight: LocaleText;
  }[];

  /** Narrative synthesis of the natal promise. */
  summary: LocaleText;
}

// ---------------------------------------------------------------------------
// Current activation block
// ---------------------------------------------------------------------------

/**
 * Describes how the current dasha/antardasha and active transits
 * are energising or suppressing the natal promise right now.
 */
export interface CurrentActivationBlock {
  /** Whether the current dasha sequence is activating this domain. */
  isDashaActive: boolean;

  /** Vimshottari maha-dasha lord ID. */
  mahaDashaLordId: number;
  /** Vimshottari antar-dasha lord ID. */
  antarDashaLordId: number;

  /** How strongly the dasha sequence activates this domain (0–10). */
  dashaActivationScore: number;

  /** Active transits that affect this domain. */
  transitInfluences: {
    planetId: number;
    transitHouse: number;
    /** Whether the transit is beneficial or harmful for this domain. */
    nature: 'benefic' | 'malefic' | 'neutral';
    intensity: 'high' | 'medium' | 'low';
    description: LocaleText;
  }[];

  /** Combined activation score blending dasha + transits (0–10). */
  overallActivationScore: number;

  /** Narrative summary of the current period's effect on this domain. */
  summary: LocaleText;
}

// ---------------------------------------------------------------------------
// Timeline trigger
// ---------------------------------------------------------------------------

/**
 * A predicted event window when the domain is likely to be significantly
 * activated, based on upcoming dasha transitions and major transits.
 */
export interface TimelineTrigger {
  /** ISO date string for the start of the window (YYYY-MM-DD). */
  startDate: string;
  /** ISO date string for the end of the window (YYYY-MM-DD). */
  endDate: string;
  /** What type of trigger causes this window. */
  triggerType: 'dasha_change' | 'transit' | 'dasha_transit_confluence';
  /** Planet IDs involved in the trigger. */
  planets: number[];
  /** Whether this window is a peak opportunity or a challenge period. */
  nature: 'opportunity' | 'challenge' | 'mixed';
  /** Short description of what to expect. */
  description: LocaleText;
}

// ---------------------------------------------------------------------------
// Domain remedy
// ---------------------------------------------------------------------------

/**
 * A Vedic remedy prescribed to strengthen a weak domain or mitigate an affliction.
 */
export interface DomainRemedy {
  type: 'mantra' | 'gemstone' | 'charity' | 'ritual' | 'lifestyle';
  /** Display name of the remedy. */
  name: LocaleText;
  /** Practical instructions for performing the remedy. */
  instructions: LocaleText;
  /** Planet or dosha this remedy targets. */
  targetPlanetId?: number;
  /** Approximate effort / cost level. */
  difficulty: 'easy' | 'moderate' | 'intensive';
}

// ---------------------------------------------------------------------------
// Cross-domain link
// ---------------------------------------------------------------------------

/**
 * A connection between two domains — e.g. health affecting career, or
 * marriage affecting wealth — that the narrative should surface.
 */
export interface CrossDomainLink {
  linkedDomain: DomainType;
  /** Nature of the cross-domain influence. */
  linkType: 'supports' | 'conflicts' | 'depends_on';
  explanation: LocaleText;
}

// ---------------------------------------------------------------------------
// Domain reading (the primary output object)
// ---------------------------------------------------------------------------

/**
 * Complete synthesised reading for one life domain.
 * Produced by the domain synthesis engine for a single native.
 */
export interface DomainReading {
  domain: DomainType;

  /** Overall domain score blending natal promise and current activation. */
  overallRating: RatingInfo;

  /** Natal birth-chart promise, independent of timing. */
  natalPromise: NatalPromiseBlock;

  /** Current dasha + transit activation layer. */
  currentActivation: CurrentActivationBlock;

  /** Upcoming significant windows for this domain. */
  timelineTriggers: TimelineTrigger[];

  /** Prescribed remedies. Empty array when domain is strong. */
  remedies: DomainRemedy[];

  /** Links to other domains that are meaningfully connected. */
  crossDomainLinks: CrossDomainLink[];

  /**
   * Headline sentence for display in summary cards (1–2 sentences).
   * Should be the single most important insight for this domain.
   */
  headline: LocaleText;

  /** Full multi-paragraph narrative. */
  detailedNarrative: LocaleText;

  /** Cross-chart relationship overlay. Only populated when family context exists. */
  relationshipDynamics?: RelationshipDynamics;
}

// ---------------------------------------------------------------------------
// Current-period reading (the 9th card)
// ---------------------------------------------------------------------------

/**
 * A standalone "current period" card that cuts across all domains and
 * describes what the native's overall dasha + transit moment means for them
 * right now — regardless of any specific life area.
 */
export interface CurrentPeriodReading {
  /** Maha-dasha and antar-dasha period summary. */
  dashaSummary: LocaleText;

  /** Most impactful current transits (slow planets). */
  keyTransits: {
    planetId: number;
    transitSign: number;
    transitHouse: number;
    nature: 'benefic' | 'malefic' | 'neutral';
    summary: LocaleText;
  }[];

  /** Which domains are currently "lit up" by dasha/transit activations. */
  activeDomainsNow: DomainType[];

  /** Domains that are currently under challenge or stress. */
  challengedDomainsNow: DomainType[];

  /** Overall period quality score (0–10). */
  periodScore: number;
  periodRating: RatingInfo;

  /** 3–5 sentence narrative of what this period means for the native. */
  summary: LocaleText;
}

// ---------------------------------------------------------------------------
// Personal reading (top-level container)
// ---------------------------------------------------------------------------

/**
 * The complete Personal Pandit output for one native.
 * Contains 8 domain readings + 1 current-period card.
 */
export interface PersonalReading {
  /** Kundali ID this reading belongs to. */
  kundaliId: string;

  /** ISO timestamp when this reading was computed. */
  computedAt: string;

  /** The 8 life-domain readings, in display order. */
  domains: DomainReading[];

  /** The current-period cross-domain card. */
  currentPeriod: CurrentPeriodReading;

  /**
   * A single most-important insight across all domains right now.
   * Displayed as the hero headline on the Personal Pandit page.
   */
  topInsight: LocaleText;
}
