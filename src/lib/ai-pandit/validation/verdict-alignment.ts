/**
 * Layer 1 — Verdict Alignment
 *
 * Ensures the LLM's narrative tone matches the engine's pre-computed verdict.
 * Bilingual: detects sentiment markers in both English and Hindi.
 *
 * Issue 10 from design review: negation-aware — "not favourable" counts as
 * negative, not positive. Negated phrases are checked first and removed
 * before counting bare positives.
 */

import type { Verdict, ValidationResult, ValidationFailure } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Negated phrases (checked FIRST, counted as opposite sentiment)
// ─────────────────────────────────────────────────────────────────────────────

const NEGATED_POSITIVE_EN = [
  'not favourable', 'not auspicious', 'not ideal', 'not excellent',
  'not prosperous', 'not beneficial', 'not supportive', 'no longer favourable',
];

const NEGATED_POSITIVE_HI = [
  'शुभ नहीं', 'अनुकूल नहीं', 'उत्तम नहीं', 'लाभकारी नहीं',
];

// ─────────────────────────────────────────────────────────────────────────────
// Positive markers
// ─────────────────────────────────────────────────────────────────────────────

const POSITIVE_MARKERS_EN = [
  'excellent', 'auspicious', 'blessed', 'strong period', 'favourable',
  'fortunate', 'highly positive', 'wonderful', 'promising', 'thriving',
  'prosperous', 'ideal', 'rewarding', 'beneficial', 'supportive',
  'great time', 'best period', 'golden phase',
];

const POSITIVE_MARKERS_HI = [
  'शुभ', 'उत्तम', 'अनुकूल', 'प्रबल', 'मंगलकारी', 'अत्यंत शुभ',
  'भाग्यशाली', 'सौभाग्यपूर्ण', 'लाभकारी', 'समृद्ध', 'उन्नति',
  'सर्वश्रेष्ठ', 'उत्कृष्ट', 'प्रगतिशील', 'सफल',
];

// ─────────────────────────────────────────────────────────────────────────────
// Negative markers
// ─────────────────────────────────────────────────────────────────────────────

const NEGATIVE_MARKERS_EN = [
  'challenging', 'difficult', 'caution', 'obstacle', 'delay',
  'setback', 'avoid', 'unfavourable', 'struggle', 'hardship',
  'adversity', 'troubled', 'stressful', 'crisis', 'danger',
  'critical period', 'testing time',
];

const NEGATIVE_MARKERS_HI = [
  'कठिन', 'चुनौतीपूर्ण', 'सावधानी', 'बाधा', 'विलम्ब',
  'अशुभ', 'प्रतिकूल', 'कष्ट', 'संघर्ष', 'विपत्ति',
  'परेशानी', 'तनाव', 'संकट', 'खतरा', 'कठिनाई',
];

// ─────────────────────────────────────────────────────────────────────────────
// Verdict → allowed sentiment ratio range
// ─────────────────────────────────────────────────────────────────────────────

const VERDICT_THRESHOLDS: Record<Verdict, { min: number; max: number }> = {
  FAVOURABLE:   { min: 0.45, max: 1.0 },
  MIXED:        { min: 0.20, max: 0.75 },
  CAUTION:      { min: 0.0,  max: 0.55 },
  CHALLENGING:  { min: 0.0,  max: 0.35 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Scoring
// ─────────────────────────────────────────────────────────────────────────────

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface SentimentScore {
  positiveCount: number;
  negativeCount: number;
  ratio: number;
}

export function scoreSentiment(narrative: string): SentimentScore {
  let text = narrative;
  let positiveCount = 0;
  let negativeCount = 0;

  // Step 1: Count and remove negated positive phrases (they're negative)
  for (const phrase of [...NEGATED_POSITIVE_EN, ...NEGATED_POSITIVE_HI]) {
    const regex = new RegExp(escapeRegex(phrase), 'gi');
    const matches = text.match(regex);
    if (matches) {
      negativeCount += matches.length;
      text = text.replace(regex, '___NEGATED___'); // Remove so bare positive doesn't re-match
    }
  }

  // Step 2: Count positive markers in remaining text
  for (const marker of [...POSITIVE_MARKERS_EN, ...POSITIVE_MARKERS_HI]) {
    const regex = new RegExp(escapeRegex(marker), 'gi');
    const matches = text.match(regex);
    if (matches) positiveCount += matches.length;
  }

  // Step 3: Count negative markers
  for (const marker of [...NEGATIVE_MARKERS_EN, ...NEGATIVE_MARKERS_HI]) {
    const regex = new RegExp(escapeRegex(marker), 'gi');
    const matches = narrative.match(regex); // Use original text (negation removal doesn't affect negatives)
    if (matches) negativeCount += matches.length;
  }

  const ratio = positiveCount / (positiveCount + negativeCount + 1);

  return { positiveCount, negativeCount, ratio };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main check
// ─────────────────────────────────────────────────────────────────────────────

export function checkVerdictAlignment(
  narrative: string,
  verdict: Verdict,
): ValidationResult {
  const start = Date.now();
  const sentiment = scoreSentiment(narrative);
  const threshold = VERDICT_THRESHOLDS[verdict];

  const passed = sentiment.ratio >= threshold.min && sentiment.ratio <= threshold.max;

  const failures: ValidationFailure[] = [];
  if (!passed) {
    const tooPositive = sentiment.ratio > threshold.max;
    failures.push({
      layer: 'verdict_alignment',
      message: tooPositive
        ? `Narrative too positive (ratio ${sentiment.ratio.toFixed(2)}) for ${verdict} verdict (max ${threshold.max})`
        : `Narrative too negative (ratio ${sentiment.ratio.toFixed(2)}) for ${verdict} verdict (min ${threshold.min})`,
      evidence: `Positive: ${sentiment.positiveCount}, Negative: ${sentiment.negativeCount}`,
      fixable: false,
    });
  }

  return { passed, failures, warnings: [], durationMs: Date.now() - start };
}
