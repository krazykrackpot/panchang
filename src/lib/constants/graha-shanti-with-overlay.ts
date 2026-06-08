/**
 * Runtime merger that attaches per-locale overlays onto GRAHA_SHANTI's
 * LocaleText fields (deity, gemstone, metal, day, color, grain, flower,
 * direction, fastNote + nested mantra.meaning), populating ta/te/bn/gu/
 * kn/mai/mr without mutating source.
 *
 * mantra.text (sacred Devanagari) stays AS-IS — not in the overlay.
 *
 * Overlay keys: `"<planetId>.<field>"` / `"<planetId>.mantra.meaning"`.
 */
import { GRAHA_SHANTI as RAW_GRAHA_SHANTI, type GrahaShanti } from './graha-shanti';

import taOverlayRaw from './graha-shanti-ta-overlay.json';
import teOverlayRaw from './graha-shanti-te-overlay.json';
import bnOverlayRaw from './graha-shanti-bn-overlay.json';
import guOverlayRaw from './graha-shanti-gu-overlay.json';
import knOverlayRaw from './graha-shanti-kn-overlay.json';
import maiOverlayRaw from './graha-shanti-mai-overlay.json';
import mrOverlayRaw from './graha-shanti-mr-overlay.json';

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

const SIMPLE_FIELDS = ['deity', 'gemstone', 'metal', 'day', 'color', 'grain', 'flower', 'direction', 'fastNote'] as const;

function attach(leaf: Record<string, string>, key: string): Record<string, string> {
  const cloned = { ...leaf };
  for (const locale of OVERLAY_LOCALES) {
    if (typeof cloned[locale] === 'string' && cloned[locale].trim()) continue;
    const v = OVERLAYS[locale][key];
    if (typeof v === 'string' && v.trim()) cloned[locale] = v;
  }
  return cloned;
}

function applyOverlay(gs: GrahaShanti): GrahaShanti {
  const cloned: Record<string, unknown> = { ...gs };
  for (const field of SIMPLE_FIELDS) {
    cloned[field] = attach(gs[field] as Record<string, string>, `${gs.planetId}.${field}`);
  }
  cloned.mantra = {
    ...gs.mantra,
    meaning: attach(gs.mantra.meaning as Record<string, string>, `${gs.planetId}.mantra.meaning`),
  };
  return cloned as unknown as GrahaShanti;
}

export const GRAHA_SHANTI: readonly GrahaShanti[] = RAW_GRAHA_SHANTI.map(applyOverlay);

export function getGrahaShanti(planetId: number): GrahaShanti | undefined {
  return GRAHA_SHANTI.find((g) => g.planetId === planetId);
}

export type { GrahaShanti } from './graha-shanti';
