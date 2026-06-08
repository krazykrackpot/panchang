/**
 * Mahadasha forecast prose for Rahu and Ketu.
 * EN/HI authored inline; rest via Gemini overlay JSON.
 */
import type { LocaleText } from '@/types/panchang';
import OVERLAY from '@/lib/constants/rahu-ketu-forecast-overlay.json';

type OverlayShape = Partial<Record<string, Record<string, string>>>;
const overlay = OVERLAY as OverlayShape;

const AUTHORED_EN: Record<number, string> = {
  7: 'Unusual opportunities, foreign connections, sudden gains or disruptions. Ambition peaks  –  but verify carefully before acting. Excellent for unconventional paths.',
  8: 'Detachment, spiritual insight, past-life patterns surfacing. Career may feel directionless but inner wisdom and intuition grow strongly.',
};

function build(planetId: number): LocaleText {
  const key = `p${planetId}`;
  const out: LocaleText = { en: AUTHORED_EN[planetId] };
  for (const locale of ['hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const) {
    const v = overlay[locale]?.[key];
    if (v) out[locale] = v;
  }
  return out;
}

export const RAHU_KETU_FORECAST: Record<number, LocaleText> = {
  7: build(7),
  8: build(8),
};
