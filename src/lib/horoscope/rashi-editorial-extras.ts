/**
 * Three additional editorial fields per rashi — dashaSignificance,
 * transitsPlaybook, luckyAndUnlucky — that augment the existing
 * RASHI_EDITORIAL (personality / rulerInfluence / elementTraits /
 * strengthsWeaknesses / compatibility) on the horoscope hub +
 * weekly + monthly pages.
 *
 * Background: the 2026-06-09 thin-content audit found the 24
 * /horoscope/[rashi]/{weekly,monthly} routes rendering 400-490
 * visible words — borderline thin for indexable SEO content. The
 * landing /horoscope/[rashi] page at 850-910w is healthy, but the
 * weekly + monthly routes carry less dynamic transit content and
 * thus rely more on the static editorial. This file adds ~200-280
 * more EN words per rashi via 3 additional sections rendered by
 * RashiArticle, lifting the weekly + monthly word counts above the
 * 600w safe threshold.
 *
 * Fields:
 *   dashaSignificance — how the rashi's lord shapes life chapters
 *     when its mahadasha or antardasha is active (~80-100 words).
 *   transitsPlaybook  — which planet's transits matter most for
 *     natives of this sign, in which houses, what to watch for
 *     (~80-100 words).
 *   luckyAndUnlucky   — colours, gemstones, weekdays, lucky/
 *     unlucky number patterns, and short do/don't list (~60-80
 *     words).
 *
 * Source: scripts/generate-rashi-editorial-extras-via-gemini.py for
 * en. Other 8 locales (hi + 7 regional Indic) via overlay layer
 * in `rashi-editorial-extras-with-overlay.ts`.
 */
import data from './rashi-editorial-extras.json';

export interface RashiEditorialExtras {
  dashaSignificance: { en: string };
  transitsPlaybook: { en: string };
  luckyAndUnlucky: { en: string };
}

const EDITORIAL_EXTRAS = data as Record<string, RashiEditorialExtras>;

export function getRashiEditorialExtras(
  rashiId: number,
): RashiEditorialExtras | undefined {
  if (!Number.isInteger(rashiId) || rashiId < 1 || rashiId > 12) return undefined;
  return EDITORIAL_EXTRAS[String(rashiId)];
}
