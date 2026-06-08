/**
 * Runtime merger for DREKKANA_FACES — attaches per-locale image +
 * interpretation overlays for 7 regional locales.
 *
 * Overlay keys: `"<signId>-<decanate>.{image|interpretation}"`.
 */
import { DREKKANA_FACES as RAW_DREKKANA_FACES, type DrekkanaFace, getDecanateFromDegree } from './drekkana-faces';

import taOverlayRaw from './drekkana-faces-ta-overlay.json';
import teOverlayRaw from './drekkana-faces-te-overlay.json';
import bnOverlayRaw from './drekkana-faces-bn-overlay.json';
import guOverlayRaw from './drekkana-faces-gu-overlay.json';
import knOverlayRaw from './drekkana-faces-kn-overlay.json';
import maiOverlayRaw from './drekkana-faces-mai-overlay.json';
import mrOverlayRaw from './drekkana-faces-mr-overlay.json';

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

function attach(leaf: Record<string, string>, key: string): Record<string, string> {
  const cloned = { ...leaf };
  for (const locale of OVERLAY_LOCALES) {
    if (typeof cloned[locale] === 'string' && cloned[locale].trim()) continue;
    const v = OVERLAYS[locale][key];
    if (typeof v === 'string' && v.trim()) cloned[locale] = v;
  }
  return cloned;
}

function applyOverlay(face: DrekkanaFace): DrekkanaFace {
  const baseKey = `${face.signId}-${face.decanate}`;
  return {
    ...face,
    image: attach(face.image as Record<string, string>, `${baseKey}.image`) as DrekkanaFace['image'],
    interpretation: attach(face.interpretation as Record<string, string>, `${baseKey}.interpretation`) as DrekkanaFace['interpretation'],
  };
}

export const DREKKANA_FACES: readonly DrekkanaFace[] = RAW_DREKKANA_FACES.map(applyOverlay);

export function getDrekkanaFace(signId: number, decanate: number): DrekkanaFace | undefined {
  return DREKKANA_FACES.find((f) => f.signId === signId && f.decanate === decanate);
}

// Re-export the pure helper unchanged.
export { getDecanateFromDegree };

export type { DrekkanaFace } from './drekkana-faces';
