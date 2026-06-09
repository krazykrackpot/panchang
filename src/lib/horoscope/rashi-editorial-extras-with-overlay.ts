/**
 * Runtime locale-overlay merger for rashi-editorial-extras. Same
 * pattern as nakshatra-pada-deep-extras-with-overlay.ts.
 *
 * Overlay key shape: "<rashiId>.<field>", e.g. "1.dashaSignificance".
 *
 * EN is the source-of-truth and lives in the bare data file. Missing
 * overlay entries gracefully fall back to EN via tl() at the consumer.
 */
import data from './rashi-editorial-extras.json';
import hiOverlayRaw from './rashi-editorial-extras-hi-overlay.json';
import maiOverlayRaw from './rashi-editorial-extras-mai-overlay.json';
import mrOverlayRaw from './rashi-editorial-extras-mr-overlay.json';
import taOverlayRaw from './rashi-editorial-extras-ta-overlay.json';
import teOverlayRaw from './rashi-editorial-extras-te-overlay.json';
import bnOverlayRaw from './rashi-editorial-extras-bn-overlay.json';
import guOverlayRaw from './rashi-editorial-extras-gu-overlay.json';
import knOverlayRaw from './rashi-editorial-extras-kn-overlay.json';

import type { RashiEditorialExtras } from './rashi-editorial-extras';

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
const FIELDS = ['dashaSignificance', 'transitsPlaybook', 'luckyAndUnlucky'] as const;

function attach(slug: string, entry: RashiEditorialExtras): RashiEditorialExtras {
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
  return cloned as unknown as RashiEditorialExtras;
}

const EDITORIAL_EXTRAS = data as Record<string, RashiEditorialExtras>;

// Pre-merge overlays at module load — see same pattern in
// nakshatra-pada-deep-extras-with-overlay.ts. Eliminates per-render
// clone + spread. (Gemini review feedback.)
const MERGED_EDITORIAL_EXTRAS: Record<string, RashiEditorialExtras> = {};
for (const [slug, entry] of Object.entries(EDITORIAL_EXTRAS)) {
  MERGED_EDITORIAL_EXTRAS[slug] = attach(slug, entry);
}

export function getRashiEditorialExtras(
  rashiId: number,
): RashiEditorialExtras | undefined {
  if (!Number.isInteger(rashiId) || rashiId < 1 || rashiId > 12) return undefined;
  const slug = String(rashiId);
  return MERGED_EDITORIAL_EXTRAS[slug];
}

export type { RashiEditorialExtras };
