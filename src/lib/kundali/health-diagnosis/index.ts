// src/lib/kundali/health-diagnosis/index.ts
//
// Task C4 — Main entry point for the Health Diagnosis Engine.
//
// Composes all three layers and the cross-reference modules into a single
// HealthDiagnosis object.
//
// Per spec §8 output contract:
//   natalElements      — Layer 1 natal baseline (19 or 22 elements)
//   prakriti           — Layer 2 constitutional overlay
//   modeNote           — Layer 2 interpretive note
//   currentMultipliers — Layer 3 per-element multipliers
//   displayedElements  — Layer 3 combined scores (clamped public surface)
//   overall            — Backward-compatible single Rating for existing consumers
//   bodyMap            — Cross-reference: src/lib/medical/body-map
//   diseaseProfile     — Cross-reference: src/lib/medical/disease-profile
//   timeline           — Cross-reference: src/lib/medical/health-timeline
//   disclaimers        — Vedic-framing disclaimers for gated elements
//   optedInToExtended  — Reflects caller's extended option
//   hiddenElements     — Elements not scored (due to extended: false)
//
// Architecture note (spec §10 Q4):
//   The src/lib/medical/* modules remain in place. This engine imports their
//   outputs as cross-references. They are NOT duplicated or replaced.
//   Phase E will reorganise the directory structure once consumers migrate.
//
// Public API:
//   computeHealthDiagnosis(kundali, options?) → HealthDiagnosis

import type { KundaliData } from '@/types/kundali';
import type { HealthDiagnosis, HealthDiagnosisOptions, ElementId } from './types';
import type { Rating } from '@/lib/kundali/domain-synthesis/types';
import type { BodyRegionResult } from '@/lib/medical/body-map';
import type { DiseaseProfileResult } from '@/lib/medical/disease-profile';
import type { HealthWindow } from '@/lib/medical/health-timeline';

import { composeLayer1 } from './layer-1-natal';
import { composeLayer2 } from './layer-2-mode';
import { composeLayer3 } from './layer-3-activation';
import { buildDisclaimers } from './disclaimers';

import { computeBodyMap }        from '@/lib/medical/body-map';
import { computeDiseaseProfile } from '@/lib/medical/disease-profile';
import { computeHealthTimeline } from '@/lib/medical/health-timeline';

// ─── Overall rating derivation ────────────────────────────────────────────────

/**
 * Derive the overall health Rating from the displayed element scores.
 *
 * Algorithm: average the top-5 highest displayedScores (most vulnerable
 * elements dominate the overall picture).  If fewer than 5 elements exist,
 * use all of them.  Map the average to the four-tier Rating scale.
 *
 * Thresholds (vulnerability 0-100):
 *   < 25  → uttama
 *   < 50  → madhyama
 *   < 75  → adhama
 *   ≥ 75  → atyadhama
 *
 * This is deliberately conservative — a single very high-risk element can pull
 * the overall score up even if most others are fine.
 */
function deriveOverallRating(displayedScores: number[]): Rating {
  if (displayedScores.length === 0) return 'madhyama';

  const sorted = [...displayedScores].sort((a, b) => b - a);
  const top5   = sorted.slice(0, 5);
  const avg    = top5.reduce((sum, s) => sum + s, 0) / top5.length;

  if (avg < 25) return 'uttama';
  if (avg < 50) return 'madhyama';
  if (avg < 75) return 'adhama';
  return 'atyadhama';
}

/**
 * Derive a LocaleText overall summary from the rating.
 */
function deriveOverallSummary(rating: Rating): { en: string; hi: string } {
  switch (rating) {
    case 'uttama':
      return {
        en: 'Strong overall resilience — your chart shows good vitality and recovery potential across most health domains.',
        hi: 'समग्र बल उत्तम — आपकी कुंडली अधिकांश स्वास्थ्य क्षेत्रों में अच्छी जीवन-शक्ति और पुनर्प्राप्ति क्षमता दर्शाती है।',
      };
    case 'madhyama':
      return {
        en: 'Moderate resilience — a few health areas merit mindful attention, but overall constitution is capable.',
        hi: 'समग्र बल मध्यम — कुछ स्वास्थ्य क्षेत्रों में सजग ध्यान आवश्यक है, किन्तु समग्र शारीरिक बल संतोषजनक है।',
      };
    case 'adhama':
      return {
        en: 'Challenged resilience — several health domains show elevated vulnerability; proactive care is recommended.',
        hi: 'समग्र बल अधम — अनेक स्वास्थ्य क्षेत्रों में उन्नत संवेदनशीलता है; सक्रिय स्वास्थ्य देखभाल की अनुशंसा की जाती है।',
      };
    default: // atyadhama
      return {
        en: 'High vulnerability — multiple critical health domains require attention. Please consult a qualified Jyotish practitioner and modern medical care.',
        hi: 'उच्च संवेदनशीलता — अनेक महत्त्वपूर्ण स्वास्थ्य क्षेत्रों पर ध्यान देना आवश्यक है। कृपया योग्य ज्योतिषी एवं आधुनिक चिकित्सक से परामर्श लें।',
      };
  }
}

// ─── Main engine ──────────────────────────────────────────────────────────────

/**
 * Compute a complete multi-layer Health Diagnosis from a birth chart.
 *
 * @param kundali  KundaliData from generateKundali()
 * @param options  Optional configuration (extended, today, age, gender)
 * @returns        Complete HealthDiagnosis per the spec §8 data contract
 */
export function computeHealthDiagnosis(
  kundali: KundaliData,
  options: HealthDiagnosisOptions = {},
): HealthDiagnosis {
  try {
    const {
      extended = false,
      today    = new Date(),
      age      = 35,  // neutral adult when age not provided
      gender,         // used by Layer 1 eyes scorer (passed via locale string convention)
    } = options;

    // Construct a locale string that carries the gender hint for the eyes scorer.
    // Eyes scorer reads locale for the §4.10 laterality note only — no i18n needed.
    // Other scorers ignore this field.
    // Convention: 'en' for unknown/other, 'en-male' for male, 'en-female' for female.
    const locale = gender === 'male' ? 'en-male' : gender === 'female' ? 'en-female' : 'en';

    // ── Layer 1: natal baseline ───────────────────────────────────────────────
    const { natalElements, hiddenElements } = composeLayer1(kundali, extended, locale);

    // ── Layer 2: constitutional overlay ──────────────────────────────────────
    const { prakriti, modeNote } = composeLayer2(kundali);

    // ── Layer 3: time-dependent activation ───────────────────────────────────
    const {
      currentMultipliers,
      displayedElements,
      // internalDisplayedElements is intentionally consumed here and then
      // discarded — only the public displayedElements array is in the returned
      // HealthDiagnosis.  The internal array is used for trend / inflection
      // computation inside composeLayer3 and is not part of the public contract.
    } = composeLayer3(kundali, natalElements, today, age);

    // ── Overall rating (backward-compatible single tier) ──────────────────────
    const scores  = displayedElements.map(d => d.displayedScore);
    const rating  = deriveOverallRating(scores);
    const summary = deriveOverallSummary(rating);
    const overall = { rating, summary };

    // ── Cross-reference modules (src/lib/medical/*) ────────────────────────
    const todayISO = today.toISOString().slice(0, 10);
    let bodyMap: BodyRegionResult[];
    try {
      bodyMap = computeBodyMap(kundali);
    } catch (err) {
      console.error('[health-diagnosis] computeBodyMap failed:', err);
      bodyMap = [];
    }

    let diseaseProfile: DiseaseProfileResult;
    try {
      diseaseProfile = computeDiseaseProfile(kundali, bodyMap);
    } catch (err) {
      console.error('[health-diagnosis] computeDiseaseProfile failed:', err);
      diseaseProfile = { topVulnerabilities: [], signaturePatterns: [] };
    }

    let timeline: HealthWindow[];
    try {
      timeline = computeHealthTimeline(kundali, todayISO);
    } catch (err) {
      console.error('[health-diagnosis] computeHealthTimeline failed:', err);
      timeline = [];
    }

    // ── Disclaimers ───────────────────────────────────────────────────────────
    const disclaimers = buildDisclaimers(natalElements);

    // ── Assemble HealthDiagnosis ──────────────────────────────────────────────
    return {
      natalElements,
      prakriti,
      modeNote,
      currentMultipliers,
      displayedElements,
      overall,
      bodyMap,
      diseaseProfile,
      timeline,
      disclaimers,
      optedInToExtended: extended,
      hiddenElements,
    };
  } catch (err) {
    console.error('[health-diagnosis] computeHealthDiagnosis failed:', err);
    // Return a minimal safe fallback so callers don't throw.
    // This should only be reached on corrupt KundaliData.
    return {
      natalElements:      [],
      prakriti:           { vata: 33, pitta: 33, kapha: 34, primaryDosha: 'Kapha', secondaryDosha: 'Pitta', prakritiType: 'Kapha-Pitta', percentages: { vata: 33, pitta: 33, kapha: 34 } },
      modeNote:           { en: '', hi: '' },
      currentMultipliers: {} as Record<ElementId, import('./types').ElementMultipliers>,
      displayedElements:  [],
      overall:            { rating: 'madhyama' as Rating, summary: { en: 'Unable to compute health diagnosis.', hi: 'स्वास्थ्य निदान की गणना नहीं की जा सकी।' } },
      bodyMap:            [],
      diseaseProfile:     { topVulnerabilities: [], signaturePatterns: [] },
      timeline:           [],
      disclaimers:        [],
      optedInToExtended:  false,
      hiddenElements:     [],
    };
  }
}

// ─── Re-exports for convenience ───────────────────────────────────────────────

export type { HealthDiagnosis, HealthDiagnosisOptions, ElementId } from './types';
