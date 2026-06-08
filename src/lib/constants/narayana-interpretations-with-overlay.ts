/**
 * Runtime merger for NARAYANA_INTERPRETATIONS — attaches per-locale
 * themes / focus / caution overlays for 7 regional locales.
 *
 * Overlay keys: `"<signId>.{themes|focus|caution}"`.
 */
import {
  NARAYANA_INTERPRETATIONS as RAW_NARAYANA_INTERPRETATIONS,
  type NarayanaDashaInterpretation,
} from './narayana-interpretations';

import taOverlayRaw from './narayana-interpretations-ta-overlay.json';
import teOverlayRaw from './narayana-interpretations-te-overlay.json';
import bnOverlayRaw from './narayana-interpretations-bn-overlay.json';
import guOverlayRaw from './narayana-interpretations-gu-overlay.json';
import knOverlayRaw from './narayana-interpretations-kn-overlay.json';
import maiOverlayRaw from './narayana-interpretations-mai-overlay.json';
import mrOverlayRaw from './narayana-interpretations-mr-overlay.json';

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
const FIELDS = ['themes', 'focus', 'caution'] as const;

function applyOverlay(interp: NarayanaDashaInterpretation): NarayanaDashaInterpretation {
  const cloned: Record<string, unknown> = { ...interp };
  for (const field of FIELDS) {
    const ft: Record<string, string> = { ...(interp[field] as Record<string, string>) };
    for (const locale of OVERLAY_LOCALES) {
      if (typeof ft[locale] === 'string' && ft[locale].trim()) continue;
      const v = OVERLAYS[locale][`${interp.signId}.${field}`];
      if (typeof v === 'string' && v.trim()) ft[locale] = v;
    }
    cloned[field] = ft;
  }
  return cloned as unknown as NarayanaDashaInterpretation;
}

export const NARAYANA_INTERPRETATIONS: readonly NarayanaDashaInterpretation[] =
  RAW_NARAYANA_INTERPRETATIONS.map(applyOverlay);

export function getNarayanaInterpretation(signId: number): NarayanaDashaInterpretation | undefined {
  return NARAYANA_INTERPRETATIONS.find((i) => i.signId === signId);
}

export type { NarayanaDashaInterpretation } from './narayana-interpretations';
