/**
 * Domain Scorer
 *
 * Computes a weighted composite score for a life domain based on
 * seven astrological factors, then maps it to a four-tier Sanskrit rating.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

import type { DignityLevel } from '@/lib/tippanni/varga-tippanni-types-v2';
import type { DomainConfig, Rating, RatingInfo } from './types';

// ---------------------------------------------------------------------------
// Scorer input
// ---------------------------------------------------------------------------

/** All the signals the scorer needs to evaluate one domain. */
export interface ScorerInput {
  /** Bhavabala strength of the primary house, normalised 0–10. */
  houseBhavabala: number;
  /** Dignity of the primary lord in the rasi chart. */
  lordDignity: DignityLevel;
  /** Whether the primary lord is placed in a kendra (1, 4, 7, 10). */
  lordInKendra: boolean;
  /** Number of natural benefics occupying the primary house(s). */
  beneficOccupants: number;
  /** Number of natural malefics occupying the primary house(s). */
  maleficOccupants: number;
  /** Number of benefic aspects on the primary house(s). */
  beneficAspects: number;
  /** Number of malefic aspects on the primary house(s). */
  maleficAspects: number;
  /** Count of relevant yogas active for this domain. */
  relevantYogaCount: number;
  /** Count of relevant doshas present for this domain. */
  relevantDoshaCount: number;
  /** How many of those doshas are cancelled by counteracting factors. */
  cancelledDoshas: number;
  /** Whether the current dasha sequence activates this domain's houses. */
  dashaActivatesHouse: boolean;
  /** Cross-confirmation score from the relevant divisional chart(s), 0–100. */
  vargaDeliveryScore: number;
}

// ---------------------------------------------------------------------------
// Dignity → numeric score mapping
// ---------------------------------------------------------------------------

const DIGNITY_SCORES: Record<DignityLevel, number> = {
  exalted: 10,
  own: 8,
  friend: 6,
  neutral: 5,
  enemy: 3,
  debilitated: 1,
};

// ---------------------------------------------------------------------------
// Rating thresholds and labels
// ---------------------------------------------------------------------------

interface RatingTemplate {
  rating: Rating;
  label: { en: string; hi: string };
  color: string;
}

const RATING_TEMPLATES: RatingTemplate[] = [
  { rating: 'uttama',     label: { en: 'Strong (Uttama)',        hi: 'प्रबल (उत्तम)' },       color: 'text-emerald-400' },
  { rating: 'madhyama',   label: { en: 'Moderate (Madhyama)',    hi: 'मध्यम (मध्यम)' },       color: 'text-gold-primary' },
  { rating: 'adhama',     label: { en: 'Challenging (Adhama)',   hi: 'चुनौतीपूर्ण (अधम)' },    color: 'text-amber-400' },
  { rating: 'atyadhama',  label: { en: 'Critical (Atyadhama)',   hi: 'गंभीर (अत्यधम)' },      color: 'text-red-400' },
];

function getRatingTemplate(score: number): RatingTemplate {
  if (score >= 7.5) return RATING_TEMPLATES[0]; // uttama
  if (score >= 5.0) return RATING_TEMPLATES[1]; // madhyama
  if (score >= 3.0) return RATING_TEMPLATES[2]; // adhama
  return RATING_TEMPLATES[3]; // atyadhama
}

// ---------------------------------------------------------------------------
// Individual factor scorers (each returns 0–10)
// ---------------------------------------------------------------------------

function scoreHouseStrength(input: ScorerInput): number {
  return input.houseBhavabala;
}

function scoreLordPlacement(input: ScorerInput): number {
  const base = DIGNITY_SCORES[input.lordDignity];
  const kendraBonus = input.lordInKendra ? 2 : 0;
  return Math.min(10, base + kendraBonus);
}

function scoreOccupantsAspects(input: ScorerInput): number {
  const raw =
    5 +
    input.beneficOccupants * 2.5 -
    input.maleficOccupants * 2 +
    input.beneficAspects * 1.5 -
    input.maleficAspects * 1.5;
  return Math.max(0, Math.min(10, raw));
}

function scoreYogas(input: ScorerInput): number {
  return Math.min(10, input.relevantYogaCount * 3);
}

function scoreDoshas(input: ScorerInput): number {
  const activeDoshas = input.relevantDoshaCount - input.cancelledDoshas;
  return Math.max(0, 10 - activeDoshas * 3);
}

function scoreDashaActivation(input: ScorerInput): number {
  return input.dashaActivatesHouse ? 8 : 4;
}

function scoreVargaConfirmation(input: ScorerInput): number {
  return input.vargaDeliveryScore / 10;
}

// ---------------------------------------------------------------------------
// Main scorer
// ---------------------------------------------------------------------------

/**
 * Computes a weighted composite score for a life domain and returns a
 * fully resolved `RatingInfo` with rating tier, numeric score, label and colour.
 */
export function scoreDomain(
  config: DomainConfig,
  input: ScorerInput,
): RatingInfo {
  const w = config.weights;

  const composite =
    w.houseStrength     * scoreHouseStrength(input) +
    w.lordPlacement     * scoreLordPlacement(input) +
    w.occupantsAspects  * scoreOccupantsAspects(input) +
    w.yogas             * scoreYogas(input) +
    w.doshas            * scoreDoshas(input) +
    w.dashaActivation   * scoreDashaActivation(input) +
    w.vargaConfirmation * scoreVargaConfirmation(input);

  const clamped = Math.max(0, Math.min(10, composite));
  const rounded = Math.round(clamped * 10) / 10;

  const template = getRatingTemplate(rounded);

  return {
    rating: template.rating,
    score: rounded,
    label: template.label,
    color: template.color,
  };
}
