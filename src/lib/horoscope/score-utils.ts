import { tl } from '@/lib/utils/trilingual';

/** Qualitative label for a 1-10 score. */
export function scoreLabel(score: number, locale: string): string {
  if (score >= 8) return tl({ en: 'Excellent', hi: 'उत्कृष्ट', sa: 'उत्कृष्टः' }, locale);
  if (score >= 6.5) return tl({ en: 'Good', hi: 'शुभ', sa: 'शुभः' }, locale);
  if (score >= 4) return tl({ en: 'Moderate', hi: 'मध्यम', sa: 'मध्यमः' }, locale);
  return tl({ en: 'Challenging', hi: 'चुनौतीपूर्ण', sa: 'कठिनः' }, locale);
}

/** Tailwind background class for score bar fill. Thresholds match scoreLabel. */
export function getScoreBgClass(score: number): string {
  if (score >= 6.5) return 'bg-emerald-500';
  if (score >= 4) return 'bg-amber-500';
  return 'bg-red-500';
}

/** Tailwind text colour class for score display. Thresholds match scoreLabel. */
export function getScoreTextClass(score: number): string {
  if (score >= 6.5) return 'text-emerald-400';
  if (score >= 4) return 'text-amber-400';
  return 'text-red-400';
}
