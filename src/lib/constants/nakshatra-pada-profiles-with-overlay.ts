/**
 * Runtime merger that attaches per-locale
 * `nakshatra-pada-profiles-{locale}-overlay.json` translations onto the
 * `personality / career / relationships / health` LocaleText fields of
 * NAKSHATRA_PADA_PROFILES (108 padas), populating ta/te/bn/gu/kn/mai/mr
 * without mutating the source TS.
 *
 * Overlay keys: `"<nakshatraId>-<pada>.<field>"` (e.g. `"1-1.personality"`,
 * `"7-3.career"`).
 *
 * Same shape as planet-in-house-verses-with-overlay.ts.
 */

import {
  NAKSHATRA_PADA_PROFILES as RAW_NAKSHATRA_PADA_PROFILES,
  type NakshatraPadaProfile,
} from './nakshatra-pada-profiles';

import taOverlayRaw from './nakshatra-pada-profiles-ta-overlay.json';
import teOverlayRaw from './nakshatra-pada-profiles-te-overlay.json';
import bnOverlayRaw from './nakshatra-pada-profiles-bn-overlay.json';
import guOverlayRaw from './nakshatra-pada-profiles-gu-overlay.json';
import knOverlayRaw from './nakshatra-pada-profiles-kn-overlay.json';
import maiOverlayRaw from './nakshatra-pada-profiles-mai-overlay.json';
import mrOverlayRaw from './nakshatra-pada-profiles-mr-overlay.json';

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
const TRANSLATABLE_FIELDS = ['personality', 'career', 'relationships', 'health'] as const;

function applyOverlay(profile: NakshatraPadaProfile): NakshatraPadaProfile {
  const key = `${profile.nakshatraId}-${profile.pada}`;
  // Shallow-clone the four LocaleText fields so we don't mutate the
  // source constant. Other fields (syllable, deity, element, etc.)
  // pass through by reference.
  const cloned: NakshatraPadaProfile = { ...profile };
  for (const field of TRANSLATABLE_FIELDS) {
    const ft = { ...(profile[field] as Record<string, string>) };
    for (const locale of OVERLAY_LOCALES) {
      if (typeof ft[locale] === 'string' && ft[locale].trim()) continue;
      const overlayVal = OVERLAYS[locale][`${key}.${field}`];
      if (typeof overlayVal === 'string' && overlayVal.trim()) {
        ft[locale] = overlayVal;
      }
    }
    (cloned as unknown as Record<string, unknown>)[field] = ft;
  }
  return cloned;
}

export const NAKSHATRA_PADA_PROFILES: readonly NakshatraPadaProfile[] =
  RAW_NAKSHATRA_PADA_PROFILES.map(applyOverlay);

export type { NakshatraPadaProfile } from './nakshatra-pada-profiles';
