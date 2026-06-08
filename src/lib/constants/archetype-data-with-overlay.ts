/**
 * Runtime wrap + overlay layer for archetype-data — the
 * cosmic-blueprint engine's data source.
 *
 * The bare module's plain-string fields (coreDescription, blindSpot,
 * shadowDescription, growthArea, chapterDescription) + string-array
 * fields (traits[], chapterThemes[]) + plain-string lookup maps
 * (YOGA_PSYCH_INSIGHTS, LAGNA_MODIFIERS) are all wrapped to LocaleText
 * here, with overlay JSONs supplying ta/te/bn/gu/kn/mai/mr.
 *
 * Overlay key format:
 *   `archetype.<planetId>.{coreDescription|blindSpot|shadowDescription|growthArea|chapterDescription}`
 *   `archetype.<planetId>.traits[N]`
 *   `archetype.<planetId>.chapterThemes[N]`
 *   `yoga.<yogaId>`
 *   `lagna.<rashiId>`
 *
 * Engine consumes the localized shape via `generateCosmicBlueprint(input, locale)`.
 */
import type { LocaleText } from '@/types/panchang';
import {
  ARCHETYPES as RAW_ARCHETYPES,
  YOGA_PSYCH_INSIGHTS as RAW_YOGA_PSYCH_INSIGHTS,
  LAGNA_MODIFIERS as RAW_LAGNA_MODIFIERS,
  type ArchetypeDefinition,
  type ArchetypeId,
} from './archetype-data';

import taOverlayRaw from './archetype-data-ta-overlay.json';
import teOverlayRaw from './archetype-data-te-overlay.json';
import bnOverlayRaw from './archetype-data-bn-overlay.json';
import guOverlayRaw from './archetype-data-gu-overlay.json';
import knOverlayRaw from './archetype-data-kn-overlay.json';
import maiOverlayRaw from './archetype-data-mai-overlay.json';
import mrOverlayRaw from './archetype-data-mr-overlay.json';

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

export interface LocalizedArchetypeDefinition {
  id: ArchetypeId;
  name: LocaleText;
  planetId: number;
  coreDescription: LocaleText;
  traits: LocaleText[];
  blindSpot: LocaleText;
  shadowDescription: LocaleText;
  growthArea: LocaleText;
  chapterDescription: LocaleText;
  chapterThemes: LocaleText[];
}

function wrap(en: string, key: string): LocaleText {
  const lt: Record<string, string> = { en };
  for (const locale of OVERLAY_LOCALES) {
    const v = OVERLAYS[locale][key];
    if (typeof v === 'string' && v.trim()) lt[locale] = v;
  }
  return lt as LocaleText;
}

function localize(planetIdStr: string, raw: ArchetypeDefinition): LocalizedArchetypeDefinition {
  const base = `archetype.${planetIdStr}`;
  return {
    id: raw.id,
    name: raw.name,
    planetId: raw.planetId,
    coreDescription: wrap(raw.coreDescription, `${base}.coreDescription`),
    traits: raw.traits.map((t, i) => wrap(t, `${base}.traits[${i}]`)),
    blindSpot: wrap(raw.blindSpot, `${base}.blindSpot`),
    shadowDescription: wrap(raw.shadowDescription, `${base}.shadowDescription`),
    growthArea: wrap(raw.growthArea, `${base}.growthArea`),
    chapterDescription: wrap(raw.chapterDescription, `${base}.chapterDescription`),
    chapterThemes: raw.chapterThemes.map((t, i) => wrap(t, `${base}.chapterThemes[${i}]`)),
  };
}

export const ARCHETYPES: Readonly<Record<number, LocalizedArchetypeDefinition>> = (() => {
  const out: Record<number, LocalizedArchetypeDefinition> = {};
  for (const [planetIdStr, raw] of Object.entries(RAW_ARCHETYPES)) {
    out[Number(planetIdStr)] = localize(planetIdStr, raw);
  }
  return out;
})();

export const YOGA_PSYCH_INSIGHTS: Readonly<Record<string, LocaleText>> = (() => {
  const out: Record<string, LocaleText> = {};
  for (const [yogaId, text] of Object.entries(RAW_YOGA_PSYCH_INSIGHTS)) {
    out[yogaId] = wrap(text, `yoga.${yogaId}`);
  }
  return out;
})();

export const LAGNA_MODIFIERS: Readonly<Record<number, LocaleText>> = (() => {
  const out: Record<number, LocaleText> = {};
  for (const [rashiIdStr, text] of Object.entries(RAW_LAGNA_MODIFIERS)) {
    out[Number(rashiIdStr)] = wrap(text, `lagna.${rashiIdStr}`);
  }
  return out;
})();

export type { ArchetypeId } from './archetype-data';
