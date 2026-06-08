/**
 * Runtime merger that attaches per-locale overlays onto ARCHETYPES'
 * 6 LocaleText fields (name, title, essence, description, superpower,
 * shadow), populating ta/te/bn/gu/kn/mai/mr.
 *
 * Overlay keys: `"<rashiId>.<field>"`.
 */
import { ARCHETYPES as RAW_ARCHETYPES, type Archetype } from './archetypes';

import taOverlayRaw from './archetypes-ta-overlay.json';
import teOverlayRaw from './archetypes-te-overlay.json';
import bnOverlayRaw from './archetypes-bn-overlay.json';
import guOverlayRaw from './archetypes-gu-overlay.json';
import knOverlayRaw from './archetypes-kn-overlay.json';
import maiOverlayRaw from './archetypes-mai-overlay.json';
import mrOverlayRaw from './archetypes-mr-overlay.json';

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
const FIELDS = ['name', 'title', 'essence', 'description', 'superpower', 'shadow'] as const;

function applyOverlay(arch: Archetype): Archetype {
  const cloned: Record<string, unknown> = { ...arch };
  for (const field of FIELDS) {
    const ft: Record<string, string> = { ...(arch[field] as Record<string, string>) };
    for (const locale of OVERLAY_LOCALES) {
      if (typeof ft[locale] === 'string' && ft[locale].trim()) continue;
      const overlayVal = OVERLAYS[locale][`${arch.rashiId}.${field}`];
      if (typeof overlayVal === 'string' && overlayVal.trim()) {
        ft[locale] = overlayVal;
      }
    }
    cloned[field] = ft;
  }
  return cloned as unknown as Archetype;
}

export const ARCHETYPES: readonly Archetype[] = RAW_ARCHETYPES.map(applyOverlay);

export function getArchetypeByRashiId(rashiId: number): Archetype | undefined {
  return ARCHETYPES.find((a) => a.rashiId === rashiId);
}

// Matches the existing `getArchetype` helper signature on the bare
// module so consumers can drop-in swap their import path.
export function getArchetype(rashiId: number): Archetype | null {
  return ARCHETYPES.find((a) => a.rashiId === rashiId) ?? null;
}

export type { Archetype } from './archetypes';
