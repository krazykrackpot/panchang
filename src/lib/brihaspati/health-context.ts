/**
 * Health-context builder for Brihaspati AI.
 *
 * Build a concise natural-language context block describing the user's
 * health diagnosis. Intended for inclusion in the Brihaspati system
 * prompt or question-specific context — NOT for direct display.
 *
 * Shape:
 *   - Overall tier
 *   - Top 5 most-vulnerable elements with rating + factors summary
 *   - Active classical signatures (yogas/doshas matched)
 *   - Current activation (dasha + Sade Sati if active)
 *   - Constitutional mode (Prakriti)
 *   - Longevity classification (only if extended opted-in)
 *
 * Returns ~500-1000 token English string. Caller controls when to include.
 */

import type { HealthDiagnosis } from '@/lib/kundali/health-diagnosis';

/**
 * Build a concise natural-language context block describing the user's
 * health diagnosis for inclusion in the Brihaspati AI prompt.
 *
 * Returns empty string when diagnosis is null/undefined — callers may
 * safely pass through without a conditional guard.
 */
export function buildHealthContext(diagnosis: HealthDiagnosis | null | undefined): string {
  if (!diagnosis) return '';

  const lines: string[] = [];
  lines.push(`### Health Diagnosis Context`);
  lines.push(`Overall tier: ${diagnosis.overall.rating.toUpperCase()}`);

  // Top 5 most-vulnerable elements (highest natalScore = most vulnerable)
  const top5 = [...diagnosis.natalElements]
    .sort((a, b) => b.natalScore - a.natalScore)
    .slice(0, 5);

  if (top5.length > 0) {
    lines.push(``);
    lines.push(`Top 5 vulnerable elements:`);
    for (const el of top5) {
      const negFactors = (el.factors || [])
        .filter(f => f.verdict === 'negative')
        .slice(0, 3)
        .map(f => `${f.label?.en || 'Factor'} (${f.value})`)
        .join('; ');
      lines.push(
        `- ${el.name.en} (${el.rating}, score ${el.natalScore}/100): ${negFactors || 'no specific negative factors'}`,
      );
    }
  }

  // Active classical signatures across all elements — deduplicated
  const allSignatures = new Set<string>();
  for (const el of diagnosis.natalElements || []) {
    for (const sig of el.classicalSignatures || []) {
      if (sig?.name?.en) {
        allSignatures.add(`${sig.name.en} [${sig.source || 'unknown'}]`);
      }
    }
  }
  if (allSignatures.size > 0) {
    lines.push(``);
    lines.push(`Active classical signatures: ${Array.from(allSignatures).join(', ')}`);
  }

  // Currently amplified elements (dasha or transit contribution > threshold)
  const currentlyAmplified = Object.entries(diagnosis.currentMultipliers)
    .filter(([, m]) => m.dashaContribution > 0 || m.transitContribution > 0.05)
    .map(
      ([id, m]) =>
        `${id} (dasha +${(m.dashaContribution * 100).toFixed(0)}%, transit +${(m.transitContribution * 100).toFixed(0)}%${m.sadeSatiActive ? ', Sade Sati' : ''})`,
    );
  if (currentlyAmplified.length > 0) {
    lines.push(``);
    lines.push(`Currently amplified: ${currentlyAmplified.slice(0, 5).join('; ')}`);
  }

  // Constitutional mode (Prakriti)
  if (diagnosis.prakriti) {
    lines.push(``);
    lines.push(
      `Constitutional mode: ${diagnosis.prakriti.primaryDosha}-dominant prakriti.`,
    );
    if (diagnosis.modeNote.en) {
      lines.push(diagnosis.modeNote.en);
    }
  }

  // Longevity classification — only if the caller opted into the extended view
  if (diagnosis.optedInToExtended) {
    const longevity = diagnosis.natalElements?.find(e => e.id === 'longevity');
    if (longevity) {
      const pindaFactor = longevity.factors?.find(f => f.label?.en?.includes('Pinda'));
      lines.push(``);
      lines.push(`Longevity element: ${pindaFactor?.value ?? 'unknown'}`);
    }
  }

  return lines.join('\n');
}

/**
 * Health-relevant trigger phrases.
 *
 * Used to detect when to include the health context block in Brihaspati's
 * prompt. Covers English, Hindi, and common transliterations.
 *
 * Deliberately broad — a false positive (include health context when not
 * strictly needed) is far cheaper than a false negative (miss health context
 * on a health question). The health block is ~500-800 tokens; the risk of
 * including it on a borderline question is negligible.
 */
const HEALTH_KEYWORDS: string[] = [
  // English
  'health', 'illness', 'disease', 'medical', 'doctor', 'pain', 'sick', 'symptom',
  'diagnosis', 'cure', 'remedy', 'heart', 'cardiac', 'digestive', 'stomach', 'gut',
  'mental', 'anxiety', 'depression', 'stress', 'sleep', 'insomnia', 'skin',
  'bone', 'joint', 'arthritis', 'eye', 'vision', 'lungs', 'breathing',
  'fertility', 'pregnancy', 'reproductive', 'chronic', 'surgery', 'cancer',
  'addiction', 'longevity', 'lifespan', 'wellbeing', 'wellness', 'nakshatra health',
  'allergy', 'allergies', 'immune', 'immunity', 'nervous', 'muscle', 'muscular',
  'endocrine', 'thyroid', 'diabetes', 'blood pressure', 'accident', 'injury',
  // Hindi keywords
  'जीवन', 'स्वास्थ्य', 'सेहत', 'रोग', 'बीमारी', 'चिकित्सा',
  'दर्द', 'मानसिक', 'नींद', 'प्रजनन', 'दीर्घायु',
];

/**
 * Return true when the question text appears to be health-related.
 *
 * Matching is case-insensitive and checks substring containment so that
 * plurals / inflected forms are covered without a regex library.
 */
export function questionIsHealthRelated(question: string | null | undefined): boolean {
  if (!question) return false;
  const q = question.toLowerCase();
  return HEALTH_KEYWORDS.some(kw => q.includes(kw));
}
