/**
 * Domain Scorer — Rule-Based Tier Determination
 *
 * Assigns one of four Sanskrit tiers (Uttama / Madhyama / Adhama / Atyadhama)
 * based on classical Jyotish rules rather than weighted composite arithmetic.
 *
 * Classical logic (BPHS-aligned):
 * 1. The lord's dignity and placement is THE primary determinant
 * 2. Benefic/malefic influence on the house modifies up or down by one tier
 * 3. Active doshas pull down; relevant yogas push up
 * 4. Varga confirmation and dasha are tiebreakers, not primary factors
 *
 * No numerical score is shown to the user — only the qualitative tier and
 * its label. An internal score is kept for sorting domains by strength.
 */

import type { DignityLevel } from '@/lib/tippanni/varga-tippanni-types-v2';
import type { DomainConfig, Rating, RatingInfo } from './types';

// ---------------------------------------------------------------------------
// Scorer input (unchanged interface for compatibility)
// ---------------------------------------------------------------------------

export interface ScorerInput {
  houseBhavabala: number;
  lordDignity: DignityLevel;
  lordInKendra: boolean;
  beneficOccupants: number;
  maleficOccupants: number;
  beneficAspects: number;
  maleficAspects: number;
  relevantYogaCount: number;
  relevantDoshaCount: number;
  cancelledDoshas: number;
  dashaActivatesHouse: boolean;
  vargaDeliveryScore: number;
}

// ---------------------------------------------------------------------------
// Rating templates
// ---------------------------------------------------------------------------

interface RatingTemplate {
  rating: Rating;
  label: { en: string; hi: string };
  color: string;
}

const RATING_TEMPLATES: Record<Rating, RatingTemplate> = {
  uttama:    { rating: 'uttama',    label: { en: 'Strong (Uttama)',      hi: 'प्रबल (उत्तम)' },       color: 'text-emerald-400' },
  madhyama:  { rating: 'madhyama',  label: { en: 'Moderate (Madhyama)',  hi: 'मध्यम (मध्यम)' },       color: 'text-gold-primary' },
  adhama:    { rating: 'adhama',    label: { en: 'Challenging (Adhama)', hi: 'चुनौतीपूर्ण (अधम)' },    color: 'text-amber-400' },
  atyadhama: { rating: 'atyadhama', label: { en: 'Critical (Atyadhama)', hi: 'गंभीर (अत्यधम)' },      color: 'text-red-400' },
};

// Internal scores for sorting (not shown to user)
const TIER_SCORES: Record<Rating, number> = {
  uttama: 8.5,
  madhyama: 6.0,
  adhama: 3.5,
  atyadhama: 1.5,
};

// ---------------------------------------------------------------------------
// Dignity classification
// ---------------------------------------------------------------------------

type DignityTier = 'strong' | 'moderate' | 'weak' | 'afflicted';

function classifyDignity(dignity: DignityLevel, inKendra: boolean): DignityTier {
  // Exalted or own sign = strong foundation
  if (dignity === 'exalted') return 'strong';
  if (dignity === 'own') return inKendra ? 'strong' : 'moderate';
  // Friend sign = moderate; neutral = moderate but weaker
  if (dignity === 'friend') return inKendra ? 'moderate' : 'moderate';
  if (dignity === 'neutral') return 'moderate';
  // Enemy sign = weak
  if (dignity === 'enemy') return 'weak';
  // Debilitated = afflicted
  return 'afflicted';
}

// ---------------------------------------------------------------------------
// House influence classification
// ---------------------------------------------------------------------------

type HouseInfluence = 'benefic' | 'neutral' | 'malefic';

function classifyHouseInfluence(input: ScorerInput): HouseInfluence {
  const beneficScore = input.beneficOccupants + input.beneficAspects * 0.7;
  const maleficScore = input.maleficOccupants + input.maleficAspects * 0.7;

  if (beneficScore > maleficScore + 0.5) return 'benefic';
  if (maleficScore > beneficScore + 0.5) return 'malefic';
  return 'neutral';
}

// ---------------------------------------------------------------------------
// Main scorer — rule-based tier determination
// ---------------------------------------------------------------------------

/**
 * Determines the domain tier using classical Jyotish logic:
 *
 * Step 1: Lord dignity sets the BASE tier
 *   - strong dignity (exalted, own+kendra) → Uttama
 *   - moderate dignity (own, friend, neutral) → Madhyama
 *   - weak dignity (enemy) → Adhama
 *   - afflicted dignity (debilitated) → Atyadhama
 *
 * Step 2: House influence MODIFIES by ±1 tier
 *   - benefic occupants/aspects → upgrade one tier (max Uttama)
 *   - malefic occupants/aspects → downgrade one tier (min Atyadhama)
 *   - neutral → no change
 *
 * Step 3: Yogas and Doshas MODIFY by ±1 tier
 *   - 2+ relevant yogas present → upgrade one tier
 *   - 2+ active doshas → downgrade one tier
 *   - Both cancel out
 *
 * Step 4: Tiebreakers (only apply at tier boundaries)
 *   - Dasha activation of the house lord → slight upgrade within tier
 *   - Varga confirmation strong (>60) → slight upgrade within tier
 */
export function scoreDomain(
  _config: DomainConfig,
  input: ScorerInput,
): RatingInfo {
  const tiers: Rating[] = ['atyadhama', 'adhama', 'madhyama', 'uttama'];

  // Step 1: Base tier from lord dignity
  const dignityTier = classifyDignity(input.lordDignity, input.lordInKendra);
  let tierIndex = dignityTier === 'strong' ? 3
    : dignityTier === 'moderate' ? 2
    : dignityTier === 'weak' ? 1
    : 0;

  // Step 2: House influence modifies ±1
  const houseInfluence = classifyHouseInfluence(input);
  if (houseInfluence === 'benefic') tierIndex = Math.min(3, tierIndex + 1);
  if (houseInfluence === 'malefic') tierIndex = Math.max(0, tierIndex - 1);

  // Step 3: Yogas upgrade, doshas downgrade (±1 each, net effect)
  const activeDoshas = input.relevantDoshaCount - input.cancelledDoshas;
  const yogaBoost = input.relevantYogaCount >= 2 ? 1 : 0;
  const doshaPenalty = activeDoshas >= 2 ? 1 : 0;
  tierIndex = Math.min(3, Math.max(0, tierIndex + yogaBoost - doshaPenalty));

  const rating = tiers[tierIndex];

  // Step 4: Internal score for sorting — tiebreakers refine within the tier
  let score = TIER_SCORES[rating];
  // Kendra placement: +0.4 (lord in angular house is always better)
  if (input.lordInKendra) score += 0.4;
  // Dasha activation: +0.5 within tier
  if (input.dashaActivatesHouse) score += 0.5;
  // Strong varga confirmation: +0.3
  if (input.vargaDeliveryScore > 60) score += 0.3;
  // Weak varga: -0.3
  if (input.vargaDeliveryScore < 30 && input.vargaDeliveryScore > 0) score -= 0.3;
  // Strong bhavabala: +0.2
  if (input.houseBhavabala > 6) score += 0.2;

  const rounded = Math.round(Math.max(0, Math.min(10, score)) * 10) / 10;
  const template = RATING_TEMPLATES[rating];

  return {
    rating: template.rating,
    score: rounded,
    label: template.label,
    color: template.color,
  };
}
