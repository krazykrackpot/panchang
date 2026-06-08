/* eslint-disable no-console */
/**
 * Extract translation jobs from NAKSHATRA_ACTIVITIES — 27 nakshatras,
 * each with goodFor[] + avoidFor[] LocaleText arrays + a theme LocaleText.
 *
 * Keys:
 *   `${nakshatraId}.theme`
 *   `${nakshatraId}.goodFor[N]`
 *   `${nakshatraId}.avoidFor[N]`
 *
 * Overlay-aware skip — re-runs only emit gaps.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NAKSHATRA_ACTIVITIES } from '@/lib/constants/nakshatra-activities';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];

interface Job {
  key: string;
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `nakshatra-activities-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-nakAct] malformed ${path} — treating as empty`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

function emit(key: string, leaf: Record<string, string>): void {
  const enSrc = leaf.en;
  if (typeof enSrc !== 'string' || !enSrc.trim()) return;
  for (const locale of LOCALES) {
    if (typeof leaf[locale] === 'string' && leaf[locale].trim()) continue;
    if (overlays[locale].has(key)) continue;
    jobs[locale].push({ key, en: enSrc });
  }
}

for (const activity of NAKSHATRA_ACTIVITIES) {
  const baseKey = `${activity.nakshatraId}`;
  emit(`${baseKey}.theme`, activity.theme as Record<string, string>);
  activity.goodFor.forEach((item, i) => {
    emit(`${baseKey}.goodFor[${i}]`, item as Record<string, string>);
  });
  activity.avoidFor.forEach((item, i) => {
    emit(`${baseKey}.avoidFor[${i}]`, item as Record<string, string>);
  });
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));
