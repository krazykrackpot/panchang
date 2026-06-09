/**
 * Runtime merger that attaches per-locale overlays onto
 * NAKSHATRA_PADA_DEEP_EXTRAS' four prose fields (mythologicalContext,
 * strengthsWeaknesses, partnerCompatibility, classicalReference)
 * populating hi/mai/mr/ta/te/bn/gu/kn from per-locale overlay JSONs.
 *
 * Overlay key shape:
 *   `"<nakshatraId>-<pada>.{field}"`
 *   e.g. `"1-1.mythologicalContext"` → Ashwini Pada 1's mythological
 *   context translation for that locale.
 *
 * EN is the source-of-truth and lives in the bare data file. Missing
 * overlay entries gracefully fall back to EN via tl() at the consumer.
 *
 * Consumers MUST import from this file (NOT `nakshatra-pada-deep-extras`)
 * to get locale-aware content. Same pattern as
 * `nakshatra-pada-extras-with-overlay.ts`.
 */
import data from './nakshatra-pada-deep-extras.json';
import hiOverlayRaw from './nakshatra-pada-deep-extras-hi-overlay.json';
import maiOverlayRaw from './nakshatra-pada-deep-extras-mai-overlay.json';
import mrOverlayRaw from './nakshatra-pada-deep-extras-mr-overlay.json';
import taOverlayRaw from './nakshatra-pada-deep-extras-ta-overlay.json';
import teOverlayRaw from './nakshatra-pada-deep-extras-te-overlay.json';
import bnOverlayRaw from './nakshatra-pada-deep-extras-bn-overlay.json';
import guOverlayRaw from './nakshatra-pada-deep-extras-gu-overlay.json';
import knOverlayRaw from './nakshatra-pada-deep-extras-kn-overlay.json';

import type { NakshatraPadaDeepExtras } from './nakshatra-pada-deep-extras';

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
  'mythologicalContext',
  'strengthsWeaknesses',
  'partnerCompatibility',
  'classicalReference',
] as const;

function attach(slug: string, entry: NakshatraPadaDeepExtras): NakshatraPadaDeepExtras {
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
  return cloned as unknown as NakshatraPadaDeepExtras;
}

const PADA_DEEP_EXTRAS = data as Record<string, NakshatraPadaDeepExtras>;

export function getNakshatraPadaDeepExtras(
  nakshatraId: number,
  pada: number,
): NakshatraPadaDeepExtras | undefined {
  if (!Number.isInteger(nakshatraId) || nakshatraId < 1 || nakshatraId > 27) return undefined;
  if (!Number.isInteger(pada) || pada < 1 || pada > 4) return undefined;
  const slug = `${nakshatraId}-${pada}`;
  const entry = PADA_DEEP_EXTRAS[slug];
  if (!entry) return undefined;
  return attach(slug, entry);
}

export type { NakshatraPadaDeepExtras };
