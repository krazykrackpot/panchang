/**
 * Runtime merger that attaches per-locale overlays onto VRAT_KATHAS'
 * LocaleText fields (title, deity, overview, whenObserved, phal, vidhi)
 * and chapters[].title / chapters[].content. Populates ta/te/bn/gu/kn/
 * mai/mr without mutating the source TS.
 *
 * `samagri` arrays stay en+hi only — their `{en: string[], hi: string[]}`
 * shape is not LocaleText. Same shape as kathaUrl + relatedAartis etc.
 *
 * Overlay keys: `"<slug>.<field>"` / `"<slug>.chapters[N].{title|content}"`.
 */
import { VRAT_KATHAS as RAW_VRAT_KATHAS, type VratKatha } from './vrat-kathas';

import taOverlayRaw from './vrat-kathas-ta-overlay.json';
import teOverlayRaw from './vrat-kathas-te-overlay.json';
import bnOverlayRaw from './vrat-kathas-bn-overlay.json';
import guOverlayRaw from './vrat-kathas-gu-overlay.json';
import knOverlayRaw from './vrat-kathas-kn-overlay.json';
import maiOverlayRaw from './vrat-kathas-mai-overlay.json';
import mrOverlayRaw from './vrat-kathas-mr-overlay.json';

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

const SIMPLE_FIELDS = ['title', 'deity', 'overview', 'whenObserved', 'phal', 'vidhi'] as const;

function attach(leaf: Record<string, string>, key: string): Record<string, string> {
  const cloned = { ...leaf };
  for (const locale of OVERLAY_LOCALES) {
    if (typeof cloned[locale] === 'string' && cloned[locale].trim()) continue;
    const v = OVERLAYS[locale][key];
    if (typeof v === 'string' && v.trim()) cloned[locale] = v;
  }
  return cloned;
}

function applyOverlay(vrat: VratKatha): VratKatha {
  const cloned: Record<string, unknown> = { ...vrat };
  for (const field of SIMPLE_FIELDS) {
    const ft = vrat[field] as Record<string, string>;
    cloned[field] = attach(ft, `${vrat.slug}.${field}`);
  }
  if (vrat.chapters) {
    cloned.chapters = vrat.chapters.map((ch, i) => ({
      ...ch,
      title: attach(ch.title as Record<string, string>, `${vrat.slug}.chapters[${i}].title`),
      content: attach(ch.content as Record<string, string>, `${vrat.slug}.chapters[${i}].content`),
    }));
  }
  return cloned as unknown as VratKatha;
}

export const VRAT_KATHAS: readonly VratKatha[] = RAW_VRAT_KATHAS.map(applyOverlay);

export function getVratKatha(slug: string): VratKatha | undefined {
  return VRAT_KATHAS.find((v) => v.slug === slug);
}

export function getAllVratKathaSlugs(): string[] {
  return VRAT_KATHAS.map((v) => v.slug);
}

export function getVratKathaByFestivalSlug(festivalSlug: string): VratKatha | undefined {
  return VRAT_KATHAS.find((v) => v.linkedFestivalSlugs.includes(festivalSlug));
}

export type { VratKatha } from './vrat-kathas';
