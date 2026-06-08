/**
 * Runtime merger for city-festival-context — attaches per-locale
 * overlays for 7 regional locales to the 150 (festival × city)
 * paragraphs.
 *
 * Overlay keys: `"<festivalSlug>:<citySlug>"`.
 */
import { getCityFestivalContext as rawGetCityFestivalContext } from './city-festival-context';

import taOverlayRaw from './city-festival-context-ta-overlay.json';
import teOverlayRaw from './city-festival-context-te-overlay.json';
import bnOverlayRaw from './city-festival-context-bn-overlay.json';
import guOverlayRaw from './city-festival-context-gu-overlay.json';
import knOverlayRaw from './city-festival-context-kn-overlay.json';
import maiOverlayRaw from './city-festival-context-mai-overlay.json';
import mrOverlayRaw from './city-festival-context-mr-overlay.json';

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

/**
 * LocaleText-shaped context — same fields as the bare module's
 * CityFestivalContext but with 7 more locale keys populated.
 * Returns null when no entry exists for the (festivalSlug, citySlug)
 * pair, matching the bare API.
 */
export interface LocalizedCityFestivalContext {
  en: string;
  hi: string;
  ta?: string;
  te?: string;
  bn?: string;
  gu?: string;
  kn?: string;
  mai?: string;
  mr?: string;
}

export function getCityFestivalContext(
  festivalSlug: string,
  citySlug: string,
): LocalizedCityFestivalContext | null {
  const raw = rawGetCityFestivalContext(festivalSlug, citySlug);
  if (!raw) return null;
  const out: LocalizedCityFestivalContext = { ...raw };
  const key = `${festivalSlug}:${citySlug}`;
  for (const locale of OVERLAY_LOCALES) {
    if (typeof (out as unknown as Record<string, string>)[locale] === 'string' && (out as unknown as Record<string, string>)[locale].trim()) continue;
    const v = OVERLAYS[locale][key];
    if (typeof v === 'string' && v.trim()) {
      (out as unknown as Record<string, string>)[locale] = v;
    }
  }
  return out;
}
