/**
 * Runtime wrap + overlay layer for ASHRAMS — exposes a fully
 * locale-aware shape (LocalizedAshramInfo) on top of the bare
 * flat-keyed (nameEn/Hi/Sa, descriptionEn/Hi) source.
 *
 * Why a wrap layer instead of refactoring the source:
 * The bare module's `nameEn / nameHi / nameSa` flat keys + flat
 * `descriptionEn / descriptionHi` are baked into one helper
 * (getAshram) and likely other implicit reads. Wrapping leaves the
 * raw shape untouched while exposing a clean LocaleText-typed shape
 * for consumers.
 *
 * Overlay keys: `"<id>.description"` and `"<id>.focusAreas[N]"`.
 * Ashram names (4 short proper nouns) are inlined as LocaleText in
 * this module rather than via overlay — they're stable transliterations.
 */
import type { LocaleText } from '@/types/panchang';
import { ASHRAMS as RAW_ASHRAMS, getAshram as rawGetAshram, type AshramInfo } from './ashram-data';

import taOverlayRaw from './ashram-data-ta-overlay.json';
import teOverlayRaw from './ashram-data-te-overlay.json';
import bnOverlayRaw from './ashram-data-bn-overlay.json';
import guOverlayRaw from './ashram-data-gu-overlay.json';
import knOverlayRaw from './ashram-data-kn-overlay.json';
import maiOverlayRaw from './ashram-data-mai-overlay.json';
import mrOverlayRaw from './ashram-data-mr-overlay.json';

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

export interface LocalizedAshramInfo {
  id: string;
  name: LocaleText;
  ageMin: number;
  ageMax: number;
  description: LocaleText;
  focusAreas: LocaleText[];
}

// Stable 9-locale transliterations of the 4 ashram names. Short
// proper nouns — sized to inline rather than overlay-jsonify.
const ASHRAM_NAMES: Record<string, LocaleText> = {
  brahmacharya: {
    en: 'Brahmacharya', hi: 'ब्रह्मचर्य', sa: 'ब्रह्मचर्यम्',
    ta: 'பிரம்மசரியம்', te: 'బ్రహ్మచర్యం', bn: 'ব্রহ্মচর্য',
    gu: 'બ્રહ્મચર્ય', kn: 'ಬ್ರಹ್ಮಚರ್ಯ', mai: 'ब्रह्मचर्य', mr: 'ब्रह्मचर्य',
  },
  grihastha: {
    en: 'Grihastha', hi: 'गृहस्थ', sa: 'गृहस्थम्',
    ta: 'கிருஹஸ்தம்', te: 'గృహస్థం', bn: 'গৃহস্থ',
    gu: 'ગૃહસ્થ', kn: 'ಗೃಹಸ್ಥ', mai: 'गृहस्थ', mr: 'गृहस्थ',
  },
  vanaprastha: {
    en: 'Vanaprastha', hi: 'वानप्रस्थ', sa: 'वानप्रस्थम्',
    ta: 'வானப்ரஸ்தம்', te: 'వానప్రస్థం', bn: 'বানপ্রস্থ',
    gu: 'વાનપ્રસ્થ', kn: 'ವಾನಪ್ರಸ್ಥ', mai: 'वानप्रस्थ', mr: 'वानप्रस्थ',
  },
  sannyasa: {
    en: 'Sannyasa', hi: 'संन्यास', sa: 'संन्यासम्',
    ta: 'சந்நியாசம்', te: 'సన్యాసం', bn: 'সন্ন্যাস',
    gu: 'સંન્યાસ', kn: 'ಸನ್ಯಾಸ', mai: 'संन्यास', mr: 'संन्यास',
  },
};

function wrapDescription(id: string, en: string, hi: string): LocaleText {
  const lt: Record<string, string> = { en, hi };
  for (const locale of OVERLAY_LOCALES) {
    const v = OVERLAYS[locale][`${id}.description`];
    if (typeof v === 'string' && v.trim()) lt[locale] = v;
  }
  return lt as LocaleText;
}

function wrapFocus(id: string, idx: number, raw: { en: string; hi: string }): LocaleText {
  const lt: Record<string, string> = { ...raw };
  for (const locale of OVERLAY_LOCALES) {
    if (typeof lt[locale] === 'string' && lt[locale].trim()) continue;
    const v = OVERLAYS[locale][`${id}.focusAreas[${idx}]`];
    if (typeof v === 'string' && v.trim()) lt[locale] = v;
  }
  return lt as LocaleText;
}

function localize(raw: AshramInfo): LocalizedAshramInfo {
  return {
    id: raw.id,
    name: ASHRAM_NAMES[raw.id] ?? { en: raw.nameEn, hi: raw.nameHi, sa: raw.nameSa },
    ageMin: raw.ageMin,
    ageMax: raw.ageMax,
    description: wrapDescription(raw.id, raw.descriptionEn, raw.descriptionHi),
    focusAreas: raw.focusAreas.map((fa, i) => wrapFocus(raw.id, i, fa)),
  };
}

export const ASHRAMS: readonly LocalizedAshramInfo[] = RAW_ASHRAMS.map(localize);

export function getAshram(birthDate: string): LocalizedAshramInfo {
  // Defer age-bucket logic to the bare helper, then localize the result.
  const raw = rawGetAshram(birthDate);
  return localize(raw);
}
