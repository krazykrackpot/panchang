/* eslint-disable no-console */
/**
 * Extract translation jobs from GRAHA_SHANTI (9 planets × ~10 LocaleText
 * fields including nested mantra.meaning) for 7 visible regional locales.
 *
 * Keys: `"<planetId>.<field>"` (e.g. `"0.deity"`, `"0.mantra.meaning"`).
 *
 * Sacred mantra.text (Devanagari) stays AS-IS.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { GRAHA_SHANTI } from '@/lib/constants/graha-shanti';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
const SIMPLE_FIELDS = ['deity', 'gemstone', 'metal', 'day', 'color', 'grain', 'flower', 'direction', 'fastNote'] as const;

interface Job {
  key: string;
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `graha-shanti-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-gs] malformed ${path}`);
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

for (const gs of GRAHA_SHANTI) {
  const baseKey = `${gs.planetId}`;
  for (const field of SIMPLE_FIELDS) {
    emit(`${baseKey}.${field}`, gs[field] as Record<string, string>);
  }
  emit(`${baseKey}.mantra.meaning`, gs.mantra.meaning as Record<string, string>);
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));
