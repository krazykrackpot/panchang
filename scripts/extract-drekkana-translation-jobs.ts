/* eslint-disable no-console */
/**
 * Extract translation jobs from DREKKANA_FACES (36 faces × image +
 * interpretation LocaleText fields) for 7 visible regional locales.
 *
 * Keys: `"<signId>-<decanate>.{image|interpretation}"`.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { DREKKANA_FACES } from '@/lib/constants/drekkana-faces';

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
  const path = join(OVERLAY_DIR, `drekkana-faces-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-drekkana] malformed ${path}`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

for (const face of DREKKANA_FACES) {
  const baseKey = `${face.signId}-${face.decanate}`;
  for (const field of ['image', 'interpretation'] as const) {
    const ft = face[field] as Record<string, string>;
    const enSrc = ft.en;
    if (typeof enSrc !== 'string' || !enSrc.trim()) continue;
    for (const locale of LOCALES) {
      if (typeof ft[locale] === 'string' && ft[locale].trim()) continue;
      const key = `${baseKey}.${field}`;
      if (overlays[locale].has(key)) continue;
      jobs[locale].push({ key, en: enSrc });
    }
  }
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));
