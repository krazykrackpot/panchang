/**
 * Runtime merger for YOGA_PLAIN_NAMES — attaches per-locale plain-name
 * overlays for 7 regional locales and exposes a locale-aware
 * `getYogaPlainName` that replaces the legacy isDevanagariLocale gate.
 *
 * Overlay keys: just the yoga slug (`hamsa`, `gajakesari`, …).
 */
import type { LocaleText } from '@/types/panchang';
import { YOGA_PLAIN_NAMES as RAW_YOGA_PLAIN_NAMES } from './yoga-plain-names';

import taOverlayRaw from './yoga-plain-names-ta-overlay.json';
import teOverlayRaw from './yoga-plain-names-te-overlay.json';
import bnOverlayRaw from './yoga-plain-names-bn-overlay.json';
import guOverlayRaw from './yoga-plain-names-gu-overlay.json';
import knOverlayRaw from './yoga-plain-names-kn-overlay.json';
import maiOverlayRaw from './yoga-plain-names-mai-overlay.json';
import mrOverlayRaw from './yoga-plain-names-mr-overlay.json';

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

// Build a unified Record<slug, LocaleText> from bare en+hi + overlays.
export const YOGA_PLAIN_NAMES: Readonly<Record<string, LocaleText>> = (() => {
  const merged: Record<string, LocaleText> = {};
  for (const [slug, leaf] of Object.entries(RAW_YOGA_PLAIN_NAMES)) {
    const lt: Record<string, string> = { ...leaf };
    for (const locale of OVERLAY_LOCALES) {
      if (typeof lt[locale] === 'string' && lt[locale].trim()) continue;
      const v = OVERLAYS[locale][slug];
      if (typeof v === 'string' && v.trim()) lt[locale] = v;
    }
    merged[slug] = lt as LocaleText;
  }
  return merged;
})();

/**
 * Resolve a yoga's plain-language name in the caller's locale. Falls
 * back to longest-prefix match (yogaId variants like `raja-yoga-10th`
 * → `raja-yoga`) and finally the first sentence of the description.
 *
 * Drop-in replacement for the legacy `getYogaPlainName` in the bare
 * module — same signature, but the `useHindi` gate is replaced with
 * locale-aware lookup so ta/te/bn/gu/kn/mai/mr render in their own
 * scripts instead of falling through to Hindi (mai/mr) or English
 * (ta/te/bn/gu/kn).
 */
export function getYogaPlainName(
  yogaId: string,
  descriptionEn: string,
  locale: string,
): string {
  const pick = (lt: LocaleText): string =>
    (lt as Record<string, string>)[locale] || lt.en;

  // 1. Exact match.
  const plain = YOGA_PLAIN_NAMES[yogaId];
  if (plain) return pick(plain);

  // 2. Longest-prefix-at-word-boundary match.
  let bestKey = '';
  let bestVal: LocaleText | null = null;
  for (const [key, val] of Object.entries(YOGA_PLAIN_NAMES)) {
    if (yogaId === key || (yogaId.startsWith(key) && yogaId[key.length] === '-')) {
      if (key.length > bestKey.length) {
        bestKey = key;
        bestVal = val;
      }
    }
  }
  if (bestVal) return pick(bestVal);

  // 3. Fall back to the first sentence of the EN description.
  // (Mirrors the bare module's behaviour exactly.)
  const firstSentence = descriptionEn.split('.')[0].trim();
  return firstSentence || yogaId;
}
