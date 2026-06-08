/**
 * Runtime merger for GLOSSARY — wraps the plain-string fields
 * (shortDef, fullDef, westernEquivalent) as LocaleText with all 9
 * locale keys populated.
 *
 * The bare module's `GlossaryEntry` has these as plain strings; this
 * module exports `LocalizedGlossaryEntry` with them as LocaleText.
 * Consumers switch import to read the LocaleText shape directly.
 *
 * Overlay keys: `"<id>.{shortDef|fullDef|westernEquivalent}"`.
 */
import type { LocaleText } from '@/types/panchang';
import { GLOSSARY as RAW_GLOSSARY, type GlossaryEntry } from './glossary';

import taOverlayRaw from './glossary-ta-overlay.json';
import teOverlayRaw from './glossary-te-overlay.json';
import bnOverlayRaw from './glossary-bn-overlay.json';
import guOverlayRaw from './glossary-gu-overlay.json';
import knOverlayRaw from './glossary-kn-overlay.json';
import maiOverlayRaw from './glossary-mai-overlay.json';
import mrOverlayRaw from './glossary-mr-overlay.json';

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

export interface LocalizedGlossaryEntry {
  id: string;
  term: LocaleText;
  pronunciation: string;
  shortDef: LocaleText;
  fullDef: LocaleText;
  westernEquivalent?: LocaleText;
  category: GlossaryEntry['category'];
  relatedTerms: string[];
  seeAlso?: string;
}

function wrapWithOverlay(id: string, field: string, en: string): LocaleText {
  const lt: Record<string, string> = { en };
  for (const locale of OVERLAY_LOCALES) {
    const v = OVERLAYS[locale][`${id}.${field}`];
    if (typeof v === 'string' && v.trim()) lt[locale] = v;
  }
  return lt as LocaleText;
}

function localize(entry: GlossaryEntry): LocalizedGlossaryEntry {
  return {
    id: entry.id,
    term: entry.term,
    pronunciation: entry.pronunciation,
    shortDef: wrapWithOverlay(entry.id, 'shortDef', entry.shortDef),
    fullDef: wrapWithOverlay(entry.id, 'fullDef', entry.fullDef),
    westernEquivalent: entry.westernEquivalent
      ? wrapWithOverlay(entry.id, 'westernEquivalent', entry.westernEquivalent)
      : undefined,
    category: entry.category,
    relatedTerms: entry.relatedTerms,
    seeAlso: entry.seeAlso,
  };
}

export const GLOSSARY: readonly LocalizedGlossaryEntry[] = RAW_GLOSSARY.map(localize);

export function getGlossaryEntry(id: string): LocalizedGlossaryEntry | undefined {
  return GLOSSARY.find((e) => e.id === id);
}
