/**
 * Runtime merger that constructs the NAKSHATRA_BABY_CONTENT record
 * from the per-locale overlay JSON files.
 *
 * Pattern mirrors yoga-details-with-overlay.ts: each locale has a
 * flat dotted-key JSON (`<slug>.deityLegend`, `<slug>.personalityTraits.0`,
 * etc). The merger walks the 27 nakshatra slugs, builds a LocaleText
 * (and LocaleText[]) for each field from the matching overlay keys
 * across all 9 visible locales, and produces a typed record indexed
 * by nakshatra ID.
 *
 * Slugs missing from the EN overlay produce undefined entries, and
 * the page renders a graceful fallback (no enrichment section, just
 * the original syllable table). After PR #619 ships, all 27 EN
 * entries are populated; regional locales attach as their overlay
 * JSONs are populated by the translate pass.
 */

import type { NakshatraBabyContent } from './nakshatra-baby-content';

import enOverlayRaw from './nakshatra-baby-content-en-overlay.json';
import hiOverlayRaw from './nakshatra-baby-content-hi-overlay.json';
import maiOverlayRaw from './nakshatra-baby-content-mai-overlay.json';
import mrOverlayRaw from './nakshatra-baby-content-mr-overlay.json';
import taOverlayRaw from './nakshatra-baby-content-ta-overlay.json';
import teOverlayRaw from './nakshatra-baby-content-te-overlay.json';
import bnOverlayRaw from './nakshatra-baby-content-bn-overlay.json';
import guOverlayRaw from './nakshatra-baby-content-gu-overlay.json';
import knOverlayRaw from './nakshatra-baby-content-kn-overlay.json';

type Locale = 'en' | 'hi' | 'mai' | 'mr' | 'ta' | 'te' | 'bn' | 'gu' | 'kn';

const OVERLAYS: Record<Locale, Readonly<Record<string, string>>> = {
  en: enOverlayRaw as Readonly<Record<string, string>>,
  hi: hiOverlayRaw as Readonly<Record<string, string>>,
  mai: maiOverlayRaw as Readonly<Record<string, string>>,
  mr: mrOverlayRaw as Readonly<Record<string, string>>,
  ta: taOverlayRaw as Readonly<Record<string, string>>,
  te: teOverlayRaw as Readonly<Record<string, string>>,
  bn: bnOverlayRaw as Readonly<Record<string, string>>,
  gu: guOverlayRaw as Readonly<Record<string, string>>,
  kn: knOverlayRaw as Readonly<Record<string, string>>,
};

const LOCALES: readonly Locale[] = ['en', 'hi', 'mai', 'mr', 'ta', 'te', 'bn', 'gu', 'kn'];

// Slug ↔ nakshatra ID mapping. Kept in sync with the page's
// SLUG_TO_ID table via the canonical-slugs-style test in
// `src/lib/__tests__/nakshatra-baby-slugs.test.ts`.
const ID_TO_SLUG: Record<number, string> = {
  1: 'ashwini', 2: 'bharani', 3: 'krittika', 4: 'rohini', 5: 'mrigashira',
  6: 'ardra', 7: 'punarvasu', 8: 'pushya', 9: 'ashlesha', 10: 'magha',
  11: 'purva-phalguni', 12: 'uttara-phalguni', 13: 'hasta', 14: 'chitra',
  15: 'swati', 16: 'vishakha', 17: 'anuradha', 18: 'jyeshtha', 19: 'mula',
  20: 'purva-ashadha', 21: 'uttara-ashadha', 22: 'shravana', 23: 'dhanishta',
  24: 'shatabhisha', 25: 'purva-bhadrapada', 26: 'uttara-bhadrapada', 27: 'revati',
};

function buildScalarField(slug: string, fieldName: string): Record<string, string> | undefined {
  const en = OVERLAYS.en[`${slug}.${fieldName}`];
  if (typeof en !== 'string' || en.length === 0) return undefined;
  // hi defaults to en until the hi overlay populates it (Devanagari
  // fallback for mai/mr/sa handled by tl() at the consumer).
  const obj: Record<string, string> = { en, hi: en };
  for (const loc of LOCALES) {
    const v = OVERLAYS[loc][`${slug}.${fieldName}`];
    if (typeof v === 'string' && v.length > 0) obj[loc] = v;
  }
  return obj;
}

function buildArrayField(slug: string, fieldName: string): Array<Record<string, string>> | undefined {
  const result: Array<Record<string, string>> = [];
  for (let i = 0; ; i++) {
    const en = OVERLAYS.en[`${slug}.${fieldName}.${i}`];
    if (typeof en !== 'string' || en.length === 0) break;
    const obj: Record<string, string> = { en, hi: en };
    for (const loc of LOCALES) {
      const v = OVERLAYS[loc][`${slug}.${fieldName}.${i}`];
      if (typeof v === 'string' && v.length > 0) obj[loc] = v;
    }
    result.push(obj);
  }
  return result.length > 0 ? result : undefined;
}

function buildContentForSlug(slug: string): NakshatraBabyContent | undefined {
  const deityLegend = buildScalarField(slug, 'deityLegend');
  const symbolMeaning = buildScalarField(slug, 'symbolMeaning');
  const nameThemes = buildScalarField(slug, 'nameThemes');
  const namingTradition = buildScalarField(slug, 'namingTradition');
  const personalityTraits = buildArrayField(slug, 'personalityTraits');
  // famousBearers is optional; the prompt may emit an empty string
  // when no verifiable record exists. The overlay loader treats
  // empty-string as absent (above), so the field stays optional here.
  const famousBearers = buildScalarField(slug, 'famousBearers');

  // Require the 5 mandatory fields. If any is missing for EN, no
  // enrichment renders for this nakshatra — page falls back to the
  // pre-PR shell. This guards against partial data shipping.
  if (!deityLegend || !symbolMeaning || !nameThemes || !namingTradition || !personalityTraits) {
    return undefined;
  }

  return {
    deityLegend: deityLegend as NakshatraBabyContent['deityLegend'],
    symbolMeaning: symbolMeaning as NakshatraBabyContent['symbolMeaning'],
    personalityTraits: personalityTraits as NakshatraBabyContent['personalityTraits'],
    nameThemes: nameThemes as NakshatraBabyContent['nameThemes'],
    ...(famousBearers ? { famousBearers: famousBearers as NakshatraBabyContent['famousBearers'] } : {}),
    namingTradition: namingTradition as NakshatraBabyContent['namingTradition'],
  };
}

// Pre-build the record once at module init.
export const NAKSHATRA_BABY_CONTENT_WITH_OVERLAY: Readonly<Record<number, NakshatraBabyContent>> = Object.freeze(
  Object.fromEntries(
    Object.entries(ID_TO_SLUG)
      .map(([id, slug]) => [Number(id), buildContentForSlug(slug)] as const)
      .filter((entry): entry is readonly [number, NakshatraBabyContent] => entry[1] !== undefined),
  ),
);

export type { NakshatraBabyContent };
