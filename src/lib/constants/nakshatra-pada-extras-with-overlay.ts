/**
 * Runtime merger that attaches per-locale overlays onto
 * NAKSHATRA_PADA_EXTRAS' spiritualPractice + decisions LocaleText
 * fields, populating ta/te/bn/gu/kn/mai/mr.
 *
 * Note on policy comment in `nakshatra-pada-extras.ts`: the bare file's
 * comment says "no need to translate the other 7" because at the time
 * it was written, `/learn/nakshatra-pada/` was indexable en+hi only.
 * PR #555 promoted the prefix to full 9-locale; this overlay closes
 * the content gap. The bare file's comment is updated alongside.
 *
 * Overlay keys: `"<nakshatraId>-<pada>.{spiritualPractice|decisions}"`.
 */
import data from './nakshatra-pada-extras.json';
import taOverlayRaw from './nakshatra-pada-extras-ta-overlay.json';
import teOverlayRaw from './nakshatra-pada-extras-te-overlay.json';
import bnOverlayRaw from './nakshatra-pada-extras-bn-overlay.json';
import guOverlayRaw from './nakshatra-pada-extras-gu-overlay.json';
import knOverlayRaw from './nakshatra-pada-extras-kn-overlay.json';
import maiOverlayRaw from './nakshatra-pada-extras-mai-overlay.json';
import mrOverlayRaw from './nakshatra-pada-extras-mr-overlay.json';

import type { NakshatraPadaExtras } from './nakshatra-pada-extras';

type OverlayLocale = 'ta' | 'te' | 'bn' | 'gu' | 'kn' | 'mai' | 'mr';

const OVERLAYS: Record<OverlayLocale, Readonly<Record<string, string>>> = {
  ta: taOverlayRaw as Readonly<Record<string, string>>,
  te: teOverlayRaw as Readonly<Record<string, string>>,
  bn: bnOverlayRaw as Readonly<Record<string, string>>,
  gu: guOverlayRaw as Readonly<Record<string, string>>,
  kn: knOverlayRaw as Readonly<Record<string, string>>,
  mai: maiOverlayRaw as Readonly<Record<string, string>>,
  mr: mrOverlayRaw as Readonly<Record<string, string>>,
};

const OVERLAY_LOCALES: readonly OverlayLocale[] = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
const FIELDS = ['spiritualPractice', 'decisions'] as const;

function attach(slug: string, entry: NakshatraPadaExtras): NakshatraPadaExtras {
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
  return cloned as unknown as NakshatraPadaExtras;
}

const PADA_EXTRAS_MERGED: Record<string, NakshatraPadaExtras> = {};
for (const [slug, entry] of Object.entries(data as Record<string, NakshatraPadaExtras>)) {
  PADA_EXTRAS_MERGED[slug] = attach(slug, entry);
}

export function getNakshatraPadaExtras(
  nakshatraId: number,
  pada: number,
): NakshatraPadaExtras | undefined {
  if (!Number.isInteger(nakshatraId) || nakshatraId < 1 || nakshatraId > 27) return undefined;
  if (!Number.isInteger(pada) || pada < 1 || pada > 4) return undefined;
  return PADA_EXTRAS_MERGED[`${nakshatraId}-${pada}`];
}

export type { NakshatraPadaExtras } from './nakshatra-pada-extras';
