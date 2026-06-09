/**
 * Runtime locale-overlay merger for rashi-pair-deep-content. Same
 * pattern as nakshatra-pada-deep-extras-with-overlay.ts.
 *
 * Overlay key shape: "<lowerRashiId>-<higherRashiId>.<field>"
 * e.g. "1-5.mythologicalDynamic"
 *
 * EN is the source-of-truth and lives in the bare data file. Missing
 * overlay entries gracefully fall back to EN via tl() at the consumer.
 */
import data from './rashi-pair-deep-content.json';
import hiOverlayRaw from './rashi-pair-deep-content-hi-overlay.json';
import maiOverlayRaw from './rashi-pair-deep-content-mai-overlay.json';
import mrOverlayRaw from './rashi-pair-deep-content-mr-overlay.json';
import taOverlayRaw from './rashi-pair-deep-content-ta-overlay.json';
import teOverlayRaw from './rashi-pair-deep-content-te-overlay.json';
import bnOverlayRaw from './rashi-pair-deep-content-bn-overlay.json';
import guOverlayRaw from './rashi-pair-deep-content-gu-overlay.json';
import knOverlayRaw from './rashi-pair-deep-content-kn-overlay.json';

import type { RashiPairDeepContent } from './rashi-pair-deep-content';

type OverlayLocale = 'hi' | 'mai' | 'mr' | 'ta' | 'te' | 'bn' | 'gu' | 'kn';

const OVERLAYS: Record<OverlayLocale, Readonly<Record<string, string>>> = {
  hi: hiOverlayRaw as Readonly<Record<string, string>>,
  mai: maiOverlayRaw as Readonly<Record<string, string>>,
  mr: mrOverlayRaw as Readonly<Record<string, string>>,
  ta: taOverlayRaw as Readonly<Record<string, string>>,
  te: teOverlayRaw as Readonly<Record<string, string>>,
  bn: bnOverlayRaw as Readonly<Record<string, string>>,
  gu: guOverlayRaw as Readonly<Record<string, string>>,
  kn: knOverlayRaw as Readonly<Record<string, string>>,
};

const OVERLAY_LOCALES: readonly OverlayLocale[] = ['hi', 'mai', 'mr', 'ta', 'te', 'bn', 'gu', 'kn'];
const FIELDS = [
  'mythologicalDynamic',
  'deepCompatibilityNotes',
  'careerBondInsight',
  'growthPath',
] as const;

function attach(slug: string, entry: RashiPairDeepContent): RashiPairDeepContent {
  const cloned: Record<string, Record<string, string>> = {};
  for (const field of FIELDS) {
    const src = entry[field] as Record<string, string>;
    const ft: Record<string, string> = { ...src };
    for (const locale of OVERLAY_LOCALES) {
      if (typeof ft[locale] === 'string' && ft[locale].trim()) continue;
      const overlayVal = OVERLAYS[locale][`${slug}.${field}`];
      if (typeof overlayVal === 'string' && overlayVal.trim()) {
        ft[locale] = overlayVal;
      }
    }
    cloned[field] = ft;
  }
  return cloned as unknown as RashiPairDeepContent;
}

const PAIR_DEEP_CONTENT = data as Record<string, RashiPairDeepContent>;

// Pre-merge overlays at module load — see same pattern in
// nakshatra-pada-deep-extras-with-overlay.ts. Eliminates per-render
// clone + spread. (Gemini review feedback.)
const MERGED_PAIR_DEEP_CONTENT: Record<string, RashiPairDeepContent> = {};
for (const [slug, entry] of Object.entries(PAIR_DEEP_CONTENT)) {
  MERGED_PAIR_DEEP_CONTENT[slug] = attach(slug, entry);
}

export function getRashiPairDeepContent(
  r1: number, r2: number,
): RashiPairDeepContent | undefined {
  if (!Number.isInteger(r1) || r1 < 1 || r1 > 12) return undefined;
  if (!Number.isInteger(r2) || r2 < 1 || r2 > 12) return undefined;
  const lo = Math.min(r1, r2);
  const hi = Math.max(r1, r2);
  const slug = `${lo}-${hi}`;
  return MERGED_PAIR_DEEP_CONTENT[slug];
}

export type { RashiPairDeepContent };
