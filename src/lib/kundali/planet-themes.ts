/**
 * Per-planet "strong" / "weak" themes used in InterpretationHelpers.
 *
 * EN/HI are authored here; mai/mr/ta/te/kn/gu/bn come from a Gemini-
 * translated overlay (kept as JSON so re-translation diffs cleanly).
 * Consumers should read via `tlScript(THEMES[id].strong, locale)`.
 */
import type { LocaleText } from '@/types/panchang';
import OVERLAY from '@/lib/constants/planet-themes-overlay.json';

type ThemeAxis = 'strong' | 'weak';
type OverlayShape = Partial<Record<string, Record<string, string>>>;

const overlay = OVERLAY as OverlayShape;

const AUTHORED_EN: Record<number, Record<ThemeAxis, string>> = {
  0: { strong: 'Authority, career recognition, father\'s support', weak: 'Career struggles, lack of recognition, father issues' },
  1: { strong: 'Emotional stability, good public image, mother\'s support', weak: 'Anxiety, emotional turbulence, mother\'s health concerns' },
  2: { strong: 'Courage, property gains, technical ability', weak: 'Lack of initiative, property disputes, accident-prone' },
  3: { strong: 'Business acumen, communication skills, analytical mind', weak: 'Indecision, communication problems, skin issues' },
  4: { strong: 'Wisdom, children, spiritual growth, wealth', weak: 'Bad advice, delayed children, lack of faith' },
  5: { strong: 'Happy marriage, luxury, artistic talent', weak: 'Relationship issues, lack of comfort, kidney problems' },
  6: { strong: 'Discipline, longevity, career stability', weak: 'Chronic problems, delays, bone/joint issues' },
};

function buildLocaleText(planetId: number, axis: ThemeAxis): LocaleText {
  const en = AUTHORED_EN[planetId][axis];
  const key = `p${planetId}_${axis}`;
  const out: LocaleText = { en };
  for (const locale of ['hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const) {
    const v = overlay[locale]?.[key];
    if (v) out[locale] = v;
  }
  return out;
}

export const PLANET_THEMES: Record<number, { strong: LocaleText; weak: LocaleText }> = (() => {
  const out: Record<number, { strong: LocaleText; weak: LocaleText }> = {};
  for (const id of Object.keys(AUTHORED_EN).map(Number)) {
    out[id] = { strong: buildLocaleText(id, 'strong'), weak: buildLocaleText(id, 'weak') };
  }
  return out;
})();
