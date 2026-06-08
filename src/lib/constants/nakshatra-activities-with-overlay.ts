/**
 * Runtime merger that attaches per-locale
 * `nakshatra-activities-{locale}-overlay.json` translations onto
 * NAKSHATRA_ACTIVITIES' `theme` / `goodFor[]` / `avoidFor[]` LocaleText
 * fields, populating ta/te/bn/gu/kn/mai/mr without mutating source.
 *
 * Overlay keys:
 *   `"<nakshatraId>.theme"`
 *   `"<nakshatraId>.goodFor[N]"`
 *   `"<nakshatraId>.avoidFor[N]"`
 *
 * Consumers: switch
 *   import { NAKSHATRA_ACTIVITIES, getNakshatraActivity } from '@/lib/constants/nakshatra-activities'
 * to
 *   import { NAKSHATRA_ACTIVITIES, getNakshatraActivity } from '@/lib/constants/nakshatra-activities-with-overlay'
 */

import {
  NAKSHATRA_ACTIVITIES as RAW_NAKSHATRA_ACTIVITIES,
  type NakshatraActivity,
} from './nakshatra-activities';

import taOverlayRaw from './nakshatra-activities-ta-overlay.json';
import teOverlayRaw from './nakshatra-activities-te-overlay.json';
import bnOverlayRaw from './nakshatra-activities-bn-overlay.json';
import guOverlayRaw from './nakshatra-activities-gu-overlay.json';
import knOverlayRaw from './nakshatra-activities-kn-overlay.json';
import maiOverlayRaw from './nakshatra-activities-mai-overlay.json';
import mrOverlayRaw from './nakshatra-activities-mr-overlay.json';

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
    const overlayVal = OVERLAYS[locale][key];
    if (typeof overlayVal === 'string' && overlayVal.trim()) {
      cloned[locale] = overlayVal;
    }
  }
  return cloned;
}

function applyOverlay(activity: NakshatraActivity): NakshatraActivity {
  const baseKey = `${activity.nakshatraId}`;
  return {
    ...activity,
    theme: attach(activity.theme as Record<string, string>, `${baseKey}.theme`) as NakshatraActivity['theme'],
    goodFor: activity.goodFor.map((item, i) =>
      attach(item as Record<string, string>, `${baseKey}.goodFor[${i}]`) as NakshatraActivity['goodFor'][number],
    ),
    avoidFor: activity.avoidFor.map((item, i) =>
      attach(item as Record<string, string>, `${baseKey}.avoidFor[${i}]`) as NakshatraActivity['avoidFor'][number],
    ),
  };
}

export const NAKSHATRA_ACTIVITIES: readonly NakshatraActivity[] =
  RAW_NAKSHATRA_ACTIVITIES.map(applyOverlay);

const BY_ID: Map<number, NakshatraActivity> = new Map(
  NAKSHATRA_ACTIVITIES.map((a) => [a.nakshatraId, a]),
);

export function getNakshatraActivity(nakshatraId: number): NakshatraActivity | undefined {
  return BY_ID.get(nakshatraId);
}

export type { NakshatraActivity } from './nakshatra-activities';
