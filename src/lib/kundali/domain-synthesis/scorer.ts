/**
 * Domain Scorer — Rule-Based Tier Determination with Factor Breakdown
 *
 * Assigns one of four Sanskrit tiers (Uttama / Madhyama / Adhama / Atyadhama)
 * based on classical Jyotish rules. Each factor is recorded so the UI can
 * show the user exactly how the verdict was reached.
 *
 * Classical logic (BPHS-aligned):
 * 1. Lord dignity + placement → base tier
 * 2. Shadbala strength → can modify ±1 tier
 * 3. Baladi avastha (mrita/bala pull down, yuva pushes up)
 * 4. Benefic/malefic house influence → ±1 tier
 * 5. Yogas and doshas (domain-filtered) → ±1 tier each
 */

import type { DignityLevel } from '@/lib/tippanni/varga-tippanni-types-v2';
import type { DomainConfig, Rating, RatingInfo, ScoringFactor } from './types';

// ---------------------------------------------------------------------------
// Scorer input
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
  /** Shadbala strength ratio (total / minimum required). ≥1.0 = adequate, >1.5 = strong, <0.8 = weak. 0 = not available. */
  lordShadBalaRatio: number;
  /** Baladi avastha strength of the lord (0–100). yuva=100, kumara=40, vriddha=50, bala=20, mrita=5. 0 = not available. */
  lordBaladiStrength: number;
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

const TIER_SCORES: Record<Rating, number> = {
  uttama: 8.5,
  madhyama: 6.0,
  adhama: 3.5,
  atyadhama: 1.5,
};

// ---------------------------------------------------------------------------
// Dignity labels
// ---------------------------------------------------------------------------

const DIGNITY_LABELS: Record<DignityLevel, { en: string; hi: string; verdict: 'positive' | 'neutral' | 'negative' }> = {
  exalted:     { en: 'Exalted',       hi: 'उच्च',       verdict: 'positive' },
  own:         { en: 'Own Sign',      hi: 'स्वराशि',    verdict: 'positive' },
  friend:      { en: "Friend's Sign", hi: 'मित्र राशि', verdict: 'neutral' },
  neutral:     { en: 'Neutral Sign',  hi: 'सम राशि',    verdict: 'neutral' },
  enemy:       { en: 'Enemy Sign',    hi: 'शत्रु राशि', verdict: 'negative' },
  debilitated: { en: 'Debilitated',   hi: 'नीच',        verdict: 'negative' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type DignityTier = 'strong' | 'moderate' | 'weak' | 'afflicted';

function classifyDignity(dignity: DignityLevel, inKendra: boolean): DignityTier {
  if (dignity === 'exalted') return 'strong';
  // Own sign (Swakshetra) is inherently strong per BPHS
  if (dignity === 'own') return 'strong';
  if (dignity === 'friend') return inKendra ? 'strong' : 'moderate';
  if (dignity === 'neutral') return 'moderate';
  if (dignity === 'enemy') return 'weak';
  return 'afflicted';
}

function classifyHouseInfluence(input: ScorerInput): 'benefic' | 'neutral' | 'malefic' {
  const b = input.beneficOccupants + input.beneficAspects * 0.7;
  const m = input.maleficOccupants + input.maleficAspects * 0.7;
  if (b > m + 0.5) return 'benefic';
  if (m > b + 0.5) return 'malefic';
  return 'neutral';
}

function baladiStateName(strength: number): string {
  if (strength >= 90) return 'Yuva (Adult)';
  if (strength >= 45) return 'Vriddha (Old)';
  if (strength >= 35) return 'Kumara (Youth)';
  if (strength >= 15) return 'Bala (Infant)';
  return 'Mrita (Dead)';
}

// ---------------------------------------------------------------------------
// Main scorer
// ---------------------------------------------------------------------------

export function scoreDomain(
  _config: DomainConfig,
  input: ScorerInput,
): RatingInfo {
  const tiers: Rating[] = ['atyadhama', 'adhama', 'madhyama', 'uttama'];
  const factors: ScoringFactor[] = [];

  // ── Step 1: Lord dignity → base tier ──
  const dignityTier = classifyDignity(input.lordDignity, input.lordInKendra);
  let tierIndex = dignityTier === 'strong' ? 3
    : dignityTier === 'moderate' ? 2
    : dignityTier === 'weak' ? 1
    : 0;

  const dl = DIGNITY_LABELS[input.lordDignity];
  const kendraNote = input.lordInKendra ? ' + Kendra' : '';
  factors.push({ label: { en: 'Lord Dignity', hi: 'ग्रह गरिमा' }, verdict: dl.verdict, value: `${dl.en}${kendraNote}` });

  // ── Step 2: Shadbala → ±1 tier ──
  if (input.lordShadBalaRatio > 0) {
    const r = input.lordShadBalaRatio;
    if (r >= 1.5) {
      tierIndex = Math.min(3, tierIndex + 1);
      factors.push({ label: { en: 'Shadbala', hi: 'षड्बल' }, verdict: 'positive', value: 'Very strong' });
    } else if (r >= 1.0) {
      factors.push({ label: { en: 'Shadbala', hi: 'षड्बल' }, verdict: 'positive', value: 'Adequate' });
    } else if (r >= 0.8) {
      factors.push({ label: { en: 'Shadbala', hi: 'षड्बल' }, verdict: 'neutral', value: 'Below average' });
    } else {
      tierIndex = Math.max(0, tierIndex - 1);
      factors.push({ label: { en: 'Shadbala', hi: 'षड्बल' }, verdict: 'negative', value: 'Weak' });
    }
  }

  // ── Step 3: Baladi Avastha → mrita downgrades harshly, yuva upgrades ──
  if (input.lordBaladiStrength > 0) {
    const s = input.lordBaladiStrength;
    const name = baladiStateName(s);
    if (s >= 90) {
      if (tierIndex < 3) tierIndex = Math.min(3, tierIndex + 1);
      factors.push({ label: { en: 'Avastha', hi: 'अवस्था' }, verdict: 'positive', value: name });
    } else if (s <= 10) {
      tierIndex = Math.max(0, tierIndex - 2); // Mrita — severe
      factors.push({ label: { en: 'Avastha', hi: 'अवस्था' }, verdict: 'negative', value: name });
    } else if (s <= 25) {
      tierIndex = Math.max(0, tierIndex - 1);
      factors.push({ label: { en: 'Avastha', hi: 'अवस्था' }, verdict: 'negative', value: name });
    } else {
      factors.push({ label: { en: 'Avastha', hi: 'अवस्था' }, verdict: 'neutral', value: name });
    }
  }

  // ── Step 4: House influence → ±1 tier ──
  const hi = classifyHouseInfluence(input);
  if (hi === 'benefic') {
    tierIndex = Math.min(3, tierIndex + 1);
    factors.push({ label: { en: 'House Influence', hi: 'भाव प्रभाव' }, verdict: 'positive', value: 'Benefic influence' });
  } else if (hi === 'malefic') {
    tierIndex = Math.max(0, tierIndex - 1);
    factors.push({ label: { en: 'House Influence', hi: 'भाव प्रभाव' }, verdict: 'negative', value: 'Malefic influence' });
  }

  // ── Step 5: Yogas/Doshas → ±1 each (doshas are already domain-filtered) ──
  const activeDoshas = input.relevantDoshaCount - input.cancelledDoshas;
  if (input.relevantYogaCount >= 2) {
    tierIndex = Math.min(3, tierIndex + 1);
    factors.push({ label: { en: 'Yogas', hi: 'योग' }, verdict: 'positive', value: 'Multiple yogas active' });
  } else if (input.relevantYogaCount === 1) {
    factors.push({ label: { en: 'Yogas', hi: 'योग' }, verdict: 'positive', value: 'Yoga active' });
  }
  if (activeDoshas >= 2) {
    tierIndex = Math.max(0, tierIndex - 1);
    factors.push({ label: { en: 'Doshas', hi: 'दोष' }, verdict: 'negative', value: 'Multiple doshas active' });
  } else if (activeDoshas === 1) {
    factors.push({ label: { en: 'Doshas', hi: 'दोष' }, verdict: 'negative', value: 'Dosha active' });
  }

  // ── Resolve ──
  const rating = tiers[tierIndex];
  let score = TIER_SCORES[rating];
  if (input.lordInKendra) score += 0.4;
  if (input.dashaActivatesHouse) score += 0.5;
  if (input.vargaDeliveryScore > 60) score += 0.3;
  if (input.vargaDeliveryScore < 30 && input.vargaDeliveryScore > 0) score -= 0.3;
  if (input.houseBhavabala > 6) score += 0.2;

  const rounded = Math.round(Math.max(0, Math.min(10, score)) * 10) / 10;
  const template = RATING_TEMPLATES[rating];

  return {
    rating: template.rating,
    score: rounded,
    label: template.label,
    color: template.color,
    factors,
  };
}
